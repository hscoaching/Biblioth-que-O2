// HS Coaching — fonctionnalités fusionnées de l'ancien ensemble de correctifs.
// Chargé avant app.js : les correctifs DOM attendent leur contenu quand nécessaire.
// Le catalogue est chargé une seule fois par le coeur applicatif ; les modules
// ci-dessous réutilisent window.HS_EXERCISES au lieu de refaire des requêtes.

// --- Fusion de client-ui.js ---
/* HS Coaching — navigation client + notifications */
(function(){
  const rawPath=location.pathname.split('/').pop().toLowerCase();
  const path=(!rawPath||rawPath==='index.html')?'index.html':rawPath;
  const nav=[['index.html','Accueil'],['programmes.html','Programmes'],['compte.html','Mon compte']];
  const style=document.createElement('style');style.textContent=`
.hs-client-nav{position:static;z-index:100;display:flex;align-items:center;gap:4px;padding:4px;margin:0 12px 0 auto;background:rgba(11,11,11,.94);backdrop-filter:blur(14px);border:1px solid #252525;border-radius:10px;box-shadow:0 8px 30px #0005;width:max-content;max-width:calc(100% - 12px)}
.hs-client-nav a{position:relative;flex:0 0 auto;color:#777;text-decoration:none;text-align:center;padding:7px 10px;border-radius:7px;font-size:10px;font-weight:900;white-space:nowrap}.hs-client-nav a.active{background:#fff !important;color:#000 !important}.hs-client-badge{position:absolute;top:3px;right:18%;min-width:15px;height:15px;padding:0 4px;border-radius:99px;background:#fff;color:#000;border:2px solid #111;font-size:8px;line-height:11px}
@media(max-width:650px){.hs-client-nav{margin:0 8px 0 auto;gap:3px;padding:3px}.hs-client-nav a{padding:7px 6px;font-size:9px}.hs-client-badge{right:8%}}
`;document.head.appendChild(style);
  function mountNav(){if(document.querySelector('.hs-client-nav'))return;const top=document.querySelector('.topbar');const navEl=document.createElement('nav');navEl.className='hs-client-nav';nav.forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;if(href===path)a.className='active';navEl.appendChild(a)});if(top){top.appendChild(navEl)}else{document.body.insertBefore(navEl,document.body.firstChild)}}
  async function protectTestMode(){
    if(path!=='compte.html')return;
    const testBox=document.getElementById('testAccess');
    if(testBox)testBox.remove();
    try{
      const cfg=window.HS_SUPABASE_CONFIG;
      if(!cfg||!window.supabase)return;
      const sb=window.supabase.createClient(cfg.url,cfg.key);
      const r=await sb.auth.getUser();
      const user=r.data?.user;
      if(!user){localStorage.removeItem('hs_test_client_mode');return}
      const a=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
      if(!a.data)localStorage.removeItem('hs_test_client_mode');
    }catch(e){localStorage.removeItem('hs_test_client_mode')}
  }
  function init(){mountNav();protectTestMode()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// --- Fusion de ios-fix.js ---
// Pont client : Supabase reste la source unique des données modifiables.
// Les médias animés restent issus du dataset RepDB, pour conserver les animations.
(function(){
  const SUPABASE_URL='https://hcjoagpkgpqxgzjdyfvd.supabase.co';
  const SUPABASE_KEY='sb_publishable_ezHZ_co222B09HGiSeCkyw_Nw4G5FLB';
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const originalFetch=window.fetch.bind(window);
  const bodyParts={chest:'chest',pectoralis_major:'chest',pectoralis_minor:'chest',back:'back',latissimus_dorsi:'back',trapezius:'back',rhomboids:'back',shoulders:'shoulders',deltoids:'shoulders',anterior_deltoid:'shoulders',lateral_deltoid:'shoulders',rear_deltoid:'shoulders',biceps:'upper_arms',brachialis:'upper_arms',triceps:'upper_arms',forearms:'lower_arms',quadriceps:'upper_legs',hamstrings:'upper_legs',gluteus_maximus:'upper_legs',glutes:'upper_legs',adductors:'upper_legs',abductors:'upper_legs',calves:'lower_legs',tibialis_anterior:'lower_legs',rectus_abdominis:'core',obliques:'core',transverse_abdominis:'core',core:'core',hip_flexors:'core',neck:'neck'};
  function part(muscles){for(const m of (muscles||[]))if(bodyParts[m])return bodyParts[m];return 'core'}
  function mediaMap(rows){const map=new Map();for(const e of (rows||[])){const keys=[e.slug,e.id,e.name_en,e.name].filter(Boolean).map(String);keys.forEach(k=>map.set(k,e.images||{}))}return map}
  function toRepDb(rows,media){return {exercises:(rows||[]).map(e=>{const imgs=media.get(String(e.slug))||media.get(String(e.id))||{};return {id:e.slug||String(e.id),name_en:e.name_fr||e.name||e.slug||String(e.id),description_en:e.description_fr||e.description||'',primary_muscles:e.muscles||[],secondary_muscles:[],equipment:e.equipment||'',difficulty:e.level||'',instructions_en:Array.isArray(e.instructions_fr)&&e.instructions_fr.length?e.instructions_fr:(e.instructions||[]),tips_en:Array.isArray(e.tips_fr)&&e.tips_fr.length?e.tips_fr:(e.tips||[]),body_part:part(e.muscles),images:imgs.flat?imgs:{flat:{start:e.media_url||'',main:e.media_url||''}}}})}}
  window.translatedExercise=function(e){return {name:e.name_en||e.name||'',description:e.description_en||e.description||'',instructions:Array.isArray(e.instructions_en)?e.instructions_en:(e.instructions||[]),tips:Array.isArray(e.tips_en)?e.tips_en:(e.tips||[])}};
  async function fetchMedia(){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),5000);
    try{
      const r=await originalFetch(DATA_URL,{cache:'force-cache',signal:controller.signal});
      if(!r.ok)throw new Error('RepDB HTTP '+r.status);
      return await r.json();
    }catch(err){
      console.warn('Médias animés RepDB indisponibles, fallback Supabase utilisé.',err);
      return [];
    }finally{clearTimeout(timer)}
  }
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url===DATA_URL){
      try{
        // Les données Supabase ne dépendent plus du chargement de RepDB.
        // Ainsi la bibliothèque reste fonctionnelle même si le dataset média est lent/inaccessible.
        const dbPromise=originalFetch(SUPABASE_URL+'/rest/v1/exercises?select=*&is_published=eq.true&order=name',{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY},cache:'no-store'});
        const [dbRes,media]=await Promise.all([dbPromise,fetchMedia()]);
        if(!dbRes.ok)throw new Error('Supabase HTTP '+dbRes.status);
        const mediaByKey=mediaMap(media);
        return new Response(JSON.stringify(toRepDb(await dbRes.json(),mediaByKey)),{status:200,headers:{'Content-Type':'application/json'}});
      }catch(err){
        console.error('Bibliothèque Supabase indisponible',err);
        return originalFetch(input,init);
      }
    }
    return originalFetch(input,init);
  };
  function installOpenFix(){const original=window.openExercise;if(typeof original!=='function'||original.__hsFixed)return;const fixed=function(id,updateUrl=true){const normalized=String(id).match(/^\d+$/)?Number(id):id;return original(normalized,updateUrl)};fixed.__hsFixed=true;window.openExercise=fixed}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installOpenFix,{once:true});else installOpenFix();
})();


// --- Fusion de mobile-fiche-fix.js ---
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


// --- Fusion de search-clear.js ---
(function(){
  const wrap=document.querySelector('.search'),input=document.querySelector('#search');
  if(!wrap||!input)return;
  const style=document.createElement('style');
  style.textContent='.search{position:relative}.search-clear{display:none;flex:0 0 32px;width:32px;height:32px;border:1px solid #303030;border-radius:50%;background:#202020;color:#aaa;font-size:20px;line-height:1;cursor:pointer;place-items:center;margin-left:8px}.search-clear.visible{display:grid}.search-clear:active{background:#fff;color:#000}@media(max-width:600px){.search-clear{width:30px;height:30px;font-size:18px}}';
  document.head.appendChild(style);
  const btn=document.createElement('button');btn.type='button';btn.className='search-clear';btn.setAttribute('aria-label','Effacer la recherche');btn.textContent='×';wrap.appendChild(btn);
  function sync(){btn.classList.toggle('visible',!!input.value)}
  btn.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();sync()});
  input.addEventListener('input',sync);sync();
})();

// --- Fusion de modal-scroll-fix.js ---
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


// --- Fusion de fiche-app.js ---
(function(){
  const modal=document.querySelector('#exercise-modal'),content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  function injectStyles(){if(document.querySelector('#hs-fiche-app-style'))return;const s=document.createElement('style');s.id='hs-fiche-app-style';s.textContent=`#exercise-modal{padding:0;overflow:auto;background:#111;border-color:#292929;-webkit-overflow-scrolling:touch}#exercise-modal .close{position:sticky;float:right;top:10px;margin:10px 10px 0 0;width:40px;height:40px;border-radius:50%;background:#1b1b1b;border:1px solid #303030;color:#fff;font-size:26px;line-height:1;display:grid;place-items:center;z-index:30}#modal-content .modal{padding:24px 30px 30px;clear:both}#modal-content .modal-tag{font-size:10px;font-weight:800;letter-spacing:1.8px;color:#777;margin-top:2px}#modal-content h2{font-size:clamp(27px,5vw,36px);line-height:1.05;letter-spacing:-.8px;margin:8px 45px 18px 0}#modal-content .modal-media{margin:0 0 18px;border:1px solid #252525;border-radius:16px;background:#eee;padding:0;overflow:hidden}#modal-content .modal-media.media-pair{height:310px!important;position:relative!important;display:block!important}#modal-content .modal-media.media-pair .media-a,#modal-content .modal-media.media-pair .media-b{position:absolute!important;inset:0;width:100%!important;height:100%!important;object-fit:contain!important;opacity:0!important;transition:opacity .45s ease!important}#modal-content .modal-media.media-pair .media-a.hs-pose-visible,#modal-content .modal-media.media-pair .media-b.hs-pose-visible{opacity:1!important}#modal-content .modal-media:not(.media-pair){height:310px}#modal-content .modal-media:not(.media-pair) img{width:100%;height:100%;object-fit:contain}#modal-content .hs-fiche-kicker{font-size:9px;font-weight:900;letter-spacing:2px;color:#666;margin:0 0 7px}#modal-content .hs-fiche-divider{height:1px;background:#242424;margin:0 0 14px}#modal-content .hs-fiche-back{display:inline-flex;align-items:center;gap:7px;width:auto;margin:0 0 16px;padding:8px 11px;border:1px solid #292929;border-radius:9px;background:#161616;color:#aaa;font-size:10px;font-weight:800;letter-spacing:.4px;cursor:pointer}#modal-content .hs-fiche-back:active{background:#fff;color:#000}#modal-content .hs-meta{margin:0 0 18px}#modal-content .hs-meta-item{min-height:62px;background:#0d0d0d;border:1px solid #202020;border-radius:11px;padding:11px 13px}#modal-content .hs-primary{padding:15px 0 17px;border-top:1px solid #242424;border-bottom:1px solid #242424;margin:8px 0 18px}#modal-content .hs-section-label{font-size:9px;font-weight:900;letter-spacing:1.8px;color:#666;text-transform:uppercase;margin:18px 0 8px}#modal-content .hs-section-label:first-child{margin-top:0}#modal-content .hs-coach{border-color:#303030;box-shadow:inset 3px 0 0 #fff;background:#0d0d0d;border-radius:11px;padding:15px 16px}#modal-content .hs-coach h3{margin-top:0}#modal-content .hs-coach h3:before{content:'💡';margin-right:7px}#modal-content .hs-fiche-nav{position:sticky;top:0;z-index:20;display:flex;gap:4px;margin:0 0 18px;padding:5px;background:rgba(8,8,8,.96);border:1px solid #242424;border-radius:11px;backdrop-filter:blur(10px)}#modal-content .hs-fiche-nav button{flex:1;border:0;background:transparent;color:#777;border-radius:8px;padding:9px 4px;font-size:9px;font-weight:800;letter-spacing:.65px;text-transform:uppercase;cursor:pointer}#modal-content .hs-fiche-nav button.active{background:#fff;color:#000}#modal-content .hs-fiche-section{scroll-margin-top:68px}#modal-content .hs-step{display:flex;gap:12px;align-items:flex-start;margin:8px 0;padding:11px 12px;background:#0d0d0d;border:1px solid #202020;border-radius:11px}#modal-content .hs-step-num{flex:0 0 25px;height:25px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;font-size:11px;font-weight:900}#modal-content .hs-step-text{font-size:13px;line-height:1.55;color:#bbb;padding-top:2px}#modal-content .hs-fiche-close{display:block;width:100%;margin:24px 0 0;height:44px;border:1px solid #292929;border-radius:11px;background:#1a1a1a;color:#aaa;font-size:12px;font-weight:800;cursor:pointer}#modal-content .hs-fiche-close:active{background:#fff;color:#000}#modal-content .modal h3{font-size:13px;letter-spacing:.2px;margin:24px 0 10px}#modal-content .modal p,#modal-content .modal li{font-size:13px;line-height:1.6}#modal-content .qr-section,#modal-content .qr-box,#modal-content .qr-code,#modal-content [class*="qr-"]{display:none!important}@media(max-width:600px){#modal-content .modal{padding:16px 13px 20px}#modal-content h2{font-size:26px;line-height:1.08;margin-right:42px;margin-bottom:13px}#modal-content .modal-media.media-pair{height:245px!important;margin-bottom:14px}#modal-content .modal-media:not(.media-pair){height:245px}#modal-content .hs-fiche-back{margin-bottom:10px;min-height:38px;padding:8px 10px}#modal-content .hs-fiche-nav{margin-bottom:14px;padding:4px;top:-1px}#modal-content .hs-fiche-nav button{padding:8px 2px;font-size:8px}#modal-content .hs-meta{grid-template-columns:1fr 1fr;gap:7px}#modal-content .hs-meta-item{min-height:56px;padding:9px 10px}#modal-content .hs-step{gap:9px;padding:9px 10px;margin:7px 0}#modal-content .hs-step-text{font-size:12px;line-height:1.48}#modal-content .hs-section-label{margin-top:15px}#modal-content .hs-coach{padding:12px 13px}#modal-content .modal p,#modal-content .modal li{font-size:13px;line-height:1.55}#modal-content .hs-fiche-close{margin-top:20px}}@media(max-width:380px){#modal-content .hs-fiche-nav button{font-size:7.5px;letter-spacing:.35px}#modal-content .hs-meta{grid-template-columns:1fr}#modal-content .hs-fiche-back{font-size:9px}}@media(prefers-reduced-motion:reduce){#modal-content .modal-media.media-pair .media-a,#modal-content .modal-media.media-pair .media-b{transition:none!important}}`;document.head.appendChild(s)}
  function animateModalPair(){const pair=content.querySelector('.modal-media.media-pair');if(!pair)return;const a=pair.querySelector('.media-a'),b=pair.querySelector('.media-b');if(!a||!b)return;if(pair._hsAnimTimer)clearInterval(pair._hsAnimTimer);a.classList.add('hs-pose-visible');b.classList.remove('hs-pose-visible');pair._hsAnimTimer=setInterval(()=>{if(!document.body.contains(pair)){clearInterval(pair._hsAnimTimer);return}a.classList.toggle('hs-pose-visible');b.classList.toggle('hs-pose-visible')},850)}
  function addLabelBefore(el,text){if(!el||el.previousElementSibling?.classList.contains('hs-section-label'))return;const label=document.createElement('div');label.className='hs-section-label';label.textContent=text;el.parentNode.insertBefore(label,el)}
  function addLabelInside(parent,text){if(!parent||parent.querySelector(':scope > .hs-section-label'))return;const label=document.createElement('div');label.className='hs-section-label';label.textContent=text;parent.insertBefore(label,parent.firstChild)}
  function enhance(){const fiche=content.querySelector('.modal');if(!fiche)return;injectStyles();if(fiche.querySelector('.hs-fiche-nav')){animateModalPair();return}const title=fiche.querySelector('h2');if(title&&!fiche.querySelector('.hs-fiche-kicker')){const kicker=document.createElement('div');kicker.className='hs-fiche-kicker';kicker.textContent='FICHE EXERCICE';title.parentNode.insertBefore(kicker,title)}if(title&&!fiche.querySelector('.hs-fiche-divider')){const divider=document.createElement('div');divider.className='hs-fiche-divider';title.insertAdjacentElement('afterend',divider)}const back=document.createElement('button');back.type='button';back.className='hs-fiche-back';back.innerHTML='← <span>Retour à la bibliothèque</span>';back.onclick=()=>modal.close();const divider=fiche.querySelector('.hs-fiche-divider');if(divider)divider.insertAdjacentElement('afterend',back);else if(title)title.insertAdjacentElement('afterend',back);const nav=document.createElement('nav');nav.className='hs-fiche-nav';nav.setAttribute('aria-label','Navigation de la fiche');const sections=[];const add=(label,id,el)=>{if(!el)return;el.id=id;el.classList.add('hs-fiche-section');sections.push({id,label,el})};const media=fiche.querySelector('.modal-media'),meta=fiche.querySelector('.hs-meta'),primary=fiche.querySelector('.hs-primary'),coach=fiche.querySelector('.hs-coach');const headings=[...fiche.querySelectorAll('h3')];const executionHeading=headings.find(h=>/exécution|execution|consigne|instruction/i.test(h.textContent||''));const executionTarget=executionHeading||headings.find(h=>!h.closest('.hs-coach')&&!h.closest('.qr-section'));add('Mouvement','hs-mouvement',media||title);add('Muscles','hs-muscles',meta||primary||media);add('Exécution','hs-execution',executionTarget||primary||meta);add('Conseil','hs-conseil',coach);if(meta)addLabelInside(meta,'Muscles sollicités');if(primary)addLabelInside(primary,'Ciblage prioritaire');if(executionHeading)addLabelBefore(executionHeading,'Exécution');if(coach)addLabelInside(coach,'Conseil du coach');if(executionHeading){const list=executionHeading.nextElementSibling;if(list&&(list.tagName==='OL'||list.tagName==='UL')&&!list.classList.contains('hs-steps')){const steps=document.createElement('div');steps.className='hs-steps';[...list.children].forEach((li,i)=>{const row=document.createElement('div');row.className='hs-step';row.innerHTML='<span class="hs-step-num">'+(i+1)+'</span><span class="hs-step-text"></span>';row.querySelector('.hs-step-text').textContent=li.textContent;steps.appendChild(row)});list.replaceWith(steps)}}sections.forEach((sec,i)=>{const b=document.createElement('button');b.type='button';b.textContent=sec.label;b.onclick=()=>{sec.el.scrollIntoView({behavior:'smooth',block:'start'});setActive(i)};nav.appendChild(b)});if(sections.length){if(back)back.insertAdjacentElement('afterend',nav);else if(title)title.insertAdjacentElement('afterend',nav);else fiche.prepend(nav);function setActive(i){[...nav.children].forEach((b,j)=>b.classList.toggle('active',j===i))}setActive(0);const obs=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const i=sections.findIndex(s=>s.el===visible.target);if(i>=0)setActive(i)}},{root:modal,threshold:[.2,.5,.8]});sections.forEach(sec=>obs.observe(sec.el))}if(!fiche.querySelector('.hs-fiche-close')){const btn=document.createElement('button');btn.type='button';btn.className='hs-fiche-close';btn.textContent='Fermer la fiche';btn.onclick=()=>modal.close();fiche.appendChild(btn)}animateModalPair()}
  const observer=new MutationObserver(enhance);observer.observe(content,{childList:true,subtree:true});enhance()
})();

// Carte : affichage du matériel depuis le catalogue déjà chargé par app.js.
// Aucun second fetch du catalogue : on réutilise window.HS_EXERCISES.
(function(){
  const grid=document.querySelector('#exercise-grid');
  if(!grid)return;
  const labels={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',leg_press:'Presse à cuisses',pull_up_bar:'Barre de traction',dip_bars:'Barres parallèles',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine',bench:'Banc',trap_bar:'Barre hexagonale',rings:'Anneaux'};
  function styles(){
    if(document.querySelector('#hs-card-style'))return;
    const s=document.createElement('style');
    s.id='hs-card-style';
    s.textContent='.card-media{transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.card-media:active{transform:scale(.985)}.hs-card-equipment{display:inline-flex;align-items:center;gap:5px;margin-top:9px;color:#777;font-size:10px;font-weight:600;letter-spacing:.15px}.hs-card-equipment::before{content:"•";color:#aaa;font-size:12px}@media(hover:hover){.card-media:hover{transform:translateY(-2px)}}';
    document.head.appendChild(s);
  }
  function add(){
    styles();
    const list=Array.isArray(window.HS_EXERCISES)?window.HS_EXERCISES:[];
    if(!list.length)return;
    const byId=new Map(list.map(e=>[String(e.id),e]));
    grid.querySelectorAll('.card').forEach(card=>{
      if(card.querySelector('.hs-card-equipment'))return;
      const e=byId.get(String(card.dataset.id||''));
      if(!e||!e.equipmentLabel)return;
      const el=document.createElement('span');
      el.className='hs-card-equipment';
      el.textContent=labels[e.equipment]||e.equipmentLabel;
      const p=card.querySelector('p');
      if(p)p.insertAdjacentElement('afterend',el);else card.appendChild(el);
    });
  }
  window.addEventListener('hs-exercises-ready',add);
  const observer=new MutationObserver(add);
  observer.observe(grid,{childList:true,subtree:true});
  add();
})();

// program-link.js était vide/inutile dans la version optimisée : aucun code fusionné.

// --- Fusion de favorites.js ---
(function(){
  const KEY='hscoaching_favorites_v1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').map(String)}catch{return[]}};
  const save=a=>localStorage.setItem(KEY,JSON.stringify(a));
  let favs=get();
  let filter=false;
  let syncing=false;
  const isFav=id=>favs.includes(String(id));
  function button(card){const id=card.dataset.id;if(!id||card.querySelector('.hs-fav'))return;const b=document.createElement('button');b.className='hs-fav'+(isFav(id)?' active':'');b.type='button';b.setAttribute('aria-label',isFav(id)?'Retirer des favoris':'Ajouter aux favoris');b.innerHTML=isFav(id)?'★':'☆';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(id,b)});card.appendChild(b)}
  function toggle(id,b){id=String(id);favs=isFav(id)?favs.filter(x=>x!==id):[...favs,id];save(favs);const on=isFav(id);b.classList.toggle('active',on);b.innerHTML=on?'★':'☆';b.setAttribute('aria-label',on?'Retirer des favoris':'Ajouter aux favoris');updateChip();if(filter)apply()}
  function cards(){document.querySelectorAll('#exercise-grid .card').forEach(button)}
  function updateChip(){const box=document.querySelector('.categories');if(!box)return;let c=box.querySelector('.hs-favorites-chip');if(!c){c=document.createElement('button');c.className='chip hs-favorites-chip';c.type='button';c.addEventListener('click',()=>{filter=!filter;c.classList.toggle('active',filter);apply()});box.appendChild(c)}c.textContent=`★ Favoris${favs.length?` (${favs.length})`:''}`;c.classList.toggle('active',filter)}
  function apply(){const grid=document.querySelector('#exercise-grid');if(!grid)return;grid.querySelectorAll('.card').forEach(card=>card.classList.toggle('hs-favorites-hidden',filter&&!isFav(card.dataset.id)));const count=document.querySelector('#count');if(count&&filter){const visible=[...grid.querySelectorAll('.card')].filter(card=>!card.classList.contains('hs-favorites-hidden'));count.textContent=`${visible.length} favori${visible.length!==1?'s':''}`}}
  function sync(){if(syncing)return;syncing=true;requestAnimationFrame(()=>{cards();updateChip();if(filter)apply();syncing=false})}
  function init(){const grid=document.querySelector('#exercise-grid'),box=document.querySelector('.categories');if(!grid)return;const observer=new MutationObserver(sync);observer.observe(grid,{childList:true});if(box)observer.observe(box,{childList:true});cards();updateChip()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


// --- Fusion de keyboard-nav.js ---
(function(){
  function decorate(grid){
    grid.querySelectorAll('.card').forEach(card=>{
      if(card.getAttribute('tabindex')===null)card.setAttribute('tabindex','0');
      if(!card.getAttribute('role'))card.setAttribute('role','button');
      if(!card.getAttribute('aria-label')){
        const title=card.querySelector('h3')?.textContent?.trim();
        if(title)card.setAttribute('aria-label',`Ouvrir la fiche ${title}`);
      }
    });
  }

  function init(){
    const grid=document.querySelector('#exercise-grid');
    if(!grid)return;
    grid.addEventListener('keydown',e=>{
      const card=e.target.closest('.card');
      if(!card||e.target!==card)return;
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        card.click();
      }
    });
    const observer=new MutationObserver(()=>decorate(grid));
    observer.observe(grid,{childList:true});
    decorate(grid);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();


// --- Fusion de modal-a11y.js ---
(function(){
  function init(){
    const modal=document.querySelector('#exercise-modal');
    const close=document.querySelector('#close-modal');
    const grid=document.querySelector('#exercise-grid');
    if(!modal||!close||!grid)return;

    let origin=null;

    grid.addEventListener('click',function(e){
      const card=e.target.closest('.card');
      if(card)origin=card;
    },true);

    const observer=new MutationObserver(()=>{
      if(modal.open){
        requestAnimationFrame(()=>close.focus({preventScroll:true}));
        observer.disconnect();
      }
    });

    const focusClose=()=>{
      if(!modal.open)return;
      observer.observe(modal,{childList:true,subtree:true});
      requestAnimationFrame(()=>close.focus({preventScroll:true}));
    };

    grid.addEventListener('click',()=>setTimeout(focusClose,0),true);

    modal.addEventListener('close',()=>{
      if(origin&&origin.isConnected&&origin.getClientRects().length){
        requestAnimationFrame(()=>origin.focus({preventScroll:true}));
      }
      origin=null;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();


// --- Fusion de image-lazy.js ---
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


// --- Fusion de ergonomie.js ---
/* HS Coaching — Responsive O2 + création admin + éditeur programmes */
(function(){
const s=document.createElement('style');s.textContent=`html,body{max-width:100%;overflow-x:hidden}img,video,canvas{max-width:100%}button,input,textarea,select{max-width:100%;box-sizing:border-box}.container{width:100%;max-width:1100px}.topbar,.brand,.nav,.topnav{min-width:0}.nav,.topnav{flex-wrap:wrap}.section-head{min-width:0}.card-media .media-frame,.modal-media .media-frame{max-width:100%}.card-media .media-frame img,.modal-media .media-frame img,.card-media .media-frame video,.modal-media .media-frame video{max-width:100%;max-height:100%}.admin .panel,.admin .editor,.admin .item,.admin .item-row,.admin .item-main{min-width:0;max-width:100%}.admin .item-main strong{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-overflow:ellipsis}.admin .item-actions .btn{min-width:0;white-space:normal;line-height:1.2}.admin .actions,.admin .tabs,.admin .filter{min-width:0}.hs-training-fields{grid-column:3/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:2px}.hs-training-fields input{width:100%;background:#0b0b0b;border:1px solid #303030;color:#fff;border-radius:8px;padding:9px}@media(min-width:1101px){.container{padding-left:22px;padding-right:22px}}@media(max-width:900px){.container{padding-left:18px;padding-right:18px}.hero{max-width:100%}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.admin .stats{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:800px){.hs-training-fields{grid-column:3/-1;grid-template-columns:1fr}}@media(max-width:650px){.topbar{height:auto;min-height:64px;padding:8px 0}.brand{padding-left:12px;gap:8px;flex:1;min-width:0}.brand>div{min-width:0}.brand strong,.brand small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav{margin:0 8px 0 6px!important;gap:3px!important;flex:0 0 auto}.nav a{padding:8px 8px!important;font-size:10px!important}.container{padding-left:12px;padding-right:12px}.hero{padding:32px 0 24px}.hero h1{font-size:clamp(38px,12vw,48px);letter-spacing:-2px}.search{width:100%;max-width:100%;position:static;box-shadow:none}.search input{min-width:0;width:100%}.categories{width:100%;max-width:100%;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.card{min-width:0}.card-media .media-frame{height:auto;aspect-ratio:1 / 1;min-height:120px}.card h3{overflow-wrap:anywhere}.hs-card-equipment{white-space:normal;overflow-wrap:anywhere}dialog{width:calc(100% - 12px);max-width:680px;padding:20px 14px}.modal h2{font-size:26px;line-height:1.08;overflow-wrap:anywhere}.modal-media{padding:7px}.modal-media .media-frame{height:auto;aspect-ratio:1 / 1;min-height:210px}.admin{padding:18px 0 60px}.admin .panel{padding:14px;border-radius:14px;margin:12px 0}.admin .stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.admin .stat{padding:10px 7px;min-width:0}.admin .tabs,.admin .filter,.admin .actions{gap:6px}.admin .tab,.admin .filter button,.admin .btn{padding:10px 11px;font-size:12px}.admin .item{gap:9px;padding:10px}.admin .item-row{gap:9px}.admin .item-visual{width:58px;height:52px;flex-basis:58px}.admin .item-actions{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.admin .item-actions .btn{width:100%;min-height:42px;padding:9px 6px}.admin .grid2{grid-template-columns:minmax(0,1fr)}.admin .field{min-width:0}.admin .field input,.admin .field textarea,.admin .field select{min-height:44px;font-size:16px}.admin .editor{padding:13px}.admin .preview img,.admin .preview video{height:auto;aspect-ratio:16 / 9;object-fit:contain}.admin .topnav{margin-left:6px;gap:3px;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap}.admin .topnav a{padding:7px 7px;font-size:10px;flex:0 0 auto}}@media(max-width:390px){.brand-mark{width:32px;height:32px}.brand strong{font-size:11px}.brand small{font-size:9px}.nav a{padding:7px 6px!important;font-size:9px!important}.container{padding-left:10px;padding-right:10px}.grid{gap:7px}.admin .stats{gap:5px}.admin .stat{padding:9px 5px}.admin .tab,.admin .filter button,.admin .btn{font-size:11px;padding:9px 8px}.admin .item-actions{grid-template-columns:1fr}}`;document.head.appendChild(s);
if(document.querySelector('.admin')){const originalSave=window.saveEdit;window.saveEdit=async function(id){const name=document.getElementById('en')?.value.trim()||document.getElementById('frName')?.value.trim()||'';const payload={name,equipment:document.getElementById('ee')?.value.trim()||null,description:document.getElementById('ed')?.value.trim()||null,muscles:(document.getElementById('em')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),instructions:(document.getElementById('ei')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),tips:(document.getElementById('et')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),name_fr:document.getElementById('frName')?.value.trim()||name,description_fr:document.getElementById('frDescription')?.value.trim()||null,instructions_fr:(document.getElementById('frInstructions')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),tips_fr:(document.getElementById('frTips')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean)};const status=document.getElementById('dashStatus');if(!payload.name_fr){if(status)status.textContent='Le nom français est obligatoire.';return}if(id==null){const slugBase=payload.name_fr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'exercice';const slug=slugBase+'-'+Date.now().toString(36);const r=await sb.from('exercises').insert({...payload,slug,is_published:false}).select().single();if(r.error){if(status)status.textContent=r.error.message;return}if(status)status.textContent='Exercice créé ✓ Il est enregistré en brouillon.';window.closeEditor();await window.__hsAdminReload?.();return}if(typeof originalSave==='function')return originalSave(id)};if(typeof window.load==='function')window.__hsAdminReload=window.load}
function enhanceProgramEditor(doc){if(!doc)return;const win=doc.defaultView;if(!win)return;const escv=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');const addFields=(row,x={})=>{if(!row||row.querySelector('.hs-training-fields'))return;const w=doc.createElement('div');w.className='hs-training-fields';w.innerHTML='<input class="tempo" placeholder="Tempo" value="'+escv(x.tempo)+'"><input class="load" placeholder="Charge" value="'+escv(x.load)+'"><input class="duration" placeholder="Durée" value="'+escv(x.duration)+'">';row.appendChild(w)};if(typeof win.dataRow==='function'&&!win.dataRow.__hsWrapped){const dr=win.dataRow;const w=function(row){const d=dr.apply(this,arguments);d.tempo=row.querySelector('.tempo')?.value?.trim()||'';d.load=row.querySelector('.load')?.value?.trim()||'';d.duration=row.querySelector('.duration')?.value?.trim()||'';return d};w.__hsWrapped=true;win.dataRow=w}if(typeof win.addRow==='function'&&!win.addRow.__hsWrapped){const ar=win.addRow;const w=function(b,x){const out=ar.apply(this,arguments);const row=b?.querySelector('.rows')?.lastElementChild;if(row)addFields(row,x||{});return out};w.__hsWrapped=true;win.addRow=w}doc.querySelectorAll('.exercise-line').forEach(r=>addFields(r,{}));if(!doc.__hsTrainingObserver){const sessions=doc.getElementById('sessions');if(sessions){const obs=new MutationObserver(()=>doc.querySelectorAll('.exercise-line').forEach(r=>addFields(r,{})));obs.observe(sessions,{childList:true,subtree:true});doc.__hsTrainingObserver=true}}}
function watchFrame(f){if(!f||f.__hsWatch)return;f.__hsWatch=true;const run=()=>{try{enhanceProgramEditor(f.contentDocument)}catch(e){}};f.addEventListener('load',run);[300,800,1500,2500,4000].forEach(ms=>setTimeout(run,ms));const poll=setInterval(()=>{try{enhanceProgramEditor(f.contentDocument)}catch(e){}},500);setTimeout(()=>clearInterval(poll),10000)}function init(){document.querySelectorAll('.program-creator-frame').forEach(watchFrame)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
document.addEventListener('click',function(e){const card=e.target.closest('.programme-card');if(!card||e.target.closest('[data-fav-program]')||e.target.closest('.programme-open'))return;const button=card.querySelector('[data-program-index]');if(button)button.click()});})();

