import * as sd from "../lib/slide";

let svg = sd.svg();
let s = new sd.Splay(svg).x(100).y(100);

s.root(1);

main();

async function main() {
    await sd.pause();
    s.startAnimate().leftChild(1, 2).endAnimate();
    // await sd.pause();
    s.startAnimate().rightChild(1, 3).endAnimate();
    await sd.pause();
    s.startAnimate().leftChild(2, 4).rightChild(2, 5).endAnimate();
    await sd.pause();
}