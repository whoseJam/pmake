import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const s = new sd.Svg(svg);
new sd.Rect(s).color(C.red);

main();

async function main() {
    await sd.pause();
    s.startAnimate().viewBox(-5, -5, 100, 100).endAnimate();
    await sd.pause();
}