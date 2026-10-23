const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { criarServidor } = require('../server');

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
      deeplTimeoutMs: 200,
      limiteCorpoBytes: 4096,
      maxDescricoesLote: 5,
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
  const { fetchImpl } = fetchFalso(() => new Response('{"message":"Internal error with a long stack trace"}', { status: 500 }));
  const servidor = await subir({ fetchImpl });
  try {
    const { status, dados } = await post(servidor.base, '/api/traduzir', { textoPT: 'CALÇA JEANS BOOTCUT', targetLang: 'EN' });
    assert.equal(status, 200);
    assert.equal(dados.origem, 'local');
    assert.equal(dados.traducao, 'JEANS BOOTCUT');
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
    const grande = await post(servidor.base, '/api/traduzir-massa', { textos: Array(6).fill('SAIA'), targetLang: 'EN' });
    assert.equal(grande.status, 400);
    assert.match(grande.dados.error, /6 descrições; o limite atual é 5/);

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

test('em massa, o fallback é por grupo: um grupo falha e os outros seguem pela DeepL', async () => {
  const { fetchImpl, chamadas } = fetchFalso((corpo, numero) => (numero === 2
    ? new Response('{}', { status: 500 })
    : respostaDeepL(corpo.text)));
  const servidor = await subir({ fetchImpl });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI'];
    const { status, dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN-US' });
    assert.equal(status, 200);
    assert.equal(chamadas.length, 3, 'três contextos distintos, três chamadas');
    assert.deepEqual(dados.origens, ['deepl', 'local', 'deepl']);
    assert.equal(dados.traducoes[0], 'EN(CALÇA JEANS BOOTCUT)');
    assert.equal(dados.traducoes[1], 'BLOUSE TURTLENECK');
    assert.deepEqual(dados.erros, ['DeepL respondeu 500 (erro no serviço)']);
  } finally {
    await servidor.fechar();
  }
});

test('erro fatal da DeepL (cota esgotada) interrompe as chamadas no restante do lote', async () => {
  const { fetchImpl, chamadas } = fetchFalso(() => new Response('{"message":"Quota exceeded"}', { status: 456 }));
  const servidor = await subir({ fetchImpl });
  try {
    const textos = ['CALÇA JEANS BOOTCUT', 'BLUSA GOLA ALTA', 'SAIA MIDI'];
    const { dados } = await post(servidor.base, '/api/traduzir-massa', { textos, targetLang: 'EN' });
    assert.equal(chamadas.length, 1, 'depois do 456 a DeepL não deve ser chamada de novo');
    assert.deepEqual(dados.origens, ['local', 'local', 'local']);
    assert.deepEqual(dados.traducoes, ['JEANS BOOTCUT', 'BLOUSE TURTLENECK', 'MIDI SKIRT']);
    assert.match(dados.erros[0], /456 \(cota esgotada\)/);
    assert.match(dados.erros[1], /não foi chamada para o restante do lote/);
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

test('GET /api/glossario devolve os índices da tabela com o espanhol do setor quando existe', async () => {
  const servidor = await subir();
  try {
    const resposta = await fetch(`${servidor.base}/api/glossario`);
    assert.equal(resposta.status, 200);
    const { indices } = await resposta.json();
    assert.equal(indices.length, 16);
    const blusa = indices[0].termos.find(termo => termo.pt === 'BLUSA');
    assert.deepEqual(blusa, { pt: 'BLUSA', en: 'BLOUSE', es: 'BLUSA', tipo: 'termo', contexto: '', status: 'FECHADO' });
  } finally {
    await servidor.fechar();
  }
});
