import * as sd from "@/sd";

const svg = sd.svg();
const g1 = new sd.Grid(svg).n(3).m(3);
const g2 = new sd.Grid(svg).pushPrimary(1).pushPrimary(2).pushPrimary(3);
const g3 = new sd.Grid(svg).pushPrimary(1).pushPrimary(2).pushPrimary(3).align("mx");
const g4 = new sd.Grid(svg).pushPrimary(1).pushPrimary(2).pushPrimary(3).align("cx");
const g5 = new sd.Grid(svg).pushPrimary(1).pushPrimary(2).pushPrimary(3).align("cx").axis("col");

g1.x(100).y(100);
g2.x(g1.mx() + 40).y(100);
g3.x(g2.mx() + 40).y(100);
g4.x(g3.mx() + 40).y(100);
g5.x(g4.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
