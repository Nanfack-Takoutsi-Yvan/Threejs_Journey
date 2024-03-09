import './style.css'
import * as three from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
// Texture
import door from "./assets/door"
import matcaps from './assets/matcaps'
import gradients from './assets/gradients'
import loadTexture from './utils/textureLoader'

/**
 * Canvas
 */
const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

/**
 * Responsivenes
 */
const Size = {
  width: window.visualViewport?.width,
  height: window.visualViewport?.height
}

window.addEventListener("resize", () => {
  Size.width = window.visualViewport?.width,
  Size.height = window.visualViewport?.height
  camera.aspect = Size.width!/Size.height!
  camera.updateProjectionMatrix()
  renderer.setSize(Size.width!, Size.height!)
  renderer.render(scene, camera)
})

/**
 * Scene
 */
const scene = new three.Scene()

/**
 * Material
 */
// Basic Material
// const basicMat = new three.MeshBasicMaterial()
// basicMat.map = loadTexture(door.colorTexture)
// basicMat.alphaMap = loadTexture(door.alphaTexture)
// basicMat.transparent = true
// basicMat.opacity = 1
// basicMat.side = three.DoubleSide

// Normal Material
const normalMat = new three.MeshNormalMaterial()
normalMat.side = three.DoubleSide

/**
 * Objects
 */

// Torus
const torusGeo = new three.TorusGeometry()
const torus = new three.Mesh(torusGeo, normalMat)
torus.position.x = 3

// Box
const planGeo = new three.PlaneGeometry()
const plane = new three.Mesh(planGeo, normalMat)
plane.position.x = -2

// Sphere
const sphereGeo = new three.SphereGeometry()
const sphere = new three.Mesh(sphereGeo, normalMat)

// Container
const container = [torus, plane, sphere]
scene.add(...container)

// Axes
const axesHelpers = new three.AxesHelper(500)
scene.add(axesHelpers)

// Camera
const camera = new three.PerspectiveCamera(75, Size.width!/Size.height!)
camera.position.z = 5
scene.add(camera)

/**
 * Controls
 */
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.update()

/**
 * Render
 */
// Create renderer
const renderer = new three.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setSize(Size.width!, Size.height!)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Clock
const clock = new three.Clock(true)

// Animate
const render = () => {
  const elapsedTime = clock.getElapsedTime()
  container.forEach((object) => {
    object.rotation.x = elapsedTime * 0.1
    object.rotation.y = elapsedTime * 0.1
  })
  orbitControl.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}
window.requestAnimationFrame(render)
