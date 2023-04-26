import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default class Scroll {

    declare private lenis: Lenis

    public get isScrolling(): boolean {
        return this.lenis.isScrolling
    }

    constructor() {
        this.lenis = new Lenis({
            duration: 2.3
        })

        this.lenis.on('scroll', ScrollTrigger.update)

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000)
        })

        requestAnimationFrame(this.raf.bind(this))

        this.bindEvents()
    }

    private raf(time: any) {
        this.lenis.raf(time)
        requestAnimationFrame(this.raf.bind(this))
    }

    private bindEvents() {
        document.addEventListener('Scroll:Lock', this.lock.bind(this))
        document.addEventListener('Scroll:Unlock', this.unlock.bind(this))
    }

    lock() {
        window.isScrollLocked = true
        this.lenis.stop()
    }

    unlock() {
        window.isScrollLocked = false
        this.lenis.start()
    }
}