// Correctif de compatibilité iPhone/iPad : les IDs RepDB peuvent être numériques alors que data-id est une chaîne HTML.
(function(){
  const original=window.openExercise;
  if(typeof original!=='function')return;
  window.openExercise=function(id,updateUrl=true){
    const normalized=String(id).match(/^\d+$/)?Number(id):id;
    return original(normalized,updateUrl);
  };
})();
