import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const canvas = document.querySelector('canvas#webgl') as HTMLElement || {} as HTMLElement
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 0xff0000})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.heigth = window.innerHeight

  camera.aspect = sizes.width / sizes.heigth
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.heigth)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if(!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if(canvas.webkitRequestFullscreen){
      canvas.webkitRequestFullscreen()
    }
  } else if(document.exitFullscreen){
    document.exitFullscreen()
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.heigth)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.heigth)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  mesh.rotation.y = elapsedTime
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()