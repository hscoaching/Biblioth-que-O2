/* HS Coaching — Responsive O2
   Passe responsive : téléphone + tablette + ordinateur.
   Aucun changement de données ou de logique métier.
*/
(function(){
  const style=document.createElement('style');
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    img,video,canvas{max-width:100%}
    button,input,textarea,select{max-width:100%}
    .container{width:100%;max-width:1100px}
    .topbar{min-width:0}
    .brand,.nav,.topnav{min-width:0}
    .nav,.topnav{flex-wrap:wrap}
    .section-head{min-width:0}
    .card-media .media-frame,.modal-media .media-frame{max-width:100%;}
    .card-media .media-frame img,.modal-media .media-frame img,
    .card-media .media-frame video,.modal-media .media-frame video{max-width:100%;max-height:100%;}
    .admin .panel,.admin .editor,.admin .item,.admin .item-row,.admin .item-main{min-width:0;max-width:100%}
    .admin .item-main strong{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-overflow:ellipsis}
    .admin .item-actions .btn{min-width:0;white-space:normal;line-height:1.2}
    .admin .actions,.admin .tabs,.admin .filter{min-width:0}
    @media(min-width:1101px){.container{padding-left:22px;padding-right:22px}}
    @media(max-width:900px){.container{padding-left:18px;padding-right:18px}.hero{max-width:100%}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.admin .stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:650px){
      .topbar{height:auto;min-height:64px;padding:8px 0}.brand{padding-left:12px;gap:8px;flex:1;min-width:0}.brand>div{min-width:0}.brand strong,.brand small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav{margin:0 8px 0 6px!important;gap:3px!important;flex:0 0 auto}.nav a{padding:8px 8px!important;font-size:10px!important}.container{padding-left:12px;padding-right:12px}.hero{padding:32px 0 24px}.hero h1{font-size:clamp(38px,12vw,48px);letter-spacing:-2px}.hero p:not(.eyebrow){font-size:13px}.search{width:100%;max-width:100%;position:static;box-shadow:none}.search input{min-width:0;width:100%}.categories{width:100%;max-width:100%;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden}.section-head{gap:8px}.section-head h2{min-width:0}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.card{min-width:0}.card-media .media-frame{height:auto;aspect-ratio:1 / 1;min-height:120px}.card h3{overflow-wrap:anywhere}.hs-card-equipment{white-space:normal;overflow-wrap:anywhere}dialog{width:calc(100% - 12px);max-width:680px;padding:20px 14px}.modal h2{font-size:26px;line-height:1.08;overflow-wrap:anywhere}.modal-media{padding:7px}.modal-media .media-frame{height:auto;aspect-ratio:1 / 1;min-height:210px}.modal-media.media-pair .media-a,.modal-media.media-pair .media-b{height:100%!important}.admin{padding:18px 0 60px}.admin .panel{padding:14px;border-radius:14px;margin:12px 0}.admin .stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.admin .stat{padding:10px 7px;min-width:0}.admin .stat strong{font-size:20px;overflow:hidden;text-overflow:ellipsis}.admin .stat span{font-size:10px;line-height:1.2}.admin .tabs,.admin .filter,.admin .actions{gap:6px}.admin .tab,.admin .filter button,.admin .btn{padding:10px 11px;font-size:12px}.admin .item{gap:9px;padding:10px}.admin .item-row{gap:9px}.admin .item-visual{width:58px;height:52px;flex-basis:58px}.admin .item-actions{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.admin .item-actions .btn{width:100%;min-height:42px;padding:9px 6px}.admin .grid2{grid-template-columns:minmax(0,1fr)}.admin .field{min-width:0}.admin .field input,.admin .field textarea,.admin .field select{min-height:44px;font-size:16px}.admin .editor{padding:13px}.admin .preview img,.admin .preview video{height:auto;aspect-ratio:16 / 9;object-fit:contain}.admin .topnav{margin-left:6px;gap:3px;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap}.admin .topnav a{padding:7px 7px;font-size:10px;flex:0 0 auto}
    }
    @media(max-width:390px){.brand-mark{width:32px;height:32px}.brand strong{font-size:11px}.brand small{font-size:9px}.nav a{padding:7px 6px!important;font-size:9px!important}.container{padding-left:10px;padding-right:10px}.grid{gap:7px}.card-media .tag,.card-media h3,.card-media p,.card-media .hs-card-equipment{margin-left:10px;margin-right:10px}.card h3{font-size:14px}.hs-card-equipment{max-width:calc(100% - 20px)}.admin .stats{gap:5px}.admin .stat{padding:9px 5px}.admin .stat strong{font-size:18px}.admin .tab,.admin .filter button,.admin .btn{font-size:11px;padding:9px 8px}.admin .item-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  // Admin : le même éditeur sert à modifier ET créer un exercice.
  if(document.querySelector('.admin')){
    const originalSave=window.saveEdit;
    window.saveEdit=async function(id){
      const payload={
        name:document.getElementById('en')?.value.trim()||'',
        equipment:document.getElementById('ee')?.value.trim()||null,
        description:document.getElementById('ed')?.value.trim()||null,
        muscles:(document.getElementById('em')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),
        instructions:(document.getElementById('ei')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean),
        tips:(document.getElementById('et')?.value||'').split('\n').map(x=>x.trim()).filter(Boolean)
      };
      const status=document.getElementById('dashStatus');
      if(!payload.name){if(status)status.textContent='Le nom de l’exercice est obligatoire.';return}
      if(id==null){
        const slugBase=payload.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'exercice';
        const slug=slugBase+'-'+Date.now().toString(36);
        const r=await sb.from('exercises').insert({...payload,slug,is_published:false}).select().single();
        if(r.error){if(status)status.textContent=r.error.message;return}
        if(status)status.textContent='Exercice créé ✓ Il est enregistré en brouillon.';
        window.closeEditor();
        await window.__hsAdminReload?.();
        return;
      }
      if(typeof originalSave==='function')return originalSave(id);
    };
    const start=window.load;
    if(typeof start==='function')window.__hsAdminReload=start;
  }
})();
