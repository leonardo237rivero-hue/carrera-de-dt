# v16.1 — Dos referentes de cada país

Esta entrega integra el arte sobre la v16 de problemas tácticos y cuaderno del DT. Completa veinte clubes: cuarenta escenas de estadio y formación (seis de v15.1 más treinta y cuatro nuevas), veinte escudos con malla 3D y sus renders, una galería para revisar el conjunto y un paquete de fuente para Salida Limpia.

| País | Club | Estadio | Formación |
| --- | --- | --- | --- |
| Uruguay | Peñarol | Campeón del Siglo | Ciudad Deportiva Néstor Gonçalves |
| Uruguay | Nacional | Gran Parque Central | Los Céspedes |
| Argentina | Boca Juniors | La Bombonera | Boca Predio |
| Argentina | River Plate | Monumental | River Camp |
| Brasil | Flamengo | Maracanã | Ninho do Urubu |
| Brasil | Corinthians | Neo Química Arena | CT de Base · Parque Ecológico |
| España | Barcelona | Camp Nou | Ciutat Esportiva Joan Gamper |
| España | Real Madrid | Santiago Bernabéu | Ciudad Real Madrid · Valdebebas |
| Inglaterra | Liverpool FC | Anfield | Kirkby · Campus de formación |
| Inglaterra | Manchester United | Old Trafford | Academia de Carrington |
| Italia | Milan | San Siro | Centro Sportivo Vismara |
| Italia | Juventus | Allianz Stadium | Juventus Training Center · Vinovo |
| Alemania | Bayern München | Allianz Arena | FC Bayern Campus |
| Alemania | Borussia Dortmund | Signal Iduna Park | Brackel · Hohenbuschei |
| Francia | Paris Saint-Germain | Parc des Princes | Campus PSG · Poissy |
| Francia | Marsella | Stade Vélodrome | La Commanderie · Robert Louis-Dreyfus |
| Estados Unidos | Inter Miami | Chase Stadium | Florida Blue Training Center |
| Estados Unidos | LA Galaxy | Dignity Health Sports Park | Academia LA Galaxy · Carson |
| Arabia Saudita | Al Hilal | Kingdom Arena | Academia Al Hilal · Al Qirawan |
| Arabia Saudita | Al Nassr | Al Awwal Park | Prince Abdulrahman bin Saud |

## Criterio visual

Cada escena parte de una fotografía del lugar y conserva los rasgos que lo diferencian: la pared de palcos de La Bombonera, la cubierta circular del Maracanã, las vigas rojas de San Siro, la cubierta ondulada del Vélodrome o el techo completamente cerrado de Kingdom Arena. Las canteras tienen otra escala y su propio paisaje. Vismara, Vinovo y Bayern Campus sustituyen la práctica genérica de esos clubes.

Son recreaciones artísticas, no planos exactos ni una documentación del estado actual de las obras. Camp Nou representa su configuración clásica anterior a 2023; Inter Miami conserva expresamente la sede histórica de Fort Lauderdale. Las fuentes y prompts completos están en [assets/v16.1/PROMPTS.md](../assets/v16.1/PROMPTS.md). Generación con imagegen integrado, revisión visual y conversión JPG 1672 × 941; todas las imágenes nuevas pesan menos de 400.000 bytes.

## Integración y volumen

El arte aparece en la llegada a temporada, su cierre, cabeceras de cantera, banners, presentación al plantel y partidos según la sede. La visita muestra la cancha del local, las divisiones formativas muestran su centro y una final neutral mantiene su propio fondo.

Los escudos grandes de esos veinte clubes usan renders de modelos Blender con bisel, canto, reverso y frente texturado. Los iconos pequeños siguen usando los PNG originales. El generador respeta contornos separados, como los de Juventus, Liverpool y Al Hilal. GLB/FBX incluyen las texturas; la precaché descarga únicamente los PNG de 384 × 384 (menos de 135 KB cada uno), no las mallas. La entrada visual respeta movimiento reducido. El motor de partido no cambia por esta entrega.

[Galería de los veinte clubes](../herramientas/galeria-clubes.html): filtro por país, selector de centros de formación y enlaces a modelos GLB/FBX. [Paquete 3D y regeneración](../assets/escudos-3d/README.md).

La copia para Salida Limpia está en el workspace, en `SalidaLimpia_Sketch_20261101/SourceArt/Clubes20/`: veinte Blender, veinte GLB, veinte FBX, veinte renders transparentes de 768 px, veinte texturas fuente, catálogo, generador y contacto visual. Se entrega fuente lista para importar; no se modifican niveles ni actores del proyecto Unreal. El dibujo interior de cada escudo es textura, no relieve geométrico de cada letra.

## Verificación realizada

- Veinte clubes, exactamente dos por cada país: selección de cancha/cantera y sede sin consumir RNG.
- Cuarenta escenas específicas presentes, JPG nuevos con dimensiones y peso correctos; veinte renders RGBA.
- Veinte GLB comprobados: volumen en tres ejes, UV, normales, materiales y texturas incorporadas; 31.252 triángulos en total. Veinte exportaciones FBX presentes.
- Caché v16.1 coherente con 46 scripts/estilos, nuevo arte y recursos previos.
- Pruebas de atmósfera, situaciones v16, diseño del juego, cine, interiores, edición y v10 aprobadas; incluyen sustituciones, pases persistentes, cantera, variación del diario y 30 temporadas / 630 jornadas.
- Navegador: Bernabéu y render de Real Madrid cargados; cambio desde el banco Rüdiger por Cucurella completado y los otros diez en su lugar; móvil de 390 px sin desbordamiento; filtros del atlas y canteras de Al Hilal / Al Nassr comprobados.

## Límites concretos de esta entrega

Los otros clubes conservan sus fondos anteriores. Las identidades de los escudos son las variantes que ya estaban en el repositorio; no se actualiza aquí todo el catálogo de marcas o planteles. En el navegador se muestran renders de modelos reales, no un visor de mallas en tiempo real. El siguiente paso útil de arte es ampliar clubes con este mismo criterio de referencia, revisar las variantes históricas elegidas y diseñar escenas de hitos adicionales sin repetir siempre la misma composición.

