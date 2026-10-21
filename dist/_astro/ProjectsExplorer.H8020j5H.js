import{d as t}from"./hooks.module.JhoGcvsy.js";import{u as e}from"./jsxRuntime.module.Dqw-6DmR.js";import"./preact.module.BTqC4RwC.js";function c({projects:l}){const a=["All",...new Set(l.map(r=>r.type))],[o,i]=t("All"),n=l.filter(r=>o==="All"||r.type===o);return e("div",{class:"prj",children:[e("div",{class:"tabs",role:"tablist","aria-label":"Project type",children:a.map(r=>e("button",{role:"tab","aria-selected":o===r,class:o===r?"tab on":"tab",onClick:()=>i(r),children:r},r))}),e("ul",{class:"list",children:n.map(r=>e("li",{class:"row",children:[e("div",{children:[e("strong",{children:r.name}),e("span",{class:"where",children:r.place})]}),e("span",{class:"scope",children:r.scope})]},r.name))}),e("style",{children:`
        .prj .tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem; }
        .prj .tab { font: inherit; font-weight: 600; font-size: 0.85rem; cursor: pointer; padding: 0.45rem 1rem; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); }
        .prj .tab.on { background: var(--yellow); border-color: var(--yellow); color: var(--navy); }
        .prj .tab:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; }
        .prj .list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff; }
        .prj .row { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.3rem; border-top: 1px solid var(--line); }
        .prj .row:first-child { border-top: 0; }
        .prj .where { display: block; font-size: 0.82rem; color: var(--muted); }
        .prj .scope { font-weight: 600; font-size: 0.9rem; color: var(--navy); background: #fff8d6; padding: 0.25rem 0.8rem; border-radius: 999px; align-self: center; }
      `})]})}export{c as default};
