/* ---------- glossy 3D families: glass ribbon, inflated tube stack, nested arches ---------- */
function drawGlassRibbon(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, m = Math.min(w, h), cx = w / 2, cy = h / 2, A = w * .31 * (1 + Math.sin(a) * .05), B = h * .36 * (1 - Math.sin(a) * .03), TW = m * (.3 - dt * .04), N = 180, rot = Math.sin(a) * .035;
  let g = ctx.createLinearGradient(0, 0, w * .3, h); g.addColorStop(0, mix(C[0], C[4], .15)); g.addColorStop(1, mix(C[4], C[1], .25)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const sh = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .9); sh.addColorStop(0, rgba(C[2], .22 + .08 * Math.sin(a * 2))); sh.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = sh; ctx.fillRect(0, 0, w, h);
  const P = [], cr = Math.cos(rot), sr = Math.sin(rot); for (let i = 0; i < N; i++) { const u = i / N * Math.PI * 2, x = Math.sin(2 * u) * A, y = Math.sin(u) * B + Math.cos(u * 2 + a) * h * .012; P.push([cx + x * cr - y * sr, cy + x * sr + y * cr]); }
  const nr = P.map((p, i) => { const q = P[(i + 1) % N], r = P[(i + N - 1) % N], tx = q[0] - r[0], ty = q[1] - r[1], l = Math.hypot(tx, ty) || 1, t1x = p[0] - r[0], t1y = p[1] - r[1], t2x = q[0] - p[0], t2y = q[1] - p[1], ds = (Math.hypot(t1x, t1y) + Math.hypot(t2x, t2y)) / 2 || 1, k = (t1x * t2y - t1y * t2x) / ((Math.hypot(t1x, t1y) * Math.hypot(t2x, t2y)) || 1) / ds, cap = Math.abs(k) > 1e-6 ? .9 / Math.abs(k) : 1e9; return [-ty / l, tx / l, k > 0 ? cap : 1e9, k < 0 ? cap : 1e9]; });
  const col = (u, l) => { const k = ((u / (Math.PI * 2) + t / 16) % 1) * 5, i = Math.floor(k), f = k - i, c = mix(C[i % 5], C[(i + 1) % 5], f); return mix(c, l > 0 ? '#ffffff' : '#000000', Math.abs(l)); };
  const quad = (i, i2, hw, ox, oy, c) => { const p = P[i], q = P[i2], n1 = nr[i], n2 = nr[i2], l1 = Math.min(hw, n1[2]), r1 = Math.min(hw, n1[3]), l2 = Math.min(hw, n2[2]), r2 = Math.min(hw, n2[3]); const dx = q[0] - p[0], dy = q[1] - p[1], dl = Math.hypot(dx, dy) || 1, ex = dx / dl * 1.4, ey = dy / dl * 1.4; ctx.beginPath(); ctx.moveTo(p[0] + n1[0] * l1 + ox, p[1] + n1[1] * l1 + oy); ctx.lineTo(q[0] + ex + n2[0] * l2 + ox, q[1] + ey + n2[1] * l2 + oy); ctx.lineTo(q[0] + ex - n2[0] * r2 + ox, q[1] + ey - n2[1] * r2 + oy); ctx.lineTo(p[0] - n1[0] * r1 + ox, p[1] - n1[1] * r1 + oy); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
  ctx.lineJoin = 'round';
  const pass = (i0, i1) => {
    for (let layer = 0; layer < 12; layer++) { const f = layer / 11, hw = TW * (1 - f * .84) / 2; for (let i = i0; i < i1; i++) quad((i + N) % N, (i + 1 + N) % N, hw, 0, -TW * .06 * f, col(((i + N) % N) / N * Math.PI * 2, -.4 + f * .72)); }
    for (let i = i0; i < i1; i++) quad((i + N) % N, (i + 1 + N) % N, TW * .022, -TW * .15, -TW * .19, mix(col(((i + N) % N) / N * Math.PI * 2, .3), '#ffffff', .75));
  };
  pass(0, N);
  ctx.save(); ctx.beginPath(); ctx.arc(P[0][0], P[0][1], TW * 1.05, 0, 7); ctx.clip(); pass(N / 2 - N / 6, N / 2 + N / 6); ctx.restore();
}
function drawTubeStack(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, TW = w * (.3 - dt * .06), n = Math.ceil(h / TW) + 1, x0 = TW + w * .02, x1 = w - TW - w * .02, bg = mix(C[4], '#ffffff', .55), yS = (h - n * TW) / 2 + TW / 2;
  ctx.fillStyle = mix(bg, C[0], .15); ctx.fillRect(0, 0, w, h);
  const pts = [], steps = 24; for (let r = 0; r < n; r++) { const wob = Math.sin(a + r * .9) * TW * .07, y = yS + r * TW + wob, dir = r % 2 ? -1 : 1; for (let i = 0; i <= 30; i++) { const x = dir > 0 ? x0 + (x1 - x0) * i / 30 : x1 - (x1 - x0) * i / 30; pts.push([x, y]); } if (r < n - 1) { const cxr = dir > 0 ? x1 : x0, ny = yS + (r + 1) * TW + Math.sin(a + (r + 1) * .9) * TW * .07, mid = (y + ny) / 2, rr = (ny - y) / 2; for (let i = 1; i < steps; i++) { const ang = -Math.PI / 2 + i / steps * Math.PI; pts.push([cxr + dir * Math.cos(ang) * rr, mid + Math.sin(ang) * rr]); } } }
  const col = (i, l) => { const k = ((i / pts.length * 1 + t / 16) % 1) * 5, j = Math.floor(k), f = k - j, c = mix(C[j % 5], C[(j + 1) % 5], f); return mix(c, l > 0 ? '#ffffff' : '#000000', Math.abs(l)); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let layer = 0; layer < 14; layer++) { const f = layer / 13, wd = TW * (1 - f * .74), lv = -.42 + f * .78, oy = -TW * .12 * f; for (let i = 0; i < pts.length - 1; i++) { ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1] + oy); ctx.lineTo(pts[i + 1][0], pts[i + 1][1] + oy); ctx.lineWidth = wd; ctx.strokeStyle = col(i, lv); ctx.stroke(); } }
}
function drawNestedArches(ctx, w, h, d, t, o) {
  const dt = clamp((o && o.detail != null ? o.detail : 50) / 50, 0, 2), C = d.colors, a = t / 16 * Math.PI * 2, n = Math.max(4, Math.round(4 + 3 * dt)), dark = lum(C[0]) < .4;
  ctx.fillStyle = dark ? mix(C[0], '#000000', .2) : mix(C[4], '#ffffff', .7); ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1), s = 1 - f * .86, br = 1 + Math.sin(a - i * .6) * .03, aw = w * .86 * s * br, ah = h * .86 * Math.pow(s, .9) * br, r = Math.min(aw / 2, ah * .22), x = w / 2 - aw / 2, y = h - ah, ff = clamp(f + Math.sin(a - i * .6) * .12, 0, 1);
    const c = mix(mix(C[1], C[3], ff), dark ? C[2] : '#ffffff', dark ? ff * .7 : .55 - ff * .5); ctx.fillStyle = rgba(c, dark ? .9 : .95);
    ctx.beginPath(); ctx.moveTo(x, h + 2); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.lineTo(x + aw - r, y); ctx.arcTo(x + aw, y, x + aw, y + r, r); ctx.lineTo(x + aw, h + 2); ctx.closePath(); ctx.fill();
  }
}
