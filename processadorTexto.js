/**
 * Matching local da tabela mestra revisada.
 * O processamento é estático e não chama a API DeepL.
 *
 * Tudo que não depende do texto de entrada (chave normalizada e regex de cada termo)
 * é preparado uma vez, no carregamento do módulo. O matching de uma descrição continua
 * O(T·L) para T termos e L caracteres, mas sem renormalizar e recompilar os 805 termos a
 * cada descrição, que era a maior parte do custo (medido: ~21x mais rápido).
 */

const { termosGlossario, expressoesCompostas } = require('./tabelaMestra');

function prepararTextoParaBusca(texto) {
  const originalMaiusculo = String(texto ?? '').toUpperCase();
  const caracteres = [];
  const mapaInicio = [];
  const mapaFim = [];
  let posicaoOriginal = 0;

  for (const caractereOriginal of originalMaiusculo) {
    const inicio = posicaoOriginal;
    const fim = inicio + caractereOriginal.length;
    posicaoOriginal = fim;
    const semAcento = caractereOriginal.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const caractere of semAcento) {
      const normalizado = /[A-Z0-9/]/.test(caractere) ? caractere : ' ';
      const ultimo = caracteres.length - 1;
      if (normalizado === ' ' && ultimo >= 0 && caracteres[ultimo] === ' ') {
        mapaFim[ultimo] = fim;
        continue;
      }
      caracteres.push(normalizado);
      mapaInicio.push(inicio);
      mapaFim.push(fim);
    }
  }

  while (caracteres[0] === ' ') {
    caracteres.shift();
    mapaInicio.shift();
    mapaFim.shift();
  }
  while (caracteres.at(-1) === ' ') {
    caracteres.pop();
    mapaInicio.pop();
    mapaFim.pop();
  }

  return {
    originalMaiusculo,
    normalizado: caracteres.join(''),
    mapaInicio,
    mapaFim
  };
}

function normalizarParaBusca(texto) {
  return prepararTextoParaBusca(texto).normalizado;
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ==================== Preparação dos termos (uma vez por processo) ==================== */

// Cache de chave normalizada e regex por termo. Só termos do glossário e os literais das
// regras de contexto passam por aqui (vocabulário finito); o texto do usuário, nunca.
const cacheTermos = new Map();

function prepararTermo(texto) {
  let preparado = cacheTermos.get(texto);
  if (!preparado) {
    const chave = normalizarParaBusca(texto);
    preparado = {
      chave,
      regex: chave ? new RegExp(`(^|[^A-Z0-9])(${escaparRegex(chave)})(?=$|[^A-Z0-9])`, 'g') : null
    };
    cacheTermos.set(texto, preparado);
  }
  return preparado;
}

// Só termos FECHADO participam do matching; a ordem da tabela é preservada porque os
// empates do sort em listarCorrespondencias dependem dela.
const termosPreparados = termosGlossario
  .filter(termo => termo.status === 'FECHADO')
  .map(termo => ({ termo, ...prepararTermo(termo.pt) }));

function acharOcorrencias(textoNormalizado, regex) {
  if (!regex) return [];
  regex.lastIndex = 0; // a flag g guarda estado entre usos
  const ocorrencias = [];
  let resultado;

  while ((resultado = regex.exec(textoNormalizado)) !== null) {
    const inicio = resultado.index + resultado[1].length;
    ocorrencias.push({ inicio, fim: inicio + resultado[2].length });
  }
  return ocorrencias;
}

function contemTermo(textoNormalizado, termo) {
  return acharOcorrencias(textoNormalizado, prepararTermo(termo).regex).length > 0;
}

/* ==================== Regras de contexto (JEANS / MOLETOM) ==================== */

function escolherContexto(textoNormalizado, termo) {
  if (!termo.contexto) return true;

  const contexto = prepararTermo(termo.contexto).chave;
  const pt = prepararTermo(termo.pt).chave;

  if (pt === 'JEANS') {
    const temPecaCalca = ['CALCA', 'SHORT', 'SHORTS', 'BERMUDA'].some(item => contemTermo(textoNormalizado, item));
    const outrasPecas = ['BLUSA', 'CAMISA', 'T SHIRT', 'CAMISETA', 'JAQUETA', 'SAIA', 'VESTIDO', 'REGATA', 'TOP']
      .some(item => contemTermo(textoNormalizado, item));
    if (contexto === 'CALCA') return false; // As expressões CALÇA JEANS são entradas explícitas.
    if (contexto === 'TECIDO') return !temPecaCalca && outrasPecas;
    return false;
  }

  if (pt === 'MOLETOM') {
    const temCalcaMoletom = contemTermo(textoNormalizado, 'CALCA MOLETOM')
      || contemTermo(textoNormalizado, 'CALCA DE MOLETOM')
      || contemTermo(textoNormalizado, 'MOLETOM CALCA');
    const temCanguru = contemTermo(textoNormalizado, 'MOLETOM CANGURU');
    const temCareca = contemTermo(textoNormalizado, 'MOLETOM CARECA')
      || contemTermo(textoNormalizado, 'MOLETOM GOLA CARECA');
    const outrasPecas = ['BLUSA', 'CAMISA', 'T SHIRT', 'CAMISETA', 'JAQUETA', 'SAIA', 'VESTIDO', 'REGATA', 'TOP']
      .some(item => contemTermo(textoNormalizado, item));

    if (contexto === 'CALCA') return temCalcaMoletom;
    if (contexto === 'CANGURU') return temCanguru;
    if (contexto === 'CARECA') return temCareca;
    if (contexto === 'TECIDO DE OUTRAS PECAS') return outrasPecas && !temCanguru && !temCareca;
  }

  return false;
}

function deveIgnorarTermoGenerico(textoNormalizado, termo) {
  if (prepararTermo(termo.pt).chave !== 'MOLETOM' || termo.contexto) return false;

  const temFormaEspecifica = [
    'CALCA MOLETOM', 'CALCA DE MOLETOM', 'MOLETOM CALCA',
    'MOLETOM CANGURU', 'MOLETOM CARECA', 'MOLETOM GOLA CARECA'
  ].some(item => contemTermo(textoNormalizado, item));
  const temOutraPeca = ['BLUSA', 'CAMISA', 'T SHIRT', 'CAMISETA', 'JAQUETA', 'SAIA', 'VESTIDO', 'REGATA', 'TOP']
    .some(item => contemTermo(textoNormalizado, item));

  return temFormaEspecifica || temOutraPeca;
}

/* ==================== Matching ==================== */

function listarCorrespondencias(textoPT, idiomaDestino = 'EN') {
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';
  if (langKey !== 'EN') return [];

  const preparado = prepararTextoParaBusca(textoPT);
  const textoNormalizado = preparado.normalizado;
  if (!textoNormalizado) return [];

  const candidatas = [];
  for (const { termo, regex } of termosPreparados) {
    if (deveIgnorarTermoGenerico(textoNormalizado, termo) || !escolherContexto(textoNormalizado, termo)) continue;
    for (const ocorrencia of acharOcorrencias(textoNormalizado, regex)) {
      candidatas.push({ ...ocorrencia, termo, textoEncontrado: textoNormalizado.slice(ocorrencia.inicio, ocorrencia.fim) });
    }
  }

  // Expressões mais longas ganham sobre palavras contidas nelas; em empate,
  // prevalece o índice de prioridade menor definido pelo negócio.
  candidatas.sort((a, b) => a.inicio - b.inicio
    || (b.fim - b.inicio) - (a.fim - a.inicio)
    || a.termo.indice - b.termo.indice);

  const selecionadas = [];
  let limite = -1;
  for (const candidata of candidatas) {
    if (candidata.inicio < limite) continue;
    selecionadas.push(candidata);
    limite = candidata.fim;
  }
  return selecionadas;
}

// Pares PT → EN do glossário encontrados numa descrição, na ordem em que aparecem.
function paresDoGlossario(textoPT, idiomaDestino = 'EN') {
  return listarCorrespondencias(textoPT, idiomaDestino).map(({ termo }) => ({ pt: termo.pt, en: termo.en }));
}

function montarContextoDePares(pares) {
  const unicos = new Map();
  for (const { pt, en } of pares) unicos.set(`${pt} → ${en}`, `${pt} = ${en}`);
  if (unicos.size === 0) return '';
  return `Use estas traduções técnicas para os termos encontrados: ${Array.from(unicos.values()).join('; ')}.`;
}

/**
 * Cria um contexto de terminologia para a tradução DeepL das descrições.
 * O contexto orienta a API, mas não é uma garantia de aplicação exata; para isso
 * é necessário configurar um glossário nativo do DeepL com o mesmo conteúdo.
 */
function montarContextoGlossario(textosPT, idiomaDestino = 'EN') {
  if (!idiomaDestino.toUpperCase().startsWith('EN')) return '';
  return montarContextoDePares(textosPT.flatMap(texto => paresDoGlossario(texto, idiomaDestino)));
}

/**
 * Monta os lotes enviados à DeepL. Descrições iguais entram uma vez (e a tradução volta
 * para todas as posições), cada lote tem no máximo `tamanhoMaximo` descrições (limite da
 * API) e um lote nunca mistura dois sentidos do mesmo termo (MOLETOM = SWEATSHIRT com
 * MOLETOM = FLEECE), porque o contexto do lote é a união dos termos das suas descrições.
 * Custo: O(U·B) para U descrições distintas e B lotes abertos; com 50 por lote, B é pequeno.
 */
function montarLotesParaTraducao(textosPT, idiomaDestino = 'EN', { tamanhoMaximo = 50 } = {}) {
  const porChave = new Map();
  textosPT.forEach((texto, posicao) => {
    const chave = String(texto ?? '').trim().toUpperCase();
    if (!porChave.has(chave)) porChave.set(chave, { texto, posicoes: [] });
    porChave.get(chave).posicoes.push(posicao);
  });

  const conflita = (sentidos, pares) => pares.some(({ pt, en }) => sentidos.has(pt) && sentidos.get(pt) !== en);
  const lotes = [];
  for (const { texto, posicoes } of porChave.values()) {
    const pares = idiomaDestino.toUpperCase().startsWith('EN') ? paresDoGlossario(texto, idiomaDestino) : [];
    let lote = lotes.find(candidato => candidato.textos.length < tamanhoMaximo && !conflita(candidato.sentidos, pares));
    if (!lote) {
      lote = { textos: [], posicoes: [], pares: [], sentidos: new Map() };
      lotes.push(lote);
    }
    lote.textos.push(texto);
    lote.posicoes.push(posicoes);
    lote.pares.push(...pares);
    for (const { pt, en } of pares) lote.sentidos.set(pt, en);
  }

  return lotes.map(lote => ({ textos: lote.textos, posicoes: lote.posicoes, contexto: montarContextoDePares(lote.pares) }));
}

/**
 * Fallback local legado. Aplica apenas termos FECHADOS da tabela; não chama API.
 * A ordem dos componentes continua seguindo a ordem do texto de entrada.
 */
function processarTraducaoLocal(textoPT, idiomaDestino = 'EN') {
  const preparado = prepararTextoParaBusca(textoPT);
  const textoNormalizado = preparado.normalizado;
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';

  if (langKey === 'ES') {
    let resultado = textoNormalizado;
    for (const expressao of expressoesCompostas.ES) {
      resultado = resultado.replace(
        new RegExp(`(^|[^A-Z0-9])${escaparRegex(normalizarParaBusca(expressao.pt))}(?=$|[^A-Z0-9])`, 'g'),
        (_, prefixo) => `${prefixo}${expressao.target}`
      );
    }
    return resultado;
  }

  const correspondencias = listarCorrespondencias(textoPT, 'EN');
  let resultado = '';
  let cursorOriginal = 0;
  for (const correspondencia of correspondencias) {
    const inicioOriginal = preparado.mapaInicio[correspondencia.inicio];
    const fimOriginal = preparado.mapaFim[correspondencia.fim - 1];
    resultado += preparado.originalMaiusculo.slice(cursorOriginal, inicioOriginal);
    resultado += correspondencia.termo.en;
    cursorOriginal = fimOriginal;
  }
  resultado += preparado.originalMaiusculo.slice(cursorOriginal);
  return resultado.replace(/\s+/g, ' ').trim();
}

module.exports = {
  normalizarParaBusca,
  listarCorrespondencias,
  paresDoGlossario,
  montarContextoGlossario,
  montarLotesParaTraducao,
  processarTraducaoLocal
};
