// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
/**
 * Motor de tradução local: matching da tabela mestra + montagem da frase em inglês e em
 * espanhol. O processamento é estático e não chama a API DeepL.
 *
 * Camadas, de cima para baixo:
 *   1. normalização do texto (acentos, caixa, pontuação);
 *   2. preparação dos termos, uma vez por processo (chave normalizada + regex);
 *   3. matching: expressão mais longa vence; termos com mais de um sentido (JEANS,
 *      MOLETOM, GOLA ALTA, SLIP) são resolvidos olhando as outras peças da própria descrição;
 *      expressão que embute a peça genérica (VESTIDO MIDI) cede a uma peça mais específica
 *      da mesma família (SLIP DRESS), para as duas virarem uma peça só;
 *   4. montador: a frase em inglês segue a estrutura combinada com o negócio, e as
 *      preposições do português dizem o papel de cada termo (COM = detalhe, DE/EM +
 *      tecido = material, termo solto = adjetivo pela posição do índice);
 *   5. montador do espanhol: segue a frase em português ao pé da letra, com concordância.
 *
 * Decisões de 24/10/2026 (ver CLAUDE.md, "Estrutura da frase em inglês") e de 29/10/2026
 * (docs/decisoes-espanhol-2026-10-29.md).
 */

const { termosGlossario } = require('./tabelaMestra');

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
      // O "+" fica: ele liga peças (KIT BLUSA + SAIA), e nenhuma expressão pode casar por cima dele.
      const normalizado = /[A-Z0-9/+]/.test(caractere) ? caractere : ' ';
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
const COMPRIMENTO_ANTES_DA_PECA_EN = new Set(['SHORT', 'LONG']); // decisão do dono de 03/11/2026
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
// GOLA ALTA, SLIP) guardam todas as alternativas; a escolha é feita por descrição, no matching.
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

// Peça de uma palavra por chave (VESTIDO → DRESS): a peça genérica que uma expressão pode
// embutir (VESTIDO MIDI). Só o sentido sem contexto; com chave repetida, vale o primeiro.
const PECA_POR_PALAVRA = new Map();
for (const termo of termosGlossario) {
  if (termo.status !== 'FECHADO' || !NUCLEO.has(termo.indice) || termo.tipo !== 'termo' || termo.contexto) continue;
  const { chave } = prepararTermo(termo.pt);
  if (!PECA_POR_PALAVRA.has(chave)) PECA_POR_PALAVRA.set(chave, termo);
}

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
// `pecaAntes` é a chave da peça mais próxima antes do termo (null se a palavra logo antes dele
// é um conectivo: COM, SEM, E, DE, EM, NO…). Devolve uma cópia (nunca altera a tabela).
function resolverSentido(alternativas, { outraPeca, pecaAgasalho, pecaAntes }) {
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
  if (chave === 'SLIP') {
    // Depois de um vestido (VESTIDO MIDI SLIP, VESTIDO DE CETIM SLIP, VESTIDO COM ALÇAS SLIP), SLIP
    // é o modelo dele: o slip dress (decisão do dono de 05/11/2026). Sozinho, depois de outra peça
    // ou logo depois de um conectivo (VESTIDO COM SLIP, VESTIDO E SLIP, VESTIDO DE SLIP), segue a
    // anágua da R19.
    const depoisDeVestido = Boolean(pecaAntes) && pecaAntes.split(' ').includes('VESTIDO');
    return { ...((depoisDeVestido && porContexto('VESTIDO')) || semContexto) };
  }
  return { ...(semContexto || alternativas[0]) };
}

// Seleção gulosa, da esquerda para a direita: a candidata que começa antes fica, e a mais longa
// vence as que começam no mesmo lugar (a lista chega ordenada assim). As que cederam não entram.
function selecionarCandidatas(candidatas, cederam) {
  const selecionadas = [];
  let limite = -1;
  for (const candidata of candidatas) {
    if (cederam.has(candidata) || candidata.inicio < limite) continue;
    selecionadas.push(candidata);
    limite = candidata.fim;
  }
  return selecionadas;
}

// Conectivos que separam duas peças: COM X é detalhe, SEM X é negação, e X E Y e X + Y são duas
// peças. Entre uma expressão e a peça mais específica, eles impedem a cessão (VESTIDO POLO COM
// VESTIDO JEANS continua POLO DRESS WITH DENIM DRESS).
const SEPARAM_DA_PECA = new Set(['COM', 'C/', 'SEM', 'S/', 'E', '+']);
const ehConectivo = palavra => Object.prototype.hasOwnProperty.call(CONECTIVOS, palavra);
// Palavras do texto normalizado, com o "+" como palavra própria (VESTIDO+SLIP = VESTIDO, +, SLIP).
const PALAVRA_OU_MAIS = /\+|[A-Z0-9/]+/g;
const palavrasDe = texto => texto.match(PALAVRA_OU_MAIS) || [];

// Resolve os sentidos olhando as outras peças da descrição. Peça "certa" é a candidata com todos
// os sentidos de peça (SLIP é anágua ou slip dress, peça de qualquer jeito); JEANS e MOLETOM,
// que também podem ser tecido, dependem da resolução e não contam.
function resolverSentidos(selecionadas, textoNormalizado) {
  const pecasCertas = selecionadas.filter(c => c.alternativas.every(t => ehPeca(t) || ehPecaPorModelo(t)));
  const pecaAgasalho = pecasCertas.some(p => p.alternativas[0].indice === 14 || AGASALHO.test(p.alternativas[0].en));
  return selecionadas.map(candidata => {
    const outraPeca = pecasCertas.some(p => p !== candidata);
    // A peça mais próxima antes do termo, se ele não vem logo depois de um conectivo (VESTIDO DE
    // SLIP, VESTIDO COM SLIP e VESTIDO E SLIP não fazem do SLIP o modelo do vestido).
    const palavraAntes = palavrasDe(textoNormalizado.slice(0, candidata.inicio)).at(-1);
    const anterior = ehConectivo(palavraAntes) ? null : ultimoQue(pecasCertas, p => p.fim <= candidata.inicio);
    const termo = resolverSentido(candidata.alternativas, { outraPeca, pecaAgasalho, pecaAntes: anterior ? anterior.textoEncontrado : null });
    return { candidata, inicio: candidata.inicio, fim: candidata.fim, termo, textoEncontrado: candidata.textoEncontrado };
  });
}

// Expressão que é a peça genérica com um modificador (VESTIDO MIDI = MIDI DRESS, VESTIDO JEANS =
// DENIM DRESS, SAIA CURTA = SHORT SKIRT): devolve a peça genérica que ela embute (VESTIDO), ou
// null. Expressão com duas peças (VESTIDO REGATA, VESTIDO SLIP) já é uma peça específica, e a
// fusão (CALÇA JEANS = JEANS, cujo inglês não termina na peça) não se desfaz.
function pecaGenericaDentro(termo) {
  if (termo.tipo !== 'expressao' || !ehPeca(termo)) return null;
  const dentro = prepararTermo(termo.pt).chave.split(' ').filter(palavra => PECA_POR_PALAVRA.has(palavra));
  if (dentro.length !== 1) return null;
  const generica = PECA_POR_PALAVRA.get(dentro[0]);
  return termo.en.split(' ').at(-1) === generica.en.split(' ').at(-1) ? generica : null;
}

// A expressão que embute a peça genérica e cede a uma peça mais específica da mesma família:
// em VESTIDO MIDI SLIP DRESS, VESTIDO MIDI sai, VESTIDO e MIDI casam separados, e o montador
// junta VESTIDO e SLIP DRESS numa peça só, com o MIDI no papel dele (SLIP MIDI DRESS; no ES,
// VESTIDO MIDI LENCERO). Mais específica = o inglês tem mais palavras e termina na mesma peça.
// Com COM, SEM, E ou + entre as duas, não cede: são detalhe, negação ou outra peça. As
// candidatas em `naoCedem` já foram testadas e não podem ceder (ver listarCorrespondencias).
function expressaoQueCede(resolvidas, naoCedem, textoNormalizado) {
  const palavrasEN = termo => termo.en.split(' ');
  const separadas = (a, b) => palavrasDe(textoNormalizado.slice(Math.min(a.fim, b.fim), Math.max(a.inicio, b.inicio)))
    .some(palavra => SEPARAM_DA_PECA.has(palavra));
  return resolvidas.find(x => {
    if (naoCedem.has(x.candidata)) return false;
    const generica = pecaGenericaDentro(x.termo);
    return Boolean(generica) && resolvidas.some(y => y !== x && ehPeca(y.termo) && !pecaGenericaDentro(y.termo)
      && palavrasEN(y.termo).length > palavrasEN(generica).length
      && palavrasEN(y.termo).at(-1) === palavrasEN(generica).at(-1)
      && !separadas(x, y));
  });
}

// Toda palavra do trecho continua coberta por um termo selecionado (ou é conectivo)? Uma
// expressão só cede se nada dela vira palavra desconhecida: SAIA LÁPIS não cede, porque LÁPIS
// sozinho não está na tabela.
function cobreTrecho(selecionadas, inicio, fim, textoNormalizado) {
  const regexPalavra = /[A-Z0-9/]+/g;
  regexPalavra.lastIndex = inicio;
  let palavra;
  while ((palavra = regexPalavra.exec(textoNormalizado)) !== null && palavra.index < fim) {
    const de = palavra.index;
    const ate = de + palavra[0].length;
    if (Object.prototype.hasOwnProperty.call(CONECTIVOS, palavra[0])) continue;
    if (!selecionadas.some(c => c.inicio <= de && ate <= c.fim)) return false;
  }
  return true;
}

// O casamento é feito no português, então vale para os dois idiomas de destino.
function listarCorrespondencias(textoPT) {
  const preparado = prepararTextoParaBusca(textoPT);
  const textoNormalizado = preparado.normalizado;
  if (!textoNormalizado) return [];

  // Passo 1: candidatas por chave (uma regex por chave, não por entrada).
  const candidatas = [];
  for (const { chave, regex, alternativas } of chavesPreparadas) {
    const indicePrimario = Math.min(...alternativas.map(t => t.indice));
    for (const ocorrencia of acharOcorrencias(textoNormalizado, regex)) {
      // Termo que, sem acento, é um conectivo (NÓ = NO, NÓS = NOS) só casa escrito com o acento:
      // "COM FAIXA NO PESCOÇO" é a contração, não um nó.
      if (Object.prototype.hasOwnProperty.call(CONECTIVOS, chave)) {
        const original = preparado.originalMaiusculo.slice(preparado.mapaInicio[ocorrencia.inicio], preparado.mapaFim[ocorrencia.fim - 1]);
        if (original !== alternativas[0].pt.toUpperCase()) continue;
      }
      candidatas.push({ ...ocorrencia, alternativas, indicePrimario, textoEncontrado: textoNormalizado.slice(ocorrencia.inicio, ocorrencia.fim) });
    }
  }

  // Expressões mais longas ganham sobre palavras contidas nelas; em empate,
  // prevalece o índice de prioridade menor definido pelo negócio.
  candidatas.sort((a, b) => a.inicio - b.inicio
    || (b.fim - b.inicio) - (a.fim - a.inicio)
    || a.indicePrimario - b.indicePrimario);

  // Passo 2: seleção e sentidos. Passo 3: se uma expressão cede a uma peça mais específica, o
  // casamento é refeito sem ela. Cada volta põe uma candidata em `cederam` ou em `naoCedem`, e
  // nenhuma é testada duas vezes, então o laço sempre termina.
  const cederam = new Set();
  const naoCedem = new Set();
  for (;;) {
    const resolvidas = resolverSentidos(selecionarCandidatas(candidatas, cederam), textoNormalizado);
    const cede = expressaoQueCede(resolvidas, naoCedem, textoNormalizado);
    if (!cede) return resolvidas.map(({ inicio, fim, termo, textoEncontrado }) => ({ inicio, fim, termo, textoEncontrado }));
    const semEla = new Set([...cederam, cede.candidata]);
    if (cobreTrecho(selecionarCandidatas(candidatas, semEla), cede.inicio, cede.fim, textoNormalizado)) cederam.add(cede.candidata);
    else naoCedem.add(cede.candidata);
  }
}

const ehEspanhol = idiomaDestino => String(idiomaDestino).toUpperCase().startsWith('ES');

// Pares PT → tradução do glossário encontrados numa descrição, na ordem em que aparecem. No
// espanhol a tradução é a forma que o montador usou, já com a concordância (ACETINADA →
// SATINADO em PANTALÓN), para o contexto da DeepL não ensinar o gênero errado.
function paresDoGlossario(textoPT, idiomaDestino = 'EN') {
  if (ehEspanhol(idiomaDestino)) return montarTraducaoES(textoPT).termos.map(({ pt, es }) => ({ pt, traducao: es }));
  return listarCorrespondencias(textoPT).map(({ termo }) => ({ pt: termo.pt, traducao: termo.en }));
}

function montarContextoDePares(pares) {
  const unicos = new Map();
  for (const { pt, traducao } of pares) unicos.set(`${pt} → ${traducao}`, `${pt} = ${traducao}`);
  if (unicos.size === 0) return '';
  return `Use estas traduções técnicas para os termos encontrados: ${Array.from(unicos.values()).join('; ')}.`;
}

/**
 * Cria um contexto de terminologia para a tradução DeepL das descrições.
 * O contexto orienta a API, mas não é uma garantia de aplicação exata.
 */
function montarContextoGlossario(textosPT, idiomaDestino = 'EN') {
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

  const conflita = (sentidos, pares) => pares.some(({ pt, traducao }) => sentidos.has(pt) && sentidos.get(pt) !== traducao);
  const lotes = [];
  for (const { texto, posicoes } of porChave.values()) {
    const pares = paresDoGlossario(texto, idiomaDestino);
    let lote = lotes.find(candidato => candidato.textos.length < tamanhoMaximo && !conflita(candidato.sentidos, pares));
    if (!lote) {
      lote = { textos: [], posicoes: [], pares: [], sentidos: new Map() };
      lotes.push(lote);
    }
    lote.textos.push(texto);
    lote.posicoes.push(posicoes);
    lote.pares.push(...pares);
    for (const { pt, traducao } of pares) lote.sentidos.set(pt, traducao);
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
  A: null, O: null, AS: null, OS: null, PARA: null, 'P/': null,
  // "+" liga peças (KIT BLUSA + SAIA): separa como o E, mas não repete o papel do termo anterior
  // (em BLUSA COM BOLSO + SAIA, a SAIA é outra peça, não um detalhe).
  '+': null
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
 * Monta a tradução de uma descrição a partir dos termos da tabela, em inglês (padrão) ou em
 * espanhol (montarTraducaoES, seção 5). Devolve { estado, traducao, desconhecidas, termos }:
 *   estado 'tabela'       → todas as palavras cobertas, uma peça, até 40 caracteres;
 *          'acima-de-40'  → montada, mas passou do limite do SAP (nunca é cortada);
 *          'desconhecida' → há palavra fora da tabela (candidata à DeepL + validação);
 *          'varias-pecas' → mais de uma peça identificada (precisa de revisão);
 *          'sem-peca'     → nenhuma peça identificada.
 * Em todos os casos `traducao` traz o melhor esforço: a estrutura é aplicada aos termos
 * conhecidos e as palavras desconhecidas ficam no fim, em português.
 */
function montarTraducao(textoPT, idiomaDestino = 'EN') {
  return idiomaDestino.toUpperCase().startsWith('ES') ? montarTraducaoES(textoPT) : montarTraducaoEN(textoPT);
}

// Quebra a descrição em unidades, na ordem do texto: termo casado (com a preposição que
// define o seu papel), conectivo ou palavra desconhecida. É a mesma análise para os dois
// idiomas: o casamento é feito no português.
function analisarDescricao(textoPT) {
  const preparado = prepararTextoParaBusca(textoPT);
  const normalizado = preparado.normalizado;
  const casos = listarCorrespondencias(textoPT);

  const unidades = [];
  const regexPalavra = new RegExp(PALAVRA_OU_MAIS.source, 'g'); // o "+" é um conectivo
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
      unidades.push({ tipo: 'conectivo', papel: CONECTIVOS[palavra[0]], palavra: palavra[0] });
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

  return { preparado, unidades };
}

// Peças da descrição (índices de peça ou expressão que a carrega; "COM X" nunca é a peça) e quais
// são absorvidas por uma peça mais específica da mesma família: o inglês da específica tem mais
// palavras e termina na mesma palavra de peça (TOP + CORTININHA = TRIANGLE TOP; VESTIDO … SLIP
// DRESS = SLIP DRESS). TRIANGLE TOP absorve TOP, mas SLIP DRESS não absorve SLIP (a anágua): a
// última palavra é a peça. Só peças soltas (sem preposição) se juntam: ligadas por E ou +, são
// duas peças (VESTIDO E VESTIDO REGATA, MEIA CALÇA E MEIA FINA); peça negada (VESTIDO SEM SLIP
// DRESS) não absorve nem é absorvida, senão a negação sumiria; e a que vem depois de DE/EM/NO
// (VESTIDO MIDI DE VESTIDO) também fica. O EN tira a genérica; o ES não repete o começo comum.
function pecasDaDescricao(unidades) {
  const termos = unidades.filter(u => u.tipo === 'termo');
  let pecas = termos.filter(u => u.prep !== 'COM' && ehPeca(u.termo));
  if (!pecas.length) pecas = termos.filter(u => u.prep !== 'COM' && ehPecaPorModelo(u.termo)); // PARKA sozinha, HOT PANTS
  const palavrasEN = u => u.termo.en.split(' ');
  const ligadas = (a, b) => {
    const [de, ate] = [unidades.indexOf(a), unidades.indexOf(b)].sort((x, y) => x - y);
    return unidades.slice(de + 1, ate).some(u => u.tipo === 'conectivo' && (u.papel === 'E' || u.palavra === '+'));
  };
  const soltas = pecas.filter(u => u.prep === null);
  const absorvedora = new Map(); // peça genérica → peça específica que a absorve
  for (const generica of soltas) {
    const especifica = soltas.find(p => p !== generica
      && palavrasEN(p).length > palavrasEN(generica).length
      && palavrasEN(p).at(-1) === palavrasEN(generica).at(-1)
      && !ligadas(generica, p));
    if (especifica) absorvedora.set(generica, especifica);
  }
  return { pecas, absorvedora };
}

function montarTraducaoEN(textoPT) {
  const { preparado, unidades } = analisarDescricao(textoPT);
  const termos = unidades.filter(u => u.tipo === 'termo');
  const desconhecidas = unidades.filter(u => u.tipo === 'desconhecida').map(u => u.valor);

  if (!termos.length) {
    return { estado: desconhecidas.length ? 'desconhecida' : 'sem-peca', traducao: preparado.originalMaiusculo.trim(), desconhecidas, termos: [] };
  }

  // Peça (núcleo): a primeira peça que não foi absorvida por outra mais específica. A peça negada
  // (SEM VESTIDO) nunca é o núcleo: sem outra peça, a linha fica "sem peça" e vai para revisão.
  const { pecas, absorvedora } = pecasDaDescricao(unidades);
  const candidatas = pecas.filter(c => !absorvedora.has(c));
  const nucleo = candidatas.find(c => c.prep !== 'SEM') || null;
  const outrasPecas = candidatas.filter(c => c !== nucleo);
  let nucleoEn = nucleo ? nucleo.termo.en : '';

  const antes = [];       // { en, posicao, ordem }
  const colados = [];     // MINI, MIDI, MAXI: antes da última palavra da peça
  const detalhes = [];    // { en, modificadores: [] }
  let detalheAberto = null;

  termos.forEach((unidade, ordem) => {
    if (unidade === nucleo || absorvedora.has(unidade)) { detalheAberto = null; return; }
    const { termo, prep } = unidade;
    let en = termo.en;

    // Tecidos JEANS e MOLETOM em calça/short viram a fusão idiomática da própria peça. Com COM ou
    // SEM, não: CALÇA SEM MOLETOM é PANTS WITHOUT FLEECE, não SWEATPANTS.
    if (nucleo && NUCLEO.has(nucleo.termo.indice) && termo.indice === 8 && prep !== 'COM' && prep !== 'SEM'
      && (termo.pt === 'JEANS' || termo.pt === 'MOLETOM')) {
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
  // Dois termos com o mesmo inglês (SLIM e JUSTA são ambos SLIM): um inglês repetido entra uma vez.
  const vistos = new Set();
  const antesUnicos = antes.filter(a => !vistos.has(a.en) && vistos.add(a.en));
  const palavrasNucleo = nucleoEn ? nucleoEn.split(' ') : [];
  // SHORT e LONG são adjetivos comuns: em peça de mais de uma palavra vão antes dela inteira
  // (SHORT TANK TOP, não TANK SHORT TOP); MINI/MIDI/MAXI ficam colados à palavra da peça (POLO MINI DRESS).
  const antesDaPeca = palavrasNucleo.length > 1 ? colados.filter(c => COMPRIMENTO_ANTES_DA_PECA_EN.has(c)) : [];
  const coladosNaPeca = colados.filter(c => !antesDaPeca.includes(c));
  const pecaMontada = palavrasNucleo.length
    ? [...antesDaPeca, ...palavrasNucleo.slice(0, -1), ...coladosNaPeca, palavrasNucleo.at(-1)].join(' ')
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

/* ==================== 5. Montador da frase em espanhol ==================== */

/*
 * Regras do dono (29/10/2026; ver docs/decisoes-espanhol-2026-10-29.md): o espanhol segue a
 * frase em português ao pé da letra, termo a termo pelo glossário. Nada muda de lugar e
 * nenhuma preposição entra ou sai. Os ajustes permitidos são de gramática:
 *   - concordância: o adjetivo concorda, no ES, com o mesmo substantivo com que concorda no
 *     PT (CALÇA PIJAMA LISTRADA → PANTALÓN PIJAMA RAYADO; COM GOLA BORDADA → CON CUELLO BORDADO);
 *   - E e + viram Y (E antes de I ou HI, pela ortografia espanhola);
 *   - COM/DE antes de um termo cujo ES é adjetivo cai (BLAZER DE ALFAIATARIA → BLAZER SASTRE);
 *   - REGATA como segunda peça é SIN MANGAS (VESTIDO REGATA → VESTIDO SIN MANGAS);
 *   - a peça específica que no EN absorve a genérica fica no lugar dela, sem repetir o núcleo
 *     (VESTIDO MIDI SLIP DRESS → VESTIDO MIDI LENCERO; TOP CORTININHA → TOP TRIANGULAR).
 * As fusões do EN (JORTS, HOODIE, SWEATPANTS) valem só no inglês e não existem aqui.
 */

// Conectivos do português no espanhol. EM vira DE antes de um termo do glossário (EM PU = DE
// PU) e EN antes de palavra desconhecida (EM V = EN V). Contrações e artigos concordam com o
// substantivo espanhol seguinte (NAS MANGAS = EN LAS MANGAS); sem ele, seguem o português.
const CONECTIVOS_ES = {
  COM: 'CON', 'C/': 'CON', SEM: 'SIN', 'S/': 'SIN',
  DE: 'DE', DA: 'DE', DO: 'DE', DAS: 'DE', DOS: 'DE',
  E: 'Y', A: 'A', PARA: 'PARA', 'P/': 'PARA', '+': 'Y'
};
const ARTIGOS_PT = { NO: ['EN', 'ms'], NA: ['EN', 'fs'], NOS: ['EN', 'mp'], NAS: ['EN', 'fp'], O: ['', 'ms'], OS: ['', 'mp'], AS: ['', 'fp'] };
const ARTIGOS_ES = { ms: 'EL', fs: 'LA', mp: 'LOS', fp: 'LAS' };
const PREPOSICOES_ES = new Set(['CON', 'SIN', 'DE', 'EN', 'A', 'PARA']);
// Preposições que caem antes de um termo cujo ES é adjetivo (R6).
const CAEM_ANTES_DE_ADJETIVO = new Set(['COM', 'C/', 'DE', 'DA', 'DO', 'DAS', 'DOS', 'EM']);
// Peças que, coladas depois de outra, fazem papel de modelo dela (decisões de 26 e 29/10/2026:
// VESTIDO BLAZER, VESTIDO POLO, CAMISA PIJAMA, SAIA PAREO, BLUSA CORSET JEANS, TOP CROPPED
// LINGERIE, SAIA CURTA ANÁGUA, VESTIDO REGATA). Outra peça colada (CALÇA LEGGING; MEIA CALÇA
// entrou na tabela em 03/11) é sinal de expressão que falta na tabela, e SLEEP (e SLIP fora de
// um vestido) espera o dono: revisão.
const SEGUNDAS_PECAS_ES = new Set(['BLAZER', 'POLO', 'PIJAMA', 'PAREO', 'CORSET JEANS', 'LINGERIE', 'ANAGUA', 'REGATA']);

// Gênero no PT de substantivos cuja terminação engana (chave sem acento; expressão inteira
// antes da palavra, como T SHIRT). O resto segue a terminação: -A/-ÇÃO/-GEM/-DADE/-OSE
// femininos, o restante masculino; -S final é plural.
const GENERO_PT = {
  LEGGING: 'fs', LEGGINGS: 'fp', 'T SHIRT': 'fs', 'MINI SAIA': 'fs', LINGERIE: 'fs', VISCOSE: 'fs', PELE: 'fs',
  REDE: 'fs', BASE: 'fs', CORRENTE: 'fs', CORRENTES: 'fp', FLOR: 'fs', ARTE: 'fs', MAO: 'fs', TRICOLINE: 'fs',
  GEORGETTE: 'fs', PIJAMA: 'ms', CLIMA: 'ms', MONOGRAMA: 'ms', COS: 'ms', VIES: 'ms', JEANS: 'ms', SHORTS: 'ms',
  XADREZ: 'ms', ILHOS: 'mp', ILHOSES: 'mp', MACACAO: 'ms', CARDIGA: 'ms', TAFETA: 'ms', COMPOSE: 'ms',
  'CORTA VENTO': 'ms', POLO: 'fs'
};
// Adjetivos que não mudam no gênero no PT apesar da terminação (VESTIDO MESCLA, BLUSA MESCLA).
const ADJETIVOS_INVARIAVEIS_PT = new Set(['MESCLA']);

// Gênero e número do substantivo no PT, pela palavra principal (a 1ª depois de COM/SEM/DE/EM):
// é com isso que se acha com quem o adjetivo concorda na frase em português.
function generoNumeroPT(textoPT) {
  const palavras = prepararTermo(textoPT).chave.split(' ');
  const inicio = palavras.findIndex(p => !/^(COM|C\/|SEM|S\/|DE|EM)$/.test(p));
  const palavra = palavras[Math.max(inicio, 0)];
  const excecao = GENERO_PT[palavras.slice(Math.max(inicio, 0)).join(' ')] || GENERO_PT[palavra];
  if (excecao) return { genero: excecao[0], numero: excecao[1] };
  if (/(COES|SOES|GENS|DADES|OSES|AS)$/.test(palavra)) return { genero: 'f', numero: 'p' };
  if (/(CAO|SAO|GEM|DADE|OSE|A)$/.test(palavra)) return { genero: 'f', numero: 's' };
  if (/[^S]S$/.test(palavra)) return { genero: 'm', numero: 'p' };
  return { genero: 'm', numero: 's' };
}

// Gênero e número de um adjetivo no PT pela terminação (ESTAMPADA = f/s). Adjetivo que não
// muda no gênero (FRONTAL, LEVE) devolve gênero null e concorda com o substantivo mais próximo.
function generoNumeroAdjetivoPT(textoPT) {
  const palavra = prepararTermo(textoPT).chave.split(' ').at(-1);
  if (ADJETIVOS_INVARIAVEIS_PT.has(palavra)) return { genero: null, numero: 's' };
  if (/OS$/.test(palavra)) return { genero: 'm', numero: 'p' };
  if (/AS$/.test(palavra)) return { genero: 'f', numero: 'p' };
  if (/O$/.test(palavra)) return { genero: 'm', numero: 's' };
  if (/A$/.test(palavra)) return { genero: 'f', numero: 's' };
  return { genero: null, numero: /S$/.test(palavra) ? 'p' : 's' };
}

const chaveDoTermo = unidade => prepararTermo(unidade.termo.pt).chave;
// Só COM abre um detalhe para a concordância: em SEM MANGA ALONGADA o adjetivo é da peça (não
// existe "manga alongada" para concordar), e SIN MANGAS ainda mudaria o número para plural.
const abreDetalhe = unidade => unidade.prep === 'COM' || /^(COM|C\/) /.test(chaveDoTermo(unidade));

// Último elemento da lista que atende ao critério (o mais próximo, olhando para trás).
function ultimoQue(lista, criterio) {
  for (let i = lista.length - 1; i >= 0; i -= 1) if (criterio(lista[i])) return lista[i];
  return null;
}

/**
 * Monta a tradução em espanhol. Mesmo retorno de montarTraducaoEN; `termos` traz o ES usado
 * em cada termo (`es`), já com a concordância. Estados: 'tabela', 'acima-de-40',
 * 'desconhecida' (palavra fora da tabela fica no lugar, em português), 'sem-peca' e
 * 'varias-pecas' (mais de uma peça fora de um KIT). As segundas peças decididas
 * (SEGUNDAS_PECAS_ES: VESTIDO BLAZER, SAIA CURTA ANÁGUA...) e o KIT seguem o PT e não pedem revisão.
 */
function montarTraducaoES(textoPT) {
  // O "+" é um conectivo da análise e, no ES, sai Y (KIT BLUSA + SAIA = KIT BLUSA Y FALDA).
  const { unidades } = analisarDescricao(textoPT);
  const termos = unidades.filter(u => u.tipo === 'termo');
  const desconhecidas = unidades.filter(u => u.tipo === 'desconhecida').map(u => u.valor);
  if (!termos.length) {
    return { estado: desconhecidas.length ? 'desconhecida' : 'sem-peca', traducao: String(textoPT ?? '').toUpperCase().trim(), desconhecidas, termos: [] };
  }

  // Peças, como no EN ("COM X" nunca é a peça; a negada, SEM VESTIDO, nunca é o núcleo).
  const { pecas, absorvedora } = pecasDaDescricao(unidades);
  const nucleo = pecas.find(u => u.prep !== 'SEM') || null;
  const ehKit = Boolean(nucleo) && chaveDoTermo(nucleo) === 'KIT';
  // REGATA depois de outra peça é a manga da primeira; num KIT é peça própria (CAMISETA SIN MANGAS).
  const regataComoManga = new Set(pecas.filter(u => u !== nucleo && !ehKit && chaveDoTermo(u) === 'REGATA'));
  const pecasReais = pecas.filter(u => !regataComoManga.has(u));
  // Peças da mesma família que o EN junta numa só (absorção): o ES segue o PT e não repete o
  // começo comum. Genérica antes: a específica fica no lugar dela, sem o que repete (VESTIDO
  // MIDI SLIP DRESS → VESTIDO MIDI LENCERO; TOP CORTININHA → TOP TRIANGULAR; CORTININHA
  // CORTININHA COM BOJO → TOP TRIANGULAR CON RELLENO). Genérica depois e inteira no começo da
  // específica: ela cai (BLAZER DE MOLETOM BLAZER JEANS → BLAZER DE FELPA DENIM). Fora disso,
  // são duas peças e a linha vai para revisão.
  const semRepetir = new Map(); // peça → o ES dela sem o começo repetido ('' = a peça cai)
  for (const [generica, especifica] of absorvedora) {
    const g = generica.termo.es.texto.split(' ');
    const e = especifica.termo.es.texto.split(' ');
    let comum = 0;
    while (comum < g.length && comum < e.length && g[comum] === e[comum]) comum += 1;
    if (!comum) continue;
    if (unidades.indexOf(generica) < unidades.indexOf(especifica)) {
      if (e.length > comum) semRepetir.set(especifica, e.slice(comum).join(' '));
    } else if (comum === g.length) {
      semRepetir.set(generica, '');
    }
  }
  const colada = u => unidades[unidades.indexOf(u) - 1]?.tipo === 'termo' && SEGUNDAS_PECAS_ES.has(chaveDoTermo(u));
  // A genérica absorvida que o ES não resolve conta como outra peça, mesmo colada: BLAZER depois
  // de BLAZER DE MOLETOM não é o VESTIDO BLAZER da R14. A REGATA que vira manga continua manga
  // (CORTININHA COM BOJO REGATA = TOP TRIANGULAR CON RELLENO SIN MANGAS, R15).
  const outraPecaES = u => !semRepetir.has(u) && (!colada(u) || (absorvedora.has(u) && !regataComoManga.has(u)));
  const variasPecas = !ehKit && pecas.filter(u => u !== nucleo).some(outraPecaES);

  // Substantivos com que um adjetivo pode concordar, na ordem em que aparecem. O modelo de
  // jaqueta (PUFFER, BOMBER), a segunda peça colada (CAMISA POLO, VESTIDO BLAZER) e a peça sem o
  // começo repetido (o LENCERO), que fazem papel de modelo, cedem o gênero à peça; a que cai
  // também não conta.
  const comoAlvo = u => {
    const es = u.termo.es;
    if (!es?.genero || regataComoManga.has(u) || semRepetir.has(u) || (u !== nucleo && colada(u))) return null;
    if (u.termo.indice === 14 && nucleo && u !== nucleo) return null;
    const pt = generoNumeroPT(u.termo.pt);
    return { generoPT: pt.genero, numeroPT: pt.numero, formaES: es.genero + (es.numero || 's'), peca: pecasReais.includes(u) };
  };
  const alvoDoNucleo = nucleo ? comoAlvo(nucleo) : null;
  const alvos = [];
  let detalheAberto = null; // substantivo de um "COM X" logo antes: COM GOLA BORDADA

  const formaConcordada = u => {
    const { formas, texto } = u.termo.es;
    const adjetivo = generoNumeroAdjetivoPT(u.termo.pt);
    // Depois de COM/SEM o particípio é substantivo (COM DRAPEADO = CON DRAPEADO): forma do próprio PT.
    if (u.prep === 'COM' || u.prep === 'SEM') return formas[(adjetivo.genero || 'm') + adjetivo.numero] || texto;
    const combina = alvo => (!adjetivo.genero || alvo.generoPT === adjetivo.genero) && alvo.numeroPT === adjetivo.numero;
    const alvo = (detalheAberto && combina(detalheAberto) ? detalheAberto : null)
      || ultimoQue(alvos, a => a.peca && combina(a))
      || ultimoQue(alvos, a => !a.peca && combina(a));
    if (alvo) return formas[alvo.formaES] || texto;
    // Nenhum substantivo conhecido bate. Logo depois de uma palavra fora da tabela, é com ela que
    // o adjetivo concorda (DE TUELE ESTAMPADO): fica a forma do PT. Senão, a peça principal
    // (erro de concordância do PT, como ETIQUETA BORDADO, sai certo).
    const desconhecidaAntes = unidades[unidades.indexOf(u) - 1]?.tipo === 'desconhecida';
    if (desconhecidaAntes && adjetivo.genero) return formas[adjetivo.genero + adjetivo.numero] || texto;
    const reserva = alvoDoNucleo || alvos.at(-1);
    return (reserva && formas[reserva.formaES]) || texto;
  };

  const conectivo = (u, proxima) => {
    const termo = proxima?.tipo === 'termo' ? proxima.termo : null;
    if (termo?.es?.adjetivo && CAEM_ANTES_DE_ADJETIVO.has(u.palavra)) return '';
    if (u.palavra === 'EM') return termo ? 'DE' : 'EN';
    if (ARTIGOS_PT[u.palavra]) {
      const [preposicao, formaPT] = ARTIGOS_PT[u.palavra];
      const forma = termo?.es?.genero ? termo.es.genero + (termo.es.numero || 's') : formaPT;
      return [preposicao, ARTIGOS_ES[forma]].filter(Boolean).join(' ');
    }
    return CONECTIVOS_ES[u.palavra] ?? u.palavra;
  };

  const saida = [];
  const usados = [];
  let preposicaoAnterior = false; // a última palavra da saída é uma preposição vinda de um conectivo
  unidades.forEach((u, i) => {
    if (u.tipo === 'desconhecida') {
      saida.push(u.valor);
      detalheAberto = null;
      preposicaoAnterior = false;
      return;
    }
    if (u.tipo === 'conectivo') {
      const texto = conectivo(u, unidades[i + 1]);
      saida.push(texto);
      preposicaoAnterior = PREPOSICOES_ES.has(texto);
      detalheAberto = null;
      return;
    }
    const es = u.termo.es;
    let texto;
    // Genérica que repete o começo da específica anterior: cai, sem mexer no resto da frase (e
    // fica fora dos termos usados, para o contexto da DeepL não levar um par sem tradução). Como
    // peça, fecha o detalhe aberto antes dela.
    if (semRepetir.get(u) === '') { detalheAberto = null; return; }
    if (regataComoManga.has(u)) texto = 'SIN MANGAS';
    else if (semRepetir.has(u)) texto = semRepetir.get(u);
    else if (es?.classe === 'flexivel') texto = formaConcordada(u);
    else texto = es?.texto || u.termo.pt; // todo termo FECHADO tem ES (um teste confere)
    // Expressão que traz a própria preposição (COM CAPUZ = CON CAPUCHA, ESPINHA DE PEIXE = DE
    // ESPIGA, OMBRO ÚNICO = DE UN SOLO HOMBRO) vale no lugar da preposição do PT (R9). O Y fica,
    // e o SIN também: tirar a negação inverteria o sentido (SEM ESPINHA DE PEIXE).
    if (preposicaoAnterior && saida.at(-1) !== 'SIN' && PREPOSICOES_ES.has(texto.split(' ')[0])) saida.pop();
    preposicaoAnterior = false;
    saida.push(texto);
    usados.push({ pt: u.termo.pt, es: texto, indice: u.termo.indice, prep: u.prep });

    const alvo = comoAlvo(u);
    if (alvo) {
      alvos.push(alvo);
      detalheAberto = abreDetalhe(u) ? alvo : null;
    } else if (abreDetalhe(u) || semRepetir.has(u)) {
      // COM X sem gênero no ES (COM CINTURA ALTA = CON TIRO ALTO) fecha o detalhe anterior: em
      // CALÇA COM FIVELA COM CINTURA ALTA LISTRADA, LISTRADA é da calça, não da FIVELA. A peça sem
      // o começo repetido também fecha: SAIA COM PALA SAIA CURTA ESTAMPADA = … CORTA ESTAMPADA.
      detalheAberto = null;
    }
  });

  // Descrição cortada pelo SAP no meio (… COM DETALHE DE ZÍPER E): o conectivo solto no fim
  // cai, como no EN, em vez de deixar "Y" ou "CON" pendurado na frase em espanhol.
  for (let i = unidades.length - 1; i >= 0 && unidades[i].tipo === 'conectivo'; i -= 1) saida.pop();

  // Y vira E antes de palavra que começa com o som de I (Y IMPRESO → E IMPRESO; HIELO fica Y).
  const palavras = saida.join(' ').split(' ').filter(Boolean);
  const traducao = palavras
    .map((palavra, i) => (palavra === 'Y' && /^(I|Í|HI(?![AEOUÁÉÓÚ])|HÍ)/.test(palavras[i + 1] || '') ? 'E' : palavra))
    .join(' ');

  let estado = 'tabela';
  if (desconhecidas.length) estado = 'desconhecida';
  else if (!nucleo) estado = 'sem-peca';
  else if (variasPecas) estado = 'varias-pecas';
  else if (traducao.length > LIMITE_SAP) estado = 'acima-de-40';

  return { estado, traducao, desconhecidas, termos: usados };
}

/**
 * Tradução local: a frase montada pela tabela mestra, no idioma pedido.
 */
function processarTraducaoLocal(textoPT, idiomaDestino = 'EN') {
  return montarTraducao(textoPT, idiomaDestino).traducao;
}

module.exports = {
  normalizarParaBusca,
  listarCorrespondencias,
  paresDoGlossario,
  montarContextoGlossario,
  montarLotesParaTraducao,
  montarTraducao,
  montarTraducaoES,
  processarTraducaoLocal,
  LIMITE_SAP
};
