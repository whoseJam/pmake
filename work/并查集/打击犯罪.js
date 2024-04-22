import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = new sd.GridGraph(svg);
g.n(1).m(1).cx(600).y(300);
g.at(1, 0.66).newNode(1);
g.at(0, 0.33).newNode(2);
g.at(1, 0.33).newNode(3);
g.at(0, 0.66).newNode(4);
g.at(0.5, 0).newNode(5);
g.at(0.5, 1).newNode(6);
g.newLink(1, 3);
g.newLink(1, 4);
g.newLink(2, 3);
g.newLink(2, 5);
g.newLink(3, 5);
g.newLink(4, 6);
