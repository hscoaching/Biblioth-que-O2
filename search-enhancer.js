(function(){
  const input=document.querySelector('#search');
  const grid=document.querySelector('#exercise-grid');
  const categories=document.querySelector('.categories');
  if(!input||!grid)return;

  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-_’']/g,' ').replace(/\s+/g,' ').trim();
  const synonyms={
    'developpe':['developpe','developpement','bench press','bench'],
    'developpe couche':['developpe couche','bench press','bench'],
    'bench press':['developpe couche','bench press','bench'],
    'bench':['developpe couche','bench press','bench'],
    'developpe incline':['developpe incline','incline bench','incline'],
    'incline':['developpe incline','incline bench','incline'],
    'souleve de terre':['souleve de terre','deadlift'],
    'deadlift':['souleve de terre','deadlift'],
    'tirage vertical':['tirage vertical','lat pulldown','pulldown'],
    'lat pulldown':['tirage vertical','lat pulldown','pulldown'],
    'traction':['traction','pull up','pullup','chin up'],
    'tractions':['traction','pull up','pullup','chin up'],
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
    'fentes':['fente','lunge','lunges'],
    'lunge':['fente','lunge','lunges'],
    'hip thrust':['hip thrust','poussee de hanches'],
    'poussee de hanches':['hip thrust','poussee de hanches'],
    'gainage':['gainage','plank'],
    'plank':['gainage','plank'],
    'abdos':['abdos','abdominaux','abs','core'],
    'abdominaux':['abdos','abdominaux','abs','core'],
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
    'barbell':['barre','barbell'],
    'haltere':['haltere','halteres','dumbbell'],
    'halteres':['haltere','halteres','dumbbell'],
    'dumbbell':['haltere','halteres','dumbbell'],
    'poulie':['poulie','cable'],
    'cable':['poulie','cable'],
    'disque':['disque','plate'],
    'plate':['disque','plate'],
    'poids du corps':['poids du corps','bodyweight'],
    'bodyweight':['poids du corps','bodyweight'],
    'elastique':['elastique','band'],
    'band':['elastique','band'],
    'machine':['machine'],
    'kettlebell':['kettlebell']
  };

  function termsFor(q){
    const words=normalize(q).split(' ').filter(Boolean);
    const phrases=[];
    for(let i=0;i<words.length;i++){
      if(i<words.length-1)phrases.push(words[i]+' '+words[i+1]);
    }
    const raw=[q,...phrases,...words];
    const expanded=raw.flatMap(x=>synonyms[x]||[x]);
    return [...new Set(expanded.map(normalize).filter(Boolean))];
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

  function isVisible(card){
    return card.style.display!=='none' && !card.classList.contains('hs-favorites-hidden');
  }

  function updateCount(n){
    const count=document.querySelector('#count'),empty=document.querySelector('#empty');
    if(count)count.textContent=`${n} exercice${n>1?'s':''}`;
    if(empty)empty.hidden=n>0;
  }

  function runSearch(){
    const q=normalize(input.value),cards=[...grid.querySelectorAll('.card')];
    if(!q){
      cards.forEach(c=>{
        if(c.dataset.armHidden==='1')c.style.display='none';
        else c.style.display='';
      });
      updateCount(cards.filter(isVisible).length);
      return;
    }

    const terms=termsFor(q);
    cards.forEach(card=>{
      if(card.dataset.armHidden==='1'){
        card.style.display='none';
        return;
      }
      card.style.display=scoreCard(card,terms)>0?'':'none';
    });
    updateCount(cards.filter(isVisible).length);
  }

  input.addEventListener('input',runSearch);
  input.addEventListener('search',runSearch);

  if(categories){
    categories.addEventListener('click',()=>setTimeout(runSearch,40),false);
  }

  const observer=new MutationObserver(()=>{
    const q=normalize(input.value);
    if(q)runSearch();
  });
  observer.observe(grid,{childList:true,subtree:true});
  runSearch();
})();