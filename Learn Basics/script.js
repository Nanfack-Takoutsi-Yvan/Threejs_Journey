// Scene
const scene = new THREE.Scene()

// Cube
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const torus = new THREE.Mesh(geometry, material)
torus.rotation.x = 1
torus.rotation.y = 0.5
torus.rotation.z = 0.2
scene.add(torus)

// Capsule Geometry
const geometry2 = new THREE.CapsuleGeometry( 5, 10, 4, 8 );
const material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const capsule = new THREE.Mesh( geometry2, material2 );
capsule.rotation.z = 1
scene.add( capsule );

// Sizes
const sizes = {
  height: window.visualViewport.height,
  width: window.visualViewport.width
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 50
scene.add(camera)

// Render
const canvas = document.querySelector("#webgl")
const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
