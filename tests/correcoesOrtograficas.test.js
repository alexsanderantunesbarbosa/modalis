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
  assert.equal(sugerirCorrecaoGrafia('CALÇA JCALÇA JEANS BOOTCUT').textoSugerido, 'CALÇA CALÇA JEANS BOOTCUT');
  assert.equal(sugerirCorrecaoGrafia('SHHORT SARJA BAGGY').textoSugerido, 'SHORT SARJA BAGGY');
  assert.equal(sugerirCorrecaoGrafia('VESTIDO SUPER MID OMBRO ÚNICO').textoSugerido, 'VESTIDO SUPER MIDI OMBRO ÚNICO');
  assert.equal(sugerirCorrecaoGrafia('T-SHIRT BABYLOOK MANGA CURTA').textoSugerido, 'T-SHIRT BABY LOOK MANGA CURTA');
  assert.equal(sugerirCorrecaoGrafia('CALÇA CORROT COM TERMO').textoSugerido, 'CALÇA CARROT COM TERMO');
  assert.equal(sugerirCorrecaoGrafia('SUPER MIDI').ocorrencias.length, 0);
});
