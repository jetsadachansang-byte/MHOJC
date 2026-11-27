# MHO Builder site

Thai fan site for Monster Hunter Outlanders, deployed at https://mho-builder-9qq.pages.dev

- `src/style.css`, `src/body.html` – page source. Run `python3 build.py` to produce `index.html` (standalone) and `artifact.html`.
- `db.js` – game database (armor, weapons, skills with Thai text, monster weaknesses). Built by `tools/parse.py` + `tools/build_db.py` from community data pages (mhoutlandersbuild.com, 3rd Closed Beta data).
- `media.js` / `media.json` – image map. Built by `tools/optimize_images.py` from `assets/images/` (WebP, resized) into `img/`.
- `img/armor/` – web copies of the armor icons and full-body images (from `assets/images/12-armor/`, built by `tools/build_armor_db.py`).
- Images on the live site are served through jsDelivr from the `cdn` branch, which holds only a copy of `site/img` (jsDelivr refuses repos over 50 MB, and this repo is larger because of `assets/images`). After changing images, copy `site/img` to the `cdn` branch and point the Cloudflare worker at the new `cdn` commit.

## Armor images (assets/images/12-armor)

- `<set-slug>/<part>.png` – 256x256 transparent piece icons; `full.png` / `full-alt.png` – full-body cutouts.
- `manifest-armor.json` – every set, piece names, top-rarity skills, set skill, image paths and source URLs (GameWith.ai).
- `missing-armor.json` – pieces with no usable artwork. `conflicts-armor.json` – data differences between GameWith.ai and mhoutlandersbuild.com (currently none).
- Pipeline: `tools/make_armor_manifest.py` (manifest) → `tools/build_armor_db.py` (site database + web images).

## Real images (branch real-images)

- `tools/fetch_real_images.py` downloads images from GameWith.ai / GameWith JP into `img/` (WebP q82: icons 256px, portraits 512px, full art ≤1600px) and writes `img/credits.json` (source URL of every image) and `img/missing.json`.
- `tools/build_media.py` → `media.js`; `tools/build_cards.py` → `cards.js` from `data/` (character info, builds, guides and monster cards transcribed from the old image cards, content unchanged).
- `src/ui2.js` renders those as HTML. `vendor/html2canvas.min.js` (MIT) powers “บันทึกเป็นรูป”.
- Old images are kept in `img/_old/` (not used by the site).
