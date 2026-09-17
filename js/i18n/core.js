// Carrera de DT — sistema de idiomas
// El idioma se elige a mano o sale del país del club donde dirigís.

let IDIOMA = "es";
const IDIOMAS = [
  {id:"es", n:"Español",   bandera:"ES"},
  {id:"pt", n:"Português", bandera:"BR"},
  {id:"en", n:"English",   bandera:"EN"}
];
// qué idioma propone cada país
const IDIOMA_POR_PAIS = {
  "Uruguay":"es","Argentina":"es","España":"es",
  "Brasil":"pt",
  "Inglaterra":"en","Estados Unidos":"en","Alemania":"en",
  "Italia":"en","Francia":"en","Arabia Saudita":"en"
};

function setIdioma(id){
  IDIOMA = IDIOMAS.some(x=>x.id===id) ? id : "es";
  try{ if(window.localStorage) localStorage.setItem("cdt_idioma", IDIOMA); }catch(e){}
}
function idiomaGuardado(){
  try{ if(window.localStorage){ const v=localStorage.getItem("cdt_idioma"); if(v) return v; } }catch(e){}
  const nav=(navigator.language||"es").slice(0,2).toLowerCase();
  return IDIOMAS.some(x=>x.id===nav) ? nav : "es";
}

// T("clave") devuelve el texto en el idioma activo.
// Si falta la traducción, cae al español y no se rompe nada.
function T(clave, ...args){
  const d = (TEXTOS[IDIOMA] && TEXTOS[IDIOMA][clave]) || TEXTOS.es[clave] || clave;
  return args.length ? d.replace(/\{(\d+)\}/g, (m,i)=>args[+i]!==undefined?args[+i]:m) : d;
}
// L(objeto) toma un campo multi-idioma: {es:"...", pt:"...", en:"..."}
function L(o){
  if(o==null) return "";
  if(typeof o==="string") return o;
  return o[IDIOMA] || o.es || "";
}
// D(situación) devuelve la situación en el idioma activo.
// Las situaciones se guardan en español y las traducciones van por índice.
function D(sit, fuente, indice){
  if(IDIOMA==="es") return sit;
  const tr = TRAD[IDIOMA] && TRAD[IDIOMA][fuente] && TRAD[IDIOMA][fuente][indice];
  if(!tr) return sit;
  return [ sit[0], tr.t,
    sit[2].map((o,k)=> tr.o[k] ? [tr.o[k][0], o[1],o[2],o[3],o[4], tr.o[k][1]||o[5]] : o) ];
}
