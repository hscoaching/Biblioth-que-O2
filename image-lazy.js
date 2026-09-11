// Chargement intelligent des images des cartes : seules les images proches de l'écran sont téléchargées.
(function(){
  const grid=document.querySelector('#exercise-grid');
  if(!grid)return;

  const pending=new Set();
  const load=img=>{
    const src=img.dataset.hsSrc;
    if(!src)return;
    img.src=src;
    img.removeAttribute('data-hs-src');
    img.dataset.hsLoaded='1';
    pending.delete(img);
  };

  const observer='IntersectionObserver' in window
    ? new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){load(entry.target);observer.unobserve(entry.target)}
      }),{rootMargin:'700px 0px'})
    : null;

  function prepare(root){
    root.querySelectorAll('img').forEach(img=>{
      if(img.dataset.hsLoaded==='1'||img.dataset.hsSrc)return;
      const src=img.getAttribute('src');
      if(!src)return;
      img.dataset.hsSrc=src;
      img.removeAttribute('src');
      pending.add(img);
      if(observer)observer.observe(img);else load(img);
    });
  }

  prepare(grid);
  const mutations=new MutationObserver(()=>prepare(grid));
  mutations.observe(grid,{childList:true});

  window.addEventListener('beforeunload',()=>pending.clear(),{once:true});
})();
