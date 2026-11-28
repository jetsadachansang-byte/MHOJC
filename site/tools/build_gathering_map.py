"""Add point-by-point map data to site/data/gathering.json.
Spots: GameWith.ai EN interactive map marker data (static JS chunk; generated from GameWith JP map tool, fetched 2026-11-10)
       matched with the numbered route on /articles/gathering-spot-locations.
Map images: GameWith map tiles (zoom 3, 8x8 x 256px) stitched, Japanese place labels removed by inpainting.
Arg 1 = work dir (chunks/markers.json, chunks/mapcfg.json, mapclean_*.png, articles_gathering-spot-locations.html)."""
import json,os,re,sys
from PIL import Image
W=sys.argv[1];S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
GW='https://gamewith.ai/monster-hunter-outlanders/en/'
SPOT=GW+'articles/gathering-spot-locations';MAPU=GW+'interactive/map'
G=json.load(open(f'{S}/data/gathering.json',encoding='utf-8'));cred=json.load(open(f'{S}/img/credits.json'))
cfg=json.load(open(f'{W}/chunks/mapcfg.json'))
ID2K={'giantwood-locale':'GL','searing-plains':'SP','rotfall-abyss':'RA'}
TYPE={'plant-spot':('plant','Plant Resource Area'),'specialty-spot':('specialty','Local Specialty Area'),'mushroom-spot':('honey','Honey & Mushroom Area'),'tree-spot':('tree','Tree Resource Area')}
SUB=lambda s:' '.join(w.capitalize() for w in s.split('-'))
# route numbers from the article
t=open(f'{W}/articles_gathering-spot-locations.html',encoding='utf-8').read().replace('\\"','"')
num={i:int(n) for i,n in re.findall(r'\{"id":"(\d+)","number":(\d+),"image"',t)}
pins=[p for p in cfg['pins'] if p['type'] in TYPE]
mats=G['materials'];MB={m['n']:m for m in mats}
def drops(k,area):  # materials this area type gives on this map (per GameWith area lists + map-only notes)
    return [m['n'] for m in mats if area in m['areas'] and (not m['maps'] or k in m['maps'])]
for m in mats:m['found_in']=[];m['gatherer']=[]
for gm in G['maps']:
    k=gm['id'];aid={v:kk for kk,v in ID2K.items()}.get(k)
    if not aid:gm['image']=None;gm['spots']=[];continue
    src=f'{W}/mapclean_{aid}.png';im=Image.open(src).convert('RGBA');im.thumbnail((1600,1600))
    rel=f'img/map/{aid}.webp';im.save(f'{S}/{rel}','WEBP',quality=82,method=6)
    a=next(x for x in cfg['areas'] if x['id']==aid)
    cred[rel]={'source':a['tileUrl'].replace('{z}','3').replace('{y}','*').replace('{x}','*'),'page':MAPU,'w':im.width,'h':im.height,'note':'stitched zoom-3 tiles; Japanese place labels removed (inpainted)'}
    gm['slug']=aid;gm['image']=rel
    sp=[]
    for p in pins:
        if p['area']!=aid:continue
        ty,area=TYPE[p['type']];lat,lng=p['loc'];no=num.get(p['id'])
        d=drops(k,area)
        s={'id':f"{k.lower()}-{no:02d}" if no else f"{k.lower()}-p{p['id']}",'no':no,'pin':p['id'],'area':SUB(p.get('subArea','')),'type':ty,'type_en':area,
           'x':round(lng/180*100,2),'y':round(-lat/180*100,2),'drops':[{'item':n,'qty':'ยังไม่มีข้อมูล'} for n in d],
           'rare':[n for n in d if MB[n]['maps']==[k]],'source':[MAPU,SPOT]+[MB[n]['source'] if isinstance(MB[n]['source'],str) else MB[n]['source'][0] for n in d[:0]]}
        sp.append(s)
        for n in d:MB[n]['found_in'].append(s['id'])
    sp.sort(key=lambda s:s['no'] or 99);gm['spots']=sp
    # check counts vs article table
    for ar in gm.get('areas',[]):
        for tt in ['Plant Resource Area','Local Specialty Area','Honey & Mushroom Area','Tree Resource Area']:
            c=sum(1 for s in sp if s['area']==ar['n'] and s['type_en']==tt)
            if c!=ar[tt]:print('COUNT MISMATCH',k,ar['n'],tt,c,ar[tt])
# gatherer spots (only confirmed numbers)
GS=[]
for x in G['gatherers']['examples']:
    k=next(m['id'] for m in G['maps'] if m['n']==x['map']);g=x['gatherer'].split()[0]
    GS.append({'map':k,'area':x['area'],'gatherer':g,'per_cycle':x['per_day'],'cycle':'ต่อวัน','cycle_hours':'ยังไม่มีข้อมูล (แหล่งข้อมูลบอกว่าเก็บ “ทุกวัน”)','source':[x['source']]})
    for n in x['per_day']:MB[n]['gatherer'].append(f"{k}/{x['area']}/{g}")
G['gatherer_spots']=GS
G['map_source']={'markers':MAPU,'route':SPOT,'fetched':'2026-11-10 (ข้อมูลจุดของ GameWith)','note':'ตำแหน่งจุดอ่านจากข้อมูลแผนที่ interactive ของ GameWith.ai EN แปลงเป็น % ของรูป'}
G['spot_types']={'plant':{'th':'จุดเก็บพืช','en':'Plant Resource Area','color':'#4caf50'},'specialty':{'th':'จุดของพิเศษท้องถิ่น','en':'Local Specialty Area','color':'#e0a800'},
 'honey':{'th':'จุดน้ำผึ้ง/เห็ด','en':'Honey & Mushroom Area','color':'#c2185b'},'tree':{'th':'จุดไม้','en':'Tree Resource Area','color':'#8d5a2b'},
 'ore':{'th':'จุดแร่/กระดูก','en':'Mineral & Fossil Area','color':'#5c7cfa'},'special':{'th':'จุดไอเทมพิเศษ','en':'Special item','color':'#9c27b0'}}
json.dump(G,open(f'{S}/data/gathering.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
json.dump(cred,open(f'{S}/img/credits.json','w'),ensure_ascii=False,indent=1)
print({m['n']:len(m['spots']) for m in G['maps']},'gatherer spots',len(GS))
