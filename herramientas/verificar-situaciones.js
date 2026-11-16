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
 assert.equal(new Set(SITUACIONES.map(s=>s.p)).size,N_PRINCIPIOS);
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
console.log('REGRESIÓN SITUACIONES V16: '+n+' pruebas.');
`);
