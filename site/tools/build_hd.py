"""Build multi-size WebP images from the big files in assets/images (repo root) and write data/hd.json + img/missing.json.
Each target keeps its original path (smallest size) plus <name>@<w>.webp variants. Never upscales.
Thresholds: profile >=512, full/hero >=1200 (long side), icon >=256."""
import json,os,glob
from PIL import Image
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');A=os.path.join(S,'..','assets','images')
cred=json.load(open(f'{S}/img/credits.json'));M=json.load(open(f'{S}/media.json',encoding='utf-8'))
HD={};done=[];FALLBACK=set()
ROLE={'profile':([480,720,1440],720,'(max-width:600px) 46vw, 240px'),'full':([640,1280,1920,2560],1280,'(max-width:900px) 100vw, 640px'),
      'wide':([640,1280,1920,2560],1280,'(max-width:600px) 60vw, 480px'),'icon':([128,256,512],256,'48px'),'hero':([640,1280,1920,2560,3840],1920,'100vw')}
def make(src,dest,role,note=None):
    widths,thr,sizes=ROLE[role]
    im=Image.open(src);im=im.convert('RGBA') if im.mode in('RGBA','LA','P') else im.convert('RGB')
    W,H=im.size;ws=[w for w in widths if w<W]+[min(W,widths[-1])];ws=sorted(set(ws))
    out=[]
    for i,w in enumerate(ws):
        h=round(H*w/W);r=im.resize((w,h),Image.LANCZOS)
        p=dest if i==0 else dest.replace('.webp',f'@{w}.webp')
        os.makedirs(os.path.dirname(f'{S}/{p}'),exist_ok=True);r.save(f'{S}/{p}','WEBP',quality=82 if role!='icon' else 88,method=6)
        out.append([w,p])
    HD[dest]={'w':ws[0],'h':round(H*ws[0]/W),'set':out,'sizes':sizes,'max':max(W,H) if role!='profile' else W}
    cred[dest]=dict(cred.get(dest,{}),**{'source':os.path.relpath(src,os.path.join(S,'..')),'w':ws[0],'h':round(H*ws[0]/W),'variants':[x[1] for x in out[1:]],**({'note':note} if note else {})})
    done.append((dest,role,W,H,thr));return out
def rel(p):return p
# characters: official art from GameWith (primary source, originals in assets/images/hd/characters); repo art only as fallback
HC=f'{A}/hd/characters';HSRC=json.load(open(f'{HC}/sources.json'))
for c in M['characters']:
    i=c['id'];hs=HSRC.get(i,{})
    if os.path.exists(f'{HC}/{i}-card.png'):
        make(f'{HC}/{i}-card.png',f"img/adventurer/{i}.webp",'profile');u=hs.get('full',hs.get('card',{}))
        cred[f"img/adventurer/{i}.webp"].update(source=u.get('source'),page=u.get('page'),note='GameWith official art'+(f" crop {hs['card_crop']}" if 'card_crop' in hs else ' (card portrait)'))
    if os.path.exists(f'{HC}/{i}-full.png'):
        make(f'{HC}/{i}-full.png',f'img/adventurer/full/{i}.webp','full');c['f']=f'img/adventurer/full/{i}.webp'
        cred[f'img/adventurer/full/{i}.webp'].update(source=hs['full']['source'],page=hs['full']['page'],note='GameWith official art')
    elif os.path.exists(f'{A}/01-characters/full/{i}.jpg'):
        make(f'{A}/01-characters/full/{i}.jpg',f'img/adventurer/full/{i}.webp','full','fallback: repo art (no official full art in sources)');c['f']=f'img/adventurer/full/{i}.webp';FALLBACK.add(f'img/adventurer/full/{i}.webp')
for b in M['buddies']:
    p=f"{A}/02-buddies/{b['id']}.jpg"
    if os.path.exists(p):make(p,b['img'],'wide')
for b in M['buddyCards']:
    p=f"{A}/09-buddies-all/{b['id']}.png"
    if os.path.exists(p) and b.get('img'):make(p,b['img'],'profile')
for o in M['outfits']:
    for k in ['img','full']:
        if not o.get(k):continue
        base=os.path.basename(o[k])[:-5];p=f'{A}/04-outfits/{base}.jpg'
        if os.path.exists(p):make(p,o[k],'wide')
for t,p in M['weaponIcons'].items():
    s=f'{A}/10-weapon-icons/weapon-{t}.png'
    if os.path.exists(s):make(s,p,'icon')
for k,m in M['monsters'].items():
    s=f'{A}/11-monsters/icons/{k}.png'
    if os.path.exists(s):make(s,m['icon'],'icon')
for g in M['gifts']:
    if not g.get('img'):continue
    s=f"{A}/03-gifts/{os.path.basename(g['img'])[:-5]}.png"
    if os.path.exists(s) and Image.open(s).size[0]<=Image.open(s).size[1]*1.2:make(s,g['img'],'icon')
# hero key art
_h=Image.open(f'{A}/01-characters/hires/freya.jpg').crop((750,0,2048,1850));_tmp='/tmp/_hero_crop.png';_h.save(_tmp)
make(_tmp,'img/hero/hero.webp','hero','Freya key art cropped to the clean right part')
cred['img/hero/hero.webp']['source']='assets/images/01-characters/hires/freya.jpg (crop 750,0,2048,1850)'
# sizes for media + missing list
for d,v in HD.items():M['size'][d]=[v['w'],v['h']]
miss=[]
for d,role,W,H,thr in done:
    m=W if role=='profile' else max(W,H) if role in('full','wide','hero') else W
    if m<thr:miss.append({'img':d,'role':role,'best_px':[W,H],'need':thr,'reason':'ไฟล์ใหญ่สุดที่มีใน repo ยังไม่ถึงเกณฑ์'})
hd_set=set(HD)
def scan(pat,role,thr,why):
    for f in sorted(glob.glob(f'{S}/{pat}')):
        r=os.path.relpath(f,S)
        if '@' in r or r in hd_set:continue
        w,h=Image.open(f).size;m=w if role!='full' else max(w,h)
        if m<thr:miss.append({'img':r,'role':role,'best_px':[w,h],'need':thr,'reason':why})
scan('img/monster/*.webp','icon',256,'ไม่มีไฟล์ใหญ่ใน repo (มอนสเตอร์เล็ก) ใช้ไฟล์จาก GameWith ขนาดเดิม')
scan('img/weapon/*.webp','icon',256,'แหล่งข้อมูล (GameWith) มีแค่ขนาดนี้')
scan('img/visage/*.webp','icon',256,'แหล่งข้อมูล (GameWith) มีแค่ขนาดนี้')
scan('img/endemic/*.webp','icon',256,'ไอคอนจาก reference/GameWith มีแค่ขนาดนี้')
scan('img/material/*.webp','icon',256,'ไอคอนจาก reference/GameWith มีแค่ขนาดนี้')
scan('img/gift/*.webp','icon',256,'ไฟล์ใน repo มีแค่ขนาดนี้')
scan('img/outfit/*-exclusive.webp','full',1200,'GameWith EN มีแค่ 320x320')
scan('img/armor/*/head.webp','icon',256,'ไฟล์ใน repo มีแค่ขนาดนี้')
json.dump(M,open(f'{S}/media.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
open(f'{S}/media.js','w',encoding='utf-8').write('window.MEDIA='+json.dumps(M,ensure_ascii=False,separators=(',',':'))+';\n')
json.dump(HD,open(f'{S}/data/hd.json','w'),separators=(',',':'))
old=[x for x in json.load(open(f'{S}/img/missing.json')) if x.get('category') not in('hd-resolution','hd-fallback')]
# Rhodes now has full art from the repo pack
old=[x for x in old if not (x.get('name')=='Rhodes' and 'full art' in x.get('category',''))]
for m in miss:m['category']='hd-resolution';m['name']=m['img']
_fb=[{'category':'hd-fallback','name':d,'img':d,'role':r,'best_px':[W,H],'reason':'ใช้รูปสำรองจาก repo (assets/images) เพราะแหล่งรูปทางการถูกบล็อกจากเครือข่ายของ session หรือแหล่งข้อมูลหลักไม่มีรูปนี้'} for d,r,W,H,t in done if not d.startswith('img/adventurer/') or d in FALLBACK]
miss=miss+_fb
json.dump(old+miss,open(f'{S}/img/missing.json','w'),ensure_ascii=False,indent=1)
json.dump(cred,open(f'{S}/img/credits.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print('HD targets',len(HD),Counter(r for _,r,*_ in done));print('missing',len(miss),Counter(m['img'].split('/')[1] for m in miss))
