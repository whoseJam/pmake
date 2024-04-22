import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let data = [
    { x: 2, y: 1 },
    { x: 7, y: 2 },
    { x: 1, y: 3 },
    { x: 3, y: 3 },
    { x: 0, y: 4 },
    { x: 4, y: 4 },
    { x: 9, y: 4 },
    { x: 7, y: 5 },
    { x: 2, y: 6 },
    { x: 5, y: 6 },
    { x: 8, y: 6 }
];
for (let i = 0; i < data.length; i++)
    data[i].dot = new sd.Circle(svg).r(6).cx(getX(data[i])).cy(getY(data[i])).color(C.black);

main();

async function main() {
    let histX = {}, histY = {}, ys = [];

    await sd.pause();
    data.sort(function(a, b) { return a.x - b.x; });
    for (let i = 0; i < data.length; i++) {
        let last = histX[data[i].y];
        if (last) sd.Link(last, data[i].dot, sd.Line).startAnimate().pointStoT().endAnimate();
        histX[data[i].y] = data[i].dot;
        ys.push(getY(data[i]));
    }

    await sd.pause();
    data.sort(function(a, b) { return a.y - b.y; });
    for (let i = 0; i < data.length; i++) {
        let last = histY[data[i].x];
        if (last) sd.Link(last, data[i].dot, sd.Line).startAnimate().pointStoT().endAnimate();
        histY[data[i].x] = data[i].dot;
    }

    await sd.pause();
    let l = new sd.Line(svg).stroke(C.red);
    let h = [...new Set(ys)];
    h.sort(function(a, b) { return b - a; });
    l.source(100, h[0]).target(750, h[0]).opacity(0);
    l.startAnimate().opacity(1).endAnimate();
    for (let i = 1; i < h.length; i++) {
        await sd.pause();
        l.startAnimate().y(h[i]).endAnimate();
    }


}

function getX(pos) { 
    let x = 200 + pos.x * 50;
    return x;
}

function getY(pos) {
    let y = 500 - pos.y * 50;
    return y;
}