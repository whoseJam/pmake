import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let n = 10, m = 10, l = [n, m];
let mp = sd.Grid(svg).n(n).m(m).startN(1).startM(1);
mp.x(100).y(100).drag(true).resizeable(true);

main();

async function main() {
    await sd.pause();
    findPath();
}

function findPath() {
    let p1 = [1, 1], p2 = [1, 1], lim = n + m;
    let time = 0;
    function focus(rct, i, j) {
        mp.children.push(rct, function(parent, child) {
            let elem = parent.element(i, j);
            child.cx(elem.cx());
            child.cy(elem.cy());        
        })
    }
    function record() {
        let c1 = sd.Rect(svg).opacity(0).color(C.purple);
        let c2 = sd.Rect(svg).opacity(0).color(C.green);
        focus(c1, p1[0], p1[1]);
        focus(c2, p2[0], p2[1]);
        c1.after(time).startAnimate().opacity(0.5).endAnimate();
        c2.after(time).startAnimate().opacity(0.5).endAnimate();
        time = c1.delay();
    }
    record();
    for (let i = 1; i < lim; i++) {
        let r1 = sd.rand(0, 1);
        let r2 = sd.rand(0, 1);
        if (p1[r1] + 1 <= l[r1]) p1[r1]++; else p1[r1^1]++;
        if (p2[r2] + 1 <= l[r2]) p2[r2]++; else p2[r2^1]++;
        record();
    }
}