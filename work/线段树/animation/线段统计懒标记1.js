import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).x(10).resize(8);
const data = "01011001";

init();
main();

function init() {
    for (let i = 0; i < data.length; i++) {
        if (data[i] == "1") arr.color(i, C.orange);
    }
}

async function main() {
    await sd.pause();
    arr.startAnimate().color(C.orange).endAnimate();
    await sd.pause();
}