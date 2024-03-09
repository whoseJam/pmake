import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let a = new sd.BarArray(svg).x(100).y(400).start(1);
let data = [2, 7, 3, 4, 8, 5]
for (let i = 0; i < data.length; i++)
    a.push(data[i]);

a.color(2, C.red);
a.color(1, C.green);
a.color(5, C.green);