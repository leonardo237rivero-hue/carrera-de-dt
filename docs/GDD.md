# Carrera de DT — Game Design Document

**Versión:** 3.0 (prototipo jugable)
**Estado:** prototipo HTML funcional, balanceado y verificado por simulación

---

## 1. Pitch

Dirigís un club durante seis temporadas. Peleás el mercado contra otro DT que mira la misma lista, cerrás el vestuario como puedas, y sobre todo elegís **cómo parar al equipo contra el sistema del rival**. El juego no te premia por tener el mejor plantel: te premia por entender el que tenés.

**Género:** simulador narrativo de carrera con núcleo táctico.
**Plataforma:** navegador (HTML5, un solo archivo), mobile-first, sin cuenta ni descarga.
**Duración de una partida:** 6 a 10 minutos.
**Público:** hinchas de fútbol de 16 a 40 años; el que ya jugó Copero, 7a0 o El Ídolo y quiere la versión del banco de suplentes.

---

## 2. Análisis de mercado

### 2.1 Competencia directa

| | **Copero** (ARG) | **7a0 / Sete a Zero** (BRA) | **El Ídolo** (ARG, Potrero) |
|---|---|---|---|
| Rol del jugador | Futbolista | Seleccionador de fantasía | Futbolista |
| Mecánica central | Draft de un atributo por leyenda, luego simula la carrera | Draft aleatorio de históricos por país y año, simula un Mundial | Decisiones narrativas por clics |
| Rol del azar | Eventos de carrera, edad, fuerza de liga | Qué selección y año te toca | Situaciones inesperadas |
| Diferenciador | El draft con sacrificio | Trivia de ratings ocultos; nostalgia mundialista | Rival permanente de carrera; modo memoria; multi-idioma |
| Multijugador | No | Pantalla compartida y salas privadas | Ranking global |
| Final | Veredicto narrativo compartible | Plantel armado | Comparación con una figura histórica |

### 2.2 Qué está pidiendo el público

1. **Partidas de minutos.** El rechazo explícito es al manager tradicional (Football Manager, Soccer Manager): menús, sliders, horas.
2. **Decisiones con consecuencia, no simulación de partido.** Ninguno de los tres te hace jugar los 90 minutos.
3. **Azar que genere anécdota, no frustración.** El azar entra en los eventos, no en si jugaste bien.
4. **Un final diseñado para compartir.** La viralidad de los tres viene de capturas de pantalla, no de marketing pago.
5. **Rejugabilidad barata.** Partida corta y variable, "una más" inmediato.
6. **Localización.** El Ídolo escaló a Brasil sumando portugués.
7. **Competitividad liviana:** rival permanente o ranking, sin PvP real.

### 2.3 El hueco que ocupamos

Los tres virales te ponen como **jugador**. Ninguno te pone como **entrenador tomando decisiones de gestión y de pizarrón** con esta fórmula ágil. El terreno del DT sigue ocupado sólo por simuladores pesados y de pago.

**El diferenciador dentro del diferenciador:** profundidad táctica real, viniendo de un entrenador de verdad, presentada de forma visual y no numérica.

---

## 3. Pilares de diseño

1. **Decisión con sacrificio.** Cada elección cierra una puerta. Nunca mejorás todo.
2. **La táctica se ve, no se explica.** El jugador no lee "ideal" ni "correcto": ve cuántos hombres pone cada uno en cada sector y saca la conclusión solo.
3. **El plantel es concreto.** Los atributos no son números inventados: salen de los once que efectivamente entran.
4. **El azar está acotado y es honesto.** Tope duro de ±8 puntos. Nunca da vuelta una diferencia grande de lectura.
5. **Cero fricción.** Sin cuenta, sin pagos, sin timers de energía.
6. **El fútbol es real.** Clubes, ligas, competencias, categorías formativas y nombres de jugadores coherentes con cada país.

---

## 4. Core loop

```
IDENTIDAD DEL DT  →  MERCADO DE ENTRENADORES  →
   ┌─ por temporada (x6) ────────────────────────────────┐
   │  Plantel  →  Mercado de pases (piqueo)  →  Ruleta   │
   │  →  2 decisiones  →  Planteo  →  Resolución         │
   │  →  Cierre (ascenso / ofertas / despido)            │
   └─────────────────────────────────────────────────────┘
→  TARJETA FINAL (nota, apodo, títulos, trayectoria)
```

### 4.1 Identidad del DT

Se define **antes** de tener club:

- **Nombre.**
- **Perfil** (uno de tres arquetipos).
- **Sistema de cabecera.** Usarlo da ×1.03; usar otro da ×0.98.
- **Modelo de juego de cabecera.** Usarlo da ×1.02; usar otro da ×0.99.

No obliga: define. Podés traicionar tu idea y el juego te cobra un poco.

#### Arquetipos

| Arquetipo | Ventajas | Costo |
|---|---|---|
| **El Formador** | Juveniles suben +4 por temporada · Vestuario inicial 66 · la ruleta trae juveniles con más techo | −12 de presupuesto inicial |
| **El Ganador** | +18 de presupuesto · tu mejor delantero arranca +8 | Te echan si la Directiva baja de **26** |
| **El Bombero** | Toda la defensa arranca +7 · te echan recién en **12** de Directiva | Hinchada −6 de arranque |

Para el resto, el umbral de despido es 18.

### 4.2 Mercado de entrenadores

Tres ofertas, generadas según nivel de club:

- **Club grande** (nivel 5): entrás por **Séptima**. Techo altísimo, camino largo.
- **Club medio** (nivel 3-4): Primera de entrada.
- **Club chico** (nivel 1-2): Primera, poca plata, poca exigencia.

Ese es el sacrificio de arranque: Peñarol te da el sueño, pero empezás dirigiendo a los pibes.

### 4.3 Categorías

| Categoría | Edades | Modificador de nivel | Competencia |
|---|---|---|---|
| Séptima | 14-16 | −26 | Campeonato local Sub-16 |
| Quinta | 16-18 | −18 | Campeonato local Sub-18 |
| Sub-19 | 17-20 | −10 | Campeonato local Sub-19 |
| Primera | 19-34 | 0 | Liga nacional o copa continental |

Nivel base del plantel: `36 + nivelDelClub × 7 + modificadorDeCategoría`.

**Ascenso:** Campeón sube **dos** categorías (tres si gana por paliza, diferencia ≥22). Subcampeón sube una. Al ascender elegís **hasta dos juveniles** para llevarte al plantel superior; suben con +3 de nivel.

### 4.4 Plantel

- 16 jugadores: 2 arqueros, 5 defensas, 6 mediocampistas, 3 atacantes.
- Cada club tiene un **perfil de plantel**: fuerte en una línea, flojo en otra. Eso es lo que hace que elegir sistema importe.
- Dentro de cada puesto hay escalones: el titular es mejor que el suplente.
- **Nombres coherentes con el país.** Diez pools: Uruguay, Argentina, Brasil, España, Inglaterra, Italia, Alemania, Francia, Estados Unidos, Arabia Saudita.
- Podés **poner de titular** a cualquier suplente; queda fijo hasta que lo sueltes (máximo cinco fijos).
- Si el sistema pide un puesto que no tenés, alguien juega **fuera de posición** y pierde 10 puntos. Sale marcado en ámbar.

### 4.5 Mercado de pases (el piqueo)

- Tres jugadores en la mesa, visibles para vos y para otro DT.
- **Ventana de 15 segundos.** El rival se tira sobre cada carta entre los 6 y los 14 segundos.
- Cada carta muestra **qué te cambia**: "Defensa 61 → 68 con tu sistema actual". Si no entra al once, te lo dice.
- El costo escala con el nivel de la categoría, así que en formativas te alcanza.
- **En selección no se ficha: se convoca** (costo cero).

Reflejo más economía: podés ser rápido, pero si no te alcanza la plata no la agarrás.

### 4.6 Ruleta del club

Un jugador gratis por temporada.

- **21 casillas.** Cada puesto común ocupa **dos**; cada crack, **una**. Pedir un crack cae la mitad de veces que pedir un común: 4,8% contra 9,5%.
- Puestos: Arquero, Zaguero, Lateral, Volante de marca, Mediocentro, Mediapunta, Extremo, Delantero. Los cinco principales tienen versión crack.
- Ponés **dos fichas** antes de girar; cada ficha muestra el porcentaje real.
- Si la bocha para en una ficha tuya, el jugador sale bastante mejor.
- **El nivel del crack se mide contra tu propio plantel**, no contra el promedio de la liga: un crack siempre supera a tu titular de ese puesto.
- **Podés rechazarlo.** Si pasás, te llevás +5 de presupuesto.

### 4.7 Decisiones

Dos por temporada, de un pool de **60 situaciones curadas a mano**:

| Categoría | Situaciones |
|---|---|
| Vestuario | 14 |
| Táctica | 12 |
| Directiva | 12 |
| Prensa | 11 |
| Mercado | 11 |

Cada opción mueve cuatro variables (Resultados, Directiva, Hinchada, Vestuario) en escala −3 a +3, multiplicada por 3,2.

**Filtro por contexto:** en formativas no aparecen opciones sobre mayores de 30, ventas ni sueldos; en selección desaparecen las de mercado. Las situaciones de categoría Táctica además mueven el nivel de los jugadores del once.

### 4.8 Planteo — el corazón del juego

Una sola pizarra con los dos equipos enfrentados:

- **Rival:** círculo hueco de borde rojo, nombre arriba, sistema y modelo fijos.
- **Vos:** círculo verde lleno, nombre abajo.
- Cada equipo ocupa el 86% del largo de la cancha, así que tus delanteros quedan efectivamente sobre sus zagueros.

**Grilla de nueve sectores.** Cada sector muestra *los tuyos contra los de ellos* (los arqueros no cuentan). Verde donde te sobra gente, rojo donde te falta.

**Drag and drop.** Arrastrás cualquier jugador tuyo y los sectores se recalculan en vivo. Tope de movimiento: ±30% a lo ancho, ±24% a lo largo — podés matizar el sistema, no reinventarlo. El jugador movido queda con borde ámbar.

**Ajuste posicional:** sectores ganados menos perdidos, acotado entre ×0,97 y ×1,03. Nunca desbalancea la fórmula.

El diseño produce un **trade-off real**: cerrar los volantes por dentro lleva el pasillo central de 2v1 a 4v1, pero deja las bandas en 0v2, y el multiplicador queda en ×1.000. Para sacar ventaja neta hay que leer dónde el rival dejó el hueco, no amontonar gente.

**Texto de lectura**, en lenguaje de entrenador, recalculado al arrastrar:
*"Por el pasillo central quedan 4 contra 1, y por las dos bandas 0 contra 4: les ganás por dentro pero les regalás los costados."*

### 4.9 Resolución

```
Nivel del once con tu sistema (base ponderada)
  × fit del modelo con el sistema            (Capa A2)
  × cruce contra la formación rival          (Capa B)
  × sistema y modelo de cabecera + ajuste posicional
  × cohesión del vestuario                   (0,90 a 1,10)
  + empuje de la tribuna                     (±3)
  + azar                                     (tope ±8)
= tu puntaje
```

Se resuelve lo mismo para el rival y se compara.

| Diferencia | Cierre | Puntos |
|---|---|---|
| ≥ +12 | Campeón | 10 |
| ≥ +5 | Subcampeón | 7 |
| ≥ −2 | Mitad de tabla | 4 |
| ≥ −10 | Zona baja | 1 |
| < −10 | Pelea el descenso | 0 |

**Contexto obligatorio.** Debajo del partido aparece la **tabla completa** de la liga con escudos, tu fila resaltada y los puntos de las fechas. En copa, en vez de tabla se muestra la ronda: Campeón, Finalista, Semifinales, Cuartos, o afuera en fase de grupos.

El detalle del cálculo va en un desplegable, no en la cara del jugador.

### 4.10 Cierre de temporada

En orden:

1. Envejecimiento del plantel; los mayores de 31 pierden nivel. Los juveniles del Formador suben +4.
2. Ascenso de categoría, con pantalla de subir juveniles.
3. Crecimiento del club: el estadio sube de nivel si la hinchada está alta y ganaste. Entra presupuesto por resultados, estadio y categoría.
4. **Despido** si la Directiva cae bajo el umbral: te agarra un club chico en Primera, con menos plantel y menos plata.
5. **Ofertas de otros clubes** si te fue bien, incluida la opción de volver al club del que sos hincha.
6. **Oferta de selección:** sólo con dos títulos ganados, club de nivel 4 o más, y desde la cuarta temporada.
7. **Favor al ex club:** comprarle un jugador caro para ayudarlo económicamente.

### 4.11 Final

- **Score** = 70% puntos de carrera + 30% promedio de las cuatro variables.
- **Nota:** S (≥88), A (≥74), B (≥58), C (≥42), D.
- **Apodo** según el eje dominante de tus decisiones, más un sufijo: El Resultadista, El Político, El Ídolo de la Tribuna, El Padre del Grupo; Dogmático (un solo sistema), Camaleón (cuatro o más), Trotamundos (te echaron), Ganador Serial.
- **Títulos con ícono de copa** y nombre de la competencia.
- **Trayectoria completa** en tabla.
- Botón de copiar resultado.

---

## 5. Modo duelo (Formato B, asincrónico)

Decidido: **asincrónico con código compartido**, no en vivo.

- Cada carrera tiene un código. Quien juegue con el mismo código recibe **idénticas** situaciones, cartas, ruletas, rivales y tiradas de azar.
- Lo único que cambia es lo que cada uno decide.
- Gana el que saca **mejor score**; la nota es el destacado.
- No requiere backend de tiempo real ni matchmaking.

El motor ya soporta la semilla determinística (verificado: mismo código, mismas condiciones, siempre). Falta la interfaz de sala.

---

## 6. Contenido implementado

**Ligas y clubes reales** (nombres): Uruguay 14, Argentina 14, Brasil 12, España 8, Inglaterra 8, Italia 8, Alemania 6, Francia 6, MLS 6, Arabia Saudita 6. Más 10 selecciones nacionales.

**Competencias:** campeonatos locales, Apertura, Clausura, Tabla Anual, Copa Libertadores, Champions League, Concachampions, Champions de Asia, Eliminatorias, Copa América, Copa del Mundo.

**Escudos:** generados con los colores reales de cada club, con soporte para reemplazarlos por los oficiales sin tocar código.

---

## 7. Balance verificado

Simulaciones headless sobre el motor real:

| Prueba | Resultado |
|---|---|
| 500 carreras, buen planteo contra mal planteo | 84,3 contra 9,2 de score |
| Gana el que lee bien | **100%** |
| Empates técnicos | ~50% de las temporadas |
| El azar dio vuelta el resultado | 6,5% de las temporadas, siempre en empate técnico |
| Carreras desde formativas que llegan a Primera | 100% |
| Un crack de ruleta supera a tu titular | 100% |

---

## 8. Pendientes

- Interfaz de sala para el modo duelo (el motor ya está).
- Escudos oficiales (decisión de licencia).
- Multi-idioma: portugués e inglés.
- Ranking global (requiere backend mínimo).
- Reescritura de los textos de las 60 decisiones con la voz de Leo.
- Más situaciones específicas de formativas.

---

## 9. Riesgos

- **Licencias.** Los nombres de clubes son de bajo riesgo; los escudos son marcas registradas. Para un portfolio no suele pasar nada; si el juego monetiza o escala, los clubes pueden reclamar.
- **Scope creep.** Este proyecto es la puerta de entrada liviana; el simulador táctico pesado va aparte, en Unreal.
- **Curva de entrada.** La grilla de sectores es el corazón del juego y también lo más difícil de comunicar en los primeros diez segundos.
