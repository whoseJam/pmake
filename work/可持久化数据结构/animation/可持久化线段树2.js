import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).x(100).y(100).elementWidth(60);
const data = [1, 5, 3, 4, 2];

init();
main();

function init() {
    data.forEach((item, idx) => {
        arr.push(item);
        const e = arr.lastElement();
        const math = new sd.Mathjax(e, `insert(${item})`).opacity(0);
        e.childAs("math", math, R.Aside((idx % 2 === 0) ? "tc" : "bc"));
    })
}

async function main() {
    for (let i = 0; i < arr.length(); i++) {
        await sd.pause();
        const math = arr.element(i).child("math");
        math.startAnimate().opacity(1).endAnimate();
    }
    await sd.pause();
    arr.startAnimate().color(1, 3, C.green).endAnimate();
    await sd.pause();
}