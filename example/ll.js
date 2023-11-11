import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let g = sd.Graph(svg).drag(true).resizeable(true);

g.newNode("a");
g.newNode("b");
g.newNode("i");
g.newNode("x");
g.newNode("y");

g.newLink("b", "a");
g.newLink("a", "x");
g.newLink("a", "i");
g.newLink("i", "x");
g.newLink("a", "y");
g.newLink("i", "y");
g.newLink("x", "y");
g.color("a", C.grey);
g.color("x", C.grey);
g.color("b", C.red);
g.color("i", C.red);
g.color("y", C.blue);
// g.newNode("i1", "i1").newNode("i2", "i2");
// g.newNode("h1", "h1").newNode("h2", "h2");
// g.newLink("i1", "h1", "w11");
// g.newLink("i1", "h2", "w12");
// g.newLink("i2", "h1", "w21");
// g.newLink("i2", "h2", "w22");
// g.newNode("o", "o");
// g.newLink("h1", "o", "v11");
// g.newLink("h2", "o", "v21");