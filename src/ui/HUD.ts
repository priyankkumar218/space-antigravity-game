import { GameState } from '../game/GameState';
import { LevelManager } from '../game/LevelManager';
import { Player } from '../entities/Player';

export class HUD {
    private scoreEl: HTMLElement;
    private healthEl: HTMLElement;
    private levelEl: HTMLElement;
    private timerEl: HTMLElement;
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.padding = '20px';
        this.container.style.color = 'white';
        this.container.style.fontFamily = 'Arial, sans-serif';
        this.container.style.fontSize = '24px';
        this.container.style.pointerEvents = 'none';
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'space-between';

        this.scoreEl = document.createElement('div');
        this.healthEl = document.createElement('div');
        this.levelEl = document.createElement('div');
        this.timerEl = document.createElement('div');

        this.container.appendChild(this.scoreEl);
        this.container.appendChild(this.levelEl);
        this.container.appendChild(this.timerEl);
        this.container.appendChild(this.healthEl);

        document.body.appendChild(this.container);
    }

    public update(gameState: GameState, levelManager: LevelManager, player: Player): void {
        this.scoreEl.textContent = `Score: ${gameState.score}`;
        this.healthEl.textContent = `Health: ${Math.max(0, player.health)}`;
        this.levelEl.textContent = `Level: ${gameState.level}`;

        const timeLeft = Math.max(0, levelManager.getLevelDuration() - levelManager.getLevelTime());
        const mins = Math.floor(timeLeft / 60);
        const secs = Math.floor(timeLeft % 60);
        this.timerEl.textContent = `Time: ${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
