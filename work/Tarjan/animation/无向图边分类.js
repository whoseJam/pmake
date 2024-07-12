import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).height(150).width(500).cx(400).cy(300);
const data = [
    [1, 2], [2, 3], [3, 4], [4, 5],
    [2, 6], [6, 7], [6, 1]
];

init();
main();

function init() {
    graph.at(0, 0).newNode(1);
    graph.at(0, 0.25).newNode(2);
    graph.at(0, 0.5).newNode(3);
    graph.at(0, 0.75).newNode(4);
    graph.at(0, 1).newNode(5);
    graph.at(1, 0.33).newNode(6);
    graph.at(1, 0.66).newNode(7);
    data.forEach(link => {
        graph.newLink(link[0], link[1]);
    });
    graph._.linkType = sd.Curve;
    graph.newLink(5, 2);
    graph.newLink(4, 2);
}

async function main() {
    await 边分类Tarjan(graph);
    await sd.pause();
}

/**
 * @param {sd.GraphBase} graph 
 */
async function 边分类Tarjan(graph) {
    const nodesId = graph.nodesId();
    const focus = sd.Focus(graph);
    const low = new sd.VarList(svg);
    const dfn = new sd.VarList(svg);
    for (let id of nodesId) {
        low.put(`low[${id}]`, 0);
        dfn.put(`dfn[${id}]`, 0);
    }
    low.x(graph.mx() + 80).cy(graph.cy());
    dfn.x(low.mx() + 50).cy(graph.cy());

    const mark = (u, color) => {
        const originColor = u.fill();
        u.startAnimate().fill(color).endAnimate();
        return () => {
            u.startAnimate().fill(originColor).endAnimate();
        }
    }

    const linkTo = (u, v, line, color = C.black) => {
        if (line.fromNodeId === u.nodeId) line.stroke(color).startAnimate().pointStoT().endAnimate().arrow();
        else line.stroke(color).startAnimate().pointTtoS().endAnimate().revArrow();
    }

    let tot = 0;
    async function tarjan(u) {
        await sd.pause();
        focus.startAnimate().focus(u.nodeId).endAnimate();
        await sd.pause();
        u.low = u.dfn = ++tot;
        low.startAnimate().put(`low[${u.nodeId}]`, tot).endAnimate();
        dfn.startAnimate().put(`dfn[${u.nodeId}]`, tot).endAnimate();
        graph.startAnimate().color(u.nodeId, C.blue).endAnimate();
        const to = graph.outLinks(u.nodeId, "undirect");
        for (let i = 0, v; i < to.length; i++) {
            const link = to[i];
            v = graph.findNodeById(graph.toNodeId(u.nodeId, link));
            if (v === u.prt) continue;
            if (!v.dfn) {
                await sd.pause();
                linkTo(u, v, link);
                v.prt = u;
                await tarjan(v);
                await sd.pause();
                focus.startAnimate().focus(u.nodeId).endAnimate();
                if (u.low > v.low) {
                    await sd.pause();
                    const recover = mark(v, C.orange);
                    await sd.pause();
                    u.low = v.low;
                    low.startAnimate().put(`low[${u.nodeId}]`, u.low).endAnimate();
                    await sd.pause();
                    recover();
                }
            } else {
                if (v.dfn <= u.dfn) {
                    await sd.pause();
                    linkTo(u, v, link, C.red);
                }
                if (u.low > v.dfn) {
                    await sd.pause();
                    const recover = mark(v, C.orange);
                    await sd.pause();
                    u.low = v.dfn;
                    low.startAnimate().put(`low[${u.nodeId}]`, u.low).endAnimate();
                    await sd.pause();
                    recover();
                }
            }
        }
        await sd.pause();
        graph.startAnimate().color(u.nodeId, C.grey).endAnimate();
    }
    await tarjan(graph.findNodeById(1));
    focus.startAnimate().focus(null).endAnimate();
}