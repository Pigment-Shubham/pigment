/* ---------- Screensaver tab ---------- */
(function () {
  const css = document.createElement('style');
  css.textContent = `
.svset{display:grid;gap:18px;max-width:760px}.svrow{display:flex;flex-direction:column;gap:8px}.svrow label{font-weight:700}.svrow small{color:var(--mute)}
.svprev{width:100%;max-width:760px;aspect-ratio:16/9;border-radius:22px;overflow:hidden;background:#000;margin:0 0 18px;border:1px solid var(--line)}.svprev canvas{width:100%;height:100%;display:block}
.saver{position:fixed;inset:0;z-index:120;background:#000;overflow:hidden;cursor:none}.saver[hidden]{display:none}
.saver canvas{position:absolute;inset:0;width:100%;height:100%;transition:opacity 2s ease}
.saver .clk{position:absolute;color:#fff;font-family:var(--display);font-weight:300;letter-spacing:-.02em;text-shadow:0 2px 30px rgba(0,0,0,.35);transition:opacity 1.2s,left 1.2s,top 1.2s,color 1.2s;pointer-events:none;line-height:1}
.saver .clk small{display:block;font-size:.2em;font-weight:500;letter-spacing:.04em;margin-top:.6em;opacity:.85}
.saver .svbar{position:absolute;left:50%;bottom:max(24px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;opacity:0;transition:opacity .4s;pointer-events:none;background:rgba(17,17,20,.7);padding:10px 12px;border-radius:999px;backdrop-filter:blur(10px)}
.saver.show{cursor:default}.saver.show .svbar{opacity:1;pointer-events:auto}.saver .svbar .pill{color:#fff;border-color:#ffffff44}.saver .nm{position:absolute;left:24px;top:20px;color:#fff;font-size:13px;opacity:0;transition:opacity .4s;text-shadow:0 1px 8px rgba(0,0,0,.5)}.saver.show .nm{opacity:.85}`;
  document.head.appendChild(css);
  const DEF = { vibes: [], every: 30, pal: '', clock: 'time' };
  const cfg = () => Object.assign({}, DEF, LS.get('pg_saver', {})), save = c => LS.set('pg_saver', c);
  const liveKeys = vibes => { const set = vibes.length ? new Set(VIBES.filter(v => vibes.includes(v[0])).flatMap(v => v[1].split(' '))) : null; return STYLES.filter(s => s[3] && s[0] !== 'custom' && (!set || set.has(s[0]))).map(s => s[0]); };
  function pick(c) { const keys = liveKeys(c.vibes), k = keys[Math.floor(Math.random() * keys.length)] || 'liquid', pl = c.pal ? PALS.find(p => p[0] === c.pal) : PALS[Math.floor(Math.random() * PALS.length)], st = styleOf(k); return { style: k, colors: (pl || PALS[0])[1].slice(), seed: Math.floor(Math.random() * 9000) + 1, name: (pl || PALS[0])[0] + ' ' + st[1], o: {} }; }

  /* ---- the settings page ---- */
  let pv = null;
  window.initSaver = function () {
    const host = $('#p-saver'); host.textContent = ''; const c = cfg();
    const head = document.createElement('div'); head.className = 'head'; head.innerHTML = '<div><div class="kick">Screensaver</div><h2 class="h2" style="margin-top:8px">Wallpapers that play while you are away</h2></div>'; host.appendChild(head);
    const pc = makeCanvas(960, 540); const pw = document.createElement('div'); pw.className = 'svprev'; pw.appendChild(pc); host.appendChild(pw);
    let pd = pick(c); stopAnim('svprev'); paintTo(pc, pd, 2); startAnim('svprev', pc, () => pd, 24);
    const box = document.createElement('div'); box.className = 'svset'; host.appendChild(box);
    const row = (label, note) => { const r = document.createElement('div'); r.className = 'svrow'; const l = document.createElement('label'); l.textContent = label; r.appendChild(l); if (note) { const s = document.createElement('small'); s.textContent = note; r.appendChild(s); } box.appendChild(r); return r; };
    const chips = (r, items, isOn, onPick) => { const w = document.createElement('div'); w.className = 'chips'; items.forEach(([v, lab]) => { const b = document.createElement('button'); b.className = 'chip' + (isOn(v) ? ' on' : ''); b.type = 'button'; b.textContent = lab; b.onclick = () => { onPick(v); initSaver(); }; w.appendChild(b); }); r.appendChild(w); };
    chips(row('Which wallpapers', 'Pick one or more vibes, or leave on all moving wallpapers.'), [['', 'All moving']].concat(VIBES.filter(v => liveKeys([v[0]]).length).map(v => [v[0], v[0]])), v => v === '' ? !c.vibes.length : c.vibes.includes(v), v => { const x = cfg(); x.vibes = v === '' ? [] : (x.vibes.includes(v) ? x.vibes.filter(y => y !== v) : x.vibes.concat(v)); save(x); });
    chips(row('Change every'), [[15, '15 seconds'], [30, '30 seconds'], [60, '1 minute'], [300, '5 minutes']], v => c.every === v, v => { const x = cfg(); x.every = v; save(x); });
    chips(row('Clock'), [['off', 'Off'], ['time', 'Time'], ['date', 'Time and date']], v => c.clock === v, v => { const x = cfg(); x.clock = v; save(x); });
    const pr = row('Colours', 'Mix it up gives every wallpaper a different palette.'); const sel = document.createElement('select'); sel.className = 'pill line sm'; sel.setAttribute('aria-label', 'Palette'); [['', 'Mix it up']].concat(PALS.map(p => [p[0], p[0]])).forEach(([v, l]) => { const o = document.createElement('option'); o.value = v; o.textContent = l; sel.appendChild(o); }); sel.value = c.pal; sel.onchange = () => { const x = cfg(); x.pal = sel.value; save(x); initSaver(); }; sel.style.alignSelf = 'flex-start'; pr.appendChild(sel);
    const go = document.createElement('button'); go.className = 'pill accent'; go.type = 'button'; go.textContent = 'Start screensaver'; go.style.alignSelf = 'flex-start'; go.onclick = startSaver; box.appendChild(go);
    const tip = document.createElement('p'); tip.style.cssText = 'color:var(--mute);margin:0;max-width:60ch'; tip.textContent = 'It runs full screen in this browser tab and tries to keep your screen awake. Move the mouse for controls: Space is next, F is full screen, C toggles the clock, Esc stops. It is not a system screensaver, so it plays only while this page is open.'; box.appendChild(tip);
  };

  /* ---- the player ---- */
  const ov = document.createElement('div'); ov.className = 'saver'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Screensaver');
  const cvA = document.createElement('canvas'), cvB = document.createElement('canvas'), clk = document.createElement('div'), nm = document.createElement('div'), bar = document.createElement('div'); clk.className = 'clk'; nm.className = 'nm'; bar.className = 'svbar';
  [['Next', 'next'], ['Clock', 'clock'], ['Full screen', 'fs'], ['Stop', 'stop']].forEach(([l, k]) => { const b = document.createElement('button'); b.className = 'pill sm'; b.type = 'button'; b.textContent = l; b.dataset.k = k; bar.appendChild(b); });
  ov.append(cvA, cvB, clk, nm, bar); document.body.appendChild(ov);
  let LCV = null, run = false, front = cvA, back = cvB, cur = null, nxt = null, tStart = 0, tNext = 0, fadeUntil = 0, raf = 0, hideT = 0, wl = null, cfgNow = DEF, lastMin = -1, pos = 0, lastPaint = 0;
  const size = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = Math.min(Math.round(innerWidth * dpr), 1920), H = Math.max(2, Math.round(W * innerHeight / Math.max(1, innerWidth))); [cvA, cvB].forEach(c => { if (c.width !== W || c.height !== H) { c.width = W; c.height = H; } }); };
  const paintOne = (cv, d, t) => { render(cv.getContext('2d'), cv.width, cv.height, d, t, {}); };
  function showClock() {
    const m = cfgNow.clock; clk.style.opacity = m === 'off' ? 0 : 1; if (m === 'off') return; const n = new Date();
    clk.firstChild && (clk.textContent = ''); const t = document.createElement('div'); t.textContent = n.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, ''); clk.appendChild(t);
    if (m === 'date') { const s = document.createElement('small'); s.textContent = n.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }); clk.appendChild(s); }
    clk.style.fontSize = Math.round(Math.min(innerWidth, innerHeight * 1.6) * .13) + 'px';
    if (n.getMinutes() !== lastMin) { lastMin = n.getMinutes(); pos = (pos + 1 + Math.floor(Math.random() * 3)) % 4; const P = [[.06, .08], [.06, .66], [.64, .08], [.64, .66]][pos]; clk.style.left = P[0] * 100 + '%'; clk.style.top = P[1] * 100 + '%'; }
    let L = lum(cur.colors[0]); try { const P2 = [[.06, .08], [.06, .66], [.64, .08], [.64, .66]][pos], sw = Math.round(front.width * .3), sh = Math.round(front.height * .25), tc = LCV || (LCV = makeCanvas(8, 8)), tx = tc.getContext('2d'); tx.drawImage(front, P2[0] * front.width, P2[1] * front.height, sw, sh, 0, 0, 8, 8); const q = tx.getImageData(0, 0, 8, 8).data; let a = 0; for (let i = 0; i < q.length; i += 4) a += (q[i] * .299 + q[i + 1] * .587 + q[i + 2] * .114) / 255; L = a / 64; } catch (e) { }
    clk.style.color = L > .62 ? '#111114' : '#ffffff'; clk.style.textShadow = L > .62 ? '0 2px 24px rgba(255,255,255,.35)' : '';
  }
  function advance() {
    nxt = pick(cfgNow); size(); const t = performance.now(); paintOne(back, nxt, 2); back.style.opacity = 1; front.style.opacity = 0; fadeUntil = t + 2100; tNext = t + cfgNow.every * 1000;
    const done = () => { /* swap roles */ const f = front; front = back; back = f; cur = nxt; nxt = null; nm.textContent = cur.name; }; setTimeout(() => { if (run) done(); }, 2100);
    setTimeout(() => { if (run) showClock(); }, 0);
  }
  function loop(now) {
    if (!run) return; raf = requestAnimationFrame(loop);
    if (now >= tNext && !nxt) advance();
    if (now - lastPaint < 1000 / 30) return; lastPaint = now;
    if (!reduced) { const el = (now - tStart) / 1000 + 2; if (styleOf(cur.style)[3]) paintOne(front, cur, el); if (nxt && styleOf(nxt.style)[3]) paintOne(back, nxt, el); }
    if (now % 5000 < 40) showClock();
  }
  function startSaver() {
    cfgNow = cfg(); run = true; document.body.classList.add('saving'); ov.hidden = false; document.body.style.overflow = 'hidden'; size();
    cur = pick(cfgNow); front = cvA; back = cvB; front.style.opacity = 1; back.style.opacity = 0; paintOne(front, cur, 2); nm.textContent = cur.name; tStart = performance.now(); tNext = tStart + cfgNow.every * 1000; nxt = null; lastMin = -1; showClock();
    if (ov.requestFullscreen) ov.requestFullscreen().catch(() => { }); try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(l => { wl = l; }).catch(() => { }); } catch (e) { }
    raf = requestAnimationFrame(loop); poke();
  }
  function stopSaver() { if (!run) return; run = false; cancelAnimationFrame(raf); ov.hidden = true; document.body.classList.remove('saving'); document.body.style.overflow = ''; if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); try { if (wl) wl.release(); } catch (e) { } wl = null; }
  function poke() { ov.classList.add('show'); clearTimeout(hideT); hideT = setTimeout(() => ov.classList.remove('show'), 2800); }
  const toggleFs = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); else if (ov.requestFullscreen) ov.requestFullscreen().catch(() => { }); };
  const nextNow = () => { if (!nxt) tNext = 0; };
  ov.addEventListener('pointermove', poke); ov.addEventListener('pointerdown', poke);
  bar.addEventListener('click', e => { const k = e.target.dataset && e.target.dataset.k; if (k === 'next') nextNow(); else if (k === 'stop') stopSaver(); else if (k === 'fs') toggleFs(); else if (k === 'clock') { const o = ['off', 'time', 'date']; cfgNow.clock = o[(o.indexOf(cfgNow.clock) + 1) % 3]; lastMin = -1; showClock(); } });
  document.addEventListener('keydown', e => { if (!run) return; if (e.key === 'Escape') { stopSaver(); return; } if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); nextNow(); } else if (e.key === 'f' || e.key === 'F') toggleFs(); else if (e.key === 'c' || e.key === 'C') { const o = ['off', 'time', 'date']; cfgNow.clock = o[(o.indexOf(cfgNow.clock) + 1) % 3]; lastMin = -1; showClock(); } poke(); });
  document.addEventListener('fullscreenchange', () => { if (run && !document.fullscreenElement && !ov.hidden) { /* leaving full screen keeps the player open */ size(); } });
  addEventListener('resize', () => { if (run) size(); });
  document.addEventListener('visibilitychange', () => { if (run && !document.hidden && navigator.wakeLock) navigator.wakeLock.request('screen').then(l => { wl = l; }).catch(() => { }); });
  if (location.hash === '#saver') route();
})();
