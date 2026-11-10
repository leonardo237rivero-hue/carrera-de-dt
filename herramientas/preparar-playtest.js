// Genera una entrada aislada para revisar la tanda sin esperar una final empatada.
// No cambia las probabilidades ni la página normal del juego.
const fs=require('fs'),path=require('path');
const raiz=path.resolve(__dirname,'..');
const qa=`<aside style="padding:8px;background:#ecd8b9;position:fixed;bottom:0;left:0;right:0;z-index:100;font:12px system-ui;display:flex;gap:8px;flex-wrap:wrap"><b>PRUEBA</b><select id="qa-club" aria-label="Club de prueba"><option>Racing Club</option><option>Peñarol</option><option>River Plate</option><option>Boca Juniors</option><option>Corinthians</option><option>Real Madrid</option></select><button onclick="plantelDePrueba()">Plantel</button><button onclick="vestuarioDePrueba()">Vestuario</button><button onclick="vivoDePrueba()">Vivo</button><button onclick="previaPicardiaDePrueba()">Previa</button><button onclick="entretiempoDePrueba()">Entretiempo</button><button onclick="tandaDePrueba()">Preparar tanda empatada</button><button onclick="gestionDePrueba()">Gestión de prueba</button><button onclick="planDePrueba()">Plan</button><button onclick="prensaDePrueba()">Prensa</button><button onclick="mercadoDePrueba()">Mercado</button><button onclick="ruletaDePrueba()">Ruleta</button><button onclick="legadoDePrueba()">Legado</button><button onclick="this.parentElement.style.display='none'">Ocultar pruebas</button></aside>
<script>
function tandaDePrueba(){
 S=nuevo();tmp={};S.rng=mul32(hashS('tanda-v10'));S.nombre='Prueba';S.arq=ARQ[0];S.edadInicio=60;
 S.club=CLUBES.find(c=>c.n===document.getElementById('qa-club').value)||CLUBES.find(c=>c.n==='Peñarol');S.formacion='4-3-3';S.sistemaPref='4-3-3';S.estilo='Posesion';S.modelo=modeloDeEstilo(S.estilo);S.modeloPref=copiaModelo(S.modelo);S.plan=planDelModelo(S.modelo);S.auto=30;S.temporadasTotal=6;
 S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p,S.club.n);prepararIdentidadDT();
 const rival=CLUBES.find(c=>c.p===S.club.p&&c.n!==S.club.n),rv=equipoRival(rival,3),yo=miEquipo(rv);
 tmp.vivo={info:{rival:rv,soyA:true,neutral:true,knock:true,titulo:'Partido de prueba'},A:yo,B:rv,marc:[0,0],ev:[],enf:{rival:rv.club.n,cargar:[],cerrar:[]},p1:{Fa:70,Fb:70},p2:{Fa:70,Fb:70},rapido:true,zonasA:Array(19).fill(0),zonasB:Array(19).fill(0)};
 $('#s-partido').innerHTML='<div id="vvPanel"></div>';ir('partido');abrirPenales();
}
function gestionDePrueba(){tandaDePrueba();armarTemporada();tmp={feed:[],vel:10,posPrev:{},tabla:S.temp.ac?'tabA':'tab'};abrirGestionTk();}
function plantelDePrueba(){tandaDePrueba();tmp={};verPlantel();}
function vestuarioDePrueba(){tandaDePrueba();tmp.vivo.an0=miEquipo(tmp.vivo.info.rival).an;abrirArenga();}
function entretiempoDePrueba(){
 tandaDePrueba();const V=tmp.vivo;V.cols=coloresDuelo(S.club,V.info.rival.club);V.min=45;V.p1=jugarMitad(V.A,V.B,true,1,45);V.ev=V.p1.ev;V.marc=[V.ev.filter(e=>e.t==='gol'&&e.l==='a').length,V.ev.filter(e=>e.t==='gol'&&e.l==='b').length];pintarVivo();entretiempo();
}
function planDePrueba(){plantelDePrueba();irPlanteo();}
function prensaDePrueba(){if(!S.club)tandaDePrueba();abrirConferencia();}
function vivoDePrueba(){vestuarioDePrueba();tmp.vivo.rapido=false;salirDeArenga(true);pausarVivoInterior(document.querySelector('.controles-banco button[aria-pressed]'));}
function previaPicardiaDePrueba(){tandaDePrueba();const info=tmp.vivo.info;S.temp={grandes:0};abrirPrevia({},info);}
function mercadoDePrueba(){plantelDePrueba();S.division=3;S.presupuesto=70;abrirMercado();}
function ruletaDePrueba(){plantelDePrueba();abrirRuleta();}
function legadoDePrueba(){plantelDePrueba();S.puntos=24;S.temporada=3;S.anosDirigiendo=2;S.titulos=[{tipo:'liga',comp:'Campeonato de prueba',club:S.club.n,t:2,div:3}];S.hist=[{t:1,club:S.club.n,comp:'Liga de prueba',f:'4-3-3',pos:'3º',pts:6},{t:2,club:S.club.n,comp:'Liga de prueba',f:'4-3-3',pos:'1º',pts:10,tit:['liga']}];final();}
</script>`;
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8').replace('<head>','<head><base href="../">').replace('</body>',qa+'</body>');
fs.writeFileSync(path.join(__dirname,'playtest-local.html'),html);
fs.writeFileSync(path.join(__dirname,'playtest.html'),html); // copia publicada: se abre desde la tablet
console.log('Abrir http://127.0.0.1:8767/herramientas/playtest-local.html');
