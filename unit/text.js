import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestTextTransform);

async function TestTextTransform() {
    const text = new sd.Text(svg).fontSize(180).text("hellg").x(100).y(100); //.fill("#ff00ff");
    // const rect = new sd.Rect(svg).fillOpacity(0).clickable(false);
    // rect.x(text.x()).y(text.y()).width(text.width()).height(text.height());
    // console.log("rect.my=", rect.my());
    await sd.pause();
    text.startAnimate().text("world").color(C.purple).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").color(C.textBlue).endAnimate();
    await sd.pause();
    text.startAnimate().text("world").fontSize(100).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").endAnimate();
}

async function TestBasic() {
    const board = new sd.Text(svg);
    const r = new sd.Rect(svg).fillOpacity(0);
    const obj = new sd.Text(svg, "Hello").x(100).y(100).fontSize(30);
    r.x(obj.x()).y(obj.y()).width(obj.width()).height(obj.height());
    function test(code) {
        board.text(code);
        eval(code);
        r.x(obj.x()).y(obj.y());
        r.width(obj.width());
        r.height(obj.height());
    }
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
}
