const STYLES = [
  ['grain', 'Grain', drawGrain, true, 'Soft colour fields with film grain', 'Sorbet'], ['ridges', 'Ridgelines', drawRidges, true, 'Stacked lines that drift like a signal', 'Dusk'],
  ['dunes', 'Dunes', drawDunes, true, 'Layered hills under a low sun', 'Lagoon'], ['halftone', 'Halftone', drawHalftone, true, 'A dot screen that breathes', 'Candy'],
  ['aurora', 'Aurora', drawAurora, true, 'Curtains of light swaying overhead', 'Forest'], ['ripples', 'Ripples', drawRipples, true, 'Rings spreading from two drops', 'Deep Sea'],
  ['contours', 'Contours', drawContours, true, 'Topographic lines that slowly shift', 'Sand'], ['waves', 'Waves', drawWaves, true, 'Fine lines rolling in a gradient', 'Lilac'],
  ['bubbles', 'Bubbles', drawBubbles, true, 'Glassy bubbles bouncing off the walls', 'Cotton'], ['stardust', 'Stardust', drawStardust, true, 'Twinkling stars and soft nebulae', 'Midnight'],
  ['mosaic', 'Mosaic', drawMosaic, true, 'Rounded tiles that pulse in colour', 'Mint'], ['bars', 'Bars', drawBars, true, 'Soft pills rising and falling', 'Rose Gold'],
  ['bloom', 'Bloom', drawBloom, true, 'A sunflower spiral that turns', 'Ember'], ['spiro', 'Spiro', drawSpiro, true, 'Looping curves in layers', 'Neon'],
  ['opart', 'Op-art', drawOpart, true, 'A warped checkerboard that ripples', 'Poster'], ['shapes', 'Shapes', drawShapes, false, 'Flat Bauhaus tiles', 'Poster'],
  ['metaballs', 'Metaballs', drawMetaballs, true, 'Gooey blobs that merge and split', 'Candy'],
  ['silk', 'Silk', drawSilk, true, 'Flowing satin ribbons', 'Rose Gold'], ['sungrid', 'Retro Sun', drawSungrid, true, 'Synthwave sun over a rolling grid', 'Neon'],
  ['kaleido', 'Kaleidoscope', drawKaleido, true, 'Mirrored petals that slowly turn', 'Midnight'], ['truchet', 'Truchet', drawTruchet, true, 'Quarter-circle tiles with colours that flow', 'Poster'],
  ['voronoi', 'Glass Cells', drawVoronoi, true, 'Stained-glass cells that drift', 'Lagoon'], ['fireflies', 'Fireflies', drawFireflies, true, 'Glowing fireflies over dark grass', 'Forest'],
  ['rain', 'Rain on Glass', drawRain, true, 'Raindrops running down a window', 'Deep Sea'], ['dither', 'Dither', drawDither, true, 'Retro pixel-dither gradients', 'Ember'],
  ['daysky', 'Day Sky', drawDaysky, true, 'A sky that moves through a whole day', 'Dusk'],
  ['gradient', 'Gradient', drawGradient, true, 'A clean, smooth two-tone gradient with grain', 'Lilac'], ['brandlogo', 'Pigment Logo', drawBrandLogo, true, 'The Pigment drop and name, floating', 'Sorbet'],
  ['brandtype', 'Pigment Type', drawBrandType, true, 'Big PIGMENT lettering sliding in rows', 'Poster'], ['branddrops', 'Pigment Drops', drawBrandDrops, true, 'A field of breathing drops', 'Candy'],
  ['eq', 'Equalizer', drawEQ, true, 'Music bars that dance to a beat or your mic', 'Neon'], ['pulse', 'Beat Pulse', drawPulse, true, 'Rings thump out on every beat', 'Ember'],
  ['vinyl', 'Vinyl', drawVinyl, true, 'A spinning record with a glow', 'Midnight'], ['wavebeat', 'Soundwave', drawWavebeat, true, 'Glowing waveforms that swell with the beat', 'Deep Sea'],
  ['marble', 'Marble', drawMarble, true, 'Swirling marbled ink', 'Lilac'], ['sunburst', 'Sunburst', drawSunburst, true, 'Retro rays turning around a sun', 'Sorbet'],
  ['hexgrid', 'Hex Grid', drawHexgrid, true, 'A honeycomb that ripples with colour', 'Mint'], ['orbits', 'Orbits', drawOrbits, true, 'Little worlds circling a glow', 'Midnight'],
  ['confetti', 'Confetti', drawConfetti, true, 'Paper confetti drifting down', 'Candy'], ['constellation', 'Constellation', drawConstellation, true, 'Stars joined by drifting lines', 'Dusk'],
  ['glassorbs', 'Glass Orbs', drawGlassOrbs, true, 'Glossy 3D spheres floating in soft light', 'Peach Fizz'], ['holofoil', 'Holo Foil', drawHoloFoil, true, 'Iridescent foil with sliding glints', 'Lilac'],
  ['frosted', 'Frosted Glass', drawFrosted, true, 'Frosted panes drifting over glowing colour', 'Blueberry'], ['galaxy', 'Galaxy', drawGalaxy, true, 'A turning spiral galaxy of thousands of stars', 'Midnight'],
  ['caustics', 'Caustics', drawCaustics, true, 'Sunlight rippling on a pool floor', 'Lagoon'], ['bokeh', 'Bokeh', drawBokeh, true, 'Soft out-of-focus lights at night', 'Dusk'],
  ['paper', 'Paper Layers', drawPaperLayers, true, 'Cut-paper waves with soft shadows', 'Sorbet'], ['shafts', 'Light Shafts', drawLightShafts, true, 'Beams of light through dusty air', 'Ember'],
  ['riso', 'Risograph', drawRiso, true, 'Overprinted ink shapes with halftone and paper grain', 'Poster'], ['blueprint', 'Blueprint', drawBlueprint, true, 'A technical drawing with a sweeping radar line', 'Deep Sea'],
  ['zenink', 'Zen Ink', drawZenInk, true, 'Ink-wash mountains, mist and a brushed enso', 'Sand'], ['memphis', 'Memphis', drawMemphis, true, '80s squiggles, zigzags and confetti shapes', 'Cotton'],
  ['hud', 'Sci-fi HUD', drawHUD, true, 'Rotating rings, ticks and a scanning sweep', 'Neon'], ['filmleak', 'Film Leak', drawFilmLeak, true, 'Analog light leaks, dust and film grain', 'Ember'],
  ['terrazzo', 'Terrazzo', drawTerrazzo, true, 'Speckled stone chips in a polished floor', 'Peach Fizz'], ['deco', 'Art Deco', drawDeco, true, 'Gold-lined scallops with a travelling shimmer', 'Midnight'],
  ['meshgrad', 'Mesh Gradient', drawMeshGrad, true, 'Soft melting colour mesh that slowly drifts', 'Sorbet'], ['liquid', 'Liquid Satin', drawLiquid, true, 'Glossy satin ribbons that flow across the screen', 'Lilac'],
  ['gloworb', 'Glow Orb', drawGlowOrb, true, 'A luminous sphere with a halo and orbit lines', 'Midnight'], ['softwaves', 'Soft Waves', drawSoftWaves, true, 'Layered silky hills of colour that gently sway', 'Dusk'],
  ['prism', 'Prism Glass', drawPrism, true, 'Frosted glass panes over glowing colour', 'Cotton'], ['petals', 'Petal Bloom', drawPetals, true, 'Overlapping glowing petals that turn like a flower', 'Neon'],
  ['spheres', 'Soft Spheres', drawSoftSpheres, true, 'Smooth 3D pebbles floating with soft shadows', 'Peach Fizz'], ['aurarings', 'Aura Rings', drawAuraRings, true, 'Glowing rings pulsing outward from the centre', 'Blueberry'],
  ['lake', 'Moonlit Lake', drawLake, true, 'Layered mountains, drifting mist and a rippling reflection', 'Dusk'], ['neoncity', 'Neon City', drawNeonCity, true, 'Rainy skyline with blinking windows and neon signs', 'Neon'],
  ['sea', 'Sunset Sea', drawSeaSunset, true, 'Rolling waves and sun glitter at golden hour', 'Ember'], ['blossom', 'Blossom Night', drawBlossom, true, 'Cherry petals falling past a full moon', 'Spring Blossom'],
  ['fireworks', 'Fireworks', drawFireworks, true, 'Bursts of light over a quiet skyline', 'Midnight'], ['warp', 'Warp Speed', drawWarp, true, 'Stars streaking past at light speed', 'Blueberry'],
  ['deepsea', 'Deep Sea', drawDeepSea, true, 'Glowing jellyfish and light shafts underwater', 'Deep Sea'], ['smoke', 'Ink Smoke', drawSmoke, true, 'Glowing wisps of smoke that swirl', 'Ember']
];
const PHOTO_ENTRY = ['photo', 'Photo', drawPhoto, false, 'Your own picture, fitted to the screen', 'Sorbet'];
/* vibes: browse by look and feel */
const VIBES = [['Soft', 'grain gradient silk marble holofoil glassorbs frosted paper bokeh aurora waves bubbles'], ['Retro', 'sungrid dither memphis riso daysky vinyl sunburst opart halftone deco filmleak'], ['Nature', 'dunes ridges contours ripples caustics fireflies rain stardust galaxy zenink shafts aurora'], ['Tech', 'hud blueprint voronoi hexgrid constellation orbits truchet metaballs spiro bloom'], ['Craft', 'riso terrazzo paper mosaic memphis shapes bars zenink deco'], ['Music', 'eq pulse vinyl wavebeat'], ['Scenes', 'lake neoncity sea blossom fireworks warp deepsea smoke galaxy daysky aurora'], ['Designer', 'meshgrad liquid gloworb softwaves prism petals spheres aurarings glassorbs frosted grain silk'], ['Pigment', 'brandlogo brandtype branddrops']];
const styleOf = k => k === 'photo' ? PHOTO_ENTRY : STYLES.find(s => s[0] === k);
/* Calm strip along the top edge so a Mac menu bar stays readable on desktop wallpapers. */
function menuBand(ctx, w, h, c) { const s = h * .034, f = h * .09, g = ctx.createLinearGradient(0, 0, 0, f); g.addColorStop(0, c); g.addColorStop(s / f, c); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, f); }
function render(ctx, w, h, d, t, o) { o = Object.assign({ detail: 50, grain: 45, speed: 1 }, d.o || {}, o || {}); ctx.save(); styleOf(d.style)[2](ctx, w, h, d, (t || 0) * o.speed, o); ctx.restore(); if (o.menubar) { ctx.save(); menuBand(ctx, w, h, d.colors[0]); ctx.restore(); } if (o.text) drawText(ctx, w, h, d.colors, o); if (o.widgets && w < h) { const c = d.colors[0], g = ctx.createLinearGradient(0, h * .1, 0, h * .46); g.addColorStop(0, rgba(c, 0)); g.addColorStop(.25, rgba(c, .62)); g.addColorStop(.75, rgba(c, .62)); g.addColorStop(1, rgba(c, 0)); ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, h * .1, w, h * .36); ctx.restore(); } if (o.calm && w < h) { const c = d.colors[0], g = ctx.createLinearGradient(0, 0, 0, h * .4); g.addColorStop(0, rgba(c, .78)); g.addColorStop(.55, rgba(c, .4)); g.addColorStop(1, rgba(c, 0)); ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h * .4); ctx.restore(); } }

function drawText(ctx, w, h, C, o) {
  const F = { sans: '"Bricolage Grotesque","Arial Narrow",system-ui,sans-serif', serif: 'Georgia,"Times New Roman",serif', mono: 'ui-monospace,Menlo,Consolas,monospace' }, fam = F[o.font] || F.sans, txt = String(o.text).slice(0, 60);
  let fs = Math.min(w, h) * (w < h ? .1 : .075); ctx.save(); ctx.font = '800 ' + fs + 'px ' + fam; const tw = ctx.measureText(txt).width, mw = w * .84; if (tw > mw) fs *= mw / tw;
  ctx.font = '800 ' + fs + 'px ' + fam; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const light = lum(C[0]) > .5; ctx.fillStyle = light ? '#111114' : '#ffffff'; ctx.shadowColor = light ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)'; ctx.shadowBlur = fs * .2; ctx.fillText(txt, w / 2, w < h ? h * .68 : h * .76); ctx.restore();
}
/* ---------- palettes and the wallpapers ---------- */
const PALS = [
  ['Sorbet', ['#fff3e8', '#ff6b4a', '#ffb25b', '#ff4f8b', '#7a5cff']], ['Lagoon', ['#e8faf6', '#11b5a4', '#2b7de9', '#8fe6d2', '#0b2a4a']],
  ['Moss', ['#f4f1e2', '#5f7f3a', '#cfc95c', '#e9a53d', '#2d3a21']], ['Dusk', ['#1c1838', '#ff6b8b', '#ffb36b', '#7b61ff', '#3ad1ff']],
  ['Candy', ['#fff0f6', '#ff5fa2', '#ffd166', '#6bd6ff', '#a78bfa']], ['Poster', ['#f3f2ee', '#111114', '#e5342f', '#2a4bd7', '#f2c14e']],
  ['Deep Sea', ['#06223a', '#0f6ba8', '#1fb6c1', '#7ae0d0', '#e8fff7']], ['Ember', ['#1a0f14', '#ff4d2e', '#ff9a3c', '#ffd166', '#c0206a']],
  ['Lilac', ['#f3eeff', '#8b6cf0', '#c9b6ff', '#ff9ccf', '#4b2fb8']], ['Sand', ['#f6ead6', '#d99f63', '#b5653a', '#efc58c', '#6b3b22']],
  ['Mint', ['#effcf3', '#2fc67a', '#a6f0c4', '#ffe27a', '#0f6b4a']], ['Midnight', ['#0a0f24', '#4c6fff', '#9aa8ff', '#ff7ac6', '#27e3c3']],
  ['Cotton', ['#fdf6ff', '#ff9ad5', '#9ad7ff', '#c3f584', '#ffd37a']], ['Forest', ['#0d1f17', '#2fbf71', '#9be564', '#e8f7a0', '#1f7a8c']],
  ['Rose Gold', ['#2a1a22', '#e8a598', '#f4d0c4', '#b76e79', '#fff1e8']], ['Neon', ['#0b0b14', '#ff2bd6', '#00f0ff', '#b6ff3b', '#ffe600']],
  ['Spring Blossom', ['#fff5f8', '#ff8fb3', '#ffc8dd', '#a8e6a1', '#7a5cff']], ['Summer Mango', ['#fff7e0', '#ffb300', '#ff6f3c', '#2ec4b6', '#0b4f6c']],
  ['Autumn Harvest', ['#2a1810', '#d9822b', '#a63d2f', '#e9b44c', '#6b705c']], ['Winter Frost', ['#eef6ff', '#7fb7ff', '#cfe6ff', '#9aa8ff', '#1f3a64']], ['Holiday', ['#10231a', '#d62839', '#2e8b57', '#f2c14e', '#f7f3e8']],
  ['Peach Fizz', ['#fff1e6', '#ff9e7d', '#ffd1a1', '#ff6f91', '#845ec2']], ['Blueberry', ['#12122b', '#4d5bff', '#8f9bff', '#c77dff', '#52e0ff']],
  ['Matcha', ['#f1f5e4', '#7fa650', '#c7d98a', '#3f5d2a', '#e9b872']], ['Graphite', ['#17181c', '#8a8f9c', '#c5c9d3', '#f2f3f6', '#ff6b4a']]
];
const ALL = [];
STYLES.forEach(([sk, sl], si) => PALS.forEach((p, pi) => ALL.push({ id: sk + '-' + slug(p[0]), style: sk, pal: p[0], name: p[0] + ' ' + sl, colors: p[1], seed: 11 + si * 17 + pi * 5 })));
const byId = id => ALL.find(d => d.id === id);
