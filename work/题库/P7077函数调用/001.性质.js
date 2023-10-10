import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let c0 = makeNode(1, 4.5);
let c1 = makeNode(2, 2.5);
let c2 = makeNode(3, 1);
let c3 =  makeNode(3, 2);
let c4 = makeNode(3, 3);
let c5 = makeNode(3, 4);
let c6 = makeNode(3, 5);
let c7 = makeNode(3, 6);
let c8 = makeNode(3, 7);
let c9 = makeNode(4, 4.5);

link(c0, c1);
link(c1, c2); link(c1, c3); link(c1, c4); link(c1, c5);
link(c0, c6); link(c0, c7); link(c0, c8);
link(c5, c9); link(c6, c9);

main();

async function main() {
    await sd.pause();
    makeCall(c0);

    await sd.pause();
    makeCall(c2);
}

function makeCall(c) {
    let txt = sd.Text(svg, "+1").fontSize(40);
    txt.x(c.mx() + 3).cy(c.cy());
    txt.strokeWidth(1);
    txt.strokeDashArray("0 87.5%");
    txt.fillOpacity(0);
    txt.startAnimate(1000);
    txt.strokeDashArray("100% 0%");
    txt.endAnimate();
}

function makeNode(y, x) {
    let circ = sd.Circle(svg);
    circ.x(100 * x);
    circ.y(100 * y);
    return circ;
}

function link(from, to) {
    let link = sd.Link(svg);
    link.background().markerEnd("arrow");
    link.source(from.cx(), from.cy());
    link.target(to.cx(), to.cy());
    sd.trim(link, from, to);
}