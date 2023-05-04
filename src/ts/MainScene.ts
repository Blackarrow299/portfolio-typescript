import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Color, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export default class MainScene {
    declare public renderer: WebGLRenderer
    declare public scene: Scene
    declare public camera: PerspectiveCamera
    declare head: THREE.Group
    declare fbxLoader: FBXLoader
    declare isRendering
    constructor(fbxLoader: FBXLoader) {
        this.isRendering = true
        this.fbxLoader = fbxLoader
        // create a renderer
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.domElement.style.position = "fixed";
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.id = 'c-main'
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

        // create a scene
        this.scene = new Scene();

        this.setupLight()

        fbxLoader.load('/head.fbx', (object) => {
            const headMaterial = new MeshLambertMaterial({
                color: new Color("#cccccc"),
                opacity: 0.2,
                transparent: true,
            })
            object.traverse(function (child) {
                if (child instanceof Mesh) {
                    child.material = headMaterial;
                }
            });
            object.position.set(0, 0, -5)
            object.scale.set(0.02, 0.02, 0.02);
            this.head = object
            this.scene.add(this.head)
        });

        ScrollTrigger.create({
            trigger: window.app,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                // Get the current scroll progress
                var progress = self.progress;
                // Rotate the object based on the scroll progress
                this.head.rotation.setFromVector3(new Vector3(0, progress * 0.1 * Math.PI * 2, 0), 'XYZ')
            }
        });

        this.bindEvents()
    }

    bindEvents() {
        window.addEventListener('resize', this.onResize.bind(this), false);
        document.addEventListener('MainScene:Stop', () => this.isRendering = false)
        document.addEventListener('MainScene:Start', () => this.isRendering = true)
    }

    // handle window resize
    onResize() {
        // update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        // update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupLight() {
        // Set up the lighting
        // var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // scene.add(ambientLight);
        var directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }


    animate() {
        //requestAnimationFrame(this.animate.bind(this))
        if (!this.isRendering) return
        this.renderer.render(this.scene, this.camera);
    }
}