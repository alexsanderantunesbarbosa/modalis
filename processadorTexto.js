/**
 * Motor de tradução local: matching da tabela mestra + montagem da frase em inglês.
 * O processamento é estático e não chama a API DeepL.
 *
 * Camadas, de cima para baixo:
 *   1. normalização do texto (acentos, caixa, pontuação);
 *   2. preparação dos termos, uma vez por processo (chave normalizada + regex);
 *   3. matching: expressão mais longa vence; termos com mais de um sentido (JEANS,
 *      MOLETOM, GOLA ALTA) são resolvidos olhando as outras peças da própria descrição;
 *   4. montador: a frase em inglês segue a estrutura combinada com o negócio, e as
 *      preposições do português dizem o papel de cada termo (COM = detalhe, DE/EM +
 *      tecido = material, termo solto = adjetivo pela posição do índice).
 *
 * Decisões de 24/10/2026 (ver CLAUDE.md, "Estrutura da frase em inglês").
 */

const { termosGlossario, expressoesCompostas } = require('./tabelaMestra');

/* ==================== 1. Normalização ==================== */

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
    const semAcento = caractereOriginal.normalize('NFD').replace(/[̀-ͯ]/g, '');

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

/* ==================== 2. Preparação dos termos (uma vez por processo) ==================== */

const NUCLEO = new Set([1, 15, 16]);            // índices que são a peça
const EMBUTEM_PECA = new Set([3, 4]);            // expressões destes índices podem carregar a peça (CALÇA PIJAMA, SAIA CURTA)
const AGASALHO = /\b(JACKET|COAT|VEST|PARKA|WINDBREAKER|BOMBER|PUFFER)\b/;
// Comprimentos colados à palavra da peça (DENIM MINI SKIRT, RIBBED SHORT DRESS); os
  // descritivos (MID-LENGTH, CROPPED, LONGLINE) ficam na posição 2.
const COMPRIMENTO_COLADO_EN = new Set(['MINI', 'MIDI', 'MAXI', 'SUPER MIDI', 'SHORT', 'LONG']);
const LIMITE_SAP = 40;

// Cache de chave normalizada e regex por texto de termo (vocabulário finito).
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

// Uma entrada por chave normalizada (PT). Chaves com mais de um sentido (JEANS, MOLETOM,
// GOLA ALTA) guardam todas as alternativas; a escolha é feita por descrição, no matching.
// A ordem da tabela é preservada: os empates do matching dependem dela.
const chavesPreparadas = (() => {
  const porChave = new Map();
  for (const termo of termosGlossario) {
    if (termo.status !== 'FECHADO') continue;
    const { chave, regex } = prepararTermo(termo.pt);
    if (!chave) continue;
    if (!porChave.has(chave)) porChave.set(chave, { chave, regex, alternativas: [] });
    porChave.get(chave).alternativas.push(termo);
  }
  return Array.from(porChave.values());
})();

// Palavras (PT, normalizadas) que nomeiam uma peça: usadas para reconhecer expressões
// que carregam a peça dentro (SAIA CURTA, CALÇA PIJAMA, MINI-SAIA).
const PALAVRAS_DE_PECA = new Set(
  termosGlossario
    .filter(termo => termo.status === 'FECHADO' && NUCLEO.has(termo.indice) && termo.tipo === 'termo')
    .map(termo => prepararTermo(termo.pt).chave)
);

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

/* ==================== 3. Matching ==================== */

function ehPeca(termo) {
  if (NUCLEO.has(termo.indice)) return true;
  if (!EMBUTEM_PECA.has(termo.indice)) return false;
  return prepararTermo(termo.pt).chave.split(' ').some(palavra => PALAVRAS_DE_PECA.has(palavra));
}

// Modelo que, sozinho, funciona como peça: modelagem de jaqueta (PARKA, PUFFER) ou modelo
// cujo inglês já é a peça (HOT PANTS). Vale para resolver JEANS/MOLETOM e como núcleo.
function ehPecaPorModelo(termo) {
  return termo.indice === 14 || (termo.indice === 3 && /(PANTS|SHORTS)$/.test(termo.en));
}

// Escolhe o sentido de um termo com várias entradas, olhando as outras peças da descrição.
// Devolve uma cópia (nunca altera a tabela).
function resolverSentido(alternativas, { outraPeca, pecaAgasalho }) {
  if (alternativas.length === 1) return { ...alternativas[0] };
  const chave = prepararTermo(alternativas[0].pt).chave;
  const porContexto = contexto => alternativas.find(t => prepararTermo(t.contexto || '').chave === contexto);
  const semContexto = alternativas.find(t => !t.contexto);

  if (chave === 'JEANS') {
    // Com outra peça na descrição, JEANS é o tecido (DENIM); sozinho, é a própria peça.
    if (outraPeca) return { ...porContexto('TECIDO') };
    return { ...porContexto('CALCA'), indice: 1, nomeIndice: 'CATEGORIAS DE PEÇA' };
  }
  if (chave === 'MOLETOM') {
    // Com outra peça, MOLETOM é o tecido (FLEECE; o montador troca por SWEATPANTS/SWEAT
    // SHORTS em calça e short); sozinho, é a peça SWEATSHIRT (ou HOODIE com capuz).
    if (outraPeca) return { ...porContexto('TECIDO DE OUTRAS PECAS') };
    return { ...semContexto };
  }
  if (chave === 'GOLA ALTA') {
    return { ...(pecaAgasalho ? porContexto('AGASALHO') : semContexto) };
  }
  return { ...(semContexto || alternativas[0]) };
}

function listarCorrespondencias(textoPT, idiomaDestino = 'EN') {
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';
  if (langKey !== 'EN') return [];

  const preparado = prepararTextoParaBusca(textoPT);
  const textoNormalizado = preparado.normalizado;
  if (!textoNormalizado) return [];

  // Passo 1: candidatas por chave (uma regex por chave, não por entrada).
  const candidatas = [];
  for (const { regex, alternativas } of chavesPreparadas) {
    const indicePrimario = Math.min(...alternativas.map(t => t.indice));
    for (const ocorrencia of acharOcorrencias(textoNormalizado, regex)) {
      candidatas.push({ ...ocorrencia, alternativas, indicePrimario, textoEncontrado: textoNormalizado.slice(ocorrencia.inicio, ocorrencia.fim) });
    }
  }

  // Expressões mais longas ganham sobre palavras contidas nelas; em empate,
  // prevalece o índice de prioridade menor definido pelo negócio.
  candidatas.sort((a, b) => a.inicio - b.inicio
    || (b.fim - b.inicio) - (a.fim - a.inicio)
    || a.indicePrimario - b.indicePrimario);

  const selecionadas = [];
  let limite = -1;
  for (const candidata of candidatas) {
    if (candidata.inicio < limite) continue;
    selecionadas.push(candidata);
    limite = candidata.fim;
  }

  // Passo 2: resolve os sentidos olhando as outras peças da descrição.
  const pecasCertas = selecionadas.filter(c => c.alternativas.length === 1 && (ehPeca(c.alternativas[0]) || ehPecaPorModelo(c.alternativas[0])));
  return selecionadas.map(candidata => {
    const outraPeca = pecasCertas.some(p => p !== candidata);
    const pecaAgasalho = pecasCertas.some(p => p.alternativas[0].indice === 14 || AGASALHO.test(p.alternativas[0].en));
    const termo = resolverSentido(candidata.alternativas, { outraPeca, pecaAgasalho });
    return { inicio: candidata.inicio, fim: candidata.fim, termo, textoEncontrado: candidata.textoEncontrado };
  });
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
 * O contexto orienta a API, mas não é uma garantia de aplicação exata.
 */
function montarContextoGlossario(textosPT, idiomaDestino = 'EN') {
  if (!idiomaDestino.toUpperCase().startsWith('EN')) return '';
  return montarContextoDePares(textosPT.flatMap(texto => paresDoGlossario(texto, idiomaDestino)));
}

/**
 * Monta os lotes enviados à DeepL. Descrições iguais entram uma vez (e a tradução volta
 * para todas as posições), cada lote tem no máximo `tamanhoMaximo` descrições e um lote
 * nunca mistura dois sentidos do mesmo termo, porque o contexto é a união dos termos.
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

/* ==================== 4. Montador da frase em inglês ==================== */

// Conectivos do português e o papel que dão ao termo seguinte.
const CONECTIVOS = {
  COM: 'COM', 'C/': 'COM',
  DE: 'DE', DA: 'DE', DO: 'DE', DAS: 'DE', DOS: 'DE', EM: 'DE', NA: 'DE', NO: 'DE', NAS: 'DE', NOS: 'DE',
  SEM: 'SEM', 'S/': 'SEM',
  E: 'E',
  A: null, O: null, AS: null, OS: null, PARA: null, 'P/': null
};

// Posição na frase por índice (menor = mais à esquerda). Ordem aprovada em 24/10/2026:
// [linha] [rise] [comprimento] [fit] [manga] [gola] [construção] [acabamento] [tecido] [modelo] PEÇA [WITH …]
function posicaoNaFrase(termo) {
  switch (termo.indice) {
    case 13: return 0;
    case 5: return 1;
    case 4: return 2;
    case 2: return 3;
    case 6: return 4;
    case 7: return 5;
    case 12: return 6;
    case 9: return 7;
    case 8: return 8;
    case 3: case 14: return 9;
    case 10: case 11: return 7; // aviamento ou bolso SOLTO descreve a peça (EMBROIDERED SWEATSHIRT); com COM vira detalhe
    default: return null;
  }
}

const MODIFICADOR_DE_DETALHE = new Set([9, 10, 12]); // soltos após um detalhe, qualificam o detalhe (PALA BORDADA); fit e tecido soltos descrevem a peça
const DETALHES_QUE_ACEITAM_DE = new Set([10, 11, 12]);  // COM BOTÕES EM METAL, COM DETALHE EM ZÍPER

/**
 * Monta a tradução de uma descrição a partir dos termos da tabela.
 * Devolve { estado, traducao, desconhecidas, termos }:
 *   estado 'tabela'       → todas as palavras cobertas, uma peça, até 40 caracteres;
 *          'acima-de-40'  → montada, mas passou do limite do SAP (nunca é cortada);
 *          'desconhecida' → há palavra fora da tabela (candidata à DeepL + validação);
 *          'varias-pecas' → mais de uma peça identificada (precisa de revisão);
 *          'sem-peca'     → nenhuma peça identificada.
 * Em todos os casos `traducao` traz o melhor esforço: a estrutura é aplicada aos termos
 * conhecidos e as palavras desconhecidas ficam no fim, em português.
 */
function montarTraducao(textoPT, idiomaDestino = 'EN') {
  const preparado = prepararTextoParaBusca(textoPT);
  const normalizado = preparado.normalizado;
  const casos = listarCorrespondencias(textoPT, idiomaDestino);

  // Unidades na ordem do texto: termo casado, conectivo ou palavra desconhecida.
  const unidades = [];
  const regexPalavra = /[A-Z0-9/]+/g;
  let palavra;
  while ((palavra = regexPalavra.exec(normalizado)) !== null) {
    const inicio = palavra.index;
    const fim = inicio + palavra[0].length;
    const caso = casos.find(c => c.inicio <= inicio && fim <= c.fim);
    if (caso) {
      if (unidades.at(-1)?.caso !== caso) unidades.push({ tipo: 'termo', caso, termo: { ...caso.termo }, prep: null });
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(CONECTIVOS, palavra[0])) {
      unidades.push({ tipo: 'conectivo', papel: CONECTIVOS[palavra[0]] });
      continue;
    }
    unidades.push({ tipo: 'desconhecida', valor: preparado.originalMaiusculo.slice(preparado.mapaInicio[inicio], preparado.mapaFim[fim - 1]) });
  }

  // Preposição que antecede cada termo. "E" repete o papel do termo anterior (COM FAIXA E BOTÕES).
  let papelPendente = null;
  let papelAnterior = null;
  for (const unidade of unidades) {
    if (unidade.tipo === 'conectivo') {
      papelPendente = unidade.papel === 'E' ? papelAnterior : unidade.papel;
      continue;
    }
    if (unidade.tipo === 'termo') {
      // Expressão que já traz o conectivo (COM CAPUZ, SEM MANGAS, COM FAIXA) define o próprio
      // papel: ignora o pendente ("SEM BOLSO E COM CINTO" não pode virar WITHOUT ... BELT) e
      // propaga o seu para o "E" seguinte ("COM CAPUZ E BOLSOS" → WITH POCKETS).
      const chave = prepararTermo(unidade.termo.pt).chave;
      const proprio = /^(COM|C\/) /.test(chave) ? 'COM' : /^(SEM|S\/) /.test(chave) ? 'SEM' : null;
      unidade.prep = proprio ? null : papelPendente;
      papelAnterior = proprio || papelPendente || (unidade.termo.en.startsWith('WITH ') ? 'COM' : null);
    }
    papelPendente = null;
  }

  const termos = unidades.filter(u => u.tipo === 'termo');
  const desconhecidas = unidades.filter(u => u.tipo === 'desconhecida').map(u => u.valor);

  if (!termos.length) {
    return { estado: desconhecidas.length ? 'desconhecida' : 'sem-peca', traducao: preparado.originalMaiusculo.trim(), desconhecidas, termos: [] };
  }

  // Peça (núcleo): índices de peça ou expressão que a carrega; "COM X" nunca é a peça.
  let candidatas = termos.filter(u => u.prep !== 'COM' && ehPeca(u.termo));
  if (!candidatas.length) candidatas = termos.filter(u => u.prep !== 'COM' && ehPecaPorModelo(u.termo)); // PARKA sozinha, HOT PANTS
  // Peça específica absorve a genérica: TOP + CORTININHA (TRIANGLE TOP) é uma peça só.
  const absorvidas = new Set(candidatas.filter(generica => candidatas.some(especifica => especifica !== generica
    && especifica.termo.en.split(' ').length > generica.termo.en.split(' ').length
    && especifica.termo.en.split(' ').includes(generica.termo.en.split(' ').at(-1)))));
  candidatas = candidatas.filter(c => !absorvidas.has(c));
  const nucleo = candidatas[0] || null;
  const outrasPecas = candidatas.slice(1);
  let nucleoEn = nucleo ? nucleo.termo.en : '';

  const antes = [];       // { en, posicao, ordem }
  const colados = [];     // MINI, MIDI, MAXI: antes da última palavra da peça
  const detalhes = [];    // { en, modificadores: [] }
  let detalheAberto = null;

  termos.forEach((unidade, ordem) => {
    if (unidade === nucleo || absorvidas.has(unidade)) { detalheAberto = null; return; }
    const { termo, prep } = unidade;
    let en = termo.en;

    // Tecidos JEANS e MOLETOM em calça/short viram a fusão idiomática da própria peça.
    if (nucleo && NUCLEO.has(nucleo.termo.indice) && termo.indice === 8 && (termo.pt === 'JEANS' || termo.pt === 'MOLETOM')) {
      const fusao = termo.pt === 'JEANS'
        ? { PANTS: 'JEANS', SHORTS: 'JORTS' }
        : { PANTS: 'SWEATPANTS', SHORTS: 'SWEAT SHORTS' };
      const ultima = nucleoEn.split(' ').at(-1);
      if (fusao[ultima]) {
        nucleoEn = nucleoEn.split(' ').slice(0, -1).concat(fusao[ultima]).join(' ');
        return;
      }
    }
    // MOLETOM com capuz é HOODIE (e não SWEATSHIRT + HOODED).
    if (nucleo && (nucleo.termo.pt === 'MOLETOM' || nucleoEn === 'HOODIE') && (termo.pt === 'COM CAPUZ' || termo.pt === 'CAPUZ')) {
      nucleoEn = 'HOODIE';
      return;
    }

    // Termo logo após um detalhe que o qualifica (vem antes de tudo): COM PALA BORDADA,
    // COM BOTÕES EM METAL, COM DETALHE EM ZÍPER.
    // Expressão que já é um detalhe (COM CINTO = WITH BELT) nunca qualifica o detalhe anterior.
    const proprioDetalhe = en.startsWith('WITH ') || /^(COM|C\/) /.test(prepararTermo(termo.pt).chave);
    const qualificaDetalhe = detalheAberto && !proprioDetalhe && (
      (prep === 'DE' && DETALHES_QUE_ACEITAM_DE.has(detalheAberto.indice)) ||
      (prep === null && MODIFICADOR_DE_DETALHE.has(termo.indice))
    );
    if (qualificaDetalhe) {
      detalheAberto.modificadores.push(en.startsWith('WITH ') ? en.slice(5) : en);
      return;
    }

    const ehDetalhe = prep === 'COM' || prep === 'SEM' || en.startsWith('WITH ') || posicaoNaFrase(termo) === null;
    if (ehDetalhe) {
      if (en.startsWith('WITH ')) en = en.slice(5);
      detalheAberto = { en, indice: termo.indice, modificadores: [], negado: prep === 'SEM' };
      detalhes.push(detalheAberto);
      return;
    }
    detalheAberto = null;

    if (outrasPecas.includes(unidade)) {
      antes.push({ en, posicao: 9, ordem }); // segunda peça: tratada como modelo (revisão)
      return;
    }
    if (termo.indice === 4 && COMPRIMENTO_COLADO_EN.has(termo.en)) {
      colados.push(en);
      return;
    }
    antes.push({ en, posicao: posicaoNaFrase(termo), ordem });
  });

  antes.sort((a, b) => a.posicao - b.posicao || a.ordem - b.ordem);
  // LOW e CINTURA BAIXA são ambos LOW-RISE: um inglês repetido entra uma vez.
  const vistos = new Set();
  const antesUnicos = antes.filter(a => !vistos.has(a.en) && vistos.add(a.en));
  const palavrasNucleo = nucleoEn ? nucleoEn.split(' ') : [];
  const pecaMontada = palavrasNucleo.length
    ? [...palavrasNucleo.slice(0, -1), ...colados, palavrasNucleo.at(-1)].join(' ')
    : colados.join(' ');
  const montarDetalhe = d => [...d.modificadores, d.en].join(' ');
  const positivos = detalhes.filter(d => !d.negado).map(montarDetalhe);
  const negativos = detalhes.filter(d => d.negado).map(montarDetalhe);
  const partes = [
    ...antesUnicos.map(a => a.en),
    pecaMontada,
    positivos.length ? `WITH ${positivos.join(' AND ')}` : '',
    negativos.length ? `WITHOUT ${negativos.join(' AND ')}` : '',
    ...desconhecidas
  ].filter(Boolean);
  const traducao = partes.join(' ').replace(/\s+/g, ' ').trim();

  let estado = 'tabela';
  if (desconhecidas.length) estado = 'desconhecida';
  else if (!nucleo) estado = 'sem-peca';
  else if (outrasPecas.length) estado = 'varias-pecas';
  else if (traducao.length > LIMITE_SAP) estado = 'acima-de-40';

  return { estado, traducao, desconhecidas, termos: termos.map(u => ({ pt: u.termo.pt, en: u.termo.en, indice: u.termo.indice, prep: u.prep })) };
}

/**
 * Tradução local: em inglês, a frase montada pela estrutura; em espanhol, o legado
 * (substituição das poucas expressões cadastradas), até a tabela ter a coluna ES.
 */
function processarTraducaoLocal(textoPT, idiomaDestino = 'EN') {
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';

  if (langKey === 'ES') {
    let resultado = prepararTextoParaBusca(textoPT).normalizado;
    for (const expressao of expressoesCompostas.ES) {
      resultado = resultado.replace(
        new RegExp(`(^|[^A-Z0-9])${escaparRegex(normalizarParaBusca(expressao.pt))}(?=$|[^A-Z0-9])`, 'g'),
        (_, prefixo) => `${prefixo}${expressao.target}`
      );
    }
    return resultado;
  }

  return montarTraducao(textoPT, 'EN').traducao;
}

module.exports = {
  normalizarParaBusca,
  listarCorrespondencias,
  paresDoGlossario,
  montarContextoGlossario,
  montarLotesParaTraducao,
  montarTraducao,
  processarTraducaoLocal,
  LIMITE_SAP
};
