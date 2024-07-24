import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let a = new sd.BarArray(svg).x(100).y(400).start(1);
let data = [5, 3, 4, 2]
for (let i = 0; i < data.length; i++)
    a.push(data[i]);