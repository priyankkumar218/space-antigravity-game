export class GameLoop {
    private lastTime: number = 0;
    private accumulatedTime: number = 0;
    private readonly timeStep: number = 1000 / 60; // 60 FPS
    private isRunning: boolean = false;
    private animationFrameId: number | null = null;

    constructor(
        private update: (deltaTime: number) => void,
        private render: () => void
    ) { }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private loop = (timestamp: number): void => {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulatedTime += deltaTime;

        // Fixed time step update
        while (this.accumulatedTime >= this.timeStep) {
            this.update(this.timeStep / 1000); // Convert to seconds
            this.accumulatedTime -= this.timeStep;
        }

        this.render();

        this.animationFrameId = requestAnimationFrame(this.loop);
    };
}
