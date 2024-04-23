import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let l = new sd.Curve(svg).opacity(0);

main();

async function main() {
    await sd.pause();
    l.opacity(1).source(100, 100).target(300, 200);
    l.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
}
