// v22 — Cuarta y quinta familia del banco: progresión y finalización.
// Ahora el partido también te pregunta cuando atacás.
// Cada arquetipo sale del rival (cuántos volantes tiene, si se mete atrás, si marca al hombre, si tiene línea de 5)
// y de cómo atacás vos. Cada arquetipo tiene una respuesta buena, una media y una trampa: las mismas del mazo "Los 110 problemas".
Object.assign(PRINCIPIOS,{
 triangulo:{n:['Triángulos en la banda','Triângulos na faixa','Triangles on the flank'],d:['Tres jugadores en triángulo siempre tienen dos pases: el que marca a uno deja libre al otro.','Três jogadores em triângulo sempre têm dois passes.','Three players in a triangle always have two passes: whoever marks one frees the other.']},
 carril:{n:['Ocupar el carril intermedio','Ocupar o corredor intermediário','Occupy the half-space'],d:['Entre el lateral y el central rival hay un carril que nadie defiende del todo: el que recibe ahí ya superó una línea.','Entre o lateral e o zagueiro há um corredor que ninguém defende por inteiro.','Between their full-back and centre-back there is a lane nobody fully owns: whoever receives there has beaten a line.']},
 ladoDebil:{n:['Atraer de un lado, atacar del otro','Atrair de um lado, atacar do outro','Draw them one side, attack the other'],d:['Si todo su bloque se vuelca a la pelota, el peligro está donde la pelota no está.','Se todo o bloco vai para a bola, o perigo está onde a bola não está.','If their whole block leans to the ball, the danger is where the ball is not.']},
 llegada:{n:['Llegar al área: tiempos y espacios','Chegar na área: tempos e espaços','Arriving in the box: timing and space'],d:['Gana el que llega en movimiento al espacio libre, no el que espera parado adentro del área.','Ganha quem chega em movimento ao espaço livre.','The one who arrives on the move into free space wins, not the one standing in the box.']}
});
N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;

// ---------- PROGRESIÓN ----------
const SOLUCIONES_PROGRESION=[
 {id:'triangulo',p:'triangulo',r:'bajo',pr:.06,g:/MC$|MCO|^E/,vs:1,t:['Triangulación de banda: lateral, interior y extremo','Triangulação na faixa: lateral, meia e ponta','Wide triangle: full-back, inside mid and winger'],
  si:['En la banda sobra uno: el que lo marca a uno deja libre al otro.','Na faixa sobra um: quem marca um libera o outro.','There is a spare man wide: whoever marks one frees the other.'],no:['Todo pasa en un lugar chico que ellos ya tienen cerrado.','Tudo acontece num espaço pequeno que eles já fecharam.','It all happens in a small space they have already closed.'],
  mv:{LD:[86,52],IN2:[76,58],ED:[90,68]},b:[[86,52],[76,58],[90,68]]},
 {id:'doblaFuera',p:'amplitud',r:'medio',pr:.06,g:/LT/,vs:1,t:['Lateral que dobla por fuera del extremo','Lateral que passa por fora do ponta','Full-back overlaps the winger'],
  si:['Por dentro no hay nada: el lateral que pasa por detrás del extremo le gana la espalda al que sale.','Por dentro não há nada: o lateral que passa por trás do ponta ganha as costas.','Nothing is on inside: the full-back running round the winger gets in behind the man who steps out.'],no:['Subís al lateral y a la espalda no hay nadie para cuidar la pérdida.','Sobe o lateral e não há ninguém para cobrir a perda.','You push the full-back on and nobody covers if you lose it.'],
  mv:{ED:[80,62],LD:[92,74]},b:[[80,62],[92,76]]},
 {id:'extremoAdentro',p:'fijar',r:'medio',pr:.06,g:/^E/,vs:1,t:['Extremo hacia adentro, lateral por fuera','Ponta para dentro, lateral por fora','Winger comes inside, full-back goes outside'],
  si:['Su lateral persigue al extremo hacia adentro: la banda queda vacía para tu lateral.','O lateral deles persegue o ponta: a faixa fica vazia.','Their full-back follows the winger inside: the flank is empty for your full-back.'],no:['Nadie lo sigue: metés al extremo donde ya había gente.','Ninguém o segue: coloca o ponta onde já havia gente.','Nobody follows him: you put the winger where there were already bodies.'],
  mv:{ED:[72,62],LD:[92,66]},b:[[88,46],[92,66]]},
 {id:'sobrecarga',p:'ladoDebil',r:'bajo',pr:.06,g:/MC/,vs:1,t:['Sobrecargar un lado para aislar al del otro','Sobrecarregar um lado para isolar o outro','Overload one side to isolate the other'],
  si:['Bascularon todos: cuatro tuyos los atraen y del otro lado tu extremo queda solo.','Todos basculam: quatro seus atraem e do outro lado o ponta fica só.','They all shifted: four of yours draw them and your far winger is left alone.'],no:['No basculan: amontonás gente en un lado y te quedás sin salida.','Não basculam: amontoa gente e fica sem saída.','They do not shift: you pile bodies on one side and run out of exits.'],
  mv:{IN2:[78,56],MC:[66,46],ED:[90,62]},b:[[78,56],[90,62]]},
 {id:'cambioFrente',p:'ladoDebil',r:'bajo',pr:.06,g:/MCD|DFC/,vs:2,t:['Cambio de frente después de atraer','Inversão depois de atrair','Switch play after drawing them in'],
  si:['Están volcados de un lado: el pase largo al otro te deja de frente y con espacio.','Estão todos de um lado: o passe longo deixa você de frente.','They are all on one side: the long pass to the other leaves you facing forward with space.'],no:['Cambiás de frente y del otro lado ya te estaban esperando.','Inverte e do outro lado já esperavam.','You switch and the other side was already waiting.'],
  mv:{LI:[10,58],EI:[12,70]},b:[[66,46],[12,68]]},
 {id:'pausa',p:'gestion',r:'bajo',pr:.04,g:/DFC|MCD/,vs:1,t:['Pausa: volver atrás y empezar de nuevo','Pausa: voltar e começar de novo','Pause: go back and start again'],
  si:['Te cerraron todo: tenerla y moverlos de nuevo es la única forma de abrir un hueco.','Fecharam tudo: ficar com a bola é a única forma de abrir espaço.','They have closed everything: keeping it and moving them again is the only way to open a gap.'],no:['Había un pase y lo dejaste pasar: le das tiempo a que se acomoden.','Havia um passe e você deixou passar.','There was a pass on and you let it go: you give them time to reset.'],
  mv:{CD:[62,24],MC:[52,34]},b:[[62,26]]},
 {id:'interiorCarril',p:'carril',r:'medio',pr:.07,g:/MC$|MCO/,vs:1,t:['Interior que se abre al carril intermedio','Meia que abre no corredor intermediário','Inside mid moves into the half-space'],
  si:['Cerraron afuera y entre su lateral y su central no hay nadie: el que recibe ahí ya está de frente.','Fecharam fora e entre lateral e zagueiro não há ninguém.','They closed the flank and nobody is between full-back and centre-back: whoever receives there is already facing goal.'],no:['El carril está ocupado: recibís de espaldas y te la sacan.','O corredor está ocupado: recebe de costas e perde.','The lane is occupied: you receive with your back to goal and lose it.'],
  mv:{IN2:[74,60]},b:[[74,60]]},
 {id:'rompeLinea',p:'saltear',r:'medio',pr:.07,g:/DFC|MCD/,vs:2,t:['Pase que rompe la línea al 9','Passe que rompe a linha para o 9','Line-breaking pass into the 9'],
  si:['Dejaron al 9 solo con el central: un pase y saltaste dos líneas.','Deixaram o 9 sozinho com o zagueiro: um passe e você pulou duas linhas.','They left the 9 alone with the centre-back: one pass and you skipped two lines.'],no:['El central está encima del 9 y los volantes cierran el pase: es perderla en el medio.','O zagueiro está em cima do 9: é perder no meio.','The centre-back is tight on the 9 and the midfield closes the lane: you lose it in the middle.'],
  mv:{DC:[52,66]},b:[[52,66]]},
 {id:'nueveBaja',p:'fijar',r:'medio',pr:.07,g:/DC/,vs:2,t:['El 9 baja y arrastra a su central','O 9 recua e arrasta o zagueiro','The 9 drops and drags his centre-back'],
  si:['Su central lo sigue a todos lados: si el 9 baja, a la espalda queda el hueco para el que llega.','O zagueiro o segue: se o 9 recua, fica o buraco nas costas.','Their centre-back follows him everywhere: if the 9 drops, the gap opens behind for a runner.'],no:['Nadie lo sigue: tu 9 baja y en el área no queda nadie.','Ninguém o segue: o 9 recua e a área fica vazia.','Nobody follows: your 9 drops and the box is empty.'],
  mv:{DC:[50,56],IN1:[42,74]},b:[[50,56],[42,74]]},
 {id:'conduccion',p:'medio',r:'medio',pr:.06,g:/MC$|MCO/,vs:1,t:['El interior conduce hasta que alguien salga','O meia conduz até alguém sair','The inside mid carries it until someone steps out'],
  si:['Nadie sale al que conduce: si nadie lo frena, llega solo a la frontal; si sale uno, deja a alguien libre.','Ninguém sai em quem conduz.','Nobody steps out to the carrier: unchallenged he reaches the edge; if someone steps out, he frees a team-mate.'],no:['Conducís contra un bloque que te espera: chocás y arranca su contra.','Conduz contra um bloco que espera: bate e começa o contra-ataque.','You carry into a waiting block: you run into it and their counter starts.'],
  mv:{IN2:[60,64]},b:[[62,50],[60,64]]},
 {id:'tercerHombre',p:'tercero',r:'medio',pr:.07,g:/MC/,vs:2,t:['Tercer hombre que llega al espacio','Terceiro homem que chega no espaço','Third man running into space'],
  si:['Su línea mira al que recibe, no al que llega: el tercero aparece solo a la espalda.','A linha olha quem recebe, não quem chega.','Their line watches the receiver, not the runner: the third man arrives alone in behind.'],no:['No hay espacio a la espalda: el que llega se encuentra con la línea.','Não há espaço nas costas.','There is no space in behind: the runner meets the back line.'],
  mv:{DC:[52,60],IN1:[40,76]},b:[[52,60],[40,76]]},
 {id:'lateralDentro',p:'carril',r:'medio',pr:.06,g:/LT/,vs:1,t:['Lateral que pasa por dentro','Lateral que passa por dentro','Full-back underlaps inside'],
  si:['Su extremo sigue a tu lateral hasta adentro: lo arrastra y libera la banda para tu extremo.','O ponta deles segue seu lateral: libera a faixa.','Their winger tracks your full-back inside: he drags him and frees the flank for your winger.'],no:['Nadie lo sigue: amontonás gente en el medio y la banda queda sin nadie.','Ninguém o segue: amontoa gente no meio.','Nobody follows: you crowd the middle and leave the flank empty.'],
  mv:{LD:[72,54],ED:[90,64]},b:[[72,54],[90,64]]}
];
// [nombre, situación] × es/pt/en · buena · media · trampa  (mismo orden que el mazo)
const CASOS_PROGRESION=[
 [['Cierran el centro · banda','Fecham o centro · faixa','They close the middle · flank'],['Cierran el medio y en la banda sobra uno.','Fecham o meio e na faixa sobra um.','They close the middle and there is a spare man wide.'],'triangulo','doblaFuera','rompeLinea'],
 [['Cierran el centro · su lateral sale','Fecham o centro · o lateral sai','They close the middle · full-back steps out'],['Su lateral sale solo a tu extremo.','O lateral deles sai sozinho no ponta.','Their full-back steps out alone to your winger.'],'doblaFuera','triangulo','conduccion'],
 [['Cierran el centro · lo siguen','Fecham o centro · seguem o ponta','They close the middle · he is tracked'],['Su lateral sigue a tu extremo hacia adentro.','O lateral segue o ponta para dentro.','Their full-back follows your winger inside.'],'extremoAdentro','doblaFuera','interiorCarril'],
 [['Cierran el centro · todo un lado','Fecham o centro · um lado inteiro','They close the middle · one whole side'],['Bascularon todos al lado de la pelota.','Todos bascularam para o lado da bola.','They have all shifted to the ball side.'],'sobrecarga','cambioFrente','triangulo'],
 [['Cierran el centro · bloque bajo','Fecham o centro · bloco baixo','They close the middle · low block'],['Bloque bajo, centro cerrado y sin espacio a la espalda.','Bloco baixo, centro fechado e sem espaço nas costas.','Low block, closed middle and no space in behind.'],'doblaFuera','pausa','rompeLinea'],
 [['Cierran las bandas · carril libre','Fecham as faixas · corredor livre','They close the flanks · lane free'],['Cierran afuera y el carril intermedio está vacío.','Fecham fora e o corredor está vazio.','They close the flanks and the half-space is empty.'],'interiorCarril','tercerHombre','triangulo'],
 [['Cierran las bandas · el 9','Fecham as faixas · o 9','They close the flanks · the 9'],['Tu 9 recibe con su central encima, pero solo.','Seu 9 recebe com o zagueiro em cima, mas sozinho.','Your 9 receives with the centre-back on him, but alone.'],'rompeLinea','tercerHombre','doblaFuera'],
 [['Cierran las bandas · marcan al 9','Fecham as faixas · marcam o 9','They close the flanks · the 9 is marked'],['Su central sigue a tu 9 a todos lados.','O zagueiro segue seu 9 por todo lado.','Their centre-back follows your 9 everywhere.'],'nueveBaja','rompeLinea','triangulo'],
 [['Cierran las bandas · nadie sale','Fecham as faixas · ninguém sai','They close the flanks · nobody steps out'],['Nadie sale al interior que conduce.','Ninguém sai no meia que conduz.','Nobody steps out to the inside mid carrying it.'],'conduccion','interiorCarril','pausa'],
 [['Cierran las bandas · espalda','Fecham as faixas · costas','They close the flanks · in behind'],['Su línea mira al que recibe, no al que llega.','A linha olha quem recebe, não quem chega.','Their line watches the receiver, not the runner.'],'tercerHombre','rompeLinea','conduccion'],
 [['Su extremo te marca','O ponta deles marca','Their winger marks'],['Su extremo sigue a tu lateral hasta adentro.','O ponta segue seu lateral até dentro.','Their winger tracks your full-back all the way inside.'],'lateralDentro','extremoAdentro','doblaFuera'],
 [['Medios de 3 · carril','Meio de 3 · corredor','Midfield three · half-space'],['Tres volantes contra tus cuatro por dentro.','Três volantes contra seus quatro por dentro.','Three midfielders against your four inside.'],'interiorCarril','conduccion','doblaFuera'],
 [['Línea de 5 · volcados','Linha de 5 · deslocados','Back five · shifted over'],['Su línea de cinco se volcó a un costado.','A linha de cinco foi para um lado.','Their back five has shifted to one side.'],'cambioFrente','sobrecarga','rompeLinea'],
 [['Todo cerrado','Tudo fechado','Everything closed'],['Te cerraron todo y forzar es perderla.','Fecharam tudo e forçar é perder.','They have closed everything and forcing it means losing it.'],'pausa','cambioFrente','rompeLinea']
];
// ---------- FINALIZACIÓN ----------
const SOLUCIONES_FINALIZACION=[
 {id:'atrasFondo',p:'llegada',r:'bajo',pr:.07,g:/^E|LT/,vs:2,t:['Pase atrás desde la línea de fondo','Passe para trás da linha de fundo','Cut-back from the byline'],
  si:['Defienden mirando su arco: el pase atrás llega a uno que remata de frente.','Defendem olhando o próprio gol: o passe para trás chega de frente.','They defend facing their own goal: the cut-back finds a man shooting facing forward.'],no:['Tienen a uno en la frontal esperando justo ese pase.','Têm um na entrada da área esperando esse passe.','They have a man on the edge waiting for exactly that pass.'],
  mv:{ED:[88,92],IN2:[58,84]},b:[[88,92],[58,84]]},
 {id:'segundoPalo',p:'ladoDebil',r:'bajo',pr:.06,g:/^E|LT/,vs:2,t:['Centro al segundo palo','Cruzamento no segundo pau','Cross to the far post'],
  si:['Cerraron el primer palo: el segundo queda con uno tuyo contra nadie.','Fecharam o primeiro pau: o segundo fica livre.','They closed the near post: the far post is yours against nobody.'],no:['El segundo palo ya estaba ocupado: es un centro para su arquero.','O segundo pau estava ocupado: é bola para o goleiro.','The far post was already covered: it is a cross for their keeper.'],
  mv:{EI:[36,92]},b:[[36,92]]},
 {id:'primerPalo',p:'llegada',r:'medio',pr:.07,g:/^E|LT/,vs:3,t:['Centro tenso al primer palo','Cruzamento tenso no primeiro pau','Driven cross to the near post'],
  si:['Su arquero sale a todo: el centro tenso y rasante le pasa por delante.','O goleiro sai em tudo: o cruzamento tenso passa à frente dele.','Their keeper comes for everything: the low driven ball goes across him.'],no:['Cierran el primer palo y el centro tenso pega en el primero que está ahí.','Fecham o primeiro pau: a bola bate no primeiro.','They have the near post covered and the driven ball hits the first man.'],
  mv:{DC:[58,92]},b:[[58,92]]},
 {id:'ocupar',p:'llegada',r:'bajo',pr:.06,g:/DC|MCO/,vs:2,t:['Ocupar primer palo, penal, segundo palo y frontal','Ocupar primeiro pau, pênalti, segundo pau e entrada','Fill near post, spot, far post and edge'],
  si:['Contra una zona, cuatro tuyos en los cuatro lugares: alguno queda en ventaja.','Contra zona, quatro seus nos quatro lugares.','Against a zone, four of yours in the four spaces: one will be in front.'],no:['Llenás el área de gente y nadie llega en movimiento.','Enche a área e ninguém chega em movimento.','You fill the box with bodies and nobody arrives on the move.'],
  mv:{DC:[56,92],EI:[40,92],IN1:[50,86],IN2:[60,78]},b:[[50,88]]},
 {id:'temprano',p:'profundidad',r:'medio',pr:.07,g:/LT|^E/,vs:2,t:['Centro temprano desde tres cuartos','Cruzamento antecipado da intermediária','Early cross from three-quarters'],
  si:['Su línea está alta y desacomodada: el centro antes de que corran hacia atrás encuentra el espacio.','A linha está alta e desarrumada: o cruzamento antes que voltem acha espaço.','Their line is high and disorganised: the ball in before they run back finds the space.'],no:['Ya están parados en el área: el centro de lejos es fácil para ellos.','Já estão parados na área: o cruzamento de longe é fácil.','They are already set in the box: the cross from deep is easy for them.'],
  mv:{DC:[50,90]},b:[[50,90]]},
 {id:'filtrado',p:'profundidad',r:'medio',pr:.07,g:/MCO|MC$/,vs:2,t:['Pase filtrado entre central y lateral','Passe enfiado entre zagueiro e lateral','Through ball between centre-back and full-back'],
  si:['Hay distancia entre su central y su lateral: el pase filtrado deja a uno solo frente al arquero.','Há distância entre zagueiro e lateral.','There is a gap between centre-back and full-back: the through ball puts one man in on goal.'],no:['No hay hueco: el pase choca con la línea.','Não há espaço: o passe bate na linha.','There is no gap: the pass hits the line.'],
  mv:{IN2:[66,92]},b:[[66,92]]},
 {id:'rupturaLejano',p:'ladoDebil',r:'medio',pr:.07,g:/^E/,vs:2,t:['Ruptura del extremo del lado contrario','Ruptura do ponta do lado oposto','Far-side winger runs in behind'],
  si:['Todo su bloque mira la pelota: el extremo del otro lado entra a la espalda sin que nadie lo vea.','Todo o bloco olha a bola: o ponta do outro lado entra nas costas.','Their whole block is ball-watching: the far winger runs in behind unseen.'],no:['Su lateral del otro lado no se metió: lo esperaba.','O lateral do outro lado ficou: esperava.','Their far full-back stayed wide: he was waiting.'],
  mv:{EI:[34,92]},b:[[34,92]]},
 {id:'pared',p:'tercero',r:'medio',pr:.07,g:/MCO|DC/,vs:2,t:['Pared en la frontal','Tabela na entrada da área','One-two on the edge of the box'],
  si:['Marcan hombre a hombre en la frontal: con una pared el que la da ya dejó atrás a su marca.','Marcam homem a homem: com uma tabela quem toca já passou a marca.','They mark man for man on the edge: with a one-two the passer has already lost his marker.'],no:['Hay gente de sobra en la frontal: la pared rebota en un tercero.','Há gente de sobra: a tabela bate num terceiro.','There are spare men on the edge: the return pass hits a third defender.'],
  mv:{IN1:[46,86],DC:[52,80]},b:[[52,80],[46,88]]},
 {id:'nueveDescarga',p:'fijar',r:'bajo',pr:.06,g:/DC/,vs:2,t:['9 de espaldas que descarga al que llega','9 de costas que descarrega para quem chega','Back-to-goal 9 lays it off to a runner'],
  si:['Su central se pega al 9: el 9 la aguanta y la descarga para el que llega de frente.','O zagueiro gruda no 9: ele segura e descarrega.','Their centre-back gets tight on the 9: he holds it and lays it off to the man arriving.'],no:['Nadie llega: tu 9 la aguanta y no tiene a quién darla.','Ninguém chega: o 9 segura e não tem para quem dar.','Nobody arrives: your 9 holds it with nobody to give it to.'],
  mv:{DC:[50,80],IN2:[58,74]},b:[[50,80],[58,76]]},
 {id:'mediaDistancia',p:'llegada',r:'medio',pr:.06,g:/MC|MCO/,vs:3,t:['Remate de media distancia','Chute de média distância','Shot from distance'],
  si:['Se metieron todos en el área: la frontal queda libre para rematar.','Todos entraram na área: a entrada fica livre.','They have all dropped into the box: the edge is free for a shot.'],no:['Hay gente en la frontal: el remate pega en el primero.','Há gente na entrada: o chute bate no primeiro.','There are bodies on the edge: the shot hits the first man.'],
  mv:{IN2:[58,76]},b:[[58,76],[52,99]]},
 {id:'recorte',p:'cualitativa',r:'medio',pr:.07,g:/^E/,vs:2,t:['Extremo a pierna cambiada: recorte hacia adentro y remate','Ponta de pé trocado: corte para dentro e chute','Inverted winger: cut inside and shoot'],
  si:['Su lateral no le cierra la pierna buena: un recorte y queda de frente al arco.','O lateral não fecha a perna boa: um corte e fica de frente.','Their full-back does not show him outside: one cut and he is facing goal.'],no:['Su lateral lo espera adentro: el recorte va a donde ya había dos.','O lateral espera dentro: o corte vai onde já havia dois.','Their full-back waits inside: the cut goes where there were already two.'],
  mv:{ED:[72,84]},b:[[72,84],[52,99]]},
 {id:'unoContraUno',p:'cualitativa',r:'medio',pr:.06,g:/^E/,vs:2,t:['Uno contra uno en la banda aislada','Um contra um na faixa isolada','One v one on an isolated flank'],
  si:['Le dejaste la banda vacía: tu extremo contra su lateral, sin ayudas.','Deixou a faixa vazia: seu ponta contra o lateral.','You emptied the flank: your winger against their full-back, no help.'],no:['Hay dos esperándolo: el uno contra uno es un dos contra uno para ellos.','Há dois esperando: vira dois contra um para eles.','Two are waiting for him: the one v one is a two v one for them.'],
  mv:{ED:[90,90]},b:[[90,90]]},
 {id:'segundaLinea',p:'llegada',r:'medio',pr:.07,g:/MC/,vs:2,t:['Llegada desde segunda línea','Chegada da segunda linha','Late run from midfield'],
  si:['Marcan a los que ya están adentro: el que llega de atrás no tiene a nadie.','Marcam quem já está dentro: quem chega de trás está livre.','They mark the men already inside: the one arriving late has nobody on him.'],no:['Defienden en zona: el que llega de atrás entra a un espacio que ya estaba ocupado.','Defendem em zona: quem chega entra em espaço ocupado.','They defend zonally: the late runner arrives into a space already filled.'],
  mv:{MC:[52,86]},b:[[52,88]]},
 {id:'dosPuntas',p:'fijar',r:'medio',pr:.07,g:/DC/,vs:2,t:['Dos puntas con movimientos opuestos','Dois atacantes com movimentos opostos','Two strikers making opposite runs'],
  si:['Sus centrales se cruzan detrás de cada uno: uno va al primer palo, el otro al segundo, y queda un hueco en el medio.','Os zagueiros se cruzam: um vai ao primeiro pau, o outro ao segundo.','Their centre-backs cross over chasing each one: one goes near, one goes far, and a hole opens in the middle.'],no:['Defienden su zona y no se mueven: los dos corren y nadie se lleva a nadie.','Defendem a zona: os dois correm e ninguém arrasta ninguém.','They hold their zones: both run and nobody drags anybody.'],
  mv:{DC:[58,90],IN1:[40,88]},b:[[46,90]]}
];
const CASOS_FINALIZACION=[
 [['Zona · por fuera · fondo','Zona · por fora · fundo','Zone · wide · byline'],['Llegaste al fondo y defienden mirando su arco.','Chegou ao fundo e defendem olhando o próprio gol.','You reached the byline and they defend facing their goal.'],'atrasFondo','ocupar','segundoPalo'],
 [['Zona · por fuera','Zona · por fora','Zone · wide'],['Vas a centrar desde la banda y cierran el primer palo.','Vai cruzar da faixa e fecham o primeiro pau.','You are crossing from wide and they close the near post.'],'segundoPalo','ocupar','primerPalo'],
 [['Zona · su arquero','Zona · o goleiro','Zone · their keeper'],['Su arquero sale a todos los centros.','O goleiro sai em todos os cruzamentos.','Their keeper comes for every cross.'],'primerPalo','atrasFondo','segundoPalo'],
 [['Línea alta · tres cuartos','Linha alta · intermediária','High line · three-quarters'],['Su línea está alta y desordenada.','A linha está alta e desarrumada.','Their line is high and disorganised.'],'temprano','filtrado','mediaDistancia'],
 [['Por dentro · espalda','Por dentro · costas','Central · in behind'],['Hay distancia entre su central y su lateral.','Há distância entre zagueiro e lateral.','There is a gap between their centre-back and full-back.'],'filtrado','rupturaLejano','segundoPalo'],
 [['Hombre · frontal','Homem · entrada da área','Man-marking · edge'],['Defienden la frontal hombre a hombre.','Defendem a entrada da área homem a homem.','They defend the edge of the box man for man.'],'pared','nueveDescarga','mediaDistancia'],
 [['Bloque metido','Bloco recuado','Deep block'],['Se meten todos en el área y dejan la frontal libre.','Entram todos na área e deixam a entrada livre.','They all drop into the box and leave the edge free.'],'mediaDistancia','ocupar','pared'],
 [['Duelo · banda','Duelo · faixa','Duel · flank'],['Tu extremo a pierna cambiada contra un lateral que no le cierra adentro.','Seu ponta de pé trocado contra um lateral que não fecha dentro.','Your inverted winger against a full-back who does not show him outside.'],'recorte','unoContraUno','segundoPalo'],
 [['Todos a la pelota','Todos na bola','Everyone ball-watching'],['Todo su bloque mira la pelota del otro lado.','Todo o bloco olha a bola do outro lado.','Their whole block is watching the ball on the other side.'],'rupturaLejano','segundoPalo','mediaDistancia'],
 [['Hombre · área','Homem · área','Man-marking · box'],['Marcan a los que ya están en el área.','Marcam quem já está na área.','They mark the players already in the box.'],'segundaLinea','dosPuntas','segundoPalo'],
 [['Hombre · centrales','Homem · zagueiros','Man-marking · centre-backs'],['Sus centrales siguen cada uno a su punta, aunque se crucen.','Os zagueiros seguem cada um o seu atacante.','Each centre-back follows his striker, even when they cross.'],'dosPuntas','segundaLinea','primerPalo'],
 [['Zona · llegadores','Zona · chegadores','Zone · arrivals'],['Defienden en zona y vos llegás con cuatro.','Defendem em zona e você chega com quatro.','They defend zonally and you arrive with four.'],'ocupar','atrasFondo','mediaDistancia']
];

function lineasFormacion(f){return String(f||'4-4-2').split('/')[0].trim().split('-').map(Number);}
function arquetipoProgresion(c,clave){
 const elF=String(c.el.f||'4-4-2'),fe=lineasFormacion(elF),fy=lineasFormacion(c.yo.f),h=hashS(clave+'|prog');
 const medios=fe.slice(1,-1).reduce((a,b)=>a+b,0),misMedios=fy.slice(1,-1).reduce((a,b)=>a+b,0);
 const bajo=c.el.m.def==='bajo',hombre=c.el.m.tdef==='presion',linea5=fe[0]===5||fe[0]===3,extremos=/^(4-3-3|3-4-3|4-2-3-1)$/.test(elF);
 const cierra=medios<=3||(medios===4&&h%3===0)?'centro':'bandas';
 let caso;
 if(bajo&&medios>=5)caso=13;
 else if(linea5&&h%3===0)caso=12;
 else if(medios<=3&&misMedios>=4&&h%4===1)caso=11;
 else if(hombre&&extremos&&h%4===0)caso=10;
 else if(cierra==='centro')caso=bajo?4:hombre?[1,2][(h>>>3)%2]:[0,1,3][(h>>>3)%3];
 else caso=bajo?8:hombre?[7,6][(h>>>3)%2]:[5,6,9][(h>>>3)%3];
 return {fam:'prog',caso,cierra,bajo,hombre,medios,linea5};
}
function arquetipoFinalizacion(c,clave){
 const h=hashS(clave+'|fin'),hz=hashS(((c.el.club&&c.el.club.n)||'')+'|zona');
 const zona=c.el.m.def==='bajo'||hz%3!==0,fuera=c.yo.m.ofe==='directo'?h%4!==0:h%3===0,alta=c.el.m.def==='alto';
 const pick=(a,k)=>a[(h>>>k)%a.length];
 let caso;
 if(alta&&!fuera&&h%3===1)caso=3;
 else if(zona)caso=fuera?pick([0,1,2,11],3):c.el.m.def==='bajo'?pick([6,6,4,8],3):pick([4,8,6],3);
 else caso=fuera?pick([7,9],3):pick([5,10,9],3);
 return {fam:'fin',caso,zona,fuera,alta};
}
function nombreArquetipoAtaque(A){const L=A.fam==='prog'?CASOS_PROGRESION:CASOS_FINALIZACION,k=L[A.caso];return t3(...k[0])+' — '+t3(...k[1]).replace(/\.$/,'');}
function fichasProgresion(){
 const roles=[['POR',50,5,'1'],['CI',38,26,'2'],['CD',62,26,'6'],['LI',12,42,'3'],['LD',88,46,'4'],['MC',50,38,'5'],['IN1',38,52,'8'],['IN2',62,52,'10'],['EI',10,62,'11'],['ED',90,62,'7'],['DC',50,76,'9']];
 return {roles,mi:roles.map(r=>[r[1],r[2],r[3]]),pel:[62,26]};
}
function rivalProgresion(A){
 const mid=A.cierra==='centro'?[[42,60],[50,58],[58,60]]:A.medios>=5?[[20,60],[35,62],[50,58],[65,62],[80,60]]:[[22,60],[42,60],[58,60],[78,60]];
 const def=A.linea5?[[16,76],[34,78],[50,80],[66,78],[84,76]]:[[24,78],[42,80],[58,80],[76,78]];
 const y=A.bajo?8:0;return mid.concat(def).map(p=>[p[0],Math.min(94,p[1]+y)]).concat([[50,96]]);
}
function fichasFinalizacion(A){
 const roles=[['CI',38,40,'2'],['CD',62,40,'6'],['LI',16,62,'3'],['LD',82,66,'4'],['MC',50,60,'5'],['IN1',40,68,'8'],['IN2',60,68,'10'],['EI',16,80,'11'],['ED',86,80,'7'],['DC',50,82,'9']];
 const el=A.zona?[[32,89],[44,90],[56,90],[68,89],[50,93],[42,76],[58,76],[50,98]]:[[48,86],[54,80],[36,86],[66,86],[84,82],[60,74],[42,74],[50,98]];
 return {roles,mi:roles.map(r=>[r[1],r[2],r[3]]),el,pel:A.fuera?[86,80]:[60,68]};
}
function generarAtaque(c,clave,fam){
 const prog=fam==='prog',A=prog?arquetipoProgresion(c,clave):arquetipoFinalizacion(c,clave),CAT=prog?SOLUCIONES_PROGRESION:SOLUCIONES_FINALIZACION;
 const caso=(prog?CASOS_PROGRESION:CASOS_FINALIZACION)[A.caso],F=prog?fichasProgresion():fichasFinalizacion(A),el=prog?rivalProgresion(A):F.el;
 const idx={};F.roles.forEach((r,i)=>idx[r[0]]=i);
 const conv=mv=>{const o={};Object.entries(mv||{}).forEach(([k,v])=>{if(idx[k]!=null)o[idx[k]]=v;});return o;};
 const fitDe=id=>id===caso[2]?.95:id===caso[3]?.6:id===caso[4]?.2:.35,por=id=>CAT.find(s=>s.id===id);
 const sel=[caso[2],caso[3],caso[4]],h=hashS(clave+'|ga'+fam);
 // a veces aparece una cuarta orden: la conservadora (pausa / ocupar el área) o una cualquiera que no encaja
 if(h%3===0){const seg=CAT.filter(s=>!sel.includes(s.id)&&s.r==='bajo'),resto=CAT.filter(s=>!sel.includes(s.id)),extra=seg.length?seg[(h>>>4)%seg.length]:resto[(h>>>4)%resto.length];sel.push(extra.id);}
 const ops=sel.map((id,i)=>[hashS(clave+'|ao'+i),id]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).map(id=>{const s=por(id),f=fitDe(id);
  return {sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:conv(s.mv),b:[F.pel].concat(s.b),riesgo:s.r,premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f};});
 const buena=por(caso[2]);
 const rel=()=>t3(...caso[1])+' '+(prog?(A.bajo?t3('Se metieron atrás.','Recuaram.','They have dropped deep.'):'')
  :(A.zona?t3('En el área defienden en zona.','Na área defendem em zona.','In the box they defend zonally.'):t3('En el área marcan al hombre.','Na área marcam homem a homem.','In the box they mark man for man.')));
 const pista=prog?['¿Qué te cierran primero: el centro o las bandas? La ventaja está en lo que dejan abierto.','O que fecham primeiro: o centro ou as faixas? A vantagem está no que deixam aberto.','What do they close first: the middle or the flanks? The advantage is in what they leave open.']
  :['¿Zona u hombre en el área? Contra zona, buscá dónde no hay nadie; contra el hombre, el movimiento que arrastra.','Zona ou homem na área? Contra zona, busque onde não há ninguém; contra homem, o movimento que arrasta.','Zone or man in the box? Against a zone, find where nobody is; against man-marking, the run that drags.'];
 return {id:prog?'gen-progresion':'gen-finalizacion',gen:true,A,nombreA:nombreArquetipoAtaque(A),p:buena.p,cuando:()=>true,rel:rel,pista,mi:F.mi,el,pel:F.pel,ops};
}
const generarProgresion=(c,clave)=>generarAtaque(c,clave,'prog');
const generarFinalizacion=(c,clave)=>generarAtaque(c,clave,'fin');
const _elegirSituacionV21=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 // uno de cada cuatro problemas llega cuando atacás (nunca dos seguidos)
 if(!/^gen-(progresion|finalizacion)$/.test(S.ultimaSituacion||'')&&hashS(clave+'|gat')%4===0)
  return hashS(clave+'|gaf')%2?generarProgresion(c,clave):generarFinalizacion(c,clave);
 return _elegirSituacionV21(c,clave);
};
nombreArquetipo=(function(prev){return function(A){return A&&(A.fam==='prog'||A.fam==='fin')&&A.caso!=null?nombreArquetipoAtaque(A):prev(A);};})(nombreArquetipo);
