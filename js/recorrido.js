// v13 — Un puesto se solicita, una idea se explica y los compromisos se revisan.
// El origen del DT es narrativo: nunca entra en la evaluación ni en el motor.
const COMPROMISOS_DT={
 proceso:{n:['Sostener un proceso','Manter um processo','Build a process'],d:['Evaluaremos lo que el equipo aprende, además del resultado.','Avaliaremos a aprendizagem, além do resultado.','We will review learning as well as results.']},
 cantera:{n:['Dar oportunidades a los jóvenes','Dar espaço aos jovens','Give young players opportunities'],d:['Al menos dos menores de 24 años deberán participar en cuatro partidos esta temporada.','Dois jogadores abaixo de 24 anos devem jogar quatro partidas.','Two players under 24 must play at least four matches this season.']},
 resultados:{n:['Priorizar resultados inmediatos','Priorizar resultados','Prioritise immediate results'],d:['La directiva espera al menos 7 puntos de carrera en el balance de temporada.','A diretoria espera 7 pontos de carreira na temporada.','The board expects at least 7 career points in the season review.']}
};
function textoCompromiso(k){return t3(...COMPROMISOS_DT[k].n);}
pintarIdentidad=function(){
 $('#s-identidad').innerHTML=`<p class="etq">${t3('EL PRIMER PASO','O PRIMEIRO PASSO','THE FIRST STEP')}</p><h2 class="disp">${t3('Tu carrera empieza con vos.','Sua carreira começa com você.','Your career starts with you.')}</h2><div class="gd-form"><label>${T('tuApellido')}<input id="nom" maxlength="24" value="${escapeHTML(S.nombre)}" oninput="guardarNom()"></label><label>${t3('Edad al empezar','Idade inicial','Starting age')}<input id="edad-dt" type="number" min="25" max="65" value="${S.edadInicio||35}" onchange="S.edadInicio=clamp(Number(this.value)||35,25,65)"></label><label>${t3('El club al que soñás llegar','O clube dos seus sonhos','Your dream club')}<select id="hincha" onchange="tmp.hincha=this.value">${PAISES.map(p=>`<optgroup label="${p}">${LIGAS[p].clubes.map(c=>`<option ${c.n===tmp.hincha?'selected':''}>${escapeHTML(c.n)}</option>`).join('')}</optgroup>`).join('')}</select></label><label>${T('duracion')}<select onchange="tmp.modo=this.value">${MODOS.map(m=>`<option value="${m.id}" ${tmp.modo===m.id?'selected':''}>${tModo(m,'n')} · ${m.temporadas}</option>`).join('')}</select></label><label>${t3('Los partidos importantes','Os jogos importantes','Important matches')}<select onchange="S.ritmo=this.value"><option value="elegir">${t3('Elegir entre dirigir o simular','Escolher dirigir ou simular','Choose coaching or simulation')}</option><option value="rapido" ${S.ritmo==='rapido'?'selected':''}>${t3('Simular con mi plan','Simular com meu plano','Simulate with my plan')}</option></select></label></div><label class="cine-retrato-opcion"><input type="checkbox" ${S.mostrarRetratoDT?'checked':''} onchange="S.mostrarRetratoDT=this.checked">${t3('Mostrar retrato del DT','Mostrar retrato do técnico','Show coach portrait')}</label><div class="acciones"><button class="btn" onclick="buscarVacantes()">${t3('Buscar vacantes','Buscar vagas','Find vacancies')} →</button><button class="btn sec" onclick="portada()">${T('volver')}</button></div>`;
};
function buscarVacantes(){
 guardarNom();S.nombre=S.nombre.trim()||'DT';S.edadInicio=clamp(Number($('#edad-dt').value)||35,25,65);
 S.modo=MODOS.find(m=>m.id===tmp.modo)||MODOS[1];S.temporadasTotal=S.modo.temporadas;
 S.clubHincha=CLUBES.find(c=>c.n===tmp.hincha)||null;
 verOfertas();
}
pintarOfertas=function(){
 $('#s-ofertas').innerHTML=`<p class="etq">${t3('BOLSA DE TRABAJO','VAGAS','JOB BOARD')}</p><h2 class="disp">${t3('Hay un banco vacante.','Há um banco vago.','A place on the touchline.')}</h2><p>${t3('Mandá tu currículum. El proyecto y las condiciones se conversan en la entrevista.','Envie seu currículo. O projeto será discutido na entrevista.','Send your CV. Discuss the project and conditions at the interview.')}</p>${S.ofertas.map((o,i)=>`<article class="gd-vacante" style="${estiloInterior(o.club)}">${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}<p>${L(o.txt)}</p><button class="btn" onclick="enviarCV(${i})">${t3('Enviar currículum','Enviar currículo','Send CV')}</button></article>`).join('')}${S.reOfertas>0?`<button class="btn sec" onclick="otrasOfertas()">${t3('Consultar otras vacantes (una vez)','Ver outras vagas (uma vez)','See other vacancies (once)')}</button>`:''}`;ir('ofertas');
};
function enviarCV(i){
 const o=S.ofertas[i];if(!o)return;S.candidatura={i,club:o.club.n,origen:'',experiencia:'',compromiso:o.div<3?'cantera':'proceso'};
 $('#s-ofertas').innerHTML=`${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}<h2 class="disp">${t3('Te llaman para conocerte.','Querem conhecer você.','They want to meet you.')}</h2><p>${t3('Recibimos tu currículum. Queremos escuchar cómo trabajarías con este plantel antes de ofrecerte el cargo.','Recebemos seu currículo. Queremos ouvir seu projeto.','We received your CV. We want to hear your plans before offering you the job.')}</p><button class="btn" onclick="entrevistaDT()">${t3('Ir a la entrevista','Ir à entrevista','Attend interview')}</button><button class="btn sec" onclick="pintarOfertas()">${T('volver')}</button>`;
}
function entrevistaDT(){
 const c=S.candidatura,o=S.ofertas[c.i];
 $('#s-ofertas').innerHTML=`${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}<p class="etq">${t3('ENTREVISTA · QUIÉN SOS','ENTREVISTA · QUEM É VOCÊ','INTERVIEW · WHO YOU ARE')}</p><h2 class="disp">${t3('Contanos de dónde venís.','Conte de onde você vem.','Tell us your story.')}</h2><div class="gd-form"><label>${t3('Tu origen, con tus palabras (opcional)','Sua origem (opcional)','Your background (optional)')}<textarea maxlength="500" oninput="S.candidatura.origen=this.value">${escapeHTML(c.origen)}</textarea></label><label>${t3('Tu experiencia previa (opcional)','Sua experiência (opcional)','Your experience (optional)')}<textarea maxlength="500" oninput="S.candidatura.experiencia=this.value">${escapeHTML(c.experiencia)}</textarea></label></div><p class="nota-dato">${t3('Tu historia no suma ni resta capacidad. Acá importan el trabajo y los compromisos que asumís.','Sua origem não define sua capacidade.','Your background does not determine your ability.')}</p><h3>${T('tuPerfil')}</h3><div class="arq-tiles">${ARQ.map(a=>`<button class="arq ${tmp.arq===a.id?'sel':''}" onclick="tmp.arq='${a.id}';entrevistaDT()"><b>${nArq(a)}</b><span>${L(TAGLINE[a.id])}</span></button>`).join('')}</div><label>${t3('¿Qué te comprometés a construir?','Qual é seu compromisso?','What will you commit to?')}<select onchange="S.candidatura.compromiso=this.value;entrevistaDT()">${Object.keys(COMPROMISOS_DT).map(k=>`<option value="${k}" ${c.compromiso===k?'selected':''}>${textoCompromiso(k)}</option>`).join('')}</select></label><p>${t3(...COMPROMISOS_DT[c.compromiso].d)}</p><div class="acciones"><button class="btn" ${tmp.arq?'':'disabled'} onclick="ideaEntrevista()">${t3('Explicar mi idea de juego','Explicar minha ideia','Explain my playing philosophy')}</button><button class="btn sec" onclick="pintarOfertas()">${T('volver')}</button></div>`;ir('ofertas');
}
function ideaEntrevista(){S.arq=ARQ.find(a=>a.id===tmp.arq);tmp.f=tmp.f||'4-3-3';tmp.m=tmp.m||modeloDeEstilo('Posesion');tmp.e=estiloDeModelo(tmp.m);pintarIdea();ir('idea');}
const _ideaRecorrido=pintarIdea;
pintarIdea=function(){_ideaRecorrido();if(!S.candidatura)return;const root=$('#s-idea');root.querySelector('.etq').textContent=t3('ENTREVISTA · TU PROPUESTA','ENTREVISTA · SUA PROPOSTA','INTERVIEW · YOUR PROPOSAL');root.querySelector('.acciones').innerHTML=`<button class="btn" onclick="confirmarIdea()">${t3('Presentar propuesta','Apresentar proposta','Submit proposal')}</button><button class="btn sec" onclick="entrevistaDT()">${T('volver')}</button>`;};
confirmarIdea=function(){
 S.sistemaPref=tmp.f;S.estiloPref=tmp.e;S.modelo=copiaModelo(tmp.m);S.modeloPref=copiaModelo(tmp.m);S.auto=30;S.autoPar=tmp.f+'|'+tmp.e;prepararIdentidadDT();
 if(!S.candidatura){verOfertas();return;}
 const o=S.ofertas[S.candidatura.i];S.candidatura.aprobada=true;
 $('#s-ofertas').innerHTML=`${bannerClub(o.club,{badges:badgesClub(o.club,o.div)})}<h2 class="disp">${t3('El proyecto queda por escrito.','O projeto fica registrado.','The project is on record.')}</h2><p>${escapeHTML(S.nombre)} · ${tmp.f} · ${tEstilo(tmp.e)}</p><h3>${textoCompromiso(S.candidatura.compromiso)}</h3><p>${t3(...COMPROMISOS_DT[S.candidatura.compromiso].d)}</p><p>${t3('No te pedimos que adivines resultados. Te vamos a evaluar por este compromiso al cerrar cada temporada.','Vamos avaliar este compromisso a cada temporada.','We will review this commitment at the end of each season.')}</p><div class="acciones"><button class="btn" onclick="firmarProyecto()">${t3('Aceptar y firmar','Aceitar e assinar','Accept and sign')}</button><button class="btn sec" onclick="entrevistaDT()">${t3('Revisar condiciones','Rever condições','Review terms')}</button></div>`;ir('ofertas');
};
function firmarProyecto(){if(!S.candidatura||!S.candidatura.aprobada||S.club)return;S.compromisoDT={club:S.candidatura.club,tipo:S.candidatura.compromiso};S.biografiaDT={origen:S.candidatura.origen,experiencia:S.candidatura.experiencia};firmarClub(S.ofertas[S.candidatura.i]);}
function vinculoJugador(j){
 if(!j.vinculoDT||j.vinculoDT.club!==S.club.n)j.vinculoDT={club:S.club.n,confianza:50,conviccion:40,rol:30,satisfaccion:50};
 return j.vinculoDT;
}
necesitaIdioma=function(){return S.langClub!==S.club.n;};
pantallaIdioma=function(sigue){
 window.__sigueIdioma=sigue;const sug=IDIOMA_REAL[S.club.p]||IDIOMA;
 $('#s-club').innerHTML=`${bannerClub(S.club,{tam:48})}<h2 class="disp">${t3('El idioma del vestuario','O idioma do vestiário','The dressing-room language')}</h2><p>${t3('Elegí cómo vas a comunicarte con el plantel. El idioma de los menús se mantiene.','Escolha como se comunicar. O idioma dos menus não muda.','Choose how to communicate with the squad. The menu language stays the same.')}</p><button class="card" onclick="elegirIdiomaClub(true)"><b>${t3('Trabajar en','Trabalhar em','Work in')} ${nombreIdioma(sug)}</b><span>${t3('Ensayar las consignas en el idioma habitual del grupo.','Ensaiar instruções no idioma do grupo.','Rehearse instructions in the squad’s usual language.')}</span></button><button class="card" onclick="elegirIdiomaClub(false)"><b>${t3('Trabajar con apoyo de un intérprete','Trabalhar com intérprete','Work with an interpreter')}</b><span>${t3('Preparar juntos las consignas y comprobar que se entendieron.','Preparar instruções e conferir a compreensão.','Prepare instructions together and check understanding.')}</span></button>`;ir('club');
};
elegirIdiomaClub=function(adapta){S.langClub=S.club.n;S.idiomaVestuario={idioma:IDIOMA_REAL[S.club.p]||IDIOMA,interprete:!adapta};const f=window.__sigueIdioma;window.__sigueIdioma=null;if(f)f();};
colaPrevia=function(){
 if(S.introVisto!==S.club.n){introClub(colaPrevia);return;}
 if(necesitaIdioma()){pantallaIdioma(colaPrevia);return;}
 const grupo=S.club.n+'|'+S.division;
 if(S.presentadoGrupo!==grupo){presentacionPlantel();return;}
 if(necesitaPrensa()){pantallaPrensa(colaPrevia);return;}
 if(S.division===3&&S.club.niv>=3&&S.prensaTemporada!==S.temporada){abrirConferencia();return;}
 verPlantel();
};
function presentacionPlantel(){
 $('#s-club').innerHTML=`${bannerClub(S.club,{badges:badgesClub(S.club,S.division)})}<p class="etq">${t3('PRIMER ENCUENTRO','PRIMEIRO ENCONTRO','FIRST MEETING')}</p><h2 class="disp">${t3('Ahora te escucha el plantel.','Agora o grupo escuta você.','Now the squad is listening.')}</h2><p>${t3('Todavía no te conocen. Explicá cómo vas a trabajar: la confianza se construye después con tus decisiones.','Ainda não conhecem você. Explique como vai trabalhar.','They do not know you yet. Explain how you will work; trust comes from your decisions.')}</p><label>${t3('Tu presentación','Sua apresentação','Your introduction')}<textarea id="presentacion-dt" maxlength="1200" placeholder="${t3('Quién sos, qué les pedís y qué pueden esperar de vos…','Quem é você e o que espera…','Who you are and what they can expect…')}"></textarea></label><label>${t3('Tu primer compromiso con el grupo','Seu primeiro compromisso','Your first commitment')}<select id="compromiso-grupo"><option value="escuchar">${t3('Escuchar antes de decidir','Ouvir antes de decidir','Listen before deciding')}</option><option value="roles">${t3('Explicar una tarea a cada uno','Explicar cada função','Explain each player’s task')}</option><option value="competir">${t3('Ganarse el puesto cada semana','Disputar a vaga toda semana','Earn a place every week')}</option></select></label><button class="btn" onclick="presentarmeAlPlantel()">${t3('Presentarme','Apresentar-me','Introduce myself')}</button>`;ir('club');
}
const _introRecorrido=introClub;
introClub=function(sigue){
 if(S.division===3||S.esSeleccion){_introRecorrido(sigue);return;}
 window.__sigueIntro=sigue;S.introVisto=S.club.n;
 $('#s-club').innerHTML=`${bannerClub(S.club,{badges:badgesClub(S.club,S.division)})}<h2 class="disp">${t3('El primer equipo son estos pibes.','Seu primeiro time são estes garotos.','These youngsters are your first team.')}</h2><p>${tDiv(DIVISIONES[S.division].n)} · ${t3('Formación antes que exposición','Formação antes da exposição','Development before exposure')}</p><p>${t3('Vas a coordinar con los entrenadores de base y las familias. La tarea es enseñar, dar oportunidades y preparar el paso a la categoría siguiente. No hay conferencia profesional al llegar.','Vai coordenar com a base e as famílias. Ensinar e preparar a próxima etapa, sem coletiva profissional.','Work with academy coaches and families. Teach, give opportunities and prepare the next step; there is no professional press conference on arrival.')}</p><div class="acciones"><button class="btn" onclick="const f=window.__sigueIntro;window.__sigueIntro=null;f&&f()">${t3('Conocer al grupo','Conhecer o grupo','Meet the squad')}</button></div>`;ir('club');
};
function presentarmeAlPlantel(){
 const grupo=S.club.n+'|'+S.division;if(S.presentadoGrupo===grupo)return;
 const tipo=$('#compromiso-grupo').value,texto=$('#presentacion-dt').value.trim();
 S.presentadoGrupo=grupo;S.compromisoGrupo=tipo;prepararIdentidadDT();
 S.plantel.forEach(j=>{const v=vinculoJugador(j);if(tipo==='escuchar')v.confianza+=3;if(tipo==='roles')v.rol+=5;if(tipo==='competir')v.satisfaccion+=disponible(j)?2:0;});
 S.diarioDT.push({t:S.temporada,tipo:'presentacion',club:S.club.n,texto,compromiso:tipo});colaPrevia();
}
const _fichaRecorrido=fichaJugadorInterior;
fichaJugadorInterior=function(j){if(!j)return '';const v=vinculoJugador(j);return _fichaRecorrido(j)+`<div class="gd-vinculos">${[['confianza','Confianza en vos','Confiança em você','Trust in you'],['conviccion','Convicción en la idea','Convicção na ideia','Belief in the philosophy'],['rol','Comprensión de la tarea','Compreensão da função','Role understanding'],['satisfaccion','Conformidad con sus minutos','Satisfação com minutos','Playing-time satisfaction']].map(([k,...n])=>`<label>${t3(...n)}<meter min="0" max="100" value="${v[k]}">${v[k]}</meter><span>${Math.round(v[k])}/100</span></label>`).join('')}</div>`;};
function evaluarCompromisoDT(){
 const c=S.compromisoDT;if(!c||c.club!==S.club.n||c.evaluada===S.temporada)return null;
 c.evaluada=S.temporada;
 const cumple=c.tipo==='cantera'?S.plantel.filter(j=>j.ed<24&&(j.st?.pj||0)>=4).length>=2:c.tipo==='resultados'?(S.calc?.pts||0)>=7:automatismosDe(S.modelo)>=40;
 const delta=cumple?3:-4;S.vars.dir=clamp(S.vars.dir+delta,0,100);S.diarioDT.push({t:S.temporada,tipo:'compromiso',club:S.club.n,compromiso:c.tipo,cumple,efecto:delta});return {cumple,delta};
}
const _cierreRecorrido=aplicarCierre;
aplicarCierre=function(res){_cierreRecorrido(res);evaluarCompromisoDT();S.plantel.forEach(j=>{const v=vinculoJugador(j),pj=j.st?.pj||0;v.conviccion=clamp(v.conviccion+(res.pts>=4?3:-2),0,100);v.rol=clamp(v.rol+(pj?4:1),0,100);v.satisfaccion=clamp(v.satisfaccion+(pj>=4?3:-3),0,100);});};
const _reporteRecorrido=pintarReporte;
pintarReporte=function(){_reporteRecorrido();const c=(S.diarioDT||[]).slice().reverse().find(x=>x.tipo==='compromiso'&&x.t===S.temporada&&x.club===S.club.n);if(c)$('#s-resolucion').insertAdjacentHTML('afterbegin',`<div class="huella-idea"><b>${t3('Lo que acordaste en la entrevista','O compromisso da entrevista','Your interview commitment')}: ${textoCompromiso(c.compromiso)}</b><p>${c.cumple?t3('Cumplido.','Cumprido.','Met.'):t3('No se cumplió esta temporada.','Não foi cumprido nesta temporada.','Not met this season.')} ${t3('Confianza de la directiva','Confiança da diretoria','Board confidence')} ${sg(c.efecto)}.</p></div>`);};
