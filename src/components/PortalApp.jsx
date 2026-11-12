import { useEffect, useState } from 'preact/hooks';
import { classifyContact, STATUS_LABELS } from '../data/quote.js';

const FILTERS = [
  ['active', 'Active'],
  ['follow_up', 'Follow up'],
  ['closed', 'Closed'],
  ['done', 'Done'],
];

const ACTIONS = [
  ['follow_up', 'Follow up'],
  ['closed', 'Closed'],
  ['done', 'Done'],
];

function isMobilePhone() {
  if (typeof navigator === 'undefined') return false;
  if (/Mobi|Android|iPhone|iPod/i.test(navigator.userAgent)) return true;
  return navigator.maxTouchPoints > 1 && window.matchMedia('(max-width: 900px)').matches;
}

function when(iso) {
  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function PortalApp({ apiBase }) {
  const [quotes, setQuotes] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [signing, setSigning] = useState(false);
  const [picker, setPicker] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('active');
  const [saving, setSaving] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${apiBase}/api/portal/quotes`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        setQuotes([]);
        return;
      }
      if (!res.ok) {
        setErr(data.error || 'We could not load quote requests.');
        return;
      }
      setAuthed(true);
      setQuotes(data.quotes || []);
    } catch {
      setErr('We could not load quote requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const signIn = async (event) => {
    event.preventDefault();
    setSigning(true);
    setErr('');
    try {
      const res = await fetch(`${apiBase}/api/portal/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'That password is not correct.');
        return;
      }
      setPassword('');
      setAuthed(true);
      await load();
    } catch {
      setErr('We could not sign you in.');
    } finally {
      setSigning(false);
    }
  };

  const signOut = async () => {
    await fetch(`${apiBase}/api/portal/logout`, { method: 'POST', credentials: 'include' });
    setAuthed(false);
    setQuotes([]);
  };

  const setStatus = async (quote, status) => {
    const next = quote.status === status ? 'open' : status;
    setSaving(quote.id);
    setErr('');
    const previous = quote.status;
    setQuotes((list) => list.map((item) => (item.id === quote.id ? { ...item, status: next } : item)));
    try {
      const res = await fetch(`${apiBase}/api/portal/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quote.id, status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        setQuotes([]);
        return;
      }
      if (!res.ok) {
        setQuotes((list) => list.map((item) => (item.id === quote.id ? { ...item, status: previous } : item)));
        setErr(data.error || 'We could not update that request.');
      }
    } catch {
      setQuotes((list) => list.map((item) => (item.id === quote.id ? { ...item, status: previous } : item)));
      setErr('We could not update that request.');
    } finally {
      setSaving('');
    }
  };

  const onContact = (quote) => {
    const info = classifyContact(quote.contact);
    if (info.kind === 'email') {
      window.location.href = info.mailto;
      return;
    }
    if (info.kind === 'phone') {
      if (isMobilePhone()) {
        setPicker({ quote, info });
        return;
      }
      window.location.href = info.tel;
    }
  };

  const filtered = quotes.filter((quote) => {
    const status = quote.status || 'open';
    if (filter === 'active' && status !== 'open') return false;
    if (filter !== 'active' && status !== filter) return false;
    const hay = `${quote.name} ${quote.contact} ${quote.message} ${(quote.interests || []).join(' ')} ${STATUS_LABELS[status] || ''}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  if (!authed) {
    return (
      <form class="gate" onSubmit={signIn}>
        <span class="eyebrow">Staff only</span>
        <h1>Quote portal</h1>
        <p>Sign in to see customer requests from the website form.</p>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </label>
        {err && <p class="err" role="alert">{err}</p>}
        <button class="btn btn-primary" type="submit" disabled={signing}>
          {signing ? 'Signing in…' : 'Sign in'}
        </button>
        <style>{gateCss}</style>
      </form>
    );
  }

  return (
    <div class="desk">
      <div class="head">
        <div>
          <span class="eyebrow">Incoming requests</span>
          <h1>Quote portal</h1>
        </div>
        <button class="btn ghost" type="button" onClick={signOut}>Sign out</button>
      </div>
      <label class="find">
        Search
        <input
          type="search"
          placeholder="Name, phone, email, or service"
          value={q}
          onInput={(e) => setQ(e.currentTarget.value)}
        />
      </label>
      <div class="filters" role="tablist" aria-label="Filter by status">
        {FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            class={filter === id ? 'chip on' : 'chip'}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {err && <p class="err" role="alert">{err}</p>}
      {loading && <p class="muted">Loading requests…</p>}
      {!loading && filtered.length === 0 && (
        <p class="muted">{filter === 'done' ? 'No completed requests.' : 'No quote requests in this view.'}</p>
      )}
      <ul class="list">
        {filtered.map((quote) => {
          const info = classifyContact(quote.contact);
          const status = quote.status || 'open';
          return (
            <li class={`card item ${status}`} key={quote.id}>
              <div class="meta">
                <h2>{quote.name}</h2>
                <time dateTime={quote.createdAt}>{when(quote.createdAt)}</time>
              </div>
              <button
                class={`contact ${info.kind}`}
                type="button"
                onClick={() => onContact(quote)}
              >
                <span class="kind">{info.kind === 'email' ? 'Email' : info.kind === 'phone' ? 'Phone' : 'Contact'}</span>
                {quote.contact}
              </button>
              {quote.interests?.length > 0 && (
                <ul class="chips">
                  {quote.interests.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              <p class="note">{quote.message}</p>
              <div class="actions">
                {ACTIONS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    class={status === id ? `act on ${id}` : 'act'}
                    disabled={saving === quote.id}
                    onClick={() => setStatus(quote, id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      {picker && (
        <div class="veil" role="presentation" onClick={() => setPicker(null)}>
          <div
            class="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reach-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="reach-title">Reach {picker.quote.name}</h2>
            <p>{picker.info.label}</p>
            <a class="btn btn-primary" href={picker.info.tel}>Call phone</a>
            <a class="btn wa" href={picker.info.whatsapp} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
            <button class="btn ghost" type="button" onClick={() => setPicker(null)}>Cancel</button>
          </div>
        </div>
      )}
      <style>{deskCss}</style>
    </div>
  );
}

const gateCss = `
.gate{max-width:28rem;margin:3rem auto;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:2rem;box-shadow:var(--shadow)}
.gate h1{font-size:1.8rem}
.gate label{display:grid;gap:.4rem;font-weight:600;margin:1.2rem 0}
.gate input{font:inherit;padding:.85rem 1rem;border:1px solid var(--line);border-radius:12px}
.err{color:#b42318;font-weight:600}
`;

const deskCss = `
.desk h1{font-size:clamp(1.8rem,4vw,2.4rem);margin-bottom:.2rem}
.head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:1.5rem}
.btn.ghost{background:#fff;border-color:var(--line);color:var(--navy)}
.find{display:grid;gap:.4rem;font-weight:600;margin-bottom:.8rem}
.find input{font:inherit;padding:.85rem 1rem;border:1px solid var(--line);border-radius:12px;background:#fff}
.filters{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.4rem}
.filters .chip{font:inherit;font-weight:600;font-size:.88rem;padding:.4rem .9rem;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--navy);cursor:pointer}
.filters .chip.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.muted{color:var(--muted)}
.err{color:#b42318;font-weight:600}
.list{list-style:none;margin:0;padding:0;display:grid;gap:1rem}
.item{display:grid;gap:.75rem}
.item:hover{transform:none}
.meta{display:flex;justify-content:space-between;gap:1rem;align-items:baseline;flex-wrap:wrap}
.meta h2{font-size:1.15rem;margin:0}
.meta time{color:var(--muted);font-size:.9rem}
.contact{justify-self:start;border:0;background:var(--soft);color:var(--navy);font:inherit;font-weight:700;padding:.55rem .9rem;border-radius:999px;cursor:pointer}
.contact.email,.contact.phone{text-decoration:none}
.kind{display:inline-block;margin-right:.5rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--orange)}
.chips{display:flex;flex-wrap:wrap;gap:.4rem;list-style:none;margin:0;padding:0}
.chips li{background:#fff;border:1px solid var(--line);border-radius:999px;padding:.2rem .7rem;font-size:.82rem;font-weight:600}
.note{margin:0;white-space:pre-wrap}
.actions{display:flex;flex-wrap:wrap;gap:.45rem}
.act{font:inherit;font-weight:700;font-size:.82rem;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--navy);cursor:pointer}
.act:disabled{opacity:.55;cursor:wait}
.act.on.follow_up{background:#fff4e0;border-color:var(--orange);color:var(--navy)}
.act.on.closed{background:var(--navy);border-color:var(--navy);color:#fff}
.act.on.done{background:#d7f5e3;border-color:#1f8a4c;color:#145c32}
.item.follow_up{border-color:#f3c48a}
.item.closed{opacity:.92}
.veil{position:fixed;inset:0;background:rgba(26,34,54,.45);display:flex;align-items:flex-end;justify-content:center;padding:1rem;z-index:80}
.sheet{width:min(26rem,100%);background:#fff;border-radius:22px 22px 18px 18px;padding:1.4rem;display:grid;gap:.7rem}
.sheet h2{font-size:1.2rem;margin:0}
.sheet .btn{justify-content:center}
.btn.wa{background:#25d366;color:#08351c}
@media (min-width:700px){
  .veil{align-items:center}
  .sheet{border-radius:var(--radius)}
}
`;
