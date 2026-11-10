// Dictado opcional Web Speech + lectura local revisable. Sin claves ni LLM externo.
// Nunca se puntúa volumen, acento ni fluidez. Una lectura desconocida no penaliza.
const VOCABULARIO_CHARLA={
 calma:['respiren','respirar','tranquilos','calma','sin apuro','paciencia','respirem','calm','breathe','relax','no se apuren'],
 orgullo:['orgullo','camiseta','escudo','historia','orgulho','pride','badge','shirt'],
 bronca:['bronca','hambre','callar','ningunearon','raiva','anger','hungry','fight'],
 tactica:['presion','presionar','bloque','marca','marcas','lateral','espalda','pelota','pase','pases','salida','centro','triangulo','tactica','press','pass','shape','ball','backline','meio','bola','marcacao'],
 grupo:['juntos','equipo','companero','companeros','grupo','ayuda','ayudar','cubrir','cubrimos','hermano','todos','time','equipe','together','team','cover','each other'],
 hinchada:['hinchada','tribuna','gente','barrio','familia','torcida','fans','supporters','crowd']
};
const normalizarCharla=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s.,;!?'-]/g,' ').replace(/\s+/g,' ').trim();
function lecturaDiscurso(texto){
  const t=normalizarCharla(texto), partes=t.split(/[.!?;]+/).filter(Boolean), tonos=[],conteo=Object.fromEntries(TONOS.map(k=>[k,0]));
  const frases=partes.length?partes:[t];
  const reconocer=frase=>{
    const hits=[];
    Object.entries(VOCABULARIO_CHARLA).forEach(([tono,palabras])=>palabras.forEach(p=>{
      const exp=new RegExp('(^|[^a-z])'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z])','g');
      for(const match of frase.matchAll(exp)){
        const pref=frase.slice(Math.max(0,match.index-28),match.index).split(/\s+/).filter(Boolean).slice(-3).join(' ');
        const negado=/\b(no|nunca|not|never|nao)\b/.test(pref)&&p!=='no se apuren';
        if(!negado){conteo[tono]++;hits.push({tono,pos:match.index});}
      }
    }));
    hits.sort((a,b)=>a.pos-b.pos);return hits;
  };
  frases.forEach(f=>{const h=reconocer(f);if(h.length)tonos.push(h[0].tono);});
  const ranking=Object.entries(conteo).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
  const total=ranking.reduce((a,x)=>a+x[1],0), palabras=t.split(/\s+/).filter(Boolean).length;
  const propuestas=[tonos[0],ranking[0]&&ranking[0][0],tonos[tonos.length-1]];
  const elegidos=[];propuestas.concat(ranking.map(x=>x[0])).filter(Boolean).forEach(x=>{if(!elegidos.includes(x)&&elegidos.length<3)elegidos.push(x);});
  const agresion=/\b(inutiles|idiotas|verguenza|humillar|fracasados|los voy a matar|useless|idiots|worthless)\b/.test(t);
  const garantia=/\b(ganamos seguro|vamos a ganar seguro|garantizo|campeones seguro|we will definitely win|guarantee)\b/.test(t);
  const cassette=/\b(partido a partido|lo importante es|respeto al rival|daremos todo|game by game|one game at a time)\b/.test(t);
  return {tonos:elegidos,ranking:ranking.map(x=>x[0]),palabras,segura:total>=3&&palabras>=6,agresion,garantia,cassette,
    concreta:conteo.tactica>=2,grupo:conteo.grupo>0,normalizado:t};
}
let dictadoActivo=null;
function motorDictado(){return window.SpeechRecognition||window.webkitSpeechRecognition||null;}
function detenerDictado(){if(dictadoActivo){const r=dictadoActivo;dictadoActivo=null;try{r.abort();}catch(e){}}}
function editorDiscurso(contexto,valor){
  const disponible=!!motorDictado();
  return `<div class="voz-editor"><label for="discurso-libre">${contexto==='prensa'?t3('Tu respuesta','Sua resposta','Your answer'):t3('Decilo con tus palabras','Diga com suas palavras','Use your own words')}</label>
    <textarea id="discurso-libre" maxlength="1800" rows="4" oninput="guardarBorradorDiscurso('${contexto}',this.value)" placeholder="${escapeHTML(t3('Podés escribir o dictar. Después revisás lo que entendió el juego.','Pode escrever ou ditar. Depois revise a leitura do jogo.','Type or dictate. Then review what the game understood.'))}">${escapeHTML(valor||'')}</textarea>
    <div class="voz-controles"><button class="btn sec" id="dictar-discurso" ${disponible?'':'disabled'} onclick="dictarDiscurso('${contexto}')">${t3('Dictar','Ditar','Dictate')}</button><button class="btn sec" id="detener-discurso" onclick="detenerDictado()">${t3('Detener','Parar','Stop')}</button><button class="btn" onclick="revisarDiscurso('${contexto}')">${t3('Revisar mi mensaje','Revisar mensagem','Review my message')}</button></div>
    <p class="nota-dato">${disponible?t3('Al tocar Dictar, tu navegador pide micrófono y puede enviar el audio a su servicio de reconocimiento. El juego no guarda audio. Podés escribir sin micrófono.','Ao ditar, o navegador pede microfone e pode enviar áudio ao serviço de reconhecimento. O jogo não guarda áudio.','Dictate asks your browser for microphone access; it may send audio to its recognition service. The game stores no audio. Typing needs no microphone.'):t3('Este navegador no ofrece dictado. Podés escribir el mismo mensaje y tiene el mismo efecto.','Este navegador não oferece ditado. Escrever tem o mesmo efeito.','This browser has no dictation support. Typing has the same effect.')}</p><p id="voz-estado" role="status" aria-live="polite"></p><div id="discurso-revision"></div></div>`;
}
function guardarBorradorDiscurso(ctx,txt){
  if(ctx==='arenga'&&tmp.vivo&&tmp.vivo.arenga)tmp.vivo.arenga.borrador=txt;
  else if(ctx==='prensa')tmp.borradorPrensa=txt;
}
// Textos originales: pautas de calma, tarea concreta y responsabilidad compartida.
// Inspiración documental y límites en docs/V10_DISENO_Y_PLAYTEST.md; no son citas.
function ejemploDiscurso(i){
  const textos=[
    t3('Respiren. Si recibimos de espaldas, damos apoyo al compañero. Juntos y sin apuro.','Respirem. Se recebermos de costas, apoiamos o companheiro. Juntos e sem pressa.','Breathe. If we receive facing our own goal, support the teammate. Together, no rush.'),
    t3('La camiseta importa. Hoy la defendemos con ayudas: si uno salta a presionar, el compañero cubre su espalda.','A camisa importa. Se um pressionar, o companheiro cobre as costas.','The shirt matters. If one presses, a teammate covers behind.'),
    t3('No les prometo ganar. Les pido jugar juntos: pase, apoyo y una segunda opción para el que tiene la pelota.','Não prometo vencer. Peço passe, apoio e uma segunda opção para quem tem a bola.','I promise no win. Play together: pass, support and a second option for the player on the ball.')
  ];
  const box=document.getElementById('discurso-libre');if(!box)return;box.value=textos[i];guardarBorradorDiscurso('arenga',box.value);document.getElementById('discurso-revision').innerHTML='';
}
function dictarDiscurso(ctx){
  detenerDictado();const Motor=motorDictado(),box=document.getElementById('discurso-libre'),status=document.getElementById('voz-estado');if(!Motor||!box)return;
  const r=new Motor();dictadoActivo=r;r.lang={es:'es-UY',pt:'pt-BR',en:'en-US'}[IDIOMA]||'es-UY';r.interimResults=true;r.continuous=false;
  const base=box.value.trim();let finalizado='';
  r.onresult=e=>{if(dictadoActivo!==r||!box.isConnected)return;let parcial='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)finalizado+=' '+e.results[i][0].transcript;else parcial+=' '+e.results[i][0].transcript;}box.value=(base+' '+finalizado+' '+parcial).trim().slice(0,1800);guardarBorradorDiscurso(ctx,box.value);};
  r.onerror=e=>{if(!status.isConnected)return;status.textContent=e.error==='not-allowed'?t3('No se habilitó el micrófono. Podés escribir.','Microfone não permitido. Pode escrever.','Microphone was not allowed. You can type.'):t3('No pudimos completar el dictado. Revisá el texto o escribí tu respuesta.','Revise o texto ou escreva a resposta.','Dictation did not finish. Review or type your answer.');dictadoActivo=null;};
  r.onend=()=>{if(dictadoActivo===r)dictadoActivo=null;if(status.isConnected&&/Escuchando|Ouvindo|Listening/.test(status.textContent))status.textContent=t3('Dictado terminado. Revisá antes de usarlo.','Ditado finalizado. Revise antes de usar.','Dictation finished. Review before using it.');};
  try{r.start();status.textContent=t3('Escuchando… tocá Detener cuando termines.','Ouvindo… toque Parar ao terminar.','Listening… press Stop when finished.');}catch(e){dictadoActivo=null;status.textContent=t3('El dictado no está disponible. Podés escribir.','Ditado indisponível. Pode escrever.','Dictation is unavailable. You can type.');}
}
function revisarDiscurso(ctx){
  detenerDictado();const texto=(document.getElementById('discurso-libre')||{}).value||'', l=lecturaDiscurso(texto),box=document.getElementById('discurso-revision');if(!box)return;
  guardarBorradorDiscurso(ctx,texto);
  if(l.palabras<3){box.innerHTML=`<p role="alert">${t3('Escribí al menos una frase antes de revisarla.','Escreva uma frase antes de revisar.','Write a sentence before reviewing.')}</p>`;return;}
  if(ctx==='arenga'){
    tmp.vivo.arenga.lectura=l;
    box.innerHTML=`<p>${t3('Lectura local por palabras e intenciones. No evalúa tu voz. Corregí los tres tonos antes de dar la charla.','Leitura local por palavras. Corrija os três tons antes da conversa.','Local keyword reading, not a voice assessment. Correct the three tones before giving the talk.')}</p>${!l.segura?`<p class="alerta">${t3('No hay una lectura segura. Elegí los tonos; no se aplica ninguna penalización por eso.','Leitura incerta. Escolha os tons; não há penalização.','Uncertain reading. Choose the tones; there is no penalty for uncertainty.')}</p>`:''}
      ${LUGARES.map((k,i)=>`<label>${nomLugar(k)}<select id="tono-libre-${i}"><option value="">${t3('Elegir tono','Escolher tom','Choose a tone')}</option>${TONOS.map(t=>`<option value="${t}" ${l.tonos[i]===t?'selected':''}>${nomTono(t)}</option>`).join('')}</select></label>`).join('')}
      <p class="nota-dato">${t3('Las señales del vestuario importan más que una frase famosa. Una amenaza puede tensar al grupo; una promesa imposible agrega presión.','O estado do grupo pesa mais que uma frase famosa.','The dressing room matters more than a famous line. Threats can unsettle players; impossible promises add pressure.')}</p><button class="btn" onclick="usarDiscursoArenga()">${t3('Dar esta charla','Dar esta conversa','Give this talk')}</button>`;
  }else{
    tmp.lecturaPrensa=l;
    box.innerHTML=`<p>${l.cassette?t3('Suena a respuesta de cassette: cuidás el mensaje, pero contás poco.','Resposta genérica: protege a mensagem, mas explica pouco.','A stock answer: careful, but says little.'):l.segura?t3('Hay un mensaje reconocible. Revisá la intención antes de responder.','Mensagem reconhecível. Revise a intenção.','A recognisable message. Review its intent before answering.'):t3('No puedo interpretar la intención con seguridad. Elegila vos; el texto no se penaliza.','Escolha a intenção; o texto não será penalizado.','Choose the intent yourself; the text is not penalised.')}</p>
      <label>${t3('Qué querés comunicar','O que quer comunicar','Your intent')}<select id="intencion-prensa"><option value="idea">${t3('Sostener mi idea, admitiendo ajustes','Manter a ideia, admitir ajustes','Stand by my idea, allow adjustments')}</option><option value="grupo">${t3('Cuidar al grupo','Proteger o grupo','Protect the team')}</option><option value="resultado">${t3('Prometer resultados','Prometer resultados','Promise results')}</option><option value="cassette">${t3('No dar pistas','Não dar pistas','Give nothing away')}</option></select></label><button class="btn" onclick="responderPrensa()">${t3('Responder','Responder','Answer')}</button>`;
  }
}
function usarDiscursoArenga(){
  const A=tmp.vivo.arenga, tonos=[0,1,2].map(i=>(document.getElementById('tono-libre-'+i)||{}).value);
  if(tonos.some(t=>!TONOS.includes(t))){document.getElementById('voz-estado').textContent=t3('Elegí un tono para cada momento.','Escolha um tom por momento.','Choose a tone for each part.');return;}
  A.ops=tonos.map(t=>({t,txt:nomTono(t)}));A.elegidas=[0,1,2];A.libre=A.borrador;A.lectura=lecturaDiscurso(A.borrador);pintarArenga();
}
const _cuentaArengaV9=cuentaArenga;
cuentaArenga=function(A){
  let n=_cuentaArengaV9(A);
  if(A.lectura&&A.lectura.segura){if(A.lectura.agresion)n-=0.35;if(A.lectura.garantia)n-=0.18;if(A.lectura.concreta&&A.lectura.grupo)n+=0.05;}
  return clamp(n,-1,1);
};
const _pintarArengaV9=pintarArenga;
pintarArenga=function(){
  _pintarArengaV9();const A=tmp.vivo.arenga, root=document.querySelector('#s-partido .arenga');if(!root)return;
  const intro=document.createElement('div');intro.className='huella-idea';intro.innerHTML=`<b>${t3('Tu idea también se escucha','Sua ideia também se ouve','Your idea is heard too')}</b><span>${escapeHTML(lecturaIdentidad())}</span>`;root.insertBefore(intro,root.firstChild);
  if(A.elegidas.length<3){const voz=document.createElement('details');voz.className='discurso-libre';voz.innerHTML=`<summary>${t3('Dar mi propia arenga · escribir o dictar','Minha própria conversa · escrever ou ditar','My own team talk · type or dictate')}</summary><p class="nota-dato">${t3('Puntos de partida para reescribir. No aseguran una buena reacción: leé al grupo.','Pontos de partida para reescrever; observe o grupo.','Starting points to rewrite; read the dressing room.')}</p><div class="pills">${[t3('Calma y una tarea','Calma e tarefa','Calm and a task'),t3('Orgullo y ayuda','Orgulho e apoio','Pride and support'),t3('Grupo sin promesas','Grupo sem promessas','Team without promises')].map((n,i)=>`<button class="pill" onclick="ejemploDiscurso(${i})">${n}</button>`).join('')}</div>${editorDiscurso('arenga',A.borrador)}`;root.appendChild(voz);}
  else if(A.libre){const p=document.createElement('blockquote');p.textContent=A.libre;root.appendChild(p);}
};
const _salirDeArengaV9=salirDeArenga;
salirDeArenga=function(sin){
  const V=tmp.vivo,A=V.arenga;if(V.charlaAplicada)return;
  if(!sin&&A&&A.elegidas.length===3){
    const valor=cuentaArenga(A);V.charlaAplicada=true;
    const delta=valor>0.35?1:valor<-0.15?-2:0;
    S.vars.ves=clamp(S.vars.ves+delta,0,100);
    S.diarioDT=S.diarioDT||[];S.diarioDT.push({t:S.temporada,tipo:'charla',rival:V.info.rival.club.n,efecto:delta,tonos:A.elegidas.map(i=>A.ops[i].t)});
  }
  detenerDictado();_salirDeArengaV9(sin);
};
function abrirConferencia(){
  prepararIdentidadDT();S.prensaTemporada=S.temporada;
  const f=S.formacion||S.sistemaPref;
  $('#s-prensa').innerHTML=`<div class="v14-prensa-escena"><div class="v14-mesa">${S.club?escudo(S.club,56):''}<div class="etq">${t3('SALA DE PRENSA','SALA DE IMPRENSA','PRESS ROOM')}</div></div></div><h2 class="disp">${t3('¿Tu idea se negocia?','Sua ideia se negocia?','Is your idea negotiable?')}</h2><div class="ficha-sit"><p>${t3(`«Llegás con tu ${f}. Si el rival te complica, ¿cambiás todo o sostenés la idea?»`,`«Você chega com seu ${f}. Se o rival complicar, muda tudo ou mantém a ideia?»`,`“You arrive with your ${f}. If the opponent makes it difficult, do you change everything or stand by your idea?”`)}</p></div>${editorDiscurso('prensa',tmp.borradorPrensa)}<button class="btn sec" onclick="tmp.lecturaPrensa=null;cerrarConferencia()">${t3('Sin declaraciones','Sem declarações','No comment')}</button>`;ir('prensa');
}
function responderPrensa(){
  const i=(document.getElementById('intencion-prensa')||{}).value;if(!i)return;
  const l=tmp.lecturaPrensa;
  let d=0,h=0,v=0;
  if(i==='grupo')v=1;if(i==='idea'){d=1;h=1;}if(i==='resultado'){h=2;S.presionPromesa=2;}if(i==='cassette')h=-1;
  // Texto incierto: sólo se aplica la intención que el jugador revisó y confirmó.
  S.vars.dir=clamp(S.vars.dir+d,0,100);S.vars.hin=clamp(S.vars.hin+h,0,100);S.vars.ves=clamp(S.vars.ves+v,0,100);
  S.diarioDT.push({t:S.temporada,tipo:'prensa',intencion:i,cassette:!!(l&&l.cassette)});
  $('#s-prensa').innerHTML=`<h2 class="disp">${t3('La palabra queda','A palavra fica','Your words remain')}</h2><p>${i==='resultado'?t3('La tribuna se ilusiona. El grupo carga con la expectativa: lo van a recordar si la temporada se tuerce.','A torcida se anima. O grupo carrega a expectativa.','The fans are hopeful. The squad carries that expectation.'):i==='grupo'?t3('El grupo se sintió respaldado. Ahora hay que sostenerlo con decisiones.','O grupo se sente apoiado.','The players feel backed. Your decisions must follow through.'):i==='idea'?t3('Dejaste claro un principio: ajustar una jugada no es abandonar tu identidad.','Ajustar uma jogada não é abandonar a identidade.','Adjusting a move does not mean abandoning your identity.'):t3('Cuidaste la información. La tribuna esperaba algo más.','Protegeu a informação. A torcida esperava mais.','You protected information. The fans wanted more.')}<p class="efecto">${t3('Directiva','Diretoria','Board')} ${sg(d)} · ${T('hinchada')} ${sg(h)} · ${T('vestuario')} ${sg(v)}</p><button class="btn" onclick="cerrarConferencia()">${T('seguir')}</button>`;
}
function cerrarConferencia(){detenerDictado();tmp.borradorPrensa='';tmp.lecturaPrensa=null;verPlantel();}
