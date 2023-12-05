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
let focus = sd.Rect(svg).stroke(C.red).strokeWidth(2).fillOpacity(0);
for (let i = 1; i <= n; i++)
    x.push(xdata[i]);
for (let i = 1; i <= m; i++)
    y.push(ydata[i]);
x.x(g.x()).my(g.y());
y.mx(g.x()).y(g.y());
fresh(1, 1, n, m);

main();

async function main() {
    await solve(1, 1, n, m, false, false, false, false);
}

async function solve(x, y, nx, ny, top, left, bottom, right) {
    let w = nx - x + 1, h = ny - y + 1; 
    if (w <= 0 || h <= 0) return;
    await sd.pause(); fresh(x, y, nx, ny);
    let ymax = -Infinity, ymin = Infinity;
    let xmax = -Infinity, xmin = Infinity;
    let ymaxPos, yminPos, xmaxPos, xminPos;
    for (let i = x; i < x + w; i++) {
        if (xmin > xdata[i]) xmin = xdata[xminPos = i];
        if (xmax < xdata[i]) xmax = xdata[xmaxPos = i];
    }
    for (let i = y; i < y + h; i++) {
        if (ymin > ydata[i]) ymin = ydata[yminPos = i];
        if (ymax < ydata[i]) ymax = ydata[ymaxPos = i];
    }
    await sd.pause();
    flink("x", xminPos);
    flink("y", ymaxPos);
    g.after(x).startAnimate();
    for (let i = x; i <= nx; i++)
        if (ydata[ymaxPos] > xdata[i]) g.color(ymaxPos, i, C.green);
    for (let i = y; i <= ny; i++) 
        if (ydata[i] > xdata[xminPos]) g.color(i, xminPos, C.green);
    for (let i = x; i <= nx; i++)
        if (ymin <= xmin) g.color(yminPos, i, C.grey);
    for (let i = y; i <= ny; i++)
        if (xmax >= ymax) g.color(i, xmaxPos, C.grey);
    g.endAnimate();

    if (!top && !left) {
        if (ymin <= xmin && ymax <= xmax) return;   // Good Game
        if (ymin > xmin && ymax > xmax) {
            await solve(x, y, xminPos-1, ymaxPos-1, top, left, true, true);
            await sd.pause(); fresh(x, y, nx, ny);
            if (!bottom && !right) {
                await solve(xminPos+1, ymaxPos+1, nx, ny, true, true, bottom, right);
                await sd.pause(); fresh(x, y, nx, ny);
            }
            return;
        }
        if (ymin <= xmin && ymax > xmax) {
            if (!right) return;
            await solve(x, y, nx, yminPos-1, top, left, false, right);
            await sd.pause(); fresh(x, y, nx, ny);
            return;
        }
        if (ymin > xmin && ymax <= xmax) {
            if (!bottom) return;
            await solve(x, y, xmaxPos-1, ny, top, left, bottom, right);
            await sd.pause(); fresh(x, y, nx, ny);
            return;
        }
    }
    if (!bottom && !right) {
        if (ymin <= xmin && ymax <= xmax) return; 
        if (ymin > xmin && ymax > xmax) {
            await solve(xminPos+1, ymaxPos+1, nx, ny, true, true, bottom, right);
            await sd.pause(); fresh(x, y, nx, ny);
            return;
        }
        if (ymin <= xmin && ymax > xmax) {
            if (!left) return;
            await solve(x, yminPos+1, nx, ny, false, left, bottom, right);
            await sd.pause(); fresh(x, y, nx, ny);
            return;
        }
        if (ymin > xmin && ymax <= xmax) {
            if (!top) return;
            await solve(xmaxPos+1, y, nx, ny, top, false, bottom, right);
            await sd.pause(); fresh(x, y, nx, ny);
            return;
        }
    }
    console.log('Error');
}

function fresh(x, y, nx, ny, isFirst = false) {
    console.log("x=", x, y, nx, ny);
    let e1 = g.element(y, x);
    let e2 = g.element(ny, nx);
    if (!isFirst) focus.startAnimate();
    focus.x(e1.x()).y(e1.y());
    focus.width(e2.mx() - e1.x()).height(e2.my() - e1.y());
    if (!isFirst) focus.endAnimate();
}

function flink(arr, pos) {
    if (arr === "x") arr = x; else arr = y;
    console.log("pos=", pos);
    arr.startAnimate().color(pos, C.red).endAnimate();
    arr.startAnimate().color(pos, C.white).endAnimate();
    arr.startAnimate().color(pos, C.red).endAnimate();
    arr.startAnimate().color(pos, C.white).endAnimate();
}