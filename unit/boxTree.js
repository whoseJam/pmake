import * as sd from "@/SD";

let svg = sd.svg();
let t = new sd.BoxTree(svg);

main();

async function main() {
    t.cx(600).y(100).root(1);
    await sd.pause();
    t.startAnimate()
    t.link(1, 2);
    t.link(1, 3);
    t.endAnimate();
    // t.startAnimate().link(2, 3).endAnimate();
    await sd.pause();
    t.startAnimate().link(3, 4).link(3, 5).endAnimate();
    await sd.pause();
    t.startAnimate().height(50).endAnimate();
    await sd.pause();
}