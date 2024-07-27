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

main();

async function main() {
    
}

function link(x, y) {
    g.link(x, y);
    g.element(x, y).background().markerEnd("arrow");
}