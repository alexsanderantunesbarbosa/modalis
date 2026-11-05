// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  montarTraducao, montarTraducaoES, montarContextoGlossario, montarLotesParaTraducao, processarTraducaoLocal, LIMITE_SAP
} = require('../processadorTexto');
const { termosGlossario, dicionarioTermos, expressoesCompostas } = require('../tabelaMestra');

/* ==================== Dados: o ES de cada termo da tabela ==================== */

test('todo termo FECHADO tem ES; flexível traz as 4 formas; peça e substantivo têm gênero e número', () => {
  const classes = new Set(['peca', 'substantivo', 'flexivel', 'invariavel', 'nome_proprio']);
  const problemas = [];
  for (const termo of termosGlossario.filter(t => t.status === 'FECHADO')) {
    const es = termo.es;
    const nome = `${termo.indice} ${termo.pt}${termo.contexto ? ` (${termo.contexto})` : ''}`;
    if (!es || typeof es.texto !== 'string' || !es.texto.trim()) { problemas.push(`${nome}: sem ES`); continue; }
    if (es.texto !== es.texto.toUpperCase().trim()) problemas.push(`${nome}: ES fora de CAIXA ALTA ou com espaço`);
    if (!classes.has(es.classe)) problemas.push(`${nome}: classe ${es.classe}`);
    if (es.genero !== undefined && !['m', 'f'].includes(es.genero)) problemas.push(`${nome}: gênero ${es.genero}`);
    if (es.numero !== undefined && !['s', 'p'].includes(es.numero)) problemas.push(`${nome}: número ${es.numero}`);
    if ((es.classe === 'peca' || es.classe === 'substantivo') && !(es.genero && es.numero)) problemas.push(`${nome}: sem gênero/número`);
    if (es.classe === 'flexivel' && !['ms', 'fs', 'mp', 'fp'].every(forma => es.formas && es.formas[forma])) problemas.push(`${nome}: formas incompletas`);
    if (es.classe !== 'flexivel' && es.formas) problemas.push(`${nome}: formas em termo que não é flexível`);
  }
  assert.deepEqual(problemas, []);
});

test('as visões derivadas em espanhol saem do campo es (não mais de uma lista à parte)', () => {
  assert.equal(dicionarioTermos.ES.CALÇA, 'PANTALÓN');
  assert.equal(dicionarioTermos.ES.JUSTO, 'AJUSTADO');
  assert.ok(expressoesCompostas.ES.some(item => item.pt === 'MANGA LONGA' && item.target === 'MANGA LARGA'));
  assert.equal(processarTraducaoLocal('manga longa', 'ES'), 'MANGA LARGA');
});

/* ==================== Conjunto de referência ES (29/10/2026) ==================== */

// Casos reais da IN27 e da AI27, montados pelas regras do dono (docs/decisoes-espanhol-2026-10-29.md)
// e em revisão por ele na planilha. Estado padrão: 'tabela' (ou 'acima-de-40' se passar de 40).
// SLEEP (e SLIP fora de um vestido) fica marcado até o dono decidir; `termoNovo` = depende de uma entrada que está na
// planilha para aprovação e ainda não entrou na tabela (o teste roda como TODO).
const REFERENCIA = [
  ['BERMUDA JEANS COMFORT CINTURA MÉDIA', 'BERMUDA DENIM COMFORT TIRO MEDIO'],
  ['VESTIDO CURTO MANGA LONGA COM BRILHOS', 'VESTIDO CORTO MANGA LARGA CON BRILLOS'],
  ['MOLETOM MANGA LONGA COM CAPUZ', 'SUDADERA MANGA LARGA CON CAPUCHA'],
  ['LEGGING FUSÔ CINTURA ALTA SEAMLESS', 'LEGGING FUSEAU TIRO ALTO SEAMLESS'],
  ['CASACO MÉDIO DE PELO COM METAL', 'ABRIGO MEDIO DE PELO SINTÉTICO CON METAL'],
  ['CALÇA PIJAMA LISTRADA', 'PANTALÓN PIJAMA RAYADO'],
  ['SAIA JEANS MINI CINTURA BAIXA COM BRILHO', 'FALDA DENIM MINI TIRO BAJO CON BRILLO'],
  ['JAQUETA PUFFER MÉDIA GOLA ALTA', 'CHAQUETA PUFFER MEDIA CUELLO ALTO'],
  ['BLUSA ACETINADA DE VISCOSE COM FRANJA', 'BLUSA SATINADA DE VISCOSA CON FLECOS'],
  ['BLUSA ACETINADA FRENTE ÚNICA', 'BLUSA SATINADA HALTER'],
  ['BLUSA ACINTURADA MANGA CURTA COM CINTO', 'BLUSA ENTALLADA MANGA CORTA CON CINTURÓN'],
  ['BLUSA AJUSTADA COM BOTÕES', 'BLUSA AJUSTADA CON BOTONES'],
  ['BERMUDA ALFAIATARIA ALONGADA', 'BERMUDA SASTRE ALARGADA'],
  ['BERMUDA ALONGADA CINTURA MÉDIA', 'BERMUDA ALARGADA TIRO MEDIO'],
  ['BERMUDA ALONGADA CINTURA MÉDIA COM LINHO', 'BERMUDA ALARGADA TIRO MEDIO CON LINO'],
  ['BERMUDA ALONGADA COM PREGAS', 'BERMUDA ALARGADA CON PLIEGUES'],
  ['SAIA CURTA COM ALFAIATARIA COM PU', 'FALDA CORTA SASTRE CON PU'],
  ['TRENCH COAT SLIM COM GOLA DE PU COM FAIXA', 'TRENCH COAT SLIM CON CUELLO DE PU CON FAJÍN'],
  ['BLUSA ASSIMÉTRICA COM PU E METAL', 'BLUSA ASIMÉTRICA CON PU Y METAL'],
  ['BLUSA COM MANGA ALONGADA E AMARRAÇÃO', 'BLUSA CON MANGA ALARGADA Y LAZADA'],
  ['BLUSA DE ALÇA COM DRAPEADO E RENDA', 'BLUSA DE TIRANTES CON DRAPEADO Y ENCAJE'],
  ['BLUSA DE CREPE COM BABADO E RENDA', 'BLUSA DE CREPÉ CON VOLANTE Y ENCAJE'],
  ['BLUSA AJUSTADA SEM MANGA MALHA PESADA', 'BLUSA AJUSTADA SIN MANGAS PUNTO PESADO'],
  ['BLUSA AJUSTADA SEM MANGAS', 'BLUSA AJUSTADA SIN MANGAS'],
  ['BLUSA ALONGADA ESTAMPADA SEM MANGAS', 'BLUSA ALARGADA ESTAMPADA SIN MANGAS'],
  ['BLUSA ALONGADA GOLA ALTA SEM MANGA', 'BLUSA ALARGADA CUELLO ALTO SIN MANGAS'],
  ['BERMUDA ALFAIATARIA COM CINTO DE COURO', 'BERMUDA SASTRE CON CINTURÓN DE CUERO'],
  ['BERMUDA CINTURA ALTA DE PU', 'BERMUDA TIRO ALTO DE PU'],
  ['BERMUDA CINTURA MÉDIA DE VELUDO COTELÊ', 'BERMUDA TIRO MEDIO DE PANA'],
  ['BERMUDA CINTURA MÉDIA EM PU', 'BERMUDA TIRO MEDIO DE PU'],
  ['CALÇA JEANS BARREL MAXI CINTURA ALTA', 'JEANS BARREL MAXI TIRO ALTO'],
  ['CARDIGÃ TRICÔ MANGA LONGA COM MAXI GOLA', 'CÁRDIGAN TRICOT MANGA LARGA CON MAXI CUELLO'],
  ['JAQUETA MÉDIA COM MAXI LAPELA', 'CHAQUETA MEDIA CON MAXI SOLAPA'],
  ['SAIA ASSIMÉTRICA SUPER MIDI', 'FALDA ASIMÉTRICA SUPER MIDI'],
  ['BLAZER OVERSIZED COM ABOTOAMENTO DUPLO', 'BLAZER OVERSIZED CON DOBLE BOTONADURA', { termoNovo: 'COM ABOTOAMENTO DUPLO' }],
  ['BLAZER OVERSIZED MÉDIO COM APLICAÇÕES', 'BLAZER OVERSIZED MEDIO CON APLIQUES'],
  ['BLUSA BALONÊ MANGA ÚNICA COM TRANSPASSE', 'BLUSA GLOBO MANGA ÚNICA CON CRUCE'],
  ['BLUSA DE ALÇA COM TRANSPASSE ASSIMÉTRICA', 'BLUSA DE TIRANTES CON CRUCE ASIMÉTRICA'],
  ['BLAZER DE ALFAIATARIA COM FENDA LATERAL', 'BLAZER SASTRE CON ABERTURA LATERAL'],
  ['BLUSA AMPLA COM MANGA LONGA ESTAMPADA', 'BLUSA AMPLIA CON MANGA LARGA ESTAMPADA'],
  ['BLUSA COM DECOTE ASSIMÉTRICO', 'BLUSA CON ESCOTE ASIMÉTRICO'],
  ['BLUSA DE ALÇA COM DECOTE TRANSPASSADO', 'BLUSA DE TIRANTES CON ESCOTE CRUZADO'],
  ['BLUSA SLEEP DE ALÇA ESTAMPADA COM RENDA', 'BLUSA SLEEP DE TIRANTES ESTAMPADA CON ENCAJE', { estado: 'varias-pecas' }],
  ['CAMISA PIJAMA ACETINADA DE VISCOSE', 'CAMISA PIJAMA SATINADA DE VISCOSA'],
  ['KIT BODY CANELADO E BLUSA MANGA LONGA', 'KIT BODY CANALÉ Y BLUSA MANGA LARGA'],
  ['KIT BLUSA MANGA LONGA + BLUSA SEM MANGA', 'KIT BLUSA MANGA LARGA Y BLUSA SIN MANGAS'],
  ['MACACÃO CURTO SLEEP DE ALÇA COM RENDA', 'ENTERIZO CORTO SLEEP DE TIRANTES CON ENCAJE', { estado: 'varias-pecas' }],
  // 03/11/2026: MEIA CALÇA = PANTIMEDIAS (MEDIAS é a meia curta na Colômbia, no Peru e na Argentina)
  ['MEIA CALÇA FUSÔ DE RENDA', 'PANTIMEDIAS FUSEAU DE ENCAJE'],
  ['MOLETOM RAGLAN COM TOUCA', 'SUDADERA RAGLÁN CON CAPUCHA', { termoNovo: 'COM TOUCA' }],
  ['SAIA CURTA ANÁGUA', 'FALDA CORTA ENAGUA'],
  ['SHORT HOT PANTS ANÁGUA', 'SHORT HOT PANTS ENAGUA'],
  ['VESTIDO REGATA COM PREGAS FRONTAIS', 'VESTIDO SIN MANGAS CON PLIEGUES FRONTALES'],
  ['VESTIDO BLAZER DE CETIM COM FAIXA', 'VESTIDO BLAZER DE SATÉN CON FAJÍN'],
  ['VESTIDO POLO CURTO MANGA LONGA CANELADO', 'VESTIDO POLO CORTO MANGA LARGA CANALÉ'],
  ['VESTIDO CURTO ANÁGUA', 'VESTIDO CORTO ENAGUA'],
  ['KIT GORRO E CACHECOL DE LISTRAS', 'KIT GORRO Y BUFANDA DE RAYAS'],
  ['CALÇA LEGGING TRICÔ FUSEAU', 'LEGGING TRICOT FUSEAU', { termoNovo: 'CALÇA LEGGING' }],
  ['BLUSA REGATA DE TRICÔ', 'BLUSA SIN MANGAS DE TRICOT'],
  ['BLUSA CORSET JEANS COM RENDA', 'BLUSA CORSET DENIM CON ENCAJE'],
  // FAIXA sem outra peça = produto (FAJÍN): o texto já sai certo; o estado espera a entrada FAIXA (produto).
  ['FAIXA ACETINADA', 'FAJÍN SATINADO', { estado: 'sem-peca' }],
  // Sem a expressão GOLA CACHECOL, CACHECOL conta como peça e a linha vai para revisão.
  ['JAQUETA MÉDIA COM GOLA CACHECOL', 'CHAQUETA MEDIA CON CUELLO BUFANDA', { estado: 'varias-pecas' }],
  ['KIT REGATA E BLUSA DE MALHA', 'KIT CAMISETA SIN MANGAS Y BLUSA DE PUNTO'],
  ['KIT REGATA + BLUSA MANGA LONGA', 'KIT CAMISETA SIN MANGAS Y BLUSA MANGA LARGA'],
  ['MACACÃO BLAZER ALONGADO MANGA LONGA', 'ENTERIZO BLAZER ALARGADO MANGA LARGA'],
  ['SAIA PAREO ESTAMPADA COM CINTO', 'FALDA PAREO ESTAMPADA CON CINTURÓN'],
  ['TOP CROPPED LINGERIE COM RENDA', 'TOP CROPPED LINGERIE CON ENCAJE'],
  ['VESTIDO LONGO SLEEP COM VELUDO', 'VESTIDO LARGO SLEEP CON TERCIOPELO', { estado: 'varias-pecas' }],
  ['VESTIDO SLEEP SUPER MIDI COM RENDA', 'VESTIDO SLEEP SUPER MIDI CON ENCAJE', { estado: 'varias-pecas' }],
  // VESTIDO SLIP é uma peça só desde 04/11/2026 (decisão do dono): SLIP DRESS / VESTIDO LENCERO.
  ['VESTIDO SLIP COM RENDA ACETINADO', 'VESTIDO LENCERO CON ENCAJE SATINADO']
];

for (const [pt, esperado, { estado, termoNovo } = {}] of REFERENCIA) {
  const opcoes = termoNovo ? { todo: `depende da entrada ${termoNovo}, em validação na planilha` } : {};
  test(`monta "${pt}" em espanhol como "${esperado}"`, opcoes, () => {
    const resultado = montarTraducaoES(pt);
    assert.equal(resultado.traducao, esperado);
    assert.equal(resultado.estado, estado || (esperado.length > LIMITE_SAP ? 'acima-de-40' : 'tabela'));
  });
}

/* ==================== Regras da frase, uma a uma ==================== */

function montar(pt) {
  return montarTraducaoES(pt).traducao;
}

test('o idioma escolhe o montador: ES segue o PT, EN segue a estrutura do inglês', () => {
  assert.deepEqual(montarTraducao('CALÇA PIJAMA LISTRADA', 'ES'), montarTraducaoES('CALÇA PIJAMA LISTRADA'));
  assert.equal(montarTraducao('CALÇA PIJAMA LISTRADA', 'EN').traducao, 'STRIPED PAJAMA PANTS');
  assert.equal(processarTraducaoLocal('calça pijama listrada', 'ES'), 'PANTALÓN PIJAMA RAYADO');
});

test('conectivos encadeados: COM X COM Y, COM X E Y, SEM X E COM Y, COM expressão E Y', () => {
  assert.equal(montar('SAIA CURTA COM ALFAIATARIA COM PU'), 'FALDA CORTA SASTRE CON PU');
  assert.equal(montar('BLUSA DE CREPE COM BABADO E RENDA'), 'BLUSA DE CREPÉ CON VOLANTE Y ENCAJE');
  assert.equal(montar('BLUSA SEM BOLSO E COM CINTO'), 'BLUSA SIN BOLSILLO Y CON CINTURÓN');
  assert.equal(montar('JAQUETA COM CAPUZ E BOLSOS'), 'CHAQUETA CON CAPUCHA Y BOLSILLOS');
  assert.equal(montar('VESTIDO COM BORDADO E ILHÓS'), 'VESTIDO CON BORDADO Y OJALES');
});

test('E e + viram Y; Y vira E antes de palavra com som de I', () => {
  assert.equal(montar('KIT BLUSA MANGA LONGA + BLUSA SEM MANGA'), 'KIT BLUSA MANGA LARGA Y BLUSA SIN MANGAS');
  assert.equal(montar('SAIA COM BOTÕES E IMPRESSÃO'), 'FALDA CON BOTONES E IMPRESSÃO');
});

test('preposição do PT: EM vira DE antes de termo e EN antes de palavra desconhecida; artigo concorda com o ES', () => {
  assert.equal(montar('BERMUDA CINTURA MÉDIA EM PU'), 'BERMUDA TIRO MEDIO DE PU');
  assert.equal(montar('SHORT CINTURA ALTA EM V'), 'SHORT TIRO ALTO EN V');
  // BARRA = BAJO (masculino): NA BARRA vira EN EL BAJO.
  assert.equal(montar('CALÇA ALADIM COM BOTÃO NA BARRA'), 'PANTALÓN ALADINO CON BOTÓN EN EL BAJO');
  assert.equal(montar('TRENCH COAT COM PREGA NAS MANGAS'), 'TRENCH COAT CON PLIEGUE EN LAS MANGAS');
});

test('a expressão traz a própria preposição: a do PT não se repete (R9)', () => {
  assert.equal(montar('COLETE SLIM DE ESPINHA DE PEIXE'), 'CHALECO SLIM DE ESPIGA');
  assert.equal(montar('BLUSA COM OMBRO ÚNICO'), 'BLUSA DE UN SOLO HOMBRO');
});

test('COM ou DE antes de termo cujo ES é adjetivo cai (R6); COM antes de particípio fica (COM DRAPEADO)', () => {
  assert.equal(montar('BLAZER DE ALFAIATARIA'), 'BLAZER SASTRE');
  assert.equal(montar('COLETE CURTO DECOTE V EM ALFAIATARIA'), 'CHALECO CORTO ESCOTE V SASTRE');
  assert.equal(montar('BLUSA DE ALÇA COM DRAPEADO E RENDA'), 'BLUSA DE TIRANTES CON DRAPEADO Y ENCAJE');
});

test('concordância: o adjetivo segue o substantivo com que concorda no PT, no gênero do ES', () => {
  // Detalhe: GOLA (f) = CUELLO (m), PALA (f) = CANESÚ (m), CÓS (m) = PRETINA (f).
  assert.equal(montar('BLUSA COM GOLA BORDADA'), 'BLUSA CON CUELLO BORDADO');
  assert.equal(montar('BODY MANGA LONGA COM PALA BORDADA'), 'BODY MANGA LARGA CON CANESÚ BORDADO');
  assert.equal(montar('CALÇA RETA COM CÓS ASSIMÉTRICO'), 'PANTALÓN RECTO CON PRETINA ASIMÉTRICA');
  // Peça: MOLETOM (m) = SUDADERA (f); CALÇA JEANS = JEANS (plural).
  assert.equal(montar('MOLETOM OVERSIZED ESTAMPADO'), 'SUDADERA OVERSIZED ESTAMPADA');
  assert.equal(montar('CALÇA JEANS RETA COM METAL CINTURA ALTA'), 'JEANS RECTOS CON METAL TIRO ALTO');
  // O adjetivo que não bate com o detalhe volta para a peça (ASSIMÉTRICA é da BLUSA, não do TRANSPASSE).
  assert.equal(montar('BLUSA DE ALÇA COM TRANSPASSE ASSIMÉTRICA'), 'BLUSA DE TIRANTES CON CRUCE ASIMÉTRICA');
  // O modelo de jaqueta cede o gênero à peça; a segunda peça também concorda se o PT manda.
  assert.equal(montar('CASACO PUFFER ESTAMPADO'), 'ABRIGO PUFFER ESTAMPADO');
  assert.equal(montar('SAIA PAREO ESTAMPADA COM CINTO'), 'FALDA PAREO ESTAMPADA CON CINTURÓN');
  // Adjetivo que não muda no gênero (FRONTAIS) concorda em número com o detalhe.
  assert.equal(montar('VESTIDO REGATA COM PREGAS FRONTAIS'), 'VESTIDO SIN MANGAS CON PLIEGUES FRONTALES');
  // Erro de concordância no PT (ETIQUETA BORDADO) cai na peça e sai certo no ES.
  assert.equal(montar('REGATA CANELADA COM ETIQUETA BORDADO'), 'CAMISETA SIN MANGAS CANALÉ CON ETIQUETA BORDADA');
});

// Achados da revisão adversarial de 29/10/2026 (todos com casos do corpus).
test('revisão: SEM não abre detalhe para a concordância (SEM MANGA ASSIMÉTRICA é a blusa)', () => {
  assert.equal(montar('BLUSA SEM MANGA ASSIMÉTRICA'), 'BLUSA SIN MANGAS ASIMÉTRICA');
  assert.equal(montar('BLUSA SEM MANGA ALONGADA DE MALHA'), 'BLUSA SIN MANGAS ALARGADA DE PUNTO');
  assert.equal(montar('VESTIDO CURTO SEM MANGA BICOLOR'), 'VESTIDO CORTO SIN MANGAS BICOLOR');
});

test('revisão: o adjetivo que concorda com o tecido no PT concorda com o tecido no ES', () => {
  assert.equal(montar('BLUSA JUSTA DE TULE ESTAMPADO'), 'BLUSA AJUSTADA DE TUL ESTAMPADO');
  assert.equal(montar('SAIA CURTA DE TULE ESTAMPADO'), 'FALDA CORTA DE TUL ESTAMPADO');
  // SHORT é masculino: ESTAMPADA só pode ser da SARJA (SARGA, feminina).
  assert.equal(montar('SHORT SARJA MINI CINTURA MÉDIA ESTAMPADA'), 'SHORT SARGA MINI TIRO MEDIO ESTAMPADA');
  // Com a peça também no feminino, a peça vence (SAIA DE MALHA ESTAMPADA = a saia estampada).
  assert.equal(montar('SAIA DE MALHA ESTAMPADA'), 'FALDA DE PUNTO ESTAMPADA');
  // Logo depois de palavra fora da tabela, fica a forma do PT (o adjetivo é dela).
  assert.equal(montar('BLUSA SEGUNDA PELE DE TUELE ESTAMPADO'), 'BLUSA SEGUNDA PELE DE TUELE ESTAMPADO');
});

test('revisão: NO e NOS sem acento são contração, não o termo NÓ (vale também para o EN)', () => {
  assert.equal(montar('VESTIDO COM BORDADO NO DECOTE'), 'VESTIDO CON BORDADO EN EL ESCOTE');
  assert.equal(montar('CALÇA COM ELÁSTICO NO CÓS'), 'PANTALÓN CON ELÁSTICO EN LA PRETINA');
  assert.equal(montar('BLUSA COM NÓ'), 'BLUSA CON NUDO');
  assert.equal(montarTraducao('BLUSA ASSIMÉTRICA COM FAIXA NO PESCOÇO', 'EN').traducao, 'ASYMMETRIC BLOUSE WITH SASH PESCOÇO');
  assert.equal(montarTraducao('BLUSA COM NÓ', 'EN').traducao, 'BLOUSE WITH KNOT');
});

test('revisão: descrição cortada pelo SAP não deixa conectivo solto no fim', () => {
  assert.equal(montar('SHORT DESCOLADO COM DETALHE DE ZIPER E'), 'SHORT SUELTO CON DETALLE DE CREMALLERA');
  assert.equal(montar('VESTIDO LONGO DE JERSEY SEM MANGA COM'), 'VESTIDO LARGO DE JERSEY SIN MANGAS');
});

test('revisão: segunda peça colada, gênero do PT, MESCLA e SIN', () => {
  // POLO depois de outra peça é modelo: o adjetivo é da camisa.
  assert.equal(montar('CAMISA POLO LISTRADA'), 'CAMISA POLO RAYADA');
  // MESCLA não muda no gênero no PT: concorda com a peça.
  assert.equal(montar('VESTIDO MANGA LONGA MESCLA'), 'VESTIDO MANGA LARGA JASPEADO');
  // A negação nunca cai, mesmo antes de expressão que traz a própria preposição.
  assert.match(montar('BLUSA SEM ESPINHA DE PEIXE'), /SIN/);
});

test('sem fusões do EN: JEANS, MOLETOM e CAPUZ ficam termo a termo', () => {
  assert.equal(montar('BERMUDA JEANS'), 'BERMUDA DENIM');
  assert.equal(montar('SAIA JEANS'), 'FALDA DENIM');
  assert.equal(montar('CALÇA JEANS BOOTCUT'), 'JEANS BOOTCUT');
  assert.equal(montar('CALÇA RETA CINTURA MÉDIA DE MOLETOM'), 'PANTALÓN RECTO TIRO MEDIO DE FELPA');
  assert.equal(montar('MOLETOM MANGA LONGA COM CAPUZ'), 'SUDADERA MANGA LARGA CON CAPUCHA');
});

test('peças: segunda peça decidida segue o PT; outra peça ou peças ligadas por conectivo pedem revisão', () => {
  assert.equal(montarTraducaoES('VESTIDO BLAZER DE CETIM COM FAIXA').estado, 'tabela');
  assert.equal(montarTraducaoES('SAIA CURTA ANÁGUA').estado, 'tabela');
  assert.equal(montarTraducaoES('BLUSA E SAIA').estado, 'varias-pecas');
  // REGATA: depois de outra peça é a manga dela; num KIT é a própria peça.
  assert.equal(montar('BLUSA REGATA DE TRICÔ'), 'BLUSA SIN MANGAS DE TRICOT');
  assert.equal(montar('KIT REGATA E BLUSA DE MALHA'), 'KIT CAMISETA SIN MANGAS Y BLUSA DE PUNTO');
});

test('palavra fora da tabela fica no lugar, em português, e marca "desconhecida"; vazio é "sem-peca"', () => {
  const resultado = montarTraducaoES('CAMISA AZUL PETRÓLEO');
  assert.equal(resultado.estado, 'desconhecida');
  assert.equal(resultado.traducao, 'CAMISA AZUL PETRÓLEO');
  assert.deepEqual(resultado.desconhecidas, ['AZUL', 'PETRÓLEO']);
  assert.equal(montarTraducaoES('').estado, 'sem-peca');
  assert.equal(montar('  calça   pijama listrada '), 'PANTALÓN PIJAMA RAYADO');
});

test('acima de 40 caracteres é marcado, nunca cortado', () => {
  const resultado = montarTraducaoES('TRENCH COAT SLIM COM GOLA DE PU COM FAIXA');
  assert.equal(resultado.estado, 'acima-de-40');
  assert.equal(resultado.traducao, 'TRENCH COAT SLIM CON CUELLO DE PU CON FAJÍN');
});

test('o resultado lista o ES usado em cada termo, já com a concordância', () => {
  assert.deepEqual(montarTraducaoES('CALÇA PIJAMA LISTRADA').termos.map(t => [t.pt, t.es]), [['CALÇA PIJAMA', 'PANTALÓN PIJAMA'], ['LISTRADA', 'RAYADO']]);
});

/* ==================== Decisões do dono de 30/10/2026 ==================== */

test('30/10: APLICAÇÃO = APLIQUE (masculino), e o adjetivo do detalhe concorda no masculino', () => {
  assert.equal(montarTraducaoES('BLUSA COM APLICAÇÃO BORDADA').traducao, 'BLUSA CON APLIQUE BORDADO');
  assert.equal(montarTraducaoES('SAIA MIDI COM APLICAÇÃO DE RENDA').traducao, 'FALDA MIDI CON APLIQUE DE ENCAJE');
  assert.equal(montarTraducaoES('TOP DE ALÇA COM RENDA E APLICAÇÃO').traducao, 'TOP DE TIRANTES CON ENCAJE Y APLIQUE');
  assert.equal(montarTraducaoES('T-SHIRT REGULAR COM APLICAÇÕES DE BRILHO').traducao, 'T-SHIRT REGULAR CON APLIQUES DE BRILLO');
  const semAplicacion = termosGlossario.filter(t => /APLICACI/.test(t.es.texto)).map(t => t.pt);
  assert.deepEqual(semAplicacion, []);
});

test('30/10: CIGARETE = CIGARETTE no ES, como no EN', () => {
  assert.equal(montarTraducaoES('CALÇA CIGARETE CINTURA ALTA').traducao, 'PANTALÓN CIGARETTE TIRO ALTO');
});

test('30/10: COM FLORES e COM CORTE A LASER são expressões; o EN fica como estava até o dono validar', () => {
  assert.equal(montarTraducaoES('BLUSA COM FLORES').traducao, 'BLUSA CON FLORES');
  assert.equal(montarTraducaoES('SAIA COM FLORES E BRILHO').traducao, 'FALDA CON FLORES Y BRILLO');
  assert.equal(montarTraducaoES('VESTIDO COM CORTE A LASER').traducao, 'VESTIDO CON CORTE LÁSER');
  // Solto, CORTE A LASER continua adjetivo e concorda.
  assert.equal(montarTraducaoES('VESTIDO CORTE A LASER').traducao, 'VESTIDO CORTADO A LÁSER');
  assert.equal(montarTraducao('BLUSA COM FLORES', 'EN').traducao, 'BLOUSE WITH FLORAL');
  assert.equal(montarTraducao('VESTIDO COM CORTE A LASER', 'EN').traducao, 'DRESS WITH LASER-CUT');
});

test('30/10: MAIÔ = TRAJE DE BAÑO ENTERO (TRAJE DE BAÑO sozinho também é biquíni na América Latina)', () => {
  assert.equal(montarTraducaoES('MAIÔ FRENTE ÚNICA COM BOJO').traducao, 'TRAJE DE BAÑO ENTERO HALTER CON RELLENO');
  assert.equal(montarTraducaoES('MAIÔ ESTAMPADO').traducao, 'TRAJE DE BAÑO ENTERO ESTAMPADO');
});

test('30/10: LOOSE LOW SLIM é nome de modelo (não se traduz) e o LOW dele não vira TIRO BAJO', () => {
  // Caso real: 501CF009776 (AI27). Antes saía "JEANS LOOSE TIRO BAJO SLIM TIRO BAJO".
  assert.equal(montarTraducao('CALÇA JEANS LOOSE LOW SLIM CINTURA BAIXA', 'EN').traducao, 'LOW-RISE LOOSE LOW SLIM JEANS');
  assert.equal(montarTraducaoES('CALÇA JEANS LOOSE LOW SLIM CINTURA BAIXA').traducao, 'JEANS LOOSE LOW SLIM TIRO BAJO');
  assert.equal(montarTraducaoES('CALÇA LOOSE CINTURA BAIXA').traducao, 'PANTALÓN LOOSE TIRO BAJO');
});

test('30/10: COM BOJO = PADDED / CON RELLENO; CORTININHA COM BOJO continua a peça', () => {
  assert.equal(montarTraducaoES('TOP COM BOJO E ALÇAS').traducao, 'TOP CON RELLENO Y TIRANTES');
  assert.equal(montarTraducao('TOP COM BOJO E ALÇAS', 'EN').traducao, 'PADDED TOP WITH STRAPS');
  assert.equal(montarTraducao('CORTININHA COM BOJO', 'EN').traducao, 'PADDED TRIANGLE TOP');
  assert.equal(montarTraducaoES('CORTININHA COM BOJO').traducao, 'TOP TRIANGULAR CON RELLENO');
});

/* ==================== Decisões do dono de 31/10/2026 ==================== */

test('31/10: A FIO é borda crua, sem bainha (RAW-EDGE / SIN REMATAR), não DISTRESSED; a família vem em expressões', () => {
  // Descrições antigas mostradas pelo dono: REGATA CORTE A FIO, SAIA COM RECORTES A FIO, BARRA A FIO.
  const casos = [
    ['REGATA CORTE A FIO COM BORDADO', 'RAW-EDGE TANK TOP WITH EMBROIDERY', 'CAMISETA SIN MANGAS SIN REMATAR CON BORDADO'],
    // COM CORTE A FIO é adjetivo, como COM BOJO = PADDED (sem a expressão saía "TANK TOP WITH RAW-EDGE")
    ['REGATA COM CORTE A FIO', 'RAW-EDGE TANK TOP', 'CAMISETA SIN MANGAS SIN REMATAR'],
    ['REGATA ESTAMPADA COM CORTES A FIO', 'PRINTED TANK TOP WITH RAW-EDGE CUTS', 'CAMISETA SIN MANGAS ESTAMPADA CON CORTES SIN REMATAR'],
    ['SAIA COM RECORTES E BARRA A FIO', 'SKIRT WITH CUTOUTS AND RAW HEM', 'FALDA CON RECORTES Y BAJO SIN REMATAR'],
    ['T-SHIRT COM RECORTE A FIO', 'T-SHIRT WITH RAW-EDGE CUTOUT', 'T-SHIRT CON RECORTE SIN REMATAR'],
    ['SHORTS COM ACABAMENTO A FIO E ESTAMPA', 'SHORTS WITH RAW-EDGE FINISH AND PRINT', 'SHORTS CON ACABADO SIN REMATAR Y ESTAMPADO'],
    ['CALÇA JEANS BARRA A FIO', 'RAW HEM JEANS', 'JEANS BAJO SIN REMATAR'],
    ['SHORT JEANS A FIO', 'RAW-EDGE JORTS', 'SHORT DENIM SIN REMATAR'],
    // SIN REMATAR não concorda (antes: FALDA DESGASTADA)
    ['SAIA A FIO', 'RAW-EDGE SKIRT', 'FALDA SIN REMATAR'],
  ];
  for (const [pt, en, es] of casos) {
    assert.equal(montarTraducao(pt, 'EN').traducao, en, pt);
    assert.equal(montarTraducaoES(pt).traducao, es, pt);
  }
});

/* ==================== Decisões do dono de 03/11/2026 ==================== */

// [PT, EN, ES]: cada caso confere os dois idiomas.
function conferir(casos) {
  for (const [pt, en, es] of casos) {
    assert.equal(montarTraducao(pt, 'EN').traducao, en, pt);
    assert.equal(montarTraducaoES(pt).traducao, es, pt);
  }
}

test('03/11: peças compostas (VESTIDO REGATA, VESTIDO POLO, CAMISA PIJAMA, SAIA PAREÔ) deixam de ser "várias peças"', () => {
  conferir([
    ['VESTIDO REGATA COM PREGAS FRONTAIS', 'TANK DRESS WITH FRONT PLEATS', 'VESTIDO SIN MANGAS CON PLIEGUES FRONTALES'],
    ['VESTIDO POLO CURTO MANGA LONGA CANELADO', 'LONG SLEEVE RIBBED SHORT POLO DRESS', 'VESTIDO POLO CORTO MANGA LARGA CANALÉ'],
    ['CAMISA PIJAMA ACETINADA DE VISCOSE', 'SATIN VISCOSE PAJAMA SHIRT', 'CAMISA PIJAMA SATINADA DE VISCOSA'],
    ['SAIA PAREO ESTAMPADA COM CINTO', 'PRINTED PAREO SKIRT WITH BELT', 'FALDA PAREO ESTAMPADA CON CINTURÓN'],
    ['SAIA-PAREÔ', 'PAREO SKIRT', 'FALDA PAREO'],
  ]);
  for (const pt of ['VESTIDO REGATA COM PREGAS FRONTAIS', 'VESTIDO POLO CURTO MANGA LONGA CANELADO', 'CAMISA PIJAMA ACETINADA DE VISCOSE', 'SAIA PAREO ESTAMPADA COM CINTO']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'tabela', pt);
  }
  // REGATA sozinha e como manga de outra peça continua como antes.
  assert.equal(montarTraducao('REGATA DECOTE U', 'EN').traducao, 'U-NECK TANK TOP');
  assert.equal(montar('BLUSA REGATA DE TRICÔ'), 'BLUSA SIN MANGAS DE TRICOT');
});

test('03/11: meias: MEIA CALÇA = TIGHTS / PANTIMEDIAS, MEIA FINA = SHEER TIGHTS; MEIA sozinha continua SOCKS / CALCETINES', () => {
  conferir([
    ['MEIA CALÇA', 'TIGHTS', 'PANTIMEDIAS'],
    ['MEIA-CALÇA', 'TIGHTS', 'PANTIMEDIAS'],
    ['MEIA CALCA', 'TIGHTS', 'PANTIMEDIAS'],
    ['MEIA FINA', 'SHEER TIGHTS', 'PANTIMEDIAS FINAS'],
    ['MEIA-FINA', 'SHEER TIGHTS', 'PANTIMEDIAS FINAS'],
    ['MEIA CALÇA FUSÔ DE RENDA', 'LACE STIRRUP TIGHTS', 'PANTIMEDIAS FUSEAU DE ENCAJE'],
    ['MEIA', 'SOCKS', 'CALCETINES'],
  ]);
  // MEIA MANGA e MEIA TAÇA não são meia: a expressão mais longa vence a peça MEIA.
  assert.equal(montarTraducao('BLUSA MEIA MANGA', 'EN').traducao, 'HALF SLEEVE BLOUSE');
  const meiaTaca = montarTraducao('MEIA TAÇA', 'EN');
  assert.equal(meiaTaca.traducao, 'HALF CUP');
  assert.deepEqual(meiaTaca.termos.map(t => t.pt), ['MEIA TAÇA']);
  assert.equal(montarTraducao('MEIA TAÇA', 'ES').traducao, 'MEDIA COPA');
  assert.equal(montarTraducao('MEIA CALÇA FUSÔ DE RENDA', 'EN').estado, 'tabela');
});

test('03/11: COM DRAPEADO = WITH DRAPING; COM FRANZIDO(S) = GATHERED antes da peça; o E encadeado mantém o papel', () => {
  conferir([
    ['BLUSA MANGA CURTA COM DRAPEADO', 'SHORT SLEEVE BLOUSE WITH DRAPING', 'BLUSA MANGA CORTA CON DRAPEADO'],
    ['BLUSA DE ALÇA COM DRAPEADO E RENDA', 'STRAPPY BLOUSE WITH DRAPING AND LACE', 'BLUSA DE TIRANTES CON DRAPEADO Y ENCAJE'],
    ['BLUSA MANGA CURTA COM FRANZIDO', 'SHORT SLEEVE GATHERED BLOUSE', 'BLUSA MANGA CORTA CON FRUNCIDO'],
    ['VESTIDO COM FRANZIDOS E BOTÕES', 'GATHERED DRESS WITH BUTTONS', 'VESTIDO CON FRUNCIDOS Y BOTONES'],
    // solto, o particípio continua adjetivo e concorda
    ['SAIA FRANZIDA', 'GATHERED SKIRT', 'FALDA FRUNCIDA'],
  ]);
});

test('03/11: estampa: sem a expressão COM ESTAMPA, a estampa específica não se parte (WITH FLORAL PRINT, não WITH PRINT FLORAL)', () => {
  conferir([
    // COM ESTAMPA sozinho continua igual (regra do COM)
    ['T-SHIRT COM ESTAMPA', 'T-SHIRT WITH PRINT', 'T-SHIRT CON ESTAMPADO'],
    ['T-SHIRT OVERSIZED COM ESTAMPA E BRILHO', 'OVERSIZED T-SHIRT WITH PRINT AND SHIMMER', 'T-SHIRT OVERSIZED CON ESTAMPADO Y BRILLO'],
    ['VESTIDO COM ESTAMPA E BOTÕES', 'DRESS WITH PRINT AND BUTTONS', 'VESTIDO CON ESTAMPADO Y BOTONES'],
    ['BLUSA COM ESTAMPA FLORAL', 'BLOUSE WITH FLORAL PRINT', 'BLUSA CON ESTAMPADO FLORAL'],
    ['BLUSA COM ESTAMPA DE FLORES', 'BLOUSE WITH FLORAL PRINT', 'BLUSA CON ESTAMPADO FLORAL'],
    ['BLUSA COM ESTAMPA LOCAL', 'BLOUSE WITH PLACEMENT PRINT', 'BLUSA CON ESTAMPADO LOCALIZADO'],
    ['VESTIDO COM ESTAMPA FLORAL E BOTÕES', 'DRESS WITH FLORAL PRINT AND BUTTONS', 'VESTIDO CON ESTAMPADO FLORAL Y BOTONES'],
    // ESTAMPA LISTRADA: ESTAMPADO é substantivo e não concorda com a peça
    ['BLUSA SEM MANGA ESTAMPA LISTRADA', 'SLEEVELESS STRIPED PRINT BLOUSE', 'BLUSA SIN MANGAS ESTAMPADO DE RAYAS'],
    ['BLUSA COM ESTAMPA LISTRADA', 'BLOUSE WITH STRIPED PRINT', 'BLUSA CON ESTAMPADO DE RAYAS'],
    ['VESTIDO COM ESTAMPA LISTRADA E BOTÕES', 'DRESS WITH STRIPED PRINT AND BUTTONS', 'VESTIDO CON ESTAMPADO DE RAYAS Y BOTONES'],
    ['CALÇA ESTAMPA LISTRADA', 'STRIPED PRINT PANTS', 'PANTALÓN ESTAMPADO DE RAYAS'],
    // LISTRADA sozinha continua adjetivo
    ['SAIA LISTRADA', 'STRIPED SKIRT', 'FALDA RAYADA'],
  ]);
});

test('03/11: DE FLORES = FLORAL / DE FLORES; MILITAR = MILITARY; COM CINTURA X é adjetivo e o CÓS continua detalhe', () => {
  conferir([
    ['BLUSA DE FLORES', 'FLORAL BLOUSE', 'BLUSA DE FLORES'],
    // APLICAÇÃO DE FLORES deixa de sair "DE FLORAL" no ES
    ['BLUSA COM APLICAÇÃO DE FLORES', 'BLOUSE WITH FLORAL APPLIQUÉ', 'BLUSA CON APLIQUE DE FLORES'],
    ['COLETE JEANS MILITAR', 'MILITARY DENIM VEST', 'CHALECO DENIM MILITAR'],
    ['JAQUETA MILITAR', 'MILITARY JACKET', 'CHAQUETA MILITAR'],
    ['CALÇA CARROT COM CINTURA MÉDIA', 'MID-RISE CARROT PANTS', 'PANTALÓN CARROT CON TIRO MEDIO'],
    ['CALÇA COM CINTURA ALTA E BOLSOS', 'HIGH-RISE PANTS WITH POCKETS', 'PANTALÓN CON TIRO ALTO Y BOLSILLOS'],
    ['SHORT JEANS COM CINTURA BAIXA', 'LOW-RISE JORTS', 'SHORT DENIM CON TIRO BAJO'],
    ['CALÇA RETA COM CÓS DE ELÁSTICO', 'STRAIGHT PANTS WITH ELASTIC WAISTBAND', 'PANTALÓN RECTO CON PRETINA ELÁSTICA'],
  ]);
});

test('04/11: COM CINTURA X não dá gênero ao adjetivo seguinte; COM DRAPEADOS = WITH DRAPING; VESTIDO SLIP é uma peça', () => {
  conferir([
    // Antes: FALDA CON TIRO ALTO ESTAMPADO (o adjetivo concordava com TIRO, não com a peça).
    ['SAIA COM CINTURA ALTA ESTAMPADA', 'HIGH-RISE PRINTED SKIRT', 'FALDA CON TIRO ALTO ESTAMPADA'],
    ['SAIA COM CINTURA BAIXA LISTRADA', 'LOW-RISE STRIPED SKIRT', 'FALDA CON TIRO BAJO RAYADA'],
    ['CALÇA COM CINTURA MÉDIA ESTAMPADA', 'MID-RISE PRINTED PANTS', 'PANTALÓN CON TIRO MEDIO ESTAMPADO'],
    // COM CINTURA X fecha o detalhe anterior: o adjetivo é da peça, não da FIVELA nem da PALA.
    // Antes: PANTALÓN CON HEBILLA CON TIRO ALTO RAYADA.
    ['CALÇA COM FIVELA COM CINTURA ALTA LISTRADA', 'HIGH-RISE STRIPED PANTS WITH BUCKLE', 'PANTALÓN CON HEBILLA CON TIRO ALTO RAYADO'],
    ['SAIA COM PALA COM CINTURA ALTA ESTAMPADA', 'HIGH-RISE PRINTED SKIRT WITH YOKE', 'FALDA CON CANESÚ CON TIRO ALTO ESTAMPADA'],
    // Antes: BLOUSE WITH DRAPED (o plural caía no DRAPEADOS solto).
    ['BLUSA COM DRAPEADOS', 'BLOUSE WITH DRAPING', 'BLUSA CON DRAPEADOS'],
    ['VESTIDO MIDI COM DRAPEADOS E RENDA', 'MIDI DRESS WITH DRAPING AND LACE', 'VESTIDO MIDI CON DRAPEADOS Y ENCAJE'],
    // Antes: DRESS WITH SLIP AND SATIN LACE, "várias peças".
    ['VESTIDO SLIP COM RENDA ACETINADO', 'SLIP DRESS WITH SATIN LACE', 'VESTIDO LENCERO CON ENCAJE SATINADO'],
    ['VESTIDO SLIP MIDI DE CETIM', 'SATIN SLIP MIDI DRESS', 'VESTIDO LENCERO MIDI DE SATÉN'],
  ]);
  assert.equal(montarTraducao('VESTIDO SLIP COM RENDA ACETINADO', 'EN').estado, 'tabela');
  // SLIP sozinho segue a R19 (igual ao PT, decisão pendente) e continua outra peça ao lado de SAIA.
  assert.equal(montarTraducao('SAIA SLIP', 'EN').estado, 'varias-pecas');
});

/* ==================== Decisões do dono de 05/11/2026 ==================== */

test('05/11: SLIP DRESS em todas as formas (junto, separado, com hífen, com ou sem VESTIDO, com o comprimento antes ou depois) sai sem DRESS repetido', () => {
  const casos = [
    // sozinho, junto, separado e com hífen
    ['SLIPDRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['SLIP DRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['SLIP-DRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['SLIPDRESS DE CETIM', 'SATIN SLIP DRESS', 'VESTIDO LENCERO DE SATÉN'],
    ['SLIP DRESS ESTAMPADO', 'PRINTED SLIP DRESS', 'VESTIDO LENCERO ESTAMPADO'],
    // VESTIDO colado
    ['VESTIDO SLIP', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['VESTIDO SLIPDRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['VESTIDO SLIP DRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    ['VESTIDO SLIP-DRESS', 'SLIP DRESS', 'VESTIDO LENCERO'],
    // as 3 do corpus com VESTIDO colado (antes: DRESS WITH SLIP …, "várias peças")
    ['VESTIDO SLIP DRESS ESTAMPADO COM ALÇAS', 'PRINTED SLIP DRESS WITH STRAPS', 'VESTIDO LENCERO ESTAMPADO CON TIRANTES'],
    ['VESTIDO SLIPDRESS DE CETIM COM VELUDO', 'SATIN SLIP DRESS WITH VELVET', 'VESTIDO LENCERO DE SATÉN CON TERCIOPELO'],
    ['VESTIDO SLIP COM RENDA ACETINADO', 'SLIP DRESS WITH SATIN LACE', 'VESTIDO LENCERO CON ENCAJE SATINADO'],
    // comprimento depois: MINI/MIDI/MAXI colados à palavra da peça, SHORT/LONG antes dela inteira
    ['SLIP DRESS MIDI', 'SLIP MIDI DRESS', 'VESTIDO LENCERO MIDI'],
    ['VESTIDO SLIP MIDI', 'SLIP MIDI DRESS', 'VESTIDO LENCERO MIDI'],
    ['VESTIDO SLIP-DRESS MIDI', 'SLIP MIDI DRESS', 'VESTIDO LENCERO MIDI'],
    ['SLIPDRESS LONGO', 'LONG SLIP DRESS', 'VESTIDO LENCERO LARGO'],
    ['VESTIDO SLIP LONGO', 'LONG SLIP DRESS', 'VESTIDO LENCERO LARGO'],
    ['SLIP DRESS CURTO DE CETIM', 'SATIN SHORT SLIP DRESS', 'VESTIDO LENCERO CORTO DE SATÉN'],
    // VESTIDO longe: o EN junta numa peça só; o ES segue o PT sem repetir VESTIDO (antes: "várias peças")
    ['VESTIDO MIDI SLIP DRESS', 'SLIP MIDI DRESS', 'VESTIDO MIDI LENCERO'],
    ['VESTIDO MINI SLIP DRESS', 'SLIP MINI DRESS', 'VESTIDO MINI LENCERO'],
    ['VESTIDO MAXI SLIPDRESS', 'SLIP MAXI DRESS', 'VESTIDO MAXI LENCERO'],
    ['VESTIDO LONGO SLIPDRESS', 'LONG SLIP DRESS', 'VESTIDO LARGO LENCERO'],
    ['VESTIDO CURTO SLIP DRESS DE CETIM', 'SATIN SHORT SLIP DRESS', 'VESTIDO CORTO LENCERO DE SATÉN'],
    ['VESTIDO JEANS SLIP DRESS', 'DENIM SLIP DRESS', 'VESTIDO DENIM LENCERO'],
    ['VESTIDO SUPER MIDI SLIP DRESS COM CAPA', 'SLIP SUPER MIDI DRESS WITH CAPE', 'VESTIDO SUPER MIDI LENCERO CON CAPA'],
    // SLIP sozinho logo depois de um vestido é o slip dress
    ['VESTIDO MIDI SLIP', 'SLIP MIDI DRESS', 'VESTIDO MIDI LENCERO'],
    ['VESTIDO LONGO SLIP DE CETIM', 'SATIN LONG SLIP DRESS', 'VESTIDO LARGO LENCERO DE SATÉN'],
    ['VESTIDO DE CETIM SLIP', 'SATIN SLIP DRESS', 'VESTIDO DE SATÉN LENCERO'],
    // FIRENZE é tecido (05/11/2026): a 4ª descrição do corpus com SLIP deixa de ir à DeepL
    ['VESTIDO FIRENZE SLIP MIDI COM RENDA', 'FIRENZE SLIP MIDI DRESS WITH LACE', 'VESTIDO FIRENZE LENCERO MIDI CON ENCAJE'],
  ];
  conferir(casos);
  for (const [pt] of casos) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'tabela', pt);
    assert.equal(montarTraducaoES(pt).estado, 'tabela', pt);
  }
  // Os termos aplicados mostram as peças que viraram uma: VESTIDO, MIDI e SLIP DRESS.
  assert.deepEqual(montarTraducao('VESTIDO MIDI SLIP DRESS', 'EN').termos.map(t => t.pt), ['VESTIDO', 'MIDI', 'SLIP DRESS']);
  assert.deepEqual(montarTraducaoES('VESTIDO MIDI SLIP').termos.map(t => [t.pt, t.es]), [['VESTIDO', 'VESTIDO'], ['MIDI', 'MIDI'], ['SLIP', 'LENCERO']]);
});

test('05/11: SLIP fora de um vestido continua a anágua (R19), e peças ligadas por E nunca viram uma', () => {
  // Detalhe, negação, outra peça ou sem peça: o SLIP não é o modelo do vestido.
  assert.equal(montarTraducao('VESTIDO COM SLIP', 'EN').traducao, 'DRESS WITH SLIP');
  assert.equal(montarTraducao('VESTIDO COM SLIP', 'EN').estado, 'tabela');
  assert.equal(montarTraducaoES('VESTIDO COM SLIP').traducao, 'VESTIDO CON SLIP');
  assert.equal(montarTraducao('SLIP DE RENDA', 'EN').traducao, 'LACE SLIP');
  assert.equal(montarTraducao('SLIP DE MOLETOM', 'EN').traducao, 'FLEECE SLIP');
  assert.equal(montarTraducao('VESTIDO MIDI E SAIA SLIP', 'EN').estado, 'varias-pecas');
  // Logo depois de uma preposição o SLIP também não é o modelo (antes: VESTIDO DE LENCERO, "tabela").
  for (const pt of ['VESTIDO DE SLIP', 'VESTIDO NO SLIP', 'VESTIDO PARA SLIP']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'varias-pecas', pt);
    assert.doesNotMatch(montarTraducaoES(pt).traducao, /LENCERO/, pt);
  }
  // Um detalhe no meio não separa: VESTIDO COM ALÇAS SLIP é o slip dress com alças.
  assert.equal(montarTraducao('VESTIDO COM ALÇAS SLIP', 'EN').traducao, 'SLIP DRESS WITH STRAPS');
  // Ligadas por E ou +, ou com a específica negada (SEM, S/), são duas peças: vão para revisão,
  // nunca uma some sem aviso nem a negação se perde (antes: VESTIDO SEM SLIP DRESS = SLIP DRESS).
  for (const pt of ['VESTIDO E SLIP', 'VESTIDO E SLIP DRESS', 'VESTIDO MIDI E SLIP', 'VESTIDO SLIP E ANÁGUA',
    'VESTIDO E VESTIDO REGATA', 'MEIA CALÇA E MEIA FINA', 'TOP E CORTININHA',
    'VESTIDO + SLIP', 'VESTIDO MIDI + SLIP DRESS', 'TOP + CORTININHA',
    'VESTIDO SEM SLIP DRESS', 'VESTIDO S/ SLIPDRESS', 'VESTIDO MIDI SEM SLIP DRESS', 'TOP SEM CORTININHA',
    'VESTIDO SEM VESTIDO CURTO', 'VESTIDO JEANS SEM VESTIDO REGATA']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'varias-pecas', pt);
    assert.equal(montarTraducaoES(pt).estado, 'varias-pecas', pt);
  }
  assert.equal(montarTraducao('VESTIDO SEM SLIP DRESS', 'EN').traducao, 'DRESS WITHOUT SLIP DRESS');
  // O "+" separa as peças, mas não repete o papel do termo anterior como o E: a SAIA de BLUSA COM
  // BOLSO + SAIA é outra peça (não um detalhe), e o CINTO não herda o SEM de SEM MANGA.
  for (const pt of ['BLUSA COM BOLSO + SAIA', 'VESTIDO+SLIP']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'varias-pecas', pt);
    assert.equal(montarTraducaoES(pt).estado, 'varias-pecas', pt);
  }
  assert.equal(montarTraducao('VESTIDO SEM MANGA + CINTO', 'EN').traducao, 'SLEEVELESS BELT DRESS');
  assert.equal(montarTraducao('XYZ + ABC', 'EN').traducao, 'XYZ + ABC');
  // Peça negada nunca é o núcleo: sem outra peça, a linha fica "sem peça" (antes: SLIP DRESS em "tabela").
  for (const pt of ['SEM SLIP DRESS', 'MOLETOM SEM SLIP DRESS', 'PARKA SEM VESTIDO SLIP', 'SEM VESTIDO']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'sem-peca', pt);
    assert.equal(montarTraducaoES(pt).estado, 'sem-peca', pt);
  }
  assert.equal(montarTraducao('SEM SLIP DRESS', 'EN').traducao, 'WITHOUT SLIP DRESS');
  // A mesma peça dos dois lados de um DE são duas peças (antes, no ES: VESTIDO MIDI DE, "tabela").
  for (const pt of ['VESTIDO MIDI DE VESTIDO', 'SAIA CURTA DE SAIA', 'VESTIDO DE VESTIDO MIDI']) {
    assert.equal(montarTraducao(pt, 'EN').estado, 'varias-pecas', pt);
    assert.equal(montarTraducaoES(pt).estado, 'varias-pecas', pt);
  }
  // Com COM no meio, a expressão não cede: o detalhe continua inteiro (antes da trava: DENIM POLO
  // DRESS WITH DRESS, "tabela").
  assert.equal(montarTraducao('VESTIDO POLO COM VESTIDO JEANS', 'EN').traducao, 'POLO DRESS WITH DENIM DRESS');
  assert.equal(montarTraducao('CAMISA PIJAMA COM CAMISA JEANS', 'EN').traducao, 'PAJAMA SHIRT WITH DENIM SHIRT');
  // A anágua também é SLIP no EN: SLIP DRESS não a absorve (a última palavra é a peça).
  assert.equal(montarTraducao('VESTIDO SLIP E ANÁGUA', 'EN').traducao, 'SLIP DRESS WITH SLIP');
  // Peça específica com outra específica da mesma família: as duas ficam, e a linha vai para revisão.
  assert.equal(montarTraducao('VESTIDO REGATA SLIP', 'EN').estado, 'varias-pecas');
  // A expressão só cede se nada dela vira palavra desconhecida: SAIA LÁPIS fica inteira, porque
  // LÁPIS sozinho não está na tabela (sem a trava saía "PAREO SKIRT LÁPIS", desconhecida).
  for (const pt of ['SAIA LÁPIS SAIA PAREÔ', 'SAIA PAREÔ SAIA LÁPIS']) {
    const en = montarTraducao(pt, 'EN');
    assert.equal(en.estado, 'varias-pecas', pt);
    assert.match(en.traducao, /PENCIL SKIRT/, pt);
    assert.doesNotMatch(montarTraducaoES(pt).traducao, /LÁPIS/, pt);
  }
  // VESTIDOS (plural) não existe na tabela: a descrição vai à DeepL com o validador.
  assert.equal(montarTraducao('VESTIDOS SLIP DRESS', 'EN').estado, 'desconhecida');
});

test('05/11: no ES a peça específica depois da genérica não repete o núcleo (TOP CORTININHA = TOP TRIANGULAR)', () => {
  // Antes: TOP TOP TRIANGULAR, "várias peças". No EN a específica já absorvia a genérica.
  conferir([
    ['TOP CORTININHA', 'TRIANGLE TOP', 'TOP TRIANGULAR'],
    ['TOP CORTININHA ESTAMPADO', 'PRINTED TRIANGLE TOP', 'TOP TRIANGULAR ESTAMPADO'],
  ]);
  assert.equal(montarTraducaoES('TOP CORTININHA').estado, 'tabela');
  // A ordem de antes continua: CORTININHA sozinha já era a peça inteira.
  assert.equal(montarTraducaoES('CORTININHA COM BOJO').traducao, 'TOP TRIANGULAR CON RELLENO');
  // Sai todo o começo repetido, não só a 1ª palavra (antes: TOP TRIANGULAR TRIANGULAR CON RELLENO).
  assert.equal(montarTraducaoES('CORTININHA CORTININHA COM BOJO').traducao, 'TOP TRIANGULAR CON RELLENO');
  assert.equal(montarTraducaoES('MEIA TAÇA MEIA TAÇA TORCIDA').traducao, 'MEDIA COPA TORCIDA');
  // Genérica depois da específica, só com o núcleo: ela cai. Antes do lote, as duas iam para
  // "várias peças"; sem esta regra, o ES sairia BLAZER DE FELPA BLAZER DENIM como "tabela", porque
  // BLAZER é segunda peça colada no VESTIDO BLAZER…
  const blazer = montarTraducaoES('BLAZER DE MOLETOM BLAZER JEANS');
  assert.equal(blazer.traducao, 'BLAZER DE FELPA DENIM');
  assert.equal(montarTraducao('BLAZER DE MOLETOM BLAZER JEANS', 'EN').traducao, 'DENIM FLEECE BLAZER');
  // …e o contexto da DeepL não leva par sem tradução.
  assert.doesNotMatch(montarContextoGlossario(['BLAZER DE MOLETOM BLAZER JEANS XYZ'], 'ES'), /= ;|= \.$/);
  // A segunda peça colada de outra família continua valendo (R14), e a REGATA que vira manga
  // continua manga, mesmo que o EN a absorva no TRIANGLE TOP (R15).
  assert.equal(montarTraducaoES('VESTIDO BLAZER DE CETIM COM FAIXA').estado, 'tabela');
  const regata = montarTraducaoES('CORTININHA COM BOJO REGATA');
  assert.equal(regata.traducao, 'TOP TRIANGULAR CON RELLENO SIN MANGAS');
  assert.equal(regata.estado, 'tabela');
  // A peça sem o começo repetido fecha o detalhe aberto: o adjetivo é da saia, não do CANESÚ.
  assert.equal(montarTraducaoES('SAIA COM PALA SAIA CURTA ESTAMPADA').traducao, 'FALDA CON CANESÚ CORTA ESTAMPADA');
  assert.equal(montarTraducaoES('SAIA JEANS COM PALA SAIA ESTAMPADA').traducao, 'FALDA DENIM CON CANESÚ ESTAMPADA');
});

test('05/11: a fusão JEANS/MOLETOM na calça e no short não engole COM nem SEM (já existia; achado da revisão)', () => {
  // Antes: CALÇA SEM MOLETOM = SWEATPANTS e CALÇA SEM JEANS = JEANS, com a negação perdida.
  assert.equal(montarTraducao('CALÇA SEM MOLETOM', 'EN').traducao, 'PANTS WITHOUT FLEECE');
  assert.equal(montarTraducao('CALÇA SEM JEANS', 'EN').traducao, 'PANTS WITHOUT DENIM');
  assert.equal(montarTraducao('CALÇA COM MOLETOM', 'EN').traducao, 'PANTS WITH FLEECE');
  // As fusões de sempre continuam.
  assert.equal(montarTraducao('CALÇA DE MOLETOM', 'EN').traducao, 'SWEATPANTS');
  assert.equal(montarTraducao('SHORT JEANS', 'EN').traducao, 'JORTS');
  assert.equal(montarTraducao('CALÇA RETA CINTURA MÉDIA DE MOLETOM', 'EN').traducao, 'MID-RISE STRAIGHT SWEATPANTS');
});

test('03/11: SHORT e LONG vão antes da peça de mais de uma palavra; MINI/MIDI/MAXI continuam colados', () => {
  assert.equal(montarTraducao('REGATA CURTA', 'EN').traducao, 'SHORT TANK TOP');
  assert.equal(montarTraducao('SAIA JEANS CURTA', 'EN').traducao, 'SHORT DENIM SKIRT');
  assert.equal(montarTraducao('TOP CORTININHA CURTO', 'EN').traducao, 'SHORT TRIANGLE TOP');
  assert.equal(montarTraducao('VESTIDO POLO MINI', 'EN').traducao, 'POLO MINI DRESS');
  assert.equal(montarTraducao('SAIA JEANS MINI CINTURA BAIXA COM BRILHO', 'EN').traducao, 'LOW-RISE DENIM MINI SKIRT WITH SHIMMER');
  // peça de uma palavra: nada muda
  assert.equal(montarTraducao('MACACÃO SARJA CURTO COM ZÍPER', 'EN').traducao, 'TWILL SHORT JUMPSUIT WITH ZIPPER');
});

/* ==================== Contexto e lotes para a DeepL em espanhol ==================== */

test('o contexto da DeepL em espanhol leva a forma concordada, e os lotes não misturam sentidos', () => {
  const contexto = montarContextoGlossario(['CALÇA ACETINADA XYZ'], 'ES');
  assert.match(contexto, /CALÇA = PANTALÓN/);
  assert.match(contexto, /ACETINADA = SATINADO/);
  assert.doesNotMatch(contexto, /XYZ/);

  const lotes = montarLotesParaTraducao(['SAIA ACETINADA XYZ', 'CALÇA ACETINADA XYZ', 'saia acetinada xyz'], 'ES');
  // ACETINADA = SATINADA na saia e SATINADO na calça: lotes separados.
  assert.equal(lotes.length, 2);
  assert.deepEqual(lotes[0].posicoes, [[0, 2]]);
  assert.match(lotes[0].contexto, /ACETINADA = SATINADA/);
  assert.match(lotes[1].contexto, /ACETINADA = SATINADO/);
});
