import { Entity } from './Entity';
import { Renderer } from '../engine/Renderer';

export const PowerUpType = {
    GUN_UPGRADE: 0,
    HEALTH: 1
} as const;

export type PowerUpType = typeof PowerUpType[keyof typeof PowerUpType];

export class PowerUp extends Entity {
    public type: PowerUpType;
    public speed: number = 100;

    constructor(x: number, y: number, type: PowerUpType) {
        super(x, y, 20, 20);
        this.type = type;
    }

    public update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
        if (this.y > window.innerHeight) {
            this.active = false;
        }
    }

    public render(renderer: Renderer): void {
        const color = this.type === PowerUpType.GUN_UPGRADE ? '#0ff' : '#f0f';
        renderer.drawRect(this.x, this.y, this.width, this.height, color);
        renderer.drawText(this.type === PowerUpType.GUN_UPGRADE ? 'P' : 'H', this.x + 5, this.y + 15, '#000', '12px Arial');
    }
}
