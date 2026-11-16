// v15 — Audio optativo, mezcla persistente y silencio al pausar/ocultar/salir.
const AUDIO_CREDITOS=[['Dan_AudioFile','Football-match_Chanting-crowd_Ambience .stereo.wav','https://freesound.org/people/Dan_AudioFile/sounds/654084/'],['paulw2k','Football-crowd-GOAL.wav','https://freesound.org/people/paulw2k/sounds/196461/']];
let mezclaAudio={activo:false,ambiente:30,efectos:60,cantos:true};
try{const a=JSON.parse(localStorage.getItem('cdt-audio-v15'));if(a){mezclaAudio={activo:a.activo===true,ambiente:clamp(Number(a.ambiente)||0,0,100),efectos:clamp(Number(a.efectos)||0,0,100),cantos:a.cantos!==false};}}catch(e){}
const sonidoEstado={buffers:{},cargando:null,amb:null,fuentes:new Set(),paso:0,fallo:false};
function contextoSonoro(){
 if(!mezclaAudio.activo)return null;
 try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;_ctxAudio=_ctxAudio||new C();if(_ctxAudio.state==='suspended')_ctxAudio.resume().catch(()=>{});return _ctxAudio;}catch(e){return null;}
}
function guardarAudio(){try{localStorage.setItem('cdt-audio-v15',JSON.stringify(mezclaAudio));}catch(e){}}
function audioEnEscena(){return mezclaAudio.activo&&!document.hidden&&S.pant==='partido'&&!!tmp.vivo&&!tmp.vivo.pausa&&!tmp.vivo.res;}
async function cargarSonidos(){
 const c=contextoSonoro();if(!c)return;
 if(sonidoEstado.cargando)return sonidoEstado.cargando;
 sonidoEstado.cargando=Promise.all([['cantos','tribuna-cantos.mp3'],['gol','tribuna-gol.mp3']].map(async([id,n])=>{try{const r=await fetch('assets/audio/'+n);if(!r.ok)throw Error(r.status);sonidoEstado.buffers[id]=await c.decodeAudioData(await r.arrayBuffer());}catch(e){sonidoEstado.fallo=true;}})).then(()=>{if(sonidoEstado.buffers.gol)sonidoEstado.inicioGol=inicioFestejo(sonidoEstado.buffers.gol);sincronizarAmbiente();actualizarAudioUI();});
 return sonidoEstado.cargando;
}
function detenerAudio(){
 if(sonidoEstado.amb){try{sonidoEstado.amb.s.stop();}catch(e){}sonidoEstado.amb=null;}
 sonidoEstado.fuentes.forEach(s=>{try{s.stop();}catch(e){}});sonidoEstado.fuentes.clear();
}
function sincronizarAmbiente(){
 if(!audioEnEscena()){detenerAudio();return;}
 const c=contextoSonoro();if(!c||c.state!=='running')return;
 const buf=sonidoEstado.buffers.cantos;
 if(!mezclaAudio.cantos||!mezclaAudio.ambiente){if(sonidoEstado.amb){sonidoEstado.amb.s.stop();sonidoEstado.amb=null;}return;}
 if(buf&&!sonidoEstado.amb){const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.loop=true;s.connect(g);g.connect(c.destination);g.gain.value=0;s.start();sonidoEstado.amb={s,g};}
 if(sonidoEstado.amb){const grande=contextoInstitucional(S.club,S.division,S.esSeleccion).id==='grande',g=sonidoEstado.amb.g.gain;g.setTargetAtTime(mezclaAudio.ambiente/100*(grande?.38:.24),c.currentTime,.3);}
}
function activarAudio(){
 mezclaAudio.activo=!mezclaAudio.activo;S.sonido=mezclaAudio.activo;guardarAudio();
 if(mezclaAudio.activo){cargarSonidos();sincronizarAmbiente();}else detenerAudio();actualizarAudioUI();
}
function cambiarMezcla(k,v){if(k==='cantos')mezclaAudio.cantos=!!v;else if(k==='ambiente'||k==='efectos')mezclaAudio[k]=clamp(Number(v)||0,0,100);guardarAudio();sincronizarAmbiente();}
function actualizarAudioUI(){document.querySelectorAll('[data-audio-activar]').forEach(b=>{b.textContent=mezclaAudio.activo?t3('Silenciar','Silenciar','Mute'):t3('Activar sonido','Ativar som','Enable sound');b.setAttribute('aria-pressed',String(mezclaAudio.activo));});document.querySelectorAll('[data-audio-estado]').forEach(e=>e.textContent=!mezclaAudio.activo?t3('Sonido apagado','Som desligado','Sound off'):sonidoEstado.fallo?t3('Audio básico · la tribuna no pudo cargar','Áudio básico · torcida indisponível','Basic audio · crowd unavailable'):sonidoEstado.buffers.cantos?t3('Tribuna y efectos listos','Torcida e efeitos prontos','Crowd and effects ready'):t3('Cargando tribuna…','Carregando torcida…','Loading crowd…'));}
function instalarAudioUI(root){
 if(!root||root.querySelector('.mezcla-audio'))return;
 root.querySelectorAll('button[aria-label="Sonido"],button[aria-label="Som"],button[aria-label="Sound"]').forEach(b=>b.remove());
 root.insertAdjacentHTML('beforeend',`<details class="mezcla-audio"><summary>${t3('Sonido de cancha','Som da arquibancada','Stadium sound')}</summary><div><button class="btn sec compacto" data-audio-activar onclick="activarAudio()" aria-pressed="${mezclaAudio.activo}"></button><span data-audio-estado role="status"></span><label>${t3('Tribuna','Torcida','Crowd')}<input aria-label="${t3('Volumen de tribuna','Volume da torcida','Crowd volume')}" type="range" min="0" max="100" value="${mezclaAudio.ambiente}" oninput="cambiarMezcla('ambiente',this.value)"></label><label>${t3('Goles y silbato','Gols e apito','Goals and whistle')}<input aria-label="${t3('Volumen de efectos','Volume dos efeitos','Effects volume')}" type="range" min="0" max="100" value="${mezclaAudio.efectos}" oninput="cambiarMezcla('efectos',this.value)"></label><label class="audio-cantos"><input type="checkbox" ${mezclaAudio.cantos?'checked':''} onchange="cambiarMezcla('cantos',this.checked)">${t3('Cantos y palmas de tribuna','Cantos e palmas da torcida','Crowd chants and clapping')}</label><p>${t3('Grabaciones de tribuna y percusión propia; no son himnos oficiales de los clubes.','Gravações de torcida e percussão própria; não são hinos oficiais.','Crowd recordings and original percussion, not official club anthems.')}</p><details><summary>${t3('Créditos de audio','Créditos de áudio','Audio credits')}</summary>${AUDIO_CREDITOS.map(([a,n,url])=>`<p><a href="${url}" target="_blank" rel="noopener">${n}</a> — ${a} · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a></p>`).join('')}</details></div></details>`);actualizarAudioUI();
}
// Encontrar el primer pico de la grabación para reproducir la reacción, no 50 s completos.
function inicioFestejo(buffer){const d=buffer.getChannelData(0),paso=Math.floor(buffer.sampleRate*.15);let pico=0,indice=0;for(let i=0;i<d.length-paso;i+=paso){let e=0;for(let j=i;j<i+paso;j+=8)e+=d[j]*d[j];if(e>pico){pico=e;indice=i;}}return Math.max(0,indice/buffer.sampleRate-.45);}
function efectoFuente(c,fuente,vol,dur,offset=0){const g=c.createGain();fuente.connect(g);g.connect(c.destination);const t=c.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.025);g.gain.setValueAtTime(vol,t+Math.max(.03,dur-.3));g.gain.linearRampToValueAtTime(0,t+dur);sonidoEstado.fuentes.add(fuente);fuente.onended=()=>{sonidoEstado.fuentes.delete(fuente);fuente.disconnect();g.disconnect();};if(fuente.buffer)fuente.start(t,offset,dur);else{fuente.start(t);fuente.stop(t+dur);}}
sonar=function(tipo){
 if(!mezclaAudio.activo||document.hidden||S.pant!=='partido'||tmp.vivo?.pausa)return;const c=contextoSonoro();if(!c||c.state!=='running')return;
 const vol=(tipo==='bombo'?mezclaAudio.ambiente:mezclaAudio.efectos)/100;if(!vol)return;
 if((tipo==='gol'||tipo==='golrival')&&sonidoEstado.buffers.gol){const b=sonidoEstado.buffers.gol,s=c.createBufferSource();s.buffer=b;const offset=sonidoEstado.inicioGol||0;efectoFuente(c,s,vol*(tipo==='gol'?.65:.3),Math.min(5,b.duration-offset),offset);return;}
 const o=c.createOscillator();o.type=tipo==='pito'?'sine':'triangle';const t=c.currentTime;o.frequency.setValueAtTime(tipo==='pito'?2200:tipo==='bombo'?100:190,t);o.frequency.exponentialRampToValueAtTime(tipo==='pito'?1900:tipo==='bombo'?45:80,t+(tipo==='pito'?.25:.17));efectoFuente(c,o,vol*(tipo==='pito'?.07:tipo==='bombo'?.08:.055),tipo==='pito'?.4:.23);
};
const _irSonido=ir;
ir=function(p){if(p!=='partido')detenerAudio();_irSonido(p);sincronizarAmbiente();};
const _pausaSonido=pausarVivoInterior;
pausarVivoInterior=function(b){_pausaSonido(b);sincronizarAmbiente();};
const _finSonido=finVivo;
finVivo=function(){_finSonido();if(tmp.vivo?.res)detenerAudio();};
const _portadaSonido=portada;
portada=function(){_portadaSonido();instalarAudioUI(document.querySelector('#s-portada'));};
document.addEventListener?.('visibilitychange',sincronizarAmbiente);
document.addEventListener?.('pointerdown',()=>{if(mezclaAudio.activo){cargarSonidos();sincronizarAmbiente();}},{passive:true});
const BOMBOS_CANCHA={Peñarol:[0,3,6,8,11,14],Nacional:[0,4,6,8,12,14]};
setInterval(()=>{sincronizarAmbiente();if(audioEnEscena()&&mezclaAudio.cantos&&mezclaAudio.ambiente>0){const paso=sonidoEstado.paso++%16,club=sedePartido(tmp.vivo.info)||S.club;const golpes=BOMBOS_CANCHA[club.n]||[[0,2,6,8,10,14],[0,4,8,12],[0,3,8,11]][hashS(club.n)%3];if(golpes.includes(paso))sonar('bombo');}},420);
