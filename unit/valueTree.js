import * as sd from "@/sd";

let svg = sd.svg();
let t = new sd.ValueTree(svg).cx(600).y(50).layerHeight(120);

main();

async function main() {
    t.root(1, new sd.Array(svg).push(1).push(2).push(3));
    await sd.pause();
    t.startAnimate();
    t.newNode(2, new sd.Grid(svg).n(3).m(3));
    t.newLink(1, 2);
    t.endAnimate();
    await sd.pause();
    t.startAnimate();
    t.newNode(3, new sd.Mathjax(svg, `A^2+B^2=C^2`));
    t.newLink(1, 3);
    t.endAnimate();
    await sd.pause(true);
}