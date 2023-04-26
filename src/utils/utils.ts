//lerp
export function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t
}

export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function splitText(target: HTMLElement | undefined | null): HTMLSpanElement[] {
    if (!target) return []

    const content = target.innerText || '';
    target.textContent = '';

    return Array.from(content).map((letter) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block'
        target?.append(span);
        return span
    }) || [];
}

export function getViewSize(camera: THREE.PerspectiveCamera) {
    const fovInRadians = (camera.fov * Math.PI) / 180;
    const height = Math.abs(
        camera.position.z * Math.tan(fovInRadians / 2) * 2
    );
    return { width: height * camera.aspect, height };
}

export const event = (eventName: string) => {
    let e: Event

    if (!window.events) window['events'] = {}

    if (eventName in window.events) {
        e = window.events[eventName]
    } else {
        e = new Event(eventName)
        window.events[eventName] = e
    }
    document.dispatchEvent(e)
}