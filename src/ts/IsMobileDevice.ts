export default class IsMobileDevice {
    constructor() {
        window.isMobile = !matchMedia('(pointer:fine)').matches
    }
};