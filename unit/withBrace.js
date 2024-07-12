import * as sd from "@/sd";

const svg = sd.svg();

const arr = sd.WithBrace(new sd.Array(svg).resize(10).cx(600).cy(300).start(1));
const stk = sd.WithBrace(new sd.Stack(svg).resize(10).x(100).y(100).start(1));

const b1 = arr.brace(1, 4, "b").label("Hello");
const b2 = arr.brace(2, 8, "t").label("World");

const b3 = stk.brace(1, 5, "l").label("A");
const b4 = stk.brace(6, 10, "r").label("B");

main();

async function main() {
    await sd.pause();
    b1.startAnimate().label("hELLO").endAnimate();
    await sd.pause();
    b1.startAnimate().gap(20).endAnimate();
    await sd.pause();
}