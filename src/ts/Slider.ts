import { gsap } from "gsap"
import ShowCase from "./ShowCase"

export default class Slider {
    declare parent
    declare $els
    declare currentIndex
    declare nextIndex
    constructor(parent: ShowCase) {
        this.parent = parent
        const el = parent.$els.detailElem
        this.currentIndex = 0
        this.nextIndex = 0
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
        if (this.currentIndex >= this.parent.textures.length - 1) this.currentIndex = 0
        else this.currentIndex++
        this.nextIndex = this.currentIndex + 1 > this.parent.textures.length - 1 ? 0 : this.currentIndex + 1
        this.animate()
    }

    prev() {
        if (this.currentIndex <= 0) this.currentIndex = this.parent.textures.length - 1
        else this.currentIndex--
        this.nextIndex = this.currentIndex - 1 < 0 ? this.parent.textures.length - 1 : this.currentIndex - 1
        this.animate()
    }

    private animate() {
        if (this.parent.textures.length === 1) return
        this.parent.uniforms.u_nextImage.value = this.parent.textures[this.currentIndex]
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
                this.parent.uniforms.u_image.value = this.parent.textures[this.currentIndex]
                this.parent.uniforms.u_disp.value = 0
                this.parent.uniforms.u_progress.value = 0
                this.parent.uniforms.u_nextImage.value = this.parent.textures[this.nextIndex]
            }
        })
    }
}