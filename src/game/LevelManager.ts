import { EntityManager } from './EntityManager';
import { GameState } from './GameState';
import { Enemy, EnemyType } from '../entities/Enemy';
import { Boss } from '../entities/Boss';

export class LevelManager {
    private levelDuration: number = 120; // 2 minutes per level
    private currentLevelTime: number = 0;
    private spawnTimer: number = 0;
    private bossSpawned: boolean = false;
    private entityManager: EntityManager;
    private gameState: GameState;
    private lastLogTime: number = -1;

    constructor(entityManager: EntityManager, gameState: GameState) {
        this.entityManager = entityManager;
        this.gameState = gameState;
    }

    public update(deltaTime: number): void {
        if (this.gameState.isGameOver || this.gameState.isVictory) return;

        this.currentLevelTime += deltaTime;

        // Debug logging
        if (Math.floor(this.currentLevelTime) % 5 === 0 && Math.floor(this.currentLevelTime) !== this.lastLogTime) {
            console.log(`Level ${this.gameState.level}: Time=${this.currentLevelTime.toFixed(1)}s / ${this.levelDuration}s, Boss=${this.bossSpawned}`);
            this.lastLogTime = Math.floor(this.currentLevelTime);
        }

        // Check for Boss Spawn
        if (this.currentLevelTime >= this.levelDuration && !this.bossSpawned) {
            console.log('SPAWNING BOSS!');
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
                console.log('Boss defeated! Completing level...');
                this.completeLevel();
            }
        }
    }

    private getSpawnRate(): number {
        // Spawn faster as levels progress
        return Math.max(0.5, 2.0 - (this.gameState.level * 0.1));
    }

    private spawnEnemy(): void {
        const types = [EnemyType.BASIC, EnemyType.FAST, EnemyType.TANK];
        let type = EnemyType.BASIC;

        const rand = Math.random();
        if (rand < 0.6) {
            type = EnemyType.BASIC;
        } else if (rand < 0.85) {
            type = EnemyType.FAST;
        } else {
            type = EnemyType.TANK;
        }

        const x = Math.random() * (window.innerWidth - 50);
        const y = -50;
        const enemy = new Enemy(x, y, type, this.gameState.level);
        enemy.setEntityManager(this.entityManager);
        this.entityManager.addEnemy(enemy);
    }

    private spawnBoss(): void {
        this.bossSpawned = true;

        const x = window.innerWidth / 2 - 50;
        const y = -100;
        const boss = new Boss(x, y, this.gameState.level, this.entityManager);
        this.entityManager.addEnemy(boss);
        console.log('Boss added to EntityManager:', boss, 'Position:', x, y);
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
    }

    public getLevelTime(): number {
        return this.currentLevelTime;
    }

    public getLevelDuration(): number {
        return this.levelDuration;
    }
}
