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
    try {
        // Load all the ice textures with correct filenames
        const color = loadTextureWithFallback('Ice_001_COLOR.jpg');
        const normal = loadTextureWithFallback('Ice_001_NRM.jpg');
        const height = loadTextureWithFallback('Ice_001_DISP.png');
        const ao = loadTextureWithFallback('Ice_001_OCC.jpg');
        
        const sphere = new SphereGeometry(0.5, 100, 100);
        console.log('Created ice sphere geometry');
        
        const sphereMaterial = new MeshPhysicalMaterial({
            color: color ? undefined : 0xffffff, // Changed to white for more brightness
            map: color,
            normalMap: normal,
            displacementMap: height,
            displacementScale: 0.1, // Reduced displacement for smoother look
            aoMap: ao,
            metalness: 0.2, // Reduced metalness
            roughness: 0.0, // Made perfectly smooth
            transmission: 0.9, // Increased transparency
            ior: 1.4, // Adjusted for ice-like refraction
            clearcoat: 1.0, // Maximum clearcoat for shine
            clearcoatRoughness: 0.0, // Smooth clearcoat
            envMapIntensity: 2.0, // Increased environment reflection
            transparent: true, // Enable transparency
            opacity: 0.8 // Slight opacity for ice effect
        });
        console.log('Created ice sphere material');
        
        const sphereMesh = new Mesh(sphere, sphereMaterial);
        console.log('Created ice sphere mesh');
        return sphereMesh;
    } catch (error) {
        console.error('Error in addTexturedMesh:', error);
        // Return a default blue sphere if textures fail to load
        const defaultSphere = new SphereGeometry(0.5, 100, 100);
        const defaultMaterial = new MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.0,
            transmission: 0.9,
            ior: 1.4,
            clearcoat: 1.0,
            transparent: true,
            opacity: 0.8
        });
        const defaultMesh = new Mesh(defaultSphere, defaultMaterial);
        return defaultMesh;
    }
};

export const addSphereMesh = () => {
    const color = loadTextureWithFallback('Fabric_Lace_042_basecolor.png');
        const normal = loadTextureWithFallback('Fabric_Lace_042_normal.png');
        const height = loadTextureWithFallback('Fabric_Lace_042_height.png');
        const roughness = loadTextureWithFallback('Fabric_Lace_042_roughness.png');
        const ao = loadTextureWithFallback('Fabric_Lace_042_ambientOcclusion.png');
        
        const sphere = new SphereGeometry(0.3, 64, 64);
        console.log('Created sphere2 geometry');
        
        const sphereMaterial = new MeshPhysicalMaterial({
            map: color,
            normalMap: normal,
            displacementMap: height,
            displacementScale: 0.05, // Adjust this value to control the height effect
            roughnessMap: roughness,
            aoMap: ao,
            metalness: 0.0, // Lace isn't metallic
            roughness: 0.8, // Base roughness for the lace
            transmission: 0.1,
            ior: 1.5,
        });
        const sphereMesh = new Mesh(sphere, sphereMaterial);
        return sphereMesh;
}

export const addSphere2Mesh = () => {
    try {
        console.log('Starting to create sphere2...');
        
        // Load all the lace textures
        const color = loadTextureWithFallback('Fabric_Lace_042_basecolor.png');
        const normal = loadTextureWithFallback('Fabric_Lace_042_normal.png');
        const height = loadTextureWithFallback('Fabric_Lace_042_height.png');
        const roughness = loadTextureWithFallback('Fabric_Lace_042_roughness.png');
        const ao = loadTextureWithFallback('Fabric_Lace_042_ambientOcclusion.png');
        
        const sphere2 = new SphereGeometry(0.3, 64, 64);
        console.log('Created sphere2 geometry');
        
        const sphere2Material = new MeshPhysicalMaterial({
            map: color,
            normalMap: normal,
            displacementMap: height,
            displacementScale: 0.05, // Adjust this value to control the height effect
            roughnessMap: roughness,
            aoMap: ao,
            metalness: 0.0, // Lace isn't metallic
            roughness: 0.8, // Base roughness for the lace
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