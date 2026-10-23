/**
 * server.js
 * Servidor HTTP usando variáveis de ambiente e padronização de respostas JSON.
 *
 * A validação de certificado TLS fica ligada. Na rede da empresa (inspeção TLS
 * pelo proxy), inicie com `npm start`, que passa `--use-system-ca` ao Node para
 * confiar no repositório de certificados do Windows, onde a CA do proxy está.
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  processarTraducaoLocal,
  montarContextoGlossario,
  agruparTextosPorContexto,
  listarCorrespondencias
} = require('./processadorTexto');
const { sugerirCorrecaoGrafia } = require('./correcoesOrtograficas');
const { indices } = require('./tabelaMestra');

const PORT = process.env.PORT || 3000;

// Espanhol da lista do setor (PT<TAB>EN<TAB>ES). A tabela mestra ainda não tem ES;
// a aba Glossário mostra o ES do setor quando o PT coincide. Primeira ocorrência vence.
function carregarEspanholDoSetor() {
  const caminho = path.join(__dirname, 'docs', 'glossario-setor-pt-en-es.tsv');
  const espanhol = new Map();
  try {
    for (const linha of fs.readFileSync(caminho, 'utf8').split(/\r?\n/)) {
      const [pt, , es] = linha.split('\t');
      if (pt && es && !espanhol.has(pt.trim())) espanhol.set(pt.trim(), es.trim());
    }
  } catch (erro) {
    console.warn('Lista PT/EN/ES do setor não encontrada; a coluna ES do glossário fica vazia.', erro.message);
  }
  return espanhol;
}

const espanholDoSetor = carregarEspanholDoSetor();

function montarGlossario() {
  return indices.map(indice => ({
    id: indice.id,
    nome: indice.nome,
    termos: indice.termos.map(termo => ({
      pt: termo.pt,
      en: termo.en,
      es: espanholDoSetor.get(termo.pt) || '',
      tipo: termo.tipo,
      contexto: termo.contexto || '',
      status: termo.status
    }))
  }));
}

function termosAplicados(textoPT, targetLang) {
  const vistos = new Set();
  return listarCorrespondencias(textoPT, targetLang)
    .map(item => ({ pt: item.termo.pt, en: item.termo.en }))
    .filter(par => !vistos.has(`${par.pt}|${par.en}`) && vistos.add(`${par.pt}|${par.en}`));
}
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Identifica automaticamente se a chave é do plano Free ou Pro
const DEEPL_URL = DEEPL_API_KEY && DEEPL_API_KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

async function traduzirViaDeepL(textos, targetLang, contextoEspecifico) {
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
  const contextoGlossario = contextoEspecifico ?? montarContextoGlossario(textos, targetLang);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

        // A resposta diz de onde veio a tradução: a interface precisa distinguir
        // o fallback local de uma tradução da DeepL.
        let resposta;
        try {
          const resDeepL = await traduzirViaDeepL([textoPT], targetLang);
          resposta = { traducao: resDeepL[0], origem: 'deepl' };
        } catch (apiError) {
          console.warn('Fallback ativado:', apiError.message);
          resposta = {
            traducao: processarTraducaoLocal(textoPT, targetLang),
            origem: 'local',
            erro: apiError.message
          };
        }
        resposta.termos = termosAplicados(textoPT, targetLang);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resposta));

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

        // O fallback é por grupo de contexto: uma falha da DeepL não derruba o lote
        // inteiro, e cada descrição informa de onde veio (deepl ou local).
        const resultados = new Array(textos.length);
        const origens = new Array(textos.length);
        const erros = [];
        const grupos = agruparTextosPorContexto(textos, targetLang);
        for (const grupo of grupos) {
          try {
            const traducoes = await traduzirViaDeepL(grupo.textos, targetLang, grupo.contexto);
            grupo.indices.forEach((indice, posicao) => {
              resultados[indice] = traducoes[posicao];
              origens[indice] = 'deepl';
            });
          } catch (apiError) {
            console.warn(`Fallback em massa ativado para ${grupo.textos.length} descrição(ões):`, apiError.message);
            erros.push(apiError.message);
            grupo.indices.forEach((indice, posicao) => {
              resultados[indice] = processarTraducaoLocal(grupo.textos[posicao], targetLang);
              origens[indice] = 'local';
            });
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ traducoes: resultados, origens, erros: [...new Set(erros)] }));

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ROTA: Glossário (somente leitura) para a aba de consulta.
  if (req.method === 'GET' && req.url === '/api/glossario') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ indices: montarGlossario() }));
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
