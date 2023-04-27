import { PAGE_SECTIONS, PAGE_SECTIONS_IMAGES } from "@/utils/constants";
import Cursor from "./Cursor";
import { gsap } from "gsap";

export default class Navigation {
    declare cursor
    declare el
    declare navigationTextures

    constructor(cursor: Cursor) {
        this.cursor = cursor
        this.el = document.querySelector<HTMLElement>('#nav')

        this.navigationTextures = PAGE_SECTIONS_IMAGES.map((url) => {
            return window.textureLoader.load(url)
        })

        this.init()
    }

    init() {
        if (this.navigationTextures && this.el) {
            this.bindEvents()
        }
    }

    bindEvents() {
        this.el?.addEventListener('mousemove', this.mouseMove.bind(this))
        this.el?.addEventListener('mouseleave', this.mouseLeave.bind(this))
        this.el?.addEventListener('click', this.click.bind(this))
    }

    mouseMove(e: MouseEvent) {

        let target = e.target as Element
        if (target.tagName === 'LI') {
            this.cursor.changeTexture(this.navigationTextures[+target.getAttribute('data-index')!])
            gsap.to(this.cursor.mesh.scale, {
                x: 3.5,
                y: 1.8,
                duration: 0.1,
                ease: "Power1.easeIn"
            })
        }
    }

    mouseLeave() {
        gsap.to(this.cursor.mesh.scale, {
            x: 1,
            y: 1,
            duration: 0.1,
            ease: "Power1.easeOut"
        })
        this.cursor.changeTextureByName('default')
    }

    click(e: MouseEvent) {
        let target = e.target as Element
        if (target.tagName === 'LI') {
            const val = target?.getAttribute('data-index') || '0'
            if (isNaN(+val)) return
            gsap.to(window, { duration: 2, scrollTo: PAGE_SECTIONS[+target.getAttribute('data-index')!] });
        }
    }
}