# Carrera de DT — Instructivo

Dos partes: **cómo se juega** y **cómo se modifica**.

---

# PARTE 1 — CÓMO SE JUEGA

## Arrancar

Abrí `carrera-de-dt.html` con doble clic en cualquier navegador. No necesita servidor, ni internet, ni instalar nada.

Si querés los escudos oficiales, la carpeta `escudos/` tiene que estar al lado del HTML.

## Las cuatro variables

Están siempre arriba, con barra visual:

| Variable | Qué es | Qué pasa si cae |
|---|---|---|
| **Directiva** | Respaldo institucional | Te echan bajo el umbral de tu arquetipo (12, 18 o 26) |
| **Hinchada** | Presión de tribuna | Perdés empuje en el resultado (hasta −3 puntos) |
| **Vestuario** | Cohesión del grupo | Multiplica todo tu rendimiento entre ×0,90 y ×1,10 |
| **Plata** | Presupuesto | No podés fichar |

## El recorrido de una temporada

**1. Plantel.** Ves tu once parado en la cancha con el nivel de cada jugador y los suplentes en tabla. Podés poner de titular a cualquier suplente. Si alguien juega fuera de puesto sale en ámbar y pierde 10 puntos.

**2. Mercado de pases.** Tres jugadores, quince segundos, y otro DT mirando la misma lista. Cada carta te dice exactamente qué te cambia con tu sistema actual. El que se tira primero se lo lleva, pero tenés que poder pagarlo.

**3. Ruleta.** Ponés dos fichas donde creés que necesitás refuerzo y girás. Los puestos comunes tienen el doble de casillas que los cracks. Si la bocha para en tu ficha, el jugador sale bastante mejor. Podés rechazarlo y quedarte con +5 de presupuesto.

**4. Decisiones.** Dos situaciones. Ninguna opción es gratis: lo que ganás en una variable lo pagás en otra.

**5. Planteo.** La pantalla más importante. Explicada abajo.

**6. Resultado.** El partido que definió tu año, más la tabla completa de la temporada.

**7. Cierre.** Ascensos, ofertas de clubes, crecimiento del estadio, o el despido.

## Cómo leer la pizarra

Es una sola cancha con los dos equipos:

- **Círculos rojos huecos, nombre arriba:** el rival. Su sistema está fijo, no lo podés cambiar.
- **Círculos verdes llenos, nombre abajo:** tu equipo.
- **El número dentro del círculo** es el nivel de ese jugador.
- **Borde ámbar:** jugador que moviste de su posición original.

La cancha está dividida en **nueve sectores**. Cada uno muestra `los tuyos v los de ellos`. Los arqueros no cuentan.

- **Verde:** ahí te sobra gente.
- **Rojo:** ahí te falta.
- **Gris:** están parejos.

### Qué hacer con eso

Tocá los sistemas de abajo y mirá cómo se reacomoda tu equipo sobre el de ellos. Los números cambian solos.

Después, **arrastrá jugadores** para corregir lo que no te cierra. Podés abrir un extremo contra el lateral, meter un volante por dentro, adelantar la línea.

**Ojo con la trampa.** Amontonar gente no sirve. Ejemplo real de un 4-4-2 contra un 4-3-3:

| | Banda izq. | Centro | Banda der. |
|---|---|---|---|
| Sin tocar nada | 1v2 | 2v1 | 1v2 |
| Cerrando los dos volantes | 0v2 | **4v1** | 0v2 |

Ganás cuatro sectores y perdés cuatro. El multiplicador queda igual. Para sacar ventaja neta tenés que mover a **alguien puntual** donde el rival dejó un hueco, no llevar a todos al mismo lado.

El texto debajo de la cancha traduce lo que estás viendo, y se actualiza mientras arrastrás.

## Cómo se resuelve la temporada

```
Nivel de tu once con el sistema elegido
  × qué tan bien le queda tu modelo de juego a ese sistema
  × qué le ganás o le perdés al sistema del rival
  × tu sistema de cabecera + cómo los paraste en la pizarra
  × cohesión del vestuario
  + empuje de la tribuna
  + azar (nunca más de 8 puntos)
```

El azar está topeado a ±8, así que el swing máximo entre dos DTs es de 16 puntos. **Ninguna diferencia de lectura mayor a eso puede darse vuelta por suerte.** Cuando están parejos, el juego te avisa que el azar podía decidir.

| Diferencia final | Cierre | Puntos |
|---|---|---|
| ≥ +12 | Campeón | 10 |
| ≥ +5 | Subcampeón | 7 |
| ≥ −2 | Mitad de tabla | 4 |
| ≥ −10 | Zona baja | 1 |
| < −10 | Pelea el descenso | 0 |

## La carrera desde formativas

Si elegís un club grande, entrás por Séptima. El camino es:

**Séptima → Quinta → Sub-19 → Primera**

Salir campeón te sube **dos** categorías de una; ganar por paliza, tres. Subcampeón, una. Al ascender elegís **hasta dos pibes** para llevarte, y suben con +3 de nivel.

Si elegís un club chico, arrancás en Primera directamente. Ese es el sacrificio: techo bajo pero primer equipo ya.

## El final

Score = 70% puntos de carrera + 30% promedio de tus cuatro variables.

| Nota | Score |
|---|---|
| S | 88+ |
| A | 74+ |
| B | 58+ |
| C | 42+ |
| D | menos de 42 |

El apodo sale del eje que más movieron tus decisiones, más un sufijo por tu comportamiento táctico.

---

# PARTE 2 — CÓMO SE MODIFICA

Todo está en un solo archivo HTML. Abrilo con cualquier editor de texto y buscá los bloques marcados con comentarios.

## Poner los escudos oficiales

1. Conseguí los PNG (fondo transparente, cuadrados, 128×128 o más).
2. Guardalos en `escudos/` con el nombre exacto que figura en `escudos/LEEME.md`. Por ejemplo: `penarol.png`, `boca-juniors.png`, `seleccion-uruguay.png`.
3. Listo. Si falta alguno, ese club usa el escudo generado y no se rompe nada.

Para volver a los escudos generados en todos lados, buscá esta línea y ponela en `false`:

```js
const USAR_ESCUDOS_REALES = true;
```

**Nota legal:** los escudos son marcas registradas. Para un prototipo o portfolio no suele pasar nada; si el juego monetiza o escala, los clubes pueden reclamar. La decisión es tuya.

## Agregar o cambiar clubes

Buscá `const LIGAS={`. Cada club es una línea:

```js
{n:"Peñarol", niv:5, c:["#F5C518","#111111"]},
```

- `n`: nombre exacto (define el nombre del archivo de escudo).
- `niv`: nivel del club de 1 a 5. Define el nivel del plantel y qué ofertas te llegan.
- `c`: los dos colores, para el escudo generado.

Para agregar una liga nueva, copiá el bloque de un país y cambiá `liga` (nombre del campeonato) y `conf` (`sudamerica`, `europa`, `concacaf` o `asia`, define la copa continental).

## Cambiar los nombres de los jugadores

Buscá `const NOMBRES={`. Cada país tiene dos listas: `n` (nombres) y `a` (apellidos). Agregá o sacá los que quieras.

Los países sin liga propia (Colombia, Chile, Perú) se mapean en `ALIAS_NOM`.

## Editar las decisiones

Buscá `const POOL=`. Cada situación tiene esta forma:

```js
["Vestuario",
 "Texto de la situación que ve el jugador.",
 [["Texto de la opción", Resultados, Directiva, Hinchada, Vestuario, "nota interna"],
  ["Otra opción", 0, 1, -1, 2, "nota interna"]]]
```

Los cuatro números van de −3 a +3. La nota interna se muestra después de elegir, como comentario de lo que pasó.

La versión editable en planilla está en `Pool_Decisiones_Carrera_DT.xlsx`, con control automático de balance por variable.

**Para que una opción no aparezca en formativas**, el filtro busca palabras clave. Está en la función `opcionesValidas()`.

## Tocar el balance táctico

Los tres bloques del Excel `Sistema_Tactico_Carrera_DT.xlsx` están replicados tal cual en el código:

```js
const PESOS = {...}     // Capa A1: cuánto potencia cada sistema a cada atributo
const FIT = {...}       // Capa A2: qué tan bien le queda cada modelo a cada sistema
const MATCHUP = {...}   // Capa B: qué le gana cada sistema a cada sistema
```

Si tocás un número en el Excel, cambialo también acá y viceversa. **La matriz de matchup debe seguir siendo antisimétrica**: cada par tiene que sumar 2.00 (si A contra B es 1.06, B contra A tiene que ser 0.94). El Excel tiene un control automático de esto.

## Ajustar cuánta suerte hay

```js
const TOPE_AZAR = 8;
```

Subirlo hace el juego más caótico; bajarlo lo vuelve puro conocimiento táctico. El swing máximo entre dos DTs es el doble de este número.

## Cambiar la duración de la carrera

```js
const TEMPORADAS = 6;
```

Si lo bajás, revisá el ritmo de ascenso desde formativas: con menos de 5 temporadas puede no dar el tiempo de llegar a Primera.

## Agregar un sistema nuevo

Hay que tocar cuatro lugares:

1. `FORMACIONES`: agregar el nombre.
2. `PESOS`: sus cuatro ponderadores.
3. `FIT`: su fit con los cuatro modelos de juego.
4. `MATCHUP`: su fila completa **y** su columna en todas las demás filas, respetando la antisimetría.
5. `ONCE`: las once posiciones, cada una `["ROL", x, y]` con coordenadas de 0 a 100. `y=0` es tu arco, `y=100` el arco rival.
6. `ZONAS`: cuántos hombres pone en defensa, medio y ataque (tiene que sumar 10, sin el arquero).

Los roles disponibles están en `const ROL={...}` con su aporte a cada atributo.

## Modo duelo

El motor ya es determinístico por semilla. Estas son las funciones:

```js
hashSemilla(codigo)   // convierte el código en número
mulberry32(semilla)   // generador
S.rng                 // todas las tiradas del juego salen de acá
```

Mismo código, mismas situaciones, mismas cartas, mismo azar. Verificado. Falta sólo la pantalla de sala.

## Probar cambios sin jugar a mano

El motor corre en Node sin navegador. Con eso podés simular cientos de carreras y ver si un cambio de balance rompió algo:

```bash
node -e "
const fs=require('fs');
let js=fs.readFileSync('carrera-de-dt.html','utf8')
  .split('<script>')[1].split('</script>')[0].replace(/\nportada\(\);\n/,'\n');
const stub={style:{},classList:{add:()=>{},remove:()=>{}},querySelectorAll:()=>[],addEventListener:()=>{},dataset:{}};
global.window={matchMedia:()=>({matches:true}),scrollTo:()=>{}};
global.document={querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,
  createElement:()=>stub,body:{appendChild:()=>{},removeChild:()=>{}}};
global.navigator={};global.setInterval=()=>0;global.clearInterval=()=>{};global.setTimeout=(f)=>{f();return 0};
eval(js + fs.readFileSync('mi-prueba.js','utf8'));
"
```

Y en `mi-prueba.js` ya tenés disponibles todas las funciones del juego: `generarPlantel`, `armarOnce`, `atributosDe`, `resolver`, `conteos`, `ajustePosicional`, etc.

---

## Archivos del proyecto

| Archivo | Qué es |
|---|---|
| `carrera-de-dt.html` | El juego completo. Un solo archivo, sin dependencias. |
| `escudos/LEEME.md` | Los 98 nombres de archivo de escudo que el juego busca. |
| `escudos/escudos.json` | El mismo mapeo, en formato de datos. |
| `GDD_Carrera_de_DT_v3.md` | El documento de diseño. |
| `Sistema_Tactico_Carrera_DT.xlsx` | Las tres capas tácticas, editables, con test de balance. |
| `Pool_Decisiones_Carrera_DT.xlsx` | Las 60 decisiones, editables, con control de balance. |

## Qué revisar antes de publicar

- [ ] Reescribir los textos de las 60 decisiones con tu voz.
- [ ] Decidir qué hacer con los escudos.
- [ ] Sumar situaciones específicas de formativas (hoy el pool es mayormente de Primera).
- [ ] Endurecer el eje Vestuario en el pool: hoy suma +45 neto, se infla solo.
- [ ] Armar la pantalla de sala del modo duelo.
