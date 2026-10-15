/**
 * Matching local da tabela mestra revisada.
 * O processamento é estático e não chama a API DeepL.
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

function acharOcorrencias(textoNormalizado, termoNormalizado) {
  if (!termoNormalizado) return [];
  const regex = new RegExp(`(^|[^A-Z0-9])(${escaparRegex(termoNormalizado)})(?=$|[^A-Z0-9])`, 'g');
  const ocorrencias = [];
  let resultado;

  while ((resultado = regex.exec(textoNormalizado)) !== null) {
    const inicio = resultado.index + resultado[1].length;
    ocorrencias.push({ inicio, fim: inicio + resultado[2].length });
  }
  return ocorrencias;
}

function contemTermo(textoNormalizado, termo) {
  return acharOcorrencias(textoNormalizado, normalizarParaBusca(termo)).length > 0;
}

function escolherContexto(textoNormalizado, termo) {
  if (!termo.contexto) return true;

  const contexto = normalizarParaBusca(termo.contexto);
  const pt = normalizarParaBusca(termo.pt);

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
  if (normalizarParaBusca(termo.pt) !== 'MOLETOM' || termo.contexto) return false;

  const temFormaEspecifica = [
    'CALCA MOLETOM', 'CALCA DE MOLETOM', 'MOLETOM CALCA',
    'MOLETOM CANGURU', 'MOLETOM CARECA', 'MOLETOM GOLA CARECA'
  ].some(item => contemTermo(textoNormalizado, item));
  const temOutraPeca = ['BLUSA', 'CAMISA', 'T SHIRT', 'CAMISETA', 'JAQUETA', 'SAIA', 'VESTIDO', 'REGATA', 'TOP']
    .some(item => contemTermo(textoNormalizado, item));

  return temFormaEspecifica || temOutraPeca;
}

function listarCorrespondencias(textoPT, idiomaDestino = 'EN') {
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';
  if (langKey !== 'EN') return [];

  const preparado = prepararTextoParaBusca(textoPT);
  const textoNormalizado = preparado.normalizado;
  if (!textoNormalizado) return [];

  const candidatas = [];
  for (const termo of termosGlossario) {
    if (termo.status !== 'FECHADO'
      || deveIgnorarTermoGenerico(textoNormalizado, termo)
      || !escolherContexto(textoNormalizado, termo)) continue;
    const chave = normalizarParaBusca(termo.pt);
    for (const ocorrencia of acharOcorrencias(textoNormalizado, chave)) {
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

/**
 * Cria um contexto de terminologia para a tradução DeepL da descrição original.
 * O contexto orienta a API, mas não é uma garantia de aplicação exata; para isso
 * é necessário configurar um glossário nativo do DeepL com o mesmo conteúdo.
 */
function montarContextoGlossario(textosPT, idiomaDestino = 'EN') {
  if (!idiomaDestino.toUpperCase().startsWith('EN')) return '';
  const pares = new Map();

  for (const texto of textosPT) {
    for (const correspondencia of listarCorrespondencias(texto, idiomaDestino)) {
      const { pt, en } = correspondencia.termo;
      pares.set(`${pt} → ${en}`, `${pt} = ${en}`);
    }
  }

  if (pares.size === 0) return '';
  return `Use estas traduções técnicas para os termos encontrados: ${Array.from(pares.values()).join('; ')}.`;
}

function agruparTextosPorContexto(textosPT, idiomaDestino = 'EN') {
  const grupos = new Map();

  textosPT.forEach((texto, indice) => {
    const contexto = montarContextoGlossario([texto], idiomaDestino);
    if (!grupos.has(contexto)) grupos.set(contexto, { contexto, textos: [], indices: [] });
    const grupo = grupos.get(contexto);
    grupo.textos.push(texto);
    grupo.indices.push(indice);
  });

  return Array.from(grupos.values());
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
  montarContextoGlossario,
  agruparTextosPorContexto,
  processarTraducaoLocal
};
