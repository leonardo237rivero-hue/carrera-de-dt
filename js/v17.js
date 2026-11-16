// v17 — Banco de problemas: la salida de balón deja de ser una ficha y pasa a ser un generador.
// Una situación = cómo presiona ESTE rival × cómo salís VOS. De ahí sale un arquetipo
// (diferencia en la primera línea, dónde está el hombre libre, hacia dónde te empujan)
// y un catálogo de 18 soluciones. Cada orden muestra antes de elegir la probabilidad de que salga
// y el costo del error; el premio depende de leer bien la situación.
// Investigación y cuentas: Claude Doc "Investigación táctica: situaciones, variables y soluciones".

Object.assign(PRINCIPIOS,{
 tercero:{n:['Superar la línea: hombre libre y tercer hombre','Superar a linha: homem livre e terceiro homem','Beat the line: free man and third man'],d:['Con uno más atrás, el libre avanza hasta que alguien salte; cuando salta, la pelota va al que dejó solo. Si tapan al receptor, se llega a él por un tercero.','Com um a mais atrás, o livre avança até alguém saltar; quando salta, a bola vai para quem ficou sozinho.','With a spare man at the back, he advances until someone jumps; then the ball goes to whoever was left alone. If the receiver is covered, reach him through a third man.']},
 saltear:{n:['Saltear la presión','Saltar a pressão','Play over the press'],d:['Contra marca al hombre no hay pase libre: se sale con un duelo ganado, una rotación o una pelota a la espalda. Jugar largo también es salir.','Contra marcação individual não há passe livre: sai-se com um duelo, uma rotação ou uma bola nas costas.','Against man-marking there is no free pass: you get out with a duel won, a rotation or a ball in behind. Going long is also playing out.']}
});
N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;

const RIESGO_SALIDA={alto:{c:.06,n:['Alto: la perdés frente a tu área','Alto: perde na frente da área','High: lost in front of your box']},medio:{c:.03,n:['Medio: la perdés en tu campo, con gente atrás','Médio: perde no seu campo','Medium: lost in your half, with cover']},bajo:{c:.01,n:['Bajo: la perdés en campo rival','Baixo: perde no campo rival','Low: lost in their half']}};
// A = {n: rivales en primera línea, cb: tus centrales, dif, libre, emp, hombre, alto}
// fit(A) 0..1: cuánto sirve esa solución en ese arquetipo · g: quién la ejecuta · vs: atributo rival
const SOLUCIONES_SALIDA=[
 {id:'cincoCentrales',p:'supnum',r:'alto',pr:.07,g:/MCD|MC$/,vs:3,t:['¡El 5, entre los centrales!','O 5 entre os zagueiros!','The 5 drops between the centre-backs!'],
  fit:A=>A.hombre?.3:A.dif<=0&&A.cb===2?1:A.dif<=0?.5:.2,si:['Hacés uno más atrás: siempre queda un libre.','Faz um a mais atrás.','You make one more at the back: someone is always free.'],no:['Ya tenías gente de sobra atrás: te sacás un volante del medio para nada.','Já tinha gente de sobra atrás.','You already had spare men at the back: you lose a midfielder for nothing.'],
  mv:{3:[50,13],1:[24,20],2:[76,20]},b:[[50,13],[24,20],[30,44]]},
 {id:'cincoCostado',p:'supnum',r:'medio',pr:.06,g:/MCD|MC$/,vs:3,t:['El 5 baja al costado de un central','O 5 desce ao lado de um zagueiro','The 5 drops beside a centre-back'],
  fit:A=>A.hombre?.3:A.dif<=0?(A.emp==='adentro'?.9:.7):.2,si:['Uno más atrás y fuera de la trampa del medio.','Um a mais atrás e fora da armadilha central.','One more at the back, away from the central trap.'],no:['No hacía falta sumar atrás.','Não era preciso somar atrás.','No need for another man at the back.'],
  mv:{3:[20,21]},b:[[36,17],[20,21],[26,44]]},
 {id:'lateralQueda',p:'supnum',r:'medio',pr:.06,g:/LT/,vs:3,t:['Un lateral se queda: línea de tres','Um lateral fica: linha de três','One full-back stays: back three'],
  fit:A=>A.hombre?.3:A.dif<=0&&A.cb===2?.8:.2,si:['Tres atrás sin sacar a nadie del medio; el extremo da el ancho.','Três atrás sem tirar ninguém do meio.','Three at the back without losing a midfielder; the winger gives the width.'],no:['Te quedás sin lateral arriba y no ganás nada atrás.','Fica sem lateral em cima.','You lose a full-back high up and gain nothing behind.'],
  mv:{4:[16,20]},b:[[36,17],[16,20],[20,44]]},
 {id:'arqueroTercero',p:'supnum',r:'alto',pr:.08,g:/POR/,vs:3,t:['El arquero juega de tercer central','O goleiro joga de terceiro zagueiro','The keeper plays as a third centre-back'],
  fit:A=>A.libre==='arquero'?1:A.hombre?.5:.3,si:['Al arquero no lo marcan: es tu hombre de más, gratis.','O goleiro não é marcado: é seu homem a mais.','Nobody marks the keeper: he is your free extra man.'],no:['Ya tenías un libre de campo: arriesgás al arquero sin necesidad.','Já tinha um livre de campo.','You already had a free outfield player: you risk the keeper for nothing.'],
  mv:{0:[50,10],1:[26,18],2:[74,18]},b:[[50,10],[74,18],[80,42]]},
 {id:'interiorBaja',p:'supnum',r:'medio',pr:.06,g:/MC$|MCO/,vs:3,t:['Un interior baja al lado del 5','Um meia desce ao lado do 5','An inside midfielder drops next to the 5'],
  fit:A=>A.hombre?.35:A.n===1?.9:A.dif<=0?.6:.3,si:['Su enganche ya no puede tapar a dos: uno recibe.','O meia deles não pode tapar dois.','Their number 10 cannot screen two: one of them receives.'],no:['Vaciás el medio más arriba sin resolver la primera línea.','Esvazia o meio mais acima.','You empty midfield higher up without fixing the first line.'],
  mv:{6:[38,30]},b:[[36,17],[38,30],[50,31],[60,48]]},
 {id:'lateralAdentro',p:'supnum',r:'medio',pr:.06,g:/LT/,vs:1,t:['El lateral se mete adentro','O lateral vem por dentro','The full-back steps inside'],
  fit:A=>A.hombre?.4:A.emp==='afuera'?.85:.4,si:['Te llevan a la raya y vos aparecés por adentro: su extremo no sabe a quién seguir.','Levam você à linha e você aparece por dentro.','They push you to the touchline and you appear inside: their winger does not know whom to follow.'],no:['Por adentro es justo donde te esperan.','Por dentro é onde esperam.','Inside is exactly where they are waiting.'],
  mv:{4:[34,34]},b:[[36,17],[34,34],[44,50]]},
 {id:'conduccion',p:'tercero',r:'alto',pr:.08,g:/DFC/,vs:3,t:['Que el central libre conduzca hasta que alguien salte','O zagueiro livre conduz até alguém saltar','The free centre-back carries until someone jumps'],
  fit:A=>A.libre==='central'?1:.25,si:['Nadie lo aprieta: cada metro que avanza obliga a uno a salir y deja a otro solo.','Ninguém o pressiona: cada metro obriga alguém a sair.','Nobody presses him: every yard forces one to step out and leaves another alone.'],no:['No hay central libre: conducir ahí es perderla de frente a tu arco.','Não há zagueiro livre.','No centre-back is free: carrying there means losing it facing your own goal.'],
  mv:{1:[36,37]},b:[[36,17],[36,37],[52,52]]},
 {id:'tercerHombre',p:'tercero',r:'medio',pr:.08,g:/MC$|MCO|MCD/,vs:3,t:['Tercer hombre: al 5 de espaldas, y él de cara al interior','Terceiro homem: no 5 de costas, e ele de frente para o meia','Third man: into the 5 back to goal, he sets the inside midfielder'],
  fit:A=>A.hombre?.5:A.emp==='adentro'?.95:.6,si:['Te dejan el pase al 5 para saltarle: no gira, la deja de primera y el tercero recibe de frente.','Deixam o passe ao 5 para saltar nele: toca de primeira.','They leave the pass into the 5 to jump him: he lays it off first time and the third man receives facing forward.'],no:['Funciona, pero había una salida más simple.','Funciona, mas havia saída mais simples.','It works, but there was a simpler way out.'],
  mv:{6:[42,41]},b:[[36,17],[50,31],[42,41],[54,58]]},
 {id:'pared',p:'tercero',r:'alto',pr:.05,g:/DFC|MCD/,vs:3,t:['Pared corta entre el central y el 5','Tabela curta entre zagueiro e 5','Short one-two between centre-back and 5'],
  fit:A=>A.hombre?.2:A.dif>=1?.5:.25,si:['Sirve si el que presiona viene solo y de frente.','Serve se quem pressiona vem sozinho.','Fine if the presser comes alone and straight on.'],no:['Pared en tu área contra dos que aprietan: demasiado premio chico para tanto riesgo.','Tabela na sua área contra dois: risco demais.','A one-two in your own box against two pressers: too little reward for the risk.'],
  mv:{1:[40,30]},b:[[36,17],[50,31],[40,30]]},
 {id:'atraerSaltar',p:'tercero',r:'medio',pr:.07,g:/POR/,vs:2,t:['El arquero la aguanta para atraerlos y juega tenso al medio','O goleiro segura para atrair e joga tenso no meio','The keeper holds it to draw them in, then drills it into midfield'],
  fit:A=>A.alto&&!A.hombre?.85:A.alto?.6:.4,si:['Cuantos más salen a apretar, más lugar queda a su espalda.','Quanto mais saem, mais espaço fica.','The more of them come out, the more room behind them.'],no:['No vienen a buscarte: no hay a quién atraer.','Não vêm pressionar: não há quem atrair.','They are not coming for you: there is nobody to draw in.'],
  mv:{6:[42,54]},b:[[50,8],[42,54]]},
 {id:'cambioFrente',p:'amplitud',r:'bajo',pr:.06,g:/DFC|POR/,vs:3,t:['Cambio de frente al lateral del otro lado','Inversão para o lateral do outro lado','Switch to the far-side full-back'],
  fit:A=>A.hombre?.45:A.emp==='afuera'?.9:.5,si:['Bascularon todos para encerrarte: el otro lateral está solo.','Bascularam todos: o outro lateral está sozinho.','They all shifted across to trap you: the far full-back is alone.'],no:['No bascularon tanto: el pase largo llega con marca.','Não bascularam tanto.','They have not shifted that far: the long pass arrives with a marker.'],
  mv:{5:[92,46]},b:[[36,17],[92,46]]},
 {id:'paseInterior',p:'tercero',r:'medio',pr:.07,g:/MCO|MC$/,vs:1,t:['Pase adentro al que aparece entre líneas','Passe por dentro para quem aparece entre linhas','Pass inside to the player between the lines'],
  fit:A=>A.hombre?.3:A.emp==='afuera'&&A.dif>=0?.75:.4,si:['Sus volantes saltaron y dejaron la espalda.','Os volantes saltaram e deixaram as costas.','Their midfielders jumped and left the space behind.'],no:['Ese pase es el que están esperando.','Esse passe é o que esperam.','That is the pass they are waiting for.'],
  mv:{6:[46,52]},b:[[64,17],[46,52]]},
 {id:'largo9',p:'saltear',r:'bajo',pr:.05,g:/DC|SD/,vs:2,t:['Largo al 9 y todos a la segunda pelota','Bola longa no 9 e todos na segunda bola','Long to the 9, everyone on the second ball'],
  fit:A=>A.hombre?.9:A.dif<0?.8:A.dif>=1?.25:.5,si:['No hay pase libre atrás: la pelota pasa por arriba y el partido se juega donde cae.','Não há passe livre atrás: a bola passa por cima.','No free pass at the back: the ball goes over and the game is played where it drops.'],no:['Tenías ventaja para salir jugando y la regalaste.','Tinha vantagem para sair jogando.','You had the numbers to play out and gave them away.'],
  mv:{6:[46,58],3:[54,52]},b:[[50,70],[48,58]]},
 {id:'largoExtremo',p:'saltear',r:'bajo',pr:.06,g:/^E/,vs:2,t:['Largo al extremo, mano a mano con su lateral','Bola longa no ponta, um contra um','Long to the winger, one-v-one with their full-back'],
  fit:A=>A.hombre?.85:A.alto?.6:.3,si:['Si marcan a todos, tu mejor duelo decide.','Se marcam todos, seu melhor duelo decide.','If everyone is marked, your best duel decides.'],no:['Su lateral tiene ayuda: el extremo recibe contra dos.','O lateral deles tem ajuda.','Their full-back has help: your winger receives against two.'],
  mv:{7:[90,64]},b:[[64,17],[90,62]]},
 {id:'espalda',p:'profundidad',r:'bajo',pr:.08,g:/^E|DC|SD/,vs:2,t:['Pelota a la espalda de su línea','Bola nas costas da linha deles','Ball in behind their line'],
  fit:A=>A.alto?(A.hombre?.9:.7):.2,si:['Vinieron todos a apretar: atrás quedó media cancha.','Vieram todos pressionar: atrás ficou meio campo.','They all came to press: half a pitch is left behind them.'],no:['Su línea está baja: no hay espalda que atacar.','A linha deles está baixa.','Their line is deep: there is no space behind to attack.'],
  mv:{7:[84,84]},b:[[64,17],[82,84]]},
 {id:'rotacion',p:'saltear',r:'medio',pr:.07,g:/LT|^E/,vs:1,t:['Rotación en la banda: lateral, interior y extremo cambian de lugar','Rotação na faixa: lateral, meia e ponta trocam','Wide rotation: full-back, midfielder and winger swap'],
  fit:A=>A.hombre?.8:.4,si:['Al hombre te siguen: si rotás, alguien llega tarde.','Individual seguem você: se roda, alguém chega tarde.','Man-markers follow: rotate and someone arrives late.'],no:['En zona no te siguen: rotar no mueve a nadie.','Em zona não seguem.','Zonal markers do not follow: rotating moves nobody.'],
  mv:{5:[80,50],7:[94,36],6:[70,36]},b:[[64,17],[94,36],[80,50]]},
 {id:'saqueCorto',p:'supnum',r:'alto',pr:.06,g:/DFC/,vs:3,t:['Saque de arco corto, con los centrales adentro del área','Tiro de meta curto, zagueiros dentro da área','Short goal kick with the centre-backs inside the box'],
  fit:A=>A.alto&&A.dif<=0&&!A.hombre?.6:.3,si:['Ellos no pueden entrar al área hasta que la pelota se mueva: ganás un segundo.','Eles não podem entrar na área até a bola rolar.','They cannot enter the box until the ball moves: you gain a second.'],no:['Sin presión alta no hace falta jugársela ahí.','Sem pressão alta não precisa arriscar ali.','Without a high press there is no need to gamble there.'],
  mv:{1:[38,9],2:[62,9]},b:[[38,9],[50,31]]},
 {id:'alternar',p:'saltear',r:'bajo',pr:.04,g:/POR|DFC/,vs:3,t:['Una corta y una larga: que no sepan qué viene','Uma curta e uma longa: que não saibam','Mix short and long: keep them guessing'],
  fit:()=>.55,si:['No resuelve este problema, pero les saca la lectura para el resto del partido.','Não resolve este problema, mas tira a leitura deles.','It does not solve this problem, but it takes away their read for the rest of the match.'],no:['','',''],
  mv:{},b:[[36,17],[50,70]]}
];

function arquetipoSalida(c,clave){
 const f=String(c.el.f||'4-4-2').split('-').map(Number),n=clamp(f[f.length-1]||2,1,3),miF=String(c.yo.f||'4-4-2').split('-').map(Number),cb=miF[0]===3||miF[0]===5?3:2;
 const h=hashS(c.el.club.n+'|presion'),alto=c.el.m.def==='alto',hombre=c.el.m.tdef==='presion'&&h%3===0,emp=(h>>>3)%2?'afuera':'adentro',dif=cb-n;
 return {n,cb,dif,alto,hombre,emp,libre:hombre?'ninguno':dif>=1?'central':'arquero'};
}
function nombreArquetipo(A){
 const dif=A.dif<0?t3('Uno menos atrás','Um a menos atrás','One fewer at the back'):A.dif===0?t3('Iguales atrás','Iguais atrás','Level at the back'):A.dif===1?t3('Uno más atrás','Um a mais atrás','One more at the back'):t3('Dos más atrás','Dois a mais atrás','Two more at the back');
 const lib=A.libre==='ninguno'?t3('nadie libre','ninguém livre','nobody free'):A.libre==='central'?t3('libre un central','zagueiro livre','a centre-back free'):t3('libre el arquero','goleiro livre','the keeper free');
 return `${dif} · ${lib}${A.hombre?'':' · '+(A.emp==='afuera'?t3('te llevan a la raya','levam você à linha','they push you wide'):t3('te llevan adentro','levam você para dentro','they push you inside'))}`;
}
function relatoSalida(A){
 const P=[t3(`Nos aprietan con ${A.n} contra nuestros ${A.cb} centrales.`,`Pressionam com ${A.n} contra nossos ${A.cb} zagueiros.`,`They press with ${A.n} against our ${A.cb} centre-backs.`)];
 if(A.hombre)P.push(t3('Van hombre a hombre en toda la cancha: no hay nadie libre.','Vão homem a homem: ninguém livre.','They go man for man all over: nobody is free.'));
 else{P.push(A.emp==='afuera'?t3('Nos tapan el medio y nos llevan a la raya.','Fecham o meio e levam à linha.','They block the middle and push us to the touchline.'):t3('Nos dejan el pase al 5 y ahí nos saltan.','Deixam o passe ao 5 e saltam nele.','They leave the pass into our 5 and jump him there.'));
  if(A.libre==='arquero')P.push(t3('Al arquero no lo aprietan.','Não pressionam o goleiro.','They do not press the keeper.'));}
 return P.join(' ');
}
function fichasSalida(A){
 const mi=[[50,5,'1'],[36,17,'2'],[64,17,'6'],[50,31,'5'],[10,30,'3'],[90,30,'4'],[38,46,'8'],[88,58,'7'],[50,66,'9']];
 if(A.cb===3){mi[1]=[26,18,'2'];mi[2]=[74,18,'6'];mi.push([50,15,'4']);mi[5]=[92,40,''];mi[4]=[8,40,'3'];}
 let ad=A.n===1?[[50,25]]:A.n===2?[[40,25],[60,25]]:[[30,26],[50,24],[70,26]];
 if(A.emp==='adentro'&&!A.hombre)ad=ad.map(p=>[50+(p[0]-50)*1.5,p[1]]);
 const medios=A.hombre?[[50,35],[38,50],[12,36],[88,36]]:A.emp==='adentro'?[[50,38],[30,44],[70,44]]:[[34,42],[66,42],[50,44],[14,40],[86,40]];
 return {mi,el:ad.concat(medios,[[46,72],[82,64]])};
}
function generarSalida(c,clave){
 const A=arquetipoSalida(c,clave),F=fichasSalida(A),h=hashS(clave+'|gen');
 const todas=SOLUCIONES_SALIDA.map(s=>({s,f:s.fit(A)})).sort((a,b)=>b.f-a.f);
 const mejores=todas.filter(x=>x.f>=.8),buena=mejores[h%mejores.length]||todas[0],el=[buena];
 const libre=x=>!el.includes(x);
 const media=todas.filter(x=>libre(x)&&x.f>=.45&&x.f<.8);if(media.length)el.push(media[(h>>>2)%media.length]);
 const mala=todas.filter(x=>libre(x)&&x.f<.45);if(mala.length)el.push(mala[(h>>>4)%mala.length]);
 const segura=todas.filter(x=>libre(x)&&x.s.r==='bajo')[0]||todas.filter(libre)[0];if(segura)el.push(segura);
 const orden=el.map((x,i)=>[hashS(clave+'|o'+i),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
 const ops=orden.map(({s,f})=>({sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:s.mv,b:s.b,
  riesgo:s.r,premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f}));
 return {id:'gen-salida',gen:true,A,p:buena.s.p,cuando:()=>true,rel:()=>relatoSalida(A),
  pista:['Contá la primera línea y buscá al que está solo. Después mirá hacia dónde te empujan.','Conte a primeira linha e ache quem está sozinho.','Count the first line and find who is alone. Then look at where they are pushing you.'],
  mi:F.mi,el:F.el,pel:[50,5],ops};
}
// antes de elegir se ve lo que un DT sabe: quién la ejecuta, con qué chance, y dónde se pierde si falla.
// El premio NO se muestra: cuánto sirve esa solución en esa situación es justamente la lectura.
function numerosOrden(sit,c,o){
 if(o.premio==null)return '';
 const q=ejecutor(c,o),p=clamp(.5+(q.rt-c.el.attrs[o.vs])/36,.2,.85);
 return `<span class="v17-nums"><i>${t3('Sale','Sai','Comes off')} <b>${Math.round(p*100)}%</b> · ${escapeHTML(apellido(q.nom)||q.rol)}</i><i class="${o.riesgo==='alto'?'mal':o.riesgo==='medio'?'med':''}">${t3('Si falla','Se falhar','If it fails')} <b>−${Math.round(o.costo*100)}%</b> · ${t3(...RIESGO_SALIDA[o.riesgo].n)}</i></span>`;
}
// el generador entra cuando el rival viene a apretar; las fichas escritas siguen para lo demás
const _elegirSituacionV16=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 const s=_elegirSituacionV16(c,clave);
 if(c.el.m.def!=='bajo'&&S.ultimaSituacion!=='gen-salida'&&((s&&s.id==='salida')||hashS(clave+'|g')%3===0))return generarSalida(c,clave);
 return s;
};
// la devolución nombra el arquetipo: es lo que el DT aprende a reconocer
const _mostrarResultadoV16=mostrarResultadoSituacion;
mostrarResultadoSituacion=function(recien){
 _mostrarResultadoV16(recien);
 const X=tmp.sit,v=document.querySelector('#v16-cuerpo .v16-veredicto');
 if(X&&X.sit.gen&&v)v.insertAdjacentHTML('beforebegin',`<p class="v17-arq"><small>${t3('LA SITUACIÓN ERA','A SITUAÇÃO ERA','THE SITUATION WAS')}</small> ${nombreArquetipo(X.sit.A)}</p>`);
};
