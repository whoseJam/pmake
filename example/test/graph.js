import * as sd from "#lib/slide";

let svg = sd.svg();
let g = sd.Graph(svg);
g.x(100).y(100);
// let lk = sd.CurveLink(svg);
// lk.source(100, 100).target(300, 100);

g.newNode("A", sd.Text(svg, "A"));
g.newNode("B", sd.Text(svg, "B"));
g.newNode("C", sd.Text(svg, "C"));
g.newNode("A1", sd.Text(svg, "A1"));
g.newNode("B1", sd.Text(svg, "B1"));
g.newNode("C1", sd.Text(svg, "C1"));
// g._.linkType = sd.CurveLink;
g.newLink("A", "A1");
g.newLink("B", "C");
g.newLink("C", "A");
g.drag(true).resizeable(true);

main();

async function main() {
    // await sd.pause();
    // lk.startAnimate();
    // lk.source(100, 100).target(200, 200);
    // lk.endAnimate();
    await sd.pause();
    g.startAnimate().newLink("C", "B1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("C", "C1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("A", "B1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("A", "C1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("B", "C1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("A1", "C1").endAnimate();
    await sd.pause();
    g.startAnimate().newLink("B", "A1").endAnimate();
}
