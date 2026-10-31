const test = require('node:test');
const assert = require('node:assert/strict');
const { montarTraducao, LIMITE_SAP } = require('../processadorTexto');

// Exemplos de referência do CLAUDE.md e casos decididos com o negócio em 24/10/2026.
// Cada um é um teste de aceitação: a frase precisa sair exatamente assim.
const ACEITACAO = [
  ['BERMUDA JEANS COMFORT CINTURA MÉDIA', 'MID-RISE COMFORT JORTS'],
  ['VESTIDO CURTO MANGA LONGA COM BRILHOS', 'LONG SLEEVE SHORT DRESS WITH SHIMMER'],
  ['MOLETOM MANGA LONGA COM CAPUZ', 'LONG SLEEVE HOODIE'],
  ['LEGGING FUSÔ CINTURA ALTA SEAMLESS', 'HIGH-RISE SEAMLESS STIRRUP LEGGINGS'],
  ['CASACO MÉDIO DE PELO COM METAL', 'MID-LENGTH FAUX FUR COAT WITH METAL'],
  ['CALÇA PIJAMA LISTRADA', 'STRIPED PAJAMA PANTS'],
  ['SAIA JEANS MINI CINTURA BAIXA COM BRILHO', 'LOW-RISE DENIM MINI SKIRT WITH SHIMMER'],
  ['JAQUETA PUFFER MÉDIA GOLA ALTA', 'MID-LENGTH HIGH COLLAR PUFFER JACKET'],
  // preposições: COM = detalhe; DE/EM + tecido = material; termo solto = adjetivo
  ['SHORT CINTURA MÉDIA COM RECORTES', 'MID-RISE SHORTS WITH CUTOUTS'],
  ['VESTIDO CURTO COM OMBRO DESLOCADO', 'SHORT DRESS WITH DROP SHOULDER'],
  ['BLUSA MANGA CURTA EM MALHA', 'SHORT SLEEVE KNIT BLOUSE'],
  ['MOLETOM BORDADO', 'EMBROIDERED SWEATSHIRT'],
  ['SHORT COM BORDADO', 'SHORTS WITH EMBROIDERY'],
  ['VESTIDO LONGO SEM PADRONAGEM', 'LONG DRESS WITHOUT PATTERN'],
  // modificador dentro do detalhe
  ['BODY MANGA LONGA COM PALA BORDADA', 'LONG SLEEVE BODYSUIT WITH EMBROIDERED YOKE'],
  ['CASACO CURTO COM FAIXA E BOTÕES EM METAL', 'SHORT COAT WITH SASH AND METAL BUTTONS'],
  ['CALÇA CARROT COM DETALHE EM ZÍPER', 'CARROT PANTS WITH ZIPPER DETAIL'],
  ['BLUSA SEM MANGAS COM PELO REMOVÍVEL', 'SLEEVELESS BLOUSE WITH REMOVABLE FAUX FUR'],
  // contexto lido da própria descrição (JEANS, MOLETOM, GOLA ALTA, capuz)
  ['CALÇA JEANS RETA CINTURA MÉDIA COM LENÇO', 'MID-RISE STRAIGHT JEANS WITH SCARF'],
  ['BLAZER SLIM DE MOLETOM', 'SLIM FLEECE BLAZER'],
  ['JAQUETA DE MOLETOM COM CAPUZ', 'HOODED FLEECE JACKET'],
  ['CALÇA RETA CINTURA MÉDIA DE MOLETOM', 'MID-RISE STRAIGHT SWEATPANTS'],
  ['SHORT DE MOLETOM CINTURA ALTA', 'HIGH-RISE SWEAT SHORTS'],
  ['JAQUETA CROPPED JEANS', 'CROPPED DENIM JACKET'],
  ['JEANS SKINNY CINTURA ALTA', 'HIGH-RISE SKINNY JEANS'],
  ['CALÇA JEANS BOOTCUT', 'BOOTCUT JEANS'],
  ['BLUSA GOLA ALTA MANGA LONGA', 'LONG SLEEVE TURTLENECK BLOUSE'],
  ['MOLETOM OVERSIZED MANGA LONGA', 'OVERSIZED LONG SLEEVE SWEATSHIRT'],
  // peça dentro de expressão, peça específica absorve a genérica, nome de linha, PARKA sozinha
  ['SELENE TOP CORTININHA', 'SELENE TRIANGLE TOP'],
  ['PARKA SARJA ALONGADA', 'LONGLINE TWILL PARKA'],
  ['BLUSA DE ALÇA ESTAMPADA ACETINADA', 'STRAPPY PRINTED SATIN BLOUSE'],
  ['BLUSA AJUSTADA DE ALÇAS', 'FITTED STRAPPY BLOUSE'],
  ['REGATA DECOTE U', 'U-NECK TANK TOP'],
  // achados da revisão de 24/10/2026
  ['CALÇA SEM BOLSO E COM CINTO', 'PANTS WITH BELT WITHOUT POCKET'],
  ['BLUSA COM BOLSO E SEM MANGA', 'SLEEVELESS BLOUSE WITH POCKET'],
  ['JAQUETA COM CAPUZ E BOLSOS', 'HOODED JACKET WITH POCKETS'],
  ['MOLETOM COM CAPUZ E NAME', 'HOODIE WITH NAME'],
  ['MOLETOM CANGURU COM CAPUZ', 'HOODIE'],
  ['PARKA DE MOLETOM', 'FLEECE PARKA'],
  ['HOT PANTS JEANS', 'DENIM HOT PANTS'],
  ['VESTIDO CANELADO CURTO MANGA CURTA', 'SHORT SLEEVE RIBBED SHORT DRESS'],
  ['MACACÃO DE RENDA LONGO MANGA LONGA', 'LONG SLEEVE LACE LONG JUMPSUIT'],
  // 30/10/2026: LOOSE LOW SLIM é nome de modelo e não se traduz (mais baixo e mais justo que a cintura baixa
  // normal, segundo a estilista); o LOW do nome não é repetição do LOW-RISE e não pode sumir
  ['CALÇA JEANS LOOSE LOW SLIM CINTURA BAIXA', 'LOW-RISE LOOSE LOW SLIM JEANS'],
  // inglês repetido entra uma vez (SLIM e JUSTA são ambos SLIM)
  ['BLUSA SLIM JUSTA', 'SLIM BLOUSE'],
  ['BLUSA COM BOTÕES OVERSIZED', 'OVERSIZED BLOUSE WITH BUTTONS'],
  ['BLUSA MANGA LONGA COM ZÍPER JACQUARD', 'LONG SLEEVE JACQUARD BLOUSE WITH ZIPPER'],
  ['BODY DE ALÇAS COM METAL MALHA PESADA', 'STRAPPY HEAVY KNIT BODYSUIT WITH METAL'],
];

for (const [pt, esperado] of ACEITACAO) {
  test(`monta "${pt}" como "${esperado}"`, () => {
    const resultado = montarTraducao(pt, 'EN');
    assert.equal(resultado.traducao, esperado);
    // Frases certas acima de 40 caracteres são marcadas (nunca cortadas), não rejeitadas.
    assert.equal(resultado.estado, esperado.length > LIMITE_SAP ? 'acima-de-40' : 'tabela');
  });
}

test('estados: palavra fora da tabela fica no fim, em português, e marca "desconhecida"', () => {
  const resultado = montarTraducao('CAMISA AZUL PETRÓLEO', 'EN');
  assert.equal(resultado.estado, 'desconhecida');
  assert.equal(resultado.traducao, 'SHIRT AZUL PETRÓLEO');
  assert.deepEqual(resultado.desconhecidas, ['AZUL', 'PETRÓLEO']);
});

test('estados: sem nenhum termo conhecido, a descrição volta como veio', () => {
  assert.equal(montarTraducao('1000% COTTO', 'EN').traducao, '1000% COTTO');
  assert.equal(montarTraducao('', 'EN').estado, 'sem-peca');
});

test('estados: duas peças marcam "varias-pecas" sem perder nenhuma', () => {
  const resultado = montarTraducao('KIT BODY CANELADO E BLUSA MANGA LONGA', 'EN');
  assert.equal(resultado.estado, 'varias-pecas');
  assert.match(resultado.traducao, /SET/);
  assert.match(resultado.traducao, /BODYSUIT/);
  assert.match(resultado.traducao, /BLOUSE/);
});

test('estados: acima de 40 caracteres é marcado, nunca cortado', () => {
  const resultado = montarTraducao('BLUSA MANGA MÉDIA COM GOLA EM PLANO LEVE', 'EN');
  assert.equal(resultado.estado, 'acima-de-40');
  assert.ok(resultado.traducao.length > LIMITE_SAP);
  assert.match(resultado.traducao, /LIGHT WOVEN BLOUSE/);
});

test('o resultado lista os termos usados com a preposição que definiu o papel de cada um', () => {
  const { termos } = montarTraducao('CALÇA CARROT COM DETALHE EM ZÍPER', 'EN');
  assert.deepEqual(termos.map(t => [t.pt, t.prep]), [['CALÇA', null], ['CARROT', null], ['COM DETALHE', null], ['ZÍPER', 'DE']]);
});

test('caixa, acentos e espaços não mudam a montagem', () => {
  assert.equal(montarTraducao('  bermuda  jeans comfort cintura media ', 'EN').traducao, 'MID-RISE COMFORT JORTS');
});
