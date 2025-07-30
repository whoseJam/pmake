import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const MINH = 0;
const MAXH = 80;
const upper = new sd.Line(svg).target(40, 0).width(300).strokeWidth(0.5);
const lower = new sd.Line(svg).target(40, 0).width(300).dy(80).strokeWidth(0.5);
const R = 20;
const data = [
    [120, 20],
    [180, 50],
    [80, 70],
    [240, 30],
    [200, 70],
    [160, 40],
    [60, 50],
    [100, 40],
];
const nodes = sd.make1d(data.length);

sd.init(() => {
    data.forEach(item => {
        const [x, y] = item;
        const circle = new sd.Circle(svg).fillOpacity(0).r(R).center(x, y).strokeWidth(0.5);
    });
});

sd.main(async () => {
    await sd.pause();
    data.forEach((item, i) => {
        const [x, y] = item;
        const circle = new sd.Circle(svg).color(C.orange).r(2).center(x, y).strokeWidth(0.5).opacity(0).startAnimate().opacity(1).endAnimate();
        nodes[i] = circle;
    });
    await sd.pause();
    for (let i = 0; i < data.length; i++) {
        const [xa, ya] = data[i];
        for (let j = i + 1; j < data.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const [xb, yb] = data[j];
            if (dist(xa, xb, ya, yb) <= R + R) sd.Link(a, b).color(C.orange).startAnimate().pointStoT().endAnimate();
        }
        if (ya + R >= MAXH) new sd.Line(svg).source(xa, ya).target(xa, MAXH).color(C.orange).startAnimate().pointStoT().endAnimate();
        if (ya - R <= MINH) new sd.Line(svg).source(xa, ya).target(xa, MINH).color(C.orange).startAnimate().pointStoT().endAnimate();
    }
});

function dist(x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
