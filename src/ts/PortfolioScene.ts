import { deformationVertex, portfolioNoiseFragment } from "@/glsl";
import { Color, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from "three";
import PORTFOLIO_IMAGES from "@/data/portfolio-images";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { getViewSize } from "@/utils/utils";
import Scroll from "./Scroll";

const clearColor = new Color('#000');
let isScrolling: NodeJS.Timeout;

export default class PortfolioScene {
    declare public renderer: WebGLRenderer
    declare scene: Scene
    declare camera: PerspectiveCamera
    declare private sceneElements: { elm: HTMLElement, fn: Function }[]
    declare private uOffset
    declare private textureLoader
    declare private scaleX: number
    declare private scaleY: number
    declare private scroll: Scroll

    constructor(textureLoader: TextureLoader, scroll: Scroll) {
        this.scroll = scroll
        this.textureLoader = textureLoader
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.sceneElements = []
        this.uOffset = { value: new Vector2(0, 0) }
        this.init()
    }

    init() {
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '2'
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        document.querySelectorAll<HTMLElement>('[data-portfolio-tile]').forEach((elem, index) => {
            const { width, height } = elem.getBoundingClientRect()
            const uniforms = {
                uTexture: { value: this.textureLoader.load(PORTFOLIO_IMAGES[index][0]) },
                uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
                uDisp: { value: 1.0 },
                uOffset: this.uOffset,
                uAlpha: { value: 1 },
                uOverlay: { value: 0 }
            }

            elem.addEventListener('mouseenter', () => {
                gsap.to(elem, {
                    opacity: 1,
                    duration: 0.5
                })

                gsap.to(uniforms.uOverlay, {
                    value: 0.8,
                    duration: 0.8
                })
            })

            elem.addEventListener('mouseleave', () => {
                gsap.to(elem, {
                    opacity: 0,
                    duration: 0.5
                })

                gsap.to(uniforms.uOverlay, {
                    value: 0,
                    duration: 0.5
                })
            })

            ScrollTrigger.create({
                trigger: elem,
                start: 'top center+=20%',
                end: 'bottom top',
                onEnter() {
                    gsap.to(uniforms.uDisp, {
                        value: 0.0,
                        duration: 0.5
                    })
                }
            })

            // create a camera
            this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 5;
            // create a scene
            this.scene = new Scene();

            const geometry = new PlaneGeometry(1, 1, 20, 20);

            const material = new ShaderMaterial({
                alphaTest: 0,
                transparent: true,
                uniforms: uniforms,
                fragmentShader: portfolioNoiseFragment,
                vertexShader: deformationVertex
            });

            const mesh = new Mesh(geometry, material);

            const { width: scaleX, height: scaleY } = getViewSize(this.camera)
            this.scaleX = scaleX
            this.scaleY = scaleY

            mesh.scale.set(this.scaleX, this.scaleY, 1)

            this.scene.add(mesh);

            this.addScene(elem, (rect: any) => {
                this.camera.aspect = rect.width / rect.height;
                this.camera.updateProjectionMatrix();
                this.renderer.render(this.scene, this.camera);
            })
        })

        this.bindEvent()
    }

    bindEvent() {
        // listen for window resize event
        window.addEventListener('resize', this.onResize.bind(this), false)
        window.addEventListener('wheel', this.onScroll.bind(this))
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    onScroll(e: WheelEvent) {
        clearTimeout(isScrolling);
        // Set a timeout to detect when scrolling stops
        isScrolling = setTimeout(() => {
            // Scrolling stopped
            gsap.to(this.uOffset.value, {
                y: 0,
                duration: 0.5
            })
        }, 500);
        if (e.deltaY > 0) {
            // Scrolling down
            gsap.to(this.uOffset.value, {
                y: 0.08,
                duration: 0.5
            })
        } else if (e.deltaY < 0) {
            // Scrolling up
            gsap.to(this.uOffset.value, {
                y: -0.08,
                duration: 0.5
            })
        }
    }

    addScene(elm: HTMLElement, fn: Function) {
        this.sceneElements.push({ elm, fn });
    }

    animate() {
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(clearColor, 0);
        this.renderer.clear(true, true);
        this.renderer.setScissorTest(true);

        const transform = `translateY(${window.scrollY}px)`;
        this.renderer.domElement.style.transform = transform;

        for (const { elm, fn } of this.sceneElements) {

            // get the viewport relative position of this element
            const rect = elm.getBoundingClientRect();
            const { left, right, top, bottom, width, height } = rect;

            const isOffscreen =
                bottom < 0 ||
                top > this.renderer.domElement.clientHeight ||
                right < 0 ||
                left > this.renderer.domElement.clientWidth;

            if (!isOffscreen) {
                const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom;
                this.renderer.setScissor(left, positiveYUpBottom, width, height);
                this.renderer.setViewport(left, positiveYUpBottom, width, height);
                fn(rect);
            }
        }
    }
}