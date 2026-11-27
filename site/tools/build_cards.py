"""Bundle site/data/*.json (transcribed from the old image cards) into site/cards.js (window.CARDS)."""
import json,os,glob
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
C={'adv':{},'build':{},'guide':[],'mon':json.load(open(f'{S}/data/monster_cards.json'))}
for f in sorted(glob.glob(f'{S}/data/adv/*.json')):d=json.load(open(f));C['adv'][d['id']]=d
for f in sorted(glob.glob(f'{S}/data/build/*.json')):d=json.load(open(f));C['build'][d['id']]=d
for f in sorted(glob.glob(f'{S}/data/guide/*.json')):C['guide'].append(json.load(open(f)))
open(f'{S}/cards.js','w').write('window.CARDS='+json.dumps(C,ensure_ascii=False,separators=(',',':'))+';')
print({k:len(v) for k,v in C.items()})
