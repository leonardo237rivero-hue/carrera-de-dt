// Carrera de DT — motor táctico: las tres capas del Excel
// Ver docs/INSTRUCTIVO.md

/* ==========================================================
   MOTOR — capas del Excel, sin cambios
   ========================================================== */
const FORMACIONES=["4-3-3","4-2-3-1","4-4-2","3-5-2 / 5-3-2","3-4-3"];
const ESTILOS=["Posesion","Contraataque / Directo","Presion alta","Bloque bajo / Repliegue"];
const ESTILO_LBL={"Posesion":"Posesión","Contraataque / Directo":"Contraataque","Presion alta":"Presión alta","Bloque bajo / Repliegue":"Bloque bajo"};
const PESOS={"4-3-3":[1.10,1.30,0.90,1.05],"4-2-3-1":[1.05,1.20,1.05,1.00],"4-4-2":[1.15,0.85,1.10,1.05],"3-5-2 / 5-3-2":[0.85,1.05,1.25,0.90],"3-4-3":[1.30,1.10,0.75,1.15]};
const FIT={"Posesion":{"4-3-3":1.12,"4-2-3-1":1.12,"4-4-2":0.86,"3-5-2 / 5-3-2":1.06,"3-4-3":1.00},
"Contraataque / Directo":{"4-3-3":1.00,"4-2-3-1":1.00,"4-4-2":1.12,"3-5-2 / 5-3-2":0.94,"3-4-3":1.12},
"Presion alta":{"4-3-3":1.12,"4-2-3-1":1.12,"4-4-2":1.00,"3-5-2 / 5-3-2":0.86,"3-4-3":1.06},
"Bloque bajo / Repliegue":{"4-3-3":0.86,"4-2-3-1":1.00,"4-4-2":1.12,"3-5-2 / 5-3-2":1.12,"3-4-3":0.86}};
const FIT_LBL={1.12:"Ideal",1.06:"Bueno",1.00:"Neutro",0.94:"Forzado",0.86:"Contradictorio"};
// por qué un modelo funciona o no en una forma: la mecánica, no la nota
const PORQUE_FIT={
 "Posesion":{"4-3-3":"El trío de volantes arma triángulos permanentes: siempre hay dos opciones de pase corto.",
  "4-2-3-1":"El enganche baja entre líneas y con los dos pivotes te da tres puntos de apoyo en el centro.",
  "4-4-2":"Dos líneas planas de cuatro no forman triángulos: el que tiene la pelota queda con pases laterales y nada por dentro.",
  "3-5-2 / 5-3-2":"Cinco en el medio te dan la pelota, pero los carrileros tardan en llegar y la circulación se vuelve lenta.",
  "3-4-3":"Tenés gente para tocar, pero con tres atrás no te podés permitir perderla en salida."},
 "Contraataque / Directo":{"4-3-3":"Robás y tenés que recorrer mucho campo con el nueve solo contra los centrales.",
  "4-2-3-1":"Un solo punta arriba: la transición depende de que lleguen los tres de atrás.",
  "4-4-2":"Bloque junto y dos puntas fijas: robás y ya tenés a quién buscar de primera.",
  "3-5-2 / 5-3-2":"Recuperás bien, pero desde tan atrás el contraataque llega con poca gente.",
  "3-4-3":"Tres arriba esperando la transición: robás y salís en superioridad."},
 "Presion alta":{"4-3-3":"El tridente le tapa la salida a los dos centrales y al arquero al mismo tiempo.",
  "4-2-3-1":"El enganche y los extremos presionan la primera línea mientras los pivotes tapan el pase interior.",
  "4-4-2":"Se puede, pero las dos líneas de cuatro tienen que subir juntas y eso desgasta muchísimo.",
  "3-5-2 / 5-3-2":"La estructura está pensada para replegar: si adelantás el bloque, los carrileros quedan a contramano.",
  "3-4-3":"Mucha gente adelantada para presionar, con el riesgo de que te dejen mano a mano a los tres de atrás."},
 "Bloque bajo / Repliegue":{"4-3-3":"Replegado, el nueve queda aislado y no tenés a quién darle cuando recuperás.",
  "4-2-3-1":"Aguanta, pero el enganche replegado deja de servir para lo que está.",
  "4-4-2":"Dos líneas de cuatro juntas: es la estructura más difícil de penetrar que existe.",
  "3-5-2 / 5-3-2":"El central de sobra da cobertura permanente y cierra el área con cinco.",
  "3-4-3":"Con tres atrás replegar es sufrir: te sobran hombres arriba y te faltan en el área."}
};
const MATCHUP={"4-3-3":{"4-3-3":1.00,"4-2-3-1":1.00,"4-4-2":1.06,"3-5-2 / 5-3-2":1.04,"3-4-3":0.95},
"4-2-3-1":{"4-3-3":1.00,"4-2-3-1":1.00,"4-4-2":1.05,"3-5-2 / 5-3-2":0.97,"3-4-3":1.03},
"4-4-2":{"4-3-3":0.94,"4-2-3-1":0.95,"4-4-2":1.00,"3-5-2 / 5-3-2":0.96,"3-4-3":1.05},
"3-5-2 / 5-3-2":{"4-3-3":0.96,"4-2-3-1":1.03,"4-4-2":1.04,"3-5-2 / 5-3-2":1.00,"3-4-3":1.06},
"3-4-3":{"4-3-3":1.05,"4-2-3-1":0.97,"4-4-2":0.95,"3-5-2 / 5-3-2":0.94,"3-4-3":1.00}};
const TOPE_AZAR=8, ATRIBUTOS=["Ataque","Creación","Defensa","Presión"], TEMPORADAS=6;

/* ==========================================================
   ONCE POR SISTEMA — cada slot tiene rol, coordenadas y aporte
   ========================================================== */
// aporte: [ataque, creacion, defensa, presion]
const ROL={
  POR:{g:"POR",a:[0,0,1,0],n:"Arquero"},
  DFC:{g:"DEF",a:[0,.05,.9,.05],n:"Central"},
  LTD:{g:"DEF",a:[.05,.1,.6,.25],n:"Lateral der."},
  LTI:{g:"DEF",a:[.05,.1,.6,.25],n:"Lateral izq."},
  MCD:{g:"MED",a:[0,.3,.45,.25],n:"Volante de marca"},
  MC:{g:"MED",a:[.05,.5,.1,.35],n:"Mediocentro"},
  MCO:{g:"MED",a:[.25,.7,0,.05],n:"Enganche"},
  MD:{g:"MED",a:[.3,.2,.05,.45],n:"Volante der."},
  MI:{g:"MED",a:[.3,.2,.05,.45],n:"Volante izq."},
  CAD:{g:"MED",a:[.2,.15,.2,.45],n:"Carrilero der."},
  CAI:{g:"MED",a:[.2,.15,.2,.45],n:"Carrilero izq."},
  EXD:{g:"ATA",a:[.6,.3,0,.1],n:"Extremo der."},
  EXI:{g:"ATA",a:[.6,.3,0,.1],n:"Extremo izq."},
  DC:{g:"ATA",a:[.9,.1,0,0],n:"Delantero"}
};
const ONCE={
 "4-3-3":[["POR",50,7],["LTI",13,26],["DFC",36,18],["DFC",64,18],["LTD",87,26],
          ["MC",50,44],["MI",29,50],["MD",71,50],["EXI",14,74],["DC",50,84],["EXD",86,74]],
 "4-2-3-1":[["POR",50,7],["LTI",13,26],["DFC",36,18],["DFC",64,18],["LTD",87,26],
          ["MCD",38,39],["MCD",62,39],["MI",19,60],["MCO",50,62],["MD",81,60],["DC",50,84]],
 "4-4-2":[["POR",50,7],["LTI",13,26],["DFC",36,18],["DFC",64,18],["LTD",87,26],
          ["MI",14,50],["MC",38,47],["MC",62,47],["MD",86,50],["DC",40,82],["DC",60,82]],
 "3-5-2 / 5-3-2":[["POR",50,7],["DFC",28,18],["DFC",50,15],["DFC",72,18],
          ["CAI",11,46],["MC",36,44],["MC",50,39],["MC",64,44],["CAD",89,46],["DC",40,82],["DC",60,82]],
 "3-4-3":[["POR",50,7],["DFC",28,18],["DFC",50,15],["DFC",72,18],
          ["MI",14,46],["MC",39,43],["MC",61,43],["MD",86,46],["EXI",17,76],["DC",50,84],["EXD",83,76]]
};
// jugadores por zona, para la comparativa visual del matchup
const ZONAS={"4-3-3":[4,3,3],"4-2-3-1":[4,5,1],"4-4-2":[4,4,2],"3-5-2 / 5-3-2":[3,5,2],"3-4-3":[3,4,3]};
