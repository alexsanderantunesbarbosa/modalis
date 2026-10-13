/**
 * script.js
 * Manipulação da Interface do Usuário (DOM), Leitura de Excel e Comunicação com o Servidor Node.js
 */

// Variáveis de Estado Global
let dadosProcessados = [];
let modoEdicao = false;

// ============================================================
// 1. ALTERNÂNCIA DE ABAS (SINGULAR x EM MASSA)
// ============================================================
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (tabName === 'singular') {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('tab-singular').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('tab-massa').classList.add('active');
  }
}

// ============================================================
// 2. FUNÇÕES DE COMUNICAÇÃO COM O SERVIDOR (API FETCH)
// ============================================================

// Tradução de um único termo
async function chamarApiTraduzir(textoPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textoPT, targetLang })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erro HTTP: ${response.status}`);
  }

  return data.traducao;
}

// Tradução em lote para planilhas
async function chamarApiTraduzirMassa(textosPT, targetLang) {
  const response = await fetch('http://localhost:3000/api/traduzir-massa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ textos: textosPT, targetLang })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erro HTTP: ${response.status}`);
  }

  return data.traducoes; // Retorna o Array simples com os textos
}

// ============================================================
// 3. TRADUÇÃO SINGULAR (INDIVIDUAL)
// ============================================================
async function traduzirSingular() {
  const inputPT = document.getElementById('inputDescPT');
  const textoPT = inputPT.value.trim().toUpperCase();

  if (!textoPT) return;

  const inputEN = document.getElementById('outputDescEN');
  const inputES = document.getElementById('outputDescES');

  inputEN.value = "Traduzindo...";
  inputES.value = "Traduzindo...";

  try {
    // Dispara as duas traduções em paralelo para ganhar desempenho
    const [tradEN, tradES] = await Promise.all([
      chamarApiTraduzir(textoPT, 'EN-US'),
      chamarApiTraduzir(textoPT, 'ES')
    ]);

    inputEN.value = tradEN;
    inputES.value = tradES;

  } catch (error) {
    console.error("Erro na tradução singular:", error);
    alert("Não foi possível realizar a tradução. Verifique se o servidor Node.js está rodando.\n\nDetalhes: " + error.message);
    inputEN.value = "";
    inputES.value = "";
  }
}

// ============================================================
// 4. TRADUÇÃO EM MASSA (IMPORTAÇÃO E EXPORTAÇÃO EXCEL)
// ============================================================

// Processar Upload da Planilha
async function processarArquivo(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      dadosProcessados = [];

      // Ler e Estruturar as Linhas da Planilha
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        // Pula o cabeçalho caso a primeira coluna seja texto e esteja no topo
        if (index === 0 && isNaN(row[0])) {
          continue;
        }

        const ref = row[0] || `REF-${index + 1}`;
        const pt = (row[1] || '').toString().trim().toUpperCase();

        if (pt) {
          dadosProcessados.push({
            ref: ref,
            pt: pt,
            en: 'Traduzindo...',
            es: 'Traduzindo...'
          });
        }
      }

      if (dadosProcessados.length === 0) {
        alert('Nenhuma descrição válida foi encontrada na planilha.');
        return;
      }

      // Renderiza a tabela inicial com status "Traduzindo..."
      renderTabelaMassa();

      const textosPT = dadosProcessados.map(item => item.pt);

      console.log(`Enviando ${textosPT.length} descrições para tradução em lote...`);

      // Dispara traduções em lote em paralelo para EN e ES
      const [traducoesEN, traducoesES] = await Promise.all([
        chamarApiTraduzirMassa(textosPT, 'EN-US'),
        chamarApiTraduzirMassa(textosPT, 'ES')
      ]);

      // Popula os resultados na memória
      dadosProcessados.forEach((item, index) => {
        item.en = traducoesEN[index] || item.pt;
        item.es = traducoesES[index] || item.pt;
      });

      // Atualiza a tabela na tela
      renderTabelaMassa();
      console.log('✅ Tradução em massa concluída com sucesso!');

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao traduzir a planilha:\n\n' + error.message);
    }
  };

  reader.readAsArrayBuffer(file);
}

// Renderizar Tabela no HTML
function renderTabelaMassa() {
  const tbody = document.getElementById('massaTableBody');
  tbody.innerHTML = '';

  dadosProcessados.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.ref}</td>
      <td>${item.pt}</td>
      <td contenteditable="${modoEdicao}">${item.en}</td>
      <td contenteditable="${modoEdicao}">${item.es}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('rowCountBadge').textContent = `${dadosProcessados.length} itens`;
  document.getElementById('resultMassaCard').style.display = 'block';
}

// Alternar Modo de Edição
function toggleModoEdicao() {
  modoEdicao = !modoEdicao;
  const btn = document.getElementById('btnAlterar');
  
  if (modoEdicao) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
    btn.innerHTML = `<i class="ph ph-check"></i> Salvar Alterações`;
  } else {
    // Ao desativar o modo de edição, atualiza os dados na memória com o texto que foi alterado
    atualizarDadosAposEdicao();
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    btn.innerHTML = `<i class="ph ph-pencil-simple"></i> Alterar / Editar`;
  }

  renderTabelaMassa();
}

// Atualizar array em memória com edições manuais feitas no HTML
function atualizarDadosAposEdicao() {
  const linhas = document.querySelectorAll('#massaTableBody tr');
  linhas.forEach((tr, index) => {
    const celulas = tr.querySelectorAll('td');
    if (dadosProcessados[index]) {
      dadosProcessados[index].en = celulas[2].innerText.trim().toUpperCase();
      dadosProcessados[index].es = celulas[3].innerText.trim().toUpperCase();
    }
  });
}

// Baixar Tabela Editada/Traduzida em Excel
function baixarExcel() {
  if (dadosProcessados.length === 0) return;

  // Garante que capturou as alterações de células editáveis antes de exportar
  if (modoEdicao) {
    atualizarDadosAposEdicao();
  }

  const ws = XLSX.utils.json_to_sheet(dadosProcessados.map(d => ({
    "REF": d.ref,
    "PT-BR": d.pt,
    "EN": d.en,
    "ES": d.es
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Traduções");
  XLSX.writeFile(wb, "Traducoes_Engenharia_Produto.xlsx");
}

// ============================================================
// 5. UTILITÁRIOS
// ============================================================
function copiarTexto(elementId) {
  const input = document.getElementById(elementId);
  if (!input || !input.value) return;

  navigator.clipboard.writeText(input.value);
  alert('Texto copiado para a área de transferência!');
}