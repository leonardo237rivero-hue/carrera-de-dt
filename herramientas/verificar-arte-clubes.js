// Comprueba el paquete exportado, no sólo la lista de nombres del generador.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../assets/escudos-3d');
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalogo.json'),'utf8'));
assert.equal(catalog.length,20);assert.equal(new Set(catalog.map(c=>c.slug)).size,20);
let triangles=0;
for(const c of catalog){
 const data=fs.readFileSync(path.join(dir,c.slug+'.glb'));
 assert.equal(data.toString('ascii',0,4),'glTF',c.slug);assert.equal(data.readUInt32LE(4),2);assert.equal(data.readUInt32LE(8),data.length);
 assert.equal(data.toString('ascii',16,20),'JSON');
 const j=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());
 assert.equal(j.meshes.length,1,c.slug);assert.equal(j.materials.length,3,c.slug);
 assert(j.materials.some(m=>m.alphaMode==='MASK'&&m.pbrMetallicRoughness.baseColorTexture),c.slug);
 assert(j.images.length>0&&j.images.every(i=>i.bufferView!=null&&!i.uri),'Textura externa: '+c.slug);
 assert(j.buffers.every(b=>!b.uri),'Buffer externo: '+c.slug);
 const mins=[Infinity,Infinity,Infinity],maxs=[-Infinity,-Infinity,-Infinity];
 for(const p of j.meshes[0].primitives){
  assert(p.attributes.NORMAL!=null&&p.attributes.TEXCOORD_0!=null,c.slug);
  const a=j.accessors[p.attributes.POSITION];assert(a.count>3,c.slug);
  for(let k=0;k<3;k++){mins[k]=Math.min(mins[k],a.min[k]);maxs[k]=Math.max(maxs[k],a.max[k]);}
  const ix=j.accessors[p.indices];assert.equal(ix.count%3,0);triangles+=ix.count/3;
 }
 assert(maxs.every((v,k)=>Number.isFinite(v)&&v-mins[k]>.1),'Malla sin volumen: '+c.slug);
 const fbx=fs.readFileSync(path.join(dir,c.slug+'.fbx'));assert.equal(fbx.toString('ascii',0,18),'Kaydara FBX Binary',c.slug);
 const png=fs.readFileSync(path.join(dir,c.slug+'.png'));assert.equal(png.readUInt32BE(16),384);assert.equal(png.readUInt32BE(20),384);assert.equal(png[25],6,'Render sin RGBA: '+c.slug);
 assert(fs.existsSync(path.resolve(dir,c.source)),c.slug);
}
console.log('OK: 20 GLB con volumen, UV, normales y texturas incorporadas; 20 FBX y 20 renders RGBA. '+triangles+' triángulos en total.');
