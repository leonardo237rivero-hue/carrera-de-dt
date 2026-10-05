// Carga todos los módulos del juego en Node, con un DOM de mentira.
const fs=require('fs'), path=require('path');
const raiz=path.join(__dirname,'..');
const ORDEN=['tactica','decisiones','datos',
  'i18n/core','i18n/textos','i18n/datos-i18n','i18n/pool-pt','i18n/pool-en','i18n/pool-extra','i18n/aplicar',
  'nucleo','ui','club','momentos','temporada','idea','juego'];
function codigo(){
  return ORDEN.filter(f=>fs.existsSync(path.join(raiz,'js',f+'.js')))
    .map(f=>fs.readFileSync(path.join(raiz,'js',f+'.js'),'utf8')).join('\n')
    .replace(/\nsetIdioma\(idiomaGuardado\(\)\);\nportada\(\);\s*$/,'\n');
}
const stub={style:{setProperty(){},removeProperty(){}},classList:{add:()=>{},remove:()=>{}},querySelectorAll:()=>[],
  addEventListener:()=>{},dataset:{},setAttribute(){}};
global.window={matchMedia:()=>({matches:true}),scrollTo:()=>{}};
global.document={querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,documentElement:stub,
  createElement:()=>stub,body:{appendChild:()=>{},removeChild:()=>{}}};
global.navigator={language:'es'};
global.setInterval=()=>0; global.clearInterval=()=>{}; global.setTimeout=(f)=>0; global.clearTimeout=()=>{};
global.requestAnimationFrame=()=>0; global.performance={now:()=>0};
module.exports={codigo,ORDEN};
