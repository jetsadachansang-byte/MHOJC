import json,os,sys,glob;sys.path.insert(0,'.')
from cut_icon import cut_icon,sess
from rembg import remove
from PIL import Image
import numpy as np
from scipy import ndimage
OUT='/home/user/mhojc/assets/images/12-armor'
d=json.load(open('gw_armor.json'));log={}
for o in d:
    sd=os.path.join(OUT,o['slug']);os.makedirs(sd,exist_ok=True)
    for p in o['pieces']:
        f=f"dl/icons/{o['slug']}__{p['part']}.png"
        img,src=cut_icon(f);img.save(os.path.join(sd,p['part']+'.png'),optimize=True)
        log[f"{o['slug']}/{p['part']}"]={'src_px':src,'upscaled':src<128}
    # full body
    cands=[]
    for g in ('female','male'):
        f=f"dl/full/{o['slug']}__{g}.png"
        if os.path.exists(f):cands.append((Image.open(f).size[1],g,f))
    if not cands:continue
    cands.sort(key=lambda x:-x[0])
    for idx,(h,g,f) in enumerate(cands):
        im=Image.open(f).convert('RGB');up=False
        if im.height<600:im=im.resize((im.width*2,im.height*2),Image.LANCZOS);up=True
        if im.height>1600:im=im.resize((round(im.width*1600/im.height),1600),Image.LANCZOS)
        cut=remove(im,session=sess('isnet-general-use'),post_process_mask=True)
        a=np.array(cut.split()[-1]);lab,n=ndimage.label(a>40)
        if n>1:
            areas=ndimage.sum(np.ones_like(a),lab,range(1,n+1));keep=[i+1 for i,ar in enumerate(areas) if ar>=0.05*areas.max()]
            a=np.where(np.isin(lab,keep),a,0).astype('uint8');cut.putalpha(Image.fromarray(a))
        bb=cut.getbbox()
        if bb:
            pad=12;cut=cut.crop((max(0,bb[0]-pad),max(0,bb[1]-pad),min(cut.width,bb[2]+pad),min(cut.height,bb[3]+pad)))
        name='full.png' if idx==0 else 'full-alt.png'
        cut.save(os.path.join(sd,name),optimize=True)
        log[f"{o['slug']}/{name}"]={'variant':g,'src_px':[*Image.open(f).size],'upscaled':up,'out_px':[*cut.size]}
    print(o['slug'],flush=True)
json.dump(log,open('cut_log.json','w'),indent=1)
