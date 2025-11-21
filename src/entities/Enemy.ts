import { Entity } from './Entity';
import { Renderer } from '../engine/Renderer';
import { EntityManager } from '../game/EntityManager';
import { Projectile } from './Projectile';

export enum EnemyType {
    BASIC = 0,
    FAST = 1,
    TANK = 2
}

export class Enemy extends Entity {
    public type: EnemyType;
    public health: number;
    public speed: number;
    public scoreValue: number;
    private entityManager: EntityManager | null = null;
    private shootTimer: number = 0;

    constructor(x: number, y: number, type: EnemyType, levelMultiplier: number = 1) {
        let width = 30;
        let height = 30;
        let health = 1;
        let speed = 100;
        let score = 10;

        switch (type) {
            case EnemyType.BASIC:
                health = 1;
                speed = 100;
                score = 10;
                break;
            case EnemyType.FAST:
                health = 1;
                speed = 200;
                width = 20;
                height = 20;
                score = 20;
                break;
            case EnemyType.TANK:
                health = 5;
                speed = 50;
                width = 50;
                height = 50;
                score = 50;
                break;
        }

        super(x, y, width, height);
        this.type = type;
        this.health = health * levelMultiplier;
        this.speed = speed * (1 + (levelMultiplier - 1) * 0.1);
        this.scoreValue = score * levelMultiplier;
    }

    public setEntityManager(em: EntityManager): void {
        this.entityManager = em;
    }

    public update(deltaTime: number): void {
        this.y += this.speed * deltaTime;

        if (this.y > window.innerHeight) {
            this.active = false;
        }

        // Enemy shooting logic
        if (this.entityManager && this.y > 0 && this.y < window.innerHeight - 100) {
            this.shootTimer += deltaTime;
            let fireRate = 3.0; // Shoot every 3 seconds on average

            if (this.type === EnemyType.FAST) {
                fireRate = 2.5;
            } else if (this.type === EnemyType.TANK) {
                fireRate = 1.8;
            }

            if (this.shootTimer > fireRate && Math.random() < 0.25) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
    }

    private shoot(): void {
        if (!this.entityManager) return;

        const centerX = this.x + this.width / 2 - 2.5;
        const bottomY = this.y + this.height;
        this.entityManager.addProjectile(new Projectile(centerX, bottomY, true));
    }

    public render(renderer: Renderer): void {
        const ctx = renderer.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        if (this.type === EnemyType.BASIC) {
            // Galaga-style bee enemy
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;

            // Body
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width * 0.4, this.height * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Wings
            ctx.fillStyle = '#87CEEB';
            ctx.beginPath();
            ctx.ellipse(-this.width * 0.3, 0, this.width * 0.25, this.height * 0.2, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(this.width * 0.3, 0, this.width * 0.25, this.height * 0.2, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eyes
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(-this.width * 0.15, -this.height * 0.1, 3, 0, Math.PI * 2);
            ctx.arc(this.width * 0.15, -this.height * 0.1, 3, 0, Math.PI * 2);
            ctx.fill();

        } else if (this.type === EnemyType.FAST) {
            // Galaga-style butterfly enemy
            ctx.fillStyle = '#FF69B4';
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 2;

            // Body
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width * 0.3, this.height * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Wings
            ctx.fillStyle = '#9370DB';
            ctx.beginPath();
            ctx.arc(-this.width * 0.25, -this.height * 0.2, this.width * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.width * 0.25, -this.height * 0.2, this.width * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-this.width * 0.1, 0, 2, 0, Math.PI * 2);
            ctx.arc(this.width * 0.1, 0, 2, 0, Math.PI * 2);
            ctx.fill();

        } else if (this.type === EnemyType.TANK) {
            // Galaga-style tank enemy
            ctx.fillStyle = '#DC143C';
            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 3;

            // Main body
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width * 0.45, this.height * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Horns
            ctx.beginPath();
            ctx.moveTo(-this.width * 0.3, -this.height * 0.3);
            ctx.lineTo(-this.width * 0.4, -this.height * 0.5);
            ctx.moveTo(this.width * 0.3, -this.height * 0.3);
            ctx.lineTo(this.width * 0.4, -this.height * 0.5);
            ctx.stroke();

            // Wings
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.ellipse(-this.width * 0.35, 0, this.width * 0.25, this.height * 0.25, -0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(this.width * 0.35, 0, this.width * 0.25, this.height * 0.25, 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eyes
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(-this.width * 0.15, -this.height * 0.1, 4, 0, Math.PI * 2);
            ctx.arc(this.width * 0.15, -this.height * 0.1, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.active = false;
        }
    }
}
