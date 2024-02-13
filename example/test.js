import * as sd from "../lib/slide";

let svg = sd.svg();
let lk = new sd.Rect(svg);//.push(1).push(2).push(3);

main();

async function main() {
    await sd.pause();
    console.log("---------------------------");
    lk.startAnimate(1000).y(100).endAnimate();
    lk.after(500).startAnimate(1000).y(0).endAnimate();
    await sd.pause();
}
