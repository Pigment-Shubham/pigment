/* ---------- UI extras: card download, surprise shuffle, before/after, collections, compare, tour, shortcuts, mobile tabs ---------- */
(function () {
  const css = document.createElement('style');
  css.textContent = `
.card{position:relative}
.cdl{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;background:rgba(17,17,20,.72);color:#fff;display:grid;place-items:center;opacity:0;transform:translateY(-4px);transition:opacity .2s,transform .2s,background .2s;cursor:pointer;backdrop-filter:blur(8px)}
.card:hover .cdl,.card:focus-within .cdl{opacity:1;transform:none}.cdl:hover{background:var(--accent)}
@media (pointer:coarse){.cdl{opacity:.9;transform:none;width:32px;height:32px}}
.shuf{position:fixed;inset:0;z-index:80;background:#0b0b0e;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px;touch-action:pan-y;animation:fadeo .25s}
.shuf[hidden]{display:none}
.shuf .stg{height:min(74vh,calc(100vh - 170px));aspect-ratio:390/844;border-radius:34px;overflow:hidden;box-shadow:0 0 0 7px #1c1c22,0 24px 70px rgba(0,0,0,.6);transition:transform .25s,opacity .25s;touch-action:none}
.shuf canvas{width:100%;height:100%;display:block}
.shuf .nm{font-weight:700;text-align:center}.shuf .nm small{display:block;color:#9a9aa6;font-weight:500}
.shuf .bt{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.shuf .pill.line{color:#fff;border-color:#ffffff44}
.shuf .hint{font-size:12px;color:#8a8a96}
.shuf .x{position:absolute;top:max(14px,env(safe-area-inset-top,0px));right:16px}
.cmpbox{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid var(--line);border-radius:18px}
.cmpbox input[type=range]{width:100%}
.frame-p,.frame-d{position:relative}.frame-p .cmp,.frame-d .cmp{position:absolute;inset:0;width:100%;height:100%}
#prevFr.before #prevCv{opacity:0}#prevFr.before{background:linear-gradient(160deg,#3a3a42,#1c1c22)}
.colbar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px;align-items:center}
.colbar input{border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;padding:8px 14px;font:inherit;width:170px}
.colsel{font:inherit;font-size:12px;border:1px solid var(--line);background:transparent;color:var(--fg);border-radius:999px;padding:3px 6px;max-width:110px}
.tour{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:92;background:var(--fg);color:var(--onfg);border-radius:22px;padding:16px 18px;width:min(420px,calc(100vw - 28px));box-shadow:0 12px 40px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:10px}
.tour b{font-family:var(--display);font-size:18px}.tour p{margin:0;opacity:.85}.tour .r{display:flex;justify-content:space-between;align-items:center;gap:10px}.tour .pill{background:var(--onfg);color:var(--fg)}.tour .skip{opacity:.7;text-decoration:underline}
.kbd{position:fixed;inset:0;z-index:96;background:rgba(17,17,20,.55);display:grid;place-items:center;padding:18px}
.kbd>div{background:var(--card);color:var(--fg);border-radius:24px;padding:24px;width:min(420px,100%);max-height:90vh;overflow:auto}
.kbd h3{margin:0 0 12px;font-family:var(--display);font-size:24px}.kbd dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0 0 16px}.kbd dt kbd{background:var(--soft);border:1px solid var(--line);border-radius:7px;padding:2px 8px;font:600 13px var(--body)}.kbd dd{margin:0;color:var(--mute)}
@media (max-width:700px){
 body{padding-bottom:calc(66px + env(safe-area-inset-bottom,0px))}
 .nav{position:fixed!important;left:0;right:0;bottom:0;top:auto;margin:0!important;flex-basis:auto!important;order:0!important;z-index:45;background:var(--barbg);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--line);justify-content:space-around;gap:0;padding:6px 6px calc(6px + env(safe-area-inset-bottom,0px));overflow:visible}
 .nav a{flex:1;text-align:center;font-size:12px;padding:10px 2px;border-radius:12px}.nav a.on{background:var(--soft);color:var(--fg);font-weight:700}.nav a::after{display:none}
 .aib{bottom:calc(76px + env(safe-area-inset-bottom,0px))!important}.aip{bottom:calc(146px + env(safe-area-inset-bottom,0px))!important;height:min(560px,calc(100dvh - 200px))!important}
 .toast{bottom:calc(84px + env(safe-area-inset-bottom,0px))}
 .tour{bottom:calc(84px + env(safe-area-inset-bottom,0px))}
}`;
  document.head.appendChild(css);
  const typing = e => /^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName) || (e.target && e.target.isContentEditable);

  /* ---- 2. surprise shuffle ---- */
  const sh = document.createElement('div'); sh.className = 'shuf'; sh.hidden = true; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'Surprise me');
  sh.innerHTML = '<button class="pill line sm x" type="button">Close</button><div class="stg"><canvas width="390" height="844"></canvas></div><div class="nm"></div><div class="bt"><button class="pill line" data-a="skip" type="button">Skip</button><button class="pill accent" data-a="keep" type="button">Keep</button><button class="pill line" data-a="open" type="button">Open</button></div><div class="hint">Swipe or use ← skip, → keep, Enter open, Esc close</div>';
  document.body.appendChild(sh);
  const stg = $('.stg', sh), scv = $('canvas', sh); let sd = null;
  function nextS() {
    const live = ALL.filter(a => styleOf(a.style)[3]), pl = PALS[Math.floor(Math.random() * PALS.length)], b = live[Math.floor(Math.random() * live.length)];
    sd = Object.assign({}, b, { id: 'sh' + Date.now(), colors: pl[1].slice(), seed: Math.floor(Math.random() * 9000) + 1, name: pl[0] + ' ' + styleOf(b.style)[1], o: {} });
    stopAnim('shuf'); paintTo(scv, sd, 2); startAnim('shuf', scv, () => sd, 30); $('.nm', sh).textContent = ''; const n = document.createElement('span'); n.textContent = sd.name; const s = document.createElement('small'); s.textContent = 'Live · ' + styleOf(sd.style)[1]; $('.nm', sh).append(n, s);
    stg.style.transition = 'none'; stg.style.transform = 'scale(.94)'; stg.style.opacity = 0; requestAnimationFrame(() => { stg.style.transition = ''; stg.style.transform = ''; stg.style.opacity = 1; });
  }
  const openS = () => { sh.hidden = false; document.body.style.overflow = 'hidden'; nextS(); };
  const closeS = () => { sh.hidden = true; stopAnim('shuf'); document.body.style.overflow = ''; };
  const act = a => { if (a === 'skip') nextS(); else if (a === 'keep') { saveDesign(sd); nextS(); } else if (a === 'open') { const d = sd; closeS(); openView(d); } };
  $$('button[data-a]', sh).forEach(b => b.onclick = () => act(b.dataset.a)); $('.x', sh).onclick = closeS;
  let sx = null; sh.addEventListener('pointerdown', e => { sx = e.clientX; }); sh.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (dx > 70) act('keep'); else if (dx < -70) act('skip'); });
  $('#surprise').onclick = openS;

  /* ---- 3. before / after + live clock ---- */
  { const bar = $('.prevbar'), ba = document.createElement('button'); ba.className = 'pill sm'; ba.id = 'prevBA'; ba.textContent = 'Show before'; bar.insertBefore(ba, $('#prevX'));
    ba.onclick = () => { const on = $('#prevFr').classList.toggle('before'); ba.textContent = on ? 'Show after' : 'Show before'; };
    setInterval(() => { if (!$('#prev').hidden && !$('#plock').hidden) { const tm = $('#plock .tm'); if (tm) { const n = new Date(); tm.textContent = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'); } } }, 1000);
    const op = openPreview; openPreview = function (d) { $('#prevFr').classList.remove('before'); ba.textContent = 'Show before'; op(d); }; }

  /* ---- 5. compare palettes ---- */
  { const dv = drawView; drawView = function () {
      stopAnim('cmp'); dv();
      const info = $('#vInfo'), btn = document.createElement('button'); btn.className = 'pill line sm'; btn.style.alignSelf = 'flex-start'; btn.textContent = 'Compare palettes';
      btn.onclick = () => {
        btn.hidden = true; const box = document.createElement('div'); box.className = 'cmpbox'; const sel = document.createElement('select'); sel.className = 'pill line sm'; sel.setAttribute('aria-label', 'Compare with palette');
        PALS.forEach((p, i) => { const o = document.createElement('option'); o.value = i; o.textContent = p[0]; sel.appendChild(o); }); sel.value = (PALS.findIndex(p => p[0] !== (vD.name || '').split(' ')[0]) + 3) % PALS.length;
        const rg = document.createElement('input'); rg.type = 'range'; rg.min = 0; rg.max = 100; rg.value = 50; rg.setAttribute('aria-label', 'Slide to compare');
        const fr = $('#vStage > div'), c2 = document.createElement('canvas'); c2.className = 'cmp'; c2.width = fr.firstChild.width; c2.height = fr.firstChild.height; fr.appendChild(c2);
        const mo = vDev === 'desk' ? { menubar: true } : null, dd = () => Object.assign({}, vD, { colors: PALS[+sel.value][1].slice() }), clip = () => { c2.style.clipPath = 'inset(0 0 0 ' + rg.value + '%)'; };
        const go = () => { stopAnim('cmp'); paintTo(c2, dd(), 2, mo); startAnim('cmp', c2, dd, 30, mo); clip(); };
        sel.onchange = go; rg.oninput = clip; go();
        const note = document.createElement('small'); note.style.color = 'var(--mute)'; note.textContent = 'Left is this wallpaper, right is the other palette. Drag the slider.';
        const done = document.createElement('button'); done.className = 'pill line sm'; done.textContent = 'Apply this palette'; done.onclick = () => { vD = Object.assign({}, vD, { colors: PALS[+sel.value][1].slice(), name: PALS[+sel.value][0] + ' ' + styleOf(vD.style)[1] }); drawView(); };
        box.append(sel, rg, note, done); btn.after(box);
      };
      const sw = $('.swatches', info); if (sw) sw.after(btn); else info.appendChild(btn);
    }; }

  /* ---- 4. collections ---- */
  { let cur = 'all'; const getC = () => { const s = new Set(LS.get('pg_cols', [])); saved().forEach(d => { if (d.col) s.add(d.col); }); return [...s]; };
    const setCol = (id, col) => { const l = saved(); const x = l.find(d => d.id === id); if (!x) return; if (col) x.col = col; else delete x.col; const all = LS.get('pg_saved', []).map(d => d && d.id === id ? x : d); LS.set('pg_saved', all); };
    const is = initSaved; initSaved = function () {
      is(); const host = $('#savedGal'), l = saved(); if (!l.length) return; let bar = $('#colBar'); if (!bar) { bar = document.createElement('div'); bar.id = 'colBar'; bar.className = 'colbar'; host.before(bar); } bar.textContent = '';
      const cols = getC(); if (cur !== 'all' && !cols.includes(cur)) cur = 'all';
      [['all', 'All']].concat(cols.map(c => [c, c])).forEach(([k, lab]) => { const b = document.createElement('button'); b.className = 'chip' + (cur === k ? ' on' : ''); b.textContent = lab; b.onclick = () => { cur = k; initSaved(); }; bar.appendChild(b); });
      const nb = document.createElement('button'); nb.className = 'chip'; nb.textContent = '+ New collection'; nb.onclick = () => { const i = document.createElement('input'); i.placeholder = 'Name, then Enter'; i.maxLength = 24; nb.replaceWith(i); i.focus(); const ok = () => { const n = i.value.trim(); if (n) { LS.set('pg_cols', [...new Set(LS.get('pg_cols', []).concat(n))]); toast('Collection "' + n + '" created. Use the menu on a wallpaper to move it in.'); } initSaved(); }; i.onkeydown = e => { if (e.key === 'Enter') ok(); else if (e.key === 'Escape') initSaved(); }; i.onblur = ok; }; bar.appendChild(nb);
      $$('.card', host).forEach((c, i) => { const d = l[i]; if (!d) return; if (cur !== 'all' && d.col !== cur) { c.style.display = 'none'; return; }
        const s = document.createElement('select'); s.className = 'colsel'; s.setAttribute('aria-label', 'Move to collection'); [['', 'No collection']].concat(cols.map(x => [x, x])).forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; s.appendChild(o); }); s.value = d.col || ''; s.onclick = ev => ev.stopPropagation(); s.onchange = () => { setCol(d.id, s.value); toast(s.value ? 'Moved to ' + s.value : 'Removed from collection'); initSaved(); }; $('.m', c).appendChild(s); });
    }; }

  /* ---- 6. tour + shortcuts ---- */
  const kb = document.createElement('div'); kb.className = 'kbd'; kb.hidden = true;
  kb.innerHTML = '<div role="dialog" aria-label="Keyboard shortcuts"><h3>Keyboard shortcuts</h3><dl><dt><kbd>?</kbd></dt><dd>Show this list</dd><dt><kbd>S</kbd></dt><dd>Surprise me</dd><dt><kbd>1</kbd> – <kbd>4</kbd></dt><dd>Home, Browse, Studio, Saved</dd><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Skip or keep in Surprise me</dd><dt><kbd>Enter</kbd></dt><dd>Open the wallpaper in Surprise me</dd><dt><kbd>D</kbd></dt><dd>Download the open wallpaper</dd><dt><kbd>V</kbd></dt><dd>Save the open wallpaper</dd><dt><kbd>Esc</kbd></dt><dd>Close anything open</dd></dl><button class="pill sm" type="button">Got it</button></div>';
  document.body.appendChild(kb); const kc = () => { kb.hidden = true; }; $('button', kb).onclick = kc; kb.onclick = e => { if (e.target === kb) kc(); };
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') { if (!kb.hidden) kc(); else if (!sh.hidden) closeS(); return; }
    if (typing(e) || document.body.classList.contains('saving')) return;
    if (!sh.hidden) { if (e.key === 'ArrowLeft') act('skip'); else if (e.key === 'ArrowRight') act('keep'); else if (e.key === 'Enter') { e.preventDefault(); act('open'); } return; }
    if (e.key === '?') { kb.hidden = !kb.hidden; return; }
    if (!$('#view').hidden) { if (e.key === 'd' || e.key === 'D') download(vD, vDev); else if (e.key === 'v' || e.key === 'V') saveDesign(vD); return; }
    if (!$('#prev').hidden || !$('#authView').hidden) return;
    if (e.key === 's' || e.key === 'S') openS(); else if (/^[1-4]$/.test(e.key)) location.hash = '#' + ['home', 'browse', 'studio', 'saved'][+e.key - 1];
  });
  { const ft = $('#footNote'), kl = document.createElement('button'); kl.className = 'authlink'; kl.textContent = 'Shortcuts & tour'; kl.onclick = () => { if (TOUCH) tour(); else kb.hidden = false; }; ft.after(kl); }
  function tour() {
    const S = [['Browse and tap', 'Every wallpaper is drawn in your browser. Hover a card to see it move, and tap the arrow on it to download.'], ['Make it yours', 'Open one to change speed or colours, compare palettes, preview it on a phone, or remix it in the Studio.'], ['Not sure? Surprise me', 'Press S, or the Surprise me button. Keep what you like and skip the rest. Press ? any time for shortcuts.']];
    let i = 0; const t = document.createElement('div'); t.className = 'tour'; document.body.appendChild(t);
    const show = () => { t.textContent = ''; const h = document.createElement('b'), p = document.createElement('p'), r = document.createElement('div'); r.className = 'r'; h.textContent = S[i][0]; p.textContent = S[i][1]; const sk = document.createElement('button'); sk.className = 'skip'; sk.textContent = 'Skip tour'; sk.onclick = () => t.remove(); const nx = document.createElement('button'); nx.className = 'pill sm'; nx.textContent = i < S.length - 1 ? 'Next (' + (i + 1) + '/' + S.length + ')' : 'Done'; nx.onclick = () => { if (++i < S.length) show(); else t.remove(); }; r.append(sk, nx); t.append(h, p, r); };
    show();
  }
  if (!LS.get('pg_tour', false)) { LS.set('pg_tour', true); setTimeout(tour, 2500); }
})();
