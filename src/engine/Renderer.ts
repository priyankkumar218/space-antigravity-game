export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private shakeTime: number = 0;
    private shakeIntensity: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = context;
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    private resize = (): void => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

    public shake(duration: number, intensity: number): void {
        this.shakeTime = duration;
        this.shakeIntensity = intensity;
    }

    public clear(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000'; // Black background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.shakeTime > 0) {
            const dx = (Math.random() - 0.5) * this.shakeIntensity;
            const dy = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(dx, dy);
            this.shakeTime -= 1 / 60;
        }
    }

    public drawRect(x: number, y: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    public drawText(text: string, x: number, y: number, color: string = '#fff', font: string = '20px Arial'): void {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }

    public get width(): number {
        return this.canvas.width;
    }

    public get height(): number {
        return this.canvas.height;
    }

    public get context(): CanvasRenderingContext2D {
        return this.ctx;
    }
}
