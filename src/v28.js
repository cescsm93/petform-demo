(() => {
  const css = document.createElement('style');
  css.textContent = `
    .pf26 .stage { cursor: zoom-in; }
    .pf26.is-view-fullscreen { position: fixed; inset: 0; z-index: 9999; background: #d2d0c9; min-height: 100svh; overflow: hidden; }
    .pf26.is-view-fullscreen .topbar,
    .pf26.is-view-fullscreen .tabs,
    .pf26.is-view-fullscreen .panel { display: none !important; }
    .pf26.is-view-fullscreen .stage { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100svh !important; max-height: none !important; min-height: 0 !important; cursor: grab; }
    .pf26.is-view-fullscreen .badge { top: max(18px, env(safe-area-inset-top)); left: 18px; }
    .pf26.is-view-fullscreen .hint { bottom: max(18px, env(safe-area-inset-bottom)); }
    .pf26 .full-close { display: none; }
    .pf26.is-view-fullscreen .full-close {
      display: grid;
      place-items: center;
      position: fixed;
      top: max(16px, env(safe-area-inset-top));
      right: 16px;
      z-index: 10002;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      color: #2d2924;
      font-size: 24px;
      line-height: 1;
      box-shadow: 0 14px 32px rgba(0,0,0,.18);
    }
  `;
  document.head.appendChild(css);

  async function loadPatchedCore() {
    try {
      const res = await fetch('./src/v26.js?v=28-core', { cache: 'no-store' });
      if (!res.ok) throw new Error('core fetch failed');
      let source = await res.text();
      source = source
        .replace('PetForm V26', 'PetForm V28')
        .replace('程序化解剖白模', '双指移动白模')
        .replace('单指旋转 · 双指缩放 · 程序生成白模', '单指旋转 · 双指缩放/移动')
        .replace(
          "let drag=false,lastX=0,pinch=0;const dom=renderer.domElement;dom.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;dom.setPointerCapture?.(e.pointerId)});dom.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX;lastX=e.clientX;root.rotation.y+=dx*.01});dom.addEventListener('pointerup',()=>drag=false);dom.addEventListener('pointercancel',()=>drag=false);dom.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});dom.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);camera.zoom=clamp(camera.zoom+(d-pinch)*.004,.75,2.6);pinch=d;camera.updateProjectionMatrix()}},{passive:true});",
          "let drag=false,lastX=0,pinch=0,panX=0,panY=0;const dom=renderer.domElement;function touchCenter(e){return{x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2}}function worldPerPixel(){const r=viewer.getBoundingClientRect();return{sx:(camera.right-camera.left)/Math.max(1,r.width)/camera.zoom,sy:(camera.top-camera.bottom)/Math.max(1,r.height)/camera.zoom}}dom.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag=true;lastX=e.clientX;dom.setPointerCapture?.(e.pointerId)});dom.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX;lastX=e.clientX;root.rotation.y+=dx*.01});dom.addEventListener('pointerup',()=>drag=false);dom.addEventListener('pointercancel',()=>drag=false);dom.addEventListener('touchstart',e=>{if(e.touches.length===1){drag=true;lastX=e.touches[0].clientX}else if(e.touches.length===2){drag=false;pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const c=touchCenter(e);panX=c.x;panY=c.y}},{passive:true});dom.addEventListener('touchmove',e=>{if(e.touches.length===1&&drag){const dx=e.touches[0].clientX-lastX;lastX=e.touches[0].clientX;root.rotation.y+=dx*.01}else if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);camera.zoom=clamp(camera.zoom+(d-pinch)*.004,.75,2.6);pinch=d;camera.updateProjectionMatrix();const c=touchCenter(e),w=worldPerPixel();root.position.x+=(c.x-panX)*w.sx;root.position.y-=(c.y-panY)*w.sy;root.position.x=clamp(root.position.x,-1.8,1.8);root.position.y=clamp(root.position.y,-1.2,1.4);panX=c.x;panY=c.y}},{passive:true});dom.addEventListener('touchend',e=>{if(e.touches.length===0)drag=false;if(e.touches.length===1){drag=true;lastX=e.touches[0].clientX}},{passive:true});"
        )
        .replace("reset.onclick=()=>{root.rotation.y=.35;camera.zoom=1;camera.updateProjectionMatrix()};", "reset.onclick=()=>{root.rotation.y=.35;root.position.set(0,0,0);camera.zoom=1;camera.updateProjectionMatrix()};");
      const blob = new Blob([source], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      script.onload = installFullscreen;
      document.body.appendChild(script);
    } catch (error) {
      const app = document.querySelector('#app');
      if (app) app.innerHTML = '<main class="pf26"><header class="topbar"><div class="brand"><span class="mark">P</span><div><strong>PetForm V28</strong><small>双指移动白模</small></div></div></header><section class="stage"><div class="loading">3D 核心加载失败，请刷新页面</div></section></main>';
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
      if (brand) brand.textContent = 'PetForm V28';
      if (sub) sub.textContent = '双指移动白模';
      if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放/移动';

      const close = document.createElement('button');
      close.className = 'full-close';
      close.type = 'button';
      close.setAttribute('aria-label', '退出全屏');
      close.textContent = '×';
      main.appendChild(close);

      let sx = 0, sy = 0, moved = false;
      stage.addEventListener('pointerdown', (event) => { sx = event.clientX; sy = event.clientY; moved = false; }, { passive: true });
      stage.addEventListener('pointermove', (event) => { if (Math.hypot(event.clientX - sx, event.clientY - sy) > 10) moved = true; }, { passive: true });
      stage.addEventListener('pointerup', () => {
        if (!moved && !main.classList.contains('is-view-fullscreen')) {
          main.classList.add('is-view-fullscreen');
          if (hint) hint.textContent = '全屏预览 · 单指旋转 · 双指缩放/移动';
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
        }
      }, { passive: true });
      close.addEventListener('click', (event) => {
        event.stopPropagation();
        main.classList.remove('is-view-fullscreen');
        if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放/移动';
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
      });
      return true;
    };
    if (!install()) {
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (install() || tries > 30) clearInterval(timer);
      }, 150);
    }
  }

  loadPatchedCore();
})();
