import * as sd from "#lib/slide";

let svg = sd.svg();
let math = sd.Mathjax(svg);
math.math("i\\cdot k+r=P\\ (mod\\ P)");//.drag(true).resizeable(true);
// math.math("\\frac a b = S(x)");

main();

async function main() {
    await sd.pause();
    math.startAnimate();
    math.math("i \\cdot k + r\\equiv 0\\ (mod\\ P)");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("r\\equiv -i\\cdot k\\ (mod\\ P)")
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("r\\cdot inv_r\\cdot inv_i\\equiv -i\\cdot k\\cdot inv_r\\cdot inv_i\\ (mod\\ P)");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("inv_i\\equiv -k\\cdot inv_r\\ (mod\\ P)");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("inv_i\\equiv -\\lfloor \\frac P i\\rfloor inv_{P\\%i}\\ (mod\\ P)");
    math.endAnimate();
}