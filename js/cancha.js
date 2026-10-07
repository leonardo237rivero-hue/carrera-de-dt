// Carrera de DT — cancha en perspectiva (estética v7)
// Una sola cámara para la portada, "Tu idea de juego" y los momentos del partido.
// Coordenadas de juego: x 0-100 (izquierda a derecha), Y 0-100 (de tu arco al del rival).

const CANCHA_K = 0.85;            // cuánto se achica la cancha hacia el fondo
const NEON = "#A6F03C", NEON_SOMBRA = "#4C7A16", RIVAL = "#E9EEF0", RIVAL_SOMBRA = "#8E989C";

// camara({ancho, top, bot, hw, y0, y1}) → P(x,Y) = {x, y, s}  (s = escala por profundidad)
function camara(o){
  const y0 = o.y0 || 0, y1 = o.y1 == null ? 100 : o.y1, cx = o.ancho / 2;
  return (x, Y) => {
    const t = (Y - y0) / (y1 - y0), s = 1 / (1 + CANCHA_K * t), g = t * (1 + CANCHA_K) * s;
    return { x: cx + (x - 50) / 50 * o.hw * s, y: o.bot - (o.bot - o.top) * g, s };
  };
}
const _r = n => Math.round(n * 10) / 10;
function poliD(P, pts){ return pts.map((p, i) => { const q = P(p[0], p[1]); return (i ? "L" : "M") + _r(q.x) + " " + _r(q.y); }).join(" ") + " Z"; }
function segD(P, a, b, recorteA, recorteB){
  const p = P(a[0], a[1]), q = P(b[0], b[1]);
  const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1, u = (recorteA || 0) / L, v = (recorteB || 0) / L;
  return `M${_r(p.x + dx * u)} ${_r(p.y + dy * u)} L${_r(q.x - dx * v)} ${_r(q.y - dy * v)}`;
}
// pasto, franjas y líneas reglamentarias (proporciones de una cancha de 105 × 68)
function canchaFondo(P, o){
  o = o || {};
  const y0 = (o.y0 || 0) - 8, y1 = (o.y1 == null ? 100 : o.y1) + 6, paso = o.franja || 7;
  let franjas = "";
  for (let y = Math.floor(y0 / (paso * 2)) * paso * 2; y < y1; y += paso * 2) franjas += poliD(P, [[-25, y], [125, y], [125, y + paso], [-25, y + paso]]) + " ";
  const circ = []; for (let a = 0; a <= 36; a++) circ.push([50 + 13.5 * Math.cos(a / 36 * Math.PI * 2), 50 + 8.7 * Math.sin(a / 36 * Math.PI * 2)]);
  const lineas = [poliD(P, [[0, 0], [100, 0], [100, 100], [0, 100]]), segD(P, [0, 50], [100, 50]), poliD(P, circ),
    poliD(P, [[20.5, 0], [79.5, 0], [79.5, 15.7], [20.5, 15.7]]), poliD(P, [[36.5, 0], [63.5, 0], [63.5, 5.2], [36.5, 5.2]]),
    poliD(P, [[20.5, 100], [79.5, 100], [79.5, 84.3], [20.5, 84.3]]), poliD(P, [[36.5, 100], [63.5, 100], [63.5, 94.8], [36.5, 94.8]])].join(" ");
  const tercios = o.tercios ? `<path d="${segD(P, [0, 33.3], [100, 33.3])} ${segD(P, [0, 66.6], [100, 66.6])}" stroke="rgba(222,255,210,.16)" stroke-width="1.2" stroke-dasharray="4 7" fill="none"/>` : "";
  return `<path d="${poliD(P, [[-25, y0], [125, y0], [125, y1], [-25, y1]])}" fill="#0D1F15"/>
    <path d="${franjas}" fill="#11281B"/>
    <path d="${lineas}" fill="none" stroke="rgba(222,255,210,.20)" stroke-width="1.4"/>${tercios}`;
}
// viñeta: funde los bordes de la cancha con el fondo
function canchaVineta(id, W, H){
  return `<defs><radialGradient id="${id}" cx="50%" cy="52%" r="62%"><stop offset="72%" stop-color="#070D0A" stop-opacity="0"/><stop offset="100%" stop-color="#070D0A" stop-opacity=".95"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#${id})" pointer-events="none"/>`;
}
// escala visual de la ficha según profundidad (achica menos que la cancha para que se lea)
const escFicha = s => 0.5 + 0.5 * s;
// ficha tipo disco, dibujada en el origen (se posiciona con transform)
// o: {rival, pelota, etiqueta, sub, color:{fill,sombra,txt}}
function fichaSVG(o){
  o = o || {};
  const fill = o.color ? o.color.fill : o.rival ? RIVAL : NEON;
  const sombra = o.color ? o.color.sombra : o.rival ? RIVAL_SOMBRA : NEON_SOMBRA;
  const brillo = o.rival ? "" : `<ellipse rx="19" ry="12" fill="${fill}" opacity=".18"/>`;
  const anillo = o.pelota ? `<ellipse rx="16.5" ry="10.4" fill="none" stroke="#F2F5EE" stroke-width="2"/>` : "";
  const et = o.etiqueta ? (() => {
    const w = Math.max(22, String(o.etiqueta).length * 6.4 + 10);
    return `<g transform="translate(0,-22)"><rect x="${-w / 2}" y="-8" width="${w}" height="15" rx="3" fill="rgba(7,13,10,.86)" stroke="${o.rival ? "rgba(233,238,240,.5)" : "rgba(166,240,60,.5)"}"/>
      <text y="3.5" text-anchor="middle" class="ficha-et" fill="${o.rival ? "#E9EEF0" : "#EAF7D9"}">${o.etiqueta}</text></g>`;
  })() : "";
  const sub = o.sub ? `<text y="22" text-anchor="middle" class="ficha-sub">${o.sub}</text>` : "";
  return `${brillo}<ellipse cy="3" rx="13" ry="8.2" fill="${sombra}"/>
    <ellipse rx="13" ry="8.2" fill="${fill}"/>
    <ellipse rx="10.4" ry="6.3" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2.2"/>${anillo}${et}${sub}`;
}
// posición de una ficha: transform CSS (permite transiciones entre fases)
function fichaTransform(P, x, Y){ const q = P(x, Y); return `translate(${_r(q.x)}px,${_r(q.y)}px) scale(${escFicha(q.s).toFixed(3)})`; }

// triángulos tácticos por sistema (índices de ONCE[f]); el primero es el activo
const TRIANGULOS = {
  "4-3-3": [[6, 5, 7], [1, 6, 8], [4, 7, 10], [2, 5, 3]],
  "4-2-3-1": [[5, 8, 6], [1, 5, 7], [4, 6, 9], [7, 8, 10]],
  "4-4-2": [[1, 5, 6], [4, 8, 7]],
  "3-5-2 / 5-3-2": [[5, 6, 7], [1, 4, 5], [3, 8, 7], [5, 9, 7]],
  "3-4-3": [[5, 9, 6], [4, 5, 8], [7, 6, 10], [1, 2, 5]]
};
// el vértice del triángulo activo que tiene la pelota (el más retrasado)
function pelotaTriangulo(f, pts){
  const t = (TRIANGULOS[f] || [])[0]; if(!t) return null;
  return t.map(i => pts[i]).sort((a, b) => a.Y - b.Y)[0];
}
function triangulosSVG(P, f, pts, anim){
  return (TRIANGULOS[f] || []).map((t, k) => {
    const d = poliD(P, t.map(i => [pts[i].x, pts[i].Y]));
    return k === 0
      ? `<path d="${d}" class="${anim ? "tri-activo" : ""}" fill="rgba(166,240,60,.24)" stroke="${NEON}" stroke-width="2.4" stroke-linejoin="round"/>`
      : `<path d="${d}" class="${anim ? "tri" : ""}" style="${anim ? `animation-delay:${(k * 0.9).toFixed(1)}s` : ""}" fill="rgba(166,240,60,.09)" stroke="rgba(166,240,60,.55)" stroke-width="1.4" stroke-linejoin="round"/>`;
  }).join("");
}
// etiqueta con flechita (como los carteles de la referencia), en coordenadas de pantalla
// centrado:true → caja centrada en el punto, sin flechita (para ponerla dentro de una zona)
function cartelSVG(x, y, texto, centrado){
  const w = texto.length * 7.2 + 18;
  if(centrado){ const wc = texto.length * 6 + 14;
    return `<g transform="translate(${_r(x)},${_r(y)})" class="cartel"><rect x="${-wc / 2}" y="-8" width="${wc}" height="16" rx="3" fill="#0B1710" stroke="${NEON}" stroke-width="1.3"/>
    <text y="3.8" text-anchor="middle" class="cartel-txt" style="font-size:10.5px">${texto}</text></g>`; }
  return `<g transform="translate(${_r(x)},${_r(y)})" class="cartel"><rect x="${-w / 2}" y="-30" width="${w}" height="21" rx="4" fill="#0B1710" stroke="${NEON}" stroke-width="1.5"/>
    <path d="M-6 -9.5 L6 -9.5 L0 -2 Z" fill="${NEON}"/>
    <text y="-15.5" text-anchor="middle" class="cartel-txt">${texto}</text></g>`;
}
