// v21 — Tercera familia del banco: defensa organizada.
// Cómo te paras vos (línea de 4 o de 5, altura del bloque) × cómo te ataca ESE rival
// (por dentro o por fuera, con centros o elaborando, con un jugador distinto o no, con extremos abiertos o no).
Object.assign(PRINCIPIOS,{
 bloque:{n:['Defender el espacio, no al hombre','Defender o espaço, não o homem','Defend space, not the man'],d:['Un bloque se mueve junto hacia la pelota: lo que importa es que no haya huecos entre los once, no a quién marca cada uno.','Um bloco se move junto para a bola: importa que não haja buracos.','A block moves together towards the ball: what matters is no gaps between the eleven, not who marks whom.']},
 area:{n:['Defender el área','Defender a área','Defending the box'],d:['Contra los centros manda el espacio: primer palo, punto penal y segundo palo ocupados antes de que llegue la pelota.','Contra cruzamentos manda o espaço: primeiro pau, marca do pênalti e segundo pau ocupados.','Against crosses space rules: near post, penalty spot and far post occupied before the ball arrives.']}
});
N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;

const SOLUCIONES_DEFENSA=[
 {id:'achicar',p:'entrelineas',r:'medio',pr:.07,g:/DFC|MCD/,vs:1,t:['Achicar: la defensa diez metros adelante','Compactar: defesa dez metros à frente','Squeeze up ten yards'],
  fit:B=>B.por==='centro'&&B.bloque!=='bajo'?.95:B.por==='centro'?.6:.4,si:['Sin espacio entre tus líneas no hay dónde recibir.','Sem espaço entre linhas não há onde receber.','No room between your lines, nowhere to receive.'],no:['Te atacan por fuera: achicar por dentro no cambia nada.','Atacam por fora: compactar por dentro não muda nada.','They attack wide: squeezing the middle changes nothing.'],
  mv:{CI:[38,26],CD:[62,26],CC:[50,26],LI:[14,30],LD:[86,30]},b:[[50,40],[50,30]]},
 {id:'bascular',p:'bloque',r:'bajo',pr:.06,g:/MC/,vs:1,t:['Bascular todo el equipo al lado de la pelota','Bascular o time todo para o lado da bola','Shift the whole team to the ball side'],
  fit:B=>B.por==='banda'&&!B.ancho?.9:B.por==='banda'?.5:.45,si:['No tienen a nadie abierto del otro lado: cargás donde está la pelota sin pagar nada.','Não têm ninguém aberto do outro lado.','Nobody is wide on the far side: you overload the ball side for free.'],no:['Hay un extremo esperando el cambio de frente del otro lado.','Há um ponta esperando a inversão.','A winger is waiting for the switch on the far side.'],
  mv:{CI:[48,18],CD:[70,18],LI:[30,22],M1:[56,34],M2:[72,34]},b:[[84,36],[92,52]]},
 {id:'ayudaExtremo',p:'dosuno',r:'bajo',pr:.06,g:/^E/,vs:0,t:['Que el extremo baje a ayudar al lateral','O ponta desce para ajudar o lateral','The winger drops to help the full-back'],
  fit:B=>B.por==='banda'&&B.linea===4?.95:B.por==='banda'?.5:.35,si:['Dos contra dos en la banda: el primero que ayuda es el que está más cerca.','Dois contra dois na faixa.','Two v two on the flank: the closest man helps first.'],no:['Con línea de cinco el carrilero ya cubre: el extremo se cansa para nada.','Com linha de cinco o ala já cobre.','With a back five the wing-back already covers: the winger tires for nothing.'],
  mv:{EX:[86,32]},b:[[84,36],[90,44]]},
 {id:'volanteLinea5',p:'bloque',r:'bajo',pr:.05,g:/MCD|MC$/,vs:0,t:['Un volante cae a la línea: defendemos con cinco','Um volante cai na linha: defendemos com cinco','A midfielder drops in: we defend with five'],
  fit:B=>B.ancho&&B.linea===4&&B.bloque==='bajo'?.85:.45,si:['Contra extremos bien abiertos cuatro no alcanzan a cubrir el ancho: cinco sí.','Contra pontas abertos quatro não cobrem a largura.','Against wide wingers four cannot cover the width: five can.'],no:['Te quedás con un volante menos y no había tanto ancho que cubrir.','Fica com um volante a menos.','You lose a midfielder and there was not that much width to cover.'],
  mv:{M2:[74,18]},b:[[84,36],[70,30]]},
 {id:'centralSalta',p:'entrelineas',r:'alto',pr:.08,g:/DFC/,vs:1,t:['Que un central salte al que recibe entre líneas','Um zagueiro salta em quem recebe entre linhas','A centre-back steps out to the man between the lines'],
  fit:B=>B.por==='centro'&&B.linea===5?.95:B.por==='centro'?.4:.25,si:['Con tres centrales uno puede salir: los otros dos cierran su lugar.','Com três zagueiros um pode sair.','With three centre-backs one can step out: the other two close his space.'],no:['Con dos centrales, el que sale deja un agujero en el medio del área.','Com dois zagueiros, quem sai deixa um buraco.','With two centre-backs, the one who steps out leaves a hole in the box.'],
  mv:{CC:[50,27],CD:[56,27]},b:[[50,40],[50,28]]},
 {id:'marcaCrack',p:'entrelineas',r:'medio',pr:.07,g:/MCD|MC$/,vs:1,t:['Marca individual a su jugador distinto','Marcação individual no jogador diferente','Man-mark their standout player'],
  fit:B=>B.crack?.9:.3,si:['Es el que les hace jugar a los demás: sin él, el resto no sabe qué hacer.','É quem faz os outros jogarem.','He makes the others play: without him the rest do not know what to do.'],no:['No tienen un jugador así: perseguís a uno y dejás tu zona.','Não têm um jogador assim.','They have no such player: you chase one and leave your zone.'],
  mv:{M1:[50,30]},b:[[50,40],[52,30]]},
 {id:'lineaAdelantada',p:'profundidad',r:'alto',pr:.06,g:/DFC/,vs:2,t:['Línea adelantada: dejarlos en fuera de juego','Linha adiantada: deixar em impedimento','High line: catch them offside'],
  fit:B=>B.bloque==='alto'&&B.por==='centro'&&!B.crack?.6:.3,si:['Si salen juntos, el pase al espacio llega a un jugador en offside.','Se saem juntos, o passe chega em impedimento.','If they step up together, the ball in behind finds a player offside.'],no:['Un solo defensor que se queda y el delantero queda mano a mano con tu arquero.','Um defensor que fica e o atacante sai cara a cara.','One defender lingers and the striker is through on your keeper.'],
  mv:{CI:[38,30],CD:[62,30],CC:[50,30],LI:[16,32],LD:[84,32]},b:[[50,40],[50,14]]},
 {id:'zonaArea',p:'area',r:'medio',pr:.07,g:/DFC/,vs:0,t:['Defender el área en zona: primer palo, penal y segundo palo','Defender a área em zona: primeiro pau, pênalti e segundo','Zonal box: near post, spot, far post'],
  fit:B=>B.centros?.95:.3,si:['La tiran al área: si los espacios ya están ocupados, ganás arriba aunque ellos sean más altos.','Cruzam na área: com os espaços ocupados você ganha.','They cross it in: with the spaces already filled you win in the air even against taller players.'],no:['No centran: amontonarte en el área es invitarlos a tirar de afuera.','Não cruzam: amontoar-se na área é convidar o chute de fora.','They do not cross: packing the box invites shots from outside.'],
  mv:{CI:[44,10],CD:[56,10],M1:[50,15]},b:[[86,30],[52,10]]},
 {id:'cerrarCarril',p:'entrelineas',r:'bajo',pr:.06,g:/MC$|MCO/,vs:1,t:['Los interiores cierran el carril de adentro','Os meias fecham o corredor interno','The inside midfielders close the inner lane'],
  fit:B=>!B.centros&&B.por==='centro'&&B.linea===4?.8:.45,si:['Por adentro no pasa nada: los obligás a ir por fuera, donde hacen menos daño.','Por dentro não passa nada.','Nothing gets through the middle: you force them wide, where they do less damage.'],no:['Cerrás adentro y ellos ya estaban yendo por afuera.','Fecha por dentro e eles já iam por fora.','You close the middle and they were already going wide.'],
  mv:{M1:[44,28],M2:[56,28]},b:[[50,40],[44,30]]},
 {id:'doblarExtremo',p:'dosuno',r:'medio',pr:.06,g:/LT|^E/,vs:0,t:['Doblar la marca a su extremo','Dobrar a marcação no ponta','Double up on their winger'],
  fit:B=>B.por==='banda'&&B.ancho?.85:.4,si:['Él es la vía: con dos encima, no hay centro ni gambeta.','Ele é o caminho: com dois em cima, não há cruzamento.','He is the route: with two on him there is no cross and no dribble.'],no:['Juntás dos en un lado que no era el peligroso.','Junta dois num lado que não era o perigoso.','You put two on a side that was not the danger.'],
  mv:{LD:[88,32],EX:[82,38]},b:[[84,36],[86,34]]},
 {id:'temporizar',p:'bloque',r:'bajo',pr:.04,g:/LT|DFC/,vs:0,t:['Temporizar: no ir al piso y esperar ayuda','Temporizar: não ir no chão e esperar ajuda','Jockey: stay on your feet and wait for help'],
  fit:()=>.55,si:['No ganás nada, pero no perdés nada: llega la ayuda.','Não ganha nada, mas não perde nada.','You win nothing, but you lose nothing: help arrives.'],no:['','',''],
  mv:{LD:[88,26]},b:[[84,36],[86,32]]},
 {id:'faltaTactica',p:'vigilancias',r:'medio',pr:.03,g:/MC/,vs:0,t:['Falta táctica lejos del área','Falta tática longe da área','Tactical foul far from the box'],
  fit:()=>.45,si:['Corta la jugada, a cambio de una amarilla.','Corta a jogada, em troca de um amarelo.','It stops the move, at the price of a yellow card.'],no:['Una amarilla temprano te condiciona el resto del partido.','Um amarelo cedo condiciona o resto do jogo.','An early yellow conditions the rest of the match.'],
  mv:{M1:[56,38]},b:[[50,40],[54,38]]}
];
function arquetipoDefensa(c,clave){
 const f=String(c.yo.f||'4-4-2').split('-').map(Number),elF=String(c.el.f||'4-4-2'),h=hashS(c.el.club.n+'|defensa');
 const centros=c.el.m.ofe==='directo',ancho=/^(4-3-3|3-4-3|4-2-3-1)$/.test(elF);
 return {linea:f[0]===5||f[0]===3?5:4,bloque:c.yo.m.def||'medio',por:ancho&&(h%2)?'banda':centros?'banda':'centro',centros,ancho,crack:c.el.attrs[1]>=c.yo.attrs[1]+4};
}
function nombreArquetipoDefensa(B){
 return [B.linea===5?t3('línea de 5','linha de 5','back five'):t3('línea de 4','linha de 4','back four'),
  {alto:t3('bloque alto','bloco alto','high block'),medio:t3('bloque medio','bloco médio','mid block'),bajo:t3('bloque bajo','bloco baixo','low block')}[B.bloque]||'',
  B.por==='banda'?t3('te atacan por fuera','atacam por fora','they attack wide'):t3('te atacan por dentro','atacam por dentro','they attack centrally'),
  B.centros?t3('con centros','com cruzamentos','with crosses'):t3('elaborando','elaborando','building patiently')].concat(B.crack?[t3('con un jugador distinto','com um jogador diferente','with a standout player')]:[]).join(' · ');
}
function fichasDefensa(B){
 const roles=B.linea===5?[['POR',50,5,'1'],['CI',30,16,'2'],['CC',50,14,'6'],['CD',70,16,'4'],['LI',10,26,'3'],['LD',90,26,'7'],['M1',42,34,'5'],['M2',58,34,'8']]
  :[['POR',50,5,'1'],['CI',38,18,'2'],['CD',62,18,'6'],['LI',14,22,'3'],['LD',86,22,'4'],['M1',42,34,'5'],['M2',58,34,'8'],['EX',84,44,'7']];
 const el=B.por==='banda'?[[84,36],[92,52],[60,50],[50,30],[40,44]]:[[50,40],[50,27],[38,50],[62,50],[50,20]];
 return {roles,mi:roles.map(r=>[r[1],r[2],r[3]]),el,pel:el[0]};
}
function generarDefensa(c,clave){
 const B=arquetipoDefensa(c,clave),F=fichasDefensa(B),h=hashS(clave+'|gend'),idx={};F.roles.forEach((r,i)=>idx[r[0]]=i);
 const conv=mv=>{const o={};Object.entries(mv||{}).forEach(([k,v])=>{if(idx[k]!=null)o[idx[k]]=v;});return o;};
 const todas=SOLUCIONES_DEFENSA.map(s=>({s,f:s.fit(B)})).sort((a,b)=>b.f-a.f);
 const mejores=todas.filter(x=>x.f>=.8),buena=mejores[h%mejores.length]||todas[0],sel=[buena],libre=x=>!sel.includes(x);
 const media=todas.filter(x=>libre(x)&&x.f>=.45&&x.f<.8);if(media.length)sel.push(media[(h>>>2)%media.length]);
 const mala=todas.filter(x=>libre(x)&&x.f<.45);if(mala.length)sel.push(mala[(h>>>4)%mala.length]);
 const segura=todas.filter(x=>libre(x)&&x.s.r==='bajo'&&x.f<.8)[0]||todas.filter(libre)[0];if(segura)sel.push(segura);
 const ops=sel.map((x,i)=>[hashS(clave+'|do'+i),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).map(({s,f})=>({sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:conv(s.mv),b:s.b,
  riesgo:s.r,premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f}));
 const rel=()=>[B.por==='banda'?t3('Nos atacan por la banda derecha nuestra.','Atacam pela nossa direita.','They are attacking down our right.'):t3('Nos buscan por adentro, entre nuestros volantes y la defensa.','Buscam por dentro, entre volantes e defesa.','They are coming through the middle, between our midfield and defence.'),
  B.centros?t3('Cada vez que llegan, tiran el centro.','Sempre que chegam, cruzam.','Every time they get there, they cross.'):t3('No centran: tocan hasta encontrar el hueco.','Não cruzam: tocam até achar o espaço.','They do not cross: they pass until they find the gap.'),
  B.ancho?t3('Tienen extremos bien abiertos.','Têm pontas bem abertos.','They have wide wingers.'):'',
  B.crack?t3('Y su 10 es otra cosa: todo pasa por él.','E o 10 deles é outra coisa.','And their 10 is something else: everything goes through him.'):''].filter(Boolean).join(' ');
 return {id:'gen-defensa',gen:true,A:B,nombreA:nombreArquetipoDefensa(B),p:buena.s.p,cuando:()=>true,rel,
  pista:['¿Por dónde te hacen daño? Defendé ese lugar, no a una persona.','Por onde fazem dano? Defenda esse lugar.','Where are they hurting you? Defend that place, not a person.'],mi:F.mi,el:F.el,pel:F.pel,ops};
}
const _elegirSituacionV20=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 const s=_elegirSituacionV20(c,clave);
 if(s&&s.gen)return s;
 if(S.ultimaSituacion!=='gen-defensa'&&hashS(clave+'|gd')%3===0)return generarDefensa(c,clave);
 return s;
};
nombreArquetipo=(function(prev){return function(A){return A&&A.linea!=null&&A.por!=null?nombreArquetipoDefensa(A):prev(A);};})(nombreArquetipo);
// la etiqueta de la cancha acompaña cada momento: situación inicial → así se movería → en juego → lo que pasó
const _mostrarResultadoV21=mostrarResultadoSituacion;
mostrarResultadoSituacion=function(recien){
 _mostrarResultadoV21(recien);
 const e=document.getElementById('v19-estado');if(e){e.textContent=t3('Lo que pasó','O que aconteceu','What happened');e.classList.add('on');}
};
