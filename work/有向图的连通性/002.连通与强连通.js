import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let g1 = sd.TinyGraph(svg).drag(true).resizeable(true);
let g2 = sd.TinyGraph(svg).drag(true).resizeable(true);
let g3 = sd.TinyGraph(svg).drag(true).resizeable(true);

for(let i = 1; i <= 3; i++)
    g1.newNode(i);
g2.newNode(4);
for(let i = 5; i <= 8; i++)
    g3.newNode(i);
link(g1, 1, 2);
link(g1, 2, 3);
link(g1, 3, 1);
Link(g1.element(3), g2.element(4));
Link(g3.element(5), g2.element(4));
Link(g3.element(6), g2.element(4));
link(g3, 5, 6);
link(g3, 6, 7);
link(g3, 7, 8);
link(g3, 8, 5);

function color(a, b) {
    g.element(a, b).stroke(C.red);
}

function link(g, a, b) {
    g.newLink(a, b);
    g.element(a, b).arrow().strokeWidth(1.2);
}
function Link(a, b) {
    let lk = sd.Link(svg);
    lk.from(a).to(b);
    lk.arrow().strokeWidth(1.2);
}