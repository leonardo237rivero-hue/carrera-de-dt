// Pruebas de balance (se evalúan junto con el código del juego). Ver simular.js
console.log('CONTENIDO: clubes',CLUBES.length,'| ligas',PAISES.length,'| decisiones',POOL.length,'| fichas de club',Object.keys(CLUB_INFO).length,'| ruleta',RUL.length,'casillas');

function planBueno(){ // mejor opcion promedio contra la liga
  const eqs=S.temp.equipos.filter(e=>!e.yo).concat(S.temp.copa?S.temp.copa.equipos.filter(e=>!e.yo):[]);
  const yo={f:S.formacion,e:S.estilo,attrs:atributosDe(onceTemporada(S.plantel,S.formacion,S.fijos))};
  const plan={};
  FASES.forEach(F=>{ let mej=null; F.ops.forEach(o=>{ const s=eqs.reduce((a,e)=>a+ventaja(F.id,o.id,yo,e,S.auto).adv,0); if(!mej||s>mej.s) mej={o:o.id,s}; }); plan[F.id]=mej.o; });
  return plan;
}
function mejorPar(){ let m=null; FORMACIONES.forEach(f=>ESTILOS.forEach(e=>{ const a=atributosDe(armarOnce(S.plantel,f,[])); const p=PESOS[f];
  const b=(a[0]*p[0]+a[1]*p[1]+a[2]*p[2]+a[3]*p[3])/(p[0]+p[1]+p[2]+p[3])*FIT[e][f]; if(!m||b>m.b) m={f,e,b}; })); return m; }
function fijosBuenos(){ // once por forma real
  const f=S.formacion; const disp=S.plantel.filter(disponible);
  const once=armarOnce(disp.map(j=>Object.assign(Object.create(j),{rt:efectivo(j),__o:j})),f,[]);
  return once.map(o=>o.jug.__o);
}
var REL=[],GDMAX=[];
function carrera(bueno,seed,temps,clubIdx){
  S=nuevo(); S.rng=mul32(hashS(seed)); S.arq=ARQ[1]; S.temporadasTotal=temps;
  const mez=R.mz(CLUBES); const ofs=[{c:mez.find(c=>c.niv>=5),d:0},{c:mez.find(c=>c.niv===3||c.niv===4),d:3},{c:mez.find(c=>c.niv<=2),d:3}];
  const o=ofs[clubIdx]; S.club=o.c; S.division=o.d;
  S.plantel=generarPlantel(nivelBaseDe(S.club.niv,S.division),S.division,null,S.club.p);
  S.vars={res:50,dir:55,hin:55,ves:55}; S.auto=30; S.temporada=1;
  const par=mejorPar(); let tit=0;
  for(;S.temporada<=temps;S.temporada++){
    pretemporada();
    if(bueno){ const m=mejorPar(); S.formacion=m.f; S.estilo=m.e; } else { S.formacion=R.el(FORMACIONES); S.estilo=R.el(ESTILOS); }
    armarTemporada();
    S.plan=bueno?planBueno():{salida:R.el(["tres","laterales","largo"]),defensa:R.el(["presion","medio","repliegue"]),llegada:R.el(["centros","dentro","cambio"])};
    S.fijos=bueno?fijosBuenos():[];
    const T=S.temp;
    for(T.j=0;T.j<T.jornadas.length;T.j++){ if(bueno&&T.j===T.mitad) S.fijos=fijosBuenos(); jugarJornada(T.jornadas[T.j]); }
    const res=cerrarCalculoTemporada(); aplicarCierre(res); tit+=res.titulos.length; GDMAX.push(Math.max(...S.temp.equipos.map(e=>Math.abs(e.tab.gf-e.tab.gc)))/Math.max(1,S.temp.nFechas)); REL.push([bueno,S.club.niv,S.division,res.pos,res.exp,res.equipos]);
    // envejecer / ascenso simple
    S.plantel.forEach(j=>{j.ed++; if(j.ed>31) j.rt=clamp(j.rt-2,28,94);});
    if(res.sube){ S.division=Math.min(3,S.division+res.sube); S.plantel=generarPlantel(nivelBaseDe(S.club.niv,S.division),S.division,null,S.club.p); }
    // mercado simple: el bueno suma un jugador mejor que su peor titular
    if(bueno){ const g=R.el(["DEF","MED","ATA"]); S.plantel.push(nuevoJugador(g,nivelBaseDe(S.club.niv,S.division)+S.temporada*2+8,S.division,null,S.club.p)); }
  }
  return {pts:S.puntos,tit};
}
for(const temps of [3,6,10]) for(const ci of [0,1,2]){
  let b={p:0,t:0},m={p:0,t:0},gana=0,N=60;
  for(let i=0;i<N;i++){ const x=carrera(true,'s'+i+temps+ci,temps,ci), y=carrera(false,'s'+i+temps+ci,temps,ci);
    b.p+=x.pts;b.t+=x.tit;m.p+=y.pts;m.t+=y.tit; if(x.pts>y.pts)gana++; }
  console.log('temps',temps,'club',['grande-form','medio','chico'][ci],'| bueno pts',(b.p/N/temps).toFixed(1),'tit',(b.t/N).toFixed(2),'| malo pts',(m.p/N/temps).toFixed(1),'tit',(m.t/N).toFixed(2),'| gana bueno',(gana/N*100).toFixed(0)+'%');
}

console.log('dif. de gol maxima por partido',(GDMAX.reduce((a,b)=>a+b,0)/GDMAX.length).toFixed(2));const g={}; REL.forEach(([b,n,d,p,e,eq])=>{ if(d<3) return; const k=(b?'B':'M')+n; g[k]=g[k]||{s:0,n:0,e:0}; g[k].s+=p; g[k].e+=e; g[k].n++; });
Object.keys(g).sort().forEach(k=>console.log(k,'pos media',(g[k].s/g[k].n).toFixed(1),'esperada',(g[k].e/g[k].n).toFixed(1),'n',g[k].n));

console.log('\nMEJOR OPCIÓN POR FASE SEGÚN EL RIVAL (diversidad del plan)');

S=nuevo();
for(const [mf,me] of [["4-3-3","Posesion"],["4-4-2","Bloque bajo / Repliegue"],["3-4-3","Contraataque / Directo"]]){
 console.log('\
YO',mf,me);
 const yo={f:mf,e:me,attrs:[62,62,62,62]};
 const cnt={};
 ESTILOS.forEach(e=>{ let row=ESTILO_LBL[e].padEnd(14);
   FORMACIONES.forEach(f=>{ const el={f,e,attrs:[62,62,62,62]};
     const b=FASES.map(F=>mejorOpcion(F.id,yo,el,30)); b.forEach((o,i)=>cnt[o]=(cnt[o]||0)+1);
     row+=' | '+f.slice(0,5)+':'+b.map(x=>x.slice(0,4)).join('/'); });
   console.log(row); });
 console.log(cnt);
}