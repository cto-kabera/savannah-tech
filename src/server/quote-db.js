import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { parseQuote, QUOTE_STATUSES } from '../data/quote.js';

let schemaReady = null;

function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.VERCEL) return '';
  try {
    const text = readFileSync(new URL('../../.env', import.meta.url), 'utf8');
    const line = text.split('\n').find((entry) => entry.startsWith('DATABASE_URL='));
    if (!line) return '';
    return line.slice('DATABASE_URL='.length).trim().replace(/^['"]|['"]$/g, '');
  } catch {
    return '';
  }
}

function database() {
  const url = databaseUrl();
  if (!url) {
    const error = new Error('DATABASE_URL is not set');
    error.code = 'NO_DATABASE';
    throw error;
  }
  return neon(url);
}

async function ensureSchema(sql) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS quote_requests (
          id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name text NOT NULL,
          contact text NOT NULL,
          interests text[] NOT NULL DEFAULT '{}',
          message text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sql`
        ALTER TABLE quote_requests
        ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open'
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function listQuotes() {
  const sql = database();
  await ensureSchema(sql);
  const rows = await sql`
    SELECT id, name, contact, interests, message, status, created_at
    FROM quote_requests
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    contact: row.contact,
    interests: Array.isArray(row.interests) ? row.interests : [],
    message: row.message,
    status: QUOTE_STATUSES.includes(row.status) ? row.status : 'open',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }));
}

export async function setQuoteStatus(id, status) {
  if (!/^\d+$/.test(String(id)) || !QUOTE_STATUSES.includes(status)) {
    const error = new Error('Invalid status');
    error.code = 'BAD_STATUS';
    throw error;
  }
  const sql = database();
  await ensureSchema(sql);
  const rows = await sql`
    UPDATE quote_requests
    SET status = ${status}
    WHERE id = ${Number(id)}
    RETURNING id
  `;
  if (!rows.length) {
    const error = new Error('Quote not found');
    error.code = 'NOT_FOUND';
    throw error;
  }
}

export async function saveQuote(quote) {
  const sql = database();
  await ensureSchema(sql);
  // The HTTP driver sends parameters as JSON. Build the text[] from that JSON
  // so quotes and commas in a label stay inside one array element.
  await sql`
    INSERT INTO quote_requests (name, contact, interests, message)
    VALUES (
      ${quote.name},
      ${quote.contact},
      (
        SELECT COALESCE(array_agg(item), '{}')
        FROM json_array_elements_text(${JSON.stringify(quote.interests)}::json) AS item
      ),
      ${quote.message}
    )
  `;
}

const hits = new Map();

export function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 8) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function acceptQuote(body) {
  const parsed = parseQuote(body);
  if (parsed.honeypot) return { status: 201, payload: { ok: true } };
  if (parsed.error) return { status: 400, payload: { error: parsed.error } };

  try {
    await saveQuote(parsed.value);
    return { status: 201, payload: { ok: true } };
  } catch (error) {
    if (error.code === 'NO_DATABASE') {
      return { status: 503, payload: { error: 'Quote storage is not configured yet.' } };
    }
    console.error('quote save failed');
    return { status: 500, payload: { error: 'We could not save your request. Please try again.' } };
  }
}
