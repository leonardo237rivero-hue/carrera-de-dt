// Regresión v12: contraste de todos los clubes, ausencia de retratos y caché completa.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{codigo}=require('./carga');
eval(codigo()+`\n
for(const club of CLUBES){
 const p=paletaCine(club),a=luminanciaInterior(p.acento),f=luminanciaInterior('#171c20'),t=luminanciaInterior(p.tinta);
 assert((a+.05)/(f+.05)>=4.5,club.n+': acento sobre panel');
 assert((Math.max(a,t)+.05)/(Math.min(a,t)+.05)>=4.5,club.n+': texto de botón');
 assert.equal(p.principal,colorInterior(club.c[0]));assert.equal(p.secundario,colorInterior(club.c[1]));
}
console.log('OK v12: controles AA en los 88 clubes sin cambiar colores originales');
for(const nombre of ['Peñarol','River Plate','Boca Juniors','Racing Club','Corinthians','Real Madrid']){
 S=nuevo();S.club=CLUBES.find(c=>c.n===nombre);S.rng=mul32(123);S.formacion='4-3-3';S.sistemaPref=S.formacion;
 S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p,S.club.n);tmp={};prepararIdentidadDT();
 const cursor=S.rng.estado();const h=vistaGestion(S.formacion,'pintarPlantel');
 assert(!/jugadores\\.png|retrato-compuesto|retrato-jugador/.test(h));
 assert(h.includes('cine-posicion'));assert(h.includes('cine-lista-titulares'));
 assert.equal(S.rng.estado(),cursor);assert(!retratoDT(45).includes('<image'));
 S.mostrarRetratoDT=true;assert(retratoDT(45).includes('entrenador.png'));
}
console.log('OK v12: planteles sin caras, retrato DT opcional, render sin consumo de azar');
let d={version:'12.0.0',estado:{club:CLUBES[0],plantel:[]}};global.localStorage={getItem:()=>JSON.stringify(d)};
for(const v of ['10.0.0','11.0.0','12.0.0']){d.version=v;assert(leerGuardado());}
d.version='9.0.0';assert.equal(leerGuardado(),null);console.log('OK v12: guardados v10, v11 y v12 compatibles');
let llamadasPrensa=0,llamadasPlantel=0;const originalesPrensa=[abrirConferencia,verPlantel,necesitaIdioma,necesitaPrensa];
abrirConferencia=()=>llamadasPrensa++;verPlantel=()=>llamadasPlantel++;necesitaIdioma=()=>false;necesitaPrensa=()=>false;
S.introVisto=S.club.n;S.temporada=1;S.prensaTemporada=0;
for(const div of [0,1,2]){S.division=div;S.presentadoGrupo=S.club.n+'|'+div;colaPrevia();}
assert.equal(llamadasPrensa,0);assert.equal(llamadasPlantel,3);
S.division=3;S.presentadoGrupo=S.club.n+'|3';colaPrevia();assert.equal(llamadasPrensa,1);
[abrirConferencia,verPlantel,necesitaIdioma,necesitaPrensa]=originalesPrensa;
console.log('OK v12: formativas llegan al plantel sin conferencia profesional');
`);
const root=path.resolve(__dirname,'..'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const listado=sw.match(/const NUCLEO=(\[[\s\S]*?\]);/)[1];
const assets=JSON.parse(listado.replace(/'/g,'"'));
for(const a of assets)assert(fs.existsSync(path.join(root,a)),a);
for(const a of ['js/cine.js','css/cine.css','assets/cine/acceso.png','assets/cine/tribuna.png','assets/cine/vestuario.png','assets/cine/prensa.png'])assert(assets.includes(a),a);
console.log('OK v12: caché local incluye el diseño y los cuatro fondos');
