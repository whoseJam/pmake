import * as sd from "#lib/slide";

let svg = sd.svg();
let g = sd.BipartiteGraph(svg).drag(true).resizeable(true);

for (let i = 1; i <= 7; i++)
    g.newNode(i, i, (i <= 4 ? 0 : 1));
g.newLink(1, 5);
g.newLink(1, 6);
g.newLink(2, 5);
g.newLink(3, 6);
g.newLink(3, 7);
g.newLink(4, 7);
