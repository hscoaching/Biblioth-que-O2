(function(){
  const labels={barre:'Barre',haltère:'Haltères',poulie:'Poulie',machine:'Machine',poids_du_corps:'Poids du corps',kettlebell:'Kettlebell',élastique:'Élastique',disque:'Disque',banc:'Banc',lesté:'Lesté',assisté:'Assisté'};
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const getEquipment=e=>normalize(e.equipmentLabel||e.equipment||e.equipment_name||'');
  const chipClass='hs-equipment-chip';
  let selected='all';
  function equipmentList(){
    const values=new Set();
    (window.exercises||[]).forEach(e=>{const v=getEquipment(e);if(v)values.add(v)});
    return [...values].sort().slice(0,14);
  }
  function label(v){const k=normalize(v);return Object.keys(labels).find(x=>normalize(x)===k)?labels[Object.keys(labels).find(x=>normalize(x)===k)]:String(v).replace(/_/g,' ')}
  function render(){
    const box=document.querySelector('.categories');if(!box)return;
    box.querySelectorAll('.'+chipClass).forEach(x=>x.remove());
    const vals=equipmentList(); if(!vals.length)return;
    vals.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='chip '+chipClass+(selected===v?' active':'');b.dataset.equipment=v;b.textContent=label(v);b.onclick=()=>{selected=selected===v?'all':v;apply();render()};box.appendChild(b)});
  }
  function apply(){
    document.querySelectorAll('#exercise-grid .card').forEach(card=>{
      if(selected==='all'){card.style.removeProperty('display');return}
      const id=card.dataset.id;const e=(window.exercises||[]).find(x=>String(x.id)===String(id));
      card.style.display=getEquipment(e)===selected?'':'none';
    });
    const visible=[...document.querySelectorAll('#exercise-grid .card')].filter(c=>getComputedStyle(c).display!=='none').length;
    const count=document.querySelector('#count');if(count&&selected!=='all')count.textContent=`${visible} exercice${visible>1?'s':''}`;
  }
  const observer=new MutationObserver(()=>{if(selected!=='all')apply()});
  function init(){const grid=document.querySelector('#exercise-grid');if(!grid)return;observer.observe(grid,{childList:true});setTimeout(render,250);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
