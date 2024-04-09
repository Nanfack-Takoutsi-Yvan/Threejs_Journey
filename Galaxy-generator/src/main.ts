import './style.css'
import GUI from 'lil-gui'
import * as three from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { getViewportDimensions } from './utils/responsivenes'

/**
 * Debug controls
 */
const gui = new GUI().open(false)

const params = {
  count: 20000,
  size: .005,
  radius: 5,
  branches: 4,
  spin: 1,
  randomness: 1.5,
  randomnessPower: 3,
  insideColor: 0xff6030,
  outerColor: 0x1b3984
}

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
 * Galaxy
 */
let geometry: null | three.BufferGeometry<three.NormalBufferAttributes> = null
let points: null | three.Points<three.BufferGeometry<three.NormalBufferAttributes>, three.PointsMaterial, three.Object3DEventMap> = null
let material: null | three.PointsMaterial = null

const generateGalaxy = () => {
  // Remove old galaxy
  if(points) {
    geometry?.dispose()
    material?.dispose()
    scene.remove(points)
  }

  // Geometries
  geometry = new three.BufferGeometry()
  const position = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  const insideColor = new three.Color(params.insideColor)
  const outerColor = new three.Color(params.outerColor)

  for(let i = 0; i < params.count; i++){
    const i3 = i*3
    const radius = Math.random() * params.radius
    const spinAngle = radius * params.spin
    const branchesAngles = ((i % params.branches)/params.branches) * (2 * Math.PI)
    const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
    position[i3] = Math.cos(branchesAngles + spinAngle) * radius + randomX
    position[i3 + 1] = Math.sin(branchesAngles + spinAngle) * radius + randomY
    position[i3 + 2] = 0 + randomZ

    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outerColor, radius / params.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute(
    'position',
    new three.BufferAttribute(position, 3)
  )

  geometry.setAttribute(
    'color',
    new three.BufferAttribute(colors, 3)
  )

  // Material
  material = new three.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: three.AdditiveBlending,
    vertexColors: true
  })

  // Points
  points = new three.Points(geometry, material)
  scene.add(points)
}

generateGalaxy()

const pointsFolders = gui.addFolder("Points")
pointsFolders.add(params, "count").onFinishChange(generateGalaxy)
  .min(100).max(1000000).step(100).name("Amount of Points")
pointsFolders.add(params, "size").onFinishChange(generateGalaxy)
  .min(0.001).max(0.1).step(0.001).name("Points Size")
pointsFolders.add(params, "radius").onFinishChange(generateGalaxy)
  .min(1).max(20).step(0.1).name("Galaxy Radius")
pointsFolders.add(params, "branches").onFinishChange(generateGalaxy)
  .min(2).max(20).step(1).name("Number of Branches")
pointsFolders.add(params, "spin").onFinishChange(generateGalaxy)
  .min(-20).max(20).step(.001).name("Spin")
pointsFolders.add(params, "randomness").onFinishChange(generateGalaxy)
  .min(0).max(2).step(.001).name("Randomness")
pointsFolders.add(params, "randomnessPower").onFinishChange(generateGalaxy)
  .min(0).max(5).step(1).name("Randomness Power")
pointsFolders.addColor(params, "insideColor")
  .onFinishChange(generateGalaxy)
  .name("Inside Color")
pointsFolders.addColor(params, "outerColor")
  .onFinishChange(generateGalaxy)
  .name("Outside Color")

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

  // Rotate Galaxy
  if (points) {
    points.rotateZ(elapsedTime * .0001)
  }

  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)