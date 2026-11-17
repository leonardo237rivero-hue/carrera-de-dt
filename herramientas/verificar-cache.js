const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sandbox={self:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8')+'\nglobalThis.precache=PRECACHE;',sandbox);
const urls=[...html.matchAll(/(?:src|href)="((?:js|css)\/[^\"]+)"/g)].map(m=>m[1]);
assert(urls.length>25);
for(const u of urls){assert(u.endsWith('?v=18.0.1'),u);assert(sandbox.precache.includes(u),'No precache: '+u);assert(fs.existsSync(path.join(root,u.split('?')[0])),u);}
const arte=sandbox.precache.filter(u=>u.startsWith('assets/v14/'));
assert.equal(arte.length,15);
for(const u of arte)assert(fs.existsSync(path.join(root,u)),'Falta arte: '+u);
const nuevos=sandbox.precache.filter(u=>u.startsWith('assets/v15/')||u.startsWith('assets/audio/'));
assert.equal(nuevos.length,8);
for(const u of nuevos){const p=path.join(root,u);assert(fs.existsSync(p),'Falta recurso: '+u);if(u.endsWith('.jpg'))assert(fs.statSync(p).size<400000,'Imagen demasiado pesada: '+u);}
const lugares=sandbox.precache.filter(u=>u.startsWith('assets/v15.1/'));
assert.equal(lugares.length,6);
for(const u of lugares){const p=path.join(root,u);assert(fs.existsSync(p),'Falta lugar: '+u);assert(fs.statSync(p).size<400000,'Imagen demasiado pesada: '+u);}
for(const club of ['penarol','nacional','barcelona']){const u='escudos/'+club+'.png';assert(sandbox.precache.includes(u));assert(fs.existsSync(path.join(root,u)));}
const ampliacion=sandbox.precache.filter(u=>u.startsWith('assets/v16.1/'));
assert.equal(ampliacion.length,34);
for(const u of ampliacion){const p=path.join(root,u);assert(fs.existsSync(p),'Falta lugar: '+u);assert(fs.statSync(p).size<400000,'Imagen demasiado pesada: '+u);}
const renders=sandbox.precache.filter(u=>u.startsWith('assets/escudos-3d/'));
assert.equal(renders.length,0,'Los modelos archivados no se descargan al jugar');
console.log('OK: '+urls.length+' scripts/estilos, 40 lugares de 20 clubes, escudos 2D y arte/audio anterior disponibles offline.');
