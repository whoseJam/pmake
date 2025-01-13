import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let board = new sd.Text(svg);
let r = new sd.Rect(svg).fillOpacity(0);
let obj = new sd.Text(svg, "Hello").cx(600).cy(300).fontSize(40);
r.x(obj.x()).y(obj.y()).width(obj.width()).height(obj.height());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    test(`obj.startAnimate().x(100).y(100).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().color(C.BLUE).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().opacity(0.5).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().opacity(1).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeOpacity(1).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeWidth(3).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeWidth(1).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeDashArray([5, 5]).endAnimate();`);
    await sd.pause();
    test(`obj.startAnimate().strokeDashArray([5, 0]).endAnimate();`);
    await sd.pause();
});

function test(code) {
    board.text(code);
    eval(code);
    r.x(obj.x()).y(obj.y());
    r.width(obj.width());
    r.height(obj.height());
}
