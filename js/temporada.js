// Carrera de DT — LA TEMPORADA DE VERDAD
// Liga todos contra todos (ida y vuelta), copas por eliminación directa,
// jugadores con forma, cansancio, lesiones y tarjetas.
// Todo se calcula con S.rng (el duelo sigue siendo determinista) y
// después se muestra minuto a minuto, estilo Brasfoot.
// Ver docs/GDD.md (sección v6).

const K_PARTIDO=24;      // cuánto pesa la diferencia de fuerza en los goles
const LAMBDA_BASE=1.3;   // goles esperados de un partido parejo

/* ==========================================================
   ESTADO DE CADA JUGADOR
   ========================================================== */
function prepJug(j){
  if(j.forma===undefined) j.forma=0;
  if(j.fat===undefined) j.fat=0;
  if(!j.les) j.les=0; if(!j.sus) j.sus=0;
  if(!j.st) j.st={g:0,pj:0,nt:0};
}
function efectivo(j){ return clamp(Math.round(j.rt+(j.forma||0)-Math.max(0,(j.fat||0)-50)/5),20,99); }
function disponible(j){ return !(j.les>0)&&!(j.sus>0); }
// el once automático va por jerarquía (nivel de siempre), no por el momento
function onceTemporada(plantel,f,fijos){
  plantel.forEach(prepJug);
  const disp=plantel.filter(disponible);
  const base=disp.length>=11?disp:plantel;
  const once=armarOnce(base,f,(fijos||[]).filter(disponible));
  once.forEach(o=>{ const ef=efectivo(o.jug); o.ef=ef; o.rt=o.fuera?Math.max(28,ef-10):ef; });
  return once;
}
// cómo llega cada uno a la pretemporada: siempre hay alguna historia
function pretemporada(){
  S.plantel.forEach(j=>{ prepJug(j); j.fat=R.e(0,15); j.les=0; j.sus=0; j.forma=R.e(-2,2); j.st={g:0,pj:0,nt:0}; });
  const orden=S.plantel.slice().sort((a,b)=>b.rt-a.rt);
  const figura=R.el(orden.slice(0,7).filter(j=>j.g!=="POR"));
  if(figura) figura.forma=-R.e(4,6);
  const suplentes=orden.slice(11).filter(j=>j.g!=="POR");
  if(suplentes.length){ const s=R.el(suplentes); s.forma=R.e(4,6); }
  if(S.rng()<0.65){
    const cand=orden.slice(0,11).filter(j=>j!==figura&&j.g!=="POR");
    if(cand.length) R.el(cand).les=R.e(1,4);
  }
  const viejo=orden.find(j=>j.ed>=31&&j!==figura);
  if(viejo) viejo.fat=R.e(45,65);
  S.fijos=(S.fijos||[]).filter(j=>S.plantel.includes(j));
}

/* ==========================================================
   EQUIPOS RIVALES — cada club tiene una identidad que se sostiene
   ========================================================== */
function identidadRival(club){
  S.identR=S.identR||{};
  let id=S.identR[club.n];
  if(!id||S.rng()<0.3){
    const e=R.el(ESTILOS);
    const buenos=FORMACIONES.filter(f=>FIT[e][f]>=1.06);
    id={f:S.rng()<0.65?R.el(buenos):R.el(FORMACIONES.filter(f=>FIT[e][f]>=1)),e};
    S.identR[club.n]=id;
  }
  return id;
}
function escalaRivales(){
  return (S.temporada-1)*1.4+Math.min(12,S.titulos.filter(t=>t.tipo!=="media").length*2.2);
}
function equipoRival(club,div){
  const id=identidadRival(club);
  const base=(club.sel?nivelBaseDe(club.niv,3)+8:nivelBaseDe(club.niv,div))+escalaRivales();
  const pl=generarPlantel(base,div,null,club.p);
  const once=armarOnce(pl,id.f);
  return {club,f:id.f,e:id.e,attrs:atributosDe(once),once,auto:40,coh:1,emp:0};
}
// mi equipo para un partido: sale del once de ese día
function miEquipo(rival){
  const once=onceTemporada(S.plantel,S.formacion,S.fijos);
  const attrs=atributosDe(once);
  const yo={club:S.club,yo:true,f:S.formacion,e:S.estilo,attrs,once,auto:S.auto||0,
    coh:0.94+(S.vars.ves/100)*0.12, emp:(S.vars.hin-50)/50*2.5};
  const plan=planContra(S.plan,{f:yo.f,e:yo.e,attrs},{f:rival.f,e:rival.e,attrs:rival.attrs},yo.auto);
  let mult=plan.mult*((S.prensa&&S.prensa.mult)||1);
  if(rival.clasico&&S.momentosOk) mult*=1+0.02*S.momentosOk;
  yo.mult=mult; yo.plan=plan;
  return yo;
}

/* ==========================================================
   PARTIDO
   ========================================================== */
function fuerza(eq,rv,local){
  const p=PESOS[eq.f], a=eq.attrs;
  const base=(a[0]*p[0]+a[1]*p[1]+a[2]*p[2]+a[3]*p[3])/(p[0]+p[1]+p[2]+p[3]);
  let F=base*FIT[eq.e][eq.f]*MATCHUP[eq.f][rv.f]*(1+0.06*(eq.auto||0)/100)*(eq.coh||1)*(eq.mult||1);
  if(local) F+=2+(eq.emp||0);
  return F;
}
function poisson(l){ const Lm=Math.exp(-l); let k=0,p=1; do{k++;p*=S.rng();}while(p>Lm&&k<12); return k-1; }
function goleador(once){
  const w=once.map(o=>(ROL[o.rol].a[0]+0.04)*Math.max(20,o.rt));
  let t=w.reduce((a,b)=>a+b,0)*S.rng();
  for(let i=0;i<w.length;i++){ t-=w[i]; if(t<=0) return once[i]; }
  return once[once.length-1];
}
function apellido(n){ return (n||"").split(" ").slice(1).join(" ")||n; }
// juega un partido: A local (salvo neutral). Devuelve goles y eventos por minuto
function jugarPartido(A,B,neutral,knock){
  const Fa=fuerza(A,B,!neutral), Fb=fuerza(B,A,false);
  let la=clamp(LAMBDA_BASE*Math.exp((Fa-Fb)/K_PARTIDO),0.4,3.4);
  let lb=clamp(LAMBDA_BASE*Math.exp((Fb-Fa)/K_PARTIDO),0.4,3.4);
  const ev=[];
  // rojas: te dejan con diez el resto del partido
  [[A,"a"],[B,"b"]].forEach(([E,l])=>{
    if(S.rng()<0.045){
      const m=R.e(20,85), o=R.el(E.once.filter(x=>x.rol!=="POR"));
      ev.push({m,l,t:"roja",nom:apellido(o.jug.nom),jug:o.jug});
      const k=1-0.3*(90-m)/90; if(l==="a") la*=k; else lb*=k;
    }
  });
  const ga=poisson(la), gb=poisson(lb);
  for(let i=0;i<ga;i++){ const o=goleador(A.once); ev.push({m:R.e(1,90),l:"a",t:"gol",nom:apellido(o.jug.nom),jug:o.jug}); }
  for(let i=0;i<gb;i++){ const o=goleador(B.once); ev.push({m:R.e(1,90),l:"b",t:"gol",nom:apellido(o.jug.nom),jug:o.jug}); }
  let pen=null;
  if(knock&&ga===gb){
    let pa=0,pb=0;
    for(let i=0;i<5;i++){ if(S.rng()<0.76)pa++; if(S.rng()<0.76)pb++; }
    let g=0; while(pa===pb&&g<10){ g++; if(S.rng()<0.72)pa++; if(S.rng()<0.72)pb++; }
    if(pa===pb) pa++;
    pen=[pa,pb];
  }
  ev.sort((x,y)=>x.m-y.m);
  return {ga,gb,ev,pen,Fa,Fb};
}
// después de cada partido mío: notas, forma, cansancio y lesiones
function despuesDelPartido(once,gf,gc,ev,soyA){
  const enOnce=new Set(once.map(o=>o.jug));
  const res=gf>gc?0.5:gf===gc?0:-0.4;
  const prom=once.reduce((a,o)=>a+o.rt,0)/once.length;
  const lesionados=[];
  once.forEach(o=>{
    const j=o.jug; prepJug(j);
    const goles=ev.filter(e=>e.t==="gol"&&e.jug===j&&e.l===(soyA?"a":"b")).length;
    const nota=clamp(6+res+goles*0.9+(o.rt-prom)/12+R.r(-0.7,0.7)+(o.rol==="POR"&&gc===0?0.4:0),3,10);
    j.st.pj++; j.st.g+=goles; j.st.nt+=nota;
    j.forma=clamp(Math.round(j.forma*0.7+(nota-6.2)*1.6+R.r(-1,1)),-6,6);
    if(S.rng()<0.004+(j.fat/100)*0.028){ j.lesNueva=R.e(1,5); lesionados.push(j); }
    j.fat=clamp(j.fat+5+(j.ed>31?3:0)+(S.estilo==="Presion alta"?2:0),0,100); // la presión desgasta
  });
  S.plantel.forEach(j=>{
    prepJug(j);
    if(!enOnce.has(j)){ j.fat=Math.max(0,j.fat-20); j.forma=clamp(Math.round(j.forma*0.85+R.r(-0.8,0.8)),-6,6); }
    if(j.les>0) j.les--; if(j.sus>0) j.sus--;
  });
  lesionados.forEach(j=>{ j.les=j.lesNueva; delete j.lesNueva; });
  ev.filter(e=>e.t==="roja"&&e.l===(soyA?"a":"b")&&e.jug).forEach(e=>{ e.jug.sus=1; });
  return lesionados;
}
// un equipo que no jugó esa fecha igual descansa
function descanso(){ S.plantel.forEach(j=>{ prepJug(j); j.fat=Math.max(0,j.fat-22); if(j.les>0) j.les--; if(j.sus>0) j.sus--; }); }

/* ==========================================================
   CALENDARIO
   ========================================================== */
function todosContraTodos(n){
  const t=[...Array(n).keys()]; if(n%2) t.push(-1);
  const m=t.length, fechas=[];
  for(let r=0;r<m-1;r++){
    const f=[];
    for(let i=0;i<m/2;i++){ const a=t[i], b=t[m-1-i]; if(a>=0&&b>=0) f.push((r+i)%2?[b,a]:[a,b]); }
    fechas.push(f); t.splice(1,0,t.pop());
  }
  return fechas.concat(fechas.map(f=>f.map(([a,b])=>[b,a])));
}
const FORMATO_AC={"Uruguay":{a:"Torneo Apertura",c:"Torneo Clausura",anual:"Campeonato Uruguayo"},
                  "Argentina":{a:"Torneo Apertura",c:"Torneo Clausura",anual:null}};
function nombreRonda(n){ // n = equipos que quedan
  return n>=16?t3("Octavos de final","Oitavas de final","Round of 16"):n>=8?t3("Cuartos de final","Quartas de final","Quarter-finals")
    :n>=4?t3("Semifinales","Semifinais","Semi-finals"):t3("Final","Final","Final");
}
function armarTemporada(){
  const TT={j:0,jornadas:[],equipos:[],ligaNombre:"",copa:null,mitad:0,paro:false,mis:[],eventos:[],ac:null};
  const div=S.esSeleccion?3:S.division;
  let clubesLiga=[], copa=null;
  if(S.esSeleccion){
    S.selT=(S.selT||0)+1;
    const otras=SELECCIONES.filter(s=>s.n!==S.club.n).map(s=>Object.assign({sel:true},s));
    if(S.selT===1){ TT.ligaNombre="Eliminatorias"; clubesLiga=otras; }
    else {
      const nom=S.selT===2?"Copa América":"Copa del Mundo";
      copa={nombre:nom,tipo:"sel",rivales:R.mz(otras).slice(0,7)};
      TT.ligaNombre=null;
    }
  } else {
    const L=LIGAS[S.club.p];
    const otros=L.clubes.filter(c=>c.n!==S.club.n).map(c=>Object.assign({p:S.club.p},c));
    const cla=clasicoDe(S.club);
    const orden=otros.slice().sort((a,b)=>b.niv-a.niv);
    let elegidos=orden.slice(0,5);
    if(cla&&!elegidos.some(c=>c.n===cla.n)) elegidos.push(cla);
    elegidos=elegidos.concat(R.mz(orden.filter(c=>!elegidos.some(e=>e.n===c.n)))).slice(0,9);
    clubesLiga=elegidos;
    TT.ligaNombre=div<3?`${L.liga} ${DIVISIONES[div].comp}`:L.liga;
    if(div===3&&FORMATO_AC[S.club.p]) TT.ac=FORMATO_AC[S.club.p];
    if(div===3){
      const conti=S.club.niv>=4&&(S.clasifConti||(S.temporada===1&&S.club.niv>=5));
      if(conti){
        const conf=L.conf;
        const pool=CLUBES.filter(c=>LIGAS[c.p].conf===conf&&c.n!==S.club.n&&c.niv>=3);
        const extr=R.mz(pool.filter(c=>c.p!==S.club.p)), loc=R.mz(pool.filter(c=>c.p===S.club.p));
        let riv=extr.slice(0,5).concat(loc.slice(0,2)); if(riv.length<7) riv=riv.concat(R.mz(pool).filter(c=>!riv.includes(c))).slice(0,7);
        copa={nombre:COPA[conf],tipo:"conti",rivales:riv.slice(0,riv.length>=7?7:3)};
      } else {
        const tor=TORNEOS[S.club.p]||[];
        const nom=tor[tor.length-1]||"Copa";
        copa={nombre:nom,tipo:"copa",rivales:R.mz(otros).slice(0,otros.length>=7?7:3)};
      }
    }
  }
  const eqs=[];
  if(clubesLiga.length){
    eqs.push({club:S.club,yo:true});
    clubesLiga.forEach(c=>eqs.push(equipoRival(c,div)));
    const cla=S.esSeleccion?null:clasicoDe(S.club);
    eqs.forEach(e=>{ e.tab={pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0}; e.tabA={pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0}; e.tabC={pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0};
      if(cla&&e.club.n===cla.n) e.clasico=true; });
  }
  TT.equipos=eqs;
  const fechas=eqs.length?todosContraTodos(eqs.length):[];
  TT.nFechas=fechas.length;
  fechas.forEach((f,k)=>TT.jornadas.push({t:"liga",k,partidos:f.map(([a,b])=>({a,b}))}));
  if(copa){
    const part=[{club:S.club,yo:true}].concat(copa.rivales.map(c=>equipoRival(Object.assign({},c),div)));
    copa.equipos=part; copa.vivos=R.mz(part.map((_,i)=>i)); copa.rondas=[];
    const nR=Math.round(Math.log2(part.length));
    const F=TT.jornadas.length;
    const lugares=F?(nR===3?[Math.floor(F*0.3),Math.floor(F*0.65),F]:[Math.floor(F*0.5),F]):[...Array(nR).keys()];
    for(let r=nR-1;r>=0;r--) TT.jornadas.splice(lugares[r],0,{t:"copa",r});
    TT.copa=copa;
  }
  TT.mitad=TT.nFechas?TT.jornadas.findIndex(j=>j.t==="liga"&&j.k===TT.nFechas/2):Math.floor(TT.jornadas.length/2);
  if(TT.mitad<0) TT.mitad=Math.floor(TT.jornadas.length/2);
  S.temp=TT;
  return TT;
}

/* ==========================================================
   JUGAR UNA JORNADA (liga o copa)
   ========================================================== */
function sumarTabla(t,gf,gc){ t.pj++; t.gf+=gf; t.gc+=gc; if(gf>gc){t.g++;t.pts+=3;} else if(gf===gc){t.e++;t.pts++;} else t.p++; }
function ordenTabla(eqs,campo){
  return eqs.map((e,i)=>({e,i})).sort((x,y)=>{const a=x.e[campo],b=y.e[campo];
    return b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf||x.i-y.i;});
}
function jugarJornada(jor){
  const TT=S.temp;
  jor.res=[];
  let yoJugue=false;
  const armar=(eq,rv)=>eq.yo?miEquipo(rv):eq;
  if(jor.t==="liga"){
    const segunda=jor.k>=TT.nFechas/2;
    jor.partidos.forEach(p=>{
      const A0=TT.equipos[p.a], B0=TT.equipos[p.b];
      const A=armar(A0,B0), B=armar(B0,A0);
      const r=jugarPartido(A,B,false,false);
      sumarTabla(A0.tab,r.ga,r.gb); sumarTabla(B0.tab,r.gb,r.ga);
      if(TT.ac){ const h=segunda?"tabC":"tabA"; sumarTabla(A0[h],r.ga,r.gb); sumarTabla(B0[h],r.gb,r.ga); }
      const fila={A:A0,B:B0,ga:r.ga,gb:r.gb,ev:r.ev,yo:A0.yo||B0.yo};
      if(fila.yo){ yoJugue=true; registrarMio(A0.yo?A:B,A0.yo?B0:A0,A0.yo,r,TT.ligaNombre,jor); fila.les=jor.lesionados; }
      jor.res.push(fila);
    });
  } else {
    const C=TT.copa, v=C.vivos, nuevos=[];
    jor.ronda=nombreRonda(v.length); jor.nombre=C.nombre;
    for(let i=0;i<v.length;i+=2){
      const A0=C.equipos[v[i]], B0=C.equipos[v[i+1]];
      const A=armar(A0,B0), B=armar(B0,A0);
      const r=jugarPartido(A,B,v.length===2,true);
      const ganaA=r.ga>r.gb||(r.pen&&r.pen[0]>r.pen[1]);
      nuevos.push(ganaA?v[i]:v[i+1]);
      const fila={A:A0,B:B0,ga:r.ga,gb:r.gb,ev:r.ev,pen:r.pen,yo:A0.yo||B0.yo,gana:ganaA?"a":"b"};
      if(fila.yo){ yoJugue=true; registrarMio(A0.yo?A:B,A0.yo?B0:A0,A0.yo,r,C.nombre,jor);
        const yoGano=(A0.yo&&ganaA)||(B0.yo&&!ganaA);
        C.rondas.push({ronda:jor.ronda,rival:(A0.yo?B0:A0).club,gf:A0.yo?r.ga:r.gb,gc:A0.yo?r.gb:r.ga,pen:r.pen?(A0.yo?r.pen:[r.pen[1],r.pen[0]]):null,gano:yoGano});
        if(!yoGano) C.eliminado=jor.ronda; fila.les=jor.lesionados; }
      jor.res.push(fila);
    }
    if(v.length===2) C.campeon=C.equipos[nuevos[0]];
    C.vivos=nuevos;
  }
  if(!yoJugue) descanso();
  // mis partidos arriba
  jor.res.sort((x,y)=>(y.yo?1:0)-(x.yo?1:0));
  return jor;
}
function registrarMio(yo,rival,soyA,r,comp,jor){
  const gf=soyA?r.ga:r.gb, gc=soyA?r.gb:r.ga;
  jor.lesionados=despuesDelPartido(yo.once,gf,gc,r.ev,soyA);
  S.temp.mis.push({rival:rival.club,rf:rival.f,re:rival.e,local:soyA,gf,gc,comp,copa:jor.t==="copa",
    dF:(soyA?r.Fa-r.Fb:r.Fb-r.Fa),plan:yo.plan,pen:r.pen?(soyA?r.pen:[r.pen[1],r.pen[0]]):null,clasico:!!rival.clasico});
}

/* ==========================================================
   CIERRE: posiciones, títulos, premios
   ========================================================== */
function posEsperada(){
  const eqs=S.temp.equipos;
  const niv=e=>e.yo?S.club.niv:e.club.niv;
  const mio=niv(eqs[0]);
  const mejores=eqs.filter(e=>!e.yo&&niv(e)>mio).length, iguales=eqs.filter(e=>!e.yo&&niv(e)===mio).length;
  return 1+mejores+Math.floor(iguales/2);
}
function cerrarCalculoTemporada(){
  const TT=S.temp, res={titulos:[],pos:null,equipos:TT.equipos.length};
  let pts=0,dRes=0,dDir=0,dHin=0,campeon=false,rel=0;
  if(TT.equipos.length){
    const tabla=ordenTabla(TT.equipos,"tab");
    const pos=tabla.findIndex(x=>x.e.yo)+1;
    const exp=posEsperada(); rel=exp-pos;
    res.pos=pos; res.exp=exp; res.tabla=tabla;
    const margen=pos===1?tabla[0].e.tab.pts-tabla[1].e.tab.pts:0;
    res.margen=margen;
    campeon=pos===1;
    if(TT.ac){
      const tA=ordenTabla(TT.equipos,"tabA"), tC=ordenTabla(TT.equipos,"tabC");
      res.apertura=tA[0].e; res.clausura=tC[0].e;
      if(tA[0].e.yo) res.titulos.push({comp:TT.ac.a,tipo:"media"});
      if(tC[0].e.yo) res.titulos.push({comp:TT.ac.c,tipo:"media"});
      if(TT.ac.anual&&campeon) res.titulos.push({comp:TT.ac.anual,tipo:"liga"});
      if(!TT.ac.anual&&campeon) res.titulos.push({comp:t3("Tabla anual","Tabela anual","Annual table")+" "+TT.ligaNombre,tipo:"liga"});
    } else if(campeon) res.titulos.push({comp:TT.ligaNombre,tipo:S.esSeleccion?"sel":"liga"});
    pts = campeon?10 : Math.max(pos===2?7:0, clamp(Math.round(4+rel*1.5),0,8));
    if(TT.ac&&!campeon&&(res.apertura.yo||res.clausura.yo)) pts=Math.max(pts,7);
    dRes=clamp(rel*4,-18,12); dDir=clamp(rel*4,-20,12); dHin=clamp(rel*4.5,-20,14);
    if(campeon){dRes+=12;dDir+=10;dHin+=14;}
    res.ultimo=pos===TT.equipos.length&&TT.equipos.length>=6;
    if(res.ultimo){dDir-=8;dHin-=6;}
  }
  if(TT.copa){
    const C=TT.copa; res.copa={nombre:C.nombre,tipo:C.tipo,rondas:C.rondas,eliminado:C.eliminado,campeon:C.campeon};
    const gano=C.campeon&&C.campeon.yo;
    const llego=C.rondas.length, total=Math.round(Math.log2(C.equipos.length));
    const finalista=!gano&&llego===total;
    if(gano) res.titulos.push({comp:C.nombre,tipo:C.tipo==="sel"?"sel":C.tipo==="conti"?"conti":"copa"});
    if(!TT.equipos.length){ // selección en torneo corto
      pts=gano?10:finalista?7:llego>=total-1?4:llego>=1?1:0;
      const exp=S.club.niv>=5?2:1;
      dRes=(gano?16:finalista?9:llego>=total-1?2:-8); dDir=dRes; dHin=dRes+2;
      if(llego<exp){dDir-=6;dHin-=6;}
      res.pos=null;
    } else {
      pts=Math.min(10,pts+(gano?(C.tipo==="conti"?4:3):finalista?1:0));
      if(gano){dHin+=C.tipo==="conti"?10:6;dDir+=C.tipo==="conti"?8:4;}
    }
    res.copaGano=gano; res.copaFinal=finalista;
  }
  res.pts=pts; res.dRes=Math.round(dRes); res.dDir=Math.round(dDir); res.dHin=Math.round(dHin); res.campeon=campeon; res.rel=rel;
  res.sube = !S.esSeleccion&&S.division<3 ? (campeon?(res.margen>=6?3:2):res.pos===2?1:0) : 0;
  return res;
}
function aplicarCierre(res){
  const antes={dir:S.vars.dir,hin:S.vars.hin,ves:S.vars.ves,res:S.vars.res};
  S.vars.res=clamp(S.vars.res+res.dRes,0,100);
  S.vars.dir=clamp(S.vars.dir+res.dDir,0,100);
  S.vars.hin=clamp(S.vars.hin+res.dHin,0,100);
  S.puntos+=res.pts;
  res.titulos.forEach(t=>S.titulos.push({t:S.temporada,comp:t.comp,club:S.club.n,tipo:t.tipo,div:S.esSeleccion?3:S.division}));
  // automatismos: la idea se aprende jugando
  const fit=FIT[S.estilo][S.formacion];
  const coef=fit>=1.12?1:fit>=1.06?0.8:fit>=1?0.6:fit>=0.94?0.4:0.2;
  S.auto=clamp(Math.round((S.auto||0)+25*coef),0,100);
  S.clasifConti=res.pos!==null&&res.pos<=3;
  res.antes=antes;
  const posTxt=res.pos?`${res.pos}º`:(res.copa?(res.copaGano?t3("Campeón","Campeão","Champions"):res.copa.eliminado||t3("Final","Final","Final")):"—");
  S.hist.push({t:S.temporada,club:S.club.n,div:S.esSeleccion?"Selección":DIVISIONES[S.division].n,
    comp:S.temp.ligaNombre||(res.copa&&res.copa.nombre),f:S.formacion,pos:posTxt,pts:res.pts,tit:res.titulos.map(t=>t.tipo)});
  S.calc=res;
}

/* ==========================================================
   FIGURAS Y LECTURA DE LA TEMPORADA
   ========================================================== */
function figuras(){
  const pl=S.plantel.filter(j=>j.st&&j.st.pj>0);
  const gol=pl.slice().sort((a,b)=>b.st.g-a.st.g)[0];
  const prom=j=>j.st.nt/j.st.pj;
  const reg=pl.filter(j=>j.st.pj>=Math.max(3,S.temp.mis.length*0.35));
  const mejor=reg.slice().sort((a,b)=>prom(b)-prom(a))[0];
  const rev=reg.filter(j=>j.ed<=21&&j!==mejor).sort((a,b)=>prom(b)-prom(a))[0];
  return {gol:gol&&gol.st.g>0?gol:null,mejor,rev,prom};
}
// qué funcionó y qué no, contra qué estilos
function lecturaPlan(){
  const mis=S.temp.mis, out=[];
  FASES.forEach(F=>{
    const op=F.ops.find(o=>o.id===S.plan[F.id]);
    const porEstilo={};
    mis.forEach(m=>{
      const v=m.plan&&m.plan.fases[F.id]; if(!v) return;
      const k=m.re; porEstilo[k]=porEstilo[k]||{s:0,n:0,rivales:[]};
      porEstilo[k].s+=v.adv; porEstilo[k].n++; if(!porEstilo[k].rivales.includes(m.rival.n)) porEstilo[k].rivales.push(m.rival.n);
    });
    const bien=[],mal=[];
    Object.entries(porEstilo).forEach(([e,x])=>{ const m=x.s/x.n; if(m>0.12) bien.push({e,x}); else if(m<-0.05) mal.push({e,x}); });
    out.push({F,op,bien,mal});
  });
  return out;
}
function sorpresa(){
  const mis=S.temp.mis;
  const perdidas=mis.filter(m=>m.gf<m.gc&&m.dF>4).sort((a,b)=>b.dF-a.dF)[0];
  const ganadas=mis.filter(m=>m.gf>m.gc&&m.dF<-4).sort((a,b)=>a.dF-b.dF)[0];
  if(perdidas&&(!ganadas||perdidas.dF>-ganadas.dF)) return {m:perdidas,gane:false};
  if(ganadas) return {m:ganadas,gane:true};
  return null;
}
