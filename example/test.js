import * as sd from "#lib/slide";

let svg = sd.svg();
sd.Circle(svg).cx(100).cy(100);
let math = sd.Mathjax(svg).height(100).math("\\infty").drag(true);//.height(100)

main();

async function main() {
    await sd.pause();
    math.startAnimate().math("1").endAnimate();
}