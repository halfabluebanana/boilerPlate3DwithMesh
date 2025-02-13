import {SphereGeometry, MeshPhongMaterial, Mesh} from 'three'

export const addPlanet = (color, radius) => {
    // (radius, width segments, height segments)
    const geometry = new SphereGeometry(radius, 2, 2)
    const material = new MeshPhongMaterial({color: color})
    const mesh = new Mesh(geometry, material)
    return mesh
}

