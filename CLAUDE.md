# MODALIS — contexto para o Claude Code

Aplicação para revisar descrições de peças de vestuário em português (SAP) e gerar
descrições em inglês (espanhol depois), combinando um glossário próprio (tabela mestra)
com a API DeepL. Leia o `README.md` para o fluxo da aplicação e este arquivo para o
estado do projeto, as decisões já tomadas e as regras de trabalho.

## Regra de trabalho (obrigatória)

- **Nunca altere arquivos sem permissão explícita. A permissão é o comando "pode codar".**
  Antes disso: analisar, propor, listar o que será mudado e aguardar.
- Ao aplicar um lote: rodar `npm test`, mostrar antes/depois e listar o que mudou.
- O dono do projeto valida terminologia; o Claude pesquisa, propõe e justifica.
- Idioma de trabalho: português; termos da tabela em CAIXA ALTA.

## Stack e execução

- Node.js 18+, servidor HTTP nativo (`server.js`, porta 3000), front em HTML/JS puro
  (`index.html`, `script.js`), SheetJS por CDN no navegador. Dependência: `dotenv`.
- `npm start` sobe a API (`node server.js` serve fora da rede da empresa); `npm test` roda
  `node --test` (ver a contagem no próprio comando; inclui a API HTTP com DeepL simulada).
- Configuração só por variáveis de ambiente (`.env.example`): `HOST` (padrão `127.0.0.1`),
  `PORT`, `MAX_CORPO_BYTES`, `MAX_DESCRICOES_LOTE`, `MAX_CARACTERES_DESCRICAO`,
  `DEEPL_TAMANHO_LOTE` (1, máximo 50), `DEEPL_CHAMADAS_SIMULTANEAS` (3), `DEEPL_TENTATIVAS` (3),
  `DEEPL_ESPERA_RETRY_MS` (1000), `DEEPL_TIMEOUT_MS` (15000), `DEEPL_FALHAS_SEGUIDAS` (9),
  `DEEPL_CIRCUITO_ABERTO_MS` (30000).
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
- A tabela foi sincronizada com a planilha v2 em 22/10/2026 (`tabelaMestra.js` = 805
  entradas, 16 índices). Ao receber arquivos do Desktop, conferir se o JS acompanha a planilha.
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
| `processadorTexto.js` | Matching dos termos no texto (expressão mais longa vence; empate → índice menor), regras de contexto (`escolherContexto`), montagem do `context` para a DeepL e fallback local `processarTraducaoLocal`. Chave normalizada e regex de cada termo são preparadas **uma vez** no carregamento (`termosPreparados`; medido 23/10/2026: 2.464 descrições em 400 ms, antes 14.400 ms). `montarLotesParaTraducao` deduplica descrições, monta lotes de até `tamanhoMaximo` e nunca mistura dois sentidos do mesmo termo (MOLETOM = SWEATSHIRT vs FLEECE) no mesmo lote; com 50 por lote o corpus real dá 50 lotes, o mínimo teórico. |
| `correcoesOrtograficas.js` | Sugestões de grafia (24 regras + colapso de palavra repetida em sequência); nunca aplicadas sem aceite do usuário. |
| `server.js` | API em camadas: `lerConfiguracao` (tudo por env), `lerCorpoJson` (Buffer único, limite de bytes → 413), validação por rota antes de qualquer chamada externa (400), `criarClienteDeepL` (timeout, resposta validada, erros `fatal` para 401/403/456 e `repetivel` para 429/5xx/rede), `comNovasTentativas` (1 s, 2 s… com **disjuntor**: 9 falhas seguidas suspendem a DeepL por 30 s e tudo cai no motor local na hora), `criarLimitador` (chamadas simultâneas, **um limite por servidor**, não por requisição; a tradução individual tem prioridade na fila), cancelamento cooperativo quando o cliente desiste (`AbortController` no `close` da resposta), `criarServicoTraducao` (lotes de `DEEPL_TAMANHO_LOTE` descrições, padrão 1, processados em paralelo, fallback local **por lote**; após erro fatal os lotes seguintes vão direto ao motor local; resposta traz `estatisticas`), tabela de rotas e `criarServidor({ config, fetchImpl, silencioso })` exportado para testes. Rotas: `/api/traduzir` (devolve `termos` aplicados), `/api/traduzir-massa`, `/api/sugerir-correcoes`, `GET /api/glossario`. Cada resposta traz `origem` (`deepl`/`local`) e um motivo curto; o detalhe vai para o log JSON. Escuta em `127.0.0.1` por padrão. |
| `index.html`, `styles.css`, `script.js` | Interface com a linguagem visual do START (barra preta, painéis cinza, botões azul/verde, tabelas com borda), em escala menor. Três abas sempre visíveis: Individual, Em massa e Glossário (estilo relatório, com busca, filtro por índice/tipo e exportação). CSS próprio, sem Bootstrap. "Aplicar todas as correções" pede confirmação (a DESCRIÇÃO corrigida vai para o SAP). `TEXTO ECOM` exportado = descrição. O botão "Traduzir" (sem idioma no nome, o ES vem depois) envia só as linhas pendentes e vira "Traduzir pendentes (N)"; edição manual marca `origemEN = 'manual'` ("Editado à mão") e a linha não é reenviada; importar fica bloqueado durante a tradução e uma resposta de planilha antiga é descartada. |
| `docs/decisoes-glossario-2026-10-22.md` | Registro completo das decisões de terminologia, categorização e estrutura da frase. |
| `docs/glossario-setor-pt-en-es.tsv` | Lista PT/EN/ES do setor (403 linhas). O **espanhol** fica aqui para a feature ES. |
| `docs/amostras/` | Planilhas das coleções IN27 e AI27 (base de teste; AI27 traz EN anterior, de qualidade desigual). |
| `tabela-mestra-modalis-2026-10-22-v2.xlsx` | Exportação da tabela para revisão humana (não é fonte de verdade). |

A fonte de verdade do glossário é `tabelaMestra.js`. O glossário nativo da DeepL ainda
não é usado; a decisão é usá-lo depois, sincronizado a partir da tabela.

## Tabela mestra — modelo

Cada termo: `{ pt, en, status, tipo, contexto? }`. `tipo` é `termo` (uma palavra) ou
`expressao` (tem espaço, hífen ou barra). `status` FECHADO é aplicado; VALIDAR é ignorado.
Hoje: **805 entradas, todas FECHADO**, 16 índices.

| Índice | Nome | Posição na frase EN |
|---|---|---|
| 1 | Categorias de peça | núcleo (substantivo) |
| 2 | Modelagem / fit | 2 |
| 3 | Modelagens de calça / short / bermuda | 3 |
| 4 | Comprimento | 9 (colado ao núcleo) |
| 5 | Cintura / rise | 1 |
| 6 | Mangas | 4 |
| 7 | Gola / decote / alças | 5 |
| 8 | Tecidos / materiais | 8 |
| 9 | Texturas / acabamentos / estampas | 7 |
| 10 | Detalhes / aviamentos | depois do núcleo: `WITH … AND …` |
| 11 | Bolsos | depois do núcleo |
| 12 | Construção / partes da peça | 6 como adjetivo (HOODED, WRAP, SEAMLESS) ou depois do núcleo como detalhe (WITH OPEN BACK) — exceções pedirão um campo `posicao` |
| 13 | Nomes de linha / licenças | identidade (não traduzir); posição a definir |
| 14 | Modelagens de jaqueta / casaco | 3 |
| 15 | Acessórios / outros produtos | núcleo |
| 16 | Praia / íntimo / dormir | núcleo |

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
  SWEATPANTS | HOODIE | FLEECE; GOLA ALTA = TURTLENECK | HIGH COLLAR (AGASALHO).

## Estrutura da frase em inglês (especificação)

`[rise] [fit] [modelo] [manga] [gola/decote] [construção-adjetivo] [acabamento/estampa]
[tecido] [comprimento] PEÇA [WITH detalhe AND detalhe]`

Exemplos de referência:
- BERMUDA JEANS COMFORT CINTURA MÉDIA → MID-RISE COMFORT JORTS
- VESTIDO CURTO MANGA LONGA COM BRILHOS → LONG SLEEVE SHORT DRESS WITH SHIMMER
- MOLETOM MANGA LONGA COM CAPUZ → LONG SLEEVE HOODED SWEATSHIRT
- LEGGING FUSÔ CINTURA ALTA SEAMLESS → HIGH-RISE SEAMLESS STIRRUP LEGGINGS
- CASACO MÉDIO DE PELO COM METAL → MID-LENGTH FAUX FUR COAT WITH METAL
- CALÇA PIJAMA LISTRADA → STRIPED PAJAMA PANTS

Com glossário DeepL a reordenação é do modelo; o fallback local hoje mantém a ordem do
português e precisa do reordenador por índice (item 2 da fila).

## Estado atual (22/10/2026)

- Lote de validação IN27/AI27 + lista do setor + recategorização aplicados.
- Cobertura dos termos fechados nas 2.464 descrições únicas das coleções: 92%
  (restante: erros de digitação, agora cobertos pelas correções, e JEANS/MOLETOM
  não contíguos, que dependem da regra geral abaixo).
- Pendência de tradução: PALHA DE SEDA = SILK STRAW (confirmar o tecido).
- Teste prático de 22/10/2026: a DeepL ignora parte do `context` (manteve SHORT JEANS em vez
  de JORTS, acrescentou PANTS em CALÇA JEANS). Reforça os itens 2 e 5 da fila; avaliar se o
  motor local + reordenador vira o caminho principal e a DeepL fica para o que a tabela não cobre.

## Pendências anotadas em 22/10/2026 (teste prático do dono do projeto)

- Hífen inconsistente nos termos em inglês (MID-RISE, V-NECK, HIGH-CUT com hífen; outros
  compostos sem). Decidir uma regra e aplicar na tabela de uma vez.
- Algumas descrições ainda saem erradas no teste em massa (a maioria ficou certa). Coletar
  exemplos na próxima sessão e levar para o conjunto de referência (item 4 da fila).
- Tela "Em massa": aprovada, mas o dono quer uma segunda rodada de refino no visual.
- Glossário: a coluna ES vem da lista do setor (395 de 805 termos); o restante fica vazio até
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
  cobre 395 dos 805 termos, tem erros (COSECHADA, BOTTONES, FLENCOS) e mistura países. O
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
sistemas internos como o START; quem valida os 805 termos em espanhol.

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

1. **Regras de contexto em `processadorTexto.js`** (próximo passo, já decidido):
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

## Testes

- `tests/processadorTexto.test.js`, `tests/correcoesOrtograficas.test.js` e
  `tests/server.test.js`. O do servidor usa `criarServidor({ fetchImpl, config, silencioso })`
  com uma DeepL falsa e porta aleatória; `subir()` fixa todos os parâmetros da DeepL, então
  nada do `.env` influencia a suíte.
- Revisão adversarial do Lote 2 (24/10/2026): 13 achados confirmados e corrigidos no mesmo
  dia; o grave era retry sem disjuntor (rede caída = horas de espera para um resultado que
  seria 100% local). Lição: multiplicar tentativas × timeout × lotes ÷ paralelismo antes de
  escolher os padrões, e todo retry precisa de um circuit breaker.
- Pendente do Lote 4: testes automatizados do front ("só pendentes", "manual"), via módulo
  sem DOM ou DOM mínimo em `tests/apoio/`.
- Caso de borda aprendido em 23/10/2026: um teste cuja promessa nunca resolve não trava só
  o teste, deixa o servidor aberto e trava o processo inteiro no final. Erros dentro de
  listeners de evento devem virar rejeição explícita.
- Qualquer mudança na tabela ou nas regras deve manter os testes verdes e, quando
  existir, passar pelo conjunto de referência.
