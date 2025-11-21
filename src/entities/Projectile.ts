import { Entity } from './Entity';
import { Renderer } from '../engine/Renderer';

export class Projectile extends Entity {
    public speed: number = 500;
    public damage: number = 1;
    public isEnemy: boolean = false;

    constructor(x: number, y: number, isEnemy: boolean = false) {
        super(x, y, 5, 10);
        this.isEnemy = isEnemy;
    }

    public update(deltaTime: number): void {
        const direction = this.isEnemy ? 1 : -1;
        this.y += this.speed * direction * deltaTime;

        // Deactivate if out of bounds (assuming 1080p height roughly, or check renderer bounds)
        // For now, just simple check, EntityManager handles cleanup usually
        if (this.y < -50 || this.y > 2000) {
            this.active = false;
        }
    }

    public render(renderer: Renderer): void {
        renderer.drawRect(this.x, this.y, this.width, this.height, this.isEnemy ? '#f00' : '#ff0');
    }
}
