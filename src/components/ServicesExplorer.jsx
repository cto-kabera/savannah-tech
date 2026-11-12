import { useMemo, useState } from 'preact/hooks';

const TILES = {
  design: ['#fff6cc', '#ffe08a'],
  cabling: ['#e7f3ff', '#c9e2ff'],
  cctv: ['#eef0f7', '#d7deee'],
  access: ['#fff1e6', '#ffd4b4'],
  intrusion: ['#ffeeee', '#ffd0d0'],
  fire: ['#fff2e4', '#ffd2a4'],
  pa: ['#fff7d8', '#ffe59a'],
  av: ['#f4eeff', '#e1d4fc'],
  iptv: ['#e7f8f3', '#c5efe1'],
  bms: ['#eef3ff', '#d4e2ff'],
  power: ['#fff8de', '#ffe6a0'],
  hardware: ['#eef4f8', '#d5e4f0'],
  pbx: ['#e8f8ee', '#c8efd7'],
  datacenter: ['#f3f1ff', '#ddd7fb'],
};

function ServiceIcon({ id }) {
  const svg = { viewBox: '0 0 32 32', width: '26', height: '26', 'aria-hidden': 'true' };
  const navy = '#252f47';
  const orange = '#f7941d';
  const gold = '#ffce00';
  switch (id) {
    case 'design':
      return (
        <svg {...svg}>
          <rect x="5" y="4" width="16" height="22" rx="3" fill={navy} />
          <rect x="8.5" y="9" width="9" height="2" rx="1" fill={gold} />
          <rect x="8.5" y="13" width="7" height="2" rx="1" fill="#fff" opacity="0.85" />
          <rect x="8.5" y="17" width="5" height="2" rx="1" fill="#fff" opacity="0.5" />
          <path d="M18.2 18.2 25.6 10.8 28.2 13.4 20.8 20.8 17.6 21.4z" fill={orange} />
          <path d="M25.6 10.8 28 8.4 30.4 10.8 28.2 13.4z" fill={gold} />
        </svg>
      );
    case 'cabling':
      return (
        <svg {...svg}>
          <path d="M7 15h18v7a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z" fill={navy} />
          <rect x="10.2" y="18.2" width="2.1" height="4.2" rx="0.4" fill={gold} />
          <rect x="14.9" y="18.2" width="2.1" height="4.2" rx="0.4" fill={gold} />
          <rect x="19.6" y="18.2" width="2.1" height="4.2" rx="0.4" fill={gold} />
          <path d="M11.5 15V9.2h2.4l1.3 2.2h1.6l1.3-2.2h2.4V15" fill="none" stroke={orange} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    case 'cctv':
      return (
        <svg {...svg}>
          <rect x="3.5" y="10" width="17" height="13" rx="3" fill={navy} />
          <path d="M20.5 13.2 28 9.8v12.4l-7.5-3.4z" fill={orange} />
          <circle cx="12" cy="16.5" r="3.4" fill={gold} />
          <circle cx="12" cy="16.5" r="1.5" fill={navy} />
          <rect x="6" y="7.2" width="6" height="2.2" rx="1" fill={orange} />
        </svg>
      );
    case 'access':
      return (
        <svg {...svg}>
          <rect x="4" y="7" width="15" height="18" rx="3" fill={navy} />
          <rect x="7" y="11" width="7" height="2" rx="1" fill={gold} />
          <rect x="7" y="15" width="5" height="1.6" rx="0.8" fill="#fff" opacity="0.55" />
          <circle cx="22.5" cy="18.5" r="6.2" fill={orange} />
          <circle cx="22.5" cy="17.4" r="1.7" fill={navy} />
          <rect x="21.2" y="18.2" width="2.6" height="4.4" rx="0.6" fill={navy} />
        </svg>
      );
    case 'intrusion':
      return (
        <svg {...svg}>
          <path d="M9 22h14l2.2 4.2H6.8z" fill={navy} />
          <path d="M16 5.5a8 8 0 0 1 8 8V22H8v-8.5a8 8 0 0 1 8-8z" fill={orange} />
          <path d="M16 9a5 5 0 0 1 5 5v5H11v-5a5 5 0 0 1 5-5z" fill={gold} />
          <rect x="15" y="12.2" width="2" height="4.6" rx="1" fill={navy} />
        </svg>
      );
    case 'fire':
      return (
        <svg {...svg}>
          <path d="M16.2 3.5c1.6 4.6 7.6 6.6 7.6 13.2a7.8 7.8 0 0 1-15.6 0c0-2.8 1.8-4.8 2.8-6.6 1 2 2 2.8 2.8 2.8.2-3.6 1-6.4 2.4-9.4z" fill={orange} />
          <path d="M16.2 13.2c1 2.2 3.8 3.2 3.8 6.2a3.8 3.8 0 0 1-7.6 0c0-1.5.9-2.5 1.5-3.5.6 1 1.1 1.4 1.5 1.4.2-1.6.5-2.8.8-4.1z" fill={gold} />
        </svg>
      );
    case 'pa':
      return (
        <svg {...svg}>
          <path d="M5 13.2h6.2L23 7.2v17.6l-11.8-6H5z" fill={navy} />
          <path d="M7.2 19.2v4.6a2.8 2.8 0 0 0 2.8 2.8h1.2v-7.6" fill={orange} />
          <path d="M25.2 11.5a5.2 5.2 0 0 1 0 9" fill="none" stroke={gold} stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    case 'av':
      return (
        <svg {...svg}>
          <rect x="4" y="11" width="6" height="11" rx="1.5" fill={navy} />
          <path d="M10 11 18 7v18l-8-4z" fill={orange} />
          <path d="M21.5 12.5v8M24.6 10.2v12.6M27.6 13.4v6.2" stroke={gold} stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    case 'iptv':
      return (
        <svg {...svg}>
          <rect x="3.5" y="7" width="25" height="16" rx="3" fill={navy} />
          <rect x="6.5" y="10" width="19" height="10" rx="1.6" fill={gold} />
          <path d="M13.2 12.6 19.6 16l-6.4 3.4z" fill={navy} />
          <rect x="13" y="24.2" width="6" height="2.2" rx="1" fill={orange} />
        </svg>
      );
    case 'bms':
      return (
        <svg {...svg}>
          <path d="M7 28V11l9-6.5L25 11v17z" fill={navy} />
          <rect x="11" y="13" width="3.2" height="3.2" rx="0.5" fill={gold} />
          <rect x="17.2" y="13" width="3.2" height="3.2" rx="0.5" fill={gold} />
          <rect x="11" y="18.2" width="3.2" height="3.2" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="17.2" y="18.2" width="3.2" height="3.2" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="14.2" y="23" width="3.6" height="5" fill={orange} />
        </svg>
      );
    case 'power':
      return (
        <svg {...svg}>
          <rect x="8" y="8" width="16" height="19" rx="3" fill={navy} />
          <rect x="12" y="4.2" width="2.8" height="4.4" rx="1" fill={orange} />
          <rect x="17.2" y="4.2" width="2.8" height="4.4" rx="1" fill={orange} />
          <path d="M17.4 12.4 13.2 18.2h3.8l-1.2 5.6 5.2-7.2h-3.8z" fill={gold} />
        </svg>
      );
    case 'hardware':
      return (
        <svg {...svg}>
          <rect x="3.5" y="5.5" width="25" height="16" rx="3" fill={navy} />
          <rect x="6.5" y="8.5" width="19" height="10" rx="1.5" fill={gold} />
          <path d="M12 26.2h8M16 21.5v4.7" stroke={orange} stroke-width="2.1" stroke-linecap="round" />
        </svg>
      );
    case 'pbx':
      return (
        <svg {...svg}>
          <rect x="7" y="5" width="10" height="22" rx="2.4" fill={navy} />
          <rect x="9.2" y="8.2" width="5.6" height="7.2" rx="1" fill="#fff" opacity="0.88" />
          <circle cx="12" cy="22.2" r="1.4" fill={gold} />
          <path d="M19.5 12.2a6.2 6.2 0 0 1 0 8.6" fill="none" stroke={orange} stroke-width="2" stroke-linecap="round" />
          <path d="M22.2 10a9 9 0 0 1 0 13" fill="none" stroke={gold} stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    case 'datacenter':
      return (
        <svg {...svg}>
          <rect x="6.5" y="3.5" width="19" height="7" rx="2" fill={navy} />
          <rect x="6.5" y="12.5" width="19" height="7" rx="2" fill={navy} />
          <rect x="6.5" y="21.5" width="19" height="7" rx="2" fill={navy} />
          <circle cx="10.4" cy="7" r="1.25" fill={gold} />
          <circle cx="10.4" cy="16" r="1.25" fill={orange} />
          <circle cx="10.4" cy="25" r="1.25" fill="#5dce78" />
          <rect x="14" y="6.2" width="8" height="1.6" rx="0.8" fill="#fff" opacity="0.75" />
          <rect x="14" y="15.2" width="8" height="1.6" rx="0.8" fill="#fff" opacity="0.75" />
          <rect x="14" y="24.2" width="8" height="1.6" rx="0.8" fill="#fff" opacity="0.75" />
        </svg>
      );
    default:
      return null;
  }
}

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
                <span
                  class="ico"
                  aria-hidden="true"
                  style={{ background: `linear-gradient(150deg, ${TILES[s.id][0]}, ${TILES[s.id][1]})` }}
                >
                  <ServiceIcon id={s.id} />
                </span>
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
        .svc .ico {
          width: 3rem; height: 3rem; display: grid; place-items: center; border-radius: 14px; flex: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.75), 0 6px 14px rgba(37,47,71,0.08);
          transition: transform 0.2s ease;
        }
        .svc .item:hover .ico, .svc .item.open .ico { transform: translateY(-2px) scale(1.05); }
        .svc .ico svg { display: block; width: 26px; height: 26px; max-width: none; }
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
