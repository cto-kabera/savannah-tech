import { portalQuotes } from '../../src/server/portal.js';

export async function GET(request) {
  const result = await portalQuotes(request.headers.get('cookie') || '');
  return Response.json(result.payload, { status: result.status });
}
