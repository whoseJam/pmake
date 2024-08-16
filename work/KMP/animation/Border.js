import * as sd from "@/sd";

const svg = sd.svg();
const arr = sd.WithBrace(new sd.Array(svg).pushArray("abababa").start(1));

const rangeF = arr.brace(1, 1, "t");
const rangeB = arr.brace(7, 7, "b");

main();

async function main() {
    await getBorder(3);
    await getBorder(5);
}

async function getBorder(len) {
    await sd.pause();
    rangeF.startAnimate().brace(1, len).endAnimate();
    rangeB.startAnimate().brace(arr.length() - len + 1, arr.length()).endAnimate();
}