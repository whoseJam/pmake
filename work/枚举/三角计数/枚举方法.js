import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const grid = new sd.Grid(svg).n(5).m(5);
const rect = new sd.Line(svg).opacity(0).target(40, 0);
rect.childAs(new sd.Circle(rect).color(C.black).r(3), R.pointAtPathByRate(0));
rect.childAs(new sd.Circle(rect).color(C.black).r(3), R.pointAtPathByRate(1));

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(grid, "y", "r").startAnimate().moveTo(3, 0).endAnimate();
    rect.width(5 * 40 - 40)
        .x(grid.x() + 20)
        .cy(grid.element(3, 0).cy())
        .startAnimate()
        .opacity(1)
        .endAnimate();
    await sd.pause();
    sd.Pointer(grid, "l", "t").startAnimate().moveTo(4, 1).endAnimate();
    sd.Pointer(grid, "r", "t").startAnimate().moveTo(4, 3).endAnimate();
    rect.startAnimate()
        .x(grid.element(4, 1).cx())
        .width(3 * 40 - 40)
        .endAnimate();
    await sd.pause();
    grid.startAnimate();
    colorColumn(1, C.yellow);
    colorColumn(3, C.yellow);
    grid.endAnimate();
});

function colorColumn(c, color) {
    for (let i = 0; i < grid.n(); i++) grid.color(i, c, color);
}
