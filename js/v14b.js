// v14 (segunda parte) — la temporada y el partido.
//  6. El plan cabe en una pantalla y tiene UNA decisión: el foco de la temporada.
//  7. Las jugadas clave se ven (si el jugador quiere), con sonido.
//  8. Truco: cantás antes del partido y el otro banco responde.
//  9. La temporada se cierra con una crónica, no con una lista.
// 10. Ruleta: se pueden comprar fichas con la plata del mercado.

/* ---------- 6. Foco de la temporada ---------- */
const PESO_FOCO=.07;
function beneficioFoco(adv){ return adv<0?-adv/2:Math.min(.2,1-adv); }
const _planContraV13=planContra;
planContra=function(plan,yo,el,auto){
 const p=_planContraV13(plan,yo,el,auto),f=S.focoTemporada;
 if(!f||!plan||plan!==S.plan||!plan[f])return p;
 const b=beneficioFoco(ventaja(f,plan[f],yo,el,auto).adv);
 p.mult+=PESO_FOCO*b;p.foco={fase:f,beneficio:b};return p;
};
function lecturaFoco(){
 const yo=yoParaPlan(),plan=tmp.plan&&Object.keys(tmp.plan).length?tmp.plan:planDelModelo(tmp.m),auto=autoSiJuego(tmp.f,tmp.e),TT=S.temp;
 const riv=(TT.equipos.length?TT.equipos:(TT.copa?TT.copa.equipos:[])).filter(e=>!e.yo),dest=S.rivalPlan;
 return FASES.map(F=>{
  const advs=riv.map(e=>ventaja(F.id,plan[F.id],yo,{f:e.f,e:e.e,attrs:e.attrs},auto).adv);
  const d=dest?ventaja(F.id,plan[F.id],yo,{f:dest.f,e:dest.e,attrs:dest.attrs},auto).adv:0;
  return {F,op:F.ops.find(o=>o.id===plan[F.id]),n:riv.length,pierde:advs.filter(a=>a<-.05).length,gana:advs.filter(a=>a>.05).length,dest:d,
   suma:advs.reduce((s,a)=>s+beneficioFoco(a),0)/Math.max(1,advs.length)};
 });
}
function elegirFoco(id){ S.focoTemporada=id; pintarPlan(); }
const _pintarPlanV13=pintarPlan;
pintarPlan=function(){
 _pintarPlanV13();if(tmp.paso>0)return;
 const root=$('#s-planteo');if(!root)return;
 const acciones=root.querySelector('.acciones'),pizarra=root.querySelector('.plan-pizarra'),rv=S.rivalPlan;
 if(S.focoTemporada&&!FASES.some(F=>F.id===S.focoTemporada))S.focoTemporada=null;
 const L3=lecturaFoco(),clas=rv&&rv.clasico;
 const det=document.createElement('details');det.className='v14-detalle';
 det.innerHTML=`<summary>${t3('Modo detalle: sistema, principios, salida e informe del rival','Modo detalhe: sistema, princípios e relatório','Detail mode: shape, principles, build-up and scouting')}</summary><p class="v14-nota">${t3('Opcional. Tu idea ya está definida desde la entrevista; acá la ajustás si querés.','Opcional. Sua ideia já está definida.','Optional. Your idea was set at the interview; tweak it here if you wish.')}</p>`;
 [...root.children].forEach(el=>{if(el!==acciones)det.appendChild(el);});
 const cab=document.createElement('div');cab.className='v14-plan';
 cab.innerHTML=`<p class="etq">${t3('PRETEMPORADA','PRÉ-TEMPORADA','PRE-SEASON')} · ${escapeHTML(S.compe||'')}</p>
  <h2 class="disp">${t3('Una decisión: ¿qué entrenás más este año?','Uma decisão: o que treina mais este ano?','One decision: what do you train most this year?')}</h2>
  <div class="v14-plan-grid"><div class="v14-plan-cancha"></div>
  <div><div class="huella-idea"><b>${tmp.f} · ${tEstilo(tmp.e)}</b><span>${t3('Tu idea ya está. No hay que rellenarla de nuevo.','Sua ideia já está. Não precisa preencher de novo.','Your idea is set. No need to fill it in again.')}</span></div>
   <p>${t3('El tiempo de entrenamiento no alcanza para todo. En el momento que elijas, tus desventajas se reducen a la mitad contra cada rival. Donde ya ganabas, mejorás poco: sirve más tapar lo que te cuesta.','O tempo de treino não dá para tudo. No momento escolhido, suas desvantagens caem pela metade contra cada rival.','Training time does not cover everything. In the moment you pick, your disadvantages are halved against every opponent. Where you were already ahead you gain little: fixing what hurts pays more.')}</p>
   <div class="v14-focos">${L3.map(x=>`<button class="card ${S.focoTemporada===x.F.id?'sel':''}" onclick="elegirFoco('${x.F.id}')"><small>${L(x.F.n)}</small><b>${L(x.op.n)}</b>
     <span class="v14-foco-dato"><i class="mal" style="width:${x.n?x.pierde/x.n*100:0}%"></i><i class="ok" style="width:${x.n?x.gana/x.n*100:0}%"></i></span>
     <span class="sub">${t3(`Hoy lo perdés contra <b>${x.pierde}</b> de ${x.n} rivales y lo ganás contra <b>${x.gana}</b>.`,`Hoje perde contra <b>${x.pierde}</b> de ${x.n} e ganha contra <b>${x.gana}</b>.`,`Today you lose it to <b>${x.pierde}</b> of ${x.n} opponents and win it against <b>${x.gana}</b>.`)}</span>
     ${rv?`<span class="sub ${x.dest<-.05?'mal':x.dest>.05?'ok':''}">${clas?t3('Clásico','Clássico','Derby'):escapeHTML(rv.club.n)}: ${x.dest<-.05?t3('ahí te ganan','aí ganham de você','they beat you there'):x.dest>.05?t3('ahí les ganás','aí você ganha','you beat them there'):t3('parejo','equilibrado','even')}</span>`:''}</button>`).join('')}</div>
   <p class="v14-nota" id="v14-foco-efecto">${S.focoTemporada?(()=>{const x=L3.find(y=>y.F.id===S.focoTemporada),n=x.pierde;return n?t3(`Con el foco en “${L(x.F.n)}” reducís a la mitad la desventaja contra ${n} ${n===1?'rival':'rivales'}. Contra los más difíciles equivale a jugar de local.`,`Com o foco em “${L(x.F.n)}” você reduz pela metade a desvantagem contra ${n} ${n===1?'rival':'rivais'}.`,`Focusing on “${L(x.F.n)}” halves your disadvantage against ${n} ${n===1?'opponent':'opponents'}. Against the toughest, it is worth about a home game.`):t3(`En “${L(x.F.n)}” ya no perdés contra nadie: el foco ahí suma poco. Mirá dónde te ganan.`,`Em “${L(x.F.n)}” você já não perde para ninguém: o foco aí soma pouco.`,`In “${L(x.F.n)}” nobody beats you already: focusing there adds little. Look at where you lose.`);})():t3('Elegí un foco para empezar. Podés cambiarlo cada temporada.','Escolha um foco para começar.','Pick a focus to start. You can change it every season.')}</p></div></div>`;
 root.insertBefore(cab,acciones);if(pizarra)cab.querySelector('.v14-plan-cancha').appendChild(pizarra);
 root.insertBefore(det,acciones);
 const b=acciones&&acciones.querySelector('.btn');if(b&&!S.focoTemporada){b.disabled=true;}
};

/* ---------- 7. Sonido (sintetizado, sin archivos) ---------- */
let _ctxAudio=null;
function audioCtx(){ if(S.sonido===false||typeof window==='undefined')return null; try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;_ctxAudio=_ctxAudio||new C();if(_ctxAudio.state==='suspended')_ctxAudio.resume();return _ctxAudio;}catch(e){return null;} }
function sonar(tipo){
 const c=audioCtx();if(!c)return;
 try{const t=c.currentTime,g=c.createGain();g.connect(c.destination);
  if(tipo==='pito'){const o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain();o.type='square';o.frequency.value=2350;l.frequency.value=38;lg.gain.value=120;l.connect(lg);lg.connect(o.frequency);o.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07,t+.02);g.gain.setValueAtTime(.07,t+.45);g.gain.exponentialRampToValueAtTime(.0001,t+.6);o.start(t);l.start(t);o.stop(t+.62);l.stop(t+.62);return;}
  // tribuna: ruido filtrado que sube y baja
  const dur=tipo==='gol'?2.6:tipo==='golrival'?1.4:.9,buf=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=c.createBufferSource(),f=c.createBiquadFilter();s.buffer=buf;f.type='bandpass';f.Q.value=.6;
  f.frequency.setValueAtTime(tipo==='golrival'?380:650,t);if(tipo==='gol')f.frequency.linearRampToValueAtTime(1500,t+.5);
  s.connect(f);f.connect(g);const pico=tipo==='gol'?.22:tipo==='golrival'?.07:.09;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pico,t+(tipo==='gol'?.25:.12));g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.start(t);s.stop(t+dur);
 }catch(e){}
}

/* ---------- 7. Jugadas animadas ---------- */
// Coordenadas en % de media cancha: el arco que se ataca está arriba (y=0).
// a: atacantes · d: defensores · pasos: [pelota a jugador i | punto, movimientos {i:[x,y]}]
const JUGADAS={
 tercer:{a:[[40,86],[50,60],[63,70],[60,46]],d:[[44,52],[58,54],[34,40],[66,36]],pasos:[{b:1},{b:2,m:{3:[60,26],1:[46,48]}},{b:3},{b:'tiro',x:56}]},
 pared:{a:[[44,78],[55,56],[30,60],[70,60]],d:[[48,60],[58,46],[36,42],[66,40]],pasos:[{b:1,m:{0:[46,60]}},{b:0,m:{0:[49,34]}},{b:'tiro',x:46}]},
 bandaI:{a:[[40,82],[13,58],[50,48],[64,50]],d:[[22,48],[44,34],[58,34],[76,44]],pasos:[{b:1},{b:1,m:{1:[9,20],2:[47,17],3:[60,22]}},{b:2},{b:'tiro',x:45}]},
 bandaD:{a:[[60,82],[87,58],[50,48],[36,50]],d:[[78,48],[56,34],[42,34],[24,44]],pasos:[{b:1},{b:1,m:{1:[91,20],2:[53,17],3:[40,22]}},{b:2},{b:'tiro',x:55}]},
 cambio:{a:[[18,72],[86,56],[52,50],[40,62]],d:[[26,60],[46,44],[60,42],[70,52]],pasos:[{b:1},{b:1,m:{1:[80,26],2:[55,20]}},{b:2},{b:'tiro',x:52}]},
 ruptura:{a:[[50,80],[58,52],[36,56],[68,60]],d:[[46,46],[60,46],[32,44],[72,46]],pasos:[{b:[57,24],m:{1:[56,26]}},{b:1},{b:'tiro',x:58}]},
 segunda:{a:[[50,94],[50,40],[40,52],[62,54]],d:[[50,36],[42,40],[60,42],[30,50]],pasos:[{b:[50,38]},{b:[41,48],m:{2:[41,46]}},{b:2},{b:'tiro',x:44,lejos:true}]},
 contra:{a:[[50,96],[28,70],[62,62],[44,80]],d:[[40,58],[60,50],[50,40],[74,70]],pasos:[{b:1,m:{2:[60,38],1:[30,56]}},{b:2,m:{2:[57,22]}},{b:'tiro',x:57}]},
 robo:{a:[[48,50],[56,40],[36,48],[62,56]],d:[[46,44],[58,30],[34,32],[70,40]],roba:true,pasos:[{b:0,m:{0:[46,42]}},{b:1,m:{1:[54,22]}},{b:'tiro',x:53}]}
};
function animable(e){
 const V=tmp.vivo;if(!V||V.verJugadas===false||V.rapido)return false;
 if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
 if(e.t==='gol')return true;
 // de las llegadas, solo algunas: las suficientes para leer el partido sin frenarlo
 return e.t==='llegada'&&(e.m*7+e.zona)%5===0;
}
function animarJugada(e,listo){
 const V=tmp.vivo,caja=$('#v14-jugada');if(!caja){listo();return;}
 const J=JUGADAS[e.pat]||JUGADAS.ruptura,mio=e.l===soyLado(),cols=V.cols||{a:'#E9C84A',b:'#C8102E'},cA=mio?cols.a:cols.b,cD=mio?cols.b:cols.a,gol=e.t==='gol';
 const enf=V.enf||{},cargada=mio&&(enf.cargar||[]).includes(e.pat),cerrada=!mio&&(enf.cerrar||[]).includes(e.pat);
 const ini=J.roba?[J.d[0][0],J.d[0][1]]:J.a[0];
 caja.className='v14-jugada on '+(mio?'mia':'rival');
 caja.innerHTML=`<div class="v14-jug-cab"><b>${e.m}'</b> ${mio?escapeHTML(S.club.n):escapeHTML(V.info.rival.club.n)} · ${nomPatron(e.pat)}</div>
  <div class="v14-jug-cancha"><i class="area"></i><i class="chica"></i><i class="arco"></i>
   ${J.d.map((p,i)=>`<span class="tk d" data-d="${i}" style="left:${p[0]}%;top:${p[1]}%;background:${cD}"></span>`).join('')}
   <span class="tk d por" style="left:50%;top:5%;background:${cD}"></span>
   ${J.a.map((p,i)=>`<span class="tk a" data-a="${i}" style="left:${p[0]}%;top:${p[1]}%;background:${cA}"></span>`).join('')}
   <span class="pel" style="left:${ini[0]}%;top:${ini[1]}%"></span><em class="v14-jug-grito"></em></div>
  <div class="v14-jug-pie"></div>`;
 const pel=caja.querySelector('.pel'),pos=J.a.map(p=>p.slice()),PASO=560;let k=0;
 const fin=()=>{
  const pie=caja.querySelector('.v14-jug-pie'),grito=caja.querySelector('.v14-jug-grito');
  if(gol){caja.classList.add('gol');grito.textContent=t3('¡GOL!','GOL!','GOAL!');sonar(mio?'gol':'golrival');
   pie.innerHTML=`${escapeHTML(e.txt||e.nom||'')}${cargada?`<span class="ok">${t3('Era la jugada que cargaste.','Era o lance que você carregou.','It was the move you loaded.')}</span>`:''}${cerrada?`<span class="mal">${t3('La habías mandado a cerrar y entró igual.','Você mandou fechar e entrou mesmo assim.','You asked to shut it and it still went in.')}</span>`:''}`;}
  else{sonar('uy');pie.innerHTML=mio?t3('Llegaste, pero no fue.','Chegou, mas não foi.','You got there, but no.'):t3('Te llegaron. Zafaste.','Chegaram. Escapou.','They got in. You survived.');}
  setTimeout(()=>{caja.className='v14-jugada';listo();},gol?1900:900);
 };
 const paso=()=>{
  if(S.pant!=='partido'||!document.body.contains(caja)){listo();return;}
  const p=J.pasos[k++];if(!p){fin();return;}
  Object.entries(p.m||{}).forEach(([i,xy])=>{pos[i]=xy;const el=caja.querySelector(`[data-a="${i}"]`);if(el){el.style.left=xy[0]+'%';el.style.top=xy[1]+'%';}});
  let dest;
  if(p.b==='tiro'){dest=gol?[p.x,1]:(e.m%2?[50,6]:[p.x<50?28:72,-3]);pel.classList.add('tiro');}
  else dest=Array.isArray(p.b)?p.b:pos[p.b];
  pel.style.left=dest[0]+'%';pel.style.top=dest[1]+'%';
  setTimeout(paso,p.b==='tiro'?430:PASO);
 };
 setTimeout(paso,380);
}
// el reloj se detiene mientras se ve la jugada; el marcador cambia cuando la pelota entra
correrVivo=function(evs,desde,hasta,fin){
 const V=tmp.vivo;let m=desde-1;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(desde===1||desde===46)sonar('pito');
 const aplicar=e=>{
  V.ev.push(e);const yoLado=soyLado();
  if(e.l==='a')V.zonasA[e.zona]+=e.t==='gol'?3:1;else V.zonasB[e.zona]+=e.t==='gol'?3:1;
  if(e.t==='gol'){V.marc[e.l==='a'?0:1]++;V.ultZona={z:e.l===yoLado?e.zona:espejoZona(e.zona),txt:'⚽',c:'#F4F7F0'};
   const mk=$('#vvM');if(mk){mk.textContent=`${V.marc[0]} – ${V.marc[1]}`;mk.classList.remove('gol');void mk.offsetWidth;mk.classList.add('gol');}pintarFeedVivo();}
 };
 const paso=()=>{
  if(S.pant!=='partido'||tmp.vivo!==V)return;
  if(V.pausa){setTimeout(paso,80);return;}
  m++;V.min=m;
  const cola=evs.filter(e=>e.m===m);
  const mn=$('#vvMin'),b=$('#vvBar');if(mn)mn.textContent=m+"'";if(b)b.style.width=(m/90*100)+'%';
  const seguir=()=>{
   if(m%3===0||cola.length){const z=$('#vvZonas');if(z)z.innerHTML=zonasVivo();const st=$('#vvStats');if(st)st.innerHTML=statsVivo();}
   if(m>=hasta){sonar('pito');fin();return;}
   setTimeout(paso,reduce?5:(V.rapido?25:(V.info.historico?260:180)));
  };
  const uno=i=>{
   if(i>=cola.length){seguir();return;}
   const e=cola[i];
   if(animable(e))animarJugada(e,()=>{aplicar(e);uno(i+1);});else{aplicar(e);uno(i+1);}
  };
  uno(0);
 };
 paso();
};
const _pintarVivoV13=pintarVivo;
pintarVivo=function(){
 const V=tmp.vivo;if(V.verJugadas==null)V.verJugadas=S.verJugadas!==false;
 _pintarVivoV13();
 const esc=$('#s-partido .banco-escena');if(esc)esc.insertAdjacentHTML('beforeend','<div id="v14-jugada" class="v14-jugada"></div>');
 const ctl=$('#s-partido .controles-banco');
 if(ctl)ctl.insertAdjacentHTML('beforeend',`<button class="btn sec compacto" onclick="tmp.vivo.verJugadas=!tmp.vivo.verJugadas;S.verJugadas=tmp.vivo.verJugadas;this.textContent=(tmp.vivo.verJugadas?'▶ ':'■ ')+'${t3('Jugadas','Lances','Plays')}'">${V.verJugadas?'▶ ':'■ '}${t3('Jugadas','Lances','Plays')}</button><button class="btn sec compacto" aria-label="${t3('Sonido','Som','Sound')}" onclick="S.sonido=S.sonido===false;this.textContent=S.sonido===false?'🔇':'🔊'">${S.sonido===false?'🔇':'🔊'}</button>`);
};

/* ---------- 8. Truco: cantar antes del partido ---------- */
function diferenciaTruco(){ const V=tmp.vivo,rv=V.info.rival; return (S.club.niv-rv.club.niv)*.25+((V.an0&&V.an0.ventaja)||0); }
function cantarTruco(){
 const V=tmp.vivo;if(!V||V.truco)return;
 const perfil=perfilPicardia(V.info.rival).nombre,dif=diferenciaTruco();
 const resp=perfil==='Calculador'?(dif>.15?'noquiero':'quiero'):perfil==='Orgulloso'?(V.info.rival.club.niv>=S.club.niv?'retruco':'quiero'):'quiero';
 V.truco={nivel:resp==='noquiero'?1:2,resp,farol:dif<-.15,pendiente:resp==='retruco'};
 if(resp==='noquiero'){S.vars.ves=clamp(S.vars.ves+2,0,100);cabecera();}
 sonar('uy');pintarPrevia();
}
function responderRetruco(quiero){
 const V=tmp.vivo,T2=V&&V.truco;if(!T2||!T2.pendiente)return;
 T2.pendiente=false;
 if(quiero){T2.nivel=3;T2.resp='retruco-quiero';}
 else{T2.nivel=1;T2.resp='retruco-noquiero';S.vars.ves=clamp(S.vars.ves-3,0,100);cabecera();}
 pintarPrevia();
}
function panelTruco(){
 const V=tmp.vivo,T2=V.truco,rv=V.info.rival;
 const cab=`<b>${t3('TRUCO','TRUCO','TRUCO')} · ${t3('subí la apuesta','aumente a aposta','raise the stakes')}</b>`;
 if(!T2)return `<div class="gd-construccion v14-truco">${cab}<p>${t3('Declarás en público que este partido lo ganás. Si ganás, la tribuna y la directiva lo festejan el doble; si perdés, lo pagás el doble. El otro banco puede achicarse, aceptar o redoblar.','Declara em público que ganha este jogo. Se ganhar, torcida e diretoria festejam em dobro; se perder, paga em dobro.','You say in public that you will win this one. Win, and fans and board celebrate double; lose, and you pay double. The other bench can back down, accept or raise.')}</p><button class="btn sec" onclick="cantarTruco()">${t3('¡Truco!','Truco!','Truco!')}</button> <span class="mini">${t3('Opcional: si no cantás, el partido vale lo de siempre.','Opcional.','Optional: say nothing and the match is worth the usual.')}</span></div>`;
 const txt={noquiero:t3(`“No quiero.” ${rv.club.n} se achica: van a esperar atrás. Tu vestuario se agranda (+2). El partido vale lo de siempre.`,`“Não quero.” O ${rv.club.n} recua. Seu vestiário cresce (+2).`,`“No thanks.” ${rv.club.n} back down and will sit deep. Your dressing room grows (+2). Usual stakes.`),
  quiero:t3(`“Quiero.” ${rv.club.n} acepta. El partido vale doble.`,`“Quero.” O ${rv.club.n} aceita. Vale em dobro.`,`“You're on.” ${rv.club.n} accept. Double stakes.`),
  retruco:t3(`“¡Quiero retruco!” ${rv.club.n} redobla: van a salir a buscarte arriba. ¿Aceptás que valga triple?`,`“Retruco!” O ${rv.club.n} dobra de novo. Aceita valer triplo?`,`“Re-raise!” ${rv.club.n} raise again and will press you high. Triple stakes?`),
  'retruco-quiero':t3('Aceptaste el retruco. El partido vale triple.','Aceitou o retruco. Vale triplo.','You took the re-raise. Triple stakes.'),
  'retruco-noquiero':t3('Te bajaste del retruco. El plantel lo vio (vestuario −3). El partido vale lo de siempre.','Você recuou. O elenco viu (vestiário −3).','You backed down from the re-raise. The squad saw it (dressing room −3). Usual stakes.')}[T2.resp];
 return `<div class="gd-construccion v14-truco cantado">${cab}<p>${txt}</p>${T2.farol&&T2.nivel>1?`<p class="mini">${t3('Cantaste siendo el más débil: si ganás igual, la tribuna no se olvida más.','Cantou sendo o mais fraco: se ganhar, a torcida não esquece.','You called it as the underdog: win anyway and the fans never forget.')}</p>`:''}
  ${T2.pendiente?`<button class="btn" onclick="responderRetruco(true)">${t3('Quiero (vale triple)','Quero (vale triplo)','I accept (triple)')}</button> <button class="btn sec" onclick="responderRetruco(false)">${t3('No quiero','Não quero','No thanks')}</button>`:`<span class="v14-apuesta">×${T2.nivel}</span>`}</div>`;
}
const _pintarPreviaV13=pintarPrevia;
pintarPrevia=function(){
 _pintarPreviaV13();
 const ops=$('#s-partido .pv-ops');if(!ops)return;
 document.querySelectorAll('#s-partido details.gd-construccion[open]').forEach(d=>{d.open=false;});
 const ancla=ops.previousElementSibling&&/^H\d$/.test(ops.previousElementSibling.tagName)?ops.previousElementSibling:ops;
 ancla.insertAdjacentHTML('beforebegin',panelTruco());
 const pend=tmp.vivo.truco&&tmp.vivo.truco.pendiente;
 if(pend)document.querySelectorAll('#s-partido > .acciones .btn').forEach(b=>b.disabled=true);
};
const _equiposVivoV13=equiposVivo;
equiposVivo=function(){
 const r=_equiposVivoV13(),V=tmp.vivo,T2=V.truco;if(!T2)return r;
 const rv=V.info.soyA?r.B:r.A;
 if(rv&&rv.modelo){if(T2.resp==='noquiero')rv.modelo.def='bajo';if(T2.resp==='retruco-quiero')rv.modelo.def='alto';}
 return r;
};
const _finVivoV13=finVivo;
finVivo=function(){
 _finVivoV13();
 const V=tmp.vivo,T2=V&&V.truco,caja=$('#vvPanel .vf-analisis');
 if(!T2||T2.nivel<2||T2.cobrado||!V.res||!caja)return;
 T2.cobrado=true;
 const yo=soyLado(),gf=yo==='a'?V.res.ga:V.res.gb,gc=yo==='a'?V.res.gb:V.res.ga,pen=V.res.pen;
 const gano=pen?((pen[0]>pen[1])===(yo==='a')):gf>gc,emp=gf===gc&&!pen,k=T2.nivel-1;
 let dh=0,dd=0,txt;
 if(emp)txt=t3('Truco: quedó en tablas. Nadie cobra.','Truco: empate. Ninguém cobra.','Truco: honours even. Nobody collects.');
 else if(gano){dh=2*k+(T2.farol?2:0);dd=k;txt=t3(`Truco ganado (×${T2.nivel}): lo dijiste y lo cumpliste.`,`Truco ganho (×${T2.nivel}).`,`Truco won (×${T2.nivel}): you said it and you delivered.`);}
 else{dh=-2*k;dd=-k;txt=t3(`Truco perdido (×${T2.nivel}): hablaste antes de tiempo.`,`Truco perdido (×${T2.nivel}).`,`Truco lost (×${T2.nivel}): you spoke too soon.`);}
 S.vars.hin=clamp(S.vars.hin+dh,0,100);S.vars.dir=clamp(S.vars.dir+dd,0,100);cabecera();
 caja.insertAdjacentHTML('beforeend',`<div class="${gano?'ok':emp?'':'mal'}">${txt}${dh||dd?` ${T('hinchada')} ${sg(dh)} · ${T('directiva')} ${sg(dd)}`:''}</div>`);
};

/* ---------- 9. La crónica de la temporada ---------- */
function cronicaTemporada(){
 const c=S.calc,TT=S.temp,f=c.fig||{},n=escapeHTML(S.nombre||'DT'),club=escapeHTML(S.club.n),P=[];
 const campeon=c.titulos&&c.titulos.length,mejor=c.pos&&c.exp&&c.pos<=c.exp-2,peor=c.pos&&c.exp&&c.pos>=c.exp+3;
 const titular=campeon?t3(`${club} campeón: el año de ${n}`,`${club} campeão: o ano de ${n}`,`${club} champions: the year of ${n}`)
  :mejor?t3(`${club} terminó más arriba de lo que nadie esperaba`,`${club} acabou acima do esperado`,`${club} finished higher than anyone expected`)
  :peor?t3(`Una temporada que deja deudas en ${club}`,`Uma temporada que deixa dívidas`,`A season that leaves debts at ${club}`)
  :t3(`${club}: un año para entender al equipo de ${n}`,`${club}: um ano para entender o time`,`${club}: a year to understand ${n}'s team`);
 if(c.pos)P.push(t3(`Terminó ${c.pos}º de ${c.equipos}; la directiva esperaba el ${c.exp}º puesto.`,`Terminou em ${c.pos}º de ${c.equipos}; a diretoria esperava o ${c.exp}º.`,`They finished ${c.pos} of ${c.equipos}; the board expected ${c.exp}.`));
 const cl=(TT.mis||[]).filter(x=>x.clasico);
 if(cl.length){const g=cl.filter(x=>x.gf>x.gc).length,p=cl.filter(x=>x.gf<x.gc).length;
  P.push(t3(`En el clásico: ${cl.map(x=>`${x.gf}-${x.gc}`).join(' y ')}. ${g>p?'La tribuna eso no lo olvida.':p>g?'Es la espina del año.':'Quedó en deuda.'}`,`No clássico: ${cl.map(x=>`${x.gf}-${x.gc}`).join(' e ')}.`,`In the derby: ${cl.map(x=>`${x.gf}-${x.gc}`).join(' and ')}. ${g>p?'The fans will not forget it.':p>g?'It is the thorn of the year.':'Unfinished business.'}`));}
 const pats={};(TT.mis||[]).forEach(x=>(x.pats||[]).forEach(([p])=>{pats[p]=(pats[p]||0)+1;}));
 const sello=Object.entries(pats).sort((a,b)=>b[1]-a[1])[0];
 if(sello&&sello[1]>=3)P.push(t3(`El equipo tuvo un sello: ${sello[1]} goles de “${nomPatron(sello[0])}”.`,`O time teve uma marca: ${sello[1]} gols de “${nomPatron(sello[0])}”.`,`The team had a signature: ${sello[1]} goals from “${nomPatron(sello[0])}”.`));
 if(f.gol)P.push(t3(`${escapeHTML(f.gol.nom)} fue el goleador con ${f.gol.st.g}.`,`${escapeHTML(f.gol.nom)} foi o artilheiro com ${f.gol.st.g}.`,`${escapeHTML(f.gol.nom)} was top scorer with ${f.gol.st.g}.`));
 const pibe=S.plantel.filter(j=>j.ed<=21&&j.st&&j.st.pj>=6).sort((a,b)=>b.st.pj-a.st.pj)[0];
 if(pibe)P.push(t3(`${escapeHTML(pibe.nom)}, de ${pibe.ed} años, jugó ${pibe.st.pj} partidos: hay futuro.`,`${escapeHTML(pibe.nom)}, ${pibe.ed} anos, jogou ${pibe.st.pj} partidas.`,`${escapeHTML(pibe.nom)}, ${pibe.ed}, played ${pibe.st.pj} games: there is a future.`));
 const dia=(S.diarioDT||[]).filter(d=>d.t===S.temporada),charla=dia.filter(d=>d.tipo==='charla'&&d.texto&&d.texto.trim().length>12).sort((a,b)=>Math.abs(b.efecto||0)-Math.abs(a.efecto||0))[0];
 const cita=charla?`<blockquote>“${escapeHTML(charla.texto.trim().slice(0,140))}${charla.texto.trim().length>140?'…':''}”<cite>${t3(`${n}, antes de jugar contra ${escapeHTML(charla.rival||'')}`,`${n}, antes de enfrentar ${escapeHTML(charla.rival||'')}`,`${n}, before facing ${escapeHTML(charla.rival||'')}`)} · ${(charla.efecto||0)>0?t3('les llegó','chegou neles','it landed'):(charla.efecto||0)<0?t3('no les llegó','não chegou','it did not land'):t3('pasó sin pena ni gloria','passou batido','it passed unnoticed')}</cite></blockquote>`:'';
 const cass=dia.filter(d=>d.tipo==='prensa'&&d.cassette).length;
 if(cass>=2)P.push(t3(`En las conferencias repitió el cassette ${cass} veces: la prensa ya le conoce las frases.`,`Nas coletivas repetiu o discurso pronto ${cass} vezes.`,`At press conferences he reached for the stock answer ${cass} times: the press knows the lines by now.`));
 const d=S.dt||{},rech=(S.rechazos||[]);
 if((campeon||mejor)&&d.origen==='estudio'&&(S.titulos||[]).length<=1)P.push(t3('Ya nadie pregunta dónde jugó.','Ninguém mais pergunta onde jogou.','Nobody asks where he played any more.'));
 if((campeon||mejor)&&d.rango==='joven'&&(S.titulos||[]).length<=1)P.push(t3('La edad dejó de ser tema.','A idade deixou de ser assunto.','His age is no longer a talking point.'));
 if((campeon||mejor)&&rech.length)P.push(t3(`En ${escapeHTML(rech[rech.length-1].club)} recuerdan que le dijeron que no.`,`No ${escapeHTML(rech[rech.length-1].club)} lembram que disseram não.`,`At ${escapeHTML(rech[rech.length-1].club)} they remember turning him down.`));
 return `<article class="v14-cronica"><p class="etq">${t3('LA CRÓNICA','A CRÔNICA','THE CHRONICLE')} · ${t3('Temporada','Temporada','Season')} ${S.temporada}</p><h3>${titular}</h3><p>${P.join(' ')}</p>${cita}</article>`;
}
const _pintarReporteV13=pintarReporte;
pintarReporte=function(){
 _pintarReporteV13();
 const h=$('#s-resolucion h2');if(!h)return;
 try{h.insertAdjacentHTML('afterend',cronicaTemporada());}catch(e){}
};

/* ---------- 10. Ruleta: fichas extra con la plata del mercado ---------- */
function fichasExtra(){ const x=tmp.fx; return x&&x.t===S.temporada?x.n:0; }
function costoFicha(){ return 10+8*fichasExtra(); }
const _fichasUsadasV13=fichasUsadas;
fichasUsadas=function(){ return _fichasUsadasV13()-fichasExtra(); };
function comprarFicha(){
 if(tmp.girada||S.esSeleccion||fichasExtra()>=3||S.presupuesto<costoFicha())return;
 S.presupuesto-=costoFicha();tmp.fx={t:S.temporada,n:fichasExtra()+1};cabecera();pintarRuleta();
}
const _abrirRuletaV13=abrirRuleta;
abrirRuleta=function(){ tmp.fx=null; _abrirRuletaV13(); };
const _pintarRuletaV13=pintarRuleta;
pintarRuleta=function(){
 _pintarRuletaV13();
 const r=$('#s-ruleta .fichas-restan');if(!r||S.esSeleccion)return;
 const n=fichasExtra(),c=costoFicha(),puede=!tmp.girada&&n<3&&S.presupuesto>=c;
 r.insertAdjacentHTML('afterend',`<div class="v14-fichas"><button class="btn sec compacto" ${puede?'':'disabled'} onclick="comprarFicha()">+1 ${t3('ficha','ficha','chip')} · ${c} ${t3('de presupuesto','do orçamento','of budget')}</button><span class="mini">${t3(`Te quedan ${S.presupuesto}. Cada ficha extra sale más cara, y esa plata no vuelve aunque la bocha caiga en otro lado.`,`Restam ${S.presupuesto}. Cada ficha extra custa mais, e esse dinheiro não volta.`,`You have ${S.presupuesto} left. Each extra chip costs more, and that money is gone wherever the ball lands.`)}${n?` · ${t3('Compraste','Comprou','Bought')} ${n}`:''}</span></div>`);
};

/* ---------- Datos: el clásico de Sevilla es el Betis ---------- */
(function(){
 const esp=LIGAS['España'];if(!esp||esp.clubes.some(c=>c.n==='Real Betis'))return;
 const betis={n:'Real Betis',niv:3,c:['#0B8A4B','#FFFFFF']};
 esp.clubes.push(betis);CLUBES.push(Object.assign({p:'España'},betis));
 if(typeof CLUB_INFO!=='undefined'){
  CLUB_INFO['Real Betis']=Object.assign({f:1907,est:'Benito Villamarín',ap:'Béticos'},CLUB_INFO['Real Betis']||{},{cla:'Sevilla'});
  if(CLUB_INFO.Sevilla)CLUB_INFO.Sevilla.cla='Real Betis';
 }
})();
