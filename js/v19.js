// v19 — Los problemas se ven completos y se prueban antes de elegir.
//  1. Siempre 11 contra 11: los jugadores del problema van resaltados y el resto de los dos equipos
//     queda en su lugar, más tenue, para que se lea el partido entero y no un recorte.
//  2. La cancha muestra la situación inicial. Al pasar por una orden (o tocarla en la tablet) se ve
//     lo que haría el equipo; al salir vuelve al inicio. Recién después se confirma.

// reparte en la cancha a los que no son protagonistas, según el sistema de cada equipo
function completarOnce(clave,f,centro,rival){
 const base=(ONCE[f]||ONCE['4-4-2']).map(([rol,x,y])=>({rol,x,y}));
 const cy=clave.reduce((s,p)=>s+p[1],0)/Math.max(1,clave.length);
 // el bloque del equipo se ubica alrededor de donde está la acción
 let pos=base.map(p=>{
  if(p.rol==='POR')return {rol:p.rol,x:50,y:rival?95:5};
  const yy=rival?100-(p.y*.6+(100-cy)-28):p.y*.6+cy-28;
  return {rol:p.rol,x:rival?100-p.x:p.x,y:clamp(yy,rival?6:10,rival?90:94)};
 });
 // cada protagonista ocupa el lugar del jugador de sistema más cercano
 const libres=pos.slice();
 clave.forEach(k=>{let m=-1,d=1e9;libres.forEach((p,i)=>{const dd=Math.hypot(p.x-k[0],(p.y-k[1])*1.3);if(dd<d){d=dd;m=i;}});if(m>=0)libres.splice(m,1);});
 return libres.slice(0,Math.max(0,11-clave.length));
}
function separar(ctx,ocupados){
 // que ninguna ficha de contexto quede encima de otra
 ctx.forEach(p=>{for(let n=0;n<4;n++){const o=ocupados.find(q=>q!==p&&Math.hypot(q.x-p.x,q.y-p.y)<6.5);if(!o)break;const a=Math.atan2(p.y-o.y,p.x-o.x)||(n+1);p.x=clamp(p.x+Math.cos(a)*5,4,96);p.y=clamp(p.y+Math.sin(a)*5,4,96);}ocupados.push(p);});
}
canchaSituacion=function(sit){
 const c=(tmp.sit&&tmp.sit.c)||{yo:{f:S.formacion},el:{f:'4-4-2'}},cA=S.club.c[0],tx=typeof txtSobre==='function'?txtSobre(cA):'#111';
 const miCtx=completarOnce(sit.mi,c.yo.f,0,false),elCtx=completarOnce(sit.el,c.el.f,0,true);
 const ocup=sit.mi.map(p=>({x:p[0],y:p[1]})).concat(sit.el.map(p=>({x:p[0],y:p[1]})));
 separar(miCtx,ocup);separar(elCtx,ocup);
 return `<div class="v16-cancha v19" id="v16-cancha"><i class="ar-g"></i><i class="ar-c"></i><i class="medio"></i><i class="ar-g abajo"></i><i class="ar-c abajo"></i>
  ${elCtx.map(p=>`<span class="tk el ctx" style="left:${p.x}%;bottom:${p.y}%"></span>`).join('')}
  ${miCtx.map(p=>`<span class="tk mi ctx" style="left:${p.x}%;bottom:${p.y}%;background:${cA}"></span>`).join('')}
  ${sit.el.map(p=>`<span class="tk el" style="left:${p[0]}%;bottom:${p[1]}%"></span>`).join('')}
  ${sit.mi.map((p,i)=>`<span class="tk mi" data-i="${i}" style="left:${p[0]}%;bottom:${p[1]}%;background:${cA};color:${tx}">${p[2]||''}</span>`).join('')}
  <span class="pel" style="left:${sit.pel[0]}%;bottom:${sit.pel[1]}%"></span><em>${t3('ATACÁS ↑','ATACA ↑','ATTACKING ↑')}</em>
  <b class="v19-estado" id="v19-estado">${t3('Situación inicial','Situação inicial','Starting situation')}</b></div>
  <p class="v19-leyenda"><span><i style="background:${cA}"></i>${escapeHTML(S.club.n)}</span><span><i class="el"></i>${escapeHTML((tmp.sit&&tmp.sit.rival&&tmp.sit.rival.club.n)||'')}</span><span class="mini">${t3('11 contra 11 · resaltados, los del problema','11 contra 11 · em destaque, os do problema','11 v 11 · highlighted: the players in the problem')}</span></p>`;
};

/* ---------- probar una orden antes de darla ---------- */
function cortarPrevia(){ const X=tmp.sit;if(X&&X.timers){X.timers.forEach(clearTimeout);}if(X)X.timers=[]; }
function situacionInicial(instant){
 const X=tmp.sit,caja=$('#v16-cancha');if(!X||!caja)return;
 cortarPrevia();caja.classList.toggle('sin-trans',!!instant);
 X.sit.mi.forEach((p,i)=>{const el=caja.querySelector(`[data-i="${i}"]`);if(el){el.style.left=p[0]+'%';el.style.bottom=p[1]+'%';}});
 const pel=caja.querySelector('.pel');if(pel){pel.style.left=X.sit.pel[0]+'%';pel.style.bottom=X.sit.pel[1]+'%';}
 const e=$('#v19-estado');if(e){e.textContent=t3('Situación inicial','Situação inicial','Starting situation');e.classList.remove('on');}
 if(instant){void caja.offsetWidth;caja.classList.remove('sin-trans');}
}
function verOrden(k){
 const X=tmp.sit,caja=$('#v16-cancha');if(!X||X.res||!caja)return;
 const op=opsDe(X.sit,X.c)[k];if(!op)return;
 situacionInicial(true);X.viendo=k;
 const e=$('#v19-estado');if(e){e.textContent=`${'ABCD'[k]} · ${t3('así se movería','assim se moveria','how it would move')}`;e.classList.add('on');}
 const pel=caja.querySelector('.pel'),camino=(op.b||[]).slice();
 X.timers.push(setTimeout(()=>{
  Object.entries(op.mv||{}).forEach(([i,xy])=>{const el=caja.querySelector(`[data-i="${i}"]`);if(el){el.style.left=xy[0]+'%';el.style.bottom=xy[1]+'%';}});
  camino.forEach((p,i)=>X.timers.push(setTimeout(()=>{if(pel){pel.style.left=p[0]+'%';pel.style.bottom=p[1]+'%';}},450+i*560)));
 },120));
}
function marcarOrden(k){
 const X=tmp.sit;if(!X||X.res)return;
 X.marcada=k;
 document.querySelectorAll('#v16-sit .v16-ops .card').forEach((b,i)=>{b.classList.toggle('pre',i===k);b.setAttribute('aria-pressed',String(i===k));});
 const c=$('#v19-confirmar');if(c){c.disabled=false;c.textContent=`${t3('Gritar la','Gritar a','Shout')} ${'ABCD'[k]}`;}
 verOrden(k);
}
function confirmarOrden(){
 const X=tmp.sit;if(!X||X.res||X.marcada==null)return;
 situacionInicial(true);const c=$('#v19-confirmar');if(c)c.remove();const n=$('#v19-ayuda');if(n)n.remove();
 const e=$('#v19-estado');if(e){e.textContent=t3('En juego','Em jogo','Live');e.classList.add('on');}
 elegirSituacion(X.marcada);
}
const _abrirSituacionV18=abrirSituacion;
abrirSituacion=function(jor,rival,sit,c,clave){
 document.querySelectorAll('#v16-sit').forEach(x=>x.remove());
 _abrirSituacionV18(jor,rival,sit,c,clave);
 const X=tmp.sit;X.timers=[];X.marcada=null;
 const ops=document.querySelector('#v16-sit .v16-ops');if(!ops)return;
 const fino=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 ops.querySelectorAll('.card').forEach((b,k)=>{
  b.setAttribute('onclick',`marcarOrden(${k})`);b.setAttribute('aria-pressed','false');
  if(fino){b.addEventListener('mouseenter',()=>{if(!tmp.sit||tmp.sit.res)return;verOrden(k);});
   b.addEventListener('mouseleave',()=>{const Y=tmp.sit;if(!Y||Y.res)return;if(Y.marcada!=null)verOrden(Y.marcada);else situacionInicial();});}
  b.addEventListener('focus',()=>{if(tmp.sit&&!tmp.sit.res&&tmp.sit.marcada==null)verOrden(k);});
 });
 ops.insertAdjacentHTML('beforebegin',`<p class="v19-ayuda" id="v19-ayuda">${fino?t3('Pasá por cada orden para ver qué haría el equipo. Hacé clic para elegirla.','Passe por cada ordem para ver o que o time faria. Clique para escolher.','Hover each order to see what the team would do. Click to pick it.'):t3('Tocá una orden para ver qué haría el equipo. Después confirmá.','Toque uma ordem para ver o que o time faria. Depois confirme.','Tap an order to see what the team would do. Then confirm.')}</p>`);
 ops.insertAdjacentHTML('afterend',`<div class="acciones v19-acc"><button class="btn" id="v19-confirmar" disabled onclick="confirmarOrden()">${t3('Elegí una orden','Escolha uma ordem','Pick an order')}</button><button class="btn sec" onclick="tmp.sit.marcada=null;document.querySelectorAll('#v16-sit .v16-ops .card').forEach(b=>b.classList.remove('pre'));situacionInicial()">${t3('Ver la situación inicial','Ver a situação inicial','See the starting situation')}</button></div>`);
};
