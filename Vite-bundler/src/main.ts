import './style.css'
import gsap from 'gsap'
import GUI from "lil-gui"
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


// Debug
const isMobile =  function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}()

const gui =  new GUI({ closeFolders: isMobile, width: isMobile ? undefined : SIZES.width/3 })
const params = {
  color: 0x0000ff,
  pointLight: {
    color: 0xff00ff,
    intensity: 300
  },
  directionalLight: {
    color: 0xab8324,
    intensity: 300
  },
  camera: {
    position: {
      x: 0,
      y: 0,
      z: 50
    }
  },
  spin: () => {
    gsap.to(torusMesh.rotation, { duration: 1, y: torusMesh.rotation.y + 10 })
  }
}


// Canvas
const canvas = document.createElement("canvas")
document.body.prepend(canvas)

// Scene
const scene = new THREE.Scene()

// Torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 40)
const torusMaterial = new THREE.MeshPhongMaterial({ emissive: params.color, wireframe: true, transparent: true, opacity: .6 })
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
scene.add(torusMesh)
/** Debug Torus */
const torusGuiFolder = gui.addFolder("Doughtnut Properties")
torusGuiFolder.add(torusMesh.position, 'x', -90, 90, 0.01 ).name("X Axis Position")
torusGuiFolder.add(torusMesh.position, 'y', -90, 90, 0.01 ).name("Y Axis Position")
torusGuiFolder.add(torusMesh.position, 'z', -90, 90, 0.01 ).name("X Axis Position")
torusGuiFolder.addColor(params, 'color').onChange(() => {
  torusMaterial.color.set(params.color)
}).name("Material's Color")
torusGuiFolder.add(torusMaterial, "wireframe" ).name("Show Wireframe")
torusGuiFolder.add(torusMaterial, "transparent" ).name("Make Transparent")
torusGuiFolder.add(params, "spin")

// Light
const pointLight = new THREE.PointLight(params.pointLight.color, params.pointLight.intensity)
scene.add(pointLight)
const pointLightGUIFolder = gui.addFolder("Point light properties")
pointLightGUIFolder.add(pointLight.position, 'x', -90, 90, 0.01 ).name("X Axis Position")
pointLightGUIFolder.add(pointLight.position, 'y', -90, 90, 0.01 ).name("Y Axis Position")
pointLightGUIFolder.add(pointLight.position, 'z', -90, 90, 0.01 ).name("X Axis Position")
pointLightGUIFolder.add(pointLight, 'intensity', 0, 900, 1 ).name("Light Intensity")
pointLightGUIFolder.addColor(params.pointLight, 'color').onChange(() => {
  pointLight.color.set(params.pointLight.color)
}).name("Light color")

const directionalLight = new THREE.DirectionalLight(0x00ff00, 3000)
directionalLight.position.set(50, 50, 0)
scene.add(directionalLight)
const directionalLightGUIFolder = gui.addFolder("Directionnal light properties")
directionalLightGUIFolder.add(directionalLight.position, 'x', -90, 90, 0.01 ).name("X Axis Position")
directionalLightGUIFolder.add(directionalLight.position, 'y', -90, 90, 0.01 ).name("Y Axis Position")
directionalLightGUIFolder.add(directionalLight.position, 'z', -90, 90, 0.01 ).name("X Axis Position")
directionalLightGUIFolder.add(directionalLight, 'intensity', 0, 900, 1 ).name("Light Intensity")
directionalLightGUIFolder.addColor(params.directionalLight, 'color').onChange(() => {
  directionalLight.color.set(params.pointLight.color)
}).name("Light color")

// Camera
const camera = new THREE.PerspectiveCamera(75, SIZES.width/SIZES.height)
camera.position.z = params.camera.position.z
const cameraGUIFolder = gui.addFolder("Camera properties")
cameraGUIFolder.add(params.camera.position, 'x', -90, 90, 0.01 ).name("X Axis Position").onChange(() => {
  camera.position.x = params.camera.position.x
})
cameraGUIFolder.add(params.camera.position, 'y', -90, 90, 0.01 ).name("Y Axis Position").onChange(() => {
  camera.position.y = params.camera.position.y
})
cameraGUIFolder.add(params.camera.position, 'z', -90, 90, 0.01 ).name("X Axis Position").onChange(() => {
  camera.position.z = params.camera.position.z
})

// Axies helpers
const axesHelper = new THREE.AxesHelper(5000)
scene.add(axesHelper)
/** Debug Space */
const spaceGuiFolder = gui.addFolder("Space Properties")
spaceGuiFolder.add(axesHelper, 'visible').name("Show Axes")

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
