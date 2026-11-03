// Pruebas de integración visual con los datos reales, sin dependencias.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{codigo}=require('./carga');
eval(codigo()+`\n
let clubes=0;
for(const c of CLUBES){
 const p=paletaInterior(c),f=luminanciaInterior(p.principal),t=luminanciaInterior(p.texto),a=luminanciaInterior(p.acento),papel=luminanciaInterior('#f3eddf');
 assert((Math.max(f,t)+.05)/(Math.min(f,t)+.05)>=4.5,c.n+': cabecera sin contraste');
 assert((papel+.05)/(a+.05)>=4.5,c.n+': acento sobre papel');clubes++;
}
console.log('OK contraste AA en',clubes,'clubes de la base');
let guardadoPrueba={version:'10.0.0',estado:{club:CLUBES[0],plantel:[]}};
global.localStorage={getItem:()=>JSON.stringify(guardadoPrueba)};
assert(leerGuardado(),'debe aceptar la pretemporada de v10');guardadoPrueba.version='11.0.0';assert(leerGuardado());guardadoPrueba.version='9.0.0';assert.equal(leerGuardado(),null);
console.log('OK compatibilidad del guardado v10/v11');
for(const nombre of ['Racing Club','Peñarol','River Plate','Boca Juniors','Corinthians','Real Madrid']){
 S=nuevo();S.rng=mul32(hashS('arte-verificacion'));S.club=CLUBES.find(c=>c.n===nombre);S.formacion='4-3-3';S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);S.plan=planDelModelo(S.modelo);S.auto=30;
 S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p,S.club.n);prepararIdentidadDT();
 const rival=equipoRival(CLUBES.find(c=>c.p===S.club.p&&c.n!==nombre),3),yo=miEquipo(rival);
 tmp={vivo:{A:yo,B:rival,info:{rival,soyA:true},cols:coloresDuelo(S.club,rival.club),enf:{},ev:[],marc:[0,0],min:0,nombresMapa:true}};
 const cursor=S.rng.estado(), modelo=JSON.stringify(S.modelo), memoria=JSON.stringify(S.memoriaPrincipios);
 const ficha=retratoJugadorInterior(S.plantel[0]),bandera=banderaInterior(S.club),mapa=zonasVivo(),once=canchaGestion(yo.once),gestion=vistaGestion('4-3-3','pintarPlantel');
 assert(bandera.includes(nombre));assert(bandera.includes(slugClub(nombre)));assert(ficha.includes(paletaInterior(S.club).principal));assert(gestion.includes(escapeHTML(S.plantel[0].nom)));
 assert(![ficha,bandera,mapa,gestion].join('').includes('River del Sur'));
 assert.equal((mapa.match(/<title>/g)||[]).length,22);assert.equal((once.match(/role="button"/g)||[]).length,11);
 assert.equal(S.rng.estado(),cursor,'dibujar consume RNG');assert.equal(JSON.stringify(S.modelo),modelo);assert.equal(JSON.stringify(S.memoriaPrincipios),memoria);
 tmp.vivo.vistaMapa='dominio';assert(zonasVivo().includes('dominio'));
 console.log('OK identidad y datos dinámicos:',nombre);
}
const onceRelato=armarOnce(S.plantel,'4-3-3');for(let i=0;i<1000;i++)assert.notEqual(goleador(onceRelato).rol,'POR');
console.log('OK autor del relato: no convierte al arquero en atacante de campo');
`);
const raiz=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g))if(!m[1].startsWith('http'))assert(fs.existsSync(path.join(raiz,m[1])),m[1]);
for(const p of ['banco.png','vestuario.png','jugadores.png','entrenador.png','dt-banco.png'])assert(fs.statSync(path.join(raiz,'assets/interiores',p)).size>1000,p);
console.log('OK recursos locales presentes');
