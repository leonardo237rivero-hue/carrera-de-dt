// v12 — Cine de cancha. Presentación común; no consume RNG ni altera la simulación.
function paletaCine(club){
  const colores=(club&&club.c||['#f4cf27','#111418']).map(colorInterior);
  const fondo=luminanciaInterior('#171c20');
  let acento=colores.find(c=>(luminanciaInterior(c)+.05)/(fondo+.05)>=4.5);
  // El escudo y la franja mantienen siempre los colores originales. Sólo se
  // aclara la tinta de los controles cuando ninguno es legible sobre el fondo.
  if(!acento){
    let rgb=colores[0].slice(1).match(/../g).map(x=>parseInt(x,16));
    do {rgb=rgb.map(x=>Math.min(255,Math.ceil(x+(255-x)*.12)));acento='#'+rgb.map(x=>x.toString(16).padStart(2,'0')).join('');}
    while((luminanciaInterior(acento)+.05)/(fondo+.05)<4.5);
  }
  return {acento,tinta:luminanciaInterior(acento)>.179?'#080b0e':'#ffffff',principal:colores[0],secundario:colores[1]||colores[0]};
}
const _temaAntesCine=aplicarTema;
aplicarTema=function(){
  _temaAntesCine();const p=paletaCine(S.club),st=document.documentElement.style;
  Object.entries({'cine-acento':p.acento,'cine-tinta':p.tinta,'equipo1':p.principal,'equipo2':p.secundario,'equipo-acento':p.acento,'clubv':p.acento,'clubtxt':p.tinta}).forEach(([k,v])=>st.setProperty('--'+k,v));
  if(!S.club)['clubfondo','clubfondo2','clubv-sombra','clubv-osc'].forEach(k=>st.removeProperty&&st.removeProperty('--'+k));
};
const CINE_PANTALLAS={portada:['Inicio','Início','Home'],duelo:['Duelo','Duelo','Challenge'],identidad:['Tu carrera','Sua carreira','Your career'],idea:['Tu idea de juego','Sua ideia de jogo','Your playing philosophy'],ofertas:['Tu próximo club','Seu próximo clube','Your next club'],plantel:['Plantel','Elenco','Squad'],mercado:['Mercado','Mercado','Transfers'],persuasion:['La conversación','A conversa','The conversation'],ruleta:['La oportunidad','A oportunidade','The opportunity'],decision:['Una decisión','Uma decisão','A decision'],planteo:['Plan de juego','Plano de jogo','Game plan'],temporada:['Temporada','Temporada','Season'],partido:['Día de partido','Dia de jogo','Match day'],resolucion:['Balance','Balanço','Review'],club:['Puertas adentro','Portas adentro','Inside the club'],final:['Tu legado','Seu legado','Your legacy'],prensa:['Ante la prensa','Diante da imprensa','Facing the press'],banco:['Desde el banco','Do banco','From the bench']};
cabecera=function(){
  const c=$('#cab');if(!c)return;
  if(S.pant==='portada'||S.pant==='partido'){c.hidden=true;fijarCabh(0);return;}
  c.hidden=false;c.classList.add('cabecera-cine');
  const titulo=t3(...(CINE_PANTALLAS[S.pant]||CINE_PANTALLAS.club));
  const med=(v,n,max)=>`<div class="hstat"><span>${n}</span><b>${Math.round(v||0)}</b><div class="hbar"><i style="width:${clamp((v||0)/(max||100)*100,0,100)}%"></i></div></div>`;
  c.innerHTML=`<div class="cine-masthead"><div class="cine-marca">${S.club?escudo(S.club,56):'<span class="cine-monograma">DT</span>'}<div><span class="cine-kicker">CARRERA DT <span>/ ${escapeHTML(titulo)}</span></span><b>${S.club?escapeHTML(S.club.n):t3('Tu historia empieza acá.','Sua história começa aqui.','Your story starts here.')}</b></div></div>${S.club?`<div class="cine-tecnico"><span>${escapeHTML(S.nombre||'DT')}</span><small>${edadDT()} ${T('anios')} · ${t3('Temporada','Temporada','Season')} ${S.temporada||1}</small></div>`:''}</div>${S.club&&S.vars?`<div class="hstats">${med(S.vars.dir,T('directiva'))}${med(S.vars.hin,T('hinchada'))}${med(S.vars.ves,T('vestuario'))}${S.esSeleccion?'':med(S.presupuesto,T('plata'),120)}</div>`:''}`;
  fijarCabh(c.offsetHeight||0);
};
portada=function(){
  detenerDictado();S=nuevo();aplicarTema();const g=leerGuardado();
  $('#s-portada').innerHTML=`<div class="cine-portada"><div class="cine-inicio"><p class="cine-kicker">${t3('UNA CARRERA DESDE EL BANCO','UMA CARREIRA DO BANCO','A CAREER FROM THE TOUCHLINE')}</p><h1>CARRERA DT</h1><nav class="cine-menu" aria-label="${t3('Menú principal','Menu principal','Main menu')}"><button class="cine-menu-item principal" onclick="identidad()">${t3('Nueva carrera','Nova carreira','New career')}</button><button class="cine-menu-item" onclick="continuarGuardado()" ${g?'':'disabled'}>${t3('Continuar','Continuar','Continue')}${g?`<small>${escapeHTML(g.estado.club.n)} · ${t3('Pretemporada','Pré-temporada','Pre-season')}</small>`:''}</button><button class="cine-menu-item" onclick="abrirDuelo()">${T('duelo')}</button></nav><p class="cine-frase">${t3('Tu equipo. Tu idea. Tu historia.','Seu time. Sua ideia. Sua história.','Your team. Your philosophy. Your story.')}</p></div><div class="cine-portada-pie"><span>CARRERA DT <small>v${VERSION_JUEGO}</small></span><div class="idiomas">${IDIOMAS.map(x=>`<button class="lang ${IDIOMA===x.id?'on':''}" onclick="cambiarIdioma('${x.id}')" aria-pressed="${IDIOMA===x.id}">${x.n}</button>`).join('')}</div></div></div>`;ir('portada');
};
// Los futbolistas se representan exclusivamente con su posición, nunca con caras.
retratoJugadorInterior=function(j,extra){
  const p=paletaCine(S.club),pos=posDe(j),sigla=pos.length===1?siglaRol(pos[0]):j.g;
  return `<span class="cine-posicion ${extra||''}" aria-hidden="true" style="--ficha-color:${p.principal};--ficha-borde:${p.secundario}">${escapeHTML(sigla)}</span>`;
};
const _retratoDTAntesCine=retratoDT;
retratoDT=function(tam){
  if(S.mostrarRetratoDT)return _retratoDTAntesCine(tam);
  return `<span class="cine-dt" style="width:${tam||64}px;height:${tam||64}px" aria-label="${escapeHTML(S.nombre||'DT')}, ${edadDT()} ${T('anios')}">DT</span>`;
};
const _identidadAntesCine=pintarIdentidad;
pintarIdentidad=function(){
  _identidadAntesCine();const root=$('#s-identidad'),acciones=root.querySelector('.acciones');
  if(acciones)acciones.insertAdjacentHTML('beforebegin',`<label class="cine-retrato-opcion"><input type="checkbox" ${S.mostrarRetratoDT?'checked':''} onchange="S.mostrarRetratoDT=this.checked">${t3('Mostrar un retrato ilustrado del DT (opcional)','Mostrar um retrato ilustrado do técnico (opcional)','Show an illustrated coach portrait (optional)')}</label>`);
};
function cambiarSistemaCine(f){
  if(!FORMACIONES.includes(f))return;
  S.formacion=f;tmp.selBanco=null;tmp.vistaJugador=null;pintarPlantel();cabecera();
}
pintarPlantel=function(){
  prepararIdentidadDT();aplicarTema();const f=S.formacion||S.sistemaPref;
  $('#s-plantel').innerHTML=`<div class="cine-titulo"><div><p class="etq">${t3('PRETEMPORADA','PRÉ-TEMPORADA','PRE-SEASON')}</p><h2 class="disp">${t3('Plantel','Elenco','Squad')}</h2></div><label class="cine-sistema">${t3('Sistema','Sistema','Formation')}<select aria-label="${t3('Sistema del once','Sistema do time','Lineup formation')}" onchange="cambiarSistemaCine(this.value)">${FORMACIONES.map(x=>`<option ${x===f?'selected':''}>${x}</option>`).join('')}</select></label><button class="btn" onclick="abrirMercado()">${t3('Confirmar once','Confirmar time','Confirm lineup')} →</button></div>${vistaGestion(f,'pintarPlantel')}${principiosInterior()}`;
  if(S.pant==='plantel')guardarPretemporada();
};
// Conserva la sustitución y la ficha existentes, pero permite consultar todos
// los titulares en una lista legible además del campo (también por teclado).
const _gestionAntesCine=vistaGestion;
vistaGestion=function(f,rep){
  let html=_gestionAntesCine(f,rep);
  const lista=`<details class="cine-lista-titulares"><summary>${t3('Ver titulares y posiciones','Ver titulares e posições','View starters and positions')}</summary><div>${window.__once.map((o,i)=>`<button class="cine-titular" onclick="verJugadorInterior(${i},false)"><span>${escapeHTML(siglaRol(o.rol))}</span><b>${escapeHTML(o.jug.nom)}</b><small>${o.rt}</small></button>`).join('')}</div></details>`;
  return html.replace('<div class="gestion-cancha">','<div class="gestion-cancha">'+lista);
};
const _arengaAntesCine=pintarArenga;
pintarArenga=function(){
  _arengaAntesCine();const root=$('#s-partido .arenga');if(!root)return;
  // El vestuario es un espacio; los estados individuales quedan en su informe.
  const personajes=root.querySelector('.vestuario-personajes');if(personajes)personajes.remove();
  const h=root.querySelector('h2');if(h)h.textContent=t3('Antes de salir.','Antes de entrar.','Before we walk out.');
  const caras=root.querySelector('.ar-caras');if(caras){const d=document.createElement('details');d.className='cine-informe-vestuario';d.innerHTML=`<summary>${t3('Cómo llega el grupo','Como chega o grupo','How the squad is feeling')}</summary>`;caras.before(d);d.appendChild(caras);}
};
const _finalAntesCine=final;
final=function(){
  _finalAntesCine();const root=$('#s-final'),firma=root.querySelector('.firma-dt'),h=root.querySelector('h2');
  if(h)h.textContent=t3('Tu legado','Seu legado','Your legacy');
  if(firma){firma.classList.add('cine-legado-firma');const p=firma.querySelector('p');if(p)p.textContent=t3('Cada temporada dejó una historia.','Cada temporada deixou uma história.','Every season left a story.');}
  const tarjeta=root.querySelector('.tarjeta');if(tarjeta)tarjeta.classList.add('cine-legado');
  if(S.titulos.length){
    const tabla=root.querySelector('table');
    if(tabla)tabla.outerHTML=`<div class="cine-palmares">${S.titulos.map(t=>`<article class="cine-copa">${trofeo(t.tipo||'liga',54)}<div><h3>${escapeHTML(t.comp||t3('Título','Título','Trophy'))}</h3><p>${escapeHTML(t.club)} · ${t3('Temporada','Temporada','Season')} ${t.t}</p></div></article>`).join('')}</div>`;
  }
};
