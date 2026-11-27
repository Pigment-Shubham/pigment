/* ---------- gradient + Pigment-branded wallpapers ---------- */
function drawGradient(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), ang = .9 + R() * 1.2 + Math.sin(a) * .18, L = Math.hypot(w, h) / 2, cx = w / 2, cy = h / 2;
  const g = ctx.createLinearGradient(cx - Math.cos(ang) * L, cy - Math.sin(ang) * L, cx + Math.cos(ang) * L, cy + Math.sin(ang) * L);
  g.addColorStop(0, C[1]); g.addColorStop(clamp(.5 + Math.sin(a) * .08, .3, .7), C[3]); g.addColorStop(1, C[4]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const x = (.3 + .4 * R() + Math.cos(a) * .08) * w, y = (.25 + .4 * R() + Math.sin(a) * .08) * h, hg = ctx.createRadialGradient(x, y, 0, x, y, m * .6); hg.addColorStop(0, rgba(C[2], .55)); hg.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);
  const k = o.grain / 100; if (k <= 0) return; const pat = ctx.createPattern(grainTile(), 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(1, m / 900)));
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = Math.min(1, k * .5); ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.restore();
}
function drawBrandLogo(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, port = w < h, m = Math.max(w, h), ink = lum(C[0]) > .5 ? '#111114' : '#ffffff', TAU = Math.PI * 2;
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) { const c = C[1 + i], x = (.2 + .6 * ((i * .37 + .1) % 1) + Math.sin(a + i * 1.7) * .06) * w, y = (.2 + .6 * ((i * .53 + .2) % 1) + Math.cos(a + i * 1.3) * .06) * h, r = m * .5, g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, .5)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  const S = port ? Math.min(w * .78, h * .42) : Math.min(h * .62, w * .4), cx = w / 2, cy = (port ? h * .5 : h * .43) + Math.sin(a) * S * .015, R = S * .235 / .65 * .65, top = cy - S * .5, hh = S * .66, Rr = S * .235, cyc = top + hh - Rr;
  const drop = () => { ctx.beginPath(); ctx.moveTo(cx, top); ctx.bezierCurveTo(cx + Rr * .18, top + S * .14, cx + Rr, cyc - Rr * .95, cx + Rr, cyc); ctx.arc(cx, cyc, Rr, 0, Math.PI, false); ctx.bezierCurveTo(cx - Rr, cyc - Rr * .95, cx - Rr * .18, top + S * .14, cx, top); ctx.closePath(); };
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(cx, top + hh + S * .06, Rr * (.9 - Math.sin(a) * .05), S * .03, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.shadowColor = rgba(C[1], .6); ctx.shadowBlur = S * .1; ctx.shadowOffsetY = S * .03; drop(); ctx.fillStyle = C[1]; ctx.fill(); ctx.restore();
  ctx.save(); drop(); ctx.clip(); const g = ctx.createLinearGradient(cx - Rr, top, cx + Rr, top + hh); g.addColorStop(0, C[2]); g.addColorStop(.45, C[1]); g.addColorStop(.75, C[3]); g.addColorStop(1, C[4]); ctx.fillStyle = g; ctx.fillRect(cx - Rr, top, Rr * 2, hh);
  for (let i = 0; i < 3; i++) { const x = cx + Math.sin(a + i * 2.1) * Rr * .5, y = cyc + Math.cos(a + i * 1.6) * Rr * .5, r = Rr * .9, rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, rgba(C[2 + i % 3], .55)); rg.addColorStop(1, rgba(C[2 + i % 3], 0)); ctx.fillStyle = rg; ctx.fillRect(cx - Rr, top, Rr * 2, hh); }
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(cx - Rr * .42, cyc - Rr * .28, Rr * .11, Rr * .34, .35, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(cx - Rr * .2, cyc + Rr * .5, Rr * .07, 0, 7); ctx.fill(); ctx.restore();
  drop(); ctx.lineWidth = Math.max(2, S * .006); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.stroke();
  for (let i = 0; i < 3; i++) { const an = a + i * TAU / 3, x = cx + Math.cos(an) * S * .42, y = cyc + Math.sin(an) * S * .2, r = S * (.022 - i * .004); ctx.save(); ctx.shadowColor = C[2 + i]; ctx.shadowBlur = S * .03; ctx.fillStyle = C[2 + i]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); }
  const fs = S * .27; ctx.fillStyle = ink; ctx.font = '800 ' + fs + 'px "Bricolage Grotesque","Arial Narrow",system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; if ('letterSpacing' in ctx) ctx.letterSpacing = (-fs * .04) + 'px'; ctx.fillText('Pigment', cx, top + hh + S * .06 + fs * .95); if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}
function drawBrandType(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16, port = w < h, rows = port ? 10 : 6, rh = h / rows, fs = rh * 1.02, word = 'PIGMENT', pal = [C[1], C[2], C[3], C[4]];
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h); ctx.font = '800 ' + fs + 'px "Bricolage Grotesque","Arial Narrow",system-ui,sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; if ('letterSpacing' in ctx) ctx.letterSpacing = (-fs * .03) + 'px';
  const gap = fs * .5, ww = ctx.measureText(word).width + gap;
  for (let r = 0; r < rows; r++) {
    const dir = r % 2 ? -1 : 1, off = (((a * dir * (1 + (r % 3))) % 1) + 1) % 1 * ww, y = rh * (r + .5), c = pal[r % 4];
    for (let x = -ww + (off % ww); x < w + ww; x += ww) { if (r % 2) { ctx.strokeStyle = c; ctx.lineWidth = Math.max(2, fs * .03); ctx.strokeText(word, x, y); } else { ctx.fillStyle = c; ctx.fillText(word, x, y); } }
  }
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}
function drawBrandDrops(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * Math.PI * 2, port = w < h, cols = port ? 6 : 11, cs = w / cols, rows = Math.ceil(h / cs * 1.15) + 1, pal = ramp(C.slice(1).concat(C[1]), 64), ink = lum(C[0]) > .5 ? '#111114' : '#ffffff';
  ctx.fillStyle = C[0]; ctx.fillRect(0, 0, w, h);
  for (let j = 0; j < rows; j++) for (let i = -1; i <= cols; i++) {
    const x = (i + (j % 2 ? .5 : 0) + .5) * cs, y = (j + .5) * cs * .88, s = cs * (.34 + .16 * Math.sin(a + (i + j) * .55)), idx = Math.floor((((i + j) * 4 + a / (2 * Math.PI) * 64) % 64 + 64) % 64), c = pal[idx];
    ctx.beginPath(); ctx.moveTo(x, y - s); ctx.bezierCurveTo(x + s * .2, y - s * .45, x + s * .78, y - s * .15, x + s * .78, y + s * .25); ctx.arc(x, y + s * .25, s * .78, 0, Math.PI, false); ctx.bezierCurveTo(x - s * .78, y - s * .15, x - s * .2, y - s * .45, x, y - s); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(x - s * .3, y + s * .12, s * .08, s * .22, .35, 0, 7); ctx.fill();
  }
  const fs = Math.min(w, h) * (port ? .07 : .05), py = h * (port ? .94 : .93), tw = fs * 4.6;
  ctx.fillStyle = C[0]; ctx.beginPath(); ctx.roundRect(w / 2 - tw / 2 - fs * .5, py - fs * .85, tw + fs, fs * 1.7, fs * .85); ctx.fill();
  ctx.fillStyle = ink; ctx.font = '800 ' + fs + 'px "Bricolage Grotesque","Arial Narrow",system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Pigment', w / 2, py);
}
