import { serial, mysqlTable, text, varchar, int } from "drizzle-orm/mysql-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const gamesTable = mysqlTable("games", {
  id: serial().primaryKey(),
  gameID: varchar('game_id', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text().notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  headerImage: varchar('header_image', { length: 255 }).notNull(),
  bannerImage: varchar('banner_image', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
});

export const gamesSelectSchema = createSelectSchema(gamesTable);
export const gamesInsertSchema = createInsertSchema(gamesTable, {
  name: gamesSelectSchema.shape.name,
});
export const gamesUpdateSchema = createUpdateSchema(gamesTable, gamesSelectSchema.shape);