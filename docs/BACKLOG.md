# Carrera de DT — Backlog priorizado v4

> **Estado al cerrar la tanda 3-5.** Ya están implementados: todos los bugs de
> la sección 0, la prioridad alta completa (1.1 a 1.6), y de la prioridad media
> 2.1 identidad de clubes, 2.2 reputación, 2.3 política con la prensa,
> 2.4 persuasión, 2.6 récords y 2.7 modos de duración. Más el azar disfrazado
> de genialidad de la sección 7.
> **Queda pendiente sólo 2.5**, las decisiones tácticas dentro del partido,
> que es la más cara y la que más se pisa con el simulador de Unreal.

Consolidación de las ideas de diseño de Leo más los dos playtests. Ordenado por impacto contra costo, no por orden de aparición.

**Nota sobre el nombre:** los apuntes dicen "Copero 2". Copero es el juego de otro. Conviene no bautizar el proyecto con el nombre del competidor ni en los documentos internos, porque después se pega.

---

## 0. Bugs y deudas confirmadas — se arreglan primero

Esto no es diseño, es cosas rotas. Van antes que cualquier idea nueva.

| # | Problema | Detalle | Costo |
|---|---|---|---|
| B1 | **Cartas bloqueadas sin explicación** | En mercado y ruleta aparece un jugador en negro que no se puede tocar y no dice por qué. Es falta de mensaje: puede ser plata insuficiente o que ya se lo llevaron. | Bajo |
| B2 | **Nombres de puesto inconsistentes** | Los titulares dicen "carrilero", "mediocentro", "central"; los suplentes dicen "ataque", "mediocampo", "defensa". No machean. | Bajo |
| B3 | **No se puede ver el plantel al fichar** | Fichaste un arquero de 74 y no sabías quién era tu arquero. El mercado está desconectado de la gestión del plantel. | Medio |
| B4 | **Poner un suplente de titular no funciona bien** | Tenías un delantero bueno en el banco y no lo pudiste subir. | Bajo |
| B5 | **Ruleta con probabilidad demasiado baja** | Dos fichas comunes dan ~20% de acertar. Se siente mal aunque el reparto entre común y crack sea correcto. | Bajo |
| B6 | **Portada con pared de texto** | Demasiada información junta en la primera pantalla. | Bajo |

---

## 1. Prioridad alta — cambian el juego y son baratas

### 1.1 El plantel siempre a mano
Un panel de plantel accesible desde mercado, ruleta y planteo. Resuelve B3 y es el reclamo que apareció en los dos playtests por separado, que es la señal más fuerte de todo el feedback.

### 1.2 Once visual estilo FIFA con arrastre
Cancha con los titulares en su posición y lista de suplentes al costado; arrastrás un suplente sobre un titular y se cambian. Reemplaza el sistema actual de "fijar jugador", que es poco intuitivo. Resuelve B2 y B4 de paso, porque obliga a unificar la nomenclatura de puestos.

### 1.3 Ruleta por zonas
En vez de 12 puestos distintos, agrupar en cuatro: arquero, defensa, mediocampo, ataque, cada uno con versión común y crack. Sube muchísimo la sensación de control sin sacar el azar. Mantener la regla de que el crack tiene la mitad de casillas.

### 1.4 Feedback de por qué algo está bloqueado
"No te alcanza la plata" o "Se lo llevó el otro DT", escrito sobre la carta. Resuelve B1.

### 1.5 Las decisiones dependen del perfil de DT
La misma situación con distinta consecuencia según seas Formador, Ganador o Bombero. El ejemplo del playtest es perfecto: si sos formador, tenés más espalda para negarte a poner al hijo del dirigente. Esto ataca de raíz el problema de "la respuesta correcta es obvia": deja de haber una respuesta correcta universal.

### 1.6 Animación de la tabla jornada a jornada
Al cerrar la temporada, mostrar cómo fue subiendo y bajando el equipo: 6º → 5º → 3º → 4º → 2º. El resultado ya está calculado, pero mostrarlo progresivamente genera tensión y hace que la temporada se recuerde. Costo bajo, impacto emocional alto.

---

## 2. Prioridad media — profundidad real, más caras

### 2.1 Identidad e historia de los clubes
La pregunta sobre Zico en Flamengo. Requiere una base de datos de ídolos, entrenadores históricos y títulos por club.

Estructura de las respuestas, que ya está bien pensada en los apuntes:
- **Ignorancia**: "un gran cantante" — quedás como un boludo.
- **Mesurada**: el mayor de la historia del club, detrás de Pelé a nivel Brasil.
- **Provocación**: tirarle un palo.
- **Adulación excesiva**: pasarse para el otro lado.

Faltarle el respeto al ídolo máximo puede costarte el puesto. Esto es de lo más original que tiene el proyecto y de lo que más lo diferencia de Copero y de 7a0: **el juego premia saber de fútbol de verdad, no sólo de táctica**.

Empezar por cinco o seis clubes grandes (Peñarol, Nacional, Boca, River, Flamengo, Palmeiras) y sumar de a poco.

### 2.2 Reputación acumulada del DT
Tus decisiones construyen una etiqueta: bilardista, lírico, formador, resultadista, vendedor de humo, confrontativo. La prensa te pregunta **según lo que venís haciendo**, no al azar.

La pregunta del ejemplo es exactamente el tono buscado: *"¿Hoy vas a salir a jugar el partido o vas a volver a meter el cuadro atrás esperando que una estrella te salve?"*

Requiere llevar un contador por eje y filtrar el pool según el perfil resultante. Es el paso natural después de 1.5.

### 2.3 Política con la prensa
Un eje con dos extremos, y ninguno correcto:

| Amigo del periodismo | Hermético estilo Bielsa |
|---|---|
| Menos presión mediática | Menos filtraciones |
| Te llegan rumores y sondeos antes | Más control de la información |
| Periodistas en los entrenamientos | Ventaja táctica preservada |
| Rendimiento un poco menor | Más polémica, peor con la hinchada |

### 2.4 Persuasión en el mercado
Los fichajes importantes no se resuelven sólo con plata. Cada jugador valora algo distinto: familia, copas, minutos, prestigio, volver a su país, ser el mejor pago. Convencerlo es leer al personaje.

Esto convierte el mercado de una carrera de clics en una decisión, que es lo que le falta hoy.

### 2.5 Decisiones tácticas dentro del partido
El ejemplo del lateral izquierdo desbordado, 4-2-3-1, perdiendo 2-0. Lo importante es que **resolver el problema defensivo no es necesariamente lo correcto para el partido**: meter línea de cinco te tapa la banda pero resigna el partido que ya vas perdiendo.

Es congruencia entre problema táctico, resultado y minuto. Es la idea más ambiciosa de todo el documento y probablemente la que más se parece al simulador pesado de Unreal. Cuidado con el scope.

### 2.6 Récords históricos
Más títulos, más partidos dirigidos, mejor porcentaje, campeón más joven, mayor racha invicta, ídolo de cada club como DT. Le da objetivos a la carrera más allá de ganar.

### 2.7 Modos de duración
Exprés de dos temporadas y normal más largo. Ojo: el modo duelo asincrónico necesita duración fija para que los scores sean comparables. Si hay dos modos, hay dos rankings.

---

## 3. Ideas donde yo iría en contra

### 3.1 Mostrar probabilidad de ganar, empatar y perder — **no**
Es el pedido que más suena razonable y el más peligroso. Si mostrás "68% de ganar con 4-3-3", el jugador deja de leer la cancha y elige el número más alto. Colapsa el corazón del juego en una comparación de porcentajes, y contradice el pilar de que la táctica se ve, no se calcula.

**Alternativa:** mostrar la consecuencia, no la predicción. "Con este planteo les ganás el centro pero quedás 0v2 en las bandas" obliga a razonar. Un porcentaje no.

El propio documento 3 ya marca esta duda, y coincido con esa desconfianza.

### 3.2 Entrenamientos de pase corto, centros, penales — **no**, coincido con Leo
Agrega un segundo sistema de progresión que compite con el núcleo. El juego se trata de leer al rival, no de subir barritas. Además hace la partida más larga y el loop es corto a propósito.

### 3.3 Afinidad de plantilla con el sistema — **con reservas**
Como está planteada (baja si cambiás mucho de formación) castiga exactamente la habilidad que el juego quiere premiar: adaptarse al rival. Un DT que lee bien cambia de sistema, y el juego lo penalizaría por eso.

**Alternativa:** afinidad **por jugador**, no por entrenador. Un lateral jugando de lateral rinde al 100%; jugando de central, menos. Eso ya existe hoy como "fuera de posición" y sólo habría que mostrarlo mejor. Premia armar el plantel adecuado al sistema, sin castigar la flexibilidad táctica.

---

## 4. Sobre la contradicción de dificultad

Un amigo dice que está muy fácil. Al otro lo echaron de la liga de Arabia. No es que uno tenga razón: es **varianza alta**.

Los datos de la simulación dicen que el primero tiene razón. En 500 carreras, un DT que plantea bien saca 84 de score contra 9 del que plantea mal, y gana el 100% de los duelos. Para alguien que entiende el sistema, el juego está resuelto.

Qué lo arregla, por orden:
1. **Rivales que escalan más rápido** con la temporada y con tu propio rendimiento.
2. **Umbrales de campeón más exigentes** a medida que subís de categoría.
3. **Que la directiva suba el objetivo** después de un buen año, en vez de dejarlo fijo.

No tocar el tope de azar de ±8. Subirlo haría el juego más difícil por el lado equivocado: castigaría al que sabe.

---

## 5. Sobre pasar a Claude Code y GitHub

El amigo tiene razón y es lo mismo que ya venía siendo el plan. El proyecto llegó al punto donde un archivo HTML único es una limitación real, no una comodidad.

Lo que te da el cambio:
- Carpetas de verdad para los PNG de escudos, sin depender de rutas frágiles.
- Historial de versiones: si un cambio de balance rompe algo, volvés atrás.
- Publicación directa en GitHub Pages, con URL propia para compartir.
- Camino a APK si en algún momento querés app.

El momento es ahora, antes de meter las ideas de prioridad 2, no después.

---

## 6. Orden sugerido de trabajo

**Tanda 1 — arreglos** (todo lo de la sección 0, más 1.1 a 1.4)
El juego pasa de "tiene bugs molestos" a "se entiende solo".

**Tanda 2 — mudanza**
Claude Code, repositorio, escudos en carpeta, GitHub Pages.

**Tanda 3 — profundidad narrativa** (1.5, 2.2, 2.3)
Las decisiones dejan de tener respuesta obvia y el juego empieza a recordar quién sos.

**Tanda 4 — identidad de clubes** (2.1)
La base de ídolos e historia. Es lo que más te diferencia, y también lo que más contenido a mano requiere.

**Tanda 5 — el resto** (1.6, 2.4, 2.6, 2.7 y después 2.5 si el scope lo aguanta)

---

## 7. La idea que más me gusta de todo el documento

La del azar disfrazado de genialidad: vas perdiendo 1-0, minuto 87, hacés un cambio, y el que entra hace el gol de córner en la jugada siguiente. La prensa titula *"qué cambio del entrenador, la vio antes que nadie"*, y vos sabés que no la viste.

Es la mejor forma de decir algo que el juego ya sostiene en su matemática pero nunca dice en voz alta: **el resultado de una decisión no prueba que la decisión haya sido buena**. Y funciona igual de bien al revés, cuando hacés todo bien y perdés.

Es barata de implementar y le da al juego una voz propia que ni Copero ni 7a0 tienen.
