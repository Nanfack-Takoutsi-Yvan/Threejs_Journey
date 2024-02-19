import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {
  Scene,
  TorusGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxesHelper,
  Group,
  Clock
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

// Cube Geometry
const geometry = new TorusGeometry( 10, 3, 16, 40)
const material = new MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
const torus = new Mesh(geometry, material)

// Axies helpers
const axiesHelpers = new AxesHelper(500)
scene.add(axiesHelpers)

// Sizes
const sizes = {
  height: window.visualViewport.height,
  width: window.visualViewport.width
}

// Group Torus
const torusGroup = new Group()
torusGroup.add(torus)
scene.add(torusGroup)

// // Camera
const camera = new PerspectiveCamera(45, sizes.width/sizes.height)
camera.position.z = -60
scene.add(camera)

camera.lookAt(torus.position)

// Render
const canvas = document.querySelector("#webgl")
const renderer = new WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)

// Annimation
let time = new Clock()
const spin = () => {
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 60
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 60
  camera.position.y = cursor.y * 50

  camera.lookAt(torusGroup.position)
  const elapsedTime = time.getElapsedTime()
  torusGroup.rotation.z += 0.0001 * elapsedTime
  renderer.render(scene, camera)
  window.requestAnimationFrame(spin)
}

spin()
