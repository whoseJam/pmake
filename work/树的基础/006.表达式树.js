import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();

let t = sd.Tree(svg).x(100).y(100).width(500);
t.root(1); t.value(1, "-");
t.link(1, 2); t.value(2, "+");
t.link(1, 3); t.value(3, "/");
t.link(2, 4); t.value(4, "a");
t.link(2, 5); t.value(5, "*");
t.link(3, 6); t.value(6, "e");
t.link(3, 7); t.value(7, "f");
t.link(5, 8); t.value(8, "b");
t.link(5, 9); t.value(9, "-");
t.link(9, 10); t.value(10, "c");
t.link(9, 11); t.value(11, "d");