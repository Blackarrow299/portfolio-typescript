import { gsap } from "gsap"
import ShowCase from "./ShowCase"
let tmp
export default class Slider {
    declare parent
    declare $els
    constructor(parent: ShowCase) {
        this.parent = parent
        const el = parent.$els.detailElem
        this.$els = {
            el: el,
            next: el.querySelector<HTMLElement>('.p-showcase-detail-slider-next'),
            prev: el.querySelector<HTMLElement>('.p-showcase-detail-slider-prev')
        }
        this.init()
    }

    init() {
        if (!this.$els.el) return
        this.bindEvents()
    }

    bindEvents() {
        this.$els.next?.addEventListener('click', this.next.bind(this))
        this.$els.prev?.addEventListener('click', this.prev.bind(this))
    }

    next() {
        gsap.to(this.parent.uniforms.u_disp, {
            value: 2.,
            duration: 0.3,
            ease: 'Power4.out',
            onComplete: () => {
                gsap.to(this.parent.uniforms.u_disp, {
                    value: 0,
                    duration: 0.3,
                    ease: 'Power4.in'
                })
            }
        })

        gsap.to(this.parent.uniforms.u_progress, {
            value: 1.,
            duration: 0.6,
            ease: 'Power4.inOut',
            onComplete: () => {
                tmp = this.parent.uniforms.u_image
                this.parent.uniforms.u_image = this.parent.uniforms.u_nextImage
                this.parent.uniforms.u_disp.value = 0
                this.parent.uniforms.u_progress.value = 0
                this.parent.uniforms.u_nextImage = tmp
            }
        })
    }

    prev() {

    }
}