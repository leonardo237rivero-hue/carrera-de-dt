// Carrera de DT — conecta las traducciones con el juego
const TRAD = {
  pt:{ pool:POOL_PT, form:FORM_PT, rep:REP_PT },
  en:{ pool:POOL_EN, form:FORM_EN, rep:REP_EN }
};
// campos por idioma de los ídolos (sólo la parte que cambia)
const IDOLO_EXTRA={
 "Peñarol":{qpt:"o maior artilheiro da história do clube",qen:"the greatest goalscorer in the club's history",erapt:"os anos setenta",eraen:"the seventies"},
 "Nacional":{qpt:"o maior artilheiro histórico do clube",qen:"the club's all-time top scorer",erapt:"os anos quarenta",eraen:"the forties"},
 "Boca Juniors":{qpt:"o último ídolo absoluto da Bombonera",qen:"the last true idol of La Bombonera",erapt:"os anos dois mil",eraen:"the 2000s"},
 "River Plate":{qpt:"o maior artilheiro e ídolo eterno do clube",qen:"the club's top scorer and eternal idol",erapt:"A Máquina",eraen:"the La Máquina years"},
 "Independiente":{qpt:"o Bocha, o maior ídolo do Rojo",qen:"El Bocha, the greatest idol of El Rojo",erapt:"os anos setenta e oitenta",eraen:"the seventies and eighties"},
 "Racing Club":{qpt:"o capitão que quebrou o jejum",qen:"the captain who ended the drought",erapt:"os anos dois mil e dez",eraen:"the 2010s"},
 "Flamengo":{qpt:"o maior ídolo da história do clube",qen:"the greatest idol in the club's history",erapt:"os anos oitenta",eraen:"the eighties"},
 "Palmeiras":{qpt:"o Divino, símbolo do clube",qen:"the Divine One, symbol of the club",erapt:"os anos setenta",eraen:"the seventies"},
 "Corinthians":{qpt:"o capitão da Democracia Corinthiana",qen:"captain of the Corinthians Democracy",erapt:"os anos oitenta",eraen:"the eighties"},
 "Botafogo":{qpt:"o maior ídolo que passou pelo clube",qen:"the greatest idol ever to wear the shirt",erapt:"os anos cinquenta e sessenta",eraen:"the fifties and sixties"},
 "Cruzeiro":{qpt:"o símbolo do clube",qen:"the symbol of the club",erapt:"os anos sessenta",eraen:"the sixties"},
 "Vasco da Gama":{qpt:"o maior artilheiro histórico do clube",qen:"the club's all-time top scorer",erapt:"os anos setenta e oitenta",eraen:"the seventies and eighties"},
 "Grêmio":{qpt:"ídolo como jogador e como treinador",qen:"an idol as player and as manager",erapt:"os anos oitenta",eraen:"the eighties"},
 "Internacional":{qpt:"o Rei de Roma, ídolo do clube",qen:"the King of Rome, idol of the club",erapt:"os anos setenta",eraen:"the seventies"},
 "Barcelona":{qpt:"o maior artilheiro da história do clube",qen:"the greatest goalscorer in the club's history",erapt:"os anos dois mil",eraen:"the 2000s"},
 "Real Madrid":{qpt:"a Flecha Loira, quem construiu o clube",qen:"the Blond Arrow, the man who built the club",erapt:"os anos cinquenta",eraen:"the fifties"},
 "Atlético de Madrid":{qpt:"ídolo como jogador e treinador do clube",qen:"an idol as player and manager of the club",erapt:"os anos sessenta e setenta",eraen:"the sixties and seventies"},
 "Manchester United":{qpt:"símbolo do clube e sobrevivente de Munique",qen:"symbol of the club and a Munich survivor",erapt:"os anos sessenta",eraen:"the sixties"},
 "Liverpool FC":{qpt:"o capitão de Istambul",qen:"the captain of Istanbul",erapt:"os anos dois mil",eraen:"the 2000s"},
 "Arsenal":{qpt:"o maior artilheiro histórico do clube",qen:"the club's all-time top scorer",erapt:"os Invencíveis",eraen:"the Invincibles era"},
 "Manchester City":{qpt:"o maior artilheiro histórico do clube",qen:"the club's all-time top scorer",erapt:"os anos dois mil e dez",eraen:"the 2010s"},
 "Milan":{qpt:"o capitão eterno do clube",qen:"the club's eternal captain",erapt:"os anos noventa",eraen:"the nineties"},
 "Inter":{qpt:"o capitão da Tríplice Coroa",qen:"the captain of the Treble",erapt:"os anos dois mil",eraen:"the 2000s"},
 "Juventus":{qpt:"o capitão e maior artilheiro do clube",qen:"the club's captain and top scorer",erapt:"os anos dois mil",eraen:"the 2000s"},
 "Napoli":{qpt:"quem deu ao sul os únicos scudettos",qen:"the man who gave the south its only scudetti",erapt:"os anos oitenta",eraen:"the eighties"},
 "Roma":{qpt:"o Capitano, ídolo de uma camisa só",qen:"Il Capitano, a one-club idol",erapt:"os anos dois mil",eraen:"the 2000s"},
 "Bayern München":{qpt:"o Kaiser, símbolo do clube",qen:"Der Kaiser, symbol of the club",erapt:"os anos setenta",eraen:"the seventies"}
};

// versiones traducidas de las funciones que arman texto
function situacionIdoloI18N(club){
  const i=IDOLOS[club.n];
  if(!i) return null;
  if(IDIOMA==="es") return situacionIdolo(club);
  const base=situacionIdolo(club);
  const ex=IDOLO_EXTRA[club.n]||{};
  const cfg=IDOLO_I18N[IDIOMA];
  if(!cfg||!ex.qpt) return base;
  const datos={...i,...ex};
  const ops=cfg.o(datos);
  return [base[0], cfg.q(club.n,datos),
    base[2].map((o,k)=> ops[k] ? [ops[k][0],o[1],o[2],o[3],o[4],ops[k][1]] : o)];
}
// helpers de traducción de datos
function nArq(a){ return IDIOMA==="es"?a.n : (DATOS_I18N.arq[a.id]?.[IDIOMA]?.n||a.n); }
function dArq(a){ return IDIOMA==="es"?a.d : (DATOS_I18N.arq[a.id]?.[IDIOMA]?.d||a.d); }
function efArq(a){ return IDIOMA==="es"?a.ef : (DATOS_I18N.arq[a.id]?.[IDIOMA]?.ef||a.ef); }
function coArq(a){ return IDIOMA==="es"?a.co : (DATOS_I18N.arq[a.id]?.[IDIOMA]?.co||a.co); }
function tPrensa(p,campo){ return IDIOMA==="es"?p[campo] : (DATOS_I18N.prensa[p.id]?.[IDIOMA]?.[campo]||p[campo]); }
function tModo(m,campo){ return IDIOMA==="es"?m[campo] : (DATOS_I18N.modo[m.id]?.[IDIOMA]?.[campo]||m[campo]); }
function tRol(r){ return IDIOMA==="es"?ROL[r].n : (DATOS_I18N.rol[r]?.[IDIOMA]||ROL[r].n); }
function tGrupo(g){ const es={POR:"Arquero",DEF:"Defensa",MED:"Mediocampo",ATA:"Ataque"};
  return IDIOMA==="es"?es[g] : (DATOS_I18N.grupo[g]?.[IDIOMA]||es[g]); }
function tDiv(n){ return IDIOMA==="es"?n : (DATOS_I18N.div[n]?.[IDIOMA]||n); }
function tEstilo(e){ return IDIOMA==="es"?ESTILO_LBL[e] : (DATOS_I18N.estilo[e]?.[IDIOMA]||ESTILO_LBL[e]); }
function tFit(f){ const l=FIT_LBL[f]; return IDIOMA==="es"?l : (DATOS_I18N.fit[l]?.[IDIOMA]||l); }
function tEtiq(e,campo){ if(!e) return ""; return IDIOMA==="es"?e[campo] : (DATOS_I18N.etiqueta[e.id]?.[IDIOMA]?.[campo]||e[campo]); }
function tRecord(r){ return IDIOMA==="es"?r.n : (DATOS_I18N.record[r.id]?.[IDIOMA]||r.n); }
function tCierre(c){ return IDIOMA==="es"?c : (DATOS_I18N.cierre[c]?.[IDIOMA]||c); }
function tMotiv(m,campo){ return IDIOMA==="es"?m[campo] : (DATOS_I18N.motiv[m.id]?.[IDIOMA]?.[campo]||m[campo]); }
function tArgum(a){ return IDIOMA==="es"?a.txt : (DATOS_I18N.argum[a.id]?.[IDIOMA]||a.txt); }
