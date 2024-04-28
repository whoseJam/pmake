import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).x(100).y(100);

main();

async function main() {
    arr.push(1).push(2).push(3);
    await sd.pause();
    arr.startAnimate()
    arr.insert(1, "+2");
    arr.insert(4, "+1");
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate().x(500).endAnimate();
    await sd.pause();
}