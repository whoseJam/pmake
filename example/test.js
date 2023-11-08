import * as sd from "#lib/slide";

let svg = sd.svg();
let arr = sd.Array(svg).resize(10).indexed(true).drag(true).resizeable(true);

main();

async function main() {
    await sd.pause();
    arr.startAnimate().indexAlign("bottom").endAnimate();
    await sd.pause();
    arr.startAnimate().indexAlign("left").endAnimate();
    await sd.pause();
    arr.startAnimate().indexAlign("top").endAnimate();
    await sd.pause();
    arr.startAnimate().push(1).push(2).endAnimate();
    await sd.pause();
    arr.startAnimate().erase(1).erase(2).endAnimate();
}