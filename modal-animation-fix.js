(function(){
  const content=document.querySelector('#modal-content');
  if(!content)return;

  function fix(){
    const pair=content.querySelector('.modal-media.media-pair');
    if(!pair)return;
    const images=[...pair.querySelectorAll('img.media-a,img.media-b')];
    if(images.length<2)return;

    images.forEach(img=>{
      img.loading='eager';
      img.setAttribute('loading','eager');
      img.decoding='async';
      img.style.visibility='visible';
    });

    const a=images[0],b=images[1];
    if(pair._hsForceAnim)clearInterval(pair._hsForceAnim);
    let showA=true;
    a.style.opacity='1';
    b.style.opacity='0';
    pair._hsForceAnim=setInterval(()=>{
      if(!document.body.contains(pair)){
        clearInterval(pair._hsForceAnim);
        pair._hsForceAnim=null;
        return;
      }
      showA=!showA;
      a.style.opacity=showA?'1':'0';
      b.style.opacity=showA?'0':'1';
    },900);
  }

  new MutationObserver(fix).observe(content,{childList:true,subtree:true});
  fix();
})();
