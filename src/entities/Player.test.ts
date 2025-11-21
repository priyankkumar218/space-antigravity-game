import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from './Player';
import { Input } from '../engine/Input';
import { EntityManager } from '../game/EntityManager';
import { SoundManager } from '../engine/SoundManager';

describe('Player', () => {
    let player: Player;
    let inputMock: any;
    let entityManagerMock: any;
    let soundMock: any;

    beforeEach(() => {
        inputMock = {
            isKeyDown: vi.fn().mockReturnValue(false),
            isKeyPressed: vi.fn().mockReturnValue(false),
            update: vi.fn()
        } as unknown as Input;

        entityManagerMock = {
            addProjectile: vi.fn(),
            addEntity: vi.fn()
        } as unknown as EntityManager;

        soundMock = {
            playShoot: vi.fn(),
            playExplosion: vi.fn(),
            playHit: vi.fn(),
            playPowerUp: vi.fn(),
            playGameOver: vi.fn()
        } as unknown as SoundManager;

        // Mock window size
        vi.stubGlobal('window', {
            innerWidth: 800,
            innerHeight: 600
        });

        player = new Player(400, 500, inputMock, entityManagerMock, soundMock);
    });

    it('should move left when left arrow is pressed', () => {
        inputMock.isKeyDown.mockImplementation((key: string) => key === 'ArrowLeft');

        const initialX = player.x;
        player.update(0.1); // 100ms

        expect(player.x).toBeLessThan(initialX);
    });

    it('should move right when right arrow is pressed', () => {
        inputMock.isKeyDown.mockImplementation((key: string) => key === 'ArrowRight');

        const initialX = player.x;
        player.update(0.1);

        expect(player.x).toBeGreaterThan(initialX);
    });

    it('should shoot when space is pressed', () => {
        inputMock.isKeyDown.mockImplementation((key: string) => key === 'Space');

        // Mock performance.now for fire rate check
        let currentTime = 1000;
        vi.stubGlobal('performance', { now: () => currentTime });

        player.update(0.016);

        expect(entityManagerMock.addProjectile).toHaveBeenCalled();
    });

    it('should clamp position within bounds', () => {
        player.x = -100;
        player.update(0.016);
        expect(player.x).toBe(0);

        player.x = 1000;
        player.update(0.016);
        expect(player.x).toBe(800 - player.width);
    });
});
