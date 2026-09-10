(function(){
  const grid=document.querySelector('#exercise-grid');
  if(!grid)return;

  const labels={bodyweight:'Poids du corps',barbell:'Barre',dumbbell:'Haltères',cable:'Poulie',machine:'Machine',leg_press:'Presse à cuisses',pull_up_bar:'Barre de traction',dip_bars:'Barres parallèles',kettlebell:'Kettlebell',band:'Élastique',plate:'Disque',ez_bar:'Barre EZ',smith_machine:'Smith machine',bench:'Banc',trap_bar:'Barre hexagonale',rings:'Anneaux'};

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
    grid.querySelectorAll('.card').forEach(card=>{
      if(card.querySelector('.hs-card-equipment'))return;
      const id=String(card.dataset.id||'');
      const e=Array.isArray(window.exercises)?window.exercises.find(x=>String(x.id)===id):null;
      if(!e)return;
      const value=labels[e.equipment]||String(e.equipment||'').replace(/_/g,' ');
      if(!value)return;
      const el=document.createElement('span');el.className='hs-card-equipment';el.textContent=value;
      const p=card.querySelector('p');
      if(p)p.insertAdjacentElement('afterend',el);else card.appendChild(el);
    });
  }

  const observer=new MutationObserver(add);observer.observe(grid,{childList:true,subtree:true});
  const timer=setInterval(()=>{add();if(Array.isArray(window.exercises)&&window.exercises.length)clearInterval(timer)},300);
  add();
})();
