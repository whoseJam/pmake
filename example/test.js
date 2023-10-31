import * as sd from "#lib/slide";

let svg = sd.svg();
let math = sd.Mathjax(svg);
math.math("").height(50).drag(true);


main();

async function main() {
    await sd.pause();
    math.startAnimate();
    math.math("\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log\\frac {p(x,y)}{p(x)p(y)}");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log\\frac {p(y)p(x|y)}{p(x)p(y)}");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log\\frac {p(x|y)}{p(x)}");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log[p(x|y)]-\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log[p(x)]");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("-\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log[p(x)]-(-\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log[p(x|y)])")
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("-\\sum_{x\\in R(X)}p(x)log[p(x)]-(-\\sum_{x\\in R(X)}\\sum_{y\\in R(Y)}p(x,y)log[p(x|y)])");
    math.endAnimate();
    await sd.pause();
    math.startAnimate();
    math.math("H(X)-H(X|Y)");
    math.endAnimate();
}