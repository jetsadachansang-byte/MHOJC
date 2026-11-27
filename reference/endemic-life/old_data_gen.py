import os,base64,math,random
OUT=os.path.dirname(os.path.abspath(__file__))
A3=['GL','SP','RA']
# (icon index, name, maps, time, effect)  — data: GameWith.ai MHO Endemic Life
D=[
(1,'Vigorwasp',A3,'ทุกเวลา','ฟื้น HP 50'),
(0,'Giant Vigorwasp',A3,'ทุกเวลา','ปล่อยผงฟื้น HP ต่อเนื่อง'),
(2,'Flashfly',A3,'ทุกเวลา','แสงแฟลช ทำให้มอน Dazed'),
(3,'Nitrotoad',A3,'ทุกเวลา','ระเบิด มอนใหญ่ Staggered'),
(4,'Paratoad',A3,'ทุกเวลา','แก๊สทำให้มอนใหญ่ Paralyzed'),
(5,'Sleeptoad',A3,'ทุกเวลา','แก๊สทำให้มอนใหญ่ Sleep'),
(30,'Lusterwasp',['GL','SP'],'ทุกเวลา','ใช้อัป Watchtower'),
(6,'Copperwing Flutterfly',['GL'],'ทุกเวลา',''),
(7,'Nightglow Flutterfly',['GL'],'กลางคืน · ยกเว้นวันฟ้าใส',''),
(8,'Seerfly',A3,'ทุกเวลา',''),
(9,'Gloomfly',A3,'กลางคืน · ตอนอากาศแย่',''),
(10,'Broad-Eared Ghost Bat',A3,'รุ่งเช้า – เย็น · เจอบ่อยตอนฝนตก',''),
(11,'Serene Coralbird',['GL'],'ทุกเวลา',''),
(12,'Orange Moly',A3,'ทุกเวลา',''),
(13,'Clover Moly',['GL'],'กลางวัน – เย็น · ตอน Thunderstorm',''),
(14,'Titan Ant',A3,'ทุกเวลา',''),
(15,'Emperor Hopper',['GL','SP'],'กลางวัน – เย็น',''),
(16,'Hercudrome',A3,'ทุกเวลา',''),
(17,'Gold Hercudrome',['GL','SP'],'กลางคืน',''),
(40,'Viridian Hercudrome',['GL','RA'],'รุ่งเช้า',''),
(18,'Greenleaf Gekko',['GL'],'ทุกเวลา',''),
(41,'Mythozard',['GL','RA'],'ทุกเวลา · เจอบ่อยตอนกลางคืน',''),
(19,'Iron Helmcrab',['GL','SP'],'ทุกเวลา',''),
(34,'Moonlight Helmcrab',['SP','RA'],'กลางคืน · เจอบ่อยตอน Sandstorm / Ultraviolet Mist',''),
(20,'Swiftsprig Hare',['GL','SP'],'ทุกเวลา',''),
(21,'Rosyfluff Hare',['GL','SP'],'กลางวัน',''),
(22,'Woodland Wingdrake',['GL'],'ทุกเวลา',''),
(23,'Golden Wingdrake',['GL'],'ทุกเวลา · เจอบ่อยตอนกลางคืน',''),
(24,'Ashen Vulture',A3,'ทุกเวลา',''),
(25,'Blissbill',['GL','SP'],'ทุกเวลา',''),
(26,'Pearl Warbler',A3,'ทุกเวลา',''),
(27,'Phantom Jorogumo',A3,'ทุกเวลา',''),
(29,'Sludge Spider',A3,'เย็น · วันฟ้าใสเจอยาก',''),
(28,'Skimmerfish',['GL','SP'],'ทุกเวลา',''),
(31,'Ironfist Crab',['GL'],'เย็น – กลางคืน · ยกเว้นวันฟ้าใส',''),
(32,'Red-Whisker Crayfish',['GL'],'ทุกเวลา',''),
(38,'Bristly Crake',['GL'],'ทุกเวลา',''),
(39,'Downy Crake',['SP'],'ทุกเวลา',''),
(33,'Armagold Moly',['SP'],'กลางวัน – เย็น · ตอน Dust Storm',''),
(35,'Dung Beetle',['SP'],'ทุกเวลา',''),
(36,'Sand-Armored Lizard',['SP'],'ทุกเวลา',''),
(37,'Mudflat Tearbass',['SP','RA'],'ทุกเวลา · เจอบ่อยตอนเย็นที่อากาศแย่',''),
(65,'Sonic Bug',['SP'],'ทุกเวลา',''),
(66,'Witchcap Moly',['RA'],'กลางวัน – เย็น · ตอน Radiant Mist',''),
(67,'Glowring Gekko',['RA'],'กลางคืน',''),
(68,'Corrosive Helmcrab',['RA'],'ทุกเวลา',''),
(69,'Lantern Rockfish',['RA'],'ทุกเวลา',''),
(70,'Saturnian',['RA'],'ทุกเวลา',''),
(71,'Warhopper',['RA'],'ทุกเวลา',''),
(72,'Lustrous Jellyfish',['GA'],'เย็น – กลางคืน',''),
(73,'Ghostly Jellyfish',['GA'],'เย็น – กลางคืน',''),
(74,'Dapper Coralbird',['GA'],'ทุกเวลา · ยกเว้นวันฟ้าใส',''),
(75,'Evergreen Ray',['GA'],'กลางวัน – เย็น',''),
(76,'Bubbly Moly',['GA'],'กลางวัน – เย็น · ตอน Strong Winds',''),
(77,'Marine Seahorse',['GA'],'ทุกเวลา',''),
(78,'Marshal Seahorse',['GA'],'กลางคืนเท่านั้น',''),
]
# fish pairs: (icon, name, great icon, great name, maps, bait)
F=[
(42,'Scarlet Blossomfish',43,'Great Scarlet Blossomfish',['GL','SP'],'Lure'),
(44,'Whetfish',45,'Great Whetfish',A3,'Lure'),
(46,'Sushifish',47,'Great Sushifish',['GL','SP'],'Lure'),
(48,'Goldenfry',49,'Great Goldenfry',['GL','SP'],'ดังโงะเดเมคิน'),
(50,'Bubblefish',51,'Great Bubblefish',['GL','SP'],'ดังโงะเดเมคิน'),
(52,'Goldenfish',54,'Great Goldenfish',['GL','RA'],'ดังโงะทอง'),
(53,'Platinumfish',55,'Great Platinumfish',['GL'],'ดังโงะทอง'),
(56,'King Spearfish',57,'Great King Marlin',['GL'],'เหยื่อแมลงทอง'),
(58,'Gastronome Tuna',59,'Great Gastronome Tuna',A3,'เหยื่อแมลงทอง'),
(60,'Burst Arowana',62,'Great Burst Arowana',A3,'ดังโงะอโรวาน่า'),
(61,'Bomb Arowana',63,'Great Bomb Arowana',A3,'ดังโงะอโรวาน่า'),
(64,'Starrycanth',None,None,['RA'],'เหยื่อแมลงทอง'),
]
assert len(D)==56
MC={'GL':('#3f9a4e','#dff0d8','Giantwood Locale'),'SP':('#d98a1f','#fbe8c8','Searing Plains'),'RA':('#7b54c9','#e7defa','Rotfall Abyss'),'GA':('#1f9bb0','#d3f0f4','Grand Archipelago')}
def img(i):
    return f'<img src="data:image/png;base64,{base64.b64encode(open(f"{OUT}/ic/{i:02d}.png","rb").read()).decode()}">'
def chips(maps): return ''.join(f'<span class="ch"><b style="background:{MC[m][0]}"></b>{m}</span>' for m in maps)
def tint(maps):
    cs=[MC[m][1] for m in maps]
    if len(cs)==1: return cs[0]
    return 'linear-gradient(135deg,'+','.join(cs)+')'
def card(n,i,name,maps,t,eff):
    rare=t!='ทุกเวลา'
    tm=f'<div class="tm{" r" if rare else ""}"><span class="ti">{"🌙" if rare else "◷"}</span>{t}</div>'
    e=f'<div class="ef">✦ {eff}</div>' if eff else ''
    return f'''<div class="card"><div class="no">{n:02d}</div><div class="ic" style="background:{tint(maps)}">{img(i)}</div>
<div class="nm">{name}</div><div class="chs">{chips(maps)}</div>{tm}{e}</div>'''
def fcard(a,an,b,bn,maps,bait):
    g=f'<div class="arr">›</div><div class="fx"><div class="fi" style="background:{tint(maps)}">{img(b)}</div><div class="fl">ร่างใหญ่</div><div class="fn">{bn}</div></div>' if b is not None else ''
    return f'''<div class="fc"><div class="fpair"><div class="fx"><div class="fi" style="background:{tint(maps)}">{img(a)}</div><div class="fl">ปกติ</div><div class="fn">{an}</div></div>{g}</div>
<div class="fb"><div class="chs">{chips(maps)}</div><div class="bait">🎣 {bait}</div></div></div>'''
random.seed(7)
def topo():
    p=''
    for cx,cy in [(160,260),(900,1100),(980,240),(120,1180)]:
        for k in range(1,14):
            r=k*34;pts=[]
            for a in range(0,361,10):
                rr=r*(1+0.12*math.sin(math.radians(a*3)+k*.6)+0.06*math.cos(math.radians(a*5)))
                pts.append(f'{cx+rr*math.cos(math.radians(a)):.0f},{cy+rr*0.8*math.sin(math.radians(a)):.0f}')
            p+=f'<polyline points="{" ".join(pts)}"/>'
    return f'<svg class="topo" viewBox="0 0 1080 1350" preserveAspectRatio="none"><g fill="none" stroke="#8a6a35" stroke-width="1.2" opacity=".13">{p}</g></svg>'
CSS='''*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;font-family:'Angsana New',Taviraj,serif;color:#22301f;position:relative;overflow:hidden;
background:radial-gradient(ellipse at 50% 40%,#fbf5e8 0,#efe3c9 70%,#e4d3b0 100%)}
.topo{position:absolute;inset:0;width:100%;height:100%}
.wrap{position:absolute;inset:0;padding:34px 34px 26px;display:flex;flex-direction:column}
.hd{display:flex;align-items:center;gap:20px;margin-bottom:16px}
.badge{width:86px;height:86px;border-radius:50%;background:#20402c;display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 0 4px #efe3c9,0 0 0 6px #20402c}
.badge span{font:900 30px 'Angsana New',Taviraj,serif;color:#f0d48a;}
.tt{flex:1}.kick{font:700 14px 'Angsana New',Taviraj,serif;letter-spacing:4px;color:#9a7633}
h1{font:900 54px/1 'Angsana New',Taviraj,serif;color:#20402c;}h1 small{font:700 26px 'Angsana New',Taviraj,serif;color:#5b4a2c;margin-left:12px;letter-spacing:0}
.pg{font:800 16px 'Angsana New',Taviraj,serif;color:#20402c;border:2px solid #20402c;border-radius:12px;padding:8px 12px;text-align:center;line-height:1.1}.pg i{display:block;font:600 11px 'Angsana New',Taviraj,serif;font-style:normal;letter-spacing:2px;color:#9a7633}
.leg{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.leg span{display:inline-flex;align-items:center;gap:7px;background:#fffaf0cc;border:1px solid #dcc9a2;border-radius:30px;padding:5px 12px 5px 6px;font:600 14px 'Angsana New',Taviraj,serif;color:#3c3420}
.leg b{font:800 12px 'Angsana New',Taviraj,serif;color:#fff;border-radius:20px;padding:3px 8px}
.leg .t{padding-left:12px;font-family:'Angsana New',Taviraj,serif}
.grid{flex:1;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;gap:8px;min-height:0;align-content:start}
.card{position:relative;background:#fffcf5;border:1px solid #e3d4b3;border-radius:20px;padding:10px 10px;display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 8px 18px -10px rgba(90,60,20,.35)}
.no{position:absolute;top:10px;left:12px;font:800 12px 'Angsana New',Taviraj,serif;color:#b59a63;letter-spacing:1px}
.ic{width:84px;height:84px;border-radius:26px;display:flex;align-items:center;justify-content:center;margin-bottom:6px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.7)}
.ic img{width:72px;height:72px;object-fit:contain;filter:drop-shadow(0 3px 3px rgba(0,0,0,.15))}
.nm{font:800 17.5px/1.15 'Angsana New',Taviraj,serif;color:#1d2b1c;min-height:20px}
.chs{display:flex;gap:5px;justify-content:center;margin:5px 0 6px;flex-wrap:wrap}
.ch{display:inline-flex;align-items:center;gap:4px;font:700 12px 'Angsana New',Taviraj,serif;color:#4a4130;background:#f3ead7;border-radius:20px;padding:2px 8px 2px 5px}
.ch b{width:9px;height:9px;border-radius:50%}
.tm{font:500 14.5px/1.28 'Angsana New',Taviraj,serif;color:#5d6b55;text-align:center}
.card{justify-content:center}
.tm.r{color:#8a5a00;background:#fff1cf;border-radius:10px;padding:4px 8px}
.ti{font-family:'DejaVu Sans';margin-right:4px;font-weight:700}
.ef{margin-top:5px;font:500 14.5px/1.28 'Angsana New',Taviraj,serif;color:#1f6a3a;background:#e4f4e3;border-radius:10px;padding:4px 8px}
.foot{display:flex;justify-content:space-between;align-items:center;font:500 14px 'Angsana New',Taviraj,serif;color:#7a6845;margin-top:12px;padding-top:10px;border-top:1px dashed #cbb68b}
.foot b{font:800 14px 'Angsana New',Taviraj,serif;color:#20402c;letter-spacing:1px}
.fgrid{flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:9px;min-height:0}
.fc{background:#fffcf5;border:1px solid #e3d4b3;border-radius:20px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 8px 18px -10px rgba(90,60,20,.35)}
.fpair{display:flex;align-items:flex-start;justify-content:center;gap:4px}
.fx{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0}
.fx.none{align-self:center}.fx.none .fl{background:none;color:#b59a63;font-size:12px}
.fi{width:98px;height:98px;border-radius:30px;display:flex;align-items:center;justify-content:center}
.fi img{width:90px;height:90px;object-fit:contain}
.fl{font:500 11px 'Angsana New',Taviraj,serif;color:#9a7633;background:#f6ecd6;border-radius:10px;padding:1px 8px;margin:5px 0 3px}
.fn{font:800 15px/1.15 'Angsana New',Taviraj,serif;color:#1d2b1c}
.arr{font:300 38px 'Angsana New',Taviraj,serif;color:#c9b183;margin-top:30px}
.fb{display:flex;flex-direction:column;align-items:center}.fb .chs{margin:8px 0 6px}
.bait{font:500 16px 'Angsana New',Taviraj,serif;color:#0f5f6e;background:#dcf1f4;border-radius:10px;padding:3px 10px}
.note{grid-column:span 4;background:#20402c;color:#efe3c9;border-radius:20px;padding:18px 22px;font:500 16px/1.6 'Angsana New',Taviraj,serif}
.note{display:flex;gap:26px;align-items:center}.nl{flex:1}.nr{flex:1.25}.mcs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mc{display:flex;gap:10px;align-items:center;background:#2c5039;border-radius:14px;padding:10px 12px}.mc b{font:800 13px 'Angsana New',Taviraj,serif;color:#fff;border-radius:8px;padding:4px 7px}
.mn{font:600 12px 'Angsana New',Taviraj,serif;color:#c9d8bf}.mv{font:800 24px 'Angsana New',Taviraj,serif;color:#f0d48a;line-height:1.05}.mv small{font:500 13px 'Angsana New',Taviraj,serif;color:#efe3c9}
.note h3{font:800 15px 'Angsana New',Taviraj,serif;letter-spacing:3px;color:#f0d48a;margin-bottom:6px}
'''
def leg(fish=False):
    s=''.join(f'<span><b style="background:{c}">{k}</b>{n}</span>' for k,(c,_,n) in MC.items() if not(fish and k=='GA'))
    if not fish: s+='<span class="t" style="color:#8a5a00;background:#fff1cf">🌙 ต้องรอเวลา / อากาศ</span>'
    return f'<div class="leg">{s}</div>'
def page(k,T,title,th,body,fish=False):
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{topo()}<div class="wrap">
<div class="hd"><div class="badge"><span>{"AQ" if fish else "EL"}</span></div><div class="tt"><div class="kick">MONSTER HUNTER OUTLANDERS · FIELD GUIDE</div><h1>{title}<small>{th}</small></h1></div><div class="pg"><i>PAGE</i>{k}/{T}</div></div>
{leg(fish)}{body}
<div class="foot"><span>จับครั้งแรกต่อแมพ = Rutacoin 1 · แต้มสำรวจ 6 (ตัวหายาก 20){' · 🎣 = เหยื่อของตัวปกติ' if fish else ''}</span><b>JC GAMESERVICE</b></div></div></body></html>'''
os.makedirs(f'{OUT}/h4',exist_ok=True)
chunks=[D[0:20],D[20:40],D[40:56]];T=4
for p,ch in enumerate(chunks):
    base=p*20
    cards=''.join(card(base+j+1,*x) for j,x in enumerate(ch))
    if p==2:
        cnt=''.join(f'<div class="mc"><b style="background:{MC[m][0]}">{m}</b><div><div class="mn">{MC[m][2]}</div><div class="mv">{sum(m in x[2] for x in D)} <small>ชนิด</small></div></div></div>' for m in MC)
        cards+=f'<div class="note"><div class="nl"><h3>HOW TO READ</h3>◷ = เจอได้ทุกเวลา<br>🌙 = ต้องรอช่วงเวลาหรืออากาศตามที่เขียน<br>✦ = ใช้งานได้ (ตอนสู้ / อัปเกรด)<br>จุดสี = แมพที่พบ</div><div class="nr"><h3>ENDEMIC LIFE ต่อแมพ</h3><div class="mcs">{cnt}</div></div></div>'
    open(f'{OUT}/h4/{p+1:02d}.html','w').write(page(p+1,T,'ENDEMIC LIFE','สัตว์และแมลงในฉาก',f'<div class="grid">{cards}</div>'))
open(f'{OUT}/h4/04.html','w').write(page(4,T,'AQUATIC LIFE','ปลา · ปกติ › ร่างใหญ่',f'<div class="fgrid">{"".join(fcard(*x) for x in F)}</div>',True))
