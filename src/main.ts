import * as THREE from 'three'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Cursor from '@/ts/Cursor'
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
import Header from './ts/Header'
import skills from './ts/Skills'
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
let threeLoaded = false

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
            gsap.set(preloader, {
                display: 'none'
            })
            gsap.set(app, {
                opacity: 1,
                overflow: 'initial',
                height: 'auto'
            })

            header.in()

            ScrollTrigger.refresh()
        }, 500)
    }
}, 100)
new Scroll()
new skills()

new MobileNavigation()
const mainScene = new MainScene(fbxLoader)
const portfolioScene = new PortfolioScene()
const cursor = new Cursor(mainScene.scene, mainScene.camera)
new Navigation(cursor)
const particles = new Particles(mainScene.scene);

new Parallax('.parallax-element')

new Rellax('.rellax', { speed: -2, });


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