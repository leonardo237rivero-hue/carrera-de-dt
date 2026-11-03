# v11 — identidad de club en las pantallas interiores

Preparada el 3 de noviembre de 2026 en la rama `arte-v11-interiores`, para revisión antes de publicar. La portada aprobada se conserva.

## Implementación

Las imágenes de los bocetos no se pegaron como pantallas fijas. El juego reconstruye la composición con HTML, CSS, SVG interactivo y arte separado. Los datos siguen siendo los de la partida.

- **Plantel:** pizarra con once real, nombres y rendimiento; selección de titular accesible por teclado; banco con retratos, disponibilidad y ficha detallada; cambios conectados con `S.fijos`; franja con los cuatro principios actuales. El rendimiento anunciado por accesibilidad coincide con la ficha, incluida la adaptación de puesto.
- **Plan:** pizarra junto a los principios y revisión del sistema, sin reiniciar la memoria del equipo. La vista del once en esta pantalla es informativa, sin controles de sustitución engañosos.
- **Vestuario:** habitación ilustrada neutra, bandera y escudo dinámicos, retratos pintados y camisetas recoloreadas con los colores de la base. Los nombres, edades, pistas y reacciones vienen de los jugadores que participan en la charla. Se conservan la secuencia de frases, el texto propio, el dictado opcional y su revisión.
- **Vivo:** escena del banco propia, marcador con ambos escudos y nombres, lectura táctica lateral, velocidad y pausa real del reloj. No se agregan resultados aleatorios por dibujar ni por pausar.
- **Entretiempo:** pizarra grande y órdenes con evidencia y coste. Se puede mostrar nombres o alternar con el dominio por zonas. El sector de la orden elegida se marca antes de confirmarla. Al volver, se aplica la orden al motor y reaparece la escena del banco.

## Identidad dinámica

`S.club.n` y `S.club.c` alimentan cabecera, sellos, bandera, camisetas, retratos, fichas y acentos. Los escudos pasan por el helper existente: PNG disponible o escudo SVG de respaldo. Los rivales usan su propia identidad. Los nombres salen de `S.plantel` y los onces calculados, sin conservar River del Sur, Acosta u otros datos ficticios de los bocetos.

El papel, la pizarra verde y la tipografía deportiva forman la identidad común del juego. El texto de cabecera se calcula en negro o blanco según contraste. El acento sobre papel se oscurece cuando un color del club sería ilegible. Las camisetas emplean patrones ilustrativos —rayas, banda o franja para algunos clubes, liso en el resto—; no se presentan como una reproducción del uniforme oficial de una temporada específica.

Los seis retratos reutilizables son personajes ilustrados, no fotografías ni retratos fieles de futbolistas reales. Pueden repetirse. El entrenador tiene un retrato pintado de la misma persona en cuatro etapas de edad: las canas y las arrugas avanzan con la carrera. Las etapas son aproximadas y no cambian la edad exacta registrada por el juego. Crear más variantes y expresiones es una ampliación de arte posible.

## Qué representa la pizarra

La pizarra dibuja el esquema del modelo y el once. No es un seguimiento de posiciones reales ni una simulación de agentes. Los números de las fichas son rendimiento, no dorsales oficiales. El borde discontinuo identifica al rival también cuando los colores se parecen. La vista de dominio conserva el cálculo previo de fuerzas y eventos por zonas.

La escena ilustrada del banco es ambientación; la información dinámica está en marcador, pizarra, estadísticas y relato del motor. No se dibujan movimientos inventados como si fueran eventos registrados. Las sustituciones durante el vivo que aparecían en el boceto permanecen fuera de esta entrega; no hay un botón que prometa esa mecánica.

## Compatibilidad y funcionamiento local

Se mantienen los guardados de pretemporada v10 y la misma estructura de reglas. El guardado nuevo identifica la versión 11. El service worker cambia a `cdt-v11-0-0` y precarga los componentes y los cinco archivos de arte utilizados. La descarga inicial crece por el arte PNG; los archivos se reutilizan desde cache. El dictado sigue dependiendo de soporte y servicio del navegador.

Para revisar: `node herramientas/servir.js 8767`, abrir `http://127.0.0.1:8767/`.

Para escenarios rápidos: `node herramientas/preparar-playtest.js`, abrir la URL que imprime. Su barra de pruebas permite cambiar de club y recorrer plantel, vestuario, entretiempo, tanda, gestión y plan. Este HTML generado está excluido de Git.

## Verificación

- `node herramientas/verificar-v10.js`: regresión de reglas, guardado, charlas, penales y 30 temporadas / 630 jornadas.
- `node herramientas/verificar-interiores.js`: contraste AA de cabecera y acento en los 88 clubes; componentes con Racing, Peñarol, River, Boca, Corinthians y Real Madrid; once, nombres, escudos, rivales y recursos; dibujar conserva el cursor RNG, el modelo y la memoria.
- Playtest de navegador: sustitución real desde el banco, selección de orden y regreso al segundo tiempo, pausa y reanudación, toggles de pizarra, identidad de clubes claros/oscuros y revisión a 390 px. Las capturas de revisión se guardan fuera del código en `Analisis_Carrera_DT/v11_revision`.
- Recorrido de carrera normal: primera temporada con Barcelona, arenga propia, partido importante ante Atlético con intervención al descanso, simulación rápida ante Real Madrid, cierre de temporada y pase a Peñarol. Se comprobó el cambio de edad de 49 a 50 años y la identidad del nuevo club. La revisión móvil se hizo en navegador de escritorio; queda pendiente probar en un teléfono físico.

En el recorrido se corrigieron dos fallos heredados: los editores de voz ocultos podían duplicar IDs y etiquetas entre prensa y arenga; ahora se retiran al cambiar de pantalla. El selector de goleador podía atribuir un contraataque a un arquero; los autores de goles de campo se seleccionan entre jugadores de campo. La prueba incluye mil selecciones sin asignar un gol al arquero.

El aspecto y las interacciones deben revisarse con el usuario antes de subir esta rama a la versión pública.
