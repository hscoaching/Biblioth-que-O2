// Pont client : Supabase reste la source unique des données modifiables.
// Les médias animés restent issus du dataset RepDB, pour conserver les animations.
(function(){
  const SUPABASE_URL='https://hcjoagpkgpqxgzjdyfvd.supabase.co';
  const SUPABASE_KEY='sb_publishable_ezHZ_co222B09HGiSeCkyw_Nw4G5FLB';
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const originalFetch=window.fetch.bind(window);
  const bodyParts={chest:'chest',pectoralis_major:'chest',pectoralis_minor:'chest',back:'back',latissimus_dorsi:'back',trapezius:'back',rhomboids:'back',shoulders:'shoulders',deltoids:'shoulders',anterior_deltoid:'shoulders',lateral_deltoid:'shoulders',rear_deltoid:'shoulders',biceps:'upper_arms',brachialis:'upper_arms',triceps:'upper_arms',forearms:'lower_arms',quadriceps:'upper_legs',hamstrings:'upper_legs',gluteus_maximus:'upper_legs',glutes:'upper_legs',adductors:'upper_legs',abductors:'upper_legs',calves:'lower_legs',tibialis_anterior:'lower_legs',rectus_abdominis:'core',obliques:'core',transverse_abdominis:'core',core:'core',hip_flexors:'core',neck:'neck'};
  function part(muscles){for(const m of (muscles||[]))if(bodyParts[m])return bodyParts[m];return 'core'}
  function mediaMap(rows){const map=new Map();for(const e of (rows||[])){const keys=[e.slug,e.id,e.name_en,e.name].filter(Boolean).map(String);keys.forEach(k=>map.set(k,e.images||{}))}return map}
  function toRepDb(rows,media){return {exercises:(rows||[]).map(e=>{const imgs=media.get(String(e.slug))||media.get(String(e.id))||{};return {id:e.slug||String(e.id),name_en:e.name_fr||e.name||e.slug||String(e.id),description_en:e.description_fr||e.description||'',primary_muscles:e.muscles||[],secondary_muscles:[],equipment:e.equipment||'',difficulty:e.level||'',instructions_en:Array.isArray(e.instructions_fr)&&e.instructions_fr.length?e.instructions_fr:(e.instructions||[]),tips_en:Array.isArray(e.tips_fr)&&e.tips_fr.length?e.tips_fr:(e.tips||[]),body_part:part(e.muscles),images:imgs.flat?imgs:{flat:{start:e.media_url||'',main:e.media_url||''}}}})}}
  window.translatedExercise=function(e){return {name:e.name_en||e.name||'',description:e.description_en||e.description||'',instructions:Array.isArray(e.instructions_en)?e.instructions_en:(e.instructions||[]),tips:Array.isArray(e.tips_en)?e.tips_en:(e.tips||[])}};
  async function fetchMedia(){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),5000);
    try{
      const r=await originalFetch(DATA_URL,{cache:'force-cache',signal:controller.signal});
      if(!r.ok)throw new Error('RepDB HTTP '+r.status);
      return await r.json();
    }catch(err){
      console.warn('Médias animés RepDB indisponibles, fallback Supabase utilisé.',err);
      return [];
    }finally{clearTimeout(timer)}
  }
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url===DATA_URL){
      try{
        // Les données Supabase ne dépendent plus du chargement de RepDB.
        // Ainsi la bibliothèque reste fonctionnelle même si le dataset média est lent/inaccessible.
        const dbPromise=originalFetch(SUPABASE_URL+'/rest/v1/exercises?select=*&is_published=eq.true&order=name',{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY},cache:'no-store'});
        const [dbRes,media]=await Promise.all([dbPromise,fetchMedia()]);
        if(!dbRes.ok)throw new Error('Supabase HTTP '+dbRes.status);
        const mediaByKey=mediaMap(media);
        return new Response(JSON.stringify(toRepDb(await dbRes.json(),mediaByKey)),{status:200,headers:{'Content-Type':'application/json'}});
      }catch(err){
        console.error('Bibliothèque Supabase indisponible',err);
        return originalFetch(input,init);
      }
    }
    return originalFetch(input,init);
  };
  function installOpenFix(){const original=window.openExercise;if(typeof original!=='function'||original.__hsFixed)return;const fixed=function(id,updateUrl=true){const normalized=String(id).match(/^\d+$/)?Number(id):id;return original(normalized,updateUrl)};fixed.__hsFixed=true;window.openExercise=fixed}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installOpenFix,{once:true});else installOpenFix();
})();
