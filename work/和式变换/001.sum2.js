import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let math1 = sd.Mathjax(svg).x(100).y(50).height(100);
let math2 = sd.Mathjax(svg).x(100).y(180).height(100);

main();

async function main() {
    await sd.pause();
    math1.math(`\\sum_{i=1}^n i`);
    await sd.pause();
    math1.startAnimate();
    math1.math(`\\sum_{i=1}^n i=\\frac {(1+n)\\cdot n} 2`);
    math1.endAnimate();
    await sd.pause();
    math2.math(`\\sum_{i=1}^n i^2`);
    await sd.pause();
    
    let m = sd.Mathjax(svg);
    m.x(700).y(50).math(`((n+1)^3-n^3)`);
    await sd.pause();
    m.startAnimate().math(`((n+1)^3-n^3)=n^3+3n^2+3n+1-n^3`).endAnimate();
    await sd.pause();
    m.startAnimate().math(`((n+1)^3-n^3)=3n^2+3n+1`).endAnimate();

    let ms = [];
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        m.startAnimate().math(`((${i}+1)^3-${i}^3)=3\\cdot ${i}^2+3\\cdot ${i}+1`).endAnimate();
        await sd.pause();
        let m0 = sd.Mathjax(svg).math(`((${i}+1)^3-${i}^3)=3\\cdot ${i}^2+3\\cdot ${i}+1`);
        m0.x(700).y(50);
        m0.startAnimate();
        m0.x(700).y(50 + i * 50);
        m0.endAnimate();
        ms.push(m0);
    }
    await sd.pause();
    sd.Mathjax(svg).math("...").x(700).y(250).height(20);
    await sd.pause();
    m.startAnimate().math(`((n+1)^3-n^3)=3n^2+3n+1`).endAnimate();
    await sd.pause();
    let m0 = sd.Mathjax(svg).math(`((n+1)^3-n^3)=3n^2+3n+1`);
    m0.x(700).y(50);
    m0.startAnimate();
    m0.x(700).y(300);
    m0.endAnimate();
    for (let i = 0; i < ms.length; i++) {
        await sd.pause();
        ms[i].startAnimate().math(`(${i+1}^3-${i}^3)=3\\cdot ${i}^2+3\\cdot ${i+1}`).endAnimate();
    }
}