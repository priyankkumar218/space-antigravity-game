import { Entity } from '../entities/Entity';
import { Projectile } from '../entities/Projectile';
import { Enemy } from '../entities/Enemy';
import { PowerUp } from '../entities/PowerUp';
import { Renderer } from '../engine/Renderer';

export class EntityManager {
    private entities: Entity[] = [];
    private enemies: Enemy[] = [];
    private projectiles: Projectile[] = [];
    private powerups: PowerUp[] = [];

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    public addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }

    public addProjectile(projectile: Projectile): void {
        this.projectiles.push(projectile);
    }

    public addPowerUp(powerup: PowerUp): void {
        this.powerups.push(powerup);
    }

    public update(deltaTime: number): void {
        // Update entities
        this.entities.forEach(e => e.update(deltaTime));
        this.enemies.forEach(e => e.update(deltaTime));
        this.projectiles.forEach(p => p.update(deltaTime));
        this.powerups.forEach(p => p.update(deltaTime));

        // Cleanup inactive
        this.entities = this.entities.filter(e => e.active);
        this.enemies = this.enemies.filter(e => e.active);
        this.projectiles = this.projectiles.filter(p => p.active);
        this.powerups = this.powerups.filter(p => p.active);
    }

    public render(renderer: Renderer): void {
        this.entities.forEach(e => e.render(renderer));
        this.enemies.forEach(e => e.render(renderer));
        this.projectiles.forEach(p => p.render(renderer));
        this.powerups.forEach(p => p.render(renderer));
    }

    public getEntities(): Entity[] {
        return this.entities;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    public getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    public getPowerUps(): PowerUp[] {
        return this.powerups;
    }
}
