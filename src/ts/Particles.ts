import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BufferAttribute, BufferGeometry, Points, PointsMaterial, Scene, Vector2 } from 'three'
import { lerp } from 'three/src/math/MathUtils'

export default class Particles {

    declare particlesMaterial: PointsMaterial
    declare particles: Points
    declare cursorPosition: Vector2

    constructor(scene: Scene, particlesCount: number = 400) {
        // Geometry
        const positions = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20 * 6
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

        ScrollTrigger.create({
            trigger: window.app,
            start: () => {
                return `top+=${window.innerHeight - window.innerHeight / 6}px`
            },
            end: 'bottom bottom',
            onEnter: () => {
                gsap.to(this.particlesMaterial, {
                    duration: 0.5,
                    opacity: 1,
                    onUpdate: () => {
                        this.particlesMaterial.needsUpdate = true;
                    },
                });
            },
            onLeaveBack: () => {
                gsap.to(this.particlesMaterial, {
                    duration: 0.5,
                    opacity: 0,
                    onUpdate: () => {
                        this.particlesMaterial.needsUpdate = true;
                    },
                });
            },
            onUpdate: () => {
                gsap.to(this.particles.position, {
                    y: () => {
                        // Get the current scroll position and use it to calculate the target y position
                        const scrollY = window.scrollY;
                        const targetY = scrollY * 0.01; // You can adjust the factor to control the animation speed
                        return targetY;
                    },
                });
            }
        });

        //parallax
        this.cursorPosition = new Vector2(0, 0)

        window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onMouseMove(event: MouseEvent) {
        this.cursorPosition.x = event.clientX / window.innerWidth - 0.5
        this.cursorPosition.y = event.clientY / window.innerHeight - 0.5
    }

    public animate() {
        this.particles.position.x = lerp(this.particles.position.x, this.cursorPosition.x * 0.5, 0.2)
        // particles.particles.position.y = cursorPosition.y * 0.5
    }
}