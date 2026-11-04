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
const {
  montarTraducao,
  montarContextoGlossario,
  montarLotesParaTraducao,
  LIMITE_SAP
} = require('./processadorTexto');
const { sugerirCorrecaoGrafia } = require('./correcoesOrtograficas');
const { indices } = require('./tabelaMestra');

/* ==================== Configuração (toda por variável de ambiente) ==================== */

// ES = espanhol neutro (decisão de 23/10/2026), montado pela tabela como o EN.
const IDIOMAS_ACEITOS = ['EN', 'EN-US', 'EN-GB', 'ES'];

function lerConfiguracao(env = process.env) {
  const numero = (valor, padrao) => {
    const n = Number(valor);
    return Number.isFinite(n) && n > 0 ? n : padrao;
  };
  const deeplApiKey = env.DEEPL_API_KEY || '';
  return {
    host: env.HOST || '127.0.0.1',
    porta: numero(env.PORT, 3000),
    // 'tabela' (padrão): a frase é montada pela tabela mestra e só o que ela não cobre vai à
    // DeepL. 'deepl': tudo vai à DeepL (comparação de qualidade); a tabela fica como fallback.
    motorPrincipal: env.MOTOR_PRINCIPAL === 'deepl' ? 'deepl' : 'tabela',
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
        // O detalhe do parser não vai para o cliente (não expor detalhe interno).
        reject(new ErroHttp(400, 'Corpo da requisição não é JSON válido.'));
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
  // A descrição original segue inteira para a DeepL, que traduz PT→EN ou PT→ES e pode
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

// Pares PT = tradução usados na montagem, sem repetição: { pt, en } no inglês, { pt, es } no espanhol.
function termosAplicados(montado) {
  const vistos = new Set();
  return montado.termos
    .map(t => (t.es !== undefined ? { pt: t.pt, es: t.es } : { pt: t.pt, en: t.en }))
    .filter(par => {
      const chave = `${par.pt}|${par.es ?? par.en}`;
      return !vistos.has(chave) && vistos.add(chave);
    });
}

const normalizarPalavras = texto => String(texto ?? '')
  .toUpperCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Z0-9]+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean);

// Palavras que nomeiam uma peça: se a DeepL trouxer uma que a tabela não mandou (PANTS em
// CALÇA JEANS), é revisão. No inglês é a última palavra do EN dos índices de peça, mais as
// fusões; no espanhol a peça vem primeiro (FALDA CORTA, PANTALÓN PIJAMA).
const indicesDePeca = new Set([1, 15, 16]);
const termosDePeca = indices.filter(i => indicesDePeca.has(i.id)).flatMap(i => i.termos);
// No ES entra também o plural (a DeepL escreve PANTALONES JEANS) e a parte depois do hífen
// (T-SHIRT → SHIRT). Ficam de fora palavras de peça que em espanhol são comuns sem ser a peça
// (TIRANTES = alças, COPA = bojo, MEDIA = média, BABY de BABY LOOK), que dariam falso "peça a mais".
const NAO_CONTAM_COMO_PECA_ES = new Set(['TIRANTES', 'COPA', 'MEDIA', 'BABY']);
const pluralES = palavra => (/[AEIOU]$/.test(palavra) ? `${palavra}S` : `${palavra}ES`);
const PALAVRAS_DE_PECA = {
  EN: new Set([...termosDePeca.map(t => normalizarPalavras(t.en).at(-1)), 'JEANS', 'JORTS', 'SWEATPANTS'].filter(Boolean)),
  ES: new Set(termosDePeca
    .filter(t => t.es && t.es.classe === 'peca')
    .map(t => normalizarPalavras(t.es.texto.split(' ')[0]).at(-1))
    .filter(palavra => palavra && palavra.length > 2 && !NAO_CONTAM_COMO_PECA_ES.has(palavra))
    .flatMap(palavra => [palavra, pluralES(palavra)]))
};
// Conectivos não contam na conferência: a estrutura é a dos termos. No ES, SIN e CON contam,
// porque o sentido de termos fechados mora neles (SIN MANGAS, SIN TIRANTES, CON CAPUCHA).
const CONECTIVOS_IGNORADOS = {
  EN: new Set(['WITH', 'AND', 'WITHOUT']),
  ES: new Set(['Y', 'E', 'DE', 'EN', 'EL', 'LA', 'LOS', 'LAS', 'A', 'PARA'])
};
const chaveIdioma = idioma => (String(idioma).toUpperCase().startsWith('ES') ? 'ES' : 'EN');

// Validador de estrutura da tradução vinda da DeepL. Três checagens, nesta ordem:
// 1. toda palavra que a tabela mandaria está lá (MID-RISE → MID e RISE; "MID-WAIST" deixa
//    RISE faltando), respeitando repetições (SHORT SLEEVE SHORT DRESS precisa de dois SHORT);
// 2. nenhuma palavra de peça a mais (XYZ JEANS PANTS);
// 3. a ordem das palavras da tabela se mantém (subsequência): a estrutura é a combinada.
// Palavras fora da tabela e conectivos (WITH, AND, WITHOUT; CON, Y, SIN, DE...) não contam.
function validarEstrutura(traducao, montado, idioma = 'EN') {
  if (!montado.termos.length) return { ok: true, motivo: '' };
  const ignorar = CONECTIVOS_IGNORADOS[chaveIdioma(idioma)];
  const pecas = PALAVRAS_DE_PECA[chaveIdioma(idioma)];
  const desconhecidas = new Set(montado.desconhecidas.flatMap(normalizarPalavras));
  const esperadas = normalizarPalavras(montado.traducao).filter(p => !ignorar.has(p) && !desconhecidas.has(p));
  const presentes = normalizarPalavras(traducao);

  const sobra = new Map();
  for (const p of presentes) sobra.set(p, (sobra.get(p) || 0) + 1);
  const faltantes = [];
  for (const p of esperadas) {
    if ((sobra.get(p) || 0) > 0) sobra.set(p, sobra.get(p) - 1);
    else faltantes.push(p);
  }
  if (faltantes.length) return { ok: false, motivo: `glossário não aplicado: ${[...new Set(faltantes)].join(', ')}` };

  const esperadasSet = new Set(esperadas);
  const pecaAMais = presentes.filter(p => pecas.has(p) && !esperadasSet.has(p) && !desconhecidas.has(p));
  if (pecaAMais.length) return { ok: false, motivo: `peça a mais: ${[...new Set(pecaAMais)].join(', ')}` };

  let cursor = 0;
  for (const p of presentes) if (cursor < esperadas.length && p === esperadas[cursor]) cursor += 1;
  if (cursor < esperadas.length) return { ok: false, motivo: `ordem diferente da estrutura (tabela: ${montado.traducao})` };

  return { ok: true, motivo: '' };
}

function descreverMontagem(montado) {
  if (montado.estado === 'desconhecida') return `palavras fora da tabela: ${montado.desconhecidas.join(', ')}`;
  if (montado.estado === 'varias-pecas') return 'mais de uma peça na descrição';
  if (montado.estado === 'sem-peca') return 'nenhuma peça identificada';
  return '';
}

// Decide o estado de uma tradução vinda da DeepL. Mais de uma peça ou nenhuma peça na
// descrição sempre pede revisão humana, mesmo que a DeepL tenha respondido bem.
function avaliarDeepL(traducao, montado, idioma) {
  const validacao = validarEstrutura(traducao, montado, idioma);
  if (!validacao.ok) return { estado: 'revisar', motivo: validacao.motivo };
  if (montado.estado === 'varias-pecas' || montado.estado === 'sem-peca') return { estado: 'revisar', motivo: descreverMontagem(montado) };
  if (traducao.length > LIMITE_SAP) return { estado: 'acima-de-40', motivo: descreverMontagem(montado) };
  return { estado: 'deepl', motivo: descreverMontagem(montado) };
}

/**
 * Serviço de tradução. Motor principal 'tabela' (padrão): a frase é montada pela tabela
 * mestra e só o que ela não cobre vai à DeepL, validado na volta. Motor 'deepl': tudo vai à
 * DeepL (útil para comparar qualidade); a tabela fica como fallback.
 */
function criarServicoTraducao({ traduzirRemoto, limitador, tamanhoLote, motorPrincipal = 'tabela', registrar }) {
  const resolvePelaTabela = montado => motorPrincipal === 'tabela' && (montado.estado === 'tabela' || montado.estado === 'acima-de-40');

  // O catch só envolve a chamada externa: qualquer outro erro é bug nosso e deve
  // aparecer como 500, não como "a DeepL falhou".
  async function traduzirUm(textoPT, idioma) {
    const montado = montarTraducao(textoPT, idioma);
    const termos = termosAplicados(montado);
    if (resolvePelaTabela(montado)) {
      return { traducao: montado.traducao, origem: 'tabela', estado: montado.estado, motivo: '', termos, desconhecidas: [] };
    }

    const contexto = montarContextoGlossario([textoPT], idioma);
    try {
      const [traducao] = await limitador(() => traduzirRemoto([textoPT], idioma, contexto), { prioritaria: true });
      const { estado, motivo } = avaliarDeepL(traducao, montado, idioma);
      return { traducao, origem: 'deepl', estado, motivo, termos, desconhecidas: montado.desconhecidas, sugestaoTabela: montado.traducao };
    } catch (erro) {
      if (!(erro instanceof ErroDeepL)) throw erro;
      registrar('aviso', 'deepl.falha', { mensagem: erro.message, detalhe: erro.detalhe });
      return {
        traducao: montado.traducao, origem: 'local', estado: 'revisar',
        motivo: `DeepL falhou (${erro.message}); ${descreverMontagem(montado) || 'montada pela tabela'}`,
        erro: erro.message, termos, desconhecidas: montado.desconhecidas
      };
    }
  }

  // Em massa: cada descrição é montada pela tabela; só as que ela não cobre vão à DeepL,
  // em lotes de `tamanhoLote` processados em paralelo dentro do limite do servidor.
  // Fallback local por lote; após erro fatal os lotes seguintes vão direto ao motor local.
  // `sinal` (AbortSignal): cliente desistiu, lotes que não começaram são pulados.
  async function traduzirLote(textos, idioma, sinal) {
    const traducoes = new Array(textos.length);
    const origens = new Array(textos.length);
    const estados = new Array(textos.length);
    const motivos = new Array(textos.length);
    const montados = textos.map(texto => montarTraducao(texto, idioma));
    const erros = [];
    const anotarErro = mensagem => { if (!erros.includes(mensagem)) erros.push(mensagem); };

    const posicoesDeepL = [];
    montados.forEach((montado, posicao) => {
      if (resolvePelaTabela(montado)) {
        traducoes[posicao] = montado.traducao;
        origens[posicao] = 'tabela';
        estados[posicao] = montado.estado;
        motivos[posicao] = '';
      } else {
        posicoesDeepL.push(posicao);
      }
    });

    const lotes = montarLotesParaTraducao(posicoesDeepL.map(p => textos[p]), idioma, { tamanhoMaximo: tamanhoLote });
    let bloqueio = null;
    let lotesEnviados = 0;

    const aplicar = (lote, resultado, origem) => lote.posicoes.forEach((posicoesNoSubconjunto, i) => {
      for (const sub of posicoesNoSubconjunto) {
        const posicao = posicoesDeepL[sub];
        const montado = montados[posicao];
        if (origem === 'deepl') {
          const { estado, motivo } = avaliarDeepL(resultado[i], montado, idioma);
          traducoes[posicao] = resultado[i];
          estados[posicao] = estado;
          motivos[posicao] = motivo;
        } else {
          traducoes[posicao] = montado.traducao;
          estados[posicao] = 'revisar';
          motivos[posicao] = `DeepL falhou; ${descreverMontagem(montado) || 'montada pela tabela'}`;
        }
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
      aplicar(lote, null, 'local');
    };

    await Promise.all(lotes.map(lote => limitador(() => processar(lote))));

    const contar = valor => estados.filter(e => e === valor).length;
    return {
      traducoes,
      origens,
      estados,
      motivos,
      erros,
      estatisticas: {
        descricoes: textos.length,
        distintas: new Set(textos.map(t => String(t).trim().toUpperCase())).size,
        pelaTabela: origens.filter(o => o === 'tabela').length,
        paraDeepL: posicoesDeepL.length,
        lotes: lotes.length,
        lotesEnviados,
        revisar: contar('revisar'),
        acimaDe40: contar('acima-de-40')
      }
    };
  }

  return { traduzirUm, traduzirLote };
}

/* ==================== Glossário (somente leitura) ==================== */

// O espanhol vem da própria tabela mestra (campo es, validado em 29/10/2026); a lista antiga
// do setor (docs/glossario-setor-pt-en-es.tsv) ficou só como registro.
function montarGlossario() {
  return indices.map(indice => ({
    id: indice.id,
    nome: indice.nome,
    termos: indice.termos.map(termo => ({
      pt: termo.pt,
      en: termo.en,
      es: termo.es ? termo.es.texto : '',
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
  const servico = criarServicoTraducao({ traduzirRemoto, limitador, tamanhoLote: config.deeplTamanhoLote, motorPrincipal: config.motorPrincipal, registrar });

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
      deepl: config.deeplApiKey ? 'configurada' : 'ausente (só motor local)',
      motorPrincipal: config.motorPrincipal
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
