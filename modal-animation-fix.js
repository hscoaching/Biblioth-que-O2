(function(){
  const modal=document.querySelector('#exercise-modal'),content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA_URL='https://exercise-dataset.com/exercises.json',BASE='https://exercise-dataset.com/';
  let timer=null,busy=false;
  const abs=p=>{try{return p?new URL(p,BASE).href:''}catch{return''}};

  function style(){
    if(document.querySelector('#hs-final-media-style'))return;
    const s=document.createElement('style');s.id='hs-final-media-style';
    s.textContent=`
      #modal-content .modal-media.media-pair.hs-final-media{display:block!important;position:relative!important;height:245px!important;min-height:245px!important;margin:0 0 22px!important;padding:0!important;background:#eee!important;border:1px solid #252525!important;border-radius:16px!important;overflow:hidden!important}
      #modal-content .modal-media.media-pair.hs-final-media img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;visibility:visible!important;transition:opacity .45s ease!important}
      @media(min-width:601px){#modal-content .modal-media.media-pair.hs-final-media{height:310px!important;min-height:310px!important}}
    `;document.head.appendChild(s);
  }

  function animate(pair){
    const imgs=[...pair.querySelectorAll('img')];if(imgs.length<2)return;
    if(timer)clearInterval(timer);
    imgs.forEach((img,i)=>{img.loading='eager';img.decoding='sync';img.style.visibility='visible';img.style.opacity=i===0?'1':'0'});
    let first=true;
    timer=setInterval(()=>{
      if(!document.body.contains(pair)){clearInterval(timer);timer=null;return}
      first=!first;imgs[0].style.opacity=first?'1':'0';imgs[1].style.opacity=first?'0':'1';
    },900);
  }

  function clean(){
    const fiche=content.querySelector('.modal');if(!fiche)return;
    const metas=[...fiche.querySelectorAll('.hs-meta')];metas.slice(1).forEach(x=>x.remove());
    const prim=[...fiche.querySelectorAll('.hs-primary')];prim.slice(1).forEach(x=>x.remove());
  }

  async function ensureMedia(){
    const fiche=content.querySelector('.modal');
    const id=new URLSearchParams(location.search).get('exercice');
    if(!fiche||!id)return;
    clean();style();
    let pair=fiche.querySelector('.modal-media.media-pair');
    if(pair){
      pair.classList.add('hs-final-media');
      const imgs=pair.querySelectorAll('img');
      imgs.forEach(img=>{img.loading='eager';img.decoding='sync';img.style.visibility='visible'});
      if(imgs.length>=2)animate(pair);
      return;
    }
    if(busy)return;busy=true;
    try{
      const res=await fetch(DATA_URL,{cache:'no-store'});const data=await res.json();
      const e=(data.exercises||[]).find(x=>String(x.id)===String(id));
      if(!e)return;
      const flat=e.images&&e.images.flat||{};const a=abs(flat.start||flat.main),b=abs(flat.peak);if(!a)return;
      pair=document.createElement('div');pair.className='media-frame media-pair modal-media hs-final-media';
      pair.innerHTML=b?`<img class="media-a" src="${a}" alt="Position de départ — ${e.name||''}" loading="eager"><img class="media-b" src="${b}" alt="Position finale — ${e.name||''}" loading="eager">`:`<img src="${a}" alt="Illustration — ${e.name||''}" loading="eager">`;
      const meta=fiche.querySelector('.hs-meta'),nav=fiche.querySelector('.hs-fiche-nav'),title=fiche.querySelector('h2');
      if(meta)meta.parentNode.insertBefore(pair,meta);else if(nav)nav.insertAdjacentElement('afterend',pair);else if(title)title.insertAdjacentElement('afterend',pair);else fiche.prepend(pair);
      if(b)animate(pair);
    }catch(err){console.error('HS media fix',err)}finally{busy=false}
  }

  new MutationObserver(()=>{clearTimeout(window.__hsMediaFixDebounce);window.__hsMediaFixDebounce=setTimeout(ensureMedia,20)}).observe(content,{childList:true,subtree:true});
  modal.addEventListener('close',()=>{if(timer){clearInterval(timer);timer=null}});
  ensureMedia();
})();
