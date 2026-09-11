(function(){
  const KEY='hscoaching_favorites_v1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').map(String)}catch{return[]}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  let favs=get();
  let filter=false;
  let syncing=false;
  const isFav=id=>favs.includes(String(id));
  function button(card){const id=card.dataset.id;if(!id||card.querySelector('.hs-fav'))return;const b=document.createElement('button');b.className='hs-fav'+(isFav(id)?' active':'');b.type='button';b.setAttribute('aria-label',isFav(id)?'Retirer des favoris':'Ajouter aux favoris');b.innerHTML=isFav(id)?'★':'☆';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(id,b)});card.appendChild(b)}
  function toggle(id,b){id=String(id);favs=isFav(id)?favs.filter(x=>x!==id):[...favs,id];save(favs);const on=isFav(id);b.classList.toggle('active',on);b.innerHTML=on?'★':'☆';b.setAttribute('aria-label',on?'Retirer des favoris':'Ajouter aux favoris');updateChip();if(filter)apply()}
  function cards(){document.querySelectorAll('#exercise-grid .card').forEach(button)}
  function updateChip(){const box=document.querySelector('.categories');if(!box)return;let c=box.querySelector('.hs-favorites-chip');if(!c){c=document.createElement('button');c.className='chip hs-favorites-chip';c.type='button';c.addEventListener('click',()=>{filter=!filter;c.classList.toggle('active',filter);apply()});box.appendChild(c)}c.textContent=`★ Favoris${favs.length?` (${favs.length})`:''}`;c.classList.toggle('active',filter)}
  function apply(){const grid=document.querySelector('#exercise-grid');if(!grid)return;grid.querySelectorAll('.card').forEach(card=>card.classList.toggle('hs-favorites-hidden',filter&&!isFav(card.dataset.id)));const count=document.querySelector('#count');if(count&&filter){const visible=[...grid.querySelectorAll('.card')].filter(card=>!card.classList.contains('hs-favorites-hidden'));count.textContent=`${visible.length} favori${visible.length!==1?'s':''}`}}
  function sync(){if(syncing)return;syncing=true;requestAnimationFrame(()=>{cards();updateChip();if(filter)apply();syncing=false})}
  function init(){const grid=document.querySelector('#exercise-grid'),box=document.querySelector('.categories');if(!grid)return;const observer=new MutationObserver(sync);observer.observe(grid,{childList:true});if(box)observer.observe(box,{childList:true});cards();updateChip()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
