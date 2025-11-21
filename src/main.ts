import { Game } from './game/Game';

console.log('main.ts executing');

try {
    const game = new Game();
    game.start();
    console.log('Game started successfully');
} catch (error) {
    console.error('Error starting game:', error);
    document.body.innerHTML = `<div style="color:red; padding:20px; font-size:20px;">
        Error: ${error instanceof Error ? error.message : String(error)}
    </div>`;
}
