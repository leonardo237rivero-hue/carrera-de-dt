// Carrera de DT — planteles reales (primera división)
// Fuente: Wikipedia (planteles al 30/09/2026) y BeSoccer (Internacional). Los niveles los calcula el juego.
// Clubes sin dato confiable quedan con nombres generados.
const PLANTELES={
"Peñarol": {
"POR": [
"Sebastián Britos",
"Leandro Díaz",
"Washington Aguerre"
],
"DEF": [
"Franco Escobar",
"Mauricio Lemos",
"Emanuel Gularte",
"Maximiliano Olivera",
"Kevin Rodríguez",
"Rodrigo Álvez",
"Matías González",
"Andrés Madruga",
"Lucas Hernández",
"Ignacio Alegre",
"Nahuel Herrera",
"Diego Laxalt"
],
"MED": [
"Eric Remedi",
"Nicolás Fernández",
"Leonardo Fernández",
"Eduardo Darias",
"Julio Daguer",
"Tomás Olase",
"Germán Barbas",
"Jesús Trindade",
"Stiven Muhlethaler",
"Leandro Umpiérrez",
"Lorenzo Couture",
"Franco González"
],
"ATA": [
"Javier Cabrera",
"Facundo Batista",
"Abel Hernández",
"Brandon Álvarez"
]
},
"Nacional": {
"POR": [
"Luis Mejía",
"Alexis Martín Arias",
"Ignacio Suárez"
],
"DEF": [
"Agustín Rogel",
"Sebastián Coates",
"Francisco Calvo",
"Nicolás Rodríguez",
"Emiliano Ancheta",
"Gastón Martirena",
"Camilo Cándido",
"Benjamín Núñez",
"Tomás Viera"
],
"MED": [
"Luciano Boggio",
"Santiago Silva",
"Agustín Dos Santos",
"Rubén Botta",
"Lucas Rodríguez",
"Bruno Zuculini",
"Luciano González",
"Juan Ignacio García"
],
"ATA": [
"Maxi Gómez",
"Maximiliano Silvera",
"Alejandro Martínez",
"Pavel Núñez",
"Tomás Verón Lupi",
"Tiziano Correa",
"Rodrigo Martínez",
"Nahuel Gelos"
]
},
"Danubio": {
"POR": [
"Mauro Goicoechea",
"Kevin Martínez"
],
"DEF": [
"Emiliano Velázquez",
"Joaquín Pereyra",
"Mateo Rinaldi",
"Leandro Sosa",
"Camilo Mayada",
"Martín Jourdan",
"Facundo Balatti"
],
"MED": [
"Juan Millán",
"Sebastián Rodríguez",
"Mateo Peralta",
"Emiliano Figueroa",
"Iván Rossi",
"Alexander Velázquez",
"Axel Montaña"
],
"ATA": [
"Enzo Cabrera",
"Ivo Costantino",
"Maicol Ferreira",
"Nicolas Azambuja",
"Diego Píriz",
"Enrique Femia",
"Sebastián Fernández"
]
},
"Liverpool": {
"POR": [
"Mathías Bernatene",
"Martín Campaña"
],
"DEF": [
"Facundo Perdomo",
"Jean Rosso",
"Santiago Laquidaín",
"Agustín Cayetano",
"Enzo Castillo",
"Kevin Amaro",
"Nicolas Cabral",
"Kevin Lewis"
],
"MED": [
"Nicolás Garayalde",
"Santiago Milano",
"Lucas Acosta",
"Martín Rabuñal",
"Ezequiel Olivera"
],
"ATA": [
"Federico Martínez",
"Renzo Machado",
"Ramiro Degregorio",
"Rubén Bentancourt",
"Alfonso de Luca",
"Diego Zabala",
"Facundo Barceló",
"Felipe Barrenechea"
]
},
"Defensor Sporting": {
"POR": [
"Lucas Machado",
"Kevin Dawson",
"Bruno Simone"
],
"DEF": [
"Daniel Martínez",
"Guillermo de los Santos",
"Geanfranco Rodríguez",
"Francisco Sorondo",
"Axel Frugone",
"Valentín Rodríguez",
"Mateo Caballero",
"Marco Saravia",
"Patricio Pacífico"
],
"MED": [
"Germán Barrios",
"Mauricio Amaro",
"Nicolás Wunsch",
"Xavier Biscayzacú",
"Lucas de los Santos",
"Juan Manuel Jorge",
"Erico Cuello",
"Santino Bruschi"
],
"ATA": [
"Brian Lozano",
"Lucas Agazzi",
"Alan Torterolo",
"Brian Montenegro",
"Lautaro Navarro",
"Facundo Castro"
]
},
"Montevideo Wanderers": {
"POR": [
"Agustín Buffa",
"José Río"
],
"DEF": [
"Paulo Lima",
"Guillermo Borthagaray",
"Leandro Zazpe",
"Nahuel Furtado",
"Fabricio Formiliano",
"Mateo Acosta",
"Alan García",
"Lisandro Bajú",
"Santiago Benítez",
"Nicolás Olivera"
],
"MED": [
"Nicolás Queiróz",
"Jonás Luna",
"José Alberti",
"Gonzalo Freitas",
"Jonathan Urretaviscaya"
],
"ATA": [
"Rodrigo Rivero",
"Roque Ricca",
"Luciano Cosentino",
"Joaquín Zeballos",
"Pablo Suárez",
"Santiago Guzmán",
"Esteban Crucci",
"Facundo Labandeira"
]
},
"Cerro": {
"POR": [
"Yonatan Irrazábal",
"Fabrizio Correa",
"Diego Capdevila"
],
"DEF": [
"Mateo Argüello",
"Gianni Rodríguez",
"Facundo Butti",
"Damián Suárez",
"Martín Farías",
"Iván Valenzuela",
"Emanuel Carlos"
],
"MED": [
"Alejo Macelli",
"Agustín Miranda",
"Brahian Alemán",
"Emiliano Sosa",
"Jairo Amaro"
],
"ATA": [
"Bruno Morales",
"Emiliano Rodríguez",
"Alan Zamurio",
"Nahuel Sena",
"Cristian Barros",
"Santiago Paiva",
"Jeison Cubas"
]
},
"Racing de Montevideo": {
"POR": [
"Facundo Machado",
"Federico Varese"
],
"DEF": [
"Facundo Parada",
"Ramiro Brazionis",
"Guillermo Cotugno",
"Felipe Álvarez",
"Diego Cheuquepal",
"Robinson Ferreira"
],
"MED": [
"Juan Bosca",
"José Varela",
"Felipe Cairus",
"Erik De Los Santos",
"Esteban Da Silva",
"Juan Pérez",
"Lucca Loprete",
"Yuri Oyarzo",
"Álex Vázquez"
],
"ATA": [
"Hugo Silveira",
"Franco Suárez",
"Tomás Habib",
"Rodrigo Dudok",
"Agustín Kahl",
"Thiago Fernández",
"Nicolás Sosa",
"Sebastián da Silva",
"Bautista Tomatis",
"Iván Manzur"
]
},
"Boston River": {
"POR": [
"Bruno Antúnez",
"Juan González"
],
"DEF": [
"Kevin Sotto",
"Marco Mancebo",
"Ignacio Fernández",
"Agustín Granja",
"Fredy Martínez",
"Mateo Rivero",
"Jairo O'Neil",
"Agustín Aguirre",
"Martín González",
"Juan Acosta"
],
"MED": [
"Francisco Barrios",
"Andrés Romero",
"Agustín Amado",
"Gastón Ramírez",
"Federico Dafonte",
"Leandro Suhr",
"Marcelo Hornos",
"Facundo Muñoa"
],
"ATA": [
"Facundo Rodríguez",
"Francisco Bonfiglio",
"Alexander González",
"Facundo Saldaña",
"Francisco Martinicorena"
]
},
"Plaza Colonia": {
"POR": [
"Joaquín Silva",
"Mariano Mendoza",
"Guillermo Reyes"
],
"DEF": [
"Máximo Lorenzi",
"Haibrany Ruiz Díaz",
"Matías Velázquez",
"Santiago Otegui",
"Ángel Cayetano",
"Juan Pablo Hernández",
"Juan Ramos"
],
"MED": [
"Yvo Calleros",
"Miqueas Redín",
"Diego Villalba",
"Ezequias Redín",
"Facundo Píriz",
"Cristian Barros"
],
"ATA": [
"Álvaro López",
"Alex Bruno",
"Agustín Ocampo",
"Gonzalo Bueno",
"Hebert Vergara",
"Lucas Carrizo"
]
},
"Cerro Largo": {
"POR": [
"Juan Moreno",
"Pedro González",
"Lukas González"
],
"DEF": [
"Gabriel Chocobar",
"Alexis Piegas",
"Fernando Souza",
"Mateo Monserrat",
"Lucas Correa",
"Matías Fracchia",
"Santiago Franca",
"Julián Pou",
"Facundo Alvez"
],
"MED": [
"Santiago Marcel",
"Axel Pandiani",
"Sebastián Assis",
"Nicolás Bertocchi",
"Emiliano Jourdan",
"Bruno Hernández"
],
"ATA": [
"Gustavo Viera",
"Maximiliano Añasco",
"Borys Barone",
"Alexander Hernández",
"Diego Daguerre",
"Federico Sellecchia",
"Thomas González",
"Ihojan Pérez"
]
},
"Progreso": {
"POR": [
"Andrés Mehring",
"Agustín Requena"
],
"DEF": [
"Sebastián Cardozo",
"Marcos Paolini",
"Hernán Carroso",
"Facundo Kidd",
"Mauro Martín",
"Gianfranco Trasante",
"Deivis Santo",
"Ayrton Cougo"
],
"MED": [
"Agustín Pinheiro",
"Fabricio Fernández",
"Adrián Colombino",
"Ignacio Lemmo",
"Gonzalo Silva",
"Agustín Paz",
"Santiago Viera",
"Agustín Codagnone"
],
"ATA": [
"Gary Silva",
"Facundo de León",
"Joaquín Solleiro",
"Juan Rivero",
"Matteo Copelotti",
"Jonathan dos Santos",
"Nicolás Fernández",
"Federico Ruiz",
"Diego Sánchez"
]
},
"Rampla Juniors": {
"POR": [
"Andrés Samurio",
"Maicol Vera"
],
"DEF": [
"Jonathan Toledo",
"Lautaro Centurión",
"Álvaro Gracés",
"Germán Gabriel",
"Federico Barrandeguy",
"Enrique Etcheverry",
"Diego Arismendi",
"Gonzalo Camargo"
],
"MED": [
"Isaac Méndez",
"Facundo Ospitaleche",
"Nicolás Mezquida",
"Gustavo Machado",
"Diego Rosa",
"Juan Pablo Plada",
"Adrián Leites",
"Lucas Tamareo",
"Matías Núñez",
"Franco Casuriaga"
],
"ATA": [
"Lautaro Rinaldi",
"Enrique Almeida",
"Maximiliano Burruzo",
"Nicolás Dibble",
"Lucas Bassadone"
]
},
"River Plate de Montevideo": {
"POR": [
"Damián Frascarelli",
"Fabrizio Correa"
],
"DEF": [
"Facundo Pérez",
"Dylan Gissi",
"Lautaro Pertusatti",
"Rodrigo Cabrera",
"Christian Almeida",
"Franco Cabrera",
"Emilio Crespo",
"Lorenzo González"
],
"MED": [
"Jonathan Rodríguez",
"Mauro Estol",
"Cristian Sención",
"Matías Alfonso",
"Guillermo Oroño",
"Ian López"
],
"ATA": [
"Joaquín Lavega",
"Agustín Vera",
"Nicolás Schiappacasse",
"Inti López",
"Matías Mier"
]
},
"Boca Juniors": {
"POR": [
"Álvaro Montero",
"Leandro Brey",
"Agustín Marchesín"
],
"DEF": [
"Lautaro Di Lollo",
"Lautaro Blanco",
"Nicolás Figal",
"Marco Pellegrino",
"Ayrton Costa",
"Leandro Lozano",
"Dylan Gorosito"
],
"MED": [
"Leandro Paredes",
"Rodrigo Battaglia",
"Carlos Palacios",
"Tomás Belmonte",
"Tomás Aranda",
"Williams Alarcón",
"Milton Delgado",
"Kevin Zenón"
],
"ATA": [
"Miguel Merentiel",
"Milton Giménez",
"Ángel Romero",
"Adam Bareiro",
"Enner Valencia",
"Leonel Flores"
]
},
"River Plate": {
"POR": [
"Ezequiel Centurión",
"Santiago Beltrán",
"Jeremías Martinet"
],
"DEF": [
"Lucas Martínez Quarta",
"Gonzalo Montiel",
"Marcos Acuña",
"Nicolás Otamendi",
"Lautaro Rivero",
"Juan Carlos Portillo",
"Facundo González",
"Giovanni González"
],
"MED": [
"Aníbal Moreno",
"Mauro Arambarri",
"Thiago Almada",
"Juan Cruz Meza",
"Tomás Galván",
"Tobías Andrada",
"Lucas Silva"
],
"ATA": [
"Sebastián Driussi",
"Ángel Correa",
"Rafael Santos Borré",
"Lautaro Pereyra",
"Agustín Ruberto"
]
},
"Racing Club": {
"POR": [
"Facundo Cambeses",
"Francisco Gómez",
"Matías Tagliamonte"
],
"DEF": [
"Marco Di Césare",
"Marcos Rojo",
"Matías Pérez",
"Alfonso Espino",
"Nazareno Colombo",
"Gonzalo Escudero",
"Ignacio Rodríguez"
],
"MED": [
"Matías Zaracho",
"Matko Miljević",
"Matías Kranevitter",
"Alan Forneris",
"Ulises Ortegoza",
"Gastón Lodico",
"Adrián Fernández",
"Alejandro Tello"
],
"ATA": [
"Adrián Martínez",
"Duván Vergara",
"Tomás Conechny",
"Elías Torres"
]
},
"Independiente": {
"POR": [
"Rodrigo Rey",
"Mateo Morro"
],
"DEF": [
"Santiago Arias",
"Kevin Lomónaco",
"Juan Fedorco",
"Milton Valenzuela",
"Facundo Zabala",
"Leonardo Godoy",
"Sebastián Valdez",
"Gonzalo Bordón"
],
"MED": [
"Rodrigo Fernández Cedrés",
"Iván Marcone",
"Luciano Cabral",
"Federico Mancuello",
"Lautaro Millán",
"Ignacio Malcorra",
"Tomás Parmo",
"Mateo Pérez Curci"
],
"ATA": [
"Gabriel Ávalos",
"Santiago Montiel",
"Ignacio Pussetto",
"Santino Viollaz"
]
},
"San Lorenzo": {
"POR": [
"Orlando Gill",
"Facundo Altamirano",
"José Devecchi"
],
"DEF": [
"Guzmán Corujo",
"Gastón Hernández",
"Jhohan Romaña",
"Mathías De Ritis",
"Teo Rodríguez Pagano",
"Nahuel Arias",
"Ezequiel Herrera",
"Daniel Herrera"
],
"MED": [
"Manuel Insaurralde",
"Ignacio Perruzzi",
"Nicolás Tripichio",
"Nahuel Barrios",
"Juan Rattalino",
"Facundo Gulli",
"Cristian Gallardo",
"Mauricio Cardillo"
],
"ATA": [
"Ezequiel Cerutti",
"Alexis Cuello",
"Matías Reali",
"Luciano Vietto",
"Diego Herazo"
]
},
"Estudiantes": {
"POR": [
"Fernando Muslera",
"Fabricio Iacovich",
"Rodrigo Borzone"
],
"DEF": [
"Santiago Núñez",
"Leandro González Pírez",
"Santiago Arzamendia",
"Eric Meza",
"Ramiro Funes Mori",
"Gastón Benedetti",
"Valente Pierani"
],
"MED": [
"José Sosa",
"Gabriel Neves",
"Ezequiel Piovi",
"Alexis Castro",
"Bautista Kociubinski",
"Jalil Elías",
"Baltasar Rodríguez"
],
"ATA": [
"Guido Carrillo",
"Tiago Palacios",
"Edwuin Cetré",
"Lucas Alario",
"Joaquín Correa",
"Adolfo Gaich"
]
},
"Vélez Sarsfield": {
"POR": [
"Tomás Marchiori",
"Álvaro Busso"
],
"DEF": [
"Emanuel Mammana",
"Elías Gómez",
"Joaquín García",
"Aarón Quirós",
"Lisandro Magallán",
"Simón Escobar",
"Leo Cristaldo",
"Jano Gordon"
],
"MED": [
"Claudio Baeza",
"Diego Valdés",
"Matías Pellegrini",
"Manuel Lanzini",
"Rodrigo Aliendro",
"Ulises Piedrabuena",
"Luca Feler",
"Tobías Andrada"
],
"ATA": [
"Braian Romero",
"Rodrigo Piñeiro",
"Dilan Godoy",
"Álex Verón",
"Florián Monzón",
"Matías Arias"
]
},
"Rosario Central": {
"POR": [
"Jorge Broun",
"Damián Fernández",
"Leonardo Sosa"
],
"DEF": [
"Carlos Quintana",
"Agustín Sández",
"Ulises Ciccioli",
"Juan Cruz Komar",
"Facundo Mallo",
"Enzo Giménez",
"Juan Giménez",
"Emanuel Coronel"
],
"MED": [
"Franco Ibarra",
"Jáminton Campaz",
"Santiago Segovia",
"Vicente Pizarro",
"Giovanni Cantizano",
"Pol Fernández",
"Federico Navarro",
"Samuel Beltrán"
],
"ATA": [
"Ángel Di María",
"Enzo Copetti",
"Gaspar Duarte",
"Marco Ruben",
"Fabricio Oviedo"
]
},
"Talleres": {
"POR": [
"Santino Barbi",
"Ezequiel Unsain"
],
"DEF": [
"Timoteo Chamorro",
"Alexandro Maidana",
"Matías Catalán",
"Román Riquelme",
"Valentín Fascendini",
"Augusto Schott",
"Gabriel Báez",
"Santiago Fernández"
],
"MED": [
"Matías Galarza",
"Federico Fattori",
"Giovanni Baroni",
"Franco Cristaldo",
"Matías Gómez",
"Mateo Cáceres",
"Jeremías Gallard"
],
"ATA": [
"Valentín Depietri",
"Ignacio Alastra",
"Emiliano Chiavassa",
"Rick",
"Valentín Dávila",
"Ronaldo Martínez"
]
},
"Lanús": {
"POR": [
"Franco Petroli",
"Nahuel Losada"
],
"DEF": [
"Luciano Romero",
"Nicolás Morgantini",
"Gonzalo Pérez",
"Sasha Marcich",
"José Canale",
"Alexis González",
"Carlos Izquierdoz",
"Octavio Ontivero"
],
"MED": [
"Felipe Peña Biafore",
"Franco Watson",
"Marcelino Moreno",
"Raúl Loaiza",
"Matías Sepúlveda",
"Agustín Medina",
"Ramiro Carrera",
"Facundo Sánchez"
],
"ATA": [
"Eduardo Salvio",
"Jeremías Chavero",
"Yoshan Valois",
"Allan Wlk",
"Thomás De Martis",
"Benjamín Acosta"
]
},
"Huracán": {
"POR": [
"Hernán Galíndez",
"Nazareno Durán",
"Sebastián Meza"
],
"DEF": [
"Lucas Carrizo",
"Fabio Pereyra",
"Leandro Lescano",
"Hugo Nervo",
"César Ibáñez",
"Ignacio Campo",
"Máximo Palazzo"
],
"MED": [
"Leonardo Gil",
"Óscar Romero",
"Thaiel Peralta",
"Facundo Waller",
"Emmanuel Ojeda",
"Lautaro Mora",
"Facundo Kalinger"
],
"ATA": [
"Juan Bisanz",
"Tomás Uribe"
]
},
"Argentinos Juniors": {
"POR": [
"Agustín Mangiaut",
"Gonzalo Siri",
"Valentín Catalán"
],
"DEF": [
"Luciano Sánchez",
"Érik Godoy",
"Román Riquelme",
"Kevin Coronel",
"Francisco Álvarez",
"Sebastián Prieto",
"Claudio Bravo"
],
"MED": [
"Lucas Gómez",
"Alan Lescano",
"Nicolás Oroz",
"Gabriel Florentín",
"Federico Fattori",
"Joaquín Gho",
"Emiliano Viveros",
"Enzo Pérez"
],
"ATA": [
"Lautaro Giaccone",
"Gastón Verón",
"Leandro Fernández",
"Tomás Molina",
"Iván Morales",
"Matías Giménez"
]
},
"Platense": {
"POR": [
"Brian Bustos",
"Nicolás Sumavil"
],
"DEF": [
"Tomás Silva",
"Eugenio Raggio",
"Jonathan Bay",
"Ignacio Vázquez",
"Juan Ignacio Saborido",
"Víctor Cuesta",
"Gonzalo Goñi"
],
"MED": [
"Iván Gómez",
"Franco Zapiola",
"Pablo Ferreira"
],
"ATA": [
"Guido Mainero",
"Agustín Ocampo",
"Bautista Merlini",
"Augusto Lotti",
"Manuel Tucker",
"Franco Minerva"
]
},
"Newell's Old Boys": {
"POR": [
"Gabriel Arias",
"Josué Reinatti"
],
"DEF": [
"Ian Glavinovich",
"Martín Luciano",
"Alejo Montero",
"Martín Ortega",
"Lautaro Giannetti",
"Oscar Salomón",
"Franco Escobar"
],
"MED": [
"Luca Regiardo",
"David Sotelo",
"Valentino Acuña",
"Alan Soñora",
"Jerónimo Gómez Mattar",
"Facundo Guch",
"Rodrigo Herrera",
"Marcelo Esponda"
],
"ATA": [
"Matías Cóccaro",
"Mateo García",
"Francisco Scarpeccio",
"Thomas Rios",
"Ignacio Ramírez"
]
},
"Internacional": {
"POR": [
"S. Rochet",
"Anthoni",
"Matheus Cunha"
],
"DEF": [
"A. Bernabei",
"B. Aguirre",
"G. Maripán",
"Matheus",
"Bruno Gomes",
"G. Mercado",
"F. Torres",
"Juninho"
],
"MED": [
"Alan Patrick",
"Thiago Maia",
"Bruno Henrique",
"R. Villagra",
"N. Eliasson",
"Ronaldo",
"Calebe",
"Paulinho"
],
"ATA": [
"Vitinho",
"J. Carbonero",
"A. Sanabria",
"Alerrandro",
"Kayky",
"Raykkonen"
]
},
"Atlético de Madrid": {
"POR": [
"Jan Oblak",
"Juan Musso",
"Salvi Esquivel"
],
"DEF": [
"Dávid Hancko",
"Marc Pubill",
"Cristian Romero",
"Alejandro Grimaldo",
"Robin Le Normand",
"Dani Martínez",
"Jorge Domínguez"
],
"MED": [
"Koke",
"Pablo Barrios",
"Johnny Cardoso",
"Álex Baena",
"Ademola Lookman",
"Lee Kang-in",
"Obed Vargas",
"Rodrigo Mendoza"
],
"ATA": [
"Julián Alvarez",
"Alexander Sørloth",
"Giuliano Simeone",
"Miguel Cubo"
]
},
"Sevilla": {
"POR": [
"Fran González",
"Rafa Romero"
],
"DEF": [
"Juan Iglesias",
"Julio Díaz",
"Kike Salas",
"Andrés Castrín",
"Arouna Sangante",
"Gabriel Suazo",
"José Ángel Carmona",
"Marcão"
],
"MED": [
"Lucien Agoumé",
"Giorgi Kochorashvili",
"Peque Fernández",
"Jon Guridi",
"Nico Guillén",
"Manu Bueno",
"Edu Altozano"
],
"ATA": [
"Alfon González",
"Robbie Ure",
"Rubén Vargas",
"Isaac Romero",
"Chidera Ejuke",
"Manuel Ángel"
]
},
"Real Sociedad": {
"POR": [
"Álex Remiro",
"Unai Marrero",
"Theo Folgado"
],
"DEF": [
"Jon Aramburu",
"Aihen Muñoz",
"Igor Zubeldia",
"Jon Pacheco",
"Álvaro Odriozola",
"Jon Martín",
"Héctor Fort",
"Luken Beitia"
],
"MED": [
"Jon Gorrotxategi",
"Beñat Turrientes",
"Takefusa Kubo",
"Pablo Marín",
"Sergio Gómez",
"Carlos Soler",
"Yangel Herrera",
"Mikel Goti"
],
"ATA": [
"Mikel Oyarzabal",
"Ander Barrenetxea",
"Orri Óskarsson",
"Gonçalo Guedes",
"Job Ochieng",
"Gorka Carrera"
]
},
"Athletic Club": {
"POR": [
"Unai Simón",
"Álex Padilla",
"Mikel Santos"
],
"DEF": [
"Dani Vivian",
"Aitor Paredes",
"Yeray Álvarez",
"Jesús Areso",
"Aymeric Laporte",
"Hugo Rincón",
"Yuri Berchiche",
"Johaneko Louis-Jean"
],
"MED": [
"Beñat Prados",
"Oihan Sancet",
"Iñigo Ruiz de Galarreta",
"Mikel Jauregizar",
"Alejandro Rego",
"Beñat Gerenabarrena",
"Peio Canales",
"Selton Sánchez"
],
"ATA": [
"Iñaki Williams",
"Nico Williams",
"Gorka Guruzeta",
"Álex Berenguer",
"Maroan Sannadi",
"Nico Serrano"
]
},
"Villarreal": {
"POR": [
"Luiz Júnior",
"Rubén Gómez",
"Péter Gulácsi"
],
"DEF": [
"Logan Costa",
"Alex Freeman",
"Pau Navarro",
"Juan Foyth",
"Renato Veiga",
"Santiago Mouriño",
"Carlos Romero",
"Sergi Cardona"
],
"MED": [
"Alberto Moleiro",
"Santi Comesaña",
"Pape Gueye",
"Tajon Buchanan",
"Carlos Maciá",
"Alassane Diatta",
"Nathan Saliba",
"Cheikh Thiam"
],
"ATA": [
"Gerard Moreno",
"Georges Mikautadze",
"Nicolas Pépé",
"Ayoze Pérez",
"Tani Oluwaseyi",
"Ilias Akhomach"
]
},
"Valencia": {
"POR": [
"Stole Dimitrievski",
"Cristian Rivero"
],
"DEF": [
"José Copete",
"Mouctar Diakhaby",
"César Tárrega",
"Justin de Haas",
"José Gayà",
"Dimitri Foulquier",
"Jesús Vázquez",
"Arnau Martínez"
],
"MED": [
"Guido Rodríguez",
"Javi Guerra",
"Pepelu",
"Filip Ugrinić",
"Aliou Dieng",
"Ryūnosuke Satō",
"Aaron Mayol",
"Sergi Canós"
],
"ATA": [
"Hugo Duro",
"Umar Sadiq",
"Arnaut Danjuma",
"Luis Rioja",
"Diego López",
"Dani Raba"
]
},
"Real Madrid": {
"POR": [
"Thibaut Courtois",
"Andriy Lunin"
],
"DEF": [
"Éder Militão",
"Dean Huijsen",
"Trent Alexander-Arnold",
"Ibrahima Konaté",
"Marc Cucurella",
"Álvaro Carreras",
"Antonio Rüdiger",
"Denzel Dumfries"
],
"MED": [
"Jude Bellingham",
"Eduardo Camavinga",
"Federico Valverde",
"Aurélien Tchouaméni",
"Arda Güler",
"Bernardo Silva",
"Thiago Pitarch"
],
"ATA": [
"Kylian Mbappé",
"Vinícius Júnior",
"Rodrygo",
"Endrick",
"Carlos Espí",
"Yan Diomande"
]
},
"Barcelona": {
"POR": [
"Joan Garcia",
"Wojciech Szczęsny",
"Dominik Livaković"
],
"DEF": [
"Jules Koundé",
"Pau Cubarsí",
"Alejandro Balde",
"João Cancelo",
"Andreas Christensen",
"Gerard Martín",
"Eric García",
"Xavi Espart"
],
"MED": [
"Pedri",
"Gavi",
"Frenkie de Jong",
"Dani Olmo",
"Fermín López",
"Rodri",
"Marc Bernal",
"Marc Casadó"
],
"ATA": [
"Lamine Yamal",
"Raphinha",
"Karim Adeyemi",
"Anthony Gordon",
"Roony Bardghji"
]
},
"Manchester City": {
"POR": [
"Gianluigi Donnarumma",
"Marcus Bettinelli",
"Gerónimo Rulli"
],
"DEF": [
"Rúben Dias",
"Marc Guéhi",
"Rayan Aït-Nouri",
"Joško Gvardiol",
"Matheus Nunes",
"Abdukodir Khusanov",
"Vitor Reis",
"Kaden Braithwaite"
],
"MED": [
"Phil Foden",
"Rayan Cherki",
"Elliot Anderson",
"Enzo Fernández",
"Mateo Kovačić",
"Nico O'Reilly",
"Ayyoub Bouaddi",
"Floyd Samba"
],
"ATA": [
"Erling Haaland",
"Jérémy Doku",
"Antoine Semenyo",
"Iliman Ndiaye",
"Allan",
"Ryan McAidoo"
]
},
"Liverpool FC": {
"POR": [
"Alisson Becker",
"Giorgi Mamardashvili",
"Freddie Woodman"
],
"DEF": [
"Virgil van Dijk",
"Joe Gomez",
"Milos Kerkez",
"Conor Bradley",
"Jeremie Frimpong",
"Giovanni Leoni",
"Kostas Tsimikas",
"Calvin Ramsay"
],
"MED": [
"Florian Wirtz",
"Dominik Szoboszlai",
"Alexis Mac Allister",
"Ryan Gravenberch",
"Curtis Jones",
"Wataru Endo",
"Harvey Elliott",
"Trey Nyoni"
],
"ATA": [
"Alexander Isak",
"Hugo Ekitike",
"Cody Gakpo",
"Federico Chiesa",
"Rio Ngumoha",
"Víctor Muñoz"
]
},
"Arsenal": {
"POR": [
"David Raya",
"Kepa Arrizabalaga",
"Illan Meslier"
],
"DEF": [
"William Saliba",
"Gabriel Magalhães",
"Jurriën Timber",
"Ben White",
"Piero Hincapié",
"Riccardo Calafiori",
"Cristhian Mosquera",
"Ezri Konsa"
],
"MED": [
"Martin Ødegaard",
"Declan Rice",
"Martín Zubimendi",
"Eberechi Eze",
"Mikel Merino",
"Bruno Guimarães"
],
"ATA": [
"Bukayo Saka",
"Viktor Gyökeres",
"Kai Havertz",
"Noni Madueke",
"Christos Tzolis"
]
},
"Manchester United": {
"POR": [
"Senne Lammens",
"Karl Darlow",
"Tom Heaton"
],
"DEF": [
"Diogo Dalot",
"Noussair Mazraoui",
"Matthijs de Ligt",
"Harry Maguire",
"Lisandro Martínez",
"Leny Yoro",
"Patrick Dorgu",
"Luke Shaw"
],
"MED": [
"Bruno Fernandes",
"Kobbie Mainoo",
"Manuel Ugarte",
"Carlos Baleba",
"Mason Mount",
"Youri Tielemans",
"Andrey Santos",
"Jack Fletcher"
],
"ATA": [
"Bryan Mbeumo",
"Matheus Cunha",
"Benjamin Šeško",
"Amad Diallo",
"Marcus Rashford",
"Joshua Zirkzee"
]
},
"Chelsea": {
"POR": [
"Emiliano Martínez",
"Teddy Sharman-Lowe",
"Gabriel Slonina"
],
"DEF": [
"Wesley Fofana",
"Levi Colwill",
"Reece James",
"Malo Gusto",
"Maxence Lacroix",
"Jorrel Hato",
"Pep Chavarría",
"Josh Acheampong"
],
"MED": [
"Cole Palmer",
"Moisés Caicedo",
"Morgan Rogers",
"Roméo Lavia",
"Valentín Barco",
"Jordan Henderson",
"Reggie Watson",
"Mahdi Nicoll-Jazuli"
],
"ATA": [
"João Pedro",
"Pedro Neto",
"Estêvão",
"Jamie Gittens",
"Geovany Quenda",
"Danny Welbeck"
]
},
"Tottenham": {
"POR": [
"Antonín Kinský",
"Martin Dúbravka",
"Brandon Austin"
],
"DEF": [
"Micky van de Ven",
"Pedro Porro",
"Destiny Udogie",
"Andy Robertson",
"Jan Paul van Hecke",
"Marcos Senesi",
"Tosin Adarabioyo",
"Ben Davies"
],
"MED": [
"Xavi Simons",
"James Maddison",
"Sandro Tonali",
"Lucas Bergvall",
"Conor Gallagher",
"Archie Gray",
"Rodrigo Bentancur",
"Mateus Fernandes"
],
"ATA": [
"Dominic Solanke",
"Mohammed Kudus",
"Dejan Kulusevski",
"Richarlison",
"Mathys Tel",
"Sávio"
]
},
"Newcastle": {
"POR": [
"Nick Pope",
"Lukáš Horníček",
"Ewen Jaouen"
],
"DEF": [
"Tino Livramento",
"Lewis Hall",
"Sven Botman",
"Fabian Schär",
"Malick Thiaw",
"Dan Burn",
"Amar Dedić"
],
"MED": [
"Nico González",
"Joe Willock",
"Jacob Ramsey",
"Lewis Miley",
"Jacob Murphy",
"Aladji Bamba",
"Sean Steur"
],
"ATA": [
"Yoane Wissa",
"Anthony Elanga",
"Harvey Barnes",
"Joelinton",
"William Osula",
"Bazoumana Touré"
]
},
"Aston Villa": {
"POR": [
"Zion Suzuki",
"Marco Bizot"
],
"DEF": [
"Matty Cash",
"Pau Torres",
"Tyrone Mings",
"Victor Lindelöf",
"Ian Maatsen",
"Matteo Ruggeri",
"Modou Kéba Cissé"
],
"MED": [
"John McGinn",
"Boubacar Kamara",
"Amadou Onana",
"Leon Goretzka",
"João Gomes",
"Emiliano Buendía",
"Ross Barkley",
"Lamare Bogarde"
],
"ATA": [
"Nicolas Jackson",
"Tammy Abraham",
"Leon Bailey",
"Brian Madjo",
"Alysson"
]
},
"Milan": {
"POR": [
"Mike Maignan",
"Pietro Terracciano",
"Lorenzo Torriani"
],
"DEF": [
"Fikayo Tomori",
"Strahinja Pavlović",
"Pervis Estupiñán",
"Koni De Winter",
"Mario Gila",
"Davide Bartesaghi",
"Sankhoun Diawara",
"Valeri Vladimirov"
],
"MED": [
"Luka Modrić",
"Adrien Rabiot",
"Ardon Jashari",
"Ruben Loftus-Cheek",
"Christian Pulisic",
"Alexis Saelemaekers",
"Samuel Chukwueze",
"Christian Comotto"
],
"ATA": [
"Gonçalo Ramos",
"Diego Moreira",
"Francesco Camarda"
]
},
"Juventus": {
"POR": [
"Carlo Pinsoglio"
],
"DEF": [
"Bremer",
"Federico Gatti",
"Andrea Cambiaso",
"Pierre Kalulu",
"Lloyd Kelly",
"Zeki Çelik",
"Jhon Lucumí",
"Daniele Rugani"
],
"MED": [
"Manuel Locatelli",
"Teun Koopmeiners",
"Khéphren Thuram",
"Weston McKennie",
"Douglas Luiz",
"Kerim Alajbegović",
"Nico González"
],
"ATA": [
"Kenan Yıldız",
"Francisco Conceição",
"Randal Kolo Muani",
"Edon Zhegrova",
"Jérémie Boga",
"Arkadiusz Milik"
]
},
"Inter": {
"POR": [
"Josep Martínez",
"Ivan Provedel",
"Raffaele Di Gennaro"
],
"DEF": [
"Alessandro Bastoni",
"Federico Dimarco",
"Benjamin Pavard",
"Manuel Akanji",
"John Stones",
"Yann Aurel Bisseck",
"Carlos Augusto",
"Djed Spence"
],
"MED": [
"Nicolò Barella",
"Hakan Çalhanoğlu",
"Piotr Zieliński",
"Petar Sučić",
"Curtis Jones",
"Luis Henrique",
"Andy Diouf",
"Aleksandar Stanković"
],
"ATA": [
"Lautaro Martínez",
"Marcus Thuram",
"Ange-Yoan Bonny",
"Pio Esposito"
]
},
"Napoli": {
"POR": [
"Alex Meret",
"Vanja Milinković-Savić",
"Nikita Contini"
],
"DEF": [
"Giovanni Di Lorenzo",
"Amir Rrahmani",
"Alessandro Buongiorno",
"Sam Beukema",
"Mathías Olivera",
"Leonardo Spinazzola",
"Rafa Marín",
"Luca Marianucci"
],
"MED": [
"Kevin De Bruyne",
"Scott McTominay",
"Stanislav Lobotka",
"Frank Anguissa",
"Billy Gilmour",
"Antonio Vergara"
],
"ATA": [
"Rasmus Højlund",
"David Neres",
"Matteo Politano",
"Lorenzo Lucca",
"Giovane",
"Alisson Santos"
]
},
"Roma": {
"POR": [
"Mile Svilar",
"Pierluigi Gollini",
"Giorgio De Marzi"
],
"DEF": [
"Gianluca Mancini",
"Evan Ndicka",
"Mario Hermoso",
"Nahuel Molina",
"Wesley",
"Konstantinos Koulierakis",
"Devyne Rensch",
"Emanuele Lulli"
],
"MED": [
"Manu Koné",
"Bryan Cristante",
"Lorenzo Pellegrini",
"Marten de Roon",
"Niccolò Pisilli",
"Rodrigo Mora"
],
"ATA": [
"Paulo Dybala",
"Matías Soulé",
"Donyell Malen",
"Santiago Castro",
"Antonio Arena"
]
},
"Lazio": {
"POR": [
"Christos Mandas",
"Edoardo Motta",
"Alessio Furlanetto"
],
"DEF": [
"Alessio Romagnoli",
"Nuno Tavares",
"Samuel Gigot",
"Luca Pellegrini",
"Patric",
"Danilho Doekhi",
"Alfonso Pedraza",
"Manuel Lazzari"
],
"MED": [
"Nicolò Rovella",
"Mattia Zaccagni",
"Fisayo Dele-Bashiru",
"Kenneth Taylor",
"Reda Belahyane",
"Bruno Galassi",
"Adrian Przyborek"
],
"ATA": [
"Gustav Isaksen",
"Andrea Pinamonti",
"Tijjani Noslin",
"Boulaye Dia",
"Petar Ratkov",
"Matteo Cancellieri"
]
},
"Atalanta": {
"POR": [
"Marco Carnesecchi",
"Marco Sportiello",
"Francesco Rossi"
],
"DEF": [
"Isak Hien",
"Odilon Kossounou",
"Berat Djimsiti",
"Giorgio Scalvini",
"Raoul Bellanova",
"Sead Kolašinac",
"Mitchel Bakker",
"Lorenzo Bernasconi"
],
"MED": [
"Éderson",
"Charles De Ketelaere",
"Lazar Samardžić",
"Mario Pašalić",
"Nicola Zalewski"
],
"ATA": [
"Gianluca Scamacca",
"Nikola Krstović",
"Giacomo Raspadori",
"Kamaldeen Sulemana"
]
},
"Fiorentina": {
"POR": [
"David de Gea",
"Oliver Christensen",
"Luca Lezzerini"
],
"DEF": [
"Dodô",
"Marin Pongračić",
"Luca Ranieri",
"Fabiano Parisi",
"Víctor Valdepeñas",
"Viery"
],
"MED": [
"Nicolò Fagioli",
"Marco Brescianini",
"Cher Ndour",
"Arthur Atta",
"Christ Inao Oulaï"
],
"ATA": [
"Beto",
"Mateo Pellegrino"
]
},
"Bayern München": {
"POR": [
"Manuel Neuer",
"Jonas Urbig",
"Sven Ulreich"
],
"DEF": [
"Dayot Upamecano",
"Jonathan Tah",
"Kim Min-jae",
"Alphonso Davies",
"Hiroki Itō",
"Konrad Laimer",
"Sacha Boey",
"Nathaniel Brown"
],
"MED": [
"Joshua Kimmich",
"Jamal Musiala",
"Aleksandar Pavlović",
"Tom Bischof",
"Lennart Karl",
"Ismael Saibari",
"Bara Sapoko Ndiaye"
],
"ATA": [
"Harry Kane",
"Michael Olise",
"Luis Díaz",
"Serge Gnabry",
"Tim Binder",
"Bastian Assomo"
]
},
"Borussia Dortmund": {
"POR": [
"Gregor Kobel",
"Patrick Drewes",
"Silas Ostrzinski"
],
"DEF": [
"Nico Schlotterbeck",
"Waldemar Anton",
"Ramy Bensebaini",
"Julian Ryerson",
"Daniel Svensson",
"Joane Gadou",
"Kauã Prates",
"Filippo Mane"
],
"MED": [
"Jobe Bellingham",
"Felix Nmecha",
"Marcel Sabitzer",
"Emre Can",
"Joey Veerman",
"Carney Chukwuemeka",
"Konstantinos Karetsas",
"Justin Lerma"
],
"ATA": [
"Serhou Guirassy",
"Maximilian Beier",
"Fábio Silva",
"Samuele Inácio",
"Mathis Albert"
]
},
"Bayer Leverkusen": {
"POR": [
"Mark Flekken",
"Janis Blaswich",
"Niklas Lomb"
],
"DEF": [
"Edmond Tapsoba",
"Jarell Quansah",
"Loïc Badé",
"Facundo Medina",
"Miguel Gutiérrez",
"Arthur",
"Tim Oermann",
"Axel Tape"
],
"MED": [
"Robert Andrich",
"Aleix García",
"Equi Fernández",
"Malik Tillman",
"Ibrahim Maza",
"Jonas Hofmann",
"Kennet Eichhorn",
"Montrell Culbreath"
],
"ATA": [
"Patrik Schick",
"Victor Boniface",
"Martin Terrier",
"Nathan Tella",
"Afonso Moreira"
]
},
"Eintracht Frankfurt": {
"POR": [
"Kauã Santos",
"Jens Grahl",
"Amil Šiljević"
],
"DEF": [
"Robin Koch",
"Nnamdi Collins",
"Elias Baum",
"Keita Kosugi",
"Niels Nkounkou",
"Timothy Chandler",
"Otávio"
],
"MED": [
"Hugo Larsson",
"Farès Chaïbi",
"Oscar Højlund",
"Mario Götze",
"Noël Aséko",
"Raphael Onyedika",
"Love Arrhov"
],
"ATA": [
"Jonathan Burkardt",
"Ritsu Dōan",
"Ansgar Knauff",
"Jean-Mattéo Bahoya",
"Younes Ebnoutalib"
]
},
"Stuttgart": {
"POR": [
"Fabian Bredlow",
"Stefan Drljača",
"Dennis Seimen"
],
"DEF": [
"Maximilian Mittelstädt",
"Josha Vagnoman",
"Ameen Al-Dakhil",
"Ramon Hendriks",
"Luca Jaquez",
"Leonidas Stergiou",
"Lorenz Assignon",
"Pascal Stenzel"
],
"MED": [
"Angelo Stiller",
"Atakan Karazor",
"Chris Führich",
"Bilal El Khannouss",
"Nikolas Nartey",
"Chema Andrés",
"Noah Darvich",
"Mirza Ćatović"
],
"ATA": [
"Deniz Undav",
"Ermedin Demirović",
"Jamie Leweling",
"Tiago Tomás",
"Justin Diehl",
"Jeremy Arévalo"
]
},
"Paris Saint-Germain": {
"POR": [
"Matvey Safonov",
"Lucas Chevalier",
"Alessandro Longoni"
],
"DEF": [
"Achraf Hakimi",
"Marquinhos",
"Willian Pacho",
"Nuno Mendes",
"Illia Zabarnyi",
"Lucas Hernandez",
"Lucas Beraldo",
"Lucas Digne"
],
"MED": [
"Vitinha",
"João Neves",
"Fabián Ruiz",
"Warren Zaïre-Emery",
"Maghnes Akliouche",
"Senny Mayulu",
"Dro Fernández"
],
"ATA": [
"Ousmane Dembélé",
"Khvicha Kvaratskhelia",
"Désiré Doué",
"Ferran Torres",
"Mika Godts",
"Quentin Ndjantou"
]
},
"RB Leipzig": {
"POR": [
"Maarten Vandevoordt",
"Ørjan Nyland",
"Leopold Zingerle"
],
"DEF": [
"Willi Orbán",
"Castello Lukeba",
"David Raum",
"Ridle Baku",
"Benjamin Henrichs",
"Maxime Estève",
"Abdoul Koné",
"Max Finkgräfe"
],
"MED": [
"Nicolas Seiwald",
"Christoph Baumgartner",
"Brajan Gruda",
"Assan Ouédraogo",
"Ezechiel Banzuzi",
"Rocco Reitz",
"Neil El Aynaoui"
],
"ATA": [
"Christopher Nkunku",
"Antonio Nusa",
"Johan Bakayoko",
"Rômulo",
"Tidiam Gomis",
"Marc Guiu"
]
},
"Marsella": {
"POR": [
"Jeffrey de Lange",
"Jelle Van Neck",
"Théo Vermot"
],
"DEF": [
"Nayef Aguerd",
"CJ Egan-Riley",
"Derek Cornelius",
"Emerson Palmieri",
"Ulisses Garcia",
"Bamo Meïté",
"Kelyann Bezahaf",
"Hilan Hamzaoui"
],
"MED": [
"Pierre-Emile Højbjerg",
"Geoffrey Kondogbia",
"Angel Gomes",
"Himad Abdelli",
"Amine Harit",
"Tochukwu Nnadi",
"Tadjidine Mmadi",
"Keyliane Abdallah"
],
"ATA": [
"Amine Gouiri",
"Igor Paixão",
"Timothy Weah",
"Neal Maupay",
"Faris Moumbagna",
"Sofiane Sidi Ali"
]
},
"Lyon": {
"POR": [
"Dominik Greif",
"Rémy Descamps",
"Justin Bengui"
],
"DEF": [
"Nicolás Tagliafico",
"Moussa Niakhaté",
"Clinton Mata",
"Abner",
"Ruben Kluivert",
"Felix Bacher",
"Mohamed Ouédraogo",
"Noham Kamara"
],
"MED": [
"Corentin Tolisso",
"Tanner Tessmann",
"Tyler Morton",
"Pavel Šulc",
"Mads Bidstrup",
"Khalis Merah",
"Noah Nartey"
],
"ATA": [
"Ernest Nuamah",
"Keito Nakamura",
"Julien Duranville",
"Kaïl Boudache",
"Alejandro Gomes Rodríguez"
]
},
"Mónaco": {
"POR": [
"Lukas Hradecky",
"Philipp Köhn",
"Jules Stawiecki"
],
"DEF": [
"Vanderson",
"Eric Dier",
"Mohammed Salisu",
"Jordan Teze",
"Christian Mawissa",
"Flávio Nazinho",
"Samuel Nibombé",
"Sadibou Sané"
],
"MED": [
"Denis Zakaria",
"Aleksandr Golovin",
"Lamine Camara",
"Takumi Minamino",
"Mamadou Coulibaly",
"Stanis Idumbo",
"Pape Cabral",
"Edan Diop"
],
"ATA": [
"Folarin Balogun",
"Ansu Fati",
"Mika Biereth",
"Matthis Abline",
"Paris Brunner"
]
},
"Lille": {
"POR": [
"Berke Özer",
"Arnaud Bodart",
"Orlando Gill"
],
"DEF": [
"Alexsandro",
"Tiago Santos",
"Romain Perraud",
"Calvin Verdonk",
"Tanguy Nianzou",
"Nathan Ngoy",
"Isaac Cossier",
"Loun Srdanovic"
],
"MED": [
"Benjamin André",
"Hákon Haraldsson",
"Nabil Bentaleb",
"Ngal'ayel Mukau",
"Maurits Kjærgaard"
],
"ATA": [
"Olivier Giroud",
"Ethan Mbappé",
"Osame Sahraoui",
"Ayase Ueda",
"Gaëtan Perrin",
"Başar Önal"
]
},
"Niza": {
"POR": [
"Yehvann Diouf",
"Martin Ponsot",
"Teddy Boulhendi"
],
"DEF": [
"Jonathan Clauss",
"Moïse Bombito",
"Youssouf Ndayishimiye",
"Antoine Mendy",
"Ali Abdi",
"Mohamed Abdelmonem",
"Brad Mantsounga",
"Hamza Koutoune"
],
"MED": [
"Morgan Sanson",
"Hicham Boudaoui",
"Axel Witsel",
"Laurent Abergel",
"Issiaga Camara",
"Djibril Coulibaly",
"Nassim Laarej",
"Xavier Mandza"
],
"ATA": [
"Sofiane Diop",
"Gauthier Hein",
"Isak Jansson",
"Nathan Ngoumou",
"Victor Orakpo",
"Zoumana Diallo"
]
},
"Inter Miami": {
"POR": [
"Dayne St. Clair",
"Rocco Ríos Novo",
"Luis Barraza"
],
"DEF": [
"Gonzalo Luján",
"Sergio Reguilón",
"Maximiliano Falcón",
"Facundo Mura",
"Ian Fray",
"Tyler Hall",
"Israel Boatwright",
"Daniel Sumalla"
],
"MED": [
"Rodrigo De Paul",
"Casemiro",
"Telasco Segovia",
"Yannick Bright",
"David Ayala",
"Santiago Morales",
"Preston Plambeck",
"Alexander Shaw"
],
"ATA": [
"Lionel Messi",
"Luis Suárez",
"Germán Berterame",
"Tadeo Allende",
"Mateo Silvetti",
"Riquelme Fillipi"
]
},
"LAFC": {
"POR": [
"Hugo Lloris",
"Thomas Hasal",
"Cabral Carter"
],
"DEF": [
"Eddie Segura",
"Ryan Porteous",
"Aaron Long",
"Sergi Palencia",
"Ryan Hollingshead",
"Yevhen Cheberko",
"Christian Díaz",
"Kenny Nielsen"
],
"MED": [
"Igor Jesus",
"Mark Delgado",
"Timothy Tillman",
"Mathieu Choinière",
"Ryan Raposo",
"Jude Terry",
"Sergio Vázquez"
],
"ATA": [
"Son Heung-min",
"Jeremy Ebobisse",
"Jacob Shaffelburg",
"Tyler Boyd",
"David Martínez",
"Tommy Mihalić"
]
},
"LA Galaxy": {
"POR": [
"Novak Mićović",
"JT Marcinkowski",
"Brady Scott"
],
"DEF": [
"Maya Yoshida",
"Jakob Glesnes",
"Julián Aude",
"Lucas Calegari",
"Sergi Roberto",
"John Nelson",
"Chris Rindov",
"Carlos Garcés"
],
"MED": [
"Riqui Puig",
"Lucas Sanabria",
"Justin Haak",
"Isaiah Parente",
"Pablo Ruiz",
"Elijah Wynder",
"Erik Thommy"
],
"ATA": [
"Marco Reus",
"Joseph Paintsil",
"Kyōgo Furuhashi",
"João Klauss",
"Robert Taylor",
"Troy Elgersma"
]
},
"Atlanta United": {
"POR": [
"Lucas Hoyos",
"Jayden Hibbert"
],
"DEF": [
"Júnior Alonso",
"Enea Mihaj",
"Paulo Díaz",
"Elías Báez",
"Matthew Edwards",
"Dominik Chong-Qui"
],
"MED": [
"Steven Alzate",
"Tristan Muyumba",
"Mauricio Amaro",
"Ajani Fortune",
"Santiago Pita",
"Adrian Gill",
"Will Reilly",
"Cooper Sanchez"
],
"ATA": [
"Miguel Almirón",
"Breel Embolo",
"Sérgio Santos",
"Fafà Picault",
"Luke Brennan",
"Cayman Togashi"
]
},
"Columbus Crew": {
"POR": [
"Patrick Schulte",
"Nicholas Hagen",
"Evan Bush"
],
"DEF": [
"Rudy Camacho",
"Eric Bailly",
"Andrés Herrera",
"Malte Amundsen",
"Mohamed Farsi",
"Sean Zawadzki",
"Brooks Lennon",
"Cesar Ruvalcaba"
],
"MED": [
"Dylan Chambost",
"Brais Méndez",
"André Gomes",
"Amar Sejdić",
"Sekou Bangoura",
"Tristan Brown",
"Cole Mrowka",
"Tarun Karumanchi"
],
"ATA": [
"Wessam Abou Ali",
"Santiago Rodríguez",
"Jamal Thiaré",
"Taha Habroune",
"Josef Martínez",
"Chase Adams"
]
},
"Seattle Sounders": {
"POR": [
"Stefan Frei",
"Andrew Thomas",
"Max Anchor"
],
"DEF": [
"Jackson Ragen",
"Yeimar Gómez Andrade",
"Kim Kee-hee",
"Alex Roldán",
"Nouhou Tolo",
"Ryan Sailor",
"Stuart Hawkins",
"Antino Lopez"
],
"MED": [
"Cristian Roldan",
"Albert Rusnák",
"Pedro de la Vega",
"Paul Arriola",
"Paul Rothrock",
"Hassani Dotson",
"Kalani Kossa-Rienzi",
"Sebastian Gomez"
],
"ATA": [
"Jordan Morris",
"Jesús Ferreira",
"Dejan Joveljić",
"Danny Musovski",
"Edson Carli"
]
},
"Al Hilal": {
"POR": [
"Mohammed Al-Owais",
"Mohammed Al-Rubaie",
"Rayan Al-Dossary"
],
"DEF": [
"Kalidou Koulibaly",
"Théo Hernandez",
"Yusuf Akçiçek",
"Moteb Al-Harbi",
"Mohammed Mahzari",
"Rayan Al-Ghamdi",
"Saad Al-Mutairi",
"Mishal Al-Dawood"
],
"MED": [
"Rúben Neves",
"Sergej Milinković-Savić",
"Nasser Al-Dawsari",
"Mohamed Kanno",
"Saïmon Bouabré",
"Murad Hawsawi",
"Sultan Mandash",
"Sabri Dahal"
],
"ATA": [
"Ollie Watkins",
"Gabriel Martinelli",
"Salem Al-Dawsari",
"Crysencio Summerville",
"Mohamed Kader Meïté",
"Nawaf Al-Habashi"
]
},
"Al Ahli": {
"POR": [
"Édouard Mendy",
"Abdulrahman Al-Sanbi",
"Abdullah Abdoh"
],
"DEF": [
"Roger Ibañez",
"Merih Demiral",
"Zakaria Hawsawi",
"Saeed Baattiah",
"Mohammed Sulaiman",
"Ali Majrashi",
"Abubacarr Sedi Kinteh",
"Mohammed Abdulrahman"
],
"MED": [
"Valentin Atangana",
"Eduard Spertsyan",
"Matheus Gonçalves",
"Ziyad Al-Johani",
"Faisal Fallatah",
"Meshal Al-Mutairi",
"Ibrahim Azzam",
"Saleh Abu Al-Shamat"
],
"ATA": [
"Ivan Toney",
"Francisco Trincão",
"Galeno",
"Firas Al-Buraikan",
"Abdullah Radif",
"Salem Abdullah"
]
},
"Flamengo": {
"POR": [
"Agustín Rossi",
"Andrew",
"Dyogo Alves"
],
"DEF": [
"Léo Ortiz",
"Léo Pereira",
"Guillermo Varela",
"Alex Sandro",
"Ayrton Lucas",
"Danilo",
"Emerson Royal",
"Vitão"
],
"MED": [
"Giorgian de Arrascaeta",
"Jorginho",
"Erick Pulgar",
"Lucas Paquetá",
"Nicolás de la Cruz",
"Saúl Ñíguez",
"Jorge Carrascal",
"Evertton Araújo"
],
"ATA": [
"Pedro",
"Samuel Lino",
"Bruno Henrique",
"Luiz Araújo",
"Everton",
"Lorran"
]
},
"São Paulo": {
"POR": [
"Rafael",
"Carlos Coronel",
"Felipe Preis"
],
"DEF": [
"Alan Franco",
"Rafael Tolói",
"Sabino",
"Enzo Díaz",
"Wendell",
"Lucas Ramon",
"João Moreira",
"Maik"
],
"MED": [
"Marcos Antônio",
"Damián Bobadilla",
"Pablo Maia",
"Cauly",
"Danielzinho",
"Hugo Leonardo",
"Felipe Negrucci"
],
"ATA": [
"Jonathan Calleri",
"Lucas Moura",
"Luciano",
"Ferreira",
"André Silva",
"Gonzalo Tapia"
]
},
"Grêmio": {
"POR": [
"Weverton",
"Gabriel Grando",
"Thiago Beltrame"
],
"DEF": [
"Walter Kannemann",
"Fabián Balbuena",
"Wagner Leonardo",
"Gustavo Martins",
"Marcos Rocha",
"João Pedro",
"Marlon",
"Pedro Gabriel"
],
"MED": [
"Juan Nardoni",
"Erick Noriega",
"Filip Krovinović",
"Danilo Barbosa",
"Dodi",
"Mathías Villasanti",
"Tiago",
"Riquelme"
],
"ATA": [
"Martin Braithwaite",
"Carlos Vinícius",
"Cristian Pavon",
"Francis Amuzu",
"Tetê",
"José Enamorado"
]
},
"Fluminense": {
"POR": [
"Fábio",
"Marcelo Pitaluga",
"Vitor Eudes"
],
"DEF": [
"Thiago Silva",
"Ignácio",
"Juan Pablo Freytes",
"Samuel Xavier",
"Guilherme Arana",
"Renê",
"Igor Rabello",
"Guga"
],
"MED": [
"Matheus Martinelli",
"Ganso",
"Jefferson Savarino",
"Lucho Acosta",
"Hércules",
"Nonato",
"Otávio",
"Alisson"
],
"ATA": [
"Germán Cano",
"John Kennedy",
"Agustín Canobbio",
"Rodrigo Castillo",
"Hulk",
"Riquelme"
]
},
"Atlético Mineiro": {
"POR": [
"Everson",
"Gabriel Delfim",
"Robert"
],
"DEF": [
"Lyanco",
"Júnior Alonso",
"Iván Román",
"Renan Lodi",
"Natanael",
"Ruan Tressoldi",
"Vitor Hugo",
"Ángelo Preciado"
],
"MED": [
"Gustavo Scarpa",
"Alan Franco",
"Bernard",
"Reinier",
"Igor Gomes",
"Alexsander",
"Maycon",
"Patrick"
],
"ATA": [
"Dudu",
"Mateo Cassierra",
"Tomás Cuello",
"Alan Minda",
"Cauã Soares"
]
},
"Vasco da Gama": {
"POR": [
"Léo Jardim",
"Daniel Fuzato",
"Pablo"
],
"DEF": [
"Puma Rodríguez",
"Lucas Piton",
"Lucas Freitas",
"Alan Saldivia",
"João Vitor",
"Walace Falcão",
"Paulo Henrique",
"Paulinho"
],
"MED": [
"Tchê Tchê",
"Thiago Mendes",
"Santiago Sosa",
"Jair",
"Alan Lescano",
"Ramon Rique",
"Mateus Carvalho",
"Cauan Barros"
],
"ATA": [
"Andrés Gómez",
"Nuno Moreira",
"David",
"Facundo Colidio",
"Marino Hinestroza",
"Bruno Duarte"
]
},
"Bahia": {
"POR": [
"Ronaldo",
"Guido Herrera",
"Léo Vieira"
],
"DEF": [
"Kanu",
"David Duarte",
"Luciano Juba",
"Román Gómez",
"Marcos Victor",
"Zé Guilherme",
"Marco Moreno",
"Luiz Gustavo"
],
"MED": [
"Éverton Ribeiro",
"Jean Lucas",
"Caio Alexandre",
"Rodrigo Nestor",
"Nicolás Acevedo",
"Michel Araújo",
"Erick",
"David Martins"
],
"ATA": [
"Willian José",
"Ademir",
"Erick Pulga",
"Alejo Véliz",
"Mateo Sanabria",
"Kauê Furquim"
]
}
};
