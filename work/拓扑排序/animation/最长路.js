import * as sd from "../../../lib/slide";
import { toposort } from "./拓扑排序";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).n(1).m(1);
const varList = new sd.VarList(svg);
const links = [
    [1, 2, 2],
    [1, 3, 3],
    [2, 3, 4],
    [3, 4, 1],
    [2, 4, 2],
    [2, 5, 2],
    [4, 5, 1]
];

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(0.5, 1).newNode(3);
    graph.at(1, 1).newNode(4);
    graph.at(1, 0).newNode(5);
    varList.fontSize(25);
    for (let i = 1; i <= 5; i++)
        varList.put(`dis[${i}]`, 0);
    for (let i = 0; i < links.length; i++) {
        const x = links[i][0];
        const y = links[i][1];
        const w = links[i][2];
        graph.newLink(x, y, w);
        graph.element(x, y).arrow();
    }
    graph.cx(600).cy(300);
    varList.x(graph.mx() + 50).y(graph.y());
}

async function main() {
    await toposort(graph, 40, async function callback(link) {
        await sd.pause();
        link.stroke(C.red).arrow(false);
        link.startAnimate().pointStoT().endAnimate().arrow(true);
        await sd.pause();
        const disv = varList.get(`dis[${link.toNodeId}]`);
        const disu = varList.get(`dis[${link.fromNodeId}]`);
        const w = +link.value().text();
        const result = Math.max(disv, disu + w);
        varList.startAnimate().put(`dis[${link.toNodeId}]`, result);
    });
    await sd.pause();
}
