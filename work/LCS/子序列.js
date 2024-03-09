import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let X = new sd.Array(svg).x(100).y(100);
let Y = new sd.Array(svg).x(100).y(180);
let str = "ABCBDAB";
let is = [1, 2, 5, 6];

for (let i = 0; i < str.length; i++)
    X.push(str[i]);
for (let i = 0; i < is.length; i++) {
    Y.push(X.value(is[i]).text());
    X.color(is[i], C.green);
}
Y.color(C.green);