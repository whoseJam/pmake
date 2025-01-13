import * as sd from "@/sd";

const svg = sd.svg();

const e = new sd.Ellipse(svg).cx(600).cy(300);
// const ev = new sd.EllipseVertex(svg).cx(600).cy(400);

main();

async function main() {
    await sd.pause();
    e.startAnimate().width(60).endAnimate();
    // ev.startAnimate().width(60).endAnimate();
    await sd.pause();
}
