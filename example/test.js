import * as sd from "../lib/slide";

let svg = sd.svg();
let lk = new sd.Array(svg).push(1).push(2).push(3);
let r = new sd.Rect(svg).width(5).height(5).cx(100).cy(100);

main();

async function main() {
    await sd.pause();
    lk.startAnimate().cx(100).cy(100).endAnimate();
    await sd.pause();
}
