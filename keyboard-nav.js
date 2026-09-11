(function(){
  function decorate(grid){
    grid.querySelectorAll('.card').forEach(card=>{
      if(card.getAttribute('tabindex')===null)card.setAttribute('tabindex','0');
      if(!card.getAttribute('role'))card.setAttribute('role','button');
      if(!card.getAttribute('aria-label')){
        const title=card.querySelector('h3')?.textContent?.trim();
        if(title)card.setAttribute('aria-label',`Ouvrir la fiche ${title}`);
      }
    });
  }

  function init(){
    const grid=document.querySelector('#exercise-grid');
    if(!grid)return;
    grid.addEventListener('keydown',e=>{
      const card=e.target.closest('.card');
      if(!card||e.target!==card)return;
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        card.click();
      }
    });
    const observer=new MutationObserver(()=>decorate(grid));
    observer.observe(grid,{childList:true});
    decorate(grid);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
