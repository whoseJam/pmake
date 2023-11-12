import * as sd from "#lib/slide";

let svg = sd.svg();

let txt1 = sd.Text(svg, "Hello");
let txt2 = sd.Text(svg, "World");
let tr = sd.Tree(svg).drag(true).resizeable(true);
let box = sd.Box(svg).value(txt1);
tr.root(1);
tr.link(1, 2);
tr.link(1, 3);
tr.link(2, 4);
tr.link(2, 5);
tr.cx(300).cy(300);

main();

async function main() {
    await sd.pause();
    tr.startAnimate().cut(2, 5).endAnimate();
    tr.startAnimate().cut(2 ,4).endAnimate();
    await sd.pause();
    tr.startAnimate().link(3, 5).endAnimate();
    tr.startAnimate().link(5 ,4).endAnimate();
    await sd.pause();
    tr.startAnimate().fromExistedElem().newNode(6, box).newLink(2, 6).endAnimate();
} 