import { Color, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { gsap } from "gsap";
import ShowCase from "./ShowCase";

const clearColor = new Color('#000');
let isScrolling: NodeJS.Timeout;

export default class PortfolioScene {
    declare public renderer: WebGLRenderer
    declare scene: Scene
    declare camera: PerspectiveCamera
    declare private showCases: ShowCase[]
    declare uOffset
    declare private scaleX: number
    declare private scaleY: number

    constructor() {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.uOffset = { value: new Vector2(0, 0) }
        this.showCases = []
        this.init()
    }

    private init() {
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1'
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        document.querySelectorAll<HTMLElement>('.p-showcase').forEach(($el, index) => {
            const showCase = new ShowCase($el, index, this)
            this.showCases.push(showCase)
        })

        this.bindEvent()
    }

    private bindEvent() {
        // listen for window resize event
        window.addEventListener('resize', this.onResize.bind(this), false)
        window.addEventListener('wheel', this.onScroll.bind(this))
    }

    private onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private onScroll(e: WheelEvent) {
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

    animate() {
        this.renderer.setScissorTest(false);
        this.renderer.setClearColor(clearColor, 0);
        this.renderer.clear(true, true);
        this.renderer.setScissorTest(true);

        const transform = `translateY(${window.scrollY}px)`;
        this.renderer.domElement.style.transform = transform;

        this.showCases.forEach((showCase) => {
            showCase.animate()
        })
    }
}