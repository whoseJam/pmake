import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
const W = 50
let h = sd.Array(svg).start(1).indexed(true).x(100).y(100).width(W);
let l = sd.Array(svg).start(1).indexed(true).x(100).y(200).width(W);
let board = sd.Text(svg).x(800).y(100).fontSize(40);
sd.EnableArrayName(l, "l数组");
sd.EnableArrayName(h, "h数组");
let hnodes = {}, x = 100, dx = 60, y = 280, dy = 80;
let lnodes = {};
let cnt = 0;

for (let i = 1; i <= 10; i++) {
    lnodes[i] = [];
    l.fromExistedElem().push(makeElem());
    if (i <= 5) {
        h.push(0);
        hnodes[i] = sd.Box(svg).value(`h[${i}]`);
        hnodes[i].x(x).y(y + (i-1)*dy);
        hnodes[i].nxt = 0;
    }
}

main();

async function main() {
    await link(1, 2);
    await link(1, 3);
    await link(2, 4);
    await link(1, 5);
}

async function link(x, y) {
    await sd.pause();
    board.startAnimate().opacity(0).endAnimate();
    board.text(`link x=${x} y=${y}`);
    board.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    h.startAnimate().color(x, C.blue).endAnimate();
    hnodes[x].startAnimate().color(C.blue).endAnimate();
    await sd.pause();
    cnt++;
    l.startAnimate().color(cnt, C.orange).endAnimate();
    l.startAnimate().color(cnt, C.white).endAnimate();
    let e = makeElemWithIndex(cnt);
    e.cx(l.element(cnt).cx()).cy(l.element(cnt).cy()).opacity(0);
    e.after(l).opacity(1).startAnimate().x(600).y(400).endAnimate();
    
    await sd.pause();
    e.value().row(1).text(`to=${y}`);
    l.value(cnt).row(1).text(`to=${y}`);

    if (hnodes[x].nxt) {
        await sd.pause();
        let nxt = hnodes[x].nxt;
        nxt.startAnimate().color(C.red).endAnimate();
        let link = sd.Link(svg).from(e).to(nxt);
        startLink(link);
        nxt.lnk = link;
        await sd.pause();
        nxt.startAnimate().color(C.white).endAnimate();
    }
    if (hnodes[x].lnk) {
        await sd.pause();
        stopLink(hnodes[x].lnk);
    }

    await sd.pause();
    let link = sd.Link(svg).from(hnodes[x]).to(e);
    startLink(link);

    await sd.pause();
    lnodes[x].push(e);
    hnodes[x].nxt = e;
    hnodes[x].lnk = link;
    e.lnk = link;
    update();

    await sd.pause();
    h.startAnimate().color(x, C.white).endAnimate();
    l.startAnimate().color(cnt, C.grey).endAnimate();
    hnodes[x].startAnimate().color(C.white).endAnimate();
}

function makeElemWithIndex(idx) {
    let e = sd.Box(svg).width(W);
    let txt = sd.Code(svg);
    txt.push("to");
    txt.push("Nxt");
    e.value(txt);
    e.children.push("idx", sd.Text(svg, idx), function(parent, child) {
        child.cx(parent.cx()).my(parent.y() - 5);
    });
    return e;
}

function makeElem() {
    let e = sd.Box(svg);
    let txt = sd.Code(svg);
    txt.push("to");
    txt.push("Nxt");
    e.value(txt);
    return e;
}

function startLink(link) {
    let t = link.totalLength();
    link.strokeDashArray(t);
    link.strokeDashOffset(t);
    link.startAnimate().strokeDashOffset(0).endAnimate().arrow();
}

function stopLink(link) {
    let t = link.totalLength();
    link.strokeDashArray(t);
    link.strokeDashOffset(0);
    link.markerEnd(null).startAnimate().strokeDashOffset(t).endAnimate();
    link.opacity(0);
}

function update() {
    for (let i in lnodes)
        for (let j = 0; j < lnodes[i].length; j++)
            lnodes[i][j].lnk.startAnimate();
    for (let i in lnodes) {
        for (let j = 0; j < lnodes[i].length; j++) {
            let rj = lnodes[i].length - j;
            lnodes[i][j].startAnimate();
            lnodes[i][j].x(x + rj*dx).y(y + (i-1)*dy);
            lnodes[i][j].endAnimate();
        }
    }
    for (let i in lnodes)
        for (let j = 0; j < lnodes[i].length; j++)
            lnodes[i][j].lnk.endAnimate();
}