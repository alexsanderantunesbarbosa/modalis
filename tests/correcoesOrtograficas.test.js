// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
const test = require('node:test');
const assert = require('node:assert/strict');
const { sugerirCorrecaoGrafia } = require('../correcoesOrtograficas');

test('sugere a correção conhecida sem alterar o texto original', () => {
  const resultado = sugerirCorrecaoGrafia('FULL LENGHT');

  assert.equal(resultado.textoOriginal, 'FULL LENGHT');
  assert.equal(resultado.textoSugerido, 'FULL LENGTH');
  assert.deepEqual(resultado.ocorrencias, ['FULL LENGHT']);
});

test('reconhece variações de caixa e preserva o restante da descrição', () => {
  const resultado = sugerirCorrecaoGrafia('blusa BRAZER azul');

  assert.equal(resultado.textoOriginal, 'blusa BRAZER azul');
  assert.equal(resultado.textoSugerido, 'blusa BLAZER azul');
});

test('sugere mais de uma correção na mesma descrição', () => {
  const resultado = sugerirCorrecaoGrafia('FULL LENGHT JEASN');

  assert.equal(resultado.textoSugerido, 'FULL LENGTH JEANS');
  assert.deepEqual(resultado.ocorrencias, ['FULL LENGHT', 'JEASN']);
});

test('não corrige uma sequência quando o candidato faz parte de outra palavra', () => {
  const resultado = sugerirCorrecaoGrafia('BRAZERS');

  assert.equal(resultado.textoSugerido, 'BRAZERS');
  assert.deepEqual(resultado.ocorrencias, []);
});

test('mantém texto sem candidatos exatamente como foi recebido', () => {
  const texto = 'T-SHIRT jeans';
  const resultado = sugerirCorrecaoGrafia(texto);

  assert.equal(resultado.textoOriginal, texto);
  assert.equal(resultado.textoSugerido, texto);
  assert.deepEqual(resultado.ocorrencias, []);
});

test('não sugere correções para exemplos reais ainda sem decisão', () => {
  const exemplos = [
    '1000% COTTO',
    '100ALGODÓN'
  ];

  for (const texto of exemplos) {
    const resultado = sugerirCorrecaoGrafia(texto);
    assert.equal(resultado.textoOriginal, texto);
    assert.equal(resultado.textoSugerido, texto);
    assert.deepEqual(resultado.ocorrencias, []);
  }
});

test('corrige os erros recorrentes do lote de 22/10/2026', () => {
  assert.equal(sugerirCorrecaoGrafia('CALÇA JCALÇA JEANS BOOTCUT').textoSugerido, 'CALÇA JEANS BOOTCUT');
  assert.equal(sugerirCorrecaoGrafia('SHHORT SARJA BAGGY').textoSugerido, 'SHORT SARJA BAGGY');
  assert.equal(sugerirCorrecaoGrafia('VESTIDO SUPER MID OMBRO ÚNICO').textoSugerido, 'VESTIDO SUPER MIDI OMBRO ÚNICO');
  assert.equal(sugerirCorrecaoGrafia('T-SHIRT BABYLOOK MANGA CURTA').textoSugerido, 'T-SHIRT BABY LOOK MANGA CURTA');
  assert.equal(sugerirCorrecaoGrafia('CALÇA CORROT COM TERMO').textoSugerido, 'CALÇA CARROT COM TERMO');
  assert.equal(sugerirCorrecaoGrafia('SUPER MIDI').ocorrencias.length, 0);
});

test('corrige os erros que ainda escapavam no corpus (lote de 03/11/2026)', () => {
  assert.equal(sugerirCorrecaoGrafia('BLAZER OVERIZED DE CREPE PATOU').textoSugerido, 'BLAZER OVERSIZED DE CREPE PATOU');
  assert.equal(sugerirCorrecaoGrafia('T-SHIIRT OVERSIZED COM ARTE').textoSugerido, 'T-SHIRT OVERSIZED COM ARTE');
  assert.equal(sugerirCorrecaoGrafia('BLUSA COM DRAPEADO MANHA LONGA DE MALHA').textoSugerido, 'BLUSA COM DRAPEADO MANGA LONGA DE MALHA');
  assert.equal(sugerirCorrecaoGrafia('CALÇA JEANS MIDE LEG CINTURA BAIXA').textoSugerido, 'CALÇA JEANS WIDE LEG CINTURA BAIXA');
  assert.equal(sugerirCorrecaoGrafia('VESTIDO LONGO DECOTE DEGADÊ COM RENDA').textoSugerido, 'VESTIDO LONGO DECOTE DEGAGÊ COM RENDA');
  assert.equal(sugerirCorrecaoGrafia('SHORT TRICÔ HOT PANT').textoSugerido, 'SHORT TRICÔ HOT PANTS');
  // A forma certa não é tocada: HOT PANT não casa dentro de HOT PANTS, nem HOTPANT dentro de HOTPANTS.
  assert.equal(sugerirCorrecaoGrafia('SHORT HOT PANTS').ocorrencias.length, 0);
  assert.equal(sugerirCorrecaoGrafia('SHORT HOTPANTS').ocorrencias.length, 0);
  // MANHA só é corrigida antes de LONGA/CURTA.
  assert.equal(sugerirCorrecaoGrafia('BLUSA MANHA').ocorrencias.length, 0);
});

test('LENGHT sozinho vira LENGTH, e FULL LENGHT continua uma ocorrência só (lote de 04/11/2026)', () => {
  assert.equal(sugerirCorrecaoGrafia('CALÇA JEANS LENGHT CINTURA MÉDIA').textoSugerido, 'CALÇA JEANS LENGTH CINTURA MÉDIA');
  assert.deepEqual(sugerirCorrecaoGrafia('CALÇA FULL LENGHT').ocorrencias, ['FULL LENGHT']);
  assert.equal(sugerirCorrecaoGrafia('CALÇA FULL LENGHT').textoSugerido, 'CALÇA FULL LENGTH');
  // A grafia certa não é tocada.
  assert.equal(sugerirCorrecaoGrafia('CALÇA FULL LENGTH').ocorrencias.length, 0);
});

test('colapsa palavra repetida em sequência, inclusive a que sobra de outra correção', () => {
  const resultado = sugerirCorrecaoGrafia('CALÇA JCALÇA JEANS BOOTCUT COM RESINA');
  assert.equal(resultado.textoSugerido, 'CALÇA JEANS BOOTCUT COM RESINA');
  assert.deepEqual(resultado.ocorrencias, ['JCALÇA', 'CALÇA CALÇA']);

  assert.equal(sugerirCorrecaoGrafia('SAIA SAIA MIDI').textoSugerido, 'SAIA MIDI');
  assert.equal(sugerirCorrecaoGrafia('VESTIDO LONGO LONGO LONGO').textoSugerido, 'VESTIDO LONGO');
  // Repetição legítima com outra palavra no meio não é tocada.
  assert.equal(sugerirCorrecaoGrafia('BLUSA MANGA LONGA GOLA LONGA').ocorrencias.length, 0);
});
