import { gsap } from "gsap"
import Scroll from "./Scroll"
import ShowCase from "./ShowCase"
import { event } from "@/utils/utils"

export default class showCaseDetail {
    declare private $els
    declare private parent
    declare private scroll
    declare private renderer
    declare private tl;
    constructor($el: HTMLElement, parent: ShowCase, scroll: Scroll, renderer: THREE.WebGLRenderer) {
        this.scroll = scroll
        this.parent = parent
        this.renderer = renderer
        this.$els = {
            elm: $el,
            title: $el.querySelector('.p-showcase-detail-title')!,
            smallTitle: $el.querySelector('.p-showcase-detail-title-sm')!,
            description: $el.querySelector('.p-showcase-detail-description')!,
            skills: $el.querySelector('.p-showcase-detail-skills')!,
            parentElem: document.querySelector<HTMLElement>('#portfolio')!,
            slider: $el.querySelector<HTMLElement>('.p-showcase-detail-tile')!,
            sliderNext: $el.querySelector<HTMLElement>('.p-showcase-detail-slider-next')!,
            sliderPrev: $el.querySelector<HTMLElement>('.p-showcase-detail-slider-prev')!,
            back: $el.querySelector<HTMLElement>('.p-showcase-detail-back')!,
            bg: document.querySelector<HTMLElement>('#bg')!,
            tile: $el.parentNode?.querySelector<HTMLElement>('.p-showcase-tile')!,
            backTextSvg: $el.querySelector<HTMLElement>('.p-showcase-detail-back-text')!,
            backInner: $el.querySelector<HTMLElement>('.p-showcase-detail-back div')!,
        }
        this.tl = gsap.timeline({ paused: true })
        this.$els.back.addEventListener('click', this.out.bind(this))
        this.init()
    }

    init() {
        this.tl.to(this.$els.bg.querySelector('div:nth-child(1)'), {
            height: '100vh',
            transformOrigin: 'top',
            duration: 0.4,
            ease: 'Power4.in'
        })

        this.tl.to(this.$els.bg.querySelector('div:nth-child(2)'), {
            height: '100vh',
            transformOrigin: 'top',
            duration: 0.4,
            ease: 'Power4.out'
        })

        this.tl.from(this.$els.title.querySelectorAll('span'), {
            y: -100,
            duration: 0.5,
            ease: 'Power3.out'
        }, '<'
        )

        this.tl.from(this.$els.smallTitle.querySelectorAll('span'), {
            y: 50,
            duration: 0.5,
            ease: 'Power3.out'
        }, '<')

        this.tl.from(this.$els.backTextSvg, {
            scale: 0,
            duration: 0.4,
            ease: 'Power3.out'
        }, '<+=0.3')

        this.tl.from(this.$els.sliderNext, {
            opacity: 0,
            x: -10,
            duration: 0.3,
            ease: 'Power3.out'
        }, '<')

        this.tl.from(this.$els.sliderPrev, {
            opacity: 0,
            x: 10,
            duration: 0.3,
            ease: 'Power3.out'
        }, '<')

        this.tl.from(this.$els.backInner, {
            opacity: 0,
            duration: 0.4,
            ease: 'Power3.out'
        }, '>')

        this.tl.from(this.$els.description.querySelectorAll('span span'), {
            y: 50,
            duration: 0.5,
            stagger: 0.2,
            ease: 'Power3.out'
        }, '>-=0.2')

        this.tl.from(this.$els.skills.querySelectorAll('div'), {
            y: 100,
            duration: 0.5,
            stagger: 0.1,
            ease: 'Power3.out'
        }, '>-=0.2')

        this.tl.then(() => {
            this.parent.isAnimating = false
        })
    }

    in() {
        event('MainScene:Stop')
        this.parent.isAnimating = true
        this.parent.onGrid = false
        this.scroll.lock()

        gsap.set(this.$els.elm, {
            display: 'grid'
        })

        gsap.set(this.$els.bg, {
            zIndex: 20,
            display: 'block'
        })

        gsap.set(this.$els.parentElem, {
            zIndex: 'unset'
        })

        gsap.set(this.renderer.domElement, {
            zIndex: 25
        })

        const { width, height, top, left, right, bottom } = this.$els.slider.getBoundingClientRect()

        gsap.to(this.parent.rect, {
            width,
            height,
            top,
            left,
            bottom,
            right,
            duration: 0.7,
            ease: 'Power4.inOut',
            onComplete: () => {
                this.parent.$els.activeElem = this.$els.slider
            }
        })

        this.tl.timeScale(1).play()
    }

    out() {
        this.parent.isAnimating = true

        const { width, height, top, left, right, bottom } = this.$els.tile.getBoundingClientRect()


        this.tl.timeScale(2).reverse().then(() => {
            gsap.to(this.parent.rect, {
                width,
                height,
                top,
                left,
                bottom,
                right,
                duration: 0.7,
                ease: 'Power4.inOut',
                onComplete: () => {
                    this.parent.$els.activeElem = this.$els.tile
                    this.parent.isAnimating = false
                    this.parent.onGrid = true
                    this.scroll.unlock()
                }
            })

            gsap.set(this.$els.elm, {
                display: 'none'
            })

            gsap.set(this.$els.bg, {
                zIndex: 'unset',
            })

            gsap.set(this.$els.parentElem, {
                zIndex: 10
            })

            gsap.set(this.renderer.domElement, {
                zIndex: 1
            })
        })
    }
}