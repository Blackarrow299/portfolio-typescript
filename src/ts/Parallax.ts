export default class Parallax {

    declare parallaxElements: NodeListOf<HTMLElement>

    constructor(selector: string) {
        this.parallaxElements = document.querySelectorAll<HTMLElement>(selector)
        this.bindEvent()
    }

    bindEvent() {
        document.addEventListener("mousemove", this.onMove.bind(this))
    }

    onMove(e: MouseEvent) {
        this.parallaxElements.forEach((element) => {
            const depthAttr = element.getAttribute("data-depth")
            let depth: number | undefined = depthAttr ? +depthAttr : undefined;
            this.parallax(e, element, depth)
        })
    }

    parallax(e: MouseEvent, target: HTMLElement, depth = 0.2) {
        const x = -e.clientX / depth
        const y = -e.clientY / depth
        target.style.cssText = `transform: translate3d(${x}px, ${y}px, 0px)`
    }
}