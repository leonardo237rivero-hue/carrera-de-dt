# Carrera de DT

Juego de navegador donde dirigís un club durante seis temporadas. Peleás el mercado,
manejás el vestuario y, sobre todo, elegís **cómo parar al equipo contra el sistema del rival**.

No te premia por tener el mejor plantel: te premia por entender el que tenés.

## Jugar

**Online:** https://USUARIO.github.io/carrera-de-dt/ (cambiar por tu URL una vez publicado)

**Local:** hace falta un servidor chico porque el juego está dividido en varios archivos.

```bash
python3 -m http.server 8000
```

Después abrí http://localhost:8000

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
