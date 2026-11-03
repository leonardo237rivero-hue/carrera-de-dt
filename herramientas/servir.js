// Sólo desarrollo local. node herramientas/servir.js [puerto]
const http=require('http'),fs=require('fs'),path=require('path');
const raiz=path.resolve(__dirname,'..');
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let ruta;try{ruta=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(e){res.writeHead(400);res.end();return;}
  const archivo=path.resolve(raiz,'.'+(ruta==='/'?'/index.html':ruta));
  if(!archivo.startsWith(raiz+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(archivo,(err,data)=>{if(err){res.writeHead(404);res.end('No encontrado');return;}res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(Number(process.argv[2])||8767,'127.0.0.1',()=>console.log('Juego local en http://127.0.0.1:'+(Number(process.argv[2])||8767)));
