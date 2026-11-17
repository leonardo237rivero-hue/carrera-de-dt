// v20 — El dial de riesgo: cuántos atacan y cuántos quedan vigilando.
// Una sola palanca, a la vista toda la temporada. No sube ni baja tu nivel: abre o cierra el partido,
// y cuánto te cuesta abrirlo depende de cómo ataca ESE rival. Contra uno que sale de contra, ir con seis
// es regalarle el partido; contra uno que no sabe correr, es la forma de ganarlo.
// (Formas de la defensa de la pérdida: ver el documento de investigación táctica.)
const POSTURAS={
 segura:{n:['Segura','Segura','Safe'],at:4,vig:['3-3','3-3','3-3'],yo:-.15,el:-.22,elAlt:-.12,d:['Atacan 4, vigilan 6. Pocos goles en los dos arcos.','Atacam 4, vigiam 6. Poucos gols nas duas áreas.','4 attack, 6 cover. Few goals at either end.']},
 equilibrada:{n:['Equilibrada','Equilibrada','Balanced'],at:5,vig:['3-2','3-2','3-2'],yo:0,el:0,elAlt:0,d:['Atacan 5, vigilan 5. Lo normal.','Atacam 5, vigiam 5. O normal.','5 attack, 5 cover. The default.']},
 ambiciosa:{n:['Ambiciosa','Ambiciosa','Ambitious'],at:6,vig:['2-2','2-2','2-2'],yo:.18,el:.10,elAlt:.24,d:['Atacan 6, vigilan 4. Más goles tuyos, y de ellos si saben correr.','Atacam 6, vigiam 4. Mais gols seus, e deles se sabem correr.','6 attack, 4 cover. More goals for you, and for them if they can run.']},
 todo:{n:['Todo o nada','Tudo ou nada','All or nothing'],at:7,vig:['2-1','2-1','2-1'],yo:.32,el:.22,elAlt:.45,d:['Atacan 7, vigilan 3. Partido roto.','Atacam 7, vigiam 3. Jogo aberto.','7 attack, 3 cover. A broken game.']}
};
function posturaActual(){ return POSTURAS[S.postura]?S.postura:'equilibrada'; }
// el rival que castiga cada postura: la contra castiga al que se abre; el que tiene la pelota, al que se cierra
function castigaRival(rival,id){
 const m=rival.modelo||modeloDeEstilo(rival.e);
 if(id==='segura')return m.ofe==='posicional';
 return m.tofe==='contra';
}
function factoresPostura(rival,id){
 const P=POSTURAS[id||posturaActual()];
 return {yo:1+P.yo,el:1+(castigaRival(rival,id||posturaActual())?P.elAlt:P.el)};
}
const _jugarPartidoV19=jugarPartido;
jugarPartido=function(A,B,neutral,knock){
 const mio=A&&A.yo?A:B&&B.yo?B:null,id=posturaActual();
 if(!mio||id==='equilibrada'||S.esSeleccion)return _jugarPartidoV19(A,B,neutral,knock);
 const f=factoresPostura(mio===A?B:A,id);
 S._post={n:0,fa:mio===A?f.yo:f.el,fb:mio===A?f.el:f.yo};
 try{return _jugarPartidoV19(A,B,neutral,knock);}finally{S._post=null;}
};
const _poissonV19=poisson;
poisson=function(l){
 const P=S._post;
 if(P){const k=P.n++;l=clamp(l*(k===0?P.fa:k===1?P.fb:1),.3,3.8);}
 return _poissonV19(l);
};
function proximoRivalLiga(){
 const TT=S.temp;if(!TT)return null;
 for(let i=TT.j;i<TT.jornadas.length;i++){const j=TT.jornadas[i];if(j.t==='liga'&&!j.visto){const r=rivalDeJornada(j);if(r)return r;}}
 return null;
}
function ponerPostura(id){ if(!POSTURAS[id])return; S.postura=id; pintarPostura(); }
function pintarPostura(){
 const caja=$('#v20-postura');if(!caja)return;
 const id=posturaActual(),P=POSTURAS[id],rv=proximoRivalLiga(),pc=x=>(x>0?'+':'')+Math.round(x*100)+'%';
 let lectura='';
 if(rv){const m=rv.modelo||modeloDeEstilo(rv.e),f=factoresPostura(rv,id);
  const como=m.tofe==='contra'?t3('sale de contra','sai em contra-ataque','breaks on the counter'):m.ofe==='posicional'?t3('quiere la pelota','quer a bola','wants the ball'):t3('juega directo y no corre al espacio','joga direto e não ataca o espaço','plays direct and does not run in behind');
  lectura=`<span class="v20-rv">${t3('Próximo','Próximo','Next')}: <b>${escapeHTML(rv.club.n)}</b> · ${como}</span>`+(id==='equilibrada'?'':`<span class="v20-ef">${t3('Tus goles esperados','Seus gols esperados','Your expected goals')} <b class="${f.yo>1?'ok':'mal'}">${pc(f.yo-1)}</b> · ${t3('los de ellos','os deles','theirs')} <b class="${f.el<1?'ok':'mal'}">${pc(f.el-1)}</b>${castigaRival(rv,id)?' · '+(id==='segura'?t3('te encierra: te cuesta más de lo normal','te prende: custa mais','they pin you in: it costs more than usual'):t3('te castiga la espalda','castiga suas costas','they punish the space behind')):''}</span>`);}
 caja.innerHTML=`<div class="v20-cab"><b>${t3('Postura','Postura','Stance')}</b><span>${t3(...P.d)} ${t3('Defensa de la pérdida','Defesa da perda','Rest defence')}: ${P.vig[0]}.</span></div>
  <div class="v20-pills" role="radiogroup" aria-label="${t3('Postura del equipo','Postura do time','Team stance')}">${Object.keys(POSTURAS).map(k=>`<button role="radio" aria-checked="${k===id}" class="tkv ${k===id?'on':''}" onclick="ponerPostura('${k}')">${t3(...POSTURAS[k].n)}</button>`).join('')}</div>
  <div class="v20-lec">${lectura}</div>`;
}
const _pintarTickerV19=pintarTicker;
pintarTicker=function(){
 _pintarTickerV19();
 if(S.esSeleccion||$('#v20-postura'))return;
 const reloj=$('#s-temporada .tk-reloj');if(reloj)reloj.insertAdjacentHTML('beforebegin','<div id="v20-postura" class="v20-postura"></div>');
 pintarPostura();
};
// el próximo rival cambia con cada fecha
const _tickerV19=tickerSiguiente;
tickerSiguiente=function(){ _tickerV19(); try{pintarPostura();}catch(e){} };
