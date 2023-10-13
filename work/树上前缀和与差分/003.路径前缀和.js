import * as sd from "#lib/slide";

// https://loj.ac/p/10134

let svg = sd.svg();
let C = sd.color();
let t = sd.Tree(svg);

t.root("...");
t.link("...", 1);
t.link("...", 1000);
t.element("...").background().strokeOpacity(0);
t.element("...", 1000).opacity(0);
t.element(1000).opacity(0);
t.link(1, 2);
t.link(1, 3);
t.link(1, 4);
t.link(2, 5);
t.link(2, 6);
t.link(4, 7);
t.link(4, 8);
t.link(4, 9);
t.link(7, 10);
t.link(7, 11);
t.link(8, 12);
t.link(9, 13);
t.link(9, 14);
t.x(100).y(100).width(800).layerHeight(70);

main();

async function main() {
    await sd.pause();
    t.startAnimate();
    t.color(2, C.blue);
    t.color(9, C.blue);
    t.endAnimate();

    await sd.pause();
    t.startAnimate();
    t.element(1, 2).background().color(C.red).strokeWidth(3);
    t.element(1, 4).background().color(C.red).strokeWidth(3);
    t.element(4, 9).background().color(C.red).strokeWidth(3);
    t.endAnimate();
}