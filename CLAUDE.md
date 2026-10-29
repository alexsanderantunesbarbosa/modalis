# MODALIS — contexto para o Claude Code

Aplicação para revisar descrições de peças de vestuário em português (SAP) e gerar
descrições em inglês (espanhol depois), combinando um glossário próprio (tabela mestra)
com a API DeepL. Leia o `README.md` para o fluxo da aplicação e este arquivo para o
estado do projeto, as decisões já tomadas e as regras de trabalho.

## Regra de trabalho (obrigatória)

- **Nunca altere arquivos sem permissão explícita. A permissão é o comando "pode codar".**
  Antes disso: analisar, propor, listar o que será mudado e aguardar.
- Ao aplicar um lote: rodar `npm test`, mostrar antes/depois e listar o que mudou.
- **Commit no git só com o comando "pode commitar"** (permissão separada do "pode codar";
  vale para commit, push, amend e merge). Ao fechar o lote, propor a mensagem e aguardar.
- O dono do projeto valida terminologia; o Claude pesquisa, propõe e justifica.
- Idioma de trabalho: português; termos da tabela em CAIXA ALTA.

## Stack e execução

- Node.js 22.15+ (exigido em `engines` no `package.json`; é a versão que tem
  `--use-system-ca`), servidor HTTP nativo (`server.js`, porta 3000), front em HTML/JS puro
  (`index.html`, `estadoMassa.js`, `script.js`), SheetJS por CDN no navegador. Dependência:
  `dotenv`.
- `npm start` sobe a API (`node server.js` serve fora da rede da empresa); `npm test` roda
  `node --test` (ver a contagem no próprio comando; inclui a API HTTP com DeepL simulada).
- Configuração só por variáveis de ambiente (`.env.example`): `HOST` (padrão `127.0.0.1`),
  `PORT`, `MAX_CORPO_BYTES`, `MAX_DESCRICOES_LOTE`, `MAX_CARACTERES_DESCRICAO`,
  `DEEPL_TAMANHO_LOTE` (1, máximo 50), `DEEPL_CHAMADAS_SIMULTANEAS` (3), `DEEPL_TENTATIVAS` (3),
  `DEEPL_ESPERA_RETRY_MS` (1000), `DEEPL_TIMEOUT_MS` (15000), `DEEPL_FALHAS_SEGUIDAS` (9),
  `DEEPL_CIRCUITO_ABERTO_MS` (30000), `DEEPL_PAUSA_429_MS` (2000), `DEEPL_PAUSA_MAXIMA_429_MS`
  (30000), `DEEPL_PACIENCIA_429_MS` (120000).
- O plano Free da DeepL responde 429 até em chamadas sequenciais sem intervalo (visto em
  23/10/2026); por isso as novas tentativas com espera são parte do caminho normal.
- **Medição de 23/10/2026 (100 descrições reais da IN27, DeepL real):** obediência ao
  glossário enviado no `context` cai com o tamanho do lote: 87% (1 por chamada), 81% (5),
  74% (10), 70% (25), 68% (50). Com 50, CINTURA MÉDIA virou MEDIUM WAIST, GOLA ALTA virou
  HIGH NECK e FUSÔ ficou sem traduzir. Por isso o padrão é 1 por chamada, e o glossário
  nativo da DeepL (item 5 da fila) sobe de prioridade: é o que permite lotes grandes sem
  perder qualidade e corrige os 13% ignorados mesmo com contexto específico. Dados em
  `comparacao-contexto.json` e `curva-tamanho-lote.json` (scratchpad da sessão; refazer se
  precisar, custa ~20 mil caracteres).
- A tabela foi sincronizada com a planilha v2 em 22/10/2026 (`tabelaMestra.js` = 806
  entradas, 16 índices; DE ALÇA = STRAPPY entrou em 24/10/2026). Ao receber arquivos do Desktop, conferir se o JS acompanha a planilha.
- `.env` com `DEEPL_API_KEY` (chave `:fx` = plano Free). Nunca versionar chaves.
- Validação TLS ligada (23/10/2026): na rede da empresa iniciar com `npm start`
  (`node --use-system-ca server.js`). Pendências de segurança conhecidas (ver README):
  CORS aberto e sem autenticação; ambas viram obrigatórias na publicação. Só uso local por enquanto.
- Repositório privado desde 23/10/2026; `package.json` com `private: true` e
  `license: UNLICENSED`.

## Arquivos principais

| Arquivo | Papel |
|---|---|
| `tabelaMestra.js` | Glossário: literal `indices` (16 índices) + derivados `termosGlossario`, `expressoesCompostas`, `dicionarioTermos`. Função `adicionarTermos` existe para uso futuro. |
| `processadorTexto.js` | Matching dos termos no texto (expressão mais longa vence; empate → índice menor), sentido dos termos com contexto (`resolverSentido`), montador da frase em inglês (`montarTraducao`), montagem do `context` para a DeepL e fallback local `processarTraducaoLocal` (em EN, é o próprio `montarTraducao`). Chave normalizada e regex de cada termo são preparadas **uma vez** no carregamento (`chavesPreparadas`, com cache em `prepararTermo`; medido 23/10/2026: 2.464 descrições em 400 ms, antes 14.400 ms). `montarLotesParaTraducao` deduplica descrições, monta lotes de até `tamanhoMaximo` e nunca mistura dois sentidos do mesmo termo (MOLETOM = SWEATSHIRT vs FLEECE) no mesmo lote; com 50 por lote o corpus real dá 50 lotes, o mínimo teórico. |
| `correcoesOrtograficas.js` | Sugestões de grafia (24 regras + colapso de palavra repetida em sequência); nunca aplicadas sem aceite do usuário. |
| `server.js` | API em camadas: `lerConfiguracao` (tudo por env; `MOTOR_PRINCIPAL` tabela/deepl), `lerCorpoJson` (Buffer único, limite de bytes → 413), validação por rota antes de qualquer chamada externa (400), `criarClienteDeepL` (timeout, resposta validada, erros `fatal` para 401/403/456 e `repetivel` para 429/5xx/rede), `comNovasTentativas` (1 s, 2 s… com **disjuntor** para rede/timeout/5xx: 9 falhas seguidas suspendem a DeepL por 30 s; e **freio global** para 429: pausa compartilhada que dobra de 2 s a 30 s ou segue o Retry-After, repetindo até 2 min sem sucesso; o 429 nunca abre o disjuntor), `source_lang=PT` em toda chamada, `criarLimitador` (chamadas simultâneas, **um limite por servidor**, não por requisição; a tradução individual tem prioridade na fila), cancelamento cooperativo quando o cliente desiste (`AbortController` no `close` da resposta), `criarServicoTraducao` (lotes de `DEEPL_TAMANHO_LOTE` descrições, padrão 1, processados em paralelo, fallback local **por lote**; após erro fatal os lotes seguintes vão direto ao motor local; resposta traz `estatisticas`), `criarServicoTraducao` com a tabela como motor principal (só o que ela não cobre vai à DeepL) e `validarEstrutura` na volta (palavra da montagem ausente, peça a mais como PANTS, ou ordem diferente da estrutura → `revisar`; várias peças ou nenhuma peça sempre `revisar`), tabela de rotas e `criarServidor({ config, fetchImpl, silencioso })` exportado para testes. Resposta por linha: `origem` (tabela/deepl/local), `estado` (tabela/deepl/revisar/acima-de-40), `motivo`. Rotas: `/api/traduzir` (devolve `termos` aplicados), `/api/traduzir-massa`, `/api/sugerir-correcoes`, `GET /api/glossario`. Cada resposta traz `origem` (`deepl`/`local`) e um motivo curto; o detalhe vai para o log JSON. Escuta em `127.0.0.1` por padrão. |
| `index.html`, `styles.css`, `script.js` | Interface com a linguagem visual do START (barra preta, painéis cinza, botões azul/verde, tabelas com borda) e, desde 29/10/2026, nos mesmos tamanhos do START (Bootstrap 3: barra 50 px, nome 18, menu 14, título 24, texto 14, campos 34; medidos nos prints do dono), com espaços verticais enxutos para a tela Individual caber sem rolar até com o Windows em 150%. Na barra, o M do logo La Moda (SVG redesenhado a partir do logo, com sombra dupla para o relevo); o ícone de tradução ficou só no cabeçalho do Glossário. Elemento com atributo `hidden` e `display` no CSS precisa da regra `[hidden] { display: none }` (a caixa "Termos do glossário aplicados" aparecia vazia por isso). Três abas sempre visíveis: Individual, Em massa e Glossário (estilo relatório, com busca, filtro por índice/tipo e exportação). CSS próprio, sem Bootstrap. "Aplicar todas as correções" pede confirmação (a DESCRIÇÃO corrigida vai para o SAP). `TEXTO ECOM` exportado = descrição. O botão "Traduzir" (sem idioma no nome, o ES vem depois) envia só as linhas pendentes e vira "Traduzir pendentes (N)"; edição manual marca `origemEN = 'manual'` ("Editado à mão") e a linha não é reenviada; importar fica bloqueado durante a tradução e uma resposta de planilha antiga é descartada. Desde 24/10/2026: contador "38/40" no canto das células EN/ES (CSS `::after` com `data-contador`, fora do texto da célula); a edição grava a linha ao sair da célula (`focusout`), Enter desce de linha (Shift+Enter sobe), colar vira texto simples e soltar arrastado é bloqueado; botão "Confirmar" nas linhas a revisar/DeepL falhou até 40; a faixa de status é recalculada a partir de todas as linhas a cada mudança (bege com pendências, verde quando o download passa, presa no topo) e o progresso tem prioridade durante a tradução; no download, os bloqueios vêm antes da pergunta. |
| `estadoMassa.js` | Regras da tabela em massa sem DOM, num único global `EstadoMassa` (no Node, `module.exports`), carregado antes do `script.js`: normalização e contador, selo de cada linha (inclui "Editado à mão · tinha 43, agora tem 38", com o "tinha" vindo de `enAutomatico`, o texto da máquina), edição manual, confirmação (`confirmadaEN`), `problemaDaLinha` (uma pendência por linha, nesta ordem: grafia, sem tradução, falha da DeepL, acima de 40, a revisar, PT acima de 40; as parcelas da faixa somam o total) e o texto da faixa (`resumirMassa`, `textoFaixaMassa`). "Acima de 40" vem do tamanho do texto gravado, não do `estadoEN` do servidor, e todo selo de linha acima de 40 diz o excesso (o filtro "ACIMA" acha tudo que o download bloqueia). |
| `docs/decisoes-glossario-2026-10-22.md` | Registro completo das decisões de terminologia, categorização e estrutura da frase. |
| `docs/glossario-setor-pt-en-es.tsv` | Lista PT/EN/ES do setor (403 linhas). O **espanhol** fica aqui para a feature ES. |
| `docs/amostras/` | Planilhas das coleções IN27 e AI27 (base de teste; AI27 traz EN anterior, de qualidade desigual). |
| `tabela-mestra-modalis-2026-10-22-v2.xlsx` | Exportação da tabela para revisão humana (não é fonte de verdade). |

A fonte de verdade do glossário é `tabelaMestra.js`. O glossário nativo da DeepL ainda
não é usado; a decisão é usá-lo depois, sincronizado a partir da tabela.

## Tabela mestra — modelo

Cada termo: `{ pt, en, status, tipo, contexto? }`. `tipo` é `termo` (uma palavra) ou
`expressao` (tem espaço, hífen ou barra). `status` FECHADO é aplicado; VALIDAR é ignorado.
Hoje: **806 entradas, todas FECHADO**, 16 índices.

| Índice | Nome | Posição na frase EN (ordem aprovada em 24/10/2026) |
|---|---|---|
| 1 | Categorias de peça | peça (núcleo) |
| 2 | Modelagem / fit | 3 |
| 3 | Modelagens de calça / short / bermuda | 9, colado à peça (STIRRUP LEGGINGS); expressões com a peça dentro (CALÇA PIJAMA) são a própria peça |
| 4 | Comprimento | 2 quando descritivo (MID-LENGTH, CROPPED, LONGLINE); MINI/MIDI/MAXI/SUPER MIDI ficam colados à palavra da peça (DENIM MINI SKIRT); expressões com a peça dentro (SAIA CURTA) são a própria peça |
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
`contexto` (JEANS, MOLETOM, GOLA ALTA).

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
  (`resolverSentido` em `processadorTexto.js`), sem listas fixas de peças no código.
- A preposição muda o papel, não a palavra: BLUSA DE ALÇA = STRAPPY BLOUSE (adjetivo),
  VESTIDO COM ALÇAS = DRESS WITH STRAPS (detalhe). Derivar palavra (STRAP → STRAPPY) é
  vocabulário e mora na tabela; mover palavra é regra do montador.

## Estrutura da frase em inglês (especificação aprovada em 24/10/2026)

**A tabela mestra é o motor.** O MODALIS monta a frase a partir dos termos casados
(`montarTraducao` em `processadorTexto.js`); a DeepL só entra quando há palavra fora da
tabela, e o resultado dela passa por validação. Glossário nativo da DeepL garante
vocabulário, não ordem; por isso a estrutura é nossa.

`[nome de linha] [rise] [comprimento descritivo] [fit] [manga] [gola/decote] [construção]
[acabamento/estampa] [tecido] [modelo] PEÇA (MINI/MIDI/MAXI colado à palavra da peça)
[WITH detalhe AND detalhe] [WITHOUT detalhe]`

As preposições do português dão o papel do termo: **COM X** = detalhe no fim (WITH X);
**DE/EM + tecido** = material antes da peça; **termo solto** = adjetivo na posição do índice;
**SEM X** = WITHOUT X; dentro de um detalhe, o modificador vem antes (COM PALA BORDADA →
WITH EMBROIDERED YOKE; COM BOTÕES EM METAL → WITH METAL BUTTONS); "E" repete o papel do
termo anterior. Expressões da tabela prevalecem sobre a regra (COM CAPUZ = HOODED é adjetivo).
Fusões em calça e short: tecido JEANS → JEANS/JORTS, tecido MOLETOM → SWEATPANTS/SWEAT
SHORTS; MOLETOM (peça) + CAPUZ → HOODIE; peça específica absorve a genérica (TOP CORTININHA
→ TRIANGLE TOP). Acima de 40 caracteres: marcado, nunca cortado.

Estados de `montarTraducao`: `tabela` (montada, uma peça, ≤ 40), `acima-de-40`,
`desconhecida` (palavra fora da tabela, fica no fim em PT), `varias-pecas`, `sem-peca`.
No corpus IN27+AI27 (2.464 distintas): 89,8% `tabela`, 6,6% desconhecida, 2,5% acima de 40,
1,1% várias peças (KIT, SLEEP, ANÁGUA, CAMISA PIJAMA: casos para a tabela ou revisão).

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
- Pendência de tradução: PALHA DE SEDA = SILK STRAW (confirmar o tecido).
- Teste prático de 22/10/2026: a DeepL ignora parte do `context` (manteve SHORT JEANS em vez
  de JORTS, acrescentou PANTS em CALÇA JEANS). Decidido e feito em 24/10/2026: a tabela
  mestra é o motor e a DeepL fica só para o que ela não cobre (ver "Estrutura da frase").

## Pendências anotadas em 22/10/2026 (teste prático do dono do projeto)

- Hífen inconsistente nos termos em inglês (MID-RISE, V-NECK, HIGH-CUT com hífen; outros
  compostos sem). Decidir uma regra e aplicar na tabela de uma vez.
- Algumas descrições ainda saem erradas no teste em massa (a maioria ficou certa). Coletar
  exemplos na próxima sessão e levar para o conjunto de referência (item 4 da fila).
- Tela "Em massa": aprovada, mas o dono quer uma segunda rodada de refino no visual.
- Glossário: a coluna ES vem da lista do setor (395 de 806 termos); o restante fica vazio até
  a feature de espanhol.

## Contexto de uso e roteiro até o piloto (dezembro de 2026)

Setor: Garantia da Informação (15 pessoas). Fluxo: a modelo prova a peça → pós-prova roda
pelos setores → ficha final, onde se arruma a descrição PT no SAP e se preenchem EN, ES,
texto e-commerce e composição PT/EN/ES. O MODALIS entra no pós-prova: baixa-se o relatório
da coleção do SAP (como `docs/amostras/`), traduz-se em massa e a planilha exportada sobe
ao SAP por uma transação da TI. Coleções têm 1.000 a 2.000 peças e duram ~3 meses; a
próxima está prevista para 17/12/2026, com a tradução no começo de dezembro. Hoje roda só
no PC do dono; a publicação na rede (HOST=0.0.0.0, autenticação, HTTPS por proxy, front
servido pelo servidor, serviço do Windows, backup do banco de traduções, plano DeepL) fica
para depois do piloto. O dono não é da TI; a hospedagem depende de pedir máquina, DNS e
certificado à TI.

Decisões de 23/10/2026:
- As 8 colunas exportadas são o contrato da transação. A TI grava `DESCRIÇÃO` no SAP, e a
  coluna exportada é a **corrigida** (as correções aceitas no MODALIS vão para o SAP).
- `TEXTO ECOM` = descrição (sem limite); o texto completo do START pode entrar depois.
- Espanhol **neutro/internacional**: sem regionalismos fortes (mezclilla, vaquero, playera,
  remera, braga); preferir a forma entendida em toda a América Latina e na Espanha (JEANS,
  CAMISETA, SUDADERA, PANTALÓN, TRAJE DE BAÑO, TIRO ALTO/MEDIO/BAJO); quando não houver
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
   **Glossário nativo DeepL (item 5 da fila) antecipado para logo após a composição**: é
   o que destrava lotes grandes e a obediência de 100% aos termos fechados.
2. Composição PT → EN/ES por regras, testada contra o gabarito da IN27.
3. Qualidade do EN: itens 1 a 4 da fila abaixo (conjunto de referência aprovado pelo líder).
4. Memória de traduções (item 7) e rascunho salvo no navegador (beforeunload + localStorage).
5. Espanhol das descrições: campo `es` na tabela (proposta minha + validação do dono),
   motor parametrizado por idioma (a ordem do ES segue a do PT), limite de 40 para ES.
6. Ensaio geral com a AI27 e piloto na coleção real.

Perguntas abertas (TI e líder, a partir de 26/10/2026): o relatório do SAP sempre vem com
linha de cabeçalho? (a AI27 veio sem e a ferramenta a rejeita); como a empresa hospeda
sistemas internos como o START; quem valida os 806 termos em espanhol.

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
   Pendências que sobraram: "várias peças" (KIT, SLEEP, ANÁGUA, CAMISA PIJAMA) precisam de
   expressões na tabela ou de decisão; as 162 descrições com palavra fora da tabela
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
2. Reordenação do fallback por índice (spec acima) + campo opcional `posicao`.
3. Validador de estrutura: termos presentes + ordem; divergência marca a linha como
   "estrutura a revisar" na interface, nunca saída silenciosa.
4. Conjunto de referência: ~50 descrições com tradução aprovada pelo negócio, como teste.
5. Glossário nativo DeepL (API v3, `POST /v3/glossaries`, dicionário PT→EN, `source_lang`
   obrigatório, `glossary_id` em `/v2/translate`): script de sincronização a partir da
   tabela (só FECHADO, sem contexto, dedupe) + teste comparativo contra o conjunto de
   referência. (Os lotes de até 50 textos por chamada já existem desde 23/10/2026.)
6. Depois: espanhol (base em `docs/glossario-setor-pt-en-es.tsv`), ECOM, composição.
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
9. **Lista de referências a revisar no topo da aba Em massa** (pedido do dono em 24/10/2026):
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

## Testes

- `tests/processadorTexto.test.js`, `tests/montador.test.js`, `tests/correcoesOrtograficas.test.js`,
  `tests/server.test.js` e `tests/estadoMassa.test.js` (descrito abaixo). O do servidor usa `criarServidor({ fetchImpl, config, silencioso })`
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
- Qualquer mudança na tabela ou nas regras deve manter os testes verdes e, quando
  existir, passar pelo conjunto de referência.
