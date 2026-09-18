/* HS Coaching — navigation client + notifications */
(function(){
  const path=(location.pathname.split('/').pop()||'compte.html').toLowerCase();
  const nav=[
    ['compte.html','Accueil','⌂'],
    ['mes-programmes.html','Programmes','▣'],
    ['progression-simple.html','Progression','↗'],
    ['mon-coach.html','Mon coach','✉']
  ];
  const style=document.createElement('style');
  style.textContent=`
.hs-client-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;gap:4px;padding:7px;margin:-8px 0 18px;background:rgba(11,11,11,.94);backdrop-filter:blur(14px);border:1px solid #252525;border-radius:14px;box-shadow:0 8px 30px #0005}
.hs-client-nav a{position:relative;flex:1;color:#777;text-decoration:none;text-align:center;padding:9px 7px;border-radius:9px;font-size:10px;font-weight:900;white-space:nowrap}
.hs-client-nav a.active{background:#fff;color:#000}
.hs-client-nav .ico{font-size:13px;margin-right:4px}
.hs-client-badge{position:absolute;top:3px;right:18%;min-width:15px;height:15px;padding:0 4px;border-radius:99px;background:#fff;color:#000;border:2px solid #111;font-size:8px;line-height:11px}
.hs-client-alert{margin:0 0 12px;padding:11px 13px;border:1px solid #333;border-radius:12px;background:#141414;color:#fff;font-size:10px;line-height:1.45}
.hs-client-alert strong{display:block;font-size:11px;margin-bottom:3px}
@media(max-width:520px){.hs-client-nav{margin:-8px 0 14px}.hs-client-nav a{padding:8px 3px;font-size:9px}.hs-client-nav .ico{display:block;margin:0 0 2px;font-size:14px}.hs-client-badge{right:12%}}
`;
  document.head.appendChild(style);
  const navEl=document.createElement('nav');navEl.className='hs-client-nav';navEl.setAttribute('aria-label','Navigation client');
  nav.forEach(([href,label,ico])=>{
    const a=document.createElement('a');a.href=href;a.className=path===href?'active':'';
    a.innerHTML='<span class="ico">'+ico+'</span>'+label;
    if(href==='mon-coach.html'){const b=document.createElement('span');b.className='hs-client-badge';b.hidden=true;a.appendChild(b)}
    navEl.appendChild(a);
  });
  const first=document.body.firstElementChild;
  if(first) first.prepend(navEl); else document.body.prepend(navEl);

  function addAlert(title,body,href){
    if(document.querySelector('.hs-client-alert'))return;
    const a=document.createElement('a');a.className='hs-client-alert';a.href=href||'mon-coach.html';a.style.textDecoration='none';a.style.display='block';
    a.innerHTML='<strong>'+esc(title)+'</strong><span>'+esc(body)+'</span>';
    const target=document.querySelector('main')||document.body;
    target.insertBefore(a,target.firstChild);
  }
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  async function notifications(){
    if(localStorage.getItem('hs_test_client_mode')==='1'){
      const n=localStorage.getItem('hs_test_notification_v1');
      if(n){try{const x=JSON.parse(n);const badge=navEl.querySelector('.hs-client-badge');if(badge){badge.hidden=false;badge.textContent='1'}addAlert(x.title||'Nouveau message',x.body||'Une nouveauté est disponible.','mon-coach.html')}catch{}}
      return;
    }
    if(!window.supabase)return;
    try{
      const cfg=window.HS_SUPABASE_CONFIG;
      if(!cfg)return;
      const sb=window.supabase.createClient(cfg.url,cfg.key);
      const {data:{session}}=await sb.auth.getSession();if(!session)return;
      const {data,error}=await sb.from('client_notifications').select('id,title,body,type,data,created_at').eq('user_id',session.user.id).is('read_at',null).order('created_at',{ascending:false}).limit(10);
      if(error)return;
      const badge=navEl.querySelector('.hs-client-badge');
      if(badge&&data.length){badge.hidden=false;badge.textContent=data.length>9?'9+':String(data.length)}
      const latest=data[0];
      if(latest&&!path.includes('mon-coach'))addAlert(latest.title||'Nouveau message',latest.body||'Une nouveauté est disponible.',latest.type==='program'?'mes-programmes.html':'mon-coach.html');
      if(path==='mon-coach.html'&&data.length){await sb.from('client_notifications').update({read_at:new Date().toISOString()}).in('id',data.map(x=>x.id))}
    }catch(e){console.warn('HS notifications',e)}
  }
  window.HSClientRefreshNotifications=notifications;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',notifications,{once:true});else notifications();
})();