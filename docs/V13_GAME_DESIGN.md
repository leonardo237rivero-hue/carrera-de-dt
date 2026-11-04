# v13 — Recorrido, palabra y oficio

Entrega v13, 4 de noviembre de 2026. Conserva la dirección A / Cine de cancha de v12. Preparada para publicación en GitHub Pages.

## Qué cambió

- Inicio: nombre, edad, club al que se aspira y duración. El perfil y la idea se explican después de postularse a una vacante: CV → invitación → entrevista → propuesta → firma.
- La entrevista registra origen y experiencia como relato, sin convertir clase social en capacidad. El DT elige un compromiso: proceso, oportunidades juveniles o resultados. Se evalúa al cerrar la temporada, cambia la confianza de la directiva una sola vez y se muestra en el balance. Las vacantes actuales admiten al candidato tras acordar condiciones; todavía no hay un mercado competitivo de candidatos ni rechazos simulados.
- Llegada: presentación acorde a formativas; idioma del vestuario separado del idioma de los menús; opción de intérprete sin castigo; presentación al grupo antes del plantel. No hay conferencia profesional en juveniles ni en clubes pequeños.
- Ficha del futbolista: confianza en el DT, convicción en la idea, comprensión de la tarea y satisfacción por participación. La charla y el cierre de temporada modifican estas variables. Confianza, convicción y comprensión tienen un aporte pequeño a la cohesión del once.
- Puestos: un central verificado no se puede colocar manualmente como lateral. Los cambios manuales fijan el casillero elegido, sin que el autoarmado deshaga la sustitución. Las bajas se cubren sin duplicar jugadores ni usar lesionados. El 4-3-3 distingue pivote y dos mediocentros.
- Arenga: texto propio al frente, dictado opcional y revisión de una intención y señales. Se eliminaron las tres frases obligatorias y el panel de cinco reacciones anticipadas. Afecta a los once; intervienen contexto, personalidad simulada, confianza, fatiga, tareas, apoyo, amenazas y repetición. Hay devolución después de hablar. La charla queda en el diario, su efecto de partido es acotado y la reacción individual llega a los penales. La segunda charla del descanso reemplaza el efecto residual de la primera; no lo duplica. Saltar la charla sigue disponible.
- Construcción organizada: bajar el pivote, sostener enlace, tercer hombre o pase largo; amplitud y cobertura tras pérdida. Esquema con los puestos de la formación, condiciones del escenario y explicación del siguiente pase. Un pivote seguido no equivale a un hombre libre. Se puede modificar antes del torneo, en la previa y en el descanso. Reemplaza el aporte anterior de salida del motor, conserva el resto del modelo y añade riesgo para el rival si avanzan ambos laterales. Aprendizaje específico por club y salida: comienza en 12, aumenta 2 por partido y no desaparece al probar otra salida.
- Trayectoria: etapas separadas por club y regreso; temporadas, títulos correspondientes, vínculo con hinchada al salir y motivo (despido, otro club, selección). Se preserva la continuación existente de tres temporadas fuera del duelo. Un guardado antiguo no inventa vínculos históricos que nunca registró.
- Guardado v13 acepta v10, v11 y v12. Conserva las nuevas variables y las asignaciones del once. Sigue siendo un guardado de **pretemporada**, no un guardado de cada instante del partido.

## Alcance y límites que siguen abiertos

1. **No hay IA semántica externa.** Web Speech transcribe cuando el navegador lo permite; el jugador puede corregir una lectura local limitada. No reconoce prosodia, acento, emoción real ni coherencia profunda. Texto y audio tienen el mismo sistema de resolución. Para un LLM se necesita un servicio seguro y evaluación de respuestas; no se debe publicar una clave en GitHub Pages. Prensa y persuasión todavía necesitan esa evolución conversacional.
2. **Los puestos reales no están todos verificados.** La base original tiene muchos jugadores sólo por sector. Esos casos conservan un único puesto de trabajo de la simulación, explícitamente provisional, sin declarar que cubren toda la línea. Falta completar fichas con fuentes oficiales. La alineación automática aún puede utilizar un jugador fuera de puesto si no encuentra cobertura suficiente, mostrando advertencia y penalización; la sustitución manual exige compatibilidad.
3. **La táctica nueva es un escenario discreto de construcción**, conectado a probabilidades y fuerza del motor existente, no un simulador espacial continuo. Sus tiempos y distancias son condiciones diseñadas, no tracking ni mediciones. Falta desarrollar con el mismo detalle creación en campo rival, finalización, defensa organizada y ambas transiciones. El esquema no prueba que la jugada haya ocurrido en el partido.
4. La edad y el aspecto opcional del DT, las rutinas de penales y la opción dirigir/simular se conservan de versiones anteriores. Esta entrega no los presenta como novedades.
5. Los pesos psicológicos son reglas de ficción para playtest, no coeficientes validados para entrenar personas. Falta balance con jugadores humanos, especialmente la facilidad de declarar señales favorables en la revisión manual y los incentivos del compromiso de proceso.

## Fundamento de diseño consultado

Se retoma el estudio guardado en `Analisis_Carrera_DT/libro_arte_v12_ed02/ESTUDIO_Y_DECISIONES.md`, sin recuperar su dirección visual rechazada. Fuentes primarias para la distinción entre preparación táctica, motivación y contexto:

- [FIFA: reunión previa de España sub-15](https://www.fifatrainingcentre.com/en/practice/elite-sessions/youth-national-teams/u15-boys-tournament/pre-match-team-talk.php): trabajo de modelo, tareas y momentos. No equivale a una fórmula emocional ganadora.
- [FIFA: juego 3v3 + 2 para progresar](https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/3v3-plus-2-possession-game-playing-forward-as-a-priority.php): apoyos, orientación y conexión más allá de la primera presión.
- [Zimmerman, Myers y Vealey, 2025](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1615784/full): preferencias de comunicación previa. No establece una función universal entre frase y resultado.
- [Manual de Football Manager 2024](https://community.sports-interactive.com/sigames-manual/football-manager-2024/playing-a-match-r4966/): referencia de conversaciones prepartido/descanso/pospartido; aquí se prioriza la palabra propia sobre elegir una frase cerrada.

## Validación

`node herramientas/verificar-game-design.js`: compatibilidad de puestos, persistencia de sustituciones, ausencia de duplicados, superioridad condicionada, once reacciones, protección contra doble aplicación, repetición, charla de descanso, compromisos, orden de llegada, idioma independiente, etapas del legado, aprendizaje por club y guardado v13.

Regresiones conservadas: `verificar-v10.js` (30 temporadas y 630 jornadas), `verificar-interiores.js`, `verificar-cine.js` (incluye contraste de controles de los 88 clubes). Playtest de navegador en origen aislado 8768: recorrido completo a formativas, arenga escrita y revisada, descanso y vuelta al partido, panel de construcción. Revisión de ancho 320 px mediante iframe; no equivale a probar Safari en un iPhone físico. Se mantienen pendientes el dictado con micrófono real y el balance humano.
