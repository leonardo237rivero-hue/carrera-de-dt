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
