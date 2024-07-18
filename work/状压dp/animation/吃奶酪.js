import * as sd from "@/sd";

let svg = sd.svg();
let axis = new sd.Axis(svg);

axis.dot(20, 20);
axis.dot(10, 20);
axis.x(100).y(100);