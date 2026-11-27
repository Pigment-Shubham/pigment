/* ---------- app icon drawn in the browser, so the app is a single file ---------- */
function logoCanvas(S) {
  const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d');
  let g = x.createLinearGradient(0, 0, S, S); g.addColorStop(0, '#1b1530'); g.addColorStop(1, '#0d0a1a'); x.fillStyle = g; x.fillRect(0, 0, S, S);
  const r = x.createRadialGradient(S * .5, S * .62, 0, S * .5, S * .62, S * .62); r.addColorStop(0, 'rgba(255,107,74,.28)'); r.addColorStop(.6, 'rgba(122,92,255,.12)'); r.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = r; x.fillRect(0, 0, S, S);
  const cx = S / 2, cy = S * .585, R = S * .235, top = S * .17;
  const drop = () => { x.beginPath(); x.moveTo(cx, top); x.bezierCurveTo(cx + R * .18, top + S * .14, cx + R, cy - R * .95, cx + R, cy); x.arc(cx, cy, R, 0, Math.PI, false); x.bezierCurveTo(cx - R, cy - R * .95, cx - R * .18, top + S * .14, cx, top); x.closePath(); };
  x.save(); x.shadowColor = 'rgba(255,107,74,.55)'; x.shadowBlur = S * .09; x.shadowOffsetY = S * .025; drop(); x.fillStyle = '#ff6b4a'; x.fill(); x.restore();
  const t = document.createElement('canvas'); t.width = t.height = S; render(t.getContext('2d'), S, S, { style: 'grain', colors: ['#ffd9b8', '#ff5a3c', '#ffb25b', '#ff4f8b', '#7a5cff'], seed: 29, name: 'x' }, 2, { grain: 30, detail: 60, speed: 1 });
  x.save(); drop(); x.clip(); x.drawImage(t, 0, 0);
  const d = x.createLinearGradient(cx - R, top, cx + R, cy + R); d.addColorStop(0, 'rgba(255,255,255,.28)'); d.addColorStop(.5, 'rgba(255,255,255,0)'); d.addColorStop(1, 'rgba(60,10,90,.35)'); x.fillStyle = d; x.fillRect(0, 0, S, S); x.restore();
  x.save(); drop(); x.clip(); x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(cx - R * .42, cy - R * .28, R * .11, R * .34, .35, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.arc(cx - R * .2, cy + R * .5, R * .07, 0, 7); x.fill(); x.restore();
  drop(); x.lineWidth = S * .006; x.strokeStyle = 'rgba(255,255,255,.35)'; x.stroke();
  [[.78, .3, .026, '#7a5cff'], [.24, .74, .02, '#ffb25b'], [.8, .78, .014, '#ff4f8b']].forEach(([a, b, rr, col]) => { x.beginPath(); x.arc(S * a, S * b, S * rr, 0, 7); x.fillStyle = col; x.shadowColor = col; x.shadowBlur = S * .03; x.fill(); x.shadowBlur = 0; });
  return c;
}
const drawLogo = S => logoCanvas(S).toDataURL('image/png');
/* Mac Dock and desktop installs do not round icons, so give them a rounded shape with the usual margin and a soft shadow. */
function drawLogoRound(S) {
  const art = logoCanvas(S), c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), m = S * .098, w = S - 2 * m, r = w * .225;
  const path = () => { x.beginPath(); x.roundRect(m, m, w, w, r); };
  x.save(); x.shadowColor = 'rgba(0,0,0,.30)'; x.shadowBlur = S * .025; x.shadowOffsetY = S * .014; path(); x.fillStyle = '#0d0a1a'; x.fill(); x.restore();
  x.save(); path(); x.clip(); x.drawImage(art, m, m, w, w); x.restore();
  path(); x.lineWidth = S * .004; x.strokeStyle = 'rgba(255,255,255,.14)'; x.stroke();
  return c.toDataURL('image/png');
}
setTimeout(() => {
  try {
    const add = (rel, href, extra) => { const l = document.createElement('link'); l.rel = rel; l.href = href; if (extra) l.type = extra; document.head.appendChild(l); };
    const i192 = drawLogoRound(192), i512 = drawLogoRound(512), full512 = drawLogo(512), phone = /iPhone|iPad|iPod/.test(navigator.userAgent);
    add('icon', i192, 'image/png'); add('apple-touch-icon', phone ? drawLogo(180) : drawLogoRound(512));
    const base = location.origin + location.pathname, m = { name: 'Pigment', short_name: 'Pigment', description: 'Aesthetic and live wallpapers for iPhone and MacBook', start_url: base, scope: base.replace(/[^/]*$/, ''), display: 'standalone', background_color: '#ffffff', theme_color: '#ffffff', icons: [{ src: i192, sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: i512, sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: full512, sizes: '512x512', type: 'image/png', purpose: 'maskable' }] };
    if (location.protocol.startsWith('http')) add('manifest', URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' })));
  } catch (e) { }
}, 600);
