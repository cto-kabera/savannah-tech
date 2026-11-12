import { createHmac, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { listQuotes } from './quote-db.js';

const COOKIE = 'st_portal';

function portalPassword() {
  if (process.env.PORTAL_PASSWORD) return process.env.PORTAL_PASSWORD;
  if (process.env.VERCEL) return '';
  try {
    const text = readFileSync(new URL('../../.env', import.meta.url), 'utf8');
    const line = text.split('\n').find((entry) => entry.startsWith('PORTAL_PASSWORD='));
    if (!line) return '';
    return line.slice('PORTAL_PASSWORD='.length).trim().replace(/^['"]|['"]$/g, '');
  } catch {
    return '';
  }
}

function tokenFor(password) {
  return createHmac('sha256', password).update('savannah-portal').digest('hex');
}

function same(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function cookieHeader(value, maxAge) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function portalCookieFrom(header) {
  if (!header) return '';
  const part = header.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE}=`));
  return part ? part.slice(COOKIE.length + 1) : '';
}

export function portalAuthed(cookieHeader) {
  const password = portalPassword();
  if (!password) return false;
  const cookie = portalCookieFrom(cookieHeader);
  return Boolean(cookie) && same(cookie, tokenFor(password));
}

export function loginPortal(password) {
  const expected = portalPassword();
  if (!expected) {
    return {
      status: 503,
      payload: { error: 'Portal access is not configured yet.' },
    };
  }
  if (typeof password !== 'string' || !password || !same(password, expected)) {
    return { status: 401, payload: { error: 'That password is not correct.' } };
  }
  return {
    status: 200,
    payload: { ok: true },
    cookie: cookieHeader(tokenFor(expected), 60 * 60 * 24 * 7),
  };
}

export function logoutPortal() {
  return { status: 200, payload: { ok: true }, cookie: cookieHeader('', 0) };
}

export async function portalQuotes(cookieHeader) {
  if (!portalAuthed(cookieHeader)) {
    return { status: 401, payload: { error: 'Sign in to view requests.' } };
  }
  try {
    const quotes = await listQuotes();
    return { status: 200, payload: { quotes } };
  } catch (error) {
    if (error.code === 'NO_DATABASE') {
      return { status: 503, payload: { error: 'Quote storage is not configured yet.' } };
    }
    console.error('portal list failed');
    return { status: 500, payload: { error: 'We could not load quote requests.' } };
  }
}
