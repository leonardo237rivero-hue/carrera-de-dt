// v15 — Identidad de cancha, ritmo elegido y consecuencias observables.
// La presentación nunca consume S.rng ni altera los goles ya simulados.
const CANCHAS_ARTE={Peñarol:'penarol',Nacional:'nacional','Boca Juniors':'boca','River Plate':'river','Racing Club':'racing'};
// Lugares verificados mediante referencias fotográficas; Barcelona usa su configuración histórica.
const LUGARES_CLUB={
 "Peñarol":{"id":"penarol","cancha":"Campeón del Siglo","cantera":"Ciudad Deportiva Néstor Gonçalves","ciudad":"Montevideo","dir":"v15.1","epoca":""},
 "Nacional":{"id":"nacional","cancha":"Gran Parque Central","cantera":"Los Céspedes","ciudad":"Montevideo","dir":"v15.1","epoca":""},
 "Barcelona":{"id":"barcelona","cancha":"Camp Nou","cantera":"Ciutat Esportiva Joan Gamper","ciudad":"Sant Joan Despí","dir":"v15.1","epoca":"clásico"},
 "Boca Juniors":{"id":"boca-juniors","cancha":"La Bombonera","cantera":"Boca Predio","ciudad":"Ezeiza","dir":"v16.1","epoca":""},
 "River Plate":{"id":"river-plate","cancha":"Monumental","cantera":"River Camp","ciudad":"Ezeiza","dir":"v16.1","epoca":""},
 "Flamengo":{"id":"flamengo","cancha":"Maracanã","cantera":"Ninho do Urubu","ciudad":"Río de Janeiro","dir":"v16.1","epoca":""},
 "Corinthians":{"id":"corinthians","cancha":"Neo Química Arena","cantera":"CT de Base · Parque Ecológico","ciudad":"São Paulo","dir":"v16.1","epoca":""},
 "Real Madrid":{"id":"real-madrid","cancha":"Santiago Bernabéu","cantera":"Ciudad Real Madrid · Valdebebas","ciudad":"Madrid","dir":"v16.1","epoca":""},
 "Liverpool FC":{"id":"liverpool-fc","cancha":"Anfield","cantera":"Kirkby · Campus de formación","ciudad":"Liverpool","dir":"v16.1","epoca":""},
 "Manchester United":{"id":"manchester-united","cancha":"Old Trafford","cantera":"Academia de Carrington","ciudad":"Manchester","dir":"v16.1","epoca":""},
 "Milan":{"id":"milan","cancha":"San Siro","cantera":"Centro Sportivo Vismara","ciudad":"Milán","dir":"v16.1","epoca":""},
 "Juventus":{"id":"juventus","cancha":"Allianz Stadium","cantera":"Juventus Training Center · Vinovo","ciudad":"Vinovo","dir":"v16.1","epoca":""},
 "Bayern München":{"id":"bayern-munchen","cancha":"Allianz Arena","cantera":"FC Bayern Campus","ciudad":"Múnich","dir":"v16.1","epoca":""},
 "Borussia Dortmund":{"id":"borussia-dortmund","cancha":"Signal Iduna Park","cantera":"Brackel · Hohenbuschei","ciudad":"Dortmund","dir":"v16.1","epoca":""},
 "Paris Saint-Germain":{"id":"paris-saint-germain","cancha":"Parc des Princes","cantera":"Campus PSG · Poissy","ciudad":"Poissy","dir":"v16.1","epoca":""},
 "Marsella":{"id":"marsella","cancha":"Stade Vélodrome","cantera":"La Commanderie · Robert Louis-Dreyfus","ciudad":"Marsella","dir":"v16.1","epoca":""},
 "Inter Miami":{"id":"inter-miami","cancha":"Chase Stadium","cantera":"Florida Blue Training Center","ciudad":"Fort Lauderdale","dir":"v16.1","epoca":"Fort Lauderdale"},
 "LA Galaxy":{"id":"la-galaxy","cancha":"Dignity Health Sports Park","cantera":"Academia LA Galaxy · Carson","ciudad":"Carson","dir":"v16.1","epoca":""},
 "Al Hilal":{"id":"al-hilal","cancha":"Kingdom Arena","cantera":"Academia Al Hilal · Al Qirawan","ciudad":"Riad","dir":"v16.1","epoca":""},
 "Al Nassr":{"id":"al-nassr","cancha":"Al Awwal Park","cantera":"Prince Abdulrahman bin Saud","ciudad":"Riad","dir":"v16.1","epoca":""}
};
function arteCantera(club){const l=LUGARES_CLUB[club?.n];return l?'assets/'+l.dir+'/'+l.id+'-cantera.jpg':'assets/v14/practica-ronda.jpg';}
function arteCancha(club,division=3){
 if(division<3)return arteCantera(club);
 const lugar=LUGARES_CLUB[club?.n];if(lugar)return 'assets/'+lugar.dir+'/'+lugar.id+'.jpg';
 if(CANCHAS_ARTE[club?.n])return 'assets/v15/'+CANCHAS_ARTE[club.n]+'.jpg';
 return club?.niv>=4||club?.sel?'assets/v15/noche-europea.jpg':'assets/v14/revelacion.jpg';
}
function cssFoto(ruta){return `url('${new URL(ruta,document.baseURI||'http://localhost/').href}')`;}
function sedePartido(info){return info?.neutral?null:info?.soyA?S.club:info?.rival?.club;}
function fotoPartido(info){const sede=sedePartido(info);return sede?arteCancha(sede,S.division):'assets/v15/noche-europea.jpg';}
function nombreCancha(club,division=3){const l=LUGARES_CLUB[club?.n];return division<3?l?.cantera||t3('Campo de formación','Campo de formação','Academy ground'):l?.cancha||CLUB_INFO[club?.n]?.est||t3('Nuestra casa','Nossa casa','Our home');}
function detalleLugar(club,division=3){
 if(division>=3&&club?.n==='Barcelona')return t3('configuración histórica anterior a 2023','configuração histórica anterior a 2023','historic pre-2023 configuration');
 if(division>=3&&club?.n==='Inter Miami')return t3('sede histórica de Fort Lauderdale','sede histórica de Fort Lauderdale','historic Fort Lauderdale home');
 return t3('recreación artística','recriação artística','artistic interpretation');
}
function escenaClub(club,division,etiqueta,titulo,sub,clase=''){
 return `<section class="escena-club escena-con-sello ${clase}" style="--escena:${cssFoto(arteCancha(club,division))};${estiloInterior(club)}"><div class="escena-luz" aria-hidden="true"></div><div class="escena-contenido"><p class="etq">${escapeHTML(etiqueta)}</p><h2>${escapeHTML(titulo)}</h2><p>${escapeHTML(sub)}</p></div><div class="escena-insignia" aria-hidden="true">${escudo(club,132)}<i class="insignia-base"></i></div><span class="escena-sede">${escapeHTML(nombreCancha(club,division))} · ${detalleLugar(club,division)}</span></section>`;
}
const _bannerAtmosfera=bannerClub;
bannerClub=function(club,opts){return _bannerAtmosfera(club,opts).replace('class="banner-club"','class="banner-club banner-con-cancha"').replace('style="--c1:',`style="--escena:${cssFoto(arteCancha(club,opts?.division??3))};--c1:`);};
const _temaAtmosfera=aplicarTema;
aplicarTema=function(){_temaAtmosfera();if(S.club)document.documentElement.style.setProperty('--cancha-club',cssFoto(arteCancha(S.club,S.division)));};

// Un contrato de ritmo visible. Una noche elegida + las finales en modo esencial.
function ritmoCarrera(){return S.ritmo==='rapido'?'resumen':S.ritmoPartidos||'esencial';}
function selectorRitmo(){return `<div class="ritmo-carrera"><label>${t3('Tu tiempo en el banco','Seu tempo no banco','Your time on the touchline')}<select aria-label="${t3('Ritmo de los partidos','Ritmo dos jogos','Match pace')}" onchange="cambiarRitmoCarrera(this.value)">${[['esencial',t3('Esencial · una noche y las finales','Essencial · uma noite e as finais','Essential · one night and finals')],['completo',t3('Más intervención · hasta dos noches y finales','Mais intervenção · até duas noites e finais','More involvement · up to two nights and finals')],['resumen',t3('Resumen · toda la campaña con mi plan','Resumo · campanha com meu plano','Summary · the campaign with my plan')]].map(([id,n])=>`<option value="${id}" ${ritmoCarrera()===id?'selected':''}>${n}</option>`).join('')}</select></label><p>${t3('El resto se juega en la jornada. El ritmo cambia cuánto intervenís, no añade premios por mirar.','Os outros jogos seguem na rodada. O ritmo muda sua intervenção, sem prêmio por assistir.','Other games run with the round. Pace changes your involvement, with no reward for watching.')}</p></div>`;}
function cambiarRitmoCarrera(v){if(!['esencial','completo','resumen'].includes(v))return;S.ritmoPartidos=v;S.ritmo=v==='resumen'?'rapido':'elegir';}
const _grandeAtmosfera=partidoGrande;
partidoGrande=function(jor){
 if(ritmoCarrera()==='resumen')return null;
 const info=_grandeAtmosfera(jor);if(!info)return null;
 if(info.tipo==='final')return info;
 const intervenciones=S.temp.intervenciones||0;
 if(ritmoCarrera()==='esencial'&&(info.tipo==='copa'||intervenciones>=1))return null;
 if(intervenciones>=2)return null;
 return info;
};
const _previaAtmosfera=abrirPrevia;
abrirPrevia=function(jor,info){if(info.tipo!=='final')S.temp.intervenciones=(S.temp.intervenciones||0)+1;_previaAtmosfera(jor,info);};
const _planAtmosfera=pintarPlan;
pintarPlan=function(){_planAtmosfera();if(tmp.paso>0)return;const root=document.querySelector('#s-planteo .v14-plan');if(root)root.insertAdjacentHTML('beforeend',selectorRitmo());};

const _pintarPreviaAtmosfera=pintarPrevia;
pintarPrevia=function(){
 _pintarPreviaAtmosfera();const root=document.querySelector('#s-partido'),V=tmp.vivo;if(!root||!V)return;
 const pv=root.querySelector('.previa');if(pv){pv.classList.add('previa-cancha');pv.style.setProperty('--escena',cssFoto(fotoPartido(V.info)));pv.insertAdjacentHTML('beforeend',`<span class="escena-sede">${escapeHTML(V.info.neutral?t3('Sede neutral','Sede neutra','Neutral venue'):nombreCancha(sedePartido(V.info),S.division))} · ${t3('recreación artística','recriação artística','artistic interpretation')}</span>`);}
 const agrupar=(selector,titulo,abierto)=>{const els=[...root.querySelectorAll(selector)];if(!els.length)return;const det=document.createElement('details');det.className='previa-detalle';det.open=!!abierto;det.innerHTML=`<summary>${titulo}</summary>`;els[0].before(det);els.forEach(el=>det.appendChild(el));};
 agrupar(':scope > .huella-idea,:scope > .pv-figura,:scope > .pv-grid',t3('Informe del rival y lectura de zonas','Relatório do rival e zonas','Opponent report and zones'));
 if(pv)pv.after(root.querySelector('.previa-detalle'));
 agrupar(':scope > div.gd-construccion',t3('El otro banco · declaraciones y truco (opcional)','O outro banco · declarações e truco (opcional)','The other bench · statements and truco (optional)'),V.truco?.pendiente||!!V.truco);
 root.querySelectorAll('.pv-ops .card .sub').forEach(el=>{if(el.textContent.trim()===t3('Le sacás su arma.','Tira a arma deles.','You take away their weapon.'))el.textContent=t3('Intentás limitar esa vía; puede encontrar otra.','Tenta limitar essa via; pode achar outra.','Try to limit this route; they may find another.');});
 const ops=root.querySelector('.pv-ops');if(ops)ops.insertAdjacentHTML('afterend',`<p class="orden-lectura" role="status">${V.sel!=null?escapeHTML(V.ops[V.sel].t)+' · ':''}${t3('La orden cambia dónde insistís y qué riesgo aceptás. Al final veremos cuántas veces apareció, aunque no termine en gol.','A ordem muda onde insiste e o risco aceito. Depois veremos quantas vezes apareceu, mesmo sem gol.','Your order changes where you focus and which risk you accept. Afterwards we count how often it appeared, even without a goal.')}</p>`);
 const rap=root.querySelector('.via-rapida');if(rap){rap.querySelector('button').textContent=t3('Resolver este partido con mi plan','Resolver este jogo com meu plano','Resolve this match with my plan');rap.insertAdjacentHTML('beforeend',selectorRitmo());}
 instalarAudioUI(root);
};

// Antes de atribuir un resultado, mostrar intento, ejecución y límite de la lectura.
function evidenciasOrden(V){
 const yo=V.info.soyA?'a':'b',ev=V.ev||[],enf=V.enf||{},filas=[];
 for(const [tipo,ids] of [['cargar',enf.cargar||[]],['cerrar',enf.cerrar||[]]])for(const id of new Set(ids)){
  const desde=V.ordenesDesde?.[tipo+':'+id]||1;
  const lado=tipo==='cargar'?yo:yo==='a'?'b':'a',m=ev.filter(e=>e.l===lado&&e.pat===id&&e.m>=desde&&(e.t==='gol'||e.t==='llegada'));
  filas.push({tipo,id,desde,intentos:m.length,goles:m.filter(e=>e.t==='gol').length,costo:L(costoEnfasis(tipo,id))});
 }
 return filas;
}
function informeOrden(V){
 const filas=evidenciasOrden(V);
 return `<section class="lectura-decision"><p class="etq">${t3('TU DECISIÓN EN LA CANCHA','SUA DECISÃO EM CAMPO','YOUR DECISION ON THE PITCH')}</p>${filas.length?filas.map(f=>`<div><b>${f.tipo==='cargar'?t3('Buscaste','Buscou','You targeted'):t3('Intentaste cerrar','Tentou fechar','You tried to close')} ${escapeHTML(nomPatron(f.id))}</b><p>${V.simulado?'':f.intentos+' '+t3('acciones registradas','ações registradas','recorded moves')+' · '}${f.goles} ${t3('goles','gols','goals')}${f.tipo==='cerrar'?' '+t3('del rival','do rival','by the opponent'):''}.</p><small>${escapeHTML(f.costo)}</small></div>`).join(''):`<p>${t3('Sostuviste el plan habitual. El equipo conservó sus prioridades entrenadas.','Manteve o plano habitual e as prioridades treinadas.','You kept the regular plan and its trained priorities.')}</p>`}${V.simulado?`<p class="nota-dato">${t3('El resumen registra los goles; no registra todas las llegadas. Cero goles no significa que la orden no se haya intentado.','O resumo registra gols, não todas as chegadas. Zero gols não significa que a ordem não foi tentada.','The summary records goals, not all attacks. Zero goals does not mean the order was never attempted.')}</p>`:''}<p class="nota-dato">${t3('Esto muestra lo que ocurrió, no lo que habría pasado con otra orden. Rival, ejecución y azar también cuentan. Una buena decisión puede terminar en derrota.','Mostra o que aconteceu, não o que aconteceria com outra ordem. Rival, execução e acaso também contam.','This records what happened, not what would have happened under a different order. The opponent, execution and chance also matter. A sound decision can end in defeat.')}</p></section>`;
}
const _analisisAtmosfera=analisisVivo;
analisisVivo=function(gf,gc){return informeOrden(tmp.vivo)+_analisisAtmosfera(gf,gc);};

function liquidarTrucoResumen(V){
 const t=V.truco;if(!t||t.nivel<2||t.cobrado||!V.res)return '';
 t.cobrado=true;const r=V.res,yo=V.info.soyA,gf=yo?r.ga:r.gb,gc=yo?r.gb:r.ga;
 const gana=r.pen?(r.pen[0]>r.pen[1])===yo:gf>gc,emp=gf===gc&&!r.pen,k=t.nivel-1;
 const dh=emp?0:gana?2*k+(t.farol?2:0):-2*k,dd=emp?0:gana?k:-k;
 if(!emp&&!gana&&t.farol){S.memoriaTruco=S.memoriaTruco||{};S.memoriaTruco.farolesPerdidos=(S.memoriaTruco.farolesPerdidos||0)+1;}
 S.vars.hin=clamp(S.vars.hin+dh,0,100);S.vars.dir=clamp(S.vars.dir+dd,0,100);
 return `<p class="efecto">Truco ×${t.nivel} · ${T('hinchada')} ${sg(dh)} · ${T('directiva')} ${sg(dd)}</p>`;
}
simularDestacado=function(){
 const V=tmp.vivo;if(!V||V.simulado||V.truco?.pendiente)return;
 V.simulado=true;const o=V.sel!=null?V.ops[V.sel]:null;V.enf={rival:V.info.rival.club.n,cargar:[],cerrar:[]};
 if(o){const [k,id]=o.k.split(':');(k==='c'?V.enf.cargar:V.enf.cerrar).push(id);}S.enfasis=V.enf;
 const {A,B}=equiposVivo();V.A=A;V.B=B;V.res=jugarPartido(A,B,V.info.neutral,V.info.knock);V.ev=V.res.ev||[];V.marc=[V.res.ga,V.res.gb];
 const truco=liquidarTrucoResumen(V),local=V.info.soyA?S.club:V.info.rival.club,visita=V.info.soyA?V.info.rival.club:S.club;
 const root=document.querySelector('#s-partido');if(!root)return;
 root.innerHTML=`<section class="previa previa-cancha" style="--escena:${cssFoto(fotoPartido(V.info))}"><p class="etq">${t3('EL PARTIDO EN UNA PÁGINA','O JOGO EM UMA PÁGINA','THE MATCH ON ONE PAGE')}</p><p>${escapeHTML(V.info.titulo)}</p><div class="pv-vs">${escudo(local,58)}<b class="marcador-breve">${V.res.ga} – ${V.res.gb}</b>${escudo(visita,58)}</div><div class="pv-eq"><b>${escapeHTML(local.n)}</b><b>${escapeHTML(visita.n)}</b></div>${V.res.pen?`<p>${t3('Penales','Pênaltis','Penalties')} ${V.res.pen.join(' – ')}</p>`:''}</section>${informeOrden(V)}${truco}<div class="acciones"><button class="btn" onclick="cerrarVivo()">${t3('Volver a la temporada','Voltar à temporada','Back to the season')}</button></div>`;
 if(typeof detenerAudio==='function')detenerAudio();
};

// Copas vectoriales propias: siguen siendo legibles como iconos y como piezas de vitrina.
function trofeoDeCompetencia(tipo,nombre){
 const n=(nombre||'').toLowerCase();
 if(/libertadores/.test(n))return 'libertadores';if(/champions/.test(n))return 'orejona';
 if(/mundial|world cup/.test(n)||tipo==='sel')return 'mundo';
 if(/sudamericana|europa|conference/.test(n))return 'continental';
 return ['liga','copa','media','conti'].includes(tipo)?tipo:'liga';
}
function copaDiseno(tipo,s=64,nombre=''){
 const k=trofeoDeCompetencia(tipo,nombre),oro=['liga','mundo','media'].includes(k),metal=oro?'#e6bd62':'#dce5eb',sombra=oro?'#825b22':'#687c89';
 const formas={
 liga:'<path d="M29 12h42l-4 43q-17 25-34 0Z"/><path d="M29 20H15v12q0 18 20 18M71 20h14v12q0 18-20 18" fill="none" stroke-width="5"/><path d="M46 65h8v17H37v7h26v-7H54"/>',
 copa:'<path d="M28 19h44v17q-2 23-22 23T28 36Z"/><path d="M28 25H13v8q0 19 22 19M72 25h15v8q0 19-22 19" fill="none" stroke-width="5"/><path d="M46 59h8v22H35v8h30v-8H54"/>',
 media:'<path d="m33 7 17 23 17-23h12L61 42H39L21 7Z" fill="#87a8a3"/><circle cx="50" cy="59" r="25"/><path d="m50 42 5 10 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z" fill="#fff0bd"/>',
 libertadores:'<circle cx="50" cy="28" r="16"/><path d="M47 44h6v24H36v7h28v-7H53M48 5h4v7h-4z"/><path d="M28 76h44l5 15H23Z" fill="#463d34"/><path d="M31 80h38M28 86h44" stroke="#c5b99c"/>',
 orejona:'<path d="M32 20h36v20q0 23-18 25-18-2-18-25Z"/><path d="M32 22C6-8 2 40 34 47M68 22C94-8 98 40 66 47" fill="none" stroke-width="6"/><path d="M46 65h8l4 15H36v10h28V80H58"/>',
 mundo:'<circle cx="50" cy="25" r="17"/><path d="M36 44q26 2 18 34H38q9-19-2-34M64 44Q38 46 46 78h16q-9-19 2-34"/><path d="M35 80h30v10H35Z" fill="#27614e"/>',
 continental:'<path d="M23 12h54L60 70H40Z"/><path d="m32 18 12 45M68 18 56 63" stroke="#fff" opacity=".65" fill="none"/><path d="M42 70h16v10H32v10h36V80H58"/>',
 conti:'<path d="M28 12h44l-9 44-13 13-13-13Z"/><path d="M29 22H14q0 25 23 28M71 22h15q0 25-23 28" fill="none" stroke-width="4"/><path d="M46 67h8v13H32v10h36V80H54"/>'
 };
 return `<svg class="copa-diseno" width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true" style="--metal:${metal}"><ellipse cx="50" cy="94" rx="30" ry="3" fill="#000" opacity=".18"/><g fill="${metal}" stroke="${sombra}" stroke-width="1.6" stroke-linejoin="round">${formas[k]}</g><path d="M41 22v28" stroke="#fff" stroke-width="2" opacity=".35"/></svg>`;
}
trofeo=function(tipo,s,nombre){return copaDiseno(tipo,s||22,nombre);};
function vitrinaTemporada(c){return (c.titulos||[]).length?`<div class="vitrina-temporada">${c.titulos.map(t=>`<article>${copaDiseno(t.tipo,110,t.comp)}<div><span>${t3('CONQUISTADO','CONQUISTADO','WON')}</span><h3>${escapeHTML(t.comp)}</h3><p>${escapeHTML(S.club.n)} · ${t3('Temporada','Temporada','Season')} ${S.temporada}</p></div></article>`).join('')}</div>`:'';}
function memoriaHito(){
 const c=S.calc;if(!c)return;S.albumTemporadas=S.albumTemporadas||[];
 const id=S.temporada+'|'+S.club.n,i=S.albumTemporadas.findIndex(h=>h.id===id);
 const d=datosEdicion(),h={id,t:S.temporada,club:S.club.n,titulos:(c.titulos||[]).map(t=>({tipo:t.tipo,comp:t.comp})),pos:c.pos,exp:c.exp,headline:d.headline,dir:S.vars.dir,hin:S.vars.hin,auto:S.auto};
 if(i<0)S.albumTemporadas.push(h);else S.albumTemporadas[i]=h;
 S.albumTemporadas=S.albumTemporadas.slice(-30);
}
const _reporteAtmosfera=pintarReporte;
pintarReporte=function(){
 _reporteAtmosfera();memoriaHito();const root=document.querySelector('#s-resolucion');if(!root)return;
 const d=datosEdicion(),tit=d.tit.length,et=t3('CAPÍTULO','CAPÍTULO','CHAPTER')+' '+String(S.temporada).padStart(2,'0')+' / '+t3('CIERRE DE TEMPORADA','FIM DE TEMPORADA','SEASON END');
 root.insertAdjacentHTML('afterbegin',escenaClub(S.club,S.division,et,tit?t3('Esto ya es parte de tu historia.','Isto já faz parte da sua história.','This is part of your story now.'):d.negativo?t3('También se construye después del golpe.','Também se constrói depois do golpe.','There is work to do after the setback.'):t3('Un año que deja una base.','Um ano que deixa uma base.','A year that leaves a foundation.'),d.headline,'hito-temporada')+vitrinaTemporada(S.calc));
 const album=(S.albumTemporadas||[]).filter(h=>h.t<S.temporada).slice(-3);
 if(album.length)root.querySelector('.detalle-temporada').insertAdjacentHTML('beforebegin',`<details class="album-carrera"><summary>${t3('Las temporadas que te trajeron hasta acá','As temporadas que trouxeram você até aqui','The seasons that brought you here')}</summary><div>${album.map(h=>`<article><span>${h.t}</span><b>${escapeHTML(h.club)}</b><p>${escapeHTML(h.headline)}</p><small>${h.pos?h.pos+'º · ':''}${h.titulos.length} ${t3('títulos','títulos','titles')}</small></article>`).join('')}</div></details>`);
};
const _plantelAtmosfera=pintarPlantel;
pintarPlantel=function(){_plantelAtmosfera();const root=document.querySelector('#s-plantel');if(!root)return;const anterior=(S.albumTemporadas||[]).filter(h=>h.t<S.temporada).at(-1);root.insertAdjacentHTML('afterbegin',escenaClub(S.club,S.division,t3('TEMPORADA','TEMPORADA','SEASON')+' '+String(S.temporada).padStart(2,'0'),t3('La historia sigue acá.','A história continua aqui.','The story continues here.'),anterior?t3(`Venís de ${anterior.club}: ${anterior.pos?anterior.pos+'º · ':''}${anterior.titulos.length} títulos. El próximo capítulo empieza con este grupo.`,`Você vem de ${anterior.club}. O próximo capítulo começa com este grupo.`,`You arrive from ${anterior.club}. The next chapter starts with this group.`):t3('Un lugar, un grupo y una idea por construir.','Um lugar, um grupo e uma ideia para construir.','A place, a squad and an idea to build.'),'inicio-temporada'));};
const _vivoAtmosfera=pintarVivo;
pintarVivo=function(){_vivoAtmosfera();const root=document.querySelector('#s-partido'),esc=root?.querySelector('.banco-escena');if(esc)esc.style.backgroundImage=`linear-gradient(0deg,#071015ef,#07101525),url('${fotoPartido(tmp.vivo.info)}')`;if(root)instalarAudioUI(root);};

// Un solo festejo por evento, con marcador y autor. No se sacude toda la pantalla.
function celebrarGol(e){
 const V=tmp.vivo;if(!V||e._celebrado)return;e._celebrado=true;sonidoGol(e);
 const root=document.querySelector('#s-partido');if(!root)return;
 root.querySelector('.gol-momento')?.remove();const mio=e.l===(V.info.soyA?'a':'b'),el=document.createElement('div');el.className='gol-momento '+(mio?'propio':'rival');el.setAttribute('role','status');
 el.innerHTML=`<span>${e.m}' · ${escapeHTML(mio?S.club.n:V.info.rival.club.n)}</span><b>${t3('GOL','GOL','GOAL')} <em>${V.marc.join(' – ')}</em></b><strong>${escapeHTML(e.nom||'')}</strong><small>${escapeHTML(nomPatron(e.pat))}</small>`;
 root.appendChild(el);setTimeout(()=>el.remove(),2800);
}
function sonidoGol(e){if(e._sonado)return;e._sonado=true;sonar(e.l===soyLado()?'gol':'golrival');}

// Cantera: el origen no depende de la edad ni se borra al empezar otra temporada.
function registrarCanterano(j,desde,hasta,t=S.temporada){
 const a=j.canteraDT||={club:S.club.n,nivel:j.rt,primera:t,ascensos:[],campanas:{}};
 j.canterano=true;
 if(!a.ascensos.some(x=>x.t===t&&x.hasta===hasta))a.ascensos.push({t,desde,hasta});
 return a;
}
function recuperarCantera(){
 if(!S.club||S.esSeleccion)return;
 for(const j of S.plantel){
  if((j.canterano||j.subido)&&!j.canteraDT)j.canteraDT={club:S.club.n,nivel:null,primera:null,ascensos:[],campanas:{}};
 }
}
function datosCantera(j){
 const a=j.canteraDT;if(!a)return null;
 const h=Object.entries(a.campanas).filter(([t])=>Number(t)!==S.temporada).map(([,x])=>x);
 return {a,pj:(j.st?.pj||0)+h.reduce((n,x)=>n+x.pj,0),g:(j.st?.g||0)+h.reduce((n,x)=>n+x.g,0),delta:a.nivel==null?null:j.rt-a.nivel};
}
function etiquetaCantera(j){return j.canteraDT?'<span class="sello-cantera">'+t3('CANTERA','BASE','ACADEMY')+'</span>':'';}
function fichaCantera(j){
 const d=datosCantera(j);if(!d)return '';
 const {a,pj,g,delta}=d,ultimo=a.ascensos.at(-1);
 return `<div class="ficha-cantera">${etiquetaCantera(j)} <b>${escapeHTML(a.club)}</b><p>${ultimo?t3('Promovido por vos','Promovido por você','Promoted by you')+' · '+t3('Temporada','Temporada','Season')+' '+ultimo.t+' · '+tDiv(DIVISIONES[ultimo.hasta].n):t3('Formado en el club','Formado no clube','Club-trained')}</p><p>${pj} ${t3('partidos','jogos','matches')} · ${g} ${t3('goles','gols','goals')}${delta==null?'':' · '+sg(delta)+' '+t3('de nivel desde que subió','de nível desde a promoção','rating since promotion')}</p></div>`;
}
const _fichaCantera=fichaJugadorInterior;
fichaJugadorInterior=function(j){return _fichaCantera(j)+(j?fichaCantera(j):'');};
const _cierreCantera=aplicarCierre;
aplicarCierre=function(c){
 _cierreCantera(c);
 for(const j of S.plantel)if(j.canteraDT)j.canteraDT.campanas[S.temporada]={pj:j.st?.pj||0,g:j.st?.g||0,nivel:j.rt};
};
function prospectoCantera(){
 const key=S.club.n+'|'+S.temporada;
 if(S.prospectoCantera?.key===key)return S.prospectoCantera;
 const rng=S.rng;
 try{S.rng=mul32(hashS(key+'|captacion'));const g=R.el(['DEF','MED','ATA']),j=nuevoJugador(g,nivelBaseDe(S.club.niv,3)-9,2,R.e(17,19),S.club.p);posDe(j);return S.prospectoCantera={key,j,subio:false};}finally{S.rng=rng;}
}
function promoverProspecto(){
 if(S.pant!=='plantel'||S.division!==3||S.esSeleccion)return;
 const p=prospectoCantera();if(p.subio)return;
 const j={...p.j};registrarCanterano(j,2,3);prepJug(j);j.nuevo=true;S.plantel.push(j);p.subio=true;
 tmp.vistaJugador=j;verPlantel();
}
function panelCantera(resumen=false){
 const pl=S.plantel.filter(j=>j.canteraDT);
 const p=!resumen&&!S.esSeleccion&&S.division===3?prospectoCantera():null;
 if(!pl.length&&!p)return '';
 return `<section class="panel-cantera">${cabeceraCantera(S.club)}<div>${pl.map(j=>{const d=datosCantera(j);return `<article>${etiquetaCantera(j)}<b>${escapeHTML(j.nom)}</b><p>${escapeHTML(posTxt(j))} · ${j.ed} ${T('anios')} · ${t3('Nivel','Nível','Rating')} ${j.rt}</p><small>${resumen?(j.st?.pj||0):d.pj} ${t3('partidos','jogos','matches')} · ${resumen?(j.st?.g||0):d.g} ${t3('goles','gols','goals')}${d.delta==null?'':' · '+sg(d.delta)+' '+t3('de nivel','de nível','rating')}</small></article>`;}).join('')}</div>${p&&!p.subio?`<details class="cantera-prospecto"><summary>${t3('Ver recomendación de Reserva','Ver recomendação da base','See academy recommendation')}</summary><p><b>${escapeHTML(p.j.nom)}</b> · ${escapeHTML(posTxt(p.j))} · ${p.j.ed} ${T('anios')} · ${t3('Nivel','Nível','Rating')} ${p.j.rt}</p><p>${t3('Podés sumar a un juvenil por temporada. Su progreso se registra cuando juega.','Pode subir um jovem por temporada. Seu progresso é registrado quando joga.','You can promote one prospect per season. Their progress is tracked when they play.')}</p><button class="btn sec compacto" onclick="promoverProspecto()">${t3('Promover al plantel','Promover ao elenco','Promote to the squad')}</button></details>`:''}</section>`;
}
function cabeceraCantera(club){
 const l=LUGARES_CLUB[club?.n];
 return `<header class="cantera-lugar" style="--escena:${cssFoto(arteCantera(club))}"><div><p class="etq">${t3('EL FUTURO SE ENTRENA ACÁ','O FUTURO TREINA AQUI','THE FUTURE TRAINS HERE')}</p><h3>${escapeHTML(l?.cantera||t3('El camino de la cantera','O caminho da base','The academy pathway'))}</h3><p>${escapeHTML(club.n)}${l?' · '+l.ciudad:''} · ${t3('Formación','Formação','Development')}</p></div></header>`;
}
const _escenaPlantelLugar=escenaPlantel;
escenaPlantel=function(inner){
 const base=_escenaPlantelLugar(inner);if(!LUGARES_CLUB[S.club?.n])return base;
 return base.replace('class="v14-escena practica"','class="v14-escena practica practica-con-lugar"')
  .replace('style="',`style="--cantera-lugar:${cssFoto(arteCantera(S.club))};`)
  .replace(`<b>${escapeHTML(S.club.n)}</b>`,`<b>${escapeHTML(S.club.n)}</b><span>${escapeHTML(nombreCancha(S.club,2))}</span>`);
};
const _plantelCantera=pintarPlantel;
pintarPlantel=function(){recuperarCantera();_plantelCantera();const root=document.querySelector('#s-plantel');root?.querySelector('.contexto-club')?.insertAdjacentHTML('afterend',panelCantera());};
const _reporteCantera=pintarReporte;
pintarReporte=function(){_reporteCantera();document.querySelector('#s-resolucion .diario-edicion')?.insertAdjacentHTML('afterend',panelCantera(true));};
