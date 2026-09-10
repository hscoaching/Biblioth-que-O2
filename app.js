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

const categoryNames={
  all:'Tous',jambes:'Jambes',dos:'Dos',pectoraux:'Pectoraux',epaules:'Épaules',bras:'Bras',abdos:'Abdos',full:'Full body',cardio:'Cardio',mobilite:'Mobilité'
};

const bodyMap={
  upper_legs:'jambes',lower_legs:'jambes',back:'dos',chest:'pectoraux',shoulders:'epaules',upper_arms:'bras',lower_arms:'bras',core:'abdos',full_body:'full',cardio:'cardio',neck:'mobilite'
};

const muscleNames={
  quadriceps:'Quadriceps',hamstrings:'Ischio-jambiers',gluteus_maximus:'Grand fessier',glutes:'Fessiers',calves:'Mollets',adductors:'Adducteurs',abductors:'Abducteurs',
  latissimus_dorsi:'Grand dorsal',trapezius:'Trapèzes',rhomboids:'Rhomboïdes',erector_spinae:'Érecteurs du rachis',lower_back:'Lombaires',
  pectoralis_major:'Grand pectoral',pectoralis_minor:'Petit pectoral',deltoids:'Deltoïdes',anterior_deltoid:'Deltoïde antérieur',lateral_deltoid:'Deltoïde moyen',rear_deltoid:'Deltoïde postérieur',
  biceps:'Biceps',brachialis:'Brachial',triceps:'Triceps',forearms:'Avant-bras',rectus_abdominis:'Grand droit',obliques:'Obliques',transverse_abdominis:'Transverse',core:'Ceinture abdominale',
  hip_flexors:'Fléchisseurs de hanche',serratus_anterior:'Dentelé antérieur',rotator_cuff:'Coiffe des rotateurs',tibialis_anterior:'Tibial antérieur',neck:'Cou'
};

function labelMuscle(m){return muscleNames[m]||String(m).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function categoryFor(e){return bodyMap[e.body_part]||'mobilite'}
function categoryLabel(e){return categoryNames[categoryFor(e)]||'Autre'}
function imageUrl(path){return path?new URL(path,MEDIA_BASE).href:''}
function slugify(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

function mediaHtml(e,modalView=false){
  const imgs=e.images||{};
  const flat=imgs.flat||{};
  const a=imageUrl(flat.start||flat.main);
  const b=imageUrl(flat.peak);
  if(!a)return '';
  if(b){
    return `<div class="media-frame media-pair ${modalView?'modal-media':''}"><img class="media-a" src="${a}" alt="Position de départ — ${e.name}" loading="lazy"><img class="media-b" src="${b}" alt="Position finale — ${e.name}" loading="lazy"></div>`;
  }
  return `<div class="media-frame ${modalView?'modal-media':''}"><img src="${a}" alt="Illustration — ${e.name}" loading="lazy"></div>`;
}

function renderCategories(){
  const wanted=['all','jambes','dos','pectoraux','epaules','bras','abdos','full','cardio','mobilite'];
  categoriesEl.innerHTML=wanted.map(c=>`<button class="chip ${category===c?'active':''}" data-category="${c}">${categoryNames[c]}</button>`).join('');
  categoriesEl.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{category=b.dataset.category;renderCategories();render()});
}

function render(){
  const q=search.value.trim().toLowerCase();
  const list=exercises.filter(e=>{
    const hay=[e.name,e.description,...(e.muscles||[]),e.equipmentLabel,e.bodyPartLabel,...(e.tags||[])].join(' ').toLowerCase();
    return (category==='all'||categoryFor(e)===category)&&(!q||hay.includes(q));
  });
  grid.innerHTML=list.map(e=>`<article class="card card-media" data-id="${e.id}">${mediaHtml(e)}<span class="tag">${categoryLabel(e)}</span><h3>${e.name}</h3><p>${(e.muscles||[]).slice(0,3).map(labelMuscle).join(' · ')}</p></article>`).join('');
  count.textContent=`${list.length} exercice${list.length>1?'s':''}`;
  empty.hidden=list.length>0;
  grid.querySelectorAll('.card').forEach(c=>c.onclick=()=>openExercise(c.dataset.id));
}

function exerciseUrl(e){
  const url=new URL(window.location.href);url.search='';url.hash='';url.searchParams.set('exercice',e.id);return url.toString();
}

function openExercise(id,updateUrl=true){
  const e=exercises.find(x=>x.id===id);if(!e)return;
  if(updateUrl)history.pushState({exercice:e.id},'',exerciseUrl(e));
  const instructions=e.instructions||[];
  const tips=e.tips||[];
  modalContent.innerHTML=`<div class="modal"><span class="modal-tag">${categoryLabel(e)}${e.equipmentLabel?' · '+e.equipmentLabel:''}</span><h2>${e.name}</h2>${mediaHtml(e,true)}<div class="modal-muscles">${(e.muscles||[]).map(m=>`<span class="modal-muscle">${labelMuscle(m)}</span>`).join('')}</div><p>${e.description||'Exercice de renforcement musculaire.'}</p>${instructions.length?`<h3>Exécution</h3><ol>${instructions.map(t=>`<li>${t}</li>`).join('')}</ol>`:''}${tips.length?`<h3>Conseils techniques</h3><ul>${tips.map(t=>`<li>${t}</li>`).join('')}</ul>`:''}<div class="modal-errors"><h3>À retenir</h3><ul><li>Contrôle l'amplitude et la vitesse du mouvement.</li><li>Garde une technique propre avant d'augmenter la charge.</li><li>Adapte l'exercice à ton niveau et à ton matériel.</li></ul></div><div class="qr-section"><h3>QR code de cet exercice</h3><p>Scanne ce QR code pour ouvrir directement cette fiche.</p><div id="qrcode" class="qr-code"></div><div class="qr-url"><input id="exercise-link" value="${exerciseUrl(e)}" readonly><button class="qr-copy" id="copy-link">Copier le lien</button></div></div></div>`;
  modal.showModal();generateQR(e);
}

function generateQR(e){
  const box=document.querySelector('#qrcode');if(!box||typeof QRCode==='undefined')return;
  box.innerHTML='';new QRCode(box,{text:exerciseUrl(e),width:220,height:220,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
  const button=document.querySelector('#copy-link');button.onclick=async()=>{try{await navigator.clipboard.writeText(exerciseUrl(e));button.textContent='Lien copié ✓';setTimeout(()=>button.textContent='Copier le lien',1800)}catch{button.textContent='Copie impossible'}};
}

function openFromUrl(){const id=new URLSearchParams(window.location.search).get('exercice');if(id)openExercise(id,false)}

async function loadLibrary(){
  grid.innerHTML='<p class="empty">Chargement de la bibliothèque…</p>';
  try{
    const res=await fetch(DATA_URL,{cache:'no-store'});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    exercises=(data.exercises||[]).map(e=>{
      const cat=categoryFor(e);
      return {
        ...e,
        id:e.id||slugify(e.name_en),
        name:e.name_fr||e.name_en,
        description:e.description_fr||e.description_en||'',
        instructions:e.instructions_fr||e.instructions_en||[],
        tips:e.tips_fr||e.tips_en||[],
        muscles:[...(e.primary_muscles||[]),...(e.secondary_muscles||[])],
        equipmentLabel:String(e.equipment||'Poids du corps').replace(/_/g,' '),
        bodyPartLabel:cat
      };
    });
    renderCategories();render();openFromUrl();
  }catch(err){
    console.error(err);
    grid.innerHTML='<p class="empty">Impossible de charger la bibliothèque. Recharge la page.</p>';
    count.textContent='';
  }
}

search.oninput=render;
document.querySelector('#close-modal').onclick=()=>{modal.close();history.pushState({},'',window.location.pathname)};
modal.addEventListener('click',e=>{if(e.target===modal){modal.close();history.pushState({},'',window.location.pathname)}});
window.addEventListener('popstate',()=>{if(!new URLSearchParams(window.location.search).get('exercice')&&modal.open)modal.close()});
loadLibrary();
