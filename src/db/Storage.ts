// import Dexie from 'dexie';

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

// Mock implementation to bypass Dexie issues
class MockTable<T> {
    private data: T[] = [];

    async add(item: T): Promise<void> {
        this.data.push(item);
    }

    async put(item: T): Promise<void> {
        this.data = [item];
    }

    async get(key: any): Promise<T | undefined> {
        return this.data[0];
    }

    orderBy(key: string) {
        return {
            reverse: () => ({
                limit: (limit: number) => ({
                    toArray: async () => {
                        return this.data.sort((a: any, b: any) => b[key] - a[key]).slice(0, limit);
                    }
                })
            })
        };
    }
}

export class GameDatabase {
    highScores = new MockTable<HighScore>();
    config = new MockTable<UserConfig>();
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
