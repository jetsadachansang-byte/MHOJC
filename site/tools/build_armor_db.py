"""Rebuild the armor part of site/db.js from assets/images/12-armor/manifest-armor.json (GameWith.ai data)
and make web-sized copies of the armor images in site/img/armor/.

Usage: python3 build_armor_db.py
"""
import json,os,re
from PIL import Image
R='/home/user/mhojc';SITE=R+'/site';A=R+'/assets/images/12-armor'
man=json.load(open(A+'/manifest-armor.json'))
db=json.loads(open(SITE+'/db.js').read()[len('window.DB='):-1])
SK=db['skills'];slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
# skills added by the newer GameWith data
NEW={
 'radiant-frenzy':{'en':'Radiant Frenzy','th':'คลั่งเรเดียนต์','c':'โจมตี','d':'เมื่อโดนอนุภาค Radiant ดาเมจเพิ่มขึ้นชั่วคราว แต่หลังหมดผล ดาเมจและสตามิน่าสูงสุดจะลดลงชั่วคราว',
   'lv':['ขณะโดนอนุภาค Radiant ดาเมจ +10% นาน 30 วินาที · หลังหมดผล ดาเมจ -10% และสตามิน่าสูงสุด -50 นาน 30 วินาที']},
 'unshaken-resolve':{'en':'Unshaken Resolve','th':'ใจไม่สั่นคลอน','c':'โจมตี','d':'เมื่อติดสถานะผิดปกติหรือ Radiant Frenzy ดาเมจเพิ่มขึ้นชั่วคราว และลดระยะเวลาผลเสียของ Radiant Frenzy',
   'lv':['ขณะทำงาน ดาเมจ +3% · ลดระยะเวลาผลเสียของ Radiant Frenzy 20%','ขณะทำงาน ดาเมจ +6% · ลดระยะเวลาผลเสียของ Radiant Frenzy 50%','ขณะทำงาน ดาเมจ +12% · ไม่มีผลเสียของ Radiant Frenzy']},
 'sturdy-guard':{'en':'Sturdy Guard','th':'การ์ดมั่นคง','c':'ป้องกัน','d':'การ์ดกันการโจมตีที่ปกติการ์ดไม่ได้','lv':['การ์ดกันการโจมตีที่ปกติการ์ดไม่ได้ได้']},
}
for k,v in NEW.items():SK.setdefault(k,v)
TH_BONUS={'black-diablos':'การ์ดกันการโจมตีที่ปกติการ์ดไม่ได้','radiant-baan':'ดาเมจ +3% ขณะยังมี HP สีเทาเหลืออยู่',
 'radiant-pink-rathian':NEW['radiant-frenzy']['lv'][0],'radiant-diablos':SK['battle-spirit']['lv'][0]}
old={s['k']:s for s in db['sets']}
def th_bonus(s):
    if s['slug'] in TH_BONUS:return TH_BONUS[s['slug']]
    if s['slug'] in old:return old[s['slug']]['b']['d']
    sid=slug(s['set_skill_detail']['skill']);return SK[sid]['lv'][0]
def web(src,dst,maxw,maxh,q):
    im=Image.open(src);im.thumbnail((maxw,maxh),Image.LANCZOS);os.makedirs(os.path.dirname(dst),exist_ok=True);im.save(dst,'WEBP',quality=q,method=6)
sets=[];armor=[]
for s in man['sets']:
    k=s['slug'];b=s['set_skill_detail'];rr=[int(x) for x in re.findall(r'\d+',s['rarity'])]
    full=None
    if s.get('full'):
        full=f'img/armor/{k}/full.webp';web(f"{R}/assets/images/{s['full']}",f'{SITE}/{full}',600,900,80)
    tot=sum(p['defense'] for p in s['pieces'])
    sets.append({'k':k,'n':s['set']+' Set','r':rr[-1],'rmin':rr[0],'def':tot,'m':s['monster'],'full':full,
                 'b':{'n':b['name'],'p':b['pieces'],'s':slug(b['skill']),'add':b['add'],'d':th_bonus(s)}})
    for p in s['pieces']:
        ss=[]
        for x in p['skills']:
            n,l=re.match(r'(.+) (\d+)$',x).groups();sid=slug(n)
            assert sid in SK,n;ss.append([sid,int(l)])
        icon=None
        if p['icon']:
            icon=f"img/armor/{k}/{p['part']}.webp";web(f"{R}/assets/images/{p['icon']}",f'{SITE}/{icon}',128,128,82)
        armor.append({'id':f"{k}-{p['part']}",'set':k,'slot':p['part'],'n':p['name'],'d':p['defense'],'s':ss,'icon':icon})
    assert slug(b['skill']) in SK,b['skill']
db['sets']=sets;db['armor']=armor
open(SITE+'/db.js','w',encoding='utf-8').write('window.DB='+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';')
print(len(sets),'sets',len(armor),'pieces',len(SK),'skills')
