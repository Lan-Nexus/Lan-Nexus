import { serial, mysqlTable, text } from "drizzle-orm/mysql-core";

export const gamesTable = mysqlTable("games", {
  id: serial().primaryKey(),
  name: text().notNull(),
});
