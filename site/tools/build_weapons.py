"""Replace DB.weapons with GameWith data (data/weapons_gw.json) and write weapons_detail.js (tiers + materials)."""
import json,os,re
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
G=json.load(open(f'{S}/data/weapons_gw.json'));db=json.loads(open(f'{S}/db.js').read()[10:-1])
old={w['n']:w for w in db['weapons']}
sl=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower().replace("'",'')).strip('-')
EL={'Fire':'fire','Water':'water','Thunder':'thunder','Ice':'ice','Dragon':'dragon','Poison':'poison','Sleep':'sleep','Paralyzed':'para','Paralysis':'para','Blast':'blast'}
name2slug={v['n']:k for k,v in G.items()}
W=[];DET={}
for k,v in G.items():
    rows=v['rows'];known=[r for r in rows if r['atk'] is not None];top=known[-1] if known else rows[-1]
    el=next((r['el'] for r in rows if r['el']),None)
    base={'t':sl(v['t']),'n':v['n'],'r':top['r'],'rmin':rows[0]['r'],'rmax':rows[-1]['r'],'atk':top['atk'],'aff':top['aff'],'el':EL.get(el) if el else None,'ev':top['ev'] if el else None,'sh':top['sh'],'m':(old.get(v['n']) or {}).get('m'),'nc':False,'slug':k}
    DET[k]={'rows':rows,'mats':v['mats'],'up':name2slug.get(v['up']) if v['up'] else None,'apex':v['apex']}
    if v['apex']:
        for e in ['Fire','Water','Thunder','Ice','Dragon']:
            W.append({**base,'id':f"{base['t']}--{k}-{e.lower()}",'n':f"{v['n']} ({e})",'el':EL[e],'ev':top['ev'],'apex':True})
    else:W.append({**base,'id':f"{base['t']}--{k}"})
db['weapons']=W
open(f'{S}/db.js','w').write('window.DB='+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';')
open(f'{S}/weapons_detail.js','w').write('window.WD='+json.dumps(DET,ensure_ascii=False,separators=(',',':'))+';')
print(len(W),'weapons',os.path.getsize(f'{S}/weapons_detail.js')//1024,'KB detail')
