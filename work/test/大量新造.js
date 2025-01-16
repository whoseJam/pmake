import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg);

sd.init(() => {
    grid.n(5).m(5);
});

sd.main(async () => {});
