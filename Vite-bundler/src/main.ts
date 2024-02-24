import './style.css'
import * as THREE from "three"
import { fullScreen } from './utils/fullScreen'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Full Screen
window.addEventListener("dblclick", fullScreen)

// Constants
/** Viewport Size */
const SIZES =  {
  width: window.visualViewport!.width,
  height: window.visualViewport!.height
}

window.addEventListener("resize", () => {
  // Update sizes
  SIZES.height = window.visualViewport!.height
  SIZES.width = window.visualViewport!.width

  // Update Camera
  camera.aspect = SIZES.width/SIZES.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(SIZES.width, SIZES.height)
})

/** CURSOR */
const CURSOR = {
  x: 0,
  y: 0
}

window.addEventListener("mousemove", (event) => {
  CURSOR.x = event.clientX / SIZES.width - 0.5
  CURSOR.y = event.clientY / SIZES.height - 0.5
})

// Canvas
const canvas = document.createElement("canvas")
document.body.prepend(canvas)

// Scene
const scene = new THREE.Scene()

// Torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 40)
const torusMaterial = new THREE.MeshPhongMaterial({ emissive: "rgb(155, 0, 0)", wireframe: true, transparent: true, opacity: .6 })
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
scene.add(torusMesh)

// Light
const pointLight = new THREE.PointLight(0x0000ff, 3000)
scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0x00ff00, 3000)
directionalLight.position.set(50, 50, 0)
scene.add(directionalLight)

// Camera
const camera = new THREE.PerspectiveCamera(75, SIZES.width/SIZES.height)
camera.position.z = 50

// Axies helpers
const axiesHelpers = new THREE.AxesHelper(5000)
scene.add(axiesHelpers)

// Controls
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(SIZES.width, SIZES.height)

// render
const clock = new THREE.Clock()
clock.start()

const render = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime()

  // update controls
  orbitControl.update()
  camera.lookAt(torusMesh.position)

  // Rotate Torus
  torusMesh.rotation.z += 0.0001 * elapsedTime
  torusMesh.rotation.y += 0.0001 * elapsedTime

  // render
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
