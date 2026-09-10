(function(){
  const grid=document.querySelector('#exercise-grid');
  if(!grid)return;

  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const labels={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',leg_press:'Presse à cuisses',pull_up_bar:'Barre de traction',dip_bars:'Barres parallèles',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine',bench:'Banc',trap_bar:'Barre hexagonale',rings:'Anneaux'};
  let equipmentById=new Map();

  function styles(){
    if(document.querySelector('#hs-card-style'))return;
    const s=document.createElement('style');s.id='hs-card-style';s.textContent=`
      .card-media{transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease}
      .card-media:active{transform:scale(.985)}
      .hs-card-equipment{display:inline-flex;align-items:center;gap:5px;margin-top:9px;color:#777;font-size:10px;font-weight:600;letter-spacing:.15px}
      .hs-card-equipment::before{content:'•';color:#aaa;font-size:12px}
      @media(hover:hover){.card-media:hover{transform:translateY(-2px)}}
    `;document.head.appendChild(s);
  }

  function add(){
    styles();
    if(!equipmentById.size)return;
    grid.querySelectorAll('.card').forEach(card=>{
      if(card.querySelector('.hs-card-equipment'))return;
      const id=String(card.dataset.id||'');
      const equipment=equipmentById.get(id);
      if(!equipment)return;
      const value=labels[equipment]||String(equipment).replace(/_/g,' ');
      const el=document.createElement('span');
      el.className='hs-card-equipment';
      el.textContent=value;
      const p=card.querySelector('p');
      if(p)p.insertAdjacentElement('afterend',el);else card.appendChild(el);
    });
  }

  async function load(){
    try{
      const res=await fetch(DATA_URL);
      const data=await res.json();
      (Array.isArray(data)?data:data.exercises||[]).forEach(e=>{
        const id=String(e.id??'');
        if(id&&e.equipment)equipmentById.set(id,e.equipment);
      });
      add();
    }catch(_){/* le site reste utilisable même si le catalogue est indisponible */}
  }

  const observer=new MutationObserver(add);
  observer.observe(grid,{childList:true,subtree:true});
  add();
  load();
})();