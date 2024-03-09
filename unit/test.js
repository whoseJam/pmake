import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let r = new sd.Rect(svg);

main();

async function main() {
    await sd.pause();
    r.color(C.green);
    await sd.pause();
    r.startAnimate(1000).color(C.red).endAnimate();
}