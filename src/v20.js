(() => {
  const patchStyle = document.createElement('style');
  patchStyle.textContent = `
    .pf3d .stage {
      height: clamp(360px, 50dvh, 540px) !important;
      background: #d8d7d1 !important;
    }
    .pf3d #viewer {
      overflow: hidden !important;
    }
    .pf3d canvas {
      transform: translate(-16%, -13%) scale(1.34) !important;
      transform-origin: center center !important;
    }
    .pf3d .view-hint {
      bottom: 12px !important;
    }
  `;

  const script = document.createElement('script');
  script.src = './src/v7.js?v=19-core';
  script.onload = () => {
    document.head.appendChild(patchStyle);
    const applyLabels = () => {
      const brand = document.querySelector('.brand strong');
      const sub = document.querySelector('.brand small');
      const chip = document.querySelector('.model-chip');
      const hint = document.querySelector('.view-hint');
      if (brand) brand.textContent = 'PetForm V20';
      if (sub) sub.textContent = '手机校正版 · 放大居中';
      if (chip) chip.textContent = '画布左上校正';
      if (hint) hint.textContent = '已放大并向左上校正 · 双指可继续缩放';
    };
    applyLabels();
    setTimeout(applyLabels, 300);
    setTimeout(applyLabels, 900);
  };
  document.body.appendChild(script);
})();
