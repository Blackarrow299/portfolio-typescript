import { TextureLoader, Mesh, Scene, Vector3, Vector2, PlaneGeometry, ShaderMaterial, Camera, Texture } from 'three'
import isMobileDevice from '@/utils/isMobileDevice'
import { lerp } from '../utils/utils'
import { gsap } from 'gsap'
import { deformationVertex as cursorVertex, cursorFragment } from '@/glsl'

export interface Uniforms {
    uOffset: { value: Vector2 }
    uTexture: { value: Texture }
    uAlpha: { value: number }
}

const CURSOR_TEXTURES_URL = {
    hi: "/images/cursor/hi.svg",
    visit: "",
    default: "/images/cursor/cursor.png",
}

type CursorTextures = keyof typeof CURSOR_TEXTURES_URL

export default class Cursor {


    declare private scene: Scene
    declare private textureLoader: TextureLoader
    declare private camera: Camera
    declare public mesh: Mesh
    declare public uniforms: Uniforms
    declare public position: Vector3
    //declare public defaultTexture: Texture
    declare cursorTextures: Map<CursorTextures, Texture>

    constructor(textureLoader: TextureLoader, scene: Scene, camera: Camera) {
        this.scene = scene
        this.textureLoader = textureLoader
        this.camera = camera
        this.init()
    }

    private init(): void {
        if (isMobileDevice()) return
        // create a mesh
        this.mesh = new Mesh();
        //cursor postion
        this.position = new Vector3(0, 0, 1)
        // set the mesh position
        this.mesh.position.set(1, 0, 0)
        //load texture for the cursor

        this.cursorTextures = new Map()
        let textureTitle: CursorTextures
        for (textureTitle in CURSOR_TEXTURES_URL) {
            if (CURSOR_TEXTURES_URL.hasOwnProperty(textureTitle)) {
                this.cursorTextures.set(textureTitle, this.textureLoader.load(CURSOR_TEXTURES_URL[textureTitle]));
            }
        }

        this.uniforms = {
            uOffset: { value: new Vector2(0, 0) },
            uTexture: { value: this.cursorTextures.get('default')! },
            uAlpha: { value: 0.5 },
        }

        // create a plane geometry
        const cursorMeshGeometry = new PlaneGeometry(0.5, 0.5, 20, 20);
        // create a shader material
        const cursorMeshMaterial = new ShaderMaterial({
            alphaTest: 0,
            uniforms: this.uniforms,
            vertexShader: cursorVertex,
            fragmentShader: cursorFragment,
        });

        this.mesh.geometry = cursorMeshGeometry
        this.mesh.material = cursorMeshMaterial
        //add the cursor mesh to the scene
        this.scene.add(this.mesh)

        const vec = new Vector3()
        document.addEventListener('mousemove', (e) => {
            let cursorX = (e.clientX / window.innerWidth) * 2 - 1
            let cursorY = -(e.clientY / window.innerHeight) * 2 + 1
            vec.set(
                cursorX,
                cursorY,
                0.5
            )
            vec.unproject(this.camera)
            vec.sub(this.camera.position).normalize()
            const distance = -this.camera.position.z / vec.z
            this.position.copy(this.camera.position).add(vec.multiplyScalar(distance))

            this.uniforms.uOffset.value.set(
                e.movementX * 0.003,
                -e.movementY * 0.003
            )
        })

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

    public animate() {
        if (isMobileDevice()) return
        this.mesh.position.set(this.position.x, this.position.y, 0)
        this.uniforms.uOffset.value.set(
            lerp(this.uniforms.uOffset.value.x, 0, 0.2),
            lerp(this.uniforms.uOffset.value.y, 0, 0.2)
        )
    }

    public changeTextureByName(textureName: CursorTextures) {
        if (isMobileDevice()) return
        this.uniforms.uTexture.value = this.cursorTextures.get(textureName)!
    }

    public changeTexture(texture: Texture) {
        if (isMobileDevice()) return
        this.uniforms.uTexture.value = texture
    }

}