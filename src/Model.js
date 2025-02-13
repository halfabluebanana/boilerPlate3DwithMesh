//Importing all our different loaders and materials
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import {
	Color,
	AnimationMixer,
	PointsMaterial,
	Points,
	MeshMatcapMaterial,
	TextureLoader,
	Vector3,
	BufferGeometry,
	Float32BufferAttribute,
	AdditiveBlending,
	MeshBasicMaterial,
	Group,
	Mesh,
} from 'three'


//create our class, we're using a class since this is a modular template for loading various models
export default class Model {
	//this is akin to our setup function where we create a bunch of default states or variables
	constructor(options) {
		this.name = options.name
		this.meshes = options.meshes
		this.url = options.url
		this.scene = options.scene
		this.loader = new GLTFLoader()
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('./draco/')
		this.loader.setDRACOLoader(this.dracoLoader)
		this.textureLoader = new TextureLoader()
		//this structure is slightly different than the basic var name = value, we basically use the or operator || to set the default to false if obj.animationState or obj.replace is undefined. In the case we don't pass any values into either of those obj.animationState will be undefined and thus this will be resolved as this.animations = (undefined || false) aka this.animations = false
		this.animations = options.animationState || false
		this.replaceMaterials = options.replace || false
		//another expression that may not be super common, ? : is typical for ternary operators, again lets us conditionally set states, this looks like (true false statement) ? if true do this : else do this. -> obj.replaceURL is passed in it evaluates to true since it's not undefined or null so then we do the first line aka this.textureLoader.load(`${obj.replaceURL}`), if not then we use our default /mat.png
		//Why do we do this ternary operator? Well if obj.replaceURL isn't passed in we don't want to try and set our matcap to a value that doesn't exist, this way we only set it to the replaceURL if it exists otherwise we go to a fallback value
		this.defaultMatcap = options.replaceURL
			? this.textureLoader.load(`${options.replaceURL}`)
			: this.textureLoader.load('/mat.png')

		this.mixer = null
		this.mixers = options.mixers
		this.defaultParticle = options.particleURL
			? this.textureLoader.load(`${options.particleURL}`)
			: this.textureLoader.load('/10.png')
		this.scale = options.scale || new Vector3(1, 1, 1)
		this.position = options.position || new Vector3(0, 0, 0)
		this.rotation = options.rotation || new Vector3(0, 0, 0)
		this.palette = [
			new Color('#FAAD80'),
			new Color('#FF6767'),
			new Color('#FF3D68'),
			new Color('#A73489'),
		]
		this.callback = options.callback
	}
	init() {
		console.log(`Starting to load model: ${this.url}`);
		
		// Use the loader instance we created in the constructor
		this.loader.load(
			this.url,
			(gltf) => {
				console.log(`${this.name} model loaded successfully`, gltf);
				this.meshes = gltf.scene;
				
				// Apply scale and position
				this.meshes.scale.copy(this.scale);
				this.meshes.position.copy(this.position);
				console.log(`Applied scale: ${this.scale.x}, ${this.scale.y}, ${this.scale.z}`);
				console.log(`Applied position: ${this.position.x}, ${this.position.y}, ${this.position.z}`);
				
				// Check for animations
				if (gltf.animations && gltf.animations.length) {
					console.log(`Found ${gltf.animations.length} animations`);
					this.mixer = new AnimationMixer(this.meshes);
					this.mixers.push(this.mixer);
					
					gltf.animations.forEach((clip, i) => {
						console.log(`Playing animation: ${clip.name || i}`);
						this.mixer.clipAction(clip).play();
					});
				}
				
				if (this.callback) {
					console.log('Calling callback function');
					this.callback(this.meshes);
				}
			},
			(progress) => {
				const percent = (progress.loaded / progress.total * 100);
				console.log(`Loading ${this.name} model... ${percent.toFixed(2)}%`);
			},
			(error) => {
				console.error(`Error loading ${this.name} model:`, error);
				console.error('URL attempted:', this.url);
			}
		);
	}
	//ignore for now, WIP from my end
	initPoints() {
		this.loader.load(this.url, (gltf) => {
			const meshes = []
			const pointCloud = new Group()
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					meshes.push(child)
				}
			})
			for (const mesh of meshes) {
				pointCloud.add(this.createPoints(mesh))
			}
			console.log(pointCloud)
			this.meshes = pointCloud
			this.meshes.scale.set(
				this.scale.x,
				this.scale.y,
				this.scale.z
			)
			this.meshes.position.set(
				this.position.x,
				this.position.y,
				this.position.z
			)
			this.meshes.rotation.set(
				this.rotation.x,
				this.rotation.y,
				this.rotation.z
			)
			this.scene.add(this.meshes)
		})
	}
	createPoints(_mesh) {
		const sampler = new MeshSurfaceSampler(_mesh).build()
		const numParticles = 3000
		const particlesPosition = new Float32Array(numParticles * 3)
		const particleColors = new Float32Array(numParticles * 3)
		const newPosition = new Vector3()
		for (let i = 0; i < numParticles; i++) {
			sampler.sample(newPosition)
			const color =
				this.palette[Math.floor(Math.random() * this.palette.length)]
			particleColors.set([color.r, color.g, color.b], i * 3)
			particlesPosition.set(
				[newPosition.x, newPosition.y, newPosition.z],
				i * 3
			)
		}
		const pointsGeometry = new BufferGeometry()
		pointsGeometry.setAttribute(
			'position',
			new Float32BufferAttribute(particlesPosition, 3)
		)
		pointsGeometry.setAttribute(
			'color',
			new Float32BufferAttribute(particleColors, 3)
		)
		const pointsMaterial = new PointsMaterial({
			vertexColors: true,
			transparent: true,
			alphaMap: this.defaultParticle,
			alphaTest: 0.001,
			depthWrite: false,
			blending: AdditiveBlending,
			size: 0.12,
		})
		const points = new Points(pointsGeometry, pointsMaterial)
		return points
	}
}
