import GUI from "lil-gui"
import * as three from "three"
import loadTexture from "./utils/loader"
import textures from "./assets/textures"
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
 * Textures
 */
const backedShadowTexture = loadTexture(textures.backedShadow)
const simpleShadowTexture = loadTexture(textures.simpleShadow)

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
plane.position.set(0, 0, -0.01)
plane.receiveShadow = true
scene.add(plane)
const planeFolder = gui.addFolder("Plane controls").open(false)
planeFolder.add(plane.position, "x", 0, 10, .1).name("X position")
planeFolder.add(plane.position, "y", 0, 10, .1).name("Y position")
planeFolder.add(plane.position, "z", 0, 10, .1).name("Z position")
planeFolder.add(plane, "receiveShadow").name("Receive Shadow")

// Plane shadow
const sphereShadow = new three.Mesh(
  new three.PlaneGeometry(4, 4),
  new three.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadowTexture
  })
)
scene.add(sphereShadow)

// Sphere
const sphereGeo = new three.SphereGeometry()
const sphere = new three.Mesh(sphereGeo, material)
sphere.position.z = 1
sphere.castShadow = true
scene.add(sphere)
const sphereFolder = gui.addFolder("Sphere controls").open(false)
sphereFolder.add(sphere.position, "x", -5, 5, .1).name("X position")
sphereFolder.add(sphere.position, "y", -5, 5, .1).name("Y position")
sphereFolder.add(sphere.position, "z", -5, 5, .1).name("Z position")
sphereFolder.add(sphere, "castShadow").name("Cast Shadow")

// Ambient Light
const ambientLight = new three.AmbientLight(0xffffff, 5)
scene.add(ambientLight)
const ambientLightFolder = gui.addFolder("Ambient light controls").open(false)
ambientLightFolder.add(ambientLight, "intensity", 0, 10, .1).name("Intensity")

// Directional Light
const directionalLight = new three.DirectionalLight(0xffffff, 0)
scene.add(directionalLight)
directionalLight.position.set(0, 2, 3)
directionalLight.lookAt(sphere.position)

directionalLight.castShadow = false
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 5
directionalLight.shadow.radius = 50

const directionalLightHelper = new three.CameraHelper(directionalLight.shadow.camera)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

const directionalLightFolder = gui.addFolder("Directional light controls").open(false)
const directionalLightPositionFolder = directionalLightFolder.addFolder("Position").open(false)
directionalLightPositionFolder.add(directionalLight.position, "x", -5, 5, .1).name("X position")
directionalLightPositionFolder.add(directionalLight.position, "y", -5, 5, .1).name("Y position")
directionalLightPositionFolder.add(directionalLight.position, "z", -5, 5, .1).name("Z position")
const directionalLightShadowFolder = directionalLightFolder.addFolder("Shadow").open(false)
directionalLightShadowFolder.add(directionalLight, "intensity", 0, 10, .1).name("Intensity")
directionalLightShadowFolder.add(directionalLight.shadow.mapSize, "width", 1024 / 4, 1024 * 4, 2).name("MapSize Width")
directionalLightShadowFolder.add(directionalLight.shadow.mapSize, "height", 1024 / 4, 1024 * 4, 2).name("MapSize Height")
directionalLightShadowFolder.add(directionalLight.shadow, "radius", 0, 100, 1).name("Shadow Radius")
directionalLightShadowFolder.add(directionalLight, "castShadow").name("Cast Shadow")
directionalLightShadowFolder.add(directionalLightHelper, "visible").name("Helper visible")

// Spot Light
const spotLight = new three.SpotLight(0xffffff, 0, 10, Math.PI * .3)
scene.add(spotLight)
spotLight.position.set(-1.6, 1.2, 4.5)
scene.add(spotLight.target)

spotLight.castShadow = false
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.fov = 30

const spotLightHelper = new three.CameraHelper(spotLight.shadow.camera)
spotLightHelper.visible = false
scene.add(spotLightHelper)

const spotLightFolder = gui.addFolder("Spot light controls").open(false)
const spotLightPositionFolder = spotLightFolder.addFolder("Position").open(false)
const spotLightShadowFolder = spotLightFolder.addFolder("Shadow").open(true)
spotLightPositionFolder.add(spotLight.position, "x", -5, 10, .1).name("X position")
spotLightPositionFolder.add(spotLight.position, "y", -5, 10, .1).name("Y position")
spotLightPositionFolder.add(spotLight.position, "z", -5, 10, .1).name("Z position")
spotLightShadowFolder.add(spotLight.shadow.mapSize, "width", 1024 / 4, 1024 * 4, 2).name("MapSize Width")
spotLightShadowFolder.add(spotLight.shadow.mapSize, "height", 1024 / 4, 1024 * 4, 2).name("MapSize Height")
spotLightShadowFolder.add(spotLight.shadow, "radius", 0, 100, 1).name("Shadow Radius")
spotLightShadowFolder.add(spotLight, "intensity", 0, 10, .1).name("Intensity")
spotLightShadowFolder.add(spotLight, "castShadow").name("Cast Shadow")
spotLightShadowFolder.add(spotLightHelper, "visible").name("SpotLight Helper")

// Point light
const pointLight = new three.PointLight(0xffffff, 0)
scene.add(pointLight)
pointLight.position.set(1, 1, 4.5)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 1
pointLight.shadow.camera.far = 6

const pointLightHelper = new three.CameraHelper(pointLight.shadow.camera)
pointLightHelper.visible = false
scene.add(pointLightHelper)

const pointLightFolder = gui.addFolder("Point light controls").open(false)
const pointLightPositionFolder = pointLightFolder.addFolder("Position").open(false)
const pointLightShadowFolder = pointLightFolder.addFolder("Shadow").open(false)
pointLightPositionFolder.add(pointLight.position, "x", -5, 10, .1).name("X position")
pointLightPositionFolder.add(pointLight.position, "y", -5, 10, .1).name("Y position")
pointLightPositionFolder.add(pointLight.position, "z", -5, 10, .1).name("Z position")
pointLightShadowFolder.add(pointLight.shadow.mapSize, "width", 1024 / 4, 1024 * 4, 2).name("MapSize Width")
pointLightShadowFolder.add(pointLight.shadow.mapSize, "height", 1024 / 4, 1024 * 4, 2).name("MapSize Height")
pointLightShadowFolder.add(pointLight.shadow, "radius", 0, 100, 1).name("Shadow Radius")
pointLightShadowFolder.add(pointLight, "intensity", 0, 10, .1).name("Intensity")
pointLightShadowFolder.add(pointLight, "castShadow").name("Cast Shadow")
pointLightShadowFolder.add(pointLightHelper, "visible").name("Helper")

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
const clock = new three.Clock()

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
// renderer.shadowMap.type = three.PCFSoftShadowMap

const render = () => {
  const elapsedTime = clock.getElapsedTime()
  // Update Sphere position
  sphere.position.x = Math.cos(Math.PI * elapsedTime * 0.1) * 2
  sphere.position.y = Math.sin(Math.PI * elapsedTime * 0.1) * 2
  sphere.position.z = Math.abs(Math.sin(elapsedTime)) + 1

  // Update Shadow
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.y = sphere.position.y
  sphereShadow.material.opacity = (2 - sphere.position.z)

  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}
// Launch rendering
window.requestAnimationFrame(render)