import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let h = sd.make1d(100);
let l = sd.make1d(100);
let sz = sd.make1d(100);
let sn = sd.make1d(100);
let cnt = 0;
let tr = sd.Tree(svg).x(100).y(50).layerHeight(60).width(600);
let arr = sd.Array(svg).x(100).y(400).drag(true).resizeable(true);

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
    await sd.pause();
    tr.startAnimate();
    await dfs1(1);
    tr.endAnimate();

    await dfs2(1);
}

async function dfs1(now, prt) {
    sz[now] = 1;
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

async function dfs2(now, prt) {
    await sd.pause();
    tr.startAnimate();
    if (prt) tr.color(prt, C.DEFAULT);
    tr.color(now, C.GREEN);
    tr.endAnimate();
    await sd.pause();
    arr.startAnimate().push(`v${now}`).endAnimate();

    if (sn[now])
        await dfs2(sn[now], now);

    for (let i = h[now]; i; i = l[i].nxt) {
        let v = l[i].to;
        if (v !== prt && v !== sn[now]) {
            await dfs2(v, now);
        }
    }

    await sd.pause();
    tr.startAnimate();
    if (prt) tr.color(prt, C.GREEN);
    tr.color(now, C.DEFAULT);
    tr.endAnimate();
}

function link(x, y) {
    tr.link(x, y);
    l[++cnt] = { nxt: h[x], to: y }; h[x] = cnt;
    l[++cnt] = { nxt: h[y], to: x }; h[y] = cnt;
}