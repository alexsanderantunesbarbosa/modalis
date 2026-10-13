/**
 * tabelaMestra.js
 * Módulo de dados e regras de tradução técnica.
 */

// 1. Expressões Compostas (N-Grams) - Devem ser substituídas PRIMEIRO para evitar quebras
const expressoesCompostas = {
  EN: [
    { pt: "BARRA DOBRADA", target: "TURN-UP HEM" },
    { pt: "BARRA ITALIANA", target: "CUFFED HEM" },
    { pt: "BOLSO FACA", target: "WELT POCKET" }, 
    { pt: "CINTURA ALTA", target: "HIGH-RISE" },
    { pt: "CINTURA BAIXA", target: "LOW-RISE" },
    { pt: "CINTURA MÉDIA", target: "MID-RISE" },
    { pt: "CINTURA MEDIA", target: "MID-RISE" },
    { pt: "CORTE A LASER", target: "LASER-CUT" },
    { pt: "CORTE EVASÊ", target: "A-LINE CUT" },
    { pt: "CORTE RETO", target: "STRAIGHT CUT" },
    { pt: "DECOTE CANOA", target: "BOAT NECK" },
    { pt: "DECOTE CARECA", target: "CREW NECK" },
    { pt: "DECOTE PROFUNDO", target: "PLUNGING NECKLINE" },
    { pt: "DECOTE QUADRADO", target: "SQUARE NECK" },
    { pt: "DECOTE REDONDO", target: "ROUND NECK" },
    { pt: "DECOTE V", target: "V-NECK" },
    { pt: "ESTAMPA LOCAL", target: "PLACEMENT PRINT" },
    { pt: "FRENTE ÚNICA", target: "HALTERNECK" },
    { pt: "FRENTE UNICA", target: "HALTERNECK" },
    { pt: "GOLA ALTA", target: "TURTLENECK" },
    { pt: "GOLA PADRE", target: "MANDARIN COLLAR" },
    { pt: "MANGA CURTA", target: "SHORT SLEEVE" },
    { pt: "MANGA 3/4", target: "3/4 SLEEVE" },
    { pt: "GOLA REDONDA", target: "ROUND COLLAR" },
    { pt: "GOLA V", target: "V-NECK" },
    { pt: "GOLA POLO", target: "POLO COLLAR" },
    { pt: "MANGAS CURTAS", target: "SHORT SLEEVES" },
    { pt: "MANGA LONGA", target: "LONG SLEEVE" },
    { pt: "MANGAS LONGAS", target: "LONG SLEEVES" },
    { pt: "MANGA MÉDIA", target: "HALF-LENGTH SLEEVE" },
    { pt: "MEIA MANGA", target: "HALF SLEEVE" },
    { pt: "SEM MANGAS", target: "SLEEVELESS" },
    { pt: "SEM MANGA", target: "SLEEVELESS" },
    { pt: "SEM COSTURA", target: "SEAMLESS" },
    { pt: "SEM COSTURAS", target: "SEAMLESS" },
    { pt: "OMBRO A OMBRO", target: "OFF-THE-SHOULDER" },
    { pt: "OMBRO ÚNICO", target: "ONE-SHOULDER" },
    { pt: "TOMARA QUE CAIA", target: "STRAPLESS" },
    { pt: "COM BORDADO", target: "WITH EMBROIDERY" },
    { pt: "COM BOTÕES", target: "WITH BUTTONS" },
    { pt: "COM ESTAMPA", target: "WITH PRINT" },
    { pt: "COM FRANJAS", target: "WITH FRINGES" },
    { pt: "COM LISTRAS", target: "WITH STRIPES" },
    { pt: "COM PÉROLAS", target: "WITH PEARLS" },
    { pt: "COM BRILHO", target: "WITH SHIMMER" },
    { pt: "COM METAL", target: "WITH METAL" },
    { pt: "COM PEDRARIA", target: "WITH STONES" },
    { pt: "COM RENDA", target: "WITH LACE" },
    { pt: "DE RENDA", target: "WITH LACE" },
    { pt: "COM CACHECOL", target: "WITH SCARF" },
    { pt: "COM CAPUZ", target: "WITH HOOD" },
    { pt: "COM FRANJA", target: "WITH FRINGE" },
    { pt: "WITH PEARLS", target: "WITH PEARLS" },
    { pt: "COM TACHAS", target: "WITH STUDS" },
    { pt: "EM TULE", target: "WITH TULLE" },
    { pt: "VESTIDO T-DRESS", target: "T-DRESS" },
    { pt: "MINI-SAIA", target: "MINI SKIRT" },
    { pt: "MINI SAIA", target: "MINI SKIRT" },
    { pt: "SHORT SAIA", target: "SKORT" },
    { pt: "SHORTS SAIA", target: "SKORT" },
    { pt: "SHORT-SAIA", target: "SKORT" },
    { pt: "SHORTS-SAIA", target: "SKORT" },
    { pt: "SAIA LONGA", target: "MAXI SKIRT" },
    { pt: "SAIA MIDI", target: "MIDI SKIRT" },
    { pt: "SAIA CURTA", target: "MINI SKIRT" },
    { pt: "VESTIDO LONGO", target: "MAXI DRESS" },
    { pt: "VESTIDO MIDI", target: "MIDI DRESS" },
    { pt: "VESTIDO CURTO", target: "SHORT DRESS" },
  ],
  ES: [
    { pt: "CINTURA ALTA", target: "CINTURA ALTA" },
    { pt: "MANGA LONGA", target: "MANGA LARGA" },
    { pt: "MANGA CURTA", target: "MANGA CORTA" }
  ]
};

// 2. Dicionário de Unigramas (Palavras Individuais)
const dicionarioTermos = {
  EN: {
    "CALÇA": "PANTS",
    "CALCAS": "PANTS",
    "BERMUDA": "BERMUDA SHORTS",
    "SHORT": "SHORTS",
    "SHORTS": "SHORTS",
    "SAIA": "SKIRT",
    "VESTIDO": "DRESS",
    "MACACÃO": "JUMPSUIT",
    "MACAQUINHO": "ROMPER",
    "BLUSA": "BLOUSE",
    "CAMISA": "SHIRT",
    "CAMISETA": "T-SHIRT",
    "REGATA": "TANK TOP",
    "CASACO": "COAT",
    "JAQUETA": "JACKET",
    "LISO": "PLAIN",
    "LISA": "PLAIN",
    "ESTAMPADO": "PRINTED",
    "ESTAMPADA": "PRINTED"
  },
  ES: {
    "CALÇA": "PANTALÓN",
    "BERMUDA": "BERMUDA",
    "SAIA": "FALDA",
    "VESTIDO": "VESTIDO",
    "BLUSA": "BLUSA",
    "CAMISA": "CAMISA"
  }
};

module.exports = {
  expressoesCompostas,
  dicionarioTermos
};