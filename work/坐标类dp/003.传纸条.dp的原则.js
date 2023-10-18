import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let n = 4, m = 5;

main();

async function main() {
    await sd.pause();
    makeMap(3, 1, 2, 2).x(100).y(50).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    makeMap(3, 2, 2, 3).x(100).y(250).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    makeMap(4, 1, 2, 3).x(500).y(250).opacity(0).startAnimate().opacity(1).endAnimate();
}

function makeMap(x1, y1, x2, y2) {
    let g = sd.Grid(svg);
    g.n(n).m(m).startN(1).startM(1).drag(true);
    g.value(x1, y1, sd.Circle(svg).color(C.ORANGE));
    g.value(x2, y2, sd.Circle(svg).color(C.GREEN));
    return g;
}