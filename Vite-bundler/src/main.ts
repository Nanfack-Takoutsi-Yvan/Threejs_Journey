import './style.css'
import * as THREE from "three"

// Constants
const SIZE =  {
  width: window.visualViewport!.width,
  height: window.visualViewport!.height
}

// Canvas
const canvas = document.createElement("canvas")
document.body.prepend(canvas)

// Scene
const scene = new THREE.Scene()

// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: "rgb(255, 0, 0)" })
const cube = new THREE.Mesh(boxGeometry, cubeMaterial)
scene.add(cube)

// Camera
const camera = new THREE.PerspectiveCamera(75, SIZE.width/SIZE.height)
camera.position.z = 5


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(SIZE.width, SIZE.height)
renderer.render(scene, camera)
