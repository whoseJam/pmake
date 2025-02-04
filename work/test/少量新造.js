import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg);
const n = 2;

sd.init(() => {
    grid.n(n).m(n);
});

sd.main(async () => {});
