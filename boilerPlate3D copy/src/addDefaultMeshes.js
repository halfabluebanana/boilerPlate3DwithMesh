import {
	BoxGeometry,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Mesh,
	TextureLoader,
	MeshPhysicalMaterial,
    SphereGeometry,
} from 'three'

//define my texture loader
const loader = new TextureLoader()

const loadTextureWithFallback = (path) => {
    console.log(`Attempting to load texture: ${path}`);
    try {
        const texture = loader.load(
            `/textures/${path}`,
            (loaded) => {
                console.log(`Successfully loaded texture: ${path}`);
            },
            (progress) => {
                console.log(`Loading texture ${path}: ${(progress.loaded / progress.total * 100)}%`);
            },
            (error) => {
                console.error(`Error loading texture ${path}:`, error);
            }
        );
        return texture;
    } catch (error) {
        console.error(`Failed to load texture ${path}:`, error);
        return null;
    }
};

export const addTexturedMesh = () => {
    // Temporarily remove texture loading and use a basic material
    const sphere = new SphereGeometry(0.5, 100, 100);
    
    const sphereMaterial = new MeshPhysicalMaterial({
        color: 0x88ccff, // Light blue color
        metalness: 0.1,
        roughness: 0,
        transmission: 0.5,
        ior: 2.5,
    });
    
    const sphereMesh = new Mesh(sphere, sphereMaterial);
    return sphereMesh;
};

export const addSphere2Mesh = () => {
    try {
        console.log('Starting to create sphere2...');
        
        // Load the fabric texture with correct filename
        const color = loadTextureWithFallback('Fabric_Lace_042_basecolor.png');
        
        const sphere2 = new SphereGeometry(0.3, 64, 64);
        console.log('Created sphere2 geometry');
        
        const sphere2Material = new MeshPhysicalMaterial({
            color: color ? undefined : 0xff88cc, // fallback color if texture fails to load
            map: color,
            metalness: 0.0,
            roughness: 1.0,
            transmission: 0.1,
            ior: 1.5,
        });
        console.log('Created sphere2 material');
        
        const sphere2Mesh = new Mesh(sphere2, sphere2Material);
        sphere2Mesh.position.set(0, 2, 0);
        console.log('Created and positioned sphere2 mesh');
        return sphere2Mesh;
    } catch (error) {
        console.error('Error in addSphere2Mesh:', error);
        const defaultSphere = new SphereGeometry(0.3, 64, 64);
        const defaultMaterial = new MeshStandardMaterial({ color: 0xff00ff });
        const defaultMesh = new Mesh(defaultSphere, defaultMaterial);
        defaultMesh.position.set(0, 2, 0);
        return defaultMesh;
    }
};

export const addBoilerPlateMeshes = () => {
    const box = new BoxGeometry(1, 1, 1)
    const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 })
    const boxMesh = new Mesh(box, boxMaterial)
    boxMesh.position.set(-2, 0, 0)
    return boxMesh
}

export const addStandardMesh = () => {
    const box = new BoxGeometry(1, 1, 1)
    const boxMaterial = new MeshStandardMaterial({ color: 0x00ff00 })
    const boxMesh = new Mesh(box, boxMaterial)
    boxMesh.position.set(2, 0, 0)
    return boxMesh
}