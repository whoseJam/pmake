import * as sd from "@/sd";

const svg = sd.svg();
const n = 25;
const grid = new sd.Grid(svg);

sd.init(() => {
    sd.freeze();
    grid.n(n).m(n);
    sd.unfreeze();
});

sd.main(async () => {
    await sd.pause();
});
