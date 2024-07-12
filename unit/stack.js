import * as sd from "@/sd";

let svg = sd.svg();
let arr = new sd.Stack(svg).x(100).y(100);

main();

async function main() {
    arr.push(1).push(2).push(3);
    await sd.pause();
    arr.startAnimate()
    arr.insert(1, "+2");
    arr.insert(4, "+1");
    arr.endAnimate();
    arr.startAnimate();
    arr.insert(3, "inf");
    arr.endAnimate();
    await sd.pause();
    arr.startAnimate(500).erase(2).endAnimate();
    arr.startAnimate(500).erase(3).endAnimate();
    await sd.pause();
}