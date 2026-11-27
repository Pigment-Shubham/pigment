/* ---------- designer gradients & glows: mesh, satin, orb, soft waves, prism, petals, spheres, aura rings ---------- */
function drawMeshGrad(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h);
  ctx.fillStyle = mix(C[0], C[4], .5); ctx.fillRect(0, 0, w, h);
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < 9; i++) {
    const ph = R() * 6.28, ph2 = R() * 6.28, k = 1 + (i % 2), x = ((i % 3 + .5) / 3 + Math.sin(a * k + ph) * .17) * w, y = (((i / 3 | 0) + .5) / 3 + Math.cos(a * (3 - k) + ph2) * .17) * h, r = m * (pass ? .26 : .5) * (1.5 - dt * .5) * (.85 + .3 * R()), c = C[(i + pass * 2) % 5], g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(c, pass ? .7 : .95)); g.addColorStop(.55, rgba(c, pass ? .25 : .45)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
}
function drawLiquid(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, mix(C[0], C[4], .3)); bg.addColorStop(1, mix(C[4], C[0], .2)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let j = 0; j < 5; j++) {
    const ph = R() * 6.28, ph2 = R() * 6.28, by = h * (.12 + .19 * j), k1 = 1 + (j % 2), k2 = 2 + (j % 3), A = h * (.1 + .04 * R()), pts = [];
    for (let x = -.1 * w; x <= 1.1 * w; x += w / 70) { const nx = x / w; pts.push([x, by + Math.sin(nx * 6.283 * k1 + a + ph) * A + Math.sin(nx * 6.283 * k2 - a * 2 + ph2) * A * .35]); }
    for (let l = 0; l < 14; l++) {
      const u = l / 13; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.lineWidth = m * .17 * (1.5 - dt * .5) * (1 - u * .93); ctx.strokeStyle = rgba(mix(C[j], C[(j + 2) % 5], u * .8), .1 + u * .06); ctx.stroke();
    }
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - m * .004) : ctx.moveTo(p[0], p[1] - m * .004)); ctx.lineWidth = m * .0025; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.stroke();
  }
}
function drawGlowOrb(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, m = Math.min(w, h), bg = lum(C[0]) < .5 ? C[0] : mix(C[4], '#05060c', .75);
  ctx.fillStyle = mix(bg, '#000000', .35); ctx.fillRect(0, 0, w, h);
  const cx = w / 2 + Math.sin(a) * w * .02, cy = h * .47 + Math.cos(a) * h * .02, r = m * (.27 + .012 * Math.sin(a * 2));
  let g = ctx.createRadialGradient(cx, cy, r * .5, cx, cy, r * (4.4 - dt * 1.0)); g.addColorStop(0, rgba(C[1], .6)); g.addColorStop(.4, rgba(C[2], .22)); g.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, r * (1.45 + i * .38), r * (1.45 + i * .38) * .32, -.35 + Math.sin(a + i) * .05, 0, 7); ctx.lineWidth = m * .003; ctx.strokeStyle = rgba(C[3], .2 - i * .05); ctx.stroke(); }
  g = ctx.createRadialGradient(cx - r * .32, cy - r * .38, r * .05, cx, cy, r); g.addColorStop(0, mix(C[3], '#ffffff', .6)); g.addColorStop(.35, C[3]); g.addColorStop(.75, C[1]); g.addColorStop(1, mix(C[2], '#000000', .55));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
  g = ctx.createRadialGradient(cx, cy, r * .8, cx, cy, r * 1.02); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, rgba(mix(C[3], '#ffffff', .5), .5)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 1.02, 0, 7); ctx.fill();
  g = ctx.createRadialGradient(cx, cy + r * 1.5, 0, cx, cy + r * 1.5, r * 1.1); g.addColorStop(0, rgba(C[1], .35)); g.addColorStop(1, rgba(C[1], 0)); ctx.save(); ctx.translate(0, 0); ctx.scale(1, 1); ctx.fillStyle = g; ctx.fillRect(0, cy + r * 1.1, w, h); ctx.restore();
}
function drawSoftWaves(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, mix(C[4], C[0], .35)); sky.addColorStop(1, C[3]); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const gl = ctx.createRadialGradient(w * .7, h * .2, 0, w * .7, h * .2, m * .6); gl.addColorStop(0, rgba(C[2], .55)); gl.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) {
    const ph = R() * 6.28, ph2 = R() * 6.28, by = h * (.28 + i * .125), A = h * (.045 + .01 * i) * (.4 + .6 * dt), k = 1 + (i % 2), g = ctx.createLinearGradient(0, by - A, 0, h);
    g.addColorStop(0, rgba(C[i % 5], .9)); g.addColorStop(1, rgba(C[(i + 1) % 5], .95)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, h);
    const ed = []; for (let x = 0; x <= w + 1; x += w / 90) { const nx = x / w, y = by + Math.sin(nx * 6.283 * k + a * (i % 2 ? 1 : -1) + ph) * A + Math.sin(nx * 6.283 * (k + 2) + a * 2 + ph2) * A * .3; ed.push([x, y]); ctx.lineTo(x, y); }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill(); ctx.beginPath(); ed.forEach((p, q) => q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.lineWidth = m * .002; ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.stroke();
  }
}
function drawPrism(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h);
  ctx.fillStyle = mix(C[0], C[4], .4); ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 5; i++) { const x = (.1 + .8 * R() + Math.sin(a + i) * .05) * w, y = (.1 + .8 * R() + Math.cos(a + i * 2) * .05) * h, g = ctx.createRadialGradient(x, y, 0, x, y, m * .5); g.addColorStop(0, rgba(C[i], .9)); g.addColorStop(1, rgba(C[i], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  const n = Math.max(2, Math.round(3 + 3 * dt)), sl = h * .5;
  for (let i = 0; i < n; i++) {
    const bx = ((i + .5) / n + Math.sin(a + i * 1.3) * .025) * w, pw = w / n * .92, c = C[(i + 1) % 5], g = ctx.createLinearGradient(bx, 0, bx + pw, h);
    g.addColorStop(0, rgba('#ffffff', .22)); g.addColorStop(.5, rgba(c, .16)); g.addColorStop(1, rgba('#000000', .1));
    ctx.beginPath(); ctx.moveTo(bx - pw / 2 + sl, -2); ctx.lineTo(bx + pw / 2 + sl, -2); ctx.lineTo(bx + pw / 2 - sl, h + 2); ctx.lineTo(bx - pw / 2 - sl, h + 2); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = m * .0018; ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.stroke();
  }
}
function drawPetals(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, m = Math.min(w, h), bg = lum(C[0]) < .5 ? C[0] : mix(C[4], '#0a0712', .7);
  ctx.fillStyle = mix(bg, '#000000', .3); ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2; ctx.globalCompositeOperation = 'lighter';
  for (let s = 0; s < 3; s++) {
    const n = Math.max(4, Math.round((10 + s * 2) * (.5 + dt / 2))), sc = 1 + .05 * Math.sin(a * 2 + s), dir = s % 2 ? -1 : 1;
    for (let i = 0; i < n; i++) {
      const ang = i / n * 6.283 + dir * a * (1 + (s > 1 ? 1 : 0)), rx = m * (.3 - s * .05) * sc, ry = m * (.11 - s * .015) * sc, c = C[(i + s) % 5];
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.translate(rx * .55, 0);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba(c, .28)); g.addColorStop(1, rgba(c, .04)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7); ctx.fill(); ctx.lineWidth = m * .002; ctx.strokeStyle = rgba(mix(c, '#ffffff', .5), .22); ctx.stroke(); ctx.restore();
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .16); g.addColorStop(0, rgba(mix(C[3], '#ffffff', .6), .8)); g.addColorStop(1, rgba(C[3], 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
function drawSoftSpheres(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, R = rng(d.seed), m = Math.max(w, h), bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, mix(C[0], C[4], .55)); bg.addColorStop(1, mix(C[4], C[0], .35)); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const S = []; for (let i = 0, N = Math.max(3, Math.round(4 + 4 * dt)); i < N; i++) S.push({ x: .1 + .8 * R(), y: .12 + .76 * R(), r: m * (.06 + .1 * R()), ph: R() * 6.28, k: 1 + (i % 2), c: C[i % 5] });
  S.sort((p, q) => p.r - q.r);
  S.forEach(s => {
    const x = (s.x + Math.sin(a * s.k + s.ph) * .025) * w, y = (s.y + Math.cos(a + s.ph) * .03) * h, r = s.r;
    let g = ctx.createRadialGradient(x, y + r * 1.25, 0, x, y + r * 1.25, r * 1.1); g.addColorStop(0, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.translate(0, y + r * 1.25); ctx.scale(1, .22); ctx.translate(0, -(y + r * 1.25)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + r * 1.25, r * 1.1, 0, 7); ctx.fill(); ctx.restore();
    g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r); g.addColorStop(0, mix(s.c, '#ffffff', .75)); g.addColorStop(.45, s.c); g.addColorStop(1, mix(s.c, C[0], .55)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  });
}
function drawAuraRings(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, m = Math.max(w, h), bg = lum(C[0]) < .5 ? C[0] : mix(C[4], '#07060f', .75), cx = w / 2, cy = h / 2;
  ctx.fillStyle = mix(bg, '#000000', .3); ctx.fillRect(0, 0, w, h);
  const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .5); gl.addColorStop(0, rgba(C[1], .35)); gl.addColorStop(1, rgba(C[1], 0)); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0, N = Math.max(3, Math.round(5 + 4 * dt)); i < N; i++) {
    const u = ((i / N + t / 16) % 1), r = u * m * .72 + m * .02, fade = Math.sin(Math.PI * u), c = C[i % 5];
    for (let l = 0; l < 3; l++) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.lineWidth = m * (.05 - l * .016) * (.4 + u); ctx.strokeStyle = rgba(l === 2 ? mix(c, '#ffffff', .5) : c, fade * (.07 + l * .08)); ctx.stroke(); }
  }
  ctx.globalCompositeOperation = 'source-over';
}
