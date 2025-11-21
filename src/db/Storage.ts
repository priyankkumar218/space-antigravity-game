import Dexie, { type Table } from 'dexie';

export interface HighScore {
    id?: number;
    score: number;
    level: number;
    date: Date;
}

export interface UserConfig {
    id?: number; // Singleton, always 1
    volume: number;
    difficulty: string;
}

export class GameDatabase extends Dexie {
    highScores!: Table<HighScore, number>;
    config!: Table<UserConfig, number>;

    constructor() {
        super('SpaceShooterDB');
        this.version(1).stores({
            highScores: '++id, score, level, date',
            config: '++id, volume, difficulty'
        });
    }
}

export const db = new GameDatabase();

export class Storage {
    public static async saveScore(score: number, level: number): Promise<void> {
        await db.highScores.add({
            score,
            level,
            date: new Date()
        });
    }

    public static async getHighScores(limit: number = 10): Promise<HighScore[]> {
        return await db.highScores.orderBy('score').reverse().limit(limit).toArray();
    }

    public static async saveConfig(config: UserConfig): Promise<void> {
        config.id = 1;
        await db.config.put(config);
    }

    public static async getConfig(): Promise<UserConfig | undefined> {
        return await db.config.get(1);
    }
}
