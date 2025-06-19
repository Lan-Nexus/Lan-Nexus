import Model from './Model.js';
import { gamesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import fs from 'fs/promises';

export default class GameModel extends Model {
  static async create(game: typeof gamesTable.$inferInsert) {
    const newGame = await db.insert(gamesTable).values(game).$returningId();
    const item = await db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, newGame[0].id) });
    return item;
  }

  static async read(id: typeof gamesTable.$inferSelect.id) {
    return db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, id) });
  }

  static update(id: typeof gamesTable.$inferSelect.id, game: typeof gamesTable.$inferSelect) {
    return db.update(gamesTable).set(game).where(eq(gamesTable.id, id));
  }

  static async delete(id: typeof gamesTable.$inferSelect.id) {
    await db.delete(gamesTable).where(eq(gamesTable.id, id));
  }
  
  static async setImage(id: typeof gamesTable.$inferSelect.id, image: string, imageType: string, fileType: string) {
    if (!image || !imageType) {
      throw new Error('Image and imageType are required');
    }

    const game = await db.query.gamesTable.findFirst({ where: (gamesTable, { eq }) => eq(gamesTable.id, id) });

    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }

    const imagePath = `./public/games/images/${id}/${imageType}.${fileType}`;
    const insert: { [key: string]: string } = {};

    insert[imageType] = `/games/images/${id}/${imageType}.${fileType}`;

    // Ensure the directory exists
    await fs.mkdir('./public/games/images/' + id, { recursive: true });

    await fs.writeFile(imagePath, image, 'base64');
  
    await db.update(gamesTable)
      .set(insert)
      .where(eq(gamesTable.id, id))

  }

  static list() {
    return db.select().from(gamesTable).orderBy(gamesTable.name);
  }
}
