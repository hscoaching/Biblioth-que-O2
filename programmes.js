const PROGRAMMES=[
 {id:'masse-5j',title:'Prise de masse — 5 jours',tag:'HYPERTROPHIE',desc:'Un split complet orienté hypertrophie, avec un volume progressif et des exercices fondamentaux.',days:[
  {name:'J1 — Pectoraux / épaules / triceps',ex:[['Barbell Bench Press',4,'6–10','2 min'],['Dumbbell Incline Bench Press',3,'8–12','90 s'],['Dumbbell Lateral Raise',4,'12–20','60 s'],['Cable Crossover',3,'10–15','60 s'],['Triceps Pushdown',3,'10–15','60 s']]},
  {name:'J2 — Dos / biceps',ex:[['Barbell Deadlift',4,'5–8','2–3 min'],['Lat Pulldown',4,'8–12','90 s'],['Barbell Bent Over Row',3,'8–12','90 s'],['Seated Cable Row',3,'10–15','75 s'],['Hammer Curl',3,'10–15','60 s']]},
  {name:'J3 — Jambes',ex:[['Barbell Full Squat',4,'6–10','2–3 min'],['Leg Press',4,'10–15','2 min'],['Romanian Deadlift',3,'8–12','90 s'],['Leg Extension',3,'12–15','60 s'],['Calf Raise',4,'12–20','60 s']]},
  {name:'J4 — Épaules / bras',ex:[['Barbell Shoulder Press',4,'6–10','2 min'],['Dumbbell Lateral Raise',4,'12–20','60 s'],['Face Pull',3,'12–20','60 s'],['Dumbbell Biceps Curl',3,'8–12','60 s'],['Overhead Triceps Extension',3,'10–15','60 s']]},
  {name:'J5 — Pectoraux / dos',ex:[['Dumbbell Bench Press',4,'8–12','90 s'],['Cable Fly',3,'10–15','60 s'],['Pull-Up',4,'6–10','2 min'],['Dumbbell Row',3,'8–12','90 s'],['Plank',3,'30–60 s','45 s']]}
 ]},
 {id:'force-3j',title:'Force fondamentale — 3 jours',tag:'FORCE',desc:'Une base simple autour des grands mouvements, avec des séries plus lourdes et des repos longs.',days:[
  {name:'J1 — Squat',ex:[['Barbell Full Squat',5,'3–5','3 min'],['Leg Press',3,'6–8','2 min'],['Leg Curl',3,'8–10','90 s'],['Calf Raise',3,'10–15','60 s']]},
  {name:'J2 — Développé couché',ex:[['Barbell Bench Press',5,'3–5','3 min'],['Dumbbell Incline Bench Press',3,'6–8','2 min'],['Triceps Pushdown',3,'8–12','90 s'],['Plank',3,'45–60 s','60 s']]},
  {name:'J3 — Soulevé de terre',ex:[['Barbell Deadlift',5,'2–4','3 min'],['Barbell Bent Over Row',4,'5–8','2 min'],['Lat Pulldown',3,'8–10','90 s'],['Dumbbell Biceps Curl',3,'8–12','60 s']]}
 ]},
 {id:'full-body-3j',title:'Full Body — 3 jours',tag:'DÉBUT / REPRISE',desc:'Trois séances équilibrées pour travailler tout le corps avec un volume maîtrisé.',days:[
  {name:'Séance A',ex:[['Barbell Full Squat',3,'8–10','2 min'],['Barbell Bench Press',3,'8–10','2 min'],['Lat Pulldown',3,'10–12','90 s'],['Dumbbell Lateral Raise',3,'12–15','60 s'],['Plank',3,'30–60 s','45 s']]},
  {name:'Séance B',ex:[['Romanian Deadlift',3,'8–10','2 min'],['Dumbbell Bench Press',3,'8–12','90 s'],['Seated Cable Row',3,'10–12','90 s'],['Leg Extension',3,'12–15','60 s'],['Hammer Curl',2,'10–15','60 s']]},
  {name:'Séance C',ex:[['Leg Press',3,'10–12','2 min'],['Dumbbell Incline Bench Press',3,'8–12','90 s'],['Pull-Up',3,'6–10','2 min'],['Dumbbell Lateral Raise',3,'12–20','60 s'],['Triceps Pushdown',2,'10–15','60 s']]}
 ]}
];

function programmeExerciseUrl(name){
 const found=exercises.find(e=>String(e.name_en||'').toLowerCase()===name.toLowerCase());
 return found?`?exercice=${encodeURIComponent(found.id)}`:'#';
}
function renderProgrammes(){
 const host=document.querySelector('#programmes'); if(!host)return;
 host.innerHTML=`<div class="programme-grid">${PROGRAMMES.map(p=>`<article class="programme-card"><span class="tag">${p.tag}</span><h3>${p.title}</h3><p>${p.desc}</p><div class="programme-meta">${p.days.length} séances · ${p.days.reduce((n,d)=>n+d.ex.length,0)} exercices</div><button class="programme-open" data-programme="${p.id}">Voir le programme</button></article>`).join('')}</div>`;
 host.querySelectorAll('.programme-open').forEach(b=>b.onclick=()=>openProgramme(b.dataset.programme));
}
function openProgramme(id){
 const p=PROGRAMMES.find(x=>x.id===id); if(!p)return;
 const modal=document.querySelector('#exercise-modal'),content=document.querySelector('#modal-content');
 content.innerHTML=`<div class="modal programme-modal"><span class="modal-tag">PROGRAMME · ${p.tag}</span><h2>${p.title}</h2><p>${p.desc}</p>${p.days.map((d,i)=>`<section class="programme-day"><div class="day-title"><h3>${d.name}</h3><span>${d.ex.length} exercices</span></div><div class="programme-table">${d.ex.map((x,n)=>`<a class="programme-row" href="${programmeExerciseUrl(x[0])}"><span class="exercise-number">${n+1}</span><span class="exercise-name">${x[0]}</span><strong>${x[1]} × ${x[2]}</strong><small>Repos ${x[3]}</small></a>`).join('')}</div></section>`).join('')}<div class="programme-note">💡 Clique sur un exercice pour ouvrir directement sa fiche technique.</div></div>`;
 modal.showModal();
 content.querySelectorAll('.programme-row').forEach(a=>a.onclick=e=>{if(a.getAttribute('href')==='#')e.preventDefault()});
}
window.PROGRAMMES=PROGRAMMES;
window.renderProgrammes=renderProgrammes;
window.openProgramme=openProgramme;
