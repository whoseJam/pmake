import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = sd.TinyGraph(svg).drag(true).resizeable(true);

for(let i = 1; i <= 6; i++)
    g.newNode(i, null)
link(1, 2);
link(2, 3);
link(3, 4);
link(4, 5);
link(5, 3);
link(1, 6);
link(6, 5);
color(1, 2);
color(2, 3);
color(3, 4);
color(4, 5);
color(1, 6);

function color(a, b) {
    g.element(a, b).stroke(C.red);
}

function link(a, b) {
    g.newLink(a, b);
    g.element(a, b).arrow().strokeWidth(1.2);
}