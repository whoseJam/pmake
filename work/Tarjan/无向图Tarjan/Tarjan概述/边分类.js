import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(500);
const n = 9;
const low = sd.make1d(n + 5);
const dfn = sd.make1d(n + 5);
const ins = sd.make1d(n + 5);
const stk = sd.make1d(n + 5);
const prt = sd.make1d(n + 5);
let tot = 0;
let top = 0;
const postProc = {
    orange: [],
    purple: [],
    red: [],
};
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [5, 6],
    [2, 7],
    [1, 8],
    [8, 9],
];
const externLinks = [
    [3, 6, sd.Curve, {}],
    [7, 1, sd.Line, {}],
    [9, 7, sd.Line, {}],
];

sd.init(() => {
    tree.root(1);
    for (let i = 2; i <= n; i++) tree.newNode(i);
    links.forEach(link => {
        tree.newLink(link[0], link[1]);
        tree.element(link[0], link[1]).arrow();
    });
    externLinks.forEach(link => {
        const [x, y, clazz] = [link[0], link[1], link[2]];
        link[3].link = sd.Link(tree.element(x), tree.element(y), clazz).arrow();
        link[3].link.clazz = clazz;
    });
});

sd.main(async () => {
    await sd.pause();
    await Dfs(1);
    await sd.pause();
    postProc["orange"].forEach(proc => proc());
    await sd.pause();
    console.log("red start");
    postProc["red"].forEach(proc => proc());
    await sd.pause();
    console.log("purple start");
    postProc["purple"].forEach(proc => proc());
});

function IsAncesstor(a, u) {
    while (prt[u] && u != a) u = prt[u];
    return u == a;
}

async function Dfs(u) {
    low[u] = dfn[u] = ++tot;
    ins[(stk[++top] = u)] = true;

    const toNodes = ToNodes(u);
    for (let to of toNodes) {
        const v = to.id;
        if (!dfn[v]) {
            LinkTo(to.link, C.textBlue);
            prt[v] = u;
            await Dfs(to.id);
            low[u] = Math.min(low[u], low[v]);
        } else {
            const color = IsAncesstor(v, u) ? "red" : IsAncesstor(u, v) ? "orange" : "purple";
            postProc[color].push(() => {
                LinkTo(to.link, C[color]);
            });
            if (ins[v]) low[u] = Math.min(low[u], dfn[v]);
        }
    }

    if (low[u] === dfn[u]) {
        while (top) {
            const cur = stk[top--];
            ins[cur] = false;
            if (cur === u) break;
        }
    }
}

function LinkTo(link, color) {
    const clazz = link.clazz ? link.clazz : sd.Line;
    const l = new clazz(svg);
    l.source(link.source());
    console.log("start set target=", link.target());
    l.target(link.target());
    console.log("link=", link, link.source(), link.target());
    console.log("color=", color, "l.source=", l.source(), "l.target=", l.target());
    l.stroke(color).strokeWidth(2.5);
    l.startAnimate().pointStoT().endAnimate().arrow();
}

function ToNodes(u) {
    const children = tree.children(u).map(node => {
        return {
            id: tree.nodeId(node),
            link: tree.element(u, tree.nodeId(node)),
            node: node,
        };
    });
    const extern = externLinks
        .filter(link => String(link[0]) === u)
        .map(link => {
            return {
                id: String(link[1]),
                link: link[3].link,
                node: tree.element(link[1]),
            };
        });
    return [...children, ...extern];
}
