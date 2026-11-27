/* ---------- live scenes: layered, moving, lit ---------- */
function drawLake(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, hz = h * (port ? .6 : .6), dk = (c, k) => mix(c, '#04060f', k), TAU = Math.PI * 2;
  const sky = ctx.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, dk(C[4], .82)); sky.addColorStop(.55, dk(mix(C[4], C[1], .35), .45)); sky.addColorStop(1, mix(C[2], C[3], .45)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz + 2);
  for (let i = 0; i < 150; i++) { const x = R() * w, y = R() * hz * .75, k = 1 + Math.floor(R() * 3), tw = .35 + .65 * Math.pow(.5 + .5 * Math.sin(a * k + R() * 6.28), 2); ctx.fillStyle = 'rgba(255,255,255,' + (tw * (1 - y / hz) * .9) + ')'; ctx.beginPath(); ctx.arc(x, y, m * (.0006 + R() * .0012), 0, 7); ctx.fill(); }
  const mx = w * (port ? .68 : .72), my = hz * .3, mr = m * .04, mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 7); mg.addColorStop(0, 'rgba(255,248,225,.5)'); mg.addColorStop(1, 'rgba(255,248,225,0)'); ctx.fillStyle = mg; ctx.fillRect(0, 0, w, hz); ctx.fillStyle = '#fff8e6'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
  const sp = (((t / 16) % 1) + 1) % 1, su = (sp - .2) / .12; if (su > 0 && su < 1) { const x0 = w * .15 + su * w * .25, y0 = hz * .08 + su * hz * .18; const g = ctx.createLinearGradient(x0 - m * .12, y0 - m * .04, x0, y0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,' + (1 - su) + ')'); ctx.strokeStyle = g; ctx.lineWidth = Math.max(2, m * .002); ctx.beginPath(); ctx.moveTo(x0 - m * .12, y0 - m * .04); ctx.lineTo(x0, y0); ctx.stroke(); }
  const layer = (base, amp, col, seed, ks) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hz + 2); const st = Math.max(5, w / 160); for (let x = 0; x <= w + st; x += st) { const nx = x / w; let y = 0; ks.forEach((k, i) => { y += Math.abs(Math.sin(nx * k * Math.PI + seed + i * 1.3)) / (1 + i * .8); }); ctx.lineTo(x, base - amp * y); } ctx.lineTo(w, hz + 2); ctx.closePath(); ctx.fill(); };
  layer(hz * .96, hz * .2, mix(dk(C[4], .5), C[3], .15), d.seed, [1.3, 3.1, 7.3]); layer(hz, hz * .18, dk(mix(C[4], C[1], .3), .6), d.seed + 2, [1.9, 4.3, 9.1]); layer(hz * 1.01, hz * .12, dk(C[4], .88), d.seed + 5, [2.7, 5.9, 13]);
  for (let i = 0; i < 4; i++) { const k = 1, x = ((((i / 4) + t / 16 * k) % 1) + 1) % 1 * w * 1.4 - w * .2, y = hz * (.82 + i * .05), g = ctx.createRadialGradient(x, y, 0, x, y, w * .35); g.addColorStop(0, rgba(mix(C[2], '#ffffff', .4), .22)); g.addColorStop(1, rgba(C[2], 0)); ctx.save(); ctx.translate(x, y); ctx.scale(1, .13); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, w * .35, 0, 7); ctx.fill(); ctx.restore(); }
  const lk = ctx.createLinearGradient(0, hz, 0, h); lk.addColorStop(0, dk(C[4], .55)); lk.addColorStop(1, dk(C[4], .9)); ctx.fillStyle = lk; ctx.fillRect(0, hz, w, h - hz);
  [[hz * .96, hz * .2, mix(dk(C[4], .5), C[3], .15), d.seed, [1.3, 3.1, 7.3]], [hz, hz * .18, dk(mix(C[4], C[1], .3), .6), d.seed + 2, [1.9, 4.3, 9.1]], [hz * 1.01, hz * .12, dk(C[4], .88), d.seed + 5, [2.7, 5.9, 13]]].forEach(([base, amp, col, seed, ks]) => { ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hz); const st = Math.max(5, w / 160); for (let x = 0; x <= w + st; x += st) { const nx = x / w; let y = 0; ks.forEach((k, i) => { y += Math.abs(Math.sin(nx * k * Math.PI + seed + i * 1.3)) / (1 + i * .8); }); const yt = base - amp * y, yy = hz + (hz - yt) * .92, off = Math.sin(yy * .05 + a * 2) * m * .004 * (1 + (yy - hz) / (h - hz) * 2) + Math.sin(yy * .013 + a) * m * .003; ctx.lineTo(x + off, Math.min(yy, h)); } ctx.lineTo(w, hz); ctx.closePath(); ctx.fill(); ctx.restore(); });
  const wg = ctx.createLinearGradient(0, hz, 0, h); wg.addColorStop(0, rgba(C[4], .1)); wg.addColorStop(1, rgba(dk(C[4], .9), .5)); ctx.fillStyle = wg; ctx.fillRect(0, hz, w, h - hz);
  ctx.strokeStyle = 'rgba(255,248,225,.5)'; for (let i = 0; i < 26; i++) { const yy = hz + (h - hz) * Math.pow(R(), 1.5), len = m * (.01 + R() * .03) * (1 + (yy - hz) / (h - hz) * 2), x = mx + (R() - .5) * (m * .1) * (1 + (yy - hz) / (h - hz) * 2), al = Math.pow(Math.max(0, Math.sin(a * (1 + Math.floor(R() * 3)) + R() * 6.28)), 3) * .6; ctx.globalAlpha = al; ctx.lineWidth = Math.max(1.5, m * .0012); ctx.beginPath(); ctx.moveTo(x - len / 2, yy); ctx.lineTo(x + len / 2, yy); ctx.stroke(); } ctx.globalAlpha = 1;
}
function drawNeonCity(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, gy = h * .86, dk = (c, k) => mix(c, '#04060f', k), BASE = lum(C[0]) < .4 ? mix(C[0], C[1], .12) : mix(C[4], '#04060f', .5), TAU = Math.PI * 2;
  const sky = ctx.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, dk(BASE, .88)); sky.addColorStop(.7, dk(mix(BASE, C[1], .4), .5)); sky.addColorStop(1, mix(C[1], dk(C[3], .3), .5)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const neon = [];
  for (let L = 0; L < 3; L++) {
    const n = (port ? 9 : 18) - L * 2, col = dk(mix(BASE, C[1], .3), .55 + L * .15), top = gy - h * (.62 - L * .14); ctx.fillStyle = col; let x = -w * .02;
    for (let i = 0; i < n; i++) {
      const bw = w / n * (.8 + R() * .7), bh = (h * (.22 + .4 * R())) * (1 - L * .18), by = gy - bh; ctx.fillStyle = col; ctx.fillRect(x, by, bw + 1, bh + 2);
      const ww = Math.max(3, m * .0075), gp = ww * 2.1; for (let wy = by + gp; wy < gy - gp; wy += gp) for (let wx = x + gp * .6; wx < x + bw - gp * .6; wx += gp) { const k = 1 + Math.floor(R() * 3), ph = R() * 6.28, on = R() < .42, bl = Math.sin(a * k + ph) > (R() < .1 ? -.2 : -2); if (on && bl) { ctx.fillStyle = rgba(mix(C[2 + Math.floor(R() * 2)], '#fff6d8', .5), .55 - L * .12); ctx.fillRect(wx, wy, ww, ww * 1.3); } else R(); }
      if (L < 2 && R() < .45) neon.push([x + bw * (.15 + R() * .6), by + bh * (.1 + R() * .3), Math.max(m * .006, bw * .05), bh * (.15 + R() * .3), C[1 + Math.floor(R() * 4)], 1 + Math.floor(R() * 2), R() * 6.28]);
      x += bw;
    }
  }
  const hg = ctx.createRadialGradient(w / 2, gy, 0, w / 2, gy, m * .7); hg.addColorStop(0, rgba(C[1], .35)); hg.addColorStop(1, rgba(C[1], 0)); ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; neon.forEach(n => { const al = .55 + .45 * Math.sin(a * n[5] + n[6]); ctx.shadowColor = n[4]; ctx.shadowBlur = m * .014; ctx.strokeStyle = rgba(mix(n[4], '#ffffff', .35), al); ctx.lineWidth = n[2]; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(n[0], n[1]); ctx.lineTo(n[0], n[1] + n[3]); ctx.stroke(); ctx.shadowBlur = 0; }); ctx.restore();
  const st = ctx.createLinearGradient(0, gy, 0, h); st.addColorStop(0, dk(BASE, .6)); st.addColorStop(1, dk(BASE, .92)); ctx.fillStyle = st; ctx.fillRect(0, gy, w, h - gy);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; neon.forEach(n => { const al = (.55 + .45 * Math.sin(a * n[5] + n[6])) * .35, g = ctx.createLinearGradient(0, gy, 0, h); g.addColorStop(0, rgba(n[4], al)); g.addColorStop(1, rgba(n[4], 0)); ctx.fillStyle = g; ctx.fillRect(n[0] - n[2] * 3, gy, n[2] * 6, h - gy); }); ctx.restore();
  ctx.strokeStyle = 'rgba(220,235,255,.28)'; ctx.lineWidth = Math.max(1.5, m * .001); ctx.lineCap = 'round';
  for (let i = 0; i < 260; i++) { const x0 = R() * w * 1.2, y0 = R() * h, k = 3 + Math.floor(R() * 3), len = m * (.02 + R() * .025), y = (((y0 + t / 16 * k * (h + len)) % (h + len)) + h + len) % (h + len) - len, x = x0 - y * .18; ctx.globalAlpha = .25 + .5 * R(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * .18, y + len); ctx.stroke(); } ctx.globalAlpha = 1;
}
function drawSeaSunset(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, hz = h * (port ? .5 : .52), cx = w * (port ? .5 : .5), dk = (c, k) => mix(c, '#04060f', k);
  const sky = ctx.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, dk(C[4], .5)); sky.addColorStop(.6, mix(C[1], C[3], .5)); sky.addColorStop(1, mix(C[2], '#fff2d8', .5)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz + 2);
  for (let i = 0; i < 6; i++) { const y = hz * (.15 + .6 * R()), len = w * (.25 + .35 * R()), x = ((((R() + t / 16) % 1) + 1) % 1) * w * 1.6 - w * .3, g = ctx.createLinearGradient(x, 0, x + len, 0); g.addColorStop(0, rgba(mix(C[3], '#ffffff', .3), 0)); g.addColorStop(.5, rgba(mix(C[3], '#ffffff', .35), .45)); g.addColorStop(1, rgba(mix(C[3], '#ffffff', .3), 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + len / 2, y, len / 2, hz * .02 + R() * hz * .012, 0, 0, 7); ctx.fill(); }
  const sr = m * .055, sy = hz - sr * .15, sg = ctx.createRadialGradient(cx, sy, 0, cx, sy, sr * 6); sg.addColorStop(0, 'rgba(255,240,200,.85)'); sg.addColorStop(.2, rgba(C[2], .4)); sg.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = sg; ctx.fillRect(0, 0, w, hz + 2); ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(cx, sy, sr, Math.PI, 0); ctx.fill();
  const sea = ctx.createLinearGradient(0, hz, 0, h); sea.addColorStop(0, mix(C[2], C[3], .5)); sea.addColorStop(.25, mix(C[3], C[4], .5)); sea.addColorStop(1, dk(C[4], .8)); ctx.fillStyle = sea; ctx.fillRect(0, hz, w, h - hz);
  const N = 46; ctx.lineCap = 'round';
  for (let j = N - 1; j >= 0; j--) { const u = j / N, y = hz + (h - hz) * u * u, dy = (h - hz) * (2 * u / N), amp = dy * (.25 + .6 * u), lw = Math.max(1, dy * .22), st = Math.max(8, w / 120); ctx.beginPath(); for (let x = -st; x <= w + st; x += st) { const yy = y + Math.sin(x / w * (6 + u * 5) * Math.PI + a * (1 + (j % 2)) + j * 1.7) * amp * .5 + Math.sin(x / w * 17 - a * 2 + j) * amp * .18; x <= -st + .1 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.strokeStyle = rgba(dk(C[4], .55 + (1 - u) * .1), .3 + .35 * u); ctx.lineWidth = lw; ctx.stroke(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 420; i++) { const u = Math.pow(R(), .8), y = hz + (h - hz) * u * u + 1, spread = m * (.05 + u * .35), x = cx + (R() - .5) * spread * (1 - .35 * R()), len = m * (.004 + u * .03) * (.5 + R()), k = 1 + Math.floor(R() * 3), al = Math.pow(Math.max(0, Math.sin(a * k + R() * 6.28)), 4) * (.9 - u * .4); ctx.fillStyle = 'rgba(255,238,190,' + al + ')'; ctx.fillRect(x - len / 2, y, len, Math.max(1.5, m * .0015 * (1 + u * 2))); }
  ctx.restore();
}
function drawBlossom(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, dk = (c, k) => mix(c, '#04060f', k), TAU = Math.PI * 2;
  const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, dk(C[4], .6)); sky.addColorStop(.6, mix(C[3], C[1], .5)); sky.addColorStop(1, mix(C[2], '#ffe3ee', .5)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const mx = w * (port ? .3 : .28), my = h * (port ? .3 : .3), mr = m * (port ? .1 : .075), mg = ctx.createRadialGradient(mx, my, mr * .8, mx, my, mr * 4.5); mg.addColorStop(0, 'rgba(255,245,235,.5)'); mg.addColorStop(1, 'rgba(255,245,235,0)'); ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff5ea'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fill();
  const wood = dk(mix(C[4], '#1a0f12', .5), .3), tips = [];
  const branch = (x, y, ang, len, wd, depth) => { const sw = Math.sin(a + depth) * .01, x2 = x + Math.cos(ang + sw) * len, y2 = y + Math.sin(ang + sw) * len, cxp = (x + x2) / 2 + Math.cos(ang + 1.57) * len * .12 * (R() - .5), cyp = (y + y2) / 2 + Math.sin(ang + 1.57) * len * .12 * (R() - .5); ctx.strokeStyle = wood; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(cxp, cyp, x2, y2); ctx.stroke(); if (depth >= 2) tips.push([x2, y2, depth]); if (depth < 5) { branch(x2, y2, ang + (R() * .5 + .15), len * .74, wd * .68, depth + 1); if (R() < .85) branch(x2, y2, ang - (R() * .5 + .15), len * .7, wd * .62, depth + 1); } };
  branch(w * 1.02, h * (port ? .05 : .1), Math.PI * (port ? .78 : .86), m * (port ? .34 : .27), m * .017, 0); branch(w * 1.02, h * (port ? .24 : .3), Math.PI * .93, m * .22, m * .011, 1);
  tips.forEach((p, i) => { const n = 3 + (i % 3), sz = m * (.008 + R() * .006); for (let k = 0; k < n; k++) { const bx = p[0] + (R() - .5) * sz * 4, by = p[1] + (R() - .5) * sz * 4, c = C[1 + (i + k) % 2]; ctx.fillStyle = rgba(mix(c, '#ffffff', .3), .95); for (let q = 0; q < 5; q++) { const an = q * TAU / 5 + k; ctx.beginPath(); ctx.ellipse(bx + Math.cos(an) * sz * .7, by + Math.sin(an) * sz * .7, sz * .65, sz * .4, an, 0, 7); ctx.fill(); } ctx.fillStyle = C[3]; ctx.beginPath(); ctx.arc(bx, by, sz * .22, 0, 7); ctx.fill(); } });
  const np = 70 + Math.round(o.detail * .6), H = h * 1.1;
  for (let i = 0; i < np; i++) { const x0 = R() * w * 1.3, y0 = R() * H, k = 1 + Math.floor(R() * 2), sz = m * (.004 + R() * .008), ph = R() * 6.28, y = (((y0 + t / 16 * k * H) % H) + H) % H - h * .05, x = x0 - y * .25 + Math.sin(a * (1 + i % 2) + ph) * m * .02, rot = a * (1 + i % 3) + ph; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, .55 + .45 * Math.cos(a * 2 + ph)); const c = C[1 + i % 2]; ctx.fillStyle = rgba(mix(c, '#ffffff', .35), .55 + .4 * R()); ctx.beginPath(); ctx.ellipse(0, 0, sz, sz * .6, 0, 0, 7); ctx.fill(); ctx.restore(); }
}
function drawFireworks(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, dk = (c, k) => mix(c, '#04060f', k), sp = (((t / 16) % 1) + 1) % 1, B = 6, gy = h * .9;
  const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, dk(C[4], .92)); sky.addColorStop(1, dk(mix(C[4], C[1], .3), .6)); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 100; i++) { ctx.fillStyle = 'rgba(255,255,255,' + (.15 + .45 * R()) + ')'; ctx.beginPath(); ctx.arc(R() * w, R() * h * .7, m * (.0006 + R() * .001), 0, 7); ctx.fill(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let b = 0; b < B; b++) {
    const cx = (.15 + .7 * R()) * w, cy = (.15 + .4 * R()) * h, c1 = C[1 + b % 4], c2 = C[1 + (b + 1) % 4], n = 70 + Math.round(o.detail * .6), rad = m * (.12 + .08 * R()), u = (((sp - b / B) % 1) + 1) % 1 / .4;
    const parts = []; for (let j = 0; j < n; j++) parts.push([R() * 6.2832, .35 + R() * .65, R() < .5]);
    if (u >= 1) continue; const e = 1 - Math.pow(1 - u, 2.4), al = Math.pow(1 - u, 1.4);
    if (u < .12) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * .8); g.addColorStop(0, rgba(mix(c1, '#ffffff', .6), (1 - u / .12) * .6)); g.addColorStop(1, rgba(c1, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
    parts.forEach(p => { for (let tr = 0; tr < 5; tr++) { const uu = Math.max(0, u - tr * .018), ee = 1 - Math.pow(1 - uu, 2.4), x = cx + Math.cos(p[0]) * rad * p[1] * ee, y = cy + Math.sin(p[0]) * rad * p[1] * ee + uu * uu * rad * .45; ctx.fillStyle = rgba(p[2] ? c1 : c2, al * (1 - tr / 5) * .9); ctx.beginPath(); ctx.arc(x, y, m * (.0028 - tr * .0004), 0, 7); ctx.fill(); } });
  }
  ctx.restore();
  ctx.fillStyle = dk(C[4], .95); ctx.beginPath(); ctx.moveTo(0, h); let x = 0; ctx.lineTo(0, gy); while (x < w) { const bw = m * (.02 + R() * .035), bh = h * (.02 + R() * .06); ctx.lineTo(x, gy - bh); ctx.lineTo(x + bw, gy - bh); x += bw; } ctx.lineTo(w, gy); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
}
function drawWarp(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), cx = w / 2, cy = h * (w < h ? .5 : .5), Rm = Math.hypot(w, h) * .55, n = 380 + Math.round(o.detail * 5), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#04050c', .8);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .8); bg.addColorStop(0, mix(base, C[1], .22)); bg.addColorStop(.5, mix(base, '#000000', .3)); bg.addColorStop(1, mix(base, '#000000', .7)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3; i++) { const an = a + i * 2.1, g = ctx.createRadialGradient(cx + Math.cos(an) * m * .12, cy + Math.sin(an) * m * .12, 0, cx, cy, m * .5); g.addColorStop(0, rgba(C[1 + i], .22)); g.addColorStop(1, rgba(C[1 + i], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const th = R() * 6.2832, z0 = R(), k = 1 + Math.floor(R() * 2), c = C[1 + i % 4], z = (((z0 + t / 16 * k) % 1) + 1) % 1, z2 = Math.max(0, z - .07 * (.5 + R()) * (.4 + z)), r1 = z * z * Rm, r0 = z2 * z2 * Rm, cs = Math.cos(th), sn = Math.sin(th); const g = ctx.createLinearGradient(cx + cs * r0, cy + sn * r0, cx + cs * r1, cy + sn * r1); g.addColorStop(0, rgba(c, 0)); g.addColorStop(1, rgba(mix(c, '#ffffff', .4 + .4 * z), Math.min(1, .15 + z * .95))); ctx.strokeStyle = g; ctx.lineWidth = Math.max(1, m * (.0008 + z * z * .004)); ctx.beginPath(); ctx.moveTo(cx + cs * r0, cy + sn * r0); ctx.lineTo(cx + cs * r1, cy + sn * r1); ctx.stroke(); }
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .09); cg.addColorStop(0, 'rgba(255,255,255,.5)'); cg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawDeepSea(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), dk = (c, k) => mix(c, '#02040a', k), TAU = Math.PI * 2;
  const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mix(dk(C[4], .35), C[1], .25)); bg.addColorStop(.5, dk(C[4], .7)); bg.addColorStop(1, dk(C[4], .93)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) { const x0 = w * (.1 + .8 * R()), sway = Math.sin(a + i * 1.3) * w * .03, wd = w * (.03 + .05 * R()), g = ctx.createLinearGradient(0, 0, 0, h * .85); g.addColorStop(0, rgba(mix(C[2], '#ffffff', .4), .22)); g.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - wd * .3 + sway * .3, 0); ctx.lineTo(x0 + wd * .3 + sway * .3, 0); ctx.lineTo(x0 + wd * 2 + sway, h * .85); ctx.lineTo(x0 - wd * 2 + sway, h * .85); ctx.closePath(); ctx.fill(); }
  for (let i = 0; i < 90; i++) { const x = R() * w, y0 = R() * h, k = 1, y = (((y0 - t / 16 * k * h) % h) + h) % h, r = m * (.0008 + R() * .0025); ctx.fillStyle = 'rgba(200,240,255,' + (.1 + .35 * R()) + ')'; ctx.beginPath(); ctx.arc(x + Math.sin(a * 2 + i) * m * .006, y, r, 0, 7); ctx.fill(); }
  const nj = 4 + Math.round(o.detail / 30);
  for (let j = 0; j < nj; j++) {
    const c = C[1 + j % 4], r = m * (.04 + .05 * R()), x = w * (.15 + .7 * R()) + Math.sin(a + j * 2) * m * .03, y = h * (.2 + .55 * R()) + Math.sin(a * (1 + j % 2) + j) * m * .05, pulse = 1 + .1 * Math.sin(a * 4 + j), sq = 1 - .12 * Math.sin(a * 4 + j);
    ctx.save(); ctx.translate(x, y); ctx.scale(pulse, sq);
    const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3.2); gg.addColorStop(0, rgba(c, .28)); gg.addColorStop(1, rgba(c, 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, r * 3.2, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(mix(c, '#ffffff', .3), .5); ctx.lineWidth = Math.max(1.5, r * .035);
    for (let q = 0; q < 9; q++) { const ox = (q / 8 - .5) * r * 1.6; ctx.beginPath(); for (let s = 0; s <= 24; s++) { const yy = s / 24 * r * (2.2 + (q % 3) * .6), xx = ox + Math.sin(s * .45 + a * 2 + q * 1.1) * r * .09 * (s / 24 + .2); s ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    const bell = ctx.createRadialGradient(0, -r * .2, 0, 0, 0, r); bell.addColorStop(0, rgba(mix(c, '#ffffff', .7), .85)); bell.addColorStop(.6, rgba(c, .5)); bell.addColorStop(1, rgba(c, .15)); ctx.fillStyle = bell; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.bezierCurveTo(-r, -r * 1.2, r, -r * 1.2, r, 0); ctx.quadraticCurveTo(r * .5, r * .18, 0, 0); ctx.quadraticCurveTo(-r * .5, r * .18, -r, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(mix(c, '#ffffff', .6), .7); ctx.lineWidth = Math.max(1.5, r * .03); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.bezierCurveTo(-r, -r * 1.2, r, -r * 1.2, r, 0); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
function drawSmoke(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, asp = h / w, cw = clamp(Math.round(w / 4), 200, 480), ch = Math.round(cw * asp), dk = lum(C[0]) < .3 ? C[0] : mix(C[4], '#04050c', .85), pal = ramp([dk, mix(dk, C[4], .5), C[1], C[2], mix(C[3], '#ffffff', .55)], 96).map(h2r), cv = makeCanvas(cw, ch), cx = cv.getContext('2d'), id = cx.createImageData(cw, ch), D = id.data, s = d.seed * .29;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    let X = x / cw * 3, Y = y / cw * 3;
    for (let i = 0; i < 4; i++) { const sg = i % 2 ? 1 : -1; X += .5 * Math.sin(Y * 1.7 + i * 1.9 + a * sg + s); Y += .5 * Math.cos(X * 1.5 + i * 2.3 - a * sg + s); }
    const f = .5 + .5 * Math.sin(X * 2.2 + Y * 1.1 + a), w2 = Math.abs(Math.sin(X * 3.1 - Y * 2.7 + a * 2)), val = clamp(Math.pow(1 - Math.abs(2 * f - 1), 3) + .4 * Math.pow(w2, 6), 0, 1), c = pal[Math.min(95, Math.floor(val * 96))], k = (y * cw + x) * 4;
    D[k] = c[0]; D[k + 1] = c[1]; D[k + 2] = c[2]; D[k + 3] = 255;
  }
  cx.putImageData(id, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, w, h);
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}
