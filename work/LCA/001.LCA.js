import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = sd.make1d(100);
let l = sd.make1d(100);
let fa = sd.make2d(100, 10);
let dep = sd.make1d(100);
let cnt = 0;
let tr = sd.Tree(svg).x(100).y(50).layerHeight(60).width(600);

let edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [8, 11],
    [8, 12],
    [9, 13],
    [10, 14],
    [11, 15],
    [12, 16]
];
tr.root(1);
for (let i = 0; i < edges.length; i++)
    link(edges[i][0], edges[i][1]);

main();

function makeArrow(name, flg) {
    let ar = sd.Line(svg).source(0, 0).target(30 * flg, 0);
    ar.markerEnd("arrow").strokeWidth(1.5);
    ar.flg = flg;
    let txt = sd.Text(svg, name).fontSize(20);
    ar.children.push(txt, function(parent, child) {
        child.cy(parent.cy());
        if (flg === 1) child.mx(parent.x() - 3);
        else child.x(parent.mx() + 3);
    });
    return ar;
}

function moveArrow(ar, at) {
    at = tr.element(at);
    if (ar.flg === 1) ar.mx(at.x()).cy(at.cy());
    else ar.x(at.mx()).cy(at.cy());
}

async function main() {
    dfs(1, 0, 1);
    await LCA(14, 15);
    await LCA(4, 16);
    await LCA(2, 15);
}

async function LCA(x, y) {
    await sd.pause();
    let ox = x, oy = y;
    tr.startAnimate();
    tr.element(x).strokeWidth(3).stroke(C.red).endAnimate();
    tr.element(y).strokeWidth(3).stroke(C.red).endAnimate();
    tr.endAnimate();
    let px = makeArrow("x", 1); moveArrow(px, x);
    let py = makeArrow("y", -1); moveArrow(py, y);
    px.opacity(0).startAnimate().opacity(1).endAnimate();
    py.opacity(0).startAnimate().opacity(1).endAnimate();
    while (x !== y) {
        if (dep[x] > dep[y]) {
            let tmp = px; px = py; py = tmp;
            tmp = x; x = y; y = tmp;
        }
        await sd.pause();
        let ty = fa[y][0];
        let lnk = sd.CurveLink(svg);
        let bending;
        if (tr.element(y).cx() == tr.element(ty).cx()) {
            bending = (tr.element(x).cx() < tr.element(y).cx()) ? 0.5 : -0.5;
        } else bending = (tr.element(y).cx() < tr.element(ty).cx()) ? -0.5 : 0.5;
        lnk.from(tr.element(y)).to(tr.element(ty)).bending(bending);
        lnk.strokeDashOffset(lnk.totalLength());
        lnk.strokeDashArray(lnk.totalLength());
        lnk.startAnimate().strokeDashOffset(0).endAnimate().arrow();
        y = fa[y][0];
        await sd.pause();
        py.startAnimate(); moveArrow(py, y); py.endAnimate();
        lnk.strokeDashOffset(2*lnk.totalLength());
        lnk.startAnimate().strokeDashOffset(lnk.totalLength()).endAnimate();
        lnk.markerEnd(null).remove();
    }
    await sd.pause();
    tr.startAnimate().color(x, C.orange).endAnimate();
    await sd.pause();
    tr.startAnimate();
    tr.element(ox).strokeWidth(1).stroke(C.black).endAnimate();
    tr.element(oy).strokeWidth(1).stroke(C.black).endAnimate();
    tr.color(x, C.white);
    tr.endAnimate();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
}

function dfs(u, f, d) {
    fa[u][0] = f; dep[u] = d;
    for (let i = 1; i <= 5; i++)
        fa[u][i] = fa[fa[u][i-1]][i-1];
    for (let i = h[u], v; i; i = l[i].nxt) {
        v = l[i].to;
        if (v !== f) {
            dfs(v, u, d+1);
        }
    }
}

function link(x, y) {
    tr.link(x, y);
    l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
    l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
}