import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const a1 = new sd.Array(svg).resize(16).color(C.blue);
const a2 = new sd.Array(svg).x(40 * 1).resize(5).color(C.green);
const a3 = new sd.Array(svg).x(40 * 3).resize(2).color(C.red);
const a4 = new sd.Array(svg).x(40 * 8).resize(6).color(C.orange);
const a5 = new sd.Array(svg).x(40 * 9).resize(2).color(C.red);
const a6 = new sd.Array(svg).x(40 * 12).resize(1).color(C.purple);
const arr = new sd.Array(svg).resize(16);
arr.color(0, 15, C.blue);
arr.color(1, 5, C.green);
arr.color(3, 4, C.red);
arr.color(8, 13, C.orange);
arr.color(9, 10, C.red);
arr.color(12, 12, C.purple);

main();

async function main() {
    await sd.pause();
    a6.startAnimate().dy(100).endAnimate();
    a5.startAnimate().dy(100).endAnimate();
    a4.startAnimate().dy(140).endAnimate();
    a3.startAnimate().dy(100).endAnimate();
    a2.startAnimate().dy(140).endAnimate();
    a1.startAnimate().dy(180).endAnimate();
    await sd.pause();
}