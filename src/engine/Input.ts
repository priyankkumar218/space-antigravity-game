export class Input {
    private keys: Set<string> = new Set();
    private previousKeys: Set<string> = new Set();

    constructor() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    public update(): void {
        this.previousKeys = new Set(this.keys);
    }

    public isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.has(key) && !this.previousKeys.has(key);
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        this.keys.add(event.code);
    };

    private onKeyUp = (event: KeyboardEvent): void => {
        this.keys.delete(event.code);
    };

    public destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}
