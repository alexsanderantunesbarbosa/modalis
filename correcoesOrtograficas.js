// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
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
  { de: 'TRICOT', para: 'TRICÔ' },
  // Lote 22/10/2026: erros recorrentes nas planilhas IN27 e AI27.
  { de: 'CONFORT', para: 'COMFORT' },
  { de: 'MOLETAM', para: 'MOLETOM' },
  { de: 'MOLETON', para: 'MOLETOM' },
  { de: 'SUPER MID', para: 'SUPER MIDI' },
  { de: 'TDRESS', para: 'T-DRESS' },
  { de: 'TRENCHCOAT', para: 'TRENCH COAT' },
  { de: 'BABYLOOK', para: 'BABY LOOK' },
  { de: 'TSHIRT', para: 'T-SHIRT' },
  { de: 'JCALÇA', para: 'CALÇA' },
  { de: 'ILHÓSES', para: 'ILHOSES' },
  { de: 'CORROT', para: 'CARROT' },
  { de: 'AVIO', para: 'AVIÔ' },
  { de: 'CINNTURA', para: 'CINTURA' },
  { de: 'SHHORT', para: 'SHORT' },
  // Lote 03/11/2026: erros que ainda escapavam no corpus IN27+AI27 (1 ocorrência cada).
  { de: 'OVERIZED', para: 'OVERSIZED' },
  { de: 'OVERZISED', para: 'OVERSIZED' },
  { de: 'OVERSISED', para: 'OVERSIZED' },
  { de: 'T-SHIIRT', para: 'T-SHIRT' },
  { de: 'VEESTIDO', para: 'VESTIDO' },
  { de: 'BALZER', para: 'BLAZER' },
  { de: 'LOMGO', para: 'LONGO' },
  { de: 'MANHA LONGA', para: 'MANGA LONGA' },
  { de: 'MANHA CURTA', para: 'MANGA CURTA' },
  { de: 'FRNTE', para: 'FRENTE' },
  { de: 'TUELE', para: 'TULE' },
  { de: 'ALFAITARIA', para: 'ALFAIATARIA' },
  { de: 'ULTILITARIA', para: 'UTILITÁRIA' },
  { de: 'XADREX', para: 'XADREZ' },
  { de: 'MALHA PESASA', para: 'MALHA PESADA' },
  { de: 'CONSTRASTANTE', para: 'CONTRASTANTE' },
  { de: 'SAMLESS', para: 'SEAMLESS' },
  { de: 'BOTCUT', para: 'BOOTCUT' },
  { de: 'BALOON', para: 'BALLOON' },
  { de: 'MIDE LEG', para: 'WIDE LEG' },
  { de: 'DEGADÊ', para: 'DEGAGÊ' },
  { de: 'DEGADE', para: 'DEGAGÊ' },
  { de: 'JAQUARD', para: 'JACQUARD' },
  { de: 'METALASSE', para: 'MATELASSÊ' },
  { de: 'CACHECOUER', para: 'CACHEQUER' },
  { de: 'HOTPANT', para: 'HOTPANTS' },
  { de: 'HOT PANT', para: 'HOT PANTS' },
  // SLIPDRESS e SLIP DRESS não têm regra: o setor escreve assim e a DESCRIÇÃO fica como veio
  // (decisão do dono de 05/11/2026). Quem traduz certo é a tabela (SLIP DRESS / VESTIDO LENCERO).
  { de: 'STRAIGTH', para: 'STRAIGHT' },
  // Lote 04/11/2026: LENGHT sozinho (antes só existia FULL LENGHT → FULL LENGTH, que vem antes).
  { de: 'LENGHT', para: 'LENGTH' }
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

  // Palavra repetida em sequência (CALÇA CALÇA, BODY BODY), inclusive a que
  // sobra depois de uma regra como JCALÇA → CALÇA. Vira uma única ocorrência.
  const repetida = /(^|[^\p{L}\p{N}])([\p{L}\p{N}-]+)(?:\s+\2)+(?=$|[^\p{L}\p{N}])/giu;
  textoSugerido = textoSugerido.replace(repetida, (trecho, prefixo, palavra) => {
    ocorrencias.push(trecho.slice(prefixo.length));
    return prefixo + palavra;
  });

  return {
    textoOriginal,
    textoSugerido: ocorrencias.length ? textoSugerido : textoOriginal,
    ocorrencias
  };
}

module.exports = { sugerirCorrecaoGrafia };
