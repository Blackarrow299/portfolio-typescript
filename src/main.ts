import * as THREE from 'three'
import gsap, { Power1 } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import initParallax from './utils/parallax'
import Cursor, { CURSOR_TEXTURES_URL } from './modules/cursor'
import Lenis from '@studio-freight/lenis'
import { LetterFadeInAnimation } from './utils/lettersFadeInAnimation'
import Rellax from 'rellax'
import Fps from './modules/fps'
import MyScene from './modules/scene'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Particles from './modules/particles'
import { deformationVertex, portfolioNoiseFragment } from './glsl'
import { CursorTextures } from './modules/cursor'

const app = document.querySelector('#app')
const preloader = document.querySelector('#preloader')
const loadingManager = new THREE.LoadingManager()

const fbxLoader = new FBXLoader(loadingManager)
// create a texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);

// loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
//     console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
// };

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

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '2'
renderer.setSize(window.innerWidth, window.innerHeight);
document.body?.appendChild(renderer.domElement);

// create a renderer
const mainRenderer = new THREE.WebGLRenderer();
mainRenderer.setSize(window.innerWidth, window.innerHeight);

mainRenderer.domElement.style.position = "fixed";
mainRenderer.domElement.style.top = '0';
mainRenderer.domElement.style.left = '0';

// set renderer background color to transparent
mainRenderer.setClearColor(0x000000, 0);

document.body.appendChild(mainRenderer.domElement);

const { camera, scene } = new MyScene()
// handle window resize
const onWindowResize = () => {

    portfolioMeshes.forEach(mesh => {
        updatePortfolioMeshScale(mesh)
    });

    // update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // update renderer size
    mainRenderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// listen for window resize event
window.addEventListener('resize', onWindowResize, false);

const sceneElements: { elm: HTMLElement, fn: Function }[] = [];
function addScene(elm: HTMLElement, fn: Function) {
    sceneElements.push({ elm, fn });
}

const uOffset = { value: new THREE.Vector2(0, 0) }
const portfolioMeshes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = []
document.querySelectorAll<HTMLElement>('.portfolio').forEach((elem, index) => {
    const pH = elem.querySelector('.p-hover')
    const test = textureLoader.load('/images/portfolio/portfolio-1.png')

    const uniforms = {
        uTexture: { value: test },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uDisp: { value: 1.0 },
        uOffset,
        uAlpha: { value: 1 },
        uOverlay: { value: 0 }
    }

    // elem.addEventListener('mousemove', () => {
    //     cursor.changeTextureByName('visit')
    // })

    elem.addEventListener('mouseenter', () => {
        gsap.to(pH, {
            opacity: 1,
            duration: 0.5
        })

        gsap.to(uniforms.uOverlay, {
            value: 0.8,
            duration: 0.8
        })
    })

    elem.addEventListener('mouseleave', () => {
        gsap.to(pH, {
            opacity: 0,
            duration: 0.5
        })

        gsap.to(uniforms.uOverlay, {
            value: 0,
            duration: 0.5
        })
    })

    ScrollTrigger.create({
        trigger: elem,
        start: 'top center+=20%',
        end: 'bottom top',
        onEnter() {
            gsap.to(uniforms.uDisp, {
                value: 0.0,
                duration: 0.5
            })
        }
    })

    const { scene, camera } = new MyScene({
        fov: 45,
        aspect: 2,
        far: 5,
        near: 0.1
    })

    const geometry = new THREE.PlaneGeometry(0.5, 0.5, 20, 20);

    const material = new THREE.ShaderMaterial({
        alphaTest: 0,
        transparent: true,
        uniforms: uniforms,
        fragmentShader: portfolioNoiseFragment,
        vertexShader: deformationVertex
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.34
    updatePortfolioMeshScale(mesh)
    //mesh.position.x = 1
    portfolioMeshes[index] = mesh
    scene.add(portfolioMeshes[index]);

    addScene(elem, (rect: any) => {
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    })
})

function updatePortfolioMeshScale(mesh: THREE.Mesh) {
    if (window.innerWidth < 768 && window.innerWidth > 376) {
        // For screens with width less than 768 pixels (mobile screens)
        mesh.scale.set(8.2, 5.6, 1)
    }
    else if (window.innerWidth < 376) {
        mesh.scale.set(7.5, 5.6, 1)
    } else {
        // For screens with width greater than or equal to 768 pixels (non-mobile screens)
        mesh.scale.set(10, 5.6, 1);
    }
}

let isScrolling: NodeJS.Timeout;
window.addEventListener('wheel', function (e) {
    clearTimeout(isScrolling);
    // Set a timeout to detect when scrolling stops
    isScrolling = setTimeout(function () {
        // Scrolling stopped
        gsap.to(uOffset.value, {
            y: 0,
            duration: 0.5
        })
    }, 500);
    if (e.deltaY > 0) {
        // Scrolling down
        gsap.to(uOffset.value, {
            y: 0.04,
            duration: 0.5
        })
    } else if (e.deltaY < 0) {
        // Scrolling up
        gsap.to(uOffset.value, {
            y: -0.04,
            duration: 0.5
        })
    }
});

const clearColor = new THREE.Color('#000');

let head: THREE.Group | undefined

fbxLoader.load('/head.fbx', (object) => {
    const headMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color("#cccccc"),
        opacity: 0.2,
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
new Rellax('.rellax', {
    speed: -2, // Set the speed property to a negative value
});

// // Delay the parallax effect for 2 seconds
// setTimeout(function () {
//     rellax.refresh(); // Refresh the Rellax.js instance to apply the delay
// }, 2000);

const cursor = new Cursor(textureLoader, scene, camera)
// Set up the lighting
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

//load navigation textures
const navigationTextures: THREE.Texture[] | null = await Promise.all([
    textureLoader.loadAsync('/images/navigation/hero-s.PNG'),
    textureLoader.loadAsync('/images/navigation/about-s.PNG'),
    textureLoader.loadAsync('/images/navigation/portfolio-s.PNG'),
    textureLoader.loadAsync('/images/navigation/contact-s.PNG')
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
        cursor.changeTextureByName('default')
    })

    const sectionsId = [
        '#hero',
        '#about',
        '#portfolio',
        '#contact'
    ]

    navigations.addEventListener('click', (e) => {
        let target = e.target as Element
        if (target.tagName === 'LI') {
            const val = target?.getAttribute('data-index') || '0'
            if (isNaN(+val)) return
            gsap.to(window, { duration: 2, scrollTo: sectionsId[+target.getAttribute('data-index')!] });
        }
    })
}

// welcome page big title
document.querySelectorAll<HTMLElement>('[data-hover]').forEach((elem) => {
    const data = elem.getAttribute('data-hover')
    if (typeof data === 'string' && (data as CursorTextures) in CURSOR_TEXTURES_URL) {
        elem.addEventListener('mousemove', () => cursor.changeTextureByName(data as CursorTextures))
        elem.addEventListener('mouseleave', () => cursor.changeTextureByName('default'))
    }
})

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

ScrollTrigger.create({
    trigger: app,
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
    trigger: app,
    start: () => {
        return `top+=${window.innerHeight - window.innerHeight / 6}px`
    },
    end: 'bottom bottom',
    onEnter: function () {
        gsap.to(particlesMaterial, {
            duration: 0.5,
            opacity: 1,
            onUpdate: () => {
                particlesMaterial.needsUpdate = true;
            },
        });
    },
    onLeaveBack: function () {
        gsap.to(particlesMaterial, {
            duration: 0.5,
            opacity: 0,
            onUpdate: () => {
                particlesMaterial.needsUpdate = true;
            },
        });
    },
    onUpdate: function () {
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


//mobile navigation
const mNav = document.querySelector<HTMLElement>('#m-nav')
const mNavOpen = document.querySelector<HTMLElement>('#m-nav-open')
const mNavClose = document.querySelector<HTMLElement>('#m-nav-close')
const mNavSocials = document.querySelector<HTMLElement>('#m-nav-socials')
gsap.set("#m-nav ul li a", {
    y: 100,
})

gsap.set(mNavSocials, {
    y: 100,
})

gsap.set(mNavClose, {
    y: -100,
})

mNavOpen?.addEventListener('click', () => {
    gsap.set('body', {
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
    })

    gsap.set(mNav, {
        display: 'grid'
    })

    gsap.to(mNav, {
        opacity: 1,
        onComplete() {
            gsap.to("#m-nav ul li a", {
                y: 0,
                stagger: 0.1,
                duration: 0.2
            })

            gsap.to([mNavSocials, mNavClose], {
                y: 0,
                duration: 0.2
            })
        }
    })
})

mNavClose?.addEventListener('click', () => {
    gsap.set('body', {
        opacity: 1,
        overflow: 'initial',
        height: 'auto'
    })

    gsap.to(mNav, {
        opacity: 0,
        onComplete() {
            gsap.set(mNav, {
                display: 'none'
            })

            gsap.set("#m-nav ul li a", {
                y: 100,
            })

            gsap.set(mNavSocials, {
                y: 100,
            })

            gsap.set(mNavClose, {
                y: -100,
            })
        }
    })
})

//parallax
// const cursorPosition = new THREE.Vector2(0, 0)

// window.addEventListener('mousemove', (event) => {
//     cursorPosition.x = event.clientX / window.innerWidth - 0.5
//     cursorPosition.y = event.clientY / window.innerHeight - 0.5
// })

// render the scene
function animate() {
    requestAnimationFrame(animate);

    //resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.setClearColor(clearColor, 0);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    const transform = `translateY(${window.scrollY}px)`;
    renderer.domElement.style.transform = transform;

    for (const { elm, fn } of sceneElements) {

        // get the viewport relative position of this element
        const rect = elm.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect;

        const isOffscreen =
            bottom < 0 ||
            top > renderer.domElement.clientHeight ||
            right < 0 ||
            left > renderer.domElement.clientWidth;

        if (!isOffscreen) {
            const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
            renderer.setScissor(left, positiveYUpBottom, width, height);
            renderer.setViewport(left, positiveYUpBottom, width, height);
            fn(rect);
        }
    }

    //particles.position.x = - cursorPosition.x * 0.5
    //particles.position.y = cursorPosition.y * 0.5
    cursor.animate()
    //head?.rotation.setFromVector3(new THREE.Vector3(0, clock.getElapsedTime() * 0.1, 0), 'XYZ')
    mainRenderer.render(scene, camera);
}
animate();
//new Fps()