import { useState } from 'react/hooks';

// Filterable project list drawn from the "Clients" page of the company profile.
export default function ProjectsExplorer({ projects }) {
  const types = ['All', ...new Set(projects.map((p) => p.type))];
  const [type, setType] = useState('All');
  const list = projects.filter((p) => type === 'All' || p.type === type);

  return (
    <div class="prj">
      <div class="tabs" role="tablist" aria-label="Project type">
        {types.map((t) => (
          <button key={t} role="tab" aria-selected={type === t} class={type === t ? 'tab on' : 'tab'} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <ul class="list">
        {list.map((p) => (
          <li key={p.name} class="row">
            <div>
              <strong>{p.name}</strong>
              <span class="where">{p.place}</span>
            </div>
            <span class="scope">{p.scope}</span>
          </li>
        ))}
      </ul>
      <style>{`
        .prj .tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem; }
        .prj .tab { font: inherit; font-weight: 600; font-size: 0.85rem; cursor: pointer; padding: 0.45rem 1rem; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); }
        .prj .tab.on { background: var(--yellow); border-color: var(--yellow); color: var(--navy); }
        .prj .tab:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; }
        .prj .list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff; }
        .prj .row { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.3rem; border-top: 1px solid var(--line); }
        .prj .row:first-child { border-top: 0; }
        .prj .where { display: block; font-size: 0.82rem; color: var(--muted); }
        .prj .scope { font-weight: 600; font-size: 0.9rem; color: var(--navy); background: #fff8d6; padding: 0.25rem 0.8rem; border-radius: 999px; align-self: center; }
      `}</style>
    </div>
  );
}
