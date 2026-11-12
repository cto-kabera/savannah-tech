import { acceptQuote, tooMany } from '../src/server/quote-db.js';

export async function POST(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || 'local';
  if (tooMany(ip)) {
    return Response.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = await acceptQuote(body);
  return Response.json(result.payload, { status: result.status });
}
