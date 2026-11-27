# Pigment

**Aesthetic and live wallpapers for iPhone, Mac and Windows, made in your browser.**

© Made By Shubham Patel

**▶ Live app: https://pigment-shubham.github.io/pigment/** (turn on in Settings → Pages, see below)

Pigment draws every wallpaper from code, so there are no stock images. Pick a style and a palette, tweak it, and download it as a still image, a looping video or a live wallpaper.

## What it does
- **2,025 wallpapers** from 81 styles × 25 palettes, in vibes like Soft, Retro, Nature, Tech, Craft, Music, Scenes, Designer and Pigment.
- **Live styles** that move: cinematic scenes (Moonlit Lake, Neon City, Sunset Sea, Blossom Night, Fireworks, Warp Speed, Deep Sea, Ink Smoke), designer gradients (Mesh Gradient, Liquid Satin, Glow Orb, Soft Waves, Prism Glass, Petal Bloom, Soft Spheres, Aura Rings) and more, plus weather, snow, pixel-art, isometric-city, stained-glass, tarot and star-trail scenes.
- **Music-reactive** styles that react to a beat or your microphone.
- **Studio** to make your own: colours, detail, grain, speed, text overlay, calm clock area, widget area, or build from your own photo's colours.
- **Downloads:** 4K, iPhone and MacBook sizes, light + dark pairs, packs (zip), 16-second seamless loop videos (MP4), and live-wallpaper files for Plash (Mac) and Lively (Windows).
- Today's pick, favourites, moods, seasonal palettes, share links, a local profile, an AI-style helper and install-as-app (PWA).

## View it online (GitHub Pages)
1. On GitHub open this repository → **Settings** → **Pages**.
2. Under **Build and deployment** choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. After about a minute your app is live at `https://pigment-shubham.github.io/pigment/`. That link is already at the top of this file.

You can also just download `index.html` and open it. Sign-in (Firebase) only works from a real web address, such as the GitHub Pages one.

## Files
| File | What it is |
|---|---|
| `index.html` | The whole app in one file |
| `src/` | The source parts and `build3.py`, which joins them into `index.html` |
| `config.js` | Firebase web settings (public by design) |
| `version.json` | Release number, used for the "new version ready" bar |
| `firestore.rules` | Privacy rules: each person only reads their own saves |
| `manifest.webmanifest`, icons | Install-as-app support |

To rebuild after editing `src/`: copy `build3.py` and the parts next to each other and run `python3 build3.py`.

## Status
Current version: **3.2.1**. See [CHANGELOG.md](CHANGELOG.md). Tested in a desktop browser only, not yet on real iPhone, Mac or Windows live-wallpaper apps.

## Licence
No licence has been chosen yet, so all rights are reserved by the author. Add a `LICENSE` file if you want others to reuse the code.
