"""Match the 38 unnamed buddy images in assets/images/09-buddies-all to their names.

Run on a computer with internet:
    pip install opencv-python numpy scipy requests
    python tools/match_buddies.py            # dry run: prints the matches and writes match-preview.jpg
    python tools/match_buddies.py --apply    # renames files to <slug>.png and updates buddies.json
    python tools/match_buddies.py --img site/img/buddy/cards --apply   # same, for the site's webp copies

How it works: downloads each buddy's reference portrait from GameWith (URL in buddies.json),
then compares only inside the same species + rarity group (both already known from the card badge),
using ORB keypoints (shape) + HSV colour histogram (to tell recoloured R buddies apart),
and picks the best one-to-one assignment with the Hungarian algorithm.
Always check match-preview.jpg by eye before --apply.
"""
import json, sys, os, io
import numpy as np, cv2, requests
from scipy.optimize import linear_sum_assignment

D = os.path.join(os.path.dirname(__file__), '..', 'assets', 'images', '09-buddies-all')
META = os.path.join(D, 'buddies.json')
IMG = D            # folder holding cat_a_01.* etc. Override: --img site/img/buddy/cards  (files may be .png or .webp)
for k, a in enumerate(sys.argv):
    if a == '--img': IMG = sys.argv[k+1]
meta = json.load(open(META, encoding='utf-8'))
def path_of(name):
    for ext in ('.png', '.webp', '.jpg'):
        p = os.path.join(IMG, name + ext)
        if os.path.exists(p): return p
    raise FileNotFoundError(name)
os.makedirs(os.path.join(D, '_ref'), exist_ok=True)

def load_ref(b):
    p = os.path.join(D, '_ref', b['slug'] + '.png')
    if not os.path.exists(p):
        r = requests.get(b['ref_image'], timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        r.raise_for_status(); open(p, 'wb').write(r.content)
    return cv2.imread(p, cv2.IMREAD_COLOR)

def body(img):  # drop card UI: bottom badge strip and top-right portrait
    h, w = img.shape[:2]
    return img[int(h*.08):int(h*.80), int(w*.05):int(w*.80)]

orb = cv2.ORB_create(1500)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
def feats(img):
    g = cv2.cvtColor(cv2.resize(img, (400, int(400*img.shape[0]/img.shape[1]))), cv2.COLOR_BGR2GRAY)
    return orb.detectAndCompute(g, None)[1]
def hist(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h = cv2.calcHist([hsv], [0, 1], None, [24, 8], [0, 180, 0, 256]); return cv2.normalize(h, h).flatten()
def score(a, b):
    fa, fb = feats(a), feats(b)
    s1 = 0 if fa is None or fb is None else len([m for m in bf.match(fa, fb) if m.distance < 48]) / 100.0
    s2 = cv2.compareHist(hist(a), hist(b), cv2.HISTCMP_CORREL)
    return s1 + 1.5 * s2

result, tiles = {}, []
for sp, by_r in meta['image_groups'].items():
    for ra, files in by_r.items():
        cands = [b for b in meta['buddies'] if b.get('species') == sp and b.get('rarity') == ra and b.get('ref_image')]
        imgs = [body(cv2.imread(path_of(f))) for f in files]
        refs = [load_ref(b) for b in cands]
        S = np.array([[score(i, r) for r in refs] for i in imgs])
        rows, cols = linear_sum_assignment(-S)
        for i, j in zip(rows, cols):
            result[files[i]] = cands[j]['slug']
            t = np.hstack([cv2.resize(imgs[i], (200, 240)), cv2.resize(refs[j], (200, 240))])
            cv2.putText(t, f"{files[i]} -> {cands[j]['name']} ({S[i,j]:.2f})", (5, 232), cv2.FONT_HERSHEY_SIMPLEX, .45, (255, 255, 255), 1)
            tiles.append(t)
        print(sp, ra, {files[i]: cands[j]['name'] for i, j in zip(rows, cols)})

grid = [np.hstack(tiles[k:k+4] + [np.zeros_like(tiles[0])] * (4 - len(tiles[k:k+4]))) for k in range(0, len(tiles), 4)]
cv2.imwrite(os.path.join(D, 'match-preview.jpg'), np.vstack(grid))
print('preview ->', os.path.join(D, 'match-preview.jpg'))

if '--apply' in sys.argv:
    for old, slug in result.items():
        src = path_of(old); os.rename(src, os.path.join(IMG, slug + os.path.splitext(src)[1]))
        for b in meta['buddies']:
            if b['slug'] == slug: b['file'] = '09-buddies-all/' + slug + '.png'; b['original_file'] = old + '.png'
    json.dump(meta, open(META, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('renamed', len(result), 'files and updated buddies.json')
