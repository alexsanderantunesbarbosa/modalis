# MODALIS

Aplicação em desenvolvimento para revisar e padronizar descrições de peças de vestuário em português e gerar descrições em inglês. O sistema combina um glossário próprio com a API DeepL e permite processar uma descrição ou uma planilha.

O repositório contém uma implementação funcional para uso local, mas ainda há requisitos parcialmente implementados. Este README descreve o comportamento encontrado no código; não representa uma declaração de prontidão para produção.

## Fluxo atual

```text
Descrição ou planilha SAP
  → revisão de sugestões ortográficas (em massa)
  → API local do MODALIS
  → contexto do glossário + DeepL, ou fallback local
  → revisão manual
  → exportação .xlsx
```

O servidor consulta as correspondências do glossário local para montar um contexto enviado ao DeepL junto com o texto original. Esse contexto orienta a tradução, mas não garante que o DeepL aplique cada termo exatamente como definido. Se a chamada ao DeepL falhar, o servidor usa o processador local como fallback e devolve a origem de cada tradução; a interface marca as linhas vindas do fallback e mostra o motivo da falha.

## Funcionalidades implementadas

- **Tradução individual para inglês:** envia uma descrição ao servidor, que tenta usar o DeepL e recorre ao processamento local em caso de falha.
- **Importação em massa:** aceita `.xlsx`, `.xls` e `.csv`, lê a primeira aba e exige as colunas `Referencia` e `Descrição`. As colunas `Português` e `Z_ENCAIXE` não substituem `Descrição`.
- **Sugestões ortográficas:** regras locais mostram o texto original e uma versão sugerida. É possível aceitar ou manter cada sugestão; o original não é alterado automaticamente.
- **Revisão em massa:** inclui filtros por coluna, referências com correção pendente, aplicação de todas as sugestões e edição manual de EN/ES.
- **Tradução em massa para inglês:** as descrições são agrupadas por contexto do glossário. O servidor processa os grupos sequencialmente, então arquivos grandes podem levar tempo, sobretudo quando há muitos contextos distintos.
- **Exportação `.xlsx`:** gera uma planilha com as oito colunas do modelo abaixo.
- **Glossário (consulta):** aba com a tabela mestra completa (PT, EN, ES do setor quando existe, tipo, contexto, status, posição na frase e índice), busca, filtros e exportação para Excel. Somente leitura; a edição dos termos continua na validação de terminologia.

### Limites e conteúdo exportado

| Coluna | Valor exportado atualmente |
|---|---|
| `REFERÊNCIA` | Referência importada da planilha |
| `DESCRIÇÃO` | Texto PT atual; se uma correção for aceita, exporta o texto corrigido |
| `Descrição EN` | Tradução ou edição manual em inglês |
| `Descrição ES` | Campo disponível para edição, mas sem tradução automática nesta etapa |
| `TEXTO ECOM` | Valor lido da coluna ECOM de entrada, quando encontrada; não é preenchido automaticamente com a descrição |
| `Z_COMPOS_PT` | Composição em português importada, quando encontrada |
| `Z_COMPOS_EN` | Composição em inglês importada, quando encontrada |
| `Z_COMPOS_ES` | Composição em espanhol importada, quando encontrada |

A saída contém somente essas oito colunas. Outras colunas da planilha de entrada não são copiadas. A interface mantém a descrição original durante a revisão, mas a saída não tem uma coluna separada para ela: após aceitar uma correção, `DESCRIÇÃO` contém a versão corrigida.

O download é bloqueado se houver sugestões ortográficas pendentes, descrições EN vazias ou valores PT/EN acima de 40 caracteres. A validação de 40 caracteres para ES ainda não está implementada. ECOM não entra nessa validação. O usuário informa que o SAP já entrega a descrição PT dentro de 40 caracteres; o sistema também valida esse limite antes do download.

## O que ainda não está implementado ou confirmado

- A tradução automática para espanhol está adiada; a tela informa que será incluída depois.
- ECOM deveria reproduzir a descrição PT sem limite, mas hoje o código apenas importa o valor de uma coluna ECOM existente.
- A tradução da composição têxtil não é feita. Se as colunas de composição existirem na entrada, seus valores são carregados e exportados sem tradução.
- O glossário nativo da DeepL não é usado nem sincronizado. A decisão de usá-lo permanece em avaliação; o glossário local é a referência do projeto.
- Quando o DeepL falha, o servidor usa o fallback local por grupo de contexto e informa a origem de cada tradução (`origem: deepl | local`); a interface marca essas linhas e mostra o motivo no status. O fallback ainda não reordena os termos (ver fila de código no `CLAUDE.md`).
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

A interface segue a linguagem visual do sistema interno START (padrão Bootstrap 3), com CSS próprio. O único recurso externo do HTML é o SheetJS por CDN; para tradução via DeepL, o servidor precisa de acesso à API.

## Executar localmente

Pré-requisitos: Node.js 18 ou superior e uma chave válida da DeepL API para tradução externa. O pacote `dotenv` é uma dependência declarada no projeto.

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

Fora da rede da empresa, `node server.js` também funciona; `npm start` acrescenta `--use-system-ca`, necessário na rede corporativa (ver a seção de segurança). Por padrão, a API escuta na porta `3000`; também aceita a variável `PORT`. Abra `index.html` separadamente no navegador ou sirva-o por um servidor estático local. O servidor Node deste projeto atende as rotas da API, não os arquivos HTML/CSS/JS. A interface atualmente chama `localhost:3000` diretamente.

Para executar os testes automatizados locais:

```bash
npm test
```

Esse comando usa o test runner nativo do Node.js. A existência do comando não significa que os testes tenham sido executados nesta revisão do README.

## Estrutura principal

```text
index.html                    Interface e carregamento das bibliotecas do navegador
styles.css                    Estilos
script.js                     Interface, importação, revisão e exportação
server.js                     Servidor HTTP, rotas e integração com DeepL
processadorTexto.js            Correspondências do glossário e processamento local
tabelaMestra.js                Dados terminológicos
correcoesOrtograficas.js       Sugestões locais de grafia
tests/                         Testes automatizados
```

## Segurança e limitações de uso

- A chave é lida pelo servidor via `process.env.DEEPL_API_KEY`; `.env` está listado no `.gitignore` e `.env.example` contém somente a variável vazia.
- A validação de certificados TLS fica ligada. Na rede corporativa, que faz inspeção TLS, use `npm start`: o script passa `--use-system-ca` ao Node (22.15+), que então confia no repositório de certificados do Windows, onde a TI instala a CA do proxy. Se o servidor for iniciado sem essa opção na rede da empresa, a chamada à DeepL falha por certificado e a tradução cai no fallback local, com o motivo exibido na interface.
- O servidor permite CORS de qualquer origem (`Access-Control-Allow-Origin: *`) e não implementa autenticação.
- O front-end e a API estão configurados para uso local; o código não deve ser considerado pronto para hospedagem pública antes de revisar TLS, CORS, autenticação e configuração de ambiente.

Não compartilhe arquivos `.env`. Se uma chave real já tiver sido exposta em um commit ou em outro local público, revogue-a no painel da DeepL e gere outra.

## Próximas etapas em avaliação

- Consolidar e validar o fluxo de inglês com o glossário como autoridade e investigar a lentidão em massa.
- Avaliar se vale manter o glossário somente local ou sincronizar uma cópia com o glossário nativo DeepL.
- Implementar e validar o espanhol e o preenchimento automático de ECOM.
- Definir o tratamento dos limites de ES e a preservação dos dados originais necessários no fluxo SAP.
- Adiar a tradução de composição têxtil até a etapa de descrições estar validada.
- Avaliar autenticação, histórico e hospedagem somente quando houver decisão de disponibilizar o sistema a outros usuários.
