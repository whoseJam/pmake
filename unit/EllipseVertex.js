import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();

sd.init(() => {});

sd.main(TestEllipseVertexBackingSVGAndHTML);

async function TestEllipseVertexBackingSVGAndHTML() {
    const e1 = new sd.EllipseVertex(svg).x(100).y(100).width(100);
    const e2 = new sd.EllipseVertex(div).x(100).y(200).width(100);
    await sd.pause();
    e1.startAnimate().value("hello").endAnimate();
    e2.startAnimate().value(new sd.Button(e2)).endAnimate();
    await sd.pause();
    e1.startAnimate().value(null).endAnimate();
    e2.startAnimate().value(null).endAnimate();
}
