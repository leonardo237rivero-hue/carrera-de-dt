// Carrera de DT — EL VESTUARIO: la arenga antes de salir y la tanda de penales.
// Las dos cosas se leen igual: cada jugador tiene un carácter fijo (no se muestra, se adivina
// por cómo está antes del partido), y el que lo conoce elige mejor.

/* ---------- el carácter de cada uno ---------- */
// Sale del nombre: el mismo jugador es siempre el mismo tipo en toda la carrera, así el
// que presta atención aprende quién se achica y quién se agranda.
const CARACTERES=["frio","lider","nervioso","agrandado","calenton","tranquilo"];
function caracter(j){
  if(!j.car){
    let c=CARACTERES[hashTxt(j.nom)%CARACTERES.length];
    if(j.ed<=21&&c==="lider") c="nervioso";       // a los 20 nadie es la voz del vestuario
    if(j.ed>=32&&c==="nervioso") c="tranquilo";   // y a los 32 ya pasó por todo
    j.car=c;
  }
  return j.car;
}
// cuántos partidos grandes jugó (se suma en cada partido en vivo)
function rodaje(j){ return j.gr||0; }
// lo que se ve de él antes de salir: la pista del carácter, no el carácter
function estadoVestuario(j,ctx){
  const c=caracter(j), h=hashTxt(j.nom+(ctx&&ctx.semilla||""))%2;
  const E={
    frio:[{es:"callado, con los auriculares puestos",pt:"calado, de fones",en:"quiet, headphones on"},{es:"concentrado, ni mira a nadie",pt:"concentrado, nem olha ninguém",en:"focused, looks at no one"}],
    lider:[{es:"habla con los pibes, uno por uno",pt:"fala com os garotos, um por um",en:"talks to the kids one by one"},{es:"golpea las manos y apura a todos",pt:"bate palmas e apressa todo mundo",en:"claps and hurries everyone"}],
    nervioso:[{es:"no levanta la vista del piso",pt:"não tira os olhos do chão",en:"can't lift his eyes off the floor"},{es:"va al baño por tercera vez",pt:"vai ao banheiro pela terceira vez",en:"third trip to the toilet"}],
    agrandado:[{es:"hace jueguitos y se ríe",pt:"faz embaixadinhas e ri",en:"juggling the ball, laughing"},{es:"dice que hoy la mete seguro",pt:"diz que hoje marca com certeza",en:"says he's scoring tonight for sure"}],
    calenton:[{es:"acelerado, pateando el piso",pt:"acelerado, chutando o chão",en:"wired, stamping the floor"},{es:"quiere salir ya, no aguanta",pt:"quer sair já, não aguenta",en:"wants out now, can't wait"}],
    tranquilo:[{es:"charla con el utilero como un martes",pt:"conversa com o roupeiro como numa terça",en:"chatting with the kit man like any Tuesday"},{es:"se ata los botines sin apuro",pt:"amarra a chuteira sem pressa",en:"ties his boots, no hurry"}]
  };
  const extra=[];
  if((j.fat||0)>=55) extra.push(t3("con hielo en el gemelo","com gelo na panturrilha","ice on his calf"));
  if((j.forma||0)<=-3) extra.push(t3("serio: viene de jugar mal","sério: vem jogando mal","serious: he's been poor lately"));
  if((j.forma||0)>=3) extra.push(t3("suelto: viene enchufado","solto: vem voando","loose: he's flying"));
  if(!rodaje(j)&&j.ed<=22) extra.push(t3("primer partido grande","primeiro jogo grande","first big game"));
  return [L(E[c][h])].concat(extra.slice(0,1)).join(" · ");
}

/* ---------- LA ARENGA ---------- */
// Tres frases en orden (abrir, el mensaje, cerrar). Cada una tiene un tono, y cada tono pega
// distinto según el vestuario (país y club), el momento (final, clásico, venís de perder),
// el lugar de la frase en la charla y la cabeza de cada uno.
const TONOS=["calma","orgullo","bronca","tactica","grupo","hinchada"];
function nomTono(t){ return L({calma:{es:"calma",pt:"calma",en:"calm"},orgullo:{es:"orgullo",pt:"orgulho",en:"pride"},bronca:{es:"bronca",pt:"raiva",en:"anger"},
  tactica:{es:"táctica",pt:"tática",en:"tactics"},grupo:{es:"grupo",pt:"grupo",en:"team"},hinchada:{es:"hinchada",pt:"torcida",en:"fans"}}[t]); }
// qué le entra a cada vestuario (son tendencias de vestuario, no reglas: el club y el momento mueven todo)
const CULTURA={
  "Uruguay":{orgullo:1.4,bronca:0.8,grupo:1,calma:-0.4,tactica:0,hinchada:0.4},
  "Argentina":{hinchada:1.4,orgullo:1,bronca:0.6,grupo:0.4,calma:-0.4,tactica:0},
  "Brasil":{grupo:1.4,hinchada:0.9,calma:0.5,orgullo:0.4,bronca:-0.8,tactica:0},
  "España":{tactica:1.4,calma:0.9,grupo:0.5,orgullo:0,bronca:-0.8,hinchada:0},
  "Inglaterra":{orgullo:1,bronca:0.9,grupo:0.6,hinchada:0.5,tactica:0,calma:0},
  "Italia":{tactica:1.4,calma:1,orgullo:0.5,bronca:0,grupo:0,hinchada:-0.4},
  "Alemania":{tactica:1.3,grupo:1,calma:0.5,orgullo:0,bronca:-0.4,hinchada:0},
  "Francia":{grupo:1,tactica:1,calma:0.6,orgullo:0,bronca:-0.4,hinchada:0},
  "Estados Unidos":{grupo:1.4,tactica:0.9,calma:0.5,orgullo:0.4,bronca:-0.8,hinchada:0},
  "Arabia Saudita":{orgullo:1,hinchada:1,grupo:0.9,calma:0,tactica:0,bronca:-0.4}
};
const CULTURA_BASE={grupo:0.8,orgullo:0.6,calma:0.4,tactica:0.4,bronca:0,hinchada:0.4};
// la frase según dónde va en la charla
const LUGAR={
  apertura:{calma:1,grupo:0.5,orgullo:0.3,tactica:-0.3,bronca:-0.6,hinchada:-0.3},
  mensaje:{tactica:1,grupo:0.5,calma:0.3,orgullo:0,bronca:0,hinchada:-0.5},
  cierre:{hinchada:1,orgullo:1,bronca:0.7,grupo:0.3,tactica:-0.7,calma:-0.5}
};
const LUGARES=["apertura","mensaje","cierre"];
function nomLugar(l){ return L({apertura:{es:"Para abrir",pt:"Para abrir",en:"Opening"},mensaje:{es:"El mensaje",pt:"A mensagem",en:"The message"},cierre:{es:"Para cerrar",pt:"Para fechar",en:"To close"}}[l]); }
// cómo le entra cada tono a cada cabeza (−2 a +2)
const REACCION={
  nervioso:{calma:2,orgullo:0,bronca:-2,tactica:1,grupo:1,hinchada:-1},
  agrandado:{calma:0,orgullo:-1,bronca:1,tactica:2,grupo:0,hinchada:1},
  lider:{calma:0,orgullo:2,bronca:1,tactica:0,grupo:2,hinchada:1},
  frio:{calma:1,orgullo:0,bronca:-1,tactica:2,grupo:0,hinchada:-1},
  calenton:{calma:1,orgullo:1,bronca:-2,tactica:0,grupo:1,hinchada:0},
  tranquilo:{calma:0,orgullo:1,bronca:1,tactica:1,grupo:1,hinchada:1}
};
function frasesArenga(V){
  const p=V.an0&&V.an0.mis[0], z=p?p.zona:14, pat=p?L(p.p.n).toLowerCase():t3("lo nuestro","o nosso","our stuff");
  const riv=V.info.rival.club.n, local=V.info.soyA&&!V.info.neutral;
  const cap=(S.esSeleccion?55000:(S.club.niv||2)*12000+(S.estadio||1)*4000)*(local?1:0.08);
  const gente=Math.round(cap/500)*500;
  return {
    calma:[{es:"Respiren. Esto es lo mismo que hacemos todos los martes.",pt:"Respirem. É o mesmo que fazemos toda terça.",en:"Breathe. This is what we do every Tuesday."},
      {es:"Nadie gana esto en el primer minuto. Tranquilos con la pelota.",pt:"Ninguém ganha isso no primeiro minuto. Calma com a bola.",en:"Nobody wins this in the first minute. Easy on the ball."}],
    orgullo:[{es:"Miren el escudo que tienen en el pecho. Eso no se negocia.",pt:"Olhem o escudo no peito. Isso não se negocia.",en:"Look at the badge on your chest. That's not up for negotiation."},
      {es:"Hay gente que dejó todo por esta camiseta. Hoy nos toca a nosotros.",pt:"Tem gente que deu tudo por essa camisa. Hoje é a nossa vez.",en:"People gave everything for this shirt. Today it's our turn."}],
    bronca:[{es:`Toda la semana hablaron de ${riv}. Vamos a hacerlos callar.`,pt:`A semana toda falaram do ${riv}. Vamos calar todo mundo.`,en:`All week it's been ${riv}, ${riv}. Let's shut them up.`},
      {es:"Nos ningunearon. Salgan con hambre.",pt:"Nos desprezaram. Saiam com fome.",en:"They wrote us off. Go out hungry."}],
    tactica:[{es:`Lo que trabajamos: ${pat}, zona ${z}. Ahí está el partido.`,pt:`O que treinamos: ${pat}, zona ${z}. O jogo está ali.`,en:`What we worked on: ${pat}, zone ${z}. That's where the game is.`},
      {es:"Si los primeros quince minutos estamos ordenados, el partido es nuestro.",pt:"Se os primeiros quinze minutos formos organizados, o jogo é nosso.",en:"If we're organised for the first fifteen, the game is ours."}],
    grupo:[{es:"Mírense. El de al lado es tu hermano. Nadie corre solo.",pt:"Olhem-se. O do lado é seu irmão. Ninguém corre sozinho.",en:"Look at each other. The man next to you is your brother. Nobody runs alone."},
      {es:"Si uno se equivoca, lo tapamos entre todos.",pt:"Se um errar, cobrimos todos juntos.",en:"If one of us slips, we all cover."}],
    hinchada:[local?{es:`Afuera hay ${gente.toLocaleString("es")} personas que vinieron por ustedes. Devuélvanles algo.`,pt:`Lá fora tem ${gente.toLocaleString("pt")} pessoas que vieram por vocês.`,en:`There are ${gente.toLocaleString("en")} people out there who came for you. Give them something.`}
        :{es:`Allá arriba hay ${gente.toLocaleString("es")} de los nuestros que viajaron para esto. Que se vuelvan contentos.`,pt:`Lá em cima tem ${gente.toLocaleString("pt")} dos nossos que viajaram para isso.`,en:`Up there are ${gente.toLocaleString("en")} of ours who travelled for this. Send them home happy.`},
      {es:"Escuchen la tribuna. Esa gente vive para esto.",pt:"Escutem a arquibancada. Essa gente vive para isso.",en:"Listen to the stands. Those people live for this."}]
  };
}
// el contexto que mueve cada tono (no se le muestra al jugador como números: se cuenta)
function contextoArenga(V){
  const info=V.info, c={calma:0,orgullo:0,bronca:0,tactica:0,grupo:0,hinchada:0}, notas=[];
  const cul=CULTURA[S.club.p]||CULTURA_BASE; TONOS.forEach(t=>c[t]+=cul[t]||0);
  const niv=S.club.niv||3;
  if(niv<=2){ c.hinchada+=0.5; c.orgullo+=0.5; notas.push(t3("Club chico: acá el escudo y la gente pesan.","Clube pequeno: aqui o escudo e a torcida pesam.","Small club: the badge and the fans weigh heavy here.")); }
  if(niv>=5){ c.calma+=0.5; c.bronca-=0.3; notas.push(t3("Club grande: la presión ya la traen de casa.","Clube grande: a pressão já vem de casa.","Big club: they bring the pressure from home.")); }
  if(info.tipo==="final"){ c.calma+=0.6; c.bronca-=0.5; notas.push(t3("Es una final: las piernas pesan el doble.","É uma final: as pernas pesam o dobro.","It's a final: legs weigh double.")); }
  if(info.tipo==="clasico"){ c.hinchada+=0.7; c.bronca+=0.3; notas.push(t3("Clásico: la semana entera fue de esto.","Clássico: a semana inteira foi disso.","Derby: the whole week was about this.")); }
  if(info.tipo==="copa") notas.push(t3("Eliminación directa: el que pierde se va a casa.","Mata-mata: quem perde vai para casa.","Knockout: the loser goes home."));
  if(info.historico){ c.orgullo+=0.6; c.hinchada+=0.4; notas.push(t3("Nadie en este club jugó un partido así. Nadie.","Ninguém neste clube jogou um jogo assim.","No one at this club has ever played a game like this.")); }
  if(info.tipo==="definicion"){ c.grupo+=0.5; c.calma+=0.3; notas.push(t3("Se define todo: el que se apura, pierde.","Define tudo: quem se apressa, perde.","Everything's on the line: whoever rushes, loses.")); }
  const ult=(S.temp&&S.temp.mis||[]).slice(-1)[0];
  if(ult&&ult.gf<ult.gc){ c.orgullo+=0.5; c.calma-=0.3; notas.push(t3("Vienen de perder: hay que levantarlos.","Vêm de derrota: precisa levantá-los.","Coming off a defeat: they need lifting.")); }
  if(ult&&ult.gf>ult.gc+1){ c.calma+=0.3; c.bronca-=0.3; }
  if(!info.soyA&&!info.neutral){ c.hinchada-=0.5; } // de visitante, la tribuna es de ellos
  // lo repetido pierde fuerza: el vestuario ya te lo escuchó
  (S.arengaUlt||[]).forEach(t=>{ c[t]-=0.45; });
  return {c,notas};
}
function carasArenga(once){
  const js=once.map(o=>o.jug).filter(j=>j&&j.nom);
  const usados=new Set(), out=[];
  const agrega=(j,rol)=>{ if(j&&!usados.has(j)&&out.length<5){ usados.add(j); out.push({j,rol}); } };
  agrega(js.slice().sort((a,b)=>(b.ed-a.ed)||(b.rt-a.rt))[0],t3("capitán","capitão","captain"));
  agrega(js.slice().sort((a,b)=>b.rt-a.rt)[0],t3("figura","craque","star"));
  agrega(js.slice().sort((a,b)=>a.ed-b.ed)[0],t3("el más pibe","o mais novo","youngest"));
  // los que más se notan en un vestuario: nerviosos, calentones y agrandados primero
  ["nervioso","calenton","agrandado","frio","lider","tranquilo"].forEach(c=>agrega(js.find(j=>!usados.has(j)&&caracter(j)===c),""));
  return out;
}
function abrirArenga(){
  const V=tmp.vivo;
  const once=miEquipo(V.info.rival).once;
  const ctx=contextoArenga(V), fr=frasesArenga(V);
  // de cada tono sale una frase (al azar entre dos), las seis en orden mezclado
  V.arenga={caras:carasArenga(once),ctx,ops:R.mz(TONOS.slice()).map(t=>({t,txt:L(R.el(fr[t]))})),elegidas:[],hecha:false};
  pintarArenga(); ir("partido");
}
function reaccionCara(c,tono){ return REACCION[caracter(c.j)][tono]; }
const CARA_EMO={2:"🔥",1:"💪",0:"😐","-1":"😬","-2":"😤"};
function cuentaArenga(A){
  // por frase: vestuario (cultura+momento) + lugar en la charla; las caras suman lo suyo
  let base=0, caras=0;
  A.elegidas.forEach((i,k)=>{ const t=A.ops[i].t; base+=A.ctx.c[t]+LUGAR[LUGARES[k]][t];
    caras+=A.caras.reduce((s,c)=>s+reaccionCara(c,t),0)/A.caras.length; });
  return clamp((base+caras*0.8)/6,-1,1);
}
function pintarArenga(){
  const V=tmp.vivo, A=V.arenga, rv=V.info.rival;
  const sum=A.caras.map(c=>A.elegidas.reduce((s,i)=>s+reaccionCara(c,A.ops[i].t),0));
  const listo=A.elegidas.length===3, s=listo?cuentaArenga(A):0;
  $("#s-partido").innerHTML=`
    <div class="arenga">
      <div class="pv-se">${t3("VESTUARIO","VESTIÁRIO","DRESSING ROOM")} · ${V.info.titulo}</div>
      <h2 class="disp">${t3("La charla antes de salir","A conversa antes de entrar","The talk before walking out")}</h2>
      <p class="mini">${A.ctx.notas.join(" ")||t3("Un partido de los que se recuerdan.","Um jogo dos que se lembram.","One of the games people remember.")}</p>
      <div class="ar-caras">${A.caras.map((c,k)=>{ const r=A.elegidas.length?reaccionCara(c,A.ops[A.elegidas[A.elegidas.length-1]].t):null;
        const tot=sum[k], cls=!A.elegidas.length?"":tot>=2?"ok":tot<=-2?"mal":"med";
        return `<div class="ar-cara ${cls}">
          <div class="ar-av" style="background:${S.club.c[0]};color:${txtSobre(S.club.c[0])}">${iniciales(c.j.nom)}${r!=null?`<span class="ar-emo" aria-hidden="true">${CARA_EMO[r]}</span>`:""}</div>
          <b>${apellido(c.j.nom)}</b><span class="mini">${c.rol?c.rol+" · ":""}${c.j.ed} ${t3("años","anos","y/o")}</span>
          <span class="ar-est">${estadoVestuario(c.j,{semilla:V.info.titulo})}</span></div>`; }).join("")}</div>
      <div class="ar-orden">${LUGARES.map((l,k)=>{ const i=A.elegidas[k]; return `<div class="ar-slot ${i!=null?'lleno':''}"><span>${k+1}. ${nomLugar(l)}</span>${i!=null?`<b>“${A.ops[i].txt}”</b>`:`<i>${t3("elegí una frase","escolha uma frase","pick a line")}</i>`}</div>`; }).join("")}</div>
      ${listo?"":`<div class="ar-frases">${A.ops.map((o,i)=>{ const usada=A.elegidas.includes(i);
        return `<button class="card ar-frase" ${usada?'disabled':''} onclick="elegirFrase(${i})"><span class="ar-tono">${nomTono(o.t)}</span>“${o.txt}”</button>`; }).join("")}</div>`}
      ${listo?`<div class="alerta ${s>0.25?'ok':s<-0.1?'mal':''}">${lecturaArenga(s,A,sum)}</div>`:""}
      <div class="acciones">
        ${listo?`<button class="btn" onclick="salirDeArenga()">${t3("A la cancha","Para o campo","Out we go")}</button>`:""}
        ${A.elegidas.length?`<button class="btn sec" onclick="tmp.vivo.arenga.elegidas.pop();pintarArenga()">${t3("Deshacer","Desfazer","Undo")}</button>`:""}
        ${listo?"":`<button class="btn sec" onclick="salirDeArenga(true)">${t3("Sin charla: que salgan","Sem conversa: que entrem","No talk: let them go")}</button>`}
      </div>
    </div>`;
  cabecera();
}
function txtSobre(hex){ const h=String(hex||"#000").replace("#",""); const v=parseInt(h.slice(0,2),16)*0.299+parseInt(h.slice(2,4),16)*0.587+parseInt(h.slice(4,6),16)*0.114; return v>150?"#0A0F0C":"#FFFFFF"; }
function iniciales(n){ const p=String(n||"").split(" ").filter(Boolean); return ((p[0]||"?")[0]+(p.length>1?p[p.length-1][0]:"")).toUpperCase(); }
function elegirFrase(i){ const A=tmp.vivo.arenga; if(A.elegidas.length<3&&!A.elegidas.includes(i)){ A.elegidas.push(i); pintarArenga(); } }
// lo que se lee al terminar la charla: palabras, no números
function lecturaArenga(s,A,sum){
  const peor=A.caras[sum.indexOf(Math.min(...sum))], mejor=A.caras[sum.indexOf(Math.max(...sum))];
  const g=s>0.45?t3("El vestuario explotó. Salen a comerse la cancha.","O vestiário explodiu. Saem para engolir o campo.","The room erupted. They're out to eat the pitch.")
    :s>0.15?t3("Les llegó. Salen convencidos.","Chegou neles. Saem convencidos.","It landed. They walk out convinced.")
    :s>-0.1?t3("Escucharon. Ni más ni menos.","Escutaram. Nem mais nem menos.","They listened. No more, no less.")
    :t3("No te la compraron. Salen tensos.","Não compraram. Saem tensos.","They didn't buy it. They walk out tense.");
  const extra=[];
  if(Math.max(...sum)>=3) extra.push(`${apellido(mejor.j.nom)} ${t3("sale encendido","sai ligado","walks out fired up")}.`);
  if(Math.min(...sum)<=-2) extra.push(`${apellido(peor.j.nom)} ${t3("se quedó mirando el piso","ficou olhando o chão","was left staring at the floor")}.`);
  return g+" "+extra.join(" ");
}
function salirDeArenga(sin){
  const V=tmp.vivo, A=V.arenga;
  if(!sin&&A&&A.elegidas.length===3){
    const s=cuentaArenga(A);
    V.arengaV=Math.round(s*0.1*1000)/1000; // en los patrones: ±0,10 en el primer tiempo, la mitad en el segundo
    // cada uno se lleva su reacción a la cancha (pesa en los penales de este partido)
    A.caras.forEach(c=>{ c.j._ar=A.elegidas.reduce((x,i)=>x+reaccionCara(c,A.ops[i].t),0); });
    // lo que se repite pierde fuerza la próxima vez
    S.arengaUlt=A.elegidas.map(i=>A.ops[i].t);
    V.arengaTxt=s;
  } else { V.arengaV=0; S.arengaUlt=[]; }
  arrancarVivo();
}

/* ---------- LOS PENALES ---------- */
// Elegís cinco y el orden. Lo que se ve: nivel, edad, forma, cansancio y lo que pasa en la
// entrada en calor. Lo que no se ve: el temple de cada uno (carácter, rodaje, penales errados,
// cómo salió de la charla). El quinto pesa más que el primero.
const PRESION=[0.7,0.85,0.95,1.05,1.4];
function templePenal(j,mio){
  let t=clamp(((j.ed||24)-24)*0.03,-0.18,0.24)+Math.min(rodaje(j),8)*0.03+(j.forma||0)*0.03-Math.max(0,(j.fat||0)-50)/100-(j.penE||0)*0.09;
  t+={frio:0.28,lider:0.16,tranquilo:0.06,agrandado:0.04,calenton:-0.1,nervioso:-0.32}[caracter(j)];
  if(mio&&j._ar!=null) t+=clamp(j._ar,-4,4)*0.04;
  return t;
}
function pPenal(o,k,porRt,mio){
  const j=o.jug, pres=k<5?PRESION[k]:1.2, t=templePenal(j,mio);
  let p=0.6+(o.rt-62)/150+(["DC","MCO","EXI","EXD"].includes(o.rol)?0.03:0)-((porRt||70)-72)/260;
  p+=t>=0?t*0.12:t*0.22*pres;
  if(caracter(j)==="agrandado"&&k===4) p-=0.04;         // el que pide el quinto para lucirse a veces la pica
  if((j.penT||0)>=3&&(porRt||0)>=78) p-=0.05;           // un buen arquero ya lo estudió
  if(o.rol==="POR") p-=0.14;
  return clamp(p,0.3,0.92);
}
function arqueroDe(once){ const o=(once||[]).find(x=>x.rol==="POR"); return o?o.rt:65; }
// tanda automática (partidos que no se ven): cada DT elige por jerarquía, como haría cualquiera
function tandaAuto(A,B){
  const orden=E=>(E.once||[]).filter(o=>o.rol!=="POR").sort((a,b)=>b.rt-a.rt).concat((E.once||[]).filter(o=>o.rol==="POR"));
  const oa=orden(A), ob=orden(B), pa0=arqueroDe(A.once), pb0=arqueroDe(B.once);
  let pa=0,pb=0;
  const tiro=(o,k,por,mio)=>{ const ok=S.rng()<pPenal(o,k,por,mio); if(mio){ o.jug.penT=(o.jug.penT||0)+1; if(!ok) o.jug.penE=(o.jug.penE||0)+1; } return ok; };
  for(let k=0;k<5;k++){
    if(tiro(oa[k],k,pb0,!!A.an)) pa++;
    if(pa>pb+(5-k)||pb>pa+(4-k)) break;
    if(tiro(ob[k],k,pa0,!!B.an)) pb++;
    if(pa>pb+(4-k)||pb>pa+(4-k)) break;
  }
  let k=5; while(pa===pb&&k<40){ const ia=k%oa.length, ib=k%ob.length;
    const a=tiro(oa[ia],k,pb0,!!A.an), b=tiro(ob[ib],k,pa0,!!B.an); if(a) pa++; if(b) pb++; k++; }
  if(pa===pb) pa++;
  return [pa,pb];
}
// la tanda en vivo
function abrirPenales(){
  const V=tmp.vivo, yo=soyLado();
  const mio=yo==="a"?V.A:V.B, suyo=yo==="a"?V.B:V.A;
  const cands=(mio.once||[]).slice();
  // lo que se ve en la entrada en calor y en la ronda: pistas, no certezas
  const pistas=new Map();
  cands.forEach(o=>{ const j=o.jug, c=caracter(j), l=[];
    if((c==="frio"||c==="lider"||c==="agrandado")&&S.rng()<0.75) l.push({t:t3("pidió patear","pediu para bater","asked to take one"),k:"ok"});
    if((c==="nervioso"&&S.rng()<0.55)||S.rng()<0.1) l.push({t:t3("en la entrada en calor no metió ninguno","no aquecimento não fez nenhum","missed every one in the warm-up"),k:"mal"});
    if((c==="calenton")&&S.rng()<0.5) l.push({t:t3("se peleó con el árbitro en el 88","brigou com o juiz aos 88","rowed with the ref on 88"),k:"mal"});
    if((j.penE||0)>0) l.push({t:t3(`erró ${j.penE>1?j.penE:"uno"} hace poco`,`errou ${j.penE>1?j.penE:"um"} há pouco`,`missed ${j.penE>1?j.penE:"one"} recently`),k:"mal"});
    if((j.fat||0)>=55) l.push({t:t3("acalambrado","com câimbra","cramping"),k:"mal"});
    if((j.forma||0)>=3) l.push({t:t3("en racha","em fase boa","on a run"),k:"ok"});
    if(!rodaje(j)&&j.ed<=22) l.push({t:t3("nunca pateó en un partido así","nunca bateu num jogo assim","never taken one in a game like this"),k:""});
    if(j._ar!=null) l.push({t:j._ar>=2?t3("salió encendido de la charla","saiu ligado da conversa","left the talk fired up"):j._ar<=-2?t3("la charla no le cayó bien","a conversa não caiu bem","the talk didn't sit well"):"",k:j._ar>=2?"ok":"mal"});
    pistas.set(j,l.filter(x=>x.t));
  });
  const quinto=cands.filter(o=>["frio","agrandado"].includes(caracter(o.jug)));
  const pide5=quinto.length?R.el(quinto).jug:null;
  if(pide5) pistas.get(pide5).push({t:t3("pidió el quinto","pediu o quinto","asked for the fifth"),k:""});
  const porRiv=arqueroDe(suyo.once);
  V.pen={cands,pistas,orden:[],porRiv,porMio:arqueroDe(mio.once),suyos:(suyo.once||[]).filter(o=>o.rol!=="POR").sort((a,b)=>b.rt-a.rt),
    tiros:[],mis:0,sus:0,cambio:false,fase:"elegir",empiezo:S.rng()<0.5};
  pintarPenales();
}
function pintarPenales(){
  const V=tmp.vivo, P=V.pen, rv=V.info.rival;
  const fila=(l,lado)=>{ const t=P.tiros.filter(x=>x.l===lado); const n=Math.max(5,t.length);
    return `<div class="pn-fila"><span>${escudo(lado==="yo"?S.club:rv.club,22)}</span>${[...Array(n)].map((_,i)=>`<i class="${t[i]?(t[i].ok?'si':'no'):''}"></i>`).join("")}<b>${lado==="yo"?P.mis:P.sus}</b></div>`; };
  let cuerpo="";
  if(P.fase==="elegir"){
    cuerpo=`<p class="mini">${t3("Elegí cinco y el orden. El quinto es el que más pesa.","Escolha cinco e a ordem. O quinto é o que mais pesa.","Pick five and the order. The fifth carries the most weight.")}
      ${P.porRiv>=78?" "+t3("Su arquero estudia a los pateadores.","O goleiro deles estuda os batedores.","Their keeper studies the takers."):""}</p>
      <div class="pn-orden">${[0,1,2,3,4].map(k=>{ const o=P.orden[k]; return `<div class="pn-slot ${o?'lleno':''}"><span>${k+1}</span>${o?`<b>${apellido(o.jug.nom)}</b><button class="pn-x" aria-label="${t3("Sacar","Tirar","Remove")}" onclick="sacarPateador(${k})">×</button>`:"—"}</div>`; }).join("")}</div>
      <div class="pn-lista">${P.cands.map((o,i)=>{ const usado=P.orden.includes(o), j=o.jug;
        return `<button class="pn-cand ${usado?'usado':''}" ${usado||P.orden.length>=5?'disabled':''} onclick="elegirPateador(${i})">
          <span class="sup-rt">${o.rt}</span><span class="sup-nom">${j.nom}</span>
          <span class="sup-pos">${tRol(o.rol)} · ${j.ed} ${t3("años","anos","y/o")}</span>
          <span class="pn-pistas">${(P.pistas.get(j)||[]).map(x=>`<em class="${x.k}">${x.t}</em>`).join("")}</span></button>`; }).join("")}</div>
      <div class="acciones"><button class="btn" ${P.orden.length<5?'disabled':''} onclick="empezarTanda()">${t3("A patear","Vamos bater","Let's go")}</button>
        <button class="btn sec" onclick="ordenSugerido()">${t3("Que patee el que quiera","Que bata quem quiser","Whoever wants it")}</button></div>`;
  } else if(P.fase==="tanda"){
    const u=P.tiros[P.tiros.length-1];
    cuerpo=`<div class="pn-tiro ${u?((u.ok===(u.l==="yo"))?'si':'no'):''}">${u?`<div class="mini">${u.l==="yo"?S.club.n:rv.club.n}</div><b>${u.nom}</b><div class="pn-res">${u.txt}</div>`:`<b>${t3("Empieza la tanda","Começa a disputa","Shoot-out begins")}</b>`}</div>
      ${P.pausa?`<div class="alerta">${t3(`Va ${P.mis}-${P.sus}. Le toca a <b>${apellido(P.orden[4].jug.nom)}</b> el quinto. ¿Lo dejás o lo cambiás?`,`Está ${P.mis}-${P.sus}. É a vez de <b>${apellido(P.orden[4].jug.nom)}</b>. Mantém ou troca?`,`It's ${P.mis}-${P.sus}. <b>${apellido(P.orden[4].jug.nom)}</b> takes the fifth. Keep him or change?`)}
        <div class="pn-pistas">${(P.pistas.get(P.orden[4].jug)||[]).map(x=>`<em class="${x.k}">${x.t}</em>`).join("")} <em>${estadoVestuario(P.orden[4].jug,{semilla:"pen"})}</em></div></div>
        <div class="pn-lista">${P.cands.filter(o=>!P.orden.includes(o)).map(o=>`<button class="pn-cand" onclick="cambiarQuinto(${P.cands.indexOf(o)})"><span class="sup-rt">${o.rt}</span><span class="sup-nom">${o.jug.nom}</span><span class="pn-pistas">${(P.pistas.get(o.jug)||[]).map(x=>`<em class="${x.k}">${x.t}</em>`).join("")}</span></button>`).join("")}</div>
        <div class="acciones"><button class="btn" onclick="tmp.vivo.pen.pausa=false;tmp.vivo.pen.cambio=true;seguirTanda()">${t3("Que patee él","Que ele bata","He takes it")}</button></div>`:""}`;
  } else {
    const gano=P.mis>P.sus;
    cuerpo=`<div class="pn-tiro ${gano?'si':'no'}"><b>${gano?t3("¡GANASTE LOS PENALES!","VENCEU NOS PÊNALTIS!","YOU WIN ON PENALTIES!"):t3("Se perdió en los penales","Perdeu nos pênaltis","Lost on penalties")}</b>
      <div class="pn-res">${P.mis}-${P.sus}</div></div>
      <div class="acciones" style="justify-content:center"><button class="btn" onclick="terminarPenales()">${T("seguir")}</button></div>`;
  }
  $("#vvPanel").innerHTML=`<div class="penales"><h3 class="disp">${t3("Penales","Pênaltis","Penalties")}</h3>${fila("yo","yo")}${fila("el","el")}${cuerpo}</div>`;
  const p=$("#vvPanel"); if(p) p.scrollIntoView({behavior:"smooth",block:"start"});
}
function elegirPateador(i){ const P=tmp.vivo.pen, o=P.cands[i]; if(P.orden.length<5&&!P.orden.includes(o)){ P.orden.push(o); pintarPenales(); } }
function sacarPateador(k){ const P=tmp.vivo.pen; P.orden.splice(k,1); pintarPenales(); }
// lo que haría un DT sin mirar: primero los que pidieron, después por nivel
function ordenSugerido(){
  const P=tmp.vivo.pen;
  const pidio=o=>(P.pistas.get(o.jug)||[]).some(x=>/pidió|pediu|asked/.test(x.t));
  const l=P.cands.filter(o=>o.rol!=="POR").sort((a,b)=>(pidio(b)-pidio(a))||(b.rt-a.rt)).slice(0,5);
  // el que pidió el quinto, quinto
  const q=l.find(o=>(P.pistas.get(o.jug)||[]).some(x=>/quinto|fifth/.test(x.t)));
  if(q){ l.splice(l.indexOf(q),1); l.push(q); }
  P.orden=l; pintarPenales();
}
function cambiarQuinto(i){ const P=tmp.vivo.pen; P.orden[4]=P.cands[i]; P.cambio=true; P.pausa=false; seguirTanda(); }
function empezarTanda(){ const P=tmp.vivo.pen; if(P.orden.length<5) return; P.fase="tanda"; P.k=0; P.turno=P.empiezo?"yo":"el"; pintarPenales(); setTimeout(seguirTanda,700); }
function decidida(P){
  const tm=P.tiros.filter(x=>x.l==="yo").length, ts=P.tiros.filter(x=>x.l==="el").length;
  if(tm<=5&&ts<=5&&(tm<5||ts<5)) return P.mis>P.sus+(5-ts)||P.sus>P.mis+(5-tm);
  return tm===ts&&P.mis!==P.sus;
}
function seguirTanda(){
  const V=tmp.vivo; if(!V||!V.pen) return; const P=V.pen;
  if(decidida(P)){ P.fase="fin"; pintarPenales(); return; }
  const tm=P.tiros.filter(x=>x.l==="yo").length;
  if(P.turno==="yo"){
    if(tm===4&&!P.cambio&&!P.pausa&&P.tiros.filter(x=>x.l==="el").length>=3){ P.pausa=true; pintarPenales(); return; }
    let o=P.orden[tm];
    if(!o){ // muerte súbita: siguen los que no patearon, después vuelve a empezar
      const resto=P.cands.filter(x=>!P.orden.includes(x)).sort((a,b)=>(a.rol==="POR")-(b.rol==="POR")||b.rt-a.rt);
      const lista=P.orden.concat(resto); o=lista[tm%lista.length];
    }
    const ok=S.rng()<pPenal(o,tm,P.porRiv,true);
    o.jug.penT=(o.jug.penT||0)+1; if(!ok) o.jug.penE=(o.jug.penE||0)+1;
    if(ok) P.mis++;
    P.tiros.push({l:"yo",ok,nom:o.jug.nom,txt:ok?t3("¡GOL!","GOL!","GOAL!"):R.el([t3("¡ATAJÓ EL ARQUERO!","O GOLEIRO PEGOU!","SAVED!"),t3("¡AFUERA!","PRA FORA!","WIDE!"),t3("¡EN EL PALO!","NA TRAVE!","OFF THE POST!")])});
    P.turno="el";
  } else {
    const ts=P.tiros.filter(x=>x.l==="el").length, o=P.suyos[ts%Math.max(1,P.suyos.length)];
    const ok=S.rng()<pPenal(o,ts,P.porMio,false);
    if(ok) P.sus++;
    P.tiros.push({l:"el",ok,nom:o.jug.nom,txt:ok?t3("Gol de ellos.","Gol deles.","They score."):R.el([t3("¡LO ATAJASTE!","DEFENDEU!","YOUR KEEPER SAVES!"),t3("¡LA TIRÓ AFUERA!","CHUTOU PRA FORA!","HE'S MISSED IT!")])});
    P.turno="yo";
  }
  pintarPenales();
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(seguirTanda,reduce?60:(V.rapido?250:1100));
}
function terminarPenales(){
  const V=tmp.vivo, P=V.pen, yo=soyLado();
  V.penRes=yo==="a"?[P.mis,P.sus]:[P.sus,P.mis];
  finVivo();
}
