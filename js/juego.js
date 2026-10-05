// Carrera de DT — flujo del juego: pantallas y loop de temporada
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   PORTADA
   ========================================================== */
function cambiarIdioma(id){ setIdioma(id); portada(); }
function portada(){
  S=nuevo(); aplicarTema();
  const demo=armarOnce(generarPlantel(70,3,null,"Uruguay"),"4-3-3",[]);
  $("#s-portada").innerHTML=`
    <div style="margin:26px 0 18px">
      <h2 class="disp" style="font-size:46px">${T("titulo")}</h2>
      <p class="mini" style="margin-top:6px">${t3("Vos elegís cómo juega el equipo. El resto lo decide la cancha.",
        "Você escolhe como o time joga. O resto, o campo decide.",
        "You decide how the team plays. The pitch decides the rest.")}</p>
    </div>
    ${cancha(demo,{mostrarRating:false,alto:300,ancho:420})}
    <div class="idiomas">${IDIOMAS.map(x=>`
      <button class="lang ${IDIOMA===x.id?'on':''}" onclick="cambiarIdioma('${x.id}')">${x.bandera} ${x.n}</button>`).join("")}</div>
    <div class="acciones">
      <button class="btn" onclick="identidad()">${T("empezar")}</button>
      <button class="btn sec" onclick="abrirDuelo()">${T("duelo")}</button>
    </div>
    <p class="mini" style="margin-top:12px">${t3("En el duelo los dos DT reciben las mismas situaciones, las mismas cartas y el mismo azar. Sólo cambia lo que cada uno decide.",
      "No duelo os dois técnicos recebem as mesmas situações, as mesmas cartas e a mesma sorte. Só muda o que cada um decide.",
      "In a duel both coaches get the same situations, the same cards and the same luck. Only their decisions differ.")}</p>`;
  ir("portada");
}

/* ==========================================================
   IDENTIDAD DEL DT
   ========================================================== */
const MODOS=[
 {id:"expres",n:"Exprés",temporadas:3,desc:"Tres temporadas. Una partida de café."},
 {id:"normal",n:"Normal",temporadas:6,desc:"Seis temporadas. La carrera completa."},
 {id:"largo", n:"Carrera larga",temporadas:10,desc:"Diez temporadas. Da para construir un ciclo y romper récords."}
];
function codigoNuevo(){
  const L="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s=""; for(let i=0;i<6;i++) s+=L[Math.floor(Math.random()*L.length)];
  return s;
}
function abrirDuelo(){
  tmp.codigo=tmp.codigo||codigoNuevo();
  pintarDuelo(); ir("duelo");
}
function pintarDuelo(){
  $("#s-duelo").innerHTML=`
    <h2 class="disp">Duelo</h2>
    <p>Los dos juegan su carrera por separado, cuando cada uno pueda.
    El código hace que reciban <b>exactamente</b> las mismas situaciones, las mismas
    cartas del mercado, las mismas ruletas y las mismas tiradas de azar.
    Gana el que saca mejor puntaje.</p>
    <h3 class="disp">Tu código</h3>
    <div class="codigo-caja">
      <input type="text" id="cod" maxlength="10" value="${tmp.codigo}"
        oninput="tmp.codigo=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')">
      <button class="btn sec" onclick="copiarCodigo()">Copiar</button>
      <button class="btn sec" onclick="tmp.codigo=codigoNuevo();pintarDuelo()">Otro</button>
    </div>
    <p class="mini" id="avisoCod">Pasáselo al otro DT. El que lo reciba lo escribe acá y juega la misma carrera.</p>
    <div class="nota-lat">Para que la comparación sea justa, los dos tienen que elegir
    <b>el mismo modo de duración</b>. Lo demás —perfil, sistema, club— puede ser distinto:
    de eso se trata.</div>
    <div class="acciones">
      <button class="btn" onclick="empezarDuelo()">Jugar con este código</button>
      <button class="btn sec" onclick="portada()">${T("volver")}</button></div>`;
}
function copiarCodigo(){
  const t=($("#cod")&&$("#cod").value)||tmp.codigo;
  const ok=()=>{const a=$("#avisoCod"); if(a) a.textContent="Código copiado. Pasáselo al otro DT.";};
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok).catch(ok);
  else ok();
}
function empezarDuelo(){
  const c=($("#cod")&&$("#cod").value.trim().toUpperCase())||tmp.codigo;
  if(!c) return;
  const g=c; identidad(); S.duelo=g;
}
/* ==========================================================
   MERCADO DE ENTRENADORES — quién te quiere
   ========================================================== */
function verOfertas(){
  // en duelo la semilla manda desde el principio: hasta las ofertas son iguales
  S.rng = S.duelo ? mul32(hashS(S.duelo)) : mul32(hashS("libre"+Math.random()));
  const mez=R.mz(CLUBES);
  const grande=mez.find(c=>c.niv>=5), medio=mez.find(c=>c.niv===3||c.niv===4), chico=mez.find(c=>c.niv<=2);
  S.ofertas=[
    {club:grande,div:0,txt:{es:"Techo altísimo, pero entrás por las formativas. Si salís campeón, subís de golpe.",
      pt:"Teto altíssimo, mas você entra pela base. Se for campeão, sobe de uma vez.",en:"Sky-high ceiling, but you start in the academy. Win the title and you jump up."}},
    {club:medio,div:3,txt:{es:"Primera división de entrada. Plantel correcto, exigencia media.",
      pt:"Primeira divisão de cara. Elenco correto, cobrança média.",en:"First team from day one. Decent squad, moderate demands."}},
    {club:chico,div:3,txt:{es:"Primera de un club chico. Poca plata, pero nadie te pide salir campeón.",
      pt:"Primeira de um clube pequeno. Pouco dinheiro, mas ninguém pede título.",en:"First team at a small club. Little money, but nobody demands a title."}}
  ];
  $("#s-ofertas").innerHTML=`
    <h2 class="disp">${T("quienTeQuiere")}</h2>
    <p class="mini">${t3("Tres ofertas sobre la mesa. Elegí dónde arranca tu carrera.","Três propostas na mesa. Escolha onde começa sua carreira.","Three offers on the table. Pick where your career starts.")}</p>
    ${S.ofertas.map((o,i)=>`
      <button class="oferta" onclick="firmar(${i})">
        ${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}
        <div class="of-pie"><span>${o.club.p} · ${LIGAS[o.club.p].liga}</span><span>${L(o.txt)}</span></div>
      </button>`).join("")}`;
  ir("ofertas");
}
function firmar(i){ firmarClub(S.ofertas[i]); }
function firmarClub(o){
  S.club=o.club; S.division=o.div; S.esSeleccion=false;
  // el RNG ya quedó sembrado en verOfertas; acá no se toca para no romper el duelo
  S.plantel=generarPlantel(nivelBaseDe(o.club.niv,o.div),o.div,null,o.club.p);
  if(S.arq.id==="bombero") S.plantel.forEach(j=>{if(j.g==="DEF"||j.g==="POR")j.rt=clamp(j.rt+7,28,94);});
  if(S.arq.id==="ganador"){const d=S.plantel.filter(j=>j.g==="ATA").sort((a,b)=>b.rt-a.rt)[0];if(d)d.rt=clamp(d.rt+8,28,94);}
  S.presupuesto=clamp(18+o.club.niv*8+S.arq.pres,5,100);
  S.prensa=POLITICAS_PRENSA[1]; S.prensaElegida=false;
  S.vars={res:50,dir:clamp(50+S.arq.dir,5,95),hin:clamp(50+S.arq.hin,5,95),ves:clamp(50+S.arq.vest,5,95)};
  S.pool=R.mz(POOL); S.temporada=1; S.estadio=Math.max(1,o.club.niv-1);
  aplicarTema();
  abrirTemporada();
}

/* ==========================================================
   TEMPORADA — arranque
   ========================================================== */
function abrirTemporada(){
  S.decs=[S.pool.shift(),S.pool.shift()].filter(Boolean); S.decIdx=0;
  S.decs=S.decs.map(d=>marcar(d,"pool"));
  // en formativas, las situaciones son otras: padres, colegio, representantes
  if(S.division<3 && !S.esSeleccion){
    S.poolForm = S.poolForm || R.mz(POOL_FORMATIVAS);
    for(let k=0;k<S.decs.length;k++){
      if(S.poolForm.length && S.rng()<0.8) S.decs[k]=marcar(S.poolForm.shift(),"form");
    }
  }
  // primera temporada en un club con historia: te preguntan por el ídolo
  if(!S.idoloPreguntado&&IDOLOS[S.club.n]&&S.division===3&&!S.esSeleccion){
    const sit=situacionIdoloI18N(S.club);
    if(sit){ sit.__yaTraducida=true; S.decs[0]=sit; S.idoloPreguntado=true; }
  }
  // si ya te ganaste una etiqueta, una de las dos decisiones habla de eso
  if(S.etiqueta && !S.repUsadas) S.repUsadas=[];
  if(S.etiqueta){
    const cands=POOL_REPUTACION.filter(x=>x.req===S.etiqueta.id && !S.repUsadas.includes(x.d[1]));
    if(cands.length && S.rng()<0.75){
      const el=R.el(cands);
      S.repUsadas.push(el.d[1]);
      S.decs[R.e(0,S.decs.length-1)]=marcar(el.d,"rep");
    }
  }
  aplicarTema();
  pretemporada();
  colaPrevia();
}
// pantallas que aparecen antes del plantel sólo cuando corresponde
function colaPrevia(){
  if(S.introVisto!==S.club.n){ introClub(colaPrevia); return; }
  if(necesitaIdioma()){ pantallaIdioma(colaPrevia); return; }
  if(necesitaPrensa()){ pantallaPrensa(colaPrevia); return; }
  verPlantel();
}

/* ==========================================================
   PLANTEL — forma, cansancio y lesiones: el banco sirve
   ========================================================== */
function grupoLbl(g){return tGrupo(g);}
function verPlantel(){ tmp.selBanco=null; pintarPlantel(); ir("plantel"); }
function pintarPlantel(){
  const f=S.formacion||S.sistemaPref;
  $("#s-plantel").innerHTML=`
    <h2 class="disp">${T("tuPlantel")}</h2>
    <p class="mini">${t3("Pretemporada. Cada uno llega distinto: mirá quién está enchufado y quién no.",
      "Pré-temporada. Cada um chega diferente: veja quem está voando e quem não.",
      "Pre-season. Everyone arrives in a different state: see who's flying and who isn't.")}</p>
    ${tablero()}
    ${vistaGestion(f,"pintarPlantel")}
    <div class="acciones"><button class="btn" onclick="abrirMercado()">${T("irMercado")}</button></div>`;
}
function estadoChips(j){
  const c=[];
  if(j.les>0) c.push(`<span class="est les">✚ ${t3("lesionado","lesionado","injured")} · ${j.les} ${t3(j.les>1?"fechas":"fecha",j.les>1?"rodadas":"rodada",j.les>1?"games":"game")}</span>`);
  if(j.sus>0) c.push(`<span class="est sus">▮ ${t3("suspendido","suspenso","suspended")}</span>`);
  if(j.forma>=2) c.push(`<span class="est fup">▲${j.forma} ${t3("forma","forma","form")}</span>`);
  if(j.forma<=-2) c.push(`<span class="est fdn">▼${-j.forma} ${t3("forma","forma","form")}</span>`);
  if(j.fat>=55) c.push(`<span class="est fat">${t3("cansado","cansado","tired")} ${Math.round(j.fat)}%</span>`);
  return c.join("");
}
function vistaGestion(f,rep){
  const once=onceTemporada(S.plantel,f,S.fijos);
  const enOnce=new Set(once.map(o=>o.jug));
  const banco=S.plantel.filter(j=>!enOnce.has(j)).sort((a,b)=>disponible(b)-disponible(a)||efectivo(b)-efectivo(a));
  window.__banco=banco; window.__once=once; window.__rep=rep;
  const fuera=once.filter(o=>o.fuera).length;
  const sel=tmp.selBanco;
  const mejorEnBanco=banco.filter(disponible).some(b=>once.some(o=>ROL[o.rol].g===b.g&&efectivo(b)>o.rt+1));
  return `${barras(atributosDe(once))}
    <div class="plantel-grid">
      <div>${canchaGestion(once)}
        ${fuera?`<p class="mini" style="color:var(--ambar)">${fuera} ${t3("fuera de puesto (−10)","fora de posição (−10)","out of position (−10)")}</p>`:""}</div>
      <div class="banco">
        <h3 class="disp" style="font-size:18px;margin:0 0 6px">${T("banco")}</h3>
        <p class="mini" style="margin-bottom:8px">${sel?T("bancoAyuda2"):T("bancoAyuda")}</p>
        ${mejorEnBanco?`<div class="alerta" style="margin-bottom:8px">${t3("Hay suplentes rindiendo más que algún titular.","Há reservas rendendo mais que algum titular.","Some subs are performing better than a starter.")}</div>`:""}
        ${banco.map((j,i)=>{const nd=!disponible(j); return `
          <button class="sup ${sel===j?'sel':''} ${nd?'nodisp':''}" ${nd?'disabled':''} onclick="elegirBanco(${i})">
            <span class="sup-rt ${efectivo(j)>j.rt?'arriba':efectivo(j)<j.rt?'abajo':''}">${efectivo(j)}</span>
            <span class="sup-nom">${j.nom}${j.nuevo?` <em class="nuevo">${t3("NUEVO","NOVO","NEW")}</em>`:""}</span>
            <span class="sup-pos">${tGrupo(j.g)} · ${j.ed} · ${t3("nivel","nível","level")} ${j.rt}</span>
            <span class="sup-est">${estadoChips(j)}</span>
          </button>`;}).join("")}
        ${S.fijos&&S.fijos.length?`<button class="btn sec" style="margin-top:10px;font-size:13px"
          onclick="S.fijos=[];tmp.selBanco=null;${rep}()">${T("onceAuto")}</button>`:""}
      </div>
    </div>
    <p class="mini">${t3("El número grande es cómo rinde <b>hoy</b>: nivel + forma − cansancio. El once automático va por jerarquía, no por el momento.",
      "O número grande é quanto rende <b>hoje</b>: nível + forma − cansaço. A escalação automática vai por hierarquia, não pelo momento.",
      "The big number is how he performs <b>today</b>: level + form − fatigue. The automatic XI goes by reputation, not current form.")}</p>`;
}
function canchaGestion(once){
  const W=420,H=450,margen=20, span=H-margen*2;
  const fc=fichaColores(S.club);
  return `<svg class="cancha" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t3("Tu once en la cancha","Seu time em campo","Your XI on the pitch")}">
    <rect width="${W}" height="${H}" fill="#224236"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<rect y="${i*H/8}" width="${W}" height="${H/16}" fill="#284C3E"/>`).join("")}
    <rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <line x1="6" y1="${H/2}" x2="${W-6}" y2="${H/2}" stroke="#5A8A76" stroke-width="1.5"/>
    <circle cx="${W/2}" cy="${H/2}" r="40" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-62}" y="${H-46}" width="124" height="40" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    ${once.map((o,i)=>{
      const px=(o.x/100)*W, py=H-margen-(o.y/100)*span, j=o.jug;
      const marcado=tmp.selBanco&&ROL[o.rol].g===tmp.selBanco.g;
      const fat=clamp(j.fat||0,0,100), colFat=fat>=70?"#D9543F":fat>=50?"#E0A93B":"#4FBF7F";
      const flecha=j.forma>=2?`<text x="${px+15}" y="${py-9}" font-size="11" font-weight="800" fill="#4FBF7F">▲</text>`
        :j.forma<=-2?`<text x="${px+15}" y="${py-9}" font-size="11" font-weight="800" fill="#D9543F">▼</text>`:"";
      return `<g style="cursor:pointer" onclick="reemplazar(${i})">
        ${j.nuevo?`<circle cx="${px}" cy="${py}" r="21" fill="none" stroke="#E0A93B" stroke-width="2" stroke-dasharray="4 3"/>`:""}
        <circle cx="${px}" cy="${py}" r="16" fill="${marcado?'#E0A93B':fc.fill}"
          stroke="${o.fuera?'#E0A93B':fc.stroke}" stroke-width="2.5"/>
        <text x="${px}" y="${py+5}" text-anchor="middle" class="pos-chip" font-size="13"
          fill="${marcado?'#111':fc.txt}" pointer-events="none">${o.rt}</text>
        ${flecha}
        <text x="${px}" y="${py+29}" text-anchor="middle" font-size="9" font-weight="600"
          fill="#DCEFE5" pointer-events="none">${(j.nom||"").split(" ").pop()}</text>
        <rect x="${px-14}" y="${py+33}" width="28" height="3.5" rx="1.5" fill="#0F1714"/>
        <rect x="${px-14}" y="${py+33}" width="${28*fat/100}" height="3.5" rx="1.5" fill="${colFat}"/>
        <text x="${px}" y="${py-21}" text-anchor="middle" font-size="8"
          fill="#8FC0AA" pointer-events="none">${tRol(o.rol)}</text></g>`;
    }).join("")}
  </svg>
  <div class="leyenda"><span><b style="color:#4FBF7F">▲</b>/<b style="color:#D9543F">▼</b> ${t3("forma","forma","form")}</span>
    <span><i class="mini-bar"></i> ${t3("cansancio","cansaço","fatigue")}</span>
    <span><i class="pt" style="border:2px dashed #E0A93B"></i> ${t3("recién llegado","recém-chegado","new signing")}</span></div>`;
}
function elegirBanco(i){
  const j=window.__banco[i];
  if(!disponible(j)) return;
  tmp.selBanco = (tmp.selBanco===j) ? null : j;
  window[window.__rep]();
}
function reemplazar(i){
  if(!tmp.selBanco) return;
  const sale=window.__once[i].jug, entra=tmp.selBanco;
  if(ROL[window.__once[i].rol].g!==entra.g&&!window.__once[i].fuera) return; // mismo puesto
  S.fijos=(S.fijos||[]).filter(x=>x!==sale&&x!==entra);
  // el once queda "a mano": los titulares actuales pasan a ser fijos, salvo el que sale
  window.__once.forEach(o=>{ if(o.jug!==sale&&!S.fijos.includes(o.jug)) S.fijos.push(o.jug); });
  S.fijos.push(entra);
  tmp.selBanco=null;
  window[window.__rep]();
}


/* ---------- mercado de pases ---------- */
function abrirMercado(){
  const grupos=R.mz(["POR","DEF","MED","ATA","DEF","MED","ATA"]).slice(0,3);
  const nivelBase=nivelBaseDe(S.club.niv,S.division)+S.temporada*2;
  S.cartas=grupos.map(g=>{
    const j=nuevoJugador(g,nivelBase+R.e(2,12),S.division,null,S.club.p);
    return {j,costo:clamp(Math.round(Math.max(4,(j.rt-nivelBase+12))*1.6+R.e(-4,6)),4,70),estado:"libre",
            demora:Math.round(R.r(6000,14000))};
  });
  pintarMercado(); ir("mercado"); correrPiqueo();
}
function impactoDe(jugador){
  const f=S.formacion||S.sistemaPref;
  const antes=atributosDe(armarOnce(S.plantel,f,S.fijos));
  const desp=atributosDe(armarOnce(S.plantel.concat([jugador]),f,S.fijos));
  return {antes,desp,dif:desp.map((v,i)=>v-antes[i])};
}
function pintarMercado(){
  $("#s-mercado").innerHTML=`
    <h2 class="disp">${S.esSeleccion?"Convocatoria":(S.division<3?"Captación de juveniles":"Mercado de pases")}</h2>
    <p class="mini">${S.esSeleccion?"Otro cuerpo técnico mira los mismos nombres.":"Otro DT mira la misma lista."} El primero que se tira, se lo lleva.
    Debajo de cada uno ves cuánto te cambia el equipo con tu sistema actual.</p>
    ${panelPlantel()}
    <div class="reloj"><i id="rbar"></i></div>
    <div class="grid3">${S.cartas.map((k,i)=>{
      const im=impactoDe(k.j);
      const util=im.dif.map((d,x)=>d?`${ATRIBUTOS[x]} ${im.antes[x]}→${im.desp[x]}`:null).filter(Boolean);
      const costo=S.esSeleccion?0:k.costo;
      return `<button class="jug" ${k.estado!=="libre"||costo>S.presupuesto?"disabled":""} onclick="piquear(${i})">
        <div class="rt">${k.j.rt}</div>
        <div class="nm">${k.j.nom}</div>
        <div class="ps">${tGrupo(k.j.g)} · ${k.j.ed} años · ${S.esSeleccion?"convocable":"cuesta "+k.costo}</div>
        <div class="imp">${util.length?util.map(t=>`<div style="color:var(--verde)">${t}</div>`).join(""):
          `<span style="color:var(--tenue)">No entra al once. No te cambia nada hoy.</span>`}
          ${costo>S.presupuesto?'<div style="color:var(--rojo)">No te alcanza</div>':''}</div>
        ${k.estado==="rival"?'<div class="sello">SE LO LLEVÓ EL OTRO DT</div>':''}
        ${k.estado==="libre"&&costo>S.presupuesto?`<div class="sello" style="color:var(--ambar);font-size:14px">
          NO TE ALCANZA<tspan></tspan><br><span style="font-size:11px;font-weight:400">te faltan ${Math.ceil(costo-S.presupuesto)}</span></div>`:''}
        ${k.estado==="mio"?'<div class="sello" style="color:var(--verde)">FICHADO</div>':''}
      </button>`;}).join("")}</div>
    <div class="acciones"><button class="btn" onclick="cerrarMercado()">${T("cerrarMercado")}</button></div>`;
}
function correrPiqueo(){
  const t0=Date.now(), dur=15000;
  clearInterval(S.timer);
  S.timer=setInterval(()=>{
    const t=Date.now()-t0, b=$("#rbar");
    if(b) b.style.width=clamp(100-(t/dur)*100,0,100)+"%";
    let cambio=false;
    S.cartas.forEach(k=>{if(k.estado==="libre"&&t>k.demora){k.estado="rival";cambio=true;}});
    if(cambio) pintarMercado();
    if(t>dur||!S.cartas.some(k=>k.estado==="libre")){clearInterval(S.timer);pintarMercado();
      const bb=$("#rbar"); if(bb) bb.style.width="0%";}
  },120);
}
function piquear(i){
  const k=S.cartas[i];
  const costo=S.esSeleccion?0:k.costo;
  if(k.estado!=="libre"||costo>S.presupuesto) return;
  k.estado="mio"; S.presupuesto-=costo; S.plantel.push(k.j);
  pintarMercado(); cabecera();
}
function cerrarMercado(){clearInterval(S.timer); persuasion();}

/* ---------- persuadir a un jugador que duda ---------- */
function persuasion(){
  // aparece cuando tenés plata y estás en primera: un jugador mejor que tu plantel
  const puede = !S.esSeleccion && S.division===3 && S.presupuesto>=25 && S.rng()<0.55;
  if(!puede){ abrirRuleta(); return; }
  const g=R.el(["DEF","MED","ATA"]);
  const mios=S.plantel.filter(x=>x.g===g).map(x=>x.rt);
  const techo=mios.length?Math.max(...mios):60;
  const j=nuevoJugador(g,techo+R.e(5,11),3,null,S.club.p);
  const mot=R.el(MOTIVACIONES);
  S.persuade={j,mot,costo:clamp(Math.round((j.rt-techo)*4+R.e(8,18)),12,60),intento:0};
  pintarPersuasion();
  ir("persuasion");
}
function pintarPersuasion(){
  const p=S.persuade, im=impactoDe(p.j);
  const util=im.dif.map((d,x)=>d?`${ATRIBUTOS[x]} ${im.antes[x]}→${im.desp[x]}`:null).filter(Boolean);
  $("#s-persuasion").innerHTML=`
    <h2 class="disp">Hay uno que duda</h2>
    <p>Está al alcance del club, pero no se decide. La plata sola no lo trae:
    hay que darle el argumento que a él le importa.</p>
    <div class="jug" style="cursor:default;max-width:320px;margin-bottom:12px">
      <div class="rt">${p.j.rt}</div>
      <div class="nm">${p.j.nom}</div>
      <div class="ps">${tGrupo(p.j.g)} · ${p.j.ed} años · cuesta ${p.costo}</div>
      <div class="imp">${util.length?util.map(t=>`<div style="color:var(--verde)">${t}</div>`).join(""):
        '<span style="color:var(--tenue)">Hoy no entraría al once.</span>'}</div>
    </div>
    <div class="ficha-sit"><div class="cat">Lo que dejó ver en la charla</div>
      <p>${tMotiv(p.mot,"pista")}</p></div>
    ${panelPlantel()}
    <h3 class="disp">¿Con qué lo convencés?</h3>
    <p class="mini">Tenés un solo intento. Si le errás, se va a otro lado.</p>
    ${R.mz(ARGUMENTOS).map(a=>`
      <button class="card" onclick="convencer('${a.id}')"><b style="font-size:16px">${tArgum(a)}</b></button>`).join("")}
    <div class="acciones"><button class="btn sec" onclick="abrirRuleta()">No lo busco, sigo con lo que tengo</button></div>`;
}
function convencer(id){
  const p=S.persuade;
  const acerto = id===p.mot.id;
  const alcanza = S.presupuesto>=p.costo;
  let txt;
  if(acerto&&alcanza){
    S.presupuesto-=p.costo; S.plantel.push(p.j);
    S.vars.ves=clamp(S.vars.ves+4,0,100);
    txt=`<div class="resultado bien"><b>Firmó</b>
      <span>Le tocaste la tecla: lo que le importaba era ${p.mot.n}.
      El vestuario registra que trajiste a alguien que te eligió a vos.</span></div>`;
  } else if(acerto&&!alcanza){
    txt=`<div class="resultado"><b>Lo convenciste pero no te alcanza</b>
      <span>Le diste el argumento justo: lo que le importaba era ${p.mot.n}.
      Te faltan ${Math.ceil(p.costo-S.presupuesto)} de presupuesto y el club no los pone.</span></div>`;
  } else {
    S.vars.hin=clamp(S.vars.hin-2,0,100);
    txt=`<div class="resultado mal"><b>Se fue a otro lado</b>
      <span>No era eso lo que buscaba. Le importaba ${p.mot.n},
      y vos le hablaste de otra cosa.</span></div>`;
  }
  $("#s-persuasion").innerHTML=`<h2 class="disp">${acerto&&alcanza?"Lo trajiste":"No se dio"}</h2>${txt}
    <div class="acciones"><button class="btn" onclick="abrirRuleta()">${T("seguir")}</button></div>`;
  cabecera();
}

/* ---------- ruleta: dos fichas, como en el casino ---------- */
// 18 casillas: por zona 3 comunes y 1 crack, más 2 rojas ("se te va un jugador").
// Apostar a un común cuesta 1 ficha (3 de 18 = 17%); a un crack, 2 fichas (1 de 18 = 6%).
// Si la bocha cae en lo que apostaste, te llevás al jugador. Si no, nada.
const ZONAS_RUL=["POR","DEF","MED","ATA"];
const RUL=[["DEF",0],["MED",0],["ATA",1],["POR",0],["X",0],["DEF",0],["MED",1],["ATA",0],["POR",0],
           ["DEF",1],["MED",0],["ATA",0],["POR",1],["X",0],["DEF",0],["MED",0],["ATA",0],["POR",0]]
  .map(([g,c])=>({g,crack:!!c,roja:g==="X"}));
const SEGMENTOS=RUL;
function lblRul(s,corto){
  if(s.roja) return corto?"✖":t3("Se va uno","Sai um","One leaves");
  const n={POR:t3("Arquero","Goleiro","Keeper"),DEF:t3("Defensa","Defesa","Defender"),MED:t3("Medio","Meio","Midfield"),ATA:t3("Ataque","Ataque","Attack")}[s.g];
  const c={POR:t3("ARQ","GOL","GK"),DEF:"DEF",MED:t3("MED","MEI","MID"),ATA:t3("ATA","ATA","ATT")}[s.g];
  return corto?(c+(s.crack?"★":"")):(n+(s.crack?" crack":""));
}
function abrirRuleta(){
  tmp.apuestas=[]; tmp.girada=false;
  pintarRuleta(); ir("ruleta");
}
function fichasUsadas(){ return tmp.apuestas.reduce((a,x)=>a+(x.crack?2:1),0); }
function svgRuleta(){
  const n=RUL.length, r=124, ri=48, cx=140, cy=140;
  let out=`<svg id="ruleta" width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="${t3("Ruleta del club","Roleta do clube","Club roulette")}">`;
  RUL.forEach((s,i)=>{
    const a0=(i/n)*2*Math.PI-Math.PI/2, a1=((i+1)/n)*2*Math.PI-Math.PI/2;
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const apostada=tmp.apuestas.some(x=>x.g===s.g&&x.crack===s.crack)&&!s.roja;
    const base=s.roja?"#7A1F1F":s.crack?"#7A4A12":(i%2?"#26332E":"#2E3F38");
    out+=`<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z"
      fill="${apostada?(s.crack?'#E0A93B':'#4FBF7F'):base}" stroke="#141C19" stroke-width="1.5"/>`;
    const am=(a0+a1)/2, tx=cx+(r*0.72)*Math.cos(am), ty=cy+(r*0.72)*Math.sin(am);
    const deg=am*180/Math.PI;
    out+=`<text x="${tx}" y="${ty+3.5}" text-anchor="middle" font-size="10.5" font-weight="700"
      fill="${apostada?'#141C19':s.roja?'#FFB3A7':(s.crack?'#F0C98A':'#DDE6E0')}"
      transform="rotate(${deg+90} ${tx} ${ty})">${lblRul(s,true)}</text>`;
  });
  out+=`<circle cx="${cx}" cy="${cy}" r="${ri}" fill="#141C19" stroke="#4FBF7F" stroke-width="2"/>
    <text x="${cx}" y="${cy-3}" text-anchor="middle" font-size="22" font-weight="800" fill="#E4E8E1" font-family="Big Shoulders Display">18</text>
    <text x="${cx}" y="${cy+13}" text-anchor="middle" font-size="10" fill="#8A9A91">${t3("casillas","casas","slots")}</text></svg>`;
  return out;
}
function pintarRuleta(){
  const usadas=fichasUsadas();
  const opcion=(g,crack)=>{
    const on=tmp.apuestas.some(x=>x.g===g&&x.crack===crack);
    const costo=crack?2:1, casillas=RUL.filter(s=>s.g===g&&s.crack===crack).length;
    const puede=on||(usadas+costo<=2);
    return `<button class="ficha-btn ${on?'on':''} ${crack?'crack':''}" ${tmp.girada||!puede?'disabled':''}
      onclick="ponerFicha('${g}',${crack})">
      <div class="fb-n">${lblRul({g,crack})}</div>
      <div class="fb-c">${"●".repeat(costo)} ${costo} ${t3(costo>1?"fichas":"ficha",costo>1?"fichas":"ficha",costo>1?"chips":"chip")}</div>
      <div class="fb-p">${casillas}/18 · ${Math.round(casillas/18*100)}%</div></button>`;
  };
  $("#s-ruleta").innerHTML=`
    <h2 class="disp">${T("ruleta")}</h2>
    <p class="mini">${t3("Tenés <b>2 fichas</b>. Un puesto común cuesta 1 ficha; un crack, 2. Si la bocha cae donde apostaste, te llevás al jugador. Si no, nada. Y ojo con las casillas rojas: se te va uno del plantel.",
      "Você tem <b>2 fichas</b>. Uma posição comum custa 1 ficha; um craque, 2. Se a bola cair onde apostou, leva o jogador. Se não, nada. E cuidado com as casas vermelhas: sai um do elenco.",
      "You have <b>2 chips</b>. A regular slot costs 1 chip; a star costs 2. If the ball lands on your bet, you sign the player. Otherwise, nothing. Watch the red slots: you lose a squad player.")}</p>
    ${panelPlantel()}
    <div class="ruleta-wrap">
      <div style="font-size:22px;color:var(--ambar);line-height:1">▼</div>
      ${svgRuleta()}
      <div class="fichas-restan">${[0,1].map(i=>`<span class="chip-f ${i<usadas?'usada':''}"></span>`).join("")}
        <span class="mini">${2-usadas} ${t3("fichas libres","fichas livres","chips left")}</span></div>
    </div>
    <div class="rul-grid">
      <div><div class="lbl-sel">${t3("Comunes · 1 ficha","Comuns · 1 ficha","Regular · 1 chip")}</div>
        <div class="fichas">${ZONAS_RUL.map(g=>opcion(g,false)).join("")}</div></div>
      <div><div class="lbl-sel" style="color:var(--ambar)">${t3("Cracks · 2 fichas","Craques · 2 fichas","Stars · 2 chips")}</div>
        <div class="fichas">${ZONAS_RUL.map(g=>opcion(g,true)).join("")}</div></div>
    </div>
    <p class="mini"><span style="color:#FF8A78">✖ ${t3("2 casillas rojas (11%): se te va un jugador al azar.","2 casas vermelhas (11%): sai um jogador ao acaso.","2 red slots (11%): a random player leaves.")}</span>
      ${tmp.apuestas.length?` · ${t3("Chance de llevarte a alguien","Chance de levar alguém","Chance of signing someone")}: <b>${Math.round(tmp.apuestas.reduce((a,x)=>a+RUL.filter(s=>s.g===x.g&&s.crack===x.crack).length,0)/18*100)}%</b>`:""}</p>
    <div class="acciones">
      <button class="btn" id="btnGirar" onclick="girar()" ${tmp.apuestas.length&&!tmp.girada?'':'disabled'}>${T("girar")}</button>
      <button class="btn sec" onclick="siguienteDecision()" ${tmp.girada?'disabled':''}>${t3("No juego esta vez","Não jogo desta vez","Sit this one out")}</button></div>
    <div id="salida"></div>`;
}
function ponerFicha(g,crack){
  if(tmp.girada) return;
  const k=tmp.apuestas.findIndex(x=>x.g===g&&x.crack===crack);
  if(k>=0) tmp.apuestas.splice(k,1);
  else if(fichasUsadas()+(crack?2:1)<=2) tmp.apuestas.push({g,crack});
  pintarRuleta();
}
function girar(){
  if(tmp.girada||!tmp.apuestas.length) return;
  tmp.girada=true;
  const gan=R.e(0,RUL.length-1), seg=RUL[gan];
  const grados=360*5+(360-(gan+0.5)*(360/RUL.length));
  const el=$("#ruleta");
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(el&&!reduce) el.style.transform=`rotate(${grados}deg)`;
  const acerto=!seg.roja&&tmp.apuestas.some(x=>x.g===seg.g&&x.crack===seg.crack);
  // se calcula ya (con el RNG del duelo), se muestra cuando para la rueda
  let j=null, seVa=null, cobro=0;
  if(acerto){
    const mios=S.plantel.filter(x=>x.g===seg.g).map(x=>x.rt);
    const mejorMio=mios.length?Math.max(...mios):nivelBaseDe(S.club.niv,S.division);
    const piso=nivelBaseDe(S.club.niv,S.division)+S.temporada*2;
    const base=seg.crack?Math.max(mejorMio,piso)+R.e(4,9):Math.max(mejorMio-4,piso)+R.e(-2,4);
    j=nuevoJugador(seg.g,base+(S.arq.id==="formador"?4:0),S.division,null,S.club.p);
    j.nuevo=true; prepJug(j);
  } else if(seg.roja){
    const cand=S.plantel.filter(x=>x.g!=="POR");
    seVa=R.el(cand);
    cobro=Math.max(3,Math.round((seVa.rt-30)/4));
  }
  document.querySelectorAll(".ficha-btn").forEach(x=>x.disabled=true);
  const b=$("#btnGirar"); if(b) b.disabled=true;
  setTimeout(()=>{
    const s=$("#salida"); if(!s) return;
    if(j){
      const im=impactoDe(j);
      const util=im.dif.map((d,x)=>d?`${ATRIBUTOS[x]} ${im.antes[x]} → ${im.desp[x]}`:null).filter(Boolean);
      window.__ofrecido=j;
      s.innerHTML=`<div class="card premio" style="cursor:default;border-color:${seg.crack?'var(--ambar)':'var(--verde)'}">
        <b>${t3("¡Le pegaste! Salió ","Acertou! Saiu ","You hit it! It's ")}${lblRul(seg).toLowerCase()}</b>
        <div class="sub">${j.nom} · ${j.ed} ${T("anios")}</div>
        <div class="rt-grande">${j.rt}</div>
        <div class="efecto">${util.length?t3("Entra al once: ","Entra no time: ","Walks into the XI: ")+util.join(" · "):t3("Hoy iría al banco.","Hoje iria para o banco.","He'd start on the bench today.")}</div>
        <div class="acciones" style="margin-top:12px">
          <button class="btn" onclick="aceptarRuleta(true)">${T("loSumo")}</button>
          <button class="btn sec" onclick="aceptarRuleta(false)">${T("paso")}</button></div></div>`;
    } else if(seVa){
      S.plantel=S.plantel.filter(x=>x!==seVa); S.fijos=(S.fijos||[]).filter(x=>x!==seVa);
      S.presupuesto=clamp(S.presupuesto+cobro,0,120); cabecera();
      s.innerHTML=`<div class="card" style="cursor:default;border-color:var(--rojo)">
        <b style="color:#FF8A78">✖ ${t3("Casilla roja: se te va un jugador","Casa vermelha: sai um jogador","Red slot: a player leaves")}</b>
        <div class="sub">${seVa.nom} · ${tGrupo(seVa.g)} · ${t3("nivel","nível","level")} ${seVa.rt}</div>
        <div class="efecto">${t3(`Lo compra otro club. Entran ${cobro} de presupuesto: algo es algo.`,`Outro clube compra. Entram ${cobro} de orçamento.`,`Another club buys him. You get ${cobro} in budget.`)}</div>
        <div class="acciones"><button class="btn" onclick="siguienteDecision()">${T("seguir")}</button></div></div>`;
    } else {
      s.innerHTML=`<div class="card" style="cursor:default">
        <b>${t3("Salió ","Saiu ","It's ")}${lblRul(seg).toLowerCase()}</b>
        <div class="sub">${t3("No apostaste ahí: esta vez no viene nadie.","Você não apostou aí: desta vez não vem ninguém.","You didn't bet on it: nobody comes this time.")}</div>
        <div class="acciones"><button class="btn" onclick="siguienteDecision()">${T("seguir")}</button></div></div>`;
    }
  }, reduce?60:4300);
}
function aceptarRuleta(si){
  if(si&&window.__ofrecido){ S.plantel.push(window.__ofrecido); }
  else if(!si){ S.presupuesto=clamp(S.presupuesto+5,0,120); }
  window.__ofrecido=null;
  siguienteDecision();
}


/* ---------- decisiones ---------- */
// filtra opciones que no tienen sentido en el contexto actual
const NO_JUVENIL=[/mayores de 30/i,/veterano/i,/vend[eé]s/i,/lo vend/i,/sueldo/i,/salarial/i,
  /pr[eé]stamo/i,/representante/i,/comisi[oó]n/i,/patrocinador/i,/mercado/i,/transferenc/i,/fich[aá]s/i];
const NO_SELECCION=[/mercado/i,/vend[eé]s/i,/fich[aá]s/i,/presupuesto de fichajes/i,/cantera/i,/descenso/i];
function opcionesValidas(d){
  let ops=d[2];
  if(S.division<3&&!S.esSeleccion) ops=ops.filter(o=>!NO_JUVENIL.some(rx=>rx.test(o[0])));
  if(S.esSeleccion) ops=ops.filter(o=>!NO_SELECCION.some(rx=>rx.test(o[0])));
  return ops.length>=2?ops:d[2];
}
function situacionAplica(d){
  if(S.esSeleccion&&(d[0]==="Mercado"||d[0]==="Directiva")) return false;
  if(S.division<3&&d[0]==="Mercado") return false;
  return true;
}
// marca de qué pool salió cada situación, para saber qué traducción usar
function marcar(d,fuente){
  const idx = fuente==="pool" ? POOL.indexOf(d)
            : fuente==="form" ? POOL_FORMATIVAS.indexOf(d)
            : POOL_REPUTACION.findIndex(x=>x.d===d);
  const copia=d.slice(); copia.__fuente=fuente; copia.__idx=idx;
  return copia;
}
// devuelve la situación en el idioma activo
function enIdioma(d){
  if(!d) return d;
  if(d.__yaTraducida||IDIOMA==="es"||d.__idx===undefined||d.__idx<0) return d;
  return D(d, d.__fuente, d.__idx);
}
function siguienteDecision(){
  // saltear situaciones que no aplican al contexto
  while(S.decIdx<S.decs.length&&!situacionAplica(S.decs[S.decIdx])){
    const rep2=S.pool.findIndex(x=>situacionAplica(x));
    if(rep2>=0) S.decs[S.decIdx]=S.pool.splice(rep2,1)[0]; else break;
  }
  if(S.decIdx>=S.decs.length){ irPlanteo(); return; }
  const d=S.decs[S.decIdx];
  const ops=opcionesValidas(d);
  S.opsActuales=ops;
  $("#s-decision").innerHTML=`
    <h2 class="disp">Decisión ${S.decIdx+1} de ${S.decs.length}</h2>
    <div class="ficha-sit"><div class="cat">${d[0]}</div><p>${d[1]}</p></div>
    ${ops.map((o,i)=>`<button class="card" onclick="tomar(${i})"><b style="font-size:17px">${o[0]}</b></button>`).join("")}`;
  ir("decision");
}
function tomar(i){
  const d=enIdioma(S.decs[S.decIdx]), o=d[2][i];
  let [txt,res,dir,hin,ves]=o;
  // el perfil del DT cambia lo que cuesta cada cosa
  const sesgo=SESGO_PERFIL[S.arq.id];
  const aj=sesgo?sesgo.ajustar(d,o):{};
  if(aj.res!==undefined) res=aj.res;
  if(aj.dir!==undefined) dir=aj.dir;
  if(aj.hin!==undefined) hin=aj.hin;
  if(aj.ves!==undefined) ves=aj.ves;

  S.vars.res=clamp(S.vars.res+res*3.2,0,100);
  S.vars.dir=clamp(S.vars.dir+dir*3.2,0,100);
  S.vars.hin=clamp(S.vars.hin+hin*3.2,0,100);
  S.vars.ves=clamp(S.vars.ves+ves*3.2,0,100);
  S.tomadas.push({res,dir,hin,ves});

  // reputacion: el juego recuerda como venis dirigiendo
  S.rep=S.rep||{ofensivo:0,conservador:0,plantel:0,directiva:0,prensa:0,resultado:0};
  if(d[0]==="Táctica"){
    if(/tres puntas|presionar|atacando|delantero más|alto desde el minuto|debutar/i.test(txt)) S.rep.ofensivo++;
    if(/cinco|bloque bajo|cerrás|contra|repleg|largo directo/i.test(txt)) S.rep.conservador++;
  }
  if(d[0]==="Prensa") S.rep.prensa += (hin>0||dir<0)?1:0;
  if(ves>0) S.rep.plantel++;
  if(dir>0) S.rep.directiva++;
  if(res>0) S.rep.resultado++;
  const antes=S.etiqueta;
  S.etiqueta=etiquetaDe(S.rep);

  if(d[0]==="Táctica"&&res){
    const f=S.formacion||S.sistemaPref, once=armarOnce(S.plantel,f,S.fijos||[]);
    once.slice(0,6).forEach(x=>{x.jug.rt=clamp(x.jug.rt+(res>0?1:-1),20,94);});
  }
  const nuevaEtiqueta = S.etiqueta && (!antes || antes.id!==S.etiqueta.id);
  $("#s-decision").innerHTML=`
    <h2 class="disp">${T("decision",S.decIdx+1,S.decs.length)}</h2>
    <div class="ficha-sit"><div class="cat">${d[0]}</div><p>${d[1]}</p></div>
    <div class="card sel" style="cursor:default"><b style="font-size:17px">${txt}</b>
      <div class="sub">${o[5]}</div></div>
    ${aj.nota?`<p class="mini" style="color:var(--ambar)">${aj.nota}</p>`:""}
    <div class="deltas">
      <span class="d ${cd(res)}">Resultados ${sg(Math.round(res))}</span>
      <span class="d ${cd(dir)}">Directiva ${sg(Math.round(dir))}</span>
      <span class="d ${cd(hin)}">Hinchada ${sg(Math.round(hin))}</span>
      <span class="d ${cd(ves)}">Vestuario ${sg(Math.round(ves))}</span></div>
    ${nuevaEtiqueta?`<div class="etiqueta-nueva">
      <b>Te empiezan a llamar ${tEtiq(S.etiqueta,"n")}</b>
      <div>${tEtiq(S.etiqueta,"desc")}</div></div>`:""}
    <div class="acciones"><button class="btn" onclick="S.decIdx++;siguienteDecision()">${T("seguir")}</button></div>`;
  cabecera();
}
/* ==========================================================
   TU PLAN PARA LA TEMPORADA
   Paso 0: sistema y modelo (con encaje y automatismos a la vista)
   Pasos 1-3: los tres momentos del partido contra tu rival clásico
   ========================================================== */
function irPlanteo(){
  armarTemporada();
  const TT=S.temp;
  const rivales=TT.equipos.filter(e=>!e.yo).concat(TT.copa?TT.copa.equipos.filter(e=>!e.yo):[]);
  const fuerzaDe=e=>e.attrs.reduce((a,b)=>a+b,0);
  S.rivalPlan=TT.equipos.find(e=>e.clasico)||rivales.slice().sort((a,b)=>fuerzaDe(b)-fuerzaDe(a))[0];
  S.compe=TT.ligaNombre||TT.copa.nombre;
  tmp={f:S.formacion||S.sistemaPref,e:S.estilo||S.estiloPref,paso:0,plan:{},res:{},op:null};
  S.momentosOk=0;
  pintarPlan(); ir("planteo");
}
function yoParaPlan(){
  const once=onceTemporada(S.plantel,tmp.f,S.fijos);
  return {f:tmp.f,e:tmp.e,attrs:atributosDe(once),once};
}
function autoSiJuego(f,e){ return (S.autoPar===f+"|"+e)?(S.auto||0):Math.round((S.auto||0)*0.3); }
function resumenLiga(){
  const TT=S.temp, eqs=TT.equipos.filter(e=>!e.yo);
  const c={}; eqs.forEach(e=>c[e.e]=(c[e.e]||0)+1);
  return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([e,n])=>`<span class="chip-est">${n} · ${tEstilo(e)}</span>`).join("");
}
function pintarPlan(){
  const rv=S.rivalPlan, TT=S.temp;
  if(tmp.paso===0){
    const fit=FIT[tmp.e][tmp.f], au=autoSiJuego(tmp.f,tmp.e), cambia=S.autoPar!==tmp.f+"|"+tmp.e;
    $("#s-planteo").innerHTML=`
      <h2 class="disp">${t3("Tu plan para la temporada","Seu plano para a temporada","Your plan for the season")}</h2>
      ${tablero()}
      <div class="compes">
        ${TT.ligaNombre?`<div class="compe">${trofeo(S.esSeleccion?"sel":"liga",26)}<div><b>${TT.ligaNombre}</b>
          <span>${TT.equipos.length} ${t3("equipos","times","teams")} · ${TT.nFechas} ${t3("fechas","rodadas","rounds")}${TT.ac?` · ${TT.ac.a} + ${TT.ac.c}`:""}</span></div></div>`:""}
        ${TT.copa?`<div class="compe">${trofeo(TT.copa.tipo==="conti"?"conti":TT.copa.tipo==="sel"?"sel":"copa",26)}<div><b>${TT.copa.nombre}</b>
          <span>${TT.copa.equipos.length} ${t3("equipos, eliminación directa","times, mata-mata","teams, knockout")}</span></div></div>`:""}
      </div>
      ${TT.equipos.length?`<p class="mini" style="margin:6px 0 2px">${t3("Cómo juegan tus rivales:","Como jogam seus rivais:","How your opponents play:")}</p><div class="chips-est">${resumenLiga()}</div>`:""}
      <div class="lbl-sel">${t3("Sistema","Sistema","System")}</div>
      <div class="pills">${FORMACIONES.map(x=>`<button class="pill ${x===tmp.f?'on':''}" onclick="tmp.f='${x}';tmp.res={};tmp.plan={};S.momentosOk=0;pintarPlan()">${x}${x===S.sistemaPref?' ★':''}</button>`).join("")}</div>
      <div class="lbl-sel">${t3("Modelo","Modelo","Model")}</div>
      <div class="pills">${ESTILOS.map(x=>`<button class="pill ${x===tmp.e?'on':''}" onclick="tmp.e='${x}';tmp.res={};tmp.plan={};S.momentosOk=0;pintarPlan()">${tEstilo(x)}${x===S.estiloPref?' ★':''}</button>`).join("")}</div>
      <div class="plan-info">
        <div class="encaje"><div class="lbl-sel" style="margin:0">${t3("Encaje","Encaixe","Fit")}</div>${pipsFit(fit)}<p>${porqueFit(tmp.e,tmp.f)}</p></div>
        <div class="encaje"><div class="lbl-sel" style="margin:0">${t3("Automatismos","Automatismos","Automatisms")}</div>
          <div class="auto-bar"><i style="width:${au}%"></i></div>
          <p>${cambia&&S.auto?t3(`Si cambiás la idea, tu equipo baja de ${S.auto} a ${au}: lo que aprendió no sirve igual.`,`Se mudar a ideia, seu time cai de ${S.auto} para ${au}.`,`Change the idea and your team drops from ${S.auto} to ${au}.`)
            :t3(`${au} de 100. Cada temporada con esta misma idea, suben.`,`${au} de 100. Cada temporada com a mesma ideia, sobem.`,`${au} out of 100. Every season with the same idea, it grows.`)}</p></div>
      </div>
      ${barras(yoParaPlan().attrs)}
      <div class="rival-card">${escudo(rv.club,40)}<div><div class="mini">${S.rivalPlan.clasico?t3("Tu clásico","Seu clássico","Your derby"):t3("El rival más fuerte","O rival mais forte","The strongest rival")}</div>
        <b>${rv.club.n}</b><div class="mini">${rv.f} · ${tEstilo(rv.e)}</div></div></div>
      <p class="mini">${t3("Ahora vas a congelar tres momentos de un partido contra ellos. Lo que decidas es tu plan para toda la temporada.",
        "Agora você vai congelar três momentos de um jogo contra eles. O que decidir é seu plano para a temporada toda.",
        "Now you'll freeze three moments of a match against them. What you decide is your plan for the whole season.")}</p>
      <div class="acciones"><button class="btn" onclick="tmp.paso=1;tmp.op=null;pintarPlan()">${t3("Ver los momentos","Ver os momentos","See the moments")}</button></div>`;
    return;
  }
  if(tmp.paso>=1&&tmp.paso<=3){
    const F=FASES[tmp.paso-1], yo=yoParaPlan(), el={f:rv.f,e:rv.e,attrs:rv.attrs};
    const hecho=tmp.res[F.id];
    const op=tmp.op||(hecho&&hecho.op)||null;
    const opVer=op||F.ops[0].id;
    const au=autoSiJuego(tmp.f,tmp.e);
    const v=op?ventaja(F.id,op,yo,el,au):null;
    $("#s-planteo").innerHTML=`
      <div class="paso-mom">${[1,2,3].map(k=>`<span class="${k<tmp.paso?'ok':k===tmp.paso?'on':''}">${k}</span>`).join("")}</div>
      <h2 class="disp">${L(F.n)}</h2>
      <p class="mini">${L(F.ctx)} <b>${rv.club.n}</b> · ${rv.f} · ${tEstilo(rv.e)}</p>
      <div class="mom-grid">
        <div>${svgMomento(F.id,opVer,yo,el,yo.once,rv.once,fichaColores(S.club))}
          <div class="leyenda"><span><i class="pt pro" style="background:${fichaColores(S.club).fill}"></i>${S.club.n}</span>
            <span><i class="pt" style="background:#141C19;border:2px dashed #E6ECEF"></i>${rv.club.n}</span><span><i class="pt" style="background:rgba(224,169,59,.3);border:1px dashed #E0A93B;border-radius:2px"></i>${t3("zona clave","zona chave","key zone")}</span></div></div>
        <div>
          ${F.ops.map(o=>`<button class="card op ${op===o.id?'sel':''}" ${hecho?'disabled':''} onclick="elegirOpMom('${o.id}')">
            <b>${L(o.n)}</b><div class="sub">${L(o.d)}</div>
            ${op===o.id&&v?`<div class="conteo">${cuentaTxt(F.id,o.id,v)}</div>`:""}</button>`).join("")}
          ${hecho?`<div class="resultado-mom ${hecho.ok?'bien':'mal'}"><b>${hecho.ok?t3("Salió bien","Deu certo","It worked"):t3("Salió mal","Deu errado","It went wrong")}</b>
            <p>${porQue(F.id,hecho.op,hecho.v,rv.club.n)}</p></div>`:""}
          <div class="acciones">
            ${!hecho?`<button class="btn" ${op?'':'disabled'} onclick="confirmarMom()">${t3("Jugar la jugada","Jogar o lance","Play it out")}</button>`
              :`<button class="btn" onclick="tmp.paso++;tmp.op=null;pintarPlan()">${tmp.paso<3?t3("Siguiente momento","Próximo momento","Next moment"):t3("Ver mi plan","Ver meu plano","See my plan")}</button>`}
            <button class="btn sec" onclick="tmp.paso--;tmp.op=null;pintarPlan()">${T("volver")}</button></div>
        </div>
      </div>`;
    return;
  }
  // resumen del plan
  const yo=yoParaPlan(), au=autoSiJuego(tmp.f,tmp.e);
  const eqs=TT.equipos.filter(e=>!e.yo).concat(TT.copa?TT.copa.equipos.filter(e=>!e.yo):[]);
  $("#s-planteo").innerHTML=`
    <h2 class="disp">${t3("Tu plan","Seu plano","Your plan")}</h2>
    <p class="mini">${tmp.f} · ${tEstilo(tmp.e)} · ${t3("contra","contra","against")} ${rv.club.n}: ${S.momentosOk}/3 ${t3("momentos ganados","momentos vencidos","moments won")}</p>
    ${FASES.map(F=>{const r=tmp.res[F.id], o=F.ops.find(x=>x.id===r.op);
      return `<div class="plan-fila"><span class="pf-fase">${L(F.n)}</span><b>${L(o.n)}</b><span class="${r.ok?'ok':'mal'}">${r.ok?'✓':'✗'}</span></div>`;}).join("")}
    <p style="margin-top:12px">${t3("Este plan se juega toda la temporada. Contra algunos estilos va a funcionar y contra otros va a sufrir: al final vas a ver contra quién.",
      "Este plano vale para a temporada toda. Contra alguns estilos vai funcionar e contra outros vai sofrer: no fim você vai ver contra quem.",
      "This plan runs all season. It'll work against some styles and suffer against others: at the end you'll see which.")}</p>
    <div class="acciones">
      <button class="btn" onclick="empezarTemporada()">${T("jugarTemporada")}</button>
      <button class="btn sec" onclick="tmp.paso=0;tmp.res={};S.momentosOk=0;pintarPlan()">${t3("Rehacer el plan","Refazer o plano","Redo the plan")}</button></div>`;
}
function cuentaTxt(fase,op,v){
  if(fase==="salida"&&op==="largo") return `${v.mios} ${t3(v.mios>1?"puntas":"punta",v.mios>1?"atacantes":"atacante",v.mios>1?"strikers":"striker")} v ${v.suyos} ${t3("centrales","zagueiros","centre-backs")}`;
  if(fase==="salida") return `${v.mios} ${t3("para salir","para sair","building")} v ${v.suyos} ${t3("presionando","pressionando","pressing")}`;
  if(fase==="defensa"&&op==="presion") return `${v.mios} ${t3("presionan","pressionam","pressing")} v ${v.suyos} ${t3("que salen","que saem","building")}`;
  if(fase==="defensa"&&op==="medio") return `${v.mios} v ${v.suyos} ${t3("por dentro","por dentro","in midfield")}`;
  if(fase==="defensa") return `${v.mios} ${t3("atrás","atrás","at the back")} v ${v.suyos} ${t3("atacantes","atacantes","attackers")}`;
  if(op==="centros") return `${v.mios} ${t3("en el área","na área","in the box")} v ${v.suyos} ${t3("defensores","defensores","defenders")}`;
  if(op==="dentro") return `${v.mios} v ${v.suyos} ${t3("entre líneas","entre linhas","between the lines")}`;
  return `${v.mios} v ${v.suyos} ${t3("por las bandas","pelas pontas","on the flanks")}`;
}
function elegirOpMom(op){
  const F=FASES[tmp.paso-1];
  if(tmp.res[F.id]) return;
  tmp.op=op;
  moverFormaMia(F.id,op,tmp.f);
  // se actualizan las tarjetas sin redibujar la cancha (para que se vea el movimiento)
  setTimeout(()=>{ if(tmp.op===op) pintarPlanSinCancha(); },740);
}
function pintarPlanSinCancha(){
  const svg=document.getElementById("pizMomento");
  if(!svg){ pintarPlan(); return; }
  const guard=svg.outerHTML; pintarPlan();
  const nuevo=document.getElementById("pizMomento"); if(nuevo) nuevo.outerHTML=guard;
}
function confirmarMom(){
  const F=FASES[tmp.paso-1], rv=S.rivalPlan, op=tmp.op;
  if(!op||tmp.res[F.id]) return;
  const yo=yoParaPlan(), v=ventaja(F.id,op,yo,{f:rv.f,e:rv.e,attrs:rv.attrs},autoSiJuego(tmp.f,tmp.e));
  const dado=S.rng(); // siempre se consume una tirada: el duelo no se desincroniza
  const ok=v.adv>0.15?true:v.adv<-0.15?false:dado<0.5+v.adv;
  tmp.res[F.id]={op,v,ok}; tmp.plan[F.id]=op;
  if(ok) S.momentosOk++;
  document.querySelectorAll("#s-planteo .card.op").forEach(b=>b.disabled=true);
  animarPelota(F.id,op,tmp.f,()=>pintarPlanSinCancha());
}

/* ==========================================================
   EL AZAR DISFRAZADO DE GENIALIDAD
   Cuando el resultado le gana a la lógica, la prensa igual te da
   (o te saca) el mérito. El juego te cuenta lo que la prensa no ve.
   ========================================================== */
const TITULARES_SUERTE={
 bien:[
  {t:{es:"Qué cambio del entrenador: la vio antes que nadie",pt:"Que mudança do treinador: viu antes de todo mundo",en:"What a substitution: the coach saw it before anyone"},
   v:{es:"Entró a los 84 y a los 87 la empujó en un córner. Lo pusiste porque no te quedaba otro delantero en el banco.",pt:"Entrou aos 84 e aos 87 empurrou num escanteio. Você o colocou porque não havia outro atacante no banco.",en:"He came on at 84 and scored from a corner at 87. You only picked him because there was no other striker on the bench."}},
  {t:{es:"Le ganó el partido desde la raya",pt:"Ganhou o jogo da beira do campo",en:"He won it from the touchline"},
   v:{es:"El gol salió de un rebote en un tobillo rival. La instrucción que habías gritado era otra.",pt:"O gol saiu de um desvio no tornozelo de um rival. A instrução que você gritou era outra.",en:"The goal came off an opponent's ankle. You'd been shouting a different instruction."}},
  {t:{es:"Otra vez el sello del DT en el segundo tiempo",pt:"De novo a marca do técnico no segundo tempo",en:"The coach's touch again in the second half"},
   v:{es:"El equipo jugó igual que siempre. Lo que cambió fue que esta vez entraron los tiros que venían errando.",pt:"O time jogou como sempre. A diferença é que desta vez os chutes entraram.",en:"The team played as always. This time the shots they'd been missing went in."}}],
 mal:[
  {t:{es:"El planteo del entrenador no funcionó",pt:"O plano do treinador não funcionou",en:"The coach's plan didn't work"},
   v:{es:"Generaron once situaciones y no entró ninguna. En el pizarrón habías ganado el partido.",pt:"Criaram onze chances e nenhuma entrou. Na prancheta você tinha ganho.",en:"Eleven chances, none went in. On the whiteboard you'd won."}},
  {t:{es:"Otra vez sin ideas en el segundo tiempo",pt:"De novo sem ideias no segundo tempo",en:"Out of ideas again in the second half"},
   v:{es:"Tres palos y un gol anulado. El plan estaba bien: la pelota no quiso entrar.",pt:"Três bolas na trave e um gol anulado. O plano estava certo: a bola não quis entrar.",en:"Three woodwork hits and a disallowed goal. The plan was right: the ball wouldn't go in."}},
  {t:{es:"Le faltó carácter al equipo en el momento clave",pt:"Faltou caráter ao time no momento decisivo",en:"The team lacked character when it mattered"},
   v:{es:"Se lesionaron dos en veinte minutos y jugaste el final con un pibe de la reserva.",pt:"Dois se machucaram em vinte minutos e você terminou com um garoto da base.",en:"Two got injured in twenty minutes and you finished with a reserve kid."}}]
};
function moralejaTxt(o){ return {t:L(o.t),v:L(o.v)}; }


/* ==========================================================
   LA TEMPORADA MINUTO A MINUTO (estilo Brasfoot)
   Se ven todos los partidos de la fecha a la vez, el reloj avanza
   y los goles caen. La tabla se reacomoda después de cada fecha.
   ========================================================== */
const MS_MIN={1:42,3:14,10:4};
function empezarTemporada(){
  S.formacion=tmp.f; S.estilo=tmp.e; S.usadas.push(tmp.f); S.plan=Object.assign({},tmp.plan);
  const par=S.formacion+"|"+S.estilo;
  if(S.autoPar!==par){ S.auto=Math.round((S.auto||0)*0.3); S.autoPar=par; }
  S.autoAntes=S.auto;
  tmp={vel:(window.__vel||1),pausa:false,saltar:false,posPrev:{},feed:[],tabla:S.temp.ac?"tabA":"tab"};
  pintarTicker(); ir("temporada");
  setTimeout(tickerSiguiente,400);
}
function pintarTicker(){
  const TT=S.temp;
  $("#s-temporada").innerHTML=`
    <div class="tk-cab">
      <div><div class="tk-comp" id="tkComp">${S.compe}</div><div class="tk-fecha" id="tkFecha"></div></div>
      <div class="tk-ctrl">
        ${[1,3,10].map(v=>`<button class="tkv ${tmp.vel===v?'on':''}" onclick="velTk(${v})">×${v}</button>`).join("")}
        <button class="tkv" id="tkPausa" onclick="pausaTk()">❚❚</button>
        <button class="tkv" onclick="saltarTk()">${S.temp.j<S.temp.mitad?t3("Ir a la parada","Ir à parada","Skip to break"):t3("Ir al final","Ir ao final","Skip to end")} ⏭</button>
      </div>
    </div>
    <div class="tk-reloj"><span id="tkMin">0'</span><div class="tk-barra"><i id="tkBar"></i></div></div>
    <div class="tk-grid">
      <div id="tkPartidos" class="tk-partidos"></div>
      <div>${TT.equipos.length?`<div id="tkTablaSel" class="tk-tabsel"></div><div id="tkTabla"></div>`:""}
        ${TT.copa?`<div id="tkCopa" class="tk-copa"></div>`:""}</div>
    </div>
    <div id="tkFeed" class="tk-feed"></div>`;
  pintarTablaTk(); pintarCopaTk(); pintarFeedTk();
}
function velTk(v){ tmp.vel=v; window.__vel=v; document.querySelectorAll(".tkv").forEach(b=>{ if(/^×/.test(b.textContent)) b.classList.toggle("on",b.textContent==="×"+v); }); }
function pausaTk(){ tmp.pausa=!tmp.pausa; const b=$("#tkPausa"); if(b) b.textContent=tmp.pausa?"▶":"❚❚"; if(!tmp.pausa&&tmp.reanudar){ const f=tmp.reanudar; tmp.reanudar=null; f(); } }
function saltarTk(){ tmp.saltar=true; if(tmp.pausa){ tmp.pausa=false; if(tmp.reanudar){const f=tmp.reanudar;tmp.reanudar=null;f();} } }

function tickerSiguiente(){
  const TT=S.temp;
  if(S.pant!=="temporada") return;
  if(TT.j>=TT.jornadas.length){ tmp.saltar=false; finTemporada(); return; }
  if(TT.j===TT.mitad&&!TT.paro&&TT.j>0){ TT.paro=true; tmp.saltar=false; paradaMitad(); return; }
  const jor=TT.jornadas[TT.j];
  jugarJornada(jor);
  animarJornada(jor,()=>{
    TT.j++;
    registrarFeed(jor);
    pintarTablaTk(); pintarCopaTk(); pintarFeedTk();
    if(tmp.saltar) tickerSiguiente(); else setTimeout(tickerSiguiente,Math.max(150,900/tmp.vel));
  });
}
function tituloJornada(jor){
  const TT=S.temp;
  if(jor.t==="copa") return `${trofeo(TT.copa.tipo==="conti"?"conti":TT.copa.tipo==="sel"?"sel":"copa",18)} ${TT.copa.nombre} · ${jor.ronda}`;
  const seg=TT.ac?(jor.k<TT.nFechas/2?TT.ac.a:TT.ac.c):TT.ligaNombre;
  return `${seg} · ${t3("Fecha","Rodada","Round")} ${jor.k+1} ${t3("de","de","of")} ${TT.nFechas}`;
}
function animarJornada(jor,fin){
  const f=$("#tkFecha"); if(f) f.innerHTML=tituloJornada(jor);
  const cont=$("#tkPartidos");
  if(!cont){ fin(); return; }
  cont.innerHTML=jor.res.map((p,i)=>`
    <div class="tk-p ${p.yo?'yo':''}" id="tkp-${i}">
      <div class="tk-lin">
        <span class="tk-eq">${escudo(p.A.club,18)}<span>${p.A.club.n}</span></span>
        <span class="tk-mar" id="tkm-${i}">0 - 0</span>
        <span class="tk-eq der"><span>${p.B.club.n}</span>${escudo(p.B.club,18)}</span>
      </div>
      <div class="tk-ev" id="tke-${i}"></div>
    </div>`).join("");
  const marc=jor.res.map(()=>[0,0]);
  let m=0;
  const mostrar=(p,i,e)=>{
    const ev=$("#tke-"+i), mk=$("#tkm-"+i);
    if(e.t==="gol"){
      marc[i][e.l==="a"?0:1]++;
      if(mk) mk.textContent=`${marc[i][0]} - ${marc[i][1]}`;
      const box=$("#tkp-"+i); if(box&&!tmp.saltar){ box.classList.remove("gol"); void box.offsetWidth; box.classList.add("gol"); }
      if(ev) ev.innerHTML+=`<span class="${e.l}">⚽ ${e.m}' ${e.nom}</span>`;
    } else if(e.t==="roja"&&ev) ev.innerHTML+=`<span class="${e.l} roja">▮ ${e.m}' ${e.nom}</span>`;
  };
  const cerrar=()=>{
    jor.res.forEach((p,i)=>{
      const mk=$("#tkm-"+i), box=$("#tkp-"+i);
      if(mk) mk.textContent=`${p.ga} - ${p.gb}${p.pen?` (${p.pen[0]}-${p.pen[1]} ${t3("pen","pên","pens")})`:""}`;
      if(p.yo&&box){ const soyA=p.A.yo, gf=soyA?p.ga:p.gb, gc=soyA?p.gb:p.ga;
        const gano=p.pen?(p.gana==="a")===soyA:gf>gc, emp=!p.pen&&gf===gc;
        box.classList.add(gano?"gano":emp?"empato":"perdio"); }
      if(p.les&&p.les.length){ const ev=$("#tke-"+i); if(ev) ev.innerHTML+=p.les.map(j=>`<span class="les">✚ ${apellido(j.nom)} ${t3("se lesionó","se lesionou","injured")}</span>`).join(""); }
    });
    const mn=$("#tkMin"), b=$("#tkBar"); if(mn) mn.textContent=t3("Final","Fim","FT"); if(b) b.style.width="100%";
    fin();
  };
  if(tmp.saltar){ jor.res.forEach((p,i)=>p.ev.forEach(e=>mostrar(p,i,e))); cerrar(); return; }
  const paso=()=>{
    if(tmp.saltar){ jor.res.forEach((p,i)=>p.ev.filter(e=>e.m>m).forEach(e=>mostrar(p,i,e))); cerrar(); return; }
    if(tmp.pausa){ tmp.reanudar=paso; return; }
    m++;
    const mn=$("#tkMin"), b=$("#tkBar");
    if(mn) mn.textContent=m+"'"; if(b) b.style.width=(m/90*100)+"%";
    jor.res.forEach((p,i)=>p.ev.filter(e=>e.m===m).forEach(e=>mostrar(p,i,e)));
    if(m>=90){ cerrar(); return; }
    setTimeout(paso,MS_MIN[tmp.vel]*(m===45?12:1));
  };
  paso();
}
function registrarFeed(jor){
  const p=jor.res.find(x=>x.yo); if(!p) return;
  const soyA=p.A.yo, gf=soyA?p.ga:p.gb, gc=soyA?p.gb:p.ga, riv=soyA?p.B.club:p.A.club;
  const gano=p.pen?(p.gana==="a")===soyA:gf>gc, emp=!p.pen&&gf===gc;
  tmp.feed.unshift({txt:`${jor.t==="copa"?jor.ronda:t3("F","R","R")+(jor.k+1)} · ${gano?t3("Ganaste","Venceu","Won"):emp?t3("Empataste","Empatou","Drew"):t3("Perdiste","Perdeu","Lost")} ${gf}-${gc}${p.pen?` (${soyA?p.pen[0]:p.pen[1]}-${soyA?p.pen[1]:p.pen[0]} pen)`:""} ${t3("vs","vs","vs")} ${riv.n}`,
    c:gano?"g":emp?"e":"p", les:(p.les||[]).map(j=>apellido(j.nom))});
}
function pintarFeedTk(){
  const c=$("#tkFeed"); if(!c) return;
  c.innerHTML=tmp.feed.slice(0,8).map(f=>`<div class="fd ${f.c}">${f.txt}${f.les.length?` <span class="les">✚ ${f.les.join(", ")}</span>`:""}</div>`).join("");
}
function tablaHTML(campo,conFlechas,compacta){
  const TT=S.temp, tab=ordenTabla(TT.equipos,campo);
  return `<table class="tabla-pos tk-tabla"><tr><th>#</th><th></th><th>${t3("Club","Clube","Club")}</th>${compacta?"":`<th>${t3("PJ","J","P")}</th><th>${t3("DG","SG","GD")}</th>`}<th style="text-align:right">Pts</th></tr>
    ${tab.map((x,i)=>{ const e=x.e, t=e[campo], prev=conFlechas&&tmp.posPrev[campo+e.club.n];
      const fl=prev&&prev!==i+1?(prev>i+1?`<span class="sube">▲</span>`:`<span class="baja">▼</span>`):"";
      return `<tr class="${e.yo?'yo':''} ${e.clasico?'clasico':''}"><td>${i+1}</td><td class="fl">${fl}</td>
        <td>${escudo(e.club,16)} ${e.club.n}</td>${compacta?"":`<td>${t.pj}</td><td>${sg(t.gf-t.gc)}</td>`}<td style="text-align:right"><b>${t.pts}</b></td></tr>`;}).join("")}</table>`;
}
function pintarTablaTk(){
  const TT=S.temp, c=$("#tkTabla"); if(!c||!TT.equipos.length) return;
  const sel=$("#tkTablaSel");
  if(sel&&TT.ac) sel.innerHTML=[["tabA",TT.ac.a],["tabC",TT.ac.c],["tab",TT.ac.anual||t3("Anual","Anual","Annual")]]
    .map(([k,n])=>`<button class="${tmp.tabla===k?'on':''}" onclick="tmp.tabla='${k}';pintarTablaTk()">${n}</button>`).join("");
  c.innerHTML=tablaHTML(tmp.tabla,true);
  ["tab","tabA","tabC"].forEach(campo=>ordenTabla(TT.equipos,campo).forEach((x,i)=>tmp.posPrev[campo+x.e.club.n]=i+1));
}
function pintarCopaTk(){
  const TT=S.temp, c=$("#tkCopa"); if(!c||!TT.copa) return;
  const C=TT.copa;
  c.innerHTML=`<div class="lbl-sel">${trofeo(C.tipo==="conti"?"conti":C.tipo==="sel"?"sel":"copa",16)} ${C.nombre}</div>
    ${C.rondas.length?C.rondas.map(r=>`<div class="cr ${r.gano?'ok':'mal'}">${r.ronda}: ${r.gf}-${r.gc}${r.pen?` (${r.pen[0]}-${r.pen[1]})`:""} ${r.rival.n} ${r.gano?'✓':'✗'}</div>`).join("")
      :`<div class="mini">${t3("Todavía no jugaste","Ainda não jogou","Not played yet")}</div>`}
    ${C.campeon?`<div class="cr campeon">${trofeo("copa",14)} ${C.campeon.club.n}</div>`:""}`;
}

/* ---------- parada de mitad de temporada ---------- */
function paradaMitad(){
  S.plantel.forEach(j=>{ prepJug(j); j.fat=Math.max(0,j.fat-25); }); // el parate recupera algo
  const TT=S.temp;
  const pos=TT.equipos.length?ordenTabla(TT.equipos,"tab").findIndex(x=>x.e.yo)+1:null;
  const mio=TT.equipos.length?TT.equipos[0].tab:null;
  let ap="";
  if(TT.ac){
    const c=ordenTabla(TT.equipos,"tabA")[0].e;
    ap=`<div class="resultado ${c.yo?'bien':''}" style="padding:14px">${trofeo("media",c.yo?34:22)}
      <b style="font-size:26px">${c.yo?t3("¡Campeón del ","Campeão do ","Champions of the ")+TT.ac.a+"!":TT.ac.a+": "+c.club.n}</b>
      <span>${c.yo?t3("Primer título de la temporada.","Primeiro título da temporada.","First title of the season."):t3("Queda el Clausura para dar vuelta la historia.","Resta o Clausura para virar a história.","The Clausura is still there to turn it around.")}</span></div>`;
  }
  const les=S.plantel.filter(j=>j.les>0), cans=S.plantel.filter(j=>j.fat>=55&&!j.les), fuego=S.plantel.filter(j=>j.forma>=3&&!j.les);
  tmp.selBanco=null;
  window.__paradaTop=`
    <h2 class="disp">${TT.ac?t3("Terminó el Apertura","Terminou o Apertura","The Apertura is over"):t3("Mitad de temporada","Metade da temporada","Mid-season break")}</h2>
    ${ap}
    ${mio?`<p>${t3("Vas","Você está","You're")} <b>${pos}º</b> ${t3("en la tabla","na tabela","in the table")} · ${mio.g}G ${mio.e}E ${mio.p}P · ${mio.gf}-${mio.gc}</p>`:""}
    <div class="parada-est">
      <div><b>${t3("Lesionados","Lesionados","Injured")}</b>${les.length?les.map(j=>`<div>✚ ${j.nom} · ${j.les} ${t3("fechas","rodadas","games")}</div>`).join(""):`<div class="mini">—</div>`}</div>
      <div><b>${t3("Cansados","Cansados","Tired")}</b>${cans.length?cans.map(j=>`<div>${j.nom} · ${Math.round(j.fat)}%</div>`).join(""):`<div class="mini">—</div>`}</div>
      <div><b>${t3("Encendidos","Voando","On fire")}</b>${fuego.length?fuego.map(j=>`<div>▲ ${j.nom}</div>`).join(""):`<div class="mini">—</div>`}</div>
    </div>
    <p class="mini">${t3("Es el momento de rotar: el cansado rinde menos y se lesiona más.","É hora de rodar: o cansado rende menos e se machuca mais.","Time to rotate: tired players perform worse and get injured more.")}</p>`;
  pintarParada(); ir("club");
}
function pintarParada(){
  $("#s-club").innerHTML=window.__paradaTop+vistaGestion(S.formacion,"pintarParada")+`
    <div class="acciones"><button class="btn" onclick="seguirSegunda()">${S.temp.ac?t3("Jugar el Clausura","Jogar o Clausura","Play the Clausura"):t3("Segunda rueda","Segundo turno","Second half")}</button></div>`;
}
function seguirSegunda(){
  if(S.temp.ac) tmp.tabla="tabC";
  tmp.saltar=false; tmp.pausa=false; tmp.selBanco=null;
  pintarTicker(); ir("temporada");
  setTimeout(tickerSiguiente,300);
}

/* ---------- fin de temporada: el reporte ---------- */
function finTemporada(){
  const res=cerrarCalculoTemporada();
  aplicarCierre(res);
  // premios: taquilla y presupuesto
  res.ingreso=10+Math.round(S.vars.res/6)+S.estadio*3+(S.division===3?8:0)+(res.titulos.length?6:0);
  if(!S.esSeleccion) S.presupuesto=clamp(S.presupuesto+res.ingreso,0,120);
  res.fig=figuras(); res.lect=lecturaPlan(); res.sorp=sorpresa();
  S.calc=res;
  pintarReporte(); ir("resolucion");
}
function barraCambio(n,a,d){
  const b=clamp(Math.round(a),0,100), c=clamp(Math.round(d),0,100);
  return `<div class="bc"><span>${n}</span><div class="bc-bar"><i class="antes" style="width:${Math.min(b,c)}%"></i>
    <i class="${c>=b?'sube':'baja'}" style="left:${Math.min(b,c)}%;width:${Math.abs(c-b)}%"></i></div><b class="${c>b?'p':c<b?'n':''}">${c}${c!==b?` (${sg(c-b)})`:""}</b></div>`;
}
function pintarReporte(){
  const c=S.calc, TT=S.temp, f=c.fig;
  const prom=j=>(j.st.nt/j.st.pj).toFixed(1);
  const titulo=c.titulos.length?c.titulos.map(t=>`<div class="tit-gan">${trofeo(t.tipo,40)}<span>${t.comp}</span></div>`).join(""):"";
  $("#s-resolucion").innerHTML=`
    <h2 class="disp">${t3("Temporada","Temporada","Season")} ${S.temporada} · ${S.club.n}</h2>
    <div class="resultado ${c.pts>=7?'bien':c.pts<=1?'mal':''}">
      ${c.pos?`<div class="pos-grande">${c.pos}º<small>${t3("de","de","of")} ${c.equipos}</small></div>
        <span>${TT.ligaNombre} · ${t3("esperaban que terminaras","esperavam que você terminasse","they expected you to finish")} ${c.exp}º</span>`
        :`<div class="pos-grande" style="font-size:40px">${c.copaGano?t3("Campeón","Campeão","Champions"):c.copa.eliminado||t3("Final","Final","Final")}</div><span>${c.copa.nombre}</span>`}
      ${titulo?`<div class="titulos-gan">${titulo}</div>`:""}
    </div>
    ${TT.equipos.length?`<details open><summary>${T("comoQuedoTabla")}</summary>
      ${TT.ac?`<p class="mini">${TT.ac.a}: <b>${c.apertura.club.n}</b> · ${TT.ac.c}: <b>${c.clausura.club.n}</b></p>`:""}
      ${tablaHTML("tab",false)}</details>`:""}
    ${c.copa?`<div class="copa-rec"><div class="lbl-sel">${trofeo(c.copa.tipo==="conti"?"conti":c.copa.tipo==="sel"?"sel":"copa",18)} ${c.copa.nombre}</div>
      ${c.copa.rondas.map(r=>`<div class="cr ${r.gano?'ok':'mal'}">${r.ronda}: ${escudo(r.rival,16)} ${r.rival.n} ${r.gf}-${r.gc}${r.pen?` (${r.pen[0]}-${r.pen[1]} pen)`:""} ${r.gano?'✓':'✗'}</div>`).join("")}
      ${c.copa.campeon&&!c.copa.campeon.yo?`<div class="mini">${t3("Campeón","Campeão","Winner")}: ${c.copa.campeon.club.n}</div>`:""}</div>`:""}

    <h3 class="disp">${t3("Tu plan, fase por fase","Seu plano, fase a fase","Your plan, phase by phase")}</h3>
    ${c.lect.map(l=>`<div class="lect">
      <div class="lect-cab"><span>${L(l.F.n)}</span><b>${L(l.op.n)}</b></div>
      ${l.bien.length?`<div class="ok">✓ ${t3("Funcionó contra","Funcionou contra","Worked against")} ${l.bien.map(x=>`<b>${tEstilo(x.e)}</b> (${x.x.rivales.slice(0,3).join(", ")})`).join(" · ")}</div>`:""}
      ${l.mal.length?`<div class="mal">✗ ${t3("Sufrió contra","Sofreu contra","Struggled against")} ${l.mal.map(x=>`<b>${tEstilo(x.e)}</b> (${x.x.rivales.slice(0,3).join(", ")})`).join(" · ")}</div>`:""}
      ${!l.bien.length&&!l.mal.length?`<div class="mini">${t3("Ni fu ni fa: no marcó diferencias.","Nem fede nem cheira: não fez diferença.","Neither here nor there.")}</div>`:""}
    </div>`).join("")}

    <h3 class="disp">${t3("Figuras","Destaques","Standouts")}</h3>
    <div class="figuras">
      ${f.gol?`<div class="fig"><span>${t3("Goleador","Artilheiro","Top scorer")}</span><b>${f.gol.nom}</b><em>${f.gol.st.g} ${t3("goles","gols","goals")}</em></div>`:""}
      ${f.mejor?`<div class="fig"><span>${t3("El mejor","O melhor","Best player")}</span><b>${f.mejor.nom}</b><em>${t3("nota","nota","rating")} ${prom(f.mejor)}</em></div>`:""}
      ${f.rev?`<div class="fig"><span>${t3("Revelación","Revelação","Breakthrough")}</span><b>${f.rev.nom}</b><em>${f.rev.ed} ${T("anios")} · ${prom(f.rev)}</em></div>`:""}
    </div>

    <h3 class="disp">${t3("Lo que te llevás","O que você leva","What you take home")}</h3>
    ${barraCambio(T("directiva"),c.antes.dir,S.vars.dir)}
    ${barraCambio(T("hinchada"),c.antes.hin,S.vars.hin)}
    ${barraCambio(t3("Automatismos","Automatismos","Automatisms"),S.autoAntes||0,S.auto)}
    ${!S.esSeleccion?`<p class="mini">${t3("Entran","Entram","In")} <b>${c.ingreso}</b> ${t3("de presupuesto (taquilla y premios).","de orçamento (bilheteria e prêmios).","budget (gate and prizes).")}</p>`:""}

    ${c.sorp?(()=>{const m=c.sorp.m, t=moralejaTxt(R_el_local(c.sorp.gane?TITULARES_SUERTE.bien:TITULARES_SUERTE.mal));
      return `<div class="moraleja"><div class="titular">“${t.t}”</div>
      <div class="verdad"><b>${c.sorp.gane?t3("Ganaste siendo menos:","Venceu sendo inferior:","You won as underdogs:"):t3("Perdiste siendo más:","Perdeu sendo superior:","You lost as favourites:")}</b> ${m.gf}-${m.gc} ${t3("vs","vs","vs")} ${m.rival.n}. ${t.v}</div>
      <div class="cierre">${t3("El resultado de una decisión no prueba que la decisión haya sido buena.","O resultado de uma decisão não prova que ela foi boa.","The outcome of a decision doesn't prove the decision was good.")}</div></div>`;})():""}
    <div class="acciones"><button class="btn" onclick="cerrarTemporada()">${T("cerrarTemporada")}</button></div>`;
}
// elegir un titular sin tocar el RNG del duelo
function R_el_local(a){ return a[(S.temporada*7+S.puntos)%a.length]; }

/* ---------- cierre de temporada, crecimiento del club ---------- */
function cerrarTemporada(){
  const umbral=S.arq.id==="ganador"?26:S.arq.id==="bombero"?12:18;
  const eventos=[];
  const c=S.calc;
  // juveniles del formador
  if(S.arq.id==="formador") S.plantel.filter(j=>j.ed<=23).forEach(j=>{j.rt=clamp(j.rt+4,28,94);});
  // los que jugaron bien crecen, los viejos bajan
  S.plantel.forEach(j=>{
    j.ed++; delete j.nuevo;
    if(j.ed>31) j.rt=clamp(j.rt-2,28,94);
    if(j.st&&j.st.pj>=4&&j.ed<=24&&j.st.nt/j.st.pj>=6.8) j.rt=clamp(j.rt+2,28,94);
  });
  // ascenso de categoría
  let ascendio=false;
  if(c.sube>0&&S.division<3&&!S.esSeleccion){
    const antes=S.division;
    S.division=Math.min(3,S.division+c.sube);
    ascendio=S.division>antes;
    if(ascendio){ S.ascensos=(S.ascensos||0)+1; eventos.push(t3(`Te suben a ${tDiv(DIVISIONES[S.division].n)} de ${S.club.n}.`,`Você sobe para ${tDiv(DIVISIONES[S.division].n)} do ${S.club.n}.`,`You're promoted to ${S.club.n} ${tDiv(DIVISIONES[S.division].n)}.`)); }
  }
  // crecimiento del club
  if(!S.esSeleccion&&S.vars.hin>70&&S.estadio<5&&c.pts>=7){S.estadio++;eventos.push(t3(`El club amplía el estadio (nivel ${S.estadio}).`,`O clube amplia o estádio (nível ${S.estadio}).`,`The club expands the stadium (level ${S.estadio}).`));}
  // despido
  let despedido=false;
  if(S.vars.dir<umbral&&S.temporada<tempTotal()){
    despedido=true; S.despidos++;
    S.exClub=S.esSeleccion?null:S.club;
    S.hist.push({t:S.temporada,club:S.club.n,div:"—",f:"",pos:t3("Te echaron","Demitido","Sacked"),pts:0});
    const chico=R.el(CLUBES.filter(x=>x.niv<=2));
    S.club=chico; S.division=3; S.estadio=1; S.idoloPreguntado=false; S.esSeleccion=false; S.fijos=[];
    S.plantel=generarPlantel(nivelBaseDe(chico.niv,3),3,null,chico.p);
    S.presupuesto=20; S.vars.dir=46; S.vars.hin=44;
    aplicarTema();
  }
  if(ascendio&&S.temporada<tempTotal()){ pantallaAscenso(); return; }
  // selección: hace falta una carrera de verdad, no dos buenos años
  if(!despedido&&!S.esSeleccion&&S.division===3&&S.temporada>=4&&S.temporada<tempTotal()
     &&S.titulos.filter(t=>t.tipo!=="media"&&t.div===3).length>=2&&S.puntos>=S.temporada*7&&S.club.niv>=4&&!S.ofertaSel){
    S.ofertaSel=true;
    const base=SELECCIONES.find(s=>s.n===S.club.p)||R.el(SELECCIONES);
    pantallaSeleccion(Object.assign({sel:true},base)); return;
  }
  // te vienen a buscar: si te fue mejor de lo esperado
  if(!despedido&&!S.esSeleccion&&S.division===3&&S.temporada<tempTotal()&&(c.pts>=7||c.titulos.length)&&S.vars.hin>45&&!S.ofertaHecha){
    const mejores=CLUBES.filter(x=>x.n!==S.club.n&&x.niv>=Math.min(5,S.club.niv+1));
    const sueño=S.clubHincha&&S.clubHincha.n!==S.club.n&&(S.titulos.length>=1||S.club.niv>=S.clubHincha.niv-1)?S.clubHincha:null;
    const cand=sueño&&S.rng()<0.5?sueño:(mejores.length?R.el(mejores):null);
    if(cand){ S.ofertaHecha=true; pantallaOferta(cand,cand===sueño); return; }
  }
  S.ofertaHecha=false;
  let favor=null;
  if(!despedido&&!S.esSeleccion&&S.exClub&&S.presupuesto>45&&S.temporada<tempTotal()) favor=S.exClub;
  $("#s-club").innerHTML=`
    <h2 class="disp">${despedido?t3("Te echaron","Você foi demitido","You've been sacked"):t3("Cierre de temporada","Fim de temporada","End of season")}</h2>
    ${despedido?`<p>${t3(`La directiva no te bancó más. Te agarra ${S.club.n}, en Primera, con menos plantel y menos plata. Seguís dirigiendo.`,
        `A diretoria não te segurou. O ${S.club.n} te contrata, na Primeira, com elenco e dinheiro menores.`,
        `The board ran out of patience. ${S.club.n} hire you, in the top flight, with a weaker squad and less money.`)}</p>
      ${bannerClub(S.club,{tam:48,badges:badgesClub(S.club,3)})}`
    :`<ul style="margin:12px 0 12px 18px">${eventos.map(e=>`<li style="margin-bottom:5px">${e}</li>`).join("")||`<li>${t3("Se viene otra temporada.","Vem aí outra temporada.","Another season awaits.")}</li>`}</ul>`}
    ${favor?`
      <h3 class="disp">${t3("Te llaman de ","Te ligam do ","A call from ")}${favor.n}</h3>
      <div class="ficha-sit"><div class="cat">${t3("Tu ex club","Seu ex-clube","Your former club")}</div>
      <p>${t3(`${favor.n} está corto de plata. Te ofrecen un jugador que en el mercado vale la mitad de lo que te piden. Comprarlo es ayudarlos.`,
        `O ${favor.n} está sem dinheiro. Te oferecem um jogador que vale metade do que pedem. Comprar é ajudar.`,
        `${favor.n} are short of money. They offer you a player worth half the asking price. Buying him is helping them.`)}</p></div>
      <button class="card" onclick="ayudarExClub(true)"><b style="font-size:17px">${t3("Se lo comprás igual","Compra mesmo assim","Buy him anyway")}</b>
        <div class="sub">${t3("Pagás 30 de más. Te lo van a recordar.","Paga 30 a mais. Vão lembrar.","You overpay by 30. They'll remember.")}</div></button>
      <button class="card" onclick="ayudarExClub(false)"><b style="font-size:17px">${t3("No es tu problema","Não é problema seu","Not your problem")}</b>
        <div class="sub">${t3("Cuidás el presupuesto de tu club actual.","Cuida do orçamento do clube atual.","You protect your current club's budget.")}</div></button>`
    :`<div class="acciones"><button class="btn" onclick="siguienteTemporada()">${T("seguir")}</button></div>`}`;
  ir("club");
}


/* subir juveniles al plantel superior */
function pantallaAscenso(){
  const cand=S.plantel.slice().sort((a,b)=>b.rt-a.rt).slice(0,6);
  tmp.suben=[];
  window.__cand=cand;
  pintarAscenso();
  ir("club");
}
function pintarAscenso(){
  const cand=window.__cand;
  $("#s-club").innerHTML=`
    <h2 class="disp">${t3("Subís de categoría","Você sobe de categoria","You're moving up")}</h2>
    <p>${t3(`Pasás a <b>${tDiv(DIVISIONES[S.division].n)}</b> de ${S.club.n}. El plantel de arriba es otro, pero podés llevarte hasta dos pibes tuyos. Los que suben ganan 3 de nivel.`,
      `Você passa para <b>${tDiv(DIVISIONES[S.division].n)}</b> do ${S.club.n}. O elenco de cima é outro, mas pode levar até dois garotos seus. Quem sobe ganha 3 de nível.`,
      `You move up to ${S.club.n} <b>${tDiv(DIVISIONES[S.division].n)}</b>. It's a new squad, but you can take up to two of your kids. They gain 3 levels.`)}</p>
    ${cand.map((j,i)=>`
      <button class="card ${tmp.suben.includes(i)?'sel':''}"
        ${tmp.suben.length>=2&&!tmp.suben.includes(i)?'disabled':''} onclick="marcarSube(${i})">
        <b style="font-size:17px">${j.nom}</b>
        <div class="sub">${tGrupo(j.g)} · ${j.ed} ${T("anios")} · ${t3("nivel","nível","level")} ${j.rt}${j.st&&j.st.pj?` · ${j.st.g} ${t3("goles","gols","goals")}`:""}</div>
      </button>`).join("")}
    <p class="mini">${tmp.suben.length} / 2</p>
    <div class="acciones"><button class="btn" onclick="confirmarAscenso()">${t3("Subir al plantel","Subir ao elenco","Promote them")}</button></div>`;
}
function marcarSube(i){
  const k=tmp.suben.indexOf(i);
  if(k>=0) tmp.suben.splice(k,1); else if(tmp.suben.length<2) tmp.suben.push(i);
  pintarAscenso();
}
function confirmarAscenso(){
  const suben=tmp.suben.map(i=>window.__cand[i]);
  S.plantel=generarPlantel(nivelBaseDe(S.club.niv,S.division),S.division,null,S.club.p);
  suben.forEach(j=>{ j.rt=clamp(j.rt+3,20,94); j.subido=true; S.plantel.push(j); });
  S.presupuesto=clamp(S.presupuesto+12,0,120);
  siguienteTemporada();
}

/* un club te viene a buscar */
function pantallaOferta(club,esSueño){
  window.__of=club;
  const info=CLUB_INFO[club.n];
  $("#s-club").innerHTML=`
    <h2 class="disp">${esSueño?t3("Te llama tu club","Seu clube te chama","Your club is calling"):t3("Te vienen a buscar","Vieram te buscar","They want you")}</h2>
    ${bannerClub(club,{badges:badgesClub(club,3)})}
    ${info?`<p class="mini" style="margin-top:8px">${L(info.glo)}</p>`:""}
    <p>${esSueño?t3("Es el club del que sos hincha. Te ofrecen el banco. No pasa muchas veces en la vida, y nadie te garantiza que vuelva a pasar.",
        "É o clube para o qual você torce. Oferecem o banco. Isso não acontece muitas vezes na vida.",
        "It's the club you support. They're offering you the job. It doesn't happen often in life, and it may never happen again.")
      :t3("Te fue bien y se dieron cuenta. Te ofrecen un plantel mejor, con la exigencia que eso implica.",
        "Foi bem e perceberam. Oferecem um elenco melhor, com a cobrança que isso implica.",
        "You did well and they noticed. They offer a better squad, with the pressure that comes with it.")}</p>
    <button class="card" onclick="aceptarOferta(true)"><b style="font-size:17px">${t3("Te vas a ","Você vai para o ","You go to ")}${club.n}</b>
      <div class="sub">${esSueño?t3("Cumplís el sueño.","Realiza o sonho.","You live the dream."):t3("Plantel nuevo, otra exigencia.","Elenco novo, outra cobrança.","New squad, new demands.")}</div></button>
    <button class="card" onclick="aceptarOferta(false)"><b style="font-size:17px">${t3("Te quedás en ","Fica no ","You stay at ")}${S.club.n}</b>
      <div class="sub">${t3("La directiva y el vestuario te lo agradecen. La oferta puede no volver.","A diretoria e o vestiário agradecem. A proposta pode não voltar.","The board and dressing room appreciate it. The offer may not come back.")}</div></button>`;
  ir("club");
}
function aceptarOferta(si){
  if(si){
    S.exClub=S.club; S.club=window.__of; S.division=3; S.esSeleccion=false;
    S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p); S.fijos=[];
    S.presupuesto=clamp(18+S.club.niv*8,10,100);
    S.vars.dir=52; S.vars.hin=S.clubHincha&&S.club.n===S.clubHincha.n?68:48; S.estadio=Math.max(1,S.club.niv-1);
    S.idoloPreguntado=false; S.clasifConti=false;
    S.hist.push({t:S.temporada,club:S.club.n,div:"Primera",comp:t3("Asumís el cargo","Assume o cargo","New job"),f:"",pos:t3("Nuevo club","Novo clube","New club"),pts:0});
    aplicarTema();
  } else {
    S.vars.dir=clamp(S.vars.dir+8,0,100);
    S.vars.hin=clamp(S.vars.hin+10,0,100);
    S.vars.ves=clamp(S.vars.ves+8,0,100);
  }
  siguienteTemporada();
}

/* oferta de seleccion nacional */
function pantallaSeleccion(sel){
  $("#s-club").innerHTML=`
    <h2 class="disp">${t3("Te llama una selección","Uma seleção te chama","A national team is calling")}</h2>
    ${bannerClub(sel,{badges:badgesClub(sel,3)})}
    <p>${t3(`En la selección no se ficha: se convoca. No hay mercado ni presupuesto, sólo los jugadores que tenés y cómo los parás. Si aceptás, dejás ${S.club.n}.`,
      `Na seleção não se contrata: se convoca. Sem mercado nem orçamento. Se aceitar, deixa o ${S.club.n}.`,
      `You don't sign players for a national team: you call them up. No market, no budget. Accept and you leave ${S.club.n}.`)}</p>
    <button class="card" onclick="tomarSeleccion(true)"><b style="font-size:17px">${t3("Aceptás el cargo","Aceita o cargo","Accept the job")}</b>
      <div class="sub">${t3("Eliminatorias, Copa América y Mundial. La vidriera más grande.","Eliminatórias, Copa América e Copa do Mundo.","Qualifiers, Copa América and the World Cup.")}</div></button>
    <button class="card" onclick="tomarSeleccion(false)"><b style="font-size:17px">${t3("Seguís en el club","Continua no clube","Stay at the club")}</b>
      <div class="sub">${t3("Terminás lo que empezaste.","Termina o que começou.","Finish what you started.")}</div></button>`;
  window.__sel=sel;
  ir("club");
}
function tomarSeleccion(si){
  if(si){
    const sel=window.__sel;
    S.exClub=S.club; S.club=sel; S.esSeleccion=true; S.division=3; S.selT=0; S.fijos=[];
    S.plantel=generarPlantel(nivelBaseDe(sel.niv,3)+8,3,null,sel.p);
    S.presupuesto=0; S.vars.dir=58; S.vars.hin=52;
    S.hist.push({t:S.temporada,club:t3("Selección de ","Seleção de ","")+sel.n,div:"Selección",f:"",pos:t3("Asumís","Assume","Takes over"),pts:0});
    aplicarTema();
  } else {
    S.vars.dir=clamp(S.vars.dir+8,0,100);
    S.vars.hin=clamp(S.vars.hin+10,0,100);
    S.vars.ves=clamp(S.vars.ves+6,0,100);
  }
  siguienteTemporada();
}

function ayudarExClub(si){
  if(si){
    S.presupuesto=clamp(S.presupuesto-30,0,120);
    const j=nuevoJugador(R.el(["DEF","MED","ATA"]),nivelBaseDe(S.exClub.niv,3),3,null,S.exClub.p);
    S.plantel.push(j);
    S.vars.hin=clamp(S.vars.hin+6,0,100);
    S.vars.ves=clamp(S.vars.ves+5,0,100);
  } else {
    S.vars.hin=clamp(S.vars.hin-2,0,100);
  }
  S.exClub=null;
  siguienteTemporada();
}
function siguienteTemporada(){
  S.temporada++;
  if(S.temporada>tempTotal()){final();return;}
  abrirTemporada();
}

/* ---------- final ---------- */
function apodo(){
  const sum=k=>S.tomadas.reduce((a,d)=>a+d[k],0);
  const ejes=[["res",t3("El Resultadista","O Resultadista","The Results Man")],["dir",t3("El Político","O Político","The Politician")],
    ["hin",t3("El Ídolo de la Tribuna","O Ídolo da Torcida","The Crowd's Idol")],["ves",t3("El Padre del Grupo","O Pai do Grupo","The Father of the Squad")]];
  let mej=ejes[0],mx=-99; ejes.forEach(([k,n])=>{const v=sum(k);if(v>mx){mx=v;mej=[k,n];}});
  let base=mx<=0?t3("El Superviviente","O Sobrevivente","The Survivor"):mej[1];
  const u=new Set(S.usadas);
  let suf = u.size===1?t3("Dogmático","Dogmático","Dogmatist") : u.size>=4?t3("Camaleón","Camaleão","Chameleon")
    : S.despidos>0?t3("Trotamundos","Andarilho","Globetrotter") : S.puntos>=40?t3("Ganador Serial","Vencedor Serial","Serial Winner"):"";
  return suf?(IDIOMA==="en"?`${base}, the ${suf}`:IDIOMA==="pt"?`${base}, o ${suf}`:`${base}, el ${suf}`):base;
}
function final(){
  const prom=(S.vars.res+S.vars.dir+S.vars.hin+S.vars.ves)/4;
  const score=Math.round((S.puntos/(tempTotal()*10))*70+(prom/100)*30);
  const nota=score>=88?"S":score>=74?"A":score>=58?"B":score>=42?"C":"D";
  const tit=S.titulos.length;
  const ap=apodo();
  // formato legible para humanos y parseable para el duelo
  window.__res=[
    `Carrera de DT — ${S.nombre}`,
    `Nota ${nota} · ${score}/100 · ${ap}`,
    `${tit} título(s) · terminó en ${S.club.n}, ${tDiv(DIVISIONES[S.division].n)}`,
    S.duelo?`#DUELO ${S.duelo}|${S.nombre}|${score}|${nota}|${tit}|${S.puntos}|${S.club.n}|${ap}`:""
  ].filter(Boolean).join("\n");
  S.resumenPropio={nombre:S.nombre,score,nota,titulos:tit,puntos:S.puntos,club:S.club.n,apodo:ap};
  $("#s-final").innerHTML=`
    <h2 class="disp">${T("seTermino")}</h2>
    <div class="tarjeta">
      <div class="nota">${nota}</div>
      <div class="apodo">${ap}</div>
      <div class="mini">${S.nombre} · ${score} / 100</div>
      <hr>
      <div class="fila"><span>${t3("Puntos de carrera","Pontos de carreira","Career points")}</span><span>${S.puntos} / ${tempTotal()*10}</span></div>
      <div class="fila"><span>${T("titulos")}</span><span>${tit?S.titulos.map(t=>trofeo(t.tipo||"liga",17)).join(" "):"—"} ${tit}</span></div>
      <div class="fila"><span>${t3("Terminó en","Terminou em","Finished at")}</span><span>${S.club.n}, ${tDiv(DIVISIONES[S.division].n)}</span></div>
      <div class="fila"><span>${T("estadio")}</span><span>${S.estadio} / 5</span></div>
      <div class="fila"><span>${t3("Veces que te echaron","Vezes demitido","Times sacked")}</span><span>${S.despidos}</span></div>
      ${S.etiqueta?`<div class="fila"><span>${t3("Te decían","Te chamavam","They called you")}</span><span>${tEtiq(S.etiqueta,"n")}</span></div>`:""}
      ${S.duelo?`<hr><div class="fila"><span>Código del duelo</span><span class="codigo-txt">${S.duelo}</span></div>
      <div class="fila"><span>Modo</span><span>${S.modo?S.modo.n:"Normal"}</span></div>`:""}
      <hr>
      <div class="fila"><span>${T("directiva")}</span><span>${Math.round(S.vars.dir)}</span></div>
      <div class="fila"><span>${T("hinchada")}</span><span>${Math.round(S.vars.hin)}</span></div>
      <div class="fila"><span>${T("vestuario")}</span><span>${Math.round(S.vars.ves)}</span></div>
    </div>
    ${S.titulos.length?`<h3 class="disp">${t3("Lo que ganaste","O que você ganhou","Your trophies")}</h3>
      <table>${S.titulos.map(t=>`<tr><td style="width:30px">${trofeo(t.tipo||"liga",22)}</td>
        <td>${t.comp}</td><td>${t.club}</td><td>T${t.t}</td></tr>`).join("")}</table>`:""}
    ${(()=>{const rs=recordsLogrados(S);const rotos=rs.filter(r=>r.roto);
      return `<h3 class="disp">${T("records")}</h3>
      ${rotos.length?`<p class="mini">${t3("Marcas históricas rotas","Marcas históricas quebradas","Historic records broken")}: ${rotos.length}</p>`:""}
      <table><tr><th>${t3("Marca","Marca","Record")}</th><th style="text-align:right">${t3("Récord","Recorde","Best")}</th><th style="text-align:right">${t3("Vos","Você","You")}</th></tr>
      ${rs.map(r=>`<tr class="${r.roto?'record-roto':''}">
        <td>${r.roto?trofeo("liga",14)+" ":""}${tRecord(r)}<div class="mini">${r.duenio}</div></td>
        <td style="text-align:right">${r.marca}</td>
        <td style="text-align:right"><b>${r.valor}</b></td></tr>`).join("")}</table>`;})()}

    <h3 class="disp">${T("trayectoria")}</h3>
    <table><tr><th>T</th><th>${t3("Club","Clube","Club")}</th><th>${t3("Competencia","Competição","Competition")}</th><th>${t3("Sistema","Sistema","System")}</th><th>${t3("Cierre","Fim","Finish")}</th></tr>
    ${S.hist.map(h=>`<tr><td>${h.t}</td><td>${h.club}</td><td>${h.comp||h.div}</td><td>${h.f||"—"}</td><td>${h.pos} ${(h.tit||[]).map(x=>trofeo(x,14)).join("")}</td></tr>`).join("")}</table>
    <details><summary>${t3("Cómo se jugó todo esto","Como tudo isso foi jogado","How it all worked")}</summary>
      <p class="mini" style="margin-top:8px">${t3("Cada partido de cada temporada se jugó de verdad: el once que pusiste, cuánto encajaban tu sistema y tu modelo, lo que tu equipo tenía automatizado, tu plan en las tres fases contra el estilo de cada rival, el vestuario, la tribuna, la forma y el cansancio de cada jugador. El azar existe, pero en una temporada larga gana el que sabe.",
        "Cada jogo de cada temporada foi jogado de verdade: a escalação, o encaixe entre sistema e modelo, os automatismos, seu plano nas três fases contra o estilo de cada rival, o vestiário, a torcida, a forma e o cansaço. A sorte existe, mas numa temporada longa ganha quem sabe.",
        "Every match of every season was actually played: your XI, how well system and model fit, your automatisms, your three-phase plan against each opponent's style, the dressing room, the crowd, each player's form and fatigue. Luck exists, but over a long season the one who knows wins.")}</p></details>
    ${S.duelo?`<div class="nota-lat">Duelo <span class="codigo">${S.duelo}</span>.
      Copiá tu resultado y pasáselo al otro DT. Cuando te pase el suyo,
      pegalo acá abajo y el juego los compara.</div>
      <div style="margin:12px 0">
        <label for="rival">Resultado del otro DT</label>
        <input type="text" id="rival" placeholder="Pegá acá el texto que te pasó">
      </div>
      <div class="acciones" style="margin-top:0">
        <button class="btn" onclick="compararDuelo()">${T("comparar")}</button></div>
      <div id="comparacion"></div>`:""}
    <div class="acciones">
      <button class="btn" onclick="copiar()">${T("copiarResultado")}</button>
      <button class="btn sec" onclick="portada()">${T("carreraNueva")}</button></div>
    <p class="mini" id="av"></p>`;
  ir("final");
}
function parseDuelo(txt){
  const m=(txt||"").match(/#DUELO\s+([^|]+)\|([^|]*)\|(\d+)\|([SABCD])\|(\d+)\|(\d+)\|([^|]*)\|(.*)/);
  if(!m) return null;
  return {codigo:m[1].trim(),nombre:m[2].trim()||"El otro DT",score:+m[3],nota:m[4],
          titulos:+m[5],puntos:+m[6],club:m[7].trim(),apodo:m[8].trim()};
}
function compararDuelo(){
  const cont=$("#comparacion");
  const txt=($("#rival")&&$("#rival").value)||"";
  const r=parseDuelo(txt);
  const yo=S.resumenPropio;
  if(!r){
    cont.innerHTML=`<p class="mini" style="color:var(--rojo)">No pude leer ese resultado.
      Tiene que ser el texto completo que copió el otro DT, incluida la línea que empieza con #DUELO.</p>`;
    return;
  }
  if(r.codigo!==S.duelo){
    cont.innerHTML=`<p class="mini" style="color:var(--ambar)">Ese resultado es del duelo
      <span class="codigo">${r.codigo}</span> y vos jugaste el <span class="codigo">${S.duelo}</span>.
      No jugaron las mismas condiciones, así que compararlos no diría nada.</p>`;
    return;
  }
  const gano = yo.score>r.score, empate = yo.score===r.score;
  const fila=(n,a,b,masEsMejor=true)=>{
    const gA=masEsMejor?a>b:a<b, gB=masEsMejor?b>a:b<a;
    return `<tr><td class="${gA?'gana-duelo':''}">${a}</td>
      <td class="centro">${n}</td>
      <td class="${gB?'gana-duelo':''}" style="text-align:right">${b}</td></tr>`;
  };
  cont.innerHTML=`
    <div class="resultado ${gano?'bien':empate?'':'mal'}" style="margin-top:14px">
      <b>${empate?"Empate":gano?"Ganaste el duelo":"Perdiste el duelo"}</b>
      <span>${empate?"Mismo puntaje con las mismas condiciones. Increíble."
        :gano?`Le sacaste ${yo.score-r.score} puntos con el mismo plantel disponible.`
        :`Te sacó ${r.score-yo.score} puntos con las mismas condiciones que vos.`}</span>
    </div>
    <table class="tabla-duelo">
      <tr><th>${yo.nombre}</th><th class="centro"></th><th style="text-align:right">${r.nombre}</th></tr>
      ${fila("Puntaje",yo.score,r.score)}
      ${fila("Nota",yo.nota,r.nota,false)}
      ${fila("Títulos",yo.titulos,r.titulos)}
      ${fila("Puntos de carrera",yo.puntos,r.puntos)}
      <tr><td>${yo.club}</td><td class="centro">Terminó en</td><td style="text-align:right">${r.club}</td></tr>
      <tr><td>${yo.apodo}</td><td class="centro">Le decían</td><td style="text-align:right">${r.apodo}</td></tr>
    </table>
    <p class="mini">Los dos recibieron exactamente las mismas ofertas, situaciones, cartas
    y tiradas. La diferencia es sólo lo que decidieron.</p>`;
}
function copiar(){
  const t=window.__res||"";
  const ok=()=>{const a=$("#av");if(a)a.textContent="Copiado.";};
  if(navigator.clipboard?.writeText) navigator.clipboard.writeText(t).then(ok).catch(ok);
  else ok();
}
setIdioma(idiomaGuardado());
portada();
