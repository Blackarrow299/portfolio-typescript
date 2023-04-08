import { BufferAttribute, BufferGeometry, Points, PointsMaterial, Scene } from 'three'

export default class Particles {

    declare particlesMaterial: PointsMaterial
    declare particles: Points

    constructor(scene: Scene, particlesCount: number = 400) {
        // Geometry
        const positions = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20 * 3
            positions[i * 3 + 2] = Math.random() * -10
        }

        const particlesGeometry = new BufferGeometry()
        particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))

        // Material
        this.particlesMaterial = new PointsMaterial({
            color: '#ffeded',
            sizeAttenuation: true,
            size: 0.03,
            opacity: 0,
            transparent: true,
        })

        // Points
        this.particles = new Points(particlesGeometry, this.particlesMaterial)

        scene.add(this.particles)
    }
}