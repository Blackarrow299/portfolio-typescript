declare module 'troika-three-text' {
    import { Object3D, Material, Texture, Font, Mesh } from 'three';

    export class Text extends Mesh {
        text: string;
        font?: Font | string;
        fontSize?: number;
        maxWidth?: number;
        lineHeight?: number;
        letterSpacing?: number;
        textAlign?: 'left' | 'center' | 'right';
        verticalAlign?: 'top' | 'center' | 'bottom';
        color?: string | number;
        material?: Material;
        texture?: Texture;
        depth?: number;
        bevelEnabled?: boolean;
        bevelThickness?: number;
        bevelSize?: number;
        bevelOffset?: number;
        bevelSegments?: number;
        update(text: string): void;
        sync(callback?: Function | undefined): void
        dispose(): void
    }
}
