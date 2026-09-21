let exercises=[];
let category='all';
const DATA_URL='https://exercise-dataset.com/exercises.json';
const MEDIA_BASE='https://exercise-dataset.com/';
const grid=document.querySelector('#exercise-grid');
const search=document.querySelector('#search');
const count=document.querySelector('#count');
const empty=document.querySelector('#empty');
const modal=document.querySelector('#exercise-modal');
const modalContent=document.querySelector('#modal-content');
const categoriesEl=document.querySelector('.categories');
const categoryNames={all:'Tous',jambes:'Jambes',dos:'Dos',pectoraux:'Pectoraux',epaules:'Épaules',bras:'Bras',abdos:'Abdos',full:'Full body',cardio:'Cardio',mobilite:'Mobilité'};
const bodyMap={upper_legs:'jambes',lower_legs:'jambes',back:'dos',chest:'pectoraux',shoulders:'epaules',upper_arms:'bras',lower_arms:'bras',core:'abdos',full_body:'full',cardio:'cardio',neck:'mobilite'};
const muscleNames={quadriceps:'Quadriceps',hamstrings:'Ischio-jambiers',gluteus_maximus:'Grand fessier',glutes:'Fessiers',calves:'Mollets',adductors:'Adducteurs',abductors:'Abducteurs',latissimus_dorsi:'Grand dorsal',trapezius:'Trapèzes',rhomboids:'Rhomboïdes',erector_spinae:'Érecteurs du rachis',lower_back:'Lombaires',pectoralis_major:'Grand pectoral',pectoralis_minor:'Petit pectoral',deltoids:'Deltoïdes',anterior_deltoid:'Deltoïde antérieur',lateral_deltoid:'Deltoïde moyen',rear_deltoid:'Deltoïde postérieur',biceps:'Biceps',brachialis:'Brachial',triceps:'Triceps',forearms:'Avant-bras',rectus_abdominis:'Grand droit',obliques:'Obliques',transverse_abdominis:'Transverse',core:'Ceinture abdominale',hip_flexors:'Fléchisseurs de hanche',serratus_anterior:'Dentelé antérieur',rotator_cuff:'Coiffe des rotateurs',tibialis_anterior:'Tibial antérieur',neck:'Cou'};
const muscleFilters={
  jambes:[['all','Tous'],['quadriceps','Quadriceps'],['hamstrings','Ischio-jambiers'],['glutes','Fessiers'],['calves','Mollets'],['adductors','Adducteurs'],['abductors','Abducteurs']],
  dos:[['all','Tous'],['latissimus_dorsi','Grand dorsal'],['trapezius','Trapèzes'],['rhomboids','Rhomboïdes']],
  pectoraux:[['all','Tous'],['chest_upper','Haut'],['chest_middle','Milieu'],['chest_lower','Bas']],
  epaules:[['all','Tous'],['anterior_deltoid','Épaule avant'],['lateral_deltoid','Épaule latérale'],['rear_deltoid','Épaule arrière']],
  bras:[['all','Tous'],['biceps','Biceps'],['triceps','Triceps'],['forearms','Avant-bras']],
  abdos:[['all','Tous'],['rectus_abdominis','Abdominaux'],['obliques','Obliques']]
};
let muscleFilter='all';
function labelMuscle(m){return muscleNames[m]||String(m).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function categoryFor(e){return bodyMap[e.body_part]||'mobilite'}
function categoryLabel(e){return categoryNames[categoryFor(e)]||'Autre'}
function chestZone(e){
  const s=String(e.name_en||e.name||'').toLowerCase();
  if(/incline|inclined|low[- ]to[- ]high|low cable.*fly|incline.*fly|incline.*press/.test(s))return 'chest_upper';
  if(/decline|declined|high[- ]to[- ]low|high cable.*fly|decline.*fly|decline.*press|dip[s]?\b/.test(s))return 'chest_lower';
  return 'chest_middle';
}
function imageUrl(path){return path?new URL(path,MEDIA_BASE).href:''}
function slugify(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
const FR_WORDS=[[/\bbarbell\b/gi,'barre'],[/\bdumbbell\b/gi,'haltère'],[/\bkettlebell\b/gi,'kettlebell'],[/\bcable\b/gi,'poulie'],[/\bmachine\b/gi,'machine'],[/\bbodyweight\b/gi,'poids du corps'],[/\bweighted\b/gi,'lesté'],[/\bassisted\b/gi,'assisté'],[/\bband\b/gi,'élastique'],[/\bplate\b/gi,'disque'],[/\bbench\b/gi,'banc'],[/\bsquat\b/gi,'squat'],[/\bdeadlift\b/gi,'soulevé de terre'],[/\bpress\b/gi,'développé'],[/\brow\b/gi,'rowing'],[/\bcurl\b/gi,'curl'],[/\bextension\b/gi,'extension'],[/\braise\b/gi,'élévation'],[/\bpulldown\b/gi,'tirage vertical'],[/\bpull[- ]?up[s]?\b/gi,'traction'],[/\bpush[- ]?up[s]?\b/gi,'pompe'],[/\bdip[s]?\b/gi,'dip'],[/\blunge[s]?\b/gi,'fente'],[/\bfly\b/gi,'écarté'],[/\bcrunch\b/gi,'crunch'],[/\bplank\b/gi,'gainage'],[/\bcalf raise\b/gi,'élévation des mollets'],[/\bleg\b/gi,'jambe'],[/\bshoulder[s]?\b/gi,'épaule'],[/\bchest\b/gi,'pectoraux'],[/\bback\b/gi,'dos'],[/\bupper\b/gi,'supérieur'],[/\blower\b/gi,'inférieur'],[/\bclose grip\b/gi,'prise serrée'],[/\bwide grip\b/gi,'prise large'],[/\breverse grip\b/gi,'prise supination'],[/\bneutral grip\b/gi,'prise neutre'],[/\boverhead\b/gi,'au-dessus de la tête'],[/\bseated\b/gi,'assis'],[/\bstanding\b/gi,'debout'],[/\bsingle arm\b/gi,'unilatéral'],[/\bone arm\b/gi,'à un bras'],[/\bone leg\b/gi,'à une jambe'],[/\blying\b/gi,'allongé'],[/\bfront\b/gi,'avant'],[/\blateral\b/gi,'latéral'],[/\brear\b/gi,'arrière'],[/\bfront raise\b/gi,'élévation frontale'],[/\blateral raise\b/gi,'élévation latérale'],[/\bromanian\b/gi,'roumain'],[/\bbulgarian\b/gi,'bulgare'],[/\bhack\b/gi,'hack'],[/\bhip thrust\b/gi,'hip thrust'],[/\bglute bridge\b/gi,'pont fessier'],[/\bshrug[s]?\b/gi,'haussement d’épaules'],[/\bface pull\b/gi,'tirage visage'],[/\bpushdown\b/gi,'extension à la poulie'],[/\btriceps\b/gi,'triceps'],[/\bbiceps\b/gi,'biceps'],[/\bforearm[s]?\b/gi,'avant-bras'],[/\babs?\b/gi,'abdominaux'],[/\bcore\b/gi,'gainage'],[/\bcardio\b/gi,'cardio'],[/\bcalf\b/gi,'mollet'],[/\bhamstring[s]?\b/gi,'ischio-jambiers'],[/\bquad[s]?\b/gi,'quadriceps'],[/\bglute[s]?\b/gi,'fessiers'],[/\badductor[s]?\b/gi,'adducteurs'],[/\babductor[s]?\b/gi,'abducteurs']];
const FR_PHRASES=[[/\bStart by\b/gi,'Commence par'],[/\bBegin by\b/gi,'Commence par'],[/\bPlace yourself\b/gi,'Place-toi'],[/\bStand with\b/gi,'Tiens-toi debout avec'],[/\bSit with\b/gi,'Assieds-toi avec'],[/\bLie on\b/gi,'Allonge-toi sur'],[/\bHold the\b/gi,'Tiens le'],[/\bHold a\b/gi,'Tiens un'],[/\bHold an\b/gi,'Tiens un'],[/\bGrab the\b/gi,'Saisis le'],[/\bGrip the\b/gi,'Saisis le'],[/\bKeep your\b/gi,'Garde tes'],[/\bKeep the\b/gi,'Garde le'],[/\bKeep your back straight\b/gi,'Garde le dos droit'],[/\bKeep your back\b/gi,'Garde le dos'],[/\bKeep your core\b/gi,'Gaine le tronc'],[/\bKeep your elbows\b/gi,'Garde les coudes'],[/\bKeep your knees\b/gi,'Garde les genoux'],[/\bKeep your feet\b/gi,'Garde les pieds'],[/\bLower the\b/gi,'Descends le'],[/\bLower your\b/gi,'Descends tes'],[/\bRaise the\b/gi,'Élève le'],[/\bRaise your\b/gi,'Élève tes'],[/\bLift the\b/gi,'Soulève le'],[/\bLift your\b/gi,'Soulève tes'],[/\bPull the\b/gi,'Tire le'],[/\bPull your\b/gi,'Tire tes'],[/\bPush the\b/gi,'Pousse le'],[/\bPush your\b/gi,'Pousse avec'],[/\bPress the\b/gi,'Pousse le'],[/\bBend your\b/gi,'Fléchis tes'],[/\bBend the\b/gi,'Fléchis le'],[/\bExtend your\b/gi,'Tends tes'],[/\bExtend the\b/gi,'Tends le'],[/\bReturn to\b/gi,'Reviens à'],[/\bSlowly\b/gi,'Lentement'],[/\bSlowly lower\b/gi,'Descends lentement'],[/\bSlowly raise\b/gi,'Monte lentement'],[/\bControl the\b/gi,'Contrôle le'],[/\bControlled\b/gi,'Contrôlé'],[/\bwhile keeping\b/gi,'tout en gardant'],[/\bwhile maintaining\b/gi,'tout en maintenant'],[/\bthroughout the movement\b/gi,'pendant tout le mouvement'],[/\bRepeat\b/gi,'Répète'],[/\bBreathe in\b/gi,'Inspire'],[/\bBreathe out\b/gi,'Expire'],[/\bExhale\b/gi,'Expire'],[/\bInhale\b/gi,'Inspire'],[/\bDo not\b/gi,'Ne'],[/\bAvoid\b/gi,'Évite'],[/\bMake sure\b/gi,'Veille à'],[/\buntil\b/gi,'jusqu’à'],[/\bthen\b/gi,'puis'],[/\bfrom\b/gi,'depuis'],[/\bwith a\b/gi,'avec une'],[/\bwith an\b/gi,'avec un'],[/\bwith the\b/gi,'avec le'],[/\bto the\b/gi,'vers le'],[/\btoward the\b/gi,'vers le'],[/\bslightly\b/gi,'légèrement'],[/\bapproximately\b/gi,'environ'],[/\bshoulder width\b/gi,'largeur d’épaules'],[/\bfull range of motion\b/gi,'amplitude complète'],[/\brange of motion\b/gi,'amplitude de mouvement'],[/\bstarting position\b/gi,'position de départ'],[/\bchest\b/gi,'poitrine'],[/\bshoulders\b/gi,'épaules'],[/\belbows\b/gi,'coudes'],[/\bknees\b/gi,'genoux'],[/\bhips\b/gi,'hanches'],[/\bwrists\b/gi,'poignets'],[/\barms\b/gi,'bras'],[/\blegs\b/gi,'jambes'],[/\bfeet\b/gi,'pieds'],[/\bhead\b/gi,'tête'],[/\bneck\b/gi,'cou'],[/\bback\b/gi,'dos'],[/\bbody\b/gi,'corps'],[/\bfloor\b/gi,'sol'],[/\bground\b/gi,'sol'],[/\bweight\b/gi,'charge'],[/\bresistance\b/gi,'résistance'],[/\brepetitions\b/gi,'répétitions'],[/\brep\b/gi,'répétition'],[/\bset\b/gi,'série'],[/\bseconds\b/gi,'secondes']];
function autoFrText(text){let s=String(text||'');FR_PHRASES.forEach(([r,v])=>s=s.replace(r,v));return s.replace(/\bthe\b/gi,'le').replace(/\band\b/gi,'et').replace(/\bor\b/gi,'ou').replace(/\binto\b/gi,'vers').replace(/\bforward\b/gi,'vers l’avant').replace(/\bbackward\b/gi,'vers l’arrière').replace(/\bup\b/gi,'vers le haut').replace(/\bdown\b/gi,'vers le bas').replace(/\bstraight\b/gi,'droit').replace(/\bstraighten\b/gi,'tends').replace(/\bfully\b/gi,'complètement').replace(/\bslow\b/gi,'lent').replace(/\bfast\b/gi,'rapide').replace(/\bhold\b/gi,'maintien').replace(/\bcomfortable\b/gi,'confortable').replace(/\bneutral\b/gi,'neutre')}
function autoFrName(name){let s=String(name||'');FR_WORDS.forEach(([r,v])=>s=s.replace(r,v));return s.charAt(0).toUpperCase()+s.slice(1)}
function frOverride(e){const key=String(e.name_en||e.name||'').toLowerCase();return typeof HS_FR!=='undefined'&&HS_FR[key]?HS_FR[key]:null}
function translatedExercise(e){const fr=frOverride(e);return {name:fr?.name||autoFrName(e.name_fr||e.name_en),description:fr?.description||autoFrText(e.description_fr||e.description_en||'Exercice de renforcement musculaire.'),instructions:fr?.instructions||(e.instructions_fr||e.instructions_en||[]).map(autoFrText),tips:fr?.tips||(e.tips_fr||e.tips_en||[]).map(autoFrText)}}
function mediaHtml(e,modalView=false){const imgs=e.images||{};const flat=imgs.flat||{};const a=imageUrl(flat.start||flat.main);const b=imageUrl(flat.peak);if(!a)return '';if(b)return `<div class="media-frame media-pair ${modalView?'modal-media':''}"><img class="media-a" src="${a}" alt="Position de départ — ${e.name}" loading="lazy"><img class="media-b" src="${b}" alt="Position finale — ${e.name}" loading="lazy"></div>`;return `<div class="media-frame ${modalView?'modal-media':''}"><img src="${a}" alt="Illustration — ${e.name}" loading="lazy"></div>`}
function cleanCategoryButtons(){if(!categoriesEl)return;const seen=new Set();categoriesEl.querySelectorAll('button').forEach(b=>{const label=b.textContent.trim();if(label==='Fessiers'&&b.classList.contains('chip')&&!b.classList.contains('subchip')){b.remove();return}if(b.classList.contains('subchip')){const key=label.toLowerCase();if(seen.has(key))b.remove();else seen.add(key)}})}
function renderCategories(){
  const wanted=['all','jambes','dos','pectoraux','epaules','bras','abdos','full','cardio','mobilite'];
  const main=wanted.map(c=>`<button class="chip ${category===c?'active':''}" data-category="${c}">${categoryNames[c]}</button>`).join('');
  const subs=muscleFilters[category]||[];
  const subHtml=subs.length?`<div class="subcategories" aria-label="Filtrer par muscle">${subs.filter((v,i,a)=>a.findIndex(x=>x[1]===v[1])===i).map(([key,label])=>`<button class="chip subchip ${muscleFilter===key?'active':''}" data-muscle="${key}">${label}</button>`).join('')}</div>`:'';
  categoriesEl.innerHTML=`<div class="main-categories">${main}</div>${subHtml}`;
  categoriesEl.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;muscleFilter='all';visibleLimit=PAGE_SIZE;renderCategories();render()});
  categoriesEl.querySelectorAll('[data-muscle]').forEach(b=>b.onclick=()=>{muscleFilter=b.dataset.muscle;visibleLimit=PAGE_SIZE;renderCategories();render()});
  cleanCategoryButtons();
}
const PAGE_SIZE=48;
let visibleLimit=PAGE_SIZE;
let filteredExercises=[];
const CACHE_KEY='hs_library_cache_v2';
const CACHE_TTL=24*60*60*1000;

function getCachedLibrary(){
  try{
    const raw=localStorage.getItem(CACHE_KEY);
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(!data||!Array.isArray(data.exercises))return null;
    return data;
  }catch{return null}
}
function setCachedLibrary(exercises){
  try{localStorage.setItem(CACHE_KEY,JSON.stringify({savedAt:Date.now(),exercises}))}catch{}
}
function filteredList(){
  const q=search.value.trim().toLowerCase();
  return exercises.filter(e=>{
    const hay=[e.name,e.name_en,e.description,...(e.muscles||[]),e.equipmentLabel,e.bodyPartLabel,...(e.tags||[])].join(' ').toLowerCase();
    const muscles=e.muscles||[]; const muscleOk=muscleFilter==='all'||(category==='pectoraux'&&['chest_upper','chest_middle','chest_lower'].includes(muscleFilter)?chestZone(e)===muscleFilter:muscles.includes(muscleFilter)); return (category==='all'||categoryFor(e)===category)&&muscleOk&&(!q||hay.includes(q));
  });
}
function ensureLoadMore(){
  let b=document.getElementById('load-more-exercises');
  if(!b){
    b=document.createElement('button');
    b.id='load-more-exercises';
    b.type='button';
    b.style.cssText='display:none;width:100%;margin:18px 0 30px;padding:13px 16px;border:1px solid #333;border-radius:12px;background:#151515;color:#fff;font-size:11px;font-weight:900;cursor:pointer';
    grid.parentElement.appendChild(b);
    b.addEventListener('click',()=>{visibleLimit+=PAGE_SIZE;render()});
  }
  return b;
}
function render(){
  filteredExercises=filteredList();
  const list=filteredExercises.slice(0,visibleLimit);
  grid.innerHTML=list.map(e=>`<article class="card card-media" data-id="${e.id}">${mediaHtml(e)}<span class="tag">${categoryLabel(e)}</span><h3>${e.name}</h3><p>${(e.muscles||[]).slice(0,3).map(labelMuscle).join(' · ')}</p></article>`).join('');
  count.textContent=`${filteredExercises.length} exercice${filteredExercises.length>1?'s':''}`;
  empty.hidden=filteredExercises.length>0;
  grid.querySelectorAll('.card').forEach(c=>c.onclick=()=>openExercise(c.dataset.id));
  const b=ensureLoadMore();
  const remaining=Math.max(0,filteredExercises.length-list.length);
  b.style.display=remaining?'block':'none';
  b.textContent=remaining?`Afficher ${Math.min(PAGE_SIZE,remaining)} autres exercices`:'';
}
function normalizeExercises(list){
  return (list||[]).map(e=>{
    const cat=categoryFor(e);
    const tr=translatedExercise(e);
    return {...e,id:e.id||slugify(e.name_en||e.name),name:tr.name,description:tr.description,instructions:tr.instructions,tips:tr.tips,muscles:[...(e.primary_muscles||[]),...(e.secondary_muscles||[])].flatMap(m=>{const x=String(m);const map={biceps_brachii:'biceps',triceps_brachii:'triceps',posterior_deltoid:'rear_deltoid',forearm_flexors:'forearms',forearm_extensors:'forearms',brachioradialis:'forearms',brachialis:'biceps',gastrocnemius:'calves',soleus:'calves',gluteus_maximus:'glutes'};return [x,map[x]].filter(Boolean)}),equipmentLabel:String(e.equipment||'Poids du corps').replace(/_/g,' '),bodyPartLabel:cat};
  });
}
async function loadLibrary(){
  grid.innerHTML='<p class="empty">Chargement de la bibliothèque…</p>';
  try{
    const cached=getCachedLibrary();
    if(cached&&cached.exercises.length){
      exercises=normalizeExercises(cached.exercises);
      renderCategories();render();openFromUrl();
      if(Date.now()-(cached.savedAt||0)>CACHE_TTL)refreshLibrary();
      return;
    }
    await refreshLibrary(true);
  }catch(err){
    console.error(err);
    const cached=getCachedLibrary();
    if(cached&&cached.exercises.length){
      exercises=normalizeExercises(cached.exercises);
      renderCategories();render();openFromUrl();
    }else{
      grid.innerHTML='<p class="empty">Impossible de charger la bibliothèque. Recharge la page.</p>';
      count.textContent='';
    }
  }
}
async function refreshLibrary(initial=false){
  try{
    const res=await fetch(DATA_URL,{cache:'force-cache'});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    const raw=Array.isArray(data.exercises)?data.exercises:[];
    if(!raw.length)throw new Error('Bibliothèque vide');
    setCachedLibrary(raw);
    exercises=normalizeExercises(raw);
    visibleLimit=PAGE_SIZE;
    renderCategories();render();
    if(initial)openFromUrl();
  }catch(err){
    if(initial)throw err;
    console.warn('HS Coaching: actualisation différée impossible',err);
  }
}
let searchTimer;search.oninput=()=>{clearTimeout(searchTimer);visibleLimit=PAGE_SIZE;searchTimer=setTimeout(render,120)};document.querySelector('#close-modal').onclick=()=>{modal.close();history.pushState({},'',window.location.pathname)};modal.addEventListener('click',e=>{if(e.target===modal){modal.close();history.pushState({},'',window.location.pathname)}});window.addEventListener('popstate',()=>{if(!new URLSearchParams(window.location.search).get('exercice')&&modal.open)modal.close()});const categoryObserver=new MutationObserver(()=>cleanCategoryButtons());if(categoriesEl)categoryObserver.observe(categoriesEl,{childList:true,subtree:true});loadLibrary();
