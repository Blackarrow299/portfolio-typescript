import * as THREE from 'three'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Cursor from '@/ts/Cursor'
import { LetterFadeInAnimation } from './utils/lettersFadeInAnimation'
import Rellax from 'rellax'
// import Fps from './modules/fps'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Particles from '@/ts/Particles'
import IsMobileDevice from './ts/IsMobileDevice'
import MobileNavigation from './ts/MobileNav'
import MainScene from './ts/MainScene'
import PortfolioScene from './ts/PortfolioScene'
import Scroll from './ts/Scroll'
import Parallax from './ts/Parallax'

const app = document.querySelector<HTMLElement>('#app')!
window.app = app

new IsMobileDevice()

const preloader = document.querySelector('#preloader')

const loadingManager = new THREE.LoadingManager()
const fbxLoader = new FBXLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager);
window.textureLoader = textureLoader

let windowLoaded = false
let threeLoaded = false

window.addEventListener('load', () => {
    windowLoaded = true
})

loadingManager.onLoad = function () {
    threeLoaded = true
}

const loadingInterval = setInterval(() => {
    if (windowLoaded && threeLoaded) {
        clearInterval(loadingInterval)
        setTimeout(() => {
            gsap.set(preloader, {
                display: 'none'
            })
            gsap.set(app, {
                opacity: 1,
                overflow: 'initial',
                height: 'auto'
            })

            ScrollTrigger.refresh()
        }, 1000)
    }
}, 100)

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

new Scroll()
const mainScene = new MainScene(fbxLoader)
const portfolioScene = new PortfolioScene()
const particles = new Particles(mainScene.scene);
new MobileNavigation()
// const slider = new Slider(PORTFOLIO_IMAGES[0], textureLoader)
new Parallax('.parallax-element')
const cursor = new Cursor(mainScene.scene, mainScene.camera)

new Rellax('.rellax', { speed: -2, });

const welcome_big_title = document.querySelector<HTMLElement>('#welcome_big_title')
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

// render the scene
function animate() {
    requestAnimationFrame(animate);
    portfolioScene.animate()
    particles.animate()
    // slider.render()
    cursor.animate()
    mainScene.animate()
}
animate();
//new Fps()