// v13.3 — Playtest en tablet del 10/11/2026.
// 1) La charla se lee de verdad: vocabulario por raíces, la lectura se muestra subrayada en tu
//    propio texto y la devolución dice qué entendió el vestuario, qué necesitaba y cómo le cayó
//    a cada uno, con una nota de 0 a 10. El texto manda; corregir la lectura es opcional.
// 2) Arreglos chicos: puestos afines (extremo <-> volante del mismo lado, lateral <-> carrilero),
//    resaltar sólo los casilleros válidos, idioma del vestuario sólo si cambia, banner duplicado,
//    tarjetas del ticker que no saltan con los goles, plata visible en las decisiones que la dan.

/* ---------- 1. Lectura de la charla ---------- */
const RAICES_CHARLA={
 calma:['respir','tranquil','calma','paciencia','seren','sin miedo','disfrut','cabeza fria','relaj','confien','confianza','jugar como sabemos','lo que sabemos','sin apuro','no se apuren','calm','breath','enjoy','relax','patience'],
 orgullo:['orgull','camiseta','escudo','historia','demostr','nosotros mismos','merec','dignidad','honor','grandeza','recuerd','record','oportunidad','ultima gota','sudor','dejar todo','dejemos todo','dejen todo','entrega','la vida','esfuerzo','sacrifici','pride','proud','badge','shirt','prove','history','remember','chance'],
 bronca:['bronca','hambre','callar','calla','ningune','revancha','rabia','subestim','no nos respetan','morder','sangre','guerra','furia','raiva','anger','angry','hungry','fight','revenge','doubt'],
 tactica:['presion','presionar','bloque','marca','lateral','espalda','pelota','pase','salida','centro','triangulo','tactica','ordenad','orden','distancia','zona','segunda pelota','transicion','linea','recuper','perfil','amplitud','profundidad','central','volante','delanter','extrem','arquero','primeros minutos','contraataque','pressing','press','pass','shape','ball','space'],
 grupo:['juntos','equipo','companer','grupo','ayud','cubr','herman','todos','nosotros','unid','el de al lado','uno al otro','abrazo','together','team','each other','brother','all of us'],
 hinchada:['hinchada','hincha','tribuna','gente','barrio','familia','torcida','personas','ilusion','suenan','sueno','ciudad','pueblo','vinieron','nos miran','fans','supporters','crowd','city','people']
};
const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
lecturaDiscurso=function(texto){
 const t=normalizarCharla(texto),conteo=Object.fromEntries(TONOS.map(k=>[k,0])),primero={},hallados={};
 Object.entries(RAICES_CHARLA).forEach(([tono,raices])=>raices.forEach(r=>{
  const exp=new RegExp('(^|[^a-z])'+escRe(r),'g');
  for(const m of t.matchAll(exp)){
   const antes=t.slice(Math.max(0,m.index-30),m.index+m[1].length).split(/\s+/).filter(Boolean).slice(-3).join(' ');
   if(/\b(no|nunca|ni|not|never|nao)\b/.test(antes)&&r!=='no se apuren'&&r!=='no nos respetan')continue;
   conteo[tono]++;if(primero[tono]===undefined||m.index<primero[tono])primero[tono]=m.index;
   const pal=t.slice(m.index+m[1].length).split(/[^a-z]/)[0]||r;(hallados[tono]||(hallados[tono]=new Set())).add(r.includes(' ')?r:pal);
  }
 }));
 const ranking=Object.entries(conteo).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 const total=Object.values(conteo).reduce((a,b)=>a+b,0),palabras=t.split(/\s+/).filter(Boolean).length;
 const tonos=Object.keys(primero).sort((a,b)=>primero[a]-primero[b]).slice(0,3);
 const agresion=/\b(inutiles|idiotas|verguenza|humill|fracasados|los voy a matar|cagones|pechos frios|useless|idiots|worthless)/.test(t);
 const garantia=/\b(ganamos seguro|vamos a ganar seguro|garantizo|te lo aseguro|campeones seguro|we will definitely win|guarantee)/.test(t);
 const cassette=/\b(partido a partido|lo importante es sumar|respeto al rival|daremos todo|game by game|one game at a time)/.test(t);
 return {tonos,ranking,palabras,segura:total>=2&&palabras>=5,agresion,garantia,cassette,concreta:conteo.tactica>=2,grupo:conteo.grupo>0,
  normalizado:t,conteo,total,hallados:Object.fromEntries(Object.entries(hallados).map(([k,v])=>[k,[...v].slice(0,4)]))};
};
// subraya en TU texto (no en una versión normalizada) las palabras que el cuerpo técnico leyó
function textoSubrayado(texto){
 const unicas=Object.entries(RAICES_CHARLA).flatMap(([tono,rs])=>rs.filter(r=>!r.includes(' ')).map(r=>[r,tono])).sort((a,b)=>b[0].length-a[0].length);
 return String(texto||'').split(/(\s+)/).map(tok=>{
  if(/^\s*$/.test(tok))return tok;
  const n=normalizarCharla(tok).replace(/[^a-z]/g,'');const hit=n&&unicas.find(([r])=>n.startsWith(r));
  return hit?`<mark class="lec-${hit[1]}" title="${nomTono(hit[1])}">${escapeHTML(tok)}</mark>`:escapeHTML(tok);
 }).join('');
}
const mezclaDe=l=>{const tot=l.total||0;return tot?Object.fromEntries(TONOS.map(k=>[k,(l.conteo[k]||0)/tot])):{};};
function barrasTonos(m){
 const l=Object.entries(m).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
 return l.length?`<div class="lec-barras">${l.map(([k,v])=>`<div class="lec-barra"><span>${nomTono(k)}</span><i><b class="lec-${k}" style="width:${Math.round(v*100)}%"></b></i><em>${Math.round(v*100)}%</em></div>`).join('')}</div>`:'';
}
evaluarCharla=function(A,senales,intencion,estado=S){
 const l=A.lectura||lecturaDiscurso(A.borrador),texto=normalizarCharla(A.borrador);
 let m=mezclaDe(l);
 // si el DT corrigió la lectura, su intención pesa la mitad; si no hubo lectura, pesa todo
 if(!Object.keys(m).length)m={[intencion||'grupo']:1};
 else if(A.corrigio&&intencion){m=Object.fromEntries(TONOS.map(k=>[k,(m[k]||0)/2+(k===intencion?.5:0)]));}
 const prev=(estado.diarioDT||[]).filter(x=>x.tipo==='charla'&&x.club===estado.club.n).slice(-3);
 const repetida=prev.some(x=>normalizarCharla(x.texto)===texto);
 const dom=Object.entries(m).sort((a,b)=>b[1]-a[1])[0][0];
 const tarea=!!(senales.tarea||l.concreta),apoyo=!!(senales.apoyo||l.grupo),amenaza=!!(senales.amenaza||l.agresion),garantia=!!(senales.garantia||l.garantia);
 const reacciones=A.once.map(o=>{
  const j=o.jug,v=vinculoJugador(j);
  let valor=TONOS.reduce((n,k)=>n+(m[k]||0)*((REACCION[caracter(j)][k]||0)*.12+(A.ctx.c[k]||0)*.1),0)+(v.confianza-50)/250;
  if(tarea)valor+=.10*(.5+v.rol/100);
  if(apoyo)valor+=.06;
  if(amenaza)valor-=.45;
  if(garantia)valor-=.2;
  if(l.cassette)valor-=.08;
  if(l.palabras<8)valor-=.05;if(l.palabras>160)valor-=.08;
  if((m.bronca||0)>.4&&(j.fat||0)>55)valor-=.15;
  if(A.intermedio){const V=tmp.vivo,k=V.info.soyA?0:1,d=V.marc[k]-V.marc[1-k];if(d<0&&dom==='calma')valor+=.12;if(d>1&&dom==='bronca')valor-=.18;}
  if(repetida)valor-=.18;
  return {j,valor:clamp(valor,-1,1)};
 });
 const valor=reacciones.reduce((n,r)=>n+r.valor,0)/Math.max(1,reacciones.length);
 const nota=Math.round(clamp(5.5+valor*9,0,10)*10)/10;
 return {reacciones,valor,repetida,efecto:Math.round(valor*60)/1000,mezcla:m,nota,dom,tarea,apoyo,amenaza,garantia,lectura:l};
};
const _aplicarCharlaAjustes=aplicarCharlaPropia;
aplicarCharlaPropia=function(A,senales,intencion){
 if(A.aplicada)return false;
 // se evalúa antes de anotar la charla en el diario (si no, se detecta a sí misma como repetida)
 const ev=evaluarCharla(A,senales,intencion);
 if(!_aplicarCharlaAjustes(A,senales,intencion))return false;
 A.eval=ev;return true;
};
const EMO_VAL=v=>v>=.25?'🔥':v>=.08?'💪':v>-.08?'😐':v>-.25?'😬':'😤';
function devolucionCharla(A){
 const r=A.eval;if(!r)return `<p>${A.detalle}</p>`;
 const pide=Object.entries(A.ctx.c).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
 const lo=Object.entries(r.mezcla).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0).map(x=>x[0]);
 const acierto=lo.slice(0,2).filter(x=>pide.includes(x)).length;
 const orden=r.reacciones.slice().sort((a,b)=>b.valor-a.valor),pocos=orden.slice(0,3).concat(orden.slice(-2).filter(x=>!orden.slice(0,3).includes(x)));
 const chip=(ok,t)=>`<span class="lec-chip ${ok}">${t}</span>`;
 return `<div class="lec-nota"><b>${r.nota.toFixed(1)}</b><span>/10</span><p>${t3('Cómo cayó la charla en el vestuario','Como a conversa caiu no vestiário','How the talk landed')}</p></div>
  <h4>${t3('Lo que entendieron','O que entenderam','What they heard')}</h4>${barrasTonos(r.mezcla)}
  <p class="mini">${lo.slice(0,3).map(k=>`<b>${nomTono(k)}</b>: ${(r.lectura.hallados[k]||[]).map(escapeHTML).join(', ')||'—'}`).join(' · ')}</p>
  <h4>${t3('Lo que necesitaba este vestuario hoy','O que este vestiário precisava hoje','What this room needed today')}</h4>
  <p><b>${pide.map(nomTono).join(' + ')}</b>${A.ctx.notas.length?' — '+escapeHTML(A.ctx.notas.join(' ')):'.'} ${acierto===2?t3('Le diste justo eso.','Você deu exatamente isso.','You gave them exactly that.'):acierto===1?t3('Tocaste una de las dos teclas.','Acertou uma das duas.','You hit one of the two notes.'):t3('Les hablaste de otra cosa.','Falou de outra coisa.','You spoke about something else.')}</p>
  <h4>${t3('Cómo le cayó a cada uno','Como caiu para cada um','How it landed with each player')}</h4>
  <div class="lec-caras">${pocos.map(x=>`<span>${EMO_VAL(x.valor)} <b>${escapeHTML(apellido(x.j.nom))}</b> <em>${escapeHTML(estadoVestuario(x.j,{semilla:'charla'}).split(' · ')[0])}</em></span>`).join('')}</div>
  <div class="lec-chips">${chip(r.tarea?'ok':'',r.tarea?t3('Diste una tarea concreta','Deu uma tarefa concreta','Gave a concrete task'):t3('Sin tarea concreta (hubiera sumado)','Sem tarefa concreta','No concrete task (it would have helped)'))}${chip(r.apoyo?'ok':'',r.apoyo?t3('Hablaste del grupo','Falou do grupo','Talked about the group'):t3('Sin mención al grupo','Sem menção ao grupo','No mention of the group'))}${r.amenaza?chip('mal',t3('Amenaza o humillación (resta mucho)','Ameaça (pesa contra)','Threat or humiliation (costly)')):''}${r.garantia?chip('mal',t3('Prometiste el resultado (presión)','Prometeu o resultado','Promised the result (pressure)')):''}${r.lectura.cassette?chip('mal',t3('Frase hecha','Frase feita','Cliché')):''}${r.repetida?chip('mal',t3('Ya se lo dijiste','Já disse isso','They heard this before')):''}${r.lectura.palabras>160?chip('mal',t3('Muy larga: se pierde el foco','Longa demais','Too long: focus lost')):''}</div>
  <p class="mini">${t3('Efecto en el partido','Efeito no jogo','Match effect')}: ${r.efecto>0?'+':''}${(r.efecto*100).toFixed(1)}% · ${t3('pesa más en el primer tiempo y en los penales. No garantiza el resultado.','pesa mais no primeiro tempo e nos pênaltis.','strongest in the first half and in shoot-outs. It guarantees nothing.')}</p>`;
}
cuerpoCharla=(function(prev){return function(A){
 if(!A.aplicada)return prev(A);
 return `<div class="gd-charla-respuesta" role="status"><h3>${t3('La palabra queda.','A palavra fica.','Your words remain.')}</h3><blockquote>${textoSubrayado(A.borrador)}</blockquote><p>${A.informe}</p><div class="lec-devolucion">${devolucionCharla(A)}</div></div>`;
};})(cuerpoCharla);
const _revisarAjustes=revisarDiscurso;
revisarDiscurso=function(ctx){
 if(ctx!=='arenga'){_revisarAjustes(ctx);const b=document.getElementById('discurso-revision');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});return;}
 detenerDictado();const A=tmp.vivo.arenga;if(A.aplicada)return;
 A.borrador=(($('#discurso-libre')||{}).value||'').trim().slice(0,1800);const l=lecturaDiscurso(A.borrador);A.lectura=l;A.corrigio=false;
 const box=$('#discurso-revision');if(!box)return;
 if(l.palabras<3){box.innerHTML=`<p role="alert">${t3('Escribí una frase antes de revisarla.','Escreva uma frase.','Write a sentence first.')}</p>`;box.scrollIntoView({behavior:'smooth',block:'center'});return;}
 A.revision=true;A.textoRevisado=A.borrador;const m=mezclaDe(l),dom=l.ranking[0]||'grupo';
 box.innerHTML=`<h3>${t3('Así lo leyó tu cuerpo técnico','Assim a comissão leu','How your staff read it')}</h3>
  <blockquote class="lec-texto">${textoSubrayado(A.borrador)}</blockquote>
  ${l.segura?barrasTonos(m):`<p class="alerta">${t3('Casi no encontré palabras que marquen un tono. Elegí qué querés provocar (no penaliza) o reescribilo.','Quase não achei palavras de tom. Escolha a intenção ou reescreva.','Hardly any tone words found. Pick your intent (no penalty) or rewrite.')}</p>`}
  <details ${l.segura?'':'open'}><summary>${t3('Corregir la lectura (opcional)','Corrigir a leitura (opcional)','Correct the reading (optional)')}</summary>
   <label>${t3('Lo que buscás provocar','O que você busca','What you are aiming for')}<select id="charla-intencion" onchange="tmp.vivo.arenga.corrigio=true">${TONOS.map(t=>`<option value="${t}" ${dom===t?'selected':''}>${nomTono(t)}</option>`).join('')}</select></label>
   <div class="gd-senales">${[['tarea',l.concreta,t3('Di una tarea concreta','Dei uma tarefa concreta','I gave a concrete task')],['apoyo',l.grupo,t3('Ofrecí ayuda al grupo','Ofereci apoio','I offered support')],['amenaza',l.agresion,t3('Amenacé o humillé','Ameacei ou humilhei','I threatened or humiliated players')],['garantia',l.garantia,t3('Garanticé un resultado','Garanti um resultado','I guaranteed a result')]].map(([k,v,n])=>`<label><input id="charla-${k}" type="checkbox" ${v?'checked':''}>${n}</label>`).join('')}</div>
  </details>
  <button class="btn" onclick="${l.segura?'':'tmp.vivo.arenga.corrigio=true;'}darCharlaPropia()">${t3('Decirlo al plantel','Falar ao grupo','Say it to the squad')}</button>`;
 box.scrollIntoView({behavior:'smooth',block:'start'});
};

/* ---------- 2. Puestos afines ---------- */
// En el fútbol real un extremo derecho juega de volante por derecha en un 4-2-3-1 sin "adaptarse".
const AFINES={EXD:['MD'],MD:['EXD','CAD'],EXI:['MI'],MI:['EXI','CAI'],LTD:['CAD'],CAD:['LTD','MD'],LTI:['CAI'],CAI:['LTI','MI'],MCO:['MC'],MC:['MCO','MCD'],MCD:['MC']};
encaje=(function(prev){return function(j,rol){const n=prev(j,rol);if(n<=1)return n;const p=posDe(j);return p.some(x=>(AFINES[x]||[]).includes(rol))?1:n;};})(encaje);

/* ---------- 3. Idioma del vestuario: sólo si hay otro idioma ---------- */
necesitaIdioma=(function(prev){return function(){
 const del=IDIOMA_REAL[S.club.p]||IDIOMA;
 if(del===IDIOMA&&S.langClub!==S.club.n){S.langClub=S.club.n;S.idiomaVestuario={idioma:del,interprete:false};return false;}
 return prev();
};})(necesitaIdioma);

/* ---------- 4. Datos de club ---------- */
if(CLUB_INFO.Sevilla)Object.assign(CLUB_INFO.Sevilla,{
 glo:{es:'El rey de la Europa League: siete títulos, el último en 2023.',pt:'O rei da Liga Europa: sete títulos, o último em 2023.',en:'Kings of the Europa League: seven titles, the latest in 2023.'},
 cul:{es:'Nervión no perdona la tibieza. El derbi con el Betis parte la ciudad.',pt:'Nervión não perdoa a frieza. O dérbi com o Betis divide a cidade.',en:'Nervión has no patience for half-measures. The Betis derby splits the city.'}});

/* ---------- 5. Plata en las decisiones que la dan ---------- */
const PLATA_DECISION=[[/^Aceptás la gira$/,8],[/^Aceptás pero llevás solo a la mitad/,4],[/^Decís que no te molesta$/,6]];
tomar=(function(prev){return function(i){
 const idx=S.indicesActuales&&S.indicesActuales[i]>=0?S.indicesActuales[i]:i;
 const txt=(((S.decs[S.decIdx]||[])[2]||[])[idx]||[])[0]||'';
 const p=(PLATA_DECISION.find(([re])=>re.test(txt))||[])[1]||0;
 prev(i);
 if(p&&!S.esSeleccion){S.presupuesto=(S.presupuesto||0)+p;cabecera();
  const d=document.querySelector('#s-decision .deltas');if(d)d.insertAdjacentHTML('beforeend',`<span class="d p">${t3('Plata','Dinheiro','Money')} +${p}</span>`);}
};})(tomar);
