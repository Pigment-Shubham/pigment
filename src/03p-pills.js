/* pill-shaped wallpapers (preview only) */
function pillScene(ctx, w, h, d, t, o, mode) {
  const C = d.colors, a = t / 16 * 6.2832, dark = mode === 3 || lum(C[0]) < .35, port = h > w, W = port ? h : w, H = port ? w : h;
  ctx.fillStyle = dark ? mix(C[0], '#000000', .6) : mix(C[0], '#ffffff', .78); ctx.fillRect(0, 0, w, h);
  ctx.save(); if (port) { ctx.translate(w, 0); ctx.rotate(Math.PI / 2); } else ctx.translate(0, H * .05);
  const N = 9, pw = W * .17, step = W * .08, tot = pw + step * (N - 1), x0 = (W - tot) / 2, base = H * .66, cols = [C[1], C[2], C[3], C[4]];
  const colAt = u => { const k = u * (cols.length - 1), i = Math.min(cols.length - 2, Math.floor(k)); return mix(cols[i], cols[i + 1], k - i); };
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1), ph = a + i * .55; let ph2 = base, y = (H - ph2) / 2, ang = 0, wd = pw;
    if (mode === 0 || mode === 3) { ph2 = base * (1 + .16 * Math.sin(ph)); y = (H - ph2) / 2; if (mode === 3) wd = pw * (1 + .1 * Math.sin(ph + 1)); }
    else if (mode === 1) y = (H - ph2) / 2 + Math.sin(ph) * H * .06;
    else if (mode === 2) ang = Math.sin(ph) * .12;
    const x = x0 + i * step, c = colAt(u), r = wd / 2;
    ctx.save(); ctx.translate(x + wd / 2, y + ph2 / 2); ctx.rotate(ang);
    ctx.shadowColor = dark ? rgba(c, .55) : 'rgba(30,40,90,.22)'; ctx.shadowBlur = H * (dark ? .05 : .035); ctx.shadowOffsetY = dark ? 0 : H * .012;
    ctx.beginPath(); ctx.moveTo(-wd / 2, -ph2 / 2 + r); ctx.arc(0, -ph2 / 2 + r, r, Math.PI, 0); ctx.lineTo(wd / 2, ph2 / 2 - r); ctx.arc(0, ph2 / 2 - r, r, 0, Math.PI); ctx.closePath();
    const g = ctx.createLinearGradient(-wd / 2, -ph2 / 2, wd / 2, ph2 / 2); g.addColorStop(0, rgba(mix(c, '#ffffff', .45), .82)); g.addColorStop(.5, rgba(c, .82)); g.addColorStop(1, rgba(mix(c, '#000000', .12), .82)); ctx.fillStyle = g; ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
function drawPillRow(ctx, w, h, d, t, o) { pillScene(ctx, w, h, d, t, o, 0); }
function drawPillWave(ctx, w, h, d, t, o) { pillScene(ctx, w, h, d, t, o, 1); }
function drawPillFan(ctx, w, h, d, t, o) { pillScene(ctx, w, h, d, t, o, 2); }
function drawPillNight(ctx, w, h, d, t, o) { pillScene(ctx, w, h, d, t, o, 3); }
