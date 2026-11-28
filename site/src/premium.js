/* ---- premium decoration (visual only): ribbons, hero embers, card tilt ---- */
(function(){
  const RM=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  // ribbons: data update card + costumes in the "new costumes" section
  function ribbons(){
    const fc=document.querySelector('#v-home .field-card>div');
    if(fc&&!fc.dataset.ribbon){fc.classList.add('p-ribbon','r-right');fc.dataset.ribbon='อัปเดต'}
    document.querySelectorAll('#home-outfits figure:not(.p-ribbon)').forEach(f=>{f.classList.add('p-ribbon','r-right');f.dataset.ribbon='ใหม่'});
  }
  // embers: a few CSS-animated dots (transform/opacity only), fewer on small screens
  function embers(){
    const hero=document.querySelector('#v-home .hero');if(!hero||hero.querySelector('.p-embers'))return;
    const box=document.createElement('div');box.className='p-embers';box.setAttribute('aria-hidden','true');
    const n=innerWidth<700?8:16;let h='';
    for(let i=0;i<n;i++){const r=Math.random;
      h+=`<i style="--x:${(r()*100).toFixed(1)}%;--s:${(2+r()*4).toFixed(1)}px;--d:${(8+r()*8).toFixed(1)}s;--dl:${(-r()*14).toFixed(1)}s;--dx:${(r()*60-30).toFixed(0)}px"></i>`}
    box.innerHTML=h;hero.prepend(box);
  }
  // tilt: pointer position -> CSS vars, one rAF per frame
  let cur=null,raf=0,px=0,py=0;
  function apply(){raf=0;if(!cur)return;const b=cur.getBoundingClientRect();
    const x=(px-b.left)/b.width-.5,y=(py-b.top)/b.height-.5;
    cur.style.setProperty('--ry',(x*8).toFixed(2)+'deg');cur.style.setProperty('--rx',(-y*8).toFixed(2)+'deg')}
  function reset(el){el.style.removeProperty('--rx');el.style.removeProperty('--ry')}
  const SEL='#v-home .route,#v-home .ch-card,#v-home .outfits figure';
  document.addEventListener('pointermove',e=>{
    if(RM.matches||!fine.matches||e.pointerType!=='mouse')return;
    const el=e.target.closest&&e.target.closest(SEL);
    if(el!==cur){if(cur)reset(cur);cur=el}
    if(!cur)return;px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(apply)},{passive:true});
  document.addEventListener('pointerleave',()=>{if(cur){reset(cur);cur=null}},true);
  function run(){ribbons();if(!RM.matches)embers()}
  run();
  // home grids are re-rendered by the app: re-apply ribbons when they change
  const o=document.getElementById('home-outfits');if(o)new MutationObserver(ribbons).observe(o,{childList:true});
  RM.addEventListener&&RM.addEventListener('change',()=>{const e=document.querySelector('.p-embers');if(RM.matches&&e)e.remove();else if(!RM.matches)embers()});
})();
