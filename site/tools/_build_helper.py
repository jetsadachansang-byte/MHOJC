"""Helper for transcribing build cards. Skill strings: 'Name N' plus a tag: '!S' set skill, '!E' element Lv7 MAX, '!M' skill MAX."""
import json,os,re
SL=['head','chest','arms','waist','legs']
def sk(s):
    out=[]
    for x in s.split('|'):
        x=x.strip();t=None
        if x.endswith(('!S','!E','!M')):t={'!S':'set','!E':'elem','!M':'max'}[x[-2:]];x=x[:-2].strip()
        out.append({'n':x,'tag':t} if t else {'n':x})
    return out
def B(title,sub,weapon,alt,armor,skills,note=None):
    return {'title':title,'sub':sub,'weapon':weapon,'alt':alt,'armor':dict(zip(SL,armor)),'skills':sk(skills),**({'note':note} if note else {})}
def write(d):
    p=os.path.join(os.path.dirname(__file__),'..','data','build',d['id']+'.json')
    json.dump(d,open(p,'w'),ensure_ascii=False,indent=1);print('saved',d['id'])
KT=["Core S0","Kushala Daora's Tempest","เฉพาะ S0","Core: ธาตุ +10% (ส่วนที่แตก 18%) · เซ็ต 2 ชิ้น: +3% (Suppression 10%)"]
F="GameWith JP (อัปเดต 27 พ.ย. 2026) · ชื่อเกราะ/สกิลเทียบกับ GameWith.ai"
FJ=F+" · * ชื่ออาวุธแปลจากชื่อญี่ปุ่น"
NC="Pink Rathian's Rampage!S|Charge Enhancement 7!M|Unshaken Resolve 3!M|Critical Element 3!M|Grace Under Pressure 2|Deterrence 1|Fire Resistance 1|Hunting Instinct 1|Sleep Resistance 1"
NA=["Radiant Rath Heart Helm VI","Radiant Rath Heart Mail VI","Baan Vambraces VI","Radiant Rathalos Coil VI","Radiant Anja Greaves VI"]
DRA=["Radiant Rath Heart Helm VI","Radiant Rath Heart Mail VI","Hornetaur Vambraces VI","Diablos Nero Coil VI","Bone Greaves VI"]
DRS="Pink Rathian's Rampage!S|Dragon Damage Up 7!E|Critical Element 3!M|Unshaken Resolve 3!M|Stun Resistance 2|Grace Under Pressure 2|Health Boost 1|Breaker 1"
COA=["Radiant Rath Heart Helm VI","Radiant Rath Heart Mail VI","Radiant Girros Vambraces VI","Kulu Coil VI","Radiant Kulu Greaves VI"]
COS="Pink Rathian's Rampage!S|Combo Enhancement 7!M|Unshaken Resolve 3!M|Critical Element 3!M|Weakspot Exploit 2|Fire Resistance 2|Grace Under Pressure 2|Flinching-Free 1"
FRA=["Radiant Rath Heart Helm VI","Radiant Rath Heart Mail VI","Radiant Rathalos Vambraces VI","Anja Coil VI","Radiant Rathalos Greaves VI"]
FRS="Pink Rathian's Rampage!S|Fire Damage Up 7!E|Critical Element 3!M|Unshaken Resolve 3!M|Grace Under Pressure 2|Health Cycle 1|Suppression Recovery 1|Quick-Bite 1|Adversity 1"
