import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let board = new sd.Text(svg);
let obj = new sd.Box(svg).value(new sd.Circle(svg).color(C.BLUE)).cx(600).cy(300);
let value;

main();

function test(code) {
    board.text(code);
    eval(code);
}

async function main() {
    await sd.pause();
    test(`obj.startAnimate().x(100).y(100).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().width(80).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().value(null).endAnimate();`);
    await sd.pause();
    value = new sd.Rect(svg).cx(600).cy(300);
    await sd.pause();
    test(`obj.startAnimate().value(value).endAnimate()`);
    await sd.pause();
}