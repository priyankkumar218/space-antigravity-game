import { Enemy, EnemyType } from './Enemy';
import { Renderer } from '../engine/Renderer';
import { EntityManager } from '../game/EntityManager';
import { Projectile } from './Projectile';

export class Boss extends Enemy {
    private entityManager: EntityManager;
    private maxHealth: number;
    private moveDirection: number = 1;
    private shootTimer: number = 0;
    private level: number;

    constructor(x: number, y: number, level: number, entityManager: EntityManager) {
        super(x, y, EnemyType.TANK, level);
        this.level = level;
        this.width = 100;
        this.height = 100;

        // Scale health significantly for level 10
        if (level === 10) {
            this.health = 5000; // Very hard
            this.width = 150;
            this.height = 150;
        } else {
            this.health = 50 * level;
        }

        this.maxHealth = this.health;
        this.scoreValue = 1000 * level;
        this.speed = 50 + (level * 5);
        this.entityManager = entityManager;
    }

    public update(deltaTime: number): void {
        this.x += this.speed * this.moveDirection * deltaTime;

        if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
            this.moveDirection *= -1;
        }

        // Shoot logic
        this.shootTimer += deltaTime;
        let fireRate = Math.max(0.2, 1.0 - (this.level * 0.05));
        if (this.level === 10) fireRate = 0.3; // Fast fire for final boss

        if (this.shootTimer > fireRate) {
            this.shoot();
            this.shootTimer = 0;
        }
    }

    private shoot(): void {
        const centerX = this.x + this.width / 2;
        const bottomY = this.y + this.height;

        this.entityManager.addProjectile(new Projectile(centerX, bottomY, true));

        // Level 10 or high level patterns
        if (this.level >= 5) {
            this.entityManager.addProjectile(new Projectile(this.x, bottomY, true));
            this.entityManager.addProjectile(new Projectile(this.x + this.width, bottomY, true));
        }

        if (this.level === 10) {
            // Spray pattern could be added here if Projectile supported angles
            // For now, just more bullets
            this.entityManager.addProjectile(new Projectile(centerX - 20, bottomY, true));
            this.entityManager.addProjectile(new Projectile(centerX + 20, bottomY, true));
        }
    }

    public render(renderer: Renderer): void {
        renderer.drawRect(this.x, this.y, this.width, this.height, '#80f');

        // Health bar
        const hpPercent = this.health / this.maxHealth;
        renderer.drawRect(this.x, this.y - 10, this.width, 5, '#333');
        renderer.drawRect(this.x, this.y - 10, this.width * hpPercent, 5, '#f00');
    }
}
