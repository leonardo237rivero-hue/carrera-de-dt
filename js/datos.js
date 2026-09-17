// Carrera de DT — ligas, clubes, nombres por país y arquetipos de DT
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   LIGAS Y CLUBES (nombres reales; escudos generados)
   Para usar escudos oficiales, reemplazar la función escudo()
   ========================================================== */
const LIGAS={
 "Uruguay":{liga:"Campeonato Uruguayo",conf:"sudamerica",clubes:[
  {n:"Peñarol",niv:5,c:["#F5C518","#111111"]},{n:"Nacional",niv:5,c:["#FFFFFF","#1A4FA0"]},
  {n:"Defensor Sporting",niv:3,c:["#5B2E86","#FFFFFF"]},{n:"Danubio",niv:3,c:["#12406E","#FFFFFF"]},
  {n:"Liverpool",niv:3,c:["#0A0A0A","#3AA3E3"]},{n:"Montevideo Wanderers",niv:2,c:["#1A4FA0","#FFFFFF"]},
  {n:"Cerro",niv:2,c:["#1A6FC4","#FFFFFF"]},{n:"Racing de Montevideo",niv:2,c:["#0E7A4B","#FFFFFF"]},
  {n:"Boston River",niv:2,c:["#C8102E","#111111"]},{n:"Plaza Colonia",niv:2,c:["#1A4FA0","#F5C518"]},
  {n:"Cerro Largo",niv:2,c:["#0E7A4B","#FFFFFF"]},{n:"Progreso",niv:1,c:["#C8102E","#FFFFFF"]},
  {n:"Rampla Juniors",niv:1,c:["#0E7A4B","#C8102E"]},{n:"River Plate de Montevideo",niv:1,c:["#C8102E","#FFFFFF"]}]},
 "Argentina":{liga:"Liga Profesional",conf:"sudamerica",clubes:[
  {n:"Boca Juniors",niv:5,c:["#123B78","#F2C300"]},{n:"River Plate",niv:5,c:["#FFFFFF","#D6001C"]},
  {n:"Racing Club",niv:4,c:["#7EC0EE","#FFFFFF"]},{n:"Independiente",niv:4,c:["#C8102E","#FFFFFF"]},
  {n:"San Lorenzo",niv:4,c:["#123B78","#C8102E"]},{n:"Estudiantes",niv:4,c:["#C8102E","#FFFFFF"]},
  {n:"Vélez Sarsfield",niv:3,c:["#FFFFFF","#1A4FA0"]},{n:"Newell's Old Boys",niv:3,c:["#C8102E","#111111"]},
  {n:"Rosario Central",niv:3,c:["#F2C300","#1A4FA0"]},{n:"Talleres",niv:3,c:["#1A4FA0","#FFFFFF"]},
  {n:"Lanús",niv:3,c:["#7A1F2B","#FFFFFF"]},{n:"Huracán",niv:2,c:["#C8102E","#FFFFFF"]},
  {n:"Argentinos Juniors",niv:2,c:["#C8102E","#FFFFFF"]},{n:"Platense",niv:1,c:["#8B4A2B","#FFFFFF"]}]},
 "Brasil":{liga:"Brasileirão",conf:"sudamerica",clubes:[
  {n:"Flamengo",niv:5,c:["#C8102E","#111111"]},{n:"Palmeiras",niv:5,c:["#0B6B3A","#FFFFFF"]},
  {n:"Corinthians",niv:4,c:["#111111","#FFFFFF"]},{n:"São Paulo",niv:4,c:["#FFFFFF","#C8102E"]},
  {n:"Grêmio",niv:4,c:["#1A6FC4","#111111"]},{n:"Internacional",niv:4,c:["#C8102E","#FFFFFF"]},
  {n:"Fluminense",niv:3,c:["#7A1F2B","#0B6B3A"]},{n:"Botafogo",niv:3,c:["#111111","#FFFFFF"]},
  {n:"Atlético Mineiro",niv:3,c:["#111111","#FFFFFF"]},{n:"Cruzeiro",niv:3,c:["#123B78","#FFFFFF"]},
  {n:"Vasco da Gama",niv:2,c:["#111111","#FFFFFF"]},{n:"Bahia",niv:2,c:["#1A6FC4","#C8102E"]}]},
 "España":{liga:"LaLiga",conf:"europa",clubes:[
  {n:"Real Madrid",niv:5,c:["#FFFFFF","#D4AF37"]},{n:"Barcelona",niv:5,c:["#12406E","#A50044"]},
  {n:"Atlético de Madrid",niv:5,c:["#C8102E","#123B78"]},{n:"Sevilla",niv:4,c:["#FFFFFF","#C8102E"]},
  {n:"Real Sociedad",niv:4,c:["#1A4FA0","#FFFFFF"]},{n:"Athletic Club",niv:4,c:["#C8102E","#FFFFFF"]},
  {n:"Villarreal",niv:3,c:["#F5C518","#12406E"]},{n:"Valencia",niv:3,c:["#FFFFFF","#F58220"]}]},
 "Inglaterra":{liga:"Premier League",conf:"europa",clubes:[
  {n:"Manchester City",niv:5,c:["#7EC0EE","#FFFFFF"]},{n:"Liverpool FC",niv:5,c:["#C8102E","#FFFFFF"]},
  {n:"Arsenal",niv:5,c:["#C8102E","#FFFFFF"]},{n:"Chelsea",niv:4,c:["#123B78","#FFFFFF"]},
  {n:"Manchester United",niv:4,c:["#C8102E","#F2C300"]},{n:"Tottenham",niv:4,c:["#FFFFFF","#12406E"]},
  {n:"Newcastle",niv:3,c:["#111111","#FFFFFF"]},{n:"Aston Villa",niv:3,c:["#7A1F2B","#7EC0EE"]}]},
 "Italia":{liga:"Serie A",conf:"europa",clubes:[
  {n:"Inter",niv:5,c:["#123B78","#111111"]},{n:"Milan",niv:5,c:["#C8102E","#111111"]},
  {n:"Juventus",niv:5,c:["#FFFFFF","#111111"]},{n:"Napoli",niv:4,c:["#1A6FC4","#FFFFFF"]},
  {n:"Roma",niv:4,c:["#7A1F2B","#F2C300"]},{n:"Lazio",niv:3,c:["#7EC0EE","#FFFFFF"]},
  {n:"Atalanta",niv:3,c:["#111111","#1A6FC4"]},{n:"Fiorentina",niv:3,c:["#5B2E86","#FFFFFF"]}]},
 "Alemania":{liga:"Bundesliga",conf:"europa",clubes:[
  {n:"Bayern München",niv:5,c:["#C8102E","#FFFFFF"]},{n:"Borussia Dortmund",niv:5,c:["#F5C518","#111111"]},
  {n:"Bayer Leverkusen",niv:4,c:["#C8102E","#111111"]},{n:"RB Leipzig",niv:4,c:["#FFFFFF","#C8102E"]},
  {n:"Eintracht Frankfurt",niv:3,c:["#111111","#C8102E"]},{n:"Stuttgart",niv:3,c:["#FFFFFF","#C8102E"]}]},
 "Francia":{liga:"Ligue 1",conf:"europa",clubes:[
  {n:"Paris Saint-Germain",niv:5,c:["#12406E","#C8102E"]},{n:"Marsella",niv:4,c:["#7EC0EE","#FFFFFF"]},
  {n:"Lyon",niv:4,c:["#FFFFFF","#C8102E"]},{n:"Mónaco",niv:4,c:["#C8102E","#FFFFFF"]},
  {n:"Lille",niv:3,c:["#C8102E","#111111"]},{n:"Niza",niv:3,c:["#C8102E","#111111"]}]},
 "Estados Unidos":{liga:"MLS",conf:"concacaf",clubes:[
  {n:"Inter Miami",niv:4,c:["#F2A5C1","#111111"]},{n:"LAFC",niv:4,c:["#111111","#C9A227"]},
  {n:"LA Galaxy",niv:3,c:["#FFFFFF","#12406E"]},{n:"Seattle Sounders",niv:3,c:["#0E7A4B","#1A4FA0"]},
  {n:"Atlanta United",niv:3,c:["#C8102E","#111111"]},{n:"Columbus Crew",niv:2,c:["#F5C518","#111111"]}]},
 "Arabia Saudita":{liga:"Liga Profesional Saudí",conf:"asia",clubes:[
  {n:"Al Hilal",niv:5,c:["#1A4FA0","#FFFFFF"]},{n:"Al Nassr",niv:4,c:["#F5C518","#1A4FA0"]},
  {n:"Al Ittihad",niv:4,c:["#111111","#F5C518"]},{n:"Al Ahli",niv:3,c:["#0E7A4B","#FFFFFF"]},
  {n:"Al Shabab",niv:2,c:["#FFFFFF","#111111"]},{n:"Al Ettifaq",niv:2,c:["#0E7A4B","#FFFFFF"]}]}
};
const PAISES=Object.keys(LIGAS);
const CLUBES=[]; PAISES.forEach(p=>LIGAS[p].clubes.forEach(c=>CLUBES.push(Object.assign({p},c))));
const COPA={sudamerica:"Copa Libertadores",europa:"Champions League",concacaf:"Concachampions",asia:"Champions League de Asia"};
// torneos de primera por país
const TORNEOS={
 "Uruguay":["Torneo Apertura","Torneo Clausura","Tabla Anual","Copa AUF Uruguay"],
 "Argentina":["Torneo Apertura","Torneo Clausura","Copa Argentina"],
 "Brasil":["Brasileirão","Copa do Brasil"],
 "España":["LaLiga","Copa del Rey"],
 "Inglaterra":["Premier League","FA Cup"],
 "Italia":["Serie A","Coppa Italia"],
 "Alemania":["Bundesliga","DFB-Pokal"],
 "Francia":["Ligue 1","Copa de Francia"],
 "Estados Unidos":["MLS Cup","US Open Cup"],
 "Arabia Saudita":["Liga Profesional Saudí","Copa del Rey de Campeones"]
};
function copaSVG(s){s=s||16;return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-2px">
 <path d="M7 3h10v4a5 5 0 0 1-10 0Z" fill="#E0A93B"/><path d="M17 4h3v2a3 3 0 0 1-3 3M7 4H4v2a3 3 0 0 0 3 3"
 stroke="#E0A93B" stroke-width="1.6" fill="none"/><path d="M10 12h4v4h-4z" fill="#E0A93B"/>
 <rect x="8" y="16" width="8" height="2.4" rx="1" fill="#E0A93B"/></svg>`;}
const SELECCIONES=[
 {n:"Uruguay",p:"Uruguay",niv:5,c:["#7EC0EE","#FFFFFF"]},{n:"Argentina",p:"Argentina",niv:5,c:["#7EC0EE","#FFFFFF"]},
 {n:"Brasil",p:"Brasil",niv:5,c:["#F5C518","#0B6B3A"]},{n:"Colombia",p:"Colombia",niv:4,c:["#F5C518","#1A4FA0"]},
 {n:"Chile",p:"Chile",niv:3,c:["#C8102E","#1A4FA0"]},{n:"Paraguay",p:"Paraguay",niv:3,c:["#C8102E","#1A4FA0"]},
 {n:"Perú",p:"Perú",niv:3,c:["#FFFFFF","#C8102E"]},{n:"Ecuador",p:"Ecuador",niv:3,c:["#F5C518","#1A4FA0"]},
 {n:"México",p:"México",niv:4,c:["#0B6B3A","#C8102E"]},{n:"España",p:"España",niv:5,c:["#C8102E","#F5C518"]}];

// divisiones: nombre, tope de edad, nombre de la competencia juvenil
const DIVISIONES=[
 {n:"Séptima",edadMax:16,comp:"Sub-16"},
 {n:"Quinta",edadMax:18,comp:"Sub-18"},
 {n:"Sub-19",edadMax:20,comp:"Sub-19"},
 {n:"Primera",edadMax:35,comp:""}
];

/* nombres de jugadores, por pais */
const NOMBRES={
 "Uruguay":{n:["Rodrigo","Matías","Sebastián","Nicolás","Facundo","Gastón","Bruno","Emiliano","Thiago","Joaquín","Diego","Agustín","Federico","Santiago","Maximiliano","Ramiro"],
   a:["Cabrera","Núñez","Da Silva","Ferreira","Olivera","Bentancur","Rodríguez","Sosa","Viera","Méndez","Acuña","Píriz","Techera","Falero","Lemos","Cardozo"]},
 "Argentina":{n:["Lucas","Julián","Valentín","Tomás","Ignacio","Franco","Lautaro","Mateo","Nahuel","Gonzalo","Leandro","Iván","Cristian","Álvaro"],
   a:["Gutiérrez","Romero","Quiroga","Peralta","Barrios","Alfaro","Rojas","Medina","Ojeda","Vázquez","Salgado","Ibarra","Bustos","Zárate"]},
 "Brasil":{n:["João","Lucas","Gabriel","Matheus","Rafael","Bruno","Thiago","Vinícius","Caio","Douglas","Felipe","Wesley","Igor","Éder","Rodrigo","Murilo"],
   a:["Silva","Santos","Oliveira","Souza","Pereira","Costa","Almeida","Ribeiro","Barbosa","Nascimento","Moraes","Teixeira","Cardoso","Rocha","Vieira","Lima"]},
 "España":{n:["Álvaro","Sergio","Iker","Pablo","Javier","Marcos","Unai","Iñigo","Rubén","Adrián","Hugo","Mikel","Aitor","Borja"],
   a:["García","Fernández","Martínez","López","Sánchez","Romero","Iglesias","Torres","Navas","Ortega","Cañizares","Aranda","Beltrán","Gallego"]},
 "Inglaterra":{n:["Harry","Jack","Callum","Ollie","Reece","Mason","Kyle","Declan","Tyler","Alfie","Lewis","Charlie","Josh","Nathan"],
   a:["Smith","Taylor","Wilson","Walker","Hughes","Bennett","Clarke","Cooper","Turner","Barnes","Fletcher","Whitmore","Hayes","Doherty"]},
 "Italia":{n:["Matteo","Lorenzo","Alessandro","Nicolò","Federico","Davide","Gianluca","Andrea","Simone","Riccardo","Emanuele","Tommaso"],
   a:["Rossi","Conti","Ferrari","Esposito","Ricci","Marchetti","Gallo","Barbieri","Fontana","Greco","Moretti","Villa"]},
 "Alemania":{n:["Leon","Jonas","Niklas","Felix","Lukas","Maximilian","Tim","Florian","Julian","Moritz","Jannik","Fabian"],
   a:["Müller","Schmidt","Weber","Fischer","Wagner","Becker","Hoffmann","Schäfer","Krüger","Neumann","Braun","Keller"]},
 "Francia":{n:["Lucas","Enzo","Théo","Hugo","Nathan","Maxime","Rayan","Clément","Bastien","Amaury","Corentin","Loïc"],
   a:["Martin","Bernard","Dubois","Moreau","Lefèvre","Girard","Mercier","Blanchard","Roussel","Perrin","Marchand","Devaux"]},
 "Estados Unidos":{n:["Tyler","Brandon","Jesse","Caleb","Mason","Diego","Andrés","Owen","Miles","Cole","Devin","Xavier"],
   a:["Johnson","Miller","Reyes","Brooks","Carter","Hernández","Foster","Sullivan","Baldwin","Whitaker","Ramírez","Doyle"]},
 "Arabia Saudita":{n:["Abdullah","Salem","Faisal","Khalid","Nawaf","Turki","Yasser","Majed","Saud","Ali","Hattan","Mohammed"],
   a:["Al-Harbi","Al-Dossari","Al-Qahtani","Al-Shehri","Al-Ghamdi","Al-Otaibi","Al-Zahrani","Al-Malki","Al-Amri","Al-Subaie"]}
};
// las selecciones sin liga propia toman el pool mas cercano
const ALIAS_NOM={"Colombia":"Argentina","Chile":"Argentina","Paraguay":"Argentina","Perú":"Argentina",
 "Ecuador":"Argentina","México":"Estados Unidos"};
function poolNombres(pais){
  return NOMBRES[pais]||NOMBRES[ALIAS_NOM[pais]]||NOMBRES["Uruguay"];
}
/* ==========================================================
   ARQUETIPOS
   ========================================================== */
const ARQ=[
 {id:"formador",n:"El Formador",d:"Trabajás con lo que tenés y hacés crecer a los pibes.",
  ef:["Tus juveniles suben +4 de nivel cada temporada","Empezás con el vestuario de tu lado (Vestuario 66)","La ruleta te trae juveniles con más techo"],
  co:"Arrancás con 12 menos de presupuesto",pres:-12,vest:16,dir:0,hin:0,plantel:-2},
 {id:"ganador",n:"El Ganador",d:"Resultados ya. Te dan plata y no te dan tiempo.",
  ef:["+18 de presupuesto inicial","Tu mejor delantero arranca 8 puntos más alto"],
  co:"Te echan si la Directiva baja de 26 (a los otros los echan más tarde)",pres:18,vest:-6,dir:-4,hin:4,plantel:0},
 {id:"bombero",n:"El Bombero",d:"Te llaman cuando el barco se hunde y lo sostenés.",
  ef:["Toda tu defensa arranca +7","La Directiva te banca hasta el fondo (te echan recién en 12)"],
  co:"La hinchada nunca se enamora del todo (-6 de arranque)",pres:-2,vest:2,dir:12,hin:-6,plantel:0}
];

/* ==========================================================
   CÓMO EL PERFIL DEL DT CAMBIA LAS CONSECUENCIAS
   Una misma decisión no pesa igual según quién la toma.
   Un formador tiene espalda para negarse a la directiva;
   un ganador convierte mejor los riesgos en resultado.
   ========================================================== */
const SESGO_PERFIL={
 formador:{
   // la directiva le perdona los desplantes cuando lo hace por el plantel
   ajustar(d,o){
     const [ ,res,dir,hin,ves]=o;
     if(dir<0 && ves>0) return {dir:dir*0.5, nota:"Tu fama de formador te da espalda: la directiva lo traga a medias."};
     if(ves>0) return {ves:ves*1.4, nota:"El vestuario te cree más que a cualquiera."};
     if(ves<0) return {ves:ves*1.4, nota:"Justo vos, que te vendiste como formador. El grupo lo siente el doble."};
     return {};
   }},
 ganador:{
   ajustar(d,o){
     const [ ,res,dir,hin,ves]=o;
     if(res>0) return {res:res*1.5, nota:"Tu obsesión por ganar exprime cada punto."};
     if(dir<0) return {dir:dir*1.4, nota:"Te contrataron para ganar, no para discutir. La directiva anota."};
     return {};
   }},
 bombero:{
   ajustar(d,o){
     const [ ,res,dir,hin,ves]=o;
     if(dir<0) return {dir:dir*0.5, nota:"Te bancan porque saben para qué te trajeron."};
     if(hin>0) return {hin:hin*0.6, nota:"La tribuna aplaude, pero con vos nunca se enamora del todo."};
     return {};
   }}
};

/* ==========================================================
   REPUTACIÓN — el juego recuerda cómo venís dirigiendo
   ========================================================== */
const ETIQUETAS=[
 {id:"bilardista", n:"bilardista",
  desc:"Especula, cierra y espera. Mientras gana, nadie dice nada.",
  test:r=>r.conservador>=3 && r.conservador>r.ofensivo},
 {id:"lirico", n:"lírico",
  desc:"Sale a jugar siempre, aunque el resultado no acompañe.",
  test:r=>r.ofensivo>=3 && r.ofensivo>r.conservador},
 {id:"formador", n:"formador",
  desc:"Le da lugar a los pibes y cuida el grupo por encima del resultado.",
  test:r=>r.plantel>=5},
 {id:"politico", n:"político",
  desc:"Nunca se pelea con nadie arriba. Siempre queda bien parado.",
  test:r=>r.directiva>=5},
 {id:"mediatico", n:"mediático",
  desc:"Vive del micrófono. Cada conferencia es un episodio.",
  test:r=>r.prensa>=3},
 {id:"resultadista", n:"resultadista",
  desc:"Lo único que mira es la tabla.",
  test:r=>r.resultado>=5}
];
function etiquetaDe(rep){
  const m=ETIQUETAS.filter(e=>e.test(rep));
  if(m.length) return m[0];
  // si ninguna marca destaca pero ya hay recorrido, igual te etiquetan
  // por lo que más hiciste: en el fútbol nadie se queda sin apodo
  const total=rep.ofensivo+rep.conservador+rep.plantel+rep.directiva+rep.prensa+rep.resultado;
  if(total<6) return null;
  const ejes=[["conservador",rep.conservador],["ofensivo",rep.ofensivo],["plantel",rep.plantel],
              ["directiva",rep.directiva],["prensa",rep.prensa],["resultado",rep.resultado]];
  ejes.sort((a,b)=>b[1]-a[1]);
  const mapa={conservador:"bilardista",ofensivo:"lirico",plantel:"formador",
              directiva:"politico",prensa:"mediatico",resultado:"resultadista"};
  return ETIQUETAS.find(e=>e.id===mapa[ejes[0][0]])||null;
}


/* ==========================================================
   ÍDOLOS DE CADA CLUB
   La pregunta del periodista sobre el ídolo mide si el DT sabe
   dónde está parado. Sólo aparece en clubes con ídolo cargado.
   Nota: las opciones provocadoras son opiniones futbolísticas,
   nunca acusaciones personales sobre gente real.
   ========================================================== */
const IDOLOS={
 "Peñarol":{n:"Fernando Morena",q:"el goleador más grande de la historia del club",era:"los setenta"},
 "Nacional":{n:"Atilio García",q:"el máximo goleador histórico del club",era:"los cuarenta"},
 "Boca Juniors":{n:"Juan Román Riquelme",q:"el último ídolo absoluto de la Bombonera",era:"los dos mil"},
 "River Plate":{n:"Ángel Labruna",q:"el máximo goleador e ídolo eterno del club",era:"La Máquina"},
 "Independiente":{n:"Ricardo Bochini",q:"el Bocha, el ídolo máximo del Rojo",era:"los setenta y ochenta"},
 "Racing Club":{n:"Diego Milito",q:"el capitán que rompió la sequía",era:"los dos mil diez"},
 "Flamengo":{n:"Zico",q:"el mayor ídolo de la historia del club",era:"los ochenta"},
 "Palmeiras":{n:"Ademir da Guia",q:"el Divino, símbolo del club",era:"los setenta"},
 "Corinthians":{n:"Sócrates",q:"el capitán de la Democracia Corinthiana",era:"los ochenta"},
 "Botafogo":{n:"Garrincha",q:"el mayor ídolo que pasó por el club",era:"los cincuenta y sesenta"},
 "Cruzeiro":{n:"Tostão",q:"el símbolo del club",era:"los sesenta"},
 "Vasco da Gama":{n:"Roberto Dinamite",q:"el máximo goleador histórico del club",era:"los setenta y ochenta"},
 "Grêmio":{n:"Renato Portaluppi",q:"ídolo como jugador y como entrenador",era:"los ochenta"},
 "Internacional":{n:"Falcão",q:"el Rei de Roma, ídolo del club",era:"los setenta"},
 "Barcelona":{n:"Lionel Messi",q:"el máximo goleador de la historia del club",era:"los dos mil"},
 "Real Madrid":{n:"Alfredo Di Stéfano",q:"la Saeta Rubia, el que construyó al club",era:"los cincuenta"},
 "Atlético de Madrid":{n:"Luis Aragonés",q:"ídolo como jugador y entrenador del club",era:"los sesenta y setenta"},
 "Manchester United":{n:"Bobby Charlton",q:"símbolo del club y sobreviviente de Múnich",era:"los sesenta"},
 "Liverpool FC":{n:"Steven Gerrard",q:"el capitán de Estambul",era:"los dos mil"},
 "Arsenal":{n:"Thierry Henry",q:"el máximo goleador histórico del club",era:"los Invencibles"},
 "Manchester City":{n:"Sergio Agüero",q:"el máximo goleador histórico del club",era:"los dos mil diez"},
 "Milan":{n:"Paolo Maldini",q:"el capitán eterno del club",era:"los noventa"},
 "Inter":{n:"Javier Zanetti",q:"el capitán del Triplete",era:"los dos mil"},
 "Juventus":{n:"Alessandro Del Piero",q:"el capitán y máximo goleador del club",era:"los dos mil"},
 "Napoli":{n:"Diego Maradona",q:"el que le dio al sur los únicos scudettos",era:"los ochenta"},
 "Roma":{n:"Francesco Totti",q:"el Capitano, ídolo de una sola camiseta",era:"los dos mil"},
 "Bayern München":{n:"Franz Beckenbauer",q:"el Kaiser, símbolo del club",era:"los setenta"}
};

// arma la situación del ídolo para el club donde estés
function situacionIdolo(club){
  const i=IDOLOS[club.n];
  if(!i) return null;
  return ["Prensa",
    `Primera conferencia en ${club.n}. Un periodista veterano te mira fijo y te pregunta qué pensás de ${i.n}.`,
    [
     [`Decís que es ${i.q}`, 0, 1, 2, 1,
      "Sabés dónde estás parado. La respuesta correcta, sin exagerar."],
     [`Decís que fue un gran jugador de ${i.era} pero que el fútbol de hoy es otra cosa`, 0, 0, -2, 0,
      "Técnicamente cierto y socialmente carísimo. A los ídolos no se los relativiza en su casa."],
     [`Decís que está sobrevalorado por la nostalgia`, 0, -2, -3, -1,
      "Te peleaste con la historia del club en tu primer día. Mal negocio."],
     [`Decís que es el mejor de todos los tiempos, arriba de cualquiera`, 0, 0, 1, -1,
      "La tribuna aplaude, pero se nota que estás comprando barato."],
     [`Preguntás quién es`, 0, -3, -3, -2,
      "Quedaste como alguien que no tiene idea de dónde vino a trabajar."]
    ]];
}

/* ==========================================================
   PERSUASIÓN — convencer a un jugador que duda
   Cada futbolista valora algo distinto. Convencerlo es leer
   al personaje, no elegir siempre la opción con más plata.
   ========================================================== */
const MOTIVACIONES=[
 {id:"plata",     n:"la plata",        pista:"Su representante ya llamó tres veces preguntando por el contrato."},
 {id:"familia",   n:"la familia",      pista:"Tiene dos hijos chicos y viene de tres mudanzas en cuatro años."},
 {id:"copas",     n:"jugar la copa",   pista:"Nunca jugó una copa internacional y ya tiene treinta."},
 {id:"minutos",   n:"jugar siempre",   pista:"Viene de dos temporadas mirando desde el banco."},
 {id:"idolo",     n:"ser ídolo",       pista:"Se crió acá a la vuelta y hay fotos de él de pibe con la camiseta."},
 {id:"proyecto",  n:"el proyecto",     pista:"En la charla pregunta más por cómo va a jugar el equipo que por el sueldo."}
];
const ARGUMENTOS=[
 {id:"plata",    txt:"Le ofrecés ser el mejor pago del plantel"},
 {id:"familia",  txt:"Le hablás de la tranquilidad para vivir con la familia"},
 {id:"copas",    txt:"Le prometés que va a jugar la copa internacional"},
 {id:"minutos",  txt:"Le garantizás que va a ser titular"},
 {id:"idolo",    txt:"Le decís que acá puede terminar siendo ídolo"},
 {id:"proyecto", txt:"Le explicás el proyecto y cómo lo pensaste a él adentro"}
];

/* ==========================================================
   POLÍTICA CON LA PRENSA — un eje, dos extremos, ninguno correcto
   ========================================================== */
const POLITICAS_PRENSA=[
 {id:"abierto", n:"Puertas abiertas",
  desc:"Dejás entrar a los periodistas, generás vínculo, contestás todo.",
  pro:"Menos presión cuando pierdas · te llegan los rumores del mercado antes",
  contra:"Se filtra cómo trabajás: el rival te lee mejor",
  hin:4, dir:4, ves:-4, mult:0.985, filtra:true},
 {id:"neutro", n:"Lo justo y necesario",
  desc:"Conferencias, nada más. Ni amigo ni enemigo.",
  pro:"Nadie se enoja",
  contra:"Nadie te banca tampoco",
  hin:0, dir:0, ves:0, mult:1, filtra:false},
 {id:"cerrado", n:"Persiana baja",
  desc:"Entrenamientos cerrados y lo mínimo indispensable con la prensa.",
  pro:"Nadie sabe cómo vas a jugar · el plantel trabaja tranquilo",
  contra:"Cada mala racha se te vuelve polémica y la tribuna lo escucha",
  hin:-6, dir:-4, ves:8, mult:1.015, filtra:false}
];

/* ==========================================================
   RÉCORDS HISTÓRICOS DE ENTRENADORES
   Marcas a batir. Le dan objetivos a la carrera más allá del título.
   ========================================================== */
const RECORDS=[
 {id:"titulos",   n:"Más títulos en una carrera",      marca:6,  duenio:"Óscar Tabárez (histórico)",  mide:s=>s.titulos.length},
 {id:"puntos",    n:"Más puntos de carrera",           marca:52, duenio:"Carlos Bianchi (histórico)", mide:s=>s.puntos},
 {id:"invicto",   n:"Más temporadas sin bajar de mitad de tabla", marca:5, duenio:"Luiz Felipe Scolari (histórico)",
  mide:s=>s.hist.filter(h=>h.pts>=4).length},
 {id:"unclub",    n:"Más temporadas en un mismo club",  marca:5,  duenio:"Alex Ferguson (histórico)",
  mide:s=>{const c={};s.hist.forEach(h=>{if(h.club&&h.club!=="—")c[h.club]=(c[h.club]||0)+1;});
           return Object.values(c).reduce((a,b)=>Math.max(a,b),0);}},
 {id:"ascensos",  n:"Más ascensos de categoría",        marca:3,  duenio:"—",
  mide:s=>s.ascensos||0},
 {id:"vestuario", n:"Terminar con el vestuario intacto", marca:90, duenio:"Marcelo Bielsa (histórico)",
  mide:s=>Math.round(s.vars.ves)}
];
function recordsLogrados(S){
  return RECORDS.map(r=>({...r, valor:r.mide(S), roto:r.mide(S)>=r.marca}));
}

