import * as THREE from "https://esm.sh/three@0.170.0";
import { OrbitControls } from "https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js";
import { Camera, Check, ChevronLeft, Plus, RefreshCw, Ruler, Shirt, Sparkles, Upload, X } from "https://esm.sh/lucide@0.468.0";
import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <button class="icon-btn ghost" aria-label="返回"><i data-icon="ChevronLeft"></i></button>
      <div class="brand"><span class="brand-mark">P</span><div><strong>PetForm</strong><small>我的宠物数字分身</small></div></div>
      <button class="icon-btn ghost" aria-label="重新生成" id="reset-view"><i data-icon="RefreshCw"></i></button>
    </header>

    <section class="stage">
      <canvas id="pet-canvas"></canvas>
      <div class="stage-status"><span></span>数字分身 · 已同步</div>
      <div class="pet-switch" role="group" aria-label="宠物类型">
        <button class="active" data-pet="dog">小狗</button><button data-pet="cat">小猫</button>
      </div>
      <div class="view-hint">单指旋转 · 双指缩放</div>
      <button class="remove-cloth hidden" id="remove-cloth"><i data-icon="X"></i> 脱下</button>
    </section>

    <nav class="tabs">
      <button class="active" data-tab="wardrobe"><i data-icon="Shirt"></i><span>试衣间</span></button>
      <button data-tab="capture"><i data-icon="Camera"></i><span>建模</span></button>
      <button data-tab="profile"><i data-icon="Ruler"></i><span>尺寸</span></button>
    </nav>

    <section class="panel active" id="wardrobe">
      <div class="section-heading"><div><small>VIRTUAL FITTING</small><h2>今天穿什么？</h2></div><button class="add-product" id="show-import"><i data-icon="Plus"></i> 导入商品</button></div>
      <div class="garment-list">
        <button class="garment active" data-cloth="none"><span class="empty-look"><i data-icon="Sparkles"></i></span><strong>原生毛发</strong><small>不穿衣服</small></button>
        <button class="garment" data-cloth="rain"><span class="garment-art raincoat"><b></b></span><strong>柠檬雨衣</strong><small>防水外套</small></button>
        <button class="garment" data-cloth="knit"><span class="garment-art knit"><b></b></span><strong>红格针织</strong><small>柔软毛衣</small></button>
        <button class="garment" data-cloth="denim"><span class="garment-art denim"><b></b></span><strong>复古背带</strong><small>牛仔外套</small></button>
      </div>
      <div class="fit-note"><i data-icon="Check"></i><span><strong>尺寸匹配良好</strong><small>基于胸围 42 cm · 背长 36 cm</small></span></div>
    </section>

    <section class="panel" id="capture">
      <div class="section-heading"><div><small>PHOTO CAPTURE</small><h2>拍摄各个角度</h2></div><span class="progress"><b id="photo-count">0</b>/6</span></div>
      <div class="photo-grid">
        ${["正面", "左侧", "右侧", "背面", "俯视", "头部"].map((label, i) => `<label class="photo-slot"><input type="file" accept="image/*" capture="environment" data-photo="${i}"><i data-icon="Camera"></i><span>${label}</span></label>`).join("")}
      </div>
      <button class="primary-btn" id="generate-model" disabled><i data-icon="Sparkles"></i> 生成数字分身</button>
    </section>

    <section class="panel" id="profile">
      <div class="section-heading"><div><small>BODY PROFILE</small><h2>身形尺寸</h2></div><span class="unit">单位：cm</span></div>
      <div class="measurements">
        <label><span>胸围</span><input type="number" id="chest" value="42" min="20" max="100"></label>
        <label><span>背长</span><input type="number" id="back" value="36" min="15" max="80"></label>
        <label><span>颈围</span><input type="number" id="neck" value="28" min="12" max="70"></label>
        <label><span>体重</span><div><input type="number" id="weight" value="8.5" min="1" max="70" step=".1"><em>kg</em></div></label>
      </div>
      <button class="primary-btn" id="apply-size"><i data-icon="Check"></i> 保存并更新模型</button>
    </section>

    <dialog id="import-dialog">
      <button class="dialog-close icon-btn" aria-label="关闭"><i data-icon="X"></i></button>
      <small>PRODUCT IMPORT</small><h2>导入宠物服装</h2>
      <p>粘贴商品链接，系统将提取服装图片与尺码信息。</p>
      <label class="url-field"><i data-icon="Upload"></i><input id="product-url" placeholder="https://..." inputmode="url"></label>
      <button class="primary-btn" id="import-product">提取商品</button>
      <p class="legal">仅导入你有权使用的商品信息；实际接入需遵守购物平台开放接口与版权规则。</p>
    </dialog>
    <div class="toast" id="toast"></div>
  </main>`;

const icons = { Camera, Check, ChevronLeft, Plus, RefreshCw, Ruler, Shirt, Sparkles, Upload, X };
document.querySelectorAll("[data-icon]").forEach((node) => {
  const name = node.dataset.icon;
  node.replaceWith(icons[name].toSvg({ width: 20, height: 20, "stroke-width": 1.8 }));
});

const canvas = document.querySelector("#pet-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e9e7df");
scene.fog = new THREE.Fog("#e9e7df", 8, 13);
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(4.5, 2.7, 6.8);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

scene.add(new THREE.HemisphereLight("#fffaf0", "#788171", 2.1));
const key = new THREE.DirectionalLight("#fff4df", 3.2);
key.position.set(4, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
const rim = new THREE.DirectionalLight("#9ebeb8", 1.7);
rim.position.set(-5, 3, -4); scene.add(rim);

const floor = new THREE.Mesh(new THREE.CircleGeometry(5, 64), new THREE.MeshStandardMaterial({ color: "#d5d3c9", roughness: 1 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -1.63; floor.receiveShadow = true; scene.add(floor);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 4.5; controls.maxDistance = 9;
controls.target.set(0, 0.15, 0); controls.maxPolarAngle = Math.PI / 2; controls.minPolarAngle = Math.PI / 3.4;

let petType = "dog";
let petGroup;
let clothing;
const fur = new THREE.MeshStandardMaterial({ color: "#c98754", roughness: .86 });
const cream = new THREE.MeshStandardMaterial({ color: "#ead9be", roughness: .9 });
const dark = new THREE.MeshStandardMaterial({ color: "#2f2926", roughness: .65 });

function mesh(geometry, material, pos, scale = [1, 1, 1], rot = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...pos); object.scale.set(...scale); object.rotation.set(...rot);
  object.castShadow = true; object.receiveShadow = true; return object;
}

function buildPet(type = "dog") {
  if (petGroup) scene.remove(petGroup);
  petGroup = new THREE.Group();
  const body = mesh(new THREE.SphereGeometry(1, 40, 30), fur, [0, -.1, 0], [1.55, 1.02, .86]);
  const chest = mesh(new THREE.SphereGeometry(.76, 36, 28), cream, [.7, .08, 0], [.78, 1.05, .78]);
  const head = mesh(new THREE.SphereGeometry(.78, 40, 30), fur, [1.35, .96, 0], [1, .94, .9]);
  const muzzle = mesh(new THREE.SphereGeometry(.4, 30, 22), cream, [1.94, .76, 0], [.9, .66, .83]);
  petGroup.add(body, chest, head, muzzle);
  [-1, 1].forEach((z) => {
    const eye = mesh(new THREE.SphereGeometry(.075, 18, 12), dark, [1.87, 1.12, z * .39]);
    const legF = mesh(new THREE.CapsuleGeometry(.18, .85, 8, 16), fur, [.77, -1.03, z * .56]);
    const legB = mesh(new THREE.CapsuleGeometry(.19, .8, 8, 16), fur, [-.88, -1.02, z * .54]);
    petGroup.add(eye, legF, legB);
    const ear = type === "cat"
      ? mesh(new THREE.ConeGeometry(.34, .78, 4), fur, [1.2, 1.65, z * .43], [1, 1, .7], [0, .05, z * -.15])
      : mesh(new THREE.SphereGeometry(.4, 22, 18), dark, [1.22, 1.42, z * .56], [.55, 1.2, .45], [z * .3, 0, 0]);
    petGroup.add(ear);
  });
  const nose = mesh(new THREE.SphereGeometry(.13, 20, 14), dark, [2.28, .81, 0], [.7, .75, 1]);
  const tail = type === "cat"
    ? mesh(new THREE.TorusGeometry(.72, .11, 14, 32, 4.5), fur, [-1.45, .25, 0], [1, 1, 1], [Math.PI / 2, 0, -.9])
    : mesh(new THREE.CapsuleGeometry(.12, .85, 8, 16), fur, [-1.62, .45, 0], [1, 1, 1], [0, 0, -1]);
  petGroup.add(nose, tail);
  petGroup.rotation.y = -.24; petGroup.position.y = .03; scene.add(petGroup);
  applyMeasurements();
}

function applyMeasurements() {
  if (!petGroup) return;
  const chest = Number(document.querySelector("#chest")?.value || 42);
  const back = Number(document.querySelector("#back")?.value || 36);
  const weight = Number(document.querySelector("#weight")?.value || 8.5);
  petGroup.scale.set(back / 36, Math.max(.8, Math.min(1.35, Math.sqrt(weight / 8.5))), chest / 42);
  if (clothing) addClothing(clothing.userData.kind);
}

const clothMaterials = {
  rain: new THREE.MeshPhysicalMaterial({ color: "#e8cf39", roughness: .58, clearcoat: .25 }),
  knit: new THREE.MeshStandardMaterial({ color: "#a83c39", roughness: .95 }),
  denim: new THREE.MeshStandardMaterial({ color: "#426b82", roughness: .8 })
};

function addClothing(kind) {
  if (clothing) petGroup.remove(clothing);
  clothing = null;
  document.querySelector("#remove-cloth").classList.toggle("hidden", kind === "none");
  if (kind === "none") return;
  clothing = mesh(new THREE.SphereGeometry(1.02, 42, 28, 0, Math.PI * 2, .36, 2.42), clothMaterials[kind], [-.08, -.03, 0], [1.36, 1.07, .91], [0, 0, Math.PI / 2]);
  clothing.userData.kind = kind;
  const collar = mesh(new THREE.TorusGeometry(.62, .10, 12, 32), clothMaterials[kind], [.88, .35, 0], [1, 1, .9], [0, Math.PI / 2, 0]);
  clothing.add(collar);
  petGroup.add(clothing);
}

buildPet();

function resize() {
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("active", b === button));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === button.dataset.tab));
}));

document.querySelectorAll("[data-pet]").forEach((button) => button.addEventListener("click", () => {
  petType = button.dataset.pet;
  document.querySelectorAll("[data-pet]").forEach(b => b.classList.toggle("active", b === button));
  buildPet(petType);
}));

document.querySelectorAll("[data-cloth]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-cloth]").forEach(b => b.classList.toggle("active", b === button));
  addClothing(button.dataset.cloth);
}));

document.querySelector("#remove-cloth").addEventListener("click", () => {
  document.querySelector('[data-cloth="none"]').click();
});

document.querySelector("#reset-view").addEventListener("click", () => {
  camera.position.set(4.5, 2.7, 6.8); controls.target.set(0, .15, 0); controls.update();
});

document.querySelector("#apply-size").addEventListener("click", () => {
  applyMeasurements();
  document.querySelector(".fit-note small").textContent = `基于胸围 ${document.querySelector("#chest").value} cm · 背长 ${document.querySelector("#back").value} cm`;
  toast("身形数据已更新");
});

const photoInputs = [...document.querySelectorAll("[data-photo]")];
photoInputs.forEach((input) => input.addEventListener("change", () => {
  if (!input.files[0]) return;
  const slot = input.closest(".photo-slot");
  slot.style.backgroundImage = `linear-gradient(#0002,#0002), url("${URL.createObjectURL(input.files[0])}")`;
  slot.classList.add("filled");
  slot.querySelector("span").textContent = "已拍摄";
  const count = photoInputs.filter(i => i.files.length).length;
  document.querySelector("#photo-count").textContent = count;
  document.querySelector("#generate-model").disabled = count < 4;
}));

document.querySelector("#generate-model").addEventListener("click", (event) => {
  event.currentTarget.innerHTML = `<span class="spinner"></span> 正在生成模型...`;
  event.currentTarget.disabled = true;
  setTimeout(() => {
    buildPet(petType);
    event.currentTarget.innerHTML = `${Check.toSvg({ width: 20, height: 20 })} 数字分身已生成`;
    toast("模型生成完成，可以旋转查看");
    setTimeout(() => document.querySelector('[data-tab="wardrobe"]').click(), 700);
  }, 1600);
});

const dialog = document.querySelector("#import-dialog");
document.querySelector("#show-import").addEventListener("click", () => dialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.querySelector("#import-product").addEventListener("click", () => {
  const url = document.querySelector("#product-url").value.trim();
  if (!/^https?:\/\//.test(url)) return toast("请输入有效的商品链接");
  dialog.close(); toast("商品已提交提取，后端接口待接入");
});

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
