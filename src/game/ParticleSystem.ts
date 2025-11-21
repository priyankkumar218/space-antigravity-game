import { Particle } from '../entities/Particle';
import { Renderer } from '../engine/Renderer';

export class ParticleSystem {
    private particles: Particle[] = [];

    public emit(x: number, y: number, count: number, color: string): void {
        for (let i = 0; i < count; i++) {
            const speed = Math.random() * 100 + 50;
            const life = Math.random() * 0.5 + 0.2;
            const size = Math.random() * 3 + 1;
            this.particles.push(new Particle(x, y, color, speed, life, size));
        }
    }

    public update(deltaTime: number): void {
        this.particles.forEach(p => p.update(deltaTime));
        this.particles = this.particles.filter(p => p.active);
    }

    public render(renderer: Renderer): void {
        this.particles.forEach(p => p.render(renderer));
    }
}
