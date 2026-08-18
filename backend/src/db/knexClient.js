import knex from 'knex';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = (process.env.DATABASE_CLIENT || 'sqlite3').toLowerCase();

function buildConfig() {
  if (client === 'pg' || client === 'postgres' || client === 'postgresql') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when using PostgreSQL');
    }
    return {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      pool: {
        min: Number(process.env.DB_POOL_MIN || 2),
        max: Number(process.env.DB_POOL_MAX || 10)
      }
    };
  }

  // Default to SQLite for local development and tests
  const dataDir = process.env.SQLITE_DATA_DIR || path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filename = process.env.SQLITE_PATH || path.join(dataDir, 'wiztopia.sqlite3');

  return {
    client: 'sqlite3',
    connection: {
      filename
    },
    useNullAsDefault: true,
    pool: {
      afterCreate(conn, done) {
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  };
}

export const db = knex(buildConfig());

export async function closeDatabase() {
  await db.destroy();
}
