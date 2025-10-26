import * as sd from "@/sd";

let svg = sd.svg();
let t = new sd.RoundSquareTree(svg);

main();

async function main() {
    t.cx(600).y(100).root(1);
    await sd.pause();
    t.startAnimate();
    t.newSquareNode(2);
    t.newRoundNode(3);
    t.link(1, 2);
    t.link(1, 3);
    t.endAnimate();
    await sd.pause();
    t.startAnimate();
    t.newSquareNode(4);
    t.newRoundNode(5);
    t.link(3, 4).link(3, 5)
    t.endAnimate();
    await sd.pause();
    t.startAnimate().r(30).endAnimate();
    await sd.pause();
    t.startAnimate().width(50).endAnimate();
    await sd.pause();
}