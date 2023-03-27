import { shuffleArray } from "./utils";

export class LetterFadeInAnimation {
    private target: HTMLElement | undefined | null;
    private spans: Array<HTMLSpanElement> = []
    private speed: number
    private transition: number
    constructor(target: HTMLElement | undefined | null, speed: number = 0.1, transition: number = 0.5) {
        this.target = target
        this.speed = speed
        this.transition = transition
        this.init()
    }

    public init(): void {
        if (!this.target) return

        const content = this.target.innerText || '';
        this.target.textContent = '';

        Array.from(content).forEach((letter) => {
            const span = document.createElement('span');
            span.textContent = letter;
            this.target?.append(span);
            span.style.opacity = '0';
            span.style.transition = `opacity ${this.transition}s ease-out`;
        });

        this.spans = shuffleArray(Array.from(this.target.children) as Array<HTMLSpanElement>);
        this.spans.forEach((span, i) => {
            span.style.transitionDelay = `${i * this.speed}s`;
        });

        this.target.style.opacity = '1'
    }

    fadeIn() {
        return new Promise((res, rej) => {
            const delay = this.spans.length * this.speed + this.transition
            setTimeout(() => {
                this.spans.forEach((e) => {
                    e.style.opacity = '1'
                })
            }, 100)
            setTimeout(res, delay * 1000 + 100)
        })
    }

    fadeOut() {
        return new Promise((res, rej) => {
            const delay = this.spans.length * this.speed + this.transition
            setTimeout(() => {
                this.spans.forEach((e) => {
                    e.style.opacity = '0'
                })
            }, 100)
            setTimeout(res, delay * 1000 + 100)
        })
    }

    changeTo(text: string) {
        this.fadeOut().then(() => {
            this.reset()
            if (this.target)
                this.target.textContent = text
            this.init()
            this.fadeIn()
        })
    }

    reset() {
        if (this.target) {
            this.target.innerHTML = ''
            this.target.style.opacity = '0'
        }
    }
}
