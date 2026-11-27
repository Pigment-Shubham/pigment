/* ---------- more styles: metaballs, silk, sungrid, kaleido, truchet, voronoi, fireflies, rain, dither, daysky ---------- */
function drawMetaballs(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), port = w < h, asp = h / w, cw = clamp(Math.round(w / 3), 240, 720), ch = Math.round(cw * asp), n = 5 + Math.round(o.detail / 18), sc = port ? 1.7 : 1;
  const P = []; for (let i = 0; i < n; i++) { const kx = 1 + Math.floor(R() * 2), ky = 1 + Math.floor(R() * 2), px = R() * 6.28, py = R() * 6.28, bx = .15 + .7 * R(), by = .15 + .7 * R(), r = (.06 + .08 * R()) * sc; P.push([bx, by, r * r, kx, ky, px, py, h2r(C[1 + i % 4])]); }
  const pos = P.map(p => [p[0] + Math.sin(a * p[3] + p[5]) * .17, (p[1] + Math.cos(a * p[4] + p[6]) * .17) * asp]);
  const cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, bg = h2r(C[0]);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const u = x / cw, v = y / cw; let s = 0, r = 0, g = 0, b = 0, z = 1e-9;
    for (let i = 0; i < n; i++) { const dx = u - pos[i][0], dy = v - pos[i][1], q = P[i][2] / (dx * dx + dy * dy + 1e-6); s += q; const c = P[i][7], q3 = q * q * q; r += q3 * c[0]; g += q3 * c[1]; b += q3 * c[2]; z += q3; }
    r /= z; g /= z; b /= z;
    const e = clamp((s - .98) / .035, 0, 1), halo = clamp(s * .2, 0, 1) * .3 * (1 - e), sh = 1 + .1 * clamp((s - 1) / 3, 0, 1), k = (y * cw + x) * 4;
    D[k] = clamp((bg[0] + (r - bg[0]) * halo) * (1 - e) + r * sh * e, 0, 255); D[k + 1] = clamp((bg[1] + (g - bg[1]) * halo) * (1 - e) + g * sh * e, 0, 255); D[k + 2] = clamp((bg[2] + (b - bg[2]) * halo) * (1 - e) + b * sh * e, 0, 255); D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
}
function drawSilk(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), n = 10 + Math.round(o.detail / 6), dark = lum(C[0]) < .45, pal = ramp(C.slice(1), n), g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C[0]); g.addColorStop(1, mix(C[0], C[2], .35)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const st = Math.max(8, w / 80);
  for (let k = 0; k < n; k++) {
    const f = k / (n - 1), ph = d.seed * .1 + f * 2.2;
    ctx.beginPath();
    for (let x = -st; x <= w + st; x += st) { const nx = x / w, y = h * (.14 + .62 * f) + Math.sin(nx * 2.4 + a + ph) * h * .13 * (.5 + f) + Math.sin(nx * 5.2 - a * 2 + f * 3) * h * .035 + Math.sin(nx * 9.7 + a * 3 + k) * h * .008; x <= -st + .1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(pal[k], dark ? .6 : .55); ctx.lineWidth = Math.max(1.5, m * .0022); ctx.stroke();
    ctx.lineTo(w + st, h * 1.1); ctx.lineTo(-st, h * 1.1); ctx.closePath(); ctx.fillStyle = rgba(pal[k], dark ? .05 : .09); ctx.fill(); ctx.restore();
  }
}
function drawSungrid(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), hz = h * (w > h ? .58 : .52), cx = w / 2, R0 = Math.min(w * .3, h * .26), cy = hz - R0 * .35, f = (t / 16) % 1, f2 = (t / 16 * 2) % 1, R = rng(d.seed);
  const sky = ctx.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, C[0]); sky.addColorStop(.7, mix(C[0], C[3], .5)); sky.addColorStop(1, mix(C[2], C[3], .5));
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz + 1);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.clip();
  const sg = ctx.createLinearGradient(0, cy - R0, 0, cy + R0); sg.addColorStop(0, C[2]); sg.addColorStop(1, C[3]); ctx.fillStyle = sg; ctx.fillRect(cx - R0, cy - R0, R0 * 2, R0 * 2);
  const sp = R0 * .15; ctx.fillStyle = sky;
  for (let i = -1; i < 9; i++) { const y = cy + (i + f) * sp, th = R0 * .018 + Math.max(0, y - cy) / R0 * R0 * .06; if (y > cy - R0 * .1) ctx.fillRect(cx - R0, y, R0 * 2, th); }
  ctx.restore();
  ctx.fillStyle = mix(C[0], C[4], .3); ctx.beginPath(); ctx.moveTo(0, hz);
  for (let x = 0; x <= w; x += w / 40) { const nx = x / w, hh = (Math.abs(Math.sin(nx * 9 + d.seed)) * .7 + Math.abs(Math.sin(nx * 23 + 1)) * .3) * h * .06 * (1 - Math.exp(-Math.abs(nx - .5) * 6)); ctx.lineTo(x, hz - hh); }
  ctx.lineTo(w, hz); ctx.closePath(); ctx.fill();
  const gr = ctx.createLinearGradient(0, hz, 0, h); gr.addColorStop(0, mix(C[0], C[4], .55)); gr.addColorStop(1, mix(C[0], '#000000', .25)); ctx.fillStyle = gr; ctx.fillRect(0, hz, w, h - hz);
  const N = 14, L = C[1], dark = lum(C[0]) < .45;
  ctx.lineCap = 'round'; ctx.strokeStyle = L;
  for (let i = 0; i < N; i++) { const z = (i + f2) / N, y = hz + (h - hz) * z * z; ctx.globalAlpha = .25 + .6 * z; ctx.lineWidth = Math.max(1.5, m * .0012 + z * m * .003); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  for (let j = -14; j <= 14; j++) { ctx.globalAlpha = .55; ctx.lineWidth = Math.max(1.5, m * .002); ctx.beginPath(); ctx.moveTo(cx, hz); ctx.lineTo(cx + j * w * .12, h); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.strokeStyle = C[3]; ctx.lineWidth = Math.max(2, m * .0016); ctx.beginPath(); ctx.moveTo(0, hz); ctx.lineTo(w, hz); ctx.stroke();
}
function drawKaleido(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), cx = w / 2, cy = h / 2, rad = Math.hypot(w, h) / 2, N = 2 * (3 + Math.round(o.detail / 50)), dark = lum(C[0]) < .45, S = [];
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 16; i++) S.push({ r: rad * (.1 + .85 * R()), th: R() * Math.PI / N, s: rad * (.04 + .1 * R()), c: C[1 + i % 4], k: 1 + Math.floor(R() * 3), ph: R() * 6.28, ty: Math.floor(R() * 3) });
  for (let i = 0; i < N; i++) for (let mir = 0; mir < 2; mir++) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(i * 2 * Math.PI / N + a / N); if (mir) ctx.scale(1, -1);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(rad * 1.2, 0); ctx.arc(0, 0, rad * 1.2, 0, Math.PI / N); ctx.closePath(); ctx.clip();
    if (dark) ctx.globalCompositeOperation = 'lighter';
    S.forEach(q => {
      const r = q.r + Math.sin(a * q.k + q.ph) * rad * .07, th = q.th + Math.cos(a * q.k + q.ph) * .08, x = Math.cos(th) * r, y = Math.sin(th) * r, s = q.s * (.8 + .3 * Math.sin(a * q.k + q.ph * 2));
      if (q.ty === 0) { const g = ctx.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, rgba(q.c, .9)); g.addColorStop(1, rgba(q.c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); }
      else if (q.ty === 1) { ctx.strokeStyle = rgba(q.c, .85); ctx.lineWidth = Math.max(2, s * .18); ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.stroke(); }
      else { ctx.fillStyle = rgba(q.c, .75); ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * .6, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * .6, y); ctx.closePath(); ctx.fill(); }
    });
    ctx.restore();
  }
}
function drawTruchet(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), cols = Math.round((w < h ? 7 : 14) + o.detail * (w < h ? .06 : .1)), cs = w / cols, rows = Math.ceil(h / cs) + 1, pal = ramp(C.slice(1).concat(C[1]), 64);
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.lineCap = 'butt';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const fl = hash(i, j, d.seed) > .5, x = i * cs, y = j * cs, idx = Math.floor((((i + j) * 3 + a / (2 * Math.PI) * 64) % 64 + 64) % 64), lw = cs * (.2 + .1 * Math.sin(a + hash(i, j, 7) * 6.28));
    ctx.strokeStyle = pal[idx]; ctx.lineWidth = lw; ctx.beginPath();
    if (fl) { ctx.arc(x, y, cs / 2, 0, Math.PI / 2); ctx.moveTo(x + cs + cs / 2, y + cs); ctx.arc(x + cs, y + cs, cs / 2, Math.PI, Math.PI * 1.5); }
    else { ctx.arc(x + cs, y, cs / 2, Math.PI / 2, Math.PI); ctx.moveTo(x + cs / 2 + 0, y + cs); ctx.arc(x, y + cs, cs / 2, Math.PI * 1.5, Math.PI * 2); }
    ctx.stroke();
  }
}
function drawVoronoi(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), asp = h / w, cw = clamp(Math.round(w / 3), 240, 720), ch = Math.round(cw * asp), n = 14 + Math.round(o.detail / 5), S = [];
  for (let i = 0; i < n; i++) S.push([.05 + .9 * R(), (.05 + .9 * R()) * asp, 1 + Math.floor(R() * 2), 1 + Math.floor(R() * 2), R() * 6.28, R() * 6.28, h2r(C[1 + i % 4]), R()]);
  const P = S.map(s => [s[0] + Math.sin(a * s[2] + s[4]) * .05, s[1] + Math.cos(a * s[3] + s[5]) * .05 * asp]);
  const cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, bg = h2r(C[0]), dark = lum(C[0]) < .45;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const u = x / cw, v = y / cw; let b1 = 9, b2 = 9, k1 = 0;
    for (let i = 0; i < n; i++) { const dx = u - P[i][0], dy = v - P[i][1], q = dx * dx + dy * dy; if (q < b1) { b2 = b1; b1 = q; k1 = i; } else if (q < b2) b2 = q; }
    const c = S[k1][6], dd = Math.sqrt(b1), e = clamp((Math.sqrt(b2) - dd) * 150, 0, 1), sh = .72 + .5 * clamp(1 - dd * 5, 0, 1) * (.6 + .4 * S[k1][7]), k = (y * cw + x) * 4, edge = (1 - e) * (dark ? 1 : .8), hi = dark ? 255 : 255;
    D[k] = clamp(c[0] * sh * (1 - edge) + (bg[0] * .3 + hi * .7) * edge, 0, 255); D[k + 1] = clamp(c[1] * sh * (1 - edge) + (bg[1] * .3 + hi * .7) * edge, 0, 255); D[k + 2] = clamp(c[2] * sh * (1 - edge) + (bg[2] * .3 + hi * .7) * edge, 0, 255); D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
}
function drawFireflies(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 36 + Math.round(o.detail * .7), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#05060c', .72);
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(base, '#000000', .35)); g.addColorStop(1, mix(base, C[4], .25)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = (.04 + .92 * R()) * w + Math.sin(a * (1 + Math.floor(R() * 2)) + R() * 6.28) * m * .05, y = (.08 + .8 * R()) * h + Math.sin(a * (1 + Math.floor(R() * 2)) + R() * 6.28) * m * .04, pu = Math.pow(.5 + .5 * Math.sin(a * (2 + Math.floor(R() * 3)) + R() * 6.28), 2), r = m * (.012 + .02 * R()) * (.6 + .6 * pu), c = C[1 + i % 4];
    const gg = ctx.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, rgba(mix(c, '#ffffff', .5), .95 * pu + .05)); gg.addColorStop(.25, rgba(c, .5 * pu + .03)); gg.addColorStop(1, rgba(c, 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  ctx.restore();
  for (let L = 0; L < 2; L++) { ctx.fillStyle = mix(base, '#000000', .55 + L * .25); ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w; x += w / 60) { const nx = x / w; ctx.lineTo(x, h * (.9 - L * .05) - Math.abs(Math.sin(nx * (5 + L * 3) + d.seed + L)) * h * .05 - Math.abs(Math.sin(nx * 31 + L * 2)) * h * .012); } ctx.lineTo(w, h); ctx.closePath(); ctx.fill(); }
}
function drawRain(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), dark = lum(C[0]) < .45;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) { const c = C[1 + i % 4], x = (.1 + .8 * R() + Math.sin(a + i * 2) * .05) * w, y = (.1 + .8 * R() + Math.cos(a + i * 1.3) * .05) * h, r = m * (.25 + .2 * R()), g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .85)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  const drop = (x, y, r) => {
    ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.beginPath(); ctx.arc(x + r * .1, y + r * .18, r, 0, 7); ctx.fill();
    const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .05, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.08)'); g.addColorStop(1, 'rgba(255,255,255,.28)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .4, Math.max(1, r * .16), 0, 7); ctx.fill();
  };
  const ns = 140 + Math.round(o.detail * 3); for (let i = 0; i < ns; i++) drop(R() * w, R() * h, m * (.0016 + Math.pow(R(), 2.2) * .006));
  const nr = 10 + Math.round(o.detail * .18);
  for (let i = 0; i < nr; i++) {
    const x = R() * w, r = m * (.0045 + R() * .004), k = 1 + Math.floor(R() * 2), y0 = R() * (h + 8 * r), H = h + 8 * r, y = ((y0 + t / 16 * k * H) % H + H) % H - 4 * r, len = r * (10 + R() * 14);
    const tg = ctx.createLinearGradient(0, y - len, 0, y); tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, 'rgba(255,255,255,.22)'); ctx.strokeStyle = tg; ctx.lineWidth = r * .8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - len); ctx.lineTo(x, y); ctx.stroke(); drop(x, y, r);
  }
}
function drawDither(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, asp = h / w, cw = Math.round(w < h ? 120 + o.detail * .9 : 220 + o.detail * 1.8), ch = Math.round(cw * asp), pal = C.slice().sort((p, q) => lum(p) - lum(q)).map(h2r), L = pal.length;
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const u = x / cw, v = y / cw, q = Math.hypot(u - .5, v - asp * .5);
    let f = .5 + .22 * Math.sin(u * 6.5 + a) + .2 * Math.sin(v * 7 - a) + .2 * Math.sin(q * 14 - a * 2) + .08 * Math.sin((u + v) * 22 + a * 3); f = clamp(f, 0, .999);
    const xx = f * (L - 1), b0 = Math.floor(xx), c = pal[b0 + ((xx - b0) > (B[(y & 3) * 4 + (x & 3)] + .5) / 16 ? 1 : 0)], k = (y * cw + x) * 4;
    D[k] = c[0]; D[k + 1] = c[1]; D[k + 2] = c[2]; D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(cv, 0, 0, w, h);
}
function drawDaysky(ctx, w, h, d, t, o) {
  const C = d.colors, R = rng(d.seed), m = Math.max(w, h), hz = h * .8;
  let p = t / 16; if (o.realtime) { const n = new Date(); p = (n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds()) / 86400; } p = ((p % 1) + 1) % 1;
  const nt = mix(C[0], '#04060f', lum(C[0]) > .45 ? .92 : .7), K = [[nt, mix(C[4], '#04060f', .8)], [mix(C[4], '#10143a', .3), C[2]], [mix('#4aa3ff', C[1], .22), mix('#d8f1ff', C[0], .3)], [mix(C[4], '#10122e', .3), C[3]], [nt, mix(C[4], '#04060f', .8)]];
  const q = p * 4, i = Math.min(3, Math.floor(q)), f0 = q - i, f = f0 * f0 * (3 - 2 * f0), top = mix(K[i][0], K[i + 1][0], f), bot = mix(K[i][1], K[i + 1][1], f);
  const g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const phi = (p - .25) * 2 * Math.PI, night = clamp(-Math.sin(phi) * 3 + .3, 0, 1);
  if (night > 0) { ctx.fillStyle = '#ffffff'; for (let s = 0; s < 120; s++) { const x = R() * w, y = R() * hz * .9, r = m * (.0008 + R() * .0016), tw = .5 + .5 * Math.sin(phi * 4 * (1 + s % 3) + s); ctx.globalAlpha = night * tw * .9; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
  const body = (ang, col, rr, glow) => { const s = Math.sin(ang); if (s < -.25) return; const x = w * (.12 + .76 * (ang % (2 * Math.PI) / Math.PI > 1 ? 0 : (ang / Math.PI))), y = hz - s * h * .55 + rr * .2; const gg = ctx.createRadialGradient(x, y, 0, x, y, rr * glow); gg.addColorStop(0, rgba(col, .9)); gg.addColorStop(.18, rgba(col, .5)); gg.addColorStop(1, rgba(col, 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, rr * glow, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); };
  const A = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  body(A, mix('#fff2c0', C[3], .3), m * .035, 6); body(((A + Math.PI) % (2 * Math.PI)), '#f4f1e6', m * .022, 5);
  for (let L = 0; L < 3; L++) { ctx.fillStyle = mix(bot, '#000000', .3 + L * .22); ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w; x += w / 60) { const nx = x / w; ctx.lineTo(x, hz + h * .05 * L - h * .07 * (.6 + .4 * Math.sin(nx * (2 + L) * 2 + d.seed + L * 2)) - Math.abs(Math.sin(nx * 17 + L)) * h * .015); } ctx.lineTo(w, h); ctx.closePath(); ctx.fill(); }
}
function drawPhoto(ctx, w, h, d, t, o) {
  ctx.fillStyle = d.colors[0]; ctx.fillRect(0, 0, w, h); const im = window.__photo; if (!im) return;
  const s = Math.max(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
