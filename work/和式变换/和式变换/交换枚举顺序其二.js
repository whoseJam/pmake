import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            grid.value(i, j, new sd.Mathjax(grid, `a_{${i},${j}}`));
        }
    }
})

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        grid.startAnimate();
        for (let j = 1; j <= i; j++) {
            grid.color(i, j, C.blue);
        }
        grid.endAnimate();
        await sd.pause();
        grid.startAnimate();
        for (let j = 1; j <= i; j++) {
            grid.color(i, j, C.white);
        }
        grid.endAnimate();
    }

    for (let j = 1; j <= n; j++) {
        await sd.pause();
        grid.startAnimate();
        for (let i = j; i <= n; i++) {
            grid.color(i, j, C.blue);
        }
        grid.endAnimate();
        await sd.pause();
        grid.startAnimate();
        for (let i = j; i <= n; i++) {
            grid.color(i, j, C.white);
        }
        grid.endAnimate();
    }
})
