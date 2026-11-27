"""Build site/media.js (window.MEDIA) from real.json (images fetched from GameWith) plus a few official images kept from the user's pack."""
import json,os
from PIL import Image
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
R=json.load(open(f'{S}/real.json'));old=json.load(open(f'{S}/media.json'))
cred=json.load(open(f'{S}/img/credits.json'))
def wh(p):
    im=Image.open(f'{S}/{p}');return [im.width,im.height]
def kept(p,src):
    cred[p]={'source':src,'note':'official promo image from the user\'s image pack (not found on GameWith/Game8)','w':wh(p)[0],'h':wh(p)[1]}
M={'characters':[],'buddies':[],'gifts':[],'outfits':[],'buddyCards':[],'weaponIcons':R['weaponTypes'],'monsters':{},'visages':{},'weapons':R['weapons'],'armor':R['armor'],'size':{}}
for c in old['characters']:
    a=R['adventurers'].get(c['id'],{})
    M['characters'].append({'id':c['id'],'n':c['n'],'r':c['r'],'w':c['w'],'el':c['el'],'p':a.get('icon'),'f':a.get('full')})
for b,src in [('arya','assets/images/02-buddies/arya.jpg'),('elwin','assets/images/02-buddies/elwin.jpg')]:
    p=f'img/buddy/featured/{b}.webp';kept(p,src);M['buddies'].append({'id':b,'n':b.capitalize(),'img':p})
for g in old['gifts']:
    im=R['gifts'].get(g['n'])
    if not im and g['n']=='Sheet':im='img/gift/sheet.webp';kept(im,'assets/images/03-gifts/sheet.png')
    M['gifts'].append({'n':g['n'],'img':im})
OF={'freya-rose-queen':'Rose Queen · Freya','stylia-silken-dancer':'Silken Dancer · Stylia','weapon-flying-feather':'Flying Feather · สกินธนู','buddy-flower-bearing-plume':'Flower-Bearing Plume · ชุดบัดดี้'}
for o in old['outfits']:
    i=o['id'];img=f'img/outfit/{i}.webp';full=f'img/outfit/{i}-full.webp' if os.path.exists(f'{S}/img/outfit/{i}-full.webp') else None
    kept(img,f'assets/images/04-outfits/{i}.jpg')
    if full:kept(full,f'assets/images/04-outfits/{i}-full.jpg')
    M['outfits'].append({'id':i,'n':OF.get(i,i),'img':img,'full':full})
for b in old['buddyCards']:
    ic=R['buddies'].get(b['id'],{}).get('icon');M['buddyCards'].append({**b,'img':ic})
for k,v in R['monsters'].items():M['monsters'][k]={'n':v['n'],'icon':v['icon']}
for k,v in R['visages'].items():M['visages'][k]={'n':v['n'],'img':v['img']}
man=json.load(open(f'{S}/../assets/images/12-armor/manifest-armor.json'))
for st in man['sets']:
    p=f"img/armor/{st['slug']}/full.webp"
    if os.path.exists(f'{S}/{p}') and 'full_source' in st:cred[p]={'source':st['full_source'],'page':st['source'],'note':'background removed, resized'}
for root,_,fs in os.walk(f'{S}/img'):
    if '/_old' in root:continue
    for f in fs:
        if f.endswith('.webp'):
            p=os.path.relpath(os.path.join(root,f),S);M['size'][p]=wh(p)
json.dump(cred,open(f'{S}/img/credits.json','w'),ensure_ascii=False,indent=1)
miss=json.load(open(f'{S}/img/missing.json'))
use={'Sheet':'img/gift/sheet.webp','Arya':'img/buddy/featured/arya.webp','Elwin':'img/buddy/featured/elwin.webp','Rose Queen':'img/outfit/freya-rose-queen.webp','Silken Dancer':'img/outfit/stylia-silken-dancer.webp','Flying Feather':'img/outfit/weapon-flying-feather.webp','Flower-Bearing Plume':'img/outfit/buddy-flower-bearing-plume.webp'}
for x in miss:
    if x['name'] in use:x['using_instead']=use[x['name']]+' (official promo image from your pack in assets/images)'
import re,glob
miss=[x for x in miss if x.get('category')!='build weapon image']
for f in sorted(glob.glob(f'{S}/data/build/*.json')):
    for b in json.load(open(f))['builds']:
        n=b.get('weapon');
        if not n:continue
        k=re.sub(r'\s+\((Fire|Water|Thunder|Ice|Dragon)\)$','',re.sub(r'\s+[IVX]+$','',n.rstrip('*')).strip())
        if k not in M['weapons'] and not any(x.get('name')==k for x in miss):
            miss.append({'category':'build weapon image','name':k,'reason':('name translated from Japanese, not listed on GameWith.ai EN' if n.endswith('*') else 'GameWith.ai page has no weapon image (shows only the weapon type icon)')})
json.dump(miss,open(f'{S}/img/missing.json','w'),ensure_ascii=False,indent=1)
open(f'{S}/media.js','w').write('window.MEDIA='+json.dumps(M,ensure_ascii=False,separators=(',',':'))+';')
json.dump(M,open(f'{S}/media.json','w'),ensure_ascii=False,indent=1)
print({k:len(v) for k,v in M.items()})
