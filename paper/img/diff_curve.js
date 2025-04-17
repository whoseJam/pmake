import * as sd from "@/sd";

const svg = sd.svg();
const s1 = new sd.Bezier(svg);
const s2 = new sd.BraceCurve(svg);
const s3 = new sd.CircleCurve(svg);
const s4 = new sd.Curve(svg);
const s5 = new sd.VHBezier(svg);
const s6 = new sd.ZZLine(svg);

s1.x(100).y(100);
s2.x(s1.mx() + 40).y(100);
s3.x(s2.mx() + 40).y(100);
s4.x(s3.mx() + 40).y(100);
s5.x(s4.mx() + 40).y(100);
s6.x(s5.mx() + 40).y(100);

sd.init(() => {});

sd.main(async () => {});
