import { Renderer } from '../engine/Renderer';

export abstract class Entity {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public active: boolean = true;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public abstract update(deltaTime: number): void;
    public abstract render(renderer: Renderer): void;

    public getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    public collidesWith(other: Entity): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}
