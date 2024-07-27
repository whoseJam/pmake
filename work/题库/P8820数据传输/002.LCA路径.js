import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let R = sd.reader();
let t = sd.Tree(svg).drag(true).resizeable(true).x(400).y(130).width(460);
let g = sd.Graph(svg).drag(true).resizeable(true);
t.layerHeight(80);

t.root({ id: 1, value: sd.Text(t, "...")});
t.link({ parent: 1, id: 0, value: sd.Text(t, "LCA")});
t.link({ parent: 0, id: 2, value: sd.Text(t, "fx") });
t.link({ parent: 2, id: 3, value: sd.Text(t, "...") });
t.link({ parent: 3, id: 4, value: sd.Text(t, "x") });
t.link({ parent: 0, id: 5, value: sd.Text(t, "fy") });
t.link({ parent: 5, id: 6, value: sd.Text(t, "...") });
t.link({ parent: 6, id: 7, value: sd.Text(t, "y") });
t.element(1).background().strokeOpacity(0);
t.element(3).background().strokeOpacity(0);
t.element(6).background().strokeOpacity(0);

g.x(60).y(160);
g.newNode("skip1", sd.Text(g, "..."));
g.newNode("skip2", sd.Text(g, "..."));
g.link("x", "skip1");
g.link("skip1", "fx");
g.link("fx", "LCA");
g.link("LCA", "fy");
g.link("fy", "skip2");
g.link("skip2", "y");

main();

async function main() {
    await sd.pause();
    let cond = sd.Mathjax(svg).drag(true).resizeable(true);
    cond.math(`设f(i,k)表示走到路径上第i个点,目前到上一个点距离为k的最小开销`).x(340).y(30);
    await sd.pause();
    let trans1 = sd.Mathjax(svg).drag(true).resizeable(true);
    trans1.math(`f(i,k)=f(i-1,k-1)\\ if\\ k \\ge 1`).x(670).y(90);
    let trans2 = sd.Mathjax(svg).drag(true).resizeable(true);
    trans2.math(`f(i,0)=v_i+min\\{f(i-1,0/1/2)\\}`).x(670).y(150);

}