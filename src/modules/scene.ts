import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'

export default class MyScene {

    declare scene: Scene
    declare camera: PerspectiveCamera
    declare renderer: WebGLRenderer

    constructor() {
        // create a renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.domElement.style.position = "fixed";
        this.renderer.domElement.style.top = "0px";
        this.renderer.domElement.style.left = "0px";

        // set renderer background color to transparent
        this.renderer.setClearColor(0x000000, 0);

        document.body.appendChild(this.renderer.domElement);

        // create a camera
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // handle window resize
        const onWindowResize = () => {
            // update camera aspect ratio
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            // update renderer size
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // listen for window resize event
        window.addEventListener('resize', onWindowResize, false);

        // create a scene
        this.scene = new Scene();
    }
}