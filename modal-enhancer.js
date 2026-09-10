(function(){
  const modal=document.querySelector('#exercise-modal'), content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const muscles={quadriceps:'Quadriceps',hamstrings:'Ischio-jambiers',gluteus_maximus:'Grand fessier',glutes:'Fessiers',calves:'Mollets',adductors:'Adducteurs',abductors:'Abducteurs',latissimus_dorsi:'Grand dorsal',trapezius:'Trapèzes',rhomboids:'Rhomboïdes',erector_spinae:'Érecteurs du rachis',lower_back:'Lombaires',pectoralis_major:'Grand pectoral',pectoralis_minor:'Petit pectoral',deltoids:'Deltoïdes',anterior_deltoid:'Deltoïde antérieur',lateral_deltoid:'Deltoïde moyen',rear_deltoid:'Deltoïde postérieur',biceps:'Biceps',brachialis:'Brachial',triceps:'Triceps',forearms:'Avant-bras',rectus_abdominis:'Grand droit',obliques:'Obliques',transverse_abdominis:'Transverse',core:'Ceinture abdominale',hip_flexors:'Fléchisseurs de hanche',serratus_anterior:'Dentelé antérieur',rotator_cuff:'Coiffe des rotateurs',tibialis_anterior:'Tibial antérieur'};
  const equipment={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine'};
  const levels={beginner:'Débutant',intermediate:'Intermédiaire',advanced:'Avancé',expert:'Expert'};
  const label=m=>muscles[m]||String(m||'').replace(/_/g,' '), eq=e=>equipment[e]||String(e||'').replace(/_/g,' ');
  function styles(){if(document.querySelector('#hs-modal-style'))return;const s=document.createElement('style');s.id='hs-modal-style';s.textContent='.hs-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 20px}.hs-meta-item{background:#101010;border:1px solid #292929;border-radius:12px;padding:11px}.hs-meta-label{display:block;color:#666;font-size:9px;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px}.hs-meta-value{display:block;color:#eee;font-size:12px;font-weight:700}.hs-primary{margin:18px 0}.hs-primary-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:9px}.hs-primary-tags{display:flex;gap:7px;flex-wrap:wrap}.hs-primary-tag{background:#fff;color:#000;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:700}.hs-secondary{color:#777;font-size:11px;margin-top:8px}.hs-coach{margin-top:22px;padding:18px;background:#101010;border:1px solid #292929;border-radius:14px}.hs-coach h3{margin:0 0 9px!important;font-size:14px}.hs-coach p{margin:0;color:#aaa;font-size:13px;line-height:1.6}.hs-coach strong{color:#fff}@media(max-width:600px){.hs-meta{grid-template-columns:1fr 1fr}.hs-meta-item:last-child{grid-column:1/-1}}';document.head.appendChild(s)}
  let dataPromise;
  function enhance(){
    if(content.querySelector('.hs-meta'))return;
    const id=new URLSearchParams(location.search).get('exercice');if(!id)return;
    const title=content.querySelector('h2');if(!title)return;
    dataPromise=dataPromise||fetch(DATA_URL,{cache:'no-store'}).then(r=>r.json()).then(x=>x.exercises||[]).catch(()=>[]);
    dataPromise.then(all=>{const e=all.find(x=>String(x.id)===String(id));if(!e)return;styles();
      const meta=document.createElement('div');meta.className='hs-meta';
      meta.innerHTML='<div class="hs-meta-item"><span class="hs-meta-label">Niveau</span><span class="hs-meta-value">'+(levels[e.level]||e.level||'—')+'</span></div><div class="hs-meta-item"><span class="hs-meta-label">Matériel</span><span class="hs-meta-value">'+eq(e.equipment||'bodyweight')+'</span></div><div class="hs-meta-item"><span class="hs-meta-label">Ciblage</span><span class="hs-meta-value">'+(e.primary_muscles||[]).slice(0,2).map(label).join(' · ')+'</span></div>';
      title.insertAdjacentElement('afterend',meta);
      const existing=content.querySelector('.modal-muscles');
      if(existing&&(e.primary_muscles||[]).length){const box=document.createElement('div');box.className='hs-primary';let html='<div class="hs-primary-title">Muscles ciblés en priorité</div><div class="hs-primary-tags">'+e.primary_muscles.map(m=>'<span class="hs-primary-tag">'+label(m)+'</span>').join('')+'</div>';if((e.secondary_muscles||[]).length)html+='<div class="hs-secondary">Secondaires : '+e.secondary_muscles.map(label).join(' · ')+'</div>';box.innerHTML=html;existing.insertAdjacentElement('afterend',box)}
      const old=content.querySelector('.modal-errors');if(old){const coach=document.createElement('div');coach.className='hs-coach';coach.innerHTML='<h3>💡 Conseil du coach</h3><p><strong>Priorité à la qualité.</strong> Contrôle chaque répétition, garde une amplitude adaptée et augmente progressivement la charge lorsque ta technique reste propre.</p>';old.insertAdjacentElement('beforebegin',coach)}
    });
  }
  new MutationObserver(enhance).observe(content,{childList:true,subtree:true});enhance();
})();
