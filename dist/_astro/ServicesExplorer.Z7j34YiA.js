import{T as v,d as n}from"./hooks.module.JhoGcvsy.js";import{u as r}from"./jsxRuntime.module.Dqw-6DmR.js";import"./preact.module.BTqC4RwC.js";function b({services:o}){const c=v(()=>["All",...new Set(o.map(e=>e.category))],[o]),[a,d]=n("All"),[l,p]=n(""),[m,s]=n(null),i=o.filter(e=>(a==="All"||e.category===a)&&(e.title+" "+e.text).toLowerCase().includes(l.trim().toLowerCase()));return r("div",{class:"svc",children:[r("div",{class:"controls",children:[r("div",{class:"tabs",role:"tablist","aria-label":"Solution categories",children:c.map(e=>r("button",{role:"tab","aria-selected":a===e,class:a===e?"tab on":"tab",onClick:()=>{d(e),s(null)},children:e},e))}),r("label",{class:"search",children:[r("span",{class:"sr-only",children:"Search solutions"}),r("input",{type:"search",placeholder:"Search solutions…",value:l,onInput:e=>p(e.currentTarget.value)})]})]}),r("p",{class:"count","aria-live":"polite",children:["Showing ",i.length," of ",o.length," solutions"]}),r("div",{class:"cards",children:[i.map(e=>{const t=m===e.id;return r("article",{class:t?"item open":"item",children:[r("button",{class:"item-btn","aria-expanded":t,onClick:()=>s(t?null:e.id),children:[r("span",{class:"ico","aria-hidden":"true",children:e.icon}),r("span",{class:"meta",children:[r("span",{class:"cat",children:e.category}),r("span",{class:"ttl",children:e.title})]}),r("span",{class:"chev","aria-hidden":"true",children:t?"−":"+"})]}),t&&r("div",{class:"body",children:[r("p",{children:e.text}),r("a",{href:"#contact",class:"ask",children:"Ask about this →"})]})]},e.id)}),i.length===0&&r("p",{class:"empty",children:"No solutions match your search."})]}),r("style",{children:`
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
      `})]})}export{b as default};
