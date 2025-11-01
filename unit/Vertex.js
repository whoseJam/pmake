import * as sd from "@/sd";

const svg = sd.svg();
const V = sd.vec();
const C = sd.color();

sd.main(TestEmptyStringAsValue);

async function TestEmptyStringAsValue() {
    const vertex = new sd.Vertex(svg).cx(300).cy(100);
    await sd.pause();
    vertex.startAnimate().value("").endAnimate();
    await sd.pause();
    vertex.startAnimate().text("A").endAnimate();
    await sd.pause();
    vertex.startAnimate().text("B").endAnimate();
    await sd.pause();
    vertex.startAnimate().text("").endAnimate();
}

async function TestInRange() {
    const vertex = new sd.Vertex(svg).cx(300).cy(300).r(50);
    for (let i = 0; i < 10; i++) {
        const pos = V.add(vertex.center(), V.numberMul([10, 10], i));
        const circle = new sd.Circle(svg).r(3).center(pos);
        if (vertex.inRange(pos)) circle.color(C.red);
        else circle.color(C.green);
    }
}

async function TestValue() {
    const v1 = new sd.Vertex(svg, "A").x(100).y(100);
    const v2 = new sd.Vertex(svg, "B").x(100).y(200);
    const v3 = new sd.Vertex(svg, "C").x(100).y(300);
    await sd.pause();
    v1.startAnimate().value("B").endAnimate();
    v2.startAnimate().value(null).endAnimate();
    v3.startAnimate().value(undefined).endAnimate();
}

async function TestPositionAndSize() {
    const vertex = new sd.Vertex(svg, "H").x(100).y(100);
    await sd.pause();
    vertex.startAnimate().x(200).y(200).endAnimate();
    await sd.pause();
    vertex.startAnimate().width(80).height(80).endAnimate();
}
