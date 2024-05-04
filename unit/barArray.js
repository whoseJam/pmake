import * as sd from "../lib/slide";

let svg = sd.svg();

main();

async function main() {
    let bar = new sd.BarArray(svg).x(100).y(400);
    console.assert(bar.x() === 100);
    console.assert(bar.y() === 400);
    await sd.pause();
    bar.startAnimate().push(5).endAnimate();
    console.assert(bar.x() === 100);
    console.assert(bar.y() === 400 - 5 * bar.elementHeight());
    console.assert(bar.element(0).x() === 100);
    console.assert(bar.element(0).y() === bar.y());
    await sd.pause();
    bar.startAnimate().push(4).endAnimate();
    bar.startAnimate().push(3).endAnimate();
    await sd.pause();
    bar.startAnimate().push(2).push(1).endAnimate();
    await sd.pause();
    bar.startAnimate(1000).erase(1).endAnimate();
    bar.startAnimate(1000).erase(2).endAnimate();
    await sd.pause();
    bar.startAnimate().elementWidth(50).endAnimate();
    bar.startAnimate().elementHeight(20).endAnimate();
    await sd.pause();
}