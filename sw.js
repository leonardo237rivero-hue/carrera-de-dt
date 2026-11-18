// v10: núcleo completo offline; un script ausente nunca recibe HTML.
const VERSION='cdt-v22-0-0';
const NUCLEO=['./','index.html','manifest.webmanifest','css/estilos.css','css/direccion.css',
 'js/tactica.js','js/decisiones.js','js/datos.js','js/planteles.js','js/i18n/core.js','js/i18n/textos.js','js/i18n/datos-i18n.js','js/i18n/pool-pt.js','js/i18n/pool-en.js','js/i18n/pool-extra.js','js/i18n/aplicar.js',
 'js/nucleo.js','js/cancha.js','js/ui.js','js/club.js','js/momentos.js','js/zonas.js','js/temporada.js','js/seleccion.js','js/idea.js','js/vivo.js','js/vestuario.js','js/juego.js','js/ciclo.js','js/comunicacion.js','js/direccion.js','js/interiores.js','css/interiores.css','css/cine.css','js/cine.js','js/recorrido.js','js/charlas.js','js/oficio.js','js/ajustes.js','js/v14.js','js/v14b.js','css/v14.css','css/edicion.css','js/edicion.js','js/atmosfera.js','js/sonido.js','js/v16.js','js/v17.js','js/v18.js','js/v19.js','js/v20.js','js/v21.js','js/v21b.js','js/v22.js','css/v16.css','css/atmosfera.css','assets/cine/acceso.png','assets/cine/tribuna.png','assets/cine/vestuario.png','assets/cine/prensa.png','assets/interiores/entrenador.png'];

// HTML y precaché deben pedir exactamente la misma revisión de JS/CSS.
// Evita mezclar el HTML nuevo con archivos aún frescos de la caché HTTP anterior.
const ARTE_V14=["sala.jpg","practica.jpg","diario.jpg","llamada.jpg","dt-joven.jpg","dt-medio.jpg","dt-maduro.jpg","dt-veterano.jpg","sala-grande.jpg","practica-ronda.jpg","prensa.jpg","vestuario-plantel.jpg","cierre-vestuario.jpg","festejo.jpg","revelacion.jpg"].map(n=>'assets/v14/'+n);
const ARTE_V15=['penarol','nacional','boca','river','racing','noche-europea'].map(n=>'assets/v15/'+n+'.jpg').concat(['assets/audio/tribuna-cantos.mp3','assets/audio/tribuna-gol.mp3']);
const ARTE_V151=['penarol','nacional','barcelona','penarol-cantera','nacional-cantera','barcelona-cantera'].map(n=>'assets/v15.1/'+n+'.jpg');
const CLUBES_ARTE=["penarol","nacional","boca-juniors","river-plate","flamengo","corinthians","barcelona","real-madrid","liverpool-fc","manchester-united","milan","juventus","bayern-munchen","borussia-dortmund","paris-saint-germain","marsella","inter-miami","la-galaxy","al-hilal","al-nassr"];
const ARTE_V161=["boca-juniors","river-plate","flamengo","corinthians","real-madrid","liverpool-fc","manchester-united","milan","juventus","bayern-munchen","borussia-dortmund","paris-saint-germain","marsella","inter-miami","la-galaxy","al-hilal","al-nassr"].flatMap(n=>['assets/v16.1/'+n+'.jpg','assets/v16.1/'+n+'-cantera.jpg']);
// El juego usa los escudos 2D; modelos y renders anteriores quedan archivados fuera del precache.
const PRECACHE=NUCLEO.map(p=>/\.(js|css)$/.test(p)?p+'?v=22.0.0':p).concat(ARTE_V14,ARTE_V15,ARTE_V151,ARTE_V161,CLUBES_ARTE.map(n=>'escudos/'+n+'.png'));
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cdt-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copia=res.clone();e.waitUntil(caches.open(VERSION).then(c=>c.put(req,copia)));}return res;}).catch(async()=>{
  const r=await caches.match(req);if(r)return r;
  if(req.mode==='navigate')return caches.match('index.html');
  return new Response('',{status:503,statusText:'Offline resource unavailable'});
 }));
});
