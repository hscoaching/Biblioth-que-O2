// Pont client : Supabase devient la source unique de la bibliothèque publique.
// L'espace admin et l'espace client lisent ainsi les mêmes exercices.
(function(){
  const SUPABASE_URL='https://hcjoagpkgpqxgzjdyfvd.supabase.co';
  const SUPABASE_KEY='sb_publishable_ezHZ_co222B09HGiSeCkyw_Nw4G5FLB';
  const DATA_URL='https://exercise-dataset.com/exercises.json';
  const originalFetch=window.fetch.bind(window);
  const bodyParts={chest:'chest',pectoralis_major:'chest',pectoralis_minor:'chest',back:'back',latissimus_dorsi:'back',trapezius:'back',rhomboids:'back',shoulders:'shoulders',deltoids:'shoulders',anterior_deltoid:'shoulders',lateral_deltoid:'shoulders',rear_deltoid:'shoulders',biceps:'upper_arms',brachialis:'upper_arms',triceps:'upper_arms',forearms:'lower_arms',quadriceps:'upper_legs',hamstrings:'upper_legs',gluteus_maximus:'upper_legs',glutes:'upper_legs',adductors:'upper_legs',abductors:'upper_legs',calves:'lower_legs',tibialis_anterior:'lower_legs',rectus_abdominis:'core',obliques:'core',transverse_abdominis:'core',core:'core',hip_flexors:'core',neck:'neck'};
  function part(muscles){for(const m of (muscles||[]))if(bodyParts[m])return bodyParts[m];return 'core'}
  function toRepDb(rows){return {exercises:(rows||[]).map(e=>({id:e.slug||String(e.id),name_en:e.name||e.slug||String(e.id),description_en:e.description||'',primary_muscles:e.muscles||[],secondary_muscles:[],equipment:e.equipment||'',difficulty:e.level||'',instructions_en:e.instructions||[],tips_en:e.tips||[],body_part:part(e.muscles),images:{flat:{start:e.media_url||'',main:e.media_url||''}}}))}}

  // Point important : pas de seconde bibliothèque ni de seconde traduction côté client.
  // L'admin et le client affichent exactement les champs enregistrés dans Supabase.
  window.translatedExercise=function(e){
    return {
      name:e.name_en||e.name||'',
      description:e.description_en||e.description||'',
      instructions:Array.isArray(e.instructions_en)?e.instructions_en:(Array.isArray(e.instructions)?e.instructions:[]),
      tips:Array.isArray(e.tips_en)?e.tips_en:(Array.isArray(e.tips)?e.tips:[])
    };
  };

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url===DATA_URL){
      try{
        const r=await originalFetch(SUPABASE_URL+'/rest/v1/exercises?select=*&is_published=eq.true&order=name',{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
        if(!r.ok)throw new Error('Supabase HTTP '+r.status);
        return new Response(JSON.stringify(toRepDb(await r.json())),{status:200,headers:{'Content-Type':'application/json'}});
      }catch(err){console.error('Bibliothèque Supabase indisponible',err);return originalFetch(input,init)}
    }
    return originalFetch(input,init)
  };
  function installOpenFix(){
    const original=window.openExercise;
    if(typeof original!=='function'||original.__hsFixed)return;
    const fixed=function(id,updateUrl=true){const normalized=String(id).match(/^\d+$/)?Number(id):id;return original(normalized,updateUrl)};
    fixed.__hsFixed=true;window.openExercise=fixed;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installOpenFix,{once:true});else installOpenFix();
})();
