const test = require('node:test');
const assert = require('node:assert/strict');
const {
  listarCorrespondencias,
  montarContextoGlossario,
  agruparTextosPorContexto,
  processarTraducaoLocal
} = require('../processadorTexto');
const { indices, termosPendentes, expressoesCompostas, dicionarioTermos } = require('../tabelaMestra');

test('carrega os dezesseis índices recategorizados e deriva as expressões compostas deles', () => {
  assert.equal(indices.length, 16);
  assert.equal(indices.flatMap(indice => indice.termos).length, 805);
  assert.ok(expressoesCompostas.EN.some(item => item.pt === 'CINTURA ALTA'));
  assert.ok(expressoesCompostas.EN.some(item => item.pt === 'MINI-SAIA'));
  assert.ok(expressoesCompostas.EN.some(item => item.pt === 'BOLSO FACA' && item.target === 'SLASH POCKET'));
  assert.ok(termosPendentes.every(item => item.status === 'VALIDAR'));
  assert.ok(expressoesCompostas.EN.some(item => item.pt === 'MALHA PESADA' && item.target === 'HEAVY KNIT'));
  assert.equal(dicionarioTermos.EN.PIJAMA, 'PAJAMAS');
  assert.equal(dicionarioTermos.EN.ACETINADA, 'SATIN');
  assert.equal(dicionarioTermos.EN.TRICOT, 'KNIT');
  assert.ok(expressoesCompostas.EN.some(item => item.pt === 'GOLA ALTA' && item.contexto === 'AGASALHO' && item.target === 'HIGH COLLAR'));
});

test('prioriza expressões compostas e respeita o índice revisado', () => {
  assert.equal(processarTraducaoLocal('calça cintura alta', 'EN'), 'PANTS HIGH-RISE');
});

test('preserva BORDADO como adjetivo e COM BORDADO como detalhe', () => {
  assert.equal(processarTraducaoLocal('moletom bordado', 'EN'), 'SWEATSHIRT EMBROIDERED');
  assert.equal(processarTraducaoLocal('short com bordado', 'EN'), 'SHORTS WITH EMBROIDERY');
});

test('normaliza hífen e espaço na expressão MINI-SAIA', () => {
  assert.equal(processarTraducaoLocal('mini-saia', 'EN'), 'MINI SKIRT');
  assert.equal(processarTraducaoLocal('mini saia', 'EN'), 'MINI SKIRT');
});

test('preserva MANGA 3/4 como expressão protegida do índice de mangas', () => {
  assert.equal(processarTraducaoLocal('manga 3/4', 'EN'), '3/4 SLEEVE');
});

test('aplica as formas femininas com a mesma tradução do masculino', () => {
  assert.equal(processarTraducaoLocal('blusa canelada texturizada', 'EN'), 'BLOUSE RIBBED TEXTURED');
  assert.equal(processarTraducaoLocal('blusa assimétrica', 'EN'), 'BLOUSE ASYMMETRIC');
});

test('resolve expressões contextuais de jeans e moletom', () => {
  assert.equal(processarTraducaoLocal('calça jeans bootcut', 'EN'), 'JEANS BOOTCUT');
  assert.equal(processarTraducaoLocal('moletom canguru', 'EN'), 'HOODIE');
  assert.equal(processarTraducaoLocal('calça de moletom', 'EN'), 'SWEATPANTS');
  assert.equal(processarTraducaoLocal('camisa jeans', 'EN'), 'DENIM SHIRT');
  assert.equal(processarTraducaoLocal('short jeans comfort', 'EN'), 'JORTS COMFORT');
  assert.equal(processarTraducaoLocal('bermuda jeans', 'EN'), 'JORTS');
  assert.equal(processarTraducaoLocal('bermuda sarja', 'EN'), 'SHORTS TWILL');
  assert.equal(processarTraducaoLocal('short de moletom', 'EN'), 'SWEAT SHORTS');
  assert.equal(processarTraducaoLocal('calça pijama listrada', 'EN'), 'PAJAMA PANTS STRIPED');
});

test('só termos fechados entram no contexto antes da API', () => {
  const contexto = montarContextoGlossario(['calça cintura alta e xyzzy'], 'EN');

  assert.match(contexto, /CALÇA = PANTS/);
  assert.match(contexto, /CINTURA ALTA = HIGH-RISE/);
  assert.doesNotMatch(contexto, /XYZZY/);
  assert.match(montarContextoGlossario(['tricoline'], 'EN'), /TRICOLINE = POPLIN/);
});

test('separa contextos do glossário por descrição na tradução em massa', () => {
  const grupos = agruparTextosPorContexto([
    'calça cintura alta',
    'camisa jeans',
    'calça cintura alta'
  ], 'EN-US');

  assert.equal(grupos.length, 2);
  const grupoCalca = grupos.find(grupo => grupo.indices.includes(0));
  const grupoCamisa = grupos.find(grupo => grupo.indices.includes(1));
  assert.deepEqual(grupoCalca.indices, [0, 2]);
  assert.match(grupoCalca.contexto, /CINTURA ALTA = HIGH-RISE/);
  assert.doesNotMatch(grupoCalca.contexto, /DENIM/);
  assert.match(grupoCamisa.contexto, /JEANS = DENIM/);
  assert.doesNotMatch(grupoCamisa.contexto, /HIGH-RISE/);
});

test('preserva as traduções legadas em espanhol', () => {
  assert.equal(processarTraducaoLocal('manga longa', 'ES'), 'MANGA LARGA');
});

test('não corrige silenciosamente os erros reais ainda não validados', () => {
  assert.equal(processarTraducaoLocal('1000% COTTO', 'EN'), '1000% COTTO');
  assert.equal(processarTraducaoLocal('100ALGODÓN', 'EN'), '100ALGODÓN');
  assert.equal(
    processarTraducaoLocal('CALÇA JCALÇA JEANS BOOTCUT', 'EN'),
    'PANTS JCALÇA JEANS BOOTCUT'
  );
  assert.equal(processarTraducaoLocal('SHHORT SARJA BAGGY', 'EN'), 'SHHORT TWILL BAGGY');
});

test('mantém os acentos das palavras desconhecidas no fallback local', () => {
  assert.equal(processarTraducaoLocal('camisa azul petróleo', 'EN'), 'SHIRT AZUL PETRÓLEO');
});
