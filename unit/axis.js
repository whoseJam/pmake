import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestTickAttrs);

async function TestWithTickAndWithTickLabel() {
    const axis = new sd.Axis(svg).x(100).y(100).width(600).tickLength(20).withTickLabel(true);
    await sd.pause();
    axis.startAnimate().withTick(false).endAnimate();
    await sd.pause();
    axis.startAnimate().withTick(true).endAnimate();
    await sd.pause();
    axis.startAnimate().withTickLabel(false).endAnimate();
}

async function TestTickLabelFormat() {
    const axis = new sd.Axis(svg).x(100).y(100).width(600);
    await sd.pause();
    axis.startAnimate()
        .tickLabelFormat(i => `${i}$`)
        .endAnimate();
}

async function TestTickAttrs() {
    const axis = new sd.Axis(svg).x(100).y(100).width(300).withTickLabel(true);
    await sd.pause();
    axis.startAnimate().tickLength(20).endAnimate();
    await sd.pause();
    axis.startAnimate().tickAlign("source").endAnimate();
    await sd.pause();
    axis.startAnimate().tickAlign("target").endAnimate();
    await sd.pause();
    axis.startAnimate().tickLabelAlign("target").endAnimate();
    await sd.pause();
    axis.startAnimate().fontSize(10).endAnimate();
}

async function TestForEachTick() {
    const axis = new sd.Axis(svg).x(100).y(100).width(300);
    await sd.pause();
    axis.forEachTick(tick => {
        tick.startAnimate().stroke(C.red).endAnimate();
    });
}

async function TestFixStepTick() {
    const axis = new sd.Axis(svg).x(100).y(100).width(300);
    await sd.pause();
    axis.startAnimate().ticks([2, 10, 4]).endAnimate();
}

async function TestDirection() {
    const axis = new sd.Axis(svg).x(300).y(300).length(200);
    await sd.pause();
    axis.startAnimate().direction("vertical").endAnimate();
    await sd.pause();
    axis.startAnimate().direction([-1, -1]).endAnimate();
    await sd.pause();
    axis.startAnimate().width(200).endAnimate();
    await sd.pause();
    new sd.Circle(svg).center(axis.pos("x", "y")).fillOpacity(0);
}

async function TestBasic() {
    const axis = new sd.Axis(svg).x(100).y(100);
    await sd.pause();
    axis.startAnimate().ticks(5).endAnimate();
    await sd.pause();
    axis.startAnimate().width(200).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks(15).endAnimate();
    await sd.pause();
    const c1 = new sd.Circle(svg).r(3).center(axis.global(14)).color(C.blue);
    const c2 = new sd.Circle(svg).r(3).center(axis.global(5)).color(C.red);
}
