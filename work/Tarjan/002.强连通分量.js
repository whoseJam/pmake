import * as sd from "#lib/slide"

let svg = sd.svg();
let C = sd.color();
let nodes1 = {}, links1 = {};
let nodes2 = {}, links2 = {};
let nodes3 = {}, links3 = {};
let g1 = makeGraph1(100, 250, 50);
let g2;
let g3;
apply(g1, "opacity", 0);

main();

async function main() {
    await sd.pause();
    apply(g1, "startAnimate");
    apply(g1, "opacity", 1);
    apply(g1, "endAnimate");
    await sd.pause();
    g2 = makeGraph2(500, 100, 50);
    await sd.pause();
    g3 = makeGraph3(900, 250, 50)
    await sd.pause();
    for (let i = 1; i <= 6; i++) {
        nodes2[i].startAnimate().value(i + 6).endAnimate();
        nodes3[i].startAnimate().value(i + 12).endAnimate();
    }
    await sd.pause();
    link(nodes1[6], nodes2[6]);
    await sd.pause();
    link(nodes1[5], nodes3[6]);
    await sd.pause();
    link(nodes3[1], nodes2[5]);
}

function link(a, b) {
    let lk = sd.BezierCurveLink(svg).from(a).to(b);
    let t = lk.totalLength();
    lk.strokeWidth(2).stroke(C.red);
    lk.strokeDashArray(t);
    lk.strokeDashOffset(t);
    lk.startAnimate();
    lk.strokeDashOffset(0);
    lk.endAnimate();
    lk.arrow();
}

function makeGraph1(x, y, len) {
    nodes1 = {}; let self = [];
    for (let i = 1; i <= 6; i++) {
        nodes1[i] = sd.Vertex(svg);
        nodes1[i].value(i);
        self.push(nodes1[i]);
    }
    links1 = {};
    nodes1[1].cx(x + len * Math.sqrt(3)).cy(y);
    nodes1[2].cx(x).cy(y + len);
    nodes1[3].cx(x).cy(y + len * 3);
    nodes1[4].cx(x + len * Math.sqrt(3)).cy(y + len * 4);
    nodes1[5].cx(x + len * Math.sqrt(3) * 2).cy(y + len * 3);
    nodes1[6].cx(x + len * Math.sqrt(3) * 2).cy(y + len);
    for (let i = 1; i <= 6; i++) {
        let lk = sd.Link(svg).from(nodes1[i]).to(nodes1[i===6?1:i+1]);
        links1[i] = lk.arrow().strokeWidth(2);
        self.push(lk);
    }
    return self;
}

function makeGraph2(x, y, len) {
    nodes2 = {}; let self = [];
    for (let i = 1; i <= 6; i++) {
        nodes2[i] = sd.Vertex(svg);
        nodes2[i].value(i);
        self.push(nodes2[i]);
    }
    nodes2[1].cx(x + len * Math.sqrt(3)).cy(y);
    nodes2[2].cx(x).cy(y + len);
    nodes2[6].cx(x).cy(y + len * 3);
    nodes2[4].cx(x + len * Math.sqrt(3)).cy(y + len * 4);
    nodes2[3].cx(x + len * Math.sqrt(3) * 2).cy(y + len * 3);
    nodes2[5].cx(x + len * Math.sqrt(3) * 2).cy(y + len);
    for (let i = 1; i <= 6; i++) {
        let frm = nodes1[i], tx = nodes2[i].cx(), ty = nodes2[i].cy();
        nodes2[i].cx(frm.cx()).cy(frm.cy());
        nodes2[i].startAnimate(1000);
        nodes2[i].cx(tx).cy(ty);
        nodes2[i].endAnimate();
        self.push(nodes2[i]);
    }
    let edges = [
        [3, 1], [1, 2], [4, 3], [2, 4],
        [2, 6], [6, 5], [5, 1]];
    for (let i = 0; i < edges.length; i++) {
        let lk = sd.Link(svg)
        lk.from(nodes2[edges[i][0]])
        lk.to(nodes2[edges[i][1]]);
        lk.strokeWidth(2); let t = lk.totalLength();
        lk.strokeDashOffset(t).strokeDashArray(t).after(1000);
        lk.startAnimate().strokeDashOffset(0).endAnimate().arrow();
        self.push(lk);
        links2[i] = lk;
    }
    return self;
}

function makeGraph3(x, y, len) {
    nodes3 = {}; let self = [];
    for (let i = 1; i <= 6; i++) {
        nodes3[i] = sd.Vertex(svg);
        nodes3[i].value(i);
        self.push(nodes3[i]);
    }
    nodes3[1].cx(x + len * Math.sqrt(3)).cy(y);
    nodes3[2].cx(x).cy(y + len);
    nodes3[6].cx(x).cy(y + len * 3);
    nodes3[4].cx(x + len * Math.sqrt(3)).cy(y + len * 4);
    nodes3[3].cx(x + len * Math.sqrt(3) * 2).cy(y + len * 3);
    nodes3[5].cx(x + len * Math.sqrt(3) * 2).cy(y + len);
    for (let i = 1; i <= 6; i++) {
        let frm = nodes1[i], tx = nodes3[i].cx(), ty = nodes3[i].cy();
        nodes3[i].cx(frm.cx()).cy(frm.cy());
        nodes3[i].startAnimate(1000);
        nodes3[i].cx(tx).cy(ty);
        nodes3[i].endAnimate();
        self.push(nodes3[i]);
    }
    let edges = [
        [2, 1], [6, 1], [1, 5], [5, 3],
        [3, 2], [3, 6], [4, 6], [3, 4]];
    for (let i = 0; i < edges.length; i++) {
        let lk = sd.Link(svg)
        lk.from(nodes3[edges[i][0]])
        lk.to(nodes3[edges[i][1]]);
        lk.strokeWidth(2); let t = lk.totalLength();
        lk.strokeDashOffset(t).strokeDashArray(t).after(1000);
        lk.startAnimate().strokeDashOffset(0).endAnimate().arrow();
        self.push(lk);
        links3[i] = lk;
    }
    return self;
}


function apply(list, func, value) {
    for (let i = 0; i < list.length; i++) {
        if (value !== undefined) list[i][func](value);
        else list[i][func]();
    }
}