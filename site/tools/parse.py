import re,json,sys,os
R=sys.argv[1]
L=lambda f:[x.strip() for x in open(os.path.join(R,f),encoding='utf-8').read().split('\n') if x.strip()]
out={}
# ---------- skills ----------
a=L('mhoutlandersbuild.com_skills.txt')
i=a.index('skills',a.index('Search skills, effects or armour')-0) if False else 0
st=[k for k,x in enumerate(a) if x=='Lv']
skills=[];k=a.index('Search skills, effects or armour')+4
while k<len(a):
    # name, jp, desc?, then Lv blocks
    if k+2<len(a) and re.search(r'[぀-ヿ一-鿿]',a[k+1]) and not re.search(r'[぀-ヿ一-鿿]',a[k]):
        name=a[k];jp=a[k+1];k+=2;desc=''
        if a[k]!='Lv':desc=a[k];k+=1
        lv=[]
        while k<len(a) and a[k]=='Lv':
            lv.append(a[k+2]);k+=3
        src=[]
        if k<len(a) and a[k]=='From':
            k+=1
            while k<len(a) and a[k].endswith('Set'):
                src.append(a[k]);k+=1
        skills.append(dict(n=name,jp=jp,d=desc,lv=lv,src=src))
    else:k+=1
out['skills']=skills
# ---------- armor ----------
a=L('mhoutlandersbuild.com_armor.txt')
sets=[];SL={'Head':'head','Chest':'chest','Arms':'arms','Waist':'waist','Legs':'legs'}
idx=[k for k,x in enumerate(a) if x=='Set skill']
for j,k in enumerate(idx):
    # back: name, 'Rarity x to y', 'Defense', N
    b=k-1;mon=None
    while not a[b].startswith('Rarity '):b-=1
    name=a[b-1];rar=a[b];de=a[b+2]
    if a[b+3]=='Forged from':mon=a[b+4]
    m=re.match(r', (\d+) pieces',a[k+1]);need=int(m.group(1))
    sk=a[k+2];eff=a[k+3]
    end=idx[j+1]-8 if j+1<len(idx) else len(a)
    pieces=[];p=k+4
    while p<end:
        if a[p] in SL and p+1<end and a[p+1]==', defense':
            pn=a[p-1];slot=SL[a[p]];d=int(a[p+2]);q=p+3;s=[]
            while a[q]!='Stats and materials by rarity':
                mm=re.match(r'(.+) Lv(\d+)$',a[q]);
                if mm:s.append([mm.group(1),int(mm.group(2))])
                q+=1
            # rarity table rows: rarity, name, def, skills, materials
            rows=[];q+=3
            while q<end and a[q] in('Rarity',):q+=1
            pieces.append(dict(n=pn,slot=slot,d=d,s=s));p=q
        else:p+=1
    rr=re.findall(r'\d+',rar)
    sets.append(dict(n=name,r=int(rr[-1]),rmin=int(rr[0]),def_=int(de),m=mon,bonus=dict(n=sk,p=need,d=eff),pieces=pieces))
out['sets']=sets
# ---------- weapons ----------
W={'great-sword':'Great Sword','long-sword':'Long Sword','dual-blades':'Dual Blades','hammer':'Hammer','lance':'Lance','heavy-bowgun':'Heavy Bowgun','bow':'Bow','charge-blade':'Charge Blade'}
weps=[]
for slug,tn in W.items():
    a=L(f'w_{slug}.txt')
    for k,x in enumerate(a):
        if x=='Attack' and a[k-2]=='At rarity':
            # walk back to name: line before 'Rarity ...'
            b=k-3
            while not a[b].startswith('Rarity '):b-=1
            nm=a[b-1];rr=re.findall(r'\d+',a[b])
            mon=None;nc=False
            for z in range(b,k):
                if a[z]=='Forged from':mon=a[z+1]
                if a[z]=='Not craftable':nc=True
            atk=int(a[k+1]) if a[k+1].isdigit() else None;el=None;ev=0;aff=0;sh=None;z=k+2
            while a[z]!='Stats, upgrades and materials':
                if a[z]=='Element':
                    mm=re.match(r'(\D+) (\d+)',a[z+1])
                    if mm:el=mm.group(1).strip();ev=int(mm.group(2))
                if a[z]=='Affinity':
                    try: aff=float(a[z+1].rstrip('%'))
                    except: aff=None
                if a[z]=='Sharpness':sh=a[z+1]
                z+=1
            weps.append(dict(t=tn,n=nm,r=int(a[k-1]),rmin=int(rr[0]),atk=atk,el=el,ev=ev,aff=aff,sh=sh,m=mon,nc=nc))
out['weapons']=weps
# ---------- weakness ----------
a=L('m_weak.txt');MK={'◎':3,'○':2,'△':1,'✕':0}
k=a.index('Weak points (cut / blunt / shot)')+1;mons=[]
while k<len(a):
    if a[k] not in MK and k+2<len(a) and (a[k+1] in MK or a[k+2] in MK) and not a[k].startswith(('Weak','Very','Effective','No effect')):
        nm=a[k];cl='' if a[k+1] in MK else a[k+1];vals=[];z=k+1 if a[k+1] in MK else k+2
        while a[z] in MK:vals.append(MK[a[z]]);z+=2
        wp=a[z];mons.append(dict(n=nm,cls=cl,w=vals,wp=wp));k=z+1
    else:
        if mons and a[k] in('All weapons','Related'):break
        k+=1
out['monsters']=mons
json.dump(out,open(os.path.join(R,'..','data.json'),'w'),ensure_ascii=False,indent=0)
print(len(skills),len(sets),sum(len(s['pieces']) for s in sets),len(weps),len(mons))
