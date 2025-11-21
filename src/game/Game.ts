import { GameLoop } from '../engine/GameLoop';
import { Input } from '../engine/Input';
import { Renderer } from '../engine/Renderer';
import { EntityManager } from './EntityManager';
import { LevelManager } from './LevelManager';
import { GameState } from './GameState';
import { Player } from '../entities/Player';
import { HUD } from '../ui/HUD';
import { Storage } from '../db/Storage';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { ParticleSystem } from './ParticleSystem';
import { MainMenu } from '../ui/MainMenu';
import { PauseMenu } from '../ui/PauseMenu';
import { SoundManager } from '../engine/SoundManager';

export class Game {
    private loop: GameLoop;
    private input: Input;
    private renderer: Renderer;
    private entityManager: EntityManager;
    private levelManager: LevelManager;
    private gameState: GameState;
    private player: Player;
    private hud: HUD;
    private particleSystem: ParticleSystem;
    private mainMenu: MainMenu;
    private pauseMenu: PauseMenu;
    private savedGameState: any = null;
    private sound: SoundManager;

    constructor() {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.background = '#000';

        this.input = new Input();
        this.renderer = new Renderer(canvas);
        this.entityManager = new EntityManager();
        this.gameState = new GameState();
        this.levelManager = new LevelManager(this.entityManager, this.gameState);
        this.sound = new SoundManager();
        this.player = new Player(window.innerWidth / 2, window.innerHeight - 100, this.input, this.entityManager, this.sound);
        this.hud = new HUD();
        this.particleSystem = new ParticleSystem();
        this.mainMenu = new MainMenu();
        this.pauseMenu = new PauseMenu();

        this.entityManager.addEntity(this.player);

        this.loop = new GameLoop(this.update, this.render);
    }

    public start(): void {
        this.loop.start();
    }


    private update = (deltaTime: number): void => {
        // Main Menu
        if (this.mainMenu.isActive()) {
            if (this.input.isKeyPressed('Enter')) {
                if (this.savedGameState) {
                    // Resume saved game
                    this.restoreGameState();
                    this.savedGameState = null;
                }
                this.mainMenu.startGame();
            }
            this.input.update();
            return;
        }

        // Pause Menu
        if (this.pauseMenu.isActive()) {
            if (this.input.isKeyPressed('Escape')) {
                this.pauseMenu.hide();
            } else if (this.input.isKeyPressed('ArrowUp') || this.input.isKeyPressed('KeyW')) {
                this.pauseMenu.moveUp();
            } else if (this.input.isKeyPressed('ArrowDown') || this.input.isKeyPressed('KeyS')) {
                this.pauseMenu.moveDown();
            } else if (this.input.isKeyPressed('Enter')) {
                if (this.pauseMenu.selectResume()) {
                    this.pauseMenu.hide();
                } else if (this.pauseMenu.selectMainMenu()) {
                    this.saveGameState();
                    this.pauseMenu.hide();
                    this.mainMenu.show();
                }
            }
            this.input.update();
            return;
        }

        // Game Over
        if (this.gameState.isGameOver) {
            if (this.input.isKeyPressed('Enter')) {
                this.restart();
            }
            this.input.update();
            return;
        }

        // ESC to pause during gameplay
        if (this.input.isKeyPressed('Escape')) {
            this.pauseMenu.show();
            this.input.update();
            return;
        }

        // Normal gameplay
        this.levelManager.update(deltaTime);
        this.entityManager.update(deltaTime);
        this.particleSystem.update(deltaTime);
        this.checkCollisions();
        this.hud.update(this.gameState, this.levelManager, this.player);

        if (this.player.health <= 0 && !this.gameState.isGameOver) {
            this.particleSystem.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 50, '#0f0');
            this.renderer.shake(0.5, 20);
            this.gameOver();
        }

        this.input.update();
    };

    private render = (): void => {
        this.renderer.clear();

        if (this.mainMenu.isActive()) {
            this.mainMenu.render(this.renderer);
            return;
        }

        this.entityManager.render(this.renderer);
        this.particleSystem.render(this.renderer);

        if (this.pauseMenu.isActive()) {
            this.pauseMenu.render(this.renderer);
            return;
        }

        if (this.gameState.isGameOver) {
            this.renderer.drawText('GAME OVER', window.innerWidth / 2 - 100, window.innerHeight / 2, '#f00', '40px Arial');
            this.renderer.drawText(`Final Score: ${this.gameState.score}`, window.innerWidth / 2 - 80, window.innerHeight / 2 + 50, '#fff');
            this.renderer.drawText('Press ENTER to Restart', window.innerWidth / 2 - 120, window.innerHeight / 2 + 100, '#fff');
        } else if (this.gameState.isVictory) {
            this.renderer.drawText('VICTORY!', window.innerWidth / 2 - 80, window.innerHeight / 2, '#0f0', '40px Arial');
        }
    };

    private checkCollisions(): void {
        const projectiles = this.entityManager.getProjectiles();
        const enemies = this.entityManager.getEnemies();
        const powerups = this.entityManager.getPowerUps();
        const player = this.player;

        // Projectiles vs Enemies/Player
        projectiles.forEach(p => {
            if (p.isEnemy) {
                if (p.collidesWith(player)) {
                    player.health -= p.damage;
                    p.active = false;
                    this.particleSystem.emit(p.x, p.y, 5, '#f00');
                    this.renderer.shake(0.1, 5);
                }
            } else {
                enemies.forEach(e => {
                    if (p.collidesWith(e)) {
                        e.takeDamage(p.damage);
                        p.active = false;
                        this.particleSystem.emit(p.x, p.y, 3, '#ff0');

                        if (!e.active) {
                            this.gameState.addScore(e.scoreValue);
                            this.particleSystem.emit(e.x + e.width / 2, e.y + e.height / 2, 20, '#f80');
                            this.renderer.shake(0.2, 10);
                            this.sound.playExplosion();

                            // Chance to drop powerup
                            if (Math.random() < 0.2) {
                                const type = Math.random() > 0.5 ? PowerUpType.GUN_UPGRADE : PowerUpType.HEALTH;
                                this.entityManager.addPowerUp(new PowerUp(e.x, e.y, type));
                            }
                        }
                    }
                });
            }
        });

        // Enemies vs Player
        enemies.forEach(e => {
            if (e.collidesWith(player)) {
                player.health -= 10;
                e.active = false;
                this.particleSystem.emit(e.x + e.width / 2, e.y + e.height / 2, 20, '#f00');
                this.renderer.shake(0.3, 15);
                this.sound.playHit();
            }
        });

        // PowerUps vs Player
        powerups.forEach(p => {
            if (p.collidesWith(player)) {
                player.collectPowerUp(p);
                p.active = false;
                this.particleSystem.emit(p.x, p.y, 10, '#fff');
                this.sound.playPowerUp();
            }
        });
    }

    private async gameOver(): Promise<void> {
        this.gameState.isGameOver = true;
        this.sound.playGameOver();
        await Storage.saveScore(this.gameState.score, this.gameState.level);
    }

    private restart(): void {
        window.location.reload();
    }

    private saveGameState(): void {
        this.savedGameState = {
            score: this.gameState.score,
            level: this.gameState.level,
            playerHealth: this.player.health,
            playerGunLevel: this.player.gunLevel,
            playerX: this.player.x,
            playerY: this.player.y,
            levelTime: this.levelManager.getLevelTime()
        };
    }

    private restoreGameState(): void {
        if (!this.savedGameState) return;

        this.gameState.score = this.savedGameState.score;
        this.gameState.level = this.savedGameState.level;
        this.player.health = this.savedGameState.playerHealth;
        this.player.gunLevel = this.savedGameState.playerGunLevel;
        this.player.x = this.savedGameState.playerX;
        this.player.y = this.savedGameState.playerY;
        // Note: We can't easily restore levelTime, so levels will restart
    }
}
