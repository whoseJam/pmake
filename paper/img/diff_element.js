import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const e1 = new sd.Box(svg, "A");
const e2 = new sd.Vertex(svg, new sd.Rect(svg).color(C.blue));
const e3 = new sd.EllipseVertex(svg, "123").width(60);

e1.x(100).y(100);
e2.x(e1.mx() + 40).y(100);
e3.x(e2.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
