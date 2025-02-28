import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from './db/schema.js';
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection, { schema: schema, mode: 'default' });
export { db };
