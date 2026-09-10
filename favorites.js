(function(){
  const KEY='hscoaching_favorites_v1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  let favs=get();
  let filter=false;
  const isFav=id=>favs.includes(String(id));
  function button(card){
    const id=card.dataset.id;
    if(!id||card.querySelector('.hs-fav'))return;
    const b=document.createElement('button');
    b.className='hs-fav'+(isFav(id)?' active':'');
    b.type='button'; b.setAttribute('aria-label',isFav(id)?'Retirer des favoris':'Ajouter aux favoris');
    b.innerHTML=isFav(id)?'★':'☆';
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(id,b)});
    card.appendChild(b);
  }
  function toggle(id,b){
    id=String(id); favs=isFav(id)?favs.filter(x=>x!==id):[...favs,id]; save(favs);
    const on=isFav(id); b.classList.toggle('active',on); b.innerHTML=on?'★':'☆'; b.setAttribute('aria-label',on?'Retirer des favoris':'Ajouter aux favoris');
    updateChip();
  }
  function cards(){document.querySelectorAll('#exercise-grid .card').forEach(button)}
  function updateChip(){
    let c=document.querySelector('.hs-favorites-chip');
    if(!c){const box=document.querySelector('.categories'); if(!box)return; c=document.createElement('button'); c.className='chip hs-favorites-chip'; c.type='button'; c.addEventListener('click',()=>{filter=!filter;c.classList.toggle('active',filter);apply()}); box.appendChild(c)}
    c.textContent=`★ Favoris${favs.length?` (${favs.length})`:''}`; c.classList.toggle('active',filter);
  }
  function apply(){
    document.querySelectorAll('#exercise-grid .card').forEach(card=>{card.style.display=(!filter||isFav(card.dataset.id))?'':'none'});
    const count=document.querySelector('#count'); if(count&&filter)count.textContent=`${document.querySelectorAll('#exercise-grid .card:not([style*="display: none"])').length} favori${favs.length>1?'s':''}`;
  }
  const observer=new MutationObserver(()=>{cards();updateChip();if(filter)apply()});
  function init(){const grid=document.querySelector('#exercise-grid');if(!grid)return;observer.observe(grid,{childList:true});cards();updateChip()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
