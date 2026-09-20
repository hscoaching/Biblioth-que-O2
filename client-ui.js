/* HS Coaching — navigation client + notifications */
(function(){
  const rawPath=location.pathname.split('/').pop().toLowerCase();
  const path=(!rawPath||rawPath==='index.html')?'index.html':rawPath;
  const nav=[['index.html','Accueil'],['programmes.html','Programmes'],['compte.html','Mon compte']];
  const style=document.createElement('style');style.textContent=`
.hs-client-nav{position:static;z-index:100;display:flex;align-items:center;gap:4px;padding:4px;margin:0 12px 0 auto;background:rgba(11,11,11,.94);backdrop-filter:blur(14px);border:1px solid #252525;border-radius:10px;box-shadow:0 8px 30px #0005;width:max-content;max-width:calc(100% - 12px)}
.hs-client-nav a{position:relative;flex:0 0 auto;color:#777;text-decoration:none;text-align:center;padding:7px 10px;border-radius:7px;font-size:10px;font-weight:900;white-space:nowrap}.hs-client-nav a.active{background:#fff !important;color:#000 !important}.hs-client-badge{position:absolute;top:3px;right:18%;min-width:15px;height:15px;padding:0 4px;border-radius:99px;background:#fff;color:#000;border:2px solid #111;font-size:8px;line-height:11px}
@media(max-width:650px){.hs-client-nav{margin:0 8px 0 auto;gap:3px;padding:3px}.hs-client-nav a{padding:7px 6px;font-size:9px}.hs-client-badge{right:8%}}
`;document.head.appendChild(style);
  function mountNav(){if(document.querySelector('.hs-client-nav'))return;const top=document.querySelector('.topbar');const navEl=document.createElement('nav');navEl.className='hs-client-nav';nav.forEach(([href,label])=>{const a=document.createElement('a');a.href=href;a.textContent=label;if(href===path)a.className='active';navEl.appendChild(a)});if(top){top.appendChild(navEl)}else{document.body.insertBefore(navEl,document.body.firstChild)}}
  async function protectTestMode(){
    if(path!=='compte.html')return;
    const testBox=document.getElementById('testAccess');
    if(testBox)testBox.remove();
    try{
      const cfg=window.HS_SUPABASE_CONFIG;
      if(!cfg||!window.supabase)return;
      const sb=window.supabase.createClient(cfg.url,cfg.key);
      const r=await sb.auth.getUser();
      const user=r.data?.user;
      if(!user){localStorage.removeItem('hs_test_client_mode');return}
      const a=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
      if(!a.data)localStorage.removeItem('hs_test_client_mode');
    }catch(e){localStorage.removeItem('hs_test_client_mode')}
  }
  function init(){mountNav();protectTestMode()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();