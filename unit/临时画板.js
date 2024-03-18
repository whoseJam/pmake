import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();

let t = new sd.RoundSquareTree(svg);
t.x(100).y(100).width(600).layerHeight(70)
t.root(1, sd.Box, new sd.Mathjax(svg, "O_1"));
for (let i = 2; i <= 6; i++) {
    t.newNode(i, sd.Box, new sd.Mathjax(svg, `O_${i}`));
}
t.link(1, 2);
t.link(1, 3);
t.link(2, 4);
t.link(2, 5);
t.link(2, 6);
for (let i = 7; i <= 12; i++) {
    t.newNode(i, sd.Vertex, new sd.Mathjax(svg, `C_{${i}}`));
}
for (let i = 1; i <= 12; i++)
    t.element(i).rate(1.8);
t.link(3, 7);
t.link(4, 8);
t.link(4, 9);
t.link(5, 10);
t.link(6, 11);
t.link(3, 12);
dfs(4);
function dfs(u) {
    let U = t.element(u);
    if (U instanceof sd.Vertex)
        U.color(C.orange);
    let children = t.childrenOnTree(u);
    for (let ch of children) {
        dfs(ch);
    }
}