/* ---------- eleven more styles. Every live one repeats exactly every 16 seconds. ---------- */
function drawAurora(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, dark = lum(C[0]) < .45, n = 3 + Math.round(o.detail / 34), step = Math.ceil(w / 400);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < n; k++) {
    const c = C[1 + k % 4], ph = d.seed + k * 1.9, hk = 1 + (k % 2);
    for (let x = 0; x < w + step; x += step) {
      const nx = x / w, y0 = h * (.16 + .09 * k) + Math.sin(nx * (2.2 + k * .5) + a * hk + ph) * h * .09 + Math.sin(nx * 6.1 - a * (1 + (k + 1) % 2) + ph * 2) * h * .03, len = h * (.38 + .14 * Math.sin(nx * 4.1 + a * hk + ph * 1.7));
      const g = ctx.createLinearGradient(0, y0, 0, y0 + len); g.addColorStop(0, rgba(c, 0)); g.addColorStop(.28, rgba(c, dark ? .55 : .45)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(x, y0, step, len);
    }
  }
  ctx.restore();
}
function drawRipples(ctx, w, h, d, t, o) {
  const C = d.colors, f = (t / 16 * 3) % 1, R = rng(d.seed), m = Math.max(w, h), N = 10 + Math.round(o.detail / 8), sp = m * .9 / N, pal = ramp(C.slice(1), 40);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  [[.3 + .4 * R(), .3 + .4 * R()], [.3 + .4 * R(), .3 + .4 * R()]].forEach((s, si) => {
    for (let k = N + 2; k >= 0; k--) {
      const r = (k + f) * sp, u = r / (m * .95); if (u > 1.05) continue;
      ctx.strokeStyle = rgba(pal[Math.min(39, Math.floor(clamp(u, 0, 1) * 39 + si * 6) % 40)], clamp(1 - u, 0, 1) * Math.min(1, r / sp) * .95);
      ctx.lineWidth = Math.max(1.5, sp * .24 * (1 - u * .6)); ctx.beginPath(); ctx.arc(s[0] * w, s[1] * h, r, 0, 7); ctx.stroke();
    }
  });
}
function drawContours(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), cols = Math.round(44 + o.detail * .5), cw = w / cols, rows = Math.ceil(h / cw), ch = h / rows, ox = Math.cos(a) * 1.3, oy = Math.sin(a) * 1.3, F = [];
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const px = i * cw / m * 3.2, py = j * ch / m * 3.2; F[j * (cols + 1) + i] = .65 * vnoise(px + ox, py + oy, d.seed) + .35 * vnoise(px * 2.3 + oy, py * 2.3 - ox, d.seed + 1); }
  const L = 8 + Math.round(o.detail / 12), pal = ramp(C.slice(1), L), SEG = [[], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 3], [2, 1]], [[0, 2]], [[0, 3]], [[0, 3]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], []];
  ctx.lineWidth = Math.max(1.4, m * .0019); ctx.lineCap = 'round';
  for (let l = 0; l < L; l++) {
    const lv = .22 + .56 * l / (L - 1); ctx.strokeStyle = pal[l]; ctx.beginPath();
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const v00 = F[j * (cols + 1) + i], v10 = F[j * (cols + 1) + i + 1], v11 = F[(j + 1) * (cols + 1) + i + 1], v01 = F[(j + 1) * (cols + 1) + i], idx = (v00 > lv ? 8 : 0) | (v10 > lv ? 4 : 0) | (v11 > lv ? 2 : 0) | (v01 > lv ? 1 : 0);
      if (!idx || idx === 15) continue; const x0 = i * cw, y0 = j * ch;
      const E = e => e === 0 ? [x0 + (lv - v00) / (v10 - v00) * cw, y0] : e === 1 ? [x0 + cw, y0 + (lv - v10) / (v11 - v10) * ch] : e === 2 ? [x0 + (lv - v01) / (v11 - v01) * cw, y0 + ch] : [x0, y0 + (lv - v00) / (v01 - v00) * ch];
      SEG[idx].forEach(s => { const p = E(s[0]), q = E(s[1]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
    }
    ctx.stroke();
  }
}
function drawWaves(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, N = 22 + Math.round(o.detail * .3), pal = ramp(C.slice(1), N), step = Math.max(3, w / 180);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.lineWidth = Math.max(1.6, h * .0032); ctx.lineJoin = 'round';
  for (let i = 0; i < N; i++) {
    const p = i / (N - 1), y0 = h * (.12 + .76 * p), amp = h * .07 * (.5 + .5 * Math.sin(p * 3 + d.seed)); ctx.strokeStyle = pal[i]; ctx.beginPath();
    for (let x = 0; x <= w + step; x += step) { const nx = x / w, y = y0 + Math.sin(nx * 5 + a + i * .28 + d.seed) * amp + Math.sin(nx * 11 - a * 2 + i * .5) * amp * .35; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }
}
function drawBubbles(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 14 + Math.round(o.detail * .35), g = ctx.createLinearGradient(0, 0, 0, h), tri = p => Math.abs((((p % 2) + 2) % 2) - 1);
  g.addColorStop(0, C[0]); g.addColorStop(1, mix(C[0], C[2], .45)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const r = m * (.025 + R() * .07), c = C[1 + i % 4], kx = 1 + Math.floor(R() * 2), ky = 1 + Math.floor(R() * 2), px = R() * 2, py = R() * 2, sgn = R() < .5 ? -1 : 1;
    const x = r + tri(px + sgn * kx * t / 8) * (w - 2 * r), y = r + tri(py + ky * t / 8) * (h - 2 * r);
    const rg = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); rg.addColorStop(0, rgba(c, .1)); rg.addColorStop(.8, rgba(c, .28)); rg.addColorStop(1, rgba(c, .6));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(c, .75); ctx.lineWidth = Math.max(1.5, r * .035); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = Math.max(1.5, r * .06); ctx.beginPath(); ctx.arc(x, y, r * .72, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  }
}
function drawStardust(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 120 + Math.round(o.detail * 3);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3; i++) { const c = C[1 + i], x = (.15 + .7 * R()) * w, y = (.15 + .7 * R()) * h, r = m * (.35 + R() * .2), g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .32)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  for (let i = 0; i < n; i++) {
    const x = R() * w, y = R() * h, s = m * (.0012 + Math.pow(R(), 3) * .006), k = 1 + Math.floor(R() * 3), tw = .55 + .45 * Math.sin(a * k + R() * 6.28), c = i % 7 === 0 ? C[4] : i % 3 === 0 ? C[3] : C[1 + i % 2];
    ctx.fillStyle = rgba(c, tw); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    if (s > m * .0042) { ctx.strokeStyle = rgba(c, tw * .8); ctx.lineWidth = Math.max(1, s * .22); ctx.beginPath(); ctx.moveTo(x - s * 3.4, y); ctx.lineTo(x + s * 3.4, y); ctx.moveTo(x, y - s * 3.4); ctx.lineTo(x, y + s * 3.4); ctx.stroke(); }
  }
}
function drawMosaic(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), cols = Math.round((w < h ? 9 : 18) + o.detail * (w < h ? .1 : .18)), cw = w / cols, rows = Math.ceil(h / cw), pal = ramp(C.slice(1), 48), ox = Math.cos(a) * 1.4, oy = Math.sin(a) * 1.4;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const v = clamp(vnoise(i * .16 + ox, j * .16 + oy, d.seed) * 1.25 - .12 + (vnoise(i * .5 - oy, j * .5 + ox, d.seed + 2) - .5) * .25, 0, 1), s = cw * (.7 + .26 * Math.sin(v * 6 + a)), x = i * cw + (cw - s) / 2, y = j * cw + (cw - s) / 2;
    ctx.fillStyle = pal[Math.floor(v * 47)]; ctx.beginPath(); ctx.roundRect(x, y, s, s, s * .22); ctx.fill();
  }
}
function drawBars(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, n = 28 + Math.round(o.detail * .5), bw = w / n, pal = ramp(C.slice(1), n);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const v = .1 + .8 * vnoise(i * .2 + Math.cos(a) * 1.5, Math.sin(a) * 1.5, d.seed) * (.7 + .3 * Math.sin(i * .35 + a)), bh = h * v * .8, x = i * bw + bw * .2;
    ctx.fillStyle = pal[i]; ctx.beginPath(); ctx.roundRect(x, (h - bh) / 2, bw * .6, bh, bw * .3); ctx.fill();
  }
}
function drawBloom(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, u = Math.min(w, h), n = 500 + Math.round(o.detail * 8), pal = ramp(C.slice(1), 60), ga = 2.399963;
  const e = (1 - Math.cos(a)) / 2, R = u * .12 + (w / 2 - u * .12) * e, sc = R / Math.sqrt(n), cx = w / 2, cy = h * .5 + h * .02;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 1; i < n; i++) {
    const r = sc * Math.sqrt(i), th = i * ga + a, k = 1 + .12 * Math.sin(a * 2 - r / R * 9), x = cx + Math.cos(th) * r * k, y = cy + Math.sin(th) * r * k, s = sc * (.28 + .5 * Math.sqrt(i / n)) * 1.55;
    if (x < -s || x > w + s || y < -s || y > h + s) continue;
    ctx.fillStyle = pal[Math.floor(i / n * 59)]; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
}
function drawSpiro(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, u = Math.min(w, h), N = 24 + Math.round(o.detail * .3), pal = ramp(C.slice(1), N), K = 3 + (d.seed % 3), P = 2 + (d.seed % 2);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.lineWidth = Math.max(1.4, u * .0028); ctx.lineJoin = 'round';
  for (let i = 0; i < N; i++) {
    const p = i / (N - 1), R = u * (.14 + .34 * p); ctx.strokeStyle = pal[i]; ctx.globalAlpha = .9; ctx.beginPath();
    for (let s = 0; s <= 360; s++) { const th = s / 360 * Math.PI * 2, x = w / 2 + R * Math.sin(K * th + a) * (1 + .12 * Math.cos(P * th + i * .2)) * (w > h ? 1.35 : 1), y = h / 2 + R * Math.sin(P * th + a * 2 + p * 2.4) * (w > h ? 1 : 1.3); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
function drawOpart(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), cols = Math.round(18 + o.detail * .2), cw = w / cols, rows = Math.ceil(h / cw), A = cw * .5, k = 5.2 / m, pal = ramp(C.slice(1), 24);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  const P = (x, y) => [x + Math.sin(y * k * 1.7 + a) * A + Math.sin(x * k * .9 - a) * A * .4, y + Math.sin(x * k * 1.3 + a) * A];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if ((i + j) % 2) continue; const x = i * cw, y = j * cw, p1 = P(x, y), p2 = P(x + cw, y), p3 = P(x + cw, y + cw), p4 = P(x, y + cw);
    ctx.fillStyle = pal[Math.floor(clamp((i / cols + j / rows) / 2, 0, .999) * 24)]; ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]); ctx.closePath(); ctx.fill();
  }
}
