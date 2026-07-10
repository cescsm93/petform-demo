(() => {
  const patchStyle = document.createElement('style');
  patchStyle.textContent = `
    .pf3d .stage {
      height: clamp(390px, 54dvh, 620px) !important;
      background: #d8d7d1 !important;
    }
    .pf3d #viewer { overflow: hidden !important; }
    .pf3d canvas {
      transform: translate(-7%, -8%) !important;
      transform-origin: center center !important;
    }
    .pf3d .view-hint { bottom: 12px !important; }
  `;
  document.head.appendChild(patchStyle);

  const replacements = [
    ['PetForm V19', 'PetForm V21'],
    ['手机全身安全模式', '高清放大版'],
    ['小型犬白模 · 全身', '小型犬白模 · 高清'],
    ['全身安全视角 · 双指可放大', '高清大图 · 双指可继续缩放'],
    ['手机安全取景', '高清放大取景'],
    ['height:clamp(340px,46dvh,500px)', 'height:clamp(390px,54dvh,620px)'],
    ['new THREE.PerspectiveCamera(64,1,.1,160)', 'new THREE.PerspectiveCamera(46,1,.1,160)'],
    ['renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75))', 'renderer.setPixelRatio(Math.min(devicePixelRatio||1,3))'],
    ['const focus=new THREE.Vector3(0,1.42,0)', 'const focus=new THREE.Vector3(-.18,1.52,0)'],
    ['radius:24,targetTheta:.38,targetPhi:1.2,targetRadius:24', 'radius:13.2,targetTheta:.36,targetPhi:1.18,targetRadius:13.2'],
    ['orbit.targetRadius=clamp(orbit.targetRadius,14,34)', 'orbit.targetRadius=clamp(orbit.targetRadius,9.2,24)'],
    ['root.scale.setScalar(.26)', 'root.scale.setScalar(.46)'],
    ['root.position.y+=focus.y-center.y-.08', 'root.position.y+=focus.y-center.y-.02'],
    ['targetRadius:24,velX:0,velY:0', 'targetRadius:13.2,velX:0,velY:0']
  ];

  fetch('./src/v7.js?v=21-core')
    .then((r) => r.text())
    .then((source) => {
      for (const [from, to] of replacements) source = source.split(from).join(to);
      const blob = new Blob([source], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      document.body.appendChild(script);
    })
    .catch(() => {
      const app = document.querySelector('#app');
      if (app) app.innerHTML = '<main class="app-shell"><section class="panel active"><h2>V21 加载失败</h2><p>请刷新页面再试。</p></section></main>';
    });
})();
