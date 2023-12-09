import * as sd from "#lib/slide";

let svg = sd.svg();
let C = sd.color();
let R = sd.rule();
let H = sd.helper();
let g = sd.Graph(svg).x(100).y(100);
let n = 5;
let dis = sd.Array(svg).x(700).y(180).start(1);
let vis = sd.Array(svg).x(700).y(220).start(1);
let rct = sd.Rect(svg).width(40).height(80).stroke(C.red).strokeWidth(2).fillOpacity(0);
sd.EnableArrayName(dis, "dis");
sd.EnableArrayName(vis, "vis");
let edges = H.ForwardStar();
for (let i = 1; i <= n; i++) {
    dis.push("inf");
    vis.push("0");
    let e = dis.element(i);
    e.children.push("index", sd.Vertex(svg).value(i), function(parent, child) {
        child.width(20).cx(parent.cx()).my(parent.y() - 8);
    })
    dis.element(i).dis = Infinity;
    vis.element(i).vis = false;
}
for (let i = 1; i <= n; i++)
    g.newNode(i);
link(1, 2, 2);
link(1, 3, 12);
link(1, 4, 10);
link(2, 3, 8);
link(2, 5, 9);
link(3, 4, 6);
link(3, 5, 3);
link(4, 5, 7);
function link(u, v, w) {
    edges.link(u, v, w);
    edges.link(v, u, w);
    g.newLink(u, v, sd.Text(svg, w).fontSize(20));
    let l = g.element(u, v);
    l.valueRule(R.PointAtPathByRate(0.5, "x", "y"));
}

main();

async function main() {
    rct.x(dis.element(1).x()).y(dis.element(1).y());
    await sd.pause();
    await setVis(1, 0);
    await setDis(1, 0);

    for (let i = 1; i <= n; i++) {
        let at = -1;
        for (let j = 1; j <= n; j++) {
            if (getVis(j)) continue;
            if (at === -1) at = j;
            else if (getDis(j) < getDis(at)) at = j;
        }
        g.startAnimate().color(at, C.orange).endAnimate();
        await setVis(at, 1);

        let to = edges.adjacent(at);
        for (let j = 0; j < to.length; j++) {
            let v = to[j].to, w = to[j].value;
            if (w === getDis(at)) {
                let frm = Math.min(v, at);
                let tto = Math.max(v, at);
                g.element(frm, tto).startAnimate().stroke(C.red).strokeWidth(2).endAnimate();
            }
        }
        for (let j = 0; j < to.length; j++) {
            let v = to[j].to, w = to[j].value;
            if (getVis(v)) continue;
            let newDis = Math.min(getDis(v), w);
            await setDis(v, newDis);
        }
        await sd.pause();
        g.startAnimate().color(at, C.green).endAnimate();
    }
}

async function setDis(x, d) {
    if (rct.x() != vis.element(x).x()) {
        await sd.pause();
        rct.startAnimate().x(dis.element(x).x()).endAnimate();
    }
    await sd.pause();
    dis.element(x).dis = d;
    dis.element(x).startAnimate().value(d).endAnimate();
}

function getDis(x) {
    return dis.element(x).dis;
}

async function setVis(x, d) {
    if (rct.x() != vis.element(x).x()) {
        await sd.pause();
        rct.startAnimate().x(vis.element(x).x()).endAnimate();
    }
    await sd.pause();
    vis.element(x).vis = d;
    vis.element(x).startAnimate().value(d).endAnimate();
}

function getVis(x) {
    return vis.element(x).vis;
}