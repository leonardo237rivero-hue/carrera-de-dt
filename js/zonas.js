// Carrera de DT — LAS 18 ZONAS Y LOS PATRONES DE JUEGO
// La cancha se divide en 6 franjas x 3 carriles = 18 zonas (la 14 es la frontal del área rival,
// por el centro). Cada partido se lee por sectores: cuántos son, quién es mejor y qué deja el
// bloque rival. De ahí salen los patrones de juego (tercer hombre, ruptura, superioridad por banda,
// cambio de orientación, contraataque, robo alto…) que explican por qué una jugada sale o no.
//
// El modelo de juego se arma sobre los cuatro momentos del partido:
//   ofe  organización ofensiva    posicional | directo
//   def  organización defensiva   alto | medio | bajo
//   tdef transición defensiva     presion | repliegue
//   tofe transición ofensiva      contra | pausa
// Los cuatro estilos viejos (Posesión, Contraataque, Presión alta, Bloque bajo) quedan como
// combinaciones típicas: el resto del motor los sigue usando para el encaje con el sistema.

const MOMENTOS=[
 {id:"ofe",n:{es:"Con la pelota",pt:"Com a bola",en:"In possession"},sub:{es:"Organización ofensiva",pt:"Organização ofensiva",en:"Attacking organisation"},
  ops:[{id:"posicional",n:{es:"Ataque posicional",pt:"Ataque posicional",en:"Positional attack"},
        d:{es:"Salida elaborada, amplitud y apoyos: buscás al de entre líneas.",pt:"Saída elaborada, amplitude e apoios: busca o homem entre linhas.",en:"Patient build-up, width and support: you look for the man between the lines."}},
       {id:"directo",n:{es:"Juego directo",pt:"Jogo direto",en:"Direct play"},
        d:{es:"Profundidad rápido: pelota a la espalda y a ganar la segunda.",pt:"Profundidade rápida: bola nas costas e ganhar a segunda.",en:"Quick depth: ball in behind and win the second ball."}}]},
 {id:"def",n:{es:"Sin la pelota",pt:"Sem a bola",en:"Out of possession"},sub:{es:"Organización defensiva",pt:"Organização defensiva",en:"Defensive organisation"},
  ops:[{id:"alto",n:{es:"Bloque alto",pt:"Bloco alto",en:"High block"},
        d:{es:"Presión arriba, equipo corto y línea adelantada que juega con el offside.",pt:"Pressão alta, time curto e linha adiantada jogando com o impedimento.",en:"Press high, short team, high line playing offside."}},
       {id:"medio",n:{es:"Bloque medio",pt:"Bloco médio",en:"Mid block"},
        d:{es:"Los esperás en tres cuartos, cerrás el centro y basculás.",pt:"Espera no meio, fecha o centro e bascula.",en:"Wait in the middle third, shut the centre and shift across."}},
       {id:"bajo",n:{es:"Bloque bajo",pt:"Bloco baixo",en:"Low block"},
        d:{es:"Repliegue cerca del área: recuperás abajo y sin espacio a la espalda.",pt:"Recuo perto da área: recupera embaixo e sem espaço nas costas.",en:"Drop near the box: win it deep, no space in behind."}}]},
 {id:"tdef",n:{es:"Al perderla",pt:"Ao perder",en:"On losing it"},sub:{es:"Transición defensiva",pt:"Transição defensiva",en:"Defensive transition"},
  ops:[{id:"presion",n:{es:"Presión tras pérdida",pt:"Pressão pós-perda",en:"Counter-press"},
        d:{es:"Los primeros segundos, a recuperarla ahí mismo.",pt:"Nos primeiros segundos, recuperar ali mesmo.",en:"First seconds: win it back right there."}},
       {id:"repliegue",n:{es:"Repliegue intensivo",pt:"Recuo intensivo",en:"Recovery run"},
        d:{es:"Todos atrás de la pelota antes de que salgan.",pt:"Todos atrás da bola antes que saiam.",en:"Everyone behind the ball before they break."}}]},
 {id:"tofe",n:{es:"Al recuperarla",pt:"Ao recuperar",en:"On winning it"},sub:{es:"Transición ofensiva",pt:"Transição ofensiva",en:"Attacking transition"},
  ops:[{id:"contra",n:{es:"Contraataque",pt:"Contra-ataque",en:"Counter-attack"},
        d:{es:"Atacar el desorden: tres pases y al arco.",pt:"Atacar a desordem: três passes e ao gol.",en:"Attack the disorder: three passes and shoot."}},
       {id:"pausa",n:{es:"Asegurar la pelota",pt:"Segurar a bola",en:"Keep the ball"},
        d:{es:"Pausa, reorganizar y pasar a ataque posicional.",pt:"Pausa, reorganizar e passar ao ataque posicional.",en:"Pause, reorganise, go positional."}}]}
];
const MOMENTO=Object.fromEntries(MOMENTOS.map(M=>[M.id,M]));
function opMomento(mid,oid){ return MOMENTO[mid].ops.find(o=>o.id===oid); }

// del modelo al estilo que usa el resto del motor (encaje con el sistema, momentos del partido)
function estiloDeModelo(m){
  if(!m) return "Posesion";
  const s={"Posesion":0,"Presion alta":0,"Contraataque / Directo":0,"Bloque bajo / Repliegue":0};
  if(m.ofe==="posicional") s["Posesion"]+=2; else { s["Contraataque / Directo"]+=1; s["Bloque bajo / Repliegue"]+=0.5; }
  if(m.def==="alto"){ s["Presion alta"]+=2.2; s["Posesion"]+=0.5; }
  if(m.def==="medio"){ s["Posesion"]+=1; s["Contraataque / Directo"]+=1; }
  if(m.def==="bajo"){ s["Bloque bajo / Repliegue"]+=2.2; s["Contraataque / Directo"]+=0.5; }
  if(m.tdef==="presion") s["Presion alta"]+=1.5; else s["Bloque bajo / Repliegue"]+=1;
  if(m.tofe==="contra") s["Contraataque / Directo"]+=1.6; else s["Posesion"]+=1;
  return Object.entries(s).sort((a,b)=>b[1]-a[1])[0][0];
}
// el modelo típico de cada estilo (para rivales y para partidas viejas)
function modeloDeEstilo(e){
  return ({"Posesion":{ofe:"posicional",def:"medio",tdef:"presion",tofe:"pausa"},
    "Presion alta":{ofe:"posicional",def:"alto",tdef:"presion",tofe:"contra"},
    "Contraataque / Directo":{ofe:"directo",def:"medio",tdef:"repliegue",tofe:"contra"},
    "Bloque bajo / Repliegue":{ofe:"directo",def:"bajo",tdef:"repliegue",tofe:"contra"}})[e]||{ofe:"posicional",def:"medio",tdef:"presion",tofe:"pausa"};
}
// lo que no cierra entre momentos: el juego lo marca y le cuesta al equipo
function contradicciones(m){
  const c=[];
  if(m.def==="alto"&&m.tdef==="repliegue") c.push({es:"Bloque alto con repliegue: cuando la perdés, todos corren hacia atrás y la línea adelantada queda sola.",pt:"Bloco alto com recuo: ao perder, todos correm para trás e a linha adiantada fica sozinha.",en:"High block with recovery runs: when you lose it everyone sprints back and the high line is left alone."});
  if(m.def==="bajo"&&m.tdef==="presion") c.push({es:"Bloque bajo con presión tras pérdida: perdés la pelota lejos del arco rival y presionás con pocos.",pt:"Bloco baixo com pressão pós-perda: perde a bola longe e pressiona com poucos.",en:"Low block with counter-press: you lose it far from their goal and press with few."});
  if(m.ofe==="directo"&&m.tofe==="pausa") c.push({es:"Juego directo y pausa al recuperar: frenás justo cuando tu idea pide velocidad.",pt:"Jogo direto e pausa ao recuperar: freia quando a ideia pede velocidade.",en:"Direct play but pausing on recovery: you slow down exactly when your idea wants speed."});
  if(m.ofe==="posicional"&&m.def==="bajo"&&m.tofe==="contra") c.push({es:"Ataque posicional desde bloque bajo y a la contra: tenés que recorrer 80 metros para atacar como querés.",pt:"Ataque posicional desde bloco baixo e contra: precisa percorrer 80 metros.",en:"Positional attack from a low block and counter-attacking: 80 metres to attack the way you want."});
  return c;
}
function coherenciaModelo(m){ const n=contradicciones(m).length; return n?1-0.025*n:1.015; }

/* ---------- la grilla ---------- */
function carril(x){ return x<33?0:x<67?1:2; }
function zonaNum(col,fila){ return (fila-1)*3+col+1; }      // col 0-2 (izq-centro-der), fila 1-6
const NOM_CARRIL=[{es:"izquierda",pt:"esquerda",en:"left"},{es:"centro",pt:"centro",en:"centre"},{es:"derecha",pt:"direita",en:"right"}];

// lectura por carriles: tus atacantes contra sus defensores en el último tercio
function sectores(A,B){
  const atk=[0,1,2].map(()=>({n:0,q:[],jug:[]})), def=[0,1,2].map(()=>({n:0,q:[],jug:[]}));
  (A.once||[]).forEach(o=>{
    const r=o.rol; if(r==="POR"||r==="DFC") return;
    const w=/^(LT|CA)/.test(r)?0.6:/^(MCD)$/.test(r)?0.3:/^(MC)$/.test(r)?0.6:1;
    const c=carril(o.x); atk[c].n+=w; atk[c].q.push(o.rt); atk[c].jug.push(o);
  });
  (B.once||[]).forEach(o=>{
    const r=o.rol; if(r==="POR"||ROL[r].g==="ATA") return;
    const w=/^(DFC|LT|CA)/.test(r)?1:/^(MCD)$/.test(r)?0.8:0.5;
    const c=carril(100-o.x); def[c].n+=w; def[c].q.push(o.rt); def[c].jug.push(o);
  });
  const prom=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:50, max=a=>a.length?Math.max(...a):45;
  return [0,1,2].map(c=>({c,atk:atk[c].n,def:def[c].n,num:atk[c].n-def[c].n,qA:prom(atk[c].q),qB:prom(def[c].q),
    mejorA:atk[c].jug.slice().sort((a,b)=>b.rt-a.rt)[0]||null, mejorB:def[c].jug.slice().sort((a,b)=>b.rt-a.rt)[0]||null,
    cualit:max(atk[c].q)-max(def[c].q)}));
}
const linea=(eq,g)=>(eq.once||[]).filter(o=>ROL[o.rol].g===g).map(o=>o.rt);
const mejor=a=>a.length?Math.max(...a):45;
const promQ=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:50;

/* ---------- los patrones ---------- */
// cada patrón: dónde termina (zona), cuándo aplica y cuánto rinde contra este rival, con el porqué
const PATRONES=[
 {id:"tercer",zona:14,n:{es:"Tercer hombre",pt:"Terceiro homem",en:"Third man"},req:m=>m.ofe==="posicional",
  calc:(s,mA,mB,A,B,auto)=>{ const c=s[1];
    const r=[], v=0.17*c.num+(c.qA-c.qB)/22+(mB.def==="bajo"?-0.25:mB.def==="alto"?0.15:0)+(auto||0)/450+((A.once||[]).some(o=>o.rol==="MCO"||o.rol==="MC")?0.05:0);
    r.push(c.num>=0.5?{es:`por dentro son más (${fmtN(c.atk)} contra ${fmtN(c.def)})`,pt:`por dentro são mais (${fmtN(c.atk)} contra ${fmtN(c.def)})`,en:`more of you inside (${fmtN(c.atk)} v ${fmtN(c.def)})`}
      :{es:`por dentro te igualan o te superan (${fmtN(c.atk)} contra ${fmtN(c.def)})`,pt:`por dentro te igualam (${fmtN(c.atk)} contra ${fmtN(c.def)})`,en:`they match you inside (${fmtN(c.atk)} v ${fmtN(c.def)})`});
    if(mB.def==="bajo") r.push({es:"su bloque bajo no deja espacio entre líneas",pt:"o bloco baixo não deixa espaço entre linhas",en:"their low block leaves no space between the lines"});
    if(mB.def==="alto") r.push({es:"su bloque alto deja aire a la espalda de los volantes",pt:"o bloco alto deixa espaço nas costas dos volantes",en:"their high block leaves room behind their midfield"});
    return {v,r}; }},
 {id:"pared",zona:14,n:{es:"Pared en la frontal",pt:"Tabela na entrada da área",en:"One-two at the edge"},req:m=>m.ofe==="posicional",
  calc:(s,mA,mB,A,B)=>{ const c=s[1], v=c.cualit/14+(mB.def==="bajo"?-0.15:0.05);
    const r=[c.mejorA&&c.mejorB?{es:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) contra ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt}) en la zona 14`,pt:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) contra ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt}) na zona 14`,en:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) v ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt}) in zone 14`}:{es:"no tenés a nadie fino en la frontal",pt:"não tem ninguém fino na entrada",en:"nobody sharp at the edge of the box"}];
    return {v,r}; }},
 {id:"bandaI",zona:13,n:{es:"Superioridad por izquierda",pt:"Superioridade pela esquerda",en:"Overload on the left"},req:()=>true,
  calc:(s,mA,mB)=>banda(s[0],mB,0)},
 {id:"bandaD",zona:15,n:{es:"Superioridad por derecha",pt:"Superioridade pela direita",en:"Overload on the right"},req:()=>true,
  calc:(s,mA,mB)=>banda(s[2],mB,2)},
 {id:"cambio",zona:15,n:{es:"Cambio de orientación",pt:"Inversão de jogo",en:"Switch of play"},req:m=>m.ofe==="posicional",
  calc:(s,mA,mB,A,B,auto)=>{ const anchoA=(A.once||[]).filter(o=>(o.x<22||o.x>78)&&o.y>40).length, anchoB=(B.once||[]).filter(o=>(o.x<22||o.x>78)&&o.y<60&&ROL[o.rol].g!=="ATA").length;
    const v=0.08*(anchoA-2)+(mB.def==="alto"?-0.05:0.15)-(anchoB>=4?0.12:0)+(auto||0)/500;
    const r=[{es:`tenés ${anchoA} abiertos y ellos ${anchoB} para cerrar el costado`,pt:`tem ${anchoA} abertos e eles ${anchoB} para fechar`,en:`${anchoA} of yours wide v ${anchoB} of theirs`},
      mB.def==="alto"?{es:"suben a presionar: no basculan, saltan",pt:"sobem para pressionar: não basculam",en:"they press up rather than shift"}:{es:"basculan hacia la pelota y dejan solo el lado débil",pt:"basculam e deixam o lado fraco",en:"they shift to the ball and leave the far side"}];
    return {v,r}; }},
 {id:"ruptura",zona:17,n:{es:"Desmarque de ruptura",pt:"Desmarque de ruptura",en:"Run in behind"},req:()=>true,
  calc:(s,mA,mB,A,B)=>{ const at=mejor(linea(A,"ATA")), de=mejor(linea(B,"DEF"));
    const v=(mB.def==="alto"?0.35:mB.def==="medio"?0.02:-0.35)+(at-de)/18+(mA.ofe==="directo"?0.1:0);
    const r=[mB.def==="alto"?{es:"juegan con la línea adelantada: hay 30 metros a la espalda",pt:"jogam com a linha adiantada: há 30 metros nas costas",en:"they hold a high line: 30 metres in behind"}
      :mB.def==="bajo"?{es:"se meten atrás: no hay espalda para atacar",pt:"recuam: não há costas para atacar",en:"they sit deep: no space in behind"}:{es:"línea media: la espalda aparece sólo si los arrastrás",pt:"linha média: as costas só aparecem se arrastar",en:"mid line: space opens only if you drag them out"},
      {es:`tu mejor punta ${at} contra su mejor defensor ${de}`,pt:`seu melhor atacante ${at} contra o melhor defensor ${de}`,en:`your best forward ${at} v their best defender ${de}`}];
    return {v,r}; }},
 {id:"segunda",zona:17,n:{es:"Pelota larga y segunda jugada",pt:"Bola longa e segunda bola",en:"Long ball and second ball"},req:m=>m.ofe==="directo",
  calc:(s,mA,mB,A,B)=>{ const puntas=(A.once||[]).filter(o=>o.rol==="DC").length, at=promQ(linea(A,"ATA")), de=promQ(linea(B,"DEF"));
    const v=0.15*(puntas-1)+(at-de)/22+(mB.def==="alto"?0.12:mB.def==="bajo"?-0.08:0);
    const r=[{es:`${puntas} ${puntas>1?"puntas para pelear":"punta solo para pelear"} la primera`,pt:`${puntas} atacante(s) para disputar`,en:`${puntas} striker(s) to fight for the first ball`},
      {es:`delanteros ${Math.round(at)} contra defensores ${Math.round(de)}`,pt:`atacantes ${Math.round(at)} contra defensores ${Math.round(de)}`,en:`forwards ${Math.round(at)} v defenders ${Math.round(de)}`}];
    return {v,r}; }},
 {id:"contra",zona:17,n:{es:"Contraataque",pt:"Contra-ataque",en:"Counter-attack"},req:m=>m.tofe==="contra",
  calc:(s,mA,mB,A,B)=>{ const at=promQ(linea(A,"ATA")), de=promQ(linea(B,"DEF"));
    const v=(mB.ofe==="posicional"?0.22:-0.08)+(mB.def==="alto"?0.15:mB.def==="bajo"?-0.12:0)+(at-de)/20+(mA.def==="bajo"?0.06:0);
    const r=[mB.ofe==="posicional"?{es:"atacan con mucha gente: cuando la perdés quedan mal parados",pt:"atacam com muita gente: ao perder ficam desarrumados",en:"they commit numbers: when they lose it they're exposed"}:{es:"juegan directo: no quedan descompensados",pt:"jogam direto: não ficam desequilibrados",en:"they play direct: they don't get caught out"},
      {es:`tus delanteros ${Math.round(at)} contra su defensa ${Math.round(de)}`,pt:`seus atacantes ${Math.round(at)} contra a defesa ${Math.round(de)}`,en:`your forwards ${Math.round(at)} v their defence ${Math.round(de)}`}];
    return {v,r}; }},
 {id:"robo",zona:14,n:{es:"Robo alto tras pérdida",pt:"Roubo alto pós-perda",en:"High turnover"},req:m=>m.tdef==="presion",
  calc:(s,mA,mB,A,B)=>{ const yo=promQ(linea(A,"MED").concat(linea(A,"ATA"))), el=promQ(linea(B,"DEF").concat(linea(B,"MED")));
    const v=(mB.ofe==="posicional"?0.2:-0.18)+(yo-el)/20+(mA.def==="alto"?0.08:mA.def==="bajo"?-0.15:0);
    const r=[mB.ofe==="posicional"?{es:"salen jugando: hay pelota para robar cerca de su arco",pt:"saem jogando: há bola para roubar perto do gol",en:"they build from the back: balls to win near their goal"}:{es:"la revientan: no hay a quién robarle arriba",pt:"chutam para frente: nada para roubar",en:"they go long: nothing to win up there"},
      {es:`tu presión ${Math.round(yo)} contra su salida ${Math.round(el)}`,pt:`sua pressão ${Math.round(yo)} contra a saída ${Math.round(el)}`,en:`your press ${Math.round(yo)} v their build-up ${Math.round(el)}`}];
    return {v,r}; }}
];
function fmtN(n){ return (Math.round(n*2)/2).toString().replace(".5","½"); }
function banda(c,mB,lado){
  const v=0.2*c.num+(c.qA-c.qB)/22+(mB.def==="bajo"?0.06:0);
  const r=[c.num>=0.5?{es:`por ese costado son más (${fmtN(c.atk)} contra ${fmtN(c.def)}): lateral, extremo e interior`,pt:`por esse lado são mais (${fmtN(c.atk)} contra ${fmtN(c.def)})`,en:`more of you on that side (${fmtN(c.atk)} v ${fmtN(c.def)})`}
    :{es:`por ese costado te esperan con ${fmtN(c.def)} contra tus ${fmtN(c.atk)}`,pt:`por esse lado esperam com ${fmtN(c.def)} contra ${fmtN(c.atk)}`,en:`they wait with ${fmtN(c.def)} against your ${fmtN(c.atk)}`},
    c.mejorA&&c.mejorB?{es:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) contra ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt})`,pt:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) contra ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt})`,en:`${apellido(c.mejorA.jug.nom)} (${c.mejorA.rt}) v ${apellido(c.mejorB.jug.nom)} (${c.mejorB.rt})`}:null].filter(Boolean);
  return {v,r};
}

// el análisis completo de un partido: qué te sirve a vos, qué le sirve a él y cuánto pesa
function analizarPartido(yo,el,mYo,mEl,auto,autoEl){
  const sYo=sectores(yo,el), sEl=sectores(el,yo);
  const leer=(s,mA,mB,A,B,au)=>PATRONES.filter(p=>p.req(mA)).map(p=>{ const k=p.calc(s,mA,mB,A,B,au); return {id:p.id,p,zona:p.zona,v:clamp(k.v,-1,1),r:k.r}; })
    .sort((a,b)=>b.v-a.v);
  const mis=leer(sYo,mYo,mEl,yo,el,auto), sus=leer(sEl,mEl,mYo,el,yo,autoEl||40);
  const top=l=>l.length?(l[0].v+(l[1]?l[1].v:l[0].v))/2:0;
  const ventaja=clamp(top(mis)-top(sus),-1,1);
  return {mis,sus,sYo,sEl,ventaja,mult:(1+0.045*ventaja)*coherenciaModelo(mYo)};
}

// a qué zona va cada ataque de un equipo según sus patrones (para el mapa de calor)
function calorZonas(lista,extra){
  const z=Array(19).fill(0);
  lista.forEach((p,i)=>{ const w=Math.max(0.05,p.v+0.6)*(i<3?1:0.5); z[p.zona]+=w; z[p.zona-3]+=w*0.6; });
  if(extra) Object.entries(extra).forEach(([k,v])=>z[k]+=v);
  const mx=Math.max(...z)||1; return z.map(v=>v/mx);
}

/* ---------- relato: cada gol cuenta cómo se hizo ---------- */
function rolDe(once,re){ const l=once.filter(o=>re.test(o.rol)); return l.length?l[Math.floor(S.rng()*l.length)]:null; }
function narrarGol(pat,once,autor){
  const ap=o=>o?apellido(o.jug.nom):"";
  const piv=rolDe(once,/^(MCD|MC)$/), inter=rolDe(once,/^(MI|MD|MCO|MC)$/), lat=rolDe(once,/^(LT|CA)/), ext=rolDe(once,/^(EX|MI|MD)/), cen=rolDe(once,/^DFC$/);
  const a=ap(autor);
  const T={
    tercer:{es:`${ap(piv)} juega con ${ap(inter)}, que de primera la deja para el tercero: ${a} entra solo por la zona 14`,pt:`${ap(piv)} toca com ${ap(inter)}, que de primeira deixa para o terceiro: ${a} entra livre pela zona 14`,en:`${ap(piv)} finds ${ap(inter)}, who lays it off first time for the third man: ${a} breaks into zone 14`},
    pared:{es:`pared en la frontal y ${a} define`,pt:`tabela na entrada da área e ${a} finaliza`,en:`one-two at the edge and ${a} finishes`},
    bandaI:{es:`${ap(lat)} y ${ap(ext)} hacen el 2 contra 1 por izquierda; ${a} la empuja`,pt:`${ap(lat)} e ${ap(ext)} fazem o 2 contra 1 pela esquerda; ${a} empurra`,en:`${ap(lat)} and ${ap(ext)} make the 2-v-1 on the left; ${a} tucks it in`},
    bandaD:{es:`${ap(lat)} pasa por fuera, ${ap(ext)} lo encuentra y ${a} cabecea`,pt:`${ap(lat)} passa por fora, ${ap(ext)} encontra e ${a} cabeceia`,en:`${ap(lat)} overlaps, ${ap(ext)} finds him and ${a} heads in`},
    cambio:{es:`cambio de frente de ${ap(inter)} al lado débil; ${a} llega solo`,pt:`inversão de ${ap(inter)} para o lado fraco; ${a} chega livre`,en:`${ap(inter)} switches to the weak side; ${a} arrives unmarked`},
    ruptura:{es:`${a} pica a la espalda de la línea y define mano a mano`,pt:`${a} infiltra nas costas da linha e finaliza cara a cara`,en:`${a} runs in behind the line and finishes one-on-one`},
    segunda:{es:`pelotazo de ${ap(cen)}, peinada y ${a} gana la segunda`,pt:`lançamento de ${ap(cen)}, desvio e ${a} ganha a segunda`,en:`long ball from ${ap(cen)}, flick-on and ${a} wins the second ball`},
    contra:{es:`robo en tres cuartos, tres pases y ${a} define a la carrera`,pt:`roubo, três passes e ${a} finaliza em velocidade`,en:`turnover, three passes and ${a} finishes on the run`},
    robo:{es:`presión tras pérdida: recuperan en su salida y ${a} no perdona`,pt:`pressão pós-perda: recuperam na saída e ${a} não perdoa`,en:`counter-press wins it in their build-up and ${a} makes no mistake`},
    pelota:{es:`pelota parada: ${a} gana arriba`,pt:`bola parada: ${a} ganha pelo alto`,en:`set piece: ${a} wins it in the air`}
  };
  return L(T[pat]||T.pelota);
}
function elegirPatron(lista){
  const ok=lista.filter(p=>p.v>-0.6);
  if(!ok.length||S.rng()<0.14) return "pelota";   // siempre hay goles de pelota parada
  const w=ok.map(p=>Math.max(0.04,p.v+0.55)); let t=w.reduce((a,b)=>a+b,0)*S.rng();
  for(let i=0;i<ok.length;i++){ t-=w[i]; if(t<=0) return ok[i].id; }
  return ok[0].id;
}
function nomPatron(id){ const p=PATRONES.find(x=>x.id===id); return p?L(p.n):t3("Pelota parada","Bola parada","Set piece"); }

/* ---------- el dibujo de las 18 zonas ---------- */
// cancha plana vista desde arriba, tu arco abajo. calor: array 1..18 de 0..1. marcas: {zona:{txt,color}}
function svgZonas(o){
  o=o||{}; const W=o.ancho||300, H=o.alto||390, m=10, cw=(W-2*m)/3, rh=(H-2*m)/6;
  const col=o.color||"166,240,60", col2=o.color2||"240,90,74";
  let out=`<svg class="zonas" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t3("Las 18 zonas","As 18 zonas","The 18 zones")}">
    <defs><marker id="fz" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#F4F7F0"/></marker></defs>
    <rect width="${W}" height="${H}" rx="8" fill="#0D1F15"/>`;
  for(let f=1;f<=6;f++) for(let c=0;c<3;c++){
    const z=zonaNum(c,f), x=m+c*cw, y=H-m-f*rh;
    const v=o.calor?o.calor[z]||0:0, v2=o.calor2?o.calor2[z]||0:0;
    const fill=v2>v?`rgba(${col2},${(0.08+v2*0.5).toFixed(2)})`:`rgba(${col},${(0.05+v*0.55).toFixed(2)})`;
    out+=`<rect x="${x+1}" y="${y+1}" width="${cw-2}" height="${rh-2}" rx="3" fill="${fill}" stroke="${z===14?'#A6F03C':'rgba(222,255,210,.14)'}" stroke-width="${z===14?1.8:1}"/>
      <text x="${x+6}" y="${y+14}" class="z-num" fill="rgba(222,255,210,${z===14?.9:.4})">${z}</text>`;
    const mk=o.marcas&&o.marcas[z];
    if(mk) out+=`<text x="${x+cw/2}" y="${y+rh/2+5}" text-anchor="middle" class="z-mk" fill="${mk.color||'#F4F7F0'}">${mk.txt}</text>`;
  }
  // líneas de referencia: área y medio campo
  out+=`<line x1="${m}" y1="${H/2}" x2="${W-m}" y2="${H/2}" stroke="rgba(222,255,210,.25)" stroke-dasharray="4 4"/>
    <rect x="${m+cw*0.45}" y="${m}" width="${cw*2.1}" height="${rh*0.75}" fill="none" stroke="rgba(222,255,210,.3)"/>
    <rect x="${m+cw*0.45}" y="${H-m-rh*0.75}" width="${cw*2.1}" height="${rh*0.75}" fill="none" stroke="rgba(222,255,210,.3)"/>
    ${o.flechas||""}</svg>`;
  return out;
}
// centro de una zona en coordenadas del svg (para flechas)
function centroZona(z,o){ o=o||{}; const W=o.ancho||300,H=o.alto||390,m=10,cw=(W-2*m)/3,rh=(H-2*m)/6; const f=Math.ceil(z/3), c=(z-1)%3;
  return {x:m+c*cw+cw/2, y:H-m-f*rh+rh/2}; }
function flechaZonas(z1,z2,color,o){ const a=centroZona(z1,o), b=centroZona(z2,o);
  return `<path d="M${a.x} ${a.y} L${b.x} ${b.y}" stroke="${color}" stroke-width="2.6" fill="none" stroke-linecap="round" marker-end="url(#fz)"/>`; }

// el énfasis de la previa o del entretiempo: cargar un patrón tuyo o cerrar uno de ellos
// toda opción cobra algo: cargar un sector deja otro descubierto; cerrar uno le saca gente al ataque
const LADO_PAT={bandaI:0,tercer:1,pared:1,robo:1,bandaD:2,cambio:2,ruptura:1,segunda:1,contra:1};
function costoEnfasis(tipo,id){
  if(tipo==="cargar"){
    if(id==="bandaI"||id==="bandaD") return {es:"Costo: el lateral de ese lado sube y a su espalda queda campo para el contraataque.",pt:"Custo: o lateral sobe e sobra campo nas costas para o contra-ataque.",en:"Cost: that full-back pushes up and leaves space behind for the counter."};
    if(id==="tercer"||id==="pared"||id==="robo") return {es:"Costo: juntás gente por dentro y te quedan los costados abiertos.",pt:"Custo: junta gente por dentro e os lados ficam abertos.",en:"Cost: you crowd the middle and leave the flanks open."};
    if(id==="ruptura"||id==="segunda"||id==="contra") return {es:"Costo: jugás más largo y la pelota vuelve más rápido; sufren tus volantes.",pt:"Custo: joga mais longo e a bola volta mais rápido.",en:"Cost: you go longer and the ball comes back faster; your midfield suffers."};
    return {es:"Costo: alguien deja su puesto para sumarse.",pt:"Custo: alguém deixa a posição.",en:"Cost: someone leaves his post to join in."};
  }
  return {es:"Costo: el que cierra deja de atacar; tu mejor jugada pierde un hombre.",pt:"Custo: quem fecha deixa de atacar.",en:"Cost: whoever covers stops attacking; your best move loses a man."};
}
function aplicarEnfasis(an,enf){
  const sube=(l,f,v)=>l.filter(f).forEach(p=>p.v=clamp(p.v+v,-1,1));
  (enf.cargar||[]).forEach(id=>{ const p=an.mis.find(x=>x.id===id); if(!p) return; p.v=clamp(p.v+0.28,-1,1);
    // el costo: lo que ellos ganan cuando vos cargás ese sector
    if(id==="bandaI") sube(an.sus,x=>x.id==="bandaD"||x.id==="contra",0.12);
    else if(id==="bandaD") sube(an.sus,x=>x.id==="bandaI"||x.id==="contra",0.12);
    else if(id==="tercer"||id==="pared"||id==="robo") sube(an.sus,x=>x.id==="bandaI"||x.id==="bandaD"||x.id==="cambio",0.09);
    else sube(an.sus,x=>x.id==="robo"||x.id==="tercer"||x.id==="pared",0.1); });
  (enf.cerrar||[]).forEach(id=>{ const p=an.sus.find(x=>x.id===id); if(p) p.v=clamp(p.v-0.32,-1,1);
    // cerrar un sector cuesta: alguien deja de atacar
    if(an.mis[0]) an.mis[0].v=clamp(an.mis[0].v-0.1,-1,1); });
  if(enf.riesgo){ an.mis.forEach(p=>p.v=clamp(p.v+0.12,-1,1)); an.sus.forEach(p=>p.v=clamp(p.v+0.12,-1,1)); }
  if(enf.rivalCierra){ const p=an.mis.find(x=>x.id===enf.rivalCierra); if(p) p.v=clamp(p.v-0.24,-1,1); }
  if(enf.arenga){ const k=enf.arenga; an.mis.forEach(p=>p.v=clamp(p.v+k,-1,1)); }
  an.mis.sort((a,b)=>b.v-a.v); an.sus.sort((a,b)=>b.v-a.v);
  const top=l=>l.length?(l[0].v+(l[1]?l[1].v:l[0].v))/2:0;
  const coh=an.mult/(1+0.045*an.ventaja);
  an.ventaja=clamp(top(an.mis)-top(an.sus),-1,1); an.mult=(1+0.045*an.ventaja)*coh;
  return an;
}

/* ---------- piezas de interfaz del modelo ---------- */
// cuatro filas de botones, una por momento. fn: nombre de la función global (mid, oid)
function selectorModelo(m,fn){
  return `<div class="modelo-sel">${MOMENTOS.map(M=>`<div class="mom-fila">
      <div class="mom-n"><b>${L(M.n)}</b><span>${L(M.sub)}</span></div>
      <div class="mom-ops">${M.ops.map(o=>`<button class="pill ${m[M.id]===o.id?'on':''}" title="${L(o.d)}" onclick="${fn}('${M.id}','${o.id}')">${L(o.n)}</button>`).join("")}</div>
      <div class="mom-d">${L(opMomento(M.id,m[M.id]).d)}</div></div>`).join("")}
    ${(()=>{const c=contradicciones(m); return c.length?`<div class="alerta mal">${c.map(x=>"⚠ "+L(x)).join("<br>")}</div>`
      :`<div class="alerta ok">${t3("Los cuatro momentos hablan el mismo idioma: el equipo lo aprende más rápido.","Os quatro momentos falam a mesma língua: o time aprende mais rápido.","All four moments speak the same language: the team learns it faster.")}</div>`;})()}</div>`;
}
// qué patrones te da tu modelo y dónde terminan en las 18 zonas
function patronesDelModelo(m){
  const ps=PATRONES.filter(p=>p.req(m)&&p.id!=="bandaD");
  // en el mapa sólo van números; la lista de al lado dice qué es cada uno
  const marcas={}, calor=Array(19).fill(0);
  ps.forEach((p,i)=>{ const zs=p.id==="bandaI"?[13,15]:[p.zona];
    zs.forEach(z=>{ marcas[z]={txt:(marcas[z]?marcas[z].txt+"·":"")+(i+1),color:"#EAF7D9"}; calor[z]+=0.6; calor[z-3]+=0.25; }); });
  return `<div class="patrones-modelo">
    <div class="pm-mapa">${svgZonas({ancho:210,alto:270,calor:calor.map(v=>Math.min(1,v)),marcas})}</div>
    <div class="pm-lista"><b>${t3("Tus patrones de juego","Seus padrões de jogo","Your patterns of play")}</b>
      ${ps.map((p,i)=>`<div class="pm-item"><span class="n">${i+1}</span>${L(p.n)}<span class="z">${t3("zona","zona","zone")} ${p.id==="bandaI"?"13/15":p.zona}</span></div>`).join("")}
      <p class="mini">${t3("La zona 14 es la frontal del área rival, por el centro: la que más goles da y la que todos cierran. Contra cada rival vas a ver cuáles de estos patrones rinden y por qué.",
        "A zona 14 é a entrada da área rival, pelo centro: a que mais dá gols e que todos fecham. Contra cada rival você vai ver quais padrões rendem e por quê.",
        "Zone 14 is the area just outside their box, centrally: it yields the most goals and everyone shuts it. Against each opponent you'll see which patterns work and why.")}</p></div></div>`;
}

/* ---------- dominio por zona: quién manda en cada una de las 18 ---------- */
// cada jugador se ubica en su zona (los rivales espejados); el bloque de cada uno lo corre.
// el poder de una zona = puntajes de los que están ahí + la mitad de los de las zonas vecinas.
function zonaDeJugador(x,y){ return zonaNum(carril(x),clamp(Math.ceil(y/16.67),1,6)); }
function corrimientoBloque(m){ return m&&m.def==="alto"?7:m&&m.def==="bajo"?-8:0; }
function dominioZonas(yo,el,mYo,mEl,ajuste){
  const Z=[...Array(19)].map(()=>({mios:[],suyos:[],pA:0,pB:0}));
  const dy=corrimientoBloque(mYo), dyE=corrimientoBloque(mEl);
  (yo.once||[]).forEach(o=>{ const y=o.rol==="POR"?o.y:clamp(o.y+dy,3,97); Z[zonaDeJugador(o.x,y)].mios.push(o); });
  (el.once||[]).forEach(o=>{ const y=o.rol==="POR"?o.y:clamp(o.y+dyE,3,97); Z[zonaDeJugador(100-o.x,100-y)].suyos.push(o); });
  const vecinas=z=>{ const f=Math.ceil(z/3), c=(z-1)%3, v=[]; [[1,0],[-1,0],[0,1],[0,-1]].forEach(([df,dc])=>{ const ff=f+df, cc=c+dc; if(ff>=1&&ff<=6&&cc>=0&&cc<=2) v.push(zonaNum(cc,ff)); }); return v; };
  const suma=l=>l.reduce((a,o)=>a+o.rt,0);
  for(let z=1;z<=18;z++){
    let pA=suma(Z[z].mios), pB=suma(Z[z].suyos);
    vecinas(z).forEach(v=>{ pA+=0.45*suma(Z[v].mios); pB+=0.45*suma(Z[v].suyos); });
    Z[z].pA=pA; Z[z].pB=pB;
    Z[z].dom=pA+pB>0?(pA-pB)/(pA+pB):0;
    if(ajuste&&ajuste[z]) Z[z].dom=clamp(Z[z].dom+ajuste[z],-1,1);
  }
  return Z;
}
// colores de los dos clubes que se distingan entre sí sobre el pasto
function hexRgb(h){ h=h.replace("#",""); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function distColor(a,b){ const x=hexRgb(a), y=hexRgb(b); return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]); }
function coloresDuelo(miClub,suClub){
  const vis=c=>{ const [c1,c2]=c.c; return luz(c1)<60?c2:c1; };
  let a=vis(miClub), b=vis(suClub);
  if(luz(a)<60) a="#A6F03C";
  if(distColor(a,b)<150){
    const alt=suClub.c.find(c=>distColor(c,a)>=150&&luz(c)>=60);
    b=alt||["#E9EEF0","#4DA3FF","#F2B33D","#A6F03C","#B07CFF"].find(c=>distColor(c,a)>=150)||"#E9EEF0";
  }
  return {a,b};
}
// tablero de dominio: cada zona del color de quien la manda, con las fichas y su puntaje
function svgDominio(Z,o){
  o=o||{}; const W=o.ancho||300, H=o.alto||400, m=8, cw=(W-2*m)/3, rh=(H-2*m)/6;
  const A=hexRgb(o.colA||"#A6F03C"), B=hexRgb(o.colB||"#F05A4A");
  const txtSobre=h=>luz(h)>150?"#0A0F0C":"#FFFFFF";
  let out=`<svg class="zonas dominio" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t3("Quién manda en cada zona","Quem manda em cada zona","Who controls each zone")}">
    <rect width="${W}" height="${H}" rx="8" fill="#0D1F15"/>`;
  for(let f=1;f<=6;f++) for(let c=0;c<3;c++){
    const z=zonaNum(c,f), x=m+c*cw, y=H-m-f*rh, d=Z[z].dom, col=d>=0?A:B, al=(0.08+Math.min(1,Math.abs(d)*1.6)*0.55).toFixed(2);
    out+=`<rect x="${x+1}" y="${y+1}" width="${cw-2}" height="${rh-2}" rx="3" fill="rgba(${col.join(",")},${al})" stroke="${z===14?'#F4F7F0':'rgba(222,255,210,.14)'}" stroke-width="${z===14?1.6:1}"/>
      <text x="${x+5}" y="${y+12}" class="z-num" fill="rgba(244,247,240,${z===14?.95:.5})">${z}</text>`;
    // fichas: arriba las tuyas, abajo las de ellos (hasta 3 por fila)
    const fila=(l,yy,hex)=>{ const n=Math.min(3,l.length), paso=Math.min(22,(cw-14)/Math.max(1,n));
      return l.slice(0,3).map((p,i)=>{ const cx=x+cw/2+(i-(n-1)/2)*paso;
        return `<circle cx="${cx}" cy="${yy}" r="9.5" fill="${hex}" stroke="#070D0A" stroke-width="1.5"/><text x="${cx}" y="${yy+3.6}" text-anchor="middle" class="z-rt" fill="${txtSobre(hex)}">${p.rt}</text>`; }).join("")
        +(l.length>3?`<text x="${x+cw-6}" y="${yy+4}" text-anchor="end" class="z-rt" fill="#F4F7F0">+${l.length-3}</text>`:""); };
    out+=fila(Z[z].mios,y+rh*0.42,o.colA||"#A6F03C")+fila(Z[z].suyos,y+rh*0.78,o.colB||"#F05A4A");
    if(o.gol===z) out+=`<rect x="${x+3}" y="${y+3}" width="${cw-6}" height="${rh-6}" rx="4" fill="none" stroke="#F4F7F0" stroke-width="2.5" class="z-gol"/><text x="${x+cw/2}" y="${y+rh/2+6}" text-anchor="middle" font-size="18">⚽</text>`;
    const nA=Z[z].mios.length, nB=Z[z].suyos.length;
    if(nA||nB) out+=`<text x="${x+cw-5}" y="${y+12}" text-anchor="end" class="z-cnt" fill="${nA>nB?o.colA||'#A6F03C':nB>nA?o.colB||'#F05A4A':'#F4F7F0'}">${nA}v${nB}</text>`;
  }
  out+=`<line x1="${m}" y1="${H/2}" x2="${W-m}" y2="${H/2}" stroke="rgba(222,255,210,.3)" stroke-dasharray="4 4"/>
    <rect x="${m+cw*0.45}" y="${m}" width="${cw*2.1}" height="${rh*0.72}" fill="none" stroke="rgba(222,255,210,.3)"/>
    <rect x="${m+cw*0.45}" y="${H-m-rh*0.72}" width="${cw*2.1}" height="${rh*0.72}" fill="none" stroke="rgba(222,255,210,.3)"/></svg>`;
  return out;
}
function leyendaDominio(o,miClub,suClub){
  return `<div class="leyenda dom-ley"><span><i class="pt" style="background:${o.a}"></i> ${t3("manda","manda","controls")} ${miClub.n}</span><span><i class="pt" style="background:${o.b}"></i> ${t3("manda","manda","controls")} ${suClub.n}</span><span class="mini">${t3("los números son los puntajes; arriba de cada zona, cuántos son de cada lado","os números são as notas; no alto, quantos são de cada lado","numbers are ratings; top corner: players on each side")}</span></div>`;
}
