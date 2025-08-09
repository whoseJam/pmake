import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = makeTriGrid(svg, n);

sd.init(() => {});

sd.main(async () => {});

function makeTriGrid(svg, n) {
    const tri = new sd.Grid(svg).startN(1).startM(1);
    for (let i = 1; i <= n; i++) tri.pushPrimary(i);
    return tri;
}
