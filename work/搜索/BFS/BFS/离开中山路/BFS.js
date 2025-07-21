import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const EN = sd.enter();
const grad = C.gradient(C.textBlue, C.white, 0, 5);
const n = 3;
const [sx, sy] = [1, 1];
const visited = sd.make2d(n + 1, n + 1, false);
const memory = new sd.Grid(svg).elementWidth(60).elementHeight(60).n(n).m(n).startN(1).startM(1);
const Q = new sd.ValueArray(svg)
    .elementWidth(60)
    .x(memory.mx() + 80)
    .cy(memory.cy());
const directions = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
];
const focus = sd.Focus(svg);
const map = I.readIntMatrix(`0 1 0 0 0 0 0 0 0`, n, n);
let tot = 0;

sd.init(() => {
    sd.Label(Q, "队列");
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) memory.color(i, j, C.grey);
        }
});

sd.main(async () => {
    await bfs(sx, sy);
});

async function bfs() {
    await sd.pause();
    Q.startAnimate().push(makeGrid(sx, sy)).endAnimate();
    memory.startAnimate().value(sx, sy, 0).color(sx, sy, grad(0)).endAnimate();
    visited[sx][sy] = 0;
    const queue = [[sx, sy, tot]];
    while (queue.length > 0) {
        await sd.pause();
        const first = Q.element(0);
        focus.startAnimate().focus(first).endAnimate();
        const [x, y, current] = queue.shift();
        for (const [dx, dy] of directions) {
            const [tx, ty] = [x + dx, y + dy];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= n) {
                await sd.pause();
                const link = new sd.Line(svg)
                    .stroke(C.red)
                    .source(memory.element(x + 0, y).center())
                    .target(memory.element(tx, ty).center())
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                if (map[tx][ty] === 0 && visited[tx][ty] === false) {
                    await sd.pause();
                    visited[tx][ty] = visited[x][y] + 1;
                    queue.push([tx, ty, current + 1]);
                    memory
                        .startAnimate()
                        .value(tx, ty, current + 1)
                        .color(tx, ty, grad(current + 1))
                        .endAnimate();
                    Q.startAnimate().push(makeGrid(tx, ty)).endAnimate();
                }
                await sd.pause();
                link.startAnimate().fadeStoT().endAnimate().remove();
            }
        }
        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();
        Q.startAnimate().erase(0).endAnimate();
    }
}

function makeGrid(x, y) {
    const grid = new sd.Grid(svg).elementWidth(15).elementHeight(15).n(n).m(n).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) grid.color(i, j, C.grey);
        }
    grid.value(x, y, new sd.Circle(grid).color(C.orange));
    return grid;
}
