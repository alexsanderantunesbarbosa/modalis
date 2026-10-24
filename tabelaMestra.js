/**
 * Tabela mestra MODALIS.
 * Os índices 1–12 vieram da versão revisada pelo negócio; o índice 13 guarda nomes de linha.
 * Lote de 22/10/2026: validação IN27/AI27 e lista do setor consolidadas no literal abaixo.
 * Recategorização de 22/10/2026: 805 entradas em 16 índices
 * (14 modelagens de jaqueta/casaco, 15 acessórios/outros produtos, 16 praia/íntimo/dormir).
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
        "tipo": "expressao"
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
        "en": "SHORTS",
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
        "pt": "VESTIDO T-DRESS",
        "en": "T-DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BLUSA BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BODY CAVADO",
        "en": "HIGH-CUT BODYSUIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CAMISETA BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "JARDINEIRA",
        "en": "OVERALLS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "KIT",
        "en": "SET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SHORTS",
        "en": "SHORTS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "T-SHIRT BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BABY BOOT",
        "en": "BABY BOOT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CONJUNTO",
        "en": "SET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "POLO",
        "en": "POLO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SAIA LÁPIS",
        "en": "PENCIL SKIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SWEATER",
        "en": "SWEATER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "T-DRESS",
        "en": "T-DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TERNO",
        "en": "SUIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CALÇA JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "CALÇA DE JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "CALÇA MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "CALÇA DE MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "MOLETOM CALÇA",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "MOLETOM CANGURU",
        "en": "HOODIE",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "MOLETOM CARECA",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "MOLETOM GOLA CARECA",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado"
      },
      {
        "pt": "SHORT JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHORTS JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BERMUDA JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SAIA JEANS",
        "en": "DENIM SKIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "JAQUETA JEANS",
        "en": "DENIM JACKET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CAMISA JEANS",
        "en": "DENIM SHIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BLUSA JEANS",
        "en": "DENIM BLOUSE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "VESTIDO JEANS",
        "en": "DENIM DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COLETE JEANS",
        "en": "DENIM VEST",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BLAZER JEANS",
        "en": "DENIM BLAZER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MACACÃO JEANS",
        "en": "DENIM JUMPSUIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "JARDINEIRA JEANS",
        "en": "DENIM OVERALLS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORSET JEANS",
        "en": "DENIM CORSET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHORT DE MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHORTS DE MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SHORT MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "JAQUETA DE MOLETOM",
        "en": "FLEECE JACKET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COLETE DE MOLETOM",
        "en": "FLEECE VEST",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BLAZER DE MOLETOM",
        "en": "FLEECE BLAZER",
        "status": "FECHADO",
        "tipo": "expressao"
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
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DESCOLADA",
        "en": "LOOSE FIT",
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
      },
      {
        "pt": "ASSIMÉTRICA",
        "en": "ASYMMETRIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "AJUSTADO",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AJUSTADA",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "EVASÊ",
        "en": "A-LINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PEPLUM",
        "en": "PEPLUM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BALONÊ",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOY",
        "en": "BOY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OVER",
        "en": "OVERSIZED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GODÊ",
        "en": "FLARED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GRANDE",
        "en": "LARGE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LADY LIKE",
        "en": "LADYLIKE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LOOSE",
        "en": "LOOSE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SEREIA",
        "en": "MERMAID",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SPORT",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORSET",
        "en": "CORSET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MUSCLE",
        "en": "MUSCLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MUSCLE TEE",
        "en": "MUSCLE TEE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SECOND SKIN",
        "en": "SECOND SKIN",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DIFERENCIADA",
        "en": "PREMIUM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DIFERENCIADO",
        "en": "PREMIUM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GESTANTE",
        "en": "MATERNITY",
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
        "tipo": "expressao"
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
      },
      {
        "pt": "ARC",
        "en": "ARC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ARC LEG",
        "en": "ARC LEG",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FUSEAU",
        "en": "STIRRUP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FUSÔ",
        "en": "STIRRUP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TAPERED LEG",
        "en": "TAPERED LEG",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CIGARETE",
        "en": "CIGARETTE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CLOCHARD",
        "en": "CLOCHARD",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORROT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NEW CAPRI",
        "en": "NEW CAPRI",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "RETO",
        "en": "STRAIGHT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VERY SKINNY",
        "en": "VERY SKINNY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOXER",
        "en": "BOXER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "HOT PANTS",
        "en": "HOT PANTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CALÇA PIJAMA",
        "en": "PAJAMA PANTS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COMFORT",
        "en": "COMFORT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COMFY FIT",
        "en": "COMFY FIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "RELAXED",
        "en": "RELAXED",
        "status": "FECHADO",
        "tipo": "termo"
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
        "en": "MID-LENGTH",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MÉDIA",
        "en": "MID-LENGTH",
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
      },
      {
        "pt": "MINI-SAIA",
        "en": "MINI SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão composta legada validada"
      },
      {
        "pt": "MINI",
        "en": "MINI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MAXI",
        "en": "MAXI",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SAIA LONGA",
        "en": "LONG SKIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SAIA MIDI",
        "en": "MIDI SKIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SAIA CURTA",
        "en": "SHORT SKIRT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "VESTIDO LONGO",
        "en": "LONG DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "VESTIDO MIDI",
        "en": "MIDI DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "VESTIDO CURTO",
        "en": "SHORT DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MULLET",
        "en": "HIGH-LOW",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOCO",
        "en": "MICRO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ANKLE",
        "en": "ANKLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COMPRIMENTO",
        "en": "LENGTH",
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
        "pt": "ENFRALDADA",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LONGLINE",
        "en": "LONGLINE",
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
        "en": "SUPER HIGH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MEGA HIGH",
        "en": "MEGA HIGH",
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
      },
      {
        "pt": "CÓS DUPLO",
        "en": "DOUBLE WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DOUBLE BELT",
        "en": "DOUBLE WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GANCHO",
        "en": "RISE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "HIGH",
        "en": "HIGH-RISE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LOW",
        "en": "LOW-RISE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "QUADRIL",
        "en": "HIP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RISE",
        "en": "RISE",
        "status": "FECHADO",
        "tipo": "termo"
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
      },
      {
        "pt": "MANGA 3/4",
        "en": "3/4 SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão composta legada preservada"
      },
      {
        "pt": "MANGAS CURTAS",
        "en": "SHORT SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGAS LONGAS",
        "en": "LONG SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA CAPA",
        "en": "CAPE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGA DE CAPA",
        "en": "CAPE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGAS",
        "en": "SLEEVES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RAGLAN",
        "en": "RAGLAN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BUFANTE",
        "en": "PUFF",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MANGA BUFANTE",
        "en": "PUFF SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MANGAS BUFANTES",
        "en": "PUFF SLEEVES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "RAGLÃ",
        "en": "RAGLAN",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 7,
    "nome": "GOLA / DECOTE / ALÇAS",
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
        "en": "HALTER",
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
      },
      {
        "pt": "ALÇA",
        "en": "STRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALÇAS",
        "en": "STRAPS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GOLA REDONDA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA V",
        "en": "V-NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ALÇAS",
        "en": "WITH STRAPS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DE ALÇAS",
        "en": "STRAPPY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DE ALÇA",
        "en": "STRAPPY",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE COSTAS",
        "en": "LOW BACK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE DUPLO",
        "en": "DOUBLE NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE EM U",
        "en": "U-NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DECOTE NAS COSTAS",
        "en": "LOW BACK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DEGAGÊ",
        "en": "COWL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DEGAGÊ COSTAS",
        "en": "COWL BACK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA CARECA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA DUPLA",
        "en": "DOUBLE COLLAR",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CIGANINHA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DECOTADA",
        "en": "LOW-CUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DECOTADO",
        "en": "LOW-CUT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DECOTE CRUZADO",
        "en": "CROSSOVER NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOTA",
        "en": "KEYHOLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OMBRO A MOSTRA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "OMBROS À MOSTRA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ROLOTÊ",
        "en": "SPAGHETTI STRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GOLA ALTA",
        "en": "HIGH COLLAR",
        "status": "FECHADO",
        "tipo": "expressao",
        "contexto": "AGASALHO"
      },
      {
        "pt": "DECOTE GOTA",
        "en": "KEYHOLE NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "GOLA LAÇO",
        "en": "TIE-NECK",
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
      },
      {
        "pt": "JERSEY",
        "en": "JERSEY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TWEED",
        "en": "TWEED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRICOLINE",
        "en": "POPLIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COTELÊ",
        "en": "CORDUROY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GEORGETTE",
        "en": "GEORGETTE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PELO",
        "en": "FAUX FUR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DRY FIT",
        "en": "DRY FIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LÃ BATIDA",
        "en": "BOILED WOOL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MALHA LEVE",
        "en": "LIGHT KNIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MALHA PESADA",
        "en": "HEAVY KNIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MALHA TRICOT",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MISTURA DE TECIDO",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MISTURA DE TECIDOS",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PLANO",
        "en": "WOVEN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PLANO LEVE",
        "en": "LIGHT WOVEN",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PLANO PESADO",
        "en": "HEAVY WOVEN",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TECIDO PLANO",
        "en": "WOVEN",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TECIDO TECNOLÓGICO",
        "en": "TECHNICAL FABRIC",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TECNOLÓGICO",
        "en": "TECHNICAL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRICOT",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VINIL",
        "en": "VINYL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COMPOSÊ",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FIBRA",
        "en": "FIBER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLAME",
        "en": "SLUB",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GORGURÃO",
        "en": "GROSGRAIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MATERIAL SINTÉTICO",
        "en": "SYNTHETIC MATERIAL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "TECIDO",
        "en": "FABRIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LEVE",
        "en": "LIGHT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PESADA",
        "en": "HEAVY",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PROTEÇÃO UV",
        "en": "UV PROTECTION",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 9,
    "nome": "TEXTURAS / ACABAMENTOS / ESTAMPAS",
    "termos": [
      {
        "pt": "CANELADO",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACETINADO",
        "en": "SATIN",
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
        "en": "WITH EMBOSSING",
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
        "en": "WITH PRINT AND SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM ESTAMPA E BRILHOS",
        "en": "WITH PRINT AND SHIMMER",
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
      },
      {
        "pt": "CANELADA",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "CANELADOS",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "CANELADAS",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "ACETINADA",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "ACETINADOS",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "ACETINADAS",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "TEXTURIZADA",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "TEXTURIZADOS",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "TEXTURIZADAS",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "FLOCADA",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "FLOCADOS",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "FLOCADAS",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "RESINADA",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "RESINADOS",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "RESINADAS",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "METALIZADA",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "METALIZADOS",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "METALIZADAS",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "PLISSADA",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "PLISSADOS",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "PLISSADAS",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "DESFIADA",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "DESFIADOS",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "DESFIADAS",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "TRANÇADA",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "TRANÇADOS",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "TRANÇADAS",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "TORCIDA",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado"
      },
      {
        "pt": "TORCIDOS",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado"
      },
      {
        "pt": "TORCIDAS",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado"
      },
      {
        "pt": "BRILHO",
        "en": "SHIMMER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CONTRASTE",
        "en": "CONTRAST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MESCLA",
        "en": "HEATHERED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTAMPA LOCAL",
        "en": "PLACEMENT PRINT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ARTE",
        "en": "GRAPHIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BRILHOS",
        "en": "SHIMMER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CONTRASTANTE",
        "en": "CONTRAST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DEGRADÊ",
        "en": "OMBRÉ",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESPINHA DE PEIXE",
        "en": "HERRINGBONE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ESTONADA",
        "en": "STONEWASHED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTONADO",
        "en": "STONEWASHED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MONOGRAMA",
        "en": "MONOGRAM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PADRONAGEM",
        "en": "PATTERN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PATCHWORK",
        "en": "PATCHWORK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PIED POULE",
        "en": "HOUNDSTOOTH",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "RESINA",
        "en": "RESIN COATING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SILK",
        "en": "SCREEN PRINT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRICOLOR",
        "en": "TRICOLOR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "A FIO",
        "en": "DISTRESSED",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CUSTOMIZADO",
        "en": "CUSTOMIZED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ESTAMPA DE FLORES",
        "en": "FLORAL PRINT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ESTAMPA FLORAL",
        "en": "FLORAL PRINT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FLOR",
        "en": "FLOWER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLORES",
        "en": "FLORAL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FLUTED",
        "en": "FLUTED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GEOMÉTRICO",
        "en": "GEOMETRIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MIX",
        "en": "MIX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "REVESTIMENTO",
        "en": "COATING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SHINE",
        "en": "SHINE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TEXTURA",
        "en": "TEXTURE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BLACK",
        "en": "BLACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACABAMENTO",
        "en": "FINISH",
        "status": "FECHADO",
        "tipo": "termo"
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
      },
      {
        "pt": "OMBREIRA",
        "en": "SHOULDER PAD",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OMBREIRAS",
        "en": "SHOULDER PADS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM BRILHO",
        "en": "WITH SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM CACHECOL",
        "en": "WITH SCARF",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "AJUSTE",
        "en": "ADJUSTER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALFINETE",
        "en": "SAFETY PIN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AMARRAÇÕES",
        "en": "TIES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "APLICAÇÕES DE BRILHO",
        "en": "SHIMMER APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "AVIÔ",
        "en": "TRIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "AVIÔS",
        "en": "TRIMS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM AVIÔ",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM BRILHOS",
        "en": "WITH SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM TERMO",
        "en": "WITH HOTFIX",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COM TERMOCOLANTE",
        "en": "WITH HOTFIX",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ETIQUETA",
        "en": "LABEL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FAIXA NO PESCOÇO",
        "en": "NECK TIE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FECHO",
        "en": "CLASP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FECHOS",
        "en": "CLASPS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ILHÓSES",
        "en": "EYELETS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NAME",
        "en": "NAME",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PLACA",
        "en": "PLAQUE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "REGULAGEM",
        "en": "ADJUSTER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "REGULÁVEL",
        "en": "ADJUSTABLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TERMO",
        "en": "HOTFIX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TERMOCOLANTE",
        "en": "HOTFIX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ZÍPER FRONTAL",
        "en": "FRONT ZIPPER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "AJUSTÁVEL",
        "en": "ADJUSTABLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "APLICAÇÃO DE FLORES",
        "en": "FLOWER APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORDÃO",
        "en": "DRAWSTRING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PATCH",
        "en": "PATCH",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SIANINHA",
        "en": "RICKRACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BABADO",
        "en": "RUFFLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BABADOS",
        "en": "RUFFLES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "RETILÍNEA",
        "en": "RIB TRIM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRUFRU",
        "en": "RUFFLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ELÁSTICO",
        "en": "ELASTIC",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FAIXA NA CINTURA",
        "en": "WAIST SASH",
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
      },
      {
        "pt": "BOLSO CHAPADO",
        "en": "PATCH POCKET",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOLSOS CHAPADOS",
        "en": "PATCH POCKETS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOLSOS LATERAIS",
        "en": "SIDE POCKETS",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 12,
    "nome": "CONSTRUÇÃO / PARTES DA PEÇA",
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
        "pt": "FORRO",
        "en": "LINING",
        "status": "FECHADO",
        "tipo": "termo"
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
      },
      {
        "pt": "AMARRAÇÃO",
        "en": "TIE DETAIL",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "terminologia previamente decidida"
      },
      {
        "pt": "COSTAS À MOSTRA",
        "en": "BACKLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "terminologia previamente decidida"
      },
      {
        "pt": "COSTAS VAZADAS",
        "en": "CUTOUT BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "terminologia previamente decidida"
      },
      {
        "pt": "COSTAS ABERTAS",
        "en": "OPEN BACK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ALFAIATARIA",
        "en": "TAILORED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ABOTOAMENTO",
        "en": "BUTTON CLOSURE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORTE A LASER",
        "en": "LASER-CUT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORTE EVASÊ",
        "en": "A-LINE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORTE RETO",
        "en": "STRAIGHT CUT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SEM COSTURA",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SEM COSTURAS",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ABERTURA COSTAS",
        "en": "BACK OPENING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ABERTURA FRENTE",
        "en": "FRONT OPENING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ABERTURA FRONTAL",
        "en": "FRONT OPENING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ABERTURA LATERAL",
        "en": "SIDE OPENING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ABERTURA NAS COSTAS",
        "en": "BACK OPENING",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CACHEQUER",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAPA",
        "en": "CAPE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAVADA",
        "en": "DEEP ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAVADO",
        "en": "DEEP ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM CUT OFF",
        "en": "WITH CUT-OFF",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "COSTAS",
        "en": "BACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COSTAS CORSET",
        "en": "CORSET BACK",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CUT OFF",
        "en": "CUT-OFF",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CUT OUT",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DEDINHO",
        "en": "THUMBHOLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DETALHE COSTAS",
        "en": "BACK DETAIL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DIAGONAL",
        "en": "DIAGONAL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DUPLA",
        "en": "DOUBLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DUPLA FACE",
        "en": "REVERSIBLE",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "DUPLO",
        "en": "DOUBLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRONTAIS",
        "en": "FRONT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "FRONTAL",
        "en": "FRONT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "INTERNO",
        "en": "INNER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LATERAIS",
        "en": "SIDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LATERAL",
        "en": "SIDE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OMBRO ASSIMÉTRICO",
        "en": "ASYMMETRIC SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "OMBRO DESLOCADO",
        "en": "DROP SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PREGA COSTAS",
        "en": "BACK PLEAT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PREGAS FRONTAIS",
        "en": "FRONT PLEATS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "REMOVÍVEL",
        "en": "REMOVABLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SEAMLESS",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BAINHA",
        "en": "HEM",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BUSTO",
        "en": "BUST",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CACHAQUER",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAVA",
        "en": "ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COSTA",
        "en": "BACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CRUZADO",
        "en": "CRISS-CROSS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "EMBUTIDA",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "EMBUTIDAS",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "EMBUTIDO",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "EMBUTIDOS",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ENVELOPE",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OMBRO",
        "en": "SHOULDER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PESPONTOS",
        "en": "TOPSTITCHING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VINCO",
        "en": "CREASE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "WRAP",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "OMBROS BUFANTE",
        "en": "PUFF SHOULDERS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "OMBROS BUFANTES",
        "en": "PUFF SHOULDERS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ASA DELTA",
        "en": "HIGH-CUT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "QUADRADO",
        "en": "SQUARE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COULISSÊ",
        "en": "SHIRRED",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PONTO",
        "en": "STITCH",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COM CAPUZ",
        "en": "HOODED",
        "status": "FECHADO",
        "tipo": "expressao"
      }
    ]
  },
  {
    "id": 13,
    "nome": "NOMES DE LINHA / LICENÇAS",
    "termos": [
      {
        "pt": "AFRODITE",
        "en": "AFRODITE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ATENA",
        "en": "ATENA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "DIANA",
        "en": "DIANA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GAIA",
        "en": "GAIA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "HERA",
        "en": "HERA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "HÉSTIA",
        "en": "HÉSTIA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LUNA",
        "en": "LUNA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MINERVA",
        "en": "MINERVA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NIX",
        "en": "NIX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PAX",
        "en": "PAX",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SELENE",
        "en": "SELENE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TALASSA",
        "en": "TALASSA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOMAS",
        "en": "TOMAS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VENUS",
        "en": "VENUS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VESTA",
        "en": "VESTA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ÍRIS",
        "en": "ÍRIS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SIGNATURE",
        "en": "SIGNATURE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MICKEY",
        "en": "MICKEY",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 14,
    "nome": "MODELAGENS DE JAQUETA / CASACO",
    "termos": [
      {
        "pt": "TRENCH COAT",
        "en": "TRENCH COAT",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "BOMBER",
        "en": "BOMBER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BIKER",
        "en": "BIKER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORTA VENTO",
        "en": "WINDBREAKER",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PARKA",
        "en": "PARKA",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PERFECTO",
        "en": "PERFECTO",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PUFFER",
        "en": "PUFFER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRUCKER",
        "en": "TRUCKER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SPENCER",
        "en": "SPENCER",
        "status": "FECHADO",
        "tipo": "termo"
      }
    ]
  },
  {
    "id": 15,
    "nome": "ACESSÓRIOS / OUTROS PRODUTOS",
    "termos": [
      {
        "pt": "CACHECOL",
        "en": "SCARF",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LENÇO",
        "en": "SCARF",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOUCA",
        "en": "BEANIE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ABOTOADURA",
        "en": "CUFFLINK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ACESSÓRIOS",
        "en": "ACCESSORIES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ALMOFADA",
        "en": "PILLOW",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ANEL",
        "en": "RING",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BOINA",
        "en": "BERET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BONÉ",
        "en": "CAP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CANECA",
        "en": "MUG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CHAPÉU",
        "en": "HAT",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CHINELO",
        "en": "FLIP-FLOPS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CHOKER",
        "en": "CHOKER",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COLAR",
        "en": "NECKLACE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GORRO",
        "en": "BEANIE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GRAVATA",
        "en": "NECKTIE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "GUARDA-CHUVA",
        "en": "UMBRELLA",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LATA",
        "en": "CAN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "LUVA",
        "en": "GLOVES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MEIA",
        "en": "SOCKS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MOCHILA",
        "en": "BACKPACK",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "NECESSAIRE",
        "en": "TOILETRY BAG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "PANTUFA",
        "en": "SLIPPERS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SUSPENSÓRIO",
        "en": "SUSPENDERS",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TOALHA",
        "en": "TOWEL",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "VISEIRA",
        "en": "VISOR",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ÓCULOS",
        "en": "GLASSES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "ÓCULOS DE SOL",
        "en": "SUNGLASSES",
        "status": "FECHADO",
        "tipo": "expressao"
      },
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
      }
    ]
  },
  {
    "id": 16,
    "nome": "PRAIA / ÍNTIMO / DORMIR",
    "termos": [
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
      },
      {
        "pt": "VESTIDO SLEEP DRESS",
        "en": "SLEEP DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "ANÁGUA",
        "en": "SLIP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SLEEP",
        "en": "SLEEP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "SLEEP DRESS",
        "en": "SLEEP DRESS",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "SLIP",
        "en": "SLIP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "BABY DOLL",
        "en": "BABYDOLL",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CALCINHA",
        "en": "PANTIES",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CAMISOLA",
        "en": "NIGHTGOWN",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORSELET",
        "en": "CORSELET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORSELETE",
        "en": "CORSELET",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORTININHA",
        "en": "TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "CORTININHA COM BOJO",
        "en": "PADDED TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "CORTININHA FRUFRU",
        "en": "RUFFLE TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "FIO DENTAL",
        "en": "THONG",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "LINGERIE",
        "en": "LINGERIE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "MEIA TAÇA",
        "en": "HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MEIA TAÇA TORCIDA",
        "en": "TWISTED HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "MEIA TAÇA TORCIDO",
        "en": "TWISTED HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao"
      },
      {
        "pt": "PAREÔ",
        "en": "SARONG",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "TRIÂNGULO",
        "en": "TRIANGLE",
        "status": "FECHADO",
        "tipo": "termo"
      },
      {
        "pt": "COPO",
        "en": "CUP",
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
