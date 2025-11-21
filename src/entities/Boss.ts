import { Enemy, EnemyType } from './Enemy';
import { Renderer } from '../engine/Renderer';
import { EntityManager } from '../game/EntityManager';
import { Projectile } from './Projectile';

export class Boss extends Enemy {
    private maxHealth: number;
    private moveDirection: number = 1;
    private shootTimer: number = 0;
    private level: number;

    constructor(x: number, y: number, level: number, entityManager: EntityManager) {
        super(x, y, EnemyType.TANK, level);
        this.level = level;

        // Scale health significantly for higher levels
        if (level === 10) {
            this.health = 5000; // Very hard
            this.width = 150;
            this.height = 150;
        } else {
            this.health = 50 * level;
            this.width = 100 + (level * 10);
            this.height = 100 + (level * 10);
        }

        this.maxHealth = this.health;
        this.scoreValue = 1000 * level;
        this.speed = 50 + (level * 5);
        this.setEntityManager(entityManager);
    }

    public update(deltaTime: number): void {
        // Move boss down into view if above screen
        if (this.y < 50) {
            this.y += 100 * deltaTime; // Move down at 100 px/s
        } else {
            // Horizontal movement once in view
            this.x += this.speed * this.moveDirection * deltaTime;

            if (this.x <= 0 || this.x + this.width >= window.innerWidth) {
                this.moveDirection *= -1;
            }
        }

        // Shoot logic
        this.shootTimer += deltaTime;
        let fireRate = Math.max(0.2, 1.0 - (this.level * 0.05));
        if (this.level === 10) fireRate = 0.3; // Fast fire for final boss

        if (this.shootTimer > fireRate && this.getEntityManager()) {
            this.shoot();
            this.shootTimer = 0;
        }
    }

    private getEntityManager(): EntityManager | null {
        // Access parent's entityManager through the getter we'll add
        return this['entityManager' as keyof Enemy] as EntityManager | null;
    }

    private shoot(): void {
        const em = this.getEntityManager();
        if (!em) return;

        const centerX = this.x + this.width / 2;
        const bottomY = this.y + this.height;

        em.addProjectile(new Projectile(centerX, bottomY, true));

        // Level 5+ patterns
        if (this.level >= 5) {
            em.addProjectile(new Projectile(this.x, bottomY, true));
            em.addProjectile(new Projectile(this.x + this.width, bottomY, true));
        }

        // Level 10 spray pattern
        if (this.level === 10) {
            em.addProjectile(new Projectile(centerX - 20, bottomY, true));
            em.addProjectile(new Projectile(centerX + 20, bottomY, true));
        }
    }

    public render(renderer: Renderer): void {
        const ctx = renderer.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Large Galaga-style boss
        ctx.fillStyle = '#8B0000';
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;

        // Main body (large oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width * 0.5, this.height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Large horns/antennae
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.4, -this.height * 0.3);
        ctx.lineTo(-this.width * 0.6, -this.height * 0.6);
        ctx.moveTo(this.width * 0.4, -this.height * 0.3);
        ctx.lineTo(this.width * 0.6, -this.height * 0.6);
        ctx.stroke();

        // Wings
        ctx.fillStyle = '#FF4500';
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(-this.width * 0.45, 0, this.width * 0.3, this.height * 0.35, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.width * 0.45, 0, this.width * 0.3, this.height * 0.35, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eyes (glowing)
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(-this.width * 0.2, -this.height * 0.1, 8, 0, Math.PI * 2);
        ctx.arc(this.width * 0.2, -this.height * 0.1, 8, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing glow effect for boss
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF0000';
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width * 0.5, this.height * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();

        // Health bar (outside transform)
        const hpPercent = this.health / this.maxHealth;
        renderer.drawRect(this.x, this.y - 15, this.width, 8, '#333');
        renderer.drawRect(this.x, this.y - 15, this.width * hpPercent, 8, '#f00');

        // Level indicator
        renderer.drawText(`BOSS LV${this.level}`, this.x + this.width / 2 - 40, this.y - 25, '#ff0', '16px Arial');
    }
}
