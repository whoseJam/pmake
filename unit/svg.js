import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const s = new sd.Svg(svg);
const rect = new sd.Rect(s).color(C.red);

main();

async function main() {
    await sd.pause();
    console.log("set viewBox = ", s);
    s.startAnimate().viewBox(-5, -5, 100, 100).endAnimate();
    await sd.pause();
}