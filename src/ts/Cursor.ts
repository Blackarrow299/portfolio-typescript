import { Mesh, Scene, Vector3, Vector2, PlaneGeometry, ShaderMaterial, Camera, Texture, IUniform } from 'three'
import { lerp } from '../utils/utils'
import { gsap } from 'gsap'
import { deformationVertex as cursorVertex, defaultFragment } from '@/glsl'
import { clamp } from 'three/src/math/MathUtils'
import { CURSOR_TEXTURES_URL } from '../utils/constants'

export interface Uniform {
    uOffset: IUniform<Vector2>
    uTexture: IUniform<Texture>
    uAlpha: IUniform<number>
}

export type CursorTextures = keyof typeof CURSOR_TEXTURES_URL

export default class Cursor {
    declare private scene: Scene
    declare private camera: Camera
    declare public mesh: Mesh
    declare public uniforms: Uniform
    declare public position: Vector3
    declare cursorVec: Vector3
    private cursorX: number = 0
    private cursorY: number = 0
    //declare public defaultTexture: Texture
    declare cursorTextures: Map<CursorTextures, Texture>

    //load navigation textures
    declare navigationTextures: THREE.Texture[]


    constructor(scene: Scene, camera: Camera) {
        if (window.isMobile) return
        this.scene = scene
        this.camera = camera

        // create a mesh
        this.mesh = new Mesh();
        //cursor postion
        this.position = new Vector3(0, 0, 1)
        // set the mesh position
        this.mesh.position.set(1, 0, 0)
        this.cursorVec = new Vector3()
        //load texture for the cursor
        this.cursorTextures = new Map()
        let textureTitle: CursorTextures
        for (textureTitle in CURSOR_TEXTURES_URL) {
            if (CURSOR_TEXTURES_URL.hasOwnProperty(textureTitle)) {
                this.cursorTextures.set(textureTitle, window.textureLoader.load(CURSOR_TEXTURES_URL[textureTitle]));
            }
        }

        this.uniforms = {
            uOffset: { value: new Vector2(0, 0) },
            uTexture: { value: this.cursorTextures.get('default')! },
            uAlpha: { value: 0.5 },
        }

        this.init()
    }

    private init() {
        // create a plane geometry
        const cursorMeshGeometry = new PlaneGeometry(0.5, 0.5, 20, 20);
        // create a shader material
        const cursorMeshMaterial = new ShaderMaterial({
            alphaTest: 0,
            transparent: true,
            //@ts-ignore
            uniforms: this.uniforms,
            vertexShader: cursorVertex,
            fragmentShader: defaultFragment,
        });

        this.mesh.geometry = cursorMeshGeometry
        this.mesh.material = cursorMeshMaterial
        //add the cursor mesh to the scene
        this.scene.add(this.mesh)

        this.bindEvent()

        this.initHoverEffect()
    }

    private bindEvent() {
        document.addEventListener('mousemove', this.onMove.bind(this))

        document.addEventListener('mouseleave', () => {
            gsap.to(this.mesh.scale, {
                x: 0,
                y: 0,
                duration: 0.2,
            })
        })

        document.addEventListener('mouseenter', () => {
            gsap.to(this.mesh.scale, {
                x: 1,
                y: 1,
                duration: 0.2,
            })
        })
    }

    public onMove(e: MouseEvent) {
        this.cursorX = (e.clientX / window.innerWidth) * 2 - 1
        this.cursorY = -(e.clientY / window.innerHeight) * 2 + 1

        this.cursorVec.set(
            lerp(this.cursorX, (e.clientX / window.innerWidth) * 2 - 1, 1),
            this.cursorY,
            0.5
        )

        this.cursorVec.unproject(this.camera)
        this.cursorVec.sub(this.camera.position).normalize()
        const distance = -this.camera.position.z / this.cursorVec.z
        this.position.copy(this.camera.position).add(this.cursorVec.multiplyScalar(distance))

        this.uniforms.uOffset.value.set(
            clamp(e.movementX * 0.003, -0.1, 0.1),
            clamp(-e.movementY * 0.003, -0.1, 0.1)
        )
    }

    public animate() {
        if (window.isMobile) return
        this.mesh.position.set(this.position.x, this.position.y, 0)
        this.uniforms.uOffset.value.set(
            lerp(this.uniforms.uOffset.value.x, 0, 0.2),
            lerp(this.uniforms.uOffset.value.y, 0, 0.2)
        )
    }

    public changeTextureByName(textureName: CursorTextures) {
        if (window.isMobile) return
        this.uniforms.uTexture.value = this.cursorTextures.get(textureName)!
    }

    public changeTexture(texture: Texture) {
        if (window.isMobile) return
        this.uniforms.uTexture.value = texture
    }

    public initHoverEffect() {
        document.querySelectorAll<HTMLElement>('[data-hover]').forEach((elem) => {
            const data = elem.getAttribute('data-hover')
            if (typeof data === 'string' && (data as CursorTextures) in CURSOR_TEXTURES_URL) {
                elem.addEventListener('mousemove', () => this.changeTextureByName(data as CursorTextures))
                elem.addEventListener('mouseleave', () => this.changeTextureByName('default'))
            }
        })
    }

}