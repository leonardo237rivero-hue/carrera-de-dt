// Carrera de DT — flujo del juego: pantallas y loop de temporada
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   PORTADA
   ========================================================== */
function cambiarIdioma(id){ setIdioma(id); portada(); }
function portada(){
  S=nuevo();
  const demo=armarOnce(generarPlantel(70,3,null,"Uruguay"),"4-3-3",[]);
  $("#s-portada").innerHTML=`
    <div style="margin:26px 0 18px">
      <h2 class="disp" style="font-size:46px">${T("titulo")}</h2>
      <p class="mini" style="margin-top:6px">Seis temporadas. Vos elegís cómo para el equipo.</p>
    </div>
    ${cancha(demo,{mostrarRating:false,alto:300,ancho:420})}
    <div class="idiomas">${IDIOMAS.map(x=>`
      <button class="lang ${IDIOMA===x.id?'on':''}" onclick="cambiarIdioma('${x.id}')">${x.bandera} ${x.n}</button>`).join("")}</div>
    <div class="acciones">
      <button class="btn" onclick="identidad()">${T("empezar")}</button>
      <button class="btn sec" onclick="abrirDuelo()">${T("duelo")}</button>
    </div>
    <p class="mini" style="margin-top:12px">En el duelo los dos DT reciben las mismas
    situaciones, las mismas cartas y el mismo azar. Sólo cambia lo que cada uno decide.</p>`;
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
function identidad(){
  tmp={arq:null,sis:null,est:null,pre:"neutro",modo:"normal",hincha:"Peñarol"};
  pintarIdentidad(); ir("identidad");
}
function pintarIdentidad(){
  const listo=tmp.arq&&tmp.sis&&tmp.est&&tmp.pre;
  $("#s-identidad").innerHTML=`
    <h2 class="disp">${T("quienSos")}</h2>
    <div style="margin:14px 0"><label for="nom">Tu apellido</label>
      <input type="text" id="nom" maxlength="24" placeholder="Cómo te van a nombrar" value="${S.nombre}"></div>

    <h3 class="disp">${T("tuPerfil")}</h3>
    ${ARQ.map(a=>`<button class="card ${tmp.arq===a.id?'sel':''}" onclick="setArq('${a.id}')">
      <b>${nArq(a)}</b><div class="sub">${dArq(a)}</div>
      <div class="efecto">${efArq(a).join(" · ")}</div>
      <div class="costo">${coArq(a)}</div></button>`).join("")}

    <div style="margin:14px 0"><label for="hincha">De qué club sos hincha</label>
      <select id="hincha" onchange="setHincha(this.value)" style="font:inherit;font-size:15px;padding:11px;
        background:var(--panel);border:1.5px solid var(--borde);color:var(--texto);border-radius:3px;width:100%;max-width:320px">
        ${PAISES.map(pa=>`<optgroup label="${pa}">${LIGAS[pa].clubes.map(c=>
          `<option value="${c.n}" ${tmp.hincha===c.n?'selected':''}>${c.n}</option>`).join("")}</optgroup>`).join("")}
      </select>
      <p class="mini" style="margin-top:5px">Si algún día te vienen a buscar, vas a saber qué se siente.</p></div>

    <h3 class="disp">${T("tuSistema")}</h3>
    <p class="mini">Cuando lo uses vas a rendir un poco mejor. Cuando uses otro, un poco peor. No te obliga: te define.</p>
    <div class="grid3">${FORMACIONES.map(f=>`
      <button class="card ${tmp.sis===f?'sel':''}" style="margin:0" onclick="setSis('${f}')">
        <b>${f}</b>${cancha(ONCE[f].map(s=>({rol:s[0],x:s[1],y:s[2],jug:{nom:""},rt:"",fuera:false})),
          {alto:150,ancho:200,rMin:8,mostrarRating:false})}</button>`).join("")}</div>

    <h3 class="disp">${T("duracion")}</h3>
    <div class="grid3">${MODOS.map(m=>`
      <button class="card ${tmp.modo===m.id?'sel':''}" style="margin:0" onclick="setModo('${m.id}')">
        <b>${tModo(m,"n")}</b><div class="sub">${tModo(m,"desc")}</div></button>`).join("")}</div>

    <h3 class="disp">${T("relacionPrensa")}</h3>
    <p class="mini">No hay una correcta. Elegís qué te conviene perder.</p>
    ${POLITICAS_PRENSA.map(x=>`
      <button class="card ${tmp.pre===x.id?'sel':''}" onclick="setPre('${x.id}')">
        <b>${tPrensa(x,"n")}</b><div class="sub">${tPrensa(x,"desc")}</div>
        <div class="efecto">${tPrensa(x,"pro")}</div>
        ${x.contra?`<div class="costo">${tPrensa(x,"contra")}</div>`:""}</button>`).join("")}

    <h3 class="disp">${T("tuModelo")}</h3>
    <div class="grid3">${ESTILOS.map(e=>`
      <button class="card ${tmp.est===e?'sel':''}" style="margin:0" onclick="setEst('${e}')">
        <b>${ESTILO_LBL[e]}</b>${tmp.sis?`<div class="sub">Con ${tmp.sis}: ${FIT_LBL[FIT[e][tmp.sis]]}</div>`:""}
      </button>`).join("")}</div>

    <div class="acciones">
      <button class="btn" onclick="verOfertas()" ${listo?'':'disabled'}>${T("buscarClub")}</button>
      <button class="btn sec" onclick="portada()">${T("volver")}</button></div>`;
}
function setArq(id){S.nombre=$("#nom").value;tmp.arq=id;pintarIdentidad();}
function setHincha(v){tmp.hincha=v;}
function setSis(f){S.nombre=$("#nom").value;tmp.sis=f;pintarIdentidad();}
function setEst(e){S.nombre=$("#nom").value;tmp.est=e;pintarIdentidad();}
function setPre(x){S.nombre=$("#nom").value;tmp.pre=x;pintarIdentidad();}
function setModo(x){S.nombre=$("#nom").value;tmp.modo=x;pintarIdentidad();}

/* ==========================================================
   MERCADO DE ENTRENADORES
   ========================================================== */
function verOfertas(){
  S.nombre=($("#nom").value||"").trim()||"El DT";
  S.arq=ARQ.find(a=>a.id===tmp.arq);
  S.sistemaPref=tmp.sis; S.estiloPref=tmp.est;
  S.prensa=POLITICAS_PRENSA.find(x=>x.id===tmp.pre)||POLITICAS_PRENSA[1];
  S.modo=MODOS.find(x=>x.id===tmp.modo)||MODOS[1];
  S.temporadasTotal=S.modo.temporadas;
  const hs=$("#hincha"); if(hs) tmp.hincha=hs.value;
  S.clubHincha=CLUBES.find(c=>c.n===tmp.hincha)||null;
  // en duelo la semilla manda desde el principio: hasta las ofertas son iguales
  S.rng = S.duelo ? mul32(hashS(S.duelo)) : mul32(hashS("libre"+Math.random()));
  const mez=R.mz(CLUBES);
  const grande=mez.find(c=>c.niv>=5), medio=mez.find(c=>c.niv===3||c.niv===4), chico=mez.find(c=>c.niv<=2);
  S.ofertas=[
    {club:grande,div:0,txt:"Club grande, pero entrás por las formativas. Si salís campeón subís dos categorías de una."},
    {club:medio,div:3,txt:"Primera división de entrada. Plantel correcto, exigencia media."},
    {club:chico,div:3,txt:"Primera de un club chico. Poca plata, pero nadie te va a pedir salir campeón."}
  ];
  $("#s-ofertas").innerHTML=`
    <h2 class="disp">${T("quienTeQuiere")}</h2>
    <p>Tres ofertas sobre la mesa. Un club grande te da techo pero te hace empezar de abajo;
    un club chico te da el primer equipo ya.</p>
    ${S.ofertas.map((o,i)=>`
      <button class="card" onclick="firmar(${i})">
        <div style="display:flex;gap:12px;align-items:center">${escudo(o.club,40)}
          <div><b>${o.club.n}</b>
          <div class="sub">${o.club.p} · ${tDiv(DIVISIONES[o.div].n)} · plantel nivel ${o.club.niv}/5</div></div></div>
        <div class="efecto" style="color:var(--tenue)">${o.txt}</div>
      </button>`).join("")}`;
  ir("ofertas");
}
function firmar(i){
  const o=S.ofertas[i];
  // si el club es de otro país, ofrecer el idioma de ese país
  const sug=IDIOMA_POR_PAIS[o.club.p];
  if(sug && sug!==IDIOMA && !S.idiomaPreguntado){
    S.idiomaPreguntado=true;
    S.ofertaElegida=i;
    $("#s-ofertas").innerHTML=`
      <h2 class="disp">${o.club.n}</h2>
      <p>${sug==="pt"?"Este clube é do Brasil. Quer jogar em português?"
         :sug==="en"?"This club is from an English-speaking league. Play in English?"
         :"Este club es de habla hispana. ¿Querés jugar en español?"}</p>
      <div class="acciones">
        <button class="btn" onclick="setIdioma('${sug}');firmarDefinitivo()">${
          sug==="pt"?"Sim, em português":sug==="en"?"Yes, in English":"Sí, en español"}</button>
        <button class="btn sec" onclick="firmarDefinitivo()">${T("seguir")}</button>
      </div>`;
    return;
  }
  firmarClub(o);
}
function firmarDefinitivo(){ firmarClub(S.ofertas[S.ofertaElegida]); }
function firmarClub(o){
  S.club=o.club; S.division=o.div; S.esSeleccion=false;
  // en duelo la semilla es el código: dos DT con el mismo código juegan lo mismo
  // el RNG ya quedó sembrado en verOfertas; acá no se toca para no romper el duelo
  S.plantel=generarPlantel(nivelBaseDe(o.club.niv,o.div),o.div,null,o.club.p);
  if(S.arq.id==="bombero") S.plantel.forEach(j=>{if(j.g==="DEF"||j.g==="POR")j.rt=clamp(j.rt+7,28,94);});
  if(S.arq.id==="ganador"){const d=S.plantel.filter(j=>j.g==="ATA").sort((a,b)=>b.rt-a.rt)[0];if(d)d.rt=clamp(d.rt+8,28,94);}
  S.presupuesto=clamp(18+o.club.niv*8+S.arq.pres,5,100);
  const P=S.prensa||POLITICAS_PRENSA[1];
  S.vars={res:50,
    dir:clamp(50+S.arq.dir+P.dir,5,95),
    hin:clamp(50+S.arq.hin+P.hin,5,95),
    ves:clamp(50+S.arq.vest+P.ves,5,95)};
  S.pool=R.mz(POOL); S.temporada=1; S.estadio=Math.max(1,o.club.niv-1);
  abrirTemporada();
}

/* ==========================================================
   TEMPORADA
   ========================================================== */
function abrirTemporada(){
  S.decs=[S.pool.shift(),S.pool.shift()].filter(Boolean); S.decIdx=0;
  S.decs=S.decs.map(d=>marcar(d,"pool"));
  // en formativas, una de las dos decisiones es propia de la categoría
  if(S.division<3 && !S.esSeleccion){
    S.formUsadas=S.formUsadas||[];
    const cands=POOL_FORMATIVAS.filter(d=>!S.formUsadas.includes(d[1]));
    if(cands.length){
      const el=R.el(cands);
      S.formUsadas.push(el[1]);
      S.decs[R.e(0,S.decs.length-1)]=el;
    }
  }
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
  verPlantel();
}
function grupoLbl(g){return ({POR:"Arquero",DEF:"Defensa",MED:"Mediocampo",ATA:"Ataque"})[g];}
function verPlantel(){
  pintarPlantel(); ir("plantel");
}
function pintarPlantel(){
  const f=S.formacion||S.sistemaPref;
  const once=armarOnce(S.plantel,f,S.fijos||[]);
  const a=atributosDe(once);
  const enOnce=new Set(once.map(o=>o.jug));
  const banco=S.plantel.filter(j=>!enOnce.has(j)).sort((x,y)=>y.rt-x.rt);
  const fuera=once.filter(o=>o.fuera).length;
  const sel=tmp.selBanco;
  $("#s-plantel").innerHTML=`
    <h2 class="disp">${T("tuPlantel")}</h2>
    <p class="mini">Parado con ${f}. ${fuera?`<span style="color:var(--ambar)">${fuera} juega${fuera>1?'n':''} fuera de puesto y pierde${fuera>1?'n':''} 10 puntos.</span>`:""}</p>
    ${tablero()}
    ${barras(a)}
    <div class="plantel-grid">
      <div>${canchaInteractiva(once)}</div>
      <div class="banco">
        <h3 class="disp" style="font-size:18px;margin:0 0 6px">Banco</h3>
        <p class="mini" style="margin-bottom:8px">${sel
          ? "Ahora tocá el jugador de la cancha al que querés reemplazar."
          : "Tocá un suplente y después al titular que sale."}</p>
        ${banco.map((j,i)=>`
          <button class="sup ${sel===j?'sel':''}" onclick="elegirBanco(${i})">
            <span class="sup-rt">${j.rt}</span>
            <span class="sup-nom">${j.nom}</span>
            <span class="sup-pos">${tGrupo(j.g)} · ${j.ed}</span>
          </button>`).join("")}
        ${S.fijos&&S.fijos.length?`<button class="btn sec" style="margin-top:10px;font-size:13px"
          onclick="S.fijos=[];pintarPlantel()">Volver al once automático</button>`:""}
      </div>
    </div>
    <p class="mini">Los cuatro números salen de los once que entran. Si cambiás el sistema, cambian.</p>
    <div class="acciones"><button class="btn" onclick="abrirMercado()">${T("irMercado")}</button></div>`;
  window.__banco=banco; window.__once=once;
}
function canchaInteractiva(once){
  const W=420,H=440,margen=18;
  const span=H-margen*2;
  return `<svg class="cancha" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tu once en la cancha">
    <rect width="${W}" height="${H}" fill="#224236"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<rect y="${i*H/8}" width="${W}" height="${H/16}" fill="#284C3E"/>`).join("")}
    <rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <line x1="6" y1="${H/2}" x2="${W-6}" y2="${H/2}" stroke="#5A8A76" stroke-width="1.5"/>
    <circle cx="${W/2}" cy="${H/2}" r="40" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-62}" y="${H-46}" width="124" height="40" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    ${once.map((o,i)=>{
      const px=(o.x/100)*W, py=H-margen-(o.y/100)*span;
      const marcado=tmp.selBanco&&ROL[o.rol].g===tmp.selBanco.g;
      return `<g style="cursor:pointer" onclick="reemplazar(${i})">
        <circle cx="${px}" cy="${py}" r="16" fill="${marcado?'#E0A93B':'#4FBF7F'}"
          stroke="${o.fuera?'#E0A93B':'#183028'}" stroke-width="2.5"/>
        <text x="${px}" y="${py+5}" text-anchor="middle" class="pos-chip" font-size="13"
          fill="#0D1613" pointer-events="none">${o.rt}</text>
        <text x="${px}" y="${py+29}" text-anchor="middle" font-size="9" font-weight="600"
          fill="#BFE8D2" pointer-events="none">${(o.jug.nom||"").split(" ").pop()}</text>
        <text x="${px}" y="${py-21}" text-anchor="middle" font-size="8"
          fill="#8FC0AA" pointer-events="none">${tRol(o.rol)}</text></g>`;
    }).join("")}
  </svg>`;
}
function elegirBanco(i){
  const j=window.__banco[i];
  tmp.selBanco = (tmp.selBanco===j) ? null : j;
  pintarPlantel();
}
function reemplazar(i){
  if(!tmp.selBanco){ return; }
  const sale=window.__once[i].jug, entra=tmp.selBanco;
  S.fijos=S.fijos||[];
  S.fijos=S.fijos.filter(x=>x!==sale);
  S.fijos.push(entra);
  if(S.fijos.length>6) S.fijos.shift();
  tmp.selBanco=null;
  pintarPlantel();
}

function fijar(idx){
  const j=S.plantel[idx];
  if(!j||S.fijos.includes(j)) return;
  if(S.fijos.length>=5){ S.fijos.shift(); }
  S.fijos.push(j);
  verPlantel();
}
function soltar(idx){
  const j=S.plantel[idx];
  const k=S.fijos.indexOf(j);
  if(k>=0) S.fijos.splice(k,1);
  verPlantel();
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

/* ---------- ruleta ---------- */
// 18 casillas: los puestos comunes van duplicados, los cracks aparecen una sola vez.
// Apuntarle a un crack es 1 de 18; a un puesto común, 2 de 18.
// RULETA POR ZONAS
// Cuatro zonas en vez de doce puestos: sube muchísimo la chance de acertar
// sin sacar el azar. Dentro de cada zona, el crack ocupa la mitad de casillas
// que el común, así pedir crack sigue siendo la apuesta arriesgada.
const BASE_SEG=[
 {g:"POR",crack:false,lbl:"Arquero",corto:"ARQUERO"},
 {g:"POR",crack:true, lbl:"Arquero crack",corto:"ARQ ★"},
 {g:"DEF",crack:false,lbl:"Defensa",corto:"DEFENSA"},
 {g:"DEF",crack:true, lbl:"Defensa crack",corto:"DEF ★"},
 {g:"MED",crack:false,lbl:"Mediocampo",corto:"MEDIO"},
 {g:"MED",crack:true, lbl:"Mediocampo crack",corto:"MEDIO ★"},
 {g:"ATA",crack:false,lbl:"Ataque",corto:"ATAQUE"},
 {g:"ATA",crack:true, lbl:"Ataque crack",corto:"ATAQUE ★"}
];
// cada zona común entra 3 veces, cada crack 1: 12 comunes + 4 cracks = 16 casillas
const SEGMENTOS=(()=>{
  const com=[],cra=[];
  BASE_SEG.forEach(s=>{ if(s.crack) cra.push(s); else {com.push(s);com.push(s);com.push(s);} });
  // intercalar para que los cracks queden repartidos en la rueda
  const out=[]; let ci=0;
  com.forEach((s,i)=>{ out.push(s); if(i%3===2 && ci<cra.length) out.push(cra[ci++]); });
  while(ci<cra.length) out.push(cra[ci++]);
  return out;
})();
const PUESTOS=BASE_SEG.map(s=>s.lbl);
function abrirRuleta(){
  tmp.fichas=[]; tmp.girada=false;
  pintarRuleta(); ir("ruleta");
}
function svgRuleta(){
  const n=SEGMENTOS.length, r=120, ri=52, cx=140, cy=140;
  let out=`<svg id="ruleta" width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="Ruleta de puestos">`;
  SEGMENTOS.forEach((s,i)=>{
    const a0=(i/n)*2*Math.PI-Math.PI/2, a1=((i+1)/n)*2*Math.PI-Math.PI/2;
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    const marcada=tmp.fichas.includes(s.lbl);
    const base = s.crack ? "#7A4A12" : (i%2?"#26332E":"#2E3F38");
    out+=`<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z"
      fill="${marcada?(s.crack?'#E0A93B':'#4FBF7F'):base}" stroke="#141C19" stroke-width="1.5"/>`;
    const am=(a0+a1)/2, tx=cx+((r+ri)/2)*Math.cos(am), ty=cy+((r+ri)/2)*Math.sin(am);
    const gira=(am*180/Math.PI);
    out+=`<text x="${tx}" y="${ty+3}" text-anchor="middle" font-size="9" font-weight="600"
      fill="${marcada?'#141C19':(s.crack?'#F0C98A':'#DDE6E0')}"
      transform="rotate(${gira>90||gira<-90?gira+180:gira} ${tx} ${ty})">${s.corto}</text>`;
  });
  out+=`<circle cx="${cx}" cy="${cy}" r="${ri-6}" fill="#141C19" stroke="#4FBF7F" stroke-width="2"/>
    <text x="${cx}" y="${cy-2}" text-anchor="middle" font-size="11" fill="#8A9A91">18 casillas</text>
    <text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="10" fill="#E0A93B">5 son crack</text></svg>`;
  return out;
}
function chancesDe(lbl){
  const c=SEGMENTOS.filter(s=>s.lbl===lbl).length;
  return {casillas:c, pct:Math.round(c/SEGMENTOS.length*100)};
}
function pintarRuleta(){
  $("#s-ruleta").innerHTML=`
    <h2 class="disp">La ruleta del club</h2>
    <p>Cada puesto común ocupa dos casillas de la ruleta; cada crack, una sola.
    Apostar a un crack paga mucho más, pero cae la mitad de las veces.
    Poné dos fichas: si la bocha para en un puesto tuyo, el jugador sale bastante mejor.</p>
    ${panelPlantel()}
    <div class="ruleta-wrap">
      <div style="font-size:22px;color:var(--ambar);line-height:1">▼</div>
      ${svgRuleta()}
    </div>
    <div class="fichas">${PUESTOS.map(l=>{
      const ch=chancesDe(l), es=BASE_SEG.find(s=>s.lbl===l);
      return `<button class="ficha-btn ${tmp.fichas.includes(l)?'on':''}"
        ${tmp.girada||(tmp.fichas.length>=2&&!tmp.fichas.includes(l))?'disabled':''}
        onclick="ponerFicha('${l}')">
        <div style="${es.crack?'color:var(--ambar);font-weight:600':''}">${l}</div>
        <div style="font-size:11px;color:var(--tenue)">${ch.casillas} de ${SEGMENTOS.length} casillas · ${ch.pct}%</div>
      </button>`;}).join("")}</div>
    <p class="mini" style="margin-top:10px">Fichas puestas: ${tmp.fichas.length} de 2</p>
    <div class="acciones">
      <button class="btn" id="btnGirar" onclick="girar()" ${tmp.fichas.length===2&&!tmp.girada?'':'disabled'}>${T("girar")}</button>
      <button class="btn sec" id="btnSeguirRul" onclick="siguienteDecision()" ${tmp.girada?'':'disabled'}>${T("seguir")}</button></div>
    <div id="salida"></div>`;
}
function ponerFicha(lbl){
  if(tmp.girada) return;
  const k=tmp.fichas.indexOf(lbl);
  if(k>=0) tmp.fichas.splice(k,1); else if(tmp.fichas.length<2) tmp.fichas.push(lbl);
  pintarRuleta();
}
function girar(){
  if(tmp.girada) return;
  tmp.girada=true;
  const gan=R.e(0,SEGMENTOS.length-1);
  const seg=SEGMENTOS[gan];
  const grados=360*5 + (360 - (gan+0.5)*(360/SEGMENTOS.length));
  const el=$("#ruleta");
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(el&&!reduce) el.style.transform=`rotate(${grados}deg)`;
  const acerto=tmp.fichas.includes(seg.lbl);
  setTimeout(()=>{
    // el nivel se mide contra lo que YA tenes en ese puesto:
    // un "crack" tiene que ser mejor que tu titular, no que el promedio de la liga
    const mios=S.plantel.filter(x=>x.g===seg.g).map(x=>x.rt);
    const mejorMio=mios.length?Math.max(...mios):nivelBaseDe(S.club.niv,S.division);
    const piso=nivelBaseDe(S.club.niv,S.division)+S.temporada*2;
    const base=seg.crack?Math.max(mejorMio,piso):Math.max(mejorMio-10,piso-6);
    let bono=(seg.crack?R.e(3,9):R.e(-4,4))+(acerto?R.e(5,9):0);
    if(S.arq.id==="formador") bono+=4;
    const j=nuevoJugador(seg.g,base+bono,S.division,null,S.club.p);
    j.nuevo=true;
    // IMPORTANTE: medir el impacto ANTES de sumarlo al plantel
    const im=impactoDe(j);
    const util=im.dif.map((d,x)=>d?`${ATRIBUTOS[x]} ${im.antes[x]} → ${im.desp[x]}`:null).filter(Boolean);
    const f=S.formacion||S.sistemaPref;
    const entra=armarOnce(S.plantel.concat([j]),f,S.fijos).some(o=>o.jug===j);
    window.__ofrecido=j;
    const s=$("#salida");
    if(s) s.innerHTML=`
      <div class="card" style="cursor:default;border-color:${seg.crack?'var(--ambar)':'var(--borde)'}">
        <b>${acerto?"¡Le pegaste! ":""}Salió ${seg.lbl.toLowerCase()}</b>
        <div class="sub">${j.nom} · ${j.ed} años</div>
        <div style="font-family:'Big Shoulders Display';font-weight:800;font-size:34px;color:var(--verde);line-height:1;margin:4px 0">${j.rt}</div>
        <div class="efecto">${entra?"Entra al once. "+(util.length?util.join(" · "):"Sin cambio neto."):
          "Iría al banco: hoy no supera a ninguno de tus titulares en ese puesto."}</div>
        <div class="acciones" style="margin-top:12px">
          <button class="btn" onclick="aceptarRuleta(true)">Lo sumo al plantel</button>
          <button class="btn sec" onclick="aceptarRuleta(false)">Paso, no lo quiero</button>
        </div></div>`;
    const b=$("#btnGirar"); if(b) b.disabled=true;
    document.querySelectorAll(".ficha-btn").forEach(x=>x.disabled=true);
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
function elegirCompetencia(){
  const L=LIGAS[S.club.p];
  if(S.esSeleccion){
    const c=["Eliminatorias","Copa América","Copa del Mundo"];
    return {nombre:c[Math.min(2,S.temporada-3)]||c[0],
            rivales:SELECCIONES.filter(s=>s.n!==S.club.n)};
  }
  if(S.division<3){
    return {nombre:`${L.liga} ${DIVISIONES[S.division].comp}`,
            rivales:L.clubes.filter(c=>c.n!==S.club.n).map(c=>Object.assign({p:S.club.p},c))};
  }
  // en primera: a veces la copa continental
  const copa = S.club.niv>=4 && S.rng()<0.35;
  if(copa){
    const conf=L.conf;
    const riv=CLUBES.filter(c=>LIGAS[c.p].conf===conf && c.n!==S.club.n && c.niv>=3);
    return {nombre:COPA[conf], rivales:riv.length?riv:L.clubes.map(c=>Object.assign({p:S.club.p},c))};
  }
  const tor=TORNEOS[S.club.p]||[L.liga];
  return {nombre:tor[(S.temporada-1)%tor.length],
          rivales:L.clubes.filter(c=>c.n!==S.club.n).map(c=>Object.assign({p:S.club.p},c))};
}
function irPlanteo(){
  const cp=elegirCompetencia();
  S.compe=cp.nombre;
  const rivClub=R.el(cp.rivales);
  // el rival escala con la temporada, con su categoria y con lo bien que venis.
  // si ganas todo, te empiezan a poner partidos mas duros.
  const racha=Math.floor(S.puntos/7);
  const dif=(S.temporada-1)*3+(rivClub.niv-S.club.niv)*4+racha*2;
  const baseRiv=nivelBaseDe(S.club.niv,S.division)+dif;
  S.rival={n:rivClub,
           plantel:generarPlantel(baseRiv,S.division,null,rivClub.p),
           formacion:R.el(FORMACIONES), estilo:R.el(ESTILOS)};
  S.rival.once=armarOnce(S.rival.plantel,S.rival.formacion);
  S.rival.attrs=atributosDe(S.rival.once);
  tmp={f:S.sistemaPref,e:S.estiloPref};
  pintarPlanteo(); ir("planteo");
}
function fuerteDe(attrs){
  const idx=attrs.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);
  return {alto:ATRIBUTOS[idx[0].i],bajo:ATRIBUTOS[idx[3].i]};
}
function pintarPlanteo(){
  const rv=S.rival, f=fuerteDe(rv.attrs);
  const miOnce=armarOnce(S.plantel,tmp.f,S.fijos), miAttrs=atributosDe(miOnce);
  const zm=ZONAS[tmp.f], zr=ZONAS[rv.formacion];
  const fit=FIT[tmp.e][tmp.f], mu=MATCHUP[tmp.f][rv.formacion];
  const zn=["Defensa","Mediocampo","Ataque"];
  const fuera=miOnce.filter(o=>o.fuera).length;
  $("#s-planteo").innerHTML=`
    <h2 class="disp">${T("comoLosParas")}</h2>
    ${tablero()}
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:4px">${escudo(rv.n,32)}
      <div><b style="font-family:'Big Shoulders Display';font-weight:800;font-size:20px">${rv.n.n}</b>
      <div class="mini">${S.compe} · sale con ${rv.formacion}, ${tEstilo(rv.estilo)}</div></div></div>

    ${(window.__piz={mio:miOnce,riv:rv.once})?"":""}${pizarraCruce(miOnce,rv.once)}
    <p class="mini" id="lecturaZonas">${textoSectores(miOnce,rv.once)}</p>

    <div class="zonas">
      <div class="lbl">Vos · ${tmp.f}</div><div class="lbl">Quién le queda a quién</div><div class="lbl">${rv.n.n} · ${rv.formacion}</div>
      ${[0,1,2].map(i=>`
        <div class="z ${zm[i]>zr[2-i]?'gana':zm[i]<zr[2-i]?'pierde':''}">${zm[i]}</div>
        <div class="lbl">tu ${zn[i].toLowerCase()} contra su ${zn[2-i].toLowerCase()}</div>
        <div class="z ${zr[2-i]>zm[i]?'gana':zr[2-i]<zm[i]?'pierde':''}">${zr[2-i]}</div>`).join("")}
    </div>
    <p class="mini">${mu>1.01?"El cruce de sistemas te favorece.":mu<0.99?"El cruce de sistemas te complica.":"El cruce de sistemas está parejo."}</p>

    <h3 class="disp">${T("probarSistema")}</h3>
    <p class="mini">Tocá uno y mirá cómo se reacomoda tu equipo sobre el de ellos.</p>
    <div class="grid3">${FORMACIONES.map(x=>{
      const a=atributosDe(armarOnce(S.plantel,x,S.fijos));
      const zx=ZONAS[x];
      return `<button class="card ${tmp.f===x?'sel':''}" style="margin:0" onclick="pf('${x}')">
        <b>${x}${x===S.sistemaPref?' ★':''}</b>
        <div class="sub" style="color:${zx[1]>zr[1]?'var(--verde)':zx[1]<zr[1]?'var(--rojo)':'var(--tenue)'}">
          ${zx[0]}-${zx[1]}-${zx[2]} contra ${zr[2]}-${zr[1]}-${zr[0]}</div>
        ${cancha(ONCE[x].map(s=>({rol:s[0],x:s[1],y:s[2],jug:{nom:""},rt:"",fuera:false})),
          {alto:120,ancho:170,rMin:6,mostrarRating:false})}</button>`;}).join("")}</div>

    <h3 class="disp">${T("tuModelo2")}</h3>
    <div class="grid3">${ESTILOS.map(x=>{
      const fx=FIT[x][tmp.f];
      return `<button class="card ${tmp.e===x?'sel':''}" style="margin:0" onclick="pe('${x}')">
        <b>${tEstilo(x)}${x===S.estiloPref?' ★':''}</b>
        <div class="sub" style="color:${fx>=1.06?'var(--verde)':fx<=0.94?'var(--rojo)':'var(--tenue)'}">
          ${PORQUE_FIT[x][tmp.f]}</div></button>`;}).join("")}</div>

    <h3 class="disp">${T("comoQuedan")}</h3>
    <div class="comparar">
      <div><div class="lbl-eq">Vos</div>${barras(miAttrs)}</div>
      <div><div class="lbl-eq">${rv.n.n}</div>${barras(rv.attrs)}</div>
    </div>
    <p class="mini">Con ${ESTILO_LBL[tmp.e]} en ${tmp.f}: ${PORQUE_FIT[tmp.e][tmp.f]}
      Su fuerte es <b>${f.alto}</b>, su punto flojo es <b>${f.bajo}</b>.
      ${fuera?`<span style="color:var(--ambar)">Con ${tmp.f} tenés ${fuera} jugador${fuera>1?'es':''} fuera de puesto.</span>`:""}</p>

    <div class="acciones">
      <button class="btn" onclick="jugar()">${T("jugarTemporada")}</button>
      <button class="btn sec" onclick="resetAjustes()">Volver a la posición original</button></div>`;
  activarArrastre();
}

// una sola pizarra: ellos arriba en rojo, vos abajo en verde, enfrentados
const PIZ={W:460,H:470,margen:16};
PIZ.span=(PIZ.H-PIZ.margen*2)*0.86;
function posMiaDe(o,i,aj){
  const a=(aj&&aj[i])||{dx:0,dy:0};
  return {x:clamp((o.x+a.dx)/100,0.04,0.96)*PIZ.W,
          y:PIZ.H-PIZ.margen-clamp((o.y+a.dy)/100,0,1)*PIZ.span};
}
function posRivDe(o){
  return {x:((100-o.x)/100)*PIZ.W, y:PIZ.margen+(o.y/100)*PIZ.span};
}
function contarSector(pts,c,r){
  return pts.filter(p=>Math.min(2,Math.floor(p.x/(PIZ.W/3)))===c
                    && Math.min(2,Math.floor(p.y/(PIZ.H/3)))===r).length;
}
function conteos(mio,riv,aj){
  const pm=mio.map((o,i)=>({...posMiaDe(o,i,aj),rol:o.rol})).filter(p=>p.rol!=="POR");
  const pr=riv.map(posRivDe).map((p,i)=>({...p,rol:riv[i].rol})).filter(p=>p.rol!=="POR");
  const out=[];
  for(let r=0;r<3;r++) for(let c=0;c<3;c++)
    out.push({r,c,a:contarSector(pm,c,r),b:contarSector(pr,c,r)});
  return out;
}
function pizarraCruce(mio,riv){
  const {W,H,margen}=PIZ, mid=H/2;
  const aj=tmp.ajustes||{};
  const cs=conteos(mio,riv,aj);
  const sectores=cs.map(s=>{
    const x=s.c*(W/3), y=s.r*(H/3);
    const col=s.a>s.b?"#4FBF7F":s.b>s.a?"#D9543F":"#8A9A91";
    const op=(s.a+s.b)===0?0:(s.a===s.b?0.05:Math.min(3,Math.abs(s.a-s.b))*0.08);
    return `<rect id="sbg-${s.r}-${s.c}" x="${x}" y="${y}" width="${W/3}" height="${H/3}"
        fill="${col}" opacity="${op}"/>
      <text id="stx-${s.r}-${s.c}" x="${x+W/6}" y="${y+H/6+4}" text-anchor="middle"
        font-size="15" font-weight="800" fill="${col}" opacity="${(s.a+s.b)===0?0:0.5}"
        pointer-events="none">${s.a}v${s.b}</text>`;
  }).join("");

  // rival: circulo hueco, nombre arriba. propio: circulo lleno, nombre abajo.
  const dibRival=riv.map(o=>{
    const p=posRivDe(o);
    return `<g pointer-events="none">
      <circle cx="${p.x}" cy="${p.y}" r="12" fill="#1D2925" stroke="#D9543F" stroke-width="2.5"/>
      <text x="${p.x}" y="${p.y+4}" text-anchor="middle" class="pos-chip" font-size="11" fill="#F0A99B">${o.rt}</text>
      <text x="${p.x}" y="${p.y-17}" text-anchor="middle" font-size="8.5" fill="#E8B6AC">${(o.jug.nom||"").split(" ").pop()}</text></g>`;
  }).join("");
  const dibMio=mio.map((o,i)=>{
    const p=posMiaDe(o,i,aj);
    const mov=aj[i]&&(aj[i].dx||aj[i].dy);
    return `<g class="arrastrable" data-i="${i}" style="cursor:grab;touch-action:none">
      <circle cx="${p.x}" cy="${p.y}" r="14" fill="#4FBF7F" stroke="${mov?'#E0A93B':'#183028'}" stroke-width="2.5"/>
      <text x="${p.x}" y="${p.y+4.5}" text-anchor="middle" class="pos-chip" font-size="12"
        fill="#0D1613" pointer-events="none">${o.rt}</text>
      <text x="${p.x}" y="${p.y+26}" text-anchor="middle" font-size="9" font-weight="600"
        fill="#BFE8D2" pointer-events="none">${(o.jug.nom||"").split(" ").pop()}</text></g>`;
  }).join("");

  return `<svg id="pizarra" class="cancha" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Tu equipo y el del rival en la misma cancha. Arrastrá a tus jugadores para cambiar de sector.">
    <rect width="${W}" height="${H}" fill="#224236"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<rect y="${i*H/8}" width="${W}" height="${H/16}" fill="#284C3E"/>`).join("")}
    ${sectores}
    <g stroke="#4F7A69" stroke-width="1" opacity=".4" stroke-dasharray="5 6">
      <line x1="${W/3}" y1="6" x2="${W/3}" y2="${H-6}"/><line x1="${2*W/3}" y1="6" x2="${2*W/3}" y2="${H-6}"/>
      <line x1="6" y1="${H/3}" x2="${W-6}" y2="${H/3}"/><line x1="6" y1="${2*H/3}" x2="${W-6}" y2="${2*H/3}"/></g>
    <rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <line x1="6" y1="${mid}" x2="${W-6}" y2="${mid}" stroke="#5A8A76" stroke-width="1.5"/>
    <circle cx="${W/2}" cy="${mid}" r="42" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-64}" y="6" width="128" height="44" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-64}" y="${H-50}" width="128" height="44" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    ${dibRival}
    ${dibMio}
  </svg>
  <div class="leyenda">
    <span><i class="pt riv"></i>${S.rival.n.n} · ${S.rival.formacion}</span>
    <span><i class="pt pro"></i>${S.club.n} · ${tmp.f}</span>
  </div>
  <p class="mini" style="margin-top:6px">Arrastrá a tus jugadores para correrlos de sector.
  El número de cada sector es <b>los tuyos contra los de ellos</b>, sin contar arqueros.</p>`;
}
// describe la MECÁNICA del cruce, no el veredicto: el jugador saca la conclusión
function lecturaCruce(zm,zr,mu){
  const t=[];
  const dm=zm[1]-zr[1];
  if(dm>0) t.push(`Ponés ${zm[1]} hombres en el medio contra ${zr[1]}: cuando circulan por dentro les sobra un marcador y les queda uno libre entre líneas.`);
  else if(dm<0) t.push(`Ponés ${zm[1]} en el medio contra ${zr[1]}: cuando ellos toquen por dentro vas a llegar siempre un paso tarde, y a uno lo vas a dejar solo.`);
  else t.push(`${zm[1]} contra ${zr[1]} en el medio: nadie tiene un hombre de más, se define en los duelos individuales.`);
  const da=zm[2]-zr[0];
  if(da>0) t.push(`Atacás con ${zm[2]} contra ${zr[0]} defensores: hay un atacante que ningún defensor puede tomar.`);
  else if(da<0) t.push(`Atacás con ${zm[2]} contra ${zr[0]} defensores: te van a marcar de a uno y les va a sobrar gente para cubrir.`);
  else t.push(`${zm[2]} atacantes contra ${zr[0]} defensores: marca punto por punto, sin coberturas de sobra.`);
  const dd=zm[0]-zr[2];
  if(dd>0) t.push(`Atrás quedás ${zm[0]} contra ${zr[2]}: tenés cobertura para tapar al que se filtre.`);
  else if(dd<0) t.push(`Atrás quedás ${zm[0]} contra ${zr[2]}: si te agarran mal parado, quedan mano a mano.`);
  return t.join(" ");
}
// arrastre: se mueve el jugador SIN redibujar la pizarra (redibujar mata el gesto).
// solo se actualizan los numeros de los sectores en vivo.
function activarArrastre(){
  const svg=document.getElementById("pizarra");
  if(!svg||!window.__piz) return;
  const {mio,riv}=window.__piz;
  let act=null;

  const aPizarra=ev=>{
    const c=svg.getBoundingClientRect();
    return {x:(ev.clientX-c.left)/c.width*PIZ.W, y:(ev.clientY-c.top)/c.height*PIZ.H};
  };
  const refrescarSectores=()=>{
    conteos(mio,riv,tmp.ajustes).forEach(s=>{
      const t=document.getElementById(`stx-${s.r}-${s.c}`);
      const b=document.getElementById(`sbg-${s.r}-${s.c}`);
      if(!t||!b) return;
      const col=s.a>s.b?"#4FBF7F":s.b>s.a?"#D9543F":"#8A9A91";
      const vacio=(s.a+s.b)===0;
      t.textContent=`${s.a}v${s.b}`;
      t.setAttribute("fill",col); t.setAttribute("opacity",vacio?0:0.5);
      b.setAttribute("fill",col);
      b.setAttribute("opacity",vacio?0:(s.a===s.b?0.05:Math.min(3,Math.abs(s.a-s.b))*0.08));
    });
    const l=document.getElementById("lecturaZonas");
    if(l) l.innerHTML=textoSectores(mio,riv);
  };
  const moverNodo=(g,i)=>{
    const o=mio[i], p=posMiaDe(o,i,tmp.ajustes);
    const cir=g.querySelector("circle"), tx=g.querySelectorAll("text");
    cir.setAttribute("cx",p.x); cir.setAttribute("cy",p.y);
    cir.setAttribute("stroke","#E0A93B");
    tx[0].setAttribute("x",p.x); tx[0].setAttribute("y",p.y+4.5);
    tx[1].setAttribute("x",p.x); tx[1].setAttribute("y",p.y+26);
  };

  svg.querySelectorAll("g.arrastrable").forEach(g=>{
    g.addEventListener("pointerdown",ev=>{
      ev.preventDefault();
      act={i:+g.dataset.i,g};
      g.setPointerCapture(ev.pointerId);
      g.style.cursor="grabbing";
      svg.appendChild(g); // que quede por encima mientras se arrastra
    });
    g.addEventListener("pointermove",ev=>{
      if(!act) return;
      const p=aPizarra(ev);
      const base=ONCE[tmp.f][act.i];
      const nx=clamp(p.x/PIZ.W*100,4,96);
      const ny=clamp((PIZ.H-PIZ.margen-p.y)/PIZ.span*100,0,100);
      tmp.ajustes=tmp.ajustes||{};
      // tope: se puede matizar el sistema, no reinventarlo
      tmp.ajustes[act.i]={dx:clamp(nx-base[1],-30,30),dy:clamp(ny-base[2],-24,24)};
      moverNodo(act.g,act.i);
      refrescarSectores();
    });
    const soltar=ev=>{
      if(!act) return;
      act.g.style.cursor="grab";
      try{act.g.releasePointerCapture(ev.pointerId);}catch(e){}
      act=null;
      pintarPlanteo(); // recién ahora se redibuja todo y se actualizan las barras
    };
    g.addEventListener("pointerup",soltar);
    g.addEventListener("pointercancel",soltar);
  });
}
// texto que acompaña a la grilla, se recalcula en vivo al arrastrar
function textoSectores(mio,riv){
  const cs=conteos(mio,riv,tmp.ajustes);
  const fila=r=>cs.filter(s=>s.r===r);
  const suma=r=>fila(r).reduce((a,s)=>[a[0]+s.a,a[1]+s.b],[0,0]);
  const [ma,mb]=suma(1);
  const [aa,ab]=suma(0);
  const [da,db]=suma(2);
  const t=[];
  t.push(ma>mb?`En el medio ponés ${ma} contra ${mb}: te sobra un hombre para circular por dentro.`
       :ma<mb?`En el medio ponés ${ma} contra ${mb}: te van a superar por adentro.`
       :`En el medio están ${ma} contra ${mb}: se define en los duelos.`);
  t.push(aa>ab?`Arriba atacás ${aa} contra ${ab}: hay un atacante que nadie puede tomar.`
       :aa<ab?`Arriba atacás ${aa} contra ${ab}: te marcan de a uno y les sobra gente.`
       :`Arriba quedan ${aa} contra ${ab}: marca punto por punto.`);
  t.push(da>db?`Atrás quedás ${da} contra ${db}: tenés cobertura de sobra.`
       :da<db?`Atrás quedás ${da} contra ${db}: si te agarran mal parado, quedan mano a mano.`
       :`Atrás quedás ${da} contra ${db}: sin coberturas libres.`);
  // el pasillo central y las bandas, que es lo que cambia al arrastrar
  const cen=cs.find(s=>s.r===1&&s.c===1);
  const izq=cs.find(s=>s.r===1&&s.c===0), der=cs.find(s=>s.r===1&&s.c===2);
  const bandaA=izq.a+der.a, bandaB=izq.b+der.b;
  t.push(`Por el pasillo central quedan ${cen.a} contra ${cen.b}, y por las dos bandas ${bandaA} contra ${bandaB}` +
    (cen.a>cen.b&&bandaA<bandaB ? ": les ganás por dentro pero les regalás los costados."
    : cen.a<cen.b&&bandaA>bandaB ? ": estás ancho pero te comen por el medio."
    : cen.a>cen.b&&bandaA>=bandaB ? ": los estás tapando en todo el ancho del campo."
    : cen.a<cen.b&&bandaA<=bandaB ? ": te están superando en todos lados, algo hay que mover."
    : "."));
  return t.join(" ");
}
// premio o castigo chico por como quedaste parado en los sectores
function ajustePosicional(mio,riv){
  let g=0,p=0;
  conteos(mio,riv,tmp.ajustes).forEach(s=>{ if(s.a>s.b)g++; else if(s.b>s.a)p++; });
  return {mult:1+clamp((g-p)*0.006,-0.03,0.03),gana:g,pierde:p};
}
function resetAjustes(){ tmp.ajustes={}; pintarPlanteo(); }
function pf(x){tmp.f=x;tmp.ajustes={};pintarPlanteo();}
function pe(x){tmp.e=x;pintarPlanteo();}

/* ==========================================================
   EL AZAR DISFRAZADO DE GENIALIDAD
   Cuando el resultado se define por la tirada y no por el planteo,
   la prensa igual te atribuye (o te saca) el mérito. El juego te
   muestra por dentro lo que la prensa no ve: que no la viste venir.
   ========================================================== */
const TITULARES_SUERTE={
 bien:[
  {t:"Qué cambio del entrenador: la vio antes que nadie",
   v:"Entró a los 84 y a los 87 la empujó en un córner. Vos lo pusiste porque no te quedaba otro delantero en el banco."},
  {t:"Le ganó el partido desde la raya",
   v:"El gol salió de un rebote en un tobillo rival. La instrucción que habías gritado era otra."},
  {t:"Otra vez el sello del DT en el segundo tiempo",
   v:"El equipo entró igual que siempre. Lo que cambió fue que esta vez entraron los dos tiros que venían errando."}],
 mal:[
  {t:"El planteo del entrenador no funcionó",
   v:"Generaron once situaciones y no entró ninguna. En el pizarrón habías ganado el partido."},
  {t:"Otra vez sin ideas en el segundo tiempo",
   v:"Tres palos y un gol anulado. El plan estaba bien: la pelota no quiso entrar."},
  {t:"Le faltó carácter al equipo en el momento clave",
   v:"Se lesionaron dos en veinte minutos y jugaste el final con un pibe de la reserva."}]
};
function moralejaSuerte(dioVuelta, gane){
  if(!dioVuelta) return null;
  const lote = gane ? TITULARES_SUERTE.bien : TITULARES_SUERTE.mal;
  return R.el(lote);
}

/* ---------- recorrido de la temporada, fecha a fecha ---------- */
// genera un camino creible desde la mitad de tabla hasta donde terminaste
function recorridoTemporada(posFinal, equipos, fechas){
  const hitos=Math.min(9, Math.max(5, Math.round(fechas/4)));
  const arranque=Math.max(1,Math.min(equipos, Math.round(equipos/2)+R.e(-1,1)));
  const ruta=[arranque];
  for(let i=1;i<hitos-1;i++){
    const t=i/(hitos-1);
    const ideal=arranque+(posFinal-arranque)*t;
    const ruido=R.e(-2,2)*(1-t*0.7);
    ruta.push(clamp(Math.round(ideal+ruido),1,equipos));
  }
  ruta.push(posFinal);
  return ruta;
}
function animarRecorrido(){
  const c=S.calc;
  if(!c.tabla||!c.ruta) return;
  const cont=document.getElementById("recorrido");
  if(!cont) return;
  const eq=c.tabla.equipos, ruta=c.ruta;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i=0;
  const pintar=()=>{
    const hasta=ruta.slice(0,i+1);
    const W=420,H=150,mx=26,my=18;
    const px=k=>mx+(k/(ruta.length-1))*(W-mx*2);
    const py=p=>my+((p-1)/(eq-1))*(H-my*2);
    const linea=hasta.map((p,k)=>`${k?"L":"M"}${px(k)} ${py(p)}`).join(" ");
    const ult=hasta[hasta.length-1];
    cont.innerHTML=`
      <svg viewBox="0 0 ${W} ${H}" class="recorrido-svg" role="img"
        aria-label="Evolución de la posición a lo largo de la temporada">
        <rect width="${W}" height="${H}" fill="#1D2925" rx="4"/>
        <text x="6" y="${py(1)+4}" font-size="10" fill="#8A9A91">1º</text>
        <text x="6" y="${py(eq)+4}" font-size="10" fill="#8A9A91">${eq}º</text>
        <line x1="${mx}" y1="${py(1)}" x2="${W-mx}" y2="${py(1)}" stroke="#33453D" stroke-width="1"/>
        <line x1="${mx}" y1="${py(eq)}" x2="${W-mx}" y2="${py(eq)}" stroke="#33453D" stroke-width="1"/>
        <path d="${linea}" fill="none" stroke="#4FBF7F" stroke-width="2.5"
          stroke-linejoin="round" stroke-linecap="round"/>
        ${hasta.map((p,k)=>`<circle cx="${px(k)}" cy="${py(p)}" r="${k===hasta.length-1?6:3.5}"
          fill="${k===hasta.length-1?"#E0A93B":"#4FBF7F"}"/>`).join("")}
        <text x="${px(hasta.length-1)}" y="${py(ult)-12}" text-anchor="middle"
          font-size="13" font-weight="800" fill="#E0A93B"
          font-family="Big Shoulders Display,sans-serif">${ult}º</text>
      </svg>
      <p class="mini">${i>=ruta.length-1
        ? `Terminaste ${ult}º de ${eq}.`
        : `Fecha ${Math.round((i/(ruta.length-1))*c.tabla.fechas)} de ${c.tabla.fechas}…`}</p>`;
    i++;
    if(i<ruta.length) setTimeout(pintar, reduce?0:520);
  };
  pintar();
}

/* ---------- tabla de la temporada ---------- */
function esCopa(){ return /Copa|Champions|Libertadores|Sudamericana|Mundo|América|Eliminatorias/i.test(S.compe); }
function rondaDe(pts){
  return pts>=10?"Campeón":pts>=7?"Finalista":pts>=4?"Semifinales":pts>=1?"Cuartos de final":"Afuera en la fase de grupos";
}
// arma una tabla creible de la liga con el club en la posicion que le toco
function tablaTemporada(){
  const L=LIGAS[S.club.p];
  const rivales=(L?L.clubes:[]).filter(c=>c.n!==S.club.n);
  const equipos=Math.min(10,rivales.length+1);
  const miPos = S.calc.pts>=10?1 : S.calc.pts>=7?2 : S.calc.pts>=4?R.e(4,6) : S.calc.pts>=1?equipos-2 : equipos;
  const fechas=(equipos-1)*2;
  // puntos coherentes con la posicion
  const puntosDe=pos=>clamp(Math.round(fechas*2.1 - (pos-1)*R.r(2.2,4.4) + R.r(-1,1)),8,fechas*3);
  const otros=R.mz(rivales).slice(0,equipos-1);
  const filas=[];
  let k=0;
  for(let pos=1;pos<=equipos;pos++){
    if(pos===miPos) filas.push({club:S.club,pts:puntosDe(pos),yo:true,pos});
    else filas.push({club:otros[k++],pts:puntosDe(pos),yo:false,pos});
  }
  return {filas,fechas,miPos,equipos};
}
function svgCopa(s){s=s||16;return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M7 3h10v4a5 5 0 0 1-10 0Z" fill="#E0A93B"/><path d="M5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4"
  stroke="#E0A93B" stroke-width="1.6" fill="none"/><path d="M11 12h2v5h-2zM8 19h8v2H8z" fill="#E0A93B"/></svg>`;}

/* ---------- resolución ---------- */
function resolver(attrs,f,e,fr,coh,hin,az,pref){
  const p=PESOS[f];
  const base=(attrs[0]*p[0]+attrs[1]*p[1]+attrs[2]*p[2]+attrs[3]*p[3])/(p[0]+p[1]+p[2]+p[3]);
  const fit=FIT[e][f], mu=MATCHUP[f][fr];
  const aj=base*fit*mu*(pref||1);
  const cc=aj*coh, ch=cc+hin;
  return {base,fit,mu,pref:pref||1,aj,coh,cc,hin,az,final:ch+az,sinAzar:ch};
}
const cohDe=v=>0.90+(v/100)*0.20;
const empDe=v=>(v-50)/50*3;

function jugar(){
  S.formacion=tmp.f; S.estilo=tmp.e; S.usadas.push(tmp.f);
  const once=armarOnce(S.plantel,S.formacion,S.fijos), attrs=atributosDe(once);
  const ap=ajustePosicional(once,S.rival.once);
  S.ajustePos=ap;
  const multPrensa=(S.prensa&&S.prensa.mult)||1;
  const pref=(S.formacion===S.sistemaPref?1.03:0.98)*(S.estilo===S.estiloPref?1.02:0.99)*ap.mult*multPrensa;
  const mio=resolver(attrs,S.formacion,S.estilo,S.rival.formacion,cohDe(S.vars.ves),empDe(S.vars.hin),R.r(-TOPE_AZAR,TOPE_AZAR),pref);
  const riv=resolver(S.rival.attrs,S.rival.formacion,S.rival.estilo,S.formacion,1,0,R.r(-TOPE_AZAR,TOPE_AZAR),1);
  const dif=mio.final-riv.final, dsa=mio.sinAzar-riv.sinAzar;
  // cuanto mas arriba estas, mas cuesta salir campeon
  const ex = S.esSeleccion?3 : S.division*1.2 + (S.club.niv-3)*0.8;
  let pos,pts,dRes,dDir,dHin,sube=false;
  if(dif>=12+ex){pos="Campeón";pts=10;dRes=16;dDir=14;dHin=18;sube=true;}
  else if(dif>=5+ex*0.6){pos="Subcampeón";pts=7;dRes=9;dDir=8;dHin=9;sube=S.division<3;}
  else if(dif>=-2){pos="Mitad de tabla";pts=4;dRes=1;dDir=0;dHin=-1;}
  else if(dif>=-10){pos="Zona baja";pts=1;dRes=-9;dDir=-11;dHin=-12;}
  else {pos="Pelea el descenso";pts=0;dRes=-17;dDir=-20;dHin=-19;}
  S.vars.res=clamp(S.vars.res+dRes,0,100);
  S.vars.dir=clamp(S.vars.dir+dDir,0,100);
  S.vars.hin=clamp(S.vars.hin+dHin,0,100);
  S.puntos+=pts;
  const golesA=Math.max(0,Math.round(1.4+dif/9+R.r(0,1))), golesB=Math.max(0,Math.round(1.4-dif/9+R.r(0,1)));
  S.calc={mio,riv,dif,dsa,pos,pts,dRes,dDir,dHin,sube,golesA,golesB,attrs};
  // ¿el azar dio vuelta lo que decía el planteo?
  const leDioVuelta = Math.sign(dsa)!==Math.sign(dif) && Math.abs(dsa)>1.5;
  S.calc.moraleja = moralejaSuerte(leDioVuelta, dif>0);
  if(leDioVuelta) S.suertes=(S.suertes||0)+(dif>0?1:-1);
  S.calc.tabla = esCopa()?null:tablaTemporada();
  if(S.calc.tabla) S.calc.ruta = recorridoTemporada(S.calc.tabla.miPos, S.calc.tabla.equipos, S.calc.tabla.fechas);
  if(pos==="Campeón") S.titulos.push({t:S.temporada,comp:S.compe,club:S.club.n});
  S.hist.push({t:S.temporada,club:S.club.n,div:S.esSeleccion?"Selección":DIVISIONES[S.division].n,comp:S.compe,f:S.formacion,riv:S.rival.formacion,pos,pts});
  pintarResolucion(); ir("resolucion"); animarRecorrido();
}
function pintarResolucion(){
  const c=S.calc,m=c.mio,r=c.riv;
  const parejo=Math.abs(c.dsa)<=TOPE_AZAR*2;
  const dioVuelta=Math.sign(c.dsa)!==Math.sign(c.dif);
  $("#s-resolucion").innerHTML=`
    <h2 class="disp">Temporada ${S.temporada}</h2>
    <div class="resultado ${c.pts>=7?'bien':c.pts<=1?'mal':''}">
      <div class="mini" style="margin-bottom:8px">${S.compe}</div>
      <div class="enfrenta">
        <div class="eq">${escudo(S.club,42)}<div>${S.club.n}</div><div class="sis">${S.formacion}</div></div>
        <div class="marc">${c.golesA} — ${c.golesB}</div>
        <div class="eq">${escudo(S.rival.n,42)}<div>${S.rival.n.n}</div><div class="sis">${S.rival.formacion}</div></div>
      </div>
      <div class="mini" style="margin-bottom:4px">${esCopa()?"Partido decisivo del torneo":"El clásico de la temporada"}</div>
      <b>${c.pos==="Campeón"?copaSVG(28)+" ":""}${esCopa()?rondaDe(c.pts):tCierre(c.pos)}</b>
      <span>${esCopa()?"Así te fue en el torneo"
        :`Terminaste ${c.tabla?c.tabla.miPos+"º de "+c.tabla.equipos:""} en la tabla`}</span>
    </div>
    ${c.tabla?`
    <h3 class="disp">${T("comoFue")}</h3>
    <div id="recorrido" class="recorrido"></div>
    <h3 class="disp">${T("comoQuedoTabla")}</h3>
    <p class="mini">${S.compe} · ${c.tabla.fechas} fechas. El partido de arriba es el que definió tu año,
    pero la posición sale de toda la temporada.</p>
    <table class="tabla-pos"><tr><th>#</th><th>Club</th><th style="text-align:right">Pts</th></tr>
    ${c.tabla.filas.map(f=>`<tr class="${f.yo?'yo':''}">
      <td>${f.pos}</td>
      <td>${escudo(f.club,18)} ${f.club.n}${f.pos===1?" "+copaSVG(14):""}</td>
      <td style="text-align:right"><b>${f.pts}</b></td></tr>`).join("")}
    </table>`:""}
    ${c.moraleja?`<div class="moraleja">
      <div class="titular">“${c.moraleja.t}”</div>
      <div class="verdad"><b>Lo que pasó de verdad:</b> ${c.moraleja.v}</div>
      <div class="cierre">El resultado de una decisión no prueba que la decisión haya sido buena.</div>
    </div>`:""}
    <p class="mini">${parejo?(dioVuelta?"Estaban parejos y se dio vuelta en el final. Con esa diferencia, podía pasar."
      :"Estaban parejos, pero la lectura aguantó."):"La diferencia la hizo el planteo, no la suerte."}</p>
    <div class="deltas">
      <span class="d ${cd(c.dRes)}">Resultados ${sg(c.dRes)}</span>
      <span class="d ${cd(c.dDir)}">Directiva ${sg(c.dDir)}</span>
      <span class="d ${cd(c.dHin)}">Hinchada ${sg(c.dHin)}</span></div>
    <details><summary>${T("verCalculo")}</summary>
      <div class="ln"><span>Nivel del once con ${S.formacion}</span><b>${m.base.toFixed(1)}</b></div>
      <div class="ln"><span>Fit del modelo con el sistema (${tFit(m.fit)})</span><b>×${m.fit.toFixed(2)}</b></div>
      <div class="ln"><span>Cruce contra su ${S.rival.formacion}</span><b>×${m.mu.toFixed(2)}</b></div>
      <div class="ln"><span>Tu sistema y modelo de cabecera, más cómo los paraste</span><b>×${m.pref.toFixed(3)}</b></div>
      ${S.prensa&&S.prensa.mult!==1?`<div class="ln"><span>Tu política con la prensa (${S.prensa.n})</span><b>×${S.prensa.mult.toFixed(3)}</b></div>`:""}
      <div class="ln"><span>Sectores ganados / perdidos en la pizarra</span><b>${S.ajustePos?S.ajustePos.gana+" / "+S.ajustePos.pierde:"—"}</b></div>
      <div class="ln"><span>Cohesión del vestuario</span><b>×${m.coh.toFixed(2)}</b></div>
      <div class="ln"><span>Empuje de la tribuna</span><b>${m.hin>=0?"+":""}${m.hin.toFixed(1)}</b></div>
      <div class="ln"><span>Azar (tope ±${TOPE_AZAR})</span><b>${m.az>=0?"+":""}${m.az.toFixed(1)}</b></div>
      <div class="ln"><span>Tu puntaje</span><b style="color:var(--verde)">${m.final.toFixed(1)}</b></div>
      <div class="ln"><span>El de ellos</span><b>${r.final.toFixed(1)}</b></div>
    </details>
    <div class="acciones"><button class="btn" onclick="cerrarTemporada()">${T("cerrarTemporada")}</button></div>`;
}

/* ---------- cierre de temporada, crecimiento del club ---------- */
function cerrarTemporada(){
  const umbral=S.arq.id==="ganador"?26:S.arq.id==="bombero"?12:18;
  const eventos=[];
  // juveniles del formador
  if(S.arq.id==="formador") S.plantel.filter(j=>j.ed<=23).forEach(j=>{j.rt=clamp(j.rt+4,28,94);});
  S.plantel.forEach(j=>{j.ed++; if(j.ed>31) j.rt=clamp(j.rt-2,28,94);});
  // ascenso de categoría
  let ascendio=false;
  if(S.division<3&&!S.esSeleccion){
    const salto = S.calc.pos==="Campeón" ? (S.calc.dif>=22?3:2) : S.calc.pos==="Subcampeón" ? 1 : 0;
    if(salto>0){
      const antes=S.division;
      S.division=Math.min(3,S.division+salto);
      ascendio=S.division>antes;
      if(ascendio){ S.ascensos=(S.ascensos||0)+1; eventos.push(`Te suben a ${tDiv(DIVISIONES[S.division].n)} de ${S.club.n}.`); }
    }
  }
  // crecimiento del club
  if(S.vars.hin>70&&S.estadio<5&&S.calc.pts>=7){S.estadio++;eventos.push(`El club amplía el estadio (nivel ${S.estadio}).`);}
  const ingreso=10+Math.round(S.vars.res/6)+S.estadio*3+(S.division===3?8:0);
  S.presupuesto=clamp(S.presupuesto+ingreso,0,120);
  eventos.push(`Entran ${ingreso} de presupuesto por temporada y taquilla.`);
  // despido
  let despedido=false;
  if(S.vars.dir<umbral&&S.temporada<tempTotal()){
    despedido=true; S.despidos++;
    S.exClub=S.club;
    S.hist.push({t:S.temporada,club:S.club.n,div:"—",f:"",riv:"",pos:"Te echaron",pts:0});
    const chico=R.el(CLUBES.filter(c=>c.niv<=2));
    S.club=chico; S.division=3; S.estadio=1; S.idoloPreguntado=false;
    S.plantel=generarPlantel(nivelBaseDe(chico.niv,3),3,null,chico.p);
    S.presupuesto=20; S.vars.dir=46; S.vars.hin=44;
  }
  // ascenso de categoria -> pantalla de subir juveniles
  if(ascendio&&S.temporada<tempTotal()){ pantallaAscenso(); return; }
  // oferta de seleccion: buen recorrido, en primera, no siendo ya seleccionador
  if(!despedido&&!S.esSeleccion&&S.division===3&&S.temporada>=4&&S.temporada<tempTotal()
     &&S.titulos.length>=2&&S.puntos>=S.temporada*8&&S.club.niv>=4&&!S.ofertaSel){
    S.ofertaSel=true;
    const sel=SELECCIONES.find(s=>s.n===S.club.p)||R.el(SELECCIONES);
    pantallaSeleccion(sel); return;
  }
  // te vienen a buscar
  if(!despedido&&!S.esSeleccion&&S.temporada<tempTotal()&&S.calc.pts>=7&&S.vars.hin>50){
    const mejores=CLUBES.filter(c=>c.n!==S.club.n&&c.niv>=Math.min(5,S.club.niv+1));
    const sueño = S.clubHincha && S.clubHincha.n!==S.club.n && S.titulos.length>=1 ? S.clubHincha : null;
    const cand = sueño && S.rng()<0.5 ? sueño : (mejores.length?R.el(mejores):null);
    if(cand && !S.ofertaHecha){
      S.ofertaHecha=true;
      pantallaOferta(cand, cand===sueño); return;
    }
  }
  S.ofertaHecha=false;
  // favor al ex club
  let favor=null;
  if(!despedido&&!S.esSeleccion&&S.exClub&&S.presupuesto>45&&S.temporada<tempTotal()){
    favor=S.exClub;
  }
  $("#s-club").innerHTML=`
    <h2 class="disp">${despedido?"Te echaron":"Cierre de temporada"}</h2>
    ${despedido?`<p>La directiva no te bancó más. Te agarra ${S.club.n}, en Primera,
      con menos plantel y menos plata. Seguís dirigiendo.</p>
      <div style="display:flex;gap:12px;align-items:center;margin:14px 0">${escudo(S.club,44)}
      <div><b style="font-family:'Big Shoulders Display';font-weight:800;font-size:24px">${S.club.n}</b>
      <div class="mini">${S.club.p} · Primera</div></div></div>`
    :`<ul style="margin:12px 0 12px 18px">${eventos.map(e=>`<li style="margin-bottom:5px">${e}</li>`).join("")}</ul>`}
    ${favor?`
      <h3 class="disp">Te llaman de ${favor.n}</h3>
      <div class="ficha-sit"><div class="cat">Tu ex club</div>
      <p>${favor.n} está corto de plata. Te ofrecen un jugador que en el mercado vale la mitad
      de lo que te piden. Comprarlo es ayudarlos.</p></div>
      <button class="card" onclick="ayudarExClub(true)"><b style="font-size:17px">Se lo comprás igual</b>
        <div class="sub">Pagás 30 de más de lo que vale. Te lo van a recordar.</div></button>
      <button class="card" onclick="ayudarExClub(false)"><b style="font-size:17px">No es tu problema</b>
        <div class="sub">Cuidás el presupuesto de tu club actual.</div></button>`
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
    <h2 class="disp">Subís de categoría</h2>
    <p>Pasás a <b>${tDiv(DIVISIONES[S.division].n)}</b> de ${S.club.n}. El plantel de arriba es otro,
    pero podés llevarte hasta dos pibes tuyos. Los que suben ganan 3 de nivel por el salto.</p>
    ${cand.map((j,i)=>`
      <button class="card ${tmp.suben.includes(i)?'sel':''}"
        ${tmp.suben.length>=2&&!tmp.suben.includes(i)?'disabled':''} onclick="marcarSube(${i})">
        <b style="font-size:17px">${j.nom}</b>
        <div class="sub">${tGrupo(j.g)} · ${j.ed} años · nivel ${j.rt}</div>
      </button>`).join("")}
    <p class="mini">Elegidos: ${tmp.suben.length} de 2</p>
    <div class="acciones"><button class="btn" onclick="confirmarAscenso()">Subir al plantel</button></div>`;
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
  $("#s-club").innerHTML=`
    <h2 class="disp">${esSueño?"Te llama tu club":"Te vienen a buscar"}</h2>
    <div style="display:flex;gap:12px;align-items:center;margin:12px 0">${escudo(club,46)}
      <div><b style="font-family:'Big Shoulders Display';font-weight:800;font-size:26px">${club.n}</b>
      <div class="mini">${club.p} · ${LIGAS[club.p].liga} · plantel nivel ${club.niv}/5</div></div></div>
    <p>${esSueño?`Es el club del que sos hincha. Te ofrecen el banco. No hay muchas veces en la vida que
      pase esto, y nadie te garantiza que vuelva a pasar.`
      :`Ganaste y se dieron cuenta. Te ofrecen un plantel mejor que el que tenés, con la exigencia que eso implica.`}</p>
    <p class="mini">En ${S.club.n} venís con ${S.titulos.length} título${S.titulos.length===1?"":"s"}
      y la hinchada en ${Math.round(S.vars.hin)}.</p>
    <button class="card" onclick="aceptarOferta(true)"><b style="font-size:17px">Te vas a ${club.n}</b>
      <div class="sub">Plantel nuevo, otra exigencia. ${esSueño?"Cumplís el sueño.":"Empezás de cero con ellos."}</div></button>
    <button class="card" onclick="aceptarOferta(false)"><b style="font-size:17px">Te quedás donde estás</b>
      <div class="sub">La directiva y el vestuario te lo agradecen. La oferta puede no volver.</div></button>`;
  ir("club");
}
function aceptarOferta(si){
  if(si){
    S.exClub=S.club; S.club=window.__of; S.division=3; S.esSeleccion=false;
    S.plantel=generarPlantel(nivelBaseDe(S.club.niv,3),3,null,S.club.p); S.fijos=[];
    S.presupuesto=clamp(18+S.club.niv*8,10,100);
    S.vars.dir=52; S.vars.hin=S.clubHincha&&S.club.n===S.clubHincha.n?68:48; S.estadio=Math.max(1,S.club.niv-1);
    S.hist.push({t:S.temporada,club:S.club.n,div:"Primera",comp:"Asumís el cargo",f:"",riv:"",pos:"Nuevo club",pts:0});
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
    <h2 class="disp">Te llama una selección</h2>
    <div style="display:flex;gap:12px;align-items:center;margin:12px 0">${escudo(sel,44)}
      <div><b style="font-family:'Big Shoulders Display';font-weight:800;font-size:24px">Selección de ${sel.n}</b>
      <div class="mini">Te ofrecen el banco hasta el final del ciclo</div></div></div>
    <p>En la selección no se ficha: se convoca. No hay mercado ni presupuesto, sólo los jugadores
    que tenés y cómo los parás. Si aceptás, dejás ${S.club.n}.</p>
    <button class="card" onclick="tomarSeleccion(true)"><b style="font-size:17px">Aceptás el cargo</b>
      <div class="sub">Vas a Eliminatorias, Copa América y Mundial. Es la vidriera más grande.</div></button>
    <button class="card" onclick="tomarSeleccion(false)"><b style="font-size:17px">Seguís en el club</b>
      <div class="sub">Terminás lo que empezaste. La directiva y la hinchada te lo agradecen.</div></button>`;
  window.__sel=sel;
  ir("club");
}
function tomarSeleccion(si){
  if(si){
    const sel=window.__sel;
    S.exClub=S.club; S.club=sel; S.esSeleccion=true; S.division=3;
    S.plantel=generarPlantel(nivelBaseDe(sel.niv,3)+8,3,null,sel.p);
    S.presupuesto=0; S.vars.dir=58; S.vars.hin=52;
    S.hist.push({t:S.temporada,club:"Selección de "+sel.n,div:"Selección",f:"",riv:"",pos:"Asumís",pts:0});
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
  const ejes=[["res","El Resultadista"],["dir","El Político"],["hin","El Ídolo de la Tribuna"],["ves","El Padre del Grupo"]];
  let mej=ejes[0],mx=-99; ejes.forEach(([k,n])=>{const v=sum(k);if(v>mx){mx=v;mej=[k,n];}});
  let base=mx<=0?"El Superviviente":mej[1];
  const u=new Set(S.usadas);
  let suf = u.size===1?"Dogmático" : u.size>=4?"Camaleón" : S.despidos>0?"Trotamundos" : S.puntos>=40?"Ganador Serial":"";
  return suf?`${base}, el ${suf}`:base;
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
      <div class="mini">${S.nombre} · ${score} de 100</div>
      <hr>
      <div class="fila"><span>Puntos de carrera</span><span>${S.puntos} de ${tempTotal()*10}</span></div>
      <div class="fila"><span>Títulos</span><span>${tit?Array(tit).fill(copaSVG(15)).join(" "):"—"} ${tit}</span></div>
      <div class="fila"><span>Terminó en</span><span>${S.club.n}, ${tDiv(DIVISIONES[S.division].n)}</span></div>
      <div class="fila"><span>Estadio</span><span>nivel ${S.estadio} de 5</span></div>
      <div class="fila"><span>Veces que te echaron</span><span>${S.despidos}</span></div>
      ${S.etiqueta?`<div class="fila"><span>Te decían</span><span>${tEtiq(S.etiqueta,"n")}</span></div>`:""}
      ${S.duelo?`<hr><div class="fila"><span>Código del duelo</span><span class="codigo-txt">${S.duelo}</span></div>
      <div class="fila"><span>Modo</span><span>${S.modo?S.modo.n:"Normal"}</span></div>`:""}
      <hr>
      <div class="fila"><span>Directiva</span><span>${Math.round(S.vars.dir)}</span></div>
      <div class="fila"><span>Hinchada</span><span>${Math.round(S.vars.hin)}</span></div>
      <div class="fila"><span>Vestuario</span><span>${Math.round(S.vars.ves)}</span></div>
    </div>
    ${S.titulos.length?`<h3 class="disp">Lo que ganaste</h3>
      <table>${S.titulos.map(t=>`<tr><td style="width:26px">${copaSVG(18)}</td>
        <td>${t.comp}</td><td>${t.club}</td><td>T${t.t}</td></tr>`).join("")}</table>`:""}
    ${(()=>{const rs=recordsLogrados(S);const rotos=rs.filter(r=>r.roto);
      return `<h3 class="disp">${T("records")}</h3>
      ${rotos.length?`<p class="mini">Rompiste ${rotos.length} marca${rotos.length>1?"s":""} histórica${rotos.length>1?"s":""}.</p>`:""}
      <table><tr><th>Marca</th><th style="text-align:right">Récord</th><th style="text-align:right">Vos</th></tr>
      ${rs.map(r=>`<tr class="${r.roto?'record-roto':''}">
        <td>${r.roto?copaSVG(14)+" ":""}${tRecord(r)}<div class="mini">${r.duenio}</div></td>
        <td style="text-align:right">${r.marca}</td>
        <td style="text-align:right"><b>${r.valor}</b></td></tr>`).join("")}</table>`;})()}

    <h3 class="disp">${T("trayectoria")}</h3>
    <table><tr><th>T</th><th>Club</th><th>Competencia</th><th>Sistema</th><th>Cierre</th></tr>
    ${S.hist.map(h=>`<tr><td>${h.t}</td><td>${h.club}</td><td>${h.comp||h.div}</td><td>${h.f||"—"}</td><td>${h.pos}</td></tr>`).join("")}</table>
    <details><summary>Cómo se calculó todo esto</summary>
      <p class="mini" style="margin-top:8px">Cada temporada se resolvió con tres capas: cuánto potencia tu sistema
      a los cuatro atributos de tu once, cuán compatible es tu modelo de juego con ese sistema, y qué le ganás
      o le perdés al sistema del rival. Encima van la cohesión del vestuario, el empuje de la tribuna y un azar
      acotado a ±${TOPE_AZAR} puntos: nunca alcanza para dar vuelta una diferencia grande de planteo.</p></details>
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
portada();
