import { gsap } from "gsap"

export default class skills {
    constructor() {
        const els = document.querySelectorAll<HTMLElement>('.skill')

        els.forEach((el) => {
            const text = el.textContent
            gsap.set(el, {
                overflowX: 'hidden',
                position: 'relative',
            })

            el.innerHTML = ''
            const span = document.createElement('span')
            gsap.set(span, {
                opacity: 1,
                display: 'inline-block',
            })
            span.textContent = text
            el.appendChild(span)

            const container = document.createElement('div')
            gsap.set(container, {
                position: 'absolute',
                opacity: 0,
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
            })

            el.appendChild(container)

            const a = [0, 1, 2]
            a.forEach((i) => {
                const span = document.createElement('span')
                gsap.set(span, {
                    width: 'full',
                    display: 'inline-block',
                    position: 'absolute',
                    left: i * -100 + 50 + '%',
                    top: '50%',
                    y: '-50%',
                    x: '-50%'
                })
                span.textContent = text

                container.appendChild(span)
            })

            const tl = gsap.timeline({ paused: true })

            tl.to(span, {
                opacity: 0,
                duration: 0.3
            })

            tl.to(container, {
                opacity: 1,
                duration: 0.3
            })

            tl.to(container, {
                left: '200%',
                duration: 3.5,
                ease: 'none',
                repeat: -1
            }, '<')

            el.addEventListener('mouseenter', () => {
                tl.play()
            })

            el.addEventListener('mouseleave', () => {
                tl.restart()
                tl.pause()
            })

        })
    }



}