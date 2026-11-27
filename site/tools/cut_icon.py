from rembg import remove,new_session
from PIL import Image,ImageFilter
import numpy as np
from scipy import ndimage
_s={}
def sess(n='u2net'):
    if n not in _s:_s[n]=new_session(n)
    return _s[n]
def cut_icon(path,size=256):
    im=Image.open(path).convert('RGB');w,h=im.size;src=min(w,h)
    m=round(min(w,h)*0.06)  # inset to drop frame & corner marks
    im=im.crop((m,m,w-m,h-m)).resize((size,size),Image.LANCZOS)
    o=remove(im,session=sess(),post_process_mask=True)
    a=np.array(o.split()[-1])
    lab,n=ndimage.label(a>40)
    if n>1:
        areas=ndimage.sum(np.ones_like(a),lab,range(1,n+1));keep=[i+1 for i,ar in enumerate(areas) if ar>=0.08*areas.max()]
        a=np.where(np.isin(lab,keep),a,0).astype('uint8')
    # fit object to canvas with small padding
    ys,xs=np.nonzero(a>10)
    o.putalpha(Image.fromarray(a))
    if len(xs):
        bb=(xs.min(),ys.min(),xs.max()+1,ys.max()+1);c=o.crop(bb);s=max(c.size);pad=int(s*0.06)
        canvas=Image.new('RGBA',(s+2*pad,s+2*pad),(0,0,0,0));canvas.paste(c,((s+2*pad-c.width)//2,(s+2*pad-c.height)//2),c)
        o=canvas.resize((size,size),Image.LANCZOS)
    return o,src
