import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

sd.init(() => {});

sd.main(TestRay);

async function TestRay() {
    const coord = new sd.FixGapCoord(svg).x(100).y(100);
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
    const coord = new sd.FixGapCoord(svg).x(100).y(100);
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
    const coord = new sd.FixGapCoord(svg).x(100).y(100);
    coord.axis("x").ticks([-2, 7, 1]);
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
    coord.startAnimate();
    coord.axis("y").ticks(5);
    coord.axis("x").ticks([-5, 5, 1]);
    coord.endAnimate();
}

async function TestRect() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(300).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    const rect = coord.drawRect(2, 2).after(0).color(C.blue).opacity(0.5);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.rectX(rect, 5);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.rectY(rect, 6);
    coord.endAnimate();
}

async function TestCircle() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(300).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    const circle = coord.drawCircle(3, 3).after(0).color(C.red).r(5);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.circleX(circle, 7);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.circleY(circle, 8);
    coord.endAnimate();
}

async function TestCoordTransform() {
    const coord = new sd.FixGapCoord(svg).x(100).y(100).width(300).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    for (let i = 0; i <= 10; i += 2) {
        for (let j = 0; j <= 10; j += 2) {
            coord.drawCircle(i, j).color(C.blue).after(0).r(0).startAnimate().r(5).endAnimate();
        }
    }
    coord.endAnimate();
}

async function TestOrigin() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(300).height(300);
    coord.origin("bl");
    coord.axis("x").ticks([-5, 5, 1]);
    coord.axis("y").ticks([-5, 5, 1]);
    coord.drawCircle(0, 0).color(C.red).r(5);
    await sd.pause();
    coord.startAnimate().origin("c").endAnimate();
    await sd.pause();
    coord.startAnimate().origin("bl").endAnimate();
}

async function TestMultipleElements() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(400).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    const line = coord.drawLine([0, 0], [1, 1]);
    const rect1 = coord.drawRect(1, 1).color(C.blue);
    const rect2 = coord.drawRect(4, 4).color(C.red);
    const circle1 = coord.drawCircle(7, 7).color(C.green);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.rectX(rect1, 3);
    coord.rectY(rect2, 6);
    coord.circleX(circle1, 5);
    coord.lineDirection(line, [1, 0.5]);
    coord.endAnimate();
}

async function TestTicksWithGap() {
    const coord = new sd.FixGapCoord(svg).x(100).y(100).width(300).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate().gap("x", 50).gap("y", 40).endAnimate();
    await sd.pause();
    coord.startAnimate().ticks("x", 5).ticks("y", 7).endAnimate();
}

async function TestOriginWithGap() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(300).height(300);
    coord.origin("bl");
    coord.axis("x").ticks([-5, 5, 1]);
    coord.axis("y").ticks([-5, 5, 1]);
    await sd.pause();
    coord.startAnimate().gap("x", 30).gap("y", 25).endAnimate();
    await sd.pause();
    coord.startAnimate().origin("c").endAnimate();
    await sd.pause();
    coord.startAnimate().origin("bl").gap("x", 40).gap("y", 35).endAnimate();
}

async function TestGapWithShapes() {
    const coord = new sd.FixGapCoord(svg).x(100).y(50).width(400).height(300);
    coord.axis("x").ticks([0, 10, 1]);
    coord.axis("y").ticks([0, 10, 1]);
    await sd.pause();
    coord.startAnimate();
    coord.drawRect(2, 2).color(C.blue);
    coord.drawCircle(5, 5).color(C.red);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate().gap("x", 50).gap("y", 40).endAnimate();
    await sd.pause();
    coord.startAnimate().gap("x", 30).gap("y", 25).endAnimate();
}
