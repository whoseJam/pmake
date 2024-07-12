import * as sd from "@/sd";
import { toposort } from "./拓扑排序";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.DAG(svg);   // type: Node
const nodes = [0, 1, 2, 3, 4, 5, 6, 7];
const links = [
    [0, 2], [1, 2],
    [1, 3], [2, 3],
    [3, 4],
    [3, 5], [7, 5],
    [0, 6],
    [6, 7]
];

init();
main();

function init() {
    for (let i = 0; i < nodes.length; i++) {
        graph.newNode(nodes[i]);
        graph.element(nodes[i]);
    }
    for (let i = 0; i < links.length; i++) {
        const x = links[i][0];
        const y = links[i][1];
        graph.newLink(x, y);
        graph.element(x, y).arrow();
    }
    graph.cx(600).cy(300);
}

async function main() {
    await toposort(graph, 40);
    await sd.pause();
}