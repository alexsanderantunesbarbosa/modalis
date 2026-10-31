/**
 * Tabela mestra MODALIS.
 * Os índices 1–12 vieram da versão revisada pelo negócio; o índice 13 guarda nomes de linha.
 * Lote de 22/10/2026: validação IN27/AI27 e lista do setor consolidadas no literal abaixo.
 * Recategorização de 22/10/2026: 805 entradas em 16 índices
 * (14 modelagens de jaqueta/casaco, 15 acessórios/outros produtos, 16 praia/íntimo/dormir).
 * Novos termos ainda em revisão ficam com status VALIDAR e não são aplicados.
 *
 * Espanhol (29/10/2026): cada termo tem `es` = { texto, classe, genero?, numero?, formas?, adjetivo? },
 * validado com as lojas de moda em espanhol (planilha glossario-espanhol-modalis-2026-10-29.xlsx).
 *   classe 'peca'        → peça; genero/numero são os do ES (CALÇA = PANTALÓN, m/s);
 *          'substantivo' → substantivo com gênero que não é peça (BARRA = BAJO, m/s);
 *          'flexivel'    → adjetivo que concorda; `formas` traz ms/fs/mp/fp;
 *          'invariavel'  → não muda (CANALÉ, SEAMLESS); locução COM/SEM leva o gênero do substantivo de dentro;
 *          'nome_proprio'→ nome de linha, nunca traduzido.
 *   adjetivo: true → o ES é adjetivo e COM/DE antes dele cai (DE ALFAIATARIA = SASTRE).
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
        "tipo": "termo",
        "es": { "texto": "BLUSA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CAMISA",
        "en": "SHIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAMISA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "T-SHIRT",
        "en": "T-SHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "T-SHIRT", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CAMISETA",
        "en": "T-SHIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAMISETA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "REGATA",
        "en": "TANK TOP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAMISETA SIN MANGAS", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TOP",
        "en": "TOP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TOP", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BODY",
        "en": "BODYSUIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BODY", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BLAZER",
        "en": "BLAZER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BLAZER", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JAQUETA",
        "en": "JACKET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CHAQUETA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CASACO",
        "en": "COAT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ABRIGO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COLETE",
        "en": "VEST",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CHALECO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VESTIDO",
        "en": "DRESS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VESTIDO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SAIA",
        "en": "SKIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FALDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CALÇA",
        "en": "PANTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PANTALÓN", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHORT",
        "en": "SHORTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SHORT", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BERMUDA",
        "en": "SHORTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BERMUDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "LEGGING",
        "en": "LEGGINGS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LEGGING", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MACACÃO",
        "en": "JUMPSUIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENTERIZO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MACAQUINHO",
        "en": "ROMPER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENTERIZO CORTO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUDADERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CARDIGÃ",
        "en": "CARDIGAN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CÁRDIGAN", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SUÉTER",
        "en": "SWEATER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUÉTER", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PONCHO",
        "en": "PONCHO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PONCHO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "KIMONO",
        "en": "KIMONO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "KIMONO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "KAFTAN",
        "en": "CAFTAN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "KAFTÁN", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VESTIDO T-DRESS",
        "en": "T-DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VESTIDO T-DRESS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BLUSA BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BLUSA BABY TEE", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BODY CAVADO",
        "en": "HIGH-CUT BODYSUIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BODY DE CORTE ALTO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CAMISETA BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CAMISETA BABY TEE", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "JARDINEIRA",
        "en": "OVERALLS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JARDINERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "KIT",
        "en": "SET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "KIT", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHORTS",
        "en": "SHORTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SHORTS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "T-SHIRT BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "T-SHIRT BABY TEE", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BABY BOOT",
        "en": "BABY BOOT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BABY BOOT", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CONJUNTO",
        "en": "SET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CONJUNTO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "POLO",
        "en": "POLO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SAIA LÁPIS",
        "en": "PENCIL SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA LÁPIZ", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SWEATER",
        "en": "SWEATER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SWEATER", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "T-DRESS",
        "en": "T-DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "T-DRESS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TERNO",
        "en": "SUIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRAJE", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CALÇA JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "JEANS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "CALÇA DE JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "JEANS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "CALÇA MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "PANTALÓN FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CALÇA DE MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "PANTALÓN DE FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MOLETOM CALÇA",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "PANTALÓN FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MOLETOM CANGURU",
        "en": "HOODIE",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "SUDADERA CANGURO", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MOLETOM CARECA",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "SUDADERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MOLETOM GOLA CARECA",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão protegida do índice revisado",
        "es": { "texto": "SUDADERA CUELLO REDONDO", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SHORT JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHORT DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHORTS JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHORTS DENIM", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "BERMUDA JEANS",
        "en": "JORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BERMUDA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SAIA JEANS",
        "en": "DENIM SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "JAQUETA JEANS",
        "en": "DENIM JACKET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CHAQUETA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CAMISA JEANS",
        "en": "DENIM SHIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CAMISA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BLUSA JEANS",
        "en": "DENIM BLOUSE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BLUSA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "VESTIDO JEANS",
        "en": "DENIM DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VESTIDO DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COLETE JEANS",
        "en": "DENIM VEST",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CHALECO DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BLAZER JEANS",
        "en": "DENIM BLAZER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BLAZER DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MACACÃO JEANS",
        "en": "DENIM JUMPSUIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ENTERIZO DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JARDINEIRA JEANS",
        "en": "DENIM OVERALLS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "JARDINERA DENIM", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CORSET JEANS",
        "en": "DENIM CORSET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CORSET DENIM", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHORT DE MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHORT DE FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHORTS DE MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHORTS DE FELPA", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "SHORT MOLETOM",
        "en": "SWEAT SHORTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHORT FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JAQUETA DE MOLETOM",
        "en": "FLEECE JACKET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CHAQUETA DE FELPA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COLETE DE MOLETOM",
        "en": "FLEECE VEST",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CHALECO DE FELPA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BLAZER DE MOLETOM",
        "en": "FLEECE BLAZER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BLAZER DE FELPA", "classe": "peca", "genero": "m", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "OVERSIZE", "classe": "invariavel" }
      },
      {
        "pt": "OVERSIZED",
        "en": "OVERSIZED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "OVERSIZED", "classe": "invariavel" }
      },
      {
        "pt": "SLIM",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SLIM", "classe": "invariavel" }
      },
      {
        "pt": "JUSTO",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTADO", "classe": "flexivel", "formas": { "ms": "AJUSTADO", "fs": "AJUSTADA", "mp": "AJUSTADOS", "fp": "AJUSTADAS" } }
      },
      {
        "pt": "JUSTA",
        "en": "SLIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTADO", "classe": "flexivel", "formas": { "ms": "AJUSTADO", "fs": "AJUSTADA", "mp": "AJUSTADOS", "fp": "AJUSTADAS" } }
      },
      {
        "pt": "REGULAR",
        "en": "REGULAR",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "REGULAR", "classe": "invariavel" }
      },
      {
        "pt": "AMPLO",
        "en": "WIDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AMPLIO", "classe": "flexivel", "formas": { "ms": "AMPLIO", "fs": "AMPLIA", "mp": "AMPLIOS", "fp": "AMPLIAS" } }
      },
      {
        "pt": "AMPLA",
        "en": "WIDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AMPLIO", "classe": "flexivel", "formas": { "ms": "AMPLIO", "fs": "AMPLIA", "mp": "AMPLIOS", "fp": "AMPLIAS" } }
      },
      {
        "pt": "SOLTO",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUELTO", "classe": "flexivel", "formas": { "ms": "SUELTO", "fs": "SUELTA", "mp": "SUELTOS", "fp": "SUELTAS" } }
      },
      {
        "pt": "SOLTA",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUELTO", "classe": "flexivel", "formas": { "ms": "SUELTO", "fs": "SUELTA", "mp": "SUELTOS", "fp": "SUELTAS" } }
      },
      {
        "pt": "DESCOLADO",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUELTO", "classe": "flexivel", "formas": { "ms": "SUELTO", "fs": "SUELTA", "mp": "SUELTOS", "fp": "SUELTAS" } }
      },
      {
        "pt": "DESCOLADA",
        "en": "LOOSE FIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUELTO", "classe": "flexivel", "formas": { "ms": "SUELTO", "fs": "SUELTA", "mp": "SUELTOS", "fp": "SUELTAS" } }
      },
      {
        "pt": "FLUIDO",
        "en": "FLUID",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLUIDO", "classe": "flexivel", "formas": { "ms": "FLUIDO", "fs": "FLUIDA", "mp": "FLUIDOS", "fp": "FLUIDAS" } }
      },
      {
        "pt": "FLUIDA",
        "en": "FLUID",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLUIDO", "classe": "flexivel", "formas": { "ms": "FLUIDO", "fs": "FLUIDA", "mp": "FLUIDOS", "fp": "FLUIDAS" } }
      },
      {
        "pt": "ESVOAÇANTE",
        "en": "FLOWY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VAPOROSO", "classe": "flexivel", "formas": { "ms": "VAPOROSO", "fs": "VAPOROSA", "mp": "VAPOROSOS", "fp": "VAPOROSAS" } }
      },
      {
        "pt": "ESTRUTURADO",
        "en": "STRUCTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESTRUCTURADO", "classe": "flexivel", "formas": { "ms": "ESTRUCTURADO", "fs": "ESTRUCTURADA", "mp": "ESTRUCTURADOS", "fp": "ESTRUCTURADAS" } }
      },
      {
        "pt": "ESTRUTURADA",
        "en": "STRUCTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESTRUCTURADO", "classe": "flexivel", "formas": { "ms": "ESTRUCTURADO", "fs": "ESTRUCTURADA", "mp": "ESTRUCTURADOS", "fp": "ESTRUCTURADAS" } }
      },
      {
        "pt": "ACINTURADO",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENTALLADO", "classe": "flexivel", "formas": { "ms": "ENTALLADO", "fs": "ENTALLADA", "mp": "ENTALLADOS", "fp": "ENTALLADAS" } }
      },
      {
        "pt": "ACINTURADA",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENTALLADO", "classe": "flexivel", "formas": { "ms": "ENTALLADO", "fs": "ENTALLADA", "mp": "ENTALLADOS", "fp": "ENTALLADAS" } }
      },
      {
        "pt": "ASSIMÉTRICO",
        "en": "ASYMMETRIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ASIMÉTRICO", "classe": "flexivel", "formas": { "ms": "ASIMÉTRICO", "fs": "ASIMÉTRICA", "mp": "ASIMÉTRICOS", "fp": "ASIMÉTRICAS" } }
      },
      {
        "pt": "TRADICIONAL",
        "en": "CLASSIC FIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRADICIONAL", "classe": "flexivel", "formas": { "ms": "TRADICIONAL", "fs": "TRADICIONAL", "mp": "TRADICIONALES", "fp": "TRADICIONALES" } }
      },
      {
        "pt": "BÁSICO",
        "en": "BASIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BÁSICO", "classe": "flexivel", "formas": { "ms": "BÁSICO", "fs": "BÁSICA", "mp": "BÁSICOS", "fp": "BÁSICAS" } }
      },
      {
        "pt": "BÁSICA",
        "en": "BASIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BÁSICO", "classe": "flexivel", "formas": { "ms": "BÁSICO", "fs": "BÁSICA", "mp": "BÁSICOS", "fp": "BÁSICAS" } }
      },
      {
        "pt": "ESPORTIVO",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DEPORTIVO", "classe": "flexivel", "formas": { "ms": "DEPORTIVO", "fs": "DEPORTIVA", "mp": "DEPORTIVOS", "fp": "DEPORTIVAS" } }
      },
      {
        "pt": "ESPORTIVA",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DEPORTIVO", "classe": "flexivel", "formas": { "ms": "DEPORTIVO", "fs": "DEPORTIVA", "mp": "DEPORTIVOS", "fp": "DEPORTIVAS" } }
      },
      {
        "pt": "UTILITÁRIO",
        "en": "UTILITY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "UTILITY", "classe": "invariavel" }
      },
      {
        "pt": "UTILITÁRIA",
        "en": "UTILITY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "UTILITY", "classe": "invariavel" }
      },
      {
        "pt": "ASSIMÉTRICA",
        "en": "ASYMMETRIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "ASIMÉTRICO", "classe": "flexivel", "formas": { "ms": "ASIMÉTRICO", "fs": "ASIMÉTRICA", "mp": "ASIMÉTRICOS", "fp": "ASIMÉTRICAS" } }
      },
      {
        "pt": "AJUSTADO",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTADO", "classe": "flexivel", "formas": { "ms": "AJUSTADO", "fs": "AJUSTADA", "mp": "AJUSTADOS", "fp": "AJUSTADAS" } }
      },
      {
        "pt": "AJUSTADA",
        "en": "FITTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTADO", "classe": "flexivel", "formas": { "ms": "AJUSTADO", "fs": "AJUSTADA", "mp": "AJUSTADOS", "fp": "AJUSTADAS" } }
      },
      {
        "pt": "EVASÊ",
        "en": "A-LINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "EVASÉ", "classe": "invariavel" }
      },
      {
        "pt": "PEPLUM",
        "en": "PEPLUM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PEPLUM", "classe": "invariavel" }
      },
      {
        "pt": "BALONÊ",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GLOBO", "classe": "invariavel" }
      },
      {
        "pt": "BOY",
        "en": "BOY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOY", "classe": "invariavel" }
      },
      {
        "pt": "OVER",
        "en": "OVERSIZED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "OVERSIZE", "classe": "invariavel" }
      },
      {
        "pt": "GODÊ",
        "en": "FLARED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACAMPANADO", "classe": "flexivel", "formas": { "ms": "ACAMPANADO", "fs": "ACAMPANADA", "mp": "ACAMPANADOS", "fp": "ACAMPANADAS" } }
      },
      {
        "pt": "GRANDE",
        "en": "LARGE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GRANDE", "classe": "flexivel", "formas": { "ms": "GRANDE", "fs": "GRANDE", "mp": "GRANDES", "fp": "GRANDES" } }
      },
      {
        "pt": "LADY LIKE",
        "en": "LADYLIKE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "LADYLIKE", "classe": "invariavel" }
      },
      {
        "pt": "LOOSE",
        "en": "LOOSE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LOOSE", "classe": "invariavel" }
      },
      {
        "pt": "SEREIA",
        "en": "MERMAID",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SIRENA", "classe": "invariavel" }
      },
      {
        "pt": "SPORT",
        "en": "SPORT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SPORT", "classe": "invariavel" }
      },
      {
        "pt": "CORSET",
        "en": "CORSET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORSET", "classe": "invariavel" }
      },
      {
        "pt": "BABY LOOK",
        "en": "BABY TEE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BABY TEE", "classe": "invariavel" }
      },
      {
        "pt": "MUSCLE",
        "en": "MUSCLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MUSCLE", "classe": "invariavel" }
      },
      {
        "pt": "MUSCLE TEE",
        "en": "MUSCLE TEE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MUSCLE TEE", "classe": "invariavel" }
      },
      {
        "pt": "SECOND SKIN",
        "en": "SECOND SKIN",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SECOND SKIN", "classe": "invariavel" }
      },
      {
        "pt": "DIFERENCIADA",
        "en": "PREMIUM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PRÉMIUM", "classe": "invariavel" }
      },
      {
        "pt": "DIFERENCIADO",
        "en": "PREMIUM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PRÉMIUM", "classe": "invariavel" }
      },
      {
        "pt": "GESTANTE",
        "en": "MATERNITY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DE MATERNIDAD", "classe": "invariavel" }
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
        "tipo": "termo",
        "es": { "texto": "RECTO", "classe": "flexivel", "formas": { "ms": "RECTO", "fs": "RECTA", "mp": "RECTOS", "fp": "RECTAS" } }
      },
      {
        "pt": "SKINNY",
        "en": "SKINNY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SKINNY", "classe": "invariavel" }
      },
      {
        "pt": "WIDE LEG",
        "en": "WIDE LEG",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "WIDE LEG", "classe": "invariavel" }
      },
      {
        "pt": "BOOTCUT",
        "en": "BOOTCUT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOOTCUT", "classe": "invariavel" }
      },
      {
        "pt": "BOOT CUT",
        "en": "BOOTCUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOOTCUT", "classe": "invariavel" }
      },
      {
        "pt": "FLARE",
        "en": "FLARE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLARE", "classe": "invariavel" }
      },
      {
        "pt": "CROPPED FLARE",
        "en": "CROPPED FLARE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CROPPED FLARE", "classe": "invariavel" }
      },
      {
        "pt": "LOOSE LOW SLIM",
        "en": "LOOSE LOW SLIM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "LOOSE LOW SLIM", "classe": "invariavel" }
      },
      {
        "pt": "BAGGY",
        "en": "BAGGY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BAGGY", "classe": "invariavel" }
      },
      {
        "pt": "SUPER BAGGY",
        "en": "SUPER BAGGY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SUPER BAGGY", "classe": "invariavel" }
      },
      {
        "pt": "BOYFRIEND",
        "en": "BOYFRIEND",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOYFRIEND", "classe": "invariavel" }
      },
      {
        "pt": "X-BOYFRIEND",
        "en": "X-BOYFRIEND",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "X-BOYFRIEND", "classe": "invariavel" }
      },
      {
        "pt": "MOM",
        "en": "MOM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MOM", "classe": "invariavel" }
      },
      {
        "pt": "MOM CROPPED",
        "en": "MOM CROPPED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MOM CROPPED", "classe": "invariavel" }
      },
      {
        "pt": "JEGGING",
        "en": "JEGGING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JEGGING", "classe": "invariavel" }
      },
      {
        "pt": "TAPERED",
        "en": "TAPERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TAPERED", "classe": "invariavel" }
      },
      {
        "pt": "CARROT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CARROT", "classe": "invariavel" }
      },
      {
        "pt": "CARRO FIT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CARROT", "classe": "invariavel" }
      },
      {
        "pt": "CARROT CROPPED",
        "en": "CARROT CROPPED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CARROT CROPPED", "classe": "invariavel" }
      },
      {
        "pt": "BARREL",
        "en": "BARREL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BARREL", "classe": "invariavel" }
      },
      {
        "pt": "LOOSE BARREL",
        "en": "LOOSE BARREL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "LOOSE BARREL", "classe": "invariavel" }
      },
      {
        "pt": "BALLOON",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BALLOON", "classe": "invariavel" }
      },
      {
        "pt": "BALLON",
        "en": "BALLOON",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BALLOON", "classe": "invariavel" }
      },
      {
        "pt": "ALADIM",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALADINO", "classe": "invariavel" }
      },
      {
        "pt": "ALADIN",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALADINO", "classe": "invariavel" }
      },
      {
        "pt": "ALADDIN",
        "en": "ALADDIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALADDIN", "classe": "invariavel" }
      },
      {
        "pt": "CARGO",
        "en": "CARGO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CARGO", "classe": "invariavel" }
      },
      {
        "pt": "CARPENTER",
        "en": "CARPENTER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CARPENTER", "classe": "invariavel" }
      },
      {
        "pt": "JOGGER",
        "en": "JOGGER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JOGGER", "classe": "invariavel" }
      },
      {
        "pt": "JOGGING",
        "en": "JOGGING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JOGGING", "classe": "invariavel" }
      },
      {
        "pt": "PANTALONA",
        "en": "WIDE LEG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "WIDE LEG", "classe": "invariavel" }
      },
      {
        "pt": "PANTACOURT",
        "en": "PANTACOURT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PANTACOURT", "classe": "invariavel" }
      },
      {
        "pt": "CAPRI",
        "en": "CAPRI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAPRI", "classe": "invariavel" }
      },
      {
        "pt": "CORSÁRIO",
        "en": "CAPRI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAPRI", "classe": "invariavel" }
      },
      {
        "pt": "SARUEL",
        "en": "HAREM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SARUEL", "classe": "invariavel" }
      },
      {
        "pt": "BAGGY BALLOON",
        "en": "BAGGY BALLOON",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BAGGY BALLOON", "classe": "invariavel" }
      },
      {
        "pt": "BAGGY BALLOON MAXXY",
        "en": "BAGGY BALLOON MAXXY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BAGGY BALLOON MAXXY", "classe": "invariavel" }
      },
      {
        "pt": "BAGGY BALLOON CROPPED",
        "en": "BAGGY BALLOON CROPPED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BAGGY BALLOON CROPPED", "classe": "invariavel" }
      },
      {
        "pt": "BALLOON MAXXY",
        "en": "BALLOON MAXXY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BALLOON MAXXY", "classe": "invariavel" }
      },
      {
        "pt": "SHAPE NOW",
        "en": "SHAPE NOW",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SHAPE NOW", "classe": "invariavel" }
      },
      {
        "pt": "PALAZZO",
        "en": "PALAZZO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PALAZZO", "classe": "invariavel" }
      },
      {
        "pt": "RETA SLIM",
        "en": "SLIM STRAIGHT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "RECTO SLIM", "classe": "flexivel", "formas": { "ms": "RECTO SLIM", "fs": "RECTA SLIM", "mp": "RECTOS SLIM", "fp": "RECTAS SLIM" } }
      },
      {
        "pt": "GRANDFATHER",
        "en": "GRANDFATHER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GRANDFATHER", "classe": "invariavel" }
      },
      {
        "pt": "HOTPANTS",
        "en": "HOTPANTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HOTPANTS", "classe": "invariavel" }
      },
      {
        "pt": "SHORTS SAIA",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA PANTALÓN", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SHORT SAIA",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA PANTALÓN", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SAIA SHORT",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA PANTALÓN", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SAIA SHORTS",
        "en": "SKORT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA PANTALÓN", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ARC",
        "en": "ARC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ARC", "classe": "invariavel" }
      },
      {
        "pt": "ARC LEG",
        "en": "ARC LEG",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ARC LEG", "classe": "invariavel" }
      },
      {
        "pt": "FUSEAU",
        "en": "STIRRUP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FUSEAU", "classe": "invariavel" }
      },
      {
        "pt": "FUSÔ",
        "en": "STIRRUP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FUSEAU", "classe": "invariavel" }
      },
      {
        "pt": "TAPERED LEG",
        "en": "TAPERED LEG",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TAPERED LEG", "classe": "invariavel" }
      },
      {
        "pt": "CIGARETE",
        "en": "CIGARETTE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CIGARETTE", "classe": "invariavel" }
      },
      {
        "pt": "CLOCHARD",
        "en": "CLOCHARD",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CLOCHARD", "classe": "invariavel" }
      },
      {
        "pt": "CORROT",
        "en": "CARROT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CARROT", "classe": "invariavel" }
      },
      {
        "pt": "NEW CAPRI",
        "en": "NEW CAPRI",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "NEW CAPRI", "classe": "invariavel" }
      },
      {
        "pt": "RETO",
        "en": "STRAIGHT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RECTO", "classe": "flexivel", "formas": { "ms": "RECTO", "fs": "RECTA", "mp": "RECTOS", "fp": "RECTAS" } }
      },
      {
        "pt": "VERY SKINNY",
        "en": "VERY SKINNY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VERY SKINNY", "classe": "invariavel" }
      },
      {
        "pt": "BOXER",
        "en": "BOXER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BÓXER", "classe": "invariavel" }
      },
      {
        "pt": "HOT PANTS",
        "en": "HOT PANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOT PANTS", "classe": "invariavel" }
      },
      {
        "pt": "CALÇA PIJAMA",
        "en": "PAJAMA PANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PANTALÓN PIJAMA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COMFORT",
        "en": "COMFORT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COMFORT", "classe": "invariavel" }
      },
      {
        "pt": "COMFY FIT",
        "en": "COMFY FIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "COMFY FIT", "classe": "invariavel" }
      },
      {
        "pt": "RELAXED",
        "en": "RELAXED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RELAXED", "classe": "invariavel" }
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
        "tipo": "termo",
        "es": { "texto": "CORTO", "classe": "flexivel", "formas": { "ms": "CORTO", "fs": "CORTA", "mp": "CORTOS", "fp": "CORTAS" } }
      },
      {
        "pt": "CURTA",
        "en": "SHORT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORTO", "classe": "flexivel", "formas": { "ms": "CORTO", "fs": "CORTA", "mp": "CORTOS", "fp": "CORTAS" } }
      },
      {
        "pt": "LONGO",
        "en": "LONG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LARGO", "classe": "flexivel", "formas": { "ms": "LARGO", "fs": "LARGA", "mp": "LARGOS", "fp": "LARGAS" } }
      },
      {
        "pt": "LONGA",
        "en": "LONG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LARGO", "classe": "flexivel", "formas": { "ms": "LARGO", "fs": "LARGA", "mp": "LARGOS", "fp": "LARGAS" } }
      },
      {
        "pt": "MÉDIO",
        "en": "MID-LENGTH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MEDIO", "classe": "flexivel", "formas": { "ms": "MEDIO", "fs": "MEDIA", "mp": "MEDIOS", "fp": "MEDIAS" } }
      },
      {
        "pt": "MÉDIA",
        "en": "MID-LENGTH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MEDIO", "classe": "flexivel", "formas": { "ms": "MEDIO", "fs": "MEDIA", "mp": "MEDIOS", "fp": "MEDIAS" } }
      },
      {
        "pt": "MIDI",
        "en": "MIDI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MIDI", "classe": "invariavel" }
      },
      {
        "pt": "SUPER MIDI",
        "en": "SUPER MIDI",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SUPER MIDI", "classe": "invariavel" }
      },
      {
        "pt": "FULL LENGTH",
        "en": "FULL LENGTH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FULL LENGTH", "classe": "invariavel" }
      },
      {
        "pt": "CROPPED",
        "en": "CROPPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CROPPED", "classe": "invariavel" }
      },
      {
        "pt": "MINI-SAIA",
        "en": "MINI SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão composta legada validada",
        "es": { "texto": "MINIFALDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MINI",
        "en": "MINI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MINI", "classe": "invariavel" }
      },
      {
        "pt": "MAXI",
        "en": "MAXI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MAXI", "classe": "invariavel" }
      },
      {
        "pt": "SAIA LONGA",
        "en": "LONG SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA LARGA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SAIA MIDI",
        "en": "MIDI SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA MIDI", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SAIA CURTA",
        "en": "SHORT SKIRT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FALDA CORTA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "VESTIDO LONGO",
        "en": "LONG DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VESTIDO LARGO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VESTIDO MIDI",
        "en": "MIDI DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VESTIDO MIDI", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VESTIDO CURTO",
        "en": "SHORT DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "VESTIDO CORTO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MULLET",
        "en": "HIGH-LOW",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MULLET", "classe": "invariavel" }
      },
      {
        "pt": "TOCO",
        "en": "MICRO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MICRO", "classe": "invariavel" }
      },
      {
        "pt": "ANKLE",
        "en": "ANKLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ANKLE", "classe": "invariavel" }
      },
      {
        "pt": "COMPRIMENTO",
        "en": "LENGTH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LONGITUD", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MICRO",
        "en": "MICRO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MICRO", "classe": "invariavel" }
      },
      {
        "pt": "ALONGADO",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALARGADO", "classe": "flexivel", "formas": { "ms": "ALARGADO", "fs": "ALARGADA", "mp": "ALARGADOS", "fp": "ALARGADAS" } }
      },
      {
        "pt": "ALONGADA",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALARGADO", "classe": "flexivel", "formas": { "ms": "ALARGADO", "fs": "ALARGADA", "mp": "ALARGADOS", "fp": "ALARGADAS" } }
      },
      {
        "pt": "ENFRALDADA",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALARGADO", "classe": "flexivel", "formas": { "ms": "ALARGADO", "fs": "ALARGADA", "mp": "ALARGADOS", "fp": "ALARGADAS" } }
      },
      {
        "pt": "LONGLINE",
        "en": "LONGLINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LONGLINE", "classe": "invariavel" }
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
        "tipo": "termo",
        "es": { "texto": "CINTURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CINTURA ALTA",
        "en": "HIGH-RISE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TIRO ALTO", "classe": "invariavel" }
      },
      {
        "pt": "CINTURA MÉDIA",
        "en": "MID-RISE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TIRO MEDIO", "classe": "invariavel" }
      },
      {
        "pt": "CINTURA BAIXA",
        "en": "LOW-RISE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TIRO BAJO", "classe": "invariavel" }
      },
      {
        "pt": "SUPER HIGH",
        "en": "SUPER HIGH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SUPER HIGH", "classe": "invariavel" }
      },
      {
        "pt": "MEGA HIGH",
        "en": "MEGA HIGH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEGA HIGH", "classe": "invariavel" }
      },
      {
        "pt": "CÓS",
        "en": "WAISTBAND",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PRETINA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CÓS DE ELÁSTICO",
        "en": "ELASTIC WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PRETINA ELÁSTICA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CÓS DUPLO",
        "en": "DOUBLE WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CINTURA DOBLE", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "DOUBLE BELT",
        "en": "DOUBLE WAISTBAND",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CINTURA DOBLE", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "GANCHO",
        "en": "RISE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TIRO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "QUADRIL",
        "en": "HIP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CADERA", "classe": "substantivo", "genero": "f", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "MANGA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA CURTA",
        "en": "SHORT SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA CORTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA LONGA",
        "en": "LONG SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA LARGA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA MÉDIA",
        "en": "MID-LENGTH SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA MEDIA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MEIA MANGA",
        "en": "HALF SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEDIA MANGA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA ÚNICA",
        "en": "ONE-SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA ÚNICA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SEM MANGA",
        "en": "SLEEVELESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN MANGAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "SEM MANGAS",
        "en": "SLEEVELESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN MANGAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "MANGA MORCEGO",
        "en": "BATWING SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA MURCIÉLAGO", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA RAGLÃ",
        "en": "RAGLAN SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA RAGLÁN", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA FLARE",
        "en": "FLARED SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA FLARE", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA AMPLA",
        "en": "WIDE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA AMPLIA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA ALONGADA",
        "en": "ELONGATED SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA ALARGADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA 3/4",
        "en": "3/4 SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "expressão composta legada preservada",
        "es": { "texto": "MANGA 3/4", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGAS CURTAS",
        "en": "SHORT SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA CORTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGAS LONGAS",
        "en": "LONG SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA LARGA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA CAPA",
        "en": "CAPE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA CAPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGA DE CAPA",
        "en": "CAPE SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA CAPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGAS",
        "en": "SLEEVES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MANGAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "RAGLAN",
        "en": "RAGLAN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAGLÁN", "classe": "invariavel" }
      },
      {
        "pt": "BUFANTE",
        "en": "PUFF",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ABULLONADO", "classe": "flexivel", "formas": { "ms": "ABULLONADO", "fs": "ABULLONADA", "mp": "ABULLONADOS", "fp": "ABULLONADAS" } }
      },
      {
        "pt": "MANGA BUFANTE",
        "en": "PUFF SLEEVE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGA ABULLONADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MANGAS BUFANTES",
        "en": "PUFF SLEEVES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MANGAS ABULLONADAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "RAGLÃ",
        "en": "RAGLAN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAGLÁN", "classe": "invariavel" }
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
        "tipo": "termo",
        "es": { "texto": "CUELLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA ALTA",
        "en": "TURTLENECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO ALTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA POLO",
        "en": "POLO COLLAR",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO POLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA PADRE",
        "en": "MANDARIN COLLAR",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO MAO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE",
        "en": "NECKLINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESCOTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE CANOA",
        "en": "BOAT NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE BARCO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE CARECA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE REDONDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE PROFUNDO",
        "en": "PLUNGING NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE PROFUNDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE QUADRADO",
        "en": "SQUARE NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE CUADRADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE REDONDO",
        "en": "ROUND NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE REDONDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE V",
        "en": "V-NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE V", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE U",
        "en": "U-NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE U", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE RETO",
        "en": "STRAIGHT NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE RECTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE DEGAGÊ",
        "en": "COWL NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE DRAPEADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE NADADOR",
        "en": "RACERBACK NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESPALDA NADADORA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "NADADOR",
        "en": "RACERBACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESPALDA NADADORA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TOMARA QUE CAIA",
        "en": "STRAPLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN TIRANTES", "classe": "invariavel" }
      },
      {
        "pt": "SEM ALÇA",
        "en": "STRAPLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN TIRANTES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "FRENTE ÚNICA",
        "en": "HALTER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HALTER", "classe": "invariavel" }
      },
      {
        "pt": "OMBRO ÚNICO",
        "en": "ONE-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE UN SOLO HOMBRO", "classe": "invariavel" }
      },
      {
        "pt": "OMBRO A OMBRO",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBROS DESCUBIERTOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ALÇA",
        "en": "STRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TIRANTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ALÇAS",
        "en": "STRAPS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TIRANTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "GOLA REDONDA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO REDONDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA V",
        "en": "V-NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO V", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM ALÇAS",
        "en": "WITH STRAPS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TIRANTES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "DE ALÇAS",
        "en": "STRAPPY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE TIRANTES", "classe": "invariavel" }
      },
      {
        "pt": "DE ALÇA",
        "en": "STRAPPY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE TIRANTES", "classe": "invariavel" }
      },
      {
        "pt": "DECOTE COSTAS",
        "en": "LOW BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE ESPALDA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE DUPLO",
        "en": "DOUBLE NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE DOBLE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE EM U",
        "en": "U-NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE U", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE NAS COSTAS",
        "en": "LOW BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE EN LA ESPALDA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DEGAGÊ",
        "en": "COWL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESCOTE DRAPEADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DEGAGÊ COSTAS",
        "en": "COWL BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESPALDA DRAPEADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "GOLA CARECA",
        "en": "CREW NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO REDONDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA DUPLA",
        "en": "DOUBLE COLLAR",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO DOBLE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CIGANINHA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HOMBROS DESCUBIERTOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "DECOTADA",
        "en": "LOW-CUT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESCOTADO", "classe": "flexivel", "formas": { "ms": "ESCOTADO", "fs": "ESCOTADA", "mp": "ESCOTADOS", "fp": "ESCOTADAS" } }
      },
      {
        "pt": "DECOTADO",
        "en": "LOW-CUT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESCOTADO", "classe": "flexivel", "formas": { "ms": "ESCOTADO", "fs": "ESCOTADA", "mp": "ESCOTADOS", "fp": "ESCOTADAS" } }
      },
      {
        "pt": "DECOTE CRUZADO",
        "en": "CROSSOVER NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE CRUZADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOTA",
        "en": "KEYHOLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GOTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "OMBRO A MOSTRA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBROS DESCUBIERTOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "OMBROS À MOSTRA",
        "en": "OFF-SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBROS DESCUBIERTOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ROLOTÊ",
        "en": "SPAGHETTI STRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DE TIRANTES FINOS", "classe": "invariavel" }
      },
      {
        "pt": "GOLA ALTA",
        "en": "HIGH COLLAR",
        "status": "FECHADO",
        "tipo": "expressao",
        "contexto": "AGASALHO",
        "es": { "texto": "CUELLO ALTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DECOTE GOTA",
        "en": "KEYHOLE NECKLINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESCOTE GOTA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GOLA LAÇO",
        "en": "TIE-NECK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUELLO LAZO", "classe": "substantivo", "genero": "m", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "ALGODÓN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LINHO",
        "en": "LINEN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LINO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SEDA",
        "en": "SILK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SEDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PALHA DE SEDA",
        "en": "SILK STRAW",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PAJA DE SEDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "VISCOSE",
        "en": "VISCOSE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VISCOSA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "POLIÉSTER",
        "en": "POLYESTER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLIÉSTER", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "POLIAMIDA",
        "en": "POLYAMIDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLIAMIDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ELASTANO",
        "en": "ELASTANE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ELASTANO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ACRÍLICO",
        "en": "ACRYLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACRÍLICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ACETATO",
        "en": "ACETATE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACETATO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "POLIURETANO",
        "en": "POLYURETHANE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLIURETANO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "POLIETILENO",
        "en": "POLYETHYLENE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLIETILENO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "POLIPROPILENO",
        "en": "POLYPROPYLENE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POLIPROPILENO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LIOCEL",
        "en": "LYOCELL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LYOCELL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CÂNHAMO",
        "en": "HEMP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CÁÑAMO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "RAMI",
        "en": "RAMIE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAMIO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LÃ",
        "en": "WOOL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LANA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CASHMERE",
        "en": "CASHMERE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CASHMERE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CAXEMIRA",
        "en": "CASHMERE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CACHEMIRA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "DENIM",
        "en": "DENIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DENIM", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JEANS",
        "en": "DENIM",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "TECIDO",
        "es": { "texto": "DENIM", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JEANS",
        "en": "JEANS",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CALÇA",
        "es": { "texto": "JEANS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "SARJA",
        "en": "TWILL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SARGA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CETIM",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SATÉN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CHIFFON",
        "en": "CHIFFON",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CHIFFON", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TULE",
        "en": "TULLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TUL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JACQUARD",
        "en": "JACQUARD",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JACQUARD", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LUREX",
        "en": "LUREX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LÚREX", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "RENDA",
        "en": "LACE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENCAJE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VELUDO",
        "en": "VELVET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TERCIOPELO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VELUDO COTELÊ",
        "en": "CORDUROY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PANA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PU",
        "en": "PU",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PU", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COURO",
        "en": "LEATHER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUERO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COURO SINTÉTICO",
        "en": "SYNTHETIC LEATHER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUERO SINTÉTICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CAMURÇA",
        "en": "SUEDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GAMUZA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SUEDE",
        "en": "SUEDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUEDE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ORGANZA",
        "en": "ORGANZA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ORGANZA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TAFETÁ",
        "en": "TAFFETA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TAFETÁN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TRICÔ",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRICOT", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MALHA",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PUNTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MALHA FLAME",
        "en": "SLUB KNIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PUNTO FLAMÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "RIBANA",
        "en": "RIB KNIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CANALÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CROCHÊ",
        "en": "CROCHET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CROCHÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MACRAMÊ",
        "en": "MACRAMÉ",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MACRAMÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATPANTS",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CALÇA",
        "es": { "texto": "FELPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MOLETOM",
        "en": "SWEATSHIRT",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CARECA",
        "es": { "texto": "SUDADERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MOLETOM",
        "en": "HOODIE",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "CANGURU",
        "es": { "texto": "SUDADERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MOLETOM",
        "en": "FLEECE",
        "status": "FECHADO",
        "tipo": "termo",
        "contexto": "TECIDO DE OUTRAS PEÇAS",
        "es": { "texto": "FELPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CREPE",
        "en": "CREPE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CREPÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CREPE PATOU",
        "en": "CREPE PATOU",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CREPÉ PATOU", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "JERSEY",
        "en": "JERSEY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JERSEY", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TWEED",
        "en": "TWEED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TWEED", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TRICOLINE",
        "en": "POPLIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "POPELÍN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COTELÊ",
        "en": "CORDUROY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PANA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "GEORGETTE",
        "en": "GEORGETTE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GEORGETTE", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PELO",
        "en": "FAUX FUR",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PELO SINTÉTICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DRY FIT",
        "en": "DRY FIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DRY FIT", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LÃ BATIDA",
        "en": "BOILED WOOL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "LANA HERVIDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MALHA LEVE",
        "en": "LIGHT KNIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PUNTO LIGERO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MALHA PESADA",
        "en": "HEAVY KNIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PUNTO PESADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MALHA TRICOT",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PUNTO TRICOT", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MISTURA DE TECIDO",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEZCLA DE TEJIDOS", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MISTURA DE TECIDOS",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEZCLA DE TEJIDOS", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PLANO",
        "en": "WOVEN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TEJIDO PLANO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PLANO LEVE",
        "en": "LIGHT WOVEN",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TEJIDO PLANO LIGERO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PLANO PESADO",
        "en": "HEAVY WOVEN",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TEJIDO PLANO PESADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TECIDO PLANO",
        "en": "WOVEN",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TEJIDO PLANO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TECIDO TECNOLÓGICO",
        "en": "TECHNICAL FABRIC",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TEJIDO TÉCNICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TECNOLÓGICO",
        "en": "TECHNICAL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TÉCNICO", "classe": "flexivel", "formas": { "ms": "TÉCNICO", "fs": "TÉCNICA", "mp": "TÉCNICOS", "fp": "TÉCNICAS" } }
      },
      {
        "pt": "TRICOT",
        "en": "KNIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRICOT", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VINIL",
        "en": "VINYL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VINILO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COMPOSÊ",
        "en": "MIXED FABRICS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MEZCLA DE TEJIDOS", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FIBRA",
        "en": "FIBER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FIBRA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FLAME",
        "en": "SLUB",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLAMÉ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GORGURÃO",
        "en": "GROSGRAIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GROSGRAIN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MATERIAL SINTÉTICO",
        "en": "SYNTHETIC MATERIAL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MATERIAL SINTÉTICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TECIDO",
        "en": "FABRIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TEJIDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LEVE",
        "en": "LIGHT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LIGERO", "classe": "flexivel", "formas": { "ms": "LIGERO", "fs": "LIGERA", "mp": "LIGEROS", "fp": "LIGERAS" } }
      },
      {
        "pt": "PESADA",
        "en": "HEAVY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PESADO", "classe": "flexivel", "formas": { "ms": "PESADO", "fs": "PESADA", "mp": "PESADOS", "fp": "PESADAS" } }
      },
      {
        "pt": "PROTEÇÃO UV",
        "en": "UV PROTECTION",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PROTECCIÓN UV", "classe": "substantivo", "genero": "f", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "CANALÉ", "classe": "invariavel" }
      },
      {
        "pt": "ACETINADO",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SATINADO", "classe": "flexivel", "formas": { "ms": "SATINADO", "fs": "SATINADA", "mp": "SATINADOS", "fp": "SATINADAS" } }
      },
      {
        "pt": "TEXTURIZADO",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TEXTURIZADO", "classe": "flexivel", "formas": { "ms": "TEXTURIZADO", "fs": "TEXTURIZADA", "mp": "TEXTURIZADOS", "fp": "TEXTURIZADAS" } }
      },
      {
        "pt": "FLOCADO",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLOCADO", "classe": "flexivel", "formas": { "ms": "FLOCADO", "fs": "FLOCADA", "mp": "FLOCADOS", "fp": "FLOCADAS" } }
      },
      {
        "pt": "RESINADO",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RESINADO", "classe": "flexivel", "formas": { "ms": "RESINADO", "fs": "RESINADA", "mp": "RESINADOS", "fp": "RESINADAS" } }
      },
      {
        "pt": "METALIZADO",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "METALIZADO", "classe": "flexivel", "formas": { "ms": "METALIZADO", "fs": "METALIZADA", "mp": "METALIZADOS", "fp": "METALIZADAS" } }
      },
      {
        "pt": "MATELASSÊ",
        "en": "QUILTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACOLCHADO", "classe": "flexivel", "formas": { "ms": "ACOLCHADO", "fs": "ACOLCHADA", "mp": "ACOLCHADOS", "fp": "ACOLCHADAS" } }
      },
      {
        "pt": "PLISSADO",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PLISADO", "classe": "flexivel", "formas": { "ms": "PLISADO", "fs": "PLISADA", "mp": "PLISADOS", "fp": "PLISADAS" } }
      },
      {
        "pt": "DESFIADO",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DESHILACHADO", "classe": "flexivel", "formas": { "ms": "DESHILACHADO", "fs": "DESHILACHADA", "mp": "DESHILACHADOS", "fp": "DESHILACHADAS" } }
      },
      {
        "pt": "TRANÇADO",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRENZADO", "classe": "flexivel", "formas": { "ms": "TRENZADO", "fs": "TRENZADA", "mp": "TRENZADOS", "fp": "TRENZADAS" } }
      },
      {
        "pt": "TORÇÃO",
        "en": "TWIST",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TORSIÓN", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TORCIDO",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TORCIDO", "classe": "flexivel", "formas": { "ms": "TORCIDO", "fs": "TORCIDA", "mp": "TORCIDOS", "fp": "TORCIDAS" } }
      },
      {
        "pt": "RELEVO",
        "en": "EMBOSSED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "EN RELIEVE", "classe": "invariavel" }
      },
      {
        "pt": "COM RELEVO",
        "en": "WITH EMBOSSING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON RELIEVE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BICOLOR",
        "en": "TWO-TONE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BICOLOR", "classe": "flexivel", "formas": { "ms": "BICOLOR", "fs": "BICOLOR", "mp": "BICOLORES", "fp": "BICOLORES" } }
      },
      {
        "pt": "ESTAMPADO",
        "en": "PRINTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESTAMPADO", "classe": "flexivel", "formas": { "ms": "ESTAMPADO", "fs": "ESTAMPADA", "mp": "ESTAMPADOS", "fp": "ESTAMPADAS" } }
      },
      {
        "pt": "ESTAMPADA",
        "en": "PRINTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESTAMPADO", "classe": "flexivel", "formas": { "ms": "ESTAMPADO", "fs": "ESTAMPADA", "mp": "ESTAMPADOS", "fp": "ESTAMPADAS" } }
      },
      {
        "pt": "ESTAMPA",
        "en": "PRINT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESTAMPADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM ESTAMPA",
        "en": "WITH PRINT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON ESTAMPADO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM ESTAMPA E BRILHO",
        "en": "WITH PRINT AND SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON ESTAMPADO Y BRILLO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM ESTAMPA E BRILHOS",
        "en": "WITH PRINT AND SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON ESTAMPADO Y BRILLOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "LISTRA",
        "en": "STRIPE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "LISTRAS",
        "en": "STRIPES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "LISTRADO",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYADO", "classe": "flexivel", "formas": { "ms": "RAYADO", "fs": "RAYADA", "mp": "RAYADOS", "fp": "RAYADAS" } }
      },
      {
        "pt": "LISTRADA",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYADO", "classe": "flexivel", "formas": { "ms": "RAYADO", "fs": "RAYADA", "mp": "RAYADOS", "fp": "RAYADAS" } }
      },
      {
        "pt": "LISTRADOS",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYADO", "classe": "flexivel", "formas": { "ms": "RAYADO", "fs": "RAYADA", "mp": "RAYADOS", "fp": "RAYADAS" } }
      },
      {
        "pt": "LISTRADAS",
        "en": "STRIPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYADO", "classe": "flexivel", "formas": { "ms": "RAYADO", "fs": "RAYADA", "mp": "RAYADOS", "fp": "RAYADAS" } }
      },
      {
        "pt": "XADREZ",
        "en": "PLAID",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUADROS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "RISCA DE GIZ",
        "en": "PINSTRIPE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE RAYA DIPLOMÁTICA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CANELADA",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "CANALÉ", "classe": "invariavel" }
      },
      {
        "pt": "CANELADOS",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "CANALÉ", "classe": "invariavel" }
      },
      {
        "pt": "CANELADAS",
        "en": "RIBBED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "CANALÉ", "classe": "invariavel" }
      },
      {
        "pt": "ACETINADA",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "SATINADO", "classe": "flexivel", "formas": { "ms": "SATINADO", "fs": "SATINADA", "mp": "SATINADOS", "fp": "SATINADAS" } }
      },
      {
        "pt": "ACETINADOS",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "SATINADO", "classe": "flexivel", "formas": { "ms": "SATINADO", "fs": "SATINADA", "mp": "SATINADOS", "fp": "SATINADAS" } }
      },
      {
        "pt": "ACETINADAS",
        "en": "SATIN",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "SATINADO", "classe": "flexivel", "formas": { "ms": "SATINADO", "fs": "SATINADA", "mp": "SATINADOS", "fp": "SATINADAS" } }
      },
      {
        "pt": "TEXTURIZADA",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "TEXTURIZADO", "classe": "flexivel", "formas": { "ms": "TEXTURIZADO", "fs": "TEXTURIZADA", "mp": "TEXTURIZADOS", "fp": "TEXTURIZADAS" } }
      },
      {
        "pt": "TEXTURIZADOS",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "TEXTURIZADO", "classe": "flexivel", "formas": { "ms": "TEXTURIZADO", "fs": "TEXTURIZADA", "mp": "TEXTURIZADOS", "fp": "TEXTURIZADAS" } }
      },
      {
        "pt": "TEXTURIZADAS",
        "en": "TEXTURED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "TEXTURIZADO", "classe": "flexivel", "formas": { "ms": "TEXTURIZADO", "fs": "TEXTURIZADA", "mp": "TEXTURIZADOS", "fp": "TEXTURIZADAS" } }
      },
      {
        "pt": "FLOCADA",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "FLOCADO", "classe": "flexivel", "formas": { "ms": "FLOCADO", "fs": "FLOCADA", "mp": "FLOCADOS", "fp": "FLOCADAS" } }
      },
      {
        "pt": "FLOCADOS",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "FLOCADO", "classe": "flexivel", "formas": { "ms": "FLOCADO", "fs": "FLOCADA", "mp": "FLOCADOS", "fp": "FLOCADAS" } }
      },
      {
        "pt": "FLOCADAS",
        "en": "FLOCKED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "FLOCADO", "classe": "flexivel", "formas": { "ms": "FLOCADO", "fs": "FLOCADA", "mp": "FLOCADOS", "fp": "FLOCADAS" } }
      },
      {
        "pt": "RESINADA",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "RESINADO", "classe": "flexivel", "formas": { "ms": "RESINADO", "fs": "RESINADA", "mp": "RESINADOS", "fp": "RESINADAS" } }
      },
      {
        "pt": "RESINADOS",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "RESINADO", "classe": "flexivel", "formas": { "ms": "RESINADO", "fs": "RESINADA", "mp": "RESINADOS", "fp": "RESINADAS" } }
      },
      {
        "pt": "RESINADAS",
        "en": "RESIN-COATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "RESINADO", "classe": "flexivel", "formas": { "ms": "RESINADO", "fs": "RESINADA", "mp": "RESINADOS", "fp": "RESINADAS" } }
      },
      {
        "pt": "METALIZADA",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "METALIZADO", "classe": "flexivel", "formas": { "ms": "METALIZADO", "fs": "METALIZADA", "mp": "METALIZADOS", "fp": "METALIZADAS" } }
      },
      {
        "pt": "METALIZADOS",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "METALIZADO", "classe": "flexivel", "formas": { "ms": "METALIZADO", "fs": "METALIZADA", "mp": "METALIZADOS", "fp": "METALIZADAS" } }
      },
      {
        "pt": "METALIZADAS",
        "en": "METALLIC",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "METALIZADO", "classe": "flexivel", "formas": { "ms": "METALIZADO", "fs": "METALIZADA", "mp": "METALIZADOS", "fp": "METALIZADAS" } }
      },
      {
        "pt": "PLISSADA",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "PLISADO", "classe": "flexivel", "formas": { "ms": "PLISADO", "fs": "PLISADA", "mp": "PLISADOS", "fp": "PLISADAS" } }
      },
      {
        "pt": "PLISSADOS",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "PLISADO", "classe": "flexivel", "formas": { "ms": "PLISADO", "fs": "PLISADA", "mp": "PLISADOS", "fp": "PLISADAS" } }
      },
      {
        "pt": "PLISSADAS",
        "en": "PLEATED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "PLISADO", "classe": "flexivel", "formas": { "ms": "PLISADO", "fs": "PLISADA", "mp": "PLISADOS", "fp": "PLISADAS" } }
      },
      {
        "pt": "DESFIADA",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "DESHILACHADO", "classe": "flexivel", "formas": { "ms": "DESHILACHADO", "fs": "DESHILACHADA", "mp": "DESHILACHADOS", "fp": "DESHILACHADAS" } }
      },
      {
        "pt": "DESFIADOS",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "DESHILACHADO", "classe": "flexivel", "formas": { "ms": "DESHILACHADO", "fs": "DESHILACHADA", "mp": "DESHILACHADOS", "fp": "DESHILACHADAS" } }
      },
      {
        "pt": "DESFIADAS",
        "en": "FRAYED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "DESHILACHADO", "classe": "flexivel", "formas": { "ms": "DESHILACHADO", "fs": "DESHILACHADA", "mp": "DESHILACHADOS", "fp": "DESHILACHADAS" } }
      },
      {
        "pt": "TRANÇADA",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "TRENZADO", "classe": "flexivel", "formas": { "ms": "TRENZADO", "fs": "TRENZADA", "mp": "TRENZADOS", "fp": "TRENZADAS" } }
      },
      {
        "pt": "TRANÇADOS",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "TRENZADO", "classe": "flexivel", "formas": { "ms": "TRENZADO", "fs": "TRENZADA", "mp": "TRENZADOS", "fp": "TRENZADAS" } }
      },
      {
        "pt": "TRANÇADAS",
        "en": "BRAIDED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "TRENZADO", "classe": "flexivel", "formas": { "ms": "TRENZADO", "fs": "TRENZADA", "mp": "TRENZADOS", "fp": "TRENZADAS" } }
      },
      {
        "pt": "TORCIDA",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "forma feminina do índice revisado",
        "es": { "texto": "TORCIDO", "classe": "flexivel", "formas": { "ms": "TORCIDO", "fs": "TORCIDA", "mp": "TORCIDOS", "fp": "TORCIDAS" } }
      },
      {
        "pt": "TORCIDOS",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural do índice revisado",
        "es": { "texto": "TORCIDO", "classe": "flexivel", "formas": { "ms": "TORCIDO", "fs": "TORCIDA", "mp": "TORCIDOS", "fp": "TORCIDAS" } }
      },
      {
        "pt": "TORCIDAS",
        "en": "TWISTED",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "plural feminino do índice revisado",
        "es": { "texto": "TORCIDO", "classe": "flexivel", "formas": { "ms": "TORCIDO", "fs": "TORCIDA", "mp": "TORCIDOS", "fp": "TORCIDAS" } }
      },
      {
        "pt": "BRILHO",
        "en": "SHIMMER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BRILLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CONTRASTE",
        "en": "CONTRAST",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CONTRASTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MESCLA",
        "en": "HEATHERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "JASPEADO", "classe": "flexivel", "formas": { "ms": "JASPEADO", "fs": "JASPEADA", "mp": "JASPEADOS", "fp": "JASPEADAS" } }
      },
      {
        "pt": "ESTAMPA LOCAL",
        "en": "PLACEMENT PRINT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESTAMPADO LOCALIZADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ARTE",
        "en": "GRAPHIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GRÁFICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BRILHOS",
        "en": "SHIMMER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BRILLOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "CONTRASTANTE",
        "en": "CONTRAST",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CONTRASTANTE", "classe": "flexivel", "formas": { "ms": "CONTRASTANTE", "fs": "CONTRASTANTE", "mp": "CONTRASTANTES", "fp": "CONTRASTANTES" } }
      },
      {
        "pt": "DEGRADÊ",
        "en": "OMBRÉ",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DEGRADADO", "classe": "flexivel", "formas": { "ms": "DEGRADADO", "fs": "DEGRADADA", "mp": "DEGRADADOS", "fp": "DEGRADADAS" } }
      },
      {
        "pt": "ESPINHA DE PEIXE",
        "en": "HERRINGBONE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE ESPIGA", "classe": "invariavel" }
      },
      {
        "pt": "ESTONADA",
        "en": "STONEWASHED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LAVADO A LA PIEDRA", "classe": "flexivel", "formas": { "ms": "LAVADO A LA PIEDRA", "fs": "LAVADA A LA PIEDRA", "mp": "LAVADOS A LA PIEDRA", "fp": "LAVADAS A LA PIEDRA" } }
      },
      {
        "pt": "ESTONADO",
        "en": "STONEWASHED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LAVADO A LA PIEDRA", "classe": "flexivel", "formas": { "ms": "LAVADO A LA PIEDRA", "fs": "LAVADA A LA PIEDRA", "mp": "LAVADOS A LA PIEDRA", "fp": "LAVADAS A LA PIEDRA" } }
      },
      {
        "pt": "MONOGRAMA",
        "en": "MONOGRAM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MONOGRAMA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PADRONAGEM",
        "en": "PATTERN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DIBUJO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PATCHWORK",
        "en": "PATCHWORK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PATCHWORK", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PIED POULE",
        "en": "HOUNDSTOOTH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PATA DE GALLO", "classe": "invariavel" }
      },
      {
        "pt": "RESINA",
        "en": "RESIN COATING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RESINA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SILK",
        "en": "SCREEN PRINT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SERIGRAFÍA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TRICOLOR",
        "en": "TRICOLOR",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRICOLOR", "classe": "flexivel", "formas": { "ms": "TRICOLOR", "fs": "TRICOLOR", "mp": "TRICOLORES", "fp": "TRICOLORES" } }
      },
      {
        "pt": "A FIO",
        "en": "DISTRESSED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DESGASTADO", "classe": "flexivel", "formas": { "ms": "DESGASTADO", "fs": "DESGASTADA", "mp": "DESGASTADOS", "fp": "DESGASTADAS" } }
      },
      {
        "pt": "CUSTOMIZADO",
        "en": "CUSTOMIZED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PERSONALIZADO", "classe": "flexivel", "formas": { "ms": "PERSONALIZADO", "fs": "PERSONALIZADA", "mp": "PERSONALIZADOS", "fp": "PERSONALIZADAS" } }
      },
      {
        "pt": "ESTAMPA DE FLORES",
        "en": "FLORAL PRINT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESTAMPADO FLORAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ESTAMPA FLORAL",
        "en": "FLORAL PRINT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESTAMPADO FLORAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FLOR",
        "en": "FLOWER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLOR", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM FLORES",
        "en": "WITH FLORAL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FLORES", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "FLORES",
        "en": "FLORAL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLORAL", "classe": "flexivel", "formas": { "ms": "FLORAL", "fs": "FLORAL", "mp": "FLORALES", "fp": "FLORALES" } }
      },
      {
        "pt": "FLUTED",
        "en": "FLUTED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLUTED", "classe": "invariavel" }
      },
      {
        "pt": "GEOMÉTRICO",
        "en": "GEOMETRIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GEOMÉTRICO", "classe": "flexivel", "formas": { "ms": "GEOMÉTRICO", "fs": "GEOMÉTRICA", "mp": "GEOMÉTRICOS", "fp": "GEOMÉTRICAS" } }
      },
      {
        "pt": "MIX",
        "en": "MIX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MIX", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "REVESTIMENTO",
        "en": "COATING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "REVESTIMIENTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SHINE",
        "en": "SHINE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SHINE", "classe": "invariavel" }
      },
      {
        "pt": "TEXTURA",
        "en": "TEXTURE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TEXTURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BLACK",
        "en": "BLACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BLACK", "classe": "invariavel" }
      },
      {
        "pt": "ACABAMENTO",
        "en": "FINISH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACABADO", "classe": "substantivo", "genero": "m", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "DETALLE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DETALHES",
        "en": "DETAILS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DETALLES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM DETALHE",
        "en": "WITH DETAIL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON DETALLE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM DETALHES",
        "en": "WITH DETAILS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON DETALLES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "APLICAÇÃO",
        "en": "APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "APLIQUE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "APLICAÇÕES",
        "en": "APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "APLIQUES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM APLICAÇÃO",
        "en": "WITH APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON APLIQUE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM APLICAÇÕES",
        "en": "WITH APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON APLIQUES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM APLICAÇÃO DE RENDA",
        "en": "WITH LACE APPLIQUÉ",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON APLIQUE DE ENCAJE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "AVIAMENTO",
        "en": "TRIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FORNITURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "AVIAMENTOS",
        "en": "TRIMS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FORNITURAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM AVIAMENTO",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FORNITURA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM AVIAMENTOS",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FORNITURAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "BORDADO",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORDADO", "classe": "flexivel", "formas": { "ms": "BORDADO", "fs": "BORDADA", "mp": "BORDADOS", "fp": "BORDADAS" } }
      },
      {
        "pt": "BORDADA",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORDADO", "classe": "flexivel", "formas": { "ms": "BORDADO", "fs": "BORDADA", "mp": "BORDADOS", "fp": "BORDADAS" } }
      },
      {
        "pt": "BORDADOS",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORDADO", "classe": "flexivel", "formas": { "ms": "BORDADO", "fs": "BORDADA", "mp": "BORDADOS", "fp": "BORDADAS" } }
      },
      {
        "pt": "BORDADAS",
        "en": "EMBROIDERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORDADO", "classe": "flexivel", "formas": { "ms": "BORDADO", "fs": "BORDADA", "mp": "BORDADOS", "fp": "BORDADAS" } }
      },
      {
        "pt": "COM BORDADO",
        "en": "WITH EMBROIDERY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BORDADO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM BORDADOS",
        "en": "WITH EMBROIDERY",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BORDADOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "PEDRARIA",
        "en": "RHINESTONE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PEDRERÍA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PEDRARIAS",
        "en": "RHINESTONES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PEDRERÍA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM PEDRARIA",
        "en": "WITH RHINESTONE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON PEDRERÍA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM PEDRARIAS",
        "en": "WITH RHINESTONES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON PEDRERÍA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PAETÊ",
        "en": "SEQUIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LENTEJUELAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "PAETÊS",
        "en": "SEQUINS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LENTEJUELAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM PAETÊ",
        "en": "WITH SEQUINS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON LENTEJUELAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM PAETÊS",
        "en": "WITH SEQUINS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON LENTEJUELAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "METAL",
        "en": "METAL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "METAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM METAL",
        "en": "WITH METAL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON METAL", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORRENTE",
        "en": "CHAIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CADENA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CORRENTES",
        "en": "CHAINS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CADENAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM CORRENTE",
        "en": "WITH CHAIN",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CADENA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM CORRENTES",
        "en": "WITH CHAINS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CADENAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "ARGOLA",
        "en": "RING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ANILLA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ARGOLAS",
        "en": "RINGS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ANILLAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM ARGOLA",
        "en": "WITH RING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON ANILLA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM ARGOLAS",
        "en": "WITH RINGS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON ANILLAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "FIVELA",
        "en": "BUCKLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HEBILLA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FIVELAS",
        "en": "BUCKLES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HEBILLAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM FIVELA",
        "en": "WITH BUCKLE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON HEBILLA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM FIVELAS",
        "en": "WITH BUCKLES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON HEBILLAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "BOTÃO",
        "en": "BUTTON",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOTÓN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOTÕES",
        "en": "BUTTONS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOTONES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM BOTÃO",
        "en": "WITH BUTTON",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BOTÓN", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM BOTÕES",
        "en": "WITH BUTTONS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BOTONES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ZÍPER",
        "en": "ZIPPER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CREMALLERA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ZÍPERES",
        "en": "ZIPPERS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CREMALLERAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM ZÍPER",
        "en": "WITH ZIPPER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CREMALLERA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM ZÍPERES",
        "en": "WITH ZIPPERS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CREMALLERAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COLCHETE",
        "en": "CLASP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORCHETE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COLCHETES",
        "en": "CLASPS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORCHETES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM COLCHETE",
        "en": "WITH CLASP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CORCHETE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM COLCHETES",
        "en": "WITH CLASPS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CORCHETES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ILHÓ",
        "en": "EYELET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "OJAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ILHÓS",
        "en": "EYELETS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "OJALES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM ILHÓ",
        "en": "WITH EYELETS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON OJAL", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM ILHÓS",
        "en": "WITH EYELETS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON OJALES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "BROCHE",
        "en": "BROOCH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BROCHE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BROCHES",
        "en": "BROOCHES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BROCHES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM BROCHE",
        "en": "WITH BROOCH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BROCHE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM BROCHES",
        "en": "WITH BROOCHES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BROCHES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "PÉROLA",
        "en": "PEARL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PERLA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PÉROLAS",
        "en": "PEARLS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PERLAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM PÉROLA",
        "en": "WITH PEARLS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON PERLA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM PÉROLAS",
        "en": "WITH PEARLS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON PERLAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "CRISTAL",
        "en": "CRYSTAL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRISTAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CRISTAIS",
        "en": "CRYSTALS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRISTALES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM CRISTAL",
        "en": "WITH CRYSTALS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CRISTAL", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM CRISTAIS",
        "en": "WITH CRYSTALS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CRISTALES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "PINGENTE",
        "en": "PENDANT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COLGANTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PINGENTES",
        "en": "PENDANTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COLGANTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM PINGENTE",
        "en": "WITH PENDANT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON COLGANTE", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM PINGENTES",
        "en": "WITH PENDANTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON COLGANTES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "TACHA",
        "en": "STUD",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TACHA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TACHAS",
        "en": "STUDS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TACHAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM TACHA",
        "en": "WITH STUDS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TACHA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM TACHAS",
        "en": "WITH STUDS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TACHAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "FRANJA",
        "en": "FRINGE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLECOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "FRANJAS",
        "en": "FRINGE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FLECOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM FRANJA",
        "en": "WITH FRINGE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FLECOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM FRANJAS",
        "en": "WITH FRINGE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FLECOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "BARBICACHO",
        "en": "TASSEL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORLA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BARBICACHOS",
        "en": "TASSELS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BORLAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM BARBICACHO",
        "en": "WITH TASSEL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BORLA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM BARBICACHOS",
        "en": "WITH TASSELS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BORLAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "LAÇO",
        "en": "BOW",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LAZO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LAÇOS",
        "en": "BOWS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LAZOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM LAÇO",
        "en": "WITH BOW",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON LAZO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM LAÇOS",
        "en": "WITH BOWS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON LAZOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "NÓ",
        "en": "KNOT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "NUDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "NÓS",
        "en": "KNOTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "NUDOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM NÓ",
        "en": "WITH KNOT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON NUDO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM NÓS",
        "en": "WITH KNOTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON NUDOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "FAIXA",
        "en": "SASH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FAJÍN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FAIXAS",
        "en": "SASHES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FAJINES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM FAIXA",
        "en": "WITH SASH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FAJÍN", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM FAIXAS",
        "en": "WITH SASHES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FAJINES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "CINTO",
        "en": "BELT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CINTURÓN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CINTOS",
        "en": "BELTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CINTURONES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM CINTO",
        "en": "WITH BELT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CINTURÓN", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM CINTOS",
        "en": "WITH BELTS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CINTURONES", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "PASSANTE",
        "en": "BELT LOOP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRABILLA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PASSANTES",
        "en": "BELT LOOPS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRABILLAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM PASSANTE",
        "en": "WITH BELT LOOPS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TRABILLA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM PASSANTES",
        "en": "WITH BELT LOOPS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TRABILLAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "OMBREIRA",
        "en": "SHOULDER PAD",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HOMBRERA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "OMBREIRAS",
        "en": "SHOULDER PADS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HOMBRERAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM BRILHO",
        "en": "WITH SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BRILLO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM CACHECOL",
        "en": "WITH SCARF",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BUFANDA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "AJUSTE",
        "en": "ADJUSTER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ALFINETE",
        "en": "SAFETY PIN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALFILER", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "AMARRAÇÕES",
        "en": "TIES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LAZADAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "APLICAÇÕES DE BRILHO",
        "en": "SHIMMER APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "APLIQUES DE BRILLO", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "AVIÔ",
        "en": "TRIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FORNITURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "AVIÔS",
        "en": "TRIMS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FORNITURAS", "classe": "substantivo", "genero": "f", "numero": "p" }
      },
      {
        "pt": "COM AVIÔ",
        "en": "WITH TRIM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON FORNITURA", "classe": "invariavel", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM BRILHOS",
        "en": "WITH SHIMMER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON BRILLOS", "classe": "invariavel", "genero": "m", "numero": "p" }
      },
      {
        "pt": "COM TERMO",
        "en": "WITH HOTFIX",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TERMOADHESIVO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM TERMOCOLANTE",
        "en": "WITH HOTFIX",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON TERMOADHESIVO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ETIQUETA",
        "en": "LABEL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ETIQUETA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FAIXA NO PESCOÇO",
        "en": "NECK TIE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "LAZO AL CUELLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FECHO",
        "en": "CLASP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORCHETE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FECHOS",
        "en": "CLASPS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORCHETES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ILHÓSES",
        "en": "EYELETS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "OJALES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "NAME",
        "en": "NAME",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "NAME", "classe": "invariavel" }
      },
      {
        "pt": "PLACA",
        "en": "PLAQUE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PLACA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "REGULAGEM",
        "en": "ADJUSTER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "REGULÁVEL",
        "en": "ADJUSTABLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTABLE", "classe": "flexivel", "formas": { "ms": "AJUSTABLE", "fs": "AJUSTABLE", "mp": "AJUSTABLES", "fp": "AJUSTABLES" } }
      },
      {
        "pt": "TERMO",
        "en": "HOTFIX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TERMOADHESIVO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TERMOCOLANTE",
        "en": "HOTFIX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TERMOADHESIVO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ZÍPER FRONTAL",
        "en": "FRONT ZIPPER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CREMALLERA FRONTAL", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "AJUSTÁVEL",
        "en": "ADJUSTABLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "AJUSTABLE", "classe": "flexivel", "formas": { "ms": "AJUSTABLE", "fs": "AJUSTABLE", "mp": "AJUSTABLES", "fp": "AJUSTABLES" } }
      },
      {
        "pt": "APLICAÇÃO DE FLORES",
        "en": "FLOWER APPLIQUÉS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "APLIQUE DE FLORES", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORDÃO",
        "en": "DRAWSTRING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORDÓN", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PATCH",
        "en": "PATCH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PATCH", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SIANINHA",
        "en": "RICKRACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CINTA ZIGZAG", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BABADO",
        "en": "RUFFLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VOLANTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BABADOS",
        "en": "RUFFLES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VOLANTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "RETILÍNEA",
        "en": "RIB TRIM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "REMATES EN CANALÉ", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "FRUFRU",
        "en": "RUFFLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VOLANTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ELÁSTICO",
        "en": "ELASTIC",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ELÁSTICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FAIXA NA CINTURA",
        "en": "WAIST SASH",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FAJÍN EN LA CINTURA", "classe": "substantivo", "genero": "m", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "BOLSILLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOLSOS",
        "en": "POCKETS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOLSILLOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "BOLSO FACA",
        "en": "SLASH POCKET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOLSILLO DIAGONAL", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOLSO CARGO",
        "en": "CARGO POCKET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOLSILLO CARGO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FORRO DE BOLSO",
        "en": "POCKET LINING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "FORRO DE BOLSILLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOLSO CHAPADO",
        "en": "PATCH POCKET",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOLSILLO DE PARCHE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOLSOS CHAPADOS",
        "en": "PATCH POCKETS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOLSILLOS DE PARCHE", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "BOLSOS LATERAIS",
        "en": "SIDE POCKETS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BOLSILLOS LATERALES", "classe": "substantivo", "genero": "m", "numero": "p" }
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
        "tipo": "termo",
        "es": { "texto": "RECORTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "RECORTES",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RECORTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "VAZADO",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUT OUT", "classe": "invariavel" }
      },
      {
        "pt": "VAZADA",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUT OUT", "classe": "invariavel" }
      },
      {
        "pt": "VAZADOS",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUT OUT", "classe": "invariavel" }
      },
      {
        "pt": "VAZADAS",
        "en": "CUTOUTS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUT OUT", "classe": "invariavel" }
      },
      {
        "pt": "ABERTURA",
        "en": "OPENING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ABERTURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FENDA",
        "en": "SLIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ABERTURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTURA",
        "en": "SEAM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COSTURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTURA ABERTA",
        "en": "OPEN SEAM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "COSTURA ABIERTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTURA APARENTE",
        "en": "EXPOSED SEAM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "COSTURA APARENTE", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BARRA",
        "en": "HEM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BAJO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BARRA DOBRADA",
        "en": "FOLDED HEM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BAJO DOBLADO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BARRA ITALIANA",
        "en": "CUFFED HEM",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BAJO VUELTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PUNHO",
        "en": "CUFF",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PUÑO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PALA",
        "en": "YOKE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CANESÚ", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LAPELA",
        "en": "LAPEL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SOLAPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "FORRO",
        "en": "LINING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FORRO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CAPUZ",
        "en": "HOOD",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAPUCHA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CARCELA",
        "en": "PLACKET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TAPETA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "VIÉS",
        "en": "BIAS BINDING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BIES", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DEBRUM",
        "en": "PIPING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RIBETE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PESPONTO",
        "en": "TOPSTITCHING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PESPUNTE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "NERVURA",
        "en": "PINTUCK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ALFORZA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PREGA",
        "en": "PLEAT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PLIEGUE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PREGAS",
        "en": "PLEATS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PLIEGUES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "DRAPEADO",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DRAPEADO", "classe": "flexivel", "formas": { "ms": "DRAPEADO", "fs": "DRAPEADA", "mp": "DRAPEADOS", "fp": "DRAPEADAS" } }
      },
      {
        "pt": "DRAPEADA",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DRAPEADO", "classe": "flexivel", "formas": { "ms": "DRAPEADO", "fs": "DRAPEADA", "mp": "DRAPEADOS", "fp": "DRAPEADAS" } }
      },
      {
        "pt": "DRAPEADOS",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DRAPEADO", "classe": "flexivel", "formas": { "ms": "DRAPEADO", "fs": "DRAPEADA", "mp": "DRAPEADOS", "fp": "DRAPEADAS" } }
      },
      {
        "pt": "DRAPEADAS",
        "en": "DRAPED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DRAPEADO", "classe": "flexivel", "formas": { "ms": "DRAPEADO", "fs": "DRAPEADA", "mp": "DRAPEADOS", "fp": "DRAPEADAS" } }
      },
      {
        "pt": "FRANZIDO",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRUNCIDO", "classe": "flexivel", "formas": { "ms": "FRUNCIDO", "fs": "FRUNCIDA", "mp": "FRUNCIDOS", "fp": "FRUNCIDAS" } }
      },
      {
        "pt": "FRANZIDA",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRUNCIDO", "classe": "flexivel", "formas": { "ms": "FRUNCIDO", "fs": "FRUNCIDA", "mp": "FRUNCIDOS", "fp": "FRUNCIDAS" } }
      },
      {
        "pt": "FRANZIDOS",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRUNCIDO", "classe": "flexivel", "formas": { "ms": "FRUNCIDO", "fs": "FRUNCIDA", "mp": "FRUNCIDOS", "fp": "FRUNCIDAS" } }
      },
      {
        "pt": "FRANZIDAS",
        "en": "GATHERED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRUNCIDO", "classe": "flexivel", "formas": { "ms": "FRUNCIDO", "fs": "FRUNCIDA", "mp": "FRUNCIDOS", "fp": "FRUNCIDAS" } }
      },
      {
        "pt": "TRANSPASSE",
        "en": "WRAP DETAIL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUCE", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TRANSPASSADO",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "TRANSPASSADA",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "TRANSPASSADOS",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "TRANSPASSADAS",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "SOBREPOSIÇÃO",
        "en": "OVERLAY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SUPERPOSICIÓN", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "DOBRADO",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLADO", "classe": "flexivel", "formas": { "ms": "DOBLADO", "fs": "DOBLADA", "mp": "DOBLADOS", "fp": "DOBLADAS" } }
      },
      {
        "pt": "DOBRADA",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLADO", "classe": "flexivel", "formas": { "ms": "DOBLADO", "fs": "DOBLADA", "mp": "DOBLADOS", "fp": "DOBLADAS" } }
      },
      {
        "pt": "DOBRADOS",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLADO", "classe": "flexivel", "formas": { "ms": "DOBLADO", "fs": "DOBLADA", "mp": "DOBLADOS", "fp": "DOBLADAS" } }
      },
      {
        "pt": "DOBRADAS",
        "en": "FOLDED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLADO", "classe": "flexivel", "formas": { "ms": "DOBLADO", "fs": "DOBLADA", "mp": "DOBLADOS", "fp": "DOBLADAS" } }
      },
      {
        "pt": "AMARRAÇÃO",
        "en": "TIE DETAIL",
        "status": "FECHADO",
        "tipo": "termo",
        "origem": "terminologia previamente decidida",
        "es": { "texto": "LAZADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTAS À MOSTRA",
        "en": "BACKLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "terminologia previamente decidida",
        "es": { "texto": "ESPALDA DESCUBIERTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTAS VAZADAS",
        "en": "CUTOUT BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "origem": "terminologia previamente decidida",
        "es": { "texto": "ESPALDA CUT OUT", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTAS ABERTAS",
        "en": "OPEN BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESPALDA ABIERTA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ALFAIATARIA",
        "en": "TAILORED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SASTRE", "classe": "invariavel", "adjetivo": true }
      },
      {
        "pt": "ABOTOAMENTO",
        "en": "BUTTON CLOSURE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOTONADURA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM CORTE A LASER",
        "en": "WITH LASER-CUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CORTE LÁSER", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORTE A LASER",
        "en": "LASER-CUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CORTADO A LÁSER", "classe": "flexivel", "formas": { "ms": "CORTADO A LÁSER", "fs": "CORTADA A LÁSER", "mp": "CORTADOS A LÁSER", "fp": "CORTADAS A LÁSER" } }
      },
      {
        "pt": "CORTE EVASÊ",
        "en": "A-LINE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "EVASÉ", "classe": "invariavel" }
      },
      {
        "pt": "CORTE RETO",
        "en": "STRAIGHT CUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CORTE RECTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SEM COSTURA",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN COSTURAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "SEM COSTURAS",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SIN COSTURAS", "classe": "invariavel", "genero": "f", "numero": "p" }
      },
      {
        "pt": "ABERTURA COSTAS",
        "en": "BACK OPENING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ABERTURA ESPALDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ABERTURA FRENTE",
        "en": "FRONT OPENING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ABERTURA FRONTAL", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ABERTURA FRONTAL",
        "en": "FRONT OPENING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ABERTURA FRONTAL", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ABERTURA LATERAL",
        "en": "SIDE OPENING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ABERTURA LATERAL", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ABERTURA NAS COSTAS",
        "en": "BACK OPENING",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ABERTURA EN LA ESPALDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CACHEQUER",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "CAPA",
        "en": "CAPE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAPA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CAVADA",
        "en": "DEEP ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SISA PROFUNDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CAVADO",
        "en": "DEEP ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SISA PROFUNDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM CUT OFF",
        "en": "WITH CUT-OFF",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CUT OFF", "classe": "invariavel" }
      },
      {
        "pt": "COSTAS",
        "en": "BACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESPALDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTAS CORSET",
        "en": "CORSET BACK",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "ESPALDA CORSET", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CUT OFF",
        "en": "CUT-OFF",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUT OFF", "classe": "invariavel" }
      },
      {
        "pt": "CUT OUT",
        "en": "CUTOUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CUT OUT", "classe": "invariavel" }
      },
      {
        "pt": "DEDINHO",
        "en": "THUMBHOLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ABERTURA PARA EL PULGAR", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "DETALHE COSTAS",
        "en": "BACK DETAIL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DETALLE ESPALDA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "DIAGONAL",
        "en": "DIAGONAL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DIAGONAL", "classe": "flexivel", "formas": { "ms": "DIAGONAL", "fs": "DIAGONAL", "mp": "DIAGONALES", "fp": "DIAGONALES" } }
      },
      {
        "pt": "DUPLA",
        "en": "DOUBLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLE", "classe": "flexivel", "formas": { "ms": "DOBLE", "fs": "DOBLE", "mp": "DOBLES", "fp": "DOBLES" } }
      },
      {
        "pt": "DUPLA FACE",
        "en": "REVERSIBLE",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "REVERSIBLE", "classe": "flexivel", "formas": { "ms": "REVERSIBLE", "fs": "REVERSIBLE", "mp": "REVERSIBLES", "fp": "REVERSIBLES" } }
      },
      {
        "pt": "DUPLO",
        "en": "DOUBLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLE", "classe": "flexivel", "formas": { "ms": "DOBLE", "fs": "DOBLE", "mp": "DOBLES", "fp": "DOBLES" } }
      },
      {
        "pt": "FRONTAIS",
        "en": "FRONT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRONTAL", "classe": "flexivel", "formas": { "ms": "FRONTAL", "fs": "FRONTAL", "mp": "FRONTALES", "fp": "FRONTALES" } }
      },
      {
        "pt": "FRONTAL",
        "en": "FRONT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRONTAL", "classe": "flexivel", "formas": { "ms": "FRONTAL", "fs": "FRONTAL", "mp": "FRONTALES", "fp": "FRONTALES" } }
      },
      {
        "pt": "INTERNO",
        "en": "INNER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "INTERIOR", "classe": "flexivel", "formas": { "ms": "INTERIOR", "fs": "INTERIOR", "mp": "INTERIORES", "fp": "INTERIORES" } }
      },
      {
        "pt": "LATERAIS",
        "en": "SIDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LATERAL", "classe": "flexivel", "formas": { "ms": "LATERAL", "fs": "LATERAL", "mp": "LATERALES", "fp": "LATERALES" } }
      },
      {
        "pt": "LATERAL",
        "en": "SIDE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LATERAL", "classe": "flexivel", "formas": { "ms": "LATERAL", "fs": "LATERAL", "mp": "LATERALES", "fp": "LATERALES" } }
      },
      {
        "pt": "OMBRO ASSIMÉTRICO",
        "en": "ASYMMETRIC SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBRO ASIMÉTRICO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "OMBRO DESLOCADO",
        "en": "DROP SHOULDER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBRO CAÍDO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PREGA COSTAS",
        "en": "BACK PLEAT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PLIEGUE ESPALDA", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PREGAS FRONTAIS",
        "en": "FRONT PLEATS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PLIEGUES FRONTALES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "REMOVÍVEL",
        "en": "REMOVABLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "REMOVIBLE", "classe": "flexivel", "formas": { "ms": "REMOVIBLE", "fs": "REMOVIBLE", "mp": "REMOVIBLES", "fp": "REMOVIBLES" } }
      },
      {
        "pt": "SEAMLESS",
        "en": "SEAMLESS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SEAMLESS", "classe": "invariavel" }
      },
      {
        "pt": "BAINHA",
        "en": "HEM",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DOBLADILLO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BUSTO",
        "en": "BUST",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BUSTO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CACHAQUER",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "CAVA",
        "en": "ARMHOLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SISA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COSTA",
        "en": "BACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ESPALDA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CRUZADO",
        "en": "CRISS-CROSS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "EMBUTIDA",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "INCORPORADO", "classe": "flexivel", "formas": { "ms": "INCORPORADO", "fs": "INCORPORADA", "mp": "INCORPORADOS", "fp": "INCORPORADAS" } }
      },
      {
        "pt": "EMBUTIDAS",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "INCORPORADO", "classe": "flexivel", "formas": { "ms": "INCORPORADO", "fs": "INCORPORADA", "mp": "INCORPORADOS", "fp": "INCORPORADAS" } }
      },
      {
        "pt": "EMBUTIDO",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "INCORPORADO", "classe": "flexivel", "formas": { "ms": "INCORPORADO", "fs": "INCORPORADA", "mp": "INCORPORADOS", "fp": "INCORPORADAS" } }
      },
      {
        "pt": "EMBUTIDOS",
        "en": "BUILT-IN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "INCORPORADO", "classe": "flexivel", "formas": { "ms": "INCORPORADO", "fs": "INCORPORADA", "mp": "INCORPORADOS", "fp": "INCORPORADAS" } }
      },
      {
        "pt": "ENVELOPE",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CRUZADO", "classe": "flexivel", "formas": { "ms": "CRUZADO", "fs": "CRUZADA", "mp": "CRUZADOS", "fp": "CRUZADAS" } }
      },
      {
        "pt": "OMBRO",
        "en": "SHOULDER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HOMBRO", "classe": "substantivo", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PESPONTOS",
        "en": "TOPSTITCHING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PESPUNTES", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "VINCO",
        "en": "CREASE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "RAYA PLANCHADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "WRAP",
        "en": "WRAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "WRAP", "classe": "invariavel" }
      },
      {
        "pt": "OMBROS BUFANTE",
        "en": "PUFF SHOULDERS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBROS ABULLONADOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "OMBROS BUFANTES",
        "en": "PUFF SHOULDERS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "HOMBROS ABULLONADOS", "classe": "substantivo", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ASA DELTA",
        "en": "HIGH-CUT",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "DE CORTE ALTO", "classe": "invariavel" }
      },
      {
        "pt": "QUADRADO",
        "en": "SQUARE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CUADRADO", "classe": "flexivel", "formas": { "ms": "CUADRADO", "fs": "CUADRADA", "mp": "CUADRADOS", "fp": "CUADRADAS" } }
      },
      {
        "pt": "COULISSÊ",
        "en": "SHIRRED",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "FRUNCIDO", "classe": "flexivel", "formas": { "ms": "FRUNCIDO", "fs": "FRUNCIDA", "mp": "FRUNCIDOS", "fp": "FRUNCIDAS" } }
      },
      {
        "pt": "PONTO",
        "en": "STITCH",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PUNTADA", "classe": "substantivo", "genero": "f", "numero": "s" }
      },
      {
        "pt": "COM BOJO",
        "en": "PADDED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON RELLENO", "classe": "invariavel", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COM CAPUZ",
        "en": "HOODED",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CON CAPUCHA", "classe": "invariavel", "genero": "f", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "AFRODITE", "classe": "nome_proprio" }
      },
      {
        "pt": "ATENA",
        "en": "ATENA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ATENA", "classe": "nome_proprio" }
      },
      {
        "pt": "DIANA",
        "en": "DIANA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "DIANA", "classe": "nome_proprio" }
      },
      {
        "pt": "GAIA",
        "en": "GAIA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GAIA", "classe": "nome_proprio" }
      },
      {
        "pt": "HERA",
        "en": "HERA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HERA", "classe": "nome_proprio" }
      },
      {
        "pt": "HÉSTIA",
        "en": "HÉSTIA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "HÉSTIA", "classe": "nome_proprio" }
      },
      {
        "pt": "LUNA",
        "en": "LUNA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LUNA", "classe": "nome_proprio" }
      },
      {
        "pt": "MINERVA",
        "en": "MINERVA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MINERVA", "classe": "nome_proprio" }
      },
      {
        "pt": "NIX",
        "en": "NIX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "NIX", "classe": "nome_proprio" }
      },
      {
        "pt": "PAX",
        "en": "PAX",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PAX", "classe": "nome_proprio" }
      },
      {
        "pt": "SELENE",
        "en": "SELENE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SELENE", "classe": "nome_proprio" }
      },
      {
        "pt": "TALASSA",
        "en": "TALASSA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TALASSA", "classe": "nome_proprio" }
      },
      {
        "pt": "TOMAS",
        "en": "TOMAS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TOMAS", "classe": "nome_proprio" }
      },
      {
        "pt": "VENUS",
        "en": "VENUS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VENUS", "classe": "nome_proprio" }
      },
      {
        "pt": "VESTA",
        "en": "VESTA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VESTA", "classe": "nome_proprio" }
      },
      {
        "pt": "ÍRIS",
        "en": "ÍRIS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ÍRIS", "classe": "nome_proprio" }
      },
      {
        "pt": "SIGNATURE",
        "en": "SIGNATURE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SIGNATURE", "classe": "nome_proprio" }
      },
      {
        "pt": "MICKEY",
        "en": "MICKEY",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MICKEY", "classe": "nome_proprio" }
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
        "tipo": "expressao",
        "es": { "texto": "TRENCH COAT", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOMBER",
        "en": "BOMBER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOMBER", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BIKER",
        "en": "BIKER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BIKER", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CORTA VENTO",
        "en": "WINDBREAKER",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "CORTAVIENTOS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PARKA",
        "en": "PARKA",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PARKA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PERFECTO",
        "en": "PERFECTO",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PERFECTO", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PUFFER",
        "en": "PUFFER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PUFFER", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "TRUCKER",
        "en": "TRUCKER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRUCKER", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SPENCER",
        "en": "SPENCER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SPENCER", "classe": "peca", "genero": "f", "numero": "s" }
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
        "tipo": "termo",
        "es": { "texto": "BUFANDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "LENÇO",
        "en": "SCARF",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PAÑUELO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TOUCA",
        "en": "BEANIE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GORRO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ABOTOADURA",
        "en": "CUFFLINK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GEMELOS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ACESSÓRIOS",
        "en": "ACCESSORIES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ACCESORIOS", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "ALMOFADA",
        "en": "PILLOW",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COJÍN", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ANEL",
        "en": "RING",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ANILLO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOINA",
        "en": "BERET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOINA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "BONÉ",
        "en": "CAP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GORRA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CANECA",
        "en": "MUG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TAZA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "CHAPÉU",
        "en": "HAT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SOMBRERO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CHINELO",
        "en": "FLIP-FLOPS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CHANCLAS", "classe": "peca", "genero": "f", "numero": "p" }
      },
      {
        "pt": "CHOKER",
        "en": "CHOKER",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CHOKER", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COLAR",
        "en": "NECKLACE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COLLAR", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GORRO",
        "en": "BEANIE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GORRO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "GRAVATA",
        "en": "NECKTIE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORBATA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "GUARDA-CHUVA",
        "en": "UMBRELLA",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "PARAGUAS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "LATA",
        "en": "CAN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LATA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "LUVA",
        "en": "GLOVES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GUANTES", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "MEIA",
        "en": "SOCKS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CALCETINES", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "MOCHILA",
        "en": "BACKPACK",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "MOCHILA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "NECESSAIRE",
        "en": "TOILETRY BAG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "NECESER", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "PANTUFA",
        "en": "SLIPPERS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PANTUFLAS", "classe": "peca", "genero": "f", "numero": "p" }
      },
      {
        "pt": "SUSPENSÓRIO",
        "en": "SUSPENDERS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TIRANTES", "classe": "peca", "genero": "m", "numero": "p" }
      },
      {
        "pt": "TOALHA",
        "en": "TOWEL",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TOALLA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "VISEIRA",
        "en": "VISOR",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "VISERA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "ÓCULOS",
        "en": "GLASSES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "GAFAS", "classe": "peca", "genero": "f", "numero": "p" }
      },
      {
        "pt": "ÓCULOS DE SOL",
        "en": "SUNGLASSES",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "GAFAS DE SOL", "classe": "peca", "genero": "f", "numero": "p" }
      },
      {
        "pt": "BOLSA",
        "en": "BAG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOLSO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BOLSAS",
        "en": "BAGS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BOLSOS", "classe": "peca", "genero": "m", "numero": "p" }
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
        "tipo": "termo",
        "es": { "texto": "BIKINI", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "BIQUÍNI",
        "en": "BIKINI",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "BIKINI", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "MAIÔ",
        "en": "ONE-PIECE SWIMSUIT",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRAJE DE BAÑO ENTERO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SAÍDA DE PRAIA",
        "en": "BEACH COVER-UP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SALIDA DE PLAYA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PIJAMA",
        "en": "PAJAMAS",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PIJAMA", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "VESTIDO SLEEP DRESS",
        "en": "SLEEP DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SLEEP DRESS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "ANÁGUA",
        "en": "SLIP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "ENAGUA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "SLEEP",
        "en": "SLEEP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SLEEP", "classe": "invariavel" }
      },
      {
        "pt": "SLEEP DRESS",
        "en": "SLEEP DRESS",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "SLEEP DRESS", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "SLIP",
        "en": "SLIP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "SLIP", "classe": "invariavel" }
      },
      {
        "pt": "BABY DOLL",
        "en": "BABYDOLL",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "BABY DOLL", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CALCINHA",
        "en": "PANTIES",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PANTY", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CAMISOLA",
        "en": "NIGHTGOWN",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CAMISÓN", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORSELET",
        "en": "CORSELET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORSELET", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORSELETE",
        "en": "CORSELET",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "CORSELETE", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORTININHA",
        "en": "TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TOP TRIANGULAR", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORTININHA COM BOJO",
        "en": "PADDED TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TOP TRIANGULAR CON RELLENO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "CORTININHA FRUFRU",
        "en": "RUFFLE TRIANGLE TOP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TOP TRIANGULAR VOLANTES", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "FIO DENTAL",
        "en": "THONG",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "TANGA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "LINGERIE",
        "en": "LINGERIE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "LINGERIE", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MEIA TAÇA",
        "en": "HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEDIA COPA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MEIA TAÇA TORCIDA",
        "en": "TWISTED HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEDIA COPA TORCIDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "MEIA TAÇA TORCIDO",
        "en": "TWISTED HALF CUP",
        "status": "FECHADO",
        "tipo": "expressao",
        "es": { "texto": "MEDIA COPA TORCIDA", "classe": "peca", "genero": "f", "numero": "s" }
      },
      {
        "pt": "PAREÔ",
        "en": "SARONG",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "PAREO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "TRIÂNGULO",
        "en": "TRIANGLE",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "TRIÁNGULO", "classe": "peca", "genero": "m", "numero": "s" }
      },
      {
        "pt": "COPO",
        "en": "CUP",
        "status": "FECHADO",
        "tipo": "termo",
        "es": { "texto": "COPA", "classe": "peca", "genero": "f", "numero": "s" }
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
  // Visões derivadas dos índices, mantidas para compatibilidade.
  EN: termosGlossario
    .filter(termo => termo.status === 'FECHADO' && termo.tipo === 'expressao')
    .map(termo => ({ pt: termo.pt, target: termo.en, indice: termo.indice, contexto: termo.contexto })),
  ES: termosGlossario
    .filter(termo => termo.status === 'FECHADO' && termo.tipo === 'expressao' && termo.es)
    .map(termo => ({ pt: termo.pt, target: termo.es.texto, indice: termo.indice, contexto: termo.contexto }))
};

// Termo de uma palavra → tradução; termosGlossario segue a ordem dos índices, então o
// primeiro termo é o prioritário. Termos com contexto (JEANS, MOLETOM) ficam de fora.
function montarDicionario(traducaoDe) {
  const dicionario = {};
  for (const termo of termosGlossario) {
    if (termo.status !== 'FECHADO' || termo.tipo !== 'termo' || termo.contexto) continue;
    const traducao = traducaoDe(termo);
    if (traducao && !Object.prototype.hasOwnProperty.call(dicionario, termo.pt)) dicionario[termo.pt] = traducao;
  }
  return dicionario;
}

const dicionarioTermos = {
  EN: montarDicionario(termo => termo.en),
  ES: montarDicionario(termo => termo.es && termo.es.texto)
};

module.exports = { indices, termosPendentes, termosGlossario, expressoesCompostas, dicionarioTermos };
