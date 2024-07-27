import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let c1 = "#99CC99";
let c2 = "#669933";
let c3 = "#336633";
let c4 = "#CCCC00";

let g = sd.Graph(svg).cx(600).cy(300).drag(true).resizeable(true);

g.link(1, 2);
g.link(1, 3);
g.link(2, 4);
g.link(2, 5);
g.link(3, 6);
g.link(3, 7);
g.link(4, 8);
g.link(5, 8);
g.link(6, 8);
g.link(6, 9);
g.link(7, 9);
sd.EnableTitle(g.element(1), "起点");
sd.EnableTitle(g.element(8), "终点");

main();

async function main() {
    await sd.pause();
    g.startAnimate();
    g.color(1, c1);
    g.endAnimate();

    await sd.pause();
    g.startAnimate();
    g.color(2, c2).color(3, c2);
    g.endAnimate();

    await sd.pause();
    g.startAnimate();
    g.color(4, c3).color(5, c3).color(6, c3).color(7, c3);
    g.endAnimate();

    await sd.pause();
    g.startAnimate();
    g.color(8, c4).color(9, c4);
    g.endAnimate();
}