import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.BipartiteGraph(svg).height(200);
const edges = [
    ["1", "1'"],
    ["1", "2'"],
    ["2", "1'"],
    ["3", "2'"],
    ["4", "3'"],
    ["5", "3'"]
];

init();
main();

function init() {
    for (let i = 1; i <= 5; i++) 
        graph.newNode(`${i}`, `${i}`, 0);
    for (let i = 1; i <= 3; i++) 
        graph.newNode(`${i}'`, `${i}'`, 1);
    for (let i = 0; i < edges.length; i++)
        graph.newLink(edges[i][0], edges[i][1])
}

async function main() {
    await sd.pause();
}