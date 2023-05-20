export default class Split {
    declare target
    declare chars: HTMLSpanElement[]

    constructor(target: HTMLElement) {
        this.target = target
        this.chars = []

        this.init()
    }

    init() {
        const fragment = document.createDocumentFragment();
        this.splitByChars(fragment)

        this.target.textContent = '';
        this.target.appendChild(fragment)
    }

    splitByChars(fragment: DocumentFragment) {
        this.chars = Array.from(this.target.innerText || '').map((letter) => {
            const span = document.createElement('span');
            span.appendChild(document.createTextNode(letter))
            span.style.display = 'inline-block'
            fragment?.appendChild(span);
            return span
        })
    }
}