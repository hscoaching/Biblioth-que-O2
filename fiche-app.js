(function(){
  const modal=document.querySelector('#exercise-modal'), content=document.querySelector('#modal-content');
  if(!modal||!content)return;

  function injectStyles(){
    if(document.querySelector('#hs-fiche-app-style'))return;
    const s=document.createElement('style'); s.id='hs-fiche-app-style'; s.textContent=`
      #exercise-modal{padding:0;overflow:auto;background:#111;border-color:#292929}
      #exercise-modal .close{position:sticky;float:right;top:10px;right:auto;margin:10px 10px 0 0;width:40px;height:40px;border-radius:50%;background:#1b1b1b;border:1px solid #303030;color:#fff;font-size:26px;line-height:1;display:grid;place-items:center;z-index:30}
      #modal-content .modal{padding:28px 30px 30px;clear:both}
      #modal-content .modal-tag{font-size:10px;font-weight:800;letter-spacing:1.8px;color:#777;margin-top:2px}
      #modal-content h2{font-size:clamp(27px,5vw,36px);line-height:1.05;letter-spacing:-.8px;margin:8px 45px 18px 0}
      #modal-content .modal-media{margin:0 0 22px;border:1px solid #252525;border-radius:16px;background:#eee;padding:0;overflow:hidden}
      #modal-content .modal-media .media-frame{height:310px;border-radius:0;background:#eee}
      #modal-content .modal-media.media-pair .media-a{height:310px!important;object-fit:contain!important}
      #modal-content .hs-fiche-kicker{font-size:9px;font-weight:900;letter-spacing:2px;color:#666;margin:0 0 7px}
      #modal-content .hs-fiche-divider{height:1px;background:#242424;margin:0 0 18px}
      #modal-content .hs-meta{margin:0 0 22px}
      #modal-content .hs-meta-item{min-height:62px;background:#0d0d0d;border:1px solid #202020;border-radius:11px;padding:11px 13px}
      #modal-content .hs-primary{padding:16px 0 18px;border-top:1px solid #242424;border-bottom:1px solid #242424;margin-top:8px}
      #modal-content .hs-coach{border-color:#303030;box-shadow:inset 3px 0 0 #fff;background:#0d0d0d;border-radius:11px;padding:15px 16px}
      #modal-content .hs-coach h3{margin-top:0}
      #modal-content .hs-coach h3:before{content:'💡';margin-right:7px}
      #modal-content .hs-fiche-nav{position:sticky;top:0;z-index:20;display:flex;gap:4px;margin:0 0 20px;padding:6px;background:rgba(8,8,8,.96);border:1px solid #242424;border-radius:11px;backdrop-filter:blur(10px)}
      #modal-content .hs-fiche-nav button{flex:1;border:0;background:transparent;color:#777;border-radius:8px;padding:9px 5px;font-size:10px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}
      #modal-content .hs-fiche-nav button.active{background:#fff;color:#000}
      #modal-content .hs-fiche-section{scroll-margin-top:68px}
      #modal-content .hs-step{display:flex;gap:12px;align-items:flex-start;margin:9px 0;padding:11px 12px;background:#0d0d0d;border:1px solid #202020;border-radius:11px}
      #modal-content .hs-step-num{flex:0 0 25px;height:25px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;font-size:11px;font-weight:900}
      #modal-content .hs-step-text{font-size:13px;line-height:1.55;color:#bbb;padding-top:2px}
      #modal-content .hs-fiche-close{display:block;width:100%;margin:28px 0 0;height:44px;border:1px solid #292929;border-radius:11px;background:#1a1a1a;color:#aaa;font-size:12px;font-weight:800;cursor:pointer}
      #modal-content .hs-fiche-close:active{background:#fff;color:#000}
      #modal-content .modal h3{font-size:13px;letter-spacing:.2px;margin:26px 0 10px}
      #modal-content .modal p,#modal-content .modal li{font-size:13px;line-height:1.6}
      @media(max-width:600px){
        #modal-content .modal{padding:20px 16px 22px}
        #modal-content h2{font-size:28px;margin-right:42px}
        #modal-content .modal-media .media-frame{height:245px}
        #modal-content .modal-media.media-pair .media-a{height:245px!important}
        #modal-content .hs-fiche-nav{margin-bottom:18px;padding:5px}
        #modal-content .hs-fiche-nav button{padding:9px 3px;font-size:9px}
        #modal-content .hs-step{padding:9px 10px}
        #modal-content .hs-step-text{font-size:12px}
      }
    `; document.head.appendChild(s);
  }

  function enhance(){
    const fiche=content.querySelector('.modal');
    if(!fiche || fiche.querySelector('.hs-fiche-nav'))return;
    injectStyles();

    const title=fiche.querySelector('h2');
    if(title && !fiche.querySelector('.hs-fiche-kicker')){
      const kicker=document.createElement('div'); kicker.className='hs-fiche-kicker'; kicker.textContent='FICHE EXERCICE';
      title.parentNode.insertBefore(kicker,title);
    }
    if(title && !fiche.querySelector('.hs-fiche-divider')){
      const divider=document.createElement('div'); divider.className='hs-fiche-divider';
      title.insertAdjacentElement('afterend',divider);
    }

    const nav=document.createElement('nav'); nav.className='hs-fiche-nav'; nav.setAttribute('aria-label','Navigation de la fiche');
    const sections=[];
    const add=(label,id,el)=>{if(!el)return; el.id=id; el.classList.add('hs-fiche-section'); sections.push({id,label,el});};

    const media=fiche.querySelector('.modal-media');
    const meta=fiche.querySelector('.hs-meta');
    const primary=fiche.querySelector('.hs-primary');
    const coach=fiche.querySelector('.hs-coach');
    const headings=[...fiche.querySelectorAll('h3')];
    const executionHeading=headings.find(h=>/exécution|execution|consigne|instruction/i.test(h.textContent||''));

    add('Présentation','hs-presentation',meta||primary||media);
    add('Exécution','hs-execution',executionHeading||headings[0]);
    add('Conseil','hs-conseil',coach);

    if(executionHeading){
      let list=executionHeading.nextElementSibling;
      if(list && (list.tagName==='OL'||list.tagName==='UL') && !list.classList.contains('hs-steps')){
        const steps=document.createElement('div'); steps.className='hs-steps';
        [...list.children].forEach((li,i)=>{
          const row=document.createElement('div'); row.className='hs-step';
          row.innerHTML='<span class="hs-step-num">'+(i+1)+'</span><span class="hs-step-text"></span>';
          row.querySelector('.hs-step-text').textContent=li.textContent;
          steps.appendChild(row);
        });
        list.replaceWith(steps);
      }
    }

    sections.forEach((sec,i)=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=sec.label;
      b.onclick=()=>{sec.el.scrollIntoView({behavior:'smooth',block:'start'});setActive(i)};
      nav.appendChild(b);
    });
    if(sections.length){
      if(title)title.insertAdjacentElement('afterend',nav); else fiche.prepend(nav);
      function setActive(i){[...nav.children].forEach((b,j)=>b.classList.toggle('active',j===i))}
      setActive(0);
      const obs=new IntersectionObserver(entries=>{
        const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(visible){const i=sections.findIndex(s=>s.el===visible.target);if(i>=0)setActive(i)}
      },{root:modal,threshold:[.2,.5,.8]});
      sections.forEach(sec=>obs.observe(sec.el));
    }

    if(!fiche.querySelector('.hs-fiche-close')){
      const btn=document.createElement('button'); btn.type='button'; btn.className='hs-fiche-close'; btn.textContent='Fermer la fiche';
      btn.onclick=()=>modal.close(); fiche.appendChild(btn);
    }
  }

  const observer=new MutationObserver(enhance); observer.observe(content,{childList:true,subtree:true});
  enhance();
})();
