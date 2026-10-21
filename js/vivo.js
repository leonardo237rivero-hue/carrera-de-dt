// Carrera de DT — PARTIDOS GRANDES EN VIVO
// Copas y clásicos no se pasan de largo: hay previa (se viene, su figura, por dónde lastiman,
// dónde le ganás y qué querés cargar), el partido minuto a minuto leído por las 18 zonas
// y un entretiempo para corregir lo que no se está dando.

/* ---------- ¿es un partido grande mío? ---------- */
function partidoGrande(jor){
  const TT=S.temp;
  if(jor.t==="copa"){
    const C=TT.copa; if(!C||C.eliminado) return null;
    const v=C.vivos, k=v.indexOf(0); if(k<0) return null;
    const par=k%2?k-1:k+1; if(v[par]==null) return null;
    const soyA=k%2===0;
    return {tipo:"copa",rival:C.equipos[v[par]],soyA,neutral:v.length===2,knock:true,
      titulo:`${C.nombre} · ${nombreRonda(v.length)}`};
  }
  const p=jor.partidos.find(x=>x.a===0||x.b===0); if(!p) return null;
  const riv=TT.equipos[p.a===0?p.b:p.a];
  if(!riv.clasico) return null;
  return {tipo:"clasico",rival:riv,soyA:p.a===0,neutral:false,knock:false,
    titulo:`${tituloJornada(jor).replace(/<[^>]+>/g,"").trim()} · ${t3("Clásico","Clássico","Derby")}`};
}

/* ---------- la previa ---------- */
function espejoZona(z){ const f=Math.ceil(z/3), c=(z-1)%3; return zonaNum(2-c,7-f); }
function abrirPrevia(jor,info){
  tmp.vivo={jor,info,enf:{rival:info.rival.club.n,cargar:[],cerrar:[]},sel:null};
  S.enfasis=null;
  const yo=miEquipo(info.rival); tmp.vivo.an0=yo.an;
  pintarPrevia(); ir("partido");
}
function figuraDe(eq){ return (eq.once||[]).slice().sort((a,b)=>b.rt-a.rt)[0]; }
function razones(p){ return p.r.map(x=>L(x)).join(" · "); }
function semaforo(v){ return v>0.18?"ok":v<-0.05?"mal":"med"; }
function pintarPrevia(){
  const V=tmp.vivo, info=V.info, rv=info.rival, an=V.an0, fig=figuraDe(rv);
  const misTop=an.mis.slice(0,3), susTop=an.sus.slice(0,2);
  const calorMio=calorZonas(an.mis.slice(0,4));
  const calorSuyo=Array(19).fill(0); calorZonas(an.sus.slice(0,4)).forEach((v,z)=>{ if(z) calorSuyo[espejoZona(z)]=v; });
  const ops=[
    ...misTop.slice(0,2).map(p=>({k:"c:"+p.id,t:t3("Cargar","Carregar","Load")+": "+L(p.p.n),d:razones(p),v:p.v})),
    ...susTop.slice(0,1).map(p=>({k:"x:"+p.id,t:t3("Cerrar","Fechar","Shut")+": "+L(p.p.n),d:t3("Le sacás su arma, pero alguien deja de atacar.","Tira a arma deles, mas alguém deixa de atacar.","You take away their weapon, but someone stops attacking."),v:-p.v}))];
  V.ops=ops;
  $("#s-partido").innerHTML=`
    <div class="previa">
      <div class="pv-se">${t3("SE VIENE","VEM AÍ","COMING UP")}</div>
      <div class="pv-tit">${info.titulo}</div>
      <div class="pv-vs">${escudo(S.club,64)}<span>vs</span>${escudo(rv.club,64)}</div>
      <div class="pv-eq"><b>${S.club.n}</b><b>${rv.club.n}</b></div>
      <div class="pv-mini">${rv.f} · ${tEstilo(rv.e)}${info.neutral?` · ${t3("cancha neutral","campo neutro","neutral ground")}`:info.soyA?` · ${t3("de local","em casa","at home")}`:` · ${t3("de visitante","fora","away")}`}</div>
    </div>
    ${fig?`<div class="pv-figura"><div class="rt-grande">${fig.rt}</div><div><div class="mini">${t3("Su figura","O craque deles","Their star")}</div><b>${fig.jug.nom}</b><div class="mini">${tRol(fig.rol)}</div></div></div>`:""}
    <div class="pv-grid">
      <div>${svgZonas({ancho:240,alto:310,calor:calorMio,calor2:calorSuyo,
        marcas:Object.assign({},...misTop.slice(0,2).map(p=>({[p.zona]:{txt:"▲",color:"#A6F03C"}})),...susTop.slice(0,1).map(p=>({[espejoZona(p.zona)]:{txt:"!",color:"#FF8A78"}})))})}
        <div class="leyenda"><span><i class="pt" style="background:#A6F03C"></i> ${t3("por donde llegás","por onde você chega","where you get in")}</span><span><i class="pt" style="background:#F05A4A"></i> ${t3("por donde te llegan","por onde te chegam","where they get in")}</span></div></div>
      <div>
        <div class="lbl-sel">${t3("Dónde le podés ganar","Onde pode ganhar","Where you can win it")}</div>
        ${misTop.map(p=>`<div class="pv-pat ${semaforo(p.v)}"><b>${L(p.p.n)} <span class="z">${t3("zona","zona","zone")} ${p.zona}</span></b><span>${razones(p)}</span></div>`).join("")}
        <div class="lbl-sel" style="color:#FF8A78">${t3("Por dónde te lastiman","Por onde te machucam","Where they hurt you")}</div>
        ${susTop.map(p=>`<div class="pv-pat ${p.v>0.15?'mal':'med'}"><b>${L(p.p.n)} <span class="z">${t3("tu zona","sua zona","your zone")} ${espejoZona(p.zona)}</span></b><span>${razones(p)}</span></div>`).join("")}
      </div>
    </div>
    <h3 class="disp">${t3("¿Qué le pedís al equipo?","O que pede ao time?","What do you ask of the team?")}</h3>
    <div class="pv-ops">${ops.map((o,i)=>`<button class="card ${V.sel===i?'sel':''}" onclick="tmp.vivo.sel=${i};pintarPrevia()"><b>${o.t}</b><div class="sub">${o.d}</div></button>`).join("")}</div>
    <div class="acciones"><button class="btn" onclick="arrancarVivo()" ${V.sel==null?'disabled':''}>${t3("Salir a la cancha","Entrar em campo","Walk out")}</button>
      <button class="btn sec" onclick="tmp.vivo.sel=null;arrancarVivo()">${t3("Que jueguen como siempre","Que joguem como sempre","Play as usual")}</button></div>`;
  cabecera();
}

/* ---------- el partido: dos tiempos ---------- */
function equiposVivo(){
  const V=tmp.vivo, rv=V.info.rival;
  const yo=miEquipo(rv);
  return V.info.soyA?{A:yo,B:rv}:{A:rv,B:yo};
}
// una mitad: goles y eventos entre dos minutos (misma cuenta que jugarPartido, a medio tiempo)
function jugarMitad(A,B,neutral,desde,hasta){
  const Fa=fuerza(A,B,!neutral), Fb=fuerza(B,A,false), frac=(hasta-desde+1)/90;
  const la=clamp(LAMBDA_BASE*Math.exp((Fa-Fb)/K_PARTIDO),0.4,3.4)*frac, lb=clamp(LAMBDA_BASE*Math.exp((Fb-Fa)/K_PARTIDO),0.4,3.4)*frac;
  const an=A.an||B.an, patA=A.an?an.mis:an.sus, patB=B.an?an.mis:an.sus, ev=[];
  const gol=(E,l,pats)=>{ const o=goleador(E.once), pat=elegirPatron(pats);
    ev.push({m:R.e(desde,hasta),l,t:"gol",nom:apellido(o.jug.nom),jug:o.jug,pat,txt:narrarGol(pat,E.once,o),zona:(PATRONES.find(p=>p.id===pat)||{zona:14}).zona}); };
  for(let i=0,n=poisson(la);i<n;i++) gol(A,"a",patA);
  for(let i=0,n=poisson(lb);i<n;i++) gol(B,"b",patB);
  // llegadas que no terminan en gol: el mapa también cuenta lo que se intentó
  const llegadas=(pats,l,lam)=>{ const n=Math.round(lam*6+S.rng()*3); for(let i=0;i<n;i++){ const pat=elegirPatron(pats);
    ev.push({m:R.e(desde,hasta),l,t:"llegada",pat,zona:(PATRONES.find(p=>p.id===pat)||{zona:14}).zona}); } };
  llegadas(patA,"a",la/frac*0.5); llegadas(patB,"b",lb/frac*0.5);
  ev.sort((x,y)=>x.m-y.m);
  return {ev,Fa,Fb};
}
function arrancarVivo(){
  const V=tmp.vivo, o=V.sel!=null?V.ops[V.sel]:null;
  V.enf={rival:V.info.rival.club.n,cargar:[],cerrar:[]};
  if(o){ const [k,id]=o.k.split(":"); (k==="c"?V.enf.cargar:V.enf.cerrar).push(id); }
  S.enfasis=V.enf;
  const {A,B}=equiposVivo(); V.A=A; V.B=B;
  V.p1=jugarMitad(A,B,V.info.neutral,1,45);
  V.ev=[]; V.marc=[0,0]; V.min=0; V.zonasA=Array(19).fill(0); V.zonasB=Array(19).fill(0);
  pintarVivo(); ir("partido");
  correrVivo(V.p1.ev,1,45,()=>entretiempo());
}
function soyLado(){ return tmp.vivo.info.soyA?"a":"b"; }
function pintarVivo(){
  const V=tmp.vivo, rv=V.info.rival, yoA=V.info.soyA;
  const local=yoA?S.club:rv.club, visita=yoA?rv.club:S.club;
  $("#s-partido").innerHTML=`
    <div class="vivo-cab"><div class="mini">${V.info.titulo}</div>
      <div class="vivo-marc">${escudo(local,34)}<span class="eq">${local.n}</span><b id="vvM">${V.marc[0]} - ${V.marc[1]}</b><span class="eq">${visita.n}</span>${escudo(visita,34)}</div>
      <div class="tk-reloj"><span id="vvMin">${V.min}'</span><div class="tk-barra"><i id="vvBar" style="width:${V.min/90*100}%"></i></div></div></div>
    <div class="vivo-grid">
      <div><div id="vvZonas">${zonasVivo()}</div>
        <div class="leyenda"><span><i class="pt" style="background:#A6F03C"></i> ${t3("tus llegadas","suas chegadas","your attacks")}</span><span><i class="pt" style="background:#F05A4A"></i> ${t3("las de ellos","as deles","theirs")}</span></div></div>
      <div><div id="vvStats">${statsVivo()}</div><div id="vvFeed" class="vivo-feed"></div></div>
    </div>
    <div id="vvPanel"></div>`;
  pintarFeedVivo();
}
function zonasVivo(){
  const V=tmp.vivo, mx=Math.max(1,...V.zonasA,...V.zonasB);
  // todo en tu perspectiva: tus ataques suben, los de ellos bajan (zona espejada)
  const ca=V.zonasA.map(v=>v/mx), cb=Array(19).fill(0); V.zonasB.forEach((v,z)=>{ if(z) cb[espejoZona(z)]=v/mx; });
  return svgZonas({ancho:240,alto:310,calor:ca,calor2:cb,marcas:V.ultZona?{[V.ultZona.z]:{txt:V.ultZona.txt,color:V.ultZona.c}}:null});
}
function statsVivo(){
  const V=tmp.vivo, yo=soyLado();
  const cnt=(l,f)=>V.ev.filter(e=>e.l===l&&f(e)).length;
  const mios=cnt(yo,e=>e.t==="llegada"||e.t==="gol"), suyos=cnt(yo==="a"?"b":"a",e=>e.t==="llegada"||e.t==="gol");
  const pos=clamp(Math.round(50+(V.A.an||V.B.an).ventaja*14+((S.modelo||{}).ofe==="posicional"?6:-6)),28,74);
  const porCarril=l=>[0,1,2].map(c=>V.ev.filter(e=>e.l===l&&(e.t==="llegada"||e.t==="gol")&&((e.zona-1)%3)===c).length);
  const mc=porCarril(yo), sc=porCarril(yo==="a"?"b":"a").reverse();
  const fila=(n,a,b)=>`<div class="st"><span>${a}</span><b>${n}</b><span>${b}</span><div class="st-bar"><i style="width:${a+b?a/(a+b)*100:50}%"></i></div></div>`;
  return `${fila(t3("Posesión","Posse","Possession"),pos,100-pos)}
    ${fila(t3("Llegadas","Chegadas","Attacks"),mios,suyos)}
    ${fila(t3("Por izquierda","Pela esquerda","Down the left"),mc[0],sc[0])}
    ${fila(t3("Por el centro","Pelo centro","Through the middle"),mc[1],sc[1])}
    ${fila(t3("Por derecha","Pela direita","Down the right"),mc[2],sc[2])}`;
}
function pintarFeedVivo(){
  const V=tmp.vivo, c=$("#vvFeed"); if(!c) return;
  const yo=soyLado();
  c.innerHTML=V.ev.filter(e=>e.t==="gol"||e.t==="nota").slice().reverse().map(e=>e.t==="nota"?`<div class="vf nota">${e.txt}</div>`
    :`<div class="vf ${e.l===yo?'mio':'suyo'}"><b>⚽ ${e.m}' ${e.nom}</b> · <i>${nomPatron(e.pat)}</i><div>${e.txt}</div></div>`).join("")
    ||`<div class="mini">${t3("Arranca el partido.","Começa o jogo.","Kick-off.")}</div>`;
}
function correrVivo(evs,desde,hasta,fin){
  const V=tmp.vivo; let m=desde-1;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paso=()=>{
    if(S.pant!=="partido") return;
    m++; V.min=m;
    evs.filter(e=>e.m===m).forEach(e=>{
      V.ev.push(e);
      const yoLado=soyLado();
      if(e.l==="a") V.zonasA[e.zona]+=e.t==="gol"?3:1; else V.zonasB[e.zona]+=e.t==="gol"?3:1;
      if(e.t==="gol"){ V.marc[e.l==="a"?0:1]++; V.ultZona={z:e.l===yoLado?e.zona:espejoZona(e.zona),txt:"⚽",c:"#F4F7F0"};
        const mk=$("#vvM"); if(mk){ mk.textContent=`${V.marc[0]} - ${V.marc[1]}`; mk.classList.remove("gol"); void mk.offsetWidth; mk.classList.add("gol"); } pintarFeedVivo(); }
    });
    // cada llegada nueva repinta el mapa y los números
    const mn=$("#vvMin"), b=$("#vvBar"); if(mn) mn.textContent=m+"'"; if(b) b.style.width=(m/90*100)+"%";
    if(m%3===0||evs.some(e=>e.m===m)){ const z=$("#vvZonas"); if(z) z.innerHTML=zonasVivo(); const st=$("#vvStats"); if(st) st.innerHTML=statsVivo(); }
    if(m>=hasta){ fin(); return; }
    setTimeout(paso,reduce?5:(V.rapido?25:180));
  };
  paso();
}

/* ---------- entretiempo: qué no se está dando y qué cambiás ---------- */
function entretiempo(){
  const V=tmp.vivo, yo=soyLado(), el=yo==="a"?"b":"a";
  const suyas=V.ev.filter(e=>e.l===el&&(e.t==="llegada"||e.t==="gol")), mias=V.ev.filter(e=>e.l===yo&&(e.t==="llegada"||e.t==="gol"));
  const cuenta=l=>{ const c={}; l.forEach(e=>c[e.pat]=(c[e.pat]||0)+(e.t==="gol"?3:1)); return Object.entries(c).sort((a,b)=>b[1]-a[1]); };
  const peligro=cuenta(suyas)[0], fuerte=cuenta(mias)[0];
  const gf=V.marc[yo==="a"?0:1], gc=V.marc[yo==="a"?1:0];
  const ops=[];
  if(peligro&&peligro[0]!=="pelota") ops.push({k:"x:"+peligro[0],t:t3("Cerrar","Fechar","Shut")+": "+nomPatron(peligro[0]),d:t3("Es por donde más te llegaron. Corregís marcas y coberturas; atacás un poco menos.","É por onde mais chegaram. Corrige marcações; ataca um pouco menos.","That's where they got in most. You fix marking and cover; you attack a bit less.")});
  if(fuerte&&fuerte[0]!=="pelota") ops.push({k:"c:"+fuerte[0],t:t3("Insistir","Insistir","Keep at it")+": "+nomPatron(fuerte[0]),d:t3("Es lo que mejor te está saliendo. Más gente para esa jugada.","É o que melhor está saindo. Mais gente nessa jogada.","It's what's working best. More bodies into that move.")});
  const otro=(V.A.an||V.B.an).mis.find(p=>!fuerte||p.id!==fuerte[0]);
  if(otro) ops.push({k:"c:"+otro.id,t:t3("Probar","Tentar","Try")+": "+L(otro.p.n),d:razones(otro)});
  ops.push(gf<=gc?{k:"r:1",t:t3("Ir con todo","Ir com tudo","Go for it"),d:t3("Adelantás el bloque y metés uno más arriba: más llegadas para los dos.","Adianta o bloco: mais chegadas para os dois lados.","Push the block up and add a forward: more chances at both ends.")}
    :{k:"k:1",t:t3("Cuidar el resultado","Segurar o resultado","Protect the lead"),d:t3("Bajás el bloque y cerrás la zona 14: llegan menos, llegás menos.","Baixa o bloco e fecha a zona 14: chegam menos, chega menos.","Drop the block and shut zone 14: fewer chances either way.")});
  V.ops2=ops; V.sel2=null;
  V.ev.push({m:45,t:"nota",txt:t3("Entretiempo","Intervalo","Half-time")+` · ${V.marc[0]}-${V.marc[1]}`});
  pintarFeedVivo();
  pintarEntretiempo(peligro,fuerte);
}
function pintarEntretiempo(peligro,fuerte){
  const V=tmp.vivo;
  $("#vvPanel").innerHTML=`<div class="entretiempo">
    <h3 class="disp">${t3("Entretiempo","Intervalo","Half-time")}</h3>
    <p>${peligro?t3(`Te están llegando sobre todo con <b>${nomPatron(peligro[0])}</b>.`,`Estão chegando sobretudo com <b>${nomPatron(peligro[0])}</b>.`,`They're mostly getting in through <b>${nomPatron(peligro[0])}</b>.`):t3("Casi no te llegaron.","Quase não chegaram.","They've barely threatened.")}
      ${fuerte?t3(` Lo tuyo que mejor funciona: <b>${nomPatron(fuerte[0])}</b>.`,` O que melhor funciona: <b>${nomPatron(fuerte[0])}</b>.`,` Your best weapon so far: <b>${nomPatron(fuerte[0])}</b>.`):t3(" No encontraste por dónde.","Não achou por onde."," You haven't found a way through.")}</p>
    <div class="pv-ops">${V.ops2.map((o,i)=>`<button class="card ${V.sel2===i?'sel':''}" onclick="tmp.vivo.sel2=${i};pintarEntretiempo(${peligro?`['${peligro[0]}']`:"null"},${fuerte?`['${fuerte[0]}']`:"null"})"><b>${o.t}</b><div class="sub">${o.d}</div></button>`).join("")}</div>
    <div class="acciones"><button class="btn" onclick="segundoTiempo()">${V.sel2==null?t3("Seguir igual","Seguir igual","No changes"):t3("Volver a la cancha","Voltar ao campo","Back out")}</button></div></div>`;
  const p=$("#vvPanel"); if(p) p.scrollIntoView({behavior:"smooth",block:"start"});
}
function segundoTiempo(){
  const V=tmp.vivo, o=V.sel2!=null?V.ops2[V.sel2]:null;
  if(o){ const [k,id]=o.k.split(":");
    if(k==="c") V.enf.cargar.push(id); if(k==="x") V.enf.cerrar.push(id);
    if(k==="r") V.enf.riesgo=true;
    if(k==="k") V.enf.cerrar.push(...(V.A.an||V.B.an).sus.slice(0,2).map(p=>p.id));
    V.ev.push({m:46,t:"nota",txt:"↻ "+o.t}); }
  S.enfasis=V.enf;
  const {A,B}=equiposVivo(); V.A=A; V.B=B;
  V.p2=jugarMitad(A,B,V.info.neutral,46,90);
  $("#vvPanel").innerHTML="";
  correrVivo(V.p2.ev,46,90,()=>finVivo());
}
function finVivo(){
  const V=tmp.vivo, ga=V.marc[0], gb=V.marc[1];
  let pen=null;
  if(V.info.knock&&ga===gb){
    let pa=0,pb=0; for(let i=0;i<5;i++){ if(S.rng()<0.76)pa++; if(S.rng()<0.76)pb++; }
    let g=0; while(pa===pb&&g<10){ g++; if(S.rng()<0.72)pa++; if(S.rng()<0.72)pb++; } if(pa===pb) pa++;
    pen=[pa,pb];
  }
  const ev=V.ev.filter(e=>e.t==="gol");
  V.res={ga,gb,ev,pen,Fa:(V.p1.Fa+V.p2.Fa)/2,Fb:(V.p1.Fb+V.p2.Fb)/2};
  const yo=soyLado(), gf=yo==="a"?ga:gb, gc=yo==="a"?gb:ga;
  const gano=pen?((pen[0]>pen[1])===(yo==="a")):gf>gc;
  $("#vvPanel").innerHTML=`<div class="resultado ${gano?'bien':(gf===gc&&!pen)?'':'mal'}" style="margin-top:12px">
    <b>${pen?t3(`Penales: ${pen[0]}-${pen[1]}`,`Pênaltis: ${pen[0]}-${pen[1]}`,`Penalties: ${pen[0]}-${pen[1]}`)+" · ":""}${gano?t3("¡Ganaste!","Venceu!","You won!"):(gf===gc&&!pen)?t3("Empate","Empate","Draw"):t3("Perdiste","Perdeu","You lost")}</b>
    <span>${resumenVivo(gf,gc)}</span></div>
    <div class="acciones"><button class="btn" onclick="cerrarVivo()">${T("seguir")}</button></div>`;
}
function resumenVivo(gf,gc){
  const V=tmp.vivo, yo=soyLado();
  const mg=V.ev.filter(e=>e.t==="gol"&&e.l===yo).map(e=>nomPatron(e.pat)), sg=V.ev.filter(e=>e.t==="gol"&&e.l!==yo).map(e=>nomPatron(e.pat));
  return [mg.length?t3("Tus goles: ","Seus gols: ","Your goals: ")+mg.join(", ")+".":"", sg.length?t3("Los de ellos: ","Os deles: ","Theirs: ")+sg.join(", ")+".":""].join(" ");
}
function cerrarVivo(){
  const V=tmp.vivo;
  V.jor.forzado=V.res; V.jor.visto=true;
  tmp.vivo=null;
  pintarTicker(); ir("temporada");
  // la jornada se juega con este resultado y la tabla se actualiza
  setTimeout(tickerSiguiente,200);
}
