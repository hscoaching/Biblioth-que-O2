(function(){
  const modal=document.querySelector('#exercise-modal');
  const content=document.querySelector('#modal-content');
  if(!modal||!content)return;

  function enhance(){
    const fiche=content.querySelector('.modal');
    const title=content.querySelector('h2');
    if(!fiche||!title)return;

    if(!fiche.querySelector('.hs-fiche-kicker')){
      const kicker=document.createElement('div');
      kicker.className='hs-fiche-kicker';
      kicker.textContent='FICHE EXERCICE';
      title.parentNode.insertBefore(kicker,title);
    }

    if(!fiche.querySelector('.hs-fiche-divider')){
      const divider=document.createElement('div');
      divider.className='hs-fiche-divider';
      const firstSection=fiche.querySelector('.hs-meta');
      if(firstSection)firstSection.parentNode.insertBefore(divider,firstSection);
    }

    if(!fiche.querySelector('.hs-fiche-close')){
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='hs-fiche-close';
      btn.setAttribute('aria-label','Fermer la fiche');
      btn.textContent='Fermer';
      btn.addEventListener('click',()=>{
        const close=document.querySelector('#close-modal');
        if(close)close.click();
        else if(typeof modal.close==='function')modal.close();
      });
      fiche.appendChild(btn);
    }

    if(!document.querySelector('#hs-fiche-ui-style')){
      const s=document.createElement('style');
      s.id='hs-fiche-ui-style';
      s.textContent=`
        #exercise-modal{scrollbar-width:thin;scrollbar-color:#333 transparent}
        #exercise-modal .hs-fiche-kicker{font-size:9px;font-weight:800;letter-spacing:2px;color:#666;margin:0 42px 7px 0}
        #exercise-modal .hs-fiche-divider{height:1px;background:#222;margin:0 0 18px}
        #exercise-modal .hs-meta{margin-bottom:22px}
        #exercise-modal .hs-meta-item{min-height:66px;display:flex;flex-direction:column;justify-content:center}
        #exercise-modal .hs-primary{padding:16px 0 18px;border-top:1px solid #222;border-bottom:1px solid #222}
        #exercise-modal .hs-primary-title{margin-bottom:9px}
        #exercise-modal .hs-coach{position:relative;border-color:#333;box-shadow:inset 3px 0 0 #fff}
        #exercise-modal .hs-coach h3:before{content:'💡';margin-right:7px}
        #exercise-modal .hs-fiche-close{display:block;width:100%;margin:30px 0 0;height:42px;border:1px solid #292929;border-radius:11px;background:#111;color:#aaa;font-size:12px;font-weight:700;cursor:pointer}
        #exercise-modal .hs-fiche-close:active{background:#fff;color:#000}
        @media(max-width:600px){
          #exercise-modal{width:calc(100% - 16px);max-height:92vh;border-radius:20px}
          #modal-content .modal{padding:22px 16px 20px}
          #exercise-modal .hs-fiche-kicker{margin-right:38px}
          #exercise-modal .hs-meta-item{min-height:62px;padding:10px}
          #exercise-modal .hs-primary{padding:14px 0 16px}
          #exercise-modal .hs-fiche-close{height:44px;margin-top:24px}
        }
      `;
      document.head.appendChild(s);
    }
  }

  const observer=new MutationObserver(enhance);
  observer.observe(content,{childList:true,subtree:true});
  enhance();
})();