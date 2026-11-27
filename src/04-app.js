/* ---------- helpers ---------- */
const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let toastT = 0;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
async function getCap(n) { try { return window.claude && window.claude.use ? await window.claude.use(n) : null; } catch (e) { return null; } }
const LITE0 = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4; let LITE = LS.get('pg_lite', null); if (LITE === null) LITE = LITE0;
const DIM = { phone: [390, 844], desk: [960, 600] };
function paintTo(cv, d, t, o) { render(cv.getContext('2d'), cv.width, cv.height, d, t, o); return cv; }
const SIZES = { iphone: ['iPhone', 1179, 2556, 'phone'], android: ['Android', 1080, 2400, 'phone'], ipad: ['iPad', 2048, 2732, 'phone'], mac: ['MacBook / 4K', 3840, 2160, 'desk'], ultra: ['Ultrawide', 3440, 1440, 'desk'] };
const defSize = dev => dev === 'phone' ? 'iphone' : 'mac';
function fillSizes(sel, dev, cur) { sel.textContent = ''; Object.entries(SIZES).filter(([k, v]) => v[3] === dev).forEach(([k, v]) => { const o = document.createElement('option'); o.value = k; o.textContent = v[0] + ' · ' + v[1] + '×' + v[2]; sel.appendChild(o); }); sel.value = SIZES[cur] && SIZES[cur][3] === dev ? cur : defSize(dev); }
async function renderBlob(d, sz) { const S = SIZES[sz], c = makeCanvas(S[1], S[2]); render(c.getContext('2d'), S[1], S[2], d, 2.4, { menubar: S[3] === 'desk' }); return await new Promise(r => c.toBlob(r, 'image/png')); }
async function download(d, dev, sz) {
  sz = SIZES[sz] ? sz : defSize(dev); toast('Rendering full resolution…'); await new Promise(r => setTimeout(r, 40));
  const blob = await renderBlob(d, sz); if (!blob) { toast('Could not render that wallpaper.'); return; }
  await saveBlob(blob, slug(d.name || 'pigment') + '-' + sz + '.png');
}
/* a light and a dark version of the same design, for iOS and macOS appearance modes */
async function downloadPair(d, dev, sz) {
  sz = SIZES[sz] ? sz : defSize(dev); toast('Rendering light and dark…'); await new Promise(r => setTimeout(r, 40));
  const isDark = lum(d.colors[0]) < .45, mk = dark => Object.assign({}, d, { colors: [dark ? (isDark ? d.colors[0] : mix(d.colors[0], '#0a0b12', .9)) : (isDark ? mix(d.colors[0], '#f6f4ee', .92) : d.colors[0])].concat(d.colors.slice(1)) });
  for (const k of ['light', 'dark']) { const b = await renderBlob(mk(k === 'dark'), sz); if (!b) { toast('Could not render that wallpaper.'); return; } await saveBlob(b, slug(d.name || 'pigment') + '-' + sz + '-' + k + '.png', true); }
}
/* share a design as a link: #d-style-c0-c1-c2-c3-c4-seed-detail-grain-speed-calm */
function crc32(b) { let c, crc = -1; if (!crc32.T) { crc32.T = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; crc32.T[n] = c; } } for (let i = 0; i < b.length; i++) crc = crc32.T[(crc ^ b[i]) & 255] ^ (crc >>> 8); return (crc ^ -1) >>> 0; }
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], cd = []; let off = 0; const u16 = n => [n & 255, n >> 8 & 255], u32 = n => [n & 255, n >> 8 & 255, n >> 16 & 255, n >>> 24 & 255];
  files.forEach(([name, data]) => { const nm = enc.encode(name), crc = crc32(data), h = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 0, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), 0, 0]); parts.push(h, nm, data);
    cd.push(new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(off)]), nm); off += h.length + nm.length + data.length; });
  const cdLen = cd.reduce((a, x) => a + x.length, 0); parts.push(...cd, new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(files.length), ...u16(files.length), ...u32(cdLen), ...u32(off), 0, 0])); return new Blob(parts, { type: 'application/zip' });
}
/* one design, five matching wallpapers: lock screen, home screen, MacBook, iPad, ultrawide */
async function downloadPack(d) {
  toast('Rendering your pack…'); await new Promise(r => setTimeout(r, 40)); const base = slug(d.name || 'pigment'), F = [];
  const jobs = [['iphone-lock', 'iphone', { calm: true, widgets: false }], ['iphone-home', 'iphone', { calm: false, widgets: true }], ['macbook', 'mac', {}], ['ipad', 'ipad', {}], ['ultrawide', 'ultra', {}]];
  for (const [nm, sz, ov] of jobs) { const v = Object.assign({}, d, { o: Object.assign({}, d.o, ov) }), bl = await renderBlob(v, sz); if (!bl) { toast('Could not render the pack.'); return; } F.push([base + '-' + nm + '.png', new Uint8Array(await bl.arrayBuffer())]); await new Promise(r => setTimeout(r, 0)); }
  await saveBlob(zipStore(F), base + '-pack.zip', true);
}
function designCode(d) { const o = Object.assign({ detail: 50, grain: 45 }, d.o || {}); return 'd-' + d.style + '-' + d.colors.map(c => c.replace('#', '')).join('-') + '-' + d.seed + '-' + Math.round(o.detail) + '-' + Math.round(o.grain) + '-' + Math.round((o.speed || 1) * 10) + '-' + (o.calm ? 1 : 0) + '-' + (o.widgets ? 1 : 0); }
function decodeDesign(code) {
  const p = code.split('-'); if (p.length < 12 || p[0] !== 'd' || !styleOf(p[1])) return null; const cols = p.slice(2, 7).map(c => '#' + c); if (!cols.every(c => /^#[0-9a-fA-F]{6}$/.test(c))) return null;
  const n = i => +p[i], pal = PALS.find(x => x[1].join().toLowerCase() === cols.join().toLowerCase());
  return { id: 'shared', style: p[1], colors: cols, seed: n(7) || 1, o: { detail: clamp(n(8), 0, 100), grain: clamp(n(9), 0, 100), speed: clamp(n(10) / 10, .25, 2), calm: n(11) === 1, widgets: n(12) === 1 }, name: (pal ? pal[0] : 'Shared') + ' ' + styleOf(p[1])[1] };
}
function copyText(txt) { return (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => true, () => false); }
/* colours from a photo */
function paletteFromImage(img) {
  const s = 56, c = makeCanvas(s, s), x = c.getContext('2d'); x.drawImage(img, 0, 0, s, s); const px = x.getImageData(0, 0, s, s).data, B = {};
  for (let i = 0; i < px.length; i += 4) { const k = (px[i] >> 4) << 8 | (px[i + 1] >> 4) << 4 | (px[i + 2] >> 4), b = B[k] || (B[k] = [0, 0, 0, 0]); b[0] += px[i]; b[1] += px[i + 1]; b[2] += px[i + 2]; b[3]++; }
  const L = Object.values(B).map(b => [b[0] / b[3], b[1] / b[3], b[2] / b[3], b[3]]).sort((a, b) => b[3] - a[3]), P = [], dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  for (const th of [70, 45, 25, 0]) { for (const q of L) { if (P.length >= 5) break; if (P.every(p => dist(p, q) > th) && !P.includes(q)) P.push(q); } if (P.length >= 5) break; }
  while (P.length < 5) P.push(P[P.length % Math.max(1, P.length)] || [128, 128, 128, 1]);
  const lm = q => (.2126 * q[0] + .7152 * q[1] + .0722 * q[2]) / 255, sat = q => Math.max(q[0], q[1], q[2]) - Math.min(q[0], q[1], q[2]), avg = P.reduce((a, q) => a + lm(q), 0) / 5;
  P.sort((a, b) => avg > .5 ? lm(b) - lm(a) : lm(a) - lm(b)); const bg = P.shift(); P.sort((a, b) => sat(b) - sat(a));
  return [bg].concat(P).map(q => r2h(q[0], q[1], q[2]));
}
const TOUCH = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || /iPhone|iPad|iPod/.test(navigator.userAgent);
/* On iPhone the share sheet is the way to Photos or Files. Returns true when handled. */
async function shareFile(blob, name) {
  try { const f = new File([blob], name, { type: blob.type }); if (TOUCH && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'Pigment wallpaper' }); return true; } }
  catch (e) { if (e && e.name === 'AbortError') return true; }
  return false;
}
function readySheet(blob, name, label) {
  const old = $('#ready'); if (old) old.remove();
  const s = document.createElement('div'); s.id = 'ready'; s.className = 'ready'; const p = document.createElement('p'); p.textContent = label;
  const go = document.createElement('button'); go.className = 'pill accent'; go.textContent = 'Save to Photos or Files'; go.onclick = async () => { if (!(await shareFile(blob, name))) await saveBlob(blob, name, true); s.remove(); };
  const no = document.createElement('button'); no.className = 'pill line sm'; no.textContent = 'Not now'; no.onclick = () => s.remove(); s.append(p, go, no); document.body.appendChild(s);
}
async function saveBlob(blob, name, noShare) {
  const dl = await getCap('downloads');
  if (dl) { try { await dl.save({ filename: name, data: blob }); toast('Saved ' + name); } catch (e) { if (!e || e.code !== 'declined') toast('Could not save the file.'); } return; }
  if (!noShare && await shareFile(blob, name)) return;
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Saved ' + name);
}
/* ---------- live wallpaper exports ---------- */
const LOOP = 16;
function liveHTML(d) {
  const helpers = { clamp, h2r, r2h, rgba, mix, lum, ramp, rng, hash, vnoise, makeCanvas, grainTile, menuBand }, fnn = styleOf(d.style)[2];
  const src = Object.entries(helpers).map(([n, f]) => { const t = f.toString(); return t.startsWith('function') ? t : 'const ' + n + ' = ' + t + ';'; }).join('\n') + '\n' + fnn.toString();
  const D = { style: d.style, colors: d.colors, seed: d.seed, recipe: d.recipe, o: Object.assign({ detail: 50, grain: 45 }, d.o || {}, d.style === 'daysky' ? { realtime: true } : {}) };
  return '<!doctype html><html><head><meta charset="utf-8"><title>' + d.name.replace(/[<>&]/g, '') + ' (Pigment live wallpaper)</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;overflow:hidden;background:' + d.colors[0] + '}canvas{display:block;width:100vw;height:100vh;object-fit:cover}</style></head><body><canvas id="c"></canvas><script>\nlet GRAIN = null;\n' + src +
    '\nconst D = ' + JSON.stringify(D).replace(/</g, '\\u003c') + ', cv = document.getElementById("c"), ctx = cv.getContext("2d"), t0 = performance.now(); let last = 0;\ncv.width = 3840; cv.height = 2160;\nconst MENUBAR = true; // set to false to remove the calm strip behind the Mac menu bar\nlet nf = 0, acc = 0; // if drawing is slow, drop to 1440p so it stays smooth\nfunction frame(now) { requestAnimationFrame(frame); if (now - last < 33) return; last = now; const ts = performance.now(); ctx.save(); ' + fnn.name + '(ctx, cv.width, cv.height, D, (now - t0) / 1000 * (D.o.speed || 1), D.o); ctx.restore(); if (nf < 20) { acc += performance.now() - ts; if (++nf === 20 && acc / 20 > 40) { cv.width = 2560; cv.height = 1440; } } if (MENUBAR) { ctx.save(); menuBand(ctx, cv.width, cv.height, D.colors[0]); ctx.restore(); } }\nrequestAnimationFrame(frame);\n<\/script></body></html>';
}
let recording = false;
/* tiny MP4 writer so the loop is frame-exact and always the right length */
function mp4Mux(S, desc, W, H, fps) {
  const cat = a => { let n = 0; a.forEach(x => n += x.length); const o = new Uint8Array(n); let p = 0; a.forEach(x => { o.set(x, p); p += x.length; }); return o; };
  const u32 = n => [n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, n & 255], u16 = n => [n >> 8 & 255, n & 255], st = s => Array.from(s).map(c => c.charCodeAt(0));
  const bx = (t, ...p) => { const b = cat(p.map(x => x instanceof Uint8Array ? x : new Uint8Array(x))); return cat([new Uint8Array(u32(b.length + 8)), new Uint8Array(st(t)), b]); };
  const N = S.length, ms = Math.round(N / fps * 1000), mat = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x40, 0, 0, 0].length;
  const matrix = [].concat(u32(0x10000), u32(0), u32(0), u32(0), u32(0x10000), u32(0), u32(0), u32(0), u32(0x40000000));
  const ftyp = bx('ftyp', st('isom'), u32(512), st('isomiso2avc1mp41')), mdatLen = S.reduce((a, s) => a + s.data.length, 0), off = ftyp.length + 8;
  const mdat = cat([new Uint8Array(u32(mdatLen + 8)), new Uint8Array(st('mdat'))].concat(S.map(s => s.data)));
  const mvhd = bx('mvhd', u32(0), u32(0), u32(0), u32(1000), u32(ms), u32(0x10000), u16(0x100), u16(0), u32(0), u32(0), matrix, new Array(24).fill(0), u32(2));
  const tkhd = bx('tkhd', u32(3), u32(0), u32(0), u32(1), u32(0), u32(ms), u32(0), u32(0), u16(0), u16(0), u16(0), u16(0), matrix, u32(W << 16), u32(H << 16));
  const mdhd = bx('mdhd', u32(0), u32(0), u32(0), u32(fps), u32(N), u16(0x55c4), u16(0));
  const hdlr = bx('hdlr', u32(0), u32(0), st('vide'), new Array(12).fill(0), [86, 0]);
  const vmhd = bx('vmhd', u32(1), u16(0), u16(0), u16(0), u16(0)), dinf = bx('dinf', bx('dref', u32(0), u32(1), bx('url ', u32(1))));
  const avc1 = bx('avc1', new Array(6).fill(0), u16(1), u16(0), u16(0), new Array(12).fill(0), u16(W), u16(H), u32(0x480000), u32(0x480000), u32(0), u16(1), new Array(32).fill(0), u16(0x18), u16(0xffff), bx('avcC', new Uint8Array(desc)));
  const stss = S.map((s, i) => s.key ? i + 1 : 0).filter(x => x);
  const stbl = bx('stbl', bx('stsd', u32(0), u32(1), avc1), bx('stts', u32(0), u32(1), u32(N), u32(1)), bx('stss', u32(0), u32(stss.length), [].concat(...stss.map(u32))), bx('stsc', u32(0), u32(1), u32(1), u32(N), u32(1)), bx('stsz', u32(0), u32(0), u32(N), [].concat(...S.map(s => u32(s.data.length)))), bx('stco', u32(0), u32(1), u32(off)));
  const moov = bx('moov', mvhd, bx('trak', tkhd, bx('mdia', mdhd, hdlr, bx('minf', vmhd, dinf, stbl))));
  return new Blob([ftyp, mdat, moov], { type: 'video/mp4' });
}
async function recordLoop(d, dev) {
  if (recording) return; const [W, H] = dev === 'phone' ? [1080, 2340] : [3840, 2160], mo = { menubar: dev !== 'phone' }, FPS = 30, LEN = LOOP / clamp((d.o && d.o.speed) || 1, .25, 2), N = Math.round(LEN * FPS);
  let cfg = null; if (window.VideoEncoder && window.VideoFrame) { for (const codec of ['avc1.640033', 'avc1.4d0033']) { try { const c = { codec, width: W, height: H, bitrate: dev === 'phone' ? 12e6 : 24e6, framerate: FPS, avc: { format: 'avc' } }; if ((await VideoEncoder.isConfigSupported(c)).supported) { cfg = c; break; } } catch (e) {} } }
  if (!cfg) return recordLoopLegacy(d, dev);
  recording = true; const c = makeCanvas(W, H), ctx = c.getContext('2d'), S = []; let desc = null, fail = null;
  try {
    const enc = new VideoEncoder({ output: (ch, meta) => { const b = new Uint8Array(ch.byteLength); ch.copyTo(b); S.push({ data: b, key: ch.type === 'key' }); if (meta && meta.decoderConfig && meta.decoderConfig.description) desc = meta.decoderConfig.description; }, error: e => { fail = e; } }); enc.configure(cfg);
    for (let i = 0; i < N; i++) {
      if (fail) throw fail; render(ctx, W, H, d, i / FPS, mo); const fr = new VideoFrame(c, { timestamp: Math.round(i * 1e6 / FPS), duration: Math.round(1e6 / FPS) }); enc.encode(fr, { keyFrame: i % 30 === 0 }); fr.close();
      while (enc.encodeQueueSize > 6) await new Promise(r => setTimeout(r, 4)); if (i % 12 === 0) { toast('Rendering your ' + Math.round(LEN) + '-second loop… ' + Math.round(i / N * 100) + '%'); await new Promise(r => setTimeout(r, 0)); }
    }
    await enc.flush(); enc.close(); if (!desc || !S.length) throw 0;
  } catch (e) { recording = false; toast('That encoder failed, trying the other way…'); return recordLoopLegacy(d, dev); }
  recording = false; const vb = mp4Mux(S, desc, W, H, FPS), vn = slug(d.name) + '-loop-' + (dev === 'phone' ? 'iphone' : 'macbook') + '.mp4';
  if (TOUCH) readySheet(vb, vn, 'Your loop video is ready.'); else await saveBlob(vb, vn);
}
async function recordLoopLegacy(d, dev) {
  if (recording) return; const [W, H] = dev === 'phone' ? [1080, 2340] : [3840, 2160], mo = { menubar: dev !== 'phone' };
  const mt = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t));
  if (!mt) { toast('This browser cannot record video. Use the live file instead.'); return; }
  const LEN = LOOP / clamp((d.o && d.o.speed) || 1, .25, 2); recording = true; const c = makeCanvas(W, H), ctx = c.getContext('2d'), rec = new MediaRecorder(c.captureStream(30), { mimeType: mt, videoBitsPerSecond: dev === 'phone' ? 14e6 : 40e6 }), chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); }; const done = new Promise(r => { rec.onstop = r; });
  toast('Recording a ' + Math.round(LEN) + '-second loop. Keep this tab open.'); render(ctx, W, H, d, 0, mo); rec.start(); const t0 = performance.now();
  await new Promise(res => { (function loop(now) { const el = (now - t0) / 1000; if (el >= LEN) { res(); return; } render(ctx, W, H, d, el, mo); requestAnimationFrame(loop); })(performance.now()); });
  rec.stop(); await done; recording = false;
  const vb = new Blob(chunks, { type: mt.split(';')[0] }), vn = slug(d.name) + '-loop-' + (dev === 'phone' ? 'iphone' : 'macbook') + (mt.startsWith('video/mp4') ? '.mp4' : '.webm');
  if (TOUCH) readySheet(vb, vn, 'Your loop video is ready.'); else await saveBlob(vb, vn);
}
function liveBox(getD, getDev) {
  const d = getD(); if (!styleOf(d.style)[3]) return null;
  const box = document.createElement('div'); box.className = 'livebox';
  const b = document.createElement('b'); b.textContent = 'Use it as a live wallpaper';
  const p = document.createElement('p'); p.textContent = TOUCH ? 'An iPhone will not let a web page set a moving wallpaper. Save the loop video to Photos, then try a Live Photo converter app. Whether it can be used as a wallpaper depends on your iOS version.' : 'Desktop live wallpapers are 3840 × 2160, with a calm strip along the top so the Mac menu bar stays clean. A browser page cannot change your desktop itself: open the live file in Plash (free) on Mac, or Lively Wallpaper or Wallpaper Engine on Windows. macOS has no built-in way to play your own moving wallpaper.';
  const a = document.createElement('div'); a.className = 'acts';
  const f = document.createElement('button'); f.className = 'pill sm'; f.textContent = 'Live file (.html)'; f.onclick = () => saveBlob(new Blob([liveHTML(getD())], { type: 'text/html' }), slug(getD().name) + '-live.html');
  if (!TOUCH) a.appendChild(f);
  if (styleOf(d.style)[3]) { const v = document.createElement('button'); v.className = 'pill line sm'; v.textContent = TOUCH ? 'Save loop video' : 'Seamless loop video'; v.onclick = () => recordLoop(getD(), getDev()); a.appendChild(v); }
  box.append(b, p, a); return box;
}
function setAccent(d) { const c = d.colors.slice(1).sort((a, b) => Math.abs(lum(a) - .5) - Math.abs(lum(b) - .5))[0]; document.documentElement.style.setProperty('--accent', c); }

/* one animation loop for whatever is on screen */
const ANIM = new Map(); let raf = 0, last = 0;
/* music: a built-in 120 BPM beat that plays in time with the picture, or react to the microphone */
const MUSIC = ['eq', 'pulse', 'vinyl', 'wavebeat']; let MU = null, MIC = null;
function stopMusic() { if (MU) { clearInterval(MU.timer); try { MU.ac.close(); } catch (e) {} MU = null; } }
function stopMic() { if (MIC) { try { MIC.st.getTracks().forEach(t => t.stop()); MIC.ac.close(); } catch (e) {} MIC = null; window.__aud = null; } }
function startMusic(getD) {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { toast('This browser cannot play sound.'); return false; } stopMusic();
  const ac = new AC(), out = ac.createGain(); out.gain.value = .5; out.connect(ac.destination), CH = [57, 53, 48, 55], f = n => 440 * Math.pow(2, (n - 69) / 12);
  const kick = at => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(150, at); o.frequency.exponentialRampToValueAtTime(42, at + .12); g.gain.setValueAtTime(.95, at); g.gain.exponentialRampToValueAtTime(.001, at + .3); o.connect(g); g.connect(out); o.start(at); o.stop(at + .32); };
  const hat = at => { const b = ac.createBuffer(1, ac.sampleRate * .05, ac.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / x.length); const s = ac.createBufferSource(), hp = ac.createBiquadFilter(), g = ac.createGain(); hp.type = 'highpass'; hp.frequency.value = 7000; g.gain.value = .22; s.buffer = b; s.connect(hp); hp.connect(g); g.connect(out); s.start(at); };
  const tone = (n, at, dur, type, vol, cut) => { const o = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter(); o.type = type; o.frequency.value = f(n); lp.type = 'lowpass'; lp.frequency.value = cut; g.gain.setValueAtTime(.0001, at); g.gain.linearRampToValueAtTime(vol, at + .05); g.gain.exponentialRampToValueAtTime(.0001, at + dur); o.connect(lp); lp.connect(g); g.connect(out); o.start(at); o.stop(at + dur + .05); };
  const a0 = ANIM.get('view'); if (!a0) return false; let nb = null;
  const tick2 = () => { const a = ANIM.get('view'); if (!a) { stopMusic(); return; } const sp = (getD().o.speed || 1), tv = ((performance.now() - a.t0) / 1000 + 2) * sp; if (nb === null) nb = Math.ceil(tv * 2) / 2;
    while (nb < tv + .35 * sp) { const at = ac.currentTime + Math.max(0, (nb - tv) / sp), k = Math.round(nb * 2), beat = .5 / sp; kick(at); if (k % 2) hat(at); else hat(at + beat * .5);
      if (k % 4 === 0) { const ch = CH[(k / 4) % 4]; tone(ch - 12, at, beat * 3.6, 'sawtooth', .22, 380); [0, 3, 7].forEach(i => tone(ch + i, at, beat * 4, 'triangle', .07, 1800)); } nb += .5; } };
  MU = { ac, timer: setInterval(tick2, 25) }; tick2(); ac.resume && ac.resume(); return true;
}
async function startMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast('Microphone is not available here. Open the app from your own site or file.'); return false; }
  try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }), AC = window.AudioContext || window.webkitAudioContext, ac = new AC(), an = ac.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .72; ac.createMediaStreamSource(st).connect(an); MIC = { ac, st, an, bins: new Uint8Array(an.frequencyBinCount) }; window.__aud = new Array(48).fill(0); return true; }
  catch (e) { toast('Microphone access was blocked.'); return false; }
}
function startAnim(key, cv, getD, fps, o) { ANIM.set(key, { cv, getD, o, fps: fps || 30, t0: performance.now(), next: 0 }); if (!raf && !reduced) raf = requestAnimationFrame(tick); }
function stopAnim(key) { ANIM.delete(key); }
function tick(now) {
  raf = 0; if (!ANIM.size) return;
  if (MIC) { MIC.an.getByteFrequencyData(MIC.bins); const A = window.__aud, nb = MIC.bins.length * .6; for (let i = 0; i < 48; i++) A[i] = Math.min(1, MIC.bins[Math.floor(i / 48 * nb)] / 200); }
  ANIM.forEach(a => { if (now < a.next || !document.body.contains(a.cv)) return; a.next = now + 1000 / (LITE ? Math.min(a.fps, 12) : a.fps); const d = a.getD(); if (styleOf(d.style)[3]) paintTo(a.cv, d, (now - a.t0) / 1000 + 2, a.o); });
  raf = requestAnimationFrame(tick);
}

/* ---------- cards ---------- */
const queue = []; let qBusy = false;
function enqueue(fn) { queue.push(fn); if (!qBusy) { qBusy = true; requestAnimationFrame(pump); } }
function pump() { const t0 = performance.now(); while (queue.length && performance.now() - t0 < 14) queue.shift()(); if (queue.length) requestAnimationFrame(pump); else qBusy = false; }
function card(d, dev, onOpen, i) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'card'; b.style.animationDelay = Math.min(i || 0, 14) * 35 + 'ms';
  const [W, H] = dev === 'phone' ? [300, 650] : [480, 300], cv = makeCanvas(W, H, 'cv'); b.appendChild(cv); const mo = dev === 'desk' ? { menubar: true } : null; enqueue(() => paintTo(cv, d, 2, mo));
  const m = document.createElement('div'); m.className = 'm'; const l = document.createElement('div'), n = document.createElement('b'), s = document.createElement('small');
  n.textContent = d.name; s.textContent = styleOf(d.style)[3] ? 'Live · ' + styleOf(d.style)[1] : styleOf(d.style)[1]; l.append(n, s); const sw = document.createElement('div'); sw.className = 'sw5';
  d.colors.forEach(c => { const x = document.createElement('i'); x.style.background = c; sw.appendChild(x); }); m.append(l, sw); b.appendChild(m);
  if (d.id !== 'mood') { const q = document.createElement('span'); q.className = 'cdl'; q.setAttribute('role', 'button'); q.setAttribute('aria-label', 'Download ' + d.name); q.title = TOUCH ? 'Save image' : 'Download'; q.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/></svg>'; q.onclick = ev => { ev.stopPropagation(); ev.preventDefault(); download(d, dev); }; b.appendChild(q); }
  const key = 'card' + Math.random();
  if (styleOf(d.style)[3] && !reduced) { b.addEventListener('mouseenter', () => startAnim(key, cv, () => d, 24, mo)); b.addEventListener('mouseleave', () => { stopAnim(key); paintTo(cv, d, 2, mo); }); }
  b.addEventListener('click', () => onOpen(d)); return b;
}

/* ---------- viewer ---------- */
let vDev = 'phone', vD = null, vSize = null;
function openView(d) { vD = Object.assign({}, d, { o: Object.assign({}, d.o || {}) }); setAccent(d); drawView(); $('#view').hidden = false; document.body.style.overflow = 'hidden'; }
function closeView() { stopMusic(); stopMic(); stopAnim('view'); $('#view').hidden = true; document.body.style.overflow = ''; if (/^#d-/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} } }
function drawView() {
  const d = vD, [W, H] = vDev === 'phone' ? [390, 844] : [960, 600], st = $('#vStage'); stopAnim('view'); stopMusic();
  st.innerHTML = '<div class="' + (vDev === 'phone' ? 'frame-p' : 'frame-d') + '"><canvas width="' + W + '" height="' + H + '"></canvas></div>';
  const cv = $('canvas', st), mo = vDev === 'desk' ? { menubar: true } : null; paintTo(cv, d, 2, mo); startAnim('view', cv, () => vD, 30, mo);
  const info = $('#vInfo'); info.textContent = '';
  const k = document.createElement('div'); k.className = 'kick'; k.textContent = styleOf(d.style)[1]; const h3 = document.createElement('h3'); h3.textContent = d.name;
  const p = document.createElement('p'); p.style.cssText = 'margin:0;color:var(--mute)'; p.textContent = styleOf(d.style)[4] + (styleOf(d.style)[3] ? '. Moves in the preview.' : '.');
  const sw = document.createElement('div'); sw.className = 'swatches'; d.colors.forEach(c => { const i = document.createElement('i'); i.style.background = c; sw.appendChild(i); });
  const hx = document.createElement('div'); hx.className = 'hex'; d.colors.forEach(c => { const s = document.createElement('span'); s.textContent = c.toUpperCase(); hx.appendChild(s); });
  const seg = document.createElement('div'); seg.className = 'seg'; seg.style.alignSelf = 'flex-start';
  [['phone', 'Phone'], ['desk', 'Computer']].forEach(([v, l]) => { const b = document.createElement('button'); b.textContent = l; b.className = vDev === v ? 'on' : ''; b.onclick = () => { vDev = v; vSize = null; drawView(); }; seg.appendChild(b); });
  let spd = null;
  if (styleOf(d.style)[3]) { spd = document.createElement('div'); spd.className = 'seg'; spd.style.alignSelf = 'flex-start'; const cur = d.o.speed || 1;
    [['Time-lapse', .25], ['Slow', .5], ['Normal', 1], ['Fast', 1.6]].forEach(([l, v]) => { const b = document.createElement('button'); b.textContent = l; b.className = Math.abs(cur - v) < .01 ? 'on' : ''; b.onclick = () => { vD.o.speed = v; drawView(); }; spd.appendChild(b); }); }
  const acts = document.createElement('div'); acts.className = 'acts';
  const dl = document.createElement('button'); dl.className = 'pill accent'; dl.textContent = TOUCH ? 'Save image' : 'Download'; dl.onclick = () => download(d, vDev);
  const pv = document.createElement('button'); pv.className = 'pill line'; pv.textContent = 'Preview'; pv.onclick = () => openPreview(d);
  const rm = document.createElement('button'); rm.className = 'pill line'; rm.textContent = 'Remix'; rm.onclick = () => { closeView(); loadStudio(d); location.hash = '#studio'; };
  const sv = document.createElement('button'); sv.className = 'pill line'; sv.textContent = 'Save'; sv.onclick = () => saveDesign(d);
  const x = document.createElement('button'); x.className = 'pill line sm'; x.textContent = 'Close'; x.onclick = closeView; x.style.marginTop = 'auto'; x.style.alignSelf = 'flex-start';
  acts.append(dl, pv, rm, sv);
  const szs = document.createElement('select'); szs.className = 'pill line sm'; szs.setAttribute('aria-label', 'Download size'); fillSizes(szs, vDev, vSize); szs.onchange = () => { vSize = szs.value; }; dl.onclick = () => download(d, vDev, szs.value);
  const ex = document.createElement('div'); ex.className = 'acts';
  const pr = document.createElement('button'); pr.className = 'pill line sm'; pr.textContent = 'Light + dark pair'; pr.onclick = () => downloadPair(d, vDev, szs.value);
  const lk = document.createElement('button'); lk.className = 'pill line sm'; lk.textContent = 'Copy link'; lk.onclick = async () => { const u = location.href.split('#')[0] + '#' + designCode(d); toast(await copyText(u) ? 'Link copied. Anyone who opens it sees this exact wallpaper.' : 'Could not copy. Link: ' + u); };
  const ml = document.createElement('button'); ml.className = 'pill line sm'; ml.textContent = 'More like this'; const vg = document.createElement('div'); vg.className = 'vargrid'; vg.hidden = true;
  ml.onclick = () => { vg.hidden = false; vg.textContent = ''; for (let i = 0; i < 6; i++) { const pl = PALS[Math.floor(Math.random() * PALS.length)], same = i < 3, v = Object.assign({}, d, { seed: Math.floor(Math.random() * 9000) + 1, o: Object.assign({}, d.o), colors: same ? d.colors : pl[1].slice() }); v.name = (same ? d.name : pl[0] + ' ' + styleOf(d.style)[1]); const cv = makeCanvas(vDev === 'phone' ? 150 : 240, vDev === 'phone' ? 325 : 150); paintTo(cv, v, 2, vDev === 'desk' ? { menubar: true } : null); cv.onclick = () => { vD = v; drawView(); }; vg.appendChild(cv); } };
  ex.append(szs, pr, lk, ml);
  if (vDev === 'phone') { const cm = document.createElement('button'); cm.className = 'pill line sm'; cm.textContent = d.o.calm ? 'Calm clock area ✓' : 'Calm clock area'; cm.onclick = () => { vD.o.calm = !vD.o.calm; drawView(); }; ex.appendChild(cm); const wm = document.createElement('button'); wm.className = 'pill line sm'; wm.textContent = d.o.widgets ? 'Widget area ✓' : 'Widget area'; wm.onclick = () => { vD.o.widgets = !vD.o.widgets; drawView(); }; ex.appendChild(wm); }
  if (MUSIC.includes(d.style)) { const pb = document.createElement('button'); pb.className = 'pill accent sm'; pb.textContent = 'Play beat'; pb.onclick = () => { if (MU) { stopMusic(); pb.textContent = 'Play beat'; } else if (startMusic(() => vD)) pb.textContent = 'Stop beat'; }; const mb = document.createElement('button'); mb.className = 'pill line sm'; mb.textContent = MIC ? 'Stop mic' : 'React to my music'; mb.onclick = async () => { if (MIC) { stopMic(); mb.textContent = 'React to my music'; } else if (await startMic()) { mb.textContent = 'Stop mic'; toast('Play some music near your computer and watch it move.'); } }; ex.append(pb, mb); }
  const pk = document.createElement('button'); pk.className = 'pill line sm'; pk.textContent = 'Download pack'; pk.onclick = () => downloadPack(d); ex.appendChild(pk); const hint = document.createElement('p'); hint.style.cssText = 'margin:0;color:var(--mute);font-size:13px'; hint.textContent = TOUCH ? 'Tap Save image, then choose Save Image to put it in Photos, or Save to Files.' : ''; const lb = liveBox(() => vD, () => vDev); info.append(k, h3, p, sw, hx, seg); if (spd) { const sl = document.createElement('div'); sl.className = 'kick'; sl.textContent = 'Speed'; info.append(sl, spd); } info.append(acts, ex, vg); if (TOUCH) info.appendChild(hint); if (lb) info.appendChild(lb); info.appendChild(x);
}
$('#view').addEventListener('click', e => { if (e.target.id === 'view') closeView(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#prev').hidden) closePreview(); else if (!$('#view').hidden) closeView(); } });

/* ---------- phone preview: lock screen and home screen ---------- */
let pD = null, pHome = false;
function openPreview(d) {
  pD = d; pHome = false; const cv = $('#prevCv'); cv.width = 585; cv.height = 1266; paintTo(cv, d, 2);
  const dark = lum(d.colors[0]) > .62; $('#prevFr').style.setProperty('--pf', dark ? '#1a1a22' : '#ffffff'); $('#prevFr').style.setProperty('--pb', dark ? 'rgba(20,20,30,.14)' : 'rgba(255,255,255,.26)');
  buildPreview(); $('#prev').hidden = false; document.body.style.overflow = 'hidden'; startAnim('prev', cv, () => pD, 30);
}
function buildPreview() {
  const now = new Date(), lock = $('#plock'), home = $('#phome');
  lock.textContent = ''; home.textContent = '';
  const mk = (c, t) => { const e = document.createElement('div'); e.className = c; if (t) e.textContent = t; return e; };
  lock.append(mk('dt', now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })), mk('tm', now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }).replace(/^(\d):/, '0$1:').replace(/^0(\d)/, '$1')));
  const bt = mk('lbt'); bt.append(mk('lc'), mk('lc')); lock.append(bt, mk('lbar'));
  const gr = mk('grid'); for (let i = 0; i < 20; i++) gr.appendChild(mk('ic')); const dk = mk('dock'); for (let i = 0; i < 4; i++) dk.appendChild(mk('ic')); home.append(gr, dk);
  lock.hidden = pHome; home.hidden = !pHome; $('#prevT').textContent = pHome ? 'Show lock screen' : 'Show home screen';
}
function closePreview() { stopAnim('prev'); $('#prev').hidden = true; document.body.style.overflow = $('#view').hidden ? '' : 'hidden'; }
$('#prevX').onclick = closePreview; $('#prevT').onclick = () => { pHome = !pHome; buildPreview(); };
$('#stPrev').onclick = () => openPreview(stD());

/* ---------- saved ---------- */
const saved = () => LS.get('pg_saved', []).filter(d => d && styleOf(d.style));
function updSaved() { const n = saved().length; $('#savedN').textContent = n ? '(' + n + ')' : ''; }
function saveDesign(d) { const l = saved(); l.unshift({ id: 'u' + Date.now(), style: d.style, name: d.name, colors: d.colors.slice(), seed: d.seed, o: Object.assign({}, d.o || {}) }); LS.set('pg_saved', l); updSaved(); if (window.cloudAdd) cloudAdd(l[0]); toast('Saved to your collection'); }
function playlistHTML(list, mins) {
  const helpers = { clamp, h2r, r2h, rgba, mix, lum, ramp, rng, hash, vnoise, makeCanvas, grainTile, menuBand }, styles = [...new Set(list.map(d => d.style))];
  const src = Object.entries(helpers).map(([n, f]) => { const t = f.toString(); return t.startsWith('function') ? t : 'const ' + n + ' = ' + t + ';'; }).join('\n') + '\n' + styles.map(k => styleOf(k)[2].toString()).join('\n');
  const map = '{' + styles.map(k => k + ':' + styleOf(k)[2].name).join(',') + '}', L = list.map(d => ({ style: d.style, colors: d.colors, seed: d.seed, o: Object.assign({ detail: 50, grain: 45 }, d.o || {}, d.style === 'daysky' ? { realtime: true } : {}) }));
  const run = `const FN = ${map}, L = ${JSON.stringify(L).replace(/</g, '\\u003c')}, MIN = ${mins}, C = [document.getElementById("a"), document.getElementById("b")], X = C.map(c => { c.width = 3840; c.height = 2160; return c.getContext("2d"); }), t0 = performance.now();
let idx = 0, cur = 0, fade = 0, last = 0, nf = 0, acc = 0;
function paint(k, i, now) { const d = L[((i % L.length) + L.length) % L.length], x = X[k], cv = C[k]; x.save(); FN[d.style](x, cv.width, cv.height, d, (now - t0) / 1000 * (d.o.speed || 1), d.o); x.restore(); x.save(); menuBand(x, cv.width, cv.height, d.colors[0]); x.restore(); }
setInterval(() => { if (L.length < 2) return; const n = 1 - cur; idx++; paint(n, idx, performance.now()); C[n].style.opacity = 1; C[cur].style.opacity = 0; fade = performance.now() + 2300; cur = n; }, MIN * 60000);
function frame(now) { requestAnimationFrame(frame); if (now - last < 33) return; last = now; const ts = performance.now(); paint(cur, idx, now); if (now < fade) paint(1 - cur, idx - 1, now); if (nf < 20) { acc += performance.now() - ts; if (++nf === 20 && acc / 20 > 40) C.forEach(c => { c.width = 2560; c.height = 1440; }); } }
requestAnimationFrame(frame);`;
  return '<!doctype html><html><head><meta charset="utf-8"><title>Pigment rotating wallpaper</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;overflow:hidden;background:#000}canvas{position:absolute;left:0;top:0;width:100vw;height:100vh;object-fit:cover;transition:opacity 2s}</style></head><body><canvas id="a"></canvas><canvas id="b" style="opacity:0"></canvas><script>\nlet GRAIN = null;\n' + src + '\n' + run + '\n<\/script></body></html>';
}
function dailyPicks() { const day = Math.floor(Date.now() / 864e5), live = ALL.filter(a => styleOf(a.style)[3]), out = []; for (let i = 0; i < 6; i++) out.push(live[(day * 7919 + i * 104729) % live.length]); return out; }
function initSaved() {
  { const box = $('#plBox'); box.textContent = ''; const sel = document.createElement('select'); sel.className = 'pill line sm'; sel.setAttribute('aria-label', 'Change every'); [[5, 'every 5 minutes'], [15, 'every 15 minutes'], [30, 'every 30 minutes'], [60, 'every hour']].forEach(([v, l]) => { const o = document.createElement('option'); o.value = v; o.textContent = 'Change ' + l; sel.appendChild(o); }); sel.value = 15;
    const b = document.createElement('button'); b.className = 'pill line sm'; b.textContent = 'Rotating live file (.html)'; b.onclick = () => { let l = saved().filter(d => styleOf(d.style)[3]), note = ''; if (l.length < 2) { l = dailyPicks(); note = ' (using today\'s picks, since you have fewer than 2 saved live ones)'; } saveBlob(new Blob([playlistHTML(l, +sel.value)], { type: 'text/html' }), 'pigment-rotation-live.html'); toast('Rotating file with ' + l.length + ' wallpapers' + note); }; if (!TOUCH) box.append(sel, b); }
  const host = $('#savedGal'); host.textContent = ''; const l = saved(); updSaved();
  if (!l.length) { const e = document.createElement('div'); e.className = 'empty'; e.innerHTML = '<p style="margin:0 0 14px">Nothing saved yet. Open a wallpaper and press Save, or make one in the studio.</p>'; const a = document.createElement('a'); a.className = 'pill'; a.href = '#browse'; a.textContent = 'Browse wallpapers'; e.appendChild(a); host.appendChild(e); return; }
  l.forEach((d, i) => { const c = card(d, 'phone', openView, i); const rm = document.createElement('span'); rm.className = 'live'; rm.textContent = 'Remove'; rm.style.cursor = 'pointer'; rm.onclick = ev => { ev.stopPropagation(); LS.set('pg_saved', saved().filter(x => x.id !== d.id)); if (window.cloudDel) cloudDel(d.id); initSaved(); toast('Removed'); }; $('.m', c).appendChild(rm); host.appendChild(c); });
}

/* ---------- browse + home ---------- */
let fStyle = 'all', fVibe = 'all', bDev = 'phone', fAll = false;
function initBrowse() {
  const chips = $('#styleChips'); chips.textContent = '';
  { const vc = $('#vibeChips'); vc.textContent = ''; [['all', 'All vibes']].concat(VIBES.map(v => [v[0], v[0]])).forEach(([k, l]) => { const b = document.createElement('button'); b.className = 'chip' + (fVibe === k ? ' on' : ''); b.textContent = l; b.onclick = () => { fVibe = k; fStyle = 'all'; initBrowse(); }; vc.appendChild(b); }); }
  const vk = fVibe === 'all' ? null : VIBES.find(v => v[0] === fVibe)[1].split(' ');
  [['all', 'All styles']].concat(STYLES.filter(s => !vk || vk.includes(s[0])).map(s => [s[0], s[1]])).forEach(([k, l]) => { const b = document.createElement('button'); b.className = 'chip' + (fStyle === k ? ' on' : ''); b.textContent = l; b.onclick = () => { fStyle = k; initBrowse(); }; chips.appendChild(b); });
  $$('#devSeg button').forEach(b => b.classList.toggle('on', b.dataset.d === bDev));
  const g = $('#gal'); g.className = 'gal' + (bDev === 'desk' ? ' desk' : ''); g.textContent = ''; queue.length = 0;
  const list = ALL.filter(d => (fStyle === 'all' || d.style === fStyle) && (!vk || vk.includes(d.style)) && (fAll || fStyle !== 'all' || d.pal === styleOf(d.style)[5])), PAGE = 48; let shown = 0;
  const more = document.createElement('div'); more.style.cssText = 'display:flex;justify-content:center;margin:26px 0 8px';
  const mb = document.createElement('button'); mb.className = 'pill line'; more.appendChild(mb);
  const next = () => { list.slice(shown, shown + PAGE).forEach((d, i) => g.appendChild(card(d, bDev, openView, i))); shown = Math.min(list.length, shown + PAGE); mb.textContent = 'Show more (' + (list.length - shown) + ' left)'; more.hidden = shown >= list.length; };
  mb.onclick = next;
  $$('.morebox').forEach(e => e.remove()); more.className = 'morebox'; g.after(more); next();
}
$$('#devSeg button').forEach(b => b.onclick = () => { bDev = b.dataset.d; initBrowse(); });
let heroI = 0, heroD = null;
const HERO = ['ridges-dusk', 'dunes-sorbet', 'halftone-lagoon', 'grain-candy', 'ridges-poster', 'dunes-midnight'];
function setHero(i) { { const day = Math.floor(Date.now() / 864e5), live = ALL.filter(a => styleOf(a.style)[3]); heroD = live[(day * 7919) % live.length]; } setAccent(heroD); $('#heroName').textContent = heroD.name; const cv = $('#heroCv'); cv.style.animation = 'none'; void cv.offsetWidth; cv.style.animation = 'fade .6s'; }
function initHome() {
  { const l = saved().slice(-6).reverse(), fv = $('#favs'); fv.textContent = ''; if (l.length) { const cnt = {}; saved().forEach(d => { cnt[d.style] = (cnt[d.style] || 0) + 1; }); const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0], hd = document.createElement('div'); hd.className = 'head'; hd.innerHTML = '<div><div class="kick"></div><h2 class="h2" style="margin-top:8px">Your favourites</h2></div>'; $('.kick', hd).textContent = 'Most saved: ' + styleOf(top)[1]; const g = document.createElement('div'); g.className = 'gal'; l.forEach((d, i) => g.appendChild(card(d, 'phone', openView, i))); fv.append(hd, g); } }
  if (!$('#seasonGal').firstChild) { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '', south = /^(Australia|Pacific\/Auckland|Africa\/Johannesburg|America\/(Sao_Paulo|Santiago|Argentina))/.test(tz), mo = new Date().getMonth(), sm = south ? (mo + 6) % 12 : mo, season = sm >= 2 && sm <= 4 ? 'Spring Blossom' : sm >= 5 && sm <= 7 ? 'Summer Mango' : sm >= 8 && sm <= 10 ? 'Autumn Harvest' : 'Winter Frost', pn = mo === 11 ? 'Holiday' : season, sg = $('#seasonGal'); $('#seasonKick').textContent = 'Right now · ' + pn; ['grain', 'aurora', 'bubbles', 'dunes', 'bloom', 'silk'].forEach((k, i) => { const d = ALL.find(a => a.style === k && a.pal === pn); if (d) sg.appendChild(card(d, 'phone', openView, i)); }); }
  $('#nBrowse').textContent = 'Browse ' + STYLES.length + ' styles'; $('#nStyles').textContent = STYLES.length + ' styles';
  if ($('#mq').firstChild) { startAnim('hero', $('#heroCv'), () => heroD, 30); return; }
  setHero(0); startAnim('hero', $('#heroCv'), () => heroD, 30); paintTo($('#heroCv'), heroD, 2);
  $('#heroOpen').onclick = () => openView(heroD);
  const picks = ['grain-sorbet', 'silk-dusk', 'dunes-lagoon', 'halftone-candy', 'shapes-poster', 'grain-deep-sea', 'dunes-sand', 'silk-lilac', 'halftone-ember', 'shapes-mint', 'grain-moss', 'dunes-dusk'].map(byId), tr = $('#mq');
  for (let r = 0; r < 2; r++) picks.forEach(d => { const cv = makeCanvas(150, 325); enqueue(() => paintTo(cv, d, 2)); cv.onclick = () => openView(d); cv.style.cursor = 'pointer'; tr.appendChild(cv); });
  const sg = $('#styleGal'); STYLES.forEach(([k, l, f, live, desc], i) => { const d = ALL.find(a => a.style === k && a.pal === STYLES[i][5]); const c = card(Object.assign({}, d, { name: l }), 'desk', () => { fStyle = k; location.hash = '#browse'; }, i); $('small', c).textContent = desc; sg.appendChild(c); });
}

/* ---------- studio ---------- */
const ST = { style: 'grain', colors: PALS[0][1].slice(), seed: 21, o: { detail: 50, grain: 45 }, dev: 'phone', pal: 'Sorbet' };
const stD = () => ({ style: ST.style, colors: ST.colors, seed: ST.seed, o: ST.o, name: (ST.pal || 'Custom') + ' ' + styleOf(ST.style)[1] });
function loadStudio(d) { ST.style = d.style; ST.colors = d.colors.slice(); ST.seed = d.seed; ST.o = Object.assign({ detail: 50, grain: 45 }, d.o || {}); ST.seed = d.seed; ST.pal = (PALS.find(p => p[1].join() === d.colors.join()) || [null])[0]; if (ST.built) buildStudio(); }
function buildStudio() {
  ST.built = true;
  const sc = $('#stStyle'); sc.textContent = ''; STYLES.forEach(([k, l]) => { const b = document.createElement('button'); b.className = 'chip' + (ST.style === k ? ' on' : ''); b.textContent = l; b.onclick = () => { ST.style = k; buildStudio(); }; sc.appendChild(b); });
  const pl = $('#stPals'); pl.textContent = ''; PALS.forEach(([n, c]) => { const b = document.createElement('button'); b.className = 'pal' + (ST.pal === n ? ' on' : ''); b.title = n; b.setAttribute('aria-label', n); c.forEach(x => { const i = document.createElement('i'); i.style.background = x; b.appendChild(i); }); b.onclick = () => { ST.colors = c.slice(); ST.pal = n; buildStudio(); }; pl.appendChild(b); });
  const cu = $('#stCust'); cu.textContent = ''; ST.colors.forEach((c, i) => { const inp = document.createElement('input'); inp.type = 'color'; inp.value = c; inp.setAttribute('aria-label', i ? 'Colour ' + i : 'Background'); inp.oninput = () => { ST.colors[i] = inp.value; ST.pal = null; $$('#stPals .pal').forEach(p => p.classList.remove('on')); studioPaint(); }; cu.appendChild(inp); });
  [['Detail', 'detail'], ['Grain', 'grain']].forEach(([l, k]) => { const r = $('#r' + l); r.value = ST.o[k]; $('#v' + l).textContent = ST.o[k]; r.oninput = () => { ST.o[k] = +r.value; $('#v' + l).textContent = r.value; studioPaint(); }; });
  $('#rGrain').closest('.sl').style.display = ST.style === 'grain' ? '' : 'none'; $('#rDetail').closest('.sl').style.display = ST.style === 'photo' ? 'none' : '';
  const rs = $('#rSpeed'), fmt = v => (v / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '') + '×'; rs.value = Math.round((ST.o.speed || 1) * 100); $('#vSpeed').textContent = fmt(rs.value);
  rs.oninput = () => { ST.o.speed = rs.value / 100; $('#vSpeed').textContent = fmt(rs.value); studioPaint(); }; rs.closest('.sl').style.display = styleOf(ST.style)[3] ? '' : 'none';
  $('#stText').value = ST.o.text || ''; $('#stFont').value = ST.o.font || 'sans'; fillSizes($('#stSize'), ST.dev, ST.size); $('#stSize').onchange = () => { ST.size = $('#stSize').value; }; $('#stCalm').hidden = $('#stWid').hidden = ST.dev !== 'phone'; $('#stWid').textContent = ST.o.widgets ? 'Widget area ✓' : 'Widget area'; $('#stCalm').textContent = ST.o.calm ? 'Calm clock area ✓' : 'Calm clock area';
  $$('#stDev button').forEach(b => { b.classList.toggle('on', b.dataset.d === ST.dev); b.onclick = () => { ST.dev = b.dataset.d; buildStudio(); }; });
  const [W, H] = DIM[ST.dev]; const st = $('#stStage'); stopAnim('studio');
  st.innerHTML = '<div class="' + (ST.dev === 'phone' ? 'frame-p' : 'frame-d') + '"><canvas id="stCv" width="' + W + '" height="' + H + '"></canvas></div>';
  startAnim('studio', $('#stCv'), stD, 30, ST.dev === 'desk' ? { menubar: true } : null); studioPaint();
  const sl = $('#stLive'); sl.textContent = ''; const lb = liveBox(stD, () => ST.dev); if (lb) sl.appendChild(lb);
}
function studioPaint() { const cv = $('#stCv'); if (cv) paintTo(cv, stD(), 2, ST.dev === 'desk' ? { menubar: true } : null); $('#stName').textContent = stD().name; setAccent({ colors: ST.colors }); }
$('#stShuffle').onclick = () => { ST.seed = Math.floor(Math.random() * 9999) + 1; studioPaint(); };
$('#stSave').onclick = () => { if (ST.style === 'photo') { toast('Photo wallpapers are not saved to the collection. Download it instead.'); return; } saveDesign(stD()); };
$('#stPhoto2').onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { window.__photo = im; ST.style = 'photo'; try { ST.colors = paletteFromImage(im); } catch (x) {} ST.pal = null; ST.o.calm = ST.dev === 'phone'; buildStudio(); toast('Your photo is in. Use Calm clock area to keep the top clear.'); }; im.onerror = () => toast('Could not open that image.'); im.src = URL.createObjectURL(f); e.target.value = ''; };
$('#stText').oninput = () => { ST.o.text = $('#stText').value; studioPaint(); }; $('#stFont').onchange = () => { ST.o.font = $('#stFont').value; studioPaint(); };
$('#stWid').onclick = () => { ST.o.widgets = !ST.o.widgets; buildStudio(); };
$('#stCalm').onclick = () => { ST.o.calm = !ST.o.calm; buildStudio(); };
$('#stPair').onclick = () => downloadPair(stD(), ST.dev, $('#stSize').value);
$('#stPhoto').onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return; const im = new Image(), u = URL.createObjectURL(f); im.onload = () => { try { ST.colors = paletteFromImage(im); ST.pal = null; buildStudio(); toast('Colours picked from your photo.'); } catch (x) { toast('Could not read that photo.'); } URL.revokeObjectURL(u); }; im.onerror = () => toast('Could not open that image.'); im.src = u; e.target.value = ''; };
$('#stDl').onclick = () => download(stD(), ST.dev, $('#stSize').value); if (TOUCH) $('#stDl').textContent = 'Save image';

{ const MOODS = [['Focus', ['contours', 'dunes', 'grain', 'waves', 'silk'], ['Sand', 'Mint', 'Lagoon', 'Moss', 'Lilac'], .5], ['Sleep', ['aurora', 'fireflies', 'lake', 'blossom'], ['Midnight', 'Deep Sea', 'Forest', 'Dusk'], .5], ['Cozy', ['fireflies', 'bubbles', 'dunes', 'blossom'], ['Ember', 'Rose Gold', 'Sand', 'Sorbet'], .6], ['Party', ['bars', 'kaleido', 'sungrid', 'halftone', 'confetti'], ['Neon', 'Candy', 'Poster', 'Midnight'], 1.4]], host = $('#moods'), k = document.createElement('span'); k.className = 'kick'; k.textContent = 'Pick a mood'; host.append(k);
  MOODS.forEach(([n, ss, ps, sp]) => { const b = document.createElement('button'); b.className = 'pill line sm'; b.textContent = n; b.onclick = () => { const sk = ss[Math.floor(Math.random() * ss.length)], pn = ps[Math.floor(Math.random() * ps.length)], pl = PALS.find(p => p[0] === pn); openView({ id: 'mood', style: sk, colors: pl[1].slice(), seed: Math.floor(Math.random() * 9000) + 1, name: pl[0] + ' ' + styleOf(sk)[1], o: { speed: sp } }); }; host.appendChild(b); }); }
$('#surprise').onclick = () => { const live = ALL.filter(a => styleOf(a.style)[3]), pl = PALS[Math.floor(Math.random() * PALS.length)], b = live[Math.floor(Math.random() * live.length)]; openView(Object.assign({}, b, { colors: pl[1].slice(), seed: Math.floor(Math.random() * 9000) + 1, name: pl[0] + ' ' + styleOf(b.style)[1], o: {} })); };
{ const ft = $('#footNote'), lb = document.createElement('button'); lb.className = 'authlink'; const sync = () => { lb.textContent = 'Battery saver: ' + (LITE ? 'on' : 'off'); }; sync(); lb.onclick = () => { LITE = !LITE; LS.set('pg_lite', LITE); sync(); toast(LITE ? 'Battery saver on: animations run gently.' : 'Battery saver off.'); }; ft.after(lb); }
/* ---------- router ---------- */
const PAGES = ['home', 'browse', 'studio', 'saved', 'setup'];
function route() {
  let h = location.hash.slice(1); const shared = /^d-/.test(h) ? decodeDesign(h) : null; if (!PAGES.includes(h)) h = 'home';
  PAGES.forEach(p => { $('#p-' + p).hidden = p !== h; }); $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.p === h));
  ['hero', 'studio'].forEach(stopAnim);
  if (h === 'home') initHome(); else if (h === 'browse') initBrowse(); else if (h === 'studio') buildStudio(); else if (h === 'setup') initSetup(); else initSaved();
  if (shared) openView(shared);
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });
updSaved(); route();
