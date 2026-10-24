/**
 * script.js
 * Interface, revisão de grafia, importação SAP e exportação MODALIS.
 */

let dadosProcessados = [];
let modoEdicao = false;

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
    if (resultado.origem === 'local') {
      setSingularStatus(`A DeepL não respondeu; esta tradução veio do motor local. Motivo: ${resultado.erro}`, true);
    } else {
      setSingularStatus('Tradução feita pela DeepL com o contexto do glossário.');
    }
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

function setMassaStatus(texto, aviso = false) {
  const status = document.getElementById('massaStatus');
  if (!status) return;
  status.textContent = texto;
  status.classList.toggle('aviso', aviso);
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
          origemEN: '', // 'deepl' | 'local' | 'manual'
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
  item.en = '';
  item.es = '';
  item.origemEN = '';
  renderTabelaMassa();
  atualizarStatusRevisao();
}

function manterOriginal(index) {
  const item = dadosProcessados[index];
  if (!item) return;
  item.pt = item.ptOriginal;
  item.estadoCorrecao = 'recusada';
  item.en = '';
  item.es = '';
  item.origemEN = '';
  renderTabelaMassa();
  atualizarStatusRevisao();
}

function atualizarStatusRevisao() {
  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
  if (pendentes) {
    setMassaStatus(`${pendentes} linha(s) ainda precisam de uma decisão de grafia antes da tradução.`);
  } else {
    setMassaStatus('Revisão de grafia concluída. Clique em Traduzir quando estiver pronto.');
  }
}

function criarCelula(valor, classe = '') {
  const td = document.createElement('td');
  td.textContent = valor;
  if (classe) td.className = classe;
  return td;
}

function criarBotaoCorrecao(rotulo, classe, acao) {
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
      acoes.appendChild(criarBotaoCorrecao('Aplicar', 'btn-primary', () => aceitarCorrecao(index)));
      acoes.appendChild(criarBotaoCorrecao('Manter original', 'btn-default', () => manterOriginal(index)));
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
    if (item.en && !modoEdicao && (item.origemEN === 'local' || item.origemEN === 'manual')) {
      en.dataset.valorFiltro = item.en;
      const selo = document.createElement('small');
      selo.className = item.origemEN === 'local' ? 'selo-local' : 'selo-manual';
      selo.textContent = item.origemEN === 'local' ? 'Motor local (DeepL falhou)' : 'Editado à mão';
      en.appendChild(selo);
    }
    if (modoEdicao) {
      en.contentEditable = 'true';
      es.contentEditable = 'true';
      en.classList.add('celula-editavel');
      es.classList.add('celula-editavel');
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

// Mesma normalização para o que vem da API e para o que o usuário digita: sem isso, abrir
// e fechar a edição sem mudar nada marcaria a linha como editada à mão.
function normalizarEN(texto) {
  return String(texto ?? '').replace(/\s+/g, ' ').trim().toUpperCase();
}

// Uma linha precisa de tradução quando não tem inglês ou quando veio do motor local
// (a DeepL falhou). Linhas editadas à mão nunca são reenviadas.
function precisaTraduzir(item) {
  return !item.en.trim() || item.origemEN === 'local';
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
    item.en = '';
    item.es = '';
    item.origemEN = '';
  });

  renderTabelaMassa();
  setMassaStatus(`${pendentes.length} correção(ões) aplicada(s). Revise as descrições antes de traduzir.`);
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

  // Só o que está pendente vai para a API: linhas já traduzidas ou editadas à mão ficam.
  // `itens` é capturado antes do await: se outra planilha for importada durante a espera,
  // a resposta pertence à planilha antiga e é descartada em vez de gravada na nova.
  const itens = dadosProcessados;
  const alvos = itens.filter(precisaTraduzir);
  if (!alvos.length) {
    setMassaStatus('Nada pendente: todas as linhas já têm tradução. Edite uma linha ou importe outra planilha.');
    return;
  }

  const btn = document.getElementById('btnTraduzirMassa');
  const btnImportar = document.getElementById('btnImportar');
  const btnAlterar = document.getElementById('btnAlterar');
  btn.disabled = true;
  if (btnImportar) btnImportar.disabled = true;
  if (btnAlterar) btnAlterar.disabled = true;
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
    let interrompido = '';
    for (let inicio = 0; inicio < chaves.length; inicio += TAMANHO_PARTE) {
      const parte = chaves.slice(inicio, inicio + TAMANHO_PARTE);
      const { traducoes, origens = [], erros = [] } = await chamarApiTraduzirMassa(parte.map(chave => porChave.get(chave)[0].pt), 'EN-US');
      if (dadosProcessados !== itens) {
        setMassaStatus('Outra planilha foi importada durante a tradução; o resultado da anterior foi descartado.', true);
        return;
      }
      parte.forEach((chave, j) => porChave.get(chave).forEach(item => {
        if (!precisaTraduzir(item)) return; // a linha foi editada à mão durante a espera
        item.en = normalizarEN(traducoes[j]);
        item.es = '';
        item.origemEN = origens[j] || 'deepl';
      }));
      erros.forEach(erro => { if (!errosVistos.includes(erro)) errosVistos.push(erro); });
      feitas += parte.length;
      renderTabelaMassa();
      // DeepL suspensa (limite de taxa ou indisponível): parar de enviar; o restante fica
      // pendente para "Traduzir pendentes" daqui a alguns minutos.
      if (origens.length && origens.every(origem => origem === 'local') && erros.some(erro => /suspensas|limitando/.test(erro))) {
        interrompido = erros.find(erro => /suspensas|limitando/.test(erro));
        break;
      }
      setMassaStatus(`Traduzidas ${feitas} de ${chaves.length} descrições distintas (parte ${Math.ceil(feitas / TAMANHO_PARTE)} de ${totalPartes})...`);
    }

    const locais = alvos.filter(item => item.origemEN === 'local').length;
    const pendentes = alvos.filter(precisaTraduzir).length;
    const repetidas = alvos.length - chaves.length;
    const resumo = ` (${chaves.length} descrições distintas${repetidas ? `, ${repetidas} repetidas aproveitadas` : ''})`;
    if (interrompido) {
      setMassaStatus(`Tradução interrompida: ${interrompido}. ${pendentes} linha(s) continuam pendentes e ${locais} vieram do motor local${resumo}.`, true);
    } else if (locais) {
      setMassaStatus(`A DeepL falhou em ${locais} de ${alvos.length} descrições; elas vieram do motor local e estão marcadas na tabela${resumo}. Motivo: ${errosVistos.join(' | ')}`, true);
    } else {
      setMassaStatus(`Tradução concluída pela DeepL: ${alvos.length} linha(s)${resumo}. O espanhol será incluído em uma etapa posterior.`);
    }
    renderTabelaMassa();
  } catch (error) {
    console.error('Erro ao traduzir planilha:', error);
    alert('Erro ao traduzir a planilha:\n\n' + error.message);
    setMassaStatus('A tradução não foi concluída.', true);
  } finally {
    btn.disabled = false;
    if (btnImportar) btnImportar.disabled = false;
    if (btnAlterar) btnAlterar.disabled = false;
    atualizarBotaoTraduzir();
  }
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
}

function atualizarDadosAposEdicao() {
  document.querySelectorAll('#massaTableBody tr').forEach(tr => {
    const index = Number(tr.dataset.itemIndex);
    const celulas = tr.querySelectorAll('td');
    const item = dadosProcessados[index];
    if (item) {
      // Edição manual vira origem 'manual': a linha não é reenviada à DeepL.
      const enNovo = normalizarEN(celulas[3].innerText);
      if (enNovo !== normalizarEN(item.en)) {
        item.en = enNovo;
        item.origemEN = enNovo ? 'manual' : '';
      }
      item.es = celulas[4].innerText.replace(/\s+/g, ' ').trim().toUpperCase();
    }
  });
}

function baixarExcel() {
  if (!dadosProcessados.length) return;
  if (modoEdicao) atualizarDadosAposEdicao();

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

  // Linhas do motor local mantêm a ordem do português; exportá-las é uma decisão consciente.
  const locais = dadosProcessados.filter(item => item.origemEN === 'local').length;
  if (locais && !window.confirm(`${locais} linha(s) vieram do motor local (a DeepL falhou) e ainda contam como pendentes. Exportar mesmo assim?`)) {
    return;
  }

  const acimaDoLimite = dadosProcessados.flatMap(item => {
    const problemas = [];
    if (item.pt.length > 40) problemas.push(`${item.ref || `linha ${item.linhaOrigem}`} — DESCRIÇÃO PT: ${item.pt.length - 40} acima do limite`);
    if (item.en.length > 40) problemas.push(`${item.ref || `linha ${item.linhaOrigem}`} — Descrição EN: ${item.en.length - 40} acima do limite`);
    return problemas;
  });
  if (acimaDoLimite.length) {
    alert('Download bloqueado pelos limites de 40 caracteres:\n\n' + acimaDoLimite.slice(0, 20).join('\n'));
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
