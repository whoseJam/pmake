import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let a1 = new sd.Array(svg).x(200).y(100);
let a2 = new sd.Array(svg).x(200).y(200);
let p = new sd.Array(svg).x(200).y(300);
let p1 = [1, 3, 2, 4, 6, 5];
let p2 = [5, 3, 1, 2, 4, 6];
for (let i = 0; i < p1.length; i++) {
    a1.push(p1[i]);
    a2.push(p2[i]);
}
for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
        if (p1[i] === p2[j]) {
            let ei = a1.element(i);
            let ej = a2.element(j);
            let lk = new sd.Line(svg);
            lk.source(ei.cx(), ei.my());
            lk.target(ej.cx(), ej.y());
            p.push(j+1);
        }
    }
}
sd.Label(a1, "A数组");
sd.Label(a2, "B数组");
sd.Label(p, "位置数组");

let tmp = [0, 2, 3, 4];
for (let i = 0; i < tmp.length; i++) a1.color(tmp[i], C.green);
tmp = [2, 3, 4, 5];
for (let i = 0; i < tmp.length; i++) a2.color(tmp[i], C.green);
tmp = [0, 2, 3, 4];
for (let i = 0; i < tmp.length; i++) p.color(tmp[i], C.green);
