/**
 * correcoesOrtograficas.js
 * Sugestões candidatas vistas na planilha da coleção; nenhuma é aplicada sem aceitação.
 * Esta lista é separada do glossário e não altera as traduções oficiais.
 */

const sugestoesGrafia = [
  { de: 'FULL LENGHT', para: 'FULL LENGTH' },
  { de: 'BRAZER', para: 'BLAZER' },
  { de: 'CCASACO', para: 'CASACO' },
  { de: 'VISOSE', para: 'VISCOSE' },
  { de: 'MÉIDIA', para: 'MÉDIA' },
  { de: 'MEIDIA', para: 'MÉDIA' },
  { de: 'JEASN', para: 'JEANS' },
  { de: 'REAGATA', para: 'REGATA' },
  { de: 'BODY BODY', para: 'BODY' },
  { de: 'TRICOT', para: 'TRICÔ' }
];

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sugerirCorrecaoGrafia(textoOriginal) {
  let textoSugerido = textoOriginal;
  const ocorrencias = [];

  for (const regra of sugestoesGrafia) {
    const termo = regra.de.split(/\s+/).map(escaparRegex).join('\\s+');
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${termo})(?=$|[^\\p{L}\\p{N}])`, 'giu');
    let encontrou = false;
    textoSugerido = textoSugerido.replace(regex, (trecho, prefixo) => {
      encontrou = true;
      return prefixo + regra.para;
    });
    if (encontrou) ocorrencias.push(regra.de);
  }

  return {
    textoOriginal,
    textoSugerido: ocorrencias.length ? textoSugerido : textoOriginal,
    ocorrencias
  };
}

module.exports = { sugerirCorrecaoGrafia };
