import { acceptQuote, tooMany } from './quote-db.js';
import { loginPortal, logoutPortal, portalQuotes, portalSetStatus } from './portal.js';

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 32_000) {
        reject(Object.assign(new Error('Body too large'), { code: 'TOO_LARGE' }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res, status, payload, cookie) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (cookie) res.setHeader('Set-Cookie', cookie);
  res.end(JSON.stringify(payload));
}

function cookieHeader(req) {
  return req.headers.cookie || req.headers.Cookie || '';
}

function clientIp(req) {
  return req.socket?.remoteAddress || 'local';
}

// Dev-server routes. Production uses the files in /api, which Vercel runs
// beside the static site. GitHub Pages never executes either path.
export function quoteApi() {
  return {
    name: 'savannah-quote-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        const ip = clientIp(req);

        if (req.method === 'POST' && path.endsWith('/api/quote')) {
          if (tooMany(ip)) return send(res, 429, { error: 'Too many requests. Please wait a minute and try again.' });
          let body;
          try {
            body = JSON.parse(await readBody(req) || '{}');
          } catch (error) {
            if (error.code === 'TOO_LARGE') return send(res, 413, { error: 'That message is too long. Please shorten it and try again.' });
            return send(res, 400, { error: 'Invalid request.' });
          }
          const result = await acceptQuote(body);
          return send(res, result.status, result.payload);
        }

        if (req.method === 'POST' && path.endsWith('/api/portal/login')) {
          if (tooMany(ip)) return send(res, 429, { error: 'Too many requests. Please wait a minute and try again.' });
          let body;
          try {
            body = JSON.parse(await readBody(req) || '{}');
          } catch {
            return send(res, 400, { error: 'Invalid request.' });
          }
          const result = loginPortal(body.password);
          return send(res, result.status, result.payload, result.cookie);
        }

        if (req.method === 'POST' && path.endsWith('/api/portal/logout')) {
          const result = logoutPortal();
          return send(res, result.status, result.payload, result.cookie);
        }

        if (req.method === 'GET' && path.endsWith('/api/portal/quotes')) {
          const result = await portalQuotes(cookieHeader(req));
          return send(res, result.status, result.payload);
        }

        if (req.method === 'POST' && path.endsWith('/api/portal/status')) {
          if (tooMany(ip)) return send(res, 429, { error: 'Too many requests. Please wait a minute and try again.' });
          let body;
          try {
            body = JSON.parse(await readBody(req) || '{}');
          } catch {
            return send(res, 400, { error: 'Invalid request.' });
          }
          const result = await portalSetStatus(cookieHeader(req), body);
          return send(res, result.status, result.payload);
        }

        return next();
      });
    },
  };
}
