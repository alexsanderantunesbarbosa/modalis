/**
 * processadorTexto.js
 * Módulo responsável por preparar o texto em PT-BR e tratar as regras gramaticais.
 */

const { expressoesCompostas, dicionarioTermos } = require('./tabelaMestra');

/**
 * Normaliza o texto aplicando regras de negócio antes ou depois da tradução.
 */
function processarTraducaoLocal(textoPT, idiomaDestino = 'EN') {
  let textoFormatado = textoPT.trim().toUpperCase();
  const langKey = idiomaDestino.toUpperCase().startsWith('ES') ? 'ES' : 'EN';

  // 1. Substituir Expressões Compostas (N-Grams)
  const expressoes = expressoesCompostas[langKey] || [];
  expressoes.forEach(item => {
    const regex = new RegExp(`\\b${item.pt}\\b`, 'g');
    textoFormatado = textoFormatado.replace(regex, item.target);
  });

  // 2. Substituir Unigramas (Palavras isoladas)
  const dicionario = dicionarioTermos[langKey] || {};
  const palavras = textoFormatado.split(/\s+/);
  
  const palavrasTraduzidas = palavras.map(palavra => {
    return dicionario[palavra] || palavra;
  });

  return palavrasTraduzidas.join(' ');
}

module.exports = {
  processarTraducaoLocal
};