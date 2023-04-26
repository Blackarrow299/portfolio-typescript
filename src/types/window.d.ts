export declare global {
    interface Window {
        isMobile: Boolean;
        app: HTMLElement;
        events: {
            [key: string]: Event
        },
        textureLoader: THREE.TextureLoader,
    }
}