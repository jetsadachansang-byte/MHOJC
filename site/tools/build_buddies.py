"""Update site/media.(json|js) and assets/images/manifest.json with buddy names from
assets/images/09-buddies-all/buddies.json (after tools/match_buddies.py --apply)."""
import json,os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
B=json.load(open(f'{R}/assets/images/09-buddies-all/buddies.json',encoding='utf-8'))
RO={'SSR':0,'SR':1,'R':2};TO={'Assault':0,'Disruptor':1,'Support':2}
cards=[]
for b in B['buddies']:
    f=b.get('file') or ''
    if not f.startswith('09-buddies-all/'):continue
    img=f"img/buddy/cards/{b['slug']}.webp"
    assert os.path.exists(f'{R}/site/{img}'),img
    cards.append({'id':b['slug'],'n':b['name'],'r':b['rarity'],'t':b['type'],'sp':b['species'],'boost':b.get('adventurer_boost') or '','img':img,'page':b.get('page')})
cards.sort(key=lambda c:(RO.get(c['r'],9),TO.get(c['t'],9),c['n']))
m=json.load(open(f'{R}/site/media.json',encoding='utf-8'));m['buddyCards']=cards
json.dump(m,open(f'{R}/site/media.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
open(f'{R}/site/media.js','w',encoding='utf-8').write('window.MEDIA='+json.dumps(m,ensure_ascii=False,separators=(',',':'))+';')
man=json.load(open(f'{R}/assets/images/manifest.json',encoding='utf-8'))
man['buddies_all']=[{'file':'09-buddies-all/'+c['id']+'.png','name':c['n'],'slug':c['id'],'rarity':c['r'],'type':c['t'],'species':c['sp']} for c in cards]
json.dump(man,open(f'{R}/assets/images/manifest.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(cards),'buddy cards')
