import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();

教主的花园状态细化();

function 教主的花园状态细化() {
    let cnt = 0
    function makeArray() {
        return new sd.Array(svg).resize(3).start(1).x(100).y(100 + (cnt++));
    }
    let a1 = makeArray();
    a1.color(3, C.green);

}

function 交叉种树() {
    function getRandomInt(l, r) {
        return Math.floor(Math.random() * (r - l + 1)) + l;
    }
    let n = 8;
    let g = new sd.Grid(svg).n(n).m(3).x(100).y(100).startN(1).startM(1);
    console.log(g.isAnimating());
    let cur = 2;
    for (let i = 1; i <= n; i++) {
        if (i === n) cur = 1;
        g.color(i, cur, C.green);
        if (i & 1) {
            cur = getRandomInt(1, cur - 1);
        } else {
            cur = getRandomInt(cur + 1, 3);
        }
    }
}

function 过河卒() {
    let g = new sd.Grid(svg).n(2).m(2).x(100).y(100).startN(1).startM(1);
    let pi = sd.Pointer(g, "i", "r").moveTo(2, 1);
    let pj = sd.Pointer(g, "j", "b").moveTo(1, 2);
    let pi1 = sd.Pointer(g, "i-1", "r").moveTo(1, 1);
    let pj1 = sd.Pointer(g, "j-1", "b").moveTo(1, 1);
}