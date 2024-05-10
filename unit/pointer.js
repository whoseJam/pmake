import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).x(100).y(100).resize(10);
let p = sd.Pointer(arr, "Pointer", "b");

main();

async function main() {
    for (let i = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
    }
    await sd.pause(true);
}