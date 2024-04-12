import './style.css'
import GUI from 'lil-gui'
import * as three from 'three'
import { gsap } from "gsap";


import textures from './assets/textures'
import { loadTexture } from './utils/textures/loader'


/**
 * Debug
 */
const gui = new GUI({ closeFolders: true }).open(false)

// Settings
const params = {
  materialColor: 0xffeded,
  directionalLight: {
    color: 0xffffff,
  },
  objectDistance: 5.5
}

const sizes = {
  width: window.visualViewport?.width!,
  height: window.visualViewport?.height!
}

const gradientTextures = {
  first: loadTexture(textures.gradient_3),
  second: loadTexture(textures.gradient_5),
}

// Scroll
let scrollY = window.scrollY
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

// Cursor
const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (e: MouseEvent) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})


/**
 * Scene
 */
const scene = new three.Scene()
// Canvas
const canvas = document.createElement("canvas")
canvas.id = "webGl"
document.body.prepend(canvas)

// Responsiveness
window.addEventListener('resize', () => {
  sizes.width = window.visualViewport?.width!
  sizes.height = window.visualViewport?.height!
  camera.aspect = (sizes.width/ sizes.height)
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

/**
 * Objects
 */
// container
const objects: three.Mesh[] = []
// Const material
gradientTextures.second.magFilter = three.NearestFilter
gradientTextures.first.magFilter = three.NearestFilter
const material = new three.MeshToonMaterial({ color: params.materialColor, gradientMap: gradientTextures.first })
const materialControlFolder = gui.addFolder("Objects Material")
materialControlFolder.addColor(params, "materialColor")
  .name("Material color")
  .onChange(() => {
    material.color = new three.Color(params.materialColor)
  })
// TorusKnot
const torusKnot = new three.Mesh(new three.TorusKnotGeometry(), material)
objects.push(torusKnot)
const torusKnotControlFolder = gui.addFolder("TorusKnot")
// Torus
const torus = new three.Mesh(new three.TorusGeometry(), material)
objects.push(torus)
const torusControlFolder = gui.addFolder("Torus")
// Tube
const capsule = new three.Mesh( new three.CapsuleGeometry(), material );
objects.push(capsule)
const tubeControlFolder = gui.addFolder("Capsule")
scene.add(...objects)

objects.forEach((object, index) => {
  object.position.y = -params.objectDistance * index
  object.position.x = index%2 ? 2.9 : -2.9
})

// Camera
const cameraGroup = new three.Group()
scene.add(cameraGroup)

const camera = new three.PerspectiveCamera(35, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 10
cameraGroup.add(camera)

// Lights
const directionalLight = new three.DirectionalLight(params.directionalLight.color, 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)
const directionalLightFolder = gui.addFolder("Light")
const lightFolder = directionalLightFolder.addFolder("Settings")
const directionalLightPotisionFolder = directionalLightFolder.addFolder("Position")
lightFolder.addColor(params.directionalLight, "color")
  .name("Color")
  .onChange(() => {
    directionalLight.color = new three.Color(params.directionalLight.color)
  })
lightFolder.add(directionalLight, "intensity", 0, 10, 0.1).name("Intensity")
directionalLightPotisionFolder.add(directionalLight.position, 'x', -10, 10, .1).name("X Axis")
directionalLightPotisionFolder.add(directionalLight.position, 'y', -10, 10, .1).name("Y Axis")
directionalLightPotisionFolder.add(directionalLight.position, 'z', -10, 10, .1).name("Z Axis")

/**
 * Clock
 */
const clock = new three.Clock()
let previousTime = 0

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas
})
renderer.setSize(sizes.width!, sizes.height!)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const render = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  // Animate Camera
  cameraGroup.position.y = -scrollY * (params.objectDistance / sizes.height)
  const parallax = { x: -cursor.x, y: cursor.y }

  camera.position.x = (parallax.x - camera.position.x) * deltaTime * 10
  camera.position.y = (parallax.y - camera.position.y) * deltaTime * 10

  // Animate object
  objects.forEach(object => object.rotation.x = elapsedTime * .1)
  // Render
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
