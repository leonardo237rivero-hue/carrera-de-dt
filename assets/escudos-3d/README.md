# Escudos de veinte clubes

Cada club tiene un PNG transparente de 384 × 384 para Carrera de DT, una malla GLB con textura incorporada y una exportación FBX. El juego usa el render; los modelos se descargan aparte y no forman parte de la precaché. Las identidades gráficas son las que ya existían en `escudos/`, incluidas sus variantes históricas. No se redibujaron letras ni símbolos mediante IA.

La geometría tiene contorno suavizado, canto y bisel metálico, reverso grafito, cara frontal texturada y UV. Se conservan las islas separadas de la marca. No es un plano rectangular con una imagen pegada: el contorno tiene espesor. El relieve interior del dibujo sigue siendo textura; no se modeló cada letra o figura. La resolución de esa textura depende del PNG original del proyecto.

## Fuente reproducible

Desde la raíz de Carrera_DT, con Blender 2.80:

```powershell
& 'C:\Program Files\Blender Foundation\Blender\blender.exe' --background --factory-startup --python herramientas/render-escudos.py -- assets/escudos-3d/catalogo.json ../Arte_Clubes_3D/regenerados
```

`--factory-startup` evita cargar extensiones personales. Cada salida incluye `.blend`, `.glb`, `.fbx` y render RGBA de 768 × 768. El catálogo resuelve las texturas respecto de su propio directorio. Los originales Blender y renders de alta resolución se entregaron también en `SalidaLimpia_Sketch_20261101/SourceArt/Clubes20/`, junto a las texturas y este generador.

## Uso en Salida Limpia / Unreal

Importar el FBX como Static Mesh, manteniendo normales y tangentes. Tiene tres materiales: frente texturado, bisel metálico y reverso. Conservar el alfa del frente con material Masked; en caso de que el importador no enlace la textura incorporada, usar `textura.png` de la carpeta del club. Orientación fuente: vertical Z, frente hacia −Y; ajustar orientación y tamaño al widget o escena de destino. Se incluyen GLB y Blender como alternativas de intercambio. No se modificaron niveles ni lógica de Unreal; la asignación a un widget/actor queda a cargo de esa integración.

En Carrera de DT los escudos grandes usan los renders de estas mallas. Los iconos de tablas siguen planos para legibilidad, y un fallo de carga vuelve al escudo anterior. La entrada dura 850 ms y se desactiva con movimiento reducido. No se presenta el render estático como un visor 3D interactivo.
