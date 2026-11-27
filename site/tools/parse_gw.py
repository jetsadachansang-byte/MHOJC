import re,html,json,glob,os
def lines(fn):
    s=open(fn,encoding='utf-8').read()
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S)
    t=re.sub(r'<img[^>]*src="([^"]+)"[^>]*>',lambda m:'\n[IMG '+m.group(1)+']\n',t)
    t=re.sub(r'<[^>]+>','\n',t);t=html.unescape(t);t=re.sub(r'[ \t]+',' ',t)
    return [x.strip() for x in t.split('\n') if x.strip()]
PART={'Head':'head','Chest':'chest','Arms':'arms','Waist':'waist','Legs':'legs'}
out=[]
for fn in sorted(glob.glob('html/set_*.html')):
    slug=fn[9:-5];a=lines(fn)
    i=[x for x in range(len(a)-2) if a[x]=='Armor List' and a[x+1]=='›'][-1]+2;name=a[i]
    full={}
    j=i+1
    while a[j].startswith('[IMG'):
        full[a[j+1].lower()]=a[j][5:-1];j+=2
    k=a.index('Rarity',j);rar=a[k+1]
    mon=None
    if a[k+2]=='Monster':mon=a[k+4]
    # set skill block
    ss=a.index('Set Skill',a.index('Materials by Part'))  # header list
    ss=[x for x in range(len(a)) if a[x]=='Set Skill' and a[x+2].endswith('pieces')]
    s0=ss[0];sk_name=a[s0+1];pieces=int(a[s0+2].split()[0]);m=re.match(r'(.+) \+(\d+)$',a[s0+4]);eff=a[s0+5]
    bonus={'n':sk_name,'p':pieces,'skill':m.group(1),'add':int(m.group(2)),'d':eff}
    # pieces in Stats by Part
    st=a.index('Stats by Part',s0);en=a.index('Materials by Part',st)
    ps=[];x=st+1
    while x<en:
        if a[x].startswith('[IMG') and a[x+2] in PART:
            icon=a[x][5:-1];pn=a[x+1];part=PART[a[x+2]];y=x+3
            rows=[];
            # header Rarity Name Defense Skills
            y=a.index('Skills',y)+1
            cur=None
            while y<en and not a[y].startswith('[IMG'):
                if re.fullmatch(r'\d+',a[y]) and y+2<en and re.fullmatch(r'\d+',a[y+2]):
                    cur={'r':int(a[y]),'name':a[y+1],'def':int(a[y+2]),'s':[]};rows.append(cur);y+=3;continue
                mm=re.match(r'(.+) Lv(\d+)$',a[y])
                if mm and cur:cur['s'].append([mm.group(1),int(mm.group(2))])
                y+=1
            ps.append({'part':part,'name':pn,'icon':icon,'rows':rows});x=y
        else:x+=1
    out.append({'slug':slug,'set':name,'rarity':rar,'monster':mon,'full':full,'bonus':bonus,'pieces':ps,'source':f'https://gamewith.ai/monster-hunter-outlanders/en/armor/{slug}'})
json.dump(out,open('gw_armor.json','w'),ensure_ascii=False,indent=1)
print(len(out),sum(len(o['pieces']) for o in out))
for o in out:
    if len(o['pieces'])!=5 or not o['full'] or any(not p['rows'] for p in o['pieces']):print('CHECK',o['slug'],len(o['pieces']),list(o['full']),[len(p['rows']) for p in o['pieces']])
print(json.dumps(out[0],ensure_ascii=False)[:900])
