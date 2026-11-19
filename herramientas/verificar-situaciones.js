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
 assert.equal(new Set(SITUACIONES.map(s=>s.p).concat(SOLUCIONES_SALIDA.map(s=>s.p),SOLUCIONES_PRESION.map(s=>s.p),SOLUCIONES_DEFENSA.map(s=>s.p),SOLUCIONES_PROGRESION.map(s=>s.p),SOLUCIONES_FINALIZACION.map(s=>s.p),SOLUCIONES_RECUPERAR.map(s=>s.p),SOLUCIONES_PERDER.map(s=>s.p),SOLUCIONES_PARADA.map(s=>s.p))).size,N_PRINCIPIOS,'todo principio tiene al menos un problema');
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
test('el dial de riesgo no toca nada en equilibrada, abre o cierra el partido en las demás y depende del rival',()=>{
 assert.deepEqual(factoresPostura({e:'Posesion'},'equilibrada'),{yo:1,el:1});
 const contra={modelo:{ofe:'directo',tofe:'contra'}},pelota={modelo:{ofe:'posicional',tofe:'ataque'}};
 assert.ok(factoresPostura(contra,'ambiciosa').el>factoresPostura(pelota,'ambiciosa').el,'la contra castiga al que se abre');
 assert.ok(factoresPostura(pelota,'segura').el>factoresPostura(contra,'segura').el,'el que tiene la pelota castiga al que se cierra');
 assert.ok(factoresPostura(contra,'todo').yo>factoresPostura(contra,'ambiciosa').yo&&factoresPostura(contra,'segura').yo<1);
 const prev=S._post,vistos=[];S._post={n:0,fa:1.2,fb:.8};const rng=S.rng;S.rng=()=>.5;
 poisson(1);poisson(1);poisson(1);assert.equal(S._post.n,3);S._post=prev;S.rng=rng;
});
test('el generador de defensa organizada cubre sus arquetipos con una orden correcta',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 const vistos=new Set(),sols=new Set();let i=0;
 for(const miF of ['4-3-3','5-3-2','4-4-2','3-5-2'])for(const def of ['alto','medio','bajo'])for(const elF of ['4-4-2','4-3-3','4-2-3-1','3-4-3'])for(const ofe of ['posicional','directo'])for(const cre of [50,70])for(let r=0;r<3;r++){
  const c={yo:{f:miF,attrs:[60,60,60,60],once,m:{ofe:'posicional',def}},el:{club:{n:'C'+r},f:elF,attrs:[55,cre,55,55],m:{ofe,def:'medio',tdef:'repliegue',tofe:'contra'}},crack:null};
  const s=generarDefensa(c,'d|'+(i++)),B=s.A;vistos.add(JSON.stringify(B));
  assert.ok(s.ops.length>=3&&s.ops.some(o=>o.L===1),'una correcta: '+JSON.stringify(B));assert.equal(new Set(s.ops.map(o=>o.sol)).size,s.ops.length);assert.ok(PRINCIPIOS[s.p]);
  s.ops.forEach((o,k)=>{sols.add(o.sol);Object.keys(o.mv).forEach(j=>assert.ok(s.mi[j],o.sol+' '+j));const x=resolverSituacion(s,c,k,'z');assert.ok(x.mult>=.94&&x.mult<=1.08);});
 }
 assert.ok(vistos.size>=20,'arquetipos de defensa: '+vistos.size);assert.ok(sols.size>=11,'soluciones usadas: '+sols.size);
 console.log('   arquetipos de defensa: '+vistos.size+' · soluciones usadas: '+sols.size+'/'+SOLUCIONES_DEFENSA.length);
});
test('los generadores de ataque, transición y pelota parada cubren todos sus arquetipos con la respuesta del mazo',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 [['prog',generarProgresion,CASOS_PROGRESION,SOLUCIONES_PROGRESION],['fin',generarFinalizacion,CASOS_FINALIZACION,SOLUCIONES_FINALIZACION],['rec',generarRecuperar,CASOS_RECUPERAR,SOLUCIONES_RECUPERAR],['per',generarPerder,CASOS_PERDER,SOLUCIONES_PERDER],['pp',generarParada,CASOS_PARADA,SOLUCIONES_PARADA]].forEach(([fam,gen,CASOS,CAT])=>{
  const casos=new Set(),sols=new Set();let i=0;
  CASOS.forEach(k=>[2,3,4].forEach(j=>assert.ok(CAT.find(s=>s.id===k[j]),fam+' '+k[j])));
  for(const miF of ['4-3-3','4-4-2','3-5-2 / 5-3-2','4-2-3-1'])for(const elF of ['4-4-2','4-3-3','4-2-3-1','5-4-1','3-4-3','3-5-2 / 5-3-2'])for(const ofe of ['posicional','directo'])for(const def of ['alto','medio','bajo'])for(const tdef of ['presion','repliegue'])for(let r=0;r<2;r++){
   const c={yo:{f:miF,attrs:[60,60,60,60],once,m:{ofe,def:['alto','medio','bajo'][(i>>1)%3],tdef:['presion','repliegue'][i%2]}},el:{club:{n:'R'+r+elF},f:elF,attrs:r?[65,65,65,65]:[55,55,55,55],m:{ofe:['directo','posicional'][(i>>2)%2],def,tdef,tofe:'contra'}},crack:null};
   const s=gen(c,fam+'|'+(i++)),k=CASOS[s.A.caso];casos.add(s.A.caso);
   assert.ok(s.ops.length>=3&&s.ops.length<=4);assert.equal(s.ops.filter(o=>o.L===1).length,1,'una sola correcta');assert.equal(s.ops.find(o=>o.L===1).sol,k[2],'la buena es la del mazo');
   assert.ok(s.ops.some(o=>o.sol===k[4]&&o.L===0),'la trampa siempre está');assert.equal(new Set(s.ops.map(o=>o.sol)).size,s.ops.length);assert.ok(PRINCIPIOS[s.p]);
   assert.ok(typeof s.rel(c)==='string'&&s.rel(c).length>10&&nombreArquetipo(s.A).length>5);
   s.ops.forEach((o,j)=>{sols.add(o.sol);assert.ok(o.t.length===3&&o.pq.length===3&&o.pq[0].length>5&&o.b.length>=2);Object.keys(o.mv).forEach(x=>assert.ok(s.mi[x],o.sol+' '+x));
    const x=resolverSituacion(s,c,j,'w');assert.ok(x.mult>=.94&&x.mult<=1.08&&x.quien.rt>0);});
  }
  assert.equal(casos.size,CASOS.length,fam+' arquetipos: '+casos.size);assert.equal(sols.size,CAT.length,fam+' soluciones: '+sols.size);
  console.log('   '+fam+': '+casos.size+' arquetipos · '+sols.size+' soluciones');
 });
});
test('cada DT rival tiene una escuela fija y su escuela decide qué problemas te plantea',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','ED','EI','DC'].map((rol,i)=>({rol,rt:50+i,jug:{nom:'Nombre Apellido'+i}}));
 const vistos=new Set();
 for(const e of ['Posesion','Presion alta','Contraataque / Directo','Bloque bajo / Repliegue'])for(let k=0;k<12;k++){const m=modeloDeEstilo(e),p=perfilDT({n:'Club'+k},m);
  assert.ok(PERFILES_DT[p]);assert.equal(perfilDT({n:'Club'+k},m),p,'siempre el mismo');vistos.add(p);}
 for(const m of [{ofe:'posicional',def:'bajo'},{ofe:'directo',def:'alto'}])for(let k=0;k<12;k++)vistos.add(perfilDT({n:'Club'+k},m));
 assert.equal(vistos.size,Object.keys(PERFILES_DT).length,'las siete escuelas aparecen: '+vistos.size);
 Object.entries(PERFILES_DT).forEach(([p,P])=>{assert.ok(P.n.length===3&&P.d.length===3);const cuenta={};
  for(let i=0;i<400;i++){const f=familiaPorPerfil(p,'x'+i);assert.ok(P.fams[f],p+' '+f);cuenta[f]=(cuenta[f]||0)+1;}
  const top=Object.entries(P.fams).sort((a,b)=>b[1]-a[1])[0][0];assert.ok(cuenta[top]>=Math.max(...Object.values(cuenta))*0.7,p+' respeta su peso');
  Object.keys(P.fams).forEach(f=>{const c={yo:{f:'4-3-3',attrs:[60,60,60,60],once,m:{ofe:'posicional',def:'medio'}},el:{club:{n:'Z'},f:'4-4-2',attrs:[55,55,55,55],m:{ofe:'directo',def:'medio',tdef:'presion',tofe:'contra'}},crack:null};
   const s=GENERADOR_FAMILIA[f](c,'dt|'+f);assert.ok(s&&s.gen&&s.ops.some(o=>o.L===1),f);});
 });
 assert.notEqual(familiaPorPerfil('intenso','y',null),undefined);
 console.log('   escuelas: '+vistos.size);
});
test('en el partido en vivo la postura pesa en cada tiempo y se puede cambiar en el entretiempo',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','EXD','EXI','DC'].map((rol,i)=>({rol,rt:60,jug:{nom:'Nombre Apellido'+i}}));
 const eq=(yo,e)=>({club:{n:yo?'Yo':'El'},yo,f:'4-3-3',e,attrs:[60,60,60,60],once,auto:0,coh:1,emp:0,modelo:modeloDeEstilo(e),an:yo?{mis:[],sus:[]}:undefined});
 const goles=(post,desde)=>{const prev=S.postura,rng=S.rng,vivo=tmp.vivo;S.postura=post;S.rng=mul32(7);tmp.vivo=null;let a=0,b=0;
  for(let i=0;i<1500;i++){const r=jugarMitad(eq(true,'Posesion'),eq(false,'Contraataque / Directo'),true,desde,desde+44);r.ev.forEach(e=>{if(e.t==='gol')e.l==='a'?a++:b++;});}
  S.postura=prev;S.rng=rng;tmp.vivo=vivo;return [a,b];};
 const pcp=patronesConfianzaPicardia;patronesConfianzaPicardia=(e,r,p)=>p;
 const eqv=goles('equilibrada',1),todo=goles('todo',1),seg=goles('segura',1);
 assert.ok(todo[0]>eqv[0]*1.15&&todo[1]>eqv[1]*1.2,'todo o nada abre el partido: '+todo+' vs '+eqv);
 assert.ok(seg[0]<eqv[0]&&seg[1]<eqv[1],'segura lo cierra: '+seg+' vs '+eqv);
 assert.equal(S._post,null,'no deja la postura pegada');
 const rng=S.rng;S.rng=mul32(9);tmp.vivo={post2:'todo',info:{rival:{club:{n:'El'}}}};let a=0;for(let i=0;i<800;i++)a+=jugarMitad(eq(true,'Posesion'),eq(false,'Contraataque / Directo'),true,46,90).ev.filter(e=>e.t==='gol'&&e.l==='a').length;
 S.rng=mul32(9);tmp.vivo.post2='segura';let c=0;for(let i=0;i<800;i++)c+=jugarMitad(eq(true,'Posesion'),eq(false,'Contraataque / Directo'),true,46,90).ev.filter(e=>e.t==='gol'&&e.l==='a').length;
 tmp.vivo=null;S.rng=rng;patronesConfianzaPicardia=pcp;assert.ok(a>c*1.3,'la postura del entretiempo manda en el segundo tiempo: '+a+' vs '+c);
});
test('el mundo responde: cambian los DT, el rival te lee, sin ayudante paga más y el resultado se explica',()=>{
 const once=['POR','DFC','DFC','LTD','LTI','MCD','MC','MC','EXD','EXI','DC'].map((rol,i)=>({rol,rt:60,jug:{nom:'Nombre Apellido'+i}}));
 const club={n:'Club Prueba'},prevI=S.identR,prevD=S.dts,prevM=S.memoriaDT,prevN=S.noticiasDT,prevT=S.temp,prevS=S.sinAyudante,prevU=S.ultimaSituacion;
 S.identR={'Club Prueba':{f:'4-4-2',e:'Bloque bajo / Repliegue'}};S.dts={};S.noticiasDT=[];S.temp={equipos:[{club,e:'Bloque bajo / Repliegue'}]};
 const antes=perfilDT(club,modeloDeEstilo('Bloque bajo / Repliegue')),txt=cambiarDT(club,'echado'),despues=perfilDT(club,modeloDeEstilo('Posesion'));
 assert.notEqual(antes,despues,'cambia la escuela');assert.equal(S.identR['Club Prueba'].e,ESTILO_DE_PERFIL[despues],'cambia cómo juega');assert.equal(S.temp.equipos[0].e,ESTILO_DE_PERFIL[despues]);
 assert.ok(/Echaron/.test(txt)||/sacked/.test(txt)||/Demitiram/.test(txt));assert.equal(S.noticiasDT.length,1);
 const c={yo:{f:'4-3-3',attrs:[60,60,60,60],once,m:{ofe:'posicional',def:'medio'}},el:{club,f:'4-4-2',attrs:[55,55,55,55],m:{ofe:'directo',def:'bajo',tdef:'repliegue',tofe:'contra'}},crack:null};
 const s0=generarProgresion(c,'leo-base'),mem={id:s0.id,nom:nombreArquetipo(s0.A),t:s0.ops[0].t,trampa:true};
 S.memoriaDT={'Club Prueba':mem};S.ultimaSituacion=null;let hallado=null;
 for(let i=0;i<40&&!hallado;i++){const s=elegirSituacionPara(c,'leo|'+i);if(s&&s.recuerdo)hallado=s;}
 assert.ok(hallado,'el DT vuelve a plantar la trampa');assert.equal(nombreArquetipo(hallado.A),mem.nom);
 S.memoriaDT={};
 S.sinAyudante=false;const a=resolverSituacion(s0,c,s0.ops.findIndex(o=>o.L===1),'premio|1');S.sinAyudante=true;const b=resolverSituacion(s0,c,s0.ops.findIndex(o=>o.L===1),'premio|1');
 if(a.mult>1)assert.ok(b.mult>a.mult&&b.sinAyudante,'sin ayudante paga más');else assert.equal(a.mult,b.mult,'el castigo no cambia');
 const jor=(gf,gc,lectura,sale)=>({k:3,sit:{lectura,sale,mult:lectura===1&&sale?1.06:.96,t:['Pausa','Pausa','Pause']},res:[{yo:true,A:{yo:true,club:{n:'Yo'}},B:{club:{n:'El'}},ga:gf,gb:gc}]});
 assert.ok(/banco/.test(porQueResultado(jor(1,0,1,true)).txt)&&porQueResultado(jor(1,0,1,true)).clave==='gano');
 assert.equal(porQueResultado(jor(0,1,0,false)).clave,'trampa');assert.equal(porQueResultado(jor(0,1,1,false)).clave,'ejecucion');assert.equal(porQueResultado(jor(2,1,0,true)).clave,'zafo');
 assert.equal(porQueResultado({k:1,sit:{auto:true,mult:1.04},res:[]}),null);
 S.identR=prevI;S.dts=prevD;S.memoriaDT=prevM;S.noticiasDT=prevN;S.temp=prevT;S.sinAyudante=prevS;S.ultimaSituacion=prevU;
});
console.log('REGRESIÓN SITUACIONES V16: '+n+' pruebas.');
`);
