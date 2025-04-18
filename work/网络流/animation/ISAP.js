import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).cx(600).cy(300);
const S = "1";
const T = "6";
const n = 6;
const gap = sd.make1d(10, 0);
const nodes = [
    { node: 1, loc: "tc" },
    { node: 2, loc: "lc" },
    { node: 3, loc: "rc" },
    { node: 4, loc: "lc" },
    { node: 5, loc: "rc" },
    { node: 6, loc: "bc" },
];
const links = [
    { from: 1, to: 2, cap: 4, xloc: "mx", yloc: "my" },
    { from: 1, to: 3, cap: 2, xloc: "x", yloc: "my" },
    { from: 2, to: 3, cap: 1, xloc: "cx", yloc: "my" },
    { from: 2, to: 4, cap: 2, xloc: "mx", yloc: "cy" },
    { from: 2, to: 5, cap: 4, xloc: "x", yloc: "y" },
    { from: 3, to: 5, cap: 2, xloc: "x", yloc: "cy" },
    { from: 4, to: 6, cap: 3, xloc: "mx", yloc: "y" },
    { from: 5, to: 6, cap: 3, xloc: "x", yloc: "y" },
];

sd.init(() => {
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
        e.value(new sd.Text(e, lk.cap).fontSize(20), R.pointAtPathByRate(0.5, lk.xloc, lk.yloc));
        e.xloc = lk.xloc;
        e.yloc = lk.yloc;
    });
    graph._.linkType = sd.Curve;
});

sd.main(async () => {
    nodes.forEach(node => {
        const v = graph.element(node.node);
        v.dis = 0;
        const label = new sd.Text(v, "dis=0");
        v.childAs("label", label, R.aside(node.loc));
    });
    const nodeS = graph.element(S);
    while (nodeS.dis < n) {
        await Stream(graph, S, Infinity);
        await sd.pause();
        for (let i = 1; i <= n; i++) {
            const v = graph.element(i);
            const dis = v.child("label");
            const lastDis = +dis.text().slice(4, -1);
            const curDis = +v.dis;
            if (lastDis !== curDis) {
                dis.startAnimate().opacity(0).endAnimate();
                dis.text(`dis=${curDis}`);
                dis.startAnimate().opacity(1).endAnimate();
            }
        }
    }
});

async function flow(graph, edges) {
    await sd.pause();
    let current = 0,
        bottleNeck = Infinity;
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.after(current).stroke(C.red).strokeWidth(2).startAnimate().pointStoT().endAnimate();
        current = e;
        bottleNeck = Math.min(bottleNeck, e.intValue());
    });
    await sd.pause();
    const text = new sd.Text(svg, `瓶颈=${bottleNeck}`)
        .fontSize(25)
        .cx(graph.cx())
        .y(graph.my() + 60);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        const v = e.value();
        const newValue = e.intValue() - bottleNeck;
        v.startAnimate().opacity(0).endAnimate().text(newValue).startAnimate().opacity(1).endAnimate();
    });
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        if (!graph.element(edge.to, edge.from)) {
            graph.newLink(edge.to, edge.from);
            const re = graph.element(edge.to, edge.from);
            re.stroke(C.deepSkyBlue);
            re.startAnimate();
            re.value(bottleNeck, R.pointAtPathByRate(0.5, e.xloc, e.yloc));
            re.pointStoT();
            re.endAnimate();
            re.arrow();
        } else {
            const re = graph.element(edge.to, edge.from);
            const newValue = re.intValue() + bottleNeck;
            const v = re.value();
            v.startAnimate().opacity(0).endAnimate();
            v.text(newValue);
            v.startAnimate().opacity(1).endAnimate();
        }
    });
    await sd.pause();
    edges.forEach(edge => {
        const e = graph.element(edge.from, edge.to);
        e.startAnimate();
        e.strokeWidth(1).stroke(e.xloc ? C.black : C.deepSkyBlue);
        if (e.intValue() === 0) e.strokeDashArray([5, 5]);
        e.endAnimate();
    });
    text.startAnimate().opacity(0).remove();
}

const path = [];
/**
 * @param {sd.GraphBase} graph
 * @param {number|string} u
 * @param {number} lim
 * @returns {Promise<number>}
 */
async function Stream(graph, u, lim) {
    let give = 0;
    if (String(u) === T) {
        await flow(graph, path);
        return lim;
    } else {
        const nodeU = graph.element(u);
        const to = graph.outLinks(u);
        for (let i = 0; i < to.length; i++) {
            const e = to[i];
            const v = e.toNodeId;
            const nodeV = graph.element(v);
            if (e.intValue() > 0 && nodeV.dis + 1 == nodeU.dis) {
                path.push({ from: u, to: v });
                const d = await Stream(graph, v, Math.min(lim, e.intValue()));
                give += d;
                lim -= d;
                path.pop();
                if (graph.element(S).dis === n || !lim) return give;
            }
        }
        if (!--gap[nodeU.dis]) graph.element(S).dis = n;
        gap[++nodeU.dis]++;
        return give;
    }
}
