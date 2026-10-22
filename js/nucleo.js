// Carrera de DT — RNG con semilla, estado de partida y plantel
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   RNG
   ========================================================== */
function hashS(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return (h^(h>>>16))>>>0;}
function mul32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;}}
const R={r:(a,b)=>a+S.rng()*(b-a),e:(a,b)=>Math.floor(a+S.rng()*(b-a+1)),el:a=>a[Math.floor(S.rng()*a.length)],
  mz:a=>{const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(S.rng()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sg=n=>n>0?"+"+n:""+n;
const cd=n=>n>0?"p":n<0?"n":"z";
const $=s=>document.querySelector(s);

/* ==========================================================
   ESTADO
   ========================================================== */
let S={},tmp={};
function nuevo(){return{pant:"portada",nombre:"",arq:null,sistemaPref:null,estiloPref:null,
 club:null,division:3,temporada:1,plantel:[],presupuesto:0,esSeleccion:false,ofertaSel:false,ofertaHecha:false,compe:"",
 duelo:null, rep:{ofensivo:0,conservador:0,plantel:0,directiva:0,prensa:0,resultado:0},etiqueta:null,repUsadas:[],
 vars:{res:50,dir:50,hin:50,ves:50},pool:[],decs:[],decIdx:0,cartas:[],
 formacion:null,estilo:null,calc:null,hist:[],puntos:0,usadas:[],tomadas:[],despidos:0,fijos:[],titulos:[],clubHincha:null,
 timer:null,estadio:1,exClub:null,rng:mul32(hashS("x"+Math.random()))};}

/* ==========================================================
   PLANTEL
   ========================================================== */
// el nivel de una categoria formativa esta MUY por debajo de primera
function nivelBaseDe(niv,div){
  const porDiv=[-26,-18,-10,0][div];
  return 43 + niv*5.5 + porDiv; // v6: brecha entre niveles más realista
}
function edadPara(div){
  const d=DIVISIONES[div];
  if(div===0) return R.e(14,16);
  if(div===1) return R.e(16,18);
  if(div===2) return R.e(17,20);
  return R.e(19,34);
}
function nuevoJugador(g,base,div,edad,pais){
  const P=poolNombres(pais||(S.club?S.club.p:"Uruguay"));
  return {nom:R.el(P.n)+" "+R.el(P.a),g,rt:clamp(Math.round(base+R.e(-7,7)),30,94),
          ed:edad||edadPara(div===undefined?3:div)};
}
// cada plantel tiene un perfil: fuerte en una linea, flojo en otra.
// eso es lo que hace que elegir sistema importe de verdad.
// planteles reales: [nombre, edad, puntaje] (o sólo el nombre si la fuente no trae puntaje)
function nombresDe(club){ return (typeof PLANTELES!=="undefined"&&club&&PLANTELES[club])||null; }
function datoReal(e){ return Array.isArray(e)?{nom:e[0],ed:e[1]||null,rt:e[2]||null}:{nom:e,ed:null,rt:null}; }
// el puntaje real se lleva a la escala del juego: los pibes sin rodaje no bajan de 42
function rtReal(r){ return clamp(Math.round(r),42,94); }
// un jugador real de otro club del mismo país (para el mercado); null si no hay
function realDeLiga(g,pais,excluir,cerca){
  if(typeof PLANTELES==="undefined"||typeof CLUBES==="undefined") return null;
  const usados=new Set((S&&S.plantel||[]).map(j=>j.nom));
  const cl=R.mz(CLUBES.filter(c=>c.p===pais&&c.n!==excluir&&PLANTELES[c.n]));
  for(const c of cl){
    let op=(PLANTELES[c.n][g]||[]).map(datoReal).filter(x=>!usados.has(x.nom));
    if(cerca!=null){ const ok=op.filter(x=>x.rt&&Math.abs(x.rt-cerca)<=7); if(ok.length) op=ok; else continue; }
    if(op.length) return Object.assign(R.el(op),{de:c.n});
  }
  return null;
}
const CUPO_REAL={POR:2,DEF:7,MED:7,ATA:5};
function generarPlantel(base,div,perfil,pais,club,extra){
  const p=[];
  const reales=div===3?nombresDe(club):null;
  const sesgo = perfil || (()=>{
    const s={POR:0,DEF:0,MED:0,ATA:0};
    const gs=R.mz(["DEF","MED","ATA"]);
    s[gs[0]]=R.e(6,11); s[gs[1]]=R.e(-3,3); s[gs[2]]=R.e(-11,-6);
    s.POR=R.e(-4,4);
    return s;
  })();
  [["POR",2],["DEF",5],["MED",6],["ATA",3]].forEach(([g,n])=>{
    const lista=reales&&reales[g]?reales[g].map(datoReal):[];
    const conPuntaje=lista.length&&lista[0].rt!=null;
    const cupo=conPuntaje?Math.max(n,Math.min(CUPO_REAL[g],lista.length)):n;
    for(let i=0;i<cupo;i++){
      // el titular del puesto es mejor que el suplente
      const escalon = i===0?4 : i===1?0 : -6;
      const j=nuevoJugador(g,base+sesgo[g]+escalon,div,null,pais);
      const r=lista[i];
      if(r){ j.nom=r.nom; j.real=true; if(r.ed) j.ed=r.ed; if(r.rt!=null) j.rt=clamp(rtReal(r.rt)+(extra||0),30,94); }
      const PG=POS_GRUPO[g]; j.pos=armarPos(PG[i%PG.length],hashTxt(j.nom)>>3);
      p.push(j);
    }
  });
  p.perfil=sesgo;
  return p;
}
// posiciones concretas: de 1 a 3 por jugador, la primera es la natural.
// (los planteles reales no traen el puesto exacto: sale del orden de la lista y del nombre)
function hashTxt(s){ let h=7; for(const c of String(s||"")) h=(h*31+c.charCodeAt(0))|0; return Math.abs(h); }
const POS_GRUPO={POR:["POR"],DEF:["DFC","DFC","LTD","LTI","DFC","LTD","LTI"],MED:["MC","MCD","MCO","MD","MI","MC","MCD"],ATA:["DC","EXD","EXI","DC","EXI"]};
const POS_SEG={DFC:["MCD","LTD"],LTD:["CAD","MD"],LTI:["CAI","MI"],MCD:["MC","DFC"],MC:["MCD","MCO"],MCO:["MC","EXD","EXI"],MD:["CAD","EXD"],MI:["CAI","EXI"],
  CAD:["MD","LTD"],CAI:["MI","LTI"],EXD:["DC","MD"],EXI:["DC","MI"],DC:["MCO","EXD"]};
function armarPos(prim,h){
  const seg=POS_SEG[prim]||[], p=[prim];
  if(seg.length&&h%3!==0) p.push(seg[h%seg.length]);
  if(seg.length>1&&h%5===0) p.push(seg[(h+1)%seg.length]);
  return [...new Set(p)];
}
function posDe(j){
  if(!j.pos||!j.pos.length){ const h=hashTxt(j.nom), L=POS_GRUPO[j.g]||["MC"]; j.pos=armarPos(L[h%L.length],h>>3); }
  return j.pos;
}
// 0: su puesto · 1: puesto que sabe hacer · 2: mismo sector, otro puesto (−4) · 3: fuera de su sector (−10)
function encaje(j,rol){ const p=posDe(j); return p[0]===rol?0:p.includes(rol)?1:j.g===ROL[rol].g?2:3; }
const AJUSTE_ENC=[0,0,4,10];
// arma el once para una formación: el mejor disponible para cada puesto, prefiriendo al que lo sabe hacer
function armarOnce(plantel,formacion,fijos){
  const slots=ONCE[formacion];
  const usados=new Set(); const once=[];
  const F=fijos||[];
  slots.forEach(sl=>{
    const rol=sl[0];
    const pool=plantel.map((j,idx)=>({j,idx,n:encaje(j,rol)})).filter(o=>!usados.has(o.idx));
    // para elegir, el que hace el puesto de memoria gana por un poco al que lo sabe hacer
    const val=o=>o.j.rt-AJUSTE_ENC[o.n]-(o.n===1?3:0);
    const mejor=l=>l.sort((a,b)=>val(b)-val(a)||a.n-b.n)[0];
    let cand=mejor(pool.filter(o=>F.includes(o.j)&&o.n<3));   // primero los que el DT puso a mano
    if(!cand) cand=mejor(pool.filter(o=>o.n<3));
    if(!cand) cand=mejor(pool);
    usados.add(cand.idx);
    once.push({rol,x:sl[1],y:sl[2],jug:cand.j,rt:Math.max(28,cand.j.rt-AJUSTE_ENC[cand.n]),fuera:cand.n===3,adapta:cand.n===2});
  });
  return once;
}
// los 4 atributos salen del once real
function atributosDe(once){
  const num=[0,0,0,0], den=[0,0,0,0];
  once.forEach(o=>{
    const ap=ROL[o.rol].a;
    for(let k=0;k<4;k++){ num[k]+=o.rt*ap[k]; den[k]+=ap[k]; }
  });
  return num.map((v,k)=>den[k]>0?Math.round(v/den[k]):40);
}
function mejorFormacion(plantel){
  let mej=null;
  FORMACIONES.forEach(f=>{
    const a=atributosDe(armarOnce(plantel,f));
    const s=a.reduce((x,y)=>x+y,0);
    if(!mej||s>mej.s) mej={f,s};
  });
  return mej.f;
}

// cuántas temporadas dura la carrera según el modo elegido
function tempTotal(){ return (S && S.temporadasTotal) ? S.temporadasTotal : TEMPORADAS; }


// con planteles reales, la jerarquía de cada club sale de su plantel (no de la historia):
// se ordena cada liga por fuerza y se reparte el nivel 1-5. Los clubes sin datos quedan como estaban.
function fuerzaReal(club){
  const d=nombresDe(club.n); if(!d) return null;
  const top=(g,k)=>(d[g]||[]).map(datoReal).filter(x=>x.rt!=null).map(x=>x.rt).sort((a,b)=>b-a).slice(0,k);
  const v=[].concat(top("POR",1),top("DEF",4),top("MED",4),top("ATA",2));
  return v.length>=9?v.reduce((a,b)=>a+b,0)/v.length:null;
}
(function ajustarNiveles(){
  if(typeof CLUBES==="undefined"||typeof PLANTELES==="undefined") return;
  const porLiga={};
  CLUBES.forEach(c=>{ c.nivHist=c.nivHist||c.niv; const f=fuerzaReal(c); c.fuerza=f;
    (porLiga[c.p]=porLiga[c.p]||[]).push(c); });
  Object.values(porLiga).forEach(l=>{
    const con=l.filter(c=>c.fuerza!=null).sort((a,b)=>b.fuerza-a.fuerza);
    const n=con.length;
    con.forEach((c,i)=>{ const q=i/n, r=q<0.15?5:q<0.35?4:q<0.65?3:q<0.85?2:1; c.niv=Math.round((r*2+c.nivHist)/3); });
  });
})();
