import * as sd from "../lib/slide";

let svg = sd.svg();
let arr = new sd.Array(svg).x(100).y(100);
let Arr = new sd.Array(svg).x(100).y(200);

main();

async function main() {
    arr.push(1).push(2).push(3).push(4);
    // await sd.pause();
    // arr.startAnimate()
    // arr.insert(1, "+2");
    // arr.insert(4, "+1");
    // arr.endAnimate();
    // arr.startAnimate();
    // arr.insert(3, "inf");
    // arr.endAnimate();
    // await sd.pause();
    // arr.startAnimate(500).erase(2).endAnimate();
    // arr.startAnimate(500).erase(3).endAnimate();
    await sd.pause();
    let value = arr.value(0);
    // arr.element(0).drop();
    // await sd.pause();
    arr.startAnimate().erase(0).endAnimate();
    value.attachTo(svg);
    Arr.startAnimate().pushFromExistValue(value).endAnimate();
    await sd.pause();
}