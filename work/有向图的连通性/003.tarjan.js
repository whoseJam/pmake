import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let H = sd.helper();
let edges = H.ForwardStar();
let g = sd.Graph(svg).drag(true).resizeable(true);
let n = 6;
let stk = sd.Stack(svg).elementWidth(80);
stk.cx(800).y(100);
let tot = 0;
g.rankDir("TB").align("UL");
for(let i = 1; i <= n; i++) {
    g.newNode(i);
    let e = g.element(i);
    e.children.push("dfn", sd.Text(svg, `dfn[${i}]`), function(parent, child) {
        child.fontSize(20);
        if (i == 4 || i == 5) child.x(parent.mx() + 10).y(parent.y());
        else child.x(parent.x() - 100).y(parent.y());
    })
    e.children.push("low", sd.Text(svg, `low[${i}]`), function(parent, child) {
        child.fontSize(20);
        if (i == 4 || i == 5) child.x(parent.mx() + 10).y(parent.y() + 25);
        else child.x(parent.x() - 100).y(parent.y() + 25);
    })
}
link(1, 2);
link(1, 4);
link(2, 5);
link(4, 5);
link(5, 1);
link(2, 3);
link(3, 6);
link(5, 6);
g.cx(400).cy(300);

function link(a, b) {
    g.newLink(a, b);
    g.element(a, b).arrow().strokeWidth(1.2);
    edges.link(a, b);
}

main();

async function main() {
    for (let i = 1; i <= n; i++) {
        if (!getDfn(i)) await tarjan(i);
    }
}

async function tarjan(u) {
    await sd.pause();
    g.startAnimate().color(u, C.green).endAnimate();
    await sd.pause();
    tot++;
    setDfn(u, tot);
    setLow(u, tot);
    setIns(u, true);
    await sd.pause();
    stk.startAnimate().push(u).endAnimate();
    let vs = edges.adjacent(u);
    for (let i = 0; i < vs.length; i++) {
        let v = vs[i].to;
        if (!getDfn(v)) {
            await tarjan(v);
            if (getLow(u) > getLow(v)) {
                await sd.pause();
                g.element(u, v).startAnimate(600).stroke(C.red).strokeWidth(2).endAnimate();
                g.element(u, v).startAnimate(600).stroke(C.black).strokeWidth(1.2).endAnimate();
                g.element(u, v).startAnimate(600).stroke(C.red).strokeWidth(2).endAnimate();
                await sd.pause();
                g.element(u, v).startAnimate(600).stroke(C.black).strokeWidth(1.2).endAnimate();
                setLow(u, getLow(v));
            }
        } else if (getIns(v)) {
            if (getLow(u) > getDfn(v)) {
                await sd.pause();
                g.element(u, v).startAnimate(600).stroke(C.red).strokeWidth(2).endAnimate();
                g.element(u, v).startAnimate(600).stroke(C.black).strokeWidth(1.2).endAnimate();
                g.element(u, v).startAnimate(600).stroke(C.red).strokeWidth(2).endAnimate();
                await sd.pause();
                g.element(u, v).startAnimate(600).stroke(C.black).strokeWidth(1.2).endAnimate();
                setLow(u, getLow(v));
            }
        }
    }
    if (getLow(u) === getDfn(u)) {
        await sd.pause();
        g.startAnimate().color(u, C.orange).endAnimate();
        let c = C.rand();
        while (stk.length() > 0) {
            let e = stk.element(stk.end());
            await sd.pause();
            e.startAnimate().color(c).endAnimate();
            await sd.pause();
            let t = +e.value().text();
            g.startAnimate().color(t, c).endAnimate();
            await sd.pause();
            stk.startAnimate().pop().endAnimate();
            setIns(t, false);
            if (t === u) break;
        }
    } else {
        await sd.pause();
        g.startAnimate().color(u, C.white).endAnimate();
    }
}

function setDfn(u, as) {
    let dfn = g.element(u).children.child("dfn");
    dfn.startAnimate().opacity(0).endAnimate();
    dfn.text(`dfn[${u}]=${as}`);
    dfn.startAnimate().opacity(1).endAnimate();
    dfn.dfn = as;
}

function setLow(u, as) {
    let low = g.element(u).children.child("low");
    low.startAnimate().opacity(0).endAnimate();
    low.text(`low[${u}]=${as}`);
    low.startAnimate().opacity(1).endAnimate();
    low.low = as;
}

function setIns(u, as) {
    let e = g.element(u);
    e.ins = as;
}

function getDfn(u) {
    let dfn = g.element(u).children.child("dfn");
    return dfn.dfn ? dfn.dfn : 0;
}

function getLow(u) {
    let low = g.element(u).children.child("low");
    return low.low ? low.low : 0;
}

function getIns(u) {
    let e = g.element(u);
    return e.ins ? true : false;
}