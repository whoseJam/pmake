import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let n = 10, m = 10;
let grid = sd.Grid(svg).n(n).m(m);
grid.startN(1).startM(1).x(100).y(100);
let rowMarked = sd.make2d(50, 50);
let colMarked = sd.make2d(50, 50);

main();

async function main() {
    await markHorizontalEdge(2);
    await markHorizontalEdge(4);
    await markVerticalEdge(6, true);
    await markHorizontalEdge(8, true);
    await markVerticalEdge(3, true);
}

async function markHorizontalEdge(col, detail = false) {
    if (!detail) await sd.pause();
    for (let i = 1; i <= n + 1; i++) {
        if (colMarked[i][col]) continue;
        let e = sd.Line(svg);
        let elem = grid.element(Math.min(n, i), col);
        if (i !== n + 1) {
            e.x1(elem.x()).y1(elem.y());
            e.x2(elem.mx()).y2(elem.y());
        } else {
            e.x1(elem.x()).y1(elem.my());
            e.x2(elem.mx()).y2(elem.my());
        }
        e.opacity(0).stroke(C.red).strokeWidth(6);
        if (detail) await sd.pause();
        e.startAnimate();
        e.opacity(1);
        e.endAnimate();
        rowMarked[i][col] = true;
    }
}

async function markVerticalEdge(row, detail = false) {
    if (!detail) await sd.pause();
    for (let j = 1; j <= m + 1; j++) {
        if (rowMarked[row][j]) continue;
        let e = sd.Line(svg);
        let elem = grid.element(row, Math.min(m, j));
        if (j !== m + 1) {
            e.x1(elem.x()).y1(elem.y());
            e.x2(elem.x()).y2(elem.my());
        } else {
            e.x1(elem.mx()).y1(elem.y());
            e.x2(elem.mx()).y2(elem.my());
        }
        e.opacity(0).stroke(C.red).strokeWidth(6);
        if (detail) await sd.pause();
        e.startAnimate();
        e.opacity(1);
        e.endAnimate();
        colMarked[row][j] = true;
    }
}