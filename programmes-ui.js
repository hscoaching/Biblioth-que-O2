(function(){
  const style=document.createElement('style');
  style.textContent=`
    #detail .program-session-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin:28px 0 10px;padding:16px 16px 12px;border:1px solid #292929;border-radius:14px;background:#151515}
    #detail .program-session-title{min-width:0}
    #detail .program-session-title h3{border:0!important;padding:0!important;margin:0!important;font-size:18px!important;line-height:1.25}
    #detail .program-session-title p{margin:6px 0 0;color:#777;font-size:12px}
    #detail .program-session-count{flex:0 0 auto;color:#777;font-size:11px;white-space:nowrap}
    #detail .program-exercises{border:1px solid #252525;border-radius:14px;overflow:hidden;background:#121212}
    #detail .exercise{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:12px;padding:13px 14px;border-bottom:1px solid #222;align-items:center;background:#121212;transition:background .15s ease}
    #detail .exercise:last-child{border-bottom:0}
    #detail .exercise:hover{background:#181818}
    #detail .exercise>span:first-child{width:28px;height:28px;display:grid;place-items:center;border:1px solid #303030;border-radius:8px;color:#777;font-size:11px}
    #detail .exercise-name{min-width:0}
    #detail .exercise-name strong{display:block;color:#f1f1f1;font-size:13px;line-height:1.35;font-weight:750;overflow-wrap:anywhere}
    #detail .exercise-main{display:flex;align-items:center;gap:7px;min-width:0}
    #detail .exercise-prescription{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap;text-align:right}
    #detail .exercise-prescription .primary{font-size:13px;font-weight:850;color:#fff;white-space:nowrap}
    #detail .exercise-detail{grid-column:2/-1;display:flex;gap:6px;flex-wrap:wrap;margin-top:-3px}
    #detail .exercise-detail span{font-size:10px;color:#aaa;background:#181818;border:1px solid #292929;border-radius:7px;padding:5px 7px;line-height:1.15}
    #detail .exercise-detail .training-field{color:#ddd}
    #detail .exercise-detail .note-field{color:#999;flex-basis:100%}
    #detail .group{font-size:9px;color:#fff;background:#242424;border:1px solid #333;border-radius:6px;padding:4px 6px;margin:0;white-space:nowrap}
    @media(max-width:600px){
      #detail .program-session-head{align-items:flex-start;margin-top:22px;padding:13px}
      #detail .program-session-title h3{font-size:16px!important}
      #detail .program-session-count{font-size:10px}
      #detail .program-exercises{border-radius:12px}
      #detail .exercise{grid-template-columns:26px minmax(0,1fr);gap:9px;padding:12px 10px}
      #detail .exercise>span:first-child{width:26px;height:26px}
      #detail .exercise-prescription{grid-column:2;justify-content:flex-start;text-align:left;margin-top:-3px}
      #detail .exercise-prescription .primary{font-size:12px}
      #detail .exercise-detail{grid-column:2;gap:5px}
      #detail .exercise-detail span{font-size:9px;padding:5px 6px}
    }
    @media(max-width:380px){
      #detail .program-session-head{display:block}
      #detail .program-session-count{display:block;margin-top:6px}
    }
  `;
  document.head.appendChild(style);

  function enhance(){
    const detail=document.getElementById('detail');
    if(!detail || !detail.children.length) return;
    detail.querySelectorAll('.session').forEach(session=>{
      if(session.dataset.uiEnhanced==='1') return;
      session.dataset.uiEnhanced='1';
      const h3=session.querySelector(':scope > h3');
      if(!h3) return;
      const note=session.querySelector(':scope > .note');
      const rows=[...session.querySelectorAll(':scope > .exercise')];
      const head=document.createElement('div');
      head.className='program-session-head';
      const title=document.createElement('div');
      title.className='program-session-title';
      const newH=document.createElement('h3');
      newH.textContent=h3.textContent;
      title.appendChild(newH);
      if(note){
        const p=document.createElement('p');
        p.textContent=note.textContent;
        title.appendChild(p);
        note.remove();
      }
      const count=document.createElement('span');
      count.className='program-session-count';
      count.textContent=rows.length+' exercice'+(rows.length>1?'s':'');
      head.append(title,count);
      h3.replaceWith(head);

      const wrap=document.createElement('div');
      wrap.className='program-exercises';
      rows.forEach(row=>{
        const direct=[...row.children];
        const number=direct[0];
        const name=direct[1];
        const oldStrong=direct[2];
        const oldSmall=direct[3];
        const details=row.querySelector('.exercise-detail');
        if(name){
          name.classList.add('exercise-name');
          const group=name.querySelector('.group');
          const text=name.textContent.trim();
          name.innerHTML='';
          const main=document.createElement('div');
          main.className='exercise-main';
          if(group) main.appendChild(group);
          const strong=document.createElement('strong');
          strong.textContent=text.replace(group?group.textContent:'','').trim();
          main.appendChild(strong);
          name.appendChild(main);
        }
        const prescription=document.createElement('div');
        prescription.className='exercise-prescription';
        const primary=document.createElement('span');
        primary.className='primary';
        const sets=oldStrong?.textContent.trim()||'';
        const rest=oldSmall?.textContent.trim()||'';
        primary.textContent=sets || '—';
        prescription.appendChild(primary);
        if(rest){
          const r=document.createElement('span');
          r.className='exercise-detail';
          r.innerHTML='<span>Repos '+rest.replace(/^Repos\s*/i,'')+'</span>';
          prescription.appendChild(r.firstElementChild);
        }
        if(oldStrong) oldStrong.remove();
        if(oldSmall) oldSmall.remove();
        row.appendChild(prescription);
        if(details){
          details.querySelectorAll('span').forEach(s=>{
            const t=s.textContent.trim();
            if(/^Tempo\s/i.test(t)||/^Charge\s/i.test(t)||/^Durée\s/i.test(t)) s.classList.add('training-field');
            if(!/^Repos\s/i.test(t) && !/^Tempo\s/i.test(t) && !/^Charge\s/i.test(t) && !/^Durée\s/i.test(t) && !/séries/i.test(t) && !/^\d/.test(t)) s.classList.add('note-field');
          });
        }
        wrap.appendChild(row);
      });
      rows.forEach(r=>r.remove());
      session.appendChild(wrap);
    });
  }

  const observer=new MutationObserver(()=>enhance());
  const start=()=>{
    const detail=document.getElementById('detail');
    if(detail){observer.observe(detail,{childList:true,subtree:true});enhance();}
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
