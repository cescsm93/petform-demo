(() => {
  const css = document.createElement('style');
  css.textContent = `
    .pf26 .stage, .pf26 #viewer, .pf26 canvas { touch-action: none !important; overscroll-behavior: none !important; }
    .pf26 .stage { cursor: zoom-in; }
    .pf26.is-view-fullscreen { position: fixed; inset: 0; z-index: 9999; background: #d2d0c9; min-height: 100svh; overflow: hidden; }
    .pf26.is-view-fullscreen .topbar,
    .pf26.is-view-fullscreen .tabs,
    .pf26.is-view-fullscreen .panel { display: none !important; }
    .pf26.is-view-fullscreen .stage { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100svh !important; max-height: none !important; min-height: 0 !important; cursor: grab; }
    .pf26.is-view-fullscreen .badge { top: max(18px, env(safe-area-inset-top)); left: 18px; }
    .pf26.is-view-fullscreen .hint { bottom: max(18px, env(safe-area-inset-bottom)); }
    .pf26 .full-close { display: none; }
    .pf26.is-view-fullscreen .full-close { display:grid; place-items:center; position:fixed; top:max(16px, env(safe-area-inset-top)); right:16px; z-index:10002; width:42px; height:42px; border:0; border-radius:999px; background:rgba(255,255,255,.92); color:#2d2924; font-size:24px; line-height:1; box-shadow:0 14px 32px rgba(0,0,0,.18); }
  `;
  document.head.appendChild(css);

  async function loadPatchedCore() {
    try {
      const res = await fetch('./src/v26.js?v=30-core-closedmesh', { cache: 'no-store' });
      if (!res.ok) throw new Error('core fetch failed');
      let source = await res.text();
      const oldBody = "function bodyGeometry(L,W,H){const seg=34,rad=28,pos=[],idx=[];for(let i=0;i<=seg;i++){const t=i/seg,x=(t-.5)*2.55*L;const chest=Math.exp(-Math.pow((t-.34)/.2,2));const belly=Math.exp(-Math.pow((t-.62)/.18,2));const rump=Math.exp(-Math.pow((t-.8)/.18,2));const ry=(.38+.18*chest+.04*belly+.1*rump)*H;const rz=(.29+.16*chest-.04*belly+.08*rump)*W;const topline=.08*Math.sin((t-.1)*Math.PI);for(let j=0;j<rad;j++){const a=j/rad*Math.PI*2;const y=Math.sin(a)*ry+1.02+topline;const z=Math.cos(a)*rz;pos.push(x,y,z)}}for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*rad+j,b=i*rad+(j+1)%rad,c=(i+1)*rad+j,d=(i+1)*rad+(j+1)%rad;idx.push(a,c,b,b,c,d)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();return geo}";
      const newBody = "function bodyGeometry(L,W,H){const seg=48,rad=40,pos=[],idx=[];const ring=(i,j)=>i*rad+j;for(let i=0;i<=seg;i++){const t=i/seg,x=(t-.5)*2.55*L;const chest=Math.exp(-Math.pow((t-.34)/.2,2));const belly=Math.exp(-Math.pow((t-.62)/.18,2));const rump=Math.exp(-Math.pow((t-.8)/.18,2));const taper=.72+.28*Math.sin(Math.PI*t);const ry=(.35+.18*chest+.035*belly+.09*rump)*H*taper;const rz=(.27+.16*chest-.035*belly+.075*rump)*W*taper;const topline=.075*Math.sin((t-.08)*Math.PI);for(let j=0;j<rad;j++){const a=j/rad*Math.PI*2;const oval=1+.08*Math.cos(a);const y=Math.sin(a)*ry+1.02+topline;const z=Math.cos(a)*rz*oval;pos.push(x,y,z)}}for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=ring(i,j),b=ring(i,(j+1)%rad),c=ring(i+1,j),d=ring(i+1,(j+1)%rad);idx.push(a,c,b,b,c,d)}const start=pos.length/3,end=start+1;let sy=0,sz=0,ey=0,ez=0;for(let j=0;j<rad;j++){sy+=pos[ring(0,j)*3+1];sz+=pos[ring(0,j)*3+2];ey+=pos[ring(seg,j)*3+1];ez+=pos[ring(seg,j)*3+2]}pos.push(pos[0],sy/rad,sz/rad,pos[seg*rad*3],ey/rad,ez/rad);for(let j=0;j<rad;j++){idx.push(start,ring(0,(j+1)%rad),ring(0,j));idx.push(end,ring(seg,j),ring(seg,(j+1)%rad))}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();return geo}";
      const oldControls = "let drag=false,lastX=0,pinch=0;const dom=renderer.domElement;dom.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;dom.setPointerCapture?.(e.pointerId)});dom.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX;lastX=e.clientX;root.rotation.y+=dx*.01});dom.addEventListener('pointerup',()=>drag=false);dom.addEventListener('pointercancel',()=>drag=false);dom.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});dom.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);camera.zoom=clamp(camera.zoom+(d-pinch)*.004,.75,2.6);pinch=d;camera.updateProjectionMatrix()}},{passive:true});";
      const newControls = "const dom=renderer.domElement;const pointers=new Map();let lastSingleX=0,lastMid=null,lastDist=0;function getPoints(){return Array.from(pointers.values())}function midpoint(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}function worldPerPixel(){const r=viewer.getBoundingClientRect();return{sx:(camera.right-camera.left)/Math.max(1,r.width)/camera.zoom,sy:(camera.top-camera.bottom)/Math.max(1,r.height)/camera.zoom}}function remember(e){pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,type:e.pointerType})}function forget(e){pointers.delete(e.pointerId);const pts=getPoints();if(pts.length===1)lastSingleX=pts[0].x;if(pts.length<2){lastMid=null;lastDist=0}}dom.addEventListener('pointerdown',e=>{e.preventDefault();remember(e);dom.setPointerCapture?.(e.pointerId);const pts=getPoints();if(pts.length===1)lastSingleX=pts[0].x;if(pts.length>=2){lastMid=midpoint(pts[0],pts[1]);lastDist=distance(pts[0],pts[1])}}, {passive:false});dom.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();remember(e);const pts=getPoints();if(pts.length===1){const dx=pts[0].x-lastSingleX;lastSingleX=pts[0].x;root.rotation.y+=dx*.01;return}if(pts.length>=2){const mid=midpoint(pts[0],pts[1]),dist=distance(pts[0],pts[1]);if(lastMid){const w=worldPerPixel();root.position.x+=(mid.x-lastMid.x)*w.sx;root.position.y-=(mid.y-lastMid.y)*w.sy;root.position.x=clamp(root.position.x,-7.0,4.2);root.position.y=clamp(root.position.y,-3.0,5.2)}if(lastDist){camera.zoom=clamp(camera.zoom+(dist-lastDist)*.004,.45,2.8);camera.updateProjectionMatrix()}lastMid=mid;lastDist=dist}}, {passive:false});dom.addEventListener('pointerup',forget);dom.addEventListener('pointercancel',forget);dom.addEventListener('lostpointercapture',forget);dom.addEventListener('touchstart',e=>{if(e.touches.length>1)e.preventDefault()}, {passive:false});dom.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()}, {passive:false});";
      const oldCenter = "function centerDog(){dog.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(dog),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());dog.position.x+=-.38-c.x;dog.position.y+=1.62-c.y;dog.position.z-=c.z;root.scale.setScalar(clamp(3.55/Math.max(s.x,s.y*1.18),.78,1.25))}";
      const newCenter = "function centerDog(){dog.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(dog),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());const frames={toy:{x:-.38,y:1.62,fit:3.55,min:.78,max:1.25},hound:{x:-.82,y:1.78,fit:2.82,min:.62,max:1.0},french:{x:-.46,y:1.58,fit:3.22,min:.72,max:1.12},corgi:{x:-.88,y:1.66,fit:2.95,min:.64,max:1.05}};const f=frames[state.breed]||frames.toy;dog.position.x+=f.x-c.x;dog.position.y+=f.y-c.y;dog.position.z-=c.z;root.position.set(0,0,0);root.scale.setScalar(clamp(f.fit/Math.max(s.x,s.y*1.18),f.min,f.max))}";
      const oldLines = "function anatomyLines(b,L,W){add(new THREE.CapsuleGeometry(.018,1.1,6,10),lineMat,[.1,1.37,0],[1,1,1],[0,0,1.57]);add(new THREE.CapsuleGeometry(.016,.55,6,10),lineMat,[.58*L,1.22,.32*W],[1,1,1],[.25,0,.45]);add(new THREE.CapsuleGeometry(.016,.48,6,10),lineMat,[-.78*L,1.12,.3*W],[1,1,1],[-.2,0,-.35])}";
      source = source
        .replace('PetForm V26', 'PetForm V30')
        .replace('程序化解剖白模', '封口拓扑白模')
        .replace('单指旋转 · 双指缩放 · 程序生成白模', '封口网格 · 单指旋转 · 双指缩放/移动')
        .replace(oldBody, newBody)
        .replace(oldLines, 'function anatomyLines(b,L,W){}')
        .replace(oldCenter, newCenter)
        .replace(oldControls, newControls)
        .replace("reset.onclick=()=>{root.rotation.y=.35;camera.zoom=1;camera.updateProjectionMatrix()};", "reset.onclick=()=>{root.rotation.y=.35;root.position.set(0,0,0);camera.zoom=1;camera.updateProjectionMatrix()};");
      const blob = new Blob([source], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      script.onload = installFullscreen;
      document.body.appendChild(script);
    } catch (error) {
      const app = document.querySelector('#app');
      if (app) app.innerHTML = '<main class="pf26"><header class="topbar"><div class="brand"><span class="mark">P</span><div><strong>PetForm V30</strong><small>封口拓扑白模</small></div></div></header><section class="stage"><div class="loading">3D 核心加载失败，请刷新页面</div></section></main>';
    }
  }

  function installFullscreen() {
    const install = () => {
      const main = document.querySelector('.pf26');
      const stage = document.querySelector('.pf26 .stage');
      const brand = document.querySelector('.pf26 .brand strong');
      const sub = document.querySelector('.pf26 .brand small');
      const hint = document.querySelector('.pf26 .hint');
      if (!main || !stage || main.dataset.fullscreenReady) return false;
      main.dataset.fullscreenReady = '1';
      if (brand) brand.textContent = 'PetForm V30';
      if (sub) sub.textContent = '封口拓扑白模';
      if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放/移动';
      const close = document.createElement('button');
      close.className = 'full-close'; close.type = 'button'; close.setAttribute('aria-label', '退出全屏'); close.textContent = '×'; main.appendChild(close);
      let sx = 0, sy = 0, moved = false, multi = false;
      stage.addEventListener('pointerdown', (event) => { sx = event.clientX; sy = event.clientY; moved = false; multi = event.isPrimary === false; }, { passive: true });
      stage.addEventListener('pointermove', (event) => { if (Math.hypot(event.clientX - sx, event.clientY - sy) > 10) moved = true; }, { passive: true });
      stage.addEventListener('pointerup', () => { if (!moved && !multi && !main.classList.contains('is-view-fullscreen')) { main.classList.add('is-view-fullscreen'); if (hint) hint.textContent = '全屏预览 · 单指旋转 · 双指缩放/移动'; window.dispatchEvent(new Event('resize')); setTimeout(() => window.dispatchEvent(new Event('resize')), 80); } }, { passive: true });
      close.addEventListener('click', (event) => { event.stopPropagation(); main.classList.remove('is-view-fullscreen'); if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放/移动'; window.dispatchEvent(new Event('resize')); setTimeout(() => window.dispatchEvent(new Event('resize')), 80); });
      return true;
    };
    if (!install()) {
      let tries = 0;
      const timer = setInterval(() => { tries += 1; if (install() || tries > 30) clearInterval(timer); }, 150);
    }
  }
  loadPatchedCore();
})();
