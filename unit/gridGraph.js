import * as sd from "../lib/slide";

let svg = sd.svg();
let g = new sd.GridGraph(svg);

let eps = 0.2;
g.n(3).m(4);
g.at(2, 1).newNode(1);
g.at(1, 2-eps).newNode(2);
g.at(3, 2-eps).newNode(3);
g.at(1, 3+eps).newNode(4);
g.at(3, 3+eps).newNode(5);
g.at(2, 4).newNode(6);

link(1, 2);
link(1, 3);
link(2, 4);
link(3, 5);
link(4, 6);
link(5, 6);
function link(x, y) {
    g.newLink(x, y);
    g.element(x, y).arrow();
}
