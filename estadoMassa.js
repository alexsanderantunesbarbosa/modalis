/**
 * estadoMassa.js
 * Regras da tabela em massa que não dependem da tela: selo de cada linha, contador de
 * caracteres, edição manual, confirmação e o resumo da faixa de status.
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

  // Mesma normalização para o que vem da API e para o que o usuário digita: sem isso, abrir
  // e fechar a edição sem mudar nada marcaria a linha como editada à mão.
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

  // Uma linha precisa de tradução quando não tem inglês ou quando veio do motor local (a
  // DeepL falhou) e ninguém a confirmou. Linhas editadas à mão nunca são reenviadas.
  function precisaTraduzir(item) {
    return !item.en.trim() || (item.origemEN === 'local' && !item.confirmadaEN);
  }

  // Linha que a máquina marcou (validador ou falha da DeepL) e que ninguém editou nem
  // confirmou. Exportar com ela pede confirmação.
  function linhaMarcada(item) {
    return Boolean(item.en) && !item.confirmadaEN && (item.origemEN === 'local' || item.estadoEN === 'revisar');
  }

  // Confirmar tira a marca sem mudar o texto. Acima de 40 não vale: o SAP recusaria, então
  // a linha precisa ser editada.
  function podeConfirmar(item) {
    return linhaMarcada(item) && !acimaDoLimite(item.en);
  }

  function confirmarTraducao(item) {
    if (!podeConfirmar(item)) return false;
    item.confirmadaEN = true;
    return true;
  }

  // Grava o que o servidor devolveu. `enAutomatico` guarda o texto da máquina para o selo
  // "tinha X, agora tem Y" depois de uma edição manual.
  function aplicarTraducaoAutomatica(item, { traducao, origem, estado, motivo }) {
    item.en = normalizarEN(traducao);
    item.es = '';
    item.origemEN = origem || 'deepl';
    item.estadoEN = estado || '';
    item.motivoEN = motivo || '';
    item.enAutomatico = item.en;
    item.confirmadaEN = false;
  }

  // Edição manual vira origem 'manual': a linha não é reenviada à DeepL. `enAutomatico` não
  // muda, para o "tinha X" continuar sendo o tamanho do que a máquina entregou. Devolve
  // true quando o texto mudou.
  function registrarEdicaoEN(item, textoDigitado) {
    const novo = normalizarEN(textoDigitado);
    if (novo === normalizarEN(item.en)) return false;
    item.en = novo;
    item.origemEN = novo ? 'manual' : '';
    item.estadoEN = '';
    item.motivoEN = '';
    item.confirmadaEN = false;
    return true;
  }

  // A descrição PT mudou (decisão de grafia): a tradução antiga não vale mais.
  function limparTraducao(item) {
    item.en = '';
    item.es = '';
    item.origemEN = '';
    item.estadoEN = '';
    item.motivoEN = '';
    item.enAutomatico = '';
    item.confirmadaEN = false;
  }

  // Selo de uma linha editada à mão. Quando a máquina entregou acima de 40, ou quando a
  // edição ainda passa de 40, mostra os dois tamanhos: "tinha 43, agora tem 38".
  function descreverEdicao(item) {
    const agora = item.en.length;
    const tinha = (item.enAutomatico || '').length;
    const acima = agora > LIMITE_CARACTERES;
    const classe = acima ? 'selo-limite' : 'selo-manual';
    if (tinha && (tinha > LIMITE_CARACTERES || acima)) {
      let alerta = '';
      if (acima) alerta = tinha > LIMITE_CARACTERES ? ` · ainda acima de ${LIMITE_CARACTERES}` : ` · acima de ${LIMITE_CARACTERES}`;
      return { classe, texto: `Editado à mão · tinha ${tinha}, agora tem ${agora}${alerta}` };
    }
    return { classe, texto: acima ? `Editado à mão · acima de ${LIMITE_CARACTERES} (${agora})` : 'Editado à mão' };
  }

  // Selo da coluna EN: de onde veio a tradução e se pede revisão. Sem selo = montada pela
  // tabela mestra, dentro do limite. Todo selo de linha acima de 40 diz isso, para o filtro
  // "ACIMA" achar todas as linhas que o download bloqueia.
  function descreverSelo(item) {
    if (!item.en) return null;
    if (item.origemEN === 'manual') return descreverEdicao(item);
    if (item.confirmadaEN) return { classe: 'selo-manual', texto: 'Confirmada na revisão' };
    const excesso = acimaDoLimite(item.en) ? ` · acima de ${LIMITE_CARACTERES} (${item.en.length})` : '';
    if (item.origemEN === 'local') return { classe: 'selo-local', texto: `DeepL falhou; montada pela tabela${item.motivoEN ? ` (${item.motivoEN})` : ''}${excesso}` };
    if (item.estadoEN === 'revisar') return { classe: 'selo-revisar', texto: `A revisar: ${item.motivoEN}${excesso}` };
    if (excesso) return { classe: 'selo-limite', texto: `Acima de ${LIMITE_CARACTERES} caracteres (${item.en.length})` };
    if (item.origemEN === 'deepl') return { classe: 'selo-deepl', texto: `DeepL${item.motivoEN ? ` · ${item.motivoEN}` : ''}` };
    return null;
  }

  // Primeiro problema da linha, na ordem em que precisa ser resolvido; '' = pronta. Cada
  // linha conta uma vez só, então as parcelas da faixa somam o total. Acima de 40 vem antes
  // de "a revisar": só a edição resolve (não há Confirmar) e o download bloqueia. Sem
  // problema nenhum, o baixarExcel não bloqueia nem pergunta.
  function problemaDaLinha(item) {
    if (item.estadoCorrecao === 'pendente') return 'grafia';
    if (!item.en) return 'semTraducao';
    if (item.origemEN === 'local' && !item.confirmadaEN) return 'falhaDeepL';
    if (acimaDoLimite(item.en)) return 'acima';
    if (linhaMarcada(item)) return 'revisar';
    if (item.pt.length > LIMITE_CARACTERES) return 'ptAcima';
    return '';
  }

  // De onde veio o inglês, em grupos que não se sobrepõem.
  function origemDaLinha(item) {
    if (!item.en) return 'semTraducao';
    if (item.origemEN === 'manual') return 'editadas';
    if (item.confirmadaEN) return 'confirmadas';
    if (item.origemEN === 'local') return 'falhaDeepL';
    if (item.origemEN === 'deepl') return 'deepl';
    return 'tabela';
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
      if (item.en) resumo.comTraducao += 1;
      if (item.origemEN === 'manual' && (item.enAutomatico || '').length > LIMITE_CARACTERES && !acimaDoLimite(item.en)) {
        resumo.corrigidas += 1;
      }
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

  return {
    LIMITE_CARACTERES,
    normalizarEN,
    contarCaracteres,
    acimaDoLimite,
    textoContador,
    precisaTraduzir,
    linhaMarcada,
    podeConfirmar,
    confirmarTraducao,
    aplicarTraducaoAutomatica,
    registrarEdicaoEN,
    limparTraducao,
    descreverSelo,
    problemaDaLinha,
    resumirMassa,
    textoFaixaMassa,
    formatarQuantidade
  };
});
