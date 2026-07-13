(async()=>{
  const res=await fetch('./src/v35.js?v=35-base',{cache:'no-store'});
  let src=await res.text();
  src=src.replaceAll('PetForm V35','PetForm V36');
  src=src.replaceAll("corgi_HP.obj?v=35","corgi_HP.obj?v=36");
  src=src.replaceAll('0xfffffff','0xffffff');
  new Function(src)();
})().catch(e=>{document.querySelector('#app').innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui;color:#333;background:#f7f4ed;text-align:center">V36 加载失败<br><small>'+String(e.message||e)+'</small></main>'});
