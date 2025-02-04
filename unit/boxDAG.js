import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const g = new sd.BoxDAG(svg).cx(800).cy(300);
const n = 9;
const m = 10;
const e = [
    ["V1", "V3"],
    ["V1", "V4"],
    ["V2", "V5"],
    ["V3", "V5"],
    ["V4", "V6"],
    ["V5", "V7"],
    ["V5", "V8"],
    ["V6", "V8"],
    ["V7", "V9"],
    ["V8", "V9"],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) g.newNode("V" + i);
});

sd.main(async () => {
    for (let i = 0; i < m; i++) {
        await sd.pause();
        g.startAnimate();
        g.newLink(e[i][0], e[i][1]);
        g.element(e[i][0], e[i][1]).arrow().strokeWidth(1.2);
        g.endAnimate();
    }
    await sd.pause();
    g.startAnimate().elementWidth(60).endAnimate();
    await sd.pause();
});
