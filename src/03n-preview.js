/* preview-only styles (not registered in the app) */
function drawLiquidMetal(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.min(w, h);
  let g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, mix(C[0], '#000000', .55)); g.addColorStop(1, mix(C[4], '#000000', .6)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const blobs = [[.5, .42, .36, 0], [.3, .75, .17, 2], [.72, .78, .13, 4]];
  blobs.forEach(([bx, by, br, ph], bi) => {
    const cx = bx * w + Math.sin(a + ph) * w * .03, cy = by * h + Math.cos(a * (1 + bi % 2) + ph) * h * .02, R = m * br * 1.25;
    ctx.beginPath(); for (let i = 0; i <= 120; i++) { const th = i / 120 * 6.283, r = R * (1 + .1 * Math.sin(3 * th + a + ph) + .07 * Math.sin(5 * th - 2 * a + ph) + .04 * Math.sin(8 * th + a * 3)); const x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r * 1.05; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath();
    const an = a + bi, dx = Math.cos(an) * R, dy = Math.sin(an) * R, mg = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    mg.addColorStop(0, '#f4f6fb'); mg.addColorStop(.18, mix(C[1], '#ffffff', .4)); mg.addColorStop(.36, '#1a1c26'); mg.addColorStop(.52, mix(C[2], '#ffffff', .3)); mg.addColorStop(.7, '#2a2d3c'); mg.addColorStop(.86, mix(C[3], '#ffffff', .5)); mg.addColorStop(1, '#eef0f6');
    ctx.fillStyle = mg; ctx.fill(); ctx.lineWidth = m * .004; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke();
    const hl = ctx.createRadialGradient(cx - R * .35, cy - R * .4, 0, cx - R * .35, cy - R * .4, R * .5); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = hl; ctx.fill();
  });
}
function drawLavaLamp(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, m = Math.max(w, h);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[0], '#10051c', .4)); g.addColorStop(1, mix(C[1], '#2a0a30', .5)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const R = rng(d.seed); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 9; i++) { const ph = R() * 6.28, k = 1 + (i % 2), x = w * (.5 + (R() - .5) * .4 + Math.sin(a + ph) * .06), y = h * (.5 - .36 * Math.cos(a * k + ph)), r = m * (.06 + .045 * R()) * (1 + .12 * Math.sin(a * 2 + ph)), c = C[1 + i % 4]; const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8); gr.addColorStop(0, rgba(mix(c, '#ffffff', .1), .8)); gr.addColorStop(.5, rgba(c, .55)); gr.addColorStop(1, rgba(c, 0)); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(x, y, r * 1.8, r * 1.8 * 1.25, 0, 0, 7); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
}
function drawWeatherSky(ctx, w, h, d, t, o) {
  const a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), now = new Date(), hr = (o && o.hour != null) ? o.hour : now.getHours() + now.getMinutes() / 60, rain = !!(o && o.rain);
  const K = [[0, '#05081a', '#1b2150'], [5, '#1a1e4a', '#e9876a'], [7, '#6aa8e8', '#fbe0b8'], [12, '#2f7fe0', '#a9d6ff'], [17, '#4d7fc9', '#ffc58a'], [19, '#3a2a6a', '#ff7a5a'], [21, '#0a0e28', '#2a2a66'], [24, '#05081a', '#1b2150']];
  let i = 0; while (i < K.length - 2 && hr >= K[i + 1][0]) i++; const f = (hr - K[i][0]) / (K[i + 1][0] - K[i][0]), top = mix(K[i][1], K[i + 1][1], f), bot = mix(K[i][2], K[i + 1][2], f);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const night = hr < 5.5 || hr > 20, day = !night, ang = ((hr - 6) / 12) * Math.PI, sx = w * (.1 + .8 * (hr - 6) / 12), sy = h * .75 - Math.sin(Math.max(0, Math.min(Math.PI, ang))) * h * .5;
  if (night) { for (let q = 0; q < 80; q++) { ctx.fillStyle = rgba('#ffffff', (.3 + .6 * R()) * (.6 + .4 * Math.sin(a * 2 + q))); ctx.fillRect(R() * w, R() * h * .7, 1.5, 1.5); } const mx = w * .7, my = h * .2; const mg = ctx.createRadialGradient(mx, my, 0, mx, my, m * .2); mg.addColorStop(0, 'rgba(255,248,220,.5)'); mg.addColorStop(1, 'rgba(255,248,220,0)'); ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(mx, my, m * .045, 0, 7); ctx.fill(); }
  else { const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, m * .45); sg.addColorStop(0, 'rgba(255,240,200,.85)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fffbe8'; ctx.beginPath(); ctx.arc(sx, sy, m * .05, 0, 7); ctx.fill(); }
  const cl = rain ? 11 : 6, shade = night ? '#2a3050' : (rain ? '#8a93a6' : '#ffffff');
  for (let q = 0; q < cl; q++) { const x = ((R() + t / 16 * (1 + q % 2)) % 1) * 1.7 * w - .35 * w, y = h * (.08 + .32 * R()), s = m * (.12 + .1 * R()); for (let j = 0; j < 5; j++) { const cx = x + (j - 2) * s * .5, cy = y + Math.sin(j * 2 + q) * s * .1, rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * .7); rg.addColorStop(0, rgba(shade, rain ? .75 : .7)); rg.addColorStop(1, rgba(shade, 0)); ctx.fillStyle = rg; ctx.fillRect(cx - s, cy - s, s * 2, s * 2); } }
  ctx.fillStyle = night ? '#070a18' : mix(bot, '#102030', .6); ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w + 2; x += w / 40) ctx.lineTo(x, h * .86 + Math.sin(x / w * 6.283 * 2 + 1) * h * .025); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  if (rain) { ctx.strokeStyle = 'rgba(210,225,255,.45)'; ctx.lineWidth = Math.max(1, m * .0014); ctx.beginPath(); const len = m * .04; for (let q = 0; q < 220; q++) { const k = 3 + q % 3, y = ((R() + t / 16 * k) % 1) * (h + len) - len, x0 = R() * 1.3 * w - .1 * w; ctx.moveTo(x0 - y * .12, y); ctx.lineTo(x0 - y * .12 - len * .12, y + len); } ctx.stroke(); }
}
function drawCampfire(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), cx = w / 2, by = h * .72;
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#04050d'); g.addColorStop(1, mix(C[0], '#1a0d08', .6)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) { ctx.fillStyle = rgba('#ffffff', (.25 + .6 * R()) * (.6 + .4 * Math.sin(a * 2 + i))); ctx.fillRect(R() * w, R() * h * .55, 1.5, 1.5); }
  const fl = 1 + .06 * Math.sin(a * 6) + .04 * Math.sin(a * 11), gl = ctx.createRadialGradient(cx, by, 0, cx, by, m * .55 * fl); gl.addColorStop(0, 'rgba(255,170,60,.55)'); gl.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#0b0807'; ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w + 2; x += w / 40) ctx.lineTo(x, h * .8 + Math.sin(x / w * 6.283 * 2) * h * .01); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = '#2a1810'; ctx.lineWidth = m * .028; ctx.beginPath(); ctx.moveTo(cx - m * .11, by + m * .045); ctx.lineTo(cx + m * .09, by + m * .01); ctx.moveTo(cx + m * .11, by + m * .045); ctx.lineTo(cx - m * .09, by + m * .01); ctx.stroke();
  const fcol = [['#ff3a14', 1], ['#ff8a1e', .72], ['#ffd25a', .45], ['#fff3b0', .24]];
  fcol.forEach(([c, sc], li) => { for (let i = 0; i < 5; i++) { const ph = i * 1.3 + li * .4, hgt = m * (.2 + .05 * Math.sin(a * 3 + ph) + .03 * Math.sin(a * 7 + ph * 2)) * sc * (1 - Math.abs(i - 2) * .12), wd = m * .05 * sc * (1 - Math.abs(i - 2) * .1), x0 = cx + (i - 2) * m * .028 + Math.sin(a * 2 + ph) * m * .006; ctx.fillStyle = c; ctx.globalAlpha = .85; ctx.beginPath(); ctx.moveTo(x0 - wd, by); ctx.quadraticCurveTo(x0 - wd * .9, by - hgt * .55, x0 + Math.sin(a * 4 + ph) * wd * .6, by - hgt); ctx.quadraticCurveTo(x0 + wd * .9, by - hgt * .55, x0 + wd, by); ctx.closePath(); ctx.fill(); } }); ctx.globalAlpha = 1;
  for (let i = 0; i < 26; i++) { const k = 1 + i % 3, u = ((R() + t / 16 * k) % 1), x = cx + (R() - .5) * m * .12 + Math.sin(u * 9 + i) * m * .03 * u, y = by - u * h * .5, al = Math.sin(Math.PI * u); ctx.fillStyle = rgba('#ffc060', al * .9); ctx.beginPath(); ctx.arc(x, y, m * .0022, 0, 7); ctx.fill(); }
}
function drawMoonPhase(ctx, w, h, d, t, o) {
  const a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.min(w, h), C = d.colors, now = o && o.date != null ? new Date(o.date) : new Date(), ph = (((now.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.53059 + 29.53059) % 29.53059 / 29.53059;
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#04050f'); g.addColorStop(1, mix(C[0], '#0a1030', .6)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 110; i++) { ctx.fillStyle = rgba('#ffffff', (.2 + .6 * R()) * (.6 + .4 * Math.sin(a * 2 + i))); ctx.fillRect(R() * w, R() * h, 1.5, 1.5); }
  const cx = w / 2, cy = h * .45, r = m * .3, hl = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 2.2); hl.addColorStop(0, 'rgba(220,230,255,.25)'); hl.addColorStop(1, 'rgba(220,230,255,0)'); ctx.fillStyle = hl; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#161a2c'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  const k = Math.cos(ph * 6.283), waxing = ph < .5; ctx.fillStyle = '#f2f0e4'; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !waxing); ctx.fill(); ctx.fillStyle = k > 0 ? '#161a2c' : '#f2f0e4'; ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, 0, 7); ctx.fill();
  const R2 = rng(7); for (let i = 0; i < 14; i++) { const x = cx + (R2() - .5) * r * 1.6, y = cy + (R2() - .5) * r * 1.6, rr = r * (.03 + .08 * R2()); ctx.fillStyle = 'rgba(120,120,110,.18)'; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill(); }
  ctx.restore();
  const names = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'], nm = names[Math.round(ph * 8) % 8];
  ctx.fillStyle = 'rgba(235,238,255,.75)'; ctx.textAlign = 'center'; ctx.font = '600 ' + m * .045 + 'px "DM Sans",Arial,sans-serif'; ctx.fillText(nm.toUpperCase(), w / 2, h * .82); ctx.font = '500 ' + m * .032 + 'px "DM Sans",Arial,sans-serif'; ctx.fillStyle = 'rgba(235,238,255,.5)'; ctx.fillText(Math.round((1 - Math.cos(ph * 6.283)) / 2 * 100) + '% lit', w / 2, h * .86);
}
function drawLeaves(ctx, w, h, d, t, o) {
  const C = d.colors, R = rng(d.seed), m = Math.max(w, h);
  let g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mix(C[4], '#fff4e0', .5)); g.addColorStop(1, mix(C[0], '#3a1a10', .35)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * .8, h * .1, 0, w * .8, h * .1, m * .6); glow.addColorStop(0, 'rgba(255,230,170,.7)'); glow.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  const N = 46, L = []; for (let i = 0; i < N; i++) L.push({ x: R(), p: R(), k: 1 + (i % 2), s: m * (.025 + .035 * R()), rot: R() * 6.283, rk: 1 + (i % 3), sw: R() * 6.283, c: ['#c8421a', '#e8841e', '#f0b22a', '#8a3a14', '#d65a24'][i % 5], z: R() });
  L.sort((p, q) => p.z - q.z).forEach(l => { const u = (l.p + t / 16 * l.k) % 1, x = (l.x + Math.sin(u * 6.283 * 2 + l.sw) * .06) * w, y = u * (h + l.s * 4) - l.s * 2, an = l.rot + t / 16 * 6.283 * l.rk, s = l.s * (.7 + l.z * .6); ctx.save(); ctx.translate(x, y); ctx.rotate(an); ctx.fillStyle = l.c; ctx.globalAlpha = .55 + .4 * l.z; ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * .9, -s * .5, s * .8, s * .5, 0, s); ctx.bezierCurveTo(-s * .8, s * .5, -s * .9, -s * .5, 0, -s); ctx.fill(); ctx.globalAlpha = .5; ctx.strokeStyle = 'rgba(60,20,5,.6)'; ctx.lineWidth = Math.max(1, s * .08); ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s * 1.1); ctx.stroke(); ctx.restore(); });
}
