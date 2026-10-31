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
// SLEEP/SLIP ficam marcados até o dono decidir; `termoNovo` = depende de uma entrada que está na
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
  ['MEIA CALÇA FUSÔ DE RENDA', 'MEDIAS FUSEAU DE ENCAJE', { termoNovo: 'MEIA CALÇA' }],
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
  ['VESTIDO SLIP COM RENDA ACETINADO', 'VESTIDO SLIP CON ENCAJE SATINADO', { estado: 'varias-pecas' }]
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
  assert.equal(montarTraducaoES('MEIA CALÇA FUSÔ DE RENDA').estado, 'varias-pecas');
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
