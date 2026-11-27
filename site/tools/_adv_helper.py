"""Helper used while transcribing character info cards: builds the gift lists from the 3 recurring gift groups."""
import json,sys,os
G={'A':['Wooden Carving','Vista Display','Dome Landscape'],'B':['Outlands Poetry','Bonfire Album','Kulune Songbook'],'C':['Journey Cord','Worn Adventurer Badge','Elder Dragon Banner'],'D':['Glowmoss Bottle','Forest Amber','Moonfeather Chime'],'E':['Prized Matsutake','Black Pearl Roe','Thick-Cut Tail']}
U=["Adventurer's Charm",'Exploration Badge','Journey Memento']
def like(g):
    a=G[g];return [[a[0],'×1.5'],[a[1],'×1.5'],[a[2],'×1.5'],[U[0],'×1.5'],[U[1],'×1.5'],[U[2],'×1.5']]
def dislike(g):return [[x,'×0.5'] for x in G[g]] if g else []
def write(d,likeg,dislikeg):
    d.setdefault('gifts_like_note','Bond ×1.5 · ส่งได้ 5 ชิ้น/วัน');d['gifts_like']=like(likeg)
    d.setdefault('gifts_dislike_note','Bond ×0.5');d['gifts_dislike']=dislike(dislikeg)
    if not dislikeg:d['gifts_dislike_empty']='ไม่มีของที่ชอบน้อย'
    p=os.path.join(os.path.dirname(__file__),'..','data','adv',d['id']+'.json')
    json.dump(d,open(p,'w'),ensure_ascii=False,indent=1);print('saved',d['id'])
