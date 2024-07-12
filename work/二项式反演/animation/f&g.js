import * as sd from "@/sd";

const svg = sd.svg();

const boxF = new sd.Box(svg).value(new sd.Mathjax(svg, "f(x)")).width(80);
const boxG = new sd.Box(svg).value(new sd.Mathjax(svg, "g(x)")).width(80);
boxF.strokeOpacity(0);
boxG.strokeOpacity(0);

boxF.cx(200).cy(200);
boxG.cx(600).cy(200);

main();

async function main() {
    let m1, m2;
    await sd.pause();
    const l1 = sd.Link(boxG, boxF, sd.Curve).startAnimate().pointStoT().endAnimate().arrow();
    l1.startAnimate().value(m1 = new sd.Mathjax(l1, "f(x)=\\sum_{i}A(x,i)g(i)")).endAnimate();
    await sd.pause();
    const l2 = sd.Link(boxF, boxG, sd.Curve).startAnimate().pointStoT().endAnimate().arrow();
    l2.startAnimate().value(m2 = new sd.Mathjax(l2, "g(x)=\\sum_{i}B(x,i)f(i)")).endAnimate();
    await sd.pause();
    const f1 = sd.Focus(m1).startAnimate().focus().endAnimate();
    const f2 = sd.Focus(m2).startAnimate().focus().endAnimate();
    await sd.pause();
    sd.Link(f1, f2).opacity(0).startAnimate().opacity(1).endAnimate().doubleArrow();
    await sd.pause();
}