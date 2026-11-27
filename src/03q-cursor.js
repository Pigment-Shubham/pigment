/* cursor-following wallpapers (preview only). o.ptr(tau) -> [x,y] (0..1) where the pointer was tau seconds ago; falls back to a gentle idle path */
function cursorAt(o, t, tau) {
  if (o && typeof o.ptr === 'function') return o.ptr(tau);
  const a = (t - tau) / 16 * 6.2832; return [.5 + .3 * Math.sin(a), .5 + .28 * Math.sin(a * 2 + 1)];
}
function drawCursorGlow(ctx, w, h, d, t, o) {
  const C = d.colors, m = Math.max(w, h); ctx.fillStyle = mix(C[0], '#000000', .65); ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = 'screen';
  for (let i = 14; i >= 0; i--) { const p = cursorAt(o, t, i * .07), k = 1 - i / 15, r = m * (.05 + .17 * k), g = ctx.createRadialGradient(p[0] * w, p[1] * h, 0, p[0] * w, p[1] * h, r), c = C[1 + i % 3]; g.addColorStop(0, rgba(c, .2 * k + .03)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  ctx.globalCompositeOperation = 'source-over'; const p = cursorAt(o, t, 0), c = ctx.createRadialGradient(p[0] * w, p[1] * h, 0, p[0] * w, p[1] * h, m * .03); c.addColorStop(0, 'rgba(255,255,255,.95)'); c.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = c; ctx.fillRect(0, 0, w, h);
}
function drawCursorDots(ctx, w, h, d, t, o) {
  const C = d.colors, m = Math.min(w, h), dark = lum(C[0]) < .4, p = cursorAt(o, t, .08), px = p[0] * w, py = p[1] * h; ctx.fillStyle = dark ? mix(C[0], '#000000', .6) : mix(C[0], '#ffffff', .75); ctx.fillRect(0, 0, w, h);
  const gap = m / 13, cols = Math.ceil(w / gap) + 1, rows = Math.ceil(h / gap) + 1;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = i * gap + (w - (cols - 1) * gap) / 2, y = j * gap + (h - (rows - 1) * gap) / 2, dx = px - x, dy = py - y, ds = Math.hypot(dx, dy), f = Math.exp(-ds * ds / (m * m * .06)), mv = f * gap * .45; ctx.fillStyle = f > .05 ? mix(dark ? '#8a8a96' : '#b8b8c4', C[2 + (i + j) % 2], Math.min(1, f * 1.3)) : (dark ? '#5a5a66' : '#b0b0bc'); ctx.beginPath(); ctx.arc(x + dx / (ds || 1) * mv, y + dy / (ds || 1) * mv, gap * (.08 + .2 * f), 0, 7); ctx.fill(); }
}
function drawCursorPills(ctx, w, h, d, t, o) {
  const C = d.colors, m = Math.min(w, h), dark = lum(C[0]) < .4, p = cursorAt(o, t, .1); ctx.fillStyle = dark ? mix(C[0], '#000000', .6) : mix(C[0], '#ffffff', .78); ctx.fillRect(0, 0, w, h);
  const cols = 7, rows = 11, gx = w / cols, gy = h / rows, cl = [C[1], C[2], C[3], C[4]];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = (i + .5) * gx, y = (j + .5) * gy, ang = Math.atan2(p[1] * h - y, p[0] * w - x), ds = Math.hypot(p[0] * w - x, p[1] * h - y), near = Math.exp(-ds * ds / (m * m * .25)), L = gx * (.5 + .55 * near), T = gx * .2; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(-L / 2 + T / 2, -T / 2); ctx.lineTo(L / 2 - T / 2, -T / 2); ctx.arc(L / 2 - T / 2, 0, T / 2, -Math.PI / 2, Math.PI / 2); ctx.lineTo(-L / 2 + T / 2, T / 2); ctx.arc(-L / 2 + T / 2, 0, T / 2, Math.PI / 2, 1.5 * Math.PI); ctx.closePath(); ctx.fillStyle = rgba(cl[(i + j) % 4], .35 + .6 * near); ctx.fill(); ctx.restore(); }
}
function drawCursorLight(ctx, w, h, d, t, o) {
  const C = d.colors, m = Math.max(w, h), p = cursorAt(o, t, .05), px = p[0] * w, py = p[1] * h;
  let g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, C[1]); g.addColorStop(.5, C[2]); g.addColorStop(1, C[3]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const gap = m / 22; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = Math.max(1, m * .0014); ctx.beginPath(); for (let x = 0; x <= w; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); } for (let y = 0; y <= h; y += gap) { ctx.moveTo(0, y); ctx.lineTo(w, y); } ctx.stroke();
  const r = ctx.createRadialGradient(px, py, 0, px, py, m * .32); r.addColorStop(0, 'rgba(4,4,10,0)'); r.addColorStop(.5, 'rgba(4,4,10,.45)'); r.addColorStop(1, 'rgba(4,4,10,.94)'); ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
}
