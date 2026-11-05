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
- Pesquisados em 29/10: BABY LOOK = BABY TEE, FUSEAU/FUSÔ = FUSEAU, SHORT SAIA = FALDA PANTALÓN, BERMUDA = BERMUDA (peça própria em espanhol), SMOKING = SMOKING, DUO COLOR = BICOLOR, SHORT DOLL = SHORT PIJAMA, ALFAIATARIA = SASTRE. SMOKING, DUO COLOR e SHORT DOLL ainda NÃO entraram na tabela (04/11/2026: as 3 descrições do corpus saem "desconhecida"); vão para a sessão de SIM/NÃO como termos novos.
- **JEANS como tecido = DENIM** em todas as peças (FALDA DENIM, SHORT DENIM, BERMUDA DENIM); JEANS fica só para a calça (CALÇA JEANS = JEANS). Pesquisa nas três regiões: DENIM é a única forma neutra que aparece em nome de produto de loja grande na Espanha, no México e na América do Sul; PEÇA + JEANS não aparece na Espanha nem no México. Confirmado pelo dono.
- SILK = SERIGRAFÍA (estampa silk). PALHA DE SEDA = PAJA DE SEDA. TERMO/TERMOCOLANTE = TERMOADHESIVO. NAME = NAME.
- SLEEP fica igual ao PT até o dono validar: com outra peça, a linha vai para revisão; sozinho (SLEEP DE RENDA), sai como "tabela". SLIP também, fora de um vestido (SLIP DE RENDA = LACE SLIP / SLIP DE ENCAJE, "tabela"); logo depois de um vestido é o slip dress, VESTIDO LENCERO (desde 05/11/2026, ver abaixo).
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
| R19 | SLEEP/SLIP iguais ao PT até o dono validar | Com outra peça, linha marcada "várias peças" (revisão); sozinho, sai "tabela" (SLIP DE ENCAJE). Desde 05/11/2026, SLIP logo depois de um vestido é o slip dress (`contexto` VESTIDO) |
| R20 | Acima de 40 = edição manual | Estado `acima-de-40`; download bloqueia |

### Concordância (R3)

1. O gênero e o número do adjetivo no PT vêm da terminação (ESTAMPADA = f/s). Adjetivo que não muda no gênero (FRONTAL, LEVE, MESCLA) concorda só em número.
2. O substantivo com que ele concorda é, nesta ordem: o substantivo de um `COM X` logo antes (COM GOLA BORDADA), se o gênero e o número do PT batem; a peça mais próxima que bate (SAIA PAREO ESTAMPADA = FALDA); outro substantivo que bate, inclusive o tecido (DECOTE V BORDADO; DE TULE ESTAMPADO = DE TUL ESTAMPADO); e, se nada bate, a peça principal (erro de concordância do PT, como ETIQUETA BORDADO, sai certo no ES). Logo depois de uma palavra fora da tabela, fica a forma do próprio PT (o adjetivo é dela).
3. A forma do ES é a do gênero e número **do substantivo em espanhol**: GOLA (f) = CUELLO (m) → BORDADO; CALÇA (f) = PANTALÓN (m) → RAYADO; CÓS (m) = PRETINA (f) → ASIMÉTRICA.
4. O modelo de jaqueta (PUFFER, BOMBER), a segunda peça colada (CAMISA POLO, VESTIDO BLAZER) e a peça específica sem o núcleo repetido (o LENCERO de VESTIDO MIDI LENCERO) cedem o gênero à peça. Depois de COM, o particípio é substantivo (COM DRAPEADO = CON DRAPEADO).
5. Só COM abre detalhe. Em SEM MANGA ALONGADA o adjetivo é da peça (BLUSA SIN MANGAS ALARGADA), e não de SIN MANGAS, que ainda o faria plural. COM X sem gênero no ES (COM CINTURA ALTA = CON TIRO ALTO) não é alvo e fecha o detalhe anterior: em CALÇA COM FIVELA COM CINTURA ALTA LISTRADA, LISTRADA é da calça (PANTALÓN CON HEBILLA CON TIRO ALTO RAYADO), não da FIVELA (04/11/2026).
6. O gênero do substantivo no PT segue a terminação, com uma lista curta de exceções em `GENERO_PT`. São femininos LEGGING, VISCOSE e T-SHIRT; são masculinos PIJAMA, CÓS, MACACÃO e CARDIGÃ. A expressão inteira é procurada antes da palavra (T SHIRT, MINI SAIA).
7. Os tecidos (índice 8) têm gênero no ES (TUL m, SARGA f, PANA f…), para servirem de substantivo na concordância.

Outras regras do montador: o conectivo solto no fim de uma descrição cortada pelo SAP cai, como no EN ("COM DETALHE DE ZÍPER E" não vira "… Y"). A preposição do PT antes de uma expressão que traz a sua cai (R9), mas SIN nunca cai. NÓ e NÓS só casam com acento, porque sem acento são a contração NO/NOS (vale também para o EN).

Peças da mesma família que o EN junta numa só (05/11/2026): o inglês da específica tem mais palavras e termina na mesma palavra de peça. No ES, nada muda de lugar e o começo comum não se repete:
- **Genérica antes:** a específica perde o que repete. VESTIDO MIDI SLIP DRESS = VESTIDO MIDI LENCERO (forma da Zara: "VESTIDO MIDI LENCERO SATINADO"); TOP CORTININHA = TOP TRIANGULAR (antes TOP TOP TRIANGULAR); CORTININHA CORTININHA COM BOJO = TOP TRIANGULAR CON RELLENO.
- **Genérica depois, só com o núcleo:** ela cai. BLAZER DE MOLETOM BLAZER JEANS = BLAZER DE FELPA DENIM, e no EN DENIM FLEECE BLAZER. Antes do lote, as duas iam para "várias peças". Sem esta regra, o ES sairia BLAZER DE FELPA BLAZER DENIM como "tabela", porque BLAZER é segunda peça colada na R14.
- **Fora disso:** duas peças, e a linha vai para revisão. Ligadas por E, também: VESTIDO Y VESTIDO LENCERO. A REGATA que vira manga continua manga (R15).

No validador da DeepL em espanhol, SIN e CON contam, porque o sentido de termos fechados mora neles (SIN MANGAS, CON CAPUCHA). A peça a mais conta também no plural (PANTALONES) e na parte depois do hífen (T-SHIRT → SHIRT). TIRANTES, COPA, MEDIA e BABY não contam como peça.

### Estados

`tabela`, `acima-de-40`, `desconhecida` (a palavra fora da tabela fica no lugar, em português, e a linha vai à DeepL), `sem-peca` e `varias-pecas` (peças ligadas por conectivo fora de um KIT, ou segunda peça que não está na lista). Peça colada que não está na lista (hoje CALÇA LEGGING; MEIA CALÇA entrou na tabela em 03/11) é sinal de expressão que falta na tabela: sai "PANTALÓN LEGGING…", mas marcada como várias peças (revisão) em vez de passar como tabela.

## Medição no corpus (29/10/2026, 2.457 descrições distintas da IN27 e da AI27)

| Estado | EN | ES |
|---|---|---|
| tabela | 2.196 (89,4%) | 2.028 (82,5%) |
| desconhecida | 171 (7,0%) | 171 (7,0%) |
| acima de 40 | 62 (2,5%) | 246 (10,0%) |
| várias peças | 26 (1,1%) | 10 (0,4%) |
| sem peça | 2 (0,1%) | 2 (0,1%) |

Números de 29/10, com o corpus ainda de 2.457 (ver "Correção do corpus", 30/10). Em 05/11/2026 (2.464 distintas): EN tabela 2.222 (90,2%), desconhecida 158, acima de 40 62, várias peças 20, sem peça 2; ES tabela 2.054 (83,4%), desconhecida 158, acima de 40 242 (9,8%), várias peças 8, sem peça 2.

O espanhol ao pé da letra é mais longo (TIRO ALTO, MANGA LARGA, CAMISETA SIN MANGAS): uma em cada dez descrições precisa de edição manual para caber em 40. EN e ES juntos levam 0,7 s nas 2.457 descrições.

## Pendências

- **Termos novos em validação na planilha** (98). Entraram em 03/11: MEIA CALÇA (= PANTIMEDIAS, não MEDIAS) e COM DRAPEADO = CON DRAPEADO. Faltam: CALÇA LEGGING = LEGGING, COM TOUCA = CON CAPUCHA (no moletom) e COM ABOTOAMENTO DUPLO = CON DOBLE BOTONADURA, cujos 3 testes rodam como TODO; e GOLA CACHECOL = CUELLO BUFANDA e FAIXA (produto) = FAJÍN, cujos casos esperam 'varias-pecas' e 'sem-peca' até as entradas entrarem. Vão para a sessão de SIM/NÃO.
- **SLEEP**, o SLIP fora de um vestido e o EN de ANÁGUA, por último (o SLIP depois de vestido foi resolvido em 05/11).
- **Correções de grafia** (27) e **perguntas** (25) da planilha de 29/10: sem registro de aplicação (as 29 regras de 03/11 vieram do corpus, não desta aba). Encerrada como planilha em 04/11/2026; os itens em aberto vão para a sessão única de SIM/NÃO, que congela a terminologia em 12/11.
- ~~DE FLORES ainda sai "DE FLORAL" no ES~~ resolvido em 03/11/2026: DE FLORES = FLORAL / DE FLORES entrou na tabela. COM FLORES e COM CORTE A LASER entraram em 30/10 (ver abaixo).
- VESTIDO COM APLICAÇÃO DE FLORES: o ES foi consertado em 03/11 pela entrada DE FLORES (hoje "CON APLIQUE DE FLORES"); o EN segue "WITH FLORAL APPLIQUÉ". De fundo, COM APLICAÇÃO ainda casa antes de APLICAÇÃO DE FLORES. Defeito do casamento de expressões sobrepostas, anterior ao ES; sem uso no corpus.
- MAIÔ CAVADO: CAVADO hoje é SISA PROFUNDA / DEEP ARMHOLE, mas no maiô é cava alta na perna (DE CORTE ALTO / HIGH-CUT, como BODY CAVADO). Para o dono decidir.
- Para o dono decidir: um adjetivo colado num substantivo que não é peça concorda com a peça. O caso BLUSA SEM MANGA ESTAMPA LISTRADA foi resolvido em 03/11 pela entrada ESTAMPA LISTRADA (hoje "ESTAMPADO DE RAYAS"); a regra geral continua aberta. O PT quer "ESTAMPADO RAYADO". Mudar a ordem resolve esse caso, mas mexe em casos ambíguos, como BLUSA GOLA ALTA ASSIMÉTRICA.

## Decisões do dono de 30/10/2026

O dono revisou a planilha do ChatGPT (31 apontamentos sobre os 806 termos) e pediu uma pesquisa geral do glossário: 148 agentes em 3 rodadas, com 803 dos 806 termos buscados na internet. O resultado está em `historico/validacao-glossario-modalis-2026-10-30.xlsx` (movido pelo dono em 04/11/2026). Encerrada como planilha em 04/11: os itens em aberto vão para a sessão única de SIM/NÃO, que congela a terminologia em 12/11. Entraram na tabela, com aprovação no chat:

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

## Decisões do dono de 31/10/2026: família A FIO

A FIO estava como DISTRESSED / DESGASTADO (lista do setor de 22/10), mas nas descrições quer dizer borda crua, cortada e sem bainha. Isso foi confirmado pelas descrições antigas que o dono mostrou ("REGATA CORTE A FIO", "SAIA COM RECORTES A FIO", "BARRA A FIO", "ACABAMENTO A FIO", em malha e neoprene). O "corte a fio" do material de cadastro é outra coisa: a instrução de cortar no fio do tecido, que não aparece em títulos. A palavra no PT vem quase sempre depois de CORTE ou RECORTE, e por isso a família entrou em expressões (a mais longa vence).

| PT | EN | ES | Índice |
|---|---|---|---|
| A FIO (trocado) | RAW-EDGE (antes DISTRESSED) | SIN REMATAR, invariável (antes DESGASTADO, flexível) | 9 |
| CORTE A FIO, COM CORTE A FIO | RAW-EDGE | SIN REMATAR | 9 |
| ACABAMENTO A FIO | RAW-EDGE FINISH | ACABADO SIN REMATAR | 9 |
| RECORTE A FIO, RECORTES A FIO | RAW-EDGE CUTOUT(S) | RECORTE(S) SIN REMATAR | 12 |
| CORTES A FIO | RAW-EDGE CUTS | CORTES SIN REMATAR | 12 |
| BARRA A FIO | RAW HEM | BAJO SIN REMATAR | 12 |

- COM CORTE A FIO é adjetivo, como COM BOJO = PADDED. Sem a expressão, o EN saía "TANK TOP WITH RAW-EDGE".
- No ES, o CON antes de SIN REMATAR cai pela R9: REGATA COM CORTE A FIO sai "CAMISETA SIN MANGAS SIN REMATAR".
- CRUDO ficou de fora porque em espanhol é cor (cru).
- CORTE e CORTES sozinhos continuam fora da tabela.

Medição no corpus (2.464 descrições): nada muda, porque nenhuma descrição da IN27 ou da AI27 traz A FIO. A tabela passou a ter 814 entradas.

Pendências:
- COM X E CORTE A FIO repete o papel de detalhe pelo E e sai "BLOUSE WITH EMBROIDERY AND RAW-EDGE" / "BLUSA CON BORDADO Y SIN REMATAR". É uma limitação da regra do E com termo adjetivo, sem uso no corpus.
- RECORTE = CUTOUT pode ser PANEL em cerca de 58 descrições (recorte de costura e não vazado). É uma pergunta para a estilista.

## Decisões do dono de 03/11/2026 (revisão do ChatGPT + pesquisa com revisores)

A revisão do ChatGPT (`modalis_revisao_glossario_2026-10-30.xlsx`) partiu do arquivo de 30/10. Ela não sabia do A FIO de 31/10 e aprovou HIGH/MID/LOW RISE, contra a decisão de 30/10; esses dois pontos não foram aplicados.

Os termos de espanhol e as dúvidas passaram por pesquisa no varejo, com um revisor cético (Opus) para cada frente. **O EN e o ES antigos das planilhas do setor não são referência.**

| PT | EN | ES | Índice | Motivo |
|---|---|---|---|---|
| VESTIDO REGATA (nova) | TANK DRESS | VESTIDO SIN MANGAS | 1 | Antes saía "várias peças" (DRESS WITH TANK TOP). |
| VESTIDO POLO (nova) | POLO DRESS | VESTIDO POLO | 1 | Antes saía "…SHORT DRESS WITH POLO". |
| CAMISA PIJAMA (nova) | PAJAMA SHIRT | CAMISA PIJAMA | 1 | Sem o DE, igual a CALÇA PIJAMA = PANTALÓN PIJAMA e ao caso de referência ES. |
| SAIA PAREÔ (nova) | PAREO SKIRT | FALDA PAREO | 16 | Forma da Zara ("DRAPED STRIPED PAREO SKIRT"), mais perto do PT que SARONG SKIRT. |
| MEIA CALÇA (nova) | TIGHTS | PANTIMEDIAS | 15 | MEDIAS é a meia curta na Colômbia, no Peru e na Argentina, e PANTY é a calcinha na Colômbia e na Venezuela. PANTIMEDIAS (RAE; México, Colômbia, Argentina, Peru, Chile) não se confunde com nenhuma das duas. Nenhuma forma é pan-hispânica: na Espanha se diz MEDIAS ou PANTIS. Ela também evita a colisão de MEDIAS com o adjetivo MEDIAS no validador. |
| MEIA FINA (nova) | SHEER TIGHTS | PANTIMEDIAS FINAS | 15 | O dono: "são coisas diferentes" (a meia fina, tipo Trifil). Não há meia opaca nas descrições. |
| ESTAMPA LISTRADA (nova) | STRIPED PRINT | ESTAMPADO DE RAYAS (substantivo) | 9 | O dono recusou DE RAYAS, que apaga ESTAMPA. Como substantivo, ESTAMPADO não concorda com a peça; antes saía "ESTAMPADO RAYADA" e, no EN, "PRINT STRIPED BLOUSE". |
| DE FLORES (nova) | FLORAL | DE FLORES | 9 | Também conserta COM APLICAÇÃO DE FLORES no ES ("CON APLIQUE DE FLORES", antes "DE FLORAL"). |
| COM DRAPEADO (nova) | WITH DRAPING | CON DRAPEADO | 12 | Antes "WITH DRAPED" (adjetivo depois de WITH). |
| COM FRANZIDO, COM FRANZIDOS (novas) | GATHERED (adjetivo, antes da peça) | CON FRUNCIDO(S) | 12 | Antes "WITH GATHERED". |
| MILITAR (novo) | MILITARY | MILITAR (flexível) | 2 | Junto de UTILITÁRIA = UTILITY. |
| COM CINTURA ALTA/MÉDIA/BAIXA (novas) | HIGH-/MID-/LOW-RISE (adjetivo) | CON TIRO ALTO/MEDIO/BAJO | 5 | Antes "CARROT PANTS WITH MID-RISE". A cintura entrou como expressão da tabela, e não como regra no código, porque o CÓS (mesmo índice) é substantivo e continua detalhe: "WITH ELASTIC WAISTBAND". |
| COM ESTAMPA (removida) | — | — | 9 | A regra do COM já dá WITH PRINT / CON ESTAMPADO. A expressão engolia a palavra ESTAMPA de ESTAMPA FLORAL/LOCAL/DE FLORES/LISTRADA ("BLOUSE WITH PRINT FLORAL"). Hoje sai BLOUSE WITH FLORAL PRINT e WITH PLACEMENT PRINT ("local print" não existe em inglês). |

Grafia: 29 regras novas em `correcoesOrtograficas.js` (OVERIZED, BALZER, XADREX, SAMLESS, MANHA LONGA…). São erros que ainda escapavam no corpus, 1 ocorrência cada. Continuam só sugestão. Ficaram de fora os incertos: BOLLON, FULL e LENGTH sozinhos. Em 04/11/2026 entrou mais uma, LENGHT → LENGTH (erro de digitação puro), e o total passou a 54. Em 05/11/2026 saiu SLIPDRESS → SLIP DRESS: a DESCRIÇÃO fica como o setor escreve, e quem traduz é a tabela. O total é 53.

Medição no corpus (2.464 descrições), antes × depois:
- EN: 29 mudaram, todas para melhor (24 dos termos e 5 do comprimento antes da peça). Em "tabela", passaram de 2.212 para 2.218; "várias peças", de 26 para 21; "acima de 40" ficou em 62.
- ES: 3 mudaram (COLETE JEANS MILITAR, MEIA CALÇA FUSÔ DE RENDA, BLUSA SEM MANGA ESTAMPA LISTRADA). Em "tabela", passaram de 2.048 para 2.050; "várias peças", de 10 para 9.
- Grafia: 27 descrições ganham sugestão nova.
- A tabela tem 828 entradas.

Pendências deste lote:
- ~~Comprimento colado (SHORT/LONG)~~ **decidido e feito em 03/11**. SHORT e LONG vão antes da peça inteira quando ela tem mais de uma palavra (SHORT TANK TOP, SHORT DENIM SKIRT, SHORT POLO DRESS). MINI/MIDI/MAXI continuam colados (POLO MINI DRESS, DENIM MINI SKIRT), e peça de uma palavra não muda (TWILL SHORT JUMPSUIT). Mais 5 descrições do corpus mudaram, e o total do lote no EN ficou em 29. Antes saía TANK SHORT TOP e DENIM SHORT SKIRT.
- **Hífen no EN e forma de detalhe.** A regra do Chicago (hífen antes da peça, aberto depois de WITH) pede um campo de forma de detalhe na tabela. Sem ele, o hífen pioraria "DRESS WITH LONG-SLEEVE". São 57 termos, e 19 descrições do corpus já saem "WITH … SLEEVE" no singular. Lote separado, com a lista para o dono aprovar.
- **COM X E CINTURA ALTA.** O E repete o papel de detalhe ("CALÇA COM BOLSOS E CINTURA ALTA" → "…WITH POCKETS AND HIGH-RISE"). Não há caso no corpus.
- **XADREZ sozinho.** Sai CUADROS ("BLUSA CUADROS"); no espanhol se diz DE CUADROS. Pesquisar junto com ESTAMPA XADREZ.
- **MEIA CALÇA FUSÔ.** No ES sai PANTIMEDIAS FUSEAU, porque FUSÔ = FUSEAU já está na tabela. No varejo, para meia-calça, aparece "sin pie" ou "con estribo"; revisar se aparecer de novo.

## Decisões do dono de 04/11/2026: correções da revisão de 03/11

A revisão adversarial do lote de 03/11 (3 revisores Opus, depois do commit `2b3dd5b`) achou 4 pontos. O dono decidiu:

| PT | EN | ES | O que mudou |
|---|---|---|---|
| COM CINTURA ALTA/MÉDIA/BAIXA | HIGH-/MID-/LOW-RISE | CON TIRO ALTO/MEDIO/BAJO, sem gênero e número | Com gênero, o TIRO virava alvo da concordância: SAIA COM CINTURA ALTA ESTAMPADA saía FALDA CON TIRO ALTO ESTAMPADO. Hoje sai ESTAMPADA. |
| COM DRAPEADOS (nova, índice 12) | WITH DRAPING | CON DRAPEADOS | O plural caía no DRAPEADOS solto: "BLOUSE WITH DRAPED". |
| VESTIDO SLIP (nova, índice 1) | SLIP DRESS | VESTIDO LENCERO | Antes saía "DRESS WITH SLIP…", "várias peças". |
| MEIA TAÇA | HALF CUP | MEDIA COPA | Só o teste: confere que a expressão vence a peça MEIA. HALF CUP ou DEMI CUP, e SUTIÃ (fora da tabela), vão para a sessão de SIM/NÃO; nenhum dos dois aparece no corpus. |

A tabela passou a 830 entradas.

## Decisões do dono de 05/11/2026: SLIP DRESS e FIRENZE

O dono pediu que todo slip dress saia certo em inglês, sem DRESS repetido: junto ou separado, com ou sem VESTIDO na frente, com MIDI, LONGO etc. Pediu também que a DESCRIÇÃO em PT fique como o setor escreve. Por isso saíram as regras de grafia de SLIP: a de 03/11 (SLIPDRESS → SLIP DRESS) e as de 04/11, que trocavam por VESTIDO SLIP. Quem traduz é a tabela.

| PT | EN | ES | Índice | Motivo |
|---|---|---|---|---|
| SLIPDRESS, SLIP DRESS, VESTIDO SLIP DRESS (novas) | SLIP DRESS | VESTIDO LENCERO | 1 | São as formas do setor. VESTIDO SLIPDRESS não precisou de entrada: a regra abaixo junta VESTIDO e SLIPDRESS. |
| SLIP depois de vestido (novo sentido, `contexto` VESTIDO) | SLIP DRESS | VESTIDO LENCERO | 1 | Vale quando a peça mais próxima antes do SLIP tem VESTIDO e a palavra logo antes dele não é conectivo (VESTIDO MIDI SLIP, VESTIDO DE CETIM SLIP). Um detalhe no meio não separa: VESTIDO COM ALÇAS SLIP = SLIP DRESS WITH STRAPS. Sozinho, depois de outra peça ou logo depois de COM, SEM, E, DE, EM, NO, PARA, segue a anágua (R19): VESTIDO COM SLIP = DRESS WITH SLIP; VESTIDO DE SLIP vai para revisão. |
| FIRENZE (novo) | FIRENZE | FIRENZE (m) | 8 | Tecido, nome comercial: não se traduz. O dono aceita o ES com ou sem DE; sai sem, seguindo o PT. |

Regras do montador:
- A expressão que embute a peça genérica com um modificador (VESTIDO MIDI, VESTIDO LONGO, VESTIDO CURTO, VESTIDO JEANS) cede a uma peça mais específica da mesma família. Em VESTIDO MIDI SLIP DRESS, o casamento é refeito como VESTIDO + MIDI + SLIP DRESS. No EN, SLIP DRESS absorve VESTIDO, e o MIDI fica no papel dele: SLIP MIDI DRESS, LONG SLIP DRESS, DENIM SLIP DRESS. No ES, a ordem segue o PT, sem repetir o núcleo: VESTIDO MIDI LENCERO, VESTIDO LARGO LENCERO, VESTIDO DENIM LENCERO. A expressão só cede se nenhuma palavra dela vira desconhecida: SAIA LÁPIS fica inteira, porque LÁPIS sozinho não está na tabela. A regra vale para qualquer família, não só para o vestido: VESTIDO MIDI VESTIDO REGATA vira TANK MIDI DRESS, e SAIA CURTA SAIA PAREÔ vira SHORT PAREO SKIRT. Antes, essas linhas iam para revisão; cada linha do SAP é um produto, e duas peças de verdade vêm com KIT ou E.
- A absorção compara a última palavra do inglês, que é a peça. TRIANGLE TOP absorve TOP, mas SLIP DRESS não absorve SLIP (a anágua, que em inglês também é SLIP).
- Só peças soltas, sem preposição, se juntam:
  - **E ou "+":** nada é absorvido através deles. VESTIDO E VESTIDO REGATA, MEIA CALÇA E MEIA FINA e VESTIDO E SLIP DRESS são duas peças e vão para revisão; antes, uma sumia sem aviso (pendência da revisão de 03/11).
  - **O "+"** é um conectivo próprio nos dois idiomas. Ele separa peças como o E, mas não repete o papel do termo anterior: BLUSA COM BOLSO + SAIA são duas peças, e a SAIA não vira detalhe. Antes, o EN apagava o "+", e VESTIDO + SLIP virava um slip dress. No ES, ele sai Y, como já saía.
  - **Peça negada** não absorve nem é absorvida (VESTIDO SEM SLIP DRESS = DRESS WITHOUT SLIP DRESS, revisão). Ela também nunca é o núcleo: sozinha (SEM SLIP DRESS), a linha fica "sem peça". Antes do lote, BLUSA SEM BLUSA JEANS saía DENIM BLOUSE e RETA SEM CORTININHA COM BOJO saía STRAIGHT PADDED TRIANGLE TOP, as duas com a negação perdida e em "tabela".
  - **Peça depois de DE/EM/NO:** fica separada. VESTIDO MIDI DE VESTIDO são duas peças; antes, o ES saía VESTIDO MIDI DE.
- A fusão JEANS/MOLETOM da calça e do short não vale com COM ou SEM: CALÇA SEM MOLETOM = PANTS WITHOUT FLEECE (antes SWEATPANTS, com a negação perdida; achado da revisão, já existia).
- A expressão não cede por cima de COM, SEM ou E: VESTIDO POLO COM VESTIDO JEANS continua POLO DRESS WITH DENIM DRESS.

Medição no corpus (2.464 descrições): mudaram só as 4 descrições com SLIP, todas para "tabela" (antes, 3 "desconhecida" e 1 "várias peças"). EN tabela 2.218 → 2.222, desconhecida 161 → 158, várias peças 21 → 20; ES tabela 2.050 → 2.054, várias peças 9 → 8. Vão à DeepL 180 descrições (7,3%; eram 184). A trava do E e o núcleo não repetido no ES não têm caso no corpus. A tabela tem 835 entradas, e a grafia 53 regras.

Pendências, para a sessão de SIM/NÃO:
- **MIDI SLIP DRESS.** A regra de 03/11 cola MINI/MIDI/MAXI na palavra da peça, e por isso sai SLIP MIDI DRESS. O varejo em inglês escreve MIDI SLIP DRESS: a Zara chama de "SATIN MIDI SLIP DRESS" o mesmo produto que em espanhol é "VESTIDO MIDI LENCERO SATINADO", e a Ralph Lauren e a Old Navy escrevem igual. Mudar vale para todas as peças de duas palavras (POLO MINI DRESS, TANK MIDI DRESS).
- **SHORT/LONG depois do tecido.** Sai SATIN SHORT SLIP DRESS, e o inglês natural é SHORT SATIN SLIP DRESS. A regra também vale para as outras peças.
- **Plurais.** VESTIDOS (plural) e SLIP DRESSES não estão na tabela e vão à DeepL. Sem caso no corpus.
- **MOLETOM e JEANS ligados por E ou + a outra peça** continuam lidos como tecido, como antes do lote: VESTIDO E MOLETOM = FLEECE DRESS / VESTIDO Y FELPA, como "tabela". Pode ser lista de tecidos (BLUSA DE LINHO E MOLETOM) ou duas peças sem KIT. Sem caso no corpus; os KIT do corpus vão para revisão de qualquer jeito.
- **Vírgula e &** não separam peças: "VESTIDO, SLIP" e "VESTIDO & SLIP" viram um slip dress. Sem caso no corpus (o único & é o de P&B).
- **O E repete o papel do termo anterior, mesmo quando isso não faz sentido** (já era assim antes do lote):
  - BLUSA COM RENDA E SAIA sai BLOUSE WITH LACE AND SKIRT, como "tabela" (a SAIA vira detalhe);
  - VESTIDO SEM MANGA E CINTO sai SLEEVELESS DRESS WITHOUT BELT.
  O "+" já não faz isso. Para o E, a decisão é do dono: "COM X E peça" é detalhe ou segunda peça?
- **KIT COM peça repetida, no ES:** KIT COM TOP CORTININHA sai KIT CON TOP TOP TRIANGULAR. Já era assim, sem caso no corpus. O EN marca a linha como "várias peças", então ela vai para revisão.

## Revisão adversarial (29/10/2026)

A revisão teve 3 revisores e 3 verificadores, todos em Opus. Ela confirmou 18 achados: 1 alto, 4 médios e 13 baixos.
- **Corrigidos no mesmo dia (15):** SEM abrindo detalhe, que invertia o sentido de 6 linhas do corpus; tecidos sem gênero; NO/NÓ, que também afetava o EN em 2 linhas; conectivo solto no fim; segunda peça colada como alvo; exceções de gênero do PT; MESCLA; SIN na regra R9; adjetivo logo depois de palavra desconhecida; MIX masculino; o validador ES (plural, hífen, SIN/CON e falsos "peça a mais"); a tradução em massa, que perdia o idioma que voltou quando o outro falhava; e os números dos filtros "Editadas" e "Confirmadas".
- **Ficam para a planilha ou para o dono (3):** FLORES, CORTE A LASER e ESTAMPA LISTRADA (resolvidos depois: COM FLORES e COM CORTE A LASER em 30/10; ESTAMPA LISTRADA e DE FLORES em 03/11).
- **Regressão no EN:** nenhuma. As 2.457 saídas em EN foram comparadas com o commit anterior, e só mudaram as 2 linhas de NO PESCOÇO, onde saiu o KNOT errado.

Lição: o ES ao pé da letra herda os erros do PT, como a descrição cortada no meio e o erro de concordância. Toda regra de concordância precisa de um caso com SEM, outro com tecido e outro com palavra desconhecida antes do adjetivo.
