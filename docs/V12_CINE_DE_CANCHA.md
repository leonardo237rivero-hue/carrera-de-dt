# v12 — Cine de cancha

Dirección visual A aprobada por Leo, aplicada el 4 de noviembre de 2026. Versión local: 12.0.0. No se publicó esta revisión durante su implementación.

## Alcance

Se conserva el motor y el contenido de la carrera. La capa `js/cine.js` y `css/cine.css` reemplaza la presentación de papel de v10/v11 con superficies carbón, tipografía sans legible, selección con acento del club y fotografía cinematográfica original. Los fondos son escenarios ficticios rioplatenses, no reproducciones certificadas de cada estadio. Los nombres, colores y escudos se leen de los datos existentes.

La cabecera, formularios, tarjetas, botones, tablas, fichas y paneles comparten el nuevo lenguaje en las 19 secciones: inicio, duelo, identidad, idea, ofertas, plantel, mercado/convocatoria, persuasión, ruleta, decisiones, planteo, temporada, partido, resolución, club, final, prensa y banco. El partido incluye previa, arenga, vivo, entretiempo y penales.

- Inicio real con Nueva carrera, Continuar y Duelo; fondo desde el túnel en primera persona. Continuar queda desactivado cuando no existe pretemporada guardada.
- Cabecera fotográfica y franja de los colores originales, escudo real cuando está disponible y estados de la partida.
- Cuatro ambientes: acceso, tribuna, vestuario y prensa. Recursos PNG originales en `assets/cine/`; prompts documentados allí.
- Plantel con lista a la izquierda y cancha a la derecha en escritorio. En móvil se apilan; cada titular se puede consultar también desde una lista de texto.
- Selector de sistema junto al once, sustituciones existentes por toque/clic y teclado, fichas sin retratos ni siluetas humanas. El render no consume azar.
- DT representado por monograma de forma predeterminada. El retrato ilustrado que envejece puede activarse en identidad. No se agregaron retratos de futbolistas.
- Vestuario vacío ambientado, con informe del grupo plegable; el editor de palabras propias y la ruta de frases siguen disponibles.
- Cierre con tarjetas de las copas efectivamente registradas en la carrera, club y temporada, más historial y estadísticas existentes.
- Manifest permite orientación vertical u horizontal. Nueva caché v12 y compatibilidad con pretemporadas v10/v11/v12.

## Corrección hallada durante el recorrido

La cola de presentación abría la conferencia libre aun en formativas porque comprobaba que no hiciera falta elegir una política de prensa. Se añadió la condición de categoría profesional (división 3) a esa llamada. Las categorías de formación pasan a su plantel. La prueba cubre las tres categorías juveniles y la ruta profesional.

## Validación

- `node herramientas/verificar-v10.js`: 30 temporadas / 630 jornadas; guardado, modelo, RNG, simulación, comunicación y penales.
- `node herramientas/verificar-interiores.js`: render con los datos de seis clubes y conservación de la simulación.
- `node herramientas/verificar-cine.js`: contraste de controles AA para los 88 clubes, colores originales preservados, ausencia de retratos de futbolistas, retrato DT opcional, compatibilidad de guardados, filtro de prensa juvenil y recursos de caché completos.
- Prueba en navegador del recorrido inicio → identidad → idea → ofertas → presentación de club → plantel; cambio 4-3-3 → 4-4-2 y sustitución de Aguerre por Britos en escenario aislado.
- Revisión visual adicional de mercado, ruleta, conferencia, arenga, vivo, entretiempo, penales, plan de temporada, ticker y legado. Los accesos de QA son fixtures, no una carrera real del usuario.
- Revisión con iframe a 320 × 740, 390 × 844 y 844 × 390. Plantel, entretiempo y legado sin desborde horizontal en las combinaciones comprobadas. No equivale a una prueba en Safari/iPhone físico.
- Pruebas en el puerto 8768 para no tocar la partida guardada del usuario en 8767 ni la de GitHub Pages.

## Límites conservados

Esta versión implementa la dirección visual aprobada. La entrevista de trabajo, la nueva simulación táctica espacial y una IA semántica no forman parte de este cambio: la comunicación sigue usando el análisis local existente. La cobertura de puestos reales continúa siendo la de la base anterior; los que no tienen puesto verificado se muestran como aproximación por línea. Continuar recupera la pretemporada guardada, no un partido en curso. Los reportes anteriores no equivalen a un playtest exhaustivo de cada evento aleatorio.

## Revisar localmente

`node herramientas/servir.js 8768` → `http://127.0.0.1:8768/`

Para escenarios aislados: `node herramientas/preparar-playtest.js`, luego abrir `/herramientas/playtest-local.html`. Ese HTML se genera localmente y está excluido de Git.
