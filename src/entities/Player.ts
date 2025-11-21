import { Entity } from './Entity';
import { Renderer } from '../engine/Renderer';
import { Input } from '../engine/Input';
import { Projectile } from './Projectile';
import { EntityManager } from '../game/EntityManager';
import { PowerUp, PowerUpType } from './PowerUp';
import { SoundManager } from '../engine/SoundManager';

export class Player extends Entity {
    private speed: number = 300;
    private input: Input;
    private entityManager: EntityManager;
    private lastShotTime: number = 0;
    private fireRate: number = 0.2; // Seconds between shots
    public health: number = 100;
    public gunLevel: number = 1; // 1 to 5
    private sound: SoundManager;

    constructor(x: number, y: number, input: Input, entityManager: EntityManager, sound: SoundManager) {
        super(x, y, 40, 40);
        this.input = input;
        this.entityManager = entityManager;
        this.sound = sound;
    }

    public update(deltaTime: number): void {
        // Movement
        if (this.input.isKeyDown('ArrowLeft') || this.input.isKeyDown('KeyA')) {
            this.x -= this.speed * deltaTime;
        }
        if (this.input.isKeyDown('ArrowRight') || this.input.isKeyDown('KeyD')) {
            this.x += this.speed * deltaTime;
        }
        if (this.input.isKeyDown('ArrowUp') || this.input.isKeyDown('KeyW')) {
            this.y -= this.speed * deltaTime;
        }
        if (this.input.isKeyDown('ArrowDown') || this.input.isKeyDown('KeyS')) {
            this.y += this.speed * deltaTime;
        }

        // Bounds clamping
        this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));

        // Shooting
        if (this.input.isKeyDown('Space')) {
            this.shoot();
        }
    }

    private shoot(): void {
        const now = performance.now() / 1000;
        if (now - this.lastShotTime >= this.fireRate) {
            this.lastShotTime = now;
            this.sound.playShoot();

            // Gun level logic
            if (this.gunLevel === 1) {
                this.entityManager.addProjectile(new Projectile(this.x + this.width / 2 - 2.5, this.y));
            } else if (this.gunLevel === 2) {
                this.entityManager.addProjectile(new Projectile(this.x, this.y));
                this.entityManager.addProjectile(new Projectile(this.x + this.width - 5, this.y));
            } else if (this.gunLevel === 3) {
                this.entityManager.addProjectile(new Projectile(this.x + this.width / 2 - 2.5, this.y));
                this.entityManager.addProjectile(new Projectile(this.x, this.y + 5));
                this.entityManager.addProjectile(new Projectile(this.x + this.width - 5, this.y + 5));
            } else {
                // Level 4-5: Spread or more bullets
                this.entityManager.addProjectile(new Projectile(this.x + this.width / 2 - 2.5, this.y));
                this.entityManager.addProjectile(new Projectile(this.x, this.y));
                this.entityManager.addProjectile(new Projectile(this.x + this.width - 5, this.y));
                // Add angled shots if Projectile supports angle (currently doesn't, but simple spread is fine)
            }
        }
    }

    public render(renderer: Renderer): void {
        const ctx = renderer.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Galaga-style player ship
        ctx.fillStyle = '#00FF00';
        ctx.strokeStyle = '#00AA00';
        ctx.lineWidth = 2;

        // Main body (triangle)
        ctx.beginPath();
        ctx.moveTo(0, -this.height * 0.5); // Top
        ctx.lineTo(-this.width * 0.4, this.height * 0.5); // Bottom left
        ctx.lineTo(this.width * 0.4, this.height * 0.5); // Bottom right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wings
        ctx.fillStyle = '#00DDDD';
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.4, this.height * 0.3);
        ctx.lineTo(-this.width * 0.6, this.height * 0.5);
        ctx.lineTo(-this.width * 0.3, this.height * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.width * 0.4, this.height * 0.3);
        ctx.lineTo(this.width * 0.6, this.height * 0.5);
        ctx.lineTo(this.width * 0.3, this.height * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFAA00';
        ctx.stroke();

        ctx.restore();
    }

    public collectPowerUp(powerUp: PowerUp): void {
        if (powerUp.type === PowerUpType.GUN_UPGRADE) {
            this.gunLevel = Math.min(5, this.gunLevel + 1);
        } else if (powerUp.type === PowerUpType.HEALTH) {
            this.health = Math.min(100, this.health + 20);
        }
    }
}
