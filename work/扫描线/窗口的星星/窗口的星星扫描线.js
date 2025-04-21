import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    [430, 210],
    [250, 330],
    [320, 390],
    [510, 190],
    [490, 120],
];

const W = 300;
const H = 200;
const stars = [];
let diffY;
let minX = +1000;
let maxX = -1000;
let line;

function init() {
    for (let i = 0; i < data.length; i++) {
        data[i][0] += W;
    }
    for (let i = 0; i < data.length; i++) {
        const star = new sd.Circle(svg).cx(data[i][0]).cy(data[i][1]).color(C.deepSkyBlue).r(4);
        stars.push(star);
    }
    const y = [];
    for (let i = 0; i < data.length; i++) {
        let r = new sd.Rect(stars[i]).width(W).height(H);
        r.x(stars[i].cx()-W).y(stars[i].cy());
        r.fillOpacity(0.2).stroke(C.BLUE.border);
        r.fill(C.orange);
        y.push(r.y());
        y.push(r.my());
        minX = Math.min(minX, r.x());
        maxX = Math.max(maxX, r.mx());
    }
    diffY = [...new Set(y)].sort((a, b) => a - b);
    line = new sd.Line(svg).stroke(C.red).strokeWidth(2)
    line.source(minX - 30, diffY[diffY.length - 1] + 50)
        .target(maxX + 30, diffY[diffY.length - 1] + 50);
}

init();
main();

async function main() {
    for (let i = diffY.length - 1; i >= 0; i--) {
        const currentY = diffY[i];

        await sd.pause();
        line.startAnimate().y(currentY).endAnimate();
    }
}