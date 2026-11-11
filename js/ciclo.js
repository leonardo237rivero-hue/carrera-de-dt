// v10. Dominio: identidad persistente, aprendizaje por principio, edad y contexto.
// Las órdenes del partido modifican S.enfasis, nunca el ADN ni la memoria aprendida.
const VERSION_JUEGO='14.1.2';
const GUARDADO_CDT='cdt-v10-pretemporada';
const copiaModelo=m=>Object.assign({},m||modeloDeEstilo('Posesion'));
const escapeHTML=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function prepararIdentidadDT(){
  S.edadInicio=clamp(Number(S.edadInicio)||35,25,65);
  S.anosDirigiendo=S.anosDirigiendo||0;
  S.modeloPref=S.modeloPref||copiaModelo(S.modelo||modeloDeEstilo(S.estiloPref||S.estilo||'Posesion'));
  S.memoriaPorClub=S.memoriaPorClub||{};
  if(S.club){
    const club=S.club.n;
    if(S.clubMemoria&&S.clubMemoria!==club){
      S.memoriaPorClub[S.clubMemoria]=S.memoriaPrincipios;
      S.memoriaPrincipios=S.memoriaPorClub[club]||null;
    }
    S.clubMemoria=club;
  }
  if(!S.memoriaPrincipios){
    S.memoriaPrincipios={};
    MOMENTOS.forEach(M=>{ S.memoriaPrincipios[M.id]={}; M.ops.forEach(o=>{S.memoriaPrincipios[M.id][o.id]=o.id===S.modeloPref[M.id]?30:12;}); });
  }
  S.diarioDT=S.diarioDT||[];
  S.ritmo=S.ritmo||'elegir';
}
function edadDT(){ return clamp((Number(S.edadInicio)||35)+(S.anosDirigiendo||0),25,100); }
function afinidadADN(m){ const base=S.modeloPref||m;return MOMENTOS.filter(M=>m[M.id]===base[M.id]).length/4; }
function automatismosDe(m){
  if(!S.memoriaPrincipios) return S.auto||30;
  return Math.round(MOMENTOS.reduce((n,M)=>n+((S.memoriaPrincipios[M.id]||{})[m[M.id]]||12),0)/4);
}
function planDelModelo(m){
  return {salida:m.ofe==='directo'?'largo':'tres',defensa:{alto:'presion',medio:'medio',bajo:'repliegue'}[m.def],llegada:m.ofe==='directo'?'centros':m.tofe==='contra'?'cambio':'dentro'};
}
function lecturaIdentidad(){
  const m=S.modelo||S.modeloPref||modeloDeEstilo(S.estiloPref||'Posesion');
  const n=Math.round(afinidadADN(m)*4);
  return t3(`${n} de 4 principios de tu idea inicial · ${automatismosDe(m)} de aprendizaje`,`${n} de 4 princípios da ideia inicial · ${automatismosDe(m)} de aprendizagem`,`${n} of 4 original principles · ${automatismosDe(m)} learned`);
}
function retratoDT(tam){
  const edad=edadDT(), cana=clamp((edad-34)/32,0,1), pelo=edad>=58?'#bbb7aa':edad>=45?'#75756d':'#333b3a';
  return `<svg class="retrato-dt" width="${tam||64}" height="${tam||64}" viewBox="0 0 90 90" role="img" aria-label="${escapeHTML(S.nombre||'DT')}, ${edad} ${T('anios')}"><rect width="90" height="90" rx="9" fill="#c7d7d4"/><path d="M9 90Q10 66 32 64H58Q80 68 81 90" fill="#173846"/><path d="M33 62V74L45 80 57 73V62" fill="#c69778"/><ellipse cx="45" cy="41" rx="23" ry="29" fill="#d6ab89"/><path d="M22 43Q15 8 44 8Q73 8 68 44L62 28Q42 33 29 25Z" fill="${pelo}"/><path d="M23 34L26 49M67 34L64 49" stroke="#dedbd0" stroke-width="${1+cana*4}" opacity="${cana}"/><path d="M31 40H39M51 40H59M43 45L41 53H47M35 61Q45 64 55 60" stroke="#594c40" stroke-width="1.7" fill="none"/><circle cx="35" cy="44" r="1.5" fill="#263a39"/><circle cx="55" cy="44" r="1.5" fill="#263a39"/>${edad>=40?`<path d="M32 34H57M28 49L33 50M57 50L62 48" fill="none" stroke="#a17d65" stroke-width="${edad>=55?1.5:0.8}"/>`:''}${edad>=50?'<path d="M29 55Q33 72 45 71Q59 71 62 54L57 62 45 65 33 61Z" fill="#b6afa0" opacity=".7"/>':''}<path d="M24 78L18 90M66 78L72 90" stroke="#abc9d7" stroke-width="3"/></svg>`;
}
// La formación no certifica un modelo: suavizamos las tablas heredadas mientras
// el comportamiento por momentos y los jugadores aportan la ventaja contextual.
Object.values(FIT).forEach(tab=>Object.keys(tab).forEach(f=>{tab[f]=1+(tab[f]-1)*0.25;}));
const _aplicarCierreV9=aplicarCierre;
aplicarCierre=function(res){
  prepararIdentidadDT(); const m=S.modelo||modeloDeEstilo(S.estilo);
  _aplicarCierreV9(res);
  MOMENTOS.forEach(M=>{const mem=S.memoriaPrincipios[M.id];mem[m[M.id]]=clamp((mem[m[M.id]]||12)+17,0,100);});
  S.auto=automatismosDe(m);
};
const _miEquipoV9=miEquipo;
miEquipo=function(rv){
  if(S.memoriaPrincipios)S.auto=automatismosDe(S.modelo||modeloDeEstilo(S.estilo));
  const eq=_miEquipoV9(rv);
  const m=S.modelo||modeloDeEstilo(eq.e);
  eq.auto=automatismosDe(m);
  // Identidad: preservar lo entrenado mejora ejecución, sin borrar lo aprendido
  // cuando el DT adapta otro principio o una orden temporal.
  eq.mult*=1+Math.max(0,eq.auto-30)/3500;
  eq.adn={principios:Math.round(afinidadADN(m)*4),aprendizaje:eq.auto};
  return eq;
};
const _jugarJornadaV9=jugarJornada;
jugarJornada=function(jor){
  const automatico=!jor.forzado&&esGrandeMio(jor);
  const once=automatico?onceTemporada(S.plantel,S.formacion,S.fijos):[];
  const res=_jugarJornadaV9(jor);
  // El rodaje importante existe también al simular, sin duplicar el del vivo.
  once.forEach(o=>{o.jug.gr=(o.jug.gr||0)+1;});return res;
};
autoSiJuego=function(f,e){return automatismosDe(tmp.m||S.modelo||modeloDeEstilo(e));};
const _enfasisV9=aplicarEnfasis;
aplicarEnfasis=function(an,enf){
  const aprendizaje=automatismosDe(S.modelo||S.modeloPref||modeloDeEstilo(S.estilo));
  const originales=new Map(an.mis.map(p=>[p.id,p.v]));
  _enfasisV9(an,enf);
  // Una jugada ajena a lo entrenado no se domina por pedirla una vez.
  an.mis.forEach(p=>{if(p.v>originales.get(p.id))p.v=originales.get(p.id)+(p.v-originales.get(p.id))*(0.65+0.35*aprendizaje/100);});
  const coh=an.mult/(1+0.045*an.ventaja);
  an.mis.sort((a,b)=>b.v-a.v);
  const top=l=>l.length?(l[0].v+(l[1]?l[1].v:l[0].v))/2:0;
  an.ventaja=clamp(top(an.mis)-top(an.sus),-1,1);
  an.mult=(1+0.045*an.ventaja)*coh;
  return an;
};
const _cerrarTemporadaV9=cerrarTemporada;
cerrarTemporada=function(){
  const k=`${S.temporada}:${S.calc&&S.calc.pts}`;
  if(S.ultimoCierreDT===k)return;
  S.ultimoCierreDT=k; S.anosDirigiendo=(S.anosDirigiendo||0)+1;
  _cerrarTemporadaV9();
};
// Perfiles individuales, nunca nacionalidades como determinante psicológico.
contextoArenga=(function(original){return function(V){
  const r=original(V), vieja=CULTURA[S.club.p]||CULTURA_BASE;
  TONOS.forEach(t=>{r.c[t]-=vieja[t]||0;r.c[t]+=CULTURA_BASE[t]||0;});
  return r;
};})(contextoArenga);
caracter=function(j){if(!j.car)j.car=CARACTERES[hashTxt(j.nom)%CARACTERES.length];return j.car;};
// El mérito es información aproximada; no se inventan puestos exactos a partir
// del orden de una lista real. Los verificados van en el mapa curado.
const POS_VERIFICADAS={
 'Germán Pezzella':['DFC'],'Maximiliano Olivera':['LTI'],'Lucas Hernández':['LTI','DFC'],
 'Adrián Martínez':['DC'],'Duván Vergara':['EXI'],'Tomás Conechny':['EXI','EXD'],
 'Matías Zaracho':['MC','MCO'],'Matko Miljević':['MCO','MC'],'Marco Di Césare':['DFC'],
 'Javier Cabrera':['EXD','MD'],'Facundo Batista':['DC'],'Abel Hernández':['DC'],
 'Nicolás Otamendi':['DFC'],'Gabriel Báez':['LTI','DFC'],'Ezequiel Unsain':['POR'],
 'Franco Cristaldo':['MCO','MC'],'Matías Catalán':['DFC','LTD'],'Federico Fattori':['MCD','MC'],
 'Matías Galarza':['MC','MCD'],'Valentín Depietri':['EXI','DC'],'Valentín Fascendini':['DFC'],
 'Álvaro Montero':['POR'],'Leandro Paredes':['MCD','MC'],'Edinson Cavani':['DC'],
 'Miguel Merentiel':['DC'],'Juan Fernando Quintero':['MCO'],'Marcos Acuña':['LTI','MI'],
 'J. Sforza':['MCD','MC'],'Alexandro Maidana':['LTI'],'Santino Barbi':['POR']
};
const _posDeV9=posDe;
posDe=function(j){
  if(j.real){
    const p=POS_VERIFICADAS[j.nom];
    j.posVerificada=!!p;
    if(p)return j.pos=p.slice();
    return j.pos=Object.keys(ROL).filter(k=>ROL[k].g===j.g);
  }
  return _posDeV9(j);
};
const _posTxtV9=posTxt;
posTxt=function(j){posDe(j);return j.real&&!j.posVerificada?tGrupo(j.g)+' · '+t3('por línea','por setor','by line'):_posTxtV9(j);};
const _reemplazarV9=reemplazar;
reemplazar=function(i){
  const entra=tmp.selBanco, slot=window.__once&&window.__once[i];
  if(!entra||!slot)return;
  if(ROL[slot.rol].g!==entra.g&&!posDe(entra).includes(slot.rol)&&!slot.fuera){
    const aviso=document.getElementById('avisoCambio');
    if(aviso)aviso.textContent=t3(`${entra.nom} no cubre ese puesto. Elegí una ficha resaltada.`,`${entra.nom} não cobre essa posição. Escolha uma ficha destacada.`,`${entra.nom} cannot cover that position. Choose a highlighted player.`);
    return;
  }
  _reemplazarV9(i);
};
const _vistaGestionV9=vistaGestion;
vistaGestion=function(f,rep){return _vistaGestionV9(f,rep)+`<p id="avisoCambio" class="aviso-cambio" role="status" aria-live="polite"></p><p class="nota-dato">${t3('Puestos reales: verificados cuando hay ficha; el resto se adapta por línea, sin inventar una posición natural.','Posições verificadas quando disponíveis; demais jogadores por setor.','Verified positions where available; other real players are matched by line.')}</p>`;};
const _situacionAplicaV9=situacionAplica;
situacionAplica=function(d){
  if(!_situacionAplicaV9(d))return false;
  const texto=d[1]+' '+d[2].map(o=>o[0]).join(' '), f=S.formacion||S.sistemaPref;
  // Las tarjetas tácticas abstractas no pueden afirmar que usás otro sistema.
  if(/manten[eé]s tu (4-|3-|5-)/i.test(texto)&&f&&!texto.includes('tu '+f))return false;
  return true;
};
// Clásico real o rival destacado: nunca se confunden ambas etiquetas.
const CLASICOS_DT={'Talleres':'Belgrano','Stuttgart':'Karlsruher SC','Villarreal':'Valencia','Platense':'Argentinos Juniors','Argentinos Juniors':'Platense'};
const _clasicoDeV9=clasicoDe;
clasicoDe=function(club){
  const nombre=CLASICOS_DT[club.n]||(CLUB_INFO[club.n]||{}).cla;
  const liga=(LIGAS[club.p]||{}).clubes||[];
  const real=nombre&&liga.find(c=>c.n===nombre);
  if(real)return Object.assign({p:club.p,esClasicoReal:true},real);
  const rv=_clasicoDeV9(club);return rv?Object.assign(rv,{esClasicoReal:false}):null;
};
const _narrarGolV9=narrarGol;
narrarGol=function(pat,once,autor){
  const req={tercer:[/^(MCD|MC)$/, /^(MI|MD|MCO|MC)$/],bandaI:[/^(LT|CA)/,/^(EX|MI|MD)/],bandaD:[/^(LT|CA)/,/^(EX|MI|MD)/],cambio:[/^(MI|MD|MCO|MC)$/],segunda:[/^DFC$/]};
  if((req[pat]||[]).some(rx=>!once.some(o=>rx.test(o.rol))))return t3(`La jugada progresa y ${apellido(autor.jug.nom)} define.`,`A jogada avança e ${apellido(autor.jug.nom)} finaliza.`,`The move progresses and ${apellido(autor.jug.nom)} finishes.`);
  return _narrarGolV9(pat,once,autor);
};
// Guardado de pretemporada: el RNG conserva su cursor y los fijos recuperan
// referencias al mismo jugador. No se promete reanudar mitad de una animación.
function guardarPretemporada(){
  try{
    if(!S.club||!S.rng.estado||S.pant!=='plantel')return;
    const estado=JSON.parse(JSON.stringify(S,(k,v)=>k==='rng'||k==='timer'?undefined:v));
    estado.fijosIdx=(S.fijos||[]).map(j=>S.plantel.indexOf(j)).filter(i=>i>=0);delete estado.fijos;
    estado.poolIndices=(S.pool||[]).map(d=>POOL.indexOf(d));delete estado.pool;
    const data={version:VERSION_JUEGO,fecha:Date.now(),rng:S.rng.estado(),estado};
    localStorage.setItem(GUARDADO_CDT,JSON.stringify(data));
  }catch(e){ /* almacenamiento privado o lleno: la carrera sigue */ }
}
function leerGuardado(){try{const d=JSON.parse(localStorage.getItem(GUARDADO_CDT)||'null');return d&&['10.0.0','11.0.0','12.0.0','13.0.0',VERSION_JUEGO].includes(d.version)&&d.estado&&d.estado.club&&Array.isArray(d.estado.plantel)?d:null;}catch(e){return null;}}
function continuarGuardado(){
  const d=leerGuardado();if(!d)return;
  S=d.estado;S.rng=mul32(d.rng);S.fijos=(S.fijosIdx||[]).map(i=>S.plantel[i]).filter(Boolean);delete S.fijosIdx;
  S.pool=(S.poolIndices||[]).map(i=>POOL[i]).filter(Boolean);delete S.poolIndices;
  // Los arquetipos y políticas tienen funciones que no viajan en JSON.
  S.arq=ARQ.find(a=>a.id===S.arq.id);S.prensa=POLITICAS_PRENSA.find(p=>p.id===(S.prensa||{}).id)||POLITICAS_PRENSA[1];
  tmp={};prepararIdentidadDT();aplicarTema();verPlantel();
}
