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
 vars:{res:50,dir:50,hin:50,ves:50},pool:[],decs:[],decIdx:0,cartas:[],
 formacion:null,estilo:null,calc:null,hist:[],puntos:0,usadas:[],tomadas:[],despidos:0,fijos:[],titulos:[],clubHincha:null,
 timer:null,estadio:1,exClub:null,rng:mul32(hashS("x"+Math.random()))};}

/* ==========================================================
   PLANTEL
   ========================================================== */
// el nivel de una categoria formativa esta MUY por debajo de primera
function nivelBaseDe(niv,div){
  const porDiv=[-26,-18,-10,0][div];
  return 36 + niv*7 + porDiv;
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
  return {nom:R.el(P.n)+" "+R.el(P.a),g,rt:clamp(Math.round(base+R.e(-7,7)),20,94),
          ed:edad||edadPara(div===undefined?3:div)};
}
// cada plantel tiene un perfil: fuerte en una linea, flojo en otra.
// eso es lo que hace que elegir sistema importe de verdad.
function generarPlantel(base,div,perfil,pais){
  const p=[];
  const sesgo = perfil || (()=>{
    const s={POR:0,DEF:0,MED:0,ATA:0};
    const gs=R.mz(["DEF","MED","ATA"]);
    s[gs[0]]=R.e(7,13); s[gs[1]]=R.e(-3,3); s[gs[2]]=R.e(-13,-7);
    s.POR=R.e(-4,4);
    return s;
  })();
  [["POR",2],["DEF",5],["MED",6],["ATA",3]].forEach(([g,n])=>{
    for(let i=0;i<n;i++){
      // el titular del puesto es mejor que el suplente
      const escalon = i===0?4 : i===1?0 : -6;
      p.push(nuevoJugador(g,base+sesgo[g]+escalon,div,null,pais));
    }
  });
  p.perfil=sesgo;
  return p;
}
// arma el once para una formación: mejor jugador disponible por grupo; si falta, va fuera de posición (-10)
function armarOnce(plantel,formacion,fijos){
  const slots=ONCE[formacion];
  const usados=new Set(); const once=[];
  const F=fijos||[];
  slots.forEach((sl,i)=>{
    const rol=ROL[sl[0]];
    // primero los que el DT puso a mano
    let cand=plantel.map((j,idx)=>({j,idx}))
      .filter(o=>!usados.has(o.idx)&&o.j.g===rol.g&&F.includes(o.j))
      .sort((a,b)=>b.j.rt-a.j.rt)[0];
    if(!cand) cand=plantel.map((j,idx)=>({j,idx})).filter(o=>!usados.has(o.idx)&&o.j.g===rol.g)
      .sort((a,b)=>b.j.rt-a.j.rt)[0];
    let fuera=false;
    if(!cand){
      cand=plantel.map((j,idx)=>({j,idx})).filter(o=>!usados.has(o.idx)).sort((a,b)=>b.j.rt-a.j.rt)[0];
      fuera=true;
    }
    usados.add(cand.idx);
    once.push({rol:sl[0],x:sl[1],y:sl[2],jug:cand.j,rt:fuera?Math.max(28,cand.j.rt-10):cand.j.rt,fuera});
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
