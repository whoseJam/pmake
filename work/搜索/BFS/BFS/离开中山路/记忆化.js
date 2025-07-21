import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const EN = sd.enter();
const tree = new sd.ValueTree(svg).width(800).layerHeight(120);
const n = 3;
const [sx, sy] = [1, 1];
const [fx, fy] = [1, 3];
const visited = sd.make2d(n + 1, n + 1, false);
const memory = new sd.Grid(svg).elementWidth(60).elementHeight(60).n(n).m(n).startN(1).startM(1);
const directions = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
];
const map = I.readIntMatrix(`0 1 0 0 0 0 0 0 0`, n, n);
let tot = 0;

sd.init(() => {
    visited[sx][sy] = 0;
    bfs(sx, sy);
    tree.forEachNode(node => node.opacity(0));
    tree.forEachLink(link => link.opacity(0));
    tree.nodeOpacity(1, 1);
    memory.cy(tree.cy()).mx(tree.x());
});

sd.main(async () => {
    let current = [1];
    let next = [];
    let distance = 0;
    memory.value(sx, sy, distance);
    while (current.length > 0) {
        await sd.pause();
        distance++;
        for (const x of current) {
            const children = tree.children(x);
            for (const child of children) {
                child.startAnimate().opacity(1).endAnimate();
                const link = tree.element(x, child);
                link.opacity(1).startAnimate().pointStoT().endAnimate();
                next.push(+tree.nodeId(child));
                memory.element(child.current[0], child.current[1]).startAnimate().value(distance).endAnimate();
            }
        }
        [current, next] = [next, []];
    }
});

function bfs() {
    tree.newNode(++tot, makeGrid(sx, sy));
    const queue = [[sx, sy, tot]];
    while (queue.length > 0) {
        const [x, y, current] = queue.shift();
        for (const [dx, dy] of directions) {
            const [tx, ty] = [x + dx, y + dy];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= n && map[tx][ty] === 0 && visited[tx][ty] === false) {
                visited[tx][ty] = visited[x][y] + 1;
                const next = ++tot;
                tree.newNode(next, makeGrid(tx, ty));
                tree.element(next).current = [tx, ty];
                tree.newLink(current, next);
                queue.push([tx, ty, next]);
            }
        }
    }
}

function makeGrid(x, y) {
    const grid = new sd.Grid(svg).elementWidth(30).elementHeight(30).n(n).m(n).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (map[i][j]) grid.value(i, j, "1");
        }
    grid.value(x, y, new sd.Circle(grid).color(C.orange));
    return grid;
}
