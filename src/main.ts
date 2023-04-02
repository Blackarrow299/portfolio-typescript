import * as THREE from 'three'
import gsap, { Power1 } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import Observer from 'gsap/Observer'
import ScrollTrigger from 'gsap/ScrollTrigger'
import initParallax from './utils/parallax'
import Cursor from './modules/cursor'
import Lenis from '@studio-freight/lenis'
import { LetterFadeInAnimation } from './utils/lettersFadeInAnimation'
import Rellax from 'rellax'
import Fps from './modules/fps'
// import LocomotiveScroll from 'locomotive-scroll';

// const locoScroll = new LocomotiveScroll({
//     el: document.querySelector<HTMLElement>('[data-scroll-container]')!,
//     smooth: true
// });

gsap.registerPlugin(ScrollToPlugin, Observer, ScrollTrigger)

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

const rellax = new Rellax('.rellax');

// create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";

// set renderer background color to transparent
renderer.setClearColor(0x000000, 0);

document.body.appendChild(renderer.domElement);

// create a camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// handle window resize
function onWindowResize() {
    // update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// listen for window resize event
window.addEventListener('resize', onWindowResize, false);

// create a scene
const scene = new THREE.Scene();

// create a texture loader
const textureLoader = new THREE.TextureLoader();

const cursor = new Cursor(textureLoader, scene, camera)

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

titleAnimation.fadeIn().then(() => titleAnimation.changeTo("ABOUT ME"))
titleAnimation1.fadeIn()


const tl = gsap.timeline({ paused: true })
tl.to('#welcome_big_title', {
    y: 10,
    scale: 0.5,
    duration: 0.5
}).to('#welcome_big_title', {
    scale: 1,
    duration: 0.1
})

// let isAnimating: Boolean = false
// let pageIndex: number = 0
// const pagesLength: number = 3

// function handleWheelEvent(e: WheelEvent) {
//     if (isAnimating) return
//     if (e.deltaY >= 100) {
//         if (pageIndex >= pagesLength) return
//         tl.play()
//         pageIndex++
//     } else if (e.deltaY <= 100) {
//         if (pageIndex <= 0) return
//         pageIndex--
//     }
// }

// window.addEventListener("wheel", (e) => {
//     //handleWheelEvent(e)
//     e.preventDefault();

//     const scrollAmount = e.deltaY * 1; // change the scroll speed as needed
//     const currentScrollPosition = window.scrollY;
//     // window.scrollTo({
//     //     top: currentScrollPosition + scrollAmount,
//     //     behavior: 'smooth'
//     // });
//     gsap.to(window, {
//         duration: 1,
//         scrollTo: {
//             y: currentScrollPosition + scrollAmount
//         },
//     })
// }, { passive: false })

//smooth scroll
// Observer.create({
//     target: window,
//     type: "wheel,touch",
//     onChangeY: (self) => {
//         const scrollAmount = self.deltaY * 1.8; // change the scroll speed as needed
//         const currentScrollPosition = window.scrollY;
//         gsap.to(window, {
//             duration: 1,
//             scrollTo: {
//                 y: currentScrollPosition + scrollAmount
//             },
//         })
//     },
//     preventDefault: true
// });

//parallax scroll effect
// document.querySelectorAll<HTMLElement>('[data-scroll]').forEach((elm) => {
//     const speed = elm.getAttribute('data-scroll-speed') || '0'
//     const lag = elm.getAttribute('data-scroll-delay') || '1'
//     const direction = elm.getAttribute('data-scroll-direction')
//     gsap.from(elm, {
//         scrollTrigger: {
//             trigger: elm,
//             scrub: +lag,
//         },
//         [direction === 'horizontal' ? 'x' : 'y']: `+=${100 * +speed}`,
//     })
// })

ScrollTrigger.create({
    trigger: ".welcome-section",
    start: "bottom 90% ",
    onEnter: () => {
        gsap.to("#fog", { opacity: 0, duration: 1 });

    },
    onLeaveBack: () => {
        gsap.to("#fog", { opacity: 1, duration: 1, ease: 'Power1.in' });

    }
});

// render the scene
function animate() {
    requestAnimationFrame(animate);
    cursor.animate()
    renderer.render(scene, camera);
}

animate();

new Fps()