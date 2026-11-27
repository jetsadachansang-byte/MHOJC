/* ===== ui2: real images + card data rendered as HTML ===== */
const SZ=MEDIA.size||{};
const IMG=(src,cls='',alt='',extra='')=>{if(!src)return '';const d=SZ[src];return `<img class="${cls}" src="${src}" alt="${esc(alt)}" ${d?`width="${d[0]}" height="${d[1]}"`:''} loading="lazy" decoding="async" ${extra}>`};
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
  const tabs=[['info','ข้อมูลและสกิล'],['build','บิลด์แนะนำ'],...(guides.length?[['guide','ไกด์ ('+guides.length+')']]:[]),['art','อาร์ตเวิร์ก']];
  if(!tabs.some(t=>t[0]===chTab))chTab='info';
  const wt=WTYPES.find(t=>t.n===c.w);let body='';
  if(chTab==='info')body=advHTML(c);
  if(chTab==='build')body=buildHTML(c)+(wt?`<div><button class="btn btn-ghost btn-sm" data-chbuild="${wt.id}">เปิดหน้าจัดบิลด์ด้วย ${esc(c.w)}</button></div>`:'');
  if(chTab==='guide')body=guides.map(g=>guideHTML(g,c)).join('');
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
  list.forEach(b=>{const k=b.r+' · '+b.t;if(k!==g){g=k;h+=`<div class="bc-group">${esc(b.r)} ${RSTAR[b.r]||''} · ${esc(b.t)} (${BT_TH[b.t]||''})</div>`}
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
  const tiers=`<table><thead><tr><th>ระดับ</th><th>ชื่อ</th><th>โจมตี</th><th>คริ</th><th>ธาตุ</th><th>ความคม</th><th>วัตถุดิบขั้นนี้</th></tr></thead><tbody>${d.rows.map(r=>{const m=d.mats[r.r];return `<tr><td class="num">R${r.r}</td><td>${esc(r.n)}</td><td class="num">${r.atk??'—'}</td><td class="num">${r.aff==null?'—':r.aff+'%'}</td><td class="num">${r.ev==null?'—':(r.el?(WK_TH[{Paralyzed:'para',Paralysis:'para'}[r.el]||r.el.toLowerCase()]||r.el)+' ':'')+r.ev}</td><td>${esc(r.sh||'—')}</td><td style="font-size:12px">${m?`<b>${m.kind==='Craft'?'สร้าง':'อัป'}</b> `+m.items.map(([n,q])=>`${esc(n)} ×${(q||0).toLocaleString()}`).join(' · '):'—'}</td></tr>`}).join('')}</tbody></table>`;
  const opts=d.rows.map(r=>`<option value="${r.r}" ${r.r===tgt?'selected':''}>R${r.r}</option>`).join('');
  return `<div class="grid2"><div class="tbl-wrap">${tiers}</div><div><b style="font-family:var(--f-display)">วัตถุดิบรวม ตั้งแต่ขั้นแรกถึง</b> <select class="input" style="width:auto;padding:4px 8px" data-wto="${w.id}">${opts}</select>
   <div class="src2" style="margin:4px 0 8px">นับต่อจากสายอัปเกรด: ${names.map(esc).join(' → ')}</div>
   <div class="mtot">${Object.entries(tot).sort((a,b)=>a[0]==='Zenny'?1:b[0]==='Zenny'?-1:0).map(([n,q])=>`<div><span>${esc(n)}</span><b>×${q.toLocaleString()}</b></div>`).join('')||'<span class="muted">ยังไม่มีข้อมูลวัตถุดิบ</span>'}</div>
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
   <div class="legend"><span>▮ เซ็ตเกราะ</span><span style="color:var(--elc)">▮ ธาตุเต็ม Lv7</span><span>▯ สกิลเต็มลิมิต</span><span style="margin-left:auto">MHOUTLANDERTHGUILD · mhoutlanderthguild.pages.dev</span></div></div></div>`;
}
const _rb=renderBuilder;
renderBuilder=function(){_rb();$('#bd-card').innerHTML=builderCardHTML();preShot();
  document.querySelectorAll('#gear .gear-row').forEach(r=>{const k=r.querySelector('[data-pick]');if(!k||k.dataset.pick!=='weapon')return;const w=B.weapon&&W_BY[B.weapon];const im=w&&weaponImg(w.n);if(im)r.querySelector('.gear-ic').innerHTML=IMG(im,'',w.n,'style="width:48px;height:48px;object-fit:contain"')})};
/* save as image: render only the card (skip the rest of the page) and pre-render in the background */
const SHOT={key:null,blob:null,url:null,busy:null};
async function makeShot(){
  const el=$('#bd-card .bc2');if(!el||!window.html2canvas)return null;const key=el.innerHTML;
  if(SHOT.key===key&&SHOT.blob)return SHOT;if(SHOT.busy&&SHOT.busyKey===key)return SHOT.busy;
  SHOT.busyKey=key;SHOT.busy=(async()=>{
    const bg=getComputedStyle(document.body).backgroundColor;
    const cv=await html2canvas(el,{backgroundColor:bg,scale:2,useCORS:true,logging:false,
      ignoreElements:n=>!(n===el||el.contains(n)||n.contains(el)||['STYLE','LINK','META','TITLE','HEAD'].includes(n.tagName))});
    const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
    if(SHOT.url)URL.revokeObjectURL(SHOT.url);Object.assign(SHOT,{key,blob,url:URL.createObjectURL(blob),busy:null});return SHOT})();
  return SHOT.busy;
}
let shotT;const preShot=()=>{clearTimeout(shotT);shotT=setTimeout(()=>{if(location.hash==='#builder'&&document.fonts)document.fonts.ready.then(()=>makeShot().catch(()=>{}))},700)};
window.addEventListener('hashchange',preShot);
$('#bd-shot').addEventListener('click',async()=>{
  const btn=$('#bd-shot');const fn='mhoutlanderthguild-build.png';
  const ready=SHOT.blob&&SHOT.key===($('#bd-card .bc2')||{}).innerHTML;
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
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;(n.tagName==='IMG'?[n]:n.querySelectorAll('img:not([width])')).forEach(i=>{const d=SZ[i.getAttribute('src')];if(d&&!i.hasAttribute('width')){i.setAttribute('width',d[0]);i.setAttribute('height',d[1])}})}}).observe(document.body,{childList:true,subtree:true});
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
mskRender();
renderChars();renderMedia();renderHome();renderMonsters();initArmor();renderArmor();renderWeapons();renderSkills();renderBuilder();route();
