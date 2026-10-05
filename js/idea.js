// Carrera de DT — QUIÉN SOS (exprés) y TU IDEA DE JUEGO
// El sistema y el modelo son la decisión más importante del juego:
// definen cómo rinde tu equipo (encaje), qué aprende temporada a temporada
// (automatismos) y qué rivales te complican (momentos del partido).

const TAGLINE={
 formador:{es:"Hacés crecer a los pibes.",pt:"Você faz os garotos crescerem.",en:"You make the kids grow."},
 ganador:{es:"Resultados ya. Plata sí, tiempo no.",pt:"Resultado já. Dinheiro sim, tempo não.",en:"Results now. Money yes, time no."},
 bombero:{es:"Te llaman cuando el barco se hunde.",pt:"Te chamam quando o barco afunda.",en:"They call you when the ship is sinking."}
};
const ICONO_ARQ={formador:"🌱",ganador:"🏆",bombero:"🧯"};

/* ==========================================================
   QUIÉN SOS — una sola pantalla, corta
   ========================================================== */
function identidad(){
  tmp={arq:tmp&&tmp.arq||null,modo:"normal",hincha:"Peñarol"};
  pintarIdentidad(); ir("identidad");
}
function pintarIdentidad(){
  $("#s-identidad").innerHTML=`
    <h2 class="disp">${T("quienSos")}</h2>
    <div class="fila-id">
      <div><label for="nom">${T("tuApellido")}</label>
        <input type="text" id="nom" maxlength="24" placeholder="${T("comoTeNombran")}" value="${S.nombre||""}"></div>
      <div><label for="hincha">${t3("Sos hincha de","Você torce para","You support")}</label>
        <select id="hincha" class="sel" onchange="tmp.hincha=this.value">
        ${PAISES.map(pa=>`<optgroup label="${pa}">${LIGAS[pa].clubes.map(c=>
          `<option value="${c.n}" ${tmp.hincha===c.n?'selected':''}>${c.n}</option>`).join("")}</optgroup>`).join("")}
        </select></div>
    </div>
    <h3 class="disp">${T("tuPerfil")}</h3>
    <div class="arq-tiles">${ARQ.map(a=>`
      <button class="arq ${tmp.arq===a.id?'sel':''}" onclick="guardarNom();tmp.arq='${a.id}';pintarIdentidad()">
        <span class="arq-ico" aria-hidden="true">${ICONO_ARQ[a.id]}</span>
        <b>${nArq(a)}</b><span>${L(TAGLINE[a.id])}</span></button>`).join("")}</div>
    ${tmp.arq?(()=>{const a=ARQ.find(x=>x.id===tmp.arq);return `<details class="mini-det"><summary>${t3("Qué cambia","O que muda","What changes")}</summary>
      <div class="efecto">${efArq(a).join(" · ")}</div><div class="costo">${coArq(a)}</div></details>`;})():""}
    <h3 class="disp">${T("duracion")}</h3>
    <div class="seg">${MODOS.map(m=>`
      <button class="${tmp.modo===m.id?'on':''}" onclick="guardarNom();tmp.modo='${m.id}';pintarIdentidad()">
        <b>${tModo(m,"n")}</b><span>${m.temporadas} ${t3("temporadas","temporadas","seasons")}</span></button>`).join("")}</div>
    <div class="acciones">
      <button class="btn" onclick="irIdea()" ${tmp.arq?'':'disabled'}>${t3("Siguiente: tu idea de juego","Próximo: sua ideia de jogo","Next: your game idea")}</button>
      <button class="btn sec" onclick="portada()">${T("volver")}</button></div>`;
}
function guardarNom(){ const n=$("#nom"); if(n) S.nombre=n.value; const h=$("#hincha"); if(h) tmp.hincha=h.value; }
function irIdea(){
  guardarNom();
  S.nombre=(S.nombre||"").trim()||t3("El DT","O Técnico","The Coach");
  S.arq=ARQ.find(a=>a.id===tmp.arq);
  S.modo=MODOS.find(x=>x.id===tmp.modo)||MODOS[1];
  S.temporadasTotal=S.modo.temporadas;
  S.clubHincha=CLUBES.find(c=>c.n===tmp.hincha)||null;
  tmp.f=tmp.f||"4-3-3"; tmp.e=tmp.e||"Posesion"; tmp.fase="sin";
  pintarIdea(); ir("idea");
}

/* ==========================================================
   TU IDEA DE JUEGO — el microjuego que enseña
   ========================================================== */
const GANA_ARRIESGA={
 pos:{g:[{es:"Tenés la pelota y el ritmo del partido",pt:"Você tem a bola e o ritmo",en:"You own the ball and the tempo"},
         {es:"El rival corre detrás y se cansa",pt:"O rival corre atrás e cansa",en:"The opponent chases and tires"}],
      r:[{es:"Si la perdés saliendo, te agarran mal parado",pt:"Se perder na saída, te pegam desarrumado",en:"Lose it while building and you're exposed"},
         {es:"Contra un bloque bajo te cuesta llegar",pt:"Contra bloco baixo custa chegar",en:"A low block is hard to break"}]},
 pre:{g:[{es:"Robás cerca del arco rival",pt:"Rouba perto do gol rival",en:"You win the ball near their goal"},
         {es:"Le quitás tiempo para pensar",pt:"Tira o tempo de pensar",en:"They have no time to think"}],
      r:[{es:"Si te saltan la presión, queda campo a tu espalda",pt:"Se pularem a pressão, sobra campo nas costas",en:"If they bypass the press, there's space behind"},
         {es:"Desgasta: tus jugadores se cansan más",pt:"Desgasta: seus jogadores cansam mais",en:"It's draining: your players tire faster"}]},
 con:{g:[{es:"Aprovechás cada espacio a la espalda",pt:"Aproveita cada espaço nas costas",en:"You exploit every gap in behind"},
         {es:"No necesitás la pelota para hacer daño",pt:"Não precisa da bola para machucar",en:"You don't need the ball to hurt them"}],
      r:[{es:"Si te esperan atrás, no hay espacio para correr",pt:"Se esperarem atrás, não há espaço",en:"If they sit deep, there's no space to run"},
         {es:"Si te encierran, sufrís",pt:"Se te prenderem, você sofre",en:"If they pin you back, you suffer"}]},
 blo:{g:[{es:"Muy difícil de romper",pt:"Muito difícil de furar",en:"Very hard to break down"},
         {es:"Pocos goles en contra",pt:"Poucos gols sofridos",en:"Few goals conceded"}],
      r:[{es:"Cedés la pelota y el terreno",pt:"Cede a bola e o terreno",en:"You concede ball and territory"},
         {es:"Si te hacen un gol, cuesta darlo vuelta",pt:"Se levar um gol, custa virar",en:"Concede first and it's hard to turn around"}]}
};
const PORQUE_FIT_I18N={
 pt:{"Posesion":{"4-3-3":"O trio de meio forma triângulos permanentes: sempre há duas opções de passe curto.","4-2-3-1":"O meia recua entre linhas e com os dois volantes dá três apoios no centro.","4-4-2":"Duas linhas de quatro não formam triângulos: quem tem a bola fica só com passes laterais.","3-5-2 / 5-3-2":"Cinco no meio dão a bola, mas os alas demoram e a circulação fica lenta.","3-4-3":"Tem gente para tocar, mas com três atrás não pode perder a bola na saída."},
  "Contraataque / Directo":{"4-3-3":"Rouba e precisa percorrer muito campo com o 9 sozinho contra os zagueiros.","4-2-3-1":"Um só atacante: a transição depende de que cheguem os três de trás.","4-4-2":"Bloco junto e dois atacantes fixos: rouba e já tem a quem procurar.","3-5-2 / 5-3-2":"Recupera bem, mas de tão atrás o contra-ataque chega com pouca gente.","3-4-3":"Três na frente esperando a transição: rouba e sai em superioridade."},
  "Presion alta":{"4-3-3":"O trio de ataque tapa a saída dos dois zagueiros e do goleiro ao mesmo tempo.","4-2-3-1":"O meia e os pontas pressionam a primeira linha enquanto os volantes fecham o passe interior.","4-4-2":"Dá, mas as duas linhas de quatro precisam subir juntas e isso desgasta muito.","3-5-2 / 5-3-2":"A estrutura foi pensada para recuar: se adiantar o bloco, os alas ficam na contramão.","3-4-3":"Muita gente adiantada para pressionar, com o risco de deixar os três de trás mano a mano."},
  "Bloque bajo / Repliegue":{"4-3-3":"Recuado, o 9 fica isolado e não há a quem dar quando recupera.","4-2-3-1":"Aguenta, mas o meia recuado deixa de servir para o que ele é.","4-4-2":"Duas linhas de quatro juntas: é a estrutura mais difícil de furar que existe.","3-5-2 / 5-3-2":"O zagueiro de sobra dá cobertura permanente e fecha a área com cinco.","3-4-3":"Com três atrás, recuar é sofrer: sobram homens na frente e faltam na área."}},
 en:{"Posesion":{"4-3-3":"The midfield three form constant triangles: there are always two short passing options.","4-2-3-1":"The 10 drops between the lines and with two holding mids gives three central supports.","4-4-2":"Two flat banks of four make no triangles: the man on the ball only has sideways passes.","3-5-2 / 5-3-2":"Five in midfield win the ball, but the wing-backs arrive late and circulation slows.","3-4-3":"You have men to pass to, but with three at the back you can't lose it while building."},
  "Contraataque / Directo":{"4-3-3":"You win it and must cover lots of ground with the 9 alone against the centre-backs.","4-2-3-1":"A lone striker: the transition depends on the three behind arriving.","4-4-2":"A tight block and two fixed strikers: win it and you already have a target.","3-5-2 / 5-3-2":"You recover well, but from so deep the counter arrives with few men.","3-4-3":"Three up waiting for the transition: win it and break out with numbers."},
  "Presion alta":{"4-3-3":"The front three block both centre-backs and the keeper at once.","4-2-3-1":"The 10 and wingers press the first line while the holding mids cut the inside pass.","4-4-2":"Possible, but both banks of four must step up together and it's exhausting.","3-5-2 / 5-3-2":"The shape is built to drop: push up and the wing-backs are caught the wrong way.","3-4-3":"Lots of men up to press, with the risk of leaving the back three one-on-one."},
  "Bloque bajo / Repliegue":{"4-3-3":"Sitting deep, the 9 is isolated with nobody to find when you win it.","4-2-3-1":"It holds, but a deep 10 stops doing what he's there for.","4-4-2":"Two compact banks of four: the hardest structure there is to break.","3-5-2 / 5-3-2":"The spare centre-back gives constant cover and shuts the box with five.","3-4-3":"With three at the back, sitting deep is suffering: too many men up, too few in the box."}}
};
function porqueFit(e,f){ return IDIOMA==="es"?PORQUE_FIT[e][f]:(PORQUE_FIT_I18N[IDIOMA]&&PORQUE_FIT_I18N[IDIOMA][e][f])||PORQUE_FIT[e][f]; }
function pipsFit(fit){
  const n=fit>=1.12?5:fit>=1.06?4:fit>=1?3:fit>=0.94?2:1;
  return `<span class="pips">${[1,2,3,4,5].map(i=>`<i class="${i<=n?(n>=4?'ok':n===3?'med':'mal'):''}"></i>`).join("")}</span>`;
}
// forma del equipo según el modelo: sin pelota y con pelota
function formaIdea(f,e,fase){
  const me=MID[e];
  return ONCE[f].map(s=>{
    let x=s[1], y=s[2], Y;
    if(s[0]==="POR") return {rol:s[0],x,Y:fase==="sin"?5:(me==="pre"||me==="pos"?12:7)};
    if(fase==="sin"){
      const [a,b]={pre:[40,.5],pos:[28,.52],con:[16,.52],blo:[3,.48]}[me]; Y=a+b*y;
      if(me==="blo"||me==="con") x=50+(x-50)*0.82;
    } else {
      if(me==="pos"){ Y=24+0.66*y; if(/^(LT|CA)/.test(s[0])){Y+=16;x=x<50?5:95;} if(/^EX/.test(s[0]))x=x<50?10:90; }
      else if(me==="pre"){ Y=30+0.63*y; if(/^(LT|CA)/.test(s[0])) Y+=10; }
      else if(me==="con"){ Y=ROL[s[0]].g==="ATA"?78+0.1*y:10+0.55*y; if(s[0]==="MCO")Y=62; }
      else { Y=ROL[s[0]].g==="ATA"?62+0.15*y:6+0.45*y; }
    }
    return {rol:s[0],x,Y};
  });
}
function svgIdea(f,e,fase){
  const W=380,H=460, X=x=>x/100*W, Yp=Y=>H-(Y/100)*H;
  const pts=formaIdea(f,e,fase), me=MID[e];
  const club={c:["#4FBF7F","#183028"]};
  let extra="";
  const campo=pts.filter(p=>p.rol!=="POR");
  if(fase==="con"&&(me==="pos"||me==="pre")){
    // triángulos: cada uno con sus dos compañeros más cercanos
    const seg=new Set();
    campo.forEach((p,i)=>{
      campo.map((q,k)=>({k,d:Math.hypot(q.x-p.x,(q.Y-p.Y)*1.1)})).filter(o=>o.k!==i).sort((a,b)=>a.d-b.d).slice(0,2)
        .forEach(o=>{ if(o.d<34){ const key=[Math.min(i,o.k),Math.max(i,o.k)].join("-"); seg.add(key);} });
    });
    extra=[...seg].map(k=>{const [a,b]=k.split("-").map(Number);
      return `<line x1="${X(campo[a].x)}" y1="${Yp(campo[a].Y)}" x2="${X(campo[b].x)}" y2="${Yp(campo[b].Y)}" stroke="#E0A93B" stroke-width="1.6" opacity=".55"/>`;}).join("");
  }
  if(fase==="sin"&&me==="pre"){
    extra=campo.filter(p=>p.Y>55).map(p=>`<line x1="${X(p.x)}" y1="${Yp(p.Y)}" x2="${X(p.x+(50-p.x)*0.15)}" y2="${Yp(p.Y+11)}" stroke="#D9543F" stroke-width="2.5" marker-end="url(#fl)"/>`).join("")
      +`<line x1="10" y1="${Yp(47)}" x2="${W-10}" y2="${Yp(47)}" stroke="#E0A93B" stroke-dasharray="6 5" stroke-width="1.5"/>
       <text x="${W-12}" y="${Yp(47)-5}" text-anchor="end" font-size="10" fill="#E0A93B">${t3("línea alta","linha alta","high line")}</text>`;
  }
  if(fase==="sin"&&(me==="blo"||me==="con")){
    const lineas=[...new Set(campo.map(p=>Math.round(p.Y/6)))].slice(0,3);
    extra=`<rect x="14" y="${Yp(me==="blo"?40:52)}" width="${W-28}" height="${H*(me==="blo"?34:36)/100}" fill="#5B9BD5" opacity=".1" stroke="#5B9BD5" stroke-dasharray="5 5" rx="6"/>
      <text x="20" y="${Yp(me==="blo"?40:52)+14}" font-size="10" fill="#8FB8E0">${t3("bloque compacto","bloco compacto","compact block")}</text>`;
  }
  if(fase==="con"&&me==="con"){
    extra=campo.filter(p=>ROL[p.rol].g==="ATA").map(p=>`<line x1="${X(p.x)}" y1="${Yp(p.Y-30)}" x2="${X(p.x)}" y2="${Yp(p.Y+8)}" stroke="#E0A93B" stroke-width="2.5" marker-end="url(#fl)" opacity=".8"/>`).join("");
  }
  if(fase==="con"&&me==="blo"){
    const dc=campo.filter(p=>p.rol==="DC")[0]||campo[campo.length-1], cen=campo.find(p=>p.rol==="DFC");
    extra=`<path d="M${X(cen.x)} ${Yp(cen.Y)} Q ${X(20)} ${Yp(50)} ${X(dc.x)} ${Yp(dc.Y)}" fill="none" stroke="#E0A93B" stroke-width="2.5" stroke-dasharray="7 6" marker-end="url(#fl)"/>`;
  }
  if(fase==="sin"&&me==="pos"){
    extra=campo.filter(p=>p.Y>42&&p.Y<70).slice(0,4).map(p=>`<circle cx="${X(p.x)}" cy="${Yp(p.Y+5)}" r="20" fill="none" stroke="#D9543F" stroke-width="1.5" stroke-dasharray="3 4" opacity=".7"/>`).join("")
      +`<text x="${W/2}" y="${Yp(78)}" text-anchor="middle" font-size="10" fill="#E8B6AC">${t3("presión tras pérdida","pressão pós-perda","counter-press")}</text>`;
  }
  return `<svg class="cancha idea" viewBox="0 0 ${W} ${H}" role="img" aria-label="${f} ${ESTILO_LBL[e]}">
    <defs><marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E0A93B"/></marker></defs>
    <rect width="${W}" height="${H}" fill="#224236"/>
    ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect y="${i*H/10}" width="${W}" height="${H/20}" fill="#284C3E"/>`).join("")}
    <rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <line x1="6" y1="${H/2}" x2="${W-6}" y2="${H/2}" stroke="#5A8A76" stroke-width="1.5"/>
    <circle cx="${W/2}" cy="${H/2}" r="40" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-72}" y="${H-60}" width="144" height="54" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${W/2-72}" y="6" width="144" height="54" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    ${extra}
    ${pts.map((p,i)=>`<g class="mj" id="ij-${i}" style="transform:translate(${X(p.x)}px,${Yp(p.Y)}px)">
      <circle r="12" fill="#4FBF7F" stroke="#183028" stroke-width="2.5"/>
      <text y="3.5" text-anchor="middle" font-size="8" font-weight="700" fill="#0D1613">${tRol(p.rol).split(" ")[0].slice(0,3).toUpperCase()}</text></g>`).join("")}
  </svg>`;
}
function pintarIdea(){
  const f=tmp.f, e=tmp.e, me=MID[e], fit=FIT[e][f], ga=GANA_ARRIESGA[me];
  $("#s-idea").innerHTML=`
    <h2 class="disp">${t3("Tu idea de juego","Sua ideia de jogo","Your game idea")}</h2>
    <p class="mini">${t3("El sistema es dónde parás a tus jugadores. El modelo es qué hacen con y sin la pelota. Tienen que hablar el mismo idioma.",
      "O sistema é onde você posiciona os jogadores. O modelo é o que fazem com e sem a bola. Precisam falar a mesma língua.",
      "The system is where your players stand. The model is what they do with and without the ball. They must speak the same language.")}</p>
    <div class="lbl-sel">${t3("Sistema","Sistema","System")}</div>
    <div class="pills">${FORMACIONES.map(x=>`<button class="pill ${x===f?'on':''}" onclick="tmp.f='${x}';pintarIdea()">${x}</button>`).join("")}</div>
    <div class="lbl-sel">${t3("Modelo","Modelo","Model")}</div>
    <div class="pills">${ESTILOS.map(x=>`<button class="pill ${x===e?'on':''}" onclick="tmp.e='${x}';pintarIdea()">${tEstilo(x)}</button>`).join("")}</div>
    <div class="idea-grid">
      <div>
        <div class="tabs">
          <button class="${tmp.fase==='sin'?'on':''}" onclick="cambiarFaseIdea('sin')">${t3("Sin pelota","Sem bola","Out of possession")}</button>
          <button class="${tmp.fase==='con'?'on':''}" onclick="cambiarFaseIdea('con')">${t3("Con pelota","Com bola","In possession")}</button>
        </div>
        <div id="ideaCancha">${svgIdea(f,e,tmp.fase)}</div>
      </div>
      <div>
        <div class="encaje"><div class="lbl-sel" style="margin:0">${t3("Encaje sistema + modelo","Encaixe sistema + modelo","System + model fit")}</div>
          ${pipsFit(fit)}<p>${porqueFit(e,f)}</p></div>
        <div class="gana"><b>${t3("Ganás","Você ganha","You gain")}</b>${ga.g.map(x=>`<div>+ ${L(x)}</div>`).join("")}</div>
        <div class="arriesga"><b>${t3("Arriesgás","Você arrisca","You risk")}</b>${ga.r.map(x=>`<div>− ${L(x)}</div>`).join("")}</div>
        <div class="auto-nota"><b>${t3("Automatismos","Automatismos","Automatisms")}</b>
          ${t3("Tu equipo aprende tu idea temporada a temporada y rinde cada vez mejor. Cuanto mejor encajan sistema y modelo, más rápido aprende. Si la cambiás, se pierde casi todo lo aprendido.",
            "Seu time aprende sua ideia temporada a temporada e rende cada vez melhor. Quanto melhor o encaixe, mais rápido aprende. Se mudar, perde quase tudo.",
            "Your team learns your idea season by season and keeps improving. The better the fit, the faster it learns. Change it and most of it is lost.")}</div>
      </div>
    </div>
    <div class="acciones">
      <button class="btn" onclick="confirmarIdea()">${T("buscarClub")}</button>
      <button class="btn sec" onclick="identidad()">${T("volver")}</button></div>`;
}
function cambiarFaseIdea(fz){
  tmp.fase=fz;
  const pts=formaIdea(tmp.f,tmp.e,fz), W=380,H=460;
  // se mueven las fichas (transición) y después se redibujan las ayudas visuales
  pts.forEach((p,i)=>{const g=document.getElementById("ij-"+i); if(g) g.style.transform=`translate(${p.x/100*W}px,${H-(p.Y/100)*H}px)`;});
  document.querySelectorAll("#s-idea .tabs button").forEach((b,i)=>b.classList.toggle("on",(i===0)===(fz==="sin")));
  setTimeout(()=>{ if(tmp.fase===fz){ const c=$("#ideaCancha"); if(c) c.innerHTML=svgIdea(tmp.f,tmp.e,fz); } },720);
}
function confirmarIdea(){
  S.sistemaPref=tmp.f; S.estiloPref=tmp.e;
  S.auto=30; S.autoPar=tmp.f+"|"+tmp.e;
  verOfertas();
}
