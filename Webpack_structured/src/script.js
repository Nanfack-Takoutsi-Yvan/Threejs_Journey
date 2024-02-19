import "./style.css"
import gsap from "gsap"
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

// Scene
const scene = new Scene()

// Cube Geometry
const geometry = new TorusGeometry( 10, 3, 16, 100)
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
const camera = new PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(40, 40, 40)
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
  const elapsedTime = time.getElapsedTime()
  torusGroup.rotation.y = Math.cos(elapsedTime)
  torusGroup.rotation.x = Math.sin(elapsedTime)
  renderer.render(scene, camera)
  window.requestAnimationFrame(spin)
}

spin()
