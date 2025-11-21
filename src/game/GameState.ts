export class GameState {
    public score: number = 0;
    public level: number = 1;
    public isGameOver: boolean = false;
    public isVictory: boolean = false;
    public isPaused: boolean = false;

    constructor() { }

    public addScore(amount: number): void {
        this.score += amount;
    }

    public nextLevel(): void {
        this.level++;
    }

    public reset(): void {
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.isVictory = false;
        this.isPaused = false;
    }
}
