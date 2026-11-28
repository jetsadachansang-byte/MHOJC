// Build-sharing API (Cloudflare Pages worker, KV binding BUILDS).
// Ownership without accounts: on create the server returns a secret owner token; only its SHA-256 is stored.
// Edits/deletes must send that token in the X-Owner-Token header.
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha=async t=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)));
const rid=n=>hex(crypto.getRandomValues(new Uint8Array(n)));
const clip=(s,n)=>String(s??'').slice(0,n);
function clean(b){
  const x=b&&typeof b==='object'?b:{};const build=x.build&&typeof x.build==='object'?x.build:{};
  const armor={};for(const k of ['head','chest','arms','waist','legs'])armor[k]=build.armor&&typeof build.armor[k]==='string'?clip(build.armor[k],80):null;
  return {name:clip(x.name,60)||'บิลด์ไม่มีชื่อ',author:clip(x.author,30)||'ไม่ระบุชื่อ',desc:clip(x.desc,500),public:!!x.public,
    build:{weapon:typeof build.weapon==='string'?clip(build.weapon,100):null,armor,target:clip(build.target,60),cond:build.cond&&typeof build.cond==='object'?{weak:!!build.cond.weak,enraged:!!build.cond.enraged,unleashed:!!build.cond.unleashed,radiant:!!build.cond.radiant}:{},
    vis:(Array.isArray(build.vis)?build.vis:[]).slice(0,12).map(c=>({id:clip(c&&c.id,60),r:['r','e','s'].includes(c&&c.r)?c.r:'s',lv:Math.max(1,Math.min(10,+(c&&c.lv)||1)),subs:(Array.isArray(c&&c.subs)?c.subs:[]).slice(0,5).map(x=>({k:clip(x&&x.k,40),v:Number(x&&x.v)||0}))})),
    apex:(Array.isArray(build.apex)?build.apex:[]).slice(0,5).map(x=>({k:clip(x&&x.k,40),v:Number(x&&x.v)||0}))}};
}
const summary=r=>({id:r.id,name:r.name,author:r.author,weapon:r.build.weapon,updated:r.updated});
async function setIndex(env,r,on){
  // public list = keys "pub:<id>" with a small summary in metadata
  if(on)await env.BUILDS.put('pub:'+r.id,'1',{metadata:summary(r)});else await env.BUILDS.delete('pub:'+r.id);
}
async function api(req,env,u){
  if(!env.BUILDS)return J({error:'storage not configured'},500);
  const m=u.pathname.match(/^\/api\/builds(?:\/([a-f0-9]{12}))?$/);if(!m)return J({error:'not found'},404);
  const id=m[1],tok=req.headers.get('x-owner-token')||'';
  if(req.method==='GET'&&!id){
    const out=[];let cursor;do{const l=await env.BUILDS.list({prefix:'pub:',cursor,limit:1000});l.keys.forEach(k=>k.metadata&&out.push(k.metadata));cursor=l.list_complete?null:l.cursor}while(cursor&&out.length<2000);
    out.sort((a,b)=>(b.updated||0)-(a.updated||0));return J({builds:out.slice(0,500)});
  }
  if(req.method==='POST'&&!id){
    let body;try{body=await req.json()}catch(e){return J({error:'bad json'},400)}
    const r={id:rid(6),...clean(body),created:Date.now(),updated:Date.now()};const token=rid(16);r.owner=await sha(token);
    await env.BUILDS.put('b:'+r.id,JSON.stringify(r));await setIndex(env,r,r.public);
    const {owner,...pub}=r;return J({build:pub,token},201);
  }
  if(!id)return J({error:'method not allowed'},405);
  const raw=await env.BUILDS.get('b:'+id);if(!raw)return J({error:'not found'},404);const r=JSON.parse(raw);
  const isOwner=tok&&await sha(tok)===r.owner;
  if(req.method==='GET'){if(!r.public&&!isOwner)return J({error:'private'},403);const {owner,...pub}=r;return J({build:pub,owner:!!isOwner})}
  if(!isOwner)return J({error:'only the owner can change this build'},403);
  if(req.method==='PUT'){let body;try{body=await req.json()}catch(e){return J({error:'bad json'},400)}
    Object.assign(r,clean(body),{updated:Date.now()});await env.BUILDS.put('b:'+id,JSON.stringify(r));await setIndex(env,r,r.public);const {owner,...pub}=r;return J({build:pub})}
  if(req.method==='DELETE'){await env.BUILDS.delete('b:'+id);await setIndex(env,r,false);return J({ok:true})}
  return J({error:'method not allowed'},405);
}
