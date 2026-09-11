/* HS Coaching — Ergonomie O2
   Améliorations UX sans modifier la source de données.
*/
(function(){
  const style=document.createElement('style');
  style.textContent=`
    :root{scroll-behavior:smooth}
    .topbar{position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
    .nav,.topnav{overflow-x:auto;scrollbar-width:none;white-space:nowrap}
    .nav::-webkit-scrollbar,.topnav::-webkit-scrollbar{display:none}
    .categories{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:5px;scroll-snap-type:x proximity}
    .categories::-webkit-scrollbar{display:none}
    .categories .chip{flex:0 0 auto;scroll-snap-align:start}
    .search{position:sticky;top:72px;z-index:20;box-shadow:0 8px 25px rgba(0,0,0,.22)}
    .section-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
    #count{color:#777;font-size:12px;font-weight:700}
    .hs-back-top{position:fixed;right:16px;bottom:18px;z-index:80;width:42px;height:42px;border:1px solid #303030;border-radius:50%;background:#161616;color:#fff;display:none;align-items:center;justify-content:center;font-size:18px;box-shadow:0 8px 25px rgba(0,0,0,.3);cursor:pointer}
    .hs-back-top.show{display:flex}
    .admin .panel{scroll-margin-top:90px}
    .admin #exercisePanel{position:relative}
    .admin #exerciseSearch{font-size:15px;min-height:46px}
    .admin .filter{position:sticky;top:74px;z-index:15;background:#141414;padding:8px 0;margin:8px 0 14px}
    .admin .filter button{min-height:40px}
    .admin .item{transition:transform .16s ease,border-color .16s ease,background .16s ease}
    .admin .item:hover{border-color:#3a3a3a;background:#121212}
    .admin .item-actions .btn{min-height:40px}
    .admin .editor{scroll-margin-top:90px}
    .admin .editor h2{margin-top:0}
    .admin .field input,.admin .field textarea,.admin .field select{min-height:44px}
    @media(max-width:650px){
      .topbar{top:0}
      .nav{margin-right:8px!important}
      .search{top:61px}
      .hero{padding-top:18px}
      .categories{margin-left:-4px;margin-right:-4px;padding-left:4px;padding-right:4px}
      .admin .filter{top:60px;overflow-x:auto;flex-wrap:nowrap;padding:8px 0}
      .admin .filter button{flex:0 0 auto}
      .admin .item-actions{grid-template-columns:1fr 1fr}
      .admin .item-actions .btn:first-child{grid-column:1/-1}
      .admin .stats{grid-template-columns:repeat(3,1fr)}
      .admin .stat{padding:11px 8px}
      .admin .stat strong{font-size:21px}
    }
  `;
  document.head.appendChild(style);

  function addBackTop(){
    const b=document.createElement('button');
    b.className='hs-back-top';b.type='button';b.setAttribute('aria-label','Retour en haut');b.textContent='↑';
    b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
    document.body.appendChild(b);
    const update=()=>b.classList.toggle('show',window.scrollY>500);
    window.addEventListener('scroll',update,{passive:true});update();
  }

  function publicUX(){
    const search=document.getElementById('search');
    if(search){
      search.addEventListener('keydown',e=>{if(e.key==='Escape'){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.blur()}});
    }
    const count=document.getElementById('count');
    if(count){
      const obs=new MutationObserver(()=>{
        const cards=document.querySelectorAll('#exercise-grid .card');
        const empty=document.getElementById('empty');
        if(empty&&!empty.hidden) count.textContent='0 exercice';
        else count.textContent=cards.length+(cards.length>1?' exercices':' exercice');
      });
      obs.observe(document.getElementById('exercise-grid'),{childList:true,subtree:true});
    }
    addBackTop();
  }

  function adminUX(){
    const search=document.getElementById('exerciseSearch');
    if(search){
      search.title='Raccourci : / pour rechercher, Échap pour effacer';
      search.addEventListener('keydown',e=>{if(e.key==='Escape'){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));search.focus()}});
      document.addEventListener('keydown',e=>{
        if(e.key==='/'&&document.activeElement!==search&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'){e.preventDefault();search.focus()}
      });
    }
    addBackTop();
  }

  if(document.querySelector('.admin')) adminUX();
  else publicUX();
})();
