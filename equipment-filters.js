(function(){
  const labels={barre:'Barre',haltère:'Haltères',poulie:'Poulie',machine:'Machine',poids_du_corps:'Poids du corps',kettlebell:'Kettlebell',élastique:'Élastique',disque:'Disque',banc:'Banc',lesté:'Lesté',assisté:'Assisté'};
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const data=()=>typeof exercises!=='undefined'?exercises:[];
  const getEquipment=e=>normalize(e&&(e.equipmentLabel||e.equipment||e.equipment_name||''));
  let selected='all';
  let initialized=false;
  function equipmentList(){
    const values=new Set(); data().forEach(e=>{const v=getEquipment(e);if(v)values.add(v)});
    return [...values].sort((a,b)=>label(a).localeCompare(label(b),'fr'));
  }
  function label(v){
    const key=Object.keys(labels).find(x=>normalize(x)===normalize(v));
    return key?labels[key]:String(v).replace(/_/g,' ');
  }
  function render(){
    const box=document.querySelector('#equipment-filters'); if(!box)return;
    const vals=equipmentList();
    if(!vals.length){box.hidden=true;return;}
    box.hidden=false; box.innerHTML='';
    const title=document.createElement('span'); title.className='hs-filter-title'; title.textContent='Matériel'; box.appendChild(title);
    const all=document.createElement('button'); all.type='button'; all.className='chip hs-equipment-chip '+(selected==='all'?'active':''); all.textContent='Tous'; all.onclick=()=>{selected='all';apply();render()}; box.appendChild(all);
    vals.forEach(v=>{
      const b=document.createElement('button'); b.type='button'; b.className='chip hs-equipment-chip '+(selected===v?'active':''); b.dataset.equipment=v; b.textContent=label(v);
      b.onclick=()=>{selected=selected===v?'all':v;apply();render()}; box.appendChild(b);
    });
  }
  function apply(){
    const cards=document.querySelectorAll('#exercise-grid .card');
    cards.forEach(card=>{
      const e=data().find(x=>String(x.id)===String(card.dataset.id));
      card.classList.toggle('hs-equipment-hidden',selected!=='all' && getEquipment(e)!==selected);
    });
  }
  function init(){
    const grid=document.querySelector('#exercise-grid'); const box=document.querySelector('#equipment-filters');
    if(!grid||!box||initialized)return; initialized=true;
    render(); apply();
    new MutationObserver(()=>{requestAnimationFrame(()=>{render();apply()})}).observe(grid,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();