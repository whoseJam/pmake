import * as sd from "#lib/slide";

let inf = 0x3f3f3f3f;
let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let G = sd.Graph(svg).width(600).height(400).cx(600).cy(300);
let nodes = ["S", "A", "B", "C", "D", "E", "T"];
let links = [
    ["S", "A", { cap: 3 }],
    ["S", "B", { cap: 1 }],
    ["A", "C", { cap: 3 }],
    ["B", "C", { cap: 5 }],
    ["C", "T", { cap: 2 }],
    ["B", "D", { cap: 4 }],
    ["D", "E", { cap: 2 }],
    ["E", "T", { cap: 3 }]
]
let n = nodes.length;
let to = {}, gap = sd.make1d(100, 0), dis = {};
let Q1, Q2, Q3, Q4;

function E(u, v) {
    for (let i = 0; i < links.length; i++)
        if (links[i][0] === u && links[i][1] === v)
            return links[i][2];
    return null;
}

for (let i = 0; i < nodes.length; i++) {
    G.newNode(nodes[i]);
    G.element(nodes[i]).children.push("dis", sd.Text(svg, "dis=0").fontSize(20), function(parent, child) {
        child.x(parent.mx() + 8);
        child.cy(parent.cy());
    })
    to[nodes[i]] = [];
    dis[nodes[i]] = 0;
}
for (let i = 0; i < links.length; i++) {
    to[links[i][0]].push(links[i][1]);
    G.newLink(links[i][0], links[i][1]);
    let obj = E(links[i][0], links[i][1]);
    obj.flow = obj.cap; obj.revFlow = 0;
    obj.BASE = G.element(links[i][0], links[i][1]);
    obj.BASE.stroke(C.grey).strokeWidth(10).arrow();
    obj.BASE.valueRule(R.PointAtPathByRate(0.5, "mx", "y")).value(sd.Text(svg, "0/" + obj.cap).fontSize(20))
}
for (let i = 0; i < links.length; i++) {
    let obj = E(links[i][0], links[i][1]);
    obj.FLOW = sd.Link(svg);
    obj.FLOW.source(obj.BASE.source())
    obj.FLOW.target(obj.BASE.source());
    obj.FLOW.stroke(C.red).strokeWidth(3);
}

main();

function main() {
    Sap();
}

function setFlow(u, v, f) {
    let obj = E(u, v);
    let txt = obj.BASE.value();
    txt.startAnimate().opacity(0).endAnimate()
    txt.text(f + "/" + obj.cap);
    txt.startAnimate().opacity(1).endAnimate();
    obj.FLOW.startAnimate();
    obj.FLOW.source(obj.BASE.source());
    let p = obj.BASE.at(f / obj.cap);
    obj.FLOW.target(p);
    obj.FLOW.endAnimate();
}

async function Sap() {
    let ans = 0;
    gap[0] = n;
    while (dis["S"] < n) {
        Q1 = []; Q2 = []; Q3 = []; Q4 = [];
        ans += Stream("S", inf);
        await sd.pause();
        for (let i = 0; i < Q1.length; i++) Q1[i]();
        await sd.pause();
        for (let i = 0; i < Q2.length; i++) Q2[i]();
        await sd.pause();
        for (let i = 0; i < Q3.length; i++) Q3[i]();
        await sd.pause();
        for (let i = 0; i < Q4.length; i++) Q4[i]();
    }
}

function Stream(u, lim) {
    let give = 0, d;
    if (u === "T") return lim;
    for (let i = 0, v, obj; i < to[u].length; i++) {
        v = to[u][i];
        obj = E(u, v);
        if (obj.flow > 0 && dis[v] + 1 == dis[u]) {
            d = Stream(v, Math.min(lim, obj.flow));
            obj.flow -= d;
            obj.revFlow += d;
            Q2.push(setFlow.bind(null, u, v, obj.revFlow));
            give += d; lim -= d;
            if (dis["S"] === n || !lim) return give;
        }
    }
    if (!(--gap[dis[u]])) dis["S"] = n;
    Q1.push(function() { G.element(u).startAnimate().color(C.blue).endAnimate(); });
    Q4.push(function() { G.element(u).startAnimate().color(C.white).endAnimate(); })
    let txt = G.element(u).children.child("dis");
    gap[++dis[u]]++;

    Q3.push(function() {
        txt.startAnimate().opacity(0).endAnimate();
        txt.text(`dis=${dis[u]}`);
        txt.startAnimate().opacity(1).endAnimate();
    })
    return give;
}