import * as sd from "#lib/slide";

let svg = sd.svg();
let poly = sd.Polyline(svg);
poly.points([100, 100, 200, 100, 50, 50, 100, 100]).drag(true);

main();

async function main() {
    // await sd.pause();
    // poly.startAnimate().x(300).endAnimate();
    await sd.pause();
    poly.startAnimate()
        .points([100, 100, 200, 100, 150, 50, 100, 100])
        .endAnimate();
    await sd.pause();
    poly.startAnimate()
        .width(200)
        .height(200)
        .endAnimate();
    // poly.startAnimate()
    //     .y(300)
    //     .endAnimate();
    // poly.startAnimate()
    //     .x(300)
    //     .endAnimate();
}