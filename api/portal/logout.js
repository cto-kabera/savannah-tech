import { logoutPortal } from '../../src/server/portal.js';

export async function POST() {
  const result = logoutPortal();
  const res = Response.json(result.payload, { status: result.status });
  if (result.cookie) res.headers.append('Set-Cookie', result.cookie);
  return res;
}
