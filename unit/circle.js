import * as sd from "../lib/slide";

let svg = sd.svg();
let C = sd.color();
let board = new sd.Text(svg);
let obj = new sd.Circle(svg).cx(600).cy(300);

main();

function test(code) {
    board.text(code);
    eval(code);
}

async function main() {
    await sd.pause();
    obj.startAnimate().r(50).cx(600).cy(300).endAnimate();
    await sd.pause();
    test(`obj.startAnimate().x(100).y(100).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().r(40).x(100).y(100).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().color(C.BLUE).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().opacity(0.5).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().opacity(1).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeWidth(3).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeWidth(1).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeDashArray([5, 5]).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeDashArray([5, 0]).endAnimate();`);
    await sd.pause();
}