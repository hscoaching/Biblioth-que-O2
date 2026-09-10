(function(){
  const modal=document.querySelector('#exercise-modal');
  const content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA='https://exercise-dataset.com/exercises.json';
  let timer=null;
  let lastId='';

  function exerciseId(){return new URLSearchParams(location.search).get('exercice')||'';}

  function cleanDuplicates(){
    const metas=[...content.querySelectorAll('.hs-meta')];
    metas.slice(1).forEach(x=>x.remove());
  }

  function imageBox(e){
    const flat=e&&e.images&&e.images.flat?e.images.flat:{};
    const start=flat.start||flat.main;
    const peak=flat.peak;
    if(!start)return null;
    const base='https://exercise-dataset.com/';
    const a=new URL(start,base).href;
    const b=peak?new URL(peak,base).href:'';
    const box=document.createElement('div');
    box.className='hs-final-media'+(b?' hs-final-pair':'');
    box.innerHTML='<img class="hs-final-a" src="'+a+'" alt="Position de départ" loading="eager"><img class="hs-final-b" src="'+(b||a)+'" alt="Position finale" loading="eager">';
    return {box,a,b};
  }

  function styles(){
    if(document.querySelector('#hs-final-repair-style'))return;
    const s=document.createElement('style');s.id='hs-final-repair-style';
    s.textContent=`
      #modal-content .hs-final-media{display:block!important;position:relative!important;width:100%!important;height:245px!important;margin:0 0 22px!important;border:1px solid #292929!important;border-radius:16px!important;background:#eee!important;overflow:hidden!important;box-sizing:border-box!important}
      #modal-content .hs-final-media img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;margin:0!important;padding:0!important;border:0!important;visibility:visible!important}
      #modal-content .hs-final-media.hs-final-pair .hs-final-a{opacity:1!important;transition:opacity .35s ease!important}
      #modal-content .hs-final-media.hs-final-pair .hs-final-b{opacity:0!important;transition:opacity .35s ease!important}
      #modal-content .hs-final-media:not(.hs-final-pair) .hs-final-b{display:none!important}
      @media(min-width:601px){#modal-content .hs-final-media{height:310px!important}}
    `;
    document.head.appendChild(s);
  }

  function animate(box){
    if(!box.classList.contains('hs-final-pair'))return;
    if(box._timer)clearInterval(box._timer);
    const a=box.querySelector('.hs-final-a'),b=box.querySelector('.hs-final-b');
    if(!a||!b)return;
    let first=true;
    box._timer=setInterval(()=>{
      if(!document.body.contains(box)){clearInterval(box._timer);box._timer=null;return;}
      first=!first;
      a.style.setProperty('opacity',first?'1':'0','important');
      b.style.setProperty('opacity',first?'0':'1','important');
    },850);
  }

  async function repair(){
    const id=exerciseId();
    if(!id)return;
    const fiche=content.querySelector('.modal');
    const title=fiche&&fiche.querySelector('h2');
    if(!title)return;
    styles();
    cleanDuplicates();

    let media=content.querySelector('.hs-final-media');
    if(!media){
      const existing=content.querySelector('.modal-media');
      if(existing){
        existing.style.setProperty('display','block','important');
        existing.style.setProperty('height','245px','important');
        existing.querySelectorAll('img').forEach(img=>{img.loading='eager';img.style.setProperty('visibility','visible','important');});
        if(existing.querySelectorAll('img').length>=2) existing.classList.add('hs-final-existing-pair');
        return;
      }
      try{
        const r=await fetch(DATA,{cache:'no-store'});
        const json=await r.json();
        const all=json.exercises||[];
        const e=all.find(x=>String(x.id)===String(id));
        if(!e)return;
        const made=imageBox(e);
        if(!made)return;
        const currentId=exerciseId();
        if(currentId!==id)return;
        title.insertAdjacentElement('afterend',made.box);
        media=made.box;
        [made.box.querySelector('.hs-final-a'),made.box.querySelector('.hs-final-b')].forEach(img=>{if(img)img.decode?.().catch(()=>{});});
        animate(media);
      }catch(e){}
    }else{
      animate(media);
    }
  }

  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(repair,80)});
  observer.observe(content,{childList:true,subtree:true});
  modal.addEventListener('toggle',()=>setTimeout(repair,80));
  setTimeout(repair,100);
})();
