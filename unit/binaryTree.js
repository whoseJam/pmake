import * as sd from "../lib/slide";

let svg = sd.svg();
let t = new sd.BinaryTree(svg);
t.root(1);

main();

async function main() {
    await sd.pause();
    t.leftChild(1, 2).rightChild(1, 3);
    await sd.pause();
    t.startAnimate().leftChild(2, 4).endAnimate();
    await sd.pause();
    t.startAnimate().rightChild(2, 5).endAnimate();
    await sd.pause();
    t.startAnimate().leftChild(3, 6).endAnimate();
    t.startAnimate().rightChild(3, 7).endAnimate();
    await sd.pause();
}