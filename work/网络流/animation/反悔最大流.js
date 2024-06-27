import * as sd from "@/SD";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).cx(600).cy(300);
const links = [
    { from: 1, to: 2, cap: 4, xloc: "mx", yloc: "my" },
    { from: 1, to: 3, cap: 2, xloc: "x", yloc: "my" },
    { from: 2, to: 3, cap: 1, xloc: "cx", yloc: "my" },
    { from: 2, to: 4, cap: 2, xloc: "mx", yloc: "cy" },
    { from: 2, to: 5, cap: 4, xloc: "x", yloc: "y" },
    { from: 3, to: 5, cap: 2, xloc: "x", yloc: "cy" },
    { from: 4, to: 6, cap: 3, xloc: "mx", yloc: "y" },
    { from: 5, to: 6, cap: 3, xloc: "x", yloc: "y" }
]

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.25, 0).newNode(2);
    graph.at(0.25, 1).newNode(3);
    graph.at(0.75, 0).newNode(4);
    graph.at(0.75, 1).newNode(5);
    graph.at(1, 0.5).newNode(6);
    function link(x, y) {
        graph.newLink(x, y);
    }
    links.forEach(lk => {
        link(lk.from, lk.to);
        const e = graph.element(lk.from, lk.to).arrow();
        e.value(new sd.Text(e, lk.cap).fontSize(20), R.PointAtPathByRate(0.5, lk.xloc, lk.yloc));
        e.xloc = lk.xloc;
        e.yloc = lk.yloc;
    });
    graph._.linkType = sd.Curve;
}

async function main() {
    await flow(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 5 },
        { from: 5, to: 6 }
    ]);
    await flow(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 4, to: 6 }
    ]);
    await flow(graph, [
        { from: 1, to: 3 },
        { from: 3, to: 5 },
        { from: 5, to: 2 },
        { from: 2, to: 4 },
        { from: 4, to: 6 }
    ]);
    await sd.pause();
}

async function flow(graph, edges) {
    await sd.pause();
    let current = 0, bottleNeck = Infinity;
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.after(current)
            .stroke(C.red).strokeWidth(2)
            .startAnimate().pointStoT().endAnimate();
        current = e;
        bottleNeck = Math.min(bottleNeck, e.intValue());
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`).fontSize(25).cx(graph.cx()).y(graph.my() + 40);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        const v = e.value();
        const newValue = e.intValue() - bottleNeck;
        v.startAnimate().opacity(0).endAnimate()
            .text(newValue)
            .startAnimate().opacity(1).endAnimate();
    })
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        if (!graph.element(edge.to, edge.from)) {
            graph.newLink(edge.to, edge.from);
            const re = graph.element(edge.to, edge.from);
            re.stroke(C.deepSkyBlue);
            re.startAnimate()
            re.value(bottleNeck, R.PointAtPathByRate(0.5, e.xloc, e.yloc))
            re.pointStoT()
            re.endAnimate();
            re.arrow();
        } else {
            const re = graph.element(edge.to, edge.from);
            const newValue = re.intValue() + bottleNeck;
            const v = re.value();
            v.startAnimate().opacity(0).endAnimate()
            v.text(newValue)
            v.startAnimate().opacity(1).endAnimate();
        }
    })
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.startAnimate()
        e.strokeWidth(1).stroke(e.xloc ? C.black : C.deepSkyBlue);
        if (e.intValue() === 0) e.strokeDashArray([5, 5]);
        e.endAnimate();
    })
    text.startAnimate().opacity(0).remove();
}