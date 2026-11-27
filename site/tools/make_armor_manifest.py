"""Build assets/images/12-armor/manifest-armor.json from parsed GameWith.ai set pages.

Inputs: gw_armor.json (parsed set pages), cut_log.json (image processing log), conflicts.json.
Usage: python3 make_armor_manifest.py <work_dir>
"""
import json,os,sys
W=sys.argv[1];OUT='/home/user/mhojc/assets/images/12-armor'
gw=json.load(open(os.path.join(W,'gw_armor.json')))
log=json.load(open(os.path.join(W,'cut_log.json')))
conf=json.load(open(os.path.join(W,'conflicts.json')))
cset={c['set'] for c in conf}
sets=[];missing=[];upscaled=[]
for o in gw:
    b=o['bonus'];slug=o['slug']
    item={'set':o['set'].replace(' Set',''),'slug':slug,'rarity':o['rarity'].replace('–','-'),'monster':o['monster'],
          'set_skill':f"{b['n']} ({b['p']} pieces: {b['skill']} +{b['add']})",
          'set_skill_detail':{'name':b['n'],'pieces':b['p'],'skill':b['skill'],'add':b['add'],'effect':'' if b['d']=='From' else b['d']},
          'source':o['source'],'pieces':[]}
    if o['set'] in cset:item['conflict']=True
    for p in o['pieces']:
        top=p['rows'][-1];icon=f"12-armor/{slug}/{p['part']}.png";lk=f"{slug}/{p['part']}"
        pc={'part':p['part'],'name':p['name'],'defense':top['def'],'rarity_shown':top['r'],
            'skills':[f'{n} {l}' for n,l in top['s']],'icon':icon if os.path.exists(os.path.join(OUT,slug,p['part']+'.png')) else None,
            'source':p['icon']}
        if lk in log and log[lk]['upscaled']:pc['icon_upscaled_from']=log[lk]['src_px'];upscaled.append(icon)
        if not pc['icon']:
            pc['source']=None
            missing.append({'set':item['set'],'part':p['part'],'name':p['name'],'reason':'GameWith.ai shows only a generic placeholder icon (no real artwork yet). Game8 has no per-piece armor icons; GameWith JP was not checked piece by piece'})
        item['pieces'].append(pc)
    for name,key in (('full.png','full'),('full-alt.png','full_alt')):
        lk=f'{slug}/{name}'
        if lk in log:
            item[key]=f'12-armor/{slug}/{name}';item[key+'_variant']=log[lk]['variant']
            item[key+'_source']=o['full'][log[lk]['variant']]
            if log[lk]['upscaled']:item[key+'_upscaled_from']=log[lk]['src_px']
    if 'full' not in item:missing.append({'set':item['set'],'part':'full','reason':'no full-body image'})
    sets.append(item)
json.dump({'source':'GameWith.ai (EN) armor pages, 27 Nov 2026','note':'Icons cut from GameWith icons (84px originals upscaled with Lanczos to 256px where noted). Full-body images: the larger of the male/female previews; small 180x300 previews were upscaled 2x.','sets':sets},
          open(os.path.join(OUT,'manifest-armor.json'),'w'),ensure_ascii=False,indent=1)
json.dump({'missing':missing,'upscaled_icons':len(upscaled)},open(os.path.join(OUT,'missing-armor.json'),'w'),ensure_ascii=False,indent=1)
json.dump(conf,open(os.path.join(OUT,'conflicts-armor.json'),'w'),ensure_ascii=False,indent=1)
print(len(sets),'sets',sum(len(s['pieces']) for s in sets),'pieces; missing',len(missing),'; upscaled icons',len(upscaled),'; conflicts',len(conf))
