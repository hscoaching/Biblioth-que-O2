(function(){
  const FILTER='animated';
  let active=false;

  function isAnimated(card){
    return !!card.querySelector('.media-pair .media-a, .media-pair .media-b');
  }

  function apply(){
    document.querySelectorAll('#exercise-grid .card').forEach(card=>{
      card.classList.toggle('hs-quick-hidden',active&&!isAnimated(card));
    });
  }

  function chip(){
    const box=document.querySelector('.categories');
    if(!box)return;
    let c=box.querySelector('.hs-animated-chip');
    if(!c){
      c=document.createElement('button');
      c.className='chip hs-animated-chip';
      c.type='button';
      c.addEventListener('click',()=>{
        active=!active;
        c.classList.toggle('active',active);
        apply();
      });
      box.appendChild(c);
    }
    c.textContent='▶ Animés';
    c.classList.toggle('active',active);
  }

  function sync(){
    requestAnimationFrame(()=>{chip();apply();});
  }

  function init(){
    const grid=document.querySelector('#exercise-grid');
    if(!grid)return;
    new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});
    sync();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
