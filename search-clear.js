(function(){
  const wrap=document.querySelector('.search'),input=document.querySelector('#search');
  if(!wrap||!input)return;
  const style=document.createElement('style');
  style.textContent='.search{position:relative}.search-clear{display:none;flex:0 0 32px;width:32px;height:32px;border:1px solid #303030;border-radius:50%;background:#202020;color:#aaa;font-size:20px;line-height:1;cursor:pointer;place-items:center;margin-left:8px}.search-clear.visible{display:grid}.search-clear:active{background:#fff;color:#000}@media(max-width:600px){.search-clear{width:30px;height:30px;font-size:18px}}';
  document.head.appendChild(style);
  const btn=document.createElement('button');btn.type='button';btn.className='search-clear';btn.setAttribute('aria-label','Effacer la recherche');btn.textContent='×';wrap.appendChild(btn);
  function sync(){btn.classList.toggle('visible',!!input.value)}
  btn.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();sync()});
  input.addEventListener('input',sync);sync();
})();