"""Build site/data/monster_cards.json: the 38 monster info cards as data.
Weakness / weak point / item values come from GameWith.ai monster pages (identical to the cards, checked);
rank and the notes lines (status inflicted, breakable parts, areas) are copied from the original cards (GameWith, 4 Nov 2026)."""
import json,sys,os
W=sys.argv[1];OUT=os.path.join(os.path.dirname(__file__),'..','data','monster_cards.json')
gw=json.load(open(os.path.join(W,'gw_monsters.json')))
PART={'Head':'หัว','Left Wing':'ปีกซ้าย','Right Wing':'ปีกขวา','Wings':'ปีก','Tail':'หาง','Forelegs':'ขาหน้า','Hind Legs':'ขาหลัง','Belly':'ท้อง','Body':'ลำตัว','Throat Pouch':'ถุงคอ','Photophore':'อวัยวะเรืองแสง','Left Foreleg':'ขาหน้าซ้าย','Right Foreleg':'ขาหน้าขวา'}
STATE={'Normal':'ปกติ','Mud':'มีโคลน'}
TR={'Effective':'ได้ผล','Ineffective':'ไม่ได้ผล','Large':'ใหญ่','Small':'เล็ก','None':'ไม่มี'}
# copied from the cards: rank | status inflicted | breakable parts | areas
CARD={
'anjanath':('★3–★9','ไฟลุก','หัว, ขาหลัง, หาง','ทั้ง 5 พื้นที่'),
'barroth':('★2–★9','น้ำเกาะ','หัว, ขาหน้า, ขาหลัง, หาง','Desert Oasis, Golden Expanse'),
'black-diablos':('ไม่ระบุ','ไม่มี','หัว, ลำตัว, หาง','Desert Oasis'),
'diablos':('★9','ไม่มี','หัว, ลำตัว, หาง','Desert Oasis'),
'great-girros':('★2–★9','อัมพาต','หัว, ขาหน้า, หาง','Muddy Swamp'),
'great-jagras':('★1–★9','ไม่มี','หัว, ขาหน้า, ลำตัว','Outlands, Muddy Swamp'),
'jyuratodus':('★2–★9','น้ำเกาะ','หัว, ลำตัว, หาง, ครีบ','Desert Oasis, Golden Expanse, Outlands'),
'kulu-ya-ku':('★1–★9','ไฟลุก','หัว, ขาหน้า','Desert Oasis, Golden Expanse, Outlands, Muddy Swamp'),
'kushala-daora':('ไม่ระบุ','ไฟลุก','หัว, ปีก, หาง','Golden Expanse, Outlands, Muddy Swamp'),
'legiana':('ไม่ระบุ','น้ำแข็งเกาะ','หัว, ปีก, ลำตัว, หาง','Muddy Swamp, Mistwood'),
'odogaron':('★9','เลือดออก','หัว, ขาหน้า, ขาหลัง, หาง','ไม่ระบุ'),
'paolumu':('ไม่ระบุ','ไม่มี','อก, ปีก, ลำตัว, หาง','Muddy Swamp, Mistwood'),
'pink-rathian':('ไม่ระบุ','พิษ, ไฟลุก','หัว, ปีก, ลำตัว, หาง','ทั้ง 5 พื้นที่'),
'pukei-pukei':('★1–★9','พิษ, พิษร้าย','หัว, ปีก, ลำตัว, หาง','ทั้ง 5 พื้นที่'),
'radiant-anjanath':('★5–★9','ไฟลุก','หัว, ขาหลัง, หาง','ทั้ง 5 พื้นที่'),
'radiant-barroth':('★6–★10','น้ำเกาะ','หัว, ขาหน้า, ขาหลัง, หาง','Desert Oasis, Golden Expanse'),
'radiant-black-diablos':('ไม่ระบุ','ไม่มี','หัว, ลำตัว, หาง','Desert Oasis'),
'radiant-diablos':('ไม่ระบุ','ไม่มี','หัว, ลำตัว, หาง','Desert Oasis'),
'radiant-great-girros':('★9','อัมพาต','หัว, ขาหน้า, หาง','Muddy Swamp'),
'radiant-great-jagras':('★4–★9','ไม่มี','หัว, ขาหน้า, ลำตัว','Outlands, Muddy Swamp, Mistwood'),
'radiant-jyuratodus':('★7–★9','น้ำเกาะ','หัว, ลำตัว, หาง, ครีบ','Desert Oasis'),
'radiant-kulu-ya-ku':('★6–★9','ไฟลุก','หัว, ขาหน้า','Desert Oasis, Golden Expanse, Outlands, Muddy Swamp'),
'radiant-legiana':('ไม่ระบุ','น้ำแข็งเกาะ','หัว, ปีก, ลำตัว, หาง','Muddy Swamp, Mistwood'),
'radiant-odogaron':('ไม่ระบุ','เลือดออก','หัว, ขาหน้า, ขาหลัง, หาง','ไม่ระบุ'),
'radiant-paolumu':('ไม่ระบุ','ไม่มี','อก, ปีก, ลำตัว, หาง','Muddy Swamp, Mistwood'),
'radiant-pink-rathian':('ไม่ระบุ','พิษ, พิษร้าย, ไฟลุก','หัว, ปีก, ลำตัว, หาง','Desert Oasis, Golden Expanse, Outlands, Muddy Swamp'),
'radiant-pukei-pukei':('★4–★9','พิษ','หัว, ปีก, ลำตัว, หาง','Desert Oasis, Golden Expanse, Outlands, Muddy Swamp'),
'radiant-radobaan':('ไม่ระบุ','ไม่มี','ขากรรไกร, ลำตัวด้านข้าง, หาง','Desert Oasis'),
'radiant-rathalos':('ไม่ระบุ','พิษ, ไฟลุก','หัว, ปีก, ลำตัว, หาง','ทั้ง 5 พื้นที่'),
'radiant-rathian':('★3–★9','พิษ, ไฟลุก','หัว, ปีก, ลำตัว, หาง','Desert Oasis, Golden Expanse, Muddy Swamp, Mistwood'),
'radiant-tobi-kadachi':('★9','สายฟ้าช็อต','หัว, ขาหน้า, ลำตัว, หาง','Outlands, Mistwood'),
'radiant-tzitzi-ya-ku':('ไม่ระบุ','ไม่มี','หัว','Muddy Swamp'),
'radobaan':('★9','ไม่มี','ขากรรไกร, ลำตัวด้านข้าง, หาง','Desert Oasis'),
'rathalos':('★8–★9','พิษ, ไฟลุก','หัว, ปีก, ลำตัว, หาง','ทั้ง 5 พื้นที่'),
'rathian':('★7–★9','พิษ, ไฟลุก','หัว, ปีก, ลำตัว, หาง','ทั้ง 5 พื้นที่'),
'ruger-aidal':('ไม่ระบุ','ไฟลุก, มึน','หัว, ขาหน้า, ขาหลัง, ปีก, หาง, ลำตัว','ไม่ระบุ'),
'tobi-kadachi':('★5–★9','สายฟ้าช็อต','หัว, ขาหน้า, ลำตัว, หาง','Outlands, Mistwood'),
'tzitzi-ya-ku':('★10','ไม่มี','หัว','Muddy Swamp'),
}
EL=['Fire','Water','Thunder','Ice','Dragon'];ST=['Poison','Sleep','Paralyzed','Blast','Stun']
def val(v):return v if isinstance(v,int) else max(x[1] for x in v)
def tpart(n):
    if ' (' in n:b,s=n[:-1].split(' (');return f'{PART[b]} ({STATE.get(s,s)})'
    return PART[n]
out={}
for k,(rank,inf,brk,area) in CARD.items():
    g=gw[k];el={e:val(g['el'][e]) for e in EL};st={s:val(g['st'][s]) for s in ST}
    parts=[[tpart(p[0])]+p[1:] for p in g['parts']]
    aim=max(parts,key=lambda p:sum(p[1:]))[0] if parts else ''
    out[k]={'n':g['n'],'cls':g['cls'] if g['cls']!='Radiant' else None,'rank':rank,'el':el,'st':st,'parts':parts,'aim':aim,
      'items':{x:TR.get(g['tr'].get(x,''),g['tr'].get(x,'')) for x in ['Flash Pod','Pitfall Trap','Screamer Pod']},
      'beh':{'คำราม':TR.get(g['tr'].get('Roar','None'),'ไม่มี'),'แผ่นดินไหว':TR.get(g['tr'].get('Tremor','None'),'ไม่มี'),'แรงลม':TR.get(g['tr'].get('Wind Pressure','None'),'ไม่มี')},
      'inflicts':inf,'breakable':brk,'area':area}
# base class for radiant
for k,v in out.items():
    if v['cls'] is None:
        base=out.get(k.replace('radiant-',''));v['cls']=base['cls'] if base else ''
        v['radiant']=True
json.dump(out,open(OUT,'w'),ensure_ascii=False,indent=1)
print(len(out));print(json.dumps(out['barroth'],ensure_ascii=False));print(out['tobi-kadachi']['aim'],out['great-jagras']['aim'],out['diablos']['aim'],out['ruger-aidal']['aim'],out['paolumu']['aim'])
