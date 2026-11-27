/* ---------- local profile (name + picture), version check ---------- */
const APP_VERSION = '3.1.1';
(function () {
  const btn = $('#authBtn'), av = $('#authView'), box = $('#authActs');
  let P = LS.get('pg_profile', null);
  const open = on => { av.hidden = !on; if (on) build(); };
  $('#authClose').onclick = () => open(false); av.onclick = e => { if (e.target === av) open(false); };
  const avatarFor = i => { const c = document.createElement('canvas'); c.width = c.height = 128; const p = PALS[i % PALS.length]; render(c.getContext('2d'), 128, 128, { style: ['grain', 'aurora', 'bubbles', 'ripples', 'bloom', 'mosaic', 'dunes', 'waves'][i % 8], colors: p[1], seed: 7 + i * 13, name: 'a' }, 3, { grain: 40, detail: 40, speed: 1 }); return c.toDataURL('image/jpeg', .85); };
  const initial = n => (n || '?').trim().charAt(0).toUpperCase();
  const paint = () => {
    btn.textContent = '';
    if (P && P.name) {
      const im = document.createElement('img'); im.src = P.avatar; im.alt = ''; im.style.cssText = 'width:22px;height:22px;border-radius:50%;object-fit:cover';
      const s = document.createElement('span'); s.textContent = P.name; s.style.cssText = 'max-width:90px;overflow:hidden;text-overflow:ellipsis'; btn.append(im, s);
      $('#footNote').textContent = 'Saved designs stay on this device, under ' + P.name + '.'; $('#p-saved .h2').textContent = P.name + "'s collection";
    } else { btn.textContent = 'Create profile'; $('#footNote').textContent = 'Saved designs stay on this device.'; $('#p-saved .h2').textContent = 'Your collection'; }
    btn.hidden = false;
  };
  function build() {
    box.textContent = ''; $('#authTitle').textContent = P && P.name ? 'Your profile' : 'Create your profile';
    $('#authSub').textContent = 'Pick a name and a picture. Your saved wallpapers are kept with it on this device.';
    let name = P ? P.name : '', avatar = P ? P.avatar : avatarFor(0), chosen = P ? -1 : 0;
    const row = document.createElement('div'); row.className = 'avrow'; const big = document.createElement('img'); big.className = 'avbig'; big.src = avatar; big.alt = 'Your picture'; row.appendChild(big);
    const grid = document.createElement('div'); grid.className = 'avgrid';
    for (let i = 0; i < 8; i++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'avopt'; b.setAttribute('aria-label', 'Picture ' + (i + 1)); const im = document.createElement('img'); im.src = avatarFor(i); im.alt = ''; b.appendChild(im); b.onclick = () => { avatar = im.src; big.src = avatar; $$('.avopt', grid).forEach(x => x.classList.remove('on')); b.classList.add('on'); }; if (i === chosen) b.classList.add('on'); grid.appendChild(b); }
    const up = document.createElement('label'); up.className = 'pill line sm'; up.textContent = 'Upload photo'; up.style.cursor = 'pointer'; const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.hidden = true; up.appendChild(fi);
    fi.onchange = () => { const f = fi.files[0]; if (!f) return; const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 160; const s = Math.min(im.width, im.height); c.getContext('2d').drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 160, 160); avatar = c.toDataURL('image/jpeg', .85); big.src = avatar; $$('.avopt', grid).forEach(x => x.classList.remove('on')); URL.revokeObjectURL(im.src); }; im.src = URL.createObjectURL(f); };
    const ni = document.createElement('input'); ni.className = 'authin'; ni.placeholder = 'Your name'; ni.maxLength = 24; ni.value = name; ni.autocomplete = 'nickname';
    const msg = document.createElement('div'); msg.className = 'authmsg';
    const save = document.createElement('button'); save.className = 'pill accent'; save.textContent = P && P.name ? 'Save profile' : 'Create profile';
    const go = () => { const n = ni.value.trim(); if (!n) { msg.textContent = 'Type a name first.'; ni.focus(); return; } P = { name: n, avatar }; LS.set('pg_profile', P); paint(); open(false); toast('Welcome, ' + n); };
    save.onclick = go; ni.onkeydown = e => { if (e.key === 'Enter') go(); };
    box.append(row, grid, up, ni, save, msg);
    if (P && P.name) {
      const ex = document.createElement('button'); ex.className = 'pill line sm'; ex.textContent = 'Back up saves'; ex.onclick = () => saveBlob(new Blob([JSON.stringify({ app: 'pigment', profile: P, saved: saved() })], { type: 'application/json' }), 'pigment-backup.json');
      const im = document.createElement('label'); im.className = 'pill line sm'; im.textContent = 'Restore backup'; im.style.cursor = 'pointer'; const fi2 = document.createElement('input'); fi2.type = 'file'; fi2.accept = 'application/json,.json'; fi2.hidden = true; im.appendChild(fi2);
      fi2.onchange = async () => { try { const j = JSON.parse(await fi2.files[0].text()); if (j.app !== 'pigment' || !Array.isArray(j.saved)) throw 0; const have = new Set(saved().map(x => x.id)); LS.set('pg_saved', saved().concat(j.saved.filter(x => x && x.id && x.colors && !have.has(x.id)))); if (j.profile && j.profile.name) { P = j.profile; LS.set('pg_profile', P); } paint(); updSaved(); if (location.hash === '#saved') initSaved(); open(false); toast('Backup restored'); } catch (e) { msg.textContent = 'That file is not a Pigment backup.'; } };
      const so = document.createElement('button'); so.className = 'authlink'; so.textContent = 'Remove profile (keeps your saved wallpapers)'; so.onclick = () => { P = null; LS.set('pg_profile', null); paint(); open(false); toast('Profile removed'); };
      const r2 = document.createElement('div'); r2.className = 'authrow'; r2.append(ex, im); box.append(r2, so);
    }
  }
  btn.onclick = () => open(true); paint();
  /* updates: footer button plus an automatic check */
  $('#ver').textContent = ''; const verEl = $('#ver'), vb = document.createElement('button'); vb.className = 'authlink'; vb.textContent = 'v' + APP_VERSION + ' · Check for updates'; verEl.appendChild(vb);
  const fresh = async () => { try { await fetch(location.pathname, { cache: 'reload' }); } catch (e) { } location.reload(); };
  const check = async manual => {
    try {
      const r = await fetch(location.pathname + '?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw 0; const m = /const APP_VERSION = '([0-9.]+)'/.exec(await r.text()); if (!m) throw 0;
      if (m[1] !== APP_VERSION) { $('#newVer').hidden = false; if (manual === true) toast('Version ' + m[1] + ' is ready. Tap Update now.'); }
      else if (manual === true) toast('You are up to date (v' + APP_VERSION + ')');
    } catch (e) { if (manual === true) toast('Could not check. Reload the page to get the latest version.'); }
  };
  vb.onclick = () => { toast('Checking for updates…'); check(true); };
  $('#newVerBtn').onclick = fresh;
  setTimeout(check, 1500); setInterval(check, 120000); window.addEventListener('focus', check); document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
})();
