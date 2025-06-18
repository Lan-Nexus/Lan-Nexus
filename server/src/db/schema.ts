import { serial, mysqlTable, text, varchar, int, mediumtext } from "drizzle-orm/mysql-core";
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
  icon: mediumtext('icon'),
  logo: mediumtext('logo'),
  headerImage: mediumtext('headerImage'),
  imageCard: mediumtext('imageCard'),
  heroImage: mediumtext('heroImage'),
  type: varchar('type', { length: 255 }).notNull(),
  script: mediumtext('script'), // Added script field for per-game script
});

export const gamesSelectSchema = createSelectSchema(gamesTable);
export const gamesInsertSchema = createInsertSchema(gamesTable, {
  name: gamesSelectSchema.shape.name,
});
export const gamesUpdateSchema = createUpdateSchema(gamesTable, {
  ...gamesSelectSchema.shape,
  icon: gamesSelectSchema.shape.icon.optional(),
  logo: gamesSelectSchema.shape.logo.optional(),
  headerImage: gamesSelectSchema.shape.headerImage.optional(),
  imageCard: gamesSelectSchema.shape.imageCard.optional(),
  heroImage: gamesSelectSchema.shape.heroImage.optional(),
});