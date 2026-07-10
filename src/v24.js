(() => {
  const css = document.createElement('style');
  css.textContent = `
    :root { --petform-stage-h: 430px; }
    .pf23 { min-height: 100svh !important; overflow-x: hidden !important; }
    .pf23 .topbar { height: 72px !important; padding: 12px 18px !important; }
    .pf23 .brand-mark { width: 34px !important; height: 34px !important; }
    .pf23 .brand strong { font-size: 15px !important; }
    .pf23 .brand small { font-size: 11px !important; }
    .pf23 .stage { height: var(--petform-stage-h) !important; min-height: 310px !important; max-height: 560px !important; }
    .pf23 .tabs { height: 54px !important; }
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

  function adaptViewport() {
    const vv = window.visualViewport;
    const h = vv ? vv.height : window.innerHeight;
    const w = vv ? vv.width : window.innerWidth;
    const portrait = h >= w;
    const stage = Math.round(clamp(h * (portrait ? 0.50 : 0.62), 330, 540));
    document.documentElement.style.setProperty('--petform-stage-h', stage + 'px');
    window.dispatchEvent(new Event('resize'));
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  const script = document.createElement('script');
  script.src = './src/v23.js?v=24-core';
  script.onload = () => {
    adaptViewport();
    const applyLabels = () => {
      const brand = document.querySelector('.brand strong');
      const sub = document.querySelector('.brand small');
      const span = document.querySelector('.section-heading span');
      const hint = document.querySelector('.hint');
      if (brand) brand.textContent = 'PetForm V24';
      if (sub) sub.textContent = '内置浏览器窗口适配';
      if (span) span.textContent = '小窗口适配';
      if (hint) hint.textContent = '适配手机弹窗 · 单指旋转 · 双指缩放';
    };
    applyLabels();
    setTimeout(applyLabels, 300);
    setTimeout(() => { adaptViewport(); applyLabels(); }, 900);
  };
  document.body.appendChild(script);

  window.addEventListener('resize', adaptViewport, { passive: true });
  window.visualViewport && window.visualViewport.addEventListener('resize', adaptViewport, { passive: true });
  window.visualViewport && window.visualViewport.addEventListener('scroll', adaptViewport, { passive: true });
  setTimeout(adaptViewport, 50);
})();
