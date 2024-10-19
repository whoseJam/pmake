import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Mathjax(svg, "0").x(100).y(100).fontSize(40);
const rect = sd.Focus(svg).focus(math);

sd.main(async () => {
    await sd.pause();
    const v = new sd.Vertex(svg).center(600, 100);
    const m = sd.Aside(v, new sd.Mathjax(svg, "\\frac a b+3"), "lc");
    rect.focus(m);

    await sd.pause();
    math.startAnimate().width(30).endAnimate();
    for (let i = 1; i <= 9; i++) {
        await sd.pause();
        math.startAnimate().replaceMath(String(i)).endAnimate();
    }

    await sd.pause();
    const a = new sd.Mathjax(svg, "\\frac a b").fontSize(40).x(100).y(200);
    await sd.pause();
    a.startAnimate().replaceMath("\\frac c d").endAnimate();
    // await sd.pause();
})
