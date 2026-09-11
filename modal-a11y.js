(function(){
  function init(){
    const modal=document.querySelector('#exercise-modal');
    const close=document.querySelector('#close-modal');
    const grid=document.querySelector('#exercise-grid');
    if(!modal||!close||!grid)return;

    let origin=null;

    grid.addEventListener('click',function(e){
      const card=e.target.closest('.card');
      if(card)origin=card;
    },true);

    const observer=new MutationObserver(()=>{
      if(modal.open){
        requestAnimationFrame(()=>close.focus({preventScroll:true}));
        observer.disconnect();
      }
    });

    const focusClose=()=>{
      if(!modal.open)return;
      observer.observe(modal,{childList:true,subtree:true});
      requestAnimationFrame(()=>close.focus({preventScroll:true}));
    };

    grid.addEventListener('click',()=>setTimeout(focusClose,0),true);

    modal.addEventListener('close',()=>{
      if(origin&&origin.isConnected&&origin.getClientRects().length){
        requestAnimationFrame(()=>origin.focus({preventScroll:true}));
      }
      origin=null;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
