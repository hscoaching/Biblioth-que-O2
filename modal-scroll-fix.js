// Empêche iOS/Safari de déplacer la page lors de l'ouverture d'une fiche.
(function(){
  const modal=document.querySelector('#exercise-modal');
  const grid=document.querySelector('#exercise-grid');
  if(!modal||!grid)return;

  let savedY=0;
  let savedX=0;
  let locked=false;

  function savePosition(){
    savedX=window.scrollX||window.pageXOffset||0;
    savedY=window.scrollY||window.pageYOffset||0;
  }

  function lockPage(){
    if(locked)return;
    locked=true;
    const body=document.body;
    body.dataset.hsScrollY=String(savedY);
    body.dataset.hsScrollX=String(savedX);
    body.style.position='fixed';
    body.style.top=(-savedY)+'px';
    body.style.left=(-savedX)+'px';
    body.style.right='0';
    body.style.width='100%';
    body.style.overflow='hidden';
  }

  function bodyValue(key,fallback){
    return document.body.dataset[key]!==undefined?document.body.dataset[key]:fallback;
  }

  function unlockPage(){
    if(!locked)return;
    const y=Number(bodyValue('hsScrollY',savedY));
    const x=Number(bodyValue('hsScrollX',savedX));
    const body=document.body;
    body.style.position='';
    body.style.top='';
    body.style.left='';
    body.style.right='';
    body.style.width='';
    body.style.overflow='';
    delete body.dataset.hsScrollY;
    delete body.dataset.hsScrollX;
    locked=false;
    requestAnimationFrame(()=>window.scrollTo(x,y));
    setTimeout(()=>window.scrollTo(x,y),50);
    setTimeout(()=>window.scrollTo(x,y),180);
  }

  grid.addEventListener('click',function(event){
    // Un clic sur Favoris ne doit jamais verrouiller la page.
    if(event.target.closest('.hs-fav'))return;
    const card=event.target.closest('.card');
    if(!card)return;
    savePosition();
    lockPage();
  },true);

  modal.addEventListener('close',unlockPage);
  modal.addEventListener('cancel',function(){setTimeout(unlockPage,0)});

  // Si une fiche est ouverte via un lien direct/URL.
  const originalPushState=history.pushState.bind(history);
  history.pushState=function(){
    const result=originalPushState(...arguments);
    if(modal.open&&!locked){savePosition();lockPage()}
    return result;
  };

  window.addEventListener('popstate',function(){
    if(!modal.open)unlockPage();
  });
})();
