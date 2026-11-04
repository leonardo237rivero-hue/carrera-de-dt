// v10: núcleo completo offline; un script ausente nunca recibe HTML.
const VERSION='cdt-v13-0-0';
const NUCLEO=['./','index.html','manifest.webmanifest','css/estilos.css','css/direccion.css',
 'js/tactica.js','js/decisiones.js','js/datos.js','js/planteles.js','js/i18n/core.js','js/i18n/textos.js','js/i18n/datos-i18n.js','js/i18n/pool-pt.js','js/i18n/pool-en.js','js/i18n/pool-extra.js','js/i18n/aplicar.js',
 'js/nucleo.js','js/cancha.js','js/ui.js','js/club.js','js/momentos.js','js/zonas.js','js/temporada.js','js/seleccion.js','js/idea.js','js/vivo.js','js/vestuario.js','js/juego.js','js/ciclo.js','js/comunicacion.js','js/direccion.js','js/interiores.js','css/interiores.css','css/cine.css','js/cine.js','js/recorrido.js','js/charlas.js','js/oficio.js','assets/cine/acceso.png','assets/cine/tribuna.png','assets/cine/vestuario.png','assets/cine/prensa.png','assets/interiores/entrenador.png'];

self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(NUCLEO)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('cdt-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copia=res.clone();e.waitUntil(caches.open(VERSION).then(c=>c.put(req,copia)));}return res;}).catch(async()=>{
  const r=await caches.match(req);if(r)return r;
  if(req.mode==='navigate')return caches.match('index.html');
  return new Response('',{status:503,statusText:'Offline resource unavailable'});
 }));
});
