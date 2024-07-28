import * as sd from "@/sd";

const svg = sd.svg();
const n = 8;
const arr = new sd.Array(svg).x(100).y(100).start(1).elementWidth(60);

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Mathjax(arr, `a_${i}`));
    }
}

async function main() {
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= n; i++) {
        arr.value(i, new sd.Mathjax(arr, `a_${i}+d`));
    }
    arr.endAnimate();
    await sd.pause();
}