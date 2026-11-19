// v23 — Sexta y séptima familia del banco: las transiciones.
// Al recuperar: ¿ir o asegurar? Al perder: ¿presionar, cortar o volver?
// Cada arquetipo sale de dónde se gana o se pierde la pelota (la altura de tu bloque), de cómo está parado el rival
// y de cómo te ataca. Buena, media y trampa: las mismas del mazo "Los 110 problemas".
Object.assign(PRINCIPIOS,{
 contra:{n:['Atacar antes de que se ordenen','Atacar antes que se organizem','Attack before they reorganise'],d:['Los primeros segundos después de recuperar valen más que cualquier jugada: si quedan menos detrás de la pelota que atacantes tuyos, se va.','Os primeiros segundos depois de recuperar valem mais que qualquer jogada.','The first seconds after winning it are worth more than any move: if fewer of them are behind the ball than your attackers, go.']},
 asegurar:{n:['Asegurar la primera pelota','Garantir a primeira bola','Secure the first pass'],d:['Recuperar y perderla enseguida es lo peor que te puede pasar: si no hay ventaja, primero la pelota, después el ataque.','Recuperar e perder logo é o pior que pode acontecer.','Winning it and losing it straight away is the worst outcome: if there is no advantage, keep the ball first, attack later.']},
 contrapresion:{n:['Contrapresión: recuperarla al instante','Contrapressão: recuperar na hora','Counter-press: win it straight back'],d:['El mejor momento para recuperar es justo después de perderla: el rival todavía no levantó la cabeza y vos estás cerca.','O melhor momento para recuperar é logo depois de perder.','The best moment to win it back is right after losing it: they have not looked up yet and you are close.']},
 repliegue:{n:['Repliegue: volver por dentro','Recomposição: voltar por dentro','Recovery runs: get back through the middle'],d:['Si no se puede presionar, se vuelve corriendo hacia el arco propio por el camino más corto, cerrando el centro primero.','Se não dá para pressionar, volta pelo caminho mais curto, fechando o centro.','If you cannot press, run back towards your own goal by the shortest route, closing the middle first.']}
});
N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;

const SOLUCIONES_RECUPERAR=[
 {id:'verticalYa',p:'contra',r:'medio',pr:.08,g:/MC|MCD/,vs:2,t:['Pase vertical inmediato','Passe vertical imediato','Immediate forward pass'],
  si:['Su línea quedó arriba y mal parada: el primer pase a la espalda vale un mano a mano.','A linha ficou alta e mal posicionada: o primeiro passe nas costas vale um mano a mano.','Their line was caught high: the first ball in behind is worth a one v one.'],no:['Ya están detrás de la pelota: el pase vertical va a sus pies y la contra es de ellos.','Já estão atrás da bola: o passe vertical vai neles.','They are already behind the ball: the forward pass goes to them and the counter is theirs.'],
  mv:{DC:[52,74],EX:[80,64]},b:[[52,76]]},
 {id:'conduce',p:'contra',r:'medio',pr:.07,g:/MC/,vs:1,t:['Que conduzca el que la recuperó','Quem recuperou conduz','The man who won it drives forward'],
  si:['Tiene campo delante y nadie lo encara: cada metro que gana corre a su defensa para atrás.','Tem campo pela frente e ninguém o encara.','He has space ahead and nobody stepping out: every yard he gains pushes their defence back.'],no:['Lo rodean enseguida: conduce dos metros y la pierde donde más duele.','O cercam logo: conduz dois metros e perde.','They surround him at once: two yards on and he loses it where it hurts most.'],
  mv:{M1:[50,60]},b:[[50,60]]},
 {id:'ladoDebilT',p:'ladoDebil',r:'medio',pr:.07,g:/MC|^E/,vs:1,t:['Atacar por el lado débil','Atacar pelo lado fraco','Attack the weak side'],
  si:['La ganaste donde estaba todo su equipo: del otro lado tenés al extremo solo.','Ganhou onde estava todo o time deles: do outro lado o ponta está só.','You won it where their whole team was: your far winger is alone.'],no:['El cambio de frente tarda y les da tiempo de volver.','A inversão demora e dá tempo de voltarem.','The switch takes time and lets them get back.'],
  mv:{EI:[16,66]},b:[[18,64]]},
 {id:'rematar',p:'contra',r:'bajo',pr:.07,g:/DC|^E/,vs:3,t:['Rematar rápido','Finalizar rápido','Shoot quickly'],
  si:['La ganaste en su tercio: dos toques y al arco, antes de que se cierren.','Ganhou no terço deles: dois toques e chute.','You won it in their third: two touches and shoot, before they close.'],no:['Estás lejos: el remate apurado es regalarles la pelota.','Está longe: o chute apressado é dar a bola.','You are too far out: a hurried shot just gives them the ball.'],
  mv:{DC:[52,82]},b:[[52,82],[50,99]]},
 {id:'seguridad',p:'asegurar',r:'bajo',pr:.05,g:/MCD|DFC/,vs:1,t:['Primer pase de seguridad','Primeiro passe de segurança','Safe first pass'],
  si:['Estás rodeado y sin pase adelante: primero asegurar la pelota, después ver.','Está cercado e sem passe à frente: primeiro garantir a bola.','You are surrounded with no forward pass: secure the ball first, then look.'],no:['Había ventaja para ir y la dejaste pasar.','Havia vantagem para ir e você deixou passar.','There was an advantage to go and you let it pass.'],
  mv:{M2:[60,42]},b:[[60,42]]},
 {id:'pausaT',p:'asegurar',r:'bajo',pr:.04,g:/MC|DFC/,vs:1,t:['Pausa: tenerla hasta ordenarnos','Pausa: segurar até nos organizarmos','Pause: keep it until we are organised'],
  si:['Ellos están ordenados y nosotros no: atacar así es perderla y quedar abiertos.','Eles estão organizados e nós não.','They are organised and we are not: attacking like this means losing it with gaps everywhere.'],no:['Había espacio para hacer daño y le diste tiempo de volver.','Havia espaço e você deu tempo de voltarem.','There was space to hurt them and you gave them time to recover.'],
  mv:{M1:[48,44],M2:[60,40]},b:[[48,44]]},
 {id:'faltaRecibida',p:'gestion',r:'bajo',pr:.04,g:/MC|DC/,vs:0,t:['Proteger la pelota y ganar la falta','Proteger a bola e cavar a falta','Shield the ball and win the foul'],
  si:['Vuelven rápido a presionar: el que la protege gana la falta y el equipo respira.','Voltam rápido para pressionar: quem protege ganha a falta.','They counter-press quickly: shielding it wins the foul and the team breathes.'],no:['No venía nadie: te quedás quieto y perdés la ventaja.','Não vinha ninguém: fica parado e perde a vantagem.','Nobody was coming: you stand still and lose the advantage.'],
  mv:{M1:[50,54]},b:[[50,54]]}
];
const CASOS_RECUPERAR=[
 [['Ir · espalda','Ir · costas','Go · in behind'],['La ganamos en el medio y su línea quedó arriba.','Ganhamos no meio e a linha deles ficou alta.','We won it in midfield and their line was left high.'],'verticalYa','conduce','pausaT'],
 [['Ir · campo delante','Ir · campo à frente','Go · open field'],['El que la ganó tiene campo y nadie lo encara.','Quem ganhou tem campo e ninguém o encara.','The man who won it has space and nobody steps out.'],'conduce','verticalYa','seguridad'],
 [['Ir · lado débil','Ir · lado fraco','Go · weak side'],['La ganamos donde estaba todo su equipo.','Ganhamos onde estava todo o time deles.','We won it where their whole team was.'],'ladoDebilT','verticalYa','conduce'],
 [['Ir · tercio alto','Ir · terço alto','Go · final third'],['La ganamos en su tercio.','Ganhamos no terço deles.','We won it in their third.'],'rematar','verticalYa','pausaT'],
 [['Asegurar · rodeados','Garantir · cercados','Secure · surrounded'],['La ganamos rodeados y sin pase adelante.','Ganhamos cercados e sem passe à frente.','We won it surrounded with no forward pass.'],'seguridad','pausaT','conduce'],
 [['Asegurar · desordenados','Garantir · desorganizados','Secure · disorganised'],['Ellos están ordenados y nosotros no.','Eles estão organizados e nós não.','They are organised and we are not.'],'pausaT','seguridad','verticalYa'],
 [['Asegurar · cortar su vuelta','Garantir · cortar a volta','Secure · stop their press'],['Vuelven rápido a presionar y tenemos uno que la protege.','Voltam rápido e temos um que protege.','They press back quickly and we have a man who can shield it.'],'faltaRecibida','pausaT','ladoDebilT'],
 [['Asegurar · tercio propio','Garantir · terço próprio','Secure · own third'],['La ganamos en nuestro tercio y son más detrás de la pelota.','Ganhamos no nosso terço e são mais atrás da bola.','We won it in our own third and they have more men behind the ball.'],'seguridad','pausaT','verticalYa']
];
const SOLUCIONES_PERDER=[
 {id:'contrapresion',p:'contrapresion',r:'alto',pr:.08,g:/MC|^E|DC/,vs:1,t:['Contrapresión: los tres más cerca van a la pelota','Contrapressão: os três mais perto vão na bola','Counter-press: the nearest three go for the ball'],
  si:['Tres cerca y uno más atrás: si fallan, el resguardo cubre; si aciertan, es gol en dos pases.','Três perto e um a mais atrás: se falharem, a cobertura segura.','Three close and a spare man behind: if it fails the cover holds; if it works, it is a goal in two passes.'],no:['No hay gente cerca ni sobra uno atrás: presionás y te pasan por encima.','Não há gente perto nem sobra atrás: pressiona e passam por cima.','Nobody close and no spare man behind: you press and they play straight through you.'],
  mv:{M1:[50,66],M2:[60,64],EX:[70,70]},b:[[54,68]]},
 {id:'taparPase',p:'contrapresion',r:'medio',pr:.07,g:/MC/,vs:1,t:['Tapar el primer pase vertical','Tapar o primeiro passe vertical','Block the first forward pass'],
  si:['Su contra depende de un pase vertical: tapado ese pase, tienen que jugar para atrás.','O contra-ataque depende de um passe vertical: tapado, jogam para trás.','Their counter depends on one forward pass: block it and they have to go backwards.'],no:['Tapás un pase y el que la tiene arranca solo.','Tapa um passe e quem tem a bola sai sozinho.','You block a pass and the man on the ball just runs.'],
  mv:{M1:[50,56],M2:[60,56]},b:[[54,64]]},
 {id:'faltaTac',p:'vigilancias',r:'medio',pr:.05,g:/MC/,vs:0,t:['Falta táctica antes de que arranque','Falta tática antes que arranque','Tactical foul before he gets going'],
  si:['No llegás de otra forma: la falta lejos del área corta la contra antes de que nazca.','Não chega de outro jeito: a falta longe da área corta o contra-ataque.','You cannot get there any other way: a foul far from goal kills the counter before it starts.'],no:['Había forma de defenderlo: te ganás una amarilla para nada.','Havia como defender: ganha um amarelo à toa.','There was a way to defend it: you take a yellow for nothing.'],
  mv:{M1:[52,58]},b:[[52,60]]},
 {id:'repliegue',p:'repliegue',r:'bajo',pr:.06,g:/MC|DFC/,vs:2,t:['Repliegue intensivo: todos detrás de la pelota','Recomposição intensa: todos atrás da bola','Sprint back: everyone behind the ball'],
  si:['Perdiste lejos y no hay a quién presionar: lo importante es estar ordenados antes de que lleguen.','Perdeu longe e não há quem pressionar: o importante é estar organizado.','You lost it far away with nobody to press: what matters is being set before they arrive.'],no:['Estaban ahí para recuperarla y se fueron para atrás.','Estavam ali para recuperar e voltaram.','You were right there to win it back and ran away from it.'],
  mv:{M1:[46,34],M2:[58,34],EX:[76,40]},b:[[54,52]]},
 {id:'temporizarT',p:'bloque',r:'bajo',pr:.05,g:/DFC|LT/,vs:0,t:['Temporizar: retroceder sin entrar hasta que lleguen','Temporizar: recuar sem dar o bote até chegarem','Jockey: back off until help arrives'],
  si:['Quedaste en inferioridad: el que defiende no entra, lo hace ir lento y espera a los que vuelven.','Ficou em inferioridade: quem defende não entra e espera os que voltam.','You are outnumbered: the defender does not dive in, slows him down and waits for the runners back.'],no:['Retrocedés con ventaja: le das metros gratis.','Recua com vantagem: dá metros de graça.','You back off when you had the numbers: you give him free yards.'],
  mv:{CI:[44,22],CD:[56,22]},b:[[54,40]]},
 {id:'cerrarCentro',p:'repliegue',r:'bajo',pr:.06,g:/DFC|MCD/,vs:2,t:['Cerrar el centro y mandarlo a la banda','Fechar o centro e mandar para a faixa','Close the middle and show him wide'],
  si:['Va derecho a tu arco: si lo sacás hacia la banda, su remate pasa a ser un centro.','Vai direto ao gol: se o leva para a faixa, o chute vira cruzamento.','He is heading straight for goal: show him wide and his shot becomes a cross.'],no:['Ya iba por afuera: cerrás un centro que no estaba amenazado.','Já ia por fora: fecha um centro que não estava ameaçado.','He was already going wide: you close a middle that was not under threat.'],
  mv:{CI:[46,20],CD:[56,22],M1:[50,32]},b:[[60,36]]}
];
const CASOS_PERDER=[
 [['Presionar · arriba','Pressionar · no alto','Press · high up'],['La perdimos arriba, con tres cerca y uno más atrás.','Perdemos no alto, com três perto e um a mais atrás.','We lost it high up, with three close and a spare man behind.'],'contrapresion','taparPase','repliegue'],
 [['Presionar · su pase','Pressionar · o passe','Press · their pass'],['Su contra depende de un pase vertical.','O contra-ataque depende de um passe vertical.','Their counter depends on one forward pass.'],'taparPase','contrapresion','temporizarT'],
 [['Cortar · arranca','Cortar · arranca','Stop it · he is off'],['Su jugador rápido va a arrancar con espacio y no llegamos.','O jogador rápido vai arrancar com espaço e não chegamos.','Their quick man is about to run into space and we will not get there.'],'faltaTac','temporizarT','contrapresion'],
 [['Cortar · en marcha','Cortar · em andamento','Stop it · under way'],['Su contra ya arrancó y atrás quedamos dos contra tres.','O contra-ataque já saiu e atrás ficamos dois contra três.','Their counter is already running and we are two against three at the back.'],'faltaTac','repliegue','contrapresion'],
 [['Volver · lejos','Voltar · longe','Get back · far away'],['La perdimos lejos y no hay a quién presionar.','Perdemos longe e não há quem pressionar.','We lost it far away and there is nobody to press.'],'repliegue','cerrarCentro','contrapresion'],
 [['Volver · inferioridad','Voltar · inferioridade','Get back · outnumbered'],['Quedamos en inferioridad atrás.','Ficamos em inferioridade atrás.','We are outnumbered at the back.'],'temporizarT','repliegue','contrapresion'],
 [['Volver · va al arco','Voltar · vai ao gol','Get back · going for goal'],['El que conduce va derecho a nuestro arco.','Quem conduz vai direto ao nosso gol.','The man on the ball is heading straight for our goal.'],'cerrarCentro','temporizarT','faltaTac'],
 [['Volver · resguardo justo','Voltar · cobertura justa','Get back · cover is level'],['La perdimos arriba, pero atrás quedamos justos.','Perdemos no alto, mas atrás ficamos justos.','We lost it high up, but we are level at the back.'],'repliegue','taparPase','contrapresion']
];
function arquetipoTransicion(c,clave,fam){
 const h=hashS(clave+'|tr'+fam),pick=(a,k)=>a[(h>>>k)%a.length],yd=c.yo.m.def||'medio',ed=c.el.m.def||'medio';
 const rapido=c.el.attrs[3]>=c.yo.attrs[2]+3,contra=c.el.m.tofe==='contra'||c.el.m.ofe==='directo';
 let caso;
 if(fam==='rec'){
  if(yd==='alto')caso=pick([3,3,0,4],2);
  else if(yd==='bajo')caso=pick([7,7,1,6],2);
  else caso=ed==='alto'?pick([0,1,2],2):c.el.m.tdef==='presion'?pick([6,4,5],2):pick([1,2,5,4],2);
  return {fam,caso,donde:yd};
 }
 if(yd==='alto')caso=c.yo.m.tdef==='presion'?pick([0,1,7],2):pick([7,1,0],2);
 else if(yd==='bajo')caso=pick([4,6,5],2);
 else caso=rapido?pick([2,6,5],2):contra?pick([1,6,4,3,2],2):pick([4,5,3],2);
 return {fam,caso,donde:yd};
}
function nombreArquetipoTransicion(A){const k=(A.fam==='rec'?CASOS_RECUPERAR:CASOS_PERDER)[A.caso];return t3(...k[0])+' — '+t3(...k[1]).replace(/\.$/,'');}
function fichasTransicion(A){
 const yA=A.donde==='alto'?12:A.donde==='bajo'?-14:0,sh=p=>[p[0],Math.max(8,Math.min(92,p[1]+yA))];
 if(A.fam==='rec'){
  const roles=[['CI',38,24,'2'],['CD',62,24,'6'],['M1',46,50,'5'],['M2',58,46,'8'],['EI',14,58,'11'],['EX',84,58,'7'],['DC',50,62,'9']];
  const el=[[44,56],[56,58],[30,54],[70,52],[50,46],[38,76],[62,76],[50,94]];
  return {roles,mi:roles.map(r=>{const p=r[0]==='CI'||r[0]==='CD'?[r[1],r[2]]:sh([r[1],r[2]]);return [p[0],p[1],r[3]];}),el:el.map(p=>p[1]>90?p:sh(p)),pel:sh([46,50])};
 }
 const roles=[['CI',40,18,'2'],['CD',60,18,'6'],['M1',46,60,'5'],['M2',58,62,'8'],['EX',72,72,'7'],['DC',52,76,'9']];
 const el=[[54,66],[38,50],[66,48],[50,40],[30,30]];
 return {roles,mi:roles.map(r=>{const p=r[0]==='CI'||r[0]==='CD'?[r[1],r[2]]:sh([r[1],r[2]]);return [p[0],p[1],r[3]];}),el:el.map(sh),pel:sh([54,66])};
}
function generarTransicion(c,clave,fam){
 const rec=fam==='rec',A=arquetipoTransicion(c,clave,fam),CAT=rec?SOLUCIONES_RECUPERAR:SOLUCIONES_PERDER,caso=(rec?CASOS_RECUPERAR:CASOS_PERDER)[A.caso];
 const F=fichasTransicion(A),idx={};F.roles.forEach((r,i)=>idx[r[0]]=i);
 const conv=mv=>{const o={};Object.entries(mv||{}).forEach(([k,v])=>{if(idx[k]!=null)o[idx[k]]=v;});return o;};
 const fitDe=id=>id===caso[2]?.95:id===caso[3]?.6:id===caso[4]?.2:.35,por=id=>CAT.find(s=>s.id===id);
 const sel=[caso[2],caso[3],caso[4]],h=hashS(clave+'|gt'+fam);
 if(h%3===0){const resto=CAT.filter(s=>!sel.includes(s.id));sel.push(resto[(h>>>4)%resto.length].id);}
 const ops=sel.map((id,i)=>[hashS(clave+'|to'+i),id]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).map(id=>{const s=por(id),f=fitDe(id);
  return {sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:conv(s.mv),b:[F.pel].concat(s.b),riesgo:s.r,premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f};});
 const rel=()=>(rec?t3('¡La recuperamos! ','Recuperamos! ','We have won it back! '):t3('¡La perdimos! ','Perdemos! ','We have lost it! '))+t3(...caso[1]);
 const pista=rec?['¿Quedan menos de ellos detrás de la pelota que atacantes tuyos? Ir. Si no, asegurar.','Há menos deles atrás da bola que atacantes seus? Ir. Se não, garantir.','Are there fewer of them behind the ball than your attackers? Go. If not, secure it.']
  :['¿Hay tres tuyos cerca y uno de más atrás? Presioná. Si no, cortá o volvé.','Há três seus perto e um a mais atrás? Pressione. Se não, corte ou volte.','Three of yours close and a spare man behind? Press. If not, stop it or get back.'];
 return {id:rec?'gen-recuperar':'gen-perder',gen:true,A,nombreA:nombreArquetipoTransicion(A),p:por(caso[2]).p,cuando:()=>true,rel,pista,mi:F.mi,el:F.el,pel:F.pel,ops};
}
const generarRecuperar=(c,clave)=>generarTransicion(c,clave,'rec');
const generarPerder=(c,clave)=>generarTransicion(c,clave,'per');
const _elegirSituacionV22=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 // uno de cada seis problemas es una transición (nunca dos seguidas)
 if(!/^gen-(recuperar|perder)$/.test(S.ultimaSituacion||'')&&hashS(clave+'|gtr')%6===0)
  return hashS(clave+'|gtf')%2?generarRecuperar(c,clave):generarPerder(c,clave);
 return _elegirSituacionV22(c,clave);
};
nombreArquetipo=(function(prev){return function(A){return A&&(A.fam==='rec'||A.fam==='per')&&A.caso!=null?nombreArquetipoTransicion(A):prev(A);};})(nombreArquetipo);
