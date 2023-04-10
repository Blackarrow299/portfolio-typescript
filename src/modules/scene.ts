import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'

export default class MyScene {

    declare scene: Scene
    declare camera: PerspectiveCamera

    constructor(cfg?: {
        cameraZ?: number,
        fov?: number,
        aspect?: number,
        near?: number,
        far?: number
    }) {
        // create a camera
        this.camera = new PerspectiveCamera(
            cfg?.fov || 75,
            cfg?.aspect || window.innerWidth / window.innerHeight,
            cfg?.near || 0.1,
            cfg?.far || 1000
        );
        this.camera.position.z = cfg?.cameraZ || 5;



        // create a scene
        this.scene = new Scene();
    }
}