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
- `node server.js` sobe a API; `npm test` roda `node --test` (19 testes em `tests/`).
- A tabela foi sincronizada com a planilha v2 em 22/10/2026 (`tabelaMestra.js` = 805
  entradas, 16 índices). Ao receber arquivos do Desktop, conferir se o JS acompanha a planilha.
- `.env` com `DEEPL_API_KEY` (chave `:fx` = plano Free). Nunca versionar chaves.
- Pendências de segurança conhecidas (ver README): `NODE_TLS_REJECT_UNAUTHORIZED=0`,
  CORS aberto, sem autenticação. Só uso local por enquanto.

## Arquivos principais

| Arquivo | Papel |
|---|---|
| `tabelaMestra.js` | Glossário: literal `indices` (16 índices) + derivados `termosGlossario`, `expressoesCompostas`, `dicionarioTermos`. Função `adicionarTermos` existe para uso futuro. |
| `processadorTexto.js` | Matching dos termos no texto (expressão mais longa vence; empate → índice menor), regras de contexto (`escolherContexto`), montagem do `context` para a DeepL e fallback local `processarTraducaoLocal`. |
| `correcoesOrtograficas.js` | Sugestões de grafia (24 regras); nunca aplicadas sem aceite do usuário. |
| `server.js` | Rotas `/api/traduzir`, `/api/traduzir-massa`, `/api/sugerir-correcoes`; DeepL com fallback local. |
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
   referência. Avaliar lotes de até 50 textos por chamada para a lentidão em massa.
6. Depois: espanhol (base em `docs/glossario-setor-pt-en-es.tsv`), ECOM, composição.

## Testes

- `tests/processadorTexto.test.js` e `tests/correcoesOrtograficas.test.js` (19 testes).
- Qualquer mudança na tabela ou nas regras deve manter os testes verdes e, quando
  existir, passar pelo conjunto de referência.
