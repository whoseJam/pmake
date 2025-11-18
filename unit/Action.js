import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const D = sd.device();
const r = new sd.Rect(svg).width(100).cx(600).cy(300);
const ir = new sd.Rect(svg);
r.childAs("newRect", ir, R.centerOnly());

main();

async function main() {
    await sd.pause();
    r.startAnimate()
    r.width(200).cx(600).cy(400);
    r.endAnimate()
}