import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 2;
const m = 3;
const grid = sd.make2d(n + 1, m + 1, undefined);
const distance = 80;

sd.init(() => {
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            grid[i][j] = new sd.Circle(svg).r(2).center([j * distance, i * distance]);
            sd.MathjaxLabel(grid[i][j], `(${i},${j})`, "tr", 10, 2);
        }
    }
});

sd.main(async () => {
    await sd.pause();
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            if (i < n)
                sd.Link(grid[i][j], grid[i + 1][j])
                    .stroke(C.red)
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
            if (j < m)
                sd.Link(grid[i][j], grid[i][j + 1])
                    .stroke(C.red)
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
            if (i < n && j < m)
                sd.Link(grid[i][j], grid[i + 1][j + 1])
                    .stroke(C.red)
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
        }
    }
});
