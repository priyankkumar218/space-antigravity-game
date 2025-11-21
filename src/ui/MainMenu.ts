import { Renderer } from '../engine/Renderer';
import { Storage } from '../db/Storage';

export class MainMenu {
    private active: boolean = true;
    private highScores: any[] = [];

    constructor() {
        this.loadHighScores();
    }

    private async loadHighScores() {
        this.highScores = await Storage.getHighScores();
        console.log('Loaded high scores:', this.highScores);
    }

    public isActive(): boolean {
        return this.active;
    }

    public startGame(): void {
        this.active = false;
    }

    public show(): void {
        this.active = true;
        this.loadHighScores();
    }

    public render(renderer: Renderer): void {
        if (!this.active) return;

        renderer.clear();
        const ctx = renderer.context;
        const width = renderer.width;
        const height = renderer.height;

        // Title
        renderer.drawText('SPACE SHOOTER', width / 2 - 150, height / 3, '#0ff', '60px Arial');
        renderer.drawText('Press ENTER to Start', width / 2 - 120, height / 2, '#fff', '30px Arial');

        // High Scores
        renderer.drawText('High Scores:', width / 2 - 60, height / 2 + 60, '#ff0', '24px Arial');
        this.highScores.slice(0, 5).forEach((score, index) => {
            const text = `${index + 1}. Score: ${score.score} - Level: ${score.level}`;
            renderer.drawText(text, width / 2 - 100, height / 2 + 100 + (index * 30), '#ccc', '20px Arial');
        });
    }
}
