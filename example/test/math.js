import * as sd from "#lib/slide";

let svg = sd.svg();
let math = sd.Mathjax(svg);
math.math("\\frac A B").drag(true).resizeable(true);
// math.math("\\frac a b = S(x)");

main();

async function main() {
    await sd.pause();
    math.startAnimate();
    // math.math("a+c");
    math.dx(100).dy(100);
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("a_1+a_2+...+a_{n-1}=A-a_n")
    math.endAnimate();

    await sd.pause();
    math.startAnimate();
    math.math("a_1+a_2=A-a_n-a_{n-1}-...-a_3");
    math.endAnimate();
}