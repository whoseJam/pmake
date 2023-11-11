import * as sd from "#lib/slide";

let svg = sd.svg();

let txt1 = sd.Text(svg, "Hello");
let txt2 = sd.Text(svg, "World");
let box = sd.Box(svg).drag(true).resizeable(true);
txt1.x(100).y(200).fontSize(30);
txt2.x(400).y(200).fontSize(40);
box.x(300).y(100);

main();

async function main() {
    await sd.pause();
    box.startAnimate().fromExisted().value(txt1).endAnimate();
    await sd.pause();
    box.startAnimate().fromExisted().preventRemove().value(txt2).endAnimate();
    await sd.pause();
}