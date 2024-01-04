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

function setFlow(u, v, f) {
    let obj = E(u, v);
    let txt = obj.BASE.value();
    txt.text(f + "/" + obj.cap);
    obj.FLOW.source(obj.BASE.source());
    let p = obj.BASE.at(f / obj.cap);
    obj.FLOW.target(p);
}

// setFlow("S", "A", 1);
// setFlow("A", "C", 1);
// setFlow("S", "B", 1);
// setFlow("B", "C", 1);
// setFlow("C", "T", 2);
// setFlow("S", "A", 1);

setFlow("S", "A", 2);
setFlow("S", "B", 1);
setFlow("A", "C", 2);
setFlow("C", "T", 2);
setFlow("B", "D", 1);
setFlow("D", "E", 1);
setFlow("E", "T", 1);