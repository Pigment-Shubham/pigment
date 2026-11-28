/* ---------- appearance (theme + background) and the set-up guide ---------- */
function initSetup() {
  const T = {
    iphone: [['Pick a wallpaper', 'Open one in Pigment, choose iPhone, then tap Save image (or Download). It saves at full resolution.'], ['Add it in Settings', 'On your iPhone open Settings, then Wallpaper, then Add New Wallpaper, then Photos, and choose the image.'], ['Set it', 'Tap Add, then Set as Wallpaper Pair (or customise Lock Screen and Home Screen separately).']],
    mac: [['Still wallpaper', 'Download it, then open System Settings, then Wallpaper, then Add Photo and choose the file.'], ['Live wallpaper', 'Install Plash, a free app that shows a web page as your wallpaper. In Pigment open a live wallpaper and tap "Live file (.html)".'], ['Add it to Plash', 'Open Plash from the menu bar, choose Add, and pick the downloaded .html file. It runs behind your windows.'], ['Screensaver', 'Open the Screensaver tab, pick one or more styles and choose Download screensaver file. Install the free WebViewScreenSaver app, put the file in a folder like your home folder (not Downloads, Documents or Desktop), then in System Settings, Screen Saver, choose WebViewScreenSaver and add the file path as its address with the time set to -1.']],
    win: [['Still wallpaper', 'Download it, then right-click the image and choose Set as desktop background.'], ['Live wallpaper', 'Install Lively Wallpaper, a free app from the Microsoft Store. In Pigment open a live wallpaper and tap "Live file (.html)" or "Seamless loop video".'], ['Add it to Lively', 'Open Lively, drag the downloaded file onto its window, then click it to set it as your wallpaper.']]
  };
  const note = { iphone: 'iPhone only allows still images for custom wallpapers, so live styles are saved as a still.', mac: 'Plash and Lively are separate free apps made by other people, not by Pigment.', win: 'Plash and Lively are separate free apps made by other people, not by Pigment.' };
  const body = $('#setupBody'), tabs = $$('#setupTabs .chip');
  const show = k => { tabs.forEach(b => b.classList.toggle('on', b.dataset.s === k)); body.textContent = ''; T[k].forEach(([h, p], i) => { const s = document.createElement('div'); s.className = 'step'; const n = document.createElement('b'); n.className = 'n'; n.textContent = i + 1; const d = document.createElement('div'); const t = document.createElement('b'); t.textContent = h; const q = document.createElement('p'); q.textContent = p; d.append(t, q); s.append(n, d); body.appendChild(s); }); const nt = document.createElement('p'); nt.className = 'note'; nt.textContent = note[k]; body.appendChild(nt); };
  tabs.forEach(b => b.onclick = () => show(b.dataset.s)); const ua = navigator.userAgent; show(/iPhone|iPad/.test(ua) ? 'iphone' : /Windows/.test(ua) ? 'win' : /Mac/.test(ua) ? 'mac' : 'iphone');
}
(function () {
  const KEY = 'pigment.look', st = { theme: 'auto', tint: '', live: '' };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { }
  const root = document.documentElement, bgc = $('#bgLive'), pop = $('#lookPop'), btn = $('#lookBtn'), mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  const TINTS = [['Plain', '', ''], ['Cream', '#fbf6ec', '#17140f'], ['Mint', '#eef8f2', '#0e1a15'], ['Sky', '#eef4fc', '#0e1522'], ['Lilac', '#f3effb', '#17122a'], ['Blush', '#fcf0f1', '#201215']];
  const LIVES = [['Off', ''], ['Silk', 'silk'], ['Aurora', 'aurora'], ['Liquid', 'liquid'], ['Metaballs', 'metaballs']];
  const dark = () => st.theme === 'dark' || (st.theme === 'auto' && mq && mq.matches), save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } };
  function apply() {
    root.dataset.theme = st.theme; const t = TINTS.find(x => x[0] === st.tint);
    if (t && t[1]) root.style.setProperty('--bg', dark() ? t[2] : t[1]); else root.style.removeProperty('--bg');
    stopAnim('bg'); const ls = LIVES.find(x => x[0] === st.live);
    if (ls && ls[1] && styleOf(ls[1]) && !reduced) { const pn = dark() ? 'Midnight' : 'Cotton', d = ALL.find(a => a.style === ls[1] && a.pal === pn) || ALL.find(a => a.style === ls[1]); bgc.hidden = false; bgc.style.opacity = dark() ? .5 : .32; paintTo(bgc, d, 2); startAnim('bg', bgc, () => d, 14); }
    else bgc.hidden = true;
  }
  function build() {
    pop.textContent = '';
    const sec = (h, fn) => { const d = document.createElement('div'), t = document.createElement('h5'); t.textContent = h; const r = document.createElement('div'); r.className = 'row'; fn(r); d.append(t, r); pop.appendChild(d); };
    sec('Theme', r => { const g = document.createElement('div'); g.className = 'seg sm'; [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].forEach(([v, l]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.className = st.theme === v ? 'on' : ''; b.onclick = () => { st.theme = v; save(); apply(); build(); }; g.appendChild(b); }); r.appendChild(g); });
    sec('Background colour', r => TINTS.forEach(([n, l, dk]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'sw' + (st.tint === n || (!st.tint && !l) ? ' on' : ''); b.title = n; b.setAttribute('aria-label', n + ' background'); b.style.background = l ? (dark() ? dk : l) : 'var(--bg)'; b.onclick = () => { st.tint = l ? n : ''; save(); apply(); build(); }; r.appendChild(b); }));
    sec('Moving background', r => LIVES.forEach(([n]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + ((st.live || 'Off') === n ? ' on' : ''); b.textContent = n; b.onclick = () => { st.live = n === 'Off' ? '' : n; save(); apply(); build(); }; r.appendChild(b); }));
  }
  const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.onclick = e => { e.stopPropagation(); if (pop.hidden) { build(); pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); } else close(); };
  pop.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) close(); });
  if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (st.theme === 'auto') apply(); });
  apply();
})();
