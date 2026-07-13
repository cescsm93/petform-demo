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

  const script = document.createElement('script');
  script.src = './src/v26.js?v=27-core';
  script.onload = () => {
    const install = () => {
      const main = document.querySelector('.pf26');
      const stage = document.querySelector('.pf26 .stage');
      const brand = document.querySelector('.pf26 .brand strong');
      const sub = document.querySelector('.pf26 .brand small');
      const hint = document.querySelector('.pf26 .hint');
      if (!main || !stage || main.dataset.fullscreenReady) return false;
      main.dataset.fullscreenReady = '1';
      if (brand) brand.textContent = 'PetForm V27';
      if (sub) sub.textContent = '点击窗口全屏';
      if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放';

      const close = document.createElement('button');
      close.className = 'full-close';
      close.type = 'button';
      close.setAttribute('aria-label', '退出全屏');
      close.textContent = '×';
      main.appendChild(close);

      let sx = 0, sy = 0, moved = false;
      stage.addEventListener('pointerdown', (event) => {
        sx = event.clientX;
        sy = event.clientY;
        moved = false;
      }, { passive: true });
      stage.addEventListener('pointermove', (event) => {
        if (Math.hypot(event.clientX - sx, event.clientY - sy) > 10) moved = true;
      }, { passive: true });
      stage.addEventListener('pointerup', () => {
        if (!moved && !main.classList.contains('is-view-fullscreen')) {
          main.classList.add('is-view-fullscreen');
          if (hint) hint.textContent = '全屏预览 · 单指旋转 · 双指缩放';
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
        }
      }, { passive: true });
      close.addEventListener('click', (event) => {
        event.stopPropagation();
        main.classList.remove('is-view-fullscreen');
        if (hint) hint.textContent = '点窗口全屏 · 单指旋转 · 双指缩放';
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
      });
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close.click();
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
  };
  document.body.appendChild(script);
})();
