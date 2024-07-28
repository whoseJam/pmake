import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const arr1 = new sd.Array(svg).x(100);
const arr2 = new sd.Array(svg).x(100).y(80);
const arr3 = new sd.Array(svg).x(100).y(160);

init();
main();

function init() {
    for (let i = 1; i <= n; i++) {
        arr1.push(sd.rand(1, 5));
        arr2.push(sd.rand(1, 5));
    }
    sd.Label(arr1, "A");
    sd.Label(arr2, "B");
}

async function main() {
    await sd.pause();
    sd.Label(arr3, "序列加法后");
    for (let i = 0; i < n; i++) {
        arr3.startAnimate().push(
            arr1.intValue(i) + 
            arr2.intValue(i)
        ).endAnimate();
    }
    await sd.pause();
}