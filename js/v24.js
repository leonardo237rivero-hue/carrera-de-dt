// v24 — El DT rival tiene escuela.
// Cada club rival tiene un entrenador con un perfil (siete escuelas). El perfil sale de cómo juega ese equipo
// y decide qué problemas te va a plantear más seguido: el que presiona arriba te complica la salida,
// el que se mete atrás te obliga a progresar y finalizar, el que contraataca castiga cada pérdida.
const PERFILES_DT={
 posicional:{n:['El Posicional','O Posicional','The Positional'],d:['Quiere la pelota y ocupar bien los espacios: vas a defender mucho y a presionar su salida.','Quer a bola e ocupar bem os espaços: você vai defender muito e pressionar a saída.','Wants the ball and the right spaces: you will defend a lot and press his build-up.'],
  fams:{presion:3,defensa:3,recuperar:2,perder:1}},
 provocador:{n:['El Provocador','O Provocador','The Provoker'],d:['Te invita a presionar para salir por donde dejaste el hueco: elegí bien cuándo saltar.','Convida a pressionar para sair pelo buraco que você deixou.','Invites your press so he can play through the gap you leave: choose when to jump.'],
  fams:{presion:4,perder:2,defensa:1,recuperar:1}},
 intenso:{n:['El Intenso','O Intenso','The Intense'],d:['Presiona arriba y contrapresiona: te va a apurar cada salida y cada pelota recuperada.','Pressiona alto e contrapressiona: vai apressar cada saída.','Presses high and counter-presses: he will rush every build-up and every recovered ball.'],
  fams:{salida:4,perder:2,recuperar:2}},
 vertical:{n:['El Vertical','O Vertical','The Vertical'],d:['Marca al hombre en toda la cancha y juega de ida y vuelta: partido de duelos y transiciones.','Marca homem a homem e joga de ida e volta.','Man-marks all over the pitch and plays end to end: a match of duels and transitions.'],
  fams:{salida:3,recuperar:2,perder:2,defensa:1}},
 zonal:{n:['El Zonal','O Zonal','The Zonal'],d:['Bloque corto y línea alta: hay que encontrar el carril libre y atacar su espalda.','Bloco curto e linha alta: ache o corredor livre e ataque as costas.','Short block and a high line: find the free lane and attack the space behind.'],
  fams:{progresion:3,finalizacion:2,salida:2}},
 contra:{n:['El de la Contra','O do Contra-ataque','The Counter-Attacker'],d:['Te deja la pelota y espera el error: cada pérdida tuya es una contra suya.','Deixa a bola e espera o erro: cada perda sua é um contra-ataque.','Lets you have the ball and waits for the mistake: every loss of yours is a counter of his.'],
  fams:{perder:3,progresion:2,finalizacion:2}},
 bloque:{n:['El del Bloque','O do Bloco','The Low-Block'],d:['Se mete atrás con todos: vas a tener que abrir un bloque cerrado y ganar la pelota parada.','Recua com todos: você vai ter que abrir um bloco fechado.','Sits deep with everyone: you will have to unlock a closed block and win the set pieces.'],
  fams:{progresion:3,finalizacion:3,parada:2}}
};
const GENERADOR_FAMILIA={salida:(c,k)=>generarSalida(c,k),presion:(c,k)=>generarPresion(c,k),defensa:(c,k)=>generarDefensa(c,k),progresion:(c,k)=>generarProgresion(c,k),finalizacion:(c,k)=>generarFinalizacion(c,k),recuperar:(c,k)=>generarRecuperar(c,k),perder:(c,k)=>generarPerder(c,k),parada:(c,k)=>generarParada(c,k)};
const ID_FAMILIA={'gen-salida':'salida','gen-presion':'presion','gen-defensa':'defensa','gen-progresion':'progresion','gen-finalizacion':'finalizacion','gen-recuperar':'recuperar','gen-perder':'perder','gen-parada':'parada'};
function perfilDT(club,m){
 m=m||{};const n=(club&&club.n)||'',h=hashS(n+'|dt');
 const cand=m.ofe==='posicional'?(m.def==='alto'?['intenso','provocador']:m.def==='bajo'?['zonal','bloque']:['posicional','provocador','zonal'])
  :(m.def==='bajo'?['bloque','contra']:m.def==='alto'?['vertical','intenso']:['contra','vertical','zonal']);
 return cand[h%cand.length];
}
function familiaPorPerfil(perfil,clave,evitar){
 const f=Object.entries(PERFILES_DT[perfil].fams).filter(([k])=>k!==evitar),tot=f.reduce((a,x)=>a+x[1],0);
 let r=hashS(clave+'|dtf')%tot;for(const [k,w] of f){if(r<w)return k;r-=w;}return f[0][0];
}
const _elegirSituacionV23b=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 // uno de cada tres problemas lo elige el DT rival según su escuela; el resto, como antes
 if(c&&c.el&&hashS(clave+'|dt3')%3===0){
  const perfil=perfilDT(c.el.club,c.el.m),fam=familiaPorPerfil(perfil,clave,ID_FAMILIA[S.ultimaSituacion]),s=GENERADOR_FAMILIA[fam](c,clave);
  if(s){s.dt=perfil;return s;}
 }
 return _elegirSituacionV23b(c,clave);
};
// el ayudante te dice contra quién estás jugando
const _abrirSituacionV23=abrirSituacion;
abrirSituacion=function(jor,rival,sit,c,clave){
 _abrirSituacionV23(jor,rival,sit,c,clave);
 const etq=document.querySelector('#v16-sit .etq');if(!etq||!rival)return;
 const perfil=perfilDT(rival.club,rival.modelo||modeloDeEstilo(rival.e)),P=PERFILES_DT[perfil];
 etq.insertAdjacentHTML('afterend',`<p class="v24-dt" style="margin:.25em 0 .6em;font-size:.86em;opacity:.85"><b style="letter-spacing:.06em;text-transform:uppercase;color:var(--acento,#f2c94c)">${t3('Su DT','Técnico deles','Their coach')} · ${t3(...P.n)}</b> — ${t3(...P.d)}</p>`);
};
