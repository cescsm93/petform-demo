(() => {
  const css = document.createElement('style');
  css.textContent = `
    :root { --petform-stage-h: 445px; }
    .pf23 { min-height: 100svh !important; overflow-x: hidden !important; }
    .pf23 .topbar { height: 68px !important; padding: 10px 18px !important; }
    .pf23 .brand-mark { width: 34px !important; height: 34px !important; }
    .pf23 .brand strong { font-size: 15px !important; }
    .pf23 .brand small { font-size: 11px !important; }
    .pf23 .stage { height: var(--petform-stage-h) !important; min-height: 335px !important; max-height: 575px !important; }
    .pf23 .tabs { height: 50px !important; }
    .pf23 .tabs button { font-size: 14px !important; }
    .pf23 .panel { padding: 18px 18px 28px !important; }
    .pf23 h2 { font-size: 22px !important; }
    .pf23 .grid { gap: 10px !important; }
    .pf23 button.choice, .pf23 button.card { padding: 11px !important; }
    .pf23 .swatch { height: 42px !important; }
    .pf23 .badge { top: 14px !important; left: 14px !important; }
    .pf23 .hint { bottom: 10px !important; font-size: 11px !important; }
  `;
  document.head.appendChild(css);

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function adaptViewport() {
    const vv = window.visualViewport;
    const h = vv ? vv.height : window.innerHeight;
    const w = vv ? vv.width : window.innerWidth;
    const portrait = h >= w;
    const stage = Math.round(clamp(h * (portrait ? 0.53 : 0.62), 350, 570));
    document.documentElement.style.setProperty('--petform-stage-h', stage + 'px');
    window.dispatchEvent(new Event('resize'));
  }

  function applyLabels() {
    const brand = document.querySelector('.brand strong');
    const sub = document.querySelector('.brand small');
    const span = document.querySelector('.section-heading span');
    const hint = document.querySelector('.hint');
    if (brand) brand.textContent = 'PetForm V25';
    if (sub) sub.textContent = '竖屏上移适配';
    if (span) span.textContent = '固定偏上';
    if (hint) hint.textContent = '适配手机竖屏 · 单指旋转 · 双指缩放';
  }

  async function loadPatchedCore() {
    adaptViewport();
    try {
      const res = await fetch('./src/v23.js?v=25-core', { cache: 'no-store' });
      if (!res.ok) throw new Error('core fetch failed');
      let source = await res.text();
      source = source
        .replace('PetForm V23', 'PetForm V25')
        .replace('稳定 WebGL 3D 版', '竖屏上移适配')
        .replace('固定居中', '固定偏上')
        .replace("dog.position.y+=.92-c.y", "dog.position.y+=1.28-c.y")
        .replace("span=3.45", "span=3.18")
        .replace("clamp(3.6/Math.max(s.x,s.y*1.25),.82,1.35)", "clamp(4.05/Math.max(s.x,s.y*1.22),.9,1.55)")
        .replace("dog.add(b.label.includes('法斗')?mesh(sph,mats.white,[-1.42*L,1.02,0],[.12,.08,.08]):mesh(torus,mats.white,[-1.5*L,1.18,0],[.9,.9,.62],[0,1.55,0]))", "dog.add(b.label.includes('法斗')?mesh(sph,mats.white,[-1.42*L,1.02,0],[.12,.08,.08]):mesh(cyl,mats.white,[-1.42*L,1.2,0],[.07,.72,.07],[0,0,-1.08]));dog.add(b.label.includes('法斗')?new THREE.Group():mesh(sph,mats.white,[-1.76*L,1.55,0],[.095,.075,.075]))");
      const blob = new Blob([source], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      script.onload = () => {
        applyLabels();
        setTimeout(() => { adaptViewport(); applyLabels(); }, 200);
        setTimeout(() => { adaptViewport(); applyLabels(); }, 900);
      };
      document.body.appendChild(script);
    } catch (error) {
      const app = document.querySelector('#app');
      if (app) app.innerHTML = '<main class="pf23"><header class="topbar"><div class="brand"><span class="brand-mark">P</span><div><strong>PetForm V25</strong><small>竖屏上移适配</small></div></div></header><section class="stage"><div class="loading">3D 核心加载失败，请刷新页面</div></section></main>';
    }
  }

  window.addEventListener('resize', adaptViewport, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adaptViewport, { passive: true });
    window.visualViewport.addEventListener('scroll', adaptViewport, { passive: true });
  }
  setTimeout(adaptViewport, 50);
  loadPatchedCore();
})();
