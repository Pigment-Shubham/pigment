/* Apple-style, one-focus wallpapers (preview only) */
function appleFont() { return '-apple-system,"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif'; }
function cmdPath(ctx, s, r) {
  ctx.beginPath(); ctx.rect(-s / 2, -s / 2, s, s);
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => { ctx.save(); ctx.translate(sx * s / 2, sy * s / 2); ctx.scale(sx, sy); ctx.moveTo(r * Math.cos(1.5 * Math.PI), r * Math.sin(1.5 * Math.PI)); ctx.arc(0, 0, r, 1.5 * Math.PI, 3 * Math.PI, false); ctx.restore(); });
}
function softBg(ctx, w, h, C, a, dark) {
  const m = Math.max(w, h); ctx.fillStyle = dark ? mix(C[0], '#000000', .55) : mix(C[0], '#ffffff', .35); ctx.fillRect(0, 0, w, h);
  [[.25, .2, C[1], 0], [.78, .75, C[2], 2.4]].forEach(([x, y, c, p]) => { const cx = w * (x + .05 * Math.sin(a + p)), cy = h * (y + .04 * Math.cos(a + p)), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m * .55); g.addColorStop(0, rgba(c, dark ? .55 : .7)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); });
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function drawAppleKey(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h), dark = lum(C[0]) < .4; softBg(ctx, w, h, C, a, dark);
  const K = m * .5, bob = Math.sin(a) * m * .012, x = w / 2 - K / 2, y = h / 2 - K / 2 + bob;
  ctx.fillStyle = 'rgba(0,0,0,' + (.22 - bob / m * 3) + ')'; ctx.beginPath(); ctx.ellipse(w / 2, h / 2 + K * .62, K * (.46 - bob / m * 2), K * .06, 0, 0, 7); ctx.fill();
  rr(ctx, x, y + K * .05, K, K, K * .2); ctx.fillStyle = dark ? '#0c0c0f' : '#c9c9d1'; ctx.fill();
  rr(ctx, x, y, K, K, K * .2); let g = ctx.createLinearGradient(0, y, 0, y + K); g.addColorStop(0, dark ? '#3c3c44' : '#ffffff'); g.addColorStop(1, dark ? '#1c1c21' : '#e6e6ec'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.9)'; ctx.lineWidth = K * .008; ctx.stroke();
  ctx.save(); ctx.translate(w / 2, y + K * .42); ctx.strokeStyle = dark ? '#f2f2f7' : '#2a2a30'; ctx.lineWidth = K * .028; ctx.lineJoin = 'round'; cmdPath(ctx, K * .2, K * .075); ctx.stroke(); ctx.restore();
  ctx.fillStyle = dark ? '#f2f2f7' : '#2a2a30'; ctx.textAlign = 'center'; ctx.font = '500 ' + K * .075 + 'px ' + appleFont(); ctx.fillText('command', w / 2, y + K * .8);
}
function drawAppleGlass(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h); ctx.fillStyle = mix(C[0], '#000000', .5); ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'screen';
  [[.35, .4, C[1], 0], [.68, .55, C[2], 2], [.5, .72, C[3], 4]].forEach(([x, y, c, p]) => { const cx = w * (x + .1 * Math.sin(a + p)), cy = h * (y + .06 * Math.cos(a + p)), r = Math.max(w, h) * .38, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, rgba(c, .9)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); });
  ctx.globalCompositeOperation = 'source-over'; ctx.save(); ctx.translate(w / 2, h / 2); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  cmdPath(ctx, m * .28, m * .105); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = m * .05; ctx.shadowOffsetY = m * .02; ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = m * .085; ctx.stroke(); ctx.shadowColor = 'transparent';
  const sh = ctx.createLinearGradient(-m * .3, -m * .3, m * .3, m * .3), p = (Math.sin(a) + 1) / 2; sh.addColorStop(0, 'rgba(255,255,255,.95)'); sh.addColorStop(.5, 'rgba(255,255,255,' + (.35 + .2 * p) + ')'); sh.addColorStop(1, 'rgba(255,255,255,.8)'); cmdPath(ctx, m * .28, m * .105); ctx.strokeStyle = sh; ctx.lineWidth = m * .014; ctx.stroke(); ctx.restore();
}
function drawAppleSearch(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h), dark = lum(C[0]) < .4; softBg(ctx, w, h, C, a, dark);
  const bw = Math.min(w * .88, m * 1.3), bh = bw * .17, x = w / 2 - bw / 2, y = h / 2 - bh / 2 + Math.sin(a) * bh * .08;
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = bh * .8; ctx.shadowOffsetY = bh * .25; rr(ctx, x, y, bw, bh, bh * .36); ctx.fillStyle = dark ? 'rgba(40,40,48,.78)' : 'rgba(255,255,255,.8)'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = dark ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.9)'; ctx.lineWidth = Math.max(1, bh * .015); ctx.stroke();
  const ic = dark ? '#d8d8e0' : '#5b5b66', cx = x + bh * .55, cy = y + bh / 2; ctx.strokeStyle = ic; ctx.lineWidth = bh * .075; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx - bh * .03, cy - bh * .03, bh * .17, 0, 7); ctx.moveTo(cx + bh * .09, cy + bh * .09); ctx.lineTo(cx + bh * .22, cy + bh * .22); ctx.stroke();
  ctx.fillStyle = dark ? '#8e8e98' : '#8a8a94'; ctx.font = '400 ' + bh * .42 + 'px ' + appleFont(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Spotlight Search', x + bh * 1.0, cy + bh * .02);
  const bl = Math.sin(a * 4) > -.2 ? 1 : 0; if (bl) { ctx.fillStyle = C[2]; ctx.fillRect(x + bh * 1.0 + ctx.measureText('Spotlight Search').width + bh * .1, cy - bh * .2, Math.max(2, bh * .035), bh * .4); } ctx.textBaseline = 'alphabetic';
}
function drawAppleIsland(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h), dark = lum(C[0]) < .4; softBg(ctx, w, h, C, a, dark);
  const k = (Math.sin(a) + 1) / 2, bw = m * (.3 + .34 * k), bh = m * (.1 + .02 * k), x = w / 2 - bw / 2, y = h / 2 - bh / 2;
  ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = bh * .6; ctx.shadowOffsetY = bh * .2; rr(ctx, x, y, bw, bh, bh / 2); ctx.fillStyle = '#000000'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = C[2]; ctx.beginPath(); ctx.arc(x + bh * .5, h / 2, bh * .16 * (1 + .15 * Math.sin(a * 3)), 0, 7); ctx.fill();
  for (let i = 0; i < 5; i++) { const bx = x + bw - bh * (.45 + i * .22), amp = bh * (.12 + .22 * (Math.sin(a * 2 + i * 1.3) + 1) / 2) * k; ctx.fillStyle = C[1]; rr(ctx, bx, h / 2 - amp, bh * .08, amp * 2 + 1, bh * .04); ctx.fill(); }
}
function drawAppleRings(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h), cx = w / 2, cy = h / 2; ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h);
  const cols = [C[1], C[2], C[3]], lw = m * .085; ctx.lineCap = 'round';
  cols.forEach((c, i) => { const R = m * (.34 - i * .1), p = .15 + .8 * (Math.sin(a + i * 1.1) + 1) / 2, st = -Math.PI / 2; ctx.strokeStyle = rgba(c, .22); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(cx, cy, R, st, st + p * 6.2832); ctx.stroke(); ctx.fillStyle = '#000000'; const ex = cx + Math.cos(st + p * 6.2832) * R, ey = cy + Math.sin(st + p * 6.2832) * R; ctx.fillStyle = mix(c, '#ffffff', .25); ctx.beginPath(); ctx.arc(ex, ey, lw * .12, 0, 7); ctx.fill(); });
}
function drawAppleOrb(ctx, w, h, d, t, o) {
  const C = d.colors, a = t / 16 * 6.2832, m = Math.min(w, h), cx = w / 2, cy = h / 2, R = m * (.25 + .012 * Math.sin(a * 2)); ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h);
  const gl = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R * 2.3); gl.addColorStop(0, rgba(C[2], .4)); gl.addColorStop(1, rgba(C[2], 0)); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip(); ctx.fillStyle = mix(C[0], '#000000', .4); ctx.fillRect(cx - R, cy - R, R * 2, R * 2); ctx.globalCompositeOperation = 'screen';
  [[C[1], 0], [C[2], 2.1], [C[3], 4.2], [C[4], 1]].forEach(([c, p], i) => { const x = cx + Math.cos(a + p) * R * .5, y = cy + Math.sin(a * (1 + i % 2) + p) * R * .5, g = ctx.createRadialGradient(x, y, 0, x, y, R * .95); g.addColorStop(0, rgba(c, .95)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); });
  ctx.restore(); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = m * .004; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
}
