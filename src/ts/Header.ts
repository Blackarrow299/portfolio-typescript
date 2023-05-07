import { shuffleArray } from "@/utils/utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Splitting from "splitting"

export default class Header {
    declare $els
    declare tl
    constructor() {
        const big_title_box = document.querySelector<HTMLElement>('#welcome_big_title')

        this.$els = {
            h1: big_title_box?.querySelector<HTMLElement>('h1')!,
            h2: big_title_box?.querySelector<HTMLElement>('h2')!,
            navEls: document.querySelectorAll<HTMLElement>('#nav li')!,
            socials: document.querySelectorAll<HTMLElement>('#h-socials a')!,
            scrollDown: document.querySelector<HTMLElement>('#scrollDown')!,
            scrollDownText: document.querySelector<HTMLElement>('#scrollDown h2 span')!,
            scrollDownImg: document.querySelector<HTMLElement>('#scrollDown img')!
        }
        this.tl = gsap.timeline({ paused: true })
        this.init()
    }

    init() {
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

        const h1Split = Splitting({ by: 'chars', target: this.$els.h1 })
        const h2Split = Splitting({ by: 'chars', target: this.$els.h2 })

        h1Split[0].chars = shuffleArray(h1Split[0].chars!)
        h2Split[0].chars = shuffleArray(h2Split[0].chars!)

        gsap.set([...h1Split[0].chars, ...h2Split[0].chars], {
            display: 'inline-block'
        })

        this.tl.from(h1Split[0].chars, {
            y: 250,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7
        })

        this.tl.from(h2Split[0].chars!, {
            y: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 1
        }, '<')

        this.tl.from(this.$els.navEls, {
            y: -50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
        }, '<+=0.5')

        this.tl.from(this.$els.socials, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
        }, '<')

        this.tl.from(this.$els.scrollDown, {
            y: 50,
            opacity: 0,
            duration: 0.5,
        }, '<+=0.8')

        this.tl.from(this.$els.scrollDownText, {
            y: 50,
            duration: 0.5,
        }, '<+=0.5')
    }

    in() {
        this.tl.play()
    }
}