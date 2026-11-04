// v13: palabras propias, intención revisable y efectos contextuales acotados.
// No es un LLM ni un detector de emociones. Las cifras son reglas de juego.
function prepararCharla(intermedio){
 const V=tmp.vivo,once=intermedio?(V.info.soyA?V.A:V.B).once:miEquipo(V.info.rival).once;
 return {intermedio:!!intermedio,once,ctx:contextoArenga(V),borrador:'',intencion:'',aplicada:false,revision:false};
}
abrirArenga=function(){
 const V=tmp.vivo;V.charlaAplicada=false;V.charlaDescansoV=null;V.arenga=prepararCharla(false);
 S.plantel.forEach(j=>delete j._ar);pintarArenga();ir('partido');
};
function cuerpoCharla(A){
 if(A.aplicada)return `<div class="gd-charla-respuesta" role="status"><h3>${t3('La palabra queda.','A palavra fica.','Your words remain.')}</h3><blockquote>${escapeHTML(A.borrador)}</blockquote><p>${A.informe}</p><details><summary>${t3('Ver devolución del cuerpo técnico','Ver avaliação da comissão','Staff feedback')}</summary><p>${A.detalle}</p></details></div>`;
 const V=tmp.vivo,yo=V.info.soyA?0:1;
 return `<p>${A.intermedio?t3(`Vamos ${V.marc[yo]}–${V.marc[1-yo]}. El grupo necesita una lectura de lo que pasó y una tarea para volver.`,`Placar ${V.marc[yo]}–${V.marc[1-yo]}. Leia o jogo e proponha uma tarefa.`,`The score is ${V.marc[yo]}–${V.marc[1-yo]}. Read the half and give the team a task.`):A.ctx.notas.join(' ')}</p><p>${t3('¿Qué necesita escuchar este grupo ahora? Hablales con tus palabras. Podés dejar que salgan sin charla.','O que este grupo precisa ouvir? Use suas palavras.','What does this group need to hear now? Use your own words, or let them play without a talk.')}</p>${editorDiscurso('arenga',A.borrador)}<p class="nota-dato">${t3('El dictado convierte voz en texto. La revisión local reconoce algunas palabras; vos confirmás la intención. No mide el tono de voz, el acento ni tu forma de hablar.','O ditado transcreve. A revisão local não avalia voz nem sotaque.','Dictation transcribes speech. The local review cannot assess vocal tone, accent or delivery.')}</p>`;
}
pintarArenga=function(){
 const A=tmp.vivo.arenga;$('#s-partido').dataset.fase='arenga';
 $('#s-partido').innerHTML=`<div class="arenga gd-charla"><div class="escena-vestuario">${banderaInterior(S.club)}</div><p class="etq">${escapeHTML(S.club.n)} · ${t3('VESTUARIO','VESTIÁRIO','DRESSING ROOM')}</p><h2 class="disp">${t3('Antes de salir.','Antes de entrar.','Before we walk out.')}</h2><div class="huella-idea">${escapeHTML(lecturaIdentidad())}</div>${cuerpoCharla(A)}<div class="acciones"><button class="btn ${A.aplicada?'':'sec'}" onclick="salirDeArenga(true)">${A.aplicada?t3('A la cancha','Para o campo','Out we go'):t3('Salir sin charla','Sair sem conversa','Go out without a talk')}</button></div></div>`;cabecera();
};
const _revisionAntesCharla=revisarDiscurso;
revisarDiscurso=function(ctx){
 if(ctx!=='arenga'){_revisionAntesCharla(ctx);return;}
 detenerDictado();const A=tmp.vivo.arenga;if(A.aplicada)return;
 A.borrador=($('#discurso-libre').value||'').trim().slice(0,1800);const l=lecturaDiscurso(A.borrador);A.lectura=l;
 const box=$('#discurso-revision');if(l.palabras<3){box.innerHTML=`<p role="alert">${t3('Escribí una frase antes de revisarla.','Escreva uma frase.','Write a sentence first.')}</p>`;return;}
 A.revision=true;A.textoRevisado=A.borrador;
 box.innerHTML=`<h3>${t3('Revisá el sentido de tu mensaje','Revise o sentido','Review your meaning')}</h3><p>${l.segura?t3('Detecté estas señales; podés corregirlas.','Revise estas sugestões.','Review these suggested signals.'):t3('No reconozco con seguridad tu intención. Elegila vos: eso no te penaliza.','Escolha sua intenção; sem penalização.','Choose your intent; uncertain wording is not penalised.')}</p><label>${t3('Qué buscás provocar','O que você procura','What are you aiming for?')}<select id="charla-intencion">${TONOS.map(t=>`<option value="${t}" ${(A.intencion||l.ranking[0]||'grupo')===t?'selected':''}>${nomTono(t)}</option>`).join('')}</select></label><div class="gd-senales">${[['tarea',l.concreta,t3('Di una tarea concreta','Dei uma tarefa concreta','I gave a concrete task')],['apoyo',l.grupo,t3('Ofrecí ayuda al grupo','Ofereci apoio','I offered support')],['amenaza',l.agresion,t3('Amenacé o humillé','Ameacei ou humilhei','I threatened or humiliated players')],['garantia',l.garantia,t3('Garanticé un resultado','Garanti um resultado','I guaranteed a result')]].map(([k,v,n])=>`<label><input id="charla-${k}" type="checkbox" ${v?'checked':''}>${n}</label>`).join('')}</div><p class="nota-dato">${t3('No hay una frase ganadora. Una exigencia puede activar a unos y tensar a otros; repetir el mismo discurso desgasta su efecto.','Não há frase vencedora. A reação depende do contexto.','There is no winning phrase. Reactions depend on context, trust and repetition.')}</p><button class="btn" onclick="darCharlaPropia()">${t3('Decirlo al plantel','Falar ao grupo','Address the squad')}</button>`;
};
function evaluarCharla(A,senales,intencion,estado=S){
 const texto=normalizarCharla(A.borrador),prev=(estado.diarioDT||[]).filter(x=>x.tipo==='charla'&&x.club===estado.club.n).slice(-3);
 const repetida=prev.some(x=>normalizarCharla(x.texto)===texto);
 const reacciones=A.once.map(o=>{
   const j=o.jug,v=vinculoJugador(j),contexto=(A.ctx.c[intencion]||0);
   let valor=(REACCION[caracter(j)][intencion]||0)*.12+contexto*.1+(v.confianza-50)/250;
   if(senales.tarea)valor+=.10*(.5+v.rol/100);
   if(senales.apoyo)valor+=.08;
   if(senales.amenaza)valor-=.45;
   if(senales.garantia)valor-=.2;
   if(intencion==='bronca'&&(j.fat||0)>55)valor-=.2;
   if(A.intermedio){const V=tmp.vivo,k=V.info.soyA?0:1,d=V.marc[k]-V.marc[1-k];if(d<0&&intencion==='calma')valor+=.12;if(d>1&&intencion==='bronca')valor-=.18;}
   if(repetida)valor-=.18;
   return {j,valor:clamp(valor,-1,1)};
 });
 const valor=reacciones.reduce((n,r)=>n+r.valor,0)/Math.max(1,reacciones.length);
 return {reacciones,valor,repetida,efecto:Math.round(valor*60)/1000};
}
function aplicarCharlaPropia(A,senales,intencion){
 if(A.aplicada)return false;
 const r=evaluarCharla(A,senales,intencion);A.aplicada=true;A.intencion=intencion;A.senales=senales;A.resultado=r.valor;
 r.reacciones.forEach(({j,valor})=>{const v=vinculoJugador(j);j._ar=clamp((j._ar||0)+valor*3,-4,4);v.confianza=clamp(v.confianza+(senales.amenaza?-3:valor>.1?1:valor<-.1?-1:0),0,100);if(senales.tarea)v.rol=clamp(v.rol+1,0,100);});
 const delta=r.valor>.15?1:r.valor<-.15?-2:0;S.vars.ves=clamp(S.vars.ves+delta,0,100);
 if(A.intermedio)tmp.vivo.charlaDescansoV=r.efecto;else{tmp.vivo.arengaV=r.efecto;tmp.vivo.arengaTxt=r.valor;tmp.vivo.charlaAplicada=true;}
 prepararIdentidadDT();S.diarioDT.push({t:S.temporada,tipo:'charla',club:S.club.n,rival:tmp.vivo.info.rival.club.n,texto:A.borrador,intencion,senales,intermedio:A.intermedio,efecto:delta});S.arengaUlt=[intencion];
 A.informe=r.valor>.15?t3('El grupo recoge el mensaje. Hay más disposición para sostener la tarea.','O grupo acolhe a mensagem.','The group takes the message on board.'):r.valor<-.15?t3('El mensaje cargó de tensión el vestuario. No todos lo recibieron como esperabas.','A conversa aumentou a tensão.','The message added tension. Not everyone received it as intended.'):t3('Te escucharon. La respuesta es mixta: ahora hay que sostenerlo en la cancha.','A resposta foi mista.','They listened. The response is mixed; the work on the pitch comes next.');
 A.detalle=t3(`Confianza colectiva ${sg(delta)}. ${r.repetida?'El grupo ya escuchó este discurso. ':''}La reacción individual acompaña este partido y la tanda; no garantiza el resultado.`,`Confiança coletiva ${sg(delta)}. O efeito não garante o resultado.`,`Collective trust ${sg(delta)}. The effect does not guarantee a result.`);return true;
}
function darCharlaPropia(){
 const A=tmp.vivo.arenga;if(!A.revision||A.aplicada)return;
 // Si el texto cambió después de revisarlo, la interpretación debe revisarse otra vez.
 if($('#discurso-libre').value.trim()!==A.textoRevisado){revisarDiscurso('arenga');return;}
 const senales=Object.fromEntries(['tarea','apoyo','amenaza','garantia'].map(k=>[k,$('#charla-'+k).checked]));
 aplicarCharlaPropia(A,senales,$('#charla-intencion').value);detenerDictado();
 if(A.intermedio)$('#gd-charla-descanso').innerHTML=cuerpoCharla(A);else pintarArenga();
}
salirDeArenga=function(){
 const V=tmp.vivo;if(V.charlaIniciada)return;V.charlaIniciada=true;
 if(!V.arenga?.aplicada){V.arengaV=0;V.arengaTxt=null;}
 detenerDictado();arrancarVivo();
};
const _descansoCharla=pintarEntretiempo;
pintarEntretiempo=function(peligro,fuerte){
 _descansoCharla(peligro,fuerte);const V=tmp.vivo;
 if(!V.arenga?.intermedio)V.arenga=prepararCharla(true);
 $('#vvPanel .acciones').insertAdjacentHTML('beforebegin',`<div id="gd-charla-descanso" class="gd-charla"><h3>${t3('Tus palabras en el descanso','Suas palavras no intervalo','Your half-time words')}</h3>${cuerpoCharla(V.arenga)}</div>`);
};
