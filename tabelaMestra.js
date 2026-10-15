/**
 * Tabela mestra MODALIS.
 * Os índices 1–12 vieram da versão revisada pelo negócio.
 * Novos termos ainda em revisão ficam com status VALIDAR e não são aplicados.
 */

const indices = [
  {
    "id": 1,
    "nome": "CATEGORIAS DE PEÇA",
    "termos": [
      {
        "pt": "BLUSA",
        "en": "BLOUSE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAMISA",
        "en": "SHIRT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "T-SHIRT",
        "en": "T-SHIRT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAMISETA",
        "en": "T-SHIRT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "REGATA",
        "en": "TANK TOP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOP",
        "en": "TOP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BODY",
        "en": "BODYSUIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BLAZER",
        "en": "BLAZER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JAQUETA",
        "en": "JACKET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CASACO",
        "en": "COAT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COLETE",
        "en": "VEST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VESTIDO",
        "en": "DRESS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SAIA",
        "en": "SKIRT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CALÇA",
        "en": "PANTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SHORT",
        "en": "SHORTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BERMUDA",
        "en": "BERMUDA SHORTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LEGGING",
        "en": "LEGGINGS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MACACÃO",
        "en": "JUMPSUIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MACAQUINHO",
        "en": "ROMPER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARDIGÃ",
        "en": "CARDIGAN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SUÉTER",
        "en": "SWEATER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PONCHO",
        "en": "PONCHO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "KIMONO",
        "en": "KIMONO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "KAFTAN",
        "en": "CAFTAN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BIKINI",
        "en": "BIKINI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BIQUÍNI",
        "en": "BIKINI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MAIÔ",
        "en": "ONE-PIECE SWIMSUIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SAÍDA DE PRAIA",
        "en": "BEACH COVER-UP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PIJAMA",
        "en": "PAJAMAS",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 2,
    "nome": "MODELAGEM / FIT",
    "termos": [
      {
        "pt": "OVERSIZE",
        "en": "OVERSIZED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OVERSIZED",
        "en": "OVERSIZED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SLIM",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JUSTO",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JUSTA",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "REGULAR",
        "en": "REGULAR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RELAXED",
        "en": "RELAXED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AMPLO",
        "en": "WIDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AMPLA",
        "en": "WIDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SOLTO",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SOLTA",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DESCOLADO",
        "en": "RELAXED FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DESCOLADA",
        "en": "RELAXED FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CROPPED",
        "en": "CROPPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALONGADO",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALONGADA",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLUIDO",
        "en": "FLUID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLUIDA",
        "en": "FLUID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESVOAÇANTE",
        "en": "FLOWY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTRUTURADO",
        "en": "STRUCTURED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTRUTURADA",
        "en": "STRUCTURED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACINTURADO",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACINTURADA",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ASSIMÉTRICO",
        "en": "ASYMMETRIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRADICIONAL",
        "en": "CLASSIC FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BÁSICO",
        "en": "BASIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BÁSICA",
        "en": "BASIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESPORTIVO",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESPORTIVA",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "UTILITÁRIO",
        "en": "UTILITY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "UTILITÁRIA",
        "en": "UTILITY",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 3,
    "nome": "MODELAGENS DE CALÇA / SHORT / BERMUDA",
    "termos": [
      {
        "pt": "RETA",
        "en": "STRAIGHT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SLIM",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SKINNY",
        "en": "SKINNY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "WIDE LEG",
        "en": "WIDE LEG",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOOTCUT",
        "en": "BOOTCUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOOT CUT",
        "en": "BOOTCUT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FLARE",
        "en": "FLARE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CROPPED FLARE",
        "en": "CROPPED FLARE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BAGGY",
        "en": "BAGGY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SUPER BAGGY",
        "en": "SUPER BAGGY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOYFRIEND",
        "en": "BOYFRIEND",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "X-BOYFRIEND",
        "en": "X-BOYFRIEND",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MOM",
        "en": "MOM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MOM CROPPED",
        "en": "MOM CROPPED",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "JEGGING",
        "en": "JEGGING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TAPERED",
        "en": "TAPERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARROT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARRO FIT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CARROT CROPPED",
        "en": "CARROT CROPPED",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BARREL",
        "en": "BARREL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LOOSE BARREL",
        "en": "LOOSE BARREL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BALLOON",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BALLON",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALADIM",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALADIN",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALADDIN",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARGO",
        "en": "CARGO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARPENTER",
        "en": "CARPENTER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JOGGER",
        "en": "JOGGER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JOGGING",
        "en": "JOGGING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PANTALONA",
        "en": "WIDE LEG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PANTACOURT",
        "en": "PANTACOURT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAPRI",
        "en": "CAPRI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORSÁRIO",
        "en": "CAPRI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SARUEL",
        "en": "HAREM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PIJAMA",
        "en": "PAJAMA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BAGGY BALLOON",
        "en": "BAGGY BALLOON",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BAGGY BALLOON MAXXY",
        "en": "BAGGY BALLOON MAXXY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BAGGY BALLOON CROPPED",
        "en": "BAGGY BALLOON CROPPED",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BALLOON MAXXY",
        "en": "BALLOON MAXXY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHAPE NOW",
        "en": "SHAPE NOW",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FULL LENGTH",
        "en": "FULL LENGTH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PALAZZO",
        "en": "PALAZZO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RETA SLIM",
        "en": "SLIM STRAIGHT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GRANDFATHER",
        "en": "GRANDFATHER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "HOTPANTS",
        "en": "HOTPANTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MICRO",
        "en": "MICRO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SHORTS SAIA",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHORT SAIA",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SAIA SHORT",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SAIA SHORTS",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 4,
    "nome": "COMPRIMENTO",
    "termos": [
      {
        "pt": "CURTO",
        "en": "SHORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CURTA",
        "en": "SHORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LONGO",
        "en": "LONG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LONGA",
        "en": "LONG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MÉDIO",
        "en": "MID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MÉDIA",
        "en": "MID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MIDI",
        "en": "MIDI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SUPER MIDI",
        "en": "SUPER MIDI",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SUPER-MIDI",
        "en": "SUPER MIDI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FULL LENGTH",
        "en": "FULL LENGTH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CROPPED",
        "en": "CROPPED",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 5,
    "nome": "CINTURA / RISE",
    "termos": [
      {
        "pt": "CINTURA",
        "en": "WAIST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CINTURA ALTA",
        "en": "HIGH-RISE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CINTURA MÉDIA",
        "en": "MID-RISE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CINTURA BAIXA",
        "en": "LOW-RISE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SUPER HIGH",
        "en": "SUPER HIGH-RISE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MEGA HIGH",
        "en": "MEGA HIGH-RISE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CÓS",
        "en": "WAISTBAND",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CÓS DE ELÁSTICO",
        "en": "ELASTIC WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 6,
    "nome": "MANGAS",
    "termos": [
      {
        "pt": "MANGA",
        "en": "SLEEVE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MANGA CURTA",
        "en": "SHORT SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA LONGA",
        "en": "LONG SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA MÉDIA",
        "en": "MID-LENGTH SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MEIA MANGA",
        "en": "HALF SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA ÚNICA",
        "en": "ONE-SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SEM MANGA",
        "en": "SLEEVELESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SEM MANGAS",
        "en": "SLEEVELESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA MORCEGO",
        "en": "BATWING SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA RAGLÃ",
        "en": "RAGLAN SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA FLARE",
        "en": "FLARED SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA AMPLA",
        "en": "WIDE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA ALONGADA",
        "en": "ELONGATED SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 7,
    "nome": "GOLA / DECOTE",
    "termos": [
      {
        "pt": "GOLA",
        "en": "COLLAR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GOLA ALTA",
        "en": "TURTLENECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA POLO",
        "en": "POLO COLLAR",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA PADRE",
        "en": "MANDARIN COLLAR",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE",
        "en": "NECKLINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DECOTE CANOA",
        "en": "BOAT NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE CARECA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE PROFUNDO",
        "en": "PLUNGING NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE QUADRADO",
        "en": "SQUARE NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE REDONDO",
        "en": "ROUND NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE V",
        "en": "V-NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE U",
        "en": "U-NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE RETO",
        "en": "STRAIGHT NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE DEGAGÊ",
        "en": "COWL NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE NADADOR",
        "en": "RACERBACK NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "NADADOR",
        "en": "RACERBACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOMARA QUE CAIA",
        "en": "STRAPLESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SEM ALÇA",
        "en": "STRAPLESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FRENTE ÚNICA",
        "en": "HALTER NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "OMBRO ÚNICO",
        "en": "ONE-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "OMBRO A OMBRO",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 8,
    "nome": "TECIDOS / MATERIAIS",
    "termos": [
      {
        "pt": "ALGODÃO",
        "en": "COTTON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LINHO",
        "en": "LINEN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SEDA",
        "en": "SILK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PALHA DE SEDA",
        "en": "SILK STRAW",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "VISCOSE",
        "en": "VISCOSE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLIÉSTER",
        "en": "POLYESTER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLIAMIDA",
        "en": "POLYAMIDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ELASTANO",
        "en": "ELASTANE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACRÍLICO",
        "en": "ACRYLIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACETATO",
        "en": "ACETATE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLIURETANO",
        "en": "POLYURETHANE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLIETILENO",
        "en": "POLYETHYLENE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLIPROPILENO",
        "en": "POLYPROPYLENE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LIOCEL",
        "en": "LYOCELL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CÂNHAMO",
        "en": "HEMP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RAMI",
        "en": "RAMIE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LÃ",
        "en": "WOOL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CASHMERE",
        "en": "CASHMERE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAXEMIRA",
        "en": "CASHMERE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DENIM",
        "en": "DENIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JEANS",
        "en": "DENIM",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "TECIDO"
      },
      {
        "pt": "JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CALÇA"
      },
      {
        "pt": "SARJA",
        "en": "TWILL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CETIM",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CHIFFON",
        "en": "CHIFFON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TULE",
        "en": "TULLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "JACQUARD",
        "en": "JACQUARD",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LUREX",
        "en": "LUREX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RENDA",
        "en": "LACE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VELUDO",
        "en": "VELVET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VELUDO COTELÊ",
        "en": "CORDUROY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PU",
        "en": "PU",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COURO",
        "en": "LEATHER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COURO SINTÉTICO",
        "en": "SYNTHETIC LEATHER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CAMURÇA",
        "en": "SUEDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SUEDE",
        "en": "SUEDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ORGANZA",
        "en": "ORGANZA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TAFETÁ",
        "en": "TAFFETA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRICÔ",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MALHA",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MALHA FLAME",
        "en": "SLUB KNIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "RIBANA",
        "en": "RIB KNIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CROCHÊ",
        "en": "CROCHET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MACRAMÊ",
        "en": "MACRAMÉ",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CALÇA"
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CARECA"
      },
      {
        "pt": "MOLETOM",
        "en": "HOODIE",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CANGURU"
      },
      {
        "pt": "MOLETOM",
        "en": "FLEECE",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "TECIDO DE OUTRAS PEÇAS"
      },
      {
        "pt": "MATELASSÊ",
        "en": "QUILTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CREPE",
        "en": "CREPE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CREPE PATOU",
        "en": "CREPE PATOU",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 9,
    "nome": "TEXTURAS / ACABAMENTOS",
    "termos": [
      {
        "pt": "CANELADO",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACETINADO",
        "en": "SATINATED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TEXTURIZADO",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLOCADO",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RESINADO",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "METALIZADO",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MATELASSÊ",
        "en": "QUILTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PLISSADO",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRAPEADO",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANZIDO",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DESFIADO",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANÇADO",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TORÇÃO",
        "en": "TWIST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TORCIDO",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RELEVO",
        "en": "EMBOSSED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM RELEVO",
        "en": "WITH EMBOSSED",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BICOLOR",
        "en": "TWO-TONE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTAMPADO",
        "en": "PRINTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTAMPADA",
        "en": "PRINTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTAMPA",
        "en": "PRINT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM ESTAMPA",
        "en": "WITH PRINT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ESTAMPA E BRILHO",
        "en": "WITH PRINT AND SHINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ESTAMPA E BRILHOS",
        "en": "WITH PRINT AND SHINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LISTRA",
        "en": "STRIPE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LISTRAS",
        "en": "STRIPES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LISTRADO",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LISTRADA",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LISTRADOS",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LISTRADAS",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "XADREZ",
        "en": "PLAID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RISCA DE GIZ",
        "en": "PINSTRIPE",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 10,
    "nome": "DETALHES / AVIAMENTOS",
    "termos": [
      {
        "pt": "DETALHE",
        "en": "DETAIL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DETALHES",
        "en": "DETAILS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM DETALHE",
        "en": "WITH DETAIL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM DETALHES",
        "en": "WITH DETAILS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "APLICAÇÃO",
        "en": "APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "APLICAÇÕES",
        "en": "APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM APLICAÇÃO",
        "en": "WITH APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM APLICAÇÕES",
        "en": "WITH APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM APLICAÇÃO DE RENDA",
        "en": "WITH LACE APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "AVIAMENTO",
        "en": "TRIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AVIAMENTOS",
        "en": "TRIMS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM AVIAMENTO",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM AVIAMENTOS",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BORDADO",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BORDADA",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BORDADOS",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BORDADAS",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM BORDADO",
        "en": "WITH EMBROIDERY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM BORDADOS",
        "en": "WITH EMBROIDERY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PEDRARIA",
        "en": "RHINESTONE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PEDRARIAS",
        "en": "RHINESTONES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM PEDRARIA",
        "en": "WITH RHINESTONE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM PEDRARIAS",
        "en": "WITH RHINESTONES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PAETÊ",
        "en": "SEQUIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PAETÊS",
        "en": "SEQUINS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM PAETÊ",
        "en": "WITH SEQUINS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM PAETÊS",
        "en": "WITH SEQUINS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "METAL",
        "en": "METAL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM METAL",
        "en": "WITH METAL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORRENTE",
        "en": "CHAIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORRENTES",
        "en": "CHAINS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM CORRENTE",
        "en": "WITH CHAIN",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM CORRENTES",
        "en": "WITH CHAINS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ARGOLA",
        "en": "RING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ARGOLAS",
        "en": "RINGS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM ARGOLA",
        "en": "WITH RING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ARGOLAS",
        "en": "WITH RINGS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FIVELA",
        "en": "BUCKLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FIVELAS",
        "en": "BUCKLES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM FIVELA",
        "en": "WITH BUCKLE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM FIVELAS",
        "en": "WITH BUCKLES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOTÃO",
        "en": "BUTTON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOTÕES",
        "en": "BUTTONS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM BOTÃO",
        "en": "WITH BUTTON",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM BOTÕES",
        "en": "WITH BUTTONS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ZÍPER",
        "en": "ZIPPER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ZÍPERES",
        "en": "ZIPPERS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM ZÍPER",
        "en": "WITH ZIPPER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ZÍPERES",
        "en": "WITH ZIPPERS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COLCHETE",
        "en": "CLASP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COLCHETES",
        "en": "CLASPS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM COLCHETE",
        "en": "WITH CLASP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM COLCHETES",
        "en": "WITH CLASPS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ILHÓ",
        "en": "EYELET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ILHÓS",
        "en": "EYELETS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM ILHÓ",
        "en": "WITH EYELETS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ILHÓS",
        "en": "WITH EYELETS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BROCHE",
        "en": "BROOCH",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BROCHES",
        "en": "BROOCHES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM BROCHE",
        "en": "WITH BROOCH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM BROCHES",
        "en": "WITH BROOCHES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PÉROLA",
        "en": "PEARL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PÉROLAS",
        "en": "PEARLS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM PÉROLA",
        "en": "WITH PEARLS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM PÉROLAS",
        "en": "WITH PEARLS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CRISTAL",
        "en": "CRYSTAL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CRISTAIS",
        "en": "CRYSTALS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM CRISTAL",
        "en": "WITH CRYSTALS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM CRISTAIS",
        "en": "WITH CRYSTALS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PINGENTE",
        "en": "PENDANT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PINGENTES",
        "en": "PENDANTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM PINGENTE",
        "en": "WITH PENDANT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM PINGENTES",
        "en": "WITH PENDANTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TACHA",
        "en": "STUD",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TACHAS",
        "en": "STUDS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM TACHA",
        "en": "WITH STUDS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM TACHAS",
        "en": "WITH STUDS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FRANJA",
        "en": "FRINGE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANJAS",
        "en": "FRINGE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM FRANJA",
        "en": "WITH FRINGE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM FRANJAS",
        "en": "WITH FRINGE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BARBICACHO",
        "en": "TASSEL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BARBICACHOS",
        "en": "TASSELS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM BARBICACHO",
        "en": "WITH TASSEL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM BARBICACHOS",
        "en": "WITH TASSELS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LAÇO",
        "en": "BOW",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LAÇOS",
        "en": "BOWS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM LAÇO",
        "en": "WITH BOW",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM LAÇOS",
        "en": "WITH BOWS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "NÓ",
        "en": "KNOT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NÓS",
        "en": "KNOTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM NÓ",
        "en": "WITH KNOT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM NÓS",
        "en": "WITH KNOTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FAIXA",
        "en": "SASH",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FAIXAS",
        "en": "SASHES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM FAIXA",
        "en": "WITH SASH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM FAIXAS",
        "en": "WITH SASHES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CINTO",
        "en": "BELT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CINTOS",
        "en": "BELTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM CINTO",
        "en": "WITH BELT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM CINTOS",
        "en": "WITH BELTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PASSANTE",
        "en": "BELT LOOP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PASSANTES",
        "en": "BELT LOOPS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM PASSANTE",
        "en": "WITH BELT LOOPS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM PASSANTES",
        "en": "WITH BELT LOOPS",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 11,
    "nome": "BOLSOS",
    "termos": [
      {
        "pt": "BOLSA",
        "en": "BAG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOLSAS",
        "en": "BAGS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOLSO",
        "en": "POCKET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOLSOS",
        "en": "POCKETS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOLSO FACA",
        "en": "SLASH POCKET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOLSO CARGO",
        "en": "CARGO POCKET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FORRO DE BOLSO",
        "en": "POCKET LINING",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 12,
    "nome": "CONSTRUÇÃO / MODELAGEM DA PEÇA",
    "termos": [
      {
        "pt": "RECORTE",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RECORTES",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VAZADO",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VAZADA",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VAZADOS",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VAZADAS",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ABERTURA",
        "en": "OPENING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FENDA",
        "en": "SLIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COSTURA",
        "en": "SEAM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COSTURA ABERTA",
        "en": "OPEN SEAM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COSTURA APARENTE",
        "en": "EXPOSED SEAM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BARRA",
        "en": "HEM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BARRA DOBRADA",
        "en": "FOLDED HEM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BARRA ITALIANA",
        "en": "CUFFED HEM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PUNHO",
        "en": "CUFF",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GOLA",
        "en": "COLLAR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PALA",
        "en": "YOKE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LAPELA",
        "en": "LAPEL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CÓS",
        "en": "WAISTBAND",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PASSANTE",
        "en": "BELT LOOP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FORRO",
        "en": "LINING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FORRO DE BOLSO",
        "en": "POCKET LINING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CAPUZ",
        "en": "HOOD",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CARCELA",
        "en": "PLACKET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VIÉS",
        "en": "BIAS BINDING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DEBRUM",
        "en": "PIPING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PESPONTO",
        "en": "TOPSTITCHING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NERVURA",
        "en": "PINTUCK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PREGA",
        "en": "PLEAT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PREGAS",
        "en": "PLEATS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRAPEADO",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRAPEADA",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRAPEADOS",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRAPEADAS",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANZIDO",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANZIDA",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANZIDOS",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRANZIDAS",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANSPASSE",
        "en": "WRAP DETAIL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANSPASSADO",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANSPASSADA",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANSPASSADOS",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRANSPASSADAS",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SOBREPOSIÇÃO",
        "en": "OVERLAY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DOBRADO",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DOBRADA",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DOBRADOS",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DOBRADAS",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  }
];

for (const indice of indices) {
  for (const termo of indice.termos) {
    if (/[\s\-\/]/.test(termo.pt)) termo.tipo = 'expressao';
  }
}

function adicionarTermos(indiceId, termos) {
  const indice = indices.find(item => item.id === indiceId);
  if (!indice) throw new Error(`Índice ${indiceId} não existe na tabela mestra.`);

  for (const [pt, en, status = 'VALIDAR', origem = 'IN27'] of termos) {
    const duplicado = indice.termos.some(item => item.pt === pt && item.en === en);
    if (duplicado) continue;
    indice.termos.push({
      pt,
      en,
      status,
      tipo: /[\s\-\/]/.test(pt) ? 'expressao' : 'termo',
      origem
    });
  }
}

// Formas femininas e flexionadas usam a tradução já aprovada para o masculino.
adicionarTermos(2, [
  ['ASSIMÉTRICA', 'ASYMMETRIC', 'FECHADO', 'forma feminina do índice revisado'],
  ['AJUSTADO', 'FITTED', 'VALIDAR', 'IN27'],
  ['AJUSTADA', 'FITTED', 'VALIDAR', 'forma feminina de AJUSTADO; IN27'],
  ['COMFORT', 'COMFORT', 'VALIDAR', 'IN27'],
  ['EVASÊ', 'A-LINE', 'VALIDAR', 'IN27; confirmar aplicação por tipo de peça']
]);

adicionarTermos(4, [
  ['MINI-SAIA', 'MINI SKIRT', 'FECHADO', 'expressão composta legada validada'],
  ['MINI SAIA', 'MINI SKIRT', 'FECHADO', 'expressão composta legada validada'],
  ['MINI', 'MINI', 'VALIDAR', 'IN27'],
  ['MAXI', 'MAXI', 'VALIDAR', 'IN27'],
  ['SAIA LONGA', 'MAXI SKIRT', 'VALIDAR', 'expressão composta legada'],
  ['SAIA MIDI', 'MIDI SKIRT', 'VALIDAR', 'expressão composta legada'],
  ['SAIA CURTA', 'MINI SKIRT', 'VALIDAR', 'expressão composta legada'],
  ['VESTIDO LONGO', 'MAXI DRESS', 'VALIDAR', 'expressão composta legada'],
  ['VESTIDO MIDI', 'MIDI DRESS', 'VALIDAR', 'expressão composta legada'],
  ['VESTIDO CURTO', 'SHORT DRESS', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(6, [
  ['MANGA 3/4', '3/4 SLEEVE', 'FECHADO', 'expressão composta legada preservada'],
  ['MANGAS CURTAS', 'SHORT SLEEVES', 'VALIDAR', 'expressão composta legada'],
  ['MANGAS LONGAS', 'LONG SLEEVES', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(7, [
  ['ALÇA', 'STRAP', 'VALIDAR', 'IN27'],
  ['ALÇAS', 'STRAPS', 'VALIDAR', 'IN27'],
  ['GOLA REDONDA', 'ROUND COLLAR', 'VALIDAR', 'expressão composta legada'],
  ['GOLA V', 'V-NECK', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(8, [
  ['JERSEY', 'JERSEY', 'VALIDAR', 'IN27'],
  ['TWEED', 'TWEED', 'VALIDAR', 'IN27'],
  ['TRICOLINE', 'POPLIN', 'VALIDAR', 'IN27'],
  ['COTELÊ', 'CORDUROY', 'VALIDAR', 'IN27'],
  ['GEORGETTE', 'GEORGETTE', 'VALIDAR', 'IN27'],
  ['PELO', 'FUR', 'VALIDAR', 'IN27; depende do contexto'],
  ['CALÇA JEANS', 'JEANS', 'FECHADO', 'expressão protegida do índice revisado'],
  ['CALÇA DE JEANS', 'JEANS', 'FECHADO', 'expressão protegida do índice revisado'],
  ['CALÇA MOLETOM', 'SWEATPANTS', 'FECHADO', 'expressão protegida do índice revisado'],
  ['CALÇA DE MOLETOM', 'SWEATPANTS', 'FECHADO', 'expressão protegida do índice revisado'],
  ['MOLETOM CALÇA', 'SWEATPANTS', 'FECHADO', 'expressão protegida do índice revisado'],
  ['MOLETOM CANGURU', 'HOODIE', 'FECHADO', 'expressão protegida do índice revisado'],
  ['MOLETOM CARECA', 'SWEATSHIRT', 'FECHADO', 'expressão protegida do índice revisado'],
  ['MOLETOM GOLA CARECA', 'SWEATSHIRT', 'FECHADO', 'expressão protegida do índice revisado']
]);

adicionarTermos(9, [
  ['CANELADA', 'RIBBED', 'FECHADO', 'forma feminina do índice revisado'],
  ['CANELADOS', 'RIBBED', 'FECHADO', 'plural do índice revisado'],
  ['CANELADAS', 'RIBBED', 'FECHADO', 'plural feminino do índice revisado'],
  ['ACETINADA', 'SATINATED', 'FECHADO', 'forma feminina do índice revisado'],
  ['ACETINADOS', 'SATINATED', 'FECHADO', 'plural do índice revisado'],
  ['ACETINADAS', 'SATINATED', 'FECHADO', 'plural feminino do índice revisado'],
  ['TEXTURIZADA', 'TEXTURED', 'FECHADO', 'forma feminina do índice revisado'],
  ['TEXTURIZADOS', 'TEXTURED', 'FECHADO', 'plural do índice revisado'],
  ['TEXTURIZADAS', 'TEXTURED', 'FECHADO', 'plural feminino do índice revisado'],
  ['FLOCADA', 'FLOCKED', 'FECHADO', 'forma feminina do índice revisado'],
  ['FLOCADOS', 'FLOCKED', 'FECHADO', 'plural do índice revisado'],
  ['FLOCADAS', 'FLOCKED', 'FECHADO', 'plural feminino do índice revisado'],
  ['RESINADA', 'RESIN-COATED', 'FECHADO', 'forma feminina do índice revisado'],
  ['RESINADOS', 'RESIN-COATED', 'FECHADO', 'plural do índice revisado'],
  ['RESINADAS', 'RESIN-COATED', 'FECHADO', 'plural feminino do índice revisado'],
  ['METALIZADA', 'METALLIC', 'FECHADO', 'forma feminina do índice revisado'],
  ['METALIZADOS', 'METALLIC', 'FECHADO', 'plural do índice revisado'],
  ['METALIZADAS', 'METALLIC', 'FECHADO', 'plural feminino do índice revisado'],
  ['PLISSADA', 'PLEATED', 'FECHADO', 'forma feminina do índice revisado'],
  ['PLISSADOS', 'PLEATED', 'FECHADO', 'plural do índice revisado'],
  ['PLISSADAS', 'PLEATED', 'FECHADO', 'plural feminino do índice revisado'],
  ['DESFIADA', 'FRAYED', 'FECHADO', 'forma feminina do índice revisado'],
  ['DESFIADOS', 'FRAYED', 'FECHADO', 'plural do índice revisado'],
  ['DESFIADAS', 'FRAYED', 'FECHADO', 'plural feminino do índice revisado'],
  ['TRANÇADA', 'BRAIDED', 'FECHADO', 'forma feminina do índice revisado'],
  ['TRANÇADOS', 'BRAIDED', 'FECHADO', 'plural do índice revisado'],
  ['TRANÇADAS', 'BRAIDED', 'FECHADO', 'plural feminino do índice revisado'],
  ['TORCIDA', 'TWISTED', 'FECHADO', 'forma feminina do índice revisado'],
  ['TORCIDOS', 'TWISTED', 'FECHADO', 'plural do índice revisado'],
  ['TORCIDAS', 'TWISTED', 'FECHADO', 'plural feminino do índice revisado'],
  ['BRILHO', 'SHIMMER', 'VALIDAR', 'IN27'],
  ['CONTRASTE', 'CONTRAST', 'VALIDAR', 'IN27'],
  ['MESCLA', 'HEATHERED', 'VALIDAR', 'IN27']
]);

adicionarTermos(10, [
  ['OMBREIRA', 'SHOULDER PAD', 'VALIDAR', 'IN27'],
  ['OMBREIRAS', 'SHOULDER PADS', 'VALIDAR', 'IN27'],
  ['COM BRILHO', 'WITH SHIMMER', 'VALIDAR', 'expressão composta legada'],
  ['COM CACHECOL', 'WITH SCARF', 'VALIDAR', 'expressão composta legada'],
  ['COM CAPUZ', 'WITH HOOD', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(12, [
  ['AMARRAÇÃO', 'TIE DETAIL', 'FECHADO', 'terminologia previamente decidida'],
  ['COSTAS À MOSTRA', 'BACKLESS', 'FECHADO', 'terminologia previamente decidida'],
  ['COSTAS VAZADAS', 'CUTOUT BACK', 'FECHADO', 'terminologia previamente decidida'],
  ['COSTAS ABERTAS', 'OPEN BACK', 'VALIDAR', 'IN27'],
  ['ALFAIATARIA', 'TAILORED', 'VALIDAR', 'IN27; depende da construção da frase'],
  ['ABOTOAMENTO', 'BUTTON CLOSURE', 'VALIDAR', 'IN27'],
  ['ELÁSTICO', 'ELASTIC', 'VALIDAR', 'IN27; depende da função na peça'],
  ['CORTE A LASER', 'LASER-CUT', 'VALIDAR', 'expressão composta legada'],
  ['CORTE EVASÊ', 'A-LINE CUT', 'VALIDAR', 'expressão composta legada'],
  ['CORTE RETO', 'STRAIGHT CUT', 'VALIDAR', 'expressão composta legada'],
  ['SEM COSTURA', 'SEAMLESS', 'VALIDAR', 'expressão composta legada'],
  ['SEM COSTURAS', 'SEAMLESS', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(1, [
  ['CORSET', 'CORSET', 'VALIDAR', 'IN27'],
  ['TRENCH COAT', 'TRENCH COAT', 'VALIDAR', 'IN27'],
  ['BOMBER', 'BOMBER JACKET', 'VALIDAR', 'IN27'],
  ['BOXER', 'BOXER SHORTS', 'VALIDAR', 'IN27; confirmar se é peça ou modelagem'],
  ['BABY LOOK', 'BABY TEE', 'VALIDAR', 'IN27'],
  ['CACHECOL', 'SCARF', 'VALIDAR', 'IN27'],
  ['LENÇO', 'SCARF', 'VALIDAR', 'IN27']
]);

adicionarTermos(2, [
  ['PEPLUM', 'PEPLUM', 'VALIDAR', 'IN27'],
  ['LEVE', 'LIGHTWEIGHT', 'VALIDAR', 'IN27'],
  ['PESADA', 'HEAVYWEIGHT', 'VALIDAR', 'IN27']
]);

adicionarTermos(4, [
  ['MULLET', 'HIGH-LOW', 'VALIDAR', 'IN27; confirmar uso como comprimento']
]);

adicionarTermos(8, [
  ['TRICÔ', 'KNIT', 'FECHADO', 'variante ortográfica vista na IN27']
]);

// Registros compostos antigos que não fazem parte dos índices revisados são
// mantidos para revisão, sem competir com os termos fechados.
adicionarTermos(3, [
  ['SHORT-SAIA', 'SKORT', 'FECHADO', 'variante de busca já decidida'],
  ['SHORTS-SAIA', 'SKORT', 'FECHADO', 'variante de busca já decidida']
]);

adicionarTermos(1, [
  ['VESTIDO T-DRESS', 'T-DRESS', 'VALIDAR', 'expressão composta legada']
]);

adicionarTermos(9, [
  ['ESTAMPA LOCAL', 'PLACEMENT PRINT', 'VALIDAR', 'expressão composta legada']
]);

const termosPendentes = indices.flatMap(indice => indice.termos
  .filter(termo => termo.status === 'VALIDAR')
  .map(termo => ({ ...termo, indice: indice.id, nomeIndice: indice.nome })));

const termosGlossario = indices.flatMap(indice =>
  indice.termos.map(termo => ({ ...termo, indice: indice.id, nomeIndice: indice.nome }))
);

const expressoesCompostas = {
  // Visão derivada dos índices para manter compatibilidade durante a migração.
  EN: termosGlossario
    .filter(termo => termo.status === 'FECHADO' && termo.tipo === 'expressao')
    .map(termo => ({ pt: termo.pt, target: termo.en, indice: termo.indice, contexto: termo.contexto })),
  ES: [
    {
        "pt": "CINTURA ALTA",
        "target": "CINTURA ALTA"
    },
    {
        "pt": "MANGA LONGA",
        "target": "MANGA LARGA"
    },
    {
        "pt": "MANGA CURTA",
        "target": "MANGA CORTA"
    }
]
};

const dicionarioEN = {};
for (const termo of termosGlossario) {
  if (termo.status !== 'FECHADO' || termo.tipo !== 'termo' || termo.contexto) continue;
  // termosGlossario segue a ordem dos índices: o primeiro termo é prioritário.
  if (!Object.prototype.hasOwnProperty.call(dicionarioEN, termo.pt)) {
    dicionarioEN[termo.pt] = termo.en;
  }
}

const dicionarioTermos = {
  EN: dicionarioEN,
  ES: {
    "CALÇA": "PANTALÓN",
    "BERMUDA": "BERMUDA",
    "SAIA": "FALDA",
    "VESTIDO": "VESTIDO",
    "BLUSA": "BLUSA",
    "CAMISA": "CAMISA"
  }
};

module.exports = { indices, termosPendentes, termosGlossario, expressoesCompostas, dicionarioTermos };
