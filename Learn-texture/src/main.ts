import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as three from "three"

// Responsiveness
const SIZES = {
  width: window.visualViewport?.width,
  height: window.visualViewport?.height
}

window.addEventListener("resize", () => {
  SIZES.width = window.visualViewport?.width
  SIZES.height = window.visualViewport?.height
  perspectiveCam.aspect = SIZES.width!/SIZES.height!
  perspectiveCam.updateProjectionMatrix()
  renderer.setSize(SIZES.width!, SIZES.height!)
})

// Scene
const scene = new three.Scene()

// Geometry
const boxGeometry = new three.BoxGeometry(1, 1, 1,)
const boxMaterial = new three.MeshBasicMaterial({ color: 0xff0000 })
const boxMesh = new three.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)

// Camera
const perspectiveCam = new three.PerspectiveCamera(75, SIZES.width!/SIZES.height!)
perspectiveCam.position.z = 5
scene.add(perspectiveCam)


// Render
const canvas = document.createElement("canvas")
document.body.prepend(canvas)

const orbitControl = new OrbitControls(perspectiveCam, canvas)

const renderer = new three.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(SIZES.width!, SIZES.height!)

const render = () => {
  orbitControl.update()
  renderer.render(scene, perspectiveCam)
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
