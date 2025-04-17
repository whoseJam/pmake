import * as sd from "@/sd";

const svg = sd.svg();
const s1 = new sd.Circle(svg);
const s2 = new sd.Ellipse(svg).rx(60);
const s3 = new sd.Image(svg).href("http://localhost:1313/img/snowflake.png");
const s4 = new sd.Line(svg);
const s5 = new sd.Path(svg).d(new sd.PathPen().MoveTo(0, 0).Quad(0, 40, 40, 40).toString());
const s6 = new sd.Polygon(svg).points([
    [0, 0],
    [20, 0],
    [20, 20],
    [40, 20],
    [40, 40],
    [0, 40],
]);
const s7 = new sd.Rect(svg);
const s8 = new sd.Text(svg, "SVG");

s1.x(100).y(100);
s2.x(s1.mx() + 40).y(100);
s3.x(s2.mx() + 40).y(100);
s4.x(s3.mx() + 40).y(100);
s5.x(s4.mx() + 40).y(100);
s6.x(s5.mx() + 40).y(100);
s7.x(s6.mx() + 40).y(100);
s8.x(s7.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
