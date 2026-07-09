const app = document.querySelector("#app");
const icon = (d) => `<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icons = {
  back: icon('<path d="m15 18-6-6 6-6"/>'),
  refresh: icon('<path d="M20 11a8 8 0 1 1-2.3-5.7M20 4v7h-7"/>'),
  shirt: icon('<path d="M20 7 16 5l-2-3h-4L8 5 4 7l2 5 2-1v9h8v-9l2 1z"/>'),
  camera: icon('<path d="M14.5 5 16 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3l1.5-3z"/><circle cx="12" cy="14" r="3"/>'),
  ruler: icon('<path d="m16 2 6 6L8 22l-6-6zM7 11l2 2m2-6 2 2m2-6 2 2"/>'),
  plus: icon('<path d="M5 12h14M12 5v14"/>'),
  check: icon('<path d="m20 6-11 11-5-5"/>'),
  sparkle: icon('<path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4z"/>'),
  close: icon('<path d="M18 6 6 18M6 6l12 12"/>')
};

app.innerHTML = `
<main class="app-shell">
  <header class="topbar"><button class="icon-btn ghost">${icons.back}</button><div class="brand"><span class="brand-mark">P</span><div><strong>PetForm</strong><small>我的宠物数字分身</small></div></div><button class="icon-btn ghost" id="reset-view">${icons.refresh}</button></header>
  <section class="stage"><canvas id="pet-canvas"></canvas><div class="stage-status"><span></span>数字分身 · 已同步</div><div class="pet-switch"><button class="active" data-pet="dog">小狗</button><button data-pet="cat">小猫</button></div><div class="view-hint">单指旋转 · 双指缩放</div><button class="remove-cloth hidden" id="remove-cloth">${icons.close} 脱下</button></section>
  <nav class="tabs"><button class="active" data-tab="wardrobe">${icons.shirt}<span>试衣间</span></button><button data-tab="capture">${icons.camera}<span>建模</span></button><button data-tab="profile">${icons.ruler}<span>尺寸</span></button></nav>
  <section class="panel active" id="wardrobe">
    <div class="section-heading"><div><small>VIRTUAL FITTING</small><h2>今天穿什么？</h2></div><button class="add-product" id="show-import">${icons.plus} 导入商品</button></div>
    <div class="garment-list">
      <button class="garment active" data-cloth="none"><span class="empty-look">${icons.sparkle}</span><strong>原生毛发</strong><small>不穿衣服</small></button>
      <button class="garment" data-cloth="rain"><span class="garment-art raincoat"><b></b></span><strong>柠檬雨衣</strong><small>防水外套</small></button>
      <button class="garment" data-cloth="knit"><span class="garment-art knit"><b></b></span><strong>红格针织</strong><small>柔软毛衣</small></button>
      <button class="garment" data-cloth="denim"><span class="garment-art denim"><b></b></span><strong>复古背带</strong><small>牛仔外套</small></button>
    </div>
    <div class="fit-note">${icons.check}<span><strong>尺寸匹配良好</strong><small>基于胸围 42 cm · 背长 36 cm</small></span></div>
  </section>
  <section class="panel" id="capture">
    <div class="section-heading"><div><small>PHOTO CAPTURE</small><h2>拍摄各个角度</h2></div><span class="progress"><b id="photo-count">0</b>/6</span></div>
    <div class="photo-grid">${["正面","左侧","右侧","背面","俯视","头部"].map((x,i)=>`<label class="photo-slot"><input type="file" accept="image/*" capture="environment" data-photo="${i}">${icons.camera}<span>${x}</span></label>`).join("")}</div>
    <button class="primary-btn" id="generate-model" disabled>${icons.sparkle} 生成数字分身</button>
  </section>
  <section class="panel" id="profile">
    <div class="section-heading"><div><small>BODY PROFILE</small><h2>身形尺寸</h2></div><span class="unit">单位：cm</span></div>
    <div class="measurements"><label><span>胸围</span><input type="number" id="chest" value="42"></label><label><span>背长</span><input type="number" id="back" value="36"></label><label><span>颈围</span><input type="number" id="neck" value="28"></label><label><span>体重</span><div><input type="number" id="weight" value="8.5" step=".1"><em>kg</em></div></label></div>
    <button class="primary-btn" id="apply-size">${icons.check} 保存并更新模型</button>
  </section>
  <dialog id="import-dialog"><button class="dialog-close icon-btn">${icons.close}</button><small>PRODUCT IMPORT</small><h2>导入宠物服装</h2><p>粘贴商品链接，系统将提取服装图片与尺码信息。</p><label class="url-field">${icons.plus}<input id="product-url" placeholder="https://..." inputmode="url"></label><button class="primary-btn" id="import-product">提取商品</button><p class="legal">仅导入你有权使用的商品信息；正式接入需遵守购物平台开放接口与版权规则。</p></dialog>
  <div class="toast" id="toast"></div>
</main>`;

const canvas = document.querySelector("#pet-canvas");
const ctx = canvas.getContext("2d");
let angle = -.35, zoom = 1, petType = "dog", clothing = "none", dragging = false, lastX = 0, pinch = 0;
let scale = {x:1,y:1,z:1};

function projected(p,w,h) {
  const c=Math.cos(angle),s=Math.sin(angle),x=p.x*c-p.z*s,z=p.x*s+p.z*c,u=Math.min(w,h)*.13*zoom,k=1+z*.035;
  return {...p,x:w/2+x*u,y:h*.5-p.y*u,z,rx:p.rx*u*k,ry:p.ry*u*k};
}
function oval(p) {
  const g=ctx.createRadialGradient(p.x-p.rx*.28,p.y-p.ry*.32,2,p.x,p.y,Math.max(p.rx,p.ry));
  g.addColorStop(0,p.light||"#edb37d");g.addColorStop(.65,p.color);g.addColorStop(1,p.dark||"#87472e");
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p.x,p.y,Math.abs(p.rx),Math.abs(p.ry),0,0,Math.PI*2);ctx.fill();
}
function render() {
  const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);
  if(canvas.width!==Math.round(r.width*d)||canvas.height!==Math.round(r.height*d)){canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d)}
  ctx.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height;
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#efeee8");bg.addColorStop(1,"#d8d6cd");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#88857a33";ctx.beginPath();ctx.ellipse(w/2,h*.79,w*.28,h*.045,0,0,Math.PI*2);ctx.fill();
  const a=scale.x,b=scale.y,c=scale.z;
  let parts=[
    {x:-1.05*a,y:-1.02*b,z:-.5*c,rx:.22,ry:.8,color:"#a85e36"},{x:-1.05*a,y:-1.02*b,z:.5*c,rx:.22,ry:.8,color:"#c97745"},
    {x:.68*a,y:-1.02*b,z:-.5*c,rx:.22,ry:.82,color:"#a85e36"},{x:.68*a,y:-1.02*b,z:.5*c,rx:.22,ry:.82,color:"#ce8250"},
    {x:0,y:0,z:0,rx:1.58*a,ry:1.02*b,color:"#c77b48"},{x:.78*a,y:.08*b,z:0,rx:.7,ry:.95*b,color:"#e0bd94",light:"#f0d4b0"},
    {x:1.42*a,y:1.02*b,z:0,rx:.82,ry:.78,color:"#ca804d"}];
  if(petType==="dog")parts.push({x:1.3*a,y:1.42*b,z:-.55*c,rx:.3,ry:.62,color:"#574037",dark:"#28211f"},{x:1.3*a,y:1.42*b,z:.55*c,rx:.3,ry:.62,color:"#574037",dark:"#28211f"});
  parts.map(p=>projected(p,w,h)).sort((m,n)=>m.z-n.z).forEach(oval);
  if(petType==="cat")[-1,1].forEach(side=>{const p=projected({x:1.35*a,y:1.72*b,z:side*.48*c,rx:.36,ry:.65},w,h);ctx.fillStyle="#b86e40";ctx.beginPath();ctx.moveTo(p.x-p.rx,p.y+p.ry*.45);ctx.lineTo(p.x,p.y-p.ry);ctx.lineTo(p.x+p.rx,p.y+p.ry*.45);ctx.fill()});
  if(clothing!=="none"){const colors={rain:["#e5c92f","#9e8110"],knit:["#a83f3d","#652321"],denim:["#416d84","#294956"]}[clothing],p=projected({x:-.08*a,y:.02*b,z:0,rx:1.45*a,ry:.93*b},w,h),g=ctx.createLinearGradient(p.x,p.y-p.ry,p.x,p.y+p.ry);g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);ctx.fill();if(clothing==="knit"){ctx.strokeStyle="#efd8bf66";for(let y=p.y-p.ry*.6;y<p.y+p.ry*.7;y+=9){ctx.beginPath();ctx.moveTo(p.x-p.rx*.8,y);ctx.lineTo(p.x+p.rx*.8,y);ctx.stroke()}}}
  oval({...projected({x:2.02*a,y:.8*b,z:0,rx:.47,ry:.37},w,h),color:"#e1bf98",light:"#f2dac0"});
  [-1,1].forEach(side=>oval({...projected({x:1.9*a,y:1.18*b,z:side*.4*c,rx:.075,ry:.085},w,h),color:"#211d1b",light:"#594b42",dark:"#000"}));
  oval({...projected({x:2.4*a,y:.84*b,z:0,rx:.13,ry:.11},w,h),color:"#251f1d",light:"#5b4b44",dark:"#030303"});
  requestAnimationFrame(render);
}
render();

canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(dragging){angle+=(e.clientX-lastX)*.012;lastX=e.clientX}});
canvas.addEventListener("pointerup",()=>dragging=false);
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom=Math.max(.75,Math.min(1.35,zoom-e.deltaY*.001))},{passive:false});
canvas.addEventListener("touchmove",e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)zoom=Math.max(.75,Math.min(1.35,zoom+(d-pinch)*.004));pinch=d}},{passive:true});
canvas.addEventListener("touchend",()=>pinch=0);

document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===b.dataset.tab))});
document.querySelectorAll("[data-pet]").forEach(b=>b.onclick=()=>{petType=b.dataset.pet;document.querySelectorAll("[data-pet]").forEach(x=>x.classList.toggle("active",x===b))});
document.querySelectorAll("[data-cloth]").forEach(b=>b.onclick=()=>{clothing=b.dataset.cloth;document.querySelectorAll("[data-cloth]").forEach(x=>x.classList.toggle("active",x===b));document.querySelector("#remove-cloth").classList.toggle("hidden",clothing==="none")});
document.querySelector("#remove-cloth").onclick=()=>document.querySelector('[data-cloth="none"]').click();
document.querySelector("#reset-view").onclick=()=>{angle=-.35;zoom=1};
document.querySelector("#apply-size").onclick=()=>{scale={x:+back.value/36,y:Math.max(.8,Math.min(1.3,Math.sqrt(+weight.value/8.5))),z:+chest.value/42};document.querySelector(".fit-note small").textContent=`基于胸围 ${chest.value} cm · 背长 ${back.value} cm`;notify("身形数据已更新")};
const photos=[...document.querySelectorAll("[data-photo]")];
photos.forEach(input=>input.onchange=()=>{if(!input.files[0])return;const slot=input.closest(".photo-slot");slot.style.backgroundImage=`linear-gradient(#0002,#0002),url("${URL.createObjectURL(input.files[0])}")`;slot.classList.add("filled");slot.querySelector("span").textContent="已拍摄";const n=photos.filter(x=>x.files.length).length;document.querySelector("#photo-count").textContent=n;document.querySelector("#generate-model").disabled=n<4});
document.querySelector("#generate-model").onclick=e=>{e.currentTarget.disabled=true;e.currentTarget.innerHTML='<span class="spinner"></span> 正在生成模型...';setTimeout(()=>{e.currentTarget.innerHTML=icons.check+" 数字分身已生成";notify("模型生成完成，可以旋转查看");setTimeout(()=>document.querySelector('[data-tab="wardrobe"]').click(),600)},1400)};
const dialog=document.querySelector("#import-dialog");
document.querySelector("#show-import").onclick=()=>dialog.showModal();document.querySelector(".dialog-close").onclick=()=>dialog.close();
document.querySelector("#import-product").onclick=()=>{if(!/^https?:\/\//.test(document.querySelector("#product-url").value.trim()))return notify("请输入有效的商品链接");dialog.close();notify("商品已提交提取，后端接口待接入")};
function notify(message){const t=document.querySelector("#toast");t.textContent=message;t.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove("show"),2200)}
