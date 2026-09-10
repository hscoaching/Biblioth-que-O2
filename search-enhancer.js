(function(){
  const input=document.querySelector('#search');
  const grid=document.querySelector('#exercise-grid');
  if(!input||!grid)return;

  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-_’']/g,' ').replace(/\s+/g,' ').trim();
  const synonyms={
    'developpe couche':['developpe couche','bench press','bench'],
    'bench press':['developpe couche','bench press','bench'],
    'bench':['developpe couche','bench press','bench'],
    'developpe incline':['developpe incline','incline bench','incline'],
    'incline bench':['developpe incline','incline bench','incline'],
    'souleve de terre':['souleve de terre','deadlift'],
    'deadlift':['souleve de terre','deadlift'],
    'tirage vertical':['tirage vertical','lat pulldown','pulldown'],
    'lat pulldown':['tirage vertical','lat pulldown','pulldown'],
    'traction':['traction','pull up','pullup','chin up'],
    'pull up':['traction','pull up','pullup','chin up'],
    'rowing':['rowing','row','tirage horizontal'],
    'tirage horizontal':['rowing','row','tirage horizontal'],
    'elevation laterale':['elevation laterale','lateral raise'],
    'lateral raise':['elevation laterale','lateral raise'],
    'elevation frontale':['elevation frontale','front raise'],
    'front raise':['elevation frontale','front raise'],
    'curl biceps':['curl biceps','biceps curl','curl'],
    'biceps curl':['curl biceps','biceps curl','curl'],
    'curl marteau':['curl marteau','hammer curl'],
    'hammer curl':['curl marteau','hammer curl'],
    'extension triceps':['extension triceps','triceps extension','pushdown'],
    'triceps extension':['extension triceps','triceps extension','pushdown'],
    'pushdown':['extension triceps','triceps extension','pushdown'],
    'fente':['fente','lunge','lunges'],
    'lunge':['fente','lunge','lunges'],
    'hip thrust':['hip thrust','poussee de hanches'],
    'poussee de hanches':['hip thrust','poussee de hanches'],
    'gainage':['gainage','plank'],
    'plank':['gainage','plank'],
    'abdos':['abdos','abdominaux','abs','core'],
    'abs':['abdos','abdominaux','abs','core'],
    'pecs':['pectoraux','pecs','chest'],
    'pectoraux':['pectoraux','pecs','chest'],
    'chest':['pectoraux','pecs','chest'],
    'epaules':['epaules','shoulders'],
    'shoulders':['epaules','shoulders'],
    'dos':['dos','back'],
    'back':['dos','back'],
    'jambes':['jambes','legs'],
    'legs':['jambes','legs'],
    'bras':['bras','arms','biceps','triceps'],
    'arms':['bras','arms','biceps','triceps'],
    'biceps':['biceps','brachialis','curl'],
    'triceps':['triceps','extension','pushdown'],
    'barre':['barre','barbell'],
    'haltere':['haltere','halteres','dumbbell'],
    'halteres':['haltere','halteres','dumbbell'],
    'poulie':['poulie','cable'],
    'disque':['disque','plate'],
    'poids du corps':['poids du corps','bodyweight'],
    'elastique':['elastique','band'],
    'machine':['machine'],
    'kettlebell':['kettlebell']
  };

  function termsFor(q){
    const terms=synonyms[q]||[q];
    return [...new Set(terms.map(normalize).filter(Boolean))];
  }

  function scoreCard(card,terms){
    const text=normalize(card.innerText);
    const title=normalize(card.querySelector('h3')?.textContent||'');
    let score=0;
    terms.forEach(term=>{
      if(title===term)score+=100;
      else if(title.includes(term))score+=60;
      else if(text.includes(term))score+=20;
    });
    return score;
  }

  function search(){
    const q=normalize(input.value);
    const cards=[...grid.querySelectorAll('.card')];
    if(!q){cards.forEach(c=>c.style.display='');updateCount(cards.length);return;}
    const terms=termsFor(q);
    let visible=0;
    cards.forEach(card=>{
      const ok=scoreCard(card,terms)>0;
      card.style.display=ok?'':'none';
      if(ok)visible++;
    });
    updateCount(visible);
  }

  function updateCount(n){
    const count=document.querySelector('#count');
    const empty=document.querySelector('#empty');
    if(count)count.textContent=`${n} exercice${n>1?'s':''}`;
    if(empty)empty.hidden=n>0;
  }

  input.addEventListener('input',search);
  input.addEventListener('search',search);
})();