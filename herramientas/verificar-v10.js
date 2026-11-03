// Regresión reproducible, sin navegador ni dependencias. node herramientas/verificar-v10.js
const assert=require('assert/strict'),{codigo}=require('./carga');
eval(codigo()+`\n
function prueba(n,f){f();console.log('OK',n);}
function fixture(seed){
 S=nuevo();tmp={};S.rng=mul32(hashS(seed||'v10'));S.nombre='Prueba';S.arq=ARQ[1];
 S.club=Object.assign({},CLUBES.find(c=>c.n==='Peñarol'));S.division=3;
 S.formacion='4-3-3';S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);
 S.sistemaPref=S.formacion;S.estiloPref=S.estilo;S.auto=30;S.plan=planDelModelo(S.modelo);
 S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p,S.club.n);prepararIdentidadDT();
}
prueba('cursor RNG reanudable sin cambiar la secuencia',()=>{const r=mul32(7);r();r();const rr=mul32(r.estado());assert.equal(rr(),r());assert.equal(rr(),r());});
prueba('el ADN y el aprendizaje sobreviven a una orden de partido',()=>{
 fixture();const rival=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3),mem=JSON.stringify(S.memoriaPrincipios),adn=JSON.stringify(S.modeloPref);
 S.enfasis={rival:rival.club.n,cargar:['bandaI'],cerrar:['tercer']};const eq=miEquipo(rival);
 assert(Number.isFinite(eq.mult));assert.equal(JSON.stringify(S.memoriaPrincipios),mem);assert.equal(JSON.stringify(S.modeloPref),adn);
 const nuevo=copiaModelo(S.modelo);nuevo.ofe='directo';assert(automatismosDe(nuevo)<automatismosDe(S.modelo));assert.equal(afinidadADN(nuevo),.75);
});
prueba('la formación dejó de certificar el estilo',()=>{Object.values(FIT).forEach(tab=>Object.values(tab).forEach(v=>assert(v>=.96&&v<=1.04)));});
prueba('cambiar de club conserva al DT sin entrenar mágicamente otro plantel',()=>{fixture();S.memoriaPrincipios.ofe[S.modelo.ofe]=90;const club=S.club,adn=JSON.stringify(S.modeloPref);S.club=CLUBES.find(c=>c.n==='Nacional');prepararIdentidadDT();assert.equal(S.memoriaPrincipios.ofe[S.modelo.ofe],30);assert.equal(JSON.stringify(S.modeloPref),adn);S.club=club;prepararIdentidadDT();assert.equal(S.memoriaPrincipios.ofe[S.modelo.ofe],90);});
prueba('lectura libre reconoce intención y respeta negación e incertidumbre',()=>{
 const a=lecturaDiscurso('Respiren tranquilos. Juntos cubrimos al compañero. Pase y salida por el lateral.');assert(a.segura);assert(a.grupo);assert(a.concreta);
 assert.equal(lecturaDiscurso('No quiero bronca.').ranking.includes('bronca'),false);
 assert.equal(lecturaDiscurso('Algo nuevo sin claves conocidas').segura,false);
 assert(lecturaDiscurso('Ganamos seguro, somos equipo, juntos con la pelota y el pase.').garantia);
 assert(lecturaDiscurso('Partido a partido, respeto al rival').cassette);
});
prueba('edad visual y perfiles sin prohibir líderes jóvenes',()=>{fixture();S.edadInicio=35;const joven=retratoDT();S.anosDirigiendo=25;assert.equal(edadDT(),60);assert.notEqual(retratoDT(),joven);const j={nom:'Misma persona',ed:19};const c=caracter(j);assert.equal(caracter({nom:j.nom,ed:38}),c);});
prueba('lesionados y suspendidos nunca completan el once',()=>{fixture();S.plantel.slice(0,18).forEach(j=>j.les=3);const once=onceTemporada(S.plantel,S.formacion,[]);assert.equal(once.length,11);assert(once.every(o=>disponible(o.jug)));});
prueba('rival destacado no se convierte en clásico inventado',()=>{fixture();const c=clasicoDe(CLUBES.find(c=>c.n==='Talleres'));assert(!c.esClasicoReal);const real=clasicoDe(S.club);assert(real.esClasicoReal);assert.equal(real.n,'Nacional');});
prueba('penales: fatiga, temple, presión y rutina cambian probabilidades',()=>{
 fixture();const o={rol:'DC',rt:72,jug:{nom:'Prueba penal',ed:26,car:'nervioso',fat:0,forma:0}},desc=pPenal(o,0,70,true);o.jug.fat=90;assert(pPenal(o,4,70,true)<desc);
 tmp.vivo={pen:{fase:'tanda',tiros:[],mis:0,sus:0,rutina:'guiar'}};const guia=pPenal(o,0,70,true);tmp.vivo.pen.rutina='confiar';assert(guia>pPenal(o,0,70,true));tmp={};
});
prueba('simulación reproducible y retorno de resultados finitos',()=>{
 const partido=seed=>{fixture(seed);const rv=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3);return jugarPartido(miEquipo(rv),rv,false,true);};
 const a=partido('igual'),b=partido('igual');assert.deepEqual(a,b);assert(Number.isFinite(a.ga)&&Number.isFinite(a.Fa));
});
prueba('guardar y continuar conserva RNG, once fijado y futuras decisiones',()=>{
 fixture();const datos=new Map();global.localStorage={setItem:(k,v)=>datos.set(k,v),getItem:k=>datos.get(k)};
 S.pant='plantel';S.pool=POOL.slice();S.fijos=[S.plantel[0]];S.prensa=POLITICAS_PRENSA[1];S.edadInicio=49;guardarPretemporada();assert(leerGuardado());
 const siguiente=S.rng(),vp=verPlantel;verPlantel=()=>{};S=nuevo();continuarGuardado();verPlantel=vp;
 assert.equal(S.rng(),siguiente);assert.equal(S.fijos[0],S.plantel[0]);assert.equal(S.pool[0],POOL[0]);assert.equal(edadDT(),49);assert.equal(S.prensa.id,POLITICAS_PRENSA[1].id);
});
prueba('una opción filtrada aplica su efecto real, también fuera de español',()=>{
 fixture();S.arq=ARQ[0];S.decs=[['Caso','Prueba',[['A',0,0,0,0,'A'],['B',0,1,0,0,'B'],['C',0,0,2,0,'C']]]];S.decIdx=0;S.indicesActuales=[0,2];
 const query=document.querySelector,header=cabecera;document.querySelector=()=>({innerHTML:''});cabecera=()=>{};
 const idioma=IDIOMA;IDIOMA='pt';tomar(1);IDIOMA=idioma;assert.equal(S.tomadas[0].hin,2);assert.equal(S.tomadas[0].dir,0);document.querySelector=query;cabecera=header;
});
prueba('sin soporte de dictado se puede escribir el mismo discurso',()=>{assert.equal(motorDictado(),null);const html=editorDiscurso('arenga','Texto propio');assert(html.includes('Texto propio'));assert(html.includes('disabled'));});
prueba('simular destacado registra el partido una sola vez',()=>{
 fixture();const rv=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3);tmp.vivo={jor:{},info:{rival:rv,soyA:true,neutral:true,knock:true,titulo:'Prueba rápida'}};
 const query=document.querySelector;document.querySelector=()=>({innerHTML:''});simularDestacado();const res=JSON.stringify(tmp.vivo.res),cursor=S.rng.estado();simularDestacado();assert.equal(JSON.stringify(tmp.vivo.res),res);assert.equal(S.rng.estado(),cursor);document.querySelector=query;
 S.ritmo='rapido';assert.equal(partidoGrande({}),null);
});
let temporadas=0,partidos=0;
prueba('30 temporadas completas en 5 sistemas y 3 países',()=>{
 for(let i=0;i<30;i++){
  fixture('carrera'+i);S.club=Object.assign({},CLUBES.filter(c=>['Uruguay','Argentina','Brasil'].includes(c.p))[i%40]);
  S.formacion=FORMACIONES[i%FORMACIONES.length];S.estilo=ESTILOS[i%ESTILOS.length];S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);delete S.memoriaPrincipios;prepararIdentidadDT();S.plan=planDelModelo(S.modelo);
  armarTemporada();for(S.temp.j=0;S.temp.j<S.temp.jornadas.length;S.temp.j++){jugarJornada(S.temp.jornadas[S.temp.j]);partidos++;}
  const res=cerrarCalculoTemporada();assert(Number.isFinite(res.pts));aplicarCierre(res);assert.equal(automatismosDe(S.modelo),47);temporadas++;
 }
});
console.log('REGRESIÓN V10:',temporadas,'temporadas,',partidos,'jornadas.');
`);
