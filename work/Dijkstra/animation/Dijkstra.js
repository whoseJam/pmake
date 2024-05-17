import * as sd from "@/slide";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(400).height(200).cx(600).cy(300);
const data = [
    [1, 2, 12], [1, 3, 14], [1, 4, 16],
    [2, 4, 7], [2, 5, 10],
    [3, 4, 9], [3, 6, 8],
    [4, 5, 6], [4, 6, 2],
    [5, 6, 5], [5, 7, 3],
    [6, 7, 4]
];

function init() {
    graph.at(0.5, 0).newNode(1); graph.element(1).childAs("varList", new sd.VarList(svg).put("dis", 0), R.Aside("lc"));
    graph.at(0, 0.25).newNode(2); graph.element(2).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("tc"));
    graph.at(1, 0.25).newNode(3); graph.element(3).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("bc"));
    graph.at(0.5, 0.5).newNode(4); graph.element(4).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("rc"));
    graph.at(0, 0.75).newNode(5); graph.element(5).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("tc"));
    graph.at(1, 0.75).newNode(6); graph.element(6).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("bc"));
    graph.at(0.5, 1).newNode(7); graph.element(7).childAs("varList", new sd.VarList(svg).put("dis", Infinity), R.Aside("rc"));
    data.forEach(link => {
        graph.newLink(link[0], link[1], link[2]);
    });
    graph.element(5, 6).rule(R.PointAtPathByRate(0.25));
}

init();
main();

async function main() {
    await Dijkstra(graph);
}

/**
 * @param {sd.GraphBase} graph 
 */
async function Dijkstra(graph) {
    const getDis = (x) => graph.element(x).child("varList").get("dis");
    const putDis = (x, dis) => graph.element(x).child("varList").put("dis", dis);
    const n = graph.nodes().length;
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        let u, disu = Infinity;
        for (let j = 1; j <= n; j++) {
            if (graph.element(j).vis) continue;
            if (disu > getDis(j)) {
                disu = getDis(j);
                u = j;
            }
        }
        graph.element(u).vis = true;
        graph.startAnimate().color(u, C.blue).endAnimate();
        const outLinks = graph.outLinks(u, "undirect");
        for (let link of outLinks) {
            const v = graph.toNodeId(u, link);
            if (getDis(v) > getDis(u) + link.intValue()) {
                await sd.pause();
                graph.startAnimate().color(v, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(v, getDis(u) + link.intValue());
                graph.endAnimate();
                await sd.pause();
                graph.startAnimate().color(v, C.white).endAnimate();
            }
        }
        await sd.pause();
        graph.startAnimate().color(u, C.grey).endAnimate();
    }
}