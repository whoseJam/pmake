import * as sd from "#lib/slide";

let svg = sd.svg();

let txt1 = sd.Text(svg, "Hello");
let txt2 = sd.Text(svg, "World");
let arr = sd.BarArray(svg).drag(true).resizeable(true);
// let arr2 = sd.Pile(svg).drag(true).resizeable(true);
// txt1.x(100).y(200).fontSize(30);
// txt2.x(400).y(200).fontSize(40);
arr.x(300).y(500);
// arr2.x(500).y(200);


main();

async function main() {
    await sd.pause();
    arr.startAnimate().push(1).endAnimate();
    arr.startAnimate().push(2).endAnimate();
    arr.startAnimate().push(3).endAnimate();
    arr.startAnimate().push(3).endAnimate();
    arr.startAnimate().push(2).endAnimate();
    arr.startAnimate().push(1).endAnimate();
    arr.startAnimate().push(1).endAnimate();
    arr.startAnimate().push(2).endAnimate();
} 