import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(400).height(200).cx(600).cy(300);
const data = [
    [1, 2], [1, 3], [1, 4],
    [2, 4], [2, 5],
    [3, 4], [3, 6],
    [4, 5], [4, 6],
    [5, 6], [5, 7],
    [6, 7]
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
        graph.newLink(link[0], link[1]);
    });
}

init();
main();

async function main() {
    await Bfs(graph);
}

/**
 * @param {sd.GraphBase} graph 
 */
async function Bfs(graph) {
    const Q = [1];
    const getDis = (x) => graph.element(x).child("varList").get("dis");
    const putDis = (x, dis) => graph.element(x).child("varList").put("dis", dis);
    await sd.pause();
    while (Q.length > 0) {
        await sd.pause();
        const u = Q[0];
        Q.shift();
        graph.startAnimate().color(u, C.blue).endAnimate();
        const to = graph.outNodes(u, "undirect");
        for (let v of to) {
            if (getDis(v.nodeId) === Infinity) {
                await sd.pause();
                graph.startAnimate().color(v.nodeId, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(v.nodeId, getDis(u) + 1);
                graph.endAnimate();
                Q.push(v.nodeId);
                await sd.pause();
                graph.startAnimate().color(v.nodeId, C.white).endAnimate();
            }
        }
        await sd.pause();
        graph.startAnimate().color(u, C.grey).endAnimate();
    }
    
}