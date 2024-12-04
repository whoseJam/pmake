import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();

sd.init(() => {

})

sd.main(TestIntersectLineWithBox);

async function TestIntersectLineWithBox() {
    const slider = new sd.Slider(svg).min(1).max(500).width(500).x(100).y(100);
    const l1 = new sd.Line(svg).source(200, 200); new sd.Circle(svg).r(5).center(l1.source()).fill(C.black);
    const box = new sd.Rect(svg).x(300).y(250).width(400).height(300);
    const i0 = new sd.Circle(svg).r(5).fill(C.red);
    const i1 = new sd.Circle(svg).r(5).fill(C.red);
    const d1 = V.makeComplex(1, 2 * Math.PI / 5);
    l1.target(V.add(l1.source(), V.numberMul(d1, 300)));
    slider.onChange((value) => {
        l1.target(V.add(l1.source(), V.makeComplex(300, 2 * Math.PI / 500 * value)));
        const [success, p0, p1] = V.intersectLineWithBox(
            l1.source(),
            V.makeComplex(300, 2 * Math.PI / 500 * value),
            box.x(),
            box.y(),
            box.width(),
            box.height());
        if (success) {
            i0.center(p0);
            i1.center(p1);
        }
    });
}

async function TestIntersectLineWithSegment() {
    const slider = new sd.Slider(svg).min(1).max(500).width(500).x(100).y(100);
    const l1 = new sd.Line(svg).source(200, 200); new sd.Circle(svg).r(5).center(l1.source()).fill(C.black);
    const l2 = new sd.Line(svg).source(300, 250); new sd.Circle(svg).r(5).center(l2.source()).fill(C.black);
    const inter = new sd.Circle(svg).r(5).fill(C.red);
    const d1 = V.makeComplex(1, 2 * Math.PI / 5);
    const d2 = V.makeComplex(1, 2 * Math.PI / 3);
    l1.target(V.add(l1.source(), V.numberMul(d1, 300)));
    l2.target(V.add(l2.source(), V.numberMul(d2, 300)));
    slider.onChange((value) => {
        l1.target(V.add(l1.source(), V.makeComplex(300, 2 * Math.PI / 500 * value)));
        const [success, point] = V.intersectLineWithSegment(
            l1.source(),
            V.makeComplex(300, 2 * Math.PI / 500 * value),
            l2.source(),
            l2.target());
        if (success) inter.center(point);
    });
}

async function TestIntersectLineWithShootLine() {
    const slider = new sd.Slider(svg).min(1).max(500).width(500).x(100).y(100);
    const l1 = new sd.Line(svg).source(200, 200); new sd.Circle(svg).r(5).center(l1.source()).fill(C.black);
    const l2 = new sd.Line(svg).source(300, 250); new sd.Circle(svg).r(5).center(l2.source()).fill(C.black);
    const inter = new sd.Circle(svg).r(5).fill(C.red);
    const d1 = V.makeComplex(1, 2 * Math.PI / 5);
    const d2 = V.makeComplex(1, 2 * Math.PI / 3);
    l1.target(V.add(l1.source(), V.numberMul(d1, 300)));
    l2.target(V.add(l2.source(), V.numberMul(d2, 300)));
    slider.onChange((value) => {
        l1.target(V.add(l1.source(), V.makeComplex(300, 2 * Math.PI / 500 * value)));
        const [success, point] = V.intersectLineWithShootLine(
            l1.source(),
            V.makeComplex(300, 2 * Math.PI / 500 * value),
            l2.source(),
            d2);
        if (success) inter.center(point);
    });
}

async function TestIntersectLineWithLine() {
    const slider = new sd.Slider(svg).min(1).max(500).width(500).x(100).y(100);
    const l1 = new sd.Line(svg).source(200, 200); new sd.Circle(svg).r(5).center(l1.source()).fill(C.black);
    const l2 = new sd.Line(svg).source(300, 250); new sd.Circle(svg).r(5).center(l2.source()).fill(C.black);
    const inter = new sd.Circle(svg).r(5).fill(C.red);
    const d1 = V.makeComplex(1, 2 * Math.PI / 5);
    const d2 = V.makeComplex(1, 2 * Math.PI / 3);
    l1.target(V.add(l1.source(), V.numberMul(d1, 300)));
    l2.target(V.add(l2.source(), V.numberMul(d2, 300)));
    slider.onChange((value) => {
        l1.target(V.add(l1.source(), V.makeComplex(300, 2 * Math.PI / 500 * value)));
        inter.center(V.intersectLineWithLine(
            l1.source(),
            V.makeComplex(300, 2 * Math.PI / 500 * value),
            l2.source(),
            d2
        )[1]);
    });
}