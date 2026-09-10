// Couverture française complète du catalogue RepDB — HS Coaching
// Les fiches éditoriales existantes gardent la priorité. Toutes les autres fiches reçoivent
// automatiquement un nom, une description, une exécution et des conseils en français.
(function(){
  const W=[
    ['barbell','barre'],['dumbbell','haltère'],['kettlebell','kettlebell'],['cable','poulie'],['machine','machine'],['bodyweight','poids du corps'],['weighted','lesté'],['assisted','assisté'],['band','élastique'],['plate','disque'],['bench','banc'],['incline','incliné'],['decline','décliné'],['squat','squat'],['deadlift','soulevé de terre'],['press','développé'],['row','rowing'],['curl','curl'],['extension','extension'],['raise','élévation'],['pulldown','tirage vertical'],['pull ups','tractions'],['pull-up','traction'],['push ups','pompes'],['push-ups','pompes'],['push-up','pompe'],['dip','dip'],['dips','dips'],['lunge','fente'],['lunges','fentes'],['fly','écarté'],['crunch','crunch'],['plank','gainage planche'],['calf raise','élévations des mollets'],['leg press','presse à cuisses'],['leg curl','leg curl'],['leg extension','leg extension'],['shoulder','épaule'],['shoulders','épaules'],['chest','pectoraux'],['back','dos'],['upper','supérieur'],['lower','inférieur'],['close grip','prise serrée'],['wide grip','prise large'],['reverse grip','prise supination'],['neutral grip','prise neutre'],['overhead','au-dessus de la tête'],['seated','assis'],['standing','debout'],['single arm','à un bras'],['one arm','à un bras'],['single leg','à une jambe'],['one leg','à une jambe'],['lying','allongé'],['front','avant'],['lateral','latéral'],['rear','arrière'],['romanian','roumain'],['bulgarian','bulgare'],['hack','hack'],['hip thrust','hip thrust'],['glute bridge','pont fessier'],['shrug','haussement d’épaules'],['face pull','face pull'],['pushdown','extension à la poulie'],['triceps','triceps'],['biceps','biceps'],['forearm','avant-bras'],['abs','abdominaux'],['core','gainage'],['cardio','cardio'],['calf','mollet'],['hamstring','ischio-jambiers'],['quadriceps','quadriceps'],['quad','quadriceps'],['glute','fessiers'],['adductor','adducteurs'],['abductor','abducteurs'],['wrist','poignet'],['neck','cou'],['ankle','cheville'],['hip','hanche']
  ];
  const esc=s=>String(s||'').toLowerCase();
  function nameFr(name){
    let s=String(name||'').replace(/\s+/g,' ').trim();
    const lower=s.toLowerCase();
    // expressions composées d'abord
    const phrases=[['behind the neck','nuque'],['one-arm','à un bras'],['one-leg','à une jambe'],['single-leg','à une jambe'],['single-arm','à un bras'],['walking lunges','fentes marchées'],['bulgarian split squat','fente bulgare'],['romanian deadlift','soulevé de terre roumain'],['hip thrust','hip thrust'],['glute bridge','pont fessier'],['face pull','face pull'],['air bike','vélo à air'],['ab wheel rollout','roue abdominale']];
    for(const [a,b] of phrases) s=s.replace(new RegExp(a,'ig'),b);
    for(const [a,b] of W) s=s.replace(new RegExp('\\b'+a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','ig'),b);
    return s.charAt(0).toUpperCase()+s.slice(1);
  }
  function muscles(e){
    const m=[...(e.primary_muscles||[]),...(e.secondary_muscles||[])];
    const map={quadriceps:'quadriceps',quad:'quadriceps',hamstrings:'ischio-jambiers',gluteus_maximus:'grand fessier',glutes:'fessiers',calves:'mollets',adductors:'adducteurs',abductors:'abducteurs',latissimus_dorsi:'grand dorsal',trapezius:'trapèzes',rhomboids:'rhomboïdes',erector_spinae:'érecteurs du rachis',lower_back:'lombaires',pectoralis_major:'grand pectoral',pectoralis_minor:'petit pectoral',deltoids:'deltoïdes',anterior_deltoid:'deltoïde antérieur',lateral_deltoid:'deltoïde moyen',rear_deltoid:'deltoïde postérieur',posterior_deltoid:'deltoïde postérieur',biceps:'biceps',biceps_brachii:'biceps',brachialis:'brachial',triceps:'triceps',triceps_brachii:'triceps',forearms:'avant-bras',forearm_flexors:'fléchisseurs de l’avant-bras',rectus_abdominis:'grand droit',obliques:'obliques',transverse_abdominis:'transverse',core:'ceinture abdominale',hip_flexors:'fléchisseurs de hanche',serratus_anterior:'dentelé antérieur',rotator_cuff:'coiffe des rotateurs',tibialis_anterior:'tibial antérieur'};
    return [...new Set(m.map(x=>map[x]||String(x).replace(/_/g,' ')))];
  }
  function body(e){return e.body_part||''}
  function desc(e,n,m){
    const target=m.slice(0,3).join(', ')||'les muscles sollicités';
    if(body(e)==='cardio'||e.category==='cardio') return `Exercice de conditionnement physique ciblant principalement ${target}.`;
    if(body(e)==='core') return `Exercice de gainage et de renforcement de la sangle abdominale ciblant principalement ${target}.`;
    return `Exercice de musculation ciblant principalement ${target}, avec une participation des muscles stabilisateurs.`;
  }
  function instructions(e){
    const n=nameFr(e.name_en||e.name); const b=body(e);
    if(b==='cardio'||e.category==='cardio') return [`Installe-toi correctement sur le matériel et adopte une position stable.`,`Gaine le tronc et démarre le mouvement avec une intensité progressive.`,`Maintiens un rythme régulier et contrôlé pendant toute la durée de l’effort.`,`Termine progressivement puis reviens à une position confortable.`];
    if(b==='core') return [`Installe-toi dans la position de départ et place correctement les appuis.`,`Gaine fortement le tronc avant de commencer le mouvement.`,`Réalise chaque répétition lentement en conservant l’alignement du corps.`,`Reviens à la position de départ sous contrôle.`];
    return [`Installe-toi correctement et adopte une position stable pour ${n.toLowerCase()}.`,`Gaine le tronc et commence le mouvement sans utiliser d’élan.`,`Réalise l’amplitude que tu peux contrôler tout en gardant les articulations dans leur axe.`,`Reviens lentement à la position de départ et conserve la tension musculaire.`];
  }
  function tips(e){return ['Privilégie une technique propre avant d’augmenter la charge.','Contrôle particulièrement la phase de retour et évite les mouvements brusques.','Adapte l’amplitude, la charge et le rythme à ton niveau et à ton matériel.'];}
  const old=typeof translatedExercise==='function'?translatedExercise:null;
  window.HS_TRANSLATION_COVERAGE={source:'RepDB',count:601,mode:'français complet automatique'};
  translatedExercise=function(e){
    const key=esc(e.name_en||e.name); let fr=null;
    if(typeof HS_FR!=='undefined'&&HS_FR[key]) fr=HS_FR[key];
    const m=muscles(e);
    return {name:fr?.name||nameFr(e.name_en||e.name),description:fr?.description||desc(e,nameFr(e.name_en||e.name),m),instructions:fr?.instructions||instructions(e),tips:fr?.tips||tips(e)};
  };
})();
