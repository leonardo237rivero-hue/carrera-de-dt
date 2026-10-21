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
 pos:{g:[{es:"Tenés la pelota y el ritmo del partido",pt:"Você tem a bola e o ritmo",en:"You own the ball and the tempo",
          p:{es:"porque tus pases cortos generan superioridad posicional: siempre hay uno libre entre líneas.",pt:"porque o passe curto gera superioridade posicional: sempre há um livre entre linhas.",en:"because short passing creates positional superiority: there's always someone free between the lines."}},
         {es:"El rival corre detrás y se cansa",pt:"O rival corre atrás e cansa",en:"The opponent chases and tires",
          p:{es:"porque defender sin pelota desgasta más que atacar con ella.",pt:"porque defender sem bola desgasta mais.",en:"because defending without the ball is more tiring than attacking with it."}}],
      r:[{es:"Si la perdés saliendo, te agarran mal parado",pt:"Se perder na saída, te pegam desarrumado",en:"Lose it while building and you're exposed",
          p:{es:"si el rival presiona alto, porque tus laterales están arriba y abiertos.",pt:"se o rival pressionar alto, porque seus laterais estão lá em cima.",en:"if they press high, because your full-backs are up and wide."}},
         {es:"Contra un bloque bajo te cuesta llegar",pt:"Contra bloco baixo custa chegar",en:"A low block is hard to break",
          p:{es:"si el rival se mete atrás, porque no queda espacio a la espalda para el pase filtrado.",pt:"se o rival recuar, porque não sobra espaço nas costas.",en:"if they sit deep, because there's no space in behind for the through ball."}}]},
 pre:{g:[{es:"Robás cerca del arco rival",pt:"Rouba perto do gol rival",en:"You win the ball near their goal",
          p:{es:"porque saltás con superioridad numérica sobre sus centrales: 3 contra 2.",pt:"porque salta com superioridade numérica sobre os zagueiros: 3 contra 2.",en:"because you jump with numerical superiority on their centre-backs: 3 v 2."}},
         {es:"Le quitás tiempo para pensar",pt:"Tira o tempo de pensar",en:"They have no time to think",
          p:{es:"porque el que recibe ya tiene a uno encima.",pt:"porque quem recebe já tem alguém em cima.",en:"because whoever receives already has someone on him."}}],
      r:[{es:"Si te saltan la presión, queda campo a tu espalda",pt:"Se pularem a pressão, sobra campo nas costas",en:"If they bypass the press, there's space behind",
          p:{es:"si el rival juega directo, porque tu línea está alta y lejos del arquero.",pt:"se o rival jogar direto, porque sua linha está alta.",en:"if they go direct, because your line is high and far from the keeper."}},
         {es:"Desgasta: tus jugadores se cansan más",pt:"Desgasta: seus jogadores cansam mais",en:"It's draining: your players tire faster",
          p:{es:"siempre: en una temporada larga, el banco empieza a jugar.",pt:"sempre: numa temporada longa, o banco entra em jogo.",en:"always: over a long season, your bench comes into play."}}]},
 con:{g:[{es:"Aprovechás cada espacio a la espalda",pt:"Aproveita cada espaço nas costas",en:"You exploit every gap in behind",
          p:{es:"porque robás con el rival desordenado y tus de arriba ya están lanzados: superioridad cualitativa en velocidad.",pt:"porque rouba com o rival desarrumado: superioridade qualitativa em velocidade.",en:"because you win it with them disorganised and your forwards already running: qualitative superiority in pace."}},
         {es:"No necesitás la pelota para hacer daño",pt:"Não precisa da bola para machucar",en:"You don't need the ball to hurt them",
          p:{es:"porque tres pases bastan para llegar al arco.",pt:"porque três passes bastam para chegar ao gol.",en:"because three passes are enough to reach goal."}}],
      r:[{es:"Si te esperan atrás, no hay espacio para correr",pt:"Se esperarem atrás, não há espaço",en:"If they sit deep, there's no space to run",
          p:{es:"si el rival también se repliega: dos equipos esperando, y gana el que tiene mejores jugadores.",pt:"se o rival também recuar: ganha quem tem melhores jogadores.",en:"if they drop off too: two teams waiting, and the better players win."}},
         {es:"Si te encierran, sufrís",pt:"Se te prenderem, você sofre",en:"If they pin you back, you suffer",
          p:{es:"si el rival tiene más calidad con pelota, porque te tiene 70 minutos en tu campo.",pt:"se o rival tiver mais qualidade, te prende no seu campo.",en:"if they're better on the ball, they keep you in your half for 70 minutes."}}]},
 blo:{g:[{es:"Muy difícil de romper",pt:"Muito difícil de furar",en:"Very hard to break down",
          p:{es:"porque cerca de tu área tenés superioridad numérica: diez detrás de la pelota.",pt:"porque perto da sua área você tem superioridade numérica.",en:"because near your box you have numerical superiority: ten behind the ball."}},
         {es:"Pocos goles en contra",pt:"Poucos gols sofridos",en:"Few goals conceded",
          p:{es:"porque no hay espacio a tu espalda para que te ataquen.",pt:"porque não há espaço nas suas costas.",en:"because there's no space behind you to attack."}}],
      r:[{es:"Cedés la pelota y el terreno",pt:"Cede a bola e o terreno",en:"You concede ball and territory",
          p:{es:"siempre: el rival decide dónde y cuándo se juega.",pt:"sempre: o rival decide onde e quando se joga.",en:"always: they decide where and when the game is played."}},
         {es:"Si te hacen un gol, cuesta darlo vuelta",pt:"Se levar um gol, custa virar",en:"Concede first and it's hard to turn around",
          p:{es:"si el rival convierte primero, porque tu equipo no está armado para ir a buscar.",pt:"se o rival marcar primeiro, seu time não foi feito para buscar.",en:"if they score first, because your team isn't built to chase a game."}}]}
};
// los cuatro tipos de superioridad (en el lenguaje del curso de entrenador) y cuál busca cada modelo
const SUPERIORIDADES=[
 {id:"num",n:{es:"Numérica",pt:"Numérica",en:"Numerical"},d:{es:"Más jugadores que el rival en una zona: 3 contra 2.",pt:"Mais jogadores que o rival numa zona: 3 contra 2.",en:"More players than the opponent in a zone: 3 v 2."}},
 {id:"pos",n:{es:"Posicional",pt:"Posicional",en:"Positional"},d:{es:"Estar bien ubicado: entre líneas, a la espalda del que presiona.",pt:"Estar bem posicionado: entre linhas, nas costas de quem pressiona.",en:"Being well placed: between the lines, behind whoever presses."}},
 {id:"cual",n:{es:"Cualitativa",pt:"Qualitativa",en:"Qualitative"},d:{es:"Tu mejor jugador contra uno peor: el mano a mano que ganás.",pt:"Seu melhor jogador contra um pior: o mano a mano que você ganha.",en:"Your best player against a weaker one: the 1 v 1 you win."}},
 {id:"soc",n:{es:"Socioafectiva",pt:"Socioafetiva",en:"Socio-affective"},d:{es:"Se conocen de memoria: automatismos, confianza, el vestuario.",pt:"Se conhecem de cor: automatismos, confiança, o vestiário.",en:"They know each other by heart: automatisms, trust, the dressing room."}}];
const SUP_MODELO={pos:["pos","num"],pre:["num","soc"],con:["cual","pos"],blo:["num","soc"]};
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
function formaIdea(f,e,fase,m){
  let me=MID[e];
  if(m) me=fase==="sin"?({alto:"pre",medio:"med",bajo:"blo"})[m.def]:(m.ofe==="posicional"?"pos":"con");
  return ONCE[f].map(s=>{
    let x=s[1], y=s[2], Y;
    if(s[0]==="POR") return {rol:s[0],x,Y:fase==="sin"?5:(me==="pre"||me==="pos"?12:7)};
    if(fase==="sin"){
      const [a,b]={pre:[40,.5],pos:[28,.52],med:[20,.5],con:[16,.52],blo:[3,.48]}[me]; Y=a+b*y;
      if(me==="blo"||me==="con"||me==="med") x=50+(x-50)*0.82;
    } else {
      if(me==="pos"){ Y=24+0.66*y; if(/^(LT|CA)/.test(s[0])){Y+=16;x=x<50?5:95;} if(/^EX/.test(s[0]))x=x<50?10:90;
        // el 5 baja a recibir y los interiores se adelantan: así se arma el triángulo del medio
        if(f==="4-3-3"&&s[0]==="MC") Y-=10; if(f==="4-3-3"&&/^M[ID]$/.test(s[0])) Y+=4; }
      else if(me==="pre"){ Y=30+0.63*y; if(/^(LT|CA)/.test(s[0])) Y+=10; }
      else if(me==="con"){ Y=ROL[s[0]].g==="ATA"?78+0.1*y:10+0.55*y; if(s[0]==="MCO")Y=62; }
      else { Y=ROL[s[0]].g==="ATA"?62+0.15*y:6+0.45*y; }
    }
    return {rol:s[0],x,Y};
  });
}
const IW=380, IH=420;
function camIdea(){ return camara({ancho:IW,top:22,bot:404,hw:206}); }
function svgIdea(f,e,fase,m){
  const P=camIdea(), pts=formaIdea(f,e,fase,m);
  let me=MID[e];
  if(m) me=fase==="sin"?({alto:"pre",medio:"con",bajo:"blo"})[m.def]:(m.ofe==="posicional"?"pos":(m.tofe==="contra"?"con":"blo"));
  const campo=pts.filter(p=>p.rol!=="POR");
  let extra="", pelota=null, cartel="";
  if(fase==="con"&&(me==="pos"||me==="pre")){
    extra=triangulosSVG(P,f,pts,true);
    pelota=pelotaTriangulo(f,pts);
    const t0=(TRIANGULOS[f]||[])[0];
    if(t0){ const cx=t0.reduce((a,i)=>a+pts[i].x,0)/3, cy=t0.reduce((a,i)=>a+pts[i].Y,0)/3, q=P(cx,cy+1.5);
      cartel=cartelSVG(q.x,q.y,t3("TRIÁNGULO ACTIVO","TRIÂNGULO ATIVO","ACTIVE TRIANGLE"),true); }
  }
  const flecha=(a,b,col,dash,ancho)=>`<path d="${segD(P,a,b,0,6)}" fill="none" stroke="${col}" stroke-width="${ancho||2.4}" ${dash?`stroke-dasharray="${dash}"`:""} stroke-linecap="round" marker-end="url(#fl-${col==="#F05A4A"?"r":"a"})"/>`;
  if(fase==="sin"&&me==="pre"){
    extra=campo.filter(p=>p.Y>55).map(p=>flecha([p.x,p.Y],[p.x+(50-p.x)*0.15,p.Y+11],"#F05A4A")).join("")
      +`<path d="${segD(P,[2,47],[98,47])}" stroke="#F2B33D" stroke-dasharray="6 5" stroke-width="1.6" fill="none"/>`;
    const q=P(97,47); cartel=`<text x="${q.x}" y="${q.y-6}" text-anchor="end" class="ficha-et" fill="#F2B33D">${t3("LÍNEA ALTA","LINHA ALTA","HIGH LINE")}</text>`;
  }
  if(fase==="sin"&&(me==="blo"||me==="con")){
    const y0=me==="blo"?6:16, y1=me==="blo"?40:52;
    extra=`<path d="${poliD(P,[[4,y0],[96,y0],[96,y1],[4,y1]])}" fill="rgba(111,168,220,.12)" stroke="#6FA8DC" stroke-dasharray="5 5" stroke-width="1.4"/>`;
    const q=P(6,y1); cartel=`<text x="${q.x+4}" y="${q.y+14}" class="ficha-et" fill="#9CC3E8">${me==="blo"?t3("BLOQUE BAJO","BLOCO BAIXO","LOW BLOCK"):t3("BLOQUE MEDIO","BLOCO MÉDIO","MID BLOCK")}</text>`;
  }
  if(fase==="con"&&me==="con"){
    extra=campo.filter(p=>ROL[p.rol].g==="ATA").map(p=>flecha([p.x,p.Y-24],[p.x,p.Y+10],"#F2B33D")).join("");
  }
  if(fase==="con"&&me==="blo"){
    const dc=campo.filter(p=>p.rol==="DC")[0]||campo[campo.length-1], cen=campo.find(p=>p.rol==="DFC");
    extra=flecha([cen.x,cen.Y],[dc.x,dc.Y],"#F2B33D","8 6");
  }
  if(fase==="sin"&&(m?m.tdef==="presion":me==="pos")){
    extra+=campo.filter(p=>p.Y>(m&&m.def==="bajo"?30:44)).map(p=>{const q=P(p.x,p.Y); const r=24*escFicha(q.s);
      return `<ellipse cx="${q.x}" cy="${q.y}" rx="${r}" ry="${r*.62}" fill="none" stroke="#F05A4A" stroke-width="1.6" stroke-dasharray="3 4" opacity=".8"/>`;}).join("");
    const q=P(50,93); cartel=`<g transform="translate(${q.x},${q.y})"><rect x="-74" y="-9" width="148" height="17" rx="3" fill="#0B1710" stroke="#F05A4A" stroke-width="1.2"/>
      <text y="4" text-anchor="middle" class="ficha-et" fill="#F5A79C">${t3("PRESIÓN TRAS PÉRDIDA","PRESSÃO PÓS-PERDA","COUNTER-PRESS")}</text></g>`;
  }
  const lineas=lineasIdea(P,campo,fase);
  return `<svg class="cancha persp idea" viewBox="0 0 ${IW} ${IH}" role="img" aria-label="${f} ${ESTILO_LBL[e]}">
    <defs><marker id="fl-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F2B33D"/></marker>
      <marker id="fl-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F05A4A"/></marker></defs>
    ${canchaFondo(P)}${lineas}${extra}
    ${pts.map((p,i)=>`<g class="mj" id="ij-${i}" style="transform:${fichaTransform(P,p.x,p.Y)}">${fichaSVG({etiqueta:tRol(p.rol).split(" ")[0].slice(0,3).toUpperCase(),pelota:p===pelota})}</g>`).join("")}
    ${cartel}${canchaVineta("vin-idea",IW,IH)}
  </svg>`;
}
// las líneas del equipo: largo (corto/largo) y altura del bloque (alto/medio/bajo)
function lineasIdea(P,campo,fase){
  const ys=campo.map(p=>p.Y), def=Math.min(...ys), ata=Math.max(...ys);
  const largo=Math.round((ata-def)*1.05);
  const tipoL=largo<=36?t3("CORTO","CURTO","SHORT"):largo<=50?t3("MEDIO","MÉDIO","MID"):t3("LARGO","LONGO","LONG");
  const alto=def>=36?t3("ALTO","ALTO","HIGH"):def>=20?t3("MEDIO","MÉDIO","MID"):t3("BAJO","BAIXO","LOW");
  const a=P(50,def), b=P(50,ata), xr=16;
  const linea=(Y,col)=>`<path d="${segD(P,[3,Y],[97,Y])}" stroke="${col}" stroke-width="1.1" stroke-dasharray="2 5" fill="none" opacity=".75"/>`;
  return `<g class="lineas-eq">${linea(def,"#9CC3E8")}${linea(ata,"#9CC3E8")}
    <path d="M${xr+6} ${a.y} L${xr} ${a.y} L${xr} ${b.y} L${xr+6} ${b.y}" fill="none" stroke="#9CC3E8" stroke-width="1.4"/>
    <text transform="translate(${xr-5},${(a.y+b.y)/2}) rotate(-90)" text-anchor="middle" class="ficha-et" fill="#9CC3E8">${t3("EQUIPO","TIME","TEAM")} ${tipoL} · ${largo} m</text>
    ${fase==="sin"?`<text x="${Math.min(IW-10,P(97,def).x)}" y="${a.y+13}" text-anchor="end" class="ficha-et" fill="#9CC3E8">${t3("BLOQUE","BLOCO","BLOCK")} ${alto}</text>`:""}</g>`;
}
function pintarIdea(){
  tmp.m=tmp.m||modeloDeEstilo(tmp.e||"Posesion"); tmp.e=estiloDeModelo(tmp.m);
  const f=tmp.f, e=tmp.e, me=MID[e], fit=FIT[e][f], ga=GANA_ARRIESGA[me];
  $("#s-idea").innerHTML=`
    <h2 class="disp">${t3("Tu idea de juego","Sua ideia de jogo","Your game idea")}</h2>
    <p class="mini">${t3("El sistema es dónde parás a tus jugadores. El modelo es qué hacen con y sin la pelota. Tienen que hablar el mismo idioma.",
      "O sistema é onde você posiciona os jogadores. O modelo é o que fazem com e sem a bola. Precisam falar a mesma língua.",
      "The system is where your players stand. The model is what they do with and without the ball. They must speak the same language.")}</p>
    <div class="lbl-sel">${t3("Sistema","Sistema","System")}</div>
    <div class="pills">${FORMACIONES.map(x=>`<button class="pill ${x===f?'on':''}" onclick="tmp.f='${x}';pintarIdea()">${x}</button>`).join("")}</div>
    <div class="lbl-sel">${t3("Modelo: los cuatro momentos del juego","Modelo: os quatro momentos do jogo","Model: the four moments of the game")}</div>
    ${selectorModelo(tmp.m,"elegirMomentoIdea")}
    <p class="mini">${t3("Tu modelo se parece a","Seu modelo se parece com","Your model looks like")} <b>${tEstilo(e)}</b>.</p>
    <div class="idea-grid">
      <div>
        <div class="tabs">
          <button class="${tmp.fase==='sin'?'on':''}" onclick="cambiarFaseIdea('sin')">${t3("Sin pelota","Sem bola","Out of possession")}</button>
          <button class="${tmp.fase==='con'?'on':''}" onclick="cambiarFaseIdea('con')">${t3("Con pelota","Com bola","In possession")}</button>
        </div>
        <div id="ideaCancha">${svgIdea(f,e,tmp.fase,tmp.m)}</div>
        ${patronesDelModelo(tmp.m)}
      </div>
      <div>
        <div class="encaje"><div class="lbl-sel" style="margin:0">${t3("Encaje sistema + modelo","Encaixe sistema + modelo","System + model fit")}</div>
          ${pipsFit(fit)}<p>${porqueFit(e,f)}</p></div>
        <div class="gana"><b>${t3("Qué ganás","O que você ganha","What you gain")}</b>${ga.g.map(x=>`<div>+ ${L(x)} <span class="porque">${L(x.p)}</span></div>`).join("")}</div>
        <div class="arriesga"><b>${t3("Qué arriesgás","O que você arrisca","What you risk")}</b>${ga.r.map(x=>`<div>− ${L(x)} <span class="porque">${L(x.p)}</span></div>`).join("")}</div>
        <p class="mini">${t3("Todavía no conocés a los rivales: esto es lo que tu idea <i>tiende</i> a dar. Contra quién funciona de verdad lo ves cada temporada, en tu plan contra el clásico.",
          "Você ainda não conhece os rivais: isto é o que sua ideia <i>tende</i> a dar. Contra quem funciona de verdade você vê a cada temporada.",
          "You don't know your opponents yet: this is what your idea <i>tends</i> to give. Who it really works against, you'll see each season in your plan.")}</p>
        <div class="superioridades"><b>${t3("Las cuatro superioridades","As quatro superioridades","The four superiorities")}</b>
          ${SUPERIORIDADES.map(x=>`<div class="sup-t ${SUP_MODELO[me].includes(x.id)?'on':''}"><span>${L(x.n)}</span>${L(x.d)}</div>`).join("")}
          <div class="mini">${t3("Resaltadas: las que busca tu modelo.","Destacadas: as que seu modelo busca.","Highlighted: the ones your model looks for.")}</div></div>
        <div class="auto-nota"><b>${t3("Automatismos · superioridad socioafectiva","Automatismos · superioridade socioafetiva","Automatisms · socio-affective superiority")}</b>
          ${t3("Tu equipo aprende tu idea temporada a temporada y rinde cada vez mejor. Cuanto mejor encajan sistema y modelo, más rápido aprende. Si la cambiás, se pierde casi todo lo aprendido.",
            "Seu time aprende sua ideia temporada a temporada e rende cada vez melhor. Quanto melhor o encaixe, mais rápido aprende. Se mudar, perde quase tudo.",
            "Your team learns your idea season by season and keeps improving. The better the fit, the faster it learns. Change it and most of it is lost.")}</div>
      </div>
    </div>
    <div class="acciones">
      <button class="btn" onclick="confirmarIdea()">${T("buscarClub")}</button>
      <button class="btn sec" onclick="identidad()">${T("volver")}</button></div>`;
}
function elegirMomentoIdea(mid,oid){ tmp.m[mid]=oid; tmp.e=estiloDeModelo(tmp.m); pintarIdea(); }
function cambiarFaseIdea(fz){
  tmp.fase=fz;
  const pts=formaIdea(tmp.f,tmp.e,fz,tmp.m), P=camIdea();
  // se mueven las fichas (transición) y después se redibujan las ayudas visuales
  pts.forEach((p,i)=>{const g=document.getElementById("ij-"+i); if(g) g.style.transform=fichaTransform(P,p.x,p.Y);});
  document.querySelectorAll("#s-idea .tabs button").forEach((b,i)=>b.classList.toggle("on",(i===0)===(fz==="sin")));
  setTimeout(()=>{ if(tmp.fase===fz){ const c=$("#ideaCancha"); if(c) c.innerHTML=svgIdea(tmp.f,tmp.e,fz,tmp.m); } },720);
}
function confirmarIdea(){
  S.sistemaPref=tmp.f; S.estiloPref=tmp.e; S.modelo=Object.assign({},tmp.m); S.modeloPref=Object.assign({},tmp.m);
  S.auto=30; S.autoPar=tmp.f+"|"+tmp.e;
  verOfertas();
}
