// Genera una entrada aislada para revisar la tanda sin esperar una final empatada.
// No cambia las probabilidades ni la página normal del juego.
const fs=require('fs'),path=require('path');
const raiz=path.resolve(__dirname,'..');
const qa=`<aside style="padding:12px;background:#ecd8b9;position:fixed;bottom:0;left:0;z-index:100;font:14px system-ui"><b>ESCENARIO DE PRUEBA</b> <button onclick="tandaDePrueba()">Preparar tanda empatada</button> <button onclick="gestionDePrueba()">Gestión de prueba</button></aside>
<script>
function tandaDePrueba(){
 S=nuevo();tmp={};S.rng=mul32(hashS('tanda-v10'));S.nombre='Prueba';S.arq=ARQ[0];S.edadInicio=60;
 S.club=CLUBES.find(c=>c.n==='Peñarol');S.formacion='4-3-3';S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);S.plan=planDelModelo(S.modelo);S.auto=30;
 S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p,S.club.n);prepararIdentidadDT();
 const rv=equipoRival(CLUBES.find(c=>c.n==='Nacional'),3),yo=miEquipo(rv);
 tmp.vivo={info:{rival:rv,soyA:true,neutral:true,knock:true,titulo:'Final de prueba · empate'},A:yo,B:rv,marc:[0,0],ev:[],enf:{},p1:{Fa:70,Fb:70},p2:{Fa:70,Fb:70},rapido:true};
 $('#s-partido').innerHTML='<div id="vvPanel"></div>';ir('partido');abrirPenales();
}
function gestionDePrueba(){tandaDePrueba();armarTemporada();tmp={feed:[],vel:10,posPrev:{},tabla:S.temp.ac?'tabA':'tab'};abrirGestionTk();}
</script>`;
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8').replace('<head>','<head><base href="../">').replace('</body>',qa+'</body>');
fs.writeFileSync(path.join(__dirname,'playtest-local.html'),html);
console.log('Abrir http://127.0.0.1:8767/herramientas/playtest-local.html');
