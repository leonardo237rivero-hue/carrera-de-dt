const assert=require('node:assert/strict'),{codigo}=require('./carga');
eval(codigo()+'\n'+String.raw`
const club=n=>CLUBES.find(c=>c.n===n);
function iniciar(nombre='Boca Juniors'){
 S=nuevo();tmp={};S.rng=mul32(15250);S.club=club(nombre);S.nombre='Prueba';S.arq=ARQ[0];S.formacion=S.sistemaPref='4-3-3';S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.plan=planDelModelo(S.modelo);
 S.plantel=generarPlantel(72,3,null,S.club.p,S.club.n);prepararIdentidadDT();
}
const id=claveJugadorReal('Ángel Di María'),esDiMaria=j=>claveJugadorReal(j.nom)===id;
const test=(n,fn)=>{fn();console.log('OK',n);};
test('cada lugar distingue Primera, cantera, visita y sede neutral sin tocar el azar',()=>{
 iniciar('Peñarol');const antes=S.rng.estado();
 assert.equal(Object.keys(LUGARES_CLUB).length,20);
 for(const pais of Object.keys(LIGAS))assert.equal(Object.keys(LUGARES_CLUB).filter(n=>club(n)?.p===pais).length,2,pais);
 for(const n of Object.keys(LUGARES_CLUB)){
  const c=club(n),l=LUGARES_CLUB[n];
  assert.equal(arteCancha(c,3),'assets/'+l.dir+'/'+l.id+'.jpg');
  assert.equal(arteCancha(c,2),'assets/'+l.dir+'/'+l.id+'-cantera.jpg');
  for(const size of [24,72,132]){assert(escudo(c,size).includes('src="escudos/'+l.id+'.png"'));assert(!escudo(c,size).includes('escudo-volumen'));}
  assert(!escudo(c,24).includes('assets/escudos-3d/'));
  assert.equal(nombreCancha(c,1),l.cantera);
  assert(cabeceraCantera(c).includes(l.cantera));
 }
 const rival={club:club('Nacional')};
 assert.equal(fotoPartido({soyA:false,rival}),'assets/v15.1/nacional.jpg');
 assert.equal(fotoPartido({soyA:true,rival}),'assets/v15.1/penarol.jpg');
 assert.equal(fotoPartido({soyA:true,rival,neutral:true}),'assets/v15/noche-europea.jpg');
 assert.equal(arteCancha(club('Progreso'),2),'assets/v14/practica-ronda.jpg');
 assert.equal(S.rng.estado(),antes);
 assert(!escudo(club('Peñarol'),24).includes('escudo-volumen'));
 assert(!escenaClub(club('Peñarol'),3,'Temporada','Prueba','').includes('insignia-base'));
 assert(escudo({...club('Peñarol'),sel:true},72).includes('escudos/seleccion-penarol.png'));
 assert(escudoSVG({n:'Club de prueba',c:['#111111','#eeeeee']},72).includes('<svg'));
});
const datos=new Map();
global.localStorage={getItem:k=>datos.get(k),setItem:(k,v)=>datos.set(k,v)};
test('la compra retira a Di María de la liga y copa ya armadas y conserva tablero, dinero y azar',()=>{
 iniciar();
 const central=club('Rosario Central'),liga=equipoRival(central,3),copa=equipoRival(central,3);
 assert(liga.once.some(o=>esDiMaria(o.jug)));assert(copa.once.some(o=>esDiMaria(o.jug)));
 liga.tab={pts:9};const tab=liga.tab;S.temp={equipos:[liga],copa:{equipos:[copa]}};S.presupuesto=80;
 const ficha=realesDeClub(central.n,'ATA').find(esDiMaria);
 S.cartas=[{j:{...ficha,g:'ATA',de:central.n,real:true},estado:'libre',costo:30}];
 const pintar=pintarMercado,cab=cabecera;pintarMercado=()=>{};cabecera=()=>{};
 const rng=S.rng.estado();piquear(0);piquear(0);pintarMercado=pintar;cabecera=cab;
 assert.equal(S.presupuesto,50);assert.equal(S.plantel.filter(esDiMaria).length,1);
 assert.equal(clubDeJugadorReal(id),'Boca Juniors');assert.equal(S.rng.estado(),rng);assert.equal(liga.tab,tab);
 assert(liga.once.every(o=>!esDiMaria(o.jug)));assert(copa.once.every(o=>!esDiMaria(o.jug)));
 assert(!realesDeClub(central.n,'ATA').some(esDiMaria));
 S.club=central;S.plantel=generarPlantel(72,3,null,central.p,central.n);
 assert(!S.plantel.some(esDiMaria));assert(equipoRival(club('Boca Juniors'),3).once.some(o=>esDiMaria(o.jug)));
});
test('guardado v14 recupera pase comprado y origen de cantera sin inventar edad ni ascenso',()=>{
 iniciar();S.pant='plantel';
 S.plantel.push({nom:'Ángel Di María',real:true,de:'Rosario Central',g:'ATA',rt:82,ed:38});
 const joven={nom:'Prueba Cantera',g:'MED',rt:61,ed:19,subido:true};S.plantel.push(joven);
 guardarPretemporada();const d=leerGuardado();d.version='14.2.0';delete d.estado.pasesReales;localStorage.setItem(GUARDADO_CDT,JSON.stringify(d));
 const ver=verPlantel;verPlantel=()=>{};continuarGuardado();verPlantel=ver;
 assert.equal(clubDeJugadorReal(id),'Boca Juniors');assert.equal(datosCantera(S.plantel.at(-1)).delta,null);
});
test('Reserva ofrece una sola promoción y registra partidos acumulados sin contar dos veces',()=>{
 iniciar('Nacional');S.pant='plantel';const ver=verPlantel;verPlantel=()=>{};
 const azar=S.rng.estado(),p=prospectoCantera(),n=S.plantel.length;assert.equal(prospectoCantera(),p);
 promoverProspecto();promoverProspecto();verPlantel=ver;
 assert.equal(S.rng.estado(),azar);assert.equal(S.plantel.length,n+1);
 const j=S.plantel.at(-1);assert.equal(j.canteraDT.club,'Nacional');assert.equal(j.canteraDT.primera,1);
 j.st={pj:7,g:2};j.canteraDT.campanas[1]={pj:7,g:2};assert.equal(datosCantera(j).pj,7);
 S.temporada=2;j.rt+=3;j.st={pj:2,g:1};assert.equal(datosCantera(j).pj,9);assert.equal(datosCantera(j).g,3);assert.equal(datosCantera(j).delta,3);
 assert(fichaCantera(j).includes('Promovido por vos'));
});
test('separa partidos de la orden tardía y los registros del rival',()=>{
 iniciar();
 const v={info:{soyA:true},enf:{cargar:['bandaI'],cerrar:['contra']},ordenesDesde:{'cerrar:contra':46},ev:[
   {m:12,l:'b',t:'gol',pat:'contra'}, {m:55,l:'b',t:'llegada',pat:'contra'}, {m:42,l:'a',t:'gol',pat:'bandaI'}
 ]};const f=evidenciasOrden(v);assert.equal(f[0].goles,1);assert.equal(f[1].intentos,1);assert.equal(f[1].goles,0);
});
test('ritmo esencial deja pasar semifinal y reserva la final, resumen evita la previa',()=>{
 iniciar();
 const rival=equipoRival(club('River Plate'),3);
 S.temp={copa:{tipo:'conti',nombre:'Libertadores',equipos:[{},rival,rival,rival],vivos:[0,1,2,3]},grandes:0,intervenciones:0};
 const j={t:'copa'};assert.equal(partidoGrande(j),null);
 cambiarRitmoCarrera('completo');assert.equal(partidoGrande(j).tipo,'copa');
 S.temp.intervenciones=2;assert.equal(partidoGrande(j),null);S.temp.copa.vivos=[0,1];assert.equal(partidoGrande(j).tipo,'final');
 cambiarRitmoCarrera('resumen');assert.equal(partidoGrande(j),null);
});
`);
