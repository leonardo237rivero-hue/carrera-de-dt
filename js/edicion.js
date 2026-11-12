// v14.2 — Cambios legibles y una edición de diario propia de cada temporada.
// La presentación no consume el azar del partido.
function avisoOnce(texto){
 const root=document.querySelector('#s-'+S.pant)||document;
 const aviso=root.querySelector('#avisoCambio');if(aviso)aviso.textContent=texto;
}
function cerrarSelectorOnce(){
 const d=document.getElementById('cambio-once');if(d){d.close();d.remove();}
 tmp.selBanco=null;tmp.slotCambio=null;
}
function cancelarCambioOnce(){cerrarSelectorOnce();if(window[window.__rep])window[window.__rep]();}
function mostrarSelectorOnce(slot){
 const anterior=document.getElementById('cambio-once');if(anterior){anterior.close();anterior.remove();}
 const entra=tmp.selBanco,once=window.__once||[],banco=window.__banco||[],sale=slot!=null?once[slot]:null;
 const d=document.createElement('dialog');d.id='cambio-once';d.className='selector-once';d.setAttribute('aria-labelledby','cambio-titulo');
 const nombre=entra?entra.nom:sale?.jug.nom;
 const opciones=entra?once.map((o,i)=>({j:o.jug,rol:o.rol,i,ok:encaje(entra,o.rol)<2})):
  banco.map((j,i)=>({j,rol:sale.rol,i,ok:disponible(j)&&encaje(j,sale.rol)<2}));
 const habilitados=opciones.filter(o=>o.ok).length;
 d.innerHTML=`<div class="selector-cab"><p class="etq">${t3('ARMÁ TU ONCE','MONTE SEU TIME','PICK YOUR XI')}</p><button class="btn sec compacto" onclick="cancelarCambioOnce()">${t3('Cancelar','Cancelar','Cancel')} ×</button></div>
  <h2 id="cambio-titulo">${entra?t3('¿Quién sale?','Quem sai?','Who comes off?'):t3('¿Quién entra?','Quem entra?','Who comes on?')}</h2>
  <p class="selector-elegido"><span>${entra?t3('ENTRA','ENTRA','ON'):t3('SALE','SAI','OFF')}</span><b>${escapeHTML(nombre)}</b></p>
  <p>${t3('Elegí un nombre para completar el cambio. Los otros diez mantienen su lugar.','Escolha um nome para concluir. Os outros dez mantêm suas posições.','Choose a name to complete the change. The other ten keep their positions.')}</p>
  ${habilitados?'':`<p class="selector-vacio" role="status">${t3('No hay reemplazos compatibles en este sistema. Probá otra formación o elegí otro jugador.','Não há substitutos compatíveis neste sistema. Mude a formação ou escolha outro jogador.','No compatible replacements in this shape. Try another formation or another player.')}</p>`}
  <div class="selector-opciones">${opciones.sort((a,b)=>Number(b.ok)-Number(a.ok)).map(o=>`<button class="selector-opcion" ${o.ok?'':'disabled'} onclick="${entra?`reemplazar(${o.i})`:`cambiarDesdeTitular(${slot},${o.i})`}"><span class="selector-direccion">${entra?'↓':'↑'}</span><span><b>${escapeHTML(o.j.nom)}</b><small>${escapeHTML(posTxt(o.j))}</small><em>${o.ok?(entra?t3('Sale del once','Sai do time','Leaves the XI'):t3('Entra al once','Entra no time','Joins the XI')):!disponible(o.j)?condicionInterior(o.j):t3('No cubre este puesto','Não cobre esta posição','Does not cover this role')}</em></span><strong>${efectivo(o.j)}</strong></button>`).join('')}</div>`;
 const bloque=d.querySelector('.selector-opciones'),bloqueados=[...bloque.querySelectorAll('button:disabled')];
 if(habilitados&&bloqueados.length){const detalle=document.createElement('details');detalle.className='selector-descartados';detalle.innerHTML=`<summary>${t3('Ver jugadores no compatibles','Ver jogadores não compatíveis','See incompatible players')} (${bloqueados.length})</summary>`;bloqueados.forEach(b=>detalle.appendChild(b));bloque.appendChild(detalle);}
 d.addEventListener('cancel',e=>{e.preventDefault();cancelarCambioOnce();});
 document.body.appendChild(d);d.showModal();
}
elegirBanco=function(i){
 const j=window.__banco?.[i];if(!j)return;
 if(!disponible(j)){avisoOnce(j.nom+': '+condicionInterior(j));return;}
 tmp.selBanco=j;tmp.vistaJugador=j;tmp.slotCambio=null;window[window.__rep]();mostrarSelectorOnce(null);
};
verJugadorInterior=function(i,banco){
 if(banco){elegirBanco(i);return;}
 const slot=window.__once?.[i];if(!slot)return;
 tmp.vistaJugador=slot.jug;
 if(tmp.selBanco){reemplazar(i);return;}
 tmp.slotCambio=i;mostrarSelectorOnce(i);
};
function cambiarDesdeTitular(slot,banco){tmp.selBanco=window.__banco?.[banco];reemplazar(slot);}
reemplazar=function(i){
 const entra=tmp.selBanco,once=window.__once,slot=once?.[i];
 if(!entra||!slot||!disponible(entra)||!S.plantel.includes(entra))return false;
 if(encaje(entra,slot.rol)>=2){avisoOnce(t3('Ese jugador no cubre el puesto elegido.','Esse jogador não cobre a posição.','That player does not cover this role.'));return false;}
 const puestos=once.map(o=>o.jug.nom);puestos[i]=entra.nom;
 const f=window.__formacionGestion||S.formacion||S.sistemaPref;
 S.onceFijado={club:S.club.n,f,puestos};S.fijos=puestos.map(n=>S.plantel.find(j=>j.nom===n)).filter(Boolean);
 const sale=slot.jug;cerrarSelectorOnce();tmp.vistaJugador=entra;
 tmp.ultimoCambio={entra:entra.nom,sale:sale.nom,rol:slot.rol};
 window[window.__rep]();
 const estado=document.querySelector('#s-'+S.pant+' .once-confirmacion');if(estado)estado.focus({preventScroll:true});
 return true;
};
function onceAutomatico(){cerrarSelectorOnce();S.fijos=[];S.onceFijado=null;tmp.ultimoCambio=null;window[window.__rep]();}
const _gestionEdicion=vistaGestion;
vistaGestion=function(f,rep){
 window.__formacionGestion=f;
 let html=_gestionEdicion(f,rep);
 html=html.replace(/onclick="S\.fijos=\[\];tmp\.selBanco=null;[^\"]+"/g,'onclick="onceAutomatico()"');
 const c=tmp.ultimoCambio;
 const mensaje=c?`<div class="once-confirmacion" role="status" tabindex="-1"><span>✓ ${t3('Cambio realizado','Troca realizada','Change made')}</span><b>↑ ${escapeHTML(c.entra)} <span>↓ ${escapeHTML(c.sale)}</span></b><small>${escapeHTML(tRol(c.rol))} · ${t3('Los otros diez siguen en su puesto','Os outros dez mantêm suas posições','The other ten keep their positions')}</small></div>`:'';
 return mensaje+html;
};

// Prestigio institucional y capacidad deportiva son dos datos distintos.
// Parámetro de diseño: estos clubes conservan exigencia alta aun con un plantel menor.
const EXIGENCIA_HISTORICA=new Set(['Racing Club','Independiente','San Lorenzo','Corinthians','São Paulo','Grêmio','Internacional','Fluminense','Botafogo','Atlético Mineiro','Cruzeiro','Vasco da Gama','Chelsea','Manchester United','Roma','Napoli','Marsella','Lyon']);
function contextoInstitucional(club,division,seleccion){
 if(!seleccion&&division<3)return {id:'cantera',nivel:0,n:t3('Formar y competir','Formar e competir','Develop and compete'),d:t3('Se evalúa el crecimiento del grupo. El escudo no exige a los juveniles lo mismo que a Primera.','O crescimento do grupo importa; a base não tem a mesma exigência do profissional.','The group’s development matters. The academy is not judged like the first team.')};
 if(club.niv>=5||EXIGENCIA_HISTORICA.has(club.n))return {id:'grande',nivel:2,n:t3('Pelear títulos','Disputar títulos','Challenge for trophies'),d:t3('La historia exige estar arriba. Quedar fuera de los tres primeros sin un título pesa más en la directiva.','A história exige estar no topo. Fora do top 3 sem título, a cobrança aumenta.','History demands a place at the top. Finishing outside the top three without a trophy brings extra scrutiny.')};
 if(club.niv>=3)return {id:'medio',nivel:1,n:t3('Competir arriba','Competir no topo','Compete near the top'),d:t3('Importa sostenerse en la mitad alta y mejorar lo que permite el plantel.','Importa ficar na metade de cima e superar o potencial do elenco.','A top-half finish and progress beyond the squad’s baseline matter.')};
 return {id:'chico',nivel:0,n:t3('Crecer y consolidarse','Crescer e consolidar','Grow and establish the club'),d:t3('No se exige el título. Superar la expectativa del plantel vale más; quedar último sigue siendo una mala campaña.','O título não é obrigação. Superar a expectativa vale mais; terminar em último continua sendo ruim.','A trophy is not demanded. Beating expectations matters more; finishing last is still a poor season.')};
}
function presionCierreClub(c){
 const ctx=contextoInstitucional(S.club,S.division,S.esSeleccion),tit=(c.titulos||[]).some(t=>t.tipo!=='media');
 let dir=0,hin=0;
 if(c.pos&&S.division===3&&!S.esSeleccion){
  if(ctx.id==='grande'&&!tit&&c.pos>3){dir=-Math.min(6,2+(c.pos-3));hin=-Math.min(4,c.pos-2);}
  if(ctx.id==='medio'&&!tit&&c.pos>Math.ceil(c.equipos/2)){dir=-2;hin=-1;}
  if(ctx.id==='chico'&&!c.ultimo&&(c.rel||0)>=2){dir=3;hin=3;}
 }
 return {id:ctx.id,dir,hin};
}
const _cierreEdicion=aplicarCierre;
aplicarCierre=function(c){
 if(!c.presionClub){c.presionClub=presionCierreClub(c);c.dDir+=c.presionClub.dir;c.dHin+=c.presionClub.hin;}
 _cierreEdicion(c);
};
function panelContextoClub(club=S.club,division=S.division){
 const c=contextoInstitucional(club,division,S.esSeleccion);
 return `<div class="contexto-club ${c.id}"><span>${t3('LA EXIGENCIA DEL CLUB','A EXIGÊNCIA DO CLUBE','THE CLUB’S EXPECTATIONS')}</span><b>${c.n}</b><p>${c.d}</p></div>`;
}
const _plantelEdicion=pintarPlantel;
pintarPlantel=function(){_plantelEdicion();const h=document.querySelector('#s-plantel .cine-titulo');if(h)h.insertAdjacentHTML('afterend',panelContextoClub());};
const _planEdicion=pintarPlan;
pintarPlan=function(){_planEdicion();if(tmp.paso>0)return;const p=document.querySelector('#s-planteo .v14-plan');if(p)p.insertAdjacentHTML('afterbegin',panelContextoClub());};
const _prensaEdicion=abrirConferencia;
abrirConferencia=function(){_prensaEdicion();const escena=document.querySelector('#s-prensa .v14-prensa-escena');if(escena)escena.insertAdjacentHTML('afterend',panelContextoClub());};

const TITULARES_EDICION={
 dinastia:[['La costumbre de ganar','El campeón no se baja','Otra vuelta. La misma ambición.','El título vuelve a casa'],['O hábito de vencer','O campeão segue no topo','Outra volta. A mesma ambição.','O título volta para casa'],['Winning becomes a habit','The champions hold on','Another title. The same ambition.','The trophy comes home again']],
 doblete:[['Un año, más de una vuelta','La temporada de las copas','No les alcanzó con un título','Un palmarés que crece'],['Um ano, mais de uma volta','A temporada das taças','Um título não bastou','Uma coleção que cresce'],['One season. More than one trophy.','A season of silverware','One trophy was not enough','The honours keep coming']],
 hazana:[['El título que agrandó al club','La hazaña tiene camiseta','Los que no eran favoritos','Un pequeño hizo historia'],['O título que fez o clube crescer','A façanha tem camisa','Quem não era favorito','Um pequeno fez história'],['The title that lifted a club','An extraordinary shirt to wear','The unlikely champions','A small club makes history']],
 campeon:[['El año tiene dueño','La idea llegó a la copa','Campeones. Con todas las letras.','El trabajo dio la vuelta'],['O ano tem dono','A ideia chegou à taça','Campeões. Com todas as letras.','O trabalho virou título'],['The season has an owner','An idea becomes a trophy','Champions. In every sense.','The work earns its lap of honour']],
 copa:[['Una copa cambia el balance','La alegría llegó por otra puerta','La temporada encontró su premio','Hay una copa para contarla'],['Uma taça muda o balanço','A alegria veio por outra porta','A temporada encontrou seu prêmio','Uma taça para contar a história'],['A cup changes the verdict','Joy arrived by another route','The season found its reward','A trophy to tell the story']],
 formacion:[['La cantera levantó la copa','Aprender también puede dar títulos','El futuro dio una vuelta','Los de abajo tienen su premio'],['A base levantou a taça','Aprender também dá títulos','O futuro deu a volta','A base ganhou seu prêmio'],['The academy lifts a trophy','Learning can win titles too','The future takes a lap of honour','A reward for the academy']],
 revelacion:[['Más arriba de lo imaginado','El club se animó a crecer','Una campaña para hacerse respetar','El año en que miraron hacia arriba'],['Mais alto do que se imaginava','O clube ousou crescer','Uma campanha para ganhar respeito','O ano de olhar para cima'],['Higher than they imagined','A club dares to grow','A campaign that earns respect','The year they looked up']],
 cerca:[['Tan cerca de la vuelta','El título quedó a un paso','Subcampeones, con una espina','Arriba, pero faltó el último paso'],['Tão perto da volta','O título ficou a um passo','Vice-campeões, com uma dor','No topo, faltou o último passo'],['So close to the trophy','One step short of the title','Runners-up, with unfinished business','Up there, but one step short']],
 exigencia:[['El escudo pide más','Estar ahí ya no alcanza','Un grande rinde cuentas','La historia pesa en el balance'],['O escudo pede mais','Estar ali já não basta','Um grande presta contas','A história pesa no balanço'],['The badge demands more','Being there is no longer enough','A giant must answer','History weighs on the verdict']],
 crisis:[['Una temporada para dar la cara','El año dejó más preguntas','Un cierre que exige respuestas','Las cuentas del mal año'],['Uma temporada para dar a cara','O ano deixou perguntas','Um fim que exige respostas','As contas de um ano ruim'],['A season to face up to','The year leaves questions','An ending that demands answers','The reckoning after a poor year']],
 ultimo:[['El fondo de la tabla','Últimos: el balance más duro','Un año cuesta arriba','La tabla no da respiro'],['O fundo da tabela','Últimos: o balanço mais duro','Um ano difícil','A tabela não dá trégua'],['At the foot of the table','Last place. The harshest verdict.','A season uphill','No respite in the standings']],
 progreso:[['Los pibes se ganaron su lugar','El futuro ya está jugando','Una base para lo que viene','La cantera dejó nombres'],['Os garotos ganharam espaço','O futuro já está jogando','Uma base para o próximo ano','A base deixou nomes'],['The youngsters earned their place','The future is already playing','A foundation for what comes next','The academy leaves its names']],
 clasico:[['La alegría que guarda la tribuna','El clásico le dio otro color','Un rival, una marca en el año','La temporada que ganó su clásico'],['A alegria que a torcida guarda','O clássico mudou a cor do ano','Um rival, uma marca no ano','A temporada que venceu o clássico'],['The joy the fans will keep','The derby coloured the year','One rival. A mark on the season.','The season they won the derby']],
 equilibrio:[['Un año en su medida','El balance de un equipo en marcha','La temporada deja una base','Entre lo logrado y lo que falta'],['Um ano na sua medida','O balanço de um time em movimento','A temporada deixa uma base','Entre o feito e o que falta'],['A season in proportion','Taking stock of a team in motion','The season leaves a foundation','Between achievements and unfinished work']],
 finalista:[['La copa se escapó al final','Una final, una cuenta pendiente','El último partido dejó la espina','Llegar no fue suficiente'],['A taça escapou no fim','Uma final, uma conta pendente','O último jogo deixou a dor','Chegar não foi suficiente'],['The cup slipped away at the end','A final and unfinished business','The last match left its sting','Getting there was not enough']],
 eliminacion:[['La copa terminó antes del sueño','Hasta acá llegó el camino','Una eliminación para analizar','El torneo cerró sus puertas'],['A copa acabou antes do sonho','O caminho terminou aqui','Uma eliminação para analisar','O torneio fechou suas portas'],['The cup ended before the dream','The road ended here','An elimination to examine','The tournament closed its doors']]
};
function datosEdicion(){
 const c=S.calc||{},TT=S.temp||{},mis=TT.mis||[],tit=c.titulos||[],ctx=contextoInstitucional(S.club,S.division,S.esSeleccion);
 const balance={pj:mis.length,g:0,e:0,p:0,gf:0,gc:0,ceros:0};
 mis.forEach(m=>{balance.gf+=m.gf;balance.gc+=m.gc;balance[m.gf>m.gc?'g':m.gf<m.gc?'p':'e']++;if(!m.gc)balance.ceros++;});
 const jovenes=(S.plantel||[]).filter(j=>j.ed<=21&&(j.st?.pj||0)>=6).sort((a,b)=>b.st.pj-a.st.pj);
 const clasicos=mis.filter(m=>m.clasico),cg=clasicos.filter(m=>m.gf>m.gc).length,cp=clasicos.filter(m=>m.gf<m.gc).length;
 const liga=tit.some(t=>t.tipo==='liga'),previo=(S.hist||[]).find(h=>h.t===S.temporada-1&&h.club===S.club.n&&h.tit?.includes('liga'));
 const mayores=tit.filter(t=>t.tipo!=='media');
 let tipo;
 if(tit.length&&ctx.id==='cantera')tipo='formacion';
 else if(mayores.length>1)tipo='doblete';
 else if(liga&&previo)tipo='dinastia';
 else if(liga&&ctx.id==='chico')tipo='hazana';
 else if(liga)tipo='campeon';
 else if(tit.length)tipo='copa';
 else if(c.ultimo)tipo='ultimo';
 else if(!c.pos)tipo=c.copaFinal?'finalista':'eliminacion';
 else if(ctx.id==='grande'&&c.pos>3)tipo='exigencia';
 else if(c.exp&&c.pos>=c.exp+2)tipo='crisis';
 else if(c.exp&&c.pos<=c.exp-2)tipo='revelacion';
 else if(c.pos===2)tipo='cerca';
 else if(ctx.id==='cantera'&&jovenes.length)tipo='progreso';
 else if(cg>cp)tipo='clasico';
 else if(jovenes.length>=2&&ctx.id!=='grande')tipo='progreso';
 else tipo='equilibrio';
 const indice=(hashS(S.club.n+'|'+tipo)+Math.max(0,S.temporada-1))%4;
 const headline=t3(...TITULARES_EDICION[tipo].map(a=>a[indice]));
 const positivo=['dinastia','doblete','hazana','campeon','copa','formacion','revelacion','progreso','clasico'].includes(tipo);
 const negativo=['crisis','ultimo','exigencia','eliminacion'].includes(tipo);
 const foto=tit.length?'festejo':tipo==='revelacion'||tipo==='clasico'||tipo==='hazana'?'revelacion':tipo==='progreso'?'practica-ronda':negativo||tipo==='cerca'||tipo==='finalista'?'cierre-vestuario':'vestuario-plantel';
 const pie=tit.length?`${S.club.n} · ${tit.map(t=>t.comp).join(' / ')}`:c.pos?`${S.club.n} · ${c.pos}º / ${c.equipos} · ${TT.ligaNombre||S.compe||''}`:`${S.club.n} · ${c.copa?.nombre||S.compe||''}`;
 return {c,TT,mis,tit,ctx,balance,jovenes,clasicos,cg,cp,tipo,headline,positivo,negativo,foto,pie};
}
function notasEdicion(d){
 const {c,mis,balance,jovenes,clasicos,cg,cp}=d,N=[],esc=escapeHTML;
 const nota=(id,titulo,texto,peso)=>N.push({id,titulo,texto,peso});
 if(clasicos.length)nota('clasico',cg>cp?t3('El clásico quedó en casa','O clássico ficou em casa','The derby stayed at home'):cp>cg?t3('La espina del clásico','A dor do clássico','The derby’s sting'):t3('El clásico, en tablas','O clássico, empatado','The derby, honours even'),clasicos.map(m=>`${esc(m.rival.n)}: ${m.gf}–${m.gc}`).join(' · '),95);
 const gol=c.fig?.gol;
 if(gol?.st?.g>0)nota('goleador',t3('Un nombre para los goles','Um nome para os gols','A name behind the goals'),t3(`${esc(gol.nom)} firmó ${gol.st.g} goles en ${gol.st.pj} partidos.`,`${esc(gol.nom)} marcou ${gol.st.g} gols em ${gol.st.pj} jogos.`,`${esc(gol.nom)} scored ${gol.st.g} goals in ${gol.st.pj} matches.`),70);
 if(jovenes.length){const j=jovenes[0];nota('cantera',t3('El futuro tiene minutos','O futuro tem minutos','The future gets playing time'),t3(`${esc(j.nom)}, ${j.ed} años: ${j.st.pj} partidos. ${jovenes.length} jugadores de hasta 21 años llegaron a seis presencias.`,`${esc(j.nom)}, ${j.ed} anos: ${j.st.pj} jogos. ${jovenes.length} atletas de até 21 anos chegaram a seis partidas.`,`${esc(j.nom)}, aged ${j.ed}: ${j.st.pj} appearances. ${jovenes.length} players aged 21 or under reached six appearances.`),d.ctx.id==='cantera'?98:73);}
 const pats={};mis.forEach(m=>(m.pats||[]).forEach(([p])=>pats[p]=(pats[p]||0)+1));
 const sello=Object.entries(pats).sort((a,b)=>b[1]-a[1])[0];
 if(sello)nota('sello',t3('La firma del equipo','A marca do time','The team’s signature'),t3(`${sello[1]} goles con ${esc(nomPatron(sello[0]))}. El patrón más repetido entre los goles registrados.`,`${sello[1]} gols com ${esc(nomPatron(sello[0]))}. O padrão mais frequente nos gols registrados.`,`${sello[1]} goals from ${esc(nomPatron(sello[0]))}. The most frequent pattern among recorded goals.`),74);
 const mejor=mis.filter(m=>m.gf>m.gc).sort((a,b)=>(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf)[0];
 if(mejor)nota('goleada',t3('El día que salió todo','O dia em que tudo deu certo','The day it all came together'),`${esc(S.club.n)} ${mejor.gf}–${mejor.gc} ${esc(mejor.rival.n)}. `+t3('La victoria de mayor diferencia de la campaña.','A maior diferença numa vitória da campanha.','The biggest winning margin of the campaign.'),d.positivo?76:55);
 const peor=mis.filter(m=>m.gc>m.gf).sort((a,b)=>(b.gc-b.gf)-(a.gc-a.gf)||b.gc-a.gc)[0];
 if(peor)nota('derrota',t3('El golpe más duro','O golpe mais duro','The hardest blow'),`${esc(S.club.n)} ${peor.gf}–${peor.gc} ${esc(peor.rival.n)}. `+t3('La derrota más amplia del año.','A derrota mais ampla do ano.','The heaviest defeat of the year.'),d.negativo?94:45);
 if(balance.pj&&balance.p===0)nota('invicto',t3('Nadie pudo ganarle','Ninguém conseguiu vencer','Nobody could beat them'),t3(`${balance.pj} partidos sin derrotas: ${balance.g} victorias y ${balance.e} empates en las competencias disputadas.`,`${balance.pj} jogos sem derrotas: ${balance.g} vitórias e ${balance.e} empates.`,`${balance.pj} games unbeaten: ${balance.g} wins and ${balance.e} draws across all competitions.`),100);
 else if(balance.ceros>=Math.ceil(balance.pj*.4)&&balance.pj)nota('arco',t3('La puerta bien cerrada','A porta bem fechada','Keeping the door shut'),t3(`${balance.ceros} arcos en cero en ${balance.pj} partidos.`,`${balance.ceros} jogos sem sofrer gol em ${balance.pj}.`,`${balance.ceros} clean sheets in ${balance.pj} matches.`),80);
 let racha=0,max=0;mis.forEach(m=>{racha=m.gf>=m.gc?racha+1:0;max=Math.max(max,racha);});
 if(max>=4&&balance.p)nota('racha',t3('El mejor tramo','A melhor sequência','The strongest run'),t3(`Encadenó ${max} partidos sin perder.`,`Emendou ${max} jogos sem perder.`,`A run of ${max} matches without defeat.`),78);
 const log=(S.diarioDT||[]).filter(x=>x.t===S.temporada&&(!x.club||x.club===S.club.n));
 const compromiso=log.find(x=>x.tipo==='compromiso');
 if(compromiso)nota('palabra',compromiso.cumple?t3('La palabra se cumplió','A palavra foi cumprida','A promise kept'):t3('La promesa pendiente','A promessa pendente','An unfulfilled promise'),`${textoCompromiso(compromiso.compromiso)}. ${t3('Directiva','Diretoria','Board')} ${sg(compromiso.efecto)}.`,88);
 if(c.copa&&!c.copaGano)nota('copa',t3('La otra competencia','A outra competição','The other competition'),`${esc(c.copa.nombre)} · ${esc(c.copaFinal?t3('Finalista','Finalista','Runners-up'):c.copa.eliminado||t3('Participación cerrada','Participação encerrada','Campaign completed'))}`,72);
 // No se inventan partidos, debuts, títulos ni causas para rellenar columnas.
 // Rotar los temas secundarios sin desplazar los hechos decisivos ni consumir R.
 N.forEach(n=>{if(n.peso<85)n.peso+=(hashS(S.club.n+'|'+S.temporada+'|'+n.id)%19)-9;});
 return N.sort((a,b)=>b.peso-a.peso||a.id.localeCompare(b.id)).slice(0,4);
}
function bajadaEdicion(d){
 const {c,tit,ctx}=d,club=escapeHTML(S.club.n);
 let apertura=tit.length?t3(`${club} cerró la temporada con ${tit.map(t=>escapeHTML(t.comp)).join(' y ')}.`,`${club} fechou a temporada com ${tit.map(t=>escapeHTML(t.comp)).join(' e ')}.`,`${club} ended the season with ${tit.map(t=>escapeHTML(t.comp)).join(' and ')}.`):
  c.pos?t3(`${club} terminó ${c.pos}º de ${c.equipos}.`,`${club} terminou em ${c.pos}º de ${c.equipos}.`,`${club} finished ${c.pos} of ${c.equipos}.`):
  t3(`${club} cerró su participación en ${escapeHTML(c.copa?.nombre||S.compe||'el torneo')}.`,`${club} encerrou sua participação em ${escapeHTML(c.copa?.nombre||S.compe||'o torneio')}.`,`${club} completed its campaign in ${escapeHTML(c.copa?.nombre||S.compe||'the tournament')}.`);
 if(tit.length&&c.pos)apertura+=' '+t3(`En la liga terminó ${c.pos}º de ${c.equipos}.`,`Na liga terminou em ${c.pos}º de ${c.equipos}.`,`In the league it finished ${c.pos} of ${c.equipos}.`);
 if(c.pos&&c.exp)apertura+=' '+t3(`Por fuerza del plantel se proyectaba el ${c.exp}º puesto.`,`Pela força do elenco, a projeção era o ${c.exp}º lugar.`,`Squad strength projected a finish in position ${c.exp}.`);
 const lectura={
  grande:tit.length?t3('Cumplió con la exigencia de un club que vive para ganar.','Cumpriu a exigência de um clube que vive para ganhar.','It met the demand of a club built to win.'):t3('En un grande, competir cerca no tiene el mismo valor que levantar un título.','Num grande, competir perto não vale o mesmo que levantar uma taça.','For a giant, competing near the top is not the same as lifting a trophy.'),
  chico:d.positivo?t3('Para un club de recursos modestos, esta campaña abre una perspectiva distinta.','Para um clube de recursos modestos, esta campanha abre outra perspectiva.','For a club with modest resources, this campaign opens a different outlook.'):t3('La medida es consolidar al club y competir con lo que tiene; el título nunca fue una obligación.','A medida é consolidar o clube e competir com o que tem; o título nunca foi obrigação.','The measure is establishing the club and competing with its resources; a title was never required.'),
  cantera:t3('El balance de formativas también se escribe con los minutos y el crecimiento de los jóvenes.','O balanço da base também se escreve com minutos e crescimento dos jovens.','An academy’s verdict also rests on playing time and the development of young players.'),
  medio:t3('El club busca sostenerse arriba: el resultado se mide contra su plantel y su ambición.','O clube busca se manter em cima: o resultado é medido pelo elenco e pela ambição.','The club wants to stay near the top: the result is measured against its squad and ambition.')
 };
 return apertura+' '+lectura[ctx.id];
}
cronicaTemporada=function(){
 const d=datosEdicion(),{c,balance:b,ctx}=d,esc=escapeHTML;
 const log=(S.diarioDT||[]).filter(x=>x.t===S.temporada&&(!x.club||x.club===S.club.n));
 const cita=log.filter(x=>(x.tipo==='charla'||x.tipo==='prensa')&&x.texto?.trim().length>12).sort((a,b)=>Math.abs(b.efecto||0)-Math.abs(a.efecto||0))[0];
 const etiqueta=d.positivo?t3('UN AÑO PARA RECORDAR','UM ANO PARA LEMBRAR','A YEAR TO REMEMBER'):d.negativo?t3('HORA DE RENDIR CUENTAS','HORA DE PRESTAR CONTAS','TIME TO ANSWER'):t3('EL BALANCE DE LA CAMPAÑA','O BALANÇO DA CAMPANHA','THE SEASON VERDICT');
 const cambio=(key)=>c.antes?Math.round(S.vars[key]-c.antes[key]):Math.round(c[key==='dir'?'dDir':'dHin']||0);
 const pres=c.presionClub||{dir:0,hin:0};
 return `<article class="diario-edicion ${d.positivo?'celebracion':d.negativo?'critica':'balance'}" aria-label="${t3('Periódico de la temporada','Jornal da temporada','Season newspaper')}">
  <header class="diario-masthead"><span>${t3('FÚTBOL · HISTORIAS · CARÁCTER','FUTEBOL · HISTÓRIAS · CARÁTER','FOOTBALL · STORIES · CHARACTER')}</span><strong>${t3('DESDE EL BANCO','DO BANCO','FROM THE TOUCHLINE')}</strong><div><span>${esc(S.club.n)} · ${esc(S.club.p||'')}</span><span>${t3('EDICIÓN','EDIÇÃO','EDITION')} ${String(S.temporada).padStart(2,'0')}</span></div></header>
  <div class="diario-principal"><p class="diario-volanta">${etiqueta}</p><h2>${esc(d.headline)}</h2><p class="diario-bajada">${bajadaEdicion(d)}</p>
  <div class="diario-apertura"><figure><img src="assets/v14/${d.foto}.jpg" width="1672" height="941" alt="${d.foto==='festejo'?t3('Plantel celebrando con una copa','Elenco celebrando com uma taça','Squad celebrating with a trophy'):d.foto==='revelacion'?t3('Jugadores y tribuna de un club de barrio celebrando juntos','Jogadores e torcida celebram juntos','Players and a local crowd celebrating together'):d.foto==='cierre-vestuario'?t3('Un vestuario vacío al final de la jornada','Um vestiário vazio no fim do dia','An empty dressing room at the end of the day'):t3('El grupo en su lugar de trabajo','O grupo no seu local de trabalho','The squad at its workplace')}"><figcaption>${esc(d.pie)}</figcaption></figure>
   <aside class="diario-veredicto"><p class="diario-rubro">${t3('LO QUE QUEDA','O QUE FICA','WHAT REMAINS')}</p><h3>${ctx.n}</h3><p>${ctx.d}</p>
   <div class="diario-reacciones"><div><span>${t3('Directiva','Diretoria','Board')}</span><b>${sg(cambio('dir'))}</b></div><div><span>${t3('Hinchada','Torcida','Fans')}</span><b>${sg(cambio('hin'))}</b></div></div>
   ${pres.dir||pres.hin?`<p class="diario-presion">${t3('Dentro de ese balance, la exigencia del club aportó','Nesse balanço, a exigência do clube contribuiu','Within that verdict, club expectations contributed')}: ${t3('directiva','diretoria','board')} ${sg(pres.dir)}, ${t3('hinchada','torcida','fans')} ${sg(pres.hin)}.</p>`:''}
   <p class="diario-firma">${esc(S.nombre||'DT')}<small>${t3('Temporada','Temporada','Season')} ${S.temporada} · ${esc(S.formacion||'')}</small></p></aside></div>
  <dl class="diario-numeros">${[[b.pj,t3('Partidos','Jogos','Matches')],[`${b.g} / ${b.e} / ${b.p}`,t3('Ganados / empatados / perdidos','Vitórias / empates / derrotas','Wins / draws / losses')],[`${b.gf} : ${b.gc}`,t3('Goles a favor / en contra','Gols a favor / contra','Goals for / against')],[c.pos?`${c.pos}º`:c.copaFinal?'2º':c.copaGano?'1º':'—',t3('Posición final','Posição final','Final position')]].map(([v,n])=>`<div><dt>${n}</dt><dd>${v}</dd></div>`).join('')}</dl>
  <div class="diario-noticias">${notasEdicion(d).map((n,i)=>`<section class="diario-noticia"><span class="diario-rubro">0${i+1} / ${t3('LA CAMPAÑA','A CAMPANHA','THE CAMPAIGN')}</span><h3>${n.titulo}</h3><p>${n.texto}</p></section>`).join('')}</div>
  ${cita?`<blockquote class="diario-cita"><p>“${esc(cita.texto.trim().slice(0,190))}${cita.texto.trim().length>190?'…':''}”</p><cite>${esc(S.nombre||'DT')} · ${cita.tipo==='charla'?t3('en el vestuario','no vestiário','in the dressing room'):t3('ante la prensa','na coletiva','at the press conference')}${cita.rival?' · '+esc(cita.rival):''}</cite></blockquote>`:''}
  <footer class="diario-pie"><span>${t3('Cada temporada deja una historia. Esta fue la tuya.','Cada temporada deixa uma história. Esta foi a sua.','Every season leaves a story. This was yours.')}</span><b>${t3('FIN DE TEMPORADA','FIM DE TEMPORADA','SEASON END')} / ${S.temporada}</b></footer></div></article>`;
};
pintarReporte=function(){
 // Informe estadístico original, sin las dos tapas superpuestas de v10/v14.
 _pintarReporteV9();
 const root=document.querySelector('#s-resolucion'),acciones=root.querySelector('.acciones');
 root.classList.add('tapa-temporada','edicion-temporada');
 const detalle=document.createElement('details');detalle.className='detalle-temporada';
 detalle.innerHTML=`<summary>${t3('Abrir tabla, figuras y análisis completo','Abrir tabela, destaques e análise','Open table, standouts and full analysis')}</summary>`;
 [...root.children].filter(el=>el!==acciones).forEach(el=>detalle.appendChild(el));
 root.insertAdjacentHTML('afterbegin',cronicaTemporada());root.insertBefore(detalle,acciones);
};
