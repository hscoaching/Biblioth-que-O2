(function(){
  const modal=document.querySelector('#exercise-modal'), content=document.querySelector('#modal-content');
  if(!modal||!content)return;

  function injectStyles(){
    if(document.querySelector('#hs-fiche-app-style'))return;
    const s=document.createElement('style'); s.id='hs-fiche-app-style'; s.textContent=`
      .hs-fiche-nav{position:sticky;top:0;z-index:8;display:flex;gap:4px;padding:7px;background:rgba(8,8,8,.94);border-bottom:1px solid #202020;backdrop-filter:blur(10px)}
      .hs-fiche-nav button{flex:1;border:0;background:transparent;color:#777;border-radius:9px;padding:10px 6px;font-size:10px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}
      .hs-fiche-nav button.active{background:#fff;color:#000}
      .hs-fiche-section{scroll-margin-top:58px}
      .hs-step{display:flex;gap:12px;align-items:flex-start;margin:9px 0;padding:10px 11px;background:#0d0d0d;border:1px solid #202020;border-radius:11px}
      .hs-step-num{flex:0 0 24px;height:24px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;font-size:11px;font-weight:900}
      .hs-step-text{font-size:13px;line-height:1.55;color:#bbb;padding-top:2px}
      @media(max-width:600px){.hs-fiche-nav{margin:0 -18px;padding:6px 8px}.hs-fiche-nav button{padding:9px 4px;font-size:9px}.hs-step{padding:9px 10px}}
    `; document.head.appendChild(s);
  }

  function enhance(){
    const fiche=content.querySelector('.modal');
    if(!fiche || fiche.querySelector('.hs-fiche-nav'))return;
    injectStyles();

    const nav=document.createElement('nav'); nav.className='hs-fiche-nav'; nav.setAttribute('aria-label','Navigation de la fiche');
    const sections=[];
    const add=(label,id,el)=>{if(!el)return; el.id=id; el.classList.add('hs-fiche-section'); sections.push({id,label,el});};

    const media=fiche.querySelector('.modal-media');
    const meta=fiche.querySelector('.hs-meta');
    const primary=fiche.querySelector('.hs-primary');
    const coach=fiche.querySelector('.hs-coach');
    const headings=[...fiche.querySelectorAll('h3')];
    let executionHeading=headings.find(h=>/exécution|execution|consigne|instruction/i.test(h.textContent||''));
    let execution=executionHeading;

    add('Présentation','hs-presentation',meta||primary||media);
    add('Exécution','hs-execution',execution||headings[0]);
    add('Conseil','hs-conseil',coach);

    // Si les consignes sont une liste, transforme-les en étapes visuelles.
    if(execution){
      let list=execution.nextElementSibling;
      if(list && (list.tagName==='OL'||list.tagName==='UL') && !list.classList.contains('hs-steps')){
        const steps=document.createElement('div'); steps.className='hs-steps';
        [...list.children].forEach((li,i)=>{const row=document.createElement('div');row.className='hs-step';row.innerHTML='<span class="hs-step-num">'+(i+1)+'</span><span class="hs-step-text"></span>';row.querySelector('.hs-step-text').textContent=li.textContent;steps.appendChild(row)});
        list.replaceWith(steps);
      }
    }

    if(!sections.length)return;
    sections.forEach((sec,i)=>{const b=document.createElement('button');b.type='button';b.textContent=sec.label;b.onclick=()=>{sec.el.scrollIntoView({behavior:'smooth',block:'start'});setActive(i)};nav.appendChild(b)});
    const title=fiche.querySelector('h2'); if(title) title.insertAdjacentElement('afterend',nav); else fiche.prepend(nav);
    function setActive(i){[...nav.children].forEach((b,j)=>b.classList.toggle('active',j===i))}
    setActive(0);

    const obs=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const i=sections.findIndex(s=>s.el===visible.target);if(i>=0)setActive(i)}},{root:content,threshold:[.2,.5,.8]});
    sections.forEach(s=>obs.observe(s.el));
  }

  const observer=new MutationObserver(enhance); observer.observe(content,{childList:true,subtree:true});
  enhance();
})();
