import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let rct = sd.Rect(svg);
let lne = sd.Line(svg).source(100, 100).target(200, 100);

main();

async function main() {
    await sd.pause();
    rct.startAnimate(1000).dx(100).dy(100).endAnimate();
    rct.dx(100);
    while (true) {
        await sd.pause();
        rct.startAnimate(1000).dx(100).endAnimate();
        await sd.pause();
        rct.startAnimate(1000).dx(-100).endAnimate();
    }
    // await sd.pause();
    // lne.startAnimate(1000).y(300).endAnimate();
}