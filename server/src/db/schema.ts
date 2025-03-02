import { serial, mysqlTable, text } from "drizzle-orm/mysql-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const gamesTable = mysqlTable("games", {
  id: serial().primaryKey(),
  gameID: text('game_id').notNull(),
  name: text().notNull(),
  description: text().notNull(),
  icon: text().notNull(),
  headerImage: text('header_image').notNull(),
  bannerImage: text('banner_image').notNull(),
  type: text().notNull(),
});

export const gamesSelectSchema = createSelectSchema(gamesTable);
export const gamesInsertSchema = createInsertSchema(gamesTable, {
  name: gamesSelectSchema.shape.name,
});
export const gamesUpdateSchema = createUpdateSchema(gamesTable, gamesSelectSchema.shape);