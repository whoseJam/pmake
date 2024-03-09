import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();

过河卒();

function 过河卒() {
    let g = new sd.Grid(svg).n(2).m(2).x(100).y(100).startN(1).startM(1);
    let pi = sd.Pointer(g, "i", "r").moveTo(2, 1);
    let pj = sd.Pointer(g, "j", "b").moveTo(1, 2);
    let pi1 = sd.Pointer(g, "i-1", "r").moveTo(1, 1);
    let pj1 = sd.Pointer(g, "j-1", "b").moveTo(1, 1);
}