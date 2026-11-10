// v13 — Puestos, construcción organizada y memoria de la trayectoria.
posDe=function(j){
 if(!j.real)return _posDeV9(j);
 const ver=POS_VERIFICADAS[j.nom];
 if(ver){j.posVerificada=true;j.pos=ver.slice();return j.pos;}
 // La base original sólo trae sectores. El puesto de trabajo de la simulación
 // se etiqueta como provisional, nunca como un dato biográfico verificado.
 j.posVerificada=false;
 if(!j.puestoSimulado){const lista=Object.keys(ROL).filter(k=>ROL[k].g===j.g);j.puestoSimulado=j.pos&&j.pos.length<lista.length?j.pos[0]:(POS_GRUPO[j.g]||['MC'])[hashTxt(j.nom)%(POS_GRUPO[j.g]||['MC']).length];}
 return [j.puestoSimulado];
};
posTxt=function(j){const p=posDe(j);return p.map(tRol).join(' / ')+(j.real&&!j.posVerificada?' · '+t3('puesto provisional','função provisória','provisional role'):'');};
const _armarOficio=armarOnce;
armarOnce=function(plantel,f,fijos){
 const fija=S.onceFijado;
 if(!fija||fija.club!==S.club?.n||fija.f!==f||!fijos?.length||!plantel.some(j=>S.plantel.includes(j)))return _armarOficio(plantel,f,fijos);
 const reservados=fija.puestos.map(n=>plantel.find(j=>j.nom===n&&disponible(j))),usados=new Set();
 const resultado=ONCE[f].map((sl,i)=>{
   const jug=reservados[i];if(!jug||usados.has(jug))return null;usados.add(jug);
   const n=encaje(jug,sl[0]);return {rol:sl[0],x:sl[1],y:sl[2],jug,rt:Math.max(28,jug.rt-AJUSTE_ENC[n]),adapta:n===2,fuera:n===3};
 });
 // Cubrir bajas sin mover las asignaciones explícitas que siguen disponibles.
 resultado.forEach((o,i)=>{if(o)return;const sl=ONCE[f][i],pool=plantel.filter(j=>!usados.has(j)).sort((a,b)=>(b.rt-AJUSTE_ENC[encaje(b,sl[0])])-(a.rt-AJUSTE_ENC[encaje(a,sl[0])]));const jug=pool[0];usados.add(jug);const n=encaje(jug,sl[0]);resultado[i]={rol:sl[0],x:sl[1],y:sl[2],jug,rt:Math.max(28,jug.rt-AJUSTE_ENC[n]),adapta:n===2,fuera:n===3};});
 return resultado;
};
reemplazar=function(i){
 const jug=tmp.selBanco,once=window.__once;if(!jug||!disponible(jug)||!once?.[i])return;
 const f=tmp.cambio?.f||S.formacion||S.sistemaPref,slot=once[i],n=encaje(jug,slot.rol);
 if(n>=2){const aviso=$('#avisoCambio');aviso.textContent=t3(`${jug.nom}: ${posTxt(jug)}. No tiene acreditado el puesto ${tRol(slot.rol)}. Elegí un puesto compatible o cambiá el sistema.`,`${jug.nom}: função incompatível. Mude o sistema ou escolha outra vaga.`,`${jug.nom}: incompatible role. Change the formation or choose a compatible slot.`);return;}
 const puestos=once.map(o=>o.jug.nom);puestos[i]=jug.nom;
 S.onceFijado={club:S.club.n,f,puestos};S.fijos=puestos.map(n=>S.plantel.find(j=>j.nom===n)).filter(Boolean);tmp.selBanco=null;tmp.vistaJugador=jug;window[window.__rep]();
};
const _canchaOficio=canchaGestion;
canchaGestion=function(once){
 // El render anterior marcaba toda una línea como compatible. Se usa la
 // misma regla de puesto que la sustitución, sin cambiar los datos del jugador.
 return _canchaOficio(once).replace(/Las fichas marcadas cubren su sector\./g,'Sólo se aceptan puestos compatibles.');
};

const CONSTRUCCION_DT={
 pivot:['Bajar el 5 a la primera línea','Baixar o volante','Drop the holding midfielder'],
 enlace:['Sostener al 5 detrás de la presión','Manter o volante atrás da pressão','Keep the pivot behind the press'],
 tercero:['Encontrar al tercer hombre','Encontrar o terceiro homem','Find the third player'],
 directo:['Superar la presión con pase largo','Superar a pressão com passe longo','Bypass the press with a long pass']
};
function planConstruccion(){return S.construccion||{salida:(S.modelo||S.modeloPref)?.ofe==='directo'?'directo':'pivot',anchura:'abierta',cobertura:'equilibrio'};}
function aprendizajeConstruccion(plan){return S.memoriaConstruccion?.[S.club.n]?.[plan.salida]||12;}
function ejecucionConstruccion(plan,modelo){return Math.round((automatismosDe(modelo)+aprendizajeConstruccion(plan))/2);}
const _jornadaOficio=jugarJornada;
jugarJornada=function(jor){const antes=S.temp?.mis?.length||0,res=_jornadaOficio(jor);if(S.construccion&&(S.temp?.mis?.length||0)>antes){S.memoriaConstruccion=S.memoriaConstruccion||{};const mem=S.memoriaConstruccion[S.club.n]||(S.memoriaConstruccion[S.club.n]={}),k=S.construccion.salida;mem[k]=clamp((mem[k]||12)+2,0,100);}return res;};
function contextoConstruccion(rv){
 const m=rv.modelo||modeloDeEstilo(rv.e),dos=rv.f==='4-4-2'||rv.f==='3-5-2 / 5-3-2';
 return {punta:dos?2:3,alta:m.def==='alto',sigue:m.def==='alto',distancia:m.def==='alto'?12:20,tiempo:m.def==='alto'?1:3};
}
function evaluarConstruccion(plan,rv,aprendizaje,modelo){
 const c=contextoConstruccion(rv);let valor=0,libre=false,relato;
 if(plan.salida==='pivot'){
   libre=c.punta===2&&!c.sigue;valor=libre?.4:-.25;
   relato=libre?t3('El 5 baja sin perseguidor: arquero, centrales y pivote pueden fijar a dos. Si nadie ocupa su espacio por delante, la superioridad queda encerrada atrás.','O volante baixa livre; alguém precisa ocupar o espaço à frente.','The untracked pivot joins the goalkeeper and centre-backs against two. Someone must connect ahead.'):
    t3('El 5 baja pero el rival acompaña o suma un tercer punta. Agregaste un receptor, no un hombre libre. Un interior debe ofrecer el siguiente pase.','O rival acompanha o volante. Falta um apoio à frente.','The opponent follows the pivot or presses with three. An extra receiver is not automatically a free player.');
 }else if(plan.salida==='enlace'){
   libre=!c.alta;valor=c.alta?-.12:.3;relato=t3('El 5 conserva una conexión por delante. Debe salir de la sombra de los puntas y recibir perfilado; si lo tapan, el central necesita conducir para fijar.','O volante conecta à frente, fora da sombra de marcação.','The pivot connects ahead. He must leave the cover shadow and receive side-on; otherwise a centre-back must carry to commit pressure.');
 }else if(plan.salida==='tercero'){
   valor=c.alta?.3:.1;relato=t3('Un interior se acerca, devuelve y libera al tercer hombre. Necesitás distancias cortas, un apoyo de cara y sincronizar la carrera; un pase de más permite que el rival cierre.','Apoio, devolução e terceiro homem exigem sincronização.','A midfielder checks short, sets the ball back and releases a third player. Distances, body shape and timing matter.');
 }else{
   valor=c.alta?.25:-.15;relato=t3('Saltás la primera presión. El punta disputa y los interiores se acercan a la segunda pelota; si quedan lejos, devolvés la posesión.','O atacante disputa e os meias aproximam para a segunda bola.','Bypass the first press. The striker competes and midfielders support the second ball; staying distant hands possession back.');
 }
 if(plan.anchura==='abierta'){valor+=.08;relato+=' '+t3('Laterales abiertos: separan marcas, pero el pase exterior necesita tiempo para llegar.','Laterais abertos separam as marcas.','Wide full-backs stretch markers, but the outside pass needs time.');}
 else {valor+=plan.salida==='tercero'?.1:-.08;relato+=' '+t3('Laterales de apoyo: acortan distancias, pero los extremos deben dar amplitud.','Laterais de apoio; pontas dão amplitude.','Supporting full-backs shorten distances; wingers must provide width.');}
 if(plan.cobertura==='arriesgar'){valor+=.1;relato+=' '+t3('Los dos laterales avanzan: tras pérdida, los centrales quedan expuestos al primer pase.','Ambos laterais sobem: zagueiros expostos na perda.','Both full-backs advance, exposing the centre-backs after a turnover.');}
 else relato+=' '+t3('El lateral opuesto cierra y un interior guarda la espalda: menos receptores arriba, más protección si perdés.','O lateral oposto fecha e um meia protege.','The far full-back tucks in and a midfielder covers: fewer forward receivers, better protection.');
 const afin=modelo.ofe==='directo'?plan.salida==='directo':plan.salida!=='directo';
 // Sólo una pequeña parte del rendimiento: no reemplaza calidad, azar, ADN ni rival.
 return {c,libre,relato,afin,factor:clamp(valor,-.5,.6)*(.015+.025*clamp(aprendizaje,0,100)/100)*(afin?1:.7),riesgo:plan.cobertura==='arriesgar'?.012:0};
}
function esquemaConstruccion(plan,c){
 const pivot=plan.salida==='pivot',f=tmp.f||S.formacion||S.sistemaPref||'4-3-3',slots=ONCE[f];
 const idx5=slots.findIndex(s=>s[0]==='MCD')>=0?slots.findIndex(s=>s[0]==='MCD'):slots.findIndex(s=>s[0]==='MC');
 const nodes=slots.map(([rol,x,y],i)=>{let Y=92-y*.9;if(i===idx5){x=50;Y=pivot?72:48;}if(/^(LT|CA)/.test(rol)){x=x<50?(plan.anchura==='abierta'?8:25):(plan.anchura==='abierta'?92:75);Y=plan.cobertura==='arriesgar'?32:45;}return [siglaRol(rol),x,Y];});
 const puntos=nodes.map(([n,x,y])=>`<g><circle cx="${x*4}" cy="${y*3}" r="15" fill="var(--cine-acento)"/><text x="${x*4}" y="${y*3+5}" text-anchor="middle" fill="var(--cine-tinta)" font-size="14">${n}</text></g>`).join('');
 return `<svg class="gd-esquema" viewBox="0 0 400 300" role="img" aria-label="${t3('Esquema de apoyos en construcción; no son posiciones rastreadas','Esquema de construção','Build-up support diagram, not tracked positions')}"><rect x="5" y="5" width="390" height="290" rx="8" fill="#173b32" stroke="#779189"/><path d="M5 150H395M150 295V250H250V295" stroke="#779189" fill="none"/><path d="M200 264L112 210L200 ${pivot?216:144}L120 72" stroke="#f6f7e8" stroke-width="2" stroke-dasharray="6 6" fill="none"/>${[35,65].concat(c.punta===3?[50]:[]).map(x=>`<rect x="${x*4-12}" y="${c.alta?171:116}" width="24" height="24" fill="#cf7c72"/>`).join('')}${c.sigue&&pivot?'<rect x="208" y="198" width="20" height="20" fill="#cf7c72"/>':''}${puntos}</svg>`;
}
function panelConstruccion(rv,modo){
 if(!rv)return '';const plan=planConstruccion(),m=tmp.m||S.modelo||S.modeloPref,r=evaluarConstruccion(plan,rv,ejecucionConstruccion(plan,m),m);
 return `<details class="gd-construccion" open><summary>${t3('Ataque organizado · construir desde atrás','Ataque organizado · construção','Organised attack · build-up')}</summary><p>${escapeHTML(S.formacion||tmp.f||S.sistemaPref)} / ${escapeHTML(rv.f)} · ${escapeHTML(rv.club.n)}</p><div class="gd-form"><div>${esquemaConstruccion(plan,r.c)}<p class="nota-dato">${t3('Esquema de la tarea, no seguimiento de posiciones reales.','Esquema da tarefa, não rastreamento.','Task diagram, not positional tracking.')}</p></div><div>${[['salida',Object.entries(CONSTRUCCION_DT).map(([k,v])=>[k,t3(...v)]),t3('Principio: progresar con un apoyo libre','Princípio: progredir com apoio livre','Principle: progress through a free support')],['anchura',[['abierta',t3('Laterales abiertos','Laterais abertos','Wide full-backs')],['apoyo',t3('Laterales de apoyo interior','Laterais de apoio interior','Full-backs supporting inside')]],t3('Subprincipio: amplitud y distancias','Subprincípio: amplitude e distâncias','Subprinciple: width and distances')],['cobertura',[['equilibrio',t3('Lateral opuesto + interior cubren','Lateral oposto e meia cobrem','Far full-back and midfielder cover')],['arriesgar',t3('Adelantar ambos laterales','Avançar ambos laterais','Advance both full-backs')]],t3('Subprincipio: protección tras pérdida','Subprincípio: proteção na perda','Subprinciple: protection after losing possession')]].map(([key,ops,label])=>`<label>${label}<select onchange="ajustarConstruccion('${key}',this.value,'${modo}')">${ops.map(([k,n])=>`<option value="${k}" ${plan[key]===k?'selected':''}>${n}</option>`).join('')}</select></label>`).join('')}</div></div><p><b>${t3('Condiciones del ejercicio','Condições do exercício','Scenario conditions')}</b> · ${r.c.punta} ${t3('puntas','atacantes','forwards')} · ${r.c.distancia} m · ${r.c.tiempo} s ${t3('estimados para decidir','estimados para decidir','estimated decision time')}</p><p>${r.relato}</p><p>${t3("Aprendizaje de esta salida","Aprendizagem desta saída","Learning for this build-up")}: ${aprendizajeConstruccion(plan)}/100 · ${t3("Se aprende al jugar y se conserva al volver a usarla.","Aprende jogando e preserva ao voltar.","Learn through matches; previous work remains when you return to it.")}</p><p class="nota-dato">${t3('Las distancias y tiempos representan este escenario del motor, no datos observados. El efecto depende de lo entrenado; una superioridad numérica sola no asegura progresar.','Distâncias e tempos são condições do cenário, não dados observados.','Distances and timings are scenario conditions, not observed data. A numerical overload alone does not guarantee progression.')}</p></details>`;
}
function ajustarConstruccion(k,v,modo){S.construccion={...planConstruccion(),[k]:v};if(modo==='plan')pintarPlan();else if(modo==='descanso')pintarEntretiempo(tmp.vivo.peligroGD,tmp.vivo.fuerteGD);else pintarPrevia();}
const _planOficio=pintarPlan;
pintarPlan=function(){S.construccion={...planConstruccion()};_planOficio();if(tmp.paso>0)return;const salida=$('#s-planteo .plan-base div b');if(salida)salida.textContent=t3(...CONSTRUCCION_DT[S.construccion.salida]);$('#s-planteo .acciones').insertAdjacentHTML('beforebegin',panelConstruccion(S.rivalPlan,'plan'));};
const _previaOficio=pintarPrevia;
pintarPrevia=function(){_previaOficio();$('#s-partido').insertAdjacentHTML('beforeend',panelConstruccion(tmp.vivo.info.rival,'previa'));};
const _descansoOficio=pintarEntretiempo;
pintarEntretiempo=function(peligro,fuerte){tmp.vivo.peligroGD=peligro;tmp.vivo.fuerteGD=fuerte;_descansoOficio(peligro,fuerte);$('#vvPanel .acciones').insertAdjacentHTML('beforebegin',panelConstruccion(tmp.vivo.info.rival,'descanso').replace(' open>','>'));};
// Reemplaza el aporte abstracto de salida cuando está activo este escenario:
// no se suma dos veces ni sigue premiando "baja el 5" si se eligió otro apoyo.
const _planContraOficio=planContra;
planContra=function(plan,yo,el,auto){
 const p=_planContraOficio(plan,yo,el,auto);if(!S.construccion||!plan)return p;
 const r=evaluarConstruccion(S.construccion,el,auto,S.modelo||S.modeloPref||modeloDeEstilo(yo.e));
 p.mult-=.035*p.fases.salida.adv;p.fases.salida={...p.fases.salida,adv:0,detalleConstruccion:r.relato};return p;
};
const _porQueOficio=porQue;
porQue=function(fase,op,v,rivN){return fase==='salida'&&v.detalleConstruccion?v.detalleConstruccion:_porQueOficio(fase,op,v,rivN);};
const _equipoOficio=miEquipo;
miEquipo=function(rv){
 const eq=_equipoOficio(rv);if(S.construccion){const r=evaluarConstruccion(S.construccion,rv,ejecucionConstruccion(S.construccion,S.modelo||S.modeloPref),S.modelo||S.modeloPref);eq.mult*=1+r.factor;eq.construccion=r;}
 const vs=eq.once.map(o=>vinculoJugador(o.jug));eq.coh*=1+vs.reduce((s,v)=>s+(v.confianza+v.conviccion+v.rol-120)/3,0)/Math.max(1,vs.length)/3000;
 const fases=evaluarFasesDT(S.fasesDT,rv,eq.attrs);
 eq.mult*=1+fases.ataque;
 eq.fasesDT=fases;
 return eq;
};
// El riesgo de cobertura mejora también las opciones del adversario, en rápido y vivo.
const _fuerzaOficio=fuerza;
fuerza=function(eq,rv,local){return _fuerzaOficio(eq,rv,local)+(rv.yo?((rv.construccion?.riesgo||0)+(rv.fasesDT?.exposicion||0))*100:0);};

const FASES_DT={
 creacion:{n:'Creación',a:'Abrir por fuera',b:'Combinar por dentro',d:'Abrir estira un bloque bajo; combinar por dentro aprovecha espacios ante presión alta.'},
 finalizacion:{n:'Finalización',a:'Pase atrás al punto penal',b:'Centro al segundo palo',d:'El pase atrás explota el espacio tras desbordar; el centro necesita presencia aérea.'},
 defensa:{n:'Defensa organizada',a:'Cerrar carril central',b:'Saltar sobre el receptor',d:'Cerrar el centro protege ante juego directo; saltar corta apoyos cortos, pero deja espacio detrás.'},
 recuperacion:{n:'Tras recuperar',a:'Atacar el espacio',b:'Asegurar la posesión',d:'Salir rápido castiga líneas altas; asegurar evita regalar la pelota ante un bloque armado.'},
 perdida:{n:'Tras perder',a:'Presionar cerca de la pelota',b:'Replegar detrás de la pelota',d:'Presionar incomoda la salida corta; replegar protege contra un pase directo a la espalda.'}
};
function evaluarFasesDT(plan,rv,attrs=[]){
 const m=rv.modelo||modeloDeEstilo(rv.e),alto=m.def==='alto',bajo=m.def==='bajo',directo=m.ofe==='directo';
 const contexto={creacion:bajo,finalizacion:!bajo,defensa:directo,recuperacion:alto,perdida:!directo};
 let ataque=0,exposicion=0;
 for(const [k,favorA] of Object.entries(contexto)){
  const opcion=plan?.[k];if(opcion!=='a'&&opcion!=='b')continue;
  const encaja=(opcion==='a')===favorA;
  const calidad=clamp((Number(attrs[k==='defensa'||k==='perdida'?0:2])||60)/100,.35,1);
  const efecto=(encaja?.012:-.008)*calidad;
  if(k==='defensa'||k==='perdida')exposicion-=efecto;else ataque+=efecto;
 }
 return {ataque,exposicion,contexto};
}
function panelFasesDT(rv){
 if(!rv)return '';
 const {contexto}=evaluarFasesDT(S.fasesDT,rv);
 return `<details class="gd-construccion"><summary>Otras fases del partido</summary><div class="gd-form">${Object.entries(FASES_DT).map(([k,f])=>`<label><b>${f.n}</b><select onchange="elegirFaseDT('${k}',this.value)"><option value="">Mantener el modelo</option>${['a','b'].map(o=>`<option value="${o}" ${S.fasesDT?.[k]===o?'selected':''}>${f[o]}</option>`).join('')}</select><small>${f.d} Para este rival, el cuerpo técnico sugiere: ${f[contexto[k]?'a':'b']}.</small></label>`).join('')}</div></details>`;
}
function elegirFaseDT(k,v){if(Object.hasOwn(FASES_DT,k)&&['','a','b'].includes(v))S.fasesDT={...S.fasesDT,[k]:v};}
const _planFasesDT=pintarPlan;
pintarPlan=function(){_planFasesDT();if(!(tmp.paso>0))$('#s-planteo .acciones').insertAdjacentHTML('beforebegin',panelFasesDT(S.rivalPlan));};
const _previaFasesDT=pintarPrevia;
pintarPrevia=function(){_previaFasesDT();$('#s-partido').insertAdjacentHTML('beforeend',panelFasesDT(tmp.vivo.info.rival));};
const _descansoFasesDT=pintarEntretiempo;
pintarEntretiempo=function(...args){_descansoFasesDT(...args);$('#vvPanel .acciones').insertAdjacentHTML('beforebegin',panelFasesDT(tmp.vivo.info.rival));};

function asegurarEtapa(){
 S.etapasDT=S.etapasDT||[];let e=S.etapasDT.at(-1);
 if(!e||e.club!==S.club.n||e.salida){e={club:S.club.n,desde:S.temporada,hasta:S.temporada,division:S.division,hin:S.vars.hin,dir:S.vars.dir,ves:S.vars.ves,salida:null};S.etapasDT.push(e);}
 return e;
}
function cerrarEtapa(motivo){const e=asegurarEtapa();Object.assign(e,{hasta:S.temporada,hin:S.vars.hin,dir:S.vars.dir,ves:S.vars.ves,salida:motivo});}
const _abrirEtapa=abrirTemporada;
abrirTemporada=function(){asegurarEtapa();_abrirEtapa();};
const _cierreEtapa=cerrarTemporada;
cerrarTemporada=function(){
 const e=asegurarEtapa();Object.assign(e,{hasta:S.temporada,hin:S.vars.hin,dir:S.vars.dir,ves:S.vars.ves});const despidos=S.despidos;
 _cierreEtapa();if(S.despidos>despidos){e.salida='despido';S.construccion=null;S.compromisoDT=null;S.presentadoGrupo=null;S.prensaElegida=false;S.prensaTemporada=null;}
};
const _ofertaEtapa=aceptarOferta;
aceptarOferta=function(si){if(si){cerrarEtapa('otroclub');S.construccion=null;S.prensaElegida=false;S.prensaTemporada=null;S.presentadoGrupo=null;S.compromisoDT=null;}_ofertaEtapa(si);};
const _seleccionEtapa=tomarSeleccion;
tomarSeleccion=function(si){if(si){cerrarEtapa('seleccion');S.construccion=null;S.presentadoGrupo=null;S.compromisoDT=null;}_seleccionEtapa(si);};
const _finalOficio=final;
final=function(){
 _finalOficio();const etapas=S.etapasDT||[];
 const html=`<div class="gd-etapas"><h3>${t3('Lo que dejaste en cada club','O que deixou em cada clube','What you left at each club')}</h3>${etapas.map(e=>{const c=CLUBES.find(c=>c.n===e.club)||SELECCIONES.find(c=>c.n===e.club),copas=S.titulos.filter(t=>t.club===e.club&&t.t>=e.desde&&t.t<=e.hasta);return `<article class="gd-etapa">${c?escudo(c,48):''}<div><h4>${escapeHTML(e.club)}</h4><p>${t3('Temporadas','Temporadas','Seasons')} ${e.desde}–${e.hasta} · ${copas.length} ${t3('títulos','títulos','titles')}</p><p>${e.salida==='despido'?t3('La directiva terminó el ciclo.','A diretoria encerrou o ciclo.','The board ended your tenure.'):e.salida==='otroclub'?t3('Elegiste continuar en otro club.','Escolheu outro clube.','You chose another club.'):e.salida==='seleccion'?t3('Te fuiste a dirigir una selección.','Foi dirigir uma seleção.','You left for a national team.'):t3('El ciclo sigue abierto.','O ciclo continua aberto.','This chapter remains open.')}</p><p>${t3('Vínculo con la hinchada al cierre','Vínculo com a torcida ao sair','Relationship with fans at departure')}: ${e.hin>=70?t3('muy querido','muito querido','much loved'):e.hin>=45?t3('respeto con matices','respeito com ressalvas','mixed respect'):t3('relación desgastada','relação desgastada','strained relationship')} (${Math.round(e.hin)}/100)</p>${copas.map(t=>`<span class="gd-titulo">${trofeo(t.tipo||'liga',26)} ${escapeHTML(t.comp)}</span>`).join('')}</div></article>`;}).join('')}${!etapas.length?`<p>${t3('Esta partida anterior no registró vínculos al salir. El historial de temporadas conserva sus resultados.','Esta partida antiga não registrou vínculos ao sair.','This older save did not record departure relationships; season results remain in its history.')}</p>`:''}</div>`;
 $('#s-final').insertAdjacentHTML('beforeend',html);
};
