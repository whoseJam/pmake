import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = sd.make1d(100);
let l = sd.make1d(100);
let fa = sd.make2d(100, 10);
let dep = sd.make1d(100);
let cnt = 0;
let tr = sd.Tree(svg).x(100).y(50).layerHeight(60).width(600);

tr.root(1);
link(1, 2);
link(1, 3);
link(1, 4);
link(2, 5);
link(3, 6);
link(3, 7);
link(4, 8);
link(5, 9);
link(5, 10);
link(6, 11);
link(7, 12);
link(8, 13);
link(8, 14);
link(10, 15);
link(11, 16);
link(16, 17);
link(16, 18);

main();

async function main() {
    dfs(1, 0, 1);
    await LCA(5, 18);
    await LCA(16, 10);
    while (true) {
        let x = sd.rand(1, 18);
        let y = sd.rand(1, 18);
        await LCA(x, y);
    }
}

async function LCA(x, y) {
    await sd.pause();
    tr.startAnimate().color(x, C.RED).color(y, C.RED).endAnimate();
    if (dep[x] < dep[y]) { let tmp = x; x = y; y = tmp; }
    await sd.pause();
    tr.startAnimate().color(x, C.ORANGE).endAnimate();
    for (let i = 5; i >= 0; i--) {
        if (dep[fa[x][i]] >= dep[y]) {
            await sd.pause();
            tr.startAnimate();
            tr.color(x, C.DEFAULT);
            tr.color(x = fa[x][i], C.ORANGE);
            tr.endAnimate();
        }
    }
    if (x === y) {
        await sd.pause();
        tr.startAnimate();
        tr.color(x, C.GREEN);
        tr.endAnimate();
        await sd.pause();
        tr.startAnimate();
        tr.color(x, C.DEFAULT);
        tr.endAnimate();
        return x;
    }
    await sd.pause();
    tr.startAnimate();
    tr.color(x, C.ORANGE);
    tr.color(y, C.ORANGE);
    tr.endAnimate();
    for (let i = 5; i >= 0; i--) {
        if (fa[x][i] !== fa[y][i]) {
            await sd.pause();
            tr.startAnimate();
            tr.color(x, C.DEFAULT).color(x = fa[x][i], C.ORANGE);
            tr.color(y, C.DEFAULT).color(y = fa[y][i], C.ORANGE);
            tr.endAnimate();
        }
    }
    await sd.pause();
    tr.startAnimate();
    tr.color(fa[x][0], C.GREEN);
    tr.endAnimate();
    await sd.pause();
    tr.startAnimate();
    tr.color(x, C.DEFAULT);
    tr.color(y, C.DEFAULT);
    tr.color(fa[x][0], C.DEFAULT);
    tr.endAnimate();
    return fa[x][0];
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