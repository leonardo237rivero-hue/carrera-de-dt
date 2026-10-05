// Carrera de DT — identidad de cada club: historia, colores, clásico y trofeos
// Ver docs/INSTRUCTIVO.md
//
// Sólo datos estables y verificables (fundación, estadio, hitos históricos).
// Nada de conteos de títulos "actuales" que se desactualizan.

const t3=(es,pt,en)=>L({es,pt,en});

/* ==========================================================
   FICHAS DE CLUB
   f: fundación · est: estadio · ap: apodo · cla: clásico rival
   dt: DT histórico · glo: su gloria · meta: la deuda que te piden saldar
   cul: la cultura del club en una línea
   ========================================================== */
const CLUB_INFO={
 "Peñarol":{f:1891,est:"Estadio Campeón del Siglo",ap:"Manyas · Carboneros",cla:"Nacional",dt:"Roque Máspoli",
  glo:{es:"Cinco Copas Libertadores (1960, 1961, 1966, 1982 y 1987) y tres Intercontinentales.",
       pt:"Cinco Libertadores (1960, 1961, 1966, 1982 e 1987) e três Intercontinentais.",
       en:"Five Copa Libertadores titles (1960, 1961, 1966, 1982 and 1987) and three Intercontinental Cups."},
  meta:{es:"Volver a ganar la Libertadores. La última fue en 1987.",pt:"Voltar a ganhar a Libertadores. A última foi em 1987.",en:"Win the Libertadores again. The last one was in 1987."},
  cul:{es:"Mística copera y garra. Acá el clásico no se juega: se gana.",pt:"Mística de copa e raça. Aqui o clássico não se joga: se ganha.",en:"Cup mystique and grit. Here you don't play the derby: you win it."}},
 "Nacional":{f:1899,est:"Gran Parque Central",ap:"Bolsos · Tricolores",cla:"Peñarol",
  glo:{es:"Tres Libertadores (1971, 1980 y 1988) y tres Intercontinentales. Su cancha fue sede del Mundial 1930.",
       pt:"Três Libertadores (1971, 1980 e 1988) e três Intercontinentais. Seu estádio foi sede da Copa de 1930.",
       en:"Three Libertadores (1971, 1980 and 1988) and three Intercontinental Cups. Its ground hosted the 1930 World Cup."},
  meta:{es:"La Libertadores se le niega desde 1988.",pt:"A Libertadores escapa desde 1988.",en:"The Libertadores has escaped them since 1988."},
  cul:{es:"El decano orgulloso: juego y tradición. Perder el clásico no se perdona.",pt:"O decano orgulhoso: jogo e tradição. Perder o clássico não se perdoa.",en:"The proud elder: football and tradition. Losing the derby is unforgivable."}},
 "Boca Juniors":{f:1905,est:"La Bombonera",ap:"Xeneizes",cla:"River Plate",dt:"Carlos Bianchi",
  glo:{es:"Seis Libertadores. La era Bianchi ganó tres (2000, 2001 y 2003) y dos Intercontinentales.",
       pt:"Seis Libertadores. A era Bianchi ganhou três (2000, 2001 e 2003) e dois Intercontinentais.",
       en:"Six Libertadores. The Bianchi era won three (2000, 2001 and 2003) plus two Intercontinental Cups."},
  meta:{es:"Volver a levantar la Libertadores. La última fue en 2007.",pt:"Voltar a levantar a Libertadores. A última foi em 2007.",en:"Lift the Libertadores again. The last one was in 2007."},
  cul:{es:"La Bombonera late. Al DT se le perdona perder, no dejar de meter.",pt:"A Bombonera pulsa. Perdoam a derrota, não a falta de raça.",en:"La Bombonera throbs. Losing is forgiven; lacking fight is not."}},
 "River Plate":{f:1901,est:"Estadio Monumental",ap:"Millonarios",cla:"Boca Juniors",dt:"Marcelo Gallardo",
  glo:{es:"La final de Madrid 2018 ante Boca, con Gallardo en el banco.",pt:"A final de Madri 2018 contra o Boca, com Gallardo no banco.",en:"The 2018 Madrid final against Boca, with Gallardo on the bench."},
  meta:{es:"Estar a la altura de la vara que dejó Gallardo.",pt:"Estar à altura do padrão que Gallardo deixou.",en:"Live up to the bar Gallardo set."},
  cul:{es:"Paladar negro: acá hay que ganar jugando bien.",pt:"Paladar exigente: aqui tem que ganhar jogando bem.",en:"Refined taste: here you must win and play well."}},
 "Independiente":{f:1905,est:"Estadio Libertadores de América",ap:"Rojo · Rey de Copas",cla:"Racing Club",
  glo:{es:"Siete Copas Libertadores: el máximo ganador de la historia. El Rey de Copas.",pt:"Sete Libertadores: o maior campeão da história. O Rei de Copas.",en:"Seven Copa Libertadores: the most successful club in its history. The King of Cups."},
  meta:{es:"Volver a ser el Rey de Copas.",pt:"Voltar a ser o Rei de Copas.",en:"Become the King of Cups again."},
  cul:{es:"El paladar del Bocha: pelota al piso y pase filtrado.",pt:"O paladar do Bocha: bola no chão e passe em profundidade.",en:"Bochini's taste: ball on the ground and the through pass."}},
 "Racing Club":{f:1903,est:"El Cilindro de Avellaneda",ap:"La Academia",cla:"Independiente",
  glo:{es:"Primer club argentino campeón del mundo, en 1967.",pt:"Primeiro clube argentino campeão do mundo, em 1967.",en:"First Argentine club to become world champions, in 1967."},
  meta:{es:"Que la gloria de 1967 no sea la única.",pt:"Que a glória de 1967 não seja a única.",en:"Make sure 1967 is not the only glory."},
  cul:{es:"Una hinchada que aguantó todo y no se fue nunca.",pt:"Uma torcida que aguentou tudo e nunca foi embora.",en:"A crowd that endured everything and never left."}},
 "San Lorenzo":{f:1908,est:"Nuevo Gasómetro",ap:"Cuervos",cla:"Huracán",
  glo:{es:"La Libertadores de 2014, la primera de su historia.",pt:"A Libertadores de 2014, a primeira de sua história.",en:"The 2014 Libertadores, the first in its history."},
  meta:{es:"Volver a la Vuelta de Boedo.",pt:"Voltar ao bairro de Boedo.",en:"Return home to Boedo."},
  cul:{es:"Club de barrio con hinchada de club grande.",pt:"Clube de bairro com torcida de clube grande.",en:"A neighbourhood club with a big club's crowd."}},
 "Estudiantes":{f:1905,est:"Estadio Jorge Luis Hirschi",ap:"Pincharratas",dt:"Osvaldo Zubeldía",
  glo:{es:"Tres Libertadores seguidas (1968, 1969 y 1970) con Zubeldía.",pt:"Três Libertadores seguidas (1968, 1969 e 1970) com Zubeldía.",en:"Three Libertadores in a row (1968, 1969 and 1970) under Zubeldía."},
  meta:{es:"Ganar como gana Estudiantes: con oficio.",pt:"Ganhar como o Estudiantes ganha: com ofício.",en:"Win the Estudiantes way: with craft."},
  cul:{es:"La cuna del fútbol estudiado: pelota parada y detalles.",pt:"O berço do futebol estudado: bola parada e detalhes.",en:"The cradle of studied football: set pieces and details."}},
 "Flamengo":{f:1895,est:"Maracanã",ap:"Mengão · Rubro-Negro",cla:"Fluminense",
  glo:{es:"La Libertadores y el Mundial de 1981, con Zico.",pt:"A Libertadores e o Mundial de 1981, com Zico.",en:"The 1981 Libertadores and Intercontinental Cup, with Zico."},
  meta:{es:"Con la torcida más grande de Brasil, ganar el Brasileirão no alcanza.",pt:"Com a maior torcida do Brasil, ganhar o Brasileirão não basta.",en:"With Brazil's biggest crowd, the Brasileirão is not enough."},
  cul:{es:"Fútbol vistoso y una Nação que llena el Maracanã.",pt:"Futebol vistoso e uma Nação que lota o Maracanã.",en:"Flair football and a Nação that fills the Maracanã."}},
 "Palmeiras":{f:1914,est:"Allianz Parque",ap:"Verdão",cla:"Corinthians",dt:"Abel Ferreira",
  glo:{es:"Libertadores de 1999, 2020 y 2021.",pt:"Libertadores de 1999, 2020 e 2021.",en:"Libertadores in 1999, 2020 and 2021."},
  meta:{es:"El Mundial de Clubes que todavía le falta.",pt:"O Mundial de Clubes que ainda falta.",en:"The Club World Cup it still lacks."},
  cul:{es:"Orden, pelota parada y una exigencia que no afloja.",pt:"Organização, bola parada e cobrança constante.",en:"Order, set pieces and relentless demands."}},
 "Corinthians":{f:1910,est:"Neo Química Arena",ap:"Timão",cla:"Palmeiras",dt:"Tite",
  glo:{es:"Libertadores y Mundial de Clubes 2012, contra el Chelsea.",pt:"Libertadores e Mundial de Clubes de 2012, contra o Chelsea.",en:"The 2012 Libertadores and Club World Cup, against Chelsea."},
  meta:{es:"Estar a la altura de la Fiel.",pt:"Estar à altura da Fiel.",en:"Be worthy of the Fiel."},
  cul:{es:"El club del pueblo: se gana sufriendo.",pt:"O time do povo: se ganha sofrendo.",en:"The people's club: you win by suffering."}},
 "São Paulo":{f:1930,est:"Morumbi",ap:"Tricolor",cla:"Corinthians",dt:"Telê Santana",
  glo:{es:"Libertadores e Intercontinental en 1992 y 1993 con Telê Santana.",pt:"Libertadores e Intercontinental em 1992 e 1993 com Telê Santana.",en:"Libertadores and Intercontinental Cup in 1992 and 1993 under Telê Santana."},
  meta:{es:"Recuperar el fútbol de Telê.",pt:"Recuperar o futebol de Telê.",en:"Bring back Telê's football."},
  cul:{es:"Institución modelo: juego asociado y cantera.",pt:"Instituição modelo: jogo associado e base.",en:"A model institution: combination play and academy."}},
 "Grêmio":{f:1903,est:"Arena do Grêmio",ap:"Tricolor Gaúcho",cla:"Internacional",
  glo:{es:"Libertadores e Intercontinental de 1983.",pt:"Libertadores e Intercontinental de 1983.",en:"The 1983 Libertadores and Intercontinental Cup."},
  meta:{es:"Ganar el Gre-Nal y la copa, en ese orden.",pt:"Ganhar o Gre-Nal e a copa, nessa ordem.",en:"Win the Gre-Nal and the cup, in that order."},
  cul:{es:"Fútbol copero, duro, del sur.",pt:"Futebol copeiro, duro, do sul.",en:"Hard, southern cup football."}},
 "Internacional":{f:1909,est:"Beira-Rio",ap:"Colorado",cla:"Grêmio",
  glo:{es:"El Mundial de Clubes 2006, contra el Barcelona.",pt:"O Mundial de Clubes de 2006, contra o Barcelona.",en:"The 2006 Club World Cup, against Barcelona."},
  meta:{es:"Volver a ser campeón de América.",pt:"Voltar a ser campeão da América.",en:"Be champions of South America again."},
  cul:{es:"El Beira-Rio empuja; el Gre-Nal lo define todo.",pt:"O Beira-Rio empurra; o Gre-Nal define tudo.",en:"Beira-Rio pushes; the Gre-Nal decides everything."}},
 "Real Madrid":{f:1902,est:"Santiago Bernabéu",ap:"Merengues",cla:"Barcelona",
  glo:{es:"Cinco Copas de Europa seguidas, de 1956 a 1960.",pt:"Cinco Copas da Europa seguidas, de 1956 a 1960.",en:"Five European Cups in a row, 1956 to 1960."},
  meta:{es:"En este club, un año sin Champions es un año perdido.",pt:"Neste clube, um ano sem Champions é um ano perdido.",en:"At this club, a season without the Champions League is a lost season."},
  cul:{es:"Ganar es la única costumbre. El señorío también se juega.",pt:"Ganhar é o único costume.",en:"Winning is the only habit."}},
 "Barcelona":{f:1899,est:"Camp Nou",ap:"Culés · Blaugrana",cla:"Real Madrid",dt:"Johan Cruyff",
  glo:{es:"El sextete de 2009 con Guardiola.",pt:"O sextete de 2009 com Guardiola.",en:"The 2009 sextuple under Guardiola."},
  meta:{es:"Ganar jugando a lo Barça, o no vale.",pt:"Ganhar jogando como o Barça, ou não vale.",en:"Win the Barça way, or it doesn't count."},
  cul:{es:"Més que un club: posesión, cantera y La Masia.",pt:"Més que un club: posse, base e La Masia.",en:"Més que un club: possession and La Masia."}},
 "Atlético de Madrid":{f:1903,est:"Metropolitano",ap:"Colchoneros",cla:"Real Madrid",dt:"Diego Simeone",
  glo:{es:"Las Ligas de 2014 y 2021 con Simeone, rompiendo el duopolio.",pt:"As Ligas de 2014 e 2021 com Simeone, quebrando o duopólio.",en:"The 2014 and 2021 league titles under Simeone, breaking the duopoly."},
  meta:{es:"La Champions: dos finales perdidas con el Real Madrid todavía duelen.",pt:"A Champions: duas finais perdidas para o Real ainda doem.",en:"The Champions League: two finals lost to Real Madrid still hurt."},
  cul:{es:"Partido a partido. El esfuerzo no se negocia.",pt:"Jogo a jogo. O esforço não se negocia.",en:"Game by game. Effort is non-negotiable."}},
 "Manchester United":{f:1878,est:"Old Trafford",ap:"Red Devils",cla:"Liverpool FC",dt:"Alex Ferguson",
  glo:{es:"El triplete de 1999 con Ferguson.",pt:"A tríplice coroa de 1999 com Ferguson.",en:"The 1999 treble under Ferguson."},
  meta:{es:"Volver a ganar la Premier desde que se fue Ferguson.",pt:"Voltar a ganhar a Premier desde a saída de Ferguson.",en:"Win the Premier League again, the first since Ferguson."},
  cul:{es:"El Teatro de los Sueños: ataque, juveniles y remontadas.",pt:"O Teatro dos Sonhos: ataque, jovens e viradas.",en:"The Theatre of Dreams: attack, youth and comebacks."}},
 "Liverpool FC":{f:1892,est:"Anfield",ap:"Reds",cla:"Manchester United",dt:"Bill Shankly",
  glo:{es:"La remontada de Estambul en 2005.",pt:"A virada de Istambul em 2005.",en:"The Istanbul comeback in 2005."},
  meta:{es:"You'll Never Walk Alone: Anfield exige intensidad.",pt:"You'll Never Walk Alone: Anfield exige intensidade.",en:"You'll Never Walk Alone: Anfield demands intensity."},
  cul:{es:"Presión, ritmo y noches europeas.",pt:"Pressão, ritmo e noites europeias.",en:"Pressing, tempo and European nights."}},
 "Arsenal":{f:1886,est:"Emirates Stadium",ap:"Gunners",cla:"Tottenham",dt:"Arsène Wenger",
  glo:{es:"Los Invencibles: la Premier 2003-04 sin perder un partido.",pt:"Os Invencíveis: a Premier 2003-04 sem perder.",en:"The Invincibles: the 2003-04 league without a defeat."},
  meta:{es:"La Champions que nunca ganó.",pt:"A Champions que nunca ganhou.",en:"The Champions League it has never won."},
  cul:{es:"Pelota al pie y paciencia.",pt:"Bola no pé e paciência.",en:"Ball to feet and patience."}},
 "Manchester City":{f:1880,est:"Etihad Stadium",ap:"Citizens",cla:"Manchester United",dt:"Pep Guardiola",
  glo:{es:"El triplete de 2023.",pt:"A tríplice coroa de 2023.",en:"The 2023 treble."},
  meta:{es:"Sostener el nivel de la era Guardiola.",pt:"Manter o nível da era Guardiola.",en:"Sustain the Guardiola-era standard."},
  cul:{es:"Posesión y control total.",pt:"Posse e controle total.",en:"Possession and total control."}},
 "Chelsea":{f:1905,est:"Stamford Bridge",ap:"Blues",cla:"Arsenal",
  glo:{es:"La Champions de 2012 en Múnich.",pt:"A Champions de 2012 em Munique.",en:"The 2012 Champions League in Munich."},
  meta:{es:"Ganar sin que te cambien a mitad de año.",pt:"Ganhar sem ser trocado no meio do ano.",en:"Win before they sack you mid-season."},
  cul:{es:"Exigencia inmediata.",pt:"Cobrança imediata.",en:"Instant demands."}},
 "Tottenham":{f:1882,est:"Tottenham Hotspur Stadium",ap:"Spurs",cla:"Arsenal",
  glo:{es:"El doblete de 1961, el primero del siglo XX en Inglaterra.",pt:"A dobradinha de 1961, a primeira do século XX na Inglaterra.",en:"The 1961 double, England's first of the 20th century."},
  meta:{es:"Terminar arriba del Arsenal.",pt:"Terminar acima do Arsenal.",en:"Finish above Arsenal."},
  cul:{es:"To dare is to do: jugar para adelante.",pt:"To dare is to do: jogar para frente.",en:"To dare is to do."}},
 "Milan":{f:1899,est:"San Siro",ap:"Rossoneri",cla:"Inter",dt:"Arrigo Sacchi",
  glo:{es:"El Milan de Sacchi: Copas de Europa de 1989 y 1990.",pt:"O Milan de Sacchi: Copas da Europa de 1989 e 1990.",en:"Sacchi's Milan: European Cups in 1989 and 1990."},
  meta:{es:"Volver a ser grande en Europa.",pt:"Voltar a ser grande na Europa.",en:"Be great in Europe again."},
  cul:{es:"Línea alta y presión: la escuela Sacchi.",pt:"Linha alta e pressão: a escola Sacchi.",en:"High line and pressing: the Sacchi school."}},
 "Inter":{f:1908,est:"San Siro",ap:"Nerazzurri",cla:"Milan",dt:"José Mourinho",
  glo:{es:"El Triplete de 2010 con Mourinho.",pt:"A Tríplice Coroa de 2010 com Mourinho.",en:"The 2010 Treble under Mourinho."},
  meta:{es:"La Champions que se escapó en las últimas finales.",pt:"A Champions que escapou nas últimas finais.",en:"The Champions League that slipped away in recent finals."},
  cul:{es:"Orden defensivo y pegada.",pt:"Ordem defensiva e contundência.",en:"Defensive order and punch."}},
 "Juventus":{f:1897,est:"Allianz Stadium",ap:"Vecchia Signora",cla:"Inter",
  glo:{es:"Nueve scudetti seguidos, de 2012 a 2020.",pt:"Nove scudetti seguidos, de 2012 a 2020.",en:"Nine straight scudetti, 2012 to 2020."},
  meta:{es:"Vincere non è importante, è l'unica cosa che conta.",pt:"Vencer não é importante: é a única coisa que conta.",en:"Winning isn't important, it's the only thing that counts."},
  cul:{es:"Disciplina y resultado.",pt:"Disciplina e resultado.",en:"Discipline and results."}},
 "Napoli":{f:1926,est:"Stadio Diego Armando Maradona",ap:"Partenopei",cla:"Roma",
  glo:{es:"Los scudetti de 1987 y 1990 con Maradona.",pt:"Os scudetti de 1987 e 1990 com Maradona.",en:"The 1987 and 1990 scudetti with Maradona."},
  meta:{es:"Que el sur vuelva a gritar campeón.",pt:"Que o sul volte a gritar campeão.",en:"Let the south shout champions again."},
  cul:{es:"Pasión total: Nápoles vive el fútbol como una religión.",pt:"Paixão total.",en:"Total passion: Naples lives football as a religion."}},
 "Roma":{f:1927,est:"Stadio Olimpico",ap:"Giallorossi",cla:"Lazio",
  glo:{es:"La Conference League de 2022.",pt:"A Conference League de 2022.",en:"The 2022 Conference League."},
  meta:{es:"Ganar el derbi y volver a pelear el scudetto.",pt:"Ganhar o dérbi e brigar pelo scudetto.",en:"Win the derby and challenge for the scudetto."},
  cul:{es:"Ídolos de una sola camiseta.",pt:"Ídolos de uma camisa só.",en:"One-club idols."}},
 "Bayern München":{f:1900,est:"Allianz Arena",ap:"Die Roten",cla:"Borussia Dortmund",
  glo:{es:"Tres Copas de Europa seguidas (1974-1976) con Beckenbauer.",pt:"Três Copas da Europa seguidas (1974-1976) com Beckenbauer.",en:"Three European Cups in a row (1974-1976) with Beckenbauer."},
  meta:{es:"Ganar la Bundesliga es la obligación; la Champions, la vara.",pt:"A Bundesliga é obrigação; a Champions, a régua.",en:"The Bundesliga is an obligation; the Champions League is the bar."},
  cul:{es:"Mia san mia: ganar siempre.",pt:"Mia san mia: ganhar sempre.",en:"Mia san mia: always win."}},
 "Borussia Dortmund":{f:1909,est:"Westfalenstadion",ap:"BVB",cla:"Bayern München",dt:"Jürgen Klopp",
  glo:{es:"La Champions de 1997, en Múnich.",pt:"A Champions de 1997, em Munique.",en:"The 1997 Champions League, in Munich."},
  meta:{es:"Cortarle la racha al Bayern.",pt:"Quebrar a hegemonia do Bayern.",en:"End Bayern's dominance."},
  cul:{es:"El Muro Amarillo y la presión: fútbol heavy metal.",pt:"A Muralha Amarela e a pressão.",en:"The Yellow Wall and heavy-metal pressing."}},
 "Paris Saint-Germain":{f:1970,est:"Parc des Princes",ap:"Les Parisiens",cla:"Marsella",
  glo:{es:"Su primera Champions, en 2025.",pt:"Sua primeira Champions, em 2025.",en:"Its first Champions League, in 2025."},
  meta:{es:"Demostrar que no fue casualidad.",pt:"Provar que não foi acaso.",en:"Prove it wasn't a one-off."},
  cul:{es:"Talento y exigencia europea.",pt:"Talento e exigência europeia.",en:"Talent and European demands."}},
 "Marsella":{f:1899,est:"Vélodrome",ap:"Olympiens",cla:"Paris Saint-Germain",
  glo:{es:"La Champions de 1993.",pt:"A Champions de 1993.",en:"The 1993 Champions League."},
  meta:{es:"Ganarle a París.",pt:"Ganhar do Paris.",en:"Beat Paris."},
  cul:{es:"El Vélodrome no perdona la tibieza.",pt:"O Vélodrome não perdoa a frieza.",en:"The Vélodrome never forgives half-heartedness."}},
 "Al Hilal":{f:1957,est:"Riad",ap:"Al Za'eem",cla:"Al Nassr",
  glo:{es:"Máximo ganador de la Champions de Asia.",pt:"Maior campeão da Champions da Ásia.",en:"Most successful club in the AFC Champions League."},
  meta:{es:"Seguir mandando en Asia.",pt:"Seguir mandando na Ásia.",en:"Keep ruling Asia."},
  cul:{es:"El más grande de Arabia.",pt:"O maior da Arábia.",en:"Saudi Arabia's biggest."}}
};
// clubes medianos y chicos: sólo lo básico y seguro
Object.assign(CLUB_INFO,{
 "Defensor Sporting":{f:1913,est:"Estadio Luis Franzini",ap:"Violetas"},
 "Danubio":{f:1932,est:"Jardines del Hipódromo",ap:"La Franja"},
 "Liverpool":{f:1915,est:"Estadio Belvedere",ap:"Negriazules"},
 "Montevideo Wanderers":{f:1902,est:"Parque Viera",ap:"Bohemios"},
 "Cerro":{f:1922,est:"Estadio Luis Tróccoli",ap:"Villeros",cla:"Rampla Juniors"},
 "Rampla Juniors":{f:1914,est:"Estadio Olímpico",ap:"Picapiedras",cla:"Cerro"},
 "Racing de Montevideo":{f:1919,est:"Parque Osvaldo Roberto",ap:"Cerveceros"},
 "Plaza Colonia":{f:1917,ap:"Patas Blancas"},
 "Vélez Sarsfield":{f:1910,est:"José Amalfitani",ap:"El Fortín"},
 "Newell's Old Boys":{f:1903,ap:"La Lepra",cla:"Rosario Central",est:"Estadio Marcelo Bielsa"},
 "Rosario Central":{f:1889,ap:"Canallas",cla:"Newell's Old Boys",est:"Gigante de Arroyito"},
 "Huracán":{f:1908,ap:"El Globo",cla:"San Lorenzo",est:"Tomás Adolfo Ducó"},
 "Lanús":{f:1915,ap:"Granate"},
 "Fluminense":{f:1902,est:"Maracanã",ap:"Tricolor",cla:"Flamengo"},
 "Botafogo":{f:1904,est:"Nilton Santos",ap:"Fogão"},
 "Atlético Mineiro":{f:1908,est:"Arena MRV",ap:"Galo",cla:"Cruzeiro"},
 "Cruzeiro":{f:1921,est:"Mineirão",ap:"Raposa",cla:"Atlético Mineiro"},
 "Vasco da Gama":{f:1898,est:"São Januário",ap:"Gigante da Colina",cla:"Flamengo"},
 "Sevilla":{f:1890,est:"Ramón Sánchez-Pizjuán",ap:"Sevillistas"},
 "Athletic Club":{f:1898,est:"San Mamés",ap:"Leones",cla:"Real Sociedad"},
 "Real Sociedad":{f:1909,est:"Anoeta",ap:"Txuri-urdin",cla:"Athletic Club"},
 "Valencia":{f:1919,est:"Mestalla",ap:"Che"},
 "Newcastle":{f:1892,est:"St James' Park",ap:"Magpies"},
 "Lazio":{f:1900,est:"Stadio Olimpico",ap:"Biancocelesti",cla:"Roma"},
 "Fiorentina":{f:1926,est:"Artemio Franchi",ap:"Viola"},
 "Atalanta":{f:1907,ap:"La Dea"},
 "Lyon":{f:1950,ap:"Les Gones"},
 "Mónaco":{f:1924,est:"Stade Louis II"}
});
// selecciones: sólo lo que no se discute
const SEL_INFO={
 "Uruguay":{glo:{es:"Campeón del mundo en 1930 y 1950 (el Maracanazo).",pt:"Campeão do mundo em 1930 e 1950 (o Maracanazo).",en:"World champions in 1930 and 1950 (the Maracanazo)."},
   cul:{es:"La garra charrúa.",pt:"A garra charrua.",en:"Charrúa grit."}},
 "Argentina":{glo:{es:"Campeón del mundo en 1978, 1986 y 2022.",pt:"Campeã do mundo em 1978, 1986 e 2022.",en:"World champions in 1978, 1986 and 2022."},
   cul:{es:"Exigencia máxima: sólo sirve ganar.",pt:"Exigência máxima.",en:"Only winning counts."}},
 "Brasil":{glo:{es:"Cinco veces campeón del mundo, el máximo ganador.",pt:"Pentacampeão do mundo.",en:"Five-time world champions, the most ever."},
   cul:{es:"Jogo bonito o nada.",pt:"Jogo bonito ou nada.",en:"Jogo bonito or nothing."}},
 "España":{glo:{es:"Campeón del mundo en 2010.",pt:"Campeã do mundo em 2010.",en:"World champions in 2010."},
   cul:{es:"El tiki-taka como identidad.",pt:"O tiki-taka como identidade.",en:"Tiki-taka as identity."}}
};

/* clásico: el de la ficha o el más fuerte de la liga */
function clasicoDe(club){
  const info=CLUB_INFO[club.n];
  const liga=LIGAS[club.p]?LIGAS[club.p].clubes:[];
  if(info&&info.cla){ const c=liga.find(x=>x.n===info.cla); if(c) return Object.assign({p:club.p},c); }
  const otros=liga.filter(x=>x.n!==club.n).sort((a,b)=>b.niv-a.niv);
  return otros.length?Object.assign({p:club.p},otros[0]):null;
}

/* ==========================================================
   TEMA DE COLORES DEL CLUB
   ========================================================== */
function luz(hex){ const h=hex.replace("#","");
  return parseInt(h.slice(0,2),16)*0.299+parseInt(h.slice(2,4),16)*0.587+parseInt(h.slice(4,6),16)*0.114; }
function alfa(hex,a){ const h=hex.replace("#","");
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`; }
// color "visible" sobre fondo oscuro: si el principal es muy oscuro, se usa el segundo
function colorVisible(club){ const [c1,c2]=club.c; return luz(c1)<60?c2:c1; }
function aplicarTema(){
  const r=document.documentElement;
  if(!r||!r.style||!r.style.setProperty) return;
  if(!S.club){ ["--club1","--club2","--clubv"].forEach(k=>r.style.removeProperty&&r.style.removeProperty(k)); return; }
  const [c1,c2]=S.club.c;
  r.style.setProperty("--club1",c1);
  r.style.setProperty("--club2",c2);
  r.style.setProperty("--clubv",colorVisible(S.club));
  r.style.setProperty("--clubfondo",alfa(c1,0.16));
  r.style.setProperty("--clubfondo2",alfa(c2,0.10));
}
// ficha propia en la cancha: relleno del club, texto legible
function fichaColores(club){
  const [c1,c2]=club.c;
  return {fill:c1, stroke:luz(c1)>200&&luz(c2)>200?"#183028":c2, txt:luz(c1)>150?"#111":"#FFF"};
}

/* ==========================================================
   TROFEOS — un ícono por tipo de competencia
   ========================================================== */
function trofeo(tipo,s){
  s=s||22;
  if(tipo==="conti") return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-3px">
    <path d="M8 3h8v5a4 4 0 0 1-8 0Z" fill="#F2C94C"/><path d="M8 4C4 4 4 10 8.5 10M16 4c4 0 4 6-.5 6" stroke="#F2C94C" stroke-width="1.8" fill="none"/>
    <path d="M11 12h2v4h-2z" fill="#F2C94C"/><path d="M7.5 17h9l1 4h-11z" fill="#C9A227"/></svg>`;
  if(tipo==="copa") return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-3px">
    <path d="M7 3h10v3a5 5 0 0 1-10 0Z" fill="#D8DEE4"/><path d="M7 4H4v1.5A3 3 0 0 0 7 8.5M17 4h3v1.5a3 3 0 0 1-3 3" stroke="#D8DEE4" stroke-width="1.5" fill="none"/>
    <path d="M11 11h2v5h-2z" fill="#D8DEE4"/><rect x="7" y="16" width="10" height="2.5" rx="1" fill="#A9B3BC"/><rect x="8.5" y="19" width="7" height="2" fill="#A9B3BC"/></svg>`;
  if(tipo==="sel") return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-3px">
    <circle cx="12" cy="7" r="4.5" fill="#F2C94C"/><path d="M9 11c-1 3 1 5 1 7h4c0-2 2-4 1-7" fill="#E0A93B"/>
    <rect x="8" y="18" width="8" height="3" rx="1" fill="#0B6B3A"/></svg>`;
  if(tipo==="media") return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-3px">
    <path d="M6 4h12l-2 6H8z" fill="#8FC0AA"/><circle cx="12" cy="15" r="5" fill="#E0A93B"/><circle cx="12" cy="15" r="2.6" fill="#C9A227"/></svg>`;
  // liga: bandeja/escudo dorado
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-3px">
    <path d="M5 3h14v7c0 5-3.5 8-7 10-3.5-2-7-5-7-10Z" fill="#E0A93B"/><path d="M12 6l1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 14.2 8.8 15.9l.6-3.6-2.6-2.5 3.6-.5Z" fill="#FFF3C4"/></svg>`;
}

/* ==========================================================
   PANTALLAS DEL CLUB
   ========================================================== */
function estrellas(n,max){ max=max||5; let s=""; for(let i=0;i<max;i++) s+=`<span class="${i<n?'on':''}">★</span>`; return `<span class="estrellas">${s}</span>`; }

// ficha visual de un club (se usa en ofertas y en la presentación)
function bannerClub(club,opts){
  opts=opts||{};
  const [c1,c2]=club.c;
  const info=CLUB_INFO[club.n];
  return `<div class="banner-club" style="--c1:${c1};--c2:${c2}">
    <div class="bc-franja"></div>
    <div class="bc-cuerpo">
      <div class="bc-escudo">${escudo(club,opts.tam||72)}</div>
      <div class="bc-datos">
        <div class="bc-nombre">${club.sel?t3("Selección de ","Seleção de ","")+club.n+(IDIOMA==="en"?" national team":""):club.n}</div>
        ${info&&info.ap?`<div class="bc-apodo">${info.ap}</div>`:""}
        <div class="bc-badges">${opts.badges||""}</div>
      </div>
    </div></div>`;
}

// la presentación en el club: historia, clásico, ídolo, lo que te exigen
function introClub(sigue){
  window.__sigueIntro=sigue; S.introVisto=S.club.n;
  const c=S.club, info=CLUB_INFO[c.n], sel=c.sel?SEL_INFO[c.n]:null;
  const cla=c.sel?null:clasicoDe(c);
  const idolo=IDOLOS[c.n];
  const filas=[];
  if(info){
    filas.push([t3("Fundado","Fundado","Founded"),info.f]);
    filas.push([t3("Estadio","Estádio","Stadium"),info.est]);
    if(info.dt) filas.push([t3("DT histórico","Técnico histórico","Legendary coach"),info.dt]);
  }
  if(idolo) filas.push([t3("Ídolo","Ídolo","Idol"),idolo.n]);
  if(cla) filas.push([t3("Clásico","Clássico","Derby"),`${escudo(cla,18)} ${cla.n}`]);
  const glo=info?L(info.glo):sel?L(sel.glo):"";
  const meta=info?L(info.meta):"";
  const cul=info?L(info.cul):sel?L(sel.cul):"";
  $("#s-club").innerHTML=`
    <h2 class="disp">${t3("Te presentan en ","Você é apresentado no ","Unveiled at ")}${c.n}</h2>
    ${bannerClub(c,{badges:badgesClub(c,S.division)})}
    ${filas.length?`<div class="ficha-club">${filas.map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>`:""}
    ${glo?`<div class="gloria">${trofeo(c.sel?"sel":"conti",26)}<div><div class="cat">${t3("Su gloria","Sua glória","Their glory")}</div>${glo}</div></div>`:""}
    ${cul?`<p class="mini" style="margin-top:10px">${cul}</p>`:""}
    ${meta?`<div class="deuda"><div class="cat">${t3("Lo que te piden","O que te pedem","What they expect")}</div>${meta}</div>`:""}
    ${!glo&&!meta?`<p>${t3(`Club de ${c.p}. Nadie espera milagros, pero todos miran la tabla.`,
      `Clube de ${c.p}. Ninguém espera milagres, mas todos olham a tabela.`,
      `A club from ${c.p}. Nobody expects miracles, but everyone watches the table.`)}</p>`:""}
    <div class="acciones"><button class="btn" onclick="const f=window.__sigueIntro;window.__sigueIntro=null;f&&f()">${t3("Asumir el cargo","Assumir o cargo","Take charge")}</button></div>`;
  ir("club");
}
function badgesClub(club,div){
  if(club.sel) return `<span class="badge pro">${t3("SELECCIÓN","SELEÇÃO","NATIONAL TEAM")}</span>${estrellas(club.niv)}`;
  const pro=div===3;
  return `<span class="badge ${pro?'pro':'base'}">${pro?t3("PROFESIONAL","PROFISSIONAL","FIRST TEAM"):t3("FORMATIVAS","CATEGORIAS DE BASE","ACADEMY")}</span>
    ${pro?"":`<span class="badge div">${[...new Set([tDiv(DIVISIONES[div].n),DIVISIONES[div].comp])].join(" · ")}</span>`}
    ${estrellas(club.niv)}`;
}

/* ==========================================================
   IDIOMA DEL CLUB — cada vez que llegás a un país con otro idioma
   ========================================================== */
// sólo se ofrecen los idiomas que el juego tiene de verdad
const IDIOMA_REAL={"Uruguay":"es","Argentina":"es","España":"es","Brasil":"pt","Inglaterra":"en","Estados Unidos":"en",
  "Colombia":"es","Chile":"es","Paraguay":"es","Perú":"es","Ecuador":"es","México":"es"};
const NOMBRE_IDIOMA={es:{es:"español",pt:"espanhol",en:"Spanish"},pt:{es:"portugués",pt:"português",en:"Portuguese"},en:{es:"inglés",pt:"inglês",en:"English"}};
function nombreIdioma(id){ return NOMBRE_IDIOMA[id][IDIOMA]; }
function necesitaIdioma(){
  const sug=IDIOMA_REAL[S.club.p];
  return sug && sug!==IDIOMA && S.langClub!==S.club.n;
}
function pantallaIdioma(sigue){
  const sug=IDIOMA_REAL[S.club.p];
  const en={es:"Seguir en español",pt:"Seguir em português",en:"Keep playing in English"}[IDIOMA];
  const adopt={es:"Hablarle en español",pt:"Falar em português",en:"Speak to them in English"}[sug];
  window.__sigueIdioma=sigue;
  $("#s-club").innerHTML=`
    <h2 class="disp">${t3("El idioma del vestuario","O idioma do vestiário","The dressing-room language")}</h2>
    ${bannerClub(S.club,{tam:48})}
    <p>${t3(`En ${S.club.n} se habla ${NOMBRE_IDIOMA[sug].es}. Si te adaptás, la gente lo nota.`,
      `No ${S.club.n} se fala ${NOMBRE_IDIOMA[sug].pt}. Se você se adaptar, as pessoas percebem.`,
      `At ${S.club.n} they speak ${NOMBRE_IDIOMA[sug].en}. If you adapt, people notice.`)}</p>
    <button class="card" onclick="elegirIdiomaClub(true)"><b style="font-size:19px">${adopt}</b>
      <div class="efecto">${t3("Hinchada +4 · Vestuario +3: te ganás a la gente","Torcida +4 · Vestiário +3: você conquista as pessoas","Fans +4 · Dressing room +3: you win people over")}</div>
      <div class="sub">${t3("El juego pasa a ","O jogo passa para ","The game switches to ")}${nombreIdioma(sug)}</div></button>
    <button class="card" onclick="elegirIdiomaClub(false)"><b style="font-size:19px">${en}</b>
      <div class="costo">${t3("Hinchada −2: el técnico que no se adapta","Torcida −2: o técnico que não se adapta","Fans −2: the coach who won't adapt")}</div></button>`;
  ir("club");
}
function elegirIdiomaClub(adapta){
  const sug=IDIOMA_REAL[S.club.p];
  S.langClub=S.club.n;
  if(adapta){ setIdioma(sug); S.vars.hin=clamp(S.vars.hin+4,0,100); S.vars.ves=clamp(S.vars.ves+3,0,100); }
  else S.vars.hin=clamp(S.vars.hin-2,0,100);
  cabecera();
  const f=window.__sigueIdioma; window.__sigueIdioma=null; if(f) f();
}

/* ==========================================================
   LA PRENSA — aparece cuando llegás a un club grande
   ========================================================== */
function necesitaPrensa(){ return !S.prensaElegida && !S.esSeleccion && S.division===3 && S.club.niv>=4; }
function pantallaPrensa(sigue){
  window.__siguePrensa=sigue;
  $("#s-club").innerHTML=`
    <h2 class="disp">${t3("La prensa te espera","A imprensa te espera","The press is waiting")}</h2>
    <p>${t3(`En ${S.club.n} cada palabra tuya es tapa. ¿Cómo vas a manejar a los periodistas?`,
      `No ${S.club.n} cada palavra sua vira manchete. Como vai lidar com os jornalistas?`,
      `At ${S.club.n} every word you say makes headlines. How will you handle the media?`)}</p>
    ${POLITICAS_PRENSA.map(x=>`
      <button class="card" onclick="elegirPrensa('${x.id}')">
        <b>${tPrensa(x,"n")}</b><div class="sub">${tPrensa(x,"desc")}</div>
        <div class="efecto">${tPrensa(x,"pro")}</div>
        ${x.contra?`<div class="costo">${tPrensa(x,"contra")}</div>`:""}</button>`).join("")}`;
  ir("club");
}
function elegirPrensa(id){
  const P=POLITICAS_PRENSA.find(x=>x.id===id)||POLITICAS_PRENSA[1];
  S.prensa=P; S.prensaElegida=true;
  S.vars.hin=clamp(S.vars.hin+P.hin,0,100); S.vars.dir=clamp(S.vars.dir+P.dir,0,100); S.vars.ves=clamp(S.vars.ves+P.ves,0,100);
  cabecera();
  const f=window.__siguePrensa; window.__siguePrensa=null; if(f) f();
}
