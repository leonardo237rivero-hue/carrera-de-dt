# Carrera de DT — Bitácora del proyecto

Todo lo que aportaste y todo lo que se implementó, de principio a fin.

---

# PARTE 1 — TUS APORTES

## 1.1 El punto de partida

- Pediste un estudio de mercado de los minijuegos de fútbol recientes y qué está pidiendo el público.
- Señalaste **Copero** (argentino, HTML, armás tu carrera con decisiones de club) y el juego brasileño de armar planteles con leyendas, que resultó ser **7a0 / Sete a Zero** (lo habías llamado "7 a 1").
- Identificaste vos mismo el patrón común: **el componente de azar es lo que los hace llamativos**.
- Definiste el objetivo: llenar un portafolio de fútbol con varios juegos.

## 1.2 La decisión de fondo

- Separaste los dos proyectos: el **juego táctico pesado** (salida limpia, bloque bajo, circuitos, tercer hombre) queda aparte en Unreal, y este es el **juego liviano de decisiones de entrenador**, como puerta de entrada.
- Confirmaste que el juego que estamos haciendo es **de táctica, para entrenadores**.

## 1.3 Diseño del núcleo

- Elegiste el **Formato B**: duelo asincrónico con código compartido, no en vivo.
- Agregaste que el duelo se resuelve por **score y nota**, no por ganar o perder.
- Definiste el tono: **realista, con pormenores de la vida real**. Diste el ejemplo del jugador que salió la noche anterior y te dice que está para jugar.
- Elegiste el **pool curado a mano** por sobre el generado por reglas.
- Pediste cubrir las cinco áreas: vestuario, táctica, directiva, prensa y mercado, con nombres genéricos y arquetipos mezclados.

## 1.4 El sistema táctico

Este fue tu aporte más específico, viniendo de tu formación como entrenador:

- Planteaste que **no importa el promedio general sino cómo se reparte y contra qué formación se juega**.
- Diste el ejemplo exacto: 90 en defensa y 50 en ataque con un 5-3-2 juega distinto que con un 4-3-3.
- Señalaste que un modelo de posesión en un 6-2-2 no genera triángulos y baja las chances.
- Pediste la tabla de multiplicadores y la matriz de qué sistema le gana a cuál.
- **Sobre el azar**: insististe en que tiene que pesar pero no dar vuelta una brecha grande de conocimiento. Tu frase: *"que potencie, que ayude, pero si hay un conocimiento del fútbol tan dispar, que el componente de Alea no le gane a lo demás fácilmente"*.

## 1.5 Mecánicas que propusiste

- **Mercado de pases con piqueo**: dos DT mirando la misma lista, el primero que se tira se lo lleva.
- **Economía**: presupuesto que limita, no sólo reflejos.
- **Sobres tipo FIFA** y después la corrección a **ruleta con fichas**.
- **Crecimiento del club**: estadio, fichaje estrella, cómo crece con los años.
- **Ayudar al ex club**: comprarle un jugador caro para dejarle plata.
- **Histórico** de la carrera.

## 1.6 Primera ronda de feedback sobre el prototipo

- Demasiado bloque de texto, nada visual.
- Los renglones no coincidían con el texto (era un bug real del fondo rayado).
- **No hay que explicarle al jugador cómo se puntúa.** "El jugador no tiene por qué saber y leer cómo se puntúa. Al final, sí."
- El sistema y el modelo de juego se tienen que definir **al principio**, no por temporada.
- Faltaba el **mercado de entrenadores**.
- Faltaban **nombres reales y escudos**.
- **La idea de Peñarol**: si elegís un club grande no entrás a primera, entrás por séptima, quinta, sub-19.
- No quedaba claro qué club habías elegido ni en qué influía el arquetipo.
- El mercado era demasiado rápido.
- **El reclamo central**: "no entiendo bien qué voy a reforzar porque no conozco el plantel". Pediste ver el plantel, el sistema armado en la canchita y el puntaje de cada jugador.
- Señalaste que "Plantel 59" era la relación con el plantel, no el poder del plantel.
- El sobre tenía que ser una ruleta con fichas.
- Del rival faltaba saber más que su sistema: sus puntos fuertes.
- Pediste mostrar **gráficamente** cómo se para tu sistema sobre el del rival.

## 1.7 Segunda ronda

- Los nombres eran uruguayos incluso jugando en Tottenham o en Brasil.
- Preguntaste si se podía hacer **drag and drop** de la alineación.
- Pediste **sacar al arquero** de la cuenta de sectores.
- **"Gané el partido y me dice subcampeón"**: faltaba el contexto de la temporada.

## 1.8 Tercera ronda, con captura

- Moviste los mediocampistas hacia adentro y el sector seguía diciendo 3v2.
- **"El drag and drop no funciona bien"** — era un bug real y grave.

## 1.9 Cuarta ronda

- Escudos reales o una carpeta preparada.
- **La ruleta estaba mal ponderada**: un crack no puede tener la misma probabilidad que un común.
- Los nombres de la ruleta no se leían.
- Poder **aceptar o rechazar** al jugador que sale.
- La opción "rotar a los mayores de 30" **no aplica en formativas**.
- Barras visuales para las cuatro variables, no sólo números.
- **"¿Cómo sé si salió el mediocampista crack que saqué?"**
- La resolución no era lo suficientemente visual.
- **Los suplentes no servían para nada**, no se podían subir.
- No quedaba claro quién ganó, faltaban escudos y copas.
- **La selección te llamó siendo subcampeón con Progreso** — estaba mal calibrado.
- El defensa crack no reemplazaba al peor. Era un bug.
- **"No me vino a buscar ningún club y me fue bastante bien."**
- Faltaban íconos de copas.
- Y la pregunta más importante de todo el proyecto: **"¿cómo le indico al jugador por qué un 4-2-3-1 le gana a un 4-4-2, sin darle la papa cocinada?"**

## 1.10 Las ideas para la siguiente versión

- **La pregunta del ídolo**: llegás a Flamengo y te preguntan por Zico. Poder quedar como un ignorante, responder bien, provocar o adular.
- **La reputación acumulada**: si sos muy bilardista y dejás de ganar, la prensa te lo cobra. Tu ejemplo textual: *"¿Vas a salir a jugar o te vas a seguir tirando atrás esperando que salga una estrella a salvarte?"*
- **La política con la prensa**: hacerte amigo o bajar la persiana como Bielsa, con ventajas y costos en los dos extremos.
- **Streams y polémicas**: bancártela en vivo o quedarte al margen.
- **Ídolos y ex dirigentes criticándote** por intereses personales.
- **Persuasión en el mercado**: cada jugador valora algo distinto, no sólo la plata.
- **Juveniles agrandados** y **jugadores que te hacen la cama**.
- **Decisiones tácticas dentro del partido**: el lateral desbordado, perdiendo 2-0, donde resolver el problema defensivo no es lo mejor para el partido.
- **Mapas de calor** y ayudas visuales.
- **La animación de la tabla jornada a jornada**, para generar expectativa.
- **Récords de entrenadores** para romper.
- Y la mejor de todas: **el azar disfrazado de genialidad**. El cambio en el minuto 87 y el gol de córner, con la prensa diciendo que la viste antes que nadie cuando vos sabés que no.

## 1.11 El feedback de tus dos amigos, que trajiste

**Amigo 1:** está muy fácil · dos modos de duración · las decisiones tienen respuesta obvia · relacionarlas con el tipo de DT · entrenamientos específicos.

**Amigo 2:** pasar a Claude Code y GitHub · portada con mucho texto · cartas bloqueadas sin explicación · no se ve el plantel al fichar · ruleta con probabilidad muy baja · nombres de puesto inconsistentes · once visual estilo FIFA · afinidad de plantilla · falta un tablero general · feedback táctico insuficiente y probabilidad de ganar.

## 1.12 Tus decisiones de rumbo

- Ir a GitHub y Claude Code.
- Hacer el multi-idioma, traduciendo todo primero y puliendo el léxico después.
- Y la instrucción final: *"no me preguntes qué hacer, andá, hacé todo y después decime"*.

---

# PARTE 2 — CAMBIOS IMPLEMENTADOS

## Documentos y análisis

| Entregable | Qué contiene |
|---|---|
| Análisis de mercado | Copero, 7a0 y El Ídolo comparados; qué pide el público; el hueco que ocupás |
| GDD v1 → v5 | Documento de diseño, actualizado en cada iteración |
| Excel del sistema táctico | Capa A1, Capa A2, Capa B, fórmula y test de balance, con control automático de antisimetría |
| Excel del pool de decisiones | 60 situaciones, 177 opciones, control de balance por eje |
| Backlog priorizado | Consolidación de tus ideas más los dos playtests, en tiers |
| Instructivo | Cómo se juega y cómo se modifica |
| Bitácora | Este documento |

**El hallazgo del análisis**: existe un tercer competidor que no conocías, **El Ídolo** (Potrero, argentino), con rival permanente de carrera, modo memoria y multi-idioma.

## Prototipo v1

- Motor de tres capas con los números exactos del Excel.
- 60 decisiones, mercado con piqueo, sobre, planteo y resolución.
- Semilla determinística para el duelo.

## Reconstrucción v2

- **Los atributos pasan a salir de los once que entran**, no de números abstractos. Fue el cambio de fondo.
- Cada club con perfil de plantel: fuerte en una línea, flojo en otra.
- Plantel visible en canchita con nivel y nombre de cada jugador.
- El mercado muestra qué te cambia cada fichaje: "Defensa 61 → 68".
- Ruleta con fichas en lugar del sobre.
- El rival se muestra con su once, sus barras y su punto flojo.
- Comparación de hombres por zona.
- Orden nuevo: identidad del DT primero, después mercado de entrenadores.
- **Ladder de formativas**: club grande entra por séptima.
- "Plantel" pasa a llamarse "Vestuario".
- Explicación del ±8 sacada de la portada.
- Crecimiento del club y favor al ex club.
- Arreglado el fondo rayado desalineado.

## Versión 3

- Diez ligas con clubes reales, competencias por país y copas continentales.
- Edades y niveles reales por categoría formativa.
- **Subir hasta dos juveniles** al ascender de categoría.
- Ascenso más rápido: campeón sube dos categorías.
- Ruleta ponderada por puesto.
- Mercado de 9 a 15 segundos.
- Selecciones nacionales.
- **La pizarra única** con los dos equipos enfrentados.
- Nombres de jugadores por país, diez pools.
- Drag and drop de jugadores.
- Tabla de posiciones completa tras cada temporada, y rondas en las copas.
- Arquero fuera de la cuenta de sectores.

## Versión 3.1 — bugs de la captura

- **El drag and drop estaba roto**: cada movimiento redibujaba la pizarra y destruía el elemento arrastrado. Ahora no se redibuja durante el gesto.
- La pizarra tenía los arqueros en el medio y los delanteros en su propio arco: estaba invertida.
- Rival con círculo hueco y nombre arriba, propio lleno y nombre abajo, para que no se pisen.
- **Grilla de nueve sectores** con los números al centro.

## Versión 4 — tandas 3, 4 y 5

- **El perfil de DT cambia lo que cuesta cada decisión.**
- **Reputación acumulada** con seis etiquetas y siete situaciones de prensa exclusivas.
- **Ídolos de 27 clubes** con cinco respuestas posibles.
- **Política con la prensa**: tres posturas con efectos reales.
- **Persuasión en el mercado** con pista y un solo intento.
- **El azar disfrazado de genialidad**, con titular y verdad.
- **Once visual** con banco lateral y reemplazo por clic.
- Seis **récords históricos**.
- Tres **modos de duración**.
- **Animación del recorrido** de la temporada.
- **Dificultad recalibrada**: de 5 títulos por carrera a 1,09.
- Crack de ruleta calculado contra tu propio plantel.
- Cartas bloqueadas con explicación.
- Ruleta por zonas: de 20% a 37,5% de acertar.
- Panel de plantel en mercado y ruleta.
- Nomenclatura de puestos unificada.
- Filtro de opciones por contexto.
- Barras visuales en la cabecera.
- Selección nacional con requisitos reales.
- Ofertas de clubes entre temporadas, con la opción de volver al club del que sos hincha.

## Versión 4.1 y 4.2

- **Bug del duelo**: las ofertas de club se generaban antes de sembrar la semilla.
- 14 situaciones propias de formativas.
- Eje Vestuario de +45 a +13.
- Etiquetas para todos.
- **Comparación de duelo**: pegás el resultado del otro y los compara cara a cara.
- **Tablero del ciclo** con alertas.

## Versión 5 — tres idiomas

- 100 claves de interfaz, 81 situaciones, 27 ídolos, y todos los datos del juego en español, portugués e inglés.
- Selector en portada, memoria entre partidas y detección del navegador.
- **Al firmar con un club de otro país, el juego ofrece cambiar de idioma.**
- Localización real: categorías formativas por país, Libertadores vs Europa según idioma, vocabulario propio de cada fútbol, y "bilardista" resuelto como "resultadista raiz" y "a pragmatist".

## Infraestructura

- Repositorio dividido en 13 módulos.
- Ocho commits con historial.
- Simulador headless para verificar balance sin jugar.
- Carpeta de escudos con manifiesto de 98 archivos y fallback automático.
- Publicado en GitHub Pages.

---

# PARTE 3 — DONDE TE LLEVÉ LA CONTRA

Cinco veces te propuse algo distinto de lo que pedías, y vale la pena que queden anotadas:

**Probabilidad de ganar, empatar y perder.** Es el pedido que más razonable suena y el más peligroso. Si el jugador ve "68% con 4-3-3", deja de leer la cancha y elige el número más alto. La alternativa fue mostrar la consecuencia, no la predicción.

**Entrenamientos de pase corto y centros.** Coincidimos en no hacerlo: agrega un segundo sistema de progresión que compite con el núcleo.

**Afinidad de plantilla.** Como estaba planteada castigaba adaptarse al rival, que es la habilidad que el juego quiere premiar. La versión sana es afinidad por jugador, que ya existe como "fuera de posición".

**La opción provocadora sobre el ídolo.** Tu ejemplo sobre Zico incluía algo de su vida privada. Sobre una persona real es difamación, no humor. "Está sobrevalorado por la nostalgia" quema igual con la hinchada sin riesgo legal.

**Las decisiones tácticas dentro del partido.** Es la idea más ambiciosa de todas y la que más se pisa con el simulador de Unreal. Sigue siendo el único punto del backlog sin implementar, y creo que va allá.

---

# PARTE 4 — LO QUE QUEDA

- **Decisiones tácticas dentro del partido** (o dejarlas para el juego de Unreal).
- **Pulir el registro** del portugués y el inglés con alguien de cada país.
- **Reescribir los textos en español con tu voz**, que es trabajo tuyo.
- **Escudos oficiales**, si decidís asumir el riesgo de licencia.
- **Ranking global**, que necesita un backend mínimo.
