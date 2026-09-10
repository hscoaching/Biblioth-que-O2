(function(){
  const modal=document.querySelector('#exercise-modal'),content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA_URL='https://exercise-dataset.com/exercises.json',BASE='https://exercise-dataset.com/';
  let timer;
  function url(p){try{return p?new URL(p,BASE).href:''}catch{return''}}
  function fix(){
    const fiche=content.querySelector('.modal');
    if(!fiche)return;
    const id=new URLSearchParams(location.search).get('exercice');
    if(!id)return;
    /* Supprime les doublons créés par les enrichisseurs précédents. */
    const metas=[...fiche.querySelectorAll('.hs-meta')];
    metas.slice(1).forEach(x=>x.remove());
    const primaries=[...fiche.querySelectorAll('.hs-primary')];
    primaries.slice(1).forEach(x=>x.remove());
    let media=fiche.querySelector('.modal-media');
    if(media){
      media.querySelectorAll('img').forEach(img=>{img.loading='eager';img.decoding='sync';img.style.display='block'});
      if(media.querySelectorAll('img').length>=2)start(media);
      return;
    }
    fetch(DATA_URL,{cache:'no-store'}).then(r=>r.json()).then(data=>{
      const e=(data.exercises||[]).find(x=>String(x.id)===String(id));
      if(!e||!e.images)return;
      const flat=e.images.flat||{};
      const a=url(flat.start||flat.main),b=url(flat.peak);
      if(!a)return;
      media=document.createElement('div');media.className='media-frame media-pair modal-media';
      media.innerHTML=b
        ? '<img class="media-a" src="'+a+'" alt="Position de départ" loading="eager" decoding="sync"><img class="media-b" src="'+b+'" alt="Position finale" loading="eager" decoding="sync">'
        : '<img src="'+a+'" alt="Illustration" loading="eager" decoding="sync">';
      const nav=fiche.querySelector('.hs-fiche-nav');
      const firstMeta=fiche.querySelector('.hs-meta');
      const title=fiche.querySelector('h2');
      if(firstMeta)fiche.insertBefore(media,firstMeta);
      else if(nav)nav.insertAdjacentElement('afterend',media);
      else if(title)title.insertAdjacentElement('afterend',media);
      else fiche.prepend(media);
      start(media);
    }).catch(()=>{});
  }
  function start(media){
    const imgs=media.querySelectorAll('img');
    if(imgs.length<2)return;
    if(timer)clearInterval(timer);
    media.classList.add('hs-js-animation');
    imgs[0].classList.add('hs-pose-visible');imgs[1].classList.remove('hs-pose-visible');
    timer=setInterval(()=>{
      if(!document.body.contains(media)){clearInterval(timer);return}
      imgs[0].classList.toggle('hs-pose-visible');imgs[1].classList.toggle('hs-pose-visible');
    },850);
  }
  const s=document.createElement('style');
  s.textContent=`
    #modal-content .modal-media.media-pair.hs-js-animation{height:245px!important;min-height:245px!important;position:relative!important;display:block!important;background:#eee!important;border-radius:16px!important;overflow:hidden!important;margin:0 0 22px!important}
    #modal-content .modal-media.media-pair.hs-js-animation img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;opacity:0!important;transition:opacity .45s ease!important}
    #modal-content .modal-media.media-pair.hs-js-animation img.hs-pose-visible{opacity:1!important}
    @media(min-width:601px){#modal-content .modal-media.media-pair.hs-js-animation{height:310px!important;min-height:310px!important}}
  `;
  document.head.appendChild(s);
  new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(fix,30)}).observe(content,{childList:true,subtree:true});
  modal.addEventListener('close',()=>{if(timer)clearInterval(timer)});
  fix();
})();