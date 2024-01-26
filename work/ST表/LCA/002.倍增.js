import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = sd.make1d(100);
let l = sd.make1d(100);
let fa = sd.make2d(100, 10);
let dep = sd.make1d(100);
let cnt = 0, n = 16, m = 4;
let tr = sd.Tree(svg).x(10).y(50).layerHeight(50).width(600);
let st = sd.Grid(svg).n(m).m(n).startM(1).x(100).y(300);
for (let i = 1; i <= n; i++) {
    st.children.push(sd.Text(st, i).fontSize(20), function(parent, child) {
        let elem = st.element(m - 1, i);
        child.cx(elem.cx());
        child.y(elem.my() + 3);
    })
}
for (let i = 0; i < m; i++) {
    st.children.push(sd.Mathjax(st).math(`2^${i}`).height(20), function(parent, child) {
        let elem = st.element(m - 1 - i, 1);
        child.mx(elem.x() - 5);
        child.cy(elem.cy());
    })
}
st.x(500).cy(300);

let edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [5, 7],
    [7, 8],
    [7, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16]
];
tr.root(1);
for (let i = 0; i < edges.length; i++)
    link(edges[i][0], edges[i][1]);

main();

async function main() {
    dfs(1, 0, 1);
    for (let i = 2; i <= 16; i++) {
        await sd.pause();
        tr.startAnimate().color(i, C.blue).endAnimate();
        await sd.pause();
        let lnks = makeLinks(i);
        await sd.pause();
        tr.startAnimate().color(i, C.white).endAnimate();
        removeLinks(lnks);
    }
    await LCA(2, 16);
    await LCA(6, 16);
    while (true) {
        let u = sd.rand(1, n);
        let v = sd.rand(1, n);
        if (u === v) continue;
        await LCA(u, v);
    }
}

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

function makeLinks(y) {
    let lnks = [];
    for (let i = 0; i <= 5; i++) {
        let ty = fa[y][i];
        if (!ty) break;
        let lnk = sd.CurveLink(svg);
        let bending;
        if (tr.element(y).cx() == tr.element(ty).cx()) {
            bending = (tr.cx() < tr.element(y).cx()) ? 0.5 : -0.5;
        } else bending = (tr.element(y).cx() < tr.element(ty).cx()) ? -0.5 : 0.5;
        lnk.from(tr.element(y)).to(tr.element(ty)).bending(bending);
        lnk.strokeDashOffset(lnk.totalLength());
        lnk.strokeDashArray(lnk.totalLength());
        lnk.startAnimate().strokeDashOffset(0).endAnimate().arrow();
        lnks.push(lnk);
        st.startAnimate().value(m - i - 1, y, ty).endAnimate();
    }
    return lnks;
}

function removeLinks(lnks) {
    for (let i = 0; i < lnks.length; i++) {
        lnks[i].strokeDashOffset(2*lnks[i].totalLength());
        lnks[i].startAnimate().strokeDashOffset(lnks[i].totalLength()).endAnimate();
        lnks[i].markerEnd(null).remove();
    }
}

function highlightST(row, col) {
    st.startAnimate();
    for (let u = 1; u <= n; u++)
        st.color(m - row - 1, u, col);
    st.endAnimate();
}

async function LCA(x, y) {
    if (dep[x] > dep[y]) { let tmp = x; x = y; y = tmp; }
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

    for (let i = m-1; i >= 0; i--) {
        if (i==m-1) await sd.pause();
        highlightST(i, C.blue);
        if (dep[fa[y][i]] >= dep[x]) {
            await sd.pause();
            let lnks = makeLinks(y);
            await sd.pause();
            lnks[i].startAnimate().strokeWidth(2).stroke(C.green).endAnimate();
            await sd.pause();
            y = fa[y][i];
            py.startAnimate(); moveArrow(py, y); py.endAnimate();
            await sd.pause();
            removeLinks(lnks);
        }
        await sd.pause();
        highlightST(i, C.white);
    }
    if (x === y) {
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
        return;
    }
    for (let i = m-1; i >= 0; i--) {
        if (i==m-1) await sd.pause();
        highlightST(i, C.blue);
        if (fa[x][i] != fa[y][i]) {
            await sd.pause();
            let xlnks = makeLinks(x);
            let ylnks = makeLinks(y);
            await sd.pause();
            xlnks[i].startAnimate().strokeWidth(2).stroke(C.green).endAnimate();
            ylnks[i].startAnimate().strokeWidth(2).stroke(C.green).endAnimate();
            await sd.pause();
            x = fa[x][i];
            y = fa[y][i];
            px.startAnimate(); moveArrow(px, x); px.endAnimate();
            py.startAnimate(); moveArrow(py, y); py.endAnimate();
            await sd.pause();
            removeLinks(xlnks);
            removeLinks(ylnks);
        }
        await sd.pause();
        highlightST(i, C.white);
    }
    await sd.pause();
    tr.startAnimate().color(fa[x][0], C.orange).endAnimate();
    await sd.pause();
    tr.startAnimate();
    tr.element(ox).strokeWidth(1).stroke(C.black).endAnimate();
    tr.element(oy).strokeWidth(1).stroke(C.black).endAnimate();
    tr.color(fa[x][0], C.white);
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