/* ---------- aesthetics: riso, blueprint, zen ink, memphis, sci-fi HUD, film leak, terrazzo, art deco ---------- */
function drawRiso(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), paper = lum(C[0]) < .45 ? C[0] : mix(C[0], '#f2e9d8', .45), inks = [C[1], C[3], C[2]], S = [];
  ctx.fillStyle = paper; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 7; i++) S.push({ k: i % 5, x: .12 + .76 * R(), y: .12 + .76 * R(), s: m * (.1 + .13 * R()), ink: i % 3, ph: R() * 6.28, kk: 1 + Math.floor(R() * 2), rot: Math.floor(R() * 4) * Math.PI / 2, ht: i % 2 === 1 });
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  S.forEach(s => {
    const mx = Math.sin(a + s.ink * 2) * m * .005, my = Math.cos(a + s.ink * 1.7) * m * .005, x = (s.x + Math.sin(a * s.kk + s.ph) * .02) * w + mx, y = (s.y + Math.cos(a * s.kk + s.ph) * .02) * h + my, r = s.s, c = inks[s.ink];
    ctx.save(); ctx.translate(x, y); ctx.rotate(s.rot); ctx.beginPath();
    if (s.k === 0) ctx.arc(0, 0, r, 0, 7); else if (s.k === 1) ctx.arc(0, 0, r, Math.PI, 0); else if (s.k === 2) { ctx.moveTo(-r * .7, r); ctx.lineTo(-r * .7, 0); ctx.arc(0, 0, r * .7, Math.PI, 0); ctx.lineTo(r * .7, r); ctx.closePath(); } else if (s.k === 3) { ctx.moveTo(0, -r); ctx.lineTo(r * .95, r * .75); ctx.lineTo(-r * .95, r * .75); ctx.closePath(); } else ctx.roundRect(-r, -r * .4, r * 2, r * .8, r * .4);
    if (!s.ht) { ctx.fillStyle = rgba(c, .92); ctx.fill(); } else { ctx.clip(); const cell = m * .011; ctx.fillStyle = c; for (let gy = -r * 1.2; gy < r * 1.2; gy += cell) for (let gx = -r * 1.2; gx < r * 1.2; gx += cell) { const g = clamp((gy + r) / (2 * r), 0, 1), rr = cell * .62 * (1 - g * .92), px = gx + ((Math.round(gy / cell) & 1) ? cell / 2 : 0); if (rr > .4) { ctx.beginPath(); ctx.arc(px, gy, rr, 0, 7); ctx.fill(); } } }
    ctx.restore();
  });
  ctx.restore();
  ctx.fillStyle = rgba(paper, .5); for (let i = 0; i < 160; i++) { ctx.beginPath(); ctx.arc(R() * w, R() * h, m * (.0005 + R() * .0016), 0, 7); ctx.fill(); }
  const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900))); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .15; ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawBlueprint(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h), mn = Math.min(w, h), bg = mix('#0d3b8e', C[4], .22), ink = mix('#e8f1ff', C[2], .12), acc = C[1], cx = w / 2, cy = h * (w < h ? .5 : .5), R = mn * (w < h ? .36 : .3), lw = Math.max(1.5, m * .0013), TAU = Math.PI * 2;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .75); g.addColorStop(0, mix(bg, '#ffffff', .08)); g.addColorStop(1, mix(bg, '#000000', .25)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const gs = m / 48; for (let i = 0; i * gs < w + gs; i++) { ctx.strokeStyle = rgba(ink, i % 5 ? .07 : .2); ctx.lineWidth = i % 5 ? lw * .6 : lw; ctx.beginPath(); ctx.moveTo(i * gs, 0); ctx.lineTo(i * gs, h); ctx.stroke(); } for (let j = 0; j * gs < h + gs; j++) { ctx.strokeStyle = rgba(ink, j % 5 ? .07 : .2); ctx.lineWidth = j % 5 ? lw * .6 : lw; ctx.beginPath(); ctx.moveTo(0, j * gs); ctx.lineTo(w, j * gs); ctx.stroke(); }
  ctx.strokeStyle = rgba(ink, .9); ctx.lineWidth = lw * 1.6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.lineWidth = lw; [.62, .3].forEach(k => { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 7); ctx.stroke(); });
  const dl = R * .3 * TAU / 24; ctx.setLineDash([dl, dl * .6]); ctx.lineDashOffset = -(t / 16) * (dl * 1.6) * 40; ctx.strokeStyle = rgba(ink, .6); ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = rgba(ink, .75); ctx.lineWidth = lw; ctx.beginPath(); for (let k = 0; k <= 6; k++) { const an = a / 6 + k * TAU / 6, x = cx + Math.cos(an) * R * .62, y = cy + Math.sin(an) * R * .62; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - R * 1.5, cy); ctx.lineTo(cx + R * 1.5, cy); ctx.moveTo(cx, cy - R * 1.5); ctx.lineTo(cx, cy + R * 1.5); ctx.stroke();
  for (let k = -15; k <= 15; k++) { const tl = k % 5 ? R * .02 : R * .045; ctx.beginPath(); ctx.moveTo(cx + k * R * .1, cy - tl); ctx.lineTo(cx + k * R * .1, cy + tl); ctx.stroke(); }
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.strokeStyle = acc; ctx.lineWidth = lw * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R * 1.05, 0); ctx.stroke(); const sw = ctx.createLinearGradient(0, 0, R, 0); ctx.fillStyle = rgba(acc, .16); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 1.05, -.7, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(R * 1.05, 0, R * .025, 0, 7); ctx.fill(); ctx.restore();
  const fs = Math.max(12, mn * .022); ctx.font = '500 ' + fs + 'px ui-monospace,Menlo,Consolas,monospace'; ctx.fillStyle = rgba(ink, .9); ctx.textBaseline = 'middle'; ctx.textAlign = 'center'; const dy = cy + R * 1.42; ctx.strokeStyle = rgba(ink, .8);
  ctx.beginPath(); ctx.moveTo(cx - R, dy); ctx.lineTo(cx + R, dy); ctx.moveTo(cx - R, dy - fs); ctx.lineTo(cx - R, dy + fs); ctx.moveTo(cx + R, dy - fs); ctx.lineTo(cx + R, dy + fs); ctx.stroke(); ctx.fillStyle = bg; ctx.fillRect(cx - fs * 3.2, dy - fs * .8, fs * 6.4, fs * 1.6); ctx.fillStyle = rgba(ink, .95); ctx.fillText('⌀ ' + Math.round(R * 2), cx, dy);
  const bw = Math.min(w * .6, fs * 14), bh = fs * 4.6, bx = w - bw - mn * .04, by = h - bh - mn * .04; ctx.strokeStyle = rgba(ink, .8); ctx.lineWidth = lw; ctx.strokeRect(bx, by, bw, bh); ctx.beginPath(); ctx.moveTo(bx, by + bh / 2); ctx.lineTo(bx + bw, by + bh / 2); ctx.moveTo(bx + bw * .55, by + bh / 2); ctx.lineTo(bx + bw * .55, by + bh); ctx.stroke(); ctx.textAlign = 'left'; ctx.fillText('PIGMENT  /  SHEET 01', bx + fs * .6, by + bh * .25); ctx.fillText('REV ' + (1 + d.seed % 9), bx + fs * .6, by + bh * .75); ctx.fillText('1:' + (10 + d.seed % 90), bx + bw * .6, by + bh * .75);
}
function drawZenInk(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), mn = Math.min(w, h), port = w < h, light = lum(C[0]) > .45, paper = light ? mix(C[0], '#f4efe4', .55) : C[0], ink = light ? mix(C[4], '#0a0a0a', .78) : mix(C[3], '#ffffff', .7), TAU = Math.PI * 2;
  const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mix(paper, '#ffffff', light ? .35 : .05)); bg.addColorStop(1, paper); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const sx = w * (port ? .72 : .74), sy = h * (port ? .22 : .3); ctx.fillStyle = rgba(C[1], .92); ctx.beginPath(); ctx.arc(sx, sy, mn * .07, 0, 7); ctx.fill();
  const layers = [[.58, .09, .14], [.7, .13, .26], [.84, .17, .5]];
  layers.forEach(([by, amp, al], L) => {
    ctx.fillStyle = rgba(ink, al); ctx.beginPath(); ctx.moveTo(0, h); const st = Math.max(6, w / 140);
    for (let x = 0; x <= w + st; x += st) { const nx = x / w; let y = by * h - amp * h * (Math.pow(Math.abs(Math.sin(nx * (2.2 + L * .9) * Math.PI + d.seed + L * 2)), 1.4) * .8 + .25 * Math.abs(Math.sin(nx * 11 + L * 3 + d.seed)) + .08 * Math.sin(nx * 37 + L)); ctx.lineTo(x, y); } ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 2; k++) { const mx = (((k * .5 + L * .23) + Math.sin(a + L + k) * .04) % 1 + 1) % 1 * w, my = (by + .015 - k * .03) * h, mw = w * .7, mhh = h * .07, g = ctx.createRadialGradient(mx, my, 0, mx, my, mw * .5); g.addColorStop(0, rgba(paper, .78)); g.addColorStop(1, rgba(paper, 0)); ctx.save(); ctx.translate(mx, my); ctx.scale(1, mhh / (mw * .5)); ctx.translate(-mx, -my); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, mw * .5, 0, 7); ctx.fill(); ctx.restore(); }
  });
  const ex = w * (port ? .42 : .34), ey = h * (port ? .38 : .44), er = mn * (port ? .27 : .2), st0 = .35 + Math.sin(a) * .03, span = TAU * .93; ctx.fillStyle = rgba(ink, .88);
  for (let pass = 0; pass < 1; pass++) { const N = 90, pts = [], pts2 = []; for (let i = 0; i <= N; i++) { const u = i / N, th = st0 + u * span, wd = er * (.2 * Math.pow(1 - u, .7) + .028 + .02 * Math.sin(u * 20)), rr = er + Math.sin(u * 9 + d.seed) * er * .012; pts.push([ex + Math.cos(th) * (rr + wd / 2), ey + Math.sin(th) * (rr + wd / 2)]); pts2.push([ex + Math.cos(th) * (rr - wd / 2), ey + Math.sin(th) * (rr - wd / 2)]); } ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = N; i >= 0; i--) ctx.lineTo(pts2[i][0], pts2[i][1]); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = rgba(ink, .22); ctx.lineWidth = Math.max(1, mn * .0012); for (let i = 0; i < 26; i++) { const u = R() * .85, th0 = st0 + u * span, len = .12 + R() * .35, rr = er + (R() - .35) * er * .17 * (1 - u * .6); ctx.beginPath(); ctx.arc(ex, ey, rr, th0, th0 + len); ctx.stroke(); }
  const hs = mn * .055, hx = w - hs * 2.2, hy = h - hs * 2.4; ctx.fillStyle = rgba(C[1], .9); ctx.beginPath(); ctx.roundRect(hx, hy, hs, hs * 1.25, hs * .12); ctx.fill(); ctx.strokeStyle = rgba(paper, .9); ctx.lineWidth = hs * .09; ctx.beginPath(); ctx.moveTo(hx + hs * .25, hy + hs * .3); ctx.lineTo(hx + hs * .75, hy + hs * .3); ctx.moveTo(hx + hs * .5, hy + hs * .3); ctx.lineTo(hx + hs * .5, hy + hs * 1.0); ctx.moveTo(hx + hs * .25, hy + hs * .7); ctx.lineTo(hx + hs * .75, hy + hs * .7); ctx.stroke();
}
function drawMemphis(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), port = w < h, ink = lum(C[0]) > .5 ? '#17171c' : '#ffffff', cols = port ? 5 : 9, cs = w / cols, rows = Math.ceil(h / cs) + 1, lw = Math.max(2.5, m * .0045), pal = [C[1], C[2], C[3], C[4], ink];
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = (i + .5 + (R() - .5) * .5) * cs, y = (j + .5 + (R() - .5) * .5) * cs, ty = Math.floor(R() * 7), c = pal[Math.floor(R() * 5)], s = cs * (.22 + .14 * R()), k = 1 + Math.floor(R() * 2), ph = R() * 6.28, rot = R() * 6.28 + Math.sin(a * k + ph) * .35 * (R() < .5 ? 1 : -1);
    ctx.save(); ctx.translate(x, y + Math.sin(a + ph) * cs * .04); ctx.rotate(rot); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = lw; ctx.beginPath();
    if (ty === 0) { for (let q = -s; q <= s; q += s / 14) { const yy = Math.sin(q / s * Math.PI * 2.5) * s * .22; q <= -s + .01 ? ctx.moveTo(q, yy) : ctx.lineTo(q, yy); } ctx.stroke(); }
    else if (ty === 1) { for (let q = 0; q <= 5; q++) { const xx = -s + q * s * .4, yy = q % 2 ? s * .3 : -s * .3; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    else if (ty === 2) { ctx.moveTo(0, -s * .8); ctx.lineTo(s * .8, s * .6); ctx.lineTo(-s * .8, s * .6); ctx.closePath(); R() < .5 ? ctx.fill() : ctx.stroke(); }
    else if (ty === 3) { ctx.arc(0, 0, s * .6, 0, 7); R() < .5 ? ctx.fill() : ctx.stroke(); }
    else if (ty === 4) { for (let u = -1; u <= 1; u++) for (let v = -1; v <= 1; v++) { ctx.moveTo(u * s * .4 + lw, v * s * .4); ctx.arc(u * s * .4, v * s * .4, lw, 0, 7); } ctx.fill(); }
    else if (ty === 5) { ctx.moveTo(-s * .6, 0); ctx.lineTo(s * .6, 0); ctx.moveTo(0, -s * .6); ctx.lineTo(0, s * .6); ctx.stroke(); }
    else { ctx.arc(0, 0, s * .7, Math.PI, 0); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
}
function drawHUD(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), mn = Math.min(w, h), cx = w / 2, cy = h * (w < h ? .52 : .5), Rm = mn * (w < h ? .44 : .4), base = lum(C[0]) < .45 ? C[0] : mix(C[4], '#04070d', .8), lw = Math.max(1.5, m * .0016), TAU = Math.PI * 2;
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .7); bg.addColorStop(0, mix(base, C[2], .12)); bg.addColorStop(1, mix(base, '#000000', .5)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const gs = m / 40; ctx.fillStyle = rgba(C[2], .16); for (let x = gs / 2; x < w; x += gs) for (let y = gs / 2; y < h; y += gs) ctx.fillRect(x - lw / 2, y - lw / 2, lw, lw);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'butt';
  [[.32, 1], [.46, -2], [.62, 3], [.8, -1], [.97, 2]].forEach(([k, sp], ri) => { const r = Rm * k, c = [C[1], C[2], C[3], C[4], C[1]][ri], n = 5 + ri; ctx.strokeStyle = rgba(c, .85); ctx.lineWidth = lw * (1 + (ri % 3)); let an = R() * TAU; for (let s = 0; s < n; s++) { const len = (.25 + R() * .6) * TAU / n; ctx.beginPath(); ctx.arc(cx, cy, r, an + a * sp, an + a * sp + len); ctx.stroke(); an += TAU / n; } });
  ctx.strokeStyle = rgba(C[2], .6); ctx.lineWidth = lw * .8; for (let i = 0; i < 180; i++) { const an = i / 180 * TAU, big = i % 10 === 0, r0 = Rm * 1.08, r1 = r0 + Rm * (big ? .06 : .03); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); ctx.stroke(); }
  for (let i = 0; i < 40; i++) { const an = a + i * .018; ctx.fillStyle = rgba(C[3], .22 * (1 - i / 40)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Rm * .96, an, an + .02); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = rgba(C[3], .95); ctx.lineWidth = lw * 1.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * Rm * .96, cy + Math.sin(a) * Rm * .96); ctx.stroke();
  ctx.strokeStyle = rgba(C[2], .4); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx - Rm * 1.25, cy); ctx.lineTo(cx + Rm * 1.25, cy); ctx.moveTo(cx, cy - Rm * 1.25); ctx.lineTo(cx, cy + Rm * 1.25); ctx.stroke();
  const bl = mn * .06, bm = mn * .04; ctx.strokeStyle = rgba(C[1], .9); ctx.lineWidth = lw * 2; [[bm, bm, 1, 1], [w - bm, bm, -1, 1], [bm, h - bm, 1, -1], [w - bm, h - bm, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * bl, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * bl); ctx.stroke(); });
  ctx.fillStyle = rgba(C[3], .95); ctx.beginPath(); ctx.arc(cx, cy, Rm * .03 * (1 + .25 * Math.sin(a * 4)), 0, 7); ctx.fill(); ctx.restore();
}
function drawFilmLeak(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), base = lum(C[0]) < .3 ? C[0] : mix(mix(C[4], '#120a08', .8), C[0], .1);
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 5; i++) { const c = C[1 + i % 4], edge = i % 4, x = [(.0 + Math.sin(a + i) * .08), 1 + Math.cos(a + i * 1.3) * .08, .5 + Math.sin(a * 1 + i) * .3, .5 + Math.cos(a + i * 2) * .3][edge] * w, y = [.3 + R() * .4, .3 + R() * .4, -.05, 1.05][edge] * h, r = m * (.35 + R() * .25), g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(mix(c, '#ffffff', .3), 1)); g.addColorStop(.5, rgba(c, .6)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  for (let i = 0; i < 3; i++) { const c = C[1 + (i + 1) % 4], x = (.2 + .6 * R() + Math.sin(a * (1 + i % 2) + i) * .08) * w, g = ctx.createLinearGradient(x - w * .1, 0, x + w * .1, 0); g.addColorStop(0, rgba(c, 0)); g.addColorStop(.5, rgba(c, .22 + .12 * Math.sin(a * 2 + i))); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  ctx.restore();
  const v = ctx.createRadialGradient(w / 2, h / 2, m * .2, w / 2, h / 2, m * .8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
  ctx.save(); for (let i = 0; i < 90; i++) { const x = R() * w, y = R() * h, k = 1 + Math.floor(R() * 3), ph = R() * 6.28, al = Math.pow(Math.max(0, Math.sin(a * k + ph)), 6), r = m * (.0006 + R() * .0016); ctx.fillStyle = 'rgba(255,248,235,' + (.15 + .5 * al) + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,248,235,.22)'; ctx.lineWidth = Math.max(1, m * .0008); for (let i = 0; i < 6; i++) { const x = R() * w, y = R() * h * .8, l = h * (.05 + R() * .2), k = 1 + Math.floor(R() * 2), al = Math.pow(Math.max(0, Math.sin(a * k + R() * 6.28)), 4); ctx.globalAlpha = al; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (R() - .5) * l * .08, y + l); ctx.stroke(); } ctx.restore();
  const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900))); ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .25; ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawTerrazzo(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), n = 90 + Math.round(o.detail * 1.6), stone = lum(C[0]) < .45 ? C[0] : mix(C[0], '#f1ece2', .5), P = [], cols = [C[1], C[2], C[3], C[4], '#fbf7ee', lum(C[0]) < .45 ? '#f1ece2' : '#2a2724'];
  ctx.fillStyle = stone; ctx.fillRect(0, 0, w, h);
  for (let tries = 0; tries < n * 14 && P.length < n; tries++) { const s = m * (.008 + Math.pow(R(), 2.2) * .045), x = R() * w, y = R() * h; if (P.every(p => Math.hypot(p[0] - x, p[1] - y) > (p[2] + s) * 1.05)) P.push([x, y, s, Math.floor(R() * 6), R() * 6.28, R() < .5 ? 1 : -1, 5 + Math.floor(R() * 4), R() * 1000]); }
  P.forEach(p => {
    const rr = rng(Math.floor(p[7])), x = p[0] + Math.sin(a + p[4]) * m * .004, y = p[1] + Math.cos(a + p[4]) * m * .004; ctx.save(); ctx.translate(x, y); ctx.rotate(p[4] + a * p[5]); ctx.beginPath();
    for (let k = 0; k < p[6]; k++) { const an = k / p[6] * 6.2832, r = p[2] * (.62 + .38 * rr()); k ? ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r) : ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r); }
    ctx.closePath(); ctx.fillStyle = cols[p[3]]; ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = p[2] * .12; ctx.shadowOffsetY = p[2] * .05; ctx.fill(); ctx.restore();
  });
  ctx.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 400; i++) { ctx.beginPath(); ctx.arc(R() * w, R() * h, m * (.0004 + R() * .0009), 0, 7); ctx.fill(); }
  const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900))); ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .22; ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawDeco(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, port = w < h, navy = lum(C[0]) < .3 ? C[0] : mix(C[4], '#070a1c', .78), gold = mix('#e2b865', C[2], .18), mid = mix(navy, C[1], .35), r = w / (port ? 4 : 8), rows = Math.ceil(h / (r * .5)) + 3, cols = Math.ceil(w / (2 * r)) + 2;
  ctx.fillStyle = navy; ctx.fillRect(0, 0, w, h); ctx.lineWidth = Math.max(1.5, r * .025);
  for (let j = -1; j < rows; j++) for (let i = -1; i < cols; i++) {
    const x = i * 2 * r + (j & 1 ? r : 0), y = j * r * .5;
    for (let k = 5; k >= 1; k--) { ctx.beginPath(); ctx.arc(x, y, r * k / 5, 0, 7); ctx.fillStyle = k % 2 ? navy : mid; ctx.fill(); ctx.strokeStyle = gold; ctx.stroke(); }
  }
  const sw = (((t / 16) % 1) + 1) % 1, g = ctx.createLinearGradient(-w, 0, w * 2, h); const c0 = clamp(sw - .12, 0, 1), c1 = sw, c2 = clamp(sw + .12, 0, 1); g.addColorStop(0, 'rgba(255,230,160,0)'); g.addColorStop(c0, 'rgba(255,230,160,0)'); g.addColorStop(c1, 'rgba(255,230,160,.28)'); g.addColorStop(c2, 'rgba(255,230,160,0)'); g.addColorStop(1, 'rgba(255,230,160,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.restore();
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}
