import * as sd from "../lib/slide";

let svg = sd.svg();
let t1 = new sd.Array(svg);
t1.x(100).y(200);

main();

async function main() {
    await sd.pause();
    t1.startAnimate().push(1).endAnimate();
    await sd.pause();
    t1.startAnimate().push(1).endAnimate();
    await sd.pause();
    t1.startAnimate().push(1).endAnimate();
    await sd.pause();
    t1.startAnimate().pop().endAnimate();
    await sd.pause();
    t1.startAnimate().pop().endAnimate();
    await sd.pause();
}