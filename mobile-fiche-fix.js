// HS Coaching — ouverture fiable des fiches, y compris sur mobile.
(function(){
  const modal=document.querySelector('#exercise-modal');
  const content=document.querySelector('#modal-content');
  if(!modal||!content)return;

  function getExercise(id){
    const list=typeof exercises!=='undefined'&&Array.isArray(exercises)?exercises:[];
    return list.find(e=>String(e.id)===String(id));
  }

  function renderExercise(e){
    const tr=typeof translatedExercise==='function'?translatedExercise(e):e;
    const muscles=(e.muscles||[]).slice(0,8).map(m=>typeof labelMuscle==='function'?labelMuscle(m):String(m).replace(/_/g,' '));
    const instructions=Array.isArray(tr.instructions)?tr.instructions:[];
    const tips=Array.isArray(tr.tips)?tr.tips:[];
    const media=typeof mediaHtml==='function'?mediaHtml(e,true):'';
    content.innerHTML=`<div class="modal">
      ${media}
      <h2>${tr.name||e.name||''}</h2>
      <p>${tr.description||''}</p>
      <div class="modal-muscles"><strong>Muscles sollicités</strong><div>${muscles.map(m=>`<span>${m}</span>`).join('')}</div></div>
      <h3>Exécution</h3>
      <ol>${instructions.map(x=>`<li>${x}</li>`).join('')}</ol>
      <div class="modal-errors"></div>
      ${tips.length?`<h3>Conseils</h3><ul>${tips.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}
    </div>`;
  }

  function show(){
    try{
      if(typeof modal.showModal==='function'){
        if(modal.open)modal.close();
        modal.showModal();
      }else if(typeof modal.show==='function'){
        if(modal.open)modal.close();
        modal.show();
      }else{
        modal.setAttribute('open','');
      }
    }catch(err){
      console.warn('HS Coaching: fallback ouverture fiche',err);
      modal.setAttribute('open','');
    }
  }

  window.openExercise=function(id,updateUrl=true){
    const e=getExercise(id);
    if(!e)return;
    renderExercise(e);
    if(updateUrl)history.pushState({exercise:String(e.id)},'',`${location.pathname}?exercice=${encodeURIComponent(e.id)}`);
    show();
  };

  window.openFromUrl=function(){
    const id=new URLSearchParams(location.search).get('exercice');
    if(id&&getExercise(id))window.openExercise(id,false);
  };

  const close=()=>{
    if(modal.open){try{modal.close()}catch{modal.removeAttribute('open')}}
    if(new URLSearchParams(location.search).has('exercice'))history.pushState({},'',location.pathname);
  };
  document.getElementById('close-modal')?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  window.addEventListener('popstate',()=>{
    const id=new URLSearchParams(location.search).get('exercice');
    if(id&&getExercise(id))window.openExercise(id,false);else if(modal.open){try{modal.close()}catch{modal.removeAttribute('open')}}
  });
})();
