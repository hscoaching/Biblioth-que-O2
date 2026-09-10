(function(){
  const modal=document.querySelector('#exercise-modal'), content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const muscles={quadriceps:'Quadriceps',hamstrings:'Ischio-jambiers',gluteus_maximus:'Grand fessier',glutes:'Fessiers',calves:'Mollets',adductors:'Adducteurs',abductors:'Abducteurs',latissimus_dorsi:'Grand dorsal',trapezius:'Trapèzes',rhomboids:'Rhomboïdes',erector_spinae:'Érecteurs du rachis',lower_back:'Lombaires',pectoralis_major:'Grand pectoral',pectoralis_minor:'Petit pectoral',deltoids:'Deltoïdes',anterior_deltoid:'Deltoïde antérieur',lateral_deltoid:'Deltoïde moyen',rear_deltoid:'Deltoïde postérieur',biceps:'Biceps',brachialis:'Brachial',triceps:'Triceps',forearms:'Avant-bras',rectus_abdominis:'Grand droit',obliques:'Obliques',transverse_abdominis:'Transverse',core:'Ceinture abdominale',hip_flexors:'Fléchisseurs de hanche',serratus_anterior:'Dentelé antérieur',rotator_cuff:'Coiffe des rotateurs',tibialis_anterior:'Tibial antérieur'};
  const equipment={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine'};
  const advice={
    'barbell-bench-press':'Installe tes omoplates en arrière et vers le bas, garde les pieds fermement au sol et contrôle la descente. La barre doit toucher le bas des pectoraux sans rebondir.',
    'barbell-deadlift':'Avant de décoller la barre, verrouille ta sangle abdominale et garde-la proche des tibias. Pousse le sol avec les jambes puis termine en contractant les fessiers, sans hyperétendre le dos.',
    'barbell-full-squat':'Prends une grande inspiration et verrouille le gainage avant chaque répétition. Descends sous contrôle en gardant les genoux dans l’axe des pieds, puis remonte en poussant le sol.',
    'bodyweight-squat':'Garde le pied bien ancré au sol et laisse les genoux suivre la direction des orteils. Descends aussi bas que tu peux sans perdre le contrôle du bassin ou des pieds.',
    'leg-press':'Garde le bassin et le haut du dos plaqués au dossier. Descends jusqu’à une amplitude que tu contrôles sans que le bassin ne s’enroule, puis pousse à travers toute la plante du pied.',
    'leg-extension':'Garde le bassin stable contre le dossier et évite de donner un coup avec le poids. Marque une courte contraction en haut puis redescends lentement.',
    'leg-curl':'Garde les hanches stables et évite de décoller le bassin du support. Ramène les talons vers les fessiers sans à-coup et contrôle complètement le retour.',
    'barbell-hip-thrust':'Rentre légèrement le bassin en fin de mouvement et serre les fessiers en haut. Cherche l’extension de hanche, pas une hyperextension lombaire.',
    'romanian-deadlift':'Recule les hanches en gardant la barre proche des jambes et le dos neutre. Descends jusqu’à sentir une forte tension des ischio-jambiers sans chercher une amplitude artificielle.',
    'barbell-romanian-deadlift':'Recule les hanches en gardant la barre proche des jambes et le dos neutre. Descends jusqu’à sentir une forte tension des ischio-jambiers sans chercher une amplitude artificielle.',
    'pull-up':'Commence par abaisser les omoplates puis tire les coudes vers le bas. Évite l’élan et contrôle la descente pour conserver la tension dans le dos.',
    'assisted-pull-ups':'Commence par abaisser les omoplates puis tire les coudes vers les hanches. Utilise juste assez d’assistance pour garder des répétitions strictes, sans te balancer.',
    'lat-pulldown':'Garde la poitrine ouverte et tire les coudes vers les hanches. Ne transforme pas le mouvement en tirage avec le buste et contrôle la remontée.',
    'seated-cable-row':'Garde le buste stable et tire les coudes vers l’arrière sans hausser les épaules. Laisse les omoplates s’étirer en avant puis ramène-les sous contrôle.',
    'barbell-bent-over-row':'Fixe ton gainage et garde le dos neutre pendant toute la série. Tire la barre vers le bas du ventre en conduisant le mouvement avec les coudes.',
    'barbell-row':'Fixe ton gainage et garde le dos neutre pendant toute la série. Tire la barre vers le bas du ventre en conduisant le mouvement avec les coudes.',
    'dumbbell-row':'Prends appui solidement et garde le bassin stable. Tire le coude vers la hanche plutôt que vers l’épaule afin de mieux charger le grand dorsal.',
    'face-pull':'Tire la corde vers le visage en gardant les coudes ouverts et les épaules basses. Termine avec les mains de part et d’autre du visage sans compenser avec le bas du dos.',
    'dumbbell-lateral-raise':'Garde une légère flexion des coudes et monte les bras dans le plan naturel des épaules. Évite l’élan : si tu dois balancer le buste, la charge est trop lourde.',
    'dumbbell-front-raise':'Garde les côtes et le bassin contrôlés et lève les haltères sans élan. Arrête la montée lorsque les bras arrivent environ à hauteur des épaules.',
    'arnold-press':'Fais tourner progressivement les poignets pendant la montée et garde le tronc gainé. Évite de cambrer pour terminer la répétition.',
    'dumbbell-biceps-curl':'Garde les coudes proches du corps et immobiles. Monte sans balancer les épaules puis contrôle la descente pour conserver la tension sur le biceps.',
    'hammer-curl':'Garde les paumes face à face et les coudes stables. Évite de lancer le mouvement avec les épaules et contrôle particulièrement la phase descendante.',
    'triceps-pushdown':'Garde les coudes près du corps et les épaules basses. Termine l’extension sans déplacer les coudes, puis remonte lentement sans perdre le contrôle.',
    'overhead-triceps-extension':'Garde les coudes orientés vers l’avant et proches l’un de l’autre. Descends derrière la tête sous contrôle puis tends les bras sans cambrer.',
    'dips':'Garde les épaules contrôlées et descends uniquement dans l’amplitude que tu maîtrises. Remonte en poussant fort dans les poignées sans laisser les épaules partir vers l’avant.',
    'push-ups':'Garde le corps gainé comme une planche et laisse les coudes suivre un angle naturel par rapport au buste. Descends en bloc puis repousse le sol sans laisser les hanches s’affaisser.',
    'ab-wheel-rollout':'Verrouille le bassin avant de rouler vers l’avant. Arrête l’amplitude dès que le bas du dos commence à se creuser, puis ramène la roue en gardant les abdos contractés.',
    'plank':'Serre les fessiers et les abdos pour garder les côtes et le bassin alignés. Ne cherche pas à tenir plus longtemps si la position se dégrade.',
    'crunch':'Enroule progressivement le haut du dos en rapprochant les côtes du bassin. Évite de tirer sur la nuque et ne cherche pas à monter le buste le plus haut possible.',
    'calf-raise':'Descends jusqu’à un véritable étirement du mollet puis monte le plus haut possible sans rebondir. Marque une courte pause en position haute.',
    'bulgarian-split-squat':'Trouve une position stable avant de charger. Descends verticalement en laissant le genou avant suivre les orteils, puis pousse dans tout le pied pour remonter.',
    'walking-lunges':'Fais un pas suffisamment long pour rester stable et laisse le genou suivre l’axe du pied. Contrôle chaque descente avant de pousser dans le sol pour repartir.',
    'back-extension':'Initie le mouvement par les hanches et garde la colonne neutre. Remonte jusqu’à l’alignement du corps sans chercher à dépasser cette position.',
    'kettlebell-swing':'Projette les hanches vers l’avant plutôt que de lever la kettlebell avec les bras. Garde le dos neutre et laisse le mouvement venir de l’extension explosive des hanches.'
  };
  const label=m=>muscles[m]||String(m||'').replace(/_/g,' '), eq=e=>equipment[e]||String(e||'').replace(/_/g,' ');
  function styles(){if(document.querySelector('#hs-modal-style'))return;const s=document.createElement('style');s.id='hs-modal-style';s.textContent='.hs-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:0 0 20px}.hs-meta-item{background:#101010;border:1px solid #292929;border-radius:12px;padding:11px}.hs-meta-label{display:block;color:#666;font-size:9px;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px}.hs-meta-value{display:block;color:#eee;font-size:12px;font-weight:700}.hs-primary{margin:18px 0}.hs-primary-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:9px}.hs-primary-tags{display:flex;gap:7px;flex-wrap:wrap}.hs-primary-tag{background:#fff;color:#000;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:700}.hs-secondary{color:#777;font-size:11px;margin-top:8px}.hs-coach{margin-top:22px;padding:18px;background:#101010;border:1px solid #292929;border-radius:14px}.hs-coach h3{margin:0 0 9px!important;font-size:14px}.hs-coach p{margin:0;color:#aaa;font-size:13px;line-height:1.6}.hs-coach strong{color:#fff}@media(max-width:600px){.hs-meta{grid-template-columns:1fr 1fr}}';document.head.appendChild(s)}
  let dataPromise;
  function enhance(){
    if(content.querySelector('.hs-meta'))return;
    const id=new URLSearchParams(location.search).get('exercice');if(!id)return;
    const title=content.querySelector('h2');if(!title)return;
    dataPromise=dataPromise||fetch(DATA_URL,{cache:'no-store'}).then(r=>r.json()).then(x=>x.exercises||[]).catch(()=>[]);
    dataPromise.then(all=>{const e=all.find(x=>String(x.id)===String(id));if(!e)return;styles();
      const meta=document.createElement('div');meta.className='hs-meta';
      meta.innerHTML='<div class="hs-meta-item"><span class="hs-meta-label">Matériel</span><span class="hs-meta-value">'+eq(e.equipment||'bodyweight')+'</span></div><div class="hs-meta-item"><span class="hs-meta-label">Ciblage</span><span class="hs-meta-value">'+(e.primary_muscles||[]).slice(0,2).map(label).join(' · ')+'</span></div>';
      title.insertAdjacentElement('afterend',meta);
      const existing=content.querySelector('.modal-muscles');
      if(existing&&(e.primary_muscles||[]).length){const box=document.createElement('div');box.className='hs-primary';let html='<div class="hs-primary-title">Muscles ciblés en priorité</div><div class="hs-primary-tags">'+e.primary_muscles.map(m=>'<span class="hs-primary-tag">'+label(m)+'</span>').join('')+'</div>';if((e.secondary_muscles||[]).length)html+='<div class="hs-secondary">Secondaires : '+e.secondary_muscles.map(label).join(' · ')+'</div>';box.innerHTML=html;existing.insertAdjacentElement('afterend',box)}
      const old=content.querySelector('.modal-errors');if(old){const coach=document.createElement('div');coach.className='hs-coach';const key=String(e.id||'').toLowerCase();const text=advice[key]||'Priorité à la qualité. Contrôle chaque répétition, garde une amplitude adaptée et augmente progressivement la charge lorsque ta technique reste propre.';coach.innerHTML='<h3>💡 Conseil du coach</h3><p>'+text+'</p>';old.insertAdjacentElement('beforebegin',coach)}
    });
  }
  new MutationObserver(enhance).observe(content,{childList:true,subtree:true});enhance();
})();
