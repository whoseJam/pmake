import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const t = new sd.Tree(svg);

main();

async function main() {
    t.cx(600).y(100).root(1);
    await sd.pause();
    t.startAnimate().freeze();
    t.link(1, 2);
    t.link(1, 3);
    t.unfreeze().endAnimate();
    // t.startAnimate().link(2, 3).endAnimate();
    await sd.pause();
    t.startAnimate().freeze().link(3, 4).link(3, 5).unfreeze().endAnimate();
    await sd.pause();
    t.startAnimate().r(30).endAnimate();
    await sd.pause();
    t.startAnimate().width(100).endAnimate();
    await sd.pause();
}