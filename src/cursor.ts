import { TextureLoader, Mesh, Scene, Vector3, Vector2, PlaneGeometry, ShaderMaterial, Camera, Texture } from 'three'
import isMobileDevice from './utils/isMobileDevice'
import { lerp } from './utils/utils'

export interface Uniforms {
    uOffset: { value: Vector2 }
    uTexture: { value: Texture }
    uAlpha: { value: number }
}

export default class Cursor {

    declare private scene: Scene
    declare private textureLoader: TextureLoader
    declare private camera: Camera
    declare public mesh: Mesh
    declare public uniforms: Uniforms
    declare public position: Vector3
    declare public defaultTexture: Texture

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
        this.position = new Vector3(0, 0, 0)
        // set the mesh position
        this.mesh.position.set(1, 0, 0)
        //load texture for the cursor
        this.defaultTexture = this.textureLoader.load('/images/cursor/cursor.png')

        this.uniforms = {
            uOffset: { value: new Vector2(0, 0) },
            uTexture: { value: this.defaultTexture },
            uAlpha: { value: 0.5 },
        }

        const cursorVertex = `
      uniform sampler2D uTexture;
      uniform vec2 uOffset;
      varying vec2 vUv;

      float M_PI = 3.141529;
      float test = 10.5;

      vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
          position.x = position.x + sin(uv.y * M_PI) * offset.x;
          position.y = position.y + sin(uv.x * M_PI) * offset.y;
          return position;
      }

      void main(){
          vUv = uv;
          vec3 newPosition = deformationCurve(position, uv, uOffset);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `
        const cursorFragment = `
      uniform sampler2D uTexture;
      uniform float uAlpha;
      varying vec2 vUv;

      void main(){
          vec3 color = texture2D(uTexture, vUv).rgb;
          gl_FragColor = texture2D(uTexture, vUv);
          
      }`

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
            vec.set(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
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
    }

    public animate() {
        if (isMobileDevice()) return
        this.mesh.position.set(this.position.x, this.position.y, 0)
        this.uniforms.uOffset.value.set(
            lerp(this.uniforms.uOffset.value.x, 0, 0.2),
            lerp(this.uniforms.uOffset.value.y, 0, 0.2)
        )
    }

    public changeTexture(texture: Texture) {
        if (isMobileDevice()) return
        this.uniforms.uTexture.value = texture
    }

    public resetTexture() {
        if (isMobileDevice()) return
        this.uniforms.uTexture.value = this.defaultTexture
    }

}