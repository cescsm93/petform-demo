(async()=>{
  try{
    const res=await fetch('./src/v31.js?v=32-core',{cache:'no-store'});
    if(!res.ok) throw new Error('v31 load failed');
    let source=await res.text();
    source=source
      .replace("const MODEL_URL='./model_assets/corgi_HP.obj?v=31';","const MODEL_URL='./assets/models/corgi_HP.obj?v=32';")
      .replaceAll('model_assets/corgi_HP.obj','assets/models/corgi_HP.obj')
      .replace('PetForm V31','PetForm V32')
      .replace('真实 OBJ 柯基白模','真实 OBJ 柯基白模');
    const blob=new Blob([source],{type:'text/javascript'});
    const script=document.createElement('script');
    script.src=URL.createObjectURL(blob);
    document.body.appendChild(script);
  }catch(e){
    const app=document.querySelector('#app');
    if(app) app.innerHTML='<main style="font-family:system-ui;padding:30px;line-height:1.7"><h2>PetForm V32</h2><p>加载失败，请刷新页面。</p></main>';
  }
})();
