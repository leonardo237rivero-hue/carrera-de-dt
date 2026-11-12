const assert=require('assert/strict'),{codigo}=require('./carga');
eval(codigo()+`\n
function fixture(){S=nuevo();tmp={};S.nombre='Prueba';S.arq=ARQ[0];S.rng=mul32(123);S.club={...CLUBES.find(c=>c.n==='Peñarol')};S.division=3;S.formacion='4-3-3';S.sistemaPref=S.formacion;S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);S.plan=planDelModelo(S.modelo);S.plantel=generarPlantel(70,3,null,S.club.p,S.club.n);S.plantel.forEach(j=>{j.les=0;j.sus=0;});prepararIdentidadDT();S.calc={pos:4,exp:8,equipos:12,rel:4,titulos:[],dDir:0,dHin:0};S.temp={mis:[]};}
function test(n,f){f();console.log('OK',n);}
const selectorReal=mostrarSelectorOnce;let selectorSlot;
mostrarSelectorOnce=slot=>{selectorSlot=slot;};
function render(){vistaGestion(S.formacion,'qaRender');}
window.qaRender=render;
test('acciones reales: banco a titular, titular a banco y once automático',()=>{
 fixture();render();const antes=window.__once.map(o=>o.jug.nom),i=window.__banco.findIndex(j=>encaje(j,window.__once[0].rol)<2),entra=window.__banco[i];
 elegirBanco(i);assert.equal(selectorSlot,null);assert.equal(tmp.selBanco,entra);assert(reemplazar(0));
 assert.equal(window.__once[0].jug,entra);assert.deepEqual(window.__once.slice(1).map(o=>o.jug.nom),antes.slice(1));assert.equal(new Set(window.__once.map(o=>o.jug)).size,11);
 verJugadorInterior(0,false);assert.equal(selectorSlot,0);const vuelve=window.__banco.findIndex(j=>j.nom===antes[0]);cambiarDesdeTitular(0,vuelve);assert.deepEqual(window.__once.map(o=>o.jug.nom),antes);
 onceAutomatico();assert.equal(S.onceFijado,null);assert.deepEqual(S.fijos,[]);
});
test('incompatible o lesionado no altera el once; sistema visible vence al cambio anterior',()=>{
 fixture();render();const antes=window.__once.map(o=>o.jug.nom);tmp.selBanco=window.__banco.find(j=>j.g!=='POR');assert.equal(reemplazar(0),false);assert.deepEqual(window.__once.map(o=>o.jug.nom),antes);
 const por=window.__banco.find(j=>j.g==='POR');por.les=2;tmp.selBanco=por;assert.equal(reemplazar(0),false);por.les=0;
 tmp.cambio='4-4-2';tmp.selBanco=por;assert(reemplazar(0));assert.equal(S.onceFijado.f,'4-3-3');
});
test('mismo resultado, distinto tamaño: lectura y consecuencias diferentes',()=>{
 fixture();S.club.niv=1;assert.equal(datosEdicion().tipo,'revelacion');assert.deepEqual(presionCierreClub(S.calc),{id:'chico',dir:3,hin:3});
 S.club.niv=5;assert.equal(datosEdicion().tipo,'exigencia');assert.deepEqual(presionCierreClub(S.calc),{id:'grande',dir:-3,hin:-2});
 S.division=0;assert.equal(contextoInstitucional(S.club,S.division,false).id,'cantera');assert.equal(presionCierreClub(S.calc).dir,0);
});
test('portada estable, cuatro ediciones distintas, sin consumir azar',()=>{
 fixture();S.club.niv=1;const inicial=cronicaTemporada();assert.equal(cronicaTemporada(),inicial);const aleatorio=S.rng.estado();const titulares=new Set();
 for(let t=1;t<=4;t++){S.temporada=t;titulares.add(datosEdicion().headline);cronicaTemporada();}assert.equal(titulares.size,4);assert.equal(S.rng.estado(),aleatorio);
 assert.equal(Object.keys(TITULARES_EDICION).length,16);Object.values(TITULARES_EDICION).forEach(id=>{assert.equal(id.length,3);id.forEach(l=>assert.equal(new Set(l).size,4));});
});
test('la exigencia modifica el cierre real, y un histórico no depende sólo del nivel',()=>{
 fixture();S.club.niv=5;const c={...S.calc,dRes:0,pts:0},d=S.vars.dir,h=S.vars.hin;aplicarCierre(c);assert.equal(S.vars.dir,d-3);assert.equal(S.vars.hin,h-2);assert.equal(c.antes.dir,d);
 assert.equal(contextoInstitucional({n:'Racing Club',niv:4},3,false).id,'grande');assert.equal(contextoInstitucional({n:'Racing Club',niv:4},0,false).id,'cantera');
 fixture();S.club.niv=1;S.calc.pos=9;S.calc.exp=7;assert.equal(datosEdicion().tipo,'crisis');
});
test('títulos, último, copa y cantera dan relatos coherentes',()=>{
 fixture();S.club.niv=1;S.calc.titulos=[{tipo:'liga',comp:'Liga'}];S.calc.pos=1;assert.equal(datosEdicion().tipo,'hazana');assert.equal(datosEdicion().foto,'festejo');assert(bajadaEdicion(datosEdicion()).includes('1º de 12'));
 S.hist=[{t:S.temporada-1,club:S.club.n,tit:['liga']}];assert.equal(datosEdicion().tipo,'dinastia');S.hist[0].club='Otro';assert.equal(datosEdicion().tipo,'hazana');
 S.calc.titulos=[];S.calc.ultimo=true;assert.equal(datosEdicion().tipo,'ultimo');assert.equal(datosEdicion().foto,'cierre-vestuario');
 S.calc.ultimo=false;S.calc.pos=null;S.calc.copaFinal=true;assert.equal(datosEdicion().tipo,'finalista');S.calc.copaFinal=false;assert.equal(datosEdicion().tipo,'eliminacion');
 S.division=1;S.calc.titulos=[{tipo:'liga',comp:'Juveniles'}];assert.equal(datosEdicion().tipo,'formacion');
});
test('datos reales y texto del usuario escapado, sin cifras inventadas',()=>{
 fixture();S.temp.mis=[{gf:2,gc:0,rival:{n:'Rival'},clasico:true},{gf:0,gc:3,rival:{n:'Otro'}}];S.diarioDT=[{tipo:'charla',t:S.temporada,club:S.club.n,texto:'<script>una charla propia</script>'}];
 assert.deepEqual(datosEdicion().balance,{pj:2,g:1,e:0,p:1,gf:2,gc:3,ceros:1});const html=cronicaTemporada();assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(!/undefined|NaN/.test(html));assert(notasEdicion(datosEdicion()).some(n=>n.id==='clasico'));
});
console.log('REGRESIÓN EDICIÓN V14.2 COMPLETA');
`);
