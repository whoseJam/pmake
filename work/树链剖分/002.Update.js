import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = sd.make1d(100);
let l = sd.make1d(100);
let sz = sd.make1d(100);
let sn = sd.make1d(100);
let dep = sd.make1d(100);
let top = sd.make1d(100);
let fa = sd.make1d(100);
let cnt = 0, tot = 0;
let tr = sd.Tree(svg).x(100).y(50).layerHeight(60).width(600);
let arr = sd.Array(svg).x(600).y(200).drag(true).resizeable(true).start(1);
let Lx = sd.make1d(100);
let Rx = sd.make1d(100);

tr.root(1);
let edges = [
    [1, 2], [2, 3],
    [3, 4], [3, 5],
    [4, 6], [5, 7],
    [7, 8],
    [8, 9], [8, 10],
    [9, 11], [10, 12],
    [12, 13]
];
for (let i = 0; i < edges.length; i++)
    link(edges[i][0], edges[i][1]);

main();

async function main() {
    await dfs1(1, 0);
    await dfs2(1, 0, 1);
    await update(6, 11);
    await subtree(7);
}

async function dfs1(now, prt) {
    sz[now] = 1;
    fa[now] = prt;
    dep[now] = dep[prt] + 1;
    for (let i = h[now]; i; i = l[i].nxt) {
        let v = l[i].to;
        if (v !== prt) {
            await dfs1(v, now);
            if (sz[sn[now]] < sz[v])
                sn[now] = v;
            sz[now] += sz[v];
        }
    }
    if (sn[now]) {
        tr.element(now, sn[now]).strokeWidth(5);
        tr.element(now, sn[now]).stroke(C.red);
    }
}

async function dfs2(now, prt, Top) {
    top[now] = Top;
    arr.push("");
    let e = arr.element(Lx[now] = ++tot);
    e.children.push("txt", sd.Text(svg, now).fontSize(20), function(parent, child) {
        child.cx(parent.cx()).cy(parent.cy());
    })

    if (sn[now])
        await dfs2(sn[now], now, Top);

    for (let i = h[now]; i; i = l[i].nxt) {
        let v = l[i].to;
        if (v !== prt && v !== sn[now]) {
            await dfs2(v, now, v);
        }
    }
    Rx[now] = tot;
}

function link(x, y) {
    tr.link(x, y);
    l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
    l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
}

async function colorArr(l, r, c) {
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++)
        arr.color(i, c);
    arr.endAnimate();
}

async function colorTree(son, anc, c) {
    tr.startAnimate();
    while (son != anc) {
        tr.color(son, c);
        son = fa[son];
    }
    tr.color(son, c);
    tr.endAnimate();
}

async function update(x, y) {
    let fx = top[x], fy = top[y];
    let px = sd.Link(svg).source(0, 0).target(50, 0).markerEnd("arrow");
    px.children.push(sd.Text(svg, "x").fontSize(20), function(parent, child) {
        child.cy(parent.cy()).mx(parent.x());
    });
    let py = sd.Link(svg).source(0, 0).target(-50, 0).markerEnd("arrow");
    py.children.push(sd.Text(svg, "y").fontSize(20), function(parent, child) {
        child.cy(parent.cy()).x(parent.mx());
    })

    function movePointer(p, at) {
        let e = tr.element(at); p.cy(e.cy());
        if (p.target()[0] < p.source()[0]) p.x(e.mx() + 10);
        else p.mx(e.x() - 10);
    }

    movePointer(px, x);
    movePointer(py, y);

    while (fx != fy) {
        if (dep[fx] < dep[fy]) {
            let tmp = fx; fx = fy; fy = tmp;
            tmp = x; x = y; y = tmp;
            tmp = px; px = py; py = tmp;
        }
        await colorArr(Lx[fx], Lx[x], C.orange);
        await colorTree(x, fx, C.orange);
        await colorArr(Lx[fx], Lx[x], C.white);
        await colorTree(x, fx, C.white);
        x = fa[fx]; fx = top[x];

        await sd.pause();
        px.startAnimate();
        movePointer(px, x);
        px.endAnimate();
    }
    if (dep[x] < dep[y]) { let tmp = x; x = y; y = tmp; }
    await colorArr(Lx[y], Lx[x], C.orange);
    await colorTree(x, y, C.orange);
    await colorArr(Lx[y], Lx[x], C.white);
    await colorTree(x, y, C.white);
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
}

async function subtree(x) {
    async function subtreeColor(x, c) {
        await sd.pause();
        tr.startAnimate(); arr.startAnimate();
        for (let i = Lx[x]; i <= Rx[x]; i++) {
            let u = arr.element(i).children.child("txt").text();
            tr.color(u, c);
            arr.color(i, c);
        }
        tr.endAnimate(); arr.endAnimate();
    }
    await sd.pause();
    tr.startAnimate().color(x, C.blue).endAnimate();
    await subtreeColor(x, C.orange);
    await subtreeColor(x, C.white);
}