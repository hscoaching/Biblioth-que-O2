(function(){
  const labels={barre:'Barre',haltère:'Haltères',poulie:'Poulie',machine:'Machine',poids_du_corps:'Poids du corps',kettlebell:'Kettlebell',élastique:'Élastique',disque:'Disque',banc:'Banc',lesté:'Lesté',assisté:'Assisté'};
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const data=()=>typeof exercises!=='undefined'?exercises:[];
  const getEquipment=e=>normalize(e&& (e.equipmentLabel||e.equipment||e.equipment_name||''));
  const chipClass='hs-equipment-chip';
  let selected='all';
  function equipmentList(){
    const values=new Set();
    data().forEach(e=>{const v=getEquipment(e);if(v)values.add(v)});
    return [...values].sort();
  }
  function label(v){
    const key=Object.keys(labels).find(x=>normalize(x)===normalize(v));
    return key?labels[key]:String(v).replace(/_/g,' ');
  }
  function render(){
    const box=document.querySelector('#equipment-filters');
    if(!box)return;
    box.innerHTML='';
    const vals=equipmentList();
    if(!vals.length)return;
    const all=document.createElement('button');
    all.type='button'; all.className='chip '+chipClass+(selected==='all'?' active':''); all.textContent='Tout le matériel';
    all.onclick=()=>{selected='all';apply();render();}; box.appendChild(all);
    vals.forEach(v=>{
      const b=document.createElement('button');
      b.type='button'; b.className='chip '+chipClass+(selected===v?' active':''); b.dataset.equipment=v; b.textContent=label(v);
      b.onclick=()=>{selected=selected===v?'all':v;apply();render();};
      box.appendChild(b);
    });
  }
  function apply(){
    const cards=document.querySelectorAll('#exercise-grid .card');
    cards.forEach(card=>{
      const id=card.dataset.id;
      const e=data().find(x=>String(x.id)===String(id));
      card.classList.toggle('hs-equipment-hidden',selected!=='all' && getEquipment(e)!==selected);
    });
    const visible=[...cards].filter(c=>!c.classList.contains('hs-equipment-hidden')).length;
    const count=document.querySelector('#count');
    if(count) count.textContent=selected==='all'
      ? `${visible} exercice${visible>1?'s':''}`
      : `${visible} exercice${visible>1?'s':''}`;
  }
  function init(){
    const grid=document.querySelector('#exercise-grid');
    const box=document.querySelector('#equipment-filters');
    if(!grid||!box)return;
    render();
    new MutationObserver(()=>{render();apply();}).observe(grid,{childList:true});
    setTimeout(()=>{render();apply();},400);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();