import Model from './Model.js';
import { gameKeysTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';

interface GameKey {
    key: string;
    gameId: number;
    ipAddress: string;
    clientId?: string;
}

export default class GameKeyModel extends Model {
    static async create({ key, gameId, ipAddress, clientId }: GameKey) {
        const newKey = await db.insert(gameKeysTable).values({ key, gameId, ipAddress, clientId }).$returningId();
        // Use direct select since db.query.gameKeysTable is not available
        const [item] = await db.select().from(gameKeysTable).where(eq(gameKeysTable.id, newKey[0].id));
        return item;
    }
    static async read(id: number) {
        const [item] = await db.select().from(gameKeysTable).where(eq(gameKeysTable.id, id));
        return item;
    }
    static async update(id: number, data: Partial<GameKey>) {
        const [current] = await db.select().from(gameKeysTable).where(eq(gameKeysTable.id, id));
        if (!current) throw new Error('Game key not found');
        return db.update(gameKeysTable).set(data).where(eq(gameKeysTable.id, id));
    }
    static async delete(id: number) {
        await db.delete(gameKeysTable).where(eq(gameKeysTable.id, id));
    }
    static async listByGame(gameId: number) {
        return db.select().from(gameKeysTable).where(eq(gameKeysTable.gameId, gameId));
    }
    static async list() {
        return db.select().from(gameKeysTable);
    }
    static async release(id: number) {
        const [key] = await db.select().from(gameKeysTable).where(eq(gameKeysTable.id, id));
        if (!key) throw new Error('Game key not found');
        return db.update(gameKeysTable).set({ ipAddress: '', clientId: null }).where(eq(gameKeysTable.id, id));
    }
    static async reserve(id: number, ipAddress: string, clientId?: string) {
        const [key] = await db.select().from(gameKeysTable).where(eq(gameKeysTable.id, id));
        if (!key) throw new Error('Game key not found');
        return db.update(gameKeysTable).set({ ipAddress, clientId }).where(eq(gameKeysTable.id, id));
    }
    static async getNextAvailableKey(gameId: number) {
        const keys = await db
            .select()
            .from(gameKeysTable)
            .where(
                (row) =>
                    eq(row.gameId, gameId) && eq(row.ipAddress, '')
            );
        if (keys.length === 0) throw new Error('No available keys found');
        return keys[0]; // Return the first available key
    }
    static async myKey(gameId: number, clientId: string) {
        const keys = await db.select().from(gameKeysTable).where(eq(gameKeysTable.clientId, clientId));
        const key = keys.find(k => k.gameId === gameId);
        return key || null;
    }
    
}
