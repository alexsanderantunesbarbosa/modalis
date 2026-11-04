# MODALIS

Aplicação em desenvolvimento para revisar e padronizar descrições de peças de vestuário em português e gerar descrições em inglês e em espanhol. O sistema combina um glossário próprio com a API DeepL e permite processar uma descrição ou uma planilha.

O repositório contém uma implementação funcional para uso local, mas ainda há requisitos parcialmente implementados. Este README descreve o comportamento encontrado no código; não representa uma declaração de prontidão para produção.

## Fluxo atual

```text
Descrição ou planilha SAP
  → revisão de sugestões ortográficas (em massa)
  → API local do MODALIS
  → frase montada pela tabela mestra, em inglês e em espanhol; DeepL (com o contexto do glossário) só para o que a tabela não cobre
  → revisão manual (edição, confirmação, faixa de status)
  → exportação .xlsx
```

A tabela mestra é o motor: o servidor casa os termos da descrição e monta a frase em inglês na estrutura combinada (`[nome de linha] [rise] [comprimento] [fit] [manga] [gola] [construção] [acabamento] [tecido] [modelo] PEÇA [WITH …] [WITHOUT …]`), sem chamar a DeepL. Só vão à DeepL as descrições com palavra fora da tabela, com mais de uma peça ou sem peça identificada, com o contexto do glossário. A resposta passa por um validador: termo da tabela ausente, peça a mais ou ordem diferente da estrutura marcam a linha "a revisar". Cada linha devolve origem (`tabela`, `deepl`, `local`) e estado (`tabela`, `deepl`, `revisar`, `acima-de-40`); a interface mostra um selo por linha e o balanço na faixa de status. Se a DeepL falhar, a linha sai pela tabela com as palavras desconhecidas em português, marcada e pendente. `MOTOR_PRINCIPAL=deepl` inverte: tudo vai à DeepL (para comparar qualidade).

O espanhol (neutro, validado com o varejo de moda em espanhol em 29/10/2026) segue a frase em português ao pé da letra, termo a termo pelo glossário: nada muda de lugar e nenhuma preposição entra ou sai. Os ajustes são de gramática: concordância com o substantivo em espanhol (CALÇA PIJAMA LISTRADA → PANTALÓN PIJAMA RAYADO; COM GOLA BORDADA → CON CUELLO BORDADO), E e + viram Y, e COM/DE antes de termo cujo espanhol é adjetivo cai (BLAZER DE ALFAIATARIA → BLAZER SASTRE). As fusões do inglês (JORTS, HOODIE, SWEATPANTS) valem só no inglês. As regras e os casos de referência estão em `docs/decisoes-espanhol-2026-10-29.md`. O caminho da DeepL é o mesmo do inglês, com `target_lang=ES`, contexto em espanhol e o mesmo validador.

## Funcionalidades implementadas

- **Tradução individual para inglês e espanhol:** a descrição é montada pela tabela mestra nos dois idiomas, em paralelo; se houver palavra fora da tabela, vai à DeepL e volta validada. A tela diz de onde veio cada idioma, mostra o contador de 40 caracteres dos dois e lista os termos do glossário aplicados (PT = EN · ES).
- **Importação em massa:** aceita `.xlsx`, `.xls` e `.csv`, lê a primeira aba e exige as colunas `Referencia` e `Descrição`. As colunas `Português` e `Z_ENCAIXE` não substituem `Descrição`.
- **Sugestões ortográficas:** regras locais mostram o texto original e uma versão sugerida. É possível aceitar ou manter cada sugestão; o original não é alterado automaticamente.
- **Revisão em massa:** inclui filtros por coluna, referências com correção pendente, aplicação de todas as sugestões e edição manual de EN/ES.
  - Cada célula EN e ES mostra a contagem de caracteres ("38/40") no canto inferior direito, em vermelho acima de 40. A contagem muda enquanto se digita.
  - A edição é gravada ao sair da célula. Enter desce para a linha de baixo (Shift+Enter sobe), e o texto colado entra como texto simples.
  - Depois de salvar, uma linha que passava de 40 mostra os dois tamanhos: "Editado à mão · tinha 43, agora tem 38".
  - Linhas "a revisar" ou "DeepL falhou" que já estão certas têm o botão "Confirmar", que tira a marca sem mudar o texto. Acima de 40 é preciso editar.
  - O espanhol tem os mesmos controles do inglês, independentes: selo de origem, "tinha X, agora tem Y", Confirmar e bloqueio acima de 40. A linha só fica pronta quando EN e ES estão prontos; a faixa, os filtros e a lista de referências olham os dois.
  - A faixa no topo da tabela é recalculada a cada mudança sobre a planilha inteira: de onde veio o inglês e o que falta resolver. Fica bege enquanto há pendência e verde quando o download passa sem bloqueio nem pergunta. Ela continua visível ao rolar a tabela.
  - Abaixo da faixa, os filtros rápidos ("Mostrar: Todas · A revisar · Acima de 40 · Falha da DeepL · Sem tradução · Editadas à mão · Confirmadas", com as contagens) e a lista de referências que precisam de revisão; clicar numa referência leva à linha.
  - Confirmações e avisos aparecem em janelas no estilo do START, nunca nas caixas do navegador. O download bloqueado lista as linhas com o problema e o botão "Ir para a linha".
- **Tradução em massa:** o botão "Traduzir" envia só o que está pendente em cada idioma (sem texto, ou vindo do motor local e não confirmado; texto editado à mão nunca é reenviado), em partes de 100 descrições distintas, com progresso na faixa. Em cada parte, inglês e espanhol saem em paralelo. O servidor monta pela tabela tudo o que ela cobre; o restante vai à DeepL, cada descrição distinta uma vez, com o contexto do glossário dela, em até 3 chamadas simultâneas e com nova tentativa em falhas passageiras. Lotes maiores (`DEEPL_TAMANHO_LOTE`, até 50) existem, mas medimos que a DeepL obedece menos ao glossário conforme o lote cresce (87% com 1 descrição por chamada, 68% com 50), então o padrão é 1 até o glossário nativo da DeepL entrar.
- **Exportação `.xlsx`:** gera uma planilha com as oito colunas do modelo abaixo.
- **Glossário (consulta):** aba com a tabela mestra completa (PT, EN, ES da própria tabela, nome do índice; tipo, contexto, status, posição na frase e número do índice em "Mostrar detalhes técnicos"), cabeçalho cinza como os relatórios do START (sem a marca M LA MODA desde 30/10/2026), busca com o trecho encontrado marcado, ES ausente como "—", títulos das colunas presos no topo, filtros e exportação para Excel. Somente leitura; a edição dos termos continua na validação de terminologia.

### Limites e conteúdo exportado

| Coluna | Valor exportado atualmente |
|---|---|
| `REFERÊNCIA` | Referência importada da planilha |
| `DESCRIÇÃO` | Texto PT atual; se uma correção for aceita, exporta o texto corrigido |
| `Descrição EN` | Tradução ou edição manual em inglês |
| `Descrição ES` | Tradução ou edição manual em espanhol |
| `TEXTO ECOM` | Mesmo texto da coluna `DESCRIÇÃO` exportada (decisão de 23/10/2026); sem limite de 40 caracteres |
| `Z_COMPOS_PT` | Composição em português importada, quando encontrada |
| `Z_COMPOS_EN` | Composição em inglês importada, quando encontrada |
| `Z_COMPOS_ES` | Composição em espanhol importada, quando encontrada |

A saída contém somente essas oito colunas, que são o layout da transação de carga no SAP desenvolvida pela TI. O modelo dessa planilha, com os oito cabeçalhos e a instrução de cada coluna, fica em `docs/Traduções - Planilha Base.xlsx` (local, fora do Git); os cabeçalhos exportados são iguais aos dele. Outras colunas da planilha de entrada não são copiadas. A interface mantém a descrição original durante a revisão, mas a saída não tem uma coluna separada para ela: após aceitar uma correção, `DESCRIÇÃO` contém a versão corrigida, e é essa que a transação grava no SAP. Por isso "Aplicar todas as correções" pede confirmação.

O download é bloqueado se houver sugestões ortográficas pendentes, descrições EN ou ES vazias ou valores PT/EN/ES acima de 40 caracteres. Depois dos bloqueios, traduções marcadas para revisão (a revisar ou DeepL falhou) que não foram editadas nem confirmadas pedem uma confirmação antes de exportar. Acima de 40 a correção é sempre humana: o sistema nunca corta nem encurta sozinho. Na medição de 04/11/2026 (2.464 descrições distintas da IN27 e da AI27), 9,8% das descrições em espanhol passam de 40, contra 2,5% em inglês, porque o espanhol ao pé da letra é mais longo (TIRO ALTO, MANGA LARGA). ECOM não entra nessa validação. O usuário informa que o SAP já entrega a descrição PT dentro de 40 caracteres; o sistema também valida esse limite antes do download.

## O que ainda não está implementado ou confirmado

- O `TEXTO ECOM` é uma cópia da descrição; o texto completo do START (anterior ao corte de 40 caracteres) ainda não é usado.
- A tradução da composição têxtil não é feita. Se as colunas de composição existirem na entrada, seus valores são carregados e exportados sem tradução. Ela entra antes do piloto de dezembro, porque a meta é a planilha da coleção 100% pronta.
- O glossário nativo da DeepL ainda não é usado. A decisão é usá-lo depois do banco SQLite, sincronizado a partir da tabela mestra, que continua sendo a fonte de verdade (ver fila de código no `CLAUDE.md`).
- Quando a DeepL falha, o servidor monta a linha pela tabela (motor local, na mesma estrutura da frase, com as palavras desconhecidas em português no fim) e informa `origem: local`; a interface marca a linha, mostra o motivo na faixa e a deixa pendente para "Traduzir pendentes", a não ser que ela seja confirmada ou editada.
- O servidor não hospeda os arquivos da interface; `script.js` chama a API em `http://localhost:3000`.
- A importação lê apenas a primeira aba da planilha.

## Tecnologias

| Parte | Tecnologia atual |
|---|---|
| Interface | HTML, CSS e JavaScript puro |
| Servidor e rotas | Node.js com o módulo nativo `http` |
| Configuração local | `dotenv` para carregar variáveis de ambiente |
| Glossário e processamento | `tabelaMestra.js` e `processadorTexto.js` |
| Sugestões ortográficas | `correcoesOrtograficas.js` |
| Tradução externa | DeepL API |
| Leitura e geração de planilhas | SheetJS 0.18.5 carregado por CDN (jsdelivr) no navegador |

A interface segue a linguagem visual do sistema interno START (padrão Bootstrap 3), com CSS próprio e os mesmos tamanhos de barra, fontes e campos; a barra traz o M do logo La Moda. A tela Individual cabe sem rolar mesmo com a escala do Windows em 150%. O único recurso externo do HTML é o SheetJS por CDN; para tradução via DeepL, o servidor precisa de acesso à API.

## Executar localmente

Pré-requisitos: Node.js 22.15 ou superior (exigido no `package.json`; é a versão que tem a opção `--use-system-ca` usada pelo `npm start`) e uma chave válida da DeepL API para tradução externa. O pacote `dotenv` é uma dependência declarada no projeto.

```bash
git clone https://github.com/alexsanderantunesbarbosa/modalis.git
cd modalis
npm install
```

A branch `main` recebe a versão estável por merge da `developer`, sempre com tag de versão; o desenvolvimento do dia corre na `developer`.

Crie `.env` a partir de `.env.example` somente se ainda não houver um arquivo local. Não sobrescreva um `.env` existente:

```powershell
if (-not (Test-Path -LiteralPath .env)) { Copy-Item .env.example .env }
```

No arquivo `.env` local, configure `DEEPL_API_KEY` com sua chave. O exemplo versionado mantém o valor vazio; não coloque chaves reais no código, no README ou no Git.

Inicie o servidor:

```bash
npm start
```

Fora da rede da empresa, `node server.js` também funciona; `npm start` acrescenta `--use-system-ca`, necessário na rede corporativa (ver a seção de segurança). Por padrão, a API escuta só neste computador (`127.0.0.1`) na porta `3000`. Toda a configuração vem de variáveis de ambiente (ver `.env.example`): `MOTOR_PRINCIPAL` (`tabela`), `HOST`, `PORT`, `MAX_CORPO_BYTES` (1 MB), `MAX_DESCRICOES_LOTE` (10.000), `MAX_CARACTERES_DESCRICAO` (200), `DEEPL_TAMANHO_LOTE` (1, máximo 50), `DEEPL_CHAMADAS_SIMULTANEAS` (3), `DEEPL_TENTATIVAS` (3), `DEEPL_ESPERA_RETRY_MS` (1.000), `DEEPL_TIMEOUT_MS` (15.000), `DEEPL_FALHAS_SEGUIDAS` (9) e `DEEPL_CIRCUITO_ABERTO_MS` (30.000); um valor numérico inválido (0, negativo, texto) volta ao padrão sem aviso. Se a DeepL ficar inacessível (rede, proxy, serviço fora), o disjuntor suspende as chamadas por 30 s e a tradução segue pelo motor local, marcada na interface; sem ele, cada lote repetiria as esperas. Já o 429 ("muitas requisições", comum no plano Free) é tratado como pedido para ir mais devagar: o servidor pausa todas as chamadas (`DEEPL_PAUSA_429_MS`, dobrando até `DEEPL_PAUSA_MAXIMA_429_MS`, ou o `Retry-After` da DeepL) e repete; só depois de `DEEPL_PACIENCIA_429_MS` (2 min) sem sucesso a DeepL fica suspensa por `DEEPL_CIRCUITO_ABERTO_MS` e o restante fica pendente para "Traduzir pendentes" (enquanto nenhuma chamada der certo, um novo 429 suspende de novo na hora). Toda chamada informa `source_lang=PT`, porque descrições curtas eram lidas como outro idioma. A interface envia a coleção em partes de 100 descrições distintas e mostra o progresso. O servidor escreve uma linha JSON por evento (além de uma linha de texto legível ao iniciar): as requisições (rota, status, duração) em stdout; avisos (falha e nova tentativa da DeepL, limite de taxa, disjuntor aberto, requisição recusada com 4xx) e erros internos (500, com stack) em stderr. Abra `index.html` separadamente no navegador ou sirva-o por um servidor estático local. O servidor Node deste projeto atende as rotas da API, não os arquivos HTML/CSS/JS (servir a interface pelo próprio servidor está decidido para antes do piloto). A interface atualmente chama `localhost:3000` diretamente. Rotas: `POST /api/traduzir`, `POST /api/traduzir-massa`, `POST /api/sugerir-correcoes` e `GET /api/glossario`; ainda não há rota de saúde.

Para executar os testes automatizados locais:

```bash
npm test
```

Esse comando usa o test runner nativo do Node.js. Os testes em `tests/` cobrem o matching do glossário, a montagem da frase em inglês pela tabela (com os exemplos de referência do `CLAUDE.md`), a montagem em espanhol (`tests/montadorEspanhol.test.js`, com os 69 casos de referência; os que dependem de termo novo ainda em validação rodam como TODO), o validador da resposta da DeepL, a montagem de lotes, as correções de grafia, as regras da tabela em massa (`estadoMassa.js`, inclusive o carregamento conjunto com o `script.js`) e a API HTTP com uma DeepL simulada injetada (sem rede e sem depender do `.env`): validação de entrada, limites, timeout, novas tentativas, disjuntor, freio do 429 (Retry-After e paciência), motor `tabela`, validador de estrutura (EN e ES), fallback por lote, limite de chamadas simultâneas, cancelamento quando o cliente desiste e um corpo com acento partido entre dois pacotes TCP.

## Estrutura principal

```text
index.html                    Interface e carregamento das bibliotecas do navegador
styles.css                    Estilos
script.js                     Interface, importação, revisão e exportação
estadoMassa.js                Regras da tabela em massa sem DOM (selo, contador, faixa de status)
server.js                     Servidor HTTP, rotas e integração com DeepL
processadorTexto.js            Correspondências do glossário e montagem da frase em inglês e em espanhol
tabelaMestra.js                Tabela mestra (glossário, fonte de verdade)
correcoesOrtograficas.js       Sugestões locais de grafia
tests/                         Testes automatizados
docs/                          Decisões do glossário e do espanhol e lista PT/EN/ES do setor (histórico)
```

Pastas e arquivos locais, fora do Git (não vêm no clone; são dados da empresa ou material de terceiros): `docs/amostras/` (planilhas das coleções IN27 e AI27, base de teste), `docs/Traduções - Planilha Base.xlsx` (modelo das oito colunas do SAP), `historico/` (arquivos antigos do projeto, só para leitura), `pesquisa/` (dados de medição) e `referencias/` (material das aulas).

## Segurança e limitações de uso

- A chave é lida pelo servidor via `process.env.DEEPL_API_KEY`; `.env` está listado no `.gitignore` e `.env.example` traz `DEEPL_API_KEY` vazia e as demais variáveis comentadas com os padrões; nenhuma chave real.
- A validação de certificados TLS fica ligada. Na rede corporativa, que faz inspeção TLS, use `npm start`: o script passa `--use-system-ca` ao Node (22.15+), que então confia no repositório de certificados do Windows, onde a TI instala a CA do proxy. Se o servidor for iniciado sem essa opção na rede da empresa, a chamada à DeepL falha por certificado e a tradução cai no fallback local, com o motivo exibido na interface.
- O servidor escuta só em `127.0.0.1` por padrão (`HOST` no `.env` muda isso), valida tipo, tamanho e quantidade de tudo que recebe antes de chamar a DeepL (400 ou 413 com mensagem em português), limita o tempo de espera da DeepL e não repassa ao navegador o corpo bruto dos erros dela, só um motivo curto; o detalhe fica no log.
- O SheetJS (xlsx 0.18.5) vem de um CDN e tem falhas conhecidas na leitura de planilhas (CVE-2023-30533, corrigida na 0.19.3; CVE-2024-22363, corrigida na 0.20.2). Decidido em 04/11/2026: trocar por uma cópia local da 0.20.x antes do piloto.
- O servidor permite CORS de qualquer origem (`Access-Control-Allow-Origin: *`), porque hoje a interface é aberta como arquivo, e não implementa autenticação. Decidido em 04/11/2026: antes do piloto, o servidor passa a servir a interface e o CORS aberto sai. A autenticação é pré-requisito da publicação na rede, junto com HTTPS por proxy reverso.
- O front-end e a API estão configurados para uso local; o código não deve ser considerado pronto para hospedagem pública antes de revisar TLS, CORS, autenticação e configuração de ambiente.

Não compartilhe arquivos `.env`. Se uma chave real já tiver sido exposta em um commit ou em outro local público, revogue-a no painel da DeepL e gere outra.

## Próximas etapas em avaliação

Antes do piloto de dezembro (decisões de 04/11/2026; ordem no item 13 da fila do `CLAUDE.md`):

- Fechar a terminologia numa sessão única de SIM/NÃO (inclui STRAIGHT e os termos novos do espanhol em validação: CALÇA LEGGING, COM TOUCA, COM ABOTOAMENTO DUPLO, GOLA CACHECOL, FAIXA como produto; MEIA CALÇA entrou em 03/11/2026) e decidir SLEEP/SLIP (hoje iguais ao PT, com a linha marcada para revisão).
- Traduzir a composição têxtil (PT → EN/ES por regras, testada contra as composições da IN27).
- Servir a interface pelo próprio servidor (fim do CORS aberto), com rota de saúde; SheetJS em cópia local; rascunho salvo no navegador; arquivo de métricas a cada exportação; testes de integridade da tabela e do contrato das oito colunas; CI no GitHub Actions.

Depois do piloto:

- Validar o inglês com um conjunto de referência aprovado pelo líder do setor.
- Glossário como dado (JSON) e banco SQLite com memória de traduções, auditoria e histórico; cadastro de termos novos pela interface.
- Sincronizar uma cópia da tabela mestra com o glossário nativo da DeepL.
- Implementar o preenchimento automático de ECOM e definir a preservação dos dados originais necessários no fluxo SAP.
- Hospedagem na rede da empresa, com autenticação e HTTPS, quando o sistema for disponibilizado a outros usuários.
