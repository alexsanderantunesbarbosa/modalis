# MODALIS

Aplicação em desenvolvimento para revisar e padronizar descrições de peças de vestuário em português e gerar descrições em inglês. O sistema combina um glossário próprio com a API DeepL e permite processar uma descrição ou uma planilha.

O repositório contém uma implementação funcional para uso local, mas ainda há requisitos parcialmente implementados. Este README descreve o comportamento encontrado no código; não representa uma declaração de prontidão para produção.

## Fluxo atual

```text
Descrição ou planilha SAP
  → revisão de sugestões ortográficas (em massa)
  → API local do MODALIS
  → frase montada pela tabela mestra; DeepL (com o contexto do glossário) só para o que a tabela não cobre
  → revisão manual (edição, confirmação, faixa de status)
  → exportação .xlsx
```

A tabela mestra é o motor: o servidor casa os termos da descrição e monta a frase em inglês na estrutura combinada (`[nome de linha] [rise] [comprimento] [fit] [manga] [gola] [construção] [acabamento] [tecido] [modelo] PEÇA [WITH …] [WITHOUT …]`), sem chamar a DeepL. Só vão à DeepL as descrições com palavra fora da tabela, com mais de uma peça ou sem peça identificada, com o contexto do glossário. A resposta passa por um validador: termo da tabela ausente, peça a mais ou ordem diferente da estrutura marcam a linha "a revisar". Cada linha devolve origem (`tabela`, `deepl`, `local`) e estado (`tabela`, `deepl`, `revisar`, `acima-de-40`); a interface mostra um selo por linha e o balanço na faixa de status. Se a DeepL falhar, a linha sai pela tabela com as palavras desconhecidas em português, marcada e pendente. `MOTOR_PRINCIPAL=deepl` inverte: tudo vai à DeepL (para comparar qualidade).

## Funcionalidades implementadas

- **Tradução individual para inglês:** a descrição é montada pela tabela mestra; se houver palavra fora da tabela, vai à DeepL e volta validada. A tela diz de onde veio e lista os termos do glossário aplicados.
- **Importação em massa:** aceita `.xlsx`, `.xls` e `.csv`, lê a primeira aba e exige as colunas `Referencia` e `Descrição`. As colunas `Português` e `Z_ENCAIXE` não substituem `Descrição`.
- **Sugestões ortográficas:** regras locais mostram o texto original e uma versão sugerida. É possível aceitar ou manter cada sugestão; o original não é alterado automaticamente.
- **Revisão em massa:** inclui filtros por coluna, referências com correção pendente, aplicação de todas as sugestões e edição manual de EN/ES.
  - Cada célula EN e ES mostra a contagem de caracteres ("38/40") no canto inferior direito, em vermelho acima de 40. A contagem muda enquanto se digita.
  - A edição é gravada ao sair da célula. Enter desce para a linha de baixo (Shift+Enter sobe), e o texto colado entra como texto simples.
  - Depois de salvar, uma linha que passava de 40 mostra os dois tamanhos: "Editado à mão · tinha 43, agora tem 38".
  - Linhas "a revisar" ou "DeepL falhou" que já estão certas têm o botão "Confirmar", que tira a marca sem mudar o texto. Acima de 40 é preciso editar.
  - A faixa no topo da tabela é recalculada a cada mudança sobre a planilha inteira: de onde veio o inglês e o que falta resolver. Fica bege enquanto há pendência e verde quando o download passa sem bloqueio nem pergunta. Ela continua visível ao rolar a tabela.
- **Tradução em massa:** o botão "Traduzir" envia só as linhas pendentes (sem inglês, ou vindas do motor local e não confirmadas; linhas editadas à mão nunca são reenviadas), em partes de 100 descrições distintas, com progresso na faixa. O servidor monta pela tabela tudo o que ela cobre; o restante vai à DeepL, cada descrição distinta uma vez, com o contexto do glossário dela, em até 3 chamadas simultâneas e com nova tentativa em falhas passageiras. Lotes maiores (`DEEPL_TAMANHO_LOTE`, até 50) existem, mas medimos que a DeepL obedece menos ao glossário conforme o lote cresce (87% com 1 descrição por chamada, 68% com 50), então o padrão é 1 até o glossário nativo da DeepL entrar.
- **Exportação `.xlsx`:** gera uma planilha com as oito colunas do modelo abaixo.
- **Glossário (consulta):** aba com a tabela mestra completa (PT, EN, ES do setor quando existe, tipo, contexto, status, posição na frase e índice), busca, filtros e exportação para Excel. Somente leitura; a edição dos termos continua na validação de terminologia.

### Limites e conteúdo exportado

| Coluna | Valor exportado atualmente |
|---|---|
| `REFERÊNCIA` | Referência importada da planilha |
| `DESCRIÇÃO` | Texto PT atual; se uma correção for aceita, exporta o texto corrigido |
| `Descrição EN` | Tradução ou edição manual em inglês |
| `Descrição ES` | Campo disponível para edição, mas sem tradução automática nesta etapa |
| `TEXTO ECOM` | Mesmo texto da coluna `DESCRIÇÃO` exportada (decisão de 23/10/2026); sem limite de 40 caracteres |
| `Z_COMPOS_PT` | Composição em português importada, quando encontrada |
| `Z_COMPOS_EN` | Composição em inglês importada, quando encontrada |
| `Z_COMPOS_ES` | Composição em espanhol importada, quando encontrada |

A saída contém somente essas oito colunas, que são o layout da transação de carga no SAP desenvolvida pela TI. Outras colunas da planilha de entrada não são copiadas. A interface mantém a descrição original durante a revisão, mas a saída não tem uma coluna separada para ela: após aceitar uma correção, `DESCRIÇÃO` contém a versão corrigida, e é essa que a transação grava no SAP. Por isso "Aplicar todas as correções" pede confirmação.

O download é bloqueado se houver sugestões ortográficas pendentes, descrições EN vazias ou valores PT/EN acima de 40 caracteres. Depois dos bloqueios, linhas marcadas para revisão (a revisar ou DeepL falhou) que não foram editadas nem confirmadas pedem uma confirmação antes de exportar. A validação de 40 caracteres para ES ainda não está implementada. ECOM não entra nessa validação. O usuário informa que o SAP já entrega a descrição PT dentro de 40 caracteres; o sistema também valida esse limite antes do download.

## O que ainda não está implementado ou confirmado

- A tradução automática para espanhol está adiada; a tela informa que será incluída depois.
- O `TEXTO ECOM` é uma cópia da descrição; o texto completo do START (anterior ao corte de 40 caracteres) ainda não é usado.
- A tradução da composição têxtil não é feita. Se as colunas de composição existirem na entrada, seus valores são carregados e exportados sem tradução.
- O glossário nativo da DeepL ainda não é usado. A decisão é usá-lo depois, sincronizado a partir da tabela mestra, que continua sendo a fonte de verdade (ver fila de código no `CLAUDE.md`).
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
| Leitura e geração de planilhas | SheetJS carregado por CDN no navegador |

A interface segue a linguagem visual do sistema interno START (padrão Bootstrap 3), com CSS próprio e os mesmos tamanhos de barra, fontes e campos; a barra traz o M do logo La Moda. A tela Individual cabe sem rolar mesmo com a escala do Windows em 150%. O único recurso externo do HTML é o SheetJS por CDN; para tradução via DeepL, o servidor precisa de acesso à API.

## Executar localmente

Pré-requisitos: Node.js 22.15 ou superior (exigido no `package.json`; é a versão que tem a opção `--use-system-ca` usada pelo `npm start`) e uma chave válida da DeepL API para tradução externa. O pacote `dotenv` é uma dependência declarada no projeto.

```bash
git clone https://github.com/alexsanderantunesbarbosa/modalis.git
cd modalis
npm install
```

Crie `.env` a partir de `.env.example` somente se ainda não houver um arquivo local. Não sobrescreva um `.env` existente:

```powershell
if (-not (Test-Path -LiteralPath .env)) { Copy-Item .env.example .env }
```

No arquivo `.env` local, configure `DEEPL_API_KEY` com sua chave. O exemplo versionado mantém o valor vazio; não coloque chaves reais no código, no README ou no Git.

Inicie o servidor:

```bash
npm start
```

Fora da rede da empresa, `node server.js` também funciona; `npm start` acrescenta `--use-system-ca`, necessário na rede corporativa (ver a seção de segurança). Por padrão, a API escuta só neste computador (`127.0.0.1`) na porta `3000`. Toda a configuração vem de variáveis de ambiente (ver `.env.example`): `MOTOR_PRINCIPAL` (`tabela`), `HOST`, `PORT`, `MAX_CORPO_BYTES` (1 MB), `MAX_DESCRICOES_LOTE` (10.000), `MAX_CARACTERES_DESCRICAO` (200), `DEEPL_TAMANHO_LOTE` (1, máximo 50), `DEEPL_CHAMADAS_SIMULTANEAS` (3), `DEEPL_TENTATIVAS` (3), `DEEPL_ESPERA_RETRY_MS` (1.000), `DEEPL_TIMEOUT_MS` (15.000), `DEEPL_FALHAS_SEGUIDAS` (9) e `DEEPL_CIRCUITO_ABERTO_MS` (30.000). Se a DeepL ficar inacessível (rede, proxy, serviço fora), o disjuntor suspende as chamadas por 30 s e a tradução segue pelo motor local, marcada na interface; sem ele, cada lote repetiria as esperas. Já o 429 ("muitas requisições", comum no plano Free) é tratado como pedido para ir mais devagar: o servidor pausa todas as chamadas (`DEEPL_PAUSA_429_MS`, dobrando até `DEEPL_PAUSA_MAXIMA_429_MS`, ou o `Retry-After` da DeepL) e repete; só depois de `DEEPL_PACIENCIA_429_MS` (2 min) sem sucesso o restante fica pendente para "Traduzir pendentes". Toda chamada informa `source_lang=PT`, porque descrições curtas eram lidas como outro idioma. A interface envia a coleção em partes de 100 descrições distintas e mostra o progresso. O servidor escreve uma linha JSON por requisição em stdout (rota, status, duração) e por falha da DeepL em stderr. Abra `index.html` separadamente no navegador ou sirva-o por um servidor estático local. O servidor Node deste projeto atende as rotas da API, não os arquivos HTML/CSS/JS. A interface atualmente chama `localhost:3000` diretamente.

Para executar os testes automatizados locais:

```bash
npm test
```

Esse comando usa o test runner nativo do Node.js. Os testes em `tests/` cobrem o matching do glossário, a montagem da frase em inglês pela tabela (com os exemplos de referência do `CLAUDE.md`), o validador da resposta da DeepL, a montagem de lotes, as correções de grafia, as regras da tabela em massa (`estadoMassa.js`, inclusive o carregamento conjunto com o `script.js`) e a API HTTP com uma DeepL simulada injetada (sem rede e sem depender do `.env`): validação de entrada, limites, timeout, novas tentativas, disjuntor, fallback por lote, limite de chamadas simultâneas, cancelamento quando o cliente desiste e um corpo com acento partido entre dois pacotes TCP.

## Estrutura principal

```text
index.html                    Interface e carregamento das bibliotecas do navegador
styles.css                    Estilos
script.js                     Interface, importação, revisão e exportação
estadoMassa.js                Regras da tabela em massa sem DOM (selo, contador, faixa de status)
server.js                     Servidor HTTP, rotas e integração com DeepL
processadorTexto.js            Correspondências do glossário e montagem da frase em inglês
tabelaMestra.js                Tabela mestra (glossário, fonte de verdade)
correcoesOrtograficas.js       Sugestões locais de grafia
tests/                         Testes automatizados
docs/                          Decisões do glossário, lista PT/EN/ES do setor e planilhas de amostra
```

## Segurança e limitações de uso

- A chave é lida pelo servidor via `process.env.DEEPL_API_KEY`; `.env` está listado no `.gitignore` e `.env.example` contém somente a variável vazia.
- A validação de certificados TLS fica ligada. Na rede corporativa, que faz inspeção TLS, use `npm start`: o script passa `--use-system-ca` ao Node (22.15+), que então confia no repositório de certificados do Windows, onde a TI instala a CA do proxy. Se o servidor for iniciado sem essa opção na rede da empresa, a chamada à DeepL falha por certificado e a tradução cai no fallback local, com o motivo exibido na interface.
- O servidor escuta só em `127.0.0.1` por padrão (`HOST` no `.env` muda isso), valida tipo, tamanho e quantidade de tudo que recebe antes de chamar a DeepL (400 ou 413 com mensagem em português), limita o tempo de espera da DeepL e não repassa ao navegador o corpo bruto dos erros dela, só um motivo curto; o detalhe fica no log.
- O servidor permite CORS de qualquer origem (`Access-Control-Allow-Origin: *`) e não implementa autenticação. Os dois são pré-requisitos da publicação na rede, junto com HTTPS por proxy reverso.
- O front-end e a API estão configurados para uso local; o código não deve ser considerado pronto para hospedagem pública antes de revisar TLS, CORS, autenticação e configuração de ambiente.

Não compartilhe arquivos `.env`. Se uma chave real já tiver sido exposta em um commit ou em outro local público, revogue-a no painel da DeepL e gere outra.

## Próximas etapas em avaliação

- Validar o inglês com um conjunto de referência aprovado pelo negócio e incluir na tabela os termos novos encontrados nas coleções (ex.: STRAIGHT).
- Sincronizar uma cópia da tabela mestra com o glossário nativo da DeepL.
- Implementar e validar o espanhol e o preenchimento automático de ECOM.
- Definir o tratamento dos limites de ES e a preservação dos dados originais necessários no fluxo SAP.
- Adiar a tradução de composição têxtil até a etapa de descrições estar validada.
- Avaliar autenticação, histórico e hospedagem somente quando houver decisão de disponibilizar o sistema a outros usuários.
