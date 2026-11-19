// v23b — Octava familia del banco: la pelota parada (a favor y en contra).
// Es donde más pesa el plantel: quién gana arriba, cómo marcan ellos, quién patea.
// Buena, media y trampa: las mismas del mazo "Los 110 problemas". El penal queda aparte (tiene pateador, no lectura).
Object.assign(PRINCIPIOS,{
 parada:{n:['La pelota parada se prepara','A bola parada se prepara','Set pieces are prepared'],d:['En una pelota parada no hay sorpresa: gana el que lleva el movimiento ensayado al lugar donde el rival es más débil.','Na bola parada não há surpresa: ganha quem leva o movimento ensaiado ao ponto fraco.','There are no surprises at a set piece: the team that takes a rehearsed move to the opponent\'s weak spot wins.']},
 paradaContra:{n:['Defender la pelota parada','Defender a bola parada','Defending set pieces'],d:['Zona, hombre o mixta no es una creencia: se elige según cómo ataca ese rival. Contra el que llega corriendo, zona; contra el que gana el duelo, al hombre.','Zona, homem ou mista se escolhe pelo rival.','Zonal, man or mixed is not a belief: you choose it by how that opponent attacks. Against runners, zonal; against duel-winners, man.']}
});
N_PRINCIPIOS=Object.keys(PRINCIPIOS).length;

const SOLUCIONES_PARADA=[
 // a favor
 {id:'segundoPaloAlto',lado:'favor',p:'parada',r:'medio',pr:.07,g:/DFC|DC/,vs:2,t:['Centro al segundo palo, al más alto','Bola no segundo pau, no mais alto','Ball to the far post, to the tallest man'],
  si:['Arriba ganamos nosotros: la pelota va donde está nuestro mejor cabeceador.','No alto ganhamos nós: a bola vai no melhor cabeceador.','We win in the air: the ball goes where our best header is.'],no:['Ellos ganan arriba: es un centro para que despeje su mejor cabeceador.','Eles ganham no alto: é bola para o melhor cabeceador deles.','They win in the air: it is a cross for their best header to clear.'],
  mv:{C1:[38,93]},b:[[38,93]]},
 {id:'primerPalo',lado:'favor',p:'parada',r:'medio',pr:.07,g:/DC|DFC/,vs:2,t:['Córner al primer palo con peinada','Escanteio no primeiro pau com desvio','Near-post corner with a flick-on'],
  si:['Su primer palo está libre o lo cuida uno bajo: la peinada deja la pelota en el corazón del área.','O primeiro pau está livre: o desvio deixa a bola no meio da área.','Their near post is free or guarded by a small man: the flick puts the ball in the heart of the box.'],no:['El primer palo está cerrado: la pelota pega en el primero.','O primeiro pau está fechado.','The near post is covered: the ball hits the first man.'],
  mv:{C9:[60,94],C2:[48,93]},b:[[60,94],[48,93]]},
 {id:'bloqueos',lado:'favor',p:'parada',r:'bajo',pr:.07,g:/DFC/,vs:2,t:['Bloqueos para liberar al cabeceador','Bloqueios para liberar o cabeceador','Blocks to free the header'],
  si:['Marcan al hombre: si le cortás el camino a su marcador, tu cabeceador llega solo.','Marcam homem a homem: bloqueado o marcador, o cabeceador chega livre.','They mark man for man: block his marker\'s path and your header arrives free.'],no:['Defienden en zona: no hay a quién bloquear, el espacio ya está ocupado.','Defendem em zona: não há quem bloquear.','They defend zonally: there is nobody to block, the space is already filled.'],
  mv:{M1:[46,90],C1:[44,94]},b:[[44,94]]},
 {id:'cornerCorto',lado:'favor',p:'parada',r:'bajo',pr:.05,g:/^E|MC/,vs:1,t:['Córner corto','Escanteio curto','Short corner'],
  si:['Arriba no tenemos nada que hacer: jugarlo corto cambia el ángulo y los saca de su zona.','No alto não temos chance: curto muda o ângulo.','We have no chance in the air: playing it short changes the angle and pulls them out of their zone.'],no:['Teníamos ventaja arriba y la desperdiciamos tocando para el costado.','Tínhamos vantagem no alto e desperdiçamos.','We had the edge in the air and wasted it passing sideways.'],
  mv:{M2:[88,92]},b:[[88,92],[72,86]]},
 {id:'bordeArea',lado:'favor',p:'parada',r:'medio',pr:.06,g:/MC|MCO/,vs:3,t:['Córner al borde del área','Escanteio na entrada da área','Corner to the edge of the box'],
  si:['Despejan siempre corto: el que espera en la frontal remata de primera.','Afastam sempre curto: quem espera na entrada chuta de primeira.','They always clear short: the man waiting on the edge hits it first time.'],no:['Tienen gente en la frontal: el pase atrás es una contra para ellos.','Têm gente na entrada: vira contra-ataque.','They have men on the edge: the ball back becomes their counter.'],
  mv:{M1:[50,80]},b:[[50,80],[50,99]]},
 {id:'tlLateral',lado:'favor',p:'parada',r:'medio',pr:.07,g:/^E|MC/,vs:2,t:['Tiro libre lateral, entre la línea y el arquero','Falta lateral, entre a linha e o goleiro','Wide free kick between the line and the keeper'],
  si:['Su arquero sale mal: la pelota entre su línea y él es de quien llega primero.','O goleiro sai mal: a bola entre a linha e ele é de quem chega primeiro.','Their keeper comes badly: the ball between his line and him belongs to whoever gets there first.'],no:['Su arquero se queda con todas: es un centro para él.','O goleiro pega todas.','Their keeper claims everything: it is a cross for him.'],
  mv:{C1:[48,92],C2:[56,92]},b:[[52,92]]},
 {id:'tlFrontal',lado:'favor',p:'parada',r:'bajo',pr:.07,g:/MC|MCO|^E/,vs:3,t:['Tiro libre frontal directo al arco','Falta frontal direto ao gol','Direct free kick from the front'],
  si:['Falta en la frontal y tenemos pegada: es medio gol.','Falta na entrada e temos batedor: é meio gol.','A free kick on the edge and we have a striker of the ball: it is half a goal.'],no:['No tenemos pegada: le regalamos la pelota al arquero.','Não temos batedor: damos a bola ao goleiro.','We have nobody to strike it: we hand the ball to their keeper.'],
  mv:{},b:[[44,99]]},
 {id:'remateFrontal',lado:'favor',p:'parada',r:'medio',pr:.05,g:/MC/,vs:3,t:['Jugarla corta y rematar de media distancia','Tocar curto e chutar de média distância','Play it short and shoot from distance'],
  si:['Se arma la barrera y queda un hueco al costado: el remate cruzado lo encuentra.','A barreira deixa um espaço ao lado.','The wall leaves a gap at the side: the angled shot finds it.'],no:['Se cierran rápido: el remate pega en la barrera.','Fecham rápido: o chute bate na barreira.','They close quickly: the shot hits the wall.'],
  mv:{M2:[56,78]},b:[[56,78],[52,99]]},
 {id:'lateralLargo',lado:'favor',p:'parada',r:'medio',pr:.06,g:/LT|DFC/,vs:2,t:['Lateral largo al área','Lateral longo na área','Long throw into the box'],
  si:['Cerca del área y con lanzador: es un córner con las manos.','Perto da área e com lançador: é um escanteio com as mãos.','Close to the box with a long thrower: it is a corner taken by hand.'],no:['Lejos del área o sin lanzador: la pelota cae corta y es de ellos.','Longe ou sem lançador: a bola cai curta.','Too far or no thrower: the ball drops short and it is theirs.'],
  mv:{C1:[52,90]},b:[[52,90]]},
 {id:'lateralCorto',lado:'favor',p:'parada',r:'bajo',pr:.04,g:/LT|MC/,vs:1,t:['Lateral corto para conservar','Lateral curto para manter a bola','Short throw to keep the ball'],
  si:['Queremos tenerla: lateral al pie y a empezar de nuevo.','Queremos ficar com a bola: lateral no pé.','We want to keep it: throw it to feet and start again.'],no:['Había una ocasión de meterla al área y la jugaste para atrás.','Havia chance de colocar na área.','There was a chance to put it in the box and you played it back.'],
  mv:{M2:[90,80]},b:[[90,80]]},
 {id:'saqueArco',lado:'favor',p:'parada',r:'bajo',pr:.05,g:/POR|DFC/,vs:1,t:['Saque de arco: corto si no presionan, largo si presionan','Tiro de meta: curto se não pressionam, longo se pressionam','Goal kick: short if they do not press, long if they do'],
  si:['Es la salida desde el arco: leés su presión antes de que se paren.','É a saída desde o gol: lê a pressão antes.','It is a build-up from the keeper: you read their press before they set.'],no:['No es un saque de arco: la orden no tiene nada que ver con la jugada.','Não é tiro de meta.','It is not a goal kick: the order has nothing to do with the play.'],
  mv:{CI:[30,10],CD:[70,10]},b:[[30,10]]},
 {id:'tresAtras',lado:'favor',p:'vigilancias',r:'bajo',pr:.06,g:/DFC|MCD/,vs:2,t:['Dejar tres atrás contra su contra','Deixar três atrás contra o contra-ataque','Leave three back against their counter'],
  si:['Dejan dos arriba esperando: con tres atrás, su contra no existe.','Deixam dois na frente: com três atrás, não há contra-ataque.','They leave two up waiting: with three back, their counter does not exist.'],no:['No dejan a nadie arriba: sacás un cabeceador del área para cuidar a nadie.','Não deixam ninguém: tira um cabeceador à toa.','They leave nobody up: you take a header out of the box to mark nobody.'],
  mv:{CI:[40,42],CD:[60,42],M1:[50,50]},b:[[50,88]]},
 // en contra
 {id:'zonaPura',lado:'contra',p:'paradaContra',r:'medio',pr:.06,g:/DFC/,vs:2,t:['Zona pura: cada uno cuida un espacio','Zona pura: cada um cuida um espaço','Pure zonal: everyone guards a space'],
  si:['Atacan mejor en movimiento que en el duelo: con los espacios ocupados, llegan tarde.','Atacam melhor em movimento: com os espaços ocupados, chegam tarde.','They are better on the run than in the duel: with the spaces filled, they arrive late.'],no:['Tienen cabeceadores que ganan parados: en zona saltan sin que nadie los moleste.','Têm cabeceadores que ganham parados.','They have headers who win from a standing jump: in a zone nobody bothers them.'],
  mv:{CI:[44,8],CD:[52,8],LD:[60,8],M1:[50,14]},b:[[50,10]]},
 {id:'mixta',lado:'contra',p:'paradaContra',r:'bajo',pr:.06,g:/DFC/,vs:2,t:['Mixta: zona en el arco y hombre a sus cabeceadores','Mista: zona no gol e homem nos cabeceadores','Mixed: zonal at goal, man on their headers'],
  si:['Tienen dos o tres cabeceadores claros: a esos, al hombre; el resto del área, en zona.','Têm dois ou três cabeceadores: nesses, homem; o resto, zona.','They have two or three clear headers: mark those, zone the rest of the box.'],no:['No tienen a nadie tan peligroso: mezclás y dejás huecos entre los dos sistemas.','Não têm ninguém tão perigoso: mistura e deixa buracos.','They have nobody that dangerous: you mix and leave gaps between the two systems.'],
  mv:{CI:[46,9],M1:[48,15],LI:[42,12]},b:[[46,10]]},
 {id:'hombre',lado:'contra',p:'paradaContra',r:'medio',pr:.05,g:/DFC/,vs:2,t:['Hombre a hombre en el área','Homem a homem na área','Man for man in the box'],
  si:['Ganan el duelo pero no corren: pegado a cada uno, no saltan solos.','Ganham o duelo mas não correm.','They win the duel but do not run: tight on each one, nobody jumps alone.'],no:['Llegan corriendo y te arrastran: un bloqueo y queda uno solo.','Chegam correndo: um bloqueio e fica um sozinho.','They arrive running and drag you: one block and a man is free.'],
  mv:{CI:[45,11],CD:[53,12],LD:[59,10]},b:[[52,11]]},
 {id:'hombrePrimerPalo',lado:'contra',p:'paradaContra',r:'bajo',pr:.06,g:/LT|MC/,vs:2,t:['Uno fijo en el primer palo','Um fixo no primeiro pau','One man stationed at the near post'],
  si:['Buscan siempre el primer palo: uno parado ahí y la peinada no existe.','Buscam sempre o primeiro pau: um parado ali e acabou.','They always go near post: one man stationed there and the flick-on is gone.'],no:['No van al primer palo: dejás a uno mirando la nada.','Não vão ao primeiro pau: deixa um olhando o nada.','They do not go near post: you leave a man watching nothing.'],
  mv:{LD:[60,4]},b:[[60,5]]},
 {id:'dejarArriba',lado:'contra',p:'contra',r:'alto',pr:.06,g:/DC|^E/,vs:2,t:['Dejar uno o dos arriba para la contra','Deixar um ou dois na frente para o contra-ataque','Leave one or two up for the counter'],
  si:['Si los obligás a dejar gente atrás, atacan el córner con menos.','Se obriga a deixar gente atrás, atacam com menos.','If you force them to keep men back, they attack the corner with fewer.'],no:['Te quedás con menos en el área justo contra el que más cabecea.','Fica com menos na área contra quem mais cabeceia.','You have fewer in the box against the team that heads best.'],
  mv:{DC:[50,45],EX:[70,48]},b:[[52,11]]},
 {id:'barrera',lado:'contra',p:'paradaContra',r:'bajo',pr:.06,g:/MC|DC/,vs:3,t:['Barrera bien armada y arquero tapando su palo','Barreira bem montada e goleiro no seu pau','A well-set wall and the keeper on his side'],
  si:['Falta en la frontal: la barrera tapa un palo y el arquero el otro.','Falta na entrada: a barreira tapa um pau e o goleiro o outro.','A free kick on the edge: the wall covers one post, the keeper the other.'],no:['No es una falta frontal: armás una barrera que no tapa nada.','Não é falta frontal: a barreira não tapa nada.','It is not a central free kick: the wall covers nothing.'],
  mv:{M1:[46,20],M2:[50,20]},b:[[48,4]]},
 {id:'lineaAdelantada',lado:'contra',p:'profundidad',r:'medio',pr:.06,g:/DFC/,vs:2,t:['Línea adelantada en el tiro libre lateral','Linha adiantada na falta lateral','High line on the wide free kick'],
  si:['Su lanzador no es preciso: con la línea arriba, el que corre al área queda en offside o lejos del arco.','O batedor não é preciso: com a linha alta, quem corre fica em impedimento.','Their taker is not accurate: with the line up, runners are offside or too far from goal.'],no:['Su lanzador la pone donde quiere: entre tu línea y tu arquero hay veinte metros vacíos.','O batedor coloca onde quer: entre a linha e o goleiro há vinte metros vazios.','Their taker puts it where he wants: there are twenty empty yards between your line and your keeper.'],
  mv:{CI:[44,18],CD:[54,18],LD:[62,18],LI:[36,18]},b:[[50,10]]}
];
// tipo: cor (córner), tll (tiro libre lateral), tlf (frontal), lat (lateral), arc (saque de arco)
const CASOS_PARADA=[
 [['A favor · córner','A favor · escanteio','Attacking · corner'],['Córner a favor y tenemos al más alto de la cancha.','Escanteio a favor e temos o mais alto do campo.','Corner to us and we have the tallest man on the pitch.'],'segundoPaloAlto','bloqueos','cornerCorto','favor','cor'],
 [['A favor · córner','A favor · escanteio','Attacking · corner'],['Córner a favor y su primer palo lo cuida uno bajo.','Escanteio a favor e o primeiro pau é de um baixinho.','Corner to us and their near post is guarded by a small man.'],'primerPalo','segundoPaloAlto','bordeArea','favor','cor'],
 [['A favor · córner','A favor · escanteio','Attacking · corner'],['Córner a favor: ellos ganan arriba y marcan al hombre.','Escanteio a favor: eles ganham no alto e marcam homem a homem.','Corner to us: they win in the air and mark man for man.'],'bloqueos','cornerCorto','segundoPaloAlto','favor','cor'],
 [['A favor · córner','A favor · escanteio','Attacking · corner'],['Córner a favor: ellos ganan arriba y defienden en zona.','Escanteio a favor: eles ganham no alto e defendem em zona.','Corner to us: they win in the air and defend zonally.'],'cornerCorto','bordeArea','segundoPaloAlto','favor','cor'],
 [['A favor · córner','A favor · escanteio','Attacking · corner'],['Córner a favor: despejan siempre corto y la frontal queda libre.','Escanteio a favor: afastam curto e a entrada fica livre.','Corner to us: they always clear short and the edge is free.'],'bordeArea','cornerCorto','primerPalo','favor','cor'],
 [['A favor · tiro libre','A favor · falta','Attacking · free kick'],['Tiro libre lateral y su arquero sale mal.','Falta lateral e o goleiro sai mal.','Wide free kick and their keeper comes badly.'],'tlLateral','segundoPaloAlto','lateralCorto','favor','tll'],
 [['A favor · tiro libre','A favor · falta','Attacking · free kick'],['Falta en la frontal y tenemos pegada.','Falta na entrada e temos batedor.','A free kick on the edge and we have a striker of the ball.'],'tlFrontal','remateFrontal','lateralCorto','favor','tlf'],
 [['A favor · lateral','A favor · lateral','Attacking · throw-in'],['Lateral cerca del área y tenemos lanzador.','Lateral perto da área e temos lançador.','Throw-in near the box and we have a long thrower.'],'lateralLargo','lateralCorto','saqueArco','favor','lat'],
 [['A favor · lateral','A favor · lateral','Attacking · throw-in'],['Lateral en su campo y queremos tenerla.','Lateral no campo deles e queremos a bola.','Throw-in in their half and we want to keep the ball.'],'lateralCorto','lateralLargo','cornerCorto','favor','lat'],
 [['A favor · saque de arco','A favor · tiro de meta','Attacking · goal kick'],['Saque de arco nuestro.','Tiro de meta nosso.','Our goal kick.'],'saqueArco','lateralCorto','cornerCorto','favor','arc'],
 [['A favor · su contra','A favor · o contra-ataque','Attacking · their counter'],['Vamos a un córner y ellos dejan dos arriba.','Vamos para um escanteio e eles deixam dois na frente.','We have a corner and they leave two up front.'],'tresAtras','cornerCorto','segundoPaloAlto','favor','cor'],
 [['En contra · córner','Contra · escanteio','Defending · corner'],['Córner en contra: atacan mejor en movimiento que en el duelo.','Escanteio contra: atacam melhor em movimento.','Corner against: they are better on the run than in the duel.'],'zonaPura','mixta','hombre','contra','cor'],
 [['En contra · córner','Contra · escanteio','Defending · corner'],['Córner en contra: tienen dos o tres cabeceadores claros.','Escanteio contra: têm dois ou três cabeceadores.','Corner against: they have two or three clear headers.'],'mixta','hombre','zonaPura','contra','cor'],
 [['En contra · córner','Contra · escanteio','Defending · corner'],['Córner en contra: buscan siempre el primer palo.','Escanteio contra: buscam sempre o primeiro pau.','Corner against: they always go to the near post.'],'hombrePrimerPalo','zonaPura','dejarArriba','contra','cor'],
 [['En contra · tiro libre','Contra · falta','Defending · free kick'],['Tiro libre frontal en contra.','Falta frontal contra.','Central free kick against us.'],'barrera','zonaPura','lineaAdelantada','contra','tlf'],
 [['En contra · tiro libre','Contra · falta','Defending · free kick'],['Tiro libre lateral en contra y su lanzador no es preciso.','Falta lateral contra e o batedor não é preciso.','Wide free kick against us and their taker is not accurate.'],'lineaAdelantada','zonaPura','hombre','contra','tll']
];
function arquetipoParada(c,clave){
 const h=hashS(clave+'|pp'),pick=(a,k)=>a[(h>>>k)%a.length],favor=h%2===0;
 const arriba=c.yo.attrs[2]>=c.el.attrs[2],zona=hashS(((c.el.club&&c.el.club.n)||'')+'|ppzona')%2===0;
 const pegada=!!(c.crack&&c.crack.rt>=c.yo.attrs[1]+6),cabecean=c.el.m.ofe==='directo';
 let caso;
 if(favor){
  if(arriba)caso=pick([0,1,10,5,7,4],3);
  else caso=zona?pick([3,4,8,9,5],3):pick([2,2,4,8,9,7],3);
  if((pegada&&h%5===0)||h%13===0)caso=6;
 }else caso=cabecean?pick([12,13,14,15],3):pick([11,13,14,15],3);
 return {fam:'pp',caso,favor,arriba,zona};
}
function nombreArquetipoParada(A){const k=CASOS_PARADA[A.caso];return t3(...k[0])+' — '+t3(...k[1]).replace(/\.$/,'');}
function fichasParada(A){
 const tipo=CASOS_PARADA[A.caso][6];
 if(A.favor){
  const roles=[['POR',50,5,'1'],['CI',40,48,'2'],['CD',60,48,'6'],['C1',44,84,'4'],['C2',56,84,'3'],['C9',50,88,'9'],['M1',40,80,'8'],['M2',62,78,'10'],['EX',96,96,'7']];
  const pel={cor:[96,96],tll:[84,80],tlf:[50,74],lat:[98,84],arc:[50,6]}[tipo];
  const el=tipo==='arc'?[[30,30],[50,32],[70,30],[40,48],[60,50],[50,70],[50,97]]
   :[[40,92],[48,93],[56,92],[62,95],[44,88],[54,88],[50,98],[40,60],[60,60]].concat(tipo==='tlf'?[[46,80],[50,80],[54,80]]:[]);
  return {roles,mi:roles.map(r=>r[0]==='EX'&&tipo!=='arc'?[pel[0],pel[1],r[3]]:[r[1],r[2],r[3]]),el,pel};
 }
 const roles=[['POR',50,4,'1'],['CI',44,8,'2'],['CD',56,8,'6'],['LI',36,10,'3'],['LD',62,6,'4'],['M1',50,14,'5'],['M2',40,18,'8'],['DC',50,40,'9'],['EX',70,45,'7']];
 const pel={cor:[96,4],tlf:[50,26],tll:[84,22]}[tipo];
 const el=[[44,10],[52,11],[58,9],[48,16],[60,14],[30,40],[60,40]].concat(tipo==='cor'?[]:[[50,22]]);
 return {roles,mi:roles.map(r=>[r[1],r[2],r[3]]),el,pel};
}
function generarParada(c,clave){
 const A=arquetipoParada(c,clave),caso=CASOS_PARADA[A.caso],F=fichasParada(A),idx={};F.roles.forEach((r,i)=>idx[r[0]]=i);
 const conv=mv=>{const o={};Object.entries(mv||{}).forEach(([k,v])=>{if(idx[k]!=null)o[idx[k]]=v;});return o;};
 const fitDe=id=>id===caso[2]?.95:id===caso[3]?.6:id===caso[4]?.2:.35,por=id=>SOLUCIONES_PARADA.find(s=>s.id===id);
 const sel=[caso[2],caso[3],caso[4]];
 const ops=sel.map((id,i)=>[hashS(clave+'|po'+i),id]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).map(id=>{const s=por(id),f=fitDe(id);
  return {sol:s.id,t:s.t,L:f>=.8?1:f>=.45?.5:0,g:s.g,vs:s.vs,pq:f>=.45?s.si:s.no,mv:conv(s.mv),b:[F.pel].concat(s.b),riesgo:s.r,premio:Math.round(s.pr*f*100)/100,costo:RIESGO_SALIDA[s.r].c,fit:f};});
 const rel=()=>t3(...caso[1])+' '+(A.favor?(A.arriba?t3('Arriba somos más fuertes que ellos.','No alto somos mais fortes.','We are stronger in the air.'):t3('Arriba ellos son más fuertes.','No alto eles são mais fortes.','They are stronger in the air.')):'');
 const pista=A.favor?['¿Quién gana arriba, y cómo marcan? Llevá el movimiento ensayado a donde ellos son más débiles.','Quem ganha no alto e como marcam? Leve o movimento ensaiado ao ponto fraco.','Who wins in the air, and how do they mark? Take the rehearsed move to their weak spot.']
  :['¿Cómo te atacan: corriendo o ganando el duelo parados? Contra el que corre, zona; contra el que salta parado, al hombre.','Como atacam: correndo ou ganhando parados? Contra quem corre, zona; contra quem salta parado, homem.','How do they attack: on the run or winning standing jumps? Against runners, zonal; against standing jumpers, man.'];
 return {id:'gen-parada',gen:true,A,nombreA:nombreArquetipoParada(A),p:por(caso[2]).p,cuando:()=>true,rel,pista,mi:F.mi,el:F.el,pel:F.pel,ops};
}
const _elegirSituacionV23=elegirSituacionPara;
elegirSituacionPara=function(c,clave){
 // uno de cada ocho problemas es una pelota parada (nunca dos seguidas)
 if(S.ultimaSituacion!=='gen-parada'&&hashS(clave+'|gpa')%8===0)return generarParada(c,clave);
 return _elegirSituacionV23(c,clave);
};
nombreArquetipo=(function(prev){return function(A){return A&&A.fam==='pp'&&A.caso!=null?nombreArquetipoParada(A):prev(A);};})(nombreArquetipo);
