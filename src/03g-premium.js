/* ---------- premium styles: glass orbs, holo foil, frosted glass, galaxy, caustics, bokeh, paper layers, light shafts ---------- */
function drawGlassOrbs(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.min(w, h), n = 5 + Math.round(o.detail / 25), port = w < h, dark = lum(C[0]) < .45;
  const bg = ctx.createLinearGradient(0, 0, w * .4, h); bg.addColorStop(0, mix(C[0], '#ffffff', dark ? .08 : .5)); bg.addColorStop(1, mix(C[0], C[4], dark ? .3 : .18)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const S = []; for (let i = 0; i < n; i++) S.push({ x: .12 + .76 * R(), y: .2 + .6 * R(), r: m * (.1 + .17 * R()), kx: 1 + Math.floor(R() * 2), ky: 1 + Math.floor(R() * 2), px: R() * 6.28, py: R() * 6.28, c: C[1 + i % 4] });
  S.sort((p, q) => p.r - q.r);
  S.forEach(s => {
    const x = (s.x + Math.sin(a * s.kx + s.px) * .05) * w, y = (s.y + Math.cos(a * s.ky + s.py) * .04) * h, r = s.r, c = s.c;
    ctx.save(); ctx.translate(x + r * .15, y + r * 1.08); ctx.scale(1, .18); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.1); sg.addColorStop(0, 'rgba(0,0,0,.32)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, 7); ctx.fill(); ctx.restore();
    const g = ctx.createRadialGradient(x - r * .32, y - r * .38, r * .05, x, y, r); g.addColorStop(0, mix(c, '#ffffff', .72)); g.addColorStop(.35, mix(c, '#ffffff', .15)); g.addColorStop(.8, mix(c, '#000000', .3)); g.addColorStop(1, mix(c, '#000000', .5)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
    const rl = ctx.createRadialGradient(x + r * .5, y + r * .62, 0, x + r * .5, y + r * .62, r * .75); rl.addColorStop(0, rgba(mix(c, '#ffffff', .6), .55)); rl.addColorStop(1, rgba(c, 0)); ctx.fillStyle = rl; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    const w2 = ctx.createRadialGradient(x - r * .4, y - r * .5, 0, x - r * .4, y - r * .5, r * .32); w2.addColorStop(0, 'rgba(255,255,255,.95)'); w2.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = w2; ctx.beginPath(); ctx.ellipse(x - r * .4, y - r * .5, r * .3, r * .2, -.6, 0, 7); ctx.fill();
    ctx.restore();
  });
}
function drawHoloFoil(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, asp = h / w, cw = clamp(Math.round(w / 3), 240, 640), ch = Math.round(cw * asp), pal = ramp([C[1], C[2], C[3], C[4], C[2], C[1]], 96).map(h2r), cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, s = d.seed * .21, bg = h2r(C[0]);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const u = x / cw, v = y / cw, wu = u + .22 * Math.sin(v * 3.1 + a + s) + .1 * Math.sin(v * 7.3 - a * 2), wv = v + .22 * Math.sin(u * 2.7 - a + s * 2) + .1 * Math.sin(u * 6.1 + a * 2);
    const f = .5 + .5 * Math.sin(wu * 3.2 + wv * 2.4 + a + Math.sin(wu * 5 + wv * 4 - a) * .8), c = pal[Math.min(95, Math.floor(f * 96))], sp = Math.pow(Math.max(0, Math.sin(wu * 5.5 - wv * 3.5 + a * 2 + 1)), 10) * .55, sh = .55 + .45 * f, k = (y * cw + x) * 4;
    D[k] = clamp(c[0] * (.72 + .28 * sh) * (1 - .12) + bg[0] * .12 + 255 * sp, 0, 255); D[k + 1] = clamp(c[1] * (.72 + .28 * sh) * (1 - .12) + bg[1] * .12 + 255 * sp, 0, 255); D[k + 2] = clamp(c[2] * (.72 + .28 * sh) * (1 - .12) + bg[2] * .12 + 255 * sp, 0, 255); D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
  const kg = o.grain / 100; if (kg > 0) { const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, Math.max(w, h) / 900))); ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = Math.min(1, kg * .3); ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore(); }
}
function drawFrosted(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) { const c = C[1 + i % 4], x = (.15 + .7 * R() + Math.sin(a + i * 1.9) * .07) * w, y = (.15 + .7 * R() + Math.cos(a + i * 1.4) * .07) * h, r = m * (.14 + .12 * R()), g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(.7, rgba(c, .9)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  const sw = Math.max(16, Math.round(w / 14)), sh = Math.max(16, Math.round(h / 14)), sc = makeCanvas(sw, sh), sx = sc.getContext('2d'); sx.imageSmoothingEnabled = true; sx.drawImage(ctx.canvas, 0, 0, sw, sh);
  const P = port ? [[.5, .3, .7, .22], [.4, .62, .56, .26], [.62, .84, .5, .13]] : [[.3, .45, .34, .52], [.62, .34, .3, .36], [.66, .72, .4, .2]];
  P.forEach((p, i) => {
    const pw = p[2] * w, ph = p[3] * h, x = (p[0] + Math.sin(a + i * 2.1) * .02) * w - pw / 2, y = (p[1] + Math.cos(a + i * 1.6) * .02) * h - ph / 2, rad = Math.min(pw, ph) * .12;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = m * .03; ctx.shadowOffsetY = m * .01; ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.roundRect(x, y, pw, ph, rad); ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, pw, ph, rad); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(sc, 0, 0, w, h); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(x, y, pw, ph);
    const hl = ctx.createLinearGradient(x, y, x + pw, y + ph); hl.addColorStop(0, 'rgba(255,255,255,.35)'); hl.addColorStop(.5, 'rgba(255,255,255,0)'); ctx.fillStyle = hl; ctx.fillRect(x, y, pw, ph); ctx.restore();
    const bs = ctx.createLinearGradient(x, y, x + pw, y + ph); bs.addColorStop(0, 'rgba(255,255,255,.75)'); bs.addColorStop(.5, 'rgba(255,255,255,.12)'); bs.addColorStop(1, 'rgba(255,255,255,.4)'); ctx.strokeStyle = bs; ctx.lineWidth = Math.max(1.5, m * .0016); ctx.beginPath(); ctx.roundRect(x, y, pw, ph, rad); ctx.stroke();
  });
}
function drawGalaxy(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 2600 + Math.round(o.detail * 40), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#04050c', .75), cx = w / 2, cy = h * (w < h ? .56 : .5), Rg = Math.min(w, h * 1.1) * (w < h ? .55 : .46);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .8); bg.addColorStop(0, mix(base, '#000000', .1)); bg.addColorStop(1, mix(base, '#000000', .65)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 160; i++) { ctx.fillStyle = 'rgba(255,255,255,' + (.2 + .6 * R()) + ')'; const s = m * (.0007 + R() * .0012); ctx.beginPath(); ctx.arc(R() * w, R() * h, s, 0, 7); ctx.fill(); }
  ctx.translate(cx, cy); ctx.rotate(-.5); ctx.scale(1, .5);
  const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, Rg * .5); cg.addColorStop(0, rgba(C[3], .85)); cg.addColorStop(.3, rgba(C[2], .35)); cg.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(0, 0, Rg * .5, 0, 7); ctx.fill();
  const arms = 3 + (d.seed % 2); ctx.rotate(a);
  for (let i = 0; i < n; i++) {
    const u = Math.pow(R(), .7), r = u * Rg, arm = i % arms, th = arm * 2 * Math.PI / arms + u * 5.2 + (R() - .5) * (.7 - u * .35), x = Math.cos(th) * r, y = Math.sin(th) * r, big = R() < .03, s = m * (big ? .0026 : .0009 + R() * .0012), c = u < .25 ? C[3] : (i % 3 ? C[1] : C[4]);
    ctx.fillStyle = rgba(mix(c, '#ffffff', big ? .6 : .25), big ? .9 : .35 + .5 * (1 - u)); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    if (big) { const g = ctx.createRadialGradient(x, y, 0, x, y, s * 5); g.addColorStop(0, rgba(c, .4)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 5, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
function drawCaustics(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, asp = h / w, cw = clamp(Math.round(w / 6), 200, 260), ch = Math.round(cw * asp), cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, K = [1, 2, 1, 3, 2], TAU = Math.PI * 2;
  const deep = h2r(mix(C[1], C[4], .55)), shallow = h2r(C[1]), hl = h2r(mix(C[0], '#ffffff', .6)), inten = .005, off = d.seed * .13;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const px = ((x / cw * TAU * 1.5) % TAU) - 250 + off, py = ((y / cw * TAU * 1.5) % TAU) - 250 + off; let ix = px, iy = py, c = 1;
    for (let n = 0; n < 5; n++) { const tt = a * K[n] + n * 1.3; ix = px + Math.cos(tt - ix) + Math.sin(tt + iy); iy = py + Math.sin(tt - iy) + Math.cos(tt + ix); c += 1 / Math.hypot(px / (Math.sin(ix + tt) / inten), py / (Math.cos(iy + tt) / inten)); }
    c /= 5; c = 1.17 - Math.pow(c, 1.4); const v = clamp(Math.pow(Math.abs(c), 8) * 1.5, 0, 1), g = y / ch, k = (y * cw + x) * 4;
    for (let q = 0; q < 3; q++) { const base = deep[q] + (shallow[q] - deep[q]) * (1 - g * .6); D[k + q] = clamp(base + (hl[q] - base) * v, 0, 255); } D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
}
function drawBokeh(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 22 + Math.round(o.detail * .35), dark = lum(C[0]) < .45, g = ctx.createLinearGradient(0, 0, w * .3, h);
  g.addColorStop(0, dark ? mix(C[0], '#000000', .25) : mix(C[0], '#ffffff', .4)); g.addColorStop(1, mix(C[0], C[4], dark ? .35 : .25)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter';
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < (layer ? n : n / 3); i++) {
    const r = m * (layer ? .02 + R() * .05 : .09 + R() * .1), c = C[1 + (i + layer) % 4], x = (R() + Math.sin(a * (1 + Math.floor(R() * 2)) + R() * 6.28) * .04) * w, y = (R() + Math.cos(a * (1 + Math.floor(R() * 2)) + R() * 6.28) * .04) * h, al = layer ? .35 + .3 * R() : .16, gr = ctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(c, al * .55)); gr.addColorStop(.82, rgba(c, al * (layer ? .9 : .7))); gr.addColorStop(.93, rgba(mix(c, '#ffffff', .4), al * (layer ? 1.3 : .8))); gr.addColorStop(1, rgba(c, 0)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function drawPaperLayers(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 5 + Math.round(o.detail / 22), pal = ramp([C[2], C[1], C[3], C[4]], n), st = Math.max(8, w / 90);
  const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mix(C[0], '#ffffff', .15)); bg.addColorStop(1, C[0]); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  for (let k = 0; k < n; k++) {
    const f = k / n, base = h * (.2 + .72 * f), amp = h * (.045 + .02 * R()), k1 = 1 + Math.floor(R() * 2), k2 = 2 + Math.floor(R() * 2), p1 = R() * 6.28, p2 = R() * 6.28, dir = k % 2 ? -1 : 1;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.34)'; ctx.shadowBlur = m * .025; ctx.shadowOffsetY = -m * .008; ctx.fillStyle = pal[k]; ctx.beginPath(); ctx.moveTo(-st, h + st);
    for (let x = -st; x <= w + st; x += st) { const nx = x / w; ctx.lineTo(x, base + amp * (Math.sin(nx * Math.PI * 2 * k1 + p1 + a * dir) + .55 * Math.sin(nx * Math.PI * 2 * (k2 + 1) + p2 - a * dir))); }
    ctx.lineTo(w + st, h + st); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900))); ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .16; ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawLightShafts(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 8 + Math.round(o.detail / 14), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#04050c', .7), sx = w * (.3 + .4 * R()), sy = -h * .08, L = Math.hypot(w, h) * 1.1;
  const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mix(base, C[4], .25)); bg.addColorStop(1, mix(base, '#000000', .45)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const c = C[1 + i % 4], th = Math.PI / 2 + (R() - .5) * 1.25 + Math.sin(a * (1 + i % 2) + R() * 6.28) * .06, wd = .025 + R() * .07, al = .12 + R() * .16;
    for (let pass = 0; pass < 2; pass++) { const ww = wd * (pass ? 1.9 : 1), ex = sx + Math.cos(th - ww) * L, ey = sy + Math.sin(th - ww) * L, fx = sx + Math.cos(th + ww) * L, fy = sy + Math.sin(th + ww) * L, g = ctx.createLinearGradient(sx, sy, sx + Math.cos(th) * L, sy + Math.sin(th) * L); g.addColorStop(0, rgba(c, al * (pass ? .5 : 1))); g.addColorStop(.65, rgba(c, al * .35 * (pass ? .5 : 1))); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(fx, fy); ctx.closePath(); ctx.fill(); }
  }
  const gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, m * .5); gl.addColorStop(0, rgba(mix(C[2], '#ffffff', .6), .75)); gl.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { const x = R() * w, y0 = R() * h, sp = 1 + Math.floor(R() * 2), y = (((y0 + t / 16 * sp * h) % h) + h) % h, r = m * (.0008 + R() * .0016); ctx.fillStyle = 'rgba(255,255,255,' + (.15 + .45 * R()) + ')'; ctx.beginPath(); ctx.arc(x + Math.sin(a + i) * m * .01, y, r, 0, 7); ctx.fill(); }
  ctx.restore();
}
