# v15.1 — Un club también es un lugar

La v15 diferenciaba colores y atmósfera, pero sus estadios eran demasiado intercambiables. Esta entrega centra el primer grupo en Peñarol, Nacional y Barcelona: arquitectura reconocible y centros de formación propios, manteniendo la interfaz editorial limpia.

## Seis escenas, seis referencias

| Club | Primera | Formación | Rasgo que se conserva |
| --- | --- | --- | --- |
| Peñarol | Campeón del Siglo | Ciudad Deportiva Néstor Gonçalves | Tribunas abiertas aurinegras y edificio de palcos lateral; exterior de la tribuna junto a la práctica. |
| Nacional | Gran Parque Central | Los Céspedes | Escala de barrio, tribunas desiguales y palcos sobre la Delgado; casa blanca con torre y diagonales tricolores entre árboles. |
| Barcelona | Camp Nou clásico | Ciutat Esportiva Joan Gamper | Anillos abiertos y cubierta lateral de la configuración anterior a 2023; campos paralelos, edificios modernos y entorno de Sant Joan Despí. |

Las referencias se buscaron, descargaron fuera del repositorio e inspeccionaron visualmente antes de generar. [Fuentes, imágenes de referencia y prompts completos](../assets/v15.1/PROMPTS.md). Las fotos fuente no se publican como archivos del juego. Las escenas generadas son interpretaciones artísticas, no reproducciones exactas. La configuración histórica del Camp Nou se identifica expresamente en los hitos de temporada.

Cada JPG mide 1672 × 941 y pesa entre 333 y 391 KB. El arte aparece en la llegada al plantel, cierre de temporada, presentación a los jugadores, panel de cantera, banners y previa/partido según la sede. Una visita usa el club local; la sede neutral conserva el recurso neutral. Las divisiones formativas usan su campo de formación. El panel de cantera muestra ese lugar aun cuando el DT está en Primera.

## Volumen sin ruido en los controles

Los escudos de 48 px o más usan el PNG existente como cara frontal y como máscara de siete capas de canto. Perspectiva, iluminación, reflejo y una entrada corta dan volumen sin alterar la identidad gráfica. Los iconos pequeños de tablas siguen planos. Las piezas de los hitos se apoyan sobre una base en perspectiva. El giro adicional responde al hover de ratón; no requiere hover en pantalla táctil ni añade botones decorativos.

La jugada usa un plano táctico inclinado a 32 grados, fichas con espesor, balón con elevación y red con profundidad. Es una presentación CSS 3D de la jugada existente, no un motor de futbolistas 3D. No se cambian goles, decisiones, probabilidades ni la semilla de la carrera. La pausa y la pestaña oculta detienen el avance y las animaciones del balón. Se respeta la preferencia de movimiento reducido.

## Verificación

- Pruebas de ubicación: Primera/cantera de los tres clubes, local/visitante/neutral, fallback y ausencia de consumo del RNG.
- Pruebas existentes: atmósfera, caché, diseño del juego, cine, interiores, edición y v10; incluye 30 temporadas/630 jornadas y las regresiones de sustituciones, Di María y progresión de cantera.
- Revisión en navegador: Peñarol y Barcelona en plantel, Los Céspedes con jugador promovido y progreso visible; escudos y máscaras cargados; celular de 390 px sin desbordamiento horizontal; jugada con perspectiva y pausa.
- Caché v15.1 coherente con los 44 scripts/estilos, seis JPG nuevos y escudos de los tres clubes para uso offline.

## Próximo criterio de ampliación

Boca, River, Racing y otros clubes conservan el arte v15. Antes de renovar cada uno se debe recopilar al menos una referencia del interior del estadio y otra de su centro de formación, registrar la época representada y revisar la silueta del edificio. No alcanza con cambiar el color de una misma tribuna. Para un futuro partido con jugadores 3D completos hace falta una etapa propia de modelos, rigging, cámaras, rendimiento móvil y sincronización con el motor; esta entrega no lo simula mediante un video decorativo.
