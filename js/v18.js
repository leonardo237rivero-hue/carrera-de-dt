// v18 — Segunda familia del banco: la presión (el espejo de la salida), más ritmo y limpieza.
// Cómo sale ESE rival (centrales, pivotes, arquero con o sin pies, corto o largo) × con cuántos apretás vos.
// La decisión de fondo es siempre la misma: qué pase les dejás y cuál les tapás.

const RIESGO_PRESION={alto:['Alto: te saltan la presión y corren contra tu defensa','Alto: superam a pressão e correm contra sua defesa','High: they beat the press and run at your defence'],medio:['Medio: salen, pero llegás a replegar','Médio: saem, mas dá para recuar','Medium: they get out, but you can recover'],bajo:['Bajo: no robás, pero quedás armado','Baixo: não rouba, mas fica organizado','Low: no regain, but you keep your shape']};
// B = {cb: sus centrales, piv: sus pivotes, pies: arquero que juega, corto: salen jugando, n: tus hombres arriba, dif}
const SOLUCIONES_PRESION=[
 {id:'trampaBanda',p:'gatillo',r:'medio',pr:.07,g:/^E|LT/,vs:1,t:['Dejarles el pase al lateral y saltar todos cuando reciba','Deixar o passe ao lateral e saltar quando receber','Leave the pass to the full-back, all jump when he receives'],
  fit:B=>B.corto?(B.dif<0?.95:.85):.45,si:['Contra la raya tiene media cancha menos: ahí lo encerrás con los que tengas.','Contra a linha ele tem meio campo a menos.','Against the touchline he has half the pitch: you trap him with whoever you have.'],no:['No salen jugando: el lateral ni la toca, la tiran larga antes.','Não saem jogando: lançam antes.','They do not play out: the full-back never sees it, they go long first.'],
  mv:{1:[12,74],3:[24,64],0:[40,82]},b:[[38,84],[8,76],[12,74]]},
 {id:'trampaCinco',p:'gatillo',r:'alto',pr:.08,g:/MC$|MCD|MCO/,vs:1,t:['Dejarles el pase al 5 y saltarle de espaldas','Deixar o passe ao 5 e saltar nele de costas','Leave the pass into their 5 and jump him from behind'],
  fit:B=>B.corto&&B.piv===1?.9:B.piv===2?.35:.45,si:['Un solo 5 recibe de espaldas: si llegás con dos, es robo frente al arco.','Um só 5 recebe de costas: com dois é roubo na frente do gol.','A lone 5 receives back to goal: arrive with two and it is a regain in front of goal.'],no:['Con doble 5 uno recibe y el otro queda de cara: te sacan la pelota por ahí.','Com dois volantes um recebe e o outro fica de frente.','With a double pivot one receives and the other faces play: they escape through him.'],
  mv:{3:[48,66],4:[54,66]},b:[[38,84],[50,70],[49,67]]},
 {id:'trampaArquero',p:'gatillo',r:'medio',pr:.08,g:/DC|SD/,vs:1,t:['Taparles todo y obligarlos a volver al arquero','Fechar tudo e obrigar a voltar ao goleiro','Shut every lane and force it back to the keeper'],
  fit:B=>!B.pies?.95:.35,si:['Ese arquero no quiere la pelota: cada pase atrás es un pelotazo regalado o un error.','Esse goleiro não quer a bola.','That keeper does not want the ball: every back pass is a gift or a mistake.'],no:['Su arquero juega: le das un hombre más y te desarma.','O goleiro deles joga: vira um homem a mais.','Their keeper can play: you hand them an extra man and he picks you apart.'],
  mv:{0:[50,87],1:[36,80],2:[64,80]},b:[[38,84],[50,94],[50,89]]},
 {id:'hombreAHombre',p:'gatillo',r:'alto',pr:.08,g:/MC/,vs:1,t:['Hombre a hombre en toda la cancha','Homem a homem no campo todo','Man for man all over the pitch'],
  fit:B=>B.corto&&B.dif>=0?.7:.3,si:['Tenés gente para emparejar: sin pase libre, alguien se equivoca.','Tem gente para igualar: sem passe livre, alguém erra.','You have the numbers to match up: with no free pass, someone errs.'],no:['Arriba sos menos: te queda uno suelto y atrás no hay nadie.','Em cima você tem menos: sobra um e atrás não há ninguém.','You are short up front: one of theirs is free and nobody is behind.'],
  mv:{0:[40,82],1:[10,74],2:[90,74],3:[48,68],4:[62,82]},b:[[38,84],[62,84],[62,83]]},
 {id:'saltoLateral',p:'dosuno',r:'medio',pr:.06,g:/LT/,vs:0,t:['Que el lateral salte a su carrilero y la línea se corra','O lateral salta no ala deles e a linha desliza','Full-back jumps to their wing-back, back line slides'],
  fit:B=>B.cb===3?.85:.45,si:['Con tres centrales el libre es el carrilero: lo toma tu lateral y los de arriba aprietan a los tres.','Com três zagueiros o livre é o ala.','Against a back three the free man is the wing-back: your full-back takes him and the front line presses the three.'],no:['Salen con dos: el lateral salta lejos y deja su espalda.','Saem com dois: o lateral salta longe.','They build with two: the full-back jumps too far and leaves space behind.'],
  mv:{6:[10,70]},b:[[38,84],[8,76],[10,72]]},
 {id:'trampaCentral',p:'entrelineas',r:'alto',pr:.07,g:/MC$|MCD/,vs:1,t:['Abrirles el pase por adentro y cerrarlo con tres','Abrir o passe por dentro e fechar com três','Show them inside and close on it with three'],
  fit:B=>B.corto&&B.piv===2?.85:.4,si:['Con doble 5 quieren jugar por adentro: los invitás y ahí están tus tres.','Com dois volantes querem jogar por dentro.','With a double pivot they want to play inside: you invite it and your three are waiting.'],no:['Les abrís el medio y no tenés con quién cerrarlo.','Abre o meio e não tem com quem fechar.','You open the middle and have nobody to close it.'],
  mv:{3:[46,64],4:[54,64],5:[50,60]},b:[[62,84],[50,70],[50,65]]},
 {id:'esperarGatillo',p:'gatillo',r:'bajo',pr:.05,g:/MC/,vs:1,t:['Esperar en bloque medio y saltar con el pase atrás o el mal control','Esperar em bloco médio e saltar no passe para trás','Wait in a mid block, jump on the back pass or bad touch'],
  fit:B=>B.dif<0?.8:.55,si:['Sos menos arriba: no se va siempre, se va cuando ellos se equivocan.','Você tem menos em cima: vai quando eles erram.','You are outnumbered up front: you do not always go, you go when they slip.'],no:['Tenías gente para ir a buscar y les regalaste la salida.','Tinha gente para pressionar e deu a saída.','You had the numbers to go and gave them the build-up for free.'],
  mv:{0:[50,66],1:[26,60],2:[74,60]},b:[[38,84],[62,84],[40,82]]},
 {id:'soloSaque',p:'gatillo',r:'bajo',pr:.04,g:/DC|SD|^E/,vs:1,t:['Apretar solo en los saques de arco','Pressionar só nos tiros de meta','Press only on goal kicks'],
  fit:B=>B.corto?.5:.3,si:['Es el único momento en que sabés dónde están todos.','É o único momento em que sabe onde estão todos.','It is the one moment you know where everyone is.'],no:['No sacan corto: no hay a quién apretar.','Não saem curto.','They do not go short: nobody to press.'],
  mv:{0:[44,84],1:[30,80],2:[70,80]},b:[[50,94],[38,84],[41,83]]},
 {id:'ganarSegunda',p:'segunda',r:'bajo',pr:.07,g:/DFC|MCD/,vs:0,t:['No ir: esperar el pelotazo y ganar la segunda pelota','Não ir: esperar a bola longa e ganhar a segunda','Do not go: wait for the long ball and win the second'],
  fit:B=>!B.corto?.95:.2,si:['La tiran larga igual: correr a los centrales es cansarte. El partido está donde cae.','Lançam de qualquer jeito: o jogo é onde cai.','They go long regardless: chasing centre-backs just tires you. The game is where it lands.'],no:['Salen jugando cómodos y llegan armados a tu campo.','Saem jogando à vontade.','They play out in comfort and arrive organised in your half.'],
  mv:{5:[50,40],3:[42,48]},b:[[50,94],[50,44],[50,41]]},
 {id:'dosAlExtremo',p:'dosuno',r:'medio',pr:.05,g:/LT|^E/,vs:0,t:['Dejar libre a su extremo y caerle de a dos','Deixar o ponta livre e cair em dois','Leave their winger free, then double up on him'],
  fit:B=>B.corto&&B.cb===2?.6:.4,si:['El pase largo al extremo es lento: llegás con dos antes de que la controle.','O passe longo ao ponta é lento.','The long pass to the winger is slow: two of you arrive before he controls it.'],no:['Si el pase sale bien, quedaste dos contra uno del otro lado.','Se o passe sai bem, sobra dois contra um do outro lado.','If the pass is good you are two v one on the other side.'],
  mv:{6:[12,62],1:[16,70]},b:[[38,84],[14,66],[14,65]]}
];
function arquetipoPresion(c){
 const f=String(c.el.f||'4-4-2').split('-').map(Number),cb=f[0]===3||f[0]===5?3:2,piv=f.length>=4?clamp(f[1],1,2):f[1]===3||f[1]===5?1:2;
 const miF=String(c.yo.f||'4-4-2').split('-').map(Number),n=clamp(miF[miF.length-1]||2,1,3);
 return {cb,piv,n,dif:n-cb,pies:c.el.attrs[1]>=58,corto:c.el.m.ofe!=='directo'};
}
function nombreArquetipoPresion(B){
 return `${B.cb} ${t3('centrales','zagueiros','centre-backs')} · ${B.piv===2?t3('doble 5','dois volantes','double pivot'):t3('un 5','um volante','single pivot')} · ${B.pies?t3('arquero que juega','goleiro que joga','keeper who plays'):t3('arquero sin pies','goleiro sem pés','keeper poor on the ball')} · ${B.corto?t3('salen jugando','saem jogando','they play out'):t3('la tiran larga','lançam longo','they go long')}`;
}
function generarPresion(c,clave){
 const B=arquetipoPresion(c),h=hashS(clave+'|genp');
 const mi=[[50,74,'9'],[22,68,'11'],[78,68,'7'],[40,58,'8'],[60,58,'10'],[50,46,'5'],[14,50,'3'],[86,50,'4']];
 const el=[[50,94]].concat(B.cb===3?[[28,84],[50,86],[72,84]]:[[38,84],[62,84]],[[8,76],[92,76]],B.piv===2?[[42,70],[58,70]]:[[50,70]],[[50,56],[14,62]]);
 const todas=SOLUCIONES_PRESION.map(s=>({s,f:s.fit(B)})).sort((a,b)=>b.f-a.f);
 const mejores=todas.filter(x=>x.f>=.8),buena=mejores[h%mejores.length]||todas[0],sel=[buena],libre=x=>!sel.includes(x);
 const media=todas.filter(x=>libre(x)&&x.f>=.45&&x.f<.8);if(media.length)sel.push(media[(h>>>2)%media.length]);
 const mala=todas.filter(x=>libre(x)&&x.f<.45);if(mala.length)sel.push(mala[(h>>>4)%mala.length]);
 const segura=todas.filter(x=>libre(x)&&x.s.r==='bajo'&&x.f<.8)[0]||todas.filter(libre)[0];if(segura)sel.push(segura);
 const ops=sel.map((x,i)=>[hashS(clave+'|po'+i),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).map(({s,f})=>({sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:s.mv,b:s.b,
  riesgo:s.r,rn:RIESGO_PRESION[s.r],premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f}));
 const rel=()=>[t3(`Salen con ${B.cb} centrales y ${B.piv===2?'doble 5':'un solo 5'}.`,`Saem com ${B.cb} zagueiros e ${B.piv===2?'dois volantes':'um volante'}.`,`They build with ${B.cb} centre-backs and ${B.piv===2?'a double pivot':'a single pivot'}.`),
  B.pies?t3('El arquero juega bien con los pies.','O goleiro joga bem com os pés.','The keeper is good on the ball.'):t3('El arquero no quiere la pelota.','O goleiro não quer a bola.','The keeper does not want the ball.'),
  B.corto?t3('No la revientan nunca.','Nunca dão chutão.','They never just clear it.'):t3('A la primera duda, la tiran larga.','Na primeira dúvida, lançam longo.','At the first doubt they go long.'),
  t3(`Nosotros tenemos ${B.n} arriba.`,`Nós temos ${B.n} em cima.`,`We have ${B.n} up front.`)].join(' ');
 return {id:'gen-presion',gen:true,A:B,nombreA:nombreArquetipoPresion(B),p:buena.s.p,cuando:()=>true,rel,
  pista:['Elegí qué pase les dejás. Todo lo demás se lo tapás.','Escolha que passe você deixa. O resto você fecha.','Choose which pass you leave them. Shut everything else.'],mi,el,pel:B.cb===3?[28,84]:[38,84],ops};
}
const _elegirSituacionV17=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 const s=_elegirSituacionV17(c,clave);
 if(s&&s.gen)return s;
 if(c.yo.m.def!=='bajo'&&S.ultimaSituacion!=='gen-presion'&&((s&&s.id==='presion')||hashS(clave+'|gp')%3===0))return generarPresion(c,clave);
 return s;
};
// nombre del arquetipo en la devolución, para cualquier familia generada
nombreArquetipo=(function(prev){return function(A){return A&&A.cb!=null&&A.piv!=null?nombreArquetipoPresion(A):prev(A);};})(nombreArquetipo);

/* ---------- ritmo: con el generador los problemas ya no se repiten, así que aparecen más seguido ---------- */
tocaSituacion=function(jor){
 if(S.esSeleccion||jor.t!=='liga'||jor.visto||jor.sit!==undefined)return false;
 const r=typeof ritmoCarrera==='function'?ritmoCarrera():'esencial';
 if(r==='resumen'||S.ritmo==='rapido')return false;
 return r==='completo'?true:jor.k%2===0;
};
// el ticker dice qué te dejó la orden en ese partido
const _cerrarSituacionV17=cerrarSituacion;
cerrarSituacion=function(){
 const X=tmp.sit,r=X&&X.res;
 _cerrarSituacionV17();
 if(r&&X.jor){const pct=Math.round((r.mult-1)*100);X.jor.aviso=`${r.lectura===1?'✓':r.lectura===.5?'≈':'✗'} ${t3(...r.op.t)} · ${r.sale?t3('salió','saiu','came off'):t3('no salió','não saiu','did not come off')} · ${pct>0?'+':''}${pct}%`;
  const f=$('#tkFecha');if(f&&typeof tituloJornada==='function')f.innerHTML=tituloJornada(X.jor)+`<span class="tk-aviso">${X.jor.aviso}</span>`;}
};

/* ---------- un solo lugar para elegir el ritmo: el plan (y la previa). Sale del inicio. ---------- */
const _pintarIdentidadV17=pintarIdentidad;
pintarIdentidad=function(){
 _pintarIdentidadV17();
 const secs=document.querySelectorAll('#s-identidad .v14-form section');
 if(secs.length>=3&&typeof selectorRitmo==='function')secs[2].remove();
};
