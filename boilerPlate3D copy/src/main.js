import './style.css'
import * as THREE from 'three' 
import {
	addBoilerPlateMeshes,
	addStandardMesh,
	addTexturedMesh,
	addSphere2Mesh,
} from './addDefaultMeshes'
import {addLight} from './addDefaultLights'


const renderer  = new THREE.WebGLRenderer({antialias:true})
const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)

const meshes = {}
const lights = {}

const scene = new THREE.Scene()

init()
function init(){
	console.log('Starting initialization...');
	
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	console.log('Renderer initialized');

	//add meshes to our meshes object
	try {
		meshes.default = addBoilerPlateMeshes()
		console.log('Added default meshes');
		
		meshes.standard = addStandardMesh()
		console.log('Added standard mesh');
		
		meshes.physical = addTexturedMesh()
		console.log('Added physical mesh');
		
		meshes.sphere2 = addSphere2Mesh()
		console.log('Added sphere2 mesh');
		
		//add lights to our lights object
		lights.default = addLight()
		console.log('Added lights');

		//add meshes to our scene
		scene.add(lights.default)
		scene.add(meshes.default)
		scene.add(meshes.standard)
		scene.add(meshes.physical)
		scene.add(meshes.sphere2)
		console.log('Added all objects to scene');

	} catch (error) {
		console.error('Error during initialization:', error);
	}

	camera.position.set(0, 0, 5);
	console.log('Camera positioned');
	
	resize();
	animate();
	console.log('Initialization complete');
}

function resize(){
	window.addEventListener('resize', () =>{
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	})
}
function animate(){
	const tick = clock.getElapsedTime()
	requestAnimationFrame(animate)
	renderer.render(scene,camera)

	meshes.physical.rotation.x = tick * 0.5
	meshes.physical.rotation.y = tick * 0.3
	meshes.physical.rotation.z = tick * 0.2

	meshes.default.rotation.x = tick * 0.5
	meshes.default.rotation.y = tick * 0.3
	meshes.default.rotation.z = tick * 0.2

	meshes.standard.rotation.x = tick * 0.5
	meshes.standard.rotation.y = tick * 0.3
	meshes.standard.rotation.z = tick * 0.2

	meshes.sphere2.rotation.x = tick * 0.4
	meshes.sphere2.rotation.y = tick * 0.2
	meshes.sphere2.rotation.z = tick * 0.3
}

