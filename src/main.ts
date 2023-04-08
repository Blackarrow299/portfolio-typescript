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
import Particles from './modules/particles'

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
    const headMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color("#cccccc"),
        opacity: 0.2, //old val : 0.2
        transparent: true,
        wireframe: false,
    })

    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = headMaterial;
        }
    });
    object.position.set(0, 0, -5)
    object.scale.set(0.02, 0.02, 0.02);
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

// Initialize Rellax.js
var rellax = new Rellax('.rellax', {
    speed: -2, // Set the speed property to a negative value
});

// // Delay the parallax effect for 2 seconds
// setTimeout(function () {
//     rellax.refresh(); // Refresh the Rellax.js instance to apply the delay
// }, 2000);

const { camera, scene, renderer } = new MyScene()
//const { camera: camera1, renderer: renderer1, scene: scene1 } = new MyScene({ cameraZ: 10 })

const cursor = new Cursor(textureLoader, scene, camera)
// Set up the lighting
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

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
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: function (self) {
        // Get the current scroll progress
        var progress = self.progress;

        // Rotate the object based on the scroll progress
        head?.rotation.setFromVector3(new THREE.Vector3(0, progress * 0.1 * Math.PI * 2, 0), 'XYZ')
    }
});

const { particles, particlesMaterial } = new Particles(scene);

ScrollTrigger.create({
    trigger: '#about',
    start: 'top top',
    onEnter: function () {
        gsap.to(particlesMaterial, {
            duration: 0.5,
            opacity: 1,
            onUpdate: () => {
                // Update the opacity during the animation
                particlesMaterial.needsUpdate = true; // Update material to reflect changes
            },
        });
    },
    onLeaveBack: function () {
        gsap.to(particlesMaterial, {
            duration: 0.5,
            opacity: 0,
            onUpdate: () => {
                // Update the opacity during the animation
                particlesMaterial.needsUpdate = true; // Update material to reflect changes
            },
        });
    }, onUpdate: function () {
        gsap.to(particles.position, {
            y: () => {
                // Get the current scroll position and use it to calculate the target y position
                const scrollY = window.scrollY;
                const targetY = scrollY * 0.01; // You can adjust the factor to control the animation speed
                return targetY;
            },
        });
    }
});

//parallax
// const cursorPosition = new THREE.Vector2(0, 0)

// window.addEventListener('mousemove', (event) => {
//     cursorPosition.x = event.clientX / window.innerWidth - 0.5
//     cursorPosition.y = event.clientY / window.innerHeight - 0.5
// })

// render the scene
function animate() {
    requestAnimationFrame(animate);
    //particles.position.x = - cursorPosition.x * 0.5
    //particles.position.y = cursorPosition.y * 0.5
    cursor.animate()
    //head?.rotation.setFromVector3(new THREE.Vector3(0, clock.getElapsedTime() * 0.1, 0), 'XYZ')
    //renderer1.render(scene1, camera1);
    renderer.render(scene, camera);

}

animate();

new Fps()