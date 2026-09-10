// Conserve exactement la position de la page pendant l'ouverture et la fermeture d'une fiche.
(function(){
  const modal=document.querySelector('#exercise-modal');
  const grid=document.querySelector('#exercise-grid');
  if(!modal||!grid)return;

  let savedY=0;
  let savedX=0;
  let raf=0;

  function savePosition(){
    savedX=window.scrollX||window.pageXOffset||0;
    savedY=window.scrollY||window.pageYOffset||0;
  }

  function restorePosition(){
    const x=savedX, y=savedY;
    cancelAnimationFrame(raf);
    const restore=()=>{
      // 'auto' est mieux supporté par Safari/iOS que 'instant'.
      const html=document.documentElement;
      const previous=html.style.scrollBehavior;
      html.style.scrollBehavior='auto';
      window.scrollTo(x,y);
      html.style.scrollBehavior=previous;
    };
    raf=requestAnimationFrame(()=>{
      restore();
      setTimeout(restore,30);
      setTimeout(restore,120);
      setTimeout(restore,300);
    });
  }

  // Capture le clic avant app.js afin d'enregistrer la position AVANT showModal().
  grid.addEventListener('click',function(event){
    const card=event.target.closest('.card');
    if(!card)return;
    savePosition();
    // iOS peut repositionner la page lors de l'ouverture du <dialog>.
    setTimeout(restorePosition,0);
    setTimeout(restorePosition,60);
    setTimeout(restorePosition,180);
  },true);

  modal.addEventListener('close',function(){
    restorePosition();
    setTimeout(restorePosition,80);
    setTimeout(restorePosition,220);
  });

  modal.addEventListener('cancel',function(){
    setTimeout(restorePosition,0);
  });

  // Sécurité supplémentaire pour les ouvertures déclenchées par l'URL.
  window.addEventListener('popstate',function(){
    if(!modal.open){
      setTimeout(restorePosition,0);
      setTimeout(restorePosition,120);
    }
  });
})();
