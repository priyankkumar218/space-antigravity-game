import { EntityManager } from './EntityManager';
import { GameState } from './GameState';
import { Enemy, EnemyType } from '../entities/Enemy';
import { Boss } from '../entities/Boss';

export class LevelManager {
    private levelDuration: number = 120; // 2 minutes in seconds
    private currentLevelTime: number = 0;
    private spawnTimer: number = 0;
    private bossSpawned: boolean = false;
    private entityManager: EntityManager;
    private gameState: GameState;

    constructor(entityManager: EntityManager, gameState: GameState) {
        this.entityManager = entityManager;
        this.gameState = gameState;
    }

    public update(deltaTime: number): void {
        if (this.gameState.isGameOver || this.gameState.isVictory) return;

        this.currentLevelTime += deltaTime;

        // Check for Boss Spawn
        if (this.currentLevelTime >= this.levelDuration && !this.bossSpawned) {
            this.spawnBoss();
        }

        // Spawn Enemies if Boss not spawned
        if (!this.bossSpawned) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer > this.getSpawnRate()) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        } else {
            // Check if Boss is defeated
            const boss = this.entityManager.getEnemies().find(e => e instanceof Boss);
            if (!boss && this.bossSpawned) {
                // Level Complete
                this.completeLevel();
            }
        }
    }

    private getSpawnRate(): number {
        // Spawn faster as levels progress
        return Math.max(0.5, 2.0 - (this.gameState.level * 0.1));
    }

    private spawnEnemy(): void {
        const x = Math.random() * (window.innerWidth - 50);
        const y = -50;

        // Determine enemy type based on level
        let type = EnemyType.BASIC;
        const rand = Math.random();

        if (this.gameState.level > 3 && rand > 0.7) type = EnemyType.FAST;
        if (this.gameState.level > 5 && rand > 0.9) type = EnemyType.TANK;

        this.entityManager.addEnemy(new Enemy(x, y, type, this.gameState.level));
    }

    private spawnBoss(): void {
        this.bossSpawned = true;
        // Clear existing enemies? Maybe not, adds difficulty.

        const x = window.innerWidth / 2 - 50;
        const y = -100;
        this.entityManager.addEnemy(new Boss(x, y, this.gameState.level, this.entityManager));
    }

    private completeLevel(): void {
        if (this.gameState.level >= 10) {
            this.gameState.isVictory = true;
        } else {
            this.gameState.nextLevel();
            this.resetLevel();
        }
    }

    public resetLevel(): void {
        this.currentLevelTime = 0;
        this.bossSpawned = false;
        this.spawnTimer = 0;
        // Clear entities handled by Game class or EntityManager reset
    }

    public getLevelTime(): number {
        return this.currentLevelTime;
    }

    public getLevelDuration(): number {
        return this.levelDuration;
    }
}
