import re,html,json
def links(fn,prefix):
    s=open(fn,encoding='utf-8').read();s=s[s.find('<main'):] if '<main' in s else s
    out={}
    for m in re.finditer(r'<a[^>]*href="(/monster-hunter-outlanders/en/'+prefix+r'/[^"#?]+)"[^>]*>(.*?)</a>',s,re.S):
        inner=m.group(2);im=re.search(r'<img[^>]*src="([^"]+)"',inner)
        txt=html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',inner))).strip()
        if im and m.group(1) not in out:out[m.group(1)]={'img':im.group(1),'name':txt}
    return out
R={k:links(f'html/{k}.html',k) for k in ['adventurers','buddies','monsters','visages','weapons','items']}
json.dump(R,open('maps.json','w'),indent=1,ensure_ascii=False)
for k,v in R.items():print(k,len(v))
print([v['name'] for v in R['adventurers'].values()])
print([v['name'] for v in R['monsters'].values()])
print([k for k,v in R['items'].items() if any(x in v['name'] for x in ['Carving','Pearl','Amber','Badge','Charm'])])
