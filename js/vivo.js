// Carrera de DT — PARTIDOS GRANDES EN VIVO
// Copas y clásicos no se pasan de largo: hay previa (se viene, su figura, por dónde lastiman,
// dónde le ganás y qué querés cargar), el partido minuto a minuto leído por las 18 zonas
// y un entretiempo para corregir lo que no se está dando.

/* ---------- ¿es un partido grande mío? ---------- */
// No todos: máximo 2 por temporada, elegidos por lo que hay en juego (la final siempre).
// El resto de las copas y clásicos se juegan en el ticker con un aviso.
function partidoGrande(jor){
  const TT=S.temp; TT.grandes=TT.grandes||0;
  const cupo=n=>TT.grandes<n;
  if(jor.t==="copa"){
    const C=TT.copa; if(!C||C.eliminado) return null;
    const v=C.vivos, k=v.indexOf(0); if(k<0) return null;
    const par=k%2?k-1:k+1; if(v[par]==null) return null;
    const soyA=k%2===0, finalCopa=v.length===2, semi=v.length===4;
    if(!(finalCopa||(semi&&cupo(2))||(C.tipo==="sel"&&cupo(3)))) return null;
    return {tipo:finalCopa?"final":"copa",rival:C.equipos[v[par]],soyA,neutral:finalCopa,knock:true,
      historico:finalCopa&&(C.tipo==="conti"||C.tipo==="sel")&&S.club.niv<=4,
      titulo:`${C.nombre} · ${nombreRonda(v.length)}`};
  }
  const p=jor.partidos.find(x=>x.a===0||x.b===0); if(!p) return null;
  const riv=TT.equipos[p.a===0?p.b:p.a];
  // definición: últimas dos fechas con el título a 3 puntos o menos
  const campo=TT.ac&&jor.k>=TT.nFechas/2?"tabC":TT.ac?"tabA":"tab";
  const tabla=ordenTabla(TT.equipos,campo), lider=tabla[0].e[campo].pts, mio=TT.equipos[0][campo].pts;
  const resta=(TT.ac?TT.nFechas/2:TT.nFechas)-1-(TT.ac?jor.k%(TT.nFechas/2):jor.k);
  const definicion=(resta<=1&&lider-mio<=3&&jor.k>2)||(TT.mundial&&jor.k===TT.nFechas-1);
  // el clásico de la segunda rueda (o el único, si es el último cupo que queda)
  const clasico=riv.clasico&&jor.k>=TT.nFechas/2;
  if(!((definicion&&cupo(2))||(clasico&&cupo(2)))) return null;
  return {tipo:definicion?"definicion":"clasico",rival:riv,soyA:p.a===0,neutral:false,knock:false,
    titulo:`${tituloJornada(jor).replace(/<[^>]+>/g,"").trim()} · ${definicion?(TT.mundial?t3("Se define el grupo","Define o grupo","Group decider"):t3("Se define el campeonato","Define o campeonato","Title decider")):t3("Clásico","Clássico","Derby")}`};
}

// ¿es una copa o un clásico mío? (para avisar cuando no entra en el cupo de partidos en vivo)
function esGrandeMio(jor){
  const TT=S.temp;
  if(jor.t==="copa"){ const C=TT.copa; return !!(C&&!C.eliminado&&!C.pendiente&&C.vivos.includes(0)); }
  const p=(jor.partidos||[]).find(x=>x.a===0||x.b===0); if(!p) return false;
  const riv=TT.equipos[p.a===0?p.b:p.a]; return !!(riv&&riv.clasico);
}
/* ---------- la previa ---------- */
function espejoZona(z){ const f=Math.ceil(z/3), c=(z-1)%3; return zonaNum(2-c,7-f); }
function abrirPrevia(jor,info){
  S.temp.grandes=(S.temp.grandes||0)+1;
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
  // de ellos se sabe una sola cosa: lo demás se descubre jugando (aparece en el entretiempo)
  const misTop=an.mis.slice(0,3), susTop=an.sus.slice(0,1);
  const calorMio=calorZonas(an.mis.slice(0,4));
  const calorSuyo=Array(19).fill(0); calorZonas(an.sus.slice(0,4)).forEach((v,z)=>{ if(z) calorSuyo[espejoZona(z)]=v; });
  const ops=[
    ...misTop.slice(0,2).map(p=>({k:"c:"+p.id,t:t3("Cargar","Carregar","Load")+": "+L(p.p.n),d:razones(p),costo:L(costoEnfasis("cargar",p.id)),v:p.v})),
    ...susTop.slice(0,1).map(p=>({k:"x:"+p.id,t:t3("Cerrar","Fechar","Shut")+": "+L(p.p.n),d:t3("Le sacás su arma.","Tira a arma deles.","You take away their weapon."),costo:L(costoEnfasis("cerrar",p.id)),v:-p.v}))];
  V.ops=ops;
  const yoEq=miEquipo(rv), cols=coloresDuelo(S.club,rv.club); V.cols=cols;
  const mYo=S.modelo||modeloDeEstilo(S.estilo), mEl=rv.modelo||modeloDeEstilo(rv.e);
  const Zp=dominioZonas(yoEq,rv,mYo,mEl,ajusteEnfasis(V.sel!=null?V.ops[V.sel]:null,an));
  $("#s-partido").innerHTML=`
    <div class="previa ${info.historico?'historica':''}">
      <div class="pv-se">${info.historico?t3("NOCHE HISTÓRICA","NOITE HISTÓRICA","A HISTORIC NIGHT"):t3("SE VIENE","VEM AÍ","COMING UP")}</div>
      ${info.historico?`<p class="pv-hist">${t3(`Para un club como ${S.club.n}, una noche así es para toda la vida. La ciudad no habla de otra cosa.`,`Para um clube como o ${S.club.n}, uma noite assim é para a vida toda.`,`For a club like ${S.club.n}, a night like this lasts a lifetime. The whole city talks of nothing else.`)}</p>`:""}
      <div class="pv-tit">${info.titulo}</div>
      <div class="pv-vs">${escudo(S.club,64)}<span>vs</span>${escudo(rv.club,64)}</div>
      <div class="pv-eq"><b>${S.club.n}</b><b>${rv.club.n}</b></div>
      <div class="pv-mini">${rv.f} · ${tEstilo(rv.e)}${info.neutral?` · ${t3("cancha neutral","campo neutro","neutral ground")}`:info.soyA?` · ${t3("de local","em casa","at home")}`:` · ${t3("de visitante","fora","away")}`}</div>
    </div>
    ${fig?`<div class="pv-figura"><div class="rt-grande">${fig.rt}</div><div><div class="mini">${t3("Su figura","O craque deles","Their star")}</div><b>${fig.jug.nom}</b><div class="mini">${tRol(fig.rol)}</div></div></div>`:""}
    <div class="pv-grid">
      <div>${svgDominio(Zp,{ancho:260,alto:380,colA:cols.a,colB:cols.b})}
        ${leyendaDominio(cols,S.club,rv.club)}</div>
      <div>
        <div class="lbl-sel">${t3("Dónde le podés ganar","Onde pode ganhar","Where you can win it")}</div>
        ${misTop.map(p=>`<div class="pv-pat ${semaforo(p.v)}"><b>${L(p.p.n)} <span class="z">${t3("zona","zona","zone")} ${p.zona}</span></b><span>${razones(p)}</span></div>`).join("")}
        <div class="lbl-sel" style="color:#FF8A78">${t3("Por dónde te lastiman","Por onde te machucam","Where they hurt you")}</div>
        ${susTop.map(p=>`<div class="pv-pat ${p.v>0.15?'mal':'med'}"><b>${L(p.p.n)} <span class="z">${t3("tu zona","sua zona","your zone")} ${espejoZona(p.zona)}</span></b><span>${razones(p)}</span></div>`).join("")}
        <p class="mini">${t3("Es lo que se sabe de ellos. Lo que traen guardado se ve en la cancha: el entretiempo es para eso.","É o que se sabe deles. O resto aparece em campo.","That's what's known about them. What they're hiding shows on the pitch: that's what half-time is for.")}</p>
      </div>
    </div>
    <h3 class="disp">${t3("¿Qué le pedís al equipo?","O que pede ao time?","What do you ask of the team?")}</h3>
    <div class="pv-ops">${ops.map((o,i)=>`<button class="card ${V.sel===i?'sel':''}" onclick="tmp.vivo.sel=${i};pintarPrevia()"><b>${o.t}</b><div class="sub">${o.d}</div>${o.costo?`<div class="costo">${o.costo}</div>`:""}</button>`).join("")}</div>
    <div class="acciones"><button class="btn" onclick="abrirArenga()" ${V.sel==null?'disabled':''}>${t3("Salir a la cancha","Entrar em campo","Walk out")}</button>
      <button class="btn sec" onclick="tmp.vivo.sel=null;abrirArenga()">${t3("Que jueguen como siempre","Que joguem como sempre","Play as usual")}</button></div>`;
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
  if(V.arengaV) V.enf.arenga=V.arengaV;
  S.enfasis=V.enf;
  const {A,B}=equiposVivo(); V.A=A; V.B=B;
  V.cols=V.cols||coloresDuelo(S.club,V.info.rival.club);
  V.p1=jugarMitad(A,B,V.info.neutral,1,45);
  V.ev=[]; V.marc=[0,0]; V.min=0; V.zonasA=Array(19).fill(0); V.zonasB=Array(19).fill(0);
  if(V.arengaTxt!=null) V.ev.push({m:0,t:"nota",txt:V.arengaTxt>0.15?t3("Salen encendidos del vestuario.","Saem ligados do vestiário.","They come out fired up."):V.arengaTxt<-0.1?t3("Salen tensos, mirando el piso.","Saem tensos.","They come out tense."):t3("Salen a la cancha.","Entram em campo.","Out they come.")});
  pintarVivo(); ir("partido");
  correrVivo(V.p1.ev,1,45,()=>entretiempo());
}
function soyLado(){ return tmp.vivo.info.soyA?"a":"b"; }
function pintarVivo(){
  const V=tmp.vivo, rv=V.info.rival, yoA=V.info.soyA;
  const local=yoA?S.club:rv.club, visita=yoA?rv.club:S.club;
  $("#s-partido").innerHTML=`
    <div class="vivo-cab ${V.info.historico?'historica':''}"><div class="mini">${V.info.titulo}</div>
      <div class="vivo-marc">${escudo(local,34)}<span class="eq">${local.n}</span><b id="vvM">${V.marc[0]} - ${V.marc[1]}</b><span class="eq">${visita.n}</span>${escudo(visita,34)}</div>
      <div class="tk-reloj"><span id="vvMin">${V.min}'</span><div class="tk-barra"><i id="vvBar" style="width:${V.min/90*100}%"></i></div></div></div>
    <div class="vivo-grid">
      <div><div id="vvZonas">${zonasVivo()}</div>
        ${leyendaDominio(V.cols,S.club,rv.club)}</div>
      <div><div id="vvStats">${statsVivo()}</div><div id="vvFeed" class="vivo-feed"></div></div>
    </div>
    <div id="vvPanel"></div>`;
  pintarFeedVivo();
}
// el dominio de cada zona en vivo: parte de dónde está parado cada uno y se mueve con
// lo que pasa: cada llegada tuya suma tu color en esa zona, cada llegada de ellos la pinta del suyo
function zonasVivo(){
  const V=tmp.vivo, yo=soyLado(), aj=Array(19).fill(0);
  const sumar=(z,v)=>{ if(z>=1&&z<=18) aj[z]+=v; };
  V.ev.forEach(e=>{ if(e.t!=="llegada"&&e.t!=="gol") return; const w=e.t==="gol"?0.12:0.05;
    if(e.l===yo){ sumar(e.zona,w); sumar(e.zona-3,w/2); } else { const z=espejoZona(e.zona); sumar(z,-w); sumar(z+3,-w/2); } });
  const base=ajusteEnfasis(null,(V.A.an||V.B.an),V.enf);
  for(let z=1;z<=18;z++) aj[z]=clamp(aj[z]+base[z],-0.6,0.6);
  const mio=V.info.soyA?V.A:V.B, el=V.info.rival;
  const Z=dominioZonas(mio,el,S.modelo||modeloDeEstilo(S.estilo),el.modelo||modeloDeEstilo(el.e),aj);
  return svgDominio(Z,{ancho:260,alto:380,colA:V.cols.a,colB:V.cols.b,gol:V.ultZona?V.ultZona.z:null});
}
// lo que pediste se ve en la cancha: cargar un patrón pinta tu color en su zona; cerrar uno de ellos, en la tuya
function ajusteEnfasis(op,an,enf){
  const aj=Array(19).fill(0), zonaP=(lista,id)=>{ const p=(lista||[]).find(x=>x.id===id); return p?p.zona:null; };
  const cargar=[], cerrar=[];
  if(op){ const [k,id]=op.k.split(":"); if(k==="c") cargar.push(id); if(k==="x") cerrar.push(id); }
  if(enf){ cargar.push(...(enf.cargar||[])); cerrar.push(...(enf.cerrar||[])); }
  cargar.forEach(id=>{ const z=zonaP(an&&an.mis,id); if(z){ aj[z]+=0.22; if(z>3) aj[z-3]+=0.1; } });
  cerrar.forEach(id=>{ const z=zonaP(an&&an.sus,id); if(z){ const m=espejoZona(z); aj[m]+=0.28; if(m<=15) aj[m+3]+=0.12; } });
  if(enf&&enf.riesgo) for(let z=10;z<=18;z++) aj[z]+=0.08;
  return aj;
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
    ${fila(t3("Por derecha","Pela direita","Down the right"),mc[2],sc[2])}
    ${V.info.historico?notasVivo():""}`;
}
// en una noche histórica se sigue a cada uno: la nota en vivo de tus once
function notasVivo(){
  const V=tmp.vivo, yo=soyLado(), el=yo==="a"?"b":"a", eq=yo==="a"?V.A:V.B;
  const lleg=l=>V.ev.filter(e=>e.l===l&&(e.t==="llegada"||e.t==="gol")).length, dif=lleg(yo)-lleg(el);
  const gc=V.ev.filter(e=>e.t==="gol"&&e.l===el).length;
  const nota=o=>{ const g=ROL[o.rol].g, goles=V.ev.filter(e=>e.t==="gol"&&e.l===yo&&e.jug===o.jug).length;
    let n=6+(hashTxt(o.jug.nom+V.min)%7-3)/20+goles*1.2+(o.rt-75)/40;
    n+=g==="ATA"||g==="MED"?dif*0.06:(-gc*0.35+(dif>0?0.15:0));
    if(g==="POR") n+=(lleg(el)-gc*3)*0.04;
    return clamp(Math.round(n*10)/10,3,10); };
  const l=(eq.once||[]).map(o=>({o,n:nota(o)})).sort((a,b)=>b.n-a.n);
  return `<div class="notas-vivo"><div class="lbl-sel">${t3("Notas en vivo","Notas ao vivo","Live ratings")}</div>
    ${l.map(x=>`<span class="${x.n>=7?'ok':x.n<5.5?'mal':''}">${apellido(x.o.jug.nom)} <b>${x.n.toFixed(1)}</b></span>`).join("")}</div>`;
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
    setTimeout(paso,reduce?5:(V.rapido?25:(V.info.historico?260:180))); // la noche histórica va más lenta
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
  ops.forEach(o=>{ const [k,id]=o.k.split(":"); o.costo=L(k==="c"?costoEnfasis("cargar",id):k==="x"?costoEnfasis("cerrar",id)
    :k==="r"?{es:"Costo: atrás quedan dos contra dos.",pt:"Custo: atrás ficam dois contra dois.",en:"Cost: two-on-two at the back."}
    :{es:"Costo: le regalás la pelota y el campo.",pt:"Custo: entrega a bola e o campo.",en:"Cost: you hand them the ball and the pitch."}); });
  // el rival también corrige: si le estás ganando con algo, en el segundo tiempo te lo cierra
  V.rivalCierra=(fuerte&&fuerte[0]!=="pelota"&&gf>=gc&&fuerte[1]>=3)?fuerte[0]:null;
  // lo que no se veía en la previa: su segundo recurso, si lo usó
  const oculto=(V.A.an||V.B.an).sus[1];
  V.revelado=oculto&&suyas.some(e=>e.pat===oculto.id)?oculto:null;
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
    ${V.revelado?`<div class="alerta">${t3(`Lo que no se veía: también te buscan con <b>${L(V.revelado.p.n)}</b> (tu zona ${espejoZona(V.revelado.zona)}).`,`O que não se via: também buscam com <b>${L(V.revelado.p.n)}</b>.`,`What you couldn't see: they also come at you with <b>${L(V.revelado.p.n)}</b>.`)}</div>`:""}
    ${V.rivalCierra?`<div class="alerta mal">${t3(`En el otro vestuario ya lo vieron: van a cerrar <b>${nomPatron(V.rivalCierra)}</b>. Si insistís, chocás; si probás otra cosa, los agarrás corrigiendo.`,`No outro vestiário já viram: vão fechar <b>${nomPatron(V.rivalCierra)}</b>.`,`The other dressing room has seen it: they'll shut <b>${nomPatron(V.rivalCierra)}</b>. Insist and you hit a wall; try something else and you catch them adjusting.`)}</div>`:""}
    <div class="pv-ops">${V.ops2.map((o,i)=>`<button class="card ${V.sel2===i?'sel':''}" onclick="tmp.vivo.sel2=${i};pintarEntretiempo(${peligro?`['${peligro[0]}']`:"null"},${fuerte?`['${fuerte[0]}']`:"null"})"><b>${o.t}</b><div class="sub">${o.d}</div>${o.costo?`<div class="costo">${o.costo}</div>`:""}</button>`).join("")}</div>
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
  if(V.rivalCierra){ V.enf.rivalCierra=V.rivalCierra; V.ev.push({m:46,t:"nota",txt:t3("Ellos cierran ","Eles fecham ","They shut ")+nomPatron(V.rivalCierra)}); }
  if(V.enf.arenga) V.enf.arenga=Math.round(V.enf.arenga*500)/1000; // la charla se gasta: la mitad en el segundo tiempo
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
    // empate en eliminación: la tanda se juega (js/vestuario.js) y vuelve acá con el resultado
    if(!V.penRes){ abrirPenales(); return; }
    pen=V.penRes;
  }
  const ev=V.ev.filter(e=>e.t==="gol");
  V.res={ga,gb,ev,pen,Fa:(V.p1.Fa+V.p2.Fa)/2,Fb:(V.p1.Fb+V.p2.Fb)/2};
  const yo=soyLado(), gf=yo==="a"?ga:gb, gc=yo==="a"?gb:ga;
  const gano=pen?((pen[0]>pen[1])===(yo==="a")):gf>gc;
  const emp=gf===gc&&!pen, cls=gano?'bien':emp?'emp':'mal', rv=V.info.rival, yoA=V.info.soyA;
  $("#vvPanel").innerHTML=`<div class="vivo-final ${cls}" role="dialog" aria-modal="true"><div class="vf-caja">
    <div class="vf-tit">${gano?t3("¡GANASTE!","VENCEU!","YOU WON!"):emp?t3("EMPATE","EMPATE","DRAW"):t3("PERDISTE","PERDEU","YOU LOST")}</div>
    <div class="vf-marc">${escudo(yoA?S.club:rv.club,40)}<b>${ga} - ${gb}</b>${escudo(yoA?rv.club:S.club,40)}</div>
    ${pen?`<div class="vf-pen">${t3("Penales","Pênaltis","Penalties")} ${pen[0]}-${pen[1]}</div>`:""}
    <div class="mini">${V.info.titulo}</div>
    <div class="vf-analisis">${analisisVivo(gf,gc)}</div>
    <div class="acciones" style="justify-content:center"><button class="btn" onclick="cerrarVivo()">${T("seguir")}</button></div></div></div>`;
}
// análisis del partido: cómo vinieron los goles, por dónde se jugó y si lo que pediste sirvió
function analisisVivo(gf,gc){
  const V=tmp.vivo, yo=soyLado(), el=yo==="a"?"b":"a";
  const lleg=l=>V.ev.filter(e=>e.l===l&&(e.t==="llegada"||e.t==="gol"));
  const porC=l=>[0,1,2].map(c=>lleg(l).filter(e=>((e.zona-1)%3)===c).length);
  const mc=porC(yo), sc=porC(el).reverse(), nomC=[t3("la izquierda","a esquerda","the left"),t3("el centro","o centro","the middle"),t3("la derecha","a direita","the right")];
  const mejorC=mc.indexOf(Math.max(...mc)), peorC=sc.indexOf(Math.max(...sc));
  const filas=[];
  const gm=V.ev.filter(e=>e.t==="gol"&&e.l===yo), gs=V.ev.filter(e=>e.t==="gol"&&e.l===el);
  if(gm.length) filas.push(`<div class="ok">⚽ ${gm.map(e=>`${e.m}' ${e.nom} <i>(${nomPatron(e.pat)})</i>`).join(" · ")}</div>`);
  if(gs.length) filas.push(`<div class="mal">⚽ ${gs.map(e=>`${e.m}' ${e.nom} <i>(${nomPatron(e.pat)})</i>`).join(" · ")}</div>`);
  filas.push(`<div>${t3("Llegaste más por","Chegou mais por","You got in most down")} <b>${nomC[mejorC]}</b> (${lleg(yo).length} ${t3("llegadas","chegadas","attacks")}); ${t3("ellos, por","eles, por","they, down")} <b>${nomC[peorC]}</b> (${lleg(el).length}).</div>`);
  const enf=V.enf||{}, pedidos=(enf.cargar||[]).concat(enf.cerrar||[]);
  if(pedidos.length){
    const cargo=(enf.cargar||[]).map(id=>{ const n=lleg(yo).filter(e=>e.pat===id).length; return `${nomPatron(id)}: ${n} ${t3("llegadas","chegadas","attacks")}`; });
    const cerro=(enf.cerrar||[]).map(id=>{ const n=lleg(el).filter(e=>e.pat===id).length; return `${nomPatron(id)} ${t3("de ellos","deles","of theirs")}: ${n}`; });
    filas.push(`<div class="mini">${t3("Lo que pediste","O que pediu","What you asked for")} — ${cargo.concat(cerro).join(" · ")}</div>`);
  }
  return filas.join("");
}
function resumenVivo(gf,gc){
  const V=tmp.vivo, yo=soyLado();
  const mg=V.ev.filter(e=>e.t==="gol"&&e.l===yo).map(e=>nomPatron(e.pat)), sg=V.ev.filter(e=>e.t==="gol"&&e.l!==yo).map(e=>nomPatron(e.pat));
  return [mg.length?t3("Tus goles: ","Seus gols: ","Your goals: ")+mg.join(", ")+".":"", sg.length?t3("Los de ellos: ","Os deles: ","Theirs: ")+sg.join(", ")+".":""].join(" ");
}
function cerrarVivo(){
  const V=tmp.vivo;
  V.jor.forzado=V.res; V.jor.visto=true;
  // rodaje: cada partido grande jugado cuenta (la próxima tanda o final, ya sabe lo que es)
  const mio=soyLado()==="a"?V.A:V.B; (mio&&mio.once||[]).forEach(o=>{ o.jug.gr=(o.jug.gr||0)+1; });
  S.plantel.forEach(j=>{ delete j._ar; });
  tmp.vivo=null;
  pintarTicker(); ir("temporada");
  // la jornada se juega con este resultado y la tabla se actualiza
  setTimeout(tickerSiguiente,200);
}
