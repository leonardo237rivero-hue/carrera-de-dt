# Carrera de DT

Juego de navegador donde construís una carrera de entrenador de 3, 6 o 10 temporadas.
Sostenés una idea, manejás el vestuario y elegís cómo intervenir en los partidos importantes.

**v10.0.0:** dirección de arte cuaderno/banco/diario, ADN con aprendizaje persistente,
charlas propias escritas o dictadas, consecuencias de prensa, edad visual del DT,
rutinas de penales y guardado de pretemporada. [Diseño, cambios, pruebas y límites](docs/V10_DISENO_Y_PLAYTEST.md).

No te premia por tener el mejor plantel: te premia por entender el que tenés.

## Jugar

**Online:** https://leonardo237rivero-hue.github.io/carrera-de-dt/

**Local:** hace falta un servidor chico porque el juego está dividido en varios archivos.

```bash
node herramientas/servir.js 8767
```

Después abrí http://127.0.0.1:8767. Verificación: `node herramientas/verificar-v10.js`.

El dictado depende del navegador y puede usar su servicio de reconocimiento. Siempre se puede
escribir y revisar el mensaje. La interpretación es local por vocabulario, no una IA semántica.

## Estructura

```
index.html            estructura de la página
css/estilos.css       todos los estilos
js/tactica.js         las tres capas del motor: pesos, fit y matchup
js/decisiones.js      el pool de 60 situaciones
js/datos.js           ligas, clubes, nombres por país, arquetipos de DT
js/nucleo.js          RNG con semilla, estado de partida, generación de plantel
js/ui.js              escudos, canchas, barras, panel de plantel
js/juego.js           flujo de pantallas y loop de temporada
escudos/              PNG de los escudos (ver escudos/LEEME.md)
docs/                 GDD, instructivo, backlog y las planillas de balance
```

## Documentación

- `docs/GDD.md` — documento de diseño completo
- `docs/INSTRUCTIVO.md` — cómo se juega y cómo se modifica
- `docs/BACKLOG.md` — qué viene y en qué orden
- `docs/Sistema_Tactico_Carrera_DT.xlsx` — las tres capas tácticas, editables
- `docs/Pool_Decisiones_Carrera_DT.xlsx` — las 60 decisiones, editables

## Probar cambios sin jugar a mano

El motor corre en Node sin navegador. Sirve para simular cientos de carreras
y ver si un cambio de balance rompió algo:

```bash
node herramientas/simular.js
```

## Escudos

El juego busca los PNG en `escudos/`. Si falta alguno, dibuja un escudo generado
con los colores del club y no se rompe nada. Los nombres de archivo exactos están
en `escudos/LEEME.md`.

Los escudos de clubes son marcas registradas. Usarlos sin licencia es un riesgo:
para un prototipo o portfolio no suele pasar nada, pero si el proyecto monetiza
o escala, los clubes pueden reclamar.

## Licencia del código

Código propio. Los nombres de clubes y competencias pertenecen a sus titulares
y se usan de forma referencial.
