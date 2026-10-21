# Savannah Technology website (Astro)

Landing page built from the Savannah Technology company profile.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static site to ./dist
npm run preview
```

## Where things live

- `src/data/content.js`: all copy (services, projects, clients, partners, contact details). Edit text here.
- `src/components/`: page sections. `ServicesExplorer.jsx`, `ProjectsExplorer.jsx` and `ContactForm.jsx` are the interactive Preact islands (hydrated only when scrolled into view).
- `src/styles/global.css`: colour tokens (yellow, orange, navy from the brand) and shared styles.
- `astro.config.mjs`: set `site` to your real domain.

## To do before launch

- Add real logos: drop files in `public/` and swap the text "logo" chips in `Clients.astro`.
- Contact form currently opens the visitor's email app (`mailto:`). To post to a service, edit `send` in `ContactForm.jsx`.
- Confirm the second phone number (+ 367 0392 8333 in the PDF looks incomplete); only +254 724 830 064 is used.

## Deploy

`dist/` is static: upload to Netlify, Vercel, Cloudflare Pages or GitHub Pages.
