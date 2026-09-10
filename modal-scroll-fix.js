// Garde la position de lecture lors de l'ouverture/fermeture d'une fiche.
(function(){
  const modal=document.querySelector('#exercise-modal');
  const grid=document.querySelector('#exercise-grid');
  if(!modal||!grid)return;

  let savedY=0;
  let restoring=false;

  function savePosition(){
    savedY=window.scrollY||window.pageYOffset||0;
  }

  function restorePosition(){
    if(restoring)return;
    restoring=true;
    const y=savedY;
    requestAnimationFrame(()=>{
      window.scrollTo({top:y,left:0,behavior:'instant'});
      setTimeout(()=>{
        window.scrollTo(0,y);
        restoring=false;
      },50);
    });
  }

  // Capture le clic avant le gestionnaire de l'application.
  grid.addEventListener('click',function(event){
    const card=event.target.closest('.card');
    if(card)savePosition();
    setTimeout(restorePosition,0);
    setTimeout(restorePosition,120);
  },true);

  modal.addEventListener('close',restorePosition);
  modal.addEventListener('cancel',restorePosition);
})();
