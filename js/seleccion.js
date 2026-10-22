// Carrera de DT — LA SELECCIÓN: convocatoria (no hay mercado) y torneos de verdad:
// eliminatorias de tu confederación, la copa continental y un Mundial con grupos y cuadro.

/* ---------- selecciones del mundo (rivales) ---------- */
const SELECCIONES_MUNDO=[
 {n:"Venezuela",p:"Venezuela",niv:2,c:["#7A1F2B","#F5C518"],conf:"conmebol"},{n:"Bolivia",p:"Bolivia",niv:2,c:["#0B6B3A","#FFFFFF"],conf:"conmebol"},
 {n:"Francia",p:"Francia",niv:5,c:["#1A3A8F","#FFFFFF"],conf:"uefa"},{n:"Inglaterra",p:"Inglaterra",niv:5,c:["#FFFFFF","#1A2A5A"],conf:"uefa"},
 {n:"Alemania",p:"Alemania",niv:5,c:["#FFFFFF","#111111"],conf:"uefa"},{n:"Portugal",p:"Portugal",niv:5,c:["#C8102E","#0B6B3A"],conf:"uefa"},
 {n:"Países Bajos",p:"Países Bajos",niv:4,c:["#F36C21","#FFFFFF"],conf:"uefa"},{n:"Bélgica",p:"Bélgica",niv:4,c:["#C8102E","#111111"],conf:"uefa"},
 {n:"Croacia",p:"Croacia",niv:4,c:["#FFFFFF","#C8102E"],conf:"uefa"},{n:"Italia",p:"Italia",niv:4,c:["#1A5FB4","#FFFFFF"],conf:"uefa"},
 {n:"Suiza",p:"Suiza",niv:3,c:["#D52B1E","#FFFFFF"],conf:"uefa"},{n:"Dinamarca",p:"Dinamarca",niv:3,c:["#C8102E","#FFFFFF"],conf:"uefa"},
 {n:"Estados Unidos",p:"Estados Unidos",niv:4,c:["#FFFFFF","#1A2A5A"],conf:"concacaf"},{n:"Canadá",p:"Canadá",niv:3,c:["#D52B1E","#FFFFFF"],conf:"concacaf"},
 {n:"Costa Rica",p:"Costa Rica",niv:2,c:["#C8102E","#1A3A8F"],conf:"concacaf"},{n:"Panamá",p:"Panamá",niv:2,c:["#C8102E","#FFFFFF"],conf:"concacaf"},
 {n:"Jamaica",p:"Jamaica",niv:2,c:["#F5C518","#0B6B3A"],conf:"concacaf"},
 {n:"Japón",p:"Japón",niv:4,c:["#1A2A6E","#FFFFFF"],conf:"resto"},{n:"Marruecos",p:"Marruecos",niv:4,c:["#C8102E","#0B6B3A"],conf:"resto"},
 {n:"Senegal",p:"Senegal",niv:3,c:["#FFFFFF","#0B6B3A"],conf:"resto"},{n:"Corea del Sur",p:"Corea del Sur",niv:3,c:["#C8102E","#1A2A6E"],conf:"resto"},
 {n:"Australia",p:"Australia",niv:3,c:["#F5C518","#0B6B3A"],conf:"resto"}
];
SELECCIONES_MUNDO.forEach(s=>s.sel=true);
const CONF_SEL={"Uruguay":"conmebol","Argentina":"conmebol","Brasil":"conmebol","Colombia":"conmebol","Chile":"conmebol","Paraguay":"conmebol",
  "Perú":"conmebol","Ecuador":"conmebol","México":"concacaf","España":"uefa"};
function confDe(s){ return s.conf||CONF_SEL[s.n]||"conmebol"; }
function todasSel(){ return SELECCIONES.concat(SELECCIONES_MUNDO).map(s=>Object.assign({sel:true,conf:confDe(s)},s)); }
// nombres para las selecciones que no tienen liga en el juego (combinaciones genéricas, no jugadores reales)
Object.assign(NOMBRES,{
 "Países Bajos":{n:["Daan","Sem","Thijs","Lars","Bram","Jesse","Ruben","Stijn","Niek","Joep","Koen","Milan"],a:["Jansen","de Vries","Bakker","Visser","Smit","Meijer","Mulder","de Boer","Bos","Vos","Peters","Hendriks"]},
 "Croacia":{n:["Ivan","Mateo","Josip","Marko","Ante","Domagoj","Bruno","Filip","Nikola","Dario","Tin","Karlo"],a:["Horvat","Kovačević","Babić","Marić","Jurić","Novak","Knežević","Vuković","Perić","Šarić","Tomić","Barišić"]},
 "Dinamarca":{n:["Mads","Rasmus","Mikkel","Jonas","Frederik","Oliver","Magnus","Emil","Kasper","Andreas","Viktor","Mathias"],a:["Jensen","Nielsen","Hansen","Pedersen","Andersen","Larsen","Sørensen","Rasmussen","Jørgensen","Madsen","Kristensen","Olsen"]},
 "Japón":{n:["Haruto","Sota","Yuto","Riku","Kaito","Ren","Hayato","Shun","Kenta","Taiga","Ryota","Kazuki"],a:["Tanaka","Suzuki","Sato","Watanabe","Ito","Nakamura","Kobayashi","Yamamoto","Kato","Yoshida","Matsumoto","Inoue"]},
 "Corea del Sur":{n:["Ji-hoon","Min-ho","Seung-woo","Tae-yang","Jun-young","Hyun-su","Dong-won","Sung-min","Ye-jun","Jae-won"],a:["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoon","Jang","Lim"]},
 "Marruecos":{n:["Youssef","Hamza","Ayoub","Anas","Bilal","Ilias","Zakaria","Soufiane","Mehdi","Rayane","Othmane","Adam"],a:["El Idrissi","Bennani","Alaoui","Tazi","El Amrani","Berrada","Chraibi","Lahlou","Fassi","Ouazzani","Benjelloun","Kettani"]},
 "Senegal":{n:["Moussa","Cheikh","Ibrahima","Mamadou","Abdou","Lamine","Ousmane","Babacar","Modou","Assane","Serigne","Alioune"],a:["Diop","Ndiaye","Fall","Sarr","Diallo","Sow","Faye","Gueye","Mbaye","Cissé","Thiam","Seck"]}
});
Object.assign(ALIAS_NOM,{"Venezuela":"Argentina","Bolivia":"Argentina","Portugal":"Brasil","Bélgica":"Francia","Suiza":"Alemania",
  "Canadá":"Inglaterra","Costa Rica":"Argentina","Panamá":"Argentina","Jamaica":"Inglaterra","Australia":"Inglaterra"});
const ELIM_NOM={conmebol:{es:"Eliminatorias Sudamericanas",pt:"Eliminatórias Sul-Americanas",en:"South American Qualifiers"},
  uefa:{es:"Eliminatorias UEFA",pt:"Eliminatórias da UEFA",en:"UEFA Qualifiers"},concacaf:{es:"Eliminatorias Concacaf",pt:"Eliminatórias da Concacaf",en:"Concacaf Qualifiers"}};
const COPA_SEL={conmebol:{es:"Copa América",pt:"Copa América",en:"Copa América"},uefa:{es:"Eurocopa",pt:"Eurocopa",en:"EURO"},concacaf:{es:"Copa Oro",pt:"Copa Ouro",en:"Gold Cup"}};

/* ---------- qué juega la selección cada año: eliminatorias → copa continental → Mundial ---------- */
function armarTemporadaSel(TT){
  S.selT=(S.selT||0)+1;
  const ciclo=(S.selT-1)%3, conf=confDe(S.club);
  const otras=todasSel().filter(s=>s.n!==S.club.n), deConf=otras.filter(s=>s.conf===conf);
  if(ciclo===0){
    TT.ligaNombre=L(ELIM_NOM[conf]||ELIM_NOM.conmebol);
    return {clubesLiga:R.mz(deConf).slice(0,9),copa:null};
  }
  if(ciclo===1){
    let riv=R.mz(deConf).slice(0,7);
    if(riv.length<7){ const inv=R.mz(otras.filter(s=>s.conf!==conf&&!riv.includes(s))); riv=riv.concat(inv).slice(0,7); }
    return {clubesLiga:[],copa:{nombre:L(COPA_SEL[conf]||COPA_SEL.conmebol),tipo:"sel",rivales:riv}};
  }
  // el Mundial: 16 selecciones, 4 bombos, 4 grupos de 4; pasan dos de cada grupo a cuartos
  const cupos={conmebol:4,uefa:6,concacaf:2,resto:3}; cupos[conf]=Math.max(0,cupos[conf]-1);
  let elegidas=[];
  Object.entries(cupos).forEach(([cf,n])=>{ const l=otras.filter(s=>s.conf===cf).sort((a,b)=>b.niv-a.niv||S.rng()-0.5); elegidas=elegidas.concat(l.slice(0,n)); });
  if(elegidas.length<15) elegidas=elegidas.concat(R.mz(otras.filter(s=>!elegidas.includes(s)))).slice(0,15);
  elegidas=elegidas.slice(0,15);
  const todos=[S.club].concat(elegidas).sort((a,b)=>(b===S.club?0.5:0)-(a===S.club?0.5:0)+b.niv-a.niv);
  const bombos=[0,1,2,3].map(k=>R.mz(todos.slice(k*4,k*4+4)));
  const grupos=[[],[],[],[]];
  bombos.forEach(b=>{ const yo=b.indexOf(S.club); if(yo>=0){ grupos[0].push(S.club); b.splice(yo,1); }
    let g=0; b.forEach(c=>{ while(grupos[g].length>bombos.indexOf(b)) g++; grupos[g].push(c); }); });
  TT.mundial=true;
  TT.ligaNombre=`${t3("Copa del Mundo","Copa do Mundo","World Cup")} · ${t3("Grupo","Grupo","Group")} A`;
  TT.gruposClubes=grupos.slice(1);
  return {clubesLiga:grupos[0].filter(c=>c!==S.club),copa:{nombre:t3("Copa del Mundo","Copa do Mundo","World Cup"),tipo:"sel",mundial:true}};
}
// al terminar la fase de grupos: se juegan los otros tres grupos y se arma el cuadro
function armarCuartosMundial(TT){
  const C=TT.copa; if(!C||!C.pendiente) return;
  const tabla=eqs=>ordenTabla(eqs,"tab").map(x=>x.e);
  const mio=tabla(TT.equipos);
  const otros=(TT.otrosGrupos||[]).map(g=>{ todosContraTodos(g.length).slice(0,g.length-1).forEach(f=>f.forEach(([a,b])=>{
      const r=jugarPartido(g[a],g[b],true,false); sumarTabla(g[a].tab,r.ga,r.gb); sumarTabla(g[b].tab,r.gb,r.ga); })); return tabla(g); });
  TT.grupos=[mio].concat(otros).map((t,k)=>({letra:"ABCD"[k],tabla:t}));
  const [A,B,Cg,D]=[mio].concat(otros);
  // cruces: 1A-2B, 1C-2D, 1B-2A, 1D-2C (los ganadores de A y B no se cruzan hasta la final)
  const cruces=[A[0],B[1],Cg[0],D[1],B[0],A[1],D[0],Cg[1]];
  const yoPaso=cruces.some(e=>e.yo);
  // la copa necesita que el índice 0 sea mi selección (así la encuentra el resto del juego)
  const eqs=yoPaso?[{club:S.club,yo:true}].concat(cruces.filter(e=>!e.yo)):cruces.slice();
  C.equipos=eqs;
  C.vivos=cruces.map(e=>e.yo?0:eqs.indexOf(e));
  C.pendiente=false;
  if(!yoPaso){ C.eliminado=t3("Fase de grupos","Fase de grupos","Group stage"); }
}

/* ---------- la convocatoria ---------- */
// la base: unos 40 jugadores que la selección sigue. Nombres generados (los planteles reales del
// juego no traen la nacionalidad, así que no se convoca a nadie real por error).
function generarBaseSel(sel){
  const base=nivelBaseDe(sel.niv,3)+8, out=[];
  [["POR",5],["DEF",12],["MED",12],["ATA",9]].forEach(([g,n])=>{
    for(let i=0;i<n;i++){
      let j=nuevoJugador(g,base+R.e(-9,5),3,R.e(20,33),sel.p), k=0;
      while(out.some(x=>x.nom===j.nom)&&k++<8) j=nuevoJugador(g,j.rt,3,j.ed,sel.p);
      j.afuera=S.rng()<(sel.niv>=4?0.6:0.4); if(j.afuera) j.rt=clamp(j.rt+3,30,94);
      const PG=POS_GRUPO[g]; j.pos=armarPos(PG[i%PG.length],hashTxt(j.nom)>>3);
      out.push(j);
    }
  });
  // el referente: el que lleva años en la selección
  const ref=out.filter(j=>j.g!=="POR").sort((a,b)=>b.rt-a.rt)[R.e(0,3)]; if(ref){ ref.ed=R.e(32,34); ref.referente=true; }
  return out;
}
function renovarBaseSel(){
  const B=S.baseSel; if(!B) return;
  if(S.baseT===S.temporada) return; S.baseT=S.temporada;
  // se retiran los grandes, aparecen pibes; cada uno llega a la ventana con su momento en el club
  for(let i=B.length-1;i>=0;i--){ const j=B[i]; if(j.ed>=35||(j.ed>=33&&S.rng()<0.35)){ B.splice(i,1); const k=S.plantel.indexOf(j); if(k>=0) S.plantel.splice(k,1); } }
  const base=nivelBaseDe(S.club.niv,3)+8;
  const faltan=g=>({POR:5,DEF:12,MED:12,ATA:9}[g]-B.filter(j=>j.g===g).length);
  ["POR","DEF","MED","ATA"].forEach(g=>{ for(let i=0;i<Math.max(1,faltan(g));i++){
    let j=nuevoJugador(g,base+R.e(-12,2),3,R.e(18,21),S.club.p), k=0;
    while(B.some(x=>x.nom===j.nom)&&k++<8) j=nuevoJugador(g,j.rt,3,j.ed,S.club.p);
    posDe(j); j.nuevoSel=true; B.push(j); } });
  // la joya que pide la gente
  // (no siempre es mejor que los que ya están: la gente pide por lo que vio en un par de partidos)
  const pibes=B.filter(j=>j.nuevoSel&&j.g!=="POR"); if(pibes.length){ const p=R.el(pibes); p.rt=clamp(base+R.e(-5,6),30,94); p.joya=true; }
  B.forEach(j=>{ if(!S.plantel.includes(j)){ j.forma=R.e(-4,4); j.les=S.rng()<0.06?R.e(1,3):0; } });
}
function abrirConvocatoria(){
  if(!S.baseSel){ S.baseSel=S.plantel.slice(); S.baseSel.forEach(j=>posDe(j)); }
  renovarBaseSel();
  tmp.conv=new Set(S.plantel.filter(j=>S.baseSel.includes(j)));
  pintarConvocatoria(); ir("mercado");
}
const MIN_CONV={POR:2,DEF:6,MED:6,ATA:3};
function pistasConv(j){
  const l=[];
  if(j.referente) l.push({t:t3("referente del grupo","referência do grupo","dressing-room leader"),k:"ok"});
  if(j.joya) l.push({t:t3("la gente lo pide","a torcida pede","the fans want him"),k:"ok"});
  if((j.forma||0)<=-3) l.push({t:t3("no juega en su club","não joga no clube","not playing at his club"),k:"mal"});
  if((j.forma||0)>=3) l.push({t:t3("la rompe en su club","arrebenta no clube","flying at his club"),k:"ok"});
  if(j.les>0) l.push({t:t3("viene de lesión","vem de lesão","coming back from injury"),k:"mal"});
  if(j.nuevoSel&&!j.joya) l.push({t:t3("nunca fue convocado","nunca foi convocado","never been called up"),k:""});
  return l;
}
function pintarConvocatoria(){
  const B=S.baseSel, sel=tmp.conv, n=sel.size;
  const porG=g=>[...sel].filter(j=>j.g===g).length;
  const ok=n===23&&Object.entries(MIN_CONV).every(([g,m])=>porG(g)>=m);
  $("#s-mercado").innerHTML=`
    <h2 class="disp">${T("convocatoria")}</h2>
    <p class="mini">${t3("En la selección no se ficha: se elige. Veintitrés, con al menos dos arqueros. Lo que se ve es cómo llega cada uno; lo que no, cómo responde con esta camiseta.",
      "Na seleção não se contrata: se escolhe. Vinte e três, com pelo menos dois goleiros.",
      "You don't sign players for a national team: you pick them. Twenty-three, at least two keepers.")}</p>
    ${(()=>{ const ref=B.find(j=>j.referente&&!sel.has(j)), joya=B.find(j=>j.joya&&!sel.has(j)); const a=[];
      if(ref) a.push(t3(`Si ${ref.nom} queda afuera, el vestuario lo va a sentir.`,`Se ${ref.nom} ficar de fora, o vestiário vai sentir.`,`If ${ref.nom} is left out, the dressing room will feel it.`));
      if(joya) a.push(t3(`La gente pide a ${joya.nom}.`,`A torcida pede ${joya.nom}.`,`The fans are asking for ${joya.nom}.`));
      return a.length?`<div class="alerta">${a.join(" ")}</div>`:""; })()}
    <div class="conv-cuenta ${ok?'ok':''}"><b>${n}/23</b>${["POR","DEF","MED","ATA"].map(g=>`<span class="${porG(g)<MIN_CONV[g]?'falta':''}">${tGrupo(g)} ${porG(g)}</span>`).join("")}</div>
    ${["POR","DEF","MED","ATA"].map(g=>`<div class="lbl-sel">${tGrupo(g)}</div>
      <div class="pn-lista">${B.filter(j=>j.g===g).sort((a,b)=>b.rt-a.rt).map(j=>{ const i=B.indexOf(j), on=sel.has(j);
        return `<button class="pn-cand conv ${on?'on':''}" onclick="marcarConv(${i})" aria-pressed="${on}">
          <span class="sup-rt">${j.rt}</span><span class="sup-nom">${j.nom}</span>
          <span class="sup-pos"><b class="pos-s">${posTxt(j)}</b> · ${j.ed} · ${j.afuera?t3("juega afuera","joga fora","plays abroad"):t3("liga local","liga local","home league")}</span>
          <span class="pn-pistas">${pistasConv(j).map(x=>`<em class="${x.k}">${x.t}</em>`).join("")}</span></button>`; }).join("")}</div>`).join("")}
    <div class="acciones conv-acc"><button class="btn" ${ok?'':'disabled'} onclick="confirmarConv()">${t3("Dar la lista","Divulgar a lista","Announce the squad")}</button>
      <button class="btn sec" onclick="sugerirConv()">${t3("Los de siempre","Os de sempre","The usual names")}</button></div>`;
  cabecera();
}
function marcarConv(i){ const j=S.baseSel[i], s=tmp.conv; if(s.has(j)) s.delete(j); else if(s.size<23) s.add(j); pintarConvocatoria(); }
// lo que haría cualquiera: por nombre y jerarquía, sin mirar el momento
function sugerirConv(){
  const B=S.baseSel, s=new Set(), por=g=>B.filter(j=>j.g===g).sort((a,b)=>b.rt-a.rt+(b.referente?5:0)-(a.referente?5:0));
  [["POR",3],["DEF",8],["MED",8],["ATA",4]].forEach(([g,n])=>por(g).slice(0,n).forEach(j=>s.add(j)));
  tmp.conv=s; pintarConvocatoria();
}
function confirmarConv(){
  const s=tmp.conv, ev=[];
  const ref=S.baseSel.find(j=>j.referente&&!s.has(j)), joya=S.baseSel.find(j=>j.joya&&s.has(j)), joyaAfuera=S.baseSel.find(j=>j.joya&&!s.has(j));
  if(ref){ S.vars.ves=clamp(S.vars.ves-5,0,100); S.vars.hin=clamp(S.vars.hin-3,0,100); ev.push(t3(`Dejaste afuera a ${ref.nom}: el vestuario lo siente.`,`Deixou ${ref.nom} de fora: o vestiário sente.`,`You left out ${ref.nom}: the dressing room feels it.`)); }
  if(joya){ S.vars.hin=clamp(S.vars.hin+3,0,100); ev.push(t3(`La gente celebra que esté ${joya.nom}.`,`A torcida comemora a convocação de ${joya.nom}.`,`The fans cheer ${joya.nom}'s call-up.`)); }
  if(joyaAfuera){ S.vars.hin=clamp(S.vars.hin-2,0,100); }
  S.plantel=[...s]; S.plantel.forEach(j=>{ if(typeof prepJug==="function") prepJug(j); delete j.nuevoSel; });
  S.fijos=(S.fijos||[]).filter(j=>s.has(j));
  tmp.conv=null;
  persuasion();
}
