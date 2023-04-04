import * as THREE from 'three'
import gsap, { Power1 } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import initParallax from './utils/parallax'
import Cursor from './modules/cursor'
import Lenis from '@studio-freight/lenis'
import { LetterFadeInAnimation } from './utils/lettersFadeInAnimation'
import Rellax from 'rellax'
import Fps from './modules/fps'
import MyScene from './modules/scene'
//import { Text } from 'troika-three-text'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loadingManager = new THREE.LoadingManager()

const fbxLoader = new FBXLoader(loadingManager)
// create a texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

let head: THREE.Group | undefined

fbxLoader.load('/head.fbx', (object) => {
    console.log('head load complete');
    const headMaterial = new THREE.MeshLambertMaterial({
        // color: new THREE.Color("#cccccc"),
        opacity: 0.2,
        transparent: true,
        wireframe: false,
    })

    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = headMaterial;
        }
    });
    object.position.set(0, 0, 0)
    object.scale.set(0.01, 0.01, 0.01);
    head = object
    scene.add(head)
});


const lenis = new Lenis({
    duration: 2.3
})


lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

function raf(time: any) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

//initialize the parallax effect
initParallax()

new Rellax('.rellax');

const { camera, scene, renderer } = new MyScene()
const cursor = new Cursor(textureLoader, scene, camera)
// Set up the lighting
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);
// const myText = new Text()
// scene.add(myText)

// // Set properties to configure:
// myText.text = 'YASSINE GOUMNI'
// myText.font = '/fonts/Humane-Bold.ttf'
// myText.fontSize = 3
// myText.letterSpacing = 0.15
// myText.position.z = -2
// myText.color = 0xFFFFFF

// // Update the rendering:
// myText.sync()

// const textMesh = new THREE.Mesh


// const vertex = `  
//     uniform sampler2D uTexture;
//       varying vec2 vUv;

//       void main(){
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
// `
// const fragment = `
//       uniform sampler2D uTexture;
//       uniform float uAlpha;
//       varying vec2 vUv;

//       void main(){
//           vec3 color = texture2D(uTexture, vUv).rgb;
//           gl_FragColor = vec4(color, 1.0);

//       }`


// const textMaterial = new THREE.ShaderMaterial({
//     alphaTest: 0,
//     uniforms: { uTexture: { value: textureLoader.load('/hero_title.png') } },
//     vertexShader: vertex,
//     fragmentShader: fragment
// })

// const textGeometry = new THREE.PlaneGeometry(7, 1.5, 20, 20)

// textMesh.geometry = textGeometry
// textMesh.material = textMaterial

// textMesh.position.set(0, 0, 0)

// scene.add(textMesh)


//load navigation textures
const navigationTextures: THREE.Texture[] | null = await Promise.all([
    textureLoader.loadAsync('/images/navigation/welcome.png'),
    textureLoader.loadAsync('/images/navigation/about.png'),
    textureLoader.loadAsync('/images/navigation/myworks.png'),
    textureLoader.loadAsync('/images/navigation/contact.png')
]).then((values) => {
    return values
}).catch(() => {
    return null
})

//navigation hover effect
const navigations = document.querySelector<HTMLElement>('nav')
if (navigationTextures && navigations) {
    navigations.addEventListener('mousemove', (e) => {
        let target = e.target as Element
        if (target.tagName === 'LI') {
            cursor.changeTexture(navigationTextures[+target.getAttribute('data-index')!])
            gsap.to(cursor.mesh.scale, {
                x: 3.5,
                y: 1.8,
                duration: 0.1,
                ease: Power1.easeIn
            })
        }
    })
    navigations.addEventListener('mouseleave', () => {
        gsap.to(cursor.mesh.scale, {
            x: 1,
            y: 1,
            duration: 0.1,
            ease: Power1.easeOut
        })
        cursor.resetTexture()
    })
}

// welcome page big title
const cursorHiTexture = textureLoader.load('/images/cursor/hi.svg')
const welcome_big_title = document.querySelector<HTMLElement>('#welcome_big_title')
welcome_big_title?.addEventListener('mousemove', () => {
    cursor.changeTexture(cursorHiTexture)
})
welcome_big_title?.addEventListener('mouseleave', () => {
    cursor.resetTexture()
})

const titleAnimation = new LetterFadeInAnimation(welcome_big_title?.querySelector('h1'), 0.05)
const titleAnimation1 = new LetterFadeInAnimation(welcome_big_title?.querySelector('h2'), 0.05)

titleAnimation.fadeIn()
titleAnimation1.fadeIn()

ScrollTrigger.create({
    trigger: ".welcome-section",
    start: "bottom 90% ",
    onEnter: () => {
        gsap.to(["#fog", "#scrollDown", "#h-socials"], { opacity: 0, duration: 1 });
    },
    onLeaveBack: () => {
        gsap.to(["#fog", "#scrollDown", "#h-socials"], { opacity: 1, duration: 1, ease: 'Power1.in' });
    }
});

ScrollTrigger.create({
    trigger: 'body', // Replace with the ID of the trigger element
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: function (self) {
        // Get the current scroll progress
        var progress = self.progress;

        // Rotate the object based on the scroll progress
        head?.rotation.setFromVector3(new THREE.Vector3(0, progress * 0.1 * Math.PI * 2, 0), 'XYZ')
    }
});

// Create a new clock
const clock = new THREE.Clock();

// render the scene
function animate() {
    requestAnimationFrame(animate);
    cursor.animate()
    //head?.rotation.setFromVector3(new THREE.Vector3(0, clock.getElapsedTime() * 0.1, 0), 'XYZ')
    renderer.render(scene, camera);
}

animate();

new Fps()