import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let g = sd.Graph(svg).drag(true).resizeable(true);

link(1, 2);
link(2, 3);
link(3, 4);
link(4, 5);
link(5, 3);
link(6, 7);
link(7, 8);
link(8, 6);
for (let i = 1; i <= 8; i++) {
    g.element("node", i).value(sd.Text(g, sd.rand(100, 999)));
}

main();

async function main() {
    await sd.pause();
    let add = sd.Graph(svg).x(400);
    let weight = [sd.rand(100, 999), sd.rand(100, 999), sd.rand(100, 999), sd.rand(100, 999)];
    linkGraph(add, weight[1], weight[0]);
    linkGraph(add, weight[2], weight[0]);
    linkGraph(add, weight[3], weight[0]);
    add.color(weight[1], C.RED);
    add.color(weight[2], C.RED);
    add.color(weight[3], C.RED);

    await sd.pause();
    let kill = sd.Graph(svg).x(400).y(300);
    for (let i = 1; i <= 3; i++)
        weight.push(sd.rand(100, 999));
    linkGraph(kill, weight[1], weight[0]);
    linkGraph(kill, weight[2], weight[0]);
    linkGraph(kill, weight[3], weight[0]);
    linkGraph(kill, weight[0], weight[4]);
    linkGraph(kill, weight[0], weight[5]);
    linkGraph(kill, weight[0], weight[6]);
}

function link(x, y) {
    g.link(x, y);
    g.element(x, y).background().markerEnd("arrow");
}

function linkGraph(g, x, y) {
    g.link(x, y);
    g.element(x, y).background().markerEnd("arrow");
}