import './style.css'
import * as three from "three"
import * as textureLoader from "./utils/loader"
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Texture
import door from './assets/door'
import checkerBoard from "./assets/checkerboard-8x8.png"
import mincraft from "./assets/minecraft.png"


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
// const boxMesh = new three.Mesh(boxGeometry, door.map((url) => new three.MeshBasicMaterial({ map: textureLoader.loadTexture(url) })))
const boxGeometry = new three.BoxGeometry(1, 1, 1,)
const texture = textureLoader.loadTexture(mincraft) 
const boxMaterial = new three.MeshBasicMaterial({ map: texture})
const boxMesh = new three.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)

/**
 * Texture labo
 */
// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.wrapS = three.MirroredRepeatWrapping
// texture.wrapT = three.MirroredRepeatWrapping
// texture.offset.x = .5
// texture.offset.y = .5
// texture.rotation = Math.PI * .25
// texture.center.set(.5, .5)
texture.generateMipmaps = false
texture.minFilter = three.NearestFilter
texture.magFilter = three.NearestFilter

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
