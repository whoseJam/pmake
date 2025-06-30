import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestGridDp);

async function TestGridDp() {
    const n = 5;
    const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
    grid.forEachElement((element, i, j) => element.value(i === 1 && j === 1 ? 1 : 0));
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (i === 1 && j === 1) continue;
            await sd.pause();
            const d1 = i > 1 ? grid.intValue(i - 1, j) : 0;
            const d2 = j > 1 ? grid.intValue(i, j - 1) : 0;
            grid.startAnimate()
                .text(i, j, d1 + d2)
                .endAnimate();
        }
    }
}

async function TestSubtext() {
    const text = new sd.Text(svg).fontSize(100).text("abcabcabc");
    await sd.pause();
    text.startAnimate().subtextColor("bc", C.red).fontSize(180).endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("c", C.textBlue).x(100).endAnimate();
}

async function TestSpaceAndEnter() {
    const text = new sd.Text(svg).fontSize(100).text("a a a");
    const path = new sd.Path(svg).d(`M105 67L105 67Q105 73 103 78Q101 83 98 86Q95 89 91 91Q86 93 81 93L81 93Q76 93 72 92Q67 91 63 89L63 89L63 23L71 23L71 42L71 51Q75 46 79 44Q83 42 88 42L88 42Q92 42 95 44Q98 46 100 49Q103 52 104 57Q105 61 105 67ZM96 67L96 67Q96 63 95 60Q95 57 94 55Q92 52 91 51Q89 50 86 50L86 50Q84 50 83 50Q81 51 79 52Q77 53 76 55Q74 57 71 60L71 60L71 84Q74 85 76 85Q79 86 81 86L81 86Q84 86 87 85Q90 84 92 82Q94 80 95 76Q96 73 96 67Z`);
    await sd.pause();
    text.startAnimate().text(" b b ").endAnimate();
}

async function Test() {
    const text = new sd.Text(svg).fontSize(180).text("0").cx(100).y(100);
    const rect = new sd.Rect(svg)
        .fillOpacity(0)
        .x(text.x())
        .y(text.y())
        .width(text.width() + 2)
        .height(text.height());
    await sd.pause();
    text.startAnimate().text("10").fontSize(100).cx(100).endAnimate();
    rect.x(text.x())
        .y(text.y())
        .width(text.width() + 2)
        .height(text.height());
}

async function TestTextTransform() {
    const text = new sd.Text(svg).fontSize(180).text("hellg").x(100).y(100); //.fill("#ff00ff");
    await sd.pause();
    text.startAnimate().text("w").color(C.purple).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").color(C.textBlue).endAnimate();
    await sd.pause();
    text.startAnimate().text("www").fontSize(100).color(C.darkButtonGrey).endAnimate();
    await sd.pause();
    text.startAnimate().text("hello").endAnimate();
    await sd.pause();
    text.startAnimate().text("H").endAnimate().startAnimate().text("W").endAnimate();
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
