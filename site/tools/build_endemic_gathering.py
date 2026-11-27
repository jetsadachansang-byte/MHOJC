"""Build site/data/endemic.json, site/data/gathering.json, site/data/eg_conflicts.json and icons.
Source: GameWith.ai EN (fetched 27 Nov 2026). Arg 1 = work dir with el.json, mats_detail.json, gwi/, gwm/.
Icons: reference/ first (checked against GameWith), GameWith when missing or blurry."""
import json,os,sys,re
from PIL import Image
W=sys.argv[1];S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');REF=os.path.join(S,'..','reference')
GW='https://gamewith.ai/monster-hunter-outlanders/en/'
MAPS=[('GL','Giantwood Locale'),('SP','Searing Plains'),('RA','Rotfall Abyss'),('GA','Grand Archipelago')]
MK={n:k for k,n in MAPS}
cred=json.load(open(f'{S}/img/credits.json'))
def webp(src,rel,source,page,note=None):
    im=Image.open(src).convert('RGBA');im.thumbnail((128,128));im.save(f'{S}/{rel}','WEBP',quality=90,method=6)
    cred[rel]={'source':source,'page':page,'w':im.width,'h':im.height,**({'note':note} if note else {})}
    return rel
# ---------- endemic ----------
WHEN={'Any time':'ทุกเวลา','Day and Dusk':'กลางวัน – เย็น','Dusk and Night':'เย็น – กลางคืน','Night':'กลางคืน','Night only':'กลางคืนเท่านั้น','Day':'กลางวัน','Dawn':'รุ่งเช้า',
 'Any time (more likely at Night)':'ทุกเวลา (เจอบ่อยตอนกลางคืน)','Day and Dusk during Dust Storms':'กลางวัน – เย็น ตอนพายุฝุ่น (Dust Storm)',
 'Dawn, Day and Dusk (more likely in Rain)':'รุ่งเช้า – เย็น (เจอบ่อยตอนฝนตก)','Day and Dusk during Strong Winds':'กลางวัน – เย็น ตอนลมแรง (Strong Winds)',
 'Day and Dusk during Thunderstorms':'กลางวัน – เย็น ตอนพายุฝนฟ้าคะนอง (Thunderstorm)','Any time except in clear weather':'ทุกเวลา ยกเว้นตอนฟ้าใส',
 'Night, in bad weather':'กลางคืน ตอนอากาศแย่','Dusk and Night, except in Clear weather':'เย็น – กลางคืน ยกเว้นตอนฟ้าใส',
 'Night (often seen during Sandstorms or Ultraviolet Mist)':'กลางคืน (เจอบ่อยตอน Sandstorm หรือ Ultraviolet Mist)','Any time (more likely at Dusk in bad weather)':'ทุกเวลา (เจอบ่อยตอนเย็นที่อากาศแย่)',
 'Night, except in Clear weather':'กลางคืน ยกเว้นตอนฟ้าใส','Dusk (rarely seen in Clear weather)':'เย็น (ตอนฟ้าใสเจอยาก)','Day and Dusk during Radiant Mist':'กลางวัน – เย็น ตอน Radiant Mist'}
EFF={'Restores 50 HP':'ฟื้นฟู HP 50','Releases a powder that restores HP over time':'ปล่อยผงที่ฟื้นฟู HP ต่อเนื่อง','Emits a flash that leaves monsters Dazed':'ปล่อยแสงแฟลช ทำให้มอนสเตอร์มึน (Dazed)',
 'Explodes, leaving large monsters Staggered':'ระเบิด ทำให้มอนสเตอร์ใหญ่เสียหลัก (Staggered)','Releases paralytic gas that Paralyzes large monsters':'ปล่อยแก๊สทำให้มอนสเตอร์ใหญ่เป็นอัมพาต (Paralyzed)',
 'Releases sleeping gas that puts large monsters to Sleep':'ปล่อยแก๊สทำให้มอนสเตอร์ใหญ่หลับ (Sleep)'}
REQ=lambda r:re.sub(r'^Use 10 (.+)\.$',r'ใช้ \1 ครบ 10 ครั้ง',re.sub(r'^Capture rare endemic life: (.+)\.$',r'จับสัตว์ท้องถิ่นหายาก \1',r))
el=json.load(open(f'{W}/el.json'));IDX=json.load(open(f'{W}/oldidx.json'));E=[];conf=[]
for e in el:
    maps=[MK[x.strip()] for x in (e['region'] or '').split('/') if x.strip()]
    aq=e['type']=='Aquatic Life'
    cat='aquatic' if aq else ('hunt' if e['effect'] else 'life')
    use=[];src=[e['source']]
    if e['bait']:use.append(f"ตกปลา ใช้เหยื่อ {e['bait']}")
    if e['effect']:use.append('ใช้ในสนามล่า')
    ben=[]
    if e['effect']:ben.append(EFF[e['effect']])
    if e['uses']:
        for u in e['uses']:
            if u.startswith('Fish dish'):ben.append('ใช้เป็นวัตถุดิบปลาในเมนูอาหารปลา (ใช้ปลาตัวไหนก็ได้ที่ระดับความหายากตรงตามที่เมนูต้องการ)')
            m=re.search(r'Research Points \((\d+) each\)',u)
            if m:ben.append(f'นำไปหลอม (Meld) เป็น Research Points ได้ตัวละ {m.group(1)} (ปลาแลกได้คุ้มกว่าแร่หรือพืช)')
    if e['n']=='Lusterwasp':ben.append('ใช้อัปเลเวล Watchtower (ปลดล็อกที่วาง Gatherer เพิ่ม)');src.append(GW+'articles/gathering-guide')
    ach=[]
    if e['ach']:
        a=e['ach'];a=a[a.index('Rewards')+1:]
        # name, requirement, Custom Title, title, Items, item, ×, n
        while len(a)>=8:
            ach.append({'n':a[0],'req':REQ(a[1]),'title':a[3],'item':f'{a[5]} ×{a[7]}'});a=a[8:]
    ic=f'{REF}/endemic-life/icons/{IDX[e["n"]]:02d}.png'
    img=webp(ic,f'img/endemic/{e["slug"]}.webp','reference/endemic-life/icons (ตรวจตรงกับไอคอน GameWith.ai แล้ว)',e['source'])
    E.append({'id':e['slug'],'n':e['n'],'img':img,'type':cat,'type_en':e['type'],'maps':maps,'when':WHEN.get(e['when']) if e['when'] else None,
      'how':' · '.join(use) or None,'effect':' · '.join(ben) or None,'rewards':ach or None,'size':e['size'],'source':src[0] if len(src)==1 else src})
    if e['when'] and e['when'] not in WHEN:conf.append({'item':e['n'],'issue':'untranslated time','value':e['when']})
# old reference compare (endemic)
oldsrc=open(f'{REF}/endemic-life/old_data_gen.py',encoding='utf-8').read()
OLDM={'GL':'GL','SP':'SP','RA':'RA','GA':'GA'}
changes=[]
for n,maps in re.findall(r"^\(\d+,'([^']+)',(A3|\[[^\]]*\])",oldsrc,flags=re.M):
    om=['GL','SP','RA'] if maps=='A3' else re.findall(r"'(\w\w)'",maps)
    new=next((x for x in E if x['n']==n),None)
    if new and sorted(om)!=sorted(new['maps']):changes.append({'item':n,'field':'maps','old':om,'new':new['maps']})
for a,n,b,g,maps,bait in re.findall(r"^\((\d+),'([^']+)',(\d+|None),(?:'([^']+)'|None),(A3|\[[^\]]*\]),'([^']*)'\)",oldsrc,flags=re.M):
    om=['GL','SP','RA'] if maps=='A3' else re.findall(r"'(\w\w)'",maps)
    for nm in [n,g]:
        new=next((x for x in E if x['n']==nm),None) if nm else None
        if new and sorted(om)!=sorted(new['maps']):changes.append({'item':nm,'field':'maps','old':om,'new':new['maps']})
    newb=next((x for x in el if x['n']==n),{}).get('bait')
    changes.append({'item':n,'field':'bait','old':bait,'new':newb}) if newb and bait!=newb else None
json.dump({'maps':[{'id':k,'n':n} for k,n in MAPS],'types':{'hunt':'ใช้ในการล่า','life':'สัตว์ท้องถิ่นทั่วไป','aquatic':'สัตว์น้ำ (ตกปลา)'},'items':E,
  'source':GW+'endemic-life','updated':'2026-11-27'},open(f'{S}/data/endemic.json','w'),ensure_ascii=False,indent=1)
print('endemic',len(E))
# ---------- gathering ----------
M=json.load(open(f'{W}/mats_detail.json'))
CAT={'Crafting Material':'วัตถุดิบผสมยา','Local Specialty':'ของพิเศษท้องถิ่น','Bones':'กระดูก','Ore':'แร่/กระดูก (เหมือง)','Gathering':'ไม้','Specialty Goods':'ของพิเศษ (Specialty Goods)'}
AREA={'Plant Resource Area':'จุดเก็บพืช','Local Specialty Area':'จุดเก็บของพิเศษท้องถิ่น','Honey & Mushroom Area':'จุดเก็บน้ำผึ้งและเห็ด','Mineral & Fossil Area':'จุดขุดแร่และฟอสซิล','Tree Resource Area':'จุดเก็บไม้','Resource Center':'ซื้อที่ Resource Center (หมู่บ้าน Kulune ด้วย Zenny จำนวนจำกัด)','Gathering':'เก็บได้ในสนาม'}
USE={'Herb':'ผสม Potion','Antidote Herb':'ผสม Antidote','Sleep Herb':'ผสม Tranq Launcher (ยาสลบ)','Chillshroom':'ผสม Cool Drink','Hot Pepper':'ผสม Hot Drink',
 'Parashroom':'ผสม Tranq Launcher (ยาสลบ)','Honey':'ผสมกับ Potion เป็น Mega Potion','Nitroshroom':'วัตถุดิบผสม (ตามคำอธิบายในเกม)','Dustbush':'ผสม Dustproof Potion','Nulberry':'ใช้รักษาสถานะผิดปกติหลายอย่าง',
 'Hardwood':'สร้าง Field Craft (Wind Platform, Zip Line, Catapult, Camp, Gatherer ทั้ง 3 แบบ, Scoutfly Cage) · เครื่องมือ (ขวาน, พลั่ว, เบ็ด) · Expansion · หลอมเป็น Research Points ได้ชิ้นละ 2',
 'Ironwood':'Advanced Expansion (×2) และ Deluxe Expansion (×6)',
 'Iron Ore':'คราฟต์/อัปเกรดอาวุธและเกราะ · Camp, Iron Axe, Iron Pickaxe, Iron Fishing Rod, Intermediate Expansion',
 'Machalite Ore':'คราฟต์/อัปเกรดอาวุธและเกราะ · Fine Iron Axe, Fine Iron Pickaxe, Fine Fishing Rod, Advanced/Deluxe Expansion · หลอมเป็น Research Points ได้ชิ้นละ 8',
 'Ancient Bone':'คราฟต์/อัปเกรดอาวุธ · หลอมเป็น Research Points ได้ชิ้นละ 8','Earth Crystal':'คราฟต์/อัปเกรดอาวุธและเกราะ · หลอมเป็น Research Points ได้ชิ้นละ 8',
 'Boulder Bone':'หลอมเป็น Research Points ได้ชิ้นละ 8','Monster Bone S':'คราฟต์/อัปเกรดอาวุธและเกราะ',
 'Exquisite Island Rice':'เก็บครบ 50 ปลดล็อกเมนู Rou Jia Mo (ลดดาเมจที่ได้รับ 6%)','Exotic Honeyfruit':'เก็บครบ 50 ปลดล็อกเมนู Summer Tofu Pudding (ฮีลแรงขึ้น 16%)',
 'Dragonbloom':'เก็บครบ 75 ปลดล็อกเมนู Lava Cocoa Cake (ฮีลแรงขึ้น 24%)','Heavenberry':'เก็บครบ 75 ปลดล็อกเมนู Crispy Spicy Tofu (ดาเมจ +20%)'}
USRC={'Hardwood':GW+'articles/how-to-farm-wood','Ironwood':GW+'articles/how-to-farm-wood','Iron Ore':GW+'articles/how-to-farm-ore-and-bones','Machalite Ore':GW+'articles/how-to-farm-ore-and-bones',
 'Ancient Bone':GW+'articles/how-to-farm-ore-and-bones','Earth Crystal':GW+'articles/how-to-farm-ore-and-bones','Boulder Bone':GW+'articles/how-to-farm-ore-and-bones',
 'Exquisite Island Rice':GW+'articles/meals-guide','Exotic Honeyfruit':GW+'articles/meals-guide','Dragonbloom':GW+'articles/meals-guide','Heavenberry':GW+'articles/meals-guide'}
BLURRY={'Heavenberry'}
mats=[]
for x in M:
    how=[];maps=None;areas=[]
    for h in x['how']:
        a,_,mp=h.partition(' - ');areas.append(a)
        if mp:maps=[MK[mp]]
        how.append(AREA.get(a,a)+(f' ({mp} เท่านั้น)' if mp else ''))
    ref=f'{REF}/gathering/icons/{x["n"]}.png'
    if os.path.exists(ref) and x['n'] not in BLURRY:img=webp(ref,f'img/material/{x["slug"]}.webp','reference/gathering/icons (ตรวจตรงกับไอคอน GameWith.ai แล้ว)',GW+'items/'+x['slug'])
    else:img=webp(f'{W}/gwm/{x["slug"]}.png',f'img/material/{x["slug"]}.webp',x['img'],GW+'items/'+x['slug'])
    src=[GW+'items/'+x['slug']]+([USRC[x['n']]] if x['n'] in USRC else [])
    mats.append({'id':x['slug'],'n':x['n'],'img':img,'cat':CAT[x['cat']],'cat_en':x['cat'],'rarity':None,'areas':[a for a in areas if a not in('Resource Center',)],
      'maps':maps,'how':how,'use':USE.get(x['n']),'weapons':len(x['weapons']),'armor':len(x['armor']),'gear':[g[0] for g in x['weapons']+x['armor']],
      'source':src[0] if len(src)==1 else src})
SPOT=GW+'articles/gathering-spot-locations'
AREAS={'GL':[('Muddy Swamp',1,1,1,1),('Mistwood',2,2,1,1),('Outlands',3,1,1,3)],'SP':[('Golden Expanse',3,2,1,1),('Desert Oasis',2,2,2,2)],'RA':[('Luminant Lakelands',2,0,1,1),('Gloomshade Gorge',0,1,1,1)]}
ROUTE={'GL':'HTPLTLHPTLPPTHPPLT','SP':'PLTPLTPTPHLPHHL','RA':'TLHTPHP'}
TK={'P':'Plant Resource Area','L':'Local Specialty Area','H':'Honey & Mushroom Area','T':'Tree Resource Area'}
gmaps=[]
for k,n in MAPS:
    ex=[m['n'] for m in mats if m['maps']==[k]]
    d={'id':k,'n':n,'exclusive':ex,'source':[SPOT,GW+'articles/how-to-farm-ore-and-bones']}
    if k in AREAS:
        d['areas']=[{'n':a,'Plant Resource Area':p,'Local Specialty Area':l,'Honey & Mushroom Area':h,'Tree Resource Area':t,'total':p+l+h+t} for a,p,l,h,t in AREAS[k]]
        d['route']=[TK[c] for c in ROUTE[k]]
    else:d['note']='ยังไม่มีข้อมูลจุดเก็บพืช/ไม้/ของพิเศษของแมพนี้ในแหล่งข้อมูล (หน้าจุดเก็บของ GameWith ครอบคลุม 3 แมพ ณ 10 พ.ย. 2026) ยืนยันได้เฉพาะแร่ที่มีแค่แมพนี้'
    gmaps.append(d)
RA=[{'type':'Plant Resource Area','th':AREA['Plant Resource Area'],'gatherer':'Plant Gatherer'},{'type':'Local Specialty Area','th':AREA['Local Specialty Area'],'gatherer':'Plant Gatherer'},
    {'type':'Honey & Mushroom Area','th':AREA['Honey & Mushroom Area'],'gatherer':'Plant Gatherer'},{'type':'Mineral & Fossil Area','th':AREA['Mineral & Fossil Area'],'gatherer':'Ore Gatherer (ได้ Zenny ด้วย)'},
    {'type':'Tree Resource Area','th':AREA['Tree Resource Area'],'gatherer':'Wood Gatherer'}]
for r in RA:r['materials']=[m['n'] for m in mats if r['type'] in m['areas']]
GA_=GW+'articles/gathering-guide'
gatherers={'unlock':'ปลดล็อกหลังเควสต์สตอรี่บทที่ 2 “Support from the Workshop” (ได้ทั้ง Plant, Wood และ Ore Gatherer)','cost':'สร้างอย่างละ Hardwood ×2',
 'cycle':'เก็บของให้อัตโนมัติทุกวัน กดรับได้จากกระเป๋าหรือหน้าจัดการสิ่งก่อสร้างบนแผนที่ ไม่ต้องเดินไปที่จุด',
 'limit':'เริ่มต้นวางได้อย่างละ 1 · Plant Gatherer ใช้โควตาร่วมกันทั้งจุดพืช จุดของพิเศษ และจุดน้ำผึ้ง/เห็ด',
 'watchtower':[{'lv':5,'lusterwasp':18,'bonus':'Ore Gatherer +1'},{'lv':7,'lusterwasp':34,'bonus':'Wood Gatherer +1'},{'lv':9,'lusterwasp':54,'bonus':'Plant Gatherer +1'}],
 'watchtower_note':'อัปเลเวล Watchtower ด้วย Lusterwasp กดที่ Watchtower บนแผนที่ได้เลย แต่ละแมพมีเลเวลของตัวเอง ใช้ร่วมกันทุก Watchtower ในแมพนั้น',
 'examples':[{'map':'Searing Plains','area':'Desert Oasis','gatherer':'Wood Gatherer','per_day':{'Hardwood':45,'Ironwood':15},'source':GW+'articles/how-to-farm-wood'},
   {'map':'Giantwood Locale','area':'Outlands','gatherer':'Ore Gatherer','per_day':{'Iron Ore':12,'Machalite Ore':4,'Monster Bone S':18,'Ancient Bone':6},'source':GW+'articles/how-to-farm-ore-and-bones'}],
 'examples_note':'ตัวเลขเป็นตัวอย่างที่แหล่งข้อมูลเห็นในเกม ในเกมบอกว่าขยับตำแหน่งที่วางแล้วจำนวนเปลี่ยนได้ จึงขึ้นกับจุดที่วาง',
 'tools':'ขวาน/พลั่วไม่จำเป็นต้องมี แต่ช่วยเพิ่มโอกาสได้ไม้/แร่คุณภาพสูง: Wooden (เพิ่มเล็กน้อย) → Iron (เพิ่ม) → Fine Iron (เพิ่มมาก)',
 'geo':'สกิลเกราะ Geo Expert: Lv1 เก็บกระดูกเพิ่ม 1 ครั้ง · Lv2 เพิ่มที่จุดของพิเศษ · Lv3 เพิ่มที่จุดแร่',
 'source':[GA_,GW+'articles/how-to-farm-wood',GW+'articles/how-to-farm-ore-and-bones']}
special=[{'n':'Heavenberry','text':'เก็บได้ที่จุดเก็บของพิเศษท้องถิ่น (Local Specialty Area) ของ Rotfall Abyss เท่านั้น ตามข้อมูลจุดเก็บ Rotfall Abyss มีจุดนี้ 1 จุด อยู่ที่ Gloomshade Gorge · ซื้อได้ที่ Resource Center · เก็บครบ 75 ปลดล็อก Crispy Spicy Tofu (ดาเมจ +20%)','respawn':None,'source':[GW+'items/heavenberry',SPOT,GW+'articles/meals-guide']},
  {'n':'Honey','text':'เก็บได้ที่จุดเก็บพืช (Plant Resource Area) · ใช้ผสมกับ Potion เป็น Mega Potion · ซื้อได้ที่ Resource Center','respawn':None,'source':[GW+'items/honey',GA_]}]
G={'maps':gmaps,'resource_areas':RA,'materials':mats,'gatherers':gatherers,'special':special,'updated':'2026-11-27','source':[GA_,SPOT]}
json.dump(G,open(f'{S}/data/gathering.json','w'),ensure_ascii=False,indent=1)
json.dump(cred,open(f'{S}/img/credits.json','w'),ensure_ascii=False,indent=1)
json.dump({'endemic_changes_vs_reference':changes},open(f'{W}/eg_changes.json','w'),ensure_ascii=False,indent=1)
print('materials',len(mats),'maps',len(gmaps));print(len(changes),'endemic changes')
