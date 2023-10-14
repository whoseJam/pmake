import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let rct = sd.Rect(svg);

main();

async function main() {
    await sd.pause();
    rct.startAnimate(1000).color(C.red).dx(100).dy(100).endAnimate();
    rct.startAnimate(1000).color(C.blue).endAnimate();
    rct.startAnimate(1000).color(C.green).endAnimate();
}