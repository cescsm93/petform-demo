(() => {
  const app = document.querySelector('#app');
  const state = { breed: 'toy', cloth: 'none', scene: 'studio', angle: 0 };
  const scenes = {
    studio: 'radial-gradient(circle at 48% 28%, #f7f6f1 0 22%, #d7d5ce 62%, #bcb8ae 100%)',
    home: 'linear-gradient(180deg,#e9d8c3 0 52%,#b58d68 53% 100%)',
    grass: 'linear-gradient(180deg,#b9dbe8 0 54%,#739c58 55% 100%)',
    coffee: 'linear-gradient(145deg,#c59a70 0,#6d4935 55%,#3b2a23 100%)',
    shop: 'linear-gradient(180deg,#eef2f5 0,#cbd3d8 55%,#aab5bb 100%)'
  };
  const breeds = {
    toy: { label: '小型犬白模', body: 1, leg: 1, head: 1, ear: 'drop' },
    hound: { label: '细犬白模', body: 1.16, leg: 1.32, head: .86, ear: 'fold' },
    french: { label: '法斗白模', body: .92, leg: .82, head: 1.16, ear: 'up' },
    corgi: { label: '柯基白模', body: 1.22, leg: .72, head: .94, ear: 'up' }
  };
  const clothes = {
    none: { name: '不穿衣服', fill: 'transparent', stroke: 'transparent', extra: '' },
    stripe: { name: '条纹毛衣', fill: '#efe8dd', stroke: '#6a3c39', extra: 'stripe' },
    vest: { name: '机能马甲', fill: '#31586a', stroke: '#203946', extra: 'zip' },
    tee: { name: '基础T恤', fill: '#e8dfd4', stroke: '#c7b8a9', extra: 'soft' },
    rain: { name: '防水雨衣', fill: '#e8ca2d', stroke: '#ffffff', extra: 'shine' },
    puffer: { name: '蓬蓬棉服', fill: '#b94b40', stroke: '#87322e', extra: 'puffer' },
    hoodie: { name: '连帽卫衣', fill: '#6c8796', stroke: '#506b78', extra: 'hood' },
    harness: { name: '胸背背带', fill: '#202225', stroke: '#111', extra: 'harness' },
    dress: { name: '裙摆衫', fill: '#dca6ba', stroke: '#be8298', extra: 'dress' }
  };

  document.head.insertAdjacentHTML('beforeend', `<style>
    .pf22{min-height:100dvh;background:#f7f5ef;color:#282520;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pf22 *{box-sizing:border-box}.pf22 .topbar{height:86px;display:flex;align-items:center;justify-content:space-between;padding:18px 20px;background:#f9f7f1;border-bottom:1px solid #e8e2d8}.pf22 .brand{display:flex;gap:12px;align-items:center}.pf22 .brand-mark{width:38px;height:38px;border:1px solid #a84e48;border-radius:50%;display:grid;place-items:center;color:#9b3e3a;font-weight:700}.pf22 .brand small{display:block;color:#77716a;margin-top:2px}.pf22 .icon-btn{border:0;background:#fff;border-radius:999px;width:38px;height:38px;box-shadow:0 6px 18px #0001}.pf22 .stage{height:clamp(390px,52dvh,610px);position:relative;overflow:hidden;background:var(--scene);touch-action:none}.pf22 .stage:before{content:"";position:absolute;inset:auto -20% 0;height:46%;background:linear-gradient(#ffffff00,#00000014)}.pf22 .stage-set{position:absolute;inset:0;pointer-events:none}.pf22 .panel-wall{position:absolute;left:8%;right:8%;top:13%;height:42%;border-radius:6px;background:#ffffff42;box-shadow:inset 0 0 0 1px #ffffff55}.pf22 .prop{position:absolute;border-radius:8px;background:#ffffff96;box-shadow:0 18px 35px #0002}.pf22 .prop.a{left:8%;bottom:13%;width:22%;height:28%}.pf22 .prop.b{right:8%;bottom:18%;width:18%;height:34%}.pf22 .plant{position:absolute;right:9%;bottom:16%;width:80px;height:120px;border-radius:50% 50% 42% 42%;background:radial-gradient(circle,#4d835a,#2f5839);box-shadow:0 24px 35px #0002}.pf22 .dog-wrap{position:absolute;left:50%;top:53%;width:min(88vw,560px);height:min(56vw,350px);transform:translate(-50%,-50%);filter:drop-shadow(0 18px 20px #00000035)}.pf22 .dog-wrap svg{width:100%;height:100%;overflow:visible;display:block}.pf22 .badge3d{position:absolute;left:18px;top:18px;padding:8px 12px;border-radius:999px;background:#fffffff2;box-shadow:0 12px 28px #0002;font-size:12px;color:#514b44}.pf22 .view-hint{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);padding:8px 13px;border-radius:999px;background:#ffffffd9;color:#756e65;font-size:12px;white-space:nowrap}.pf22 .tabs{display:grid;grid-template-columns:repeat(4,1fr);height:62px;background:#fff;border-bottom:1px solid #e8e2d8}.pf22 .tabs button{border:0;background:#fff;color:#8a837b;font-size:15px}.pf22 .tabs button.active{color:#a84e48;border-bottom:2px solid #b34c47}.pf22 .panel{display:none;padding:24px 20px 34px}.pf22 .panel.active{display:block}.pf22 .section-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px}.pf22 .section-heading small{color:#9e4b47;font-weight:800;letter-spacing:.18em;font-size:11px}.pf22 h2{font-size:25px;margin:6px 0 0}.pf22 .choice-grid,.pf22 .clothes-grid,.pf22 .scene-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pf22 button.choice,.pf22 button.garment,.pf22 button.scene-card{border:1px solid #e4ddd2;background:#fff;border-radius:8px;padding:13px;text-align:left;box-shadow:0 8px 20px #00000008}.pf22 button.active{outline:2px solid #b9514b}.pf22 button b,.pf22 button strong{display:block;font-size:15px}.pf22 button small{display:block;color:#8c847b;margin-top:5px}.pf22 .swatch{height:56px;border-radius:6px;margin-bottom:10px;background:var(--sw)}.pf22 .fit-note{margin-top:14px;background:#fff;border-radius:8px;padding:13px;color:#5e574f}.pf22 .measurements{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.pf22 label{background:#fff;border-radius:8px;padding:12px;border:1px solid #e4ddd2}.pf22 label span{display:block;color:#756e65;margin-bottom:6px}.pf22 input{width:100%;border:0;background:#f3f0ea;border-radius:6px;padding:10px;font-size:17px}.pf22 .primary-btn{margin-top:14px;width:100%;height:48px;border:0;border-radius:8px;background:#9d4944;color:#fff;font-size:16px}.pf22 .dog-part{transition:transform .18s ease}.pf22 .cloth-layer{transition:opacity .18s ease}.pf22 .shadow{opacity:.18}.pf22 .detail{opacity:.34}
  </style>`);

  app.innerHTML = `<main class="pf22"><header class="topbar"><div class="brand"><span class="brand-mark">P</span><div><strong>PetForm V22</strong><small>手机可靠预览版</small></div></div><button class="icon-btn" id="reset">↻</button></header><section class="stage" id="stage"><div class="stage-set"><div class="panel-wall"></div><div class="prop a"></div><div class="prop b"></div><div class="plant"></div></div><div class="badge3d" id="breedBadge">小型犬白模 · 大图</div><div class="dog-wrap" id="dogWrap"></div><div class="view-hint">单指左右拖动查看角度 · 全身保证显示</div></section><nav class="tabs"><button class="active" data-tab="body">体型</button><button data-tab="wear">衣服</button><button data-tab="scene">场景</button><button data-tab="size">尺码</button></nav><section class="panel active" id="body"><div class="section-heading"><div><small>MANNEQUIN</small><h2>选择白模体型</h2></div></div><div class="choice-grid"><button class="choice active" data-breed="toy"><b>小型犬白模</b><small>圆头、垂耳、短身</small></button><button class="choice" data-breed="hound"><b>细犬白模</b><small>长腿、窄胸、长颈</small></button><button class="choice" data-breed="french"><b>法斗白模</b><small>宽胸、短背、立耳</small></button><button class="choice" data-breed="corgi"><b>柯基白模</b><small>长背、短腿、翘尾</small></button></div></section><section class="panel" id="wear"><div class="section-heading"><div><small>WARDROBE</small><h2>选择服装款式</h2></div><span class="fit-badge">推荐 M</span></div><div class="clothes-grid" id="clothGrid"></div><div class="fit-note">当前为手机可靠预览：先保证看得见、够大、够清楚。</div></section><section class="panel" id="scene"><div class="section-heading"><div><small>SCENE</small><h2>切换写实背景</h2></div></div><div class="scene-grid"><button class="scene-card active" data-scene="studio"><span class="swatch" style="--sw:${scenes.studio}"></span><b>摄影棚</b><small>灰底布景</small></button><button class="scene-card" data-scene="home"><span class="swatch" style="--sw:${scenes.home}"></span><b>家庭客厅</b><small>暖色空间</small></button><button class="scene-card" data-scene="grass"><span class="swatch" style="--sw:${scenes.grass}"></span><b>草坪户外</b><small>自然绿地</small></button><button class="scene-card" data-scene="coffee"><span class="swatch" style="--sw:${scenes.coffee}"></span><b>咖啡馆</b><small>深色木调</small></button><button class="scene-card" data-scene="shop"><span class="swatch" style="--sw:${scenes.shop}"></span><b>商场橱窗</b><small>冷灰陈列</small></button></div></section><section class="panel" id="size"><div class="section-heading"><div><small>MEASUREMENTS</small><h2>输入关键数值</h2></div></div><div class="measurements"><label><span>胸围</span><input id="chest" type="number" value="42"></label><label><span>背长</span><input id="back" type="number" value="32"></label><label><span>颈围</span><input id="neck" type="number" value="25"></label><label><span>肩高</span><input id="height" type="number" value="29"></label></div><button class="primary-btn" id="applyBtn">更新白模比例</button></section></main>`;

  const dogWrap = document.querySelector('#dogWrap');
  const stage = document.querySelector('#stage');
  const clothGrid = document.querySelector('#clothGrid');
  stage.style.setProperty('--scene', scenes[state.scene]);

  clothGrid.innerHTML = Object.entries(clothes).map(([key, c]) => `<button class="garment ${key === 'none' ? 'active' : ''}" data-cloth="${key}"><span class="swatch" style="--sw:${c.fill === 'transparent' ? '#f4efe3' : c.fill}"></span><strong>${c.name}</strong><small>${key === 'none' ? '查看白模' : '试穿预览'}</small></button>`).join('');

  function renderDog() {
    const b = breeds[state.breed];
    const c = clothes[state.cloth];
    const chest = Number(document.querySelector('#chest')?.value || 42);
    const back = Number(document.querySelector('#back')?.value || 32);
    const height = Number(document.querySelector('#height')?.value || 29);
    const bodyScale = clamp(chest / 42, .82, 1.22) * b.body;
    const lenScale = clamp(back / 32, .82, 1.28) * b.body;
    const legScale = clamp(height / 29, .82, 1.22) * b.leg;
    const angleScale = 1 - Math.abs(state.angle) * .18;
    const ear = b.ear === 'up'
      ? `<path d="M388 99 L410 38 L427 116" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="3"/><path d="M444 110 L476 49 L479 132" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="3"/>`
      : `<ellipse cx="392" cy="138" rx="22" ry="52" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="3" transform="rotate(21 392 138)"/><ellipse cx="458" cy="147" rx="20" ry="48" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="3" transform="rotate(-18 458 147)"/>`;
    const cloth = state.cloth === 'none' ? '' : `<g class="cloth-layer"><ellipse cx="250" cy="210" rx="${142 * lenScale}" ry="${64 * bodyScale}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="5"/><path d="M135 190 C172 153 300 150 368 188" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="9"/><ellipse cx="370" cy="188" rx="35" ry="24" fill="none" stroke="${c.stroke}" stroke-width="7"/>${clothExtra(c.extra, lenScale, bodyScale)}</g>`;
    dogWrap.innerHTML = `<svg viewBox="0 0 560 360" role="img" aria-label="pet mannequin"><defs><radialGradient id="ivory" cx="35%" cy="25%"><stop offset="0" stop-color="#fffdf4"/><stop offset=".62" stop-color="#eee7d9"/><stop offset="1" stop-color="#d8d0c0"/></radialGradient><radialGradient id="nose" cx="40%" cy="30%"><stop offset="0" stop-color="#555"/><stop offset="1" stop-color="#111"/></radialGradient></defs><ellipse class="shadow" cx="270" cy="318" rx="190" ry="27" fill="#000"/><g transform="translate(0,0) scale(${angleScale},1) translate(${(1-angleScale)*280},0)"><path class="detail" d="M128 218 C158 160 253 146 342 179 C376 192 393 219 386 247 C369 302 244 307 174 276 C140 261 119 244 128 218Z" fill="#b4ab9c"/>${cloth}<ellipse cx="245" cy="214" rx="${150 * lenScale}" ry="${70 * bodyScale}" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"/><ellipse cx="355" cy="198" rx="58" ry="62" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"/><ellipse cx="121" cy="216" rx="54" ry="57" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"/><path d="M388 166 C409 126 457 120 486 149 C514 177 507 221 475 239 C445 257 398 244 382 209 C374 192 378 179 388 166Z" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"/>${ear}<ellipse cx="499" cy="188" rx="35" ry="25" fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"/><ellipse cx="528" cy="188" rx="10" ry="8" fill="url(#nose)"/><circle cx="456" cy="164" r="5" fill="#111"/><circle cx="482" cy="165" r="5" fill="#111"/><g fill="url(#ivory)" stroke="#d8d1c4" stroke-width="4"><rect x="150" y="253" width="32" height="${72 * legScale}" rx="16"/><rect x="242" y="254" width="32" height="${76 * legScale}" rx="16"/><rect x="330" y="248" width="32" height="${82 * legScale}" rx="16"/><rect x="390" y="242" width="32" height="${84 * legScale}" rx="16"/><ellipse cx="166" cy="328" rx="25" ry="10"/><ellipse cx="258" cy="331" rx="25" ry="10"/><ellipse cx="346" cy="329" rx="25" ry="10"/><ellipse cx="406" cy="325" rx="25" ry="10"/></g><path d="M91 199 C55 156 80 125 116 145" fill="none" stroke="#e9e1d2" stroke-width="16" stroke-linecap="round"/></g></svg>`;
    document.querySelector('#breedBadge').textContent = `${b.label} · 大图`;
  }

  function clothExtra(type, lenScale, bodyScale) {
    if (type === 'stripe') return Array.from({length: 5}, (_, i) => `<path d="M${150+i*46} 157 C${165+i*46} 194 ${162+i*46} 238 ${148+i*46} 269" stroke="${i%2 ? '#b8504b' : '#2f4b5c'}" stroke-width="10" stroke-opacity=".82"/>`).join('');
    if (type === 'zip') return `<path d="M254 153 L260 270" stroke="#e4bd58" stroke-width="7"/><circle cx="259" cy="203" r="7" fill="#e4bd58"/>`;
    if (type === 'shine') return `<path d="M157 171 C208 143 306 143 354 174" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".75"/>`;
    if (type === 'puffer') return Array.from({length: 5}, (_, i) => `<ellipse cx="${162+i*46}" cy="215" rx="28" ry="62" fill="none" stroke="#8e302d" stroke-width="6" opacity=".55"/>`).join('');
    if (type === 'hood') return `<ellipse cx="381" cy="153" rx="45" ry="32" fill="#6c8796" stroke="#506b78" stroke-width="5"/>`;
    if (type === 'harness') return `<path d="M140 188 C204 150 309 148 374 188" fill="none" stroke="#111" stroke-width="14"/><path d="M179 256 C232 230 302 229 353 256" fill="none" stroke="#111" stroke-width="13"/>`;
    if (type === 'dress') return `<path d="M128 248 C198 296 312 298 386 248 L365 294 C296 334 203 330 143 294Z" fill="#dca6ba" stroke="#be8298" stroke-width="5"/>`;
    return '';
  }

  function setActive(selector, el) { document.querySelectorAll(selector).forEach(n => n.classList.toggle('active', n === el)); }
  document.querySelectorAll('[data-tab]').forEach(btn => btn.onclick = () => { setActive('[data-tab]', btn); document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab)); });
  document.querySelectorAll('[data-breed]').forEach(btn => btn.onclick = () => { state.breed = btn.dataset.breed; setActive('[data-breed]', btn); renderDog(); });
  document.querySelectorAll('[data-cloth]').forEach(btn => btn.onclick = () => { state.cloth = btn.dataset.cloth; setActive('[data-cloth]', btn); renderDog(); });
  document.querySelectorAll('[data-scene]').forEach(btn => btn.onclick = () => { state.scene = btn.dataset.scene; stage.style.setProperty('--scene', scenes[state.scene]); setActive('[data-scene]', btn); });
  document.querySelector('#applyBtn').onclick = renderDog;
  document.querySelector('#reset').onclick = () => { state.angle = 0; renderDog(); };

  let down = false, lastX = 0;
  stage.addEventListener('pointerdown', e => { down = true; lastX = e.clientX; stage.setPointerCapture?.(e.pointerId); });
  stage.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - lastX; lastX = e.clientX; state.angle = clamp(state.angle + dx / 240, -.75, .75); renderDog(); });
  stage.addEventListener('pointerup', () => down = false);
  stage.addEventListener('pointercancel', () => down = false);

  renderDog();
})();
