// v25 — El mundo te responde (ideas de la comunidad de FC y FM, ver doc "Lo que le falta al modo carrera").
// 1) Mercado de técnicos: los DT rivales se van o los echan; llega otro, cambia la escuela y cambia cómo juega ese club.
// 2) Modo sin ayudante: sin pista, sin porcentajes, sin "te avisa": más premio cuando acertás.
// 3) El rival te lee: si caíste en una trampa contra un DT, te la vuelve a plantar hasta que la resuelvas.
// 4) Por qué ganaste o perdiste: el resultado se explica con tu decisión desde el banco.

/* ---------- 1. mercado de técnicos ---------- */
const ESTILO_DE_PERFIL={posicional:'Posesion',provocador:'Posesion',intenso:'Presion alta',vertical:'Presion alta',zonal:'Contraataque / Directo',contra:'Contraataque / Directo',bloque:'Bloque bajo / Repliegue'};
const _perfilDTV24=perfilDT;
perfilDT=function(club,m){const n=club&&club.n;return (S.dts&&n&&S.dts[n]&&PERFILES_DT[S.dts[n].p])?S.dts[n].p:_perfilDTV24(club,m);};
function equiposRivalesDe(nombre){const T=S.temp,out=[];if(!T)return out;for(const e of [...(T.equipos||[]),...((T.copa&&T.copa.equipos)||[])])if(e&&!e.yo&&e.club&&e.club.n===nombre&&!out.includes(e))out.push(e);return out;}
function cambiarDT(club,motivo){
 const n=club.n,ant=perfilDT(club,modeloDeEstilo((S.identR&&S.identR[n]||{}).e)),ops=Object.keys(PERFILES_DT).filter(p=>p!==ant);
 const nuevo=ops[hashS(n+'|dt|'+S.temporada+'|'+motivo)%ops.length],e=ESTILO_DE_PERFIL[nuevo];
 S.dts=S.dts||{};S.dts[n]={p:nuevo,desde:S.temporada};
 if(S.identR&&S.identR[n])S.identR[n].e=e;
 equiposRivalesDe(n).forEach(eq=>{eq.e=e;eq.modelo=null;});
 const txt=motivo==='echado'
  ?t3(`Echaron al DT de ${n}. Asume ${t3(...PERFILES_DT[nuevo].n)}: cambia cómo juegan.`,`Demitiram o técnico do ${n}. Assume ${t3(...PERFILES_DT[nuevo].n)}.`,`${n} sacked their coach. In comes ${t3(...PERFILES_DT[nuevo].n)}: their style changes.`)
  :t3(`${n} cambió de DT: llega ${t3(...PERFILES_DT[nuevo].n)}.`,`${n} trocou de técnico: chega ${t3(...PERFILES_DT[nuevo].n)}.`,`${n} have a new coach: ${t3(...PERFILES_DT[nuevo].n)}.`);
 (S.noticiasDT=S.noticiasDT||[]).push({t:S.temporada,club:n,p:nuevo,ant,motivo,txt});
 return txt;
}
// cada pretemporada, más o menos uno de cada seis rivales cambia de entrenador
function mercadoDeTecnicos(){
 const T=S.temp;if(!T||S.esSeleccion||T.dtsHecho)return [];T.dtsHecho=true;
 const vistos=new Set(),out=[];
 (T.equipos||[]).forEach(eq=>{if(!eq||eq.yo||!eq.club||vistos.has(eq.club.n))return;vistos.add(eq.club.n);
  if(S.temporada>1&&hashS(eq.club.n+'|mercadoDT|'+S.temporada)%6===0)out.push(cambiarDT(eq.club,'se va'));});
 return out;
}
const _empezarTemporadaV24=empezarTemporada;
empezarTemporada=function(){
 const noticias=mercadoDeTecnicos();
 _empezarTemporadaV24();
 if(noticias.length&&tmp.feed){noticias.forEach(txt=>tmp.feed.unshift({txt:'🔁 '+txt,c:'e',les:[]}));if(typeof pintarFeedTk==='function')pintarFeedTk();}
};
// en el parate de mitad de temporada, el último de la tabla echa a su técnico
const _paradaMitadV24=paradaMitad;
paradaMitad=function(){
 const T=S.temp;
 if(T&&!S.esSeleccion&&T.equipos&&T.equipos.length&&!T.dtEchado){
  const tab=ordenTabla(T.equipos,'tab'),ult=tab.slice().reverse().find(x=>!x.e.yo);
  if(ult){T.dtEchado=true;const txt=cambiarDT(ult.e.club,'echado');if(tmp.feed){tmp.feed.unshift({txt:'🔁 '+txt,c:'p',les:[]});}}
 }
 _paradaMitadV24();
};

/* ---------- 2. modo sin ayudante ---------- */
const PREMIO_SIN_AYUDANTE=1.25;
function alternarAyudante(){
 S.sinAyudante=!S.sinAyudante;
 const b=document.getElementById('tkAyudante');if(b)b.outerHTML=botonAyudante();
}
function botonAyudante(){
 return `<button class="tkv ${S.sinAyudante?'on':''}" id="tkAyudante" aria-pressed="${!!S.sinAyudante}" onclick="alternarAyudante()" title="${t3('Sin pista ni porcentajes. Si acertás, el premio sube un 25 %.','Sem dica nem porcentagens. Se acertar, o prêmio sobe 25 %.','No hint or percentages. Get it right and the reward goes up 25%.')}">${S.sinAyudante?t3('Sin ayudante · +25 %','Sem auxiliar · +25 %','No assistant · +25%'):t3('Con ayudante','Com auxiliar','With assistant')}</button>`;
}
const _pintarTickerV24=pintarTicker;
pintarTicker=function(){
 _pintarTickerV24();
 const c=document.getElementById('tkCuaderno');if(c&&!document.getElementById('tkAyudante')&&!S.esSeleccion)c.insertAdjacentHTML('afterend',botonAyudante());
};
const _resolverSituacionV24=resolverSituacion;
resolverSituacion=function(sit,c,k,clave){
 const r=_resolverSituacionV24(sit,c,k,clave);
 if(S.sinAyudante&&r.mult>1){r.mult=Math.round((1+(r.mult-1)*PREMIO_SIN_AYUDANTE)*1000)/1000;r.sinAyudante=true;}
 return r;
};

/* ---------- 3. el rival te lee ---------- */
function memoriaDe(club){return (S.memoriaDT&&club&&S.memoriaDT[club])||null;}
const _elegirSituacionV24=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 const n=c&&c.el&&c.el.club&&c.el.club.n,mem=memoriaDe(n);
 if(mem&&mem.trampa&&ID_FAMILIA[mem.id]&&S.ultimaSituacion!==mem.id&&hashS(clave+'|teleo')%2===0){
  const gen=GENERADOR_FAMILIA[ID_FAMILIA[mem.id]];
  for(let i=0;i<80;i++){const s=gen(c,clave+'|leo'+i);if(s&&nombreArquetipo(s.A)===mem.nom){s.recuerdo=mem;s.dt=perfilDT(c.el.club,c.el.m);return s;}}
 }
 return _elegirSituacionV24(c,clave);
};
const _elegirSituacionClickV24=elegirSituacion;
elegirSituacion=function(k){
 const X=tmp.sit,ya=X&&X.res;
 _elegirSituacionClickV24(k);
 if(!X||ya||!X.res)return;
 const r=X.res,n=X.rival&&X.rival.club&&X.rival.club.n;
 if(X.jor&&X.jor.sit){X.jor.sit.t=r.op.t;X.jor.sit.nom=X.sit.A?nombreArquetipo(X.sit.A):null;X.jor.sit.recuerdo=!!X.sit.recuerdo;}
 if(n&&X.sit.gen&&X.sit.A){
  S.memoriaDT=S.memoriaDT||{};
  if(r.lectura===0)S.memoriaDT[n]={id:X.sit.id,nom:nombreArquetipo(X.sit.A),t:r.op.t,trampa:true,temp:S.temporada};
  else if(r.lectura===1&&X.sit.recuerdo)S.memoriaDT[n]={...X.sit.recuerdo,trampa:false,resuelta:S.temporada};
 }
};
const _abrirSituacionV24=abrirSituacion;
abrirSituacion=function(jor,rival,sit,c,clave){
 _abrirSituacionV24(jor,rival,sit,c,clave);
 const caja=document.getElementById('v16-sit');if(!caja)return;
 if(sit.recuerdo){
  const m=sit.recuerdo,dest=caja.querySelector('.v24-dt')||caja.querySelector('.etq');
  if(dest)dest.insertAdjacentHTML('afterend',`<p class="v25-leo" style="margin:.2em 0 .6em;padding:.45em .7em;border-left:3px solid #e8604c;font-size:.88em;background:#e8604c1a"><b>${t3('TE LEYÓ','LEU VOCÊ','HE HAS READ YOU')}</b> — ${t3(`La última vez caíste en «${t3(...m.t)}». Te lo vuelve a plantar.`,`Da última vez você caiu em «${t3(...m.t)}». Ele repete.`,`Last time you fell for «${t3(...m.t)}». He is setting the same trap.`)}</p>`);
 }
 if(S.sinAyudante){
  caja.querySelectorAll('.v16-pista,.v17-nums').forEach(e=>e.remove());
  const etq=caja.querySelector('.etq');if(etq)etq.innerHTML=etq.innerHTML.replace(t3('TE AVISA TU AYUDANTE','SEU AUXILIAR AVISA','YOUR ASSISTANT CALLS OVER'),t3('SIN AYUDANTE · +25 %','SEM AUXILIAR · +25 %','NO ASSISTANT · +25%'));
 }
};

/* ---------- 4. por qué ganaste o perdiste ---------- */
function porQueResultado(jor){
 const s=jor&&jor.sit,p=jor&&jor.res&&jor.res.find(x=>x.yo);
 if(!s||s.auto||s.lectura==null||!p||!s.t)return null;
 const soyA=p.A.yo,gf=soyA?p.ga:p.gb,gc=soyA?p.gb:p.ga,riv=(soyA?p.B:p.A).club.n,dif=gf-gc,cerrado=Math.abs(dif)<=1;
 const orden=t3(...s.t),pct=Math.round((s.mult-1)*100),pc=(pct>0?'+':'')+pct+'%';
 let txt=null,clave=null;
 if(dif>0&&s.lectura===1&&s.sale){txt=t3(`Se ganó desde el banco: «${orden}» (${pc}).`,`Ganhou do banco: «${orden}» (${pc}).`,`Won from the touchline: «${orden}» (${pc}).`);clave='gano';}
 else if(dif<0&&s.lectura===0){txt=t3(`Se perdió en el banco: caíste en «${orden}» (${pc}).`,`Perdeu no banco: caiu em «${orden}» (${pc}).`,`Lost on the bench: you fell for «${orden}» (${pc}).`);clave='trampa';}
 else if(dif<=0&&s.lectura===1&&!s.sale){txt=t3(`La idea era la buena («${orden}»); faltó ejecución.`,`A ideia era boa («${orden}»); faltou execução.`,`The idea was right («${orden}»); the execution was not.`);clave='ejecucion';}
 else if(dif>0&&s.lectura===0){txt=t3(`Ganaste a pesar de «${orden}»: no te quedes con el resultado.`,`Venceu apesar de «${orden}».`,`You won despite «${orden}»: do not trust the result.`);clave='zafo';}
 else if(dif===0&&s.lectura===1&&s.sale){txt=t3(`El empate salió del banco: «${orden}» (${pc}).`,`O empate saiu do banco: «${orden}» (${pc}).`,`The draw came from the bench: «${orden}» (${pc}).`);clave='empate';}
 if(!txt)return null;
 return {txt,clave,cerrado,riv,gf,gc,k:jor.k,recuerdo:!!s.recuerdo};
}
const _registrarFeedV24=registrarFeed;
registrarFeed=function(jor){
 _registrarFeedV24(jor);
 const q=porQueResultado(jor);if(!q||!tmp.feed||!tmp.feed[0])return;
 tmp.feed[0].txt+=` <span class="v25-porque" style="display:block;font-size:.86em;opacity:.85">↳ ${q.txt}</span>`;
 if(q.cerrado&&S.temp)(S.temp.porques=S.temp.porques||[]).push(q);
};
if(typeof cronicaTemporada==='function'){
 const _cronicaV24=cronicaTemporada;
 cronicaTemporada=function(){
  const h=_cronicaV24(),q=(S.temp&&S.temp.porques)||[];if(!q.length)return h;
  const i=h.lastIndexOf('</article>');if(i<0)return h;
  const g=q.filter(x=>x.clave==='gano'||x.clave==='empate'),p=q.filter(x=>x.clave==='trampa');
  const fr=[];
  if(g.length)fr.push(t3(`Hubo ${g.length} ${g.length===1?'partido cerrado que se resolvió':'partidos cerrados que se resolvieron'} desde el banco (${g.slice(0,3).map(x=>`${x.gf}-${x.gc} a ${escapeHTML(x.riv)}`).join(', ')}).`,`Houve ${g.length} jogos apertados resolvidos do banco.`,`${g.length} tight ${g.length===1?'match was':'matches were'} settled from the touchline (${g.slice(0,3).map(x=>`${x.gf}-${x.gc} v ${escapeHTML(x.riv)}`).join(', ')}).`));
  if(p.length)fr.push(t3(`Y ${p.length} ${p.length===1?'se perdió':'se perdieron'} por caer en la trampa (${p.slice(0,3).map(x=>`${x.gf}-${x.gc} con ${escapeHTML(x.riv)}`).join(', ')}).`,`E ${p.length} perdidos por cair na armadilha.`,`And ${p.length} ${p.length===1?'was':'were'} lost by falling for the trap (${p.slice(0,3).map(x=>`${x.gf}-${x.gc} v ${escapeHTML(x.riv)}`).join(', ')}).`));
  const dts=(S.noticiasDT||[]).filter(x=>x.t===S.temporada);
  if(dts.length)fr.push(t3(`${dts.length} ${dts.length===1?'rival cambió':'rivales cambiaron'} de técnico en el año.`,`${dts.length} rivais trocaram de técnico.`,`${dts.length} ${dts.length===1?'opponent':'opponents'} changed coach during the year.`));
  return fr.length?h.slice(0,i)+`<p class="v25-cronica">${fr.join(' ')}</p>`+h.slice(i):h;
 };
}
