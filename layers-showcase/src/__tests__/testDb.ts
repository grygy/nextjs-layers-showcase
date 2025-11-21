import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import { sql } from 'drizzle-orm';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  return db;
}

export function clearTestDb(db: ReturnType<typeof createTestDb>) {
  db.run(sql`DELETE FROM ${schema.users}`);
}

