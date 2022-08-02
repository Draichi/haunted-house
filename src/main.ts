import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const gui = new GUI({ width: 400 });
const Z_FIGHTING_SOLVER = 0.01

const canvas =
  (document.querySelector("canvas#webgl") as HTMLElement) ||
  ({} as HTMLElement);

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

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
  new THREE.PlaneGeometry(doorHeight, doorHeight),
  new THREE.MeshStandardMaterial({ color: 0xaa7b7b })
)
const bushRadius = 1
const bushGeometry = new THREE.SphereGeometry(bushRadius, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
walls.position.y = houseHeight / 2
roof.rotation.y = Math.PI * 0.25
roof.position.y = houseHeight + (roofHeight / 2)
door.position.set(0, doorHeight / 2, (houseDepth / 2) + Z_FIGHTING_SOLVER)
bush1.scale.set(bushRadius/2, bushRadius/2, bushRadius/2)
bush2.scale.set(bushRadius/4, bushRadius/4, bushRadius/4)
bush1.position.set(houseWidth/4, bushRadius / 5, (houseDepth / 2) + (bushRadius / 4))
bush2.position.set(houseWidth/2.5, bushRadius/ 6, (houseDepth /2) + (bushRadius /6))
house.add(walls, roof, door, bush1, bush2)
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(4, 5, -2)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)


const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.heigth = window.innerHeight;

  camera.aspect = sizes.width / sizes.heigth;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.heigth);
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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.heigth, 1, 100);
camera.position.set(3, 5, 10)
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.heigth);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
