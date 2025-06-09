import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const vertex = new sd.Vertex(svg, "u");
const c1 = new sd.Circle(svg).r(10);
const c2 = new sd.Circle(svg).r(10);
const c3 = new sd.Circle(svg).r(10);
const f1 = new sd.Vertex(svg, "f");
const f2 = new sd.Vertex(svg);
const stack = new sd.ValueStack(svg).elementHeight(60);
const count = [8, 6, 5, 4, 3, 2];

sd.init(() => {
    stack.pushArray([f2, f1, c3, c2, c1, vertex]);
    sd.Link(f2, f1);
    sd.Link(f1, c3);
    sd.Link(c3, c2);
    sd.Link(c2, c1);
    sd.Link(c1, vertex);
    stack.forEachElement((v, i) => {
        v.childAs("arr", new sd.Array(svg).resize(count[i]).elementWidth(12).elementHeight(12), R.aside("rc"));
    });
});

sd.main(async () => {
    await sd.pause();
    [vertex, c1, c2, c3].forEach(v => {
        array(v).startAnimate();
        array(v).push();
        array(v).lastElement().color(C.green);
        array(v).endAnimate();
    });
    await sd.pause();
    const p = sd.Pointer(array(f1), "min", "b", 1, 20);
    p.startAnimate().moveTo(array(f1).end()).endAnimate();
    array(f1).lastElement().startAnimate().value("?").endAnimate();
});

function array(vertex) {
    return vertex.child("arr");
}
