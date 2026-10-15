process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
/**
 * server.js
 * Servidor HTTP usando variáveis de ambiente e padronização de respostas JSON.
 */

require('dotenv').config();
const http = require('http');
const { processarTraducaoLocal, montarContextoGlossario } = require('./processadorTexto');
const { sugerirCorrecaoGrafia } = require('./correcoesOrtograficas');

const PORT = process.env.PORT || 3000;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Identifica automaticamente se a chave é do plano Free ou Pro
const DEEPL_URL = DEEPL_API_KEY && DEEPL_API_KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

async function traduzirViaDeepL(textos, targetLang) {
  if (!DEEPL_API_KEY) {
    throw new Error('Chave da API DeepL não configurada no .env');
  }

  // Consulta a tabela local antes da chamada. A descrição original segue inteira
  // para o DeepL, que traduz PT→EN e pode reorganizar a frase naturalmente.
  // O contexto orienta o vocabulário; ele não substitui um glossário nativo.
  const corpo = {
    text: textos,
    target_lang: targetLang.toUpperCase()
  };
  const contextoGlossario = montarContextoGlossario(textos, targetLang);
  if (contextoGlossario) corpo.context = contextoGlossario;

  const response = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(corpo)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Erro DeepL (${response.status}): ${JSON.stringify(data)}`);
  }

  return data.translations.map(item => item.text.toUpperCase());
}

const server = http.createServer((req, res) => {
  // Configuração do CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ROTA: Tradução Singular
  if (req.method === 'POST' && req.url === '/api/traduzir') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { textoPT, targetLang } = JSON.parse(body);

        let textoTraduzido;
        try {
          // Tenta via DeepL
          const resDeepL = await traduzirViaDeepL([textoPT], targetLang);
          textoTraduzido = resDeepL[0];
        } catch (apiError) {
          console.warn('Fallback ativado:', apiError.message);
          // Fallback seguro usando motor de regras local
          textoTraduzido = processarTraducaoLocal(textoPT, targetLang);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ traducao: textoTraduzido }));

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ROTA: Tradução em Massa
  if (req.method === 'POST' && req.url === '/api/traduzir-massa') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { textos, targetLang } = JSON.parse(body);

        let resultados;
        try {
          resultados = await traduzirViaDeepL(textos, targetLang);
        } catch (apiError) {
          console.warn('Fallback em massa ativado:', apiError.message);
          resultados = textos.map(t => processarTraducaoLocal(t, targetLang));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ traducoes: resultados }));

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Sugestões locais de grafia; não chama o DeepL nem altera o texto de origem.
  if (req.method === 'POST' && req.url === '/api/sugerir-correcoes') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { textos } = JSON.parse(body);
        if (!Array.isArray(textos) || textos.some(texto => typeof texto !== 'string')) {
          throw new Error('O campo textos precisa ser uma lista de strings.');
        }

        const sugestoes = textos.map(sugerirCorrecaoGrafia);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sugestoes }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Rota não encontrada');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Servidor seguro rodando na porta ${PORT}`);
});
