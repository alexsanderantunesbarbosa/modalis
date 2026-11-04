// MODALIS | Autor: Alexsander Antunes Barbosa | Software proprietário e confidencial (ver LICENSE).
/**
 * script.js
 * Interface, revisão de grafia, importação SAP e exportação MODALIS.
 * As regras da tabela em massa que não dependem da tela ficam em estadoMassa.js.
 */

const {
  LIMITE_CARACTERES, IDIOMAS, acimaDoLimite, textoContador, precisaTraduzir, linhaMarcada,
  podeConfirmar, confirmarTraducao, aplicarTraducaoAutomatica, registrarEdicao, limparTraducao,
  descreverSelo, problemaDaLinha, resumirMassa, textoFaixaMassa, formatarQuantidade,
  FILTROS_RAPIDOS, passaNoFiltro, contarFiltros, verificarExportacao
} = EstadoMassa;

// Código de idioma da API para cada coluna (o EN da planilha é o inglês americano).
const CODIGO_API = { EN: 'EN-US', ES: 'ES' };
// Coluna de cada idioma na tabela em massa (REFERÊNCIA, PT, CORREÇÃO, EN, ES).
const COLUNA_DO_IDIOMA = { EN: 3, ES: 4 };

let dadosProcessados = [];
let modoEdicao = false;
// Planilha em tradução: enquanto ela estiver na tela, a faixa mostra o progresso e o
// resumo volta no fim. Uma planilha importada no meio tem a faixa dela normalmente.
let itensEmTraducao = null;
// Problema da última tradução ({ texto, itens }): fica na faixa enquanto alguma dessas
// linhas ainda precisar de tradução.
let avisoTraducao = null;
// Filtro da barra "Mostrar:" (chave de FILTROS_RAPIDOS), somado aos filtros por coluna.
let filtroRapido = 'todas';

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.toggle('active', content.id === `tab-${tabName}`));
  if (tabName === 'glossario') carregarGlossario();
}

async function chamarApiTraduzir(textoPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textoPT, targetLang })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
  return data;
}

async function chamarApiTraduzirMassa(textosPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir-massa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textos: textosPT, targetLang })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
  return data;
}

// Campos da tela Individual de cada idioma.
const SAIDA_INDIVIDUAL = {
  EN: { campo: 'outputDescEN', status: 'singularStatus', contador: 'contadorEN' },
  ES: { campo: 'outputDescES', status: 'singularStatusES', contador: 'contadorES' }
};

function setSingularStatus(texto, alerta = false, idioma = 'EN') {
  const status = document.getElementById(SAIDA_INDIVIDUAL[idioma].status);
  if (!status) return;
  status.textContent = texto;
  status.classList.toggle('status-alerta', alerta);
}

function atualizarContador(texto, idioma = 'EN') {
  const contador = document.getElementById(SAIDA_INDIVIDUAL[idioma].contador);
  if (!contador) return;
  if (!texto) {
    contador.textContent = '';
    contador.classList.remove('estourou');
    return;
  }
  contador.textContent = `${texto.length} / ${LIMITE_CARACTERES} caracteres`;
  contador.classList.toggle('estourou', texto.length > LIMITE_CARACTERES);
}

// Um chip por termo: "CALÇA = PANTS · PANTALÓN". O ES vem casado pelo PT do termo.
function renderTermosAplicados(termosEN = [], termosES = []) {
  const caixa = document.getElementById('termosAplicados');
  if (!caixa) return;
  const lista = caixa.querySelector('.termos-lista');
  lista.replaceChildren();
  const espanhol = new Map(termosES.map(({ pt, es }) => [pt, es]));
  const pts = [...new Set([...termosEN.map(t => t.pt), ...termosES.map(t => t.pt)])];
  const ingles = new Map(termosEN.map(({ pt, en }) => [pt, en]));
  pts.forEach(pt => {
    const traducoes = [ingles.get(pt), espanhol.get(pt)].filter(Boolean);
    lista.appendChild(criarElemento('span', { textContent: `${pt} = ${traducoes.join(' · ')}` }));
  });
  caixa.querySelector('.termos-contagem').textContent = pts.length;
  caixa.hidden = pts.length === 0;
}

async function chamarApiSugerirCorrecoes(textos) {
  const response = await fetch('http://localhost:3000/api/sugerir-correcoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textos })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
  return data.sugestoes;
}

// Texto da linha de status de um resultado da API, e se ele pede atenção.
function descreverResultadoIndividual(resultado) {
  const descricoes = {
    tabela: ['Montada pela tabela mestra, sem chamar a DeepL.', false],
    'acima-de-40': [`Montada pela tabela, mas passou de ${LIMITE_CARACTERES} caracteres: ajuste à mão.`, true],
    deepl: [`Traduzida pela DeepL${resultado.motivo ? ` (${resultado.motivo})` : ''}; os termos do glossário foram conferidos.`, false],
    revisar: [`A revisar: ${resultado.motivo}${resultado.sugestaoTabela ? `. Sugestão da tabela: ${resultado.sugestaoTabela}` : ''}`, true]
  };
  return descricoes[resultado.estado] || [`Origem: ${resultado.origem}`, false];
}

// Inglês e espanhol saem juntos, em duas chamadas em paralelo; a falha de um não apaga o outro.
async function traduzirSingular() {
  const textoPT = document.getElementById('inputDescPT').value.trim().toUpperCase();
  if (!textoPT) return;

  for (const idioma of IDIOMAS) {
    document.getElementById(SAIDA_INDIVIDUAL[idioma].campo).value = 'Traduzindo...';
    setSingularStatus('', false, idioma);
    atualizarContador('', idioma);
  }
  renderTermosAplicados();

  const respostas = await Promise.allSettled(IDIOMAS.map(idioma => chamarApiTraduzir(textoPT, CODIGO_API[idioma])));
  const termos = {};
  const falhas = [];
  respostas.forEach((resposta, i) => {
    const idioma = IDIOMAS[i];
    const campo = document.getElementById(SAIDA_INDIVIDUAL[idioma].campo);
    if (resposta.status === 'rejected') {
      console.error(`Erro na tradução individual (${idioma}):`, resposta.reason);
      campo.value = '';
      falhas.push(`${idioma}: ${resposta.reason.message}`);
      return;
    }
    const resultado = resposta.value;
    campo.value = resultado.traducao;
    atualizarContador(resultado.traducao, idioma);
    termos[idioma] = resultado.termos || [];
    const [texto, alerta] = descreverResultadoIndividual(resultado);
    setSingularStatus(texto, alerta, idioma);
  });
  renderTermosAplicados(termos.EN, termos.ES);
  if (falhas.length) {
    avisar('Não foi possível traduzir', [
      'Verifique se o servidor do MODALIS está rodando (npm start).',
      ...falhas.map(falha => `Detalhe: ${falha}`)
    ]);
  }
}

function normalizarCabecalho(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function localizarColuna(cabecalhos, nomesAceitos) {
  const aceitos = new Set(nomesAceitos.map(normalizarCabecalho));
  return cabecalhos.findIndex(nome => aceitos.has(normalizarCabecalho(nome)));
}

function obterValor(row, index) {
  if (index < 0 || row[index] === undefined || row[index] === null) return '';
  return String(row[index]);
}

// tipo: '' (neutro), 'aviso' (bege: falta resolver ou houve problema) ou 'ok' (verde).
function setMassaStatus(texto, tipo = '') {
  const status = document.getElementById('massaStatus');
  if (!status) return;
  // Reescrever o mesmo texto faria o leitor de tela (aria-live) repetir a frase.
  if (status.textContent === texto && status.dataset.tipo === tipo) return;
  status.textContent = texto;
  status.dataset.tipo = tipo;
  status.classList.toggle('aviso', tipo === 'aviso');
  status.classList.toggle('ok', tipo === 'ok');
}

// A faixa é calculada a partir de dadosProcessados, por isso acompanha cada edição,
// confirmação e decisão de grafia. `prefixo` é o recado da ação que acabou de acontecer e
// some na próxima atualização. Durante a tradução, o progresso tem prioridade.
function atualizarFaixaMassa(prefixo = '') {
  if (itensEmTraducao === dadosProcessados) return;
  const aviso = avisoTraducao && avisoTraducao.itens.some(item => precisaTraduzir(item)) ? avisoTraducao.texto : '';
  const { texto, tipo } = textoFaixaMassa(resumirMassa(dadosProcessados), { prefixo, aviso });
  setMassaStatus(texto, tipo);
}

function normalizarValorFiltro(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function filtrarTabelaMassa() {
  const filtros = Array.from(document.querySelectorAll('#tableMassa .filtro-coluna'))
    .map(campo => ({ coluna: Number(campo.dataset.coluna), seletor: campo.tagName === 'SELECT', valor: campo.value }))
    .filter(filtro => filtro.valor);
  let visiveis = 0;

  document.querySelectorAll('#massaTableBody tr').forEach(linha => {
    const item = dadosProcessados[Number(linha.dataset.itemIndex)];
    const valores = Array.from(linha.cells).map(celula => celula.dataset.valorFiltro ?? celula.textContent);
    const corresponde = Boolean(item) && passaNoFiltro(item, filtroRapido) && filtros.every(filtro => filtro.seletor
      ? item.estadoCorrecao === filtro.valor
      : normalizarValorFiltro(valores[filtro.coluna]).includes(normalizarValorFiltro(filtro.valor)));
    linha.hidden = !corresponde;
    if (corresponde) visiveis += 1;
  });

  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
  const badge = document.getElementById('rowCountBadge');
  if (badge) badge.textContent = `· ${dadosProcessados.length} itens · ${pendentes} correções pendentes`;
  const rodape = document.getElementById('massaRodape');
  if (rodape) rodape.textContent = `Mostrando ${visiveis} de ${dadosProcessados.length} itens`;
}

function renderCorrecoesPendentes() {
  const container = document.getElementById('correcoesPendentes');
  if (!container) return;

  const pendentes = dadosProcessados
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.estadoCorrecao === 'pendente');
  container.replaceChildren();

  const botaoAplicar = document.getElementById('btnAplicarTodas');
  if (botaoAplicar) botaoAplicar.disabled = pendentes.length === 0;
  if (pendentes.length === 0) return;

  const titulo = document.createElement('h4');
  titulo.textContent = `Referências que precisam de correção (${pendentes.length})`;
  container.appendChild(titulo);

  const lista = document.createElement('div');
  lista.className = 'lista-refs-pendentes';
  pendentes.forEach(({ item, index }) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'ref-pendente';
    botao.textContent = item.ref || `Linha ${item.linhaOrigem}`;
    botao.title = `Ir para ${botao.textContent}`;
    botao.addEventListener('click', () => irParaLinhaDaTabela(index));
    lista.appendChild(botao);
  });
  container.appendChild(lista);
}

// Mostra a linha de uma referência: limpa os filtros (de coluna e rápido), rola até ela e a
// destaca por um instante, para o olho achar.
function irParaLinhaDaTabela(index) {
  document.querySelectorAll('#tableMassa .filtro-coluna').forEach(campo => { campo.value = ''; });
  filtroRapido = 'todas';
  renderFiltrosRapidos();
  filtrarTabelaMassa();
  const linha = document.querySelector(`#massaTableBody tr[data-item-index="${index}"]`);
  if (!linha) return;
  linha.scrollIntoView({ behavior: 'smooth', block: 'center' });
  linha.classList.remove('destacada');
  void linha.offsetWidth; // reinicia a animação se a mesma linha for chamada de novo
  linha.classList.add('destacada');
}

/* ==================== Filtros rápidos e referências a revisar ==================== */

// Contagens dos filtros e lista de refs a revisar acompanham cada redesenho da tabela; só
// aparecem depois que existe alguma tradução (antes disso, a revisão é a de grafia).
function atualizarPainelDeRevisao() {
  renderFiltrosRapidos();
  renderRefsRevisar();
}

// Os botões são criados uma vez e depois só atualizados (número, ativo, desabilitado). Se
// fossem recriados, um clique que começa quando a célula em edição perde o foco cairia num
// botão que já saiu da página, e o foco do teclado se perderia a cada atualização.
function renderFiltrosRapidos() {
  const barra = document.getElementById('filtrosRapidos');
  if (!barra) return;
  const contagens = contarFiltros(dadosProcessados);
  barra.hidden = !dadosProcessados.some(item => item.en || item.es);
  // Filtro que ficou vazio (a última linha "a revisar" foi resolvida) volta para "Todas";
  // durante a edição não, porque as linhas só são refiltradas ao salvar.
  if (!modoEdicao && filtroRapido !== 'todas' && !contagens[filtroRapido]) filtroRapido = 'todas';
  if (!barra.querySelector('.chip')) {
    barra.appendChild(criarElemento('span', { className: 'rotulo-filtros', textContent: 'Mostrar:' }));
    for (const { chave, rotulo } of FILTROS_RAPIDOS) {
      const chip = criarElemento('button', { type: 'button', className: `chip chip-${chave}` }, rotulo, criarElemento('b'));
      chip.dataset.chave = chave;
      chip.addEventListener('click', () => {
        filtroRapido = chave;
        renderFiltrosRapidos();
        filtrarTabelaMassa();
      });
      barra.appendChild(chip);
    }
  }
  for (const { chave, opcional } of FILTROS_RAPIDOS) {
    const chip = barra.querySelector(`.chip[data-chave="${chave}"]`);
    const total = contagens[chave];
    chip.querySelector('b').textContent = total.toLocaleString('pt-BR');
    chip.hidden = Boolean(opcional) && !total;
    chip.classList.toggle('ativo', chave === filtroRapido);
    chip.setAttribute('aria-pressed', String(chave === filtroRapido));
    chip.disabled = chave !== 'todas' && chave !== filtroRapido && !total;
  }
}

const NOME_DO_PROBLEMA = {
  revisar: 'a revisar', acima: `acima de ${LIMITE_CARACTERES}`, falhaDeepL: 'falha DeepL',
  semTraducao: 'sem tradução', ptAcima: `PT acima de ${LIMITE_CARACTERES}`
};
// Acima disso a lista vira ruído: os filtros rápidos mostram o restante.
const MAXIMO_REFS_A_REVISAR = 60;

// Item 9 da fila: referências com pendência de tradução, clicáveis até a linha, no mesmo
// formato da lista de correções de grafia (que cuida das pendências de grafia).
function renderRefsRevisar() {
  const container = document.getElementById('refsRevisar');
  if (!container) return;
  container.replaceChildren();
  // Durante a tradução, as linhas que só ainda não foram enviadas apareceriam como pendentes.
  if (itensEmTraducao === dadosProcessados || !dadosProcessados.some(item => item.en || item.es)) return;
  const pendentes = dadosProcessados
    .map((item, index) => ({ item, index, problema: problemaDaLinha(item) }))
    .filter(({ problema }) => problema && problema !== 'grafia');
  if (!pendentes.length) return;

  const lista = criarElemento('div', { className: 'lista-refs-pendentes' });
  for (const { item, index, problema } of pendentes.slice(0, MAXIMO_REFS_A_REVISAR)) {
    const referencia = item.ref || `Linha ${item.linhaOrigem}`;
    const botao = criarElemento('button', { type: 'button', className: 'ref-pendente', title: `Ir para ${referencia}` },
      referencia, criarElemento('small', { textContent: NOME_DO_PROBLEMA[problema] }));
    botao.addEventListener('click', () => irParaLinhaDaTabela(index));
    lista.appendChild(botao);
  }
  const resto = pendentes.length - MAXIMO_REFS_A_REVISAR;
  if (resto > 0) lista.appendChild(criarElemento('span', { className: 'refs-resto', textContent: `… e mais ${resto.toLocaleString('pt-BR')} (use os filtros acima)` }));
  container.append(criarElemento('h4', { textContent: `Referências que precisam de revisão (${pendentes.length.toLocaleString('pt-BR')})` }), lista);
}

async function processarArquivo(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(evt) {
    try {
      const workbook = XLSX.read(new Uint8Array(evt.target.result), { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      if (rows.length < 2) throw new Error('A primeira aba precisa ter cabeçalho e pelo menos uma linha de dados.');

      const cabecalhos = rows[0];
      const colunas = {
        referencia: localizarColuna(cabecalhos, ['Referencia', 'Referência', 'REF']),
        descricao: localizarColuna(cabecalhos, ['Descrição', 'Descricao PT', 'Descrição PT', 'PT-BR']),
        ecom: localizarColuna(cabecalhos, ['Z_META_ECOMM', 'TEXTO ECOM', 'ECOM']),
        compPT: localizarColuna(cabecalhos, ['Z_COMPOS_PT']),
        compEN: localizarColuna(cabecalhos, ['Z_COMPOS_EN']),
        compES: localizarColuna(cabecalhos, ['Z_COMPOS_ES'])
      };

      if (colunas.referencia < 0 || colunas.descricao < 0) {
        throw new Error('Não encontrei os cabeçalhos “Referencia” e “Descrição”. “Português” e “Z_ENCAIXE” não substituem a coluna Descrição.');
      }

      const linhas = rows.slice(1).map((row, index) => ({ row, index }))
        .filter(({ row }) => row.some(valor => String(valor ?? '').trim()));
      const sugestoes = await chamarApiSugerirCorrecoes(linhas.map(({ row }) => obterValor(row, colunas.descricao)));

      dadosProcessados = linhas.map(({ row, index }, suggestionIndex) => {
        const ptOriginal = obterValor(row, colunas.descricao);
        const sugestao = sugestoes[suggestionIndex] || { textoSugerido: ptOriginal, ocorrencias: [] };
        return {
          ref: obterValor(row, colunas.referencia),
          ptOriginal,
          pt: ptOriginal,
          ptSugerido: sugestao.textoSugerido,
          correcoesSugeridas: sugestao.ocorrencias,
          estadoCorrecao: sugestao.ocorrencias.length ? 'pendente' : 'sem-sugestao',
          en: '',
          es: '',
          origemEN: '', // 'tabela' | 'deepl' | 'local' | 'manual'
          estadoEN: '', // 'tabela' | 'deepl' | 'revisar' | 'acima-de-40'
          motivoEN: '',
          enAutomatico: '', // texto que a máquina entregou; base do "tinha X" depois de editar
          confirmadaEN: false, // linha marcada aprovada na revisão sem mudar o texto
          // O espanhol tem os mesmos controles, independentes dos do inglês.
          origemES: '',
          estadoES: '',
          motivoES: '',
          esAutomatico: '',
          confirmadaES: false,
          ecom: obterValor(row, colunas.ecom),
          compPT: obterValor(row, colunas.compPT),
          compEN: obterValor(row, colunas.compEN),
          compES: obterValor(row, colunas.compES),
          linhaOrigem: index + 2
        };
      });

      if (dadosProcessados.length === 0) {
        avisar('Planilha vazia', ['Nenhuma linha com referência ou descrição foi encontrada.']);
        return;
      }

      modoEdicao = false;
      avisoTraducao = null;
      filtroRapido = 'todas';
      document.getElementById('btnAlterar').classList.remove('btn-primary');
      document.getElementById('btnAlterar').classList.add('btn-default');
      document.getElementById('btnAlterar').textContent = 'Alterar / Editar';
      document.getElementById('massaArquivo').textContent = file.name;
      document.getElementById('uploadArea').style.display = 'none';
      renderTabelaMassa();

      const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
      setMassaStatus(pendentes
        ? `${pendentes} linha(s) têm sugestão de grafia. Revise e escolha aplicar ou manter o original antes de traduzir.`
        : 'Revise as descrições e clique em “Traduzir” quando estiver pronto.');
    } catch (error) {
      console.error('Erro ao ler planilha:', error);
      avisar('Não foi possível ler a planilha', [error.message]);
    }
  };

  reader.readAsArrayBuffer(file);
}

function aceitarCorrecao(index) {
  const item = dadosProcessados[index];
  if (!item) return;
  item.pt = item.ptSugerido;
  item.estadoCorrecao = 'aceita';
  limparTraducao(item);
  renderTabelaMassa();
  atualizarFaixaMassa();
}

function manterOriginal(index) {
  const item = dadosProcessados[index];
  if (!item) return;
  item.pt = item.ptOriginal;
  item.estadoCorrecao = 'recusada';
  limparTraducao(item);
  renderTabelaMassa();
  atualizarFaixaMassa();
}

// Tira a marca de uma tradução "a revisar" ou "DeepL falhou" que está certa.
function confirmarLinha(index, idioma) {
  const item = dadosProcessados[index];
  if (!item || !confirmarTraducao(item, idioma)) return;
  renderTabelaMassa();
  atualizarFaixaMassa();
}

function criarCelula(valor, classe = '') {
  const td = document.createElement('td');
  td.textContent = valor;
  if (classe) td.className = classe;
  return td;
}

function criarBotaoPequeno(rotulo, classe, acao) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn-small ${classe}`;
  button.textContent = rotulo;
  button.addEventListener('click', acao);
  return button;
}

// Elemento com propriedades e filhos (texto ou elementos). Texto entra sempre como texto,
// nunca como HTML: o que vem da planilha ou da DeepL não vira código na página.
function criarElemento(tag, propriedades = {}, ...filhos) {
  const elemento = Object.assign(document.createElement(tag), propriedades);
  elemento.append(...filhos);
  return elemento;
}

/* ==================== Janelas (no estilo das janelas do START) ==================== */

let janelasCriadas = 0;
// Janelas abertas, da de baixo para a de cima: só a do topo responde ao teclado.
const pilhaDeJanelas = [];
// Clique no fundo logo depois de abrir é o 2º clique de um duplo clique, não "fechar".
const ESPERA_CLIQUE_FORA_MS = 400;

// Abre uma janela por cima da página e devolve uma promessa com o `valor` do botão
// clicado, ou null se ela for fechada pelo ×, pelo Esc ou por um clique fora (este, só se
// `fecharAoClicarFora`). Substitui o alert/confirm do navegador, que foge do visual e
// mostra "file://" no título. Diferente do confirm, a página NÃO para enquanto ela está
// aberta: quem usa o resultado precisa conferir de novo os dados depois do await.
// `conteudo` pode ser uma lista de elementos ou uma função que recebe `fechar`.
function abrirJanela({ titulo, conteudo = [], botoes = [{ rotulo: 'Fechar', valor: null, classe: 'btn-default' }], fecharAoClicarFora = true }) {
  return new Promise(resolver => {
    const focoAnterior = document.activeElement;
    const idTitulo = `janela-titulo-${++janelasCriadas}`;
    const fundo = criarElemento('div', { className: 'janela-fundo' });
    const janela = criarElemento('div', { className: 'janela' });
    janela.setAttribute('role', 'dialog');
    janela.setAttribute('aria-modal', 'true');
    janela.setAttribute('aria-labelledby', idTitulo);
    const abertaEm = performance.now();

    let aberta = true;
    const fechar = (valor = null) => {
      if (!aberta) return;
      aberta = false;
      document.removeEventListener('keydown', teclado, true);
      pilhaDeJanelas.splice(pilhaDeJanelas.indexOf(fundo), 1);
      fundo.remove();
      if (focoAnterior?.isConnected) focoAnterior.focus();
      resolver(valor);
    };
    // Esc fecha; Tab circula só entre os botões e campos da janela (foco preso nela).
    const teclado = event => {
      if (pilhaDeJanelas[pilhaDeJanelas.length - 1] !== fundo) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        fechar(null);
      } else if (event.key === 'Tab') {
        const focaveis = [...janela.querySelectorAll('button, [href], input, select, textarea')].filter(el => !el.disabled);
        if (!focaveis.length) return;
        const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
        if (!janela.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? ultimo : primeiro).focus(); }
        else if (event.shiftKey && document.activeElement === primeiro) { event.preventDefault(); ultimo.focus(); }
        else if (!event.shiftKey && document.activeElement === ultimo) { event.preventDefault(); primeiro.focus(); }
      }
    };

    const botaoX = criarElemento('button', { type: 'button', className: 'janela-fechar', title: 'Fechar', textContent: '×' });
    botaoX.setAttribute('aria-label', 'Fechar');
    botaoX.addEventListener('click', () => fechar(null));
    const corpo = criarElemento('div', { className: 'janela-corpo' }, ...(typeof conteudo === 'function' ? conteudo(fechar) : conteudo));
    const rodape = criarElemento('div', { className: 'janela-rodape' });
    let botaoPrincipal = null;
    for (const { rotulo, valor = null, classe = 'btn-default', principal = false } of botoes) {
      const botao = criarElemento('button', { type: 'button', className: `btn ${classe}`, textContent: rotulo });
      botao.addEventListener('click', () => fechar(valor));
      rodape.appendChild(botao);
      if (principal || !botaoPrincipal) botaoPrincipal = botao;
    }
    janela.append(
      criarElemento('div', { className: 'janela-cabecalho' }, criarElemento('h4', { id: idTitulo, textContent: titulo }), botaoX),
      corpo, rodape);
    fundo.appendChild(janela);
    fundo.addEventListener('mousedown', event => {
      if (fecharAoClicarFora && event.target === fundo && performance.now() - abertaEm > ESPERA_CLIQUE_FORA_MS) fechar(null);
    });
    document.addEventListener('keydown', teclado, true);
    pilhaDeJanelas.push(fundo);
    document.body.appendChild(fundo);
    botaoPrincipal?.focus();
  });
}

// Mensagem simples (substitui o alert): cada item de `paragrafos` vira um parágrafo.
function avisar(titulo, paragrafos) {
  return abrirJanela({ titulo, conteudo: paragrafos.map(texto => criarElemento('p', { textContent: texto })) });
}

// Pergunta sim/não (substitui o confirm); resolve true só no botão de confirmar. Decisão
// pede escolha explícita: clique fora não fecha (Esc e × continuam valendo como "não").
async function confirmar({ titulo, conteudo, rotuloConfirmar, rotuloCancelar = 'Cancelar' }) {
  const resposta = await abrirJanela({
    titulo,
    conteudo,
    fecharAoClicarFora: false,
    botoes: [
      { rotulo: rotuloCancelar, valor: false, classe: 'btn-default' },
      { rotulo: rotuloConfirmar, valor: true, classe: 'btn-primary', principal: true }
    ]
  });
  return resposta === true;
}

function tabelaDaJanela(cabecalhos, linhas) {
  return criarElemento('table', { className: 'janela-tabela' },
    criarElemento('thead', {}, criarElemento('tr', {}, ...cabecalhos.map(texto => criarElemento('th', { textContent: texto })))),
    criarElemento('tbody', {}, ...linhas));
}

// Duas células "como está" / "como fica" com as palavras trocadas em destaque. Compara
// por contagem de palavras (não por posição), então também marca a palavra repetida
// que a correção removeu ("SAIA SAIA JEANS" → "SAIA JEANS"). O(a + b) palavras.
function celulasDaTroca(antes, depois) {
  const marcar = (palavras, outras, tag) => {
    const restantes = new Map();
    for (const palavra of outras) restantes.set(palavra, (restantes.get(palavra) || 0) + 1);
    const partes = [];
    palavras.forEach((palavra, i) => {
      if (i) partes.push(' ');
      if (restantes.get(palavra)) {
        restantes.set(palavra, restantes.get(palavra) - 1);
        partes.push(palavra);
      } else {
        partes.push(criarElemento(tag, { textContent: palavra }));
      }
    });
    return partes;
  };
  const a = antes.split(/\s+/).filter(Boolean);
  const d = depois.split(/\s+/).filter(Boolean);
  return [
    criarElemento('td', { className: 'troca-antes' }, ...marcar(a, d, 's')),
    criarElemento('td', { className: 'troca-depois' }, ...marcar(d, a, 'b'))
  ];
}

function renderTabelaMassa() {
  const tbody = document.getElementById('massaTableBody');
  tbody.replaceChildren();

  dadosProcessados.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.dataset.itemIndex = index;
    if (item.estadoCorrecao === 'pendente') tr.classList.add('pendente');
    tr.appendChild(criarCelula(item.ref));
    tr.appendChild(criarCelula(item.ptOriginal));

    const celulaCorrecao = document.createElement('td');
    const temCorrecao = item.correcoesSugeridas.length > 0;
    const textoCorrigido = !temCorrecao
      ? ''
      : item.estadoCorrecao === 'aceita'
        ? item.pt
        : item.estadoCorrecao === 'pendente'
          ? item.ptSugerido
          : '';
    const texto = document.createElement('div');
    texto.className = 'texto-correcao';
    texto.textContent = textoCorrigido;
    celulaCorrecao.dataset.valorFiltro = textoCorrigido;
    celulaCorrecao.appendChild(texto);

    if (item.estadoCorrecao === 'pendente') {
      const acoes = document.createElement('div');
      acoes.className = 'acoes-correcao';
      acoes.appendChild(criarBotaoPequeno('Aplicar', 'btn-primary', () => aceitarCorrecao(index)));
      acoes.appendChild(criarBotaoPequeno('Manter original', 'btn-default', () => manterOriginal(index)));
      celulaCorrecao.appendChild(acoes);
      const detalhe = document.createElement('small');
      detalhe.textContent = `Candidata(s): ${item.correcoesSugeridas.join(', ')}`;
      celulaCorrecao.appendChild(detalhe);
    } else if (item.estadoCorrecao === 'aceita') {
      const selo = document.createElement('small');
      selo.textContent = 'Correção aceita';
      celulaCorrecao.appendChild(selo);
    }
    tr.appendChild(celulaCorrecao);

    for (const idioma of IDIOMAS) tr.appendChild(celulaDeTraducao(item, index, idioma));
    tbody.appendChild(tr);
  });

  renderCorrecoesPendentes();
  atualizarPainelDeRevisao();
  document.getElementById('resultMassaCard').style.display = 'block';
  filtrarTabelaMassa();
  atualizarBotaoTraduzir();
}

// Célula EN ou ES: texto, contador, selo de origem e o botão Confirmar; no modo de edição,
// só o texto editável (o selo voltaria para dentro do texto salvo).
function celulaDeTraducao(item, index, idioma) {
  const texto = idioma === 'ES' ? item.es : item.en;
  const celula = criarCelula(texto);
  aplicarContador(celula, texto);
  gravarFiltro(celula, item, idioma);
  if (modoEdicao) {
    celula.contentEditable = 'true';
    celula.classList.add('celula-editavel');
    return celula;
  }
  const selo = descreverSelo(item, idioma);
  if (selo) celula.appendChild(criarElemento('small', { className: selo.classe, textContent: selo.texto }));
  if (podeConfirmar(item, idioma)) {
    const botao = criarBotaoPequeno('Confirmar', 'btn-default', () => confirmarLinha(index, idioma));
    botao.title = 'A tradução está certa: tira a marca sem mudar o texto';
    celula.appendChild(criarElemento('div', { className: 'acoes-correcao' }, botao));
  }
  return celula;
}

// Contador "38/40" no canto da célula, desenhado pelo CSS (::after) a partir do atributo
// data-contador. Conteúdo gerado pelo CSS não faz parte do texto da célula, então não vai
// para o salvamento, o filtro nem a cópia.
function aplicarContador(celula, texto) {
  const contador = textoContador(texto);
  if (contador) celula.dataset.contador = contador;
  else delete celula.dataset.contador;
  celula.toggleAttribute('data-estourou', acimaDoLimite(texto));
}

// O filtro das colunas EN e ES procura no texto e no selo ("ACIMA", "A REVISAR", "EDITADO"),
// também no modo de edição, quando o selo não aparece: sem isso, filtrar "ACIMA" e clicar
// em Alterar esconderia todas as linhas.
function gravarFiltro(celula, item, idioma) {
  const selo = descreverSelo(item, idioma);
  if (selo) celula.dataset.valorFiltro = `${idioma === 'ES' ? item.es : item.en} ${selo.texto}`;
  else delete celula.dataset.valorFiltro;
}

function atualizarBotaoTraduzir() {
  const btn = document.getElementById('btnTraduzirMassa');
  if (!btn) return;
  const pendentes = dadosProcessados.filter(item => precisaTraduzir(item)).length;
  const traduzidas = dadosProcessados.length - pendentes;
  btn.textContent = traduzidas && pendentes ? `Traduzir pendentes (${pendentes})` : 'Traduzir';
}

async function aplicarTodasCorrecoes() {
  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente');
  if (!pendentes.length) return;

  // A coluna DESCRIÇÃO exportada é gravada no SAP pela transação da TI: aplicar em
  // lote é uma escrita em massa no sistema de registro, por isso pede confirmação.
  const rotulo = formatarQuantidade(pendentes.length, 'correção', 'correções');
  const confirmado = await confirmar({
    titulo: `Aplicar ${rotulo} de grafia?`,
    conteudo: [
      criarElemento('div', { className: 'janela-alerta', textContent: 'Elas entram na coluna DESCRIÇÃO exportada e, pela transação, no SAP.' }),
      tabelaDaJanela(['Referência', 'Como está', 'Como fica'], pendentes.map(item => criarElemento('tr', {},
        criarCelula(item.ref || `linha ${item.linhaOrigem}`), ...celulasDaTroca(item.ptOriginal, item.ptSugerido))))
    ],
    rotuloConfirmar: `Aplicar ${rotulo}`
  });
  if (!confirmado) return;
  // A planilha pode ter mudado enquanto a janela estava aberta: só aplica nas que seguem pendentes.
  const aindaPendentes = pendentes.filter(item => dadosProcessados.includes(item) && item.estadoCorrecao === 'pendente');
  if (!aindaPendentes.length) return;

  aindaPendentes.forEach(item => {
    item.pt = item.ptSugerido;
    item.estadoCorrecao = 'aceita';
    limparTraducao(item);
  });

  renderTabelaMassa();
  atualizarFaixaMassa(aindaPendentes.length === 1 ? '1 correção aplicada.' : `${aindaPendentes.length} correções aplicadas.`);
}

// Descrições distintas enviadas por requisição na tradução em massa. Partes menores dão
// progresso na tela e limitam o que se perde se uma requisição falhar no meio.
const TAMANHO_PARTE = 100;

async function traduzirMassa() {
  if (!dadosProcessados.length) return;
  // Com a edição aberta, primeiro salva o que foi digitado (vira 'manual' e não é reenviado).
  if (modoEdicao) toggleModoEdicao();
  if (dadosProcessados.some(item => item.estadoCorrecao === 'pendente')) {
    avisar('Falta decidir a grafia', ['Decida cada sugestão de grafia (Aplicar ou Manter original) antes de enviar as descrições para tradução.']);
    return;
  }

  const semDescricao = dadosProcessados.filter(item => !item.pt.trim());
  if (semDescricao.length) {
    avisar('Há linhas sem descrição', ['Preencha ou remova essas linhas na planilha de origem antes de traduzir.']);
    return;
  }

  // Só o que está pendente vai para a API, idioma por idioma: textos já traduzidos, editados
  // à mão ou confirmados ficam. `itens` é capturado antes do await: se outra planilha for
  // importada durante a espera, a resposta pertence à planilha antiga e é descartada.
  const itens = dadosProcessados;
  const alvos = itens.filter(item => precisaTraduzir(item));
  if (!alvos.length) {
    atualizarFaixaMassa('Nenhuma linha para enviar à tradução.');
    return;
  }

  const btn = document.getElementById('btnTraduzirMassa');
  const btnImportar = document.getElementById('btnImportar');
  const btnAlterar = document.getElementById('btnAlterar');
  btn.disabled = true;
  if (btnImportar) btnImportar.disabled = true;
  if (btnAlterar) btnAlterar.disabled = true;
  itensEmTraducao = itens;
  avisoTraducao = null;
  let prefixo = '';
  // Descrições iguais vão uma vez só, em partes de TAMANHO_PARTE, com progresso na tela. Em
  // cada parte, inglês e espanhol saem em paralelo, cada um só com as descrições que ainda
  // precisam dele. O que já voltou fica gravado mesmo que uma parte falhe no meio.
  const porChave = new Map();
  for (const item of alvos) {
    const chave = item.pt.trim().toUpperCase();
    if (!porChave.has(chave)) porChave.set(chave, []);
    porChave.get(chave).push(item);
  }
  const chaves = Array.from(porChave.keys());
  const totalPartes = Math.ceil(chaves.length / TAMANHO_PARTE);
  setMassaStatus(`Enviando ${chaves.length} descrições distintas (${alvos.length} linhas) em ${totalPartes} parte(s), em inglês e espanhol...`);
  try {
    const errosVistos = [];
    let feitas = 0;
    let enviadas = 0; // traduções (linha × idioma) gravadas nesta rodada
    let falhas = 0; // dessas, as que voltaram do motor local
    let interrompido = '';
    for (let inicio = 0; inicio < chaves.length; inicio += TAMANHO_PARTE) {
      const parte = chaves.slice(inicio, inicio + TAMANHO_PARTE);
      const pedidos = IDIOMAS.map(idioma => {
        const chavesDoIdioma = parte.filter(chave => porChave.get(chave).some(item => precisaTraduzir(item, idioma)));
        if (!chavesDoIdioma.length) return null;
        return chamarApiTraduzirMassa(chavesDoIdioma.map(chave => porChave.get(chave)[0].pt), CODIGO_API[idioma])
          .then(resposta => ({ idioma, chavesDoIdioma, resposta }), erro => { throw Object.assign(erro, { idioma }); });
      }).filter(Boolean);
      // allSettled: se um idioma falhar, o que o outro já trouxe é gravado antes de parar.
      const resultados = await Promise.allSettled(pedidos);
      if (dadosProcessados !== itens) {
        atualizarFaixaMassa('Outra planilha foi importada durante a tradução; o resultado da anterior foi descartado.');
        return;
      }
      const respostas = resultados.filter(r => r.status === 'fulfilled').map(r => r.value);
      const rejeicoes = resultados.filter(r => r.status === 'rejected').map(r => r.reason);
      for (const { idioma, chavesDoIdioma, resposta } of respostas) {
        const { traducoes, origens = [], estados = [], motivos = [], erros = [] } = resposta;
        chavesDoIdioma.forEach((chave, j) => porChave.get(chave).forEach(item => {
          if (!precisaTraduzir(item, idioma)) return; // confirmada durante a espera
          aplicarTraducaoAutomatica(item, { traducao: traducoes[j], origem: origens[j], estado: estados[j], motivo: motivos[j] }, idioma);
          enviadas += 1;
          if (origens[j] === 'local') falhas += 1;
        }));
        erros.forEach(erro => { if (!errosVistos.includes(erro)) errosVistos.push(erro); });
        // DeepL suspensa (limite de taxa ou indisponível): parar de enviar; o restante fica
        // pendente para "Traduzir pendentes" daqui a alguns minutos.
        const remotas = origens.filter(origem => origem !== 'tabela');
        if (remotas.length && remotas.every(origem => origem === 'local') && erros.some(erro => /suspensas|limitando/.test(erro))) {
          interrompido = erros.find(erro => /suspensas|limitando/.test(erro));
        }
      }
      feitas += parte.length;
      renderTabelaMassa();
      // Falha de um idioma (servidor fora, erro 500) para a tradução, como antes do espanhol:
      // o que voltou já está gravado e o restante fica para "Traduzir pendentes".
      if (rejeicoes.length) {
        const erro = new Error(rejeicoes.map(r => `${r.idioma}: ${semPontoFinal(r.message)}`).join(' | '));
        throw erro;
      }
      if (interrompido) break;
      setMassaStatus(`Traduzidas ${feitas} de ${chaves.length} descrições distintas (parte ${Math.ceil(feitas / TAMANHO_PARTE)} de ${totalPartes})...`);
    }

    // O balanço da faixa vem de resumirMassa (planilha inteira); aqui fica só o recado da
    // rodada. Um problema fica preso às linhas que ele deixou pendentes.
    const pendentes = alvos.filter(item => precisaTraduzir(item));
    if (interrompido) {
      avisoTraducao = { texto: `Tradução interrompida: ${semPontoFinal(interrompido)}.`, itens: pendentes };
    } else if (falhas) {
      const marcadas = falhas === 1 ? 'ela foi montada pela tabela e está marcada' : 'elas foram montadas pela tabela e estão marcadas';
      const motivo = errosVistos.length ? ` Motivo: ${semPontoFinal(errosVistos.join(' | '))}.` : '';
      avisoTraducao = {
        texto: `A DeepL falhou em ${falhas.toLocaleString('pt-BR')} de ${formatarQuantidade(enviadas, 'tradução enviada', 'traduções enviadas')} (EN e ES); ${marcadas}.${motivo}`,
        itens: pendentes
      };
    } else {
      const repetidas = alvos.length - chaves.length;
      const aproveitadas = repetidas ? `, ${formatarQuantidade(repetidas, 'repetida aproveitada', 'repetidas aproveitadas')}` : '';
      prefixo = `Tradução concluída (${formatarQuantidade(chaves.length, 'descrição distinta', 'descrições distintas')}${aproveitadas}).`;
    }
    renderTabelaMassa();
  } catch (error) {
    console.error('Erro ao traduzir planilha:', error);
    avisar('A tradução não foi concluída', [
      `Detalhe: ${error.message}`,
      'O que já voltou ficou gravado; o restante segue pendente para "Traduzir pendentes".'
    ]);
    if (dadosProcessados === itens) {
      avisoTraducao = { texto: `A tradução não foi concluída: ${semPontoFinal(error.message)}.`, itens: alvos.filter(item => precisaTraduzir(item)) };
    }
  } finally {
    itensEmTraducao = null;
    btn.disabled = false;
    if (btnImportar) btnImportar.disabled = false;
    if (btnAlterar) btnAlterar.disabled = false;
    // Planilha trocada no meio: a mensagem de descarte fica.
    if (dadosProcessados === itens) {
      atualizarFaixaMassa(prefixo);
      atualizarPainelDeRevisao(); // a lista de refs fica escondida durante a tradução
    }
    atualizarBotaoTraduzir();
  }
}

// Tira o ponto final de uma mensagem que vai ganhar outro no fim da frase.
function semPontoFinal(texto) {
  return String(texto).trim().replace(/\.+$/, '');
}

function toggleModoEdicao() {
  if (modoEdicao) atualizarDadosAposEdicao();
  modoEdicao = !modoEdicao;
  const btn = document.getElementById('btnAlterar');
  if (modoEdicao) {
    btn.classList.remove('btn-default');
    btn.classList.add('btn-primary');
    btn.textContent = 'Salvar alterações';
  } else {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-default');
    btn.textContent = 'Alterar / Editar';
  }
  renderTabelaMassa();
  if (!modoEdicao) atualizarFaixaMassa();
}

function atualizarDadosAposEdicao() {
  document.querySelectorAll('#massaTableBody tr').forEach(salvarLinhaEmEdicao);
}

// Grava EN e ES de uma linha da tabela em edição; devolve true se algo mudou. Lê
// textContent, e não innerText, porque innerText força o layout da tabela inteira; o Enter
// e a colagem já chegam à célula como texto de uma linha (ver os eventos no fim do arquivo).
function salvarLinhaEmEdicao(tr) {
  const item = dadosProcessados[Number(tr.dataset.itemIndex)];
  if (!item) return false;
  let mudou = false;
  for (const idioma of IDIOMAS) {
    const celula = tr.cells[COLUNA_DO_IDIOMA[idioma]];
    if (registrarEdicao(item, celula.textContent, idioma)) {
      gravarFiltro(celula, item, idioma);
      mudou = true;
    }
  }
  return mudou;
}

async function baixarExcel() {
  if (!dadosProcessados.length) return;
  if (itensEmTraducao === dadosProcessados) {
    avisar('Tradução em andamento', ['Espere a tradução terminar para baixar o Excel: as linhas ainda estão mudando.']);
    return;
  }
  if (modoEdicao) {
    atualizarDadosAposEdicao();
    atualizarFaixaMassa();
    atualizarPainelDeRevisao();
  }

  // A janela não congela a página: guarda a planilha e a lista mostrada para conferir de novo
  // depois da resposta (outra planilha importada, linha que mudou enquanto ela estava aberta).
  const itens = dadosProcessados;
  // O bloqueio vem antes da pergunta: não adianta confirmar a exportação e depois ser barrado.
  const { bloqueios, marcadas } = verificarExportacao(itens);
  if (bloqueios.length) {
    await abrirJanela({
      titulo: 'Download bloqueado',
      conteudo: fechar => [
        criarElemento('p', { textContent: `${formatarQuantidade(new Set(bloqueios.map(b => b.item)).size, 'linha impede', 'linhas impedem')} a planilha de subir ao SAP. Resolva e baixe de novo:` }),
        tabelaDaJanela(['Referência', 'Problema', 'Texto', ''], bloqueios.map(({ item, referencia, problema, texto }) => criarElemento('tr', {},
          criarCelula(referencia), criarCelula(problema), criarCelula(texto || '—'),
          criarElemento('td', {}, criarBotaoPequeno('Ir para a linha', 'btn-default', () => { fechar(); irParaLinhaDaTabela(dadosProcessados.indexOf(item)); })))))
      ]
    });
    return;
  }

  // Exportar linhas marcadas (a revisar ou DeepL falhou) sem confirmá-las é uma decisão consciente.
  if (marcadas.length) {
    const uma = marcadas.length === 1;
    const textosMostrados = marcadas.map(item => `${item.en}|${item.es}`);
    // Uma linha da janela por idioma marcado: a mesma linha pode estar marcada em EN e em ES.
    const linhasDaJanela = marcadas.flatMap(item => IDIOMAS.filter(idioma => linhaMarcada(item, idioma)).map(idioma => criarElemento('tr', {},
      criarCelula(item.ref || `linha ${item.linhaOrigem}`), criarCelula(idioma),
      criarCelula(descreverSelo(item, idioma)?.texto || ''), criarCelula(idioma === 'ES' ? item.es : item.en))));
    const exportar = await confirmar({
      titulo: 'Exportar com linhas marcadas?',
      conteudo: [
        criarElemento('p', { textContent: uma
          ? '1 linha está marcada para revisão e não foi confirmada nem editada. Ela vai para o SAP como está.'
          : `${marcadas.length.toLocaleString('pt-BR')} linhas estão marcadas para revisão e não foram confirmadas nem editadas. Elas vão para o SAP como estão.` }),
        tabelaDaJanela(['Referência', 'Idioma', 'Marca', 'Descrição'], linhasDaJanela)
      ],
      rotuloCancelar: 'Revisar antes',
      rotuloConfirmar: 'Exportar mesmo assim'
    });
    if (!exportar) return;
    // Só exporta se nada mudou desde a janela: mesma planilha, nenhum bloqueio novo e as
    // mesmas linhas marcadas, com o mesmo texto que a pessoa viu.
    const agora = verificarExportacao(itens);
    const mudou = dadosProcessados !== itens || itensEmTraducao === itens || agora.bloqueios.length
      || agora.marcadas.length !== marcadas.length || agora.marcadas.some((item, i) => item !== marcadas[i] || `${item.en}|${item.es}` !== textosMostrados[i]);
    if (mudou) {
      avisar('A planilha mudou', ['As linhas mudaram enquanto a janela estava aberta. Confira e clique em Baixar Excel de novo.']);
      return;
    }
  }

  const ws = XLSX.utils.json_to_sheet(itens.map(item => ({
    'REFERÊNCIA': item.ref,
    'DESCRIÇÃO': item.pt,
    'Descrição EN': item.en,
    'Descrição ES': item.es,
    // Decisão de 23/10/2026: o texto do e-commerce é a própria descrição (sem limite
    // de 40). Quando quiserem o texto completo do START, basta trocar a origem aqui.
    'TEXTO ECOM': item.pt,
    'Z_COMPOS_PT': item.compPT,
    'Z_COMPOS_EN': item.compEN,
    'Z_COMPOS_ES': item.compES
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Traduções');
  XLSX.writeFile(wb, 'MODALIS_Descricoes.xlsx');
}

// Recado só para leitor de tela (o alert antigo era anunciado; o título do botão não é).
function anunciarParaLeitorDeTela(texto) {
  let regiao = document.getElementById('anuncioLeitor');
  if (!regiao) {
    regiao = criarElemento('div', { id: 'anuncioLeitor', className: 'so-leitor' });
    regiao.setAttribute('aria-live', 'polite');
    document.body.appendChild(regiao);
  }
  regiao.textContent = '';
  setTimeout(() => { regiao.textContent = texto; }, 50); // texto novo, para ser anunciado de novo
}

// O retorno da cópia aparece no próprio botão por um instante: uma janela para isso
// interromperia o trabalho sem necessidade.
async function copiarTexto(elementId) {
  const input = document.getElementById(elementId);
  if (!input || !input.value) return;
  const botao = input.parentElement?.querySelector('.btn-addon');
  try {
    await navigator.clipboard.writeText(input.value);
  } catch (error) {
    avisar('Não foi possível copiar', [`Selecione o texto e use Ctrl+C. Detalhe: ${error.message}`]);
    return;
  }
  anunciarParaLeitorDeTela('Texto copiado.');
  if (!botao) return;
  const tituloOriginal = botao.dataset.tituloOriginal || botao.title;
  botao.dataset.tituloOriginal = tituloOriginal;
  botao.classList.add('copiado');
  botao.title = 'Copiado!';
  clearTimeout(botao.temporizador);
  botao.temporizador = setTimeout(() => {
    botao.classList.remove('copiado');
    botao.title = tituloOriginal;
  }, 1500);
}

document.querySelectorAll('#tableMassa .filtro-coluna').forEach(campo => {
  campo.addEventListener(campo.tagName === 'SELECT' ? 'change' : 'input', filtrarTabelaMassa);
});

/* ==================== Edição na tabela em massa ==================== */

// Eventos delegados no tbody, que nunca é recriado (renderTabelaMassa só troca as linhas).
const corpoTabelaMassa = document.getElementById('massaTableBody');

// Contador ao vivo enquanto digita: só a célula, sem redesenhar a tabela (O(L) por tecla).
corpoTabelaMassa.addEventListener('input', event => {
  const celula = celulaEmEdicao(event);
  if (celula) aplicarContador(celula, celula.textContent);
});

// Ao sair da célula a linha é gravada, e a faixa e os números dos filtros acompanham a
// edição. As linhas não somem do filtro e a lista de refs não é refeita no meio da edição
// (seus botões recriados engoliriam o clique que tirou o foco da célula); ambos se
// atualizam ao salvar.
corpoTabelaMassa.addEventListener('focusout', event => {
  const celula = celulaEmEdicao(event);
  if (celula && salvarLinhaEmEdicao(celula.parentElement)) {
    atualizarDepoisDoClique(() => {
      atualizarFaixaMassa();
      renderFiltrosRapidos();
    });
  }
});

// A célula perde o foco no "apertar" do mouse. Se a faixa mudar de altura nesse instante,
// o botão clicado logo abaixo dela (filtro, referência) sai de baixo do cursor antes do
// "soltar" e o clique se perde. Com o mouse pressionado, o redesenho espera o clique
// terminar; os dados já foram gravados.
let mousePressionado = false;
let atualizacaoAdiada = null;
function atualizarDepoisDoClique(atualizar) {
  if (mousePressionado) atualizacaoAdiada = atualizar;
  else atualizar();
}
function soltarMouse() {
  mousePressionado = false;
  const atualizar = atualizacaoAdiada;
  atualizacaoAdiada = null;
  if (atualizar) setTimeout(atualizar, 0); // depois do click, que vem logo após o pointerup
}
document.addEventListener('pointerdown', () => { mousePressionado = true; }, true);
document.addEventListener('pointerup', soltarMouse, true);
document.addEventListener('pointercancel', soltarMouse, true);

// A faixa de status fica presa no topo e o focus() do navegador não a desconta: uma célula
// que recebe o foco por baixo dela (Shift+Enter, Tab) é rolada até aparecer.
corpoTabelaMassa.addEventListener('focusin', event => {
  const celula = celulaEmEdicao(event);
  if (celula) manterVisivelAbaixoDaFaixa(celula);
});

// Enter confirma e desce para a mesma coluna da próxima linha visível (Shift+Enter sobe),
// como no Excel. O campo do SAP tem uma linha só: a célula nunca recebe quebra de linha.
corpoTabelaMassa.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.isComposing) return;
  const celula = celulaEmEdicao(event);
  if (!celula) return;
  event.preventDefault();
  irParaLinhaVizinha(celula, event.shiftKey ? -1 : 1);
});

// Colar entra como texto simples de uma linha: sem HTML e sem as quebras que vêm do Excel.
corpoTabelaMassa.addEventListener('paste', event => {
  if (!celulaEmEdicao(event)) return;
  event.preventDefault();
  const texto = (event.clipboardData?.getData('text/plain') || '').replace(/\s+/g, ' ');
  document.execCommand('insertText', false, texto);
});

// Arrastar conteúdo para a célula traria HTML; a edição é só por teclado e colagem.
corpoTabelaMassa.addEventListener('drop', event => {
  if (celulaEmEdicao(event)) event.preventDefault();
});

// Célula editável da tabela atual. Fora do modo de edição, ou com a célula já fora da tela
// (tabela redesenhada, planilha trocada), nada é gravado.
function celulaEmEdicao(event) {
  if (!modoEdicao) return null;
  const celula = event.target?.closest?.('td.celula-editavel');
  return celula && celula.isConnected ? celula : null;
}

function manterVisivelAbaixoDaFaixa(celula) {
  const limite = document.getElementById('massaStatus').getBoundingClientRect().bottom;
  const caixa = celula.getBoundingClientRect();
  if (caixa.top < limite) window.scrollBy(0, caixa.top - limite - 8);
  else if (caixa.bottom > window.innerHeight) window.scrollBy(0, caixa.bottom - window.innerHeight + 8);
}

function irParaLinhaVizinha(celula, direcao) {
  let linha = celula.parentElement;
  do {
    linha = direcao > 0 ? linha.nextElementSibling : linha.previousElementSibling;
  } while (linha && linha.hidden);
  const destino = linha?.cells[celula.cellIndex];
  if (!destino) {
    celula.blur();
    return;
  }
  destino.focus();
  // Cursor no fim do texto, pronto para continuar a edição.
  const selecao = window.getSelection();
  selecao.selectAllChildren(destino);
  selecao.collapseToEnd();
}

/* ==================== Glossário (consulta à tabela mestra) ==================== */

let glossarioIndices = null;
let glossarioCarregando = false;

// Posição do termo na frase em inglês, pela especificação do CLAUDE.md.
const POSICAO_POR_INDICE = {
  1: 'NÚCLEO', 2: '2', 3: '3', 4: '9', 5: '1', 6: '4', 7: '5', 8: '8', 9: '7',
  10: 'APÓS NÚCLEO', 11: 'APÓS NÚCLEO', 12: '6 / APÓS NÚCLEO', 13: 'IDENTIDADE',
  14: '3', 15: 'NÚCLEO', 16: 'NÚCLEO'
};

async function carregarGlossario() {
  if (glossarioIndices || glossarioCarregando) return;
  glossarioCarregando = true;
  const contador = document.getElementById('glossarioContador');
  if (contador) contador.textContent = 'Carregando...';
  try {
    const response = await fetch('http://localhost:3000/api/glossario');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
    glossarioIndices = data.indices;

    const seletor = document.getElementById('glossarioIndice');
    glossarioIndices.forEach(indice => {
      const opcao = document.createElement('option');
      opcao.value = String(indice.id);
      opcao.textContent = `${indice.id} — ${indice.nome}`;
      seletor.appendChild(opcao);
    });

    const total = glossarioIndices.reduce((soma, indice) => soma + indice.termos.length, 0);
    document.getElementById('glossarioTitulo').textContent = `GLOSSÁRIO — TABELA MESTRA · ${total} TERMOS · ${glossarioIndices.length} ÍNDICES`;
    document.getElementById('glossarioData').textContent = `CONSULTADO EM ${new Date().toLocaleDateString('pt-BR')}`;
    renderGlossario();
  } catch (error) {
    console.error('Erro ao carregar o glossário:', error);
    if (contador) contador.textContent = 'Não foi possível carregar o glossário. Verifique se o servidor está rodando.';
  } finally {
    glossarioCarregando = false;
  }
}

function listarTermosGlossario() {
  if (!glossarioIndices) return [];
  const busca = normalizarValorFiltro(document.getElementById('glossarioBusca').value);
  const indiceFiltro = document.getElementById('glossarioIndice').value;
  const tipoFiltro = document.getElementById('glossarioTipo').value;

  return glossarioIndices.flatMap(indice => indice.termos.map(termo => ({ ...termo, indice: indice.id, nomeIndice: indice.nome })))
    .filter(termo => !indiceFiltro || String(termo.indice) === indiceFiltro)
    .filter(termo => !tipoFiltro || termo.tipo === tipoFiltro)
    .filter(termo => !busca || [termo.pt, termo.en, termo.es].some(valor => normalizarValorFiltro(valor).includes(busca)));
}

// Colunas para quem mantém a tabela (tipo, contexto, status, posição, nº do índice): ficam
// recolhidas até "Mostrar detalhes técnicos". Quem consulta quer PT, EN, ES e o índice.
const COLUNAS_TECNICAS = new Set([4, 5, 6, 7, 9]);

function renderGlossario() {
  const tbody = document.getElementById('glossarioTableBody');
  if (!tbody || !glossarioIndices) return;
  const termos = listarTermosGlossario();
  const total = glossarioIndices.reduce((soma, indice) => soma + indice.termos.length, 0);
  const busca = normalizarValorFiltro(document.getElementById('glossarioBusca').value);
  // A caixa pode voltar marcada ao recarregar a página: a tabela segue o estado dela.
  alternarColunasTecnicas(document.getElementById('glossarioTecnicas').checked);

  tbody.replaceChildren();
  termos.forEach((termo, posicao) => {
    const tr = document.createElement('tr');
    [
      String(posicao + 1),
      termo.pt,
      termo.en,
      termo.es,
      termo.tipo === 'expressao' ? 'EXPRESSÃO' : 'TERMO',
      termo.contexto,
      termo.status,
      POSICAO_POR_INDICE[termo.indice] || '',
      termo.nomeIndice,
      String(termo.indice)
    ].forEach((valor, coluna) => {
      const celula = coluna >= 1 && coluna <= 3 ? celulaComBusca(valor, busca) : criarCelula(valor);
      if (COLUNAS_TECNICAS.has(coluna)) celula.classList.add('col-tecnica');
      // ES vazio vira "—": diferencia "ainda sem espanhol" de célula esquecida em branco.
      if (coluna === 3 && !valor) {
        celula.textContent = '—';
        celula.classList.add('vazio');
        celula.title = 'Sem espanhol ainda';
      }
      tr.appendChild(celula);
    });
    tbody.appendChild(tr);
  });

  document.getElementById('glossarioContador').textContent = `Mostrando ${termos.length} de ${total}`;
}

// Célula com o trecho buscado marcado. A busca ignora acentos; nos termos da tabela a
// normalização não muda o tamanho do texto (letra acentuada vira uma letra só), então a
// posição achada no texto normalizado vale no original. Se o tamanho mudar, não marca.
function celulaComBusca(valor, busca) {
  const celula = criarCelula(valor);
  if (!busca || !valor) return celula;
  const normalizado = normalizarValorFiltro(valor);
  const posicao = normalizado.indexOf(busca);
  if (posicao < 0 || normalizado.length !== valor.length) return celula;
  celula.replaceChildren(valor.slice(0, posicao),
    criarElemento('mark', { textContent: valor.slice(posicao, posicao + busca.length) }),
    valor.slice(posicao + busca.length));
  return celula;
}

function alternarColunasTecnicas(mostrar) {
  document.getElementById('tableGlossario').classList.toggle('com-tecnicas', mostrar);
}

function exportarGlossario() {
  const termos = listarTermosGlossario();
  if (!termos.length) return;
  const ws = XLSX.utils.json_to_sheet(termos.map((termo, posicao) => ({
    '#': posicao + 1,
    'PORTUGUÊS': termo.pt,
    'INGLÊS': termo.en,
    'ESPANHOL': termo.es,
    'TIPO': termo.tipo === 'expressao' ? 'EXPRESSÃO' : 'TERMO',
    'CONTEXTO': termo.contexto,
    'STATUS': termo.status,
    'POSIÇÃO NA FRASE': POSICAO_POR_INDICE[termo.indice] || '',
    'NOME DO ÍNDICE': termo.nomeIndice,
    'ÍNDICE': termo.indice
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Glossário');
  XLSX.writeFile(wb, 'MODALIS_Glossario.xlsx');
}
