import * as sd from "#lib/slide";

let svg = sd.svg();
let math = sd.Mathjax(svg);
math.math("a+b=c").drag(true);


main();

async function main() {
    await sd.pause();
    math.startAnimate();
    math.math("a=c-b");
    math.endAnimate();
}