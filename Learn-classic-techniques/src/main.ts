import GUI from "lil-gui"
import * as three from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import "./style.css"

/**
 * Constant & receise
 */
const sizes = {
  width: window.visualViewport!.width,
  height: window.visualViewport!.height
}

window.addEventListener("resize", () => {
  sizes.width = window.visualViewport!.width
  sizes.height = window.visualViewport!.height
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

/**
 * Debug
 */
const gui = new GUI()

/**
 * Canvas
 */
const canvas = document.createElement("canvas")
document.body.prepend(canvas)

/**
 * Scene
 */
const scene = new three.Scene()

/**
 * Material
 */
const material = new three.MeshStandardMaterial()
material.side = three.DoubleSide
material.roughness = .5
material.metalness = .5
const materialFolder = gui.addFolder("Material controls").open(false)
materialFolder.add(material, "metalness", 0, 1, 0.1).name("Metalness")
materialFolder.add(material, "roughness", 0, 1, 0.1).name("Roughness")


/**
 * Objects
 */

// Plane
const planeGeo = new three.PlaneGeometry(8, 8)
const plane = new three.Mesh(planeGeo, material)
plane.position.set(0, 0, 0)
plane.receiveShadow = true
scene.add(plane)
const planeFolder = gui.addFolder("Plane controls").open(false)
planeFolder.add(plane.position, "x", 0, 10, .1).name("X position")
planeFolder.add(plane.position, "y", 0, 10, .1).name("Y position")
planeFolder.add(plane.position, "z", 0, 10, .1).name("Z position")
planeFolder.add(plane, "receiveShadow").name("Receive Shadow")

// Sphere
const sphereGeo = new three.SphereGeometry()
const sphere = new three.Mesh(sphereGeo, material)
sphere.position.z = 1
sphere.castShadow = true
scene.add(sphere)
const sphereFolder = gui.addFolder("Sphere controls").open(false)
sphereFolder.add(sphere.position, "x", 0, 5, .1).name("X position")
sphereFolder.add(sphere.position, "y", 0, 5, .1).name("Y position")
sphereFolder.add(sphere.position, "z", 0, 5, .1).name("Z position")
sphereFolder.add(sphere, "castShadow", 0, 5, .1).name("Cast Shadow")

// Ambient Light
const ambientLight = new three.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const ambientLightFolder = gui.addFolder("Ambient light controls").open(false)
ambientLightFolder.add(ambientLight, "intensity", 0, 10, .1).name("Intensity")

// Directional Light
const directionalLight = new three.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)
directionalLight.position.set(0, 2, 3)
directionalLight.lookAt(sphere.position)
directionalLight.castShadow = true
const directionalLightFolder = gui.addFolder("Directional light controls").open(false)
directionalLightFolder.add(directionalLight.position, "x", -5, 5, .1).name("X position")
directionalLightFolder.add(directionalLight.position, "y", -5, 5, .1).name("Y position")
directionalLightFolder.add(directionalLight.position, "z", -5, 5, .1).name("Z position")
directionalLightFolder.add(directionalLight, "intensity", 0, 10, .1).name("Intensity")
directionalLightFolder.add(directionalLight, "castShadow").name("Cast Shadow")

// Spot Light
const spotLight = new three.SpotLight(0xff0000, 0, 10, Math.PI * .1, .25, 1)
scene.add(spotLight)
scene.add(spotLight.target)
spotLight.position.set(-2, -2, 2)
spotLight.castShadow = true
const spotLightFolder = gui.addFolder("Spot light controls").open(false)
spotLightFolder.add(spotLight.position, "x", -5, 10, .1).name("X position")
spotLightFolder.add(spotLight.position, "y", -5, 10, .1).name("Y position")
spotLightFolder.add(spotLight.position, "z", -5, 10, .1).name("Z position")
spotLightFolder.add(spotLight, "intensity", 0, 10, .1).name("Intensity")
spotLightFolder.add(spotLight, "castShadow").name("Cast Shadow")

// Camera
const camera = new three.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 6
scene.add(camera)

/**
 * Controls
 */
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.update()

/**
 * Clock
 */
// const clock = new three.Clock()

/**
 * Render
 */
const renderer = new three.WebGLRenderer({
  canvas, 
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
const rendererFolder = gui.addFolder("Renderer control").open(false)
rendererFolder.add(renderer.shadowMap, "enabled").name("Render Shadow")

const render = () => {
  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}
// Launch rendering
window.requestAnimationFrame(render)