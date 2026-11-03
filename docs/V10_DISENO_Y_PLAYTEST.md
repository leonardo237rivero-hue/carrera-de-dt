# v10.0.0 — El barrio te está mirando

3 de noviembre de 2026. Evolución de v9a. Este documento prevalece sobre las descripciones históricas de v4–v9 cuando difieren. Se conservaron el GDD, el backlog y la bitácora originales para mantener trazabilidad.

## Decisión de diseño

Carrera de DT es una fantasía de dirigir: construir una idea, interpretar un vestuario y convivir con los resultados. La preparación deja de ser un cuestionario obligatorio con tres respuestas premiadas. El jugador confirma su plan de temporada y decide cuándo intervenir en los partidos destacados.

La interfaz adopta tres registros: **cuaderno** para preparar, **banco** para jugar y **diario** para recordar. Papel cálido, tinta verde, acento ladrillo, ilustración original del fútbol de barrio y retrato vectorial del entrenador. Los colores del club permanecen en escudos y fichas; las acciones mantienen contraste consistente.

## Reglas que cambian

| Sistema | Comportamiento de v10 |
|---|---|
| ADN | `modeloPref` conserva los cuatro principios iniciales. La cabecera muestra cuántos siguen presentes. No concede un premio moral por no cambiar. |
| Aprendizaje | Memoria por club y por opción de cada momento. Los principios iniciales empiezan en 30; alternativas en 12. Al cierre, cada principio utilizado suma 17 hasta 100. Cambiar uno no destruye los otros tres ni el aprendizaje anterior. Un club nuevo comienza su propio aprendizaje; el anterior se conserva si volvés. Son valores de diseño pendientes de balance humano. |
| Ajuste en vivo | Cargar, cerrar y arriesgar modifican patrones y costes. No escriben sobre el ADN ni borran memoria. La ganancia de una orden depende del aprendizaje actual. |
| Sistemas | El antiguo encaje ±14/12% se reduce a aproximadamente −3,5/+3%. El dibujo sigue pesando mediante roles, atributos y espacios; pierde su carácter de respuesta universal. |
| Coordinación | Las antiguas contradicciones se muestran como exigencias simplificadas, admitiendo que en fútbol real son viables con coordinación. Coste reducido a 1% por tensión. |
| Práctica | Se retira del recorrido obligatorio; acertar no da un bonus escondido de 2% contra el clásico. El código de práctica heredado permanece para futuras revisiones. |
| Ritmo | Al comenzar se puede elegir intervenir en los destacados o simularlos. Cada previa ofrece además simular ese encuentro. No se añade un multiplicador aleatorio por tomar el camino rápido. El partido completo y las dos mitades consumen el RNG de forma distinta: no prometemos un marcador idéntico entre rutas. |
| Entrenador | Edad inicial 25–65. Suma un año por cierre. Retrato original con canas, líneas y barba a distintas edades. No afecta por sí sola la calidad del DT. |
| Charla | La secuencia apertura/mensaje/cierre, los perfiles individuales, el momento y la repetición producen reacción. Ahora también deja un cambio acotado en confianza del vestuario y un registro en el cierre. Se conservan los efectos individuales sobre los penales. |
| Psicología | Se quitan las prohibiciones de líder joven y nervioso veterano, y el sesgo automático por nacionalidad. La cultura rioplatense se expresa en lugares, lenguaje y contexto del club. Los perfiles son ficción del motor, no diagnósticos de personas reales. |
| Penales | Cinco y orden elegidos, desgaste, forma, experiencia, fallos recientes, reacción a la charla, presión del tiro y riesgo de eliminación. Se añade elegir acompañamiento: rutina breve o confianza sin sobreexplicar. Ninguna opción garantiza gol. La pausa para cambiar al quinto continúa. Los partidos importantes simulados también suman rodaje, sin duplicarlo al volver del vivo. |
| Prensa | Respuesta propia escrita o dictada y selección explícita de intención. Proteger al grupo, sostener la idea, prometer resultados o reservar información tienen consecuencias distintas. Prometer agrega expectativa y un posible coste de directiva al cierre. |
| Continuar | Punto de guardado local de pretemporada. Guarda cursor RNG y recupera referencias de titulares y decisiones. Se anuncia como pretemporada, no como reanudación exacta de cualquier minuto. |

## Voz: qué hace y qué falta

La API Web Speech del navegador transcribe después de tocar **Dictar**. No hay micrófono automático, claves públicas ni backend. Si falta soporte, hay error o se niega permiso, se puede escribir con idénticas reglas. Antes de usar el mensaje se revisan los tonos o la intención.

La interpretación es **local, por vocabulario y señales**, con negaciones sencillas; detecta algunas respuestas de cassette, amenazas, promesas y referencias tácticas. No es un LLM, no verifica coherencia semántica general y puede equivocarse. Una lectura incierta no castiga al jugador. No evalúa acento, volumen ni oratoria. El juego no guarda audio. El navegador puede enviarlo a su proveedor de reconocimiento; el aviso aparece junto al botón.

Para una IA abierta futura hace falta un servicio separado con clave del lado del servidor, presupuesto y límites, consentimiento claro, validación de salida estructurada, revisión del jugador y protección frente a instrucciones dentro del discurso. No se agregó una clave al repositorio ni se contrató un proveedor.

Fuentes técnicas: [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), [uso de Web Speech](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API). La compatibilidad es limitada y depende del navegador; el dictado no forma parte de la promesa offline.

## Inspiración para las arengas

Se añadieron tres arranques originales para reescribir: calma y tarea, orgullo con ayudas, y grupo sin promesas. No son citas ni imitaciones de voces de entrenadores. Se tomaron como referencias de diseño la claridad de tarea y la responsabilidad compartida, evitando premiar una frase famosa como llave universal.

Referencias: [Guardiola, presión y concentración](https://www.mancity.com/news/mens/man-city-2-0-sheffield-united-pep-guardiola-reaction-63839553), [Guardiola, preparación y motivación](https://www.mancity.com/news/first-team/first-team-news/2019/february/man-city-pep-guardiola-chelsea-carabao-cup-press-conference-embargo), [FIFA sobre Scaloni y el grupo](https://www.fifa.com/es/articles/scaloni-el-entrenador-que-curo-la-grieta-del-futbol-argentino), [entrenamiento juvenil FIFA](https://www.fifatrainingcentre.com/en/practice/elite-sessions/youth-national-teams/u15-boys-tournament/landing-page.php). Estas fuentes inspiran principios; no validan científicamente los coeficientes psicológicos del juego.

## Correcciones del informe y del backlog

| Hallazgo | Resolución |
|---|---|
| Reemplazo inválido silencioso | Mensaje accesible al intentar un cambio incompatible. Lesionados/suspendidos siguen bloqueados. |
| Once corto recurría a lesionados | Se completa excepcionalmente con juveniles de emergencia, nunca con jugadores no disponibles. |
| Puestos reales inventados por orden de lista | Mapa de puestos curados; los demás se adaptan por línea y se identifican como aproximación. No se completó una base de datos exhaustiva. |
| Rival fuerte etiquetado como clásico | Bandera de clásico real. En el resto dice rival destacado; ya no dispara un clásico ficticio. |
| Opciones filtradas aplicaban otro índice | Se conserva el índice original antes de mostrar los botones. |
| Entretiempo revelaba la siguiente orden rival | Se muestra observación e incertidumbre, sin anticipar la orden exacta. |
| Primera opción presentada como óptima | Se retira el semáforo de la previa y se ordenan las órdenes por clave estable. El informe conserva las ventajas aproximadas, no una certeza. |
| Resumen confundía total de llegadas con las del carril | Conteo por carril real, con orientación rival espejada. |
| Moraleja inventaba la causa de una sorpresa | Redacción limitada al resultado y la fuerza previa registrada; no atribuye lo ocurrido a una anécdota inexistente. |
| Duelo prometía azar idéntico | Se corrige el texto: comparte semilla, pero los caminos consumen números distintos. El aislamiento de flujos RNG queda pendiente. |
| Cache devolvía HTML por un JS ausente | Fallback HTML sólo para navegación. Núcleo del juego y arte precargados; no se borran caches ajenas a Carrera DT. |

Los reclamos históricos ya resueltos por Claude —mercado con plantel visible, motivos de bloqueo, modos, tabla, persuasión, reputación y variantes del club— se preservan. No se afirma que todo el backlog esté terminado.

## Verificación reproducible

`node herramientas/verificar-v10.js` verifica cursor RNG, persistencia del ADN, aprendizaje separado, límites de encaje, lectura libre e incertidumbre, edad/retrato, perfiles sin exclusión por edad, lesionados, clásicos, probabilidades de penales, simulación determinista, guardado/reanudación y efectos de opciones filtradas. Ejecuta además **30 temporadas / 630 jornadas** en cinco sistemas y clubes de Uruguay, Argentina y Brasil.

El simulador viejo `herramientas/simular.js` se conserva como exploración histórica. Su comparación de jugador bueno/malo modifica también fichajes y rotación; no sirve para atribuir causalmente la mejora a una sola regla ni para trasladar a v10 los porcentajes publicados del GDD antiguo.

Playtest real de navegador realizado en desarrollo:

- Carrera exprés en Racing: llegada, respuesta libre de prensa, plantel, mercado, ruleta omitida, dos decisiones, plan, Apertura, parada, Clausura, clásico en vivo, arenga propia revisada, ajuste de entretiempo, resultado y tapa.
- Cierre e inicio de temporada 2: entrenador 35→36, aprendizaje 30→47; recarga y continuación recuperan club, año, edad y memoria.
- Escenario aislado de final empatada: rutina, orden sugerido, pausa con 3–3, cambio del quinto y resolución 4–3; vuelve al resultado del partido. Generar con `node herramientas/preparar-playtest.js`, abrir la URL que imprime. El HTML generado se ignora en Git.
- Revisión a 390×844: portada, configuración, ofertas e introducción de club; edad inicial 49 confirmada. Sin desborde horizontal en esas pantallas.
- Adaptación a portugués en Corinthians: conferencia nueva y avisos de dictado traducidos.
- Gestión entre fechas: cambiar sólo el principio ofensivo muestra 3/4 principios conservados y aprendizaje 26; vuelve al calendario. Se reemplazaron también los textos heredados que anunciaban perder la mitad de los automatismos.
- La ruta escrita fue probada. **No se capturó voz humana ni se certificó el servicio de dictado real**, ni se probó en un teléfono físico.

## Próximo playtest humano

Prioridad: comparar sostener una idea, adaptarla por principio y cambiar todo con el mismo plantel; ajustar la velocidad de aprendizaje. Medir si se entiende el coste de cada orden sin leer números. Probar arengas de buena intención que no contengan el vocabulario esperado. Revisar que edad y temple no vuelvan a crear una receta universal para penales. Curar puestos y planteles reales con fuentes por club.

Quedan fuera de esta versión: IA semántica de servidor, evaluación de voz, guardado minuto a minuto/múltiples ranuras, RNG de duelo por eventos, arrastre del once, sustituciones durante el vivo y una simulación posicional con agentes. El motor de zonas sigue siendo una abstracción, no un simulador de entrenamiento profesional.
