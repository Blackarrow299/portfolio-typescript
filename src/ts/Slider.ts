import { defaultVertex } from "@/glsl"
import fragment from '@/glsl/fragment.frag'
import { gsap } from "gsap"
import { Mesh, Vector2, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Texture, TextureLoader, Uniform, WebGLRenderer } from "three"

interface UniformsSlider {
    uTexture: { value: Texture },
    uTexture1: { value: Texture },
    uProgress: { value: number },
    uResolution: { value: Vector2 },
    uMix: { value: number }
}

export default class Slider {

    declare private renderer: WebGLRenderer
    declare private scene: Scene
    declare private camera: PerspectiveCamera
    declare public segments: number
    declare public images: string[]
    declare private textures: Texture[]
    track: number = 0
    declare uniforms: UniformsSlider

    constructor(images: string[], textureLoader: TextureLoader) {
        this.images = images

        this.textures = images.map((imageUrl) => {
            return textureLoader.load(imageUrl)
        })

        this.uniforms = {
            uTexture: { value: this.textures[this.track] },
            uTexture1: { value: new Texture() },
            uProgress: { value: 0 },
            uResolution: { value: new Vector2(0, 0) },
            uMix: { value: 0 }
        }

        this.init()
    }

    init() {
        this.segments = 128
        const elem = document.querySelector<HTMLElement>('#p-slider')
        const nextBtn = document.querySelector<HTMLElement>('#p-slider-next')
        const prevBtn = document.querySelector<HTMLElement>('#p-slider-prev')

        if (!elem) return
        const { width, height } = elem.getBoundingClientRect()
        this.uniforms.uResolution.value = new Vector2(width, height)
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new WebGLRenderer();

        this.camera.position.z = 1;
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = 'absolute'
        this.renderer.domElement.style.top = '0'

        elem.appendChild(this.renderer.domElement);

        const geometry = new PlaneGeometry(1, 1, this.segments, this.segments);

        const material = new ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: fragment,
            vertexShader: defaultVertex
        });
        const mesh = new Mesh(geometry, material);

        const { width: scaleX, height: scaleY } = this.getViewSize()

        mesh.scale.x = scaleX
        mesh.scale.y = scaleY

        this.scene.add(mesh);
        window.addEventListener('resize', () => {
            const { width, height } = elem.getBoundingClientRect()
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });

        nextBtn?.addEventListener('click', this.next.bind(this))
        prevBtn?.addEventListener('click', this.prev.bind(this))
    }

    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(
            this.camera.position.z * Math.tan(fovInRadians / 2) * 2
        );
        return { width: height * this.camera.aspect, height };
    }

    next() {
        if (this.track >= this.images.length - 1) this.track = 0
        else this.track++

        this.uniforms.uTexture1.value = this.textures[this.track]
        this.uniforms.uMix.value = 0

        const duration = 0.3

        gsap.to(this.uniforms.uMix, {
            value: 1,
            duration
        })

        gsap.to(this.uniforms.uProgress, {
            value: 0.05,
            duration
        })
            .then(() => {
                gsap.to(this.uniforms.uProgress, {
                    value: 0,
                    duration
                })
            }).then(() => {
                this.uniforms.uTexture.value = this.textures[this.track]
                this.uniforms.uMix.value = 0

            })
    }

    prev() {
        if (this.track <= 0) this.track = this.images.length - 1
        else this.track--
        this.uniforms.uTexture.value = this.textures[this.track]
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

}