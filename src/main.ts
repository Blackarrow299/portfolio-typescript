import * as THREE from 'three'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Cursor from '@/ts/Cursor'
// import Fps from './modules/fps'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Particles from '@/ts/Particles'
import IsMobileDevice from './ts/IsMobileDevice'
import MobileNavigation from './ts/MobileNav'
import MainScene from './ts/MainScene'
import PortfolioScene from './ts/PortfolioScene'
import Scroll from './ts/Scroll'
import Parallax from './ts/Parallax'
import Header from './ts/Header'
import Skills from './ts/Skills'
import Navigation from './ts/Navigation'

const app = document.querySelector<HTMLElement>('#app')!
window.app = app

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
new IsMobileDevice()

const preloader = document.querySelector('#preloader')

const loadingManager = new THREE.LoadingManager()
const fbxLoader = new FBXLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager);
window.textureLoader = textureLoader

let windowLoaded = false
let threeLoaded = true

window.addEventListener('load', () => {
    windowLoaded = true
})

loadingManager.onLoad = function () {
    threeLoaded = true
}

const header = new Header()

const loadingInterval = setInterval(() => {
    if (windowLoaded && threeLoaded) {
        clearInterval(loadingInterval)
        setTimeout(() => {
            const target = preloader?.querySelectorAll<HTMLElement>('.bg-half')!

            const tl = gsap.timeline()

            tl.to(preloader?.querySelector('h2')!, {
                opacity: 0,
                duration: 0.5,
                ease: 'Power4.out'
            })

            tl.to(target[0], {
                y: '-100%',
                duration: 1,
                ease: 'Power4.in'
            })

            tl.to(target[1], {
                y: '100%',
                duration: 1,
                ease: 'Power4.in'
            }, '<')

            tl.call(() => {
                header.in()
            }, [], '<+=0.2')

            tl.set(preloader, {
                display: 'none'
            })

            gsap.set(app, {
                overflow: 'initial',
                height: 'auto'
            })

            ScrollTrigger.refresh()
        }, 500)
    }
}, 100)

new Scroll()
new Skills()
new MobileNavigation()
const mainScene = new MainScene(fbxLoader)
const portfolioScene = new PortfolioScene()
const cursor = new Cursor(mainScene.scene, mainScene.camera)
new Navigation(cursor)
const particles = new Particles(mainScene.scene);
new Parallax('.parallax-element')

// render the scene
function animate() {
    requestAnimationFrame(animate);
    portfolioScene.animate()
    particles.animate()
    cursor.animate()
    mainScene.animate()
}
animate();
//new Fps()