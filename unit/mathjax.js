import * as sd from "../lib/slide";

let svg = sd.svg();

let math = new sd.Mathjax(svg, "a_i+b_j=c_{i,j}");

main();

async function main() {
    await sd.pause();
    math.startAnimate().dx(100).dy(100).endAnimate();
    await sd.pause();
    math.startAnimate().height(40).endAnimate();
    await sd.pause();
}