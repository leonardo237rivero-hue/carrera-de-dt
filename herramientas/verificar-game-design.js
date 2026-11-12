const assert=require('assert/strict'),{codigo}=require('./carga');
eval(codigo()+`\n
function fixture(){S=nuevo();tmp={};S.nombre='Prueba';S.arq=ARQ[0];S.rng=mul32(123);S.club=CLUBES.find(c=>c.n==='Peñarol');S.formacion='4-3-3';S.sistemaPref=S.formacion;S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);S.plan=planDelModelo(S.modelo);S.plantel=generarPlantel(70,3,null,S.club.p,S.club.n);prepararIdentidadDT();}
function test(n,f){f();console.log('OK',n);}
test('DFC no es lateral; sin ficha no se declara polivalencia natural',()=>{
 fixture();const central={nom:'Germán Pezzella',real:true,g:'DEF'};assert.deepEqual(posDe(central),['DFC']);assert.equal(encaje(central,'LTI'),2);
 const sinFicha={nom:'Sin ficha verificable',g:'DEF',real:true,pos:['LTI','DFC']};assert.equal(posDe(sinFicha).length,1);assert(posTxt(sinFicha).includes('provisional'));assert.equal(sinFicha.posVerificada,false);
});
test('una sustitución queda en su casillero y las bajas no duplican jugadores',()=>{
 fixture();let once=onceTemporada(S.plantel,S.formacion,[]);const por=S.plantel.filter(j=>j.g==='POR');por.forEach(j=>{j.les=0;j.sus=0;});
 const suplente=por.find(j=>j!==once[0].jug);const nombres=once.map(o=>o.jug.nom);nombres[0]=suplente.nom;S.onceFijado={club:S.club.n,f:S.formacion,puestos:nombres};S.fijos=S.plantel.filter(j=>nombres.includes(j.nom));
 once=onceTemporada(S.plantel,S.formacion,S.fijos);assert.equal(once[0].jug,suplente);assert.deepEqual(once.map(o=>o.jug.nom),nombres);
 once[4].jug.les=3;once=onceTemporada(S.plantel,S.formacion,S.fijos);assert(once.every(o=>disponible(o.jug)));assert.equal(new Set(once.map(o=>o.jug)).size,11);assert.equal(once[0].jug,suplente);
});
test('la superioridad depende de seguimiento, apoyos y cobertura; no borra ADN',()=>{
 fixture();const base={salida:'pivot',anchura:'abierta',cobertura:'equilibrio'},rv={f:'4-4-2',e:'Posesion'},mem=JSON.stringify(S.modeloPref);
 const libre=evaluarConstruccion(base,rv,50,S.modelo),seguido=evaluarConstruccion(base,{...rv,e:'Presion alta'},50,S.modelo);
 assert(libre.libre);assert(!seguido.libre);assert(libre.factor>seguido.factor);assert.equal(JSON.stringify(S.modeloPref),mem);
 assert(evaluarConstruccion({...base,cobertura:'arriesgar'},rv,50,S.modelo).riesgo>0);
 for(const salida of Object.keys(CONSTRUCCION_DT))for(const e of ESTILOS){const x=evaluarConstruccion({...base,salida},{...rv,e},100,S.modelo);assert(Number.isFinite(x.factor));assert(Math.abs(x.factor)<.04);}
});
test('charla propia afecta a los once, recuerda texto y no se cobra dos veces',()=>{
 fixture();const rival=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3);tmp.vivo={info:{rival,soyA:true,neutral:true,titulo:'Prueba'},marc:[0,0]};
 const A=prepararCharla(false);A.borrador='Juntos, con calma. Apoyo de cara y pase por fuera.';const senales={tarea:true,apoyo:true,amenaza:false,garantia:false};
 const inicial=evaluarCharla(A,senales,'grupo');assert.equal(inicial.reacciones.length,11);assert(aplicarCharlaPropia(A,senales,'grupo'));const diario=S.diarioDT.length,ves=S.vars.ves;
 assert.equal(aplicarCharlaPropia(A,senales,'grupo'),false);assert.equal(S.diarioDT.length,diario);assert.equal(S.vars.ves,ves);assert(A.once.every(o=>Number.isFinite(o.jug._ar)));
 const B=prepararCharla(false);B.borrador=A.borrador;const repetida=evaluarCharla(B,senales,'grupo');assert(repetida.repetida);assert(repetida.valor<inicial.valor);
 const amenaza=evaluarCharla(B,{...senales,amenaza:true},'grupo');assert(amenaza.valor<repetida.valor);
});
test('la charla del descanso tiene contexto y una aplicación independiente',()=>{
 fixture();const rival=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3),mio=miEquipo(rival);tmp.vivo={info:{rival,soyA:true,neutral:true,titulo:'Prueba'},A:mio,B:rival,marc:[0,2]};
 const A=prepararCharla(true);A.borrador='Respiren. Vamos juntos con un apoyo cerca.';aplicarCharlaPropia(A,{tarea:true,apoyo:true},'calma');assert(Number.isFinite(tmp.vivo.charlaDescansoV));assert(S.diarioDT.at(-1).intermedio);
});
test('compromiso incumplido pesa una vez y origen no puntúa',()=>{
 fixture();S.compromisoDT={club:S.club.n,tipo:'resultados'};S.calc={pts:3};S.biografiaDT={origen:'Una historia cualquiera'};const d=S.vars.dir;
 assert.equal(evaluarCompromisoDT().delta,-4);assert.equal(S.vars.dir,d-4);assert.equal(evaluarCompromisoDT(),null);
 S.temporada++;S.calc.pts=8;assert.equal(evaluarCompromisoDT().delta,3);
});
test('presentación antes de plantel y prensa sólo en contexto profesional',()=>{
 fixture();const old=[introClub,pantallaIdioma,presentacionPlantel,pantallaPrensa,abrirConferencia,verPlantel];let pasos=[];
 introClub=()=>pasos.push('club');pantallaIdioma=()=>pasos.push('idioma');presentacionPlantel=()=>pasos.push('grupo');pantallaPrensa=()=>pasos.push('politica');abrirConferencia=()=>pasos.push('prensa');verPlantel=()=>pasos.push('plantel');
 S.division=0;colaPrevia();S.introVisto=S.club.n;colaPrevia();S.langClub=S.club.n;colaPrevia();S.presentadoGrupo=S.club.n+'|0';colaPrevia();assert.deepEqual(pasos,(IDIOMA_REAL[S.club.p]||IDIOMA)===IDIOMA?['club','grupo','grupo','plantel']:['club','idioma','grupo','plantel']); // v13.3: mismo idioma, no se pregunta
 S.division=3;S.presentadoGrupo=S.club.n+'|3';S.prensaElegida=true;colaPrevia();assert.equal(pasos.at(-1),'prensa');
 [introClub,pantallaIdioma,presentacionPlantel,pantallaPrensa,abrirConferencia,verPlantel]=old;
});
test('idioma del vestuario no cambia los menús ni castiga al intérprete',()=>{
 fixture();const antes=IDIOMA,vars=JSON.stringify(S.vars);window.__sigueIdioma=()=>{};elegirIdiomaClub(false);assert.equal(IDIOMA,antes);assert.equal(JSON.stringify(S.vars),vars);assert(S.idiomaVestuario.interprete);
});
test('el legado congela el vínculo al salir y distingue un regreso',()=>{
 fixture();asegurarEtapa();S.temporada=2;S.vars.hin=82;cerrarEtapa('otroclub');S.club=CLUBES.find(c=>c.n==='Nacional');S.vars.hin=40;asegurarEtapa();assert.equal(S.etapasDT[0].hin,82);cerrarEtapa('despido');S.club=CLUBES.find(c=>c.n==='Peñarol');asegurarEtapa();assert.equal(S.etapasDT.length,3);assert.equal(S.etapasDT[1].salida,'despido');
});
test('la salida se aprende al jugar y queda guardada por club y principio',()=>{
 fixture();S.construccion={salida:'pivot',anchura:'abierta',cobertura:'equilibrio'};armarTemporada();
 const adn=JSON.stringify(S.modeloPref),antes=aprendizajeConstruccion(S.construccion);
 for(S.temp.j=0;S.temp.j<3;S.temp.j++)jugarJornada(S.temp.jornadas[S.temp.j]);
 const despues=aprendizajeConstruccion(S.construccion);assert(despues>antes);assert.equal(JSON.stringify(S.modeloPref),adn);
 S.construccion.salida='tercero';assert.equal(aprendizajeConstruccion(S.construccion),12);S.construccion.salida='pivot';assert.equal(aprendizajeConstruccion(S.construccion),despues);
 S.club=CLUBES.find(c=>c.n==='Nacional');assert.equal(aprendizajeConstruccion(S.construccion),12);
});
test('guardar v13 conserva vínculos, asignaciones, charla y aprendizaje',()=>{
 fixture();S.pant='plantel';S.prensa=POLITICAS_PRENSA[1];S.pool=POOL.slice();vinculoJugador(S.plantel[0]).confianza=71;
 const once=onceTemporada(S.plantel,S.formacion,[]);S.fijos=once.map(o=>o.jug);S.onceFijado={club:S.club.n,f:S.formacion,puestos:S.fijos.map(j=>j.nom)};
 S.memoriaConstruccion={[S.club.n]:{pivot:42}};S.diarioDT=[{tipo:'charla',texto:'Mensaje guardado'}];
 const datos=new Map();global.localStorage={setItem:(k,v)=>datos.set(k,v),getItem:k=>datos.get(k)};guardarPretemporada();assert.equal(leerGuardado().version,'14.2.0');
 const old=verPlantel;verPlantel=()=>{};S=nuevo();continuarGuardado();verPlantel=old;assert.equal(S.plantel[0].vinculoDT.confianza,71);assert.equal(S.diarioDT[0].texto,'Mensaje guardado');assert.equal(S.memoriaConstruccion[S.club.n].pivot,42);assert.equal(onceTemporada(S.plantel,S.formacion,S.fijos)[0].jug.nom,S.onceFijado.puestos[0]);
});
console.log('REGRESIÓN GAME DESIGN V13 COMPLETA');
`);
