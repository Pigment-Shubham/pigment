/* ---------- more scenes: storm, snow, pixel dusk, isometric city, rose window, tarot, star trails, rainy window, grass ---------- */
function drawStormHills(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), K = '#0b0d16';
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], K, .7)); g.addColorStop(1, mix(C[1], '#2a3050', .55)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) { const x = ((R() + t / 16 * (1 + (i % 2))) % 1) * 1.7 * w - .35 * w, y = h * (.08 + .3 * R()), s = m * (.14 + .12 * R()); for (let j = 0; j < 5; j++) { const cx = x + (j - 2) * s * .55, cy = y + Math.sin(j * 2 + i) * s * .12, rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * .8); rg.addColorStop(0, rgba(mix(C[4], '#242b40', .55), .55)); rg.addColorStop(1, rgba(mix(C[4], '#242b40', .55), 0)); ctx.fillStyle = rg; ctx.fillRect(cx - s, cy - s, s * 2, s * 2); } }
  const f = Math.pow(Math.max(0, Math.sin(a * 3 + .6)), 40);
  if (f > .02) { ctx.fillStyle = rgba('#dfe8ff', f * .3); ctx.fillRect(0, 0, w, h); const R2 = rng(d.seed + 11); let x = w * (.3 + .4 * R2()), y = 0; ctx.beginPath(); ctx.moveTo(x, y); while (y < h * .6) { y += h * .05; x += (R2() - .5) * w * .07; ctx.lineTo(x, y); } ctx.lineWidth = m * .004; ctx.strokeStyle = rgba('#f4f7ff', Math.min(1, f * 1.4)); ctx.shadowColor = '#9db8ff'; ctx.shadowBlur = m * .02; ctx.stroke(); ctx.shadowBlur = 0; }
  for (let l = 0; l < 3; l++) { ctx.fillStyle = mix(mix(C[2], K, .75), '#000000', l * .2); ctx.beginPath(); ctx.moveTo(0, h); const ph = R() * 6; for (let x = 0; x <= w + 2; x += w / 60) ctx.lineTo(x, h * (.7 + l * .08) + Math.sin(x / w * 6.283 * (1 + l) + ph) * h * .04 + Math.sin(x / w * 6.283 * (3 + l) + ph * 2) * h * .012); ctx.lineTo(w, h); ctx.closePath(); ctx.fill(); }
  const N = Math.round(120 + 220 * dt), len = m * .045; ctx.lineWidth = Math.max(1, m * .0014); ctx.strokeStyle = rgba(mix(C[4], '#ffffff', .6), .38); ctx.beginPath();
  for (let i = 0; i < N; i++) { const k = 3 + (i % 3), p = R(), x0 = R() * 1.3 * w - .1 * w, y = ((p + t / 16 * k) % 1) * (h + len) - len; ctx.moveTo(x0 - y * .15, y); ctx.lineTo(x0 - y * .15 - len * .15, y + len); } ctx.stroke();
}
function drawSnowfall(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], '#0a1226', .55)); g.addColorStop(1, mix(C[4], '#2a4068', .35)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) { ctx.fillStyle = rgba('#ffffff', (.2 + .5 * R()) * (.6 + .4 * Math.sin(a * (1 + i % 2) + i))); ctx.fillRect(R() * w, R() * h * .6, 1 + m / 900, 1 + m / 900); }
  const mx = w * .72, my = h * .2, mr = m * .05; g = ctx.createRadialGradient(mx, my, mr * .5, mx, my, mr * 5); g.addColorStop(0, rgba('#fff6d8', .5)); g.addColorStop(1, rgba('#fff6d8', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
  for (let l = 0; l < 3; l++) {
    const base = h * (.62 + l * .1), ph = R() * 6, col = mix(mix(C[4], '#ffffff', .65), '#2a3a5c', .5 - l * .18); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w + 2; x += w / 60) ctx.lineTo(x, base + Math.sin(x / w * 6.283 * (1 + l) + ph) * h * .035); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    const nt = 7 + l * 2; ctx.fillStyle = mix(C[2], '#06100c', .75 - l * .1); for (let i = 0; i < nt; i++) { const x = (i + .3 + R() * .4) / nt * w, y = base + Math.sin(x / w * 6.283 * (1 + l) + ph) * h * .035 + h * .01, s = m * (.03 + .022 * (l + 1) * R()); for (let q = 0; q < 3; q++) { ctx.beginPath(); ctx.moveTo(x, y - s * (1.9 - q * .45)); ctx.lineTo(x + s * (.6 + q * .25), y - s * (.6 - q * .5)); ctx.lineTo(x - s * (.6 + q * .25), y - s * (.6 - q * .5)); ctx.closePath(); ctx.fill(); } }
  }
  for (let l = 0; l < 3; l++) { const N = Math.round((60 - l * 12) * (.4 + .8 * dt)); for (let i = 0; i < N; i++) { const k = 1 + l, p = R(), x = (R() + Math.sin(a * (1 + l) + i) * .02) * w, y = ((p + t / 16 * k) % 1) * (h + 20) - 10, r = m * (.0016 + .0016 * (3 - l)); ctx.fillStyle = rgba('#ffffff', .55 + .1 * l * 1.5); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } }
}
function drawPixelDusk(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, R = rng(d.seed), px = Math.max(2, Math.round(Math.min(w, h) / (60 + 40 * dt))), gw = Math.ceil(w / px), gh = Math.ceil(h / px), cv = makeCanvas(gw, gh), q = cv.getContext('2d'), hz = Math.round(gh * .66);
  const bands = 9; for (let b = 0; b < bands; b++) { q.fillStyle = mix(C[0], C[1], b / (bands - 1)); q.fillRect(0, Math.round(b * hz / bands), gw, Math.ceil(hz / bands) + 1); }
  for (let i = 0; i < 40; i++) { const x = Math.floor(R() * gw), y = Math.floor(R() * hz * .5), ph = R() * 6.28; if (Math.sin(t / 16 * 6.283 * 2 + ph) > -.2) { q.fillStyle = '#fff6dc'; q.fillRect(x, y, 1, 1); } }
  const sx = Math.round(gw * .68), sy = Math.round(hz * .72), sr = Math.round(gh * .11); for (let y = -sr; y <= sr; y++) for (let x = -sr; x <= sr; x++) if (x * x + y * y <= sr * sr) { q.fillStyle = (y > 0 && (y % 3 === 0)) ? mix(C[2], C[1], .4) : mix(C[2], '#fff2c8', .55); q.fillRect(sx + x, sy + y, 1, 1); }
  for (let i = 0; i < 5; i++) { const cw = 14 + Math.floor(R() * 18), x = Math.floor(((R() + t / 16 * (1 + i % 2)) % 1) * (gw + 60) - 30), y = Math.floor(hz * (.1 + .35 * R())); q.fillStyle = mix(C[4], '#ffffff', .35); q.fillRect(x, y, cw, 2); q.fillRect(x + 3, y - 2, cw - 8, 2); q.fillRect(x + 2, y + 2, cw - 5, 1); }
  for (let l = 0; l < 3; l++) { const ph = R() * 6, base = hz - gh * (.1 - l * .035), col = mix(C[3], '#10101c', .35 + l * .22); q.fillStyle = col; for (let x = 0; x < gw; x++) { const y = Math.round(base + Math.sin(x / gw * 6.283 * (1 + l) + ph) * gh * .05 + Math.sin(x / gw * 6.283 * (3 + l) + ph * 2) * gh * .015 + l * gh * .05); q.fillRect(x, y, 1, hz + gh - y); } }
  q.fillStyle = mix(C[3], '#0a0a14', .8); q.fillRect(0, hz, gw, gh - hz);
  const nt = 8; for (let i = 0; i < nt; i++) { const x = Math.floor((i + .5 + (R() - .5) * .5) / nt * gw), s = 4 + Math.floor(R() * 5), y = hz + 1 + Math.floor(R() * 3); q.fillStyle = mix(C[2], '#050810', .82); for (let r2 = 0; r2 < 4; r2++) { const wd = Math.round(s * (.4 + r2 * .35)); q.fillRect(x - Math.floor(wd / 2), y - Math.round(s * (3.2 - r2 * .8)), wd, Math.round(s * .9)); } q.fillRect(x, y, 1, 3); }
  ctx.imageSmoothingEnabled = false; ctx.drawImage(cv, 0, 0, gw * px, gh * px);
}
function drawIsoCity(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), ts = m / (10 + 6 * dt), hh = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + (d.seed + s) * 7.7) * 43758.5453; return n - Math.floor(n); };
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], '#0b0b18', .55)); g.addColorStop(1, mix(C[1], '#1d1630', .45)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const N = Math.ceil(m / ts) + 3, cx = w / 2, cy = h * .18;
  for (let s = -N; s <= N * 2; s++) for (let gx = -N; gx <= N; gx++) { const gy = s - gx; if (gy < -N || gy > N) continue; const sx = cx + (gx - gy) * ts, sy = cy + (gx + gy) * ts * .5; if (sx < -ts * 2 || sx > w + ts * 2 || sy < -ts * 6 || sy > h + ts * 2) continue; const r = hh(gx, gy, 0), bh = ts * (.5 + Math.pow(r, 2.2) * 6) * (hh(gx, gy, 3) > .15 ? 1 : .2), col = C[(Math.floor(hh(gx, gy, 5) * 5))], top = sy - bh;
    ctx.fillStyle = mix(col, '#000000', .45); ctx.beginPath(); ctx.moveTo(sx - ts, sy); ctx.lineTo(sx, sy + ts * .5); ctx.lineTo(sx, top + ts * .5); ctx.lineTo(sx - ts, top); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mix(col, '#000000', .2); ctx.beginPath(); ctx.moveTo(sx + ts, sy); ctx.lineTo(sx, sy + ts * .5); ctx.lineTo(sx, top + ts * .5); ctx.lineTo(sx + ts, top); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mix(col, '#ffffff', .25); ctx.beginPath(); ctx.moveTo(sx, top - ts * .5); ctx.lineTo(sx + ts, top); ctx.lineTo(sx, top + ts * .5); ctx.lineTo(sx - ts, top); ctx.closePath(); ctx.fill();
    if (bh > ts * 1.6) { const rows = Math.floor(bh / (ts * .55)); for (let rw = 0; rw < rows; rw++) for (let side = 0; side < 2; side++) for (let c2 = 0; c2 < 2; c2++) { const ph = hh(gx * 7 + rw, gy * 5 + c2 + side * 3, 9) * 6.28, on = Math.sin(a * (1 + (rw & 1)) + ph) > .1 - hh(gx, gy, 8) * .9; if (!on) continue; const fx = side ? ts * (.2 + c2 * .42) : -ts * (.2 + c2 * .42) - ts * .26, fy = sy - ts * .45 - rw * ts * .55 + (side ? 1 : -1) * (c2 * .21 + .1) * ts * .5 + ts * .1; ctx.fillStyle = rgba('#ffe9a8', .85); ctx.fillRect(sx + fx, fy, ts * .24, ts * .3); } }
  }
}
function drawRoseWindow(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, m = Math.min(w, h), cx = w / 2, cy = h / 2, Rm = m * .47;
  ctx.fillStyle = mix(C[0], '#050408', .8); ctx.fillRect(0, 0, w, h);
  const rings = [[0, .16, 1], [.16, .4, 8], [.4, .66, 16], [.66, .86, 24], [.86, 1, 32]];
  rings.forEach(([r0, r1, n], ri) => {
    const k = Math.max(4, Math.round(n * (.5 + dt / 2) / 4) * 4);
    for (let i = 0; i < k; i++) {
      const a0 = i / k * 6.283 - 1.5708, a1 = (i + 1) / k * 6.283 - 1.5708, c = C[(i + ri * 2) % 5], sh = .5 + .5 * Math.sin(a + i * .9 + ri * 1.7);
      ctx.beginPath(); if (r0 === 0) { ctx.arc(cx, cy, Rm * r1, 0, 7); } else { ctx.arc(cx, cy, Rm * r1, a0, a1); ctx.arc(cx, cy, Rm * r0, a1, a0, true); ctx.closePath(); }
      const g = ctx.createRadialGradient(cx, cy, Rm * r0, cx, cy, Rm * r1); g.addColorStop(0, mix(c, '#ffffff', .15 + .35 * sh)); g.addColorStop(1, mix(c, '#000000', .35 - .2 * sh)); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = m * .006; ctx.strokeStyle = '#08060a'; ctx.stroke();
    }
  });
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rm * .16); g.addColorStop(0, rgba('#fff4cf', .95)); g.addColorStop(1, rgba(C[2], .2)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rm * .15, 0, 7); ctx.fill();
  ctx.lineWidth = m * .014; ctx.strokeStyle = '#08060a'; ctx.beginPath(); ctx.arc(cx, cy, Rm, 0, 7); ctx.stroke(); ctx.lineWidth = m * .004; ctx.strokeStyle = rgba(C[2], .7); ctx.beginPath(); ctx.arc(cx, cy, Rm * 1.04, 0, 7); ctx.stroke();
}
function drawTarot(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.min(w, h), dark = lum(C[0]) < .5, paper = dark ? mix(C[0], '#0d0a18', .5) : mix(C[4], '#f3e6c8', .55), ink = dark ? mix(C[3], '#f3e6c8', .6) : mix(C[0], '#1a1020', .7), acc = C[2], acc2 = C[1];
  ctx.fillStyle = paper; ctx.fillRect(0, 0, w, h);
  const pad = m * .06; ctx.lineWidth = m * .006; ctx.strokeStyle = ink; ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2); ctx.lineWidth = m * .002; ctx.strokeRect(pad * 1.5, pad * 1.5, w - pad * 3, h - pad * 3);
  const cx = w / 2, cy = h * .5, r = m * .17, nr = Math.round(24 * (.5 + dt / 2) / 2) * 2, off = a / 12 * 1 * (nr / 12) * 0 + (t / 16) * (6.283 / (nr / 2)) * 2;
  for (let i = 0; i < nr; i++) { const an = i / nr * 6.283 + (t / 16) * 6.283 / (nr / 2), len = r * (i % 2 ? 1.4 : 1.65); ctx.save(); ctx.translate(cx, cy); ctx.rotate(an); ctx.beginPath(); if (i % 2) { ctx.moveTo(r * 1.1, 0); for (let s = 1; s <= 8; s++) ctx.lineTo(r * 1.1 + (len - r * 1.1) * s / 8, (s % 2 ? 1 : -1) * r * .035); } else { ctx.moveTo(r * 1.1, -r * .06); ctx.lineTo(len, 0); ctx.lineTo(r * 1.1, r * .06); ctx.closePath(); } ctx.fillStyle = i % 2 ? 'rgba(0,0,0,0)' : acc; ctx.strokeStyle = acc; ctx.lineWidth = m * .003; i % 2 ? ctx.stroke() : ctx.fill(); ctx.restore(); }
  ctx.fillStyle = acc2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.lineWidth = m * .008; ctx.strokeStyle = ink; ctx.stroke(); ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(cx, cy, r * .72, 0, 7); ctx.fill(); ctx.lineWidth = m * .003; ctx.stroke();
  ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(cx - r * .24, cy - r * .12, r * .06, 0, 7); ctx.arc(cx + r * .24, cy - r * .12, r * .06, 0, 7); ctx.fill(); ctx.lineWidth = m * .006; ctx.beginPath(); ctx.arc(cx, cy + r * .05, r * .3, .25, 2.9); ctx.stroke();
  for (let i = 0; i < 26; i++) { const x = pad * 2.2 + R() * (w - pad * 4.4), y = pad * 2.2 + R() * (h - pad * 4.4), ph = R() * 6.28, tw = .35 + .65 * Math.max(0, Math.sin(a * (1 + i % 2) + ph)), s = m * .014 * tw; if (Math.hypot(x - cx, y - cy) < r * 2.1 || s < 1) continue; ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(x, y - s * 2); ctx.lineTo(x + s * .5, y - s * .5); ctx.lineTo(x + s * 2, y); ctx.lineTo(x + s * .5, y + s * .5); ctx.lineTo(x, y + s * 2); ctx.lineTo(x - s * .5, y + s * .5); ctx.lineTo(x - s * 2, y); ctx.lineTo(x - s * .5, y - s * .5); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const fs = m * .06; ctx.font = '700 ' + fs + 'px Georgia, "Times New Roman", serif'; ctx.fillText('XIX', cx, pad * 2.6 + fs * .5); ctx.font = '700 ' + fs * .9 + 'px Georgia, "Times New Roman", serif'; ctx.fillText('THE SUN', cx, h - pad * 2.6 - fs * .5);
}
function drawStarTrails(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), px = w * .55, py = h * .42;
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], '#03040a', .75)); g.addColorStop(1, mix(C[1], '#0b1030', .55)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  g = ctx.createRadialGradient(w * .3, h, 0, w * .3, h, m * .8); g.addColorStop(0, rgba(C[2], .25)); g.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const N = Math.round(150 + 450 * dt); ctx.lineCap = 'round';
  for (let i = 0; i < N; i++) { const rr = Math.pow(R(), .75) * m * 1.15 + m * .01, th = R() * 6.283, br = .25 + .75 * R(), c = i % 7 === 0 ? C[3] : (i % 5 === 0 ? C[2] : '#ffffff'), tl = .16 + .22 * br; ctx.beginPath(); ctx.arc(px, py, rr, th + a - tl, th + a); ctx.lineWidth = Math.max(.6, m * (.0006 + .0016 * br)); ctx.strokeStyle = rgba(mix(c, '#ffffff', .4), .25 + .6 * br); ctx.stroke(); }
  ctx.fillStyle = '#04050a'; ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w + 2; x += w / 70) ctx.lineTo(x, h * .88 + Math.sin(x / w * 6.283 * 2 + 1) * h * .03 + Math.sin(x / w * 6.283 * 7) * h * .008); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 12; i++) { const x = R() * w, y = h * .9 + R() * h * .03, s = m * (.02 + .03 * R()); ctx.beginPath(); ctx.moveTo(x, y - s * 2.4); ctx.lineTo(x + s * .7, y); ctx.lineTo(x - s * .7, y); ctx.closePath(); ctx.fill(); }
}
function drawRainWindow(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], '#05060e', .7)); g.addColorStop(1, mix(C[1], '#0d0a1c', .6)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i++) { const x = (R() + Math.sin(a + i) * .01) * w, y = h * (.25 + .7 * R()), r = m * (.02 + .045 * R()), c = C[i % 5], al = (.25 + .35 * R()) * (.8 + .2 * Math.sin(a * (1 + i % 2) + i * 2)); g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, al)); g.addColorStop(.7, rgba(c, al * .7)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(0, 0, w, h);
  const ND = Math.round(40 + 160 * dt); for (let i = 0; i < ND; i++) { const x = R() * w, y = R() * h, r = m * (.0015 + .0035 * R()); g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.7)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(0,0,0,.28)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.25, 0, 0, 7); ctx.fill(); }
  const NS = Math.round(8 + 14 * dt); for (let i = 0; i < NS; i++) { const k = 1 + (i % 2), p = R(), x0 = R() * w, r = m * (.004 + .004 * R()), len = h * (.12 + .15 * R()), y = ((p + t / 16 * k) % 1) * (h + len * 2) - len, x = x0 + Math.sin(y / h * 9 + i) * m * .006;
    ctx.lineWidth = r * 1.1; ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.moveTo(x0 + Math.sin((y - len) / h * 9 + i) * m * .006, y - len); ctx.lineTo(x, y); ctx.stroke(); g = ctx.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r * 1.2); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.5, 'rgba(255,255,255,.2)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.4, 0, 0, 7); ctx.fill(); }
}
function drawGrassField(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), hz = h * .42;
  let g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, C[0]); g.addColorStop(1, mix(C[3], '#ffffff', .35)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  g = ctx.createRadialGradient(w * .7, hz, 0, w * .7, hz, m * .6); g.addColorStop(0, rgba('#fff3c8', .75)); g.addColorStop(1, rgba('#fff3c8', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = mix(C[1], C[3], .55); ctx.beginPath(); ctx.moveTo(0, hz + 2); for (let x = 0; x <= w + 2; x += w / 50) ctx.lineTo(x, hz - Math.sin(x / w * 6.283 * 2 + 1) * h * .03 - Math.sin(x / w * 6.283 * 5) * h * .008); ctx.lineTo(w, hz + 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mix(C[1], '#06140c', .55); ctx.fillRect(0, hz, w, h - hz);
  const N = Math.round(300 + 700 * dt), B = []; for (let i = 0; i < N; i++) B.push({ x: R() * 1.1 * w - .05 * w, z: Math.pow(R(), .8), ph: R() * 6.28, k: R() < .5 ? 1 : 2, c: R() });
  B.sort((p, q) => p.z - q.z); ctx.lineCap = 'round';
  B.forEach(b => { const y = hz + (h - hz) * (.02 + b.z * 1.0), s = .25 + b.z * 1.4, bl = m * .06 * s * (.7 + .6 * b.c), sw = Math.sin(a * b.k + b.ph + b.x / w * 6.283) * bl * .35 + Math.sin(a + b.x / w * 6.283 * 2) * bl * .15; ctx.beginPath(); ctx.moveTo(b.x, y); ctx.quadraticCurveTo(b.x + sw * .4, y - bl * .6, b.x + sw, y - bl); ctx.lineWidth = Math.max(1, m * .0022 * s * 1.6); ctx.strokeStyle = mix(mix(C[1], '#06140c', .45 - b.z * .35), mix(C[2], '#d9ff9a', .35), b.c * .5 + b.z * .4); ctx.stroke(); });
}
