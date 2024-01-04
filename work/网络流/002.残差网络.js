import * as sd from "#lib/slide";

let inf = 0x3f3f3f3f;
let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let G = sd.Graph(svg).width(300).height(400).cx(600).cy(300);
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
let to = {}, gap = {};

function E(u, v) {
    for (let i = 0; i < links.length; i++)
        if (links[i][0] === u && links[i][1] === v)
            return links[i][2];
    return null;
}

for (let i = 0; i < nodes.length; i++) {
    G.newNode(nodes[i]);
    to[nodes[i]] = [];
    gap[nodes[i]] = 0;
}
for (let i = 0; i < links.length; i++) {
    to[links[i][0]].push(links[i][1]);
    G.newLink(links[i][0], links[i][1]);
    let obj = E(links[i][0], links[i][1]);
    obj.BASE = G.element(links[i][0], links[i][1]);
    obj.BASE.strokeOpacity(0);
}
function setFlow(u, v, f) {
    let obj = E(u, v);
    let pos = obj.cap - f;
    let neg = f;
    if (pos > 0) {
        let lk = sd.CurveLink(svg).strokeWidth(1.25);
        lk.from(G.element(u)).to(G.element(v)).bending(0.25).arrow();
        lk.valueRule(R.PointAtPathByRate(0.5, "mx", "y")).value(sd.Text(svg, pos).fontSize(20));
    }
    if (neg > 0) {
        let lk = sd.CurveLink(svg).strokeWidth(1.25);
        lk.from(G.element(v)).to(G.element(u)).bending(0.25).arrow();
        lk.valueRule(R.PointAtPathByRate(0.5, "mx", "y")).value(sd.Text(svg, neg).fontSize(20));
    }
}

setFlow("S", "A", 1);
setFlow("A", "C", 1);
setFlow("S", "B", 1);
setFlow("B", "C", 1);
setFlow("C", "T", 2);
setFlow("S", "A", 1);
setFlow("B", "D", 0);
setFlow("D", "E", 0);
setFlow("E", "T", 0);

