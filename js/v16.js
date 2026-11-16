// v16 — "El partido te hace una pregunta".
// Diagnóstico: en una temporada se dirigía un solo partido; el resto era mirar un ticker.
// La teoría estaba en pantallas de configuración, no en el juego.
// Ahora, cada tantas fechas, el partido se detiene en UN problema táctico dibujado en la cancha.
// Tres órdenes posibles. La devolución separa dos cosas que el fútbol siempre mezcla:
//   LECTURA  (¿era la idea correcta para ese problema?)  y  EJECUCIÓN (¿tus jugadores pudieron?).
// Cada problema enseña un principio. Tres lecturas buenas y el equipo lo resuelve solo: se vuelve automatismo
// y deja lugar a problemas nuevos. Aprender teoría es lo que hace avanzar el juego.
// No consume S.rng: las pruebas de regresión y los resultados ya simulados no cambian.

const PRINCIPIOS={
 supnum:{n:['Superioridad numérica en la salida','Superioridade numérica na saída','Numerical superiority in the build-up'],d:['Para salir jugando hace falta uno más que los que presionan. Si ellos vienen con dos, salís con tres.','Para sair jogando é preciso um a mais do que os que pressionam.','To play out you need one more than the pressers. If they come with two, you build with three.']},
 amplitud:{n:['Amplitud contra bloque bajo','Amplitude contra bloco baixo','Width against a low block'],d:['Un equipo cerrado por dentro se abre moviéndolo de lado a lado: la pelota viaja más rápido que la basculación.','Um time fechado por dentro se abre movendo-o de um lado ao outro.','A team packed inside is opened by moving it side to side: the ball travels faster than the shift.']},
 profundidad:{n:['Atacar la espalda de una línea alta','Atacar as costas da linha alta','Attack the space behind a high line'],d:['Cuanto más arriba defienden, más metros regalan atrás. Se castiga con una ruptura, no con un pase al pie.','Quanto mais alto defendem, mais metros dão atrás.','The higher they defend, the more space they leave behind. Punish it with a run, not a pass to feet.']},
 dosuno:{n:['No quedar 2 contra 1 en la banda','Não ficar 2 contra 1 na faixa','Never 2 v 1 on the flank'],d:['El lateral solo contra dos pierde siempre. El primero que tiene que ayudar es el extremo de ese lado.','O lateral sozinho contra dois perde sempre. Quem ajuda primeiro é o ponta.','A full-back alone against two always loses. The first helper is the winger on that side.']},
 entrelineas:{n:['Cerrar el espacio entre líneas','Fechar o espaço entre linhas','Close the space between the lines'],d:['El 10 rival vive entre tus volantes y tus defensores. Se le quita el aire achicando el equipo, no persiguiéndolo.','O 10 rival vive entre seus volantes e zagueiros. Tira-se o ar compactando.','Their 10 lives between your midfield and defence. Take the air away by squeezing up, not by chasing him.']},
 vigilancias:{n:['Vigilancias: defender mientras atacás','Vigilâncias: defender enquanto ataca','Rest defence: defend while you attack'],d:['La contra se defiende antes de perder la pelota: los que no atacan ya están marcando.','O contra-ataque se defende antes de perder a bola.','A counter is defended before you lose the ball: those not attacking are already marking.']},
 segunda:{n:['La segunda pelota','A segunda bola','The second ball'],d:['Contra el pelotazo no alcanza con ganar arriba: el partido se juega en dónde cae.','Contra a bola longa não basta ganhar no alto: o jogo é onde ela cai.','Against the long ball, winning the header is not enough: the game is where it drops.']},
 medio:{n:['Sumar un hombre por dentro','Somar um homem por dentro','Add a man inside'],d:['Si en el medio son más, la pelota es de ellos. El hombre extra sale de afuera hacia adentro.','Se no meio são mais, a bola é deles. O homem extra vem de fora para dentro.','If they outnumber you in midfield, the ball is theirs. The extra man comes from outside in.']},
 cualitativa:{n:['Aislar al que gana el mano a mano','Isolar quem ganha o um contra um','Isolate your one-v-one winner'],d:['Tu mejor gambeteador necesita espacio, no la pelota todo el tiempo: se juega del otro lado para que reciba solo.','Seu melhor driblador precisa de espaço, não da bola o tempo todo.','Your best dribbler needs space, not the ball all the time: play on the other side so he receives alone.']},
 gestion:{n:['Defender el resultado con lo que sabés hacer','Defender o resultado com o que sabe fazer','Protect the lead with what you do well'],d:['Un equipo de pelota cuida la ventaja teniéndola; uno de contra, esperando. Cambiar de libreto a los 75 es lo que se paga.','Um time de posse protege a vantagem com a bola; um de contra-ataque, esperando.','A possession side protects a lead with the ball; a counter side, by waiting. Switching scripts at 75 is what costs you.']},
 fijar:{n:['Fijar para liberar','Fixar para liberar','Pin to free'],d:['Contra línea de cinco, los extremos abiertos atan a los carrileros y el hueco aparece entre central y carrilero.','Contra linha de cinco, os pontas abertos prendem os alas.','Against a back five, wide wingers pin the wing-backs and the gap opens between centre-back and wing-back.']},
 gatillo:{n:['Presionar con gatillo','Pressionar com gatilho','Press on a trigger'],d:['No se presiona todo: se elige a quién dejar recibir y ahí salta el equipo entero. La raya es un defensor más.','Não se pressiona tudo: escolhe-se quem recebe e aí o time salta.','You do not press everything: you choose who receives, then the whole team jumps. The touchline is an extra defender.']}
};
let N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;const DOMINIO=3;

// g: quién lo ejecuta (grupo o roles) · vs: atributo rival [0 ataque,1 creación,2 defensa,3 presión]
// mi/el: fichas [x,y,(sigla)] con y=0 en tu arco · mv: movimientos de tus fichas · b: camino de la pelota
const SITUACIONES=[
{id:'salida',p:'supnum',cuando:c=>c.el.m.def==='alto',
 rel:['Nos saltan a presionar con dos puntas contra nuestros dos centrales. Dos contra dos: así no salimos.','Pressionam com dois atacantes contra nossos dois zagueiros.','They press with two strikers on our two centre-backs. Two v two: we cannot get out.'],
 pista:['Contá cuántos son ellos y cuántos nosotros en la primera línea.','Conte quantos são eles e quantos nós na primeira linha.','Count them and count us on the first line.'],
 mi:[[50,5,'1'],[38,18,'2'],[62,18,'6'],[50,33,'5'],[12,30,'3'],[88,30,'4'],[42,50,'8']],el:[[40,25],[60,25],[50,44],[18,42],[82,42]],pel:[50,5],
 ops:[{t:['¡El 5, entre los centrales!','O 5 entre os zagueiros!','The 5 drops between the centre-backs!'],L:1,g:/MCD|MC$/,vs:3,pq:['Tres contra dos: siempre queda uno libre para salir.','Três contra dois: sempre sobra um.','Three v two: one is always free.'],mv:{3:[50,13],1:[24,21],2:[76,21]},b:[[50,13],[24,21],[30,44]]},
  {t:['Pelotazo al 9 y a pelear la segunda','Bola longa no 9','Go long to the 9'],L:.5,g:/DC|SD/,vs:2,pq:['Saltás la presión, pero si tu 9 no gana arriba le devolvés la pelota.','Pula a pressão, mas se o 9 não ganhar, devolve a bola.','You skip the press, but if your 9 loses the duel you hand the ball back.'],mv:{6:[46,58]},b:[[52,72]]},
  {t:['Con calma: que salgan jugando igual','Com calma: saiam jogando','Stay calm: play out anyway'],L:0,g:/DFC/,vs:3,pq:['Dos contra dos al lado de tu arco es una moneda al aire.','Dois contra dois ao lado do seu gol é cara ou coroa.','Two v two next to your own goal is a coin toss.'],mv:{},b:[[38,18],[62,18]]}]},
{id:'bajo',p:'amplitud',cuando:c=>c.el.m.def==='bajo',
 rel:['Se metieron los once atrás, bien cerrados por adentro. Tocamos y tocamos y no pasa nada.','Os onze atrás, fechados por dentro.','All eleven sit deep and narrow. We pass and pass and nothing happens.'],
 pista:['¿Dónde hay pasto libre?','Onde há grama livre?','Where is the free grass?'],
 mi:[[50,40,'5'],[34,52,'8'],[66,52,'10'],[8,66,'11'],[92,66,'7'],[50,76,'9'],[20,48,'3']],el:[[30,72],[44,74],[56,74],[70,72],[36,62],[50,63],[64,62]],pel:[34,52],
 ops:[{t:['Abrir la cancha y cambiar de frente rápido','Abrir o campo e inverter rápido','Stretch the pitch and switch quickly'],L:1,g:/^E|LT/,vs:2,pq:['La pelota llega al otro lado antes que su basculación: ahí hay un uno contra uno.','A bola chega ao outro lado antes da basculação.','The ball gets across before they shift: there is a one-v-one there.'],mv:{4:[94,74]},b:[[50,40],[92,66],[94,82]]},
  {t:['Centros desde tres cuartos al 9','Cruzamentos para o 9','Early crosses to the 9'],L:.5,g:/DC|SD/,vs:2,pq:['Es una vía, pero sus centrales están de frente y esperando.','É um caminho, mas os zagueiros estão de frente.','It is a route, but their centre-backs are facing the ball and waiting.'],mv:{},b:[[20,48],[50,80]]},
  {t:['Filtrar pases por adentro','Infiltrar por dentro','Thread passes through the middle'],L:0,g:/MCO|MC$/,vs:2,pq:['Por adentro hay ocho piernas en diez metros.','Por dentro há oito pernas em dez metros.','Inside there are eight legs in ten yards.'],mv:{},b:[[50,63]]}]},
{id:'alta',p:'profundidad',cuando:c=>c.el.m.def==='alto',
 rel:['Defienden casi en la mitad de la cancha. Tienen cuarenta metros a la espalda.','Defendem quase no meio-campo. Quarenta metros nas costas.','They defend almost on halfway. Forty yards behind them.'],
 pista:['Mirá el espacio, no a los jugadores.','Olhe o espaço, não os jogadores.','Look at the space, not the players.'],
 mi:[[50,30,'5'],[38,44,'8'],[62,44,'10'],[14,54,'11'],[86,54,'7'],[50,56,'9']],el:[[28,58],[44,60],[56,60],[72,58],[50,48],[50,94]],pel:[38,44],
 ops:[{t:['Pase al espacio para el que pica','Passe no espaço para quem arranca','Ball into space for the runner'],L:1,g:/^E|DC|SD/,vs:2,pq:['Corre de frente contra defensores que giran: llega primero.','Corre de frente contra zagueiros que giram.','He runs facing goal against defenders who must turn: he gets there first.'],mv:{4:[78,84]},b:[[76,82]]},
  {t:['Tocar corto para atraerlos todavía más','Tocar curto para atrair mais','Short passes to draw them further'],L:.5,g:/MC/,vs:3,pq:['Sirve si después alguien pica; si no, es jugar en su trampa.','Serve se depois alguém arrancar.','Fine if someone then runs; otherwise you are playing in their trap.'],mv:{},b:[[50,30],[62,44]]},
  {t:['Que el 9 baje a recibir de espaldas','Que o 9 recue para receber','The 9 drops to receive back to goal'],L:0,g:/DC|SD/,vs:2,pq:['Nadie amenaza la espalda: su línea puede subir tranquila.','Ninguém ameaça as costas.','Nobody threatens the space behind: their line pushes up in comfort.'],mv:{5:[50,46]},b:[[50,46]]}]},
{id:'banda',p:'dosuno',cuando:c=>c.el.m.ofe==='posicional',
 rel:['Su lateral y su extremo le hacen dos contra uno a nuestro lateral. Una y otra vez por ahí.','O lateral e o ponta deles fazem dois contra um.','Their full-back and winger double up on our full-back. Again and again down that side.'],
 pista:['¿Quién es el jugador nuestro más cercano a ese problema?','Quem é o nosso mais próximo?','Which of ours is closest to the problem?'],
 mi:[[86,26,'4'],[62,18,'6'],[38,18,'2'],[60,36,'8'],[84,52,'7'],[50,30,'5']],el:[[90,40],[78,48],[60,50],[50,60]],pel:[78,48],
 ops:[{t:['Que el extremo baje con su lateral','Que o ponta volte com o lateral','The winger tracks their full-back'],L:1,g:/^E|^M[DI]/,vs:0,pq:['Dos contra dos. El primer defensor de la banda es tu extremo.','Dois contra dois. O primeiro defensor é o seu ponta.','Two v two. The first defender on the flank is your winger.'],mv:{4:[88,36]},b:[[90,40],[84,30]]},
  {t:['Bascular todo el equipo hacia ese lado','Bascular o time todo','Shift the whole team across'],L:.5,g:/MC/,vs:1,pq:['Tapás ese lado y dejás el otro: un cambio de frente te mata.','Fecha esse lado e abre o outro.','You plug that side and open the other: a switch kills you.'],mv:{3:[72,34],5:[62,28],2:[50,18]},b:[[60,50],[14,52]]},
  {t:['El lateral aguanta solo: no nos desordenemos','O lateral aguenta sozinho','The full-back copes alone: keep our shape'],L:0,g:/LT/,vs:0,pq:['Uno contra dos pierde siempre. El orden que cuidaste se rompe igual.','Um contra dois perde sempre.','One v two always loses. The shape you protected breaks anyway.'],mv:{},b:[[90,40],[92,20]]}]},
{id:'diez',p:'entrelineas',cuando:c=>c.el.m.ofe==='posicional',
 rel:['Su 10 recibe solo a la espalda de nuestros volantes, gira y encara a los centrales.','O 10 deles recebe sozinho nas costas dos volantes.','Their 10 receives alone behind our midfield, turns and runs at the centre-backs.'],
 pista:['El problema no es él: es el lugar donde recibe.','O problema não é ele: é onde recebe.','The problem is not him: it is where he receives.'],
 mi:[[38,16,'2'],[62,16,'6'],[14,22,'3'],[86,22,'4'],[40,44,'8'],[60,44,'5']],el:[[50,30],[50,56],[30,52],[70,52]],pel:[50,56],
 ops:[{t:['Achicar: la defensa diez metros adelante y el 5 fijo ahí','Compactar: defesa dez metros à frente','Squeeze up ten yards, the 5 holds that zone'],L:1,g:/MCD|DFC/,vs:1,pq:['Sin espacio entre líneas no hay dónde recibir.','Sem espaço entre linhas não há onde receber.','No space between the lines, nowhere to receive.'],mv:{0:[38,26],1:[62,26],2:[14,30],3:[86,30],5:[52,36]},b:[[50,30],[52,36]]},
  {t:['Marca personal: el 5 lo sigue por toda la cancha','Marcação individual do 5','Man-mark him with the 5 all over'],L:.5,g:/MCD|MC$/,vs:1,pq:['Lo anulás, pero tu 5 deja su zona y por ahí entra otro.','Anula-o, mas o 5 deixa sua zona.','You cancel him, but your 5 leaves his zone and someone else walks in.'],mv:{5:[50,33]},b:[[70,52],[60,40]]},
  {t:['Todos atrás, cerca del área','Todos atrás','Everyone back to the box'],L:0,g:/DFC/,vs:0,pq:['Él sigue recibiendo, y ahora más cerca de tu arco.','Ele continua recebendo, agora mais perto do gol.','He still receives, now closer to your goal.'],mv:{4:[40,32],5:[60,32]},b:[[50,30],[50,14]]}]},
{id:'contra',p:'vigilancias',cuando:c=>c.el.m.tofe==='contra',
 rel:['Cada pelota que perdemos arriba, nos salen tres corriendo y llegan a nuestro arco.','A cada bola perdida, saem três correndo.','Every ball we lose up there, three of them break and reach our goal.'],
 pista:['¿Quién está defendiendo mientras atacamos?','Quem defende enquanto atacamos?','Who is defending while we attack?'],
 mi:[[40,52,'2'],[60,52,'6'],[50,62,'5'],[14,76,'3'],[86,76,'4'],[50,84,'9']],el:[[50,56],[30,66],[70,66]],pel:[50,84],
 ops:[{t:['Dos centrales y el 5 vigilan: no suben todos','Dois zagueiros e o 5 vigiam','Two centre-backs and the 5 stay as cover'],L:1,g:/DFC|MCD/,vs:0,pq:['Tres vigilando a sus tres: la contra muere antes de nacer.','Três vigiando os três deles.','Three watching their three: the counter dies before it starts.'],mv:{0:[36,48],1:[64,48],2:[50,50]},b:[[50,62],[50,50]]},
  {t:['Falta táctica apenas la perdemos','Falta tática ao perder','Tactical foul the moment we lose it'],L:.5,g:/MC/,vs:0,pq:['Corta la contra, pero te llena de amarillas.','Corta o contra-ataque, mas enche de amarelos.','It stops the break, and fills your team with yellow cards.'],mv:{2:[50,68]},b:[[50,70]]},
  {t:['Seguimos igual: que vuelvan más rápido','Seguimos igual: voltem mais rápido','Carry on: just get back faster'],L:0,g:/LT/,vs:0,pq:['Nadie corre hacia atrás más rápido que una pelota hacia adelante.','Ninguém corre para trás mais rápido que a bola.','Nobody runs backwards faster than a ball travels forwards.'],mv:{},b:[[50,56],[50,20]]}]},
{id:'pelotazo',p:'segunda',cuando:c=>c.el.m.ofe==='directo',
 rel:['Tiran todo largo a su 9. La baja de pecho y llegan sus volantes de frente.','Bola longa no 9 deles. Ele ajeita e chegam os volantes.','Everything goes long to their 9. He chests it down and their midfielders arrive facing goal.'],
 pista:['¿Dónde cae la pelota después del salto?','Onde cai a bola depois do salto?','Where does the ball land after the jump?'],
 mi:[[40,20,'2'],[60,20,'6'],[50,36,'5'],[36,48,'8'],[64,48,'10']],el:[[50,28],[40,42],[60,42],[50,70]],pel:[50,70],
 ops:[{t:['Un central anticipa y el 5 se para donde cae','Um zagueiro antecipa e o 5 fica na sobra','One centre-back attacks it, the 5 sits where it drops'],L:1,g:/DFC|MCD/,vs:0,pq:['El duelo es mitad del problema. La otra mitad es la caída, y ahí ya estás.','O duelo é metade do problema; a outra é a sobra.','The duel is half the problem. The other half is the drop, and you are already there.'],mv:{0:[48,27],2:[50,32]},b:[[50,30],[50,32]]},
  {t:['Presionar al que tira el pelotazo','Pressionar quem lança','Press the player hitting it long'],L:.5,g:/DC|SD|^E/,vs:1,pq:['Si llegás, sale un pase peor. Si no llegás, quedaste largo.','Se chegar, sai um passe pior.','Get there and the pass is worse. Miss, and you are stretched.'],mv:{4:[56,64]},b:[[50,30],[44,36]]},
  {t:['Línea más atrás, que no nos gane la espalda','Linha mais atrás','Drop the line so he cannot get behind'],L:0,g:/DFC/,vs:0,pq:['Le regalás metros para bajarla cómodo y más cerca de tu área.','Dá metros para ele dominar à vontade.','You give him room to bring it down, closer to your box.'],mv:{0:[40,12],1:[60,12]},b:[[50,24],[60,38]]}]},
{id:'medio',p:'medio',cuando:c=>c.el.attrs[1]>=c.yo.attrs[1],
 rel:['En el medio son tres contra nuestros dos. No la vemos.','No meio são três contra dois. Não vemos a bola.','In midfield it is three against our two. We cannot get a touch.'],
 pista:['El hombre que falta tiene que salir de algún lado.','O homem que falta tem de sair de algum lugar.','The missing man has to come from somewhere.'],
 mi:[[42,42,'8'],[58,42,'5'],[10,60,'11'],[90,60,'7'],[50,74,'9']],el:[[40,50],[60,50],[50,58],[14,48],[86,48]],pel:[50,58],
 ops:[{t:['Un extremo se mete adentro','Um ponta vem por dentro','A winger tucks inside'],L:1,g:/^E|^M[DI]/,vs:1,pq:['Tres contra tres en el medio, y el lateral rival no sabe si seguirlo.','Três contra três no meio.','Three v three inside, and their full-back does not know whether to follow.'],mv:{2:[36,56]},b:[[42,42],[36,56]]},
  {t:['El 9 baja a ser un volante más','O 9 recua como meia','The 9 drops in as an extra midfielder'],L:.5,g:/DC|SD/,vs:2,pq:['Ganás el medio y te quedás sin nadie que amenace el área.','Ganha o meio e fica sem ninguém na área.','You win midfield and lose the threat in the box.'],mv:{4:[50,62]},b:[[50,62],[42,42]]},
  {t:['Que los dos volantes corran más','Que os dois volantes corram mais','The two midfielders just run more'],L:0,g:/MC/,vs:1,pq:['Correr no arregla una cuenta: tres pasan a dos.','Correr não resolve a conta.','Running does not fix arithmetic: three pass around two.'],mv:{},b:[[40,50],[60,50]]}]},
{id:'mano',p:'cualitativa',cuando:c=>c.crack&&c.crack.rt>=c.el.attrs[2]+3,
 rel:c=>t3(`${apellido(c.crack.nom)} le gana siempre a su lateral. Pero cada vez que la toca le llegan dos.`,`${apellido(c.crack.nom)} ganha sempre do lateral. Mas chegam dois nele.`,`${apellido(c.crack.nom)} beats his full-back every time. But two close on him whenever he touches it.`),
 pista:['No es darle más la pelota: es darle espacio.','Não é dar mais a bola: é dar espaço.','It is not about more of the ball: it is about more space.'],
 mi:[[50,40,'5'],[30,52,'8'],[14,66,'11'],[88,66,'7'],[50,76,'9'],[24,44,'3']],el:[[80,66],[72,58],[56,72],[44,72],[26,66]],pel:[30,52],
 ops:[{t:['Juntar pases del otro lado y cambiarle de frente','Juntar passes do outro lado e inverter','Overload the far side, then switch to him'],L:1,g:/^E/,vs:2,pq:['Su ayuda se fue al otro lado: recibe solo contra uno.','A cobertura foi para o outro lado: recebe sozinho.','Their cover has gone across: he receives alone against one.'],mv:{1:[26,58],5:[18,54]},b:[[14,66],[30,52],[88,66]]},
  {t:['Dársela siempre a él','Dar sempre para ele','Give it to him every time'],L:.5,g:/^E/,vs:2,pq:['Previsible: ya saben dónde va la pelota y lo esperan dos.','Previsível: já sabem para onde vai a bola.','Predictable: they know where the ball is going and two are waiting.'],mv:{},b:[[50,40],[88,66]]},
  {t:['Que se cierre a jugar por dentro','Que jogue por dentro','Bring him inside'],L:0,g:/^E/,vs:2,pq:['Le sacás la raya, que es donde gana.','Tira a linha, onde ele ganha.','You take away the touchline, which is where he wins.'],mv:{3:[66,62]},b:[[66,62]]}]},
{id:'ventaja',p:'gestion',cuando:()=>true,
 rel:['Vamos uno a cero y faltan quince. Ellos empujan con todo.','Um a zero e faltam quinze. Eles pressionam.','One-nil up, fifteen to go. They are throwing everything at us.'],
 pista:['¿Qué sabe hacer bien tu equipo?','O que seu time sabe fazer bem?','What does your team do well?'],
 mi:[[38,22,'2'],[62,22,'6'],[50,34,'5'],[36,46,'8'],[64,46,'10'],[50,62,'9']],el:[[30,50],[50,54],[70,50],[42,38],[58,38]],pel:[50,34],
 ops:c=>{const pos=c.yo.m.ofe==='posicional';return [
  {t:['Tener la pelota lejos de nuestro arco','Ter a bola longe do nosso gol','Keep the ball far from our goal'],L:pos?1:.5,g:/MC/,vs:3,pq:pos?['Es lo que entrenás todas las semanas: sin la pelota no te pueden empatar.','É o que você treina toda semana.','It is what you train every week: without the ball they cannot equalise.']:['Buena idea para otro equipo: el tuyo no está armado para esconderla.','Boa ideia para outro time.','Good idea for another side: yours is not built to hide the ball.'],mv:{3:[30,54],4:[70,54]},b:[[36,46],[64,46],[50,62]]},
  {t:['Bloque bajo y salir de contra','Bloco baixo e contra-ataque','Low block and break'],L:pos?.5:1,g:/DFC|MCD/,vs:0,pq:pos?['Aguantás, pero tu equipo no sabe sufrir sin la pelota.','Aguenta, mas seu time não sabe sofrer sem a bola.','You hold on, but your team does not know how to suffer without the ball.']:['Es tu partido: ellos se abren y vos tenés el espacio.','É o seu jogo: eles se abrem e você tem o espaço.','This is your game: they open up and you have the space.'],mv:{3:[38,34],4:[62,34],2:[50,26]},b:[[50,26],[50,62]]},
  {t:['Ir a buscar el segundo con todo','Ir buscar o segundo com tudo','Go all out for the second'],L:0,g:/DC|SD/,vs:2,pq:['Con ventaja y sin piernas, abrir el partido es regalarles lo que necesitan.','Com vantagem e sem pernas, abrir o jogo é dar o que eles precisam.','Ahead and tired, opening the game hands them exactly what they need.'],mv:{0:[38,40],1:[62,40]},b:[[50,62],[50,20]]}];}},
{id:'cinco',p:'fijar',cuando:c=>/^[35]/.test(c.el.f||''),
 rel:['Juegan con tres centrales y dos carrileros que suben y bajan toda la banda.','Jogam com três zagueiros e dois alas.','They play three centre-backs and two wing-backs who run the whole flank.'],
 pista:['Si el carrilero mira a tu extremo, ¿quién mira lo que queda al lado?','Se o ala olha seu ponta, quem olha o lado?','If the wing-back watches your winger, who watches the space beside him?'],
 mi:[[50,44,'5'],[36,56,'8'],[64,56,'10'],[6,70,'11'],[94,70,'7'],[50,76,'9']],el:[[34,76],[50,78],[66,76],[12,68],[88,68]],pel:[50,44],
 ops:[{t:['Extremos bien abiertos y el interior ataca el hueco','Pontas bem abertos e o meia ataca o espaço','Wingers stay wide, the inside midfielder attacks the gap'],L:1,g:/MC|MCO/,vs:2,pq:['El carrilero queda atado afuera: entre él y el central hay una puerta.','O ala fica preso por fora: há uma porta.','The wing-back is pinned wide: there is a door between him and the centre-back.'],mv:{2:[78,80]},b:[[64,56],[78,80]]},
  {t:['Centros al área','Cruzamentos na área','Crosses into the box'],L:.5,g:/DC|SD/,vs:2,pq:['Tres centrales es justo lo que arman para defender centros.','Três zagueiros é o que montam para defender cruzamentos.','Three centre-backs is exactly what you build to defend crosses.'],mv:{},b:[[94,70],[50,82]]},
  {t:['Dos puntas contra los tres centrales','Dois atacantes contra os três zagueiros','Two strikers on the three centre-backs'],L:0,g:/DC|SD/,vs:2,pq:['Tres contra dos: jugás donde ellos tienen la ventaja.','Três contra dois: joga onde eles têm vantagem.','Three v two: you are playing where they have the advantage.'],mv:{2:[58,74]},b:[[50,78]]}]},
{id:'presion',p:'gatillo',cuando:c=>c.yo.m.def==='alto',
 rel:['Vamos a apretar arriba y nos la tocan fácil. Llegamos siempre medio segundo tarde.','Pressionamos alto e tocam fácil. Chegamos sempre atrasados.','We go to press high and they pass around us. Always half a second late.'],
 pista:['Elegí a quién dejás recibir.','Escolha quem você deixa receber.','Choose who you let receive.'],
 mi:[[50,72,'9'],[26,66,'11'],[74,66,'7'],[40,54,'8'],[60,54,'5']],el:[[50,92],[38,82],[62,82],[10,74],[90,74],[50,66]],pel:[38,82],
 ops:[{t:['Dejar libre al lateral y saltar todos cuando reciba','Deixar o lateral livre e saltar quando receber','Leave the full-back free, all jump when he receives'],L:1,g:/^E|DC|MC/,vs:1,pq:['Contra la raya tiene media cancha menos para salir: ahí lo encerrás.','Contra a linha ele tem meio campo a menos.','Against the touchline he has half the pitch to play with: you trap him there.'],mv:{1:[14,72],3:[24,62],0:[38,78]},b:[[10,74],[14,72]]},
  {t:['Hombre a hombre en toda la cancha','Homem a homem em todo o campo','Man for man all over the pitch'],L:.5,g:/MC/,vs:1,pq:['Funciona hasta que uno pierde un duelo: no hay nadie atrás.','Funciona até alguém perder um duelo.','It works until someone loses a duel: there is nobody behind.'],mv:{3:[48,64]},b:[[62,82],[90,74]]},
  {t:['Que el 9 vaya solo a apretar al arquero','O 9 pressiona sozinho o goleiro','The 9 presses the keeper on his own'],L:0,g:/DC|SD/,vs:1,pq:['Uno corre y diez miran: eso no es presión, es cansarlo.','Um corre e dez olham.','One runs, ten watch: that is not pressing, it is tiring him out.'],mv:{0:[50,86]},b:[[50,92],[62,82]]}]}
];

/* ---------- motor ---------- */
function cuadernoDT(){ return S.cuaderno||(S.cuaderno={}); }
function dominados(){ return Object.values(cuadernoDT()).filter(x=>x.a>=DOMINIO).length; }
function azarSituacion(clave){ return (hashS(clave)%10000)/10000; }
function contextoSituacion(rival){
 const once=onceTemporada(S.plantel,S.formacion,S.fijos),attrs=atributosDe(once);
 const yo={f:S.formacion,attrs,once,m:S.modelo||modeloDeEstilo(S.estilo)};
 const el={club:rival.club,f:rival.f,attrs:rival.attrs,m:rival.modelo||modeloDeEstilo(rival.e)};
 const ext=once.filter(o=>/^E/.test(o.rol)).sort((a,b)=>b.rt-a.rt)[0];
 return {yo,el,crack:ext?{rt:ext.rt,rol:ext.rol,nom:(ext.jug&&ext.jug.nom)||''}:null};
}
function ejecutor(c,op){
 const cand=c.yo.once.filter(o=>op.g.test(o.rol)).sort((a,b)=>b.rt-a.rt)[0]||c.yo.once.slice().sort((a,b)=>b.rt-a.rt)[0];
 return {nom:(cand.jug&&cand.jug.nom)||'',rt:cand.rt,rol:cand.rol};
}
const opsDe=(sit,c)=>typeof sit.ops==='function'?sit.ops(c):sit.ops;
function elegirSituacionPara(c,clave){
 const cu=cuadernoDT(),ok=SITUACIONES.filter(s=>{try{return s.cuando(c);}catch(e){return false;}}).filter(s=>s.id!==S.ultimaSituacion);
 if(!ok.length)return null;
 const nuevas=ok.filter(s=>!(cu[s.p]&&cu[s.p].a>=DOMINIO)),lista=nuevas.length?nuevas:ok;
 return lista[hashS(clave)%lista.length];
}
const EFECTO_SIT=[[.95,1],[.99,1.03],[1.02,1.08]]; // [lectura 0, .5, 1][ejecución falla, sale]
function resolverSituacion(sit,c,k,clave){
 const op=opsDe(sit,c)[k],quien=ejecutor(c,op),rivalAttr=c.el.attrs[op.vs];
 const p=clamp(.5+(quien.rt-rivalAttr)/36,.2,.85),sale=azarSituacion(clave+'|'+k)<p;
 // las órdenes del generador (v17) traen su propio premio y su propio costo de error
 const mult=op.premio!=null?(sale?1+op.premio:1-op.costo):EFECTO_SIT[op.L*2][sale?1:0];
 return {op,k,quien,rivalAttr,p,sale,lectura:op.L,mult};
}
function tocaSituacion(jor){
 if(S.esSeleccion||jor.t!=='liga'||jor.visto||jor.sit!==undefined)return false;
 const r=typeof ritmoCarrera==='function'?ritmoCarrera():'esencial';
 if(r==='resumen'||S.ritmo==='rapido')return false;
 return r==='completo'?jor.k%2===0:jor.k%3===0;
}
function rivalDeJornada(jor){
 const TT=S.temp,p=(jor.partidos||[]).find(p=>TT.equipos[p.a].yo||TT.equipos[p.b].yo);
 return p?(TT.equipos[p.a].yo?TT.equipos[p.b]:TT.equipos[p.a]):null;
}
// el efecto entra por la misma puerta que todo lo demás: la fuerza de tu equipo en ESE partido
const _miEquipoV15=miEquipo;
miEquipo=function(rival){
 const yo=_miEquipoV15(rival),a=S.sitActiva;
 if(a&&rival&&rival.club&&a.rival===rival.club.n)yo.mult*=a.mult;
 return yo;
};
const _tickerV15=tickerSiguiente;
tickerSiguiente=function(){
 const TT=S.temp;
 if(S.pant==='temporada'&&TT&&TT.j<TT.jornadas.length&&!(TT.j===TT.mitad&&!TT.paro&&TT.j>0)&&!tmp.gestionPedida){
  const jor=TT.jornadas[TT.j];
  if(tocaSituacion(jor)&&!(typeof partidoGrande==='function'&&partidoGrande(jor))){
   const rival=rivalDeJornada(jor);
   if(!rival||tmp.saltar)jor.sit=null;
   else{
    const c=contextoSituacion(rival),clave=`${S.club.n}|${S.temporada}|${jor.k}`,sit=elegirSituacionPara(c,clave);
    if(!sit)jor.sit=null;
    else if((cuadernoDT()[sit.p]||{}).a>=DOMINIO){
     // automatismo: el equipo ya lo resuelve solo
     jor.sit={id:sit.id,auto:true,mult:1.04};S.ultimaSituacion=sit.id;
     jor.aviso=t3(`Automatismo: el equipo resolvió solo “${t3(...PRINCIPIOS[sit.p].n)}”.`,`Automatismo: o time resolveu sozinho “${t3(...PRINCIPIOS[sit.p].n)}”.`,`Automatism: the team solved “${t3(...PRINCIPIOS[sit.p].n)}” on its own.`);
    }else{abrirSituacion(jor,rival,sit,c,clave);return;}
   }
  }
  if(jor.sit&&jor.sit.mult){const rv=rivalDeJornada(jor);S.sitActiva=rv?{rival:rv.club.n,mult:jor.sit.mult}:null;}
 }
 try{_tickerV15();}finally{S.sitActiva=null;}
};

/* ---------- pantalla ---------- */
function canchaSituacion(sit){
 const cA=S.club.c[0],tx=typeof txtSobre==='function'?txtSobre(cA):'#111';
 return `<div class="v16-cancha" id="v16-cancha"><i class="ar-g"></i><i class="ar-c"></i><i class="medio"></i><i class="ar-g abajo"></i><i class="ar-c abajo"></i>
  ${sit.el.map(p=>`<span class="tk el" style="left:${p[0]}%;bottom:${p[1]}%"></span>`).join('')}
  ${sit.mi.map((p,i)=>`<span class="tk mi" data-i="${i}" style="left:${p[0]}%;bottom:${p[1]}%;background:${cA};color:${tx}">${p[2]||''}</span>`).join('')}
  <span class="pel" style="left:${sit.pel[0]}%;bottom:${sit.pel[1]}%"></span><em>${t3('ATACÁS ↑','ATACA ↑','ATTACKING ↑')}</em></div>`;
}
function abrirSituacion(jor,rival,sit,c,clave){
 tmp.sit={jor,rival,sit,c,clave,res:null};
 const cu=cuadernoDT()[sit.p],primera=!cu||!cu.v,rel=typeof sit.rel==='function'?sit.rel(c):t3(...sit.rel);
 const caja=document.createElement('div');caja.id='v16-sit';caja.className='v16-sit';
 caja.innerHTML=`<div class="v16-panel" role="dialog" aria-modal="true" aria-label="${t3('Problema del partido','Problema do jogo','Match problem')}">
  <div class="v16-izq">${canchaSituacion(sit)}</div>
  <div class="v16-der">
   <p class="etq">${t3('FECHA','RODADA','ROUND')} ${jor.k+1} · ${escapeHTML(rival.club.n)} · ${t3('TE AVISA TU AYUDANTE','SEU AUXILIAR AVISA','YOUR ASSISTANT CALLS OVER')}</p>
   <blockquote class="v16-relato">${rel}</blockquote>
   ${primera?`<p class="v16-pista"><b>${t3('Pista','Dica','Hint')}:</b> ${t3(...sit.pista)}</p>`:''}
   <div id="v16-cuerpo"><p class="v16-lbl">${t3('¿Qué gritás desde el banco?','O que você grita do banco?','What do you shout from the touchline?')}</p>
    <div class="v16-ops">${opsDe(sit,c).map((o,k)=>`<button class="card" onclick="elegirSituacion(${k})"><span class="letra-orden">${'ABCD'[k]}</span><span class="v16-op-txt"><b>${t3(...o.t)}</b>${typeof numerosOrden==='function'?numerosOrden(sit,c,o):''}</span></button>`).join('')}</div></div>
  </div></div>`;
 const f=$('#tkFecha');if(f&&typeof tituloJornada==='function')f.innerHTML=tituloJornada(jor);
 document.body.appendChild(caja);
 if(typeof sonar==='function')sonar('pito');
 const b=caja.querySelector('.v16-ops .card');if(b)b.focus();
}
function elegirSituacion(k){
 const X=tmp.sit;if(!X||X.res)return;
 const r=X.res=resolverSituacion(X.sit,X.c,k,X.clave),caja=$('#v16-cancha'),cu=cuadernoDT(),reg=cu[X.sit.p]||(cu[X.sit.p]={v:0,a:0});
 reg.v++;if(r.lectura===1)reg.a++;
 const recien=reg.a===DOMINIO&&r.lectura===1;
 X.jor.sit={id:X.sit.id,k,lectura:r.lectura,sale:r.sale,mult:r.mult};S.ultimaSituacion=X.sit.id;
 (S.temp.sits=S.temp.sits||[]).push({k:X.jor.k,id:X.sit.id,p:X.sit.p,lectura:r.lectura,sale:r.sale});
 document.querySelectorAll('#v16-sit .v16-ops .card').forEach((b,i)=>{b.disabled=true;if(i===k)b.classList.add('sel');});
 // la orden se ve en la cancha
 Object.entries(r.op.mv||{}).forEach(([i,xy])=>{const el=caja.querySelector(`[data-i="${i}"]`);if(el){el.style.left=xy[0]+'%';el.style.bottom=xy[1]+'%';}});
 const pel=caja.querySelector('.pel'),camino=(r.op.b||[]).slice();
 if(!r.sale&&camino.length){const e=X.sit.el.slice().sort((a,b)=>Math.hypot(a[0]-camino[camino.length-1][0],a[1]-camino[camino.length-1][1])-Math.hypot(b[0]-camino[camino.length-1][0],b[1]-camino[camino.length-1][1]))[0];camino[camino.length-1]=[e[0],e[1]];}
 let i=0;const paso=()=>{const p=camino[i++];if(!p){mostrarResultadoSituacion(recien);return;}pel.style.left=p[0]+'%';pel.style.bottom=p[1]+'%';setTimeout(paso,620);};
 setTimeout(paso,window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);
}
function mostrarResultadoSituacion(recien){
 const X=tmp.sit,r=X.res,P=PRINCIPIOS[X.sit.p],reg=cuadernoDT()[X.sit.p],cuerpo=$('#v16-cuerpo');if(!cuerpo)return;
 const lec=r.lectura===1?['ok',t3('Lectura correcta','Leitura correta','Right read')]:r.lectura===.5?['med',t3('Lectura a medias','Leitura pela metade','Half a read')]:['mal',t3('Lectura equivocada','Leitura errada','Wrong read')];
 const pct=Math.round((r.mult-1)*100),caja=$('#v16-cancha');if(caja)caja.classList.add(r.sale?'sale':'falla');
 if(typeof sonar==='function')sonar(r.sale&&r.lectura===1?'gol':'uy');
 cuerpo.innerHTML=`<div class="v16-veredicto">
   <div class="${lec[0]}"><small>${t3('La idea','A ideia','The idea')}</small><b>${lec[1]}</b><span>${t3(...r.op.pq)}</span></div>
   <div class="${r.sale?'ok':'mal'}"><small>${t3('La ejecución','A execução','The execution')}</small><b>${r.sale?t3('Salió','Saiu','It came off'):t3('No salió','Não saiu','It did not come off')}</b>
    <span>${escapeHTML(apellido(r.quien.nom)||r.quien.rol)} (${r.quien.rt}) ${t3('contra','contra','against')} ${[t3('su ataque','o ataque deles','their attack'),t3('su creación','a criação deles','their creativity'),t3('su defensa','a defesa deles','their defence'),t3('su presión','a pressão deles','their pressing')][r.op.vs]} (${r.rivalAttr}) · ${Math.round(r.p*100)}%</span></div></div>
  <p class="v16-efecto ${pct>0?'ok':pct<0?'mal':''}">${t3('Hoy tu equipo juega','Hoje seu time joga','Today your team plays')} <b>${pct>0?'+':''}${pct}%</b>${r.lectura===1&&!r.sale?' · '+t3('La idea era la buena: con mejores intérpretes, sale.','A ideia era boa: com melhores intérpretes, sai.','The idea was right: with better players it comes off.'):r.lectura===0&&r.sale?' · '+t3('Zafaste. No te quedes con el resultado.','Escapou. Não fique com o resultado.','You got away with it. Do not trust the result.'):''}</p>
  <div class="v16-principio"><small>${t3('PRINCIPIO','PRINCÍPIO','PRINCIPLE')} · ${t3('cuaderno','caderno','notebook')} ${Object.keys(cuadernoDT()).length}/${N_PRINCIPIOS}</small><b>${t3(...P.n)}</b><p>${t3(...P.d)}</p>
   <span class="v16-dots" aria-label="${reg.a}/${DOMINIO}">${[0,1,2].map(i=>`<i class="${i<reg.a?'on':''}"></i>`).join('')}</span>
   <span class="mini">${recien?t3('¡Automatizado! Desde ahora el equipo lo resuelve solo y vas a ver problemas nuevos.','Automatizado! Agora o time resolve sozinho.','Automated! From now on the team solves it alone and you will meet new problems.'):reg.a>=DOMINIO?'':t3(`${DOMINIO-reg.a} ${DOMINIO-reg.a===1?'lectura correcta más':'lecturas correctas más'} y el equipo lo hace solo.`,`Mais ${DOMINIO-reg.a} e o time faz sozinho.`,`${DOMINIO-reg.a} more right ${DOMINIO-reg.a===1?'read':'reads'} and the team does it alone.`)}</span></div>
  <div class="acciones"><button class="btn" id="v16-seguir" onclick="cerrarSituacion()">${t3('Seguir el partido','Seguir o jogo','Back to the match')}</button></div>`;
 const b=$('#v16-seguir');if(b)b.focus();
}
function cerrarSituacion(){
 const X=tmp.sit,c=$('#v16-sit');if(c)c.remove();tmp.sit=null;
 if(X&&X.res){const r=X.res;X.jor.aviso=`${r.lectura===1?'✓':r.lectura===.5?'≈':'✗'} ${t3(...PRINCIPIOS[X.sit.p].n)} · ${r.sale?t3('salió','saiu','came off'):t3('no salió','não saiu','did not come off')}`;}
 tickerSiguiente();
}

/* ---------- cuaderno del DT ---------- */
function verCuaderno(){
 const cu=cuadernoDT(),d=document.createElement('div');d.id='v16-cuaderno';d.className='v16-sit';
 d.innerHTML=`<div class="v16-panel cuaderno" role="dialog" aria-modal="true"><div class="v16-der">
  <p class="etq">${t3('CUADERNO DEL DT','CADERNO DO TÉCNICO','THE COACH’S NOTEBOOK')}</p>
  <h2 class="disp">${Object.keys(cu).length} ${t3('de','de','of')} ${N_PRINCIPIOS} ${t3('principios encontrados','princípios encontrados','principles found')} · ${dominados()} ${t3('automatizados','automatizados','automated')}</h2>
  <p class="v14-nota">${t3('Los principios aparecen cuando el partido te pone el problema. Con tres lecturas correctas, tu equipo lo resuelve solo.','Os princípios aparecem quando o jogo traz o problema.','Principles show up when a match poses the problem. Three right reads and your team solves it alone.')}</p>
  <div class="v16-lista">${Object.keys(PRINCIPIOS).map(id=>{const P=PRINCIPIOS[id],r=cu[id];return r?`<div class="${r.a>=DOMINIO?'dom':''}"><b>${t3(...P.n)}</b><p>${t3(...P.d)}</p><span class="v16-dots">${[0,1,2].map(i=>`<i class="${i<r.a?'on':''}"></i>`).join('')}</span><span class="mini">${r.a>=DOMINIO?t3('Automatismo del equipo','Automatismo do time','Team automatism'):t3(`Visto ${r.v} · bien leído ${r.a}`,`Visto ${r.v} · bem lido ${r.a}`,`Seen ${r.v} · read right ${r.a}`)}</span></div>`:`<div class="oculto"><b>?</b><p>${t3('Todavía no te tocó este problema.','Ainda não apareceu este problema.','You have not met this problem yet.')}</p></div>`;}).join('')}</div>
  <div class="acciones"><button class="btn" onclick="document.getElementById('v16-cuaderno').remove()">${T('volver')}</button></div></div></div>`;
 document.body.appendChild(d);
}
const _pintarTickerV15=pintarTicker;
pintarTicker=function(){
 _pintarTickerV15();
 const g=$('#tkGes');if(g&&!$('#tkCuaderno'))g.insertAdjacentHTML('afterend',`<button class="tkv" id="tkCuaderno" onclick="verCuaderno()">📓 ${Object.keys(cuadernoDT()).length}/${N_PRINCIPIOS}</button>`);
};
// la crónica también cuenta cómo leíste los partidos
if(typeof cronicaTemporada==='function'){
 const _cronicaV15=cronicaTemporada;
 cronicaTemporada=function(){
  const h=_cronicaV15(),s=(S.temp&&S.temp.sits)||[];if(!s.length)return h;
  const ok=s.filter(x=>x.lectura===1).length;
  const i=h.lastIndexOf('</article>');if(i<0)return h;
  return h.slice(0,i)+(`<p class="v16-cronica">${t3(`Desde el banco leyó bien ${ok} de ${s.length} problemas de partido. El cuaderno suma ${Object.keys(cuadernoDT()).length} principios, ${dominados()} ya automatizados.`,`Do banco leu bem ${ok} de ${s.length} problemas. O caderno soma ${Object.keys(cuadernoDT()).length} princípios.`,`From the touchline he read ${ok} of ${s.length} match problems right. The notebook holds ${Object.keys(cuadernoDT()).length} principles, ${dominados()} automated.`)}</p>`)+h.slice(i);
 };
}
// un diálogo abierto no puede quedar encima de la pantalla siguiente (pasaba con "¿Quién sale?")
const _irV15=ir;
ir=function(p){ try{document.querySelectorAll('dialog[open]').forEach(d=>d.close());const s=document.getElementById('v16-sit');if(s&&p!=='temporada')s.remove();}catch(e){} _irV15(p); };
