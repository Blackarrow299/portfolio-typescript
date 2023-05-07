import { gsap } from "gsap"
import { PAGE_SECTIONS } from "../utils/constants"
import { event } from "@/utils/utils"

export default class MobileNavigation {
    declare private $el
    constructor() {
        this.$el = {
            mNav: document.querySelector<HTMLElement>('#m-nav'),
            mNavOpen: document.querySelector<HTMLElement>('#m-nav-open'),
            mNavClose: document.querySelector<HTMLElement>('#m-nav-close'),
            mNavSocials: document.querySelector<HTMLElement>('#m-nav-socials'),
            mNavSpan: document.querySelectorAll<HTMLElement>('#m-nav ul li span')
        }

        gsap.set(this.$el.mNavSpan, {
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
        this.$el.mNavOpen?.addEventListener('click', this.in.bind(this))
        this.$el.mNavClose?.addEventListener('click', this.out.bind(this))
        this.$el.mNav?.querySelector<HTMLElement>('ul')?.addEventListener('click', this.click.bind(this))
    }

    in() {
        event('Scroll:Lock')

        gsap.set(this.$el.mNav, {
            display: 'grid'
        })

        gsap.to(this.$el.mNav, {
            opacity: 1,
        }).then(() => {
            gsap.to(this.$el.mNavSpan, {
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

    out() {
        event('Scroll:Unlock')

        gsap.to(this.$el.mNav, {
            opacity: 0,
        }).then(() => {
            gsap.set(this.$el.mNav, {
                display: 'none'
            })

            gsap.set(this.$el.mNavSpan, {
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

    click(e: MouseEvent) {
        let target = e.target as Element
        if (target.tagName === 'A') {
            const val = target?.getAttribute('data-index') || '0'
            if (isNaN(+val)) return
            this.out()
            gsap.to(window, { duration: 2, scrollTo: PAGE_SECTIONS[+target.getAttribute('data-index')!] });
        }
    }
}