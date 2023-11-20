import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let g = sd.Grid(svg);
let x = sd.Array(svg).start(1);
let y = sd.Stack(svg).start(1);
let n, m;
let xdata = R.readIntArray("1 3 3 4 2 0 3 1 4 1", n = 10);
let ydata = R.readIntArray("4 2 5 3 6 5 3 2 3 2", m = 10);
let con = sd.Code(svg).code(`
如果能连通
Xmin<Y[i]应该恒成立
Ymax>X[i]应该恒成立`).x(700).y(100).fontSize(30);
g.x(100).y(100).n(n).m(m).startN(1).startM(1);
for (let i = 1; i <= n; i++)
    x.push(xdata[i]);
for (let i = 1; i <= m; i++)
    y.push(ydata[i]);
x.x(g.x()).my(g.y());
y.mx(g.x()).y(g.y());


main();

async function main() {
    await solve(1, 1, n, m, false);
}

async function solve(x, y, w, h, padding) {
    if (w <= 0 || h <= 0) return;
    console.log("x=", x, "y=", y, "w=", w, "h=", h);
    let ymax = -Infinity, xmin = Infinity;
    let ypos, xpos;
    for (let i = x; i < x + w; i++)
        if (xmin > xdata[i]) xmin = xdata[xpos = i];
    for (let i = y; i < y + h; i++)
        if (ymax < ydata[i]) ymax = ydata[ypos = i];
    
    await sd.pause();
    flink("x", xpos);
    flink("y", ypos);
    g.after(x).startAnimate();
    for (let i = x; i < x + w; i++)
        if (ydata[ypos] > xdata[i]) g.color(ypos, i, C.green);
    for (let i = y; i < y + h; i++)
        if (ydata[i] > xdata[xpos]) g.color(i, xpos, C.green);
    g.endAnimate();
    
    if((xpos === x || ypos === y) && padding) return;
    if((xpos === x && ypos === y+h-1)) return;
    if((ypos === y && xpos === x+w-1)) return;
    await solve(x, y, xpos-x, ypos-y, padding || true);
    await solve(xpos+1, ypos+1, x+w-xpos-1, y+h-ypos-1, padding);
}

function flink(arr, pos) {
    if (arr === "x") arr = x; else arr = y;
    console.log("pos=", pos);
    arr.startAnimate().color(pos, C.red).endAnimate();
    arr.startAnimate().color(pos, C.white).endAnimate();
    arr.startAnimate().color(pos, C.red).endAnimate();
    arr.startAnimate().color(pos, C.white).endAnimate();
}