import * as sd from "../lib/slide";

let svg = sd.svg();
let r = new sd.Mathjax(svg, "A^2+B^2=C^2").width(100).cx(600).cy(300);

main();

async function main() {
    await sd.pause();
    console.log("--------------start----------------");
    r.startAnimate(600)
    r.endAnimate()
    r.after(0)

    r.startAnimate()
    r.width(200).cx(600);
    r.endAnimate()

    r.startAnimate()
    r.width(100).cx(600);
    r.endAnimate()

    r.after(0)
    r.startAnimate(600);
    await sd.pause();
}