import * as sd from "#lib/slide";

let svg = sd.svg();

let t = sd.BinaryTree(svg).drag(true).resizeable(true);
t.root(5);
t.link(5, 2, 1);
t.link(2, 4, 1);
t.width(800).layerHeight(100);

main();

async function main() {
    await sd.pause();
    t.startAnimate().link(1, 5, 0).endAnimate();
    await sd.pause();
    t.startAnimate().cut(5, 2).endAnimate();
    await sd.pause();
    t.startAnimate().link(2, 1, 0).endAnimate();
    // t.startAnimate().cut(1, 2).endAnimate();
    // await sd.pause();
    // t.startAnimate().link(2, 1, 0).endAnimate();
} 