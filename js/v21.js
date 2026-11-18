// v21 — Pretemporada corta el primer año en un club.
// Playtest: 17 pantallas antes de la primera pelota. El primer año ahora es:
// contrato → presentación al plantel (con la pregunta del capitán) → once → plan → a jugar.
//  · La bienvenida al club pasa a ser una franja dentro del plantel.
//  · El resultado de la presentación se muestra en el plantel, no en una pantalla aparte.
//  · Mercado, ruleta y decisiones de pretemporada no aparecen el primer año: todavía no conocés
//    a tu plantel, así que comprar no significa nada. El mercado se abre en la parada de mitad de año,
//    cuando ya viste qué te falta. Desde el segundo año, la pretemporada vuelve a ser completa.

function pretemporadaCorta(){ return !!S.pretCorta&&!S.esSeleccion; }
const _firmarClubV20=firmarClub;
// firmarClub abre la temporada y la cola de pretemporada adentro: la marca va antes
firmarClub=function(o){ S.pretCorta=!(o&&o.club&&o.club.sel); _firmarClubV20(o); if(S.esSeleccion)S.pretCorta=false; };

// bienvenida: franja en el plantel en vez de pantalla propia
const _introClubV20=introClub;
introClub=function(sigue){
 if(!pretemporadaCorta()){_introClubV20(sigue);return;}
 S.introVisto=S.club.n;tmp.franjaClub=true;sigue();
};
function franjaClub(){
 const c=S.club,info=typeof CLUB_INFO!=='undefined'?CLUB_INFO[c.n]:null,cla=typeof clasicoDe==='function'?clasicoDe(c):null,idolo=typeof IDOLOS!=='undefined'?IDOLOS[c.n]:null;
 const d=[];
 if(S.division<3)d.push(`${tDiv(DIVISIONES[S.division].n)} · ${t3('formar antes que ganar','formar antes de ganhar','develop before you win')}`);
 if(info&&info.est)d.push(`${t3('Estadio','Estádio','Stadium')}: ${escapeHTML(info.est)}`);
 if(cla)d.push(`${cla.esClasicoReal?t3('Clásico','Clássico','Derby'):t3('Rival a vigilar','Rival a observar','Rival to watch')}: ${escudo(cla,16)} ${escapeHTML(cla.n)}`);
 if(idolo)d.push(`${t3('Ídolo','Ídolo','Idol')}: ${escapeHTML(idolo.n)}`);
 const meta=info&&info.meta?L(info.meta):'';
 return `<div class="v21-franja" style="${estiloInterior(c)}">${escudo(c,40)}<div><b>${t3('Bienvenido a','Bem-vindo ao','Welcome to')} ${escapeHTML(c.n)}</b><span>${d.join(' · ')}</span>${meta?`<i>${meta}</i>`:''}</div></div>`;
}
// el resultado de la presentación va al plantel
const _presentacionV20=presentacionPlantel;
presentacionPlantel=function(){
 const P=tmp.pres;
 if(P&&P.paso===2&&pretemporadaCorta()){tmp.efectosPres={ef:P.efectos,resp:P.resp};tmp.pres=null;colaPrevia();return;}
 _presentacionV20();
};
function franjaPresentacion(){
 const E=tmp.efectosPres;if(!E)return '';
 return `<div class="v21-pres"><b>${t3('Cómo quedó el vestuario después de tu presentación','Como ficou o vestiário depois da apresentação','Where the dressing room stands after your introduction')}</b><div class="lec-chips">${E.ef.map(e=>`<span class="lec-chip ${/−|-\d/.test(e)?'mal':'ok'}">${e}</span>`).join('')}</div></div>`;
}
const _verPlantelV20=verPlantel;
verPlantel=function(){
 _verPlantelV20();
 const root=$('#s-plantel');if(!root)return;
 const extra=(tmp.franjaClub?franjaClub():'')+franjaPresentacion();
 if(extra)root.insertAdjacentHTML('afterbegin',extra);
 tmp.franjaClub=false;tmp.efectosPres=null;
 if(pretemporadaCorta())root.querySelectorAll('button[onclick^="abrirMercado"]').forEach(b=>{b.textContent=t3('Armar el plan →','Montar o plano →','Set the plan →');});
};
// primer año: del plantel directo al plan. Las decisiones vuelven al mazo para el año que viene.
const _abrirMercadoV20=abrirMercado;
abrirMercado=function(){
 if(pretemporadaCorta()&&!tmp.mercadoMitad){
  S.pretCorta=false;S.mercadoMitad=S.temporada;
  if(Array.isArray(S.decs)&&Array.isArray(S.pool)){S.pool.unshift(...S.decs.slice(S.decIdx||0));S.decs=[];S.decIdx=0;}
  irPlanteo();return;
 }
 _abrirMercadoV20();
};
// mercado de mitad de año (sólo la temporada en que no hubo mercado de pretemporada)
const _pintarParadaV20=pintarParada;
pintarParada=function(){
 _pintarParadaV20();
 if(S.mercadoMitad!==S.temporada||S.esSeleccion)return;
 const acc=$('#s-club .acciones');
 if(acc)acc.insertAdjacentHTML('afterbegin',`<button class="btn sec" onclick="abrirMercadoMitad()">${t3('Mercado de pases','Mercado de transferências','Transfer window')} · ${S.presupuesto}</button>`);
 const h=$('#s-club h2');if(h)h.insertAdjacentHTML('afterend',`<p class="v21-nota">${t3('Ya viste a tu equipo media temporada: se abre el mercado. Comprá lo que te falta, no lo que brilla.','Já viu seu time por meia temporada: abre o mercado.','You have seen your team for half a season: the window opens. Buy what you lack, not what shines.')}</p>`);
};
function abrirMercadoMitad(){ S.mercadoMitad=null;tmp.mercadoMitad=true;_abrirMercadoV20(); }
const _cerrarMercadoV20=cerrarMercado;
cerrarMercado=function(){
 if(tmp.mercadoMitad){clearInterval(S.timer);tmp.mercadoMitad=false;pintarParada();ir('club');return;}
 _cerrarMercadoV20();
};
