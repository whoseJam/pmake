import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const c = sd.make2d(20, 20);
const n = 5;
const k = 2;
sd.Label(grid, `k=${2}`, "lc", 25);

init();
main();

function init() {

}

async function main() {
    c[0][0] = 1;
    grid.insert(0, 0, 1);
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (j === 0) c[i][j] = 1;
            else c[i][j] = c[i-1][j-1] + c[i-1][j];
            grid.insert(i, j, c[i][j]);
        }
    }

    await sd.pause();
    grid.startAnimate();
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (c[i][j] % k === 0) {
                grid.color(i, j, C.blue);
            }
        }
    }
    grid.endAnimate();

    const focus = sd.Focus(grid);
    
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        const x = sd.rand(0, n);
        const y = sd.rand(0, n);
        focus.startAnimate().focus(0, 0, x, y).endAnimate();
    }
}