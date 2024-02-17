import * as sd from "../lib/slide";

let svg = sd.svg();

main();

async function main() {
    await sd.pause();
    let obj = new sd.Curve(svg).source(100, 100).target(500, 200);
    obj.startAnimate().pointTo().endAnimate();
    await sd.pause();
    obj.startAnimate().pointToAndFade().endAnimate();
}