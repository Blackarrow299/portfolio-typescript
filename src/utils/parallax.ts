export default function initParallax() {
    const parallaxElements = document.querySelectorAll<HTMLElement>('.parallax-element')
    document.addEventListener("mousemove", (e) => {
        parallaxElements.forEach((element) => {
            const depthAttr = element.getAttribute("data-depth")
            let depth: number | undefined = depthAttr ? +depthAttr : undefined;
            parallax(e, element, depth)
        })
    })
}

function parallax(e: MouseEvent, target: HTMLElement, depth = 0.2) {
    const x = -e.clientX / depth
    const y = -e.clientY / depth
    target.style.cssText = `transform: translate3d(${x}px, ${y}px, 0px)`
}
