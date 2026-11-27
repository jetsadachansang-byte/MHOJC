"""Download real game images (GameWith.ai / GameWith JP) into site/img and write site/img/credits.json.

Inputs (from a scrape of GameWith pages): maps.json, payload_*.json, jp_adv.json in <work_dir>.
Usage: python3 fetch_real_images.py <work_dir>
Rules: no upscaling (sizes are caps), WebP q82, keep alpha when the source has it.
"""
import json,os,re,sys,io,time,urllib.request
from PIL import Image
W=sys.argv[1];SITE=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'));IMG=SITE+'/img';R=os.path.dirname(SITE)
UA={'User-Agent':'Mozilla/5.0 Chrome/124','Referer':'https://gamewith.ai/'}
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower().replace("'",'')).strip('-')
credits={};missing=[];cache=os.path.join(W,'dl_cache');os.makedirs(cache,exist_ok=True)
def get(url):
    p=os.path.join(cache,re.sub(r'[^A-Za-z0-9._-]','_',url.split('//')[1]))
    if not os.path.exists(p):
        req=urllib.request.Request(url,headers=UA)
        with urllib.request.urlopen(req,timeout=30) as r:open(p,'wb').write(r.read())
        time.sleep(0.15)
    return Image.open(p)
def save(url,rel,maxw,maxh,page,note=None,q=82):
    im=get(url);has_a=im.mode in('RGBA','LA','P') and ('transparency' in im.info or im.mode in('RGBA','LA'))
    im=im.convert('RGBA' if has_a else 'RGB')
    if has_a and im.getextrema()[3][0]==255:im=im.convert('RGB')   # alpha fully opaque -> drop it
    src=im.size;im.thumbnail((maxw,maxh),Image.LANCZOS)
    p=os.path.join(IMG,rel);os.makedirs(os.path.dirname(p),exist_ok=True);im.save(p,'WEBP',quality=q,method=6)
    credits['img/'+rel]={'source':url,'page':page,'src_px':list(src),'w':im.width,'h':im.height,**({'note':note} if note else {})}
    return 'img/'+rel
M=json.load(open(f'{W}/maps.json'));GWA='https://gamewith.ai/monster-hunter-outlanders/en'
out={'adventurers':{},'buddies':{},'monsters':{},'visages':{},'weaponTypes':{},'weapons':{},'gifts':{},'armor':{}}
# adventurers
JP=json.load(open(f'{W}/jp_adv.json'))
# the GameWith JP page listed under the Rhodes icon actually shows Haze (caption ヘイズ)
if 'Rhodes' in JP:JP['Haze']=JP.pop('Rhodes')
for path,v in M['adventurers'].items():
    if v['name'].startswith('Fated'):continue
    s=slug(v['name']).replace('ouyang-varen','ouyangvaren')
    e={'icon':save(v['img'],f'adventurer/{s}.webp',512,512,GWA+path[len('/monster-hunter-outlanders/en'):])}
    j=JP.get(v['name'],{})
    if j.get('hero'):e['full']=save(j['hero'],f'adventurer/full/{s}.webp',1600,1600,j['jp_page'],'GameWith JP character art')
    else:missing.append({'category':'adventurer full art','name':v['name'],'reason':'no art found: GameWith.ai has only the card icon and no GameWith JP page shows this character'})
    out['adventurers'][s]=e
# buddies
for path,v in M['buddies'].items():
    s=path.rsplit('/',1)[1];out['buddies'][s]={'icon':save(v['img'],f'buddy/{s}.webp',256,256,GWA+'/buddies/'+s)}
for n in ['Arya','Elwin']:missing.append({'category':'buddy icon','name':n,'reason':'not listed on GameWith.ai buddies (new buddy); not found on GameWith JP list'})
# monsters
for path,v in M['monsters'].items():
    s=path.rsplit('/',1)[1];out['monsters'][s]={'n':v['name'],'icon':save(v['img'],f'monster/{s}.webp',256,256,GWA+'/monsters/'+s)}
# visages
for path,v in M['visages'].items():
    s=path.rsplit('/',1)[1];out['visages'][s]={'n':v['name'].replace('Visage: ',''),'img':save(v['img'],f'visage/{s}.webp',256,256,GWA+'/visages/'+s)}
# weapon types
for path,v in M['weapons'].items():
    if '/weapons/type/' in path:
        s=path.rsplit('/',1)[1];out['weaponTypes'][s]=save(v['img'],f'weapon/type/{s}.webp',256,256,GWA+'/weapons/type/'+s)
# weapons: every weapon GameWith lists (icons for tables + build weapons)
PW=json.load(open(f'{W}/payload_weapons.json'))
for n,u in PW.items():
    s=slug(n);out['weapons'][n]=save(u,f'weapon/{s}.webp',256,256,GWA+'/weapons/'+s)
# gifts
PI=json.load(open(f'{W}/payload_items.json'))
GIFT_ALIAS={'Adventurers Charm':"Adventurer's Charm",'Thick Cut Tail':'Thick-Cut Tail'}
gifts=json.load(open(f'{SITE}/media.json'))['gifts']
for g in gifts:
    n=GIFT_ALIAS.get(g['n'],g['n'])
    if n in PI:out['gifts'][g['n']]=save(PI[n],f'gift/{slug(g["n"])}.webp',256,256,GWA+'/items/'+slug(n))
    else:missing.append({'category':'gift icon','name':g['n'],'reason':'no item with this name on GameWith.ai items'})
# armor icons from assets/images/12-armor (already cut from GameWith), 256 webp
man=json.load(open(f'{R}/assets/images/12-armor/manifest-armor.json'))
for st in man['sets']:
    for p in st['pieces']:
        if not p['icon']:continue
        rel=f"armor/{st['slug']}/{p['part']}.webp";im=Image.open(f"{R}/assets/images/{p['icon']}");os.makedirs(os.path.dirname(f'{IMG}/{rel}'),exist_ok=True)
        im.save(f'{IMG}/{rel}','WEBP',quality=82,method=6)
        credits['img/'+rel]={'source':p['source'],'page':st['source'],'w':im.width,'h':im.height,'note':'cut out from GameWith icon'+(f" (upscaled from {p['icon_upscaled_from']}px)" if p.get('icon_upscaled_from') else '')}
        out['armor'][f"{st['slug']}-{p['part']}"]='img/'+rel
# not available on any source we can use
for n in ['Rose Queen','Regal Vow','Silken Dancer','Flying Feather','Flower-Bearing Plume']:
    missing.append({'category':'outfit / skin','name':n,'reason':'no outfit pages on GameWith.ai; not found on GameWith JP pages checked'})
missing.append({'category':'skill icons','name':'all armor skills','reason':'GameWith.ai skills pages have no skill icons'})
json.dump(credits,open(f'{IMG}/credits.json','w'),ensure_ascii=False,indent=1)
json.dump(out,open(f'{SITE}/real.json','w'),ensure_ascii=False,indent=1)
open(f'{SITE}/real.js','w').write('window.REAL='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';')
json.dump(missing,open(f'{IMG}/missing.json','w'),ensure_ascii=False,indent=1)
print({k:len(v) for k,v in out.items()},'missing',len(missing),'credits',len(credits))
