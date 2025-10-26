import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.main(TestBasic);

async function TestBasic() {
    // new sd.Circle(svg).cx(100).cy(100);
    const e = new sd.Ellipse(svg).cx(600).cy(300);
    await sd.pause();
    e.startAnimate().width(60).endAnimate();
    // ev.startAnimate().width(60).endAnimate();
    await sd.pause();
}
