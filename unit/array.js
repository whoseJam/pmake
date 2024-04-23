import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).x(100).y(100);

main();

async function main() {
    arr.push(1).push(2).push(3).update();
    await sd.pause();
    arr.startAnimate().insert(4, "+1").insert(1, "+2").endAnimate();
    await sd.pause();
}