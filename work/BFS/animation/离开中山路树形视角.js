import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.ValueTree(svg).width(1000).layerHeight(70);
const C = sd.color();
const I = sd.input();
const n = 3;
const m = 4;
const data = I.readCharMatrix(`
0010
0000
1000`, n, m);
const dis = sd.make2d(10, 10, Infinity);
const ids = sd.make2d(10, 10);
tree.cx(600).y(50);
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
let tot = 1;

init();
main();

function makeGrid(x0, y0) {
    const grid = new sd.Grid(tree).n(n).m(m).startN(1).startM(1);
    grid.elementWidth(20);
    grid.elementHeight(20);
    for (let x = 1; x <= n; x++) {
        for (let y = 1; y <= m; y++) {
            if (data[x][y] == 1) grid.color(x, y, C.grey);
        }
    }
    grid.value(x0, y0, new sd.Circle(grid).color(C.ORANGE));
    return grid;
}

function init() {
    tree.root(1, makeGrid(1, 1));
    dis[1][1] = 0;
    ids[1][1] = 1;
}

async function main() {
    await sd.pause();
    await sd.pause();
    const Q = [{x: 1, y: 1}];
    let lastDis = 1;
    while (Q.length) {
        const u = Q[0]; Q.shift();
        if (dis[u.x][u.y] != lastDis) {
            await sd.pause();
            lastDis = dis[u.x][u.y];
        }
        for (let i = 0; i < 4; i++) {
            const tx = u.x + dx[i];
            const ty = u.y + dy[i];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= m) {
                if (data[tx][ty] == "1") continue;
                if (dis[tx][ty] > dis[u.x][u.y] + 1) {
                    dis[tx][ty] = dis[u.x][u.y] + 1;
                    ids[tx][ty] = ++tot;
                    Q.push({ x: tx, y: ty });
                    tree.newNode(ids[tx][ty], makeGrid(tx, ty));
                    tree.newLink(ids[u.x][u.y], ids[tx][ty]);
                }
            }
        }
    }
}
