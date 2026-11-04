// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { criarServidor, criarLimitador } = require('../server');

/* ==================== Apoio ==================== */

// Resposta da DeepL falsa: devolve "EN(<texto>)" para cada texto enviado.
function respostaDeepL(textos, status = 200) {
  return new Response(JSON.stringify({ translations: textos.map(texto => ({ text: `EN(${texto})` })) }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function fetchFalso(implementacao) {
  const chamadas = [];
  const fetchImpl = async (url, opcoes) => {
    const corpo = JSON.parse(opcoes.body);
    chamadas.push(corpo);
    return implementacao(corpo, chamadas.length, opcoes);
  };
  return { fetchImpl, chamadas };
}

async function subir(opcoes = {}) {
  const servidor = criarServidor({
    silencioso: true,
    config: {
      deeplApiKey: 'chave-de-teste:fx',
      deeplUrl: 'https://exemplo.invalido/v2/translate',
      motorPrincipal: 'deepl', // os testes deste bloco exercitam o caminho DeepL; o da tabela tem testes próprios abaixo
      deeplTimeoutMs: 200,
      deeplTamanhoLote: 1,
      deeplTentativas: 3,
      deeplEsperaRetryMs: 1,
      deeplChamadasSimultaneas: 1,
      deeplFalhasSeguidas: 9,
      deeplCircuitoAbertoMs: 30000,
      deeplPausa429Ms: 1,
      deeplPausaMaxima429Ms: 20,
      deeplPaciencia429Ms: 400,
      limiteCorpoBytes: 4096,
      maxDescricoesLote: 6,
      maxCaracteresDescricao: 60,
      ...(opcoes.config || {})
    },
    fetchImpl: opcoes.fetchImpl || (async (_url, { body }) => respostaDeepL(JSON.parse(body).text))
  });
  await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
  const { port } = servidor.address();
  return {
    porta: port,
    base: `http://127.0.0.1:${port}`,
    fechar: () => {
      servidor.closeAllConnections();
      return new Promise(resolve => servidor.close(resolve));
    }
  };
}

async function post(base, rota, corpo) {
  const resposta = await fetch(base + rota, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo)
  });
  return { status: resposta.status, dados: await resposta.json() };
}

// Envia o corpo em dois pacotes TCP, partido no byte indicado (com um intervalo entre
// eles para o servidor receber dois eventos 'data'), e devolve o JSON da resposta.
function requisicaoPartida(porta, caminho, corpo, corte) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port: porta,
      method: 'POST',
      path: caminho,
      agent: false,
      headers: { 'Content-Type': 'application/json', 'Content-Length': corpo.length, Connection: 'close' }
    }, (res) => {
      const recebido = [];
      res.on('data', pedaco => recebido.push(pedaco));
      res.on('error', reject);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, dados: JSON.parse(Buffer.concat(recebido).toString('utf8')) });
        } catch (erro) {
          reject(erro);
        }
      });
    });
    req.on('error', reject);
    req.write(corpo.subarray(0, corte));
    setTimeout(() => req.end(corpo.subarray(corte)), 30);
  });
}

/* ==================== Tradução individual ==================== */

test('traduz pela DeepL e devolve origem, termos aplicados e tradução em caixa alta', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl });
  try {
    const { status, dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'calça jeans bootcut', targetLang: 'EN-US' });
    assert.equal(status, 200);
    assert.equal(dados.origem, 'deepl');
    assert.equal(dados.traducao, 'EN(CALÇA JEANS BOOTCUT)');
    assert.ok(dados.termos.some(par => par.pt === 'CALÇA JEANS' && par.en === 'JEANS'));
    assert.equal(chamadas.length, 1);
    assert.match(chamadas[0].context, /CALÇA JEANS = JEANS/);
    assert.equal(chamadas[0].source_lang, 'PT', 'o idioma de origem é informado, nunca adivinhado');
    assert.equal(dados.estado, 'revisar', 'EN(CALÇA JEANS BOOTCUT) tem as palavras, mas fora da ordem da estrutura');
    assert.match(dados.motivo, /ordem diferente da estrutura/);
    assert.equal(dados.sugestaoTabela, 'BOOTCUT JEANS');
  } finally {
    await servidor.fechar();
  }
});

test('um Ç partido entre dois pacotes TCP não corrompe o texto nem perde o glossário', async () => {
  const servidor = await subir();
  try {
    const corpo = Buffer.from(JSON.stringify({ textoPT: 'CALÇA JEANS BOOTCUT COM RESINA', targetLang: 'EN-US' }), 'utf8');
    const corte = corpo.indexOf(Buffer.from('Ç', 'utf8')) + 1; // entre os dois bytes do Ç
    const { status, dados } = await requisicaoPartida(servidor.porta, '/api/traduzir', corpo, corte);
    assert.equal(status, 200);
    assert.equal(dados.traducao, 'EN(CALÇA JEANS BOOTCUT COM RESINA)');
    assert.ok(dados.termos.some(par => par.pt === 'CALÇA JEANS'), 'CALÇA JEANS deveria casar com o glossário');
  } finally {
    await servidor.fechar();
  }
});

test('cai no fallback local quando a DeepL responde erro, com motivo curto e sem o corpo bruto', async () => {
  const { fetchImpl, chamadas } = fetchFalso(() => new Response('{"message":"Internal error with a long stack trace"}', { status: 500 }));
  const servidor = await subir({ fetchImpl });
  try {
    const { status, dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'CALÇA JEANS BOOTCUT', targetLang: 'EN' });
    assert.equal(status, 200);
    assert.equal(chamadas.length, 3, 'erro 5xx é passageiro: três tentativas antes de desistir');
    assert.equal(dados.origem, 'local');
    assert.equal(dados.traducao, 'BOOTCUT JEANS');
    assert.equal(dados.erro, 'DeepL respondeu 500 (erro no serviço)');
    assert.doesNotMatch(dados.erro, /stack trace/);
  } finally {
    await servidor.fechar();
  }
});

test('resposta da DeepL com tamanho errado vira fallback, nunca null marcado como deepl', async () => {
  const { fetchImpl } = fetchFalso(() => new Response(JSON.stringify({ translations: [] }), { status: 200 }));
  const servidor = await subir({ fetchImpl });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(dados.origem, 'local');
    assert.equal(dados.traducao, 'MIDI SKIRT');
    assert.match(dados.erro, /resposta inesperada/);
  } finally {
    await servidor.fechar();
  }
});

test('DeepL que não responde dentro do timeout vira fallback', async () => {
  const fetchImpl = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason));
  });
  const servidor = await subir({ fetchImpl, config: { deeplTimeoutMs: 50 } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(dados.origem, 'local');
    assert.match(dados.erro, /não respondeu em 0\.05 s/);
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Validação na fronteira ==================== */

test('rejeita entrada inválida com 400 antes de chamar a DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl });
  try {
    const casos = [
      [{ textoPT: 123, targetLang: 'EN' }, /textoPT precisa ser um texto/],
      [{ textoPT: '   ', targetLang: 'EN' }, /textoPT precisa ser um texto/],
      [{ textoPT: 'X'.repeat(61), targetLang: 'EN' }, /61 caracteres; o limite é 60/],
      [{ textoPT: 'SAIA', targetLang: 'PT' }, /Idioma de destino não suportado/],
      [{ textoPT: 'SAIA' }, /Idioma de destino não suportado/],
      ['isto não é json', /não é JSON válido/],
      ['[1,2,3]', /precisa ser um objeto JSON/]
    ];
    for (const [corpo, esperado] of casos) {
      const { status, dados } = await post(servidor.base, '/api/traduzir', corpo);
      assert.equal(status, 400, `esperava 400 para ${JSON.stringify(corpo)}`);
      assert.match(dados.error, esperado);
    }
    assert.equal(chamadas.length, 0, 'a DeepL não deve ser chamada com entrada inválida');
  } finally {
    await servidor.fechar();
  }
});

test('rejeita lote acima do limite de descrições e lista com item inválido', async () => {
  const servidor = await subir();
  try {
    const grande = await post(servidor.base, '/api/traduzir-massa', { textos: Array(7).fill('SAIA'), targetLang: 'EN' });
    assert.equal(grande.status, 400);
    assert.match(grande.dados.error, /7 descrições; o limite atual é 6/);

    const invalido = await post(servidor.base, '/api/traduzir-massa', { textos: ['SAIA', 42], targetLang: 'EN' });
    assert.equal(invalido.status, 400);
    assert.match(invalido.dados.error, /textos\[1\] precisa ser um texto/);

    const vazio = await post(servidor.base, '/api/traduzir-massa', { textos: [], targetLang: 'EN' });
    assert.equal(vazio.status, 400);
  } finally {
    await servidor.fechar();
  }
});

test('recusa corpo acima do limite de bytes com 413', async () => {
  const servidor = await subir();
  try {
    const { status, dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA', targetLang: 'EN', lixo: 'x'.repeat(5000) });
    assert.equal(status, 413);
    assert.match(dados.error, /acima do limite de 4096 bytes/);
  } finally {
    await servidor.fechar();
  }
});

test('rota desconhecida responde 404 em JSON', async () => {
  const servidor = await subir();
  try {
    const resposta = await fetch(`${servidor.base}/api/nada`);
    assert.equal(resposta.status, 404);
    assert.deepEqual(await resposta.json(), { error: 'Rota não encontrada.' });
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Tradução em massa ==================== */

test('em massa, com lote de 50 as descrições distintas vão numa só chamada e as repetidas são traduzidas uma vez', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl, config: { deeplTamanhoLote: 50 } });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI', 'CALÇA JEANS BOOTCUT'];
    const { status, dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN-US' });
    assert.equal(status, 200);
    assert.equal(chamadas.length, 1, 'um lote, uma chamada');
    assert.deepEqual(chamadas[0].text, ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI']);
    assert.match(chamadas[0].context, /CALÇA JEANS = JEANS/);
    assert.match(chamadas[0].context, /GOLA ALTA = TURTLENECK/);
    assert.deepEqual(dados.origens, ['deepl', 'deepl', 'deepl', 'deepl']);
    assert.equal(dados.traducoes[3], dados.traducoes[0]);
    assert.deepEqual(dados.estatisticas, { descricoes: 4, distintas: 3, pelaTabela: 0, paraDeepL: 4, lotes: 1, lotesEnviados: 1, revisar: 4, acimaDe40: 0 });
  } finally {
    await servidor.fechar();
  }
});

test('em massa, o fallback é por lote: um lote falha (após as tentativas) e os outros seguem pela DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => (corpo.text[0] === 'BLUSA GOLA ALTA'
    ? new Response('{}', { status: 500 })
    : respostaDeepL(corpo.text)));
  const servidor = await subir({ fetchImpl, config: { deeplTamanhoLote: 1 } });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI'];
    const { status, dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN-US' });
    assert.equal(status, 200);
    assert.equal(chamadas.length, 5, '1 + 3 tentativas do lote que falha + 1');
    assert.deepEqual(dados.origens, ['deepl', 'local', 'deepl']);
    assert.equal(dados.traducoes[0], 'EN(CALÇA JEANS BOOTCUT)');
    assert.equal(dados.traducoes[1], 'TURTLENECK BLOUSE');
    assert.deepEqual(dados.erros, ['DeepL respondeu 500 (erro no serviço)']);
    assert.equal(dados.estatisticas.lotesEnviados, 3);
  } finally {
    await servidor.fechar();
  }
});

test('falha passageira (429) ganha nova tentativa e termina pela DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso((corpo, numero) => (numero === 1
    ? new Response('{"message":"Too many requests"}', { status: 429 })
    : respostaDeepL(corpo.text)));
  const servidor = await subir({ fetchImpl });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(chamadas.length, 2);
    assert.equal(dados.origem, 'deepl');
    assert.equal(dados.traducao, 'EN(SAIA MIDI)');
  } finally {
    await servidor.fechar();
  }
});

test('erro fatal da DeepL (cota esgotada) interrompe as chamadas nos lotes seguintes', async () => {
  const { fetchImpl, chamadas } = fetchFalso(() => new Response('{"message":"Quota exceeded"}', { status: 456 }));
  const servidor = await subir({ fetchImpl, config: { deeplTamanhoLote: 1 } });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.equal(chamadas.length, 1, 'depois do 456 a DeepL não deve ser chamada de novo (nem nova tentativa)');
    assert.deepEqual(dados.origens, ['local', 'local', 'local']);
    assert.deepEqual(dados.traducoes, ['BOOTCUT JEANS', 'TURTLENECK BLOUSE', 'MIDI SKIRT']);
    assert.match(dados.erros[0], /456 \(cota esgotada\)/);
    assert.match(dados.erros[1], /não foi chamada para o restante do lote/);
  } finally {
    await servidor.fechar();
  }
});

test('o limite de chamadas simultâneas vale para o servidor inteiro, não por requisição', async () => {
  let emVoo = 0;
  let maximoEmVoo = 0;
  const fetchImpl = async (_url, { body }) => {
    emVoo += 1;
    maximoEmVoo = Math.max(maximoEmVoo, emVoo);
    await new Promise(resolve => setTimeout(resolve, 20));
    emVoo -= 1;
    return respostaDeepL(JSON.parse(body).text);
  };
  const servidor = await subir({ fetchImpl, config: { deeplTamanhoLote: 1, deeplChamadasSimultaneas: 2 } });
  try {
    const [a, b] = await Promise.all([
      post(servidor.base, '/api/traduzir-massa', { textos: ['SAIA MIDI', 'BLUSA', 'CALÇA'], targetLang: 'EN' }),
      post(servidor.base, '/api/traduzir-massa', { textos: ['VESTIDO', 'SHORT', 'TOP'], targetLang: 'EN' })
    ]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.deepEqual(a.dados.origens, ['deepl', 'deepl', 'deepl']);
    assert.equal(maximoEmVoo, 2, 'duas requisições juntas não podem passar do limite do servidor');
  } finally {
    await servidor.fechar();
  }
});

test('por padrão cada descrição distinta vai numa chamada própria (contexto específico) e as repetidas são aproveitadas', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'SAIA MIDI', 'CALÇA JEANS BOOTCUT'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.equal(chamadas.length, 2, 'duas descrições distintas, duas chamadas');
    assert.deepEqual(chamadas.map(c => c.text), [['CALÇA JEANS BOOTCUT'], ['SAIA MIDI']]);
    assert.doesNotMatch(chamadas[0].context, /SAIA MIDI/, 'o contexto é só da própria descrição');
    assert.deepEqual(dados.estatisticas, { descricoes: 3, distintas: 2, pelaTabela: 0, paraDeepL: 3, lotes: 2, lotesEnviados: 2, revisar: 3, acimaDe40: 0 });
  } finally {
    await servidor.fechar();
  }
});

test('sem chave da DeepL, todo o lote usa o motor local e explica o motivo', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl, config: { deeplApiKey: '' } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos: ['SAIA MIDI', 'BLUSA'], targetLang: 'EN' });
    assert.equal(chamadas.length, 0);
    assert.deepEqual(dados.origens, ['local', 'local']);
    assert.match(dados.erros[0], /não configurada/);
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Correções e glossário ==================== */

test('sugerir-correcoes aceita descrições vazias na lista e valida o tipo', async () => {
  const servidor = await subir();
  try {
    const ok = await post(servidor.base, '/api/sugerir-correcoes', { textos: ['CALÇA JCALÇA JEANS', ''] });
    assert.equal(ok.status, 200);
    assert.equal(ok.dados.sugestoes[0].textoSugerido, 'CALÇA JEANS');
    assert.equal(ok.dados.sugestoes[1].textoSugerido, '');

    const ruim = await post(servidor.base, '/api/sugerir-correcoes', { textos: 'não é lista' });
    assert.equal(ruim.status, 400);
  } finally {
    await servidor.fechar();
  }
});

test('GET /api/glossario devolve os índices da tabela com o espanhol da própria tabela', async () => {
  const servidor = await subir();
  try {
    const resposta = await fetch(`${servidor.base}/api/glossario`);
    assert.equal(resposta.status, 200);
    const { indices } = await resposta.json();
    assert.equal(indices.length, 16);
    const blusa = indices[0].termos.find(termo => termo.pt === 'BLUSA');
    assert.deepEqual(blusa, { pt: 'BLUSA', en: 'BLOUSE', es: 'BLUSA', tipo: 'termo', contexto: '', status: 'FECHADO' });
    // JUSTO: a lista antiga do setor dizia ENJUTO (sentido errado); a tabela diz AJUSTADO.
    const justo = indices.flatMap(indice => indice.termos).find(termo => termo.pt === 'JUSTO');
    assert.equal(justo.es, 'AJUSTADO');
    assert.ok(indices.every(indice => indice.termos.every(termo => termo.es)), 'todo termo tem espanhol');
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Limitador, disjuntor e cancelamento ==================== */

test('limitador: erro numa tarefa libera a vaga (sem deadlock) e tarefa prioritária fura a fila', async () => {
  const limitador = criarLimitador(1);
  await assert.rejects(limitador(() => Promise.reject(new Error('falhou'))), /falhou/);
  const depois = await Promise.race([
    limitador(() => 'ok'),
    new Promise(resolve => setTimeout(() => resolve('travou'), 200))
  ]);
  assert.equal(depois, 'ok', 'a vaga precisa ser liberada mesmo quando a tarefa falha');

  const ordem = [];
  const segurar = limitador(() => new Promise(resolve => setTimeout(resolve, 30)));
  const normal = limitador(() => { ordem.push('normal'); });
  const prioritaria = limitador(() => { ordem.push('prioritaria'); }, { prioritaria: true });
  await Promise.all([segurar, normal, prioritaria]);
  assert.deepEqual(ordem, ['prioritaria', 'normal']);
});

test('disjuntor: com a rede caída, o lote cai no motor local na hora em vez de repetir as esperas lote a lote', async () => {
  const chamadas = [];
  const fetchImpl = async () => { chamadas.push(1); throw new TypeError('fetch failed'); };
  const servidor = await subir({ fetchImpl, config: { deeplChamadasSimultaneas: 3, maxDescricoesLote: 20 } });
  try {
    const textos = Array.from({ length: 12 }, (_, i) => `SAIA MIDI ${i}`);
    const inicio = Date.now();
    const { status, dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.equal(status, 200);
    assert.ok(chamadas.length <= 11, `esperava no máximo 9 tentativas + as em voo, foram ${chamadas.length}`);
    assert.ok(Date.now() - inicio < 2000);
    assert.ok(dados.origens.every(origem => origem === 'local'));
    assert.ok(dados.erros.some(erro => /suspensas por 30 s/.test(erro)), JSON.stringify(dados.erros));

    const antes = chamadas.length;
    const segunda = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(segunda.dados.origem, 'local');
    assert.equal(chamadas.length, antes, 'com o circuito aberto, nenhuma chamada nova à DeepL');
    assert.match(segunda.dados.erro, /indisponível/);
  } finally {
    await servidor.fechar();
  }
});

test('erro fatal com 3 lotes em voo: no máximo 3 chamadas, tudo local e mensagens sem repetição', async () => {
  const { fetchImpl, chamadas } = fetchFalso(() => new Response('{"message":"Quota exceeded"}', { status: 456 }));
  const servidor = await subir({ fetchImpl, config: { deeplChamadasSimultaneas: 3 } });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI', 'VESTIDO', 'SHORT', 'TOP'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.ok(chamadas.length <= 3, `foram ${chamadas.length} chamadas`);
    assert.ok(dados.origens.every(origem => origem === 'local'));
    assert.equal(dados.erros.length, 2);
    assert.equal(dados.estatisticas.lotesEnviados, chamadas.length);
  } finally {
    await servidor.fechar();
  }
});

test('cliente que desiste (aba fechada) cancela os lotes que ainda não começaram', async () => {
  const chamadas = [];
  const fetchImpl = async (_url, { body }) => {
    chamadas.push(1);
    await new Promise(resolve => setTimeout(resolve, 150));
    return respostaDeepL(JSON.parse(body).text);
  };
  const servidor = await subir({ fetchImpl });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI', 'VESTIDO', 'SHORT', 'TOP'];
    const controlador = new AbortController();
    const pedido = fetch(`${servidor.base}/api/traduzir-massa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textos, targetLang: 'EN' }),
      signal: controlador.signal
    });
    setTimeout(() => controlador.abort(), 100);
    await assert.rejects(pedido);
    await new Promise(resolve => setTimeout(resolve, 1200));
    assert.ok(chamadas.length <= 2, `o servidor continuou chamando a DeepL para ninguém: ${chamadas.length} chamadas`);
  } finally {
    await servidor.fechar();
  }
});

/* ==================== 429: freio global, paciência e Retry-After ==================== */

test('429 durante um tempo e depois volta: tudo pela DeepL, sem lote local e sem abrir o disjuntor', async () => {
  const inicio = Date.now();
  let recusas = 0;
  const { fetchImpl, chamadas } = fetchFalso(corpo => {
    if (Date.now() - inicio < 250) { recusas += 1; return new Response('{"message":"Too many requests"}', { status: 429 }); }
    return respostaDeepL(corpo.text);
  });
  const servidor = await subir({ fetchImpl, config: { deeplChamadasSimultaneas: 3 } });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI', 'VESTIDO', 'SHORT', 'TOP'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.ok(recusas >= 6, `esperava muitos 429 antes de a DeepL voltar, houve ${recusas}`);
    assert.deepEqual(dados.origens, ['deepl', 'deepl', 'deepl', 'deepl', 'deepl', 'deepl']);
    assert.deepEqual(dados.erros, []);
    assert.ok(chamadas.length >= 6);

    const depois = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(depois.dados.origem, 'deepl', 'os 429 não podem ter aberto o disjuntor');
  } finally {
    await servidor.fechar();
  }
});

test('429 sem parar além da paciência: restante no motor local, mensagem de limitação e sem demorar', async () => {
  const { fetchImpl, chamadas } = fetchFalso(() => new Response('{"message":"Too many requests"}', { status: 429 }));
  const servidor = await subir({ fetchImpl, config: { deeplChamadasSimultaneas: 3, maxDescricoesLote: 20 } });
  try {
    const textos = Array.from({ length: 12 }, (_, i) => `SAIA MIDI ${i}`);
    const inicio = Date.now();
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    const duracao = Date.now() - inicio;
    assert.ok(dados.origens.every(origem => origem === 'local'));
    assert.ok(dados.erros.some(erro => /limitando as chamadas/.test(erro)), JSON.stringify(dados.erros));
    assert.ok(duracao >= 400 && duracao < 3000, `paciência de 400 ms, levou ${duracao} ms`);
    assert.ok(chamadas.length < 80, `chamadas demais durante a pausa: ${chamadas.length}`);

    const antes = chamadas.length;
    const depois = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(depois.dados.origem, 'local');
    assert.equal(chamadas.length, antes, 'com o circuito aberto não há chamada nova');
  } finally {
    await servidor.fechar();
  }
});

test('Retry-After do 429 é respeitado: a nova chamada só sai depois do prazo', async () => {
  const instantes = [];
  const { fetchImpl } = fetchFalso(corpo => {
    instantes.push(Date.now());
    return instantes.length === 1
      ? new Response('{"message":"Too many requests"}', { status: 429, headers: { 'Retry-After': '1' } })
      : respostaDeepL(corpo.text);
  });
  const servidor = await subir({ fetchImpl });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA MIDI', targetLang: 'EN' });
    assert.equal(dados.origem, 'deepl');
    assert.equal(instantes.length, 2);
    assert.ok(instantes[1] - instantes[0] >= 950, `esperou só ${instantes[1] - instantes[0]} ms`);
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Motor principal: a tabela monta, a DeepL só complementa ==================== */

test('no motor "tabela", descrição coberta pela tabela não chama a DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'BERMUDA JEANS COMFORT CINTURA MÉDIA', targetLang: 'EN-US' });
    assert.equal(chamadas.length, 0);
    assert.deepEqual([dados.traducao, dados.origem, dados.estado], ['MID-RISE COMFORT JORTS', 'tabela', 'tabela']);
    assert.ok(dados.termos.some(par => par.pt === 'BERMUDA JEANS' && par.en === 'JORTS'));
  } finally {
    await servidor.fechar();
  }
});

test('no motor "tabela", palavra desconhecida vai à DeepL e o validador confere o glossário na volta', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => (corpo.text[0] === 'CAMISA AZUL PETRÓLEO'
    ? new Response(JSON.stringify({ translations: [{ text: 'petrol blue shirt' }] }), { status: 200 })
    : new Response(JSON.stringify({ translations: [{ text: 'blue top' }] }), { status: 200 })));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const ok = await post(servidor.base, '/api/traduzir', { textoPT: 'CAMISA AZUL PETRÓLEO', targetLang: 'EN' });
    assert.equal(chamadas.length, 1);
    assert.deepEqual([ok.dados.traducao, ok.dados.origem, ok.dados.estado], ['PETROL BLUE SHIRT', 'deepl', 'deepl']);
    assert.match(ok.dados.motivo, /fora da tabela: AZUL, PETRÓLEO/);

    const ruim = await post(servidor.base, '/api/traduzir', { textoPT: 'BLUSA AZUL PETRÓLEO', targetLang: 'EN' });
    assert.equal(ruim.dados.estado, 'revisar');
    assert.match(ruim.dados.motivo, /glossário não aplicado: BLOUSE/);
    assert.equal(ruim.dados.sugestaoTabela, 'BLOUSE AZUL PETRÓLEO');
  } finally {
    await servidor.fechar();
  }
});

test('no motor "tabela", em massa só as descrições não cobertas vão à DeepL, com estados por linha', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const textos = ['SAIA JEANS MINI CINTURA BAIXA COM BRILHO', 'CAMISA AZUL PETRÓLEO', 'BLUSA MANGA MÉDIA COM GOLA EM PLANO LEVE', 'SAIA JEANS MINI CINTURA BAIXA COM BRILHO'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.equal(chamadas.length, 1, 'só a descrição com palavra desconhecida vai à DeepL');
    assert.deepEqual(chamadas[0].text, ['CAMISA AZUL PETRÓLEO']);
    assert.deepEqual(dados.origens, ['tabela', 'deepl', 'tabela', 'tabela']);
    assert.deepEqual(dados.estados, ['tabela', 'revisar', 'acima-de-40', 'tabela']);
    assert.equal(dados.traducoes[0], 'LOW-RISE DENIM MINI SKIRT WITH SHIMMER');
    assert.match(dados.motivos[1], /glossário não aplicado: SHIRT/);
    assert.equal(dados.motivos[2], '');
    assert.deepEqual(dados.estatisticas, { descricoes: 4, distintas: 3, pelaTabela: 3, paraDeepL: 1, lotes: 1, lotesEnviados: 1, revisar: 1, acimaDe40: 1 });
  } finally {
    await servidor.fechar();
  }
});

test('no motor "tabela", se a DeepL falhar numa desconhecida a linha sai pela tabela, marcada para revisão e pendente', async () => {
  const { fetchImpl } = fetchFalso(() => new Response('{}', { status: 500 }));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos: ['CAMISA AZUL PETRÓLEO', 'CALÇA JEANS BOOTCUT'], targetLang: 'EN' });
    assert.deepEqual(dados.origens, ['local', 'tabela']);
    assert.deepEqual(dados.estados, ['revisar', 'tabela']);
    assert.equal(dados.traducoes[0], 'SHIRT AZUL PETRÓLEO');
    assert.match(dados.motivos[0], /DeepL falhou; palavras fora da tabela: AZUL, PETRÓLEO/);
    assert.deepEqual(dados.erros, ['DeepL respondeu 500 (erro no serviço)']);
  } finally {
    await servidor.fechar();
  }
});

/* ==================== Espanhol ==================== */

test('ES: descrição coberta pela tabela sai montada em espanhol, sem chamar a DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso(corpo => respostaDeepL(corpo.text));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const { status, dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'calça pijama listrada', targetLang: 'ES' });
    assert.equal(status, 200);
    assert.equal(chamadas.length, 0);
    assert.deepEqual([dados.traducao, dados.origem, dados.estado], ['PANTALÓN PIJAMA RAYADO', 'tabela', 'tabela']);
    assert.deepEqual(dados.termos, [{ pt: 'CALÇA PIJAMA', es: 'PANTALÓN PIJAMA' }, { pt: 'LISTRADA', es: 'RAYADO' }]);

    const massa = await post(servidor.base, '/api/traduzir-massa', { textos: ['SAIA JEANS MINI CINTURA BAIXA COM BRILHO', 'TRENCH COAT SLIM COM GOLA DE PU COM FAIXA'], targetLang: 'ES' });
    assert.deepEqual(massa.dados.traducoes, ['FALDA DENIM MINI TIRO BAJO CON BRILLO', 'TRENCH COAT SLIM CON CUELLO DE PU CON FAJÍN']);
    assert.deepEqual(massa.dados.estados, ['tabela', 'acima-de-40']);
    assert.equal(chamadas.length, 0);
  } finally {
    await servidor.fechar();
  }
});

test('ES: palavra desconhecida vai à DeepL em espanhol, com o contexto em espanhol, e o validador confere', async () => {
  const respostas = {
    'SAIA AZUL PETRÓLEO': 'falda azul petróleo',        // ok
    'BLUSA AZUL PETRÓLEO': 'camiseta azul petróleo',    // BLUSA não aplicada
    'CALÇA ACETINADA XYZ': 'pantalón satinado xyz falda', // peça a mais
    'SAIA JEANS XYZ': 'denim falda xyz'                  // ordem trocada
  };
  const { fetchImpl, chamadas } = fetchFalso(corpo => new Response(JSON.stringify({ translations: corpo.text.map(t => ({ text: respostas[t] })) }), { status: 200 }));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const ok = await post(servidor.base, '/api/traduzir', { textoPT: 'SAIA AZUL PETRÓLEO', targetLang: 'ES' });
    assert.equal(chamadas[0].target_lang, 'ES');
    assert.equal(chamadas[0].source_lang, 'PT');
    assert.match(chamadas[0].context, /SAIA = FALDA/);
    assert.deepEqual([ok.dados.traducao, ok.dados.origem, ok.dados.estado], ['FALDA AZUL PETRÓLEO', 'deepl', 'deepl']);

    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos: Object.keys(respostas).slice(1), targetLang: 'ES' });
    assert.deepEqual(dados.estados, ['revisar', 'revisar', 'revisar']);
    assert.match(dados.motivos[0], /glossário não aplicado: BLUSA/);
    assert.match(dados.motivos[1], /peça a mais: FALDA/);
    assert.match(dados.motivos[2], /ordem diferente/);
    // O contexto leva a forma concordada (SATINADO na calça), não a da tabela solta.
    assert.ok(chamadas.some(corpo => /ACETINADA = SATINADO/.test(corpo.context)));
  } finally {
    await servidor.fechar();
  }
});

test('ES: o validador pega peça a mais no plural e inversão de SIN/CON; TIRANTES sozinho não é peça', async () => {
  const respostas = {
    'CALÇA JEANS XYZ': 'pantalones jeans xyz',           // tabela: JEANS XYZ → PANTALONES a mais
    'VESTIDO TOMARA QUE CAIA XYZ': 'vestido con tirantes xyz', // tabela: SIN TIRANTES → sentido invertido
    'BLUSA DE ALÇA XYZ': 'blusa de tirantes xyz'          // ok: TIRANTES aqui é alça, não peça
  };
  const { fetchImpl } = fetchFalso(corpo => new Response(JSON.stringify({ translations: corpo.text.map(t => ({ text: respostas[t] })) }), { status: 200 }));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos: Object.keys(respostas), targetLang: 'ES' });
    assert.deepEqual(dados.estados, ['revisar', 'revisar', 'deepl']);
    assert.match(dados.motivos[0], /peça a mais: PANTALONES/);
    assert.match(dados.motivos[1], /glossário não aplicado: SIN/);
  } finally {
    await servidor.fechar();
  }
});

test('validador: peça a mais, ordem trocada e repetição engolida viram "revisar"; várias peças também', async () => {
  const respostas = {
    'CALÇA JEANS XYZ': 'XYZ JEANS PANTS',                 // PANTS a mais
    'SAIA JEANS XYZ': 'SKIRT DENIM XYZ',                  // ordem trocada
    'VESTIDO CURTO MANGA CURTA XYZ': 'SHORT SLEEVE DRESS XYZ', // um SHORT a menos
    'CAMISA XYZ': 'XYZ SHIRT',                            // ok
    'CALÇA E SAIA': 'PANTS AND SKIRT'                     // várias peças
  };
  const { fetchImpl } = fetchFalso(corpo => new Response(JSON.stringify({ translations: corpo.text.map(t => ({ text: respostas[t] })) }), { status: 200 }));
  const servidor = await subir({ fetchImpl, config: { motorPrincipal: 'tabela' } });
  try {
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos: Object.keys(respostas), targetLang: 'EN' });
    assert.deepEqual(dados.estados, ['revisar', 'revisar', 'revisar', 'deepl', 'revisar']);
    assert.match(dados.motivos[0], /peça a mais: PANTS/);
    assert.match(dados.motivos[1], /ordem diferente/);
    assert.match(dados.motivos[2], /glossário não aplicado: SHORT/);
    assert.match(dados.motivos[4], /mais de uma peça/);
  } finally {
    await servidor.fechar();
  }
});
