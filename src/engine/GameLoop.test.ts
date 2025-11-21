import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop } from './GameLoop';

describe('GameLoop', () => {
    let gameLoop: GameLoop;
    let updateMock: any;
    let renderMock: any;

    beforeEach(() => {
        updateMock = vi.fn();
        renderMock = vi.fn();
        gameLoop = new GameLoop(updateMock, renderMock);
        vi.useFakeTimers();

        let currentTime = 0;
        vi.stubGlobal('performance', {
            now: () => currentTime
        });

        // Mock requestAnimationFrame
        let timeoutId: any;
        vi.stubGlobal('requestAnimationFrame', (callback: any) => {
            timeoutId = setTimeout(() => {
                currentTime += 16;
                callback(currentTime);
            }, 16);
            return 123; // Return a dummy number
        });

        const cancelMock = vi.fn((id: any) => {
            clearTimeout(timeoutId);
        });
        vi.stubGlobal('cancelAnimationFrame', cancelMock);
        window.cancelAnimationFrame = cancelMock;
    });

    afterEach(() => {
        gameLoop.stop();
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('should start and call update/render', () => {
        gameLoop.start();

        // Advance time by enough frames to trigger fixed time step (16.66ms)
        // 100ms should be plenty (approx 6 updates)
        vi.advanceTimersByTime(100);

        expect(updateMock).toHaveBeenCalled();
        expect(renderMock).toHaveBeenCalled();
    });

    it('should stop loop', () => {
        gameLoop.start();
        gameLoop.stop();

        updateMock.mockClear();
        renderMock.mockClear();

        vi.advanceTimersByTime(100);

        expect(updateMock).not.toHaveBeenCalled();
        expect(renderMock).not.toHaveBeenCalled();
    });
});
