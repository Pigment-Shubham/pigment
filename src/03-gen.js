/* ---------- utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const MEM = {};
const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in MEM ? MEM[k] : d; } }, set(k, v) { MEM[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const h2r = h => { h = h.replace('#', ''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const r2h = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const rgba = (h, a) => { const [r, g, b] = h2r(h); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
const mix = (a, b, t) => { const A = h2r(a), B = h2r(b); return r2h(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
const lum = h => { const [r, g, b] = h2r(h); return (.2126 * r + .7152 * g + .0722 * b) / 255; };
function ramp(stops, n) { const out = []; for (let i = 0; i < n; i++) { const t = i / (n - 1) * (stops.length - 1), k = Math.min(Math.floor(t), stops.length - 2); out.push(mix(stops[k], stops[k + 1], t - k)); } return out; }
function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(x, y, s) { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 982451653) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function makeCanvas(w, h, cls) { const c = document.createElement('canvas'); c.width = w; c.height = h; if (cls) c.className = cls; return c; }
let GRAIN = null;
function grainTile() {
  if (GRAIN) return GRAIN; const c = makeCanvas(256, 256), x = c.getContext('2d'), id = x.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  x.putImageData(id, 0, 0); return GRAIN = c;
}

/* ---------- the five styles ---------- */
function drawGrain(ctx, w, h, d, t, o) {
  const a16 = t / 16 * Math.PI * 2, C = d.colors, R = rng(d.seed), m = Math.max(w, h), n = 4 + Math.round(o.detail / 22);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const c = C[1 + i % 4], x = (.05 + .9 * R() + Math.sin(a16 + i * 2.1) * .05) * w, y = (.05 + .9 * R() + Math.cos(a16 + i * 1.7) * .05) * h, r = m * (.28 + R() * .3);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .95)); g.addColorStop(.6, rgba(c, .45)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  const k = o.grain / 100; if (k <= 0) return;
  const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900)));
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = Math.min(1, k * .6); ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = k * .35; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawRidges(ctx, w, h, d, t, o) {
  const a16 = t / 16 * Math.PI * 2, C = d.colors, n = 30 + Math.round(o.detail * .35), top = h * .16, bot = h * .86, cols = ramp(C.slice(1), n), seed = d.seed;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1.6, h * .0034);
  const step = Math.max(2, w / 150);
  for (let i = 0; i < n; i++) {
    const p = i / (n - 1), y0 = top + (bot - top) * p; ctx.beginPath();
    for (let x = 0; x <= w + step; x += step) {
      const nx = x / w, env = Math.exp(-Math.pow((nx - .5) / .3, 2)), amp = h * .16 * (.25 + .75 * env) * (.75 + p * .5), v = vnoise(nx * 5 + Math.cos(a16) * 1.3, p * 2.4 + Math.sin(a16) * 1.3, seed);
      const y = y0 - amp * Math.pow(v, 1.4) * 1.5; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.save(); ctx.lineTo(w + step, h * 1.2); ctx.lineTo(0, h * 1.2); ctx.closePath(); ctx.fillStyle = C[0]; ctx.fill(); ctx.restore();
    ctx.strokeStyle = cols[i]; ctx.beginPath();
    for (let x = 0; x <= w + step; x += step) { const nx = x / w, env = Math.exp(-Math.pow((nx - .5) / .3, 2)), amp = h * .16 * (.25 + .75 * env) * (.75 + p * .5), v = vnoise(nx * 5 + Math.cos(a16) * 1.3, p * 2.4 + Math.sin(a16) * 1.3, seed), y = y0 - amp * Math.pow(v, 1.4) * 1.5; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }
}
function drawDunes(ctx, w, h, d, t, o) {
  const a16 = t / 16 * Math.PI * 2, C = d.colors, L = 4 + Math.round(o.detail / 40), m = Math.max(w, h), dark = lum(C[0]) < .4;
  const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, C[0]); sky.addColorStop(1, mix(C[0], C[2], dark ? .35 : .5)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const sx = w * (.5 + .18 * Math.sin(d.seed)), sy = h * .3, sr = m * .13, sg = ctx.createRadialGradient(sx, sy, sr * .6, sx, sy, sr * 2.2);
  sg.addColorStop(0, rgba(C[3], .35)); sg.addColorStop(1, rgba(C[3], 0)); ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C[3]; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill();
  for (let i = 0; i < L; i++) {
    const base = h * (.4 + i * (.5 / L)), amp = h * .05 * (1 + i * .22), ph = d.seed * 3 + i * 1.7 + a16 * (1 + (i % 2)), col = mix(C[1 + (i % 4)], dark ? '#000000' : C[0], .06 + (L - 1 - i) * .05);
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w + 6; x += Math.max(3, w / 160)) { const nx = x / w; ctx.lineTo(x, base + Math.sin(nx * (2 + i * .7) + ph) * amp + Math.sin(nx * (5.3 + i) + d.seed * 4.2 + i * 2.4 + a16 * (1 + ((i + 1) % 2))) * amp * .32); }
    ctx.lineTo(w, h); ctx.closePath();
    const g = ctx.createLinearGradient(0, base - amp, 0, base + amp * 3); g.addColorStop(0, col); g.addColorStop(1, mix(col, dark ? '#000000' : '#ffffff', dark ? .35 : .15)); ctx.fillStyle = g; ctx.fill();
  }
}
function drawHalftone(ctx, w, h, d, t, o) {
  const C = d.colors, m = Math.max(w, h), cell = m / (26 + o.detail * .45), pal = ramp(C.slice(1), 40);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  const a = t / 16 * Math.PI * 2, cx = w * (.5 + .2 * Math.cos(a)), cy = h * (.45 + .14 * Math.sin(a)), maxd = Math.hypot(w, h) * .55;
  for (let y = cell / 2; y < h + cell; y += cell) for (let x = cell / 2; x < w + cell; x += cell) {
    const dist = Math.hypot(x - cx, y - cy) / maxd, v = clamp(1 - dist + (vnoise(x / w * 3, y / h * 3, d.seed) - .5) * .5 + .12 * Math.sin(a * 3 + dist * 9), 0, 1);
    if (v < .03) continue; ctx.fillStyle = pal[Math.floor(v * 39)]; ctx.beginPath(); ctx.arc(x, y, cell * .53 * Math.pow(v, .75), 0, 7); ctx.fill();
  }
}
function drawShapes(ctx, w, h, d, t, o) {
  const C = d.colors, R = rng(d.seed), cols = (w < h ? 2 : 3) + Math.round(o.detail / 40), cell = w / cols, rows = Math.ceil(h / cell) + 1, oy = (h - rows * cell) / 2, P = Math.PI;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * cell, y = oy + r * cell, bi = Math.floor(R() * 5); let fi = Math.floor(R() * 5); if (fi === bi) fi = (fi + 1) % 5;
    const bg = C[bi], fg = C[fi], k = Math.floor(R() * 4), type = Math.floor(R() * 6), cx = x + cell / 2, cy = y + cell / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, cell, cell); ctx.clip(); ctx.fillStyle = bg; ctx.fillRect(x, y, cell, cell); ctx.fillStyle = fg; ctx.beginPath();
    if (type === 0) ctx.arc(cx, cy, cell * .38, 0, 7);
    else if (type === 1) { ctx.arc(cx, cy, cell * .46, k * P / 2, k * P / 2 + P); }
    else if (type === 2) { const ox = k % 2 ? x + cell : x, oy2 = k > 1 ? y + cell : y; ctx.moveTo(ox, oy2); ctx.arc(ox, oy2, cell, 0, 7); }
    else if (type === 3) { for (let s = 0; s < 3; s++) { if (k % 2) ctx.rect(x + cell * (.1 + s * .3), y, cell * .18, cell); else ctx.rect(x, y + cell * (.1 + s * .3), cell, cell * .18); } }
    else if (type === 4) { ctx.arc(cx, cy, cell * .42, 0, 7); ctx.fill(); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, cell * .2, 0, 7); }
    else { if (k % 2) { ctx.moveTo(x, y); ctx.lineTo(x + cell, y + cell); ctx.lineTo(x, y + cell); } else { ctx.moveTo(x + cell, y); ctx.lineTo(x, y + cell); ctx.lineTo(x + cell, y + cell); } ctx.closePath(); }
    ctx.fill(); ctx.restore();
  }
}
