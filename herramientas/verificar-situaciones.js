// Regresión v16: los problemas de partido son coherentes y no tocan el azar de la simulación.
const assert=require('assert');
eval(require('./carga.js').codigo()+`
let n=0;const test=(t,f)=>{f();n++;console.log('OK '+t);};
test('cada problema tiene un principio, tres órdenes y una sola lectura correcta',()=>{
 const ctx={yo:{f:'4-3-3',attrs:[60,60,60,60],once:[],m:{ofe:'posicional',def:'alto',tdef:'presion',tofe:'ataque'}},el:{f:'5-3-2',attrs:[60,60,60,60],m:{ofe:'directo',def:'bajo',tdef:'repliegue',tofe:'contra'}},crack:{rt:70,rol:'ED',nom:'A B'}};
 SITUACIONES.forEach(s=>{assert.ok(PRINCIPIOS[s.p],s.id);
  [ctx,Object.assign({},ctx,{yo:Object.assign({},ctx.yo,{m:{ofe:'directo',def:'bajo'}})})].forEach(c=>{const ops=opsDe(s,c);assert.equal(ops.length,3,s.id);
   assert.equal(ops.filter(o=>o.L===1).length,1,s.id+' una correcta');assert.ok(ops.every(o=>[0,.5,1].includes(o.L)&&o.g instanceof RegExp&&o.vs>=0&&o.vs<4&&o.t.length===3&&o.pq.length===3),s.id);
   ops.forEach(o=>Object.keys(o.mv||{}).forEach(i=>assert.ok(s.mi[i],s.id+' ficha '+i)));});
  assert.equal(typeof s.cuando(ctx),'boolean',s.id);});
 assert.equal(new Set(SITUACIONES.map(s=>s.p).concat(SOLUCIONES_SALIDA.map(s=>s.p))).size,N_PRINCIPIOS,'todo principio tiene al menos un problema');
});
test('leer bien nunca rinde menos que leer mal, y ejecutar bien nunca menos que fallar',()=>{
 for(let l=0;l<3;l++){assert.ok(EFECTO_SIT[l][1]>=EFECTO_SIT[l][0]);if(l)assert.ok(EFECTO_SIT[l][0]>=EFECTO_SIT[l-1][0]&&EFECTO_SIT[l][1]>=EFECTO_SIT[l-1][1]);}
});
test('resolver un problema no consume el azar de la simulación y es reproducible',()=>{
 const rng=S.rng;S.rng=()=>{throw Error('no debe usar S.rng');};
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 const c={yo:{f:'4-3-3',attrs:[60,60,60,60],once,m:{ofe:'posicional',def:'alto'}},el:{f:'4-4-2',attrs:[55,55,55,55],m:{ofe:'directo',def:'alto',tofe:'contra'}},crack:{rt:70,rol:'ED',nom:'A B'}};
 SITUACIONES.forEach(s=>[0,1,2].forEach(k=>{const a=resolverSituacion(s,c,k,'x|1|3'),b=resolverSituacion(s,c,k,'x|1|3');
  assert.deepEqual([a.sale,a.mult,a.p],[b.sale,b.mult,b.p]);assert.ok(a.p>=.2&&a.p<=.85&&a.mult>=.95&&a.mult<=1.08&&a.quien.rt>0);}));
 S.rng=rng;
});
test('el generador de salida cubre muchos arquetipos y siempre ofrece una orden correcta, una segura y sus tres números',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 const vistos=new Set(),sols=new Set();let i=0;
 for(const miF of ['4-3-3','3-5-2','4-4-2'])for(const elF of ['4-4-2','4-3-3','4-2-3-1','5-4-1','3-4-3'])for(const def of ['alto','medio'])for(const tdef of ['presion','repliegue'])for(const nom of ['A','B','C','D','E','F','G','H']){
  const c={yo:{f:miF,attrs:[60,60,60,60],once,m:{ofe:'posicional',def:'medio'}},el:{club:{n:nom},f:elF,attrs:[55,55,55,55],m:{ofe:'directo',def,tdef,tofe:'contra'}},crack:null};
  const s=generarSalida(c,'k|'+(i++)),A=s.A;vistos.add([A.dif,A.libre,A.hombre?'h':A.emp,A.alto].join('|'));
  assert.ok(s.ops.length>=3&&s.ops.length<=4,'entre 3 y 4 órdenes');assert.ok(s.ops.some(o=>o.L===1),'una correcta: '+JSON.stringify(A));
  assert.equal(new Set(s.ops.map(o=>o.sol)).size,s.ops.length,'sin repetidas');assert.ok(PRINCIPIOS[s.p]);
  s.ops.forEach(o=>{sols.add(o.sol);assert.ok(o.premio>=0&&o.premio<=.08&&o.costo>0&&o.costo<=.06&&RIESGO_SALIDA[o.riesgo]);Object.keys(o.mv).forEach(k=>assert.ok(s.mi[k],'ficha '+k+' en '+o.sol));
   const r=resolverSituacion(s,c,s.ops.indexOf(o),'x');assert.ok(r.mult>=.94&&r.mult<=1.08);});
 }
 assert.ok(vistos.size>=14,'arquetipos distintos: '+vistos.size);assert.equal(sols.size,SOLUCIONES_SALIDA.length,'todas las soluciones aparecen: '+sols.size);
 console.log('   arquetipos generados: '+vistos.size+' · soluciones usadas: '+sols.size);
});
test('el generador de presión siempre ofrece una orden correcta y usa todo su catálogo',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 const vistos=new Set(),sols=new Set();let i=0;
 for(const miF of ['4-3-3','3-5-2','4-4-2','4-2-3-1'])for(const elF of ['4-4-2','4-3-3','4-2-3-1','5-4-1','3-4-3','3-5-2'])for(const ofe of ['posicional','directo'])for(const cre of [50,65])for(let r=0;r<6;r++){
  const c={yo:{f:miF,attrs:[60,60,60,60],once,m:{ofe:'posicional',def:'alto'}},el:{club:{n:'X'},f:elF,attrs:[55,cre,55,55],m:{ofe,def:'medio',tdef:'repliegue',tofe:'contra'}},crack:null};
  const s=generarPresion(c,'p|'+(i++)),B=s.A;vistos.add([B.cb,B.piv,B.pies,B.corto,B.dif].join('|'));
  assert.ok(s.ops.length>=3&&s.ops.some(o=>o.L===1),'una correcta: '+JSON.stringify(B));assert.equal(new Set(s.ops.map(o=>o.sol)).size,s.ops.length);assert.ok(PRINCIPIOS[s.p]);
  s.ops.forEach((o,k)=>{sols.add(o.sol);Object.keys(o.mv).forEach(j=>assert.ok(s.mi[j]));const x=resolverSituacion(s,c,k,'y');assert.ok(x.mult>=.94&&x.mult<=1.08);});
 }
 assert.ok(vistos.size>=16,'arquetipos de presión: '+vistos.size);assert.equal(sols.size,SOLUCIONES_PRESION.length,'soluciones usadas: '+sols.size);
 console.log('   arquetipos de presión: '+vistos.size+' · soluciones usadas: '+sols.size);
});
console.log('REGRESIÓN SITUACIONES V16: '+n+' pruebas.');
`);
