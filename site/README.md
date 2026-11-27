# MHO Builder site

Thai fan site for Monster Hunter Outlanders, deployed at https://mho-builder-9qq.pages.dev

- `src/style.css`, `src/body.html` – page source. Run `python3 build.py` to produce `index.html` (standalone) and `artifact.html`.
- `db.js` – game database (armor, weapons, skills with Thai text, monster weaknesses). Built by `tools/parse.py` + `tools/build_db.py` from community data pages (mhoutlandersbuild.com, 3rd Closed Beta data).
- `media.js` / `media.json` – image map. Built by `tools/optimize_images.py` from `assets/images/` (WebP, resized) into `img/`.
- Images on the live site are served from this branch through jsDelivr.
