import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 6;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const data = I.readCharMatrix(`
00100
00000
00111
01000
00000
01100`, n, m);
const grad = C.gradient(C.blue, C.deepSkyBlue, 0, 10);
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

init();
main();

function init() {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            if (data[i][j] == "1") grid.color(i, j, C.grey);
        }
    grid.color(1, 1, grad(0));
    grid.value(1, 1, 0).cx(600).cy(300);
}

async function main() {
    await sd.pause();
    const Q = [{x: 1, y: 1}];
    while (Q.length) {
        const u = Q[0]; Q.shift();
        for (let i = 0; i < 4; i++) {
            const tx = u.x + dx[i];
            const ty = u.y + dy[i];
            if (1 <= tx && tx <= n && 1 <= ty && ty <= m) {
                if (data[tx][ty] == "1") continue;
                if (!grid.value(tx, ty)) {
                    await sd.pause();
                    grid.startAnimate();
                    const w = grid.intValue(u.x, u.y) + 1;
                    grid.value(tx, ty, w);
                    grid.color(tx, ty, grad(w));
                    grid.endAnimate();
                    Q.push({ x: tx, y: ty });
                }
            }
        }
    }
}