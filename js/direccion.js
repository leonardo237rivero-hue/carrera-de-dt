// v10. Integración de la dirección cuaderno / banco / tapa con el motor v9.
// Los adaptadores mantienen las reglas y las rutas antiguas disponibles.
const _irV9=ir;
ir=function(p){
  if(typeof detenerDictado==='function')detenerDictado();
  _irV9(p);
  if(document.body&&document.body.dataset)document.body.dataset.pant=p;
};
portada=function(){
  detenerDictado();S=nuevo();aplicarTema();const guardado=leerGuardado();
  $('#s-portada').innerHTML=`<div class="portada nueva-portada"><div class="portada-arte"><div class="portada-texto"><span class="etq">CARRERA DE DT · v${VERSION_JUEGO}</span><h1 class="disp">${t3('EL BARRIO<br>TE ESTÁ<br><em>MIRANDO.</em>','O BAIRRO<br>ESTÁ<br><em>OLHANDO.</em>','THE NEIGHBOURHOOD<br>IS <em>WATCHING.</em>')}</h1><p>${t3('Hay una idea en tu cabeza.<br>Y once tipos para llevarla a la cancha.','Uma ideia na cabeça. Onze jogadores para levá-la ao campo.','An idea in your head. Eleven players to bring it to the pitch.')}</p><button class="btn" onclick="identidad()">${T('empezar')} →</button></div></div><div class="portada-pie">${guardado?`<button class="btn sec" onclick="continuarGuardado()">${t3('Continuar pretemporada de ','Continuar pré-temporada de ','Resume pre-season at ')}${escapeHTML(guardado.estado.club.n)}</button>`:''}<button class="btn sec" onclick="abrirDuelo()">${T('duelo')}</button><div class="idiomas">${IDIOMAS.map(x=>`<button class="lang ${IDIOMA===x.id?'on':''}" onclick="cambiarIdioma('${x.id}')">${x.n}</button>`).join('')}</div><p class="nota-dato">${t3('Tu identidad, tu vestuario y tus decisiones. Una carrera que se vive desde el banco.','Sua identidade, seu grupo e suas decisões.','Your identity, your dressing room, your decisions.')}</p></div></div>`;ir('portada');
};
ICONO_ARQ.formador='01';ICONO_ARQ.ganador='02';ICONO_ARQ.bombero='03';
const _pintarIdentidadV9=pintarIdentidad;
pintarIdentidad=function(){
  _pintarIdentidadV9();const actions=document.querySelector('#s-identidad .acciones');if(!actions)return;
  const extras=document.createElement('div');extras.className='opciones-carrera';extras.innerHTML=`<label>${t3('Edad al empezar','Idade inicial','Starting age')}<input id="edad-dt" type="number" min="25" max="65" value="${S.edadInicio||35}" onchange="S.edadInicio=clamp(Number(this.value)||35,25,65)"></label><label>${t3('Cómo querés vivir los partidos','Como acompanhar os jogos','How to experience matches')}<select onchange="S.ritmo=this.value"><option value="elegir" ${S.ritmo!=='rapido'?'selected':''}>${t3('Elegir en cada partido importante','Escolher nos jogos grandes','Choose at each big match')}</option><option value="rapido" ${S.ritmo==='rapido'?'selected':''}>${t3('Camino rápido: simular con mi plan','Caminho rápido: simular com meu plano','Fast route: simulate with my plan')}</option></select></label><p class="nota-dato">${t3('La edad cambia tu retrato con las temporadas. Simular usa el motor del partido: no agrega azar ni borra tu idea.','A idade muda o retrato. Simular usa o motor, sem azar extra.','Age changes your portrait over the seasons. Simulation uses the match engine, with no extra randomness.')}</p>`;actions.parentNode.insertBefore(extras,actions);
};
pintarIdea=function(){
  tmp.m=tmp.m||modeloDeEstilo(tmp.e||'Posesion');tmp.e=estiloDeModelo(tmp.m);
  $('#s-idea').innerHTML=`<p class="etq">${t3('TU FIRMA COMO DT','SUA ASSINATURA','YOUR SIGNATURE')}</p><h2 class="disp">${t3('Una idea para sostener.','Uma ideia para sustentar.','An idea to stand by.')}</h2><p>${t3('Elegís tus principios. Después vas a ajustar alturas, ayudas y riesgos sin perder lo que el equipo aprendió.','Escolha princípios. Depois ajuste alturas e riscos sem apagar o que o time aprendeu.','Choose your principles. Later you can adjust heights, cover and risk without erasing what the team learned.')}</p><div class="lbl-sel">${t3('Sistema de partida','Sistema inicial','Starting formation')}</div><div class="pills">${FORMACIONES.map(f=>`<button class="pill ${f===tmp.f?'on':''}" onclick="tmp.f='${f}';pintarIdea()">${f}</button>`).join('')}</div>${selectorModelo(tmp.m,'elegirMomentoIdea')}<div class="huella-idea"><b>${t3('El dibujo cambia. Los principios se entrenan.','O desenho muda. Os princípios se treinam.','The shape changes. Principles are trained.')}</b><span>${t3('Cada momento conserva su propio aprendizaje. Una corrección de entretiempo no vuelve a cero tu trabajo.','Cada momento guarda sua aprendizagem. Um ajuste não apaga tudo.','Each phase keeps its own learning. A half-time correction does not reset your work.')}</span></div><details><summary>${t3('Ver la idea en la cancha','Ver a ideia no campo','See the idea on the pitch')}</summary><div id="ideaCancha">${svgIdea(tmp.f,tmp.e,'con',tmp.m)}</div>${patronesDelModelo(tmp.m)}</details><div class="acciones"><button class="btn" onclick="confirmarIdea()">${T('buscarClub')} →</button><button class="btn sec" onclick="identidad()">${T('volver')}</button></div>`;
};
const _confirmarIdeaV9=confirmarIdea;
const _irIdeaV9=irIdea;
irIdea=function(){const edad=document.getElementById('edad-dt');if(edad)S.edadInicio=clamp(Number(edad.value)||35,25,65);_irIdeaV9();};
confirmarIdea=function(){S.edadInicio=clamp(Number(S.edadInicio)||35,25,65);_confirmarIdeaV9();prepararIdentidadDT();};
const _cabeceraV9=cabecera;
cabecera=function(){
  _cabeceraV9();const c=$('#cab');if(!c||c.hidden||!S.club)return;
  const row=c.querySelector('.hrow');if(row){row.insertAdjacentHTML('beforeend',`<div class="dt-mini">${retratoDT(46)}<span>${escapeHTML(S.nombre||'DT')} · ${edadDT()}<small>${t3('años','anos','years')}</small></span></div>`);}
  c.insertAdjacentHTML('beforeend',`<div class="cab-idea">${escapeHTML(lecturaIdentidad())}</div>`);fijarCabh(c.offsetHeight||0);
};
const _colaPreviaV9=colaPrevia;
colaPrevia=function(){
  if(S.introVisto===S.club.n&&!necesitaIdioma()&&!necesitaPrensa()&&S.prensaTemporada!==S.temporada){abrirConferencia();return;}
  _colaPreviaV9();
};
const _verPlantelV9=verPlantel;
verPlantel=function(){prepararIdentidadDT();_verPlantelV9();guardarPretemporada();};
const _pintarPlantelV9=pintarPlantel;
pintarPlantel=function(){
  _pintarPlantelV9();if(S.pant==='plantel')guardarPretemporada();const root=$('#s-plantel');if(!root)return;
  const cartel=document.createElement('div');cartel.className='banco-hero';cartel.innerHTML=`<div><span>${t3('PUERTAS ADENTRO','PORTAS ADENTRO','BEHIND CLOSED DOORS')}</span><h2 class="disp">${escapeHTML(S.club.n)}</h2><p>${t3('Tu equipo. Tu idea. Otra temporada.','Seu time. Sua ideia. Outra temporada.','Your team. Your idea. Another season.')}</p></div>${retratoDT(95)}`;root.insertBefore(cartel,root.firstChild);
};
const _pintarPlanV9=pintarPlan;
pintarPlan=function(){
  if(tmp.paso>0){_pintarPlanV9();return;}
  prepararIdentidadDT();tmp.m=tmp.m||copiaModelo(S.modelo||S.modeloPref);tmp.e=estiloDeModelo(tmp.m);tmp.plan=planDelModelo(tmp.m);
  const rv=S.rivalPlan;
  $('#s-planteo').innerHTML=`<p class="etq">${t3('CUADERNO DEL DT','CADERNO DO TÉCNICO','COACH’S NOTEBOOK')}</p><h2 class="disp">${t3('Lo que trabajamos.','O que treinamos.','What we trained.')}</h2><div class="huella-idea"><b>${tmp.f} · ${tEstilo(tmp.e)}</b><span>${lecturaIdentidad()}</span></div><p>${t3('Este es tu plan de base para toda la temporada. En los partidos grandes elegís dónde insistir, a quién ayudar y cuánto arriesgar. Esas órdenes no borran tu ADN.','Este é o plano de base. Ajustes nos grandes jogos não apagam sua identidade.','This is your season-long base plan. Big-match orders decide where to focus, cover and risk; they do not erase your identity.')}</p><div class="plan-base">${FASES.map(F=>{const op=F.ops.find(o=>o.id===tmp.plan[F.id]);return `<div><span>${L(F.n)}</span><b>${L(op.n)}</b></div>`;}).join('')}</div><details><summary>${t3('Revisar sistema y principios','Revisar sistema e princípios','Review shape and principles')}</summary><div class="pills">${FORMACIONES.map(f=>`<button class="pill ${tmp.f===f?'on':''}" onclick="tmp.f='${f}';pintarPlan()">${f}</button>`).join('')}</div>${selectorModelo(tmp.m,'elegirMomentoPlan')}<p class="nota-dato">${t3('Un principio nuevo arranca con su aprendizaje propio; lo anterior queda guardado para cuando lo vuelvas a usar.','Um princípio novo começa com sua aprendizagem; o anterior fica guardado.','A new principle starts with its own learning; your previous work stays available.')}</p></details>${rv?`<details><summary>${t3('Informe del rival destacado','Relatório do rival','Featured opponent report')}</summary><div class="rival-card">${escudo(rv.club,40)}<div><b>${rv.club.n}</b><p>${rv.f} · ${tEstilo(rv.e)}</p></div></div><p class="nota-dato">${t3('La preparación no es un examen: elegí una idea y observá cómo funciona frente a cada rival.','Escolha uma ideia e observe cada rival.','Preparation is not a quiz: choose an idea and observe it against each opponent.')}</p></details>`:''}<div class="acciones"><button class="btn" onclick="empezarTemporada()">${T('jugarTemporada')} →</button></div>`;
};
const _empezarTemporadaV9=empezarTemporada;
empezarTemporada=function(){
  prepararIdentidadDT();tmp.plan=Object.keys(tmp.plan||{}).length?tmp.plan:planDelModelo(tmp.m);S.autoPar=tmp.f+'|'+tmp.e;S.auto=automatismosDe(tmp.m);_empezarTemporadaV9();
};
// Un cambio estructural sólo deja en adaptación los principios que cambiaron.
pintarGestionTk=function(){
  prepararIdentidadDT();const c=tmp.cambio,actual=S.modelo||modeloDeEstilo(S.estilo),n=MOMENTOS.filter(M=>c.m[M.id]!==actual[M.id]).length;
  const cambia=n>0||c.f!==S.formacion;
  $('#s-club').innerHTML=`<p class="etq">${t3('CUADERNO · ENTRE FECHAS','CADERNO · ENTRE RODADAS','NOTEBOOK · BETWEEN ROUNDS')}</p><h2 class="disp">${t3('Corregir con memoria.','Corrigir com memória.','Adjust without forgetting.')}</h2><div class="huella-idea"><b>${lecturaIdentidad()}</b><span>${t3('Podés cambiar el dibujo o un principio. Lo anterior queda aprendido; no se reinicia el equipo entero.','Pode mudar o desenho ou um princípio sem apagar o restante.','Change a shape or a principle without resetting the whole team.')}</span></div><div class="pills">${FORMACIONES.map(f=>`<button class="pill ${f===c.f?'on':''}" onclick="tmp.cambio.f='${f}';pintarGestionTk()">${f}</button>`).join('')}</div>${selectorModelo(c.m,'elegirMomentoTk')}${cambia?`<div class="alerta"><b>${n} ${t3('principios modificados','princípios alterados','changed principles')}</b><p>${t3('Aprendizaje de este plan','Aprendizagem deste plano','Learning for this plan')}: ${automatismosDe(c.m)}. ${t3('Adaptación breve: hasta tres fechas. Lo ya entrenado se conserva.','Adaptação breve: até três rodadas.','Short adaptation: up to three rounds. Previous learning is retained.')}</p></div>`:''}${vistaGestion(c.f,'pintarGestionTk')}<div class="acciones"><button class="btn" onclick="volverTk()">${cambia?t3('Aplicar y seguir jugando','Aplicar e continuar','Apply and keep playing'):t3('Seguir jugando','Continuar jogando','Keep playing')}</button>${cambia?`<button class="btn sec" onclick="abrirGestionTk()">${t3('Dejar el plan como estaba','Manter o plano anterior','Keep the previous plan')}</button>`:''}</div>`;cabecera();
};
volverTk=function(){
  const c=tmp.cambio, viejo=S.modelo||modeloDeEstilo(S.estilo);
  if(c&&(c.f!==S.formacion||MOMENTOS.some(M=>c.m[M.id]!==viejo[M.id]))){
    prepararIdentidadDT();const cambios=MOMENTOS.filter(M=>c.m[M.id]!==viejo[M.id]).length;
    S.formacion=c.f;S.estilo=c.e;S.modelo=copiaModelo(c.m);S.autoPar=c.f+'|'+c.e;S.auto=automatismosDe(c.m);S.plan=planDelModelo(c.m);S.adapta=cambios?Math.min(3,cambios):1;
    if(!S.usadas.includes(c.f))S.usadas.push(c.f);
    tmp.feed.unshift({txt:t3(`Ajuste de estructura: ${cambios} principios en adaptación; conservás tu aprendizaje.`,`Ajuste: ${cambios} princípios em adaptação.`,`Structural adjustment: ${cambios} principles adapting; previous learning is retained.`),c:'e',les:[]});
  }
  tmp.selBanco=null;tmp.pausa=false;tmp.saltar=false;pintarTicker();ir('temporada');setTimeout(tickerSiguiente,300);
};
const _partidoGrandeV9=partidoGrande;
partidoGrande=function(jor){if(S.ritmo==='rapido')return null;return _partidoGrandeV9(jor);};
const _pintarPreviaV9=pintarPrevia;
pintarPrevia=function(){
  _pintarPreviaV9();const root=$('#s-partido');
  root.insertAdjacentHTML('afterbegin',`<div class="huella-idea"><b>${t3('Ajustás el partido. Sostenés una idea.','Ajuste o jogo. Mantenha a ideia.','Adjust the match. Keep your identity.')}</b><span>${escapeHTML(lecturaIdentidad())}</span></div>`);
  root.insertAdjacentHTML('beforeend',`<div class="via-rapida"><button class="btn sec" onclick="simularDestacado()">${t3('Camino rápido: simular con mi plan','Caminho rápido: simular com meu plano','Fast route: simulate with my plan')}</button><p class="nota-dato">${t3('Se conservan el once, el modelo y los automatismos. No se agrega azar extra.','Mantém o onze, o modelo e os automatismos. Sem azar extra.','Same XI, model and learning. No extra random modifier.')}</p></div>`);
  // No se señala la primera opción como recomendación óptima.
  root.querySelectorAll('.pv-pat').forEach(el=>el.classList.remove('ok','mal','med'));
};
function simularDestacado(){
  const V=tmp.vivo;if(!V||V.simulado)return;V.simulado=true;
  const eq=miEquipo(V.info.rival),A=V.info.soyA?eq:V.info.rival,B=V.info.soyA?V.info.rival:eq;
  V.A=A;V.B=B;V.res=jugarPartido(A,B,V.info.neutral,V.info.knock);
  $('#s-partido').innerHTML=`<div class="tapa-breve"><p class="etq">${t3('RESUMEN DEL PARTIDO','RESUMO DO JOGO','MATCH SUMMARY')}</p><h2 class="disp">${escapeHTML(S.club.n)}</h2><div class="marcador-breve">${V.res.ga} — ${V.res.gb}</div><p>${escapeHTML(V.info.titulo)} · ${V.info.soyA?escapeHTML(S.club.n):escapeHTML(V.info.rival.club.n)} / ${V.info.soyA?escapeHTML(V.info.rival.club.n):escapeHTML(S.club.n)}</p>${V.res.pen?`<p>${t3('Penales','Pênaltis','Penalties')}: ${V.res.pen.join('–')}</p>`:''}<p>${t3('Jugó tu plan de base. La próxima intervención sigue siendo tuya.','Seu plano de base jogou.','Your base plan played out. The next intervention is yours.')}</p><button class="btn" onclick="cerrarVivo()">${T('seguir')}</button></div>`;
}
const _pintarVivoV9=pintarVivo;
pintarVivo=function(){_pintarVivoV9();const c=document.querySelector('#s-partido .vivo-cab');if(c)c.insertAdjacentHTML('beforeend',`<button class="btn sec compacto" onclick="tmp.vivo.rapido=!tmp.vivo.rapido;this.textContent=tmp.vivo.rapido?'×10':'×1'">×1</button>`);};
const _pintarEntretiempoV9=pintarEntretiempo;
pintarEntretiempo=function(peligro,fuerte){
  _pintarEntretiempoV9(peligro,fuerte);const root=document.getElementById('vvPanel');if(!root)return;
  const aviso=root.querySelector('.alerta.mal');if(aviso)aviso.textContent=t3('Su banco vio tus ataques del primer tiempo. Observá si cambian marcas y coberturas: su próxima orden todavía no la conocés.','O banco deles viu seus ataques. Observe marcas e coberturas; a próxima ordem ainda é desconhecida.','Their bench saw your first-half attacks. Watch marking and cover: you do not know their next order.');
  root.insertAdjacentHTML('afterbegin',`<div class="huella-idea"><b>${t3('Una corrección, no otra identidad','Uma correção, não outra identidade','A correction, not a new identity')}</b><span>${lecturaIdentidad()}</span></div>`);
};
const _analisisVivoV9=analisisVivo;
analisisVivo=function(gf,gc){
  const V=tmp.vivo, yo=soyLado(), el=yo==='a'?'b':'a';
  const carril=l=>[0,1,2].map(c=>V.ev.filter(e=>e.l===l&&(e.t==='gol'||e.t==='llegada')&&(e.zona-1)%3===c).length);
  const m=carril(yo),r=carril(el).reverse(), nombres=[t3('izquierda','esquerda','left'),t3('centro','meio','middle'),t3('derecha','direita','right')];
  const mejor=m.indexOf(Math.max(...m)), peor=r.indexOf(Math.max(...r));
  const registro=m.some(Boolean)||r.some(Boolean)?`${t3('Tus llegadas por','Suas chegadas por','Your attacks down')} ${nombres[mejor]}: ${m[mejor]}. ${t3('Las de ellos por','As deles por','Their attacks down')} ${nombres[peor]}: ${r[peor]}.`:t3('No hay llegadas registradas para atribuir un carril dominante.','Sem chegadas registradas para apontar um setor dominante.','No recorded attacks from which to infer a dominant channel.');
  return `<p>${t3('Tu modelo siguió en cancha. Las órdenes cambiaron énfasis y riesgos.','Seu modelo seguiu em campo; as ordens mudaram os riscos.','Your model stayed on the pitch; orders changed focus and risk.')}</p><p>${registro}</p><details><summary>${t3('Ver los hechos del partido','Ver os fatos do jogo','See match events')}</summary>${_analisisVivoV9(gf,gc)}</details>`;
};
// Perfiles psicológicos con decisiones previas a la tanda. Nunca certeza.
const _pPenalV9=pPenal;
pPenal=function(o,k,por,mio){
  let p=_pPenalV9(o,k,por,mio), P=mio&&tmp.vivo&&tmp.vivo.pen;
  if(P&&P.fase==='tanda'){
    const tm=P.tiros.filter(x=>x.l==='yo').length,ts=P.tiros.filter(x=>x.l==='el').length;
    const eliminar=tm>=4&&P.mis<P.sus&&P.sus-P.mis>=5-tm;
    const nervioso=caracter(o.jug)==='nervioso'||caracter(o.jug)==='calenton';
    if(eliminar)p-=nervioso?0.065:rodaje(o.jug)>=4?0.005:0.025;
    if(P.rutina==='guiar')p+=nervioso?0.025:-0.01;
    if(P.rutina==='confiar')p+=nervioso?-0.015:0.015;
  }
  return clamp(p,0.28,0.94);
};
const _pintarPenalesV9=pintarPenales;
pintarPenales=function(){
  _pintarPenalesV9();const P=tmp.vivo.pen,root=document.querySelector('#vvPanel .penales');if(!root||P.fase!=='elegir')return;
  root.insertAdjacentHTML('beforeend',`<div class="rutina-penales"><p>${t3('Antes de la tanda: ¿cómo acompañás?','Antes da disputa: como acompanhar?','Before the shoot-out: how do you support them?')}</p><button class="pill ${P.rutina==='guiar'?'on':''}" onclick="tmp.vivo.pen.rutina='guiar';pintarPenales()">${t3('Recordar una rutina breve','Lembrar uma rotina curta','Remind them of a short routine')}</button><button class="pill ${P.rutina==='confiar'?'on':''}" onclick="tmp.vivo.pen.rutina='confiar';pintarPenales()">${t3('Confiar y no sobreexplicar','Confiar, sem explicar demais','Trust them; do not over-explain')}</button><p class="nota-dato">${t3('Al nervioso puede ayudarlo una referencia. Al experimentado, sobrecargarlo puede trabarlo. El orden, el cansancio y el momento pesan; ninguna pista asegura el gol.','O estado, o cansaço e o momento pesam. Nenhuma pista garante gol.','State, fatigue and the moment matter. No cue guarantees a goal.')}</p></div>`);
};
const _pintarReporteV9=pintarReporte;
pintarReporte=function(){
  _pintarReporteV9();const root=$('#s-resolucion'),dt=S.calc,log=(S.diarioDT||[]).filter(e=>e.t===S.temporada), charla=log.filter(e=>e.tipo==='charla').slice(-1)[0];
  root.classList.add('tapa-temporada');
  const titulo=dt.titulos.length?t3('EL BARRIO TIENE<br>ALGO QUE CONTAR.','O BAIRRO TEM<br>UMA HISTÓRIA.','A STORY FOR<br>THE NEIGHBOURHOOD.'):dt.pts>=6?t3('LA IDEA<br>DEJÓ HUELLA.','A IDEIA<br>DEIXOU MARCA.','YOUR IDEA<br>LEFT A MARK.'):t3('HAY QUE<br>VOLVER A TRABAJAR.','É HORA DE<br>VOLTAR AO TRABALHO.','BACK TO<br>WORK.');
  const tapa=document.createElement('div');tapa.className='tapa-cabecera';tapa.innerHTML=`<div class="tapa-edicion">${t3('LA TAPA DEL LUNES','A CAPA DE SEGUNDA','MONDAY’S FRONT PAGE')}</div><p class="etq">${escapeHTML(S.club.n)} · ${t3('TEMPORADA','TEMPORADA','SEASON')} ${S.temporada}</p><h2 class="disp">${titulo}</h2><div class="firma-dt">${retratoDT(78)}<div><b>${escapeHTML(S.nombre||'DT')} · ${edadDT()} ${T('anios')}</b><p>${lecturaIdentidad()}</p></div></div><p>${charla?t3(`El vestuario recuerda tu charla contra ${charla.rival}. Efecto en confianza: ${sg(charla.efecto)}.`,`O grupo lembra a conversa contra ${charla.rival}.`,`The dressing room remembers your talk before ${charla.rival}.`):t3('Tu equipo jugó desde lo entrenado. El resultado no explica todo.','Seu time jogou a ideia treinada.','Your team played the trained idea. The result does not explain everything.')}</p></div>`;root.insertBefore(tapa,root.firstChild);
  // Los detalles siguen accesibles, sin exigir leerlos antes del cierre.
  const detalle=document.createElement('details');detalle.className='detalle-temporada';detalle.innerHTML=`<summary>${t3('Tabla, figuras y análisis completo','Tabela, destaques e análise','Table, standouts and full analysis')}</summary>`;
  const acciones=root.querySelector('.acciones');
  [...root.children].filter(el=>el!==tapa&&el!==acciones).forEach(el=>detalle.appendChild(el));root.insertBefore(detalle,acciones||null);
};
const _finalV9=final;
final=function(){_finalV9();const root=$('#s-final');root.insertAdjacentHTML('afterbegin',`<div class="firma-dt">${retratoDT(110)}<div><b>${escapeHTML(S.nombre||'DT')} · ${edadDT()} ${T('anios')}</b><p>${t3('El tiempo también quedó en la cara.','O tempo também ficou no rosto.','Time left its mark on your face too.')}</p></div></div>`);};
// Sin saltos de azar por leer una explicación ni moralejas que inventen eventos.
const _finTemporadaV9=finTemporada;
finTemporada=function(){_finTemporadaV9();if(S.presionPromesa){S.vars.dir=clamp(S.vars.dir-(S.calc.pts<4?S.presionPromesa:0),0,100);S.presionPromesa=0;pintarReporte();cabecera();}};
porqueFit=function(e,f){return t3('El sistema es un punto de partida. Los roles, los cuatro momentos y el plantel determinan cómo puede jugar.','O sistema é um ponto de partida: funções, momentos e elenco definem o jogo.','The formation is a starting point. Roles, phases and the squad determine how it plays.');};
