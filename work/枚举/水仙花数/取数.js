import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 456;
const text = new sd.Mathjax(svg, n).x(25);
const sum = new sd.ValueArray(svg).y(30).align("my").elementWidth(60);

sd.init(() => {});

sd.main(async () => {
    let current = n;
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        const v = current % 10;
        text.startAnimate().subtextColor(v, C.red).endAnimate();
        await sd.pause();
        sum.push(new sd.Mathjax(svg));
        sum.lastElement()
            .startAnimate()
            .text(`${v}`, [[text, v, v]])
            .endAnimate();
        await sd.pause();
        current = Math.floor(current / 10);
        text.startAnimate().text(current, { current: current }).endAnimate();
    }
    await sd.pause();
    for (let i = 1; i < sum.length(); i++) {
        const x1 = sum.element(i - 1).mx();
        const x2 = sum.element(i).x();
        new sd.Mathjax(svg, "+")
            .cx((x1 + x2) / 2)
            .my(sum.my())
            .opacity(0)
            .startAnimate()
            .opacity(1);
    }
    sum.forEachElement(element => {
        element.startAnimate().text(`${element.text()}^3`).endAnimate();
    });
});
