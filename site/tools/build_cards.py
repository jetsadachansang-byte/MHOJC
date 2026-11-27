"""Bundle site/data/*.json (transcribed from the old image cards) into site/cards.js (window.CARDS)."""
import json,os,glob
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
C={'adv':{},'build':{},'guide':[],'mon':json.load(open(f'{S}/data/monster_cards.json'))}
for f in sorted(glob.glob(f'{S}/data/adv/*.json')):d=json.load(open(f));C['adv'][d['id']]=d
for f in sorted(glob.glob(f'{S}/data/build/*.json')):d=json.load(open(f));C['build'][d['id']]=d
for f in sorted(glob.glob(f'{S}/data/guide/*.json')):C['guide'].append(json.load(open(f)))
RP=[(' (Gamerch: +5/10/15%)',' (บางแหล่ง: +5/10/15%)'),(' (Gamerch)',''),('GameWith JP แนะนำ','แนะนำ'),('GameWith JP: ',''),
 ('บิลเดียวกับที่ GameWith JP ลงให้ Madelyn','บิลเดียวกับของ Madelyn'),('GameWith JP ยังไม่ลงบิลเฉพาะของ Haze','ยังไม่มีบิลเฉพาะของ Haze'),
 ('จากหน้ารวมบิล Dual Blades ของ GameWith JP (ธาตุสายฟ้า)','บิล Dual Blades ธาตุสายฟ้า'),('ฝั่งขวาเป็นบิล Dual Blades ธาตุสายฟ้าจากหน้ารวมอาวุธ','ฝั่งขวาเป็นบิล Dual Blades ธาตุสายฟ้า'),
 ('ที่มา: mhobuilds',''),('mhohub 15 วิ · Gamerch 25 วิ','15 หรือ 25 วิ'),('\n⚠ Gamerch ไม่ได้ลงสกิลนี้',''),
 ('BUILD จาก MHOBUILDS (ระดับ R11)','BUILD (ระดับ R11)'),('\nGamerch ก็แนะนำ Luminous Durandal (Fire) เป็นตัวท็อป',''),
 ('VISAGE (การ์ด) จาก GAMERCH','VISAGE (การ์ด)'),('ทีมแนะนำ (LDPLAYER)','ทีมแนะนำ'),(' (Gamerch เขียน +5% / 10% / 15%)',' (บางแหล่งเขียน +5% / 10% / 15%)'),
 ('GameWith.ai: ถึง Lv.60 · Game8: จากเควสรายวัน (ยังไม่ตรงกัน)','ถึง Lv.60 หรือจากเควสรายวัน (ยังไม่ยืนยัน)')]
def clean(x):
    if isinstance(x,str):
        for a,b in RP:x=x.replace(a,b)
        return x
    if isinstance(x,dict):return {k:clean(v) for k,v in x.items() if k not in('source','footer','skills_src','insights_src','visage_src')}
    if isinstance(x,list):return [clean(v) for v in x]
    return x
C=clean(C)
open(f'{S}/cards.js','w').write('window.CARDS='+json.dumps(C,ensure_ascii=False,separators=(',',':'))+';')
print({k:len(v) for k,v in C.items()})
