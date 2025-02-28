import { gamesTable} from '../db/schema.js';
import { NewGame,Game} from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';

export default class GameModel {
  static async create(game: NewGame): Promise<void>{
   db.insert(gamesTable).values(game);
  }

  static async read(id: number): Promise<Game | undefined> {
    const result = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, id))
      .limit(1);
    
    return result[0];
  }

  static async update(id: number, game: Game): Promise<void> {
    await db.update(gamesTable).set(game).where(eq(gamesTable.id, id));
  }

  static async delete() {
    await db.delete().from(gamesTable).where(eq(gamesTable.id, id));
  }

  static async list(): Promise<Game[]> {
    return await db.select().from(gamesTable);
  }

}
