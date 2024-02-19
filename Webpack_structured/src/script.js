import "./style.css"
import {
  Scene,
  TorusGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AxisHelper,
  Group
} from "three"

// Scene
const scene = new Scene()

// Cube Geometry
const geometry = new TorusGeometry( 10, 3, 16, 100)
const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const torus = new Mesh(geometry, material)
torus.rotation.set(1, 0.5, 0.2)

// Axies helpers
const axiesHelpers = new AxisHelper(500)
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
camera.position.z = 40
camera.rotation.reorder("YXZ")
scene.add(camera)

camera.lookAt(torus.position)

// Render
const canvas = document.querySelector("#webgl")
const renderer = new WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
