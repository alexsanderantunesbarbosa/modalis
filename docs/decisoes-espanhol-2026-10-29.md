# Decisões do espanhol — glossário e frase (29/10/2026)

Fonte: planilha `glossario-espanhol-modalis-2026-10-29.xlsx` (Área de Trabalho do dono), com as abas Glossário ES (806 termos), Regras da frase ES, Conjunto de referência ES (69 casos), Termos novos, Correções de grafia e Perguntas. O ES de cada termo foi traduzido e verificado com o varejo de moda em espanhol (Zara, Mango, El Corte Inglés, Falabella, El Palacio de Hierro, Liverpool…). Espanhol **neutro**: entendido na Espanha e em toda a América Latina, sem regionalismo forte (MEZCLILLA, VAQUERO, PLAYERA, REMERA, BRAGA).

APLICADO em 29/10/2026 ("pode codar", sem commit até a revisão do dono): campo `es` nos 806 termos de `tabelaMestra.js`, montador `montarTraducaoES` em `processadorTexto.js`, ES no servidor, na tela Individual, na tabela em massa e no Glossário. Testes em `tests/montadorEspanhol.test.js`.

## Modelo do termo

`es: { texto, classe, genero?, numero?, formas?, adjetivo? }`

| Classe | O que é | Exemplo |
|---|---|---|
| `peca` | Peça; gênero e número do ES | CALÇA = PANTALÓN (m/s) |
| `substantivo` | Substantivo com gênero que não é peça e recebe adjetivo | BARRA = BAJO (m/s), GOLA = CUELLO (m/s) |
| `flexivel` | Adjetivo que concorda; `formas` = ms/fs/mp/fp | ACETINADA = SATINADO/SATINADA/SATINADOS/SATINADAS |
| `invariavel` | Não muda; locução COM/SEM leva o gênero do substantivo de dentro | CANELADO = CANALÉ; COM CAPUZ = CON CAPUCHA (f/s) |
| `nome_proprio` | Nome de linha, nunca traduzido | SELENE |

`adjetivo: true` marca termo cujo ES é adjetivo, para a regra R6 (hoje só ALFAIATARIA = SASTRE).

## Regras do dono para o ES

- O ES segue a frase em PT **ao pé da letra**, termo a termo pelo glossário: nada muda de lugar e nenhuma preposição entra ou sai.
- Palavra estrangeira que o EN manteve não se traduz (T-SHIRT, TRENCH COAT, OVERSIZED, SHORT HOTPANTS).
- As fusões e trocas do EN (JORTS, SKORT, BABY TEE no lugar de BABY LOOK, TUXEDO, TWO-TONE, HOODIE, SWEATPANTS) valem **só no inglês**. No ES vale o termo que o varejo de língua espanhola usa, pesquisado; na dúvida, segue o PT.
- Pesquisados em 29/10: BABY LOOK = BABY TEE, FUSEAU/FUSÔ = FUSEAU, SHORT SAIA = FALDA PANTALÓN, BERMUDA = BERMUDA (peça própria em espanhol), SMOKING = SMOKING, DUO COLOR = BICOLOR, SHORT DOLL = SHORT PIJAMA, ALFAIATARIA = SASTRE.
- **JEANS como tecido = DENIM** em todas as peças (FALDA DENIM, SHORT DENIM, BERMUDA DENIM); JEANS fica só para a calça (CALÇA JEANS = JEANS). Pesquisa nas três regiões: DENIM é a única forma neutra que aparece em nome de produto de loja grande na Espanha, no México e na América do Sul; PEÇA + JEANS não aparece na Espanha nem no México. Confirmado pelo dono.
- SILK = SERIGRAFÍA (estampa silk). PALHA DE SEDA = PAJA DE SEDA. TERMO/TERMOCOLANTE = TERMOADHESIVO. NAME = NAME.
- SLEEP e SLIP ficam iguais ao PT até o dono validar (o motor marca a linha para revisão).
- Acima de 40 caracteres: edição humana; nunca forma curta automática.

## Regras da frase (R1–R20) e como o montador as aplica

| Regra | O que diz | No código |
|---|---|---|
| R1 | Termo a termo, na ordem do PT; a expressão mais longa da tabela vence | Mesmo casamento do EN (`analisarDescricao`) |
| R2 | MINI/MIDI/MAXI e comprimento ficam onde estão; MÉDIO/MÉDIA = MEDIO/MEDIA com concordância | Ordem do PT; MÉDIO é flexível |
| R3 | O adjetivo concorda, no ES, com o mesmo substantivo com que concorda no PT | Ver "Concordância" abaixo |
| R4 | E e + viram Y (E antes de I/HI, pela ortografia) | `CONECTIVOS_ES`; `+` vira E antes do casamento |
| R5 | COM X COM Y = CON X CON Y; COM X E Y = CON X Y Y | Conectivo a conectivo, sem repetir o CON |
| R6 | COM/DE antes de termo cujo ES é adjetivo cai | `adjetivo: true` (BLAZER DE ALFAIATARIA = BLAZER SASTRE) |
| R7 | SEM MANGA(S) = SIN MANGAS | Pela tabela |
| R8 | DE/EM + tecido = DE + tecido | EM vira DE antes de termo e EN antes de palavra desconhecida (EM V = EN V) |
| R9 | A expressão traz a própria forma e preposição | Preposição do PT antes de expressão que já começa com preposição cai (ESPINHA DE PEIXE = DE ESPIGA) |
| R10 | Palavra estrangeira que o EN manteve não se traduz | Pela tabela |
| R11/R12 | Fusões do EN só no inglês; estrangeirismo traduzido pelo sentido usa o termo do espanhol de moda | Pela tabela; o montador ES não tem fusões |
| R13 | MOLETOM peça = SUDADERA; tecido = FELPA; COM CAPUZ = CON CAPUCHA | Contexto do termo, como no EN |
| R14 | Peça + peça: a 2ª fica colada depois da 1ª | Só as segundas peças decididas (`SEGUNDAS_PECAS_ES`): BLAZER, POLO, PIJAMA, PAREO, CORSET JEANS, LINGERIE, ANÁGUA, REGATA |
| R15 | REGATA como 2ª peça = SIN MANGAS; num KIT = CAMISETA SIN MANGAS | Regra no montador |
| R16 | ANÁGUA é a própria peça no formato da 1ª (FALDA CORTA ENAGUA) | Segunda peça decidida |
| R17 | KIT = KIT, peças ligadas por Y | KIT não pede revisão |
| R18 | FAIXA sem outra peça = FAJÍN, estado tabela | Texto já sai FAJÍN; o estado espera a entrada FAIXA (produto) |
| R19 | SLEEP/SLIP iguais ao PT até o dono validar | Linha marcada "várias peças" (revisão) |
| R20 | Acima de 40 = edição manual | Estado `acima-de-40`; download bloqueia |

### Concordância (R3)

1. O gênero e o número do adjetivo no PT vêm da terminação (ESTAMPADA = f/s). Adjetivo que não muda no gênero (FRONTAL, LEVE, MESCLA) concorda só em número.
2. O substantivo com que ele concorda é, nesta ordem: o substantivo de um `COM X` logo antes (COM GOLA BORDADA), se o gênero e o número do PT batem; a peça mais próxima que bate (SAIA PAREO ESTAMPADA = FALDA); outro substantivo que bate, inclusive o tecido (DECOTE V BORDADO; DE TULE ESTAMPADO = DE TUL ESTAMPADO); e, se nada bate, a peça principal (erro de concordância do PT, como ETIQUETA BORDADO, sai certo no ES). Logo depois de uma palavra fora da tabela, fica a forma do próprio PT (o adjetivo é dela).
3. A forma do ES é a do gênero e número **do substantivo em espanhol**: GOLA (f) = CUELLO (m) → BORDADO; CALÇA (f) = PANTALÓN (m) → RAYADO; CÓS (m) = PRETINA (f) → ASIMÉTRICA.
4. O modelo de jaqueta (PUFFER, BOMBER) e a segunda peça colada (CAMISA POLO, VESTIDO BLAZER) cedem o gênero à peça. Depois de COM, o particípio é substantivo (COM DRAPEADO = CON DRAPEADO).
5. Só COM abre detalhe. Em SEM MANGA ALONGADA o adjetivo é da peça (BLUSA SIN MANGAS ALARGADA), e não de SIN MANGAS, que ainda o faria plural.
6. O gênero do substantivo no PT segue a terminação, com uma lista curta de exceções em `GENERO_PT`. São femininos LEGGING, VISCOSE e T-SHIRT; são masculinos PIJAMA, CÓS, MACACÃO e CARDIGÃ. A expressão inteira é procurada antes da palavra (T SHIRT, MINI SAIA).
7. Os tecidos (índice 8) têm gênero no ES (TUL m, SARGA f, PANA f…), para servirem de substantivo na concordância.

Outras regras do montador: o conectivo solto no fim de uma descrição cortada pelo SAP cai, como no EN ("COM DETALHE DE ZÍPER E" não vira "… Y"). A preposição do PT antes de uma expressão que traz a sua cai (R9), mas SIN nunca cai. NÓ e NÓS só casam com acento, porque sem acento são a contração NO/NOS (vale também para o EN).

No validador da DeepL em espanhol, SIN e CON contam, porque o sentido de termos fechados mora neles (SIN MANGAS, CON CAPUCHA). A peça a mais conta também no plural (PANTALONES) e na parte depois do hífen (T-SHIRT → SHIRT). TIRANTES, COPA, MEDIA e BABY não contam como peça.

### Estados

`tabela`, `acima-de-40`, `desconhecida` (a palavra fora da tabela fica no lugar, em português, e a linha vai à DeepL), `sem-peca` e `varias-pecas` (peças ligadas por conectivo fora de um KIT, ou segunda peça que não está na lista). Peça colada que não está na lista (MEIA CALÇA, CALÇA LEGGING) é sinal de expressão que falta na tabela: vai para revisão em vez de sair "CALCETINES PANTALÓN".

## Medição no corpus (29/10/2026, 2.457 descrições distintas da IN27 e da AI27)

| Estado | EN | ES |
|---|---|---|
| tabela | 2.196 (89,4%) | 2.028 (82,5%) |
| desconhecida | 171 (7,0%) | 171 (7,0%) |
| acima de 40 | 62 (2,5%) | 246 (10,0%) |
| várias peças | 26 (1,1%) | 10 (0,4%) |
| sem peça | 2 (0,1%) | 2 (0,1%) |

O espanhol ao pé da letra é mais longo (TIRO ALTO, MANGA LARGA, CAMISETA SIN MANGAS): uma em cada dez descrições precisa de edição manual para caber em 40. EN e ES juntos levam 0,7 s nas 2.457 descrições.

## Pendências

- **Termos novos em validação na planilha** (98), entre eles os que fecham casos do conjunto de referência: MEIA CALÇA = MEDIAS, CALÇA LEGGING = LEGGING, COM TOUCA = CON CAPUCHA (no moletom), COM ABOTOAMENTO DUPLO = CON DOBLE BOTONADURA, GOLA CACHECOL = CUELLO BUFANDA, COM DRAPEADO = CON DRAPEADO e FAIXA (produto) = FAJÍN. Os testes desses casos rodam como TODO até as entradas entrarem.
- **SLEEP/SLIP** e o EN de ANÁGUA, por último.
- **Correções de grafia** (27) e **perguntas** (25) da planilha.
- DE FLORES ainda sai "DE FLORAL" no ES; a proposta DE FLORES = DE FLORES está na planilha de validação de 30/10. COM FLORES e COM CORTE A LASER entraram em 30/10 (ver abaixo).
- VESTIDO COM APLICAÇÃO DE FLORES sai "CON APLIQUE DE FLORAL" (EN "WITH FLORAL APPLIQUÉ"): COM APLICAÇÃO casa antes de APLICAÇÃO DE FLORES. Defeito do casamento de expressões sobrepostas, anterior ao ES; sem uso no corpus.
- MAIÔ CAVADO: CAVADO hoje é SISA PROFUNDA / DEEP ARMHOLE, mas no maiô é cava alta na perna (DE CORTE ALTO / HIGH-CUT, como BODY CAVADO). Para o dono decidir.
- Para o dono decidir: um adjetivo colado num substantivo que não é peça, como em BLUSA SEM MANGA ESTAMPA LISTRADA, hoje concorda com a peça e sai "ESTAMPADO RAYADA". O PT quer "ESTAMPADO RAYADO". Mudar a ordem resolve esse caso, mas mexe em casos ambíguos, como BLUSA GOLA ALTA ASSIMÉTRICA.

## Decisões do dono de 30/10/2026

O dono revisou a planilha do ChatGPT (31 apontamentos sobre os 806 termos) e pediu uma pesquisa geral do glossário: 148 agentes em 3 rodadas, com 803 dos 806 termos buscados na internet. O resultado está em `validacao-glossario-modalis-2026-10-30.xlsx`, aguardando as respostas dele. Entraram na tabela, com aprovação no chat:

| PT | ES antes | ES agora | Motivo |
|---|---|---|---|
| APLICAÇÃO, APLICAÇÕES, COM APLICAÇÃO(ÕES), COM APLICAÇÃO DE RENDA, APLICAÇÕES DE BRILHO, APLICAÇÃO DE FLORES | APLICACIÓN(ES), feminino | APLIQUE(S), masculino | APLIQUE é o enfeite (Zara, Mango, Wikcionário); APLICACIÓN se lê como o ato de aplicar. 4 letras a menos. |
| CIGARETE | CIGARRILLO | CIGARETTE | CIGARRILLO é "cigarro"; as lojas escrevem "pantalón cigarette" (H&M Chile). |
| MAIÔ | TRAJE DE BAÑO | TRAJE DE BAÑO ENTERO | Na América Latina, TRAJE DE BAÑO sozinho também é biquíni. ENTERO é a única forma entendida nas 4 regiões pesquisadas (Ripley e Falabella no Chile, Falabella na Colômbia e no Peru; equivale ao "completo" do México; na Espanha se diz BAÑADOR). ENTERIZO bate com MACACÃO. |
| COM FLORES (nova) | CON FLORALES (montado) | CON FLORES | Depois de CON vem substantivo. EN igual ao montado antes (WITH FLORAL) até o dono validar o EN. |
| COM CORTE A LASER (nova) | CON CORTADO A LÁSER (montado) | CON CORTE LÁSER | Mesmo motivo. EN igual ao montado antes (WITH LASER-CUT) até o dono validar. |
| COM BOJO (nova) | BOJO ficava fora da tabela | CON RELLENO (EN PADDED) | Como CORTININHA COM BOJO; Women'secret usa "con relleno". |
| LOOSE LOW SLIM (nova, índice 3) | JEANS LOOSE TIRO BAJO SLIM TIRO BAJO (montado) | LOOSE LOW SLIM (EN igual, nome de modelo) | Nome do modelo, explicado pela estilista em 30/10: mais baixo e mais justo que a cintura baixa normal, por isso a descrição traz também CINTURA BAIXA. O LOW do nome NÃO repete o LOW-RISE: o EN "LOW-RISE LOOSE LOW SLIM JEANS" está certo (o antigo, "LOW-RISE LOOSE SLIM JEANS", apagava parte do nome). Única peça das coleções (501CF009776, AI27); fica pronta caso o modelo volte. |

| RISE, HIGH e LOW sozinhos (removidos) | RISE / TIRO ALTO / TIRO BAJO | — (saíram da tabela) | Palavras em inglês que a tabela convertia sozinha, gerando erro silencioso ("CALÇA HIGH RISE" saía "HIGH-RISE RISE PANTS" como montada sem pendência). Nenhuma descrição PT das coleções as usa (o único LOW era o da LOOSE LOW SLIM). Sem elas, a palavra fica "desconhecida" e a linha vai para revisão. Decisão do dono; substitui a decisão RISE = TIRO do Claude Desktop. |

Ficam como estão, também aprovados: MACACÃO = ENTERIZO, ESVOAÇANTE = VAPOROSO, FECHO(S) = CORCHETE(S).

Medição no corpus (2.464 descrições distintas): nenhuma saída em EN mudou; no ES mudaram 17 linhas (todas APLIQUE), e 3 saíram de "acima de 40" (245 → 242). Testes: 232, 228 passam, 4 TODO.

Correção do corpus (30/10): na AI27 (sem cabeçalho) a descrição PT é a 4ª coluna, e a 5ª e a 6ª são o EN e o ES antigos. A extração usada nas medições de 29/10 pegava "a primeira célula com duas palavras em maiúsculas" e, em 15 linhas, caiu na coluna do EN antigo (ex.: "SHORT PU MID RISE", cujo PT é "SHORT PU CINTURA MÉDIA"). Os números de 29/10 acima (2.457 descrições) têm esse desvio de menos de 1%. Nenhuma descrição PT da IN27 ou da AI27 traz RISE.

A partir de 30/10 a tabela é editada direto. O script do scratchpad que gravou o ES em 29/10 (`gravar-es-na-tabela.js`) não deve rodar de novo: desfaria estas decisões.

## Revisão adversarial (29/10/2026)

A revisão teve 3 revisores e 3 verificadores, todos em Opus. Ela confirmou 18 achados: 1 alto, 4 médios e 13 baixos.
- **Corrigidos no mesmo dia (15):** SEM abrindo detalhe, que invertia o sentido de 6 linhas do corpus; tecidos sem gênero; NO/NÓ, que também afetava o EN em 2 linhas; conectivo solto no fim; segunda peça colada como alvo; exceções de gênero do PT; MESCLA; SIN na regra R9; adjetivo logo depois de palavra desconhecida; MIX masculino; o validador ES (plural, hífen, SIN/CON e falsos "peça a mais"); a tradução em massa, que perdia o idioma que voltou quando o outro falhava; e os números dos filtros "Editadas" e "Confirmadas".
- **Ficam para a planilha ou para o dono (3):** FLORES, CORTE A LASER e ESTAMPA LISTRADA.
- **Regressão no EN:** nenhuma. As 2.457 saídas em EN foram comparadas com o commit anterior, e só mudaram as 2 linhas de NO PESCOÇO, onde saiu o KNOT errado.

Lição: o ES ao pé da letra herda os erros do PT, como a descrição cortada no meio e o erro de concordância. Toda regra de concordância precisa de um caso com SEM, outro com tecido e outro com palavra desconhecida antes do adjetivo.
