import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const m = 7;
const grid = new sd.Grid(svg).n(n).m(m);
const line = new sd.Line(svg).opacity(0).stroke(C.red).strokeWidth(2).arrow();

sd.main(async () => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            await sd.pause();
            if (i === 1 && j === 1) {
                updateLine(i, j);
                line.opacity(0).startAnimate().opacity(1).endAnimate();
            } else {
                line.startAnimate();
                updateLine(i, j);
                line.endAnimate();
            }
        }
});

function updateLine(x, y) {
    line.source(getPoint(0, 0)).target(getPoint(x, y));
}

function getPoint(i, j) {
    const e = grid.element(Math.max(n - i - 1, 0), Math.min(j, m - 1));
    const x = j === m ? e.mx() : e.x();
    const y = i === n ? e.y() : e.my();
    return [x, y];
}
