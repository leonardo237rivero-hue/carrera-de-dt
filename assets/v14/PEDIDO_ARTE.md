# Pedido de arte v14 — para ChatGPT

El código ya está listo: cada imagen se usa sola en cuanto el archivo existe en `assets/v14/` con el nombre exacto. Si falta, el juego muestra un fondo dibujado con código. No hay que tocar JS ni CSS.

## Reglas (las mismas del estilo "Cine de cancha", ver `assets/cine/PROMPTS.md`)
- Fotorrealista, luz cinematográfica, hora azul después de lluvia, focos cálidos. Instalaciones modestas del fútbol rioplatense, no estadios de lujo.
- Arquitectura gris carbón neutra. Verde solo en el césped. Sin colores de ningún club: los colores los pone la interfaz.
- Sin texto, sin logos, sin escudos, sin marcas de agua.
- Fondos: sin personas ni caras. Retratos: una persona ficticia, que no se parezca a ningún entrenador real.
- Formato JPG, calidad ~82, menos de 400 KB cada una.

## Fondos (1672 × 941, horizontal)
| Archivo | Dónde se ve | Qué es |
|---|---|---|
| `sala.jpg` | Entrevista con el presidente | Sala de reuniones vacía de un club modesto, vista desde la silla del candidato: mesa larga de madera oscura, dos sillas enfrente, ventana al fondo con la cancha iluminada. El tercio inferior en sombra (ahí va texto blanco). |
| `practica.jpg` | Presentación al plantel | Cancha de entrenamiento vacía a la mañana, a la altura de los ojos del DT: conos, pelotas en una red, arco chico, bruma baja. Tercio inferior oscuro. |
| `diario.jpg` | Crónica de la temporada | Mesa de bar con un diario doblado SIN texto legible (columnas borrosas), un pocillo de café, luz de ventana. El motivo a la DERECHA; la mitad izquierda oscura y lisa. |
| `llamada.jpg` | "A callar bocas" (te llama el club que te rechazó) | Escritorio de DT de noche: un celular boca arriba con la pantalla encendida (sin texto ni íconos), pizarra táctica borrosa atrás. El motivo a la DERECHA; mitad izquierda oscura. |

## Retratos del DT (768 × 768, cuadrado)
La misma persona ficticia en cuatro edades, busto, de frente o tres cuartos, campera deportiva gris carbón sin marcas, fondo neutro oscuro desenfocado, expresión serena.
| Archivo | Edad |
|---|---|
| `dt-joven.jpg` | unos 29 años |
| `dt-medio.jpg` | unos 38 |
| `dt-maduro.jpg` | unos 48, primeras canas |
| `dt-veterano.jpg` | unos 58, canoso |

## Entrega
Guardar los 8 archivos en `assets/v14/` del repo `carrera-de-dt` con esos nombres, hacer commit y push. Nada más.
