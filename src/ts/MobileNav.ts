import { gsap } from "gsap"
import { PAGE_SECTIONS } from "../utils/constants"
import Scroll from "./Scroll"

export default class MobileNavigation {
    declare private $el
    declare private scroll: Scroll
    constructor(scroll: Scroll) {
        this.scroll = scroll
        this.$el = {
            mNav: document.querySelector<HTMLElement>('#m-nav'),
            mNavOpen: document.querySelector<HTMLElement>('#m-nav-open'),
            mNavClose: document.querySelector<HTMLElement>('#m-nav-close'),
            mNavSocials: document.querySelector<HTMLElement>('#m-nav-socials'),
        }

        gsap.set("#m-nav ul li a", {
            y: 100,
        })

        gsap.set(this.$el.mNavSocials, {
            y: 100,
        })

        gsap.set(this.$el.mNavClose, {
            y: -100,
        })

        this.bindEvent()
    }

    bindEvent() {
        this.$el.mNavOpen?.addEventListener('click', this.onOpen.bind(this))
        this.$el.mNavClose?.addEventListener('click', this.onClose.bind(this))
        this.$el.mNav?.querySelector<HTMLElement>('ul')?.addEventListener('click', this.onLinkClick.bind(this))
    }

    onOpen() {
        this.scroll.lock()

        gsap.set(this.$el.mNav, {
            display: 'grid'
        })

        gsap.to(this.$el.mNav, {
            opacity: 1,
        }).then(() => {
            gsap.to("#m-nav ul li a", {
                y: 0,
                stagger: 0.1,
                duration: 0.2
            })

            gsap.to([this.$el.mNavSocials, this.$el.mNavClose], {
                y: 0,
                duration: 0.2
            })
        })
    }

    onClose() {
        this.scroll.unlock()

        gsap.to(this.$el.mNav, {
            opacity: 0,
        }).then(() => {
            gsap.set(this.$el.mNav, {
                display: 'none'
            })

            gsap.set("#m-nav ul li a", {
                y: 100,
            })

            gsap.set(this.$el.mNavSocials, {
                y: 100,
            })

            gsap.set(this.$el.mNavClose, {
                y: -100,
            })
        })
    }

    onLinkClick(e: MouseEvent) {
        let target = e.target as Element
        if (target.tagName === 'A') {
            const val = target?.getAttribute('data-index') || '0'
            if (isNaN(+val)) return
            this.onClose()
            gsap.to(window, { duration: 2, scrollTo: PAGE_SECTIONS[+target.getAttribute('data-index')!] });
        }
    }
}