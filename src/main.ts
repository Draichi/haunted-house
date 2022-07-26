import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import gsap from "gsap";

const gui = new GUI({width: 400});


const canvas =
(document.querySelector("canvas#webgl") as HTMLElement) ||
({} as HTMLElement);

const textureLoader = new THREE.TextureLoader()
const doorAlpha = textureLoader.load('/static/textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
const doorColor = textureLoader.load('/static/textures/door/color.jpg')
const doorHeight = textureLoader.load('/static/textures/door/height.jpg')
const doorMetalness = textureLoader.load('/static/textures/door/metalness.jpg')
const doorNormal = textureLoader.load('/static/textures/door/normal.jpg')
const doorRoughness = textureLoader.load('/static/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/static/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/static/textures/gradients/3.jpg')

const scene = new THREE.Scene();
const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture
})

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
sphere.position.x = -1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.heigth);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.heigth);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  
  sphere.rotation.y = 0.1 * elapsedTime
  plane.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  plane.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
