// v14 — "Que sea un juego, no un formulario" (playtest en tablet, 10/11/2026).
// Regla de diseño: cada decisión muestra qué cambió.
//  1. Quién sos: edad y pasado cambian cómo te miran (prejuicio), no tu capacidad.
//  2. El club tiene ADN: tu idea encaja o no, y te pueden decir que no. Si después ganás, te llaman igual.
//  3. La entrevista es una escena con preguntas; tu perfil sale de lo que respondés.
//  4. La idea de juego se ve en la cancha mientras la elegís.
//  5. La presentación al plantel es frente al grupo, y el capitán te pregunta.

/* ---------- 1. Quién sos ---------- */
const RANGOS_DT=[
 {id:'joven',ed:29,n:['25 a 32','25 a 32','25–32'],d:['Cercano a los pibes. La directiva y los referentes dudan de vos.','Próximo dos garotos. Diretoria e líderes duvidam.','Close to the kids. Board and senior players doubt you.']},
 {id:'medio',ed:38,n:['33 a 42','33 a 42','33–42'],d:['Nadie te mira la edad.','Ninguém olha sua idade.','Nobody looks at your age.']},
 {id:'maduro',ed:48,n:['43 a 55','43 a 55','43–55'],d:['Transmitís oficio: la directiva y la tribuna te dan crédito.','Passa experiência: diretoria e torcida dão crédito.','You look seasoned: board and fans give you credit.']},
 {id:'veterano',ed:58,n:['56 o más','56 ou mais','56+'],d:['Mucho crédito arriba. A los más chicos les hablás de otra época.','Muito crédito em cima. Para os jovens, você é de outra época.','Plenty of credit upstairs. To the youngest you sound like another era.']}
];
const ORIGENES_DT=[
 {id:'pro',n:['Ex futbolista profesional','Ex-jogador profissional','Former professional'],d:['El vestuario y la tribuna te respetan de entrada. La pizarra la tenés que demostrar.','Vestiário e torcida respeitam de cara. A prancheta você precisa provar.','Dressing room and fans respect you from day one. The tactics you must prove.']},
 {id:'amateur',n:['Jugaste, pero no llegaste','Jogou, mas não chegou','Played, never made it'],d:['Sin privilegios ni prejuicios: te juzgan por el trabajo.','Sem privilégios nem preconceitos.','No privileges, no prejudice: judged on the work.']},
 {id:'estudio',n:['Nunca jugaste: venís del estudio','Nunca jogou: veio do estudo','Never played: you studied the game'],d:['El vestuario te mira de reojo, la directiva valora el método, y explicás mejor la tarea.','O vestiário desconfia, a diretoria valoriza o método, e você explica melhor a tarefa.','The dressing room is wary, the board values method, and you explain the task better.']}
];
function dtPerfil(){ if(!S.dt) S.dt={rango:'medio',origen:'amateur'}; return S.dt; }
// cómo te miran al llegar. Con un título encima, ya nadie pregunta de dónde saliste.
function prejuicioDT(club,div){
 const d=dtPerfil(),p={dir:0,hin:0,ves:0,notas:[]};
 if((S.titulos||[]).length){ p.notas.push(t3('Con títulos encima, nadie pregunta tu edad ni tu pasado.','Com títulos, ninguém pergunta sua idade.','With trophies behind you, nobody asks about your age or past.')); return p; }
 const formativas=div<3;
 if(d.rango==='joven'){ if(!formativas){p.dir-=5;p.hin-=3;} p.ves+=formativas?5:1; p.notas.push(formativas?t3('Sos joven: los pibes te sienten cerca.','Você é jovem: os garotos se identificam.','You are young: the kids relate to you.'):t3('Te ven muy joven para este banco.','Acham você jovem demais para este banco.','They think you are too young for this bench.')); }
 if(d.rango==='maduro'){ p.dir+=3;p.hin+=2; p.notas.push(t3('Tu edad transmite oficio.','Sua idade passa experiência.','Your age reads as experience.')); }
 if(d.rango==='veterano'){ p.dir+=5;p.hin+=3;p.ves-=formativas?4:2; p.notas.push(t3('La directiva confía en tus años; los más chicos, no tanto.','A diretoria confia nos seus anos; os jovens, nem tanto.','The board trusts your years; the youngest, less so.')); }
 if(d.origen==='pro'){ p.ves+=8;p.hin+=5; p.notas.push(t3('Jugaste: te escuchan antes de que demuestres nada.','Você jogou: escutam antes de provar algo.','You played: they listen before you prove anything.')); }
 if(d.origen==='estudio'){ p.ves-=6;p.hin-=4;p.dir+=4; p.notas.push(t3('Nunca jugaste: "¿y este a quién le ganó?". La directiva valora tu método.','Nunca jogou: "e esse ganhou de quem?". A diretoria valoriza o método.','You never played: "who did he ever beat?". The board values your method.')); }
 return p;
}
function chipsPrejuicio(p){
 const f=(k,n)=>p[k]?`<span class="d ${p[k]>0?'p':'n'}">${n} ${sg(p[k])}</span>`:'';
 return `<div class="deltas">${f('dir',T('directiva'))}${f('hin',T('hinchada'))}${f('ves',T('vestuario'))}</div>`;
}
function textoQuienSos(){
 const d=dtPerfil(),r=RANGOS_DT.find(x=>x.id===d.rango),o=ORIGENES_DT.find(x=>x.id===d.origen);
 return `${r.ed} ${T('anios')} · ${t3(...o.n).toLowerCase()}`;
}
pintarIdentidad=function(){
 const d=dtPerfil(),hincha=CLUBES.find(c=>c.n===tmp.hincha)||CLUBES[0],modo=MODOS.find(m=>m.id===tmp.modo)||MODOS[1];
 const ritmo=S.ritmo==='rapido'?'rapido':(S.verJugadas===false?'pizarra':'jugadas');
 const prej=prejuicioDT(null,3);
 const pill=(on,js,txt)=>`<button class="pill ${on?'on':''}" onclick="guardarNom();${js};pintarIdentidad()">${txt}</button>`;
 $('#s-identidad').innerHTML=`<p class="etq">${t3('EL PRIMER PASO','O PRIMEIRO PASSO','THE FIRST STEP')}</p>
 <h2 class="disp">${t3('Tu carrera empieza con vos.','Sua carreira começa com você.','Your career starts with you.')}</h2>
 <div class="v14-inicio">
  <div class="v14-form">
   <section><h3>${t3('¿Quién sos?','Quem é você?','Who are you?')}</h3>
    <label class="v14-campo">${T('tuApellido')} <small>${t3('opcional','opcional','optional')}</small><input id="nom" maxlength="24" value="${escapeHTML(S.nombre||'')}" placeholder="${t3('Si lo dejás vacío te llaman “el DT”','Se deixar vazio: “o Técnico”','Leave empty to be “the Coach”')}" oninput="guardarNom();const f=document.getElementById('v14-ficha-nom');if(f)f.textContent=S.nombre||'DT'"></label>
    <p class="v14-lbl">${t3('Tu edad al empezar','Sua idade inicial','Your starting age')}</p>
    <div class="pills">${RANGOS_DT.map(r=>pill(d.rango===r.id,`S.dt.rango='${r.id}'`,t3(...r.n))).join('')}</div>
    <p class="v14-nota">${t3(...RANGOS_DT.find(r=>r.id===d.rango).d)}</p>
    <p class="v14-lbl">${t3('Tu pasado en el fútbol','Seu passado no futebol','Your football past')}</p>
    <div class="v14-cartas">${ORIGENES_DT.map(o=>`<button class="card ${d.origen===o.id?'sel':''}" onclick="guardarNom();S.dt.origen='${o.id}';pintarIdentidad()"><b>${t3(...o.n)}</b><div class="sub">${t3(...o.d)}</div></button>`).join('')}</div>
   </section>
   <section><h3>${t3('¿A dónde querés llegar?','Aonde quer chegar?','Where do you want to get to?')}</h3>
    <label class="v14-campo">${t3('El club que soñás dirigir','O clube dos seus sonhos','Your dream club')}<select id="hincha" onchange="tmp.hincha=this.value;guardarNom();pintarIdentidad()">${PAISES.map(p=>`<optgroup label="${p}">${LIGAS[p].clubes.map(c=>`<option ${c.n===tmp.hincha?'selected':''}>${escapeHTML(c.n)}</option>`).join('')}</optgroup>`).join('')}</select></label>
    <p class="v14-nota">${t3('Es la meta de la carrera, no tu primer trabajo. Hoy no te atienden el teléfono; si ganás, un día te llaman.','É a meta da carreira, não o primeiro emprego. Se você ganhar, um dia ligam.','It is the goal of your career, not your first job. Win, and one day they call.')}</p>
    <p class="v14-lbl">${t3('Largo de la carrera','Duração da carreira','Career length')}</p>
    <div class="pills">${MODOS.map(m=>pill(tmp.modo===m.id,`tmp.modo='${m.id}'`,`${tModo(m,'n')} · ${m.temporadas} ${t3('temporadas','temporadas','seasons')}`)).join('')}</div>
    <p class="v14-nota">${t3('Al terminar ves tu legado y elegís: retirarte o seguir dirigiendo.','No fim você vê seu legado e escolhe: aposentar ou continuar.','At the end you see your legacy and choose: retire or keep coaching.')}</p>
   </section>
   <section><h3>${t3('¿Cómo vivís los partidos grandes?','Como vive os jogos grandes?','How do you live the big games?')}</h3>
    <div class="v14-cartas">
     <button class="card ${ritmo==='jugadas'?'sel':''}" onclick="guardarNom();S.ritmo='elegir';S.verJugadas=true;pintarIdentidad()"><b>${t3('Dirigir y ver las jugadas','Dirigir e ver os lances','Coach and watch the plays')}</b><div class="sub">${t3('Charla, partido en vivo con las jugadas animadas y descanso.','Conversa, jogo ao vivo com lances animados e intervalo.','Team talk, live match with animated plays, half-time.')}</div></button>
     <button class="card ${ritmo==='pizarra'?'sel':''}" onclick="guardarNom();S.ritmo='elegir';S.verJugadas=false;pintarIdentidad()"><b>${t3('Dirigir desde la pizarra','Dirigir pela prancheta','Coach from the board')}</b><div class="sub">${t3('Lo mismo, sin animaciones: más rápido.','O mesmo, sem animações: mais rápido.','The same without animations: faster.')}</div></button>
     <button class="card ${ritmo==='rapido'?'sel':''}" onclick="guardarNom();S.ritmo='rapido';pintarIdentidad()"><b>${t3('Simular con mi plan','Simular com meu plano','Simulate with my plan')}</b><div class="sub">${t3('Solo ves el resultado. Para carreras exprés.','Só vê o resultado. Para carreiras rápidas.','You only see the result. For express careers.')}</div></button>
    </div>
    <p class="v14-nota">${t3('Se puede cambiar durante la carrera, antes de cada partido grande.','Pode mudar durante a carreira.','You can change it during the career.')}</p>
   </section>
  </div>
  <aside class="v14-ficha" style="--c1:${hincha.c[0]};--c2:${hincha.c[1]}">
   <p class="etq">${t3('TU FICHA','SUA FICHA','YOUR FILE')}</p>
   <b id="v14-ficha-nom" class="v14-ficha-nom">${escapeHTML(S.nombre||'DT')}</b>
   <p>${textoQuienSos()}</p>
   <div class="v14-ficha-sueno">${escudo(hincha,56)}<div><small>${t3('Tu sueño','Seu sonho','Your dream')}</small><b>${escapeHTML(hincha.n)}</b></div></div>
   <p class="v14-lbl">${t3('Cómo te van a mirar en Primera','Como vão te olhar na Primeira','How a first team will see you')}</p>
   ${chipsPrejuicio(prej)||''}
   <ul class="v14-lista">${prej.notas.map(n=>`<li>${n}</li>`).join('')||`<li>${t3('Sin prejuicios: te juzgan por el trabajo.','Sem preconceitos.','No prejudice: judged on the work.')}</li>`}</ul>
   <p class="v14-nota">${t3('El prejuicio no es capacidad: se borra con tu primer título.','Preconceito não é capacidade: some com o primeiro título.','Prejudice is not ability: it is gone with your first trophy.')}</p>
   <label class="cine-retrato-opcion"><input type="checkbox" ${S.mostrarRetratoDT?'checked':''} onchange="S.mostrarRetratoDT=this.checked">${t3('Mostrar retrato del DT','Mostrar retrato do técnico','Show coach portrait')}</label>
  </aside>
 </div>
 <input id="edad-dt" type="hidden" value="${RANGOS_DT.find(r=>r.id===d.rango).ed}">
 <div class="acciones"><button class="btn" onclick="buscarVacantes()">${t3('Buscar trabajo →','Procurar trabalho →','Look for a job →')}</button><button class="btn sec" onclick="portada()">${T('volver')}</button></div>`;
};

/* ---------- 2. El ADN de cada club ---------- */
const ADN_TIPOS={
 protagonista:{n:['Protagonista','Protagonista','Front-foot'],d:['Acá se juega a tener la pelota y a ir a buscar.','Aqui se joga com a bola e para frente.','Here you play with the ball, on the front foot.']},
 pragmatico:{n:['Pragmático','Pragmático','Pragmatic'],d:['Acá primero se cierra el arco; después se ve.','Aqui primeiro se fecha o gol; depois se vê.','Here you shut the door first, then see.']},
 intenso:{n:['Intenso','Intenso','High-intensity'],d:['Acá se corre y se muerde arriba. La tribuna no perdona la tibieza.','Aqui se corre e se pressiona. A torcida não perdoa.','Here you run and press. The crowd has no patience for half-measures.']},
 cantera:{n:['De cantera','De base','Academy club'],d:['Acá juegan los de la casa. El DT que no mira para abajo, no dura.','Aqui jogam os da casa.','Here the home-grown play. A coach who ignores the academy does not last.']}
};
const ADN_CLUB={'Real Madrid':'protagonista','Barcelona':'protagonista','Atlético de Madrid':'pragmatico','Sevilla':'intenso','Real Betis':'protagonista','Villarreal':'protagonista','Athletic Club':'cantera','Real Sociedad':'cantera','Valencia':'pragmatico',
 'Peñarol':'intenso','Nacional':'protagonista','Defensor Sporting':'cantera','Danubio':'cantera','Liverpool (URU)':'cantera','River Plate':'protagonista','Boca Juniors':'pragmatico','Racing Club':'intenso','Independiente':'protagonista','San Lorenzo':'pragmatico','Estudiantes':'pragmatico','Vélez Sarsfield':'cantera','Argentinos Juniors':'cantera','Lanús':'cantera',
 'Flamengo':'protagonista','Palmeiras':'pragmatico','Santos':'cantera','São Paulo':'protagonista','Corinthians':'pragmatico','Grêmio':'intenso','Internacional':'intenso','Fluminense':'protagonista',
 'Manchester City':'protagonista','Liverpool':'intenso','Arsenal':'protagonista','Chelsea':'pragmatico','Manchester United':'protagonista','Tottenham':'protagonista','Newcastle':'intenso',
 'Inter':'pragmatico','Milan':'protagonista','Juventus':'pragmatico','Napoli':'protagonista','Roma':'intenso','Atalanta':'intenso','Lazio':'pragmatico',
 'Bayern München':'protagonista','Borussia Dortmund':'intenso','RB Leipzig':'intenso','Bayer Leverkusen':'protagonista','Paris Saint-Germain':'protagonista','Olympique de Marseille':'intenso','Lyon':'cantera'};
function adnClub(club){
 const k=ADN_CLUB[club.n]||(club.niv<=2?['pragmatico','cantera','intenso','cantera'][hashS(club.n)%4]:['protagonista','pragmatico','intenso','cantera'][hashS(club.n)%4]);
 return {id:k,paciencia:club.niv>=5?0:club.niv>=3?1:2};
}
const PACIENCIA_TXT=[['ganar ya','ganhar já','win now'],['paciencia media','paciência média','some patience'],['mucha paciencia','muita paciência','plenty of patience']];
// lo que un "¿por qué vos?" dice que le importa al club
const NECESIDAD_RAICES={
 cantera:['juvenil','pibe','formar','formativ','cantera','base','ensen','crecer','inferiores','aprendizaje','desarroll','jovenes','chicos','youth','academy','develop','base','garotos'],
 protagonista:['pelota','posesion','protagon','atac','juego','tenencia','tecnic','iniciativa','asoci','ball','possession','attack'],
 intenso:['presion','intens','correr','garra','sacrific','esfuerzo','actitud','mentalidad','morder','huevo','press','intensity','work rate'],
 pragmatico:['orden','defens','equilibrio','solidez','resultado','ganar','competi','eficacia','serio','arco en cero','solid','result','win','compet']
};
function lecturaPorQue(texto,adn){
 const t=normalizarCharla(texto||''),hall=[];
 (NECESIDAD_RAICES[adn]||[]).forEach(r=>{const m=t.match(new RegExp('(^|[^a-z])'+r+'[a-z]*'));if(m)hall.push(m[0].trim());});
 return [...new Set(hall)].slice(0,4);
}
function encajeADN(m,arqId,compromiso,club,div,porque){
 const adn=adnClub(club).id,R=[];let v=.3;
 const suma=(ok,peso,si,no)=>{if(ok)v+=peso;R.push({ok,txt:ok?si:no});};
 if(adn==='protagonista'){
  suma(m.ofe==='posicional',.3,t3('Querés la pelota, como ellos.','Quer a bola, como eles.','You want the ball, like them.'),t3('Jugás directo; acá quieren tener la pelota.','Joga direto; aqui querem a bola.','You play direct; here they want the ball.'));
  suma(m.def!=='bajo',.2,t3('No te metés atrás.','Não se fecha atrás.','You do not sit deep.'),t3('Un bloque bajo acá se silba.','Bloco baixo aqui é vaiado.','A low block gets booed here.'));
 }
 if(adn==='pragmatico'){
  suma(m.def!=='alto',.25,t3('Cuidás la espalda antes de ir.','Protege as costas antes de ir.','You protect your back first.'),t3('Tu bloque alto les parece un riesgo.','Seu bloco alto parece um risco.','Your high block looks like a risk to them.'));
  suma(m.tofe==='contra'||m.ofe==='directo',.25,t3('Salís rápido cuando la recuperás.','Sai rápido ao recuperar.','You break fast on regains.'),t3('Mucha elaboración para su gusto.','Elaboração demais para eles.','Too much elaboration for their taste.'));
 }
 if(adn==='intenso'){
  suma(m.def==='alto',.25,t3('Vas a buscar arriba.','Vai buscar em cima.','You go and win it high.'),t3('Esperás; acá quieren ir a buscar.','Espera; aqui querem pressionar.','You wait; here they want to hunt.'));
  suma(m.tdef==='presion',.25,t3('Presionás tras pérdida.','Pressiona após a perda.','You counter-press.'),t3('Replegás al perderla; les sabe a poco.','Recua ao perder; acham pouco.','You drop off on losing it; too passive for them.'));
 }
 if(adn==='cantera'){
  suma(compromiso==='cantera',.3,t3('Te comprometiste con los jóvenes.','Comprometeu-se com os jovens.','You committed to the youngsters.'),t3('No hablaste de los jóvenes.','Não falou dos jovens.','You did not mention the youngsters.'));
  suma(arqId==='formador',.2,t3('Tu perfil es de formador.','Seu perfil é formador.','You come across as a developer.'),t3('No te ven como formador.','Não te veem como formador.','They do not see a developer in you.'));
 }
 if(div<3) suma(arqId==='formador'||compromiso==='cantera',.15,t3('En formativas quieren a alguien que enseñe.','Na base querem quem ensine.','In the academy they want a teacher.'),t3('En formativas no buscan resultados ya.','Na base não buscam resultado já.','The academy is not about results now.'));
 else if(club.niv>=5) suma(arqId==='ganador'||compromiso==='resultados',.1,t3('Prometés ganar: es lo que exigen.','Promete ganhar: é o que exigem.','You promise to win: that is the demand.'),t3('Acá la paciencia no existe.','Aqui não existe paciência.','Patience does not exist here.'));
 const pal=lecturaPorQue(porque,adn);
 if((porque||'').trim().length>12) suma(pal.length>0,.12,t3(`Dijiste lo que querían oír: ${pal.join(', ')}.`,`Disse o que queriam ouvir: ${pal.join(', ')}.`,`You said what they wanted to hear: ${pal.join(', ')}.`),t3('Tu presentación no habló de lo que les importa.','Sua apresentação não tocou no que importa.','Your pitch did not touch what they care about.'));
 const d=dtPerfil();
 if(d.origen==='pro'){v+=.05;R.push({ok:true,txt:t3('Tu nombre como jugador abre la puerta.','Seu nome como jogador abre a porta.','Your name as a player opens the door.')});}
 if(d.rango==='joven'&&club.niv>=4&&div===3){v-=.08;R.push({ok:false,txt:t3('Te ven verde para este banco.','Acham você verde para este banco.','They think you are too green for this bench.')});}
 return {v:clamp(v,0,1),razones:R,adn};
}
function umbralClub(o){ return o.club.niv<=2?0:o.div<3?(o.club.niv>=5?.5:.4):.5; }

/* ---------- 3. Bolsa de trabajo: ofertas creíbles y respuesta del club ---------- */
generarOfertas=function(){
 const sueno=(S.clubHincha||{}).n,mez=R.mz(CLUBES.filter(c=>c.n!==sueno)),pro=dtPerfil().origen==='pro';
 const grande=mez.find(c=>c.niv>=5),medio=mez.find(c=>c.niv===3||c.niv===4),chico=mez.find(c=>c.niv<=2);
 const dm=pro?2:1;
 S.ofertas=[
  {club:grande,div:0,txt:{es:'Un gigante, pero entrás por abajo: la Séptima. Si salís campeón, subís de golpe.',pt:'Um gigante, mas você entra por baixo: a base. Campeão, sobe de uma vez.',en:'A giant, but you start at the bottom: the under-16s. Win and you jump up.'}},
  {club:medio,div:dm,txt:{es:`Club de Primera que te ofrece su ${DIVISIONES[dm].n}: un paso antes del plantel profesional.`,pt:`Clube da Primeira que oferece o ${DIVISIONES[dm].comp}: um passo antes do profissional.`,en:`A top-flight club offering its ${DIVISIONES[dm].comp}: one step below the first team.`}},
  {club:chico,div:3,txt:{es:'Primera de un club chico. Poca plata, nadie te pide salir campeón, y dirigís profesionales desde el día uno.',pt:'Primeira de um clube pequeno. Pouco dinheiro, ninguém pede título.',en:'First team at a small club. Little money, nobody demands a title, and you coach professionals from day one.'}}
 ];
};
pintarOfertas=function(){
 const rech=S.rechazos||[],sueno=S.clubHincha;
 $('#s-ofertas').innerHTML=`<p class="etq">${t3('BOLSA DE TRABAJO','VAGAS','JOB BOARD')}</p>
 <h2 class="disp">${t3('Tres clubes leyeron tu currículum.','Três clubes leram seu currículo.','Three clubs read your CV.')}</h2>
 <p>${escapeHTML(S.nombre)}, ${textoQuienSos()}. ${t3('Cada club busca algo distinto. En la entrevista vas a saber si tu idea encaja: te pueden decir que no.','Cada clube busca algo diferente. Na entrevista você saberá se encaixa: podem dizer não.','Each club wants something different. The interview tells you whether you fit: they can say no.')}</p>
 ${S.ofertas.map((o,i)=>{const a=adnClub(o.club),r=rech.find(x=>x.club===o.club.n);
  return `<article class="gd-vacante v14-vacante ${r?'rechazada':''}" style="${estiloInterior(o.club)};--i:${i}">${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}
   <p>${L(o.txt)}</p>
   <p class="v14-adn"><span>${t3('Buscan','Buscam','They want')}</span><b>${t3(...ADN_TIPOS[a.id].n)}</b> · ${t3(...PACIENCIA_TXT[a.paciencia])} <i>${t3(...ADN_TIPOS[a.id].d)}</i></p>
   ${r?`<p class="alerta mal">${t3('Te dijeron que no','Disseram não','They said no')}: ${escapeHTML(r.motivo)}</p>`:`<button class="btn" onclick="enviarCV(${i})">${t3('Ir a la entrevista','Ir à entrevista','Go to the interview')}</button>`}
  </article>`;}).join('')}
 ${sueno&&!S.ofertas.some(o=>o.club.n===sueno.n)?`<article class="gd-vacante v14-vacante cerrada" style="${estiloInterior(sueno)};--i:3">${bannerClub(sueno,{badges:badgesClub(sueno,3)})}<p><b>${t3('Tu sueño','Seu sonho','Your dream')}.</b> ${t3('Hoy no te atienden el teléfono. Ganá en otro lado y un día van a llamar ellos.','Hoje não atendem o telefone. Ganhe em outro lugar e um dia eles ligam.','Today they will not take your call. Win elsewhere and one day they will call you.')}</p></article>`:''}
 ${S.reOfertas>0?`<button class="btn sec" onclick="otrasOfertas()">${t3('Consultar otras vacantes (una vez)','Ver outras vagas (uma vez)','See other vacancies (once)')}</button>`:''}`;
 ir('ofertas');
};
enviarCV=function(i){
 const o=S.ofertas[i];if(!o)return;
 S.candidatura={i,club:o.club.n,origen:'',experiencia:'',compromiso:o.div<3?'cantera':'proceso',resp:[],porque:''};
 tmp.arq=null;entrevistaDT();
};

/* ---------- 4. La entrevista: preguntas, no formulario ---------- */
// cada respuesta suma a un perfil; la tercera fija el compromiso
const PREGUNTAS_DT=[
 {q:['¿Qué es lo primero que hacés cuando llegás?','Qual é a primeira coisa que você faz ao chegar?','What is the first thing you do when you arrive?'],
  r:[{p:'formador',t:['Bajo a ver a los pibes de las inferiores.','Vou ver os garotos da base.','I go down to watch the academy kids.']},
     {p:'bombero',t:['Ordeno al equipo de atrás para adelante.','Organizo o time de trás para frente.','I organise the team from the back.']},
     {p:'ganador',t:['Pido dos refuerzos: quiero competir ya.','Peço dois reforços: quero competir já.','I ask for two signings: I want to compete now.']}]},
 {q:['Perdés tres partidos seguidos. ¿Qué hacés?','Perde três jogos seguidos. O que faz?','You lose three in a row. What do you do?'],
  r:[{p:'formador',t:['Sostengo la idea. Tres partidos no la cambian.','Mantenho a ideia. Três jogos não mudam.','I hold the idea. Three games do not change it.']},
     {p:'ganador',t:['Cambio lo que haga falta para ganar el domingo.','Mudo o que for preciso para ganhar domingo.','I change whatever it takes to win on Sunday.']},
     {p:'bombero',t:['Cierro el arco y sumo de a uno hasta salir.','Fecho o gol e somo de um em um.','I shut the door and grind out points.']}]},
 {q:['¿Qué nos prometés?','O que você nos promete?','What do you promise us?'],
  r:[{p:'formador',c:'cantera',t:['Jugadores del club jugando en Primera.','Jogadores do clube na Primeira.','Home-grown players in the first team.']},
     {p:'ganador',c:'resultados',t:['Pelear arriba este mismo año.','Brigar em cima já este ano.','A challenge at the top this very season.']},
     {p:'bombero',c:'proceso',t:['Un equipo reconocible en doce meses.','Um time reconhecível em doze meses.','A recognisable team within twelve months.']}]}
];
function perfilDeRespuestas(resp){
 const c={formador:0,ganador:0,bombero:0};resp.forEach((k,i)=>{const r=PREGUNTAS_DT[i].r[k];if(r)c[r.p]+=i===2?1.5:1;});
 return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
}
function dictarEn(id,btn){
 const M=typeof motorDictado==='function'&&motorDictado();if(!M)return;
 try{const r=new M();r.lang=IDIOMA==='pt'?'pt-BR':IDIOMA==='en'?'en-US':'es-UY';r.interimResults=false;
  if(btn){btn.classList.add('on');r.onend=()=>btn.classList.remove('on');}
  r.onresult=e=>{const el=document.getElementById(id);if(!el)return;el.value=(el.value+' '+e.results[0][0].transcript).trim();el.dispatchEvent(new Event('input',{bubbles:true}));};r.start();}catch(e){}
}
const hayDictado=()=>typeof motorDictado==='function'&&!!motorDictado();
function escenaEntrevista(o,inner){
 return `<div class="v14-escena entrevista" style="${estiloInterior(o.club)}"><div class="v14-escena-fondo"></div><div class="v14-mesa">${escudo(o.club,64)}<div><small>${t3('SALA DE REUNIONES','SALA DE REUNIÕES','BOARDROOM')}</small><b>${escapeHTML(o.club.n)}</b><span>${tDiv(DIVISIONES[o.div].n)}</span></div></div></div>${inner}`;
}
entrevistaDT=function(){
 const c=S.candidatura,o=S.ofertas[c.i],n=c.resp.length,adn=adnClub(o.club);
 const puntos=`<div class="paso-mom">${[0,1,2,3].map(k=>`<span class="${k<n?'ok':k===n?'on':''}">${k+1}</span>`).join('')}</div>`;
 if(n<3){
  const P=PREGUNTAS_DT[n];
  $('#s-ofertas').innerHTML=escenaEntrevista(o,`${puntos}<p class="etq">${t3('ENTREVISTA · HABLA EL PRESIDENTE','ENTREVISTA · FALA O PRESIDENTE','INTERVIEW · THE PRESIDENT')}</p>
   <blockquote class="v14-pregunta">${t3(...P.q)}</blockquote>
   <div class="v14-respuestas">${P.r.map((r,k)=>`<button class="card" onclick="S.candidatura.resp.push(${k});entrevistaDT()"><span class="letra-orden">${'ABC'[k]}</span><b>${t3(...r.t)}</b></button>`).join('')}</div>
   <div class="acciones"><button class="btn sec" onclick="${n?'S.candidatura.resp.pop();entrevistaDT()':'pintarOfertas()'}">${T('volver')}</button></div>`);
  ir('ofertas');return;
 }
 const perfil=perfilDeRespuestas(c.resp),A=ARQ.find(a=>a.id===perfil);tmp.arq=perfil;c.compromiso=PREGUNTAS_DT[2].r[c.resp[2]].c;
 $('#s-ofertas').innerHTML=escenaEntrevista(o,`${puntos}<p class="etq">${t3('ENTREVISTA · LA ÚLTIMA','ENTREVISTA · A ÚLTIMA','INTERVIEW · THE LAST ONE')}</p>
  <blockquote class="v14-pregunta">${t3('Hay otros candidatos. ¿Por qué vos?','Há outros candidatos. Por que você?','There are other candidates. Why you?')}</blockquote>
  <label class="v14-campo">${t3('Contalo con tus palabras: de dónde venís, qué hiciste, qué vas a hacer acá','Conte com suas palavras','In your own words: where you come from and what you will do here')} <small>${t3('opcional, pero pesa','opcional, mas pesa','optional, but it counts')}</small>
   <textarea id="v14-porque" maxlength="700" oninput="S.candidatura.porque=this.value;S.candidatura.origen=this.value">${escapeHTML(c.porque||'')}</textarea></label>
  ${hayDictado()?`<button class="btn sec v14-mic" onclick="dictarEn('v14-porque',this)">🎤 ${t3('Dictar','Ditar','Dictate')}</button>`:''}
  <p class="v14-nota">${t3(`Pista: este club es ${t3(...ADN_TIPOS[adn.id].n).toLowerCase()}. Si lo que contás habla de lo que les importa, suma.`,`Dica: este clube é ${t3(...ADN_TIPOS[adn.id].n).toLowerCase()}.`,`Hint: this club is ${t3(...ADN_TIPOS[adn.id].n).toLowerCase()}. Speak to what they care about.`)}</p>
  <div class="v14-perfil"><small>${t3('Por tus respuestas, acá te ven como','Pelas respostas, aqui veem você como','From your answers, they see you as')}</small><b>${nArq(A)}</b><span>${L(TAGLINE[A.id])}</span>
   <ul>${efArq(A).map(e=>`<li class="ok">${e}</li>`).join('')}<li class="mal">${coArq(A)}</li></ul>
   <p><small>${t3('Tu compromiso','Seu compromisso','Your commitment')}</small> <b>${textoCompromiso(c.compromiso)}</b> — ${t3(...COMPROMISOS_DT[c.compromiso].d)}</p></div>
  <div class="acciones"><button class="btn" onclick="ideaEntrevista()">${t3('Explicar cómo juega mi equipo →','Explicar como joga meu time →','Explain how my team plays →')}</button><button class="btn sec" onclick="S.candidatura.resp.pop();entrevistaDT()">${t3('Cambiar respuestas','Mudar respostas','Change answers')}</button></div>`);
 ir('ofertas');
};

/* ---------- 5. La idea se ve en la cancha ---------- */
const FASES_IDEA=[['ofe',['Con la pelota','Com a bola','With the ball']],['def',['Sin la pelota','Sem a bola','Without the ball']],['tdef',['Al perderla','Ao perder','On losing it']],['tofe',['Al recuperarla','Ao recuperar','On winning it']]];
function posIdea(f,m,fase){
 const base=ONCE[f].map(([rol,x,y])=>({rol,x,y,g:ROL[rol].g}));
 const ofe=p=>{if(p.rol==='POR')return {x:50,y:6};let x=p.x,y=p.y;
  if(m.ofe==='posicional'){x=50+(x-50)*1.12;y=y*1.05+8;if(/^(LT|CA)/.test(p.rol))y+=12;}else{y=y+4;if(p.g==='ATA')y+=9;if(p.g==='DEF')y-=2;}
  return {x,y};};
 const def=p=>{if(p.rol==='POR')return {x:50,y:m.def==='alto'?12:6};const k=m.def==='alto'?[.78,30]:m.def==='medio'?[.7,14]:[.52,6];return {x:50+(p.x-50)*.8,y:p.y*k[0]+k[1]};};
 return base.map(p=>{
  let q;
  if(fase==='ofe')q=ofe(p);
  else if(fase==='def')q=def(p);
  else if(fase==='tdef'){const a=ofe(p),b=def(p);q=m.tdef==='presion'?{x:a.x+(56-a.x)*.32,y:a.y+(66-a.y)*.3}:{x:(a.x+b.x*2)/3,y:(a.y+b.y*2)/3};if(p.rol==='POR')q=a;}
  else{const b=def(p);q={x:b.x,y:b.y};if(m.tofe==='contra'){if(p.g==='ATA')q.y+=24;if(p.g==='MED')q.y+=9;}else{q.x=50+(b.x-50)*1.2;q.y+=4;}if(p.rol==='POR')q=b;}
  return {rol:p.rol,x:clamp(q.x,5,95),y:clamp(q.y,4,94)};
 });
}
const PELOTA_IDEA={ofe:[50,44],def:[50,78],tdef:[56,66],tofe:[44,36]};
function moverIdea(){
 const f=tmp.f,m=tmp.m,fase=tmp.faseIdea||'ofe',ps=posIdea(f,m,fase),box=$('#v14-cancha');if(!box)return;
 ps.forEach((p,i)=>{const el=box.querySelector(`[data-i="${i}"]`);if(el){el.style.left=p.x+'%';el.style.bottom=p.y+'%';}});
 const b=box.querySelector('.v14-pelota'),pe=PELOTA_IDEA[fase];if(b){b.style.left=pe[0]+'%';b.style.bottom=pe[1]+'%';}
 document.querySelectorAll('#v14-fases button').forEach(x=>x.classList.toggle('on',x.dataset.f===fase));
 const d=$('#v14-fase-d');if(d)d.textContent=L(opMomento(fase,m[fase]).d);
}
function canchaIdeaHTML(){
 const f=tmp.f,ps=posIdea(f,tmp.m,tmp.faseIdea||'ofe'),col=(S.club||S.ofertas?.[S.candidatura?.i]?.club||{c:['#E9C84A','#111']}).c;
 return `<div id="v14-fases" class="v14-fases">${FASES_IDEA.map(([k,n])=>`<button data-f="${k}" class="${(tmp.faseIdea||'ofe')===k?'on':''}" onclick="tmp.faseIdea='${k}';moverIdea()">${t3(...n)}</button>`).join('')}</div>
 <div id="v14-cancha" class="v14-cancha"><i class="ar-g"></i><i class="ar-c"></i><i class="medio"></i><i class="ar-g abajo"></i><i class="ar-c abajo"></i>
  ${ps.map((p,i)=>`<span data-i="${i}" class="v14-ficha-j" style="left:${p.x}%;bottom:${p.y}%;background:${col[0]};color:${typeof txtSobre==='function'?txtSobre(col[0]):'#111'}">${siglaRol(p.rol)}</span>`).join('')}
  <span class="v14-pelota" style="left:${PELOTA_IDEA[tmp.faseIdea||'ofe'][0]}%;bottom:${PELOTA_IDEA[tmp.faseIdea||'ofe'][1]}%"></span>
  <em>${t3('ATACÁS ↑','ATACA ↑','ATTACKING ↑')}</em></div>
 <p id="v14-fase-d" class="v14-nota">${L(opMomento(tmp.faseIdea||'ofe',tmp.m[tmp.faseIdea||'ofe']).d)}</p>`;
}
function medidorADN(){
 const c=S.candidatura;if(!c)return '';const o=S.ofertas[c.i],e=encajeADN(tmp.m,tmp.arq,c.compromiso,o.club,o.div,c.porque),u=umbralClub(o),pasa=e.v>=u;
 return `<div class="v14-adn-panel ${pasa?'ok':'mal'}"><div class="v14-adn-cab">${escudo(o.club,34)}<div><small>${t3('Lo que busca','O que busca','What they want')} ${escapeHTML(o.club.n)}</small><b>${t3(...ADN_TIPOS[e.adn].n)}</b></div><strong>${Math.round(e.v*100)}%</strong></div>
  <div class="v14-barra"><i style="width:${Math.round(e.v*100)}%"></i>${u?`<u style="left:${Math.round(u*100)}%"></u>`:''}</div>
  <p class="v14-nota">${u?(pasa?t3('Con esta idea te contratan.','Com esta ideia contratam você.','With this idea they hire you.'):t3('Con esta idea te dicen que no. Podés sostenerla igual: es tu idea.','Com esta ideia dizem não. Pode mantê-la: é sua ideia.','With this idea they say no. You can still stand by it: it is yours.')):t3('Este club te toma con cualquier idea: necesita un DT.','Este clube aceita qualquer ideia.','This club will take you with any idea: they need a coach.')}</p>
  <ul>${e.razones.map(r=>`<li class="${r.ok?'ok':'mal'}">${r.txt}</li>`).join('')}</ul></div>`;
}
function v14Momento(mid,oid){
 tmp.m[mid]=oid;tmp.e=estiloDeModelo(tmp.m);tmp.faseIdea=mid;
 const c=$('#v14-ctl');if(c)c.innerHTML=selectorModelo(tmp.m,'v14Momento');
 const a=$('#v14-adn-box');if(a)a.innerHTML=medidorADN();
 moverIdea();
}
function v14Sistema(f){ tmp.f=f; pintarIdea(); }
const _pintarIdeaV13=pintarIdea;
pintarIdea=function(){
 if(!S.candidatura){_pintarIdeaV13();return;}
 tmp.m=tmp.m||modeloDeEstilo(tmp.e||'Posesion');tmp.e=estiloDeModelo(tmp.m);tmp.faseIdea=tmp.faseIdea||'ofe';
 $('#s-idea').innerHTML=`<p class="etq">${t3('ENTREVISTA · TU PROPUESTA','ENTREVISTA · SUA PROPOSTA','INTERVIEW · YOUR PROPOSAL')}</p>
 <h2 class="disp">${t3('Mostrales cómo juega tu equipo.','Mostre como joga seu time.','Show them how your team plays.')}</h2>
 <p>${t3('Tocá una opción y mirá cómo se mueve el equipo. Es tu idea para toda la carrera: después se entrena, no se rellena de nuevo.','Toque uma opção e veja o time se mover. É sua ideia para a carreira toda.','Tap an option and watch the team move. This is your idea for the whole career.')}</p>
 <div class="v14-idea">
  <div><div class="lbl-sel">${t3('Sistema','Sistema','Formation')}</div><div class="pills">${FORMACIONES.map(x=>`<button class="pill ${x===tmp.f?'on':''}" onclick="v14Sistema('${x}')">${x}</button>`).join('')}</div>
   <div id="v14-ctl">${selectorModelo(tmp.m,'v14Momento')}</div></div>
  <div class="v14-idea-der">${canchaIdeaHTML()}<div id="v14-adn-box">${medidorADN()}</div></div>
 </div>
 <div class="acciones"><button class="btn" onclick="confirmarIdea()">${t3('Presentar propuesta','Apresentar proposta','Submit proposal')}</button><button class="btn sec" onclick="entrevistaDT()">${T('volver')}</button></div>`;
};

/* ---------- 6. El veredicto: te contratan o te dicen que no ---------- */
const _confirmarIdeaV13=confirmarIdea;
confirmarIdea=function(){
 const c=S.candidatura;
 if(!c){_confirmarIdeaV13();return;}
 const o=S.ofertas[c.i],e=encajeADN(tmp.m,tmp.arq,c.compromiso,o.club,o.div,c.porque),u=umbralClub(o);
 if(e.v<u){
  const motivo=(e.razones.find(r=>!r.ok)||{txt:t3('Buscan otro perfil.','Buscam outro perfil.','They want a different profile.')}).txt;
  S.rechazos=S.rechazos||[];S.rechazos.push({club:o.club.n,motivo,t:S.temporada||0,idea:estiloDeModelo(tmp.m)});
  S.candidatura=null;
  $('#s-ofertas').innerHTML=escenaEntrevista(o,`<p class="etq">${t3('LA RESPUESTA','A RESPOSTA','THE ANSWER')}</p><h2 class="disp">${t3('“Vamos por otro perfil.”','“Vamos com outro perfil.”','“We are going another way.”')}</h2>
   <p>${t3(`${o.club.n} te agradece la reunión y elige a otro entrenador.`,`O ${o.club.n} agradece e escolhe outro treinador.`,`${o.club.n} thank you for your time and pick another coach.`)}</p>
   <ul class="v14-razones">${e.razones.map(r=>`<li class="${r.ok?'ok':'mal'}">${r.txt}</li>`).join('')}</ul>
   <div class="alerta"><b>${t3('Anotalo.','Anote.','Note it down.')}</b> ${t3('El fútbol tiene memoria corta: si ganás con tu idea en otro lado, este mismo club te va a llamar. Y vas a poder callar bocas.','O futebol tem memória curta: se ganhar com sua ideia, este clube vai ligar.','Football has a short memory: win elsewhere with your idea and this very club will call. And you get to prove them wrong.')}</div>
   <div class="acciones"><button class="btn" onclick="pintarOfertas()">${t3('Volver a las vacantes','Voltar às vagas','Back to the vacancies')}</button></div>`);
  ir('ofertas');return;
 }
 _confirmarIdeaV13();
 const p=prejuicioDT(o.club,o.div),acc=$('#s-ofertas .acciones');
 if(acc)acc.insertAdjacentHTML('beforebegin',`<div class="v14-recibe"><p class="etq">${t3('CÓMO TE RECIBEN','COMO RECEBEM VOCÊ','HOW THEY RECEIVE YOU')}</p>${chipsPrejuicio(p)}<ul class="v14-lista">${p.notas.map(n=>`<li>${n}</li>`).join('')}</ul><ul class="v14-razones">${e.razones.map(r=>`<li class="${r.ok?'ok':'mal'}">${r.txt}</li>`).join('')}</ul></div>`);
};
// el prejuicio entra por la misma puerta que el perfil: una sola vez, al firmar
const _firmarClubV13=firmarClub;
firmarClub=function(o){
 const base=S.arq,p=prejuicioDT(o.club,o.div);
 S.arq=Object.assign({},base,{dir:(base.dir||0)+p.dir,hin:(base.hin||0)+p.hin,vest:(base.vest||0)+p.ves});
 try{_firmarClubV13(o);}finally{S.arq=base;}
};

/* ---------- 7. Callar bocas ---------- */
const _pantallaOfertaV13=pantallaOferta;
pantallaOferta=function(club,esSueno){
 const rechs=S.rechazos||[];
 // si un club que te dijo que no puede venir a buscarte, es ese el que llama
 if(!esSueno){const r=rechs.map(x=>CLUBES.find(c=>c.n===x.club)).find(c=>c&&c.n!==S.club.n&&c.niv>=S.club.niv);if(r)club=r;}
 _pantallaOfertaV13(club,esSueno);
 const r=rechs.find(x=>x.club===club.n),m=S.modelo||S.modeloPref,e=m?encajeADN(m,S.arq.id,(S.compromisoDT||{}).tipo,club,3,''):null,contra=e&&e.v<.5;
 if(!r&&!contra)return;
 S.callarBocas={club:club.n,t:S.temporada};
 const h=$('#s-club h2');if(h)h.insertAdjacentHTML('afterend',`<div class="v14-callar"><b>${t3('A CALLAR BOCAS','PARA CALAR BOCAS','TIME TO PROVE THEM WRONG')}</b><p>${r?t3(`Cuando empezabas, ${club.n} te dijo que no: “${r.motivo}”. Hoy te llaman ellos.`,`No começo, o ${club.n} disse não. Hoje eles ligam.`,`When you started, ${club.n} said no: “${r.motivo}”. Today they are calling you.`):t3(`Tu fútbol no es el de ${club.n} (${t3(...ADN_TIPOS[e.adn].n).toLowerCase()}). Te llaman igual: ganaste demasiado para ignorarte.`,`Seu futebol não é o do ${club.n}. Ligam mesmo assim: você ganhou demais.`,`Your football is not ${club.n}'s. They call anyway: you have won too much to ignore.`)}</p><p class="v14-nota">${t3('Si aceptás, la directiva y la prensa te van a mirar con lupa desde el primer día.','Se aceitar, diretoria e imprensa vão olhar com lupa.','Accept, and board and press will watch you under a microscope from day one.')}</p></div>`);
};
const _aceptarOfertaV13=aceptarOferta;
aceptarOferta=function(si){
 const cb=S.callarBocas;_aceptarOfertaV13(si);
 if(si&&cb&&cb.club===S.club.n&&cb.t===S.temporada-0){S.vars.dir=clamp(S.vars.dir-6,0,100);S.vars.hin=clamp(S.vars.hin+4,0,100);(S.hitos=S.hitos||[]).push({t:S.temporada,tipo:'callar',club:S.club.n});}
 if(!si)S.callarBocas=null;
};

/* ---------- 8. Presentación al plantel: frente a los 22, y el capitán pregunta ---------- */
const PREGUNTAS_CAPITAN=[
 {q:['Profe, una sola cosa: ¿acá juega el que rinde o el que tiene nombre?','Professor, uma coisa: aqui joga quem rende ou quem tem nome?','Coach, one thing: does form play here, or reputation?'],
  r:[{t:['El que rinde en la semana. Sin excepciones.','Quem rende na semana. Sem exceções.','Whoever performs in the week. No exceptions.'],tipo:'competir',jov:{confianza:6},ref:{confianza:-3},ef:['Jóvenes +6 confianza','Referentes −3 confianza']},
     {t:['Los referentes son la base. El resto se gana el lugar.','Os líderes são a base. O resto conquista a vaga.','The senior players are the base. The rest earn it.'],tipo:'escuchar',ref:{confianza:6},jov:{confianza:-3},ef:['Referentes +6 confianza','Jóvenes −3 confianza']},
     {t:['Cada uno va a saber su tarea, y por qué juega o no juega.','Cada um vai saber sua função e por que joga ou não.','Everyone will know his task, and why he plays or not.'],tipo:'roles',todos:{rol:6,confianza:2},ef:['Todos +6 comprensión de la tarea','Todos +2 confianza']}]},
 {q:['¿Y qué pasa el día que perdamos dos seguidos?','E no dia em que perdermos dois seguidos?','And the day we lose two in a row?'],
  r:[{t:['No cambio la idea por dos resultados.','Não mudo a ideia por dois resultados.','I do not change the idea over two results.'],tipo:'roles',todos:{conviccion:6},ef:['Todos +6 convicción en la idea']},
     {t:['Nos juntamos y lo hablamos de frente.','A gente se reúne e fala de frente.','We sit down and talk it through face to face.'],tipo:'escuchar',todos:{confianza:4},ef:['Todos +4 confianza']},
     {t:['El que no corre, sale. Así de simple.','Quem não corre, sai. Simples assim.','Whoever does not run is out. Simple.'],tipo:'competir',jov:{confianza:3},ref:{confianza:-4},todos:{conviccion:2},ef:['Jóvenes +3 confianza','Referentes −4 confianza','Todos +2 convicción']}]},
 {q:['¿Nos va a escuchar o ya trae todo decidido?','Vai nos escutar ou já vem com tudo decidido?','Will you listen to us, or is everything already decided?'],
  r:[{t:['Primero escucho. Ustedes conocen este club mejor que yo.','Primeiro escuto. Vocês conhecem o clube melhor.','I listen first. You know this club better than I do.'],tipo:'escuchar',ref:{confianza:6},todos:{confianza:1},ef:['Referentes +6 confianza','Todos +1 confianza']},
     {t:['Traigo una idea clara y se las voy a explicar.','Trago uma ideia clara e vou explicar.','I bring a clear idea, and I will explain it.'],tipo:'roles',todos:{rol:5,conviccion:3},ef:['Todos +5 comprensión de la tarea','Todos +3 convicción']},
     {t:['Decido yo. Para eso me trajeron.','Decido eu. Para isso me trouxeram.','I decide. That is what I was hired for.'],tipo:'competir',ref:{confianza:-5},todos:{confianza:-1},dir:2,ef:['Referentes −5 confianza','Directiva +2']}]}
];
function capitanDe(){ return S.plantel.slice().sort((a,b)=>(b.ed-a.ed)||(b.rt-a.rt))[0]; }
function escenaPlantel(inner){
 return `<div class="v14-escena practica" style="${estiloInterior(S.club)}"><div class="v14-escena-fondo"></div><div class="v14-ronda">${S.plantel.slice(0,22).map((j,i)=>`<i style="--k:${i}" title="${escapeHTML(j.nom)}"></i>`).join('')}<b>${escudo(S.club,40)}</b></div><div class="v14-mesa"><div><small>${t3('PRIMER DÍA · LA PRÁCTICA','PRIMEIRO DIA · O TREINO','DAY ONE · TRAINING')}</small><b>${escapeHTML(S.club.n)}</b><span>${S.plantel.length} ${t3('jugadores te miran','jogadores olham para você','players watching you')}</span></div></div></div>${inner}`;
}
presentacionPlantel=function(){
 const P=tmp.pres||(tmp.pres={paso:0,texto:''});
 if(P.paso===0){
  $('#s-club').innerHTML=escenaPlantel(`<p class="etq">${t3('PRIMER ENCUENTRO','PRIMEIRO ENCONTRO','FIRST MEETING')}</p><h2 class="disp">${t3('Ahora te escucha el plantel.','Agora o grupo escuta você.','Now the squad is listening.')}</h2>
   <p>${t3('Todavía no te conocen. Lo que digas hoy se lee: una tarea concreta mejora cómo entienden lo que pedís; hablar del grupo suma confianza; una amenaza la resta.','Ainda não conhecem você. O que disser hoje conta.','They do not know you yet. What you say today is read: a concrete task helps understanding; talking about the group builds trust; a threat costs it.')}</p>
   <label class="v14-campo">${t3('Tu presentación','Sua apresentação','Your introduction')} <small>${t3('opcional','opcional','optional')}</small><textarea id="presentacion-dt" maxlength="1200" placeholder="${t3('Quién sos, qué les pedís y qué pueden esperar de vos…','Quem é você e o que espera…','Who you are and what they can expect…')}" oninput="tmp.pres.texto=this.value">${escapeHTML(P.texto)}</textarea></label>
   ${hayDictado()?`<button class="btn sec v14-mic" onclick="dictarEn('presentacion-dt',this)">🎤 ${t3('Dictar','Ditar','Dictate')}</button>`:''}
   <div class="acciones"><button class="btn" onclick="tmp.pres.paso=1;presentacionPlantel()">${t3('Hablarles','Falar','Speak to them')}</button></div>`);
  ir('club');return;
 }
 const cap=capitanDe(),Q=PREGUNTAS_CAPITAN[hashS(S.club.n+'|'+S.temporada)%PREGUNTAS_CAPITAN.length],l=lecturaDiscurso(P.texto||'');
 if(P.paso===1){
  $('#s-club').innerHTML=escenaPlantel(`${P.texto.trim()?`<div class="lec-devolucion"><h4>${t3('Lo que escucharon','O que ouviram','What they heard')}</h4><blockquote class="lec-texto">${textoSubrayado(P.texto)}</blockquote>${l.total?barrasTonos(mezclaDe(l)):''}</div>`:`<p class="v14-nota">${t3('No dijiste nada. Te miran esperando.','Você não disse nada. Olham esperando.','You said nothing. They wait.')}</p>`}
   <p class="etq">${t3('LEVANTA LA MANO EL CAPITÁN','O CAPITÃO LEVANTA A MÃO','THE CAPTAIN RAISES HIS HAND')} · ${escapeHTML(cap.nom)}, ${cap.ed} ${T('anios')}</p>
   <blockquote class="v14-pregunta">${t3(...Q.q)}</blockquote>
   <div class="v14-respuestas">${Q.r.map((r,k)=>`<button class="card" onclick="responderCapitan(${k})"><span class="letra-orden">${'ABC'[k]}</span><b>${t3(...r.t)}</b></button>`).join('')}</div>`);
  ir('club');return;
 }
 const r=Q.r[P.resp];
 $('#s-club').innerHTML=escenaPlantel(`<p class="etq">${t3('CÓMO QUEDÓ EL VESTUARIO','COMO FICOU O VESTIÁRIO','WHERE THE ROOM STANDS')}</p><h2 class="disp">${t3('Ya saben quién sos.','Já sabem quem você é.','Now they know who you are.')}</h2>
  <blockquote class="v14-pregunta chica">“${t3(...r.t)}”</blockquote>
  <div class="lec-chips">${P.efectos.map(e=>`<span class="lec-chip ${/−|-\d/.test(e)?'mal':'ok'}">${e}</span>`).join('')}</div>
  <p class="v14-nota">${t3('Esto es el punto de partida. La confianza de cada uno se mueve con tus decisiones: mirala en la ficha de cada jugador.','Este é o ponto de partida. A confiança muda com suas decisões.','This is the starting point. Each player’s trust moves with your decisions: see it on his card.')}</p>
  <div class="acciones"><button class="btn" onclick="tmp.pres=null;colaPrevia()">${t3('Ver el plantel','Ver o elenco','See the squad')}</button></div>`);
 ir('club');
};
function responderCapitan(k){
 const P=tmp.pres,grupo=S.club.n+'|'+S.division;if(!P||S.presentadoGrupo===grupo)return;
 const Q=PREGUNTAS_CAPITAN[hashS(S.club.n+'|'+S.temporada)%PREGUNTAS_CAPITAN.length],r=Q.r[k],l=lecturaDiscurso(P.texto||''),d=dtPerfil(),ef=r.ef.slice();
 S.presentadoGrupo=grupo;S.compromisoGrupo=r.tipo;prepararIdentidadDT();
 const edades=S.plantel.map(j=>j.ed).sort((a,b)=>a-b),corte=edades[Math.floor(edades.length*.65)]||28,joven=edades[Math.floor(edades.length*.35)]||23;
 const suma=(v,o)=>{if(o)Object.entries(o).forEach(([c,n])=>{v[c]=clamp(v[c]+n,0,100);});};
 S.plantel.forEach(j=>{const v=vinculoJugador(j);suma(v,r.todos);if(j.ed>=corte)suma(v,r.ref);if(j.ed<=joven)suma(v,r.jov);
  if(l.concreta)v.rol=clamp(v.rol+3,0,100);if(l.grupo)v.confianza=clamp(v.confianza+2,0,100);if(l.agresion)v.confianza=clamp(v.confianza-5,0,100);
  if(d.origen==='pro')v.confianza=clamp(v.confianza+6,0,100);if(d.origen==='estudio'){v.rol=clamp(v.rol+8,0,100);v.confianza=clamp(v.confianza-4,0,100);}
  if(d.rango==='joven')v.confianza=clamp(v.confianza+(j.ed<=joven?4:j.ed>=corte?-4:0),0,100);if(d.rango==='veterano')v.confianza=clamp(v.confianza+(j.ed>=corte?4:j.ed<=joven?-3:0),0,100);});
 if(r.dir)S.vars.dir=clamp(S.vars.dir+r.dir,0,100);
 if(l.concreta)ef.push(t3('Diste una tarea concreta: todos +3 comprensión','Deu uma tarefa concreta: todos +3','You gave a concrete task: all +3 understanding'));
 if(l.grupo)ef.push(t3('Hablaste del grupo: todos +2 confianza','Falou do grupo: todos +2','You talked about the group: all +2 trust'));
 if(l.agresion)ef.push(t3('Amenazaste: todos −5 confianza','Ameaçou: todos −5','You threatened: all −5 trust'));
 if(d.origen==='pro')ef.push(t3('Ex jugador: todos +6 confianza','Ex-jogador: todos +6','Former player: all +6 trust'));
 if(d.origen==='estudio')ef.push(t3('Venís del estudio: +8 comprensión, −4 confianza','Veio do estudo: +8 compreensão, −4 confiança','You studied the game: +8 understanding, −4 trust'));
 if(d.rango==='joven')ef.push(t3('Sos joven: los pibes +4, los referentes −4','Jovem: garotos +4, líderes −4','Young: kids +4, seniors −4'));
 if(d.rango==='veterano')ef.push(t3('Tus años: referentes +4, los más chicos −3','Seus anos: líderes +4, jovens −3','Your years: seniors +4, youngest −3'));
 S.diarioDT.push({t:S.temporada,tipo:'presentacion',club:S.club.n,texto:(P.texto||'').trim(),compromiso:r.tipo,respuesta:r.t[0]});
 P.resp=k;P.efectos=ef;P.paso=2;cabecera();presentacionPlantel();
}
// la charla también escucha quién habla
const _evaluarCharlaV13=evaluarCharla;
evaluarCharla=function(A,senales,intencion,estado=S){
 const r=_evaluarCharlaV13(A,senales,intencion,estado),d=(estado.dt)||{},sinTitulos=!(estado.titulos||[]).length;
 if(!sinTitulos)return r;
 r.reacciones.forEach(x=>{let m=0;if(d.origen==='pro')m+=.04;if(d.origen==='estudio'&&!r.tarea)m-=.04;if(d.rango==='joven'&&x.j.ed>=31)m-=.05;if(d.rango==='veterano'&&x.j.ed<=22)m-=.03;x.valor=clamp(x.valor+m,-1,1);});
 r.valor=r.reacciones.reduce((n,x)=>n+x.valor,0)/Math.max(1,r.reacciones.length);
 r.nota=Math.round(clamp(5.5+r.valor*9,0,10)*10)/10;r.efecto=Math.round(r.valor*60)/1000;
 r.quien=d.origen==='pro'?t3('Te escuchan como ex jugador (+).','Escutam você como ex-jogador (+).','They hear a former player (+).'):d.origen==='estudio'&&!r.tarea?t3('Sin tarea concreta, al que nunca jugó le cuesta más llegar (−).','Sem tarefa concreta, é mais difícil chegar (−).','Without a concrete task, the man who never played struggles to land it (−).'):d.rango==='joven'?t3('A los referentes les cuesta escuchar a alguien de su edad (−).','Os líderes resistem a alguém da idade deles (−).','Senior players resist someone their own age (−).'):'';
 return r;
};
const _devolucionV13=devolucionCharla;
devolucionCharla=function(A){ const h=_devolucionV13(A),q=A.eval&&A.eval.quien; return q?h+`<p class="mini"><b>${t3('Quién habla','Quem fala','Who is speaking')}:</b> ${q}</p>`:h; };
