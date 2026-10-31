/**
 * estadoMassa.js
 * Regras da tabela em massa que não dependem da tela: selo de cada linha, contador de
 * caracteres, edição manual, confirmação e o resumo da faixa de status. Cada linha tem
 * inglês e espanhol, com os mesmos controles; a faixa, os filtros e o download olham os dois.
 *
 * No navegador vira o global `EstadoMassa` (carregado antes do script.js); no Node é
 * exportado para os testes. Um único nome global de propósito: os dois arquivos dividem o
 * mesmo escopo, e um `const` repetido entre eles derrubaria a página inteira.
 */
(function (raiz, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else raiz.EstadoMassa = api;
})(globalThis, function () {
  'use strict';

  // Limite do SAP para as descrições (igual a LIMITE_SAP em processadorTexto.js; um teste confere).
  const LIMITE_CARACTERES = 40;

  // Campos de cada idioma na linha (o inglês manteve os nomes de antes do espanhol).
  const IDIOMAS = ['EN', 'ES'];
  const CAMPOS = {
    EN: { texto: 'en', origem: 'origemEN', estado: 'estadoEN', motivo: 'motivoEN', automatico: 'enAutomatico', confirmada: 'confirmadaEN' },
    ES: { texto: 'es', origem: 'origemES', estado: 'estadoES', motivo: 'motivoES', automatico: 'esAutomatico', confirmada: 'confirmadaES' }
  };
  const campos = idioma => CAMPOS[idioma] || CAMPOS.EN;
  const textoDe = (item, idioma) => item[campos(idioma).texto] || '';
  // Sem idioma (ou com outro valor, como o índice que o filter passa), a pergunta vale para a
  // linha: algum dos dois idiomas.
  const emAlgumIdioma = (item, pergunta) => IDIOMAS.some(idioma => pergunta(item, idioma));

  // Mesma normalização para o que vem da API e para o que o usuário digita: sem isso, abrir
  // e fechar a edição sem mudar nada marcaria a linha como editada à mão. Vale para EN e ES.
  function normalizarEN(texto) {
    return String(texto ?? '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  // Conta sobre o texto normalizado, que é o que vai para a planilha exportada.
  function contarCaracteres(texto) {
    return normalizarEN(texto).length;
  }

  function acimaDoLimite(texto) {
    return contarCaracteres(texto) > LIMITE_CARACTERES;
  }

  // '38/40' para o canto da célula; vazio quando não há texto.
  function textoContador(texto) {
    const total = contarCaracteres(texto);
    return total ? `${total}/${LIMITE_CARACTERES}` : '';
  }

  // Um idioma precisa de tradução quando não tem texto ou quando veio do motor local (a
  // DeepL falhou) e ninguém o confirmou. Texto editado à mão nunca é reenviado. Sem
  // idioma: a linha precisa de tradução em algum dos dois.
  function precisaTraduzir(item, idioma) {
    if (!IDIOMAS.includes(idioma)) return emAlgumIdioma(item, precisaTraduzir);
    const c = campos(idioma);
    return !textoDe(item, idioma).trim() || (item[c.origem] === 'local' && !item[c.confirmada]);
  }

  // Tradução que a máquina marcou (validador ou falha da DeepL) e que ninguém editou nem
  // confirmou. Exportar com ela pede confirmação. Sem idioma: algum dos dois.
  function linhaMarcada(item, idioma) {
    if (!IDIOMAS.includes(idioma)) return emAlgumIdioma(item, linhaMarcada);
    const c = campos(idioma);
    return Boolean(item[c.texto]) && !item[c.confirmada] && (item[c.origem] === 'local' || item[c.estado] === 'revisar');
  }

  // Confirmar tira a marca sem mudar o texto. Acima de 40 não vale: o SAP recusaria, então
  // o texto precisa ser editado.
  function podeConfirmar(item, idioma = 'EN') {
    return linhaMarcada(item, idioma) && !acimaDoLimite(textoDe(item, idioma));
  }

  function confirmarTraducao(item, idioma = 'EN') {
    if (!podeConfirmar(item, idioma)) return false;
    item[campos(idioma).confirmada] = true;
    return true;
  }

  // Grava o que o servidor devolveu, só no idioma pedido. `enAutomatico`/`esAutomatico`
  // guarda o texto da máquina para o selo "tinha X, agora tem Y" depois de uma edição manual.
  function aplicarTraducaoAutomatica(item, { traducao, origem, estado, motivo }, idioma = 'EN') {
    const c = campos(idioma);
    item[c.texto] = normalizarEN(traducao);
    item[c.origem] = origem || 'deepl';
    item[c.estado] = estado || '';
    item[c.motivo] = motivo || '';
    item[c.automatico] = item[c.texto];
    item[c.confirmada] = false;
  }

  // Edição manual vira origem 'manual': o texto não é reenviado à DeepL. O texto da máquina
  // não muda, para o "tinha X" continuar sendo o tamanho do que ela entregou. Devolve true
  // quando o texto mudou.
  function registrarEdicao(item, textoDigitado, idioma = 'EN') {
    const c = campos(idioma);
    const novo = normalizarEN(textoDigitado);
    if (novo === normalizarEN(item[c.texto])) return false;
    item[c.texto] = novo;
    item[c.origem] = novo ? 'manual' : '';
    item[c.estado] = '';
    item[c.motivo] = '';
    item[c.confirmada] = false;
    return true;
  }

  function registrarEdicaoEN(item, textoDigitado) {
    return registrarEdicao(item, textoDigitado, 'EN');
  }

  // A descrição PT mudou (decisão de grafia): a tradução antiga não vale mais, nos dois idiomas.
  function limparTraducao(item) {
    for (const idioma of IDIOMAS) {
      const c = campos(idioma);
      item[c.texto] = '';
      item[c.origem] = '';
      item[c.estado] = '';
      item[c.motivo] = '';
      item[c.automatico] = '';
      item[c.confirmada] = false;
    }
  }

  // Selo de um texto editado à mão. Quando a máquina entregou acima de 40, ou quando a
  // edição ainda passa de 40, mostra os dois tamanhos: "tinha 43, agora tem 38".
  function descreverEdicao(item, idioma = 'EN') {
    const agora = textoDe(item, idioma).length;
    const tinha = (item[campos(idioma).automatico] || '').length;
    const acima = agora > LIMITE_CARACTERES;
    const classe = acima ? 'selo-limite' : 'selo-manual';
    if (tinha && (tinha > LIMITE_CARACTERES || acima)) {
      let alerta = '';
      if (acima) alerta = tinha > LIMITE_CARACTERES ? ` · ainda acima de ${LIMITE_CARACTERES}` : ` · acima de ${LIMITE_CARACTERES}`;
      return { classe, texto: `Editado à mão · tinha ${tinha}, agora tem ${agora}${alerta}` };
    }
    return { classe, texto: acima ? `Editado à mão · acima de ${LIMITE_CARACTERES} (${agora})` : 'Editado à mão' };
  }

  // Selo da coluna EN ou ES: de onde veio a tradução e se pede revisão. Sem selo = montada
  // pela tabela mestra, dentro do limite. Todo selo de texto acima de 40 diz isso, para o
  // filtro "ACIMA" achar todas as linhas que o download bloqueia.
  function descreverSelo(item, idioma = 'EN') {
    const c = campos(idioma);
    const texto = textoDe(item, idioma);
    if (!texto) return null;
    if (item[c.origem] === 'manual') return descreverEdicao(item, idioma);
    if (item[c.confirmada]) return { classe: 'selo-manual', texto: 'Confirmada na revisão' };
    const motivo = item[c.motivo];
    const excesso = acimaDoLimite(texto) ? ` · acima de ${LIMITE_CARACTERES} (${texto.length})` : '';
    if (item[c.origem] === 'local') return { classe: 'selo-local', texto: `DeepL falhou; montada pela tabela${motivo ? ` (${motivo})` : ''}${excesso}` };
    if (item[c.estado] === 'revisar') return { classe: 'selo-revisar', texto: `A revisar: ${motivo}${excesso}` };
    if (excesso) return { classe: 'selo-limite', texto: `Acima de ${LIMITE_CARACTERES} caracteres (${texto.length})` };
    if (item[c.origem] === 'deepl') return { classe: 'selo-deepl', texto: `DeepL${motivo ? ` · ${motivo}` : ''}` };
    return null;
  }

  // Primeiro problema da linha, na ordem em que precisa ser resolvido; '' = pronta. Cada
  // linha conta uma vez só, então as parcelas da faixa somam o total. Acima de 40 vem antes
  // de "a revisar": só a edição resolve (não há Confirmar) e o download bloqueia. Sem
  // problema nenhum, o baixarExcel não bloqueia nem pergunta.
  // Vale para os dois idiomas: a linha só fica pronta quando EN e ES estão prontos.
  function problemaDaLinha(item) {
    if (item.estadoCorrecao === 'pendente') return 'grafia';
    if (emAlgumIdioma(item, (linha, idioma) => !textoDe(linha, idioma))) return 'semTraducao';
    if (origemEm(item, 'local', { semConfirmar: true })) return 'falhaDeepL';
    if (emAlgumIdioma(item, (linha, idioma) => acimaDoLimite(textoDe(linha, idioma)))) return 'acima';
    if (linhaMarcada(item)) return 'revisar';
    if (item.pt.length > LIMITE_CARACTERES) return 'ptAcima';
    return '';
  }

  // Algum idioma da linha veio desta origem (e, com semConfirmar, ninguém o confirmou).
  function origemEm(item, origem, { semConfirmar = false } = {}) {
    return emAlgumIdioma(item, (linha, idioma) => {
      const c = campos(idioma);
      return linha[c.origem] === origem && !(semConfirmar && linha[c.confirmada]);
    });
  }
  const editada = item => origemEm(item, 'manual');
  const confirmada = item => emAlgumIdioma(item, (linha, idioma) => Boolean(linha[campos(idioma).confirmada]));

  // De onde veio a tradução da linha, em grupos que não se sobrepõem: o idioma que mais pede
  // atenção decide (EN pela tabela e ES pela DeepL = "pela DeepL").
  function origemDaLinha(item) {
    if (emAlgumIdioma(item, (linha, idioma) => !textoDe(linha, idioma))) return 'semTraducao';
    if (editada(item)) return 'editadas';
    if (confirmada(item)) return 'confirmadas';
    if (origemEm(item, 'local')) return 'falhaDeepL';
    if (origemEm(item, 'deepl')) return 'deepl';
    return 'tabela';
  }

  // Editada à mão que veio da máquina acima de 40 e agora cabe.
  function corrigidaNoIdioma(item, idioma) {
    const c = campos(idioma);
    return item[c.origem] === 'manual' && (item[c.automatico] || '').length > LIMITE_CARACTERES && !acimaDoLimite(textoDe(item, idioma));
  }

  // Uma passada sobre a planilha: O(n) no tempo, O(1) de memória extra.
  function resumirMassa(itens) {
    const resumo = {
      total: itens.length,
      comTraducao: 0,
      origens: { tabela: 0, deepl: 0, falhaDeepL: 0, editadas: 0, confirmadas: 0, semTraducao: 0 },
      corrigidas: 0, // editadas à mão que vieram acima de 40 e agora cabem
      pendencias: { grafia: 0, semTraducao: 0, falhaDeepL: 0, revisar: 0, acima: 0, ptAcima: 0 },
      pendentes: 0
    };
    for (const item of itens) {
      resumo.origens[origemDaLinha(item)] += 1;
      if (emAlgumIdioma(item, textoDe)) resumo.comTraducao += 1;
      if (emAlgumIdioma(item, corrigidaNoIdioma)) resumo.corrigidas += 1;
      const problema = problemaDaLinha(item);
      if (problema) {
        resumo.pendencias[problema] += 1;
        resumo.pendentes += 1;
      }
    }
    resumo.pronto = resumo.total > 0 && resumo.pendentes === 0;
    return resumo;
  }

  const numero = valor => valor.toLocaleString('pt-BR');

  // "1 linha", "1.622 linhas": número no formato brasileiro e a palavra no singular ou plural.
  function formatarQuantidade(valor, singular, plural) {
    return `${numero(valor)} ${valor === 1 ? singular : plural}`;
  }

  // Mesma ordem de problemaDaLinha.
  const PENDENCIAS = [
    ['grafia', 'com grafia a decidir'],
    ['semTraducao', 'sem tradução'],
    ['falhaDeepL', 'com falha da DeepL'],
    ['acima', `acima de ${LIMITE_CARACTERES}`],
    ['revisar', 'a revisar'],
    ['ptAcima', `com DESCRIÇÃO PT acima de ${LIMITE_CARACTERES}`]
  ];

  // Linhas sem tradução e com falha da DeepL aparecem só no "Falta resolver".
  function textoBalanco(resumo) {
    const { origens, corrigidas } = resumo;
    const partes = [`${numero(origens.tabela)} pela tabela`, `${numero(origens.deepl)} pela DeepL`];
    if (origens.editadas) {
      const nota = corrigidas
        ? ` (${corrigidas === 1 ? '1 estava' : `${numero(corrigidas)} estavam`} acima de ${LIMITE_CARACTERES} e agora ${corrigidas === 1 ? 'cabe' : 'cabem'})`
        : '';
      partes.push(`${formatarQuantidade(origens.editadas, 'editada à mão', 'editadas à mão')}${nota}`);
    }
    if (origens.confirmadas) partes.push(formatarQuantidade(origens.confirmadas, 'confirmada na revisão', 'confirmadas na revisão'));
    return `${formatarQuantidade(resumo.total, 'linha', 'linhas')}: ${partes.join(', ')}.`;
  }

  function textoPendencias(resumo) {
    const partes = PENDENCIAS
      .filter(([chave]) => resumo.pendencias[chave])
      .map(([chave, rotulo]) => `${numero(resumo.pendencias[chave])} ${rotulo}`);
    return `Falta resolver ${formatarQuantidade(resumo.pendentes, 'linha', 'linhas')}: ${partes.join(', ')}.`;
  }

  // Texto e cor da faixa de status. `aviso` (problema da última tradução) e `prefixo` (recado
  // da ação que acabou de acontecer) vêm antes do balanço. tipo: '' (neutro), 'aviso' (bege)
  // ou 'ok' (verde, só quando nada impede o download).
  function textoFaixaMassa(resumo, { prefixo = '', aviso = '' } = {}) {
    const partes = [aviso, prefixo];
    let tipo = aviso ? 'aviso' : '';
    if (!resumo.comTraducao) {
      // Antes da primeira tradução a faixa acompanha a revisão de grafia.
      const { grafia } = resumo.pendencias;
      partes.push(grafia
        ? `${formatarQuantidade(grafia, 'linha ainda precisa', 'linhas ainda precisam')} de uma decisão de grafia antes da tradução.`
        : 'Revisão de grafia concluída. Clique em Traduzir quando estiver pronto.');
    } else if (resumo.pronto) {
      partes.push(textoBalanco(resumo), 'Nada pendente: pode baixar o Excel.');
      if (!aviso) tipo = 'ok';
    } else {
      partes.push(textoBalanco(resumo), textoPendencias(resumo));
      tipo = 'aviso';
    }
    return { texto: partes.filter(Boolean).join(' '), tipo };
  }

  // Filtros rápidos da tabela ("Mostrar:"). Os de problema usam problemaDaLinha, então o
  // número de cada um é o mesmo da faixa; "editadas" e "confirmadas" olham a origem e podem
  // se sobrepor a um problema (editada que ainda passa de 40). `opcional` só aparece se > 0.
  const FILTROS_RAPIDOS = [
    { chave: 'todas', rotulo: 'Todas' },
    { chave: 'revisar', rotulo: 'A revisar' },
    { chave: 'acima', rotulo: `Acima de ${LIMITE_CARACTERES}` },
    { chave: 'falhaDeepL', rotulo: 'Falha da DeepL' },
    { chave: 'semTraducao', rotulo: 'Sem tradução' },
    { chave: 'ptAcima', rotulo: `PT acima de ${LIMITE_CARACTERES}`, opcional: true },
    { chave: 'editadas', rotulo: 'Editadas à mão' },
    { chave: 'confirmadas', rotulo: 'Confirmadas' }
  ];

  // "Editadas" e "Confirmadas" usam a mesma origem da faixa (origemDaLinha), para o número do
  // botão bater com o balanço mesmo com EN e ES em situações diferentes.
  function passaNoFiltro(item, chave) {
    if (chave === 'todas') return true;
    if (chave === 'editadas' || chave === 'confirmadas') return origemDaLinha(item) === chave;
    return problemaDaLinha(item) === chave;
  }

  // { todas: 18, revisar: 1, ... }: O(n·f), com f = 8 filtros.
  function contarFiltros(itens) {
    return Object.fromEntries(FILTROS_RAPIDOS.map(({ chave }) => [chave, itens.filter(item => passaNoFiltro(item, chave)).length]));
  }

  // O que impede o download (bloqueios) e o que pede confirmação (marcadas), com a mesma
  // regra da faixa: sem bloqueio nem marcada, a faixa está verde. Uma linha pode ter mais de
  // um bloqueio (PT, EN e ES acima de 40); grafia pendente esconde "sem EN/ES", que é
  // consequência. `texto` é o que a janela mostra ao lado do problema.
  function verificarExportacao(itens) {
    const bloqueios = [];
    for (const item of itens) {
      const referencia = item.ref || `linha ${item.linhaOrigem}`;
      if (item.estadoCorrecao === 'pendente') bloqueios.push({ item, referencia, problema: 'Grafia a decidir', texto: item.pt });
      else {
        for (const idioma of IDIOMAS) {
          if (!textoDe(item, idioma).trim()) bloqueios.push({ item, referencia, problema: `Sem Descrição ${idioma}`, texto: '' });
        }
      }
      if (item.pt.length > LIMITE_CARACTERES) bloqueios.push({ item, referencia, problema: `DESCRIÇÃO PT com ${item.pt.length} caracteres`, texto: item.pt });
      for (const idioma of IDIOMAS) {
        const texto = textoDe(item, idioma);
        if (texto.length > LIMITE_CARACTERES) bloqueios.push({ item, referencia, problema: `Descrição ${idioma} com ${texto.length} caracteres`, texto });
      }
    }
    return { bloqueios, marcadas: itens.filter(item => linhaMarcada(item)) };
  }

  return {
    LIMITE_CARACTERES,
    IDIOMAS,
    normalizarEN,
    contarCaracteres,
    acimaDoLimite,
    textoContador,
    precisaTraduzir,
    linhaMarcada,
    podeConfirmar,
    confirmarTraducao,
    aplicarTraducaoAutomatica,
    registrarEdicao,
    registrarEdicaoEN,
    limparTraducao,
    descreverSelo,
    problemaDaLinha,
    resumirMassa,
    textoFaixaMassa,
    formatarQuantidade,
    FILTROS_RAPIDOS,
    passaNoFiltro,
    contarFiltros,
    verificarExportacao
  };
});
