import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {
  Scene,
  TorusGeometry,
  MeshPhongMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  Group,
  Clock,
  DirectionalLight,
  MeshBasicMaterial
} from "three"

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

// Scene
const scene = new Scene()

// Torus Geometry
const geometry = new TorusGeometry( 10, 3, 16, 40)
const material = new MeshPhongMaterial({ color: 0xff00ff, wireframe: true })
const torus = new Mesh(geometry, material)

// Axies helpers
const axiesHelpers = new AxesHelper(5000)
scene.add(axiesHelpers)

// Sizes
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth
}

window.addEventListener("resize", (event) => {
  sizes.height = window.innerHeight
  sizes.width = window.innerWidth

  // Update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
})

// Group Torus
const torusGroup = new Group()
torusGroup.add(torus)
scene.add(torusGroup)

// Light
const color = 0xFFFFFF;
const intensity = 3;
const light = new DirectionalLight(color, intensity);
light.position.set(0, 80, 80);
scene.add(light);

// Camera
const camera = new PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 500)
camera.position.z = -60
scene.add(camera)
camera.lookAt(torus.position)

// Render
const canvas = document.querySelector("#webgl")
const renderer = new WebGLRenderer({
  canvas,
  antialias: true
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Annimation
let time = new Clock()
const spin = () => {
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 60
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 60
  // camera.position.y = cursor.y * 50

  // Update controls
  controls.update()

  camera.lookAt(torusGroup.position)
  const elapsedTime = time.getElapsedTime()
  torusGroup.rotation.z += 0.0001 * elapsedTime
  torusGroup.rotation.y += 0.0001 * elapsedTime
  renderer.render(scene, camera)
  window.requestAnimationFrame(spin)
}

spin()

window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement || document.webkitfullscreenElement
  if(fullScreenElement) {
    if (document.exitFullscreen)
      document.exitFullscreen()
    else if (document.webkitexitFullscreen)
      document.webkitexitFullscreen()
  } else {
    if(canvas.requestFullscreen)
      canvas.requestFullscreen()
    else if (canvas.webkitrequestFullscreen)
      canvas.webkitrequestFullscreen()
  }
})
