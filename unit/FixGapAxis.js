import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestTickLabelTransform);

async function TestSourceAndLength() {
    const axis = new sd.FixGapAxis(svg).source(100, 100).gap(40).ticks(5);
    await sd.pause();
    axis.startAnimate().source(200, 150).endAnimate();
    await sd.pause();
    axis.startAnimate().gap(80).endAnimate();
    await sd.pause();
    axis.startAnimate().source(300, 300).gap(60).endAnimate();
    await sd.pause();
    axis.startAnimate().sx(150).sy(200).endAnimate();
    await sd.pause();
    new sd.Circle(svg).r(5).center(axis.source()).color(C.green).startAnimate().appear().endAnimate();
    new sd.Circle(svg).r(5).center(axis.target()).color(C.red).startAnimate().appear().endAnimate();
}

async function TestDirection() {
    const axis = new sd.FixGapAxis(svg).x(300).y(300).gap(40).ticks(5);
    await sd.pause();
    axis.startAnimate().direction("vertical").endAnimate();
    await sd.pause();
    axis.startAnimate().direction("horizontal").endAnimate();
    await sd.pause();
    axis.startAnimate().direction([1, -1]).endAnimate();
    await sd.pause();
    axis.startAnimate().direction([-1, 1]).endAnimate();
    await sd.pause();
    axis.startAnimate().direction([0.6, 0.8]).endAnimate();
    await sd.pause();
    axis.startAnimate().direction([-0.8, -0.6]).endAnimate();
    await sd.pause();
    new sd.Circle(svg).r(5).center(axis.source()).color(C.blue).startAnimate().appear().endAnimate();
}

async function TestTick() {
    const axis = new sd.FixGapAxis(svg).x(100).y(200).gap(40).ticks(10).withTick(true);
    await sd.pause();
    axis.startAnimate().tickLength(15).endAnimate();
    await sd.pause();
    axis.startAnimate().tickLength(30).endAnimate();
    await sd.pause();
    axis.startAnimate().tickAlign("source").endAnimate();
    await sd.pause();
    axis.startAnimate().tickAlign("target").endAnimate();
    await sd.pause();
    axis.startAnimate().tickAlign("center").endAnimate();
    await sd.pause();
    axis.startAnimate().withTick(false).endAnimate();
    await sd.pause();
    axis.startAnimate().withTick(true).endAnimate();
}

async function TestTickLabel() {
    const axis = new sd.FixGapAxis(svg).x(100).y(200).gap(40).ticks(10).withTick(true).withTickLabel(true);
    await sd.pause();
    axis.startAnimate().fontSize(12).endAnimate();
    await sd.pause();
    axis.startAnimate().fontSize(24).endAnimate();
    await sd.pause();
    axis.startAnimate().fontSize(32).endAnimate();
    await sd.pause();
    axis.startAnimate().fontSize(10).endAnimate();
    await sd.pause();
    axis.startAnimate().tickLabelAlign("target").endAnimate();
    await sd.pause();
    axis.startAnimate().tickLabelAlign("source").endAnimate();
}

async function TestTickLabelTransform() {
    const axis = new sd.FixGapAxis(svg).x(100).y(200).gap(50).ticks(5).withTick(true).withTickLabel(true).fontSize(16);
    await sd.pause();
    axis.startAnimate().ticks(10).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks(20).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks(3).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks([0, 100, 10]).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks([0, 100, 25]).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks(sd.BaseAxis.log2(1, 16)).endAnimate();
    await sd.pause();
    axis.startAnimate().ticks(8).endAnimate();
    await sd.pause();
    axis.startAnimate()
        .tickLabelFormat(i => `${i}px`)
        .endAnimate();
}
