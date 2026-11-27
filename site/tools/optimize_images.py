import os,json,glob,sys
from PIL import Image
SRC='/home/user/mhojc/assets/images';OUT='/home/user/mhojc/site/img'
def save(src,dst,w,q=80,keep_alpha=False):
    im=Image.open(os.path.join(SRC,src))
    if keep_alpha:im=im.convert('RGBA')
    else:im=im.convert('RGB')
    if im.width>w:im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    p=os.path.join(OUT,dst);os.makedirs(os.path.dirname(p),exist_ok=True)
    im.save(p,'WEBP',quality=q,method=6);return dst
m=json.load(open(SRC+'/manifest.json'));media={'characters':[],'buddies':[],'gifts':[],'outfits':[],'guides':{},'banners':[],'buddyCards':[],'weaponIcons':{},'monsters':{}}
for c in m['characters']:
    i=c['id'];media['characters'].append({'id':i,'n':c['name'],'r':c['rarity'],'w':c['weapon'],'el':c['element'],
     'p':save(c['portrait'],f'char/{i}-p.webp',420),'f':save(c['full'],f'char/{i}-f.webp',900),
     'build':save(c['build_card'],f'char/{i}-build.webp',1400,78),'info':save(c['info_card'],f'char/{i}-info.webp',1100,78)})
for b in m['buddies']:
    i=b['name'].lower();media['buddies'].append({'n':b['name'],'note':b.get('note',''),'img':save(b['file'],f'buddy/{i}.webp',900)})
for g in m['gifts']:
    i=os.path.basename(g['file'])[:-4];media['gifts'].append({'n':g['name'],'img':save(g['file'],f'gift/{i}.webp',128,85,True)})
for f in m['outfits']:
    f=f['file'] if isinstance(f,dict) else f
    if f.endswith('-full.jpg'):continue
    i=os.path.basename(f)[:-4];media['outfits'].append({'id':i,'img':save(f,f'outfit/{i}.webp',1000),'full':save(f.replace('.jpg','-full.jpg'),f'outfit/{i}-full.webp',1600,78) if os.path.exists(SRC+'/'+f.replace('.jpg','-full.jpg')) else None})
for f in m['guide_freya_stylia']:
    i=os.path.basename(f)[:-4];who='freya' if any(x in i for x in['freya','arya']) else 'stylia' if any(x in i for x in['stylia','elwin']) else 'both'
    media['guides'].setdefault(who,[]).append(save(f,f'guide/{i}.webp',1200,78))
for f in m['banners']:
    i=os.path.basename(f)[:-4];media['banners'].append({'id':i,'img':save(f,f'banner/{i}.webp',1200)})
for b in m['buddies_all']:
    i=os.path.basename(b['file'])[:-4];media['buddyCards'].append({'id':i,'img':save(b['file'],f'buddy/cards/{i}.webp',360,82,True)})
for w in m['weapon_icons']:
    i=os.path.basename(w['file'])[:-4].replace('weapon-','');media['weaponIcons'][i]=save(w['file'],f'weapon/{i}.webp',128,85,True)
for mo in m['monsters']:
    media['monsters'][mo['id']]={'n':mo['name'],'icon':save(mo['icon'],f'monster/{mo["id"]}.webp',192,85,True),'card':save(mo['info_card'],f'monster/card/{mo["id"]}.webp',900,80)}
json.dump(media,open('/home/user/mhojc/site/media.json','w'),ensure_ascii=False,indent=1)
open('/home/user/mhojc/site/media.js','w').write('window.MEDIA='+json.dumps(media,ensure_ascii=False,separators=(',',':'))+';')
print('ok')
