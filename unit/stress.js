import * as sd from "@/SD";

let svg = sd.svg();
// let text = new sd.Text(svg, "Hello World").x(100).y(100);
let latex = new sd.Mathjax(svg, "A^2+B^2=C^2").cx(600).cy(300);
// text = sd.Stress(text);
latex = sd.Stress(latex);

main();

async function main() {
    // await sd.pause();
    // text.startAnimate().stress().endAnimate();
    await sd.pause();
    let width = latex.width();
    latex.startAnimate(1000).stress(2).endAnimate();
    await sd.pause();
}