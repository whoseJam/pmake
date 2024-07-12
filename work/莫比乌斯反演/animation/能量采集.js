import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const m = 7;
const grid = new sd.Grid(svg).n(n).m(m);

main();

async function main() {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            await sd.pause();
            const l = getLine(i, j);
            l.opacity(0).startAnimate().opacity(1).endAnimate();
            await sd.pause();
            l.startAnimate().opacity(0).remove();
        }
    await sd.pause();
}

function getLine(x, y) {
    const l = new sd.Line(svg);
    l.source(getPoint(0, 0))
        .target(getPoint(x, y))
        .stroke(C.red)
        .strokeWidth(2)
        .arrow();
    return l;
}

function getPoint(i, j) {
    const e = grid.element(Math.max(n - i - 1, 0), Math.min(j, m - 1));
    const x = (j === m) ? e.mx() : e.x();
    const y = (i === n) ? e.y()  : e.my();
    return [x, y];
}