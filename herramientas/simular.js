// Simulador headless: corre el motor sin navegador para verificar balance.
// Uso:  node herramientas/simular.js
const fs=require('fs'), path=require('path');
const raiz=path.join(__dirname,'..');
const orden=['tactica','decisiones','datos','nucleo','ui','juego'];
let js=orden.map(f=>fs.readFileSync(path.join(raiz,'js',f+'.js'),'utf8')).join('\n')
  .replace(/\nportada\(\);\n/,'\n');

const stub={style:{},classList:{add:()=>{},remove:()=>{}},querySelectorAll:()=>[],
  addEventListener:()=>{},dataset:{}};
global.window={matchMedia:()=>({matches:true}),scrollTo:()=>{}};
global.document={querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,
  createElement:()=>stub,body:{appendChild:()=>{},removeChild:()=>{}}};
global.navigator={};
global.setInterval=()=>0; global.clearInterval=()=>{}; global.setTimeout=(f)=>{f();return 0};

eval(js + `
// ---- pruebas ----
console.log('CONTENIDO');
console.log('  clubes:',CLUBES.length,'| ligas:',PAISES.length,'| decisiones:',POOL.length,
            '| formaciones:',FORMACIONES.length);

console.log('');
console.log('RULETA — '+SEGMENTOS.length+' casillas');
const c={}; SEGMENTOS.forEach(s=>c[s.lbl]=(c[s.lbl]||0)+1);
Object.entries(c).forEach(([l,n])=>console.log('  '+l.padEnd(20)+n+'  '+(n/SEGMENTOS.length*100).toFixed(1)+'%'));

console.log('');
console.log('MATRIZ DE MATCHUP — control de antisimetría (cada par debe sumar 2.00)');
let malos=0;
FORMACIONES.forEach(a=>FORMACIONES.forEach(b=>{
  const s=MATCHUP[a][b]+MATCHUP[b][a];
  if(Math.abs(s-2)>0.001){console.log('  MAL:',a,'vs',b,'=',s.toFixed(3));malos++;}
}));
console.log(malos?'  '+malos+' pares rotos':'  todos los pares suman 2.00');

console.log('');
console.log('EL SISTEMA CAMBIA LOS ATRIBUTOS');
S=nuevo(); S.rng=mul32(hashS('sim')); S.club=CLUBES[0]; S.division=3; S.fijos=[];
const pl=generarPlantel(65,3,null,'Uruguay');
let mej=null,peo=null;
FORMACIONES.forEach(f=>{
  const a=atributosDe(armarOnce(pl,f,[])), p=PESOS[f];
  const base=(a[0]*p[0]+a[1]*p[1]+a[2]*p[2]+a[3]*p[3])/(p[0]+p[1]+p[2]+p[3]);
  if(!mej||base>mej.v)mej={f,v:base}; if(!peo||base<peo.v)peo={f,v:base};
  console.log('  '+f.padEnd(15)+ATRIBUTOS.map((n,i)=>n[0]+String(a[i]).padStart(3)).join(' ')+'  base '+base.toFixed(1));
});
console.log('  brecha entre el mejor y el peor sistema: '+(mej.v-peo.v).toFixed(1)+' puntos');
`);
