import './style.css'
import * as three from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"
// Texture
import door from "./assets/door"
import matcaps from './assets/matcaps'
import gradients from './assets/gradients'
import loadTexture from './utils/textureLoader'
import environnementMapsTexture from "./assets/environmentMaps"

/**
 * Debbug
 */
// const gui = new GUI()
// const properties = {
//   alpha: {
//     x: 0.5,
//     y: 0.5
//   }
// }

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
// const material = new three.MeshBasicMaterial()
// material.map = loadTexture(door.colorTexture)
// material.alphaMap = loadTexture(door.alphaTexture)
// material.transparent = true
// material.opacity = 1
// material.side = three.DoubleSide

// Normal Material
// const material = new three.MeshNormalMaterial()
// material.wireframe = true
// material.side = three.DoubleSide
// material.flatShading = true

// Matcap Material
// const material = new three.MeshMatcapMaterial()
// material.matcap = loadTexture(matcaps.seventh)
// material.side = three.DoubleSide

// Depth Material
// const material = new three.MeshDepthMaterial()
// material.side = three.DoubleSide

// Lumbert Material
// const material = new three.MeshLambertMaterial()
// material.side = three.DoubleSide

// Phong Material
// const material = new three.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new three.Color(0xf00fff)

// Toon Material
const material = new three.MeshToonMaterial()
const texture = loadTexture(gradients.second)
texture.generateMipmaps = false
material.gradientMap = texture
texture.minFilter = three.NearestFilter
texture.magFilter = three.NearestFilter
material.side = three.DoubleSide

// Standard material
// const material = new three.MeshStandardMaterial()
// material.side = three.DoubleSide
// material.roughness = 0
// material.metalness = 0
// material.map = loadTexture(door.colorTexture)
// material.aoMap = loadTexture(door.ambientOclusionTexture)
// material.aoMapIntensity = 1
// material.displacementMap = loadTexture(door.heightTexture)
// material.displacementScale = .05
// material.metalnessMap = loadTexture(door.metalnessTexture)
// material.roughnessMap = loadTexture(door.roughnessTexutre)
// material.normalMap = loadTexture(door.normaltexture)
// material.alphaMap = loadTexture(door.alphaTexture)
// material.normalScale = new three.Vector2(properties.alpha.x, 0.5)
// material.transparent = true

// Environnement Map
// const envMapTexture = loadTexture([
//   environnementMapsTexture.px0,
//   environnementMapsTexture.nx0,
//   environnementMapsTexture.py0,
//   environnementMapsTexture.ny0,
//   environnementMapsTexture.pz0,
//   environnementMapsTexture.nz0
// ])
// const material = new three.MeshStandardMaterial()
// material.roughness = 0
// material.metalness = 1
// material.side = three.DoubleSide
// material.envMap = envMapTexture

// const materialDebug = gui.addFolder("Material")
// materialDebug.add(material, "roughness", 0, 1, 0.0001).name("Roughness")
// materialDebug.add(material, "metalness", 0, 1, 0.0001).name("Metalness")
// materialDebug.add(material, "aoMapIntensity", 0, 10, 1).name("AO Map Intensity")
// materialDebug.add(material, "displacementScale", 0, 10, 0.01).name("Heigh Map Displacement Scale")
// materialDebug.add(material, "transparent").name("Transparency")
// const normalScaleFolder = materialDebug.addFolder("Normal Scale")
// normalScaleFolder.add(properties.alpha, "x", 0, 1, 0.1).name("X").onChange((value: number) => {
//   material.normalScale.x = value
// })
// normalScaleFolder.add(properties.alpha, "y", 0, 1, 0.1).name("Y").onChange((value: number) => {
//   material.normalScale.y = value
// })

/**
 * Objects
 */

// Torus
const torusGeo = new three.TorusGeometry()
const torus = new three.Mesh(torusGeo, material)
torus.position.x = 3
torus.geometry.setAttribute(
  "uv2", 
  new three.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

// TorusKnot
const torusKnotGeo = new three.TorusKnotGeometry()
const torusKnot = new three.Mesh(torusKnotGeo, material)
torusKnot.position.x = -4
torusKnot.geometry.setAttribute(
  "uv2", 
  new three.BufferAttribute(torusKnot.geometry.attributes.uv.array, 2)
)

// plane
const planeGeo = new three.PlaneGeometry(1, 1, 80, 80)
const plane = new three.Mesh(planeGeo, material)
plane.position.z = 2
plane.geometry.setAttribute(
  "uv2", 
  new three.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

// box
const boxGeo = new three.BoxGeometry(1, 1, 1, 80, 80, 80)
const box = new three.Mesh(boxGeo, material)
box.position.z = -2
box.geometry.setAttribute(
  "uv2", 
  new three.BufferAttribute(box.geometry.attributes.uv.array, 2)
)

// Sphere
const sphereGeo = new three.SphereGeometry()
const sphere = new three.Mesh(sphereGeo, material)
sphere.geometry.setAttribute(
  "uv2", 
  new three.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

// Container
const container = [torus, torusKnot, sphere, plane, box]
scene.add(...container)

// Axes
const axesHelpers = new three.AxesHelper(500)
scene.add(axesHelpers)

// Light
const ambientLight = new three.AmbientLight(0xffffff, .5)
const pointLight = new three.PointLight(0xffffff, 5)
pointLight.position.y = 3
pointLight.position.x = 3
ambientLight.position.y = -3
scene.add(ambientLight, pointLight)

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
