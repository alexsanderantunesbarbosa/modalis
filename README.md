# Modalis

**Tradutor de descrições e composições de peças de vestuário, com glossário próprio e DeepL.**

Ferramenta interna da La Moda para o setor Garantia da Informação: traduz descrições de peças do português para inglês e espanhol, respeitando o limite de caracteres do SAP e padronizando os termos técnicos do setor.

## Fluxo principal

```
SAP (planilha) → Modalis (glossário + DeepL) → Ajuste manual → Download .xlsx → Import manual no SAP
```

O glossário é consultado **antes** da API externa, para que termos técnicos do setor saiam sempre padronizados. O que o glossário não cobre vai para o DeepL.

## Funcionalidades

- **Modo singular:** digite a descrição de uma peça e receba as versões em inglês e espanhol, além da Descrição Ecom.
- **Modo em massa:** envie a planilha base e receba a mesma estrutura preenchida.
- **Limite de 40 caracteres:** descrições em PT/EN/ES acima de 40 caracteres geram aviso visual (campo e excesso) e bloqueiam o download até a correção. A Descrição Ecom não tem limite.
- **Ajuste manual** das descrições antes de baixar.
- **Exportação para `.xlsx`.**

### Estrutura da planilha

| Coluna | Conteúdo |
|---|---|
| `REFERÊNCIA` | Referência da peça |
| `DESCRIÇÃO` | Descrição original da peça (português) |
| `Descrição EN` | Tradução para inglês (máx. 40 caracteres) |
| `Descrição ES` | Tradução para espanhol (máx. 40 caracteres) |
| `TEXTO ECOM` | Mesmo texto da descrição, sem limite de caracteres |
| `Z_COMPOS_PT` | Composição em português |
| `Z_COMPOS_EN` | Composição em inglês |
| `Z_COMPOS_ES` | Composição em espanhol |

A tradução da composição (`Z_COMPOS_EN` e `Z_COMPOS_ES`) está fora de escopo nesta fase (ver [Roadmap](#roadmap)).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | HTML + CSS + JavaScript |
| Backend | Node.js |
| Tradução | DeepL API |
| Glossário | Tabela-mestra (`tabelaMestra.js`) |

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) instalado e uma chave da API do DeepL.

```bash
git clone https://github.com/alexsanderantunesbarbosa/modalis.git
cd modalis
npm install
```

Crie o arquivo `.env` a partir do exemplo e preencha a chave:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }   # só na primeira vez
```

```env
DEEPL_API_KEY=sua-chave-aqui
```

> **Não repita a cópia com o `.env` já existente:** o comando sobrescreve o arquivo e apaga a sua chave.

Suba o servidor:

```bash
node server.js
```

Depois abra o endereço mostrado no terminal (ex.: `http://localhost:3000`).

## Estrutura do repositório

```
modalis/
├── index.html           # Interface (modos singular e em massa)
├── styles.css           # Estilos
├── script.js            # Lógica do front-end
├── server.js            # Servidor Node e chamadas ao DeepL
├── processadorTexto.js  # Normalização e processamento dos textos
├── tabelaMestra.js      # Glossário de expressões-chave
├── .env.example         # Modelo das variáveis de ambiente
└── .gitignore
```

## Segurança

- A chave do DeepL fica **somente** no backend, via `.env`. Nunca em código client-side.
- `.env` está no `.gitignore` e não deve ser versionado nem compartilhado.
- Os dados da planilha devem ser validados e sanitizados antes de seguirem para a API de tradução.
- Se uma chave for exposta por engano, revogue-a no painel do DeepL e gere outra. Apagar o arquivo depois não remove a chave do histórico do Git.

## Estado atual

| Item | Situação |
|---|---|
| Tradução singular | Concluída |
| Interface singular | Concluída |
| Interface em massa | Concluída |
| Normalização de termos compostos | Em andamento (~50%): regras definidas, ainda dentro do código |
| Glossário servido pela API | Pendente (hoje está em `tabelaMestra.js`) |
| Exportação `.xlsx` | A confirmar |

## Roadmap

- Mover o glossário para a API/backend, separado da credencial.
- Tradução de composição têxtil (EN/ES), com glossário separado do de descrição de peça.
- Padronizar a nomenclatura de fibras (ex.: Elastano → Spandex ou Elastane).
- Autenticação e controle de acesso.
- Log/histórico de edições.
- Hospedagem para acesso da equipe, fora do localhost.
- Tratamento de linhas malformadas na planilha em massa.

## Contexto

Projeto desenvolvido para o setor Garantia da Informação da La Moda. O import da planilha final de volta ao SAP é manual nesta fase.
