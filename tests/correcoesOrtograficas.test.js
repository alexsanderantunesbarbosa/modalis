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
    '100ALGODÓN',
    'CALÇA JCALÇA JEANS BOOTCUT',
    'SHHORT SARJA BAGGY'
  ];

  for (const texto of exemplos) {
    const resultado = sugerirCorrecaoGrafia(texto);
    assert.equal(resultado.textoOriginal, texto);
    assert.equal(resultado.textoSugerido, texto);
    assert.deepEqual(resultado.ocorrencias, []);
  }
});
