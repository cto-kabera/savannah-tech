import { acceptQuote, tooMany } from './quote-db.js';

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

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

// Dev-server route. The production route is api/quote.js, which Vercel runs
// beside the static site. GitHub Pages never executes either file.
export function quoteApi() {
  return {
    name: 'savannah-quote-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        if (req.method !== 'POST' || !path.endsWith('/api/quote')) return next();

        const ip = req.socket?.remoteAddress || 'local';
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
      });
    },
  };
}
