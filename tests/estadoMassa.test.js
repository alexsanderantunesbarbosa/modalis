const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const EstadoMassa = require('../estadoMassa');
const { LIMITE_SAP } = require('../processadorTexto');

const {
  LIMITE_CARACTERES, textoContador, acimaDoLimite, precisaTraduzir, linhaMarcada, podeConfirmar,
  confirmarTraducao, aplicarTraducaoAutomatica, registrarEdicao, registrarEdicaoEN, limparTraducao, descreverSelo,
  problemaDaLinha, resumirMassa, textoFaixaMassa
} = EstadoMassa;

// Linha como processarArquivo (script.js) cria, com a grafia já decidida.
function novaLinha(campos = {}) {
  return {
    ref: 'REF', ptOriginal: 'SAIA JEANS', pt: 'SAIA JEANS', ptSugerido: 'SAIA JEANS',
    correcoesSugeridas: [], estadoCorrecao: 'sem-sugestao',
    en: '', es: '', origemEN: '', estadoEN: '', motivoEN: '', enAutomatico: '', confirmadaEN: false,
    origemES: '', estadoES: '', motivoES: '', esAutomatico: '', confirmadaES: false,
    ...campos
  };
}

// Linha traduzida: o EN como pedido e o ES pela tabela, sem pendência. Os testes de cada
// regra olham um idioma; o outro fica pronto para não interferir.
function traduzida(traducao, origem = 'tabela', estado = 'tabela', motivo = '') {
  const item = novaLinha();
  aplicarTraducaoAutomatica(item, { traducao, origem, estado, motivo });
  aplicarTraducaoAutomatica(item, { traducao: 'FALDA DENIM', origem: 'tabela', estado: 'tabela' }, 'ES');
  return item;
}

// O mesmo, com o ES como pedido e o EN pela tabela.
function traduzidaES(traducao, origem = 'tabela', estado = 'tabela', motivo = '') {
  const item = novaLinha();
  aplicarTraducaoAutomatica(item, { traducao: 'DENIM SKIRT', origem: 'tabela', estado: 'tabela' });
  aplicarTraducaoAutomatica(item, { traducao, origem, estado, motivo }, 'ES');
  return item;
}

const textoDe = tamanho => 'X'.repeat(tamanho);

test('o limite do front é o mesmo do servidor', () => {
  assert.equal(LIMITE_CARACTERES, LIMITE_SAP);
});

test('contador conta o texto normalizado, que é o que vai para a planilha', () => {
  assert.equal(textoContador(''), '');
  assert.equal(textoContador('  saia   jeans '), '10/40');
  // O contentEditable troca espaços repetidos por espaço inquebrável (U+00A0).
  assert.equal(textoContador('A  B'), '3/40');
  assert.equal(acimaDoLimite(textoDe(40)), false);
  assert.equal(acimaDoLimite(textoDe(41)), true);
});

test('tradução automática guarda o texto da máquina e zera a confirmação só do seu idioma', () => {
  const item = novaLinha({ es: 'FALDA', origemES: 'manual', confirmadaEN: true });
  aplicarTraducaoAutomatica(item, { traducao: '  high-rise  jeans ', origem: 'tabela', estado: 'tabela', motivo: '' });

  assert.equal(item.en, 'HIGH-RISE JEANS');
  assert.equal(item.enAutomatico, 'HIGH-RISE JEANS');
  assert.equal(item.confirmadaEN, false);
  // O espanhol é independente: a tradução do EN não apaga o ES (antes do ES, apagava).
  assert.equal(item.es, 'FALDA');
  assert.equal(item.origemES, 'manual');

  aplicarTraducaoAutomatica(item, { traducao: 'jeans  tiro alto', origem: 'deepl', estado: 'revisar', motivo: 'x' }, 'ES');
  assert.deepEqual([item.es, item.esAutomatico, item.origemES, item.estadoES, item.motivoES], ['JEANS TIRO ALTO', 'JEANS TIRO ALTO', 'deepl', 'revisar', 'x']);
  assert.equal(item.en, 'HIGH-RISE JEANS');
});

test('edição de uma linha acima de 40: "tinha 43, agora tem 38"', () => {
  const item = traduzida(textoDe(43), 'tabela', 'acima-de-40');
  assert.deepEqual(descreverSelo(item), { classe: 'selo-limite', texto: 'Acima de 40 caracteres (43)' });

  assert.equal(registrarEdicaoEN(item, textoDe(38)), true);

  assert.equal(item.origemEN, 'manual');
  assert.equal(item.estadoEN, '');
  assert.equal(item.enAutomatico.length, 43);
  assert.deepEqual(descreverSelo(item), { classe: 'selo-manual', texto: 'Editado à mão · tinha 43, agora tem 38' });
  assert.equal(problemaDaLinha(item), '');
});

test('edição que ainda passa de 40 continua marcada e pendente', () => {
  const continuaAcima = traduzida(textoDe(45), 'tabela', 'acima-de-40');
  registrarEdicaoEN(continuaAcima, textoDe(42));
  assert.deepEqual(descreverSelo(continuaAcima), { classe: 'selo-limite', texto: 'Editado à mão · tinha 45, agora tem 42 · ainda acima de 40' });
  assert.equal(problemaDaLinha(continuaAcima), 'acima');

  const passouAcima = traduzida(textoDe(38));
  registrarEdicaoEN(passouAcima, textoDe(42));
  assert.deepEqual(descreverSelo(passouAcima), { classe: 'selo-limite', texto: 'Editado à mão · tinha 38, agora tem 42 · acima de 40' });
});

test('em várias edições o "tinha" é sempre o tamanho do que a máquina entregou', () => {
  const item = traduzida(textoDe(43), 'tabela', 'acima-de-40');

  registrarEdicaoEN(item, textoDe(41));
  assert.equal(descreverSelo(item).texto, 'Editado à mão · tinha 43, agora tem 41 · ainda acima de 40');

  registrarEdicaoEN(item, textoDe(38));
  assert.equal(descreverSelo(item).texto, 'Editado à mão · tinha 43, agora tem 38');
});

test('edição sem nada acima de 40 mostra só "Editado à mão"; sem texto da máquina, mostra o excesso', () => {
  const dentro = traduzida(textoDe(30));
  registrarEdicaoEN(dentro, textoDe(33));
  assert.deepEqual(descreverSelo(dentro), { classe: 'selo-manual', texto: 'Editado à mão' });

  const semMaquina = novaLinha();
  registrarEdicaoEN(semMaquina, textoDe(42));
  assert.deepEqual(descreverSelo(semMaquina), { classe: 'selo-limite', texto: 'Editado à mão · acima de 40 (42)' });
});

test('salvar o mesmo texto não marca a linha como editada', () => {
  const item = traduzida('SAIA JEANS');

  assert.equal(registrarEdicaoEN(item, ' saia   jeans '), false);
  assert.equal(item.origemEN, 'tabela');
});

test('apagar o inglês devolve a linha para tradução', () => {
  const item = traduzida('SAIA JEANS');

  assert.equal(registrarEdicaoEN(item, '   '), true);
  assert.equal(item.origemEN, '');
  assert.equal(precisaTraduzir(item), true);
  assert.equal(descreverSelo(item), null);
});

test('digitar de volta o texto da máquina mantém a linha como editada (e validada)', () => {
  const item = traduzida('WIDE LEG JEANS', 'deepl', 'revisar', 'ordem diferente da estrutura');
  registrarEdicaoEN(item, 'WIDE JEANS');
  registrarEdicaoEN(item, 'WIDE LEG JEANS');

  assert.equal(item.origemEN, 'manual');
  assert.equal(linhaMarcada(item), false);
  assert.equal(descreverSelo(item).texto, 'Editado à mão');
});

test('confirmar tira a marca sem mudar o texto; acima de 40 precisa de edição', () => {
  const revisar = traduzida('WIDE LEG JEANS', 'deepl', 'revisar', 'ordem diferente da estrutura');
  assert.equal(podeConfirmar(revisar), true);
  assert.equal(confirmarTraducao(revisar), true);
  assert.equal(revisar.en, 'WIDE LEG JEANS');
  assert.equal(linhaMarcada(revisar), false);
  assert.equal(problemaDaLinha(revisar), '');
  assert.deepEqual(descreverSelo(revisar), { classe: 'selo-manual', texto: 'Confirmada na revisão' });

  const longa = traduzida(textoDe(45), 'deepl', 'revisar', 'peça a mais: PANTS');
  assert.equal(podeConfirmar(longa), false);
  assert.equal(confirmarTraducao(longa), false);
  assert.equal(longa.confirmadaEN, false);

  assert.equal(podeConfirmar(traduzida('SAIA JEANS')), false, 'linha sem marca não tem o que confirmar');
});

test('linha do motor local confirmada não é reenviada à DeepL', () => {
  const item = traduzida('SAIA JEANS', 'local', 'revisar', 'DeepL falhou; montada pela tabela');
  assert.equal(precisaTraduzir(item), true);

  confirmarTraducao(item);
  assert.equal(precisaTraduzir(item), false);

  // Editar desfaz a confirmação; a linha editada à mão também nunca é reenviada.
  registrarEdicaoEN(item, 'DENIM SKIRT');
  assert.equal(item.confirmadaEN, false);
  assert.equal(item.origemEN, 'manual');
  assert.equal(precisaTraduzir(item), false);
});

test('decisão de grafia zera a tradução, a base do "tinha" e a confirmação', () => {
  const item = traduzida('SAIA JEANS', 'local', 'revisar');
  confirmarTraducao(item);

  confirmarTraducao(item, 'ES');
  registrarEdicao(item, 'FALDA', 'ES');

  limparTraducao(item);

  assert.deepEqual(
    [item.en, item.es, item.origemEN, item.estadoEN, item.motivoEN, item.enAutomatico, item.confirmadaEN],
    ['', '', '', '', '', '', false]
  );
  assert.deepEqual(
    [item.origemES, item.estadoES, item.motivoES, item.esAutomatico, item.confirmadaES],
    ['', '', '', '', false]
  );
});

test('DeepL com espaço duplo: o servidor mediu 41, mas o texto gravado tem 40 e não fica marcado', () => {
  const item = traduzida(`${textoDe(20)}  ${textoDe(19)}`, 'deepl', 'acima-de-40');

  assert.equal(item.en.length, 40);
  assert.deepEqual(descreverSelo(item), { classe: 'selo-deepl', texto: 'DeepL' });
  assert.equal(problemaDaLinha(item), '');
});

test('cada linha conta só no primeiro problema, na mesma ordem dos selos', () => {
  const casos = [
    [novaLinha({ estadoCorrecao: 'pendente' }), 'grafia'],
    [novaLinha(), 'semTraducao'],
    [traduzida('SAIA', 'local', 'revisar'), 'falhaDeepL'],
    [traduzida('SAIA', 'deepl', 'revisar'), 'revisar'],
    // A revisar e acima de 40: só editar resolve (não há Confirmar) e o download bloqueia.
    [traduzida(textoDe(45), 'deepl', 'revisar'), 'acima'],
    [traduzida(textoDe(45), 'local', 'revisar'), 'falhaDeepL'],
    [traduzida(textoDe(41), 'tabela', 'acima-de-40'), 'acima'],
    [Object.assign(traduzida('SKIRT'), { pt: textoDe(41) }), 'ptAcima'],
    [traduzida('SKIRT'), ''],
    [traduzida('SKIRT', 'deepl', 'deepl'), '']
  ];
  for (const [item, esperado] of casos) assert.equal(problemaDaLinha(item), esperado, JSON.stringify(item));
});

test('todo selo de linha acima de 40 diz o excesso, para o filtro "ACIMA" achar o que o download bloqueia', () => {
  assert.deepEqual(descreverSelo(traduzida(textoDe(45), 'deepl', 'revisar', 'peça a mais: PANTS')), {
    classe: 'selo-revisar', texto: 'A revisar: peça a mais: PANTS · acima de 40 (45)'
  });
  assert.deepEqual(descreverSelo(traduzida(textoDe(45), 'local', 'revisar', 'DeepL falhou')), {
    classe: 'selo-local', texto: 'DeepL falhou; montada pela tabela (DeepL falhou) · acima de 40 (45)'
  });
  assert.equal(descreverSelo(traduzida('SAIA', 'deepl', 'revisar', 'peça a mais: PANTS')).texto, 'A revisar: peça a mais: PANTS');
});

test('quantidades no formato brasileiro, no singular ou no plural', () => {
  assert.equal(EstadoMassa.formatarQuantidade(1, 'descrição distinta', 'descrições distintas'), '1 descrição distinta');
  assert.equal(EstadoMassa.formatarQuantidade(1622, 'linha', 'linhas'), '1.622 linhas');
  assert.equal(EstadoMassa.formatarQuantidade(0, 'linha', 'linhas'), '0 linhas');
});

// Planilha com um pouco de tudo: 4 pendências, uma de cada tipo.
function planilhaMista() {
  const corrigida = traduzida(textoDe(43), 'tabela', 'acima-de-40');
  registrarEdicaoEN(corrigida, textoDe(38));
  const confirmada = traduzida('SAIA JEANS', 'local', 'revisar');
  confirmarTraducao(confirmada);
  return [
    traduzida('SKIRT'), traduzida('SKIRT'), traduzida('SKIRT'),
    traduzida('DENIM SKIRT', 'deepl', 'deepl'),
    traduzida('WIDE LEG DENIM PANTS', 'deepl', 'revisar', 'ordem diferente da estrutura'),
    traduzida('SAIA JEANS', 'local', 'revisar', 'DeepL falhou'),
    traduzida(textoDe(43), 'tabela', 'acima-de-40'),
    corrigida,
    novaLinha(),
    confirmada
  ];
}

test('resumo: origens sem sobreposição e pendências que somam o total', () => {
  const resumo = resumirMassa(planilhaMista());

  assert.equal(resumo.total, 10);
  assert.equal(resumo.comTraducao, 9);
  assert.deepEqual(resumo.origens, { tabela: 4, deepl: 2, falhaDeepL: 1, editadas: 1, confirmadas: 1, semTraducao: 1 });
  assert.equal(resumo.corrigidas, 1);
  assert.deepEqual(resumo.pendencias, { grafia: 0, semTraducao: 1, falhaDeepL: 1, revisar: 1, acima: 1, ptAcima: 0 });
  assert.equal(resumo.pendentes, Object.values(resumo.pendencias).reduce((soma, n) => soma + n, 0));
  assert.equal(resumo.pronto, false);
});

test('faixa no meio da revisão: bege, com o balanço e o que falta resolver', () => {
  assert.deepEqual(textoFaixaMassa(resumirMassa(planilhaMista())), {
    texto: '10 linhas: 4 pela tabela, 2 pela DeepL, 1 editada à mão (1 estava acima de 40 e agora cabe), 1 confirmada na revisão. '
      + 'Falta resolver 4 linhas: 1 sem tradução, 1 com falha da DeepL, 1 acima de 40, 1 a revisar.',
    tipo: 'aviso'
  });
});

test('faixa nomeia também grafia pendente e DESCRIÇÃO PT acima de 40, que bloqueiam o download', () => {
  const grafiaPendente = novaLinha({ estadoCorrecao: 'pendente' });
  registrarEdicaoEN(grafiaPendente, 'DENIM SKIRT');
  registrarEdicao(grafiaPendente, 'FALDA DENIM', 'ES');
  const ptLongo = Object.assign(traduzida('SKIRT'), { pt: textoDe(41) });

  assert.equal(
    textoFaixaMassa(resumirMassa([grafiaPendente, ptLongo])).texto,
    '2 linhas: 1 pela tabela, 0 pela DeepL, 1 editada à mão. Falta resolver 2 linhas: 1 com grafia a decidir, 1 com DESCRIÇÃO PT acima de 40.'
  );
});

test('faixa fica verde quando nada impede o download, com números no formato brasileiro', () => {
  const itens = Array.from({ length: 1622 }, () => traduzida('SKIRT'));
  assert.deepEqual(textoFaixaMassa(resumirMassa(itens)), {
    texto: '1.622 linhas: 1.622 pela tabela, 0 pela DeepL. Nada pendente: pode baixar o Excel.',
    tipo: 'ok'
  });

  const corrigidas = [textoDe(43), textoDe(44)].map(texto => {
    const item = traduzida(texto, 'tabela', 'acima-de-40');
    registrarEdicaoEN(item, textoDe(39));
    return item;
  });
  assert.equal(
    textoFaixaMassa(resumirMassa(corrigidas), { prefixo: 'Tradução concluída (2 descrições distintas).' }).texto,
    'Tradução concluída (2 descrições distintas). 2 linhas: 0 pela tabela, 0 pela DeepL, 2 editadas à mão (2 estavam acima de 40 e agora cabem). Nada pendente: pode baixar o Excel.'
  );
});

test('antes da tradução a faixa acompanha a grafia, sem cor; um aviso de erro vem antes e pinta de bege', () => {
  const pendentes = [novaLinha({ estadoCorrecao: 'pendente' }), novaLinha({ estadoCorrecao: 'pendente' }), novaLinha()];
  assert.deepEqual(textoFaixaMassa(resumirMassa(pendentes)), {
    texto: '2 linhas ainda precisam de uma decisão de grafia antes da tradução.',
    tipo: ''
  });
  assert.equal(
    textoFaixaMassa(resumirMassa([novaLinha({ estadoCorrecao: 'pendente' })])).texto,
    '1 linha ainda precisa de uma decisão de grafia antes da tradução.'
  );
  assert.deepEqual(textoFaixaMassa(resumirMassa([novaLinha()]), { aviso: 'A tradução não foi concluída: Failed to fetch.' }), {
    texto: 'A tradução não foi concluída: Failed to fetch. Revisão de grafia concluída. Clique em Traduzir quando estiver pronto.',
    tipo: 'aviso'
  });
});

test('filtros rápidos: os de problema têm os mesmos números da faixa', () => {
  const itens = planilhaMista();
  const { pendencias } = resumirMassa(itens);
  const contagens = EstadoMassa.contarFiltros(itens);

  assert.equal(contagens.todas, 10);
  for (const chave of ['revisar', 'acima', 'falhaDeepL', 'semTraducao', 'ptAcima']) {
    assert.equal(contagens[chave], pendencias[chave], chave);
  }
  assert.equal(contagens.editadas, 1);
  assert.equal(contagens.confirmadas, 1);
  assert.deepEqual(EstadoMassa.FILTROS_RAPIDOS.map(f => f.chave), ['todas', 'revisar', 'acima', 'falhaDeepL', 'semTraducao', 'ptAcima', 'editadas', 'confirmadas']);
});

test('filtro "editadas" inclui a editada que ainda passa de 40 (ela também está em "acima")', () => {
  const item = traduzida(textoDe(45), 'tabela', 'acima-de-40');
  registrarEdicaoEN(item, textoDe(42));

  assert.equal(EstadoMassa.passaNoFiltro(item, 'editadas'), true);
  assert.equal(EstadoMassa.passaNoFiltro(item, 'acima'), true);
  assert.equal(EstadoMassa.passaNoFiltro(item, 'revisar'), false);
});

test('exportação: bloqueios listam cada problema; sem bloqueio nem marcada, a faixa está verde', () => {
  const grafia = novaLinha({ ref: 'G1', estadoCorrecao: 'pendente' });
  const semEN = novaLinha({ ref: 'S1' });
  const longa = Object.assign(traduzida(textoDe(43)), { ref: 'L1', pt: textoDe(41) });
  const marcada = Object.assign(traduzida('SKIRT', 'deepl', 'revisar', 'ordem diferente'), { ref: 'M1' });

  const { bloqueios, marcadas } = EstadoMassa.verificarExportacao([grafia, semEN, longa, marcada]);
  assert.deepEqual(bloqueios.map(b => `${b.referencia}: ${b.problema}`), [
    'G1: Grafia a decidir',
    'S1: Sem Descrição EN',
    'S1: Sem Descrição ES',
    'L1: DESCRIÇÃO PT com 41 caracteres',
    'L1: Descrição EN com 43 caracteres'
  ]);
  // A janela mostra o texto de cada problema ao lado dele.
  assert.deepEqual(bloqueios.map(b => b.texto.length), [10, 0, 0, 41, 43]);
  assert.deepEqual(marcadas.map(i => i.ref), ['M1']);

  // Mesma regra da faixa: pronta para baixar <=> nenhum bloqueio e nenhuma marcada.
  for (const itens of [planilhaMista(), [traduzida('SKIRT'), marcada], [traduzida('SKIRT'), traduzida('DRESS', 'deepl', 'deepl')]]) {
    const verificacao = EstadoMassa.verificarExportacao(itens);
    assert.equal(resumirMassa(itens).pronto, !verificacao.bloqueios.length && !verificacao.marcadas.length);
  }
});

/* ==================== Espanhol: os mesmos controles do inglês ==================== */

test('ES: edição, "tinha X, agora tem Y" e confirmação valem só para o espanhol', () => {
  const item = traduzidaES(textoDe(44), 'tabela', 'acima-de-40');
  assert.deepEqual(descreverSelo(item, 'ES'), { classe: 'selo-limite', texto: 'Acima de 40 caracteres (44)' });
  assert.equal(descreverSelo(item, 'EN'), null, 'o EN pela tabela continua sem selo');
  assert.equal(problemaDaLinha(item), 'acima');

  assert.equal(registrarEdicao(item, textoDe(39), 'ES'), true);
  assert.equal(item.origemES, 'manual');
  assert.equal(item.origemEN, 'tabela');
  assert.deepEqual(descreverSelo(item, 'ES'), { classe: 'selo-manual', texto: 'Editado à mão · tinha 44, agora tem 39' });
  assert.equal(problemaDaLinha(item), '');

  const revisar = traduzidaES('FALDA DENIM', 'deepl', 'revisar', 'glossário não aplicado: FALDA');
  assert.equal(podeConfirmar(revisar, 'EN'), false);
  assert.equal(podeConfirmar(revisar, 'ES'), true);
  assert.equal(problemaDaLinha(revisar), 'revisar');
  assert.equal(confirmarTraducao(revisar, 'ES'), true);
  assert.equal(revisar.confirmadaES, true);
  assert.equal(problemaDaLinha(revisar), '');
});

test('ES: a linha só fica pronta com os dois idiomas; o que falta em um conta para a linha', () => {
  const semES = traduzida('DENIM SKIRT');
  limparTraducao(semES);
  aplicarTraducaoAutomatica(semES, { traducao: 'DENIM SKIRT', origem: 'tabela', estado: 'tabela' });
  assert.equal(precisaTraduzir(semES, 'EN'), false);
  assert.equal(precisaTraduzir(semES, 'ES'), true);
  assert.equal(precisaTraduzir(semES), true, 'sem idioma: algum dos dois');
  assert.equal(problemaDaLinha(semES), 'semTraducao');

  const falhaES = traduzidaES('FALDA DENIM', 'local', 'revisar', 'DeepL falhou');
  assert.equal(problemaDaLinha(falhaES), 'falhaDeepL');
  assert.equal(precisaTraduzir(falhaES, 'ES'), true);
  assert.equal(precisaTraduzir(falhaES, 'EN'), false);

  // Editada à mão no ES não é reenviada, como no EN.
  registrarEdicao(falhaES, 'FALDA VAQUERA', 'ES');
  assert.equal(precisaTraduzir(falhaES), false);
});

test('ES: faixa, filtros e origem olham a linha inteira (o idioma que mais pede atenção decide)', () => {
  const editadaES = traduzidaES(textoDe(43), 'tabela', 'acima-de-40');
  registrarEdicao(editadaES, textoDe(38), 'ES');
  const itens = [traduzida('SKIRT'), traduzidaES('FALDA', 'deepl', 'deepl'), editadaES, traduzidaES('FALDA', 'deepl', 'revisar', 'x')];

  const resumo = resumirMassa(itens);
  assert.deepEqual(resumo.origens, { tabela: 1, deepl: 2, falhaDeepL: 0, editadas: 1, confirmadas: 0, semTraducao: 0 });
  assert.equal(resumo.corrigidas, 1);
  assert.deepEqual(resumo.pendencias, { grafia: 0, semTraducao: 0, falhaDeepL: 0, revisar: 1, acima: 0, ptAcima: 0 });
  assert.equal(EstadoMassa.passaNoFiltro(editadaES, 'editadas'), true);
  assert.equal(EstadoMassa.contarFiltros(itens).revisar, 1);
});

test('ES: os números de "Editadas" e "Confirmadas" batem com a faixa em linhas mistas EN/ES', () => {
  // EN editado à mão e ES confirmado: a faixa conta como editada, e o botão também.
  const mista = traduzidaES('FALDA', 'deepl', 'revisar', 'x');
  registrarEdicaoEN(mista, 'SKIRT');
  confirmarTraducao(mista, 'ES');
  // EN editado antes de traduzir e ES vazio: a faixa conta como sem tradução.
  const semES = novaLinha();
  registrarEdicaoEN(semES, 'SKIRT');

  const itens = [mista, semES];
  const { origens } = resumirMassa(itens);
  const contagens = EstadoMassa.contarFiltros(itens);
  assert.equal(contagens.editadas, origens.editadas);
  assert.equal(contagens.confirmadas, origens.confirmadas);
  assert.equal(contagens.semTraducao, 1);
});

test('ES: download bloqueia espanhol acima de 40 e pede confirmação para ES marcado', () => {
  const longa = Object.assign(traduzidaES(textoDe(42)), { ref: 'E1' });
  const marcada = Object.assign(traduzidaES('FALDA', 'deepl', 'revisar', 'x'), { ref: 'E2' });

  const { bloqueios, marcadas } = EstadoMassa.verificarExportacao([longa, marcada]);
  assert.deepEqual(bloqueios.map(b => `${b.referencia}: ${b.problema}`), ['E1: Descrição ES com 42 caracteres']);
  assert.deepEqual(marcadas.map(i => i.ref), ['E2']);
  assert.equal(resumirMassa([longa]).pronto, false);
});

test('estadoMassa.js e script.js carregam juntos no mesmo escopo, na ordem do index.html', () => {
  const raiz = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map(([, src]) => src)
    .filter(src => !src.startsWith('http'));
  assert.deepEqual(scripts, ['estadoMassa.js', 'script.js']);

  // DOM mínimo: ao carregar, o script.js só registra eventos.
  const elemento = { addEventListener() {} };
  const contexto = vm.createContext({ document: { getElementById: () => elemento, querySelectorAll: () => [], addEventListener() {} } });
  for (const arquivo of scripts) {
    vm.runInContext(fs.readFileSync(path.join(raiz, arquivo), 'utf8'), contexto, { filename: arquivo });
  }

  // Um nome repetido entre os arquivos daria SyntaxError acima ou trocaria a regra em
  // silêncio; aqui, todo nome do EstadoMassa visível no script.js tem de ser o mesmo.
  for (const nome of Object.keys(EstadoMassa)) {
    assert.equal(vm.runInContext(`typeof ${nome} === 'undefined' || ${nome} === EstadoMassa.${nome}`, contexto), true, nome);
  }
  assert.equal(vm.runInContext('typeof renderTabelaMassa', contexto), 'function');
});
