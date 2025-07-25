import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const a = new sd.Grid(svg).n(3).m(4).startN(1).startM(1);

sd.init(() => {
    a.color(C.orange).color(3, 4, C.white);
});

sd.main(async () => {
    await sd.pause();
    a.startAnimate().color(3, 4, C.yellow).endAnimate();
});
