let v = (n, t = 21) => (e = t) => {
  let s = "", i = e;
  for (; i--; )
    s += n[Math.random() * n.length | 0];
  return s;
};
const B = v("1234567890abcdef", 4), T = B();
let k = 0;
const E = () => `${T}-${k++}`;
class C {
  constructor(t) {
    this.projectRoot = t, this.nodeParts = {}, this.nodeMetas = {};
  }
  trimProjectRootId(t) {
    return t.replace(this.projectRoot, "");
  }
  getModuleUid(t) {
    return t in this.nodeMetas || (this.nodeMetas[t] = {
      uid: E(),
      meta: { id: this.trimProjectRootId(t), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
    }), this.nodeMetas[t].uid;
  }
  getBundleModuleUid(t, e) {
    return e in this.nodeMetas || (this.nodeMetas[e] = {
      uid: E(),
      meta: { id: this.trimProjectRootId(e), moduleParts: {}, imported: /* @__PURE__ */ new Set(), importedBy: /* @__PURE__ */ new Set() }
    }), t in this.nodeMetas[e].meta.moduleParts || (this.nodeMetas[e].meta.moduleParts[t] = E()), this.nodeMetas[e].meta.moduleParts[t];
  }
  setNodePart(t, e, s) {
    const i = this.getBundleModuleUid(t, e);
    if (i in this.nodeParts)
      throw new Error(
        `Override module: bundle id ${t}, module id ${e}, value ${JSON.stringify(
          s
        )}, existing value: ${JSON.stringify(this.nodeParts[i])}`
      );
    return this.nodeParts[i] = { ...s, mainUid: this.getModuleUid(e) }, i;
  }
  setNodeMeta(t, e) {
    this.getModuleUid(t), this.nodeMetas[t].meta.isEntry = e.isEntry, this.nodeMetas[t].meta.isExternal = e.isExternal;
  }
  hasNodePart(t, e) {
    return !(!(e in this.nodeMetas) || !(t in this.nodeMetas[e].meta.moduleParts) || !(this.nodeMetas[e].meta.moduleParts[t] in this.nodeParts));
  }
  getNodeParts() {
    return this.nodeParts;
  }
  getNodeMetas() {
    const t = {};
    for (const { uid: e, meta: s } of Object.values(this.nodeMetas))
      t[e] = {
        ...s,
        imported: [...s.imported].map((i) => {
          const [r, o] = i.split(","), a = { uid: r };
          return o === "true" && (a.dynamic = !0), a;
        }),
        importedBy: [...s.importedBy].map((i) => {
          const [r, o] = i.split(","), a = { uid: r };
          return o === "true" && (a.dynamic = !0), a;
        })
      };
    return t;
  }
  addImportedByLink(t, e) {
    const s = this.getModuleUid(e);
    this.getModuleUid(t), this.nodeMetas[t].meta.importedBy.add(s);
  }
  addImportedLink(t, e, s = !1) {
    const i = this.getModuleUid(e);
    this.getModuleUid(t), this.nodeMetas[t].meta.imported.add(String([i, s]));
  }
}
const w = (n) => "children" in n, U = (n, t, e, s) => {
  if (e.length === 0)
    throw new Error(`Error adding node to path ${n}`);
  const [i, ...r] = e;
  if (r.length === 0) {
    t.children.push({ ...s, name: i });
    return;
  } else {
    let o = t.children.find((a) => a.name === i && w(a));
    o || (o = { name: i, children: [] }, t.children.push(o)), U(n, o, r, s);
    return;
  }
}, z = (n) => {
  if (n.children.length === 1) {
    const t = n.children[0], e = `${n.name}/${t.name}`;
    return w(t) ? (n.name = e, n.children = t.children, z(n)) : {
      name: e,
      uid: t.uid
    };
  } else
    return n.children = n.children.map((t) => w(t) ? z(t) : t), n;
}, R = (n, t, e) => {
  const s = {
    name: n,
    children: []
  };
  for (const { id: i, renderedLength: r, gzipLength: o, brotliLength: a } of t) {
    const f = e.setNodePart(n, i, { renderedLength: r, gzipLength: o, brotliLength: a }), y = e.trimProjectRootId(i), P = y.split(/\\|\//).filter((M) => M !== "");
    U(y, s, P, { uid: f });
  }
  return s.children = s.children.map((i) => w(i) ? z(i) : i), s;
}, x = (n) => ({
  name: "root",
  children: n,
  isRoot: !0
}), I = (n, t, e) => {
  const s = {}, i = [n];
  for (; i.length > 0; ) {
    const r = i.shift();
    if (s[r])
      continue;
    s[r] = !0;
    const o = t(r);
    if (!o)
      return;
    o.isEntry && e.setNodeMeta(r, { isEntry: !0 }), o.isExternal && e.setNodeMeta(r, { isExternal: !0 });
    for (const a of o.importedIds)
      e.addImportedByLink(a, r), e.addImportedLink(r, a), i.push(a);
    for (const a of o.dynamicallyImportedIds)
      e.addImportedByLink(a, r), e.addImportedLink(r, a, !0), i.push(a);
  }
}, A = (n) => n.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
async function q({ title: n, data: t, template: e }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${A(n)}</title>
        <link rel='stylesheet' href='/js/${e}.min.css' />
      </head>
      <body>
        <main></main>
        <script type="module" defer>
          import * as drawChart from "/js/${e}.min.js";
          const data = ${JSON.stringify(t)};
          
          const run = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const chartNode = document.querySelector("main");
            drawChart.default(chartNode, data, width, height);
          };
      
          window.addEventListener('resize', run);
      
          document.addEventListener('DOMContentLoaded', run);
        <\/script>
      </body>
    </html>
  `;
}
const S = () => Promise.resolve(0), D = async (n) => {
  const { gzip: t, getWASM: e } = await import("./mod-88b45d97.mjs");
  return await e(), (await t(n, 9)).length;
}, F = async (n) => {
  const { compress: t } = await import("./mod-27a4a102.mjs");
  return (await t(n, n.length, 11)).length;
}, G = async (n, t, e = {}) => {
  const s = e.title ?? "Esbuild Visualizer", i = (e.template == !0 ? "treemap" : e.template) ?? "treemap", r = "";
  let o = /* @__PURE__ */ new Map();
  t.forEach(({ path: d, contents: c }) => {
    o.set(d, c);
  });
  const a = !!e.gzipSize, f = !!e.brotliSize, y = a ? D : S, P = f ? F : S, M = async ({
    id: d,
    mod: c
  }) => {
    const l = o.get(d);
    let m = l == null || l == null || l?.length == 0, [g, u, p] = await Promise.all(m ? [0, 0, c.bytesInOutput] : [y(l), P(l), l?.length]);
    return {
      id: d,
      gzipLength: g,
      brotliLength: u,
      renderedLength: p
    };
  }, b = [], h = new C(r);
  for (const [d, c] of Object.entries(n.outputs)) {
    const l = await Promise.all(
      Object.entries(c.inputs).map(([u, p]) => M({ id: u, mod: p }))
    ), m = R(d, l, h), g = o.get(d);
    if (m.children.length === 0 && g) {
      const u = await M({
        id: d,
        mod: { bytesInOutput: g?.length }
      }), p = `${d}-unknown`, N = h.setNodePart(d, p, u);
      h.setNodeMeta(p, { isEntry: !0 });
      const O = { name: d, uid: N };
      b.push(O);
    } else
      b.push(m);
  }
  const L = (d) => (c) => {
    const m = n.inputs?.[c]?.imports.map((u) => u.path);
    return {
      renderedLength: o.get(c)?.length ?? d.inputs?.[c]?.bytesInOutput ?? 0,
      importedIds: m ?? [],
      dynamicallyImportedIds: [],
      isEntry: d.entryPoint === c,
      isExternal: !1
    };
  };
  for (const [d, c] of Object.entries(n.outputs))
    c.entryPoint != null && I(d, L(c), h);
  const $ = x(b), j = {
    version: 3,
    tree: $,
    nodeParts: h.getNodeParts(),
    nodeMetas: h.getNodeMetas(),
    env: {},
    options: {
      gzip: a,
      brotli: f
    }
  };
  return await q({
    title: s,
    data: j,
    template: i
  });
}, H = async (n, t, e = {}, s = console.log) => {
  try {
    return await G(n, t, {
      title: "Bundle Analysis",
      ...e
    });
  } catch (i) {
    let { stack: r } = i;
    s([`[Analyzer] ${i}`, r], "warning"), console.warn(i, r);
  }
};
export {
  H as analyze
};
//# sourceMappingURL=index.mjs.map
