import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let t = sd.BinaryTree(svg).x(100).y(100).width(500);
t.root(1); t.value(1, "d");
t.link(1, 2, 0); t.value(2, "c");
t.link(1, 3, 1); t.value(3, ".");
t.link(2, 4, 0); t.value(4, "a");
t.link(2, 5, 1); t.value(5, "b");
t.link(4, 6, 0); t.value(6, ".");
t.link(4, 7, 1); t.value(7, ".");
t.link(5, 8, 0); t.value(8, ".");
t.link(5, 9, 1); t.value(9, ".");