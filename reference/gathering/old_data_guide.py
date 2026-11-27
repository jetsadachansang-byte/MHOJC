import base64,os
D=os.path.dirname(os.path.abspath(__file__))
def b64(p): return 'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
def ic(n): return b64(f'{D}/icons/{n}.png')
BERRY='Nulberry'
T={'P':('PLANT','#5fb85a','🌿','จุดเก็บพืช'),'W':('WOOD','#c98a4a','🪵','จุดเก็บไม้'),'O':('ORE','#7aa7d8','⛏','จุดเก็บแร่')}
MAPS=[
('GL','GIANTWOOD LOCALE','#3f9a4e',[
 ('P1','P','Outlands','Honey & Mushroom Area',[('Chillshroom',9),('Moonlit Mushroom',3),('Honey',16),('Parashroom',12)]),
 ('P2','P','Muddy Swamp','Honey & Mushroom Area',[('Parashroom',16),('Honey',16),('Nitroshroom',8)]),
 ('P3','P','Mistwood','Plant Resource Area',[('Hot Pepper',12),(BERRY,12),('Sleep Herb',8)]),
 ('P4','P','Outlands','Local Specialty Area',[('Fine Honeyfruit',6),('Exotic Honeyfruit',2),('Sunbloom',15),('Sunkissed Grass',5),('Island Specialty Rice',9),('Exquisite Island Rice',3)]),
 ('W1','W','Muddy Swamp','Tree Resource Area',[('Hardwood',15),('Ironwood',5)]),
 ('W2','W','Outlands','Tree Resource Area',[('Hardwood',15),('Ironwood',5)]),
 ('O1','O','Outlands','Mineral & Fossil Area',[('Monster Bone S',12),('Ancient Bone',4),('Iron Ore',18),('Machalite Ore',6),('ORANGE',40)]),
 ('O2','O','Outlands','Mineral & Fossil Area',[('Monster Bone S',9),('Ancient Bone',3),('Iron Ore',21),('Machalite Ore',7),('ORANGE',40)]),
 ('O3','O','Muddy Swamp','Mineral & Fossil Area',[('Monster Bone S',12),('Ancient Bone',4),('Iron Ore',18),('Machalite Ore',6),('ORANGE',40)]),
]),
('SP','SEARING PLAINS','#d98a1f',[
 ('P5','P','Desert Oasis','Honey & Mushroom Area',[('Chillshroom',16),('Honey',16),('Parashroom',8)]),
 ('P6','P','Golden Expanse','Honey & Mushroom Area',[('Chillshroom',12),('Honey',16),('Parashroom',12)]),
 ('P7','P','Golden Expanse','Plant Resource Area',[('Herb',16),('Sleep Herb',8),('Dustbush',12)]),
 ('W3','W','Desert Oasis','Tree Resource Area',[('Hardwood',21),('Ironwood',7)]),
 ('W4','W','Desert Oasis','Tree Resource Area',[('Hardwood',15),('Ironwood',5)]),
 ('O4','O','Golden Expanse','Mineral & Fossil Area',[('Monster Bone S',9),('Boulder Bone',3),('Iron Ore',21),('Earth Crystal',7),('ORANGE',40)]),
 ('O5','O','Golden Expanse','Mineral & Fossil Area',[('Monster Bone S',9),('Boulder Bone',3),('Iron Ore',21),('Earth Crystal',7),('ORANGE',40)]),
]),
('RA','ROTFALL ABYSS','#7b54c9',[
 ('P8','P','Luminant Lakelands','Local Specialty Area',[('Heavenberry',4),('Underground Fruit',12)]),
 ('P9','P','Luminant Lakelands','Local Specialty Area',[('Heavenberry',4),('Underground Fruit',12)]),
 ('P10','P','Luminant Lakelands','Honey & Mushroom Area',[('Nitroshroom',12),('Honey',16),('Parashroom',12)]),
 ('W5','W','Luminant Lakelands','Tree Resource Area',[('Hardwood',36),('Ironwood',12)]),
 ('W6','W','Luminant Lakelands','Tree Resource Area',[('Hardwood',33),('Ironwood',11)]),
 ('O6','O','Gloomshade Gorge','Mineral & Fossil Area',[('Monster Bone S',12),('Charred Bone',4),('Iron Ore',18),('Dragonite Ore',6),('ORANGE',40)]),
 ('O7','O','Gloomshade Gorge','Mineral & Fossil Area',[('Monster Bone S',9),('Charred Bone',3),('Iron Ore',21),('Dragonite Ore',7),('ORANGE',40)]),
]),
('GA','GRAND ARCHIPELAGO','#1f9bb0',[
 ('P11','P','Saltthorn Dunes','Honey & Mushroom Area',[('Nitroshroom',12),('Honey',16),('Parashroom',12)]),
 ('P12','P','Spore Isle','Honey & Mushroom Area',[('Nitroshroom',12),('Honey',16),('Parashroom',12)]),
 ('P13','P','Saltthorn Dunes','Plant Resource Area',[('Honey',8),('Herb',16),(BERRY,12),('Sleep Herb',4)]),
 ('P14','P','Spore Isle','Plant Resource Area',[('Herb',16),('Antidote Herb',12),('Sleep Herb',12),('Light Pearl',3),('Platinum Pearl',1)]),
 ('P15','P','Saltthorn Dunes','Local Specialty Area',[('Fine Honeyfruit',9),('Exotic Honeyfruit',3),('Super Abalone',9),('Violet Abalone',3),('Light Pearl',12),('Platinum Pearl',4)]),
 ('W7','W','Spore Isle','Tree Resource Area',[('Hardwood',18),('Ironwood',6)]),
 ('W8','W','Spore Isle','Tree Resource Area',[('Hardwood',18),('Ironwood',6)]),
 ('O8','O','Spore Isle','Mineral & Fossil Area',[('Monster Bone S',12),('Coral Bone',4),('Iron Ore',18),('Coral Crystal',6),('ORANGE',40)]),
 ('O9','O','Spore Isle','Mineral & Fossil Area',[('Monster Bone S',9),('Coral Bone',3),('Iron Ore',21),('Coral Crystal',7),('ORANGE',40)]),
]),
]
NOICON=set()
def item(n,q):
    nm='Radiantite Crystal' if n=='ORANGE' else n
    im='<div class="noic">ไม่มี<br>ไอคอน</div>' if n in NOICON else f'<img src="{ic(n)}">'
    return f'<div class="it">{im}<div><div class="in">{nm}</div><div class="iq">×{q}</div></div></div>'
def card(i,s,col):
    k,t,area,atype,items=s;tn,tc,te,tt=T[t]
    cols=3 if len(items)>4 else 2
    return f'''<div class="cd"><div class="mp{' sm' if cols==3 else ''}"><img src="{b64(f'{D}/clean/{k}.png')}"><span class="no" style="background:{col}">{i:02d}</span><span class="ty" style="background:{tc}">{te} {tn}</span></div>
<div class="bd"><div class="ar">{area or tt}</div><div class="at">{atype}</div><div class="its c{cols}">{''.join(item(*x) for x in items)}</div></div></div>'''
CSS='''*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;background:radial-gradient(ellipse at 50% 0,#2b2519,#14110c 72%);font-family:Inter,Loma,sans-serif;color:#efe6d2;padding:30px 30px 22px;display:flex;flex-direction:column}
.hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:12px}.k{font:700 14px Inter;letter-spacing:4px;color:#c9a24a}
h1{font:900 52px/1 'Inter Display';letter-spacing:-.5px}h1 small{font:700 24px Loma;color:#cdbb92;margin-left:12px;letter-spacing:0}
.pg{font:800 16px Inter;color:#f0d48a;border:2px solid #6b5527;border-radius:12px;padding:6px 12px}
.leg{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}.leg span{font:600 14px Loma;display:flex;align-items:center;gap:6px;background:#221d14;border:1px solid #4a3d22;border-radius:20px;padding:5px 12px 5px 6px}.leg b{font:800 12px Inter;color:#111;border-radius:12px;padding:3px 8px}
.ft{margin-top:18px}.gr{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.cd{background:#1e1a13;border:1px solid #4a3d22;border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.mp{position:relative;height:318px;flex:none}.mp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.no{position:absolute;top:10px;left:10px;font:900 22px 'Inter Display';color:#fff;border-radius:9px;padding:3px 8px;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.ty{position:absolute;bottom:10px;left:10px;font:800 15px Inter;letter-spacing:1px;color:#15110a;border-radius:8px;padding:3px 8px}
.bd{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column}
.ar{font:800 24px/1.15 Inter;color:#f3dfa4}.at{font:500 15px Inter;color:#b9ab8a;margin:3px 0 10px}
.its{display:grid;gap:6px 8px;align-content:start}.its.c2{grid-template-columns:1fr 1fr}.its.c3{grid-template-columns:1fr 1fr 1fr}
.it{display:flex;align-items:center;gap:6px;background:#2a241a;border-radius:10px;padding:4px 6px;min-width:0}
.it img{width:52px;height:52px;border-radius:10px;flex:none}.c3 .it{flex-direction:column;text-align:center;gap:2px;padding:4px 3px}.c3 .it img{width:48px;height:48px}
.in{font:700 14px/1.15 Inter;color:#efe6d2}.in:lang(th){font-family:Loma}.uc{font:600 13px/1.2 Loma;color:#ffb36b}.noic{width:40px;height:40px;border-radius:8px;flex:none;border:1.5px dashed #6b5a35;font:9.5px/1.15 Loma;color:#8f7d55;display:flex;align-items:center;justify-content:center;text-align:center}.c3 .uc{font:600 13px/1.2 Loma;color:#ffb36b}.noic{width:38px;height:38px}.iq{font:900 19px 'Inter Display';color:#ffd36b}
.ft{display:flex;justify-content:space-between;font:14px Loma;color:#9c8e6c;margin-top:12px;padding-top:9px;border-top:1px dashed #4a3d22}
.ft b{font:800 14px Inter;color:#c9a24a;letter-spacing:1px}.mp.sm{height:318px}.zb{background:linear-gradient(135deg,#2c2416,#1b170f);border:1px solid #6b5527;border-radius:14px;padding:12px 16px;margin-bottom:16px}
.zt{font:16px Loma;color:#e6dcc4;margin-bottom:9px}.zt b{color:#ffd36b;font-family:Inter}
.zr{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.zr span{background:#2a241a;border-radius:10px;padding:7px 6px;text-align:center;font:700 13px Inter;color:#cdbb92}
.zr b{display:block;font:900 22px 'Inter Display';color:#ffd36b;margin-top:2px}.zr i{display:block;font:600 12px Loma;font-style:normal;color:#9c8e6c}
.tip{grid-column:span 1;background:linear-gradient(135deg,#2c2416,#1b170f);border:1px solid #6b5527;border-radius:16px;padding:22px 26px;display:flex;flex-direction:column;justify-content:center;gap:12px}
.tip h3{font:800 15px Inter;letter-spacing:3px;color:#f0d48a}.tip p{font:18px/1.55 Loma;color:#e6dcc4}.tip p b{color:#ffd36b}'''
TIP='<div class="tip"><h3>HOW IT WORKS</h3><p>ของจะได้<b>ทุก 12 ชม.</b> ตามจำนวนในการ์ด แต่<b>ไม่เข้ากระเป๋าเอง</b> ต้องกดเก็บจาก Pouch หรือ Map → จัดการสิ่งก่อสร้าง</p><p><b>Radiantite Crystal</b> แปลงเป็น Zenny อัตโนมัติ ชิ้นละ <b>100 Zenny</b> × โบนัส Proof of Mastery (ดูแถบด้านบน)</p><p>วางได้ประเภทละ 1 ตัวต่อแมพ อัป Watchtower แล้วเพิ่มเป็น 2 ตัว · ยิ่งวางชิดจุดเก็บ ผลผลิตยิ่งเพิ่ม</p></div>'
os.makedirs(f'{D}/h',exist_ok=True)
import glob
for f in glob.glob(f'{D}/h/*.html'): os.remove(f)
for p,(code,name,col,spots) in enumerate(MAPS,1):
  n=4 if len(spots)<=8 else 6
  chunks=[spots[i:i+n] for i in range(0,len(spots),n)]
  for c,ch in enumerate(chunks):
    off=c*n
    cards=''.join(card(off+i,s,col) for i,s in enumerate(ch,1))+(TIP if len(ch)%2==1 else '')
    star=''
    pg=f'{c+1}/{len(chunks)}'
    html=f'''<!doctype html><meta charset="utf-8"><style>{CSS}</style>
<div class="hd"><div><div class="k">MH OUTLANDERS · GATHERER SPOTS</div><h1 style="color:{col}">{name}<small>จุดวางที่เก็บของ</small></h1></div><div class="pg">{pg}</div></div>
<div class="leg"><span><b style="background:#5fb85a">🌿 PLANT</b>Plant Gatherer</span><span><b style="background:#c98a4a">🪵 WOOD</b>Wood Gatherer</span><span><b style="background:#7aa7d8">⛏ ORE</b>Ore Gatherer</span><span>×จำนวน = ของที่ได้ต่อรอบ (ทุก 12 ชม.)</span></div>
<div class="zb"><div class="zt">💰 <b>Radiantite Crystal</b> = ชิ้นละ <b>100 Zenny</b> × โบนัส Proof of Mastery</div><div class="zr"><span>Seasoned Master<b>120%</b><i>120 / ชิ้น</i></span><span>Hunting Master<b>150%</b><i>150 / ชิ้น</i></span><span>Fabled Master<b>200%</b><i>200 / ชิ้น</i></span><span>Legendary Traveler<b>250%</b><i>250 / ชิ้น</i></span><span>Apex Traveler<b>300%</b><i>300 / ชิ้น</i></span></div></div>
<div class="gr">{cards}</div>
<div class="ft"><span>วงแดง = จุดวาง{star}</span><b>JC GAMESERVICE</b></div>'''
    open(f'{D}/h/{p}-{code.lower()}-{c+1}.html','w').write(html)
