import * as sd from "@/sd";
import { linkTo } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";
import { TreeGraph } from "../_/TreeGraph";

const svg = sd.svg();
const C = sd.color();
const n = 9;
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
const tree = new TreeGraph(svg, n, links, externLinks);
const seq = new sd.Array(svg).start(1);
const low = sd.make1d(n + 5);
const dfn = sd.make1d(n + 5);
sd.Index(seq);
const table = new sd.Grid(svg)
    .n(n + 1)
    .m(3)
    .elementHeight(25)
    .elementWidth(70);

sd.init(() => {
    seq.y(tree.my() + 50).x((tree.width() - n * 40) / 2);
    table.x(tree.mx()).cy(tree.cy());
    table.value(0, 1, "dfn");
    table.value(0, 2, "low");
    for (let i = 1; i <= n; i++) table.value(i, 0, `节点${i}`);
});

sd.main(async () => {
    await tarjan(tree, {
        async onAddLowAndDfn(u, low_, dfn_) {
            await sd.pause();
            dfn[u] = dfn_;
            low[u] = low_;
            seq.startAnimate().push(u).endAnimate();
            table.startAnimate().value(+u, 1, dfn_).endAnimate();
        },
        onUpdateLow(u, low_) {
            low[u] = low_;
        },
        async onTreeLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.textBlue);
        },
        async onAncestorLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.red);
        },
        async onForwardLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.orange);
        },
        async onCrossLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.purple);
        },
    });
    low[8] = 1; // ???
    const focus = sd.Focus(table);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        focus.startAnimate().focus(i, 0, i, 2).endAnimate();
        table.startAnimate().value(i, 2, low[i]).endAnimate();
        if (low[i] !== dfn[i]) {
            const zzline = sd.Link(seq.element(dfn[i]), seq.element(low[i]), sd.ZZLine, "cx", "my", "cx", "my").bending(30).location("b").startAnimate().pointStoT().endAnimate().arrow();
            await sd.pause();
            zzline.startAnimate().opacity(0).endAnimate().remove();
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
