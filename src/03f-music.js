/* ---------- music styles (120 BPM beat, or your microphone) + more styles ---------- */
function drawEQ(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, port = w < h, n = port ? 24 : 48, bw = w / n, kick = Math.pow(1 - (t * 2) % 1, 3), A = window.__aud, pal = ramp(C.slice(1), n), g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, C[0]); g.addColorStop(1, mix(C[0], C[4], .28)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const base = h * (port ? .64 : .62), mh = h * (port ? .3 : .38);
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1); let l = A ? clamp(A[Math.floor(f * 30)] * 1.15, .04, 1) : clamp(.16 + .5 * Math.pow(.5 + .5 * Math.sin(a * (1 + i % 5) + i * 1.7), 2) + .34 * kick * (1 - f) * (1 - f), 0, 1);
    const bh = Math.max(bw * .64, l * mh), x = i * bw + bw * .18;
    ctx.fillStyle = pal[i]; ctx.beginPath(); ctx.roundRect(x, base - bh, bw * .64, bh, bw * .32); ctx.fill();
    ctx.fillStyle = rgba(pal[i], .2); ctx.beginPath(); ctx.roundRect(x, base + bw * .2, bw * .64, bh * .55, bw * .32); ctx.fill();
  }
}
function drawPulse(ctx, w, h, d, t, o) {
  const C = d.colors, A = window.__aud, kick = A ? clamp((A[0] + A[1] + A[2] + A[3]) / 4 * 1.3, 0, 1) : Math.pow(1 - (t * 2) % 1, 3), m = Math.min(w, h), cx = w / 2, cy = h * (w < h ? .56 : .5), Rm = Math.hypot(w, h) * .5, pal = ramp(C.slice(1), 8);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let j = 7; j >= 0; j--) { const u = (((t * 2 + j) % 8) + 8) % 8 / 8, r = u * Rm * (1 + .03 * kick); ctx.strokeStyle = rgba(pal[j], clamp(1 - u, 0, 1) * .9); ctx.lineWidth = Math.max(2, m * .02 * (1 - u * .6) * (1 + kick * .5)); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); }
  const R0 = m * .12 * (1 + .28 * kick), g = ctx.createRadialGradient(cx - R0 * .3, cy - R0 * .3, R0 * .1, cx, cy, R0); g.addColorStop(0, C[2]); g.addColorStop(1, C[1]);
  ctx.save(); ctx.shadowColor = C[1]; ctx.shadowBlur = m * .06 * (1 + kick); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.fill(); ctx.restore();
}
function drawVinyl(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, A = window.__aud, kick = A ? clamp((A[0] + A[1] + A[2]) / 3 * 1.3, 0, 1) : Math.pow(1 - (t * 2) % 1, 3), m = Math.min(w, h), cx = w / 2, cy = h * (w < h ? .58 : .5), R = m * (w < h ? .46 : .42) * (1 + .012 * kick);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); const gl = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R * 1.5); gl.addColorStop(0, rgba(C[1], .35 + .25 * kick)); gl.addColorStop(1, rgba(C[1], 0)); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a * 9); ctx.fillStyle = '#0c0c10'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill();
  for (let r = R * .42; r < R * .97; r += R * .035) { ctx.strokeStyle = 'rgba(255,255,255,' + (.05 + .04 * Math.sin(r * .5)) + ')'; ctx.lineWidth = Math.max(1, R * .004); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
  const sh = ctx.createConicGradient ? ctx.createConicGradient(0, 0, 0) : null; if (sh) { sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.08, 'rgba(255,255,255,.18)'); sh.addColorStop(.16, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); sh.addColorStop(.58, 'rgba(255,255,255,.18)'); sh.addColorStop(.66, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); }
  const lg = ctx.createLinearGradient(-R * .36, -R * .36, R * .36, R * .36); lg.addColorStop(0, C[2]); lg.addColorStop(.5, C[1]); lg.addColorStop(1, C[3]); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, R * .34, 0, 7); ctx.fill();
  ctx.fillStyle = rgba(C[0], .85); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(R * .2 * Math.cos(i * 2.094), R * .2 * Math.sin(i * 2.094), R * .035, 0, 7); ctx.fill(); }
  ctx.fillStyle = C[0]; ctx.beginPath(); ctx.arc(0, 0, R * .035, 0, 7); ctx.fill(); ctx.restore();
  ctx.strokeStyle = mix(C[0], '#ffffff', .6); ctx.lineWidth = Math.max(3, R * .028); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + R * 1.02, cy - R * .95); ctx.lineTo(cx + R * 1.02, cy - R * .2); ctx.lineTo(cx + R * .5, cy + R * .22); ctx.stroke(); ctx.fillStyle = C[4]; ctx.beginPath(); ctx.arc(cx + R * 1.02, cy - R * .95, R * .05, 0, 7); ctx.fill();
}
function drawWavebeat(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, A = window.__aud, kick = A ? clamp((A[0] + A[1] + A[2] + A[3]) / 4 * 1.3, 0, 1) : Math.pow(1 - (t * 2) % 1, 3), m = Math.max(w, h), n = 7, dark = lum(C[0]) < .45, st = Math.max(6, w / 160);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const c = C[1 + k % 4], base = h * (.34 + .5 * k / (n - 1)) , amp = h * (.05 + .035 * (n - k) / n) * (.45 + .75 * kick);
    ctx.beginPath(); for (let x = -st; x <= w + st; x += st) { const nx = x / w, env = Math.sin(Math.PI * clamp(nx, 0, 1)), y = base + env * amp * (Math.sin(nx * 14 + a * (k % 3 + 1) + k) + .5 * Math.sin(nx * 31 - a * 2 + k * 2) + .25 * Math.sin(nx * 57 + a * 3)); x <= -st + .1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.strokeStyle = rgba(c, .85); ctx.lineWidth = Math.max(2, m * .0035); ctx.stroke();
  }
  ctx.restore();
}
function drawMarble(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, asp = h / w, cw = clamp(Math.round(w / 4), 200, 560), ch = Math.round(cw * asp), pal = ramp([C[0], C[1], C[2], C[3], C[4], C[1]], 64).map(h2r), cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, s = d.seed * .37;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const u = x / cw, v = y / cw, q = Math.sin(u * 3.2 + a + Math.sin(v * 4.1 - a + s) * 1.2) * .5, r = Math.sin(v * 3.7 - a + Math.sin(u * 5.3 + a + s) * 1.1) * .5, f = .5 + .5 * Math.sin(6.5 * (u + q) + 4.5 * (v + r) + s), c = pal[Math.min(63, Math.floor(f * 64))], k = (y * cw + x) * 4;
    D[k] = c[0]; D[k + 1] = c[1]; D[k + 2] = c[2]; D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
}
function drawSunburst(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, N = 2 * (10 + Math.round(o.detail / 10)), cx = w / 2, cy = h * (w < h ? .56 : .5), Rm = Math.hypot(w, h);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.save(); ctx.translate(cx, cy); ctx.rotate(a * 2 / N);
  for (let i = 0; i < N; i++) { ctx.fillStyle = i % 2 ? C[2] : C[1]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, Rm, i * 2 * Math.PI / N, (i + 1) * 2 * Math.PI / N); ctx.closePath(); ctx.fill(); }
  ctx.restore(); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rm * .6); g.addColorStop(0, rgba(C[0], .0)); g.addColorStop(1, rgba(C[0], .75)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const R = Math.min(w, h) * .17; ctx.fillStyle = C[4]; ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, 7); ctx.fill(); ctx.fillStyle = C[3]; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.fillStyle = rgba('#ffffff', .35); ctx.beginPath(); ctx.arc(cx - R * .3, cy - R * .3, R * .35, 0, 7); ctx.fill();
}
function drawHexgrid(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, port = w < h, cols = port ? 8 : 16, r = w / cols / Math.sqrt(3), dx = Math.sqrt(3) * r, dy = 1.5 * r, rows = Math.ceil(h / dy) + 2, pal = ramp(C.slice(1).concat(C[1]), 64);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let j = -1; j < rows; j++) for (let i = -1; i <= cols; i++) {
    const x = (i + (j & 1 ? .5 : 0)) * dx, y = j * dy, dist = Math.hypot(x - w / 2, y - h / 2) / Math.min(w, h), p = .5 + .5 * Math.sin(a - dist * 7 + hash(i, j, d.seed) * .6), s = r * (.58 + .36 * p), idx = Math.floor((((dist * 24 + a / (2 * Math.PI) * 64) % 64) + 64) % 64);
    ctx.fillStyle = pal[idx]; ctx.globalAlpha = .35 + .65 * p; ctx.beginPath(); for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3; ctx.lineTo(x + Math.cos(an) * s, y + Math.sin(an) * s); } ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawOrbits(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.min(w, h), cx = w / 2, cy = h * (w < h ? .56 : .5), n = 5 + Math.round(o.detail / 25), dark = lum(C[0]) < .45;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .3); g.addColorStop(0, rgba(C[2], .7)); g.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C[3]; ctx.beginPath(); ctx.arc(cx, cy, m * .045, 0, 7); ctx.fill();
  for (let k = 0; k < n; k++) {
    const r = m * (.1 + .4 * (k + 1) / n) * (w < h ? 1 : 1), sp = (1 + Math.floor(R() * 3)) * (k % 2 ? -1 : 1), ph = R() * 6.28, c = C[1 + k % 4], pr = m * (.012 + R() * .018);
    ctx.strokeStyle = rgba(dark ? '#ffffff' : '#000000', .14); ctx.lineWidth = Math.max(1.5, m * .002); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    const x = cx + Math.cos(a * sp + ph) * r, y = cy + Math.sin(a * sp + ph) * r; ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = pr; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, pr, 0, 7); ctx.fill(); ctx.restore();
    if (k % 2 === 0) { ctx.fillStyle = rgba('#ffffff', .8); ctx.beginPath(); ctx.arc(x + Math.cos(a * 4 + ph) * pr * 2, y + Math.sin(a * 4 + ph) * pr * 2, pr * .3, 0, 7); ctx.fill(); }
  }
}
function drawConfetti(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 70 + Math.round(o.detail * 1.4), H = h + m * .1;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const s = m * (.008 + R() * .016), x0 = R() * w, y0 = R() * H, k = 1 + Math.floor(R() * 2), kx = 1 + Math.floor(R() * 2), ph = R() * 6.28, kr = 1 + Math.floor(R() * 3), ty = Math.floor(R() * 3), c = C[1 + i % 4];
    const x = x0 + Math.sin(a * kx + ph) * m * .02, y = (((y0 + t / 16 * k * H) % H) + H) % H - m * .05; ctx.save(); ctx.translate(x, y); ctx.rotate(a * kr + ph); ctx.fillStyle = c; ctx.beginPath();
    if (ty === 0) ctx.roundRect(-s, -s * .45, s * 2, s * .9, s * .2); else if (ty === 1) ctx.arc(0, 0, s * .6, 0, 7); else { ctx.moveTo(0, -s); ctx.lineTo(s * .9, s * .7); ctx.lineTo(-s * .9, s * .7); ctx.closePath(); }
    ctx.fill(); ctx.restore();
  }
}
function drawConstellation(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 46 + Math.round(o.detail * .5), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#05060c', .72), P = [];
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(base, '#000000', .3)); g.addColorStop(1, base); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) { const cx = .06 + .88 * R(), cy = .06 + .88 * R(), ax = .05 + .06 * R(), ay = .05 + .06 * R(), kx = 1 + Math.floor(R() * 2), ky = 1 + Math.floor(R() * 2), px = R() * 6.28, py = R() * 6.28; P.push([(cx + Math.sin(a * kx + px) * ax) * w, (cy + Math.cos(a * ky + py) * ay) * h, C[1 + i % 4], R()]); }
  const L = m * .14; ctx.lineWidth = Math.max(1.5, m * .0012);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dd = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]); if (dd < L) { ctx.strokeStyle = rgba(P[i][2], (1 - dd / L) * .6); ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke(); } }
  P.forEach(p => { const r = m * (.002 + p[3] * .005), gg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4); gg.addColorStop(0, rgba(p[2], .5)); gg.addColorStop(1, rgba(p[2], 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p[0], p[1], r * 4, 0, 7); ctx.fill(); ctx.fillStyle = mix(p[2], '#ffffff', .5); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); });
}
