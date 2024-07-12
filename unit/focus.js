import * as sd from "@/sd";

let svg = sd.svg();
let arr = new sd.Array(svg).x(100).y(100).resize(10);
let f = sd.Focus(arr);

main();

async function main() {
    for (let i = arr.start(); i <= arr.end(); i++) {
        await sd.pause();
        f.startAnimate().focus(i).endAnimate();
    }
}