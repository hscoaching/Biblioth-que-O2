(function(){
  const input=document.querySelector('#search');
  if(!input)return;
  const original=input.oninput;
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-_’']/g,' ').replace(/\s+/g,' ').trim();
  const synonyms={
    'developpe couche':'développé couché','bench press':'développé couché','bench':'développé couché',
    'developpe incline':'développé incliné','incline bench':'développé incliné',
    'souleve de terre':'soulevé de terre','deadlift':'soulevé de terre',
    'lat pulldown':'tirage vertical','pull up':'traction','pullup':'traction',
    'tirage horizontal':'rowing','row':'rowing',
    'elevation laterale':'élévation latérale','lateral raise':'élévation latérale',
    'elevation frontale':'élévation frontale','front raise':'élévation frontale',
    'curl biceps':'curl biceps','biceps curl':'curl biceps','hammer curl':'curl marteau',
    'extension triceps':'extension triceps','triceps extension':'extension triceps','pushdown':'extension à la poulie',
    'lunge':'fente','lunges':'fente','fentes':'fente',
    'poussee de hanches':'hip thrust','plank':'gainage','abdos':'abdominaux','abs':'abdominaux',
    'pecs':'pectoraux','chest':'pectoraux','shoulders':'épaules','back':'dos',
    'legs':'jambes','arms':'bras',
    'barre':'barbell','haltere':'dumbbell','halteres':'dumbbell','poulie':'cable','disque':'plate',
    'poids du corps':'bodyweight','elastique':'band','kettlebell':'kettlebell','machine':'machine'
  };
  function apply(){
    const raw=input.value;
    const q=normalize(raw);
    if(!q){ original&&original.call(input); return; }
    const mapped=synonyms[q]||raw;
    input.value=mapped;
    original&&original.call(input);
    const results=[...document.querySelectorAll('#exercise-grid .card')];
    input.value=raw;
    if(results.length)return;
    input.value='';
    original&&original.call(input);
    input.value=raw;
    const target=normalize(synonyms[q]||raw);
    const cards=[...document.querySelectorAll('#exercise-grid .card')];
    let visible=0;
    cards.forEach(card=>{
      const text=normalize(card.innerText);
      const ok=text.includes(target)||text.includes(q);
      card.style.display=ok?'':'none';
      if(ok)visible++;
    });
    const count=document.querySelector('#count');
    const empty=document.querySelector('#empty');
    if(count)count.textContent=`${visible} exercice${visible>1?'s':''}`;
    if(empty)empty.hidden=visible>0;
  }
  input.oninput=apply;
  input.placeholder='Rechercher : exercice, muscle, matériel…';
})();
