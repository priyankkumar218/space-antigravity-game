import { Renderer } from '../engine/Renderer';

export class PauseMenu {
    private active: boolean = false;
    private selectedOption: number = 0; // 0 = Resume, 1 = Main Menu

    public isActive(): boolean {
        return this.active;
    }

    public show(): void {
        this.active = true;
        this.selectedOption = 0;
    }

    public hide(): void {
        this.active = false;
    }

    public selectResume(): boolean {
        return this.selectedOption === 0;
    }

    public selectMainMenu(): boolean {
        return this.selectedOption === 1;
    }

    public moveUp(): void {
        this.selectedOption = Math.max(0, this.selectedOption - 1);
    }

    public moveDown(): void {
        this.selectedOption = Math.min(1, this.selectedOption + 1);
    }

    public render(renderer: Renderer): void {
        if (!this.active) return;

        const width = renderer.width;
        const height = renderer.height;

        // Semi-transparent overlay
        renderer.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        renderer.context.fillRect(0, 0, width, height);

        // Title
        renderer.drawText('PAUSED', width / 2 - 80, height / 3, '#fff', '48px Arial');

        // Options
        const resumeColor = this.selectedOption === 0 ? '#0ff' : '#888';
        const menuColor = this.selectedOption === 1 ? '#0ff' : '#888';

        renderer.drawText('Resume', width / 2 - 60, height / 2, resumeColor, '32px Arial');
        renderer.drawText('Main Menu', width / 2 - 90, height / 2 + 60, menuColor, '32px Arial');

        // Instructions
        renderer.drawText('Arrow Keys to select, Enter to confirm', width / 2 - 180, height / 2 + 140, '#ccc', '18px Arial');
    }
}
