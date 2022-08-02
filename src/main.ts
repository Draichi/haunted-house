import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

// const gui = new GUI({ width: 400 });
const Z_FIGHTING_SOLVER = 0.01

const canvas =
  (document.querySelector("canvas#webgl") as HTMLElement) ||
  ({} as HTMLElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x262837, 1, 15)

const textureLoader = new THREE.TextureLoader();
const doorAlphaTexture = textureLoader.load('/static/textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/static/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/static/textures/door/height.jpg')
const doorMetalness = textureLoader.load('/static/textures/door/metalness.jpg')
const doorNormal = textureLoader.load('/static/textures/door/normal.jpg')
const doorRoughness = textureLoader.load('/static/textures/door/roughness.jpg')

const floorWidth = 20
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorWidth, floorWidth),
  new THREE.MeshStandardMaterial({ color: 0xa9c388 })
);
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

const house = new THREE.Group()
const houseHeight = 2.5
const houseWidth = 4
const houseDepth = 4
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(houseWidth, houseHeight, houseDepth),
  new THREE.MeshStandardMaterial({ color: 0xac8e82 })
)
const roofHeight = 1
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
const doorHeight = 2
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorHeight + 0.2, doorHeight + 0.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusion,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormal,
    metalnessMap: doorMetalness,
    roughnessMap: doorRoughness
  })
)
const bushRadius = 1
const bushGeometry = new THREE.SphereGeometry(bushRadius, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
walls.position.y = houseHeight / 2
roof.rotation.y = Math.PI * 0.25
roof.position.y = houseHeight + (roofHeight / 2)
door.position.set(0, doorHeight / 2, (houseDepth / 2) + Z_FIGHTING_SOLVER)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
bush1.scale.set(bushRadius/2, bushRadius/2, bushRadius/2)
bush2.scale.set(bushRadius/4, bushRadius/4, bushRadius/4)
bush1.position.set(houseWidth/4, bushRadius / 5, (houseDepth / 2) + (bushRadius / 4))
bush2.position.set(houseWidth/2.5, bushRadius/ 6, (houseDepth /2) + (bushRadius /6))
doorLight.position.set(0, doorHeight + 0.2, houseDepth + 0.7)
house.add(walls, roof, door, bush1, bush2, doorLight)
scene.add(house)

const graves = new THREE.Group()
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })
const minRadius = houseWidth
const maxRadius = (floorWidth / 2) - minRadius
for(let i=0; i<40; i++) {
  const randomAngle = Math.random() * Math.PI * 2
  const randomRadius = minRadius + maxRadius * Math.random()
  const randomX = Math.sin(randomAngle) * randomRadius
  const randomZ = Math.cos(randomAngle) * randomRadius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(randomX, 0.3, randomZ)
  grave.rotateY((Math.random() - 0.5) * 0.4)
  grave.rotateZ((Math.random() - 0.5) * 0.4)
  graves.add(grave)
}
scene.add(graves)

const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12)
moonLight.position.set(4, 5, -2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.set(3, 5, 10)
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837)

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
