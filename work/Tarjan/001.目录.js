import * as sd from "#lib/slide";

let svg = sd.svg();
let F = 40;
let tg = sd.Text(svg, "图").fontSize(F).x(100).y(260);
let diG = sd.Text(svg, "有向图").fontSize(F).x(400).y(160);
let unG = sd.Text(svg, "无向图").fontSize(F).x(400).y(360);
let c1 = sd.Text(svg, "强连通分量").fontSize(F).x(700).y(160);
let c2 = sd.Text(svg, "点双连通分量").fontSize(F).x(700).y(360);
let c3 = sd.Text(svg, "边双连通分量").fontSize(F).x(700).y(420);
let nodes = [tg, diG, unG, c1, c2, c3];
for (let i = 0; i < nodes.length; i++) {
    nodes[i].strokeWidth(1);
    nodes[i].fillOpacity(0);
    nodes[i].strokeDashArray("0 87.5%");
}

main();

async function main() {
    await sd.pause();
    appearText(tg);
    await sd.pause();
    link(tg, diG);
    link(tg, unG);
    await sd.pause();
    link(diG, c1);
    await sd.pause();
    link(unG, c2);
    link(unG, c3);
}

function appearText(a) {
    a.startAnimate(2000);
    a.strokeDashArray("100% 0%");
    a.endAnimate();
    a.after(1000).startAnimate()
    a.fillOpacity(1);
    a.endAnimate();
}

function link(a, b) {
    let c = sd.VHCurveLink(svg).from(a).to(b);
    c.strokeWidth(2);
    let t = c.totalLength();
    c.strokeDashArray(t);
    c.strokeDashOffset(t);
    c.startAnimate();
    c.strokeDashOffset(0)
    c.endAnimate();
    c.arrow();
    b.after(c)
    appearText(b);
}