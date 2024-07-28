import * as sd from "@/sd";

let svg = sd.svg();
let g = new sd.Grid(svg).n(10).m(10).x(100).y(100).startN(1).startM(1);

let nodes = [
    [1, 2],
    [3, 2],
    [4, 5],
    [2, 8],
    [6, 7],
    [3, 9],
    [5, 6],
    [8, 2],
    [9, 5],
    [7, 4]
]

for (let node of nodes) {
    put(node[0], node[1]);
}

function put(x, y) {
    x = 10 - x + 1;
    let e = g.element(x, y);
    let l = new sd.Line(svg);
    l.source(e.x(), e.my());
    l.target(e.mx(), e.y());
}

main();

async function main() {
    await sd.pause();
}
