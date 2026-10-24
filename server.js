/**
 * server.js
 * API HTTP do MODALIS: tradução individual e em massa, sugestões de grafia e glossário.
 *
 * Organização (de cima para baixo):
 *   configuração por variáveis de ambiente → erros tipados → leitura e validação do
 *   corpo → cliente DeepL → serviço de tradução (DeepL com fallback local) → rotas →
 *   criarServidor() → inicialização (só quando executado diretamente).
 *
 * A validação de certificado TLS fica ligada. Na rede da empresa (inspeção TLS
 * pelo proxy), inicie com `npm start`, que passa `--use-system-ca` ao Node para
 * confiar no repositório de certificados do Windows, onde a CA do proxy está.
 */

require('dotenv').config({ quiet: true });
const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  processarTraducaoLocal,
  montarContextoGlossario,
  montarLotesParaTraducao,
  paresDoGlossario
} = require('./processadorTexto');
const { sugerirCorrecaoGrafia } = require('./correcoesOrtograficas');
const { indices } = require('./tabelaMestra');

/* ==================== Configuração (toda por variável de ambiente) ==================== */

const IDIOMAS_ACEITOS = ['EN', 'EN-US', 'EN-GB'];

function lerConfiguracao(env = process.env) {
  const numero = (valor, padrao) => {
    const n = Number(valor);
    return Number.isFinite(n) && n > 0 ? n : padrao;
  };
  const deeplApiKey = env.DEEPL_API_KEY || '';
  return {
    host: env.HOST || '127.0.0.1',
    porta: numero(env.PORT, 3000),
    deeplApiKey,
    // Chave terminada em ":fx" é do plano Free, que usa outro endpoint.
    deeplUrl: deeplApiKey.endsWith(':fx')
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate',
    deeplTimeoutMs: numero(env.DEEPL_TIMEOUT_MS, 15000),
    // A API aceita até 50 textos por chamada, mas o `context` perde força conforme o lote
    // cresce (medido em 23/10/2026: 87% de obediência ao glossário com 1 descrição por
    // chamada, 68% com 50). Enquanto o glossário nativo da DeepL não existir, o padrão é 1.
    deeplTamanhoLote: Math.min(50, numero(env.DEEPL_TAMANHO_LOTE, 1)),
    deeplChamadasSimultaneas: numero(env.DEEPL_CHAMADAS_SIMULTANEAS, 3),
    deeplTentativas: numero(env.DEEPL_TENTATIVAS, 3),
    deeplEsperaRetryMs: numero(env.DEEPL_ESPERA_RETRY_MS, 1000),
    // Disjuntor: depois de N tentativas falhas seguidas, a DeepL fica suspensa por um tempo
    // e os lotes caem no motor local na hora, em vez de cada um repetir as esperas.
    deeplFalhasSeguidas: numero(env.DEEPL_FALHAS_SEGUIDAS, 9),
    deeplCircuitoAbertoMs: numero(env.DEEPL_CIRCUITO_ABERTO_MS, 30000),
    // 429 ("muitas requisições") não é queda: é a DeepL pedindo para ir mais devagar. O
    // servidor inteiro pausa (2 s, 4 s, ... até 30 s) e tenta de novo; só depois de
    // `deeplPaciencia429Ms` sem nenhum sucesso o restante vai para o motor local.
    deeplPausa429Ms: numero(env.DEEPL_PAUSA_429_MS, 2000),
    deeplPausaMaxima429Ms: numero(env.DEEPL_PAUSA_MAXIMA_429_MS, 30000),
    deeplPaciencia429Ms: numero(env.DEEPL_PACIENCIA_429_MS, 120000),
    limiteCorpoBytes: numero(env.MAX_CORPO_BYTES, 1000000),
    maxDescricoesLote: numero(env.MAX_DESCRICOES_LOTE, 10000),
    maxCaracteresDescricao: numero(env.MAX_CARACTERES_DESCRICAO, 200)
  };
}

/* ==================== Erros tipados ==================== */

// Erro que vira uma resposta HTTP com status e mensagem para o usuário.
class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

// Falha ao chamar a DeepL. `fatal` indica que não adianta tentar de novo no mesmo
// lote (chave inválida, cota esgotada); `repetivel` indica falha passageira (429, 5xx,
// rede, timeout) que merece nova tentativa. `detalhe` fica só no log do servidor.
class ErroDeepL extends Error {
  constructor(mensagem, { status = null, fatal = false, repetivel = false, detalhe = '', retryAfterMs = null } = {}) {
    super(mensagem);
    this.status = status;
    this.fatal = fatal;
    this.repetivel = repetivel;
    this.detalhe = detalhe;
    this.retryAfterMs = retryAfterMs; // só em 429, quando a DeepL manda o cabeçalho Retry-After
  }
}

/* ==================== Log (uma linha JSON por evento, em stdout/stderr) ==================== */

function registrarPadrao(nivel, evento, campos = {}) {
  const linha = JSON.stringify({ ts: new Date().toISOString(), nivel, evento, ...campos });
  if (nivel === 'erro') console.error(linha);
  else if (nivel === 'aviso') console.warn(linha);
  else console.log(linha);
}

/* ==================== Leitura e validação do corpo ==================== */

// Acumula os pedaços como Buffer e decodifica UMA vez: um caractere UTF-8 de dois
// bytes (Ç, Ã, É) pode chegar partido entre dois pedaços, e decodificar pedaço a
// pedaço o corrompe. O limite de bytes é conferido antes de guardar qualquer pedaço.
function lerCorpoJson(req, limiteBytes) {
  return new Promise((resolve, reject) => {
    const partes = [];
    let total = 0;
    let encerrado = false;
    const falhar = (erro) => {
      if (encerrado) return;
      encerrado = true;
      reject(erro);
    };

    req.on('data', (pedaco) => {
      if (encerrado) return;
      total += pedaco.length;
      if (total > limiteBytes) {
        falhar(new ErroHttp(413, `Corpo da requisição acima do limite de ${limiteBytes} bytes (variável MAX_CORPO_BYTES).`));
        return;
      }
      partes.push(pedaco);
    });
    req.on('error', (erro) => falhar(new ErroHttp(400, `Falha ao ler o corpo da requisição: ${erro.message}`)));
    req.on('end', () => {
      if (encerrado) return;
      encerrado = true;
      if (total === 0) {
        reject(new ErroHttp(400, 'Corpo da requisição vazio.'));
        return;
      }
      let corpo;
      try {
        corpo = JSON.parse(Buffer.concat(partes).toString('utf8'));
      } catch (erro) {
        reject(new ErroHttp(400, `Corpo da requisição não é JSON válido: ${erro.message}`));
        return;
      }
      if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
        reject(new ErroHttp(400, 'O corpo da requisição precisa ser um objeto JSON.'));
        return;
      }
      resolve(corpo);
    });
  });
}

function validarDescricao(valor, campo, maxCaracteres) {
  if (typeof valor !== 'string' || !valor.trim()) {
    throw new ErroHttp(400, `O campo ${campo} precisa ser um texto não vazio.`);
  }
  if (valor.length > maxCaracteres) {
    throw new ErroHttp(400, `O campo ${campo} tem ${valor.length} caracteres; o limite é ${maxCaracteres} (variável MAX_CARACTERES_DESCRICAO).`);
  }
  return valor;
}

function validarListaDeTextos(textos, config, { permitirVazio = false } = {}) {
  if (!Array.isArray(textos) || textos.length === 0) {
    throw new ErroHttp(400, 'O campo textos precisa ser uma lista com pelo menos uma descrição.');
  }
  if (textos.length > config.maxDescricoesLote) {
    throw new ErroHttp(400, `Lote com ${textos.length} descrições; o limite atual é ${config.maxDescricoesLote} (variável MAX_DESCRICOES_LOTE).`);
  }
  textos.forEach((texto, i) => {
    if (permitirVazio && typeof texto === 'string' && !texto.trim()) return;
    validarDescricao(texto, `textos[${i}]`, config.maxCaracteresDescricao);
  });
  return textos;
}

function validarIdioma(targetLang) {
  const idioma = String(targetLang ?? '').toUpperCase();
  if (!IDIOMAS_ACEITOS.includes(idioma)) {
    throw new ErroHttp(400, `Idioma de destino não suportado: "${targetLang}". Aceitos: ${IDIOMAS_ACEITOS.join(', ')}.`);
  }
  return idioma;
}

/* ==================== Cliente DeepL ==================== */

const MOTIVOS_DEEPL = {
  401: 'chave inválida',
  403: 'acesso negado',
  429: 'muitas requisições',
  456: 'cota esgotada'
};

function criarClienteDeepL({ apiKey, url, timeoutMs, fetchImpl }) {
  // A descrição original segue inteira para a DeepL, que traduz PT→EN e pode
  // reorganizar a frase. O contexto orienta o vocabulário; não é um glossário nativo.
  return async function traduzir(textos, targetLang, contexto) {
    if (!apiKey) {
      throw new ErroDeepL('Chave da API DeepL não configurada no .env', { fatal: true });
    }
    // source_lang evita que a DeepL "adivinhe" o idioma de descrições curtas (SAIA MIDI
    // chegou a ser lido como tswana, e SHORT JEANS como inglês, e saíam sem tradução).
    const corpo = { text: textos, source_lang: 'PT', target_lang: targetLang.toUpperCase() };
    if (contexto) corpo.context = contexto;

    let resposta;
    try {
      resposta = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(corpo),
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (erro) {
      if (erro && (erro.name === 'TimeoutError' || erro.name === 'AbortError')) {
        throw new ErroDeepL(`DeepL não respondeu em ${timeoutMs / 1000} s`, { repetivel: true, detalhe: erro.message });
      }
      throw new ErroDeepL('Falha de rede ao chamar a DeepL', { repetivel: true, detalhe: erro && erro.message });
    }

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => '');
      const motivo = MOTIVOS_DEEPL[resposta.status] || 'erro no serviço';
      throw new ErroDeepL(`DeepL respondeu ${resposta.status} (${motivo})`, {
        status: resposta.status,
        fatal: [401, 403, 456].includes(resposta.status),
        repetivel: resposta.status === 429 || resposta.status >= 500,
        retryAfterMs: resposta.status === 429 ? lerRetryAfter(resposta) : null,
        detalhe
      });
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch (erro) {
      throw new ErroDeepL('DeepL devolveu uma resposta que não é JSON', { detalhe: erro.message });
    }
    const traducoes = dados && Array.isArray(dados.translations) ? dados.translations : null;
    if (!traducoes || traducoes.length !== textos.length || traducoes.some(item => typeof item?.text !== 'string')) {
      throw new ErroDeepL('DeepL devolveu uma resposta inesperada', { detalhe: JSON.stringify(dados).slice(0, 300) });
    }
    return traducoes.map(item => item.text.toUpperCase());
  };
}

// Cabeçalho Retry-After do 429: segundos ou data HTTP. Devolve milissegundos ou null.
function lerRetryAfter(resposta) {
  const valor = resposta.headers && typeof resposta.headers.get === 'function' ? resposta.headers.get('retry-after') : null;
  if (!valor) return null;
  if (/^\d+$/.test(valor.trim())) return Number(valor) * 1000;
  const quando = Date.parse(valor);
  return Number.isFinite(quando) ? Math.max(0, quando - Date.now()) : null;
}

// Nova tentativa com espera crescente (1 s, 2 s, ...) só para falhas passageiras.
// Erros fatais e de requisição inválida sobem na hora.
//
// Duas falhas, dois remédios:
// - Rede, timeout, 5xx = o serviço não responde: repetir poucas vezes e, após
//   `limiteFalhasSeguidas` falhas seguidas (contador compartilhado por todas as
//   requisições), abrir o DISJUNTOR por `abertoMs`: toda chamada falha na hora e cai no
//   motor local, em vez de cada lote pagar as esperas de novo.
// - 429 = o serviço está de pé e pede para ir mais devagar: FREIO global. Todas as
//   chamadas pausam (`pausa429Ms`, dobrando até `pausaMaxima429Ms`, ou o Retry-After da
//   DeepL) e repetem quantas vezes for preciso. Só depois de `paciencia429Ms` sem nenhum
//   sucesso o circuito abre, com uma mensagem própria. O 429 nunca conta para o disjuntor.
function comNovasTentativas(traduzir, {
  tentativas, esperaBaseMs, limiteFalhasSeguidas = 9, abertoMs = 30000,
  pausa429Ms = 2000, pausaMaxima429Ms = 30000, paciencia429Ms = 120000,
  registrar, agora = () => Date.now()
}) {
  const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));
  let falhasSeguidas = 0;
  let abertoAte = 0;
  let motivoAberto = null;
  let pausaAte = 0;        // até quando ninguém chama a DeepL (freio do 429)
  let pausaAtual = 0;      // duração da pausa vigente; dobra a cada rodada de 429
  let limitadoDesde = 0;   // início da sequência de 429 sem nenhum sucesso

  const abrirCircuito = (erro, mensagem) => {
    abertoAte = agora() + abertoMs;
    motivoAberto = new ErroDeepL(mensagem, { status: erro.status, repetivel: true, detalhe: erro.detalhe });
    registrar('aviso', 'deepl.circuito-aberto', { abertoMs, mensagem });
  };

  return async function traduzirComTentativas(...argumentos) {
    let tentativa = 0;
    for (;;) {
      while (agora() < pausaAte) await esperar(pausaAte - agora());
      if (agora() < abertoAte) throw motivoAberto;
      tentativa += 1;
      try {
        const resultado = await traduzir(...argumentos);
        falhasSeguidas = 0;
        limitadoDesde = 0;
        pausaAtual = 0;
        return resultado;
      } catch (erro) {
        if (!(erro instanceof ErroDeepL) || erro.fatal) throw erro;

        if (erro.status === 429) {
          if (!limitadoDesde) limitadoDesde = agora();
          if (agora() - limitadoDesde >= paciencia429Ms) {
            abrirCircuito(erro, `A DeepL está limitando as chamadas há mais de ${Math.round(paciencia429Ms / 1000)} s; use "Traduzir pendentes" em alguns minutos`);
            throw motivoAberto;
          }
          // Só a primeira chamada a ver o 429 nesta rodada define a pausa; as outras, que
          // falharam ao mesmo tempo, apenas esperam o mesmo instante (sem multiplicar).
          if (agora() >= pausaAte) {
            pausaAtual = erro.retryAfterMs || Math.min(pausaMaxima429Ms, pausaAtual ? pausaAtual * 2 : pausa429Ms);
            const variacao = Math.floor(Math.random() * pausaAtual * 0.25);
            pausaAte = agora() + pausaAtual + variacao;
            registrar('aviso', 'deepl.limite-de-taxa', { pausaMs: pausaAtual + variacao, mensagem: erro.message });
          }
          continue;
        }

        if (erro.repetivel) {
          falhasSeguidas += 1;
          if (falhasSeguidas >= limiteFalhasSeguidas) {
            abrirCircuito(erro, `DeepL indisponível (${erro.message}); novas chamadas suspensas por ${abertoMs / 1000} s`);
          }
        }
        const repetir = erro.repetivel && tentativa < tentativas && agora() >= abertoAte;
        if (!repetir) throw erro;
        const espera = esperaBaseMs * 2 ** (tentativa - 1);
        registrar('aviso', 'deepl.nova-tentativa', { tentativa, proximaEmMs: espera, mensagem: erro.message });
        await esperar(espera);
      }
    }
  };
}

// Limita quantas tarefas rodam ao mesmo tempo. É um só por servidor: o limite é da
// conta DeepL, não de quem chama, então vale para todas as requisições juntas.
function criarLimitador(maximo) {
  let emUso = 0;
  const fila = [];
  const liberar = () => {
    emUso -= 1;
    const proxima = fila.shift();
    if (proxima) proxima();
  };
  // `prioritaria` fura a fila: a tradução individual não espera atrás de um lote em massa.
  return function executar(tarefa, { prioritaria = false } = {}) {
    return new Promise((resolve, reject) => {
      const iniciar = () => {
        emUso += 1;
        Promise.resolve().then(tarefa).then(resolve, reject).finally(liberar);
      };
      if (emUso < maximo) iniciar();
      else if (prioritaria) fila.unshift(iniciar);
      else fila.push(iniciar);
    });
  };
}

/* ==================== Serviço de tradução: DeepL com fallback local ==================== */

function termosAplicados(textoPT, idioma) {
  const vistos = new Set();
  return paresDoGlossario(textoPT, idioma)
    .filter(par => !vistos.has(`${par.pt}|${par.en}`) && vistos.add(`${par.pt}|${par.en}`));
}

function criarServicoTraducao({ traduzirRemoto, limitador, tamanhoLote, registrar }) {
  // O catch só envolve a chamada externa: qualquer outro erro é bug nosso e deve
  // aparecer como 500, não como "a DeepL falhou".
  async function traduzirUm(textoPT, idioma) {
    const contexto = montarContextoGlossario([textoPT], idioma);
    let resposta;
    try {
      const [traducao] = await limitador(() => traduzirRemoto([textoPT], idioma, contexto), { prioritaria: true });
      resposta = { traducao, origem: 'deepl' };
    } catch (erro) {
      if (!(erro instanceof ErroDeepL)) throw erro;
      registrar('aviso', 'deepl.falha', { mensagem: erro.message, detalhe: erro.detalhe });
      resposta = { traducao: processarTraducaoLocal(textoPT, idioma), origem: 'local', erro: erro.message };
    }
    resposta.termos = termosAplicados(textoPT, idioma);
    return resposta;
  }

  // Lotes de até `tamanhoLote` descrições distintas, processados em paralelo dentro do
  // limite do servidor. Fallback local por lote; depois de um erro fatal (chave inválida,
  // cota esgotada) os lotes que ainda não começaram vão direto ao motor local.
  // `sinal` (AbortSignal) é acionado quando o cliente desiste da requisição: os lotes que
  // ainda não começaram são pulados, para não gastar cota com um resultado que ninguém lerá.
  async function traduzirLote(textos, idioma, sinal) {
    const lotes = montarLotesParaTraducao(textos, idioma, { tamanhoMaximo: tamanhoLote });
    const traducoes = new Array(textos.length);
    const origens = new Array(textos.length);
    const erros = [];
    let bloqueio = null;
    let lotesEnviados = 0;

    const anotarErro = mensagem => { if (!erros.includes(mensagem)) erros.push(mensagem); };
    const aplicar = (lote, resultado, origem) => lote.posicoes.forEach((posicoes, i) => {
      for (const posicao of posicoes) {
        traducoes[posicao] = resultado[i];
        origens[posicao] = origem;
      }
    });

    const processar = async lote => {
      if (sinal?.aborted) return;
      if (!bloqueio) {
        try {
          lotesEnviados += 1;
          const resultado = await traduzirRemoto(lote.textos, idioma, lote.contexto);
          aplicar(lote, resultado, 'deepl');
          return;
        } catch (erro) {
          if (!(erro instanceof ErroDeepL)) throw erro;
          registrar('aviso', 'deepl.falha', { mensagem: erro.message, detalhe: erro.detalhe, descricoes: lote.textos.length });
          anotarErro(erro.message);
          if (erro.fatal && !bloqueio) {
            bloqueio = erro.message;
            anotarErro('A DeepL não foi chamada para o restante do lote; ele usou o motor local.');
          }
        }
      }
      aplicar(lote, lote.textos.map(texto => processarTraducaoLocal(texto, idioma)), 'local');
    };

    await Promise.all(lotes.map(lote => limitador(() => processar(lote))));

    return {
      traducoes,
      origens,
      erros,
      estatisticas: {
        descricoes: textos.length,
        distintas: lotes.reduce((soma, lote) => soma + lote.textos.length, 0),
        lotes: lotes.length,
        lotesEnviados
      }
    };
  }

  return { traduzirUm, traduzirLote };
}

/* ==================== Glossário (somente leitura) ==================== */

// Espanhol da lista do setor (PT<TAB>EN<TAB>ES). A tabela mestra ainda não tem ES;
// a aba Glossário mostra o ES do setor quando o PT coincide. Primeira ocorrência vence.
function carregarEspanholDoSetor() {
  const caminho = path.join(__dirname, 'docs', 'glossario-setor-pt-en-es.tsv');
  const espanhol = new Map();
  try {
    for (const linha of fs.readFileSync(caminho, 'utf8').split(/\r?\n/)) {
      const [pt, , es] = linha.split('\t');
      if (pt && es && !espanhol.has(pt.trim())) espanhol.set(pt.trim(), es.trim());
    }
  } catch (erro) {
    registrarPadrao('aviso', 'glossario.es-ausente', { mensagem: erro.message });
  }
  return espanhol;
}

const espanholDoSetor = carregarEspanholDoSetor();

function montarGlossario() {
  return indices.map(indice => ({
    id: indice.id,
    nome: indice.nome,
    termos: indice.termos.map(termo => ({
      pt: termo.pt,
      en: termo.en,
      es: espanholDoSetor.get(termo.pt) || '',
      tipo: termo.tipo,
      contexto: termo.contexto || '',
      status: termo.status
    }))
  }));
}

/* ==================== Rotas ==================== */

// Cada rota recebe o corpo já lido e validado como objeto e devolve o JSON da resposta.
// A validação acontece ANTES de qualquer chamada externa.
const rotas = {
  'POST /api/traduzir': async ({ corpo, config, servico }) => {
    const textoPT = validarDescricao(corpo.textoPT, 'textoPT', config.maxCaracteresDescricao);
    const idioma = validarIdioma(corpo.targetLang);
    return servico.traduzirUm(textoPT, idioma);
  },

  'POST /api/traduzir-massa': async ({ corpo, config, servico, sinal }) => {
    const textos = validarListaDeTextos(corpo.textos, config);
    const idioma = validarIdioma(corpo.targetLang);
    return servico.traduzirLote(textos, idioma, sinal);
  },

  // Sugestões locais de grafia; não chama a DeepL nem altera o texto de origem.
  'POST /api/sugerir-correcoes': ({ corpo, config }) => {
    const textos = validarListaDeTextos(corpo.textos, config, { permitirVazio: true });
    return { sugestoes: textos.map(sugerirCorrecaoGrafia) };
  },

  'GET /api/glossario': () => ({ indices: montarGlossario() })
};

/* ==================== Servidor ==================== */

/**
 * Monta o servidor sem iniciá-lo (quem chama decide a porta). `fetchImpl` e `config`
 * são injetáveis para os testes rodarem sem rede e sem .env.
 */
function criarServidor({ config: configExtra = {}, fetchImpl = fetch, silencioso = false } = {}) {
  const config = { ...lerConfiguracao(), ...configExtra };
  const registrar = silencioso ? () => {} : registrarPadrao;
  const traduzirRemoto = comNovasTentativas(
    criarClienteDeepL({ apiKey: config.deeplApiKey, url: config.deeplUrl, timeoutMs: config.deeplTimeoutMs, fetchImpl }),
    {
      tentativas: config.deeplTentativas,
      esperaBaseMs: config.deeplEsperaRetryMs,
      limiteFalhasSeguidas: config.deeplFalhasSeguidas,
      abertoMs: config.deeplCircuitoAbertoMs,
      pausa429Ms: config.deeplPausa429Ms,
      pausaMaxima429Ms: config.deeplPausaMaxima429Ms,
      paciencia429Ms: config.deeplPaciencia429Ms,
      registrar
    }
  );
  const limitador = criarLimitador(config.deeplChamadasSimultaneas);
  const servico = criarServicoTraducao({ traduzirRemoto, limitador, tamanhoLote: config.deeplTamanhoLote, registrar });

  const servidor = http.createServer(async (req, res) => {
    const inicio = Date.now();
    // CORS aberto enquanto a interface é aberta como arquivo local (pendência conhecida).
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const chave = `${req.method} ${(req.url || '').split('?')[0]}`;
    // Se o cliente desistir (F5, aba fechada) antes da resposta, o trabalho pendente é cancelado.
    const controlador = new AbortController();
    res.on('close', () => { if (!res.writableFinished) controlador.abort(); });
    let status = 200;
    let resposta;
    try {
      const rota = rotas[chave];
      if (!rota) throw new ErroHttp(404, 'Rota não encontrada.');
      const corpo = req.method === 'POST' ? await lerCorpoJson(req, config.limiteCorpoBytes) : null;
      resposta = await rota({ corpo, config, servico, sinal: controlador.signal });
    } catch (erro) {
      status = erro instanceof ErroHttp ? erro.status : 500;
      resposta = { error: status === 500 ? 'Erro interno do servidor.' : erro.message };
      registrar(status === 500 ? 'erro' : 'aviso', 'requisicao.falha', {
        rota: chave, status, mensagem: erro.message, ...(status === 500 ? { stack: erro.stack } : {})
      });
    }

    const corpoResposta = JSON.stringify(resposta);
    const cabecalhos = {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(corpoResposta)
    };
    if (status === 413) cabecalhos.Connection = 'close';
    res.writeHead(status, cabecalhos);
    res.end(corpoResposta);
    registrar('info', 'requisicao', { rota: chave, status, ms: Date.now() - inicio });
  });

  return servidor;
}

/* ==================== Inicialização (só quando executado diretamente) ==================== */

if (require.main === module) {
  const config = lerConfiguracao();
  const servidor = criarServidor();
  servidor.listen(config.porta, config.host, () => {
    registrarPadrao('info', 'servidor.iniciado', {
      host: config.host,
      porta: config.porta,
      deepl: config.deeplApiKey ? 'configurada' : 'ausente (só motor local)'
    });
    console.log(`MODALIS: API em http://${config.host}:${config.porta} (Ctrl+C para parar)`);
  });
  const encerrar = () => {
    registrarPadrao('info', 'servidor.encerrando');
    servidor.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  };
  process.on('SIGINT', encerrar);
  process.on('SIGTERM', encerrar);
}

module.exports = { criarServidor, lerConfiguracao, lerCorpoJson, criarClienteDeepL, criarLimitador, ErroHttp, ErroDeepL };
