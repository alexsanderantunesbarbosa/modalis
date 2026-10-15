/**
 * script.js
 * Interface, revisão de grafia, importação SAP e exportação MODALIS.
 */

let dadosProcessados = [];
let modoEdicao = false;

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const index = tabName === 'singular' ? 0 : 1;
  document.querySelectorAll('.tab-btn')[index]?.classList.add('active');
  document.getElementById(tabName === 'singular' ? 'tab-singular' : 'tab-massa')?.classList.add('active');
}

async function chamarApiTraduzir(textoPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textoPT, targetLang })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
  return data.traducao;
}

async function chamarApiTraduzirMassa(textosPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir-massa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textos: textosPT, targetLang })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Erro HTTP: ${response.status}`);
  return data.traducoes;
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
  inputES.value = 'ES será incluído em uma etapa posterior.';

  try {
    inputEN.value = await chamarApiTraduzir(textoPT, 'EN-US');
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

function setMassaStatus(texto) {
  const status = document.getElementById('massaStatus');
  if (status) status.textContent = texto;
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
      document.getElementById('btnAlterar').classList.add('btn-outline');
      document.getElementById('btnAlterar').innerHTML = '<i class="ph ph-pencil-simple"></i> Alterar / Editar';
      renderTabelaMassa();

      const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
      setMassaStatus(pendentes
        ? `${pendentes} linha(s) têm sugestão de grafia. Revise e escolha aplicar ou manter o original antes de traduzir.`
        : 'Revise as descrições e selecione “Traduzir inglês” quando estiver pronto.');
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
  renderTabelaMassa();
  atualizarStatusRevisao();
}

function atualizarStatusRevisao() {
  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
  if (pendentes) {
    setMassaStatus(`${pendentes} linha(s) ainda precisam de uma decisão de grafia antes da tradução.`);
  } else {
    setMassaStatus('Revisão de grafia concluída. Traduza o inglês quando estiver pronto.');
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
    tr.appendChild(criarCelula(item.ref));
    tr.appendChild(criarCelula(item.ptOriginal));

    const celulaCorrecao = document.createElement('td');
    const textoCorrigido = item.estadoCorrecao === 'aceita' || item.estadoCorrecao === 'recusada' || item.estadoCorrecao === 'sem-sugestao'
      ? item.pt
      : item.ptSugerido;
    const texto = document.createElement('div');
    texto.className = 'texto-correcao';
    texto.textContent = textoCorrigido;
    celulaCorrecao.appendChild(texto);

    if (item.estadoCorrecao === 'pendente') {
      const acoes = document.createElement('div');
      acoes.className = 'acoes-correcao';
      acoes.appendChild(criarBotaoCorrecao('Aplicar', 'btn-primary', () => aceitarCorrecao(index)));
      acoes.appendChild(criarBotaoCorrecao('Manter original', 'btn-outline', () => manterOriginal(index)));
      celulaCorrecao.appendChild(acoes);
      const detalhe = document.createElement('small');
      detalhe.textContent = `Candidata(s): ${item.correcoesSugeridas.join(', ')}`;
      celulaCorrecao.appendChild(detalhe);
    } else if (item.estadoCorrecao === 'aceita') {
      const selo = document.createElement('small');
      selo.textContent = 'Correção aceita';
      celulaCorrecao.appendChild(selo);
    } else if (item.estadoCorrecao === 'recusada') {
      const selo = document.createElement('small');
      selo.textContent = 'Original mantido';
      celulaCorrecao.appendChild(selo);
    }
    tr.appendChild(celulaCorrecao);

    const en = criarCelula(item.en);
    const es = criarCelula(item.es);
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

  const pendentes = dadosProcessados.filter(item => item.estadoCorrecao === 'pendente').length;
  document.getElementById('rowCountBadge').textContent = `${dadosProcessados.length} itens · ${pendentes} sugestões`;
  document.getElementById('resultMassaCard').style.display = 'block';
}

async function traduzirMassa() {
  if (!dadosProcessados.length) return;
  if (dadosProcessados.some(item => item.estadoCorrecao === 'pendente')) {
    alert('Decida cada sugestão de grafia antes de enviar as descrições para tradução.');
    return;
  }

  const semDescricao = dadosProcessados.filter(item => !item.pt.trim());
  if (semDescricao.length) {
    alert('Há linhas sem descrição. Preencha ou remova essas linhas na planilha de origem antes de traduzir.');
    return;
  }

  const btn = document.getElementById('btnTraduzirMassa');
  btn.disabled = true;
  setMassaStatus(`Enviando ${dadosProcessados.length} descrições para tradução em inglês...`);
  try {
    const traducoesEN = await chamarApiTraduzirMassa(dadosProcessados.map(item => item.pt), 'EN-US');
    dadosProcessados.forEach((item, index) => {
      item.en = traducoesEN[index] || '';
      item.es = '';
    });
    setMassaStatus('Tradução em inglês concluída. O espanhol será incluído em uma etapa posterior.');
    renderTabelaMassa();
  } catch (error) {
    console.error('Erro ao traduzir planilha:', error);
    alert('Erro ao traduzir a planilha:\n\n' + error.message);
    setMassaStatus('A tradução não foi concluída.');
  } finally {
    btn.disabled = false;
  }
}

function toggleModoEdicao() {
  if (modoEdicao) atualizarDadosAposEdicao();
  modoEdicao = !modoEdicao;
  const btn = document.getElementById('btnAlterar');
  if (modoEdicao) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    btn.innerHTML = '<i class="ph ph-check"></i> Salvar Alterações';
  } else {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    btn.innerHTML = '<i class="ph ph-pencil-simple"></i> Alterar / Editar';
  }
  renderTabelaMassa();
}

function atualizarDadosAposEdicao() {
  document.querySelectorAll('#massaTableBody tr').forEach((tr, index) => {
    const celulas = tr.querySelectorAll('td');
    if (dadosProcessados[index]) {
      dadosProcessados[index].en = celulas[3].innerText.trim().toUpperCase();
      dadosProcessados[index].es = celulas[4].innerText.trim().toUpperCase();
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
    'TEXTO ECOM': item.ecom,
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
