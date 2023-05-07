import { PORTFOLIO_IMAGES } from "@/utils/constants"
import { getViewSize } from "@/utils/utils"
import { Clock, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2 } from "three"
import PortfolioScene from "./PortfolioScene"
// @ts-ignore
import vertex from "@/glsl/deformationVertex.glsl"
// @ts-ignore
import fragment from "@/glsl/showcaseFragment.glsl"
import { gsap } from "gsap"
import showCaseDetail from "./ShowCaseDetail"
import Slider from "./Slider"

const clock = new Clock()

export default class ShowCase {
    declare index
    declare camera: PerspectiveCamera
    declare scene: Scene
    declare mesh: Mesh
    declare private uOffset
    declare uniforms
    declare $els
    declare private scale
    declare private zoomVector
    declare rect
    declare private parent
    declare onGrid
    declare isAnimating
    declare private scroll
    declare private showCaseDetail
    declare textures

    constructor($el: HTMLElement, index: number, parent: PortfolioScene) {
        this.index = index
        this.$els = {
            elm: $el,
            gridTileElem: $el.querySelector<HTMLElement>('.p-showcase-tile')!,
            detailElem: $el.querySelector<HTMLElement>('.p-showcase-detail')!,
            detailTileElem: $el.querySelector<HTMLElement>('.p-showcase-detail-tile')!,
            activeElem: $el.querySelector<HTMLElement>('.p-showcase-tile')!
        }

        this.uOffset = parent.uOffset
        this.parent = parent

        this.textures = PORTFOLIO_IMAGES[index].map((url) => window.textureLoader.load(url))

        this.uniforms = {
            u_image: { value: this.textures[0] },
            u_nextImage: { value: this.textures[1] },
            u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
            u_offset: this.uOffset,
            u_power: { value: .5 },
            u_disp: { value: 0 },
            u_time: { value: 0 },
            u_progress: { value: 0 },
            u_hover: { value: 0 }
        }

        const { width, height } = this.$els.gridTileElem.getBoundingClientRect()

        this.rect = {
            width,
            height,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }

        this.scale = {
            x: 0,
            y: 0
        }

        this.zoomVector = {
            x: 0,
            y: 0,
        }

        this.onGrid = true
        this.isAnimating = false

        this.showCaseDetail = new showCaseDetail(this.$els.detailElem, this, this.parent.renderer)

        this.init()
        new Slider(this)
    }

    private init() {
        this.setupCamera()

        const { width: scaleX, height: scaleY } = getViewSize(this.camera)
        this.scale.x = scaleX
        this.scale.y = scaleY

        const zoomValue = 1.1
        this.zoomVector.x = scaleX * zoomValue
        this.zoomVector.y = scaleY * zoomValue

        this.scene = new Scene();
        this.setupMesh()
        this.scene.add(this.mesh);
        this.bindEvent()
    }

    private bindEvent() {
        this.$els.gridTileElem.addEventListener('mouseenter', this.onMouseEnter.bind(this))
        this.$els.gridTileElem.addEventListener('mouseleave', this.onMouseLeave.bind(this))
        this.$els.gridTileElem.addEventListener('click', this.onClick.bind(this))
        window.addEventListener('resize', this.onResize.bind(this))
    }

    onMouseEnter() {
        gsap.to(this.$els.gridTileElem, {
            opacity: 1,
            duration: 0.5
        })

        gsap.to(this.uniforms.u_hover, {
            value: 1,
            duration: 0.5
        })

        gsap.to
        this.zoomIn()
    }

    onMouseLeave() {
        gsap.to(this.$els.gridTileElem, {
            opacity: 0,
            duration: 0.5
        })
        gsap.to(this.uniforms.u_hover, {
            value: 0,
            duration: 0.5
        })

        this.zoomOut()
    }

    onClick() {
        this.showCaseDetail.in()
    }

    private onResize() {
        this.updateMeshScale()
    }

    private setupMesh() {
        const geometry = new PlaneGeometry(1, 1, 20, 20);

        const material = new ShaderMaterial({
            alphaTest: 0,
            transparent: true,
            uniforms: this.uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            defines: {
                PR: window.devicePixelRatio.toFixed(1)
            }
        });

        this.mesh = new Mesh(geometry, material);
        this.updateMeshScale()

    }

    zoomOut() {

        const { width: x, height: y } = getViewSize(this.camera)

        gsap.to(this.scale, {
            x,
            y,
            duration: 0.5
        })
    }

    zoomIn() {

        gsap.to(this.scale, {
            x: this.zoomVector.x,
            y: this.zoomVector.y,
            duration: 0.5
        })
    }

    updateMeshScale() {
        this.mesh.scale.set(this.scale.x, this.scale.y, 1)
    }

    private setupCamera() {
        // create a camera
        this.camera = new PerspectiveCamera(75, this.rect.width / this.rect.height, 0.1, 1000);
        this.camera.position.z = 5;
    }

    animate() {
        this.uniforms.u_time.value = clock.getElapsedTime()
        this.updateMeshScale()
        if (!this.isAnimating) {
            //console.log('!animatin');

            const rect = this.$els.activeElem.getBoundingClientRect();
            const { left, right, top, bottom, width, height } = rect;

            this.rect.left = left
            this.rect.right = right
            this.rect.top = top
            this.rect.bottom = bottom

            this.rect.width = width
            this.rect.height = height
        }

        const isOffscreen =
            this.rect.bottom < 0 ||
            this.rect.top > this.parent.renderer.domElement.clientHeight ||
            this.rect.right < 0 ||
            this.rect.left > this.parent.renderer.domElement.clientWidth;

        if (!isOffscreen) {
            const positiveYUpBottom = this.parent.renderer.domElement.clientHeight - this.rect.bottom;
            this.parent.renderer.setScissor(this.rect.left, positiveYUpBottom, this.rect.width, this.rect.height);
            this.parent.renderer.setViewport(this.rect.left, positiveYUpBottom, this.rect.width, this.rect.height);

            this.camera.aspect = this.rect.width / this.rect.height;
            this.camera.updateProjectionMatrix();
            this.parent.renderer.render(this.scene, this.camera);
        }
    }
}