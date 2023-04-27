import TitleAnimation from "@/utils/TitleAnimation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"


export default class Header {
    declare $els
    constructor() {
        const big_title_box = document.querySelector<HTMLElement>('#welcome_big_title')

        this.$els = {
            h1: big_title_box?.querySelector<HTMLElement>('h1'),
            h2: big_title_box?.querySelector<HTMLElement>('h2')
        }

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
    }

    in() {
        const titleAnimation = new TitleAnimation(this.$els.h1, 0.05)
        const titleAnimation1 = new TitleAnimation(this.$els.h2, 0.05)

        titleAnimation.fadeIn()
        titleAnimation1.fadeIn()
    }
}