import { Entity } from './Entity';
import { Renderer } from '../engine/Renderer';

export class Particle extends Entity {
    private vx: number;
    private vy: number;
    private life: number;
    private maxLife: number;
    private color: string;
    private size: number;

    constructor(x: number, y: number, color: string, speed: number, life: number, size: number) {
        super(x, y, size, size);
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;

        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    public update(deltaTime: number): void {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;

        if (this.life <= 0) {
            this.active = false;
        }
    }

    public render(renderer: Renderer): void {
        renderer.drawRect(this.x, this.y, this.size, this.size, this.color);
    }
}
