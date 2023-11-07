import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let g = sd.UnionGraph(svg).drag(true).resizeable(true);
let fa = sd.make1d(100, 0);
let n = 6;
let board = sd.Text(svg);
g.x(200);
g.y(100);
board.x(600);
board.y(300);
board.fontSize(50);
let merges = [
    [1, 2],
    [3, 4],
    [1, 3],
    [4, 5],
    [5, 6]
];

main();

async function main() {
    for (let i = 1; i <= n; i++) {
        fa[i] = i;
        g.newNode(i, sd.Text(g, i));
    }
    for (let i = 0; i < merges.length; i++) {
        let x = merges[i][0];
        let y = merges[i][1];
        await merge(x, y);
    }
}

function getFa(x) {
    if (fa[x] === x) return x;
    let ans = getFa(fa[x]);
    return ans;
}

async function merge(x, y) {
    await sd.pause();
    board.text("Merge x=" + String(x) + " y=" + String(y));
    await sd.pause();
    g.startAnimate();
    g.element(x).color(C.GREEN);
    if (x !== y) g.element(y).color(C.GREEN);
    g.endAnimate();

    let fx = getFa(x);
    let fy = getFa(y);
    if (fx !== fy) {
        fa[fx] = fy;
        await sd.pause();
        g.startAnimate();
        g.element(fx).color(C.RED);
        g.element(fy).color(C.RED);
        g.endAnimate();
        await sd.pause();
        g.startAnimate();
        g.newLink(fx, fy);
        g.element(fx, fy).strokeWidth(1);
        g.element(fx, fy).arrow();
        await sd.pause();
        g.startAnimate();
        g.element(x).color(C.DEFAULT);
        g.element(y).color(C.DEFAULT);
        g.element(fx).color(C.DEFAULT);
        g.element(fy).color(C.DEFAULT);
        g.endAnimate();
    } else {
        await sd.pause();
        g.startAnimate();
        g.element(fx).color(C.RED);
        g.endAnimate();
        await sd.pause();
        g.startAnimate();
        g.element(x).color(C.DEFAULT);
        g.element(y).color(C.DEFAULT);
        g.element(fx).color(C.DEFAULT);
        g.endAnimate();
    }
    await sd.pause();
    board.text("Merge Finished");
}