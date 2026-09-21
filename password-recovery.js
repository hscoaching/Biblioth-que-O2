/* HS Coaching — récupération de mot de passe */
(function(){
  const SUPA='https://hcjoagpkgpqxgzjdyfvd.supabase.co';
  const KEY='sb_publishable_ezHZ_co222B09HGiSeCkyw_Nw4G5FLB';
  let sb=null;
  function mount(){
    if(document.getElementById('passwordRecovery')) return;
    const box=document.createElement('section');
    box.id='passwordRecovery';
    box.className='card';
    box.style.cssText='position:relative;z-index:20';
    box.innerHTML=
      '<p class="eyebrow">NOUVEAU MOT DE PASSE</p>'+
      '<div class="field"><label>Nouveau mot de passe</label><input id="recoveryPassword" class="input" type="password" autocomplete="new-password" placeholder="8 caractères minimum"></div>'+
      '<div class="field"><label>Confirmer le mot de passe</label><input id="recoveryPassword2" class="input" type="password" autocomplete="new-password" placeholder="Retape ton mot de passe"></div>'+
      '<button id="recoveryBtn" class="btn primary" type="button">Enregistrer mon nouveau mot de passe</button>'+
      '<div id="recoveryMsg" class="msg"></div>';
    const auth=document.getElementById('authCard');
    if(auth) auth.parentNode.insertBefore(box,auth);
    else document.querySelector('main')?.appendChild(box);
    document.getElementById('recoveryBtn').addEventListener('click',update);
  }
  function message(t,ok){
    const m=document.getElementById('recoveryMsg');
    if(!m)return;
    m.textContent=t;m.className='msg show '+(ok?'ok':'error');
  }
  async function update(){
    const p=document.getElementById('recoveryPassword').value;
    const p2=document.getElementById('recoveryPassword2').value;
    if(p.length<8)return message('Choisis un mot de passe d’au moins 8 caractères.');
    if(p!==p2)return message('Les deux mots de passe ne correspondent pas.');
    const {error}=await sb.auth.updateUser({password:p});
    if(error)return message(error.message);
    message('Mot de passe modifié avec succès ✅ Tu peux maintenant te connecter.',true);
    setTimeout(async()=>{
      await sb.auth.signOut();
      location.href=location.origin+location.pathname;
    },900);
  }
  async function init(){
    if(!window.supabase)return;
    sb=window.supabase.createClient(SUPA,KEY);
    sb.auth.onAuthStateChange((event)=>{
      if(event==='PASSWORD_RECOVERY') show();
    });
    const hash=new URLSearchParams((location.hash||'').replace(/^#/,''));
    const type=hash.get('type');
    if(type==='recovery'){
      await new Promise(r=>setTimeout(r,150));
      const {data}=await sb.auth.getSession();
      if(data.session) show();
    }
  }
  function show(){
    mount();
    document.getElementById('authCard')?.classList.add('hidden');
    document.getElementById('accountCard')?.classList.add('hidden');
    document.getElementById('passwordRecovery').scrollIntoView({behavior:'smooth',block:'center'});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();