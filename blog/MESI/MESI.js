import * as sd from "../../lib/slide";

let svg = sd.svg();
let R = sd.rule();
const H = 20;

let mem = new sd.Box(svg).x(100).y(100).width(500);
mem.value(new sd.Mathjax(mem, "Mem").height(H), R.CenterOnly());
let C = [
    new sd.Box(svg).x(100).y(150).width(100),
    new sd.Box(svg).x(300).y(150).width(100),
    new sd.Box(svg).x(500).y(150).width(100)
]
let CPU = [
    new sd.Box(svg).x(100).y(200).width(100),
    new sd.Box(svg).x(300).y(200).width(100),
    new sd.Box(svg).x(500).y(200).width(100)
]
for (let i = 0; i < 3; i++) {
    C[i].value(new sd.Mathjax(C[i], `Cache_${i}`).height(H), R.CenterOnly());
    CPU[i].value(new sd.Mathjax(CPU[i], `CPU_${i}`).height(H), R.CenterOnly());
}

sd.Label(mem, "x=1");
sd.Label(C[0], "x=1");
sd.Label(C[2], "x=1");
