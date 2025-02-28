import { serial, mysqlTable, text } from "drizzle-orm/mysql-core";
import { z } from 'zod';
import { 
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const gamesTable = mysqlTable("games", {
  id: serial().primaryKey(),
  name: text().notNull(),
});

export const gamesSelectSchema = createSelectSchema(gamesTable);
export const gamesInsertSchema = createInsertSchema(gamesTable);
//export const gamesUpdateSchema = createUpdateSchema(gamesTable);
export const gamesUpdateSchema = z.object({
  id: z.number(),
  name: z.string()
});


export const gameIdSchema = z.object({
  id: z.number().int().positive()
});

export type Game = z.infer<typeof gamesSelectSchema>;
export type NewGame = z.infer<typeof gamesInsertSchema>;
export type GameUpdate = z.infer<typeof gamesUpdateSchema>;

