import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).resize(10).cx(600).cy(300);

main();

async function main() {
    await sd.pause();
    sd.Link(arr.element(1), arr.element(5), sd.Curve);
    await sd.pause();
    sd.Link(arr.element(3), arr.element(8), sd.CircleCurve);
    await sd.pause();
    let bx1 = new sd.Box(svg).x(100).y(100);
    let bx2 = new sd.Box(svg).x(300).y(400);
    let l = sd.Link(bx1, bx2, sd.Curve);
    await sd.pause();
    bx1.startAnimate().dx(100).endAnimate();
    bx2.startAnimate().dx(-200).endAnimate();
    await sd.pause();
}