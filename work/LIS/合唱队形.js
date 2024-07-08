import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let a = new sd.BarArray(svg).x(100).y(400);
let data = [1, 3, 2, 4, 5, 3, 4, 2, 1]
for (let i = 0; i < data.length; i++)
    a.push(data[i]);

a.color(4, C.red);
a.color(0, C.green);
a.color(1, C.green);
a.color(3, C.green);
a.color(5, C.green);
a.color(7, C.green);
a.color(8, C.green);