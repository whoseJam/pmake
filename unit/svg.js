import * as sd from "@/SD";

let svg = sd.svg();
let C = sd.color();
let s = new sd.Svg(svg);
let r = new sd.Rect(s).color(C.red);

main();

async function main() {
    await sd.pause();
    s.startAnimate().viewBox(-5, -5, 100, 100).endAnimate();
    await sd.pause();
}