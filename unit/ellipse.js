import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();

sd.main(TestEllipseHTML);

async function TestEllipseHTML() {
    const e = new sd.EllipseHTML(div).cx(600).cy(300);
    await sd.pause();
    e.startAnimate().width(60).endAnimate();
}

async function TestBasic() {
    const e = new sd.Ellipse(svg).cx(600).cy(300);
    await sd.pause();
    e.startAnimate().width(60).endAnimate();
    // ev.startAnimate().width(60).endAnimate();
    await sd.pause();
}
