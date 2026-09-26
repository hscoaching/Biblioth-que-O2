(function(){
  const modal=document.querySelector('#exercise-modal'), content=document.querySelector('#modal-content');
  if(!modal||!content)return;
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const muscles={quadriceps:'Quadriceps',hamstrings:'Ischio-jambiers',gluteus_maximus:'Grand fessier',glutes:'Fessiers',calves:'Mollets',adductors:'Adducteurs',abductors:'Abducteurs',latissimus_dorsi:'Grand dorsal',trapezius:'Trapèzes',rhomboids:'Rhomboïdes',erector_spinae:'Érecteurs du rachis',lower_back:'Lombaires',pectoralis_major:'Grand pectoral',pectoralis_minor:'Petit pectoral',deltoids:'Deltoïdes',anterior_deltoid:'Deltoïde antérieur',lateral_deltoid:'Deltoïde moyen',rear_deltoid:'Deltoïde postérieur',biceps:'Biceps',brachialis:'Brachial',triceps:'Triceps',forearms:'Avant-bras',forearm_flexors:'Fléchisseurs de l’avant-bras',rectus_abdominis:'Grand droit',obliques:'Obliques',transverse_abdominis:'Transverse',core:'Ceinture abdominale',hip_flexors:'Fléchisseurs de hanche',serratus_anterior:'Dentelé antérieur',rotator_cuff:'Coiffe des rotateurs',tibialis_anterior:'Tibial antérieur'};
  const equipment={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',leg_press:'Presse à cuisses',pull_up_bar:'Barre de traction',dip_bars:'Barres parallèles',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine',bench:'Banc',trap_bar:'Barre hexagonale',rings:'Anneaux'};
  const advice={};
  const label=m=>muscles[m]||String(m||'').replace(/_/g,' '), eq=e=>equipment[e]||String(e||'').replace(/_/g,' ');
  function styles(){if(document.querySelector('#hs-modal-style'))return;const s=document.createElement('style');s.id='hs-modal-style';s.textContent=`
    #exercise-modal{padding:0!important;border:0;border-radius:22px;max-width:720px;width:calc(100% - 28px);background:#080808;color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.65);overflow:hidden}
    #exercise-modal::backdrop{background:rgba(0,0,0,.78);backdrop-filter:blur(5px)}
    #modal-content{padding:0}
    #modal-content .modal{padding:30px 30px 34px}
    #modal-content .modal>h2{font-size:30px;line-height:1.05;letter-spacing:-.8px;margin:8px 0 18px}
    #modal-content .modal>p{color:#aaa;font-size:14px;line-height:1.7;margin:22px 0 26px}
    #modal-content .modal>h3{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#777;margin:26px 0 12px}
    #modal-content .modal ol,#modal-content .modal ul{margin:0;padding-left:22px;color:#bbb;font-size:13px;line-height:1.7}
    #modal-content .modal li{padding:3px 0}
    #modal-content .modal ol li::marker{color:#fff;font-weight:800}
    #modal-content .modal-media{margin:0 -2px 20px;border-radius:16px;overflow:hidden}
    .hs-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:0 0 18px}
    .hs-meta-item{background:#101010;border:1px solid #292929;border-radius:12px;padding:12px}
    .hs-meta-label{display:block;color:#666;font-size:9px;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px}
    .hs-meta-value{display:block;color:#eee;font-size:12px;font-weight:700}
    .hs-primary{margin:18px 0 22px;padding-top:2px}
    .hs-primary-title{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;color:#777;margin-bottom:10px}
    .hs-primary-tags{display:flex;gap:7px;flex-wrap:wrap}
    .hs-primary-tag{background:#fff;color:#000;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:800}
    .hs-secondary{color:#777;font-size:11px;margin-top:9px}
    .hs-coach{margin-top:25px;padding:17px 18px;background:#101010;border:1px solid #292929;border-radius:14px}
    .hs-coach h3{margin:0 0 8px!important;font-size:13px!important;color:#fff!important;text-transform:none!important;letter-spacing:0!important}
    .hs-coach p{margin:0!important;color:#aaa!important;font-size:13px!important;line-height:1.65!important}
    .hs-coach strong{color:#fff}
    .qr-section{margin-top:28px;padding-top:22px;border-top:1px solid #222}
    .qr-section h3{margin-top:0!important}
    .qr-section p{font-size:12px!important;margin:0 0 14px!important;color:#777!important}
    .qr-url{display:flex;gap:8px;margin-top:12px}
    .qr-url input{min-width:0;flex:1;background:#111;border:1px solid #292929;color:#888;border-radius:9px;padding:9px;font-size:10px}
    .qr-copy{background:#fff;color:#000;border:0;border-radius:9px;padding:0 12px;font-weight:800;font-size:11px}
    @media(max-width:600px){#modal-content .modal{padding:24px 18px 28px}#modal-content .modal>h2{font-size:25px}.hs-meta{grid-template-columns:1fr 1fr}.qr-url{flex-direction:column}.qr-copy{height:38px}.qr-code{max-width:100%;overflow:hidden}}
  `;document.head.appendChild(s)}
  let dataPromise;
  function enhance(){
    const id=new URLSearchParams(location.search).get('exercice');if(!id)return;
    const title=content.querySelector('h2');if(!title)return;
    styles();
    if(content.querySelector('.hs-meta'))return;
    dataPromise=dataPromise||((window.HS_EXERCISES&&window.HS_EXERCISES.length)?Promise.resolve(window.HS_EXERCISES):new Promise(resolve=>{window.addEventListener('hs-exercises-ready',()=>resolve(window.HS_EXERCISES||[]),{once:true})}));
    dataPromise.then(all=>{const e=all.find(x=>String(x.id)===String(id));if(!e)return;
      const meta=document.createElement('div');meta.className='hs-meta';
      meta.innerHTML='<div class="hs-meta-item"><span class="hs-meta-label">Matériel</span><span class="hs-meta-value">'+eq(e.equipment||'bodyweight')+'</span></div><div class="hs-meta-item"><span class="hs-meta-label">Ciblage</span><span class="hs-meta-value">'+(e.primary_muscles||[]).slice(0,2).map(label).join(' · ')+'</span></div>';
      title.insertAdjacentElement('afterend',meta);
      const existing=content.querySelector('.modal-muscles');
      if(existing&&(e.primary_muscles||[]).length){const box=document.createElement('div');box.className='hs-primary';let html='<div class="hs-primary-title">Muscles ciblés en priorité</div><div class="hs-primary-tags">'+e.primary_muscles.map(m=>'<span class="hs-primary-tag">'+label(m)+'</span>').join('')+'</div>';if((e.secondary_muscles||[]).length)html+='<div class="hs-secondary">Secondaires : '+e.secondary_muscles.map(label).join(' · ')+'</div>';box.innerHTML=html;existing.insertAdjacentElement('afterend',box)}
      const old=content.querySelector('.modal-errors');if(old){const coach=document.createElement('div');coach.className='hs-coach';coach.innerHTML='<h3>💡 Conseil du coach</h3><p>Priorité à la qualité. Contrôle chaque répétition, garde une amplitude adaptée et augmente progressivement la charge lorsque ta technique reste propre.</p>';old.insertAdjacentElement('beforebegin',coach)}
    });
  }
  new MutationObserver(enhance).observe(content,{childList:true,subtree:true});enhance();
})();