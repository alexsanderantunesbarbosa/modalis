/**
 * script.js
 * Interface, revisão de grafia, importação SAP e exportação MODALIS.
 * As regras da tabela em massa que não dependem da tela ficam em estadoMassa.js.
 */

const {
  LIMITE_CARACTERES, normalizarEN, acimaDoLimite, textoContador, precisaTraduzir, linhaMarcada,
  podeConfirmar, confirmarTraducao, aplicarTraducaoAutomatica, registrarEdicaoEN, limparTraducao,
  descreverSelo, resumirMassa, textoFaixaMassa, formatarQuantidade
} = EstadoMassa;

let dadosProcessados = [];
let modoEdicao = false;
// Planilha em tradução: enquanto ela estiver na tela, a faixa mostra o progresso e o
// resumo volta no fim. Uma planilha importada no meio tem a faixa dela normalmente.
let itensEmTraducao = null;
// Problema da última tradução ({ texto, itens }): fica na faixa enquanto alguma dessas
// linhas ainda precisar de tradução.
let avisoTraducao = null;

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

function setSingularStatus(texto, alerta = false) {
  const status = document.getElementById('singularStatus');
  if (!status) return;
  status.textContent = texto;
  status.classList.toggle('status-alerta', alerta);
}

function atualizarContadorEN(texto) {
  const contador = document.getElementById('contadorEN');
  if (!contador) return;
  if (!texto) {
    contador.textContent = '';
    contador.classList.remove('estourou');
    return;
  }
  contador.textContent = `${texto.length} / 40 caracteres`;
  contador.classList.toggle('estourou', texto.length > 40);
}

function renderTermosAplicados(termos = []) {
  const caixa = document.getElementById('termosAplicados');
  if (!caixa) return;
  const lista = caixa.querySelector('.termos-lista');
  lista.replaceChildren();
  termos.forEach(({ pt, en }) => {
    const chip = document.createElement('span');
    chip.textContent = `${pt} = ${en}`;
    lista.appendChild(chip);
  });
  caixa.hidden = termos.length === 0;
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

async function traduzirSingular() {
  const textoPT = document.getElementById('inputDescPT').value.trim().toUpperCase();
  if (!textoPT) return;

  const inputEN = document.getElementById('outputDescEN');
  const inputES = document.getElementById('outputDescES');
  inputEN.value = 'Traduzindo...';
  inputES.value = '';
  setSingularStatus('');
  atualizarContadorEN('');
  renderTermosAplicados([]);

  try {
    const resultado = await chamarApiTraduzir(textoPT, 'EN-US');
    inputEN.value = resultado.traducao;
    atualizarContadorEN(resultado.traducao);
    renderTermosAplicados(resultado.termos);
    const descricoes = {
      tabela: ['Montada pela tabela mestra, sem chamar a DeepL.', false],
      'acima-de-40': ['Montada pela tabela, mas passou de 40 caracteres: ajuste à mão.', true],
      deepl: [`Traduzida pela DeepL${resultado.motivo ? ` (${resultado.motivo})` : ''}; os termos do glossário foram conferidos.`, false],
      revisar: [`A revisar: ${resultado.motivo}${resultado.sugestaoTabela ? `. Sugestão da tabela: ${resultado.sugestaoTabela}` : ''}`, true]
    };
    const [texto, alerta] = descricoes[resultado.estado] || [`Origem: ${resultado.origem}`, false];
    setSingularStatus(texto, alerta);
  } catch (error) {
    console.error('Erro na tradução singular:', error);
    alert('Não foi possível realizar a tradução. Verifique se o servidor Node.js está rodando.\n\nDetalhes: ' + error.message);
    inputEN.value = '';
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
  const aviso = avisoTraducao && avisoTraducao.itens.some(precisaTraduzir) ? avisoTraducao.texto : '';
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
    const corresponde = filtros.every(filtro => filtro.seletor
      ? item?.estadoCorrecao === filtro.valor
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
    botao.addEventListener('click', () => {
      document.querySelectorAll('.filtro-coluna').forEach(input => { input.value = ''; });
      filtrarTabelaMassa();
      const linha = document.querySelector(`#massaTableBody tr[data-item-index="${index}"]`);
      if (linha) {
        linha.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    lista.appendChild(botao);
  });
  container.appendChild(lista);
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
          ecom: obterValor(row, colunas.ecom),
          compPT: obterValor(row, colunas.compPT),
          compEN: obterValor(row, colunas.compEN),
          compES: obterValor(row, colunas.compES),
          linhaOrigem: index + 2
        };
      });

      if (dadosProcessados.length === 0) {
        alert('Nenhuma linha com referência ou descrição foi encontrada.');
        return;
      }

      modoEdicao = false;
      avisoTraducao = null;
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
      alert('Não foi possível ler a planilha:\n\n' + error.message);
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

// Tira a marca de uma linha "a revisar" ou "DeepL falhou" cuja tradução está certa.
function confirmarLinha(index) {
  const item = dadosProcessados[index];
  if (!item || !confirmarTraducao(item)) return;
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

    const en = criarCelula(item.en);
    const es = criarCelula(item.es);
    aplicarContador(en, item.en);
    aplicarContador(es, item.es);
    gravarFiltroEN(en, item);
    if (modoEdicao) {
      en.contentEditable = 'true';
      es.contentEditable = 'true';
      en.classList.add('celula-editavel');
      es.classList.add('celula-editavel');
    } else {
      const selo = descreverSelo(item);
      if (selo) {
        const marca = document.createElement('small');
        marca.className = selo.classe;
        marca.textContent = selo.texto;
        en.appendChild(marca);
      }
      if (podeConfirmar(item)) {
        const acoes = document.createElement('div');
        acoes.className = 'acoes-correcao';
        const botao = criarBotaoPequeno('Confirmar', 'btn-default', () => confirmarLinha(index));
        botao.title = 'A tradução está certa: tira a marca sem mudar o texto';
        acoes.appendChild(botao);
        en.appendChild(acoes);
      }
    }
    tr.appendChild(en);
    tr.appendChild(es);
    tbody.appendChild(tr);
  });

  renderCorrecoesPendentes();
  document.getElementById('resultMassaCard').style.display = 'block';
  filtrarTabelaMassa();
  atualizarBotaoTraduzir();
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

// O filtro da coluna EN procura no texto e no selo ("ACIMA", "A REVISAR", "EDITADO"),
// também no modo de edição, quando o selo não aparece: sem isso, filtrar "ACIMA" e clicar
// em Alterar esconderia todas as linhas.
function gravarFiltroEN(celula, item) {
  const selo = descreverSelo(item);
  if (selo) celula.dataset.valorFiltro = `${item.en} ${selo.texto}`;
  else delete celula.dataset.valorFiltro;
}

function atualizarBotaoTraduzir() {
  const btn = document.getElementById('btnTraduzirMassa');
  if (!btn) return;
  const pendentes = dadosProcessados.filter(precisaTraduzir).length;
  const traduzidas = dadosProcessados.length - pendentes;
  btn.textContent = traduzidas && pendentes ? `Traduzir pendentes (${pendentes})` : 'Traduzir';
}

function aplicarTodasCorrecoes() {
  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente');
  if (!pendentes.length) return;

  // A coluna DESCRIÇÃO exportada é gravada no SAP pela transação da TI: aplicar em
  // lote é uma escrita em massa no sistema de registro, por isso pede confirmação.
  const amostra = pendentes.slice(0, 5).map(item => `• ${item.ref || `linha ${item.linhaOrigem}`}: ${item.ptOriginal} → ${item.ptSugerido}`);
  const restante = pendentes.length > 5 ? `\n… e mais ${pendentes.length - 5}.` : '';
  const confirmado = window.confirm(
    `Aplicar ${pendentes.length} correção(ões) de grafia?\n\nElas entram na coluna DESCRIÇÃO exportada e, pela transação, no SAP.\n\n${amostra.join('\n')}${restante}`
  );
  if (!confirmado) return;

  pendentes.forEach(item => {
    item.pt = item.ptSugerido;
    item.estadoCorrecao = 'aceita';
    limparTraducao(item);
  });

  renderTabelaMassa();
  atualizarFaixaMassa(pendentes.length === 1 ? '1 correção aplicada.' : `${pendentes.length} correções aplicadas.`);
}

// Descrições distintas enviadas por requisição na tradução em massa. Partes menores dão
// progresso na tela e limitam o que se perde se uma requisição falhar no meio.
const TAMANHO_PARTE = 100;

async function traduzirMassa() {
  if (!dadosProcessados.length) return;
  // Com a edição aberta, primeiro salva o que foi digitado (vira 'manual' e não é reenviado).
  if (modoEdicao) toggleModoEdicao();
  if (dadosProcessados.some(item => item.estadoCorrecao === 'pendente')) {
    alert('Decida cada sugestão de grafia antes de enviar as descrições para tradução.');
    return;
  }

  const semDescricao = dadosProcessados.filter(item => !item.pt.trim());
  if (semDescricao.length) {
    alert('Há linhas sem descrição. Preencha ou remova essas linhas na planilha de origem antes de traduzir.');
    return;
  }

  // Só o que está pendente vai para a API: linhas já traduzidas, editadas à mão ou
  // confirmadas ficam. `itens` é capturado antes do await: se outra planilha for importada
  // durante a espera, a resposta pertence à planilha antiga e é descartada.
  const itens = dadosProcessados;
  const alvos = itens.filter(precisaTraduzir);
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
  // Descrições iguais vão uma vez só, em partes de TAMANHO_PARTE, com progresso na tela.
  // O que já voltou fica gravado mesmo que uma parte falhe no meio.
  const porChave = new Map();
  for (const item of alvos) {
    const chave = item.pt.trim().toUpperCase();
    if (!porChave.has(chave)) porChave.set(chave, []);
    porChave.get(chave).push(item);
  }
  const chaves = Array.from(porChave.keys());
  const totalPartes = Math.ceil(chaves.length / TAMANHO_PARTE);
  setMassaStatus(`Enviando ${chaves.length} descrições distintas (${alvos.length} linhas) em ${totalPartes} parte(s)...`);
  try {
    const errosVistos = [];
    let feitas = 0;
    let falhas = 0; // linhas desta rodada que voltaram do motor local
    let interrompido = '';
    for (let inicio = 0; inicio < chaves.length; inicio += TAMANHO_PARTE) {
      const parte = chaves.slice(inicio, inicio + TAMANHO_PARTE);
      const { traducoes, origens = [], estados = [], motivos = [], erros = [] } = await chamarApiTraduzirMassa(parte.map(chave => porChave.get(chave)[0].pt), 'EN-US');
      if (dadosProcessados !== itens) {
        atualizarFaixaMassa('Outra planilha foi importada durante a tradução; o resultado da anterior foi descartado.');
        return;
      }
      parte.forEach((chave, j) => porChave.get(chave).forEach(item => {
        if (!precisaTraduzir(item)) return; // a linha foi confirmada durante a espera
        aplicarTraducaoAutomatica(item, { traducao: traducoes[j], origem: origens[j], estado: estados[j], motivo: motivos[j] });
        if (item.origemEN === 'local') falhas += 1;
      }));
      erros.forEach(erro => { if (!errosVistos.includes(erro)) errosVistos.push(erro); });
      feitas += parte.length;
      renderTabelaMassa();
      // DeepL suspensa (limite de taxa ou indisponível): parar de enviar; o restante fica
      // pendente para "Traduzir pendentes" daqui a alguns minutos.
      const remotas = origens.filter(origem => origem !== 'tabela');
      if (remotas.length && remotas.every(origem => origem === 'local') && erros.some(erro => /suspensas|limitando/.test(erro))) {
        interrompido = erros.find(erro => /suspensas|limitando/.test(erro));
        break;
      }
      setMassaStatus(`Traduzidas ${feitas} de ${chaves.length} descrições distintas (parte ${Math.ceil(feitas / TAMANHO_PARTE)} de ${totalPartes})...`);
    }

    // O balanço da faixa vem de resumirMassa (planilha inteira); aqui fica só o recado da
    // rodada. Um problema fica preso às linhas que ele deixou pendentes.
    const pendentes = alvos.filter(precisaTraduzir);
    if (interrompido) {
      avisoTraducao = { texto: `Tradução interrompida: ${semPontoFinal(interrompido)}.`, itens: pendentes };
    } else if (falhas) {
      const marcadas = falhas === 1 ? 'ela foi montada pela tabela e está marcada' : 'elas foram montadas pela tabela e estão marcadas';
      const motivo = errosVistos.length ? ` Motivo: ${semPontoFinal(errosVistos.join(' | '))}.` : '';
      avisoTraducao = {
        texto: `A DeepL falhou em ${falhas.toLocaleString('pt-BR')} de ${formatarQuantidade(alvos.length, 'linha enviada', 'linhas enviadas')}; ${marcadas}.${motivo}`,
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
    alert('Erro ao traduzir a planilha:\n\n' + error.message);
    if (dadosProcessados === itens) {
      avisoTraducao = { texto: `A tradução não foi concluída: ${semPontoFinal(error.message)}.`, itens: alvos.filter(precisaTraduzir) };
    }
  } finally {
    itensEmTraducao = null;
    btn.disabled = false;
    if (btnImportar) btnImportar.disabled = false;
    if (btnAlterar) btnAlterar.disabled = false;
    // Planilha trocada no meio: a mensagem de descarte fica.
    if (dadosProcessados === itens) atualizarFaixaMassa(prefixo);
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
  const mudouEN = registrarEdicaoEN(item, tr.cells[3].textContent);
  if (mudouEN) gravarFiltroEN(tr.cells[3], item);
  const esNovo = normalizarEN(tr.cells[4].textContent);
  const mudouES = esNovo !== item.es;
  item.es = esNovo;
  return mudouEN || mudouES;
}

function baixarExcel() {
  if (!dadosProcessados.length) return;
  if (modoEdicao) {
    atualizarDadosAposEdicao();
    atualizarFaixaMassa();
  }

  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente');
  if (pendentes.length) {
    alert('Resolva as sugestões de grafia antes de baixar a planilha.');
    return;
  }

  const semEN = dadosProcessados.filter(item => !item.en.trim());
  if (semEN.length) {
    alert(`Download bloqueado: ${semEN.length} linha(s) ainda não têm Descrição EN.`);
    return;
  }

  // O bloqueio vem antes da pergunta: não adianta confirmar a exportação e depois ser barrado.
  const foraDoLimite = dadosProcessados.flatMap(item => {
    const referencia = item.ref || `linha ${item.linhaOrigem}`;
    const problemas = [];
    if (item.pt.length > LIMITE_CARACTERES) problemas.push(`${referencia} — DESCRIÇÃO PT: ${item.pt.length - LIMITE_CARACTERES} acima do limite`);
    if (item.en.length > LIMITE_CARACTERES) problemas.push(`${referencia} — Descrição EN: ${item.en.length - LIMITE_CARACTERES} acima do limite`);
    return problemas;
  });
  if (foraDoLimite.length) {
    alert(`Download bloqueado pelos limites de ${LIMITE_CARACTERES} caracteres:\n\n` + foraDoLimite.slice(0, 20).join('\n'));
    return;
  }

  // Exportar linhas marcadas (a revisar ou DeepL falhou) sem confirmá-las é uma decisão consciente.
  const marcadas = dadosProcessados.filter(linhaMarcada).length;
  if (marcadas && !window.confirm(`${marcadas} linha(s) estão marcadas para revisão (glossário não aplicado ou DeepL falhou) e não foram confirmadas. Exportar mesmo assim?`)) {
    return;
  }

  const ws = XLSX.utils.json_to_sheet(dadosProcessados.map(item => ({
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

function copiarTexto(elementId) {
  const input = document.getElementById(elementId);
  if (!input || !input.value) return;
  navigator.clipboard.writeText(input.value);
  alert('Texto copiado para a área de transferência!');
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

// Ao sair da célula a linha é gravada, e a faixa de status acompanha a edição.
corpoTabelaMassa.addEventListener('focusout', event => {
  const celula = celulaEmEdicao(event);
  if (celula && salvarLinhaEmEdicao(celula.parentElement)) atualizarFaixaMassa();
});

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

function renderGlossario() {
  const tbody = document.getElementById('glossarioTableBody');
  if (!tbody || !glossarioIndices) return;
  const termos = listarTermosGlossario();
  const total = glossarioIndices.reduce((soma, indice) => soma + indice.termos.length, 0);

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
    ].forEach(valor => tr.appendChild(criarCelula(valor)));
    tbody.appendChild(tr);
  });

  document.getElementById('glossarioContador').textContent = `Mostrando ${termos.length} de ${total}`;
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
