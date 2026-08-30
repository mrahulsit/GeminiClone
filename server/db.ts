import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'New Chat',
      model TEXT DEFAULT NULL,
      pinned BOOLEAN DEFAULT FALSE,
      created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
      updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      feedback TEXT DEFAULT NULL,
      created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS preferences (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      theme TEXT DEFAULT 'dark',
      accent TEXT DEFAULT 'blue',
      font_size TEXT DEFAULT 'md',
      custom_instructions TEXT DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at BIGINT NOT NULL,
      created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
    )
  `;

  // Migration: add columns to existing tables if missing
  await sql`ALTER TABLE chats ADD COLUMN IF NOT EXISTS model TEXT DEFAULT NULL`;
  await sql`ALTER TABLE chats ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS feedback TEXT DEFAULT NULL`;
  await sql`ALTER TABLE preferences ADD COLUMN IF NOT EXISTS custom_instructions TEXT DEFAULT ''`;
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS images JSONB DEFAULT NULL`;
  await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS thinking TEXT DEFAULT NULL`;
  await sql`ALTER TABLE preferences ADD COLUMN IF NOT EXISTS thinking_level TEXT DEFAULT 'medium'`;

  console.log("✓ Database tables ready");
}

export default sql;
