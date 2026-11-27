/* ---------- more UI: search, favourite palette, daily download, share card ---------- */
const SYN = { calm: 'soft slow gentle quiet', dark: 'night midnight', night: 'dark moon stars', light: 'bright day', bright: 'light day', warm: 'sunset ember fire orange', cool: 'ocean blue sea lake', cozy: 'warm fire lamp', minimal: 'apple simple clean', simple: 'minimal clean', apple: 'command spotlight siri', retro: 'vintage sun', nature: 'leaves lake blossom dunes', space: 'moon stars galaxy', rain: 'storm window' };
function searchMatch(d, q) { const h = searchHay(d); return q.split(/\s+/).filter(Boolean).every(w => h.includes(w) || (SYN[w] || '').split(' ').some(x => x && h.includes(x))); }
function searchHay(d) {
  if (d._hay) return d._hay; const st = styleOf(d.style), vibes = VIBES.filter(v => v[1].split(' ').includes(d.style)).map(v => v[0]).join(' ');
  let h = (d.name + ' ' + st[1] + ' ' + st[4] + ' ' + d.pal + ' ' + vibes + ' ' + (st[3] ? 'live moving' : 'still') + ' ' + (lum(d.colors[0]) < .4 ? 'dark night' : 'light bright')).toLowerCase();
  try { Object.defineProperty(d, '_hay', { value: h, enumerable: false }); } catch (e) { } return h;
}
(function () {
  const css = document.createElement('style');
  css.textContent = '.bsearch{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 16px}.bsearch input{flex:1;min-width:200px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;padding:11px 18px;font:inherit}.bsearch select{max-width:190px}';
  document.head.appendChild(css);
  const host = $('#vibeChips'), bar = document.createElement('div'); bar.className = 'bsearch';
  const inp = document.createElement('input'); inp.type = 'search'; inp.placeholder = 'Search: dark, calm, moon, apple, warm…'; inp.setAttribute('aria-label', 'Search wallpapers');
  let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { fQuery = inp.value; initBrowse(); }, 220); };
  const sel = document.createElement('select'); sel.className = 'pill line sm'; sel.setAttribute('aria-label', 'Favourite palette'); [['', 'Palette: each style\'s own']].concat(PALS.map(p => [p[0], 'Palette: ' + p[0]])).forEach(([v, l]) => { const o = document.createElement('option'); o.value = v; o.textContent = l; sel.appendChild(o); }); sel.value = favPal();
  sel.onchange = () => { LS.set('pg_favpal', sel.value); initBrowse(); toast(sel.value ? 'Showing every style in ' + sel.value : 'Each style shows its own palette'); };
  bar.append(inp, sel); host.before(bar);

  /* daily pick: download + save beside Open it */
  const cap = $('.tcap'), ho = $('#heroOpen');
  if (cap && ho) { const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap'; ho.replaceWith(wrap); const dl = document.createElement('button'); dl.className = 'pill line sm'; dl.type = 'button'; dl.textContent = TOUCH ? 'Save image' : 'Download'; dl.onclick = () => { if (heroD) download(heroD, 'phone'); }; wrap.append(dl, ho); }

  /* share card */
  async function shareCard(d) {
    const W = 1080, H = 1350, c = makeCanvas(W, H), x = c.getContext('2d'), C = d.colors, dark = lum(C[0]) < .4;
    let g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, mix(C[0], dark ? '#000000' : '#ffffff', .35)); g.addColorStop(1, mix(C[1], dark ? '#000000' : '#ffffff', .2)); x.fillStyle = g; x.fillRect(0, 0, W, H);
    [[.2, .2, C[2]], [.85, .8, C[3]]].forEach(([px, py, col]) => { const r = x.createRadialGradient(W * px, H * py, 0, W * px, H * py, W * .7); r.addColorStop(0, rgba(col, .6)); r.addColorStop(1, rgba(col, 0)); x.fillStyle = r; x.fillRect(0, 0, W, H); });
    const pw = 450, ph = pw * 844 / 390, px = (W - pw) / 2, py = 90, p = makeCanvas(390, 844); paintTo(p, Object.assign({}, d, { o: Object.assign({}, d.o) }), 2);
    const rrp = (X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
    x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 60; x.shadowOffsetY = 28; rrp(px - 14, py - 14, pw + 28, ph + 28, 78); x.fillStyle = '#111114'; x.fill(); x.shadowColor = 'transparent';
    x.save(); rrp(px, py, pw, ph, 66); x.clip(); x.drawImage(p, px, py, pw, ph); x.restore();
    x.fillStyle = dark ? '#ffffff' : '#111114'; x.textAlign = 'center'; x.font = '700 54px -apple-system,"Helvetica Neue",Arial,sans-serif'; x.fillText(d.name, W / 2, py + ph + 100); x.globalAlpha = .6; x.font = '500 30px -apple-system,"Helvetica Neue",Arial,sans-serif'; x.fillText('Made with Pigment', W / 2, py + ph + 150); x.globalAlpha = 1;
    const blob = await new Promise(r => c.toBlob(r, 'image/png')); saveBlob(blob, 'pigment-' + (d.name || 'share').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-share.png'); toast('Share card saved');
  }
  const dv = drawView; drawView = function () {
    dv(); const info = $('#vInfo'), b = document.createElement('button'); b.className = 'pill line sm'; b.style.alignSelf = 'flex-start'; b.textContent = 'Share card'; b.onclick = () => shareCard(vD);
    const cb = [...info.querySelectorAll('button')].find(e => e.textContent === 'Compare palettes'); (cb || $('.swatches', info) || info.lastChild).after(b);
  };
})();
