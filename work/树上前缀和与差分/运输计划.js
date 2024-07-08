import { trim } from "../../lib/Utility/Trim";
import * as sd from "../@/SD";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();

main();

async function main() {
    let t = makeTree();
}

function makePath(t, a, b) {
    let l = new sd.Curve(svg);
    let A = t.element(a);
    let B = t.element(b);
    l.source(A.cx(), A.cy()).target(B.cx(), B.cy()).arrow();
    trim(l, A, B);
}

function makeTree() {
    let t = new sd.Tree(svg).width(1100).cx(600).y(100);
    let n = 20;
    let edges = [
        [1, 2], [1, 3], [1, 4],
        [2, 5], [2, 6],
        [4, 7], [4, 8],
        [5, 9], [5, 10],
        [6, 11], [7, 12], [8, 13], [8, 14], [8, 15],
        [10, 16], [12, 17], [14, 18], [15, 19], [15, 20]
    ];
    t.root(1);
    for (let i = 0; i < edges.length; i++) {
        t.link(edges[i][0], edges[i][1], sd.rand(1, 5));
        let l = t.element(edges[i][0], edges[i][1]);
        l.child("value").rule = R.PointAtPathByRate(0.5, "x", "cy");
    }
    t.update();
    return t;
}