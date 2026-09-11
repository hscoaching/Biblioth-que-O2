(function(){
  let active=false;
  let scheduled=false;

  function isAnimated(card){
    return !!card.querySelector('.media-pair .media-a, .media-pair .media-b');
  }

  function apply(){
    const cards=[...document.querySelectorAll('#exercise-grid .card')];
    let animatedCount=0;
    cards.forEach(card=>{
      const animated=isAnimated(card);
      if(animated)animatedCount++;
      card.classList.toggle('hs-quick-hidden',active&&!animated);
    });
    const c=document.querySelector('.hs-animated-chip');
    if(c)c.textContent=`▶ Animés${animatedCount?` · ${animatedCount}`:''}`;
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
    c.classList.toggle('active',active);
  }

  function sync(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      chip();
      apply();
    });
  }

  function init(){
    const grid=document.querySelector('#exercise-grid');
    if(!grid)return;
    new MutationObserver(sync).observe(grid,{childList:true,subtree:true});
    sync();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
