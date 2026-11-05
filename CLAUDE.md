# MODALIS — contexto para o Claude Code

Aplicação para revisar descrições de peças de vestuário em português (SAP) e gerar
descrições em inglês e em espanhol (o espanhol desde 29/10/2026), combinando um glossário próprio (tabela mestra)
com a API DeepL. Leia o `README.md` para o fluxo da aplicação e este arquivo para o
estado do projeto, as decisões já tomadas e as regras de trabalho.

## Regra de trabalho (obrigatória)

- **Nunca altere arquivos sem permissão explícita. A permissão é o comando "pode codar".**
  Antes disso: analisar, propor, listar o que será mudado e aguardar.
- Ao aplicar um lote: rodar `npm test`, mostrar antes/depois e listar o que mudou.
- **Commit no git só com o comando "pode commitar"** (permissão separada do "pode codar";
  vale para commit, push, amend e merge). Ao fechar o lote, propor a mensagem e aguardar.
- O dono do projeto valida terminologia; o Claude pesquisa, propõe e justifica.
- **Padrão do projeto: o de empresa de software grande** (processo, código, documentação,
  licença e repositório; dono, 04/11/2026). Ao propor, dizer qual é a prática de mercado; sem
  complicar um sistema de 1 operador, explicando quando ela ainda não compensa no tamanho atual.
- Idioma de trabalho: português; termos da tabela em CAIXA ALTA.
- **CLAUDE.md e README.md sempre atualizados no mesmo lote da mudança** (dono, 04/11/2026). O
  `.env.example` é o manual da TI: toda variável nova entra nele com o padrão e o porquê. Nunca
  escrever contagem (termos, regras, testes, corpus) sem conferir na hora.
- Mensagens de commit em **Conventional Commits** desde 04/11/2026 (`feat:`, `fix:`, `docs:`,
  `test:`, `refactor:`, `chore:`); os commits anteriores usam, na maioria, `feature/...:`
  (alguns `feat:` e `fix/`).
- Branches: o trabalho do dia corre na `developer`; a `main` é a versão estável e recebe a
  `developer` por merge, com tag de versão (decisão de 04/11/2026; primeiro merge em 04/11/2026, tag `v0.9.0`).

## Stack e execução

- Node.js 22.15+ (exigido em `engines` no `package.json`; é a versão que tem
  `--use-system-ca`), servidor HTTP nativo (`server.js`, porta 3000), front em HTML/JS puro
  (`index.html`, `estadoMassa.js`, `script.js`), SheetJS 0.18.5 por CDN no navegador (versão com
  falhas conhecidas na leitura de planilhas; a troca por cópia local 0.20.x foi decidida em
  04/11/2026). Dependência: `dotenv`.
- `npm start` sobe a API (`node server.js` serve fora da rede da empresa); `npm test` roda
  `node --test` (ver a contagem no próprio comando; inclui a API HTTP com DeepL simulada).
- Configuração só por variáveis de ambiente (`.env.example`): `DEEPL_API_KEY`, `MOTOR_PRINCIPAL`
  (`tabela` padrão | `deepl`), `HOST` (padrão `127.0.0.1`), `PORT` (3000), `MAX_CORPO_BYTES`
  (1000000), `MAX_DESCRICOES_LOTE` (10000), `MAX_CARACTERES_DESCRICAO` (200),
  `DEEPL_TAMANHO_LOTE` (1, máximo 50), `DEEPL_CHAMADAS_SIMULTANEAS` (3), `DEEPL_TENTATIVAS` (3),
  `DEEPL_ESPERA_RETRY_MS` (1000), `DEEPL_TIMEOUT_MS` (15000), `DEEPL_FALHAS_SEGUIDAS` (9),
  `DEEPL_CIRCUITO_ABERTO_MS` (30000), `DEEPL_PAUSA_429_MS` (2000), `DEEPL_PAUSA_MAXIMA_429_MS`
  (30000), `DEEPL_PACIENCIA_429_MS` (120000). Número inválido (0, negativo, texto) volta ao
  padrão sem aviso.
- O plano Free da DeepL responde 429 até em chamadas sequenciais sem intervalo (visto em
  23/10/2026); por isso as novas tentativas com espera são parte do caminho normal.
- **Medição de 23/10/2026 (100 descrições reais da IN27, DeepL real):** obediência ao
  glossário enviado no `context` cai com o tamanho do lote: 87% (1 por chamada), 81% (5),
  74% (10), 70% (25), 68% (50). Com 50, CINTURA MÉDIA virou MEDIUM WAIST, GOLA ALTA virou
  HIGH NECK e FUSÔ ficou sem traduzir. Por isso o padrão é 1 por chamada. O glossário nativo
  da DeepL (item 5 da fila) é o que permitiria lotes grandes sem perder qualidade; desde
  24/10 a tabela é o motor e só ~7,3% das descrições distintas chegam à DeepL (180 de 2.464
  no EN: desconhecida, várias peças e sem peça; medido em 05/11/2026), então ele fica na fila
  depois do banco SQLite (dono, 04/11/2026). Dados brutos em `pesquisa/medicao-deepl-2026-10-23/`
  (local, fora do git, com `LEIAME.md`; são a linha de base do TCC; refazer custa ~20 mil
  caracteres).
- A tabela foi sincronizada com a planilha v2 em 22/10/2026 (`tabelaMestra.js` = 806
  entradas, 16 índices; DE ALÇA = STRAPPY entrou em 24/10/2026; 807 desde 30/10/2026; 814 desde 31/10/2026, com a família A FIO; 828 desde 03/11/2026; 830 em 04/11/2026; 835 desde 05/11/2026). Ao receber arquivos do Desktop, conferir se o JS acompanha a planilha.
- `.env` com `DEEPL_API_KEY` (chave `:fx` = plano Free). Nunca versionar chaves.
- Validação TLS ligada (23/10/2026): na rede da empresa iniciar com `npm start`
  (`node --use-system-ca server.js`). Pendências de segurança conhecidas (ver README): CORS
  aberto (fecha antes do piloto, quando o servidor passar a servir a tela; item 13 da fila),
  SheetJS 0.18.5 por CDN (cópia local 0.20.x antes do piloto) e sem autenticação (obrigatória
  na publicação; não haverá login por enquanto, dono, 04/11/2026). Só uso local por enquanto.
- Repositório privado desde 23/10/2026 (GitHub `alexsanderantunesbarbosa/modalis`). **Software
  proprietário e confidencial, de autoria de Alexsander Antunes Barbosa** (04/11/2026):
  `package.json` com `name: modalis`, `version: 0.9.0`, `author`, `private: true` e
  `license: UNLICENSED`; arquivo `LICENSE` (PT e EN); uma linha de autoria no topo de cada
  arquivo de código. A La Moda usa o MODALIS conforme acordo com o autor, a formalizar por
  escrito na publicação (um e-mail do líder do setor basta: o código é do autor, os dados das
  coleções são da La Moda, e o uso dos dados fora da empresa e na DeepL está autorizado). O
  `LICENSE` não afirma a titularidade até esse acordo; quando ele existir, atualizar o texto.
- Pasta local: `modalis` (renomeada de `Projeto Tradutor` pelo dono em 04/11/2026). A memória
  do Claude Code fica num endereço montado pelo caminho da pasta: ela foi copiada para
  `~/.claude/projects/c--Users-alexsander-barbosa-Desktop-modalis/memory/`, e o histórico das
  conversas anteriores ficou em `~/.claude/projects/c--Users-alexsander-barbosa-Desktop-Projeto-Tradutor/`.
  Se uma sessão nova começar sem memória, copiar de lá.

## Arquivos principais

| Arquivo | Papel |
|---|---|
| `tabelaMestra.js` | Glossário: literal `indices` (16 índices) + derivados `termosGlossario`, `expressoesCompostas`, `dicionarioTermos` (EN e ES, os dois derivados dos termos). Cada termo tem `es` numa linha só (desde 29/10/2026; ver "Tabela mestra — modelo"). Função `adicionarTermos` existe para uso futuro. |
| `processadorTexto.js` | Matching dos termos no texto (expressão mais longa vence; empate → índice menor; desde 05/11/2026, a expressão que embute a peça genérica, como VESTIDO MIDI, cede a uma peça mais específica da mesma família, como SLIP DRESS, e o casamento é refeito sem ela, desde que nenhuma palavra vire desconhecida: `expressaoQueCede` e `cobreTrecho`), sentido dos termos com contexto (`resolverSentido`), peças e absorção da genérica pela específica, as mesmas para os dois idiomas (`pecasDaDescricao`: só peças soltas, sem preposição, de mesma última palavra no inglês, nunca através de E ou "+"; o EN tira a genérica, e o ES não repete o começo comum, `semRepetir`; a peça negada por SEM nunca é o núcleo), "+" como conectivo próprio nos dois idiomas (separa peças como o E, sem repetir o papel do termo anterior; desde 05/11/2026, antes o EN o apagava), montador da frase em inglês (`montarTraducaoEN`) e em espanhol (`montarTraducaoES`, desde 29/10/2026), com `montarTraducao(texto, idioma)` escolhendo um ou outro e `analisarDescricao` (termos, conectivos e palavras desconhecidas) servindo aos dois, montagem do `context` para a DeepL (no ES, com a forma já concordada) e fallback local `processarTraducaoLocal` (é o próprio `montarTraducao`). Chave normalizada e regex de cada termo são preparadas **uma vez** no carregamento (`chavesPreparadas`, com cache em `prepararTermo`; medido 23/10/2026: 2.464 descrições em 400 ms, antes 14.400 ms). `montarLotesParaTraducao` deduplica descrições, monta lotes de até `tamanhoMaximo` e nunca mistura dois sentidos do mesmo termo (MOLETOM = SWEATSHIRT vs FLEECE) no mesmo lote; com 50 por lote o corpus real dá 50 lotes, o mínimo teórico. |
| `correcoesOrtograficas.js` | Sugestões de grafia (53 regras: 24 até 22/10, 28 de 03/11/2026 e LENGHT em 04/11/2026, + colapso de palavra repetida em sequência; SLIPDRESS → SLIP DRESS, de 03/11, saiu em 05/11/2026 porque a DESCRIÇÃO fica como o setor escreve e quem traduz é a tabela); nunca aplicadas sem aceite do usuário. |
| `server.js` | API em camadas: `lerConfiguracao` (tudo por env; `MOTOR_PRINCIPAL` tabela/deepl), `lerCorpoJson` (Buffer único, limite de bytes → 413), validação por rota antes de qualquer chamada externa (400), `criarClienteDeepL` (timeout, resposta validada, erros `fatal` para 401/403/456 e `repetivel` para 429/5xx/rede), `comNovasTentativas` (1 s, 2 s… com **disjuntor** para rede/timeout/5xx: 9 falhas seguidas suspendem a DeepL por 30 s; e **freio global** para 429: pausa compartilhada que dobra de 2 s a 30 s ou segue o Retry-After, repetindo até 2 min sem sucesso; o 429 nunca conta para as 9 falhas do disjuntor, mas depois de 2 min de 429 sem nenhum sucesso o circuito abre por 30 s, com mensagem própria; enquanto nenhuma chamada der certo, um novo 429 depois disso reabre o circuito na hora, porque o início da sequência de 429 só zera com um sucesso), `source_lang=PT` em toda chamada, `criarLimitador` (chamadas simultâneas, **um limite por servidor**, não por requisição; a tradução individual tem prioridade na fila), cancelamento cooperativo quando o cliente desiste (`AbortController` no `close` da resposta), `criarServicoTraducao` (motor principal `tabela`: só o que ela não cobre vai à DeepL, em lotes de `DEEPL_TAMANHO_LOTE` descrições, padrão 1, processados em paralelo; fallback local **por lote**; após erro fatal os lotes seguintes vão direto ao motor local; resposta traz `estatisticas`) e `avaliarDeepL`/`validarEstrutura` na volta (palavra da montagem ausente, peça a mais como PANTS, ou ordem diferente da estrutura → `revisar`; várias peças ou nenhuma peça sempre `revisar`), tabela de rotas e `criarServidor({ config, fetchImpl, silencioso })` exportado para testes. Idiomas aceitos: EN, EN-US, EN-GB e ES; o validador tem conectivos e palavras de peça por idioma (no ES a peça é a 1ª palavra). Resposta por linha: `origem` (tabela/deepl/local), `estado` (tabela/deepl/revisar/acima-de-40), `motivo`. Rotas: `/api/traduzir` (devolve `termos` aplicados: `{ pt, en }` ou `{ pt, es }`), `/api/traduzir-massa`, `/api/sugerir-correcoes`, `GET /api/glossario`. Cada resposta traz `origem` (`tabela`/`deepl`/`local`) e um motivo curto; o detalhe vai para o log JSON. Escuta em `127.0.0.1` por padrão. |
| `index.html`, `styles.css`, `script.js` | Interface com a linguagem visual do START (barra preta, painéis cinza, botões azul/verde, tabelas com borda) e, desde 29/10/2026, nos mesmos tamanhos do START (Bootstrap 3: barra 50 px, nome 18, menu 14, título 24, texto 14, campos 34; medidos nos prints do dono), com espaços verticais enxutos para a tela Individual caber sem rolar até com o Windows em 150% (desde 30/10, com EN e ES: o painel do resultado não tem título, a ajuda do campo foi para o placeholder e os termos aplicados ficam recolhidos num `details` com a contagem; medido no Edge sem janela em 1920×940, 1280×627 e 390×760). Na barra, o M do logo La Moda (SVG redesenhado a partir do logo, com sombra dupla para o relevo), branco, e o nome no cinza do menu (`#9d9d9d`), como o START. Desde 29/10/2026 (padrões de UX): nenhum `alert`/`confirm` do navegador; tudo passa por janelas próprias no estilo do modal do START (`abrirJanela`/`avisar`/`confirmar`: promessa, Esc, clique fora, foco preso e devolvido); "Download bloqueado" lista as linhas com "Ir para a linha" e "Exportar com linhas marcadas?" pede confirmação (`verificarExportacao`); "Aplicar todas as correções" mostra antes/depois com a palavra trocada em destaque; copiar mostra o retorno no próprio botão. Em massa: barra de filtros rápidos "Mostrar:" (contagens iguais às da faixa, somada aos filtros por coluna) e lista "Referências que precisam de revisão" (item 9 da fila). Glossário: cabeçalho cinza como os relatórios do START (a marca "M LA MODA" saiu em 30/10/2026, a pedido do dono), colunas técnicas recolhidas em "Mostrar detalhes técnicos", trecho buscado marcado, ES vazio = "—", títulos das colunas presos no topo. Elemento com atributo `hidden` e `display` no CSS precisa da regra `[hidden] { display: none }` (a caixa "Termos do glossário aplicados" aparecia vazia por isso). Três abas sempre visíveis: Individual, Em massa e Glossário (estilo relatório, com busca, filtro por índice/tipo e exportação). CSS próprio, sem Bootstrap. "Aplicar todas as correções" pede confirmação (a DESCRIÇÃO corrigida vai para o SAP). `TEXTO ECOM` exportado = descrição. O botão "Traduzir" (sem idioma no nome: traduz EN e ES) envia só as linhas pendentes e vira "Traduzir pendentes (N)"; edição manual marca `origemEN = 'manual'` ("Editado à mão") e a linha não é reenviada; importar fica bloqueado durante a tradução e uma resposta de planilha antiga é descartada. Desde 24/10/2026: contador "38/40" no canto das células EN/ES (CSS `::after` com `data-contador`, fora do texto da célula); a edição grava a linha ao sair da célula (`focusout`), Enter desce de linha (Shift+Enter sobe), colar vira texto simples e soltar arrastado é bloqueado; botão "Confirmar" nas linhas a revisar/DeepL falhou até 40; a faixa de status é recalculada a partir de todas as linhas a cada mudança (bege com pendências, verde quando o download passa, presa no topo) e o progresso tem prioridade durante a tradução; no download, os bloqueios vêm antes da pergunta. |
| `estadoMassa.js` | Regras da tabela em massa sem DOM, num único global `EstadoMassa` (no Node, `module.exports`), carregado antes do `script.js`: normalização e contador, selo de cada linha (inclui "Editado à mão · tinha 43, agora tem 38", com o "tinha" vindo de `enAutomatico`, o texto da máquina), edição manual, confirmação (`confirmadaEN`), `problemaDaLinha` (uma pendência por linha, nesta ordem: grafia, sem tradução, falha da DeepL, acima de 40, a revisar, PT acima de 40; as parcelas da faixa somam o total), o texto da faixa (`resumirMassa`, `textoFaixaMassa`), os filtros rápidos (`FILTROS_RAPIDOS`, `passaNoFiltro`, `contarFiltros`) e o que bloqueia ou pede confirmação no download (`verificarExportacao`; um teste garante que "faixa verde" = nenhum bloqueio e nenhuma marcada). Desde 29/10/2026 cada linha tem EN e ES com os mesmos controles (`origemES`, `estadoES`, `motivoES`, `esAutomatico`, `confirmadaES`; as funções recebem o idioma, padrão EN); sem idioma, `precisaTraduzir` e `linhaMarcada` respondem pela linha (algum dos dois), e a faixa, os filtros e o download olham os dois. A tradução de um idioma não apaga o outro. "Acima de 40" vem do tamanho do texto gravado, não do `estadoEN` do servidor, e todo selo de linha acima de 40 diz o excesso (o filtro "ACIMA" acha tudo que o download bloqueia). |
| `docs/decisoes-glossario-2026-10-22.md` | Registro completo das decisões de terminologia, categorização e estrutura da frase. |
| `docs/decisoes-espanhol-2026-10-29.md` | Regras do espanhol (R1–R20), concordância, estados, medição no corpus e pendências. |
| `docs/glossario-setor-pt-en-es.tsv` | Lista PT/EN/ES antiga do setor (403 linhas): só histórico; o ES vale o da tabela. |
| `docs/amostras/` | Planilhas das coleções IN27 e AI27 (base de teste; AI27 traz EN anterior, de qualidade desigual). Fora do git (dados da empresa). |
| `docs/Traduções - Planilha Base.xlsx` | Modelo das 8 colunas da transação do SAP, com as instruções de cada uma (local, fora do git). Os cabeçalhos (REFERÊNCIA, DESCRIÇÃO, Descrição EN, Descrição ES, TEXTO ECOM, Z_COMPOS_PT, Z_COMPOS_EN, Z_COMPOS_ES) são iguais aos do export em `script.js` (conferido em 04/11/2026); base do teste de contrato previsto no item 13 da fila. |
| `README.md` | Apresentação para quem chega ao repositório (problema, como funciona, início rápido, configuração essencial, contrato da planilha, arquitetura, testes, segurança, problemas comuns, limitações, roadmap), reescrita em 04/11/2026. Só o que serve a esse leitor: o detalhe de configuração mora no `.env.example`, as decisões e medições ficam em `docs/` e aqui, e os detalhes de tela ficam para um futuro guia do usuário. Sempre atualizado junto com o código. |
| `LICENSE` | Aviso de software proprietário e confidencial (PT e EN): autoria de Alexsander Antunes Barbosa, uso interno pela La Moda conforme acordo, dados das coleções da La Moda. |
| `.env.example` | Manual de configuração da TI: toda variável, com padrão e motivo; nenhuma chave real. |
| `historico/` | Arquivos antigos e planilhas fora de uso, guardados pelo dono só para leitura (desde 04/11/2026): conversas com Gemini e ChatGPT, protótipos, base antiga de 645 termos e requisitos (ago a out/2026); a exportação v2 da tabela de 22/10 (806 entradas); as revisões do ChatGPT de 29/10 e 30/10; a planilha de validação de 30/10; e cópias das amostras. Ignorada pelo git (um dos arquivos tem uma chave antiga da DeepL, já revogada). **Nunca é referência de tradução nem de decisão**; as planilhas de revisão que estão aqui só servem de insumo para a sessão de SIM/NÃO (item 13 da fila). |
| `referencias/` | Material de terceiros: os slides das aulas de Arquitetura de Software do dono (desde 04/11/2026). Ignorada pelo git (direito autoral do professor). O material de Backend fica no GitHub do professor (`placidodaniel/backend-aulas-satc`). |
| `pesquisa/` | Dados de medição para o TCC (descrições reais da empresa; hoje a medição da DeepL de 23/10/2026, com `LEIAME.md`). Ignorada pelo git; o dono mantém cópia de segurança fora do computador. |

A fonte de verdade do glossário é `tabelaMestra.js`. O glossário nativo da DeepL ainda
não é usado; a decisão é usá-lo depois, sincronizado a partir da tabela.

## Tabela mestra — modelo

Cada termo: `{ pt, en, status, tipo, contexto?, es }`, com `es = { texto, classe, genero?, numero?, formas?, adjetivo? }` (classe peca/substantivo/flexivel/invariavel/nome_proprio; `formas` ms/fs/mp/fp só no flexível; `adjetivo` = COM/DE antes dele cai). O ES veio da planilha `glossario-espanhol-modalis-2026-10-29.xlsx` (Área de Trabalho do dono). Desde 30/10/2026 a tabela é editada direto: o script de 29/10 desfaria as decisões de 30/10 (ver `docs/decisoes-espanhol-2026-10-29.md`). `tipo` é `termo` (uma palavra) ou
`expressao` (tem espaço, hífen ou barra). `status` FECHADO é aplicado; VALIDAR é ignorado.
Hoje: **835 entradas, todas FECHADO**, 16 índices (30/10: + COM FLORES, COM CORTE A LASER, COM BOJO, LOOSE LOW SLIM; − RISE, HIGH e LOW sozinhos: inglês de cintura no PT vai para revisão em vez de virar erro silencioso. 31/10: A FIO = RAW-EDGE / SIN REMATAR, borda crua, não DISTRESSED, + CORTE/COM CORTE/CORTES/RECORTE(S)/BARRA/ACABAMENTO A FIO. 03/11: + VESTIDO REGATA, VESTIDO POLO, CAMISA PIJAMA, SAIA PAREÔ, MEIA CALÇA = TIGHTS / PANTIMEDIAS, MEIA FINA = SHEER TIGHTS, ESTAMPA LISTRADA, DE FLORES, COM DRAPEADO, COM FRANZIDO(S), MILITAR, COM CINTURA ALTA/MÉDIA/BAIXA; − COM ESTAMPA, que partia ESTAMPA FLORAL/LOCAL. 04/11: COM CINTURA X sem gênero no ES, + COM DRAPEADOS, VESTIDO SLIP = SLIP DRESS / VESTIDO LENCERO. 05/11: + SLIPDRESS, SLIP DRESS, VESTIDO SLIP DRESS, SLIP depois de vestido (`contexto` VESTIDO) e FIRENZE (tecido); ver `docs/decisoes-espanhol-2026-10-29.md`). **O EN/ES antigo das planilhas do setor nunca é referência de tradução** (dono, 03/11).

| Índice | Nome | Posição na frase EN (ordem aprovada em 24/10/2026) |
|---|---|---|
| 1 | Categorias de peça | peça (núcleo) |
| 2 | Modelagem / fit | 3 |
| 3 | Modelagens de calça / short / bermuda | 9, colado à peça (STIRRUP LEGGINGS); expressões com a peça dentro (CALÇA PIJAMA) são a própria peça |
| 4 | Comprimento | 2 quando descritivo (MID-LENGTH, CROPPED, LONGLINE); MINI/MIDI/MAXI/SUPER MIDI ficam colados à palavra da peça (DENIM MINI SKIRT); SHORT/LONG vão antes da peça inteira quando ela tem mais de uma palavra (SHORT DENIM SKIRT, SHORT TANK TOP, SHORT POLO DRESS; decisão de 03/11/2026) e ficam colados em peça de uma palavra (TWILL SHORT JUMPSUIT); expressões com a peça dentro (SAIA CURTA) são a própria peça |
| 5 | Cintura / rise | 1 |
| 6 | Mangas | 4 |
| 7 | Gola / decote / alças | 5 |
| 8 | Tecidos / materiais | 8 (com ou sem DE/EM); com COM vira detalhe |
| 9 | Texturas / acabamentos / estampas | 7 |
| 10 | Detalhes / aviamentos | solto: 7, descreve a peça (EMBROIDERED SWEATSHIRT); com COM: detalhe no fim (`WITH … AND …`) |
| 11 | Bolsos | igual ao 10 |
| 12 | Construção / partes da peça | solto: 6, adjetivo (HOODED, WRAP, SEAMLESS); com COM: detalhe (WITH OPEN BACK). A preposição decide; não precisa de campo `posicao` |
| 13 | Nomes de linha / licenças | 0, no começo da frase, nunca traduzido (SELENE TRIANGLE TOP) |
| 14 | Modelagens de jaqueta / casaco | 9, colado à peça (PUFFER JACKET); sozinho é a peça (PARKA) |
| 15 | Acessórios / outros produtos | peça (núcleo) |
| 16 | Praia / íntimo / dormir | peça (núcleo) |

Critério de classificação: "como veste?" → 2; "qual modelo?" → 3 ou 14; "que parte ou
construção?" → 12; material → 8; acabamento/estampa/cor → 9; aviamento → 10.
**Não** existem termos duplicados entre índices (um PT = um índice), exceto entradas com
`contexto` (JEANS, MOLETOM, GOLA ALTA, SLIP).

Princípios do glossário:
- Termos atômicos sempre existem sozinhos (CALÇA, SAIA, JEANS, MOLETOM…).
- Expressões compostas existem por cima (SAIA CURTA = SHORT SKIRT, SAIA JEANS = DENIM
  SKIRT); a expressão mais longa prevalece.
- SHORT JEANS, SHORTS JEANS e BERMUDA JEANS = JORTS (decisão de 22/10/2026, pela economia
  de caracteres).
- BERMUDA = SHORTS, igual a SHORT (decisão de 22/10/2026: o setor já usa assim; o inglês não
  marca o comprimento). Fusão idiomática só para JEANS e MOLETOM; nos demais tecidos a
  tradução é tecido + peça (SHORT SARJA → TWILL SHORTS).
- Fusões idiomáticas (inglês troca a palavra): CALÇA JEANS = JEANS, CALÇA DE MOLETOM =
  SWEATPANTS, MOLETOM CANGURU = HOODIE, SHORT SAIA = SKORT, RETA SLIM = SLIM STRAIGHT.
- Formas curtas por causa do limite de 40 caracteres: HALTER (não HALTER NECK), LIGHT/HEAVY
  (não LIGHTWEIGHT/HEAVYWEIGHT), HOTFIX (termocolante), SHIMMER (brilho).
- Contexto por `contexto`: JEANS = DENIM (tecido) | JEANS (calça); MOLETOM = SWEATSHIRT |
  SWEATPANTS | HOODIE | FLEECE; GOLA ALTA = TURTLENECK | HIGH COLLAR (AGASALHO). Desde
  24/10/2026 o motor resolve esses sentidos olhando as outras peças da própria descrição
  (`resolverSentido` em `processadorTexto.js`). JEANS e MOLETOM leem a peça pelos índices da
  tabela; o agasalho da GOLA ALTA usa o índice 14 e também a regex `AGASALHO` do código
  (JACKET, COAT, VEST, PARKA, WINDBREAKER, BOMBER, PUFFER). SLIP = SLIP (anágua, R19) | SLIP
  DRESS / VESTIDO LENCERO (`contexto` VESTIDO: a peça mais próxima antes dele tem VESTIDO e a
  palavra logo antes do SLIP não é conectivo; desde 05/11/2026). SLIPDRESS e SLIP DRESS ficam
  assim na DESCRIÇÃO (o setor escreve assim) e a tabela os traduz.
- A preposição muda o papel, não a palavra: BLUSA DE ALÇA = STRAPPY BLOUSE (adjetivo),
  VESTIDO COM ALÇAS = DRESS WITH STRAPS (detalhe). Derivar palavra (STRAP → STRAPPY) é
  vocabulário e mora na tabela; mover palavra é regra do montador.

## Estrutura da frase em inglês (especificação aprovada em 24/10/2026)

**A tabela mestra é o motor.** O MODALIS monta a frase a partir dos termos casados
(`montarTraducao` em `processadorTexto.js`); a DeepL só entra quando há palavra fora da
tabela, e o resultado dela passa por validação. Glossário nativo da DeepL garante
vocabulário, não ordem; por isso a estrutura é nossa.

`[nome de linha] [rise] [comprimento descritivo] [fit] [manga] [gola/decote] [construção]
[acabamento/estampa] [tecido] [modelo] PEÇA (MINI/MIDI/MAXI colado à palavra da peça; SHORT/LONG
antes da peça de mais de uma palavra, desde 03/11/2026)
[WITH detalhe AND detalhe] [WITHOUT detalhe]`

As preposições do português dão o papel do termo: **COM X** = detalhe no fim (WITH X);
**DE/EM + tecido** = material antes da peça; **termo solto** = adjetivo na posição do índice;
**SEM X** = WITHOUT X; dentro de um detalhe, o modificador vem antes (COM PALA BORDADA →
WITH EMBROIDERED YOKE; COM BOTÕES EM METAL → WITH METAL BUTTONS); "E" repete o papel do
termo anterior. Expressões da tabela prevalecem sobre a regra (COM CAPUZ = HOODED é adjetivo).
Fusões em calça e short: tecido JEANS → JEANS/JORTS, tecido MOLETOM → SWEATPANTS/SWEAT
SHORTS, mas não com COM ou SEM (CALÇA SEM MOLETOM → PANTS WITHOUT FLEECE); MOLETOM (peça) +
CAPUZ → HOODIE; peça específica absorve a genérica da mesma família, a de mesma última palavra no
inglês (TOP CORTININHA → TRIANGLE TOP; VESTIDO MIDI SLIP DRESS → SLIP MIDI DRESS, com a expressão
VESTIDO MIDI desfeita em VESTIDO + MIDI), só entre peças soltas: nunca através de um E ou "+"
(VESTIDO E VESTIDO REGATA são duas peças, e a linha vai para revisão), nem com peça negada
(VESTIDO SEM SLIP DRESS = DRESS WITHOUT SLIP DRESS, revisão) ou depois de DE. A peça negada nunca
é o núcleo: SEM VESTIDO sozinho fica "sem peça". Acima de 40 caracteres: marcado, nunca cortado.

Estados de `montarTraducao`: `tabela` (montada, uma peça, ≤ 40), `acima-de-40`,
`desconhecida` (palavra fora da tabela, fica no fim em PT), `varias-pecas`, `sem-peca`.
No corpus IN27+AI27 (2.464 distintas, EN, medido em 05/11/2026): 90,2% `tabela` (2.222), 6,4%
desconhecida (158), 2,5% acima de 40 (62), 0,8% várias peças (20: KIT 5, SLEEP 4, ANÁGUA 3,
VESTIDO/MACACÃO BLAZER 2, CORSET JEANS, BLUSA REGATA, CALÇA LEGGING, GOLA CACHECOL, LINGERIE e
BODY BODY, palavra repetida; CAMISA PIJAMA entrou na tabela em 03/11, e as 4 com SLIP saem pela
tabela desde 05/11) e 0,1% sem peça (2). Esse corpus é o mesmo que ensinou a tabela: a medida
honesta é numa coleção fora dele (a de dezembro).

Exemplos de referência (todos são testes em `tests/montador.test.js`):
- BERMUDA JEANS COMFORT CINTURA MÉDIA → MID-RISE COMFORT JORTS
- VESTIDO CURTO MANGA LONGA COM BRILHOS → LONG SLEEVE SHORT DRESS WITH SHIMMER
- MOLETOM MANGA LONGA COM CAPUZ → LONG SLEEVE HOODIE
- LEGGING FUSÔ CINTURA ALTA SEAMLESS → HIGH-RISE SEAMLESS STIRRUP LEGGINGS
- CASACO MÉDIO DE PELO COM METAL → MID-LENGTH FAUX FUR COAT WITH METAL
- CALÇA PIJAMA LISTRADA → STRIPED PAJAMA PANTS
- SAIA JEANS MINI CINTURA BAIXA COM BRILHO → LOW-RISE DENIM MINI SKIRT WITH SHIMMER
- JAQUETA PUFFER MÉDIA GOLA ALTA → MID-LENGTH HIGH COLLAR PUFFER JACKET

## Estado em 22/10/2026 (histórico)

- Lote de validação IN27/AI27 + lista do setor + recategorização aplicados.
- Cobertura dos termos fechados nas 2.464 descrições únicas das coleções: 92%
  (restante: erros de digitação, agora cobertos pelas correções, e JEANS/MOLETOM
  não contíguos, que dependem da regra geral abaixo).
- ~~Pendência de tradução: PALHA DE SEDA = SILK STRAW (confirmar o tecido)~~ encerrada pelo
  dono em 04/11/2026: fica SILK STRAW / PAJA DE SEDA.
- Teste prático de 22/10/2026: a DeepL ignora parte do `context` (manteve SHORT JEANS em vez
  de JORTS, acrescentou PANTS em CALÇA JEANS). Decidido e feito em 24/10/2026: a tabela
  mestra é o motor e a DeepL fica só para o que ela não cobre (ver "Estrutura da frase").

## Pendências anotadas em 22/10/2026 (teste prático do dono do projeto)

- Hífen inconsistente nos termos em inglês (MID-RISE, V-NECK, HIGH-CUT com hífen; outros
  compostos sem). Decidir uma regra e aplicar na tabela de uma vez. Ainda aberto em
  04/11/2026: a regra pesquisada em 03/11 (hífen antes da peça, aberto depois de WITH) pede um
  campo de forma de detalhe (57 termos); lote separado, com a lista para o dono aprovar.
- Algumas descrições ainda saem erradas no teste em massa (a maioria ficou certa). Coletar
  exemplos na próxima sessão e levar para o conjunto de referência (item 4 da fila).
- Tela "Em massa": aprovada, mas o dono quer uma segunda rodada de refino no visual.
- Glossário: a coluna ES vinha da lista do setor (395 de 806 termos); desde 29/10/2026 vem da
  própria tabela (hoje 835 de 835). A pendência original (feature de espanhol) foi resolvida em
  29/10 (commit `fee012b`).

## Contexto de uso e roteiro até o piloto (dezembro de 2026)

Setor: Garantia da Informação (15 pessoas). Fluxo: a modelo prova a peça → pós-prova roda
pelos setores → ficha final, onde se arruma a descrição PT no SAP e se preenchem EN, ES,
texto e-commerce e composição PT/EN/ES. O MODALIS entra no pós-prova: baixa-se o relatório
da coleção do SAP (como `docs/amostras/`), traduz-se em massa e a planilha exportada sobe
ao SAP por uma transação da TI. Coleções têm 1.000 a 2.000 peças e duram ~3 meses; a
próxima está prevista para 17/12/2026, com a tradução no começo de dezembro. Hoje roda só
no PC do dono; a publicação na rede (HOST=0.0.0.0, autenticação, HTTPS por proxy, serviço do
Windows, backup do banco de traduções) fica para depois do piloto; servir a tela pelo próprio
servidor foi antecipado para antes do piloto (item 13), e o plano da DeepL segue Free (dono,
04/11/2026). O dono não é da TI; a hospedagem depende de pedir máquina, DNS e
certificado à TI (a TI hesita, mas o MODALIS vai para produção: dono, 04/11/2026).

Piloto (decisões de 04/11/2026): o dono opera sozinho, no PC dele; a meta é a **planilha da
coleção 100% pronta**, inclusive a composição EN/ES (que ainda não tem código); se a transação
da TI não ficar pronta a tempo, ele sobe as linhas no SAP uma a uma. Evitar rodar a coleção no
dia da N1 de Arquitetura do dono (02/12/2026). O dono pensa em usar o MODALIS como TCC: as
métricas do piloto e uma medição fora do corpus (a coleção de dezembro, rodada uma vez antes
de qualquer termo novo) precisam ser guardadas. O Projeto 2 da faculdade (microsserviços) não
usa o MODALIS.

Decisões de 23/10/2026:
- As 8 colunas exportadas são o contrato da transação. A TI grava `DESCRIÇÃO` no SAP, e a
  coluna exportada é a **corrigida** (as correções aceitas no MODALIS vão para o SAP). O
  modelo com os 8 cabeçalhos e as instruções está em `docs/Traduções - Planilha Base.xlsx`.
- `TEXTO ECOM` = descrição (sem limite); o texto completo do START pode entrar depois.
- Espanhol **neutro/internacional**: sem regionalismos fortes (mezclilla, vaquero, playera,
  remera, braga); preferir a forma entendida em toda a América Latina e na Espanha (JEANS,
  CAMISETA, SUDADERA, PANTALÓN, TRAJE DE BAÑO, TIRO ALTO/MEDIO/BAJO; substituído em parte:
  JEANS tecido = DENIM em 29/10, JEANS só para a calça, e MAIÔ = TRAJE DE BAÑO ENTERO em 30/10,
  ver `docs/decisoes-espanhol-2026-10-29.md`); quando não houver
  forma neutra, a planilha de proposta marca a opção recomendada e a alternativa. A base
  antiga do setor (`docs/glossario-setor-pt-en-es.tsv`) é insumo, não fonte de verdade:
  cobre 395 dos 806 termos, tem erros (COSECHADA, BOTTONES, FLENCOS) e mistura países. O
  EN dessa base é ignorado.
- Composição: `Z_COMPOS_PT` tem formato fixo (`* PARTE pct FIBRA pct FIBRA; PARTE …`),
  ~15 fibras e ~40 partes; tradução por dicionário e regra, sem DeepL. A IN27 traz EN/ES
  manuais de 506 composições distintas, que servem de gabarito depois de limpar erros de
  digitação (1000% COTTO, 765 POLYESTER, LINNING).

Escopo de dezembro (ordem "valor entregue se o tempo acabar"):
1. Servidor confiável e rápido: Lote 0 (TLS, repositório), Lote 1 (fronteira) e Lote 2
   (3 chamadas em voo, novas tentativas, sem repetidas, termos pré-compilados, só
   pendentes, edição manual preservada; lote de 50 disponível mas desligado pela medição
   acima) **feitos em 23/10/2026**.
   O glossário nativo DeepL (item 5 da fila) chegou a ser antecipado para logo após a
   composição; desde que a tabela virou o motor (24/10), só ~7,3% das descrições distintas vão
   à DeepL, e ele fica na fila depois do banco SQLite (dono, 04/11/2026).
2. Composição PT → EN/ES por regras, testada contra o gabarito da IN27.
3. Qualidade do EN: itens 1 a 4 da fila abaixo. O conjunto de referência aprovado pelo líder às
   cegas sai de uma amostra da coleção de dezembro (fora do corpus que ensinou a tabela), então
   a aprovação acontece logo depois da rodada do piloto (ver item 4 da fila).
4. Rascunho salvo no navegador (beforeunload + localStorage), antes do piloto. A memória de
   traduções (item 7) vai para depois do piloto, junto com o SQLite (decisão de 04/11/2026).
5. ~~Espanhol das descrições~~ **feito em 29/10/2026** (commit `fee012b` em 31/10, depois da revisão do dono; ver `docs/decisoes-espanhol-2026-10-29.md`). Faltam, da planilha de termos novos: CALÇA LEGGING, COM TOUCA e COM ABOTOAMENTO DUPLO (os 3 TODO de `tests/montadorEspanhol.test.js`), GOLA CACHECOL e FAIXA como produto (MEIA CALÇA e COM DRAPEADO entraram em 03/11). SLEEP/SLIP seguem iguais ao PT até o dono decidir (R19). Plano original: campo `es` na tabela (proposta minha + validação do dono),
   motor parametrizado por idioma (a ordem do ES segue a do PT), limite de 40 para ES.
6. Ensaio geral com a AI27 e piloto na coleção real.

Perguntas de 26/10/2026, respondidas pelo dono no mesmo dia: o formato de referência é o da
IN27 (a AI27 veio de outra transação, sem cabeçalho); a hospedagem vai à TI só com o sistema
pronto e dentro das normas (autenticação, HTTPS, 12-factor, logs; pedir máquina, nome DNS e
certificado); o ES é validado pelo Claude com o varejo global de moda (Zara, Mango, H&M…),
sem o dono validar termo a termo.

## Modelos e esforço por tarefa (aprovado em 24/10/2026)

| Tarefa | Modelo | Esforço |
|---|---|---|
| Buscar onde algo está, contar, ler um dado | haiku (agentes `buscador` e `consulta` em `.claude/agents/`) | low |
| Resumir, redigir docs, extrair tabelas | sonnet | medium |
| Revisão adversarial, verificar um achado | opus | high |
| Implementar código concorrente, regras do glossário, arquitetura | modelo da sessão | high |

Ultracode (`/effort ultracode on`, só o dono liga): desligado por padrão; vale para auditoria
ampla, revisão de código concorrente ou de segurança antes de commit importante e validação
de lote grande de terminologia. Dentro de um workflow: levantadores em sonnet, verificadores
em opus. Perguntas conceituais nunca viram workflow.

## Fila de código (ordem acordada)

1. ~~Regras de contexto~~, 2. ~~montador por índice~~ e 3. ~~validador~~: **feitos em
   24/10/2026** (commits `5429d35` e o seguinte). Ficam abaixo como histórico da decisão.
   Pendências que sobraram (medido em 05/11/2026): "várias peças" (KIT, SLEEP, ANÁGUA,
   VESTIDO/MACACÃO BLAZER, CORSET JEANS, BLUSA REGATA, CALÇA LEGGING, GOLA CACHECOL, LINGERIE e
   BODY BODY; CAMISA PIJAMA entrou em 03/11 e o SLIP saiu da lista em 05/11) precisam de expressões na tabela ou de decisão; as 158 descrições com palavra fora da tabela
   geram a lista de termos novos para validação (TSHIRT, LENGHT etc. são erros de grafia
   já cobertos pelas correções; STRAIGHT, LEG, BASE, ASSIMETRIA, PESCOÇO são termos novos).
1. **Regras de contexto em `processadorTexto.js`** (histórico):
   - JEANS → DENIM sempre que houver outra peça (índices 1/14/16) e CALÇA JEANS não casar;
     substitui as listas fixas de `escolherContexto` (hoje escapam SHORT, BERMUDA, COLETE,
     MACACÃO, JARDINEIRA, BLAZER).
   - MOLETOM → FLEECE sempre que houver outra peça e nenhuma expressão contígua casar
     (hoje "CALÇA JOGGING … DE MOLETOM" sai "DE SWEATSHIRT").
   - GOLA ALTA → HIGH COLLAR quando a peça é agasalho (índice 14, JAQUETA, CASACO, COLETE);
     a entrada com `contexto: "AGASALHO"` já existe na tabela.
   - MOLETOM + CAPUZ (não contíguos) → HOODIE, suprimindo HOODED.
   - Ler "existe outra peça" da própria tabela, não de listas no código.
2. ~~Reordenação do fallback por índice (spec acima) + campo opcional `posicao`~~ (histórico:
   feito em 24/10/2026; a posição vem do índice em `posicaoNaFrase` e o campo `posicao` não foi
   necessário).
3. ~~Validador de estrutura~~ (histórico: feito em 24/10/2026, `validarEstrutura` em server.js):
   termos presentes + ordem; divergência marca a linha como "estrutura a revisar" na
   interface, nunca saída silenciosa.
4. Conjunto de referência: ~50 descrições com tradução aprovada pelo negócio, como teste. Hoje
   existem 47 casos EN (`ACEITACAO` em `tests/montador.test.js`, decididos com o dono a partir
   de 24/10/2026: 46 em 24/10 e 1 em 30/10) e 69 casos ES (`tests/montadorEspanhol.test.js`).
   **Aberto:** falta a aprovação do líder do setor, às cegas (sem ver a saída do MODALIS), que
   o TCC exige (dono, 04/11/2026); ela acontece logo depois da rodada do piloto, sobre uma
   amostra sorteada da coleção de dezembro.
5. Glossário nativo DeepL (API v3, `POST /v3/glossaries`, dicionário PT→EN, `source_lang`
   obrigatório, `glossary_id` em `/v2/translate`): script de sincronização a partir da
   tabela (só FECHADO, sem contexto, dedupe) + teste comparativo contra o conjunto de
   referência. (Os lotes de até 50 textos por chamada já existem desde 23/10/2026.)
6. ~~Espanhol~~ feito em 29/10/2026 (campo `es` da tabela; a lista do setor é só histórico).
   Depois: ECOM, composição (a composição subiu para antes do piloto: item 13).
7. **Memória de traduções** (pedido do dono em 23/10/2026): guardar as traduções aprovadas
   num banco local (SQLite, chave = descrição PT normalizada) e reaproveitá-las em entradas
   iguais antes de chamar a DeepL. Ganhos: tempo, cota (a IN27 tem 274 descrições repetidas
   em 1.622) e consistência entre coleções. Cuidados: invalidar quando a tabela mestra mudar
   (guardar a versão/hash da tabela junto) e distinguir tradução aprovada de tradução bruta.
8. **STRAIGHT na tabela mestra** (pedido do dono em 24/10/2026, para a sessão seguinte):
   `STRAIGHT` = STRAIGHT no índice 3, como RETA. Hoje "CALÇA JEANS STRAIGHT CINTURA MÉDIA" vai
   à DeepL (STRAIGHT fica fora da tabela) e sai "STRAIGHT-LEG JEANS, MID-RISE", marcada pelo
   validador como "ordem diferente"; com o termo, a tabela monta "MID-RISE STRAIGHT JEANS".
   Teste em `tests/montador.test.js`. Junto, propor para validação os outros termos novos
   (LEG, BASE, ASSIMETRIA, PESCOÇO…).
9. ~~**Lista de referências a revisar no topo da aba Em massa**~~ **feito em 29/10/2026**, junto com os filtros rápidos (pedido do dono em 24/10/2026):
   igual à lista de "Referências que precisam de correção" (`renderCorrecoesPendentes`), em
   letra pequena; depois de corrigir e traduzir, lista as refs com pendência de tradução (a
   revisar, acima de 40, DeepL falhou, sem tradução) e o clique leva à linha exata.
   Reaproveitar `problemaDaLinha` de `estadoMassa.js`.
10. **Tabela na hora, DeepL por trás** (pedido do dono em 24/10/2026; prioridade antes do
    piloto, porque o setor não tem paciência para esperar): as linhas que a tabela cobre
    (~90%) aparecem de uma vez, as que vão à DeepL ficam "traduzindo…" e são preenchidas
    conforme chegam; edição e Confirmar liberados durante a tradução. Cuidado de
    concorrência: resposta da DeepL nunca sobrescreve linha editada ou confirmada no meio
    (hoje `precisaTraduzir` já protege a gravação). Medir antes e depois o tempo de uma
    coleção real. Combina com o item 7 (memória em SQLite: só traduções aprovadas, chave =
    PT normalizada, invalidar pela versão da tabela) e com o 5 (lotes maiores, menos 429).
    (04/11/2026: ficou fora da ordem proposta para antes do piloto no item 13, porque a tabela
    monta a IN27 inteira em ~5 s e só ~7,3% vai à DeepL; volta se o ensaio medir uma coleção
    lenta demais. O dono confirma.)
11. **Ordenar o Glossário por PT, EN ou ES** (pedido do dono em 30/10/2026): clicar no título
    da coluna PT, EN ou ES ordena a tabela por ela (A→Z, de novo Z→A), com a seta de
    ordem no título. A linha inteira acompanha (as outras colunas mudam junto) e a
    ordem vale junto com a busca e os filtros de índice e tipo; a exportação sai na ordem da
    tela. Cuidados: ordenar com `localeCompare` em pt/es (acentos e Ñ no lugar certo,
    ÁRBOL junto de ARBOL); ES vazio ("—") vai para o fim; título ordenável é botão,
    acessível por teclado, com `aria-sort`. Entra **depois** da sessão única de SIM/NÃO que
    congela a terminologia (12/11/2026); ela absorve os itens em aberto das planilhas de 29/10
    e 30/10, todas encerradas como planilhas em 04/11/2026 (a de validação de 30/10 e a revisão
    do ChatGPT de 29/10 estão em `historico/`; a do espanhol de 29/10,
    `glossario-espanhol-modalis-2026-10-29.xlsx`, segue na Área de Trabalho do dono).
12. **Em massa mais limpa depois das correções** (pedido do dono em 30/10/2026): quando não
    houver mais correção de grafia pendente, a coluna "Correção" some, e a descrição
    corrigida passa a ocupar a coluna "Descrição PT" no lugar da original, com a legenda
    pequena embaixo que já existe hoje (a original continua visível ali). Cuidados: a
    exportação continua mandando a DESCRIÇÃO corrigida (contrato da transação); a coluna
    volta se uma nova planilha trouxer correções; filtros e a lista de referências não
    podem depender da coluna escondida. Mesma fase do item 11.
13. **Decisões de 04/11/2026** (revisões de organização, das aulas da faculdade e do painel
    profissional/TCC; ordem proposta, a confirmar com o dono a cada lote):
    - **Antes do piloto:** ~~as 4 correções da revisão de 03/11~~ (feitas em 04 e 05/11/2026:
      COM CINTURA X sem gênero no ES, COM DRAPEADOS, teste de MEIA TAÇA e SLIPDRESS, que virou
      SLIP DRESS pela tabela com a DESCRIÇÃO intacta, mais SLIP depois de vestido e FIRENZE) →
      sessão única de SIM/NÃO (as 26 decisões do Claude Desktop, os casos de borda com
      ocorrência no corpus, STRAIGHT, os itens abertos das planilhas de 29/10 e 30/10, MEIA TAÇA
      e as pendências de 04 e 05/11 em `docs/decisoes-espanhol-2026-10-29.md`) e congelamento da terminologia em
      12/11/2026 → composição PT → EN/ES (esqueleto guiado pelo gabarito das 506 composições da
      IN27) → tela servida pelo próprio servidor por lista fixa de arquivos (sai o CORS `*` e a
      URL fixa `localhost:3000`; o servidor passa a exigir JSON e a conferir o Host) com rota
      de saúde → SheetJS 0.20.x em cópia local → rascunho salvo no navegador → arquivo de
      métricas a cada exportação (dado do TCC) → teste de integridade da tabela e teste de
      contrato das 8 colunas → CI no GitHub Actions e tags de versão.
    - **Depois do piloto:** tabela mestra como dado (JSON) e SQLite com memória de traduções,
      auditoria e histórico (junto do item 7); tipos com JSDoc + `// @ts-check` (TypeScript
      só como checagem no CI, sem build); feature "adicionar termo" no Glossário (submenu
      "Consultar | Adicionar termo" no padrão do START ou menu próprio, a decidir com um print
      do START) com atalho "Adicionar ao glossário" nas palavras desconhecidas da Em massa;
      docs de arquitetura (mapa conceito → arquivo, ADRs); hífen no EN (lote próprio).
    - **Fora:** login/autenticação por enquanto; trocar o plano da DeepL (segue Free: a
      dependência cai com a tabela e a memória de traduções).
14. **Organização do repositório** (revisão de 04/11/2026: 2 propostas, mapa de impacto e
    juiz; o essencial já é profissional). Feito em 04/11: nome `modalis` 0.9.0, autoria e
    `LICENSE`. O resto, na ordem:
    - **Quando houver uma janela curta (o dono decide):** `.gitattributes` (`* text=auto
      eol=lf`; `*.bat` e `*.cmd` com `eol=crlf`; `*.xlsx`, `*.pdf` e `*.png` binários) e `git add
      --renormalize .`, em commit próprio e **antes** de mover qualquer arquivo; `.editorconfig`
      (UTF-8, LF, 2 espaços, newline final; `[*.md]` sem trim); `package.json` sem `main` e com
      `test` = `node --test "tests/**/*.test.js"` (não usar `node --test tests/`, que quebra no
      Node 24; sem argumento, o runner varre `historico/`); `.claude/settings.local.json` no
      `.gitignore`; `.vscode/settings.json` (opção de Python) trocado por `.vscode/extensions.json`
      recomendando EditorConfig; `CHANGELOG.md` no formato Keep a Changelog, começando na 0.9.0.
    - **Antes do piloto, junto com o item 13:** a tela vai para `public/` (git mv sem editar os
      arquivos movidos; ajustar `tests/estadoMassa.test.js`, que lê o `index.html` e os scripts
      por nome) no mesmo lote em que o servidor passa a servi-la por lista fixa; SheetJS 0.20.3
      em `public/vendor/sheetjs-0.20.3/` com a licença dele; teste de contrato das 8 colunas
      (mapeamento de `baixarExcel` vira função pura em `estadoMassa.js`); CI no GitHub Actions
      (ubuntu e windows × Node 22.15.0 e 24; `permissions: contents: read`) e Dependabot com
      `target-branch: developer`; `docs/arquitetura.md` (serve também à N1 de 02/12).
    - **Depois do piloto:** `src/` no mesmo lote da divisão do `server.js` (config, rotas,
      estáticos, cliente e resiliência da DeepL, serviço, memória SQLite), com o `dotenv`
      carregado por caminho a partir do `__dirname` e revisão Opus antes do commit;
      `data/tabela-mestra.json` (o `tabelaMestra.js` vira carregador e validador com a mesma API);
      `scripts/` com o primeiro script real; `@ts-check` + `npm run tipos` + ESLint + cobertura;
      trocar os `onclick` por `addEventListener` e ligar a CSP; `docs/adr/` só para decisões
      novas; `docs/licoes-aprendidas.md`; CLAUDE.md enxuto; guia do usuário antes de abrir ao setor.
    - **Não fazer:** `src/` antes do piloto; renomear `script.js` ou trocar camelCase por
      kebab-case; `.nvmrc` (o PC roda o Node 24 e o `engines` diz 22.15+; a matriz do CI cobre);
      pastas vazias "para o futuro"; Docker, TypeScript com build, bundler, monorepo, pastas
      MVC vazias, husky/commitlint.

## Testes

- `tests/processadorTexto.test.js`, `tests/montador.test.js`, `tests/correcoesOrtograficas.test.js`,
  `tests/server.test.js`, `tests/estadoMassa.test.js` (descrito abaixo) e `tests/montadorEspanhol.test.js` (29/10/2026: dados do `es`, os 69 casos de referência ES, com os que dependem de termo novo como TODO, e as regras da frase uma a uma). O do servidor usa `criarServidor({ fetchImpl, config, silencioso })`
  com uma DeepL falsa e porta aleatória; `subir()` fixa todos os parâmetros da DeepL, então
  nada do `.env` influencia a suíte.
- Revisão adversarial do Lote 2 (24/10/2026): 13 achados confirmados e corrigidos no mesmo
  dia; o grave era retry sem disjuntor (rede caída = horas de espera para um resultado que
  seria 100% local). Lição: multiplicar tentativas × timeout × lotes ÷ paralelismo antes de
  escolher os padrões, e todo retry precisa de um circuit breaker.
- Revisão cética do montador (24/10/2026, 1 agente Opus): 8 achados, todos corrigidos no mesmo
  commit; os graves eram o "E" passando o conectivo para expressões que já têm o seu (SEM BOLSO E
  COM CINTO), COM CAPUZ não propagando o papel de detalhe e o validador sem checar ordem e peça a
  mais. Lição: toda regra de linguagem precisa de casos com conectivos encadeados nos testes.
- `tests/estadoMassa.test.js` (24/10/2026) cobre as regras da tabela em massa sem DOM ("só
  pendentes", "manual", confirmação, selo "tinha/agora", faixa) e carrega `estadoMassa.js` e
  `script.js` juntos num `vm`, na ordem do `index.html`: scripts clássicos dividem o escopo
  global, e um nome repetido entre eles derrubaria a página com SyntaxError sem o
  `node --test` perceber. Ainda sem teste automatizado: a parte de eventos (focusout, Enter,
  colagem), conferida em 24/10/2026 num Edge headless dirigido pelo protocolo de depuração
  (script no scratchpad da sessão; refazer se precisar).
- Revisão adversarial do lote contador/faixa (24/10/2026, 4 revisores + 4 verificadores):
  8 achados confirmados e corrigidos no mesmo dia; o médio era a faixa presa no topo
  escondendo a célula de destino do Shift+Enter (o `focus()` do navegador não desconta
  elementos sticky). Lição: todo elemento sticky ou fixed pede um teste de foco por teclado
  embaixo dele; e trava global (`traduzindo`) vira referência ao objeto travado
  (`itensEmTraducao`), senão congela a tela de quem não tem nada a ver com a operação.
- Incidente de 24/10/2026: o dono rodou uma coleção e "deu 429 e não traduziu nada". Causa:
  o disjuntor tratava o 429 como queda (9 recusas em 3 s abriam o circuito e a coleção
  inteira ia para o motor local). Lição: **429 e "fora do ar" são falhas diferentes com
  remédios opostos** (esperar e repetir vs falhar rápido). O front passou a enviar em partes
  de 100 descrições distintas (`TAMANHO_PARTE` em script.js) com progresso, e para de
  enviar quando a DeepL está suspensa, deixando o restante pendente.
- Caso de borda aprendido em 23/10/2026: um teste cuja promessa nunca resolve não trava só
  o teste, deixa o servidor aberto e trava o processo inteiro no final. Erros dentro de
  listeners de evento devem virar rejeição explícita.
- Revisão adversarial do lote do espanhol (29/10/2026, 3 revisores + 3 verificadores Opus): 18
  achados confirmados, 15 corrigidos no mesmo dia (o alto: SEM MANGA abrindo detalhe e deixando o
  adjetivo no plural, "SIN MANGAS ALARGADAS"); FLORES, CORTE A LASER e ESTAMPA LISTRADA ficaram
  para a planilha/dono (ver docs/decisoes-espanhol-2026-10-29.md). Saída EN das 2.457 descrições (extração de 29/10, corrigida para 2.464 em 30/10)
  comparada com o commit anterior: só as 2 de "NO PESCOÇO" mudaram (o NÓ que casava com a
  contração NO). Lição: o ES ao pé da letra herda os defeitos do PT (descrição cortada no meio,
  concordância errada); toda regra de concordância pede casos com SEM, com tecido e com palavra
  desconhecida antes do adjetivo.
- Revisões adversariais do lote SLIP DRESS (05/11/2026), em 2 rodadas: 4 revisores Sonnet + 4
  verificadores Opus, depois 3 + 3.
  - Confirmaram 16 e 10 achados, todos fora do corpus e corrigidos no mesmo dia. Os graves: SEM
    perdendo a negação, cessão por cima de COM, "+" herdando o papel do E e peça negada virando o
    núcleo.
  - Uma varredura de todos os pares de peças da tabela, comparada com o último commit, achou mais
    4: SAIA LÁPIS, TOP TRIANGULAR TRIANGULAR, BLAZER colado e REGATA-manga.
  - Lição: regra que junta peças pede essa varredura de pares, com cada conectivo (E, +, COM, SEM,
    DE) entre as peças. O corpus não tem esses casos, e cada correção abriu um caso novo.
- Qualquer mudança na tabela ou nas regras deve manter os testes verdes e, quando
  existir, passar pelo conjunto de referência.
