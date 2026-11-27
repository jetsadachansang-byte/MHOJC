import re,html,json,sys,subprocess,time,os
def text(fn):
    s=open(fn,encoding='utf-8').read()
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S);t=re.sub(r'<[^>]+>','\n',t);t=html.unescape(t)
    return [x.strip() for x in t.split('\n') if x.strip()]
def parse(a):
    i=a.index('Elemental Weakness');mname=a[i-2];cls=a[i-1].split(' · ')[0]
    hab=a[a.index('Habitats',i)+1] if 'Habitats' in a[i:i+10] else ''
    rank=a[a.index('Rank',i)+1]
    def stars(start,keys,end):
        out={};k=start
        idx=[a.index(key,k) for key in keys]
        for n,key in enumerate(keys):
            b=idx[n];e=idx[n+1] if n+1<len(idx) else end
            seg=a[b+1:e];vals=[];state=None
            for x in seg:
                if re.fullmatch(r'\d',x):vals.append([state,int(x)]);state=None
                elif x=='—':vals.append([state,0]);state=None
                elif not x.startswith('★'):state=x
            out[key]=vals[0][1] if len(vals)==1 and vals[0][0] is None else vals
        return out
    e0=a.index('Effectiveness',i);s0=a.index('Status',e0)
    el=stars(e0,['Fire','Water','Thunder','Ice','Dragon'],s0)
    wps=a.index('Weak Points',s0)
    st=stars(s0,['Poison','Sleep','Paralyzed','Blast','Stun'],wps)
    wp0=a.index('Ammo',wps);tc=a.index('Traits & Countermeasures',wp0)
    parts=[];k=wp0+1;cur=[]
    seg=a[wp0+1:tc];name=[];nums=[]
    for x in seg:
        if re.fullmatch(r'\d',x) or x=='—':
            nums.append(int(x) if x!='—' else 0)
            if len(nums)==3:parts.append([' '.join(name).replace('( ','(').replace(' )',')')]+nums);name=[];nums=[]
        elif x.startswith('★'):pass
        else:name.append(x)
    tr={};k=tc+1
    for key in ['Flash Pod','Pitfall Trap','Screamer Pod','Roar','Tremor','Wind Pressure','Inflicts','Breakable Parts','Size']:
        if key in a[k:k+40]:j=a.index(key,k);tr[key]=a[j+1]
    return {'n':mname,'cls':cls,'hab':hab,'rank':rank,'el':el,'st':st,'parts':parts,'tr':tr}
if __name__=='__main__':
    m=json.load(open('maps.json'))['monsters'];out={}
    for path in m:
        s=path.rsplit('/',1)[1];fn=f'html/mon_{s}.html'
        if not os.path.exists(fn) or os.path.getsize(fn)<50000:
            subprocess.run(['curl','-sL','-A','Mozilla/5.0 Chrome/124','-o',fn,'https://gamewith.ai'+path]);time.sleep(0.3)
        try:out[s]=parse(text(fn))
        except Exception as e:out[s]={'error':str(e)}
    json.dump(out,open('gw_monsters.json','w'),ensure_ascii=False,indent=1)
    print(len(out),[k for k,v in out.items() if 'error' in v])
    print(json.dumps(out['rathalos'],ensure_ascii=False))
    print(json.dumps(out['radiant-rathalos'],ensure_ascii=False))
