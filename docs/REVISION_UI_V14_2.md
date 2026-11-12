# Revisión de UI y cierre de temporada — v14.2.0

Se revisó en Claude la conversación «Análisis de minijuegos de fútbol para portafolio» y el documento «Carrera de DT — Rediseño v14 (playtest en tablet)», con sus 32 apuntes y respuestas. La última entrega visible de Claude correspondía a v14.1. Se conservan las imágenes, la identidad cinematográfica y las animaciones publicadas en v14.1.2.

## Corregido en esta entrega

- El cambio de suplente por titular abre un diálogo explícito: quién entra, quién sale y confirmación. También se inicia tocando un titular. Ofrece primero los jugadores compatibles; explica los descartados. Mantiene los otros diez casilleros y usa el sistema que se está viendo.
- «Once automático» libera tanto la lista de preferidos como la asignación por casillero. El primer suplente ya no aparenta estar seleccionado sin estarlo.
- El cierre es un periódico completo, con jerarquía editorial, fotografía, cifras, noticias y consecuencias. Hay 16 enfoques con cuatro titulares por idioma: títulos, bicampeonato, sorpresa, crisis, último puesto, copa, formación y otros balances. Las noticias salen de partidos, figuras, juveniles, clásicos, rachas y compromisos registrados. Los temas secundarios rotan sin consumir azar de la simulación.
- Nueva fotografía para la revelación de un club chico: reconocimiento de su tribuna sin inventar un trofeo. JPG 1672 × 941, inferior a 400 KB. Las temporadas con títulos conservan el festejo; las negativas usan el vestuario vacío.
- La exigencia institucional aparece en plantel, planificación, prensa y balance. Los grandes reciben una penalización adicional por quedar fuera de los tres primeros sin un título principal; los chicos reciben reconocimiento por superar su expectativa, salvo si terminan últimos. Las formativas no reciben esa presión profesional. Es un ajuste de diseño del juego, no una clasificación estadística real.
- El nivel del plantel y la exigencia no son idénticos: una lista explícita conserva la presión histórica de clubes que tienen nivel deportivo menor en la base. La vacante juvenil deja de anunciar «ganar ya».
- Entrada breve del periódico y confirmación del cambio, ambas respetando movimiento reducido. Cabecera compacta para priorizar la portada, columnas adaptadas a móvil y tablet, navegación por teclado y diálogo nativo.

## Validación

Seis verificadores: edición, game design, caché, v10, cine e interiores. Incluyen acciones reales de intercambio, incompatibilidad, lesión, preservación de casilleros, guardado, variación editorial sin consumir RNG y 30 temporadas completas (630 jornadas). Caché: 41 scripts/estilos y 15 imágenes v14.

Prueba en navegador del intercambio a 390 px, temporada simulada completa y cierre hacia la continuidad de la carrera. Revisión visual de portada a 390 y 1024 px.

## Apuntes que siguen abiertos

El documento de Claude es un rediseño más amplio; esta entrega no declara implementados todos sus puntos. Siguen pendientes las fotos verificadas de estadios reales por club, ampliar las promesas concretas de prensa y su memoria entre temporadas, y la evolución del minijuego hacia envido. La táctica animada sigue siendo una representación esquemática. Las propuestas de inicio/vacantes están en `PROPUESTAS_VISUALES_INICIO_VACANTES.md`.
