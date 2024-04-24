import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).resize(10).cx(600).cy(300);

main();

async function main() {
    await sd.pause();
    sd.Link(arr.element(1), arr.element(5), sd.Curve);
    await sd.pause();
    sd.Link(arr.element(3), arr.element(8), sd.CircleCurve);

    let l = new sd.Curve(svg);
    l.source(600, 300);
    l.target(820, 300);

    await sd.pause();
}