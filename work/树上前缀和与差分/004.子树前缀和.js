import * as sd from "#lib/slide";

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
    t.color(4, C.blue);
    t.color(7, C.blue);
    t.color(8, C.blue);
    t.color(9, C.blue);
    t.color(10, C.blue);
    t.color(11, C.blue);
    t.color(12, C.blue);
    t.color(13, C.blue);
    t.color(14, C.blue);
    t.endAnimate();
}