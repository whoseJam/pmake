import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);
const dis = sd.make1d(100, Infinity);
const vis = sd.make1d(100, false);
const prt = sd.make1d(100, 0);
let n = 6;
const links = [
    [1, 2, 4],
    [2, 4, 2],
    [1, 6, 6],
    [4, 1, 5],
    [5, 6, 3],
    [2, 5, 1],
    [3, 5, 7]
];

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0, 0).newNode(4);
    graph.at(0.5, 0.5).newNode(5);
    graph.at(0.5, 1).newNode(6)
    graph.cx(600).cy(300);
    for (let i = 0; i < links.length; i++) {
        let x = links[i][0];
        let y = links[i][1];
        graph.newLink(x, y, links[i][2]);
        graph.element(x, y).rule(R.PointAtPathByRate(0.5, "x", "y"));
    }
}

async function main() {
    dis[1] = 0;

    for (let i = 1; i <= n; i++) {
        let currentDis = Infinity, currentU = 0;
        for (let u = 1; u <= n; u++) {
            if (currentDis > dis[u] && !vis[u]) {
                currentDis = dis[u];
                currentU = u;
            }
        }
        await sd.pause();
        vis[currentU] = 1;
        graph.startAnimate();
        graph.color(currentU, C.red);
        let link = graph.element(prt[currentU], currentU);
        if (!link) link = graph.element(currentU, prt[currentU]);
        if (link) link.stroke(C.red).strokeWidth(3);
        graph.endAnimate();

        await sd.pause();
        graph.startAnimate().color(currentU, C.blue).endAnimate();

        const out = graph.outLinks(currentU, "undirected");
        for (let i = 0; i < out.length; i++) {
            const v = graph.toNodeId(currentU, out[i]);
            if (dis[v] > out[i].intValue()) {
                dis[v] = out[i].intValue();
                prt[v] = currentU;
            }
        }
    }
}