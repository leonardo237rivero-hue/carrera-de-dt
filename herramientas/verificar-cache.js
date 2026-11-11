const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sandbox={self:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8')+'\nglobalThis.precache=PRECACHE;',sandbox);
const urls=[...html.matchAll(/(?:src|href)="((?:js|css)\/[^\"]+)"/g)].map(m=>m[1]);
assert(urls.length>25);
for(const u of urls){assert(u.endsWith('?v=14.1.2'),u);assert(sandbox.precache.includes(u),'No precache: '+u);assert(fs.existsSync(path.join(root,u.split('?')[0])),u);}
const arte=sandbox.precache.filter(u=>u.startsWith('assets/v14/'));
assert.equal(arte.length,14);
for(const u of arte)assert(fs.existsSync(path.join(root,u)),'Falta arte: '+u);
console.log('OK: '+urls.length+' scripts/estilos versionados y '+arte.length+' imágenes v14 disponibles en precaché offline.');
