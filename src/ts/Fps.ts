export default class Fps {
    constructor() {
        this.init()
    }
    init() {
        let before: number
        let now: number
        let fps: number
        before = Date.now();
        fps = 0;
        const div = document.createElement('div')
        div.classList.add('fixed', 'top-2', 'left-2', 'text-green-500')
        document.body.append(div)
        requestAnimationFrame(
            function loop() {
                now = Date.now();
                fps = Math.round(1000 / (now - before));
                before = now;
                requestAnimationFrame(loop);
                div.textContent = fps.toString()
            }
        );
    }
}