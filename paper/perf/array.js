import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 50;
const arr = new sd.Array(svg).x(100).y(400);

sd.init(() => {
    sd.freeze();
    arr.resize(n).start(1);
    sd.unfreeze();
});

sd.main(async () => {
    const links = [];
    await sd.pause();
    for (let i = 1; i < n; i++) {
        const link = sd.Link(arr.element(i), arr.element(n), sd.Curve, "cx", "y", "cx", "y");
        link.bending(-0.5).opacity(0);
        links.push(link);
    }
    links.forEach(link => {
        link.opacity(1).startAnimate(1000).pointStoT().endAnimate().arrow();
    });
});
