/* ===== ui2: real images + card data rendered as HTML ===== */
const SZ=MEDIA.size||{};
const HDM=window.HD||{};
const hdSet=src=>{const h=src&&HDM[src.split('?')[0]];return h&&h.set.length>1?` srcset="${h.set.map(([w,p])=>p+' '+w+'w').join(', ')}" sizes="${h.sizes}"`:''};
const IMG=(src,cls='',alt='',extra='')=>{if(!src)return '';const d=SZ[src];return `<img class="${cls}" src="${src}"${/sizes=/.test(extra)?'':hdSet(src)} alt="${esc(alt)}" ${d?`width="${d[0]}" height="${d[1]}"`:''} loading="lazy" decoding="async" ${extra}>`};
const md=t=>esc(t||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[([^\]]+)\]/g,'<span class="tag">$1</span>').replace(/\n/g,'<br>');
const EL_EN2={Fire:'fire',Water:'water',Thunder:'thunder',Ice:'ice',Dragon:'dragon'};
const ELK=s=>EL_EN2[(s||'').split(' ')[0]]||'';
const GIFT=Object.fromEntries(MEDIA.gifts.map(g=>[g.n,g.img]));const GIFT_ALIAS={"Adventurer's Charm":'Adventurers Charm','Thick-Cut Tail':'Thick Cut Tail'};
const giftImg=n=>GIFT[n]||GIFT[GIFT_ALIAS[n]];
const ARN=Object.fromEntries(ARMOR.map(a=>[a.n.toLowerCase(),a]));
const armorByName=n=>ARN[n.replace(/\s+[IVX]+$/,'').toLowerCase()];
const WEPIMG=MEDIA.weapons||{};
const weaponImg=n=>{const k=n.replace(/\*$/,'').replace(/\s+\((Fire|Water|Thunder|Ice|Dragon)\)$/,'').replace(/\s+[IVX]+$/,'').replace(/^Wrecker\s+/,'').trim();return WEPIMG[k]||WEPIMG[k.replace(/\s+\((Fire|Water|Thunder|Ice|Dragon)\)$/,'')]};
const SKBY=Object.fromEntries(Object.entries(SK).map(([k,v])=>[v.en.toLowerCase(),k]));
document.head.insertAdjacentHTML('beforeend',`<style>
:where(img[height]){height:auto}
.mi,.gi,.wi,.mon-card .top img,.pc-icons img,.set-card .pc img.pi,.sk-hits td img{height:revert-layer}
.mon-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.mon-card .top img{width:56px;height:56px}
.el-strip{position:absolute;left:0;top:0;bottom:0;width:4px}
.ch-card{position:relative}.ch-card .elbar{height:4px}
.ch-card .wpn{position:absolute;right:6px;top:6px;width:30px;height:30px;background:rgba(0,0,0,.55);border-radius:50%;padding:4px}
.ch-card .wpn img{width:22px;height:22px;filter:invert(1)}
.hero-full{width:100%;max-height:520px;object-fit:contain;object-position:top;background:radial-gradient(ellipse at 50% 70%,var(--surface-2),transparent 70%);border-bottom:1px solid var(--line);display:block}
.blank{display:grid;place-items:center;border:1px dashed var(--line-2);color:var(--muted);font-size:12px;text-align:center;padding:6px;background:var(--surface-2);aspect-ratio:1}
.cd{display:grid;gap:12px}
.cd h5{font-family:var(--f-display);font-size:13px;letter-spacing:.14em;color:var(--elc,var(--brass));margin:6px 0 0;display:flex;gap:10px;align-items:center}
.cd h5 small{color:var(--muted);letter-spacing:.04em;font-family:var(--f-body);font-weight:500}
.cd h5::after{content:"";flex:1;height:1px;background:var(--line)}
.pf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.pf div{border:1px solid var(--line);background:var(--surface-2);padding:8px 12px;min-width:0}
.pf span{display:block;font-size:11px;letter-spacing:.12em;color:var(--muted);font-family:var(--f-display)}
.pf b{font-family:var(--f-display);font-size:16px}
.srow{display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px;border:1px solid var(--line);background:var(--surface-2);padding:10px 12px;align-items:start}
.srow .lab{font-family:var(--f-display);font-size:11px;font-weight:700;letter-spacing:.06em;padding:3px 6px;text-align:center;background:var(--surface);color:var(--muted)}
.srow .lab.ult{background:var(--elc,var(--brass));color:var(--on-brass)}
.srow b.t{font-family:var(--f-display);font-size:16px;display:block}
.srow .d{font-size:14px;color:var(--fg);opacity:.85}
.trait{border-left:3px solid var(--elc,var(--brass));background:var(--surface-2);padding:8px 12px;font-size:14px}
.trait span{display:block;font-family:var(--f-display);font-size:11px;letter-spacing:.12em;color:var(--elc,var(--brass))}
.ins{display:grid;grid-template-columns:36px minmax(0,1fr);gap:10px;border:1px solid var(--line);padding:10px 12px;align-items:start}
.ins i{font-style:normal;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-family:var(--f-display);font-weight:700;background:var(--elc,var(--brass));color:var(--on-brass)}
.ins b.t{font-family:var(--f-display);font-size:16px;color:var(--elc,var(--brass));display:block}
.ins .d{font-size:14px}
.gl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.gl div{display:flex;align-items:center;gap:8px;background:var(--surface-2);padding:6px 10px;font-size:14px;min-width:0}
.gl img,.gl .blank{width:30px;height:30px;flex:none;padding:0;font-size:8px}
.gl em{margin-left:auto;font-style:normal;font-family:var(--f-num);color:var(--moss)}.gl em.neg{color:var(--danger)}
.src2{font-size:12px;color:var(--muted)}
@media (max-width:520px){.pf,.gl{grid-template-columns:1fr}.srow{grid-template-columns:1fr}}
/* build card */
.bc2{--elc:var(--brass);background:var(--surface);border:1px solid var(--line);padding:14px;display:grid;gap:12px}
.bc2-top{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:14px}
.bc2-top .tg{display:inline-block;background:var(--elc);color:var(--on-brass);font-family:var(--f-display);font-weight:700;font-size:12px;letter-spacing:.16em;padding:3px 10px}
.bc2-top h4{font-size:34px;line-height:1;margin:6px 0}
.bc2-top img{width:150px;height:150px;object-fit:cover;object-position:top;border:2px solid var(--elc)}
.vt{display:grid;grid-template-columns:76px minmax(0,1fr);gap:4px 10px;font-size:13px;border:1px solid var(--line);padding:10px;background:var(--surface-2)}
.vt b{color:var(--elc)}.vt small{display:block;color:var(--muted)}
.vt .so{font-size:10px;background:#f3c04a;color:#1a1406;padding:0 4px;margin-left:4px;font-weight:700}
.bcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (max-width:640px){.bcols{grid-template-columns:1fr}.bc2-top{grid-template-columns:1fr 96px}.bc2-top img{width:96px;height:96px}}
.bcol{border:1px solid var(--line);padding:12px;background:var(--surface-2);display:grid;gap:8px;align-content:start;min-width:0}
.bcol h6{font-family:var(--f-display);font-size:22px;margin:0;color:var(--elc)}.bcol h6 small{font-size:12px;color:var(--muted);font-family:var(--f-body);font-weight:500;margin-left:8px}
.bw{display:flex;gap:8px;align-items:center;border-bottom:2px solid var(--elc);padding-bottom:8px}
.bw img,.bw .blank{width:44px;height:44px;flex:none;object-fit:contain;padding:0;font-size:8px}
.bw b{font-family:var(--f-display);font-size:16px;display:block;color:var(--elc)}.bw span{font-size:12px;color:var(--muted)}
.ba{display:flex;gap:8px;align-items:center;font-size:14px;border-bottom:1px solid var(--line);padding:3px 0}
.ba .sl{font-size:11px;background:var(--surface);padding:1px 6px;color:var(--muted);flex:none;width:34px;text-align:center}
.ba img,.ba .blank{width:30px;height:30px;flex:none;padding:0;font-size:7px}
.chipz{display:flex;flex-wrap:wrap;gap:5px}
.chipz span{font-size:12px;padding:3px 8px;border:1px solid var(--line-2);font-weight:600;font-family:var(--f-display)}
.chipz .set{background:#efe9dc;color:#1a1406;border-color:#efe9dc}
.chipz .max{border-color:var(--elc);color:var(--elc)}
.chipz .elem{background:var(--elc);color:var(--on-brass);border-color:var(--elc)}
.chipz i{font-style:normal;font-size:9px;padding:0 3px;margin-left:4px;background:currentColor;vertical-align:1px}
.chipz i b{color:var(--surface)}.chipz .set i{background:#1a1406}.chipz .set i b{color:#efe9dc}.chipz .elem i{background:var(--surface)}.chipz .elem i b{color:var(--elc)}
.legend{font-size:11px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap}
/* monster card */
.mc{display:grid;gap:10px}
.mc-top{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;border:1px solid var(--line);background:var(--surface-2);padding:12px}
.mc-top img{width:96px;height:96px}
.mchips{display:flex;gap:6px;flex-wrap:wrap;margin:3px 0 8px}.mchips span{font-size:13px;font-weight:700;padding:2px 10px;border-radius:999px;color:#111}
.mgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.mon-detail .mgrid{grid-template-columns:1fr}
.mon-layout{grid-template-columns:minmax(0,1fr) 440px}@media (max-width:960px){.mon-layout{grid-template-columns:1fr}}
@media (max-width:560px){.mgrid{grid-template-columns:1fr}}
.mbox{border:1px solid var(--line);background:var(--surface-2);padding:10px 12px;min-width:0}
.mbox h6{margin:0 0 6px;font-size:13px;color:var(--muted);font-family:var(--f-body)}
.bar3{display:grid;grid-template-columns:70px 1fr 18px;gap:8px;align-items:center;font-size:14px}
.bar3 .b{display:flex;gap:3px}.bar3 .b i{flex:1;height:8px;background:currentColor;opacity:.18;border-radius:2px}.bar3 .b i.on{opacity:1}
.bar3.top{font-weight:700}
.mt{width:100%;font-size:14px;border-collapse:collapse;min-width:0}.mt td,.mt th{padding:4px 6px;border-bottom:1px solid var(--line);text-align:center;background:none}
.mt td:first-child,.mt th:first-child{text-align:left}.mt td.lo{color:var(--muted)}.mt td.hi{font-weight:700}
.ib{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.ib div{background:var(--surface);padding:6px 8px;font-size:11px;color:var(--muted)}
.ib b{display:block;font-size:15px}.ib .g{color:var(--moss)}.ib .r{color:var(--danger)}.ib .y{color:#e3b341}
/* buddies grid */
.bc-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.bc>button{background:radial-gradient(circle at 50% 60%,var(--surface-2),var(--surface))}
.bc img{aspect-ratio:180/215;object-fit:contain}
@media (max-width:600px){.bc-bar{grid-template-columns:1fr!important}}
/* guide pages */
.gp{border:1px solid var(--line);background:var(--surface-2);padding:14px;display:grid;gap:10px;--elc:var(--brass)}
.gp .eb{font-family:var(--f-display);font-size:12px;letter-spacing:.14em;color:var(--elc)}
.gp h4{font-size:30px;line-height:1}.gp .sub{color:var(--elc);font-family:var(--f-display);font-size:18px}
.gp .intro{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:14px}
.gp .intro img{width:200px;border:2px solid var(--elc)}
@media (max-width:560px){.gp .intro{grid-template-columns:1fr}.gp .intro img{width:100%}}
.gp .q{border-left:3px solid var(--elc);padding:6px 12px;font-style:italic;background:var(--surface)}
.gp .boxes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media (max-width:560px){.gp .boxes{grid-template-columns:1fr}}
.gp .box{background:var(--surface);padding:10px 12px;border-top:2px solid var(--elc);font-size:14px}.gp .box span{display:block;font-size:12px;color:var(--elc)}.gp .box small{display:block;color:var(--muted)}
.gp .row{display:grid;grid-template-columns:170px minmax(0,1fr);gap:10px;background:var(--surface);border-left:3px solid var(--elc);padding:8px 12px;font-size:14px}
.gp .row .k small{display:block;font-size:11px;color:var(--elc);letter-spacing:.08em}.gp .row .k b{font-family:var(--f-display)}
@media (max-width:560px){.gp .row{grid-template-columns:1fr}}
.gp table{min-width:0;font-size:13px}.gp td,.gp th{padding:5px 8px;text-align:center}
.of{display:grid;grid-template-columns:200px minmax(0,1fr);gap:12px;background:var(--surface);padding:10px;border-left:3px solid var(--elc)}
.of img{width:200px;cursor:zoom-in}@media (max-width:560px){.of{grid-template-columns:1fr}.of img{width:100%}}
</style>`);

const tagCls=t=>t==='set'?'set':t==='elem'?'elem':t==='max'?'max':'';
const chip=k=>{const c=tagCls(k.tag);return `<span class="${c}">${esc(k.n)}${c==='set'?'<i><b>SET</b></i>':c?'<i><b>MAX</b></i>':''}</span>`};
const blank=(n,cls='blank')=>`<span class="${cls}">${esc(n)}</span>`;

/* ---- character info (old info card) ---- */
function advHTML(c){
  const d=CARDS.adv[c.id];if(!d)return '<p class="muted">ยังไม่มีข้อมูล</p>';const P=d.profile;
  const gl=(arr,neg)=>arr.map(([n,x])=>`<div>${giftImg(n)?IMG(giftImg(n),'',n):blank(n)}<span>${esc(n)}</span><em class="${neg?'neg':''}">${esc(x)}</em></div>`).join('');
  return `<div class="cd" style="--elc:${ECOL[ELK(P.element)]||'var(--brass)'}">
   <h5>PROFILE</h5><div class="pf"><div><span>CLASS</span><b>${esc(P.class)}</b></div><div><span>WEAPON</span><b>${esc(P.weapon)}</b></div><div><span>ELEMENT</span><b>${esc(P.element)}</b></div><div><span>RARITY</span><b>${esc(P.rarity)}</b></div><div><span>วิธีได้</span><b>${esc(P.obtain)}</b></div><div><span>BUDDY แนะนำ</span><b>${esc(P.buddy)}</b></div></div>
   <h5>SKILLS</h5>${d.skills.map(([l,n,x])=>`<div class="srow"><span class="lab ${l==='ULTIMATE'?'ult':''}">${esc(l)}</span><div><b class="t">${esc(n)}</b><span class="d">${md(x)}</span></div></div>`).join('')}
   ${d.traits.map(([l,n,x])=>`<div class="trait"><span>${esc(l)}</span>${n?`<b>${esc(n)}</b> — `:''}${md(x)}</div>`).join('')}
   <h5>INSIGHTS</h5>${d.insights.map(([n,x],i)=>`<div class="ins"><i>${i+1}</i><div><b class="t">${esc(n)}</b><span class="d">${md(x)}</span></div></div>`).join('')}${d.insights_pending?`<p class="src2">${esc(d.insights_pending)}</p>`:''}
   <h5>ของขวัญที่ชอบ <small>${esc(d.gifts_like_note)}</small></h5><div class="gl">${gl(d.gifts_like)}</div>
   <h5>ของขวัญที่ชอบน้อย <small>${esc(d.gifts_dislike_note)}</small></h5>${d.gifts_dislike.length?`<div class="gl">${gl(d.gifts_dislike,1)}</div>`:`<p class="src2">${esc(d.gifts_dislike_empty||'')}</p>`}
   <h5>BOND REWARD</h5><div class="trait">${esc(d.bond_reward)}</div></div>`;
}
/* ---- recommended build (old build card) ---- */
function bcolHTML(b,c){
  if(b.empty)return `<div class="bcol"><h6>${esc(b.title)}<small>${esc(b.sub)}</small></h6><p style="font-size:15px">${esc(b.empty)}</p><p class="src2">${esc(b.empty_note)}</p></div>`;
  const wt=c&&MEDIA.weaponIcons[slugify(c.w)];const wi=weaponImg(b.weapon);const SLT={head:'หัว',chest:'อก',arms:'แขน',waist:'เอว',legs:'ขา'};
  return `<div class="bcol"><h6>${esc(b.title)}<small>${esc(b.sub)}</small></h6>
   <div class="bw">${wi?IMG(wi,'',b.weapon):wt?IMG(wt,'',c.w,'style="filter:var(--icon-filter);padding:6px;background:var(--surface)" title="ไอคอนประเภทอาวุธ (ยังไม่มีรูปอาวุธชิ้นนี้)"'):blank('อาวุธ')}<div><b>${esc(b.weapon)}</b><span>${esc(b.alt)}</span></div></div>
   ${Object.entries(b.armor).map(([sl,n])=>{const a=armorByName(n);return `<div class="ba"><span class="sl">${SLT[sl]}</span>${a&&a.icon?IMG(a.icon,'',n):blank(SLOT_TH[sl])}<span>${esc(n)}</span></div>`}).join('')}
   <div class="chipz">${b.skills.map(chip).join('')}</div>${b.note?`<p class="src2">${esc(b.note)}</p>`:''}
   <div class="legend"><span>▮ เซ็ตเกราะ</span><span style="color:var(--elc)">▮ ธาตุเต็ม Lv7</span><span>▯ สกิลเต็มลิมิต</span></div></div>`;
}
function buildHTML(c){
  const d=CARDS.build[c.id];if(!d)return '<p class="muted">ยังไม่มีข้อมูล</p>';
  return `<div class="bc2" style="--elc:${ECOL[ELK(c.el)]||'var(--brass)'}"><div class="bc2-top"><div><span class="tg">${esc(d.tag)}</span><h4>${esc(c.n)}</h4>
   <div style="font-size:14px"><span class="rar" style="--rc:var(--elc)">BUDDY</span> ${d.buddies.length?d.buddies.map(esc).join(' · '):esc(d.buddies_empty||'')}</div><div class="src2">${esc(d.updated)}</div></div>${IMG(c.p,'',c.n)}</div>
   <div class="vt"><b style="grid-column:1/-1;letter-spacing:.12em">การ์ด VISAGE</b>${d.visage.map(([k,n,so,x])=>`<span class="muted">${esc(k)}</span><span><b>${esc(n)}</b>${so?`<span class="so">${esc(so)}</span>`:''}${x?`<small>${esc(x)}</small>`:''}</span>`).join('')}</div>
   <div class="bcols">${d.builds.map(b=>bcolHTML(b,c)).join('')}</div></div>`;
}
/* ---- guide pages (old Freya/Stylia guide images) ---- */
function guideHTML(g,c){
  const ek=g.who==='stylia'?'ice':'fire';const st=`--elc:${ECOL[ek]}`;
  const art=g.buddy?(MEDIA.buddies.find(b=>b.id===g.buddy)||{}).img:(CH.find(x=>x.id===g.who)||{}).f;
  const head=`<div class="eb">${esc(g.eyebrow)}${g.date?` · ${esc(g.date)}`:''}</div>`;
  if(g.kind==='intro')return `<div class="gp" style="${st}">${head}<div class="intro"><div style="display:grid;gap:8px;align-content:start">${g.badge?`<span class="tg" style="background:var(--elc);color:var(--on-brass);font-family:var(--f-display);font-weight:700;font-size:12px;letter-spacing:.16em;padding:3px 10px;width:max-content">${esc(g.badge)}</span>`:''}<h4>${esc(g.title)}</h4>
    <div class="pf">${g.facts.map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>${g.quote?`<div class="q">${esc(g.quote)}</div>`:''}</div>${art?IMG(art,'',g.title,`data-zoom="${art}" data-cap="${esc(g.title)}"`):''}</div>
    <div class="boxes">${g.boxes.map(([h,t,s])=>`<div class="box"><span>${esc(h)}</span>${md(t)}${s?`<small>${esc(s)}</small>`:''}</div>`).join('')}</div></div>`;
  if(g.kind==='outfits'){const O=Object.fromEntries(MEDIA.outfits.map(o=>[o.id,o]));
    return `<div class="gp">${head}<h4>${esc(g.title)}</h4>${g.main.map(m=>{const o=O[m.id]||{};return `<div class="of" style="--elc:${m.id.startsWith('freya')?ECOL.fire:ECOL.ice}">${o.img?IMG(o.img,'',m.name,`data-zoom="${o.full||o.img}" data-cap="${esc(m.name)}"`):blank(m.name)}<div><div class="eb">${esc(m.tag)}</div><h4 style="font-size:24px">${esc(m.name)}</h4><div class="chipz" style="margin:6px 0">${m.chips.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${m.lines.map(l=>`<div style="font-size:14px">${md(l)}</div>`).join('')}${m.notes.map(n=>`<div class="src2">${esc(n)}</div>`).join('')}</div></div>`}).join('')}
     <div class="boxes">${g.small.map(m=>{const o=O[m.id]||{};return `<div class="of" style="grid-template-columns:120px 1fr;--elc:${ECOL.ice}">${o.img?IMG(o.img,'',m.name,`style="width:120px" data-zoom="${o.full||o.img}" data-cap="${esc(m.name)}"`):blank(m.name)}<div><b style="font-family:var(--f-display);font-size:16px">${esc(m.name)}</b><div style="font-size:13px">${md(m.desc)}</div></div></div>`}).join('')}</div></div>`}
  const rows=r=>r.map(([small,k,v])=>`<div class="row"><div class="k">${small?`<small>${esc(small)}</small>`:''}<b>${esc(k)}</b></div><div>${md(v)}</div></div>`).join('');
  const gl=(o,neg)=>o?`<div class="row"><div class="k"><b>${esc(o.h)}</b></div><div><div class="gl">${o.items.map(([n,x])=>`<div>${giftImg(n)?IMG(giftImg(n),'',n):blank(n)}<span>${esc(n)}</span><em class="${neg?'neg':''}">${esc(x)}</em></div>`).join('')}</div>${o.note?`<div class="src2">${esc(o.note)}</div>`:''}</div></div>`:'';
  return `<div class="gp" style="${st}">${head}<h4>${esc(g.title)}</h4><div class="sub">${esc(g.subtitle||'')}</div>
   ${g.rows?rows(g.rows):''}${(g.sections||[]).map(x=>`<h5 style="font-family:var(--f-display);color:var(--elc);letter-spacing:.12em;margin:6px 0 0">${esc(x.h)}</h5>${rows(x.rows)}`).join('')}
   ${g.table?`<h5 style="font-family:var(--f-display);color:var(--elc);letter-spacing:.12em;margin:6px 0 0">${esc(g.table.h)}</h5><div class="tbl-wrap"><table><thead><tr>${g.table.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${g.table.rows.map(r=>`<tr>${r.map((x,i)=>`<td style="${i?'':'text-align:left'}" class="num">${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}
   ${gl(g.gifts)}${gl(g.gifts_dislike,1)}</div>`;
}
/* ---- characters page ---- */
chCard=c=>`<button class="ch-card" aria-pressed="${c.id===chSel}" data-ch="${c.id}"><span class="rarity-tag ${c.r==='SR'?'sr':''}">${c.r}</span>${MEDIA.weaponIcons[slugify(c.w)]?`<span class="wpn">${IMG(MEDIA.weaponIcons[slugify(c.w)],'',c.w)}</span>`:''}${c.p?IMG(c.p,'',c.n):blank(c.n)}<span class="elbar" style="display:block;background:${ECOL[ELK(c.el)]}"></span><span class="meta"><b>${esc(c.n)}</b><span>${wIcon(slugify(c.w))}${esc(c.w)}</span><span style="color:${ECOL[ELK(c.el)]}">${EL_EN[c.el]?ei(EL_EN[c.el]):''}${EL_TH[c.el]||c.el}</span></span></button>`;
renderChars=function(){
  const opts=['ทั้งหมด','SSR','SR',...WTYPES.map(t=>t.n).filter(n=>CH.some(c=>c.w===n))];
  $('#ch-filter').innerHTML=opts.map(o=>`<button class="chip" aria-pressed="${o===chF}" data-chf="${esc(o)}">${esc(o)}</button>`).join('');
  $('#ch-grid').innerHTML=CH.filter(c=>chF==='ทั้งหมด'||c.r===chF||c.w===chF).map(chCard).join('')||'<p class="muted">ไม่มีตัวละครที่ตรงกับตัวกรอง</p>';
  const c=CH.find(x=>x.id===chSel);const guides=CARDS.guide.filter(g=>g.who===c.id||(g.who==='both'&&['freya','stylia'].includes(c.id)));
  const tabs=[['info','ข้อมูลและสกิล'],['build','บิลด์แนะนำ'],...(guides.length?[['guide','ไกด์ ('+guides.length+')']]:[]),['art','อาร์ตเวิร์ก'],...(MEDIA.outfits.some(o=>o.ch===c.id)?[['outfit','ชุดแฟชั่น']]:[])];
  if(!tabs.some(t=>t[0]===chTab))chTab='info';
  const wt=WTYPES.find(t=>t.n===c.w);let body='';
  if(chTab==='info')body=advHTML(c);
  if(chTab==='build')body=buildHTML(c)+(wt?`<div><button class="btn btn-ghost btn-sm" data-chbuild="${wt.id}">เปิดหน้าจัดบิลด์ด้วย ${esc(c.w)}</button></div>`:'');
  if(chTab==='guide')body=guides.map(g=>guideHTML(g,c)).join('');
  if(chTab==='outfit')body=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,320px));gap:12px">${MEDIA.outfits.filter(o=>o.ch===c.id).map(o=>`<figure style="margin:0;background:var(--surface);border:1px solid var(--line)">${IMG(o.full||o.img,'',o.n,`style="width:100%;max-width:320px;height:auto;display:block;cursor:zoom-in" data-zoom="${o.full||o.img}" data-cap="${esc(o.n)}"`)}<figcaption style="padding:8px 10px"><b>${esc(o.n.split(' · ')[0])}</b>${o.how?`<div class="src2">ได้จาก: ${esc(o.how)}</div>`:''}${o.src?`<div class="src2">ที่มา: <a href="${o.src}" target="_blank" rel="noopener">GameWith</a></div>`:''}</figcaption></figure>`).join('')}</div><p class="src2">รูปจากแหล่งข้อมูลมีความละเอียดสูงสุด 320×320 จึงแสดงขนาดจริง ไม่ขยายเพิ่ม</p>`;
  if(chTab==='art')body=(c.f?IMG(c.f,'card-img',c.n,`data-zoom="${c.f}" data-cap="${esc(c.n)}"`):`${IMG(c.p,'card-img',c.n,`style="max-width:360px" data-zoom="${c.p}" data-cap="${esc(c.n)}"`)}<p class="src2">ยังไม่มีอาร์ตเวิร์กเต็มตัวของ ${esc(c.n)} จึงแสดงรูปโปรไฟล์แทน</p>`)+MEDIA.outfits.filter(o=>o.id.startsWith(c.id)).map(o=>IMG(o.full||o.img,'card-img',o.n,`data-zoom="${o.full||o.img}" data-cap="${esc(o.n)}"`)).join('');
  $('#ch-detail').innerHTML=`${c.f?IMG(c.f,'hero-full',c.n,`data-zoom="${c.f}" data-cap="${esc(c.n)}"`):''}<div class="ch-hero" style="${c.f?'grid-template-columns:96px minmax(0,1fr)':''}">${IMG(c.p,'',c.n)}<div><span class="rar" style="--rc:var(--brass)">${c.r}</span><h3>${esc(c.n)}</h3><dl class="kv"><dt>อาวุธ</dt><dd style="display:flex;gap:6px;align-items:center">${wIcon(slugify(c.w))}${esc(c.w)}${wt?' · '+wt.th:''}</dd><dt>ธาตุ</dt><dd style="color:${ECOL[ELK(c.el)]}">${EL_EN[c.el]?ei(EL_EN[c.el]):''} ${esc(c.el)} · ${EL_TH[c.el]||''}</dd></dl></div></div>
   <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${k===chTab}" data-chtab="${k}">${l}</button>`).join('')}</div><div class="tab-body">${body}</div>`;
};
/* ---- monsters: HTML info card ---- */
function monCardHTML(k){
  const d=CARDS.mon[k];if(!d)return '';
  const EL=[['Fire','fire','ไฟ'],['Water','water','น้ำ'],['Thunder','thunder','สายฟ้า'],['Ice','ice','น้ำแข็ง'],['Dragon','dragon','มังกร']];
  const STs=[['Poison','poison','พิษ'],['Sleep','sleep','หลับ'],['Paralyzed','para','อัมพาต'],['Blast','blast','ระเบิด'],['Stun','stun','สตั้น']];
  const mxE=Math.max(...EL.map(e=>d.el[e[0]])),mxS=Math.max(...STs.map(e=>d.st[e[0]]));
  const allEq=STs.every(e=>d.st[e[0]]===mxS);
  const bars=(L,o,mx)=>L.map(([kk,c,th])=>`<div class="bar3 ${o[kk]===mx?'top':''}" style="color:${ECOL[c]}"><span style="color:var(--fg)">${th}</span><span class="b">${[1,2,3].map(i=>`<i class="${i<=o[kk]?'on':''}"></i>`).join('')}</span><span style="color:var(--fg)" class="num">${o[kk]}</span></div>`).join('');
  const col=v=>v==='ได้ผล'||v==='ไม่มี'?'g':v==='ไม่ได้ผล'||v==='ใหญ่'?'r':'y';
  const mxP=d.parts.length?Math.max(...d.parts.flatMap(p=>p.slice(1))):0;
  return `<div class="mc"><div class="mc-top">${IMG(MM[k]&&MM[k].icon,'',d.n)}<div><div class="src2">ธาตุที่แพ้มากที่สุด</div><div class="mchips">${EL.filter(e=>d.el[e[0]]===mxE).map(e=>`<span style="background:${ECOL[e[1]]}">${ei(e[1]).replace('class="ei"','class="ei" style="color:#111"')} ${e[2]}</span>`).join('')}</div>
   <div class="src2">สถานะที่ได้ผลที่สุด</div><div class="mchips">${allEq?`<span style="background:#dfe3ea">ได้ผลเท่ากันทุกสถานะ (${mxS})</span>`:STs.filter(e=>d.st[e[0]]===mxS).map(e=>`<span style="background:${ECOL[e[1]]}">${e[2]}</span>`).join('')}</div>
   <div style="font-size:14px"><span class="muted">เล็งที่:</span> <b>${esc(d.aim||'—')}</b></div></div></div>
   <div class="mgrid"><div class="mbox"><h6>จุดอ่อนธาตุ</h6>${bars(EL,d.el,mxE)}</div><div class="mbox"><h6>จุดอ่อนสถานะ</h6>${bars(STs,d.st,mxS)}</div>
   <div class="mbox"><h6>ส่วนอ่อน (ยิ่งมากยิ่งนิ่ม)</h6><table class="mt"><thead><tr><th>ส่วน</th><th>ตัด</th><th>ทุบ</th><th>กระสุน</th></tr></thead><tbody>${d.parts.map(p=>`<tr><td>${esc(p[0])}</td>${p.slice(1).map(v=>`<td class="num ${v===mxP?'hi':v<=1?'lo':''}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="mbox"><h6>ไอเทม และพฤติกรรม</h6><div class="ib">${Object.entries(d.items).map(([a,b])=>`<div>${esc(a)}<b class="${col(b)}">${esc(b)}</b></div>`).join('')}${Object.entries(d.beh).map(([a,b])=>`<div>${esc(a)}<b class="${col(b)}">${esc(b)}</b></div>`).join('')}</div></div></div>
   <div class="mbox" style="font-size:14px">สถานะที่ใส่เรา: ${esc(d.inflicts)}<br>ส่วนที่ทำลายได้: ${esc(d.breakable)}<br>พื้นที่: ${esc(d.area)}</div>
   ${d.note?`<div class="mbox" style="font-size:14px;border-left:3px solid var(--brass)">📌 ${esc(d.note)}</div>`:''}
   <div class="src2" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px"><span>ระดับดาว ${esc(d.rank)}</span><span>ค่า 1–3 · ยิ่งมากยิ่งได้ผล</span></div></div>`;
}
let monQ='';
const _rm=renderMonsters;
renderMonsters=function(){
  _rm();
  // filter grid by search text
  if(monQ){document.querySelectorAll('#mon-grid .mon-card').forEach(b=>{const m=MON_BY[b.dataset.msel];b.hidden=!(m.n+' '+(m.clsTh||'')+' '+(m.cls||'')).toLowerCase().includes(monQ)})}
  const m=MON_BY[monSel];const card=CARDS.mon[m.k];
  const det=$('#mon-detail');
  // replace old card image with the HTML card
  det.querySelectorAll('.card-img').forEach(x=>{const h=x.previousElementSibling;if(h&&h.tagName==='H4')h.remove();x.remove()});
  if(card)det.insertAdjacentHTML('beforeend',`<h4>การ์ดข้อมูล</h4>${monCardHTML(m.k)}`);
  if(m.nodata){const p=det.querySelector('p.muted');if(p)p.textContent=card?'ข้อมูลจุดอ่อนของตัวนี้อยู่ในการ์ดข้อมูลด้านล่าง':'มอนสเตอร์เล็ก ยังไม่มีข้อมูลจุดอ่อนในฐานข้อมูล';}
  document.querySelectorAll('#mon-grid .mon-card').forEach(b=>{const mm=MON_BY[b.dataset.msel];if(mm.nodata&&!CARDS.mon[mm.k]){const w=b.querySelector('.weak-row');if(w)w.innerHTML='<span class="muted">มอนสเตอร์เล็ก</span>'}});
  const vis=MEDIA.visages[m.k];if(vis)det.insertAdjacentHTML('beforeend',`<h4>การ์ด Visage</h4><div style="display:flex;gap:12px;align-items:center">${IMG(vis.img,'',vis.n,'style="width:96px;height:96px"')}<span>Visage: <b>${esc(vis.n)}</b></span></div>`);
};
$('#mon-q').addEventListener('input',e=>{monQ=e.target.value.trim().toLowerCase();renderMonsters()});
/* ---- buddies ---- */
let bcQ='';
renderBuddyCards=function(){
  const opts=['ทั้งหมด','SSR','SR','R','Assault','Disruptor','Support'];
  $('#bc-filter').innerHTML=opts.map(o=>`<button class="chip" aria-pressed="${o===bcF}" data-bcf="${o}">${o}${BT_TH[o]?' · '+BT_TH[o]:''}</button>`).join('');
  const list=MEDIA.buddyCards.filter(b=>(bcF==='ทั้งหมด'||b.r===bcF||b.t===bcF)&&(!bcQ||(b.n+' '+b.sp+' '+b.t+' '+(b.boost||'')).toLowerCase().includes(bcQ)));let h='',g='';
  const TO={Assault:0,Disruptor:1,Support:2},RO={SSR:0,SR:1,R:2};list.sort((x,y)=>(TO[x.t]??9)-(TO[y.t]??9)||(RO[x.r]??9)-(RO[y.r]??9)||x.n.localeCompare(y.n));
  list.forEach(b=>{const k=b.t;if(k!==g){g=k;h+=`<div class="bc-group">${esc(b.t)} · ${BT_TH[b.t]||''} <small class="muted" style="font-weight:400">${list.filter(x=>x.t===k).length} ตัว</small></div>`}
    const parts=(b.boost||'').split(';').map(x=>x.trim()).filter(Boolean);
    h+=`<article class="bc"><button data-zoom="${b.img}" data-cap="${esc(b.n)} · ${b.r} · ${esc(b.t)}" aria-label="ขยายรูป ${esc(b.n)}">${b.img?IMG(b.img,'',b.n):blank(b.n)}</button>
     <div class="meta"><b><span>${esc(b.n)}</span><span class="rk ${b.r}">${b.r}</span></b><span class="stars2">${RSTAR[b.r]||''}</span>
     <span class="typ"><span>${esc(b.t)} · ${BT_TH[b.t]||''}</span><span>${esc(SP_TH[b.sp]||b.sp||'')}</span></span>
     ${parts.length?`<span class="boost"><em>บัฟให้ตัวละคร</em>${parts.map(esc).join('<br>')}</span>`:''}</div></article>`});
  $('#bc-grid').innerHTML=h||'<p class="muted">ไม่มีบัดดี้ที่ตรงกับตัวกรอง</p>';
};
$('#bc-q').addEventListener('input',e=>{bcQ=e.target.value.trim().toLowerCase();renderBuddyCards()});
renderMedia=function(){
  $('#gift-grid').innerHTML=MEDIA.gifts.map(g=>`<div class="gift">${g.img?IMG(g.img,'',g.n):blank(g.n,'blank" style="width:56px;height:56px;font-size:8px')}<span>${esc(g.n)}</span></div>`).join('');
  $('#bd-feature').innerHTML=MEDIA.buddies.map(b=>`<figure>${IMG(b.img,'',b.n,`data-zoom="${b.img}" data-cap="${esc(b.n)}"`)}<figcaption><b>${esc(b.n)}</b>${b.id==='arya'?'SSR · Disruptor · บัดดี้คู่กับ Freya':'SSR · Support · บัดดี้คู่กับ Stylia'}</figcaption></figure>`).join('');
  renderBuddyCards();
  $('#home-outfits').innerHTML=MEDIA.outfits.map(o=>`<figure>${IMG(o.img,'',o.n,`data-zoom="${o.full||o.img}" data-cap="${esc(o.n)}"`)}<figcaption>${esc(o.n)}</figcaption></figure>`).join('');
  $('#home-chars').innerHTML=CH.slice(0,10).map(chCard).join('');
};
/* ---- weapons: tiers, Apex, material calculator ---- */
document.head.insertAdjacentHTML('beforeend','<style>.wbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.wbar select{width:auto}.apx{font-size:10px;font-weight:700;padding:1px 6px;background:#c9a227;color:#1a1406;margin-left:6px;vertical-align:2px}.wdet td{white-space:normal}.wdet table{min-width:0;font-size:13px}.wdet .grid2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:14px}@media (max-width:760px){.wdet .grid2{grid-template-columns:1fr}}.mtot div{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:3px 0;font-size:13px}.mtot b{font-family:var(--f-num)}</style>');
let wtR='max',wtApex=false,wtOpen=null,wtTo={};
const wdOf=w=>WD[w.slug]||{rows:[],mats:{}};
const rowAt=(w,r)=>{const d=wdOf(w);if(r==='max')return {r:w.r,atk:w.atk,aff:w.aff,ev:w.ev,sh:w.sh};return d.rows.find(x=>x.r===+r)};
function chainTotals(w,target){
  const tot={};const add=(m)=>m.items.forEach(([n,q])=>{tot[n]=(tot[n]||0)+(q||0)});
  const chain=[];let k=w.slug,guard=0;while(k&&WD[k]&&guard++<20){chain.unshift(k);k=WD[k].up}
  chain.forEach((sl,i)=>{const d=WD[sl];const lim=i<chain.length-1?(WD[chain[i+1]].rows[0]||{r:99}).r-1:target;Object.entries(d.mats).forEach(([r,m])=>{if(+r<=lim)add(m)})});
  return {tot,chain};
}
function weaponDetail(w){
  const d=wdOf(w);const tgt=wtTo[w.id]||(d.rows.length?d.rows[d.rows.length-1].r:w.r);
  const {tot,chain}=chainTotals(w,tgt);const names=chain.map(x=>{const g=WEAPONS.find(y=>y.slug===x);return g?g.n.replace(/ \((Fire|Water|Thunder|Ice|Dragon)\)$/,''):x});
  const tiers=`<table><thead><tr><th>ระดับ</th><th>ชื่อ</th><th>โจมตี</th><th>คริ</th><th>ธาตุ</th><th>ความคม</th><th>วัตถุดิบขั้นนี้</th></tr></thead><tbody>${d.rows.map(r=>{const m=d.mats[r.r];return `<tr><td class="num">R${r.r}</td><td>${esc(r.n)}</td><td class="num">${r.atk??'—'}</td><td class="num">${r.aff==null?'—':r.aff+'%'}</td><td class="num">${r.ev==null?'—':(r.el?(WK_TH[{Paralyzed:'para',Paralysis:'para'}[r.el]||r.el.toLowerCase()]||r.el)+' ':'')+r.ev}</td><td>${esc(r.sh||'—')}</td><td style="font-size:12px">${m?`<b>${m.kind==='Craft'?'สร้าง':'อัป'}</b> `+m.items.map(([n,q])=>`${matLink(n)} ×${(q||0).toLocaleString()}`).join(' · '):'—'}</td></tr>`}).join('')}</tbody></table>`;
  const opts=d.rows.map(r=>`<option value="${r.r}" ${r.r===tgt?'selected':''}>R${r.r}</option>`).join('');
  return `<div class="grid2"><div class="tbl-wrap">${tiers}</div><div><b style="font-family:var(--f-display)">วัตถุดิบรวม ตั้งแต่ขั้นแรกถึง</b> <select class="input" style="width:auto;padding:4px 8px" data-wto="${w.id}">${opts}</select>
   <div class="src2" style="margin:4px 0 8px">นับต่อจากสายอัปเกรด: ${names.map(esc).join(' → ')}</div>
   <div class="mtot">${Object.entries(tot).sort((a,b)=>a[0]==='Zenny'?1:b[0]==='Zenny'?-1:0).map(([n,q])=>`<div><span>${matLink(n)}</span><b>×${q.toLocaleString()}</b></div>`).join('')||'<span class="muted">ยังไม่มีข้อมูลวัตถุดิบ</span>'}</div>
   ${w.apex?'<p class="src2">อาวุธ Apex: เลือกธาตุตอนสร้าง (ไฟ น้ำ สายฟ้า น้ำแข็ง มังกร) ค่าสถานะเท่ากันทุกธาตุ</p>':''}<p class="src2">ช่องที่เป็น “—” คือเว็บต้นทางยังไม่มีค่า</p></div></div>`;
}
renderWeapons=function(){
  $('#wt-list').innerHTML=WTYPES.map(t=>`<button aria-pressed="${t.id===wtSel}" data-wt="${t.id}">${wIcon(t.id)}<span>${t.n}<small style="display:block;font-size:11px;opacity:.75">${t.th} · ${WEAPONS.filter(w=>w.t===t.id&&!(w.apex&&!/\(Fire\)$/.test(w.n))).length} ชิ้น</small></span></button>`).join('');
  const t=WT_BY[wtSel];
  let ws=WEAPONS.filter(w=>w.t===wtSel&&(!wtApex||w.apex)&&!(w.apex&&!/\(Fire\)$/.test(w.n)));
  if(wtR!=='max')ws=ws.filter(w=>{const r=rowAt(w,wtR);return r});
  const val=(w,f)=>{const r=rowAt(w,wtR);return r?r[f]:null};
  ws.sort((a,b)=>wtSort==='aff'?(val(b,'aff')??-99)-(val(a,'aff')??-99):wtSort==='r'?b.rmax-a.rmax||(b.atk??0)-(a.atk??0):(val(b,'atk')??-1)-(val(a,'atk')??-1));
  $('#wt-info').innerHTML=`<div><div class="eyebrow">${t.ab}</div><h3 style="display:flex;align-items:center;gap:10px">${MEDIA.weaponIcons[t.id]?IMG(MEDIA.weaponIcons[t.id],'',t.n,'style="width:40px;height:40px;filter:var(--icon-filter)"'):''}${t.n}</h3><div class="muted" style="margin:-2px 0 8px">${t.th}</div><p>${esc(t.d)}</p></div>
   <div class="wbar" style="align-content:start"><label class="muted" for="wt-r">แสดงค่าที่ระดับ</label><select class="input" id="wt-r">${['max',...Array.from({length:14},(_,i)=>i+1)].map(r=>`<option value="${r}" ${String(r)===String(wtR)?'selected':''}>${r==='max'?'สูงสุดที่มีข้อมูล':'R'+r}</option>`).join('')}</select><button class="chip" type="button" aria-pressed="${wtApex}" id="wt-apex">เฉพาะ Apex</button></div>`;
  const th=(k,l)=>`<th><button class="x-btn" style="color:${wtSort===k?'var(--brass)':'inherit'};padding:0;font:inherit" data-wsort="${k}">${l}${wtSort===k?' ↓':''}</button></th>`;
  $('#wt-table').innerHTML=`<thead><tr><th>ชื่ออาวุธ</th>${th('r','ระดับ')}${th('atk','โจมตี')}${th('aff','คริ')}<th>ธาตุ</th><th>ความคม</th><th></th></tr></thead><tbody>${ws.map(w=>{const r=rowAt(w,wtR)||{};const im=weaponImg(w.n)||MEDIA.weaponIcons[w.t];const nm=w.apex?w.n.replace(/ \(Fire\)$/,''):w.n;
    return `<tr class="${rcls(w.rmax)}"><td class="rname" style="font-weight:600">${IMG(im,'gi',nm,'style="width:32px;height:32px;margin-right:8px;vertical-align:middle"')}${esc(nm)}${w.apex?'<span class="apx">APEX</span>':''}</td><td><span class="rar">R${w.rmin}–${w.rmax}</span></td><td class="num">${r.atk??'—'}</td><td>${affText(r.aff)}</td><td>${w.apex?'<span class="muted">เลือกได้</span>':w.el?`${ei(w.el)} ${WK_TH[w.el]} <span class="num">${r.ev??'—'}</span>`:'<span class="muted">—</span>'}</td><td>${r.sh?`<span class="sharp sh-${r.sh}"></span>${r.sh}`:'—'}</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" data-wdet="${w.id}">${wtOpen===w.id?'ปิด':'ระดับ/วัตถุดิบ'}</button> <button class="btn btn-ghost btn-sm" data-useweapon="${w.id}">ใช้ในบิลด์</button></td></tr>`}).join('')}</tbody>`;
  if(!$('#wt-det'))$('#wt-info').insertAdjacentHTML('afterend','<div id="wt-det" class="wdet panel" style="padding:14px;margin-bottom:14px"></div>');
  const ow=WEAPONS.find(x=>x.id===wtOpen);$('#wt-det').hidden=!ow;$('#wt-det').innerHTML=ow?`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px"><b style="font-family:var(--f-display);font-size:18px">${esc(ow.apex?ow.n.replace(/ \(Fire\)$/,''):ow.n)}</b><button class="btn btn-ghost btn-sm" data-wdet="${ow.id}">ปิด</button></div>${weaponDetail(ow)}`:'';
};
document.addEventListener('change',e=>{if(e.target.id==='wt-r'){wtR=e.target.value;renderWeapons()}if(e.target.dataset.wto){wtTo[e.target.dataset.wto]=+e.target.value;renderWeapons()}});
document.addEventListener('click',e=>{if(e.target.id==='wt-apex'){wtApex=!wtApex;renderWeapons();return}const d=e.target.closest('[data-wdet]');if(d){wtOpen=wtOpen===d.dataset.wdet?null:d.dataset.wdet;renderWeapons();if(wtOpen)$('#wt-det').scrollIntoView({block:'start'})}});
const _rp=renderPicker;
renderPicker=function(){_rp();if(P&&P.kind==='weapon')document.querySelectorAll('#sheet-list .opt[data-choose]').forEach(o=>{const w=W_BY[o.dataset.choose];if(!w)return;const im=weaponImg(w.n);if(im)o.querySelector('.nm').insertAdjacentHTML('afterbegin',IMG(im,'gi',w.n))})};
/* ---- builder: build card with SET / element MAX / MAX tags + save as image ---- */
function builderCardHTML(){
  const R=compute(),w=R.w;const ek=w&&ELSK[w.el]?w.el:'';
  const setIds=new Set(Object.entries(R.sets).filter(([k,n])=>n>=SET_BY[k].b.p).map(([k])=>SET_BY[k].b.s));
  const chips=[];
  Object.entries(R.sets).forEach(([k,n])=>{const st=SET_BY[k];if(n>=st.b.p)chips.push({n:st.b.n,tag:'set'})});
  Object.keys(R.raw).sort((a,b)=>R.raw[b]-R.raw[a]).forEach(id=>{const mx=SK[id].lv.length,l=Math.min(R.raw[id],mx);
    const isEl=Object.values(ELSK).includes(id);const tag=isEl&&l>=7?'elem':l>=mx&&mx>1?'max':null;chips.push({n:`${SK[id].en} ${l}`,tag})});
  chips.sort((a,b)=>({set:0,elem:1,max:2}[a.tag]??3)-({set:0,elem:1,max:2}[b.tag]??3));
  const wi=w&&(weaponImg(w.n)||MEDIA.weaponIcons[w.t]);
  return `<div class="bc2" style="--elc:${ek?ECOL[ek]:'var(--brass)'}"><div class="bcol"><h6>บิลด์ของฉัน<small>${w?esc(WT_BY[w.t].n):'ยังไม่เลือกอาวุธ'}</small></h6>
   <div class="bw">${wi?IMG(wi,'',w.n):blank('อาวุธ')}<div><b>${w?esc(w.n):'—'}</b><span>${w?`ATK ${w.atk??'—'}${w.el?` · ${WK_TH[w.el]} ${R.ev}`:''} · คริ ${R.aff}%`:''}</span></div></div>
   ${SLOTS.map(sl=>{const a=B.armor[sl]&&AR_BY[B.armor[sl]];return `<div class="ba"><span class="sl">${SLOT_TH[sl]}</span>${a&&a.icon?IMG(a.icon,'',a.n):blank(SLOT_TH[sl])}<span>${a?esc(a.n):'<span class="muted">ว่าง</span>'}</span></div>`}).join('')}
   <div class="chipz">${chips.map(chip).join('')||'<span class="muted" style="border:0">ยังไม่มีสกิล</span>'}</div>
   ${(B.vis||[]).length&&typeof vById==='function'?`<div class="bvis">${B.vis.map((c,k)=>{const v=vById(c.id);return v?`<span title="${esc(v.n)}" style="border-color:${{r:'#5aa6dc',e:'#9b7be0',s:'#e0b552'}[c.r]}">${v.img?IMG(v.img,'',v.n):''}${k===0?'<i>CORE</i>':''}</span>`:''}).join('')}</div>`:''}<div class="legend"><span>▮ เซ็ตเกราะ</span><span style="color:var(--elc)">▮ ธาตุเต็ม Lv7</span><span>▯ สกิลเต็มลิมิต</span><span style="margin-left:auto">MHOUTLANDERTHGUILD · mhoutlanderthguild.pages.dev</span></div></div></div>`;
}
const _rb=renderBuilder;
renderBuilder=function(){_rb();$('#bd-card').innerHTML=builderCardHTML();preShot();
  document.querySelectorAll('#gear .gear-row').forEach(r=>{const k=r.querySelector('[data-pick]');if(!k||k.dataset.pick!=='weapon')return;const w=B.weapon&&W_BY[B.weapon];const im=w&&weaponImg(w.n);if(im)r.querySelector('.gear-ic').innerHTML=IMG(im,'',w.n,'style="width:48px;height:48px;object-fit:contain"')})};
/* save as image: render only the card (skip the rest of the page) and pre-render in the background */
const SHOT={key:null,blob:null,url:null,busy:null};
// draw the card straight onto a canvas (no html2canvas): instant and works on iPhone Safari
function loadImg(src){return new Promise(r=>{if(!src)return r(null);const i=new Image();i.decoding='async';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src;if(i.complete&&i.naturalWidth)r(i)})}
async function drawCard(){
  const R=compute(),w=R.w,cs=getComputedStyle(document.documentElement),V=n=>cs.getPropertyValue(n).trim();
  const ek=w&&ELSK[w.el]?w.el:'';const EC=ek?V('--'+ek):V('--brass');
  const FD='"Chakra Petch","IBM Plex Sans Thai",sans-serif',FB='"IBM Plex Sans Thai",sans-serif';
  const chips=[];Object.entries(R.sets).forEach(([k,n])=>{const st=SET_BY[k];if(n>=st.b.p)chips.push({n:st.b.n,tag:'set'})});
  Object.keys(R.raw).sort((a,b)=>R.raw[b]-R.raw[a]).forEach(id=>{const mx=SK[id].lv.length,l=Math.min(R.raw[id],mx);const isEl=Object.values(ELSK).includes(id);chips.push({n:`${SK[id].en} ${l}`,tag:isEl&&l>=7?'elem':l>=mx&&mx>1?'max':null})});
  chips.sort((a,b)=>({set:0,elem:1,max:2}[a.tag]??3)-({set:0,elem:1,max:2}[b.tag]??3));
  const W=1080,P=48,S=2;const c=document.createElement('canvas');const x=c.getContext('2d');
  // measure chip rows
  x.font=`600 30px ${FD}`;let cx=P,cy=0,rowsH=0;const pos=[];
  chips.forEach(ch=>{const tw=x.measureText(ch.n).width+(ch.tag?(ch.tag==='set'?70:80):0)+36;if(cx+tw>W-P){cx=P;cy+=58}pos.push([cx,cy,tw]);cx+=tw+12});rowsH=chips.length?cy+50:0;
  const VIS=(B.vis||[]).map(c=>[c,typeof vById==='function'?vById(c.id):null]).filter(x=>x[1]);const visH=VIS.length?120:0;const H=P+70+120+5*86+30+rowsH+130+visH;c.width=W;c.height=H;
  const items=[w?(weaponImg(w.n)||MEDIA.weaponIcons[w.t]):null,...SLOTS.map(sl=>{const a=B.armor[sl]&&AR_BY[B.armor[sl]];return a&&a.icon})];
  const imgs=await Promise.all(items.map(loadImg));
  x.fillStyle=V('--bg');x.fillRect(0,0,W,H);x.fillStyle=V('--surface-2');x.fillRect(16,16,W-32,H-32);x.strokeStyle=V('--line-2');x.lineWidth=2;x.strokeRect(16,16,W-32,H-32);
  let y=P+50;x.fillStyle=EC;x.font=`700 52px ${FD}`;x.fillText('บิลด์ของฉัน',P,y);const tw=x.measureText('บิลด์ของฉัน').width;x.fillStyle=V('--muted');x.font=`500 28px ${FB}`;x.fillText(w?WT_BY[w.t].n:'ยังไม่เลือกอาวุธ',P+tw+20,y);
  y+=30;if(imgs[0])x.drawImage(imgs[0],P,y,96,96);x.fillStyle=EC;x.font=`700 36px ${FD}`;x.fillText(w?w.n:'—',P+116,y+44);
  x.fillStyle=V('--muted');x.font=`400 26px ${FB}`;if(w)x.fillText(`ATK ${w.atk??'—'}${w.el?` · ${WK_TH[w.el]} ${R.ev}`:''} · คริ ${R.aff}%`,P+116,y+84);
  y+=114;x.fillStyle=EC;x.fillRect(P,y,W-2*P,5);y+=16;
  SLOTS.forEach((sl,i)=>{const a=B.armor[sl]&&AR_BY[B.armor[sl]];x.fillStyle=V('--surface');x.fillRect(P,y+18,74,40);x.fillStyle=V('--muted');x.font=`400 24px ${FB}`;x.textAlign='center';x.fillText(SLOT_TH[sl],P+37,y+46);x.textAlign='left';
    if(imgs[i+1])x.drawImage(imgs[i+1],P+92,y+6,64,64);x.fillStyle=V('--fg');x.font=`400 32px ${FB}`;x.fillText(a?a.n:'ว่าง',P+176,y+50);x.fillStyle=V('--line-2');x.fillRect(P,y+80,W-2*P,2);y+=86});
  y+=30;chips.forEach((ch,i)=>{const [px,py,tw]=pos[i];const Y=y+py;
    if(ch.tag==='set'){x.fillStyle='#efe9dc';x.fillRect(px,Y,tw,46)}else if(ch.tag==='elem'){x.fillStyle=EC;x.fillRect(px,Y,tw,46)}else{x.strokeStyle=ch.tag==='max'?EC:V('--line-2');x.lineWidth=2;x.strokeRect(px+1,Y+1,tw-2,44)}
    x.fillStyle=ch.tag==='set'?'#1a1406':ch.tag==='elem'?V('--on-brass'):ch.tag==='max'?EC:V('--fg');x.font=`600 30px ${FD}`;x.fillText(ch.n,px+18,Y+33);
    if(ch.tag){const lab=ch.tag==='set'?'SET':'MAX';const lx=px+18+x.measureText(ch.n).width+10;x.font=`700 20px ${FD}`;const lw=x.measureText(lab).width+12;x.fillStyle=ch.tag==='set'?'#1a1406':ch.tag==='elem'?V('--surface'):EC;x.fillRect(lx,Y+10,lw,26);x.fillStyle=ch.tag==='set'?'#efe9dc':ch.tag==='elem'?EC:V('--surface');x.fillText(lab,lx+6,Y+30)}});
  if(VIS.length){const vi=await Promise.all(VIS.map(([c,v])=>loadImg(v.img)));y+=rowsH+20;x.fillStyle=V('--muted');x.font=`600 24px ${FD}`;x.fillText('VISAGE',P,y+20);
    VIS.forEach(([c,v],k)=>{const X=P+130+k*96;x.strokeStyle={r:'#5aa6dc',e:'#9b7be0',s:'#e0b552'}[c.r];x.lineWidth=4;x.strokeRect(X,y-14,80,80);if(vi[k])x.drawImage(vi[k],X+4,y-10,72,72);if(k===0){x.fillStyle='#e0b552';x.fillRect(X,y+56,80,14);x.fillStyle='#111';x.font=`700 12px ${FD}`;x.fillText('CORE',X+22,y+67)}});y+=visH-rowsH-20}
  y+=rowsH+40;x.font=`400 22px ${FB}`;x.fillStyle=V('--muted');x.fillText('▮ เซ็ตเกราะ   ▯ สกิลเต็มลิมิต',P,y);x.fillStyle=EC;x.fillText('▮ ธาตุเต็ม Lv7',P+330,y);x.fillStyle=V('--muted');x.textAlign='right';x.fillText('MHOUTLANDERTHGUILD · mhoutlanderthguild.pages.dev',W-P,y+40);x.textAlign='left';
  return c;
}
async function makeShot(){
  const key=JSON.stringify([B.weapon,B.armor,B.cond,B.vis,document.documentElement.dataset.theme||'']);
  if(SHOT.key===key&&SHOT.blob)return SHOT;if(SHOT.busy&&SHOT.busyKey===key)return SHOT.busy;
  SHOT.busyKey=key;SHOT.busy=(async()=>{const cv=await drawCard();const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
    if(SHOT.url)URL.revokeObjectURL(SHOT.url);Object.assign(SHOT,{key,blob,url:URL.createObjectURL(blob),busy:null});return SHOT})();
  SHOT.busy.catch(()=>{SHOT.busy=null});return SHOT.busy;
}
let shotT;const preShot=()=>{clearTimeout(shotT);shotT=setTimeout(()=>{if(location.hash==='#builder')(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>makeShot().catch(()=>{}))},700)};
window.addEventListener('hashchange',preShot);
$('#bd-shot').addEventListener('click',async()=>{
  const btn=$('#bd-shot');const fn='mhoutlanderthguild-build.png';
  const ready=SHOT.blob&&SHOT.key===JSON.stringify([B.weapon,B.armor,B.cond,B.vis,document.documentElement.dataset.theme||'']);
  if(!ready){btn.disabled=true;btn.textContent='กำลังสร้างรูป…'}
  try{
    const r=ready?SHOT:await makeShot();if(!r)throw 0;
    let done=false;
    if(ready&&navigator.canShare&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){const file=new File([r.blob],fn,{type:'image/png'});if(navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'บิลด์ MHOUTLANDERTHGUILD'});done=true}catch(e){}}}
    if(!done){const a=document.createElement('a');a.href=r.url;a.download=fn;document.body.appendChild(a);a.click();a.remove()}
    $('#lb-img').src=r.url;$('#lb-img').alt='การ์ดบิลด์';$('#lb-cap').innerHTML=`รูปบิลด์พร้อมแล้ว · มือถือ: กดค้างที่รูปแล้วเลือก “บันทึกรูป” · <a href="${r.url}" download="${fn}" style="color:#f3c04a">ดาวน์โหลด</a>`;
    $('#lb').hidden=false;$('#lb-scroll').scrollTop=0;document.body.style.overflow='hidden';
  }catch(e){toast('สร้างรูปไม่สำเร็จ ลองรีเฟรชหน้าแล้วกดใหม่')}
  finally{btn.disabled=false;btn.textContent='บันทึกเป็นรูป'}
});
/* ---- home ---- */
const _rh=renderHome;
renderHome=function(){_rh();document.querySelectorAll('#weak-table img').forEach(i=>{const d=SZ[i.getAttribute('src')];if(d){i.width=d[0];i.height=d[1]}})};
/* fill width/height for any image rendered by older templates */
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;(n.tagName==='IMG'?[n]:n.querySelectorAll('img')).forEach(i=>{const k=(i.getAttribute('src')||'').split('?')[0],h=HDM[k];if(h&&h.set.length>1&&!i.hasAttribute('srcset')){i.setAttribute('sizes',i.dataset.sizes||h.sizes);i.setAttribute('srcset',h.set.map(([w,p])=>p+' '+w+'w').join(', '))}if(!i.hasAttribute('loading')&&!i.classList.contains('hero-art'))i.setAttribute('loading','lazy');const d=SZ[i.getAttribute('src')];if(d&&!i.hasAttribute('width')){i.setAttribute('width',d[0]);i.setAttribute('height',d[1])}})}}).observe(document.body,{childList:true,subtree:true});
/* ---- builder: boss image + multi-skill search ---- */
document.head.insertAdjacentHTML('beforeend','<style>.boss{display:flex;gap:12px;align-items:center;background:var(--surface-2);padding:10px;border:1px solid var(--line)}.boss img{width:84px;height:84px;object-fit:contain}.boss b{font-family:var(--f-display);font-size:18px}#msk-chips{max-height:150px;overflow-y:auto}#msk-chips .chip small{opacity:.7;margin-left:4px}.mrow{display:flex;gap:8px;align-items:center;padding:6px 0;border-top:1px solid var(--line);font-size:13px}.mrow img{width:34px;height:34px;object-fit:contain;background:var(--surface-2)}.mrow .n{flex:1;min-width:0}.mrow .n b{display:block;font-size:14px}.mrow .tag.hit-tag{font-weight:700}.mslot{font-family:var(--f-display);font-size:12px;color:var(--brass);margin-top:8px}</style>');
const MSK=new Set();
function mskRender(){
  const q=$('#msk-q').value.trim().toLowerCase();
  const ids=Object.keys(SK).filter(id=>ARMOR.some(a=>a.s.some(x=>x[0]===id))||SETS.some(st=>st.b.s===id));
  const show=ids.filter(id=>MSK.has(id)||(q&&(SK[id].en+' '+SK[id].th).toLowerCase().includes(q))).sort((a,b)=>(MSK.has(b)-MSK.has(a))||SK[a].en.localeCompare(SK[b].en));
  $('#msk-chips').innerHTML=(q||MSK.size)?show.slice(0,40).map(id=>`<button class="chip" type="button" aria-pressed="${MSK.has(id)}" data-msk="${id}">${esc(SK[id].en)}<small>${esc(SK[id].th)}</small></button>`).join('')||'<span class="muted" style="font-size:12px">ไม่พบสกิล</span>':'<span class="muted" style="font-size:12px">พิมพ์เพื่อค้นหา แล้วกดเลือกได้หลายสกิล</span>';
  if(!MSK.size){$('#msk-res').innerHTML='';return}
  const sel=[...MSK];const score=a=>sel.reduce((t,id)=>{const x=a.s.find(y=>y[0]===id);return t+(x?100+x[1]:0)},0)+(sel.includes(SET_BY[a.set].b.s)?50:0);
  const setsHit=SETS.filter(st=>sel.includes(st.b.s));
  let h=setsHit.length?`<div class="mslot">เซ็ทสกิลที่ตรง: ${setsHit.map(st=>`${esc(st.b.n)} (${esc(st.n)} · ${st.b.p} ชิ้น)`).join(' · ')}</div>`:'';
  SLOTS.forEach(sl=>{const L=ARMOR.filter(a=>a.slot===sl&&score(a)>0).sort((x,y)=>score(y)-score(x)||y.d-x.d).slice(0,6);if(!L.length)return;
    h+=`<div class="mslot">${SLOT_TH[sl]}</div>`+L.map(a=>`<div class="mrow">${a.icon?IMG(a.icon,'',a.n):''}<div class="n"><b>${esc(a.n)}</b><span class="tags">${a.s.map(([id,lv])=>`<span class="tag ${MSK.has(id)?'hit-tag':''}">${esc(SK[id].en)} ${lv}</span>`).join('')}${sel.includes(SET_BY[a.set].b.s)?`<span class="tag hit-tag">SET ${esc(SET_BY[a.set].b.n)}</span>`:''}</span></div><button class="btn ${B.armor[sl]===a.id?'btn-ghost':'btn-brass'} btn-sm" type="button" data-mput="${a.id}">${B.armor[sl]===a.id?'ใส่อยู่':'ใส่'}</button></div>`).join('')});
  $('#msk-res').innerHTML=h;
}
$('#msk-q').addEventListener('input',mskRender);
document.addEventListener('click',e=>{const c=e.target.closest('[data-msk]');if(c){const k=c.dataset.msk;MSK.has(k)?MSK.delete(k):MSK.add(k);mskRender();return}
  const u=e.target.closest('[data-mput]');if(u){const a=AR_BY[u.dataset.mput];B.armor[a.slot]=a.id;saveCur();renderBuilder();toast('ใส่ '+a.n+' แล้ว')}});
const _rb2=renderBuilder;
renderBuilder=function(){_rb2();if(typeof mskRender==='function'&&MSK.size)mskRender();const m=MON_BY[B.target];const box=$('#bd-match');
  if(m&&box){const ic=MM[m.k]&&MM[m.k].icon,vis=MEDIA.visages[m.k];box.insertAdjacentHTML('afterbegin',`<div class="boss" style="flex-basis:100%">${IMG(ic,'',m.n)}<div><b>${esc(m.n)}</b><div class="muted" style="font-size:12px">${esc(m.clsTh||'')}</div></div>${vis?IMG(vis.img,'',vis.n,'style="margin-left:auto;width:64px;height:64px" title="Visage"'):''}</div>`)}};
/* persist the skill search (text + selected skills) */
try{const sv=JSON.parse(localStorage.getItem('mho_msk')||'{}');if(sv.q)$('#msk-q').value=sv.q;(sv.s||[]).forEach(id=>SK[id]&&MSK.add(id))}catch(e){}
const mskSave=()=>{try{localStorage.setItem('mho_msk',JSON.stringify({q:$('#msk-q').value,s:[...MSK]}))}catch(e){}};
$('#msk-q').addEventListener('input',mskSave);document.addEventListener('click',e=>{if(e.target.closest('[data-msk]'))mskSave()});
// keep the picker search text between openings
const _op=openPicker;let lastQ={};openPicker=function(k){_op(k);const q=lastQ[k]||'';$('#sheet-q').value=q;P.q=q;renderPicker()};
$('#sheet-q').addEventListener('input',e=>{if(P)lastQ[P.kind]=e.target.value});
/* boss source on every gear row */
document.head.insertAdjacentHTML('beforeend','<style>.from{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);margin-top:4px}.from img{width:26px;height:26px;object-fit:contain}.from b{color:var(--fg)}.dmg td{white-space:normal}.dmg .big{font-family:var(--f-display);font-size:30px;color:var(--brass)}.dmgopt{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}</style>');
const monKey=n=>n?slugify(n):null;
function bossHTML(n){if(!n)return '<div class="from">ได้จาก: วัตถุดิบทั่วไป (ไม่ใช่บอส)</div>';const k=monKey(n);return `<div class="from">ได้จาก: ${MM[k]?IMG(MM[k].icon,'',n):''}<b>${esc(n)}</b></div>`}
/* damage estimate */
const DMGON={};
function dmgSkills(R){const out=[];Object.keys(R.raw).forEach(id=>{const l=Math.min(R.raw[id],SK[id].lv.length);const t=SK[id].lv[l-1]||'';const m=t.match(/ดาเมจ(?:ของท่านั้น)? \+(\d+(?:\.\d+)?)%/);if(m&&!/ดาเมจธาตุ/.test(t.slice(0,m.index+10)))out.push({id,l,p:+m[1],t})});return out}
function renderDmg(){
  const R=compute(),w=R.w;if(!w){$('#bd-dmg').innerHTML='<p class="muted">เลือกอาวุธก่อน</p>';return}
  const ds=dmgSkills(R);ds.forEach(d=>{if(!(d.id in DMGON))DMGON[d.id]=true});
  const dmgP=ds.filter(d=>DMGON[d.id]).reduce((t,d)=>t+d.p,0);
  const VB=R.vis||{};const aff=Math.max(-100,Math.min(100,R.aff));const CM=1.25+(VB.cd||0)/100;const crit=aff>=0?1+aff/100*(CM-1):1+aff/100*0.25;
  const ce=([0,5,10,15][R.lv('critical-element')]||0)+(VB.ecd||0);
  const rad=VB.radiant||0;const atk=Math.round((w.atk||0)*(1+(VB.atkp||0)/100)+(VB.atk||0));const raw=atk*(1+(dmgP+(VB.phys||0)+rad)/100)*crit;
  let ev=w.el&&ELSK[w.el]!==undefined?R.ev:0;const eb=R.eb||0;const ele=ev*(1+eb/100)*(1+(dmgP+rad)/100)*(1+Math.max(0,aff)/100*ce/100);
  const m=MON_BY[B.target];let note='';
  if(m&&m.w&&w.el){const st=m.w[WK.indexOf(w.el)];note=`ธาตุ${WK_TH[w.el]}ต่อ ${esc(m.n)}: ${st}/3 ดาว`}
  $('#bd-dmg').innerHTML=`<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:end"><div><div class="muted" style="font-size:12px">ดาเมจรวมต่อหน่วย (กายภาพ + ธาตุ)</div><div class="big num">${(raw+ele).toFixed(1)}</div></div><div class="muted" style="font-size:13px">กายภาพ <b class="num">${raw.toFixed(1)}</b> · ธาตุ <b class="num">${ele.toFixed(1)}</b>${note?' · '+note:''}</div></div>
   ${ds.length?`<div class="muted" style="font-size:12px;margin-top:8px">สกิลเพิ่มดาเมจที่มีเงื่อนไข (กดเปิด/ปิด)</div><div class="dmgopt">${ds.map(d=>`<button class="chip" type="button" aria-pressed="${DMGON[d.id]}" data-dmg="${d.id}" title="${esc(d.t)}">${esc(SK[d.id].en)} ${d.l} · +${d.p}%</button>`).join('')}</div>`:''}
   <div class="tbl-wrap dmg"><table><tbody>
    <tr><td>พลังโจมตี (อาวุธ + การ์ด/Apex)</td><td class="num">${atk}${(VB.atkp||VB.atk)?` <small class="muted">(ฐาน ${w.atk||0})</small>`:''}</td></tr>${(VB.cd||VB.phys||rad)?`<tr><td>จากการ์ด/Apex</td><td class="num">${VB.cd?`ดาเมจคริ +${VB.cd}% `:''}${VB.phys?`กายภาพ +${VB.phys}% `:''}${rad?`Radiant +${rad}%`:''}</td></tr>`:''}
    <tr><td>คริติคอล (รวมสกิลและเงื่อนไขด้านบน)</td><td class="num">${aff}% → ตัวคูณ ×${crit.toFixed(3)}</td></tr>
    <tr><td>ดาเมจเพิ่มจากสกิลที่เปิดอยู่</td><td class="num">+${dmgP}%</td></tr>
    <tr><td>ค่าธาตุ${w.el?' '+WK_TH[w.el]:''}</td><td class="num">${ev}${eb?` · ดาเมจธาตุ +${eb}%`:''}${ce?` · คริติคอลธาตุ +${ce}%`:''}</td></tr>
   </tbody></table></div>
   <p class="src2">สูตร: กายภาพ = ATK × (1 + ดาเมจ%) × (1 + คริ% × 0.25) · ธาตุ = ค่าธาตุ × (1 + ดาเมจธาตุ%) × (1 + ดาเมจ%) × (1 + คริ% × คริติคอลธาตุ%) · ตัวคูณคริ 1.25 และสูตรนี้เป็นค่าประมาณตามระบบ Monster Hunter ทั่วไป ยังไม่รวมค่าท่าโจมตี (motion value) และความแข็งของจุดที่ตี เกมไม่ได้เปิดเผยสูตรจริง ใช้เปรียบเทียบบิลด์กันเอง</p>`;
}
document.addEventListener('click',e=>{const c=e.target.closest('[data-dmg]');if(c){DMGON[c.dataset.dmg]=!DMGON[c.dataset.dmg];renderDmg()}});
const _rb3=renderBuilder;
renderBuilder=function(){_rb3();
  document.querySelectorAll('#gear .gear-row').forEach(r=>{const k=r.querySelector('[data-pick]');if(!k)return;const key=k.dataset.pick;let n=null,has=false;
    if(key==='weapon'){const w=B.weapon&&W_BY[B.weapon];if(w){has=true;n=w.m}}else{const a=B.armor[key]&&AR_BY[B.armor[key]];if(a){has=true;n=SET_BY[a.set].m}}
    if(has){const sub=r.querySelector('.gear-main');sub.insertAdjacentHTML('beforeend',bossHTML(n))}});
  renderDmg()};
mskRender();
renderChars();renderMedia();renderHome();renderMonsters();initArmor();renderArmor();renderWeapons();renderSkills();renderBuilder();route();

/* ---- community builds: public sharing, owner-only edit via secret token ---- */
const OWN={get(){try{return JSON.parse(localStorage.getItem('mho_owned')||'{}')}catch(e){return {}}},set(o){try{localStorage.setItem('mho_owned',JSON.stringify(o))}catch(e){}}};
let EDIT=null,cmTab='pub',cmPub=null,cmMine=null;
async function capi(path,opt={}){const id=opt.id,o=OWN.get();const h={'content-type':'application/json'};if(id&&o[id])h['x-owner-token']=o[id].t;
  const r=await fetch('/api/builds'+(id?'/'+id:''),{method:opt.method||'GET',headers:h,body:opt.body?JSON.stringify(opt.body):undefined});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(j.error||r.status),{status:r.status});return j}
const pubBody=()=>({name:$('#pub-name').value.trim(),author:$('#pub-author').value.trim(),desc:$('#pub-desc').value.trim(),public:$('#pub-public').checked,build:B});
function pubForm(){const e=EDIT&&OWN.get()[EDIT];$('#pub-title').textContent=e?'กำลังแก้ไข: '+e.name:'เผยแพร่บิลด์นี้';$('#pub-save').textContent=e?'บันทึกการแก้ไข':'เผยแพร่';$('#pub-new').hidden=$('#pub-del').hidden=!e;
  $('#pub-info').innerHTML=e?`ลิงก์: <a href="#b-${EDIT}">${location.origin}/#b-${EDIT}</a> · <button class="x-btn" data-cmcode="${EDIT}" type="button">คัดลอกรหัสผู้ลง</button>`:'สิทธิ์แก้ไขผูกกับเบราว์เซอร์ที่ใช้ลงบิลด์ เก็บ “รหัสผู้ลง” ไว้เพื่อแก้ไขจากเครื่องอื่น'}
async function pubSave(asNew){const btn=$('#pub-save');btn.disabled=true;const body=pubBody();if(!body.name){toast('ใส่ชื่อบิลด์ก่อน');btn.disabled=false;return}
  try{const o=OWN.get();if(EDIT&&o[EDIT]&&!asNew){await capi('',{id:EDIT,method:'PUT',body});o[EDIT].name=body.name;OWN.set(o);toast('บันทึกการแก้ไขแล้ว')}
    else{const j=await capi('',{method:'POST',body});o[j.build.id]={t:j.token,name:body.name};OWN.set(o);EDIT=j.build.id;toast(body.public?'เผยแพร่แล้ว':'บันทึกแบบส่วนตัวแล้ว')}
    try{localStorage.setItem('mho_author',body.author)}catch(e){}cmPub=cmMine=null;pubForm()}catch(e){toast(e.status===403?'แก้ไขได้เฉพาะผู้ลงบิลด์':'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง')}btn.disabled=false}
async function cmDel(id){if(!confirm('ลบบิลด์นี้ถาวร?'))return;try{await capi('',{id,method:'DELETE'});const o=OWN.get();delete o[id];OWN.set(o);if(EDIT===id){EDIT=null;pubForm()}cmPub=cmMine=null;renderCommunity();toast('ลบแล้ว')}catch(e){toast(e.status===403?'ลบได้เฉพาะผู้ลงบิลด์':'ลบไม่สำเร็จ')}}
async function cmOpen(id,edit){try{const j=await capi('',{id});const b=normalize(j.build.build);if(!b)throw 0;B=b;saveCur();
    EDIT=j.owner&&edit!==false?id:null;if(EDIT){$('#pub-name').value=j.build.name;$('#pub-author').value=j.build.author;$('#pub-desc').value=j.build.desc;$('#pub-public').checked=j.build.public}
    pubForm();if(location.hash!=='#builder')location.hash='builder';renderBuilder();toast('เปิด “'+j.build.name+'” โดย '+j.build.author)}catch(e){toast(e.status===403?'บิลด์นี้เป็นส่วนตัว':e.status===404?'ไม่พบบิลด์นี้':'โหลดไม่สำเร็จ')}}
const cmDate=t=>t?new Date(t).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'}):'';
function cmCard(s,mine){const w=W_BY[s.weapon];const wi=w&&(weaponImg(w.n)||MEDIA.weaponIcons[w.t]);
  return `<div class="saved-item" style="gap:10px;align-items:center">${wi?IMG(wi,'',w.n,'style="width:40px;height:40px;object-fit:contain"'):''}<span class="n" style="flex:1;min-width:0"><b>${esc(s.name)}</b><br><span class="muted" style="font-size:12px">${esc(s.author)} · ${w?esc(WT_BY[w.t].n)+' · '+esc(w.n):'ไม่มีอาวุธ'} · ${cmDate(s.updated)}${mine&&s.public===false?' · 🔒 ส่วนตัว':''}</span></span>
   <a class="btn btn-ghost btn-sm" href="#b-${s.id}">ดูบิลด์</a><button class="x-btn" data-cmlink="${s.id}" type="button">ลิงก์</button>${mine?`<button class="btn btn-ghost btn-sm" data-cmedit="${s.id}" type="button">แก้ไข</button><button class="x-btn" data-cmcode="${s.id}" type="button">รหัส</button><button class="x-btn" data-cmdel="${s.id}" type="button">ลบ</button>`:''}</div>`}
async function renderCommunity(){const L=$('#cm-list');if(!L)return;const o=OWN.get(),n=Object.keys(o).length;
  $('#cm-tabs').innerHTML=`<button class="chip" aria-pressed="${cmTab==='pub'}" data-cmtab="pub" type="button">บิลด์สาธารณะ</button><button class="chip" aria-pressed="${cmTab==='mine'}" data-cmtab="mine" type="button">บิลด์ของฉัน (${n})</button>`;
  const q=($('#cm-q').value||'').toLowerCase().trim();const f=a=>a.filter(s=>{if(!q)return true;const w=W_BY[s.weapon];return (s.name+' '+s.author+' '+(w?w.n+' '+WT_BY[w.t].n:'')).toLowerCase().includes(q)});
  try{if(cmTab==='pub'){if(!cmPub){L.innerHTML='<div class="empty-note">กำลังโหลด…</div>';cmPub=(await capi('')).builds}const a=f(cmPub);
      L.innerHTML=a.length?a.map(s=>cmCard(s,!!o[s.id])).join(''):'<div class="empty-note">ยังไม่มีบิลด์สาธารณะ ไปที่หน้าจัดบิลด์แล้วกด “เผยแพร่” เพื่อเป็นคนแรก</div>'}
    else{if(!cmMine){L.innerHTML='<div class="empty-note">กำลังโหลด…</div>';cmMine=[];for(const id of Object.keys(o)){try{const j=await capi('',{id});cmMine.push({...j.build,weapon:j.build.build.weapon})}catch(e){if(e.status===404){const x=OWN.get();delete x[id];OWN.set(x)}}}cmMine.sort((a,b)=>b.updated-a.updated)}
      const a=f(cmMine);L.innerHTML=(a.length?a.map(s=>cmCard(s,true)).join(''):'<div class="empty-note">ยังไม่มีบิลด์ของคุณในเบราว์เซอร์นี้</div>')+
      `<div class="save-box" style="margin-top:12px"><b style="font-family:var(--f-display)">กู้สิทธิ์ผู้ลงจากเครื่องอื่น</b><div class="save-line"><input class="input" id="cm-code" placeholder="วางรหัสผู้ลง เช่น abc123….xxxx"><button class="btn btn-brass btn-sm" id="cm-claim" type="button">เพิ่ม</button></div></div>`}}
  catch(e){L.innerHTML='<div class="empty-note">โหลดไม่สำเร็จ ลองรีเฟรชหน้า</div>'}}
const copyTxt=(t,m)=>{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>toast(m)).catch(()=>prompt('คัดลอก:',t));else prompt('คัดลอก:',t)};
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let t;
  if(t=g('[data-cmtab]')){cmTab=t.dataset.cmtab;renderCommunity()}
  else if(t=g('[data-cmopen]'))cmOpen(t.dataset.cmopen,false);
  else if(t=g('[data-cmedit]'))cmOpen(t.dataset.cmedit,true);
  else if(t=g('[data-cmdel]'))cmDel(t.dataset.cmdel);
  else if(t=g('[data-cmlink]'))copyTxt(location.origin+'/#b-'+t.dataset.cmlink,'คัดลอกลิงก์แล้ว');
  else if(t=g('[data-cmcode]')){const id=t.dataset.cmcode,o=OWN.get();if(o[id])copyTxt(id+'.'+o[id].t,'คัดลอกรหัสผู้ลงแล้ว เก็บไว้เป็นความลับ')}
  else if(g('#cm-claim')){const m=($('#cm-code').value||'').trim().match(/^([a-f0-9]{12})\.([a-f0-9]{32})$/);if(!m)return toast('รหัสไม่ถูกต้อง');const o=OWN.get();o[m[1]]={t:m[2],name:'…'};OWN.set(o);
    capi('',{id:m[1]}).then(j=>{if(!j.owner)throw 0;o[m[1]].name=j.build.name;OWN.set(o);cmMine=null;renderCommunity();toast('กู้สิทธิ์แล้ว')}).catch(()=>{const x=OWN.get();delete x[m[1]];OWN.set(x);toast('รหัสไม่ถูกต้องหรือบิลด์ถูกลบแล้ว')})}
  else if(g('#pub-save'))pubSave(false);else if(g('#pub-new'))pubSave(true);else if(g('#pub-del')&&EDIT)cmDel(EDIT);
});
let cmT;document.addEventListener('input',e=>{if(e.target.id==='cm-q'){clearTimeout(cmT);cmT=setTimeout(renderCommunity,150)}});
function cmRoute(){const h=location.hash;const m=h.match(/^#b-([a-f0-9]{12})$/);$('#cm-view').hidden=!m;$('#cm-browse').hidden=!!m;if(m)cmView(m[1]);else if(h==='#community'){cmCur=null;cmPub=null;renderCommunity()}}
let cmCur=null;
function viewHTML(r,owner){const b=normalize(r.build)||EMPTY();const keep=B;B=b;let card;try{card=builderCardHTML().replace('<h6>บิลด์ของฉัน','<h6>'+esc(r.author))}finally{B=keep}
  const R=compute(b),w=R.w;const ids=Object.keys(R.raw).sort((x,y)=>R.raw[y]-R.raw[x]);
  const gear=[['อาวุธ',w,w&&w.m,w?`${esc(WT_BY[w.t].n)} · R${w.r} · ATK ${w.atk??'—'} · คริ ${affText(w.aff)}`:''],...SLOTS.map(sl=>{const a=b.armor[sl]&&AR_BY[b.armor[sl]];return [SLOT_TH[sl],a,a&&SET_BY[a.set]&&SET_BY[a.set].m,a?`ป้องกัน ${a.d} · ${a.s.map(([id,l])=>esc(SK[id].en)+' '+l).join(', ')}`:'']})]
    .map(([lb,it,m,sub])=>`<div class="ol-row"><div class="k">${esc(lb)}</div><div class="v"><b>${it?esc(it.n):'<span class="muted">ว่าง</span>'}</b>${sub?`<span>${sub}</span>`:''}${it?bossHTML(m):''}</div></div>`).join('');
  const sets=Object.entries(R.sets).map(([k,n])=>{const st=SET_BY[k],on=n>=st.b.p;return `<div class="ol-row ${on?'set':''}"><div class="k">${esc(st.n)}<small>ใส่ ${n}/${st.b.p} ชิ้น</small></div><div class="v"><b>${on?'✔ ':''}${esc(st.b.n)}</b><span>${esc(SK[st.b.s].en)} +${st.b.add} · ${esc(st.b.d)}</span></div></div>`}).join('');
  const sk=ids.map(id=>{const s=SK[id],l=Math.min(R.raw[id],s.lv.length);return `<div class="ol-row"><div class="k">${esc(s.en)}<small>${esc(s.th)}</small></div><div class="v"><b>Lv${l}/${s.lv.length}</b><span>${esc(s.lv[l-1])}</span></div></div>`}).join('');
  const m=MON_BY[b.target];let tg='';if(m&&m.w){tg=`${monIcon(m.k)} <b>${esc(m.n)}</b>`;if(w&&w.el){const v=m.w[WK.indexOf(w.el)];tg+=` · ${ei(w.el)} ${WK_TH[w.el]} ${stars(v,w.el)}`}tg+=` <span class="muted">· จุดอ่อน: ${esc(m.wp)}</span>`}
  const cond=[['weak','โจมตีจุดอ่อน'],['enraged','มอนสเตอร์โกรธ'],['unleashed','Unleashed'],['radiant','Radiant']].filter(([k])=>b.cond[k]).map(x=>x[1]).join(', ');
  const P=(t,h)=>h?`<div class="panel" style="margin-top:14px"><div class="panel-h"><h3>${t}</h3></div><div style="padding:12px 16px;display:grid;gap:8px">${h}</div></div>`:'';
  return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><a class="btn btn-ghost btn-sm" href="#community">← กลับไปคลังบิลด์</a><button class="x-btn" data-cmlink="${r.id}" type="button">คัดลอกลิงก์</button>${owner?`<button class="btn btn-brass btn-sm" data-cmedit="${r.id}" type="button">แก้ไข (เจ้าของ)</button>`:''}</div>
   <h2 style="margin:0">${esc(r.name)}</h2><p class="muted" style="margin:4px 0 0">โดย ${esc(r.author)} · อัปเดต ${cmDate(r.updated)}${r.public?'':' · 🔒 ส่วนตัว'}</p>${r.desc?`<p style="white-space:pre-wrap">${esc(r.desc)}</p>`:''}
   <div style="margin-top:12px">${card}</div>
   ${P('ค่าสถานะ',`<div class="stats"><div class="stat"><span>พลังโจมตี</span><b class="num">${w&&w.atk!=null?w.atk:'—'}</b></div><div class="stat"><span>คริติคอล</span><b class="num">${w?R.aff+'%':'—'}</b>${R.affParts.length?`<em>${R.affParts.join(', ')}</em>`:''}</div><div class="stat"><span>ธาตุ / สถานะ</span><b class="num" style="font-size:22px">${w&&w.el?`${ei(w.el)} ${R.ev}`:'—'}</b>${R.eb?`<em>ดาเมจธาตุ +${R.eb}%</em>`:''}</div><div class="stat"><span>ป้องกัน</span><b class="num">${R.def}</b>${R.hp?`<em>HP +${R.hp}</em>`:''}</div></div>`)}
   ${P('เป้าหมาย',tg+(cond?`<div class="muted" style="font-size:13px">เงื่อนไขที่ตั้งไว้: ${cond}</div>`:''))}
   ${P('อุปกรณ์และแหล่งที่มา',gear)}${P('เซ็ตเกราะ',sets)}${typeof visViewHTML==='function'?visViewHTML(b,R):''}${P('สกิลทั้งหมด ('+ids.length+')',sk)}`}
async function cmView(id){const V=$('#cm-view');V.innerHTML='<div class="empty-note">กำลังโหลด…</div>';
  try{const j=await capi('',{id});cmCur=j.build;V.innerHTML=viewHTML(j.build,j.owner)}catch(e){cmCur=null;V.innerHTML=`<a class="btn btn-ghost btn-sm" href="#community">← กลับไปคลังบิลด์</a><div class="empty-note">${e.status===403?'บิลด์นี้เป็นส่วนตัว':e.status===404?'ไม่พบบิลด์นี้ อาจถูกลบไปแล้ว':'โหลดไม่สำเร็จ'}</div>`}}
window.addEventListener('hashchange',cmRoute);
try{$('#pub-author').value=localStorage.getItem('mho_author')||''}catch(e){}
pubForm();cmRoute();

/* ---- monsters: category menu -> list -> detail ---- */
let mView=0;
const _rm2=renderMonsters;
renderMonsters=function(){
  const q=monQ;if(q&&mView===0)mView=1;if(!q&&mView===1&&monCls==='ทั้งหมด')mView=0;
  if(mView===0)monCls='ทั้งหมด';
  _rm2();
  const lay=document.querySelector('#v-monsters .mon-layout'),G=$('#mon-grid'),Dt=$('#mon-detail'),C=$('#mon-cls');
  C.hidden=true;let nav=$('#mon-nav');if(!nav){nav=document.createElement('div');nav.id='mon-nav';lay.before(nav)}
  lay.style.gridTemplateColumns='1fr';
  if(mView===0){
    const cats=[...new Set(MONS.map(m=>m.clsTh).filter(Boolean))].map(c=>({c,l:MONS.filter(m=>m.clsTh===c)}));cats.push({c:'Radiant',l:MONS.filter(m=>m.rad)});
    nav.innerHTML='<h3 style="margin:0 0 10px">เลือกสายพันธุ์</h3>';
    G.innerHTML=cats.map(({c,l})=>`<button class="mon-card" data-mcat="${esc(c)}" type="button"><span class="top"><span><span class="threat">${c==='Radiant'?'<span class="rad">RADIANT</span>':esc(l[0].cls)}</span><h4>${esc(c)}</h4><span class="muted" style="font-size:13px">${l.length} ตัว</span></span></span><span class="mcat-ic">${l.slice(0,6).map(m=>monIcon(m.k,'')).join('')}</span></button>`).join('');
    G.hidden=false;Dt.hidden=true;return}
  if(mView===1){nav.innerHTML=`<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-mback="0" type="button">← ทุกสายพันธุ์</button><h3 style="margin:0">${q?'ผลการค้นหา':esc(monCls)}</h3></div>`;
    if(q){G.innerHTML=MONS.filter(m=>(m.n+' '+(m.clsTh||'')+' '+(m.cls||'')+(m.rad?' radiant':'')).toLowerCase().includes(q)).map(m=>`<button class="mon-card" data-msel="${m.k}" type="button"><span class="top">${monIcon(m.k,'')}<span><span class="threat">${m.rad?'<span class="rad">RADIANT</span>':esc(m.cls)}</span><h4>${esc(m.n)}</h4></span></span></button>`).join('')||'<div class="empty-note">ไม่พบมอนสเตอร์</div>'}
    G.hidden=false;Dt.hidden=true;return}
  nav.innerHTML=`<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-mback="1" type="button">← ${q?'ผลการค้นหา':esc(monCls)}</button><button class="x-btn" data-mback="0" type="button">ทุกสายพันธุ์</button></div>`;
  G.hidden=true;Dt.hidden=false;
};
document.addEventListener('click',e=>{const c=e.target.closest('[data-mcat]'),b=e.target.closest('[data-mback]'),s=e.target.closest('[data-msel]');
  if(c){monCls=c.dataset.mcat;mView=1;renderMonsters();scrollTo(0,0)}
  else if(b){mView=+b.dataset.mback;if(mView===0){monQ='';$('#mon-q').value=''}renderMonsters();scrollTo(0,0)}
  else if(s||e.target.closest('[data-mon]')){mView=2;renderMonsters();scrollTo(0,0)}});
renderMonsters();

/* ---- drill-down menus: characters by element, skills by letter, buddies by type ---- */
const DD={ch:null,sk:null,bc:null};
const ddNav=(id,anchor,title,key)=>{let n=$('#'+id);if(!n){n=document.createElement('div');n.id=id;anchor.before(n)}
  n.innerHTML=title==null?'<h3 style="margin:0 0 10px">'+key+'</h3>':`<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-ddback="${key}" type="button">← ทั้งหมด</button><h3 style="margin:0">${title}</h3></div>`};
const tile=(attr,eb,h,cnt,icons)=>`<button class="mon-card" ${attr} type="button"><span class="top"><span><span class="threat">${eb}</span><h4>${h}</h4><span class="muted" style="font-size:13px">${cnt}</span></span></span>${icons?`<span class="mcat-ic">${icons}</span>`:''}</button>`;
const EO=['Fire','Water','Thunder','Ice','Dragon'];
const _rc3=renderChars;renderChars=function(){chF='ทั้งหมด';_rc3();const G=$('#ch-grid'),D=$('#ch-detail');$('#ch-filter').hidden=true;
  const lay=G.parentElement;
  if(!DD.ch){ddNav('ch-nav',lay,null,'เลือกธาตุ');D.hidden=true;lay.style.gridTemplateColumns='1fr';
    G.innerHTML=EO.filter(e=>CH.some(c=>c.el===e)).map(e=>{const l=CH.filter(c=>c.el===e),k=ELK(e);return tile(`data-ddch="${e}"`,esc(e),ei(k)+' ธาตุ'+WK_TH[k],l.length+' ตัว',l.map(c=>IMG(c.p,'',c.n)).join(''))}).join('');return}
  const k=ELK(DD.ch);ddNav('ch-nav',lay,ei(k)+' ธาตุ'+WK_TH[k],'ch');D.hidden=false;lay.style.gridTemplateColumns='';
  G.innerHTML=CH.filter(c=>c.el===DD.ch).sort((a,b)=>(a.r==='SSR'?0:1)-(b.r==='SSR'?0:1)||a.n.localeCompare(b.n)).map(chCard).join('')};
const _rs3=renderSkills;renderSkills=function(){skCat='ทั้งหมด';_rs3();$('#sk-cat').hidden=true;const G=$('#sk-grid'),q=$('#sk-q').value.trim();G.style.gridTemplateColumns=(!q&&!DD.sk)?'repeat(auto-fill,minmax(140px,1fr))':'';
  if(q){ddNav('sk-nav',G,'ผลการค้นหา','sk');return}
  const L=id=>SK[id].en[0].toUpperCase();
  if(!DD.sk){ddNav('sk-nav',G,null,'เลือกตัวอักษร');const ls=[...new Set(Object.keys(SK).map(L))].sort();
    G.innerHTML=ls.map(l=>{const ids=Object.keys(SK).filter(id=>L(id)===l).sort((a,b)=>SK[a].en.localeCompare(SK[b].en));return tile(`data-ddsk="${l}"`,'ตัวอักษร',`<span style="font-size:28px">${l}</span>`,ids.length+' สกิล',`<span class="muted" style="font-size:12px;line-height:1.4">${ids.slice(0,4).map(id=>esc(SK[id].en)).join(', ')}${ids.length>4?'…':''}</span>`)}).join('');return}
  ddNav('sk-nav',G,'สกิลที่ขึ้นต้นด้วย '+DD.sk,'sk');[...G.querySelectorAll('article.sk-card')].forEach(a=>{if(a.querySelector('h4').textContent.trim()[0].toUpperCase()!==DD.sk)a.remove()})};
const BTY=['Assault','Disruptor','Support'];
const _rb4=renderBuddyCards;renderBuddyCards=function(){const G=$('#bc-grid');$('#bc-filter').hidden=true;
  if(bcQ){bcF='ทั้งหมด';_rb4();ddNav('bc-nav',G,'ผลการค้นหา','bc');return}
  if(!DD.bc){ddNav('bc-nav',G,null,'เลือกสาย');G.innerHTML=BTY.map(t=>{const l=MEDIA.buddyCards.filter(b=>b.t===t);return tile(`data-ddbc="${t}"`,esc(t),esc(BT_TH[t]||t),l.length+' ตัว',l.slice(0,10).map(b=>IMG(b.img,'',b.n)).join(''))}).join('');return}
  bcF=DD.bc;_rb4();ddNav('bc-nav',G,esc(DD.bc)+' · '+esc(BT_TH[DD.bc]||''),'bc')};
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let t;
  if(t=g('[data-ddch]')){DD.ch=t.dataset.ddch;const f=CH.find(c=>c.el===DD.ch);if(f)chSel=f.id;renderChars();scrollTo(0,0)}
  else if(t=g('[data-ddsk]')){DD.sk=t.dataset.ddsk;renderSkills();scrollTo(0,0)}
  else if(t=g('[data-ddbc]')){DD.bc=t.dataset.ddbc;renderBuddyCards();scrollTo(0,0)}
  else if(t=g('[data-ddback]')){const k=t.dataset.ddback;DD[k]=null;if(k==='sk')$('#sk-q').value='';if(k==='bc'){bcQ='';$('#bc-q').value=''}({ch:renderChars,sk:renderSkills,bc:renderBuddyCards})[k]();scrollTo(0,0)}});
renderChars();renderSkills();renderBuddyCards();

/* ---- Endemic Life + Gathering pages (data/endemic.json, data/gathering.json, lazy loaded) ---- */
document.head.insertAdjacentHTML('beforeend','<style>.en-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;align-content:start}.en-card{background:var(--surface);border:1px solid var(--line);padding:8px 6px;display:grid;justify-items:center;gap:4px;text-align:center;cursor:pointer;font:inherit;color:inherit}.en-card[aria-pressed=true]{border-color:var(--brass);box-shadow:inset 0 0 0 1px var(--brass)}.en-card img{width:64px;height:64px;object-fit:contain}.en-card b{font-size:13px;line-height:1.2}.en-card small{font-size:11px;color:var(--muted)}.mpill{display:inline-block;font-size:11px;padding:1px 6px;margin:1px;border:1px solid var(--line-2)}.kv2{display:grid;grid-template-columns:120px 1fr;gap:6px 10px;font-size:14px;margin:10px 0}.kv2 dt{color:var(--muted)}.kv2 dd{margin:0}.ga-mat{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--surface);padding:4px 8px 4px 4px;margin:3px;font-size:13px;color:inherit;text-decoration:none}.ga-mat img{width:32px;height:32px}.ga-card{background:var(--surface);border:1px solid var(--line);padding:12px 14px;margin-bottom:12px}.ga-card h4{margin:0 0 8px}.ga-tbl{width:100%;border-collapse:collapse;font-size:13px}.ga-tbl th,.ga-tbl td{border-bottom:1px solid var(--line);padding:6px;text-align:center}.ga-tbl th:first-child,.ga-tbl td:first-child{text-align:left}.ga-hit{display:grid;grid-template-columns:56px 1fr;gap:10px;align-items:start;background:var(--surface);border:1px solid var(--brass);padding:10px;margin-bottom:8px}.ga-hit img{width:56px;height:56px}@media (max-width:600px){.kv2{grid-template-columns:96px 1fr}}</style>');
const DATA={};const loadJ=k=>DATA[k]?Promise.resolve(DATA[k]):fetch('data/'+k+'.json').then(r=>r.json()).then(j=>DATA[k]=j);
const MPN={GL:'Giantwood Locale',SP:'Searing Plains',RA:'Rotfall Abyss',GA:'Grand Archipelago'};
const srcLinks=s=>[].concat(s||[]).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https:\/\/gamewith\.ai\/monster-hunter-outlanders\/en\//,'GameWith: '))}</a>`).join(' · ');
let enMap='all',enType='all',enSel=null,enView=0;
const EN_IC={hunt:'⚔',life:'🦎',aquatic:'🐟',all:'📖'};
function renderEndemic(){loadJ('endemic').then(D=>{
  const q=($('#en-q').value||'').trim().toLowerCase();if(q&&enView===0)enView=1;
  const lay=document.querySelector('#v-endemic .mon-layout'),G=$('#en-grid'),Dt=$('#en-detail');lay.style.gridTemplateColumns='minmax(0,1fr)';
  let nav=$('#en-nav');if(!nav){nav=document.createElement('div');nav.id='en-nav';lay.before(nav)}
  const T=D.types,cnt=t=>D.items.filter(e=>t==='all'||e.type===t);
  $('#en-map').hidden=enView!==1;$('#en-type').hidden=true;
  if(enView===0){nav.innerHTML='<h3 style="margin:0 0 10px">เลือกหมวด</h3>';Dt.hidden=true;G.hidden=false;G.classList.add('en-cats');
    G.innerHTML=[['all','ทั้งหมด'],...Object.entries(T)].map(([k,l])=>{const L=cnt(k);return `<button class="mon-card" data-encat="${k}" type="button"><span class="top"><span><span class="threat">${EN_IC[k]||''} ${k==='all'?'ALL':esc(L[0]?L[0].type_en:'')}</span><h4>${esc(l)}</h4><span class="muted" style="font-size:13px">${L.length} ชนิด</span></span></span><span class="mcat-ic">${L.slice(0,6).map(e=>IMG(e.img,'',e.n)).join('')}</span></button>`}).join('');
    $('#en-src').innerHTML=`ทั้งหมด ${D.items.length} ชนิด · ข้อมูล ณ ${esc(D.updated)} จาก ${srcLinks(D.source)}`;return}
  G.classList.remove('en-cats');
  const L=D.items.filter(e=>q?e.n.toLowerCase().includes(q):(enType==='all'||e.type===enType)&&(enMap==='all'||e.maps.includes(enMap)));
  const title=q?'ผลการค้นหา':(enType==='all'?'ทั้งหมด':T[enType]);
  if(enView===1){nav.innerHTML=`<div class="en-navbar"><button class="btn btn-ghost btn-sm" data-enback="0" type="button">← หมวดทั้งหมด</button><h3 style="margin:0">${EN_IC[enType]||''} ${esc(title)} <small class="muted">${L.length} ชนิด</small></h3></div>`;
    $('#en-map').innerHTML=[['all','ทุกแมพ'],...D.maps.map(m=>[m.id,m.n])].map(([k,l])=>`<button class="chip" aria-pressed="${k===enMap}" data-enmap="${k}" type="button">${esc(l)}</button>`).join('');
    Dt.hidden=true;G.hidden=false;G.innerHTML=L.map(e=>`<button class="en-card" data-ensel="${e.id}" type="button">${IMG(e.img,'',e.n)}<b>${esc(e.n)}</b><small>${esc(T[e.type])}</small></button>`).join('')||'<p class="muted">ไม่พบสัตว์ที่ตรงกับตัวกรอง</p>';return}
  const e=D.items.find(x=>x.id===enSel)||L[0];if(!e){enView=1;return renderEndemic()}
  const k=L.findIndex(x=>x.id===e.id),prev=L[k-1],next=L[k+1];
  nav.innerHTML=`<div class="en-navbar"><button class="btn btn-ghost btn-sm" data-enback="1" type="button">← ${esc(title)}</button><span style="flex:1"></span>${prev?`<button class="x-btn" data-ensel="${prev.id}" type="button">‹ ${esc(prev.n)}</button>`:''}${next?`<button class="x-btn" data-ensel="${next.id}" type="button">${esc(next.n)} ›</button>`:''}</div>`;
  G.hidden=true;Dt.hidden=false;const row=(a,b)=>b?`<dt>${a}</dt><dd>${b}</dd>`:'';
  Dt.innerHTML=`<div class="head">${IMG(e.img,'',e.n,'style="width:96px;height:96px;object-fit:contain"')}<div><div class="eyebrow">${esc(e.type_en)}</div><h3>${esc(e.n)}</h3><div class="title">${EN_IC[e.type]||''} ${esc(T[e.type])}</div></div></div>
   <dl class="kv2">${row('แมพที่พบ',e.maps.map(m=>`<span class="mpill">${esc(MPN[m])}</span>`).join(''))}${row('ช่วงเวลา/อากาศ',esc(e.when))}${row('วิธีจับ/ใช้',esc(e.how))}${row('ผล/ประโยชน์',esc(e.effect))}${row('ขนาด (ใหญ่สุด/เล็กสุด)',e.size?esc(e.size.join(' / ')):'')}
   ${row('รางวัลสะสม',e.rewards?e.rewards.map(r=>`<b>${esc(r.n)}</b>: ${esc(r.req)} → ฉายา “${esc(r.title)}” + ${esc(r.item)}`).join('<br>'):'')}</dl>
   <p class="src2">ช่องที่ไม่แสดง = แหล่งข้อมูลไม่ได้ระบุ · ที่มา: ${srcLinks(e.source)}</p>`;
})}
document.head.insertAdjacentHTML('beforeend','<style>.en-navbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px}#en-map{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}#en-map .chip{flex:none;white-space:nowrap}#en-grid.en-cats{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))!important}#v-endemic .mon-detail{position:static;max-width:760px}</style>');
let gaMap='GL',gaType='all',gaSel=null,gaZoom=1;
const matChip=(m,extra='')=>`<a class="ga-mat" href="#m-${m.id}" ${extra}>${IMG(m.img,'',m.n)}<span>${esc(m.n)}</span></a>`;
const spotLink=(id,G)=>{const mp=G.maps.find(x=>x.spots&&x.spots.some(s=>s.id===id));return `<button class="x-btn" data-gaspot="${id}" type="button">${esc(mp?mp.n.split(' ')[0]:'')} #${esc(id.split('-').pop())}</button>`};
const GA_IC={plant:'🌿',specialty:'⭐',honey:'🍯',tree:'🪵',ore:'⛏',special:'✦'};
const gaGat=t=>t==='tree'?'Wood Gatherer':t==='ore'?'Ore Gatherer':'Plant Gatherer';
const gaHit=(s,q)=>(gaType==='all'||s.type===gaType)&&(!q||s.drops.some(d=>d.item.toLowerCase().includes(q)));
function gaMapHTML(M,G,q){const T=G.spot_types;
  if(!M.image)return `<div class="ga-card"><b>${esc(M.n)}</b><p class="muted">${esc(M.note||'ยังไม่มีรูปแผนที่ของแมพนี้')}</p></div>`;
  return `<div class="ga-mapwrap"><div class="ga-zoom" role="group" aria-label="ซูมแผนที่"><button data-gazoom="1" type="button" aria-label="ซูมเข้า">+</button><span id="ga-zl">${gaZoom}×</span><button data-gazoom="-1" type="button" aria-label="ซูมออก">−</button><button data-gazoom="0" type="button" aria-label="ดูทั้งแผนที่">⤢</button></div>
   <div class="ga-map" id="ga-map-vp"><div class="ga-map-in" style="width:${gaZoom*100}%"><img src="${M.image}" alt="แผนที่ ${esc(M.n)}" draggable="false">
   ${M.spots.filter(s=>s.x!=null).map(s=>`<button class="ga-pin ${gaHit(s,q)?'':'dim'} ${s.id===gaSel?'on':''}" style="left:${s.x}%;top:${s.y}%;--c:${T[s.type].color}" data-gaspot="${s.id}" type="button" title="#${s.no} ${esc(s.area)} · ${esc(T[s.type].th)}"><span>${GA_IC[s.type]||''}</span><i>${s.no}</i></button>`).join('')}</div></div><p class="src2" style="margin:4px 0 0">ปุ่ม +/− มุมขวาบน · แตะสองครั้งเพื่อซูม · มือถือใช้สองนิ้วถ่าง · คอมกด Ctrl + เลื่อนล้อเมาส์</p></div>`}
function gaSpotHTML(s,M,G,pop){const T=G.spot_types,MB=Object.fromEntries(G.materials.map(m=>[m.n,m]));
  return `<div class="ga-spot ${pop?'ga-pop':''} ${s.id===gaSel?'on':''}" ${pop?'':`data-gaspot="${s.id}" role="button" tabindex="0"`} style="--c:${T[s.type].color}"><div class="gs-h"><span class="gs-ic">${GA_IC[s.type]||''}</span><div><b>#${s.no} ${esc(s.area)}</b><small>${esc(T[s.type].th)} · ${gaGat(s.type)}</small></div>${pop?'<button class="x-btn" data-gaspot="" type="button">ปิด</button>':''}</div>
   <div class="gs-drops">${s.drops.map(d=>`<span class="ga-mat">${MB[d.item]?IMG(MB[d.item].img,'',d.item):''}<span>${esc(d.item)}<small>${esc(d.qty)}</small></span></span>`).join('')}</div>
   ${pop?`${s.rare.length?`<p class="src2">ของเฉพาะแมพนี้: ${s.rare.map(esc).join(', ')}</p>`:''}<p class="src2">ที่มา: ${srcLinks(s.source)}</p>`:''}</div>`}
function renderGathering(){loadJ('gathering').then(G=>{
  const q=($('#ga-q').value||'').trim().toLowerCase();const MB=Object.fromEntries(G.materials.map(m=>[m.n,m]));const T=G.spot_types;
  $('#ga-map').innerHTML=G.maps.map(m=>`<button class="chip" aria-pressed="${m.id===gaMap}" data-gamap="${m.id}" type="button">${esc(m.n)} <small>(${(m.spots||[]).length})</small></button>`).join('');
  const M=G.maps.find(m=>m.id===gaMap);const sel=M.spots&&M.spots.find(s=>s.id===gaSel);
  const qm=q?G.materials.filter(m=>m.n.toLowerCase().includes(q)):[];
  $('#ga-res').innerHTML=q?(qm.length?`<div class="ga-card"><b>ผลค้นหา “${esc(q)}”</b>${qm.map(m=>`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px">${matChip(m)}<span class="src2">${m.found_in.length?m.found_in.length+' จุด:':'ยังไม่มีจุดในข้อมูล'}</span>${m.found_in.map(id=>spotLink(id,G)).join('')}</div>`).join('')}</div>`:'<p class="muted">ไม่พบวัตถุดิบนี้</p>'):'';
  let h=`<div class="chips ga-filter">${[['all','ทั้งหมด'],['plant','พืช'],['specialty','ของพิเศษ'],['honey','น้ำผึ้ง-เห็ด'],['tree','ไม้'],['ore','แร่-กระดูก']].map(([k,l])=>`<button class="chip" aria-pressed="${k===gaType}" data-gatype="${k}" type="button">${k!=='all'?`<i class="dot" style="background:${T[k].color}"></i>`:''}${esc(l)} <small>(${k==='all'?M.spots.length:M.spots.filter(s=>s.type===k).length})</small></button>`).join('')}</div>`;
  h+=`<div class="ga-mapgrid"><div>${gaMapHTML(M,G,q)}</div><div class="ga-side">${sel?gaSpotHTML(sel,M,G,true):`<div class="ga-card"><b>กดหมุดบนแผนที่หรือการ์ดด้านล่าง</b><p class="src2">เลขในหมุด = ลำดับจุด · ไอคอน = ประเภทจุด</p><h5 style="margin:8px 0 4px">ของเฉพาะแมพนี้</h5>${(M.exclusive||[]).map(n=>MB[n]?matChip(MB[n]):'').join('')||'<span class="muted">—</span>'}</div>`}</div></div>`;
  const vis=M.spots.filter(s=>gaHit(s,q));
  h+=`<div class="ga-list">${['plant','specialty','honey','tree','ore'].map(t=>{const l=vis.filter(s=>s.type===t);return l.length?`<div class="bc-group"><i class="dot" style="background:${T[t].color}"></i>${GA_IC[t]} ${esc(T[t].th)} <small class="muted">${l.length} จุด</small></div>${l.map(s=>gaSpotHTML(s,M,G,false)).join('')}`:''}).join('')||'<p class="muted">ไม่มีจุดที่ตรงกับตัวกรอง</p>'}</div>`;
  const g=G.gatherers;
  const best=G.materials.filter(m=>m.gatherer.length||m.areas.length).map(m=>{const rows=G.gatherer_spots.filter(x=>x.per_cycle[m.n]).sort((a,b)=>b.per_cycle[m.n]-a.per_cycle[m.n]);
    const gt=m.areas.includes('Tree Resource Area')?'Wood':m.areas.includes('Mineral & Fossil Area')?'Ore':'Plant';
    return `<tr><td style="text-align:left">${matChip(m)}</td><td>${gt} Gatherer</td><td style="text-align:left">${rows.length?rows.map(x=>`<b>${esc(G.maps.find(mm=>mm.id===x.map).n)} · ${esc(x.area)}</b> ×${x.per_cycle[m.n]}/วัน`).join('<br>'):'<span class="muted">ยังไม่มีข้อมูล</span>'}</td></tr>`}).join('');
  h+=`<div class="ga-card"><h4>ฟาร์มอัตโนมัติ (Gatherer)</h4><dl class="kv2"><dt>ปลดล็อก</dt><dd>${esc(g.unlock)}</dd><dt>ค่าสร้าง</dt><dd>${esc(g.cost)}</dd><dt>รอบเก็บ</dt><dd>${esc(g.cycle)} · จำนวนชั่วโมงต่อรอบ: ยังไม่มีข้อมูล</dd><dt>จำนวนที่วางได้</dt><dd>${esc(g.limit)}</dd></dl>
   <div class="tbl-wrap"><table class="ga-tbl"><thead><tr><th>Watchtower Lv</th><th>Lusterwasp</th><th>ได้เพิ่ม</th></tr></thead><tbody>${g.watchtower.map(w=>`<tr><td class="num">Lv${w.lv}</td><td class="num">${w.lusterwasp}</td><td>${esc(w.bonus)}</td></tr>`).join('')}</tbody></table></div><p class="src2">${esc(g.watchtower_note)}</p>
   <h5 style="margin:12px 0 4px">จุดวาง Gatherer ที่มีตัวเลขยืนยันแล้ว (${G.gatherer_spots.length} จุด)</h5>
   <div class="tbl-wrap"><table class="ga-tbl"><thead><tr><th>แมพ / พื้นที่</th><th>Gatherer</th><th>ได้ต่อวัน</th></tr></thead><tbody>${G.gatherer_spots.map(x=>`<tr><td style="text-align:left"><b>${esc(G.maps.find(m=>m.id===x.map).n)}</b><br>${esc(x.area)}</td><td>${esc(x.gatherer)}</td><td style="text-align:left">${Object.entries(x.per_cycle).map(([n,v])=>`<span class="ga-mat">${MB[n]?IMG(MB[n].img,'',n):''}<span>${esc(n)} ×${v}</span></span>`).join('')}<div class="src2">ที่มา: ${srcLinks(x.source)}</div></td></tr>`).join('')}</tbody></table></div>
   <p class="src2">${esc(g.examples_note)} · จุดอื่นยังไม่มีข้อมูลจำนวน</p>
   <h5 style="margin:12px 0 4px">อยากได้ของนี้ ควรวางตรงไหน</h5><div class="tbl-wrap"><table class="ga-tbl"><thead><tr><th>วัตถุดิบ</th><th>ใช้ Gatherer</th><th>จุดที่ยืนยันแล้ว (มากไปน้อย)</th></tr></thead><tbody>${best}</tbody></table></div>
   <dl class="kv2"><dt>เครื่องมือ</dt><dd>${esc(g.tools)}</dd><dt>สกิลช่วยเก็บ</dt><dd>${esc(g.geo)}</dd></dl><p class="src2">ที่มา: ${srcLinks(g.source)}</p></div>`;
  h+=`<div class="ga-card"><h4>ของพิเศษ</h4>${G.special.map(s=>`<div style="display:grid;grid-template-columns:48px 1fr;gap:10px;margin-bottom:10px">${MB[s.n]?IMG(MB[s.n].img,'',s.n,'style="width:48px;height:48px"'):''}<div><b>${esc(s.n)}</b><div style="font-size:14px">${esc(s.text)}</div><div class="src2">เวลา respawn: ${s.respawn?esc(s.respawn):'ยังไม่มีข้อมูล'} · ที่มา: ${srcLinks(s.source)}</div></div></div>`).join('')}<p class="src2">Crimson Fruit: ไม่พบในรายการไอเทมของแหล่งข้อมูลหลัก จึงยังไม่ใส่</p></div>`;
  h+=`<div class="ga-card"><h4>รายการวัตถุดิบ (${G.materials.length})</h4><div class="tbl-wrap"><table class="ga-tbl"><thead><tr><th>วัตถุดิบ</th><th>พบที่จุด (กดเพื่อไปที่จุด)</th><th>Gatherer</th></tr></thead><tbody>${G.materials.map(m=>`<tr><td style="text-align:left">${matChip(m)}<div class="src2">${esc(m.how.join(' · '))}</div></td><td style="text-align:left">${m.found_in.length?m.found_in.map(id=>spotLink(id,G)).join(''):`<span class="muted">${m.areas.includes('Mineral & Fossil Area')?'จุดขุดแร่: ยังไม่มีข้อมูลตำแหน่ง':'ยังไม่มีข้อมูล'}</span>`}</td><td style="text-align:left">${m.gatherer.length?m.gatherer.map(x=>esc(x.split('/').slice(1).join(' · '))).join('<br>'):'<span class="muted">ยังไม่มีข้อมูล</span>'}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#ga-body').innerHTML=h;
})}
document.head.insertAdjacentHTML('beforeend','<style>#ga-body,#ga-res{display:grid;grid-template-columns:minmax(0,1fr)}.ga-card{min-width:0}.ga-mapgrid>div{min-width:0}.ga-mapgrid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px;align-items:start;margin-bottom:12px}@media(max-width:900px){.ga-mapgrid{grid-template-columns:minmax(0,1fr)}}.ga-map{position:relative;overflow:auto;max-height:78vh;border:1px solid var(--line);background:#cfc6b3;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch}.ga-map-in{position:relative;min-width:100%}.ga-map-in img{width:100%;height:auto;display:block;user-select:none}.ga-pin{position:absolute;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50%;border:2px solid #fff;background:var(--c);color:#fff;font:700 11px/22px var(--f-body);padding:0;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.5)}.ga-pin.dim{opacity:.18}.ga-pin.on{outline:3px solid #ffeb3b;z-index:2;width:32px;height:32px;line-height:28px}.ga-mapctl{display:flex;gap:6px;align-items:center;margin-bottom:6px}.ga-leg{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;margin-top:6px}.ga-leg i,.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:middle}.ga-pop{border-color:var(--brass)}.ga-filter{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;margin-bottom:8px;scrollbar-width:thin}.ga-filter .chip{white-space:nowrap;flex:none}.ga-pin{display:grid;place-items:center;width:30px;height:30px;font-size:14px;line-height:1}.ga-pin span{filter:drop-shadow(0 1px 1px rgba(0,0,0,.6))}.ga-pin i{position:absolute;right:-7px;top:-7px;font:700 10px/16px var(--f-num);min-width:16px;height:16px;padding:0 3px;border-radius:8px;background:#111;color:#fff;border:1px solid var(--c);font-style:normal}.ga-pin.on{width:38px;height:38px;line-height:1;animation:gaPulse 1s ease-out 2}@keyframes gaPulse{0%{box-shadow:0 0 0 0 var(--c)}100%{box-shadow:0 0 0 14px transparent}}.ga-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin:12px 0}.ga-list .bc-group{grid-column:1/-1}.ga-spot{background:var(--surface);border:1px solid var(--frame,var(--line));border-left:4px solid var(--c);padding:10px 12px;cursor:pointer;box-shadow:var(--shadow,none)}.ga-spot.on{outline:2px solid var(--brass)}.ga-spot.ga-pop{cursor:default}.gs-h{display:flex;gap:10px;align-items:center;margin-bottom:6px}.gs-h>div{flex:1}.gs-h b{display:block;font-family:var(--f-display)}.gs-h small{color:var(--muted);font-size:12px}.gs-ic{width:30px;height:30px;border-radius:50%;background:var(--c);display:grid;place-items:center;flex:none}.gs-drops .ga-mat small{display:block;color:var(--muted);font-size:11px;line-height:1.3}@media(max-width:900px){.ga-list{grid-template-columns:minmax(0,1fr)}.ga-map{max-height:70vh}}@media (prefers-reduced-motion: reduce){.ga-pin.on{animation:none}}</style>');
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let t;
  if(t=g('[data-enmap]')){enMap=t.dataset.enmap;renderEndemic()}else if(t=g('[data-encat]')){enType=t.dataset.encat;enView=1;renderEndemic();scrollTo(0,0)}else if(t=g('[data-enback]')){enView=+t.dataset.enback;if(!enView){$('#en-q').value='';enMap='all'}renderEndemic();scrollTo(0,0)}
  else if(t=g('[data-ensel]')){enSel=t.dataset.ensel;enView=2;renderEndemic();scrollTo(0,0)}
  else if(t=g('[data-gamap]')){gaMap=t.dataset.gamap;gaSel=null;renderGathering()}
  else if(t=g('[data-gatype]')){gaType=t.dataset.gatype;renderGathering()}
  else if(t=g('[data-gazoom]')){const d=+t.dataset.gazoom;gaSetZoom(d===0?1:gaZstep(d))}
  else if(t=g('[data-gaspot]')){const id=t.dataset.gaspot;if(!id){gaSel=null;renderGathering();return}loadJ('gathering').then(G=>{const mp=G.maps.find(x=>x.spots&&x.spots.some(s=>s.id===id));if(mp)gaMap=mp.id;gaSel=id;if(location.hash!=='#gathering')history.replaceState(null,'','#gathering');renderGathering();setTimeout(()=>{const pin=document.querySelector('.ga-pin.on'),vp=$('#ga-map-vp');if(pin&&vp){vp.scrollLeft=pin.offsetLeft-vp.clientWidth/2;vp.scrollTop=pin.offsetTop-vp.clientHeight/2}if(innerWidth<900){const p=document.querySelector('.ga-pop');if(p)p.scrollIntoView({block:'nearest'})}},80)})}});
let egT;document.addEventListener('input',e=>{if(e.target.id==='en-q'){clearTimeout(egT);egT=setTimeout(renderEndemic,120)}if(e.target.id==='ga-q'){clearTimeout(egT);egT=setTimeout(renderGathering,120)}});
function egRoute(){const h=location.hash;let m;
  if(h==='#endemic')renderEndemic();else if(m=h.match(/^#e-([a-z0-9-]+)$/)){enSel=m[1];enView=2;renderEndemic()}
  else if(h==='#gathering')renderGathering();else if(m=h.match(/^#m-([a-z0-9-]+)$/)){loadJ('gathering').then(G=>{const x=G.materials.find(y=>y.id===m[1]);if(x){$('#ga-q').value=x.n;const f=x.found_in[0];const mp=f&&G.maps.find(m=>m.spots&&m.spots.some(s=>s.id===f));gaMap=mp?mp.id:(x.maps?x.maps[0]:gaMap);gaSel=null}renderGathering()})}}
window.addEventListener('hashchange',egRoute);egRoute();
/* link materials on weapon pages to the Gathering page */
function matLink(n){return window.MATSLUG&&MATSLUG[n]?`<a href="#m-${MATSLUG[n]}" style="color:inherit;text-decoration:underline dotted">${esc(n)}</a>`:esc(n)}

/* ---- theme-hd: character cards (sharp art, element tint, weapon icon, rarity frame) ---- */
chCard=c=>{const ek=EL_EN[c.el]||'';const big=c.f&&HDM[c.f];return `<button class="ch-card rar-${c.r.toLowerCase()}" style="--elc:${ek?ECOL[ek]:'var(--brass)'}" aria-pressed="${c.id===chSel}" data-ch="${c.id}"><span class="rarity-tag ${c.r==='SR'?'sr':''}">${c.r}</span>${IMG(c.p,'',c.n,'data-sizes="(max-width:600px) 46vw, 220px"')}<span class="meta"><b>${esc(c.n)}</b><span>${wIcon(slugify(c.w))}${esc(c.w)}</span><span>${ek?ei(ek):''}${EL_TH[c.el]||c.el}</span></span></button>`};
renderChars();if(typeof renderHome==='function')renderHome();

/* gathering map zoom: steps, keep centre, double-tap, pinch, ctrl+wheel */
const GA_Z=[1,1.5,2,3,4];
function gaZstep(d){const i=GA_Z.findIndex(z=>z>=gaZoom-1e-6);return GA_Z[Math.max(0,Math.min(GA_Z.length-1,(i<0?0:i)+d))]}
function gaSetZoom(z,fx,fy){const vp=$('#ga-map-vp'),inn=vp&&vp.querySelector('.ga-map-in');if(!inn){gaZoom=z;return}
  const r=vp.getBoundingClientRect();fx=fx==null?vp.clientWidth/2:fx-r.left;fy=fy==null?vp.clientHeight/2:fy-r.top;
  const px=(vp.scrollLeft+fx)/vp.scrollWidth,py=(vp.scrollTop+fy)/vp.scrollHeight;gaZoom=z;inn.style.width=z*100+'%';
  vp.scrollLeft=px*vp.scrollWidth-fx;vp.scrollTop=py*vp.scrollHeight-fy;const l=$('#ga-zl');if(l)l.textContent=z+'×'}
document.addEventListener('dblclick',e=>{if(e.target.closest('#ga-map-vp')&&!e.target.closest('.ga-pin')){e.preventDefault();gaSetZoom(gaZstep(gaZoom>=4?-9:1),e.clientX,e.clientY)}});
document.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey)||!e.target.closest('#ga-map-vp'))return;e.preventDefault();gaSetZoom(gaZstep(e.deltaY<0?1:-1),e.clientX,e.clientY)},{passive:false});
let gaPinch=null;
document.addEventListener('touchstart',e=>{if(e.touches.length===2&&e.target.closest('#ga-map-vp')){const[a,b]=e.touches;gaPinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z:gaZoom,x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2}}},{passive:true});
document.addEventListener('touchmove',e=>{if(!gaPinch||e.touches.length!==2)return;e.preventDefault();const[a,b]=e.touches;const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);const z=Math.max(1,Math.min(4,+(gaPinch.z*d/gaPinch.d).toFixed(2)));gaSetZoom(z,gaPinch.x,gaPinch.y)},{passive:false});
document.addEventListener('touchend',e=>{if(gaPinch&&e.touches.length<2)gaPinch=null});
document.head.insertAdjacentHTML('beforeend','<style>.ga-mapwrap{position:relative}.ga-zoom{position:absolute;right:10px;top:10px;z-index:5;display:flex;flex-direction:column;align-items:center;gap:4px;background:color-mix(in srgb,var(--surface) 88%,transparent);border:1px solid var(--frame,var(--line));padding:4px;box-shadow:0 4px 12px rgba(0,0,0,.4)}.ga-zoom button{width:40px;height:40px;border:1px solid var(--line-2);background:var(--surface-2);color:var(--fg);font:700 20px/1 var(--f-display);cursor:pointer}.ga-zoom button:hover{border-color:var(--brass);color:var(--brass)}.ga-zoom span{font:600 11px var(--f-num);color:var(--muted)}#ga-map-vp{touch-action:pan-x pan-y}@media (pointer:coarse){.ga-zoom button{width:44px;height:44px}}</style>');

/* ---- Builder: Visage cards (cost 12, core slot, rarity, level, substats) + Apex awakening ---- */
let VD=null;loadJ('visages').then(d=>{VD=d;if(typeof renderBuilder==='function')renderBuilder();if(/^#b-[a-f0-9]{12}$/.test(location.hash)&&typeof cmRoute==='function')cmRoute()});
const VSUB={'Attack Power':'atkp','Attack':'atk','Affinity':'aff','Crit Damage':'cd','Ele. Crit DMG':'ecd','Damage Reduction':'dr','Defense':'def','Physical Damage':'phys',
 'Fire Damage Bonus':'el_fire','Water Damage Bonus':'el_water','Thunder Damage Bonus':'el_thunder','Ice Damage Bonus':'el_ice','Dragon Damage Bonus':'el_dragon','Element Damage Bonus':'ele_all'};
const VLBL={evf_fire:'ค่าธาตุไฟ +',evf_water:'ค่าธาตุน้ำ +',evf_thunder:'ค่าธาตุสายฟ้า +',evf_ice:'ค่าธาตุน้ำแข็ง +',evf_dragon:'ค่าธาตุมังกร +',atkp:'โบนัสดาเมจ %',atk:'พลังโจมตี +',aff:'คริติคอล %',cd:'ดาเมจคริ %',ecd:'ดาเมจคริธาตุ %',dr:'ลดดาเมจที่ได้รับ %',def:'ป้องกัน',phys:'ดาเมจกายภาพ %',ult:'ชาร์จ Ultimate %',ele_all:'ดาเมจธาตุ (ทุกธาตุ) %',el_fire:'ดาเมจไฟ %',el_water:'ดาเมจน้ำ %',el_thunder:'ดาเมจสายฟ้า %',el_ice:'ดาเมจน้ำแข็ง %',el_dragon:'ดาเมจมังกร %'};
const subKey=k=>VD&&VD.substats&&VD.substats[k]?VD.substats[k].key:VSUB[k];
const subInfo=k=>(VD&&VD.substats&&VD.substats[k])||(VD&&VD.apex.awaken_th&&VD.apex.awaken_th[k])||{th:k,unit:'%'};
const subCap=(k,r='s')=>{const i=subInfo(k);if(i.cap!=null)return typeof i.cap==='object'?i.cap[r]:i.cap;return VD&&VD.cap_fallback?VD.cap_fallback[i.unit||'']:100};
const isApex=w=>!!(w&&WD[w.slug]&&WD[w.slug].apex);
const vById=id=>VD&&VD.visages.find(v=>v.id===id);
function visState(b=B){if(!Array.isArray(b.vis))b.vis=[];if(!Array.isArray(b.apex))b.apex=[];return b}
function visBonus(R,b=B){const o={};const add=(k,v)=>{v=+v;if(!k||!isFinite(v))return;o[k]=(o[k]||0)+v};visState(b);const cnt={};
  b.vis.forEach(c=>{const v=vById(c.id);if(!v)return;v.sets.forEach(s=>cnt[s]=(cnt[s]||0)+1);(c.subs||[]).forEach(x=>{if(!x||!x.k)return;const cp=subCap(x.k,c.r);add(subKey(x.k),Math.min(+x.v||0,cp))})});
  const act=[];if(VD)VD.sets.forEach(s=>{const n=cnt[s.n]||0;Object.keys(s.eff).forEach(p=>{if(n>=+p){act.push({set:s.n,p,t:s.eff[p],c:s.calc[p]});if(s.calc[p])Object.entries(s.calc[p]).forEach(([k,v])=>add(k,v))}})});
  const w=R&&R.w;if(isApex(w)){b.apex.forEach(x=>add(VD&&VD.apex.awaken_th&&VD.apex.awaken_th[x.k]?VD.apex.awaken_th[x.k].key:subKey(x.k),x.v));if(b.cond&&b.cond.radiant)add('radiant',VD?VD.apex.radiant_base:8)}
  const el=w&&w.el;o.eb=(o.ele_all||0)+(el&&o['el_'+el]||0);o.evf=el&&o['evf_'+el]||0;o.cnt=cnt;o.act=act;return o}
const _cmpV=compute;compute=function(b=B){const R=_cmpV(b);const VB=visBonus(R,b);R.vis=VB;R.aff=Math.round((R.aff+(VB.aff||0))*10)/10;R.def=(R.def||0)+(VB.def||0);R.eb=(R.eb||0)+(VB.eb||0);if(VB.evf&&R.ev!=null)R.ev+=VB.evf;return R};
const _normV=normalize;normalize=function(b){const e=_normV(b);if(!e)return e;const vis=Array.isArray(b&&b.vis)?b.vis:[];
  e.vis=vis.filter(c=>c&&typeof c.id==='string').slice(0,12).map(c=>({id:c.id,r:['r','e','s'].includes(c.r)?c.r:'s',lv:Math.max(1,Math.min(10,+c.lv||10)),subs:(Array.isArray(c.subs)?c.subs:[]).slice(0,5).map(x=>({k:String(x.k||''),v:+x.v||0}))}));
  e.apex=(Array.isArray(b&&b.apex)?b.apex:[]).slice(0,5).map(x=>({k:String(x.k||''),v:+x.v||0}));return e};
B=normalize(B)||B;
function renderVis(){const box=$('#bd-vis');if(!box)return;if(!VD){box.innerHTML='<p class="muted">กำลังโหลดข้อมูลการ์ด…</p>';return}
  visState();const R=compute(),VB=R.vis,used=B.vis.reduce((t,c)=>t+((vById(c.id)||{}).cost||0),0),lim=VD.cost_limit;
  $('#vis-cost').innerHTML=`Cost <b style="color:${used>lim?'var(--danger)':'var(--brass)'}">${used}/${lim}</b>`;
  const RR=Object.fromEntries(VD.rarity.map(r=>[r.k,r]));
  const cards=B.vis.map((c,i)=>{const v=vById(c.id);if(!v)return '';const slots=Math.floor(c.lv/VD.sub_every);const rc=RR[c.r].c;
    return `<div class="vcard" style="--rc:${rc}"><div class="vc-h">${v.img?IMG(v.img,'',v.n):''}<div class="vc-t"><b>${esc(v.n)}</b>${i===0?'<span class="vcore">CORE</span>':`<button class="x-btn" data-vcore="${i}" type="button">ตั้งเป็น Core</button>`}<small>Cost ${v.cost} · ${v.sets.map(esc).join(' / ')}</small></div><button class="x-btn" data-vdel="${i}" type="button" aria-label="เอาออก">✕</button></div>
     <div class="vc-row"><label>ระดับ <select data-vr="${i}">${VD.rarity.map(r=>`<option value="${r.k}" ${r.k===c.r?'selected':''}>${r.n}</option>`).join('')}</select></label><label>เลเวล <select data-vlv="${i}">${Array.from({length:VD.level_max},(_,k)=>`<option ${k+1===c.lv?'selected':''}>${k+1}</option>`).join('')}</select></label><span class="src2">ช่องค่ารอง ${slots}/5</span></div>
     ${i===0&&v.core?`<p class="src2" style="margin:4px 0">Core: ${esc(v.core)}</p>`:''}
     <div class="vc-subs">${Array.from({length:slots},(_,k)=>{const x=(c.subs||[])[k]||{k:'',v:0};return `<div class="vsub"><select data-vsk="${i}:${k}"><option value="">— ค่ารอง ${k+1} —</option>${v.potential.map(p=>`<option ${p===x.k?'selected':''}>${esc(p)}</option>`).join('')}</select><input type="number" step="0.1" inputmode="decimal" placeholder="ค่า" value="${x.k?x.v:''}" data-vsv="${i}:${k}" ${x.k?'':'disabled'}></div>`}).join('')}</div></div>`}).join('');
  const left=lim-used;const opts=VD.visages.slice().sort((a,b)=>a.n.localeCompare(b.n)).map(v=>`<option value="${v.id}" ${v.cost>left?'disabled':''}>${esc(v.n)} (Cost ${v.cost})</option>`).join('');
  const setRows=Object.entries(VB.cnt||{}).sort((a,b)=>b[1]-a[1]).map(([s,n])=>{const S=VD.sets.find(x=>x.n===s);return `<div class="vset">${setBadge(s)} <b>${esc(s)}</b> <span class="muted">${n} ใบ</span>${S?Object.entries(S.eff).map(([p,t])=>`<div class="${n>=+p?'on':''}">${p}-piece: ${esc(t)}${n>=+p?(S.calc[p]?' <em>(รวมในคำนวณแล้ว)</em>':' <em>(มีเงื่อนไข ไม่รวมในคำนวณ)</em>'):''}</div>`).join(''):''}</div>`}).join('');
  const sum=Object.entries(VLBL).filter(([k])=>VB[k]).map(([k,l])=>`<span class="mpill">${l} ${VB[k]>0?'+':''}${Math.round(VB[k]*10)/10}</span>`).join('')+(VB.radiant?`<span class="mpill">ดาเมจต่อ Radiant +${VB.radiant}% (Apex)</span>`:'');
  let ap='';const w=R.w;if(isApex(w)){const A=VD.apex;ap=`<div class="vapex"><h4 style="margin:0 0 6px">อาวุธ Apex · ${esc(w.n)}</h4><p style="margin:0 0 6px;font-size:14px">${esc(A.mastery[w.t]||'')}</p>
    <div class="vc-subs">${Array.from({length:A.awaken_slots},(_,k)=>{const x=B.apex[k]||{k:'',v:0};return `<div class="vsub"><select data-ak="${k}"><option value="">— ปลุกพลัง ${k+1} —</option>${A.awaken_types.map(p=>`<option ${p===x.k?'selected':''}>${esc(p)}</option>`).join('')}</select><input type="number" step="0.1" inputmode="decimal" placeholder="ค่า" value="${x.k?x.v:''}" data-av="${k}" ${x.k?'':'disabled'}></div>`}).join('')}</div>
    <p class="src2">${esc(A.note)} · เปิดเงื่อนไข “เป้าหมายเป็น Radiant” เพื่อรวมดาเมจ +${A.radiant_base}% ของ Mastery · ที่มา: ${srcLinks(A.source)}</p></div>`}
  box.innerHTML=`<div class="vadd"><select id="vis-pick"><option value="">+ เพิ่มการ์ด (เหลือ Cost ${left})</option>${opts}</select></div>
   <div class="vgrid">${cards||'<p class="muted">ยังไม่มีการ์ด เลือกจากช่องด้านบน การ์ดใบแรกคือช่อง Core</p>'}</div>
   ${setRows?`<h4 style="margin:12px 0 6px">เซ็ตการ์ด</h4>${setRows}`:''}
   ${sum?`<h4 style="margin:12px 0 6px">ค่าที่ได้รวม (นำไปคำนวณดาเมจด้านล่าง)</h4><div>${sum}</div>`:''}${ap}
   <p class="src2" style="margin-top:8px">${VD.notes.map(esc).join(' · ')} · ที่มา: ${srcLinks(VD.source)}</p>`}
const _rbV=renderBuilder;renderBuilder=function(){_rbV();renderVis()};
const visSave=()=>{saveCur();renderBuilder()};
document.addEventListener('change',e=>{const t=e.target;if(!VD||!t.closest('#bd-vis'))return;visState();let m;
  if(t.id==='vis-pick'&&t.value){B.vis.push({id:t.value,r:'s',lv:10,subs:[]});visSave()}
  else if(t.dataset.vr!=null){const c=B.vis[+t.dataset.vr];c.r=t.value;(c.subs||[]).forEach(x=>{if(x&&x.k)x.v=Math.min(+x.v||0,subCap(x.k,c.r))});visSave()}
  else if(t.dataset.vlv!=null){const c=B.vis[+t.dataset.vlv];c.lv=+t.value;c.subs=(c.subs||[]).slice(0,Math.floor(c.lv/VD.sub_every));visSave()}
  else if(t.dataset.vsk){const[i,k]=t.dataset.vsk.split(':').map(Number);const c=B.vis[i];c.subs=c.subs||[];c.subs[k]={k:t.value,v:(c.subs[k]||{}).v||0};visSave()}
  else if(t.dataset.ak!=null){B.apex[+t.dataset.ak]={k:t.value,v:(B.apex[+t.dataset.ak]||{}).v||0};visSave()}});
document.addEventListener('input',e=>{const t=e.target;if(!VD||!t.closest('#bd-vis'))return;
  if(t.dataset.vsv){const[i,k]=t.dataset.vsv.split(':').map(Number);const s=B.vis[i].subs[k];if(s){s.v=+t.value||0;saveCur();renderDmg();vsumOnly()}}
  else if(t.dataset.av!=null){const s=B.apex[+t.dataset.av];if(s){s.v=+t.value||0;saveCur();renderDmg();vsumOnly()}}});
function vsumOnly(){}/* totals refresh on blur to keep input focus */
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('#bd-vis input'))renderBuilder()});
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let t;if(!VD)return;
  if(t=g('[data-vdel]')){B.vis.splice(+t.dataset.vdel,1);visSave()}else if(t=g('[data-vcore]')){const i=+t.dataset.vcore;B.vis.unshift(B.vis.splice(i,1)[0]);visSave()}});
document.head.insertAdjacentHTML('beforeend','<style>.vadd select{width:100%}.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:10px}.vcard{border:1px solid var(--rc);border-left:4px solid var(--rc);background:var(--surface-2);padding:10px}.vc-h{display:flex;gap:10px;align-items:center}.vc-h img{width:56px;height:56px;object-fit:contain;flex:none;border:1px solid var(--rc);background:var(--bg)}.vc-t{flex:1;min-width:0}.vc-t b{font-family:var(--f-display);margin-right:6px}.vc-t small{display:block;color:var(--muted);font-size:12px}.vcore{font:700 10px var(--f-num);background:var(--brass);color:var(--on-brass);padding:1px 6px}.vc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0 4px;font-size:13px}.vc-row select,.vsub select,.vsub input,.vadd select{background:var(--bg);color:var(--fg);border:1px solid var(--line-2);padding:6px;min-height:36px}.vc-subs{display:grid;gap:6px}.vsub{display:grid;grid-template-columns:minmax(0,1fr) 90px;gap:6px}.vsub select{width:100%;min-width:0}.vcard,.vgrid>*{min-width:0}.vset{font-size:13px;margin-bottom:6px}.vset div{color:var(--muted);padding-left:10px}.vset div.on{color:var(--fg)}.vset em{color:var(--brass);font-style:normal;font-size:11px}.bvis{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.bvis span{position:relative;border:2px solid;width:44px;height:44px;background:var(--bg)}.bvis img{width:100%;height:100%;object-fit:contain}.bvis i{position:absolute;left:0;right:0;bottom:-2px;font:700 8px var(--f-num);text-align:center;background:var(--brass);color:#111;font-style:normal}.vapex{margin-top:12px;border:1px solid var(--frame,var(--line));padding:10px;background:var(--surface-2)}</style>');

/* ---- Visage v2: 4 square slots with "+", set-grouped picker modal with rarity frames, core effect shown ---- */
const VSLOTS=5,VRC={r:'#5aa6dc',e:'#9b7be0',s:'#e0b552'},VRN={r:'Rare',e:'Epic',s:'Superior'};
const FLAT=new Set(['Attack','Defense']);
let vPickSlot=null,vPickSet='all',vPickR='s',vPickQ='',vPickCost='all';
const setInfo=n=>(VD&&VD.sets.find(s=>s.n===n))||{icon:'◆',color:'#888',th:n};
const setBadge=(n,full)=>{const i=setInfo(n);return `<span class="vsetb" style="--sc:${i.color}" title="${esc(n)}">${i.icon}${full?` ${esc(n.replace('Ink of ',''))}`:''}</span>`};
renderVis=function(){const box=$('#bd-vis');if(!box)return;if(!VD){box.innerHTML='<p class="muted">กำลังโหลดข้อมูลการ์ด…</p>';return}
  visState();B.vis=B.vis.slice(0,VSLOTS);const R=compute(),VB=R.vis,used=B.vis.reduce((t,c)=>t+((vById(c.id)||{}).cost||0),0),lim=VD.cost_limit;
  $('#vis-cost').innerHTML=`Cost <b style="color:${used>lim?'var(--danger)':'var(--brass)'}">${used}/${lim}</b>`;
  const slots=Array.from({length:VSLOTS},(_,i)=>{const c=B.vis[i],v=c&&vById(c.id);
    if(!v)return `<button class="vslot empty" data-vslot="${i}" type="button" aria-label="เพิ่มการ์ดช่อง ${i+1}"><span class="vplus">+</span><small>${i===0?'ช่อง Core':'ช่อง '+(i+1)}</small></button>`;
    return `<div class="vslot" style="--rc:${VRC[c.r]}"><button class="vs-img" data-vslot="${i}" type="button" aria-label="เปลี่ยนการ์ด">${v.img?IMG(v.img,'',v.n):''}</button>${i===0?'<span class="vcore">CORE</span>':''}<span class="vr">${VRN[c.r]}</span><button class="vs-x" data-vdel="${i}" type="button" aria-label="เอาออก">✕</button><b>${esc(v.n)}</b><small>Cost ${v.cost}</small><span class="vsets">${v.sets.map(x=>setBadge(x)).join('')}</span></div>`}).join('');
  const eds=B.vis.map((c,i)=>{const v=vById(c.id);if(!v)return '';const ns=Math.floor(c.lv/VD.sub_every);
    return `<div class="vcard" style="--rc:${VRC[c.r]}"><div class="vc-h">${v.img?IMG(v.img,'',v.n):''}<div class="vc-t"><b>${esc(v.n)}</b>${i===0?'<span class="vcore">CORE</span>':`<button class="x-btn" data-vcore="${i}" type="button">ตั้งเป็น Core</button>`}<small>Cost ${v.cost}</small><span class="vsets">${v.sets.map(x=>setBadge(x,true)).join('')}</span></div></div>
     <div class="vc-row"><label>ระดับ <select data-vr="${i}">${VD.rarity.map(r=>`<option value="${r.k}" ${r.k===c.r?'selected':''}>${r.n}</option>`).join('')}</select></label><label>เลเวล <select data-vlv="${i}">${Array.from({length:VD.level_max},(_,k)=>`<option ${k+1===c.lv?'selected':''}>${k+1}</option>`).join('')}</select></label><span class="src2">ค่ารอง ${ns}/5</span></div>
     <p class="vcoretxt ${i===0?'on':''}"><b>Core Effect${i===0?' (ทำงาน)':' (ทำงานเมื่ออยู่ช่อง Core)'}:</b> ${esc(v.core_th||v.core||'—')}</p>
     <div class="vc-subs">${Array.from({length:5},(_,k)=>{const x=(c.subs||[])[k]||{k:'',v:0};const lock=k>=ns;return `<div class="vsub ${lock?'lock':''}"><select data-vsk="${i}:${k}" ${lock?'disabled':''}><option value="">${lock?`🔒 ปลดที่ Lv${(k+1)*2}`:`— ค่ารอง ${k+1} —`}</option>${v.potential.map(p=>`<option value="${esc(p)}" ${p===x.k?'selected':''}>${esc(subInfo(p).th)} (${esc(p)})${subInfo(p).unit?' %':''}</option>`).join('')}</select><span class="vin"><input type="number" min="0" max="${x.k?subCap(x.k,c.r):100}" step="${x.k&&!subInfo(x.k).unit?1:0.01}" title="${x.k?`สูงสุด ${subCap(x.k,c.r)}${subInfo(x.k).unit||''} ต่อช่อง (${VRN[c.r]})`:''}" inputmode="decimal" placeholder="0" value="${x.k?x.v:''}" data-vsv="${i}:${k}" ${x.k&&!lock?'':'disabled'}><i>${x.k?(subInfo(x.k).unit||'+'):''}</i></span>${x.k&&!lock?`<small class="vcap">สูงสุด ${subCap(x.k,c.r)}${subInfo(x.k).unit||''}</small>`:''}</div>`}).join('')}</div></div>`}).join('');
  const setRows=Object.entries(VB.cnt||{}).sort((a,b)=>b[1]-a[1]).map(([s,n])=>{const S=VD.sets.find(x=>x.n===s);return `<div class="vset">${setBadge(s)} <b>${esc(s)}</b> <span class="muted">${n} ใบ</span>${S?Object.entries(S.eff).map(([p,t])=>`<div class="${n>=+p?'on':''}">${n>=+p?'✔':'○'} ${p} ชิ้น: ${esc((S.eff_th&&S.eff_th[p])||t)}${n>=+p?(S.calc[p]?' <em>(รวมในคำนวณแล้ว)</em>':' <em>(มีเงื่อนไข)</em>'):''}</div>`).join(''):''}</div>`}).join('');
  const sum=Object.entries(VLBL).filter(([k])=>VB[k]).map(([k,l])=>`<span class="mpill">${l} ${VB[k]>0?'+':''}${Math.round(VB[k]*10)/10}</span>`).join('')+(VB.radiant?`<span class="mpill">ดาเมจต่อ Radiant +${VB.radiant}% (Apex)</span>`:'');
  let ap='';const w=R.w;if(isApex(w)){const A=VD.apex;ap=`<div class="vapex"><h4 style="margin:0 0 6px">อาวุธ Apex · ${esc(w.n)}</h4><p style="margin:0 0 6px;font-size:14px">${esc(A.mastery[w.t]||'')}</p>
    <div class="vc-subs">${Array.from({length:A.awaken_slots},(_,k)=>{const x=B.apex[k]||{k:'',v:0};return `<div class="vsub"><select data-ak="${k}"><option value="">— ปลุกพลัง ${k+1} —</option>${A.awaken_types.map(p=>`<option value="${esc(p)}" ${p===x.k?'selected':''}>${esc(subInfo(p).th)} (${esc(p)})</option>`).join('')}</select><span class="vin"><input type="number" min="0" max="${x.k?subCap(x.k):100}" step="0.1" inputmode="decimal" placeholder="0" value="${x.k?x.v:''}" data-av="${k}" ${x.k?'':'disabled'}><i>${x.k?subInfo(x.k).unit:''}</i></span></div>`}).join('')}</div>
    <p class="src2">${esc(A.note)} · เปิดเงื่อนไข “เป้าหมายเป็น Radiant” เพื่อรวมดาเมจ +${A.radiant_base}% · ที่มา: ${srcLinks(A.source)}</p></div>`}
  box.innerHTML=`<div class="vslots">${slots}</div>${eds?`<div class="vgrid">${eds}</div>`:''}
   ${setRows?`<h4 style="margin:12px 0 6px">เซ็ตเอฟเฟกต์</h4>${setRows}`:''}${sum?`<h4 style="margin:12px 0 6px">ค่าที่ได้รวม (นำไปคำนวณดาเมจ)</h4><div>${sum}</div>`:''}${ap}
   <p class="src2" style="margin-top:8px">${VD.notes.map(esc).join(' · ')} · ${esc(VD.set_icon_note||'')} · ที่มา: ${srcLinks(VD.source)}</p>`;
  if(vPickSlot!=null)renderVPick()};
function renderVPick(){let m=$('#vpick');if(!m){m=document.createElement('div');m.id='vpick';document.body.appendChild(m)}
  const cur=B.vis[vPickSlot],used=B.vis.reduce((t,c,i)=>i===vPickSlot?t:t+((vById(c.id)||{}).cost||0),0),left=VD.cost_limit-used,have=new Set(B.vis.map((c,i)=>i===vPickSlot?null:c.id));
  const L=VD.visages.filter(v=>(vPickSet==='all'||v.sets.includes(vPickSet))&&(vPickCost==='all'||v.cost===+vPickCost)&&(!vPickQ||v.n.toLowerCase().includes(vPickQ))).sort((a,b)=>b.cost-a.cost||a.n.localeCompare(b.n));
  m.innerHTML=`<div class="vp-bg" data-vpclose="1"></div><div class="vp-box" role="dialog" aria-label="เลือกการ์ด"><div class="vp-h"><b>เลือกการ์ดช่อง ${vPickSlot+1}${vPickSlot===0?' (Core)':''}</b><span class="muted">เหลือ Cost ${left}</span><button class="x-btn" data-vpclose="1" type="button">ปิด</button></div>
   <div class="vp-r">${Object.keys(VRC).map(k=>`<button class="chip" aria-pressed="${k===vPickR}" data-vpr="${k}" type="button" style="border-color:${VRC[k]}"><i class="dot" style="background:${VRC[k]}"></i>${VRN[k]}</button>`).join('')}<input class="input" id="vp-q" type="search" placeholder="ค้นหาชื่อการ์ด" value="${esc(vPickQ)}"></div>
   <div class="vp-sets"><b class="vp-lbl">Cost</b>${['all',4,3,1].map(k=>`<button class="chip" aria-pressed="${String(k)===String(vPickCost)}" data-vpc="${k}" type="button">${k==='all'?'ทุก Cost':'Cost '+k} <small>(${k==='all'?VD.visages.length:VD.visages.filter(v=>v.cost===k).length})</small></button>`).join('')}</div>
   <div class="vp-sets"><b class="vp-lbl">เซ็ต</b>${[['all','ทั้งหมด']].concat(VD.sets.map(s=>[s.n,s.n.replace('Ink of ','')])).map(([k,l])=>`<button class="chip" aria-pressed="${k===vPickSet}" data-vps="${esc(k)}" type="button">${k!=='all'?setInfo(k).icon+' ':''}${esc(l)} <small>(${k==='all'?VD.visages.length:VD.visages.filter(v=>v.sets.includes(k)).length})</small></button>`).join('')}</div>
   ${vPickSet!=='all'?(s=>s?`<div class="vp-seteff">${Object.entries(s.eff).map(([p,t])=>`<div><b>${p} ชิ้น:</b> ${esc((s.eff_th&&s.eff_th[p])||t)}</div>`).join('')}</div>`:'')(VD.sets.find(s=>s.n===vPickSet)):''}
   <div class="vp-grid">${L.map(v=>{const dis=v.cost>left||have.has(v.id);return `<button class="vp-card" data-vpick="${v.id}" type="button" ${dis?'disabled':''} style="--rc:${VRC[vPickR]}">${v.img?IMG(v.img,'',v.n):''}<b>${esc(v.n)}</b><small>Cost ${v.cost}</small><span class="vsets">${v.sets.map(x=>setBadge(x,true)).join('')}</span><span class="vp-core">${esc(v.core_th||v.core||'')}</span>${have.has(v.id)?'<em>ใส่แล้ว</em>':v.cost>left?'<em>Cost เกิน</em>':''}</button>`}).join('')||'<p class="muted">ไม่พบการ์ด</p>'}</div></div>`;
  document.body.style.overflow='hidden'}
function closeVPick(){vPickSlot=null;const m=$('#vpick');if(m)m.remove();document.body.style.overflow=''}
document.addEventListener('click',e=>{const g=s=>e.target.closest(s);let t;if(!VD)return;
  if(t=g('[data-vslot]')){vPickSlot=+t.dataset.vslot;const c=B.vis[vPickSlot];vPickR=c?c.r:'s';renderVPick()}
  else if(g('[data-vpclose]'))closeVPick();
  else if(t=g('[data-vpr]')){vPickR=t.dataset.vpr;renderVPick()}
  else if(t=g('[data-vps]')){vPickSet=t.dataset.vps;renderVPick()}
  else if(t=g('[data-vpc]')){vPickCost=t.dataset.vpc;renderVPick()}
  else if(t=g('[data-vpick]')){const i=vPickSlot,old=B.vis[i];const c={id:t.dataset.vpick,r:vPickR,lv:old?old.lv:10,subs:old&&old.id===t.dataset.vpick?old.subs:[]};if(i<B.vis.length)B.vis[i]=c;else B.vis.push(c);closeVPick();visSave()}},true);
document.addEventListener('input',e=>{if(e.target.id==='vp-q'){vPickQ=e.target.value.trim().toLowerCase();const pos=e.target.selectionStart;renderVPick();const q=$('#vp-q');q.focus();q.setSelectionRange(pos,pos)}
  const t=e.target;if(t.matches&&t.matches('#bd-vis input[type=number]')){const mx=+t.max||100,v=+t.value;if(v>mx){t.value=mx;toast('ค่าสูงสุดที่ใส่ได้คือ '+mx)}if(v<0)t.value=0}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vPickSlot!=null)closeVPick()});
document.head.insertAdjacentHTML('beforeend','<style>.vslots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}@media(max-width:600px){.vslots{grid-template-columns:repeat(2,minmax(0,1fr))}.vslots>:first-child{grid-row:span 2;aspect-ratio:auto}}.vslot{position:relative;aspect-ratio:3/4;border:2px solid var(--rc,var(--line-2));background:var(--surface-2);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:6px;text-align:center;min-width:0;box-shadow:0 0 0 1px color-mix(in srgb,var(--rc,transparent) 40%,transparent),var(--shadow,none)}.vslot.empty{border-style:dashed;justify-content:center;cursor:pointer;color:var(--muted);font:inherit}.vslot.empty:hover{border-color:var(--brass);color:var(--brass)}.vplus{font:300 48px/1 var(--f-display)}.vslot b{font-family:var(--f-display);font-size:13px;line-height:1.2}.vslot small{font-size:11px;color:var(--muted)}.vs-img{position:absolute;inset:6px 6px 62px;border:0;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--rc) 25%,transparent),transparent 70%);cursor:pointer;padding:0}.vs-img img{width:100%;height:100%;object-fit:contain}.vslot .vcore{position:absolute;left:6px;top:6px}.vr{position:absolute;left:6px;top:26px;font:700 9px var(--f-num);background:var(--rc);color:#111;padding:1px 4px}.vs-x{position:absolute;right:4px;top:4px;width:22px;height:22px;border:1px solid var(--line-2);background:var(--bg);color:var(--fg);cursor:pointer;line-height:1}.vsub{align-items:center}.vcap{grid-column:1/-1;font-size:11px;color:var(--muted);margin-top:-2px}.vcoretxt{font-size:12px;color:var(--muted);margin:4px 0}.vcoretxt.on{color:var(--fg);border-left:3px solid var(--brass);padding-left:6px}.vsub.lock{opacity:.5}.vin{position:relative;display:block}.vin input{width:100%;padding-right:20px!important}.vin i{position:absolute;right:6px;top:50%;transform:translateY(-50%);font-style:normal;color:var(--muted);font-size:12px}#vpick{position:fixed;inset:0;z-index:60;display:grid;place-items:center}.vp-bg{position:absolute;inset:0;background:rgba(0,0,0,.6)}.vp-box{position:relative;width:min(980px,96vw);max-height:90vh;overflow:auto;background:var(--surface);border:1px solid var(--frame,var(--line));box-shadow:0 20px 50px rgba(0,0,0,.6);padding:14px}.vp-h{display:flex;gap:10px;align-items:center;margin-bottom:8px}.vp-h b{font-family:var(--f-display);font-size:17px;flex:1}.vp-r{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px}.vp-r .input{flex:1;min-width:160px}.vp-sets{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:6px}.vp-sets .chip{flex:none;white-space:nowrap}.vp-seteff{font-size:13px;background:var(--surface-2);padding:8px;margin-bottom:8px;border-left:3px solid var(--brass)}.vp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.vp-card{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;border:2px solid var(--rc);background:var(--surface-2);padding:8px;cursor:pointer;color:inherit;font:inherit;min-width:0}.vp-card:disabled{opacity:.4;cursor:not-allowed}.vp-card img{width:84px;height:84px;object-fit:contain}.vp-card b{font-family:var(--f-display);font-size:13px}.vp-card small{font-size:11px;color:var(--muted)}.vp-core{font-size:11px;line-height:1.35;color:var(--fg);opacity:.85}.vsets{display:flex;gap:3px;flex-wrap:wrap;justify-content:center}.vsetb{display:inline-flex;align-items:center;gap:2px;font-size:11px;line-height:1;padding:2px 5px;border:1px solid var(--sc);background:color-mix(in srgb,var(--sc) 18%,transparent);color:var(--fg);white-space:nowrap}.vslot .vsets{margin-top:2px}.vc-t .vsets{justify-content:flex-start;margin-top:3px}.vp-lbl{font:600 12px var(--f-display);color:var(--muted);align-self:center;flex:none;margin-right:2px}.vp-card em{font-size:11px;color:var(--danger);font-style:normal}</style>');

/* community viewer: saved Visage cards + Apex options */
function visViewHTML(b,R){if(!VD)return '';visState(b);const VB=R.vis||visBonus(R,b);if(!b.vis.length&&!(isApex(R.w)&&b.apex.some(x=>x.k)))return '';
  const P=(t,h)=>`<div class="panel" style="margin-top:14px"><div class="panel-h"><h3>${t}</h3></div><div style="padding:12px 16px;display:grid;gap:10px">${h}</div></div>`;
  const used=b.vis.reduce((t,c)=>t+((vById(c.id)||{}).cost||0),0);
  const cards=b.vis.map((c,i)=>{const v=vById(c.id);if(!v)return '';const subs=(c.subs||[]).filter(x=>x&&x.k);
    return `<div class="vcard" style="--rc:${VRC[c.r]}"><div class="vc-h">${v.img?IMG(v.img,'',v.n):''}<div class="vc-t"><b>${esc(v.n)}</b>${i===0?'<span class="vcore">CORE</span>':''}<small>${VRN[c.r]} · Lv${c.lv} · Cost ${v.cost}</small><span class="vsets">${v.sets.map(x=>setBadge(x,true)).join('')}</span></div></div>
     ${i===0&&v.core_th?`<p class="vcoretxt on"><b>Core Effect:</b> ${esc(v.core_th)}</p>`:''}
     ${subs.length?`<div class="vview-subs">${subs.map(x=>{const inf=subInfo(x.k);return `<span>${esc(inf.th)} <b>+${x.v}${inf.unit||''}</b></span>`}).join('')}</div>`:'<p class="src2">ไม่ได้บันทึกค่ารอง</p>'}</div>`}).join('');
  const setRows=Object.entries(VB.cnt||{}).sort((a,b2)=>b2[1]-a[1]).map(([s,n])=>{const S=VD.sets.find(x=>x.n===s);return S?`<div class="vset">${setBadge(s)} <b>${esc(s)}</b> <span class="muted">${n} ใบ</span>${Object.entries(S.eff).map(([p,t])=>`<div class="${n>=+p?'on':''}">${n>=+p?'✔':'○'} ${p} ชิ้น: ${esc((S.eff_th&&S.eff_th[p])||t)}</div>`).join('')}</div>`:''}).join('');
  const sum=Object.entries(VLBL).filter(([k])=>VB[k]).map(([k,l])=>`<span class="mpill">${l} ${VB[k]>0?'+':''}${Math.round(VB[k]*10)/10}</span>`).join('');
  let h=b.vis.length?`<div class="src2">Cost ${used}/${VD.cost_limit}</div><div class="vgrid" style="margin-top:0">${cards}</div>${setRows?`<h4 style="margin:4px 0">เซ็ตเอฟเฟกต์</h4>${setRows}`:''}${sum?`<h4 style="margin:4px 0">ค่าที่ได้รวม</h4><div>${sum}</div>`:''}`:'';
  if(isApex(R.w)){const A=VD.apex,aw=b.apex.filter(x=>x&&x.k);h+=`<div class="vapex"><h4 style="margin:0 0 6px">อาวุธ Apex · ${esc(R.w.n)}</h4><p style="margin:0 0 6px;font-size:14px">${esc(A.mastery[R.w.t]||'')}</p>${aw.length?`<div class="vview-subs">${aw.map(x=>{const inf=subInfo(x.k);return `<span>ปลุกพลัง: ${esc(inf.th)} <b>+${x.v}${inf.unit||''}</b></span>`}).join('')}</div>`:'<p class="src2">ไม่ได้บันทึกการปลุกพลัง</p>'}</div>`}
  return P('การ์ด Visage และอาวุธ Apex',h)}
document.head.insertAdjacentHTML('beforeend','<style>.vview-subs{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.vview-subs span{font-size:13px;padding:4px 8px;border:1px solid var(--line-2);background:var(--bg)}.vview-subs b{color:var(--brass);font-family:var(--f-num)}#cm-view .vgrid{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}</style>');
