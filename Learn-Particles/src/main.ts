import './style.css'
import GUI from 'lil-gui'
import * as three from "three"
import textures from './assets/textures'
import loadTexture from './utils/textureLoader'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { getViewportDimensions } from './utils/responsiveness'

/**
 * Debug controls
 */
const gui = new GUI().open(false)

/**
 * Constants
 */
const properties = {
  doorLight: {
    intensity: 7,
    color: 0xff7d46
  },
  pointMaterial: {
    color: 0xff88cc
  }
}

/**
 * Textures
 */
// Particles
type TextureKeys = keyof typeof textures["particles"]
const particlesTexture = new Map<TextureKeys, three.Texture>()
Object.keys(textures.particles).forEach((value) => {
  const key = value as TextureKeys
  particlesTexture.set(key, loadTexture(textures.particles[key]))
})

/**
 * Responsiveness
 */
let sizes = getViewportDimensions()
window.addEventListener('resize', () => {
  sizes = getViewportDimensions()
  camera.aspect = sizes.width!/sizes.height!
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width!, sizes.height!)
})

/**
 * Scene
 */
const scene = new three.Scene()

/**
 * Axes Helpers
 */
const axesHelper = new three.AxesHelper(1000)
axesHelper.visible = false
scene.add(axesHelper)

const axesHelperControlsFolder = gui.addFolder("Axes Helper").open(false)
axesHelperControlsFolder.add(axesHelper, "visible").name("Visible")

/**
 * Canvas
 */
const canvas = window.document.createElement("canvas")
window.document.body.prepend(canvas)

/**
 * Particles
 */
// Geometry
const particleGeo = new three.BufferGeometry()
const count = 5000
const total_count = count * 3

const positions = new Float32Array(total_count)
const color = new Float32Array(total_count)

for (let i = 0; i <= total_count; i++){
  positions[i] = (Math.random() - 0.5) * 10
  color[i] = Math.random()
}

particleGeo.setAttribute(
  "position", 
  new three.BufferAttribute(positions, 3)
)
particleGeo.setAttribute(
  "color", 
  new three.BufferAttribute(color, 3)
)

// Material
const particleMat = new three.PointsMaterial()
particleMat.size = .1
particleMat.color = new three.Color(properties.pointMaterial.color)
particleMat.sizeAttenuation = true
particleMat.transparent = true
const selectedTexture = particlesTexture.get("eighth")!
// particleMat.map = selectedTexture
particleMat.alphaMap = selectedTexture
// particleMat.alphaTest = 0.001
// particleMat.depthTest = false
particleMat.depthWrite = false
particleMat.vertexColors = true
particleMat.blending = three.AdditiveBlending

// Points
const particles = new three.Points(particleGeo, particleMat)
scene.add(particles)

const particlesFolder = gui.addFolder("Particles")
particlesFolder.addColor(properties.pointMaterial, "color")
  .name("Particles Color")
  .onChange(() => particleMat.color = new three.Color(properties.pointMaterial.color))

/**
 * Camera
 */ 
const camera = new three.PerspectiveCamera(75, sizes.width!/sizes.height!, 0.1, 1000000)

camera.position.set(0, -6, 6)
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
renderer.setSize(sizes.width!, sizes.height!)
renderer.pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.shadowMap.enabled = true

const render = () => {
  const elapsedTime = clock.getElapsedTime()

  for(let i = 0; i < count; i++){
    const i3 = i * 3
    const x = particleGeo.attributes.position.array[i3]
    particleGeo.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particleGeo.attributes.position.needsUpdate = true


  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)