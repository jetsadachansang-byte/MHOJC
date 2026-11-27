"""Parse GameWith.ai weapon pages (dir of <slug>.html) -> site/data/weapons_gw.json:
stats per rarity, materials per rarity, upgraded-from chain, apex flag."""
import re,html,json,sys,os,glob
D=sys.argv[1];OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data','weapons_gw.json')
APEX={'dawnlit-joyeuse','brilliant-hippogriff','luminous-durandal','lucent-hauteclaire','scintillant-bayard','gleaming-curtana','resplendent-montauban','sonorous-olifant'}
EL={'Fire','Water','Thunder','Ice','Dragon','Poison','Sleep','Paralyzed','Paralysis','Blast'}
num=lambda x:int(x.replace(',','')) if re.fullmatch(r'[\d,]+',x) else None
out={}
for f in sorted(glob.glob(D+'/*.html')):
    slug=os.path.basename(f)[:-5];t=open(f,encoding='utf-8').read()
    img=re.search(r'src="(https://(?:assets\.gamewith\.ai|img\.gamewith\.jp)/[^"]*weapon_\d+\.(?:webp|png))"',t[t.find('<main'):])
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S);t=re.sub(r'<[^>]+>','\n',t);t=html.unescape(t)
    a=[x.strip() for x in t.split('\n') if x.strip()]
    try:i=[k for k,x in enumerate(a) if x=='Weapon List'][-1]+2
    except IndexError:continue
    name=a[i];typ=a[i+1] if a[i+1]!=name else a[i+2]
    up=a[a.index('Upgraded from')+1] if 'Upgraded from' in a else None
    # stats table
    hs=[k for k in range(len(a)-2) if a[k]=='Rarity' and a[k+1]=='Name' and a[k+2]=='Attack']
    if not hs:print('skip',slug);continue
    h=hs[0];cols=[];k=h
    while not re.fullmatch(r'\d{1,2}',a[k]):cols.append(a[k]);k+=1
    nc=len(cols)
    end=next((j for j in range(k,len(a)) if a[j].startswith('Rows with') or a[j] in('Mastery','Required Materials','Total Materials','Contents')),len(a))
    rows=[];w0=name.split()[0]
    def fl(x):
        try:return float(x.replace('%','').replace('+',''))
        except:return None
    while k<end:
        if not (re.fullmatch(r'\d{1,2}',a[k]) and k+1<end and a[k+1].split()[0]==w0):k+=1;continue
        r=int(a[k]);nm=a[k+1];j=k+2;cells=[]
        while j<end and not (re.fullmatch(r'\d{1,2}',a[j]) and j+1<end and a[j+1].split()[0]==w0):cells.append(a[j]);j+=1
        k=j;atk=num(cells[0]) if cells else None;aff=fl(cells[1]) if len(cells)>1 else None;rest=cells[2:]
        el=ev=sh=None
        if 'Element' in cols and rest:
            if rest[0] in EL:el=rest[0];ev=num(rest[1]) if len(rest)>1 else None;rest=rest[2:]
            else:ev=num(rest[0]);rest=rest[1:]
        if 'Sharpness' in cols and rest and rest[0]!='—':sh=rest[0]
        rows.append({'r':r,'n':nm,'atk':atk,'aff':aff,'el':el,'ev':ev,'sh':sh})
    # materials per rarity
    mats={};
    if 'Required Materials' in a[end-1:]:
        m0=a.index('Required Materials',end-1);m1=next((k for k in range(m0,len(a)) if a[k]=='Total Materials'),len(a))
        k=a.index('Material',m0)+1;cur=None
        while k<m1:
            if re.fullmatch(r'\d{1,2}',a[k]) and a[k+1] in('Craft','Upgrade'):cur=str(int(a[k]));mats[cur]={'kind':a[k+1],'items':[]};k+=2;continue
            if cur and k+2<m1 and a[k+1]=='×':mats[cur]['items'].append([a[k],num(a[k+2])]);k+=3;continue
            k+=1
    out[slug]={'n':name,'t':typ,'up':up,'apex':slug in APEX,'img':img.group(1) if img else None,'rows':rows,'mats':mats}
json.dump(out,open(OUT,'w'),ensure_ascii=False,separators=(',',':'))
print(len(out),'apex',sum(v['apex'] for v in out.values()),'no rows',[k for k,v in out.items() if not v['rows']][:5])
print(json.dumps(out['wyvern-blade-blood'],ensure_ascii=False)[:700]);print(json.dumps(out['luminous-durandal']['rows'][-1]))
