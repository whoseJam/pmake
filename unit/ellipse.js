import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

sd.main(TestEllipseHTMLAndSVG);

async function TestEllipseHTMLAndSVG() {
    const e1 = new sd.Ellipse(div).cx(600).cy(300);
    const e2 = new sd.Ellipse(svg).cx(700).cy(300);
    await sd.pause();
    e1.startAnimate().width(60).cx(600).endAnimate();
    e2.startAnimate().width(60).endAnimate();
}

async function TestBasic() {
    const e = new sd.Ellipse(svg).cx(600).cy(300);
    await sd.pause();
    e.startAnimate().width(60).endAnimate();
    // ev.startAnimate().width(60).endAnimate();
    await sd.pause();
}
