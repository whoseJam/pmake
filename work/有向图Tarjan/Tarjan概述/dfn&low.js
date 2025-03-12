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
const seq = new sd.Array(svg).start(1);
sd.Index(seq);
const table = new sd.Grid(svg)
    .n(n + 1)
    .m(3)
    .elementHeight(25)
    .elementWidth(70);
let tot = 0;
let top = 0;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [5, 8],
    [5, 9],
];
const externLinks = [
    [8, 2, sd.Line, {}],
    [5, 1, sd.Line, {}],
    [7, 6, sd.Line, {}],
    [6, 3, sd.Curve, {}],
];

sd.init(() => {
    tree.root(1);
    for (let i = 2; i <= n; i++) tree.newNode(i);
    links.forEach(link => {
        tree.newLink(link[0], link[1]);
        tree.element(link[0], link[1]).arrow();
    });
    externLinks.forEach(link => {
        link[3].link = sd.Link(tree.element(link[0]), tree.element(link[1]), link[2]).arrow();
        link[3].link.clazz = link[2];
    });
    seq.y(tree.my() + 50).x((tree.width() - n * 40) / 2);
    table.x(tree.mx()).cy(tree.cy());
    table.value(0, 1, "dfn");
    table.value(0, 2, "low");
    for (let i = 1; i <= n; i++) {
        table.value(i, 0, `节点${i}`);
    }
});

sd.main(async () => {
    await sd.pause();
    await Dfs(1);
    const focus = sd.Focus(table);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        focus.startAnimate().focus(i, 0, i, 2).endAnimate();
        table.startAnimate().value(i, 2, low[i]).endAnimate();
        if (low[i] !== dfn[i]) {
            const zzline = sd.Link(seq.element(dfn[i]), seq.element(low[i]), sd.ZZLine, "cx", "my", "cx", "my").bending(30).location("b").startAnimate().pointStoT().endAnimate().arrow();
            await sd.pause();
            zzline.startAnimate().opacity(0).endAnimate().remove();
        } else {
        }
    }
});

function IsAncesstor(a, u) {
    while (prt[u] && u != a) u = prt[u];
    return u == a;
}

async function Dfs(u) {
    low[u] = dfn[u] = ++tot;
    ins[(stk[++top] = u)] = true;
    seq.startAnimate().push(u).endAnimate();
    table.startAnimate().value(+u, 1, dfn[u]).endAnimate();

    const toNodes = ToNodes(u);
    if (u == 8) low[u] = 1;
    for (let to of toNodes) {
        await sd.pause();
        const v = to.id;
        if (!dfn[v]) {
            LinkTo(to.link, C.textBlue);
            prt[v] = u;
            await Dfs(to.id);
            low[u] = Math.min(low[u], low[v]);
        } else {
            LinkTo(to.link, IsAncesstor(v, u) ? C.red : IsAncesstor(u, v) ? C.orange : C.purple);
            if (ins[v]) low[u] = Math.min(low[u], low[v]);
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
    l.target(link.target());
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
