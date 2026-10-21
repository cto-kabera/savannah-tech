import { useMemo, useState } from 'react/hooks';

// Interactive solutions explorer: filter by category, search, and expand a card.
export default function ServicesExplorer({ services }) {
  const categories = useMemo(() => ['All', ...new Set(services.map((s) => s.category))], [services]);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);

  const visible = services.filter(
    (s) =>
      (cat === 'All' || s.category === cat) &&
      (s.title + ' ' + s.text).toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div class="svc">
      <div class="controls">
        <div class="tabs" role="tablist" aria-label="Solution categories">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              class={cat === c ? 'tab on' : 'tab'}
              onClick={() => { setCat(c); setOpen(null); }}
            >
              {c}
            </button>
          ))}
        </div>
        <label class="search">
          <span class="sr-only">Search solutions</span>
          <input
            type="search"
            placeholder="Search solutions…"
            value={q}
            onInput={(e) => setQ(e.currentTarget.value)}
          />
        </label>
      </div>

      <p class="count" aria-live="polite">
        Showing {visible.length} of {services.length} solutions
      </p>

      <div class="cards">
        {visible.map((s) => {
          const isOpen = open === s.id;
          return (
            <article key={s.id} class={isOpen ? 'item open' : 'item'}>
              <button
                class="item-btn"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span class="ico" aria-hidden="true">{s.icon}</span>
                <span class="meta">
                  <span class="cat">{s.category}</span>
                  <span class="ttl">{s.title}</span>
                </span>
                <span class="chev" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div class="body">
                  <p>{s.text}</p>
                  <a href="#contact" class="ask">Ask about this →</a>
                </div>
              )}
            </article>
          );
        })}
        {visible.length === 0 && <p class="empty">No solutions match your search.</p>}
      </div>

      <style>{`
        .svc .controls { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: center; }
        .svc .tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .svc .tab {
          font: inherit; font-weight: 600; font-size: 0.88rem; cursor: pointer;
          padding: 0.5rem 1.1rem; border-radius: 999px; border: 1px solid var(--line);
          background: #fff; color: var(--ink); transition: all 0.15s;
        }
        .svc .tab:hover { border-color: var(--orange); }
        .svc .tab.on { background: var(--navy); border-color: var(--navy); color: #fff; }
        .svc .search input {
          font: inherit; padding: 0.6rem 1rem; border-radius: 999px; border: 1px solid var(--line);
          min-width: 220px; background: #fff;
        }
        .svc .search input:focus, .svc .tab:focus-visible, .svc .item-btn:focus-visible {
          outline: 3px solid var(--orange); outline-offset: 2px;
        }
        .svc .count { color: var(--muted); font-size: 0.85rem; margin: 1.2rem 0 1rem; }
        .svc .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1rem; align-items: start; }
        .svc .item { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; transition: box-shadow 0.2s, border-color 0.2s; }
        .svc .item:hover, .svc .item.open { box-shadow: var(--shadow); border-color: var(--yellow); }
        .svc .item-btn {
          width: 100%; display: flex; align-items: center; gap: 0.9rem; text-align: left;
          padding: 1.1rem 1.2rem; background: none; border: 0; cursor: pointer; font: inherit; color: inherit;
        }
        .svc .ico { font-size: 1.6rem; width: 2.8rem; height: 2.8rem; display: grid; place-items: center; background: #fff8d6; border-radius: 12px; flex: none; }
        .svc .meta { display: flex; flex-direction: column; flex: 1; }
        .svc .cat { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--orange); }
        .svc .ttl { font-weight: 700; color: var(--navy); }
        .svc .chev { font-size: 1.4rem; font-weight: 700; color: var(--orange); }
        .svc .body { padding: 0 1.2rem 1.2rem 5rem; }
        .svc .body p { color: var(--muted); font-size: 0.93rem; margin: 0 0 0.6rem; }
        .svc .ask { font-weight: 700; font-size: 0.88rem; color: var(--navy); text-decoration: none; border-bottom: 2px solid var(--yellow); }
        .svc .empty { color: var(--muted); }
      `}</style>
    </div>
  );
}
