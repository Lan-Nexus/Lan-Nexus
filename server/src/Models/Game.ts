import Model from './Model.js';
import { gamesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';

export default class GameModel extends Model {
  static async create(game: typeof gamesTable.$inferInsert) {
    const newGame = await db.insert(gamesTable).values(game).$returningId();
    const item = await db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, newGame[0].id) });
    return item;
  }

  static async read(id: typeof gamesTable.$inferSelect.id) {
    return db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, id) });
  }

  static async update(id: typeof gamesTable.$inferSelect.id, game: typeof gamesTable.$inferSelect) {
    // Fetch the current game from the database
    const current = await db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, id) });
    if (!current) throw new Error('Game not found');
    // Only overwrite image fields if new values are provided
    const imageFields = ["icon", "logo", "headerImage", "imageCard", "heroImage"] as const;
    for (const field of imageFields) {
      if (!(game as any)[field]) {
        (game as any)[field] = (current as any)[field];
      }
    }
    return db.update(gamesTable).set(game).where(eq(gamesTable.id, id));
  }

  static async delete(id: typeof gamesTable.$inferSelect.id) {
    await db.delete(gamesTable).where(eq(gamesTable.id, id));
  }

  static list() {
    return db.select().from(gamesTable).orderBy(gamesTable.name);
  }
}
