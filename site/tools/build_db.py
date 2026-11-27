import sys,os,json,re
sys.path.insert(0,os.path.dirname(__file__))
from th import tr,SK
S=sys.argv[1]
d=json.load(open(os.path.join(S,'data.json')))
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
skills={}
for s in d['skills']+[{'n':'Muck Resistance','d':'','lv':['Reduces limits on movement speed and evasion.']}]:
    th,c,desc=SK[s['n']]
    skills[slug(s['n'])]={'en':s['n'],'th':th,'c':c,'d':desc,'lv':[tr(l) for l in s['lv']]}
sets=[];armor=[]
for st in d['sets']:
    k=slug(st['n'].replace(' Set',''))
    b=st['bonus'];m=re.match(r'^(.+?) \+(\d+)\. (.*)$',b['d'])
    sid=slug(m.group(1));assert sid in skills,sid
    sets.append({'k':k,'n':st['n'],'r':st['r'],'rmin':st['rmin'],'def':st['def_'],'m':st.get('m'),
      'b':{'n':b['n'],'p':b['p'],'s':sid,'add':int(m.group(2)),'d':tr(m.group(3))}})
    for p in st['pieces']:
        ss=[]
        for nm,lv in p['s']:
            assert slug(nm) in skills,nm;ss.append([slug(nm),lv])
        armor.append({'id':k+'-'+p['slot'],'set':k,'slot':p['slot'],'n':p['n'],'d':p['d'],'s':ss})
EL={'Fire':'fire','Water':'water','Thunder':'thunder','Ice':'ice','Dragon':'dragon','Poison':'poison','Sleep':'sleep','Paralyzed':'para','Paralysis':'para','Blast':'blast'}
weps=[];seen=set()
for w in d['weapons']:
    i=slug(w['t'])+'--'+slug(w['n'])
    if i in seen:i+='-2'
    seen.add(i)
    el=EL.get(w['el']) if w['el'] else None
    if w['el'] and not el:print('unknown el',w['el'])
    weps.append({'id':i,'t':slug(w['t']),'n':w['n'],'r':w['r'],'rmin':w['rmin'],'atk':w['atk'],'el':el,'ev':w['ev'],'aff':w['aff'],'sh':w['sh'],'m':w['m'],'nc':w['nc']})
CL={'Brute Wyvern':'วิเวิร์นดุร้าย','Flying Wyvern':'วิเวิร์นบิน','Fanged Wyvern':'วิเวิร์นเขี้ยว','Bird Wyvern':'วิเวิร์นนก','Piscine Wyvern':'วิเวิร์นปลา','Elder Dragon':'มังกรเฒ่า','Leviathan':'เลวิอาธาน','Fanged Beast':'สัตว์เขี้ยว'}
mons=[];base={m['n']:m['cls'] for m in d['monsters']}
for m in d['monsters']:
    cls=m['cls'] or ('Fanged Wyvern' if m['n']=='Odogaron' else '')
    rad=m['n'].startswith('Radiant ')
    if cls=='Radiant':cls=base.get(m['n'][8:],'')
    if cls not in CL:print('cls?',cls)
    mons.append({'k':slug(m['n']),'n':m['n'],'cls':cls,'clsTh':CL.get(cls,cls),'w':m['w'],'wp':m['wp'],'rad':rad})
db={'skills':skills,'sets':sets,'armor':armor,'weapons':weps,'monsters':mons}
js='window.DB='+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';'
open(os.path.join(S,'db.js'),'w',encoding='utf-8').write(js)
print(len(skills),len(sets),len(armor),len(weps),len(mons),'bytes',len(js.encode()))
print(sorted({w['el'] for w in weps if w['el']}), sorted({w['sh'] for w in weps if w['sh']}))
print([ (s['k'],s['m']) for s in sets][:40])
