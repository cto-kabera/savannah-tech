import { useState } from 'react/hooks';

const INTERESTS = [
  'CCTV', 'Access control', 'Structured cabling', 'Fire detection', 'Intrusion detection',
  'PA / Audio-visual', 'Building management', 'Power backup', 'Data center', 'AMC / maintenance',
];

// There is no backend yet. Submitting opens the visitor's email app with the message pre-filled.
// To post to a service instead (Formspree, Web3Forms, your own API), replace `send` below.
export default function ContactForm({ email }) {
  const [f, setF] = useState({ name: '', contact: '', message: '' });
  const [picked, setPicked] = useState([]);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const toggle = (i) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const set = (k) => (e) => setF({ ...f, [k]: e.currentTarget.value });

  const send = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.contact.trim() || !f.message.trim()) {
      setErr('Please fill in your name, how to reach you, and a short message.');
      return;
    }
    setErr('');
    const subject = `Quote request from ${f.name}`;
    const body = [
      `Name: ${f.name}`,
      `Phone / email: ${f.contact}`,
      picked.length ? `Interested in: ${picked.join(', ')}` : '',
      '',
      f.message,
    ].filter((l, i) => l !== '' || i > 0).join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div class="done" role="status">
        <h3>Thank you, {f.name.split(' ')[0]}!</h3>
        <p>Your email app should have opened with your message ready to send. If it did not, write to us directly at <a href={`mailto:${email}`}>{email}</a>.</p>
        <button class="btn btn-primary" onClick={() => setSent(false)}>Send another</button>
        <style>{`.done{background:#fff;border-radius:var(--radius);padding:2rem;color:var(--ink)} .done h3{color:var(--navy)}`}</style>
      </div>
    );
  }

  return (
    <form class="cf" onSubmit={send} noValidate>
      <fieldset>
        <legend>What do you need?</legend>
        <div class="chips">
          {INTERESTS.map((i) => (
            <button
              type="button"
              key={i}
              aria-pressed={picked.includes(i)}
              class={picked.includes(i) ? 'chip on' : 'chip'}
              onClick={() => toggle(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        Your name
        <input value={f.name} onInput={set('name')} autocomplete="name" required />
      </label>
      <label>
        Phone or email
        <input value={f.contact} onInput={set('contact')} autocomplete="email" required />
      </label>
      <label>
        Tell us about your site
        <textarea rows="4" value={f.message} onInput={set('message')} placeholder="Type of building, rough size, timeline…" required />
      </label>

      {err && <p class="err" role="alert">{err}</p>}
      <button class="btn btn-primary" type="submit">Send request</button>

      <style>{`
        .cf { background: #fff; color: var(--ink); border-radius: var(--radius); padding: 1.8rem; display: grid; gap: 1.1rem; }
        .cf fieldset { border: 0; padding: 0; margin: 0; }
        .cf legend { font-weight: 700; color: var(--navy); margin-bottom: 0.6rem; padding: 0; }
        .cf .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .cf .chip { font: inherit; font-size: 0.82rem; font-weight: 600; cursor: pointer; padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); }
        .cf .chip.on { background: var(--yellow); border-color: var(--yellow); color: var(--navy); }
        .cf label { display: grid; gap: 0.35rem; font-weight: 600; font-size: 0.9rem; color: var(--navy); }
        .cf input, .cf textarea { font: inherit; font-weight: 400; padding: 0.75rem 0.9rem; border-radius: 12px; border: 1px solid var(--line); color: var(--ink); }
        .cf input:focus, .cf textarea:focus, .cf .chip:focus-visible { outline: 3px solid var(--orange); outline-offset: 1px; }
        .cf .err { color: #b3261e; margin: 0; font-size: 0.9rem; font-weight: 600; }
        .cf .btn { justify-self: start; }
      `}</style>
    </form>
  );
}
