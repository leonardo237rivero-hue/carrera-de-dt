// Carrera de DT — escudos, canchas, barras y cabecera
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   ESCUDO GENERADO (no usa escudos reales, sólo colores)
   ========================================================== */
// Poné los PNG en la carpeta "escudos/". Si falta el archivo, cae al escudo generado.
const USAR_ESCUDOS_REALES = true;
function slugClub(n){
  return n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function escudo(club,size){
  const s=size||34;
  if(USAR_ESCUDOS_REALES){
        return `<span class="escudo" style="display:inline-flex;width:${s}px;height:${s*1.14}px;align-items:center">
      <img src="escudos/${club.sel?"seleccion-":""}${slugClub(club.n)}.png" alt="${club.n}" width="${s}" height="${s*1.14}"
        style="object-fit:contain" onerror="this.outerHTML=escudoSVG(${JSON.stringify({n:club.n,c:club.c}).replace(/"/g,'&quot;')},${s})">
    </span>`;
  }
  return escudoSVG(JSON.stringify(club),s);
}
function escudoSVG(clubJson,size){
  const club=typeof clubJson==="string"?JSON.parse(clubJson):clubJson;
  const s=size||34, [c1,c2]=club.c;
  const ini=club.n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const oscuro = parseInt(c1.slice(1,3),16)*0.299+parseInt(c1.slice(3,5),16)*0.587+parseInt(c1.slice(5,7),16)*0.114 < 140;
  return `<svg class="escudo" width="${s}" height="${s*1.14}" viewBox="0 0 40 46" aria-hidden="true">
    <path d="M2 2h36v26c0 9-9 14-18 16C11 42 2 37 2 28Z" fill="${c1}" stroke="${c2}" stroke-width="2.5"/>
    <path d="M20 2v42" stroke="${c2}" stroke-width="2.5" opacity=".55"/>
    <text x="20" y="26" text-anchor="middle" font-family="Archivo,sans-serif" font-stretch="62%" font-weight="800"
      font-size="17" fill="${oscuro?'#FFF':'#111'}">${ini}</text></svg>`;
}

/* ==========================================================
   CANCHITA
   ========================================================== */
function cancha(once,opts){
  opts=opts||{};
  const alto=opts.alto||300, ancho=opts.ancho||420;
  const col=opts.color||"#A6F03C", inv=opts.invertir;
  const pts=once.map(o=>{
    const px=(o.x/100)*ancho;
    const py=inv ? (o.y/100)*alto : alto-(o.y/100)*alto;
    const r=opts.rMin||15;
    const etiqueta = opts.mostrarRating!==false ? o.rt : "";
    const alerta = o.fuera?`<circle cx="${px}" cy="${py}" r="${r+3}" fill="none" stroke="#F2B33D" stroke-width="2"/>`:"";
    return `${alerta}<circle cx="${px}" cy="${py+2.5}" r="${r}" fill="rgba(0,0,0,.35)"/><circle cx="${px}" cy="${py}" r="${r}" fill="${col}"/>
      <text x="${px}" y="${py+5}" text-anchor="middle" class="pos-chip" font-size="14" fill="${opts.txt||'#0D1613'}">${etiqueta}</text>
      ${opts.mostrarNombre?`<text x="${px}" y="${py+r+12}" text-anchor="middle" font-size="9.5" fill="#CFDAD3">${(o.jug.nom||"").split(" ").pop()}</text>`:""}`;
  }).join("");
  return `<svg class="cancha" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Disposición del equipo en la cancha">
    <rect width="${ancho}" height="${alto}" fill="#0D1F15"/>
    ${[0,1,2,3,4,5].map(i=>`<rect y="${i*alto/6}" width="${ancho}" height="${alto/12}" fill="#11281B"/>`).join("")}
    <rect x="6" y="6" width="${ancho-12}" height="${alto-12}" fill="none" stroke="rgba(222,255,210,.22)" stroke-width="1.5"/>
    <line x1="6" y1="${alto/2}" x2="${ancho-6}" y2="${alto/2}" stroke="rgba(222,255,210,.22)" stroke-width="1.5"/>
    <circle cx="${ancho/2}" cy="${alto/2}" r="34" fill="none" stroke="rgba(222,255,210,.22)" stroke-width="1.5"/>
    <rect x="${ancho/2-58}" y="${inv?6:alto-46}" width="116" height="40" fill="none" stroke="rgba(222,255,210,.22)" stroke-width="1.5"/>
    ${pts}</svg>`;
}

/* ==========================================================
   BARRAS DE ATRIBUTOS
   ========================================================== */
function barras(attrs,previos){
  return `<div class="attrs">${ATRIBUTOS.map((n,i)=>{
    const v=attrs[i], d=previos?v-previos[i]:0;
    return `<div class="attr"><div class="l"><span>${n}</span>
      <span><b>${v}</b>${d?` <span class="delta ${d<0?'n':''}">${sg(d)}</span>`:""}</span></div>
      <div class="bar"><i class="${v<45?'baja':''}" style="width:${clamp(v,0,100)}%"></i></div></div>`;
  }).join("")}</div>`;
}

/* ==========================================================
   CABECERA
   ========================================================== */
function cabecera(){
  const c=$("#cab");
  if(["portada","identidad","idea","duelo","ofertas"].includes(S.pant)){c.hidden=true;return;}
  c.hidden=false;
  if(!S.club){c.innerHTML="";return;}
  const med=(v,n,max)=>{
    const pc=clamp(v/(max||100)*100,0,100);
    const col=pc<25?"var(--rojo)":pc<50?"var(--ambar)":"var(--verde)";
    return `<div class="hstat"><b>${Math.round(v)}</b><span>${n}</span>
      <div class="hbar"><i style="width:${pc}%;background:${col}"></i></div></div>`;};
  c.innerHTML=`<div class="hrow">${escudo(S.club,30)}
    <div class="hinfo"><b>${S.club.n}</b>${S.etiqueta?`<div class="hetiq">${tEtiq(S.etiqueta,"n")}</div>`:""}<span>${S.esSeleccion?t3("Selección","Seleção","National team"):tDiv(DIVISIONES[S.division].n)}${S.compe?" · "+S.compe:""} · T${Math.min(S.temporada,tempTotal())}/${tempTotal()}</span></div></div>
    <div class="hstats">
      ${med(S.vars.dir,T("directiva"))}${med(S.vars.hin,T("hinchada"))}
      ${med(S.vars.ves,T("vestuario"))}${S.esSeleccion?"":med(S.presupuesto,T("plata"),120)}
    </div>`;
}
function ir(p){S.pant=p;document.querySelectorAll("section").forEach(x=>x.classList.remove("on"));
  $("#s-"+p).classList.add("on");cabecera();window.scrollTo({top:0,behavior:"instant"});}

/* ==========================================================
   PANEL DE PLANTEL — se puede abrir desde cualquier pantalla
   Resuelve el reclamo repetido: "no me acuerdo qué jugadores tengo"
   ========================================================== */
const PUESTO_LARGO={POR:"Arquero",DEF:"Defensa",MED:"Mediocampo",ATA:"Ataque"};
// nomenclatura unificada: el rol del slot manda, y si no hay slot se usa la zona
function nombrePuesto(jug, rolSlot){
  return rolSlot ? ROL[rolSlot].n : PUESTO_LARGO[jug.g];
}
function panelPlantel(){
  const f=S.formacion||S.sistemaPref;
  if(!f||!S.plantel||!S.plantel.length) return "";
  const once=typeof onceTemporada==="function"?onceTemporada(S.plantel,f,S.fijos||[]):armarOnce(S.plantel,f,S.fijos||[]);
  const enOnce=new Set(once.map(o=>o.jug));
  const banco=S.plantel.filter(j=>!enOnce.has(j)).sort((a,b)=>b.rt-a.rt);
  const a=atributosDe(once);
  const fc=S.club?fichaColores(S.club):null;
  return `<details class="panel-plantel">
    <summary>${T("verPlantel")} — ${f} · ${ATRIBUTOS.map((n,i)=>n[0]+a[i]).join(" ")}</summary>
    <div class="pp-cuerpo">
      ${cancha(once,{mostrarNombre:true,alto:280,ancho:400,color:fc?fc.fill:undefined,txt:fc?fc.txt:undefined})}
      <h4 class="disp" style="font-size:16px;margin:12px 0 4px">${T("banco")}</h4>
      <table><tr><th>${T("puesto")}</th><th>${T("jugador")}</th><th style="text-align:right">${T("nivel")}</th></tr>
      ${banco.map(j=>`<tr><td>${tGrupo(j.g)}</td><td>${j.nom}${j.nuevo?` <em class="nuevo">${t3("NUEVO","NOVO","NEW")}</em>`:""} · ${j.ed} ${T("anios")}</td>
        <td style="text-align:right">${j.rt}</td></tr>`).join("")}</table>
    </div></details>`;
}

/* ==========================================================
   TABLERO — el estado general del ciclo, siempre a mano
   Responde al reclamo del playtest: "los datos están, pero
   repartidos por todos lados y no los encuentro cuando los necesito".
   ========================================================== */
function tablero(){
  if(!S.club) return "";
  const f=S.formacion||S.sistemaPref;
  const once=typeof onceTemporada==="function"?onceTemporada(S.plantel,f,S.fijos||[]):armarOnce(S.plantel,f,S.fijos||[]);
  const a=atributosDe(once);
  const fuera=once.filter(o=>o.fuera).length;
  const edades=once.map(o=>o.jug.ed);
  const edadProm=Math.round(edades.reduce((x,y)=>x+y,0)/edades.length);
  const nivelOnce=Math.round(once.reduce((x,o)=>x+o.rt,0)/once.length);
  const umbral=S.arq.id==="ganador"?26:S.arq.id==="bombero"?12:18;
  const riesgo=S.vars.dir-umbral;
  const objetivo = S.esSeleccion ? t3("Llegar lejos","Ir longe","Go deep") : S.division<3 ? t3("Subir de categoría","Subir de categoria","Win promotion")
    : S.club.niv>=5 ? t3("Salir campeón","Ser campeão","Win the title") : S.club.niv>=3 ? t3("Pelear arriba","Brigar lá em cima","Challenge at the top") : t3("Mantener la categoría","Manter a categoria","Avoid the drop");
  return `<details class="tablero">
    <summary>${T("tablero")}</summary>
    <div class="tab-cuerpo">
      <div class="tab-grid">
        <div><span>${T("objetivo")}</span><b>${objetivo}</b></div>
        <div><span>${T("onceTitular")}</span><b>${nivelOnce}</b></div>
        <div><span>${T("edadProm")}</span><b>${edadProm}</b></div>
        <div><span>${T("plantelN")}</span><b>${S.plantel.length}</b></div>
        <div><span>${T("estadio")}</span><b>${S.estadio}/5</b></div>
        <div><span>${T("titulos")}</span><b>${S.titulos.length} ${S.titulos.slice(-4).map(t=>trofeo(t.tipo||"liga",15)).join("")}</b></div>
      </div>
      ${barras(a)}
      <div class="tab-alertas">
        ${riesgo<8?`<div class="alerta mal">${t3(`La directiva está a ${Math.max(0,Math.round(riesgo))} puntos de echarte.`,`A diretoria está a ${Math.max(0,Math.round(riesgo))} pontos de te demitir.`,`The board is ${Math.max(0,Math.round(riesgo))} points from sacking you.`)}</div>`:""}
        ${S.vars.ves<35?`<div class="alerta mal">${t3("El vestuario está roto: te castiga el rendimiento.","O vestiário está rachado: o rendimento cai.","The dressing room is broken: performance suffers.")}</div>`:""}
        ${S.vars.hin<30?`<div class="alerta mal">${t3("La tribuna te soltó la mano.","A torcida te abandonou.","The crowd has turned on you.")}</div>`:""}
        ${fuera?`<div class="alerta">${fuera} ${t3("fuera de puesto con","fora de posição com","out of position with")} ${f}.</div>`:""}
        ${S.presupuesto<10?`<div class="alerta">${t3("Casi sin presupuesto para el próximo mercado.","Quase sem orçamento para o próximo mercado.","Almost no budget for the next window.")}</div>`:""}
        ${edadProm>30?`<div class="alerta">${t3("Plantel viejo: van a empezar a bajar de nivel.","Elenco velho: vão começar a cair de nível.","Ageing squad: levels will start to drop.")}</div>`:""}
        ${riesgo>=8&&S.vars.ves>=35&&S.vars.hin>=30&&!fuera?`<div class="alerta ok">${T("todoEnOrden")}.</div>`:""}
      </div>
      ${S.etiqueta?`<p class="mini">${t3("Te dicen","Te chamam","They call you")} <b style="color:var(--ambar)">${tEtiq(S.etiqueta,"n")}</b>. ${tEtiq(S.etiqueta,"desc")}</p>`:""}
    </div></details>`;
}

