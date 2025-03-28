import * as sd from "@/sd";

const svg = sd.svg();
const n = 2;
const m = 1;
const grid = sd.make2d(n + 1, m + 1, undefined);

sd.init(() => {
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            grid[i][j] = new sd.Circle(svg).r(2).center([i * 40, j * 40]);
            sd.MathjaxLabel(grid[i][j], `(${i},${j})`, "tr", 10, 2);
        }
    }
});

sd.main(async () => {});
