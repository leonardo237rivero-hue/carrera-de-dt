// v11 — componentes visuales conectados a la partida. Ningún dato de los bocetos.
// Dibujar una pantalla no consume RNG ni modifica las reglas de simulación.
function colorInterior(hex){
  let h=String(hex||'').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');
  return /^[0-9a-f]{6}$/i.test(h)?'#'+h:'#193b35';
}
function luminanciaInterior(hex){
  const h=colorInterior(hex).slice(1),v=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4));
  return v[0]*.2126+v[1]*.7152+v[2]*.0722;
}
function paletaInterior(club){
  const c=(club&&club.c||['#193b35','#eadfc7']).map(colorInterior),l=luminanciaInterior(c[0]);
  // Fondo principal fiel al club; tinta accesible calculada, no asumida.
  const texto=l>.179?'#000000':'#ffffff';
  let acento=c.slice().sort((a,b)=>luminanciaInterior(a)-luminanciaInterior(b))[0];
  while((luminanciaInterior('#f3eddf')+.05)/(luminanciaInterior(acento)+.05)<4.5){
    acento='#'+acento.slice(1).match(/../g).map(x=>Math.round(parseInt(x,16)*.8).toString(16).padStart(2,'0')).join('');
  }
  return {principal:c[0],secundario:c[1]||c[0],texto,acento};
}
function estiloInterior(club){const p=paletaInterior(club);return `--equipo1:${p.principal};--equipo2:${p.secundario};--equipo-tinta:${p.texto};--equipo-acento:${p.acento}`;}
const _aplicarTemaV10=aplicarTema;
aplicarTema=function(){
  _aplicarTemaV10();const st=document.documentElement.style,p=paletaInterior(S.club);
  Object.entries({equipo1:p.principal,equipo2:p.secundario,'equipo-tinta':p.texto,'equipo-acento':p.acento}).forEach(([k,v])=>st.setProperty('--'+k,v));
};
let camisetaSecuencia=0;
retratoDT=function(tam){
  const edad=edadDT(),i=clamp(Math.floor((edad-25)/15),0,3),id='dt-'+(++camisetaSecuencia),p=paletaInterior(S.club);
  return `<svg class="retrato-dt" width="${tam||64}" height="${tam||64}" viewBox="0 0 443.5 640" role="img" aria-label="${escapeHTML(S.nombre||'DT')}, ${edad} ${T('anios')}"><defs><clipPath id="${id}"><rect width="443.5" height="640" rx="20"/></clipPath></defs><g clip-path="url(#${id})"><rect width="443.5" height="640" fill="${p.secundario}"/><image href="assets/interiores/entrenador.png" x="${-i*443.5}" y="0" width="1774" height="887"/></g></svg>`;
};
function camisetaInterior(club){
  const p=paletaInterior(club),id='camiseta-'+(++camisetaSecuencia);
  return `<span class="camiseta-ilustrada" aria-hidden="true" style="${estiloInterior(club)}"><svg viewBox="0 0 180 156"><defs><clipPath id="${id}"><path d="M51 13L70 6Q90 24 110 6L129 13 176 47 153 79 129 65 134 151H46L51 65 27 79 4 47Z"/></clipPath></defs><g clip-path="url(#${id})"><path d="M0 0H180V156H0Z" fill="${p.principal}"/><path d="M49 0H64V156H49ZM84 0H99V156H84ZM119 0H134V156H119Z" fill="${p.secundario}"/><path d="M0 132H180V156H0Z" fill="#000" opacity=".1"/><path d="M51 13L27 75M129 13L153 75M68 9Q90 32 112 9" fill="none" stroke="${p.secundario}" stroke-width="9"/></g><path d="M51 13L70 6Q90 24 110 6L129 13 176 47 153 79 129 65 134 151H46L51 65 27 79 4 47Z" fill="none" stroke="#182e29" stroke-opacity=".6" stroke-width="2"/></svg><span class="camiseta-escudo">${escudo(club,22)}</span></span>`;
}
function patronUniformeInterior(club){
  if(['River Plate','Vasco da Gama'].includes(club.n))return 'banda';
  if(['Boca Juniors','Sampdoria'].includes(club.n))return 'franja';
  if(['Racing Club','Peñarol','Grêmio','Juventus','Inter','Milan','Newcastle','Atlético de Madrid'].includes(club.n))return 'rayas';
  return 'liso';
}
function retratoJugadorInterior(j,extra){
  const i=hashTxt(j.nom)%6,id='jugador-'+(++camisetaSecuencia),p=paletaInterior(S.club),tipo=patronUniformeInterior(S.club);
  const mat=c=>{const v=c.slice(1).match(/../g).map(x=>Math.max(.12,parseInt(x,16)/255*1.14));return `${v[0]} 0 0 0 .02 0 ${v[1]} 0 0 .02 0 0 ${v[2]} 0 .02 0 0 0 1 0`;};
  const img=`<image href="assets/interiores/jugadores.png" x="${-(i%3)*512}" y="${i<3?0:-512}" width="1536" height="1024"/>`;
  const patron=tipo==='banda'?'<path d="M75 512L512 275V363L220 512Z"/>':tipo==='franja'?'<rect y="392" width="512" height="63"/>':tipo==='rayas'?'<path d="M75 270H123V512H75ZM177 270H225V512H177ZM279 270H327V512H279ZM381 270H429V512H381Z"/>':'';
  return `<span class="retrato-jugador ${extra||''}" role="img" aria-label="${escapeHTML(t3('Retrato ilustrado','Retrato ilustrado','Illustrated portrait'))}"><svg class="retrato-compuesto" viewBox="0 0 512 512" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><clipPath id="${id}-celda"><rect width="512" height="512"/></clipPath><clipPath id="${id}-ropa"><path d="M0 512V380L160 303L181 293Q174 337 256 347Q323 340 328 294L350 308L512 380V512Z"/></clipPath><clipPath id="${id}-patron">${patron}</clipPath><filter id="${id}-a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feColorMatrix values="${mat(p.principal)}"/></filter><filter id="${id}-b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feColorMatrix values="${mat(p.secundario)}"/></filter></defs><g clip-path="url(#${id}-celda)">${img}<g clip-path="url(#${id}-ropa)"><g filter="url(#${id}-a)">${img}</g>${patron?`<g clip-path="url(#${id}-patron)" filter="url(#${id}-b)">${img}</g>`:''}</g></g></svg><span class="retrato-escudo">${escudo(S.club,22)}</span></span>`;
}
function banderaInterior(club){return `<div class="bandera-equipo" style="${estiloInterior(club)}" aria-hidden="true">${escudo(club,66)}<span>${escapeHTML(club.n)}</span></div>`;}
function principiosInterior(modelo){
  const m=modelo||S.modelo||S.modeloPref||modeloDeEstilo(S.estilo||S.estiloPref||'Posesion');
  return `<div class="firma-principios"><b>${t3('LA IDEA QUE ENTRENAMOS','A IDEIA QUE TREINAMOS','THE IDEA WE TRAIN')}</b>${MOMENTOS.map(M=>`<div><span>${L(M.n)}</span><strong>${L(opMomento(M.id,m[M.id]).n)}</strong></div>`).join('')}</div>`;
}
function tituloInterior(kicker,titulo,bajada){return `<div class="titulo-interior"><div><p class="etq">${kicker}</p><h2 class="disp">${titulo}</h2>${bajada?`<p>${bajada}</p>`:''}</div><div class="sello-interior">${escudo(S.club,66)}<span>${escapeHTML(S.club.n)}</span></div></div>`;}
const _cabeceraV10=cabecera;
cabecera=function(){
  if(S.club)prepararIdentidadDT();
  _cabeceraV10();const c=$('#cab');if(!c||c.hidden||!S.club)return;
  c.classList.add('cabecera-interior');
  const h=c.querySelector('.hinfo');if(h){const tag=document.createElement('span');tag.className='cab-contexto';tag.textContent=t3('DESDE EL BANCO','DO BANCO','FROM THE BENCH');h.insertBefore(tag,h.firstChild);}
};
function condicionInterior(j){
  if(j.les>0)return t3('Lesionado','Lesionado','Injured');
  if(j.sus>0)return t3('Suspendido','Suspenso','Suspended');
  if((j.fat||0)>=55)return t3('Llega cargado','Chega cansado','Tired legs');
  if((j.forma||0)>=2)return t3('En racha','Em boa fase','In form');
  if((j.forma||0)<=-2)return t3('Busca confianza','Busca confiança','Needs confidence');
  return t3('Disponible','Disponível','Available');
}
function fichaJugadorInterior(j){
  if(!j)return '';
  const i=(window.__banco||[]).indexOf(j),seleccionado=tmp.selBanco===j;
  return `<div class="ficha-persona">${retratoJugadorInterior(j,'grande')}<div><p class="etq">${t3('EL JUGADOR','O JOGADOR','THE PLAYER')}</p><h3 class="disp">${escapeHTML(j.nom)}</h3><p>${escapeHTML(posTxt(j))} · ${j.ed} ${T('anios')}</p><strong>${condicionInterior(j)}</strong><p class="detalle-persona">${t3('Rinde hoy','Rende hoje','Today’s rating')} <b>${efectivo(j)}</b> · ${t3('Cansancio','Cansaço','Fatigue')} ${Math.round(j.fat||0)}%</p>${i>=0&&disponible(j)?`<button class="btn ${seleccionado?'sec':''}" onclick="elegirBanco(${i})">${seleccionado?t3('Cancelar selección','Cancelar seleção','Cancel selection'):t3('Elegir para el once','Escolher para o time','Select for the XI')}</button>`:''}</div></div>`;
}
function verJugadorInterior(i,banco){
  tmp.vistaJugador=(banco?window.__banco:window.__once.map(o=>o.jug))[i];
  if(!banco&&tmp.selBanco){reemplazar(i);return;}
  window[window.__rep]();
}
const _canchaGestionV10=canchaGestion;
canchaGestion=function(once){
  const W=560,H=610,m=28,p=paletaInterior(S.club);
  const sel=tmp.selBanco;
  return `<div class="pizarra-titulares"><div class="pizarra-rotulo"><span>${escapeHTML(S.formacion||S.sistemaPref||'')}</span><span>${t3('TU ONCE','SEU TIME','YOUR XI')}</span></div><svg class="cancha cancha-cuaderno" viewBox="0 0 ${W} ${H}" role="group" aria-label="${t3('Tu once en la cancha','Seu time em campo','Your XI on the pitch')}"><rect width="${W}" height="${H}" fill="#234f42"/><path d="M12 12H548V598H12ZM12 305H548M185 12V98H375V12M185 598V512H375V598" fill="none" stroke="#e2e2c5" stroke-opacity=".55" stroke-width="2"/><circle cx="280" cy="305" r="65" fill="none" stroke="#e2e2c5" stroke-opacity=".55" stroke-width="2"/>${once.map((o,i)=>{
    const x=o.x/100*W,y=H-m-o.y/100*(H-m*2),j=o.jug,compatible=sel&&(ROL[o.rol].g===sel.g||posDe(sel).includes(o.rol));
    return `<g role="button" tabindex="0" aria-label="${escapeHTML(j.nom+', '+tRol(o.rol)+', '+o.rt)}" onclick="verJugadorInterior(${i},false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();verJugadorInterior(${i},false)}"><rect x="${x-46}" y="${y-28}" width="92" height="76" fill="transparent"/>${compatible?`<circle cx="${x}" cy="${y}" r="29" fill="none" stroke="#f3d58b" stroke-width="3" stroke-dasharray="5 4"/>`:''}<circle cx="${x}" cy="${y}" r="23" fill="${p.principal}" stroke="${p.secundario}" stroke-width="3"/><text x="${x}" y="${y+8}" text-anchor="middle" fill="${p.texto}" font-size="24" font-weight="800">${o.rt}</text><rect x="${x-47}" y="${y+28}" width="94" height="23" rx="2" fill="#f5eedb"/><text x="${x}" y="${y+44}" text-anchor="middle" fill="#173b34" font-size="15" font-weight="700">${escapeHTML(apellido(j.nom))}</text>${j.fat>=55?`<path d="M${x-10} ${y+55}h20" stroke="#ecc26d" stroke-width="4"/>`:''}${o.fuera||o.adapta?`<text x="${x+29}" y="${y-14}" fill="#f3d58b" font-size="20">!</text>`:''}</g>`;
  }).join('')}</svg><p class="nota-pizarra">${sel?t3('Elegí al titular que sale. Las fichas marcadas cubren su sector.','Escolha quem sai. As fichas marcadas cobrem o setor.','Choose who comes off. Marked players cover the same line.'):t3('Tocá una ficha para ver al jugador.','Toque uma ficha para ver o jogador.','Select a token to view the player.')}</p></div>`;
};
vistaGestion=function(f,rep){
  const once=onceTemporada(S.plantel,f,S.fijos),enOnce=new Set(once.map(o=>o.jug));
  const banco=S.plantel.filter(j=>!enOnce.has(j)).sort((a,b)=>disponible(b)-disponible(a)||efectivo(b)-efectivo(a));
  window.__once=once;window.__banco=banco;window.__rep=rep;
  const seleccionado=tmp.selBanco||tmp.vistaJugador||banco.find(disponible)||once[0].jug;
  const attrs=atributosDe(once);
  return `<div class="gestion-editorial"><div class="gestion-cancha">${canchaGestion(once)}<details class="lectura-once"><summary>${t3('Cómo llega este once','Como chega este time','How this XI arrives')}</summary>${barras(attrs,null,true)}<p class="nota-dato">${t3('Las fichas muestran rendimiento de hoy. La formación automática prioriza jerarquía; podés cambiarla desde el banco.','As fichas mostram rendimento atual. Pode mudar pelo banco.','Tokens show today’s rating. You can change the automatic XI from the bench.')}</p></details></div><div class="gestion-banco"><div class="banco-titulo"><h3 class="disp">${T('banco')}</h3><span>${banco.length} ${t3('jugadores','jogadores','players')}</span></div><p class="banco-instruccion" role="status">${tmp.selBanco?t3('Ahora elegí al titular que sale en la pizarra.','Agora escolha quem sai no quadro.','Now select the starter to replace on the board.'):t3('Elegí un suplente para conocer su estado o darle lugar.','Escolha um reserva para ver seu estado.','Choose a substitute to view their condition or bring them in.')}</p><div class="lista-personas">${banco.map((j,i)=>`<button class="persona-fila ${seleccionado===j?'seleccionada':''}" onclick="verJugadorInterior(${i},true)" aria-pressed="${seleccionado===j}">${retratoJugadorInterior(j)}<span class="persona-datos"><b>${escapeHTML(j.nom)}</b><small>${escapeHTML(posTxt(j))} · ${j.ed}</small><em>${condicionInterior(j)}</em></span><strong class="persona-nivel">${efectivo(j)}</strong></button>`).join('')}</div>${fichaJugadorInterior(seleccionado)}${S.fijos&&S.fijos.length?`<button class="btn sec" onclick="S.fijos=[];tmp.selBanco=null;${rep}()">${T('onceAuto')}</button>`:''}<p id="avisoCambio" class="aviso-cambio" role="status" aria-live="polite"></p></div></div>`;
};
pintarPlantel=function(){
  prepararIdentidadDT();aplicarTema();const f=S.formacion||S.sistemaPref;
  $('#s-plantel').innerHTML=`${tituloInterior(t3('EL PLANTEL · PRETEMPORADA','ELENCO · PRÉ-TEMPORADA','SQUAD · PRE-SEASON'),t3('LOS ONCE<br>DEL DOMINGO.','OS ONZE<br>DE DOMINGO.','THE SUNDAY<br>STARTING XI.'),t3('Tu idea se juega con ellos.','Sua ideia joga com eles.','They bring your idea to the pitch.'))}${vistaGestion(f,'pintarPlantel')}${principiosInterior()}<div class="acciones accion-editorial"><button class="btn" onclick="abrirMercado()">${T('irMercado')} →</button></div>`;
  if(S.pant==='plantel')guardarPretemporada();
};
const _pintarPlanV10=pintarPlan;
pintarPlan=function(){
  _pintarPlanV10();if(tmp.paso>0)return;
  const root=$('#s-planteo'),h=root.querySelector('h2');if(h)h.innerHTML=t3('UNA IDEA.<br>ONCE PARA JUGARLA.','UMA IDEIA.<br>ONZE PARA JOGAR.','ONE IDEA.<br>ELEVEN TO PLAY IT.');
  const bloque=document.createElement('div');bloque.className='plan-editorial';
  bloque.innerHTML=`<div class="plan-pizarra">${canchaGestion(onceTemporada(S.plantel,tmp.f,S.fijos)).replace(/onclick="[^"]*"/g,'').replace(/onkeydown="[^"]*"/g,'').replace(/role="button" tabindex="0"/g,'')}${principiosInterior(tmp.m)}</div><div class="plan-trabajo"></div>`;
  const acciones=root.querySelector('.acciones');
  const detalles=[...root.querySelectorAll(':scope > details')],base=root.querySelector('.plan-base');
  if(base)bloque.querySelector('.plan-trabajo').appendChild(base);
  detalles.forEach(d=>bloque.querySelector('.plan-trabajo').appendChild(d));
  root.insertBefore(bloque,acciones);
  const nota=bloque.querySelector('.nota-pizarra');if(nota)nota.textContent=t3('El punto de partida. Lo que trabajás sigue en cada partido.','O ponto de partida de cada jogo.','The starting point for every match.');
};
const _pintarArengaV10=pintarArenga;
pintarArenga=function(){
  _pintarArengaV10();aplicarTema();const root=document.querySelector('#s-partido .arenga'),A=tmp.vivo.arenga;if(!root)return;
  const h=root.querySelector('h2');if(h)h.textContent=t3('ANTES DE SALIR, MIRALOS.','ANTES DE ENTRAR, OLHE PARA ELES.','BEFORE WALKING OUT, LOOK AT THEM.');
  const scene=document.createElement('div');scene.className='escena-vestuario';
  scene.innerHTML=`${banderaInterior(S.club)}<div class="vestuario-personajes">${A.caras.map((c,i)=>`<div class="jugador-escena" style="--asiento:${i}">${retratoJugadorInterior(c.j,'en-escena')}<span class="numero-persona">${i+1}</span><span class="escena-nombre">${escapeHTML(apellido(c.j.nom))}</span></div>`).join('')}</div><div class="escena-firma">${escudo(S.club,36)}<span>${escapeHTML(S.club.n)}</span></div>`;
  root.insertBefore(scene,root.firstChild);
  const caras=root.querySelectorAll('.ar-cara');caras.forEach((el,i)=>{
    const av=el.querySelector('.ar-av');if(av)av.innerHTML=`<span class="numero-cara">${i+1}</span>`;
    const extra=document.createElement('span');extra.className='reaccion-persona';
    if(A.elegidas.length){const r=reaccionCara(A.caras[i],A.ops[A.elegidas[A.elegidas.length-1]].t);extra.textContent=r>0?t3('Le llegó','Chegou nele','It landed'):r<0?t3('Se tensó','Ficou tenso','Tensed up'):t3('Escucha','Escuta','Listening');el.appendChild(extra);}
  });
  const interior=document.createElement('div');interior.className='charla-contenido';
  [...root.children].filter(el=>el!==scene).forEach(el=>interior.appendChild(el));root.appendChild(interior);
  const clave=document.createElement('div');clave.className='charla-club';clave.innerHTML=`${escudo(S.club,32)}<span>${escapeHTML(S.club.n)}</span><span>${escapeHTML(tmp.vivo.info.titulo)}</span>`;root.insertBefore(clave,scene);
};
const _pintarPreviaV10=pintarPrevia;
pintarPrevia=function(){
  _pintarPreviaV10();aplicarTema();const root=$('#s-partido');root.classList.add('partido-editorial');
  const p=root.querySelector('.previa');if(p)p.insertAdjacentHTML('afterbegin',`<div class="previa-marca">${camisetaInterior(S.club)}</div>`);
};
const _zonasVivoV10=zonasVivo;
function elegirMapaInterior(v){
  tmp.vivo.vistaMapa=v;
  document.querySelectorAll('.mapa-interior').forEach(el=>{el.outerHTML=zonasVivo();});
}
function pizarraPartidoInterior(){
  const V=tmp.vivo,mio=V.info.soyA?V.A:V.B,rival=V.info.rival,W=540,H=680,m=25,cw=(W-m*2)/3,rh=(H-m*2)/6;
  const o=V.sel2!=null&&V.ops2?V.ops2[V.sel2]:null;
  const pat=o&&PATRONES.find(p=>p.id===o.k.split(':')[1]);
  const zona=pat?(o.k.startsWith('x:')?espejoZona(pat.zona):pat.zona):null;
  const fichas=(E,contrario)=>{
    const mod=contrario?E.modelo||modeloDeEstilo(E.e):S.modelo||modeloDeEstilo(S.estilo),forma=formaIdea(E.f,E.e,contrario?'sin':'con',mod),pal=paletaInterior(E.club);
    return E.once.map((f,i)=>{const q=forma[i],x=(contrario?100-q.x:q.x)/100*(W-60)+30+(contrario?5:-5),y=H-m-(contrario?100-q.Y:q.Y)/100*(H-m*2);
      return `<g><title>${escapeHTML(E.club.n+': '+f.jug.nom+', '+f.rt)}</title><circle cx="${x}" cy="${y}" r="18" fill="${pal.principal}" stroke="${pal.secundario}" stroke-width="3" ${contrario?'stroke-dasharray="4 2"':''}/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="18" font-weight="800" fill="${pal.texto}">${f.rt}</text>${V.nombresMapa?`<rect x="${x-41}" y="${y+22}" width="82" height="18" fill="#f4eedb"/><text x="${x}" y="${y+35}" font-size="11" font-weight="700" fill="#173b34" text-anchor="middle">${escapeHTML(apellido(f.jug.nom))}</text>`:''}</g>`;
    }).join('');
  };
  return `<svg class="pizarra-partido" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t3('Esquema táctico de los dos equipos','Esquema tático dos times','Tactical shape of both teams')}"><rect width="${W}" height="${H}" fill="#285344"/><path d="M${m} ${m}H${W-m}V${H-m}H${m}ZM${m} ${H/2}H${W-m}M${W/2-105} ${m}V135H${W/2+105}V${m}M${W/2-105} ${H-m}V${H-135}H${W/2+105}V${H-m}" stroke="#e5e0be" stroke-opacity=".6" stroke-width="2" fill="none"/><circle cx="${W/2}" cy="${H/2}" r="65" stroke="#e5e0be" stroke-opacity=".6" stroke-width="2" fill="none"/>${zona?`<rect x="${m+((zona-1)%3)*cw}" y="${H-m-Math.ceil(zona/3)*rh}" width="${cw}" height="${rh}" fill="#efd38c" fill-opacity=".12" stroke="#efd38c" stroke-width="3" stroke-dasharray="8 7"/>`:''}${fichas(rival,true)}${fichas(mio,false)}<path d="M${W-12} ${H-65}V${H-130}l-5 9m5-9 5 9" stroke="#f4eedb" fill="none" stroke-width="2"/><text x="${W-18}" y="${H-74}" text-anchor="end" font-size="10" fill="#f4eedb">${t3('ATACÁS','ATACA','ATTACK')}</text></svg>`;
}
zonasVivo=function(){
  const V=tmp.vivo,dom=V.vistaMapa==='dominio';
  return `<div class="mapa-interior"><div class="mapa-controles"><button class="${dom?'':'on'}" onclick="elegirMapaInterior('pizarra')" aria-pressed="${!dom}">${t3('Pizarra','Quadro','Board')}</button><button class="${dom?'on':''}" onclick="elegirMapaInterior('dominio')" aria-pressed="${dom}">${t3('Dominio','Domínio','Control')}</button>${!dom?`<button onclick="tmp.vivo.nombresMapa=!tmp.vivo.nombresMapa;elegirMapaInterior('pizarra')">${V.nombresMapa?t3('Ocultar nombres','Ocultar nomes','Hide names'):t3('Ver nombres','Ver nomes','Show names')}</button>`:''}</div>${dom?_zonasVivoV10():pizarraPartidoInterior()}<p class="clave-mapa">${dom?t3('Fuerzas por zona y llegadas registradas.','Forças e chegadas por zona.','Zone strength and recorded attacks.'):t3('Tu modelo con pelota · números: rendimiento · borde cortado: rival.','Seu modelo com bola · números: rendimento · borda tracejada: rival.','Your in-possession shape · numbers: rating · dashed edge: opponent.')}</p></div>`;
};
pintarVivo=function(){
  aplicarTema();const V=tmp.vivo,rv=V.info.rival,yoA=V.info.soyA;
  V.cols=V.cols||coloresDuelo(S.club,rv.club);const a=yoA?S.club:rv.club,b=yoA?rv.club:S.club;
  $('#s-partido').classList.add('partido-editorial');$('#s-partido').dataset.fase='vivo';
  $('#s-partido').innerHTML=`<div class="vivo-cab marcador-editorial"><div class="marcador-club">${escudo(a,45)}<span>${escapeHTML(a.n)}</span></div><b id="vvM">${V.marc[0]} – ${V.marc[1]}</b><div class="marcador-club visitante"><span>${escapeHTML(b.n)}</span>${escudo(b,45)}</div><span id="vvMin">${V.min}'</span><div class="marcador-comp">${escapeHTML(V.info.titulo)}</div><div class="tk-barra"><i id="vvBar" style="width:${V.min/90*100}%"></i></div></div><div class="vivo-editorial"><div class="banco-escena"><div class="dt-de-espaldas" aria-hidden="true"><span>${escudo(S.club,28)}</span></div><div class="bandera-banco">${banderaInterior(S.club)}</div><div class="banco-identidad">${camisetaInterior(S.club)}<div>${retratoDT(88)}<span>${escapeHTML(S.nombre||'DT')}<small>${edadDT()} ${T('anios')}</small></span></div></div><div class="banco-leyenda"><span>${t3('DESDE EL BANCO','DO BANCO','FROM THE BENCH')}</span><b>${escapeHTML(S.club.n)}</b></div></div><div class="banco-lectura"><p class="etq">${t3('LEÉ EL PARTIDO','LEIA O JOGO','READ THE MATCH')}</p><div id="vvZonas">${zonasVivo()}</div><div class="leyenda-equipos">${escudo(S.club,20)} ${escapeHTML(S.club.n)} <span>·</span> ${escudo(rv.club,20)} ${escapeHTML(rv.club.n)}</div><details><summary>${t3('Datos del encuentro','Dados do jogo','Match data')}</summary><div id="vvStats">${statsVivo()}</div></details></div></div><div class="controles-banco"><span>${t3('TU IDEA SIGUE EN CANCHA','SUA IDEIA SEGUE EM CAMPO','YOUR IDEA STAYS ON THE PITCH')}</span><button class="btn sec compacto" aria-pressed="false" onclick="pausarVivoInterior(this)">${t3('Pausar','Pausar','Pause')}</button><button class="btn sec compacto" onclick="tmp.vivo.rapido=!tmp.vivo.rapido;this.textContent=tmp.vivo.rapido?'×10':'×1'">${V.rapido?'×10':'×1'}</button></div><div id="vvFeed" class="vivo-feed relato-editorial"></div><div id="vvPanel"></div>`;
  pintarFeedVivo();
};
const _pintarEntretiempoV10=pintarEntretiempo;
pintarEntretiempo=function(peligro,fuerte){
  _pintarEntretiempoV10(peligro,fuerte);const V=tmp.vivo,root=$('#vvPanel');if(!root)return;
  $('#s-partido').dataset.fase='entretiempo';
  const contenido=root.querySelector('.entretiempo');if(!contenido)return;
  const opciones=contenido.querySelector('.pv-ops');if(opciones){opciones.classList.add('ordenes-cuaderno');opciones.querySelectorAll('button').forEach((b,i)=>b.insertAdjacentHTML('afterbegin',`<span class="letra-orden">${String.fromCharCode(65+i)}</span>`));}
  const layout=document.createElement('div');layout.className='entretiempo-cuaderno';
  layout.innerHTML=`<div class="cuaderno-cancha"><p class="etq">${t3('EL CUADERNO · 45 MINUTOS','O CADERNO · 45 MINUTOS','THE NOTEBOOK · 45 MINUTES')}</p><h2 class="disp">${t3('EL PARTIDO<br>ESTÁ POR ACÁ.','O JOGO<br>ESTÁ POR AQUI.','THE MATCH<br>IS HERE.')}</h2>${zonasVivo()}<p class="nota-dato">${t3('El mapa resume fuerzas y llegadas registradas; las fichas no son una animación de posiciones reales.','O mapa resume forças e chegadas registradas.','The map summarises strength and recorded attacks.')}</p>${principiosInterior()}</div><div class="cuaderno-ordenes"></div>`;
  layout.querySelector('.cuaderno-ordenes').appendChild(contenido);root.appendChild(layout);
};
const _segundoTiempoV10=segundoTiempo;
segundoTiempo=function(){$('#s-partido').dataset.fase='vivo';_segundoTiempoV10();};
function pausarVivoInterior(b){tmp.vivo.pausa=!tmp.vivo.pausa;b.textContent=tmp.vivo.pausa?t3('Seguir','Continuar','Resume'):t3('Pausar','Pausar','Pause');b.setAttribute('aria-pressed',String(tmp.vivo.pausa));}
const _irInteriorV10=ir;
ir=function(p){
  _irInteriorV10(p);
  // Los editores usan IDs de controles. Retirar los ocultos evita que una nueva
  // conferencia lea el textarea de una charla anterior o duplique etiquetas.
  document.querySelectorAll('section:not(.on) .voz-editor').forEach(el=>el.remove());
  if(p!=='partido'){const root=$('#s-partido');if(root){root.classList.remove('partido-editorial');delete root.dataset.fase;}}
};
