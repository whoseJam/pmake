import * as sd from "../../lib/slide";

let svg = sd.svg();
let C = sd.color();
let told = makeTree("V_{old}", 5)
let tnew = makeTree("V_{new}", 7);
told.y(100);
tnew.y(300);

makeMatch([
    [2, 3],
    [3, 5],
    [4, 4],
    [6, 7]
]);

function makeMatch(list) {
    for (let i = 0; i < list.length; i++) {
        let a = list[i][0];
        let b = list[i][1];
        a = told.element(a);
        b = tnew.element(b);
        let l = new sd.Line(svg);
        l.source(a.cx(), a.cy());
        l.target(b.cx(), b.cy());
        l.strokeDashArray([5, 5]);
        l.stroke(C.red);
        sd.trim(l, a, b);
    }
}

function makeTree(math, n) {
    let t = new sd.Tree(svg).width(800).cx(600);
    t.root(1, new sd.Mathjax(svg, math));
    for (let i = 2; i <= n + 1; i++)
        t.newNode(i, new sd.Mathjax(svg, `C_{${i-1}}`)).link(1, i);
    t.element(1).rate(1.5);
    for (let i = 2; i <= n + 1; i++)
        t.element(i).rate(1.8);
    return t;
}