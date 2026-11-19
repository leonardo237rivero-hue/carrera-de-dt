// v24b — El dial de riesgo también en el partido en vivo.
// Hasta v23 la postura solo pesaba en los partidos simulados. Ahora el primer tiempo se juega con la postura
// de la temporada y en el entretiempo la podés cambiar para el segundo: ir a buscarlo o cerrarlo.
// Cuánto te cuesta abrirte sigue dependiendo de cómo ataca ESE rival (ver v20).
const _jugarMitadV23=jugarMitad;
jugarMitad=function(A,B,neutral,desde,hasta){
 const V=tmp.vivo,id=V&&desde>45&&V.post2?V.post2:posturaActual(),mio=A&&A.yo?A:B&&B.yo?B:null;
 if(!mio||id==='equilibrada'||S.esSeleccion)return _jugarMitadV23(A,B,neutral,desde,hasta);
 const f=factoresPostura(mio===A?B:A,id);
 S._post={n:0,fa:mio===A?f.yo:f.el,fb:mio===A?f.el:f.yo};
 try{return _jugarMitadV23(A,B,neutral,desde,hasta);}finally{S._post=null;}
};
function rivalVivo(){const V=tmp.vivo;return V&&(V.A&&V.A.yo?V.B:V.A)||(V&&V.info.rival);}
function dialVivoHTML(){
 const V=tmp.vivo,id=V.post2||posturaActual(),P=POSTURAS[id],rv=rivalVivo(),pc=x=>(x>0?'+':'')+Math.round(x*100)+'%';
 const yo=soyLado(),gf=V.marc[yo==='a'?0:1],gc=V.marc[yo==='a'?1:0];
 const consejo=gf<gc?t3('Vas perdiendo: abrirte te da más goles, y a ellos también.','Está perdendo: abrir dá mais gols, a eles também.','You are behind: opening up gives you more goals, and them too.')
  :gf>gc?t3('Vas ganando: cerrarte baja los goles en los dos arcos.','Está ganhando: fechar baixa os gols nos dois gols.','You are ahead: closing up lowers the goals at both ends.')
  :t3('Empatados: decidí si el punto te sirve.','Empatados: decida se o ponto serve.','Level: decide whether a point is enough.');
 let ef='';
 if(rv&&id!=='equilibrada'){const f=factoresPostura(rv,id);
  ef=`<span class="v20-ef">${t3('Tus goles esperados','Seus gols esperados','Your expected goals')} <b class="${f.yo>1?'ok':'mal'}">${pc(f.yo-1)}</b> · ${t3('los de ellos','os deles','theirs')} <b class="${f.el>1?'mal':'ok'}">${pc(f.el-1)}</b>${castigaRival(rv,id)?' · '+(id==='segura'?t3('ojo: si te cerrás, este rival tiene la pelota y te encierra','cuidado: se fechar, este rival tem a bola e te encurrala','careful: if you sit back, this opponent keeps the ball and pins you in'):t3('ojo: este rival castiga al que se abre','cuidado: este rival castiga quem se abre','careful: this opponent punishes teams that open up')):''}</span>`;}
 return `<div class="v20-postura" id="v24-dial" style="grid-template-columns:1fr">
  <div class="v20-cab"><b>${t3('Postura para el segundo tiempo','Postura para o segundo tempo','Stance for the second half')}</b><span>${t3(...P.d)} ${t3('Defensa de la pérdida','Defesa da perda','Rest defence')}: ${P.vig[0]}.</span></div>
  <div class="v20-pills" role="radiogroup" aria-label="${t3('Postura del equipo','Postura do time','Team stance')}">${Object.keys(POSTURAS).map(k=>`<button role="radio" aria-checked="${k===id}" class="tkv ${k===id?'on':''}" onclick="ponerPosturaVivo('${k}')">${t3(...POSTURAS[k].n)}</button>`).join('')}</div>
  <div class="v20-lec"><span class="v20-rv">${consejo}</span>${ef}</div></div>`;
}
function ponerPosturaVivo(id){
 const V=tmp.vivo;if(!V||!POSTURAS[id])return;V.post2=id;
 const caja=document.getElementById('v24-dial');if(caja)caja.outerHTML=dialVivoHTML();
 const btn=document.querySelector('#vvPanel .acciones .btn');if(btn&&V.sel2==null)btn.textContent=id!==posturaActual()?t3('Volver a la cancha','Voltar ao campo','Back out'):t3('Seguir igual','Seguir igual','No changes');
}
const _pintarEntretiempoV23=pintarEntretiempo;
pintarEntretiempo=function(...args){
 _pintarEntretiempoV23(...args);
 const V=tmp.vivo,acc=document.querySelector('#vvPanel .acciones');if(!V||S.esSeleccion||!acc)return;
 if(!V.post2)V.post2=posturaActual();
 acc.insertAdjacentHTML('beforebegin',dialVivoHTML());
};
const _segundoTiempoV23=segundoTiempo;
segundoTiempo=function(){
 const V=tmp.vivo;
 if(V&&V.post2&&V.post2!==posturaActual())V.ev.push({m:46,t:'nota',txt:'↻ '+t3('Postura','Postura','Stance')+': '+t3(...POSTURAS[V.post2].n)+' ('+t3('atacan','atacam','attacking')+' '+POSTURAS[V.post2].at+')'});
 _segundoTiempoV23();
};
