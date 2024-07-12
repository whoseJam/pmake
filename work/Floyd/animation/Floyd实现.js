import * as sd from "@/sd";
import { floyd } from "./Floyd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).n(1).m(1).width(200).height(200).cx(400).cy(300);

init();
main();

function init() {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(0.5, 1).newNode(3);
    graph.at(1, 0.5).newNode(4);
    const data = [
        [1, 2, 3],
        [1, 3, 8],
        [2, 3, 1],
        [2, 4, 6],
        [3, 4, 2]
    ];
    data.forEach(item => {
        graph.newLink(item[0], item[1], item[2]);
        graph.element(item[0], item[1]).arrow();
    });
}

async function main() {
    await floyd(graph);
    await sd.pause();
}