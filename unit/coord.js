import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestDemo);

async function TestDemo() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate();
    const line = coord.drawLine([1, 1], [2, 1]);
    const ray = coord.drawRay([2, 1], [2, 1]).arrow();
    ray.childAs(new sd.Circle(ray).color(C.black).r(3), (parent, child) => child.center(parent.at(0)));
    const rect = coord.drawRect(2, 5, 4, 3);
    const circle = coord.drawCircle(5, 6);
    const func = coord.drawFunction(x => Math.pow(x + 0.01, 1.5));
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("x").ticks([-2, 7, 1]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("x").ticks([1, 10, 2]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.raySampleCount(ray, 20);
    coord.lineSampleCount(line, 20);
    coord.axis("y").ticks(sd.BaseAxis.log2(1, 10));
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("y").tickLength(20).tickAlign("source");
    coord
        .axis("x")
        .tickLabelFormat(i => `${i}year`)
        .fontSize(10);
    coord.endAnimate();
}

async function TestRay() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate();
    const ray = coord.drawRay([3, 4], [1, 2]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate().rayDirection(ray, [-1, 1]).endAnimate();
    await sd.pause();
    coord.startAnimate().rayPosition(ray, [10, -3]).endAnimate();
}

async function TestLine() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate();
    const line = coord.drawLine([1, 2], [1, 1]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("y").ticks([1, 3, 1]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.lineDirection(line, [1, -1]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate().lineDirection(line, [0, 1]).endAnimate();
    await sd.pause();
    coord.startAnimate().lineDirection(line, [1, 0]).endAnimate();
}

async function TestFunction() {
    const coord = new sd.Coord(svg).x(100).y(100);
    coord.axis("x").ticks([-2, 7, 1]);
    const func0 = coord.drawFunction(x => Math.pow(x + 0.01, 1.5));
    await sd.pause();
    coord.startAnimate();
    const func = coord.drawFunction(x => -x);
    coord.endAnimate();
    await sd.pause();
    coord
        .startAnimate()
        .function(func, x => x * x)
        .endAnimate();
    await sd.pause();
    coord.startAnimate().functionSampleCount(func, 50).endAnimate();
    await sd.pause();
    coord.startAnimate().function(func, x => Math.log2(x));
    await sd.pause();
    coord.startAnimate();
    coord.axis("y").ticks(5);
    coord.axis("x").ticks([-5, 5, 1]);
    coord.endAnimate();
}

async function TestBasic() {
    const coord = new sd.Coord(svg).x(100).y(100);
    await sd.pause();
    coord.startAnimate().drawCircle(3, 2).endAnimate();
    await sd.pause();
    coord.startAnimate().drawRect(4, 3, 4, 5).endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("x").ticks([-1, 8, 1]);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.axis("x").ticks([-1, 8, 2]);
    coord.endAnimate();
}
