import { serial, mysqlTable, text } from "drizzle-orm/mysql-core";
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
export const gamesInsertSchema = createInsertSchema(gamesTable, {
  name: gamesSelectSchema.shape.name,
});
export const gamesUpdateSchema = createUpdateSchema(gamesTable, gamesSelectSchema.shape);

