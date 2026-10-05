// Carrera de DT — MOMENTOS DEL PARTIDO
// Reemplaza al viejo "Cómo los parás" (mover fichas sin beneficio claro).
// El fútbol es espacio-tiempo: se congela la jugada en tres fases y el DT
// decide cómo actúa su equipo en cada una. Lo que elige es su plan para
// toda la temporada: funciona contra algunos rivales y sufre contra otros.
//
// Fase 1  SALIDA   — tu salida contra su presión
// Fase 2  DEFENSA  — su salida contra tu presión / bloque
// Fase 3  LLEGADA  — tu ataque en el último tercio contra su bloque
//
// Ver docs/GDD.md (sección v6) para las reglas.

const MID={"Posesion":"pos","Contraataque / Directo":"con","Presion alta":"pre","Bloque bajo / Repliegue":"blo"};

/* ---------- rasgos de cada sistema, salen de las coordenadas del once ---------- */
const RASGOS={};
FORMACIONES.forEach(f=>{
  const o=ONCE[f], c=p=>o.filter(p).length;
  RASGOS[f]={
    primera:c(s=>["DC","EXI","EXD","MCO"].includes(s[0])),
    centrales:c(s=>s[0]==="DFC"),
    laterales:c(s=>s[0]==="LTI"||s[0]==="LTD"),
    carrileros:c(s=>s[0]==="CAI"||s[0]==="CAD"),
    centro:c(s=>s[0]!=="POR"&&s[1]>25&&s[1]<75&&s[2]>30&&s[2]<70),
    ancho:c(s=>(s[1]<22||s[1]>78)&&s[2]>40),
    puntas:c(s=>s[0]==="DC"),
    enganche:c(s=>s[0]==="MCO")
  };
});

/* ---------- las opciones de cada fase ---------- */
const FASES=[
 {id:"salida",n:{es:"Tu salida contra su presión",pt:"Sua saída contra a pressão deles",en:"Your build-up against their press"},
  ctx:{es:"Tu arquero tiene la pelota. Ellos suben a presionar.",pt:"Seu goleiro está com a bola. Eles sobem para pressionar.",en:"Your keeper has the ball. They push up to press."},
  ops:[
   {id:"tres",n:{es:"Salida de 3: baja el 5",pt:"Saída de 3: o volante recua",en:"Build with 3: the 6 drops"},
    d:{es:"El volante se mete entre los centrales y los laterales se abren.",pt:"O volante entra entre os zagueiros e os laterais abrem.",en:"The holding mid drops between the centre-backs; full-backs push wide."}},
   {id:"laterales",n:{es:"Laterales altos y abiertos",pt:"Laterais altos e abertos",en:"High, wide full-backs"},
    d:{es:"Los centrales se abren y los laterales se van arriba, pegados a la raya.",pt:"Os zagueiros abrem e os laterais sobem colados à linha.",en:"Centre-backs split; full-backs go high and hug the touchline."}},
   {id:"largo",n:{es:"Largo al 9 y segunda pelota",pt:"Bola longa no 9 e segunda bola",en:"Long to the 9, win the second ball"},
    d:{es:"Saltás la presión: pelotazo al punta y los volantes cerca para la segunda.",pt:"Pula a pressão: bola longa no centroavante e volantes perto para a sobra.",en:"Skip the press: long ball to the striker, mids close for the knock-down."}}]},
 {id:"defensa",n:{es:"Su salida contra tu presión",pt:"A saída deles contra sua pressão",en:"Their build-up against your press"},
  ctx:{es:"Ellos arrancan desde su arquero. ¿Dónde los esperás?",pt:"Eles começam pelo goleiro. Onde você os espera?",en:"They start from their keeper. Where do you meet them?"},
  ops:[
   {id:"presion",n:{es:"Presión alta",pt:"Pressão alta",en:"High press"},
    d:{es:"Salís a morder arriba: los delanteros tapan a los centrales y un volante salta.",pt:"Sai para morder lá em cima: atacantes nos zagueiros e um volante salta.",en:"Bite high: forwards on the centre-backs and a midfielder jumps."}},
   {id:"medio",n:{es:"Bloque medio, cerrando el centro",pt:"Bloco médio, fechando o meio",en:"Mid-block, shut the middle"},
    d:{es:"Los esperás en la mitad de la cancha, compactos por dentro.",pt:"Espera no meio-campo, compacto por dentro.",en:"Wait at halfway, compact through the middle."}},
   {id:"repliegue",n:{es:"Repliegue",pt:"Recuo",en:"Drop off"},
    d:{es:"Todos atrás de la pelota, cerca de tu área. No les das espacio a la espalda.",pt:"Todos atrás da bola, perto da sua área. Sem espaço nas costas.",en:"Everyone behind the ball near your box. No space in behind."}}]},
 {id:"llegada",n:{es:"Tu llegada al último tercio",pt:"Sua chegada ao último terço",en:"Your attack in the final third"},
  ctx:{es:"Llegaste a tres cuartos. Ellos se cierran. ¿Cómo los rompés?",pt:"Chegou à intermediária. Eles fecham. Como furar?",en:"You're in the final third. They close up. How do you break them?"},
  ops:[
   {id:"centros",n:{es:"Centros al área",pt:"Cruzamentos na área",en:"Crosses into the box"},
    d:{es:"Abrís a los de afuera y llenás el área.",pt:"Abre para os de fora e enche a área.",en:"Go wide and fill the box."}},
   {id:"dentro",n:{es:"Por dentro, pase filtrado",pt:"Por dentro, passe em profundidade",en:"Through the middle, slide-rule pass"},
    d:{es:"Juntás gente entre líneas y buscás el pase a la espalda.",pt:"Junta gente entre linhas e busca o passe nas costas.",en:"Crowd the space between lines, look for the ball in behind."}},
   {id:"cambio",n:{es:"Cambio de frente al lado débil",pt:"Inversão para o lado fraco",en:"Switch to the weak side"},
    d:{es:"Cargás un costado y das vuelta la pelota al otro, donde quedó uno solo.",pt:"Carrega um lado e vira para o outro, onde sobrou um.",en:"Overload one side, then switch to the other where they're thin."}}]}
];
// lo que cada modelo ya tiene automatizado
const COHERENTE={
 pos:{salida:["tres","laterales"],defensa:["presion","medio"],llegada:["dentro","cambio"]},
 pre:{salida:["tres","laterales"],defensa:["presion"],llegada:["dentro","centros"]},
 con:{salida:["largo"],defensa:["medio","repliegue"],llegada:["dentro","cambio"]},
 blo:{salida:["largo","laterales"],defensa:["repliegue","medio"],llegada:["centros","cambio"]}
};

/* ==========================================================
   VENTAJA DE UNA OPCIÓN CONTRA UN RIVAL
   yo / el: {f, e, attrs}. Devuelve {adv (−1..1), mios, suyos, por}
   ========================================================== */
const q=(a,b,k)=>clamp((a-b)/25,-0.3,0.3)*(k===undefined?1:k);
function ventaja(fase,op,yo,el,auto){
  const Ry=RASGOS[yo.f], Re=RASGOS[el.f], my=MID[yo.e], me=MID[el.e];
  const A=yo.attrs||[60,60,60,60], B=el.attrs||[60,60,60,60];
  let adv=0, mios=0, suyos=0, por="";
  if(fase==="salida"){
    const P=Math.max(0,Re.primera+({pre:1,pos:0,con:-1,blo:-2})[me]);
    suyos=P;
    if(op==="tres"){
      mios=Ry.centrales+1+(Ry.centrales===2?1:0);
      adv=0.3*clamp(mios-P,-2,1)-(Ry.centro<=2?0.1:0)+q(A[1],B[3]);
      por=mios>P?"sobra":mios===P?"iguala":"falta";
    } else if(op==="laterales"){
      mios=Ry.centrales+1;
      adv=0.3*clamp(mios-P,-2,1)+({blo:0.3,con:0.3,pos:0.1,pre:-0.15})[me]+0.1*(Ry.ancho-2)+q(A[1],B[3]);
      por=me==="pre"?"trampa":(me==="blo"||me==="con")?"ancho":"iguala";
    } else {
      mios=Ry.puntas; suyos=Re.centrales;
      adv=(me==="pre"?0.15+0.08*P:({pos:0.15,con:-0.1,blo:-0.35})[me])+0.12*(Ry.puntas-1)+q(A[0],B[2]);
      por=me==="pre"?"espalda":me==="blo"?"poblado":"neutro";
    }
  } else if(fase==="defensa"){
    const Bt=Re.centrales+1+((me==="pos"||me==="pre")?1:0);
    if(op==="presion"){
      mios=Ry.primera+1; suyos=Bt;
      if(me==="pos"||me==="pre"){ adv=0.2+0.25*clamp(mios-Bt,-2,1); por=mios>=Bt?"muerde":"sobra-ellos"; }
      else { adv=-0.3-0.1*(Re.puntas-1); por="saltan"; }
      if(Ry.centrales<=Re.puntas){ adv-=0.15; por+=" mano"; }
      adv+=q(A[3],B[1]);
    } else if(op==="medio"){
      mios=Ry.centro; suyos=Re.centro;
      adv=0.12*(Ry.centro-Re.centro)+0.1+({con:0.2,blo:0.05,pos:-0.1,pre:0})[me]+q(A[2],B[1],0.5);
      por=me==="con"?"cierra":me==="pos"?"ceden":"centro";
    } else {
      mios=Ry.centrales+Ry.laterales+Ry.carrileros; suyos=Re.primera+(Re.ancho>=3?1:0);
      adv=0.1*(mios-suyos)+({con:0.15,blo:-0.15,pos:-0.2,pre:-0.1})[me]+q(A[2],B[0]);
      por=me==="con"?"sin-espacio":(me==="pos"||me==="pre")?"invitas":"nada";
    }
  } else {
    const Bk=Re.centrales+Re.laterales+Re.carrileros;
    if(op==="centros"){
      mios=Ry.puntas+(Ry.ancho>=3?1:0); suyos=Bk;
      adv=0.18*(Ry.puntas-1)+0.08*(Ry.ancho-2)+({blo:0.15,con:0.05,pos:0,pre:-0.1})[me]-(Bk>=5?0.2:0)+q(A[0],B[2]);
      por=Bk>=5?"cinco":me==="blo"?"area":Ry.puntas>=2?"dos":"solo";
    } else if(op==="dentro"){
      mios=Ry.centro; suyos=Re.centro;
      adv=0.12*(Ry.centro-Re.centro)+({pre:0.3,pos:0.2,con:-0.1,blo:-0.3})[me]+(Ry.enganche?0.1:0)+q(A[1],B[2]);
      por=me==="pre"||me==="pos"?"espalda":me==="blo"?"cerrado":"centro";
    } else {
      mios=Ry.ancho; suyos=Re.ancho;
      adv=0.1*(Ry.ancho-2)+({blo:0.25,con:0.15,pos:0,pre:-0.05})[me]-(Bk>=5?0.2:0)-(Re.ancho>=4?0.1:0)+q(A[1],B[3],0.5);
      por=Bk>=5?"cinco":me==="blo"||me==="con"?"basculan":"abiertos";
    }
  }
  // automatismos: lo que tu modelo ya sabe hacer sale mejor
  const coh=COHERENTE[my][fase].includes(op);
  const peso=0.5+(auto||0)/200;
  adv+=coh?0.1*peso:-0.05;
  return {adv:clamp(adv,-1,1),mios,suyos,por,coh};
}
// el plan de toda la temporada contra un rival cualquiera
function planContra(plan,yo,el,auto){
  if(!plan) return {mult:1,fases:{}};
  const fases={}; let s=0;
  FASES.forEach(F=>{ const v=ventaja(F.id,plan[F.id],yo,el,auto); fases[F.id]=v; s+=v.adv; });
  return {mult:1+0.035*s, fases};
}
// la mejor opción en cada fase (para los tests y para la IA de rivales)
function mejorOpcion(fase,yo,el,auto){
  const F=FASES.find(x=>x.id===fase);
  return F.ops.map(o=>({o:o.id,v:ventaja(fase,o.id,yo,el,auto).adv})).sort((a,b)=>b.v-a.v)[0].o;
}

/* ==========================================================
   EXPLICACIÓN — la mecánica, no el veredicto
   ========================================================== */
function porQue(fase,op,v,rivN){
  const m=v.mios, s=v.suyos;
  const X={
   salida:{
    tres:{es:`Salís con ${m} (arquero incluido) contra ${s} que presionan: ${m>s?"siempre te sobra uno para dar el pase.":m===s?"quedan mano a mano, cada pase es un duelo.":"te faltan hombres y te encierran."}`,
          pt:`Sai com ${m} (goleiro incluído) contra ${s} que pressionam: ${m>s?"sempre sobra um para o passe.":m===s?"fica mano a mano, cada passe é um duelo.":"faltam homens e você fica preso."}`,
          en:`You build with ${m} (keeper included) against ${s} pressing: ${m>s?"there's always a spare man for the pass.":m===s?"it's man for man, every pass is a duel.":"you're short of men and get trapped."}`},
    laterales:{es:v.por==="trampa"?`Presionan con ${s} y te esperan en la banda: el lateral recibe contra la raya y queda encerrado.`
                :v.por==="ancho"?`No te presionan arriba: con los laterales altos estirás su bloque y progresás por afuera.`
                :`Salís con ${m} contra ${s}; los laterales altos te dan amplitud para progresar.`,
               pt:v.por==="trampa"?`Pressionam com ${s} e te esperam na lateral: o lateral recebe contra a linha e fica preso.`
                :v.por==="ancho"?`Não pressionam alto: com os laterais altos você estica o bloco e progride por fora.`
                :`Sai com ${m} contra ${s}; os laterais altos dão amplitude.`,
               en:v.por==="trampa"?`They press with ${s} and wait on the flank: the full-back receives against the line and gets trapped.`
                :v.por==="ancho"?`They don't press high: high full-backs stretch their block and you progress down the flanks.`
                :`You build with ${m} against ${s}; high full-backs give you width.`},
    largo:{es:v.por==="espalda"?`Suben muchos a presionar: detrás de su línea hay campo para tu 9 y la segunda pelota.`
             :v.por==="poblado"?`Te esperan atrás con ${s} centrales y todo el bloque: la pelota larga cae donde están ellos.`
             :`Pelota larga contra ${s} centrales: depende de quién gane el primer salto.`,
           pt:v.por==="espalda"?`Sobem muitos para pressionar: atrás da linha deles há espaço para o seu 9.`
             :v.por==="poblado"?`Esperam atrás com todo o bloco: a bola longa cai onde eles estão.`
             :`Bola longa contra ${s} zagueiros: depende de quem ganha a primeira disputa.`,
           en:v.por==="espalda"?`Lots of them push up to press: there's grass behind their line for your 9.`
             :v.por==="poblado"?`They sit deep with the whole block: the long ball lands where they are.`
             :`Long ball against ${s} centre-backs: it's about who wins the first header.`}},
   defensa:{
    presion:{es:(v.por.startsWith("saltan")?`No construyen desde abajo: te saltan la presión con un pelotazo y te agarran mal parado.`
              :v.por.startsWith("muerde")?`Presionás con ${m} contra ${s} que salen jugando: les tapás los pases cortos.`
              :`Salen con ${s} y vos presionás con ${m}: les sobra uno y se te escapan.`)+(v.por.includes("mano")?" Atrás quedás mano a mano con sus puntas.":""),
             pt:(v.por.startsWith("saltan")?`Eles não constroem por baixo: pulam sua pressão com a bola longa.`
              :v.por.startsWith("muerde")?`Pressiona com ${m} contra ${s} que saem jogando: fecha os passes curtos.`
              :`Saem com ${s} e você pressiona com ${m}: sobra um para eles.`)+(v.por.includes("mano")?" Atrás fica mano a mano.":""),
             en:(v.por.startsWith("saltan")?`They don't build from the back: they go long over your press and catch you open.`
              :v.por.startsWith("muerde")?`You press with ${m} against ${s} playing out: you cut off the short passes.`
              :`They build with ${s} and you press with ${m}: they have a spare man and escape.`)+(v.por.includes("mano")?" At the back you're one-on-one with their strikers.":"")},
    medio:{es:v.por==="cierra"?`Viven de la contra: bloque medio y compacto, no tienen espacio para correr.`
             :v.por==="ceden"?`Les dejás la pelota y la van a mover. ${m} contra ${s} en el medio.`
             :`${m} contra ${s} por dentro: ${m>s?"les cerrás el centro.":m===s?"se define en los duelos.":"te superan por dentro."}`,
           pt:v.por==="cierra"?`Vivem do contra-ataque: bloco médio e compacto, sem espaço para correr.`
             :v.por==="ceden"?`Você deixa a bola com eles. ${m} contra ${s} no meio.`
             :`${m} contra ${s} por dentro.`,
           en:v.por==="cierra"?`They live on the counter: a compact mid-block leaves them no space to run.`
             :v.por==="ceden"?`You give them the ball and they'll move it. ${m} against ${s} in midfield.`
             :`${m} against ${s} through the middle.`},
    repliegue:{es:v.por==="sin-espacio"?`Contra un equipo de contraataque, replegar les quita el espacio a la espalda.`
               :v.por==="invitas"?`Les regalás la pelota y el campo: te van a encerrar en tu área.`
               :`Dos bloques bajos: ${m} tuyos contra ${s} de ellos cerca del área.`,
              pt:v.por==="sin-espacio"?`Contra um time de contra-ataque, recuar tira o espaço nas costas.`
               :v.por==="invitas"?`Entrega a bola e o campo: vão te prender na área.`
               :`${m} seus contra ${s} deles perto da área.`,
              en:v.por==="sin-espacio"?`Against a counter-attacking side, dropping off removes the space in behind.`
               :v.por==="invitas"?`You hand them ball and territory: they'll pin you in your box.`
               :`${m} of yours against ${s} of theirs near the box.`}},
   llegada:{
    centros:{es:v.por==="cinco"?`Tienen ${s} atrás: el área está llena y cada centro lo rechazan.`
              :v.por==="area"?`Se cierran por dentro y dejan los costados: el centro es el camino${m>=2?", y tenés gente para cabecear":""}.`
              :v.por==="dos"?`Con dos puntas en el área, cada centro es una ocasión.`:`Un solo punta contra ${s} defensores: centro a centro, lo ganan ellos.`,
             pt:v.por==="cinco"?`Têm ${s} atrás: a área está cheia.`:v.por==="area"?`Fecham por dentro e deixam as laterais: o cruzamento é o caminho.`
              :v.por==="dos"?`Com dois atacantes na área, cada cruzamento é chance.`:`Um só atacante contra ${s} defensores.`,
             en:v.por==="cinco"?`They have ${s} at the back: the box is packed.`:v.por==="area"?`They shut the middle and leave the flanks: crossing is the way.`
              :v.por==="dos"?`With two strikers in the box, every cross is a chance.`:`One striker against ${s} defenders.`},
    dentro:{es:v.por==="espalda"?`Juegan con la línea alta: entre líneas y a la espalda hay espacio para el pase filtrado.`
             :v.por==="cerrado"?`Están todos atrás y cerrados por dentro: el pase filtrado no tiene hueco.`
             :`${m} contra ${s} entre líneas.`,
            pt:v.por==="espalda"?`Jogam com a linha alta: há espaço nas costas para o passe.`:v.por==="cerrado"?`Estão todos atrás e fechados por dentro.`:`${m} contra ${s} entre linhas.`,
            en:v.por==="espalda"?`They play a high line: there's space between the lines and in behind.`:v.por==="cerrado"?`Everyone's back and narrow: no gap for the through ball.`:`${m} against ${s} between the lines.`},
    cambio:{es:v.por==="cinco"?`Con ${Math.max(5,s)} atrás cubren todo el ancho: el cambio de frente no encuentra a nadie solo.`
             :v.por==="basculan"?`Bascula todo el bloque hacia la pelota: el lado débil queda vacío.`
             :`Te esperan abiertos: el cambio de frente no sorprende.`,
            pt:v.por==="cinco"?`Com cinco atrás cobrem toda a largura.`:v.por==="basculan"?`O bloco inteiro bascula: o lado fraco fica vazio.`:`Esperam abertos: a inversão não surpreende.`,
            en:v.por==="cinco"?`With five at the back they cover the full width.`:v.por==="basculan"?`The whole block shifts to the ball: the weak side is empty.`:`They're already wide: the switch doesn't surprise.`}}
  };
  const t=X[fase][op];
  return L(t)+(v.coh?t3(" Tu equipo lo tiene automatizado."," Seu time tem isso automatizado."," Your team has this drilled."):"");
}

/* ==========================================================
   FORMAS EN LA CANCHA (x 0-100 ancho, Y 0-100 desde tu arco)
   ========================================================== */
const PRESION_RIVAL={pre:[42,.45],pos:[30,.5],con:[15.5,.53],blo:[3,.5]};
const SALIDA_RIVAL={pos:[2,.45],pre:[4,.45],con:[10,.45],blo:[14,.45]};
const BLOQUE_RIVAL={blo:[3,.5],con:[10,.52],pos:[22,.55],pre:[30,.5]};
const DEF_MIA={presion:[40,.5],medio:[22,.55],repliegue:[3,.5]};

function formaMia(fase,op,f){
  const pts=ONCE[f].map(s=>({rol:s[0],x:s[1],y:s[2]}));
  const R=RASGOS[f];
  if(fase==="salida"){
    pts.forEach(p=>{p.Y=p.rol==="POR"?6:4+0.52*p.y;});
    const dfc=pts.filter(p=>p.rol==="DFC"), lat=pts.filter(p=>/^(LT|CA)/.test(p.rol));
    if(op==="tres"){
      if(dfc.length===2){ dfc[0].x=22;dfc[1].x=78;dfc.forEach(p=>p.Y=10);
        const cinco=pts.filter(p=>ROL[p.rol].g==="MED").sort((a,b)=>a.y-b.y)[0]; if(cinco){cinco.x=50;cinco.Y=11;} }
      else { dfc.forEach((p,i)=>{p.x=[18,50,82][i];p.Y=10;}); }
      lat.forEach(p=>{p.Y+=12;p.x=p.x<50?7:93;});
    } else if(op==="laterales"){
      dfc.forEach((p,i)=>{p.x=dfc.length===2?[32,68][i]:[20,50,80][i];p.Y=8;});
      lat.forEach(p=>{p.Y=44;p.x=p.x<50?4:96;});
    } else {
      pts.forEach(p=>{ if(p.rol==="DC")p.Y=64; if(/^EX/.test(p.rol)){p.Y=57;p.x=p.x<50?22:78;} if(p.rol==="MCO")p.Y=52;
        if(p.rol==="MI"||p.rol==="MD") p.Y+=8; });
    }
  } else if(fase==="defensa"){
    const [a,b]=DEF_MIA[op];
    pts.forEach(p=>{p.Y=p.rol==="POR"?5:a+b*p.y;});
    if(op==="medio") pts.forEach(p=>{if(p.rol!=="POR") p.x=50+(p.x-50)*0.82;});
    if(op==="repliegue") pts.forEach(p=>{if(p.rol!=="POR") p.x=50+(p.x-50)*0.85;});
  } else {
    pts.forEach(p=>{p.Y=p.rol==="POR"?9:30+0.62*p.y;});
    const anchos=pts.filter(p=>(p.x<22||p.x>78)&&p.y>40);
    if(op==="centros"){ anchos.forEach(p=>{p.x=p.x<50?6:94;p.Y=80;}); pts.forEach(p=>{if(p.rol==="DC")p.Y=88;}); }
    else if(op==="dentro"){ pts.forEach(p=>{ if(/^EX/.test(p.rol)||(p.rol==="MI"||p.rol==="MD")){p.x=p.x<50?36:64;p.Y=Math.max(p.Y,72);} if(p.rol==="MCO")p.Y=74; }); }
    else { anchos.forEach(p=>{p.x=p.x<50?3:97;p.Y=70;}); const izq=pts.filter(p=>p.x<50&&p.rol!=="POR"); izq.forEach(p=>{p.x=Math.max(3,p.x-6);}); }
  }
  return pts;
}
function formaRival(fase,e,f){
  const me=MID[e];
  const [a,b]=fase==="salida"?PRESION_RIVAL[me]:fase==="defensa"?SALIDA_RIVAL[me]:BLOQUE_RIVAL[me];
  return ONCE[f].map(s=>{
    let x=100-s[1], Y=100-(s[0]==="POR"?(fase==="defensa"?4:5):a+b*s[2]);
    if(fase==="llegada"&&me==="blo"&&s[0]!=="POR") x=50+(x-50)*0.75;
    return {rol:s[0],x,Y};
  });
}
// zona que se ilumina según la opción
function zonaClave(fase,op){
  const Z={salida:{tres:[0,0,100,30],laterales:[0,22,24,40],largo:[25,48,50,24]},
           defensa:{presion:[0,68,100,32],medio:[20,36,60,30],repliegue:[15,0,70,30]},
           llegada:{centros:[22,80,56,20],dentro:[33,64,34,22],cambio:[78,55,22,35]}};
  return Z[fase][op];
}
// recorrido de la pelota en la animación de confirmación
function caminoPelota(fase,op,mia){
  const por=mia.find(p=>p.rol==="POR"), dc=mia.find(p=>p.rol==="DC")||mia[mia.length-1];
  const baja=mia.filter(p=>p.rol!=="POR").sort((a,b)=>a.Y-b.Y);
  if(fase==="salida"){
    if(op==="largo") return [por,dc,{x:dc.x+8,Y:dc.Y+14}];
    if(op==="laterales"){ const l=mia.filter(p=>/^(LT|CA)/.test(p.rol))[0]||baja[2]; return [por,baja[0],l,{x:l.x<50?18:82,Y:l.Y+18}]; }
    return [por,baja[0],baja[1],{x:50,Y:45}];
  }
  if(fase==="defensa"){
    if(op==="presion") return [{x:48,Y:96},{x:30,Y:88},{x:34,Y:84}];
    if(op==="medio") return [{x:48,Y:96},{x:30,Y:80},{x:45,Y:58},{x:47,Y:52}];
    return [{x:48,Y:96},{x:60,Y:60},{x:52,Y:30},{x:50,Y:22}];
  }
  const ex=mia.filter(p=>p.x<15||p.x>85).sort((a,b)=>b.Y-a.Y)[0]||dc;
  if(op==="centros") return [{x:50,Y:60},ex,{x:50,Y:92}];
  if(op==="dentro") return [{x:50,Y:58},{x:44,Y:72},{x:52,Y:90}];
  const izq=mia.filter(p=>p.x<50&&p.Y>55)[0]||{x:20,Y:70}, der=mia.filter(p=>p.x>80).sort((a,b)=>b.Y-a.Y)[0]||{x:94,Y:72};
  return [{x:40,Y:60},izq,der,{x:70,Y:92}];
}

/* ==========================================================
   PIZARRA DEL MOMENTO (SVG con transiciones)
   ========================================================== */
const MW=420, MH=520;
const px=x=>x/100*MW, py=Y=>MH-(Y/100)*MH;
function svgMomento(fase,op,yo,el,once,rivOnce,colores){
  const mia=formaMia(fase,op,yo.f), suya=formaRival(fase,el.e,el.f);
  const z=zonaClave(fase,op);
  const fc=colores||{fill:"#4FBF7F",stroke:"#183028",txt:"#0D1613"};
  const lineas=`<rect width="${MW}" height="${MH}" fill="#224236"/>
    ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect y="${i*MH/10}" width="${MW}" height="${MH/20}" fill="#284C3E"/>`).join("")}
    <rect x="6" y="6" width="${MW-12}" height="${MH-12}" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <line x1="6" y1="${MH/2}" x2="${MW-6}" y2="${MH/2}" stroke="#5A8A76" stroke-width="1.5"/>
    <circle cx="${MW/2}" cy="${MH/2}" r="44" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${MW/2-80}" y="6" width="160" height="62" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <rect x="${MW/2-80}" y="${MH-68}" width="160" height="62" fill="none" stroke="#5A8A76" stroke-width="1.5"/>
    <g stroke="#5A8A76" stroke-dasharray="4 7" opacity=".45"><line x1="6" y1="${MH/3}" x2="${MW-6}" y2="${MH/3}"/><line x1="6" y1="${2*MH/3}" x2="${MW-6}" y2="${2*MH/3}"/></g>`;
  const zona=`<rect id="mzona" x="${px(z[0])}" y="${py(z[1]+z[3])}" width="${px(z[2])}" height="${MH*z[3]/100}"
      fill="#E0A93B" opacity=".13" stroke="#E0A93B" stroke-dasharray="6 5" stroke-width="1.5" rx="6" style="transition:all .7s"/>`;
  const riv=suya.map((p,i)=>`<g class="mj" style="transform:translate(${px(p.x)}px,${py(p.Y)}px)">
      <circle r="11" fill="#141C19" stroke="#E6ECEF" stroke-width="2.5" stroke-dasharray="3 2"/>
      <text y="4" text-anchor="middle" class="pos-chip" font-size="10" fill="#E6ECEF">${rivOnce&&rivOnce[i]?rivOnce[i].rt:""}</text></g>`).join("");
  const mio=mia.map((p,i)=>`<g class="mj" id="mm-${i}" style="transform:translate(${px(p.x)}px,${py(p.Y)}px)">
      <circle r="13" fill="${fc.fill}" stroke="${fc.stroke}" stroke-width="2.5"/>
      <text y="4.5" text-anchor="middle" class="pos-chip" font-size="11" fill="${fc.txt}">${once&&once[i]?once[i].rt:""}</text>
      <text y="25" text-anchor="middle" font-size="8.5" font-weight="600" fill="#DCEFE5">${once&&once[i]?(once[i].jug.nom||"").split(" ").pop():""}</text></g>`).join("");
  return `<svg id="pizMomento" class="cancha momento" viewBox="0 0 ${MW} ${MH}" role="img"
      aria-label="${L(FASES.find(F=>F.id===fase).n)}">${lineas}${zona}
      <path id="mpelota-camino" d="" fill="none" stroke="#FFF" stroke-width="2.5" stroke-dasharray="7 6" opacity=".0"/>
      ${riv}${mio}
      <circle id="mpelota" r="6" fill="#FFF" stroke="#111" stroke-width="1.5" style="opacity:0"/></svg>`;
}
// mueve las fichas propias a la forma de otra opción (sin redibujar: transición CSS)
function moverFormaMia(fase,op,f){
  const mia=formaMia(fase,op,f);
  mia.forEach((p,i)=>{ const g=document.getElementById("mm-"+i); if(g) g.style.transform=`translate(${px(p.x)}px,${py(p.Y)}px)`; });
  const z=zonaClave(fase,op), r=document.getElementById("mzona");
  if(r){ r.setAttribute("x",px(z[0])); r.setAttribute("y",py(z[1]+z[3])); r.setAttribute("width",px(z[2])); r.setAttribute("height",MH*z[3]/100); }
}
function animarPelota(fase,op,f,alTerminar){
  const cam=caminoPelota(fase,op,formaMia(fase,op,f));
  const d=cam.map((p,i)=>`${i?"L":"M"}${px(p.x)} ${py(p.Y)}`).join(" ");
  const path=document.getElementById("mpelota-camino"), b=document.getElementById("mpelota");
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!path||!b||reduce||!path.getTotalLength){ if(alTerminar) alTerminar(); return; }
  path.setAttribute("d",d); path.style.opacity=".75";
  const len=path.getTotalLength(), dur=1500, t0=performance.now();
  b.style.opacity="1";
  const paso=t=>{
    const k=Math.min(1,(t-t0)/dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    const p=path.getPointAtLength(len*e);
    b.setAttribute("cx",p.x); b.setAttribute("cy",p.y);
    if(k<1) requestAnimationFrame(paso); else if(alTerminar) alTerminar();
  };
  requestAnimationFrame(paso);
}
